---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 523
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 523 of 552)

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

---[FILE: src/vs/workbench/services/label/test/browser/label.test.ts]---
Location: vscode-main/src/vs/workbench/services/label/test/browser/label.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as resources from '../../../../../base/common/resources.js';
import assert from 'assert';
import { TestEnvironmentService, TestLifecycleService, TestPathService, TestRemoteAgentService } from '../../../../test/browser/workbenchTestServices.js';
import { URI } from '../../../../../base/common/uri.js';
import { LabelService } from '../../common/labelService.js';
import { TestContextService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { WorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { TestWorkspace, Workspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { Memento } from '../../../../common/memento.js';
import { ResourceLabelFormatter } from '../../../../../platform/label/common/label.js';
import { sep } from '../../../../../base/common/path.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

suite('URI Label', () => {
	let labelService: LabelService;
	let storageService: TestStorageService;

	setup(() => {
		storageService = new TestStorageService();
		labelService = new LabelService(TestEnvironmentService, new TestContextService(), new TestPathService(URI.file('/foobar')), new TestRemoteAgentService(), storageService, new TestLifecycleService());
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('custom scheme', function () {
		labelService.registerFormatter({
			scheme: 'vscode',
			formatting: {
				label: 'LABEL/${path}/${authority}/END',
				separator: '/',
				tildify: true,
				normalizeDriveLetter: true
			}
		});

		const uri1 = URI.parse('vscode://microsoft.com/1/2/3/4/5');
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: false }), 'LABEL//1/2/3/4/5/microsoft.com/END');
		assert.strictEqual(labelService.getUriBasenameLabel(uri1), 'END');
	});

	test('file scheme', function () {
		labelService.registerFormatter({
			scheme: 'file',
			formatting: {
				label: '${path}',
				separator: sep,
				tildify: !isWindows,
				normalizeDriveLetter: isWindows
			}
		});

		const uri1 = TestWorkspace.folders[0].uri.with({ path: TestWorkspace.folders[0].uri.path.concat('/a/b/c/d') });
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: true }), isWindows ? 'a\\b\\c\\d' : 'a/b/c/d');
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: false }), isWindows ? 'C:\\testWorkspace\\a\\b\\c\\d' : '/testWorkspace/a/b/c/d');
		assert.strictEqual(labelService.getUriBasenameLabel(uri1), 'd');

		const uri2 = URI.file('c:\\1/2/3');
		assert.strictEqual(labelService.getUriLabel(uri2, { relative: false }), isWindows ? 'C:\\1\\2\\3' : '/c:\\1/2/3');
		assert.strictEqual(labelService.getUriBasenameLabel(uri2), '3');
	});

	test('separator', function () {
		labelService.registerFormatter({
			scheme: 'vscode',
			formatting: {
				label: 'LABEL\\${path}\\${authority}\\END',
				separator: '\\',
				tildify: true,
				normalizeDriveLetter: true
			}
		});

		const uri1 = URI.parse('vscode://microsoft.com/1/2/3/4/5');
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: false }), 'LABEL\\\\1\\2\\3\\4\\5\\microsoft.com\\END');
		assert.strictEqual(labelService.getUriBasenameLabel(uri1), 'END');
	});

	test('custom authority', function () {
		labelService.registerFormatter({
			scheme: 'vscode',
			authority: 'micro*',
			formatting: {
				label: 'LABEL/${path}/${authority}/END',
				separator: '/'
			}
		});

		const uri1 = URI.parse('vscode://microsoft.com/1/2/3/4/5');
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: false }), 'LABEL//1/2/3/4/5/microsoft.com/END');
		assert.strictEqual(labelService.getUriBasenameLabel(uri1), 'END');
	});

	test('mulitple authority', function () {
		labelService.registerFormatter({
			scheme: 'vscode',
			authority: 'not_matching_but_long',
			formatting: {
				label: 'first',
				separator: '/'
			}
		});
		labelService.registerFormatter({
			scheme: 'vscode',
			authority: 'microsof*',
			formatting: {
				label: 'second',
				separator: '/'
			}
		});
		labelService.registerFormatter({
			scheme: 'vscode',
			authority: 'mi*',
			formatting: {
				label: 'third',
				separator: '/'
			}
		});

		// Make sure the most specific authority is picked
		const uri1 = URI.parse('vscode://microsoft.com/1/2/3/4/5');
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: false }), 'second');
		assert.strictEqual(labelService.getUriBasenameLabel(uri1), 'second');
	});

	test('custom query', function () {
		labelService.registerFormatter({
			scheme: 'vscode',
			formatting: {
				label: 'LABEL${query.prefix}: ${query.path}/END',
				separator: '/',
				tildify: true,
				normalizeDriveLetter: true
			}
		});

		const uri1 = URI.parse(`vscode://microsoft.com/1/2/3/4/5?${encodeURIComponent(JSON.stringify({ prefix: 'prefix', path: 'path' }))}`);
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: false }), 'LABELprefix: path/END');
	});

	test('custom query without value', function () {
		labelService.registerFormatter({
			scheme: 'vscode',
			formatting: {
				label: 'LABEL${query.prefix}: ${query.path}/END',
				separator: '/',
				tildify: true,
				normalizeDriveLetter: true
			}
		});

		const uri1 = URI.parse(`vscode://microsoft.com/1/2/3/4/5?${encodeURIComponent(JSON.stringify({ path: 'path' }))}`);
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: false }), 'LABEL: path/END');
	});

	test('custom query without query json', function () {
		labelService.registerFormatter({
			scheme: 'vscode',
			formatting: {
				label: 'LABEL${query.prefix}: ${query.path}/END',
				separator: '/',
				tildify: true,
				normalizeDriveLetter: true
			}
		});

		const uri1 = URI.parse('vscode://microsoft.com/1/2/3/4/5?path=foo');
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: false }), 'LABEL: /END');
	});

	test('custom query without query', function () {
		labelService.registerFormatter({
			scheme: 'vscode',
			formatting: {
				label: 'LABEL${query.prefix}: ${query.path}/END',
				separator: '/',
				tildify: true,
				normalizeDriveLetter: true
			}
		});

		const uri1 = URI.parse('vscode://microsoft.com/1/2/3/4/5');
		assert.strictEqual(labelService.getUriLabel(uri1, { relative: false }), 'LABEL: /END');
	});


	test('label caching', () => {
		const m = new Memento('cachedResourceLabelFormatters2', storageService).getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		const makeFormatter = (scheme: string): ResourceLabelFormatter => ({ formatting: { label: `\${path} (${scheme})`, separator: '/' }, scheme });
		assert.deepStrictEqual(m, {});

		// registers a new formatter:
		labelService.registerCachedFormatter(makeFormatter('a'));
		assert.deepStrictEqual(m, { formatters: [makeFormatter('a')] });

		// registers a 2nd formatter:
		labelService.registerCachedFormatter(makeFormatter('b'));
		assert.deepStrictEqual(m, { formatters: [makeFormatter('b'), makeFormatter('a')] });

		// promotes a formatter on re-register:
		labelService.registerCachedFormatter(makeFormatter('a'));
		assert.deepStrictEqual(m, { formatters: [makeFormatter('a'), makeFormatter('b')] });

		// no-ops if already in first place:
		labelService.registerCachedFormatter(makeFormatter('a'));
		assert.deepStrictEqual(m, { formatters: [makeFormatter('a'), makeFormatter('b')] });

		// limits the cache:
		for (let i = 0; i < 100; i++) {
			labelService.registerCachedFormatter(makeFormatter(`i${i}`));
		}
		const expected: ResourceLabelFormatter[] = [];
		for (let i = 50; i < 100; i++) {
			expected.unshift(makeFormatter(`i${i}`));
		}
		assert.deepStrictEqual(m, { formatters: expected });

		delete (m as { formatters: unknown }).formatters;
	});
});


suite('multi-root workspace', () => {
	let labelService: LabelService;
	const disposables = new DisposableStore();

	setup(() => {
		const sources = URI.file('folder1/src');
		const tests = URI.file('folder1/test');
		const other = URI.file('folder2');

		labelService = disposables.add(new LabelService(
			TestEnvironmentService,
			new TestContextService(
				new Workspace('test-workspace', [
					new WorkspaceFolder({ uri: sources, index: 0, name: 'Sources' }),
					new WorkspaceFolder({ uri: tests, index: 1, name: 'Tests' }),
					new WorkspaceFolder({ uri: other, index: 2, name: resources.basename(other) }),
				])),
			new TestPathService(),
			new TestRemoteAgentService(),
			disposables.add(new TestStorageService()),
			disposables.add(new TestLifecycleService())
		));
	});

	teardown(() => {
		disposables.clear();
	});

	test('labels of files in multiroot workspaces are the foldername followed by offset from the folder', () => {
		labelService.registerFormatter({
			scheme: 'file',
			formatting: {
				label: '${authority}${path}',
				separator: '/',
				tildify: false,
				normalizeDriveLetter: false,
				authorityPrefix: '//',
				workspaceSuffix: ''
			}
		});

		const tests = {
			'folder1/src/file': 'Sources • file',
			'folder1/src/folder/file': 'Sources • folder/file',
			'folder1/src': 'Sources',
			'folder1/other': '/folder1/other',
			'folder2/other': 'folder2 • other',
		};

		Object.entries(tests).forEach(([path, label]) => {
			const generated = labelService.getUriLabel(URI.file(path), { relative: true });
			assert.strictEqual(generated, label);
		});
	});

	test('labels with context after path', () => {
		labelService.registerFormatter({
			scheme: 'file',
			formatting: {
				label: '${path} (${scheme})',
				separator: '/',
			}
		});

		const tests = {
			'folder1/src/file': 'Sources • file (file)',
			'folder1/src/folder/file': 'Sources • folder/file (file)',
			'folder1/src': 'Sources',
			'folder1/other': '/folder1/other (file)',
			'folder2/other': 'folder2 • other (file)',
		};

		Object.entries(tests).forEach(([path, label]) => {
			const generated = labelService.getUriLabel(URI.file(path), { relative: true });
			assert.strictEqual(generated, label, path);
		});
	});

	test('stripPathStartingSeparator', () => {
		labelService.registerFormatter({
			scheme: 'file',
			formatting: {
				label: '${path}',
				separator: '/',
				stripPathStartingSeparator: true
			}
		});

		const tests = {
			'folder1/src/file': 'Sources • file',
			'other/blah': 'other/blah',
		};

		Object.entries(tests).forEach(([path, label]) => {
			const generated = labelService.getUriLabel(URI.file(path), { relative: true });
			assert.strictEqual(generated, label, path);
		});
	});

	test('relative label without formatter', () => {
		const rootFolder = URI.parse('myscheme://myauthority/');

		labelService = disposables.add(new LabelService(
			TestEnvironmentService,
			new TestContextService(
				new Workspace('test-workspace', [
					new WorkspaceFolder({ uri: rootFolder, index: 0, name: 'FSProotFolder' }),
				])),
			new TestPathService(undefined, rootFolder.scheme),
			new TestRemoteAgentService(),
			disposables.add(new TestStorageService()),
			disposables.add(new TestLifecycleService())
		));

		const generated = labelService.getUriLabel(URI.parse('myscheme://myauthority/some/folder/test.txt'), { relative: true });
		if (isWindows) {
			assert.strictEqual(generated, 'some\\folder\\test.txt');
		} else {
			assert.strictEqual(generated, 'some/folder/test.txt');
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});

suite('workspace at FSP root', () => {
	let labelService: LabelService;

	setup(() => {
		const rootFolder = URI.parse('myscheme://myauthority/');

		labelService = new LabelService(
			TestEnvironmentService,
			new TestContextService(
				new Workspace('test-workspace', [
					new WorkspaceFolder({ uri: rootFolder, index: 0, name: 'FSProotFolder' }),
				])),
			new TestPathService(),
			new TestRemoteAgentService(),
			new TestStorageService(),
			new TestLifecycleService()
		);
		labelService.registerFormatter({
			scheme: 'myscheme',
			formatting: {
				label: '${scheme}://${authority}${path}',
				separator: '/',
				tildify: false,
				normalizeDriveLetter: false,
				workspaceSuffix: '',
				authorityPrefix: '',
				stripPathStartingSeparator: false
			}
		});
	});

	test('non-relative label', () => {

		const tests = {
			'myscheme://myauthority/myFile1.txt': 'myscheme://myauthority/myFile1.txt',
			'myscheme://myauthority/folder/myFile2.txt': 'myscheme://myauthority/folder/myFile2.txt',
		};

		Object.entries(tests).forEach(([uriString, label]) => {
			const generated = labelService.getUriLabel(URI.parse(uriString), { relative: false });
			assert.strictEqual(generated, label);
		});
	});

	test('relative label', () => {

		const tests = {
			'myscheme://myauthority/myFile1.txt': 'myFile1.txt',
			'myscheme://myauthority/folder/myFile2.txt': 'folder/myFile2.txt',
		};

		Object.entries(tests).forEach(([uriString, label]) => {
			const generated = labelService.getUriLabel(URI.parse(uriString), { relative: true });
			assert.strictEqual(generated, label);
		});
	});

	test('relative label with explicit path separator', () => {
		let generated = labelService.getUriLabel(URI.parse('myscheme://myauthority/some/folder/test.txt'), { relative: true, separator: '/' });
		assert.strictEqual(generated, 'some/folder/test.txt');

		generated = labelService.getUriLabel(URI.parse('myscheme://myauthority/some/folder/test.txt'), { relative: true, separator: '\\' });
		assert.strictEqual(generated, 'some\\folder\\test.txt');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/label/test/common/mockLabelService.ts]---
Location: vscode-main/src/vs/workbench/services/label/test/common/mockLabelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { basename, normalize } from '../../../../../base/common/path.js';
import { URI } from '../../../../../base/common/uri.js';
import { IFormatterChangeEvent, ILabelService, ResourceLabelFormatter, Verbosity } from '../../../../../platform/label/common/label.js';
import { IWorkspace, IWorkspaceIdentifier } from '../../../../../platform/workspace/common/workspace.js';

export class MockLabelService implements ILabelService {
	_serviceBrand: undefined;

	registerCachedFormatter(formatter: ResourceLabelFormatter): IDisposable {
		throw new Error('Method not implemented.');
	}
	getUriLabel(resource: URI, options?: { relative?: boolean | undefined; noPrefix?: boolean | undefined }): string {
		return normalize(resource.fsPath);
	}
	getUriBasenameLabel(resource: URI): string {
		return basename(resource.fsPath);
	}
	getWorkspaceLabel(workspace: URI | IWorkspaceIdentifier | IWorkspace, options?: { verbose: Verbosity }): string {
		return '';
	}
	getHostLabel(scheme: string, authority?: string): string {
		return '';
	}
	public getHostTooltip(): string | undefined {
		return '';
	}
	getSeparator(scheme: string, authority?: string): '/' | '\\' {
		return '/';
	}
	registerFormatter(formatter: ResourceLabelFormatter): IDisposable {
		return Disposable.None;
	}
	readonly onDidChangeFormatters: Event<IFormatterChangeEvent> = new Emitter<IFormatterChangeEvent>().event;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/language/common/languageService.ts]---
Location: vscode-main/src/vs/workbench/services/language/common/languageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { clearConfiguredLanguageAssociations, registerConfiguredLanguageAssociation } from '../../../../editor/common/services/languagesAssociations.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ILanguageExtensionPoint, ILanguageService } from '../../../../editor/common/languages/language.js';
import { LanguageService } from '../../../../editor/common/services/languageService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { FILES_ASSOCIATIONS_CONFIG, IFilesConfiguration } from '../../../../platform/files/common/files.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { ExtensionMessageCollector, ExtensionsRegistry, IExtensionPoint, IExtensionPointUser } from '../../extensions/common/extensionsRegistry.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Extensions, IExtensionFeatureTableRenderer, IExtensionFeaturesRegistry, IRenderedData, IRowData, ITableData } from '../../extensionManagement/common/extensionFeatures.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { index } from '../../../../base/common/arrays.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { isString } from '../../../../base/common/types.js';

export interface IRawLanguageExtensionPoint {
	id: string;
	extensions: string[];
	filenames: string[];
	filenamePatterns: string[];
	firstLine: string;
	aliases: string[];
	mimetypes: string[];
	configuration: string;
	icon: { light: string; dark: string };
}

export const languagesExtPoint: IExtensionPoint<IRawLanguageExtensionPoint[]> = ExtensionsRegistry.registerExtensionPoint<IRawLanguageExtensionPoint[]>({
	extensionPoint: 'languages',
	jsonSchema: {
		description: localize('vscode.extension.contributes.languages', 'Contributes language declarations.'),
		type: 'array',
		items: {
			type: 'object',
			defaultSnippets: [{ body: { id: '${1:languageId}', aliases: ['${2:label}'], extensions: ['${3:extension}'], configuration: './language-configuration.json' } }],
			properties: {
				id: {
					description: localize('vscode.extension.contributes.languages.id', 'ID of the language.'),
					type: 'string'
				},
				aliases: {
					description: localize('vscode.extension.contributes.languages.aliases', 'Name aliases for the language.'),
					type: 'array',
					items: {
						type: 'string'
					}
				},
				extensions: {
					description: localize('vscode.extension.contributes.languages.extensions', 'File extensions associated to the language.'),
					default: ['.foo'],
					type: 'array',
					items: {
						type: 'string'
					}
				},
				filenames: {
					description: localize('vscode.extension.contributes.languages.filenames', 'File names associated to the language.'),
					type: 'array',
					items: {
						type: 'string'
					}
				},
				filenamePatterns: {
					description: localize('vscode.extension.contributes.languages.filenamePatterns', 'File name glob patterns associated to the language.'),
					type: 'array',
					items: {
						type: 'string'
					}
				},
				mimetypes: {
					description: localize('vscode.extension.contributes.languages.mimetypes', 'Mime types associated to the language.'),
					type: 'array',
					items: {
						type: 'string'
					}
				},
				firstLine: {
					description: localize('vscode.extension.contributes.languages.firstLine', 'A regular expression matching the first line of a file of the language.'),
					type: 'string'
				},
				configuration: {
					description: localize('vscode.extension.contributes.languages.configuration', 'A relative path to a file containing configuration options for the language.'),
					type: 'string',
					default: './language-configuration.json'
				},
				icon: {
					type: 'object',
					description: localize('vscode.extension.contributes.languages.icon', 'A icon to use as file icon, if no icon theme provides one for the language.'),
					properties: {
						light: {
							description: localize('vscode.extension.contributes.languages.icon.light', 'Icon path when a light theme is used'),
							type: 'string'
						},
						dark: {
							description: localize('vscode.extension.contributes.languages.icon.dark', 'Icon path when a dark theme is used'),
							type: 'string'
						}
					}
				}
			}
		}
	},
	activationEventsGenerator: function* (languageContributions) {
		for (const languageContribution of languageContributions) {
			if (languageContribution.id && languageContribution.configuration) {
				yield `onLanguage:${languageContribution.id}`;
			}
		}
	}
});

class LanguageTableRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.languages;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const contributes = manifest.contributes;
		const rawLanguages = contributes?.languages || [];
		const languages: { id: string; name: string; extensions: string[]; hasGrammar: boolean; hasSnippets: boolean }[] = [];
		for (const l of rawLanguages) {
			if (isValidLanguageExtensionPoint(l)) {
				languages.push({
					id: l.id,
					name: (l.aliases || [])[0] || l.id,
					extensions: l.extensions || [],
					hasGrammar: false,
					hasSnippets: false
				});
			}
		}
		const byId = index(languages, l => l.id);

		const grammars = contributes?.grammars || [];
		grammars.forEach(grammar => {
			if (!isString(grammar.language)) {
				// ignore the grammars that are only used as includes in other grammars
				return;
			}
			let language = byId[grammar.language];

			if (language) {
				language.hasGrammar = true;
			} else {
				language = { id: grammar.language, name: grammar.language, extensions: [], hasGrammar: true, hasSnippets: false };
				byId[language.id] = language;
				languages.push(language);
			}
		});

		const snippets = contributes?.snippets || [];
		snippets.forEach(snippet => {
			if (!isString(snippet.language)) {
				// ignore invalid snippets
				return;
			}
			let language = byId[snippet.language];

			if (language) {
				language.hasSnippets = true;
			} else {
				language = { id: snippet.language, name: snippet.language, extensions: [], hasGrammar: false, hasSnippets: true };
				byId[language.id] = language;
				languages.push(language);
			}
		});

		if (!languages.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			localize('language id', "ID"),
			localize('language name', "Name"),
			localize('file extensions', "File Extensions"),
			localize('grammar', "Grammar"),
			localize('snippets', "Snippets")
		];
		const rows: IRowData[][] = languages.sort((a, b) => a.id.localeCompare(b.id))
			.map(l => {
				return [
					l.id, l.name,
					new MarkdownString().appendMarkdown(`${l.extensions.map(e => `\`${e}\``).join('&nbsp;')}`),
					l.hasGrammar ? '✔︎' : '\u2014',
					l.hasSnippets ? '✔︎' : '\u2014'
				];
			});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'languages',
	label: localize('languages', "Programming Languages"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(LanguageTableRenderer),
});

export class WorkbenchLanguageService extends LanguageService {
	private _configurationService: IConfigurationService;
	private _extensionService: IExtensionService;

	constructor(
		@IExtensionService extensionService: IExtensionService,
		@IConfigurationService configurationService: IConfigurationService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ILogService private readonly logService: ILogService
	) {
		super(environmentService.verbose || environmentService.isExtensionDevelopment || !environmentService.isBuilt);
		this._configurationService = configurationService;
		this._extensionService = extensionService;

		languagesExtPoint.setHandler((extensions: readonly IExtensionPointUser<IRawLanguageExtensionPoint[]>[]) => {
			const allValidLanguages: ILanguageExtensionPoint[] = [];

			for (let i = 0, len = extensions.length; i < len; i++) {
				const extension = extensions[i];

				if (!Array.isArray(extension.value)) {
					extension.collector.error(localize('invalid', "Invalid `contributes.{0}`. Expected an array.", languagesExtPoint.name));
					continue;
				}

				for (let j = 0, lenJ = extension.value.length; j < lenJ; j++) {
					const ext = extension.value[j];
					if (isValidLanguageExtensionPoint(ext, extension.collector)) {
						let configuration: URI | undefined = undefined;
						if (ext.configuration) {
							configuration = joinPath(extension.description.extensionLocation, ext.configuration);
						}
						allValidLanguages.push({
							id: ext.id,
							extensions: ext.extensions,
							filenames: ext.filenames,
							filenamePatterns: ext.filenamePatterns,
							firstLine: ext.firstLine,
							aliases: ext.aliases,
							mimetypes: ext.mimetypes,
							configuration: configuration,
							icon: ext.icon && {
								light: joinPath(extension.description.extensionLocation, ext.icon.light),
								dark: joinPath(extension.description.extensionLocation, ext.icon.dark)
							}
						});
					}
				}
			}

			this._registry.setDynamicLanguages(allValidLanguages);

		});

		this.updateMime();
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(FILES_ASSOCIATIONS_CONFIG)) {
				this.updateMime();
			}
		}));
		this._extensionService.whenInstalledExtensionsRegistered().then(() => {
			this.updateMime();
		});

		this._register(this.onDidRequestRichLanguageFeatures((languageId) => {
			// extension activation
			this._extensionService.activateByEvent(`onLanguage:${languageId}`);
			this._extensionService.activateByEvent(`onLanguage`);
		}));
	}

	private updateMime(): void {
		const configuration = this._configurationService.getValue<IFilesConfiguration>();

		// Clear user configured mime associations
		clearConfiguredLanguageAssociations();

		// Register based on settings
		if (configuration.files?.associations) {
			Object.keys(configuration.files.associations).forEach(pattern => {
				const langId = configuration.files!.associations[pattern];
				if (typeof langId !== 'string') {
					this.logService.warn(`Ignoring configured 'files.associations' for '${pattern}' because its type is not a string but '${typeof langId}'`);

					return; // https://github.com/microsoft/vscode/issues/147284
				}

				const mimeType = this.getMimeType(langId) || `text/x-${langId}`;

				registerConfiguredLanguageAssociation({ id: langId, mime: mimeType, filepattern: pattern });
			});
		}

		this._onDidChange.fire();
	}
}

function isUndefinedOrStringArray(value: string[]): boolean {
	if (typeof value === 'undefined') {
		return true;
	}
	if (!Array.isArray(value)) {
		return false;
	}
	return value.every(item => typeof item === 'string');
}

function isValidLanguageExtensionPoint(value: any, collector?: ExtensionMessageCollector): value is IRawLanguageExtensionPoint {
	if (!value) {
		collector?.error(localize('invalid.empty', "Empty value for `contributes.{0}`", languagesExtPoint.name));
		return false;
	}
	if (typeof value.id !== 'string') {
		collector?.error(localize('require.id', "property `{0}` is mandatory and must be of type `string`", 'id'));
		return false;
	}
	if (!isUndefinedOrStringArray(value.extensions)) {
		collector?.error(localize('opt.extensions', "property `{0}` can be omitted and must be of type `string[]`", 'extensions'));
		return false;
	}
	if (!isUndefinedOrStringArray(value.filenames)) {
		collector?.error(localize('opt.filenames', "property `{0}` can be omitted and must be of type `string[]`", 'filenames'));
		return false;
	}
	if (typeof value.firstLine !== 'undefined' && typeof value.firstLine !== 'string') {
		collector?.error(localize('opt.firstLine', "property `{0}` can be omitted and must be of type `string`", 'firstLine'));
		return false;
	}
	if (typeof value.configuration !== 'undefined' && typeof value.configuration !== 'string') {
		collector?.error(localize('opt.configuration', "property `{0}` can be omitted and must be of type `string`", 'configuration'));
		return false;
	}
	if (!isUndefinedOrStringArray(value.aliases)) {
		collector?.error(localize('opt.aliases', "property `{0}` can be omitted and must be of type `string[]`", 'aliases'));
		return false;
	}
	if (!isUndefinedOrStringArray(value.mimetypes)) {
		collector?.error(localize('opt.mimetypes', "property `{0}` can be omitted and must be of type `string[]`", 'mimetypes'));
		return false;
	}
	if (typeof value.icon !== 'undefined') {
		if (typeof value.icon !== 'object' || typeof value.icon.light !== 'string' || typeof value.icon.dark !== 'string') {
			collector?.error(localize('opt.icon', "property `{0}` can be omitted and must be of type `object` with properties `{1}` and `{2}` of type `string`", 'icon', 'light', 'dark'));
			return false;
		}
	}
	return true;
}

registerSingleton(ILanguageService, WorkbenchLanguageService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/languageDetection/browser/languageDetectionWebWorker.ts]---
Location: vscode-main/src/vs/workbench/services/languageDetection/browser/languageDetectionWebWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ModelOperations, ModelResult } from '@vscode/vscode-languagedetection';
import { importAMDNodeModule } from '../../../../amdX.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { IWebWorkerServerRequestHandler, IWebWorkerServer } from '../../../../base/common/worker/webWorker.js';
import { LanguageDetectionWorkerHost, ILanguageDetectionWorker } from './languageDetectionWorker.protocol.js';
import { WorkerTextModelSyncServer } from '../../../../editor/common/services/textModelSync/textModelSync.impl.js';

type RegexpModel = { detect: (inp: string, langBiases: Record<string, number>, supportedLangs?: string[]) => string | undefined };

export function create(workerServer: IWebWorkerServer): IWebWorkerServerRequestHandler {
	return new LanguageDetectionWorker(workerServer);
}

/**
 * @internal
 */
export class LanguageDetectionWorker implements ILanguageDetectionWorker {
	_requestHandlerBrand: void = undefined;

	private static readonly expectedRelativeConfidence = 0.2;
	private static readonly positiveConfidenceCorrectionBucket1 = 0.05;
	private static readonly positiveConfidenceCorrectionBucket2 = 0.025;
	private static readonly negativeConfidenceCorrection = 0.5;

	private readonly _workerTextModelSyncServer = new WorkerTextModelSyncServer();

	private readonly _host: LanguageDetectionWorkerHost;
	private _regexpModel: RegexpModel | undefined;
	private _regexpLoadFailed: boolean = false;

	private _modelOperations: ModelOperations | undefined;
	private _loadFailed: boolean = false;

	private modelIdToCoreId = new Map<string, string | undefined>();

	constructor(workerServer: IWebWorkerServer) {
		this._host = LanguageDetectionWorkerHost.getChannel(workerServer);
		this._workerTextModelSyncServer.bindToServer(workerServer);
	}

	public async $detectLanguage(uri: string, langBiases: Record<string, number> | undefined, preferHistory: boolean, supportedLangs?: string[]): Promise<string | undefined> {
		const languages: string[] = [];
		const confidences: number[] = [];
		const stopWatch = new StopWatch();
		const documentTextSample = this.getTextForDetection(uri);
		if (!documentTextSample) { return; }

		const neuralResolver = async () => {
			for await (const language of this.detectLanguagesImpl(documentTextSample)) {
				if (!this.modelIdToCoreId.has(language.languageId)) {
					this.modelIdToCoreId.set(language.languageId, await this._host.$getLanguageId(language.languageId));
				}
				const coreId = this.modelIdToCoreId.get(language.languageId);
				if (coreId && (!supportedLangs?.length || supportedLangs.includes(coreId))) {
					languages.push(coreId);
					confidences.push(language.confidence);
				}
			}
			stopWatch.stop();

			if (languages.length) {
				this._host.$sendTelemetryEvent(languages, confidences, stopWatch.elapsed());
				return languages[0];
			}
			return undefined;
		};

		const historicalResolver = async () => this.runRegexpModel(documentTextSample, langBiases ?? {}, supportedLangs);

		if (preferHistory) {
			const history = await historicalResolver();
			if (history) { return history; }
			const neural = await neuralResolver();
			if (neural) { return neural; }
		} else {
			const neural = await neuralResolver();
			if (neural) { return neural; }
			const history = await historicalResolver();
			if (history) { return history; }
		}

		return undefined;
	}

	private getTextForDetection(uri: string): string | undefined {
		const editorModel = this._workerTextModelSyncServer.getModel(uri);
		if (!editorModel) { return; }

		const end = editorModel.positionAt(10000);
		const content = editorModel.getValueInRange({
			startColumn: 1,
			startLineNumber: 1,
			endColumn: end.column,
			endLineNumber: end.lineNumber
		});
		return content;
	}

	private async getRegexpModel(): Promise<RegexpModel | undefined> {
		if (this._regexpLoadFailed) {
			return;
		}
		if (this._regexpModel) {
			return this._regexpModel;
		}
		const uri: string = await this._host.$getRegexpModelUri();
		try {
			this._regexpModel = await importAMDNodeModule(uri, '') as RegexpModel;
			return this._regexpModel;
		} catch (e) {
			this._regexpLoadFailed = true;
			// console.warn('error loading language detection model', e);
			return;
		}
	}

	private async runRegexpModel(content: string, langBiases: Record<string, number>, supportedLangs?: string[]): Promise<string | undefined> {
		const regexpModel = await this.getRegexpModel();
		if (!regexpModel) { return; }

		if (supportedLangs?.length) {
			// When using supportedLangs, normally computed biases are too extreme. Just use a "bitmask" of sorts.
			for (const lang of Object.keys(langBiases)) {
				if (supportedLangs.includes(lang)) {
					langBiases[lang] = 1;
				} else {
					langBiases[lang] = 0;
				}
			}
		}

		const detected = regexpModel.detect(content, langBiases, supportedLangs);
		return detected;
	}

	private async getModelOperations(): Promise<ModelOperations> {
		if (this._modelOperations) {
			return this._modelOperations;
		}

		const uri: string = await this._host.$getIndexJsUri();
		const { ModelOperations } = await importAMDNodeModule(uri, '') as typeof import('@vscode/vscode-languagedetection');
		this._modelOperations = new ModelOperations({
			modelJsonLoaderFunc: async () => {
				const response = await fetch(await this._host.$getModelJsonUri());
				try {
					const modelJSON = await response.json();
					return modelJSON;
				} catch (e) {
					const message = `Failed to parse model JSON.`;
					throw new Error(message);
				}
			},
			weightsLoaderFunc: async () => {
				const response = await fetch(await this._host.$getWeightsUri());
				const buffer = await response.arrayBuffer();
				return buffer;
			}
		});

		return this._modelOperations;
	}

	// This adjusts the language confidence scores to be more accurate based on:
	// * VS Code's language usage
	// * Languages with 'problematic' syntaxes that have caused incorrect language detection
	private adjustLanguageConfidence(modelResult: ModelResult): ModelResult {
		switch (modelResult.languageId) {
			// For the following languages, we increase the confidence because
			// these are commonly used languages in VS Code and supported
			// by the model.
			case 'js':
			case 'html':
			case 'json':
			case 'ts':
			case 'css':
			case 'py':
			case 'xml':
			case 'php':
				modelResult.confidence += LanguageDetectionWorker.positiveConfidenceCorrectionBucket1;
				break;
			// case 'yaml': // YAML has been know to cause incorrect language detection because the language is pretty simple. We don't want to increase the confidence for this.
			case 'cpp':
			case 'sh':
			case 'java':
			case 'cs':
			case 'c':
				modelResult.confidence += LanguageDetectionWorker.positiveConfidenceCorrectionBucket2;
				break;

			// For the following languages, we need to be extra confident that the language is correct because
			// we've had issues like #131912 that caused incorrect guesses. To enforce this, we subtract the
			// negativeConfidenceCorrection from the confidence.

			// languages that are provided by default in VS Code
			case 'bat':
			case 'ini':
			case 'makefile':
			case 'sql':
			// languages that aren't provided by default in VS Code
			case 'csv':
			case 'toml':
				// Other considerations for negativeConfidenceCorrection that
				// aren't built in but suported by the model include:
				// * Assembly, TeX - These languages didn't have clear language modes in the community
				// * Markdown, Dockerfile - These languages are simple but they embed other languages
				modelResult.confidence -= LanguageDetectionWorker.negativeConfidenceCorrection;
				break;

			default:
				break;

		}
		return modelResult;
	}

	private async * detectLanguagesImpl(content: string): AsyncGenerator<ModelResult, void, unknown> {
		if (this._loadFailed) {
			return;
		}

		let modelOperations: ModelOperations | undefined;
		try {
			modelOperations = await this.getModelOperations();
		} catch (e) {
			console.log(e);
			this._loadFailed = true;
			return;
		}

		let modelResults: ModelResult[] | undefined;

		try {
			modelResults = await modelOperations.runModel(content);
		} catch (e) {
			console.warn(e);
		}

		if (!modelResults
			|| modelResults.length === 0
			|| modelResults[0].confidence < LanguageDetectionWorker.expectedRelativeConfidence) {
			return;
		}

		const firstModelResult = this.adjustLanguageConfidence(modelResults[0]);
		if (firstModelResult.confidence < LanguageDetectionWorker.expectedRelativeConfidence) {
			return;
		}

		const possibleLanguages: ModelResult[] = [firstModelResult];

		for (let current of modelResults) {
			if (current === firstModelResult) {
				continue;
			}

			current = this.adjustLanguageConfidence(current);
			const currentHighest = possibleLanguages[possibleLanguages.length - 1];

			if (currentHighest.confidence - current.confidence >= LanguageDetectionWorker.expectedRelativeConfidence) {
				while (possibleLanguages.length) {
					yield possibleLanguages.shift()!;
				}
				if (current.confidence > LanguageDetectionWorker.expectedRelativeConfidence) {
					possibleLanguages.push(current);
					continue;
				}
				return;
			} else {
				if (current.confidence > LanguageDetectionWorker.expectedRelativeConfidence) {
					possibleLanguages.push(current);
					continue;
				}
				return;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/languageDetection/browser/languageDetectionWebWorkerMain.ts]---
Location: vscode-main/src/vs/workbench/services/languageDetection/browser/languageDetectionWebWorkerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { create } from './languageDetectionWebWorker.js';
import { bootstrapWebWorker } from '../../../../base/common/worker/webWorkerBootstrap.js';

bootstrapWebWorker(create);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/languageDetection/browser/languageDetectionWorker.protocol.ts]---
Location: vscode-main/src/vs/workbench/services/languageDetection/browser/languageDetectionWorker.protocol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWebWorkerClient, IWebWorkerServer } from '../../../../base/common/worker/webWorker.js';

export abstract class LanguageDetectionWorkerHost {
	public static CHANNEL_NAME = 'languageDetectionWorkerHost';
	public static getChannel(workerServer: IWebWorkerServer): LanguageDetectionWorkerHost {
		return workerServer.getChannel<LanguageDetectionWorkerHost>(LanguageDetectionWorkerHost.CHANNEL_NAME);
	}
	public static setChannel(workerClient: IWebWorkerClient<unknown>, obj: LanguageDetectionWorkerHost): void {
		workerClient.setChannel<LanguageDetectionWorkerHost>(LanguageDetectionWorkerHost.CHANNEL_NAME, obj);
	}

	abstract $getIndexJsUri(): Promise<string>;
	abstract $getLanguageId(languageIdOrExt: string | undefined): Promise<string | undefined>;
	abstract $sendTelemetryEvent(languages: string[], confidences: number[], timeSpent: number): Promise<void>;
	abstract $getRegexpModelUri(): Promise<string>;
	abstract $getModelJsonUri(): Promise<string>;
	abstract $getWeightsUri(): Promise<string>;
}

export interface ILanguageDetectionWorker {
	$detectLanguage(uri: string, langBiases: Record<string, number> | undefined, preferHistory: boolean, supportedLangs?: string[]): Promise<string | undefined>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/languageDetection/browser/languageDetectionWorkerServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/services/languageDetection/browser/languageDetectionWorkerServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILanguageDetectionService, ILanguageDetectionStats, LanguageDetectionStatsClassification, LanguageDetectionStatsId } from '../common/languageDetectionWorkerService.js';
import { AppResourcePath, FileAccess, nodeModulesAsarPath, nodeModulesPath, Schemas } from '../../../../base/common/network.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { URI } from '../../../../base/common/uri.js';
import { isWeb } from '../../../../base/common/platform.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { IWebWorkerClient } from '../../../../base/common/worker/webWorker.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IDiagnosticsService } from '../../../../platform/diagnostics/common/diagnostics.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { LRUCache } from '../../../../base/common/map.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { canASAR } from '../../../../amdX.js';
import { WebWorkerDescriptor } from '../../../../platform/webWorker/browser/webWorkerDescriptor.js';
import { IWebWorkerService } from '../../../../platform/webWorker/browser/webWorkerService.js';
import { WorkerTextModelSyncClient } from '../../../../editor/common/services/textModelSync/textModelSync.impl.js';
import { ILanguageDetectionWorker, LanguageDetectionWorkerHost } from './languageDetectionWorker.protocol.js';

const TOP_LANG_COUNTS = 12;

const regexpModuleLocation: AppResourcePath = `${nodeModulesPath}/vscode-regexp-languagedetection`;
const regexpModuleLocationAsar: AppResourcePath = `${nodeModulesAsarPath}/vscode-regexp-languagedetection`;
const moduleLocation: AppResourcePath = `${nodeModulesPath}/@vscode/vscode-languagedetection`;
const moduleLocationAsar: AppResourcePath = `${nodeModulesAsarPath}/@vscode/vscode-languagedetection`;

export class LanguageDetectionService extends Disposable implements ILanguageDetectionService {
	static readonly enablementSettingKey = 'workbench.editor.languageDetection';
	static readonly historyBasedEnablementConfig = 'workbench.editor.historyBasedLanguageDetection';
	static readonly preferHistoryConfig = 'workbench.editor.preferHistoryBasedLanguageDetection';
	static readonly workspaceOpenedLanguagesStorageKey = 'workbench.editor.languageDetectionOpenedLanguages.workspace';
	static readonly globalOpenedLanguagesStorageKey = 'workbench.editor.languageDetectionOpenedLanguages.global';

	_serviceBrand: undefined;

	private _languageDetectionWorkerClient: LanguageDetectionWorkerClient;

	private hasResolvedWorkspaceLanguageIds = false;
	private workspaceLanguageIds = new Set<string>();
	private sessionOpenedLanguageIds = new Set<string>();
	private historicalGlobalOpenedLanguageIds = new LRUCache<string, true>(TOP_LANG_COUNTS);
	private historicalWorkspaceOpenedLanguageIds = new LRUCache<string, true>(TOP_LANG_COUNTS);
	private dirtyBiases: boolean = true;
	private langBiases: Record<string, number> = {};

	constructor(
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@ILanguageService languageService: ILanguageService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IDiagnosticsService private readonly _diagnosticsService: IDiagnosticsService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@IModelService modelService: IModelService,
		@IEditorService private readonly _editorService: IEditorService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IStorageService storageService: IStorageService,
		@ILogService private readonly _logService: ILogService,
		@IWebWorkerService webWorkerService: IWebWorkerService,
	) {
		super();

		const useAsar = canASAR && this._environmentService.isBuilt && !isWeb;
		this._languageDetectionWorkerClient = this._register(new LanguageDetectionWorkerClient(
			modelService,
			languageService,
			telemetryService,
			webWorkerService,
			// TODO See if it's possible to bundle vscode-languagedetection
			useAsar
				? FileAccess.asBrowserUri(`${moduleLocationAsar}/dist/lib/index.js`).toString(true)
				: FileAccess.asBrowserUri(`${moduleLocation}/dist/lib/index.js`).toString(true),
			useAsar
				? FileAccess.asBrowserUri(`${moduleLocationAsar}/model/model.json`).toString(true)
				: FileAccess.asBrowserUri(`${moduleLocation}/model/model.json`).toString(true),
			useAsar
				? FileAccess.asBrowserUri(`${moduleLocationAsar}/model/group1-shard1of1.bin`).toString(true)
				: FileAccess.asBrowserUri(`${moduleLocation}/model/group1-shard1of1.bin`).toString(true),
			useAsar
				? FileAccess.asBrowserUri(`${regexpModuleLocationAsar}/dist/index.js`).toString(true)
				: FileAccess.asBrowserUri(`${regexpModuleLocation}/dist/index.js`).toString(true),
		));

		this.initEditorOpenedListeners(storageService);
	}

	private async resolveWorkspaceLanguageIds() {
		if (this.hasResolvedWorkspaceLanguageIds) { return; }
		this.hasResolvedWorkspaceLanguageIds = true;
		const fileExtensions = await this._diagnosticsService.getWorkspaceFileExtensions(this._workspaceContextService.getWorkspace());

		let count = 0;
		for (const ext of fileExtensions.extensions) {
			const langId = this._languageDetectionWorkerClient.getLanguageId(ext);
			if (langId && count < TOP_LANG_COUNTS) {
				this.workspaceLanguageIds.add(langId);
				count++;
				if (count > TOP_LANG_COUNTS) { break; }
			}
		}
		this.dirtyBiases = true;
	}

	public isEnabledForLanguage(languageId: string): boolean {
		return !!languageId && this._configurationService.getValue<boolean>(LanguageDetectionService.enablementSettingKey, { overrideIdentifier: languageId });
	}


	private getLanguageBiases(): Record<string, number> {
		if (!this.dirtyBiases) { return this.langBiases; }

		const biases: Record<string, number> = {};

		// Give different weight to the biases depending on relevance of source
		this.sessionOpenedLanguageIds.forEach(lang =>
			biases[lang] = (biases[lang] ?? 0) + 7);

		this.workspaceLanguageIds.forEach(lang =>
			biases[lang] = (biases[lang] ?? 0) + 5);

		[...this.historicalWorkspaceOpenedLanguageIds.keys()].forEach(lang =>
			biases[lang] = (biases[lang] ?? 0) + 3);

		[...this.historicalGlobalOpenedLanguageIds.keys()].forEach(lang =>
			biases[lang] = (biases[lang] ?? 0) + 1);

		this._logService.trace('Session Languages:', JSON.stringify([...this.sessionOpenedLanguageIds]));
		this._logService.trace('Workspace Languages:', JSON.stringify([...this.workspaceLanguageIds]));
		this._logService.trace('Historical Workspace Opened Languages:', JSON.stringify([...this.historicalWorkspaceOpenedLanguageIds.keys()]));
		this._logService.trace('Historical Globally Opened Languages:', JSON.stringify([...this.historicalGlobalOpenedLanguageIds.keys()]));
		this._logService.trace('Computed Language Detection Biases:', JSON.stringify(biases));
		this.dirtyBiases = false;
		this.langBiases = biases;
		return biases;
	}

	async detectLanguage(resource: URI, supportedLangs?: string[]): Promise<string | undefined> {
		const useHistory = this._configurationService.getValue<string[]>(LanguageDetectionService.historyBasedEnablementConfig);
		const preferHistory = this._configurationService.getValue<boolean>(LanguageDetectionService.preferHistoryConfig);
		if (useHistory) {
			await this.resolveWorkspaceLanguageIds();
		}
		const biases = useHistory ? this.getLanguageBiases() : undefined;
		return this._languageDetectionWorkerClient.detectLanguage(resource, biases, preferHistory, supportedLangs);
	}

	// TODO: explore using the history service or something similar to provide this list of opened editors
	// so this service can support delayed instantiation. This may be tricky since it seems the IHistoryService
	// only gives history for a workspace... where this takes advantage of history at a global level as well.
	private initEditorOpenedListeners(storageService: IStorageService) {
		try {
			const globalLangHistoryData = JSON.parse(storageService.get(LanguageDetectionService.globalOpenedLanguagesStorageKey, StorageScope.PROFILE, '[]'));
			this.historicalGlobalOpenedLanguageIds.fromJSON(globalLangHistoryData);
		} catch (e) { console.error(e); }

		try {
			const workspaceLangHistoryData = JSON.parse(storageService.get(LanguageDetectionService.workspaceOpenedLanguagesStorageKey, StorageScope.WORKSPACE, '[]'));
			this.historicalWorkspaceOpenedLanguageIds.fromJSON(workspaceLangHistoryData);
		} catch (e) { console.error(e); }

		this._register(this._editorService.onDidActiveEditorChange(() => {
			const activeLanguage = this._editorService.activeTextEditorLanguageId;
			if (activeLanguage && this._editorService.activeEditor?.resource?.scheme !== Schemas.untitled) {
				this.sessionOpenedLanguageIds.add(activeLanguage);
				this.historicalGlobalOpenedLanguageIds.set(activeLanguage, true);
				this.historicalWorkspaceOpenedLanguageIds.set(activeLanguage, true);
				storageService.store(LanguageDetectionService.globalOpenedLanguagesStorageKey, JSON.stringify(this.historicalGlobalOpenedLanguageIds.toJSON()), StorageScope.PROFILE, StorageTarget.MACHINE);
				storageService.store(LanguageDetectionService.workspaceOpenedLanguagesStorageKey, JSON.stringify(this.historicalWorkspaceOpenedLanguageIds.toJSON()), StorageScope.WORKSPACE, StorageTarget.MACHINE);
				this.dirtyBiases = true;
			}
		}));
	}
}

export class LanguageDetectionWorkerClient extends Disposable {
	private worker: {
		workerClient: IWebWorkerClient<ILanguageDetectionWorker>;
		workerTextModelSyncClient: WorkerTextModelSyncClient;
	} | undefined;

	constructor(
		private readonly _modelService: IModelService,
		private readonly _languageService: ILanguageService,
		private readonly _telemetryService: ITelemetryService,
		private readonly _webWorkerService: IWebWorkerService,
		private readonly _indexJsUri: string,
		private readonly _modelJsonUri: string,
		private readonly _weightsUri: string,
		private readonly _regexpModelUri: string,
	) {
		super();
	}

	private _getOrCreateLanguageDetectionWorker(): {
		workerClient: IWebWorkerClient<ILanguageDetectionWorker>;
		workerTextModelSyncClient: WorkerTextModelSyncClient;
	} {
		if (!this.worker) {
			const workerClient = this._register(this._webWorkerService.createWorkerClient<ILanguageDetectionWorker>(
				new WebWorkerDescriptor({
					esmModuleLocation: FileAccess.asBrowserUri('vs/workbench/services/languageDetection/browser/languageDetectionWebWorkerMain.js'),
					label: 'LanguageDetectionWorker'
				})
			));
			LanguageDetectionWorkerHost.setChannel(workerClient, {
				$getIndexJsUri: async () => this.getIndexJsUri(),
				$getLanguageId: async (languageIdOrExt) => this.getLanguageId(languageIdOrExt),
				$sendTelemetryEvent: async (languages, confidences, timeSpent) => this.sendTelemetryEvent(languages, confidences, timeSpent),
				$getRegexpModelUri: async () => this.getRegexpModelUri(),
				$getModelJsonUri: async () => this.getModelJsonUri(),
				$getWeightsUri: async () => this.getWeightsUri(),
			});
			const workerTextModelSyncClient = this._register(WorkerTextModelSyncClient.create(workerClient, this._modelService));
			this.worker = { workerClient, workerTextModelSyncClient };
		}
		return this.worker;
	}

	private _guessLanguageIdByUri(uri: URI): string | undefined {
		const guess = this._languageService.guessLanguageIdByFilepathOrFirstLine(uri);
		if (guess && guess !== 'unknown') {
			return guess;
		}
		return undefined;
	}

	async getIndexJsUri() {
		return this._indexJsUri;
	}

	getLanguageId(languageIdOrExt: string | undefined) {
		if (!languageIdOrExt) {
			return undefined;
		}
		if (this._languageService.isRegisteredLanguageId(languageIdOrExt)) {
			return languageIdOrExt;
		}
		const guessed = this._guessLanguageIdByUri(URI.file(`file.${languageIdOrExt}`));
		if (!guessed || guessed === 'unknown') {
			return undefined;
		}
		return guessed;
	}

	async getModelJsonUri() {
		return this._modelJsonUri;
	}

	async getWeightsUri() {
		return this._weightsUri;
	}

	async getRegexpModelUri() {
		return this._regexpModelUri;
	}

	async sendTelemetryEvent(languages: string[], confidences: number[], timeSpent: number): Promise<void> {
		this._telemetryService.publicLog2<ILanguageDetectionStats, LanguageDetectionStatsClassification>(LanguageDetectionStatsId, {
			languages: languages.join(','),
			confidences: confidences.join(','),
			timeSpent
		});
	}

	public async detectLanguage(resource: URI, langBiases: Record<string, number> | undefined, preferHistory: boolean, supportedLangs?: string[]): Promise<string | undefined> {
		const startTime = Date.now();
		const quickGuess = this._guessLanguageIdByUri(resource);
		if (quickGuess) {
			return quickGuess;
		}

		const { workerClient, workerTextModelSyncClient } = this._getOrCreateLanguageDetectionWorker();
		workerTextModelSyncClient.ensureSyncedResources([resource]);
		const modelId = await workerClient.proxy.$detectLanguage(resource.toString(), langBiases, preferHistory, supportedLangs);
		const languageId = this.getLanguageId(modelId);

		const LanguageDetectionStatsId = 'automaticlanguagedetection.perf';

		interface ILanguageDetectionPerf {
			timeSpent: number;
			detection: string;
		}

		type LanguageDetectionPerfClassification = {
			owner: 'TylerLeonhardt';
			comment: 'Helps understand how effective language detection and how long it takes to run';
			timeSpent: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The time it took to run language detection' };
			detection: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language that was detected' };
		};

		this._telemetryService.publicLog2<ILanguageDetectionPerf, LanguageDetectionPerfClassification>(LanguageDetectionStatsId, {
			timeSpent: Date.now() - startTime,
			detection: languageId || 'unknown',
		});

		return languageId;
	}
}

// For now we use Eager until we handle keeping track of history better.
registerSingleton(ILanguageDetectionService, LanguageDetectionService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/languageDetection/common/languageDetectionWorkerService.ts]---
Location: vscode-main/src/vs/workbench/services/languageDetection/common/languageDetectionWorkerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const ILanguageDetectionService = createDecorator<ILanguageDetectionService>('ILanguageDetectionService');

export const LanguageDetectionLanguageEventSource = 'languageDetection';

export interface ILanguageDetectionService {
	readonly _serviceBrand: undefined;

	/**
	 * @param languageId The languageId to check if language detection is currently enabled.
	 * @returns whether or not language detection is on for this language.
	 */
	isEnabledForLanguage(languageId: string): boolean;

	/**
	 * @param resource The resource to detect the language for.
	 * @param supportedLangs Optional. When populated, the model will only return languages from the provided list
	 * @returns the language id for the given resource or undefined if the model is not confident enough.
	 */
	detectLanguage(resource: URI, supportedLangs?: string[]): Promise<string | undefined>;
}

export type LanguageDetectionHintConfig = {
	untitledEditors: boolean;
	notebookEditors: boolean;
};

//#region Telemetry events

export const AutomaticLanguageDetectionLikelyWrongId = 'automaticlanguagedetection.likelywrong';

export interface IAutomaticLanguageDetectionLikelyWrongData {
	currentLanguageId: string;
	nextLanguageId: string;
	lineCount: number;
	modelPreference: string;
}

export type AutomaticLanguageDetectionLikelyWrongClassification = {
	owner: 'TylerLeonhardt';
	comment: 'Used to determine how often language detection is likely wrong.';
	currentLanguageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language id we guessed.' };
	nextLanguageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language id the user chose.' };
	lineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of lines in the file.' };
	modelPreference: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'What the user\'s model preference is.' };
};

export const LanguageDetectionStatsId = 'automaticlanguagedetection.stats';

export interface ILanguageDetectionStats {
	languages: string;
	confidences: string;
	timeSpent: number;
}

export type LanguageDetectionStatsClassification = {
	owner: 'TylerLeonhardt';
	comment: 'Used to determine how definitive language detection is and how long it takes.';
	languages: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The languages the model supports.' };
	confidences: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The confidences of those languages.' };
	timeSpent: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How long the operation took.' };
};

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/languageStatus/common/languageStatusService.ts]---
Location: vscode-main/src/vs/workbench/services/languageStatus/common/languageStatusService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { compare } from '../../../../base/common/strings.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { Command } from '../../../../editor/common/languages.js';
import { LanguageFeatureRegistry } from '../../../../editor/common/languageFeatureRegistry.js';
import { LanguageSelector } from '../../../../editor/common/languageSelector.js';
import { IAccessibilityInformation } from '../../../../platform/accessibility/common/accessibility.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export interface ILanguageStatus {
	readonly id: string;
	readonly name: string;
	readonly selector: LanguageSelector;
	readonly severity: Severity;
	readonly label: string | { value: string; shortValue: string };
	readonly detail: string;
	readonly busy: boolean;
	readonly source: string;
	readonly command: Command | undefined;
	readonly accessibilityInfo: IAccessibilityInformation | undefined;
}

export interface ILanguageStatusProvider {
	provideLanguageStatus(langId: string, token: CancellationToken): Promise<ILanguageStatus | undefined>;
}

export const ILanguageStatusService = createDecorator<ILanguageStatusService>('ILanguageStatusService');

export interface ILanguageStatusService {

	_serviceBrand: undefined;

	readonly onDidChange: Event<void>;

	addStatus(status: ILanguageStatus): IDisposable;

	getLanguageStatus(model: ITextModel): ILanguageStatus[];
}


class LanguageStatusServiceImpl implements ILanguageStatusService {

	declare _serviceBrand: undefined;

	private readonly _provider = new LanguageFeatureRegistry<ILanguageStatus>();

	readonly onDidChange = Event.map(this._provider.onDidChange, () => undefined);

	addStatus(status: ILanguageStatus): IDisposable {
		return this._provider.register(status.selector, status);
	}

	getLanguageStatus(model: ITextModel): ILanguageStatus[] {
		return this._provider.ordered(model).sort((a, b) => {
			let res = b.severity - a.severity;
			if (res === 0) {
				res = compare(a.source, b.source);
			}
			if (res === 0) {
				res = compare(a.id, b.id);
			}
			return res;
		});
	}
}

registerSingleton(ILanguageStatusService, LanguageStatusServiceImpl, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/layout/browser/layoutService.ts]---
Location: vscode-main/src/vs/workbench/services/layout/browser/layoutService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { refineServiceDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { Part } from '../../../browser/part.js';
import { IDimension } from '../../../../base/browser/dom.js';
import { Direction, IViewSize } from '../../../../base/browser/ui/grid/grid.js';
import { isMacintosh, isNative, isWeb } from '../../../../base/common/platform.js';
import { isAuxiliaryWindow } from '../../../../base/browser/window.js';
import { CustomTitleBarVisibility, TitleBarSetting, getMenuBarVisibility, hasCustomTitlebar, hasNativeMenu, hasNativeTitlebar } from '../../../../platform/window/common/window.js';
import { isFullscreen, isWCOEnabled } from '../../../../base/browser/browser.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';

export const IWorkbenchLayoutService = refineServiceDecorator<ILayoutService, IWorkbenchLayoutService>(ILayoutService);

export const enum Parts {
	TITLEBAR_PART = 'workbench.parts.titlebar',
	BANNER_PART = 'workbench.parts.banner',
	ACTIVITYBAR_PART = 'workbench.parts.activitybar',
	SIDEBAR_PART = 'workbench.parts.sidebar',
	PANEL_PART = 'workbench.parts.panel',
	AUXILIARYBAR_PART = 'workbench.parts.auxiliarybar',
	EDITOR_PART = 'workbench.parts.editor',
	STATUSBAR_PART = 'workbench.parts.statusbar'
}

export const enum ZenModeSettings {
	SHOW_TABS = 'zenMode.showTabs',
	HIDE_LINENUMBERS = 'zenMode.hideLineNumbers',
	HIDE_STATUSBAR = 'zenMode.hideStatusBar',
	HIDE_ACTIVITYBAR = 'zenMode.hideActivityBar',
	CENTER_LAYOUT = 'zenMode.centerLayout',
	FULLSCREEN = 'zenMode.fullScreen',
	RESTORE = 'zenMode.restore',
	SILENT_NOTIFICATIONS = 'zenMode.silentNotifications',
}

export const enum LayoutSettings {
	ACTIVITY_BAR_LOCATION = 'workbench.activityBar.location',
	EDITOR_TABS_MODE = 'workbench.editor.showTabs',
	EDITOR_ACTIONS_LOCATION = 'workbench.editor.editorActionsLocation',
	COMMAND_CENTER = 'window.commandCenter',
	LAYOUT_ACTIONS = 'workbench.layoutControl.enabled'
}

export const enum ActivityBarPosition {
	DEFAULT = 'default',
	TOP = 'top',
	BOTTOM = 'bottom',
	HIDDEN = 'hidden'
}

export const enum EditorTabsMode {
	MULTIPLE = 'multiple',
	SINGLE = 'single',
	NONE = 'none'
}

export const enum EditorActionsLocation {
	DEFAULT = 'default',
	TITLEBAR = 'titleBar',
	HIDDEN = 'hidden'
}

export const enum Position {
	LEFT,
	RIGHT,
	BOTTOM,
	TOP
}

export function isHorizontal(position: Position): boolean {
	return position === Position.BOTTOM || position === Position.TOP;
}

export const enum PartOpensMaximizedOptions {
	ALWAYS,
	NEVER,
	REMEMBER_LAST
}

export type PanelAlignment = 'left' | 'center' | 'right' | 'justify';

export function positionToString(position: Position): string {
	switch (position) {
		case Position.LEFT: return 'left';
		case Position.RIGHT: return 'right';
		case Position.BOTTOM: return 'bottom';
		case Position.TOP: return 'top';
		default: return 'bottom';
	}
}

const positionsByString: { [key: string]: Position } = {
	[positionToString(Position.LEFT)]: Position.LEFT,
	[positionToString(Position.RIGHT)]: Position.RIGHT,
	[positionToString(Position.BOTTOM)]: Position.BOTTOM,
	[positionToString(Position.TOP)]: Position.TOP
};

export function positionFromString(str: string): Position {
	return positionsByString[str];
}

function partOpensMaximizedSettingToString(setting: PartOpensMaximizedOptions): string {
	switch (setting) {
		case PartOpensMaximizedOptions.ALWAYS: return 'always';
		case PartOpensMaximizedOptions.NEVER: return 'never';
		case PartOpensMaximizedOptions.REMEMBER_LAST: return 'preserve';
		default: return 'preserve';
	}
}

const partOpensMaximizedByString: { [key: string]: PartOpensMaximizedOptions } = {
	[partOpensMaximizedSettingToString(PartOpensMaximizedOptions.ALWAYS)]: PartOpensMaximizedOptions.ALWAYS,
	[partOpensMaximizedSettingToString(PartOpensMaximizedOptions.NEVER)]: PartOpensMaximizedOptions.NEVER,
	[partOpensMaximizedSettingToString(PartOpensMaximizedOptions.REMEMBER_LAST)]: PartOpensMaximizedOptions.REMEMBER_LAST
};

export function partOpensMaximizedFromString(str: string): PartOpensMaximizedOptions {
	return partOpensMaximizedByString[str];
}

export type MULTI_WINDOW_PARTS = Parts.EDITOR_PART | Parts.STATUSBAR_PART | Parts.TITLEBAR_PART;
export type SINGLE_WINDOW_PARTS = Exclude<Parts, MULTI_WINDOW_PARTS>;

export function isMultiWindowPart(part: Parts): part is MULTI_WINDOW_PARTS {
	return part === Parts.EDITOR_PART ||
		part === Parts.STATUSBAR_PART ||
		part === Parts.TITLEBAR_PART;
}

export interface IWorkbenchLayoutService extends ILayoutService {

	readonly _serviceBrand: undefined;

	/**
	 * Emits when the zen mode is enabled or disabled.
	 */
	readonly onDidChangeZenMode: Event<boolean>;

	/**
	 * Emits when the target window is maximized or unmaximized.
	 */
	readonly onDidChangeWindowMaximized: Event<{ readonly windowId: number; readonly maximized: boolean }>;

	/**
	 * Emits when main editor centered layout is enabled or disabled.
	 */
	readonly onDidChangeMainEditorCenteredLayout: Event<boolean>;

	/*
	 * Emit when panel position changes.
	 */
	readonly onDidChangePanelPosition: Event<string>;

	/**
	 * Emit when panel alignment changes.
	 */
	readonly onDidChangePanelAlignment: Event<PanelAlignment>;

	/**
	 * Emit when part visibility changes
	 */
	readonly onDidChangePartVisibility: Event<void>;

	/**
	 * Emit when notifications (toasts or center) visibility changes.
	 */
	readonly onDidChangeNotificationsVisibility: Event<boolean>;

	/*
	 * Emit when auxiliary bar maximized state changes.
	 */
	readonly onDidChangeAuxiliaryBarMaximized: Event<void>;

	/**
	 * True if a default layout with default editors was applied at startup
	 */
	readonly openedDefaultEditors: boolean;

	/**
	 * Run a layout of the workbench.
	 */
	layout(): void;

	/**
	 * Asks the part service if all parts have been fully restored. For editor part
	 * this means that the contents of visible editors have loaded.
	 */
	isRestored(): boolean;

	/**
	 * A promise for to await the `isRestored()` condition to be `true`.
	 */
	readonly whenRestored: Promise<void>;

	/**
	 * Returns whether the given part has the keyboard focus or not.
	 */
	hasFocus(part: Parts): boolean;

	/**
	 * Focuses the part in the target window. If the part is not visible this is a noop.
	 */
	focusPart(part: SINGLE_WINDOW_PARTS): void;
	focusPart(part: MULTI_WINDOW_PARTS, targetWindow: Window): void;
	focusPart(part: Parts, targetWindow: Window): void;

	/**
	 * Returns the target window container or parts HTML element within, if there is one.
	 */
	getContainer(targetWindow: Window): HTMLElement;
	getContainer(targetWindow: Window, part: Parts): HTMLElement | undefined;

	/**
	 * Returns if the part is visible in the target window.
	 */
	isVisible(part: SINGLE_WINDOW_PARTS): boolean;
	isVisible(part: MULTI_WINDOW_PARTS, targetWindow: Window): boolean;
	isVisible(part: Parts, targetWindow: Window): boolean;

	/**
	 * Set part hidden or not in the target window.
	 */
	setPartHidden(hidden: boolean, part: Parts): void;

	/**
	 * Maximizes the panel height if the panel is not already maximized.
	 * Shrinks the panel to the default starting size if the panel is maximized.
	 */
	toggleMaximizedPanel(): void;

	/**
	 * Returns true if the panel is maximized.
	 */
	isPanelMaximized(): boolean;

	/**
	 * Maximizes the auxiliary sidebar by hiding the editor and panel areas.
	 * Restores the previous layout if the auxiliary sidebar is already maximized.
	 */
	toggleMaximizedAuxiliaryBar(): void;

	/**
	 * Maximizes or restores the auxiliary sidebar.
	 *
	 * @returns `true` if there was a change in the maximization state.
	 */
	setAuxiliaryBarMaximized(maximized: boolean): boolean;

	/**
	 * Returns true if the auxiliary sidebar is maximized.
	 */
	isAuxiliaryBarMaximized(): boolean;

	/**
	 * Returns true if the main window has a border.
	 */
	hasMainWindowBorder(): boolean;

	/**
	 * Returns the main window border radius if any.
	 */
	getMainWindowBorderRadius(): string | undefined;

	/**
	 * Gets the current side bar position. Note that the sidebar can be hidden too.
	 */
	getSideBarPosition(): Position;

	/**
	 * Toggles the menu bar visibility.
	 */
	toggleMenuBar(): void;

	/*
	 * Gets the current panel position. Note that the panel can be hidden too.
	 */
	getPanelPosition(): Position;

	/**
	 * Sets the panel position.
	 */
	setPanelPosition(position: Position): void;

	/**
	 * Gets the panel alignement.
	 */
	getPanelAlignment(): PanelAlignment;

	/**
	 * Sets the panel alignment.
	 */
	setPanelAlignment(alignment: PanelAlignment): void;

	/**
	 * Gets the maximum possible size for editor in the given container.
	 */
	getMaximumEditorDimensions(container: HTMLElement): IDimension;

	/**
	 * Toggles the workbench in and out of zen mode - parts get hidden and window goes fullscreen.
	 */
	toggleZenMode(): void;

	/**
	 * Returns whether the centered editor layout is active on the main editor part.
	 */
	isMainEditorLayoutCentered(): boolean;

	/**
	 * Sets the main editor part in and out of centered layout.
	 */
	centerMainEditorLayout(active: boolean): void;

	/**
	 * Get the provided parts size in the main window.
	 */
	getSize(part: Parts): IViewSize;

	/**
	 * Set the provided parts size in the main window.
	 */
	setSize(part: Parts, size: IViewSize): void;

	/**
	 * Resize the provided part in the main window.
	 */
	resizePart(part: Parts, sizeChangeWidth: number, sizeChangeHeight: number): void;

	/**
	 * Register a part to participate in the layout.
	 */
	registerPart(part: Part): IDisposable;

	/**
	 * Returns whether the target window is maximized.
	 */
	isWindowMaximized(targetWindow: Window): boolean;

	/**
	 * Updates the maximized state of the target window.
	 */
	updateWindowMaximizedState(targetWindow: Window, maximized: boolean): void;

	/**
	 * Returns the next visible view part in a given direction in the main window.
	 */
	getVisibleNeighborPart(part: Parts, direction: Direction): Parts | undefined;
}

export function shouldShowCustomTitleBar(configurationService: IConfigurationService, window: Window, menuBarToggled?: boolean): boolean {
	if (!hasCustomTitlebar(configurationService)) {
		return false;
	}

	const inFullscreen = isFullscreen(window);
	const nativeTitleBarEnabled = hasNativeTitlebar(configurationService);

	if (!isWeb) {
		const showCustomTitleBar = configurationService.getValue<CustomTitleBarVisibility>(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY);
		if (showCustomTitleBar === CustomTitleBarVisibility.NEVER && nativeTitleBarEnabled || showCustomTitleBar === CustomTitleBarVisibility.WINDOWED && inFullscreen) {
			return false;
		}
	}

	if (!isTitleBarEmpty(configurationService)) {
		return true;
	}

	// Hide custom title bar when native title bar enabled and custom title bar is empty
	if (nativeTitleBarEnabled && hasNativeMenu(configurationService)) {
		return false;
	}

	// macOS desktop does not need a title bar when full screen
	if (isMacintosh && isNative) {
		return !inFullscreen;
	}

	// non-fullscreen native must show the title bar
	if (isNative && !inFullscreen) {
		return true;
	}

	// if WCO is visible, we have to show the title bar
	if (isWCOEnabled() && !inFullscreen) {
		return true;
	}

	// remaining behavior is based on menubar visibility
	const menuBarVisibility = !isAuxiliaryWindow(window) ? getMenuBarVisibility(configurationService) : 'hidden';
	switch (menuBarVisibility) {
		case 'classic':
			return !inFullscreen || !!menuBarToggled;
		case 'compact':
		case 'hidden':
			return false;
		case 'toggle':
			return !!menuBarToggled;
		case 'visible':
			return true;
		default:
			return isWeb ? false : !inFullscreen || !!menuBarToggled;
	}
}

function isTitleBarEmpty(configurationService: IConfigurationService): boolean {

	// with the command center enabled, we should always show
	if (configurationService.getValue<boolean>(LayoutSettings.COMMAND_CENTER)) {
		return false;
	}

	// with the activity bar on top, we should always show
	const activityBarPosition = configurationService.getValue<ActivityBarPosition>(LayoutSettings.ACTIVITY_BAR_LOCATION);
	if (activityBarPosition === ActivityBarPosition.TOP || activityBarPosition === ActivityBarPosition.BOTTOM) {
		return false;
	}

	// with the editor actions on top, we should always show
	const editorActionsLocation = configurationService.getValue<EditorActionsLocation>(LayoutSettings.EDITOR_ACTIONS_LOCATION);
	const editorTabsMode = configurationService.getValue<EditorTabsMode>(LayoutSettings.EDITOR_TABS_MODE);
	if (editorActionsLocation === EditorActionsLocation.TITLEBAR || editorActionsLocation === EditorActionsLocation.DEFAULT && editorTabsMode === EditorTabsMode.NONE) {
		return false;
	}

	// with the layout actions on top, we should always show
	if (configurationService.getValue<boolean>(LayoutSettings.LAYOUT_ACTIONS)) {
		return false;
	}

	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/lifecycle/browser/lifecycleService.ts]---
Location: vscode-main/src/vs/workbench/services/lifecycle/browser/lifecycleService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ShutdownReason, ILifecycleService, StartupKind } from '../common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { AbstractLifecycleService } from '../common/lifecycleService.js';
import { localize } from '../../../../nls.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { addDisposableListener, EventType } from '../../../../base/browser/dom.js';
import { IStorageService, WillSaveStateReason } from '../../../../platform/storage/common/storage.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { mainWindow } from '../../../../base/browser/window.js';

export class BrowserLifecycleService extends AbstractLifecycleService {

	private beforeUnloadListener: IDisposable | undefined = undefined;
	private unloadListener: IDisposable | undefined = undefined;

	private ignoreBeforeUnload = false;

	private didUnload = false;

	constructor(
		@ILogService logService: ILogService,
		@IStorageService storageService: IStorageService
	) {
		super(logService, storageService);

		this.registerListeners();
	}

	private registerListeners(): void {

		// Listen to `beforeUnload` to support to veto
		this.beforeUnloadListener = addDisposableListener(mainWindow, EventType.BEFORE_UNLOAD, (e: BeforeUnloadEvent) => this.onBeforeUnload(e));

		// Listen to `pagehide` to support orderly shutdown
		// We explicitly do not listen to `unload` event
		// which would disable certain browser caching.
		// We currently do not handle the `persisted` property
		// (https://github.com/microsoft/vscode/issues/136216)
		this.unloadListener = addDisposableListener(mainWindow, EventType.PAGE_HIDE, () => this.onUnload());
	}

	private onBeforeUnload(event: BeforeUnloadEvent): void {

		// Before unload ignored (once)
		if (this.ignoreBeforeUnload) {
			this.logService.info('[lifecycle] onBeforeUnload triggered but ignored once');

			this.ignoreBeforeUnload = false;
		}

		// Before unload with veto support
		else {
			this.logService.info('[lifecycle] onBeforeUnload triggered and handled with veto support');

			this.doShutdown(() => this.vetoBeforeUnload(event));
		}
	}

	private vetoBeforeUnload(event: BeforeUnloadEvent): void {
		event.preventDefault();
		event.returnValue = localize('lifecycleVeto', "Changes that you made may not be saved. Please check press 'Cancel' and try again.");
	}

	withExpectedShutdown(reason: ShutdownReason): Promise<void>;
	withExpectedShutdown(reason: { disableShutdownHandling: true }, callback: Function): void;
	withExpectedShutdown(reason: ShutdownReason | { disableShutdownHandling: true }, callback?: Function): Promise<void> | void {

		// Standard shutdown
		if (typeof reason === 'number') {
			this.shutdownReason = reason;

			// Ensure UI state is persisted
			return this.storageService.flush(WillSaveStateReason.SHUTDOWN);
		}

		// Before unload handling ignored for duration of callback
		else {
			this.ignoreBeforeUnload = true;
			try {
				callback?.();
			} finally {
				this.ignoreBeforeUnload = false;
			}
		}
	}

	async shutdown(): Promise<void> {
		this.logService.info('[lifecycle] shutdown triggered');

		// An explicit shutdown renders our unload
		// event handlers disabled, so dispose them.
		this.beforeUnloadListener?.dispose();
		this.unloadListener?.dispose();

		// Ensure UI state is persisted
		await this.storageService.flush(WillSaveStateReason.SHUTDOWN);

		// Handle shutdown without veto support
		this.doShutdown();
	}

	private doShutdown(vetoShutdown?: () => void): void {
		const logService = this.logService;

		// Optimistically trigger a UI state flush
		// without waiting for it. The browser does
		// not guarantee that this is being executed
		// but if a dialog opens, we have a chance
		// to succeed.
		this.storageService.flush(WillSaveStateReason.SHUTDOWN);

		let veto = false;

		function handleVeto(vetoResult: boolean | Promise<boolean>, id: string) {
			if (typeof vetoShutdown !== 'function') {
				return; // veto handling disabled
			}

			if (vetoResult instanceof Promise) {
				logService.error(`[lifecycle] Long running operations before shutdown are unsupported in the web (id: ${id})`);

				veto = true; // implicitly vetos since we cannot handle promises in web
			}

			if (vetoResult === true) {
				logService.info(`[lifecycle]: Unload was prevented (id: ${id})`);

				veto = true;
			}
		}

		// Before Shutdown
		this._onBeforeShutdown.fire({
			reason: ShutdownReason.QUIT,
			veto(value, id) {
				handleVeto(value, id);
			},
			finalVeto(valueFn, id) {
				handleVeto(valueFn(), id); // in browser, trigger instantly because we do not support async anyway
			}
		});

		// Veto: handle if provided
		if (veto && typeof vetoShutdown === 'function') {
			return vetoShutdown();
		}

		// No veto, continue to shutdown
		return this.onUnload();
	}

	private onUnload(): void {
		if (this.didUnload) {
			return; // only once
		}

		this.didUnload = true;
		this._willShutdown = true;

		// Register a late `pageshow` listener specifically on unload
		this._register(addDisposableListener(mainWindow, EventType.PAGE_SHOW, (e: PageTransitionEvent) => this.onLoadAfterUnload(e)));

		// First indicate will-shutdown
		const logService = this.logService;
		this._onWillShutdown.fire({
			reason: ShutdownReason.QUIT,
			joiners: () => [], 				// Unsupported in web
			token: CancellationToken.None, 	// Unsupported in web
			join(promise, joiner) {
				if (typeof promise === 'function') {
					promise();
				}
				logService.error(`[lifecycle] Long running operations during shutdown are unsupported in the web (id: ${joiner.id})`);
			},
			force: () => { /* No-Op in web */ },
		});

		// Finally end with did-shutdown
		this._onDidShutdown.fire();
	}

	private onLoadAfterUnload(event: PageTransitionEvent): void {

		// We only really care about page-show events
		// where the browser indicates to us that the
		// page was restored from cache and not freshly
		// loaded.
		const wasRestoredFromCache = event.persisted;
		if (!wasRestoredFromCache) {
			return;
		}

		// At this point, we know that the page was restored from
		// cache even though it was unloaded before,
		// so in order to get back to a functional workbench, we
		// currently can only reload the window
		// Docs: https://web.dev/bfcache/#optimize-your-pages-for-bfcache
		// Refs: https://github.com/microsoft/vscode/issues/136035
		this.withExpectedShutdown({ disableShutdownHandling: true }, () => mainWindow.location.reload());
	}

	protected override doResolveStartupKind(): StartupKind | undefined {
		let startupKind = super.doResolveStartupKind();
		if (typeof startupKind !== 'number') {
			const timing = performance.getEntriesByType('navigation').at(0) as PerformanceNavigationTiming | undefined;
			if (timing?.type === 'reload') {
				// MDN: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type#value
				startupKind = StartupKind.ReloadedWindow;
			}
		}

		return startupKind;
	}
}

registerSingleton(ILifecycleService, BrowserLifecycleService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/lifecycle/common/lifecycle.ts]---
Location: vscode-main/src/vs/workbench/services/lifecycle/common/lifecycle.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const ILifecycleService = createDecorator<ILifecycleService>('lifecycleService');

/**
 * An event that is send out when the window is about to close. Clients have a chance to veto
 * the closing by either calling veto with a boolean "true" directly or with a promise that
 * resolves to a boolean. Returning a promise is useful in cases of long running operations
 * on shutdown.
 *
 * Note: It is absolutely important to avoid long running promises if possible. Please try hard
 * to return a boolean directly. Returning a promise has quite an impact on the shutdown sequence!
 */
export interface BeforeShutdownEvent {

	/**
	 * The reason why the application will be shutting down.
	 */
	readonly reason: ShutdownReason;

	/**
	 * Allows to veto the shutdown. The veto can be a long running operation but it
	 * will block the application from closing.
	 *
	 * @param id to identify the veto operation in case it takes very long or never
	 * completes.
	 */
	veto(value: boolean | Promise<boolean>, id: string): void;
}

export interface InternalBeforeShutdownEvent extends BeforeShutdownEvent {

	/**
	 * Allows to set a veto operation to run after all other
	 * vetos have been handled from the `BeforeShutdownEvent`
	 *
	 * This method is hidden from the API because it is intended
	 * to be only used once internally.
	 */
	finalVeto(vetoFn: () => boolean | Promise<boolean>, id: string): void;
}

/**
 * An event that signals an error happened during `onBeforeShutdown` veto handling.
 * In this case the shutdown operation will not proceed because this is an unexpected
 * condition that is treated like a veto.
 */
export interface BeforeShutdownErrorEvent {

	/**
	 * The reason why the application is shutting down.
	 */
	readonly reason: ShutdownReason;

	/**
	 * The error that happened during shutdown handling.
	 */
	readonly error: Error;
}

export enum WillShutdownJoinerOrder {

	/**
	 * Joiners to run before the `Last` joiners. This is the default order and best for
	 * most cases. You can be sure that services are still functional at this point.
	 */
	Default = 1,

	/**
	 * The joiners to run last. This should ONLY be used in rare cases when you have no
	 * dependencies to workbench services or state. The workbench may be in a state where
	 * resources can no longer be accessed or changed.
	 */
	Last
}

export interface IWillShutdownEventJoiner {
	readonly id: string;
	readonly label: string;
	readonly order?: WillShutdownJoinerOrder;
}

export interface IWillShutdownEventDefaultJoiner extends IWillShutdownEventJoiner {
	readonly order?: WillShutdownJoinerOrder.Default;
}

export interface IWillShutdownEventLastJoiner extends IWillShutdownEventJoiner {
	readonly order: WillShutdownJoinerOrder.Last;
}

/**
 * An event that is send out when the window closes. Clients have a chance to join the closing
 * by providing a promise from the join method. Returning a promise is useful in cases of long
 * running operations on shutdown.
 *
 * Note: It is absolutely important to avoid long running promises if possible. Please try hard
 * to return a boolean directly. Returning a promise has quite an impact on the shutdown sequence!
 */
export interface WillShutdownEvent {

	/**
	 * The reason why the application is shutting down.
	 */
	readonly reason: ShutdownReason;

	/**
	 * A token that will signal cancellation when the
	 * shutdown was forced by the user.
	 */
	readonly token: CancellationToken;

	/**
	 * Allows to join the shutdown. The promise can be a long running operation but it
	 * will block the application from closing.
	 *
	 * @param promise the promise to join the shutdown event.
	 * @param joiner to identify the join operation in case it takes very long or never
	 * completes.
	 */
	join(promise: Promise<void>, joiner: IWillShutdownEventDefaultJoiner): void;

	/**
	 * Allows to join the shutdown at the end. The promise can be a long running operation but it
	 * will block the application from closing.
	 *
	 * @param promiseFn the promise to join the shutdown event.
	 * @param joiner to identify the join operation in case it takes very long or never
	 * completes.
	 */
	join(promiseFn: (() => Promise<void>), joiner: IWillShutdownEventLastJoiner): void;

	/**
	 * Allows to access the joiners that have not finished joining this event.
	 */
	joiners(): IWillShutdownEventJoiner[];

	/**
	 * Allows to enforce the shutdown, even when there are
	 * pending `join` operations to complete.
	 */
	force(): void;
}

export const enum ShutdownReason {

	/**
	 * The window is closed.
	 */
	CLOSE = 1,

	/**
	 * The window closes because the application quits.
	 */
	QUIT,

	/**
	 * The window is reloaded.
	 */
	RELOAD,

	/**
	 * The window is loaded into a different workspace context.
	 */
	LOAD
}

export const enum StartupKind {
	NewWindow = 1,
	ReloadedWindow = 3,
	ReopenedWindow = 4
}

export function StartupKindToString(startupKind: StartupKind): string {
	switch (startupKind) {
		case StartupKind.NewWindow: return 'NewWindow';
		case StartupKind.ReloadedWindow: return 'ReloadedWindow';
		case StartupKind.ReopenedWindow: return 'ReopenedWindow';
	}
}

export const enum LifecyclePhase {

	/**
	 * The first phase signals that we are about to startup getting ready.
	 *
	 * Note: doing work in this phase blocks an editor from showing to
	 * the user, so please rather consider to use `Restored` phase.
	 */
	Starting = 1,

	/**
	 * Services are ready and the window is about to restore its UI state.
	 *
	 * Note: doing work in this phase blocks an editor from showing to
	 * the user, so please rather consider to use `Restored` phase.
	 */
	Ready = 2,

	/**
	 * Views, panels and editors have restored. Editors are given a bit of
	 * time to restore their contents.
	 */
	Restored = 3,

	/**
	 * The last phase after views, panels and editors have restored and
	 * some time has passed (2-5 seconds).
	 */
	Eventually = 4
}

export function LifecyclePhaseToString(phase: LifecyclePhase): string {
	switch (phase) {
		case LifecyclePhase.Starting: return 'Starting';
		case LifecyclePhase.Ready: return 'Ready';
		case LifecyclePhase.Restored: return 'Restored';
		case LifecyclePhase.Eventually: return 'Eventually';
	}
}

/**
 * A lifecycle service informs about lifecycle events of the
 * application, such as shutdown.
 */
export interface ILifecycleService {

	readonly _serviceBrand: undefined;

	/**
	 * Value indicates how this window got loaded.
	 */
	readonly startupKind: StartupKind;

	/**
	 * A flag indicating in what phase of the lifecycle we currently are.
	 */
	phase: LifecyclePhase;

	/**
	 * Fired before shutdown happens. Allows listeners to veto against the
	 * shutdown to prevent it from happening.
	 *
	 * The event carries a shutdown reason that indicates how the shutdown was triggered.
	 */
	readonly onBeforeShutdown: Event<BeforeShutdownEvent>;

	/**
	 * Fired when the shutdown was prevented by a component giving veto.
	 */
	readonly onShutdownVeto: Event<void>;

	/**
	 * Fired when an error happened during `onBeforeShutdown` veto handling.
	 * In this case the shutdown operation will not proceed because this is
	 * an unexpected condition that is treated like a veto.
	 *
	 * The event carries a shutdown reason that indicates how the shutdown was triggered.
	 */
	readonly onBeforeShutdownError: Event<BeforeShutdownErrorEvent>;

	/**
	 * Fired when no client is preventing the shutdown from happening (from `onBeforeShutdown`).
	 *
	 * This event can be joined with a long running operation via `WillShutdownEvent#join()` to
	 * handle long running shutdown operations.
	 *
	 * The event carries a shutdown reason that indicates how the shutdown was triggered.
	 */
	readonly onWillShutdown: Event<WillShutdownEvent>;

	/**
	 * A flag indicating that we are about to shutdown without further veto.
	 */
	readonly willShutdown: boolean;

	/**
	 * Fired when the shutdown is about to happen after long running shutdown operations
	 * have finished (from `onWillShutdown`).
	 *
	 * This event should be used to dispose resources.
	 */
	readonly onDidShutdown: Event<void>;

	/**
	 * Returns a promise that resolves when a certain lifecycle phase
	 * has started.
	 */
	when(phase: LifecyclePhase): Promise<void>;

	/**
	 * Triggers a shutdown of the workbench. Depending on native or web, this can have
	 * different implementations and behaviour.
	 *
	 * **Note:** this should normally not be called. See related methods in `IHostService`
	 * and `INativeHostService` to close a window or quit the application.
	 */
	shutdown(): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/lifecycle/common/lifecycleService.ts]---
Location: vscode-main/src/vs/workbench/services/lifecycle/common/lifecycleService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Barrier } from '../../../../base/common/async.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILifecycleService, WillShutdownEvent, StartupKind, LifecyclePhase, LifecyclePhaseToString, ShutdownReason, BeforeShutdownErrorEvent, InternalBeforeShutdownEvent } from './lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { mark } from '../../../../base/common/performance.js';
import { IStorageService, StorageScope, StorageTarget, WillSaveStateReason } from '../../../../platform/storage/common/storage.js';

export abstract class AbstractLifecycleService extends Disposable implements ILifecycleService {

	private static readonly LAST_SHUTDOWN_REASON_KEY = 'lifecyle.lastShutdownReason';

	declare readonly _serviceBrand: undefined;

	protected readonly _onBeforeShutdown = this._register(new Emitter<InternalBeforeShutdownEvent>());
	readonly onBeforeShutdown = this._onBeforeShutdown.event;

	protected readonly _onWillShutdown = this._register(new Emitter<WillShutdownEvent>());
	readonly onWillShutdown = this._onWillShutdown.event;

	protected readonly _onDidShutdown = this._register(new Emitter<void>());
	readonly onDidShutdown = this._onDidShutdown.event;

	protected readonly _onBeforeShutdownError = this._register(new Emitter<BeforeShutdownErrorEvent>());
	readonly onBeforeShutdownError = this._onBeforeShutdownError.event;

	protected readonly _onShutdownVeto = this._register(new Emitter<void>());
	readonly onShutdownVeto = this._onShutdownVeto.event;

	private _startupKind: StartupKind;
	get startupKind(): StartupKind { return this._startupKind; }

	private _phase = LifecyclePhase.Starting;
	get phase(): LifecyclePhase { return this._phase; }

	protected _willShutdown = false;
	get willShutdown(): boolean { return this._willShutdown; }

	private readonly phaseWhen = new Map<LifecyclePhase, Barrier>();

	protected shutdownReason: ShutdownReason | undefined;

	constructor(
		@ILogService protected readonly logService: ILogService,
		@IStorageService protected readonly storageService: IStorageService
	) {
		super();

		// Resolve startup kind
		this._startupKind = this.resolveStartupKind();

		// Save shutdown reason to retrieve on next startup
		this._register(this.storageService.onWillSaveState(e => {
			if (e.reason === WillSaveStateReason.SHUTDOWN) {
				this.storageService.store(AbstractLifecycleService.LAST_SHUTDOWN_REASON_KEY, this.shutdownReason, StorageScope.WORKSPACE, StorageTarget.MACHINE);
			}
		}));
	}

	private resolveStartupKind(): StartupKind {
		const startupKind = this.doResolveStartupKind() ?? StartupKind.NewWindow;
		this.logService.trace(`[lifecycle] starting up (startup kind: ${startupKind})`);

		return startupKind;
	}

	protected doResolveStartupKind(): StartupKind | undefined {

		// Retrieve and reset last shutdown reason
		const lastShutdownReason = this.storageService.getNumber(AbstractLifecycleService.LAST_SHUTDOWN_REASON_KEY, StorageScope.WORKSPACE);
		this.storageService.remove(AbstractLifecycleService.LAST_SHUTDOWN_REASON_KEY, StorageScope.WORKSPACE);

		// Convert into startup kind
		let startupKind: StartupKind | undefined = undefined;
		switch (lastShutdownReason) {
			case ShutdownReason.RELOAD:
				startupKind = StartupKind.ReloadedWindow;
				break;
			case ShutdownReason.LOAD:
				startupKind = StartupKind.ReopenedWindow;
				break;
		}

		return startupKind;
	}

	set phase(value: LifecyclePhase) {
		if (value < this.phase) {
			throw new Error('Lifecycle cannot go backwards');
		}

		if (this._phase === value) {
			return;
		}

		this.logService.trace(`lifecycle: phase changed (value: ${value})`);

		this._phase = value;
		mark(`code/LifecyclePhase/${LifecyclePhaseToString(value)}`);

		const barrier = this.phaseWhen.get(this._phase);
		if (barrier) {
			barrier.open();
			this.phaseWhen.delete(this._phase);
		}
	}

	async when(phase: LifecyclePhase): Promise<void> {
		if (phase <= this._phase) {
			return;
		}

		let barrier = this.phaseWhen.get(phase);
		if (!barrier) {
			barrier = new Barrier();
			this.phaseWhen.set(phase, barrier);
		}

		await barrier.wait();
	}

	/**
	 * Subclasses to implement the explicit shutdown method.
	 */
	abstract shutdown(): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/lifecycle/electron-browser/lifecycleService.ts]---
Location: vscode-main/src/vs/workbench/services/lifecycle/electron-browser/lifecycleService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { handleVetos } from '../../../../platform/lifecycle/common/lifecycle.js';
import { ShutdownReason, ILifecycleService, IWillShutdownEventJoiner, WillShutdownJoinerOrder } from '../common/lifecycle.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ipcRenderer } from '../../../../base/parts/sandbox/electron-browser/globals.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { AbstractLifecycleService } from '../common/lifecycleService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { Promises, disposableTimeout, raceCancellation } from '../../../../base/common/async.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';

export class NativeLifecycleService extends AbstractLifecycleService {

	private static readonly BEFORE_SHUTDOWN_WARNING_DELAY = 5000;
	private static readonly WILL_SHUTDOWN_WARNING_DELAY = 800;

	constructor(
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService
	) {
		super(logService, storageService);

		this.registerListeners();
	}

	private registerListeners(): void {
		const windowId = this.nativeHostService.windowId;

		// Main side indicates that window is about to unload, check for vetos
		ipcRenderer.on('vscode:onBeforeUnload', async (event: unknown, ...args: unknown[]) => {
			const reply = args[0] as { okChannel: string; cancelChannel: string; reason: ShutdownReason };
			this.logService.trace(`[lifecycle] onBeforeUnload (reason: ${reply.reason})`);

			// trigger onBeforeShutdown events and veto collecting
			const veto = await this.handleBeforeShutdown(reply.reason);

			// veto: cancel unload
			if (veto) {
				this.logService.trace('[lifecycle] onBeforeUnload prevented via veto');

				// Indicate as event
				this._onShutdownVeto.fire();

				ipcRenderer.send(reply.cancelChannel, windowId);
			}

			// no veto: allow unload
			else {
				this.logService.trace('[lifecycle] onBeforeUnload continues without veto');

				this.shutdownReason = reply.reason;
				ipcRenderer.send(reply.okChannel, windowId);
			}
		});

		// Main side indicates that we will indeed shutdown
		ipcRenderer.on('vscode:onWillUnload', async (event: unknown, ...args: unknown[]) => {
			const reply = args[0] as { replyChannel: string; reason: ShutdownReason };
			this.logService.trace(`[lifecycle] onWillUnload (reason: ${reply.reason})`);

			// trigger onWillShutdown events and joining
			await this.handleWillShutdown(reply.reason);

			// trigger onDidShutdown event now that we know we will quit
			this._onDidShutdown.fire();

			// acknowledge to main side
			ipcRenderer.send(reply.replyChannel, windowId);
		});
	}

	protected async handleBeforeShutdown(reason: ShutdownReason): Promise<boolean> {
		const logService = this.logService;

		const vetos: (boolean | Promise<boolean>)[] = [];
		const pendingVetos = new Set<string>();

		let finalVeto: (() => boolean | Promise<boolean>) | undefined = undefined;
		let finalVetoId: string | undefined = undefined;

		// before-shutdown event with veto support
		this._onBeforeShutdown.fire({
			reason,
			veto(value, id) {
				vetos.push(value);

				// Log any veto instantly
				if (value === true) {
					logService.info(`[lifecycle]: Shutdown was prevented (id: ${id})`);
				}

				// Track promise completion
				else if (value instanceof Promise) {
					pendingVetos.add(id);
					value.then(veto => {
						if (veto === true) {
							logService.info(`[lifecycle]: Shutdown was prevented (id: ${id})`);
						}
					}).finally(() => pendingVetos.delete(id));
				}
			},
			finalVeto(value, id) {
				if (!finalVeto) {
					finalVeto = value;
					finalVetoId = id;
				} else {
					throw new Error(`[lifecycle]: Final veto is already defined (id: ${id})`);
				}
			}
		});

		const longRunningBeforeShutdownWarning = disposableTimeout(() => {
			logService.warn(`[lifecycle] onBeforeShutdown is taking a long time, pending operations: ${Array.from(pendingVetos).join(', ')}`);
		}, NativeLifecycleService.BEFORE_SHUTDOWN_WARNING_DELAY);

		try {

			// First: run list of vetos in parallel
			let veto = await handleVetos(vetos, error => this.handleBeforeShutdownError(error, reason));
			if (veto) {
				return veto;
			}

			// Second: run the final veto if defined
			if (finalVeto) {
				try {
					pendingVetos.add(finalVetoId as unknown as string);
					veto = await (finalVeto as () => Promise<boolean>)();
					if (veto) {
						logService.info(`[lifecycle]: Shutdown was prevented by final veto (id: ${finalVetoId})`);
					}
				} catch (error) {
					veto = true; // treat error as veto

					this.handleBeforeShutdownError(error, reason);
				}
			}

			return veto;
		} finally {
			longRunningBeforeShutdownWarning.dispose();
		}
	}

	private handleBeforeShutdownError(error: Error, reason: ShutdownReason): void {
		this.logService.error(`[lifecycle]: Error during before-shutdown phase (error: ${toErrorMessage(error)})`);

		this._onBeforeShutdownError.fire({ reason, error });
	}

	protected async handleWillShutdown(reason: ShutdownReason): Promise<void> {
		this._willShutdown = true;

		const joiners: Promise<void>[] = [];
		const lastJoiners: (() => Promise<void>)[] = [];
		const pendingJoiners = new Set<IWillShutdownEventJoiner>();
		const cts = new CancellationTokenSource();
		this._onWillShutdown.fire({
			reason,
			token: cts.token,
			joiners: () => Array.from(pendingJoiners.values()),
			join(promiseOrPromiseFn, joiner) {
				pendingJoiners.add(joiner);

				if (joiner.order === WillShutdownJoinerOrder.Last) {
					const promiseFn = typeof promiseOrPromiseFn === 'function' ? promiseOrPromiseFn : () => promiseOrPromiseFn;
					lastJoiners.push(() => promiseFn().finally(() => pendingJoiners.delete(joiner)));
				} else {
					const promise = typeof promiseOrPromiseFn === 'function' ? promiseOrPromiseFn() : promiseOrPromiseFn;
					promise.finally(() => pendingJoiners.delete(joiner));
					joiners.push(promise);
				}
			},
			force: () => {
				cts.dispose(true);
			}
		});

		const longRunningWillShutdownWarning = disposableTimeout(() => {
			this.logService.warn(`[lifecycle] onWillShutdown is taking a long time, pending operations: ${Array.from(pendingJoiners).map(joiner => joiner.id).join(', ')}`);
		}, NativeLifecycleService.WILL_SHUTDOWN_WARNING_DELAY);

		try {
			await raceCancellation(Promises.settled(joiners), cts.token);
		} catch (error) {
			this.logService.error(`[lifecycle]: Error during will-shutdown phase in default joiners (error: ${toErrorMessage(error)})`);
		}

		try {
			await raceCancellation(Promises.settled(lastJoiners.map(lastJoiner => lastJoiner())), cts.token);
		} catch (error) {
			this.logService.error(`[lifecycle]: Error during will-shutdown phase in last joiners (error: ${toErrorMessage(error)})`);
		}

		longRunningWillShutdownWarning.dispose();
	}

	shutdown(): Promise<void> {
		return this.nativeHostService.closeWindow();
	}
}

registerSingleton(ILifecycleService, NativeLifecycleService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/lifecycle/test/electron-browser/lifecycleService.test.ts]---
Location: vscode-main/src/vs/workbench/services/lifecycle/test/electron-browser/lifecycleService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../../base/common/async.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ShutdownReason, WillShutdownJoinerOrder } from '../../common/lifecycle.js';
import { NativeLifecycleService } from '../../electron-browser/lifecycleService.js';
import { workbenchInstantiationService } from '../../../../test/electron-browser/workbenchTestServices.js';

suite('Lifecycleservice', function () {

	let lifecycleService: TestLifecycleService;
	const disposables = new DisposableStore();

	class TestLifecycleService extends NativeLifecycleService {

		testHandleBeforeShutdown(reason: ShutdownReason): Promise<boolean> {
			return super.handleBeforeShutdown(reason);
		}

		testHandleWillShutdown(reason: ShutdownReason): Promise<void> {
			return super.handleWillShutdown(reason);
		}
	}

	setup(async () => {
		const instantiationService = workbenchInstantiationService(undefined, disposables);
		lifecycleService = disposables.add(instantiationService.createInstance(TestLifecycleService));
	});

	teardown(async () => {
		disposables.clear();
	});

	test('onBeforeShutdown - final veto called after other vetos', async function () {
		let vetoCalled = false;
		let finalVetoCalled = false;

		const order: number[] = [];

		disposables.add(lifecycleService.onBeforeShutdown(e => {
			e.veto(new Promise<boolean>(resolve => {
				vetoCalled = true;
				order.push(1);

				resolve(false);
			}), 'test');
		}));

		disposables.add(lifecycleService.onBeforeShutdown(e => {
			e.finalVeto(() => {
				return new Promise<boolean>(resolve => {
					finalVetoCalled = true;
					order.push(2);

					resolve(true);
				});
			}, 'test');
		}));

		const veto = await lifecycleService.testHandleBeforeShutdown(ShutdownReason.QUIT);

		assert.strictEqual(veto, true);
		assert.strictEqual(vetoCalled, true);
		assert.strictEqual(finalVetoCalled, true);
		assert.strictEqual(order[0], 1);
		assert.strictEqual(order[1], 2);
	});

	test('onBeforeShutdown - final veto not called when veto happened before', async function () {
		let vetoCalled = false;
		let finalVetoCalled = false;

		disposables.add(lifecycleService.onBeforeShutdown(e => {
			e.veto(new Promise<boolean>(resolve => {
				vetoCalled = true;

				resolve(true);
			}), 'test');
		}));

		disposables.add(lifecycleService.onBeforeShutdown(e => {
			e.finalVeto(() => {
				return new Promise<boolean>(resolve => {
					finalVetoCalled = true;

					resolve(true);
				});
			}, 'test');
		}));

		const veto = await lifecycleService.testHandleBeforeShutdown(ShutdownReason.QUIT);

		assert.strictEqual(veto, true);
		assert.strictEqual(vetoCalled, true);
		assert.strictEqual(finalVetoCalled, false);
	});

	test('onBeforeShutdown - veto with error is treated as veto', async function () {
		disposables.add(lifecycleService.onBeforeShutdown(e => {
			e.veto(new Promise<boolean>((resolve, reject) => {
				reject(new Error('Fail'));
			}), 'test');
		}));

		const veto = await lifecycleService.testHandleBeforeShutdown(ShutdownReason.QUIT);

		assert.strictEqual(veto, true);
	});

	test('onBeforeShutdown - final veto with error is treated as veto', async function () {
		disposables.add(lifecycleService.onBeforeShutdown(e => {
			e.finalVeto(() => new Promise<boolean>((resolve, reject) => {
				reject(new Error('Fail'));
			}), 'test');
		}));

		const veto = await lifecycleService.testHandleBeforeShutdown(ShutdownReason.QUIT);

		assert.strictEqual(veto, true);
	});

	test('onWillShutdown - join', async function () {
		let joinCalled = false;

		disposables.add(lifecycleService.onWillShutdown(e => {
			e.join(new Promise(resolve => {
				joinCalled = true;

				resolve();
			}), { id: 'test', label: 'test' });
		}));

		await lifecycleService.testHandleWillShutdown(ShutdownReason.QUIT);

		assert.strictEqual(joinCalled, true);
	});

	test('onWillShutdown - join with error is handled', async function () {
		let joinCalled = false;

		disposables.add(lifecycleService.onWillShutdown(e => {
			e.join(new Promise((resolve, reject) => {
				joinCalled = true;

				reject(new Error('Fail'));
			}), { id: 'test', label: 'test' });
		}));

		await lifecycleService.testHandleWillShutdown(ShutdownReason.QUIT);

		assert.strictEqual(joinCalled, true);
	});

	test('onWillShutdown - join order', async function () {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const order: string[] = [];

			disposables.add(lifecycleService.onWillShutdown(e => {
				e.join(async () => {
					order.push('disconnect start');
					await timeout(1);
					order.push('disconnect end');
				}, { id: 'test', label: 'test', order: WillShutdownJoinerOrder.Last });

				e.join((async () => {
					order.push('default start');
					await timeout(1);
					order.push('default end');
				})(), { id: 'test', label: 'test', order: WillShutdownJoinerOrder.Default });
			}));

			await lifecycleService.testHandleWillShutdown(ShutdownReason.QUIT);

			assert.deepStrictEqual(order, [
				'default start',
				'default end',
				'disconnect start',
				'disconnect end'
			]);
		});
	});

	test('willShutdown is set when shutting down', async function () {
		let willShutdownSet = false;

		disposables.add(lifecycleService.onWillShutdown(e => {
			e.join(new Promise(resolve => {
				if (lifecycleService.willShutdown) {
					willShutdownSet = true;
					resolve();
				}
			}), { id: 'test', label: 'test' });
		}));

		await lifecycleService.testHandleWillShutdown(ShutdownReason.QUIT);

		assert.strictEqual(willShutdownSet, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/localization/browser/localeService.ts]---
Location: vscode-main/src/vs/workbench/services/localization/browser/localeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Language, LANGUAGE_DEFAULT } from '../../../../base/common/platform.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ILanguagePackItem } from '../../../../platform/languagePacks/common/languagePacks.js';
import { IActiveLanguagePackService, ILocaleService } from '../common/locale.js';
import { IHostService } from '../../host/browser/host.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IExtensionGalleryService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ILogService } from '../../../../platform/log/common/log.js';

const localeStorage = new class LocaleStorage {

	private static readonly LOCAL_STORAGE_LOCALE_KEY = 'vscode.nls.locale';
	private static readonly LOCAL_STORAGE_EXTENSION_ID_KEY = 'vscode.nls.languagePackExtensionId';

	setLocale(locale: string): void {
		localStorage.setItem(LocaleStorage.LOCAL_STORAGE_LOCALE_KEY, locale);
		this.doSetLocaleToCookie(locale);
	}

	private doSetLocaleToCookie(locale: string): void {
		document.cookie = `${LocaleStorage.LOCAL_STORAGE_LOCALE_KEY}=${locale};path=/;max-age=3153600000`;
	}

	clearLocale(): void {
		localStorage.removeItem(LocaleStorage.LOCAL_STORAGE_LOCALE_KEY);
		this.doClearLocaleToCookie();
	}

	private doClearLocaleToCookie(): void {
		document.cookie = `${LocaleStorage.LOCAL_STORAGE_LOCALE_KEY}=;path=/;max-age=0`;
	}

	setExtensionId(extensionId: string): void {
		localStorage.setItem(LocaleStorage.LOCAL_STORAGE_EXTENSION_ID_KEY, extensionId);
	}

	getExtensionId(): string | null {
		return localStorage.getItem(LocaleStorage.LOCAL_STORAGE_EXTENSION_ID_KEY);
	}

	clearExtensionId(): void {
		localStorage.removeItem(LocaleStorage.LOCAL_STORAGE_EXTENSION_ID_KEY);
	}
};

export class WebLocaleService implements ILocaleService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IDialogService private readonly dialogService: IDialogService,
		@IHostService private readonly hostService: IHostService,
		@IProductService private readonly productService: IProductService
	) { }

	async setLocale(languagePackItem: ILanguagePackItem, _skipDialog = false): Promise<void> {
		const locale = languagePackItem.id;
		if (locale === Language.value() || (!locale && Language.value() === navigator.language.toLowerCase())) {
			return;
		}
		if (locale) {
			localeStorage.setLocale(locale);
			if (languagePackItem.extensionId) {
				localeStorage.setExtensionId(languagePackItem.extensionId);
			}
		} else {
			localeStorage.clearLocale();
			localeStorage.clearExtensionId();
		}

		const restartDialog = await this.dialogService.confirm({
			type: 'info',
			message: localize('relaunchDisplayLanguageMessage', "To change the display language, {0} needs to reload", this.productService.nameLong),
			detail: localize('relaunchDisplayLanguageDetail', "Press the reload button to refresh the page and set the display language to {0}.", languagePackItem.label),
			primaryButton: localize({ key: 'reload', comment: ['&& denotes a mnemonic character'] }, "&&Reload"),
		});

		if (restartDialog.confirmed) {
			this.hostService.restart();
		}
	}

	async clearLocalePreference(): Promise<void> {
		localeStorage.clearLocale();
		localeStorage.clearExtensionId();

		if (Language.value() === navigator.language.toLowerCase()) {
			return;
		}

		const restartDialog = await this.dialogService.confirm({
			type: 'info',
			message: localize('clearDisplayLanguageMessage', "To change the display language, {0} needs to reload", this.productService.nameLong),
			detail: localize('clearDisplayLanguageDetail', "Press the reload button to refresh the page and use your browser's language."),
			primaryButton: localize({ key: 'reload', comment: ['&& denotes a mnemonic character'] }, "&&Reload"),
		});

		if (restartDialog.confirmed) {
			this.hostService.restart();
		}
	}
}

class WebActiveLanguagePackService implements IActiveLanguagePackService {
	_serviceBrand: undefined;

	constructor(
		@IExtensionGalleryService private readonly galleryService: IExtensionGalleryService,
		@ILogService private readonly logService: ILogService
	) { }

	async getExtensionIdProvidingCurrentLocale(): Promise<string | undefined> {
		const language = Language.value();
		if (language === LANGUAGE_DEFAULT) {
			return undefined;
		}
		const extensionId = localeStorage.getExtensionId();
		if (extensionId) {
			return extensionId;
		}

		if (!this.galleryService.isEnabled()) {
			return undefined;
		}

		try {
			const tagResult = await this.galleryService.query({ text: `tag:lp-${language}` }, CancellationToken.None);

			// Only install extensions that are published by Microsoft and start with vscode-language-pack for extra certainty
			const extensionToInstall = tagResult.firstPage.find(e => e.publisher === 'MS-CEINTL' && e.name.startsWith('vscode-language-pack'));
			if (extensionToInstall) {
				localeStorage.setExtensionId(extensionToInstall.identifier.id);
				return extensionToInstall.identifier.id;
			}

			// TODO: If a non-Microsoft language pack is installed, we should prompt the user asking if they want to install that.
			// Since no such language packs exist yet, we can wait until that happens to implement this.
		} catch (e) {
			// Best effort
			this.logService.error(e);
		}

		return undefined;
	}
}

registerSingleton(ILocaleService, WebLocaleService, InstantiationType.Delayed);
registerSingleton(IActiveLanguagePackService, WebActiveLanguagePackService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/localization/common/locale.ts]---
Location: vscode-main/src/vs/workbench/services/localization/common/locale.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILanguagePackItem } from '../../../../platform/languagePacks/common/languagePacks.js';

export const ILocaleService = createDecorator<ILocaleService>('localizationService');

export interface ILocaleService {
	readonly _serviceBrand: undefined;
	setLocale(languagePackItem: ILanguagePackItem, skipDialog?: boolean): Promise<void>;
	clearLocalePreference(): Promise<void>;
}

export const IActiveLanguagePackService = createDecorator<IActiveLanguagePackService>('activeLanguageService');

export interface IActiveLanguagePackService {
	readonly _serviceBrand: undefined;
	getExtensionIdProvidingCurrentLocale(): Promise<string | undefined>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/localization/electron-browser/languagePackService.ts]---
Location: vscode-main/src/vs/workbench/services/localization/electron-browser/languagePackService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILanguagePackService } from '../../../../platform/languagePacks/common/languagePacks.js';
import { registerSharedProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';

registerSharedProcessRemoteService(ILanguagePackService, 'languagePacks');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/localization/electron-browser/localeService.ts]---
Location: vscode-main/src/vs/workbench/services/localization/electron-browser/localeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Language, LANGUAGE_DEFAULT } from '../../../../base/common/platform.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IJSONEditingService } from '../../configuration/common/jsonEditing.js';
import { IActiveLanguagePackService, ILocaleService } from '../common/locale.js';
import { ILanguagePackItem, ILanguagePackService } from '../../../../platform/languagePacks/common/languagePacks.js';
import { IPaneCompositePartService } from '../../panecomposite/browser/panecomposite.js';
import { IViewPaneContainer, ViewContainerLocation } from '../../../common/views.js';
import { IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { localize } from '../../../../nls.js';
import { toAction } from '../../../../base/common/actions.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { parse } from '../../../../base/common/jsonc.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IHostService } from '../../host/browser/host.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

// duplicate of IExtensionsViewPaneContainer in contrib
interface IExtensionsViewPaneContainer extends IViewPaneContainer {
	readonly searchValue: string | undefined;
	search(text: string): void;
	refresh(): Promise<void>;
}

// duplicate of VIEWLET_ID in contrib/extensions
const EXTENSIONS_VIEWLET_ID = 'workbench.view.extensions';

class NativeLocaleService implements ILocaleService {
	_serviceBrand: undefined;

	constructor(
		@IJSONEditingService private readonly jsonEditingService: IJSONEditingService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@INotificationService private readonly notificationService: INotificationService,
		@ILanguagePackService private readonly languagePackService: ILanguagePackService,
		@IPaneCompositePartService private readonly paneCompositePartService: IPaneCompositePartService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IProgressService private readonly progressService: IProgressService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IEditorService private readonly editorService: IEditorService,
		@IDialogService private readonly dialogService: IDialogService,
		@IHostService private readonly hostService: IHostService,
		@IProductService private readonly productService: IProductService
	) { }

	private async validateLocaleFile(): Promise<boolean> {
		try {
			const content = await this.textFileService.read(this.environmentService.argvResource, { encoding: 'utf8' });

			// This is the same logic that we do where argv.json is parsed so mirror that:
			// https://github.com/microsoft/vscode/blob/32d40cf44e893e87ac33ac4f08de1e5f7fe077fc/src/main.js#L238-L246
			parse(content.value);
		} catch (error) {
			this.notificationService.notify({
				severity: Severity.Error,
				message: localize('argvInvalid', 'Unable to write display language. Please open the runtime settings, correct errors/warnings in it and try again.'),
				actions: {
					primary: [
						toAction({
							id: 'openArgv',
							label: localize('openArgv', "Open Runtime Settings"),
							run: () => this.editorService.openEditor({ resource: this.environmentService.argvResource })
						})
					]
				}
			});
			return false;
		}
		return true;
	}

	private async writeLocaleValue(locale: string | undefined): Promise<boolean> {
		if (!(await this.validateLocaleFile())) {
			return false;
		}
		await this.jsonEditingService.write(this.environmentService.argvResource, [{ path: ['locale'], value: locale }], true);
		return true;
	}

	async setLocale(languagePackItem: ILanguagePackItem, skipDialog = false): Promise<void> {
		const locale = languagePackItem.id;
		if (locale === Language.value() || (!locale && Language.isDefaultVariant())) {
			return;
		}
		const installedLanguages = await this.languagePackService.getInstalledLanguages();
		try {

			// Only Desktop has the concept of installing language packs so we only do this for Desktop
			// and only if the language pack is not installed
			if (!installedLanguages.some(installedLanguage => installedLanguage.id === languagePackItem.id)) {

				// Only actually install a language pack from Microsoft
				if (languagePackItem.galleryExtension?.publisher.toLowerCase() !== 'ms-ceintl') {
					// Show the view so the user can see the language pack that they should install
					// as of now, there are no 3rd party language packs available on the Marketplace.
					const viewlet = await this.paneCompositePartService.openPaneComposite(EXTENSIONS_VIEWLET_ID, ViewContainerLocation.Sidebar);
					(viewlet?.getViewPaneContainer() as IExtensionsViewPaneContainer).search(`@id:${languagePackItem.extensionId}`);
					return;
				}

				await this.progressService.withProgress(
					{
						location: ProgressLocation.Notification,
						title: localize('installing', "Installing {0} language support...", languagePackItem.label),
					},
					progress => this.extensionManagementService.installFromGallery(languagePackItem.galleryExtension!, {
						// Setting this to false is how you get the extension to be synced with Settings Sync (if enabled).
						isMachineScoped: false,
					})
				);
			}

			if (!skipDialog && !await this.showRestartDialog(languagePackItem.label)) {
				return;
			}
			await this.writeLocaleValue(locale);
			await this.hostService.restart();
		} catch (err) {
			this.notificationService.error(err);
		}
	}

	async clearLocalePreference(): Promise<void> {
		try {
			await this.writeLocaleValue(undefined);
			if (!Language.isDefaultVariant()) {
				await this.showRestartDialog('English');
			}
		} catch (err) {
			this.notificationService.error(err);
		}
	}

	private async showRestartDialog(languageName: string): Promise<boolean> {
		const { confirmed } = await this.dialogService.confirm({
			message: localize('restartDisplayLanguageMessage1', "Restart {0} to switch to {1}?", this.productService.nameLong, languageName),
			detail: localize(
				'restartDisplayLanguageDetail1',
				"To change the display language to {0}, {1} needs to restart.",
				languageName,
				this.productService.nameLong
			),
			primaryButton: localize({ key: 'restart', comment: ['&& denotes a mnemonic character'] }, "&&Restart"),
		});

		return confirmed;
	}
}

// This is its own service because the localeService depends on IJSONEditingService which causes a circular dependency
// Once that's ironed out, we can fold this into the localeService.
class NativeActiveLanguagePackService implements IActiveLanguagePackService {
	_serviceBrand: undefined;

	constructor(
		@ILanguagePackService private readonly languagePackService: ILanguagePackService
	) { }

	async getExtensionIdProvidingCurrentLocale(): Promise<string | undefined> {
		const language = Language.value();
		if (language === LANGUAGE_DEFAULT) {
			return undefined;
		}
		const languages = await this.languagePackService.getInstalledLanguages();
		const languagePack = languages.find(l => l.id === language);
		return languagePack?.extensionId;
	}
}

registerSingleton(ILocaleService, NativeLocaleService, InstantiationType.Delayed);
registerSingleton(IActiveLanguagePackService, NativeActiveLanguagePackService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/log/common/logConstants.ts]---
Location: vscode-main/src/vs/workbench/services/log/common/logConstants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { LoggerGroup } from '../../../../platform/log/common/log.js';

export const windowLogId = 'rendererLog';
export const windowLogGroup: LoggerGroup = { id: windowLogId, name: localize('window', "Window") };
export const showWindowLogActionId = 'workbench.action.showWindowLog';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/log/electron-browser/logService.ts]---
Location: vscode-main/src/vs/workbench/services/log/electron-browser/logService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ConsoleLogger, ILogger } from '../../../../platform/log/common/log.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { LoggerChannelClient } from '../../../../platform/log/common/logIpc.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { windowLogGroup, windowLogId } from '../common/logConstants.js';
import { LogService } from '../../../../platform/log/common/logService.js';

export class NativeLogService extends LogService {

	constructor(loggerService: LoggerChannelClient, environmentService: INativeWorkbenchEnvironmentService) {

		const disposables = new DisposableStore();

		const fileLogger = disposables.add(loggerService.createLogger(environmentService.logFile, { id: windowLogId, name: windowLogGroup.name, group: windowLogGroup }));

		let consoleLogger: ILogger;
		if (environmentService.isExtensionDevelopment && !!environmentService.extensionTestsLocationURI) {
			// Extension development test CLI: forward everything to main side
			consoleLogger = loggerService.createConsoleMainLogger();
		} else {
			// Normal mode: Log to console
			consoleLogger = new ConsoleLogger(fileLogger.getLevel());
		}

		super(fileLogger, [consoleLogger]);

		this._register(disposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/mcp/browser/mcpGalleryManifestService.ts]---
Location: vscode-main/src/vs/workbench/services/mcp/browser/mcpGalleryManifestService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMcpGalleryManifest, IMcpGalleryManifestService, McpGalleryManifestStatus } from '../../../../platform/mcp/common/mcpGalleryManifest.js';
import { McpGalleryManifestService as McpGalleryManifestService } from '../../../../platform/mcp/common/mcpGalleryManifestService.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IRequestService } from '../../../../platform/request/common/request.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Emitter } from '../../../../base/common/event.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IMcpGalleryConfig, mcpGalleryServiceUrlConfig } from '../../../../platform/mcp/common/mcpManagement.js';

export class WorkbenchMcpGalleryManifestService extends McpGalleryManifestService implements IMcpGalleryManifestService {

	private mcpGalleryManifest: IMcpGalleryManifest | null = null;

	private _onDidChangeMcpGalleryManifest = this._register(new Emitter<IMcpGalleryManifest | null>());
	override readonly onDidChangeMcpGalleryManifest = this._onDidChangeMcpGalleryManifest.event;

	private currentStatus: McpGalleryManifestStatus = McpGalleryManifestStatus.Unavailable;
	override get mcpGalleryManifestStatus(): McpGalleryManifestStatus { return this.currentStatus; }
	private _onDidChangeMcpGalleryManifestStatus = this._register(new Emitter<McpGalleryManifestStatus>());
	override readonly onDidChangeMcpGalleryManifestStatus = this._onDidChangeMcpGalleryManifestStatus.event;

	constructor(
		@IProductService productService: IProductService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IRequestService requestService: IRequestService,
		@ILogService logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super(productService, requestService, logService);
		const remoteConnection = remoteAgentService.getConnection();
		if (remoteConnection) {
			const channel = remoteConnection.getChannel('mcpGalleryManifest');
			this.getMcpGalleryManifest().then(manifest => {
				channel.call('setMcpGalleryManifest', [manifest]);
				this._register(this.onDidChangeMcpGalleryManifest(manifest => channel.call('setMcpGalleryManifest', [manifest])));
			});
		}
	}

	private initPromise: Promise<void> | undefined;
	override async getMcpGalleryManifest(): Promise<IMcpGalleryManifest | null> {
		if (!this.initPromise) {
			this.initPromise = this.doGetMcpGalleryManifest();
		}
		await this.initPromise;
		return this.mcpGalleryManifest;
	}

	private async doGetMcpGalleryManifest(): Promise<void> {
		await this.getAndUpdateMcpGalleryManifest();

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(mcpGalleryServiceUrlConfig) || e.affectsConfiguration('chat.mcp.gallery.version')) {
				this.getAndUpdateMcpGalleryManifest();
			}
		}));
	}

	private async getAndUpdateMcpGalleryManifest(): Promise<void> {
		const mcpGalleryConfig = this.configurationService.getValue<IMcpGalleryConfig | undefined>('chat.mcp.gallery');
		if (mcpGalleryConfig?.serviceUrl) {
			this.update(await this.createMcpGalleryManifest(mcpGalleryConfig.serviceUrl, mcpGalleryConfig.version));
		} else {
			this.update(await super.getMcpGalleryManifest());
		}
	}

	private update(manifest: IMcpGalleryManifest | null): void {
		if (this.mcpGalleryManifest?.url === manifest?.url && this.mcpGalleryManifest?.version === manifest?.version) {
			return;
		}

		this.mcpGalleryManifest = manifest;
		if (this.mcpGalleryManifest) {
			this.logService.info('MCP Registry configured:', this.mcpGalleryManifest.url);
		} else {
			this.logService.info('No MCP Registry configured');
		}
		this.currentStatus = this.mcpGalleryManifest ? McpGalleryManifestStatus.Available : McpGalleryManifestStatus.Unavailable;
		this._onDidChangeMcpGalleryManifest.fire(this.mcpGalleryManifest);
		this._onDidChangeMcpGalleryManifestStatus.fire(this.currentStatus);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/mcp/browser/mcpWorkbenchManagementService.ts]---
Location: vscode-main/src/vs/workbench/services/mcp/browser/mcpWorkbenchManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IRemoteUserDataProfilesService } from '../../userDataProfile/common/remoteUserDataProfiles.js';
import { WorkbenchMcpManagementService as BaseWorkbenchMcpManagementService, IWorkbenchMcpManagementService } from '../common/mcpWorkbenchManagementService.js';
import { McpManagementService } from '../../../../platform/mcp/common/mcpManagementService.js';
import { IAllowedMcpServersService } from '../../../../platform/mcp/common/mcpManagement.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class WorkbenchMcpManagementService extends BaseWorkbenchMcpManagementService {

	constructor(
		@IAllowedMcpServersService allowedMcpServersService: IAllowedMcpServersService,
		@ILogService logService: ILogService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IRemoteUserDataProfilesService remoteUserDataProfilesService: IRemoteUserDataProfilesService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		const mMcpManagementService = instantiationService.createInstance(McpManagementService);
		super(mMcpManagementService, allowedMcpServersService, logService, userDataProfileService, uriIdentityService, workspaceContextService, remoteAgentService, userDataProfilesService, remoteUserDataProfilesService, instantiationService);
		this._register(mMcpManagementService);
	}
}

registerSingleton(IWorkbenchMcpManagementService, WorkbenchMcpManagementService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/mcp/common/mcpWorkbenchManagementService.ts]---
Location: vscode-main/src/vs/workbench/services/mcp/common/mcpWorkbenchManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { ILocalMcpServer, IMcpManagementService, IGalleryMcpServer, InstallOptions, InstallMcpServerEvent, UninstallMcpServerEvent, DidUninstallMcpServerEvent, InstallMcpServerResult, IInstallableMcpServer, IMcpGalleryService, UninstallOptions, IAllowedMcpServersService, RegistryType } from '../../../../platform/mcp/common/mcpManagement.js';
import { IInstantiationService, refineServiceDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IMcpResourceScannerService, McpResourceTarget } from '../../../../platform/mcp/common/mcpResourceScannerService.js';
import { isWorkspaceFolder, IWorkspaceContextService, IWorkspaceFolder, IWorkspaceFoldersChangeEvent } from '../../../../platform/workspace/common/workspace.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { MCP_CONFIGURATION_KEY, WORKSPACE_STANDALONE_CONFIGURATIONS } from '../../configuration/common/configuration.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { URI } from '../../../../base/common/uri.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { McpManagementChannelClient } from '../../../../platform/mcp/common/mcpManagementIpc.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IRemoteUserDataProfilesService } from '../../userDataProfile/common/remoteUserDataProfiles.js';
import { AbstractMcpManagementService, AbstractMcpResourceManagementService, ILocalMcpServerInfo } from '../../../../platform/mcp/common/mcpManagementService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IMcpServerConfiguration } from '../../../../platform/mcp/common/mcpPlatformTypes.js';

export const USER_CONFIG_ID = 'usrlocal';
export const REMOTE_USER_CONFIG_ID = 'usrremote';
export const WORKSPACE_CONFIG_ID = 'workspace';
export const WORKSPACE_FOLDER_CONFIG_ID_PREFIX = 'ws';

export interface IWorkbencMcpServerInstallOptions extends InstallOptions {
	target?: ConfigurationTarget | IWorkspaceFolder;
}

export const enum LocalMcpServerScope {
	User = 'user',
	RemoteUser = 'remoteUser',
	Workspace = 'workspace',
}

export interface IWorkbenchLocalMcpServer extends ILocalMcpServer {
	readonly id: string;
	readonly scope: LocalMcpServerScope;
}

export interface InstallWorkbenchMcpServerEvent extends InstallMcpServerEvent {
	readonly scope: LocalMcpServerScope;
}

export interface IWorkbenchMcpServerInstallResult extends InstallMcpServerResult {
	readonly local?: IWorkbenchLocalMcpServer;
}

export interface UninstallWorkbenchMcpServerEvent extends UninstallMcpServerEvent {
	readonly scope: LocalMcpServerScope;
}

export interface DidUninstallWorkbenchMcpServerEvent extends DidUninstallMcpServerEvent {
	readonly scope: LocalMcpServerScope;
}

export const IWorkbenchMcpManagementService = refineServiceDecorator<IMcpManagementService, IWorkbenchMcpManagementService>(IMcpManagementService);
export interface IWorkbenchMcpManagementService extends IMcpManagementService {
	readonly _serviceBrand: undefined;

	readonly onInstallMcpServerInCurrentProfile: Event<InstallWorkbenchMcpServerEvent>;
	readonly onDidInstallMcpServersInCurrentProfile: Event<readonly IWorkbenchMcpServerInstallResult[]>;
	readonly onDidUpdateMcpServersInCurrentProfile: Event<readonly IWorkbenchMcpServerInstallResult[]>;
	readonly onUninstallMcpServerInCurrentProfile: Event<UninstallWorkbenchMcpServerEvent>;
	readonly onDidUninstallMcpServerInCurrentProfile: Event<DidUninstallWorkbenchMcpServerEvent>;
	readonly onDidChangeProfile: Event<void>;

	getInstalled(): Promise<IWorkbenchLocalMcpServer[]>;
	install(server: IInstallableMcpServer | URI, options?: IWorkbencMcpServerInstallOptions): Promise<IWorkbenchLocalMcpServer>;
	installFromGallery(server: IGalleryMcpServer, options?: InstallOptions): Promise<IWorkbenchLocalMcpServer>;
	updateMetadata(local: ILocalMcpServer, server: IGalleryMcpServer, profileLocation?: URI): Promise<IWorkbenchLocalMcpServer>;
}

export class WorkbenchMcpManagementService extends AbstractMcpManagementService implements IWorkbenchMcpManagementService {

	private _onInstallMcpServer = this._register(new Emitter<InstallMcpServerEvent>());
	readonly onInstallMcpServer = this._onInstallMcpServer.event;

	private _onDidInstallMcpServers = this._register(new Emitter<readonly InstallMcpServerResult[]>());
	readonly onDidInstallMcpServers = this._onDidInstallMcpServers.event;

	private _onDidUpdateMcpServers = this._register(new Emitter<readonly InstallMcpServerResult[]>());
	readonly onDidUpdateMcpServers = this._onDidUpdateMcpServers.event;

	private _onUninstallMcpServer = this._register(new Emitter<UninstallMcpServerEvent>());
	readonly onUninstallMcpServer = this._onUninstallMcpServer.event;

	private _onDidUninstallMcpServer = this._register(new Emitter<DidUninstallMcpServerEvent>());
	readonly onDidUninstallMcpServer = this._onDidUninstallMcpServer.event;

	private readonly _onInstallMcpServerInCurrentProfile = this._register(new Emitter<InstallWorkbenchMcpServerEvent>());
	readonly onInstallMcpServerInCurrentProfile = this._onInstallMcpServerInCurrentProfile.event;

	private readonly _onDidInstallMcpServersInCurrentProfile = this._register(new Emitter<readonly IWorkbenchMcpServerInstallResult[]>());
	readonly onDidInstallMcpServersInCurrentProfile = this._onDidInstallMcpServersInCurrentProfile.event;

	private readonly _onDidUpdateMcpServersInCurrentProfile = this._register(new Emitter<readonly IWorkbenchMcpServerInstallResult[]>());
	readonly onDidUpdateMcpServersInCurrentProfile = this._onDidUpdateMcpServersInCurrentProfile.event;

	private readonly _onUninstallMcpServerInCurrentProfile = this._register(new Emitter<UninstallWorkbenchMcpServerEvent>());
	readonly onUninstallMcpServerInCurrentProfile = this._onUninstallMcpServerInCurrentProfile.event;

	private readonly _onDidUninstallMcpServerInCurrentProfile = this._register(new Emitter<DidUninstallWorkbenchMcpServerEvent>());
	readonly onDidUninstallMcpServerInCurrentProfile = this._onDidUninstallMcpServerInCurrentProfile.event;

	private readonly _onDidChangeProfile = this._register(new Emitter<void>());
	readonly onDidChangeProfile = this._onDidChangeProfile.event;

	private readonly workspaceMcpManagementService: IMcpManagementService;
	private readonly remoteMcpManagementService: IMcpManagementService | undefined;

	constructor(
		private readonly mcpManagementService: IMcpManagementService,
		@IAllowedMcpServersService allowedMcpServersService: IAllowedMcpServersService,
		@ILogService logService: ILogService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IRemoteUserDataProfilesService private readonly remoteUserDataProfilesService: IRemoteUserDataProfilesService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(allowedMcpServersService, logService);

		this.workspaceMcpManagementService = this._register(instantiationService.createInstance(WorkspaceMcpManagementService));
		const remoteAgentConnection = remoteAgentService.getConnection();
		if (remoteAgentConnection) {
			this.remoteMcpManagementService = this._register(instantiationService.createInstance(McpManagementChannelClient, remoteAgentConnection.getChannel<IChannel>('mcpManagement')));
		}

		this._register(this.mcpManagementService.onInstallMcpServer(e => {
			this._onInstallMcpServer.fire(e);
			if (uriIdentityService.extUri.isEqual(e.mcpResource, this.userDataProfileService.currentProfile.mcpResource)) {
				this._onInstallMcpServerInCurrentProfile.fire({ ...e, scope: LocalMcpServerScope.User });
			}
		}));

		this._register(this.mcpManagementService.onDidInstallMcpServers(e => {
			const { mcpServerInstallResult, mcpServerInstallResultInCurrentProfile } = this.createInstallMcpServerResultsFromEvent(e, LocalMcpServerScope.User);
			this._onDidInstallMcpServers.fire(mcpServerInstallResult);
			if (mcpServerInstallResultInCurrentProfile.length) {
				this._onDidInstallMcpServersInCurrentProfile.fire(mcpServerInstallResultInCurrentProfile);
			}
		}));

		this._register(this.mcpManagementService.onDidUpdateMcpServers(e => {
			const { mcpServerInstallResult, mcpServerInstallResultInCurrentProfile } = this.createInstallMcpServerResultsFromEvent(e, LocalMcpServerScope.User);
			this._onDidUpdateMcpServers.fire(mcpServerInstallResult);
			if (mcpServerInstallResultInCurrentProfile.length) {
				this._onDidUpdateMcpServersInCurrentProfile.fire(mcpServerInstallResultInCurrentProfile);
			}
		}));

		this._register(this.mcpManagementService.onUninstallMcpServer(e => {
			this._onUninstallMcpServer.fire(e);
			if (uriIdentityService.extUri.isEqual(e.mcpResource, this.userDataProfileService.currentProfile.mcpResource)) {
				this._onUninstallMcpServerInCurrentProfile.fire({ ...e, scope: LocalMcpServerScope.User });
			}
		}));

		this._register(this.mcpManagementService.onDidUninstallMcpServer(e => {
			this._onDidUninstallMcpServer.fire(e);
			if (uriIdentityService.extUri.isEqual(e.mcpResource, this.userDataProfileService.currentProfile.mcpResource)) {
				this._onDidUninstallMcpServerInCurrentProfile.fire({ ...e, scope: LocalMcpServerScope.User });
			}
		}));

		this._register(this.workspaceMcpManagementService.onInstallMcpServer(async e => {
			this._onInstallMcpServer.fire(e);
			this._onInstallMcpServerInCurrentProfile.fire({ ...e, scope: LocalMcpServerScope.Workspace });
		}));

		this._register(this.workspaceMcpManagementService.onDidInstallMcpServers(async e => {
			const { mcpServerInstallResult } = this.createInstallMcpServerResultsFromEvent(e, LocalMcpServerScope.Workspace);
			this._onDidInstallMcpServers.fire(mcpServerInstallResult);
			this._onDidInstallMcpServersInCurrentProfile.fire(mcpServerInstallResult);
		}));

		this._register(this.workspaceMcpManagementService.onUninstallMcpServer(async e => {
			this._onUninstallMcpServer.fire(e);
			this._onUninstallMcpServerInCurrentProfile.fire({ ...e, scope: LocalMcpServerScope.Workspace });
		}));

		this._register(this.workspaceMcpManagementService.onDidUninstallMcpServer(async e => {
			this._onDidUninstallMcpServer.fire(e);
			this._onDidUninstallMcpServerInCurrentProfile.fire({ ...e, scope: LocalMcpServerScope.Workspace });
		}));

		this._register(this.workspaceMcpManagementService.onDidUpdateMcpServers(e => {
			const { mcpServerInstallResult } = this.createInstallMcpServerResultsFromEvent(e, LocalMcpServerScope.Workspace);
			this._onDidUpdateMcpServers.fire(mcpServerInstallResult);
			this._onDidUpdateMcpServersInCurrentProfile.fire(mcpServerInstallResult);
		}));

		if (this.remoteMcpManagementService) {
			this._register(this.remoteMcpManagementService.onInstallMcpServer(async e => {
				this._onInstallMcpServer.fire(e);
				const remoteMcpResource = await this.getRemoteMcpResource(this.userDataProfileService.currentProfile.mcpResource);
				if (remoteMcpResource ? uriIdentityService.extUri.isEqual(e.mcpResource, remoteMcpResource) : this.userDataProfileService.currentProfile.isDefault) {
					this._onInstallMcpServerInCurrentProfile.fire({ ...e, scope: LocalMcpServerScope.RemoteUser });
				}
			}));

			this._register(this.remoteMcpManagementService.onDidInstallMcpServers(e => this.handleRemoteInstallMcpServerResultsFromEvent(e, this._onDidInstallMcpServers, this._onDidInstallMcpServersInCurrentProfile)));
			this._register(this.remoteMcpManagementService.onDidUpdateMcpServers(e => this.handleRemoteInstallMcpServerResultsFromEvent(e, this._onDidInstallMcpServers, this._onDidInstallMcpServersInCurrentProfile)));

			this._register(this.remoteMcpManagementService.onUninstallMcpServer(async e => {
				this._onUninstallMcpServer.fire(e);
				const remoteMcpResource = await this.getRemoteMcpResource(this.userDataProfileService.currentProfile.mcpResource);
				if (remoteMcpResource ? uriIdentityService.extUri.isEqual(e.mcpResource, remoteMcpResource) : this.userDataProfileService.currentProfile.isDefault) {
					this._onUninstallMcpServerInCurrentProfile.fire({ ...e, scope: LocalMcpServerScope.RemoteUser });
				}
			}));

			this._register(this.remoteMcpManagementService.onDidUninstallMcpServer(async e => {
				this._onDidUninstallMcpServer.fire(e);
				const remoteMcpResource = await this.getRemoteMcpResource(this.userDataProfileService.currentProfile.mcpResource);
				if (remoteMcpResource ? uriIdentityService.extUri.isEqual(e.mcpResource, remoteMcpResource) : this.userDataProfileService.currentProfile.isDefault) {
					this._onDidUninstallMcpServerInCurrentProfile.fire({ ...e, scope: LocalMcpServerScope.RemoteUser });
				}
			}));
		}

		this._register(userDataProfileService.onDidChangeCurrentProfile(e => {
			if (!this.uriIdentityService.extUri.isEqual(e.previous.mcpResource, e.profile.mcpResource)) {
				this._onDidChangeProfile.fire();
			}
		}));
	}

	private createInstallMcpServerResultsFromEvent(e: readonly InstallMcpServerResult[], scope: LocalMcpServerScope): { mcpServerInstallResult: IWorkbenchMcpServerInstallResult[]; mcpServerInstallResultInCurrentProfile: IWorkbenchMcpServerInstallResult[] } {
		const mcpServerInstallResult: IWorkbenchMcpServerInstallResult[] = [];
		const mcpServerInstallResultInCurrentProfile: IWorkbenchMcpServerInstallResult[] = [];
		for (const result of e) {
			const workbenchResult = {
				...result,
				local: result.local ? this.toWorkspaceMcpServer(result.local, scope) : undefined
			};
			mcpServerInstallResult.push(workbenchResult);
			if (this.uriIdentityService.extUri.isEqual(result.mcpResource, this.userDataProfileService.currentProfile.mcpResource)) {
				mcpServerInstallResultInCurrentProfile.push(workbenchResult);
			}
		}

		return { mcpServerInstallResult, mcpServerInstallResultInCurrentProfile };
	}

	private async handleRemoteInstallMcpServerResultsFromEvent(e: readonly InstallMcpServerResult[], emitter: Emitter<readonly InstallMcpServerResult[]>, currentProfileEmitter: Emitter<readonly IWorkbenchMcpServerInstallResult[]>): Promise<void> {
		const mcpServerInstallResult: IWorkbenchMcpServerInstallResult[] = [];
		const mcpServerInstallResultInCurrentProfile: IWorkbenchMcpServerInstallResult[] = [];
		const remoteMcpResource = await this.getRemoteMcpResource(this.userDataProfileService.currentProfile.mcpResource);
		for (const result of e) {
			const workbenchResult = {
				...result,
				local: result.local ? this.toWorkspaceMcpServer(result.local, LocalMcpServerScope.RemoteUser) : undefined
			};
			mcpServerInstallResult.push(workbenchResult);
			if (remoteMcpResource ? this.uriIdentityService.extUri.isEqual(result.mcpResource, remoteMcpResource) : this.userDataProfileService.currentProfile.isDefault) {
				mcpServerInstallResultInCurrentProfile.push(workbenchResult);
			}
		}

		emitter.fire(mcpServerInstallResult);
		if (mcpServerInstallResultInCurrentProfile.length) {
			currentProfileEmitter.fire(mcpServerInstallResultInCurrentProfile);
		}
	}

	async getInstalled(): Promise<IWorkbenchLocalMcpServer[]> {
		const installed: IWorkbenchLocalMcpServer[] = [];
		const [userServers, remoteServers, workspaceServers] = await Promise.all([
			this.mcpManagementService.getInstalled(this.userDataProfileService.currentProfile.mcpResource),
			this.remoteMcpManagementService?.getInstalled(await this.getRemoteMcpResource()) ?? Promise.resolve<ILocalMcpServer[]>([]),
			this.workspaceMcpManagementService?.getInstalled() ?? Promise.resolve<ILocalMcpServer[]>([]),
		]);

		for (const server of userServers) {
			installed.push(this.toWorkspaceMcpServer(server, LocalMcpServerScope.User));
		}
		for (const server of remoteServers) {
			installed.push(this.toWorkspaceMcpServer(server, LocalMcpServerScope.RemoteUser));
		}
		for (const server of workspaceServers) {
			installed.push(this.toWorkspaceMcpServer(server, LocalMcpServerScope.Workspace));
		}

		return installed;
	}

	private toWorkspaceMcpServer(server: ILocalMcpServer, scope: LocalMcpServerScope): IWorkbenchLocalMcpServer {
		return { ...server, id: `mcp.config.${this.getConfigId(server, scope)}.${server.name}`, scope };
	}

	private getConfigId(server: ILocalMcpServer, scope: LocalMcpServerScope): string {
		if (scope === LocalMcpServerScope.User) {
			return USER_CONFIG_ID;
		}

		if (scope === LocalMcpServerScope.RemoteUser) {
			return REMOTE_USER_CONFIG_ID;
		}

		if (scope === LocalMcpServerScope.Workspace) {
			const workspace = this.workspaceContextService.getWorkspace();
			if (workspace.configuration && this.uriIdentityService.extUri.isEqual(workspace.configuration, server.mcpResource)) {
				return WORKSPACE_CONFIG_ID;
			}

			const workspaceFolders = workspace.folders;
			for (let index = 0; index < workspaceFolders.length; index++) {
				const workspaceFolder = workspaceFolders[index];
				if (this.uriIdentityService.extUri.isEqual(this.uriIdentityService.extUri.joinPath(workspaceFolder.uri, WORKSPACE_STANDALONE_CONFIGURATIONS[MCP_CONFIGURATION_KEY]), server.mcpResource)) {
					return `${WORKSPACE_FOLDER_CONFIG_ID_PREFIX}${index}`;
				}
			}
		}
		return 'unknown';
	}

	async install(server: IInstallableMcpServer, options?: IWorkbencMcpServerInstallOptions): Promise<IWorkbenchLocalMcpServer> {
		options = options ?? {};

		if (options.target === ConfigurationTarget.WORKSPACE || isWorkspaceFolder(options.target)) {
			const mcpResource = options.target === ConfigurationTarget.WORKSPACE ? this.workspaceContextService.getWorkspace().configuration : options.target.toResource(WORKSPACE_STANDALONE_CONFIGURATIONS[MCP_CONFIGURATION_KEY]);
			if (!mcpResource) {
				throw new Error(`Illegal target: ${options.target}`);
			}
			options.mcpResource = mcpResource;
			const result = await this.workspaceMcpManagementService.install(server, options);
			return this.toWorkspaceMcpServer(result, LocalMcpServerScope.Workspace);
		}

		if (options.target === ConfigurationTarget.USER_REMOTE) {
			if (!this.remoteMcpManagementService) {
				throw new Error(`Illegal target: ${options.target}`);
			}
			options.mcpResource = await this.getRemoteMcpResource(options.mcpResource);
			const result = await this.remoteMcpManagementService.install(server, options);
			return this.toWorkspaceMcpServer(result, LocalMcpServerScope.RemoteUser);
		}

		if (options.target && options.target !== ConfigurationTarget.USER && options.target !== ConfigurationTarget.USER_LOCAL) {
			throw new Error(`Illegal target: ${options.target}`);
		}

		options.mcpResource = this.userDataProfileService.currentProfile.mcpResource;
		const result = await this.mcpManagementService.install(server, options);
		return this.toWorkspaceMcpServer(result, LocalMcpServerScope.User);
	}

	async installFromGallery(server: IGalleryMcpServer, options?: IWorkbencMcpServerInstallOptions): Promise<IWorkbenchLocalMcpServer> {
		options = options ?? {};

		if (options.target === ConfigurationTarget.WORKSPACE || isWorkspaceFolder(options.target)) {
			const mcpResource = options.target === ConfigurationTarget.WORKSPACE ? this.workspaceContextService.getWorkspace().configuration : options.target.toResource(WORKSPACE_STANDALONE_CONFIGURATIONS[MCP_CONFIGURATION_KEY]);
			if (!mcpResource) {
				throw new Error(`Illegal target: ${options.target}`);
			}
			options.mcpResource = mcpResource;
			const result = await this.workspaceMcpManagementService.installFromGallery(server, options);
			return this.toWorkspaceMcpServer(result, LocalMcpServerScope.Workspace);
		}

		if (options.target === ConfigurationTarget.USER_REMOTE) {
			if (!this.remoteMcpManagementService) {
				throw new Error(`Illegal target: ${options.target}`);
			}
			options.mcpResource = await this.getRemoteMcpResource(options.mcpResource);
			const result = await this.remoteMcpManagementService.installFromGallery(server, options);
			return this.toWorkspaceMcpServer(result, LocalMcpServerScope.RemoteUser);
		}

		if (options.target && options.target !== ConfigurationTarget.USER && options.target !== ConfigurationTarget.USER_LOCAL) {
			throw new Error(`Illegal target: ${options.target}`);
		}

		if (!options.mcpResource) {
			options.mcpResource = this.userDataProfileService.currentProfile.mcpResource;
		}
		const result = await this.mcpManagementService.installFromGallery(server, options);
		return this.toWorkspaceMcpServer(result, LocalMcpServerScope.User);
	}

	async updateMetadata(local: IWorkbenchLocalMcpServer, server: IGalleryMcpServer, profileLocation: URI): Promise<IWorkbenchLocalMcpServer> {
		if (local.scope === LocalMcpServerScope.Workspace) {
			const result = await this.workspaceMcpManagementService.updateMetadata(local, server, profileLocation);
			return this.toWorkspaceMcpServer(result, LocalMcpServerScope.Workspace);
		}

		if (local.scope === LocalMcpServerScope.RemoteUser) {
			if (!this.remoteMcpManagementService) {
				throw new Error(`Illegal target: ${local.scope}`);
			}
			const result = await this.remoteMcpManagementService.updateMetadata(local, server, profileLocation);
			return this.toWorkspaceMcpServer(result, LocalMcpServerScope.RemoteUser);
		}

		const result = await this.mcpManagementService.updateMetadata(local, server, profileLocation);
		return this.toWorkspaceMcpServer(result, LocalMcpServerScope.User);
	}

	async uninstall(server: IWorkbenchLocalMcpServer): Promise<void> {
		if (server.scope === LocalMcpServerScope.Workspace) {
			return this.workspaceMcpManagementService.uninstall(server);
		}

		if (server.scope === LocalMcpServerScope.RemoteUser) {
			if (!this.remoteMcpManagementService) {
				throw new Error(`Illegal target: ${server.scope}`);
			}
			return this.remoteMcpManagementService.uninstall(server);
		}

		return this.mcpManagementService.uninstall(server, { mcpResource: this.userDataProfileService.currentProfile.mcpResource });
	}

	private async getRemoteMcpResource(mcpResource?: URI): Promise<URI | undefined> {
		if (!mcpResource && this.userDataProfileService.currentProfile.isDefault) {
			return undefined;
		}
		mcpResource = mcpResource ?? this.userDataProfileService.currentProfile.mcpResource;
		let profile = this.userDataProfilesService.profiles.find(p => this.uriIdentityService.extUri.isEqual(p.mcpResource, mcpResource));
		if (profile) {
			profile = await this.remoteUserDataProfilesService.getRemoteProfile(profile);
		} else {
			profile = (await this.remoteUserDataProfilesService.getRemoteProfiles()).find(p => this.uriIdentityService.extUri.isEqual(p.mcpResource, mcpResource));
		}
		return profile?.mcpResource;
	}
}

class WorkspaceMcpResourceManagementService extends AbstractMcpResourceManagementService {

	constructor(
		mcpResource: URI,
		target: McpResourceTarget,
		@IMcpGalleryService mcpGalleryService: IMcpGalleryService,
		@IFileService fileService: IFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
		@IMcpResourceScannerService mcpResourceScannerService: IMcpResourceScannerService,
	) {
		super(mcpResource, target, mcpGalleryService, fileService, uriIdentityService, logService, mcpResourceScannerService);
	}

	override async installFromGallery(server: IGalleryMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		this.logService.trace('MCP Management Service: installGallery', server.name, server.galleryUrl);

		this._onInstallMcpServer.fire({ name: server.name, mcpResource: this.mcpResource });

		try {
			const packageType = options?.packageType ?? server.configuration.packages?.[0]?.registryType ?? RegistryType.REMOTE;

			const { mcpServerConfiguration, notices } = this.getMcpServerConfigurationFromManifest(server.configuration, packageType);

			if (notices.length > 0) {
				this.logService.warn(`MCP Management Service: Warnings while installing ${server.name}`, notices);
			}

			const installable: IInstallableMcpServer = {
				name: server.name,
				config: {
					...mcpServerConfiguration.config,
					gallery: server.galleryUrl ?? true,
					version: server.version
				},
				inputs: mcpServerConfiguration.inputs
			};

			await this.mcpResourceScannerService.addMcpServers([installable], this.mcpResource, this.target);

			await this.updateLocal();
			const local = (await this.getInstalled()).find(s => s.name === server.name);
			if (!local) {
				throw new Error(`Failed to install MCP server: ${server.name}`);
			}
			return local;
		} catch (e) {
			this._onDidInstallMcpServers.fire([{ name: server.name, source: server, error: e, mcpResource: this.mcpResource }]);
			throw e;
		}
	}

	override updateMetadata(): Promise<ILocalMcpServer> {
		throw new Error('Not supported');
	}

	protected override installFromUri(): Promise<ILocalMcpServer> {
		throw new Error('Not supported');
	}

	protected override async getLocalServerInfo(name: string, mcpServerConfig: IMcpServerConfiguration): Promise<ILocalMcpServerInfo | undefined> {
		if (!mcpServerConfig.gallery) {
			return undefined;
		}

		const [mcpServer] = await this.mcpGalleryService.getMcpServersFromGallery([{ name }]);
		if (!mcpServer) {
			return undefined;
		}

		return {
			name: mcpServer.name,
			version: mcpServerConfig.version,
			displayName: mcpServer.displayName,
			description: mcpServer.description,
			galleryUrl: mcpServer.galleryUrl,
			manifest: mcpServer.configuration,
			publisher: mcpServer.publisher,
			publisherDisplayName: mcpServer.publisherDisplayName,
			repositoryUrl: mcpServer.repositoryUrl,
			icon: mcpServer.icon,
		};
	}

	override canInstall(server: IGalleryMcpServer | IInstallableMcpServer): true | IMarkdownString {
		throw new Error('Not supported');
	}
}

class WorkspaceMcpManagementService extends AbstractMcpManagementService implements IMcpManagementService {

	private readonly _onInstallMcpServer = this._register(new Emitter<InstallMcpServerEvent>());
	readonly onInstallMcpServer = this._onInstallMcpServer.event;

	private readonly _onDidInstallMcpServers = this._register(new Emitter<readonly InstallMcpServerResult[]>());
	readonly onDidInstallMcpServers = this._onDidInstallMcpServers.event;

	private readonly _onDidUpdateMcpServers = this._register(new Emitter<readonly InstallMcpServerResult[]>());
	readonly onDidUpdateMcpServers = this._onDidUpdateMcpServers.event;

	private readonly _onUninstallMcpServer = this._register(new Emitter<UninstallMcpServerEvent>());
	readonly onUninstallMcpServer = this._onUninstallMcpServer.event;

	private readonly _onDidUninstallMcpServer = this._register(new Emitter<DidUninstallMcpServerEvent>());
	readonly onDidUninstallMcpServer = this._onDidUninstallMcpServer.event;

	private allMcpServers: ILocalMcpServer[] = [];

	private workspaceConfiguration?: URI | null;
	private readonly workspaceMcpManagementServices = new ResourceMap<{ service: WorkspaceMcpResourceManagementService } & IDisposable>();

	constructor(
		@IAllowedMcpServersService allowedMcpServersService: IAllowedMcpServersService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super(allowedMcpServersService, logService);
		this.initialize();
	}

	private async initialize(): Promise<void> {
		try {
			await this.onDidChangeWorkbenchState();
			await this.onDidChangeWorkspaceFolders({ added: this.workspaceContextService.getWorkspace().folders, removed: [], changed: [] });
			this._register(this.workspaceContextService.onDidChangeWorkspaceFolders(e => this.onDidChangeWorkspaceFolders(e)));
			this._register(this.workspaceContextService.onDidChangeWorkbenchState(e => this.onDidChangeWorkbenchState()));
		} catch (error) {
			this.logService.error('Failed to initialize workspace folders', error);
		}
	}

	private async onDidChangeWorkbenchState(): Promise<void> {
		if (this.workspaceConfiguration) {
			await this.removeWorkspaceService(this.workspaceConfiguration);
		}
		this.workspaceConfiguration = this.workspaceContextService.getWorkspace().configuration;
		if (this.workspaceConfiguration) {
			await this.addWorkspaceService(this.workspaceConfiguration, ConfigurationTarget.WORKSPACE);
		}
	}

	private async onDidChangeWorkspaceFolders(e: IWorkspaceFoldersChangeEvent): Promise<void> {
		try {
			await Promise.allSettled(e.removed.map(folder => this.removeWorkspaceService(folder.toResource(WORKSPACE_STANDALONE_CONFIGURATIONS[MCP_CONFIGURATION_KEY]))));
		} catch (error) {
			this.logService.error(error);
		}
		try {
			await Promise.allSettled(e.added.map(folder => this.addWorkspaceService(folder.toResource(WORKSPACE_STANDALONE_CONFIGURATIONS[MCP_CONFIGURATION_KEY]), ConfigurationTarget.WORKSPACE_FOLDER)));
		} catch (error) {
			this.logService.error(error);
		}
	}

	private async addWorkspaceService(mcpResource: URI, target: McpResourceTarget): Promise<void> {
		if (this.workspaceMcpManagementServices.has(mcpResource)) {
			return;
		}

		const disposables = new DisposableStore();
		const service = disposables.add(this.instantiationService.createInstance(WorkspaceMcpResourceManagementService, mcpResource, target));

		try {
			const installedServers = await service.getInstalled();
			this.allMcpServers.push(...installedServers);
			if (installedServers.length > 0) {
				const installResults: InstallMcpServerResult[] = installedServers.map(server => ({
					name: server.name,
					local: server,
					mcpResource: server.mcpResource
				}));
				this._onDidInstallMcpServers.fire(installResults);
			}
		} catch (error) {
			this.logService.warn('Failed to get installed servers from', mcpResource.toString(), error);
		}

		disposables.add(service.onInstallMcpServer(e => this._onInstallMcpServer.fire(e)));
		disposables.add(service.onDidInstallMcpServers(e => {
			for (const { local } of e) {
				if (local) {
					this.allMcpServers.push(local);
				}
			}
			this._onDidInstallMcpServers.fire(e);
		}));
		disposables.add(service.onDidUpdateMcpServers(e => {
			for (const { local, mcpResource } of e) {
				if (local) {
					const index = this.allMcpServers.findIndex(server => this.uriIdentityService.extUri.isEqual(server.mcpResource, mcpResource) && server.name === local.name);
					if (index !== -1) {
						this.allMcpServers.splice(index, 1, local);
					}
				}
			}
			this._onDidUpdateMcpServers.fire(e);
		}));
		disposables.add(service.onUninstallMcpServer(e => this._onUninstallMcpServer.fire(e)));
		disposables.add(service.onDidUninstallMcpServer(e => {
			const index = this.allMcpServers.findIndex(server => this.uriIdentityService.extUri.isEqual(server.mcpResource, e.mcpResource) && server.name === e.name);
			if (index !== -1) {
				this.allMcpServers.splice(index, 1);
				this._onDidUninstallMcpServer.fire(e);
			}
		}));
		this.workspaceMcpManagementServices.set(mcpResource, { service, dispose: () => disposables.dispose() });
	}

	private async removeWorkspaceService(mcpResource: URI): Promise<void> {
		const serviceItem = this.workspaceMcpManagementServices.get(mcpResource);
		if (serviceItem) {
			try {
				const installedServers = await serviceItem.service.getInstalled();
				this.allMcpServers = this.allMcpServers.filter(server => !installedServers.some(uninstalled => this.uriIdentityService.extUri.isEqual(uninstalled.mcpResource, server.mcpResource)));
				for (const server of installedServers) {
					this._onDidUninstallMcpServer.fire({
						name: server.name,
						mcpResource: server.mcpResource
					});
				}
			} catch (error) {
				this.logService.warn('Failed to get installed servers from', mcpResource.toString(), error);
			}
			this.workspaceMcpManagementServices.delete(mcpResource);
			serviceItem.dispose();
		}
	}

	async getInstalled(): Promise<ILocalMcpServer[]> {
		return this.allMcpServers;
	}

	async install(server: IInstallableMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		if (!options?.mcpResource) {
			throw new Error('MCP resource is required');
		}

		const mcpManagementServiceItem = this.workspaceMcpManagementServices.get(options?.mcpResource);
		if (!mcpManagementServiceItem) {
			throw new Error(`No MCP management service found for resource: ${options?.mcpResource.toString()}`);
		}

		return mcpManagementServiceItem.service.install(server, options);
	}

	async uninstall(server: ILocalMcpServer, options?: UninstallOptions): Promise<void> {
		const mcpResource = server.mcpResource;

		const mcpManagementServiceItem = this.workspaceMcpManagementServices.get(mcpResource);
		if (!mcpManagementServiceItem) {
			throw new Error(`No MCP management service found for resource: ${mcpResource.toString()}`);
		}

		return mcpManagementServiceItem.service.uninstall(server, options);
	}

	installFromGallery(gallery: IGalleryMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		if (!options?.mcpResource) {
			throw new Error('MCP resource is required');
		}

		const mcpManagementServiceItem = this.workspaceMcpManagementServices.get(options?.mcpResource);
		if (!mcpManagementServiceItem) {
			throw new Error(`No MCP management service found for resource: ${options?.mcpResource.toString()}`);
		}

		return mcpManagementServiceItem.service.installFromGallery(gallery, options);
	}

	updateMetadata(): Promise<ILocalMcpServer> {
		throw new Error('Not supported');
	}

	override dispose(): void {
		this.workspaceMcpManagementServices.forEach(service => service.dispose());
		this.workspaceMcpManagementServices.clear();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/mcp/electron-browser/mcpGalleryManifestService.ts]---
Location: vscode-main/src/vs/workbench/services/mcp/electron-browser/mcpGalleryManifestService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IRequestService } from '../../../../platform/request/common/request.js';
import { IMcpGalleryManifestService } from '../../../../platform/mcp/common/mcpGalleryManifest.js';
import { WorkbenchMcpGalleryManifestService } from '../browser/mcpGalleryManifestService.js';

export class McpGalleryManifestService extends WorkbenchMcpGalleryManifestService implements IMcpGalleryManifestService {

	constructor(
		@IProductService productService: IProductService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IRequestService requestService: IRequestService,
		@ILogService logService: ILogService,
		@ISharedProcessService sharedProcessService: ISharedProcessService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(productService, remoteAgentService, requestService, logService, configurationService);

		const channel = sharedProcessService.getChannel('mcpGalleryManifest');
		this.getMcpGalleryManifest().then(manifest => {
			channel.call('setMcpGalleryManifest', [manifest]);
			this._register(this.onDidChangeMcpGalleryManifest(manifest => channel.call('setMcpGalleryManifest', [manifest])));
		});
	}

}

registerSingleton(IMcpGalleryManifestService, McpGalleryManifestService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/mcp/electron-browser/mcpWorkbenchManagementService.ts]---
Location: vscode-main/src/vs/workbench/services/mcp/electron-browser/mcpWorkbenchManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { McpManagementChannelClient } from '../../../../platform/mcp/common/mcpManagementIpc.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IRemoteUserDataProfilesService } from '../../userDataProfile/common/remoteUserDataProfiles.js';
import { WorkbenchMcpManagementService as BaseWorkbenchMcpManagementService, IWorkbenchMcpManagementService } from '../common/mcpWorkbenchManagementService.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { IAllowedMcpServersService } from '../../../../platform/mcp/common/mcpManagement.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class WorkbenchMcpManagementService extends BaseWorkbenchMcpManagementService {

	constructor(
		@IAllowedMcpServersService allowedMcpServersService: IAllowedMcpServersService,
		@ILogService logService: ILogService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IRemoteUserDataProfilesService remoteUserDataProfilesService: IRemoteUserDataProfilesService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ISharedProcessService sharedProcessService: ISharedProcessService,
	) {
		const mcpManagementService = new McpManagementChannelClient(sharedProcessService.getChannel('mcpManagement'), allowedMcpServersService, logService);
		super(mcpManagementService, allowedMcpServersService, logService, userDataProfileService, uriIdentityService, workspaceContextService, remoteAgentService, userDataProfilesService, remoteUserDataProfilesService, instantiationService);
		this._register(mcpManagementService);
	}
}

registerSingleton(IWorkbenchMcpManagementService, WorkbenchMcpManagementService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/menubar/electron-browser/menubarService.ts]---
Location: vscode-main/src/vs/workbench/services/menubar/electron-browser/menubarService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMenubarService } from '../../../../platform/menubar/electron-browser/menubar.js';
import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';

registerMainProcessRemoteService(IMenubarService, 'menubar');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/model/common/modelService.ts]---
Location: vscode-main/src/vs/workbench/services/model/common/modelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ModelService } from '../../../../editor/common/services/modelService.js';
import { ITextResourcePropertiesService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IUndoRedoService } from '../../../../platform/undoRedo/common/undoRedo.js';
import { IPathService } from '../../path/common/pathService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

export class WorkbenchModelService extends ModelService {
	constructor(
		@IConfigurationService configurationService: IConfigurationService,
		@ITextResourcePropertiesService resourcePropertiesService: ITextResourcePropertiesService,
		@IUndoRedoService undoRedoService: IUndoRedoService,
		@IPathService private readonly _pathService: IPathService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(configurationService, resourcePropertiesService, undoRedoService, instantiationService);
	}

	protected override _schemaShouldMaintainUndoRedoElements(resource: URI) {
		return (
			super._schemaShouldMaintainUndoRedoElements(resource)
			|| resource.scheme === this._pathService.defaultUriScheme
		);
	}
}

registerSingleton(IModelService, WorkbenchModelService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/notebook/common/notebookDocumentService.ts]---
Location: vscode-main/src/vs/workbench/services/notebook/common/notebookDocumentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer, decodeBase64, encodeBase64 } from '../../../../base/common/buffer.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const INotebookDocumentService = createDecorator<INotebookDocumentService>('notebookDocumentService');

export interface INotebookDocument {
	readonly uri: URI;
	getCellIndex(cellUri: URI): number | undefined;
}

const _lengths = ['W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f'];
const _padRegexp = new RegExp(`^[${_lengths.join('')}]+`);
const _radix = 7;
export function parse(cell: URI): { notebook: URI; handle: number } | undefined {
	if (cell.scheme !== Schemas.vscodeNotebookCell) {
		return undefined;
	}

	const idx = cell.fragment.indexOf('s');
	if (idx < 0) {
		return undefined;
	}

	const handle = parseInt(cell.fragment.substring(0, idx).replace(_padRegexp, ''), _radix);
	const _scheme = decodeBase64(cell.fragment.substring(idx + 1)).toString();

	if (isNaN(handle)) {
		return undefined;
	}
	return {
		handle,
		notebook: cell.with({ scheme: _scheme, fragment: null })
	};
}

export function generate(notebook: URI, handle: number): URI {

	const s = handle.toString(_radix);
	const p = s.length < _lengths.length ? _lengths[s.length - 1] : 'z';

	const fragment = `${p}${s}s${encodeBase64(VSBuffer.fromString(notebook.scheme), true, true)}`;
	return notebook.with({ scheme: Schemas.vscodeNotebookCell, fragment });
}

export function parseMetadataUri(metadata: URI): URI | undefined {
	if (metadata.scheme !== Schemas.vscodeNotebookMetadata) {
		return undefined;
	}

	const _scheme = decodeBase64(metadata.fragment).toString();

	return metadata.with({ scheme: _scheme, fragment: null });
}

export function generateMetadataUri(notebook: URI): URI {
	const fragment = `${encodeBase64(VSBuffer.fromString(notebook.scheme), true, true)}`;
	return notebook.with({ scheme: Schemas.vscodeNotebookMetadata, fragment });
}

export function extractCellOutputDetails(uri: URI): { notebook: URI; openIn: string; outputId?: string; cellFragment?: string; outputIndex?: number; cellHandle?: number; cellIndex?: number } | undefined {
	if (uri.scheme !== Schemas.vscodeNotebookCellOutput) {
		return;
	}

	const params = new URLSearchParams(uri.query);
	const openIn = params.get('openIn');
	if (!openIn) {
		return;
	}
	const outputId = params.get('outputId') ?? undefined;
	const parsedCell = parse(uri.with({ scheme: Schemas.vscodeNotebookCell, query: null }));
	const outputIndex = params.get('outputIndex') ? parseInt(params.get('outputIndex') || '', 10) : undefined;
	const notebookUri = parsedCell ? parsedCell.notebook : uri.with({
		scheme: params.get('notebookScheme') || Schemas.file,
		fragment: null,
		query: null,
	});
	const cellIndex = params.get('cellIndex') ? parseInt(params.get('cellIndex') || '', 10) : undefined;

	return {
		notebook: notebookUri,
		openIn: openIn,
		outputId: outputId,
		outputIndex: outputIndex,
		cellHandle: parsedCell?.handle,
		cellFragment: uri.fragment,
		cellIndex: cellIndex,
	};
}


export interface INotebookDocumentService {
	readonly _serviceBrand: undefined;

	getNotebook(uri: URI): INotebookDocument | undefined;
	addNotebookDocument(document: INotebookDocument): void;
	removeNotebookDocument(document: INotebookDocument): void;
}

export class NotebookDocumentWorkbenchService implements INotebookDocumentService {
	declare readonly _serviceBrand: undefined;

	private readonly _documents = new ResourceMap<INotebookDocument>();

	getNotebook(uri: URI): INotebookDocument | undefined {
		if (uri.scheme === Schemas.vscodeNotebookCell) {
			const cellUri = parse(uri);
			if (cellUri) {
				const document = this._documents.get(cellUri.notebook);
				if (document) {
					return document;
				}
			}
		}
		if (uri.scheme === Schemas.vscodeNotebookCellOutput) {
			const parsedData = extractCellOutputDetails(uri);
			if (parsedData) {
				const document = this._documents.get(parsedData.notebook);
				if (document) {
					return document;
				}
			}
		}

		return this._documents.get(uri);
	}

	addNotebookDocument(document: INotebookDocument) {
		this._documents.set(document.uri, document);
	}

	removeNotebookDocument(document: INotebookDocument) {
		this._documents.delete(document.uri);
	}

}

registerSingleton(INotebookDocumentService, NotebookDocumentWorkbenchService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````

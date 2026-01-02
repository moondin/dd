---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 252
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 252 of 552)

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

---[FILE: src/vs/editor/test/common/services/languagesAssociations.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/languagesAssociations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { getMimeTypes, registerPlatformLanguageAssociation, registerConfiguredLanguageAssociation } from '../../../common/services/languagesAssociations.js';

suite('LanguagesAssociations', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Dynamically Register Text Mime', () => {
		let guess = getMimeTypes(URI.file('foo.monaco'));
		assert.deepStrictEqual(guess, ['application/unknown']);

		registerPlatformLanguageAssociation({ id: 'monaco', extension: '.monaco', mime: 'text/monaco' });
		guess = getMimeTypes(URI.file('foo.monaco'));
		assert.deepStrictEqual(guess, ['text/monaco', 'text/plain']);

		guess = getMimeTypes(URI.file('.monaco'));
		assert.deepStrictEqual(guess, ['text/monaco', 'text/plain']);

		registerPlatformLanguageAssociation({ id: 'codefile', filename: 'Codefile', mime: 'text/code' });
		guess = getMimeTypes(URI.file('Codefile'));
		assert.deepStrictEqual(guess, ['text/code', 'text/plain']);

		guess = getMimeTypes(URI.file('foo.Codefile'));
		assert.deepStrictEqual(guess, ['application/unknown']);

		registerPlatformLanguageAssociation({ id: 'docker', filepattern: 'Docker*', mime: 'text/docker' });
		guess = getMimeTypes(URI.file('Docker-debug'));
		assert.deepStrictEqual(guess, ['text/docker', 'text/plain']);

		guess = getMimeTypes(URI.file('docker-PROD'));
		assert.deepStrictEqual(guess, ['text/docker', 'text/plain']);

		registerPlatformLanguageAssociation({ id: 'niceregex', mime: 'text/nice-regex', firstline: /RegexesAreNice/ });
		guess = getMimeTypes(URI.file('Randomfile.noregistration'), 'RegexesAreNice');
		assert.deepStrictEqual(guess, ['text/nice-regex', 'text/plain']);

		guess = getMimeTypes(URI.file('Randomfile.noregistration'), 'RegexesAreNotNice');
		assert.deepStrictEqual(guess, ['application/unknown']);

		guess = getMimeTypes(URI.file('Codefile'), 'RegexesAreNice');
		assert.deepStrictEqual(guess, ['text/code', 'text/plain']);
	});

	test('Mimes Priority', () => {
		registerPlatformLanguageAssociation({ id: 'monaco', extension: '.monaco', mime: 'text/monaco' });
		registerPlatformLanguageAssociation({ id: 'foobar', mime: 'text/foobar', firstline: /foobar/ });

		let guess = getMimeTypes(URI.file('foo.monaco'));
		assert.deepStrictEqual(guess, ['text/monaco', 'text/plain']);

		guess = getMimeTypes(URI.file('foo.monaco'), 'foobar');
		assert.deepStrictEqual(guess, ['text/monaco', 'text/plain']);

		registerPlatformLanguageAssociation({ id: 'docker', filename: 'dockerfile', mime: 'text/winner' });
		registerPlatformLanguageAssociation({ id: 'docker', filepattern: 'dockerfile*', mime: 'text/looser' });
		guess = getMimeTypes(URI.file('dockerfile'));
		assert.deepStrictEqual(guess, ['text/winner', 'text/plain']);

		registerPlatformLanguageAssociation({ id: 'azure-looser', mime: 'text/azure-looser', firstline: /azure/ });
		registerPlatformLanguageAssociation({ id: 'azure-winner', mime: 'text/azure-winner', firstline: /azure/ });
		guess = getMimeTypes(URI.file('azure'), 'azure');
		assert.deepStrictEqual(guess, ['text/azure-winner', 'text/plain']);
	});

	test('Specificity priority 1', () => {
		registerPlatformLanguageAssociation({ id: 'monaco2', extension: '.monaco2', mime: 'text/monaco2' });
		registerPlatformLanguageAssociation({ id: 'monaco2', filename: 'specific.monaco2', mime: 'text/specific-monaco2' });

		assert.deepStrictEqual(getMimeTypes(URI.file('specific.monaco2')), ['text/specific-monaco2', 'text/plain']);
		assert.deepStrictEqual(getMimeTypes(URI.file('foo.monaco2')), ['text/monaco2', 'text/plain']);
	});

	test('Specificity priority 2', () => {
		registerPlatformLanguageAssociation({ id: 'monaco3', filename: 'specific.monaco3', mime: 'text/specific-monaco3' });
		registerPlatformLanguageAssociation({ id: 'monaco3', extension: '.monaco3', mime: 'text/monaco3' });

		assert.deepStrictEqual(getMimeTypes(URI.file('specific.monaco3')), ['text/specific-monaco3', 'text/plain']);
		assert.deepStrictEqual(getMimeTypes(URI.file('foo.monaco3')), ['text/monaco3', 'text/plain']);
	});

	test('Mimes Priority - Longest Extension wins', () => {
		registerPlatformLanguageAssociation({ id: 'monaco', extension: '.monaco', mime: 'text/monaco' });
		registerPlatformLanguageAssociation({ id: 'monaco', extension: '.monaco.xml', mime: 'text/monaco-xml' });
		registerPlatformLanguageAssociation({ id: 'monaco', extension: '.monaco.xml.build', mime: 'text/monaco-xml-build' });

		let guess = getMimeTypes(URI.file('foo.monaco'));
		assert.deepStrictEqual(guess, ['text/monaco', 'text/plain']);

		guess = getMimeTypes(URI.file('foo.monaco.xml'));
		assert.deepStrictEqual(guess, ['text/monaco-xml', 'text/plain']);

		guess = getMimeTypes(URI.file('foo.monaco.xml.build'));
		assert.deepStrictEqual(guess, ['text/monaco-xml-build', 'text/plain']);
	});

	test('Mimes Priority - User configured wins', () => {
		registerConfiguredLanguageAssociation({ id: 'monaco', extension: '.monaco.xnl', mime: 'text/monaco' });
		registerPlatformLanguageAssociation({ id: 'monaco', extension: '.monaco.xml', mime: 'text/monaco-xml' });

		const guess = getMimeTypes(URI.file('foo.monaco.xnl'));
		assert.deepStrictEqual(guess, ['text/monaco', 'text/plain']);
	});

	test('Mimes Priority - Pattern matches on path if specified', () => {
		registerPlatformLanguageAssociation({ id: 'monaco', filepattern: '**/dot.monaco.xml', mime: 'text/monaco' });
		registerPlatformLanguageAssociation({ id: 'other', filepattern: '*ot.other.xml', mime: 'text/other' });

		const guess = getMimeTypes(URI.file('/some/path/dot.monaco.xml'));
		assert.deepStrictEqual(guess, ['text/monaco', 'text/plain']);
	});

	test('Mimes Priority - Last registered mime wins', () => {
		registerPlatformLanguageAssociation({ id: 'monaco', filepattern: '**/dot.monaco.xml', mime: 'text/monaco' });
		registerPlatformLanguageAssociation({ id: 'other', filepattern: '**/dot.monaco.xml', mime: 'text/other' });

		const guess = getMimeTypes(URI.file('/some/path/dot.monaco.xml'));
		assert.deepStrictEqual(guess, ['text/other', 'text/plain']);
	});

	test('Data URIs', () => {
		registerPlatformLanguageAssociation({ id: 'data', extension: '.data', mime: 'text/data' });

		assert.deepStrictEqual(getMimeTypes(URI.parse(`data:;label:something.data;description:data,`)), ['text/data', 'text/plain']);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/languageService.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/languageService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../common/languages/modesRegistry.js';
import { LanguageService } from '../../../common/services/languageService.js';

suite('LanguageService', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('LanguageSelection does not leak a disposable', () => {
		const languageService = new LanguageService();
		const languageSelection1 = languageService.createById(PLAINTEXT_LANGUAGE_ID);
		assert.strictEqual(languageSelection1.languageId, PLAINTEXT_LANGUAGE_ID);
		const languageSelection2 = languageService.createById(PLAINTEXT_LANGUAGE_ID);
		const listener = languageSelection2.onDidChange(() => { });
		assert.strictEqual(languageSelection2.languageId, PLAINTEXT_LANGUAGE_ID);
		listener.dispose();
		languageService.dispose();
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/languagesRegistry.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/languagesRegistry.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { LanguagesRegistry } from '../../../common/services/languagesRegistry.js';

suite('LanguagesRegistry', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('output language does not have a name', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'outputLangId',
			extensions: [],
			aliases: [],
			mimetypes: ['outputLanguageMimeType'],
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), []);

		registry.dispose();
	});

	test('language with alias does have a name', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'langId',
			extensions: [],
			aliases: ['LangName'],
			mimetypes: ['bla'],
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), [{ languageName: 'LangName', languageId: 'langId' }]);
		assert.deepStrictEqual(registry.getLanguageName('langId'), 'LangName');

		registry.dispose();
	});

	test('language without alias gets a name', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'langId',
			extensions: [],
			mimetypes: ['bla'],
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), [{ languageName: 'langId', languageId: 'langId' }]);
		assert.deepStrictEqual(registry.getLanguageName('langId'), 'langId');

		registry.dispose();
	});

	test('bug #4360: f# not shown in status bar', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'langId',
			extensions: ['.ext1'],
			aliases: ['LangName'],
			mimetypes: ['bla'],
		}]);

		registry._registerLanguages([{
			id: 'langId',
			extensions: ['.ext2'],
			aliases: [],
			mimetypes: ['bla'],
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), [{ languageName: 'LangName', languageId: 'langId' }]);
		assert.deepStrictEqual(registry.getLanguageName('langId'), 'LangName');

		registry.dispose();
	});

	test('issue #5278: Extension cannot override language name anymore', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'langId',
			extensions: ['.ext1'],
			aliases: ['LangName'],
			mimetypes: ['bla'],
		}]);

		registry._registerLanguages([{
			id: 'langId',
			extensions: ['.ext2'],
			aliases: ['BetterLanguageName'],
			mimetypes: ['bla'],
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), [{ languageName: 'BetterLanguageName', languageId: 'langId' }]);
		assert.deepStrictEqual(registry.getLanguageName('langId'), 'BetterLanguageName');

		registry.dispose();
	});

	test('mimetypes are generated if necessary', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'langId'
		}]);

		assert.deepStrictEqual(registry.getMimeType('langId'), 'text/x-langId');

		registry.dispose();
	});

	test('first mimetype wins', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'langId',
			mimetypes: ['text/langId', 'text/langId2']
		}]);

		assert.deepStrictEqual(registry.getMimeType('langId'), 'text/langId');

		registry.dispose();
	});

	test('first mimetype wins 2', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'langId'
		}]);

		registry._registerLanguages([{
			id: 'langId',
			mimetypes: ['text/langId']
		}]);

		assert.deepStrictEqual(registry.getMimeType('langId'), 'text/x-langId');

		registry.dispose();
	});

	test('aliases', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'a'
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), [{ languageName: 'a', languageId: 'a' }]);
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a'), 'a');
		assert.deepStrictEqual(registry.getLanguageName('a'), 'a');

		registry._registerLanguages([{
			id: 'a',
			aliases: ['A1', 'A2']
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), [{ languageName: 'A1', languageId: 'a' }]);
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a'), 'a');
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a1'), 'a');
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a2'), 'a');
		assert.deepStrictEqual(registry.getLanguageName('a'), 'A1');

		registry._registerLanguages([{
			id: 'a',
			aliases: ['A3', 'A4']
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), [{ languageName: 'A3', languageId: 'a' }]);
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a'), 'a');
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a1'), 'a');
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a2'), 'a');
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a3'), 'a');
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a4'), 'a');
		assert.deepStrictEqual(registry.getLanguageName('a'), 'A3');

		registry.dispose();
	});

	test('empty aliases array means no alias', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'a'
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), [{ languageName: 'a', languageId: 'a' }]);
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a'), 'a');
		assert.deepStrictEqual(registry.getLanguageName('a'), 'a');

		registry._registerLanguages([{
			id: 'b',
			aliases: []
		}]);

		assert.deepStrictEqual(registry.getSortedRegisteredLanguageNames(), [{ languageName: 'a', languageId: 'a' }]);
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('a'), 'a');
		assert.deepStrictEqual(registry.getLanguageIdByLanguageName('b'), 'b');
		assert.deepStrictEqual(registry.getLanguageName('a'), 'a');
		assert.deepStrictEqual(registry.getLanguageName('b'), null);

		registry.dispose();
	});

	test('extensions', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'a',
			aliases: ['aName'],
			extensions: ['aExt']
		}]);

		assert.deepStrictEqual(registry.getExtensions('a'), ['aExt']);

		registry._registerLanguages([{
			id: 'a',
			extensions: ['aExt2']
		}]);

		assert.deepStrictEqual(registry.getExtensions('a'), ['aExt', 'aExt2']);

		registry.dispose();
	});

	test('extensions of primary language registration come first', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'a',
			extensions: ['aExt3']
		}]);

		assert.deepStrictEqual(registry.getExtensions('a')[0], 'aExt3');

		registry._registerLanguages([{
			id: 'a',
			configuration: URI.file('conf.json'),
			extensions: ['aExt']
		}]);

		assert.deepStrictEqual(registry.getExtensions('a')[0], 'aExt');

		registry._registerLanguages([{
			id: 'a',
			extensions: ['aExt2']
		}]);

		assert.deepStrictEqual(registry.getExtensions('a')[0], 'aExt');

		registry.dispose();
	});

	test('filenames', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'a',
			aliases: ['aName'],
			filenames: ['aFilename']
		}]);

		assert.deepStrictEqual(registry.getFilenames('a'), ['aFilename']);

		registry._registerLanguages([{
			id: 'a',
			filenames: ['aFilename2']
		}]);

		assert.deepStrictEqual(registry.getFilenames('a'), ['aFilename', 'aFilename2']);

		registry.dispose();
	});

	test('configuration', () => {
		const registry = new LanguagesRegistry(false);

		registry._registerLanguages([{
			id: 'a',
			aliases: ['aName'],
			configuration: URI.file('/path/to/aFilename')
		}]);

		assert.deepStrictEqual(registry.getConfigurationFiles('a'), [URI.file('/path/to/aFilename')]);
		assert.deepStrictEqual(registry.getConfigurationFiles('aname'), []);
		assert.deepStrictEqual(registry.getConfigurationFiles('aName'), []);

		registry._registerLanguages([{
			id: 'a',
			configuration: URI.file('/path/to/aFilename2')
		}]);

		assert.deepStrictEqual(registry.getConfigurationFiles('a'), [URI.file('/path/to/aFilename'), URI.file('/path/to/aFilename2')]);
		assert.deepStrictEqual(registry.getConfigurationFiles('aname'), []);
		assert.deepStrictEqual(registry.getConfigurationFiles('aName'), []);

		registry.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/modelService.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/modelService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CharCode } from '../../../../base/common/charCode.js';
import * as platform from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { StringBuilder } from '../../../common/core/stringBuilder.js';
import { DefaultEndOfLine, ITextBuffer, ITextBufferFactory, ITextSnapshot } from '../../../common/model.js';
import { createTextBuffer } from '../../../common/model/textModel.js';
import { ModelService } from '../../../common/services/modelService.js';
import { TestConfigurationService } from '../../../../platform/configuration/test/common/testConfigurationService.js';
import { createModelServices, createTextModel } from '../testTextModel.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IModelService } from '../../../common/services/model.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

const GENERATE_TESTS = false;

suite('ModelService', () => {
	let disposables: DisposableStore;
	let modelService: IModelService;
	let instantiationService: TestInstantiationService;

	setup(() => {
		disposables = new DisposableStore();

		const configService = new TestConfigurationService();
		configService.setUserConfiguration('files', { 'eol': '\n' });
		configService.setUserConfiguration('files', { 'eol': '\r\n' }, URI.file(platform.isWindows ? 'c:\\myroot' : '/myroot'));

		instantiationService = createModelServices(disposables, [
			[IConfigurationService, configService]
		]);
		modelService = instantiationService.get(IModelService);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('EOL setting respected depending on root', () => {
		const model1 = modelService.createModel('farboo', null);
		const model2 = modelService.createModel('farboo', null, URI.file(platform.isWindows ? 'c:\\myroot\\myfile.txt' : '/myroot/myfile.txt'));
		const model3 = modelService.createModel('farboo', null, URI.file(platform.isWindows ? 'c:\\other\\myfile.txt' : '/other/myfile.txt'));

		assert.strictEqual(model1.getOptions().defaultEOL, DefaultEndOfLine.LF);
		assert.strictEqual(model2.getOptions().defaultEOL, DefaultEndOfLine.CRLF);
		assert.strictEqual(model3.getOptions().defaultEOL, DefaultEndOfLine.LF);

		model1.dispose();
		model2.dispose();
		model3.dispose();
	});

	test('_computeEdits no change', function () {

		const model = disposables.add(createTextModel(
			[
				'This is line one', //16
				'and this is line number two', //27
				'it is followed by #3', //20
				'and finished with the fourth.', //29
			].join('\n')
		));

		const textBuffer = createAndRegisterTextBuffer(
			disposables,
			[
				'This is line one', //16
				'and this is line number two', //27
				'it is followed by #3', //20
				'and finished with the fourth.', //29
			].join('\n'),
			DefaultEndOfLine.LF
		);

		const actual = ModelService._computeEdits(model, textBuffer);

		assert.deepStrictEqual(actual, []);
	});

	test('_computeEdits first line changed', function () {

		const model = disposables.add(createTextModel(
			[
				'This is line one', //16
				'and this is line number two', //27
				'it is followed by #3', //20
				'and finished with the fourth.', //29
			].join('\n')
		));

		const textBuffer = createAndRegisterTextBuffer(
			disposables,
			[
				'This is line One', //16
				'and this is line number two', //27
				'it is followed by #3', //20
				'and finished with the fourth.', //29
			].join('\n'),
			DefaultEndOfLine.LF
		);

		const actual = ModelService._computeEdits(model, textBuffer);

		assert.deepStrictEqual(actual, [
			EditOperation.replaceMove(new Range(1, 1, 2, 1), 'This is line One\n')
		]);
	});

	test('_computeEdits EOL changed', function () {

		const model = disposables.add(createTextModel(
			[
				'This is line one', //16
				'and this is line number two', //27
				'it is followed by #3', //20
				'and finished with the fourth.', //29
			].join('\n')
		));

		const textBuffer = createAndRegisterTextBuffer(
			disposables,
			[
				'This is line one', //16
				'and this is line number two', //27
				'it is followed by #3', //20
				'and finished with the fourth.', //29
			].join('\r\n'),
			DefaultEndOfLine.LF
		);

		const actual = ModelService._computeEdits(model, textBuffer);

		assert.deepStrictEqual(actual, []);
	});

	test('_computeEdits EOL and other change 1', function () {

		const model = disposables.add(createTextModel(
			[
				'This is line one', //16
				'and this is line number two', //27
				'it is followed by #3', //20
				'and finished with the fourth.', //29
			].join('\n')
		));

		const textBuffer = createAndRegisterTextBuffer(
			disposables,
			[
				'This is line One', //16
				'and this is line number two', //27
				'It is followed by #3', //20
				'and finished with the fourth.', //29
			].join('\r\n'),
			DefaultEndOfLine.LF
		);

		const actual = ModelService._computeEdits(model, textBuffer);

		assert.deepStrictEqual(actual, [
			EditOperation.replaceMove(
				new Range(1, 1, 4, 1),
				[
					'This is line One',
					'and this is line number two',
					'It is followed by #3',
					''
				].join('\r\n')
			)
		]);
	});

	test('_computeEdits EOL and other change 2', function () {

		const model = disposables.add(createTextModel(
			[
				'package main',	// 1
				'func foo() {',	// 2
				'}'				// 3
			].join('\n')
		));

		const textBuffer = createAndRegisterTextBuffer(
			disposables,
			[
				'package main',	// 1
				'func foo() {',	// 2
				'}',			// 3
				''
			].join('\r\n'),
			DefaultEndOfLine.LF
		);

		const actual = ModelService._computeEdits(model, textBuffer);

		assert.deepStrictEqual(actual, [
			EditOperation.replaceMove(new Range(3, 2, 3, 2), '\r\n')
		]);
	});

	test('generated1', () => {
		const file1 = ['pram', 'okctibad', 'pjuwtemued', 'knnnm', 'u', ''];
		const file2 = ['tcnr', 'rxwlicro', 'vnzy', '', '', 'pjzcogzur', 'ptmxyp', 'dfyshia', 'pee', 'ygg'];
		assertComputeEdits(file1, file2);
	});

	test('generated2', () => {
		const file1 = ['', 'itls', 'hrilyhesv', ''];
		const file2 = ['vdl', '', 'tchgz', 'bhx', 'nyl'];
		assertComputeEdits(file1, file2);
	});

	test('generated3', () => {
		const file1 = ['ubrbrcv', 'wv', 'xodspybszt', 's', 'wednjxm', 'fklajt', 'fyfc', 'lvejgge', 'rtpjlodmmk', 'arivtgmjdm'];
		const file2 = ['s', 'qj', 'tu', 'ur', 'qerhjjhyvx', 't'];
		assertComputeEdits(file1, file2);
	});

	test('generated4', () => {
		const file1 = ['ig', 'kh', 'hxegci', 'smvker', 'pkdmjjdqnv', 'vgkkqqx', '', 'jrzeb'];
		const file2 = ['yk', ''];
		assertComputeEdits(file1, file2);
	});

	test('does insertions in the middle of the document', () => {
		const file1 = [
			'line 1',
			'line 2',
			'line 3'
		];
		const file2 = [
			'line 1',
			'line 2',
			'line 5',
			'line 3'
		];
		assertComputeEdits(file1, file2);
	});

	test('does insertions at the end of the document', () => {
		const file1 = [
			'line 1',
			'line 2',
			'line 3'
		];
		const file2 = [
			'line 1',
			'line 2',
			'line 3',
			'line 4'
		];
		assertComputeEdits(file1, file2);
	});

	test('does insertions at the beginning of the document', () => {
		const file1 = [
			'line 1',
			'line 2',
			'line 3'
		];
		const file2 = [
			'line 0',
			'line 1',
			'line 2',
			'line 3'
		];
		assertComputeEdits(file1, file2);
	});

	test('does replacements', () => {
		const file1 = [
			'line 1',
			'line 2',
			'line 3'
		];
		const file2 = [
			'line 1',
			'line 7',
			'line 3'
		];
		assertComputeEdits(file1, file2);
	});

	test('does deletions', () => {
		const file1 = [
			'line 1',
			'line 2',
			'line 3'
		];
		const file2 = [
			'line 1',
			'line 3'
		];
		assertComputeEdits(file1, file2);
	});

	test('does insert, replace, and delete', () => {
		const file1 = [
			'line 1',
			'line 2',
			'line 3',
			'line 4',
			'line 5',
		];
		const file2 = [
			'line 0', // insert line 0
			'line 1',
			'replace line 2', // replace line 2
			'line 3',
			// delete line 4
			'line 5',
		];
		assertComputeEdits(file1, file2);
	});

	test('maintains undo for same resource and same content', () => {
		const resource = URI.parse('file://test.txt');

		// create a model
		const model1 = modelService.createModel('text', null, resource);
		// make an edit
		model1.pushEditOperations(null, [{ range: new Range(1, 5, 1, 5), text: '1' }], () => [new Selection(1, 5, 1, 5)]);
		assert.strictEqual(model1.getValue(), 'text1');
		// dispose it
		modelService.destroyModel(resource);

		// create a new model with the same content
		const model2 = modelService.createModel('text1', null, resource);
		// undo
		model2.undo();
		assert.strictEqual(model2.getValue(), 'text');
		// dispose it
		modelService.destroyModel(resource);
	});

	test('maintains version id and alternative version id for same resource and same content', () => {
		const resource = URI.parse('file://test.txt');

		// create a model
		const model1 = modelService.createModel('text', null, resource);
		// make an edit
		model1.pushEditOperations(null, [{ range: new Range(1, 5, 1, 5), text: '1' }], () => [new Selection(1, 5, 1, 5)]);
		assert.strictEqual(model1.getValue(), 'text1');
		const versionId = model1.getVersionId();
		const alternativeVersionId = model1.getAlternativeVersionId();
		// dispose it
		modelService.destroyModel(resource);

		// create a new model with the same content
		const model2 = modelService.createModel('text1', null, resource);
		assert.strictEqual(model2.getVersionId(), versionId);
		assert.strictEqual(model2.getAlternativeVersionId(), alternativeVersionId);
		// dispose it
		modelService.destroyModel(resource);
	});

	test('does not maintain undo for same resource and different content', () => {
		const resource = URI.parse('file://test.txt');

		// create a model
		const model1 = modelService.createModel('text', null, resource);
		// make an edit
		model1.pushEditOperations(null, [{ range: new Range(1, 5, 1, 5), text: '1' }], () => [new Selection(1, 5, 1, 5)]);
		assert.strictEqual(model1.getValue(), 'text1');
		// dispose it
		modelService.destroyModel(resource);

		// create a new model with the same content
		const model2 = modelService.createModel('text2', null, resource);
		// undo
		model2.undo();
		assert.strictEqual(model2.getValue(), 'text2');
		// dispose it
		modelService.destroyModel(resource);
	});

	test('setValue should clear undo stack', () => {
		const resource = URI.parse('file://test.txt');

		const model = modelService.createModel('text', null, resource);
		model.pushEditOperations(null, [{ range: new Range(1, 5, 1, 5), text: '1' }], () => [new Selection(1, 5, 1, 5)]);
		assert.strictEqual(model.getValue(), 'text1');

		model.setValue('text2');
		model.undo();
		assert.strictEqual(model.getValue(), 'text2');
		// dispose it
		modelService.destroyModel(resource);
	});
});

function assertComputeEdits(lines1: string[], lines2: string[]): void {
	const model = createTextModel(lines1.join('\n'));
	const { disposable, textBuffer } = createTextBuffer(lines2.join('\n'), DefaultEndOfLine.LF);

	// compute required edits
	// let start = Date.now();
	const edits = ModelService._computeEdits(model, textBuffer);
	// console.log(`took ${Date.now() - start} ms.`);

	// apply edits
	model.pushEditOperations([], edits, null);

	assert.strictEqual(model.getValue(), lines2.join('\n'));
	disposable.dispose();
	model.dispose();
}

function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomString(minLength: number, maxLength: number): string {
	const length = getRandomInt(minLength, maxLength);
	const t = new StringBuilder(length);
	for (let i = 0; i < length; i++) {
		t.appendASCIICharCode(getRandomInt(CharCode.a, CharCode.z));
	}
	return t.build();
}

function generateFile(small: boolean): string[] {
	const lineCount = getRandomInt(1, small ? 3 : 10000);
	const lines: string[] = [];
	for (let i = 0; i < lineCount; i++) {
		lines.push(getRandomString(0, small ? 3 : 10000));
	}
	return lines;
}

if (GENERATE_TESTS) {
	let number = 1;
	while (true) {

		console.log('------TEST: ' + number++);

		const file1 = generateFile(true);
		const file2 = generateFile(true);

		console.log('------TEST GENERATED');

		try {
			assertComputeEdits(file1, file2);
		} catch (err) {
			console.log(err);
			console.log(`
const file1 = ${JSON.stringify(file1).replace(/"/g, '\'')};
const file2 = ${JSON.stringify(file2).replace(/"/g, '\'')};
assertComputeEdits(file1, file2);
`);
			break;
		}
	}
}

function createAndRegisterTextBuffer(store: DisposableStore, value: string | ITextBufferFactory | ITextSnapshot, defaultEOL: DefaultEndOfLine): ITextBuffer {
	const { disposable, textBuffer } = createTextBuffer(value, defaultEOL);
	store.add(disposable);
	return textBuffer;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/semanticTokensDto.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/semanticTokensDto.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IFullSemanticTokensDto, IDeltaSemanticTokensDto, encodeSemanticTokensDto, ISemanticTokensDto, decodeSemanticTokensDto } from '../../../common/services/semanticTokensDto.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('SemanticTokensDto', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function toArr(arr: Uint32Array): number[] {
		const result: number[] = [];
		for (let i = 0, len = arr.length; i < len; i++) {
			result[i] = arr[i];
		}
		return result;
	}

	function assertEqualFull(actual: IFullSemanticTokensDto, expected: IFullSemanticTokensDto): void {
		const convert = (dto: IFullSemanticTokensDto) => {
			return {
				id: dto.id,
				type: dto.type,
				data: toArr(dto.data)
			};
		};
		assert.deepStrictEqual(convert(actual), convert(expected));
	}

	function assertEqualDelta(actual: IDeltaSemanticTokensDto, expected: IDeltaSemanticTokensDto): void {
		const convertOne = (delta: { start: number; deleteCount: number; data?: Uint32Array }) => {
			if (!delta.data) {
				return delta;
			}
			return {
				start: delta.start,
				deleteCount: delta.deleteCount,
				data: toArr(delta.data)
			};
		};
		const convert = (dto: IDeltaSemanticTokensDto) => {
			return {
				id: dto.id,
				type: dto.type,
				deltas: dto.deltas.map(convertOne)
			};
		};
		assert.deepStrictEqual(convert(actual), convert(expected));
	}

	function testRoundTrip(value: ISemanticTokensDto): void {
		const decoded = decodeSemanticTokensDto(encodeSemanticTokensDto(value));
		if (value.type === 'full' && decoded.type === 'full') {
			assertEqualFull(decoded, value);
		} else if (value.type === 'delta' && decoded.type === 'delta') {
			assertEqualDelta(decoded, value);
		} else {
			assert.fail('wrong type');
		}
	}

	test('full encoding', () => {
		testRoundTrip({
			id: 12,
			type: 'full',
			data: new Uint32Array([(1 << 24) + (2 << 16) + (3 << 8) + 4])
		});
	});

	test('delta encoding', () => {
		testRoundTrip({
			id: 12,
			type: 'delta',
			deltas: [{
				start: 0,
				deleteCount: 4,
				data: undefined
			}, {
				start: 15,
				deleteCount: 0,
				data: new Uint32Array([(1 << 24) + (2 << 16) + (3 << 8) + 4])
			}, {
				start: 27,
				deleteCount: 5,
				data: new Uint32Array([(1 << 24) + (2 << 16) + (3 << 8) + 4, 1, 2, 3, 4, 5, 6, 7, 8, 9])
			}]
		});
	});

	test('partial array buffer', () => {
		const sharedArr = new Uint32Array([
			(1 << 24) + (2 << 16) + (3 << 8) + 4,
			1, 2, 3, 4, 5, (1 << 24) + (2 << 16) + (3 << 8) + 4
		]);
		testRoundTrip({
			id: 12,
			type: 'delta',
			deltas: [{
				start: 0,
				deleteCount: 4,
				data: sharedArr.subarray(0, 1)
			}, {
				start: 15,
				deleteCount: 0,
				data: sharedArr.subarray(1, sharedArr.length)
			}]
		});
	});

	test('issue #94521: unusual backing array buffer', () => {
		function wrapAndSliceUint8Arry(buff: Uint8Array, prefixLength: number, suffixLength: number): Uint8Array {
			const wrapped = new Uint8Array(prefixLength + buff.byteLength + suffixLength);
			wrapped.set(buff, prefixLength);
			return wrapped.subarray(prefixLength, prefixLength + buff.byteLength);
		}
		function wrapAndSlice(buff: VSBuffer, prefixLength: number, suffixLength: number): VSBuffer {
			return VSBuffer.wrap(wrapAndSliceUint8Arry(buff.buffer, prefixLength, suffixLength));
		}
		const dto: ISemanticTokensDto = {
			id: 5,
			type: 'full',
			data: new Uint32Array([1, 2, 3, 4, 5])
		};
		const encoded = encodeSemanticTokensDto(dto);

		// with misaligned prefix and misaligned suffix
		assertEqualFull(<IFullSemanticTokensDto>decodeSemanticTokensDto(wrapAndSlice(encoded, 1, 1)), dto);
		// with misaligned prefix and aligned suffix
		assertEqualFull(<IFullSemanticTokensDto>decodeSemanticTokensDto(wrapAndSlice(encoded, 1, 4)), dto);
		// with aligned prefix and misaligned suffix
		assertEqualFull(<IFullSemanticTokensDto>decodeSemanticTokensDto(wrapAndSlice(encoded, 4, 1)), dto);
		// with aligned prefix and aligned suffix
		assertEqualFull(<IFullSemanticTokensDto>decodeSemanticTokensDto(wrapAndSlice(encoded, 4, 4)), dto);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/semanticTokensProviderStyling.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/semanticTokensProviderStyling.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { SparseMultilineTokens } from '../../../common/tokens/sparseMultilineTokens.js';
import { MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import { SemanticTokensProviderStyling, toMultilineTokens2 } from '../../../common/services/semanticTokensProviderStyling.js';
import { createModelServices } from '../testTextModel.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IColorTheme, IThemeService, ITokenStyle } from '../../../../platform/theme/common/themeService.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('ModelService', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageService: ILanguageService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = createModelServices(disposables);
		languageService = instantiationService.get(ILanguageService);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #134973: invalid semantic tokens should be handled better', () => {
		const languageId = 'java';
		disposables.add(languageService.registerLanguage({ id: languageId }));
		const legend = {
			tokenTypes: ['st0', 'st1', 'st2', 'st3', 'st4', 'st5', 'st6', 'st7', 'st8', 'st9', 'st10'],
			tokenModifiers: []
		};
		instantiationService.stub(IThemeService, {
			getColorTheme() {
				return <IColorTheme>{
					getTokenStyleMetadata: (tokenType, tokenModifiers, languageId): ITokenStyle => {
						return {
							foreground: parseInt(tokenType.substr(2), 10),
							bold: undefined,
							underline: undefined,
							strikethrough: undefined,
							italic: undefined
						};
					}
				};
			}
		});
		const styling = instantiationService.createInstance(SemanticTokensProviderStyling, legend);
		const badTokens = {
			data: new Uint32Array([
				0, 13, 16, 1, 0,
				1, 2, 6, 2, 0,
				0, 7, 6, 3, 0,
				0, 15, 8, 4, 0,
				0, 17, 1, 5, 0,
				0, 7, 5, 6, 0,
				1, 12, 8, 7, 0,
				0, 19, 5, 8, 0,
				0, 7, 1, 9, 0,
				0, 4294967294, 5, 10, 0
			])
		};
		const result = toMultilineTokens2(badTokens, styling, languageId);
		const expected = SparseMultilineTokens.create(1, new Uint32Array([
			0, 13, 29, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (1 << MetadataConsts.FOREGROUND_OFFSET)),
			1, 2, 8, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (2 << MetadataConsts.FOREGROUND_OFFSET)),
			1, 9, 15, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (3 << MetadataConsts.FOREGROUND_OFFSET)),
			1, 24, 32, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (4 << MetadataConsts.FOREGROUND_OFFSET)),
			1, 41, 42, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (5 << MetadataConsts.FOREGROUND_OFFSET)),
			1, 48, 53, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (6 << MetadataConsts.FOREGROUND_OFFSET)),
			2, 12, 20, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (7 << MetadataConsts.FOREGROUND_OFFSET)),
			2, 31, 36, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (8 << MetadataConsts.FOREGROUND_OFFSET)),
			2, 38, 39, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (9 << MetadataConsts.FOREGROUND_OFFSET)),
		]));
		assert.deepStrictEqual(result.toString(), expected.toString());
	});

	test('issue #148651: VSCode UI process can hang if a semantic token with negative values is returned by language service', () => {
		const languageId = 'dockerfile';
		disposables.add(languageService.registerLanguage({ id: languageId }));
		const legend = {
			tokenTypes: ['st0', 'st1', 'st2', 'st3', 'st4', 'st5', 'st6', 'st7', 'st8', 'st9'],
			tokenModifiers: ['stm0', 'stm1', 'stm2']
		};
		instantiationService.stub(IThemeService, {
			getColorTheme() {
				return <IColorTheme>{
					getTokenStyleMetadata: (tokenType, tokenModifiers, languageId): ITokenStyle => {
						return {
							foreground: parseInt(tokenType.substr(2), 10),
							bold: undefined,
							underline: undefined,
							strikethrough: undefined,
							italic: undefined
						};
					}
				};
			}
		});
		const styling = instantiationService.createInstance(SemanticTokensProviderStyling, legend);
		const badTokens = {
			data: new Uint32Array([
				0, 0, 3, 0, 0,
				0, 4, 2, 2, 0,
				0, 2, 3, 8, 0,
				0, 3, 1, 9, 0,
				0, 1, 1, 10, 0,
				0, 1, 4, 8, 0,
				0, 4, 4294967292, 2, 0,
				0, 4294967292, 4294967294, 8, 0,
				0, 4294967294, 1, 9, 0,
				0, 1, 1, 10, 0,
				0, 1, 3, 8, 0,
				0, 3, 4294967291, 8, 0,
				0, 4294967291, 1, 9, 0,
				0, 1, 1, 10, 0,
				0, 1, 4, 8, 0
			])
		};
		const result = toMultilineTokens2(badTokens, styling, languageId);
		const expected = SparseMultilineTokens.create(1, new Uint32Array([
			0, 4, 6, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (1 << MetadataConsts.FOREGROUND_OFFSET)),
			0, 6, 9, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (2 << MetadataConsts.FOREGROUND_OFFSET)),
			0, 9, 10, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (3 << MetadataConsts.FOREGROUND_OFFSET)),
			0, 11, 15, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (4 << MetadataConsts.FOREGROUND_OFFSET)),
		]));
		assert.deepStrictEqual(result.toString(), expected.toString());
	});

	test('issue #149130: vscode freezes because of Bracket Pair Colorization', () => {
		const languageId = 'q';
		disposables.add(languageService.registerLanguage({ id: languageId }));
		const legend = {
			tokenTypes: ['st0', 'st1', 'st2', 'st3', 'st4', 'st5'],
			tokenModifiers: ['stm0', 'stm1', 'stm2']
		};
		instantiationService.stub(IThemeService, {
			getColorTheme() {
				return <IColorTheme>{
					getTokenStyleMetadata: (tokenType, tokenModifiers, languageId): ITokenStyle => {
						return {
							foreground: parseInt(tokenType.substr(2), 10),
							bold: undefined,
							underline: undefined,
							strikethrough: undefined,
							italic: undefined
						};
					}
				};
			}
		});
		const styling = instantiationService.createInstance(SemanticTokensProviderStyling, legend);
		const badTokens = {
			data: new Uint32Array([
				0, 11, 1, 1, 0,
				0, 4, 1, 1, 0,
				0, 4294967289, 1, 1, 0
			])
		};
		const result = toMultilineTokens2(badTokens, styling, languageId);
		const expected = SparseMultilineTokens.create(1, new Uint32Array([
			0, 11, 12, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (1 << MetadataConsts.FOREGROUND_OFFSET)),
			0, 15, 16, (MetadataConsts.SEMANTIC_USE_FOREGROUND | (1 << MetadataConsts.FOREGROUND_OFFSET)),
		]));
		assert.deepStrictEqual(result.toString(), expected.toString());
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/testEditorWorkerService.ts]---
Location: vscode-main/src/vs/editor/test/common/services/testEditorWorkerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../common/core/range.js';
import { DiffAlgorithmName, IEditorWorkerService, IUnicodeHighlightsResult } from '../../../common/services/editorWorker.js';
import { TextEdit, IInplaceReplaceSupportResult, IColorInformation } from '../../../common/languages.js';
import { IDocumentDiff, IDocumentDiffProviderOptions } from '../../../common/diff/documentDiffProvider.js';
import { IChange } from '../../../common/diff/legacyLinesDiffComputer.js';
import { SectionHeader } from '../../../common/services/findSectionHeaders.js';
import { StringEdit } from '../../../common/core/edits/stringEdit.js';

export class TestEditorWorkerService implements IEditorWorkerService {

	declare readonly _serviceBrand: undefined;

	canComputeUnicodeHighlights(uri: URI): boolean { return false; }
	async computedUnicodeHighlights(uri: URI): Promise<IUnicodeHighlightsResult> { return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 }; }
	async computeDiff(original: URI, modified: URI, options: IDocumentDiffProviderOptions, algorithm: DiffAlgorithmName): Promise<IDocumentDiff | null> { return null; }
	canComputeDirtyDiff(original: URI, modified: URI): boolean { return false; }
	async computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null> { return null; }
	async computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined> { return undefined; }
	async computeHumanReadableDiff(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined> { return undefined; }
	canComputeWordRanges(resource: URI): boolean { return false; }
	async computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null> { return null; }
	canNavigateValueSet(resource: URI): boolean { return false; }
	async navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<IInplaceReplaceSupportResult | null> { return null; }
	async findSectionHeaders(uri: URI): Promise<SectionHeader[]> { return []; }
	async computeDefaultDocumentColors(uri: URI): Promise<IColorInformation[] | null> { return null; }

	computeStringEditFromDiff(original: string, modified: string, options: { maxComputationTimeMs: number }, algorithm: DiffAlgorithmName): Promise<StringEdit> {
		throw new Error('Method not implemented.');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/testTextResourcePropertiesService.ts]---
Location: vscode-main/src/vs/editor/test/common/services/testTextResourcePropertiesService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as platform from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextResourcePropertiesService } from '../../../common/services/textResourceConfiguration.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

export class TestTextResourcePropertiesService implements ITextResourcePropertiesService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
	}

	getEOL(resource: URI, language?: string): string {
		const eol = this.configurationService.getValue('files.eol', { overrideIdentifier: language, resource });
		if (eol && typeof eol === 'string' && eol !== 'auto') {
			return eol;
		}
		return (platform.isLinux || platform.isMacintosh) ? '\n' : '\r\n';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/testTreeSitterLibraryService.ts]---
Location: vscode-main/src/vs/editor/test/common/services/testTreeSitterLibraryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Parser, Language, Query } from '@vscode/tree-sitter-wasm';
import { IReader } from '../../../../base/common/observable.js';
import { ITreeSitterLibraryService } from '../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';

export class TestTreeSitterLibraryService implements ITreeSitterLibraryService {
	readonly _serviceBrand: undefined;

	getParserClass(): Promise<typeof Parser> {
		throw new Error('not implemented in TestTreeSitterLibraryService');
	}

	supportsLanguage(languageId: string, reader: IReader | undefined): boolean {
		return false;
	}

	getLanguage(languageId: string, ignoreSupportsCheck: boolean, reader: IReader | undefined): Language | undefined {
		return undefined;
	}

	async getLanguagePromise(languageId: string): Promise<Language | undefined> {
		return undefined;
	}

	getInjectionQueries(languageId: string, reader: IReader | undefined): Query | null | undefined {
		return null;
	}

	getHighlightingQueries(languageId: string, reader: IReader | undefined): Query | null | undefined {
		return null;
	}

	async createQuery(language: Language, querySource: string): Promise<Query> {
		throw new Error('not implemented in TestTreeSitterLibraryService');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/textResourceConfigurationService.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/textResourceConfigurationService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { TestConfigurationService } from '../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IModelService } from '../../../common/services/model.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { IConfigurationValue, IConfigurationService, ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { TextResourceConfigurationService } from '../../../common/services/textResourceConfigurationService.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';


suite('TextResourceConfigurationService - Update', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let configurationValue: IConfigurationValue<any> = {};
	let updateArgs: any[];
	const configurationService = new class extends TestConfigurationService {
		override inspect() {
			return configurationValue;
		}
		override updateValue() {
			updateArgs = [...arguments];
			return Promise.resolve();
		}
	}();
	let language: string | null = null;
	let testObject: TextResourceConfigurationService;

	setup(() => {
		instantiationService = disposables.add(new TestInstantiationService());
		instantiationService.stub(IModelService, { getModel() { return null; } });
		instantiationService.stub(ILanguageService, { guessLanguageIdByFilepathOrFirstLine() { return language; } });
		instantiationService.stub(IConfigurationService, configurationService);
		testObject = disposables.add(instantiationService.createInstance(TextResourceConfigurationService));
	});

	test('updateValue writes without target and overrides when no language is defined', async () => {
		const resource = URI.file('someFile');
		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.USER_LOCAL]);
	});

	test('updateValue writes with target and without overrides when no language is defined', async () => {
		const resource = URI.file('someFile');
		await testObject.updateValue(resource, 'a', 'b', ConfigurationTarget.USER_LOCAL);
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.USER_LOCAL]);
	});

	test('updateValue writes into given memory target without overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			workspaceFolder: { value: '1' },
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b', ConfigurationTarget.MEMORY);
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.MEMORY]);
	});

	test('updateValue writes into given workspace target without overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			workspaceFolder: { value: '2' },
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b', ConfigurationTarget.WORKSPACE);
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.WORKSPACE]);
	});

	test('updateValue writes into given user target without overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			workspaceFolder: { value: '2' },
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b', ConfigurationTarget.USER);
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.USER]);
	});

	test('updateValue writes into given workspace folder target with overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			workspaceFolder: { value: '2', override: '1' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b', ConfigurationTarget.WORKSPACE_FOLDER);
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: language }, ConfigurationTarget.WORKSPACE_FOLDER]);
	});

	test('updateValue writes into derived workspace folder target without overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			workspaceFolder: { value: '2' },
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.WORKSPACE_FOLDER]);
	});

	test('updateValue writes into derived workspace folder target with overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			workspace: { value: '2', override: '1' },
			workspaceFolder: { value: '2', override: '2' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: language }, ConfigurationTarget.WORKSPACE_FOLDER]);
	});

	test('updateValue writes into derived workspace target without overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			workspace: { value: '2' },
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.WORKSPACE]);
	});

	test('updateValue writes into derived workspace target with overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			workspace: { value: '2', override: '2' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: language }, ConfigurationTarget.WORKSPACE]);
	});

	test('updateValue writes into derived workspace target with overrides and value defined in folder', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1', override: '3' },
			userLocal: { value: '2' },
			workspace: { value: '2', override: '2' },
			workspaceFolder: { value: '2' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: language }, ConfigurationTarget.WORKSPACE]);
	});

	test('updateValue writes into derived user remote target without overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			userRemote: { value: '2' },
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.USER_REMOTE]);
	});

	test('updateValue writes into derived user remote target with overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			userRemote: { value: '2', override: '3' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: language }, ConfigurationTarget.USER_REMOTE]);
	});

	test('updateValue writes into derived user remote target with overrides and value defined in workspace', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
			userRemote: { value: '2', override: '3' },
			workspace: { value: '3' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: language }, ConfigurationTarget.USER_REMOTE]);
	});

	test('updateValue writes into derived user remote target with overrides and value defined in workspace folder', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2', override: '1' },
			userRemote: { value: '2', override: '3' },
			workspace: { value: '3' },
			workspaceFolder: { value: '3' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: language }, ConfigurationTarget.USER_REMOTE]);
	});

	test('updateValue writes into derived user target without overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2' },
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.USER_LOCAL]);
	});

	test('updateValue writes into derived user target with overrides', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2', override: '3' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', '2');
		assert.deepStrictEqual(updateArgs, ['a', '2', { resource, overrideIdentifier: language }, ConfigurationTarget.USER_LOCAL]);
	});

	test('updateValue writes into derived user target with overrides and value is defined in remote', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2', override: '3' },
			userRemote: { value: '3' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', '2');
		assert.deepStrictEqual(updateArgs, ['a', '2', { resource, overrideIdentifier: language }, ConfigurationTarget.USER_LOCAL]);
	});

	test('updateValue writes into derived user target with overrides and value is defined in workspace', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
			userLocal: { value: '2', override: '3' },
			workspaceValue: { value: '3' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', '2');
		assert.deepStrictEqual(updateArgs, ['a', '2', { resource, overrideIdentifier: language }, ConfigurationTarget.USER_LOCAL]);
	});

	test('updateValue writes into derived user target with overrides and value is defined in workspace folder', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1', override: '3' },
			userLocal: { value: '2', override: '3' },
			userRemote: { value: '3' },
			workspaceFolderValue: { value: '3' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', '2');
		assert.deepStrictEqual(updateArgs, ['a', '2', { resource, overrideIdentifier: language }, ConfigurationTarget.USER_LOCAL]);
	});

	test('updateValue writes into derived user target when overridden in default and not in user', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1', override: '3' },
			userLocal: { value: '2' },
			overrideIdentifiers: [language]
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', '2');
		assert.deepStrictEqual(updateArgs, ['a', '2', { resource, overrideIdentifier: language }, ConfigurationTarget.USER_LOCAL]);
	});

	test('updateValue when not changed', async () => {
		language = 'a';
		configurationValue = {
			default: { value: '1' },
		};
		const resource = URI.file('someFile');

		await testObject.updateValue(resource, 'a', 'b');
		assert.deepStrictEqual(updateArgs, ['a', 'b', { resource, overrideIdentifier: undefined }, ConfigurationTarget.USER_LOCAL]);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/unicodeTextModelHighlighter.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/unicodeTextModelHighlighter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Range } from '../../../common/core/range.js';
import { UnicodeHighlighterOptions, UnicodeTextModelHighlighter } from '../../../common/services/unicodeTextModelHighlighter.js';
import { createTextModel } from '../testTextModel.js';

suite('UnicodeTextModelHighlighter', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function t(text: string, options: UnicodeHighlighterOptions): unknown {
		const m = createTextModel(text);
		const r = UnicodeTextModelHighlighter.computeUnicodeHighlights(m, options);
		m.dispose();

		return {
			...r,
			ranges: r.ranges.map(r => Range.lift(r).toString())
		};
	}

	test('computeUnicodeHighlights (#168068)', () => {
		assert.deepStrictEqual(
			t(`
	For å gi et eksempel
`, {
				allowedCodePoints: [],
				allowedLocales: [],
				ambiguousCharacters: true,
				invisibleCharacters: true,
				includeComments: false,
				includeStrings: false,
				nonBasicASCII: false
			}),
			{
				ambiguousCharacterCount: 0,
				hasMore: false,
				invisibleCharacterCount: 4,
				nonBasicAsciiCharacterCount: 0,
				ranges: [
					'[2,5 -> 2,6]',
					'[2,7 -> 2,8]',
					'[2,10 -> 2,11]',
					'[2,13 -> 2,14]'
				]
			}
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/view/overviewZoneManager.test.ts]---
Location: vscode-main/src/vs/editor/test/common/view/overviewZoneManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ColorZone, OverviewRulerZone, OverviewZoneManager } from '../../../common/viewModel/overviewZoneManager.js';

suite('Editor View - OverviewZoneManager', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('pixel ratio 1, dom height 600', () => {
		const LINE_COUNT = 50;
		const LINE_HEIGHT = 20;
		const manager = new OverviewZoneManager((lineNumber) => LINE_HEIGHT * lineNumber);
		manager.setDOMWidth(30);
		manager.setDOMHeight(600);
		manager.setOuterHeight(LINE_COUNT * LINE_HEIGHT);
		manager.setLineHeight(LINE_HEIGHT);
		manager.setPixelRatio(1);

		manager.setZones([
			new OverviewRulerZone(1, 1, 0, '1'),
			new OverviewRulerZone(10, 10, 0, '2'),
			new OverviewRulerZone(30, 31, 0, '3'),
			new OverviewRulerZone(50, 50, 0, '4'),
		]);

		// one line = 12, but cap is at 6
		assert.deepStrictEqual(manager.resolveColorZones(), [
			new ColorZone(12, 24, 1), //
			new ColorZone(120, 132, 2), // 120 -> 132
			new ColorZone(360, 384, 3), // 360 -> 372 [360 -> 384]
			new ColorZone(588, 600, 4), // 588 -> 600
		]);
	});

	test('pixel ratio 1, dom height 300', () => {
		const LINE_COUNT = 50;
		const LINE_HEIGHT = 20;
		const manager = new OverviewZoneManager((lineNumber) => LINE_HEIGHT * lineNumber);
		manager.setDOMWidth(30);
		manager.setDOMHeight(300);
		manager.setOuterHeight(LINE_COUNT * LINE_HEIGHT);
		manager.setLineHeight(LINE_HEIGHT);
		manager.setPixelRatio(1);

		manager.setZones([
			new OverviewRulerZone(1, 1, 0, '1'),
			new OverviewRulerZone(10, 10, 0, '2'),
			new OverviewRulerZone(30, 31, 0, '3'),
			new OverviewRulerZone(50, 50, 0, '4'),
		]);

		// one line = 6, cap is at 6
		assert.deepStrictEqual(manager.resolveColorZones(), [
			new ColorZone(6, 12, 1), //
			new ColorZone(60, 66, 2), // 60 -> 66
			new ColorZone(180, 192, 3), // 180 -> 192
			new ColorZone(294, 300, 4), // 294 -> 300
		]);
	});

	test('pixel ratio 2, dom height 300', () => {
		const LINE_COUNT = 50;
		const LINE_HEIGHT = 20;
		const manager = new OverviewZoneManager((lineNumber) => LINE_HEIGHT * lineNumber);
		manager.setDOMWidth(30);
		manager.setDOMHeight(300);
		manager.setOuterHeight(LINE_COUNT * LINE_HEIGHT);
		manager.setLineHeight(LINE_HEIGHT);
		manager.setPixelRatio(2);

		manager.setZones([
			new OverviewRulerZone(1, 1, 0, '1'),
			new OverviewRulerZone(10, 10, 0, '2'),
			new OverviewRulerZone(30, 31, 0, '3'),
			new OverviewRulerZone(50, 50, 0, '4'),
		]);

		// one line = 6, cap is at 12
		assert.deepStrictEqual(manager.resolveColorZones(), [
			new ColorZone(12, 24, 1), //
			new ColorZone(120, 132, 2), // 120 -> 132
			new ColorZone(360, 384, 3), // 360 -> 384
			new ColorZone(588, 600, 4), // 588 -> 600
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/lineDecorations.test.ts]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/lineDecorations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Range } from '../../../common/core/range.js';
import { DecorationSegment, LineDecoration, LineDecorationsNormalizer } from '../../../common/viewLayout/lineDecorations.js';
import { InlineDecoration, InlineDecorationType } from '../../../common/viewModel/inlineDecorations.js';

suite('Editor ViewLayout - ViewLineParts', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Bug 9827:Overlapping inline decorations can cause wrong inline class to be applied', () => {

		const result = LineDecorationsNormalizer.normalize('abcabcabcabcabcabcabcabcabcabc', [
			new LineDecoration(1, 11, 'c1', InlineDecorationType.Regular),
			new LineDecoration(3, 4, 'c2', InlineDecorationType.Regular)
		]);

		assert.deepStrictEqual(result, [
			new DecorationSegment(0, 1, 'c1', 0),
			new DecorationSegment(2, 2, 'c2 c1', 0),
			new DecorationSegment(3, 9, 'c1', 0),
		]);
	});

	test('issue #3462: no whitespace shown at the end of a decorated line', () => {

		const result = LineDecorationsNormalizer.normalize('abcabcabcabcabcabcabcabcabcabc', [
			new LineDecoration(15, 21, 'mtkw', InlineDecorationType.Regular),
			new LineDecoration(20, 21, 'inline-folded', InlineDecorationType.Regular),
		]);

		assert.deepStrictEqual(result, [
			new DecorationSegment(14, 18, 'mtkw', 0),
			new DecorationSegment(19, 19, 'mtkw inline-folded', 0)
		]);
	});

	test('issue #3661: Link decoration bleeds to next line when wrapping', () => {

		const result = LineDecoration.filter([
			new InlineDecoration(new Range(2, 12, 3, 30), 'detected-link', InlineDecorationType.Regular)
		], 3, 12, 500);

		assert.deepStrictEqual(result, [
			new LineDecoration(12, 30, 'detected-link', InlineDecorationType.Regular),
		]);
	});

	test('issue #37401: Allow both before and after decorations on empty line', () => {
		const result = LineDecoration.filter([
			new InlineDecoration(new Range(4, 1, 4, 2), 'before', InlineDecorationType.Before),
			new InlineDecoration(new Range(4, 0, 4, 1), 'after', InlineDecorationType.After),
		], 4, 1, 500);

		assert.deepStrictEqual(result, [
			new LineDecoration(1, 2, 'before', InlineDecorationType.Before),
			new LineDecoration(0, 1, 'after', InlineDecorationType.After),
		]);
	});

	test('ViewLineParts', () => {

		assert.deepStrictEqual(LineDecorationsNormalizer.normalize('abcabcabcabcabcabcabcabcabcabc', [
			new LineDecoration(1, 2, 'c1', InlineDecorationType.Regular),
			new LineDecoration(3, 4, 'c2', InlineDecorationType.Regular)
		]), [
			new DecorationSegment(0, 0, 'c1', 0),
			new DecorationSegment(2, 2, 'c2', 0)
		]);

		assert.deepStrictEqual(LineDecorationsNormalizer.normalize('abcabcabcabcabcabcabcabcabcabc', [
			new LineDecoration(1, 3, 'c1', InlineDecorationType.Regular),
			new LineDecoration(3, 4, 'c2', InlineDecorationType.Regular)
		]), [
			new DecorationSegment(0, 1, 'c1', 0),
			new DecorationSegment(2, 2, 'c2', 0)
		]);

		assert.deepStrictEqual(LineDecorationsNormalizer.normalize('abcabcabcabcabcabcabcabcabcabc', [
			new LineDecoration(1, 4, 'c1', InlineDecorationType.Regular),
			new LineDecoration(3, 4, 'c2', InlineDecorationType.Regular)
		]), [
			new DecorationSegment(0, 1, 'c1', 0),
			new DecorationSegment(2, 2, 'c1 c2', 0)
		]);

		assert.deepStrictEqual(LineDecorationsNormalizer.normalize('abcabcabcabcabcabcabcabcabcabc', [
			new LineDecoration(1, 4, 'c1', InlineDecorationType.Regular),
			new LineDecoration(1, 4, 'c1*', InlineDecorationType.Regular),
			new LineDecoration(3, 4, 'c2', InlineDecorationType.Regular)
		]), [
			new DecorationSegment(0, 1, 'c1 c1*', 0),
			new DecorationSegment(2, 2, 'c1 c1* c2', 0)
		]);

		assert.deepStrictEqual(LineDecorationsNormalizer.normalize('abcabcabcabcabcabcabcabcabcabc', [
			new LineDecoration(1, 4, 'c1', InlineDecorationType.Regular),
			new LineDecoration(1, 4, 'c1*', InlineDecorationType.Regular),
			new LineDecoration(1, 4, 'c1**', InlineDecorationType.Regular),
			new LineDecoration(3, 4, 'c2', InlineDecorationType.Regular)
		]), [
			new DecorationSegment(0, 1, 'c1 c1* c1**', 0),
			new DecorationSegment(2, 2, 'c1 c1* c1** c2', 0)
		]);

		assert.deepStrictEqual(LineDecorationsNormalizer.normalize('abcabcabcabcabcabcabcabcabcabc', [
			new LineDecoration(1, 4, 'c1', InlineDecorationType.Regular),
			new LineDecoration(1, 4, 'c1*', InlineDecorationType.Regular),
			new LineDecoration(1, 4, 'c1**', InlineDecorationType.Regular),
			new LineDecoration(3, 4, 'c2', InlineDecorationType.Regular),
			new LineDecoration(3, 4, 'c2*', InlineDecorationType.Regular)
		]), [
			new DecorationSegment(0, 1, 'c1 c1* c1**', 0),
			new DecorationSegment(2, 2, 'c1 c1* c1** c2 c2*', 0)
		]);

		assert.deepStrictEqual(LineDecorationsNormalizer.normalize('abcabcabcabcabcabcabcabcabcabc', [
			new LineDecoration(1, 4, 'c1', InlineDecorationType.Regular),
			new LineDecoration(1, 4, 'c1*', InlineDecorationType.Regular),
			new LineDecoration(1, 4, 'c1**', InlineDecorationType.Regular),
			new LineDecoration(3, 4, 'c2', InlineDecorationType.Regular),
			new LineDecoration(3, 5, 'c2*', InlineDecorationType.Regular)
		]), [
			new DecorationSegment(0, 1, 'c1 c1* c1**', 0),
			new DecorationSegment(2, 2, 'c1 c1* c1** c2 c2*', 0),
			new DecorationSegment(3, 3, 'c2*', 0)
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/lineHeights.test.ts]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/lineHeights.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { LineHeightsManager } from '../../../common/viewLayout/lineHeights.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('Editor ViewLayout - LineHeightsManager', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('default line height is used when no custom heights exist', () => {
		const manager = new LineHeightsManager(10, []);

		// Check individual line heights
		assert.strictEqual(manager.heightForLineNumber(1), 10);
		assert.strictEqual(manager.heightForLineNumber(5), 10);
		assert.strictEqual(manager.heightForLineNumber(100), 10);

		// Check accumulated heights
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(1), 10);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(5), 50);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(10), 100);
	});

	test('can change default line height', () => {
		const manager = new LineHeightsManager(10, []);
		manager.defaultLineHeight = 20;

		// Check individual line heights
		assert.strictEqual(manager.heightForLineNumber(1), 20);
		assert.strictEqual(manager.heightForLineNumber(5), 20);

		// Check accumulated heights
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(1), 20);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(5), 100);
	});

	test('can add single custom line height', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 3, 3, 20);
		manager.commit();

		// Check individual line heights
		assert.strictEqual(manager.heightForLineNumber(1), 10);
		assert.strictEqual(manager.heightForLineNumber(2), 10);
		assert.strictEqual(manager.heightForLineNumber(3), 20);
		assert.strictEqual(manager.heightForLineNumber(4), 10);

		// Check accumulated heights
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(1), 10);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(2), 20);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(3), 40);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(4), 50);
	});

	test('can add multiple custom line heights', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 2, 2, 15);
		manager.insertOrChangeCustomLineHeight('dec2', 4, 4, 25);
		manager.commit();

		// Check individual line heights
		assert.strictEqual(manager.heightForLineNumber(1), 10);
		assert.strictEqual(manager.heightForLineNumber(2), 15);
		assert.strictEqual(manager.heightForLineNumber(3), 10);
		assert.strictEqual(manager.heightForLineNumber(4), 25);
		assert.strictEqual(manager.heightForLineNumber(5), 10);

		// Check accumulated heights
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(1), 10);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(2), 25);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(3), 35);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(4), 60);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(5), 70);
	});

	test('can add range of custom line heights', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 2, 4, 15);
		manager.commit();

		// Check individual line heights
		assert.strictEqual(manager.heightForLineNumber(1), 10);
		assert.strictEqual(manager.heightForLineNumber(2), 15);
		assert.strictEqual(manager.heightForLineNumber(3), 15);
		assert.strictEqual(manager.heightForLineNumber(4), 15);
		assert.strictEqual(manager.heightForLineNumber(5), 10);

		// Check accumulated heights
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(1), 10);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(2), 25);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(3), 40);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(4), 55);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(5), 65);
	});

	test('can change existing custom line height', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 3, 3, 20);
		manager.commit();
		assert.strictEqual(manager.heightForLineNumber(3), 20);

		manager.insertOrChangeCustomLineHeight('dec1', 3, 3, 30);
		manager.commit();
		assert.strictEqual(manager.heightForLineNumber(3), 30);

		// Check accumulated heights after change
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(3), 50);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(4), 60);
	});

	test('can remove custom line height', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 3, 3, 20);
		manager.commit();
		assert.strictEqual(manager.heightForLineNumber(3), 20);

		manager.removeCustomLineHeight('dec1');
		manager.commit();
		assert.strictEqual(manager.heightForLineNumber(3), 10);

		// Check accumulated heights after removal
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(3), 30);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(4), 40);
	});

	test('handles overlapping custom line heights (last one wins)', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 3, 5, 20);
		manager.insertOrChangeCustomLineHeight('dec2', 4, 6, 30);
		manager.commit();

		assert.strictEqual(manager.heightForLineNumber(2), 10);
		assert.strictEqual(manager.heightForLineNumber(3), 20);
		assert.strictEqual(manager.heightForLineNumber(4), 30);
		assert.strictEqual(manager.heightForLineNumber(5), 30);
		assert.strictEqual(manager.heightForLineNumber(6), 30);
		assert.strictEqual(manager.heightForLineNumber(7), 10);
	});

	test('handles deleting lines before custom line heights', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 10, 12, 20);
		manager.commit();

		manager.onLinesDeleted(5, 7); // Delete lines 5-7

		assert.strictEqual(manager.heightForLineNumber(7), 20); // Was line 10
		assert.strictEqual(manager.heightForLineNumber(8), 20); // Was line 11
		assert.strictEqual(manager.heightForLineNumber(9), 20); // Was line 12
		assert.strictEqual(manager.heightForLineNumber(10), 10);
	});

	test('handles deleting lines overlapping with custom line heights', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 5, 10, 20);
		manager.commit();

		manager.onLinesDeleted(7, 12); // Delete lines 7-12, including part of decoration

		assert.strictEqual(manager.heightForLineNumber(5), 20);
		assert.strictEqual(manager.heightForLineNumber(6), 20);
		assert.strictEqual(manager.heightForLineNumber(7), 10);
	});

	test('handles deleting lines containing custom line heights completely', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 5, 7, 20);
		manager.commit();

		manager.onLinesDeleted(4, 8); // Delete lines 4-8, completely contains decoration

		// The decoration collapses to a single line which matches the behavior in the text buffer
		assert.strictEqual(manager.heightForLineNumber(3), 10);
		assert.strictEqual(manager.heightForLineNumber(4), 20);
		assert.strictEqual(manager.heightForLineNumber(5), 10);
	});

	test('handles deleting lines at the very beginning', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('decA', 1, 1, 40);
		manager.commit();

		manager.onLinesDeleted(2, 4); // Delete lines 2-4 after the variable line height

		// Check individual line heights
		assert.strictEqual(manager.heightForLineNumber(1), 40);
	});

	test('handles inserting lines before custom line heights', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 5, 7, 20);
		manager.commit();

		manager.onLinesInserted(3, 4); // Insert 2 lines at line 3

		assert.strictEqual(manager.heightForLineNumber(5), 10);
		assert.strictEqual(manager.heightForLineNumber(6), 10);
		assert.strictEqual(manager.heightForLineNumber(7), 20); // Was line 5
		assert.strictEqual(manager.heightForLineNumber(8), 20); // Was line 6
		assert.strictEqual(manager.heightForLineNumber(9), 20); // Was line 7
	});

	test('handles inserting lines inside custom line heights range', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 5, 7, 20);
		manager.commit();

		manager.onLinesInserted(6, 7); // Insert 2 lines at line 6

		assert.strictEqual(manager.heightForLineNumber(5), 20);
		assert.strictEqual(manager.heightForLineNumber(6), 20);
		assert.strictEqual(manager.heightForLineNumber(7), 20);
		assert.strictEqual(manager.heightForLineNumber(8), 20);
		assert.strictEqual(manager.heightForLineNumber(9), 20);
	});

	test('changing decoration id maintains custom line height', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 5, 7, 20);
		manager.commit();

		manager.removeCustomLineHeight('dec1');
		manager.insertOrChangeCustomLineHeight('dec2', 5, 7, 20);
		manager.commit();

		assert.strictEqual(manager.heightForLineNumber(5), 20);
		assert.strictEqual(manager.heightForLineNumber(6), 20);
		assert.strictEqual(manager.heightForLineNumber(7), 20);
	});

	test('accumulates heights correctly with complex setup', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('dec1', 3, 3, 15);
		manager.insertOrChangeCustomLineHeight('dec2', 5, 7, 20);
		manager.insertOrChangeCustomLineHeight('dec3', 10, 10, 30);
		manager.commit();

		// Check accumulated heights
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(1), 10);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(2), 20);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(3), 35);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(4), 45);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(5), 65);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(7), 105);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(9), 125);
		assert.strictEqual(manager.getAccumulatedLineHeightsIncludingLineNumber(10), 155);
	});

	test('partial deletion with multiple lines for the same decoration ID', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('decSame', 5, 5, 20);
		manager.insertOrChangeCustomLineHeight('decSame', 6, 6, 25);
		manager.commit();

		// Delete one line that partially intersects the same decoration
		manager.onLinesDeleted(6, 6);

		// Check individual line heights
		assert.strictEqual(manager.heightForLineNumber(5), 20);
		assert.strictEqual(manager.heightForLineNumber(6), 10);
	});

	test('overlapping decorations use maximum line height', () => {
		const manager = new LineHeightsManager(10, []);
		manager.insertOrChangeCustomLineHeight('decA', 3, 5, 40);
		manager.insertOrChangeCustomLineHeight('decB', 4, 6, 30);
		manager.commit();

		// Check individual line heights
		assert.strictEqual(manager.heightForLineNumber(3), 40);
		assert.strictEqual(manager.heightForLineNumber(4), 40);
		assert.strictEqual(manager.heightForLineNumber(5), 40);
		assert.strictEqual(manager.heightForLineNumber(6), 30);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/linesLayout.test.ts]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/linesLayout.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { EditorWhitespace, LinesLayout } from '../../../common/viewLayout/linesLayout.js';

suite('Editor ViewLayout - LinesLayout', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function insertWhitespace(linesLayout: LinesLayout, afterLineNumber: number, ordinal: number, heightInPx: number, minWidth: number): string {
		let id: string;
		linesLayout.changeWhitespace((accessor) => {
			id = accessor.insertWhitespace(afterLineNumber, ordinal, heightInPx, minWidth);
		});
		return id!;
	}

	function changeOneWhitespace(linesLayout: LinesLayout, id: string, newAfterLineNumber: number, newHeight: number): void {
		linesLayout.changeWhitespace((accessor) => {
			accessor.changeOneWhitespace(id, newAfterLineNumber, newHeight);
		});
	}

	function removeWhitespace(linesLayout: LinesLayout, id: string): void {
		linesLayout.changeWhitespace((accessor) => {
			accessor.removeWhitespace(id);
		});
	}

	test('LinesLayout 1', () => {

		// Start off with 10 lines
		const linesLayout = new LinesLayout(10, 10, 0, 0, []);

		// lines: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		// whitespace: -
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 100);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 10);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 20);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 30);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 40);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 50);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 60);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 70);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 80);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 90);

		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(0), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(1), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(5), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(9), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(10), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(11), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(15), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(19), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(20), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(21), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(29), 3);

		// Add whitespace of height 5px after 2nd line
		insertWhitespace(linesLayout, 2, 0, 5, 0);
		// lines: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		// whitespace: a(2,5)
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 105);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 10);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 25);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 35);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 45);

		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(0), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(1), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(9), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(10), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(20), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(21), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(24), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(25), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(35), 4);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(45), 5);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(104), 10);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(105), 10);

		// Add two more whitespaces of height 5px
		insertWhitespace(linesLayout, 3, 0, 5, 0);
		insertWhitespace(linesLayout, 4, 0, 5, 0);
		// lines: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		// whitespace: a(2,5), b(3, 5), c(4, 5)
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 115);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 10);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 25);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 40);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 55);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 65);

		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(0), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(1), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(9), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(10), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(19), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(20), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(34), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(35), 4);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(49), 4);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(50), 5);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(64), 5);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(65), 6);

		assert.strictEqual(linesLayout.getVerticalOffsetForWhitespaceIndex(0), 20); // 20 -> 25
		assert.strictEqual(linesLayout.getVerticalOffsetForWhitespaceIndex(1), 35); // 35 -> 40
		assert.strictEqual(linesLayout.getVerticalOffsetForWhitespaceIndex(2), 50);

		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(0), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(19), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(20), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(21), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(22), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(23), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(24), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(25), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(26), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(34), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(35), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(36), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(39), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(40), 2);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(41), 2);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(49), 2);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(50), 2);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(51), 2);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(54), 2);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(55), -1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(1000), -1);

	});

	test('LinesLayout 2', () => {

		// Start off with 10 lines and one whitespace after line 2, of height 5
		const linesLayout = new LinesLayout(10, 1, 0, 0, []);
		const a = insertWhitespace(linesLayout, 2, 0, 5, 0);

		// 10 lines
		// whitespace: - a(2,5)
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 15);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 1);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 7);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 8);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 9);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 10);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 11);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 12);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 13);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 14);

		// Change whitespace height
		// 10 lines
		// whitespace: - a(2,10)
		changeOneWhitespace(linesLayout, a, 2, 10);
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 20);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 1);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 12);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 13);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 14);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 15);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 16);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 17);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 18);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 19);

		// Change whitespace position
		// 10 lines
		// whitespace: - a(5,10)
		changeOneWhitespace(linesLayout, a, 5, 10);
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 20);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 1);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 2);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 3);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 4);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 15);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 16);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 17);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 18);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 19);

		// Pretend that lines 5 and 6 were deleted
		// 8 lines
		// whitespace: - a(4,10)
		linesLayout.onLinesDeleted(5, 6);
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 18);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 1);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 2);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 3);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 14);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 15);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 16);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 17);

		// Insert two lines at the beginning
		// 10 lines
		// whitespace: - a(6,10)
		linesLayout.onLinesInserted(1, 2);
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 20);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 1);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 2);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 3);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 4);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 5);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 16);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 17);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 18);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 19);

		// Remove whitespace
		// 10 lines
		removeWhitespace(linesLayout, a);
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 10);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 1);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 2);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 3);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 4);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 5);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 6);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 7);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 8);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 9);
	});

	test('LinesLayout Padding', () => {
		// Start off with 10 lines
		const linesLayout = new LinesLayout(10, 10, 15, 20, []);

		// lines: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		// whitespace: -
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 135);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 15);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 25);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 35);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 45);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 55);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 65);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 75);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 85);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 95);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 105);

		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(0), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(10), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(15), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(24), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(25), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(34), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(35), 3);

		// Add whitespace of height 5px after 2nd line
		insertWhitespace(linesLayout, 2, 0, 5, 0);
		// lines: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		// whitespace: a(2,5)
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 140);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 15);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 25);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 40);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 50);

		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(0), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(10), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(25), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(34), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(35), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(39), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(40), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(41), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(49), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(50), 4);

		// Add two more whitespaces of height 5px
		insertWhitespace(linesLayout, 3, 0, 5, 0);
		insertWhitespace(linesLayout, 4, 0, 5, 0);
		// lines: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		// whitespace: a(2,5), b(3, 5), c(4, 5)
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 150);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 15);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 25);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 40);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 55);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 70);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 80);

		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(0), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(15), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(24), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(30), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(35), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(39), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(40), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(49), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(50), 4);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(54), 4);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(55), 4);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(64), 4);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(65), 5);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(69), 5);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(70), 5);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(80), 6);

		assert.strictEqual(linesLayout.getVerticalOffsetForWhitespaceIndex(0), 35); // 35 -> 40
		assert.strictEqual(linesLayout.getVerticalOffsetForWhitespaceIndex(1), 50); // 50 -> 55
		assert.strictEqual(linesLayout.getVerticalOffsetForWhitespaceIndex(2), 65);

		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(0), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(34), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(35), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(39), 0);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(40), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(49), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(50), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(54), 1);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(55), 2);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(64), 2);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(65), 2);
		assert.strictEqual(linesLayout.getWhitespaceIndexAtOrAfterVerticallOffset(70), -1);
	});

	test('LinesLayout getLineNumberAtOrAfterVerticalOffset', () => {
		const linesLayout = new LinesLayout(10, 1, 0, 0, []);
		insertWhitespace(linesLayout, 6, 0, 10, 0);

		// 10 lines
		// whitespace: - a(6,10)
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 20);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 1);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 2);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 3);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 4);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 5);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 16);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 17);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 18);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 19);

		// Do some hit testing
		// line      [1, 2, 3, 4, 5, 6,  7,  8,  9, 10]
		// vertical: [0, 1, 2, 3, 4, 5, 16, 17, 18, 19]
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(-100), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(-1), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(0), 1);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(1), 2);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(2), 3);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(3), 4);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(4), 5);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(5), 6);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(6), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(7), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(8), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(9), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(10), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(11), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(12), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(13), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(14), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(15), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(16), 7);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(17), 8);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(18), 9);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(19), 10);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(20), 10);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(21), 10);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(22), 10);
		assert.strictEqual(linesLayout.getLineNumberAtOrAfterVerticalOffset(23), 10);
	});

	test('LinesLayout getCenteredLineInViewport', () => {
		const linesLayout = new LinesLayout(10, 1, 0, 0, []);
		insertWhitespace(linesLayout, 6, 0, 10, 0);

		// 10 lines
		// whitespace: - a(6,10)
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 20);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 1);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 2);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 3);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 4);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 5);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 16);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 17);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 18);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 19);

		// Find centered line in viewport 1
		// line      [1, 2, 3, 4, 5, 6,  7,  8,  9, 10]
		// vertical: [0, 1, 2, 3, 4, 5, 16, 17, 18, 19]
		assert.strictEqual(linesLayout.getLinesViewportData(0, 1).centeredLineNumber, 1);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 2).centeredLineNumber, 2);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 3).centeredLineNumber, 2);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 4).centeredLineNumber, 3);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 5).centeredLineNumber, 3);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 6).centeredLineNumber, 4);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 7).centeredLineNumber, 4);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 8).centeredLineNumber, 5);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 9).centeredLineNumber, 5);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 10).centeredLineNumber, 6);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 11).centeredLineNumber, 6);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 12).centeredLineNumber, 6);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 13).centeredLineNumber, 6);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 14).centeredLineNumber, 6);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 15).centeredLineNumber, 6);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 16).centeredLineNumber, 6);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 17).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 18).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 19).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 21).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 22).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 23).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 24).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 25).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 26).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 27).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 28).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 29).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 30).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 31).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 32).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(0, 33).centeredLineNumber, 7);

		// Find centered line in viewport 2
		// line      [1, 2, 3, 4, 5, 6,  7,  8,  9, 10]
		// vertical: [0, 1, 2, 3, 4, 5, 16, 17, 18, 19]
		assert.strictEqual(linesLayout.getLinesViewportData(0, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(1, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(2, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(3, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(4, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(5, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(6, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(7, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(8, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(9, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(10, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(11, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(12, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(13, 20).centeredLineNumber, 7);
		assert.strictEqual(linesLayout.getLinesViewportData(14, 20).centeredLineNumber, 8);
		assert.strictEqual(linesLayout.getLinesViewportData(15, 20).centeredLineNumber, 8);
		assert.strictEqual(linesLayout.getLinesViewportData(16, 20).centeredLineNumber, 9);
		assert.strictEqual(linesLayout.getLinesViewportData(17, 20).centeredLineNumber, 9);
		assert.strictEqual(linesLayout.getLinesViewportData(18, 20).centeredLineNumber, 10);
		assert.strictEqual(linesLayout.getLinesViewportData(19, 20).centeredLineNumber, 10);
		assert.strictEqual(linesLayout.getLinesViewportData(20, 23).centeredLineNumber, 10);
		assert.strictEqual(linesLayout.getLinesViewportData(21, 23).centeredLineNumber, 10);
		assert.strictEqual(linesLayout.getLinesViewportData(22, 23).centeredLineNumber, 10);
	});

	test('LinesLayout getLinesViewportData 1', () => {
		const linesLayout = new LinesLayout(10, 10, 0, 0, []);
		insertWhitespace(linesLayout, 6, 0, 100, 0);

		// 10 lines
		// whitespace: - a(6,100)
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 200);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 10);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 20);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 30);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 40);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 50);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 160);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 170);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 180);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 190);

		// viewport 0->50
		let viewportData = linesLayout.getLinesViewportData(0, 50);
		assert.strictEqual(viewportData.startLineNumber, 1);
		assert.strictEqual(viewportData.endLineNumber, 5);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 1);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 5);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [0, 10, 20, 30, 40]);

		// viewport 1->51
		viewportData = linesLayout.getLinesViewportData(1, 51);
		assert.strictEqual(viewportData.startLineNumber, 1);
		assert.strictEqual(viewportData.endLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 2);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 5);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [0, 10, 20, 30, 40, 50]);

		// viewport 5->55
		viewportData = linesLayout.getLinesViewportData(5, 55);
		assert.strictEqual(viewportData.startLineNumber, 1);
		assert.strictEqual(viewportData.endLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 2);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 5);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [0, 10, 20, 30, 40, 50]);

		// viewport 10->60
		viewportData = linesLayout.getLinesViewportData(10, 60);
		assert.strictEqual(viewportData.startLineNumber, 2);
		assert.strictEqual(viewportData.endLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 2);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 6);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [10, 20, 30, 40, 50]);

		// viewport 50->100
		viewportData = linesLayout.getLinesViewportData(50, 100);
		assert.strictEqual(viewportData.startLineNumber, 6);
		assert.strictEqual(viewportData.endLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 6);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [50]);

		// viewport 60->110
		viewportData = linesLayout.getLinesViewportData(60, 110);
		assert.strictEqual(viewportData.startLineNumber, 7);
		assert.strictEqual(viewportData.endLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 7);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [160]);

		// viewport 65->115
		viewportData = linesLayout.getLinesViewportData(65, 115);
		assert.strictEqual(viewportData.startLineNumber, 7);
		assert.strictEqual(viewportData.endLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 7);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [160]);

		// viewport 50->159
		viewportData = linesLayout.getLinesViewportData(50, 159);
		assert.strictEqual(viewportData.startLineNumber, 6);
		assert.strictEqual(viewportData.endLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 6);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [50]);

		// viewport 50->160
		viewportData = linesLayout.getLinesViewportData(50, 160);
		assert.strictEqual(viewportData.startLineNumber, 6);
		assert.strictEqual(viewportData.endLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 6);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [50]);

		// viewport 51->161
		viewportData = linesLayout.getLinesViewportData(51, 161);
		assert.strictEqual(viewportData.startLineNumber, 6);
		assert.strictEqual(viewportData.endLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 7);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [50, 160]);


		// viewport 150->169
		viewportData = linesLayout.getLinesViewportData(150, 169);
		assert.strictEqual(viewportData.startLineNumber, 7);
		assert.strictEqual(viewportData.endLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 7);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [160]);

		// viewport 159->169
		viewportData = linesLayout.getLinesViewportData(159, 169);
		assert.strictEqual(viewportData.startLineNumber, 7);
		assert.strictEqual(viewportData.endLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 7);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [160]);

		// viewport 160->169
		viewportData = linesLayout.getLinesViewportData(160, 169);
		assert.strictEqual(viewportData.startLineNumber, 7);
		assert.strictEqual(viewportData.endLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 7);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [160]);


		// viewport 160->1000
		viewportData = linesLayout.getLinesViewportData(160, 1000);
		assert.strictEqual(viewportData.startLineNumber, 7);
		assert.strictEqual(viewportData.endLineNumber, 10);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 10);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [160, 170, 180, 190]);
	});

	test('LinesLayout getLinesViewportData 2 & getWhitespaceViewportData', () => {
		const linesLayout = new LinesLayout(10, 10, 0, 0, []);
		const a = insertWhitespace(linesLayout, 6, 0, 100, 0);
		const b = insertWhitespace(linesLayout, 7, 0, 50, 0);

		// 10 lines
		// whitespace: - a(6,100), b(7, 50)
		assert.strictEqual(linesLayout.getLinesTotalHeight(), 250);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(1), 0);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(2), 10);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(3), 20);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(4), 30);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(5), 40);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(6), 50);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(7), 160);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(8), 220);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(9), 230);
		assert.strictEqual(linesLayout.getVerticalOffsetForLineNumber(10), 240);

		// viewport 50->160
		let viewportData = linesLayout.getLinesViewportData(50, 160);
		assert.strictEqual(viewportData.startLineNumber, 6);
		assert.strictEqual(viewportData.endLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 6);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [50]);
		let whitespaceData = linesLayout.getWhitespaceViewportData(50, 160);
		assert.deepStrictEqual(whitespaceData, [{
			id: a,
			afterLineNumber: 6,
			verticalOffset: 60,
			height: 100
		}]);

		// viewport 50->219
		viewportData = linesLayout.getLinesViewportData(50, 219);
		assert.strictEqual(viewportData.startLineNumber, 6);
		assert.strictEqual(viewportData.endLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 7);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [50, 160]);
		whitespaceData = linesLayout.getWhitespaceViewportData(50, 219);
		assert.deepStrictEqual(whitespaceData, [{
			id: a,
			afterLineNumber: 6,
			verticalOffset: 60,
			height: 100
		}, {
			id: b,
			afterLineNumber: 7,
			verticalOffset: 170,
			height: 50
		}]);

		// viewport 50->220
		viewportData = linesLayout.getLinesViewportData(50, 220);
		assert.strictEqual(viewportData.startLineNumber, 6);
		assert.strictEqual(viewportData.endLineNumber, 7);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 7);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [50, 160]);

		// viewport 50->250
		viewportData = linesLayout.getLinesViewportData(50, 250);
		assert.strictEqual(viewportData.startLineNumber, 6);
		assert.strictEqual(viewportData.endLineNumber, 10);
		assert.strictEqual(viewportData.completelyVisibleStartLineNumber, 6);
		assert.strictEqual(viewportData.completelyVisibleEndLineNumber, 10);
		assert.deepStrictEqual(viewportData.relativeVerticalOffset, [50, 160, 220, 230, 240]);
	});

	test('LinesLayout getWhitespaceAtVerticalOffset', () => {
		const linesLayout = new LinesLayout(10, 10, 0, 0, []);
		const a = insertWhitespace(linesLayout, 6, 0, 100, 0);
		const b = insertWhitespace(linesLayout, 7, 0, 50, 0);

		let whitespace = linesLayout.getWhitespaceAtVerticalOffset(0);
		assert.strictEqual(whitespace, null);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(59);
		assert.strictEqual(whitespace, null);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(60);
		assert.strictEqual(whitespace!.id, a);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(61);
		assert.strictEqual(whitespace!.id, a);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(159);
		assert.strictEqual(whitespace!.id, a);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(160);
		assert.strictEqual(whitespace, null);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(161);
		assert.strictEqual(whitespace, null);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(169);
		assert.strictEqual(whitespace, null);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(170);
		assert.strictEqual(whitespace!.id, b);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(171);
		assert.strictEqual(whitespace!.id, b);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(219);
		assert.strictEqual(whitespace!.id, b);

		whitespace = linesLayout.getWhitespaceAtVerticalOffset(220);
		assert.strictEqual(whitespace, null);
	});

	test('LinesLayout', () => {

		const linesLayout = new LinesLayout(100, 20, 0, 0, []);

		// Insert a whitespace after line number 2, of height 10
		const a = insertWhitespace(linesLayout, 2, 0, 10, 0);
		// whitespaces: a(2, 10)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 1);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 10);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 10);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 10);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 10);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 10);

		// Insert a whitespace again after line number 2, of height 20
		let b = insertWhitespace(linesLayout, 2, 0, 20, 0);
		// whitespaces: a(2, 10), b(2, 20)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 2);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 10);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 20);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 10);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 30);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 30);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 30);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 30);

		// Change last inserted whitespace height to 30
		changeOneWhitespace(linesLayout, b, 2, 30);
		// whitespaces: a(2, 10), b(2, 30)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 2);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 10);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 30);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 10);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 40);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 40);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 40);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 40);

		// Remove last inserted whitespace
		removeWhitespace(linesLayout, b);
		// whitespaces: a(2, 10)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 1);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 10);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 10);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 10);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 10);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 10);

		// Add a whitespace before the first line of height 50
		b = insertWhitespace(linesLayout, 0, 0, 50, 0);
		// whitespaces: b(0, 50), a(2, 10)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 2);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 0);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 50);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 10);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 50);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 60);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 60);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 60);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 60);

		// Add a whitespace after line 4 of height 20
		insertWhitespace(linesLayout, 4, 0, 20, 0);
		// whitespaces: b(0, 50), a(2, 10), c(4, 20)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 3);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 0);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 50);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 10);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 4);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(2), 20);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 50);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 60);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(2), 80);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 80);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 60);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 60);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(5), 80);

		// Add a whitespace after line 3 of height 30
		insertWhitespace(linesLayout, 3, 0, 30, 0);
		// whitespaces: b(0, 50), a(2, 10), d(3, 30), c(4, 20)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 4);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 0);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 50);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 10);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 3);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(2), 30);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(3), 4);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(3), 20);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 50);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 60);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(2), 90);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(3), 110);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 110);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 60);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 90);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(5), 110);

		// Change whitespace after line 2 to height of 100
		changeOneWhitespace(linesLayout, a, 2, 100);
		// whitespaces: b(0, 50), a(2, 100), d(3, 30), c(4, 20)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 4);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 0);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 50);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 100);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 3);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(2), 30);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(3), 4);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(3), 20);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 50);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 150);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(2), 180);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(3), 200);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 200);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 150);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 180);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(5), 200);

		// Remove whitespace after line 2
		removeWhitespace(linesLayout, a);
		// whitespaces: b(0, 50), d(3, 30), c(4, 20)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 3);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 0);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 50);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 3);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 30);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 4);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(2), 20);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 50);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 80);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(2), 100);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 100);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 80);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(5), 100);

		// Remove whitespace before line 1
		removeWhitespace(linesLayout, b);
		// whitespaces: d(3, 30), c(4, 20)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 2);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 3);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 30);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 4);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 20);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 30);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 50);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 30);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(5), 50);

		// Delete line 1
		linesLayout.onLinesDeleted(1, 1);
		// whitespaces: d(2, 30), c(3, 20)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 2);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 2);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 30);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 3);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 20);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 30);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 50);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 30);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(5), 50);

		// Insert a line before line 1
		linesLayout.onLinesInserted(1, 1);
		// whitespaces: d(3, 30), c(4, 20)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 2);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 3);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 30);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 4);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 20);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 30);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 50);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 30);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(5), 50);

		// Delete line 4
		linesLayout.onLinesDeleted(4, 4);
		// whitespaces: d(3, 30), c(3, 20)
		assert.strictEqual(linesLayout.getWhitespacesCount(), 2);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 3);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(0), 30);
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 3);
		assert.strictEqual(linesLayout.getHeightForWhitespaceIndex(1), 20);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(0), 30);
		assert.strictEqual(linesLayout.getWhitespacesAccumulatedHeight(1), 50);
		assert.strictEqual(linesLayout.getWhitespacesTotalHeight(), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(1), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(2), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(3), 0);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(4), 50);
		assert.strictEqual(linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(5), 50);
	});

	test('LinesLayout findInsertionIndex', () => {

		const makeInternalWhitespace = (afterLineNumbers: number[], ordinal: number = 0) => {
			return afterLineNumbers.map((afterLineNumber) => new EditorWhitespace('', afterLineNumber, ordinal, 0, 0));
		};

		let arr: EditorWhitespace[];

		arr = makeInternalWhitespace([]);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 0);

		arr = makeInternalWhitespace([1]);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 1);

		arr = makeInternalWhitespace([1, 3]);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 3, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 4, 0), 2);

		arr = makeInternalWhitespace([1, 3, 5]);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 3, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 4, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 5, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 6, 0), 3);

		arr = makeInternalWhitespace([1, 3, 5], 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 3, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 4, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 5, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 6, 0), 3);

		arr = makeInternalWhitespace([1, 3, 5, 7]);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 3, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 4, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 5, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 6, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 7, 0), 4);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 8, 0), 4);

		arr = makeInternalWhitespace([1, 3, 5, 7, 9]);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 3, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 4, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 5, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 6, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 7, 0), 4);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 8, 0), 4);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 9, 0), 5);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 10, 0), 5);

		arr = makeInternalWhitespace([1, 3, 5, 7, 9, 11]);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 3, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 4, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 5, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 6, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 7, 0), 4);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 8, 0), 4);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 9, 0), 5);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 10, 0), 5);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 11, 0), 6);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 12, 0), 6);

		arr = makeInternalWhitespace([1, 3, 5, 7, 9, 11, 13]);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 3, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 4, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 5, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 6, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 7, 0), 4);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 8, 0), 4);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 9, 0), 5);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 10, 0), 5);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 11, 0), 6);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 12, 0), 6);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 13, 0), 7);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 14, 0), 7);

		arr = makeInternalWhitespace([1, 3, 5, 7, 9, 11, 13, 15]);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 0, 0), 0);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 1, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 2, 0), 1);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 3, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 4, 0), 2);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 5, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 6, 0), 3);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 7, 0), 4);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 8, 0), 4);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 9, 0), 5);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 10, 0), 5);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 11, 0), 6);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 12, 0), 6);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 13, 0), 7);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 14, 0), 7);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 15, 0), 8);
		assert.strictEqual(LinesLayout.findInsertionIndex(arr, 16, 0), 8);
	});

	test('LinesLayout changeWhitespaceAfterLineNumber & getFirstWhitespaceIndexAfterLineNumber', () => {
		const linesLayout = new LinesLayout(100, 20, 0, 0, []);

		const a = insertWhitespace(linesLayout, 0, 0, 1, 0);
		const b = insertWhitespace(linesLayout, 7, 0, 1, 0);
		const c = insertWhitespace(linesLayout, 3, 0, 1, 0);

		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 0
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 0);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), c); // 3
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 3);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), b); // 7
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 7);

		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(1), 1); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(2), 1); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(3), 1); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(4), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(5), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(6), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(7), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(8), -1); // --

		// Do not really move a
		changeOneWhitespace(linesLayout, a, 1, 1);

		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 1
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 1);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), c); // 3
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 3);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), b); // 7
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 7);

		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(1), 0); // a
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(2), 1); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(3), 1); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(4), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(5), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(6), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(7), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(8), -1); // --


		// Do not really move a
		changeOneWhitespace(linesLayout, a, 2, 1);

		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 2
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 2);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), c); // 3
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 3);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), b); // 7
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 7);

		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(1), 0); // a
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(2), 0); // a
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(3), 1); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(4), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(5), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(6), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(7), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(8), -1); // --


		// Change a to conflict with c => a gets placed after c
		changeOneWhitespace(linesLayout, a, 3, 1);

		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), c); // 3
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 3);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), a); // 3
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 3);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), b); // 7
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 7);

		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(1), 0); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(2), 0); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(3), 0); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(4), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(5), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(6), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(7), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(8), -1); // --


		// Make a no-op
		changeOneWhitespace(linesLayout, c, 3, 1);

		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), c); // 3
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 3);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), a); // 3
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 3);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), b); // 7
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 7);

		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(1), 0); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(2), 0); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(3), 0); // c
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(4), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(5), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(6), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(7), 2); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(8), -1); // --



		// Conflict c with b => c gets placed after b
		changeOneWhitespace(linesLayout, c, 7, 1);

		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 3
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(0), 3);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), b); // 7
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(1), 7);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), c); // 7
		assert.strictEqual(linesLayout.getAfterLineNumberForWhitespaceIndex(2), 7);

		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(1), 0); // a
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(2), 0); // a
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(3), 0); // a
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(4), 1); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(5), 1); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(6), 1); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(7), 1); // b
		assert.strictEqual(linesLayout.getFirstWhitespaceIndexAfterLineNumber(8), -1); // --
	});

	test('LinesLayout Bug', () => {
		const linesLayout = new LinesLayout(100, 20, 0, 0, []);

		const a = insertWhitespace(linesLayout, 0, 0, 1, 0);
		const b = insertWhitespace(linesLayout, 7, 0, 1, 0);

		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 0
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), b); // 7

		const c = insertWhitespace(linesLayout, 3, 0, 1, 0);

		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 0
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), c); // 3
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), b); // 7

		const d = insertWhitespace(linesLayout, 2, 0, 1, 0);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 0
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), d); // 2
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), c); // 3
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(3), b); // 7

		const e = insertWhitespace(linesLayout, 8, 0, 1, 0);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 0
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), d); // 2
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), c); // 3
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(3), b); // 7
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(4), e); // 8

		const f = insertWhitespace(linesLayout, 11, 0, 1, 0);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 0
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), d); // 2
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), c); // 3
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(3), b); // 7
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(4), e); // 8
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(5), f); // 11

		const g = insertWhitespace(linesLayout, 10, 0, 1, 0);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 0
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), d); // 2
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), c); // 3
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(3), b); // 7
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(4), e); // 8
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(5), g); // 10
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(6), f); // 11

		const h = insertWhitespace(linesLayout, 0, 0, 1, 0);
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(0), a); // 0
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(1), h); // 0
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(2), d); // 2
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(3), c); // 3
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(4), b); // 7
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(5), e); // 8
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(6), g); // 10
		assert.strictEqual(linesLayout.getIdForWhitespaceIndex(7), f); // 11
	});
});
```

--------------------------------------------------------------------------------

````

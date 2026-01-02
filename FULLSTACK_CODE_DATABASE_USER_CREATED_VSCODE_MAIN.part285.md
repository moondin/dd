---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 285
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 285 of 552)

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

---[FILE: src/vs/platform/telemetry/test/browser/telemetryService.test.ts]---
Location: vscode-main/src/vs/platform/telemetry/test/browser/telemetryService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as sinon from 'sinon';
import sinonTest from 'sinon-test';
import { mainWindow } from '../../../../base/browser/window.js';
import * as Errors from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../configuration/test/common/testConfigurationService.js';
import product from '../../../product/common/product.js';
import { IProductService } from '../../../product/common/productService.js';
import ErrorTelemetry from '../../browser/errorTelemetry.js';
import { TelemetryConfiguration, TelemetryLevel } from '../../common/telemetry.js';
import { ITelemetryServiceConfig, TelemetryService } from '../../common/telemetryService.js';
import { ITelemetryAppender, NullAppender } from '../../common/telemetryUtils.js';

const sinonTestFn = sinonTest(sinon);

class TestTelemetryAppender implements ITelemetryAppender {

	public events: any[];
	public isDisposed: boolean;

	constructor() {
		this.events = [];
		this.isDisposed = false;
	}

	public log(eventName: string, data?: any): void {
		this.events.push({ eventName, data });
	}

	public getEventsCount() {
		return this.events.length;
	}

	public flush(): Promise<any> {
		this.isDisposed = true;
		return Promise.resolve(null);
	}
}

class ErrorTestingSettings {
	public personalInfo: string;
	public importantInfo: string;
	public filePrefix: string;
	public dangerousPathWithoutImportantInfo: string;
	public dangerousPathWithImportantInfo: string;
	public missingModelPrefix: string;
	public missingModelMessage: string;
	public noSuchFilePrefix: string;
	public noSuchFileMessage: string;
	public stack: string[];
	public randomUserFile: string = 'a/path/that/doe_snt/con-tain/code/names.js';
	public anonymizedRandomUserFile: string = '<REDACTED: user-file-path>';
	public nodeModulePathToRetain: string = 'node_modules/path/that/shouldbe/retained/names.js:14:15854';
	public nodeModuleAsarPathToRetain: string = 'node_modules.asar/path/that/shouldbe/retained/names.js:14:12354';

	constructor() {
		this.personalInfo = 'DANGEROUS/PATH';
		this.importantInfo = 'important/information';
		this.filePrefix = 'file:///';
		this.dangerousPathWithImportantInfo = this.filePrefix + this.personalInfo + '/resources/app/' + this.importantInfo;
		this.dangerousPathWithoutImportantInfo = this.filePrefix + this.personalInfo;

		this.missingModelPrefix = 'Received model events for missing model ';
		this.missingModelMessage = this.missingModelPrefix + ' ' + this.dangerousPathWithoutImportantInfo;

		this.noSuchFilePrefix = 'ENOENT: no such file or directory';
		this.noSuchFileMessage = this.noSuchFilePrefix + ' \'' + this.personalInfo + '\'';

		this.stack = [`at e._modelEvents (${this.randomUserFile}:11:7309)`,
		`    at t.AllWorkers (${this.randomUserFile}:6:8844)`,
		`    at e.(anonymous function) [as _modelEvents] (${this.randomUserFile}:5:29552)`,
		`    at Function.<anonymous> (${this.randomUserFile}:6:8272)`,
		`    at e.dispatch (${this.randomUserFile}:5:26931)`,
		`    at e.request (/${this.nodeModuleAsarPathToRetain})`,
		`    at t._handleMessage (${this.nodeModuleAsarPathToRetain})`,
		`    at t._onmessage (/${this.nodeModulePathToRetain})`,
		`    at t.onmessage (${this.nodeModulePathToRetain})`,
			`    at DedicatedWorkerGlobalScope.self.onmessage`,
		this.dangerousPathWithImportantInfo,
		this.dangerousPathWithoutImportantInfo,
		this.missingModelMessage,
		this.noSuchFileMessage];
	}
}

suite('TelemetryService', () => {

	const TestProductService: IProductService = { _serviceBrand: undefined, ...product };

	test('Disposing', sinonTestFn(function () {
		const testAppender = new TestTelemetryAppender();
		const service = new TelemetryService({ appenders: [testAppender] }, new TestConfigurationService(), TestProductService);

		service.publicLog('testPrivateEvent');
		assert.strictEqual(testAppender.getEventsCount(), 1);

		service.dispose();
		assert.strictEqual(!testAppender.isDisposed, true);
	}));

	// event reporting
	test('Simple event', sinonTestFn(function () {
		const testAppender = new TestTelemetryAppender();
		const service = new TelemetryService({ appenders: [testAppender] }, new TestConfigurationService(), TestProductService);

		service.publicLog('testEvent');
		assert.strictEqual(testAppender.getEventsCount(), 1);
		assert.strictEqual(testAppender.events[0].eventName, 'testEvent');
		assert.notStrictEqual(testAppender.events[0].data, null);

		service.dispose();
	}));

	test('Event with data', sinonTestFn(function () {
		const testAppender = new TestTelemetryAppender();
		const service = new TelemetryService({ appenders: [testAppender] }, new TestConfigurationService(), TestProductService);

		service.publicLog('testEvent', {
			'stringProp': 'property',
			'numberProp': 1,
			'booleanProp': true,
			'complexProp': {
				'value': 0
			}
		});

		assert.strictEqual(testAppender.getEventsCount(), 1);
		assert.strictEqual(testAppender.events[0].eventName, 'testEvent');
		assert.notStrictEqual(testAppender.events[0].data, null);
		assert.strictEqual(testAppender.events[0].data['stringProp'], 'property');
		assert.strictEqual(testAppender.events[0].data['numberProp'], 1);
		assert.strictEqual(testAppender.events[0].data['booleanProp'], true);
		assert.strictEqual(testAppender.events[0].data['complexProp'].value, 0);

		service.dispose();
	}));

	test('common properties added to *all* events, simple event', function () {
		const testAppender = new TestTelemetryAppender();
		const service = new TelemetryService({
			appenders: [testAppender],
			commonProperties: { foo: 'JA!', get bar() { return Math.random() % 2 === 0; } }
		}, new TestConfigurationService(), TestProductService);

		service.publicLog('testEvent');
		const [first] = testAppender.events;

		assert.strictEqual(Object.keys(first.data).length, 2);
		assert.strictEqual(typeof first.data['foo'], 'string');
		assert.strictEqual(typeof first.data['bar'], 'boolean');

		service.dispose();
	});

	test('common properties added to *all* events, event with data', function () {
		const testAppender = new TestTelemetryAppender();
		const service = new TelemetryService({
			appenders: [testAppender],
			commonProperties: { foo: 'JA!', get bar() { return Math.random() % 2 === 0; } }
		}, new TestConfigurationService(), TestProductService);

		service.publicLog('testEvent', { hightower: 'xl', price: 8000 });
		const [first] = testAppender.events;

		assert.strictEqual(Object.keys(first.data).length, 4);
		assert.strictEqual(typeof first.data['foo'], 'string');
		assert.strictEqual(typeof first.data['bar'], 'boolean');
		assert.strictEqual(typeof first.data['hightower'], 'string');
		assert.strictEqual(typeof first.data['price'], 'number');

		service.dispose();
	});

	test('TelemetryInfo comes from properties', function () {
		const service = new TelemetryService({
			appenders: [NullAppender],
			commonProperties: {
				sessionID: 'one',
				['common.machineId']: 'three',
			}
		}, new TestConfigurationService(), TestProductService);

		assert.strictEqual(service.sessionId, 'one');
		assert.strictEqual(service.machineId, 'three');

		service.dispose();
	});

	test('telemetry on by default', function () {
		const testAppender = new TestTelemetryAppender();
		const service = new TelemetryService({ appenders: [testAppender] }, new TestConfigurationService(), TestProductService);

		service.publicLog('testEvent');
		assert.strictEqual(testAppender.getEventsCount(), 1);
		assert.strictEqual(testAppender.events[0].eventName, 'testEvent');

		service.dispose();
	});

	class TestErrorTelemetryService extends TelemetryService {
		constructor(config: ITelemetryServiceConfig) {
			super({ ...config, sendErrorTelemetry: true }, new TestConfigurationService, TestProductService);
		}
	}

	test('Error events', sinonTestFn(function (this: any) {

		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);


			const e: any = new Error('This is a test.');
			// for Phantom
			if (!e.stack) {
				e.stack = 'blah';
			}

			Errors.onUnexpectedError(e);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.strictEqual(testAppender.getEventsCount(), 1);
			assert.strictEqual(testAppender.events[0].eventName, 'UnhandledError');
			assert.strictEqual(testAppender.events[0].data.msg, 'This is a test.');

			errorTelemetry.dispose();
			service.dispose();
		} finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	// 	test('Unhandled Promise Error events', sinonTestFn(function() {
	//
	// 		let origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
	// 		Errors.setUnexpectedErrorHandler(() => {});
	//
	// 		try {
	// 			let service = new MainTelemetryService();
	// 			let testAppender = new TestTelemetryAppender();
	// 			service.addTelemetryAppender(testAppender);
	//
	// 			winjs.Promise.wrapError(new Error('This should not get logged'));
	// 			winjs.TPromise.as(true).then(() => {
	// 				throw new Error('This should get logged');
	// 			});
	// 			// prevent console output from failing the test
	// 			this.stub(console, 'log');
	// 			// allow for the promise to finish
	// 			this.clock.tick(MainErrorTelemetry.ERROR_FLUSH_TIMEOUT);
	//
	// 			assert.strictEqual(testAppender.getEventsCount(), 1);
	// 			assert.strictEqual(testAppender.events[0].eventName, 'UnhandledError');
	// 			assert.strictEqual(testAppender.events[0].data.msg,  'This should get logged');
	//
	// 			service.dispose();
	// 		} finally {
	// 			Errors.setUnexpectedErrorHandler(origErrorHandler);
	// 		}
	// 	}));

	test('Handle global errors', sinonTestFn(function (this: any) {
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;

		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender] });
		const errorTelemetry = new ErrorTelemetry(service);

		const testError = new Error('test');
		(mainWindow.onerror)('Error Message', 'file.js', 2, 42, testError);
		this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

		assert.strictEqual(errorStub.alwaysCalledWithExactly('Error Message', 'file.js', 2, 42, testError), true);
		assert.strictEqual(errorStub.callCount, 1);

		assert.strictEqual(testAppender.getEventsCount(), 1);
		assert.strictEqual(testAppender.events[0].eventName, 'UnhandledError');
		assert.strictEqual(testAppender.events[0].data.msg, 'Error Message');
		assert.strictEqual(testAppender.events[0].data.file, 'file.js');
		assert.strictEqual(testAppender.events[0].data.line, 2);
		assert.strictEqual(testAppender.events[0].data.column, 42);
		assert.strictEqual(testAppender.events[0].data.uncaught_error_msg, 'test');

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	test('Error Telemetry removes PII from filename with spaces', sinonTestFn(function (this: any) {
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;
		const settings = new ErrorTestingSettings();
		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender] });
		const errorTelemetry = new ErrorTelemetry(service);

		const personInfoWithSpaces = settings.personalInfo.slice(0, 2) + ' ' + settings.personalInfo.slice(2);
		const dangerousFilenameError: any = new Error('dangerousFilename');
		dangerousFilenameError.stack = settings.stack;
		mainWindow.onerror('dangerousFilename', settings.dangerousPathWithImportantInfo.replace(settings.personalInfo, personInfoWithSpaces) + '/test.js', 2, 42, dangerousFilenameError);
		this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

		assert.strictEqual(errorStub.callCount, 1);
		assert.strictEqual(testAppender.events[0].data.file.indexOf(settings.dangerousPathWithImportantInfo.replace(settings.personalInfo, personInfoWithSpaces)), -1);
		assert.strictEqual(testAppender.events[0].data.file, settings.importantInfo + '/test.js');

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	test('Uncaught Error Telemetry removes PII from filename', sinonTestFn(function (this: any) {
		const clock = this.clock;
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;
		const settings = new ErrorTestingSettings();
		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender] });
		const errorTelemetry = new ErrorTelemetry(service);

		let dangerousFilenameError: any = new Error('dangerousFilename');
		dangerousFilenameError.stack = settings.stack;
		mainWindow.onerror('dangerousFilename', settings.dangerousPathWithImportantInfo + '/test.js', 2, 42, dangerousFilenameError);
		clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);
		assert.strictEqual(errorStub.callCount, 1);
		assert.strictEqual(testAppender.events[0].data.file.indexOf(settings.dangerousPathWithImportantInfo), -1);

		dangerousFilenameError = new Error('dangerousFilename');
		dangerousFilenameError.stack = settings.stack;
		mainWindow.onerror('dangerousFilename', settings.dangerousPathWithImportantInfo + '/test.js', 2, 42, dangerousFilenameError);
		clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);
		assert.strictEqual(errorStub.callCount, 2);
		assert.strictEqual(testAppender.events[0].data.file.indexOf(settings.dangerousPathWithImportantInfo), -1);
		assert.strictEqual(testAppender.events[0].data.file, settings.importantInfo + '/test.js');

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	test('Unexpected Error Telemetry removes PII', sinonTestFn(function (this: any) {
		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });
		try {
			const settings = new ErrorTestingSettings();
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);

			const dangerousPathWithoutImportantInfoError: any = new Error(settings.dangerousPathWithoutImportantInfo);
			dangerousPathWithoutImportantInfoError.stack = settings.stack;
			Errors.onUnexpectedError(dangerousPathWithoutImportantInfoError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);

			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

			errorTelemetry.dispose();
			service.dispose();
		}
		finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Uncaught Error Telemetry removes PII', sinonTestFn(function (this: any) {
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;
		const settings = new ErrorTestingSettings();
		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender] });
		const errorTelemetry = new ErrorTelemetry(service);

		const dangerousPathWithoutImportantInfoError: any = new Error('dangerousPathWithoutImportantInfo');
		dangerousPathWithoutImportantInfoError.stack = settings.stack;
		mainWindow.onerror(settings.dangerousPathWithoutImportantInfo, 'test.js', 2, 42, dangerousPathWithoutImportantInfoError);
		this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

		assert.strictEqual(errorStub.callCount, 1);
		// Test that no file information remains, esp. personal info
		assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
		assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	test('Unexpected Error Telemetry removes PII but preserves Code file path', sinonTestFn(function (this: any) {

		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const settings = new ErrorTestingSettings();
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);

			const dangerousPathWithImportantInfoError: any = new Error(settings.dangerousPathWithImportantInfo);
			dangerousPathWithImportantInfoError.stack = settings.stack;

			// Test that important information remains but personal info does not
			Errors.onUnexpectedError(dangerousPathWithImportantInfoError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.notStrictEqual(testAppender.events[0].data.msg.indexOf(settings.importantInfo), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.importantInfo), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

			errorTelemetry.dispose();
			service.dispose();
		}
		finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Uncaught Error Telemetry removes PII but preserves Code file path', sinonTestFn(function (this: any) {
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;
		const settings = new ErrorTestingSettings();
		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender] });
		const errorTelemetry = new ErrorTelemetry(service);

		const dangerousPathWithImportantInfoError: any = new Error('dangerousPathWithImportantInfo');
		dangerousPathWithImportantInfoError.stack = settings.stack;
		mainWindow.onerror(settings.dangerousPathWithImportantInfo, 'test.js', 2, 42, dangerousPathWithImportantInfoError);
		this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

		assert.strictEqual(errorStub.callCount, 1);
		// Test that important information remains but personal info does not
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('(' + settings.nodeModuleAsarPathToRetain), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('(' + settings.nodeModulePathToRetain), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('(/' + settings.nodeModuleAsarPathToRetain), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('(/' + settings.nodeModulePathToRetain), -1);
		assert.notStrictEqual(testAppender.events[0].data.msg.indexOf(settings.importantInfo), -1);
		assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
		assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.importantInfo), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	test('Unexpected Error Telemetry removes PII but preserves Code file path with node modules', sinonTestFn(function (this: any) {

		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const settings = new ErrorTestingSettings();
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);

			const dangerousPathWithImportantInfoError: any = new Error(settings.dangerousPathWithImportantInfo);
			dangerousPathWithImportantInfoError.stack = settings.stack;


			Errors.onUnexpectedError(dangerousPathWithImportantInfoError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('(' + settings.nodeModuleAsarPathToRetain), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('(' + settings.nodeModulePathToRetain), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('(/' + settings.nodeModuleAsarPathToRetain), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('(/' + settings.nodeModulePathToRetain), -1);

			errorTelemetry.dispose();
			service.dispose();
		}
		finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Unexpected Error Telemetry removes PII but preserves Code file path when PIIPath is configured', sinonTestFn(function (this: any) {

		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const settings = new ErrorTestingSettings();
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender], piiPaths: [settings.personalInfo + '/resources/app/'] });
			const errorTelemetry = new ErrorTelemetry(service);

			const dangerousPathWithImportantInfoError: any = new Error(settings.dangerousPathWithImportantInfo);
			dangerousPathWithImportantInfoError.stack = settings.stack;

			// Test that important information remains but personal info does not
			Errors.onUnexpectedError(dangerousPathWithImportantInfoError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.notStrictEqual(testAppender.events[0].data.msg.indexOf(settings.importantInfo), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.importantInfo), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

			errorTelemetry.dispose();
			service.dispose();
		}
		finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Uncaught Error Telemetry removes PII but preserves Code file path when PIIPath is configured', sinonTestFn(function (this: any) {
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;
		const settings = new ErrorTestingSettings();
		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender], piiPaths: [settings.personalInfo + '/resources/app/'] });
		const errorTelemetry = new ErrorTelemetry(service);

		const dangerousPathWithImportantInfoError: any = new Error('dangerousPathWithImportantInfo');
		dangerousPathWithImportantInfoError.stack = settings.stack;
		mainWindow.onerror(settings.dangerousPathWithImportantInfo, 'test.js', 2, 42, dangerousPathWithImportantInfoError);
		this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

		assert.strictEqual(errorStub.callCount, 1);
		// Test that important information remains but personal info does not
		assert.notStrictEqual(testAppender.events[0].data.msg.indexOf(settings.importantInfo), -1);
		assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
		assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.importantInfo), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	test('Unexpected Error Telemetry removes PII but preserves Missing Model error message', sinonTestFn(function (this: any) {

		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const settings = new ErrorTestingSettings();
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);

			const missingModelError: any = new Error(settings.missingModelMessage);
			missingModelError.stack = settings.stack;

			// Test that no file information remains, but this particular
			// error message does (Received model events for missing model)
			Errors.onUnexpectedError(missingModelError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.notStrictEqual(testAppender.events[0].data.msg.indexOf(settings.missingModelPrefix), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.missingModelPrefix), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

			errorTelemetry.dispose();
			service.dispose();
		} finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Uncaught Error Telemetry removes PII but preserves Missing Model error message', sinonTestFn(function (this: any) {
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;
		const settings = new ErrorTestingSettings();
		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender] });
		const errorTelemetry = new ErrorTelemetry(service);

		const missingModelError: any = new Error('missingModelMessage');
		missingModelError.stack = settings.stack;
		mainWindow.onerror(settings.missingModelMessage, 'test.js', 2, 42, missingModelError);
		this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

		assert.strictEqual(errorStub.callCount, 1);
		// Test that no file information remains, but this particular
		// error message does (Received model events for missing model)
		assert.notStrictEqual(testAppender.events[0].data.msg.indexOf(settings.missingModelPrefix), -1);
		assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
		assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.missingModelPrefix), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	test('Unexpected Error Telemetry removes PII but preserves No Such File error message', sinonTestFn(function (this: any) {

		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const settings = new ErrorTestingSettings();
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);

			const noSuchFileError: any = new Error(settings.noSuchFileMessage);
			noSuchFileError.stack = settings.stack;

			// Test that no file information remains, but this particular
			// error message does (ENOENT: no such file or directory)
			Errors.onUnexpectedError(noSuchFileError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.notStrictEqual(testAppender.events[0].data.msg.indexOf(settings.noSuchFilePrefix), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.noSuchFilePrefix), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

			errorTelemetry.dispose();
			service.dispose();
		} finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Uncaught Error Telemetry removes PII but preserves No Such File error message', sinonTestFn(function (this: any) {
		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const errorStub = sinon.stub();
			mainWindow.onerror = errorStub;
			const settings = new ErrorTestingSettings();
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);

			const noSuchFileError: any = new Error('noSuchFileMessage');
			noSuchFileError.stack = settings.stack;
			mainWindow.onerror(settings.noSuchFileMessage, 'test.js', 2, 42, noSuchFileError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.strictEqual(errorStub.callCount, 1);
			// Test that no file information remains, but this particular
			// error message does (ENOENT: no such file or directory)
			Errors.onUnexpectedError(noSuchFileError);
			assert.notStrictEqual(testAppender.events[0].data.msg.indexOf(settings.noSuchFilePrefix), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.noSuchFilePrefix), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.personalInfo), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf(settings.filePrefix), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(settings.stack[4].replace(settings.randomUserFile, settings.anonymizedRandomUserFile)), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.split('\n').length, settings.stack.length);

			errorTelemetry.dispose();
			service.dispose();
			sinon.restore();
		} finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Telemetry Service sends events when telemetry is on', sinonTestFn(function () {
		const testAppender = new TestTelemetryAppender();
		const service = new TelemetryService({ appenders: [testAppender] }, new TestConfigurationService(), TestProductService);
		service.publicLog('testEvent');
		assert.strictEqual(testAppender.getEventsCount(), 1);
		service.dispose();
	}));

	test('Telemetry Service checks with config service', function () {

		let telemetryLevel = TelemetryConfiguration.OFF;
		const emitter = new Emitter<any>();

		const testAppender = new TestTelemetryAppender();
		const service = new TelemetryService({
			appenders: [testAppender]
		}, new class extends TestConfigurationService {
			override onDidChangeConfiguration = emitter.event;
			override getValue<T>(): T {
				return telemetryLevel as T;
			}
		}(), TestProductService);

		assert.strictEqual(service.telemetryLevel, TelemetryLevel.NONE);

		telemetryLevel = TelemetryConfiguration.ON;
		emitter.fire({ affectsConfiguration: () => true });
		assert.strictEqual(service.telemetryLevel, TelemetryLevel.USAGE);

		telemetryLevel = TelemetryConfiguration.ERROR;
		emitter.fire({ affectsConfiguration: () => true });
		assert.strictEqual(service.telemetryLevel, TelemetryLevel.ERROR);

		service.dispose();
	});

	test('Unexpected Error Telemetry removes Windows PII but preserves code path', sinonTestFn(function (this: any) {
		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);

			const windowsUserPath = 'c:/Users/bpasero/AppData/Local/Programs/Microsoft%20VS%20Code%20Insiders/resources/app/';
			const codePath = 'out/vs/workbench/workbench.desktop.main.js';
			const stack = [
				`    at cTe.gc (vscode-file://vscode-app/${windowsUserPath}${codePath}:2724:81492)`,
				`    at async cTe.setInput (vscode-file://vscode-app/${windowsUserPath}${codePath}:2724:80650)`,
				`    at async qJe.S (vscode-file://vscode-app/${windowsUserPath}${codePath}:698:58520)`,
				`    at async qJe.L (vscode-file://vscode-app/${windowsUserPath}${codePath}:698:57080)`,
				`    at async qJe.openEditor (vscode-file://vscode-app/${windowsUserPath}${codePath}:698:56162)`
			];

			const windowsError: any = new Error('The editor could not be opened because the file was not found.');
			windowsError.stack = stack.join('\n');

			Errors.onUnexpectedError(windowsError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.strictEqual(testAppender.getEventsCount(), 1);
			// Verify PII (username and path) is removed
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf('bpasero'), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf('Users'), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf('c:/Users'), -1);
			// Verify important code path is preserved
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(codePath), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('out/vs/workbench'), -1);

			errorTelemetry.dispose();
			service.dispose();
		} finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Uncaught Error Telemetry removes Windows PII but preserves code path', sinonTestFn(function (this: any) {
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;

		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender] });
		const errorTelemetry = new ErrorTelemetry(service);

		const windowsUserPath = 'c:/Users/bpasero/AppData/Local/Programs/Microsoft%20VS%20Code%20Insiders/resources/app/';
		const codePath = 'out/vs/workbench/workbench.desktop.main.js';
		const stack = [
			`    at cTe.gc (vscode-file://vscode-app/${windowsUserPath}${codePath}:2724:81492)`,
			`    at async cTe.setInput (vscode-file://vscode-app/${windowsUserPath}${codePath}:2724:80650)`,
			`    at async qJe.S (vscode-file://vscode-app/${windowsUserPath}${codePath}:698:58520)`
		];

		const windowsError: any = new Error('The editor could not be opened because the file was not found.');
		windowsError.stack = stack.join('\n');

		mainWindow.onerror('The editor could not be opened because the file was not found.', 'test.js', 2, 42, windowsError);
		this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

		assert.strictEqual(errorStub.callCount, 1);
		// Verify PII (username and path) is removed
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf('bpasero'), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf('Users'), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf('c:/Users'), -1);
		// Verify important code path is preserved
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(codePath), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('out/vs/workbench'), -1);

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	test('Unexpected Error Telemetry removes macOS PII but preserves code path', sinonTestFn(function (this: any) {
		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);

			const macUserPath = 'Applications/Visual%20Studio%20Code%20-%20Insiders.app/Contents/Resources/app/';
			const codePath = 'out/vs/workbench/workbench.desktop.main.js';
			const stack = [
				`    at uTe.gc (vscode-file://vscode-app/${macUserPath}${codePath}:2720:81492)`,
				`    at async uTe.setInput (vscode-file://vscode-app/${macUserPath}${codePath}:2720:80650)`,
				`    at async JJe.S (vscode-file://vscode-app/${macUserPath}${codePath}:698:58520)`,
				`    at async JJe.L (vscode-file://vscode-app/${macUserPath}${codePath}:698:57080)`,
				`    at async JJe.openEditor (vscode-file://vscode-app/${macUserPath}${codePath}:698:56162)`
			];

			const macError: any = new Error('The editor could not be opened because the file was not found.');
			macError.stack = stack.join('\n');

			Errors.onUnexpectedError(macError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.strictEqual(testAppender.getEventsCount(), 1);
			// Verify PII (application path) is removed
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf('Applications/Visual'), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf('Visual%20Studio%20Code'), -1);
			// Verify important code path is preserved
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(codePath), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('out/vs/workbench'), -1);

			errorTelemetry.dispose();
			service.dispose();
		} finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Uncaught Error Telemetry removes macOS PII but preserves code path', sinonTestFn(function (this: any) {
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;

		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender] });
		const errorTelemetry = new ErrorTelemetry(service);

		const macUserPath = 'Applications/Visual%20Studio%20Code%20-%20Insiders.app/Contents/Resources/app/';
		const codePath = 'out/vs/workbench/workbench.desktop.main.js';
		const stack = [
			`    at uTe.gc (vscode-file://vscode-app/${macUserPath}${codePath}:2720:81492)`,
			`    at async uTe.setInput (vscode-file://vscode-app/${macUserPath}${codePath}:2720:80650)`,
			`    at async JJe.S (vscode-file://vscode-app/${macUserPath}${codePath}:698:58520)`
		];

		const macError: any = new Error('The editor could not be opened because the file was not found.');
		macError.stack = stack.join('\n');

		mainWindow.onerror('The editor could not be opened because the file was not found.', 'test.js', 2, 42, macError);
		this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

		assert.strictEqual(errorStub.callCount, 1);
		// Verify PII (application path) is removed
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf('Applications/Visual'), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf('Visual%20Studio%20Code'), -1);
		// Verify important code path is preserved
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(codePath), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('out/vs/workbench'), -1);

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	test('Unexpected Error Telemetry removes Linux PII but preserves code path', sinonTestFn(function (this: any) {
		const origErrorHandler = Errors.errorHandler.getUnexpectedErrorHandler();
		Errors.setUnexpectedErrorHandler(() => { });

		try {
			const testAppender = new TestTelemetryAppender();
			const service = new TestErrorTelemetryService({ appenders: [testAppender] });
			const errorTelemetry = new ErrorTelemetry(service);

			const linuxUserPath = '/home/parallels/GitDevelopment/vscode-node-sqlite3-perf/';
			const linuxSystemPath = 'usr/share/code-insiders/resources/app/';
			const codePath = 'out/vs/workbench/workbench.desktop.main.js';
			const stack = [
				`    at _kt.G (vscode-file://vscode-app/${linuxSystemPath}${codePath}:3825:65940)`,
				`    at _kt.F (vscode-file://vscode-app/${linuxSystemPath}${codePath}:3825:65765)`,
				`    at async axt.L (vscode-file://vscode-app/${linuxSystemPath}${codePath}:3830:9998)`,
				`    at async axt.readStream (vscode-file://vscode-app/${linuxSystemPath}${codePath}:3830:9773)`,
				`    at async mye.Eb (vscode-file://vscode-app/${linuxSystemPath}${codePath}:1313:12359)`
			];

			const linuxError: any = new Error(`Invalid fake file 'git:${linuxUserPath}index.js.git?{"path":"${linuxUserPath}index.js","ref":""}' (Canceled: Canceled)`);
			linuxError.stack = stack.join('\n');

			Errors.onUnexpectedError(linuxError);
			this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

			assert.strictEqual(testAppender.getEventsCount(), 1);
			// Verify PII (username and home directory) is removed
			assert.strictEqual(testAppender.events[0].data.msg.indexOf('parallels'), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf('/home/parallels'), -1);
			assert.strictEqual(testAppender.events[0].data.msg.indexOf('GitDevelopment'), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf('parallels'), -1);
			assert.strictEqual(testAppender.events[0].data.callstack.indexOf('/home/parallels'), -1);
			// Verify important code path is preserved
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(codePath), -1);
			assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('out/vs/workbench'), -1);

			errorTelemetry.dispose();
			service.dispose();
		} finally {
			Errors.setUnexpectedErrorHandler(origErrorHandler);
		}
	}));

	test('Uncaught Error Telemetry removes Linux PII but preserves code path', sinonTestFn(function (this: any) {
		const errorStub = sinon.stub();
		mainWindow.onerror = errorStub;

		const testAppender = new TestTelemetryAppender();
		const service = new TestErrorTelemetryService({ appenders: [testAppender] });
		const errorTelemetry = new ErrorTelemetry(service);

		const linuxUserPath = '/home/parallels/GitDevelopment/vscode-node-sqlite3-perf/';
		const linuxSystemPath = 'usr/share/code-insiders/resources/app/';
		const codePath = 'out/vs/workbench/workbench.desktop.main.js';
		const stack = [
			`    at _kt.G (vscode-file://vscode-app/${linuxSystemPath}${codePath}:3825:65940)`,
			`    at _kt.F (vscode-file://vscode-app/${linuxSystemPath}${codePath}:3825:65765)`,
			`    at async axt.L (vscode-file://vscode-app/${linuxSystemPath}${codePath}:3830:9998)`
		];

		const linuxError: any = new Error(`Unable to read file 'git:${linuxUserPath}index.js.git'`);
		linuxError.stack = stack.join('\n');

		mainWindow.onerror(`Unable to read file 'git:${linuxUserPath}index.js.git'`, 'test.js', 2, 42, linuxError);
		this.clock.tick(ErrorTelemetry.ERROR_FLUSH_TIMEOUT);

		assert.strictEqual(errorStub.callCount, 1);
		// Verify PII (username and home directory) is removed
		assert.strictEqual(testAppender.events[0].data.msg.indexOf('parallels'), -1);
		assert.strictEqual(testAppender.events[0].data.msg.indexOf('/home/parallels'), -1);
		assert.strictEqual(testAppender.events[0].data.msg.indexOf('GitDevelopment'), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf('parallels'), -1);
		assert.strictEqual(testAppender.events[0].data.callstack.indexOf('/home/parallels'), -1);
		// Verify important code path is preserved
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf(codePath), -1);
		assert.notStrictEqual(testAppender.events[0].data.callstack.indexOf('out/vs/workbench'), -1);

		errorTelemetry.dispose();
		service.dispose();
		sinon.restore();
	}));

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/test/common/telemetryLogAppender.test.ts]---
Location: vscode-main/src/vs/platform/telemetry/test/common/telemetryLogAppender.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Event } from '../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { TestInstantiationService } from '../../../instantiation/test/common/instantiationServiceMock.js';
import { AbstractLogger, DEFAULT_LOG_LEVEL, ILogger, ILoggerService, LogLevel } from '../../../log/common/log.js';
import { IProductService } from '../../../product/common/productService.js';
import { TelemetryLogAppender } from '../../common/telemetryLogAppender.js';

class TestTelemetryLogger extends AbstractLogger implements ILogger {

	public logs: string[] = [];

	constructor(logLevel: LogLevel = DEFAULT_LOG_LEVEL) {
		super();
		this.setLevel(logLevel);
	}

	trace(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Trace)) {
			this.logs.push(message + JSON.stringify(args));
		}
	}

	debug(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Debug)) {
			this.logs.push(message);
		}
	}

	info(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Info)) {
			this.logs.push(message);
		}
	}

	warn(message: string | Error, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Warning)) {
			this.logs.push(message.toString());
		}
	}

	error(message: string, ...args: unknown[]): void {
		if (this.canLog(LogLevel.Error)) {
			this.logs.push(message);
		}
	}
	flush(): void { }
}

export class TestTelemetryLoggerService implements ILoggerService {
	_serviceBrand: undefined;

	logger?: TestTelemetryLogger;

	constructor(private readonly logLevel: LogLevel) { }

	getLogger() {
		return this.logger;
	}

	createLogger() {
		if (!this.logger) {
			this.logger = new TestTelemetryLogger(this.logLevel);
		}

		return this.logger;
	}

	onDidChangeVisibility = Event.None;
	onDidChangeLogLevel = Event.None;
	onDidChangeLoggers = Event.None;
	setLogLevel(): void { }
	getLogLevel() { return LogLevel.Info; }
	setVisibility(): void { }
	getDefaultLogLevel() { return this.logLevel; }
	registerLogger() { }
	deregisterLogger(): void { }
	getRegisteredLoggers() { return []; }
	getRegisteredLogger() { return undefined; }
}

suite('TelemetryLogAdapter', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Do not Log Telemetry if log level is not trace', async () => {
		const testLoggerService = new TestTelemetryLoggerService(DEFAULT_LOG_LEVEL);
		const testInstantiationService = new TestInstantiationService();
		const testObject = new TelemetryLogAppender('', false, testLoggerService, testInstantiationService.stub(IEnvironmentService, {}), testInstantiationService.stub(IProductService, {}));
		testObject.log('testEvent', { hello: 'world', isTrue: true, numberBetween1And3: 2 });
		assert.strictEqual(testLoggerService.createLogger().logs.length, 0);
		testObject.dispose();
		testInstantiationService.dispose();
	});

	test('Log Telemetry if log level is trace', async () => {
		const testLoggerService = new TestTelemetryLoggerService(LogLevel.Trace);
		const testInstantiationService = new TestInstantiationService();
		const testObject = new TelemetryLogAppender('', false, testLoggerService, testInstantiationService.stub(IEnvironmentService, {}), testInstantiationService.stub(IProductService, {}));
		testObject.log('testEvent', { hello: 'world', isTrue: true, numberBetween1And3: 2 });
		assert.strictEqual(testLoggerService.createLogger().logs[0], 'telemetry/testEvent' + JSON.stringify([{
			properties: {
				hello: 'world',
			},
			measurements: {
				isTrue: 1, numberBetween1And3: 2
			}
		}]));
		testObject.dispose();
		testInstantiationService.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/environmentVariable.ts]---
Location: vscode-main/src/vs/platform/terminal/common/environmentVariable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IProcessEnvironment } from '../../../base/common/platform.js';
import { IWorkspaceFolderData } from '../../workspace/common/workspace.js';

export enum EnvironmentVariableMutatorType {
	Replace = 1,
	Append = 2,
	Prepend = 3
}
export interface IEnvironmentVariableMutator {
	readonly variable: string;
	readonly value: string;
	readonly type: EnvironmentVariableMutatorType;
	readonly scope?: EnvironmentVariableScope;
	readonly options?: IEnvironmentVariableMutatorOptions;
}

export interface IEnvironmentVariableCollectionDescription {
	readonly description: string | undefined;
	readonly scope?: EnvironmentVariableScope;
}

export interface IEnvironmentVariableMutatorOptions {
	applyAtProcessCreation?: boolean;
	applyAtShellIntegration?: boolean;
}

export type EnvironmentVariableScope = {
	workspaceFolder?: IWorkspaceFolderData;
};

export interface IEnvironmentVariableCollection {
	readonly map: ReadonlyMap<string, IEnvironmentVariableMutator>;
	readonly descriptionMap?: ReadonlyMap<string, IEnvironmentVariableCollectionDescription>;
}

/** [variable, mutator] */
export type ISerializableEnvironmentVariableCollection = [string, IEnvironmentVariableMutator][];

export type ISerializableEnvironmentDescriptionMap = [string, IEnvironmentVariableCollectionDescription][];
export interface IExtensionOwnedEnvironmentDescriptionMutator extends IEnvironmentVariableCollectionDescription {
	readonly extensionIdentifier: string;
}

/** [extension, collection, description] */
export type ISerializableEnvironmentVariableCollections = [string, ISerializableEnvironmentVariableCollection, ISerializableEnvironmentDescriptionMap][];

export interface IExtensionOwnedEnvironmentVariableMutator extends IEnvironmentVariableMutator {
	readonly extensionIdentifier: string;
}

export interface IMergedEnvironmentVariableCollectionDiff {
	added: ReadonlyMap<string, IExtensionOwnedEnvironmentVariableMutator[]>;
	changed: ReadonlyMap<string, IExtensionOwnedEnvironmentVariableMutator[]>;
	removed: ReadonlyMap<string, IExtensionOwnedEnvironmentVariableMutator[]>;
}

type VariableResolver = (str: string) => Promise<string>;

/**
 * Represents an environment variable collection that results from merging several collections
 * together.
 */
export interface IMergedEnvironmentVariableCollection {
	readonly collections: ReadonlyMap<string, IEnvironmentVariableCollection>;
	/**
	 * Gets the variable map for a given scope.
	 * @param scope The scope to get the variable map for. If undefined, the global scope is used.
	 */
	getVariableMap(scope: EnvironmentVariableScope | undefined): Map<string, IExtensionOwnedEnvironmentVariableMutator[]>;
	/**
	 * Gets the description map for a given scope.
	 * @param scope The scope to get the description map for. If undefined, description map for the
	 * global scope is returned.
	 */
	getDescriptionMap(scope: EnvironmentVariableScope | undefined): Map<string, string | undefined>;
	/**
	 * Applies this collection to a process environment.
	 * @param variableResolver An optional function to use to resolve variables within the
	 * environment values.
	 */
	applyToProcessEnvironment(env: IProcessEnvironment, scope: EnvironmentVariableScope | undefined, variableResolver?: VariableResolver): Promise<void>;

	/**
	 * Generates a diff of this collection against another. Returns undefined if the collections are
	 * the same.
	 */
	diff(other: IMergedEnvironmentVariableCollection, scope: EnvironmentVariableScope | undefined): IMergedEnvironmentVariableCollectionDiff | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/environmentVariableCollection.ts]---
Location: vscode-main/src/vs/platform/terminal/common/environmentVariableCollection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IProcessEnvironment, isWindows } from '../../../base/common/platform.js';
import { EnvironmentVariableMutatorType, EnvironmentVariableScope, IEnvironmentVariableCollection, IExtensionOwnedEnvironmentDescriptionMutator, IExtensionOwnedEnvironmentVariableMutator, IMergedEnvironmentVariableCollection, IMergedEnvironmentVariableCollectionDiff } from './environmentVariable.js';

type VariableResolver = (str: string) => Promise<string>;

const mutatorTypeToLabelMap: Map<EnvironmentVariableMutatorType, string> = new Map([
	[EnvironmentVariableMutatorType.Append, 'APPEND'],
	[EnvironmentVariableMutatorType.Prepend, 'PREPEND'],
	[EnvironmentVariableMutatorType.Replace, 'REPLACE']
]);
const PYTHON_ACTIVATION_VARS_PATTERN = /^VSCODE_PYTHON_(PWSH|ZSH|BASH|FISH)_ACTIVATE/;
const PYTHON_ENV_EXTENSION_ID = 'ms-python.vscode-python-envs';

export class MergedEnvironmentVariableCollection implements IMergedEnvironmentVariableCollection {
	private readonly map: Map<string, IExtensionOwnedEnvironmentVariableMutator[]> = new Map();
	private readonly descriptionMap: Map<string, IExtensionOwnedEnvironmentDescriptionMutator[]> = new Map();

	constructor(
		readonly collections: ReadonlyMap<string, IEnvironmentVariableCollection>,
	) {
		collections.forEach((collection, extensionIdentifier) => {
			this.populateDescriptionMap(collection, extensionIdentifier);
			const it = collection.map.entries();
			let next = it.next();
			while (!next.done) {
				const mutator = next.value[1];
				const key = next.value[0];

				if (this.blockPythonActivationVar(key, extensionIdentifier)) {
					next = it.next();
					continue;
				}

				let entry = this.map.get(key);
				if (!entry) {
					entry = [];
					this.map.set(key, entry);
				}

				// If the first item in the entry is replace ignore any other entries as they would
				// just get replaced by this one.
				if (entry.length > 0 && entry[0].type === EnvironmentVariableMutatorType.Replace) {
					next = it.next();
					continue;
				}

				const extensionMutator = {
					extensionIdentifier,
					value: mutator.value,
					type: mutator.type,
					scope: mutator.scope,
					variable: mutator.variable,
					options: mutator.options
				};
				if (!extensionMutator.scope) {
					delete extensionMutator.scope; // Convenient for tests
				}
				// Mutators get applied in the reverse order than they are created
				entry.unshift(extensionMutator);

				next = it.next();
			}
		});
	}

	async applyToProcessEnvironment(env: IProcessEnvironment, scope: EnvironmentVariableScope | undefined, variableResolver?: VariableResolver): Promise<void> {
		let lowerToActualVariableNames: { [lowerKey: string]: string | undefined } | undefined;
		if (isWindows) {
			lowerToActualVariableNames = {};
			Object.keys(env).forEach(e => lowerToActualVariableNames![e.toLowerCase()] = e);
		}
		for (const [variable, mutators] of this.getVariableMap(scope)) {
			const actualVariable = isWindows ? lowerToActualVariableNames![variable.toLowerCase()] || variable : variable;
			for (const mutator of mutators) {
				const value = variableResolver ? await variableResolver(mutator.value) : mutator.value;

				if (this.blockPythonActivationVar(mutator.variable, mutator.extensionIdentifier)) {
					continue;
				}

				// Default: true
				if (mutator.options?.applyAtProcessCreation ?? true) {
					switch (mutator.type) {
						case EnvironmentVariableMutatorType.Append:
							env[actualVariable] = (env[actualVariable] || '') + value;
							break;
						case EnvironmentVariableMutatorType.Prepend:
							env[actualVariable] = value + (env[actualVariable] || '');
							break;
						case EnvironmentVariableMutatorType.Replace:
							env[actualVariable] = value;
							break;
					}
				}
				// Default: false
				if (mutator.options?.applyAtShellIntegration ?? false) {
					const key = `VSCODE_ENV_${mutatorTypeToLabelMap.get(mutator.type)!}`;
					env[key] = (env[key] ? env[key] + ':' : '') + variable + '=' + this._encodeColons(value);
				}
			}
		}
	}

	private _encodeColons(value: string): string {
		return value.replaceAll(':', '\\x3a');
	}

	private blockPythonActivationVar(variable: string, extensionIdentifier: string): boolean {
		// Only Python env extension can modify Python activate env var.
		if (PYTHON_ACTIVATION_VARS_PATTERN.test(variable) && PYTHON_ENV_EXTENSION_ID !== extensionIdentifier) {
			return true;
		}
		return false;
	}

	diff(other: IMergedEnvironmentVariableCollection, scope: EnvironmentVariableScope | undefined): IMergedEnvironmentVariableCollectionDiff | undefined {
		const added: Map<string, IExtensionOwnedEnvironmentVariableMutator[]> = new Map();
		const changed: Map<string, IExtensionOwnedEnvironmentVariableMutator[]> = new Map();
		const removed: Map<string, IExtensionOwnedEnvironmentVariableMutator[]> = new Map();

		// Find added
		other.getVariableMap(scope).forEach((otherMutators, variable) => {
			const currentMutators = this.getVariableMap(scope).get(variable);
			const result = getMissingMutatorsFromArray(otherMutators, currentMutators);
			if (result) {
				added.set(variable, result);
			}
		});

		// Find removed
		this.getVariableMap(scope).forEach((currentMutators, variable) => {
			const otherMutators = other.getVariableMap(scope).get(variable);
			const result = getMissingMutatorsFromArray(currentMutators, otherMutators);
			if (result) {
				removed.set(variable, result);
			}
		});

		// Find changed
		this.getVariableMap(scope).forEach((currentMutators, variable) => {
			const otherMutators = other.getVariableMap(scope).get(variable);
			const result = getChangedMutatorsFromArray(currentMutators, otherMutators);
			if (result) {
				changed.set(variable, result);
			}
		});

		if (added.size === 0 && changed.size === 0 && removed.size === 0) {
			return undefined;
		}

		return { added, changed, removed };
	}

	getVariableMap(scope: EnvironmentVariableScope | undefined): Map<string, IExtensionOwnedEnvironmentVariableMutator[]> {
		const result = new Map<string, IExtensionOwnedEnvironmentVariableMutator[]>();
		for (const mutators of this.map.values()) {
			const filteredMutators = mutators.filter(m => filterScope(m, scope));
			if (filteredMutators.length > 0) {
				// All of these mutators are for the same variable because they are in the same scope, hence choose anyone to form a key.
				result.set(filteredMutators[0].variable, filteredMutators);
			}
		}
		return result;
	}

	getDescriptionMap(scope: EnvironmentVariableScope | undefined): Map<string, string | undefined> {
		const result = new Map<string, string | undefined>();
		for (const mutators of this.descriptionMap.values()) {
			const filteredMutators = mutators.filter(m => filterScope(m, scope, true));
			for (const mutator of filteredMutators) {
				result.set(mutator.extensionIdentifier, mutator.description);
			}
		}
		return result;
	}

	private populateDescriptionMap(collection: IEnvironmentVariableCollection, extensionIdentifier: string): void {
		if (!collection.descriptionMap) {
			return;
		}
		const it = collection.descriptionMap.entries();
		let next = it.next();
		while (!next.done) {
			const mutator = next.value[1];
			const key = next.value[0];
			let entry = this.descriptionMap.get(key);
			if (!entry) {
				entry = [];
				this.descriptionMap.set(key, entry);
			}
			const extensionMutator = {
				extensionIdentifier,
				scope: mutator.scope,
				description: mutator.description
			};
			if (!extensionMutator.scope) {
				delete extensionMutator.scope; // Convenient for tests
			}
			entry.push(extensionMutator);

			next = it.next();
		}

	}
}

/**
 * Returns whether a mutator matches with the scope provided.
 * @param mutator Mutator to filter
 * @param scope Scope to be used for querying
 * @param strictFilter If true, mutators with global scope is not returned when querying for workspace scope.
 * i.e whether mutator scope should always exactly match with query scope.
 */
function filterScope(
	mutator: IExtensionOwnedEnvironmentVariableMutator | IExtensionOwnedEnvironmentDescriptionMutator,
	scope: EnvironmentVariableScope | undefined,
	strictFilter = false
): boolean {
	if (!mutator.scope) {
		if (strictFilter) {
			return scope === mutator.scope;
		}
		return true;
	}
	// If a mutator is scoped to a workspace folder, only apply it if the workspace
	// folder matches.
	if (mutator.scope.workspaceFolder && scope?.workspaceFolder && mutator.scope.workspaceFolder.index === scope.workspaceFolder.index) {
		return true;
	}
	return false;
}

function getMissingMutatorsFromArray(
	current: IExtensionOwnedEnvironmentVariableMutator[],
	other: IExtensionOwnedEnvironmentVariableMutator[] | undefined
): IExtensionOwnedEnvironmentVariableMutator[] | undefined {
	// If it doesn't exist, all are removed
	if (!other) {
		return current;
	}

	// Create a map to help
	const otherMutatorExtensions = new Set<string>();
	other.forEach(m => otherMutatorExtensions.add(m.extensionIdentifier));

	// Find entries removed from other
	const result: IExtensionOwnedEnvironmentVariableMutator[] = [];
	current.forEach(mutator => {
		if (!otherMutatorExtensions.has(mutator.extensionIdentifier)) {
			result.push(mutator);
		}
	});

	return result.length === 0 ? undefined : result;
}

function getChangedMutatorsFromArray(
	current: IExtensionOwnedEnvironmentVariableMutator[],
	other: IExtensionOwnedEnvironmentVariableMutator[] | undefined
): IExtensionOwnedEnvironmentVariableMutator[] | undefined {
	// If it doesn't exist, none are changed (they are removed)
	if (!other) {
		return undefined;
	}

	// Create a map to help
	const otherMutatorExtensions = new Map<string, IExtensionOwnedEnvironmentVariableMutator>();
	other.forEach(m => otherMutatorExtensions.set(m.extensionIdentifier, m));

	// Find entries that exist in both but are not equal
	const result: IExtensionOwnedEnvironmentVariableMutator[] = [];
	current.forEach(mutator => {
		const otherMutator = otherMutatorExtensions.get(mutator.extensionIdentifier);
		if (otherMutator && (mutator.type !== otherMutator.type || mutator.value !== otherMutator.value || mutator.scope?.workspaceFolder?.index !== otherMutator.scope?.workspaceFolder?.index)) {
			// Return the new result, not the old one
			result.push(otherMutator);
		}
	});

	return result.length === 0 ? undefined : result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/environmentVariableShared.ts]---
Location: vscode-main/src/vs/platform/terminal/common/environmentVariableShared.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEnvironmentVariableCollectionDescription, IEnvironmentVariableCollection, IEnvironmentVariableMutator, ISerializableEnvironmentDescriptionMap as ISerializableEnvironmentDescriptionMap, ISerializableEnvironmentVariableCollection, ISerializableEnvironmentVariableCollections } from './environmentVariable.js';

// This file is shared between the renderer and extension host

export function serializeEnvironmentVariableCollection(collection: ReadonlyMap<string, IEnvironmentVariableMutator>): ISerializableEnvironmentVariableCollection {
	return [...collection.entries()];
}

export function serializeEnvironmentDescriptionMap(descriptionMap: ReadonlyMap<string, IEnvironmentVariableCollectionDescription> | undefined): ISerializableEnvironmentDescriptionMap {
	return descriptionMap ? [...descriptionMap.entries()] : [];
}

export function deserializeEnvironmentVariableCollection(
	serializedCollection: ISerializableEnvironmentVariableCollection
): Map<string, IEnvironmentVariableMutator> {
	return new Map<string, IEnvironmentVariableMutator>(serializedCollection);
}

export function deserializeEnvironmentDescriptionMap(
	serializableEnvironmentDescription: ISerializableEnvironmentDescriptionMap | undefined
): Map<string, IEnvironmentVariableCollectionDescription> {
	return new Map<string, IEnvironmentVariableCollectionDescription>(serializableEnvironmentDescription ?? []);
}

export function serializeEnvironmentVariableCollections(collections: ReadonlyMap<string, IEnvironmentVariableCollection>): ISerializableEnvironmentVariableCollections {
	return Array.from(collections.entries()).map(e => {
		return [e[0], serializeEnvironmentVariableCollection(e[1].map), serializeEnvironmentDescriptionMap(e[1].descriptionMap)];
	});
}

export function deserializeEnvironmentVariableCollections(
	serializedCollection: ISerializableEnvironmentVariableCollections
): Map<string, IEnvironmentVariableCollection> {
	return new Map<string, IEnvironmentVariableCollection>(serializedCollection.map(e => {
		return [e[0], { map: deserializeEnvironmentVariableCollection(e[1]), descriptionMap: deserializeEnvironmentDescriptionMap(e[2]) }];
	}));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/requestStore.ts]---
Location: vscode-main/src/vs/platform/terminal/common/requestStore.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../base/common/async.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, dispose, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ILogService } from '../../log/common/log.js';

/**
 * A helper class to track requests that have replies. Using this it's easy to implement an event
 * that accepts a reply.
 */
export class RequestStore<T, RequestArgs> extends Disposable {
	private _lastRequestId = 0;
	private readonly _timeout: number;
	private _pendingRequests: Map<number, (resolved: T) => void> = new Map();
	private _pendingRequestDisposables: Map<number, IDisposable[]> = new Map();

	private readonly _onCreateRequest = this._register(new Emitter<RequestArgs & { requestId: number }>());
	readonly onCreateRequest = this._onCreateRequest.event;

	/**
	 * @param timeout How long in ms to allow requests to go unanswered for, undefined will use the
	 * default (15 seconds).
	 */
	constructor(
		timeout: number | undefined,
		@ILogService private readonly _logService: ILogService
	) {
		super();
		this._timeout = timeout === undefined ? 15000 : timeout;
		this._register(toDisposable(() => {
			for (const d of this._pendingRequestDisposables.values()) {
				dispose(d);
			}
		}));
	}

	/**
	 * Creates a request.
	 * @param args The arguments to pass to the onCreateRequest event.
	 */
	createRequest(args: RequestArgs): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const requestId = ++this._lastRequestId;
			this._pendingRequests.set(requestId, resolve);
			this._onCreateRequest.fire({ requestId, ...args });
			const tokenSource = new CancellationTokenSource();
			timeout(this._timeout, tokenSource.token).then(() => reject(`Request ${requestId} timed out (${this._timeout}ms)`));
			this._pendingRequestDisposables.set(requestId, [toDisposable(() => tokenSource.cancel())]);
		});
	}

	/**
	 * Accept a reply to a request.
	 * @param requestId The request ID originating from the onCreateRequest event.
	 * @param data The reply data.
	 */
	acceptReply(requestId: number, data: T) {
		const resolveRequest = this._pendingRequests.get(requestId);
		if (resolveRequest) {
			this._pendingRequests.delete(requestId);
			dispose(this._pendingRequestDisposables.get(requestId) || []);
			this._pendingRequestDisposables.delete(requestId);
			resolveRequest(data);
		} else {
			this._logService.warn(`RequestStore#acceptReply was called without receiving a matching request ${requestId}`);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/terminal.ts]---
Location: vscode-main/src/vs/platform/terminal/common/terminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IProcessEnvironment, OperatingSystem } from '../../../base/common/platform.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IPtyHostProcessReplayEvent, ISerializedCommandDetectionCapability, ITerminalCapabilityStore, type ITerminalCommand } from './capabilities/capabilities.js';
import { IGetTerminalLayoutInfoArgs, IProcessDetails, ISetTerminalLayoutInfoArgs } from './terminalProcess.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { ISerializableEnvironmentVariableCollections } from './environmentVariable.js';
import { IWorkspaceFolder } from '../../workspace/common/workspace.js';
import { Registry } from '../../registry/common/platform.js';
import type * as performance from '../../../base/common/performance.js';
import { ILogService } from '../../log/common/log.js';
import type { IAction } from '../../../base/common/actions.js';
import type { IDisposable } from '../../../base/common/lifecycle.js';
import type { SingleOrMany } from '../../../base/common/types.js';

export const enum TerminalSettingPrefix {
	AutomationProfile = 'terminal.integrated.automationProfile.',
	DefaultProfile = 'terminal.integrated.defaultProfile.',
	Profiles = 'terminal.integrated.profiles.'
}

export const enum TerminalSettingId {
	SendKeybindingsToShell = 'terminal.integrated.sendKeybindingsToShell',
	AutomationProfileLinux = 'terminal.integrated.automationProfile.linux',
	AutomationProfileMacOs = 'terminal.integrated.automationProfile.osx',
	AutomationProfileWindows = 'terminal.integrated.automationProfile.windows',
	ProfilesWindows = 'terminal.integrated.profiles.windows',
	ProfilesMacOs = 'terminal.integrated.profiles.osx',
	ProfilesLinux = 'terminal.integrated.profiles.linux',
	DefaultProfileLinux = 'terminal.integrated.defaultProfile.linux',
	DefaultProfileMacOs = 'terminal.integrated.defaultProfile.osx',
	DefaultProfileWindows = 'terminal.integrated.defaultProfile.windows',
	UseWslProfiles = 'terminal.integrated.useWslProfiles',
	TabsDefaultColor = 'terminal.integrated.tabs.defaultColor',
	TabsDefaultIcon = 'terminal.integrated.tabs.defaultIcon',
	TabsEnabled = 'terminal.integrated.tabs.enabled',
	TabsEnableAnimation = 'terminal.integrated.tabs.enableAnimation',
	TabsHideCondition = 'terminal.integrated.tabs.hideCondition',
	TabsShowActiveTerminal = 'terminal.integrated.tabs.showActiveTerminal',
	TabsShowActions = 'terminal.integrated.tabs.showActions',
	TabsLocation = 'terminal.integrated.tabs.location',
	TabsFocusMode = 'terminal.integrated.tabs.focusMode',
	MacOptionIsMeta = 'terminal.integrated.macOptionIsMeta',
	MacOptionClickForcesSelection = 'terminal.integrated.macOptionClickForcesSelection',
	AltClickMovesCursor = 'terminal.integrated.altClickMovesCursor',
	CopyOnSelection = 'terminal.integrated.copyOnSelection',
	EnableMultiLinePasteWarning = 'terminal.integrated.enableMultiLinePasteWarning',
	DrawBoldTextInBrightColors = 'terminal.integrated.drawBoldTextInBrightColors',
	FontFamily = 'terminal.integrated.fontFamily',
	FontSize = 'terminal.integrated.fontSize',
	LetterSpacing = 'terminal.integrated.letterSpacing',
	LineHeight = 'terminal.integrated.lineHeight',
	MinimumContrastRatio = 'terminal.integrated.minimumContrastRatio',
	TabStopWidth = 'terminal.integrated.tabStopWidth',
	FastScrollSensitivity = 'terminal.integrated.fastScrollSensitivity',
	MouseWheelScrollSensitivity = 'terminal.integrated.mouseWheelScrollSensitivity',
	BellDuration = 'terminal.integrated.bellDuration',
	FontWeight = 'terminal.integrated.fontWeight',
	FontWeightBold = 'terminal.integrated.fontWeightBold',
	CursorBlinking = 'terminal.integrated.cursorBlinking',
	CursorStyle = 'terminal.integrated.cursorStyle',
	CursorStyleInactive = 'terminal.integrated.cursorStyleInactive',
	CursorWidth = 'terminal.integrated.cursorWidth',
	Scrollback = 'terminal.integrated.scrollback',
	DetectLocale = 'terminal.integrated.detectLocale',
	DefaultLocation = 'terminal.integrated.defaultLocation',
	GpuAcceleration = 'terminal.integrated.gpuAcceleration',
	TerminalTitleSeparator = 'terminal.integrated.tabs.separator',
	TerminalTitle = 'terminal.integrated.tabs.title',
	TerminalDescription = 'terminal.integrated.tabs.description',
	RightClickBehavior = 'terminal.integrated.rightClickBehavior',
	MiddleClickBehavior = 'terminal.integrated.middleClickBehavior',
	Cwd = 'terminal.integrated.cwd',
	ConfirmOnExit = 'terminal.integrated.confirmOnExit',
	ConfirmOnKill = 'terminal.integrated.confirmOnKill',
	EnableBell = 'terminal.integrated.enableBell',
	EnableVisualBell = 'terminal.integrated.enableVisualBell',
	CommandsToSkipShell = 'terminal.integrated.commandsToSkipShell',
	AllowChords = 'terminal.integrated.allowChords',
	AllowMnemonics = 'terminal.integrated.allowMnemonics',
	TabFocusMode = 'terminal.integrated.tabFocusMode',
	EnvMacOs = 'terminal.integrated.env.osx',
	EnvLinux = 'terminal.integrated.env.linux',
	EnvWindows = 'terminal.integrated.env.windows',
	EnvironmentChangesRelaunch = 'terminal.integrated.environmentChangesRelaunch',
	ShowExitAlert = 'terminal.integrated.showExitAlert',
	SplitCwd = 'terminal.integrated.splitCwd',
	WindowsEnableConpty = 'terminal.integrated.windowsEnableConpty',
	WindowsUseConptyDll = 'terminal.integrated.windowsUseConptyDll',
	WordSeparators = 'terminal.integrated.wordSeparators',
	EnableFileLinks = 'terminal.integrated.enableFileLinks',
	AllowedLinkSchemes = 'terminal.integrated.allowedLinkSchemes',
	UnicodeVersion = 'terminal.integrated.unicodeVersion',
	EnablePersistentSessions = 'terminal.integrated.enablePersistentSessions',
	PersistentSessionReviveProcess = 'terminal.integrated.persistentSessionReviveProcess',
	HideOnStartup = 'terminal.integrated.hideOnStartup',
	HideOnLastClosed = 'terminal.integrated.hideOnLastClosed',
	CustomGlyphs = 'terminal.integrated.customGlyphs',
	RescaleOverlappingGlyphs = 'terminal.integrated.rescaleOverlappingGlyphs',
	PersistentSessionScrollback = 'terminal.integrated.persistentSessionScrollback',
	InheritEnv = 'terminal.integrated.inheritEnv',
	ShowLinkHover = 'terminal.integrated.showLinkHover',
	IgnoreProcessNames = 'terminal.integrated.ignoreProcessNames',
	ShellIntegrationEnabled = 'terminal.integrated.shellIntegration.enabled',
	ShellIntegrationShowWelcome = 'terminal.integrated.shellIntegration.showWelcome',
	ShellIntegrationDecorationsEnabled = 'terminal.integrated.shellIntegration.decorationsEnabled',
	ShellIntegrationTimeout = 'terminal.integrated.shellIntegration.timeout',
	ShellIntegrationQuickFixEnabled = 'terminal.integrated.shellIntegration.quickFixEnabled',
	ShellIntegrationEnvironmentReporting = 'terminal.integrated.shellIntegration.environmentReporting',
	EnableImages = 'terminal.integrated.enableImages',
	SmoothScrolling = 'terminal.integrated.smoothScrolling',
	IgnoreBracketedPasteMode = 'terminal.integrated.ignoreBracketedPasteMode',
	FocusAfterRun = 'terminal.integrated.focusAfterRun',
	FontLigaturesEnabled = 'terminal.integrated.fontLigatures.enabled',
	FontLigaturesFeatureSettings = 'terminal.integrated.fontLigatures.featureSettings',
	FontLigaturesFallbackLigatures = 'terminal.integrated.fontLigatures.fallbackLigatures',

	// Developer/debug settings

	/** Simulated latency applied to all calls made to the pty host */
	DeveloperPtyHostLatency = 'terminal.integrated.developer.ptyHost.latency',
	/** Simulated startup delay of the pty host process */
	DeveloperPtyHostStartupDelay = 'terminal.integrated.developer.ptyHost.startupDelay',
	/** Shows the textarea element */
	DevMode = 'terminal.integrated.developer.devMode'
}

export const enum PosixShellType {
	Bash = 'bash',
	Fish = 'fish',
	Sh = 'sh',
	Csh = 'csh',
	Ksh = 'ksh',
	Zsh = 'zsh',

}
export const enum WindowsShellType {
	CommandPrompt = 'cmd',
	Wsl = 'wsl',
	GitBash = 'gitbash',
}

export const enum GeneralShellType {
	PowerShell = 'pwsh',
	Python = 'python',
	Julia = 'julia',
	NuShell = 'nu',
	Node = 'node',
}
export type TerminalShellType = PosixShellType | WindowsShellType | GeneralShellType | undefined;

export interface IRawTerminalInstanceLayoutInfo<T> {
	relativeSize: number;
	terminal: T;
}
export type ITerminalInstanceLayoutInfoById = IRawTerminalInstanceLayoutInfo<number>;
export type ITerminalInstanceLayoutInfo = IRawTerminalInstanceLayoutInfo<IPtyHostAttachTarget>;

export interface IRawTerminalTabLayoutInfo<T> {
	isActive: boolean;
	activePersistentProcessId: number | undefined;
	terminals: IRawTerminalInstanceLayoutInfo<T>[];
}

export type ITerminalTabLayoutInfoById = IRawTerminalTabLayoutInfo<number>;

export interface IRawTerminalsLayoutInfo<T> {
	tabs: IRawTerminalTabLayoutInfo<T>[];
	background: T[] | null;
}

export interface IPtyHostAttachTarget {
	id: number;
	pid: number;
	title: string;
	titleSource: TitleEventSource;
	cwd: string;
	workspaceId: string;
	workspaceName: string;
	isOrphan: boolean;
	icon: TerminalIcon | undefined;
	fixedDimensions: IFixedTerminalDimensions | undefined;
	environmentVariableCollections: ISerializableEnvironmentVariableCollections | undefined;
	reconnectionProperties?: IReconnectionProperties;
	waitOnExit?: WaitOnExitValue;
	hideFromUser?: boolean;
	isFeatureTerminal?: boolean;
	type?: TerminalType;
	hasChildProcesses: boolean;
	shellIntegrationNonce: string;
	tabActions?: ITerminalTabAction[];
}

export interface IReconnectionProperties {
	ownerId: string;
	data?: unknown;
}

export type TerminalType = 'Task' | 'Local' | undefined;

export enum TitleEventSource {
	/** From the API or the rename command that overrides any other type */
	Api,
	/** From the process name property*/
	Process,
	/** From the VT sequence */
	Sequence,
	/** Config changed */
	Config
}

export type ITerminalsLayoutInfo = IRawTerminalsLayoutInfo<IPtyHostAttachTarget | null>;
export type ITerminalsLayoutInfoById = IRawTerminalsLayoutInfo<number>;

export enum TerminalIpcChannels {
	/**
	 * Communicates between the renderer process and shared process.
	 */
	LocalPty = 'localPty',
	/**
	 * Communicates between the shared process and the pty host process.
	 */
	PtyHost = 'ptyHost',
	/**
	 * Communicates between the renderer process and the pty host process.
	 */
	PtyHostWindow = 'ptyHostWindow',
	/**
	 * Deals with logging from the pty host process.
	 */
	Logger = 'logger',
	/**
	 * Enables the detection of unresponsive pty hosts.
	 */
	Heartbeat = 'heartbeat'
}

export const enum ProcessPropertyType {
	Cwd = 'cwd',
	InitialCwd = 'initialCwd',
	FixedDimensions = 'fixedDimensions',
	Title = 'title',
	ShellType = 'shellType',
	HasChildProcesses = 'hasChildProcesses',
	ResolvedShellLaunchConfig = 'resolvedShellLaunchConfig',
	OverrideDimensions = 'overrideDimensions',
	FailedShellIntegrationActivation = 'failedShellIntegrationActivation',
	UsedShellIntegrationInjection = 'usedShellIntegrationInjection',
	ShellIntegrationInjectionFailureReason = 'shellIntegrationInjectionFailureReason',
}

export interface IProcessProperty<T extends ProcessPropertyType = ProcessPropertyType> {
	type: T;
	value: IProcessPropertyMap[T];
}

export interface IProcessPropertyMap {
	[ProcessPropertyType.Cwd]: string;
	[ProcessPropertyType.InitialCwd]: string;
	[ProcessPropertyType.FixedDimensions]: IFixedTerminalDimensions;
	[ProcessPropertyType.Title]: string;
	[ProcessPropertyType.ShellType]: TerminalShellType | undefined;
	[ProcessPropertyType.HasChildProcesses]: boolean;
	[ProcessPropertyType.ResolvedShellLaunchConfig]: IShellLaunchConfig;
	[ProcessPropertyType.OverrideDimensions]: ITerminalDimensionsOverride | undefined;
	[ProcessPropertyType.FailedShellIntegrationActivation]: boolean | undefined;
	[ProcessPropertyType.UsedShellIntegrationInjection]: boolean | undefined;
	[ProcessPropertyType.ShellIntegrationInjectionFailureReason]: ShellIntegrationInjectionFailureReason | undefined;
}

export interface IFixedTerminalDimensions {
	/**
	 * The fixed columns of the terminal.
	 */
	cols?: number;

	/**
	 * The fixed rows of the terminal.
	 */
	rows?: number;
}

export interface ITerminalLaunchResult {
	injectedArgs: string[];
}

/**
 * A service that communicates with a pty host.
*/
export interface IPtyService {
	readonly _serviceBrand: undefined;

	readonly onProcessData: Event<{ id: number; event: IProcessDataEvent | string }>;
	readonly onProcessReady: Event<{ id: number; event: IProcessReadyEvent }>;
	readonly onProcessReplay: Event<{ id: number; event: IPtyHostProcessReplayEvent }>;
	readonly onProcessOrphanQuestion: Event<{ id: number }>;
	readonly onDidRequestDetach: Event<{ requestId: number; workspaceId: string; instanceId: number }>;
	readonly onDidChangeProperty: Event<{ id: number; property: IProcessProperty }>;
	readonly onProcessExit: Event<{ id: number; event: number | undefined }>;

	createProcess(
		shellLaunchConfig: IShellLaunchConfig,
		cwd: string,
		cols: number,
		rows: number,
		unicodeVersion: '6' | '11',
		env: IProcessEnvironment,
		executableEnv: IProcessEnvironment,
		options: ITerminalProcessOptions,
		shouldPersist: boolean,
		workspaceId: string,
		workspaceName: string
	): Promise<number>;
	attachToProcess(id: number): Promise<void>;
	detachFromProcess(id: number, forcePersist?: boolean): Promise<void>;
	shutdownAll(): Promise<void>;

	/**
	 * Lists all orphaned processes, ie. those without a connected frontend.
	 */
	listProcesses(): Promise<IProcessDetails[]>;
	getPerformanceMarks(): Promise<performance.PerformanceMark[]>;
	/**
	 * Measures and returns the latency of the current and all other processes to the pty host.
	 */
	getLatency(): Promise<IPtyHostLatencyMeasurement[]>;

	start(id: number): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined>;
	shutdown(id: number, immediate: boolean): Promise<void>;
	input(id: number, data: string): Promise<void>;
	sendSignal(id: number, signal: string): Promise<void>;
	resize(id: number, cols: number, rows: number): Promise<void>;
	clearBuffer(id: number): Promise<void>;
	getInitialCwd(id: number): Promise<string>;
	getCwd(id: number): Promise<string>;
	acknowledgeDataEvent(id: number, charCount: number): Promise<void>;
	setNextCommandId(id: number, commandLine: string, commandId: string): Promise<void>;
	setUnicodeVersion(id: number, version: '6' | '11'): Promise<void>;
	processBinary(id: number, data: string): Promise<void>;
	/** Confirm the process is _not_ an orphan. */
	orphanQuestionReply(id: number): Promise<void>;
	updateTitle(id: number, title: string, titleSource: TitleEventSource): Promise<void>;
	updateIcon(id: number, userInitiated: boolean, icon: TerminalIcon, color?: string): Promise<void>;

	getDefaultSystemShell(osOverride?: OperatingSystem): Promise<string>;
	getEnvironment(): Promise<IProcessEnvironment>;
	getWslPath(original: string, direction: 'unix-to-win' | 'win-to-unix'): Promise<string>;
	getRevivedPtyNewId(workspaceId: string, id: number): Promise<number | undefined>;
	setTerminalLayoutInfo(args: ISetTerminalLayoutInfoArgs): Promise<void>;
	getTerminalLayoutInfo(args: IGetTerminalLayoutInfoArgs): Promise<ITerminalsLayoutInfo | undefined>;
	reduceConnectionGraceTime(): Promise<void>;
	requestDetachInstance(workspaceId: string, instanceId: number): Promise<IProcessDetails | undefined>;
	acceptDetachInstanceReply(requestId: number, persistentProcessId?: number): Promise<void>;
	freePortKillProcess(port: string): Promise<{ port: string; processId: string }>;
	/**
	 * Serializes and returns terminal state.
	 * @param ids The persistent terminal IDs to serialize.
	 */
	serializeTerminalState(ids: number[]): Promise<string>;
	/**
	 * Revives a workspaces terminal processes, these can then be reconnected to using the normal
	 * flow for restoring terminals after reloading.
	 */
	reviveTerminalProcesses(workspaceId: string, state: ISerializedTerminalState[], dateTimeFormatLocate: string): Promise<void>;
	refreshProperty<T extends ProcessPropertyType>(id: number, property: T): Promise<IProcessPropertyMap[T]>;
	updateProperty<T extends ProcessPropertyType>(id: number, property: T, value: IProcessPropertyMap[T]): Promise<void>;

	// TODO: Make mandatory and remove impl from pty host service
	refreshIgnoreProcessNames?(names: string[]): Promise<void>;

	// #region Pty service contribution RPC calls

	installAutoReply(match: string, reply: string): Promise<void>;
	uninstallAllAutoReplies(): Promise<void>;

	// #endregion
}
export const IPtyService = createDecorator<IPtyService>('ptyService');

export interface IPtyServiceContribution {
	handleProcessReady(persistentProcessId: number, process: ITerminalChildProcess): void;
	handleProcessDispose(persistentProcessId: number): void;
	handleProcessInput(persistentProcessId: number, data: string): void;
	handleProcessResize(persistentProcessId: number, cols: number, rows: number): void;
}

export interface IPtyHostController {
	readonly onPtyHostExit: Event<number>;
	readonly onPtyHostStart: Event<void>;
	readonly onPtyHostUnresponsive: Event<void>;
	readonly onPtyHostResponsive: Event<void>;
	readonly onPtyHostRequestResolveVariables: Event<IRequestResolveVariablesEvent>;

	restartPtyHost(): Promise<void>;
	acceptPtyHostResolvedVariables(requestId: number, resolved: string[]): Promise<void>;
	getProfiles(workspaceId: string, profiles: unknown, defaultProfile: unknown, includeDetectedProfiles?: boolean): Promise<ITerminalProfile[]>;
}

/**
 * A service that communicates with a pty host controller (eg. main or server
 * process) and is able to launch and forward requests to the pty host.
*/
export interface IPtyHostService extends IPtyService, IPtyHostController {
}

export interface IPtyHostLatencyMeasurement {
	label: string;
	latency: number;
}

/**
 * Serialized terminal state matching the interface that can be used across versions, the version
 * should be verified before using the state payload.
 */
export interface ICrossVersionSerializedTerminalState {
	version: number;
	state: unknown;
}

export interface ISerializedTerminalState {
	id: number;
	shellLaunchConfig: IShellLaunchConfig;
	processDetails: IProcessDetails;
	processLaunchConfig: IPersistentTerminalProcessLaunchConfig;
	unicodeVersion: '6' | '11';
	replayEvent: IPtyHostProcessReplayEvent;
	timestamp: number;
}

export interface IPersistentTerminalProcessLaunchConfig {
	env: IProcessEnvironment;
	executableEnv: IProcessEnvironment;
	options: ITerminalProcessOptions;
}

export interface IRequestResolveVariablesEvent {
	requestId: number;
	workspaceId: string;
	originalText: string[];
}

export enum HeartbeatConstants {
	/**
	 * The duration between heartbeats
	 */
	BeatInterval = 5000,
	/**
	 * The duration of the first heartbeat while the pty host is starting up. This is much larger
	 * than the regular BeatInterval to accommodate slow machines, we still want to warn about the
	 * pty host's unresponsiveness eventually though.
	 */
	ConnectingBeatInterval = 20000,
	/**
	 * Defines a multiplier for BeatInterval for how long to wait before starting the second wait
	 * timer.
	 */
	FirstWaitMultiplier = 1.2,
	/**
	 * Defines a multiplier for BeatInterval for how long to wait before telling the user about
	 * non-responsiveness. The second timer is to avoid informing the user incorrectly when waking
	 * the computer up from sleep
	 */
	SecondWaitMultiplier = 1,
	/**
	 * How long to wait before telling the user about non-responsiveness when they try to create a
	 * process. This short circuits the standard wait timeouts to tell the user sooner and only
	 * create process is handled to avoid additional perf overhead.
	 */
	CreateProcessTimeout = 5000
}

export interface IHeartbeatService {
	readonly onBeat: Event<void>;
}


export interface IShellLaunchConfig {
	/**
	 * The name of the terminal, if this is not set the name of the process will be used.
	 */
	name?: string;

	/**
	 * A string to follow the name of the terminal with, indicating the type of terminal
	 */
	type?: 'Task' | 'Local';

	/**
	 * The shell executable (bash, cmd, etc.).
	 */
	executable?: string;

	/**
	 * The CLI arguments to use with executable, a string[] is in argv format and will be escaped,
	 * a string is in "CommandLine" pre-escaped format and will be used as is. The string option is
	 * only supported on Windows and will throw an exception if used on macOS or Linux.
	 */
	args?: string[] | string;

	/**
	 * The current working directory of the terminal, this overrides the `terminal.integrated.cwd`
	 * settings key.
	 */
	cwd?: string | URI;

	/**
	 * A custom environment for the terminal, if this is not set the environment will be inherited
	 * from the VS Code process.
	 */
	env?: ITerminalEnvironment;

	/**
	 * Whether to ignore a custom cwd from the `terminal.integrated.cwd` settings key (e.g. if the
	 * shell is being launched by an extension).
	 */
	ignoreConfigurationCwd?: boolean;

	/**
	 * The reconnection properties for this terminal
	 */
	reconnectionProperties?: IReconnectionProperties;

	/** Whether to wait for a key press before closing the terminal. */
	waitOnExit?: WaitOnExitValue;

	/**
	 * A string including ANSI escape sequences that will be written to the terminal emulator
	 * _before_ the terminal process has launched, when a string is specified, a trailing \n is
	 * added at the end. This allows for example the terminal instance to display a styled message
	 * as the first line of the terminal. Use \x1b over \033 or \e for the escape control character.
	 */
	initialText?: string | { text: string; trailingNewLine: boolean };

	/**
	 * Custom PTY/pseudoterminal process to use.
	 */
	customPtyImplementation?: (terminalId: number, cols: number, rows: number) => ITerminalChildProcess;

	/**
	 * A UUID generated by the extension host process for terminals created on the extension host process.
	 */
	extHostTerminalId?: string;

	/**
	 * This is a terminal that attaches to an already running terminal.
	 */
	attachPersistentProcess?: {
		id: number;
		findRevivedId?: boolean;
		pid: number;
		title: string;
		titleSource: TitleEventSource;
		cwd: string;
		icon?: TerminalIcon;
		color?: string;
		hasChildProcesses?: boolean;
		fixedDimensions?: IFixedTerminalDimensions;
		environmentVariableCollections?: ISerializableEnvironmentVariableCollections;
		reconnectionProperties?: IReconnectionProperties;
		type?: TerminalType;
		waitOnExit?: WaitOnExitValue;
		hideFromUser?: boolean;
		isFeatureTerminal?: boolean;
		shellIntegrationNonce: string;
		tabActions?: ITerminalTabAction[];
	};

	/**
	 * Whether the terminal process environment should be exactly as provided in
	 * `TerminalOptions.env`. When this is false (default), the environment will be based on the
	 * window's environment and also apply configured platform settings like
	 * `terminal.integrated.env.windows` on top. When this is true, the complete environment must be
	 * provided as nothing will be inherited from the process or any configuration.
	 */
	strictEnv?: boolean;

	/**
	 * Whether the terminal process environment will inherit VS Code's "shell environment" that may
	 * get sourced from running a login shell depnding on how the application was launched.
	 * Consumers that rely on development tools being present in the $PATH should set this to true.
	 * This will overwrite the value of the inheritEnv setting.
	 */
	useShellEnvironment?: boolean;

	/**
	 * When enabled the terminal will run the process as normal but not be surfaced to the user
	 * until `Terminal.show` is called. The typical usage for this is when you need to run
	 * something that may need interactivity but only want to tell the user about it when
	 * interaction is needed. Note that the terminals will still be exposed to all extensions
	 * as normal. The hidden terminals will not be restored when the workspace is next opened.
	 */
	hideFromUser?: boolean;

	/**
	 * Whether to force the terminal to persist across sessions regardless of the other
	 * launch config, like `hideFromUser`.
	 */
	forcePersist?: boolean;

	/**
	 * Whether this terminal is not a terminal that the user directly created and uses, but rather
	 * a terminal used to drive some VS Code feature.
	 */
	isFeatureTerminal?: boolean;

	/**
	 * Whether this terminal was created by an extension.
	 */
	isExtensionOwnedTerminal?: boolean;

	/**
	 * The icon for the terminal, used primarily in the terminal tab.
	 */
	icon?: TerminalIcon;

	/**
	 * The color ID to use for this terminal. If not specified it will use the default fallback
	 */
	color?: string;

	/**
	 * When a parent terminal is provided via API, the group needs
	 * to find the index in order to place the child
	 * directly to the right of its parent.
	 */
	parentTerminalId?: number;

	/**
	 * The dimensions for the instance as set by the user
	 * or via Size to Content Width
	 */
	fixedDimensions?: IFixedTerminalDimensions;

	/**
	 * Opt-out of the default terminal persistence on restart and reload
	 */
	isTransient?: boolean;

	/**
	 * Attempt to force shell integration to be enabled by bypassing the {@link isFeatureTerminal}
	 * equals false requirement.
	 */
	forceShellIntegration?: boolean;

	/**
	 * Create a terminal without shell integration even when it's enabled
	 */
	ignoreShellIntegration?: boolean;

	/**
	 * Actions to include inline on hover of the terminal tab. E.g. the "Rerun task" action
	 */
	tabActions?: ITerminalTabAction[];
	/**
	 * Report terminal's shell environment variables to VS Code and extensions
	 */
	shellIntegrationEnvironmentReporting?: boolean;

	/**
	 * A custom nonce to use for shell integration when provided by an extension.
	 * This allows extensions to control shell integration for terminals they create.
	 */
	shellIntegrationNonce?: string;
}

export interface ITerminalTabAction {
	id: string;
	label: string;
	icon?: ThemeIcon;
}

export type WaitOnExitValue = boolean | string | ((exitCode: number) => string);

export interface ICreateContributedTerminalProfileOptions {
	icon?: URI | string | { light: URI; dark: URI };
	color?: string;
	location?: TerminalLocation | { viewColumn: number; preserveState?: boolean } | { splitActiveTerminal: boolean };
	cwd?: string | URI;
}

export enum TerminalLocation {
	Panel = 1,
	Editor = 2
}

export const enum TerminalLocationConfigValue {
	TerminalView = 'view',
	Editor = 'editor'
}

export type TerminalIcon = ThemeIcon | URI | { light: URI; dark: URI };

export interface IShellLaunchConfigDto {
	name?: string;
	executable?: string;
	args?: string[] | string;
	cwd?: string | UriComponents;
	env?: ITerminalEnvironment;
	useShellEnvironment?: boolean;
	hideFromUser?: boolean;
	reconnectionProperties?: IReconnectionProperties;
	type?: 'Task' | 'Local';
	isFeatureTerminal?: boolean;
	tabActions?: ITerminalTabAction[];
	shellIntegrationEnvironmentReporting?: boolean;
}

/**
 * A set of options for the terminal process. These differ from the shell launch config in that they
 * are set internally to the terminal component, not from the outside.
 */
export interface ITerminalProcessOptions {
	shellIntegration: {
		enabled: boolean;
		suggestEnabled: boolean;
		nonce: string;
	};
	windowsEnableConpty: boolean;
	windowsUseConptyDll: boolean;
	environmentVariableCollections: ISerializableEnvironmentVariableCollections | undefined;
	workspaceFolder: IWorkspaceFolder | undefined;
	isScreenReaderOptimized: boolean;
}

export interface ITerminalEnvironment {
	[key: string]: string | null | undefined;
}

export interface ITerminalLaunchError {
	message: string;
	code?: number;
}

export interface IProcessReadyEvent {
	pid: number;
	cwd: string;
	windowsPty: IProcessReadyWindowsPty | undefined;
}

export interface IProcessReadyWindowsPty {
	/**
	 * What pty emulation backend is being used.
	 */
	backend: 'conpty' | 'winpty';
	/**
	 * The Windows build version (eg. 19045)
	 */
	buildNumber: number;
}

/**
 * An interface representing a raw terminal child process, this contains a subset of the
 * child_process.ChildProcess node.js interface.
 */
export interface ITerminalChildProcess {
	/**
	 * A unique identifier for the terminal process. Note that the uniqueness only applies to a
	 * given pty service connection, IDs will be duplicated for remote and local terminals for
	 * example. The ID will be 0 if it does not support reconnection.
	 */
	id: number;

	/**
	 * Whether the process should be persisted across reloads.
	 */
	shouldPersist: boolean;

	readonly onProcessData: Event<IProcessDataEvent | string>;
	readonly onProcessReady: Event<IProcessReadyEvent>;
	readonly onProcessReplayComplete?: Event<void>;
	readonly onDidChangeProperty: Event<IProcessProperty>;
	readonly onProcessExit: Event<number | undefined>;
	readonly onRestoreCommands?: Event<ISerializedCommandDetectionCapability>;

	/**
	 * Starts the process.
	 *
	 * @returns undefined when the process was successfully started, otherwise an object containing
	 * information on what went wrong.
	 */
	start(): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined>;

	/**
	 * Detach the process from the UI and await reconnect.
	 * @param forcePersist Whether to force the process to persist if it supports persistence.
	 */
	detach?(forcePersist?: boolean): Promise<void>;

	/**
	 * Frees the port and kills the process
	 */
	freePortKillProcess?(port: string): Promise<{ port: string; processId: string }>;

	/**
	 * Shutdown the terminal process.
	 *
	 * @param immediate When true the process will be killed immediately, otherwise the process will
	 * be given some time to make sure no additional data comes through.
	 */
	shutdown(immediate: boolean): void;
	input(data: string): void;
	sendSignal(signal: string): void;
	processBinary(data: string): Promise<void>;
	resize(cols: number, rows: number): void;
	clearBuffer(): void | Promise<void>;

	/**
	 * Acknowledge a data event has been parsed by the terminal, this is used to implement flow
	 * control to ensure remote processes to not get too far ahead of the client and flood the
	 * connection.
	 * @param charCount The number of characters being acknowledged.
	 */
	acknowledgeDataEvent(charCount: number): void;

	/**
	 * Sets the unicode version for the process, this drives the size of some characters in the
	 * xterm-headless instance.
	 */
	setUnicodeVersion(version: '6' | '11'): Promise<void>;

	getInitialCwd(): Promise<string>;
	getCwd(): Promise<string>;
	refreshProperty<T extends ProcessPropertyType>(property: T): Promise<IProcessPropertyMap[T]>;
	updateProperty<T extends ProcessPropertyType>(property: T, value: IProcessPropertyMap[T]): Promise<void>;
}

export interface IReconnectConstants {
	graceTime: number;
	shortGraceTime: number;
	scrollback: number;
}

export const enum LocalReconnectConstants {
	/**
	 * If there is no reconnection within this time-frame, consider the connection permanently closed...
	*/
	GraceTime = 60000, // 60 seconds
	/**
	 * Maximal grace time between the first and the last reconnection...
	*/
	ShortGraceTime = 6000, // 6 seconds
}

export const enum FlowControlConstants {
	/**
	 * The number of _unacknowledged_ chars to have been sent before the pty is paused in order for
	 * the client to catch up.
	 */
	HighWatermarkChars = 100000,
	/**
	 * After flow control pauses the pty for the client the catch up, this is the number of
	 * _unacknowledged_ chars to have been caught up to on the client before resuming the pty again.
	 * This is used to attempt to prevent pauses in the flowing data; ideally while the pty is
	 * paused the number of unacknowledged chars would always be greater than 0 or the client will
	 * appear to stutter. In reality this balance is hard to accomplish though so heavy commands
	 * will likely pause as latency grows, not flooding the connection is the important thing as
	 * it's shared with other core functionality.
	 */
	LowWatermarkChars = 5000,
	/**
	 * The number characters that are accumulated on the client side before sending an ack event.
	 * This must be less than or equal to LowWatermarkChars or the terminal max never unpause.
	 */
	CharCountAckSize = 5000
}

export interface IProcessDataEvent {
	data: string;
	trackCommit: boolean;
	/**
	 * When trackCommit is set, this will be set to a promise that resolves when the data is parsed.
	 */
	writePromise?: Promise<void>;
}

export interface ITerminalDimensions {
	/**
	 * The columns of the terminal.
	 */
	cols: number;

	/**
	 * The rows of the terminal.
	 */
	rows: number;
}

export interface ITerminalProfile {
	profileName: string;
	path: string;
	isDefault: boolean;
	/**
	 * Whether the terminal profile contains a potentially unsafe {@link path}. For example, the path
	 * `C:\Cygwin` is the default install for Cygwin on Windows, but it could be created by any
	 * user in a multi-user environment. As such, we don't want to blindly present it as a profile
	 * without a warning.
	 */
	isUnsafePath?: boolean;
	/**
	 * An additional unsafe path that must exist, for example a script that appears in {@link args}.
	 */
	requiresUnsafePath?: string;
	isAutoDetected?: boolean;
	/**
	 * Whether the profile path was found on the `$PATH` environment variable, if so it will be
	 * cleaner to display this profile in the UI using only `basename(path)`.
	 */
	isFromPath?: boolean;
	args?: SingleOrMany<string> | undefined;
	env?: ITerminalEnvironment;
	overrideName?: boolean;
	color?: string;
	icon?: ThemeIcon | URI | { light: URI; dark: URI };
}

export interface ITerminalDimensionsOverride extends Readonly<ITerminalDimensions> {
	/**
	 * indicate that xterm must receive these exact dimensions, even if they overflow the ui!
	 */
	forceExactSize?: boolean;
}

export const enum ProfileSource {
	GitBash = 'Git Bash',
	Pwsh = 'PowerShell'
}

export interface IBaseUnresolvedTerminalProfile {
	args?: SingleOrMany<string> | undefined;
	isAutoDetected?: boolean;
	overrideName?: boolean;
	icon?: string | ThemeIcon | URI | { light: URI; dark: URI };
	color?: string;
	env?: ITerminalEnvironment;
	requiresPath?: string | ITerminalUnsafePath;
}

export interface ITerminalUnsafePath {
	path: string;
	isUnsafe: true;
}

export interface ITerminalExecutable extends IBaseUnresolvedTerminalProfile {
	path: SingleOrMany<string | ITerminalUnsafePath>;
}

export interface ITerminalProfileSource extends IBaseUnresolvedTerminalProfile {
	source: ProfileSource;
}

export interface ITerminalProfileContribution {
	title: string;
	id: string;
	icon?: URI | { light: URI; dark: URI } | string;
	color?: string;
}

export interface IExtensionTerminalProfile extends ITerminalProfileContribution {
	extensionIdentifier: string;
}

export type ITerminalProfileObject = ITerminalExecutable | ITerminalProfileSource | IExtensionTerminalProfile | null;

export interface IShellIntegration {
	readonly capabilities: ITerminalCapabilityStore;
	readonly seenSequences: ReadonlySet<string>;
	readonly status: ShellIntegrationStatus;

	readonly onDidChangeStatus: Event<ShellIntegrationStatus>;
	readonly onDidChangeSeenSequences: Event<ReadonlySet<string>>;

	deserialize(serialized: ISerializedCommandDetectionCapability): void;

	setNextCommandId(command: string, commandId: string): void;
}

export interface IDecorationAddon {
	registerMenuItems(command: ITerminalCommand, items: IAction[]): IDisposable;
}

export interface ITerminalCompletionProviderContribution {
	description?: string;
}

export interface ITerminalContributions {
	profiles?: ITerminalProfileContribution[];
	completionProviders?: ITerminalCompletionProviderContribution[];
}

export const enum ShellIntegrationStatus {
	/** No shell integration sequences have been encountered. */
	Off,
	/** Final term shell integration sequences have been encountered. */
	FinalTerm,
	/** VS Code shell integration sequences have been encountered. Supercedes FinalTerm. */
	VSCode
}


export const enum ShellIntegrationInjectionFailureReason {
	/**
	 * The setting is disabled.
	 */
	InjectionSettingDisabled = 'injectionSettingDisabled',
	/**
	 * There is no executable (so there's no way to determine how to inject).
	 */
	NoExecutable = 'noExecutable',
	/**
	 * It's a feature terminal (tasks, debug), unless it's explicitly being forced.
	 */
	FeatureTerminal = 'featureTerminal',
	/**
	 * The ignoreShellIntegration flag is passed (eg. relaunching without shell integration).
	 */
	IgnoreShellIntegrationFlag = 'ignoreShellIntegrationFlag',
	/**
	 * Shell integration doesn't work with winpty.
	 */
	Winpty = 'winpty',
	/**
	 * We're conservative whether we inject when we don't recognize the arguments used for the
	 * shell as we would prefer launching one without shell integration than breaking their profile.
	 */
	UnsupportedArgs = 'unsupportedArgs',
	/**
	 * The shell doesn't have built-in shell integration. Note that this doesn't mean the shell
	 * won't have shell integration in the end.
	 */
	UnsupportedShell = 'unsupportedShell',


	/**
	 * For zsh, we failed to set the sticky bit on the shell integration script folder.
	 */
	FailedToSetStickyBit = 'failedToSetStickyBit',

	/**
	 * For zsh, we failed to create a temp directory for the shell integration script.
	 */
	FailedToCreateTmpDir = 'failedToCreateTmpDir',
}

export enum TerminalExitReason {
	Unknown = 0,
	Shutdown = 1,
	Process = 2,
	User = 3,
	Extension = 4,
}

export interface ITerminalOutputMatch {
	regexMatch: RegExpMatchArray;
	outputLines: string[];
}

/**
 * A matcher that runs on a sub-section of a terminal command's output
 */
export interface ITerminalOutputMatcher {
	/**
	 * A string or regex to match against the unwrapped line. If this is a regex with the multiline
	 * flag, it will scan an amount of lines equal to `\n` instances in the regex + 1.
	 */
	lineMatcher: string | RegExp;
	/**
	 * Which side of the output to anchor the {@link offset} and {@link length} against.
	 */
	anchor: 'top' | 'bottom';
	/**
	 * The number of rows above or below the {@link anchor} to start matching against.
	 */
	offset: number;
	/**
	 * The number of rows to match against, this should be as small as possible for performance
	 * reasons. This is capped at 40.
	 */
	length: number;

	/**
	 * If multiple matches are expected - this will result in {@link outputLines} being returned
	 * when there's a {@link regexMatch} from {@link offset} to {@link length}
	 */
	multipleMatches?: boolean;
}

export interface ITerminalCommandSelector {
	id: string;
	commandLineMatcher: string | RegExp;
	outputMatcher?: ITerminalOutputMatcher;
	exitStatus: boolean;
	commandExitResult: 'success' | 'error';
	kind?: 'fix' | 'explain';
}

export interface ITerminalBackend extends ITerminalBackendPtyServiceContributions {
	readonly remoteAuthority: string | undefined;

	readonly isResponsive: boolean;

	/**
	 * A promise that resolves when the backend is ready to be used, ie. after terminal persistence
	 * has been actioned.
	 */
	readonly whenReady: Promise<void>;

	/**
	 * Signal to the backend that persistence has been actioned and is ready for use.
	 */
	setReady(): void;

	/**
	 * Fired when the ptyHost process becomes non-responsive, this should disable stdin for all
	 * terminals using this pty host connection and mark them as disconnected.
	 */
	readonly onPtyHostUnresponsive: Event<void>;
	/**
	 * Fired when the ptyHost process becomes responsive after being non-responsive. Allowing
	 * previously disconnected terminals to reconnect.
	 */
	readonly onPtyHostResponsive: Event<void>;
	/**
	 * Fired when the ptyHost has been restarted, this is used as a signal for listening terminals
	 * that its pty has been lost and will remain disconnected.
	 */
	readonly onPtyHostRestart: Event<void>;

	readonly onDidRequestDetach: Event<{ requestId: number; workspaceId: string; instanceId: number }>;

	attachToProcess(id: number): Promise<ITerminalChildProcess | undefined>;
	attachToRevivedProcess(id: number): Promise<ITerminalChildProcess | undefined>;
	listProcesses(): Promise<IProcessDetails[]>;
	getLatency(): Promise<IPtyHostLatencyMeasurement[]>;
	getDefaultSystemShell(osOverride?: OperatingSystem): Promise<string>;
	getProfiles(profiles: unknown, defaultProfile: unknown, includeDetectedProfiles?: boolean): Promise<ITerminalProfile[]>;
	getWslPath(original: string, direction: 'unix-to-win' | 'win-to-unix'): Promise<string>;
	getEnvironment(): Promise<IProcessEnvironment>;
	getShellEnvironment(): Promise<IProcessEnvironment | undefined>;
	setTerminalLayoutInfo(layoutInfo?: ITerminalsLayoutInfoById): Promise<void>;
	updateTitle(id: number, title: string, titleSource: TitleEventSource): Promise<void>;
	updateIcon(id: number, userInitiated: boolean, icon: TerminalIcon, color?: string): Promise<void>;
	setNextCommandId(id: number, commandLine: string, commandId: string): Promise<void>;
	getTerminalLayoutInfo(): Promise<ITerminalsLayoutInfo | undefined>;
	getPerformanceMarks(): Promise<performance.PerformanceMark[]>;
	reduceConnectionGraceTime(): Promise<void>;
	requestDetachInstance(workspaceId: string, instanceId: number): Promise<IProcessDetails | undefined>;
	acceptDetachInstanceReply(requestId: number, persistentProcessId?: number): Promise<void>;
	persistTerminalState(): Promise<void>;

	createProcess(
		shellLaunchConfig: IShellLaunchConfig,
		cwd: string,
		cols: number,
		rows: number,
		unicodeVersion: '6' | '11',
		env: IProcessEnvironment,
		options: ITerminalProcessOptions,
		shouldPersist: boolean
	): Promise<ITerminalChildProcess>;

	restartPtyHost(): void;
}

export interface ITerminalBackendPtyServiceContributions {
	installAutoReply(match: string, reply: string): Promise<void>;
	uninstallAllAutoReplies(): Promise<void>;
}

export const TerminalExtensions = {
	Backend: 'workbench.contributions.terminal.processBackend'
};

export interface ITerminalBackendRegistry {
	/**
	 * Gets all backends in the registry.
	 */
	backends: ReadonlyMap<string, ITerminalBackend>;

	/**
	 * Registers a terminal backend for a remote authority.
	 */
	registerTerminalBackend(backend: ITerminalBackend): void;

	/**
	 * Returns the registered terminal backend for a remote authority.
	 */
	getTerminalBackend(remoteAuthority?: string): ITerminalBackend | undefined;
}

class TerminalBackendRegistry implements ITerminalBackendRegistry {
	private readonly _backends = new Map<string, ITerminalBackend>();

	get backends(): ReadonlyMap<string, ITerminalBackend> { return this._backends; }

	registerTerminalBackend(backend: ITerminalBackend): void {
		const key = this._sanitizeRemoteAuthority(backend.remoteAuthority);
		if (this._backends.has(key)) {
			throw new Error(`A terminal backend with remote authority '${key}' was already registered.`);
		}
		this._backends.set(key, backend);
	}

	getTerminalBackend(remoteAuthority: string | undefined): ITerminalBackend | undefined {
		return this._backends.get(this._sanitizeRemoteAuthority(remoteAuthority));
	}

	private _sanitizeRemoteAuthority(remoteAuthority: string | undefined) {
		// Normalize the key to lowercase as the authority is case-insensitive
		return remoteAuthority?.toLowerCase() ?? '';
	}
}
Registry.add(TerminalExtensions.Backend, new TerminalBackendRegistry());

export const ILocalPtyService = createDecorator<ILocalPtyService>('localPtyService');

/**
 * A service responsible for communicating with the pty host process on Electron.
 *
 * **This service should only be used within the terminal component.**
 */
export interface ILocalPtyService extends IPtyHostService { }

export const ITerminalLogService = createDecorator<ITerminalLogService>('terminalLogService');
export interface ITerminalLogService extends ILogService {
	/**
	 * Similar to _serviceBrand but used to differentiate this service at compile time from
	 * ILogService; ITerminalLogService is an ILogService, but ILogService is not an
	 * ITerminalLogService.
	 */
	readonly _logBrand: undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/terminalDataBuffering.ts]---
Location: vscode-main/src/vs/platform/terminal/common/terminalDataBuffering.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { isString } from '../../../base/common/types.js';
import { IProcessDataEvent } from './terminal.js';

interface TerminalDataBuffer extends IDisposable {
	data: string[];
	timeoutId: Timeout;
}

export class TerminalDataBufferer implements IDisposable {
	private readonly _terminalBufferMap = new Map<number, TerminalDataBuffer>();

	constructor(private readonly _callback: (id: number, data: string) => void) {
	}

	dispose() {
		for (const buffer of this._terminalBufferMap.values()) {
			buffer.dispose();
		}
	}

	startBuffering(id: number, event: Event<string | IProcessDataEvent>, throttleBy: number = 5): IDisposable {

		const disposable = event((e: string | IProcessDataEvent) => {
			const data = isString(e) ? e : e.data;
			let buffer = this._terminalBufferMap.get(id);
			if (buffer) {
				buffer.data.push(data);
				return;
			}

			const timeoutId = setTimeout(() => this.flushBuffer(id), throttleBy);
			buffer = {
				data: [data],
				timeoutId,
				dispose: () => {
					clearTimeout(timeoutId);
					this.flushBuffer(id);
					disposable.dispose();
				}
			};
			this._terminalBufferMap.set(id, buffer);
		});
		return disposable;
	}

	stopBuffering(id: number) {
		const buffer = this._terminalBufferMap.get(id);
		buffer?.dispose();
	}

	flushBuffer(id: number): void {
		const buffer = this._terminalBufferMap.get(id);
		if (buffer) {
			this._terminalBufferMap.delete(id);
			this._callback(id, buffer.data.join(''));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/terminalEnvironment.ts]---
Location: vscode-main/src/vs/platform/terminal/common/terminalEnvironment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OperatingSystem, OS } from '../../../base/common/platform.js';
import { IShellLaunchConfig, TerminalShellType, PosixShellType, WindowsShellType, GeneralShellType } from './terminal.js';

/**
 * Aggressively escape non-windows paths to prepare for being sent to a shell. This will do some
 * escaping inaccurately to be careful about possible script injection via the file path. For
 * example, we're trying to prevent this sort of attack: `/foo/file$(echo evil)`.
 */
export function escapeNonWindowsPath(path: string, shellType?: TerminalShellType): string {
	let newPath = path;
	if (newPath.includes('\\')) {
		newPath = newPath.replace(/\\/g, '\\\\');
	}

	// Define shell-specific escaping rules
	interface ShellEscapeConfig {
		// How to handle paths with both single and double quotes
		bothQuotes: (path: string) => string;
		// How to handle paths with only single quotes
		singleQuotes: (path: string) => string;
		// How to handle paths with no single quotes (may have double quotes)
		noSingleQuotes: (path: string) => string;
	}

	let escapeConfig: ShellEscapeConfig;
	switch (shellType) {
		case PosixShellType.Bash:
		case PosixShellType.Sh:
		case PosixShellType.Zsh:
		case WindowsShellType.GitBash:
			escapeConfig = {
				bothQuotes: (path) => `$'${path.replace(/'/g, '\\\'')}'`,
				singleQuotes: (path) => `'${path.replace(/'/g, '\\\'')}'`,
				noSingleQuotes: (path) => `'${path}'`
			};
			break;
		case PosixShellType.Fish:
			escapeConfig = {
				bothQuotes: (path) => `"${path.replace(/"/g, '\\"')}"`,
				singleQuotes: (path) => `'${path.replace(/'/g, '\\\'')}'`,
				noSingleQuotes: (path) => `'${path}'`
			};
			break;
		case GeneralShellType.PowerShell:
			// PowerShell should be handled separately in preparePathForShell
			// but if we get here, use PowerShell escaping
			escapeConfig = {
				bothQuotes: (path) => `"${path.replace(/"/g, '`"')}"`,
				singleQuotes: (path) => `'${path.replace(/'/g, '\'\'')}'`,
				noSingleQuotes: (path) => `'${path}'`
			};
			break;
		default:
			// Default to POSIX shell escaping for unknown shells
			escapeConfig = {
				bothQuotes: (path) => `$'${path.replace(/'/g, '\\\'')}'`,
				singleQuotes: (path) => `'${path.replace(/'/g, '\\\'')}'`,
				noSingleQuotes: (path) => `'${path}'`
			};
			break;
	}

	// Remove dangerous characters except single and double quotes, which we'll escape properly
	const bannedChars = /[\`\$\|\&\>\~\#\!\^\*\;\<]/g;
	newPath = newPath.replace(bannedChars, '');

	// Apply shell-specific escaping based on quote content
	if (newPath.includes('\'') && newPath.includes('"')) {
		return escapeConfig.bothQuotes(newPath);
	} else if (newPath.includes('\'')) {
		return escapeConfig.singleQuotes(newPath);
	} else {
		return escapeConfig.noSingleQuotes(newPath);
	}
}

/**
 * Collapses the user's home directory into `~` if it exists within the path, this gives a shorter
 * path that is more suitable within the context of a terminal.
 */
export function collapseTildePath(path: string | undefined, userHome: string | undefined, separator: string): string {
	if (!path) {
		return '';
	}
	if (!userHome) {
		return path;
	}
	// Trim the trailing separator from the end if it exists
	if (userHome.match(/[\/\\]$/)) {
		userHome = userHome.slice(0, userHome.length - 1);
	}
	const normalizedPath = path.replace(/\\/g, '/').toLowerCase();
	const normalizedUserHome = userHome.replace(/\\/g, '/').toLowerCase();
	if (!normalizedPath.includes(normalizedUserHome)) {
		return path;
	}
	return `~${separator}${path.slice(userHome.length + 1)}`;
}

/**
 * Sanitizes a cwd string, removing any wrapping quotes and making the Windows drive letter
 * uppercase.
 * @param cwd The directory to sanitize.
 */
export function sanitizeCwd(cwd: string): string {
	// Sanity check that the cwd is not wrapped in quotes (see #160109)
	if (cwd.match(/^['"].*['"]$/)) {
		cwd = cwd.substring(1, cwd.length - 1);
	}
	// Make the drive letter uppercase on Windows (see #9448)
	if (OS === OperatingSystem.Windows && cwd && cwd[1] === ':') {
		return cwd[0].toUpperCase() + cwd.substring(1);
	}
	return cwd;
}

/**
 * Determines whether the given shell launch config should use the environment variable collection.
 * @param slc The shell launch config to check.
 */
export function shouldUseEnvironmentVariableCollection(slc: IShellLaunchConfig): boolean {
	return !slc.strictEnv;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/terminalLogService.ts]---
Location: vscode-main/src/vs/platform/terminal/common/terminalLogService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { Event } from '../../../base/common/event.js';
import { localize } from '../../../nls.js';
import { ILogger, ILoggerService, LogLevel } from '../../log/common/log.js';
import { ITerminalLogService } from './terminal.js';
import { IWorkspaceContextService } from '../../workspace/common/workspace.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { joinPath } from '../../../base/common/resources.js';

export class TerminalLogService extends Disposable implements ITerminalLogService {
	declare _serviceBrand: undefined;
	declare _logBrand: undefined;

	private readonly _logger: ILogger;

	private _workspaceId!: string;

	get onDidChangeLogLevel(): Event<LogLevel> { return this._logger.onDidChangeLogLevel; }

	constructor(
		@ILoggerService private readonly _loggerService: ILoggerService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IEnvironmentService environmentService: IEnvironmentService,
	) {
		super();
		this._logger = this._loggerService.createLogger(joinPath(environmentService.logsHome, 'terminal.log'), { id: 'terminal', name: localize('terminalLoggerName', 'Terminal') });
		this._register(Event.runAndSubscribe(workspaceContextService.onDidChangeWorkspaceFolders, () => {
			this._workspaceId = workspaceContextService.getWorkspace().id.substring(0, 7);
		}));
	}

	getLevel(): LogLevel { return this._logger.getLevel(); }
	setLevel(level: LogLevel): void { this._logger.setLevel(level); }
	flush(): void { this._logger.flush(); }

	trace(message: string, ...args: unknown[]): void { this._logger.trace(this._formatMessage(message), args); }
	debug(message: string, ...args: unknown[]): void { this._logger.debug(this._formatMessage(message), args); }
	info(message: string, ...args: unknown[]): void { this._logger.info(this._formatMessage(message), args); }
	warn(message: string, ...args: unknown[]): void { this._logger.warn(this._formatMessage(message), args); }
	error(message: string | Error, ...args: unknown[]): void {
		if (message instanceof Error) {
			this._logger.error(this._formatMessage(''), message, args);
			return;
		}
		this._logger.error(this._formatMessage(message), args);
	}

	private _formatMessage(message: string): string {
		if (this._logger.getLevel() === LogLevel.Trace) {
			return `[${this._workspaceId}] ${message}`;
		}
		return message;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/terminalPlatformConfiguration.ts]---
Location: vscode-main/src/vs/platform/terminal/common/terminalPlatformConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon, getAllCodicons } from '../../../base/common/codicons.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../base/common/jsonSchema.js';
import { OperatingSystem, Platform, PlatformToString } from '../../../base/common/platform.js';
import { localize } from '../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationNode, IConfigurationRegistry } from '../../configuration/common/configurationRegistry.js';
import { Registry } from '../../registry/common/platform.js';
import { IExtensionTerminalProfile, ITerminalProfile, TerminalSettingId } from './terminal.js';
import { createProfileSchemaEnums } from './terminalProfiles.js';

export const terminalColorSchema: IJSONSchema = {
	type: ['string', 'null'],
	enum: [
		'terminal.ansiBlack',
		'terminal.ansiRed',
		'terminal.ansiGreen',
		'terminal.ansiYellow',
		'terminal.ansiBlue',
		'terminal.ansiMagenta',
		'terminal.ansiCyan',
		'terminal.ansiWhite'
	],
	default: null
};

export const terminalIconSchema: IJSONSchema = {
	type: 'string',
	enum: Array.from(getAllCodicons(), icon => icon.id),
	markdownEnumDescriptions: Array.from(getAllCodicons(), icon => `$(${icon.id})`),
};

export const terminalProfileBaseProperties: IJSONSchemaMap = {
	args: {
		description: localize('terminalProfile.args', 'An optional set of arguments to run the shell executable with.'),
		type: 'array',
		items: {
			type: 'string'
		}
	},
	icon: {
		description: localize('terminalProfile.icon', 'A codicon ID to associate with the terminal icon.'),
		...terminalIconSchema
	},
	color: {
		description: localize('terminalProfile.color', 'A theme color ID to associate with the terminal icon.'),
		...terminalColorSchema
	},
	env: {
		markdownDescription: localize('terminalProfile.env', "An object with environment variables that will be added to the terminal profile process. Set to `null` to delete environment variables from the base environment."),
		type: 'object',
		additionalProperties: {
			type: ['string', 'null']
		},
		default: {}
	}
};

const terminalProfileSchema: IJSONSchema = {
	type: 'object',
	required: ['path'],
	properties: {
		path: {
			description: localize('terminalProfile.path', 'A single path to a shell executable or an array of paths that will be used as fallbacks when one fails.'),
			type: ['string', 'array'],
			items: {
				type: 'string'
			}
		},
		overrideName: {
			description: localize('terminalProfile.overrideName', 'Whether or not to replace the dynamic terminal title that detects what program is running with the static profile name.'),
			type: 'boolean'
		},
		...terminalProfileBaseProperties
	}
};

const terminalAutomationProfileSchema: IJSONSchema = {
	type: 'object',
	required: ['path'],
	properties: {
		path: {
			description: localize('terminalAutomationProfile.path', 'A path to a shell executable.'),
			type: ['string'],
			items: {
				type: 'string'
			}
		},
		...terminalProfileBaseProperties
	}
};

function createTerminalProfileMarkdownDescription(platform: Platform.Linux | Platform.Mac | Platform.Windows): string {
	const key = platform === Platform.Linux ? 'linux' : platform === Platform.Mac ? 'osx' : 'windows';
	return localize(
		{
			key: 'terminal.integrated.profile',
			comment: ['{0} is the platform, {1} is a code block, {2} and {3} are a link start and end']
		},
		"A set of terminal profile customizations for {0} which allows adding, removing or changing how terminals are launched. Profiles are made up of a mandatory path, optional arguments and other presentation options.\n\nTo override an existing profile use its profile name as the key, for example:\n\n{1}\n\n{2}Read more about configuring profiles{3}.",
		PlatformToString(platform),
		'```json\n"terminal.integrated.profile.' + key + '": {\n  "bash": null\n}\n```',
		'[',
		'](https://code.visualstudio.com/docs/terminal/profiles)'
	);
}

const terminalPlatformConfiguration: IConfigurationNode = {
	id: 'terminal',
	order: 100,
	title: localize('terminalIntegratedConfigurationTitle', "Integrated Terminal"),
	type: 'object',
	properties: {
		[TerminalSettingId.AutomationProfileLinux]: {
			restricted: true,
			markdownDescription: localize('terminal.integrated.automationProfile.linux', "The terminal profile to use on Linux for automation-related terminal usage like tasks and debug."),
			type: ['object', 'null'],
			default: null,
			'anyOf': [
				{ type: 'null' },
				terminalAutomationProfileSchema
			],
			defaultSnippets: [
				{
					body: {
						path: '${1}',
						icon: '${2}'
					}
				}
			]
		},
		[TerminalSettingId.AutomationProfileMacOs]: {
			restricted: true,
			markdownDescription: localize('terminal.integrated.automationProfile.osx', "The terminal profile to use on macOS for automation-related terminal usage like tasks and debug."),
			type: ['object', 'null'],
			default: null,
			'anyOf': [
				{ type: 'null' },
				terminalAutomationProfileSchema
			],
			defaultSnippets: [
				{
					body: {
						path: '${1}',
						icon: '${2}'
					}
				}
			]
		},
		[TerminalSettingId.AutomationProfileWindows]: {
			restricted: true,
			markdownDescription: localize('terminal.integrated.automationProfile.windows', "The terminal profile to use for automation-related terminal usage like tasks and debug. This setting will currently be ignored if {0} (now deprecated) is set.", '`terminal.integrated.automationShell.windows`'),
			type: ['object', 'null'],
			default: null,
			'anyOf': [
				{ type: 'null' },
				terminalAutomationProfileSchema
			],
			defaultSnippets: [
				{
					body: {
						path: '${1}',
						icon: '${2}'
					}
				}
			]
		},
		[TerminalSettingId.ProfilesWindows]: {
			restricted: true,
			markdownDescription: createTerminalProfileMarkdownDescription(Platform.Windows),
			type: 'object',
			default: {
				'PowerShell': {
					source: 'PowerShell',
					icon: Codicon.terminalPowershell.id,
				},
				'Command Prompt': {
					path: [
						'${env:windir}\\Sysnative\\cmd.exe',
						'${env:windir}\\System32\\cmd.exe'
					],
					args: [],
					icon: Codicon.terminalCmd,
				},
				'Git Bash': {
					source: 'Git Bash',
					icon: Codicon.terminalGitBash.id,
				}
			},
			additionalProperties: {
				'anyOf': [
					{
						type: 'object',
						required: ['source'],
						properties: {
							source: {
								description: localize('terminalProfile.windowsSource', 'A profile source that will auto detect the paths to the shell. Note that non-standard executable locations are not supported and must be created manually in a new profile.'),
								enum: ['PowerShell', 'Git Bash']
							},
							...terminalProfileBaseProperties
						}
					},
					{
						type: 'object',
						required: ['extensionIdentifier', 'id', 'title'],
						properties: {
							extensionIdentifier: {
								description: localize('terminalProfile.windowsExtensionIdentifier', 'The extension that contributed this profile.'),
								type: 'string'
							},
							id: {
								description: localize('terminalProfile.windowsExtensionId', 'The id of the extension terminal'),
								type: 'string'
							},
							title: {
								description: localize('terminalProfile.windowsExtensionTitle', 'The name of the extension terminal'),
								type: 'string'
							},
							...terminalProfileBaseProperties
						}
					},
					{ type: 'null' },
					terminalProfileSchema
				]
			}
		},
		[TerminalSettingId.ProfilesMacOs]: {
			restricted: true,
			markdownDescription: createTerminalProfileMarkdownDescription(Platform.Mac),
			type: 'object',
			default: {
				'bash': {
					path: 'bash',
					args: ['-l'],
					icon: Codicon.terminalBash.id
				},
				'zsh': {
					path: 'zsh',
					args: ['-l']
				},
				'fish': {
					path: 'fish',
					args: ['-l']
				},
				'tmux': {
					path: 'tmux',
					icon: Codicon.terminalTmux.id
				},
				'pwsh': {
					path: 'pwsh',
					icon: Codicon.terminalPowershell.id
				}
			},
			additionalProperties: {
				'anyOf': [
					{
						type: 'object',
						required: ['extensionIdentifier', 'id', 'title'],
						properties: {
							extensionIdentifier: {
								description: localize('terminalProfile.osxExtensionIdentifier', 'The extension that contributed this profile.'),
								type: 'string'
							},
							id: {
								description: localize('terminalProfile.osxExtensionId', 'The id of the extension terminal'),
								type: 'string'
							},
							title: {
								description: localize('terminalProfile.osxExtensionTitle', 'The name of the extension terminal'),
								type: 'string'
							},
							...terminalProfileBaseProperties
						}
					},
					{ type: 'null' },
					terminalProfileSchema
				]
			}
		},
		[TerminalSettingId.ProfilesLinux]: {
			restricted: true,
			markdownDescription: createTerminalProfileMarkdownDescription(Platform.Linux),
			type: 'object',
			default: {
				'bash': {
					path: 'bash',
					icon: Codicon.terminalBash.id
				},
				'zsh': {
					path: 'zsh'
				},
				'fish': {
					path: 'fish'
				},
				'tmux': {
					path: 'tmux',
					icon: Codicon.terminalTmux.id
				},
				'pwsh': {
					path: 'pwsh',
					icon: Codicon.terminalPowershell.id
				}
			},
			additionalProperties: {
				'anyOf': [
					{
						type: 'object',
						required: ['extensionIdentifier', 'id', 'title'],
						properties: {
							extensionIdentifier: {
								description: localize('terminalProfile.linuxExtensionIdentifier', 'The extension that contributed this profile.'),
								type: 'string'
							},
							id: {
								description: localize('terminalProfile.linuxExtensionId', 'The id of the extension terminal'),
								type: 'string'
							},
							title: {
								description: localize('terminalProfile.linuxExtensionTitle', 'The name of the extension terminal'),
								type: 'string'
							},
							...terminalProfileBaseProperties
						}
					},
					{ type: 'null' },
					terminalProfileSchema
				]
			}
		},
		[TerminalSettingId.UseWslProfiles]: {
			description: localize('terminal.integrated.useWslProfiles', 'Controls whether or not WSL distros are shown in the terminal dropdown'),
			type: 'boolean',
			default: true
		},
		[TerminalSettingId.InheritEnv]: {
			scope: ConfigurationScope.APPLICATION,
			description: localize('terminal.integrated.inheritEnv', "Whether new shells should inherit their environment from VS Code, which may source a login shell to ensure $PATH and other development variables are initialized. This has no effect on Windows."),
			type: 'boolean',
			default: true
		},
		[TerminalSettingId.PersistentSessionScrollback]: {
			scope: ConfigurationScope.APPLICATION,
			markdownDescription: localize('terminal.integrated.persistentSessionScrollback', "Controls the maximum amount of lines that will be restored when reconnecting to a persistent terminal session. Increasing this will restore more lines of scrollback at the cost of more memory and increase the time it takes to connect to terminals on start up. This setting requires a restart to take effect and should be set to a value less than or equal to `#terminal.integrated.scrollback#`."),
			type: 'number',
			default: 100
		},
		[TerminalSettingId.ShowLinkHover]: {
			scope: ConfigurationScope.APPLICATION,
			description: localize('terminal.integrated.showLinkHover', "Whether to show hovers for links in the terminal output."),
			type: 'boolean',
			default: true
		},
		[TerminalSettingId.IgnoreProcessNames]: {
			markdownDescription: localize('terminal.integrated.confirmIgnoreProcesses', "A set of process names to ignore when using the {0} setting.", '`#terminal.integrated.confirmOnKill#`'),
			type: 'array',
			items: {
				type: 'string',
				uniqueItems: true
			},
			default: [
				// Popular prompt programs, these should not count as child processes
				'starship',
				'oh-my-posh',
				// Git bash may runs a subprocess of itself (bin\bash.exe -> usr\bin\bash.exe)
				'bash',
				'zsh',
			]
		}
	}
};

/**
 * Registers terminal configurations required by shared process and remote server.
 */
export function registerTerminalPlatformConfiguration() {
	Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration(terminalPlatformConfiguration);
	registerTerminalDefaultProfileConfiguration();
}

let defaultProfilesConfiguration: IConfigurationNode | undefined;
export function registerTerminalDefaultProfileConfiguration(detectedProfiles?: { os: OperatingSystem; profiles: ITerminalProfile[] }, extensionContributedProfiles?: readonly IExtensionTerminalProfile[]) {
	const registry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
	let profileEnum;
	if (detectedProfiles) {
		profileEnum = createProfileSchemaEnums(detectedProfiles?.profiles, extensionContributedProfiles);
	}
	const oldDefaultProfilesConfiguration = defaultProfilesConfiguration;
	defaultProfilesConfiguration = {
		id: 'terminal',
		order: 100,
		title: localize('terminalIntegratedConfigurationTitle', "Integrated Terminal"),
		type: 'object',
		properties: {
			[TerminalSettingId.DefaultProfileLinux]: {
				restricted: true,
				markdownDescription: localize('terminal.integrated.defaultProfile.linux', "The default terminal profile on Linux."),
				type: ['string', 'null'],
				default: null,
				enum: detectedProfiles?.os === OperatingSystem.Linux ? profileEnum?.values : undefined,
				markdownEnumDescriptions: detectedProfiles?.os === OperatingSystem.Linux ? profileEnum?.markdownDescriptions : undefined
			},
			[TerminalSettingId.DefaultProfileMacOs]: {
				restricted: true,
				markdownDescription: localize('terminal.integrated.defaultProfile.osx', "The default terminal profile on macOS."),
				type: ['string', 'null'],
				default: null,
				enum: detectedProfiles?.os === OperatingSystem.Macintosh ? profileEnum?.values : undefined,
				markdownEnumDescriptions: detectedProfiles?.os === OperatingSystem.Macintosh ? profileEnum?.markdownDescriptions : undefined
			},
			[TerminalSettingId.DefaultProfileWindows]: {
				restricted: true,
				markdownDescription: localize('terminal.integrated.defaultProfile.windows', "The default terminal profile on Windows."),
				type: ['string', 'null'],
				default: null,
				enum: detectedProfiles?.os === OperatingSystem.Windows ? profileEnum?.values : undefined,
				markdownEnumDescriptions: detectedProfiles?.os === OperatingSystem.Windows ? profileEnum?.markdownDescriptions : undefined
			},
		}
	};
	registry.updateConfigurations({ add: [defaultProfilesConfiguration], remove: oldDefaultProfilesConfiguration ? [oldDefaultProfilesConfiguration] : [] });
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/terminalProcess.ts]---
Location: vscode-main/src/vs/platform/terminal/common/terminalProcess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UriComponents } from '../../../base/common/uri.js';
import { ISerializableEnvironmentVariableCollection, ISerializableEnvironmentVariableCollections } from './environmentVariable.js';
import { IFixedTerminalDimensions, IRawTerminalTabLayoutInfo, IReconnectionProperties, ITerminalEnvironment, ITerminalTabAction, ITerminalTabLayoutInfoById, TerminalIcon, TerminalType, TitleEventSource, WaitOnExitValue } from './terminal.js';

export interface ISingleTerminalConfiguration<T> {
	userValue: T | undefined;
	value: T | undefined;
	defaultValue: T | undefined;
}

export interface ICompleteTerminalConfiguration {
	'terminal.integrated.env.windows': ISingleTerminalConfiguration<ITerminalEnvironment>;
	'terminal.integrated.env.osx': ISingleTerminalConfiguration<ITerminalEnvironment>;
	'terminal.integrated.env.linux': ISingleTerminalConfiguration<ITerminalEnvironment>;
	'terminal.integrated.cwd': string;
	'terminal.integrated.detectLocale': 'auto' | 'off' | 'on';
}

export type ITerminalEnvironmentVariableCollections = [string, ISerializableEnvironmentVariableCollection][];

export interface IWorkspaceFolderData {
	uri: UriComponents;
	name: string;
	index: number;
}

export interface ISetTerminalLayoutInfoArgs {
	workspaceId: string;
	tabs: ITerminalTabLayoutInfoById[];
	background: number[] | null;
}

export interface IGetTerminalLayoutInfoArgs {
	workspaceId: string;
}

export interface IProcessDetails {
	id: number;
	pid: number;
	title: string;
	titleSource: TitleEventSource;
	cwd: string;
	workspaceId: string;
	workspaceName: string;
	isOrphan: boolean;
	icon: TerminalIcon | undefined;
	color: string | undefined;
	fixedDimensions: IFixedTerminalDimensions | undefined;
	environmentVariableCollections: ISerializableEnvironmentVariableCollections | undefined;
	reconnectionProperties?: IReconnectionProperties;
	waitOnExit?: WaitOnExitValue;
	hideFromUser?: boolean;
	isFeatureTerminal?: boolean;
	type?: TerminalType;
	hasChildProcesses: boolean;
	shellIntegrationNonce: string;
	tabActions?: ITerminalTabAction[];
}

export type ITerminalTabLayoutInfoDto = IRawTerminalTabLayoutInfo<IProcessDetails>;

export interface ReplayEntry {
	cols: number;
	rows: number;
	data: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/terminalProfiles.ts]---
Location: vscode-main/src/vs/platform/terminal/common/terminalProfiles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../base/common/codicons.js';
import { isUriComponents, URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IExtensionTerminalProfile, ITerminalProfile, TerminalIcon } from './terminal.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { isObject, isString, type SingleOrMany } from '../../../base/common/types.js';

export function createProfileSchemaEnums(detectedProfiles: ITerminalProfile[], extensionProfiles?: readonly IExtensionTerminalProfile[]): {
	values: (string | null)[] | undefined;
	markdownDescriptions: string[] | undefined;
} {
	const result: { name: string | null; description: string }[] = [{
		name: null,
		description: localize('terminalAutomaticProfile', 'Automatically detect the default')
	}];
	result.push(...detectedProfiles.map(e => {
		return {
			name: e.profileName,
			description: createProfileDescription(e)
		};
	}));
	if (extensionProfiles) {
		result.push(...extensionProfiles.map(extensionProfile => {
			return {
				name: extensionProfile.title,
				description: createExtensionProfileDescription(extensionProfile)
			};
		}));
	}
	return {
		values: result.map(e => e.name),
		markdownDescriptions: result.map(e => e.description)
	};
}

function createProfileDescription(profile: ITerminalProfile): string {
	let description = `$(${ThemeIcon.isThemeIcon(profile.icon) ? profile.icon.id : profile.icon ? profile.icon : Codicon.terminal.id}) ${profile.profileName}\n- path: ${profile.path}`;
	if (profile.args) {
		if (isString(profile.args)) {
			description += `\n- args: "${profile.args}"`;
		} else {
			description += `\n- args: [${profile.args.length === 0 ? '' : `'${profile.args.join(`','`)}'`}]`;
		}
	}
	if (profile.overrideName !== undefined) {
		description += `\n- overrideName: ${profile.overrideName}`;
	}
	if (profile.color) {
		description += `\n- color: ${profile.color}`;
	}
	if (profile.env) {
		description += `\n- env: ${JSON.stringify(profile.env)}`;
	}
	return description;
}

function createExtensionProfileDescription(profile: IExtensionTerminalProfile): string {
	const description = `$(${ThemeIcon.isThemeIcon(profile.icon) ? profile.icon.id : profile.icon ? profile.icon : Codicon.terminal.id}) ${profile.title}\n- extensionIdentifier: ${profile.extensionIdentifier}`;
	return description;
}


export function terminalProfileArgsMatch(args1: SingleOrMany<string> | undefined, args2: SingleOrMany<string> | undefined): boolean {
	if (!args1 && !args2) {
		return true;
	} else if (isString(args1) && isString(args2)) {
		return args1 === args2;
	} else if (Array.isArray(args1) && Array.isArray(args2)) {
		if (args1.length !== args2.length) {
			return false;
		}
		for (let i = 0; i < args1.length; i++) {
			if (args1[i] !== args2[i]) {
				return false;
			}
		}
		return true;
	}
	return false;
}

export function terminalIconsEqual(a?: TerminalIcon, b?: TerminalIcon): boolean {
	if (!a && !b) {
		return true;
	} else if (!a || !b) {
		return false;
	}

	if (ThemeIcon.isThemeIcon(a) && ThemeIcon.isThemeIcon(b)) {
		return a.id === b.id && a.color === b.color;
	}
	if (
		isObject(a) && !URI.isUri(a) && !ThemeIcon.isThemeIcon(a) &&
		isObject(b) && !URI.isUri(b) && !ThemeIcon.isThemeIcon(b)
	) {
		const castedA = (a as { light: unknown; dark: unknown });
		const castedB = (b as { light: unknown; dark: unknown });
		if ((URI.isUri(castedA.light) || isUriComponents(castedA.light)) && (URI.isUri(castedA.dark) || isUriComponents(castedA.dark))
			&& (URI.isUri(castedB.light) || isUriComponents(castedB.light)) && (URI.isUri(castedB.dark) || isUriComponents(castedB.dark))) {
			return castedA.light.path === castedB.light.path && castedA.dark.path === castedB.dark.path;
		}
	}
	if ((URI.isUri(a) && URI.isUri(b)) || (isUriComponents(a) || isUriComponents(b))) {
		const castedA = (a as { scheme: unknown; path: unknown });
		const castedB = (b as { scheme: unknown; path: unknown });
		return castedA.path === castedB.path && castedA.scheme === castedB.scheme;
	}

	return false;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/terminalRecorder.ts]---
Location: vscode-main/src/vs/platform/terminal/common/terminalRecorder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPtyHostProcessReplayEvent } from './capabilities/capabilities.js';
import { ReplayEntry } from './terminalProcess.js';

const enum Constants {
	MaxRecorderDataSize = 10 * 1024 * 1024 // 10MB
}

interface RecorderEntry {
	cols: number;
	rows: number;
	data: string[];
}

export interface IRemoteTerminalProcessReplayEvent {
	events: ReplayEntry[];
}

export class TerminalRecorder {

	private _entries: RecorderEntry[];
	private _totalDataLength: number = 0;

	constructor(cols: number, rows: number) {
		this._entries = [{ cols, rows, data: [] }];
	}

	handleResize(cols: number, rows: number): void {
		if (this._entries.length > 0) {
			const lastEntry = this._entries[this._entries.length - 1];
			if (lastEntry.data.length === 0) {
				// last entry is just a resize, so just remove it
				this._entries.pop();
			}
		}

		if (this._entries.length > 0) {
			const lastEntry = this._entries[this._entries.length - 1];
			if (lastEntry.cols === cols && lastEntry.rows === rows) {
				// nothing changed
				return;
			}
			if (lastEntry.cols === 0 && lastEntry.rows === 0) {
				// we finally received a good size!
				lastEntry.cols = cols;
				lastEntry.rows = rows;
				return;
			}
		}

		this._entries.push({ cols, rows, data: [] });
	}

	handleData(data: string): void {
		const lastEntry = this._entries[this._entries.length - 1];
		lastEntry.data.push(data);

		this._totalDataLength += data.length;
		while (this._totalDataLength > Constants.MaxRecorderDataSize) {
			const firstEntry = this._entries[0];
			const remainingToDelete = this._totalDataLength - Constants.MaxRecorderDataSize;
			if (remainingToDelete >= firstEntry.data[0].length) {
				// the first data piece must be deleted
				this._totalDataLength -= firstEntry.data[0].length;
				firstEntry.data.shift();
				if (firstEntry.data.length === 0) {
					// the first entry must be deleted
					this._entries.shift();
				}
			} else {
				// the first data piece must be partially deleted
				firstEntry.data[0] = firstEntry.data[0].substr(remainingToDelete);
				this._totalDataLength -= remainingToDelete;
			}
		}
	}

	generateReplayEventSync(): IPtyHostProcessReplayEvent {
		// normalize entries to one element per data array
		this._entries.forEach((entry) => {
			if (entry.data.length > 0) {
				entry.data = [entry.data.join('')];
			}
		});
		return {
			events: this._entries.map(entry => ({ cols: entry.cols, rows: entry.rows, data: entry.data[0] ?? '' })),
			// No command restoration is needed when relaunching terminals
			commands: {
				isWindowsPty: false,
				hasRichCommandDetection: false,
				commands: [],
				promptInputModel: undefined,
			}
		};
	}

	async generateReplayEvent(): Promise<IPtyHostProcessReplayEvent> {
		return this.generateReplayEventSync();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/terminalStrings.ts]---
Location: vscode-main/src/vs/platform/terminal/common/terminalStrings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ITerminalFormatMessageOptions {
	/**
	 * Whether to exclude the new line at the start of the message. Defaults to false.
	 */
	excludeLeadingNewLine?: boolean;
	/**
	 * Whether to use "loud" formatting, this is for more important messages where the it's
	 * desirable to visually break the buffer up. Defaults to false.
	 */
	loudFormatting?: boolean;
}

/**
 * Formats a message from the product to be written to the terminal.
 */
export function formatMessageForTerminal(message: string, options: ITerminalFormatMessageOptions = {}): string {
	let result = '';
	if (!options.excludeLeadingNewLine) {
		result += '\r\n';
	}
	result += '\x1b[0m\x1b[7m * ';
	if (options.loudFormatting) {
		result += '\x1b[0;104m';
	} else {
		result += '\x1b[0m';
	}
	result += ` ${message} \x1b[0m\n\r`;
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/bufferMarkCapability.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/bufferMarkCapability.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IBufferMarkCapability, TerminalCapability, IMarkProperties } from './capabilities.js';
import type { IMarker, Terminal } from '@xterm/headless';

/**
 * Manages "marks" in the buffer which are lines that are tracked when lines are added to or removed
 * from the buffer.
 */
export class BufferMarkCapability extends Disposable implements IBufferMarkCapability {

	readonly type = TerminalCapability.BufferMarkDetection;

	private _idToMarkerMap: Map<string, IMarker> = new Map();
	private _anonymousMarkers: Map<number, IMarker> = new Map();

	private readonly _onMarkAdded = this._register(new Emitter<IMarkProperties>());
	readonly onMarkAdded = this._onMarkAdded.event;

	constructor(
		private readonly _terminal: Terminal
	) {
		super();
	}

	*markers(): IterableIterator<IMarker> {
		for (const m of this._idToMarkerMap.values()) {
			yield m;
		}
		for (const m of this._anonymousMarkers.values()) {
			yield m;
		}
	}

	addMark(properties?: IMarkProperties): void {
		const marker = properties?.marker || this._terminal.registerMarker();
		const id = properties?.id;
		if (!marker) {
			return;
		}
		if (id) {
			this._idToMarkerMap.set(id, marker);
			marker.onDispose(() => this._idToMarkerMap.delete(id));
		} else {
			this._anonymousMarkers.set(marker.id, marker);
			marker.onDispose(() => this._anonymousMarkers.delete(marker.id));
		}
		this._onMarkAdded.fire({ marker, id, hidden: properties?.hidden, hoverMessage: properties?.hoverMessage });
	}

	getMark(id: string): IMarker | undefined {
		return this._idToMarkerMap.get(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/terminal/common/capabilities/capabilities.ts]---
Location: vscode-main/src/vs/platform/terminal/common/capabilities/capabilities.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import type { IPromptInputModel, ISerializedPromptInputModel } from './commandDetection/promptInputModel.js';
import { ICurrentPartialCommand } from './commandDetection/terminalCommand.js';
import { ITerminalOutputMatch, ITerminalOutputMatcher } from '../terminal.js';
import { ReplayEntry } from '../terminalProcess.js';
import type { IMarker } from '@xterm/headless';

/**
 * Primarily driven by the shell integration feature, a terminal capability is the mechanism for
 * progressively enhancing various features that may not be supported in all terminals/shells.
 */
export const enum TerminalCapability {
	/**
	 * The terminal can reliably detect the current working directory as soon as the change happens
	 * within the buffer.
	 */
	CwdDetection,
	/**
	 * The terminal can reliably detect the current working directory when requested.
	 */
	NaiveCwdDetection,
	/**
	 * The terminal can reliably identify prompts, commands and command outputs within the buffer.
	 */
	CommandDetection,
	/**
	 * The terminal can often identify prompts, commands and command outputs within the buffer. It
	 * may not be so good at remembering the position of commands that ran in the past. This state
	 * may be enabled when something goes wrong or when using conpty for example.
	 */
	PartialCommandDetection,

	/**
	 * Manages buffer marks that can be used for terminal navigation. The source of
	 * the request (task, debug, etc) provides an ID, optional marker, hoverMessage, and hidden property. When
	 * hidden is not provided, a generic decoration is added to the buffer and overview ruler.
	 */
	BufferMarkDetection,

	/**
	 * The terminal can detect the latest environment of user's current shell.
	 */
	ShellEnvDetection,

	/**
	 * The terminal can detect the prompt type being used (e.g., p10k, posh-git).
	 */
	PromptTypeDetection,
}

/**
 * An object that keeps track of additional capabilities and their implementations for features that
 * are not available for all terminals.
 */
export interface ITerminalCapabilityStore {
	/**
	 * An iterable of all capabilities in the store.
	 */
	readonly items: IterableIterator<TerminalCapability>;

	/**
	 * Fired when a capability is added.
	 */
	readonly onDidAddCapability: Event<AnyTerminalCapabilityChangeEvent>;

	/**
	 * Fired when a capability is removed.
	*/
	readonly onDidRemoveCapability: Event<AnyTerminalCapabilityChangeEvent>;

	/**
	 * Fired when a capability if added or removed.
	 */
	readonly onDidChangeCapabilities: Event<void>;

	/** Fired when the command detection capability is added. */
	readonly onDidAddCommandDetectionCapability: Event<ICommandDetectionCapability>;
	/** Fired when the command detection capability is removed. */
	readonly onDidRemoveCommandDetectionCapability: Event<void>;
	/** Fired when the cwd detection capability is added. */
	readonly onDidAddCwdDetectionCapability: Event<ICwdDetectionCapability>;
	/** Fired when the cwd detection capability is removed. */
	readonly onDidRemoveCwdDetectionCapability: Event<void>;

	/**
	 * Create an event that's fired when a specific capability type is added. Use this over
	 * {@link onDidAddCapability} when the generic type needs to be retained.
	 * @param type The capability type.
	 */
	createOnDidAddCapabilityOfTypeEvent<T extends TerminalCapability>(type: T): Event<ITerminalCapabilityImplMap[T]>;

	/**
	 * Create an event that's fired when a specific capability type is removed. Use this over
	 * {@link onDidRemoveCapability} when the generic type needs to be retained.
	 * @param type The capability type.
	 */
	createOnDidRemoveCapabilityOfTypeEvent<T extends TerminalCapability>(type: T): Event<ITerminalCapabilityImplMap[T]>;

	/**
	 * Gets whether the capability exists in the store.
	 */
	has(capability: TerminalCapability): boolean;

	/**
	 * Gets the implementation of a capability if it has been added to the store.
	 */
	get<T extends TerminalCapability>(capability: T): ITerminalCapabilityImplMap[T] | undefined;
}

export interface TerminalCapabilityChangeEvent<T extends TerminalCapability> {
	id: T;
	capability: ITerminalCapabilityImplMap[T];
}

export type AnyTerminalCapabilityChangeEvent = {
	[K in TerminalCapability]: TerminalCapabilityChangeEvent<K>
}[TerminalCapability];

/**
 * Maps capability types to their implementation, enabling strongly typed fetching of
 * implementations.
 */
export interface ITerminalCapabilityImplMap {
	[TerminalCapability.CwdDetection]: ICwdDetectionCapability;
	[TerminalCapability.CommandDetection]: ICommandDetectionCapability;
	[TerminalCapability.NaiveCwdDetection]: INaiveCwdDetectionCapability;
	[TerminalCapability.PartialCommandDetection]: IPartialCommandDetectionCapability;
	[TerminalCapability.BufferMarkDetection]: IBufferMarkCapability;
	[TerminalCapability.ShellEnvDetection]: IShellEnvDetectionCapability;
	[TerminalCapability.PromptTypeDetection]: IPromptTypeDetectionCapability;
}

export interface ICwdDetectionCapability {
	readonly type: TerminalCapability.CwdDetection;
	readonly onDidChangeCwd: Event<string>;
	readonly cwds: string[];
	getCwd(): string;
	updateCwd(cwd: string): void;
}

export interface IShellEnvDetectionCapability {
	readonly type: TerminalCapability.ShellEnvDetection;
	readonly onDidChangeEnv: Event<TerminalShellIntegrationEnvironment>;
	get env(): TerminalShellIntegrationEnvironment;
	setEnvironment(envs: { [key: string]: string | undefined } | undefined, isTrusted: boolean): void;
	startEnvironmentSingleVar(clear: boolean, isTrusted: boolean): void;
	setEnvironmentSingleVar(key: string, value: string | undefined, isTrusted: boolean): void;
	deleteEnvironmentSingleVar(key: string, value: string | undefined, isTrusted: boolean): void;
	endEnvironmentSingleVar(isTrusted: boolean): void;
}

export interface IPromptTypeDetectionCapability {
	readonly type: TerminalCapability.PromptTypeDetection;
	readonly promptType: string | undefined;
	readonly onPromptTypeChanged: Event<string | undefined>;
	setPromptType(value: string): void;
}

export interface TerminalShellIntegrationEnvironment {
	/**
	 * The dictionary of environment variables.
	 */
	value: { [key: string]: string | undefined } | undefined;

	/**
	 * Whether the environment came from a trusted source and is therefore safe to use its
	 * values in a manner that could lead to execution of arbitrary code. If this value is
	 * `false`, {@link value} should either not be used for something that could lead to arbitrary
	 * code execution, or the user should be warned beforehand.
	 *
	 * This is `true` only when the environment was reported explicitly and it used a nonce for
	 * verification.
	 */
	isTrusted: boolean;
}

export interface TerminalShellIntegration {
	/**
	 * The environment of the shell process. This is undefined if the shell integration script
	 * does not send the environment.
	 */
	readonly env: TerminalShellIntegrationEnvironment;
}

export const enum CommandInvalidationReason {
	Windows = 'windows',
	NoProblemsReported = 'noProblemsReported'
}

export interface ICommandInvalidationRequest {
	reason: CommandInvalidationReason;
}

export interface IBufferMarkCapability {
	type: TerminalCapability.BufferMarkDetection;
	markers(): IterableIterator<IMarker>;
	readonly onMarkAdded: Event<IMarkProperties>;
	addMark(properties?: IMarkProperties): void;
	getMark(id: string): IMarker | undefined;
}

export interface ICommandDetectionCapability {
	readonly type: TerminalCapability.CommandDetection;
	readonly promptInputModel: IPromptInputModel;
	readonly commands: readonly ITerminalCommand[];
	/** The command currently being executed, otherwise undefined. */
	readonly executingCommand: string | undefined;
	readonly executingCommandObject: ITerminalCommand | undefined;
	readonly executingCommandConfidence: 'low' | 'medium' | 'high' | undefined;
	/** The current cwd at the cursor's position. */
	readonly cwd: string | undefined;
	readonly hasRichCommandDetection: boolean;
	readonly currentCommand: ICurrentPartialCommand | undefined;
	readonly onCommandStarted: Event<ITerminalCommand>;
	readonly onCommandFinished: Event<ITerminalCommand>;
	readonly onCommandExecuted: Event<ITerminalCommand>;
	readonly onCommandInvalidated: Event<ITerminalCommand[]>;
	readonly onCurrentCommandInvalidated: Event<ICommandInvalidationRequest>;
	readonly onSetRichCommandDetection: Event<boolean>;
	setContinuationPrompt(value: string): void;
	setPromptTerminator(value: string, lastPromptLine: string): void;
	setCwd(value: string): void;
	setIsWindowsPty(value: boolean): void;
	setIsCommandStorageDisabled(): void;
	/**
	 * Gets the working directory for a line, this will return undefined if it's unknown in which
	 * case the terminal's initial cwd should be used.
	 */
	getCwdForLine(line: number): string | undefined;
	getCommandForLine(line: number): ITerminalCommand | ICurrentPartialCommand | undefined;
	handlePromptStart(options?: IHandleCommandOptions): void;
	handleContinuationStart(): void;
	handleContinuationEnd(): void;
	handleRightPromptStart(): void;
	handleRightPromptEnd(): void;
	handleCommandStart(options?: IHandleCommandOptions): void;
	handleCommandExecuted(options?: IHandleCommandOptions): void;
	handleCommandFinished(exitCode?: number, options?: IHandleCommandOptions): void;
	setHasRichCommandDetection(value: boolean): void;
	/**
	 * Set the command line explicitly.
	 * @param commandLine The command line being set.
	 * @param isTrusted Whether the command line is trusted via the optional nonce is send in order
	 * to prevent spoofing. This is important as some interactions do not require verification
	 * before re-running a command. Note that this is optional according to the spec, it should
	 * always be present when running the _builtin_ SI scripts.
	 */
	setCommandLine(commandLine: string, isTrusted: boolean): void;
	/**
	 * Sets the command ID to use for the next command that starts.
	 * This allows pre-assigning an ID before the shell sends the command start sequence,
	 * which is useful for linking commands across renderer and ptyHost.
	 */
	setNextCommandId(command: string, commandId: string): void;
	serialize(): ISerializedCommandDetectionCapability;
	deserialize(serialized: ISerializedCommandDetectionCapability): void;
}

export interface IHandleCommandOptions {
	/**
	 * Whether to allow an empty command to be registered. This should be used to support certain
	 * shell integration scripts/features where tracking the command line may not be possible.
	 */
	ignoreCommandLine?: boolean;
	/**
	 * The marker to use
	 */
	marker?: IMarker;

	/**
	 * Properties for the mark
	 */
	markProperties?: IMarkProperties;
}

export interface INaiveCwdDetectionCapability {
	readonly type: TerminalCapability.NaiveCwdDetection;
	readonly onDidChangeCwd: Event<string>;
	getCwd(): Promise<string>;
}

export interface IPartialCommandDetectionCapability {
	readonly type: TerminalCapability.PartialCommandDetection;
	readonly commands: readonly IMarker[];
	readonly onCommandFinished: Event<IMarker>;
}

interface IBaseTerminalCommand {
	// Mandatory
	command: string;
	commandLineConfidence: 'low' | 'medium' | 'high';
	isTrusted: boolean;
	timestamp: number;
	duration: number;
	id: string | undefined;

	// Optional serializable
	cwd: string | undefined;
	exitCode: number | undefined;
	commandStartLineContent: string | undefined;
	markProperties: IMarkProperties | undefined;
	executedX: number | undefined;
	startX: number | undefined;
}

export interface ITerminalCommand extends IBaseTerminalCommand {
	// Optional non-serializable
	readonly promptStartMarker?: IMarker;
	readonly marker?: IMarker;
	endMarker?: IMarker;
	readonly executedMarker?: IMarker;
	readonly aliases?: string[][];
	readonly wasReplayed?: boolean;

	extractCommandLine(): string;
	getOutput(): string | undefined;
	getOutputMatch(outputMatcher: ITerminalOutputMatcher): ITerminalOutputMatch | undefined;
	hasOutput(): boolean;
	getPromptRowCount(): number;
	getCommandRowCount(): number;
}

export interface ISerializedTerminalCommand extends IBaseTerminalCommand {
	// Optional non-serializable converted for serialization
	startLine: number | undefined;
	promptStartLine: number | undefined;
	endLine: number | undefined;
	executedLine: number | undefined;
}

/**
 * A clone of the IMarker from xterm which cannot be imported from common
 */
// export interface IMarker {
// 	readonly id: number;
// 	readonly isDisposed: boolean;
// 	readonly line: number;
// 	dispose(): void;
// 	onDispose: {
// 		(listener: () => any): { dispose(): void };
// 	};
// }

export interface IMarkProperties {
	hoverMessage?: string;
	disableCommandStorage?: boolean;
	hidden?: boolean;
	marker?: IMarker;
	id?: string;
}
export interface ISerializedCommandDetectionCapability {
	isWindowsPty: boolean;
	hasRichCommandDetection: boolean;
	commands: ISerializedTerminalCommand[];
	promptInputModel: ISerializedPromptInputModel | undefined;
}
export interface IPtyHostProcessReplayEvent {
	events: ReplayEntry[];
	commands: ISerializedCommandDetectionCapability;
}
```

--------------------------------------------------------------------------------

````

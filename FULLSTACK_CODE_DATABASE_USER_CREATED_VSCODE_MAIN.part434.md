---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 434
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 434 of 552)

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

---[FILE: src/vs/workbench/contrib/output/test/browser/outputLinkProvider.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/output/test/browser/outputLinkProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { isMacintosh, isLinux, isWindows } from '../../../../../base/common/platform.js';
import { OutputLinkComputer } from '../../common/outputLinkComputer.js';
import { TestContextService } from '../../../../test/common/workbenchTestServices.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('OutputLinkProvider', () => {

	function toOSPath(p: string): string {
		if (isMacintosh || isLinux) {
			return p.replace(/\\/g, '/');
		}

		return p;
	}

	test('OutputLinkProvider - Link detection', function () {
		const rootFolder = isWindows ? URI.file('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala') :
			URI.file('C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala');

		const patterns = OutputLinkComputer.createPatterns(rootFolder);

		const contextService = new TestContextService();

		let line = toOSPath('Foo bar');
		let result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 0);

		// Example: at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts
		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString());
		assert.strictEqual(result[0].range.startColumn, 5);
		assert.strictEqual(result[0].range.endColumn, 84);

		// Example: at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts:336
		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts:336 in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#336');
		assert.strictEqual(result[0].range.startColumn, 5);
		assert.strictEqual(result[0].range.endColumn, 88);

		// Example: at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts:336:9
		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts:336:9 in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#336,9');
		assert.strictEqual(result[0].range.startColumn, 5);
		assert.strictEqual(result[0].range.endColumn, 90);

		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts:336:9 in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#336,9');
		assert.strictEqual(result[0].range.startColumn, 5);
		assert.strictEqual(result[0].range.endColumn, 90);

		// Example: at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts>dir
		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts>dir in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString());
		assert.strictEqual(result[0].range.startColumn, 5);
		assert.strictEqual(result[0].range.endColumn, 84);

		// Example: at [C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts:336:9]
		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts:336:9] in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#336,9');
		assert.strictEqual(result[0].range.startColumn, 5);
		assert.strictEqual(result[0].range.endColumn, 90);

		// Example: at [C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts]
		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts] in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts]').toString());

		// Example: C:\Users\someone\AppData\Local\Temp\_monacodata_9888\workspaces\express\server.js on line 8
		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts on line 8');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#8');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 90);

		// Example: C:\Users\someone\AppData\Local\Temp\_monacodata_9888\workspaces\express\server.js on line 8, column 13
		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts on line 8, column 13');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#8,13');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 101);

		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts on LINE 8, COLUMN 13');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#8,13');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 101);

		// Example: C:\Users\someone\AppData\Local\Temp\_monacodata_9888\workspaces\express\server.js:line 8
		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts:line 8');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#8');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 87);

		// Example: at File.put (C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Game.ts)
		line = toOSPath(' at File.put (C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Game.ts)');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString());
		assert.strictEqual(result[0].range.startColumn, 15);
		assert.strictEqual(result[0].range.endColumn, 94);

		// Example: at File.put (C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Game.ts:278)
		line = toOSPath(' at File.put (C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Game.ts:278)');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#278');
		assert.strictEqual(result[0].range.startColumn, 15);
		assert.strictEqual(result[0].range.endColumn, 98);

		// Example: at File.put (C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Game.ts:278:34)
		line = toOSPath(' at File.put (C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Game.ts:278:34)');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#278,34');
		assert.strictEqual(result[0].range.startColumn, 15);
		assert.strictEqual(result[0].range.endColumn, 101);

		line = toOSPath(' at File.put (C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Game.ts:278:34)');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString() + '#278,34');
		assert.strictEqual(result[0].range.startColumn, 15);
		assert.strictEqual(result[0].range.endColumn, 101);

		// Example: C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Features.ts(45): error
		line = toOSPath('C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/lib/something/Features.ts(45): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 102);

		// Example: C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Features.ts (45,18): error
		line = toOSPath('C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/lib/something/Features.ts (45): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 103);

		// Example: C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Features.ts(45,18): error
		line = toOSPath('C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/lib/something/Features.ts(45,18): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45,18');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 105);

		line = toOSPath('C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/lib/something/Features.ts(45,18): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45,18');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 105);

		// Example: C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Features.ts (45,18): error
		line = toOSPath('C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/lib/something/Features.ts (45,18): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45,18');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 106);

		line = toOSPath('C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/lib/something/Features.ts (45,18): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45,18');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 106);

		// Example: C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Features.ts(45): error
		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\lib\\something\\Features.ts(45): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 102);

		// Example: C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Features.ts (45,18): error
		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\lib\\something\\Features.ts (45): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 103);

		// Example: C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Features.ts(45,18): error
		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\lib\\something\\Features.ts(45,18): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45,18');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 105);

		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\lib\\something\\Features.ts(45,18): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45,18');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 105);

		// Example: C:/Users/someone/AppData/Local/Temp/_monacodata_9888/workspaces/mankala/Features.ts (45,18): error
		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\lib\\something\\Features.ts (45,18): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45,18');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 106);

		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\lib\\something\\Features.ts (45,18): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features.ts').toString() + '#45,18');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 106);

		// Example: C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\lib\\something\\Features Special.ts (45,18): error.
		line = toOSPath('C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\lib\\something\\Features Special.ts (45,18): error');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/lib/something/Features Special.ts').toString() + '#45,18');
		assert.strictEqual(result[0].range.startColumn, 1);
		assert.strictEqual(result[0].range.endColumn, 114);

		// Example: at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts.
		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts. in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString());
		assert.strictEqual(result[0].range.startColumn, 5);
		assert.strictEqual(result[0].range.endColumn, 84);

		// Example: at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game
		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);

		// Example: at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game\\
		line = toOSPath(' at C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game\\ in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);

		// Example: at "C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts"
		line = toOSPath(' at "C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts" in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString());
		assert.strictEqual(result[0].range.startColumn, 6);
		assert.strictEqual(result[0].range.endColumn, 85);

		// Example: at 'C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts'
		line = toOSPath(' at \'C:\\Users\\someone\\AppData\\Local\\Temp\\_monacodata_9888\\workspaces\\mankala\\Game.ts\' in');
		result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].url, contextService.toResource('/Game.ts').toString());
		assert.strictEqual(result[0].range.startColumn, 6);
		assert.strictEqual(result[0].range.endColumn, 85);
	});

	test('OutputLinkProvider - #106847', function () {
		const rootFolder = isWindows ? URI.file('C:\\Users\\username\\Desktop\\test-ts') :
			URI.file('C:/Users/username/Desktop');

		const patterns = OutputLinkComputer.createPatterns(rootFolder);

		const contextService = new TestContextService();

		const line = toOSPath('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa C:\\Users\\username\\Desktop\\test-ts\\prj.conf C:\\Users\\username\\Desktop\\test-ts\\prj.conf C:\\Users\\username\\Desktop\\test-ts\\prj.conf');
		const result = OutputLinkComputer.detectLinks(line, 1, patterns, contextService);
		assert.strictEqual(result.length, 3);

		for (const res of result) {
			assert.ok(res.range.startColumn > 0 && res.range.endColumn > 0);
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/performance/browser/inputLatencyContrib.ts]---
Location: vscode-main/src/vs/workbench/contrib/performance/browser/inputLatencyContrib.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { inputLatency } from '../../../../base/browser/performance.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

export class InputLatencyContrib extends Disposable implements IWorkbenchContribution {
	private readonly _listener = this._register(new MutableDisposable());
	private readonly _scheduler: RunOnceScheduler;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IEditorService private readonly _editorService: IEditorService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService
	) {
		super();

		// The current sampling strategy is when the active editor changes, start sampling and
		// report the results after 60 seconds. It's done this way as we don't want to sample
		// everything, just somewhat randomly, and using an interval would utilize CPU when the
		// application is inactive.
		this._scheduler = this._register(new RunOnceScheduler(() => {
			this._logSamples();
			this._setupListener();
		}, 60000));


		// Only log 1% of users selected randomly to reduce the volume of data, always report if GPU
		// acceleration is enabled as it's opt-in
		if (Math.random() <= 0.01 || this._configurationService.getValue('editor.experimentalGpuAcceleration') === 'on') {
			this._setupListener();
		}

	}

	private _setupListener(): void {
		this._listener.value = Event.once(this._editorService.onDidActiveEditorChange)(() => this._scheduler.schedule());
	}

	private _logSamples(): void {
		const measurements = inputLatency.getAndClearMeasurements();
		if (!measurements) {
			return;
		}

		type InputLatencyStatisticFragment = {
			owner: 'tyriar';
			comment: 'Represents a set of statistics collected about input latencies';
			average: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The average time it took to execute.' };
			max: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The maximum time it took to execute.' };
			min: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The minimum time it took to execute.' };
		};

		type PerformanceInputLatencyClassification = {
			owner: 'tyriar';
			comment: 'This is a set of samples of the time (in milliseconds) that various events took when typing in the editor';
			keydown: InputLatencyStatisticFragment;
			input: InputLatencyStatisticFragment;
			render: InputLatencyStatisticFragment;
			total: InputLatencyStatisticFragment;
			sampleCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of samples measured.' };
			gpuAcceleration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Whether GPU acceleration was enabled at the time the event was reported.' };
		};

		type PerformanceInputLatencyEvent = inputLatency.IInputLatencyMeasurements & {
			gpuAcceleration: boolean;
		};

		this._telemetryService.publicLog2<PerformanceInputLatencyEvent, PerformanceInputLatencyClassification>('performance.inputLatency', {
			keydown: measurements.keydown,
			input: measurements.input,
			render: measurements.render,
			total: measurements.total,
			sampleCount: measurements.sampleCount,
			gpuAcceleration: this._configurationService.getValue('editor.experimentalGpuAcceleration') === 'on'
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/performance/browser/performance.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/performance/browser/performance.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../nls.js';
import { registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Extensions, IWorkbenchContributionsRegistry, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { EditorExtensions, IEditorSerializer, IEditorFactoryRegistry } from '../../../common/editor.js';
import { PerfviewContrib, PerfviewInput } from './perfviewEditor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { InstantiationService, Trace } from '../../../../platform/instantiation/common/instantiationService.js';
import { EventProfiling } from '../../../../base/common/event.js';
import { InputLatencyContrib } from './inputLatencyContrib.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { GCBasedDisposableTracker, setDisposableTracker } from '../../../../base/common/lifecycle.js';

// -- startup performance view

registerWorkbenchContribution2(
	PerfviewContrib.ID,
	PerfviewContrib,
	{ lazy: true }
);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(
	PerfviewInput.Id,
	class implements IEditorSerializer {
		canSerialize(): boolean {
			return true;
		}
		serialize(): string {
			return '';
		}
		deserialize(instantiationService: IInstantiationService): PerfviewInput {
			return instantiationService.createInstance(PerfviewInput);
		}
	}
);


registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'perfview.show',
			title: localize2('show.label', 'Startup Performance'),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		const contrib = PerfviewContrib.get();
		return editorService.openEditor(contrib.getEditorInput(), { pinned: true });
	}
});


registerAction2(class PrintServiceCycles extends Action2 {

	constructor() {
		super({
			id: 'perf.insta.printAsyncCycles',
			title: localize2('cycles', 'Print Service Cycles'),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor) {
		const instaService = accessor.get(IInstantiationService);
		if (instaService instanceof InstantiationService) {
			const cycle = instaService._globalGraph?.findCycleSlow();
			if (cycle) {
				console.warn(`CYCLE`, cycle);
			} else {
				console.warn(`YEAH, no more cycles`);
			}
		}
	}
});

registerAction2(class PrintServiceTraces extends Action2 {

	constructor() {
		super({
			id: 'perf.insta.printTraces',
			title: localize2('insta.trace', 'Print Service Traces'),
			category: Categories.Developer,
			f1: true
		});
	}

	run() {
		if (Trace.all.size === 0) {
			console.log('Enable via `instantiationService.ts#_enableAllTracing`');
			return;
		}

		for (const item of Trace.all) {
			console.log(item);
		}
	}
});


registerAction2(class PrintEventProfiling extends Action2 {

	constructor() {
		super({
			id: 'perf.event.profiling',
			title: localize2('emitter', 'Print Emitter Profiles'),
			category: Categories.Developer,
			f1: true
		});
	}

	run(): void {
		if (EventProfiling.all.size === 0) {
			console.log('USE `EmitterOptions._profName` to enable profiling');
			return;
		}
		for (const item of EventProfiling.all) {
			console.log(`${item.name}: ${item.invocationCount} invocations COST ${item.elapsedOverall}ms, ${item.listenerCount} listeners, avg cost is ${item.durations.reduce((a, b) => a + b, 0) / item.durations.length}ms`);
		}
	}
});

// -- input latency

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(
	InputLatencyContrib,
	LifecyclePhase.Eventually
);


// -- track leaking disposables, those that get GC'ed before having been disposed


class DisposableTracking {
	static readonly Id = 'perf.disposableTracking';
	constructor(@IEnvironmentService envService: IEnvironmentService) {
		if (!envService.isBuilt && !envService.extensionTestsLocationURI) {
			setDisposableTracker(new GCBasedDisposableTracker());
		}
	}
}

registerWorkbenchContribution2(DisposableTracking.Id, DisposableTracking, WorkbenchPhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/performance/browser/performance.web.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/performance/browser/performance.web.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { BrowserResourcePerformanceMarks, BrowserStartupTimings } from './startupTimings.js';

// -- startup timings

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(
	BrowserResourcePerformanceMarks,
	LifecyclePhase.Eventually
);

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(
	BrowserStartupTimings,
	LifecyclePhase.Eventually
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/performance/browser/perfviewEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/performance/browser/perfviewEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { TextResourceEditorInput } from '../../../common/editor/textResourceEditorInput.js';
import { ITextModelService, ITextModelContentProvider } from '../../../../editor/common/services/resolverService.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ILifecycleService, LifecyclePhase, StartupKindToString } from '../../../services/lifecycle/common/lifecycle.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITimerService } from '../../../services/timer/browser/timerService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { writeTransientState } from '../../codeEditor/browser/toggleWordWrap.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ByteSize, IFileService } from '../../../../platform/files/common/files.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { ITerminalService } from '../../terminal/browser/terminal.js';
import * as perf from '../../../../base/common/performance.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions, getWorkbenchContribution } from '../../../common/contributions.js';
import { ICustomEditorLabelService } from '../../../services/editor/common/customEditorLabelService.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';

export class PerfviewContrib {

	static get() {
		return getWorkbenchContribution<PerfviewContrib>(PerfviewContrib.ID);
	}

	static readonly ID = 'workbench.contrib.perfview';

	private readonly _inputUri = URI.from({ scheme: 'perf', path: 'Startup Performance' });
	private readonly _registration: IDisposable;

	constructor(
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@ITextModelService textModelResolverService: ITextModelService
	) {
		this._registration = textModelResolverService.registerTextModelContentProvider('perf', _instaService.createInstance(PerfModelContentProvider));
	}

	dispose(): void {
		this._registration.dispose();
	}

	getInputUri(): URI {
		return this._inputUri;
	}

	getEditorInput(): PerfviewInput {
		return this._instaService.createInstance(PerfviewInput);
	}
}

export class PerfviewInput extends TextResourceEditorInput {

	static readonly Id = 'PerfviewInput';

	override get typeId(): string {
		return PerfviewInput.Id;
	}

	constructor(
		@ITextModelService textModelResolverService: ITextModelService,
		@ITextFileService textFileService: ITextFileService,
		@IEditorService editorService: IEditorService,
		@IFileService fileService: IFileService,
		@ILabelService labelService: ILabelService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService
	) {
		super(
			PerfviewContrib.get().getInputUri(),
			localize('name', "Startup Performance"),
			undefined,
			undefined,
			undefined,
			textModelResolverService,
			textFileService,
			editorService,
			fileService,
			labelService,
			filesConfigurationService,
			textResourceConfigurationService,
			customEditorLabelService
		);
	}
}

class PerfModelContentProvider implements ITextModelContentProvider {

	private _model: ITextModel | undefined;
	private _modelDisposables: IDisposable[] = [];

	constructor(
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ICodeEditorService private readonly _editorService: ICodeEditorService,
		@ILifecycleService private readonly _lifecycleService: ILifecycleService,
		@ITimerService private readonly _timerService: ITimerService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IProductService private readonly _productService: IProductService,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
		@ITerminalService private readonly _terminalService: ITerminalService
	) { }

	provideTextContent(resource: URI): Promise<ITextModel> {

		if (!this._model || this._model.isDisposed()) {
			dispose(this._modelDisposables);
			const langId = this._languageService.createById('markdown');
			this._model = this._modelService.getModel(resource) || this._modelService.createModel('Loading...', langId, resource);

			this._modelDisposables.push(langId.onDidChange(e => {
				this._model?.setLanguage(e);
			}));
			this._modelDisposables.push(this._extensionService.onDidChangeExtensionsStatus(this._updateModel, this));

			writeTransientState(this._model, { wordWrapOverride: 'off' }, this._editorService);
		}
		this._updateModel();
		return Promise.resolve(this._model);
	}

	private _updateModel(): void {

		Promise.all([
			this._timerService.whenReady(),
			this._lifecycleService.when(LifecyclePhase.Eventually),
			this._extensionService.whenInstalledExtensionsRegistered(),
			// The terminal service never connects to the pty host on the web
			isWeb && !this._remoteAgentService.getConnection()?.remoteAuthority ? Promise.resolve() : this._terminalService.whenConnected
		]).then(() => {
			if (this._model && !this._model.isDisposed()) {

				const md = new MarkdownBuilder();
				this._addSummary(md);
				md.blank();
				this._addSummaryTable(md);
				md.blank();
				this._addExtensionsTable(md);
				md.blank();
				this._addPerfMarksTable('Terminal Stats', md, this._timerService.getPerformanceMarks().find(e => e[0] === 'renderer')?.[1].filter(e => e.name.startsWith('code/terminal/')));
				md.blank();
				this._addWorkbenchContributionsPerfMarksTable(md);
				md.blank();
				this._addRawPerfMarks(md);
				md.blank();
				this._addResourceTimingStats(md);

				this._model.setValue(md.value);
			}
		});

	}

	private _addSummary(md: MarkdownBuilder): void {
		const metrics = this._timerService.startupMetrics;
		md.heading(2, 'System Info');
		md.li(`${this._productService.nameShort}: ${this._productService.version} (${this._productService.commit || '0000000'})`);
		md.li(`OS: ${metrics.platform}(${metrics.release})`);
		if (metrics.cpus) {
			md.li(`CPUs: ${metrics.cpus.model}(${metrics.cpus.count} x ${metrics.cpus.speed})`);
		}
		if (typeof metrics.totalmem === 'number' && typeof metrics.freemem === 'number') {
			md.li(`Memory(System): ${(metrics.totalmem / (ByteSize.GB)).toFixed(2)} GB(${(metrics.freemem / (ByteSize.GB)).toFixed(2)}GB free)`);
		}
		if (metrics.meminfo) {
			md.li(`Memory(Process): ${(metrics.meminfo.workingSetSize / ByteSize.KB).toFixed(2)} MB working set(${(metrics.meminfo.privateBytes / ByteSize.KB).toFixed(2)}MB private, ${(metrics.meminfo.sharedBytes / ByteSize.KB).toFixed(2)}MB shared)`);
		}
		md.li(`VM(likelihood): ${metrics.isVMLikelyhood}%`);
		md.li(`Initial Startup: ${metrics.initialStartup}`);
		md.li(`Has ${metrics.windowCount - 1} other windows`);
		md.li(`Screen Reader Active: ${metrics.hasAccessibilitySupport}`);
		md.li(`Empty Workspace: ${metrics.emptyWorkbench}`);
	}

	private _addSummaryTable(md: MarkdownBuilder): void {

		const metrics = this._timerService.startupMetrics;
		const contribTimings = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).timings;

		const table: Array<Array<string | number | undefined>> = [];
		table.push(['import(main.js)', metrics.timers.ellapsedLoadMainBundle, '[main]', `initial startup: ${metrics.initialStartup}`]);
		table.push(['start => app.isReady', metrics.timers.ellapsedAppReady, '[main]', `initial startup: ${metrics.initialStartup}`]);
		table.push(['nls:start => nls:end', metrics.timers.ellapsedNlsGeneration, '[main]', `initial startup: ${metrics.initialStartup}`]);
		table.push(['run main.js', metrics.timers.ellapsedRunMainBundle, '[main]', `initial startup: ${metrics.initialStartup}`]);
		table.push(['start crash reporter', metrics.timers.ellapsedCrashReporter, '[main]', `initial startup: ${metrics.initialStartup}`]);
		table.push(['serve main IPC handle', metrics.timers.ellapsedMainServer, '[main]', `initial startup: ${metrics.initialStartup}`]);
		table.push(['create window', metrics.timers.ellapsedWindowCreate, '[main]', `initial startup: ${metrics.initialStartup}, ${metrics.initialStartup ? `state: ${metrics.timers.ellapsedWindowRestoreState}ms, widget: ${metrics.timers.ellapsedBrowserWindowCreate}ms, show: ${metrics.timers.ellapsedWindowMaximize}ms` : ''}`]);
		table.push(['app.isReady => window.loadUrl()', metrics.timers.ellapsedWindowLoad, '[main]', `initial startup: ${metrics.initialStartup}`]);
		table.push(['window.loadUrl() => begin to import(workbench.desktop.main.js)', metrics.timers.ellapsedWindowLoadToRequire, '[main->renderer]', StartupKindToString(metrics.windowKind)]);
		table.push(['import(workbench.desktop.main.js)', metrics.timers.ellapsedRequire, '[renderer]', `cached data: ${(metrics.didUseCachedData ? 'YES' : 'NO')}`]);
		table.push(['wait for window config', metrics.timers.ellapsedWaitForWindowConfig, '[renderer]', undefined]);
		table.push(['init storage (global & workspace)', metrics.timers.ellapsedStorageInit, '[renderer]', undefined]);
		table.push(['init workspace service', metrics.timers.ellapsedWorkspaceServiceInit, '[renderer]', undefined]);
		if (isWeb) {
			table.push(['init settings and global state from settings sync service', metrics.timers.ellapsedRequiredUserDataInit, '[renderer]', undefined]);
			table.push(['init keybindings, snippets & extensions from settings sync service', metrics.timers.ellapsedOtherUserDataInit, '[renderer]', undefined]);
		}
		table.push(['register extensions & spawn extension host', metrics.timers.ellapsedExtensions, '[renderer]', undefined]);
		table.push(['restore primary viewlet', metrics.timers.ellapsedViewletRestore, '[renderer]', metrics.viewletId]);
		table.push(['restore secondary viewlet', metrics.timers.ellapsedAuxiliaryViewletRestore, '[renderer]', metrics.auxiliaryViewletId]);
		table.push(['restore panel', metrics.timers.ellapsedPanelRestore, '[renderer]', metrics.panelId]);
		table.push(['restore & resolve visible editors', metrics.timers.ellapsedEditorRestore, '[renderer]', `${metrics.editorIds.length}: ${metrics.editorIds.join(', ')}`]);
		table.push(['create workbench contributions', metrics.timers.ellapsedWorkbenchContributions, '[renderer]', `${(contribTimings.get(LifecyclePhase.Starting)?.length ?? 0) + (contribTimings.get(LifecyclePhase.Starting)?.length ?? 0)} blocking startup`]);
		table.push(['overall workbench load', metrics.timers.ellapsedWorkbench, '[renderer]', undefined]);
		table.push(['workbench ready', metrics.ellapsed, '[main->renderer]', undefined]);
		table.push(['renderer ready', metrics.timers.ellapsedRenderer, '[renderer]', undefined]);
		table.push(['shared process connection ready', metrics.timers.ellapsedSharedProcesConnected, '[renderer->sharedprocess]', undefined]);
		table.push(['extensions registered', metrics.timers.ellapsedExtensionsReady, '[renderer]', undefined]);

		md.heading(2, 'Performance Marks');
		md.table(['What', 'Duration', 'Process', 'Info'], table);
	}

	private _addExtensionsTable(md: MarkdownBuilder): void {

		const eager: ({ toString(): string })[][] = [];
		const normal: ({ toString(): string })[][] = [];
		const extensionsStatus = this._extensionService.getExtensionsStatus();
		for (const id in extensionsStatus) {
			const { activationTimes: times } = extensionsStatus[id];
			if (!times) {
				continue;
			}
			if (times.activationReason.startup) {
				eager.push([id, times.activationReason.startup, times.codeLoadingTime, times.activateCallTime, times.activateResolvedTime, times.activationReason.activationEvent, times.activationReason.extensionId.value]);
			} else {
				normal.push([id, times.activationReason.startup, times.codeLoadingTime, times.activateCallTime, times.activateResolvedTime, times.activationReason.activationEvent, times.activationReason.extensionId.value]);
			}
		}

		const table = eager.concat(normal);
		if (table.length > 0) {
			md.heading(2, 'Extension Activation Stats');
			md.table(
				['Extension', 'Eager', 'Load Code', 'Call Activate', 'Finish Activate', 'Event', 'By'],
				table
			);
		}
	}

	private _addPerfMarksTable(name: string | undefined, md: MarkdownBuilder, marks: readonly perf.PerformanceMark[] | undefined): void {
		if (!marks) {
			return;
		}
		const table: Array<Array<string | number | undefined>> = [];
		let lastStartTime = -1;
		let total = 0;
		for (const { name, startTime } of marks) {
			const delta = lastStartTime !== -1 ? startTime - lastStartTime : 0;
			total += delta;
			table.push([name, Math.round(startTime), Math.round(delta), Math.round(total)]);
			lastStartTime = startTime;
		}
		if (name) {
			md.heading(2, name);
		}
		md.table(['Name', 'Timestamp', 'Delta', 'Total'], table);
	}

	private _addWorkbenchContributionsPerfMarksTable(md: MarkdownBuilder): void {
		md.heading(2, 'Workbench Contributions Blocking Restore');

		const timings = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).timings;
		md.li(`Total (LifecyclePhase.Starting): ${timings.get(LifecyclePhase.Starting)?.length} (${timings.get(LifecyclePhase.Starting)?.reduce((p, c) => p + c[1], 0)}ms)`);
		md.li(`Total (LifecyclePhase.Ready): ${timings.get(LifecyclePhase.Ready)?.length} (${timings.get(LifecyclePhase.Ready)?.reduce((p, c) => p + c[1], 0)}ms)`);
		md.blank();

		const marks = this._timerService.getPerformanceMarks().find(e => e[0] === 'renderer')?.[1].filter(e =>
			e.name.startsWith('code/willCreateWorkbenchContribution/1') ||
			e.name.startsWith('code/didCreateWorkbenchContribution/1') ||
			e.name.startsWith('code/willCreateWorkbenchContribution/2') ||
			e.name.startsWith('code/didCreateWorkbenchContribution/2')
		);
		this._addPerfMarksTable(undefined, md, marks);
	}

	private _addRawPerfMarks(md: MarkdownBuilder): void {

		for (const [source, marks] of this._timerService.getPerformanceMarks()) {
			md.heading(2, `Raw Perf Marks: ${source}`);
			md.value += '```\n';
			md.value += `Name\tTimestamp\tDelta\tTotal\n`;
			let lastStartTime = -1;
			let total = 0;
			for (const { name, startTime } of marks) {
				const delta = lastStartTime !== -1 ? startTime - lastStartTime : 0;
				total += delta;
				md.value += `${name}\t${startTime}\t${delta}\t${total}\n`;
				lastStartTime = startTime;
			}
			md.value += '```\n';
		}
	}

	private _addResourceTimingStats(md: MarkdownBuilder) {
		const stats = performance.getEntriesByType('resource').map(entry => {
			return [entry.name, entry.duration];
		});
		if (!stats.length) {
			return;
		}
		md.heading(2, 'Resource Timing Stats');
		md.table(['Name', 'Duration'], stats);
	}
}

class MarkdownBuilder {

	value: string = '';

	heading(level: number, value: string): this {
		this.value += `${'#'.repeat(level)} ${value}\n\n`;
		return this;
	}

	blank() {
		this.value += '\n';
		return this;
	}

	li(value: string) {
		this.value += `* ${value}\n`;
		return this;
	}

	table(header: string[], rows: Array<Array<{ toString(): string } | undefined>>) {
		this.value += this.toMarkdownTable(header, rows);
	}

	private toMarkdownTable(header: string[], rows: Array<Array<{ toString(): string } | undefined>>): string {
		let result = '';

		const lengths: number[] = [];
		header.forEach((cell, ci) => {
			lengths[ci] = cell.length;
		});
		rows.forEach(row => {
			row.forEach((cell, ci) => {
				if (typeof cell === 'undefined') {
					cell = row[ci] = '-';
				}
				const len = cell.toString().length;
				lengths[ci] = Math.max(len, lengths[ci]);
			});
		});

		// header
		header.forEach((cell, ci) => { result += `| ${cell + ' '.repeat(lengths[ci] - cell.toString().length)} `; });
		result += '|\n';
		header.forEach((_cell, ci) => { result += `| ${'-'.repeat(lengths[ci])} `; });
		result += '|\n';

		// cells
		rows.forEach(row => {
			row.forEach((cell, ci) => {
				if (typeof cell !== 'undefined') {
					result += `| ${cell + ' '.repeat(lengths[ci] - cell.toString().length)} `;
				}
			});
			result += '|\n';
		});

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/performance/browser/startupTimings.ts]---
Location: vscode-main/src/vs/workbench/contrib/performance/browser/startupTimings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ILifecycleService, StartupKind, StartupKindToString } from '../../../services/lifecycle/common/lifecycle.js';
import { IUpdateService } from '../../../../platform/update/common/update.js';
import * as files from '../../files/common/files.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { ITimerService } from '../../../services/timer/browser/timerService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { posix } from '../../../../base/common/path.js';
import { hash } from '../../../../base/common/hash.js';

export abstract class StartupTimings {

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@IPaneCompositePartService private readonly _paneCompositeService: IPaneCompositePartService,
		@ILifecycleService private readonly _lifecycleService: ILifecycleService,
		@IUpdateService private readonly _updateService: IUpdateService,
		@IWorkspaceTrustManagementService private readonly _workspaceTrustService: IWorkspaceTrustManagementService
	) {
	}

	protected async _isStandardStartup(): Promise<string | undefined> {
		// check for standard startup:
		// * new window (no reload)
		// * workspace is trusted
		// * just one window
		// * explorer viewlet visible
		// * one text editor (not multiple, not webview, welcome etc...)
		// * cached data present (not rejected, not created)
		if (this._lifecycleService.startupKind !== StartupKind.NewWindow) {
			return StartupKindToString(this._lifecycleService.startupKind);
		}
		if (!this._workspaceTrustService.isWorkspaceTrusted()) {
			return 'Workspace not trusted';
		}
		const activeViewlet = this._paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);
		if (!activeViewlet || activeViewlet.getId() !== files.VIEWLET_ID) {
			return 'Explorer viewlet not visible';
		}
		const visibleEditorPanes = this._editorService.visibleEditorPanes;
		if (visibleEditorPanes.length !== 1) {
			return `Expected text editor count : 1, Actual : ${visibleEditorPanes.length}`;
		}
		if (!isCodeEditor(visibleEditorPanes[0].getControl())) {
			return 'Active editor is not a text editor';
		}
		const activePanel = this._paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel);
		if (activePanel) {
			return `Current active panel : ${this._paneCompositeService.getPaneComposite(activePanel.getId(), ViewContainerLocation.Panel)?.name}`;
		}
		const isLatestVersion = await this._updateService.isLatestVersion();
		if (isLatestVersion === false) {
			return 'Not on latest version, updates available';
		}
		return undefined;
	}
}

export class BrowserStartupTimings extends StartupTimings implements IWorkbenchContribution {

	constructor(
		@IEditorService editorService: IEditorService,
		@IPaneCompositePartService paneCompositeService: IPaneCompositePartService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IUpdateService updateService: IUpdateService,
		@IWorkspaceTrustManagementService workspaceTrustService: IWorkspaceTrustManagementService,
		@ITimerService private readonly timerService: ITimerService,
		@ILogService private readonly logService: ILogService,
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IProductService private readonly productService: IProductService
	) {
		super(editorService, paneCompositeService, lifecycleService, updateService, workspaceTrustService);

		this.logPerfMarks();
	}

	private async logPerfMarks(): Promise<void> {
		if (!this.environmentService.profDurationMarkers) {
			return;
		}

		await this.timerService.whenReady();

		const standardStartupError = await this._isStandardStartup();
		const perfBaseline = await this.timerService.perfBaseline;
		const [from, to] = this.environmentService.profDurationMarkers;
		const content = `${this.timerService.getDuration(from, to)}\t${this.productService.nameShort}\t${(this.productService.commit || '').slice(0, 10) || '0000000000'}\t${this.telemetryService.sessionId}\t${standardStartupError === undefined ? 'standard_start' : 'NO_standard_start : ' + standardStartupError}\t${String(perfBaseline).padStart(4, '0')}ms\n`;

		this.logService.info(`[prof-timers] ${content}`);
	}
}

export class BrowserResourcePerformanceMarks {

	constructor(
		@ITelemetryService telemetryService: ITelemetryService
	) {

		type Entry = {
			hosthash: string;
			name: string;
			duration: number;
		};
		type EntryClassifify = {
			owner: 'jrieken';
			comment: 'Resource performance numbers';
			hosthash: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Hash of the hostname' };
			name: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Resource basename' };
			duration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Resource duration' };
		};
		for (const item of performance.getEntriesByType('resource')) {

			try {
				const url = new URL(item.name);
				const name = posix.basename(url.pathname);

				telemetryService.publicLog2<Entry, EntryClassifify>('startup.resource.perf', {
					hosthash: `H${hash(url.host).toString(16)}`,
					name,
					duration: item.duration
				});
			} catch {
				// ignore
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/performance/electron-browser/performance.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/performance/electron-browser/performance.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { StartupProfiler } from './startupProfiler.js';
import { NativeStartupTimings } from './startupTimings.js';
import { RendererProfiling } from './rendererAutoProfiler.js';
import { IConfigurationRegistry, Extensions as ConfigExt } from '../../../../platform/configuration/common/configurationRegistry.js';
import { localize } from '../../../../nls.js';
import { applicationConfigurationNodeBase } from '../../../common/configuration.js';

// -- auto profiler

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(
	RendererProfiling,
	LifecyclePhase.Eventually
);

// -- startup profiler

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(
	StartupProfiler,
	LifecyclePhase.Restored
);

// -- startup timings

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(
	NativeStartupTimings,
	LifecyclePhase.Eventually
);

Registry.as<IConfigurationRegistry>(ConfigExt.Configuration).registerConfiguration({
	...applicationConfigurationNodeBase,
	'properties': {
		'application.experimental.rendererProfiling': {
			type: 'boolean',
			default: false,
			tags: ['experimental'],
			markdownDescription: localize('experimental.rendererProfiling', "When enabled, slow renderers are automatically profiled."),
			experiment: {
				mode: 'startup'
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/performance/electron-browser/rendererAutoProfiler.ts]---
Location: vscode-main/src/vs/workbench/contrib/performance/electron-browser/rendererAutoProfiler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { joinPath } from '../../../../base/common/resources.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IV8Profile } from '../../../../platform/profiling/common/profiling.js';
import { IProfileAnalysisWorkerService, ProfilingOutput } from '../../../../platform/profiling/electron-browser/profileAnalysisWorkerService.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { parseExtensionDevOptions } from '../../../services/extensions/common/extensionDevOptions.js';
import { ITimerService } from '../../../services/timer/browser/timerService.js';

export class RendererProfiling {

	private _observer?: PerformanceObserver;

	constructor(
		@INativeWorkbenchEnvironmentService private readonly _environmentService: INativeWorkbenchEnvironmentService,
		@IFileService private readonly _fileService: IFileService,
		@ILogService private readonly _logService: ILogService,
		@INativeHostService nativeHostService: INativeHostService,
		@ITimerService timerService: ITimerService,
		@IConfigurationService configService: IConfigurationService,
		@IProfileAnalysisWorkerService profileAnalysisService: IProfileAnalysisWorkerService
	) {

		const devOpts = parseExtensionDevOptions(_environmentService);
		if (devOpts.isExtensionDevTestFromCli) {
			// disabled when running extension tests
			return;
		}

		timerService.perfBaseline.then(perfBaseline => {
			(_environmentService.isBuilt ? _logService.info : _logService.trace).apply(_logService, [`[perf] Render performance baseline is ${perfBaseline}ms`]);

			if (perfBaseline < 0) {
				// too slow
				return;
			}

			// SLOW threshold
			const slowThreshold = perfBaseline * 10; // ~10 frames at 64fps on MY machine

			const obs = new PerformanceObserver(async list => {

				obs.takeRecords();
				const maxDuration = list.getEntries()
					.map(e => e.duration)
					.reduce((p, c) => Math.max(p, c), 0);

				if (maxDuration < slowThreshold) {
					return;
				}

				if (!configService.getValue('application.experimental.rendererProfiling')) {
					_logService.debug(`[perf] SLOW task detected (${maxDuration}ms) but renderer profiling is disabled via 'application.experimental.rendererProfiling'`);
					return;
				}

				const sessionId = generateUuid();

				_logService.warn(`[perf] Renderer reported VERY LONG TASK (${maxDuration}ms), starting profiling session '${sessionId}'`);

				// pause observation, we'll take a detailed look
				obs.disconnect();

				// profile renderer for 5secs, analyse, and take action depending on the result
				for (let i = 0; i < 3; i++) {

					try {
						const profile = await nativeHostService.profileRenderer(sessionId, 5000);
						const output = await profileAnalysisService.analyseBottomUp(profile, _url => '<<renderer>>', perfBaseline, true);
						if (output === ProfilingOutput.Interesting) {
							this._store(profile, sessionId);
							break;
						}

						timeout(15000); // wait 15s

					} catch (err) {
						_logService.error(err);
						break;
					}
				}

				// reconnect the observer
				obs.observe({ entryTypes: ['longtask'] });
			});

			obs.observe({ entryTypes: ['longtask'] });
			this._observer = obs;

		});
	}

	dispose(): void {
		this._observer?.disconnect();
	}


	private async _store(profile: IV8Profile, sessionId: string): Promise<void> {
		const path = joinPath(this._environmentService.tmpDir, `renderer-${Math.random().toString(16).slice(2, 8)}.cpuprofile.json`);
		await this._fileService.writeFile(path, VSBuffer.fromString(JSON.stringify(profile)));
		this._logService.info(`[perf] stored profile to DISK '${path}'`, sessionId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/performance/electron-browser/startupProfiler.ts]---
Location: vscode-main/src/vs/workbench/contrib/performance/electron-browser/startupProfiler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../common/contributions.js';
import { localize } from '../../../../nls.js';
import { dirname, basename } from '../../../../base/common/resources.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { ILifecycleService, LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { PerfviewContrib } from '../browser/perfviewEditor.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { URI } from '../../../../base/common/uri.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILabelService } from '../../../../platform/label/common/label.js';

export class StartupProfiler implements IWorkbenchContribution {

	constructor(
		@IDialogService private readonly _dialogService: IDialogService,
		@INativeWorkbenchEnvironmentService private readonly _environmentService: INativeWorkbenchEnvironmentService,
		@ITextModelService private readonly _textModelResolverService: ITextModelService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IExtensionService extensionService: IExtensionService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@INativeHostService private readonly _nativeHostService: INativeHostService,
		@IProductService private readonly _productService: IProductService,
		@IFileService private readonly _fileService: IFileService,
		@ILabelService private readonly _labelService: ILabelService,
	) {
		// wait for everything to be ready
		Promise.all([
			lifecycleService.when(LifecyclePhase.Eventually),
			extensionService.whenInstalledExtensionsRegistered()
		]).then(() => {
			this._stopProfiling();
		});
	}

	private _stopProfiling(): void {

		if (!this._environmentService.args['prof-startup-prefix']) {
			return;
		}
		const profileFilenamePrefix = URI.file(this._environmentService.args['prof-startup-prefix']);

		const dir = dirname(profileFilenamePrefix);
		const prefix = basename(profileFilenamePrefix);

		const removeArgs: string[] = ['--prof-startup'];
		const markerFile = this._fileService.readFile(profileFilenamePrefix).then(value => removeArgs.push(...value.toString().split('|')))
			.then(() => this._fileService.del(profileFilenamePrefix, { recursive: true })) // (1) delete the file to tell the main process to stop profiling
			.then(() => new Promise<void>(resolve => { // (2) wait for main that recreates the fail to signal profiling has stopped
				const check = () => {
					this._fileService.exists(profileFilenamePrefix).then(exists => {
						if (exists) {
							resolve();
						} else {
							setTimeout(check, 500);
						}
					});
				};
				check();
			}))
			.then(() => this._fileService.del(profileFilenamePrefix, { recursive: true })); // (3) finally delete the file again

		markerFile.then(() => {
			return this._fileService.resolve(dir).then(stat => {
				return (stat.children ? stat.children.filter(value => value.resource.path.includes(prefix)) : []).map(stat => stat.resource);
			});
		}).then(files => {
			const profileFiles = files.reduce((prev, cur) => `${prev}${this._labelService.getUriLabel(cur)}\n`, '\n');

			return this._dialogService.confirm({
				type: 'info',
				message: localize('prof.message', "Successfully created profiles."),
				detail: localize('prof.detail', "Please create an issue and manually attach the following files:\n{0}", profileFiles),
				primaryButton: localize({ key: 'prof.restartAndFileIssue', comment: ['&& denotes a mnemonic'] }, "&&Create Issue and Restart"),
				cancelButton: localize('prof.restart', "Restart")
			}).then(res => {
				if (res.confirmed) {
					Promise.all<any>([
						this._nativeHostService.showItemInFolder(files[0].fsPath),
						this._createPerfIssue(files.map(file => basename(file)))
					]).then(() => {
						// keep window stable until restart is selected
						return this._dialogService.confirm({
							type: 'info',
							message: localize('prof.thanks', "Thanks for helping us."),
							detail: localize('prof.detail.restart', "A final restart is required to continue to use '{0}'. Again, thank you for your contribution.", this._productService.nameLong),
							primaryButton: localize({ key: 'prof.restart.button', comment: ['&& denotes a mnemonic'] }, "&&Restart")
						}).then(res => {
							// now we are ready to restart
							if (res.confirmed) {
								this._nativeHostService.relaunch({ removeArgs });
							}
						});
					});

				} else {
					// simply restart
					this._nativeHostService.relaunch({ removeArgs });
				}
			});
		});
	}

	private async _createPerfIssue(files: string[]): Promise<void> {
		const reportIssueUrl = this._productService.reportIssueUrl;
		if (!reportIssueUrl) {
			return;
		}

		const contrib = PerfviewContrib.get();
		const ref = await this._textModelResolverService.createModelReference(contrib.getInputUri());
		try {
			await this._clipboardService.writeText(ref.object.textEditorModel.getValue());
		} finally {
			ref.dispose();
		}

		const body = `
1. :warning: We have copied additional data to your clipboard. Make sure to **paste** here. :warning:
1. :warning: Make sure to **attach** these files from your *home*-directory: :warning:\n${files.map(file => `-\`${file}\``).join('\n')}
`;

		const baseUrl = reportIssueUrl;
		const queryStringPrefix = baseUrl.indexOf('?') === -1 ? '?' : '&';

		this._openerService.open(URI.parse(`${baseUrl}${queryStringPrefix}body=${encodeURIComponent(body)}`));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/performance/electron-browser/startupTimings.ts]---
Location: vscode-main/src/vs/workbench/contrib/performance/electron-browser/startupTimings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../common/contributions.js';
import { timeout } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUpdateService } from '../../../../platform/update/common/update.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ITimerService } from '../../../services/timer/browser/timerService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { StartupTimings } from '../browser/startupTimings.js';
import { coalesce } from '../../../../base/common/arrays.js';

interface ITracingData {
	readonly args?: {
		readonly usedHeapSizeAfter?: number;
		readonly usedHeapSizeBefore?: number;
	};
	readonly dur: number; 	// in microseconds
	readonly name: string;	// e.g. MinorGC or MajorGC
	readonly pid: number;
}

interface IHeapStatistics {
	readonly used: number;
	readonly garbage: number;
	readonly majorGCs: number;
	readonly minorGCs: number;
	readonly duration: number;
}

export class NativeStartupTimings extends StartupTimings implements IWorkbenchContribution {

	constructor(
		@IFileService private readonly _fileService: IFileService,
		@ITimerService private readonly _timerService: ITimerService,
		@INativeHostService private readonly _nativeHostService: INativeHostService,
		@IEditorService editorService: IEditorService,
		@IPaneCompositePartService paneCompositeService: IPaneCompositePartService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IUpdateService updateService: IUpdateService,
		@INativeWorkbenchEnvironmentService private readonly _environmentService: INativeWorkbenchEnvironmentService,
		@IProductService private readonly _productService: IProductService,
		@IWorkspaceTrustManagementService workspaceTrustService: IWorkspaceTrustManagementService
	) {
		super(editorService, paneCompositeService, lifecycleService, updateService, workspaceTrustService);

		this._report().catch(onUnexpectedError);
	}

	private async _report() {
		const standardStartupError = await this._isStandardStartup();
		this._appendStartupTimes(standardStartupError).catch(onUnexpectedError);
	}

	private async _appendStartupTimes(standardStartupError: string | undefined) {
		const appendTo = this._environmentService.args['prof-append-timers'];
		const durationMarkers = this._environmentService.args['prof-duration-markers'];
		const durationMarkersFile = this._environmentService.args['prof-duration-markers-file'];
		if (!appendTo && !durationMarkers) {
			// nothing to do
			return;
		}

		try {
			await Promise.all([
				this._timerService.whenReady(),
				timeout(15000), // wait: cached data creation, telemetry sending
			]);

			const perfBaseline = await this._timerService.perfBaseline;
			const heapStatistics = await this._resolveStartupHeapStatistics();
			if (heapStatistics) {
				this._telemetryLogHeapStatistics(heapStatistics);
			}

			if (appendTo) {
				const content = coalesce([
					this._timerService.startupMetrics.ellapsed,
					this._productService.nameShort,
					(this._productService.commit || '').slice(0, 10) || '0000000000',
					this._telemetryService.sessionId,
					standardStartupError === undefined ? 'standard_start' : `NO_standard_start : ${standardStartupError}`,
					`${String(perfBaseline).padStart(4, '0')}ms`,
					heapStatistics ? this._printStartupHeapStatistics(heapStatistics) : undefined
				]).join('\t') + '\n';
				await this._appendContent(URI.file(appendTo), content);
			}

			if (durationMarkers?.length) {
				const durations: string[] = [];
				for (const durationMarker of durationMarkers) {
					let duration: number = 0;
					if (durationMarker === 'ellapsed') {
						duration = this._timerService.startupMetrics.ellapsed;
					} else if (durationMarker.indexOf('-') !== -1) {
						const markers = durationMarker.split('-');
						if (markers.length === 2) {
							duration = this._timerService.getDuration(markers[0], markers[1]);
						}
					}
					if (duration) {
						durations.push(durationMarker);
						durations.push(`${duration}`);
					}
				}

				const durationsContent = `${durations.join('\t')}\n`;
				if (durationMarkersFile) {
					await this._appendContent(URI.file(durationMarkersFile), durationsContent);
				} else {
					console.log(durationsContent);
				}
			}

		} catch (err) {
			console.error(err);
		} finally {
			this._nativeHostService.exit(0);
		}
	}

	protected override async _isStandardStartup(): Promise<string | undefined> {
		const windowCount = await this._nativeHostService.getWindowCount();
		if (windowCount !== 1) {
			return `Expected window count : 1, Actual : ${windowCount}`;
		}
		return super._isStandardStartup();
	}

	private async _appendContent(file: URI, content: string): Promise<void> {
		const chunks: VSBuffer[] = [];
		if (await this._fileService.exists(file)) {
			chunks.push((await this._fileService.readFile(file)).value);
		}
		chunks.push(VSBuffer.fromString(content));
		await this._fileService.writeFile(file, VSBuffer.concat(chunks));
	}

	private async _resolveStartupHeapStatistics(): Promise<IHeapStatistics | undefined> {
		if (
			!this._environmentService.args['enable-tracing'] ||
			!this._environmentService.args['trace-startup-file'] ||
			this._environmentService.args['trace-startup-format'] !== 'json' ||
			!this._environmentService.args['trace-startup-duration']
		) {
			return undefined; // unexpected arguments for startup heap statistics
		}

		const windowProcessId = await this._nativeHostService.getProcessId();
		const used = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize ?? 0; // https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory

		let minorGCs = 0;
		let majorGCs = 0;
		let garbage = 0;
		let duration = 0;

		try {
			const traceContents: { traceEvents: ITracingData[] } = JSON.parse((await this._fileService.readFile(URI.file(this._environmentService.args['trace-startup-file']))).value.toString());
			for (const event of traceContents.traceEvents) {
				if (event.pid !== windowProcessId) {
					continue;
				}

				switch (event.name) {

					// Major/Minor GC Events
					case 'MinorGC':
						minorGCs++;
						break;
					case 'MajorGC':
						majorGCs++;
						break;

					// GC Events that block the main thread
					// Refs: https://v8.dev/blog/trash-talk
					case 'V8.GCFinalizeMC':
					case 'V8.GCScavenger':
						duration += event.dur;
						break;
				}

				if (event.name === 'MajorGC' || event.name === 'MinorGC') {
					if (typeof event.args?.usedHeapSizeAfter === 'number' && typeof event.args.usedHeapSizeBefore === 'number') {
						garbage += (event.args.usedHeapSizeBefore - event.args.usedHeapSizeAfter);
					}
				}
			}

			return { minorGCs, majorGCs, used, garbage, duration: Math.round(duration / 1000) };
		} catch (error) {
			console.error(error);
		}

		return undefined;
	}

	private _telemetryLogHeapStatistics({ used, garbage, majorGCs, minorGCs, duration }: IHeapStatistics): void {
		type StartupHeapStatisticsClassification = {
			owner: 'bpasero';
			comment: 'An event that reports startup heap statistics for performance analysis.';
			heapUsed: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Used heap' };
			heapGarbage: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Garbage heap' };
			majorGCs: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Major GCs count' };
			minorGCs: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Minor GCs count' };
			gcsDuration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'GCs duration' };
		};
		type StartupHeapStatisticsEvent = {
			heapUsed: number;
			heapGarbage: number;
			majorGCs: number;
			minorGCs: number;
			gcsDuration: number;
		};
		this._telemetryService.publicLog2<StartupHeapStatisticsEvent, StartupHeapStatisticsClassification>('startupHeapStatistics', {
			heapUsed: used,
			heapGarbage: garbage,
			majorGCs,
			minorGCs,
			gcsDuration: duration
		});
	}

	private _printStartupHeapStatistics({ used, garbage, majorGCs, minorGCs, duration }: IHeapStatistics) {
		const MB = 1024 * 1024;
		return `Heap: ${Math.round(used / MB)}MB (used) ${Math.round(garbage / MB)}MB (garbage) ${majorGCs} (MajorGC) ${minorGCs} (MinorGC) ${duration}ms (GC duration)`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/policyExport/common/policyDto.ts]---
Location: vscode-main/src/vs/workbench/contrib/policyExport/common/policyDto.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type LocalizedValueDto = {
	key: string;
	value: string;
};

export interface CategoryDto {
	key: string;
	name: LocalizedValueDto;
}

export interface PolicyDto {
	key: string;
	name: string;
	category: string;
	minimumVersion: `${number}.${number}`;
	localization: {
		description: LocalizedValueDto;
		enumDescriptions?: LocalizedValueDto[];
	};
	type?: string | string[];
	default?: unknown;
	enum?: string[];
}

export interface ExportedPolicyDataDto {
	categories: CategoryDto[];
	policies: PolicyDto[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/policyExport/electron-browser/policyExport.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/policyExport/electron-browser/policyExport.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchConfigurationService } from '../../../services/configuration/common/configuration.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { PolicyCategory, PolicyCategoryData } from '../../../../base/common/policy.js';
import { ExportedPolicyDataDto } from '../common/policyDto.js';
import { join } from '../../../../base/common/path.js';

export class PolicyExportContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.policyExport';
	static readonly DEFAULT_POLICY_EXPORT_PATH = 'build/lib/policies/policyData.jsonc';

	constructor(
		@INativeEnvironmentService private readonly nativeEnvironmentService: INativeEnvironmentService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IFileService private readonly fileService: IFileService,
		@IWorkbenchConfigurationService private readonly configurationService: IWorkbenchConfigurationService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IProgressService private readonly progressService: IProgressService,
		@ILogService private readonly logService: ILogService,
	) {
		super();

		// Skip for non-development flows
		if (this.nativeEnvironmentService.isBuilt) {
			return;
		}

		const policyDataPath = this.nativeEnvironmentService.exportPolicyData;
		if (policyDataPath !== undefined) {
			const defaultPath = join(this.nativeEnvironmentService.appRoot, PolicyExportContribution.DEFAULT_POLICY_EXPORT_PATH);
			void this.exportPolicyDataAndQuit(policyDataPath ? policyDataPath : defaultPath);
		}
	}

	private log(msg: string | undefined, ...args: unknown[]) {
		this.logService.info(`[${PolicyExportContribution.ID}]`, msg, ...args);
	}

	private async exportPolicyDataAndQuit(policyDataPath: string): Promise<void> {
		try {
			await this.progressService.withProgress({
				location: ProgressLocation.Notification,
				title: `Exporting policy data to ${policyDataPath}`
			}, async (_progress) => {
				this.log('Export started. Waiting for configurations to load.');
				await this.extensionService.whenInstalledExtensionsRegistered();
				await this.configurationService.whenRemoteConfigurationLoaded();

				this.log('Extensions and configuration loaded.');
				const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
				const configurationProperties = {
					...configurationRegistry.getExcludedConfigurationProperties(),
					...configurationRegistry.getConfigurationProperties(),
				};

				const policyData: ExportedPolicyDataDto = {
					categories: Object.values(PolicyCategory).map(category => ({
						key: category,
						name: PolicyCategoryData[category].name
					})),
					policies: []
				};

				for (const [key, schema] of Object.entries(configurationProperties)) {
					// Check for the localization property for now to remain backwards compatible.
					if (schema.policy?.localization) {
						policyData.policies.push({
							key,
							name: schema.policy.name,
							category: schema.policy.category,
							minimumVersion: schema.policy.minimumVersion,
							localization: {
								description: schema.policy.localization.description,
								enumDescriptions: schema.policy.localization.enumDescriptions,
							},
							type: schema.type,
							default: schema.default,
							enum: schema.enum,
						});
					}
				}
				this.log(`Discovered ${policyData.policies.length} policies to export.`);

				const disclaimerComment = `/** THIS FILE IS AUTOMATICALLY GENERATED USING \`code --export-policy-data\`. DO NOT MODIFY IT MANUALLY. **/`;
				const policyDataFileContent = `${disclaimerComment}\n${JSON.stringify(policyData, null, 4)}\n`;
				await this.fileService.writeFile(URI.file(policyDataPath), VSBuffer.fromString(policyDataFileContent));
				this.log(`Successfully exported ${policyData.policies.length} policies to ${policyDataPath}.`);
			});

			await this.nativeHostService.exit(0);
		} catch (error) {
			this.log('Failed to export policy', error);
			await this.nativeHostService.exit(1);
		}
	}
}

registerWorkbenchContribution2(
	PolicyExportContribution.ID,
	PolicyExportContribution,
	WorkbenchPhase.Eventually,
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/policyExport/test/node/policyExport.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/contrib/policyExport/test/node/policyExport.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as cp from 'child_process';
import { promises as fs } from 'fs';
import * as os from 'os';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { dirname, join } from '../../../../../base/common/path.js';
import { FileAccess } from '../../../../../base/common/network.js';
import * as util from 'util';

const exec = util.promisify(cp.exec);

suite('PolicyExport Integration Tests', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('exported policy data matches checked-in file', async function () {
		// Skip this test in ADO pipelines
		if (process.env['TF_BUILD']) {
			this.skip();
		}

		// This test launches VS Code with --export-policy-data flag, so it takes longer
		this.timeout(60000);

		// Get the repository root (FileAccess.asFileUri('') points to the 'out' directory)
		const rootPath = dirname(FileAccess.asFileUri('').fsPath);
		const checkedInFile = join(rootPath, 'build/lib/policies/policyData.jsonc');
		const tempFile = join(os.tmpdir(), `policyData-test-${Date.now()}.jsonc`);

		try {
			// Launch VS Code with --export-policy-data flag
			const scriptPath = isWindows
				? join(rootPath, 'scripts', 'code.bat')
				: join(rootPath, 'scripts', 'code.sh');

			await exec(`"${scriptPath}" --export-policy-data="${tempFile}"`, {
				cwd: rootPath
			});

			// Read both files
			const [exportedContent, checkedInContent] = await Promise.all([
				fs.readFile(tempFile, 'utf-8'),
				fs.readFile(checkedInFile, 'utf-8')
			]);

			// Compare contents
			assert.strictEqual(
				exportedContent,
				checkedInContent,
				'Exported policy data should match the checked-in file. If this fails, run: ./scripts/code.sh --export-policy-data'
			);
		} finally {
			// Clean up temp file
			try {
				await fs.unlink(tempFile);
			} catch {
				// Ignore cleanup errors
			}
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/keybindingsEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/keybindingsEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable local/code-no-dangerous-type-assertions */

import './media/keybindingsEditor.css';
import { localize } from '../../../../nls.js';
import { Delayer } from '../../../../base/common/async.js';
import * as DOM from '../../../../base/browser/dom.js';
import { isIOS, OS } from '../../../../base/common/platform.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ToggleActionViewItem } from '../../../../base/browser/ui/toggle/toggle.js';
import { HighlightedLabel } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { KeybindingLabel } from '../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { IAction, Action, Separator } from '../../../../base/common/actions.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { KeybindingsEditorModel, KEYBINDING_ENTRY_TEMPLATE_ID } from '../../../services/preferences/browser/keybindingsEditorModel.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService, IUserFriendlyKeybinding } from '../../../../platform/keybinding/common/keybinding.js';
import { DefineKeybindingWidget, KeybindingsSearchWidget } from './keybindingWidgets.js';
import { CONTEXT_KEYBINDING_FOCUS, CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS, CONTEXT_KEYBINDINGS_SEARCH_HAS_VALUE, KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS, KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE, KEYBINDINGS_EDITOR_COMMAND_DEFINE, KEYBINDINGS_EDITOR_COMMAND_REMOVE, KEYBINDINGS_EDITOR_COMMAND_RESET, KEYBINDINGS_EDITOR_COMMAND_COPY, KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND, KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS, KEYBINDINGS_EDITOR_COMMAND_DEFINE_WHEN, KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR, KEYBINDINGS_EDITOR_COMMAND_ADD, KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND_TITLE, CONTEXT_WHEN_FOCUS } from '../common/preferences.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingEditingService } from '../../../services/keybinding/common/keybindingEditing.js';
import { IListContextMenuEvent } from '../../../../base/browser/ui/list/list.js';
import { IThemeService, registerThemingParticipant, IColorTheme, ICssStyleCollector } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IContextKeyService, IContextKey, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { badgeBackground, contrastBorder, badgeForeground, listActiveSelectionForeground, listInactiveSelectionForeground, listHoverForeground, listFocusForeground, editorBackground, foreground, listActiveSelectionBackground, listInactiveSelectionBackground, listFocusBackground, listHoverBackground, registerColor, tableOddRowsBackgroundColor, asCssVariable } from '../../../../platform/theme/common/colorRegistry.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { EditorExtensionsRegistry } from '../../../../editor/browser/editorExtensions.js';
import { WorkbenchTable } from '../../../../platform/list/browser/listService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MenuRegistry, MenuId, isIMenuItem } from '../../../../platform/actions/common/actions.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { WORKBENCH_BACKGROUND } from '../../../common/theme.js';
import { IKeybindingItemEntry, IKeybindingsEditorPane } from '../../../services/preferences/common/preferences.js';
import { keybindingsRecordKeysIcon, keybindingsSortIcon, keybindingsAddIcon, preferencesClearInputIcon, keybindingsEditIcon } from './preferencesIcons.js';
import { ITableRenderer, ITableVirtualDelegate } from '../../../../base/browser/ui/table/table.js';
import { KeybindingsEditorInput } from '../../../services/preferences/browser/keybindingsEditorInput.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { ToolBar } from '../../../../base/browser/ui/toolbar/toolbar.js';
import { defaultKeybindingLabelStyles, defaultToggleStyles, getInputBoxStyle } from '../../../../platform/theme/browser/defaultStyles.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { isString } from '../../../../base/common/types.js';
import { SuggestEnabledInput } from '../../codeEditor/browser/suggestEnabledInput/suggestEnabledInput.js';
import { CompletionItemKind } from '../../../../editor/common/languages.js';
import { settingsTextInputBorder } from '../common/settingsEditorColorRegistry.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { registerNavigableContainer } from '../../../browser/actions/widgetNavigationCommands.js';
import { IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';

const $ = DOM.$;

interface IKeybindingsEditorMemento {
	searchHistory?: string[];
}

export class KeybindingsEditor extends EditorPane<IKeybindingsEditorMemento> implements IKeybindingsEditorPane {

	static readonly ID: string = 'workbench.editor.keybindings';

	private _onDefineWhenExpression: Emitter<IKeybindingItemEntry> = this._register(new Emitter<IKeybindingItemEntry>());
	readonly onDefineWhenExpression: Event<IKeybindingItemEntry> = this._onDefineWhenExpression.event;

	private _onRejectWhenExpression = this._register(new Emitter<IKeybindingItemEntry>());
	readonly onRejectWhenExpression = this._onRejectWhenExpression.event;

	private _onAcceptWhenExpression = this._register(new Emitter<IKeybindingItemEntry>());
	readonly onAcceptWhenExpression = this._onAcceptWhenExpression.event;

	private _onLayout: Emitter<void> = this._register(new Emitter<void>());
	readonly onLayout: Event<void> = this._onLayout.event;

	private keybindingsEditorModel: KeybindingsEditorModel | null = null;

	private headerContainer!: HTMLElement;
	private actionsContainer!: HTMLElement;
	private searchWidget!: KeybindingsSearchWidget;
	private searchHistoryDelayer: Delayer<void>;

	private overlayContainer!: HTMLElement;
	private defineKeybindingWidget!: DefineKeybindingWidget;

	private unAssignedKeybindingItemToRevealAndFocus: IKeybindingItemEntry | null = null;
	private tableEntries: IKeybindingItemEntry[] = [];
	private keybindingsTableContainer!: HTMLElement;
	private keybindingsTable!: WorkbenchTable<IKeybindingItemEntry>;

	private dimension: DOM.Dimension | null = null;
	private delayedFiltering: Delayer<void>;
	private latestEmptyFilters: string[] = [];
	private keybindingsEditorContextKey: IContextKey<boolean>;
	private keybindingFocusContextKey: IContextKey<boolean>;
	private searchFocusContextKey: IContextKey<boolean>;
	private searchHasValueContextKey: IContextKey<boolean>;

	private readonly sortByPrecedenceAction: Action;
	private readonly recordKeysAction: Action;

	private ariaLabelElement!: HTMLElement;
	readonly overflowWidgetsDomNode: HTMLElement;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IKeybindingService private readonly keybindingsService: IKeybindingService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IKeybindingEditingService private readonly keybindingEditingService: IKeybindingEditingService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@INotificationService private readonly notificationService: INotificationService,
		@IClipboardService private readonly clipboardService: IClipboardService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IEditorService private readonly editorService: IEditorService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService
	) {
		super(KeybindingsEditor.ID, group, telemetryService, themeService, storageService);
		this.delayedFiltering = new Delayer<void>(300);
		this._register(keybindingsService.onDidUpdateKeybindings(() => this.render(!!this.keybindingFocusContextKey.get())));

		this.keybindingsEditorContextKey = CONTEXT_KEYBINDINGS_EDITOR.bindTo(this.contextKeyService);
		this.searchFocusContextKey = CONTEXT_KEYBINDINGS_SEARCH_FOCUS.bindTo(this.contextKeyService);
		this.keybindingFocusContextKey = CONTEXT_KEYBINDING_FOCUS.bindTo(this.contextKeyService);
		this.searchHasValueContextKey = CONTEXT_KEYBINDINGS_SEARCH_HAS_VALUE.bindTo(this.contextKeyService);
		this.searchHistoryDelayer = new Delayer<void>(500);

		this.recordKeysAction = this._register(new Action(KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS, localize('recordKeysLabel', "Record Keys"), ThemeIcon.asClassName(keybindingsRecordKeysIcon)));
		this.recordKeysAction.checked = false;

		this.sortByPrecedenceAction = this._register(new Action(KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE, localize('sortByPrecedeneLabel', "Sort by Precedence (Highest first)"), ThemeIcon.asClassName(keybindingsSortIcon)));
		this.sortByPrecedenceAction.checked = false;
		this.overflowWidgetsDomNode = $('.keybindings-overflow-widgets-container.monaco-editor');
	}

	override create(parent: HTMLElement): void {
		super.create(parent);
		this._register(registerNavigableContainer({
			name: 'keybindingsEditor',
			focusNotifiers: [this],
			focusNextWidget: () => {
				if (this.searchWidget.hasFocus()) {
					this.focusKeybindings();
				}
			},
			focusPreviousWidget: () => {
				if (!this.searchWidget.hasFocus()) {
					this.focusSearch();
				}
			}
		}));
	}

	protected createEditor(parent: HTMLElement): void {
		const keybindingsEditorElement = DOM.append(parent, $('div', { class: 'keybindings-editor' }));

		this.createAriaLabelElement(keybindingsEditorElement);
		this.createOverlayContainer(keybindingsEditorElement);
		this.createHeader(keybindingsEditorElement);
		this.createBody(keybindingsEditorElement);
	}

	override setInput(input: KeybindingsEditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		this.keybindingsEditorContextKey.set(true);
		return super.setInput(input, options, context, token)
			.then(() => this.render(!!(options && options.preserveFocus)));
	}

	override clearInput(): void {
		super.clearInput();
		this.keybindingsEditorContextKey.reset();
		this.keybindingFocusContextKey.reset();
	}

	layout(dimension: DOM.Dimension): void {
		this.dimension = dimension;
		this.layoutSearchWidget(dimension);

		this.overlayContainer.style.width = dimension.width + 'px';
		this.overlayContainer.style.height = dimension.height + 'px';
		this.defineKeybindingWidget.layout(this.dimension);

		this.layoutKeybindingsTable();
		this._onLayout.fire();
	}

	override focus(): void {
		super.focus();

		const activeKeybindingEntry = this.activeKeybindingEntry;
		if (activeKeybindingEntry) {
			this.selectEntry(activeKeybindingEntry);
		} else if (!isIOS) {
			this.searchWidget.focus();
		}
	}

	get activeKeybindingEntry(): IKeybindingItemEntry | null {
		const focusedElement = this.keybindingsTable.getFocusedElements()[0];
		return focusedElement && focusedElement.templateId === KEYBINDING_ENTRY_TEMPLATE_ID ? <IKeybindingItemEntry>focusedElement : null;
	}

	async defineKeybinding(keybindingEntry: IKeybindingItemEntry, add: boolean): Promise<void> {
		this.selectEntry(keybindingEntry);
		this.showOverlayContainer();
		try {
			const key = await this.defineKeybindingWidget.define();
			if (key) {
				await this.updateKeybinding(keybindingEntry, key, keybindingEntry.keybindingItem.when, add);
			}
		} catch (error) {
			this.onKeybindingEditingError(error);
		} finally {
			this.hideOverlayContainer();
			this.selectEntry(keybindingEntry);
		}
	}

	defineWhenExpression(keybindingEntry: IKeybindingItemEntry): void {
		if (keybindingEntry.keybindingItem.keybinding) {
			this.selectEntry(keybindingEntry);
			this._onDefineWhenExpression.fire(keybindingEntry);
		}
	}

	rejectWhenExpression(keybindingEntry: IKeybindingItemEntry): void {
		this._onRejectWhenExpression.fire(keybindingEntry);
	}

	acceptWhenExpression(keybindingEntry: IKeybindingItemEntry): void {
		this._onAcceptWhenExpression.fire(keybindingEntry);
	}

	async updateKeybinding(keybindingEntry: IKeybindingItemEntry, key: string, when: string | undefined, add?: boolean): Promise<void> {
		const currentKey = keybindingEntry.keybindingItem.keybinding ? keybindingEntry.keybindingItem.keybinding.getUserSettingsLabel() : '';
		if (currentKey !== key || keybindingEntry.keybindingItem.when !== when) {
			if (add) {
				await this.keybindingEditingService.addKeybinding(keybindingEntry.keybindingItem.keybindingItem, key, when || undefined);
			} else {
				await this.keybindingEditingService.editKeybinding(keybindingEntry.keybindingItem.keybindingItem, key, when || undefined);
			}
			if (!keybindingEntry.keybindingItem.keybinding) { // reveal only if keybinding was added to unassinged. Because the entry will be placed in different position after rendering
				this.unAssignedKeybindingItemToRevealAndFocus = keybindingEntry;
			}
		}
	}

	async removeKeybinding(keybindingEntry: IKeybindingItemEntry): Promise<void> {
		this.selectEntry(keybindingEntry);
		if (keybindingEntry.keybindingItem.keybinding) { // This should be a pre-condition
			try {
				await this.keybindingEditingService.removeKeybinding(keybindingEntry.keybindingItem.keybindingItem);
				this.focus();
			} catch (error) {
				this.onKeybindingEditingError(error);
				this.selectEntry(keybindingEntry);
			}
		}
	}

	async resetKeybinding(keybindingEntry: IKeybindingItemEntry): Promise<void> {
		this.selectEntry(keybindingEntry);
		try {
			await this.keybindingEditingService.resetKeybinding(keybindingEntry.keybindingItem.keybindingItem);
			if (!keybindingEntry.keybindingItem.keybinding) { // reveal only if keybinding was added to unassinged. Because the entry will be placed in different position after rendering
				this.unAssignedKeybindingItemToRevealAndFocus = keybindingEntry;
			}
			this.selectEntry(keybindingEntry);
		} catch (error) {
			this.onKeybindingEditingError(error);
			this.selectEntry(keybindingEntry);
		}
	}

	async copyKeybinding(keybinding: IKeybindingItemEntry): Promise<void> {
		this.selectEntry(keybinding);
		const userFriendlyKeybinding: IUserFriendlyKeybinding = {
			key: keybinding.keybindingItem.keybinding ? keybinding.keybindingItem.keybinding.getUserSettingsLabel() || '' : '',
			command: keybinding.keybindingItem.command
		};
		if (keybinding.keybindingItem.when) {
			userFriendlyKeybinding.when = keybinding.keybindingItem.when;
		}
		await this.clipboardService.writeText(JSON.stringify(userFriendlyKeybinding, null, '  '));
	}

	async copyKeybindingCommand(keybinding: IKeybindingItemEntry): Promise<void> {
		this.selectEntry(keybinding);
		await this.clipboardService.writeText(keybinding.keybindingItem.command);
	}

	async copyKeybindingCommandTitle(keybinding: IKeybindingItemEntry): Promise<void> {
		this.selectEntry(keybinding);
		await this.clipboardService.writeText(keybinding.keybindingItem.commandLabel);
	}

	focusSearch(): void {
		this.searchWidget.focus();
	}

	search(filter: string): void {
		this.focusSearch();
		this.searchWidget.setValue(filter);
		this.selectEntry(0);
	}

	clearSearchResults(): void {
		this.searchWidget.clear();
		this.searchHasValueContextKey.set(false);
	}

	showSimilarKeybindings(keybindingEntry: IKeybindingItemEntry): void {
		const value = `"${keybindingEntry.keybindingItem.keybinding.getAriaLabel()}"`;
		if (value !== this.searchWidget.getValue()) {
			this.searchWidget.setValue(value);
		}
	}

	private createAriaLabelElement(parent: HTMLElement): void {
		this.ariaLabelElement = DOM.append(parent, DOM.$(''));
		this.ariaLabelElement.setAttribute('id', 'keybindings-editor-aria-label-element');
		this.ariaLabelElement.setAttribute('aria-live', 'assertive');
	}

	private createOverlayContainer(parent: HTMLElement): void {
		this.overlayContainer = DOM.append(parent, $('.overlay-container'));
		this.overlayContainer.style.position = 'absolute';
		this.overlayContainer.style.zIndex = '40'; // has to greater than sash z-index which is 35
		this.defineKeybindingWidget = this._register(this.instantiationService.createInstance(DefineKeybindingWidget, this.overlayContainer));
		this._register(this.defineKeybindingWidget.onDidChange(keybindingStr => this.defineKeybindingWidget.printExisting(this.keybindingsEditorModel!.fetch(`"${keybindingStr}"`).length)));
		this._register(this.defineKeybindingWidget.onShowExistingKeybidings(keybindingStr => this.searchWidget.setValue(`"${keybindingStr}"`)));
		this.hideOverlayContainer();
	}

	private showOverlayContainer() {
		this.overlayContainer.style.display = 'block';
	}

	private hideOverlayContainer() {
		this.overlayContainer.style.display = 'none';
	}

	private createHeader(parent: HTMLElement): void {
		this.headerContainer = DOM.append(parent, $('.keybindings-header'));
		const fullTextSearchPlaceholder = localize('SearchKeybindings.FullTextSearchPlaceholder', "Type to search in keybindings");
		const keybindingsSearchPlaceholder = localize('SearchKeybindings.KeybindingsSearchPlaceholder', "Recording Keys. Press Escape to exit");

		const clearInputAction = this._register(new Action(KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS, localize('clearInput', "Clear Keybindings Search Input"), ThemeIcon.asClassName(preferencesClearInputIcon), false, async () => this.clearSearchResults()));

		const searchContainer = DOM.append(this.headerContainer, $('.search-container'));
		this.searchWidget = this._register(this.instantiationService.createInstance(KeybindingsSearchWidget, searchContainer, {
			ariaLabel: fullTextSearchPlaceholder,
			placeholder: fullTextSearchPlaceholder,
			focusKey: this.searchFocusContextKey,
			ariaLabelledBy: 'keybindings-editor-aria-label-element',
			recordEnter: true,
			quoteRecordedKeys: true,
			history: new Set<string>((this.getMemento(StorageScope.PROFILE, StorageTarget.USER)).searchHistory ?? []),
			inputBoxStyles: getInputBoxStyle({
				inputBorder: settingsTextInputBorder
			})
		}));
		this._register(this.searchWidget.onDidChange(searchValue => {
			const hasValue = !!searchValue;
			clearInputAction.enabled = hasValue;
			this.searchHasValueContextKey.set(hasValue);
			this.delayedFiltering.trigger(() => this.filterKeybindings());
			this.updateSearchOptions();
		}));
		this._register(this.searchWidget.onEscape(() => this.recordKeysAction.checked = false));

		this.actionsContainer = DOM.append(searchContainer, DOM.$('.keybindings-search-actions-container'));
		const recordingBadge = this.createRecordingBadge(this.actionsContainer);

		this._register(this.sortByPrecedenceAction.onDidChange(e => {
			if (e.checked !== undefined) {
				this.renderKeybindingsEntries(false);
			}
			this.updateSearchOptions();
		}));

		this._register(this.recordKeysAction.onDidChange(e => {
			if (e.checked !== undefined) {
				recordingBadge.classList.toggle('disabled', !e.checked);
				if (e.checked) {
					this.searchWidget.inputBox.setPlaceHolder(keybindingsSearchPlaceholder);
					this.searchWidget.inputBox.setAriaLabel(keybindingsSearchPlaceholder);
					this.searchWidget.startRecordingKeys();
					this.searchWidget.focus();
				} else {
					this.searchWidget.inputBox.setPlaceHolder(fullTextSearchPlaceholder);
					this.searchWidget.inputBox.setAriaLabel(fullTextSearchPlaceholder);
					this.searchWidget.stopRecordingKeys();
					this.searchWidget.focus();
				}
				this.updateSearchOptions();
			}
		}));

		const actions = [this.recordKeysAction, this.sortByPrecedenceAction, clearInputAction];
		const toolBar = this._register(new ToolBar(this.actionsContainer, this.contextMenuService, {
			actionViewItemProvider: (action: IAction, options: IActionViewItemOptions) => {
				if (action.id === this.sortByPrecedenceAction.id || action.id === this.recordKeysAction.id) {
					return new ToggleActionViewItem(null, action, { ...options, keybinding: this.keybindingsService.lookupKeybinding(action.id)?.getLabel(), toggleStyles: defaultToggleStyles });
				}
				return undefined;
			},
			getKeyBinding: action => this.keybindingsService.lookupKeybinding(action.id)
		}));
		toolBar.setActions(actions);
		this._register(this.keybindingsService.onDidUpdateKeybindings(() => toolBar.setActions(actions)));
	}

	private updateSearchOptions(): void {
		const keybindingsEditorInput = this.input as KeybindingsEditorInput;
		if (keybindingsEditorInput) {
			keybindingsEditorInput.searchOptions = {
				searchValue: this.searchWidget.getValue(),
				recordKeybindings: !!this.recordKeysAction.checked,
				sortByPrecedence: !!this.sortByPrecedenceAction.checked
			};
		}
	}

	private createRecordingBadge(container: HTMLElement): HTMLElement {
		const recordingBadge = DOM.append(container, DOM.$('.recording-badge.monaco-count-badge.long.disabled'));
		recordingBadge.textContent = localize('recording', "Recording Keys");

		recordingBadge.style.backgroundColor = asCssVariable(badgeBackground);
		recordingBadge.style.color = asCssVariable(badgeForeground);
		recordingBadge.style.border = `1px solid ${asCssVariable(contrastBorder)}`;

		return recordingBadge;
	}

	private layoutSearchWidget(dimension: DOM.Dimension): void {
		this.searchWidget.layout(dimension);
		this.headerContainer.classList.toggle('small', dimension.width < 400);
		this.searchWidget.inputBox.inputElement.style.paddingRight = `${DOM.getTotalWidth(this.actionsContainer) + 12}px`;
	}

	private createBody(parent: HTMLElement): void {
		const bodyContainer = DOM.append(parent, $('.keybindings-body'));
		this.createTable(bodyContainer);
	}

	private createTable(parent: HTMLElement): void {
		this.keybindingsTableContainer = DOM.append(parent, $('.keybindings-table-container'));
		this.keybindingsTable = this._register(this.instantiationService.createInstance(WorkbenchTable,
			'KeybindingsEditor',
			this.keybindingsTableContainer,
			new Delegate(),
			[
				{
					label: '',
					tooltip: '',
					weight: 0,
					minimumWidth: 40,
					maximumWidth: 40,
					templateId: ActionsColumnRenderer.TEMPLATE_ID,
					project(row: IKeybindingItemEntry): IKeybindingItemEntry { return row; }
				},
				{
					label: localize('command', "Command"),
					tooltip: '',
					weight: 0.3,
					templateId: CommandColumnRenderer.TEMPLATE_ID,
					project(row: IKeybindingItemEntry): IKeybindingItemEntry { return row; }
				},
				{
					label: localize('keybinding', "Keybinding"),
					tooltip: '',
					weight: 0.2,
					templateId: KeybindingColumnRenderer.TEMPLATE_ID,
					project(row: IKeybindingItemEntry): IKeybindingItemEntry { return row; }
				},
				{
					label: localize('when', "When"),
					tooltip: '',
					weight: 0.35,
					templateId: WhenColumnRenderer.TEMPLATE_ID,
					project(row: IKeybindingItemEntry): IKeybindingItemEntry { return row; }
				},
				{
					label: localize('source', "Source"),
					tooltip: '',
					weight: 0.15,
					templateId: SourceColumnRenderer.TEMPLATE_ID,
					project(row: IKeybindingItemEntry): IKeybindingItemEntry { return row; }
				},
			],
			[
				this.instantiationService.createInstance(ActionsColumnRenderer, this),
				this.instantiationService.createInstance(CommandColumnRenderer),
				this.instantiationService.createInstance(KeybindingColumnRenderer),
				this.instantiationService.createInstance(WhenColumnRenderer, this),
				this.instantiationService.createInstance(SourceColumnRenderer),
			],
			{
				identityProvider: { getId: (e: IKeybindingItemEntry) => e.id },
				horizontalScrolling: false,
				accessibilityProvider: new AccessibilityProvider(this.configurationService),
				keyboardNavigationLabelProvider: { getKeyboardNavigationLabel: (e: IKeybindingItemEntry) => e.keybindingItem.commandLabel || e.keybindingItem.command },
				overrideStyles: {
					listBackground: editorBackground
				},
				multipleSelectionSupport: false,
				setRowLineHeight: false,
				openOnSingleClick: false,
				transformOptimization: false // disable transform optimization as it causes the editor overflow widgets to be mispositioned
			}
		)) as WorkbenchTable<IKeybindingItemEntry>;

		this._register(this.keybindingsTable.onContextMenu(e => this.onContextMenu(e)));
		this._register(this.keybindingsTable.onDidChangeFocus(e => this.onFocusChange()));
		this._register(this.keybindingsTable.onDidFocus(() => {
			this.keybindingsTable.getHTMLElement().classList.add('focused');
			this.onFocusChange();
		}));
		this._register(this.keybindingsTable.onDidBlur(() => {
			this.keybindingsTable.getHTMLElement().classList.remove('focused');
			this.keybindingFocusContextKey.reset();
		}));
		this._register(this.keybindingsTable.onDidOpen((e) => {
			// stop double click action on the input #148493
			if (e.browserEvent?.defaultPrevented) {
				return;
			}
			const activeKeybindingEntry = this.activeKeybindingEntry;
			if (activeKeybindingEntry) {
				this.defineKeybinding(activeKeybindingEntry, false);
			}
		}));

		DOM.append(this.keybindingsTableContainer, this.overflowWidgetsDomNode);
	}

	private async render(preserveFocus: boolean): Promise<void> {
		if (this.input) {
			const input: KeybindingsEditorInput = this.input as KeybindingsEditorInput;
			this.keybindingsEditorModel = await input.resolve();
			await this.keybindingsEditorModel.resolve(this.getActionsLabels());
			this.renderKeybindingsEntries(false, preserveFocus);
			if (input.searchOptions) {
				this.recordKeysAction.checked = input.searchOptions.recordKeybindings;
				this.sortByPrecedenceAction.checked = input.searchOptions.sortByPrecedence;
				this.searchWidget.setValue(input.searchOptions.searchValue);
			} else {
				this.updateSearchOptions();
			}
		}
	}

	private getActionsLabels(): Map<string, string> {
		const actionsLabels: Map<string, string> = new Map<string, string>();
		for (const editorAction of EditorExtensionsRegistry.getEditorActions()) {
			actionsLabels.set(editorAction.id, editorAction.label);
		}
		for (const menuItem of MenuRegistry.getMenuItems(MenuId.CommandPalette)) {
			if (isIMenuItem(menuItem)) {
				const title = typeof menuItem.command.title === 'string' ? menuItem.command.title : menuItem.command.title.value;
				const category = menuItem.command.category ? typeof menuItem.command.category === 'string' ? menuItem.command.category : menuItem.command.category.value : undefined;
				actionsLabels.set(menuItem.command.id, category ? `${category}: ${title}` : title);
			}
		}
		return actionsLabels;
	}

	private filterKeybindings(): void {
		this.renderKeybindingsEntries(this.searchWidget.hasFocus());
		this.searchHistoryDelayer.trigger(() => {
			this.searchWidget.inputBox.addToHistory();
			(this.getMemento(StorageScope.PROFILE, StorageTarget.USER)).searchHistory = this.searchWidget.inputBox.getHistory();
			this.saveState();
		});
	}

	public clearKeyboardShortcutSearchHistory(): void {
		this.searchWidget.inputBox.clearHistory();
		(this.getMemento(StorageScope.PROFILE, StorageTarget.USER)).searchHistory = this.searchWidget.inputBox.getHistory();
		this.saveState();
	}

	private renderKeybindingsEntries(reset: boolean, preserveFocus?: boolean): void {
		if (this.keybindingsEditorModel) {
			const filter = this.searchWidget.getValue();
			const keybindingsEntries: IKeybindingItemEntry[] = this.keybindingsEditorModel.fetch(filter, this.sortByPrecedenceAction.checked);
			this.accessibilityService.alert(localize('foundResults', "{0} results", keybindingsEntries.length));
			this.ariaLabelElement.setAttribute('aria-label', this.getAriaLabel(keybindingsEntries));

			if (keybindingsEntries.length === 0) {
				this.latestEmptyFilters.push(filter);
			}
			const currentSelectedIndex = this.keybindingsTable.getSelection()[0];
			this.tableEntries = keybindingsEntries;
			this.keybindingsTable.splice(0, this.keybindingsTable.length, this.tableEntries);
			this.layoutKeybindingsTable();

			if (reset) {
				this.keybindingsTable.setSelection([]);
				this.keybindingsTable.setFocus([]);
			} else {
				if (this.unAssignedKeybindingItemToRevealAndFocus) {
					const index = this.getNewIndexOfUnassignedKeybinding(this.unAssignedKeybindingItemToRevealAndFocus);
					if (index !== -1) {
						this.keybindingsTable.reveal(index, 0.2);
						this.selectEntry(index);
					}
					this.unAssignedKeybindingItemToRevealAndFocus = null;
				} else if (currentSelectedIndex !== -1 && currentSelectedIndex < this.tableEntries.length) {
					this.selectEntry(currentSelectedIndex, preserveFocus);
				} else if (this.editorService.activeEditorPane === this && !preserveFocus) {
					this.focus();
				}
			}
		}
	}

	private getAriaLabel(keybindingsEntries: IKeybindingItemEntry[]): string {
		if (this.sortByPrecedenceAction.checked) {
			return localize('show sorted keybindings', "Showing {0} Keybindings in precedence order", keybindingsEntries.length);
		} else {
			return localize('show keybindings', "Showing {0} Keybindings in alphabetical order", keybindingsEntries.length);
		}
	}

	private layoutKeybindingsTable(): void {
		if (!this.dimension) {
			return;
		}

		const tableHeight = this.dimension.height - (DOM.getDomNodePagePosition(this.headerContainer).height + 12 /*padding*/);
		this.keybindingsTableContainer.style.height = `${tableHeight}px`;
		this.keybindingsTable.layout(tableHeight);
	}

	private getIndexOf(listEntry: IKeybindingItemEntry): number {
		const index = this.tableEntries.indexOf(listEntry);
		if (index === -1) {
			for (let i = 0; i < this.tableEntries.length; i++) {
				if (this.tableEntries[i].id === listEntry.id) {
					return i;
				}
			}
		}
		return index;
	}

	private getNewIndexOfUnassignedKeybinding(unassignedKeybinding: IKeybindingItemEntry): number {
		for (let index = 0; index < this.tableEntries.length; index++) {
			const entry = this.tableEntries[index];
			if (entry.templateId === KEYBINDING_ENTRY_TEMPLATE_ID) {
				const keybindingItemEntry = (<IKeybindingItemEntry>entry);
				if (keybindingItemEntry.keybindingItem.command === unassignedKeybinding.keybindingItem.command) {
					return index;
				}
			}
		}
		return -1;
	}

	private selectEntry(keybindingItemEntry: IKeybindingItemEntry | number, focus: boolean = true): void {
		const index = typeof keybindingItemEntry === 'number' ? keybindingItemEntry : this.getIndexOf(keybindingItemEntry);
		if (index !== -1 && index < this.keybindingsTable.length) {
			if (focus) {
				this.keybindingsTable.domFocus();
				this.keybindingsTable.setFocus([index]);
			}
			this.keybindingsTable.setSelection([index]);
		}
	}

	focusKeybindings(): void {
		this.keybindingsTable.domFocus();
		const currentFocusIndices = this.keybindingsTable.getFocus();
		this.keybindingsTable.setFocus([currentFocusIndices.length ? currentFocusIndices[0] : 0]);
	}

	selectKeybinding(keybindingItemEntry: IKeybindingItemEntry): void {
		this.selectEntry(keybindingItemEntry);
	}

	recordSearchKeys(): void {
		this.recordKeysAction.checked = true;
	}

	toggleSortByPrecedence(): void {
		this.sortByPrecedenceAction.checked = !this.sortByPrecedenceAction.checked;
	}

	private onContextMenu(e: IListContextMenuEvent<IKeybindingItemEntry>): void {
		if (!e.element) {
			return;
		}

		if (e.element.templateId === KEYBINDING_ENTRY_TEMPLATE_ID) {
			const keybindingItemEntry = <IKeybindingItemEntry>e.element;
			this.selectEntry(keybindingItemEntry);
			this.contextMenuService.showContextMenu({
				getAnchor: () => e.anchor,
				getActions: () => [
					this.createCopyAction(keybindingItemEntry),
					this.createCopyCommandAction(keybindingItemEntry),
					this.createCopyCommandTitleAction(keybindingItemEntry),
					new Separator(),
					...(keybindingItemEntry.keybindingItem.keybinding
						? [this.createDefineKeybindingAction(keybindingItemEntry), this.createAddKeybindingAction(keybindingItemEntry)]
						: [this.createDefineKeybindingAction(keybindingItemEntry)]),
					new Separator(),
					this.createRemoveAction(keybindingItemEntry),
					this.createResetAction(keybindingItemEntry),
					new Separator(),
					this.createDefineWhenExpressionAction(keybindingItemEntry),
					new Separator(),
					this.createShowConflictsAction(keybindingItemEntry)]
			});
		}
	}

	private onFocusChange(): void {
		this.keybindingFocusContextKey.reset();
		const element = this.keybindingsTable.getFocusedElements()[0];
		if (!element) {
			return;
		}
		if (element.templateId === KEYBINDING_ENTRY_TEMPLATE_ID) {
			this.keybindingFocusContextKey.set(true);
		}
	}

	private createDefineKeybindingAction(keybindingItemEntry: IKeybindingItemEntry): IAction {
		return <IAction>{
			label: keybindingItemEntry.keybindingItem.keybinding ? localize('changeLabel', "Change Keybinding...") : localize('addLabel', "Add Keybinding..."),
			enabled: true,
			id: KEYBINDINGS_EDITOR_COMMAND_DEFINE,
			run: () => this.defineKeybinding(keybindingItemEntry, false)
		};
	}

	private createAddKeybindingAction(keybindingItemEntry: IKeybindingItemEntry): IAction {
		return <IAction>{
			label: localize('addLabel', "Add Keybinding..."),
			enabled: true,
			id: KEYBINDINGS_EDITOR_COMMAND_ADD,
			run: () => this.defineKeybinding(keybindingItemEntry, true)
		};
	}

	private createDefineWhenExpressionAction(keybindingItemEntry: IKeybindingItemEntry): IAction {
		return <IAction>{
			label: localize('editWhen', "Change When Expression"),
			enabled: !!keybindingItemEntry.keybindingItem.keybinding,
			id: KEYBINDINGS_EDITOR_COMMAND_DEFINE_WHEN,
			run: () => this.defineWhenExpression(keybindingItemEntry)
		};
	}

	private createRemoveAction(keybindingItem: IKeybindingItemEntry): IAction {
		return <IAction>{
			label: localize('removeLabel', "Remove Keybinding"),
			enabled: !!keybindingItem.keybindingItem.keybinding,
			id: KEYBINDINGS_EDITOR_COMMAND_REMOVE,
			run: () => this.removeKeybinding(keybindingItem)
		};
	}

	private createResetAction(keybindingItem: IKeybindingItemEntry): IAction {
		return <IAction>{
			label: localize('resetLabel', "Reset Keybinding"),
			enabled: !keybindingItem.keybindingItem.keybindingItem.isDefault,
			id: KEYBINDINGS_EDITOR_COMMAND_RESET,
			run: () => this.resetKeybinding(keybindingItem)
		};
	}

	private createShowConflictsAction(keybindingItem: IKeybindingItemEntry): IAction {
		return <IAction>{
			label: localize('showSameKeybindings', "Show Same Keybindings"),
			enabled: !!keybindingItem.keybindingItem.keybinding,
			id: KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR,
			run: () => this.showSimilarKeybindings(keybindingItem)
		};
	}

	private createCopyAction(keybindingItem: IKeybindingItemEntry): IAction {
		return <IAction>{
			label: localize('copyLabel', "Copy"),
			enabled: true,
			id: KEYBINDINGS_EDITOR_COMMAND_COPY,
			run: () => this.copyKeybinding(keybindingItem)
		};
	}

	private createCopyCommandAction(keybinding: IKeybindingItemEntry): IAction {
		return <IAction>{
			label: localize('copyCommandLabel', "Copy Command ID"),
			enabled: true,
			id: KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND,
			run: () => this.copyKeybindingCommand(keybinding)
		};
	}

	private createCopyCommandTitleAction(keybinding: IKeybindingItemEntry): IAction {
		return <IAction>{
			label: localize('copyCommandTitleLabel', "Copy Command Title"),
			enabled: !!keybinding.keybindingItem.commandLabel,
			id: KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND_TITLE,
			run: () => this.copyKeybindingCommandTitle(keybinding)
		};
	}

	private onKeybindingEditingError(error: unknown): void {
		this.notificationService.error(typeof error === 'string' ? error : localize('error', "Error '{0}' while editing the keybinding. Please open 'keybindings.json' file and check for errors.", `${error}`));
	}
}

class Delegate implements ITableVirtualDelegate<IKeybindingItemEntry> {

	readonly headerRowHeight = 30;

	getHeight(element: IKeybindingItemEntry) {
		if (element.templateId === KEYBINDING_ENTRY_TEMPLATE_ID) {
			const commandIdMatched = (<IKeybindingItemEntry>element).keybindingItem.commandLabel && (<IKeybindingItemEntry>element).commandIdMatches;
			const commandDefaultLabelMatched = !!(<IKeybindingItemEntry>element).commandDefaultLabelMatches;
			const extensionIdMatched = !!(<IKeybindingItemEntry>element).extensionIdMatches;
			if (commandIdMatched && commandDefaultLabelMatched) {
				return 60;
			}
			if (extensionIdMatched || commandIdMatched || commandDefaultLabelMatched) {
				return 40;
			}
		}
		return 24;
	}

}

interface IActionsColumnTemplateData {
	readonly actionBar: ActionBar;
}

class ActionsColumnRenderer implements ITableRenderer<IKeybindingItemEntry, IActionsColumnTemplateData> {

	static readonly TEMPLATE_ID = 'actions';

	readonly templateId: string = ActionsColumnRenderer.TEMPLATE_ID;

	constructor(
		private readonly keybindingsEditor: KeybindingsEditor,
		@IKeybindingService private readonly keybindingsService: IKeybindingService
	) {
	}

	renderTemplate(container: HTMLElement): IActionsColumnTemplateData {
		const element = DOM.append(container, $('.actions'));
		const actionBar = new ActionBar(element);
		return { actionBar };
	}

	renderElement(keybindingItemEntry: IKeybindingItemEntry, index: number, templateData: IActionsColumnTemplateData): void {
		templateData.actionBar.clear();
		const actions: IAction[] = [];
		if (keybindingItemEntry.keybindingItem.keybinding) {
			actions.push(this.createEditAction(keybindingItemEntry));
		} else {
			actions.push(this.createAddAction(keybindingItemEntry));
		}
		templateData.actionBar.push(actions, { icon: true });
	}

	private createEditAction(keybindingItemEntry: IKeybindingItemEntry): IAction {
		const keybinding = this.keybindingsService.lookupKeybinding(KEYBINDINGS_EDITOR_COMMAND_DEFINE);
		return <IAction>{
			class: ThemeIcon.asClassName(keybindingsEditIcon),
			enabled: true,
			id: 'editKeybinding',
			tooltip: keybinding ? localize('editKeybindingLabelWithKey', "Change Keybinding {0}", `(${keybinding.getLabel()})`) : localize('editKeybindingLabel', "Change Keybinding"),
			run: () => this.keybindingsEditor.defineKeybinding(keybindingItemEntry, false)
		};
	}

	private createAddAction(keybindingItemEntry: IKeybindingItemEntry): IAction {
		const keybinding = this.keybindingsService.lookupKeybinding(KEYBINDINGS_EDITOR_COMMAND_DEFINE);
		return <IAction>{
			class: ThemeIcon.asClassName(keybindingsAddIcon),
			enabled: true,
			id: 'addKeybinding',
			tooltip: keybinding ? localize('addKeybindingLabelWithKey', "Add Keybinding {0}", `(${keybinding.getLabel()})`) : localize('addKeybindingLabel', "Add Keybinding"),
			run: () => this.keybindingsEditor.defineKeybinding(keybindingItemEntry, false)
		};
	}

	disposeTemplate(templateData: IActionsColumnTemplateData): void {
		templateData.actionBar.dispose();
	}

}

interface ICommandColumnTemplateData {
	commandColumn: HTMLElement;
	commandColumnHover: IManagedHover;
	commandLabelContainer: HTMLElement;
	commandLabel: HighlightedLabel;
	commandDefaultLabelContainer: HTMLElement;
	commandDefaultLabel: HighlightedLabel;
	commandIdLabelContainer: HTMLElement;
	commandIdLabel: HighlightedLabel;
}

class CommandColumnRenderer implements ITableRenderer<IKeybindingItemEntry, ICommandColumnTemplateData> {

	static readonly TEMPLATE_ID = 'commands';

	readonly templateId: string = CommandColumnRenderer.TEMPLATE_ID;

	constructor(
		@IHoverService private readonly _hoverService: IHoverService
	) {
	}

	renderTemplate(container: HTMLElement): ICommandColumnTemplateData {
		const commandColumn = DOM.append(container, $('.command'));
		const commandColumnHover = this._hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), commandColumn, '');
		const commandLabelContainer = DOM.append(commandColumn, $('.command-label'));
		const commandLabel = new HighlightedLabel(commandLabelContainer);
		const commandDefaultLabelContainer = DOM.append(commandColumn, $('.command-default-label'));
		const commandDefaultLabel = new HighlightedLabel(commandDefaultLabelContainer);
		const commandIdLabelContainer = DOM.append(commandColumn, $('.command-id.code'));
		const commandIdLabel = new HighlightedLabel(commandIdLabelContainer);
		return { commandColumn, commandColumnHover, commandLabelContainer, commandLabel, commandDefaultLabelContainer, commandDefaultLabel, commandIdLabelContainer, commandIdLabel };
	}

	renderElement(keybindingItemEntry: IKeybindingItemEntry, index: number, templateData: ICommandColumnTemplateData): void {
		const keybindingItem = keybindingItemEntry.keybindingItem;
		const commandIdMatched = !!(keybindingItem.commandLabel && keybindingItemEntry.commandIdMatches);
		const commandDefaultLabelMatched = !!keybindingItemEntry.commandDefaultLabelMatches;

		templateData.commandColumn.classList.toggle('vertical-align-column', commandIdMatched || commandDefaultLabelMatched);
		const title = keybindingItem.commandLabel ? localize('title', "{0} ({1})", keybindingItem.commandLabel, keybindingItem.command) : keybindingItem.command;
		templateData.commandColumn.setAttribute('aria-label', title);
		templateData.commandColumnHover.update(title);

		if (keybindingItem.commandLabel) {
			templateData.commandLabelContainer.classList.remove('hide');
			templateData.commandLabel.set(keybindingItem.commandLabel, keybindingItemEntry.commandLabelMatches);
		} else {
			templateData.commandLabelContainer.classList.add('hide');
			templateData.commandLabel.set(undefined);
		}

		if (keybindingItemEntry.commandDefaultLabelMatches) {
			templateData.commandDefaultLabelContainer.classList.remove('hide');
			templateData.commandDefaultLabel.set(keybindingItem.commandDefaultLabel, keybindingItemEntry.commandDefaultLabelMatches);
		} else {
			templateData.commandDefaultLabelContainer.classList.add('hide');
			templateData.commandDefaultLabel.set(undefined);
		}

		if (keybindingItemEntry.commandIdMatches || !keybindingItem.commandLabel) {
			templateData.commandIdLabelContainer.classList.remove('hide');
			templateData.commandIdLabel.set(keybindingItem.command, keybindingItemEntry.commandIdMatches);
		} else {
			templateData.commandIdLabelContainer.classList.add('hide');
			templateData.commandIdLabel.set(undefined);
		}
	}

	disposeTemplate(templateData: ICommandColumnTemplateData): void {
		templateData.commandColumnHover.dispose();
		templateData.commandDefaultLabel.dispose();
		templateData.commandIdLabel.dispose();
		templateData.commandLabel.dispose();
	}
}

interface IKeybindingColumnTemplateData {
	keybindingLabel: KeybindingLabel;
}

class KeybindingColumnRenderer implements ITableRenderer<IKeybindingItemEntry, IKeybindingColumnTemplateData> {

	static readonly TEMPLATE_ID = 'keybindings';

	readonly templateId: string = KeybindingColumnRenderer.TEMPLATE_ID;

	constructor() { }

	renderTemplate(container: HTMLElement): IKeybindingColumnTemplateData {
		const element = DOM.append(container, $('.keybinding'));
		const keybindingLabel = new KeybindingLabel(DOM.append(element, $('div.keybinding-label')), OS, defaultKeybindingLabelStyles);
		return { keybindingLabel };
	}

	renderElement(keybindingItemEntry: IKeybindingItemEntry, index: number, templateData: IKeybindingColumnTemplateData): void {
		if (keybindingItemEntry.keybindingItem.keybinding) {
			templateData.keybindingLabel.set(keybindingItemEntry.keybindingItem.keybinding, keybindingItemEntry.keybindingMatches);
		} else {
			templateData.keybindingLabel.set(undefined, undefined);
		}
	}

	disposeTemplate(templateData: IKeybindingColumnTemplateData): void {
		templateData.keybindingLabel.dispose();
	}
}

interface ISourceColumnTemplateData {
	sourceColumn: HTMLElement;
	sourceColumnHover: IManagedHover;
	sourceLabel: HighlightedLabel;
	extensionContainer: HTMLElement;
	extensionLabel: HTMLAnchorElement;
	extensionId: HighlightedLabel;
	disposables: DisposableStore;
}

function onClick(element: HTMLElement, callback: () => void): IDisposable {
	const disposables = new DisposableStore();
	disposables.add(DOM.addDisposableListener(element, DOM.EventType.CLICK, DOM.finalHandler(callback)));
	disposables.add(DOM.addDisposableListener(element, DOM.EventType.KEY_UP, e => {
		const keyboardEvent = new StandardKeyboardEvent(e);
		if (keyboardEvent.equals(KeyCode.Space) || keyboardEvent.equals(KeyCode.Enter)) {
			e.preventDefault();
			e.stopPropagation();
			callback();
		}
	}));
	return disposables;
}

class SourceColumnRenderer implements ITableRenderer<IKeybindingItemEntry, ISourceColumnTemplateData> {

	static readonly TEMPLATE_ID = 'source';

	readonly templateId: string = SourceColumnRenderer.TEMPLATE_ID;

	constructor(
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IHoverService private readonly hoverService: IHoverService,
	) { }

	renderTemplate(container: HTMLElement): ISourceColumnTemplateData {
		const sourceColumn = DOM.append(container, $('.source'));
		const sourceColumnHover = this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), sourceColumn, '');
		const sourceLabel = new HighlightedLabel(DOM.append(sourceColumn, $('.source-label')));
		const extensionContainer = DOM.append(sourceColumn, $('.extension-container'));
		const extensionLabel = DOM.append<HTMLAnchorElement>(extensionContainer, $('a.extension-label', { tabindex: 0 }));
		const extensionId = new HighlightedLabel(DOM.append(extensionContainer, $('.extension-id-container.code')));
		return { sourceColumn, sourceColumnHover, sourceLabel, extensionLabel, extensionContainer, extensionId, disposables: new DisposableStore() };
	}

	renderElement(keybindingItemEntry: IKeybindingItemEntry, index: number, templateData: ISourceColumnTemplateData): void {
		templateData.disposables.clear();
		if (isString(keybindingItemEntry.keybindingItem.source)) {
			templateData.extensionContainer.classList.add('hide');
			templateData.sourceLabel.element.classList.remove('hide');
			templateData.sourceColumnHover.update('');
			templateData.sourceLabel.set(keybindingItemEntry.keybindingItem.source || '-', keybindingItemEntry.sourceMatches);
		} else {
			templateData.extensionContainer.classList.remove('hide');
			templateData.sourceLabel.element.classList.add('hide');
			const extension = keybindingItemEntry.keybindingItem.source;
			const extensionLabel = extension.displayName ?? extension.identifier.value;
			templateData.sourceColumnHover.update(localize('extension label', "Extension ({0})", extensionLabel));
			templateData.extensionLabel.textContent = extensionLabel;
			templateData.disposables.add(onClick(templateData.extensionLabel, () => {
				this.extensionsWorkbenchService.open(extension.identifier.value);
			}));
			if (keybindingItemEntry.extensionIdMatches) {
				templateData.extensionId.element.classList.remove('hide');
				templateData.extensionId.set(extension.identifier.value, keybindingItemEntry.extensionIdMatches);
			} else {
				templateData.extensionId.element.classList.add('hide');
				templateData.extensionId.set(undefined);
			}
		}
	}

	disposeTemplate(templateData: ISourceColumnTemplateData): void {
		templateData.sourceColumnHover.dispose();
		templateData.disposables.dispose();
		templateData.sourceLabel.dispose();
		templateData.extensionId.dispose();
	}
}

class WhenInputWidget extends Disposable {

	private readonly input: SuggestEnabledInput;

	private readonly _onDidAccept = this._register(new Emitter<string>());
	readonly onDidAccept = this._onDidAccept.event;

	private readonly _onDidReject = this._register(new Emitter<void>());
	readonly onDidReject = this._onDidReject.event;

	constructor(
		parent: HTMLElement,
		keybindingsEditor: KeybindingsEditor,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super();
		const focusContextKey = CONTEXT_WHEN_FOCUS.bindTo(contextKeyService);
		this.input = this._register(instantiationService.createInstance(SuggestEnabledInput, 'keyboardshortcutseditor#wheninput', parent, {
			provideResults: () => {
				const result = [];
				for (const contextKey of RawContextKey.all()) {
					result.push({ label: contextKey.key, documentation: contextKey.description, detail: contextKey.type, kind: CompletionItemKind.Constant });
				}
				return result;
			},
			triggerCharacters: ['!', ' '],
			wordDefinition: /[a-zA-Z.]+/,
			alwaysShowSuggestions: true,
		}, '', `keyboardshortcutseditor#wheninput`, { focusContextKey, overflowWidgetsDomNode: keybindingsEditor.overflowWidgetsDomNode }));

		this._register((DOM.addDisposableListener(this.input.element, DOM.EventType.DBLCLICK, e => DOM.EventHelper.stop(e))));
		this._register(toDisposable(() => focusContextKey.reset()));

		this._register(keybindingsEditor.onAcceptWhenExpression(() => this._onDidAccept.fire(this.input.getValue())));
		this._register(Event.any(keybindingsEditor.onRejectWhenExpression, this.input.onDidBlur)(() => this._onDidReject.fire()));
	}

	layout(dimension: DOM.Dimension): void {
		this.input.layout(dimension);
	}

	show(value: string): void {
		this.input.setValue(value);
		this.input.focus(true);
	}

}

interface IWhenColumnTemplateData {
	readonly element: HTMLElement;
	readonly whenLabelContainer: HTMLElement;
	readonly whenInputContainer: HTMLElement;
	readonly whenLabel: HighlightedLabel;
	readonly disposables: DisposableStore;
}

class WhenColumnRenderer implements ITableRenderer<IKeybindingItemEntry, IWhenColumnTemplateData> {

	static readonly TEMPLATE_ID = 'when';

	readonly templateId: string = WhenColumnRenderer.TEMPLATE_ID;

	constructor(
		private readonly keybindingsEditor: KeybindingsEditor,
		@IHoverService private readonly hoverService: IHoverService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	renderTemplate(container: HTMLElement): IWhenColumnTemplateData {
		const element = DOM.append(container, $('.when'));

		const whenLabelContainer = DOM.append(element, $('div.when-label'));
		const whenLabel = new HighlightedLabel(whenLabelContainer);

		const whenInputContainer = DOM.append(element, $('div.when-input-container'));

		return {
			element,
			whenLabelContainer,
			whenLabel,
			whenInputContainer,
			disposables: new DisposableStore(),
		};
	}

	renderElement(keybindingItemEntry: IKeybindingItemEntry, index: number, templateData: IWhenColumnTemplateData): void {
		templateData.disposables.clear();
		const whenInputDisposables = templateData.disposables.add(new DisposableStore());
		templateData.disposables.add(this.keybindingsEditor.onDefineWhenExpression(e => {
			if (keybindingItemEntry === e) {
				templateData.element.classList.add('input-mode');

				const inputWidget = whenInputDisposables.add(this.instantiationService.createInstance(WhenInputWidget, templateData.whenInputContainer, this.keybindingsEditor));
				inputWidget.layout(new DOM.Dimension(templateData.element.parentElement!.clientWidth, 18));
				inputWidget.show(keybindingItemEntry.keybindingItem.when || '');

				const hideInputWidget = () => {
					whenInputDisposables.clear();
					templateData.element.classList.remove('input-mode');
					templateData.element.parentElement!.style.paddingLeft = '10px';
					DOM.clearNode(templateData.whenInputContainer);
				};

				whenInputDisposables.add(inputWidget.onDidAccept(value => {
					hideInputWidget();
					this.keybindingsEditor.updateKeybinding(keybindingItemEntry, keybindingItemEntry.keybindingItem.keybinding ? keybindingItemEntry.keybindingItem.keybinding.getUserSettingsLabel() || '' : '', value);
					this.keybindingsEditor.selectKeybinding(keybindingItemEntry);
				}));

				whenInputDisposables.add(inputWidget.onDidReject(() => {
					hideInputWidget();
					this.keybindingsEditor.selectKeybinding(keybindingItemEntry);
				}));

				templateData.element.parentElement!.style.paddingLeft = '0px';
			}
		}));

		templateData.whenLabelContainer.classList.toggle('code', !!keybindingItemEntry.keybindingItem.when);
		templateData.whenLabelContainer.classList.toggle('empty', !keybindingItemEntry.keybindingItem.when);

		if (keybindingItemEntry.keybindingItem.when) {
			templateData.whenLabel.set(keybindingItemEntry.keybindingItem.when, keybindingItemEntry.whenMatches, keybindingItemEntry.keybindingItem.when);
			templateData.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), templateData.element, keybindingItemEntry.keybindingItem.when));
		} else {
			templateData.whenLabel.set('-');
		}
	}

	disposeTemplate(templateData: IWhenColumnTemplateData): void {
		templateData.disposables.dispose();
		templateData.whenLabel.dispose();
	}
}

class AccessibilityProvider implements IListAccessibilityProvider<IKeybindingItemEntry> {

	constructor(private readonly configurationService: IConfigurationService) { }

	getWidgetAriaLabel(): string {
		return localize('keybindingsLabel', "Keybindings");
	}

	getAriaLabel({ keybindingItem }: IKeybindingItemEntry): string {
		const ariaLabel = [
			keybindingItem.commandLabel ? keybindingItem.commandLabel : keybindingItem.command,
			keybindingItem.keybinding?.getAriaLabel() || localize('noKeybinding', "No keybinding assigned"),
			keybindingItem.when ? keybindingItem.when : localize('noWhen', "No when context"),
			isString(keybindingItem.source) ? keybindingItem.source : keybindingItem.source.description ?? keybindingItem.source.identifier.value,
		];
		if (this.configurationService.getValue(AccessibilityVerbositySettingId.KeybindingsEditor)) {
			const kbEditorAriaLabel = localize('keyboard shortcuts aria label', "use space or enter to change the keybinding.");
			ariaLabel.push(kbEditorAriaLabel);
		}
		return ariaLabel.join(', ');
	}
}

registerColor('keybindingTable.headerBackground', tableOddRowsBackgroundColor, 'Background color for the keyboard shortcuts table header.');
registerColor('keybindingTable.rowsBackground', tableOddRowsBackgroundColor, 'Background color for the keyboard shortcuts table alternating rows.');

registerThemingParticipant((theme: IColorTheme, collector: ICssStyleCollector) => {
	const foregroundColor = theme.getColor(foreground);
	if (foregroundColor) {
		const whenForegroundColor = foregroundColor.transparent(.8).makeOpaque(WORKBENCH_BACKGROUND(theme));
		collector.addRule(`.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table .monaco-table-tr .monaco-table-td .code { color: ${whenForegroundColor}; }`);
	}

	const listActiveSelectionForegroundColor = theme.getColor(listActiveSelectionForeground);
	const listActiveSelectionBackgroundColor = theme.getColor(listActiveSelectionBackground);
	if (listActiveSelectionForegroundColor && listActiveSelectionBackgroundColor) {
		const whenForegroundColor = listActiveSelectionForegroundColor.transparent(.8).makeOpaque(listActiveSelectionBackgroundColor);
		collector.addRule(`.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table.focused .monaco-list-row.selected .monaco-table-tr .monaco-table-td .code { color: ${whenForegroundColor}; }`);
	}

	const listInactiveSelectionForegroundColor = theme.getColor(listInactiveSelectionForeground);
	const listInactiveSelectionBackgroundColor = theme.getColor(listInactiveSelectionBackground);
	if (listInactiveSelectionForegroundColor && listInactiveSelectionBackgroundColor) {
		const whenForegroundColor = listInactiveSelectionForegroundColor.transparent(.8).makeOpaque(listInactiveSelectionBackgroundColor);
		collector.addRule(`.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table .monaco-list-row.selected .monaco-table-tr .monaco-table-td .code { color: ${whenForegroundColor}; }`);
	}

	const listFocusForegroundColor = theme.getColor(listFocusForeground);
	const listFocusBackgroundColor = theme.getColor(listFocusBackground);
	if (listFocusForegroundColor && listFocusBackgroundColor) {
		const whenForegroundColor = listFocusForegroundColor.transparent(.8).makeOpaque(listFocusBackgroundColor);
		collector.addRule(`.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table.focused .monaco-list-row.focused .monaco-table-tr .monaco-table-td .code { color: ${whenForegroundColor}; }`);
	}

	const listHoverForegroundColor = theme.getColor(listHoverForeground);
	const listHoverBackgroundColor = theme.getColor(listHoverBackground);
	if (listHoverForegroundColor && listHoverBackgroundColor) {
		const whenForegroundColor = listHoverForegroundColor.transparent(.8).makeOpaque(listHoverBackgroundColor);
		collector.addRule(`.keybindings-editor > .keybindings-body > .keybindings-table-container .monaco-table.focused .monaco-list-row:hover:not(.focused):not(.selected) .monaco-table-tr .monaco-table-td .code { color: ${whenForegroundColor}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/keybindingsEditorContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/keybindingsEditorContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Range } from '../../../../editor/common/core/range.js';
import { registerEditorContribution, EditorContributionInstantiation } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { SnippetController2 } from '../../../../editor/contrib/snippet/browser/snippetController2.js';
import { SmartSnippetInserter } from '../common/smartSnippetInserter.js';
import { DefineKeybindingOverlayWidget } from './keybindingWidgets.js';
import { parseTree, Node } from '../../../../base/common/json.js';
import { WindowsNativeResolvedKeybinding } from '../../../services/keybinding/common/windowsKeyboardMapper.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { ThemeColor } from '../../../../base/common/themables.js';
import { overviewRulerInfo, overviewRulerError } from '../../../../editor/common/core/editorColorRegistry.js';
import { IModelDeltaDecoration, ITextModel, TrackedRangeStickiness, OverviewRulerLane } from '../../../../editor/common/model.js';
import { KeybindingParser } from '../../../../base/common/keybindingParser.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { isEqual } from '../../../../base/common/resources.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { DEFINE_KEYBINDING_EDITOR_CONTRIB_ID, IDefineKeybindingEditorContribution } from '../../../services/preferences/common/preferences.js';
import { IEditorDecorationsCollection } from '../../../../editor/common/editorCommon.js';

const NLS_KB_LAYOUT_ERROR_MESSAGE = nls.localize('defineKeybinding.kbLayoutErrorMessage', "You won't be able to produce this key combination under your current keyboard layout.");

class DefineKeybindingEditorContribution extends Disposable implements IDefineKeybindingEditorContribution {

	private readonly _keybindingDecorationRenderer = this._register(new MutableDisposable<KeybindingEditorDecorationsRenderer>());

	private readonly _defineWidget: DefineKeybindingOverlayWidget;

	constructor(
		private _editor: ICodeEditor,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IUserDataProfileService private readonly _userDataProfileService: IUserDataProfileService
	) {
		super();

		this._defineWidget = this._register(this._instantiationService.createInstance(DefineKeybindingOverlayWidget, this._editor));
		this._register(this._editor.onDidChangeModel(e => this._update()));
		this._update();
	}

	private _update(): void {
		this._keybindingDecorationRenderer.value = isInterestingEditorModel(this._editor, this._userDataProfileService)
			// Decorations are shown for the default keybindings.json **and** for the user keybindings.json
			? this._instantiationService.createInstance(KeybindingEditorDecorationsRenderer, this._editor)
			: undefined;
	}

	showDefineKeybindingWidget(): void {
		if (isInterestingEditorModel(this._editor, this._userDataProfileService)) {
			this._defineWidget.start().then(keybinding => this._onAccepted(keybinding));
		}
	}

	private _onAccepted(keybinding: string | null): void {
		this._editor.focus();
		if (keybinding && this._editor.hasModel()) {
			const regexp = new RegExp(/\\/g);
			const backslash = regexp.test(keybinding);
			if (backslash) {
				keybinding = keybinding.slice(0, -1) + '\\\\';
			}
			let snippetText = [
				'{',
				'\t"key": ' + JSON.stringify(keybinding) + ',',
				'\t"command": "${1:commandId}",',
				'\t"when": "${2:editorTextFocus}"',
				'}$0'
			].join('\n');

			const smartInsertInfo = SmartSnippetInserter.insertSnippet(this._editor.getModel(), this._editor.getPosition());
			snippetText = smartInsertInfo.prepend + snippetText + smartInsertInfo.append;
			this._editor.setPosition(smartInsertInfo.position);

			SnippetController2.get(this._editor)?.insert(snippetText, { overwriteBefore: 0, overwriteAfter: 0 });
		}
	}
}

export class KeybindingEditorDecorationsRenderer extends Disposable {

	private _updateDecorations: RunOnceScheduler;
	private readonly _dec: IEditorDecorationsCollection;

	constructor(
		private _editor: ICodeEditor,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
	) {
		super();
		this._dec = this._editor.createDecorationsCollection();

		this._updateDecorations = this._register(new RunOnceScheduler(() => this._updateDecorationsNow(), 500));

		const model = assertReturnsDefined(this._editor.getModel());
		this._register(model.onDidChangeContent(() => this._updateDecorations.schedule()));
		this._register(this._keybindingService.onDidUpdateKeybindings(() => this._updateDecorations.schedule()));
		this._register({
			dispose: () => {
				this._dec.clear();
				this._updateDecorations.cancel();
			}
		});
		this._updateDecorations.schedule();
	}

	private _updateDecorationsNow(): void {
		const model = assertReturnsDefined(this._editor.getModel());

		const newDecorations: IModelDeltaDecoration[] = [];

		const root = parseTree(model.getValue());
		if (root && Array.isArray(root.children)) {
			for (let i = 0, len = root.children.length; i < len; i++) {
				const entry = root.children[i];
				const dec = this._getDecorationForEntry(model, entry);
				if (dec !== null) {
					newDecorations.push(dec);
				}
			}
		}

		this._dec.set(newDecorations);
	}

	private _getDecorationForEntry(model: ITextModel, entry: Node): IModelDeltaDecoration | null {
		if (!Array.isArray(entry.children)) {
			return null;
		}
		for (let i = 0, len = entry.children.length; i < len; i++) {
			const prop = entry.children[i];
			if (prop.type !== 'property') {
				continue;
			}
			if (!Array.isArray(prop.children) || prop.children.length !== 2) {
				continue;
			}
			const key = prop.children[0];
			if (key.value !== 'key') {
				continue;
			}
			const value = prop.children[1];
			if (value.type !== 'string') {
				continue;
			}

			const resolvedKeybindings = this._keybindingService.resolveUserBinding(value.value);
			if (resolvedKeybindings.length === 0) {
				return this._createDecoration(true, null, null, model, value);
			}
			const resolvedKeybinding = resolvedKeybindings[0];
			let usLabel: string | null = null;
			if (resolvedKeybinding instanceof WindowsNativeResolvedKeybinding) {
				usLabel = resolvedKeybinding.getUSLabel();
			}
			if (!resolvedKeybinding.isWYSIWYG()) {
				const uiLabel = resolvedKeybinding.getLabel();
				if (typeof uiLabel === 'string' && value.value.toLowerCase() === uiLabel.toLowerCase()) {
					// coincidentally, this is actually WYSIWYG
					return null;
				}
				return this._createDecoration(false, resolvedKeybinding.getLabel(), usLabel, model, value);
			}
			if (/abnt_|oem_/.test(value.value)) {
				return this._createDecoration(false, resolvedKeybinding.getLabel(), usLabel, model, value);
			}
			const expectedUserSettingsLabel = resolvedKeybinding.getUserSettingsLabel();
			if (typeof expectedUserSettingsLabel === 'string' && !KeybindingEditorDecorationsRenderer._userSettingsFuzzyEquals(value.value, expectedUserSettingsLabel)) {
				return this._createDecoration(false, resolvedKeybinding.getLabel(), usLabel, model, value);
			}
			return null;
		}
		return null;
	}

	static _userSettingsFuzzyEquals(a: string, b: string): boolean {
		a = a.trim().toLowerCase();
		b = b.trim().toLowerCase();

		if (a === b) {
			return true;
		}

		const aKeybinding = KeybindingParser.parseKeybinding(a);
		const bKeybinding = KeybindingParser.parseKeybinding(b);
		if (aKeybinding === null && bKeybinding === null) {
			return true;
		}
		if (!aKeybinding || !bKeybinding) {
			return false;
		}
		return aKeybinding.equals(bKeybinding);
	}

	private _createDecoration(isError: boolean, uiLabel: string | null, usLabel: string | null, model: ITextModel, keyNode: Node): IModelDeltaDecoration {
		let msg: MarkdownString;
		let className: string;
		let overviewRulerColor: ThemeColor;

		if (isError) {
			// this is the error case
			msg = new MarkdownString().appendText(NLS_KB_LAYOUT_ERROR_MESSAGE);
			className = 'keybindingError';
			overviewRulerColor = themeColorFromId(overviewRulerError);
		} else {
			// this is the info case
			if (usLabel && uiLabel !== usLabel) {
				msg = new MarkdownString(
					nls.localize({
						key: 'defineKeybinding.kbLayoutLocalAndUSMessage',
						comment: [
							'Please translate maintaining the stars (*) around the placeholders such that they will be rendered in bold.',
							'The placeholders will contain a keyboard combination e.g. Ctrl+Shift+/'
						]
					}, "**{0}** for your current keyboard layout (**{1}** for US standard).", uiLabel, usLabel)
				);
			} else {
				msg = new MarkdownString(
					nls.localize({
						key: 'defineKeybinding.kbLayoutLocalMessage',
						comment: [
							'Please translate maintaining the stars (*) around the placeholder such that it will be rendered in bold.',
							'The placeholder will contain a keyboard combination e.g. Ctrl+Shift+/'
						]
					}, "**{0}** for your current keyboard layout.", uiLabel)
				);
			}
			className = 'keybindingInfo';
			overviewRulerColor = themeColorFromId(overviewRulerInfo);
		}

		const startPosition = model.getPositionAt(keyNode.offset);
		const endPosition = model.getPositionAt(keyNode.offset + keyNode.length);
		const range = new Range(
			startPosition.lineNumber, startPosition.column,
			endPosition.lineNumber, endPosition.column
		);

		// icon + highlight + message decoration
		return {
			range: range,
			options: {
				description: 'keybindings-widget',
				stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
				className: className,
				hoverMessage: msg,
				overviewRuler: {
					color: overviewRulerColor,
					position: OverviewRulerLane.Right
				}
			}
		};
	}

}

function isInterestingEditorModel(editor: ICodeEditor, userDataProfileService: IUserDataProfileService): boolean {
	const model = editor.getModel();
	if (!model) {
		return false;
	}
	return isEqual(model.uri, userDataProfileService.currentProfile.keybindingsResource);
}

registerEditorContribution(DEFINE_KEYBINDING_EDITOR_CONTRIB_ID, DefineKeybindingEditorContribution, EditorContributionInstantiation.AfterFirstRender);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/keybindingWidgets.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/keybindingWidgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/keybindings.css';
import * as nls from '../../../../nls.js';
import { OS } from '../../../../base/common/platform.js';
import { Disposable, toDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { KeybindingLabel } from '../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import * as dom from '../../../../base/browser/dom.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { IKeyboardEvent, StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition } from '../../../../editor/browser/editorBrowser.js';
import { asCssVariable, editorWidgetBackground, editorWidgetForeground, widgetShadow } from '../../../../platform/theme/common/colorRegistry.js';
import { ScrollType } from '../../../../editor/common/editorCommon.js';
import { SearchWidget, SearchOptions } from './preferencesWidgets.js';
import { Promises, timeout } from '../../../../base/common/async.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { defaultInputBoxStyles, defaultKeybindingLabelStyles } from '../../../../platform/theme/browser/defaultStyles.js';

export interface KeybindingsSearchOptions extends SearchOptions {
	recordEnter?: boolean;
	quoteRecordedKeys?: boolean;
}

export class KeybindingsSearchWidget extends SearchWidget {

	private _chords: ResolvedKeybinding[] | null;
	private _inputValue: string;

	private readonly recordDisposables = this._register(new DisposableStore());

	private _onKeybinding = this._register(new Emitter<ResolvedKeybinding[] | null>());
	readonly onKeybinding: Event<ResolvedKeybinding[] | null> = this._onKeybinding.event;

	private _onEnter = this._register(new Emitter<void>());
	readonly onEnter: Event<void> = this._onEnter.event;

	private _onEscape = this._register(new Emitter<void>());
	readonly onEscape: Event<void> = this._onEscape.event;

	private _onBlur = this._register(new Emitter<void>());
	readonly onBlur: Event<void> = this._onBlur.event;

	constructor(parent: HTMLElement, options: KeybindingsSearchOptions,
		@IContextViewService contextViewService: IContextViewService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IKeybindingService keybindingService: IKeybindingService,
	) {
		super(parent, options, contextViewService, instantiationService, contextKeyService, keybindingService);

		this._register(toDisposable(() => this.stopRecordingKeys()));

		this._chords = null;
		this._inputValue = '';
	}

	override clear(): void {
		this._chords = null;
		super.clear();
	}

	startRecordingKeys(): void {
		this.recordDisposables.add(dom.addDisposableListener(this.inputBox.inputElement, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => this._onKeyDown(new StandardKeyboardEvent(e))));
		this.recordDisposables.add(dom.addDisposableListener(this.inputBox.inputElement, dom.EventType.BLUR, () => this._onBlur.fire()));
		this.recordDisposables.add(dom.addDisposableListener(this.inputBox.inputElement, dom.EventType.INPUT, () => {
			// Prevent other characters from showing up
			this.setInputValue(this._inputValue);
		}));
	}

	stopRecordingKeys(): void {
		this._chords = null;
		this.recordDisposables.clear();
	}

	setInputValue(value: string): void {
		this._inputValue = value;
		this.inputBox.value = this._inputValue;
	}

	private _onKeyDown(keyboardEvent: IKeyboardEvent): void {
		keyboardEvent.preventDefault();
		keyboardEvent.stopPropagation();
		const options = this.options as KeybindingsSearchOptions;
		if (!options.recordEnter && keyboardEvent.equals(KeyCode.Enter)) {
			this._onEnter.fire();
			return;
		}
		if (keyboardEvent.equals(KeyCode.Escape)) {
			this._onEscape.fire();
			return;
		}
		this.printKeybinding(keyboardEvent);
	}

	private printKeybinding(keyboardEvent: IKeyboardEvent): void {
		const keybinding = this.keybindingService.resolveKeyboardEvent(keyboardEvent);
		const info = `code: ${keyboardEvent.browserEvent.code}, keyCode: ${keyboardEvent.browserEvent.keyCode}, key: ${keyboardEvent.browserEvent.key} => UI: ${keybinding.getAriaLabel()}, user settings: ${keybinding.getUserSettingsLabel()}, dispatch: ${keybinding.getDispatchChords()[0]}`;
		const options = this.options as KeybindingsSearchOptions;

		if (!this._chords) {
			this._chords = [];
		}

		// TODO: note that we allow a keybinding "shift shift", but this widget doesn't allow input "shift shift" because the first "shift" will be incomplete - this is _not_ a regression
		const hasIncompleteChord = this._chords.length > 0 && this._chords[this._chords.length - 1].getDispatchChords()[0] === null;
		if (hasIncompleteChord) {
			this._chords[this._chords.length - 1] = keybinding;
		} else {
			if (this._chords.length === 2) { // TODO: limit chords # to 2 for now
				this._chords = [];
			}
			this._chords.push(keybinding);
		}

		const value = this._chords.map((keybinding) => keybinding.getUserSettingsLabel() || '').join(' ');
		this.setInputValue(options.quoteRecordedKeys ? `"${value}"` : value);

		this.inputBox.inputElement.title = info;
		this._onKeybinding.fire(this._chords);
	}
}

export class DefineKeybindingWidget extends Widget {

	private static readonly WIDTH = 400;
	private static readonly HEIGHT = 110;

	private _domNode: FastDomNode<HTMLElement>;
	private _keybindingInputWidget: KeybindingsSearchWidget;
	private _outputNode: HTMLElement;
	private _showExistingKeybindingsNode: HTMLElement;
	private readonly _keybindingDisposables = this._register(new DisposableStore());

	private _chords: ResolvedKeybinding[] | null = null;
	private _isVisible: boolean = false;

	private _onHide = this._register(new Emitter<void>());

	private _onDidChange = this._register(new Emitter<string>());
	readonly onDidChange: Event<string> = this._onDidChange.event;

	private _onShowExistingKeybindings = this._register(new Emitter<string | null>());
	readonly onShowExistingKeybidings: Event<string | null> = this._onShowExistingKeybindings.event;

	constructor(
		parent: HTMLElement | null,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this._domNode = createFastDomNode(document.createElement('div'));
		this._domNode.setDisplay('none');
		this._domNode.setClassName('defineKeybindingWidget');
		this._domNode.setWidth(DefineKeybindingWidget.WIDTH);
		this._domNode.setHeight(DefineKeybindingWidget.HEIGHT);

		const message = nls.localize('defineKeybinding.initial', "Press desired key combination and then press ENTER.");
		dom.append(this._domNode.domNode, dom.$('.message', undefined, message));

		this._domNode.domNode.style.backgroundColor = asCssVariable(editorWidgetBackground);
		this._domNode.domNode.style.color = asCssVariable(editorWidgetForeground);
		this._domNode.domNode.style.boxShadow = `0 2px 8px ${asCssVariable(widgetShadow)}`;

		this._keybindingInputWidget = this._register(this.instantiationService.createInstance(KeybindingsSearchWidget, this._domNode.domNode, { ariaLabel: message, history: new Set([]), inputBoxStyles: defaultInputBoxStyles }));
		this._keybindingInputWidget.startRecordingKeys();
		this._register(this._keybindingInputWidget.onKeybinding(keybinding => this.onKeybinding(keybinding)));
		this._register(this._keybindingInputWidget.onEnter(() => this.hide()));
		this._register(this._keybindingInputWidget.onEscape(() => this.clearOrHide()));
		this._register(this._keybindingInputWidget.onBlur(() => this.onCancel()));

		this._outputNode = dom.append(this._domNode.domNode, dom.$('.output'));
		this._showExistingKeybindingsNode = dom.append(this._domNode.domNode, dom.$('.existing'));

		if (parent) {
			dom.append(parent, this._domNode.domNode);
		}
	}

	get domNode(): HTMLElement {
		return this._domNode.domNode;
	}

	define(): Promise<string | null> {
		this._keybindingInputWidget.clear();
		return Promises.withAsyncBody<string | null>(async (c) => {
			if (!this._isVisible) {
				this._isVisible = true;
				this._domNode.setDisplay('block');

				this._chords = null;
				this._keybindingInputWidget.setInputValue('');
				dom.clearNode(this._outputNode);
				dom.clearNode(this._showExistingKeybindingsNode);

				// Input is not getting focus without timeout in safari
				// https://github.com/microsoft/vscode/issues/108817
				await timeout(0);

				this._keybindingInputWidget.focus();
			}
			const disposable = this._onHide.event(() => {
				c(this.getUserSettingsLabel());
				disposable.dispose();
			});
		});
	}

	layout(layout: dom.Dimension): void {
		const top = Math.round((layout.height - DefineKeybindingWidget.HEIGHT) / 2);
		this._domNode.setTop(top);

		const left = Math.round((layout.width - DefineKeybindingWidget.WIDTH) / 2);
		this._domNode.setLeft(left);
	}

	printExisting(numberOfExisting: number): void {
		if (numberOfExisting > 0) {
			const existingElement = dom.$('span.existingText');
			const text = numberOfExisting === 1 ? nls.localize('defineKeybinding.oneExists', "1 existing command has this keybinding", numberOfExisting) : nls.localize('defineKeybinding.existing', "{0} existing commands have this keybinding", numberOfExisting);
			dom.append(existingElement, document.createTextNode(text));
			aria.alert(text);
			this._showExistingKeybindingsNode.appendChild(existingElement);
			existingElement.onmousedown = (e) => { e.preventDefault(); };
			existingElement.onmouseup = (e) => { e.preventDefault(); };
			existingElement.onclick = () => { this._onShowExistingKeybindings.fire(this.getUserSettingsLabel()); };
		}
	}

	private onKeybinding(keybinding: ResolvedKeybinding[] | null): void {
		this._keybindingDisposables.clear();
		this._chords = keybinding;
		dom.clearNode(this._outputNode);
		dom.clearNode(this._showExistingKeybindingsNode);

		const firstLabel = this._keybindingDisposables.add(new KeybindingLabel(this._outputNode, OS, defaultKeybindingLabelStyles));
		firstLabel.set(this._chords?.[0] ?? undefined);

		if (this._chords) {
			for (let i = 1; i < this._chords.length; i++) {
				this._outputNode.appendChild(document.createTextNode(nls.localize('defineKeybinding.chordsTo', "chord to")));
				const chordLabel = this._keybindingDisposables.add(new KeybindingLabel(this._outputNode, OS, defaultKeybindingLabelStyles));
				chordLabel.set(this._chords[i]);
			}
		}

		const label = this.getUserSettingsLabel();
		if (label) {
			this._onDidChange.fire(label);
		}
	}

	private getUserSettingsLabel(): string | null {
		let label: string | null = null;
		if (this._chords) {
			label = this._chords.map(keybinding => keybinding.getUserSettingsLabel()).join(' ');
		}
		return label;
	}

	private onCancel(): void {
		this._chords = null;
		this.hide();
	}

	private clearOrHide(): void {
		if (this._chords === null) {
			this.hide();
		} else {
			this._chords = null;
			this._keybindingInputWidget.clear();
			dom.clearNode(this._outputNode);
			dom.clearNode(this._showExistingKeybindingsNode);
		}
	}

	private hide(): void {
		this._domNode.setDisplay('none');
		this._isVisible = false;
		this._onHide.fire();
	}
}

export class DefineKeybindingOverlayWidget extends Disposable implements IOverlayWidget {

	private static readonly ID = 'editor.contrib.defineKeybindingWidget';

	private readonly _widget: DefineKeybindingWidget;

	constructor(private _editor: ICodeEditor,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super();

		this._widget = this._register(instantiationService.createInstance(DefineKeybindingWidget, null));
		this._editor.addOverlayWidget(this);
	}

	getId(): string {
		return DefineKeybindingOverlayWidget.ID;
	}

	getDomNode(): HTMLElement {
		return this._widget.domNode;
	}

	getPosition(): IOverlayWidgetPosition {
		return {
			preference: null
		};
	}

	override dispose(): void {
		this._editor.removeOverlayWidget(this);
		super.dispose();
	}

	start(): Promise<string | null> {
		if (this._editor.hasModel()) {
			this._editor.revealPositionInCenterIfOutsideViewport(this._editor.getPosition(), ScrollType.Smooth);
		}
		const layoutInfo = this._editor.getLayoutInfo();
		this._widget.layout(new dom.Dimension(layoutInfo.width, layoutInfo.height));
		return this._widget.define();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/keyboardLayoutPicker.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/keyboardLayoutPicker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { StatusbarAlignment, IStatusbarService, IStatusbarEntryAccessor } from '../../../services/statusbar/browser/statusbar.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { parseKeyboardLayoutDescription, areKeyboardLayoutsEqual, getKeyboardLayoutId, IKeyboardLayoutService, IKeyboardLayoutInfo } from '../../../../platform/keyboardLayout/common/keyboardLayout.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { KEYBOARD_LAYOUT_OPEN_PICKER } from '../common/preferences.js';
import { isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { QuickPickInput, IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IEditorPane } from '../../../common/editor.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

export class KeyboardLayoutPickerContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.keyboardLayoutPicker';

	private readonly pickerElement = this._register(new MutableDisposable<IStatusbarEntryAccessor>());

	constructor(
		@IKeyboardLayoutService private readonly keyboardLayoutService: IKeyboardLayoutService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
	) {
		super();

		const name = nls.localize('status.workbench.keyboardLayout', "Keyboard Layout");

		const layout = this.keyboardLayoutService.getCurrentKeyboardLayout();
		if (layout) {
			const layoutInfo = parseKeyboardLayoutDescription(layout);
			const text = nls.localize('keyboardLayout', "Layout: {0}", layoutInfo.label);

			this.pickerElement.value = this.statusbarService.addEntry(
				{
					name,
					text,
					ariaLabel: text,
					command: KEYBOARD_LAYOUT_OPEN_PICKER
				},
				'status.workbench.keyboardLayout',
				StatusbarAlignment.RIGHT
			);
		}

		this._register(this.keyboardLayoutService.onDidChangeKeyboardLayout(() => {
			const layout = this.keyboardLayoutService.getCurrentKeyboardLayout();
			const layoutInfo = parseKeyboardLayoutDescription(layout);

			if (this.pickerElement.value) {
				const text = nls.localize('keyboardLayout', "Layout: {0}", layoutInfo.label);
				this.pickerElement.value.update({
					name,
					text,
					ariaLabel: text,
					command: KEYBOARD_LAYOUT_OPEN_PICKER
				});
			} else {
				const text = nls.localize('keyboardLayout', "Layout: {0}", layoutInfo.label);
				this.pickerElement.value = this.statusbarService.addEntry(
					{
						name,
						text,
						ariaLabel: text,
						command: KEYBOARD_LAYOUT_OPEN_PICKER
					},
					'status.workbench.keyboardLayout',
					StatusbarAlignment.RIGHT
				);
			}
		}));
	}
}

registerWorkbenchContribution2(KeyboardLayoutPickerContribution.ID, KeyboardLayoutPickerContribution, WorkbenchPhase.BlockStartup);

interface LayoutQuickPickItem extends IQuickPickItem {
	layout: IKeyboardLayoutInfo;
}

interface IUnknownLayout {
	text?: string;
	lang?: string;
	layout?: string;
}

const DEFAULT_CONTENT: string = [
	`// ${nls.localize('displayLanguage', 'Defines the keyboard layout used in VS Code in the browser environment.')}`,
	`// ${nls.localize('doc', 'Open VS Code and run "Developer: Inspect Key Mappings (JSON)" from Command Palette.')}`,
	``,
	`// Once you have the keyboard layout info, please paste it below.`,
	'\n'
].join('\n');

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: KEYBOARD_LAYOUT_OPEN_PICKER,
			title: nls.localize2('keyboard.chooseLayout', "Change Keyboard Layout"),
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const keyboardLayoutService = accessor.get(IKeyboardLayoutService);
		const quickInputService = accessor.get(IQuickInputService);
		const configurationService = accessor.get(IConfigurationService);
		const environmentService = accessor.get(IEnvironmentService);
		const editorService = accessor.get(IEditorService);
		const fileService = accessor.get(IFileService);

		const layouts = keyboardLayoutService.getAllKeyboardLayouts();
		const currentLayout = keyboardLayoutService.getCurrentKeyboardLayout();
		const layoutConfig = configurationService.getValue('keyboard.layout');
		const isAutoDetect = layoutConfig === 'autodetect';

		const picks: QuickPickInput[] = layouts.map(layout => {
			const picked = !isAutoDetect && areKeyboardLayoutsEqual(currentLayout, layout);
			const layoutInfo = parseKeyboardLayoutDescription(layout);
			return {
				layout: layout,
				label: [layoutInfo.label, (layout && layout.isUserKeyboardLayout) ? '(User configured layout)' : ''].join(' '),
				id: (layout as IUnknownLayout).text || (layout as IUnknownLayout).lang || (layout as IUnknownLayout).layout,
				description: layoutInfo.description + (picked ? ' (Current layout)' : ''),
				picked: !isAutoDetect && areKeyboardLayoutsEqual(currentLayout, layout)
			};
		}).sort((a: IQuickPickItem, b: IQuickPickItem) => {
			return a.label < b.label ? -1 : (a.label > b.label ? 1 : 0);
		});

		if (picks.length > 0) {
			const platform = isMacintosh ? 'Mac' : isWindows ? 'Win' : 'Linux';
			picks.unshift({ type: 'separator', label: nls.localize('layoutPicks', "Keyboard Layouts ({0})", platform) });
		}

		const configureKeyboardLayout: IQuickPickItem = { label: nls.localize('configureKeyboardLayout', "Configure Keyboard Layout") };

		picks.unshift(configureKeyboardLayout);

		// Offer to "Auto Detect"
		const autoDetectMode: IQuickPickItem = {
			label: nls.localize('autoDetect', "Auto Detect"),
			description: isAutoDetect ? `Current: ${parseKeyboardLayoutDescription(currentLayout).label}` : undefined,
			picked: isAutoDetect ? true : undefined
		};

		picks.unshift(autoDetectMode);

		const pick = await quickInputService.pick(picks, { placeHolder: nls.localize('pickKeyboardLayout', "Select Keyboard Layout"), matchOnDescription: true });
		if (!pick) {
			return;
		}

		if (pick === autoDetectMode) {
			// set keymap service to auto mode
			configurationService.updateValue('keyboard.layout', 'autodetect');
			return;
		}

		if (pick === configureKeyboardLayout) {
			const file = environmentService.keyboardLayoutResource;

			await fileService.stat(file).then(undefined, () => {
				return fileService.createFile(file, VSBuffer.fromString(DEFAULT_CONTENT));
			}).then((stat): Promise<IEditorPane | undefined> | undefined => {
				if (!stat) {
					return undefined;
				}
				return editorService.openEditor({
					resource: stat.resource,
					languageId: 'jsonc',
					options: { pinned: true }
				});
			}, (error) => {
				throw new Error(nls.localize('fail.createSettings', "Unable to create '{0}' ({1}).", file.toString(), error));
			});

			return Promise.resolve();
		}

		configurationService.updateValue('keyboard.layout', getKeyboardLayoutId((<LayoutQuickPickItem>pick).layout));
	}
});
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 247
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 247 of 552)

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

---[FILE: src/vs/editor/test/browser/gpu/atlas/testUtil.ts]---
Location: vscode-main/src/vs/editor/test/browser/gpu/atlas/testUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { fail, ok } from 'assert';
import type { ITextureAtlasPageGlyph } from '../../../../browser/gpu/atlas/atlas.js';
import { TextureAtlas } from '../../../../browser/gpu/atlas/textureAtlas.js';
import { isNumber } from '../../../../../base/common/types.js';
import { ensureNonNullable } from '../../../../browser/gpu/gpuUtils.js';

export function assertIsValidGlyph(glyph: Readonly<ITextureAtlasPageGlyph> | undefined, atlasOrSource: TextureAtlas | OffscreenCanvas) {
	if (glyph === undefined) {
		fail('glyph is undefined');
	}
	const pageW = atlasOrSource instanceof TextureAtlas ? atlasOrSource.pageSize : atlasOrSource.width;
	const pageH = atlasOrSource instanceof TextureAtlas ? atlasOrSource.pageSize : atlasOrSource.width;
	const source = atlasOrSource instanceof TextureAtlas ? atlasOrSource.pages[glyph.pageIndex].source : atlasOrSource;

	// (x,y) are valid coordinates
	ok(isNumber(glyph.x));
	ok(glyph.x >= 0);
	ok(glyph.x < pageW);
	ok(isNumber(glyph.y));
	ok(glyph.y >= 0);
	ok(glyph.y < pageH);

	// (w,h) are valid dimensions
	ok(isNumber(glyph.w));
	ok(glyph.w > 0);
	ok(glyph.w <= pageW);
	ok(isNumber(glyph.h));
	ok(glyph.h > 0);
	ok(glyph.h <= pageH);

	// (originOffsetX, originOffsetY) are valid offsets
	ok(isNumber(glyph.originOffsetX));
	ok(isNumber(glyph.originOffsetY));

	// (x,y) + (w,h) are within the bounds of the atlas
	ok(glyph.x + glyph.w <= pageW);
	ok(glyph.y + glyph.h <= pageH);

	// Each of the glyph's outer pixel edges contain at least 1 non-transparent pixel
	const ctx = ensureNonNullable(source.getContext('2d'));
	const edges = [
		ctx.getImageData(glyph.x, glyph.y, glyph.w, 1).data,
		ctx.getImageData(glyph.x, glyph.y + glyph.h - 1, glyph.w, 1).data,
		ctx.getImageData(glyph.x, glyph.y, 1, glyph.h).data,
		ctx.getImageData(glyph.x + glyph.w - 1, glyph.y, 1, glyph.h).data,
	];
	for (const edge of edges) {
		ok(edge.some(color => (color & 0xFF) !== 0));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/gpu/atlas/textureAtlas.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/gpu/atlas/textureAtlas.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual, throws } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import type { IGlyphRasterizer, IRasterizedGlyph } from '../../../../browser/gpu/raster/raster.js';
import { ensureNonNullable } from '../../../../browser/gpu/gpuUtils.js';
import type { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TextureAtlas } from '../../../../browser/gpu/atlas/textureAtlas.js';
import { createCodeEditorServices } from '../../testCodeEditor.js';
import { assertIsValidGlyph } from './testUtil.js';
import { TextureAtlasSlabAllocator } from '../../../../browser/gpu/atlas/textureAtlasSlabAllocator.js';
import { DecorationStyleCache } from '../../../../browser/gpu/css/decorationStyleCache.js';

const blackInt = 0x000000FF;
const nullCharMetadata = 0x0;

let lastUniqueGlyph: string | undefined;
function getUniqueGlyphId(): [chars: string, tokenMetadata: number, charMetadata: number, x: number] {
	if (!lastUniqueGlyph) {
		lastUniqueGlyph = 'a';
	} else {
		lastUniqueGlyph = String.fromCharCode(lastUniqueGlyph.charCodeAt(0) + 1);
	}
	return [lastUniqueGlyph, blackInt, nullCharMetadata, 0];
}

class TestGlyphRasterizer implements IGlyphRasterizer {
	readonly id = 0;
	readonly cacheKey = '';
	nextGlyphColor: [number, number, number, number] = [0, 0, 0, 0];
	nextGlyphDimensions: [number, number] = [0, 0];
	rasterizeGlyph(chars: string, tokenMetadata: number, charMetadata: number, colorMap: string[]): Readonly<IRasterizedGlyph> {
		const w = this.nextGlyphDimensions[0];
		const h = this.nextGlyphDimensions[1];
		if (w === 0 || h === 0) {
			throw new Error('TestGlyphRasterizer.nextGlyphDimensions must be set to a non-zero value before calling rasterizeGlyph');
		}
		const imageData = new ImageData(w, h);
		let i = 0;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const [r, g, b, a] = this.nextGlyphColor;
				i = (y * w + x) * 4;
				imageData.data[i + 0] = r;
				imageData.data[i + 1] = g;
				imageData.data[i + 2] = b;
				imageData.data[i + 3] = a;
			}
		}
		const canvas = new OffscreenCanvas(w, h);
		const ctx = ensureNonNullable(canvas.getContext('2d'));
		ctx.putImageData(imageData, 0, 0);
		return {
			source: canvas,
			boundingBox: { top: 0, left: 0, bottom: h - 1, right: w - 1 },
			originOffset: { x: 0, y: 0 },
			fontBoundingBoxAscent: 0,
			fontBoundingBoxDescent: 0,
		};
	}
	getTextMetrics(text: string): TextMetrics {
		return null!;
	}
}

suite('TextureAtlas', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suiteSetup(() => {
		lastUniqueGlyph = undefined;
	});

	let instantiationService: IInstantiationService;

	let atlas: TextureAtlas;
	let glyphRasterizer: TestGlyphRasterizer;

	setup(() => {
		instantiationService = createCodeEditorServices(store);
		atlas = store.add(instantiationService.createInstance(TextureAtlas, 2, undefined, new DecorationStyleCache()));
		glyphRasterizer = new TestGlyphRasterizer();
		glyphRasterizer.nextGlyphDimensions = [1, 1];
		glyphRasterizer.nextGlyphColor = [0, 0, 0, 0xFF];
	});

	test('get single glyph', () => {
		assertIsValidGlyph(atlas.getGlyph(glyphRasterizer, ...getUniqueGlyphId()), atlas);
	});

	test('get multiple glyphs', () => {
		atlas = store.add(instantiationService.createInstance(TextureAtlas, 32, undefined, new DecorationStyleCache()));
		for (let i = 0; i < 10; i++) {
			assertIsValidGlyph(atlas.getGlyph(glyphRasterizer, ...getUniqueGlyphId()), atlas);
		}
	});

	test('adding glyph to full page creates new page', () => {
		let pageCount: number | undefined;
		for (let i = 0; i < 4; i++) {
			assertIsValidGlyph(atlas.getGlyph(glyphRasterizer, ...getUniqueGlyphId()), atlas);
			if (pageCount === undefined) {
				pageCount = atlas.pages.length;
			} else {
				strictEqual(atlas.pages.length, pageCount, 'the number of pages should not change when the page is being filled');
			}
		}
		assertIsValidGlyph(atlas.getGlyph(glyphRasterizer, ...getUniqueGlyphId()), atlas);
		strictEqual(atlas.pages.length, pageCount! + 1, 'the 5th glyph should overflow to a new page');
	});

	test('adding a glyph larger than the atlas', () => {
		glyphRasterizer.nextGlyphDimensions = [3, 2];
		throws(() => atlas.getGlyph(glyphRasterizer, ...getUniqueGlyphId()), 'should throw when the glyph is too large, this should not happen in practice');
	});

	test('adding a glyph larger than the standard slab size', () => {
		glyphRasterizer.nextGlyphDimensions = [2, 2];
		atlas = store.add(instantiationService.createInstance(TextureAtlas, 32, {
			allocatorType: (canvas, textureIndex) => new TextureAtlasSlabAllocator(canvas, textureIndex, { slabW: 1, slabH: 1 })
		}, new DecorationStyleCache()));
		assertIsValidGlyph(atlas.getGlyph(glyphRasterizer, ...getUniqueGlyphId()), atlas);
	});

	test('adding a non-first glyph larger than the standard slab size, causing an overflow to a new page', () => {
		atlas = store.add(instantiationService.createInstance(TextureAtlas, 2, {
			allocatorType: (canvas, textureIndex) => new TextureAtlasSlabAllocator(canvas, textureIndex, { slabW: 1, slabH: 1 })
		}, new DecorationStyleCache()));
		assertIsValidGlyph(atlas.getGlyph(glyphRasterizer, ...getUniqueGlyphId()), atlas);
		strictEqual(atlas.pages.length, 1);
		glyphRasterizer.nextGlyphDimensions = [2, 2];
		assertIsValidGlyph(atlas.getGlyph(glyphRasterizer, ...getUniqueGlyphId()), atlas);
		strictEqual(atlas.pages.length, 2, 'the 2nd glyph should overflow to a new page with a larger slab size');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/gpu/atlas/textureAtlasAllocator.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/gpu/atlas/textureAtlasAllocator.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual, throws } from 'assert';
import type { IRasterizedGlyph } from '../../../../browser/gpu/raster/raster.js';
import { ensureNonNullable } from '../../../../browser/gpu/gpuUtils.js';
import type { ITextureAtlasAllocator } from '../../../../browser/gpu/atlas/atlas.js';
import { TextureAtlasShelfAllocator } from '../../../../browser/gpu/atlas/textureAtlasShelfAllocator.js';
import { TextureAtlasSlabAllocator, type TextureAtlasSlabAllocatorOptions } from '../../../../browser/gpu/atlas/textureAtlasSlabAllocator.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { assertIsValidGlyph } from './testUtil.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';

const blackArr = [0x00, 0x00, 0x00, 0xFF];

const pixel1x1 = createRasterizedGlyph(1, 1, [...blackArr]);
const pixel2x1 = createRasterizedGlyph(2, 1, [...blackArr, ...blackArr]);
const pixel1x2 = createRasterizedGlyph(1, 2, [...blackArr, ...blackArr]);

function createRasterizedGlyph(w: number, h: number, data: ArrayLike<number>): IRasterizedGlyph {
	strictEqual(w * h * 4, data.length);
	const source = new OffscreenCanvas(w, h);
	const imageData = new ImageData(w, h);
	imageData.data.set(data);
	ensureNonNullable(source.getContext('2d')).putImageData(imageData, 0, 0);
	return {
		source,
		boundingBox: { top: 0, left: 0, bottom: h - 1, right: w - 1 },
		originOffset: { x: 0, y: 0 },
		fontBoundingBoxAscent: 0,
		fontBoundingBoxDescent: 0,
	};
}

function allocateAndAssert(allocator: ITextureAtlasAllocator, rasterizedGlyph: IRasterizedGlyph, expected: { x: number; y: number; w: number; h: number } | undefined): void {
	const actual = allocator.allocate(rasterizedGlyph);
	if (!actual) {
		strictEqual(actual, expected);
		return;
	}
	deepStrictEqual({
		x: actual.x,
		y: actual.y,
		w: actual.w,
		h: actual.h,
	}, expected);
}

function initShelfAllocator(w: number, h: number): { canvas: OffscreenCanvas; allocator: TextureAtlasShelfAllocator } {
	const canvas = new OffscreenCanvas(w, h);
	const allocator = new TextureAtlasShelfAllocator(canvas, 0);
	return { canvas, allocator };
}

function initSlabAllocator(w: number, h: number, options?: TextureAtlasSlabAllocatorOptions): { canvas: OffscreenCanvas; allocator: TextureAtlasSlabAllocator } {
	const canvas = new OffscreenCanvas(w, h);
	const allocator = new TextureAtlasSlabAllocator(canvas, 0, options);
	return { canvas, allocator };
}

const allocatorDefinitions: { name: string; initAllocator: (w: number, h: number) => { canvas: OffscreenCanvas; allocator: ITextureAtlasAllocator } }[] = [
	{ name: 'shelf', initAllocator: initShelfAllocator },
	{ name: 'slab', initAllocator: initSlabAllocator },
];

suite('TextureAtlasAllocator', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('shared tests', () => {
		for (const { name, initAllocator } of allocatorDefinitions) {
			test(`(${name}) single allocation`, () => {
				const { canvas, allocator } = initAllocator(2, 2);
				assertIsValidGlyph(allocator.allocate(pixel1x1), canvas);
			});
			// Skipping because it fails unexpectedly on web only when asserting the error message
			test.skip(`(${name}) glyph too large for canvas`, () => {
				const { allocator } = initAllocator(1, 1);
				throws(() => allocateAndAssert(allocator, pixel2x1, undefined), new BugIndicatingError('Glyph is too large for the atlas page'));
			});
		}
	});

	suite('TextureAtlasShelfAllocator', () => {
		const initAllocator = initShelfAllocator;

		test('single allocation', () => {
			const { allocator } = initAllocator(2, 2);
			// 1o
			// oo
			allocateAndAssert(allocator, pixel1x1, { x: 0, y: 0, w: 1, h: 1 });
		});
		test('wrapping', () => {
			const { allocator } = initAllocator(5, 4);

			// 1233o
			// o2ooo
			// ooooo
			// ooooo
			allocateAndAssert(allocator, pixel1x1, { x: 0, y: 0, w: 1, h: 1 });
			allocateAndAssert(allocator, pixel1x2, { x: 1, y: 0, w: 1, h: 2 });
			allocateAndAssert(allocator, pixel2x1, { x: 2, y: 0, w: 2, h: 1 });

			// 1233x
			// x2xxx
			// 44556
			// ooooo
			allocateAndAssert(allocator, pixel2x1, { x: 0, y: 2, w: 2, h: 1 });
			allocateAndAssert(allocator, pixel2x1, { x: 2, y: 2, w: 2, h: 1 });
			allocateAndAssert(allocator, pixel1x1, { x: 4, y: 2, w: 1, h: 1 });

			// 1233x
			// x2xxx
			// 44556
			// 7oooo
			allocateAndAssert(allocator, pixel1x1, { x: 0, y: 3, w: 1, h: 1 });
		});
		test('full', () => {
			const { allocator } = initAllocator(3, 2);
			// 122
			// 1oo
			allocateAndAssert(allocator, pixel1x2, { x: 0, y: 0, w: 1, h: 2 });
			allocateAndAssert(allocator, pixel2x1, { x: 1, y: 0, w: 2, h: 1 });
			allocateAndAssert(allocator, pixel1x1, undefined);
		});
	});

	suite('TextureAtlasSlabAllocator', () => {
		const initAllocator = initSlabAllocator;

		test('single allocation', () => {
			const { allocator } = initAllocator(2, 2);
			// 1o
			// oo
			allocateAndAssert(allocator, pixel1x1, { x: 0, y: 0, w: 1, h: 1 });
		});

		test('single slab single glyph full', () => {
			const { allocator } = initAllocator(1, 1, { slabW: 1, slabH: 1 });

			// 1
			allocateAndAssert(allocator, pixel1x1, { x: 0, y: 0, w: 1, h: 1 });

			allocateAndAssert(allocator, pixel1x1, undefined);
		});

		test('single slab multiple glyph full', () => {
			const { allocator } = initAllocator(2, 2, { slabW: 2, slabH: 2 });

			// 1
			// 1
			allocateAndAssert(allocator, pixel1x2, { x: 0, y: 0, w: 1, h: 2 });
			allocateAndAssert(allocator, pixel1x2, { x: 1, y: 0, w: 1, h: 2 });

			allocateAndAssert(allocator, pixel1x2, undefined);
		});

		test('allocate 1x1 to multiple slabs until full', () => {
			const { allocator } = initAllocator(4, 2, { slabW: 2, slabH: 2 });

			// 12│oo
			// 34│oo
			allocateAndAssert(allocator, pixel1x1, { x: 0, y: 0, w: 1, h: 1 });
			allocateAndAssert(allocator, pixel1x1, { x: 1, y: 0, w: 1, h: 1 });
			allocateAndAssert(allocator, pixel1x1, { x: 0, y: 1, w: 1, h: 1 });
			allocateAndAssert(allocator, pixel1x1, { x: 1, y: 1, w: 1, h: 1 });

			// 12│56
			// 34│78
			allocateAndAssert(allocator, pixel1x1, { x: 2, y: 0, w: 1, h: 1 });
			allocateAndAssert(allocator, pixel1x1, { x: 3, y: 0, w: 1, h: 1 });
			allocateAndAssert(allocator, pixel1x1, { x: 2, y: 1, w: 1, h: 1 });
			allocateAndAssert(allocator, pixel1x1, { x: 3, y: 1, w: 1, h: 1 });

			allocateAndAssert(allocator, pixel1x1, undefined);
		});

		test('glyph too large for slab (increase slab size for first glyph)', () => {
			const { allocator } = initAllocator(2, 2, { slabW: 1, slabH: 1 });
			allocateAndAssert(allocator, pixel2x1, { x: 0, y: 0, w: 2, h: 1 });
		});

		test('glyph too large for slab (undefined as it\'s not the first glyph)', () => {
			const { allocator } = initAllocator(2, 2, { slabW: 1, slabH: 1 });
			allocateAndAssert(allocator, pixel1x1, { x: 0, y: 0, w: 1, h: 1 });
			allocateAndAssert(allocator, pixel2x1, undefined);
		});

		test('separate slabs for different sized glyphs', () => {
			const { allocator } = initAllocator(4, 2, { slabW: 2, slabH: 2 });

			// 10│2o
			// 00│2o
			allocateAndAssert(allocator, pixel1x1, { x: 0, y: 0, w: 1, h: 1 });
			allocateAndAssert(allocator, pixel1x2, { x: 2, y: 0, w: 1, h: 2 });

			// 14│23
			// 00│23
			allocateAndAssert(allocator, pixel1x2, { x: 3, y: 0, w: 1, h: 2 });
			allocateAndAssert(allocator, pixel1x1, { x: 1, y: 0, w: 1, h: 1 });
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/services/decorationRenderOptions.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/services/decorationRenderOptions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as platform from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IDecorationRenderOptions } from '../../../common/editorCommon.js';
import { TestCodeEditorService, TestGlobalStyleSheet } from '../editorTestServices.js';
import { TestColorTheme, TestThemeService } from '../../../../platform/theme/test/common/testThemeService.js';

suite('Decoration Render Options', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	const themeServiceMock = new TestThemeService();

	const options: IDecorationRenderOptions = {
		gutterIconPath: URI.parse('https://github.com/microsoft/vscode/blob/main/resources/linux/code.png'),
		gutterIconSize: 'contain',
		backgroundColor: 'red',
		borderColor: 'yellow'
	};
	test('register and resolve decoration type', () => {
		const s = store.add(new TestCodeEditorService(themeServiceMock));
		store.add(s.registerDecorationType('test', 'example', options));
		assert.notStrictEqual(s.resolveDecorationOptions('example', false), undefined);
	});
	test('remove decoration type', () => {
		const s = store.add(new TestCodeEditorService(themeServiceMock));
		s.registerDecorationType('test', 'example', options);
		assert.notStrictEqual(s.resolveDecorationOptions('example', false), undefined);
		s.removeDecorationType('example');
		assert.throws(() => s.resolveDecorationOptions('example', false));
	});

	function readStyleSheet(styleSheet: TestGlobalStyleSheet): string {
		return styleSheet.read();
	}

	test('css properties', () => {
		const s = store.add(new TestCodeEditorService(themeServiceMock));
		const styleSheet = s.globalStyleSheet;
		store.add(s.registerDecorationType('test', 'example', options));
		const sheet = readStyleSheet(styleSheet);
		assert(sheet.indexOf(`{background:url('${CSS.escape('https://github.com/microsoft/vscode/blob/main/resources/linux/code.png')}') center center no-repeat;background-size:contain;}`) >= 0);
		assert(sheet.indexOf(`{background-color:red;border-color:yellow;box-sizing: border-box;}`) >= 0);
	});

	test('theme color', () => {
		const options: IDecorationRenderOptions = {
			backgroundColor: { id: 'editorBackground' },
			borderColor: { id: 'editorBorder' },
		};

		const themeService = new TestThemeService(new TestColorTheme({
			editorBackground: '#FF0000'
		}));
		const s = store.add(new TestCodeEditorService(themeService));
		const styleSheet = s.globalStyleSheet;
		s.registerDecorationType('test', 'example', options);
		assert.strictEqual(readStyleSheet(styleSheet), '.monaco-editor .ced-example-0 {background-color:#ff0000;border-color:transparent;box-sizing: border-box;}');

		themeService.setTheme(new TestColorTheme({
			editorBackground: '#EE0000',
			editorBorder: '#00FFFF'
		}));
		assert.strictEqual(readStyleSheet(styleSheet), '.monaco-editor .ced-example-0 {background-color:#ee0000;border-color:#00ffff;box-sizing: border-box;}');

		s.removeDecorationType('example');
		assert.strictEqual(readStyleSheet(styleSheet), '');
	});

	test('theme overrides', () => {
		const options: IDecorationRenderOptions = {
			color: { id: 'editorBackground' },
			light: {
				color: '#FF00FF'
			},
			dark: {
				color: '#000000',
				after: {
					color: { id: 'infoForeground' }
				}
			}
		};

		const themeService = new TestThemeService(new TestColorTheme({
			editorBackground: '#FF0000',
			infoForeground: '#444444'
		}));
		const s = store.add(new TestCodeEditorService(themeService));
		const styleSheet = s.globalStyleSheet;
		s.registerDecorationType('test', 'example', options);
		const expected = [
			'.vs-dark.monaco-editor .ced-example-4::after, .hc-black.monaco-editor .ced-example-4::after {color:#444444 !important;}',
			'.vs-dark.monaco-editor .ced-example-1, .hc-black.monaco-editor .ced-example-1 {color:#000000 !important;}',
			'.vs.monaco-editor .ced-example-1, .hc-light.monaco-editor .ced-example-1 {color:#FF00FF !important;}',
			'.monaco-editor .ced-example-1 {color:#ff0000 !important;}'
		].join('\n');
		assert.strictEqual(readStyleSheet(styleSheet), expected);

		s.removeDecorationType('example');
		assert.strictEqual(readStyleSheet(styleSheet), '');
	});

	test('css properties, gutterIconPaths', () => {
		const s = store.add(new TestCodeEditorService(themeServiceMock));
		const styleSheet = s.globalStyleSheet;

		// URI, only minimal encoding
		s.registerDecorationType('test', 'example', { gutterIconPath: URI.parse('data:image/svg+xml;base64,PHN2ZyB4b+') });
		assert(readStyleSheet(styleSheet).indexOf(`{background:url('${CSS.escape('data:image/svg+xml;base64,PHN2ZyB4b+')}') center center no-repeat;}`) > 0);
		s.removeDecorationType('example');

		function assertBackground(url1: string, url2: string) {
			const actual = readStyleSheet(styleSheet);
			assert(
				actual.indexOf(`{background:url('${url1}') center center no-repeat;}`) > 0
				|| actual.indexOf(`{background:url('${url2}') center center no-repeat;}`) > 0
			);
		}

		if (platform.isWindows) {
			// windows file path (used as string)
			s.registerDecorationType('test', 'example', { gutterIconPath: URI.file('c:\\files\\miles\\more.png') });
			assertBackground(CSS.escape('file:///c:/files/miles/more.png'), CSS.escape('vscode-file://vscode-app/c:/files/miles/more.png'));
			s.removeDecorationType('example');

			// single quote must always be escaped/encoded
			s.registerDecorationType('test', 'example', { gutterIconPath: URI.file('c:\\files\\foo\\b\'ar.png') });
			assertBackground(CSS.escape('file:///c:/files/foo/b\'ar.png'), CSS.escape('vscode-file://vscode-app/c:/files/foo/b\'ar.png'));
			s.removeDecorationType('example');
		} else {
			// unix file path (used as string)
			s.registerDecorationType('test', 'example', { gutterIconPath: URI.file('/Users/foo/bar.png') });
			assertBackground(CSS.escape('file:///Users/foo/bar.png'), CSS.escape('vscode-file://vscode-app/Users/foo/bar.png'));
			s.removeDecorationType('example');

			// single quote must always be escaped/encoded
			s.registerDecorationType('test', 'example', { gutterIconPath: URI.file('/Users/foo/b\'ar.png') });
			assertBackground(CSS.escape('file:///Users/foo/b\'ar.png'), CSS.escape('vscode-file://vscode-app/Users/foo/b\'ar.png'));
			s.removeDecorationType('example');
		}

		s.registerDecorationType('test', 'example', { gutterIconPath: URI.parse('http://test/pa\'th') });
		assert(readStyleSheet(styleSheet).indexOf(`{background:url('${CSS.escape('http://test/pa\'th')}') center center no-repeat;}`) > 0);
		s.removeDecorationType('example');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/services/openerService.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/services/openerService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { OpenerService } from '../../../browser/services/openerService.js';
import { TestCodeEditorService } from '../editorTestServices.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { NullCommandService } from '../../../../platform/commands/test/common/nullCommandService.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { matchesScheme, matchesSomeScheme } from '../../../../base/common/network.js';
import { TestThemeService } from '../../../../platform/theme/test/common/testThemeService.js';

suite('OpenerService', function () {
	const themeService = new TestThemeService();
	const editorService = new TestCodeEditorService(themeService);

	let lastCommand: { id: string; args: any[] } | undefined;

	const commandService = new (class implements ICommandService {
		declare readonly _serviceBrand: undefined;
		onWillExecuteCommand = () => Disposable.None;
		onDidExecuteCommand = () => Disposable.None;
		executeCommand(id: string, ...args: unknown[]): Promise<any> {
			lastCommand = { id, args };
			return Promise.resolve(undefined);
		}
	})();

	setup(function () {
		lastCommand = undefined;
	});

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('delegate to editorService, scheme:///fff', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);
		await openerService.open(URI.parse('another:///somepath'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection, undefined);
	});

	test('delegate to editorService, scheme:///fff#L123', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		await openerService.open(URI.parse('file:///somepath#L23'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 1);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');

		await openerService.open(URI.parse('another:///somepath#L23'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 1);

		await openerService.open(URI.parse('another:///somepath#L23,45'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 45);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');
	});

	test('delegate to editorService, scheme:///fff#123,123', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		await openerService.open(URI.parse('file:///somepath#23'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 1);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');

		await openerService.open(URI.parse('file:///somepath#23,45'));
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startLineNumber, 23);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.startColumn, 45);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endLineNumber, undefined);
		assert.strictEqual((editorService.lastInput!.options as ITextEditorOptions)!.selection!.endColumn, undefined);
		assert.strictEqual(editorService.lastInput!.resource.fragment, '');
	});

	test('delegate to commandsService, command:someid', async function () {
		const openerService = new OpenerService(editorService, commandService);

		const id = `aCommand${Math.random()}`;
		store.add(CommandsRegistry.registerCommand(id, function () { }));

		assert.strictEqual(lastCommand, undefined);
		await openerService.open(URI.parse('command:' + id));
		assert.strictEqual(lastCommand, undefined);
	});


	test('delegate to commandsService, command:someid, 2', async function () {
		const openerService = new OpenerService(editorService, commandService);

		const id = `aCommand${Math.random()}`;
		store.add(CommandsRegistry.registerCommand(id, function () { }));

		await openerService.open(URI.parse('command:' + id).with({ query: '\"123\"' }), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 1);
		assert.strictEqual(lastCommand!.args[0], '123');

		await openerService.open(URI.parse('command:' + id), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 0);

		await openerService.open(URI.parse('command:' + id).with({ query: '123' }), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 1);
		assert.strictEqual(lastCommand!.args[0], 123);

		await openerService.open(URI.parse('command:' + id).with({ query: JSON.stringify([12, true]) }), { allowCommands: true });
		assert.strictEqual(lastCommand!.id, id);
		assert.strictEqual(lastCommand!.args.length, 2);
		assert.strictEqual(lastCommand!.args[0], 12);
		assert.strictEqual(lastCommand!.args[1], true);
	});

	test('links are protected by validators', async function () {
		const openerService = new OpenerService(editorService, commandService);

		store.add(openerService.registerValidator({ shouldOpen: () => Promise.resolve(false) }));

		const httpResult = await openerService.open(URI.parse('https://www.microsoft.com'));
		const httpsResult = await openerService.open(URI.parse('https://www.microsoft.com'));
		assert.strictEqual(httpResult, false);
		assert.strictEqual(httpsResult, false);
	});

	test('links validated by validators go to openers', async function () {
		const openerService = new OpenerService(editorService, commandService);

		store.add(openerService.registerValidator({ shouldOpen: () => Promise.resolve(true) }));

		let openCount = 0;
		store.add(openerService.registerOpener({
			open: (resource: URI) => {
				openCount++;
				return Promise.resolve(true);
			}
		}));

		await openerService.open(URI.parse('http://microsoft.com'));
		assert.strictEqual(openCount, 1);
		await openerService.open(URI.parse('https://microsoft.com'));
		assert.strictEqual(openCount, 2);
	});

	test('links aren\'t manipulated before being passed to validator: PR #118226', async function () {
		const openerService = new OpenerService(editorService, commandService);

		store.add(openerService.registerValidator({
			shouldOpen: (resource) => {
				// We don't want it to convert strings into URIs
				assert.strictEqual(resource instanceof URI, false);
				return Promise.resolve(false);
			}
		}));
		await openerService.open('https://wwww.microsoft.com');
		await openerService.open('https://www.microsoft.com??params=CountryCode%3DUSA%26Name%3Dvscode"');
	});

	test('links validated by multiple validators', async function () {
		const openerService = new OpenerService(editorService, commandService);

		let v1 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v1++;
				return Promise.resolve(true);
			}
		});

		let v2 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v2++;
				return Promise.resolve(true);
			}
		});

		let openCount = 0;
		openerService.registerOpener({
			open: (resource: URI) => {
				openCount++;
				return Promise.resolve(true);
			}
		});

		await openerService.open(URI.parse('http://microsoft.com'));
		assert.strictEqual(openCount, 1);
		assert.strictEqual(v1, 1);
		assert.strictEqual(v2, 1);
		await openerService.open(URI.parse('https://microsoft.com'));
		assert.strictEqual(openCount, 2);
		assert.strictEqual(v1, 2);
		assert.strictEqual(v2, 2);
	});

	test('links invalidated by first validator do not continue validating', async function () {
		const openerService = new OpenerService(editorService, commandService);

		let v1 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v1++;
				return Promise.resolve(false);
			}
		});

		let v2 = 0;
		openerService.registerValidator({
			shouldOpen: () => {
				v2++;
				return Promise.resolve(true);
			}
		});

		let openCount = 0;
		openerService.registerOpener({
			open: (resource: URI) => {
				openCount++;
				return Promise.resolve(true);
			}
		});

		await openerService.open(URI.parse('http://microsoft.com'));
		assert.strictEqual(openCount, 0);
		assert.strictEqual(v1, 1);
		assert.strictEqual(v2, 0);
		await openerService.open(URI.parse('https://microsoft.com'));
		assert.strictEqual(openCount, 0);
		assert.strictEqual(v1, 2);
		assert.strictEqual(v2, 0);
	});

	test('matchesScheme', function () {
		assert.ok(matchesScheme('https://microsoft.com', 'https'));
		assert.ok(matchesScheme('http://microsoft.com', 'http'));
		assert.ok(matchesScheme('hTTPs://microsoft.com', 'https'));
		assert.ok(matchesScheme('httP://microsoft.com', 'http'));
		assert.ok(matchesScheme(URI.parse('https://microsoft.com'), 'https'));
		assert.ok(matchesScheme(URI.parse('http://microsoft.com'), 'http'));
		assert.ok(matchesScheme(URI.parse('hTTPs://microsoft.com'), 'https'));
		assert.ok(matchesScheme(URI.parse('httP://microsoft.com'), 'http'));
		assert.ok(!matchesScheme(URI.parse('https://microsoft.com'), 'http'));
		assert.ok(!matchesScheme(URI.parse('htt://microsoft.com'), 'http'));
		assert.ok(!matchesScheme(URI.parse('z://microsoft.com'), 'http'));
	});

	test('matchesSomeScheme', function () {
		assert.ok(matchesSomeScheme('https://microsoft.com', 'http', 'https'));
		assert.ok(matchesSomeScheme('http://microsoft.com', 'http', 'https'));
		assert.ok(!matchesSomeScheme('x://microsoft.com', 'http', 'https'));
	});

	test('resolveExternalUri', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		try {
			await openerService.resolveExternalUri(URI.parse('file:///Users/user/folder'));
			assert.fail('Should not reach here');
		} catch {
			// OK
		}

		const disposable = openerService.registerExternalUriResolver({
			async resolveExternalUri(uri) {
				return { resolved: uri, dispose() { } };
			}
		});

		const result = await openerService.resolveExternalUri(URI.parse('file:///Users/user/folder'));
		assert.deepStrictEqual(result.resolved.toString(), 'file:///Users/user/folder');
		disposable.dispose();
	});

	test('vscode.open command can\'t open HTTP URL with hash (#) in it [extension development] #140907', async function () {
		const openerService = new OpenerService(editorService, NullCommandService);

		const actual: string[] = [];

		openerService.setDefaultExternalOpener({
			async openExternal(href) {
				actual.push(href);
				return true;
			}
		});

		const href = 'https://gitlab.com/viktomas/test-project/merge_requests/new?merge_request%5Bsource_branch%5D=test-%23-hash';
		const uri = URI.parse(href);

		assert.ok(await openerService.open(uri));
		assert.ok(await openerService.open(href));

		assert.deepStrictEqual(actual, [
			encodeURI(uri.toString(true)), // BAD, the encoded # (%23) is double encoded to %2523 (% is double encoded)
			href // good
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/view/minimapCharRenderer.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/view/minimapCharRenderer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { MinimapCharRendererFactory } from '../../../browser/viewParts/minimap/minimapCharRendererFactory.js';
import { Constants } from '../../../browser/viewParts/minimap/minimapCharSheet.js';
import { RGBA8 } from '../../../common/core/misc/rgba.js';

suite('MinimapCharRenderer', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const sampleD = [
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x0D, 0xFF, 0xFF, 0xFF, 0xA3, 0xFF, 0xFF, 0xFF, 0xF3, 0xFF, 0xFF, 0xFF, 0xE5, 0xFF, 0xFF, 0xFF, 0x5E, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xA4, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF7, 0xFF, 0xFF, 0xFF, 0xFC, 0xFF, 0xFF, 0xFF, 0xF0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x10, 0xFF, 0xFF, 0xFF, 0xFB, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x94, 0xFF, 0xFF, 0xFF, 0x02, 0xFF, 0xFF, 0xFF, 0x6A, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x3B, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x22, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x03, 0xFF, 0xFF, 0xFF, 0xF0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x47, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xD6, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x31, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xE7, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0xFF, 0xFF, 0xFF, 0x0E, 0xFF, 0xFF, 0xFF, 0xF7, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x69, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x3D, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x9B, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF9, 0xFF, 0xFF, 0xFF, 0xB9, 0xFF, 0xFF, 0xFF, 0xF0, 0xFF, 0xFF, 0xFF, 0xF7, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x0E, 0xFF, 0xFF, 0xFF, 0xA7, 0xFF, 0xFF, 0xFF, 0xF5, 0xFF, 0xFF, 0xFF, 0xE8, 0xFF, 0xFF, 0xFF, 0x71, 0xFF, 0xFF, 0xFF, 0xD0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x78, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	];

	function getSampleData() {
		const charCode = 'd'.charCodeAt(0);
		const result = new Uint8ClampedArray(Constants.SAMPLED_CHAR_HEIGHT * Constants.SAMPLED_CHAR_WIDTH * Constants.RGBA_CHANNELS_CNT * Constants.CHAR_COUNT);
		for (let i = 0; i < result.length; i++) {
			result[i] = 0;
		}

		const rowWidth = Constants.SAMPLED_CHAR_WIDTH * Constants.RGBA_CHANNELS_CNT * Constants.CHAR_COUNT;
		const chIndex = charCode - Constants.START_CH_CODE;

		let globalOutputOffset = chIndex * Constants.SAMPLED_CHAR_WIDTH * Constants.RGBA_CHANNELS_CNT;
		let inputOffset = 0;
		for (let i = 0; i < Constants.SAMPLED_CHAR_HEIGHT; i++) {
			let outputOffset = globalOutputOffset;
			for (let j = 0; j < Constants.SAMPLED_CHAR_WIDTH; j++) {
				for (let channel = 0; channel < Constants.RGBA_CHANNELS_CNT; channel++) {
					result[outputOffset] = sampleD[inputOffset];
					inputOffset++;
					outputOffset++;
				}
			}
			globalOutputOffset += rowWidth;
		}

		return result;
	}

	function createFakeImageData(width: number, height: number): ImageData {
		return {
			colorSpace: 'srgb',
			width: width,
			height: height,
			data: new Uint8ClampedArray(width * height * Constants.RGBA_CHANNELS_CNT)
		};
	}

	test('letter d @ 2x', () => {
		const sampleData = getSampleData();
		const renderer = MinimapCharRendererFactory.createFromSampleData(sampleData, 2);

		const background = new RGBA8(0, 0, 0, 255);
		const color = new RGBA8(255, 255, 255, 255);
		const imageData = createFakeImageData(Constants.BASE_CHAR_WIDTH * 2, Constants.BASE_CHAR_HEIGHT * 2);
		// set the background color
		for (let i = 0, len = imageData.data.length / 4; i < len; i++) {
			imageData.data[4 * i + 0] = background.r;
			imageData.data[4 * i + 1] = background.g;
			imageData.data[4 * i + 2] = background.b;
			imageData.data[4 * i + 3] = 255;
		}
		renderer.renderChar(imageData, 0, 0, 'd'.charCodeAt(0), color, 255, background, 255, 2, false, false);

		const actual: number[] = [];
		for (let i = 0; i < imageData.data.length; i++) {
			actual[i] = imageData.data[i];
		}

		assert.deepStrictEqual(actual, [
			0x2D, 0x2D, 0x2D, 0xFF, 0xAC, 0xAC, 0xAC, 0xFF,
			0xC6, 0xC6, 0xC6, 0xFF, 0xC8, 0xC8, 0xC8, 0xFF,
			0xC0, 0xC0, 0xC0, 0xFF, 0xCB, 0xCB, 0xCB, 0xFF,
			0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF,
		]);
	});

	test('letter d @ 1x', () => {
		const sampleData = getSampleData();
		const renderer = MinimapCharRendererFactory.createFromSampleData(sampleData, 1);

		const background = new RGBA8(0, 0, 0, 255);
		const color = new RGBA8(255, 255, 255, 255);
		const imageData = createFakeImageData(Constants.BASE_CHAR_WIDTH, Constants.BASE_CHAR_HEIGHT);
		// set the background color
		for (let i = 0, len = imageData.data.length / 4; i < len; i++) {
			imageData.data[4 * i + 0] = background.r;
			imageData.data[4 * i + 1] = background.g;
			imageData.data[4 * i + 2] = background.b;
			imageData.data[4 * i + 3] = 255;
		}

		renderer.renderChar(imageData, 0, 0, 'd'.charCodeAt(0), color, 255, background, 255, 1, false, false);

		const actual: number[] = [];
		for (let i = 0; i < imageData.data.length; i++) {
			actual[i] = imageData.data[i];
		}

		assert.deepStrictEqual(actual, [
			0xCB, 0xCB, 0xCB, 0xFF,
			0x81, 0x81, 0x81, 0xFF,
		]);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/view/viewLayer.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/view/viewLayer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ILine, RenderedLinesCollection } from '../../../browser/view/viewLayer.js';

class TestLine implements ILine {

	_pinged = false;
	constructor(public id: string) {
	}

	onContentChanged(): void {
		this._pinged = true;
	}
	onTokensChanged(): void {
		this._pinged = true;
	}
}

interface ILinesCollectionState {
	startLineNumber: number;
	lines: string[];
	pinged: boolean[];
}

function assertState(col: RenderedLinesCollection<TestLine>, state: ILinesCollectionState): void {
	const actualState: ILinesCollectionState = {
		startLineNumber: col.getStartLineNumber(),
		lines: [],
		pinged: []
	};
	for (let lineNumber = col.getStartLineNumber(); lineNumber <= col.getEndLineNumber(); lineNumber++) {
		actualState.lines.push(col.getLine(lineNumber).id);
		actualState.pinged.push(col.getLine(lineNumber)._pinged);
	}
	assert.deepStrictEqual(actualState, state);
}

suite('RenderedLinesCollection onLinesDeleted', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function testOnModelLinesDeleted(deleteFromLineNumber: number, deleteToLineNumber: number, expectedDeleted: string[], expectedState: ILinesCollectionState): void {
		const col = new RenderedLinesCollection<TestLine>({ createLine: () => new TestLine('new') });
		col._set(6, [
			new TestLine('old6'),
			new TestLine('old7'),
			new TestLine('old8'),
			new TestLine('old9')
		]);
		const actualDeleted1 = col.onLinesDeleted(deleteFromLineNumber, deleteToLineNumber);
		let actualDeleted: string[] = [];
		if (actualDeleted1) {
			actualDeleted = actualDeleted1.map(line => line.id);
		}
		assert.deepStrictEqual(actualDeleted, expectedDeleted);
		assertState(col, expectedState);
	}

	test('A1', () => {
		testOnModelLinesDeleted(3, 3, [], {
			startLineNumber: 5,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A2', () => {
		testOnModelLinesDeleted(3, 4, [], {
			startLineNumber: 4,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A3', () => {
		testOnModelLinesDeleted(3, 5, [], {
			startLineNumber: 3,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A4', () => {
		testOnModelLinesDeleted(3, 6, ['old6'], {
			startLineNumber: 3,
			lines: ['old7', 'old8', 'old9'],
			pinged: [false, false, false]
		});
	});

	test('A5', () => {
		testOnModelLinesDeleted(3, 7, ['old6', 'old7'], {
			startLineNumber: 3,
			lines: ['old8', 'old9'],
			pinged: [false, false]
		});
	});

	test('A6', () => {
		testOnModelLinesDeleted(3, 8, ['old6', 'old7', 'old8'], {
			startLineNumber: 3,
			lines: ['old9'],
			pinged: [false]
		});
	});

	test('A7', () => {
		testOnModelLinesDeleted(3, 9, ['old6', 'old7', 'old8', 'old9'], {
			startLineNumber: 3,
			lines: [],
			pinged: []
		});
	});

	test('A8', () => {
		testOnModelLinesDeleted(3, 10, ['old6', 'old7', 'old8', 'old9'], {
			startLineNumber: 3,
			lines: [],
			pinged: []
		});
	});


	test('B1', () => {
		testOnModelLinesDeleted(5, 5, [], {
			startLineNumber: 5,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('B2', () => {
		testOnModelLinesDeleted(5, 6, ['old6'], {
			startLineNumber: 5,
			lines: ['old7', 'old8', 'old9'],
			pinged: [false, false, false]
		});
	});

	test('B3', () => {
		testOnModelLinesDeleted(5, 7, ['old6', 'old7'], {
			startLineNumber: 5,
			lines: ['old8', 'old9'],
			pinged: [false, false]
		});
	});

	test('B4', () => {
		testOnModelLinesDeleted(5, 8, ['old6', 'old7', 'old8'], {
			startLineNumber: 5,
			lines: ['old9'],
			pinged: [false]
		});
	});

	test('B5', () => {
		testOnModelLinesDeleted(5, 9, ['old6', 'old7', 'old8', 'old9'], {
			startLineNumber: 5,
			lines: [],
			pinged: []
		});
	});

	test('B6', () => {
		testOnModelLinesDeleted(5, 10, ['old6', 'old7', 'old8', 'old9'], {
			startLineNumber: 5,
			lines: [],
			pinged: []
		});
	});


	test('C1', () => {
		testOnModelLinesDeleted(6, 6, ['old6'], {
			startLineNumber: 6,
			lines: ['old7', 'old8', 'old9'],
			pinged: [false, false, false]
		});
	});

	test('C2', () => {
		testOnModelLinesDeleted(6, 7, ['old6', 'old7'], {
			startLineNumber: 6,
			lines: ['old8', 'old9'],
			pinged: [false, false]
		});
	});

	test('C3', () => {
		testOnModelLinesDeleted(6, 8, ['old6', 'old7', 'old8'], {
			startLineNumber: 6,
			lines: ['old9'],
			pinged: [false]
		});
	});

	test('C4', () => {
		testOnModelLinesDeleted(6, 9, ['old6', 'old7', 'old8', 'old9'], {
			startLineNumber: 6,
			lines: [],
			pinged: []
		});
	});

	test('C5', () => {
		testOnModelLinesDeleted(6, 10, ['old6', 'old7', 'old8', 'old9'], {
			startLineNumber: 6,
			lines: [],
			pinged: []
		});
	});


	test('D1', () => {
		testOnModelLinesDeleted(7, 7, ['old7'], {
			startLineNumber: 6,
			lines: ['old6', 'old8', 'old9'],
			pinged: [false, false, false]
		});
	});

	test('D2', () => {
		testOnModelLinesDeleted(7, 8, ['old7', 'old8'], {
			startLineNumber: 6,
			lines: ['old6', 'old9'],
			pinged: [false, false]
		});
	});

	test('D3', () => {
		testOnModelLinesDeleted(7, 9, ['old7', 'old8', 'old9'], {
			startLineNumber: 6,
			lines: ['old6'],
			pinged: [false]
		});
	});

	test('D4', () => {
		testOnModelLinesDeleted(7, 10, ['old7', 'old8', 'old9'], {
			startLineNumber: 6,
			lines: ['old6'],
			pinged: [false]
		});
	});


	test('E1', () => {
		testOnModelLinesDeleted(8, 8, ['old8'], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old9'],
			pinged: [false, false, false]
		});
	});

	test('E2', () => {
		testOnModelLinesDeleted(8, 9, ['old8', 'old9'], {
			startLineNumber: 6,
			lines: ['old6', 'old7'],
			pinged: [false, false]
		});
	});

	test('E3', () => {
		testOnModelLinesDeleted(8, 10, ['old8', 'old9'], {
			startLineNumber: 6,
			lines: ['old6', 'old7'],
			pinged: [false, false]
		});
	});


	test('F1', () => {
		testOnModelLinesDeleted(9, 9, ['old9'], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8'],
			pinged: [false, false, false]
		});
	});

	test('F2', () => {
		testOnModelLinesDeleted(9, 10, ['old9'], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8'],
			pinged: [false, false, false]
		});
	});


	test('G1', () => {
		testOnModelLinesDeleted(10, 10, [], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('G2', () => {
		testOnModelLinesDeleted(10, 11, [], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});


	test('H1', () => {
		testOnModelLinesDeleted(11, 13, [], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
});

suite('RenderedLinesCollection onLineChanged', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function testOnModelLineChanged(changedLineNumber: number, expectedPinged: boolean, expectedState: ILinesCollectionState): void {
		const col = new RenderedLinesCollection<TestLine>({ createLine: () => new TestLine('new') });
		col._set(6, [
			new TestLine('old6'),
			new TestLine('old7'),
			new TestLine('old8'),
			new TestLine('old9')
		]);
		const actualPinged = col.onLinesChanged(changedLineNumber, 1);
		assert.deepStrictEqual(actualPinged, expectedPinged);
		assertState(col, expectedState);
	}

	test('3', () => {
		testOnModelLineChanged(3, false, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
	test('4', () => {
		testOnModelLineChanged(4, false, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
	test('5', () => {
		testOnModelLineChanged(5, false, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
	test('6', () => {
		testOnModelLineChanged(6, true, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [true, false, false, false]
		});
	});
	test('7', () => {
		testOnModelLineChanged(7, true, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, true, false, false]
		});
	});
	test('8', () => {
		testOnModelLineChanged(8, true, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, true, false]
		});
	});
	test('9', () => {
		testOnModelLineChanged(9, true, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, true]
		});
	});
	test('10', () => {
		testOnModelLineChanged(10, false, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
	test('11', () => {
		testOnModelLineChanged(11, false, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

});

suite('RenderedLinesCollection onLinesInserted', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function testOnModelLinesInserted(insertFromLineNumber: number, insertToLineNumber: number, expectedDeleted: string[], expectedState: ILinesCollectionState): void {
		const col = new RenderedLinesCollection<TestLine>({ createLine: () => new TestLine('new') });
		col._set(6, [
			new TestLine('old6'),
			new TestLine('old7'),
			new TestLine('old8'),
			new TestLine('old9')
		]);
		const actualDeleted1 = col.onLinesInserted(insertFromLineNumber, insertToLineNumber);
		let actualDeleted: string[] = [];
		if (actualDeleted1) {
			actualDeleted = actualDeleted1.map(line => line.id);
		}
		assert.deepStrictEqual(actualDeleted, expectedDeleted);
		assertState(col, expectedState);
	}

	test('A1', () => {
		testOnModelLinesInserted(3, 3, [], {
			startLineNumber: 7,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A2', () => {
		testOnModelLinesInserted(3, 4, [], {
			startLineNumber: 8,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A3', () => {
		testOnModelLinesInserted(3, 5, [], {
			startLineNumber: 9,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A4', () => {
		testOnModelLinesInserted(3, 6, [], {
			startLineNumber: 10,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A5', () => {
		testOnModelLinesInserted(3, 7, [], {
			startLineNumber: 11,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A6', () => {
		testOnModelLinesInserted(3, 8, [], {
			startLineNumber: 12,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A7', () => {
		testOnModelLinesInserted(3, 9, [], {
			startLineNumber: 13,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('A8', () => {
		testOnModelLinesInserted(3, 10, [], {
			startLineNumber: 14,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});


	test('B1', () => {
		testOnModelLinesInserted(5, 5, [], {
			startLineNumber: 7,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('B2', () => {
		testOnModelLinesInserted(5, 6, [], {
			startLineNumber: 8,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('B3', () => {
		testOnModelLinesInserted(5, 7, [], {
			startLineNumber: 9,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('B4', () => {
		testOnModelLinesInserted(5, 8, [], {
			startLineNumber: 10,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('B5', () => {
		testOnModelLinesInserted(5, 9, [], {
			startLineNumber: 11,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('B6', () => {
		testOnModelLinesInserted(5, 10, [], {
			startLineNumber: 12,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});


	test('C1', () => {
		testOnModelLinesInserted(6, 6, [], {
			startLineNumber: 7,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('C2', () => {
		testOnModelLinesInserted(6, 7, [], {
			startLineNumber: 8,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('C3', () => {
		testOnModelLinesInserted(6, 8, [], {
			startLineNumber: 9,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('C4', () => {
		testOnModelLinesInserted(6, 9, [], {
			startLineNumber: 10,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('C5', () => {
		testOnModelLinesInserted(6, 10, [], {
			startLineNumber: 11,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});


	test('D1', () => {
		testOnModelLinesInserted(7, 7, ['old9'], {
			startLineNumber: 6,
			lines: ['old6', 'new', 'old7', 'old8'],
			pinged: [false, false, false, false]
		});
	});

	test('D2', () => {
		testOnModelLinesInserted(7, 8, ['old8', 'old9'], {
			startLineNumber: 6,
			lines: ['old6', 'new', 'new', 'old7'],
			pinged: [false, false, false, false]
		});
	});

	test('D3', () => {
		testOnModelLinesInserted(7, 9, ['old7', 'old8', 'old9'], {
			startLineNumber: 6,
			lines: ['old6'],
			pinged: [false]
		});
	});

	test('D4', () => {
		testOnModelLinesInserted(7, 10, ['old7', 'old8', 'old9'], {
			startLineNumber: 6,
			lines: ['old6'],
			pinged: [false]
		});
	});


	test('E1', () => {
		testOnModelLinesInserted(8, 8, ['old9'], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'new', 'old8'],
			pinged: [false, false, false, false]
		});
	});

	test('E2', () => {
		testOnModelLinesInserted(8, 9, ['old8', 'old9'], {
			startLineNumber: 6,
			lines: ['old6', 'old7'],
			pinged: [false, false]
		});
	});

	test('E3', () => {
		testOnModelLinesInserted(8, 10, ['old8', 'old9'], {
			startLineNumber: 6,
			lines: ['old6', 'old7'],
			pinged: [false, false]
		});
	});


	test('F1', () => {
		testOnModelLinesInserted(9, 9, ['old9'], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8'],
			pinged: [false, false, false]
		});
	});

	test('F2', () => {
		testOnModelLinesInserted(9, 10, ['old9'], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8'],
			pinged: [false, false, false]
		});
	});


	test('G1', () => {
		testOnModelLinesInserted(10, 10, [], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});

	test('G2', () => {
		testOnModelLinesInserted(10, 11, [], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});


	test('H1', () => {
		testOnModelLinesInserted(11, 13, [], {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
});


suite('RenderedLinesCollection onTokensChanged', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function testOnModelTokensChanged(changedFromLineNumber: number, changedToLineNumber: number, expectedPinged: boolean, expectedState: ILinesCollectionState): void {
		const col = new RenderedLinesCollection<TestLine>({ createLine: () => new TestLine('new') });
		col._set(6, [
			new TestLine('old6'),
			new TestLine('old7'),
			new TestLine('old8'),
			new TestLine('old9')
		]);
		const actualPinged = col.onTokensChanged([{ fromLineNumber: changedFromLineNumber, toLineNumber: changedToLineNumber }]);
		assert.deepStrictEqual(actualPinged, expectedPinged);
		assertState(col, expectedState);
	}

	test('A', () => {
		testOnModelTokensChanged(3, 3, false, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
	test('B', () => {
		testOnModelTokensChanged(3, 5, false, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
	test('C', () => {
		testOnModelTokensChanged(3, 6, true, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [true, false, false, false]
		});
	});
	test('D', () => {
		testOnModelTokensChanged(6, 6, true, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [true, false, false, false]
		});
	});
	test('E', () => {
		testOnModelTokensChanged(5, 10, true, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [true, true, true, true]
		});
	});
	test('F', () => {
		testOnModelTokensChanged(8, 9, true, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, true, true]
		});
	});
	test('G', () => {
		testOnModelTokensChanged(8, 11, true, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, true, true]
		});
	});
	test('H', () => {
		testOnModelTokensChanged(10, 10, false, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
	test('I', () => {
		testOnModelTokensChanged(10, 11, false, {
			startLineNumber: 6,
			lines: ['old6', 'old7', 'old8', 'old9'],
			pinged: [false, false, false, false]
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/viewModel/modelLineProjection.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/viewModel/modelLineProjection.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import * as languages from '../../../common/languages.js';
import { NullState } from '../../../common/languages/nullTokenize.js';
import { EndOfLinePreference } from '../../../common/model.js';
import { TextModel } from '../../../common/model/textModel.js';
import { ModelLineProjectionData } from '../../../common/modelLineProjectionData.js';
import { IViewLineTokens } from '../../../common/tokens/lineTokens.js';
import { ViewLineData } from '../../../common/viewModel.js';
import { IModelLineProjection, ISimpleModel, createModelLineProjection } from '../../../common/viewModel/modelLineProjection.js';
import { MonospaceLineBreaksComputerFactory } from '../../../common/viewModel/monospaceLineBreaksComputer.js';
import { ViewModelLinesFromProjectedModel } from '../../../common/viewModel/viewModelLines.js';
import { TestConfiguration } from '../config/testConfiguration.js';
import { createTextModel } from '../../common/testTextModel.js';

suite('Editor ViewModel - SplitLinesCollection', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('SplitLine', () => {
		let model1 = createModel('My First LineMy Second LineAnd another one');
		let line1 = createSplitLine([13, 14, 15], [13, 13 + 14, 13 + 14 + 15], 0);

		assert.strictEqual(line1.getViewLineCount(), 3);
		assert.strictEqual(line1.getViewLineContent(model1, 1, 0), 'My First Line');
		assert.strictEqual(line1.getViewLineContent(model1, 1, 1), 'My Second Line');
		assert.strictEqual(line1.getViewLineContent(model1, 1, 2), 'And another one');
		assert.strictEqual(line1.getViewLineMaxColumn(model1, 1, 0), 14);
		assert.strictEqual(line1.getViewLineMaxColumn(model1, 1, 1), 15);
		assert.strictEqual(line1.getViewLineMaxColumn(model1, 1, 2), 16);
		for (let col = 1; col <= 14; col++) {
			assert.strictEqual(line1.getModelColumnOfViewPosition(0, col), col, 'getInputColumnOfOutputPosition(0, ' + col + ')');
		}
		for (let col = 1; col <= 15; col++) {
			assert.strictEqual(line1.getModelColumnOfViewPosition(1, col), 13 + col, 'getInputColumnOfOutputPosition(1, ' + col + ')');
		}
		for (let col = 1; col <= 16; col++) {
			assert.strictEqual(line1.getModelColumnOfViewPosition(2, col), 13 + 14 + col, 'getInputColumnOfOutputPosition(2, ' + col + ')');
		}
		for (let col = 1; col <= 13; col++) {
			assert.deepStrictEqual(line1.getViewPositionOfModelPosition(0, col), pos(0, col), 'getOutputPositionOfInputPosition(' + col + ')');
		}
		for (let col = 1 + 13; col <= 14 + 13; col++) {
			assert.deepStrictEqual(line1.getViewPositionOfModelPosition(0, col), pos(1, col - 13), 'getOutputPositionOfInputPosition(' + col + ')');
		}
		for (let col = 1 + 13 + 14; col <= 15 + 14 + 13; col++) {
			assert.deepStrictEqual(line1.getViewPositionOfModelPosition(0, col), pos(2, col - 13 - 14), 'getOutputPositionOfInputPosition(' + col + ')');
		}

		model1 = createModel('My First LineMy Second LineAnd another one');
		line1 = createSplitLine([13, 14, 15], [13, 13 + 14, 13 + 14 + 15], 4);

		assert.strictEqual(line1.getViewLineCount(), 3);
		assert.strictEqual(line1.getViewLineContent(model1, 1, 0), 'My First Line');
		assert.strictEqual(line1.getViewLineContent(model1, 1, 1), '    My Second Line');
		assert.strictEqual(line1.getViewLineContent(model1, 1, 2), '    And another one');
		assert.strictEqual(line1.getViewLineMaxColumn(model1, 1, 0), 14);
		assert.strictEqual(line1.getViewLineMaxColumn(model1, 1, 1), 19);
		assert.strictEqual(line1.getViewLineMaxColumn(model1, 1, 2), 20);

		const actualViewColumnMapping: number[][] = [];
		for (let lineIndex = 0; lineIndex < line1.getViewLineCount(); lineIndex++) {
			const actualLineViewColumnMapping: number[] = [];
			for (let col = 1; col <= line1.getViewLineMaxColumn(model1, 1, lineIndex); col++) {
				actualLineViewColumnMapping.push(line1.getModelColumnOfViewPosition(lineIndex, col));
			}
			actualViewColumnMapping.push(actualLineViewColumnMapping);
		}
		assert.deepStrictEqual(actualViewColumnMapping, [
			[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
			[14, 14, 14, 14, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
			[28, 28, 28, 28, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
		]);

		for (let col = 1; col <= 13; col++) {
			assert.deepStrictEqual(line1.getViewPositionOfModelPosition(0, col), pos(0, col), '6.getOutputPositionOfInputPosition(' + col + ')');
		}
		for (let col = 1 + 13; col <= 14 + 13; col++) {
			assert.deepStrictEqual(line1.getViewPositionOfModelPosition(0, col), pos(1, 4 + col - 13), '7.getOutputPositionOfInputPosition(' + col + ')');
		}
		for (let col = 1 + 13 + 14; col <= 15 + 14 + 13; col++) {
			assert.deepStrictEqual(line1.getViewPositionOfModelPosition(0, col), pos(2, 4 + col - 13 - 14), '8.getOutputPositionOfInputPosition(' + col + ')');
		}
	});

	function withSplitLinesCollection(text: string, callback: (model: TextModel, linesCollection: ViewModelLinesFromProjectedModel) => void): void {
		const config = new TestConfiguration({});
		const wrappingInfo = config.options.get(EditorOption.wrappingInfo);
		const fontInfo = config.options.get(EditorOption.fontInfo);
		const wordWrapBreakAfterCharacters = config.options.get(EditorOption.wordWrapBreakAfterCharacters);
		const wordWrapBreakBeforeCharacters = config.options.get(EditorOption.wordWrapBreakBeforeCharacters);
		const wrappingIndent = config.options.get(EditorOption.wrappingIndent);
		const wordBreak = config.options.get(EditorOption.wordBreak);
		const wrapOnEscapedLineFeeds = config.options.get(EditorOption.wrapOnEscapedLineFeeds);
		const lineBreaksComputerFactory = new MonospaceLineBreaksComputerFactory(wordWrapBreakBeforeCharacters, wordWrapBreakAfterCharacters);

		const model = createTextModel(text);

		const linesCollection = new ViewModelLinesFromProjectedModel(
			1,
			model,
			lineBreaksComputerFactory,
			lineBreaksComputerFactory,
			fontInfo,
			model.getOptions().tabSize,
			'simple',
			wrappingInfo.wrappingColumn,
			wrappingIndent,
			wordBreak,
			wrapOnEscapedLineFeeds
		);

		callback(model, linesCollection);

		linesCollection.dispose();
		model.dispose();
		config.dispose();
	}

	test('Invalid line numbers', () => {

		const text = [
			'int main() {',
			'\tprintf("Hello world!");',
			'}',
			'int main() {',
			'\tprintf("Hello world!");',
			'}',
		].join('\n');

		withSplitLinesCollection(text, (model, linesCollection) => {
			assert.strictEqual(linesCollection.getViewLineCount(), 6);

			// getOutputIndentGuide
			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(-1, -1), [0]);
			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(0, 0), [0]);
			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(1, 1), [0]);
			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(2, 2), [1]);
			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(3, 3), [0]);
			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(4, 4), [0]);
			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(5, 5), [1]);
			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(6, 6), [0]);
			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(7, 7), [0]);

			assert.deepStrictEqual(linesCollection.getViewLinesIndentGuides(0, 7), [0, 1, 0, 0, 1, 0]);

			// getOutputLineContent
			assert.strictEqual(linesCollection.getViewLineContent(-1), 'int main() {');
			assert.strictEqual(linesCollection.getViewLineContent(0), 'int main() {');
			assert.strictEqual(linesCollection.getViewLineContent(1), 'int main() {');
			assert.strictEqual(linesCollection.getViewLineContent(2), '\tprintf("Hello world!");');
			assert.strictEqual(linesCollection.getViewLineContent(3), '}');
			assert.strictEqual(linesCollection.getViewLineContent(4), 'int main() {');
			assert.strictEqual(linesCollection.getViewLineContent(5), '\tprintf("Hello world!");');
			assert.strictEqual(linesCollection.getViewLineContent(6), '}');
			assert.strictEqual(linesCollection.getViewLineContent(7), '}');

			// getOutputLineMinColumn
			assert.strictEqual(linesCollection.getViewLineMinColumn(-1), 1);
			assert.strictEqual(linesCollection.getViewLineMinColumn(0), 1);
			assert.strictEqual(linesCollection.getViewLineMinColumn(1), 1);
			assert.strictEqual(linesCollection.getViewLineMinColumn(2), 1);
			assert.strictEqual(linesCollection.getViewLineMinColumn(3), 1);
			assert.strictEqual(linesCollection.getViewLineMinColumn(4), 1);
			assert.strictEqual(linesCollection.getViewLineMinColumn(5), 1);
			assert.strictEqual(linesCollection.getViewLineMinColumn(6), 1);
			assert.strictEqual(linesCollection.getViewLineMinColumn(7), 1);

			// getOutputLineMaxColumn
			assert.strictEqual(linesCollection.getViewLineMaxColumn(-1), 13);
			assert.strictEqual(linesCollection.getViewLineMaxColumn(0), 13);
			assert.strictEqual(linesCollection.getViewLineMaxColumn(1), 13);
			assert.strictEqual(linesCollection.getViewLineMaxColumn(2), 25);
			assert.strictEqual(linesCollection.getViewLineMaxColumn(3), 2);
			assert.strictEqual(linesCollection.getViewLineMaxColumn(4), 13);
			assert.strictEqual(linesCollection.getViewLineMaxColumn(5), 25);
			assert.strictEqual(linesCollection.getViewLineMaxColumn(6), 2);
			assert.strictEqual(linesCollection.getViewLineMaxColumn(7), 2);

			// convertOutputPositionToInputPosition
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(-1, 1), new Position(1, 1));
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(0, 1), new Position(1, 1));
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(1, 1), new Position(1, 1));
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(2, 1), new Position(2, 1));
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(3, 1), new Position(3, 1));
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(4, 1), new Position(4, 1));
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(5, 1), new Position(5, 1));
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(6, 1), new Position(6, 1));
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(7, 1), new Position(6, 1));
			assert.deepStrictEqual(linesCollection.convertViewPositionToModelPosition(8, 1), new Position(6, 1));
		});
	});

	test('issue #3662', () => {

		const text = [
			'int main() {',
			'\tprintf("Hello world!");',
			'}',
			'int main() {',
			'\tprintf("Hello world!");',
			'}',
		].join('\n');

		withSplitLinesCollection(text, (model, linesCollection) => {
			linesCollection.setHiddenAreas([
				new Range(1, 1, 3, 1),
				new Range(5, 1, 6, 1)
			]);

			const viewLineCount = linesCollection.getViewLineCount();
			assert.strictEqual(viewLineCount, 1, 'getOutputLineCount()');

			const modelLineCount = model.getLineCount();
			for (let lineNumber = 0; lineNumber <= modelLineCount + 1; lineNumber++) {
				const lineMinColumn = (lineNumber >= 1 && lineNumber <= modelLineCount) ? model.getLineMinColumn(lineNumber) : 1;
				const lineMaxColumn = (lineNumber >= 1 && lineNumber <= modelLineCount) ? model.getLineMaxColumn(lineNumber) : 1;
				for (let column = lineMinColumn - 1; column <= lineMaxColumn + 1; column++) {
					const viewPosition = linesCollection.convertModelPositionToViewPosition(lineNumber, column);

					// validate view position
					let viewLineNumber = viewPosition.lineNumber;
					let viewColumn = viewPosition.column;
					if (viewLineNumber < 1) {
						viewLineNumber = 1;
					}
					const lineCount = linesCollection.getViewLineCount();
					if (viewLineNumber > lineCount) {
						viewLineNumber = lineCount;
					}
					const viewMinColumn = linesCollection.getViewLineMinColumn(viewLineNumber);
					const viewMaxColumn = linesCollection.getViewLineMaxColumn(viewLineNumber);
					if (viewColumn < viewMinColumn) {
						viewColumn = viewMinColumn;
					}
					if (viewColumn > viewMaxColumn) {
						viewColumn = viewMaxColumn;
					}
					const validViewPosition = new Position(viewLineNumber, viewColumn);
					assert.strictEqual(viewPosition.toString(), validViewPosition.toString(), 'model->view for ' + lineNumber + ', ' + column);
				}
			}

			for (let lineNumber = 0; lineNumber <= viewLineCount + 1; lineNumber++) {
				const lineMinColumn = linesCollection.getViewLineMinColumn(lineNumber);
				const lineMaxColumn = linesCollection.getViewLineMaxColumn(lineNumber);
				for (let column = lineMinColumn - 1; column <= lineMaxColumn + 1; column++) {
					const modelPosition = linesCollection.convertViewPositionToModelPosition(lineNumber, column);
					const validModelPosition = model.validatePosition(modelPosition);
					assert.strictEqual(modelPosition.toString(), validModelPosition.toString(), 'view->model for ' + lineNumber + ', ' + column);
				}
			}
		});
	});

});

suite('SplitLinesCollection', () => {

	const _text = [
		'class Nice {',
		'	function hi() {',
		'		console.log("Hello world");',
		'	}',
		'	function hello() {',
		'		console.log("Hello world, this is a somewhat longer line");',
		'	}',
		'}',
	];

	const _tokens = [
		[
			{ startIndex: 0, value: 1 },
			{ startIndex: 5, value: 2 },
			{ startIndex: 6, value: 3 },
			{ startIndex: 10, value: 4 },
		],
		[
			{ startIndex: 0, value: 5 },
			{ startIndex: 1, value: 6 },
			{ startIndex: 9, value: 7 },
			{ startIndex: 10, value: 8 },
			{ startIndex: 12, value: 9 },
		],
		[
			{ startIndex: 0, value: 10 },
			{ startIndex: 2, value: 11 },
			{ startIndex: 9, value: 12 },
			{ startIndex: 10, value: 13 },
			{ startIndex: 13, value: 14 },
			{ startIndex: 14, value: 15 },
			{ startIndex: 27, value: 16 },
		],
		[
			{ startIndex: 0, value: 17 },
		],
		[
			{ startIndex: 0, value: 18 },
			{ startIndex: 1, value: 19 },
			{ startIndex: 9, value: 20 },
			{ startIndex: 10, value: 21 },
			{ startIndex: 15, value: 22 },
		],
		[
			{ startIndex: 0, value: 23 },
			{ startIndex: 2, value: 24 },
			{ startIndex: 9, value: 25 },
			{ startIndex: 10, value: 26 },
			{ startIndex: 13, value: 27 },
			{ startIndex: 14, value: 28 },
			{ startIndex: 59, value: 29 },
		],
		[
			{ startIndex: 0, value: 30 },
		],
		[
			{ startIndex: 0, value: 31 },
		]
	];

	let model: TextModel;
	let languageRegistration: IDisposable;

	setup(() => {
		let _lineIndex = 0;
		const tokenizationSupport: languages.ITokenizationSupport = {
			getInitialState: () => NullState,
			tokenize: undefined!,
			tokenizeEncoded: (line: string, hasEOL: boolean, state: languages.IState): languages.EncodedTokenizationResult => {
				const tokens = _tokens[_lineIndex++];

				const result = new Uint32Array(2 * tokens.length);
				for (let i = 0; i < tokens.length; i++) {
					result[2 * i] = tokens[i].startIndex;
					result[2 * i + 1] = (
						tokens[i].value << MetadataConsts.FOREGROUND_OFFSET
					);
				}
				return new languages.EncodedTokenizationResult(result, [], state);
			}
		};
		const LANGUAGE_ID = 'modelModeTest1';
		languageRegistration = languages.TokenizationRegistry.register(LANGUAGE_ID, tokenizationSupport);
		model = createTextModel(_text.join('\n'), LANGUAGE_ID);
		// force tokenization
		model.tokenization.forceTokenization(model.getLineCount());
	});

	teardown(() => {
		model.dispose();
		languageRegistration.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	interface ITestViewLineToken {
		endIndex: number;
		value: number;
	}

	function assertViewLineTokens(_actual: IViewLineTokens, expected: ITestViewLineToken[]): void {
		const actual: ITestViewLineToken[] = [];
		for (let i = 0, len = _actual.getCount(); i < len; i++) {
			actual[i] = {
				endIndex: _actual.getEndOffset(i),
				value: _actual.getForeground(i)
			};
		}
		assert.deepStrictEqual(actual, expected);
	}

	interface ITestMinimapLineRenderingData {
		content: string;
		minColumn: number;
		maxColumn: number;
		tokens: ITestViewLineToken[];
	}

	function assertMinimapLineRenderingData(actual: ViewLineData, expected: ITestMinimapLineRenderingData | null): void {
		if (actual === null && expected === null) {
			assert.ok(true);
			return;
		}
		if (expected === null) {
			assert.ok(false);
		}
		assert.strictEqual(actual.content, expected.content);
		assert.strictEqual(actual.minColumn, expected.minColumn);
		assert.strictEqual(actual.maxColumn, expected.maxColumn);
		assertViewLineTokens(actual.tokens, expected.tokens);
	}

	function assertMinimapLinesRenderingData(actual: ViewLineData[], expected: Array<ITestMinimapLineRenderingData | null>): void {
		assert.strictEqual(actual.length, expected.length);
		for (let i = 0; i < expected.length; i++) {
			assertMinimapLineRenderingData(actual[i], expected[i]);
		}
	}

	function assertAllMinimapLinesRenderingData(splitLinesCollection: ViewModelLinesFromProjectedModel, all: ITestMinimapLineRenderingData[]): void {
		const lineCount = all.length;
		for (let line = 1; line <= lineCount; line++) {
			assert.strictEqual(splitLinesCollection.getViewLineData(line).content, splitLinesCollection.getViewLineContent(line));
		}

		for (let start = 1; start <= lineCount; start++) {
			for (let end = start; end <= lineCount; end++) {
				const count = end - start + 1;
				for (let desired = Math.pow(2, count) - 1; desired >= 0; desired--) {
					const needed: boolean[] = [];
					const expected: Array<ITestMinimapLineRenderingData | null> = [];
					for (let i = 0; i < count; i++) {
						needed[i] = (desired & (1 << i)) ? true : false;
						expected[i] = (needed[i] ? all[start - 1 + i] : null);
					}
					const actual = splitLinesCollection.getViewLinesData(start, end, needed);

					assertMinimapLinesRenderingData(actual, expected);
					// Comment out next line to test all possible combinations
					break;
				}
			}
		}
	}

	test('getViewLinesData - no wrapping', () => {
		withSplitLinesCollection(model, 'off', 0, false, (splitLinesCollection) => {
			assert.strictEqual(splitLinesCollection.getViewLineCount(), 8);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(1, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(2, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(3, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(4, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(5, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(6, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(7, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(8, 1), true);

			const _expected: ITestMinimapLineRenderingData[] = [
				{
					content: 'class Nice {',
					minColumn: 1,
					maxColumn: 13,
					tokens: [
						{ endIndex: 5, value: 1 },
						{ endIndex: 6, value: 2 },
						{ endIndex: 10, value: 3 },
						{ endIndex: 12, value: 4 },
					]
				},
				{
					content: '	function hi() {',
					minColumn: 1,
					maxColumn: 17,
					tokens: [
						{ endIndex: 1, value: 5 },
						{ endIndex: 9, value: 6 },
						{ endIndex: 10, value: 7 },
						{ endIndex: 12, value: 8 },
						{ endIndex: 16, value: 9 },
					]
				},
				{
					content: '		console.log("Hello world");',
					minColumn: 1,
					maxColumn: 30,
					tokens: [
						{ endIndex: 2, value: 10 },
						{ endIndex: 9, value: 11 },
						{ endIndex: 10, value: 12 },
						{ endIndex: 13, value: 13 },
						{ endIndex: 14, value: 14 },
						{ endIndex: 27, value: 15 },
						{ endIndex: 29, value: 16 },
					]
				},
				{
					content: '	}',
					minColumn: 1,
					maxColumn: 3,
					tokens: [
						{ endIndex: 2, value: 17 },
					]
				},
				{
					content: '	function hello() {',
					minColumn: 1,
					maxColumn: 20,
					tokens: [
						{ endIndex: 1, value: 18 },
						{ endIndex: 9, value: 19 },
						{ endIndex: 10, value: 20 },
						{ endIndex: 15, value: 21 },
						{ endIndex: 19, value: 22 },
					]
				},
				{
					content: '		console.log("Hello world, this is a somewhat longer line");',
					minColumn: 1,
					maxColumn: 62,
					tokens: [
						{ endIndex: 2, value: 23 },
						{ endIndex: 9, value: 24 },
						{ endIndex: 10, value: 25 },
						{ endIndex: 13, value: 26 },
						{ endIndex: 14, value: 27 },
						{ endIndex: 59, value: 28 },
						{ endIndex: 61, value: 29 },
					]
				},
				{
					minColumn: 1,
					maxColumn: 3,
					content: '	}',
					tokens: [
						{ endIndex: 2, value: 30 },
					]
				},
				{
					minColumn: 1,
					maxColumn: 2,
					content: '}',
					tokens: [
						{ endIndex: 1, value: 31 },
					]
				}
			];

			assertAllMinimapLinesRenderingData(splitLinesCollection, [
				_expected[0],
				_expected[1],
				_expected[2],
				_expected[3],
				_expected[4],
				_expected[5],
				_expected[6],
				_expected[7],
			]);

			splitLinesCollection.setHiddenAreas([new Range(2, 1, 4, 1)]);
			assert.strictEqual(splitLinesCollection.getViewLineCount(), 5);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(1, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(2, 1), false);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(3, 1), false);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(4, 1), false);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(5, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(6, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(7, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(8, 1), true);

			assertAllMinimapLinesRenderingData(splitLinesCollection, [
				_expected[0],
				_expected[4],
				_expected[5],
				_expected[6],
				_expected[7],
			]);
		});
	});

	test('getViewLinesData - with wrapping', () => {
		withSplitLinesCollection(model, 'wordWrapColumn', 30, false, (splitLinesCollection) => {
			assert.strictEqual(splitLinesCollection.getViewLineCount(), 12);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(1, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(2, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(3, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(4, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(5, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(6, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(7, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(8, 1), true);

			const _expected: ITestMinimapLineRenderingData[] = [
				{
					content: 'class Nice {',
					minColumn: 1,
					maxColumn: 13,
					tokens: [
						{ endIndex: 5, value: 1 },
						{ endIndex: 6, value: 2 },
						{ endIndex: 10, value: 3 },
						{ endIndex: 12, value: 4 },
					]
				},
				{
					content: '	function hi() {',
					minColumn: 1,
					maxColumn: 17,
					tokens: [
						{ endIndex: 1, value: 5 },
						{ endIndex: 9, value: 6 },
						{ endIndex: 10, value: 7 },
						{ endIndex: 12, value: 8 },
						{ endIndex: 16, value: 9 },
					]
				},
				{
					content: '		console.log("Hello ',
					minColumn: 1,
					maxColumn: 22,
					tokens: [
						{ endIndex: 2, value: 10 },
						{ endIndex: 9, value: 11 },
						{ endIndex: 10, value: 12 },
						{ endIndex: 13, value: 13 },
						{ endIndex: 14, value: 14 },
						{ endIndex: 21, value: 15 },
					]
				},
				{
					content: '            world");',
					minColumn: 13,
					maxColumn: 21,
					tokens: [
						{ endIndex: 18, value: 15 },
						{ endIndex: 20, value: 16 },
					]
				},
				{
					content: '	}',
					minColumn: 1,
					maxColumn: 3,
					tokens: [
						{ endIndex: 2, value: 17 },
					]
				},
				{
					content: '	function hello() {',
					minColumn: 1,
					maxColumn: 20,
					tokens: [
						{ endIndex: 1, value: 18 },
						{ endIndex: 9, value: 19 },
						{ endIndex: 10, value: 20 },
						{ endIndex: 15, value: 21 },
						{ endIndex: 19, value: 22 },
					]
				},
				{
					content: '		console.log("Hello ',
					minColumn: 1,
					maxColumn: 22,
					tokens: [
						{ endIndex: 2, value: 23 },
						{ endIndex: 9, value: 24 },
						{ endIndex: 10, value: 25 },
						{ endIndex: 13, value: 26 },
						{ endIndex: 14, value: 27 },
						{ endIndex: 21, value: 28 },
					]
				},
				{
					content: '            world, this is a ',
					minColumn: 13,
					maxColumn: 30,
					tokens: [
						{ endIndex: 29, value: 28 },
					]
				},
				{
					content: '            somewhat longer ',
					minColumn: 13,
					maxColumn: 29,
					tokens: [
						{ endIndex: 28, value: 28 },
					]
				},
				{
					content: '            line");',
					minColumn: 13,
					maxColumn: 20,
					tokens: [
						{ endIndex: 17, value: 28 },
						{ endIndex: 19, value: 29 },
					]
				},
				{
					content: '	}',
					minColumn: 1,
					maxColumn: 3,
					tokens: [
						{ endIndex: 2, value: 30 },
					]
				},
				{
					content: '}',
					minColumn: 1,
					maxColumn: 2,
					tokens: [
						{ endIndex: 1, value: 31 },
					]
				}
			];

			assertAllMinimapLinesRenderingData(splitLinesCollection, [
				_expected[0],
				_expected[1],
				_expected[2],
				_expected[3],
				_expected[4],
				_expected[5],
				_expected[6],
				_expected[7],
				_expected[8],
				_expected[9],
				_expected[10],
				_expected[11],
			]);

			splitLinesCollection.setHiddenAreas([new Range(2, 1, 4, 1)]);
			assert.strictEqual(splitLinesCollection.getViewLineCount(), 8);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(1, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(2, 1), false);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(3, 1), false);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(4, 1), false);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(5, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(6, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(7, 1), true);
			assert.strictEqual(splitLinesCollection.modelPositionIsVisible(8, 1), true);

			assertAllMinimapLinesRenderingData(splitLinesCollection, [
				_expected[0],
				_expected[5],
				_expected[6],
				_expected[7],
				_expected[8],
				_expected[9],
				_expected[10],
				_expected[11],
			]);
		});
	});

	test('getViewLinesData - with wrapping and injected text', () => {
		model.deltaDecorations([], [{
			range: new Range(1, 9, 1, 9),
			options: {
				description: 'example',
				after: {
					content: 'very very long injected text that causes a line break',
					inlineClassName: 'myClassName'
				},
				showIfCollapsed: true,
			}
		}]);

		withSplitLinesCollection(model, 'wordWrapColumn', 30, false, (splitLinesCollection) => {
			assert.strictEqual(splitLinesCollection.getViewLineCount(), 14);

			assert.strictEqual(splitLinesCollection.getViewLineMaxColumn(1), 24);

			const _expected: ITestMinimapLineRenderingData[] = [
				{
					content: 'class Nivery very long ',
					minColumn: 1,
					maxColumn: 24,
					tokens: [
						{ endIndex: 5, value: 1 },
						{ endIndex: 6, value: 2 },
						{ endIndex: 8, value: 3 },
						{ endIndex: 23, value: 1 },
					]
				},
				{
					content: '    injected text that causes ',
					minColumn: 5,
					maxColumn: 31,
					tokens: [{ endIndex: 30, value: 1 }]
				},
				{
					content: '    a line breakce {',
					minColumn: 5,
					maxColumn: 21,
					tokens: [
						{ endIndex: 16, value: 1 },
						{ endIndex: 18, value: 3 },
						{ endIndex: 20, value: 4 }
					]
				},
				{
					content: '	function hi() {',
					minColumn: 1,
					maxColumn: 17,
					tokens: [
						{ endIndex: 1, value: 5 },
						{ endIndex: 9, value: 6 },
						{ endIndex: 10, value: 7 },
						{ endIndex: 12, value: 8 },
						{ endIndex: 16, value: 9 },
					]
				},
				{
					content: '		console.log("Hello ',
					minColumn: 1,
					maxColumn: 22,
					tokens: [
						{ endIndex: 2, value: 10 },
						{ endIndex: 9, value: 11 },
						{ endIndex: 10, value: 12 },
						{ endIndex: 13, value: 13 },
						{ endIndex: 14, value: 14 },
						{ endIndex: 21, value: 15 },
					]
				},
				{
					content: '            world");',
					minColumn: 13,
					maxColumn: 21,
					tokens: [
						{ endIndex: 18, value: 15 },
						{ endIndex: 20, value: 16 },
					]
				},
				{
					content: '	}',
					minColumn: 1,
					maxColumn: 3,
					tokens: [
						{ endIndex: 2, value: 17 },
					]
				},
				{
					content: '	function hello() {',
					minColumn: 1,
					maxColumn: 20,
					tokens: [
						{ endIndex: 1, value: 18 },
						{ endIndex: 9, value: 19 },
						{ endIndex: 10, value: 20 },
						{ endIndex: 15, value: 21 },
						{ endIndex: 19, value: 22 },
					]
				},
				{
					content: '		console.log("Hello ',
					minColumn: 1,
					maxColumn: 22,
					tokens: [
						{ endIndex: 2, value: 23 },
						{ endIndex: 9, value: 24 },
						{ endIndex: 10, value: 25 },
						{ endIndex: 13, value: 26 },
						{ endIndex: 14, value: 27 },
						{ endIndex: 21, value: 28 },
					]
				},
				{
					content: '            world, this is a ',
					minColumn: 13,
					maxColumn: 30,
					tokens: [
						{ endIndex: 29, value: 28 },
					]
				},
				{
					content: '            somewhat longer ',
					minColumn: 13,
					maxColumn: 29,
					tokens: [
						{ endIndex: 28, value: 28 },
					]
				},
				{
					content: '            line");',
					minColumn: 13,
					maxColumn: 20,
					tokens: [
						{ endIndex: 17, value: 28 },
						{ endIndex: 19, value: 29 },
					]
				},
				{
					content: '	}',
					minColumn: 1,
					maxColumn: 3,
					tokens: [
						{ endIndex: 2, value: 30 },
					]
				},
				{
					content: '}',
					minColumn: 1,
					maxColumn: 2,
					tokens: [
						{ endIndex: 1, value: 31 },
					]
				}
			];

			assertAllMinimapLinesRenderingData(splitLinesCollection, [
				_expected[0],
				_expected[1],
				_expected[2],
				_expected[3],
				_expected[4],
				_expected[5],
				_expected[6],
				_expected[7],
				_expected[8],
				_expected[9],
				_expected[10],
				_expected[11],
			]);

			const data = splitLinesCollection.getViewLinesData(1, 14, new Array(14).fill(true));
			assert.deepStrictEqual(
				data.map((d) => ({
					inlineDecorations: d.inlineDecorations?.map((d) => ({
						startOffset: d.startOffset,
						endOffset: d.endOffset,
					})),
				})),
				[
					{ inlineDecorations: [{ startOffset: 8, endOffset: 23 }] },
					{ inlineDecorations: [{ startOffset: 4, endOffset: 30 }] },
					{ inlineDecorations: [{ startOffset: 4, endOffset: 16 }] },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
					{ inlineDecorations: undefined },
				]
			);
		});
	});

	function withSplitLinesCollection(model: TextModel, wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded', wordWrapColumn: number, wrapOnEscapedLineFeeds: boolean, callback: (splitLinesCollection: ViewModelLinesFromProjectedModel) => void): void {
		const configuration = new TestConfiguration({
			wordWrap: wordWrap,
			wordWrapColumn: wordWrapColumn,
			wrappingIndent: 'indent'
		});
		const wrappingInfo = configuration.options.get(EditorOption.wrappingInfo);
		const fontInfo = configuration.options.get(EditorOption.fontInfo);
		const wordWrapBreakAfterCharacters = configuration.options.get(EditorOption.wordWrapBreakAfterCharacters);
		const wordWrapBreakBeforeCharacters = configuration.options.get(EditorOption.wordWrapBreakBeforeCharacters);
		const wrappingIndent = configuration.options.get(EditorOption.wrappingIndent);
		const wordBreak = configuration.options.get(EditorOption.wordBreak);

		const lineBreaksComputerFactory = new MonospaceLineBreaksComputerFactory(wordWrapBreakBeforeCharacters, wordWrapBreakAfterCharacters);

		const linesCollection = new ViewModelLinesFromProjectedModel(
			1,
			model,
			lineBreaksComputerFactory,
			lineBreaksComputerFactory,
			fontInfo,
			model.getOptions().tabSize,
			'simple',
			wrappingInfo.wrappingColumn,
			wrappingIndent,
			wordBreak,
			wrapOnEscapedLineFeeds
		);

		callback(linesCollection);

		configuration.dispose();
	}
});


function pos(lineNumber: number, column: number): Position {
	return new Position(lineNumber, column);
}

function createSplitLine(splitLengths: number[], breakingOffsetsVisibleColumn: number[], wrappedTextIndentWidth: number, isVisible: boolean = true): IModelLineProjection {
	return createModelLineProjection(createLineBreakData(splitLengths, breakingOffsetsVisibleColumn, wrappedTextIndentWidth), isVisible);
}

function createLineBreakData(breakingLengths: number[], breakingOffsetsVisibleColumn: number[], wrappedTextIndentWidth: number): ModelLineProjectionData {
	const sums: number[] = [];
	for (let i = 0; i < breakingLengths.length; i++) {
		sums[i] = (i > 0 ? sums[i - 1] : 0) + breakingLengths[i];
	}
	return new ModelLineProjectionData(null, null, sums, breakingOffsetsVisibleColumn, wrappedTextIndentWidth);
}

function createModel(text: string): ISimpleModel {
	return {
		tokenization: {
			getLineTokens: (lineNumber: number) => {
				return null!;
			},
		},
		getLineContent: (lineNumber: number) => {
			return text;
		},
		getLineLength: (lineNumber: number) => {
			return text.length;
		},
		getLineMinColumn: (lineNumber: number) => {
			return 1;
		},
		getLineMaxColumn: (lineNumber: number) => {
			return text.length + 1;
		},
		getValueInRange: (range: IRange, eol?: EndOfLinePreference) => {
			return text.substring(range.startColumn - 1, range.endColumn - 1);
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/viewModel/testViewModel.ts]---
Location: vscode-main/src/vs/editor/test/browser/viewModel/testViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorOptions } from '../../../common/config/editorOptions.js';
import { TextModel } from '../../../common/model/textModel.js';
import { ViewModel } from '../../../common/viewModel/viewModelImpl.js';
import { TestConfiguration } from '../config/testConfiguration.js';
import { MonospaceLineBreaksComputerFactory } from '../../../common/viewModel/monospaceLineBreaksComputer.js';
import { createTextModel } from '../../common/testTextModel.js';
import { TestLanguageConfigurationService } from '../../common/modes/testLanguageConfigurationService.js';
import { TestThemeService } from '../../../../platform/theme/test/common/testThemeService.js';

export function testViewModel(text: string[], options: IEditorOptions, callback: (viewModel: ViewModel, model: TextModel) => void): void {
	const EDITOR_ID = 1;

	const configuration = new TestConfiguration(options);
	const model = createTextModel(text.join('\n'));
	const monospaceLineBreaksComputerFactory = MonospaceLineBreaksComputerFactory.create(configuration.options);
	const testLanguageConfigurationService = new TestLanguageConfigurationService();
	const viewModel = new ViewModel(EDITOR_ID, configuration, model, monospaceLineBreaksComputerFactory, monospaceLineBreaksComputerFactory, null!, testLanguageConfigurationService, new TestThemeService(), {
		setVisibleLines(visibleLines, stabilized) {
		},
	}, {
		batchChanges: (cb) => cb(),
	});

	callback(viewModel, model);

	viewModel.dispose();
	model.dispose();
	configuration.dispose();
	testLanguageConfigurationService.dispose();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/viewModel/viewModelDecorations.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/viewModel/viewModelDecorations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEditorOptions } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { testViewModel } from './testViewModel.js';
import { InlineDecoration, InlineDecorationType } from '../../../common/viewModel/inlineDecorations.js';

suite('ViewModelDecorations', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('getDecorationsViewportData', () => {
		const text = [
			'hello world, this is a buffer that will be wrapped'
		];
		const opts: IEditorOptions = {
			wordWrap: 'wordWrapColumn',
			wordWrapColumn: 13
		};
		testViewModel(text, opts, (viewModel, model) => {
			assert.strictEqual(viewModel.getLineContent(1), 'hello world, ');
			assert.strictEqual(viewModel.getLineContent(2), 'this is a ');
			assert.strictEqual(viewModel.getLineContent(3), 'buffer that ');
			assert.strictEqual(viewModel.getLineContent(4), 'will be ');
			assert.strictEqual(viewModel.getLineContent(5), 'wrapped');

			model.changeDecorations((accessor) => {
				const createOpts = (id: string) => {
					return {
						description: 'test',
						className: id,
						inlineClassName: 'i-' + id,
						beforeContentClassName: 'b-' + id,
						afterContentClassName: 'a-' + id
					};
				};

				// VIEWPORT will be (1,14) -> (1,36)

				// completely before viewport
				accessor.addDecoration(new Range(1, 2, 1, 3), createOpts('dec1'));
				// starts before viewport, ends at viewport start
				accessor.addDecoration(new Range(1, 2, 1, 14), createOpts('dec2'));
				// starts before viewport, ends inside viewport
				accessor.addDecoration(new Range(1, 2, 1, 15), createOpts('dec3'));
				// starts before viewport, ends at viewport end
				accessor.addDecoration(new Range(1, 2, 1, 36), createOpts('dec4'));
				// starts before viewport, ends after viewport
				accessor.addDecoration(new Range(1, 2, 1, 51), createOpts('dec5'));

				// starts at viewport start, ends at viewport start (will not be visible on view line 2)
				accessor.addDecoration(new Range(1, 14, 1, 14), createOpts('dec6'));
				// starts at viewport start, ends inside viewport
				accessor.addDecoration(new Range(1, 14, 1, 16), createOpts('dec7'));
				// starts at viewport start, ends at viewport end
				accessor.addDecoration(new Range(1, 14, 1, 36), createOpts('dec8'));
				// starts at viewport start, ends after viewport
				accessor.addDecoration(new Range(1, 14, 1, 51), createOpts('dec9'));

				// starts inside viewport, ends inside viewport
				accessor.addDecoration(new Range(1, 16, 1, 18), createOpts('dec10'));
				// starts inside viewport, ends at viewport end
				accessor.addDecoration(new Range(1, 16, 1, 36), createOpts('dec11'));
				// starts inside viewport, ends after viewport
				accessor.addDecoration(new Range(1, 16, 1, 51), createOpts('dec12'));

				// starts at viewport end, ends at viewport end
				accessor.addDecoration(new Range(1, 36, 1, 36), createOpts('dec13'));
				// starts at viewport end, ends after viewport
				accessor.addDecoration(new Range(1, 36, 1, 51), createOpts('dec14'));

				// starts after viewport, ends after viewport
				accessor.addDecoration(new Range(1, 40, 1, 51), createOpts('dec15'));
			});

			const actualDecorations = viewModel.getDecorationsInViewport(
				new Range(2, viewModel.getLineMinColumn(2), 3, viewModel.getLineMaxColumn(3))
			).map((dec) => {
				return dec.options.className;
			}).filter(Boolean);

			assert.deepStrictEqual(actualDecorations, [
				'dec1',
				'dec2',
				'dec3',
				'dec4',
				'dec5',
				'dec6',
				'dec7',
				'dec8',
				'dec9',
				'dec10',
				'dec11',
				'dec12',
				'dec13',
				'dec14',
			]);

			const inlineDecorations1 = viewModel.getViewportViewLineRenderingData(
				new Range(1, viewModel.getLineMinColumn(1), 2, viewModel.getLineMaxColumn(2)),
				1
			).inlineDecorations;

			// view line 1: (1,1 -> 1,14)
			assert.deepStrictEqual(inlineDecorations1, [
				new InlineDecoration(new Range(1, 2, 1, 3), 'i-dec1', InlineDecorationType.Regular),
				new InlineDecoration(new Range(1, 2, 1, 2), 'b-dec1', InlineDecorationType.Before),
				new InlineDecoration(new Range(1, 3, 1, 3), 'a-dec1', InlineDecorationType.After),
				new InlineDecoration(new Range(1, 2, 1, 14), 'i-dec2', InlineDecorationType.Regular),
				new InlineDecoration(new Range(1, 2, 1, 2), 'b-dec2', InlineDecorationType.Before),
				new InlineDecoration(new Range(1, 14, 1, 14), 'a-dec2', InlineDecorationType.After),
				new InlineDecoration(new Range(1, 2, 2, 2), 'i-dec3', InlineDecorationType.Regular),
				new InlineDecoration(new Range(1, 2, 1, 2), 'b-dec3', InlineDecorationType.Before),
				new InlineDecoration(new Range(1, 2, 3, 13), 'i-dec4', InlineDecorationType.Regular),
				new InlineDecoration(new Range(1, 2, 1, 2), 'b-dec4', InlineDecorationType.Before),
				new InlineDecoration(new Range(1, 2, 5, 8), 'i-dec5', InlineDecorationType.Regular),
				new InlineDecoration(new Range(1, 2, 1, 2), 'b-dec5', InlineDecorationType.Before),
			]);

			const inlineDecorations2 = viewModel.getViewportViewLineRenderingData(
				new Range(2, viewModel.getLineMinColumn(2), 3, viewModel.getLineMaxColumn(3)),
				2
			).inlineDecorations;

			// view line 2: (1,14 -> 1,24)
			assert.deepStrictEqual(inlineDecorations2, [
				new InlineDecoration(new Range(1, 2, 2, 2), 'i-dec3', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 2, 2, 2), 'a-dec3', InlineDecorationType.After),
				new InlineDecoration(new Range(1, 2, 3, 13), 'i-dec4', InlineDecorationType.Regular),
				new InlineDecoration(new Range(1, 2, 5, 8), 'i-dec5', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 1, 2, 1), 'i-dec6', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 1, 2, 1), 'b-dec6', InlineDecorationType.Before),
				new InlineDecoration(new Range(2, 1, 2, 1), 'a-dec6', InlineDecorationType.After),
				new InlineDecoration(new Range(2, 1, 2, 3), 'i-dec7', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 1, 2, 1), 'b-dec7', InlineDecorationType.Before),
				new InlineDecoration(new Range(2, 3, 2, 3), 'a-dec7', InlineDecorationType.After),
				new InlineDecoration(new Range(2, 1, 3, 13), 'i-dec8', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 1, 2, 1), 'b-dec8', InlineDecorationType.Before),
				new InlineDecoration(new Range(2, 1, 5, 8), 'i-dec9', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 1, 2, 1), 'b-dec9', InlineDecorationType.Before),
				new InlineDecoration(new Range(2, 3, 2, 5), 'i-dec10', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 3, 2, 3), 'b-dec10', InlineDecorationType.Before),
				new InlineDecoration(new Range(2, 5, 2, 5), 'a-dec10', InlineDecorationType.After),
				new InlineDecoration(new Range(2, 3, 3, 13), 'i-dec11', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 3, 2, 3), 'b-dec11', InlineDecorationType.Before),
				new InlineDecoration(new Range(2, 3, 5, 8), 'i-dec12', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 3, 2, 3), 'b-dec12', InlineDecorationType.Before),
			]);

			const inlineDecorations3 = viewModel.getViewportViewLineRenderingData(
				new Range(2, viewModel.getLineMinColumn(2), 3, viewModel.getLineMaxColumn(3)),
				3
			).inlineDecorations;

			// view line 3 (24 -> 36)
			assert.deepStrictEqual(inlineDecorations3, [
				new InlineDecoration(new Range(1, 2, 3, 13), 'i-dec4', InlineDecorationType.Regular),
				new InlineDecoration(new Range(3, 13, 3, 13), 'a-dec4', InlineDecorationType.After),
				new InlineDecoration(new Range(1, 2, 5, 8), 'i-dec5', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 1, 3, 13), 'i-dec8', InlineDecorationType.Regular),
				new InlineDecoration(new Range(3, 13, 3, 13), 'a-dec8', InlineDecorationType.After),
				new InlineDecoration(new Range(2, 1, 5, 8), 'i-dec9', InlineDecorationType.Regular),
				new InlineDecoration(new Range(2, 3, 3, 13), 'i-dec11', InlineDecorationType.Regular),
				new InlineDecoration(new Range(3, 13, 3, 13), 'a-dec11', InlineDecorationType.After),
				new InlineDecoration(new Range(2, 3, 5, 8), 'i-dec12', InlineDecorationType.Regular),
			]);
		});
	});

	test('issue #17208: Problem scrolling in 1.8.0', () => {
		const text = [
			'hello world, this is a buffer that will be wrapped'
		];
		const opts: IEditorOptions = {
			wordWrap: 'wordWrapColumn',
			wordWrapColumn: 13
		};
		testViewModel(text, opts, (viewModel, model) => {
			assert.strictEqual(viewModel.getLineContent(1), 'hello world, ');
			assert.strictEqual(viewModel.getLineContent(2), 'this is a ');
			assert.strictEqual(viewModel.getLineContent(3), 'buffer that ');
			assert.strictEqual(viewModel.getLineContent(4), 'will be ');
			assert.strictEqual(viewModel.getLineContent(5), 'wrapped');

			model.changeDecorations((accessor) => {
				accessor.addDecoration(
					new Range(1, 50, 1, 51),
					{
						description: 'test',
						beforeContentClassName: 'dec1'
					}
				);
			});

			const decorations = viewModel.getDecorationsInViewport(
				new Range(2, viewModel.getLineMinColumn(2), 3, viewModel.getLineMaxColumn(3))
			).filter(x => Boolean(x.options.beforeContentClassName));
			assert.deepStrictEqual(decorations, []);

			const inlineDecorations1 = viewModel.getViewportViewLineRenderingData(
				new Range(2, viewModel.getLineMinColumn(2), 3, viewModel.getLineMaxColumn(3)),
				2
			).inlineDecorations;
			assert.deepStrictEqual(inlineDecorations1, []);

			const inlineDecorations2 = viewModel.getViewportViewLineRenderingData(
				new Range(2, viewModel.getLineMinColumn(2), 3, viewModel.getLineMaxColumn(3)),
				3
			).inlineDecorations;
			assert.deepStrictEqual(inlineDecorations2, []);
		});
	});

	test('issue #37401: Allow both before and after decorations on empty line', () => {
		const text = [
			''
		];
		testViewModel(text, {}, (viewModel, model) => {

			model.changeDecorations((accessor) => {
				accessor.addDecoration(
					new Range(1, 1, 1, 1),
					{
						description: 'test',
						beforeContentClassName: 'before1',
						afterContentClassName: 'after1'
					}
				);
			});

			const inlineDecorations = viewModel.getViewportViewLineRenderingData(
				new Range(1, 1, 1, 1),
				1
			).inlineDecorations;
			assert.deepStrictEqual(inlineDecorations, [
				new InlineDecoration(new Range(1, 1, 1, 1), 'before1', InlineDecorationType.Before),
				new InlineDecoration(new Range(1, 1, 1, 1), 'after1', InlineDecorationType.After)
			]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/viewModel/viewModelImpl.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/viewModel/viewModelImpl.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { EndOfLineSequence, PositionAffinity } from '../../../common/model.js';
import { ViewEventHandler } from '../../../common/viewEventHandler.js';
import { ViewEvent } from '../../../common/viewEvents.js';
import { testViewModel } from './testViewModel.js';

suite('ViewModel', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #21073: SplitLinesCollection: attempt to access a \'newer\' model', () => {
		const text = [''];
		const opts = {
			lineNumbersMinChars: 1
		};
		testViewModel(text, opts, (viewModel, model) => {
			assert.strictEqual(viewModel.getLineCount(), 1);

			viewModel.setViewport(1, 1, 1);

			model.applyEdits([{
				range: new Range(1, 1, 1, 1),
				text: [
					'line01',
					'line02',
					'line03',
					'line04',
					'line05',
					'line06',
					'line07',
					'line08',
					'line09',
					'line10',
				].join('\n')
			}]);

			assert.strictEqual(viewModel.getLineCount(), 10);
		});
	});

	test('issue #44805: SplitLinesCollection: attempt to access a \'newer\' model', () => {
		const text = [''];
		testViewModel(text, {}, (viewModel, model) => {
			assert.strictEqual(viewModel.getLineCount(), 1);

			model.pushEditOperations([], [{
				range: new Range(1, 1, 1, 1),
				text: '\ninsert1'
			}], () => ([]));

			model.pushEditOperations([], [{
				range: new Range(1, 1, 1, 1),
				text: '\ninsert2'
			}], () => ([]));

			model.pushEditOperations([], [{
				range: new Range(1, 1, 1, 1),
				text: '\ninsert3'
			}], () => ([]));

			const viewLineCount: number[] = [];

			viewLineCount.push(viewModel.getLineCount());
			const eventHandler = new class extends ViewEventHandler {
				override handleEvents(events: ViewEvent[]): void {
					// Access the view model
					viewLineCount.push(viewModel.getLineCount());
				}
			};
			viewModel.addViewEventHandler(eventHandler);
			model.undo();
			viewLineCount.push(viewModel.getLineCount());

			assert.deepStrictEqual(viewLineCount, [4, 1, 1, 1, 1]);

			viewModel.removeViewEventHandler(eventHandler);
			eventHandler.dispose();
		});
	});

	test('issue #44805: No visible lines via API call', () => {
		const text = [
			'line1',
			'line2',
			'line3'
		];
		testViewModel(text, {}, (viewModel, model) => {
			assert.strictEqual(viewModel.getLineCount(), 3);
			viewModel.setHiddenAreas([new Range(1, 1, 3, 1)]);
			assert.ok(viewModel.getVisibleRanges() !== null);
		});
	});

	test('issue #44805: No visible lines via undoing', () => {
		const text = [
			''
		];
		testViewModel(text, {}, (viewModel, model) => {
			assert.strictEqual(viewModel.getLineCount(), 1);

			model.pushEditOperations([], [{
				range: new Range(1, 1, 1, 1),
				text: 'line1\nline2\nline3'
			}], () => ([]));

			viewModel.setHiddenAreas([new Range(1, 1, 1, 1)]);
			assert.strictEqual(viewModel.getLineCount(), 2);

			model.undo();
			assert.ok(viewModel.getVisibleRanges() !== null);
		});
	});

	function assertGetPlainTextToCopy(text: string[], ranges: Range[], emptySelectionClipboard: boolean, expected: string | string[]): void {
		testViewModel(text, {}, (viewModel, model) => {
			const actual = viewModel.getPlainTextToCopy(ranges, emptySelectionClipboard, false);
			assert.deepStrictEqual(actual, expected);
		});
	}

	const USUAL_TEXT = [
		'',
		'line2',
		'line3',
		'line4',
		''
	];

	test('getPlainTextToCopy 0/1', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 2)
			],
			false,
			''
		);
	});

	test('getPlainTextToCopy 0/1 - emptySelectionClipboard', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 2)
			],
			true,
			'line2\n'
		);
	});

	test('getPlainTextToCopy 1/1', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 6)
			],
			false,
			'ine2'
		);
	});

	test('getPlainTextToCopy 1/1 - emptySelectionClipboard', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 6)
			],
			true,
			'ine2'
		);
	});

	test('getPlainTextToCopy 0/2', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 2),
				new Range(3, 2, 3, 2),
			],
			false,
			''
		);
	});

	test('getPlainTextToCopy 0/2 - emptySelectionClipboard', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 2),
				new Range(3, 2, 3, 2),
			],
			true,
			[
				'line2\n',
				'line3\n'
			]
		);
	});

	test('issue #256039: getPlainTextToCopy with multiple cursors and empty selections should return array', () => {
		// Bug: When copying with multiple cursors (empty selections) with emptySelectionClipboard enabled,
		// the result should be an array so that pasting with "editor.multiCursorPaste": "full"
		// correctly distributes each line to the corresponding cursor.
		// Without the fix, this returns 'line2\nline3\n' (a single string).
		// With the fix, this returns ['line2\n', 'line3\n'] (an array).
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 1, 2, 1),
				new Range(3, 1, 3, 1),
			],
			true,
			['line2\n', 'line3\n']
		);
	});

	test('getPlainTextToCopy 1/2', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 6),
				new Range(3, 2, 3, 2),
			],
			false,
			'ine2'
		);
	});

	test('getPlainTextToCopy 1/2 - emptySelectionClipboard', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 6),
				new Range(3, 2, 3, 2),
			],
			true,
			['ine2', 'line3\n']
		);
	});

	test('getPlainTextToCopy 2/2', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 6),
				new Range(3, 2, 3, 6),
			],
			false,
			['ine2', 'ine3']
		);
	});

	test('getPlainTextToCopy 2/2 reversed', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(3, 2, 3, 6),
				new Range(2, 2, 2, 6),
			],
			false,
			['ine2', 'ine3']
		);
	});

	test('getPlainTextToCopy 0/3 - emptySelectionClipboard', () => {
		assertGetPlainTextToCopy(
			USUAL_TEXT,
			[
				new Range(2, 2, 2, 2),
				new Range(2, 3, 2, 3),
				new Range(3, 2, 3, 2),
			],
			true,
			[
				'line2\n',
				'line3\n'
			]
		);
	});

	test('issue #22688 - always use CRLF for clipboard on Windows', () => {
		testViewModel(USUAL_TEXT, {}, (viewModel, model) => {
			model.setEOL(EndOfLineSequence.LF);
			const actual = viewModel.getPlainTextToCopy([new Range(2, 1, 5, 1)], true, true);
			assert.deepStrictEqual(actual, 'line2\r\nline3\r\nline4\r\n');
		});
	});

	test('issue #40926: Incorrect spacing when inserting new line after multiple folded blocks of code', () => {
		testViewModel(
			[
				'foo = {',
				'    foobar: function() {',
				'        this.foobar();',
				'    },',
				'    foobar: function() {',
				'        this.foobar();',
				'    },',
				'    foobar: function() {',
				'        this.foobar();',
				'    },',
				'}',
			], {}, (viewModel, model) => {
				viewModel.setHiddenAreas([
					new Range(3, 1, 3, 1),
					new Range(6, 1, 6, 1),
					new Range(9, 1, 9, 1),
				]);

				model.applyEdits([
					{ range: new Range(4, 7, 4, 7), text: '\n    ' },
					{ range: new Range(7, 7, 7, 7), text: '\n    ' },
					{ range: new Range(10, 7, 10, 7), text: '\n    ' }
				]);

				assert.strictEqual(viewModel.getLineCount(), 11);
			}
		);
	});

	test('normalizePosition with multiple touching injected text', () => {
		testViewModel(
			[
				'just some text'
			],
			{},
			(viewModel, model) => {
				model.deltaDecorations([], [
					{
						range: new Range(1, 8, 1, 8),
						options: {
							description: 'test',
							before: {
								content: 'bar'
							},
							showIfCollapsed: true
						}
					},
					{
						range: new Range(1, 8, 1, 8),
						options: {
							description: 'test',
							before: {
								content: 'bz'
							},
							showIfCollapsed: true
						}
					},
				]);

				// just sobarbzme text

				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 8), PositionAffinity.None), new Position(1, 8));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 9), PositionAffinity.None), new Position(1, 8));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 11), PositionAffinity.None), new Position(1, 11));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 12), PositionAffinity.None), new Position(1, 11));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 13), PositionAffinity.None), new Position(1, 13));

				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 8), PositionAffinity.Left), new Position(1, 8));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 9), PositionAffinity.Left), new Position(1, 8));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 11), PositionAffinity.Left), new Position(1, 8));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 12), PositionAffinity.Left), new Position(1, 8));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 13), PositionAffinity.Left), new Position(1, 8));

				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 8), PositionAffinity.Right), new Position(1, 13));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 9), PositionAffinity.Right), new Position(1, 13));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 11), PositionAffinity.Right), new Position(1, 13));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 12), PositionAffinity.Right), new Position(1, 13));
				assert.deepStrictEqual(viewModel.normalizePosition(new Position(1, 13), PositionAffinity.Right), new Position(1, 13));
			}
		);
	});

	test('issue #193262: Incorrect implementation of modifyPosition', () => {
		testViewModel(
			[
				'just some text'
			],
			{
				wordWrap: 'wordWrapColumn',
				wordWrapColumn: 5
			},
			(viewModel, model) => {
				assert.deepStrictEqual(
					new Position(3, 1),
					viewModel.modifyPosition(new Position(3, 2), -1)
				);
			}
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/widget/codeEditorWidget.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/widget/codeEditorWidget.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { withTestCodeEditor } from '../testCodeEditor.js';

suite('CodeEditorWidget', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('onDidChangeModelDecorations', () => {
		withTestCodeEditor('', {}, (editor, viewModel) => {
			const disposables = new DisposableStore();

			let invoked = false;
			disposables.add(editor.onDidChangeModelDecorations((e) => {
				invoked = true;
			}));

			viewModel.model.deltaDecorations([], [{ range: new Range(1, 1, 1, 1), options: { description: 'test' } }]);

			assert.deepStrictEqual(invoked, true);

			disposables.dispose();
		});
	});

	test('onDidChangeModelLanguage', () => {
		withTestCodeEditor('', {}, (editor, viewModel, instantiationService) => {
			const languageService = instantiationService.get(ILanguageService);
			const disposables = new DisposableStore();
			disposables.add(languageService.registerLanguage({ id: 'testMode' }));

			let invoked = false;
			disposables.add(editor.onDidChangeModelLanguage((e) => {
				invoked = true;
			}));

			viewModel.model.setLanguage('testMode');

			assert.deepStrictEqual(invoked, true);

			disposables.dispose();
		});
	});

	test('onDidChangeModelLanguageConfiguration', () => {
		withTestCodeEditor('', {}, (editor, viewModel, instantiationService) => {
			const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
			const languageService = instantiationService.get(ILanguageService);
			const disposables = new DisposableStore();
			disposables.add(languageService.registerLanguage({ id: 'testMode' }));
			viewModel.model.setLanguage('testMode');

			let invoked = false;
			disposables.add(editor.onDidChangeModelLanguageConfiguration((e) => {
				invoked = true;
			}));

			disposables.add(languageConfigurationService.register('testMode', {
				brackets: [['(', ')']]
			}));

			assert.deepStrictEqual(invoked, true);

			disposables.dispose();
		});
	});

	test('onDidChangeModelContent', () => {
		withTestCodeEditor('', {}, (editor, viewModel) => {
			const disposables = new DisposableStore();

			let invoked = false;
			disposables.add(editor.onDidChangeModelContent((e) => {
				invoked = true;
			}));

			viewModel.type('hello', 'test');

			assert.deepStrictEqual(invoked, true);

			disposables.dispose();
		});
	});

	test('onDidChangeModelOptions', () => {
		withTestCodeEditor('', {}, (editor, viewModel) => {
			const disposables = new DisposableStore();

			let invoked = false;
			disposables.add(editor.onDidChangeModelOptions((e) => {
				invoked = true;
			}));

			viewModel.model.updateOptions({
				tabSize: 3
			});

			assert.deepStrictEqual(invoked, true);

			disposables.dispose();
		});
	});

	test('issue #145872 - Model change events are emitted before the selection updates', () => {
		withTestCodeEditor('', {}, (editor, viewModel) => {
			const disposables = new DisposableStore();

			let observedSelection: Selection | null = null;
			disposables.add(editor.onDidChangeModelContent((e) => {
				observedSelection = editor.getSelection();
			}));

			viewModel.type('hello', 'test');

			assert.deepStrictEqual(observedSelection, new Selection(1, 6, 1, 6));

			disposables.dispose();
		});
	});

	test('monaco-editor issue #2774 - Wrong order of events onDidChangeModelContent and onDidChangeCursorSelection on redo', () => {
		withTestCodeEditor('', {}, (editor, viewModel) => {
			const disposables = new DisposableStore();

			const calls: string[] = [];
			disposables.add(editor.onDidChangeModelContent((e) => {
				calls.push(`contentchange(${e.changes.reduce<any[]>((aggr, c) => [...aggr, c.text, c.rangeOffset, c.rangeLength], []).join(', ')})`);
			}));
			disposables.add(editor.onDidChangeCursorSelection((e) => {
				calls.push(`cursorchange(${e.selection.positionLineNumber}, ${e.selection.positionColumn})`);
			}));

			viewModel.type('a', 'test');
			viewModel.model.undo();
			viewModel.model.redo();

			assert.deepStrictEqual(calls, [
				'contentchange(a, 0, 0)',
				'cursorchange(1, 2)',
				'contentchange(, 0, 1)',
				'cursorchange(1, 1)',
				'contentchange(a, 0, 0)',
				'cursorchange(1, 2)'
			]);

			disposables.dispose();
		});
	});

	test('issue #146174: Events delivered out of order when adding decorations in content change listener (1 of 2)', () => {
		withTestCodeEditor('', {}, (editor, viewModel) => {
			const disposables = new DisposableStore();

			const calls: string[] = [];
			disposables.add(editor.onDidChangeModelContent((e) => {
				calls.push(`listener1 - contentchange(${e.changes.reduce<any[]>((aggr, c) => [...aggr, c.text, c.rangeOffset, c.rangeLength], []).join(', ')})`);
			}));
			disposables.add(editor.onDidChangeCursorSelection((e) => {
				calls.push(`listener1 - cursorchange(${e.selection.positionLineNumber}, ${e.selection.positionColumn})`);
			}));
			disposables.add(editor.onDidChangeModelContent((e) => {
				calls.push(`listener2 - contentchange(${e.changes.reduce<any[]>((aggr, c) => [...aggr, c.text, c.rangeOffset, c.rangeLength], []).join(', ')})`);
			}));
			disposables.add(editor.onDidChangeCursorSelection((e) => {
				calls.push(`listener2 - cursorchange(${e.selection.positionLineNumber}, ${e.selection.positionColumn})`);
			}));

			viewModel.type('a', 'test');

			assert.deepStrictEqual(calls, ([
				'listener1 - contentchange(a, 0, 0)',
				'listener2 - contentchange(a, 0, 0)',
				'listener1 - cursorchange(1, 2)',
				'listener2 - cursorchange(1, 2)',
			]));

			disposables.dispose();
		});
	});

	test('issue #146174: Events delivered out of order when adding decorations in content change listener (2 of 2)', () => {
		withTestCodeEditor('', {}, (editor, viewModel) => {
			const disposables = new DisposableStore();

			const calls: string[] = [];
			disposables.add(editor.onDidChangeModelContent((e) => {
				calls.push(`listener1 - contentchange(${e.changes.reduce<any[]>((aggr, c) => [...aggr, c.text, c.rangeOffset, c.rangeLength], []).join(', ')})`);
				editor.changeDecorations((changeAccessor) => {
					changeAccessor.deltaDecorations([], [{ range: new Range(1, 1, 1, 1), options: { description: 'test' } }]);
				});
			}));
			disposables.add(editor.onDidChangeCursorSelection((e) => {
				calls.push(`listener1 - cursorchange(${e.selection.positionLineNumber}, ${e.selection.positionColumn})`);
			}));
			disposables.add(editor.onDidChangeModelContent((e) => {
				calls.push(`listener2 - contentchange(${e.changes.reduce<any[]>((aggr, c) => [...aggr, c.text, c.rangeOffset, c.rangeLength], []).join(', ')})`);
			}));
			disposables.add(editor.onDidChangeCursorSelection((e) => {
				calls.push(`listener2 - cursorchange(${e.selection.positionLineNumber}, ${e.selection.positionColumn})`);
			}));

			viewModel.type('a', 'test');

			assert.deepStrictEqual(calls, ([
				'listener1 - contentchange(a, 0, 0)',
				'listener2 - contentchange(a, 0, 0)',
				'listener1 - cursorchange(1, 2)',
				'listener2 - cursorchange(1, 2)',
			]));

			disposables.dispose();
		});
	});

	test('getBottomForLineNumber should handle invalid line numbers gracefully', () => {
		withTestCodeEditor('line1\nline2\nline3', {}, (editor, viewModel) => {
			// Test with lineNumber greater than line count
			const result1 = editor.getBottomForLineNumber(100);
			assert.ok(result1 >= 0, 'Should return a valid position for out-of-bounds line number');

			// Test with lineNumber less than 1
			const result2 = editor.getBottomForLineNumber(0);
			assert.ok(result2 >= 0, 'Should return a valid position for line number 0');

			// Test with negative lineNumber
			const result3 = editor.getBottomForLineNumber(-5);
			assert.ok(result3 >= 0, 'Should return a valid position for negative line number');

			// Test with valid lineNumber should still work
			const result4 = editor.getBottomForLineNumber(2);
			assert.ok(result4 > 0, 'Should return a valid position for valid line number');
		});
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/widget/diffEditorWidget.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/widget/diffEditorWidget.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { UnchangedRegion } from '../../../browser/widget/diffEditor/diffEditorViewModel.js';
import { LineRange } from '../../../common/core/ranges/lineRange.js';
import { DetailedLineRangeMapping } from '../../../common/diff/rangeMapping.js';

suite('DiffEditorWidget2', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	suite('UnchangedRegion', () => {
		function serialize(regions: UnchangedRegion[]): unknown {
			return regions.map(r => `${r.originalUnchangedRange} - ${r.modifiedUnchangedRange}`);
		}

		test('Everything changed', () => {
			assert.deepStrictEqual(serialize(UnchangedRegion.fromDiffs(
				[new DetailedLineRangeMapping(new LineRange(1, 10), new LineRange(1, 10), [])],
				10,
				10,
				3,
				3,
			)), []);
		});

		test('Nothing changed', () => {
			assert.deepStrictEqual(serialize(UnchangedRegion.fromDiffs(
				[],
				10,
				10,
				3,
				3,
			)), [
				'[1,11) - [1,11)'
			]);
		});

		test('Change in the middle', () => {
			assert.deepStrictEqual(serialize(UnchangedRegion.fromDiffs(
				[new DetailedLineRangeMapping(new LineRange(50, 60), new LineRange(50, 60), [])],
				100,
				100,
				3,
				3,
			)), ([
				'[1,47) - [1,47)',
				'[63,101) - [63,101)'
			]));
		});

		test('Change at the end', () => {
			assert.deepStrictEqual(serialize(UnchangedRegion.fromDiffs(
				[new DetailedLineRangeMapping(new LineRange(99, 100), new LineRange(100, 100), [])],
				100,
				100,
				3,
				3,
			)), (['[1,96) - [1,96)']));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/widget/observableCodeEditor.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/widget/observableCodeEditor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IObservable, derivedHandleChanges } from '../../../../base/common/observable.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { ObservableCodeEditor, observableCodeEditor } from '../../../browser/observableCodeEditor.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { ViewModel } from '../../../common/viewModel/viewModelImpl.js';
import { withTestCodeEditor } from '../testCodeEditor.js';

suite('CodeEditorWidget', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function withTestFixture(
		cb: (args: { editor: ICodeEditor; viewModel: ViewModel; log: Log; derived: IObservable<string> }) => void
	) {
		withEditorSetupTestFixture(undefined, cb);
	}

	function withEditorSetupTestFixture(
		preSetupCallback:
			| ((editor: ICodeEditor, disposables: DisposableStore) => void)
			| undefined,
		cb: (args: { editor: ICodeEditor; viewModel: ViewModel; log: Log; derived: IObservable<string> }) => void
	) {
		withTestCodeEditor('hello world', {}, (editor, viewModel) => {
			const disposables = new DisposableStore();
			preSetupCallback?.(editor, disposables);
			const obsEditor = observableCodeEditor(editor);
			const log = new Log();

			const derived = derivedHandleChanges(
				{
					changeTracker: {
						createChangeSummary: () => undefined,
						handleChange: (context) => {
							const obsName = observableName(context.changedObservable, obsEditor);

							log.log(`handle change: ${obsName} ${formatChange(context.change)}`);
							return true;
						},
					},
				},
				(reader) => {
					const versionId = obsEditor.versionId.read(reader);
					const selection = obsEditor.selections.read(reader)?.map((s) => s.toString()).join(', ');
					obsEditor.onDidType.read(reader);

					const str = `running derived: selection: ${selection}, value: ${versionId}`;
					log.log(str);
					return str;
				}
			);

			derived.recomputeInitiallyAndOnChange(disposables);
			assert.deepStrictEqual(log.getAndClearEntries(), [
				'running derived: selection: [1,1 -> 1,1], value: 1',
			]);

			cb({ editor, viewModel, log, derived });

			disposables.dispose();
		});
	}

	test('setPosition', () =>
		withTestFixture(({ editor, log }) => {
			editor.setPosition(new Position(1, 2));

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'handle change: editor.selections {"selection":"[1,2 -> 1,2]","modelVersionId":1,"oldSelections":["[1,1 -> 1,1]"],"oldModelVersionId":1,"source":"api","reason":0}',
				'running derived: selection: [1,2 -> 1,2], value: 1'
			]));
		}));

	test('keyboard.type', () =>
		withTestFixture(({ editor, log }) => {
			editor.trigger('keyboard', 'type', { text: 'abc' });

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'handle change: editor.onDidType "abc"',
				'handle change: editor.versionId {"changes":[{"range":"[1,1 -> 1,1]","rangeLength":0,"text":"a","rangeOffset":0}],"eol":"\\n","versionId":2,"detailedReasons":[{"metadata":{"source":"cursor","kind":"type","detailedSource":"keyboard"}}],"detailedReasonsChangeLengths":[1]}',
				'handle change: editor.versionId {"changes":[{"range":"[1,2 -> 1,2]","rangeLength":0,"text":"b","rangeOffset":1}],"eol":"\\n","versionId":3,"detailedReasons":[{"metadata":{"source":"cursor","kind":"type","detailedSource":"keyboard"}}],"detailedReasonsChangeLengths":[1]}',
				'handle change: editor.versionId {"changes":[{"range":"[1,3 -> 1,3]","rangeLength":0,"text":"c","rangeOffset":2}],"eol":"\\n","versionId":4,"detailedReasons":[{"metadata":{"source":"cursor","kind":"type","detailedSource":"keyboard"}}],"detailedReasonsChangeLengths":[1]}',
				'handle change: editor.selections {"selection":"[1,4 -> 1,4]","modelVersionId":4,"oldSelections":["[1,1 -> 1,1]"],"oldModelVersionId":1,"source":"keyboard","reason":0}',
				'running derived: selection: [1,4 -> 1,4], value: 4'
			]));
		}));

	test('keyboard.type and set position', () =>
		withTestFixture(({ editor, log }) => {
			editor.trigger('keyboard', 'type', { text: 'abc' });

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'handle change: editor.onDidType "abc"',
				'handle change: editor.versionId {"changes":[{"range":"[1,1 -> 1,1]","rangeLength":0,"text":"a","rangeOffset":0}],"eol":"\\n","versionId":2,"detailedReasons":[{"metadata":{"source":"cursor","kind":"type","detailedSource":"keyboard"}}],"detailedReasonsChangeLengths":[1]}',
				'handle change: editor.versionId {"changes":[{"range":"[1,2 -> 1,2]","rangeLength":0,"text":"b","rangeOffset":1}],"eol":"\\n","versionId":3,"detailedReasons":[{"metadata":{"source":"cursor","kind":"type","detailedSource":"keyboard"}}],"detailedReasonsChangeLengths":[1]}',
				'handle change: editor.versionId {"changes":[{"range":"[1,3 -> 1,3]","rangeLength":0,"text":"c","rangeOffset":2}],"eol":"\\n","versionId":4,"detailedReasons":[{"metadata":{"source":"cursor","kind":"type","detailedSource":"keyboard"}}],"detailedReasonsChangeLengths":[1]}',
				'handle change: editor.selections {"selection":"[1,4 -> 1,4]","modelVersionId":4,"oldSelections":["[1,1 -> 1,1]"],"oldModelVersionId":1,"source":"keyboard","reason":0}',
				'running derived: selection: [1,4 -> 1,4], value: 4'
			]));

			editor.setPosition(new Position(1, 5), 'test');

			assert.deepStrictEqual(log.getAndClearEntries(), ([
				'handle change: editor.selections {"selection":"[1,5 -> 1,5]","modelVersionId":4,"oldSelections":["[1,4 -> 1,4]"],"oldModelVersionId":4,"source":"test","reason":0}',
				'running derived: selection: [1,5 -> 1,5], value: 4'
			]));
		}));

	test('listener interaction (unforced)', () => {
		let derived: IObservable<string>;
		let log: Log;
		withEditorSetupTestFixture(
			(editor, disposables) => {
				disposables.add(
					editor.onDidChangeModelContent(() => {
						log.log('>>> before get');
						derived.get();
						log.log('<<< after get');
					})
				);
			},
			(args) => {
				const editor = args.editor;
				derived = args.derived;
				log = args.log;

				editor.trigger('keyboard', 'type', { text: 'a' });
				assert.deepStrictEqual(log.getAndClearEntries(), ([
					'>>> before get',
					'<<< after get',
					'handle change: editor.onDidType "a"',
					'handle change: editor.versionId {"changes":[{"range":"[1,1 -> 1,1]","rangeLength":0,"text":"a","rangeOffset":0}],"eol":"\\n","versionId":2,"detailedReasons":[{"metadata":{"source":"cursor","kind":"type","detailedSource":"keyboard"}}],"detailedReasonsChangeLengths":[1]}',
					'handle change: editor.selections {"selection":"[1,2 -> 1,2]","modelVersionId":2,"oldSelections":["[1,1 -> 1,1]"],"oldModelVersionId":1,"source":"keyboard","reason":0}',
					'running derived: selection: [1,2 -> 1,2], value: 2'
				]));
			}
		);
	});

	test('listener interaction ()', () => {
		let derived: IObservable<string>;
		let log: Log;
		withEditorSetupTestFixture(
			(editor, disposables) => {
				disposables.add(
					editor.onDidChangeModelContent(() => {
						log.log('>>> before forceUpdate');
						observableCodeEditor(editor).forceUpdate();

						log.log('>>> before get');
						derived.get();
						log.log('<<< after get');
					})
				);
			},
			(args) => {
				const editor = args.editor;
				derived = args.derived;
				log = args.log;

				editor.trigger('keyboard', 'type', { text: 'a' });

				assert.deepStrictEqual(log.getAndClearEntries(), ([
					'>>> before forceUpdate',
					'>>> before get',
					'handle change: editor.versionId undefined',
					'running derived: selection: [1,2 -> 1,2], value: 2',
					'<<< after get',
					'handle change: editor.onDidType "a"',
					'handle change: editor.versionId {"changes":[{"range":"[1,1 -> 1,1]","rangeLength":0,"text":"a","rangeOffset":0}],"eol":"\\n","versionId":2,"detailedReasons":[{"metadata":{"source":"cursor","kind":"type","detailedSource":"keyboard"}}],"detailedReasonsChangeLengths":[1]}',
					'handle change: editor.selections {"selection":"[1,2 -> 1,2]","modelVersionId":2,"oldSelections":["[1,1 -> 1,1]"],"oldModelVersionId":1,"source":"keyboard","reason":0}',
					'running derived: selection: [1,2 -> 1,2], value: 2'
				]));
			}
		);
	});
});

class Log {
	private readonly entries: string[] = [];
	public log(message: string): void {
		this.entries.push(message);
	}

	public getAndClearEntries(): string[] {
		const entries = [...this.entries];
		this.entries.length = 0;
		return entries;
	}
}

function formatChange(change: unknown) {
	return JSON.stringify(
		change,
		(key, value) => {
			if (value instanceof Range) {
				return value.toString();
			}
			if (
				value === false ||
				(Array.isArray(value) && value.length === 0)
			) {
				return undefined;
			}
			return value;
		}
	);
}

function observableName(obs: IObservable<any>, obsEditor: ObservableCodeEditor): string {
	switch (obs) {
		case obsEditor.selections:
			return 'editor.selections';
		case obsEditor.versionId:
			return 'editor.versionId';
		case obsEditor.onDidType:
			return 'editor.onDidType';
		default:
			return 'unknown';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modesTestUtils.ts]---
Location: vscode-main/src/vs/editor/test/common/modesTestUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LineTokens } from '../../common/tokens/lineTokens.js';
import { StandardTokenType, MetadataConsts } from '../../common/encodedTokenAttributes.js';
import { ScopedLineTokens, createScopedLineTokens } from '../../common/languages/supports.js';
import { LanguageIdCodec } from '../../common/services/languagesRegistry.js';

export interface TokenText {
	text: string;
	type: StandardTokenType;
}

export function createFakeScopedLineTokens(rawTokens: TokenText[]): ScopedLineTokens {
	const tokens = new Uint32Array(rawTokens.length << 1);
	let line = '';

	for (let i = 0, len = rawTokens.length; i < len; i++) {
		const rawToken = rawTokens[i];

		const startOffset = line.length;
		const metadata = (
			(rawToken.type << MetadataConsts.TOKEN_TYPE_OFFSET)
		) >>> 0;

		tokens[(i << 1)] = startOffset;
		tokens[(i << 1) + 1] = metadata;
		line += rawToken.text;
	}

	LineTokens.convertToEndOffset(tokens, line.length);
	return createScopedLineTokens(new LineTokens(tokens, line, new LanguageIdCodec()), 0);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/testTextModel.ts]---
Location: vscode-main/src/vs/editor/test/common/testTextModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { BracketPairColorizationOptions, DefaultEndOfLine, ITextBufferFactory, ITextModelCreationOptions } from '../../common/model.js';
import { TextModel } from '../../common/model/textModel.js';
import { ILanguageConfigurationService } from '../../common/languages/languageConfigurationRegistry.js';
import { ILanguageService } from '../../common/languages/language.js';
import { LanguageService } from '../../common/services/languageService.js';
import { ITextResourcePropertiesService } from '../../common/services/textResourceConfiguration.js';
import { TestLanguageConfigurationService } from './modes/testLanguageConfigurationService.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../platform/configuration/test/common/testConfigurationService.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { TestDialogService } from '../../../platform/dialogs/test/common/testDialogService.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService, NullLogService } from '../../../platform/log/common/log.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { TestNotificationService } from '../../../platform/notification/test/common/testNotificationService.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../platform/theme/test/common/testThemeService.js';
import { IUndoRedoService } from '../../../platform/undoRedo/common/undoRedo.js';
import { UndoRedoService } from '../../../platform/undoRedo/common/undoRedoService.js';
import { TestTextResourcePropertiesService } from './services/testTextResourcePropertiesService.js';
import { IModelService } from '../../common/services/model.js';
import { ModelService } from '../../common/services/modelService.js';
import { createServices, ServiceIdCtorPair, TestInstantiationService } from '../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../common/languages/modesRegistry.js';
import { ILanguageFeatureDebounceService, LanguageFeatureDebounceService } from '../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../common/services/languageFeaturesService.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { mock } from '../../../base/test/common/mock.js';
import { ITreeSitterLibraryService } from '../../common/services/treeSitter/treeSitterLibraryService.js';
import { TestTreeSitterLibraryService } from './services/testTreeSitterLibraryService.js';

class TestTextModel extends TextModel {
	public registerDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}

export function withEditorModel(text: string[], callback: (model: TextModel) => void): void {
	const model = createTextModel(text.join('\n'));
	callback(model);
	model.dispose();
}

export interface IRelaxedTextModelCreationOptions {
	tabSize?: number;
	indentSize?: number | 'tabSize';
	insertSpaces?: boolean;
	detectIndentation?: boolean;
	trimAutoWhitespace?: boolean;
	defaultEOL?: DefaultEndOfLine;
	isForSimpleWidget?: boolean;
	largeFileOptimizations?: boolean;
	bracketColorizationOptions?: BracketPairColorizationOptions;
}

function resolveOptions(_options: IRelaxedTextModelCreationOptions): ITextModelCreationOptions {
	const defaultOptions = TextModel.DEFAULT_CREATION_OPTIONS;
	return {
		tabSize: (typeof _options.tabSize === 'undefined' ? defaultOptions.tabSize : _options.tabSize),
		indentSize: (typeof _options.indentSize === 'undefined' ? defaultOptions.indentSize : _options.indentSize),
		insertSpaces: (typeof _options.insertSpaces === 'undefined' ? defaultOptions.insertSpaces : _options.insertSpaces),
		detectIndentation: (typeof _options.detectIndentation === 'undefined' ? defaultOptions.detectIndentation : _options.detectIndentation),
		trimAutoWhitespace: (typeof _options.trimAutoWhitespace === 'undefined' ? defaultOptions.trimAutoWhitespace : _options.trimAutoWhitespace),
		defaultEOL: (typeof _options.defaultEOL === 'undefined' ? defaultOptions.defaultEOL : _options.defaultEOL),
		isForSimpleWidget: (typeof _options.isForSimpleWidget === 'undefined' ? defaultOptions.isForSimpleWidget : _options.isForSimpleWidget),
		largeFileOptimizations: (typeof _options.largeFileOptimizations === 'undefined' ? defaultOptions.largeFileOptimizations : _options.largeFileOptimizations),
		bracketPairColorizationOptions: (typeof _options.bracketColorizationOptions === 'undefined' ? defaultOptions.bracketPairColorizationOptions : _options.bracketColorizationOptions),
	};
}

export function createTextModel(text: string | ITextBufferFactory, languageId: string | null = null, options: IRelaxedTextModelCreationOptions = TextModel.DEFAULT_CREATION_OPTIONS, uri: URI | null = null): TextModel {
	const disposables = new DisposableStore();
	const instantiationService = createModelServices(disposables);
	const model = instantiateTextModel(instantiationService, text, languageId, options, uri);
	model.registerDisposable(disposables);
	return model;
}

export function instantiateTextModel(instantiationService: IInstantiationService, text: string | ITextBufferFactory, languageId: string | null = null, _options: IRelaxedTextModelCreationOptions = TextModel.DEFAULT_CREATION_OPTIONS, uri: URI | null = null): TestTextModel {
	const options = resolveOptions(_options);
	return instantiationService.createInstance(TestTextModel, text, languageId || PLAINTEXT_LANGUAGE_ID, options, uri);
}

export function createModelServices(disposables: DisposableStore, services: ServiceIdCtorPair<any>[] = []): TestInstantiationService {
	return createServices(disposables, services.concat([
		[INotificationService, TestNotificationService],
		[IDialogService, TestDialogService],
		[IUndoRedoService, UndoRedoService],
		[ILanguageService, LanguageService],
		[ILanguageConfigurationService, TestLanguageConfigurationService],
		[IConfigurationService, TestConfigurationService],
		[ITextResourcePropertiesService, TestTextResourcePropertiesService],
		[IThemeService, TestThemeService],
		[ILogService, NullLogService],
		[IEnvironmentService, new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		}],
		[ILanguageFeatureDebounceService, LanguageFeatureDebounceService],
		[ILanguageFeaturesService, LanguageFeaturesService],
		[IModelService, ModelService],
		[IModelService, ModelService],
		[ITreeSitterLibraryService, TestTreeSitterLibraryService],
	]));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/controller/cursorAtomicMoveOperations.test.ts]---
Location: vscode-main/src/vs/editor/test/common/controller/cursorAtomicMoveOperations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { AtomicTabMoveOperations, Direction } from '../../../common/cursor/cursorAtomicMoveOperations.js';

suite('Cursor move command test', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Test whitespaceVisibleColumn', () => {
		const testCases = [
			{
				lineContent: '        ',
				tabSize: 4,
				expectedPrevTabStopPosition: [-1, 0, 0, 0, 0, 4, 4, 4, 4, -1],
				expectedPrevTabStopVisibleColumn: [-1, 0, 0, 0, 0, 4, 4, 4, 4, -1],
				expectedVisibleColumn: [0, 1, 2, 3, 4, 5, 6, 7, 8, -1],
			},
			{
				lineContent: '  ',
				tabSize: 4,
				expectedPrevTabStopPosition: [-1, 0, 0, -1],
				expectedPrevTabStopVisibleColumn: [-1, 0, 0, -1],
				expectedVisibleColumn: [0, 1, 2, -1],
			},
			{
				lineContent: '\t',
				tabSize: 4,
				expectedPrevTabStopPosition: [-1, 0, -1],
				expectedPrevTabStopVisibleColumn: [-1, 0, -1],
				expectedVisibleColumn: [0, 4, -1],
			},
			{
				lineContent: '\t ',
				tabSize: 4,
				expectedPrevTabStopPosition: [-1, 0, 1, -1],
				expectedPrevTabStopVisibleColumn: [-1, 0, 4, -1],
				expectedVisibleColumn: [0, 4, 5, -1],
			},
			{
				lineContent: ' \t\t ',
				tabSize: 4,
				expectedPrevTabStopPosition: [-1, 0, 0, 2, 3, -1],
				expectedPrevTabStopVisibleColumn: [-1, 0, 0, 4, 8, -1],
				expectedVisibleColumn: [0, 1, 4, 8, 9, -1],
			},
			{
				lineContent: ' \tA',
				tabSize: 4,
				expectedPrevTabStopPosition: [-1, 0, 0, -1, -1],
				expectedPrevTabStopVisibleColumn: [-1, 0, 0, -1, -1],
				expectedVisibleColumn: [0, 1, 4, -1, -1],
			},
			{
				lineContent: 'A',
				tabSize: 4,
				expectedPrevTabStopPosition: [-1, -1, -1],
				expectedPrevTabStopVisibleColumn: [-1, -1, -1],
				expectedVisibleColumn: [0, -1, -1],
			},
			{
				lineContent: '',
				tabSize: 4,
				expectedPrevTabStopPosition: [-1, -1],
				expectedPrevTabStopVisibleColumn: [-1, -1],
				expectedVisibleColumn: [0, -1],
			},
		];

		for (const testCase of testCases) {
			const maxPosition = testCase.expectedVisibleColumn.length;
			for (let position = 0; position < maxPosition; position++) {
				const actual = AtomicTabMoveOperations.whitespaceVisibleColumn(testCase.lineContent, position, testCase.tabSize);
				const expected = [
					testCase.expectedPrevTabStopPosition[position],
					testCase.expectedPrevTabStopVisibleColumn[position],
					testCase.expectedVisibleColumn[position]
				];
				assert.deepStrictEqual(actual, expected);
			}
		}
	});

	test('Test atomicPosition', () => {
		const testCases = [
			{
				lineContent: '        ',
				tabSize: 4,
				expectedLeft: [-1, 0, 0, 0, 0, 4, 4, 4, 4, -1],
				expectedRight: [4, 4, 4, 4, 8, 8, 8, 8, -1, -1],
				expectedNearest: [0, 0, 0, 4, 4, 4, 4, 8, 8, -1],
			},
			{
				lineContent: ' \t',
				tabSize: 4,
				expectedLeft: [-1, 0, 0, -1],
				expectedRight: [2, 2, -1, -1],
				expectedNearest: [0, 0, 2, -1],
			},
			{
				lineContent: '\t ',
				tabSize: 4,
				expectedLeft: [-1, 0, -1, -1],
				expectedRight: [1, -1, -1, -1],
				expectedNearest: [0, 1, -1, -1],
			},
			{
				lineContent: ' \t ',
				tabSize: 4,
				expectedLeft: [-1, 0, 0, -1, -1],
				expectedRight: [2, 2, -1, -1, -1],
				expectedNearest: [0, 0, 2, -1, -1],
			},
			{
				lineContent: '        A',
				tabSize: 4,
				expectedLeft: [-1, 0, 0, 0, 0, 4, 4, 4, 4, -1, -1],
				expectedRight: [4, 4, 4, 4, 8, 8, 8, 8, -1, -1, -1],
				expectedNearest: [0, 0, 0, 4, 4, 4, 4, 8, 8, -1, -1],
			},
			{
				lineContent: '      foo',
				tabSize: 4,
				expectedLeft: [-1, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1],
				expectedRight: [4, 4, 4, 4, -1, -1, -1, -1, -1, -1, -1],
				expectedNearest: [0, 0, 0, 4, 4, -1, -1, -1, -1, -1, -1],
			},
		];

		for (const testCase of testCases) {
			for (const { direction, expected } of [
				{
					direction: Direction.Left,
					expected: testCase.expectedLeft,
				},
				{
					direction: Direction.Right,
					expected: testCase.expectedRight,
				},
				{
					direction: Direction.Nearest,
					expected: testCase.expectedNearest,
				},
			]) {

				const actual = expected.map((_, i) => AtomicTabMoveOperations.atomicPosition(testCase.lineContent, i, testCase.tabSize, direction));
				assert.deepStrictEqual(actual, expected);
			}
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/characterClassifier.test.ts]---
Location: vscode-main/src/vs/editor/test/common/core/characterClassifier.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { CharCode } from '../../../../base/common/charCode.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { CharacterClassifier } from '../../../common/core/characterClassifier.js';

suite('CharacterClassifier', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('works', () => {
		const classifier = new CharacterClassifier<number>(0);

		assert.strictEqual(classifier.get(-1), 0);
		assert.strictEqual(classifier.get(0), 0);
		assert.strictEqual(classifier.get(CharCode.a), 0);
		assert.strictEqual(classifier.get(CharCode.b), 0);
		assert.strictEqual(classifier.get(CharCode.z), 0);
		assert.strictEqual(classifier.get(255), 0);
		assert.strictEqual(classifier.get(1000), 0);
		assert.strictEqual(classifier.get(2000), 0);

		classifier.set(CharCode.a, 1);
		classifier.set(CharCode.z, 2);
		classifier.set(1000, 3);

		assert.strictEqual(classifier.get(-1), 0);
		assert.strictEqual(classifier.get(0), 0);
		assert.strictEqual(classifier.get(CharCode.a), 1);
		assert.strictEqual(classifier.get(CharCode.b), 0);
		assert.strictEqual(classifier.get(CharCode.z), 2);
		assert.strictEqual(classifier.get(255), 0);
		assert.strictEqual(classifier.get(1000), 3);
		assert.strictEqual(classifier.get(2000), 0);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/cursorColumns.test.ts]---
Location: vscode-main/src/vs/editor/test/common/core/cursorColumns.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { CursorColumns } from '../../../common/core/cursorColumns.js';

suite('CursorColumns', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('visibleColumnFromColumn', () => {

		function testVisibleColumnFromColumn(text: string, tabSize: number, column: number, expected: number): void {
			assert.strictEqual(CursorColumns.visibleColumnFromColumn(text, column, tabSize), expected);
		}

		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 1, 0);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 2, 4);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 3, 8);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 4, 9);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 5, 10);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 6, 11);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 7, 12);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 8, 13);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 9, 14);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 10, 15);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 11, 16);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 12, 17);
		testVisibleColumnFromColumn('\t\tvar x = 3;', 4, 13, 18);

		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 1, 0);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 2, 4);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 3, 5);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 4, 8);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 5, 9);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 6, 10);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 7, 11);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 8, 12);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 9, 13);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 10, 14);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 11, 15);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 12, 16);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 13, 17);
		testVisibleColumnFromColumn('\t \tvar x = 3;', 4, 14, 18);

		testVisibleColumnFromColumn('\t  \tx\t', 4, -1, 0);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 0, 0);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 1, 0);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 2, 4);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 3, 5);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 4, 6);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 5, 8);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 6, 9);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 7, 12);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 8, 12);
		testVisibleColumnFromColumn('\t  \tx\t', 4, 9, 12);

		testVisibleColumnFromColumn('baz', 4, 1, 0);
		testVisibleColumnFromColumn('baz', 4, 2, 1);
		testVisibleColumnFromColumn('baz', 4, 3, 2);
		testVisibleColumnFromColumn('baz', 4, 4, 3);

		testVisibleColumnFromColumn('📚az', 4, 1, 0);
		testVisibleColumnFromColumn('📚az', 4, 2, 1);
		testVisibleColumnFromColumn('📚az', 4, 3, 2);
		testVisibleColumnFromColumn('📚az', 4, 4, 3);
		testVisibleColumnFromColumn('📚az', 4, 5, 4);
	});

	test('toStatusbarColumn', () => {

		function t(text: string, tabSize: number, column: number, expected: number): void {
			assert.strictEqual(CursorColumns.toStatusbarColumn(text, column, tabSize), expected, `<<t('${text}', ${tabSize}, ${column}, ${expected})>>`);
		}

		t('    spaces', 4, 1, 1);
		t('    spaces', 4, 2, 2);
		t('    spaces', 4, 3, 3);
		t('    spaces', 4, 4, 4);
		t('    spaces', 4, 5, 5);
		t('    spaces', 4, 6, 6);
		t('    spaces', 4, 7, 7);
		t('    spaces', 4, 8, 8);
		t('    spaces', 4, 9, 9);
		t('    spaces', 4, 10, 10);
		t('    spaces', 4, 11, 11);

		t('\ttab', 4, 1, 1);
		t('\ttab', 4, 2, 5);
		t('\ttab', 4, 3, 6);
		t('\ttab', 4, 4, 7);
		t('\ttab', 4, 5, 8);

		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 1, 1);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 2, 2);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 3, 2);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 4, 3);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 5, 3);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 6, 4);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 7, 4);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 8, 5);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 9, 5);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 10, 6);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 11, 6);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 12, 7);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 13, 7);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 14, 8);
		t('𐌀𐌁𐌂𐌃𐌄𐌅𐌆', 4, 15, 8);

		t('🎈🎈🎈🎈', 4, 1, 1);
		t('🎈🎈🎈🎈', 4, 2, 2);
		t('🎈🎈🎈🎈', 4, 3, 2);
		t('🎈🎈🎈🎈', 4, 4, 3);
		t('🎈🎈🎈🎈', 4, 5, 3);
		t('🎈🎈🎈🎈', 4, 6, 4);
		t('🎈🎈🎈🎈', 4, 7, 4);
		t('🎈🎈🎈🎈', 4, 8, 5);
		t('🎈🎈🎈🎈', 4, 9, 5);

		t('何何何何', 4, 1, 1);
		t('何何何何', 4, 2, 2);
		t('何何何何', 4, 3, 3);
		t('何何何何', 4, 4, 4);
	});

	test('columnFromVisibleColumn', () => {

		function testColumnFromVisibleColumn(text: string, tabSize: number, visibleColumn: number, expected: number): void {
			assert.strictEqual(CursorColumns.columnFromVisibleColumn(text, visibleColumn, tabSize), expected);
		}

		// testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 0, 1);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 1, 1);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 2, 1);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 3, 2);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 4, 2);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 5, 2);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 6, 2);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 7, 3);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 8, 3);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 9, 4);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 10, 5);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 11, 6);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 12, 7);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 13, 8);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 14, 9);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 15, 10);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 16, 11);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 17, 12);
		testColumnFromVisibleColumn('\t\tvar x = 3;', 4, 18, 13);

		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 0, 1);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 1, 1);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 2, 1);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 3, 2);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 4, 2);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 5, 3);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 6, 3);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 7, 4);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 8, 4);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 9, 5);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 10, 6);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 11, 7);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 12, 8);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 13, 9);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 14, 10);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 15, 11);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 16, 12);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 17, 13);
		testColumnFromVisibleColumn('\t \tvar x = 3;', 4, 18, 14);

		testColumnFromVisibleColumn('\t  \tx\t', 4, -2, 1);
		testColumnFromVisibleColumn('\t  \tx\t', 4, -1, 1);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 0, 1);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 1, 1);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 2, 1);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 3, 2);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 4, 2);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 5, 3);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 6, 4);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 7, 4);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 8, 5);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 9, 6);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 10, 6);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 11, 7);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 12, 7);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 13, 7);
		testColumnFromVisibleColumn('\t  \tx\t', 4, 14, 7);

		testColumnFromVisibleColumn('baz', 4, 0, 1);
		testColumnFromVisibleColumn('baz', 4, 1, 2);
		testColumnFromVisibleColumn('baz', 4, 2, 3);
		testColumnFromVisibleColumn('baz', 4, 3, 4);

		testColumnFromVisibleColumn('📚az', 4, 0, 1);
		testColumnFromVisibleColumn('📚az', 4, 1, 1);
		testColumnFromVisibleColumn('📚az', 4, 2, 3);
		testColumnFromVisibleColumn('📚az', 4, 3, 4);
		testColumnFromVisibleColumn('📚az', 4, 4, 5);
	});

	for (const [name, fn] of [
		['nextRenderTabStop', CursorColumns.nextRenderTabStop],
		['nextIndentTabStop', CursorColumns.nextIndentTabStop],
	] as const) {
		test(name, () => {
			assert.strictEqual(fn(0, 4), 4);
			assert.strictEqual(fn(1, 4), 4);
			assert.strictEqual(fn(2, 4), 4);
			assert.strictEqual(fn(3, 4), 4);
			assert.strictEqual(fn(4, 4), 8);
			assert.strictEqual(fn(5, 4), 8);
			assert.strictEqual(fn(6, 4), 8);
			assert.strictEqual(fn(7, 4), 8);
			assert.strictEqual(fn(8, 4), 12);

			assert.strictEqual(fn(0, 2), 2);
			assert.strictEqual(fn(1, 2), 2);
			assert.strictEqual(fn(2, 2), 4);
			assert.strictEqual(fn(3, 2), 4);
			assert.strictEqual(fn(4, 2), 6);
			assert.strictEqual(fn(5, 2), 6);
			assert.strictEqual(fn(6, 2), 8);
			assert.strictEqual(fn(7, 2), 8);
			assert.strictEqual(fn(8, 2), 10);

			assert.strictEqual(fn(0, 1), 1);
			assert.strictEqual(fn(1, 1), 2);
			assert.strictEqual(fn(2, 1), 3);
			assert.strictEqual(fn(3, 1), 4);
			assert.strictEqual(fn(4, 1), 5);
			assert.strictEqual(fn(5, 1), 6);
			assert.strictEqual(fn(6, 1), 7);
			assert.strictEqual(fn(7, 1), 8);
			assert.strictEqual(fn(8, 1), 9);
		});
	}

	for (const [name, fn] of [
		['prevRenderTabStop', CursorColumns.prevRenderTabStop],
		['prevIndentTabStop', CursorColumns.prevIndentTabStop],
	] as const) {
		test(name, () => {
			assert.strictEqual(fn(0, 4), 0);
			assert.strictEqual(fn(1, 4), 0);
			assert.strictEqual(fn(2, 4), 0);
			assert.strictEqual(fn(3, 4), 0);
			assert.strictEqual(fn(4, 4), 0);
			assert.strictEqual(fn(5, 4), 4);
			assert.strictEqual(fn(6, 4), 4);
			assert.strictEqual(fn(7, 4), 4);
			assert.strictEqual(fn(8, 4), 4);
			assert.strictEqual(fn(9, 4), 8);

			assert.strictEqual(fn(0, 2), 0);
			assert.strictEqual(fn(1, 2), 0);
			assert.strictEqual(fn(2, 2), 0);
			assert.strictEqual(fn(3, 2), 2);
			assert.strictEqual(fn(4, 2), 2);
			assert.strictEqual(fn(5, 2), 4);
			assert.strictEqual(fn(6, 2), 4);
			assert.strictEqual(fn(7, 2), 6);
			assert.strictEqual(fn(8, 2), 6);
			assert.strictEqual(fn(9, 2), 8);

			assert.strictEqual(fn(0, 1), 0);
			assert.strictEqual(fn(1, 1), 0);
			assert.strictEqual(fn(2, 1), 1);
			assert.strictEqual(fn(3, 1), 2);
			assert.strictEqual(fn(4, 1), 3);
			assert.strictEqual(fn(5, 1), 4);
			assert.strictEqual(fn(6, 1), 5);
			assert.strictEqual(fn(7, 1), 6);
			assert.strictEqual(fn(8, 1), 7);
			assert.strictEqual(fn(9, 1), 8);
		});
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/lineRange.test.ts]---
Location: vscode-main/src/vs/editor/test/common/core/lineRange.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { LineRange, LineRangeSet } from '../../../common/core/ranges/lineRange.js';

suite('LineRange', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('contains', () => {
		const r = new LineRange(2, 3);
		assert.deepStrictEqual(r.contains(1), false);
		assert.deepStrictEqual(r.contains(2), true);
		assert.deepStrictEqual(r.contains(3), false);
		assert.deepStrictEqual(r.contains(4), false);
	});
});

suite('LineRangeSet', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('addRange', () => {
		const set = new LineRangeSet();
		set.addRange(new LineRange(2, 3));
		set.addRange(new LineRange(3, 4));
		set.addRange(new LineRange(10, 20));
		assert.deepStrictEqual(set.toString(), '[2,4), [10,20)');

		set.addRange(new LineRange(3, 21));
		assert.deepStrictEqual(set.toString(), '[2,21)');
	});

	test('getUnion', () => {
		const set1 = new LineRangeSet([
			new LineRange(2, 3),
			new LineRange(5, 7),
			new LineRange(10, 20)
		]);
		const set2 = new LineRangeSet([
			new LineRange(3, 4),
			new LineRange(6, 8),
			new LineRange(9, 11)
		]);

		const union = set1.getUnion(set2);
		assert.deepStrictEqual(union.toString(), '[2,4), [5,8), [9,20)');
	});

	test('intersects', () => {
		const set1 = new LineRangeSet([
			new LineRange(2, 3),
			new LineRange(5, 7),
			new LineRange(10, 20)
		]);

		assert.deepStrictEqual(set1.intersects(new LineRange(1, 2)), false);
		assert.deepStrictEqual(set1.intersects(new LineRange(1, 3)), true);
		assert.deepStrictEqual(set1.intersects(new LineRange(3, 5)), false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/lineTokens.test.ts]---
Location: vscode-main/src/vs/editor/test/common/core/lineTokens.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import { LanguageIdCodec } from '../../../common/services/languagesRegistry.js';
import { IViewLineTokens, LineTokens } from '../../../common/tokens/lineTokens.js';

suite('LineTokens', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	interface ILineToken {
		startIndex: number;
		foreground: number;
	}

	function createLineTokens(text: string, tokens: ILineToken[]): LineTokens {
		const binTokens = new Uint32Array(tokens.length << 1);

		for (let i = 0, len = tokens.length; i < len; i++) {
			binTokens[(i << 1)] = (i + 1 < len ? tokens[i + 1].startIndex : text.length);
			binTokens[(i << 1) + 1] = (
				tokens[i].foreground << MetadataConsts.FOREGROUND_OFFSET
			) >>> 0;
		}

		return new LineTokens(binTokens, text, new LanguageIdCodec());
	}

	function createTestLineTokens(): LineTokens {
		return createLineTokens(
			'Hello world, this is a lovely day',
			[
				{ startIndex: 0, foreground: 1 }, // Hello_
				{ startIndex: 6, foreground: 2 }, // world,_
				{ startIndex: 13, foreground: 3 }, // this_
				{ startIndex: 18, foreground: 4 }, // is_
				{ startIndex: 21, foreground: 5 }, // a_
				{ startIndex: 23, foreground: 6 }, // lovely_
				{ startIndex: 30, foreground: 7 }, // day
			]
		);
	}

	function renderLineTokens(tokens: LineTokens): string {
		let result = '';
		const str = tokens.getLineContent();
		let lastOffset = 0;
		for (let i = 0; i < tokens.getCount(); i++) {
			result += str.substring(lastOffset, tokens.getEndOffset(i));
			result += `(${tokens.getMetadata(i)})`;
			lastOffset = tokens.getEndOffset(i);
		}
		return result;
	}

	test('withInserted 1', () => {
		const lineTokens = createTestLineTokens();
		assert.strictEqual(renderLineTokens(lineTokens), 'Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)');

		const lineTokens2 = lineTokens.withInserted([
			{ offset: 0, text: '1', tokenMetadata: 0, },
			{ offset: 6, text: '2', tokenMetadata: 0, },
			{ offset: 9, text: '3', tokenMetadata: 0, },
		]);

		assert.strictEqual(renderLineTokens(lineTokens2), '1(0)Hello (32768)2(0)wor(65536)3(0)ld, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)');
	});

	test('withInserted (tokens at the same position)', () => {
		const lineTokens = createTestLineTokens();
		assert.strictEqual(renderLineTokens(lineTokens), 'Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)');

		const lineTokens2 = lineTokens.withInserted([
			{ offset: 0, text: '1', tokenMetadata: 0, },
			{ offset: 0, text: '2', tokenMetadata: 0, },
			{ offset: 0, text: '3', tokenMetadata: 0, },
		]);

		assert.strictEqual(renderLineTokens(lineTokens2), '1(0)2(0)3(0)Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)');
	});

	test('withInserted (tokens at the end)', () => {
		const lineTokens = createTestLineTokens();
		assert.strictEqual(renderLineTokens(lineTokens), 'Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)');

		const lineTokens2 = lineTokens.withInserted([
			{ offset: 'Hello world, this is a lovely day'.length - 1, text: '1', tokenMetadata: 0, },
			{ offset: 'Hello world, this is a lovely day'.length, text: '2', tokenMetadata: 0, },
		]);

		assert.strictEqual(renderLineTokens(lineTokens2), 'Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)da(229376)1(0)y(229376)2(0)');
	});

	test('basics', () => {
		const lineTokens = createTestLineTokens();

		assert.strictEqual(lineTokens.getLineContent(), 'Hello world, this is a lovely day');
		assert.strictEqual(lineTokens.getLineContent().length, 33);
		assert.strictEqual(lineTokens.getCount(), 7);

		assert.strictEqual(lineTokens.getStartOffset(0), 0);
		assert.strictEqual(lineTokens.getEndOffset(0), 6);
		assert.strictEqual(lineTokens.getStartOffset(1), 6);
		assert.strictEqual(lineTokens.getEndOffset(1), 13);
		assert.strictEqual(lineTokens.getStartOffset(2), 13);
		assert.strictEqual(lineTokens.getEndOffset(2), 18);
		assert.strictEqual(lineTokens.getStartOffset(3), 18);
		assert.strictEqual(lineTokens.getEndOffset(3), 21);
		assert.strictEqual(lineTokens.getStartOffset(4), 21);
		assert.strictEqual(lineTokens.getEndOffset(4), 23);
		assert.strictEqual(lineTokens.getStartOffset(5), 23);
		assert.strictEqual(lineTokens.getEndOffset(5), 30);
		assert.strictEqual(lineTokens.getStartOffset(6), 30);
		assert.strictEqual(lineTokens.getEndOffset(6), 33);
	});

	test('findToken', () => {
		const lineTokens = createTestLineTokens();

		assert.strictEqual(lineTokens.findTokenIndexAtOffset(0), 0);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(1), 0);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(2), 0);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(3), 0);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(4), 0);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(5), 0);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(6), 1);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(7), 1);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(8), 1);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(9), 1);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(10), 1);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(11), 1);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(12), 1);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(13), 2);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(14), 2);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(15), 2);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(16), 2);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(17), 2);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(18), 3);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(19), 3);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(20), 3);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(21), 4);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(22), 4);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(23), 5);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(24), 5);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(25), 5);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(26), 5);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(27), 5);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(28), 5);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(29), 5);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(30), 6);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(31), 6);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(32), 6);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(33), 6);
		assert.strictEqual(lineTokens.findTokenIndexAtOffset(34), 6);
	});

	interface ITestViewLineToken {
		endIndex: number;
		foreground: number;
	}

	function assertViewLineTokens(_actual: IViewLineTokens, expected: ITestViewLineToken[]): void {
		const actual: ITestViewLineToken[] = [];
		for (let i = 0, len = _actual.getCount(); i < len; i++) {
			actual[i] = {
				endIndex: _actual.getEndOffset(i),
				foreground: _actual.getForeground(i)
			};
		}
		assert.deepStrictEqual(actual, expected);
	}

	test('inflate', () => {
		const lineTokens = createTestLineTokens();
		assertViewLineTokens(lineTokens.inflate(), [
			{ endIndex: 6, foreground: 1 },
			{ endIndex: 13, foreground: 2 },
			{ endIndex: 18, foreground: 3 },
			{ endIndex: 21, foreground: 4 },
			{ endIndex: 23, foreground: 5 },
			{ endIndex: 30, foreground: 6 },
			{ endIndex: 33, foreground: 7 },
		]);
	});

	test('sliceAndInflate', () => {
		const lineTokens = createTestLineTokens();
		assertViewLineTokens(lineTokens.sliceAndInflate(0, 33, 0), [
			{ endIndex: 6, foreground: 1 },
			{ endIndex: 13, foreground: 2 },
			{ endIndex: 18, foreground: 3 },
			{ endIndex: 21, foreground: 4 },
			{ endIndex: 23, foreground: 5 },
			{ endIndex: 30, foreground: 6 },
			{ endIndex: 33, foreground: 7 },
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(0, 32, 0), [
			{ endIndex: 6, foreground: 1 },
			{ endIndex: 13, foreground: 2 },
			{ endIndex: 18, foreground: 3 },
			{ endIndex: 21, foreground: 4 },
			{ endIndex: 23, foreground: 5 },
			{ endIndex: 30, foreground: 6 },
			{ endIndex: 32, foreground: 7 },
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(0, 30, 0), [
			{ endIndex: 6, foreground: 1 },
			{ endIndex: 13, foreground: 2 },
			{ endIndex: 18, foreground: 3 },
			{ endIndex: 21, foreground: 4 },
			{ endIndex: 23, foreground: 5 },
			{ endIndex: 30, foreground: 6 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(0, 30, 1), [
			{ endIndex: 7, foreground: 1 },
			{ endIndex: 14, foreground: 2 },
			{ endIndex: 19, foreground: 3 },
			{ endIndex: 22, foreground: 4 },
			{ endIndex: 24, foreground: 5 },
			{ endIndex: 31, foreground: 6 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(6, 18, 0), [
			{ endIndex: 7, foreground: 2 },
			{ endIndex: 12, foreground: 3 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(7, 18, 0), [
			{ endIndex: 6, foreground: 2 },
			{ endIndex: 11, foreground: 3 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(6, 17, 0), [
			{ endIndex: 7, foreground: 2 },
			{ endIndex: 11, foreground: 3 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(6, 19, 0), [
			{ endIndex: 7, foreground: 2 },
			{ endIndex: 12, foreground: 3 },
			{ endIndex: 13, foreground: 4 },
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/positionOffsetTransformer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/core/positionOffsetTransformer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { PositionOffsetTransformer } from '../../../common/core/text/positionToOffset.js';

suite('PositionOffsetTransformer', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const str = '123456\nabcdef\nghijkl\nmnopqr';

	const t = new PositionOffsetTransformer(str);
	test('getPosition', () => {
		assert.deepStrictEqual(
			new OffsetRange(0, str.length + 2).map(i => t.getPosition(i).toString()),
			[
				'(1,1)',
				'(1,2)',
				'(1,3)',
				'(1,4)',
				'(1,5)',
				'(1,6)',
				'(1,7)',
				'(2,1)',
				'(2,2)',
				'(2,3)',
				'(2,4)',
				'(2,5)',
				'(2,6)',
				'(2,7)',
				'(3,1)',
				'(3,2)',
				'(3,3)',
				'(3,4)',
				'(3,5)',
				'(3,6)',
				'(3,7)',
				'(4,1)',
				'(4,2)',
				'(4,3)',
				'(4,4)',
				'(4,5)',
				'(4,6)',
				'(4,7)',
				'(4,8)'
			]
		);
	});

	test('getOffset', () => {
		for (let i = 0; i < str.length + 1; i++) {
			assert.strictEqual(t.getOffset(t.getPosition(i)), i);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/random.ts]---
Location: vscode-main/src/vs/editor/test/common/core/random.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { numberComparator } from '../../../../base/common/arrays.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { StringEdit, StringReplacement } from '../../../common/core/edits/stringEdit.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { Position } from '../../../common/core/position.js';
import { PositionOffsetTransformer } from '../../../common/core/text/positionToOffset.js';
import { Range } from '../../../common/core/range.js';
import { TextReplacement, TextEdit } from '../../../common/core/edits/textEdit.js';
import { AbstractText } from '../../../common/core/text/abstractText.js';

export abstract class Random {
	public static readonly alphabetSmallLowercase = 'abcdefgh';
	public static readonly alphabetSmallUppercase = 'ABCDEFGH';
	public static readonly alphabetLowercase = 'abcdefghijklmnopqrstuvwxyz';
	public static readonly alphabetUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	public static readonly basicAlphabet: string = '      abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	public static readonly basicAlphabetMultiline: string = '      \n\n\nabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	public static create(seed: number): Random {
		return new MersenneTwister(seed);
	}

	public stringGenerator(alphabet: string): IGenerator<string> {
		return {
			next: () => {
				const characterIndex = this.nextIntRange(0, alphabet.length);
				return alphabet.charAt(characterIndex);
			}
		};
	}

	public abstract nextIntRange(start: number, endExclusive: number): number;

	public nextString(length: number, alphabet = this.stringGenerator(Random.basicAlphabet)): string {
		let randomText: string = '';
		for (let i = 0; i < length; i++) {
			randomText += alphabet.next();
		}
		return randomText;
	}

	public nextMultiLineString(lineCount: number, lineLengthRange: OffsetRange, alphabet = this.stringGenerator(Random.basicAlphabet)): string {
		const lines: string[] = [];
		for (let i = 0; i < lineCount; i++) {
			const lineLength = this.nextIntRange(lineLengthRange.start, lineLengthRange.endExclusive);
			lines.push(this.nextString(lineLength, alphabet));
		}
		return lines.join('\n');
	}

	public nextConsecutiveOffsets(range: OffsetRange, count: number): number[] {
		const offsets = OffsetRange.ofLength(count).map(() => this.nextIntRange(range.start, range.endExclusive));
		offsets.sort(numberComparator);
		return offsets;
	}

	public nextConsecutivePositions(source: AbstractText, count: number): Position[] {
		const t = new PositionOffsetTransformer(source.getValue());
		const offsets = this.nextConsecutiveOffsets(new OffsetRange(0, t.text.length), count);
		return offsets.map(offset => t.getPosition(offset));
	}

	public nextRange(source: AbstractText): Range {
		const [start, end] = this.nextConsecutivePositions(source, 2);
		return Range.fromPositions(start, end);
	}

	public nextTextEdit(target: AbstractText, singleTextEditCount: number): TextEdit {
		const singleTextEdits: TextReplacement[] = [];

		const positions = this.nextConsecutivePositions(target, singleTextEditCount * 2);

		for (let i = 0; i < singleTextEditCount; i++) {
			const start = positions[i * 2];
			const end = positions[i * 2 + 1];
			const newText = this.nextString(end.column - start.column, this.stringGenerator(Random.basicAlphabetMultiline));
			singleTextEdits.push(new TextReplacement(Range.fromPositions(start, end), newText));
		}

		return new TextEdit(singleTextEdits).normalize();
	}

	public nextStringEdit(target: string, singleTextEditCount: number, newTextAlphabet = Random.basicAlphabetMultiline): StringEdit {
		const singleTextEdits: StringReplacement[] = [];

		const positions = this.nextConsecutiveOffsets(new OffsetRange(0, target.length), singleTextEditCount * 2);

		for (let i = 0; i < singleTextEditCount; i++) {
			const start = positions[i * 2];
			const end = positions[i * 2 + 1];
			const range = new OffsetRange(start, end);

			const newTextLen = this.nextIntRange(range.isEmpty ? 1 : 0, 10);
			const newText = this.nextString(newTextLen, this.stringGenerator(newTextAlphabet));
			singleTextEdits.push(new StringReplacement(range, newText));
		}

		return new StringEdit(singleTextEdits).normalize();
	}

	public nextSingleStringEdit(target: string, newTextAlphabet = Random.basicAlphabetMultiline): StringReplacement {
		const edit = this.nextStringEdit(target, 1, newTextAlphabet);
		return edit.replacements[0];
	}

	/**
	 * Fills the given array with random data.
	*/
	public nextRandomValues(data: Uint8Array): void {
		for (let i = 0; i < data.length; i++) {
			data[i] = this.nextIntRange(0, 256);
		}
	}

	private _hex: string[] | undefined;
	private _data: Uint8Array | undefined;

	public nextUuid(): string {
		if (!this._data) {
			this._data = new Uint8Array(16);
		}
		if (!this._hex) {
			this._hex = [];
			for (let i = 0; i < 256; i++) {
				this._hex.push(i.toString(16).padStart(2, '0'));
			}
		}

		this.nextRandomValues(this._data);

		// set version bits
		this._data[6] = (this._data[6] & 0x0f) | 0x40;
		this._data[8] = (this._data[8] & 0x3f) | 0x80;

		let i = 0;
		let result = '';
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += '-';
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += '-';
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += '-';
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += '-';
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		result += this._hex[this._data[i++]];
		return result;
	}
}

export function sequenceGenerator<T>(sequence: T[]): IGenerator<T> {
	let index = 0;
	return {
		next: () => {
			if (index >= sequence.length) {
				throw new BugIndicatingError('End of sequence');
			}
			const element = sequence[index];
			index++;
			return element;
		}
	};
}

export interface IGenerator<T> {
	next(): T;
}

class MersenneTwister extends Random {
	private readonly mt = new Array(624);
	private index = 0;

	constructor(seed: number) {
		super();

		this.mt[0] = seed >>> 0;
		for (let i = 1; i < 624; i++) {
			const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
			this.mt[i] = (((((s & 0xffff0000) >>> 16) * 0x6c078965) << 16) + (s & 0x0000ffff) * 0x6c078965 + i) >>> 0;
		}
	}

	private _nextInt() {
		if (this.index === 0) {
			this.generateNumbers();
		}

		let y = this.mt[this.index];
		y = y ^ (y >>> 11);
		y = y ^ ((y << 7) & 0x9d2c5680);
		y = y ^ ((y << 15) & 0xefc60000);
		y = y ^ (y >>> 18);

		this.index = (this.index + 1) % 624;

		return y >>> 0;
	}

	public nextIntRange(start: number, endExclusive: number) {
		const range = endExclusive - start;
		return Math.floor(this._nextInt() / (0x100000000 / range)) + start;
	}

	private generateNumbers() {
		for (let i = 0; i < 624; i++) {
			const y = (this.mt[i] & 0x80000000) + (this.mt[(i + 1) % 624] & 0x7fffffff);
			this.mt[i] = this.mt[(i + 397) % 624] ^ (y >>> 1);
			if ((y % 2) !== 0) {
				this.mt[i] = this.mt[i] ^ 0x9908b0df;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

````

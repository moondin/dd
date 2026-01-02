---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 255
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 255 of 552)

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

---[FILE: src/vs/editor/test/node/diffing/fixtures/fuzzy-matching/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/fuzzy-matching/legacy.expected.diff.json

```json
{
	"original": {
		"content": "\nconsole.log(1)\nconsole.log(2)\nconsole.log(3)\nconsole.log(4)\nconsole.log(5)\nconsole.log(6)\nconsole.log(7)\n",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "console.log(1);\nconsole.log(2);\nconsole.log(3);\nconsole.log(4);\n\nconsole.log(5);\nconsole.log(6);\nconsole.log(7);\n\n",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[1,1)",
			"modifiedRange": "[1,9)",
			"innerChanges": null
		},
		{
			"originalRange": "[2,9)",
			"modifiedRange": "[10,10)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/import-shifting/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/import-shifting/1.tst

```text
import { RuntimeMode } from './runtimeMode';
import { PromiseQueue } from './telemetry';
import { TestNotificationSender, TestUrlOpener } from './testHelpers';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/import-shifting/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/import-shifting/2.tst

```text
import { RuntimeMode } from './runtimeMode';
import { PromiseQueue, TestPromiseQueue } from './telemetry';
import { TestNotificationSender, TestUrlOpener } from './testHelpers';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/import-shifting/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/import-shifting/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { RuntimeMode } from './runtimeMode';\nimport { PromiseQueue } from './telemetry';\nimport { TestNotificationSender, TestUrlOpener } from './testHelpers';\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { RuntimeMode } from './runtimeMode';\nimport { PromiseQueue, TestPromiseQueue } from './telemetry';\nimport { TestNotificationSender, TestUrlOpener } from './testHelpers';\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,3)",
			"modifiedRange": "[2,3)",
			"innerChanges": [
				{
					"originalRange": "[2,22 -> 2,22]",
					"modifiedRange": "[2,22 -> 2,40]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/import-shifting/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/import-shifting/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { RuntimeMode } from './runtimeMode';\nimport { PromiseQueue } from './telemetry';\nimport { TestNotificationSender, TestUrlOpener } from './testHelpers';\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { RuntimeMode } from './runtimeMode';\nimport { PromiseQueue, TestPromiseQueue } from './telemetry';\nimport { TestNotificationSender, TestUrlOpener } from './testHelpers';\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,3)",
			"modifiedRange": "[2,3)",
			"innerChanges": [
				{
					"originalRange": "[2,22 -> 2,22]",
					"modifiedRange": "[2,22 -> 2,40]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/indentation/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/indentation/1.tst

```text
export function lineRangeMappingFromRangeMappings(alignments: RangeMapping[]): LineRangeMapping[] {
	const changes: LineRangeMapping[] = [];
	for (const g of group(
		alignments,
		(a1, a2) =>
			(a2.originalRange.startLineNumber - (a1.originalRange.endLineNumber - (a1.originalRange.endColumn > 1 ? 0 : 1)) <= 1)
			|| (a2.modifiedRange.startLineNumber - (a1.modifiedRange.endLineNumber - (a1.modifiedRange.endColumn > 1 ? 0 : 1)) <= 1)
	)) {
		const first = g[0];
		const last = g[g.length - 1];

		changes.push(new LineRangeMapping(
			new LineRange(
				first.originalRange.startLineNumber,
				last.originalRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)
			),
			new LineRange(
				first.modifiedRange.startLineNumber,
				last.modifiedRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)
			),
			g
		));
	}

	assertFn(() => {
		return checkAdjacentItems(changes,
			(m1, m2) => m2.originalRange.startLineNumber - m1.originalRange.endLineNumberExclusive === m2.modifiedRange.startLineNumber - m1.modifiedRange.endLineNumberExclusive &&
				// There has to be an unchanged line in between (otherwise both diffs should have been joined)
				m1.originalRange.endLineNumberExclusive < m2.originalRange.startLineNumber &&
				m1.modifiedRange.endLineNumberExclusive < m2.modifiedRange.startLineNumber,
		);
	});


	return changes;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/indentation/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/indentation/2.tst

```text
export function lineRangeMappingFromRangeMappings(alignments: RangeMapping[]): LineRangeMapping[] {
	const changes: LineRangeMapping[] = [];
	for (const g of group(
		alignments,
		(a1, a2) =>
			(a2.originalRange.startLineNumber - (a1.originalRange.endLineNumber - (a1.originalRange.endColumn > 1 ? 0 : 1)) <= 1)
			|| (a2.modifiedRange.startLineNumber - (a1.modifiedRange.endLineNumber - (a1.modifiedRange.endColumn > 1 ? 0 : 1)) <= 1)
	)) {
		if (true) {
			const first = g[0];
			const last = g[g.length - 1];

			changes.push(new LineRangeMapping(
				new LineRange(
					first.originalRange.startLineNumber,
					last.originalRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)
				),
				new LineRange(
					first.modifiedRange.startLineNumber,
					last.modifiedRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)
				),
				g
			));
		}
	}

	assertFn(() => {
		return checkAdjacentItems(changes,
			(m1, m2) => m2.originalRange.startLineNumber - m1.originalRange.endLineNumberExclusive === m2.modifiedRange.startLineNumber - m1.modifiedRange.endLineNumberExclusive &&
				// There has to be an unchanged line in between (otherwise both diffs should have been joined)
				m1.originalRange.endLineNumberExclusive < m2.originalRange.startLineNumber &&
				m1.modifiedRange.endLineNumberExclusive < m2.modifiedRange.startLineNumber,
		);
	});


	return changes;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/indentation/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/indentation/advanced.expected.diff.json

```json
{
	"original": {
		"content": "export function lineRangeMappingFromRangeMappings(alignments: RangeMapping[]): LineRangeMapping[] {\n\tconst changes: LineRangeMapping[] = [];\n\tfor (const g of group(\n\t\talignments,\n\t\t(a1, a2) =>\n\t\t\t(a2.originalRange.startLineNumber - (a1.originalRange.endLineNumber - (a1.originalRange.endColumn > 1 ? 0 : 1)) <= 1)\n\t\t\t|| (a2.modifiedRange.startLineNumber - (a1.modifiedRange.endLineNumber - (a1.modifiedRange.endColumn > 1 ? 0 : 1)) <= 1)\n\t)) {\n\t\tconst first = g[0];\n\t\tconst last = g[g.length - 1];\n\n\t\tchanges.push(new LineRangeMapping(\n\t\t\tnew LineRange(\n\t\t\t\tfirst.originalRange.startLineNumber,\n\t\t\t\tlast.originalRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)\n\t\t\t),\n\t\t\tnew LineRange(\n\t\t\t\tfirst.modifiedRange.startLineNumber,\n\t\t\t\tlast.modifiedRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)\n\t\t\t),\n\t\t\tg\n\t\t));\n\t}\n\n\tassertFn(() => {\n\t\treturn checkAdjacentItems(changes,\n\t\t\t(m1, m2) => m2.originalRange.startLineNumber - m1.originalRange.endLineNumberExclusive === m2.modifiedRange.startLineNumber - m1.modifiedRange.endLineNumberExclusive &&\n\t\t\t\t// There has to be an unchanged line in between (otherwise both diffs should have been joined)\n\t\t\t\tm1.originalRange.endLineNumberExclusive < m2.originalRange.startLineNumber &&\n\t\t\t\tm1.modifiedRange.endLineNumberExclusive < m2.modifiedRange.startLineNumber,\n\t\t);\n\t});\n\n\n\treturn changes;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "export function lineRangeMappingFromRangeMappings(alignments: RangeMapping[]): LineRangeMapping[] {\n\tconst changes: LineRangeMapping[] = [];\n\tfor (const g of group(\n\t\talignments,\n\t\t(a1, a2) =>\n\t\t\t(a2.originalRange.startLineNumber - (a1.originalRange.endLineNumber - (a1.originalRange.endColumn > 1 ? 0 : 1)) <= 1)\n\t\t\t|| (a2.modifiedRange.startLineNumber - (a1.modifiedRange.endLineNumber - (a1.modifiedRange.endColumn > 1 ? 0 : 1)) <= 1)\n\t)) {\n\t\tif (true) {\n\t\t\tconst first = g[0];\n\t\t\tconst last = g[g.length - 1];\n\n\t\t\tchanges.push(new LineRangeMapping(\n\t\t\t\tnew LineRange(\n\t\t\t\t\tfirst.originalRange.startLineNumber,\n\t\t\t\t\tlast.originalRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)\n\t\t\t\t),\n\t\t\t\tnew LineRange(\n\t\t\t\t\tfirst.modifiedRange.startLineNumber,\n\t\t\t\t\tlast.modifiedRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)\n\t\t\t\t),\n\t\t\t\tg\n\t\t\t));\n\t\t}\n\t}\n\n\tassertFn(() => {\n\t\treturn checkAdjacentItems(changes,\n\t\t\t(m1, m2) => m2.originalRange.startLineNumber - m1.originalRange.endLineNumberExclusive === m2.modifiedRange.startLineNumber - m1.modifiedRange.endLineNumberExclusive &&\n\t\t\t\t// There has to be an unchanged line in between (otherwise both diffs should have been joined)\n\t\t\t\tm1.originalRange.endLineNumberExclusive < m2.originalRange.startLineNumber &&\n\t\t\t\tm1.modifiedRange.endLineNumberExclusive < m2.modifiedRange.startLineNumber,\n\t\t);\n\t});\n\n\n\treturn changes;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[9,11)",
			"modifiedRange": "[9,12)",
			"innerChanges": [
				{
					"originalRange": "[9,1 -> 9,1]",
					"modifiedRange": "[9,1 -> 10,1]"
				},
				{
					"originalRange": "[9,1 -> 9,1]",
					"modifiedRange": "[10,1 -> 10,2]"
				},
				{
					"originalRange": "[10,1 -> 10,1]",
					"modifiedRange": "[11,1 -> 11,2]"
				}
			]
		},
		{
			"originalRange": "[12,23)",
			"modifiedRange": "[13,25)",
			"innerChanges": [
				{
					"originalRange": "[12,1 -> 12,1]",
					"modifiedRange": "[13,1 -> 13,2]"
				},
				{
					"originalRange": "[13,1 -> 13,1]",
					"modifiedRange": "[14,1 -> 14,2]"
				},
				{
					"originalRange": "[14,1 -> 14,1]",
					"modifiedRange": "[15,1 -> 15,2]"
				},
				{
					"originalRange": "[15,1 -> 15,1]",
					"modifiedRange": "[16,1 -> 16,2]"
				},
				{
					"originalRange": "[16,1 -> 16,1]",
					"modifiedRange": "[17,1 -> 17,2]"
				},
				{
					"originalRange": "[17,1 -> 17,1]",
					"modifiedRange": "[18,1 -> 18,2]"
				},
				{
					"originalRange": "[18,1 -> 18,1]",
					"modifiedRange": "[19,1 -> 19,2]"
				},
				{
					"originalRange": "[19,1 -> 19,1]",
					"modifiedRange": "[20,1 -> 20,2]"
				},
				{
					"originalRange": "[20,1 -> 20,1]",
					"modifiedRange": "[21,1 -> 21,2]"
				},
				{
					"originalRange": "[21,1 -> 21,1]",
					"modifiedRange": "[22,1 -> 22,2]"
				},
				{
					"originalRange": "[22,1 -> 22,1]",
					"modifiedRange": "[23,1 -> 23,2]"
				},
				{
					"originalRange": "[23,1 -> 23,1]",
					"modifiedRange": "[24,1 -> 25,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/indentation/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/indentation/legacy.expected.diff.json

```json
{
	"original": {
		"content": "export function lineRangeMappingFromRangeMappings(alignments: RangeMapping[]): LineRangeMapping[] {\n\tconst changes: LineRangeMapping[] = [];\n\tfor (const g of group(\n\t\talignments,\n\t\t(a1, a2) =>\n\t\t\t(a2.originalRange.startLineNumber - (a1.originalRange.endLineNumber - (a1.originalRange.endColumn > 1 ? 0 : 1)) <= 1)\n\t\t\t|| (a2.modifiedRange.startLineNumber - (a1.modifiedRange.endLineNumber - (a1.modifiedRange.endColumn > 1 ? 0 : 1)) <= 1)\n\t)) {\n\t\tconst first = g[0];\n\t\tconst last = g[g.length - 1];\n\n\t\tchanges.push(new LineRangeMapping(\n\t\t\tnew LineRange(\n\t\t\t\tfirst.originalRange.startLineNumber,\n\t\t\t\tlast.originalRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)\n\t\t\t),\n\t\t\tnew LineRange(\n\t\t\t\tfirst.modifiedRange.startLineNumber,\n\t\t\t\tlast.modifiedRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)\n\t\t\t),\n\t\t\tg\n\t\t));\n\t}\n\n\tassertFn(() => {\n\t\treturn checkAdjacentItems(changes,\n\t\t\t(m1, m2) => m2.originalRange.startLineNumber - m1.originalRange.endLineNumberExclusive === m2.modifiedRange.startLineNumber - m1.modifiedRange.endLineNumberExclusive &&\n\t\t\t\t// There has to be an unchanged line in between (otherwise both diffs should have been joined)\n\t\t\t\tm1.originalRange.endLineNumberExclusive < m2.originalRange.startLineNumber &&\n\t\t\t\tm1.modifiedRange.endLineNumberExclusive < m2.modifiedRange.startLineNumber,\n\t\t);\n\t});\n\n\n\treturn changes;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "export function lineRangeMappingFromRangeMappings(alignments: RangeMapping[]): LineRangeMapping[] {\n\tconst changes: LineRangeMapping[] = [];\n\tfor (const g of group(\n\t\talignments,\n\t\t(a1, a2) =>\n\t\t\t(a2.originalRange.startLineNumber - (a1.originalRange.endLineNumber - (a1.originalRange.endColumn > 1 ? 0 : 1)) <= 1)\n\t\t\t|| (a2.modifiedRange.startLineNumber - (a1.modifiedRange.endLineNumber - (a1.modifiedRange.endColumn > 1 ? 0 : 1)) <= 1)\n\t)) {\n\t\tif (true) {\n\t\t\tconst first = g[0];\n\t\t\tconst last = g[g.length - 1];\n\n\t\t\tchanges.push(new LineRangeMapping(\n\t\t\t\tnew LineRange(\n\t\t\t\t\tfirst.originalRange.startLineNumber,\n\t\t\t\t\tlast.originalRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)\n\t\t\t\t),\n\t\t\t\tnew LineRange(\n\t\t\t\t\tfirst.modifiedRange.startLineNumber,\n\t\t\t\t\tlast.modifiedRange.endLineNumber + (last.originalRange.endColumn > 1 || last.modifiedRange.endColumn > 1 ? 1 : 0)\n\t\t\t\t),\n\t\t\t\tg\n\t\t\t));\n\t\t}\n\t}\n\n\tassertFn(() => {\n\t\treturn checkAdjacentItems(changes,\n\t\t\t(m1, m2) => m2.originalRange.startLineNumber - m1.originalRange.endLineNumberExclusive === m2.modifiedRange.startLineNumber - m1.modifiedRange.endLineNumberExclusive &&\n\t\t\t\t// There has to be an unchanged line in between (otherwise both diffs should have been joined)\n\t\t\t\tm1.originalRange.endLineNumberExclusive < m2.originalRange.startLineNumber &&\n\t\t\t\tm1.modifiedRange.endLineNumberExclusive < m2.modifiedRange.startLineNumber,\n\t\t);\n\t});\n\n\n\treturn changes;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[9,11)",
			"modifiedRange": "[9,12)",
			"innerChanges": null
		},
		{
			"originalRange": "[12,23)",
			"modifiedRange": "[13,25)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/intra-block-align/1.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/intra-block-align/1.txt

```text
console.log(1);
console.log(2);
console.log(3);
console.log(4);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/intra-block-align/2.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/intra-block-align/2.txt

```text
console.log(1)
console.log(2)
console.log(4)
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/intra-block-align/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/intra-block-align/advanced.expected.diff.json

```json
{
	"original": {
		"content": "console.log(1);\nconsole.log(2);\nconsole.log(3);\nconsole.log(4);\n",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "console.log(1)\nconsole.log(2)\nconsole.log(4)\n",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[1,5)",
			"modifiedRange": "[1,4)",
			"innerChanges": [
				{
					"originalRange": "[1,15 -> 1,16 EOL]",
					"modifiedRange": "[1,15 -> 1,15 EOL]"
				},
				{
					"originalRange": "[2,15 -> 3,16 EOL]",
					"modifiedRange": "[2,15 -> 2,15 EOL]"
				},
				{
					"originalRange": "[4,15 -> 4,16 EOL]",
					"modifiedRange": "[3,15 -> 3,15 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/intra-block-align/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/intra-block-align/legacy.expected.diff.json

```json
{
	"original": {
		"content": "console.log(1);\nconsole.log(2);\nconsole.log(3);\nconsole.log(4);\n",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "console.log(1)\nconsole.log(2)\nconsole.log(4)\n",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[1,5)",
			"modifiedRange": "[1,4)",
			"innerChanges": [
				{
					"originalRange": "[1,15 -> 1,16 EOL]",
					"modifiedRange": "[1,15 -> 1,15 EOL]"
				},
				{
					"originalRange": "[2,15 -> 3,16 EOL]",
					"modifiedRange": "[2,15 -> 2,15 EOL]"
				},
				{
					"originalRange": "[4,15 -> 4,16 EOL]",
					"modifiedRange": "[3,15 -> 3,15 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-diff-bug/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-diff-bug/1.tst

```text
const API = require('../src/api');

describe('API', () => {
  let api;
  let database;

  beforeAll(() => {
    database = {
      getAllBooks: jest.fn(),
      getBooksByAuthor: jest.fn(),
      getBooksByTitle: jest.fn(),
    };
    api = new API(database);
  });

  describe('GET /books', () => {
    it('should return all books', async () => {
      const mockBooks = [{ title: 'Book 1' }, { title: 'Book 2' }];
      database.getAllBooks.mockResolvedValue(mockBooks);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await api.register({
        get: (path, handler) => {
          if (path === '/books') {
            handler(req, res);
          }
        },
      });

      expect(database.getAllBooks).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockBooks);
    });
  });

  describe('GET /books/author/:author', () => {
    it('should return books by author', async () => {
      const mockAuthor = 'John Doe';
      const mockBooks = [{ title: 'Book 1', author: mockAuthor }, { title: 'Book 2', author: mockAuthor }];
      database.getBooksByAuthor.mockResolvedValue(mockBooks);

      const req = {
        params: {
          author: mockAuthor,
        },
      };
      const res = {
        json: jest.fn(),
      };

      await api.register({
        get: (path, handler) => {
          if (path === `/books/author/${mockAuthor}`) {
            handler(req, res);
          }
        },
      });

      expect(database.getBooksByAuthor).toHaveBeenCalledWith(mockAuthor);
      expect(res.json).toHaveBeenCalledWith(mockBooks);
    });
  });

  describe('GET /books/title/:title', () => {
    it('should return books by title', async () => {
      const mockTitle = 'Book 1';
      const mockBooks = [{ title: mockTitle, author: 'John Doe' }];
      database.getBooksByTitle.mockResolvedValue(mockBooks);

      const req = {
        params: {
          title: mockTitle,
        },
      };
      const res = {
        json: jest.fn(),
      };

      await api.register({
        get: (path, handler) => {
          if (path === `/books/title/${mockTitle}`) {
            handler(req, res);
          }
        },
      });

      expect(database.getBooksByTitle).toHaveBeenCalledWith(mockTitle);
      expect(res.json).toHaveBeenCalledWith(mockBooks);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-diff-bug/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-diff-bug/2.tst

```text
const request = require('supertest');
const API = require('../src/api');

describe('API', () => {
  let api;
  let database;

  beforeAll(() => {
    database = {
      getAllBooks: jest.fn(),
      getBooksByAuthor: jest.fn(),
      getBooksByTitle: jest.fn(),
    };
    api = new API(database);
  });

  describe('GET /books', () => {
    it('should return all books', async () => {
      const mockBooks = [{ title: 'Book 1' }, { title: 'Book 2' }];
      database.getAllBooks.mockResolvedValue(mockBooks);

      const response = await request(api.app).get('/books');

      expect(database.getAllBooks).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBooks);
    });
  });

  describe('GET /books/author/:author', () => {
    it('should return books by author', async () => {
      const mockAuthor = 'John Doe';
      const mockBooks = [{ title: 'Book 1', author: mockAuthor }, { title: 'Book 2', author: mockAuthor }];
      database.getBooksByAuthor.mockResolvedValue(mockBooks);

      const response = await request(api.app).get(`/books/author/${mockAuthor}`);

      expect(database.getBooksByAuthor).toHaveBeenCalledWith(mockAuthor);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBooks);
    });
  });

  describe('GET /books/title/:title', () => {
    it('should return books by title', async () => {
      const mockTitle = 'Book 1';
      const mockBooks = [{ title: mockTitle, author: 'John Doe' }];
      database.getBooksByTitle.mockResolvedValue(mockBooks);

      const response = await request(api.app).get(`/books/title/${mockTitle}`);

      expect(database.getBooksByTitle).toHaveBeenCalledWith(mockTitle);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBooks);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-diff-bug/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-diff-bug/advanced.expected.diff.json

```json
{
	"original": {
		"content": "const API = require('../src/api');\n\ndescribe('API', () => {\n  let api;\n  let database;\n\n  beforeAll(() => {\n    database = {\n      getAllBooks: jest.fn(),\n      getBooksByAuthor: jest.fn(),\n      getBooksByTitle: jest.fn(),\n    };\n    api = new API(database);\n  });\n\n  describe('GET /books', () => {\n    it('should return all books', async () => {\n      const mockBooks = [{ title: 'Book 1' }, { title: 'Book 2' }];\n      database.getAllBooks.mockResolvedValue(mockBooks);\n\n      const req = {};\n      const res = {\n        json: jest.fn(),\n      };\n\n      await api.register({\n        get: (path, handler) => {\n          if (path === '/books') {\n            handler(req, res);\n          }\n        },\n      });\n\n      expect(database.getAllBooks).toHaveBeenCalled();\n      expect(res.json).toHaveBeenCalledWith(mockBooks);\n    });\n  });\n\n  describe('GET /books/author/:author', () => {\n    it('should return books by author', async () => {\n      const mockAuthor = 'John Doe';\n      const mockBooks = [{ title: 'Book 1', author: mockAuthor }, { title: 'Book 2', author: mockAuthor }];\n      database.getBooksByAuthor.mockResolvedValue(mockBooks);\n\n      const req = {\n        params: {\n          author: mockAuthor,\n        },\n      };\n      const res = {\n        json: jest.fn(),\n      };\n\n      await api.register({\n        get: (path, handler) => {\n          if (path === `/books/author/${mockAuthor}`) {\n            handler(req, res);\n          }\n        },\n      });\n\n      expect(database.getBooksByAuthor).toHaveBeenCalledWith(mockAuthor);\n      expect(res.json).toHaveBeenCalledWith(mockBooks);\n    });\n  });\n\n  describe('GET /books/title/:title', () => {\n    it('should return books by title', async () => {\n      const mockTitle = 'Book 1';\n      const mockBooks = [{ title: mockTitle, author: 'John Doe' }];\n      database.getBooksByTitle.mockResolvedValue(mockBooks);\n\n      const req = {\n        params: {\n          title: mockTitle,\n        },\n      };\n      const res = {\n        json: jest.fn(),\n      };\n\n      await api.register({\n        get: (path, handler) => {\n          if (path === `/books/title/${mockTitle}`) {\n            handler(req, res);\n          }\n        },\n      });\n\n      expect(database.getBooksByTitle).toHaveBeenCalledWith(mockTitle);\n      expect(res.json).toHaveBeenCalledWith(mockBooks);\n    });\n  });\n});\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const request = require('supertest');\nconst API = require('../src/api');\n\ndescribe('API', () => {\n  let api;\n  let database;\n\n  beforeAll(() => {\n    database = {\n      getAllBooks: jest.fn(),\n      getBooksByAuthor: jest.fn(),\n      getBooksByTitle: jest.fn(),\n    };\n    api = new API(database);\n  });\n\n  describe('GET /books', () => {\n    it('should return all books', async () => {\n      const mockBooks = [{ title: 'Book 1' }, { title: 'Book 2' }];\n      database.getAllBooks.mockResolvedValue(mockBooks);\n\n      const response = await request(api.app).get('/books');\n\n      expect(database.getAllBooks).toHaveBeenCalled();\n      expect(response.status).toBe(200);\n      expect(response.body).toEqual(mockBooks);\n    });\n  });\n\n  describe('GET /books/author/:author', () => {\n    it('should return books by author', async () => {\n      const mockAuthor = 'John Doe';\n      const mockBooks = [{ title: 'Book 1', author: mockAuthor }, { title: 'Book 2', author: mockAuthor }];\n      database.getBooksByAuthor.mockResolvedValue(mockBooks);\n\n      const response = await request(api.app).get(`/books/author/${mockAuthor}`);\n\n      expect(database.getBooksByAuthor).toHaveBeenCalledWith(mockAuthor);\n      expect(response.status).toBe(200);\n      expect(response.body).toEqual(mockBooks);\n    });\n  });\n\n  describe('GET /books/title/:title', () => {\n    it('should return books by title', async () => {\n      const mockTitle = 'Book 1';\n      const mockBooks = [{ title: mockTitle, author: 'John Doe' }];\n      database.getBooksByTitle.mockResolvedValue(mockBooks);\n\n      const response = await request(api.app).get(`/books/title/${mockTitle}`);\n\n      expect(database.getBooksByTitle).toHaveBeenCalledWith(mockTitle);\n      expect(response.status).toBe(200);\n      expect(response.body).toEqual(mockBooks);\n    });\n  });\n});\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,1)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,1 -> 1,1]",
					"modifiedRange": "[1,1 -> 2,1]"
				}
			]
		},
		{
			"originalRange": "[21,33)",
			"modifiedRange": "[22,23)",
			"innerChanges": [
				{
					"originalRange": "[21,1 -> 22,1]",
					"modifiedRange": "[22,1 -> 22,1]"
				},
				{
					"originalRange": "[22,13 -> 26,6]",
					"modifiedRange": "[22,13 -> 22,23]"
				},
				{
					"originalRange": "[26,13 -> 26,13]",
					"modifiedRange": "[22,30 -> 22,38]"
				},
				{
					"originalRange": "[26,17 -> 33,1 EOL]",
					"modifiedRange": "[22,42 -> 23,1 EOL]"
				}
			]
		},
		{
			"originalRange": "[35,36)",
			"modifiedRange": "[25,27)",
			"innerChanges": [
				{
					"originalRange": "[35,14 -> 35,44]",
					"modifiedRange": "[25,14 -> 26,36]"
				}
			]
		},
		{
			"originalRange": "[45,61)",
			"modifiedRange": "[36,37)",
			"innerChanges": [
				{
					"originalRange": "[45,1 -> 54,6]",
					"modifiedRange": "[36,1 -> 36,23]"
				},
				{
					"originalRange": "[54,13 -> 54,13]",
					"modifiedRange": "[36,30 -> 36,38]"
				},
				{
					"originalRange": "[54,17 -> 55,9]",
					"modifiedRange": "[36,42 -> 36,47]"
				},
				{
					"originalRange": "[55,12 -> 56,24]",
					"modifiedRange": "[36,50 -> 36,51]"
				},
				{
					"originalRange": "[56,54 -> 60,9]",
					"modifiedRange": "[36,81 -> 36,81]"
				}
			]
		},
		{
			"originalRange": "[63,64)",
			"modifiedRange": "[39,41)",
			"innerChanges": [
				{
					"originalRange": "[63,14 -> 63,44]",
					"modifiedRange": "[39,14 -> 40,36]"
				}
			]
		},
		{
			"originalRange": "[73,89)",
			"modifiedRange": "[50,51)",
			"innerChanges": [
				{
					"originalRange": "[73,1 -> 82,6]",
					"modifiedRange": "[50,1 -> 50,23]"
				},
				{
					"originalRange": "[82,13 -> 82,13]",
					"modifiedRange": "[50,30 -> 50,38]"
				},
				{
					"originalRange": "[82,17 -> 83,9]",
					"modifiedRange": "[50,42 -> 50,47]"
				},
				{
					"originalRange": "[83,12 -> 84,24]",
					"modifiedRange": "[50,50 -> 50,51]"
				},
				{
					"originalRange": "[84,52 -> 88,9]",
					"modifiedRange": "[50,79 -> 50,79]"
				}
			]
		},
		{
			"originalRange": "[91,92)",
			"modifiedRange": "[53,55)",
			"innerChanges": [
				{
					"originalRange": "[91,14 -> 91,44]",
					"modifiedRange": "[53,14 -> 54,36]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-diff-bug/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-diff-bug/legacy.expected.diff.json

```json
{
	"original": {
		"content": "const API = require('../src/api');\n\ndescribe('API', () => {\n  let api;\n  let database;\n\n  beforeAll(() => {\n    database = {\n      getAllBooks: jest.fn(),\n      getBooksByAuthor: jest.fn(),\n      getBooksByTitle: jest.fn(),\n    };\n    api = new API(database);\n  });\n\n  describe('GET /books', () => {\n    it('should return all books', async () => {\n      const mockBooks = [{ title: 'Book 1' }, { title: 'Book 2' }];\n      database.getAllBooks.mockResolvedValue(mockBooks);\n\n      const req = {};\n      const res = {\n        json: jest.fn(),\n      };\n\n      await api.register({\n        get: (path, handler) => {\n          if (path === '/books') {\n            handler(req, res);\n          }\n        },\n      });\n\n      expect(database.getAllBooks).toHaveBeenCalled();\n      expect(res.json).toHaveBeenCalledWith(mockBooks);\n    });\n  });\n\n  describe('GET /books/author/:author', () => {\n    it('should return books by author', async () => {\n      const mockAuthor = 'John Doe';\n      const mockBooks = [{ title: 'Book 1', author: mockAuthor }, { title: 'Book 2', author: mockAuthor }];\n      database.getBooksByAuthor.mockResolvedValue(mockBooks);\n\n      const req = {\n        params: {\n          author: mockAuthor,\n        },\n      };\n      const res = {\n        json: jest.fn(),\n      };\n\n      await api.register({\n        get: (path, handler) => {\n          if (path === `/books/author/${mockAuthor}`) {\n            handler(req, res);\n          }\n        },\n      });\n\n      expect(database.getBooksByAuthor).toHaveBeenCalledWith(mockAuthor);\n      expect(res.json).toHaveBeenCalledWith(mockBooks);\n    });\n  });\n\n  describe('GET /books/title/:title', () => {\n    it('should return books by title', async () => {\n      const mockTitle = 'Book 1';\n      const mockBooks = [{ title: mockTitle, author: 'John Doe' }];\n      database.getBooksByTitle.mockResolvedValue(mockBooks);\n\n      const req = {\n        params: {\n          title: mockTitle,\n        },\n      };\n      const res = {\n        json: jest.fn(),\n      };\n\n      await api.register({\n        get: (path, handler) => {\n          if (path === `/books/title/${mockTitle}`) {\n            handler(req, res);\n          }\n        },\n      });\n\n      expect(database.getBooksByTitle).toHaveBeenCalledWith(mockTitle);\n      expect(res.json).toHaveBeenCalledWith(mockBooks);\n    });\n  });\n});\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const request = require('supertest');\nconst API = require('../src/api');\n\ndescribe('API', () => {\n  let api;\n  let database;\n\n  beforeAll(() => {\n    database = {\n      getAllBooks: jest.fn(),\n      getBooksByAuthor: jest.fn(),\n      getBooksByTitle: jest.fn(),\n    };\n    api = new API(database);\n  });\n\n  describe('GET /books', () => {\n    it('should return all books', async () => {\n      const mockBooks = [{ title: 'Book 1' }, { title: 'Book 2' }];\n      database.getAllBooks.mockResolvedValue(mockBooks);\n\n      const response = await request(api.app).get('/books');\n\n      expect(database.getAllBooks).toHaveBeenCalled();\n      expect(response.status).toBe(200);\n      expect(response.body).toEqual(mockBooks);\n    });\n  });\n\n  describe('GET /books/author/:author', () => {\n    it('should return books by author', async () => {\n      const mockAuthor = 'John Doe';\n      const mockBooks = [{ title: 'Book 1', author: mockAuthor }, { title: 'Book 2', author: mockAuthor }];\n      database.getBooksByAuthor.mockResolvedValue(mockBooks);\n\n      const response = await request(api.app).get(`/books/author/${mockAuthor}`);\n\n      expect(database.getBooksByAuthor).toHaveBeenCalledWith(mockAuthor);\n      expect(response.status).toBe(200);\n      expect(response.body).toEqual(mockBooks);\n    });\n  });\n\n  describe('GET /books/title/:title', () => {\n    it('should return books by title', async () => {\n      const mockTitle = 'Book 1';\n      const mockBooks = [{ title: mockTitle, author: 'John Doe' }];\n      database.getBooksByTitle.mockResolvedValue(mockBooks);\n\n      const response = await request(api.app).get(`/books/title/${mockTitle}`);\n\n      expect(database.getBooksByTitle).toHaveBeenCalledWith(mockTitle);\n      expect(response.status).toBe(200);\n      expect(response.body).toEqual(mockBooks);\n    });\n  });\n});\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,1)",
			"modifiedRange": "[1,2)",
			"innerChanges": null
		},
		{
			"originalRange": "[21,33)",
			"modifiedRange": "[22,23)",
			"innerChanges": [
				{
					"originalRange": "[21,15 -> 22,8]",
					"modifiedRange": "[22,15 -> 22,17]"
				},
				{
					"originalRange": "[22,11 -> 22,16]",
					"modifiedRange": "[22,20 -> 22,21]"
				},
				{
					"originalRange": "[22,19 -> 26,7]",
					"modifiedRange": "[22,24 -> 22,24]"
				},
				{
					"originalRange": "[26,13 -> 27,9]",
					"modifiedRange": "[22,30 -> 22,47]"
				},
				{
					"originalRange": "[27,12 -> 28,24]",
					"modifiedRange": "[22,50 -> 22,51]"
				},
				{
					"originalRange": "[28,33 -> 32,9]",
					"modifiedRange": "[22,60 -> 22,60]"
				}
			]
		},
		{
			"originalRange": "[35,36)",
			"modifiedRange": "[25,27)",
			"innerChanges": [
				{
					"originalRange": "[35,17 -> 35,22]",
					"modifiedRange": "[25,17 -> 25,29]"
				},
				{
					"originalRange": "[35,26 -> 35,44]",
					"modifiedRange": "[25,33 -> 26,36]"
				}
			]
		},
		{
			"originalRange": "[45,61)",
			"modifiedRange": "[36,37)",
			"innerChanges": [
				{
					"originalRange": "[45,15 -> 50,8]",
					"modifiedRange": "[36,15 -> 36,17]"
				},
				{
					"originalRange": "[50,11 -> 50,16]",
					"modifiedRange": "[36,20 -> 36,21]"
				},
				{
					"originalRange": "[50,19 -> 54,7]",
					"modifiedRange": "[36,24 -> 36,24]"
				},
				{
					"originalRange": "[54,13 -> 56,24]",
					"modifiedRange": "[36,30 -> 36,51]"
				},
				{
					"originalRange": "[56,54 -> 60,9]",
					"modifiedRange": "[36,81 -> 36,81]"
				}
			]
		},
		{
			"originalRange": "[63,64)",
			"modifiedRange": "[39,41)",
			"innerChanges": [
				{
					"originalRange": "[63,17 -> 63,22]",
					"modifiedRange": "[39,17 -> 39,29]"
				},
				{
					"originalRange": "[63,26 -> 63,44]",
					"modifiedRange": "[39,33 -> 40,36]"
				}
			]
		},
		{
			"originalRange": "[73,89)",
			"modifiedRange": "[50,51)",
			"innerChanges": [
				{
					"originalRange": "[73,15 -> 73,16]",
					"modifiedRange": "[50,15 -> 50,21]"
				},
				{
					"originalRange": "[73,19 -> 78,12]",
					"modifiedRange": "[50,24 -> 50,29]"
				},
				{
					"originalRange": "[78,15 -> 79,16]",
					"modifiedRange": "[50,32 -> 50,34]"
				},
				{
					"originalRange": "[79,19 -> 83,9]",
					"modifiedRange": "[50,37 -> 50,47]"
				},
				{
					"originalRange": "[83,12 -> 84,24]",
					"modifiedRange": "[50,50 -> 50,51]"
				},
				{
					"originalRange": "[84,52 -> 88,9]",
					"modifiedRange": "[50,79 -> 50,79]"
				}
			]
		},
		{
			"originalRange": "[91,92)",
			"modifiedRange": "[53,55)",
			"innerChanges": [
				{
					"originalRange": "[91,17 -> 91,22]",
					"modifiedRange": "[53,17 -> 53,29]"
				},
				{
					"originalRange": "[91,26 -> 91,44]",
					"modifiedRange": "[53,33 -> 54,36]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-diff-trimws/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-diff-trimws/1.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { workspace, WorkspaceFoldersChangeEvent, Uri, window, Event, EventEmitter, QuickPickItem, Disposable, SourceControl, SourceControlResourceGroup, TextEditor, Memento, commands, LogOutputChannel, l10n, ProgressLocation, WorkspaceFolder } from 'vscode';
import TelemetryReporter from '@vscode/extension-telemetry';
import { Repository, RepositoryState } from './repository';
import { memoize, sequentialize, debounce } from './decorators';
import { dispose, anyEvent, filterEvent, isDescendant, pathEquals, toDisposable, eventToPromise } from './util';
import { Git } from './git';
import * as path from 'path';
import * as fs from 'fs';
import { fromGitUri } from './uri';
import { APIState as State, CredentialsProvider, PushErrorHandler, PublishEvent, RemoteSourcePublisher, PostCommitCommandsProvider, BranchProtectionProvider } from './api/git';
import { Askpass } from './askpass';
import { IPushErrorHandlerRegistry } from './pushError';
import { ApiRepository } from './api/api1';
import { IRemoteSourcePublisherRegistry } from './remotePublisher';
import { IPostCommitCommandsProviderRegistry } from './postCommitCommands';
import { IBranchProtectionProviderRegistry } from './branchProtection';

class ClosedRepositoriesManager {

	private _repositories: Set<string>;
	get repositories(): string[] {
		return [...this._repositories.values()];
	}

	constructor(private readonly workspaceState: Memento) {
		this._repositories = new Set<string>(workspaceState.get<string[]>('closedRepositories', []));
		this.onDidChangeRepositories();
	}

	addRepository(repository: string): void {
		this._repositories.add(repository);
		this.onDidChangeRepositories();
	}

	deleteRepository(repository: string): boolean {
		const result = this._repositories.delete(repository);
		if (result) {
			this.onDidChangeRepositories();
		}

		return result;
	}

	isRepositoryClosed(repository: string): boolean {
		return this._repositories.has(repository);
	}

	private onDidChangeRepositories(): void {
		this.workspaceState.update('closedRepositories', [...this._repositories.values()]);
		commands.executeCommand('setContext', 'git.closedRepositoryCount', this._repositories.size);
	}
}

class ParentRepositoriesManager {

	/**
	 * Key   - normalized path used in user interface
	 * Value - value indicating whether the repository should be opened
	 */
	private _repositories = new Set<string>;
	get repositories(): string[] {
		return [...this._repositories.values()];
	}

	constructor(private readonly globalState: Memento) {
		this.onDidChangeRepositories();
	}

	addRepository(repository: string): void {
		this._repositories.add(repository);
		this.onDidChangeRepositories();
	}

	deleteRepository(repository: string): boolean {
		const result = this._repositories.delete(repository);
		if (result) {
			this.onDidChangeRepositories();
		}

		return result;
	}

	hasRepository(repository: string): boolean {
		return this._repositories.has(repository);
	}

	openRepository(repository: string): void {
		this.globalState.update(`parentRepository:${repository}`, true);
		this.deleteRepository(repository);
	}

	private onDidChangeRepositories(): void {
		commands.executeCommand('setContext', 'git.parentRepositoryCount', this._repositories.size);
	}
}

class UnsafeRepositoriesManager {

	/**
	 * Key   - normalized path used in user interface
	 * Value - path extracted from the output of the `git status` command
	 *         used when calling `git config --global --add safe.directory`
	 */
	private _repositories = new Map<string, string>();
	get repositories(): string[] {
		return [...this._repositories.keys()];
	}

	constructor() {
		this.onDidChangeRepositories();
	}

	addRepository(repository: string, path: string): void {
		this._repositories.set(repository, path);
		this.onDidChangeRepositories();
	}

	deleteRepository(repository: string): boolean {
		const result = this._repositories.delete(repository);
		if (result) {
			this.onDidChangeRepositories();
		}

		return result;
	}

	getRepositoryPath(repository: string): string | undefined {
		return this._repositories.get(repository);
	}

	hasRepository(repository: string): boolean {
		return this._repositories.has(repository);
	}

	private onDidChangeRepositories(): void {
		commands.executeCommand('setContext', 'git.unsafeRepositoryCount', this._repositories.size);
	}
}

export class Model implements IBranchProtectionProviderRegistry, IRemoteSourcePublisherRegistry, IPostCommitCommandsProviderRegistry, IPushErrorHandlerRegistry {

	private _onDidOpenRepository = new EventEmitter<Repository>();
	readonly onDidOpenRepository: Event<Repository> = this._onDidOpenRepository.event;

	private _onDidCloseRepository = new EventEmitter<Repository>();
	readonly onDidCloseRepository: Event<Repository> = this._onDidCloseRepository.event;

	private _onDidChangeRepository = new EventEmitter<ModelChangeEvent>();
	readonly onDidChangeRepository: Event<ModelChangeEvent> = this._onDidChangeRepository.event;

	private _onDidChangeOriginalResource = new EventEmitter<OriginalResourceChangeEvent>();
	readonly onDidChangeOriginalResource: Event<OriginalResourceChangeEvent> = this._onDidChangeOriginalResource.event;

	private openRepositories: OpenRepository[] = [];
	get repositories(): Repository[] { return this.openRepositories.map(r => r.repository); }

	private possibleGitRepositoryPaths = new Set<string>();

	private _onDidChangeState = new EventEmitter<State>();
	readonly onDidChangeState = this._onDidChangeState.event;

	private _onDidPublish = new EventEmitter<PublishEvent>();
	readonly onDidPublish = this._onDidPublish.event;

	firePublishEvent(repository: Repository, branch?: string) {
		this._onDidPublish.fire({ repository: new ApiRepository(repository), branch: branch });
	}

	private _state: State = 'uninitialized';
	get state(): State { return this._state; }

	setState(state: State): void {
		this._state = state;
		this._onDidChangeState.fire(state);
		commands.executeCommand('setContext', 'git.state', state);
	}

	@memoize
	get isInitialized(): Promise<void> {
		if (this._state === 'initialized') {
			return Promise.resolve();
		}

		return eventToPromise(filterEvent(this.onDidChangeState, s => s === 'initialized')) as Promise<any>;
	}

	private remoteSourcePublishers = new Set<RemoteSourcePublisher>();

	private _onDidAddRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();
	readonly onDidAddRemoteSourcePublisher = this._onDidAddRemoteSourcePublisher.event;

	private _onDidRemoveRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();
	readonly onDidRemoveRemoteSourcePublisher = this._onDidRemoveRemoteSourcePublisher.event;

	private postCommitCommandsProviders = new Set<PostCommitCommandsProvider>();

	private _onDidChangePostCommitCommandsProviders = new EventEmitter<void>();
	readonly onDidChangePostCommitCommandsProviders = this._onDidChangePostCommitCommandsProviders.event;

	private branchProtectionProviders = new Map<string, Set<BranchProtectionProvider>>();

	private _onDidChangeBranchProtectionProviders = new EventEmitter<Uri>();
	readonly onDidChangeBranchProtectionProviders = this._onDidChangeBranchProtectionProviders.event;

	private pushErrorHandlers = new Set<PushErrorHandler>();

	private _unsafeRepositoriesManager: UnsafeRepositoriesManager;
	get unsafeRepositories(): string[] {
		return this._unsafeRepositoriesManager.repositories;
	}

	private _parentRepositoriesManager: ParentRepositoriesManager;
	get parentRepositories(): string[] {
		return this._parentRepositoriesManager.repositories;
	}

	private _closedRepositoriesManager: ClosedRepositoriesManager;
	get closedRepositories(): string[] {
		return [...this._closedRepositoriesManager.repositories];
	}

	/**
	 * We maintain a map containing both the path and the canonical path of the
	 * workspace folders. We are doing this as `git.exe` expands the symbolic links
	 * while there are scenarios in which VS Code does not.
	 *
	 * Key   - path of the workspace folder
	 * Value - canonical path of the workspace folder
	 */
	private _workspaceFolders = new Map<string, string>();

	private disposables: Disposable[] = [];

	constructor(readonly git: Git, private readonly askpass: Askpass, private globalState: Memento, readonly workspaceState: Memento, private logger: LogOutputChannel, private telemetryReporter: TelemetryReporter) {
		// Repositories managers
		this._closedRepositoriesManager = new ClosedRepositoriesManager(workspaceState);
		this._parentRepositoriesManager = new ParentRepositoriesManager(globalState);
		this._unsafeRepositoriesManager = new UnsafeRepositoriesManager();

		workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders, this, this.disposables);
		window.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, this.disposables);
		workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.disposables);

		const fsWatcher = workspace.createFileSystemWatcher('**');
		this.disposables.push(fsWatcher);

		const onWorkspaceChange = anyEvent(fsWatcher.onDidChange, fsWatcher.onDidCreate, fsWatcher.onDidDelete);
		const onGitRepositoryChange = filterEvent(onWorkspaceChange, uri => /\/\.git/.test(uri.path));
		const onPossibleGitRepositoryChange = filterEvent(onGitRepositoryChange, uri => !this.getRepository(uri));
		onPossibleGitRepositoryChange(this.onPossibleGitRepositoryChange, this, this.disposables);

		this.setState('uninitialized');
		this.doInitialScan().finally(() => this.setState('initialized'));
	}

	private async doInitialScan(): Promise<void> {
		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');
		const parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');

		// Initial repository scan function
		const initialScanFn = () => Promise.all([
			this.onDidChangeWorkspaceFolders({ added: workspace.workspaceFolders || [], removed: [] }),
			this.onDidChangeVisibleTextEditors(window.visibleTextEditors),
			this.scanWorkspaceFolders()
		]);

		if (config.get<boolean>('showProgress', true)) {
			await window.withProgress({ location: ProgressLocation.SourceControl }, initialScanFn);
		} else {
			await initialScanFn();
		}

		if (this.parentRepositories.length !== 0 &&
			parentRepositoryConfig === 'prompt') {
			// Parent repositories notification
			this.showParentRepositoryNotification();
		} else if (this.unsafeRepositories.length !== 0) {
			// Unsafe repositories notification
			this.showUnsafeRepositoryNotification();
		}

		/* __GDPR__
			"git.repositoryInitialScan" : {
				"owner": "lszomoru",
				"autoRepositoryDetection": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Setting that controls the initial repository scan" },
				"repositoryCount": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Number of repositories opened during initial repository scan" }
			}
		*/
		this.telemetryReporter.sendTelemetryEvent('git.repositoryInitialScan', { autoRepositoryDetection: String(autoRepositoryDetection) }, { repositoryCount: this.openRepositories.length });
	}

	/**
	 * Scans each workspace folder, looking for git repositories. By
	 * default it scans one level deep but that can be changed using
	 * the git.repositoryScanMaxDepth setting.
	 */
	private async scanWorkspaceFolders(): Promise<void> {
		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');
		this.logger.trace(`[swsf] Scan workspace sub folders. autoRepositoryDetection=${autoRepositoryDetection}`);

		if (autoRepositoryDetection !== true && autoRepositoryDetection !== 'subFolders') {
			return;
		}

		await Promise.all((workspace.workspaceFolders || []).map(async folder => {
			const root = folder.uri.fsPath;
			this.logger.trace(`[swsf] Workspace folder: ${root}`);

			// Workspace folder children
			const repositoryScanMaxDepth = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<number>('repositoryScanMaxDepth', 1);
			const repositoryScanIgnoredFolders = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('repositoryScanIgnoredFolders', []);

			const subfolders = new Set(await this.traverseWorkspaceFolder(root, repositoryScanMaxDepth, repositoryScanIgnoredFolders));

			// Repository scan folders
			const scanPaths = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('scanRepositories') || [];
			this.logger.trace(`[swsf] Workspace scan settings: repositoryScanMaxDepth=${repositoryScanMaxDepth}; repositoryScanIgnoredFolders=[${repositoryScanIgnoredFolders.join(', ')}]; scanRepositories=[${scanPaths.join(', ')}]`);

			for (const scanPath of scanPaths) {
				if (scanPath === '.git') {
					this.logger.trace('[swsf] \'.git\' not supported in \'git.scanRepositories\' setting.');
					continue;
				}

				if (path.isAbsolute(scanPath)) {
					const notSupportedMessage = l10n.t('Absolute paths not supported in "git.scanRepositories" setting.');
					this.logger.warn(notSupportedMessage);
					console.warn(notSupportedMessage);
					continue;
				}

				subfolders.add(path.join(root, scanPath));
			}

			this.logger.trace(`[swsf] Workspace scan sub folders: [${[...subfolders].join(', ')}]`);
			await Promise.all([...subfolders].map(f => this.openRepository(f)));
		}));
	}

	private async traverseWorkspaceFolder(workspaceFolder: string, maxDepth: number, repositoryScanIgnoredFolders: string[]): Promise<string[]> {
		const result: string[] = [];
		const foldersToTravers = [{ path: workspaceFolder, depth: 0 }];

		while (foldersToTravers.length > 0) {
			const currentFolder = foldersToTravers.shift()!;

			if (currentFolder.depth < maxDepth || maxDepth === -1) {
				const children = await fs.promises.readdir(currentFolder.path, { withFileTypes: true });
				const childrenFolders = children
					.filter(dirent =>
						dirent.isDirectory() && dirent.name !== '.git' &&
						!repositoryScanIgnoredFolders.find(f => pathEquals(dirent.name, f)))
					.map(dirent => path.join(currentFolder.path, dirent.name));

				result.push(...childrenFolders);
				foldersToTravers.push(...childrenFolders.map(folder => {
					return { path: folder, depth: currentFolder.depth + 1 };
				}));
			}
		}

		return result;
	}

	private onPossibleGitRepositoryChange(uri: Uri): void {
		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');

		if (autoRepositoryDetection === false) {
			return;
		}

		this.eventuallyScanPossibleGitRepository(uri.fsPath.replace(/\.git.*$/, ''));
	}

	private eventuallyScanPossibleGitRepository(path: string) {
		this.possibleGitRepositoryPaths.add(path);
		this.eventuallyScanPossibleGitRepositories();
	}

	@debounce(500)
	private eventuallyScanPossibleGitRepositories(): void {
		for (const path of this.possibleGitRepositoryPaths) {
			this.openRepository(path);
		}

		this.possibleGitRepositoryPaths.clear();
	}

	private async onDidChangeWorkspaceFolders({ added, removed }: WorkspaceFoldersChangeEvent): Promise<void> {
		const possibleRepositoryFolders = added
			.filter(folder => !this.getOpenRepository(folder.uri));

		const activeRepositoriesList = window.visibleTextEditors
			.map(editor => this.getRepository(editor.document.uri))
			.filter(repository => !!repository) as Repository[];

		const activeRepositories = new Set<Repository>(activeRepositoriesList);
		const openRepositoriesToDispose = removed
			.map(folder => this.getOpenRepository(folder.uri))
			.filter(r => !!r)
			.filter(r => !activeRepositories.has(r!.repository))
			.filter(r => !(workspace.workspaceFolders || []).some(f => isDescendant(f.uri.fsPath, r!.repository.root))) as OpenRepository[];

		openRepositoriesToDispose.forEach(r => r.dispose());
		this.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);
		await Promise.all(possibleRepositoryFolders.map(p => this.openRepository(p.uri.fsPath)));
	}

	private onDidChangeConfiguration(): void {
		const possibleRepositoryFolders = (workspace.workspaceFolders || [])
			.filter(folder => workspace.getConfiguration('git', folder.uri).get<boolean>('enabled') === true)
			.filter(folder => !this.getOpenRepository(folder.uri));

		const openRepositoriesToDispose = this.openRepositories
			.map(repository => ({ repository, root: Uri.file(repository.repository.root) }))
			.filter(({ root }) => workspace.getConfiguration('git', root).get<boolean>('enabled') !== true)
			.map(({ repository }) => repository);

		this.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);
		possibleRepositoryFolders.forEach(p => this.openRepository(p.uri.fsPath));
		openRepositoriesToDispose.forEach(r => r.dispose());
	}

	private async onDidChangeVisibleTextEditors(editors: readonly TextEditor[]): Promise<void> {
		if (!workspace.isTrusted) {
			this.logger.trace('[svte] Workspace is not trusted.');
			return;
		}

		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');
		this.logger.trace(`[svte] Scan visible text editors. autoRepositoryDetection=${autoRepositoryDetection}`);

		if (autoRepositoryDetection !== true && autoRepositoryDetection !== 'openEditors') {
			return;
		}

		await Promise.all(editors.map(async editor => {
			const uri = editor.document.uri;

			if (uri.scheme !== 'file') {
				return;
			}

			const repository = this.getRepository(uri);

			if (repository) {
				this.logger.trace(`[svte] Repository for editor resource ${uri.fsPath} already exists: ${repository.root}`);
				return;
			}

			this.logger.trace(`[svte] Open repository for editor resource ${uri.fsPath}`);
			await this.openRepository(path.dirname(uri.fsPath));
		}));
	}

	@sequentialize
	async openRepository(repoPath: string, openIfClosed = false): Promise<void> {
		this.logger.trace(`Opening repository: ${repoPath}`);
		const existingRepository = await this.getRepositoryExact(repoPath);
		if (existingRepository) {
			this.logger.trace(`Repository for path ${repoPath} already exists: ${existingRepository.root})`);
			return;
		}

		const config = workspace.getConfiguration('git', Uri.file(repoPath));
		const enabled = config.get<boolean>('enabled') === true;

		if (!enabled) {
			this.logger.trace('Git is not enabled');
			return;
		}

		if (!workspace.isTrusted) {
			// Check if the folder is a bare repo: if it has a file named HEAD && `rev-parse --show -cdup` is empty
			try {
				fs.accessSync(path.join(repoPath, 'HEAD'), fs.constants.F_OK);
				const result = await this.git.exec(repoPath, ['-C', repoPath, 'rev-parse', '--show-cdup']);
				if (result.stderr.trim() === '' && result.stdout.trim() === '') {
					this.logger.trace(`Bare repository: ${repoPath}`);
					return;
				}
			} catch {
				// If this throw, we should be good to open the repo (e.g. HEAD doesn't exist)
			}
		}

		try {
			const { repositoryRoot, unsafeRepositoryMatch } = await this.getRepositoryRoot(repoPath);
			this.logger.trace(`Repository root for path ${repoPath} is: ${repositoryRoot}`);

			const existingRepository = await this.getRepositoryExact(repositoryRoot);
			if (existingRepository) {
				this.logger.trace(`Repository for path ${repositoryRoot} already exists: ${existingRepository.root}`);
				return;
			}

			if (this.shouldRepositoryBeIgnored(repositoryRoot)) {
				this.logger.trace(`Repository for path ${repositoryRoot} is ignored`);
				return;
			}

			// Handle git repositories that are in parent folders
			const parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');
			if (parentRepositoryConfig !== 'always' && this.globalState.get<boolean>(`parentRepository:${repositoryRoot}`) !== true) {
				const isRepositoryOutsideWorkspace = await this.isRepositoryOutsideWorkspace(repositoryRoot);
				if (isRepositoryOutsideWorkspace) {
					this.logger.trace(`Repository in parent folder: ${repositoryRoot}`);

					if (!this._parentRepositoriesManager.hasRepository(repositoryRoot)) {
						// Show a notification if the parent repository is opened after the initial scan
						if (this.state === 'initialized' && parentRepositoryConfig === 'prompt') {
							this.showParentRepositoryNotification();
						}

						this._parentRepositoriesManager.addRepository(repositoryRoot);
					}

					return;
				}
			}

			// Handle unsafe repositories
			if (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {
				this.logger.trace(`Unsafe repository: ${repositoryRoot}`);

				// Show a notification if the unsafe repository is opened after the initial scan
				if (this._state === 'initialized' && !this._unsafeRepositoriesManager.hasRepository(repositoryRoot)) {
					this.showUnsafeRepositoryNotification();
				}

				this._unsafeRepositoriesManager.addRepository(repositoryRoot, unsafeRepositoryMatch[2]);

				return;
			}

			// Handle repositories that were closed by the user
			if (!openIfClosed && this._closedRepositoriesManager.isRepositoryClosed(repositoryRoot)) {
				this.logger.trace(`Repository for path ${repositoryRoot} is closed`);
				return;
			}

			// Open repository
			const dotGit = await this.git.getRepositoryDotGit(repositoryRoot);
			const repository = new Repository(this.git.open(repositoryRoot, dotGit, this.logger), this, this, this, this, this.globalState, this.logger, this.telemetryReporter);

			this.open(repository);
			this._closedRepositoriesManager.deleteRepository(repository.root);

			// Do not await this, we want SCM
			// to know about the repo asap
			repository.status();
		} catch (err) {
			// noop
			this.logger.trace(`Opening repository for path='${repoPath}' failed; ex=${err}`);
		}
	}

	async openParentRepository(repoPath: string): Promise<void> {
		await this.openRepository(repoPath);
		this._parentRepositoriesManager.openRepository(repoPath);
	}

	private async getRepositoryRoot(repoPath: string): Promise<{ repositoryRoot: string; unsafeRepositoryMatch: RegExpMatchArray | null }> {
		try {
			const rawRoot = await this.git.getRepositoryRoot(repoPath);

			// This can happen whenever `path` has the wrong case sensitivity in case
			// insensitive file systems https://github.com/microsoft/vscode/issues/33498
			return { repositoryRoot: Uri.file(rawRoot).fsPath, unsafeRepositoryMatch: null };
		} catch (err) {
			// Handle unsafe repository
			const unsafeRepositoryMatch = /^fatal: detected dubious ownership in repository at \'([^']+)\'[\s\S]*git config --global --add safe\.directory '?([^'\n]+)'?$/m.exec(err.stderr);
			if (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {
				return { repositoryRoot: path.normalize(unsafeRepositoryMatch[1]), unsafeRepositoryMatch };
			}

			throw err;
		}
	}

	private shouldRepositoryBeIgnored(repositoryRoot: string): boolean {
		const config = workspace.getConfiguration('git');
		const ignoredRepos = config.get<string[]>('ignoredRepositories') || [];

		for (const ignoredRepo of ignoredRepos) {
			if (path.isAbsolute(ignoredRepo)) {
				if (pathEquals(ignoredRepo, repositoryRoot)) {
					return true;
				}
			} else {
				for (const folder of workspace.workspaceFolders || []) {
					if (pathEquals(path.join(folder.uri.fsPath, ignoredRepo), repositoryRoot)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	private open(repository: Repository): void {
		this.logger.info(`Open repository: ${repository.root}`);

		const onDidDisappearRepository = filterEvent(repository.onDidChangeState, state => state === RepositoryState.Disposed);
		const disappearListener = onDidDisappearRepository(() => dispose());
		const changeListener = repository.onDidChangeRepository(uri => this._onDidChangeRepository.fire({ repository, uri }));
		const originalResourceChangeListener = repository.onDidChangeOriginalResource(uri => this._onDidChangeOriginalResource.fire({ repository, uri }));

		const shouldDetectSubmodules = workspace
			.getConfiguration('git', Uri.file(repository.root))
			.get<boolean>('detectSubmodules') as boolean;

		const submodulesLimit = workspace
			.getConfiguration('git', Uri.file(repository.root))
			.get<number>('detectSubmodulesLimit') as number;

		const checkForSubmodules = () => {
			if (!shouldDetectSubmodules) {
				this.logger.trace('Automatic detection of git submodules is not enabled.');
				return;
			}

			if (repository.submodules.length > submodulesLimit) {
				window.showWarningMessage(l10n.t('The "{0}" repository has {1} submodules which won\'t be opened automatically. You can still open each one individually by opening a file within.', path.basename(repository.root), repository.submodules.length));
				statusListener.dispose();
			}

			repository.submodules
				.slice(0, submodulesLimit)
				.map(r => path.join(repository.root, r.path))
				.forEach(p => {
					this.logger.trace(`Opening submodule: '${p}'`);
					this.eventuallyScanPossibleGitRepository(p);
				});
		};

		const updateMergeChanges = () => {
			// set mergeChanges context
			const mergeChanges: Uri[] = [];
			for (const { repository } of this.openRepositories.values()) {
				for (const state of repository.mergeGroup.resourceStates) {
					mergeChanges.push(state.resourceUri);
				}
			}
			commands.executeCommand('setContext', 'git.mergeChanges', mergeChanges);
		};

		const statusListener = repository.onDidRunGitStatus(() => {
			checkForSubmodules();
			updateMergeChanges();
		});
		checkForSubmodules();

		const updateOperationInProgressContext = () => {
			let operationInProgress = false;
			for (const { repository } of this.openRepositories.values()) {
				if (repository.operations.shouldDisableCommands()) {
					operationInProgress = true;
				}
			}

			commands.executeCommand('setContext', 'operationInProgress', operationInProgress);
		};

		const operationEvent = anyEvent(repository.onDidRunOperation as Event<any>, repository.onRunOperation as Event<any>);
		const operationListener = operationEvent(() => updateOperationInProgressContext());
		updateOperationInProgressContext();

		const dispose = () => {
			disappearListener.dispose();
			changeListener.dispose();
			originalResourceChangeListener.dispose();
			statusListener.dispose();
			operationListener.dispose();
			repository.dispose();

			this.openRepositories = this.openRepositories.filter(e => e !== openRepository);
			this._onDidCloseRepository.fire(repository);
		};

		const openRepository = { repository, dispose };
		this.openRepositories.push(openRepository);
		updateMergeChanges();
		this._onDidOpenRepository.fire(repository);
	}

	close(repository: Repository): void {
		const openRepository = this.getOpenRepository(repository);

		if (!openRepository) {
			return;
		}

		this.logger.info(`Close repository: ${repository.root}`);
		this._closedRepositoriesManager.addRepository(openRepository.repository.root);

		openRepository.dispose();
	}

	async pickRepository(): Promise<Repository | undefined> {
		if (this.openRepositories.length === 0) {
			throw new Error(l10n.t('There are no available repositories'));
		}

		const picks = this.openRepositories.map((e, index) => new RepositoryPick(e.repository, index));
		const active = window.activeTextEditor;
		const repository = active && this.getRepository(active.document.fileName);
		const index = picks.findIndex(pick => pick.repository === repository);

		// Move repository pick containing the active text editor to appear first
		if (index > -1) {
			picks.unshift(...picks.splice(index, 1));
		}

		const placeHolder = l10n.t('Choose a repository');
		const pick = await window.showQuickPick(picks, { placeHolder });

		return pick && pick.repository;
	}

	getRepository(sourceControl: SourceControl): Repository | undefined;
	getRepository(resourceGroup: SourceControlResourceGroup): Repository | undefined;
	getRepository(path: string): Repository | undefined;
	getRepository(resource: Uri): Repository | undefined;
	getRepository(hint: any): Repository | undefined {
		const liveRepository = this.getOpenRepository(hint);
		return liveRepository && liveRepository.repository;
	}

	private async getRepositoryExact(repoPath: string): Promise<Repository | undefined> {
		const repoPathCanonical = await fs.promises.realpath(repoPath, { encoding: 'utf8' });
		const openRepository = this.openRepositories.find(async r => {
			const rootPathCanonical = await fs.promises.realpath(r.repository.root, { encoding: 'utf8' });
			return pathEquals(rootPathCanonical, repoPathCanonical);
		});
		return openRepository?.repository;
	}

	private getOpenRepository(repository: Repository): OpenRepository | undefined;
	private getOpenRepository(sourceControl: SourceControl): OpenRepository | undefined;
	private getOpenRepository(resourceGroup: SourceControlResourceGroup): OpenRepository | undefined;
	private getOpenRepository(path: string): OpenRepository | undefined;
	private getOpenRepository(resource: Uri): OpenRepository | undefined;
	private getOpenRepository(hint: any): OpenRepository | undefined {
		if (!hint) {
			return undefined;
		}

		if (hint instanceof Repository) {
			return this.openRepositories.filter(r => r.repository === hint)[0];
		}

		if (hint instanceof ApiRepository) {
			return this.openRepositories.filter(r => r.repository === hint.repository)[0];
		}

		if (typeof hint === 'string') {
			hint = Uri.file(hint);
		}

		if (hint instanceof Uri) {
			let resourcePath: string;

			if (hint.scheme === 'git') {
				resourcePath = fromGitUri(hint).path;
			} else {
				resourcePath = hint.fsPath;
			}

			outer:
			for (const liveRepository of this.openRepositories.sort((a, b) => b.repository.root.length - a.repository.root.length)) {
				if (!isDescendant(liveRepository.repository.root, resourcePath)) {
					continue;
				}

				for (const submodule of liveRepository.repository.submodules) {
					const submoduleRoot = path.join(liveRepository.repository.root, submodule.path);

					if (isDescendant(submoduleRoot, resourcePath)) {
						continue outer;
					}
				}

				return liveRepository;
			}

			return undefined;
		}

		for (const liveRepository of this.openRepositories) {
			const repository = liveRepository.repository;

			if (hint === repository.sourceControl) {
				return liveRepository;
			}

			if (hint === repository.mergeGroup || hint === repository.indexGroup || hint === repository.workingTreeGroup || hint === repository.untrackedGroup) {
				return liveRepository;
			}
		}

		return undefined;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-diff-trimws/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-diff-trimws/2.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { workspace, WorkspaceFoldersChangeEvent, Uri, window, Event, EventEmitter, QuickPickItem, Disposable, SourceControl, SourceControlResourceGroup, TextEditor, Memento, commands, LogOutputChannel, l10n, ProgressLocation, WorkspaceFolder } from 'vscode';
import TelemetryReporter from '@vscode/extension-telemetry';
import { Repository, RepositoryState } from './repository';
import { memoize, sequentialize, debounce } from './decorators';
import { dispose, anyEvent, filterEvent, isDescendant, pathEquals, toDisposable, eventToPromise } from './util';
import { Git } from './git';
import * as path from 'path';
import * as fs from 'fs';
import { fromGitUri } from './uri';
import { APIState as State, CredentialsProvider, PushErrorHandler, PublishEvent, RemoteSourcePublisher, PostCommitCommandsProvider, BranchProtectionProvider } from './api/git';
import { Askpass } from './askpass';
import { IPushErrorHandlerRegistry } from './pushError';
import { ApiRepository } from './api/api1';
import { IRemoteSourcePublisherRegistry } from './remotePublisher';
import { IPostCommitCommandsProviderRegistry } from './postCommitCommands';
import { IBranchProtectionProviderRegistry } from './branchProtection';

class ClosedRepositoriesManager {

	private _repositories: Set<string>;
	get repositories(): string[] {
		return [...this._repositories.values()];
	}

	constructor(private readonly workspaceState: Memento) {
		this._repositories = new Set<string>(workspaceState.get<string[]>('closedRepositories', []));
		this.onDidChangeRepositories();
	}

	addRepository(repository: string): void {
		this._repositories.add(repository);
		this.onDidChangeRepositories();
	}

	deleteRepository(repository: string): boolean {
		const result = this._repositories.delete(repository);
		if (result) {
			this.onDidChangeRepositories();
		}

		return result;
	}

	isRepositoryClosed(repository: string): boolean {
		return this._repositories.has(repository);
	}

	private onDidChangeRepositories(): void {
		this.workspaceState.update('closedRepositories', [...this._repositories.values()]);
		commands.executeCommand('setContext', 'git.closedRepositoryCount', this._repositories.size);
	}
}

class ParentRepositoriesManager {

	/**
	 * Key   - normalized path used in user interface
	 * Value - value indicating whether the repository should be opened
	 */
	private _repositories = new Set<string>;
	get repositories(): string[] {
		return [...this._repositories.values()];
	}

	constructor(private readonly globalState: Memento) {
		this.onDidChangeRepositories();
	}

	addRepository(repository: string): void {
		this._repositories.add(repository);
		this.onDidChangeRepositories();
	}

	deleteRepository(repository: string): boolean {
		const result = this._repositories.delete(repository);
		if (result) {
			this.onDidChangeRepositories();
		}

		return result;
	}

	hasRepository(repository: string): boolean {
		return this._repositories.has(repository);
	}

	openRepository(repository: string): void {
		this.globalState.update(`parentRepository:${repository}`, true);
		this.deleteRepository(repository);
	}

	private onDidChangeRepositories(): void {
		commands.executeCommand('setContext', 'git.parentRepositoryCount', this._repositories.size);
	}
}

class UnsafeRepositoriesManager {

	/**
	 * Key   - normalized path used in user interface
	 * Value - path extracted from the output of the `git status` command
	 *         used when calling `git config --global --add safe.directory`
	 */
	private _repositories = new Map<string, string>();
	get repositories(): string[] {
		return [...this._repositories.keys()];
	}

	constructor() {
		this.onDidChangeRepositories();
	}

	addRepository(repository: string, path: string): void {
		this._repositories.set(repository, path);
		this.onDidChangeRepositories();
	}

	deleteRepository(repository: string): boolean {
		const result = this._repositories.delete(repository);
		if (result) {
			this.onDidChangeRepositories();
		}

		return result;
	}

	getRepositoryPath(repository: string): string | undefined {
		return this._repositories.get(repository);
	}

	hasRepository(repository: string): boolean {
		return this._repositories.has(repository);
	}

	private onDidChangeRepositories(): void {
		commands.executeCommand('setContext', 'git.unsafeRepositoryCount', this._repositories.size);
	}
}

export class Model implements IBranchProtectionProviderRegistry, IRemoteSourcePublisherRegistry, IPostCommitCommandsProviderRegistry, IPushErrorHandlerRegistry {

	private _onDidOpenRepository = new EventEmitter<Repository>();
	readonly onDidOpenRepository: Event<Repository> = this._onDidOpenRepository.event;

	private _onDidCloseRepository = new EventEmitter<Repository>();
	readonly onDidCloseRepository: Event<Repository> = this._onDidCloseRepository.event;

	private _onDidChangeRepository = new EventEmitter<ModelChangeEvent>();
	readonly onDidChangeRepository: Event<ModelChangeEvent> = this._onDidChangeRepository.event;

	private _onDidChangeOriginalResource = new EventEmitter<OriginalResourceChangeEvent>();
	readonly onDidChangeOriginalResource: Event<OriginalResourceChangeEvent> = this._onDidChangeOriginalResource.event;

	private openRepositories: OpenRepository[] = [];
	get repositories(): Repository[] { return this.openRepositories.map(r => r.repository); }

	private possibleGitRepositoryPaths = new Set<string>();

	private _onDidChangeState = new EventEmitter<State>();
	readonly onDidChangeState = this._onDidChangeState.event;

	private _onDidPublish = new EventEmitter<PublishEvent>();
	readonly onDidPublish = this._onDidPublish.event;

	firePublishEvent(repository: Repository, branch?: string) {
		this._onDidPublish.fire({ repository: new ApiRepository(repository), branch: branch });
	}

	private _state: State = 'uninitialized';
	get state(): State { return this._state; }

	setState(state: State): void {
		this._state = state;
		this._onDidChangeState.fire(state);
		commands.executeCommand('setContext', 'git.state', state);
	}

	@memoize
	get isInitialized(): Promise<void> {
		if (this._state === 'initialized') {
			return Promise.resolve();
		}

		return eventToPromise(filterEvent(this.onDidChangeState, s => s === 'initialized')) as Promise<any>;
	}

	private remoteSourcePublishers = new Set<RemoteSourcePublisher>();

	private _onDidAddRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();
	readonly onDidAddRemoteSourcePublisher = this._onDidAddRemoteSourcePublisher.event;

	private _onDidRemoveRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();
	readonly onDidRemoveRemoteSourcePublisher = this._onDidRemoveRemoteSourcePublisher.event;

	private postCommitCommandsProviders = new Set<PostCommitCommandsProvider>();

	private _onDidChangePostCommitCommandsProviders = new EventEmitter<void>();
	readonly onDidChangePostCommitCommandsProviders = this._onDidChangePostCommitCommandsProviders.event;

	private branchProtectionProviders = new Map<string, Set<BranchProtectionProvider>>();

	private _onDidChangeBranchProtectionProviders = new EventEmitter<Uri>();
	readonly onDidChangeBranchProtectionProviders = this._onDidChangeBranchProtectionProviders.event;

	private pushErrorHandlers = new Set<PushErrorHandler>();

	private _unsafeRepositoriesManager: UnsafeRepositoriesManager;
	get unsafeRepositories(): string[] {
		return this._unsafeRepositoriesManager.repositories;
	}

	private _parentRepositoriesManager: ParentRepositoriesManager;
	get parentRepositories(): string[] {
		return this._parentRepositoriesManager.repositories;
	}

	private _closedRepositoriesManager: ClosedRepositoriesManager;
	get closedRepositories(): string[] {
		return [...this._closedRepositoriesManager.repositories];
	}

	/**
	 * We maintain a map containing both the path and the canonical path of the
	 * workspace folders. We are doing this as `git.exe` expands the symbolic links
	 * while there are scenarios in which VS Code does not.
	 *
	 * Key   - path of the workspace folder
	 * Value - canonical path of the workspace folder
	 */
	private _workspaceFolders = new Map<string, string>();

	private disposables: Disposable[] = [];

	constructor(readonly git: Git, private readonly askpass: Askpass, private globalState: Memento, readonly workspaceState: Memento, private logger: LogOutputChannel, private telemetryReporter: TelemetryReporter) {
		// Repositories managers
		this._closedRepositoriesManager = new ClosedRepositoriesManager(workspaceState);
		this._parentRepositoriesManager = new ParentRepositoriesManager(globalState);
		this._unsafeRepositoriesManager = new UnsafeRepositoriesManager();

		workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders, this, this.disposables);
		window.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, this.disposables);
		workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.disposables);

		const fsWatcher = workspace.createFileSystemWatcher('**');
		this.disposables.push(fsWatcher);

		const onWorkspaceChange = anyEvent(fsWatcher.onDidChange, fsWatcher.onDidCreate, fsWatcher.onDidDelete);
		const onGitRepositoryChange = filterEvent(onWorkspaceChange, uri => /\/\.git/.test(uri.path));
		const onPossibleGitRepositoryChange = filterEvent(onGitRepositoryChange, uri => !this.getRepository(uri));
		onPossibleGitRepositoryChange(this.onPossibleGitRepositoryChange, this, this.disposables);

		this.setState('uninitialized');
		this.doInitialScan().finally(() => this.setState('initialized'));
	}

	private async doInitialScan(): Promise<void> {
		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');
		const parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');

		// Initial repository scan function
		const initialScanFn = () => Promise.all([
			this.onDidChangeWorkspaceFolders({ added: workspace.workspaceFolders || [], removed: [] }),
			this.onDidChangeVisibleTextEditors(window.visibleTextEditors),
			this.scanWorkspaceFolders()
		]);

		if (config.get<boolean>('showProgress', true)) {
			await window.withProgress({ location: ProgressLocation.SourceControl }, initialScanFn);
		} else {
			await initialScanFn();
		}

		if (this.parentRepositories.length !== 0 &&
			parentRepositoryConfig === 'prompt') {
			// Parent repositories notification
			this.showParentRepositoryNotification();
		} else if (this.unsafeRepositories.length !== 0) {
			// Unsafe repositories notification
			this.showUnsafeRepositoryNotification();
		}

		/* __GDPR__
			"git.repositoryInitialScan" : {
				"owner": "lszomoru",
				"autoRepositoryDetection": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Setting that controls the initial repository scan" },
				"repositoryCount": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Number of repositories opened during initial repository scan" }
			}
		*/
		this.telemetryReporter.sendTelemetryEvent('git.repositoryInitialScan', { autoRepositoryDetection: String(autoRepositoryDetection) }, { repositoryCount: this.openRepositories.length });
	}

	/**
	 * Scans each workspace folder, looking for git repositories. By
	 * default it scans one level deep but that can be changed using
	 * the git.repositoryScanMaxDepth setting.
	 */
	private async scanWorkspaceFolders(): Promise<void> {
		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');
		this.logger.trace(`[swsf] Scan workspace sub folders. autoRepositoryDetection=${autoRepositoryDetection}`);

		if (autoRepositoryDetection !== true && autoRepositoryDetection !== 'subFolders') {
			return;
		}

		await Promise.all((workspace.workspaceFolders || []).map(async folder => {
			const root = folder.uri.fsPath;
			this.logger.trace(`[swsf] Workspace folder: ${root}`);

			// Workspace folder children
			const repositoryScanMaxDepth = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<number>('repositoryScanMaxDepth', 1);
			const repositoryScanIgnoredFolders = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('repositoryScanIgnoredFolders', []);

			const subfolders = new Set(await this.traverseWorkspaceFolder(root, repositoryScanMaxDepth, repositoryScanIgnoredFolders));

			// Repository scan folders
			const scanPaths = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('scanRepositories') || [];
			this.logger.trace(`[swsf] Workspace scan settings: repositoryScanMaxDepth=${repositoryScanMaxDepth}; repositoryScanIgnoredFolders=[${repositoryScanIgnoredFolders.join(', ')}]; scanRepositories=[${scanPaths.join(', ')}]`);

			for (const scanPath of scanPaths) {
				if (scanPath === '.git') {
					this.logger.trace('[swsf] \'.git\' not supported in \'git.scanRepositories\' setting.');
					continue;
				}

				if (path.isAbsolute(scanPath)) {
					const notSupportedMessage = l10n.t('Absolute paths not supported in "git.scanRepositories" setting.');
					this.logger.warn(notSupportedMessage);
					console.warn(notSupportedMessage);
					continue;
				}

				subfolders.add(path.join(root, scanPath));
			}

			this.logger.trace(`[swsf] Workspace scan sub folders: [${[...subfolders].join(', ')}]`);
			await Promise.all([...subfolders].map(f => this.openRepository(f)));
		}));
	}

	private async traverseWorkspaceFolder(workspaceFolder: string, maxDepth: number, repositoryScanIgnoredFolders: string[]): Promise<string[]> {
		const result: string[] = [];
		const foldersToTravers = [{ path: workspaceFolder, depth: 0 }];

		while (foldersToTravers.length > 0) {
			const currentFolder = foldersToTravers.shift()!;

			if (currentFolder.depth < maxDepth || maxDepth === -1) {
				const children = await fs.promises.readdir(currentFolder.path, { withFileTypes: true });
				const childrenFolders = children
					.filter(dirent =>
						dirent.isDirectory() && dirent.name !== '.git' &&
						!repositoryScanIgnoredFolders.find(f => pathEquals(dirent.name, f)))
					.map(dirent => path.join(currentFolder.path, dirent.name));

				result.push(...childrenFolders);
				foldersToTravers.push(...childrenFolders.map(folder => {
					return { path: folder, depth: currentFolder.depth + 1 };
				}));
			}
		}

		return result;
	}

	private onPossibleGitRepositoryChange(uri: Uri): void {
		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');

		if (autoRepositoryDetection === false) {
			return;
		}

		this.eventuallyScanPossibleGitRepository(uri.fsPath.replace(/\.git.*$/, ''));
	}

	private eventuallyScanPossibleGitRepository(path: string) {
		this.possibleGitRepositoryPaths.add(path);
		this.eventuallyScanPossibleGitRepositories();
	}

	@debounce(500)
	private eventuallyScanPossibleGitRepositories(): void {
		for (const path of this.possibleGitRepositoryPaths) {
			this.openRepository(path);
		}

		this.possibleGitRepositoryPaths.clear();
	}

	private async onDidChangeWorkspaceFolders({ added, removed }: WorkspaceFoldersChangeEvent): Promise<void> {
		const possibleRepositoryFolders = added
			.filter(folder => !this.getOpenRepository(folder.uri));

		const activeRepositoriesList = window.visibleTextEditors
			.map(editor => this.getRepository(editor.document.uri))
			.filter(repository => !!repository) as Repository[];

		const activeRepositories = new Set<Repository>(activeRepositoriesList);
		const openRepositoriesToDispose = removed
			.map(folder => this.getOpenRepository(folder.uri))
			.filter(r => !!r)
			.filter(r => !activeRepositories.has(r!.repository))
			.filter(r => !(workspace.workspaceFolders || []).some(f => isDescendant(f.uri.fsPath, r!.repository.root))) as OpenRepository[];

		openRepositoriesToDispose.forEach(r => r.dispose());
		this.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);
		await Promise.all(possibleRepositoryFolders.map(p => this.openRepository(p.uri.fsPath)));
	}

	private onDidChangeConfiguration(): void {
		const possibleRepositoryFolders = (workspace.workspaceFolders || [])
			.filter(folder => workspace.getConfiguration('git', folder.uri).get<boolean>('enabled') === true)
			.filter(folder => !this.getOpenRepository(folder.uri));

		const openRepositoriesToDispose = this.openRepositories
			.map(repository => ({ repository, root: Uri.file(repository.repository.root) }))
			.filter(({ root }) => workspace.getConfiguration('git', root).get<boolean>('enabled') !== true)
			.map(({ repository }) => repository);

		this.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);
		possibleRepositoryFolders.forEach(p => this.openRepository(p.uri.fsPath));
		openRepositoriesToDispose.forEach(r => r.dispose());
	}

	private async onDidChangeVisibleTextEditors(editors: readonly TextEditor[]): Promise<void> {
		if (!workspace.isTrusted) {
			this.logger.trace('[svte] Workspace is not trusted.');
			return;
		}

		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');
		this.logger.trace(`[svte] Scan visible text editors. autoRepositoryDetection=${autoRepositoryDetection}`);

		if (autoRepositoryDetection !== true && autoRepositoryDetection !== 'openEditors') {
			return;
		}

		await Promise.all(editors.map(async editor => {
			const uri = editor.document.uri;

			if (uri.scheme !== 'file') {
				return;
			}

			const repository = this.getRepository(uri);

			if (repository) {
				this.logger.trace(`[svte] Repository for editor resource ${uri.fsPath} already exists: ${repository.root}`);
				return;
			}

			this.logger.trace(`[svte] Open repository for editor resource ${uri.fsPath}`);
			await this.openRepository(path.dirname(uri.fsPath));
		}));
	}

	@sequentialize
	async openRepository(repoPath: string, openIfClosed = false): Promise<void> {
		this.logger.trace(`Opening repository: ${repoPath}`);
		const existingRepository = await this.getRepositoryExact(repoPath);
		if (existingRepository) {
			this.logger.trace(`Repository for path ${repoPath} already exists: ${existingRepository.root})`);
			return;
		}

		const config = workspace.getConfiguration('git', Uri.file(repoPath));
		const enabled = config.get<boolean>('enabled') === true;

		if (!enabled) {
			this.logger.trace('Git is not enabled');
			return;
		}

		if (!workspace.isTrusted) {
			// Check if the folder is a bare repo: if it has a file named HEAD && `rev-parse --show -cdup` is empty
			try {
				fs.accessSync(path.join(repoPath, 'HEAD'), fs.constants.F_OK);
				const result = await this.git.exec(repoPath, ['-C', repoPath, 'rev-parse', '--show-cdup']);
				if (result.stderr.trim() === '' && result.stdout.trim() === '') {
					this.logger.trace(`Bare repository: ${repoPath}`);
					return;
				}
			} catch {
				// If this throw, we should be good to open the repo (e.g. HEAD doesn't exist)
			}
		}

		try {
			const { repositoryRoot, unsafeRepositoryMatch } = await this.getRepositoryRoot(repoPath);
			this.logger.trace(`Repository root for path ${repoPath} is: ${repositoryRoot}`);

			const existingRepository = await this.getRepositoryExact(repositoryRoot);
			if (existingRepository) {
				this.logger.trace(`Repository for path ${repositoryRoot} already exists: ${existingRepository.root}`);
				return;
			}

			if (this.shouldRepositoryBeIgnored(repositoryRoot)) {
				this.logger.trace(`Repository for path ${repositoryRoot} is ignored`);
				return;
			}

			// Handle git repositories that are in parent folders
			const parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');
			if (parentRepositoryConfig !== 'always' && this.globalState.get<boolean>(`parentRepository:${repositoryRoot}`) !== true) {
				const isRepositoryOutsideWorkspace = await this.isRepositoryOutsideWorkspace(repositoryRoot);
				if (isRepositoryOutsideWorkspace) {
					this.logger.trace(`Repository in parent folder: ${repositoryRoot}`);

					if (!this._parentRepositoriesManager.hasRepository(repositoryRoot)) {
						// Show a notification if the parent repository is opened after the initial scan
						if (this.state === 'initialized' && parentRepositoryConfig === 'prompt') {
							this.showParentRepositoryNotification();
						}

						this._parentRepositoriesManager.addRepository(repositoryRoot);
					}

					return;
				}
			}

			// Handle unsafe repositories
			if (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {
				this.logger.trace(`Unsafe repository: ${repositoryRoot}`);

				// Show a notification if the unsafe repository is opened after the initial scan
				if (this._state === 'initialized' && !this._unsafeRepositoriesManager.hasRepository(repositoryRoot)) {
					this.showUnsafeRepositoryNotification();
				}

				this._unsafeRepositoriesManager.addRepository(repositoryRoot, unsafeRepositoryMatch[2]);

				return;
			}

			// Handle repositories that were closed by the user
			if (!openIfClosed && this._closedRepositoriesManager.isRepositoryClosed(repositoryRoot)) {
				this.logger.trace(`Repository for path ${repositoryRoot} is closed`);
				return;
			}

			// Open repository
			const dotGit = await this.git.getRepositoryDotGit(repositoryRoot);
			const repository = new Repository(this.git.open(repositoryRoot, dotGit, this.logger), this, this, this, this, this.globalState, this.logger, this.telemetryReporter);

			this.open(repository);
			this._closedRepositoriesManager.deleteRepository(repository.root);

			// Do not await this, we want SCM
			// to know about the repo asap
			repository.status();
		} catch (err) {
			// noop
			this.logger.trace(`Opening repository for path='${repoPath}' failed; ex=${err}`);
		}
	}

	async openParentRepository(repoPath: string): Promise<void> {
		await this.openRepository(repoPath);
		this._parentRepositoriesManager.openRepository(repoPath);
	}

	private async getRepositoryRoot(repoPath: string): Promise<{ repositoryRoot: string; unsafeRepositoryMatch: RegExpMatchArray | null }> {
		try {
			const rawRoot = await this.git.getRepositoryRoot(repoPath);

			// This can happen whenever `path` has the wrong case sensitivity in case
			// insensitive file systems https://github.com/microsoft/vscode/issues/33498
			return { repositoryRoot: Uri.file(rawRoot).fsPath, unsafeRepositoryMatch: null };
		} catch (err) {
			// Handle unsafe repository
			const unsafeRepositoryMatch = /^fatal: detected dubious ownership in repository at \'([^']+)\'[\s\S]*git config --global --add safe\.directory '?([^'\n]+)'?$/m.exec(err.stderr);
			if (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {
				return { repositoryRoot: path.normalize(unsafeRepositoryMatch[1]), unsafeRepositoryMatch };
			}

			throw err;
		}
	}

	private shouldRepositoryBeIgnored(repositoryRoot: string): boolean {
		const config = workspace.getConfiguration('git');
		const ignoredRepos = config.get<string[]>('ignoredRepositories') || [];

		for (const ignoredRepo of ignoredRepos) {
			if (path.isAbsolute(ignoredRepo)) {
				if (pathEquals(ignoredRepo, repositoryRoot)) {
					return true;
				}
			} else {
				for (const folder of workspace.workspaceFolders || []) {
					if (pathEquals(path.join(folder.uri.fsPath, ignoredRepo), repositoryRoot)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	private open(repository: Repository): void {
		this.logger.info(`Open repository: ${repository.root}`);

		const onDidDisappearRepository = filterEvent(repository.onDidChangeState, state => state === RepositoryState.Disposed);
		const disappearListener = onDidDisappearRepository(() => dispose());
		const changeListener = repository.onDidChangeRepository(uri => this._onDidChangeRepository.fire({ repository, uri }));
		const originalResourceChangeListener = repository.onDidChangeOriginalResource(uri => this._onDidChangeOriginalResource.fire({ repository, uri }));

		const shouldDetectSubmodules = workspace
			.getConfiguration('git', Uri.file(repository.root))
			.get<boolean>('detectSubmodules') as boolean;

		const submodulesLimit = workspace
			.getConfiguration('git', Uri.file(repository.root))
			.get<number>('detectSubmodulesLimit') as number;

		const checkForSubmodules = () => {
			if (!shouldDetectSubmodules) {
				this.logger.trace('Automatic detection of git submodules is not enabled.');
				return;
			}

			if (repository.submodules.length > submodulesLimit) {
				window.showWarningMessage(l10n.t('The "{0}" repository has {1} submodules which won\'t be opened automatically. You can still open each one individually by opening a file within.', path.basename(repository.root), repository.submodules.length));
				statusListener.dispose();
			}

			repository.submodules
				.slice(0, submodulesLimit)
				.map(r => path.join(repository.root, r.path))
				.forEach(p => {
					this.logger.trace(`Opening submodule: '${p}'`);
					this.eventuallyScanPossibleGitRepository(p);
				});
		};

		const updateMergeChanges = () => {
			// set mergeChanges context
			const mergeChanges: Uri[] = [];
			for (const { repository } of this.openRepositories.values()) {
				for (const state of repository.mergeGroup.resourceStates) {
					mergeChanges.push(state.resourceUri);
				}
			}
			commands.executeCommand('setContext', 'git.mergeChanges', mergeChanges);
		};

		const statusListener = repository.onDidRunGitStatus(() => {
			checkForSubmodules();
			updateMergeChanges();
		});
		checkForSubmodules();

		const updateOperationInProgressContext = () => {
			let operationInProgress = false;
			for (const { repository } of this.openRepositories.values()) {
				if (repository.operations.shouldDisableCommands()) {
					operationInProgress = true;
				}
			}

			commands.executeCommand('setContext', 'operationInProgress', operationInProgress);
		};

		const operationEvent = anyEvent(repository.onDidRunOperation as Event<any>, repository.onRunOperation as Event<any>);
		const operationListener = operationEvent(() => updateOperationInProgressContext());
		updateOperationInProgressContext();

		const dispose = () => {
			disappearListener.dispose();
			changeListener.dispose();
			originalResourceChangeListener.dispose();
			statusListener.dispose();
			operationListener.dispose();
			repository.dispose();

			this.openRepositories = this.openRepositories.filter(e => e !== openRepository);
			this._onDidCloseRepository.fire(repository);
		};

		const openRepository = { repository, dispose };
		this.openRepositories.push(openRepository);
		updateMergeChanges();
		this._onDidOpenRepository.fire(repository);
	}

	close(repository: Repository): void {
		const openRepository = this.getOpenRepository(repository);

		if (!openRepository) {
			return;
		}

		this.logger.info(`Close repository: ${repository.root}`);
		this._closedRepositoriesManager.addRepository(openRepository.repository.root);

		openRepository.dispose();
	}

	async pickRepository(): Promise<Repository | undefined> {
		if (this.openRepositories.length === 0) {
			throw new Error(l10n.t('There are no available repositories'));
		}

		const picks = this.openRepositories.map((e, index) => new RepositoryPick(e.repository, index));
		const active = window.activeTextEditor;
		const repository = active && this.getRepository(active.document.fileName);
		const index = picks.findIndex(pick => pick.repository === repository);

		// Move repository pick containing the active text editor to appear first
		if (index > -1) {
			picks.unshift(...picks.splice(index, 1));
		}

		const placeHolder = l10n.t('Choose a repository');
		const pick = await window.showQuickPick(picks, { placeHolder });

		return pick && pick.repository;
	}

	getRepository(sourceControl: SourceControl): Repository | undefined;
	getRepository(resourceGroup: SourceControlResourceGroup): Repository | undefined;
	getRepository(path: string): Repository | undefined;
	getRepository(resource: Uri): Repository | undefined;
	getRepository(hint: any): Repository | undefined {
		const liveRepository = this.getOpenRepository(hint);
		return liveRepository && liveRepository.repository;
	}

	private async getRepositoryExact(repoPath: string): Promise<Repository | undefined> {
		const repoPathCanonical = await fs.promises.realpath(repoPath, { encoding: 'utf8' });

		for (const openRepository of this.openRepositories) {
			const rootPathCanonical = await fs.promises.realpath(openRepository.repository.root, { encoding: 'utf8' });
			if (pathEquals(rootPathCanonical, repoPathCanonical)) {
				return openRepository.repository;
			}
		}

		return undefined;
	}

	private getOpenRepository(repository: Repository): OpenRepository | undefined;
	private getOpenRepository(sourceControl: SourceControl): OpenRepository | undefined;
	private getOpenRepository(resourceGroup: SourceControlResourceGroup): OpenRepository | undefined;
	private getOpenRepository(path: string): OpenRepository | undefined;
	private getOpenRepository(resource: Uri): OpenRepository | undefined;
	private getOpenRepository(hint: any): OpenRepository | undefined {
		if (!hint) {
			return undefined;
		}

		if (hint instanceof Repository) {
			return this.openRepositories.filter(r => r.repository === hint)[0];
		}

		if (hint instanceof ApiRepository) {
			return this.openRepositories.filter(r => r.repository === hint.repository)[0];
		}

		if (typeof hint === 'string') {
			hint = Uri.file(hint);
		}

		if (hint instanceof Uri) {
			let resourcePath: string;

			if (hint.scheme === 'git') {
				resourcePath = fromGitUri(hint).path;
			} else {
				resourcePath = hint.fsPath;
			}

			outer:
			for (const liveRepository of this.openRepositories.sort((a, b) => b.repository.root.length - a.repository.root.length)) {
				if (!isDescendant(liveRepository.repository.root, resourcePath)) {
					continue;
				}

				for (const submodule of liveRepository.repository.submodules) {
					const submoduleRoot = path.join(liveRepository.repository.root, submodule.path);

					if (isDescendant(submoduleRoot, resourcePath)) {
						continue outer;
					}
				}

				return liveRepository;
			}

			return undefined;
		}

		for (const liveRepository of this.openRepositories) {
			const repository = liveRepository.repository;

			if (hint === repository.sourceControl) {
				return liveRepository;
			}

			if (hint === repository.mergeGroup || hint === repository.indexGroup || hint === repository.workingTreeGroup || hint === repository.untrackedGroup) {
				return liveRepository;
			}
		}

		return undefined;
	}

	getRepositoryForSubmodule(submoduleUri: Uri): Repository | undefined {
		for (const repository of this.repositories) {
			for (const submodule of repository.submodules) {
				const submodulePath = path.join(repository.root, submodule.path);

				if (submodulePath === submoduleUri.fsPath) {
					return repository;
				}
			}
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-diff-trimws/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-diff-trimws/advanced.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { workspace, WorkspaceFoldersChangeEvent, Uri, window, Event, EventEmitter, QuickPickItem, Disposable, SourceControl, SourceControlResourceGroup, TextEditor, Memento, commands, LogOutputChannel, l10n, ProgressLocation, WorkspaceFolder } from 'vscode';\nimport TelemetryReporter from '@vscode/extension-telemetry';\nimport { Repository, RepositoryState } from './repository';\nimport { memoize, sequentialize, debounce } from './decorators';\nimport { dispose, anyEvent, filterEvent, isDescendant, pathEquals, toDisposable, eventToPromise } from './util';\nimport { Git } from './git';\nimport * as path from 'path';\nimport * as fs from 'fs';\nimport { fromGitUri } from './uri';\nimport { APIState as State, CredentialsProvider, PushErrorHandler, PublishEvent, RemoteSourcePublisher, PostCommitCommandsProvider, BranchProtectionProvider } from './api/git';\nimport { Askpass } from './askpass';\nimport { IPushErrorHandlerRegistry } from './pushError';\nimport { ApiRepository } from './api/api1';\nimport { IRemoteSourcePublisherRegistry } from './remotePublisher';\nimport { IPostCommitCommandsProviderRegistry } from './postCommitCommands';\nimport { IBranchProtectionProviderRegistry } from './branchProtection';\n\nclass ClosedRepositoriesManager {\n\n\tprivate _repositories: Set<string>;\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.values()];\n\t}\n\n\tconstructor(private readonly workspaceState: Memento) {\n\t\tthis._repositories = new Set<string>(workspaceState.get<string[]>('closedRepositories', []));\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string): void {\n\t\tthis._repositories.add(repository);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tisRepositoryClosed(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tthis.workspaceState.update('closedRepositories', [...this._repositories.values()]);\n\t\tcommands.executeCommand('setContext', 'git.closedRepositoryCount', this._repositories.size);\n\t}\n}\n\nclass ParentRepositoriesManager {\n\n\t/**\n\t * Key   - normalized path used in user interface\n\t * Value - value indicating whether the repository should be opened\n\t */\n\tprivate _repositories = new Set<string>;\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.values()];\n\t}\n\n\tconstructor(private readonly globalState: Memento) {\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string): void {\n\t\tthis._repositories.add(repository);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\thasRepository(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\topenRepository(repository: string): void {\n\t\tthis.globalState.update(`parentRepository:${repository}`, true);\n\t\tthis.deleteRepository(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tcommands.executeCommand('setContext', 'git.parentRepositoryCount', this._repositories.size);\n\t}\n}\n\nclass UnsafeRepositoriesManager {\n\n\t/**\n\t * Key   - normalized path used in user interface\n\t * Value - path extracted from the output of the `git status` command\n\t *         used when calling `git config --global --add safe.directory`\n\t */\n\tprivate _repositories = new Map<string, string>();\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.keys()];\n\t}\n\n\tconstructor() {\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string, path: string): void {\n\t\tthis._repositories.set(repository, path);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tgetRepositoryPath(repository: string): string | undefined {\n\t\treturn this._repositories.get(repository);\n\t}\n\n\thasRepository(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tcommands.executeCommand('setContext', 'git.unsafeRepositoryCount', this._repositories.size);\n\t}\n}\n\nexport class Model implements IBranchProtectionProviderRegistry, IRemoteSourcePublisherRegistry, IPostCommitCommandsProviderRegistry, IPushErrorHandlerRegistry {\n\n\tprivate _onDidOpenRepository = new EventEmitter<Repository>();\n\treadonly onDidOpenRepository: Event<Repository> = this._onDidOpenRepository.event;\n\n\tprivate _onDidCloseRepository = new EventEmitter<Repository>();\n\treadonly onDidCloseRepository: Event<Repository> = this._onDidCloseRepository.event;\n\n\tprivate _onDidChangeRepository = new EventEmitter<ModelChangeEvent>();\n\treadonly onDidChangeRepository: Event<ModelChangeEvent> = this._onDidChangeRepository.event;\n\n\tprivate _onDidChangeOriginalResource = new EventEmitter<OriginalResourceChangeEvent>();\n\treadonly onDidChangeOriginalResource: Event<OriginalResourceChangeEvent> = this._onDidChangeOriginalResource.event;\n\n\tprivate openRepositories: OpenRepository[] = [];\n\tget repositories(): Repository[] { return this.openRepositories.map(r => r.repository); }\n\n\tprivate possibleGitRepositoryPaths = new Set<string>();\n\n\tprivate _onDidChangeState = new EventEmitter<State>();\n\treadonly onDidChangeState = this._onDidChangeState.event;\n\n\tprivate _onDidPublish = new EventEmitter<PublishEvent>();\n\treadonly onDidPublish = this._onDidPublish.event;\n\n\tfirePublishEvent(repository: Repository, branch?: string) {\n\t\tthis._onDidPublish.fire({ repository: new ApiRepository(repository), branch: branch });\n\t}\n\n\tprivate _state: State = 'uninitialized';\n\tget state(): State { return this._state; }\n\n\tsetState(state: State): void {\n\t\tthis._state = state;\n\t\tthis._onDidChangeState.fire(state);\n\t\tcommands.executeCommand('setContext', 'git.state', state);\n\t}\n\n\t@memoize\n\tget isInitialized(): Promise<void> {\n\t\tif (this._state === 'initialized') {\n\t\t\treturn Promise.resolve();\n\t\t}\n\n\t\treturn eventToPromise(filterEvent(this.onDidChangeState, s => s === 'initialized')) as Promise<any>;\n\t}\n\n\tprivate remoteSourcePublishers = new Set<RemoteSourcePublisher>();\n\n\tprivate _onDidAddRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();\n\treadonly onDidAddRemoteSourcePublisher = this._onDidAddRemoteSourcePublisher.event;\n\n\tprivate _onDidRemoveRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();\n\treadonly onDidRemoveRemoteSourcePublisher = this._onDidRemoveRemoteSourcePublisher.event;\n\n\tprivate postCommitCommandsProviders = new Set<PostCommitCommandsProvider>();\n\n\tprivate _onDidChangePostCommitCommandsProviders = new EventEmitter<void>();\n\treadonly onDidChangePostCommitCommandsProviders = this._onDidChangePostCommitCommandsProviders.event;\n\n\tprivate branchProtectionProviders = new Map<string, Set<BranchProtectionProvider>>();\n\n\tprivate _onDidChangeBranchProtectionProviders = new EventEmitter<Uri>();\n\treadonly onDidChangeBranchProtectionProviders = this._onDidChangeBranchProtectionProviders.event;\n\n\tprivate pushErrorHandlers = new Set<PushErrorHandler>();\n\n\tprivate _unsafeRepositoriesManager: UnsafeRepositoriesManager;\n\tget unsafeRepositories(): string[] {\n\t\treturn this._unsafeRepositoriesManager.repositories;\n\t}\n\n\tprivate _parentRepositoriesManager: ParentRepositoriesManager;\n\tget parentRepositories(): string[] {\n\t\treturn this._parentRepositoriesManager.repositories;\n\t}\n\n\tprivate _closedRepositoriesManager: ClosedRepositoriesManager;\n\tget closedRepositories(): string[] {\n\t\treturn [...this._closedRepositoriesManager.repositories];\n\t}\n\n\t/**\n\t * We maintain a map containing both the path and the canonical path of the\n\t * workspace folders. We are doing this as `git.exe` expands the symbolic links\n\t * while there are scenarios in which VS Code does not.\n\t *\n\t * Key   - path of the workspace folder\n\t * Value - canonical path of the workspace folder\n\t */\n\tprivate _workspaceFolders = new Map<string, string>();\n\n\tprivate disposables: Disposable[] = [];\n\n\tconstructor(readonly git: Git, private readonly askpass: Askpass, private globalState: Memento, readonly workspaceState: Memento, private logger: LogOutputChannel, private telemetryReporter: TelemetryReporter) {\n\t\t// Repositories managers\n\t\tthis._closedRepositoriesManager = new ClosedRepositoriesManager(workspaceState);\n\t\tthis._parentRepositoriesManager = new ParentRepositoriesManager(globalState);\n\t\tthis._unsafeRepositoriesManager = new UnsafeRepositoriesManager();\n\n\t\tworkspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders, this, this.disposables);\n\t\twindow.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, this.disposables);\n\t\tworkspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.disposables);\n\n\t\tconst fsWatcher = workspace.createFileSystemWatcher('**');\n\t\tthis.disposables.push(fsWatcher);\n\n\t\tconst onWorkspaceChange = anyEvent(fsWatcher.onDidChange, fsWatcher.onDidCreate, fsWatcher.onDidDelete);\n\t\tconst onGitRepositoryChange = filterEvent(onWorkspaceChange, uri => /\\/\\.git/.test(uri.path));\n\t\tconst onPossibleGitRepositoryChange = filterEvent(onGitRepositoryChange, uri => !this.getRepository(uri));\n\t\tonPossibleGitRepositoryChange(this.onPossibleGitRepositoryChange, this, this.disposables);\n\n\t\tthis.setState('uninitialized');\n\t\tthis.doInitialScan().finally(() => this.setState('initialized'));\n\t}\n\n\tprivate async doInitialScan(): Promise<void> {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tconst parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');\n\n\t\t// Initial repository scan function\n\t\tconst initialScanFn = () => Promise.all([\n\t\t\tthis.onDidChangeWorkspaceFolders({ added: workspace.workspaceFolders || [], removed: [] }),\n\t\t\tthis.onDidChangeVisibleTextEditors(window.visibleTextEditors),\n\t\t\tthis.scanWorkspaceFolders()\n\t\t]);\n\n\t\tif (config.get<boolean>('showProgress', true)) {\n\t\t\tawait window.withProgress({ location: ProgressLocation.SourceControl }, initialScanFn);\n\t\t} else {\n\t\t\tawait initialScanFn();\n\t\t}\n\n\t\tif (this.parentRepositories.length !== 0 &&\n\t\t\tparentRepositoryConfig === 'prompt') {\n\t\t\t// Parent repositories notification\n\t\t\tthis.showParentRepositoryNotification();\n\t\t} else if (this.unsafeRepositories.length !== 0) {\n\t\t\t// Unsafe repositories notification\n\t\t\tthis.showUnsafeRepositoryNotification();\n\t\t}\n\n\t\t/* __GDPR__\n\t\t\t\"git.repositoryInitialScan\" : {\n\t\t\t\t\"owner\": \"lszomoru\",\n\t\t\t\t\"autoRepositoryDetection\": { \"classification\": \"SystemMetaData\", \"purpose\": \"FeatureInsight\", \"comment\": \"Setting that controls the initial repository scan\" },\n\t\t\t\t\"repositoryCount\": { \"classification\": \"SystemMetaData\", \"purpose\": \"FeatureInsight\", \"isMeasurement\": true, \"comment\": \"Number of repositories opened during initial repository scan\" }\n\t\t\t}\n\t\t*/\n\t\tthis.telemetryReporter.sendTelemetryEvent('git.repositoryInitialScan', { autoRepositoryDetection: String(autoRepositoryDetection) }, { repositoryCount: this.openRepositories.length });\n\t}\n\n\t/**\n\t * Scans each workspace folder, looking for git repositories. By\n\t * default it scans one level deep but that can be changed using\n\t * the git.repositoryScanMaxDepth setting.\n\t */\n\tprivate async scanWorkspaceFolders(): Promise<void> {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tthis.logger.trace(`[swsf] Scan workspace sub folders. autoRepositoryDetection=${autoRepositoryDetection}`);\n\n\t\tif (autoRepositoryDetection !== true && autoRepositoryDetection !== 'subFolders') {\n\t\t\treturn;\n\t\t}\n\n\t\tawait Promise.all((workspace.workspaceFolders || []).map(async folder => {\n\t\t\tconst root = folder.uri.fsPath;\n\t\t\tthis.logger.trace(`[swsf] Workspace folder: ${root}`);\n\n\t\t\t// Workspace folder children\n\t\t\tconst repositoryScanMaxDepth = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<number>('repositoryScanMaxDepth', 1);\n\t\t\tconst repositoryScanIgnoredFolders = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('repositoryScanIgnoredFolders', []);\n\n\t\t\tconst subfolders = new Set(await this.traverseWorkspaceFolder(root, repositoryScanMaxDepth, repositoryScanIgnoredFolders));\n\n\t\t\t// Repository scan folders\n\t\t\tconst scanPaths = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('scanRepositories') || [];\n\t\t\tthis.logger.trace(`[swsf] Workspace scan settings: repositoryScanMaxDepth=${repositoryScanMaxDepth}; repositoryScanIgnoredFolders=[${repositoryScanIgnoredFolders.join(', ')}]; scanRepositories=[${scanPaths.join(', ')}]`);\n\n\t\t\tfor (const scanPath of scanPaths) {\n\t\t\t\tif (scanPath === '.git') {\n\t\t\t\t\tthis.logger.trace('[swsf] \\'.git\\' not supported in \\'git.scanRepositories\\' setting.');\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tif (path.isAbsolute(scanPath)) {\n\t\t\t\t\tconst notSupportedMessage = l10n.t('Absolute paths not supported in \"git.scanRepositories\" setting.');\n\t\t\t\t\tthis.logger.warn(notSupportedMessage);\n\t\t\t\t\tconsole.warn(notSupportedMessage);\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tsubfolders.add(path.join(root, scanPath));\n\t\t\t}\n\n\t\t\tthis.logger.trace(`[swsf] Workspace scan sub folders: [${[...subfolders].join(', ')}]`);\n\t\t\tawait Promise.all([...subfolders].map(f => this.openRepository(f)));\n\t\t}));\n\t}\n\n\tprivate async traverseWorkspaceFolder(workspaceFolder: string, maxDepth: number, repositoryScanIgnoredFolders: string[]): Promise<string[]> {\n\t\tconst result: string[] = [];\n\t\tconst foldersToTravers = [{ path: workspaceFolder, depth: 0 }];\n\n\t\twhile (foldersToTravers.length > 0) {\n\t\t\tconst currentFolder = foldersToTravers.shift()!;\n\n\t\t\tif (currentFolder.depth < maxDepth || maxDepth === -1) {\n\t\t\t\tconst children = await fs.promises.readdir(currentFolder.path, { withFileTypes: true });\n\t\t\t\tconst childrenFolders = children\n\t\t\t\t\t.filter(dirent =>\n\t\t\t\t\t\tdirent.isDirectory() && dirent.name !== '.git' &&\n\t\t\t\t\t\t!repositoryScanIgnoredFolders.find(f => pathEquals(dirent.name, f)))\n\t\t\t\t\t.map(dirent => path.join(currentFolder.path, dirent.name));\n\n\t\t\t\tresult.push(...childrenFolders);\n\t\t\t\tfoldersToTravers.push(...childrenFolders.map(folder => {\n\t\t\t\t\treturn { path: folder, depth: currentFolder.depth + 1 };\n\t\t\t\t}));\n\t\t\t}\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tprivate onPossibleGitRepositoryChange(uri: Uri): void {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\n\t\tif (autoRepositoryDetection === false) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.eventuallyScanPossibleGitRepository(uri.fsPath.replace(/\\.git.*$/, ''));\n\t}\n\n\tprivate eventuallyScanPossibleGitRepository(path: string) {\n\t\tthis.possibleGitRepositoryPaths.add(path);\n\t\tthis.eventuallyScanPossibleGitRepositories();\n\t}\n\n\t@debounce(500)\n\tprivate eventuallyScanPossibleGitRepositories(): void {\n\t\tfor (const path of this.possibleGitRepositoryPaths) {\n\t\t\tthis.openRepository(path);\n\t\t}\n\n\t\tthis.possibleGitRepositoryPaths.clear();\n\t}\n\n\tprivate async onDidChangeWorkspaceFolders({ added, removed }: WorkspaceFoldersChangeEvent): Promise<void> {\n\t\tconst possibleRepositoryFolders = added\n\t\t\t.filter(folder => !this.getOpenRepository(folder.uri));\n\n\t\tconst activeRepositoriesList = window.visibleTextEditors\n\t\t\t.map(editor => this.getRepository(editor.document.uri))\n\t\t\t.filter(repository => !!repository) as Repository[];\n\n\t\tconst activeRepositories = new Set<Repository>(activeRepositoriesList);\n\t\tconst openRepositoriesToDispose = removed\n\t\t\t.map(folder => this.getOpenRepository(folder.uri))\n\t\t\t.filter(r => !!r)\n\t\t\t.filter(r => !activeRepositories.has(r!.repository))\n\t\t\t.filter(r => !(workspace.workspaceFolders || []).some(f => isDescendant(f.uri.fsPath, r!.repository.root))) as OpenRepository[];\n\n\t\topenRepositoriesToDispose.forEach(r => r.dispose());\n\t\tthis.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);\n\t\tawait Promise.all(possibleRepositoryFolders.map(p => this.openRepository(p.uri.fsPath)));\n\t}\n\n\tprivate onDidChangeConfiguration(): void {\n\t\tconst possibleRepositoryFolders = (workspace.workspaceFolders || [])\n\t\t\t.filter(folder => workspace.getConfiguration('git', folder.uri).get<boolean>('enabled') === true)\n\t\t\t.filter(folder => !this.getOpenRepository(folder.uri));\n\n\t\tconst openRepositoriesToDispose = this.openRepositories\n\t\t\t.map(repository => ({ repository, root: Uri.file(repository.repository.root) }))\n\t\t\t.filter(({ root }) => workspace.getConfiguration('git', root).get<boolean>('enabled') !== true)\n\t\t\t.map(({ repository }) => repository);\n\n\t\tthis.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);\n\t\tpossibleRepositoryFolders.forEach(p => this.openRepository(p.uri.fsPath));\n\t\topenRepositoriesToDispose.forEach(r => r.dispose());\n\t}\n\n\tprivate async onDidChangeVisibleTextEditors(editors: readonly TextEditor[]): Promise<void> {\n\t\tif (!workspace.isTrusted) {\n\t\t\tthis.logger.trace('[svte] Workspace is not trusted.');\n\t\t\treturn;\n\t\t}\n\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tthis.logger.trace(`[svte] Scan visible text editors. autoRepositoryDetection=${autoRepositoryDetection}`);\n\n\t\tif (autoRepositoryDetection !== true && autoRepositoryDetection !== 'openEditors') {\n\t\t\treturn;\n\t\t}\n\n\t\tawait Promise.all(editors.map(async editor => {\n\t\t\tconst uri = editor.document.uri;\n\n\t\t\tif (uri.scheme !== 'file') {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tconst repository = this.getRepository(uri);\n\n\t\t\tif (repository) {\n\t\t\t\tthis.logger.trace(`[svte] Repository for editor resource ${uri.fsPath} already exists: ${repository.root}`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tthis.logger.trace(`[svte] Open repository for editor resource ${uri.fsPath}`);\n\t\t\tawait this.openRepository(path.dirname(uri.fsPath));\n\t\t}));\n\t}\n\n\t@sequentialize\n\tasync openRepository(repoPath: string, openIfClosed = false): Promise<void> {\n\t\tthis.logger.trace(`Opening repository: ${repoPath}`);\n\t\tconst existingRepository = await this.getRepositoryExact(repoPath);\n\t\tif (existingRepository) {\n\t\t\tthis.logger.trace(`Repository for path ${repoPath} already exists: ${existingRepository.root})`);\n\t\t\treturn;\n\t\t}\n\n\t\tconst config = workspace.getConfiguration('git', Uri.file(repoPath));\n\t\tconst enabled = config.get<boolean>('enabled') === true;\n\n\t\tif (!enabled) {\n\t\t\tthis.logger.trace('Git is not enabled');\n\t\t\treturn;\n\t\t}\n\n\t\tif (!workspace.isTrusted) {\n\t\t\t// Check if the folder is a bare repo: if it has a file named HEAD && `rev-parse --show -cdup` is empty\n\t\t\ttry {\n\t\t\t\tfs.accessSync(path.join(repoPath, 'HEAD'), fs.constants.F_OK);\n\t\t\t\tconst result = await this.git.exec(repoPath, ['-C', repoPath, 'rev-parse', '--show-cdup']);\n\t\t\t\tif (result.stderr.trim() === '' && result.stdout.trim() === '') {\n\t\t\t\t\tthis.logger.trace(`Bare repository: ${repoPath}`);\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t} catch {\n\t\t\t\t// If this throw, we should be good to open the repo (e.g. HEAD doesn't exist)\n\t\t\t}\n\t\t}\n\n\t\ttry {\n\t\t\tconst { repositoryRoot, unsafeRepositoryMatch } = await this.getRepositoryRoot(repoPath);\n\t\t\tthis.logger.trace(`Repository root for path ${repoPath} is: ${repositoryRoot}`);\n\n\t\t\tconst existingRepository = await this.getRepositoryExact(repositoryRoot);\n\t\t\tif (existingRepository) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} already exists: ${existingRepository.root}`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (this.shouldRepositoryBeIgnored(repositoryRoot)) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} is ignored`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Handle git repositories that are in parent folders\n\t\t\tconst parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');\n\t\t\tif (parentRepositoryConfig !== 'always' && this.globalState.get<boolean>(`parentRepository:${repositoryRoot}`) !== true) {\n\t\t\t\tconst isRepositoryOutsideWorkspace = await this.isRepositoryOutsideWorkspace(repositoryRoot);\n\t\t\t\tif (isRepositoryOutsideWorkspace) {\n\t\t\t\t\tthis.logger.trace(`Repository in parent folder: ${repositoryRoot}`);\n\n\t\t\t\t\tif (!this._parentRepositoriesManager.hasRepository(repositoryRoot)) {\n\t\t\t\t\t\t// Show a notification if the parent repository is opened after the initial scan\n\t\t\t\t\t\tif (this.state === 'initialized' && parentRepositoryConfig === 'prompt') {\n\t\t\t\t\t\t\tthis.showParentRepositoryNotification();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis._parentRepositoriesManager.addRepository(repositoryRoot);\n\t\t\t\t\t}\n\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t// Handle unsafe repositories\n\t\t\tif (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {\n\t\t\t\tthis.logger.trace(`Unsafe repository: ${repositoryRoot}`);\n\n\t\t\t\t// Show a notification if the unsafe repository is opened after the initial scan\n\t\t\t\tif (this._state === 'initialized' && !this._unsafeRepositoriesManager.hasRepository(repositoryRoot)) {\n\t\t\t\t\tthis.showUnsafeRepositoryNotification();\n\t\t\t\t}\n\n\t\t\t\tthis._unsafeRepositoriesManager.addRepository(repositoryRoot, unsafeRepositoryMatch[2]);\n\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Handle repositories that were closed by the user\n\t\t\tif (!openIfClosed && this._closedRepositoriesManager.isRepositoryClosed(repositoryRoot)) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} is closed`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Open repository\n\t\t\tconst dotGit = await this.git.getRepositoryDotGit(repositoryRoot);\n\t\t\tconst repository = new Repository(this.git.open(repositoryRoot, dotGit, this.logger), this, this, this, this, this.globalState, this.logger, this.telemetryReporter);\n\n\t\t\tthis.open(repository);\n\t\t\tthis._closedRepositoriesManager.deleteRepository(repository.root);\n\n\t\t\t// Do not await this, we want SCM\n\t\t\t// to know about the repo asap\n\t\t\trepository.status();\n\t\t} catch (err) {\n\t\t\t// noop\n\t\t\tthis.logger.trace(`Opening repository for path='${repoPath}' failed; ex=${err}`);\n\t\t}\n\t}\n\n\tasync openParentRepository(repoPath: string): Promise<void> {\n\t\tawait this.openRepository(repoPath);\n\t\tthis._parentRepositoriesManager.openRepository(repoPath);\n\t}\n\n\tprivate async getRepositoryRoot(repoPath: string): Promise<{ repositoryRoot: string; unsafeRepositoryMatch: RegExpMatchArray | null }> {\n\t\ttry {\n\t\t\tconst rawRoot = await this.git.getRepositoryRoot(repoPath);\n\n\t\t\t// This can happen whenever `path` has the wrong case sensitivity in case\n\t\t\t// insensitive file systems https://github.com/microsoft/vscode/issues/33498\n\t\t\treturn { repositoryRoot: Uri.file(rawRoot).fsPath, unsafeRepositoryMatch: null };\n\t\t} catch (err) {\n\t\t\t// Handle unsafe repository\n\t\t\tconst unsafeRepositoryMatch = /^fatal: detected dubious ownership in repository at \\'([^']+)\\'[\\s\\S]*git config --global --add safe\\.directory '?([^'\\n]+)'?$/m.exec(err.stderr);\n\t\t\tif (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {\n\t\t\t\treturn { repositoryRoot: path.normalize(unsafeRepositoryMatch[1]), unsafeRepositoryMatch };\n\t\t\t}\n\n\t\t\tthrow err;\n\t\t}\n\t}\n\n\tprivate shouldRepositoryBeIgnored(repositoryRoot: string): boolean {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst ignoredRepos = config.get<string[]>('ignoredRepositories') || [];\n\n\t\tfor (const ignoredRepo of ignoredRepos) {\n\t\t\tif (path.isAbsolute(ignoredRepo)) {\n\t\t\t\tif (pathEquals(ignoredRepo, repositoryRoot)) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tfor (const folder of workspace.workspaceFolders || []) {\n\t\t\t\t\tif (pathEquals(path.join(folder.uri.fsPath, ignoredRepo), repositoryRoot)) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn false;\n\t}\n\n\tprivate open(repository: Repository): void {\n\t\tthis.logger.info(`Open repository: ${repository.root}`);\n\n\t\tconst onDidDisappearRepository = filterEvent(repository.onDidChangeState, state => state === RepositoryState.Disposed);\n\t\tconst disappearListener = onDidDisappearRepository(() => dispose());\n\t\tconst changeListener = repository.onDidChangeRepository(uri => this._onDidChangeRepository.fire({ repository, uri }));\n\t\tconst originalResourceChangeListener = repository.onDidChangeOriginalResource(uri => this._onDidChangeOriginalResource.fire({ repository, uri }));\n\n\t\tconst shouldDetectSubmodules = workspace\n\t\t\t.getConfiguration('git', Uri.file(repository.root))\n\t\t\t.get<boolean>('detectSubmodules') as boolean;\n\n\t\tconst submodulesLimit = workspace\n\t\t\t.getConfiguration('git', Uri.file(repository.root))\n\t\t\t.get<number>('detectSubmodulesLimit') as number;\n\n\t\tconst checkForSubmodules = () => {\n\t\t\tif (!shouldDetectSubmodules) {\n\t\t\t\tthis.logger.trace('Automatic detection of git submodules is not enabled.');\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (repository.submodules.length > submodulesLimit) {\n\t\t\t\twindow.showWarningMessage(l10n.t('The \"{0}\" repository has {1} submodules which won\\'t be opened automatically. You can still open each one individually by opening a file within.', path.basename(repository.root), repository.submodules.length));\n\t\t\t\tstatusListener.dispose();\n\t\t\t}\n\n\t\t\trepository.submodules\n\t\t\t\t.slice(0, submodulesLimit)\n\t\t\t\t.map(r => path.join(repository.root, r.path))\n\t\t\t\t.forEach(p => {\n\t\t\t\t\tthis.logger.trace(`Opening submodule: '${p}'`);\n\t\t\t\t\tthis.eventuallyScanPossibleGitRepository(p);\n\t\t\t\t});\n\t\t};\n\n\t\tconst updateMergeChanges = () => {\n\t\t\t// set mergeChanges context\n\t\t\tconst mergeChanges: Uri[] = [];\n\t\t\tfor (const { repository } of this.openRepositories.values()) {\n\t\t\t\tfor (const state of repository.mergeGroup.resourceStates) {\n\t\t\t\t\tmergeChanges.push(state.resourceUri);\n\t\t\t\t}\n\t\t\t}\n\t\t\tcommands.executeCommand('setContext', 'git.mergeChanges', mergeChanges);\n\t\t};\n\n\t\tconst statusListener = repository.onDidRunGitStatus(() => {\n\t\t\tcheckForSubmodules();\n\t\t\tupdateMergeChanges();\n\t\t});\n\t\tcheckForSubmodules();\n\n\t\tconst updateOperationInProgressContext = () => {\n\t\t\tlet operationInProgress = false;\n\t\t\tfor (const { repository } of this.openRepositories.values()) {\n\t\t\t\tif (repository.operations.shouldDisableCommands()) {\n\t\t\t\t\toperationInProgress = true;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tcommands.executeCommand('setContext', 'operationInProgress', operationInProgress);\n\t\t};\n\n\t\tconst operationEvent = anyEvent(repository.onDidRunOperation as Event<any>, repository.onRunOperation as Event<any>);\n\t\tconst operationListener = operationEvent(() => updateOperationInProgressContext());\n\t\tupdateOperationInProgressContext();\n\n\t\tconst dispose = () => {\n\t\t\tdisappearListener.dispose();\n\t\t\tchangeListener.dispose();\n\t\t\toriginalResourceChangeListener.dispose();\n\t\t\tstatusListener.dispose();\n\t\t\toperationListener.dispose();\n\t\t\trepository.dispose();\n\n\t\t\tthis.openRepositories = this.openRepositories.filter(e => e !== openRepository);\n\t\t\tthis._onDidCloseRepository.fire(repository);\n\t\t};\n\n\t\tconst openRepository = { repository, dispose };\n\t\tthis.openRepositories.push(openRepository);\n\t\tupdateMergeChanges();\n\t\tthis._onDidOpenRepository.fire(repository);\n\t}\n\n\tclose(repository: Repository): void {\n\t\tconst openRepository = this.getOpenRepository(repository);\n\n\t\tif (!openRepository) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.logger.info(`Close repository: ${repository.root}`);\n\t\tthis._closedRepositoriesManager.addRepository(openRepository.repository.root);\n\n\t\topenRepository.dispose();\n\t}\n\n\tasync pickRepository(): Promise<Repository | undefined> {\n\t\tif (this.openRepositories.length === 0) {\n\t\t\tthrow new Error(l10n.t('There are no available repositories'));\n\t\t}\n\n\t\tconst picks = this.openRepositories.map((e, index) => new RepositoryPick(e.repository, index));\n\t\tconst active = window.activeTextEditor;\n\t\tconst repository = active && this.getRepository(active.document.fileName);\n\t\tconst index = picks.findIndex(pick => pick.repository === repository);\n\n\t\t// Move repository pick containing the active text editor to appear first\n\t\tif (index > -1) {\n\t\t\tpicks.unshift(...picks.splice(index, 1));\n\t\t}\n\n\t\tconst placeHolder = l10n.t('Choose a repository');\n\t\tconst pick = await window.showQuickPick(picks, { placeHolder });\n\n\t\treturn pick && pick.repository;\n\t}\n\n\tgetRepository(sourceControl: SourceControl): Repository | undefined;\n\tgetRepository(resourceGroup: SourceControlResourceGroup): Repository | undefined;\n\tgetRepository(path: string): Repository | undefined;\n\tgetRepository(resource: Uri): Repository | undefined;\n\tgetRepository(hint: any): Repository | undefined {\n\t\tconst liveRepository = this.getOpenRepository(hint);\n\t\treturn liveRepository && liveRepository.repository;\n\t}\n\n\tprivate async getRepositoryExact(repoPath: string): Promise<Repository | undefined> {\n\t\tconst repoPathCanonical = await fs.promises.realpath(repoPath, { encoding: 'utf8' });\n\t\tconst openRepository = this.openRepositories.find(async r => {\n\t\t\tconst rootPathCanonical = await fs.promises.realpath(r.repository.root, { encoding: 'utf8' });\n\t\t\treturn pathEquals(rootPathCanonical, repoPathCanonical);\n\t\t});\n\t\treturn openRepository?.repository;\n\t}\n\n\tprivate getOpenRepository(repository: Repository): OpenRepository | undefined;\n\tprivate getOpenRepository(sourceControl: SourceControl): OpenRepository | undefined;\n\tprivate getOpenRepository(resourceGroup: SourceControlResourceGroup): OpenRepository | undefined;\n\tprivate getOpenRepository(path: string): OpenRepository | undefined;\n\tprivate getOpenRepository(resource: Uri): OpenRepository | undefined;\n\tprivate getOpenRepository(hint: any): OpenRepository | undefined {\n\t\tif (!hint) {\n\t\t\treturn undefined;\n\t\t}\n\n\t\tif (hint instanceof Repository) {\n\t\t\treturn this.openRepositories.filter(r => r.repository === hint)[0];\n\t\t}\n\n\t\tif (hint instanceof ApiRepository) {\n\t\t\treturn this.openRepositories.filter(r => r.repository === hint.repository)[0];\n\t\t}\n\n\t\tif (typeof hint === 'string') {\n\t\t\thint = Uri.file(hint);\n\t\t}\n\n\t\tif (hint instanceof Uri) {\n\t\t\tlet resourcePath: string;\n\n\t\t\tif (hint.scheme === 'git') {\n\t\t\t\tresourcePath = fromGitUri(hint).path;\n\t\t\t} else {\n\t\t\t\tresourcePath = hint.fsPath;\n\t\t\t}\n\n\t\t\touter:\n\t\t\tfor (const liveRepository of this.openRepositories.sort((a, b) => b.repository.root.length - a.repository.root.length)) {\n\t\t\t\tif (!isDescendant(liveRepository.repository.root, resourcePath)) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tfor (const submodule of liveRepository.repository.submodules) {\n\t\t\t\t\tconst submoduleRoot = path.join(liveRepository.repository.root, submodule.path);\n\n\t\t\t\t\tif (isDescendant(submoduleRoot, resourcePath)) {\n\t\t\t\t\t\tcontinue outer;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\n\t\t\treturn undefined;\n\t\t}\n\n\t\tfor (const liveRepository of this.openRepositories) {\n\t\t\tconst repository = liveRepository.repository;\n\n\t\t\tif (hint === repository.sourceControl) {\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\n\t\t\tif (hint === repository.mergeGroup || hint === repository.indexGroup || hint === repository.workingTreeGroup || hint === repository.untrackedGroup) {\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\t\t}\n\n\t\treturn undefined;\n\t}\n\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { workspace, WorkspaceFoldersChangeEvent, Uri, window, Event, EventEmitter, QuickPickItem, Disposable, SourceControl, SourceControlResourceGroup, TextEditor, Memento, commands, LogOutputChannel, l10n, ProgressLocation, WorkspaceFolder } from 'vscode';\nimport TelemetryReporter from '@vscode/extension-telemetry';\nimport { Repository, RepositoryState } from './repository';\nimport { memoize, sequentialize, debounce } from './decorators';\nimport { dispose, anyEvent, filterEvent, isDescendant, pathEquals, toDisposable, eventToPromise } from './util';\nimport { Git } from './git';\nimport * as path from 'path';\nimport * as fs from 'fs';\nimport { fromGitUri } from './uri';\nimport { APIState as State, CredentialsProvider, PushErrorHandler, PublishEvent, RemoteSourcePublisher, PostCommitCommandsProvider, BranchProtectionProvider } from './api/git';\nimport { Askpass } from './askpass';\nimport { IPushErrorHandlerRegistry } from './pushError';\nimport { ApiRepository } from './api/api1';\nimport { IRemoteSourcePublisherRegistry } from './remotePublisher';\nimport { IPostCommitCommandsProviderRegistry } from './postCommitCommands';\nimport { IBranchProtectionProviderRegistry } from './branchProtection';\n\nclass ClosedRepositoriesManager {\n\n\tprivate _repositories: Set<string>;\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.values()];\n\t}\n\n\tconstructor(private readonly workspaceState: Memento) {\n\t\tthis._repositories = new Set<string>(workspaceState.get<string[]>('closedRepositories', []));\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string): void {\n\t\tthis._repositories.add(repository);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tisRepositoryClosed(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tthis.workspaceState.update('closedRepositories', [...this._repositories.values()]);\n\t\tcommands.executeCommand('setContext', 'git.closedRepositoryCount', this._repositories.size);\n\t}\n}\n\nclass ParentRepositoriesManager {\n\n\t/**\n\t * Key   - normalized path used in user interface\n\t * Value - value indicating whether the repository should be opened\n\t */\n\tprivate _repositories = new Set<string>;\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.values()];\n\t}\n\n\tconstructor(private readonly globalState: Memento) {\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string): void {\n\t\tthis._repositories.add(repository);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\thasRepository(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\topenRepository(repository: string): void {\n\t\tthis.globalState.update(`parentRepository:${repository}`, true);\n\t\tthis.deleteRepository(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tcommands.executeCommand('setContext', 'git.parentRepositoryCount', this._repositories.size);\n\t}\n}\n\nclass UnsafeRepositoriesManager {\n\n\t/**\n\t * Key   - normalized path used in user interface\n\t * Value - path extracted from the output of the `git status` command\n\t *         used when calling `git config --global --add safe.directory`\n\t */\n\tprivate _repositories = new Map<string, string>();\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.keys()];\n\t}\n\n\tconstructor() {\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string, path: string): void {\n\t\tthis._repositories.set(repository, path);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tgetRepositoryPath(repository: string): string | undefined {\n\t\treturn this._repositories.get(repository);\n\t}\n\n\thasRepository(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tcommands.executeCommand('setContext', 'git.unsafeRepositoryCount', this._repositories.size);\n\t}\n}\n\nexport class Model implements IBranchProtectionProviderRegistry, IRemoteSourcePublisherRegistry, IPostCommitCommandsProviderRegistry, IPushErrorHandlerRegistry {\n\n\tprivate _onDidOpenRepository = new EventEmitter<Repository>();\n\treadonly onDidOpenRepository: Event<Repository> = this._onDidOpenRepository.event;\n\n\tprivate _onDidCloseRepository = new EventEmitter<Repository>();\n\treadonly onDidCloseRepository: Event<Repository> = this._onDidCloseRepository.event;\n\n\tprivate _onDidChangeRepository = new EventEmitter<ModelChangeEvent>();\n\treadonly onDidChangeRepository: Event<ModelChangeEvent> = this._onDidChangeRepository.event;\n\n\tprivate _onDidChangeOriginalResource = new EventEmitter<OriginalResourceChangeEvent>();\n\treadonly onDidChangeOriginalResource: Event<OriginalResourceChangeEvent> = this._onDidChangeOriginalResource.event;\n\n\tprivate openRepositories: OpenRepository[] = [];\n\tget repositories(): Repository[] { return this.openRepositories.map(r => r.repository); }\n\n\tprivate possibleGitRepositoryPaths = new Set<string>();\n\n\tprivate _onDidChangeState = new EventEmitter<State>();\n\treadonly onDidChangeState = this._onDidChangeState.event;\n\n\tprivate _onDidPublish = new EventEmitter<PublishEvent>();\n\treadonly onDidPublish = this._onDidPublish.event;\n\n\tfirePublishEvent(repository: Repository, branch?: string) {\n\t\tthis._onDidPublish.fire({ repository: new ApiRepository(repository), branch: branch });\n\t}\n\n\tprivate _state: State = 'uninitialized';\n\tget state(): State { return this._state; }\n\n\tsetState(state: State): void {\n\t\tthis._state = state;\n\t\tthis._onDidChangeState.fire(state);\n\t\tcommands.executeCommand('setContext', 'git.state', state);\n\t}\n\n\t@memoize\n\tget isInitialized(): Promise<void> {\n\t\tif (this._state === 'initialized') {\n\t\t\treturn Promise.resolve();\n\t\t}\n\n\t\treturn eventToPromise(filterEvent(this.onDidChangeState, s => s === 'initialized')) as Promise<any>;\n\t}\n\n\tprivate remoteSourcePublishers = new Set<RemoteSourcePublisher>();\n\n\tprivate _onDidAddRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();\n\treadonly onDidAddRemoteSourcePublisher = this._onDidAddRemoteSourcePublisher.event;\n\n\tprivate _onDidRemoveRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();\n\treadonly onDidRemoveRemoteSourcePublisher = this._onDidRemoveRemoteSourcePublisher.event;\n\n\tprivate postCommitCommandsProviders = new Set<PostCommitCommandsProvider>();\n\n\tprivate _onDidChangePostCommitCommandsProviders = new EventEmitter<void>();\n\treadonly onDidChangePostCommitCommandsProviders = this._onDidChangePostCommitCommandsProviders.event;\n\n\tprivate branchProtectionProviders = new Map<string, Set<BranchProtectionProvider>>();\n\n\tprivate _onDidChangeBranchProtectionProviders = new EventEmitter<Uri>();\n\treadonly onDidChangeBranchProtectionProviders = this._onDidChangeBranchProtectionProviders.event;\n\n\tprivate pushErrorHandlers = new Set<PushErrorHandler>();\n\n\tprivate _unsafeRepositoriesManager: UnsafeRepositoriesManager;\n\tget unsafeRepositories(): string[] {\n\t\treturn this._unsafeRepositoriesManager.repositories;\n\t}\n\n\tprivate _parentRepositoriesManager: ParentRepositoriesManager;\n\tget parentRepositories(): string[] {\n\t\treturn this._parentRepositoriesManager.repositories;\n\t}\n\n\tprivate _closedRepositoriesManager: ClosedRepositoriesManager;\n\tget closedRepositories(): string[] {\n\t\treturn [...this._closedRepositoriesManager.repositories];\n\t}\n\n\t/**\n\t * We maintain a map containing both the path and the canonical path of the\n\t * workspace folders. We are doing this as `git.exe` expands the symbolic links\n\t * while there are scenarios in which VS Code does not.\n\t *\n\t * Key   - path of the workspace folder\n\t * Value - canonical path of the workspace folder\n\t */\n\tprivate _workspaceFolders = new Map<string, string>();\n\n\tprivate disposables: Disposable[] = [];\n\n\tconstructor(readonly git: Git, private readonly askpass: Askpass, private globalState: Memento, readonly workspaceState: Memento, private logger: LogOutputChannel, private telemetryReporter: TelemetryReporter) {\n\t\t// Repositories managers\n\t\tthis._closedRepositoriesManager = new ClosedRepositoriesManager(workspaceState);\n\t\tthis._parentRepositoriesManager = new ParentRepositoriesManager(globalState);\n\t\tthis._unsafeRepositoriesManager = new UnsafeRepositoriesManager();\n\n\t\tworkspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders, this, this.disposables);\n\t\twindow.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, this.disposables);\n\t\tworkspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.disposables);\n\n\t\tconst fsWatcher = workspace.createFileSystemWatcher('**');\n\t\tthis.disposables.push(fsWatcher);\n\n\t\tconst onWorkspaceChange = anyEvent(fsWatcher.onDidChange, fsWatcher.onDidCreate, fsWatcher.onDidDelete);\n\t\tconst onGitRepositoryChange = filterEvent(onWorkspaceChange, uri => /\\/\\.git/.test(uri.path));\n\t\tconst onPossibleGitRepositoryChange = filterEvent(onGitRepositoryChange, uri => !this.getRepository(uri));\n\t\tonPossibleGitRepositoryChange(this.onPossibleGitRepositoryChange, this, this.disposables);\n\n\t\tthis.setState('uninitialized');\n\t\tthis.doInitialScan().finally(() => this.setState('initialized'));\n\t}\n\n\tprivate async doInitialScan(): Promise<void> {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tconst parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');\n\n\t\t// Initial repository scan function\n\t\tconst initialScanFn = () => Promise.all([\n\t\t\tthis.onDidChangeWorkspaceFolders({ added: workspace.workspaceFolders || [], removed: [] }),\n\t\t\tthis.onDidChangeVisibleTextEditors(window.visibleTextEditors),\n\t\t\tthis.scanWorkspaceFolders()\n\t\t]);\n\n\t\tif (config.get<boolean>('showProgress', true)) {\n\t\t\tawait window.withProgress({ location: ProgressLocation.SourceControl }, initialScanFn);\n\t\t} else {\n\t\t\tawait initialScanFn();\n\t\t}\n\n\t\tif (this.parentRepositories.length !== 0 &&\n\t\t\tparentRepositoryConfig === 'prompt') {\n\t\t\t// Parent repositories notification\n\t\t\tthis.showParentRepositoryNotification();\n\t\t} else if (this.unsafeRepositories.length !== 0) {\n\t\t\t// Unsafe repositories notification\n\t\t\tthis.showUnsafeRepositoryNotification();\n\t\t}\n\n\t\t/* __GDPR__\n\t\t\t\"git.repositoryInitialScan\" : {\n\t\t\t\t\"owner\": \"lszomoru\",\n\t\t\t\t\"autoRepositoryDetection\": { \"classification\": \"SystemMetaData\", \"purpose\": \"FeatureInsight\", \"comment\": \"Setting that controls the initial repository scan\" },\n\t\t\t\t\"repositoryCount\": { \"classification\": \"SystemMetaData\", \"purpose\": \"FeatureInsight\", \"isMeasurement\": true, \"comment\": \"Number of repositories opened during initial repository scan\" }\n\t\t\t}\n\t\t*/\n\t\tthis.telemetryReporter.sendTelemetryEvent('git.repositoryInitialScan', { autoRepositoryDetection: String(autoRepositoryDetection) }, { repositoryCount: this.openRepositories.length });\n\t}\n\n\t/**\n\t * Scans each workspace folder, looking for git repositories. By\n\t * default it scans one level deep but that can be changed using\n\t * the git.repositoryScanMaxDepth setting.\n\t */\n\tprivate async scanWorkspaceFolders(): Promise<void> {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tthis.logger.trace(`[swsf] Scan workspace sub folders. autoRepositoryDetection=${autoRepositoryDetection}`);\n\n\t\tif (autoRepositoryDetection !== true && autoRepositoryDetection !== 'subFolders') {\n\t\t\treturn;\n\t\t}\n\n\t\tawait Promise.all((workspace.workspaceFolders || []).map(async folder => {\n\t\t\tconst root = folder.uri.fsPath;\n\t\t\tthis.logger.trace(`[swsf] Workspace folder: ${root}`);\n\n\t\t\t// Workspace folder children\n\t\t\tconst repositoryScanMaxDepth = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<number>('repositoryScanMaxDepth', 1);\n\t\t\tconst repositoryScanIgnoredFolders = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('repositoryScanIgnoredFolders', []);\n\n\t\t\tconst subfolders = new Set(await this.traverseWorkspaceFolder(root, repositoryScanMaxDepth, repositoryScanIgnoredFolders));\n\n\t\t\t// Repository scan folders\n\t\t\tconst scanPaths = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('scanRepositories') || [];\n\t\t\tthis.logger.trace(`[swsf] Workspace scan settings: repositoryScanMaxDepth=${repositoryScanMaxDepth}; repositoryScanIgnoredFolders=[${repositoryScanIgnoredFolders.join(', ')}]; scanRepositories=[${scanPaths.join(', ')}]`);\n\n\t\t\tfor (const scanPath of scanPaths) {\n\t\t\t\tif (scanPath === '.git') {\n\t\t\t\t\tthis.logger.trace('[swsf] \\'.git\\' not supported in \\'git.scanRepositories\\' setting.');\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tif (path.isAbsolute(scanPath)) {\n\t\t\t\t\tconst notSupportedMessage = l10n.t('Absolute paths not supported in \"git.scanRepositories\" setting.');\n\t\t\t\t\tthis.logger.warn(notSupportedMessage);\n\t\t\t\t\tconsole.warn(notSupportedMessage);\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tsubfolders.add(path.join(root, scanPath));\n\t\t\t}\n\n\t\t\tthis.logger.trace(`[swsf] Workspace scan sub folders: [${[...subfolders].join(', ')}]`);\n\t\t\tawait Promise.all([...subfolders].map(f => this.openRepository(f)));\n\t\t}));\n\t}\n\n\tprivate async traverseWorkspaceFolder(workspaceFolder: string, maxDepth: number, repositoryScanIgnoredFolders: string[]): Promise<string[]> {\n\t\tconst result: string[] = [];\n\t\tconst foldersToTravers = [{ path: workspaceFolder, depth: 0 }];\n\n\t\twhile (foldersToTravers.length > 0) {\n\t\t\tconst currentFolder = foldersToTravers.shift()!;\n\n\t\t\tif (currentFolder.depth < maxDepth || maxDepth === -1) {\n\t\t\t\tconst children = await fs.promises.readdir(currentFolder.path, { withFileTypes: true });\n\t\t\t\tconst childrenFolders = children\n\t\t\t\t\t.filter(dirent =>\n\t\t\t\t\t\tdirent.isDirectory() && dirent.name !== '.git' &&\n\t\t\t\t\t\t!repositoryScanIgnoredFolders.find(f => pathEquals(dirent.name, f)))\n\t\t\t\t\t.map(dirent => path.join(currentFolder.path, dirent.name));\n\n\t\t\t\tresult.push(...childrenFolders);\n\t\t\t\tfoldersToTravers.push(...childrenFolders.map(folder => {\n\t\t\t\t\treturn { path: folder, depth: currentFolder.depth + 1 };\n\t\t\t\t}));\n\t\t\t}\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tprivate onPossibleGitRepositoryChange(uri: Uri): void {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\n\t\tif (autoRepositoryDetection === false) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.eventuallyScanPossibleGitRepository(uri.fsPath.replace(/\\.git.*$/, ''));\n\t}\n\n\tprivate eventuallyScanPossibleGitRepository(path: string) {\n\t\tthis.possibleGitRepositoryPaths.add(path);\n\t\tthis.eventuallyScanPossibleGitRepositories();\n\t}\n\n\t@debounce(500)\n\tprivate eventuallyScanPossibleGitRepositories(): void {\n\t\tfor (const path of this.possibleGitRepositoryPaths) {\n\t\t\tthis.openRepository(path);\n\t\t}\n\n\t\tthis.possibleGitRepositoryPaths.clear();\n\t}\n\n\tprivate async onDidChangeWorkspaceFolders({ added, removed }: WorkspaceFoldersChangeEvent): Promise<void> {\n\t\tconst possibleRepositoryFolders = added\n\t\t\t.filter(folder => !this.getOpenRepository(folder.uri));\n\n\t\tconst activeRepositoriesList = window.visibleTextEditors\n\t\t\t.map(editor => this.getRepository(editor.document.uri))\n\t\t\t.filter(repository => !!repository) as Repository[];\n\n\t\tconst activeRepositories = new Set<Repository>(activeRepositoriesList);\n\t\tconst openRepositoriesToDispose = removed\n\t\t\t.map(folder => this.getOpenRepository(folder.uri))\n\t\t\t.filter(r => !!r)\n\t\t\t.filter(r => !activeRepositories.has(r!.repository))\n\t\t\t.filter(r => !(workspace.workspaceFolders || []).some(f => isDescendant(f.uri.fsPath, r!.repository.root))) as OpenRepository[];\n\n\t\topenRepositoriesToDispose.forEach(r => r.dispose());\n\t\tthis.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);\n\t\tawait Promise.all(possibleRepositoryFolders.map(p => this.openRepository(p.uri.fsPath)));\n\t}\n\n\tprivate onDidChangeConfiguration(): void {\n\t\tconst possibleRepositoryFolders = (workspace.workspaceFolders || [])\n\t\t\t.filter(folder => workspace.getConfiguration('git', folder.uri).get<boolean>('enabled') === true)\n\t\t\t.filter(folder => !this.getOpenRepository(folder.uri));\n\n\t\tconst openRepositoriesToDispose = this.openRepositories\n\t\t\t.map(repository => ({ repository, root: Uri.file(repository.repository.root) }))\n\t\t\t.filter(({ root }) => workspace.getConfiguration('git', root).get<boolean>('enabled') !== true)\n\t\t\t.map(({ repository }) => repository);\n\n\t\tthis.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);\n\t\tpossibleRepositoryFolders.forEach(p => this.openRepository(p.uri.fsPath));\n\t\topenRepositoriesToDispose.forEach(r => r.dispose());\n\t}\n\n\tprivate async onDidChangeVisibleTextEditors(editors: readonly TextEditor[]): Promise<void> {\n\t\tif (!workspace.isTrusted) {\n\t\t\tthis.logger.trace('[svte] Workspace is not trusted.');\n\t\t\treturn;\n\t\t}\n\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tthis.logger.trace(`[svte] Scan visible text editors. autoRepositoryDetection=${autoRepositoryDetection}`);\n\n\t\tif (autoRepositoryDetection !== true && autoRepositoryDetection !== 'openEditors') {\n\t\t\treturn;\n\t\t}\n\n\t\tawait Promise.all(editors.map(async editor => {\n\t\t\tconst uri = editor.document.uri;\n\n\t\t\tif (uri.scheme !== 'file') {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tconst repository = this.getRepository(uri);\n\n\t\t\tif (repository) {\n\t\t\t\tthis.logger.trace(`[svte] Repository for editor resource ${uri.fsPath} already exists: ${repository.root}`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tthis.logger.trace(`[svte] Open repository for editor resource ${uri.fsPath}`);\n\t\t\tawait this.openRepository(path.dirname(uri.fsPath));\n\t\t}));\n\t}\n\n\t@sequentialize\n\tasync openRepository(repoPath: string, openIfClosed = false): Promise<void> {\n\t\tthis.logger.trace(`Opening repository: ${repoPath}`);\n\t\tconst existingRepository = await this.getRepositoryExact(repoPath);\n\t\tif (existingRepository) {\n\t\t\tthis.logger.trace(`Repository for path ${repoPath} already exists: ${existingRepository.root})`);\n\t\t\treturn;\n\t\t}\n\n\t\tconst config = workspace.getConfiguration('git', Uri.file(repoPath));\n\t\tconst enabled = config.get<boolean>('enabled') === true;\n\n\t\tif (!enabled) {\n\t\t\tthis.logger.trace('Git is not enabled');\n\t\t\treturn;\n\t\t}\n\n\t\tif (!workspace.isTrusted) {\n\t\t\t// Check if the folder is a bare repo: if it has a file named HEAD && `rev-parse --show -cdup` is empty\n\t\t\ttry {\n\t\t\t\tfs.accessSync(path.join(repoPath, 'HEAD'), fs.constants.F_OK);\n\t\t\t\tconst result = await this.git.exec(repoPath, ['-C', repoPath, 'rev-parse', '--show-cdup']);\n\t\t\t\tif (result.stderr.trim() === '' && result.stdout.trim() === '') {\n\t\t\t\t\tthis.logger.trace(`Bare repository: ${repoPath}`);\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t} catch {\n\t\t\t\t// If this throw, we should be good to open the repo (e.g. HEAD doesn't exist)\n\t\t\t}\n\t\t}\n\n\t\ttry {\n\t\t\tconst { repositoryRoot, unsafeRepositoryMatch } = await this.getRepositoryRoot(repoPath);\n\t\t\tthis.logger.trace(`Repository root for path ${repoPath} is: ${repositoryRoot}`);\n\n\t\t\tconst existingRepository = await this.getRepositoryExact(repositoryRoot);\n\t\t\tif (existingRepository) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} already exists: ${existingRepository.root}`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (this.shouldRepositoryBeIgnored(repositoryRoot)) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} is ignored`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Handle git repositories that are in parent folders\n\t\t\tconst parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');\n\t\t\tif (parentRepositoryConfig !== 'always' && this.globalState.get<boolean>(`parentRepository:${repositoryRoot}`) !== true) {\n\t\t\t\tconst isRepositoryOutsideWorkspace = await this.isRepositoryOutsideWorkspace(repositoryRoot);\n\t\t\t\tif (isRepositoryOutsideWorkspace) {\n\t\t\t\t\tthis.logger.trace(`Repository in parent folder: ${repositoryRoot}`);\n\n\t\t\t\t\tif (!this._parentRepositoriesManager.hasRepository(repositoryRoot)) {\n\t\t\t\t\t\t// Show a notification if the parent repository is opened after the initial scan\n\t\t\t\t\t\tif (this.state === 'initialized' && parentRepositoryConfig === 'prompt') {\n\t\t\t\t\t\t\tthis.showParentRepositoryNotification();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis._parentRepositoriesManager.addRepository(repositoryRoot);\n\t\t\t\t\t}\n\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t// Handle unsafe repositories\n\t\t\tif (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {\n\t\t\t\tthis.logger.trace(`Unsafe repository: ${repositoryRoot}`);\n\n\t\t\t\t// Show a notification if the unsafe repository is opened after the initial scan\n\t\t\t\tif (this._state === 'initialized' && !this._unsafeRepositoriesManager.hasRepository(repositoryRoot)) {\n\t\t\t\t\tthis.showUnsafeRepositoryNotification();\n\t\t\t\t}\n\n\t\t\t\tthis._unsafeRepositoriesManager.addRepository(repositoryRoot, unsafeRepositoryMatch[2]);\n\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Handle repositories that were closed by the user\n\t\t\tif (!openIfClosed && this._closedRepositoriesManager.isRepositoryClosed(repositoryRoot)) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} is closed`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Open repository\n\t\t\tconst dotGit = await this.git.getRepositoryDotGit(repositoryRoot);\n\t\t\tconst repository = new Repository(this.git.open(repositoryRoot, dotGit, this.logger), this, this, this, this, this.globalState, this.logger, this.telemetryReporter);\n\n\t\t\tthis.open(repository);\n\t\t\tthis._closedRepositoriesManager.deleteRepository(repository.root);\n\n\t\t\t// Do not await this, we want SCM\n\t\t\t// to know about the repo asap\n\t\t\trepository.status();\n\t\t} catch (err) {\n\t\t\t// noop\n\t\t\tthis.logger.trace(`Opening repository for path='${repoPath}' failed; ex=${err}`);\n\t\t}\n\t}\n\n\tasync openParentRepository(repoPath: string): Promise<void> {\n\t\tawait this.openRepository(repoPath);\n\t\tthis._parentRepositoriesManager.openRepository(repoPath);\n\t}\n\n\tprivate async getRepositoryRoot(repoPath: string): Promise<{ repositoryRoot: string; unsafeRepositoryMatch: RegExpMatchArray | null }> {\n\t\ttry {\n\t\t\tconst rawRoot = await this.git.getRepositoryRoot(repoPath);\n\n\t\t\t// This can happen whenever `path` has the wrong case sensitivity in case\n\t\t\t// insensitive file systems https://github.com/microsoft/vscode/issues/33498\n\t\t\treturn { repositoryRoot: Uri.file(rawRoot).fsPath, unsafeRepositoryMatch: null };\n\t\t} catch (err) {\n\t\t\t// Handle unsafe repository\n\t\t\tconst unsafeRepositoryMatch = /^fatal: detected dubious ownership in repository at \\'([^']+)\\'[\\s\\S]*git config --global --add safe\\.directory '?([^'\\n]+)'?$/m.exec(err.stderr);\n\t\t\tif (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {\n\t\t\t\treturn { repositoryRoot: path.normalize(unsafeRepositoryMatch[1]), unsafeRepositoryMatch };\n\t\t\t}\n\n\t\t\tthrow err;\n\t\t}\n\t}\n\n\tprivate shouldRepositoryBeIgnored(repositoryRoot: string): boolean {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst ignoredRepos = config.get<string[]>('ignoredRepositories') || [];\n\n\t\tfor (const ignoredRepo of ignoredRepos) {\n\t\t\tif (path.isAbsolute(ignoredRepo)) {\n\t\t\t\tif (pathEquals(ignoredRepo, repositoryRoot)) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tfor (const folder of workspace.workspaceFolders || []) {\n\t\t\t\t\tif (pathEquals(path.join(folder.uri.fsPath, ignoredRepo), repositoryRoot)) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn false;\n\t}\n\n\tprivate open(repository: Repository): void {\n\t\tthis.logger.info(`Open repository: ${repository.root}`);\n\n\t\tconst onDidDisappearRepository = filterEvent(repository.onDidChangeState, state => state === RepositoryState.Disposed);\n\t\tconst disappearListener = onDidDisappearRepository(() => dispose());\n\t\tconst changeListener = repository.onDidChangeRepository(uri => this._onDidChangeRepository.fire({ repository, uri }));\n\t\tconst originalResourceChangeListener = repository.onDidChangeOriginalResource(uri => this._onDidChangeOriginalResource.fire({ repository, uri }));\n\n\t\tconst shouldDetectSubmodules = workspace\n\t\t\t.getConfiguration('git', Uri.file(repository.root))\n\t\t\t.get<boolean>('detectSubmodules') as boolean;\n\n\t\tconst submodulesLimit = workspace\n\t\t\t.getConfiguration('git', Uri.file(repository.root))\n\t\t\t.get<number>('detectSubmodulesLimit') as number;\n\n\t\tconst checkForSubmodules = () => {\n\t\t\tif (!shouldDetectSubmodules) {\n\t\t\t\tthis.logger.trace('Automatic detection of git submodules is not enabled.');\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (repository.submodules.length > submodulesLimit) {\n\t\t\t\twindow.showWarningMessage(l10n.t('The \"{0}\" repository has {1} submodules which won\\'t be opened automatically. You can still open each one individually by opening a file within.', path.basename(repository.root), repository.submodules.length));\n\t\t\t\tstatusListener.dispose();\n\t\t\t}\n\n\t\t\trepository.submodules\n\t\t\t\t.slice(0, submodulesLimit)\n\t\t\t\t.map(r => path.join(repository.root, r.path))\n\t\t\t\t.forEach(p => {\n\t\t\t\t\tthis.logger.trace(`Opening submodule: '${p}'`);\n\t\t\t\t\tthis.eventuallyScanPossibleGitRepository(p);\n\t\t\t\t});\n\t\t};\n\n\t\tconst updateMergeChanges = () => {\n\t\t\t// set mergeChanges context\n\t\t\tconst mergeChanges: Uri[] = [];\n\t\t\tfor (const { repository } of this.openRepositories.values()) {\n\t\t\t\tfor (const state of repository.mergeGroup.resourceStates) {\n\t\t\t\t\tmergeChanges.push(state.resourceUri);\n\t\t\t\t}\n\t\t\t}\n\t\t\tcommands.executeCommand('setContext', 'git.mergeChanges', mergeChanges);\n\t\t};\n\n\t\tconst statusListener = repository.onDidRunGitStatus(() => {\n\t\t\tcheckForSubmodules();\n\t\t\tupdateMergeChanges();\n\t\t});\n\t\tcheckForSubmodules();\n\n\t\tconst updateOperationInProgressContext = () => {\n\t\t\tlet operationInProgress = false;\n\t\t\tfor (const { repository } of this.openRepositories.values()) {\n\t\t\t\tif (repository.operations.shouldDisableCommands()) {\n\t\t\t\t\toperationInProgress = true;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tcommands.executeCommand('setContext', 'operationInProgress', operationInProgress);\n\t\t};\n\n\t\tconst operationEvent = anyEvent(repository.onDidRunOperation as Event<any>, repository.onRunOperation as Event<any>);\n\t\tconst operationListener = operationEvent(() => updateOperationInProgressContext());\n\t\tupdateOperationInProgressContext();\n\n\t\tconst dispose = () => {\n\t\t\tdisappearListener.dispose();\n\t\t\tchangeListener.dispose();\n\t\t\toriginalResourceChangeListener.dispose();\n\t\t\tstatusListener.dispose();\n\t\t\toperationListener.dispose();\n\t\t\trepository.dispose();\n\n\t\t\tthis.openRepositories = this.openRepositories.filter(e => e !== openRepository);\n\t\t\tthis._onDidCloseRepository.fire(repository);\n\t\t};\n\n\t\tconst openRepository = { repository, dispose };\n\t\tthis.openRepositories.push(openRepository);\n\t\tupdateMergeChanges();\n\t\tthis._onDidOpenRepository.fire(repository);\n\t}\n\n\tclose(repository: Repository): void {\n\t\tconst openRepository = this.getOpenRepository(repository);\n\n\t\tif (!openRepository) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.logger.info(`Close repository: ${repository.root}`);\n\t\tthis._closedRepositoriesManager.addRepository(openRepository.repository.root);\n\n\t\topenRepository.dispose();\n\t}\n\n\tasync pickRepository(): Promise<Repository | undefined> {\n\t\tif (this.openRepositories.length === 0) {\n\t\t\tthrow new Error(l10n.t('There are no available repositories'));\n\t\t}\n\n\t\tconst picks = this.openRepositories.map((e, index) => new RepositoryPick(e.repository, index));\n\t\tconst active = window.activeTextEditor;\n\t\tconst repository = active && this.getRepository(active.document.fileName);\n\t\tconst index = picks.findIndex(pick => pick.repository === repository);\n\n\t\t// Move repository pick containing the active text editor to appear first\n\t\tif (index > -1) {\n\t\t\tpicks.unshift(...picks.splice(index, 1));\n\t\t}\n\n\t\tconst placeHolder = l10n.t('Choose a repository');\n\t\tconst pick = await window.showQuickPick(picks, { placeHolder });\n\n\t\treturn pick && pick.repository;\n\t}\n\n\tgetRepository(sourceControl: SourceControl): Repository | undefined;\n\tgetRepository(resourceGroup: SourceControlResourceGroup): Repository | undefined;\n\tgetRepository(path: string): Repository | undefined;\n\tgetRepository(resource: Uri): Repository | undefined;\n\tgetRepository(hint: any): Repository | undefined {\n\t\tconst liveRepository = this.getOpenRepository(hint);\n\t\treturn liveRepository && liveRepository.repository;\n\t}\n\n\tprivate async getRepositoryExact(repoPath: string): Promise<Repository | undefined> {\n\t\tconst repoPathCanonical = await fs.promises.realpath(repoPath, { encoding: 'utf8' });\n\n\t\tfor (const openRepository of this.openRepositories) {\n\t\t\tconst rootPathCanonical = await fs.promises.realpath(openRepository.repository.root, { encoding: 'utf8' });\n\t\t\tif (pathEquals(rootPathCanonical, repoPathCanonical)) {\n\t\t\t\treturn openRepository.repository;\n\t\t\t}\n\t\t}\n\n\t\treturn undefined;\n\t}\n\n\tprivate getOpenRepository(repository: Repository): OpenRepository | undefined;\n\tprivate getOpenRepository(sourceControl: SourceControl): OpenRepository | undefined;\n\tprivate getOpenRepository(resourceGroup: SourceControlResourceGroup): OpenRepository | undefined;\n\tprivate getOpenRepository(path: string): OpenRepository | undefined;\n\tprivate getOpenRepository(resource: Uri): OpenRepository | undefined;\n\tprivate getOpenRepository(hint: any): OpenRepository | undefined {\n\t\tif (!hint) {\n\t\t\treturn undefined;\n\t\t}\n\n\t\tif (hint instanceof Repository) {\n\t\t\treturn this.openRepositories.filter(r => r.repository === hint)[0];\n\t\t}\n\n\t\tif (hint instanceof ApiRepository) {\n\t\t\treturn this.openRepositories.filter(r => r.repository === hint.repository)[0];\n\t\t}\n\n\t\tif (typeof hint === 'string') {\n\t\t\thint = Uri.file(hint);\n\t\t}\n\n\t\tif (hint instanceof Uri) {\n\t\t\tlet resourcePath: string;\n\n\t\t\tif (hint.scheme === 'git') {\n\t\t\t\tresourcePath = fromGitUri(hint).path;\n\t\t\t} else {\n\t\t\t\tresourcePath = hint.fsPath;\n\t\t\t}\n\n\t\t\touter:\n\t\t\tfor (const liveRepository of this.openRepositories.sort((a, b) => b.repository.root.length - a.repository.root.length)) {\n\t\t\t\tif (!isDescendant(liveRepository.repository.root, resourcePath)) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tfor (const submodule of liveRepository.repository.submodules) {\n\t\t\t\t\tconst submoduleRoot = path.join(liveRepository.repository.root, submodule.path);\n\n\t\t\t\t\tif (isDescendant(submoduleRoot, resourcePath)) {\n\t\t\t\t\t\tcontinue outer;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\n\t\t\treturn undefined;\n\t\t}\n\n\t\tfor (const liveRepository of this.openRepositories) {\n\t\t\tconst repository = liveRepository.repository;\n\n\t\t\tif (hint === repository.sourceControl) {\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\n\t\t\tif (hint === repository.mergeGroup || hint === repository.indexGroup || hint === repository.workingTreeGroup || hint === repository.untrackedGroup) {\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\t\t}\n\n\t\treturn undefined;\n\t}\n\n\tgetRepositoryForSubmodule(submoduleUri: Uri): Repository | undefined {\n\t\tfor (const repository of this.repositories) {\n\t\t\tfor (const submodule of repository.submodules) {\n\t\t\t\tconst submodulePath = path.join(repository.root, submodule.path);\n\n\t\t\t\tif (submodulePath === submoduleUri.fsPath) {\n\t\t\t\t\treturn repository;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn undefined;\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[742,747)",
			"modifiedRange": "[742,751)",
			"innerChanges": [
				{
					"originalRange": "[742,1 -> 742,1]",
					"modifiedRange": "[742,1 -> 743,8]"
				},
				{
					"originalRange": "[742,24 -> 742,25]",
					"modifiedRange": "[743,29 -> 743,31]"
				},
				{
					"originalRange": "[742,47 -> 742,63]",
					"modifiedRange": "[743,53 -> 743,54]"
				},
				{
					"originalRange": "[743,57 -> 743,58]",
					"modifiedRange": "[744,57 -> 744,71]"
				},
				{
					"originalRange": "[744,4 -> 744,11]",
					"modifiedRange": "[745,4 -> 745,8]"
				},
				{
					"originalRange": "[744,59 -> 745,6 EOL]",
					"modifiedRange": "[745,56 -> 745,59 EOL]"
				},
				{
					"originalRange": "[746,24 -> 746,25]",
					"modifiedRange": "[746,26 -> 746,26]"
				},
				{
					"originalRange": "[747,1 -> 747,1]",
					"modifiedRange": "[747,4 -> 751,1]"
				}
			]
		},
		{
			"originalRange": "[815,815)",
			"modifiedRange": "[819,832)",
			"innerChanges": [
				{
					"originalRange": "[815,1 -> 815,1]",
					"modifiedRange": "[819,2 -> 832,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

````

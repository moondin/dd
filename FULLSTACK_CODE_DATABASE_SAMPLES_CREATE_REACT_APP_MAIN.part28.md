---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 28
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 28 of 37)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - create-react-app-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/create-react-app-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: firefox.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/parser/firefox.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { parse } from '../../utils/parser';

test('eval 1', () => {
  expect(
    parse(
      `test1@file:///C:/example.html line 7 > eval line 1 > eval:1:1
test2@file:///C:/example.html line 7 > eval:1:1
test3@file:///C:/example.html:7:6`.split('\n')
    )
  ).toMatchSnapshot();
});

test('eval 2', () => {
  expect(
    parse({
      stack: `anonymous@file:///C:/example.html line 7 > Function:1:1
@file:///C:/example.html:7:6`,
    })
  ).toMatchSnapshot();
});

test('stack with eval', () => {
  expect(
    parse(
      `e@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:25:9
@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html line 17 > eval:1:1
a@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:8:9
@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:32:7`
    )
  ).toMatchSnapshot();
});

test('v14 to v29', () => {
  expect(
    parse(
      `trace@file:///C:/example.html:9
b@file:///C:/example.html:16
a@file:///C:/example.html:19
@file:///C:/example.html:21`
    )
  ).toMatchSnapshot();
});

test('v30+', () => {
  expect(
    parse(
      `trace@file:///C:/example.html:9:17
b@file:///C:/example.html:16:13
a@file:///C:/example.html:19:13
@file:///C:/example.html:21:9`
    )
  ).toMatchSnapshot();
});
```

--------------------------------------------------------------------------------

---[FILE: generic.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/parser/generic.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { parse } from '../../utils/parser';

test('throws on null', () => {
  let error;
  try {
    parse(null);
  } catch (e) {
    error = e;
  }
  expect(error instanceof Error).toBe(true);
  expect(error.message).toBe('You cannot pass a null object.');
});

test('throws on unparsable', () => {
  let error;
  try {
    parse({});
  } catch (e) {
    error = e;
  }
  expect(error instanceof Error).toBe(true);
  expect(error.message).toBe(
    'The error you provided does not contain a stack trace.'
  );
});
```

--------------------------------------------------------------------------------

---[FILE: react.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/parser/react.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { parse } from '../../utils/parser';

test('15.y.z', () => {
  expect(
    parse(
      `Warning: Each child in array should have a unique "key" prop. Check render method of \`FileA\`.
     in div (at FileA.js:9)
     in FileA (at App.js:9)
     in div (at App.js:8)
     in App (at index.js:7)`
    )
  ).toMatchSnapshot();
});
```

--------------------------------------------------------------------------------

---[FILE: safari.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/parser/safari.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { parse } from '../../utils/parser';

test('stack with eval', () => {
  expect(
    parse(
      `e@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:25:18
eval code
eval@[native code]
a@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:8:10
global code@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:32:8`
    )
  ).toMatchSnapshot();
});
```

--------------------------------------------------------------------------------

---[FILE: chrome.js.snap]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/parser/__snapshots__/chrome.js.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`stack with eval 1`] = `
Array [
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 18,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": "e",
    "lineNumber": 25,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 9,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": "eval",
    "lineNumber": 12,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 9,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": "a",
    "lineNumber": 8,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 7,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": null,
    "lineNumber": 32,
  },
]
`;
```

--------------------------------------------------------------------------------

---[FILE: firefox.js.snap]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/parser/__snapshots__/firefox.js.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`eval 1 1`] = `
Array [
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "file:///C:/example.html",
    "functionName": "test1",
    "lineNumber": 7,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "file:///C:/example.html",
    "functionName": "test2",
    "lineNumber": 7,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 6,
    "fileName": "file:///C:/example.html",
    "functionName": "test3",
    "lineNumber": 7,
  },
]
`;

exports[`eval 2 1`] = `
Array [
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "file:///C:/example.html",
    "functionName": "anonymous",
    "lineNumber": 7,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 6,
    "fileName": "file:///C:/example.html",
    "functionName": null,
    "lineNumber": 7,
  },
]
`;

exports[`stack with eval 1`] = `
Array [
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 9,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": "e",
    "lineNumber": 25,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": "eval",
    "lineNumber": 17,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 9,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": "a",
    "lineNumber": 8,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 7,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": null,
    "lineNumber": 32,
  },
]
`;

exports[`v14 to v29 1`] = `
Array [
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "file:///C:/example.html",
    "functionName": "trace",
    "lineNumber": 9,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "file:///C:/example.html",
    "functionName": "b",
    "lineNumber": 16,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "file:///C:/example.html",
    "functionName": "a",
    "lineNumber": 19,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "file:///C:/example.html",
    "functionName": null,
    "lineNumber": 21,
  },
]
`;

exports[`v30+ 1`] = `
Array [
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 17,
    "fileName": "file:///C:/example.html",
    "functionName": "trace",
    "lineNumber": 9,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 13,
    "fileName": "file:///C:/example.html",
    "functionName": "b",
    "lineNumber": 16,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 13,
    "fileName": "file:///C:/example.html",
    "functionName": "a",
    "lineNumber": 19,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 9,
    "fileName": "file:///C:/example.html",
    "functionName": null,
    "lineNumber": 21,
  },
]
`;
```

--------------------------------------------------------------------------------

---[FILE: react.js.snap]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/parser/__snapshots__/react.js.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`15.y.z 1`] = `
Array [
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "FileA.js",
    "functionName": "div",
    "lineNumber": 9,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "App.js",
    "functionName": "FileA",
    "lineNumber": 9,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "App.js",
    "functionName": "div",
    "lineNumber": 8,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": "index.js",
    "functionName": "App",
    "lineNumber": 7,
  },
]
`;
```

--------------------------------------------------------------------------------

---[FILE: safari.js.snap]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/parser/__snapshots__/safari.js.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`stack with eval 1`] = `
Array [
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 18,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": "e",
    "lineNumber": 25,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 10,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": "a",
    "lineNumber": 8,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": null,
    "_originalFunctionName": null,
    "_originalLineNumber": null,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": 8,
    "fileName": "file:///Users/joe/Documents/Development/OSS/stack-frame/index.html",
    "functionName": "global code",
    "lineNumber": 32,
  },
]
`;
```

--------------------------------------------------------------------------------

---[FILE: lines-around.js.snap]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/__snapshots__/lines-around.js.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`should return lines around from a string 1`] = `
Array [
  ScriptLine {
    "content": "two",
    "highlight": false,
    "lineNumber": 2,
  },
  ScriptLine {
    "content": "three",
    "highlight": false,
    "lineNumber": 3,
  },
  ScriptLine {
    "content": "four",
    "highlight": true,
    "lineNumber": 4,
  },
  ScriptLine {
    "content": "five",
    "highlight": false,
    "lineNumber": 5,
  },
  ScriptLine {
    "content": "six",
    "highlight": false,
    "lineNumber": 6,
  },
]
`;

exports[`should return lines around from an array 1`] = `
Array [
  ScriptLine {
    "content": "two",
    "highlight": false,
    "lineNumber": 2,
  },
  ScriptLine {
    "content": "three",
    "highlight": false,
    "lineNumber": 3,
  },
  ScriptLine {
    "content": "four",
    "highlight": true,
    "lineNumber": 4,
  },
  ScriptLine {
    "content": "five",
    "highlight": false,
    "lineNumber": 5,
  },
  ScriptLine {
    "content": "six",
    "highlight": false,
    "lineNumber": 6,
  },
]
`;
```

--------------------------------------------------------------------------------

---[FILE: script-lines.js.snap]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/__snapshots__/script-lines.js.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`script line shape 1`] = `
ScriptLine {
  "content": "foobar",
  "highlight": true,
  "lineNumber": 5,
}
`;

exports[`script line to provide default highlight 1`] = `
ScriptLine {
  "content": "foobar",
  "highlight": false,
  "lineNumber": 5,
}
`;
```

--------------------------------------------------------------------------------

---[FILE: stack-frame.js.snap]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/__snapshots__/stack-frame.js.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`proper empty shape 1`] = `
StackFrame {
  "_originalColumnNumber": null,
  "_originalFileName": null,
  "_originalFunctionName": null,
  "_originalLineNumber": null,
  "_originalScriptCode": null,
  "_scriptCode": null,
  "columnNumber": null,
  "fileName": null,
  "functionName": null,
  "lineNumber": null,
}
`;

exports[`proper full shape 1`] = `
StackFrame {
  "_originalColumnNumber": 13,
  "_originalFileName": "test.js",
  "_originalFunctionName": "apple",
  "_originalLineNumber": 37,
  "_originalScriptCode": null,
  "_scriptCode": null,
  "columnNumber": 37,
  "fileName": "b.js",
  "functionName": "a",
  "lineNumber": 13,
}
`;
```

--------------------------------------------------------------------------------

---[FILE: unmapper.js.snap]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/__snapshots__/unmapper.js.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`default context & unfound source 1`] = `
Array [
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": "B.js",
    "_originalFunctionName": "div",
    "_originalLineNumber": 8,
    "_originalScriptCode": Array [
      ScriptLine {
        "content": "    return (",
        "highlight": false,
        "lineNumber": 5,
      },
      ScriptLine {
        "content": "      <div>",
        "highlight": false,
        "lineNumber": 6,
      },
      ScriptLine {
        "content": "        {[1, 2].map(v => (",
        "highlight": false,
        "lineNumber": 7,
      },
      ScriptLine {
        "content": "          <div>{v}</div>",
        "highlight": true,
        "lineNumber": 8,
      },
      ScriptLine {
        "content": "        ))}",
        "highlight": false,
        "lineNumber": 9,
      },
      ScriptLine {
        "content": "      </div>",
        "highlight": false,
        "lineNumber": 10,
      },
      ScriptLine {
        "content": "    )",
        "highlight": false,
        "lineNumber": 11,
      },
    ],
    "_scriptCode": Array [
      ScriptLine {
        "content": "        },",
        "highlight": false,
        "lineNumber": 41463,
      },
      ScriptLine {
        "content": "        [1, 2].map(function (v) {",
        "highlight": false,
        "lineNumber": 41464,
      },
      ScriptLine {
        "content": "          return _react2.default.createElement(",
        "highlight": false,
        "lineNumber": 41465,
      },
      ScriptLine {
        "content": "            'div',",
        "highlight": true,
        "lineNumber": 41466,
      },
      ScriptLine {
        "content": "            {",
        "highlight": false,
        "lineNumber": 41467,
      },
      ScriptLine {
        "content": "              __source: {",
        "highlight": false,
        "lineNumber": 41468,
      },
      ScriptLine {
        "content": "                fileName: _jsxFileName,",
        "highlight": false,
        "lineNumber": 41469,
      },
    ],
    "columnNumber": null,
    "fileName": "/static/js/bundle.js",
    "functionName": "div",
    "lineNumber": 41466,
  },
  StackFrame {
    "_originalColumnNumber": null,
    "_originalFileName": "blabla.js",
    "_originalFunctionName": "unknown",
    "_originalLineNumber": 10,
    "_originalScriptCode": null,
    "_scriptCode": null,
    "columnNumber": null,
    "fileName": null,
    "functionName": null,
    "lineNumber": null,
  },
]
`;
```

--------------------------------------------------------------------------------

---[FILE: .npmignore]---
Location: create-react-app-main/packages/react-scripts/.npmignore

```text
/fixtures
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: create-react-app-main/packages/react-scripts/LICENSE

```text
MIT License

Copyright (c) 2013-present, Facebook, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: create-react-app-main/packages/react-scripts/package.json
Signals: React

```json
{
  "name": "react-scripts",
  "version": "5.1.0",
  "description": "Configuration and scripts for Create React App.",
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/create-react-app.git",
    "directory": "packages/react-scripts"
  },
  "license": "MIT",
  "engines": {
    "node": ">=14.0.0"
  },
  "bugs": {
    "url": "https://github.com/facebook/create-react-app/issues"
  },
  "files": [
    "bin",
    "config",
    "lib",
    "scripts",
    "template",
    "template-typescript",
    "utils"
  ],
  "bin": {
    "react-scripts": "./bin/react-scripts.js"
  },
  "types": "./lib/react-app.d.ts",
  "dependencies": {
    "@babel/core": "^7.16.0",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.3",
    "@svgr/webpack": "^5.5.0",
    "babel-jest": "^27.4.2",
    "babel-loader": "^8.2.3",
    "babel-plugin-named-asset-import": "^0.4.0",
    "babel-preset-react-app": "^10.1.0",
    "bfj": "^7.0.2",
    "browserslist": "^4.18.1",
    "camelcase": "^6.2.1",
    "case-sensitive-paths-webpack-plugin": "^2.4.0",
    "css-loader": "^6.5.1",
    "css-minimizer-webpack-plugin": "^3.2.0",
    "dotenv": "^10.0.0",
    "dotenv-expand": "^5.1.0",
    "eslint": "^8.3.0",
    "eslint-config-react-app": "^7.1.0",
    "eslint-webpack-plugin": "^3.1.1",
    "file-loader": "^6.2.0",
    "fs-extra": "^10.0.0",
    "html-webpack-plugin": "^5.5.0",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^27.4.3",
    "jest-resolve": "^27.4.2",
    "jest-watch-typeahead": "^1.0.0",
    "mini-css-extract-plugin": "^2.4.5",
    "postcss": "^8.4.4",
    "postcss-flexbugs-fixes": "^5.0.2",
    "postcss-loader": "^6.2.1",
    "postcss-normalize": "^10.0.1",
    "postcss-preset-env": "^7.0.1",
    "prompts": "^2.4.2",
    "react-app-polyfill": "^3.0.0",
    "react-dev-utils": "^12.1.0",
    "react-refresh": "^0.11.0",
    "resolve": "^1.20.0",
    "resolve-url-loader": "^4.0.0",
    "sass-loader": "^12.3.0",
    "semver": "^7.3.5",
    "source-map-loader": "^3.0.0",
    "style-loader": "^3.3.1",
    "tailwindcss": "^3.0.2",
    "terser-webpack-plugin": "^5.2.5",
    "webpack": "^5.64.4",
    "webpack-dev-server": "^4.6.0",
    "webpack-manifest-plugin": "^4.0.2",
    "workbox-webpack-plugin": "^6.4.1"
  },
  "devDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "optionalDependencies": {
    "fsevents": "^2.3.2"
  },
  "peerDependencies": {
    "react": ">= 16",
    "typescript": "^3.2.1 || ^4"
  },
  "peerDependenciesMeta": {
    "typescript": {
      "optional": true
    }
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: create-react-app-main/packages/react-scripts/README.md

```text
# react-scripts

This package includes scripts and configuration used by [Create React App](https://github.com/facebook/create-react-app).<br>
Please refer to its documentation:

- [Getting Started](https://facebook.github.io/create-react-app/docs/getting-started) – How to create a new app.
- [User Guide](https://facebook.github.io/create-react-app/) – How to develop apps bootstrapped with Create React App.
```

--------------------------------------------------------------------------------

---[FILE: react-scripts.js]---
Location: create-react-app-main/packages/react-scripts/bin/react-scripts.js

```javascript
#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const spawn = require('react-dev-utils/crossSpawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (['build', 'eject', 'start', 'test'].includes(script)) {
  const result = spawn.sync(
    process.execPath,
    nodeArgs
      .concat(require.resolve('../scripts/' + script))
      .concat(args.slice(scriptIndex + 1)),
    { stdio: 'inherit' }
  );
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      );
    }
    process.exit(1);
  }
  process.exit(result.status);
} else {
  console.log('Unknown script "' + script + '".');
  console.log('Perhaps you need to update react-scripts?');
  console.log(
    'See: https://facebook.github.io/create-react-app/docs/updating-to-new-releases'
  );
}
```

--------------------------------------------------------------------------------

---[FILE: env.js]---
Location: create-react-app-main/packages/react-scripts/config/env.js

```javascript
// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  );
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  paths.dotenv,
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebook/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of webpack shims.
// https://github.com/facebook/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: publicUrl,
        // We support configuring the sockjs pathname during development.
        // These settings let a developer run multiple simultaneous projects.
        // They are used as the connection `hostname`, `pathname` and `port`
        // in webpackHotDevClient. They are used as the `sockHost`, `sockPath`
        // and `sockPort` options in webpack-dev-server.
        WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
        WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
        WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
        // Whether or not react-refresh is enabled.
        // It is defined here so it is available in the webpackHotDevClient.
        FAST_REFRESH: process.env.FAST_REFRESH !== 'false',
      }
    );
  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
```

--------------------------------------------------------------------------------

---[FILE: getHttpsConfig.js]---
Location: create-react-app-main/packages/react-scripts/config/getHttpsConfig.js

```javascript
// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const chalk = require('react-dev-utils/chalk');
const paths = require('./paths');

// Ensure the certificate and key provided are valid and if not
// throw an easy to debug error
function validateKeyAndCerts({ cert, key, keyFile, crtFile }) {
  let encrypted;
  try {
    // publicEncrypt will throw an error with an invalid cert
    encrypted = crypto.publicEncrypt(cert, Buffer.from('test'));
  } catch (err) {
    throw new Error(
      `The certificate "${chalk.yellow(crtFile)}" is invalid.\n${err.message}`
    );
  }

  try {
    // privateDecrypt will throw an error with an invalid key
    crypto.privateDecrypt(key, encrypted);
  } catch (err) {
    throw new Error(
      `The certificate key "${chalk.yellow(keyFile)}" is invalid.\n${
        err.message
      }`
    );
  }
}

// Read file and throw an error if it doesn't exist
function readEnvFile(file, type) {
  if (!fs.existsSync(file)) {
    throw new Error(
      `You specified ${chalk.cyan(
        type
      )} in your env, but the file "${chalk.yellow(file)}" can't be found.`
    );
  }
  return fs.readFileSync(file);
}

// Get the https config
// Return cert files if provided in env, otherwise just true or false
function getHttpsConfig() {
  const { SSL_CRT_FILE, SSL_KEY_FILE, HTTPS } = process.env;
  const isHttps = HTTPS === 'true';

  if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
    const crtFile = path.resolve(paths.appPath, SSL_CRT_FILE);
    const keyFile = path.resolve(paths.appPath, SSL_KEY_FILE);
    const config = {
      cert: readEnvFile(crtFile, 'SSL_CRT_FILE'),
      key: readEnvFile(keyFile, 'SSL_KEY_FILE'),
    };

    validateKeyAndCerts({ ...config, keyFile, crtFile });
    return config;
  }
  return isHttps;
}

module.exports = getHttpsConfig;
```

--------------------------------------------------------------------------------

---[FILE: modules.js]---
Location: create-react-app-main/packages/react-scripts/config/modules.js

```javascript
// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');
const chalk = require('react-dev-utils/chalk');
const resolve = require('resolve');

/**
 * Get additional module paths based on the baseUrl of a compilerOptions object.
 *
 * @param {Object} options
 */
function getAdditionalModulePaths(options = {}) {
  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return '';
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  // We don't need to do anything if `baseUrl` is set to `node_modules`. This is
  // the default behavior.
  if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
    return null;
  }

  // Allow the user set the `baseUrl` to `appSrc`.
  if (path.relative(paths.appSrc, baseUrlResolved) === '') {
    return [paths.appSrc];
  }

  // If the path is equal to the root directory we ignore it here.
  // We don't want to allow importing from the root directly as source files are
  // not transpiled outside of `src`. We do allow importing them with the
  // absolute path (e.g. `src/Components/Button.js`) but we set that up with
  // an alias.
  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return null;
  }

  // Otherwise, throw an error.
  throw new Error(
    chalk.red.bold(
      "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
        ' Create React App does not support other values at this time.'
    )
  );
}

/**
 * Get webpack aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
function getWebpackAliases(options = {}) {
  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      src: paths.appSrc,
    };
  }
}

/**
 * Get jest aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
function getJestAliases(options = {}) {
  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      '^src/(.*)$': '<rootDir>/src/$1',
    };
  }
}

function getModules() {
  // Check if TypeScript is setup
  const hasTsConfig = fs.existsSync(paths.appTsConfig);
  const hasJsConfig = fs.existsSync(paths.appJsConfig);

  if (hasTsConfig && hasJsConfig) {
    throw new Error(
      'You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file.'
    );
  }

  let config;

  // If there's a tsconfig.json we assume it's a
  // TypeScript project and set up the config
  // based on tsconfig.json
  if (hasTsConfig) {
    const ts = require(resolve.sync('typescript', {
      basedir: paths.appNodeModules,
    }));
    config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config;
    // Otherwise we'll check if there is jsconfig.json
    // for non TS projects.
  } else if (hasJsConfig) {
    config = require(paths.appJsConfig);
  }

  config = config || {};
  const options = config.compilerOptions || {};

  const additionalModulePaths = getAdditionalModulePaths(options);

  return {
    additionalModulePaths: additionalModulePaths,
    webpackAliases: getWebpackAliases(options),
    jestAliases: getJestAliases(options),
    hasTsConfig,
  };
}

module.exports = getModules();
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 27
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 27 of 37)

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

---[FILE: getSourceMap.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/getSourceMap.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import { SourceMapConsumer } from 'source-map';

/**
 * A wrapped instance of a <code>{@link https://github.com/mozilla/source-map SourceMapConsumer}</code>.
 *
 * This exposes methods which will be indifferent to changes made in <code>{@link https://github.com/mozilla/source-map source-map}</code>.
 */
class SourceMap {
  __source_map: SourceMapConsumer;

  // $FlowFixMe
  constructor(sourceMap) {
    this.__source_map = sourceMap;
  }

  /**
   * Returns the original code position for a generated code position.
   * @param {number} line The line of the generated code position.
   * @param {number} column The column of the generated code position.
   */
  getOriginalPosition(
    line: number,
    column: number
  ): { source: string, line: number, column: number } {
    const {
      line: l,
      column: c,
      source: s,
    } = this.__source_map.originalPositionFor({
      line,
      column,
    });
    return { line: l, column: c, source: s };
  }

  /**
   * Returns the generated code position for an original position.
   * @param {string} source The source file of the original code position.
   * @param {number} line The line of the original code position.
   * @param {number} column The column of the original code position.
   */
  getGeneratedPosition(
    source: string,
    line: number,
    column: number
  ): { line: number, column: number } {
    const { line: l, column: c } = this.__source_map.generatedPositionFor({
      source,
      line,
      column,
    });
    return {
      line: l,
      column: c,
    };
  }

  /**
   * Returns the code for a given source file name.
   * @param {string} sourceName The name of the source file.
   */
  getSource(sourceName: string): string {
    return this.__source_map.sourceContentFor(sourceName);
  }

  getSources(): string[] {
    return this.__source_map.sources;
  }
}

function extractSourceMapUrl(
  fileUri: string,
  fileContents: string
): Promise<string> {
  const regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
  let match = null;
  for (;;) {
    let next = regex.exec(fileContents);
    if (next == null) {
      break;
    }
    match = next;
  }
  if (!(match && match[1])) {
    return Promise.reject(`Cannot find a source map directive for ${fileUri}.`);
  }
  return Promise.resolve(match[1].toString());
}

/**
 * Returns an instance of <code>{@link SourceMap}</code> for a given fileUri and fileContents.
 * @param {string} fileUri The URI of the source file.
 * @param {string} fileContents The contents of the source file.
 */
async function getSourceMap(
  fileUri: string,
  fileContents: string
): Promise<SourceMap> {
  let sm = await extractSourceMapUrl(fileUri, fileContents);
  if (sm.indexOf('data:') === 0) {
    const base64 = /^data:application\/json;([\w=:"-]+;)*base64,/;
    const match2 = sm.match(base64);
    if (!match2) {
      throw new Error(
        'Sorry, non-base64 inline source-map encoding is not supported.'
      );
    }
    sm = sm.substring(match2[0].length);
    sm = window.atob(sm);
    sm = JSON.parse(sm);
    return new SourceMap(new SourceMapConsumer(sm));
  } else {
    const index = fileUri.lastIndexOf('/');
    const url = fileUri.substring(0, index + 1) + sm;
    const obj = await fetch(url).then(res => res.json());
    return new SourceMap(new SourceMapConsumer(obj));
  }
}

export { extractSourceMapUrl, getSourceMap };
export default getSourceMap;
```

--------------------------------------------------------------------------------

---[FILE: getStackFrames.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/getStackFrames.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import type { StackFrame } from './stack-frame';
import { parse } from './parser';
import { map } from './mapper';
import { unmap } from './unmapper';

function getStackFrames(
  error: Error,
  unhandledRejection: boolean = false,
  contextSize: number = 3
): Promise<StackFrame[] | null> {
  const parsedFrames = parse(error);
  let enhancedFramesPromise;
  // $FlowFixMe
  if (error.__unmap_source) {
    enhancedFramesPromise = unmap(
      // $FlowFixMe
      error.__unmap_source,
      parsedFrames,
      contextSize
    );
  } else {
    enhancedFramesPromise = map(parsedFrames, contextSize);
  }
  return enhancedFramesPromise.then(enhancedFrames => {
    if (
      enhancedFrames
        .map(f => f._originalFileName)
        .filter(f => f != null && f.indexOf('node_modules') === -1).length === 0
    ) {
      return null;
    }
    return enhancedFrames.filter(
      ({ functionName }) =>
        functionName == null ||
        functionName.indexOf('__stack_frame_overlay_proxy_console__') === -1
    );
  });
}

export default getStackFrames;
export { getStackFrames };
```

--------------------------------------------------------------------------------

---[FILE: isBultinErrorName.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/isBultinErrorName.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
function isBultinErrorName(errorName: ?string) {
  switch (errorName) {
    case 'EvalError':
    case 'InternalError':
    case 'RangeError':
    case 'ReferenceError':
    case 'SyntaxError':
    case 'TypeError':
    case 'URIError':
      return true;
    default:
      return false;
  }
}

export { isBultinErrorName };
export default isBultinErrorName;
```

--------------------------------------------------------------------------------

---[FILE: isInternalFile.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/isInternalFile.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
function isInternalFile(sourceFileName: ?string, fileName: ?string) {
  return (
    sourceFileName == null ||
    sourceFileName === '' ||
    sourceFileName.indexOf('/~/') !== -1 ||
    sourceFileName.indexOf('/node_modules/') !== -1 ||
    sourceFileName.trim().indexOf(' ') !== -1 ||
    fileName == null ||
    fileName === ''
  );
}

export { isInternalFile };
```

--------------------------------------------------------------------------------

---[FILE: mapper.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/mapper.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import StackFrame from './stack-frame';
import { getSourceMap } from './getSourceMap';
import { getLinesAround } from './getLinesAround';
import { settle } from 'settle-promise';

/**
 * Enhances a set of <code>StackFrame</code>s with their original positions and code (when available).
 * @param {StackFrame[]} frames A set of <code>StackFrame</code>s which contain (generated) code positions.
 * @param {number} [contextLines=3] The number of lines to provide before and after the line specified in the <code>StackFrame</code>.
 */
async function map(
  frames: StackFrame[],
  contextLines: number = 3
): Promise<StackFrame[]> {
  const cache: any = {};
  const files: string[] = [];
  frames.forEach(frame => {
    const { fileName } = frame;
    if (fileName == null) {
      return;
    }
    if (files.indexOf(fileName) !== -1) {
      return;
    }
    files.push(fileName);
  });
  await settle(
    files.map(async fileName => {
      const fetchUrl =
        fileName.indexOf('webpack-internal:') === 0
          ? `/__get-internal-source?fileName=${encodeURIComponent(fileName)}`
          : fileName;

      const fileSource = await fetch(fetchUrl).then(r => r.text());
      const map = await getSourceMap(fileName, fileSource);
      cache[fileName] = { fileSource, map };
    })
  );
  return frames.map(frame => {
    const { functionName, fileName, lineNumber, columnNumber } = frame;
    let { map, fileSource } = cache[fileName] || {};
    if (map == null || lineNumber == null) {
      return frame;
    }
    const { source, line, column } = map.getOriginalPosition(
      lineNumber,
      columnNumber
    );
    const originalSource = source == null ? [] : map.getSource(source);
    return new StackFrame(
      functionName,
      fileName,
      lineNumber,
      columnNumber,
      getLinesAround(lineNumber, contextLines, fileSource),
      functionName,
      source,
      line,
      column,
      getLinesAround(line, contextLines, originalSource)
    );
  });
}

export { map };
export default map;
```

--------------------------------------------------------------------------------

---[FILE: parseCompileError.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/parseCompileError.js

```javascript
// @flow
import Anser from 'anser';

export type ErrorLocation = {|
  fileName: string,
  lineNumber: number,
  colNumber?: number,
|};

const filePathRegex = /^\.(\/[^/\n ]+)+\.[^/\n ]+$/;

const lineNumberRegexes = [
  // Babel syntax errors
  // Based on syntax error formating of babylon parser
  // https://github.com/babel/babylon/blob/v7.0.0-beta.22/src/parser/location.js#L19
  /^.*\((\d+):(\d+)\)$/,

  // ESLint errors
  // Based on eslintFormatter in react-dev-utils
  /^Line (\d+):.+$/,
];

// Based on error formatting of webpack
// https://github.com/webpack/webpack/blob/v3.5.5/lib/Stats.js#L183-L217
function parseCompileError(message: string): ?ErrorLocation {
  const lines: Array<string> = message.split('\n');
  let fileName: string = '';
  let lineNumber: number = 0;
  let colNumber: number = 0;

  for (let i = 0; i < lines.length; i++) {
    const line: string = Anser.ansiToText(lines[i]).trim();
    if (!line) {
      continue;
    }

    if (!fileName && line.match(filePathRegex)) {
      fileName = line;
    }

    let k = 0;
    while (k < lineNumberRegexes.length) {
      const match: ?Array<string> = line.match(lineNumberRegexes[k]);
      if (match) {
        lineNumber = parseInt(match[1], 10);
        // colNumber starts with 0 and hence add 1
        colNumber = parseInt(match[2], 10) + 1 || 1;
        break;
      }
      k++;
    }

    if (fileName && lineNumber) {
      break;
    }
  }

  return fileName && lineNumber ? { fileName, lineNumber, colNumber } : null;
}

export default parseCompileError;
```

--------------------------------------------------------------------------------

---[FILE: parser.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/parser.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import StackFrame from './stack-frame';

const regexExtractLocation = /\(?(.+?)(?::(\d+))?(?::(\d+))?\)?$/;

// $FlowFixMe
function extractLocation(token: string): [string, number, number] {
  return (
    regexExtractLocation
      .exec(token)
      // $FlowFixMe
      .slice(1)
      .map(v => {
        const p = Number(v);
        if (!isNaN(p)) {
          return p;
        }
        return v;
      })
  );
}

const regexValidFrame_Chrome = /^\s*(at|in)\s.+(:\d+)/;
const regexValidFrame_FireFox =
  /(^|@)\S+:\d+|.+line\s+\d+\s+>\s+(eval|Function).+/;

function parseStack(stack: string[]): StackFrame[] {
  const frames = stack
    .filter(
      e => regexValidFrame_Chrome.test(e) || regexValidFrame_FireFox.test(e)
    )
    .map(e => {
      if (regexValidFrame_FireFox.test(e)) {
        // Strip eval, we don't care about it
        let isEval = false;
        if (/ > (eval|Function)/.test(e)) {
          e = e.replace(
            / line (\d+)(?: > eval line \d+)* > (eval|Function):\d+:\d+/g,
            ':$1'
          );
          isEval = true;
        }
        const data = e.split(/[@]/g);
        const last = data.pop();
        return new StackFrame(
          data.join('@') || (isEval ? 'eval' : null),
          ...extractLocation(last)
        );
      } else {
        // Strip eval, we don't care about it
        if (e.indexOf('(eval ') !== -1) {
          e = e.replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
        }
        if (e.indexOf('(at ') !== -1) {
          e = e.replace(/\(at /, '(');
        }
        const data = e.trim().split(/\s+/g).slice(1);
        const last = data.pop();
        return new StackFrame(data.join(' ') || null, ...extractLocation(last));
      }
    });
  return frames;
}

/**
 * Turns an <code>Error</code>, or similar object, into a set of <code>StackFrame</code>s.
 * @alias parse
 */
function parseError(error: Error | string | string[]): StackFrame[] {
  if (error == null) {
    throw new Error('You cannot pass a null object.');
  }
  if (typeof error === 'string') {
    return parseStack(error.split('\n'));
  }
  if (Array.isArray(error)) {
    return parseStack(error);
  }
  if (typeof error.stack === 'string') {
    return parseStack(error.stack.split('\n'));
  }
  throw new Error('The error you provided does not contain a stack trace.');
}

export { parseError as parse };
export default parseError;
```

--------------------------------------------------------------------------------

---[FILE: stack-frame.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/stack-frame.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */

/** A container holding a script line. */
class ScriptLine {
  /** The line number of this line of source. */
  lineNumber: number;
  /** The content (or value) of this line of source. */
  content: string;
  /** Whether or not this line should be highlighted. Particularly useful for error reporting with context. */
  highlight: boolean;

  constructor(lineNumber: number, content: string, highlight: boolean = false) {
    this.lineNumber = lineNumber;
    this.content = content;
    this.highlight = highlight;
  }
}

/**
 * A representation of a stack frame.
 */
class StackFrame {
  functionName: string | null;
  fileName: string | null;
  lineNumber: number | null;
  columnNumber: number | null;

  _originalFunctionName: string | null;
  _originalFileName: string | null;
  _originalLineNumber: number | null;
  _originalColumnNumber: number | null;

  _scriptCode: ScriptLine[] | null;
  _originalScriptCode: ScriptLine[] | null;

  constructor(
    functionName: string | null = null,
    fileName: string | null = null,
    lineNumber: number | null = null,
    columnNumber: number | null = null,
    scriptCode: ScriptLine[] | null = null,
    sourceFunctionName: string | null = null,
    sourceFileName: string | null = null,
    sourceLineNumber: number | null = null,
    sourceColumnNumber: number | null = null,
    sourceScriptCode: ScriptLine[] | null = null
  ) {
    if (functionName && functionName.indexOf('Object.') === 0) {
      functionName = functionName.slice('Object.'.length);
    }
    if (
      // Chrome has a bug with inferring function.name:
      // https://github.com/facebook/create-react-app/issues/2097
      // Let's ignore a meaningless name we get for top-level modules.
      functionName === 'friendlySyntaxErrorLabel' ||
      functionName === 'exports.__esModule' ||
      functionName === '<anonymous>' ||
      !functionName
    ) {
      functionName = null;
    }
    this.functionName = functionName;

    this.fileName = fileName;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;

    this._originalFunctionName = sourceFunctionName;
    this._originalFileName = sourceFileName;
    this._originalLineNumber = sourceLineNumber;
    this._originalColumnNumber = sourceColumnNumber;

    this._scriptCode = scriptCode;
    this._originalScriptCode = sourceScriptCode;
  }

  /**
   * Returns the name of this function.
   */
  getFunctionName(): string {
    return this.functionName || '(anonymous function)';
  }

  /**
   * Returns the source of the frame.
   * This contains the file name, line number, and column number when available.
   */
  getSource(): string {
    let str = '';
    if (this.fileName != null) {
      str += this.fileName + ':';
    }
    if (this.lineNumber != null) {
      str += this.lineNumber + ':';
    }
    if (this.columnNumber != null) {
      str += this.columnNumber + ':';
    }
    return str.slice(0, -1);
  }

  /**
   * Returns a pretty version of this stack frame.
   */
  toString(): string {
    const functionName = this.getFunctionName();
    const source = this.getSource();
    return `${functionName}${source ? ` (${source})` : ``}`;
  }
}

export { StackFrame, ScriptLine };
export default StackFrame;
```

--------------------------------------------------------------------------------

---[FILE: unmapper.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/unmapper.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import StackFrame from './stack-frame';
import { getSourceMap } from './getSourceMap';
import { getLinesAround } from './getLinesAround';
import path from 'path';

function count(search: string, string: string): number {
  // Count starts at -1 because a do-while loop always runs at least once
  let count = -1,
    index = -1;
  do {
    // First call or the while case evaluated true, meaning we have to make
    // count 0 or we found a character
    ++count;
    // Find the index of our search string, starting after the previous index
    index = string.indexOf(search, index + 1);
  } while (index !== -1);
  return count;
}

/**
 * Turns a set of mapped <code>StackFrame</code>s back into their generated code position and enhances them with code.
 * @param {string} fileUri The URI of the <code>bundle.js</code> file.
 * @param {StackFrame[]} frames A set of <code>StackFrame</code>s which are already mapped and missing their generated positions.
 * @param {number} [fileContents=3] The number of lines to provide before and after the line specified in the <code>StackFrame</code>.
 */
async function unmap(
  _fileUri: string | { uri: string, contents: string },
  frames: StackFrame[],
  contextLines: number = 3
): Promise<StackFrame[]> {
  let fileContents = typeof _fileUri === 'object' ? _fileUri.contents : null;
  let fileUri = typeof _fileUri === 'object' ? _fileUri.uri : _fileUri;
  if (fileContents == null) {
    fileContents = await fetch(fileUri).then(res => res.text());
  }
  const map = await getSourceMap(fileUri, fileContents);
  return frames.map(frame => {
    const { functionName, lineNumber, columnNumber, _originalLineNumber } =
      frame;
    if (_originalLineNumber != null) {
      return frame;
    }
    let { fileName } = frame;
    if (fileName) {
      // The web version of this module only provides POSIX support, so Windows
      // paths like C:\foo\\baz\..\\bar\ cannot be normalized.
      // A simple solution to this is to replace all `\` with `/`, then
      // normalize afterwards.
      fileName = path.normalize(fileName.replace(/[\\]+/g, '/'));
    }
    if (fileName == null) {
      return frame;
    }
    const fN: string = fileName;
    const source = map
      .getSources()
      // Prepare path for normalization; see comment above for reasoning.
      .map(s => s.replace(/[\\]+/g, '/'))
      .filter(p => {
        p = path.normalize(p);
        const i = p.lastIndexOf(fN);
        return i !== -1 && i === p.length - fN.length;
      })
      .map(p => ({
        token: p,
        seps: count(path.sep, path.normalize(p)),
        penalties: count('node_modules', p) + count('~', p),
      }))
      .sort((a, b) => {
        const s = Math.sign(a.seps - b.seps);
        if (s !== 0) {
          return s;
        }
        return Math.sign(a.penalties - b.penalties);
      });
    if (source.length < 1 || lineNumber == null) {
      return new StackFrame(
        null,
        null,
        null,
        null,
        null,
        functionName,
        fN,
        lineNumber,
        columnNumber,
        null
      );
    }
    const sourceT = source[0].token;
    const { line, column } = map.getGeneratedPosition(
      sourceT,
      lineNumber,
      // $FlowFixMe
      columnNumber
    );
    const originalSource = map.getSource(sourceT);
    return new StackFrame(
      functionName,
      fileUri,
      line,
      column || null,
      getLinesAround(line, contextLines, fileContents || []),
      functionName,
      fN,
      lineNumber,
      columnNumber,
      getLinesAround(lineNumber, contextLines, originalSource)
    );
  });
}

export { unmap };
export default unmap;
```

--------------------------------------------------------------------------------

---[FILE: warnings.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/warnings.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import type { ReactFrame } from '../effects/proxyConsole';

function stripInlineStacktrace(message: string): string {
  return message
    .split('\n')
    .filter(line => !line.match(/^\s*in/))
    .join('\n'); // "  in Foo"
}

function massage(
  warning: string,
  frames: ReactFrame[]
): { message: string, stack: string } {
  let message = stripInlineStacktrace(warning);

  // Reassemble the stack with full filenames provided by React
  let stack = '';
  let lastFilename;
  let lastLineNumber;
  for (let index = 0; index < frames.length; ++index) {
    const { fileName, lineNumber } = frames[index];
    if (fileName == null || lineNumber == null) {
      continue;
    }

    // TODO: instead, collapse them in the UI
    if (
      fileName === lastFilename &&
      typeof lineNumber === 'number' &&
      typeof lastLineNumber === 'number' &&
      Math.abs(lineNumber - lastLineNumber) < 3
    ) {
      continue;
    }
    lastFilename = fileName;
    lastLineNumber = lineNumber;

    let { name } = frames[index];
    name = name || '(anonymous function)';
    stack += `in ${name} (at ${fileName}:${lineNumber})\n`;
  }

  return { message, stack };
}

export { massage };
```

--------------------------------------------------------------------------------

---[FILE: absolutifyCaret.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/dom/absolutifyCaret.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
function removeNextBr(parent, component: ?Element) {
  while (component != null && component.tagName.toLowerCase() !== 'br') {
    component = component.nextElementSibling;
  }
  if (component != null) {
    parent.removeChild(component);
  }
}

function absolutifyCaret(component: Node) {
  const ccn = component.childNodes;
  for (let index = 0; index < ccn.length; ++index) {
    const c = ccn[index];
    // $FlowFixMe
    if (c.tagName.toLowerCase() !== 'span') {
      continue;
    }
    const _text = c.innerText;
    if (_text == null) {
      continue;
    }
    const text = _text.replace(/\s/g, '');
    if (text !== '|^') {
      continue;
    }
    // $FlowFixMe
    c.style.position = 'absolute';
    // $FlowFixMe
    removeNextBr(component, c);
  }
}

export { absolutifyCaret };
```

--------------------------------------------------------------------------------

---[FILE: css.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/dom/css.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import { lightTheme, darkTheme } from '../../styles';

let injectedCount = 0;
const injectedCache = {};

function getHead(document: Document) {
  return document.head || document.getElementsByTagName('head')[0];
}

function injectCss(document: Document, css: string): number {
  const head = getHead(document);
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);

  injectedCache[++injectedCount] = style;
  return injectedCount;
}

function removeCss(document: Document, ref: number) {
  if (injectedCache[ref] == null) {
    return;
  }
  const head = getHead(document);
  head.removeChild(injectedCache[ref]);
  delete injectedCache[ref];
}

function applyStyles(element: HTMLElement, styles: Object) {
  element.setAttribute('style', '');
  for (const key in styles) {
    if (!Object.prototype.hasOwnProperty.call(styles, key)) {
      continue;
    }
    // $FlowFixMe
    element.style[key] = styles[key];
  }
}

function getTheme() {
  return window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? darkTheme
    : lightTheme;
}

export { getHead, injectCss, removeCss, applyStyles, getTheme };
```

--------------------------------------------------------------------------------

---[FILE: extract-source-map.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/extract-source-map.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { extractSourceMapUrl } from '../utils/getSourceMap';

test('extracts last source map directive', async () => {
  const res = await extractSourceMapUrl(
    `test.js`,
    `//# sourceMappingURL=test.js.map\nconsole.log('a')\n//# sourceMappingURL=bundle.js.map`
  );
  expect(res).toBe('bundle.js.map');
});

test('errors when no source map', async () => {
  const testFileName = 'test.js';
  let error;
  try {
    await extractSourceMapUrl(
      testFileName,
      `console.log('hi')\n\nconsole.log('bye')`
    );
  } catch (e) {
    error = e;
  }
  expect(error).toBe(`Cannot find a source map directive for ${testFileName}.`);
});
```

--------------------------------------------------------------------------------

---[FILE: get-source-map.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/get-source-map.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

import { getSourceMap } from '../utils/getSourceMap';
import fs from 'fs';
import { resolve } from 'path';

test('finds an external source map', async () => {
  const file = fs
    .readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs'))
    .toString('utf8');
  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs.map'))
      .toString('utf8')
  );

  const sm = await getSourceMap('/', file);
  expect(sm.getOriginalPosition(26122, 21)).toEqual({
    line: 7,
    column: 0,
    source: 'webpack:///packages/react-scripts/template/src/App.js',
  });
});

test('find an inline source map', async () => {
  const sourceName = 'test.js';

  const file = fs
    .readFileSync(resolve(__dirname, '../../fixtures/inline.mjs'))
    .toString('utf8');
  const fileO = fs
    .readFileSync(resolve(__dirname, '../../fixtures/inline.es6.mjs'))
    .toString('utf8');

  const sm = await getSourceMap('/', file);
  expect(sm.getSources()).toEqual([sourceName]);
  expect(sm.getSource(sourceName)).toBe(fileO);
  expect(sm.getGeneratedPosition(sourceName, 5, 10)).toEqual({
    line: 10,
    column: 8,
  });
});

test('error on a source map with unsupported encoding', async () => {
  expect.assertions(2);

  const file = fs
    .readFileSync(resolve(__dirname, '../../fixtures/junk-inline.mjs'))
    .toString('utf8');
  let error;
  try {
    await getSourceMap('/', file);
  } catch (e) {
    error = e;
  }
  expect(error instanceof Error).toBe(true);
  expect(error.message).toBe(
    'Sorry, non-base64 inline source-map encoding is not supported.'
  );
});
```

--------------------------------------------------------------------------------

---[FILE: lines-around.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/lines-around.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getLinesAround } from '../utils/getLinesAround';

const arr = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

test('should return lines around from a string', () => {
  expect(getLinesAround(4, 2, arr)).toMatchSnapshot();
});

test('should return lines around from an array', () => {
  expect(getLinesAround(4, 2, arr.join('\n'))).toMatchSnapshot();
});
```

--------------------------------------------------------------------------------

---[FILE: mapper.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/mapper.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { map } from '../utils/mapper';
import { parse } from '../utils/parser';
import fs from 'fs';
import { resolve } from 'path';

test('basic error; 0 context', async () => {
  expect.assertions(1);
  const error =
    'TypeError: document.body.missing is not a function\n    at App.componentDidMount (http://localhost:3000/static/js/bundle.js:26122:21)\n    at http://localhost:3000/static/js/bundle.js:30091:25\n    at measureLifeCyclePerf (http://localhost:3000/static/js/bundle.js:29901:12)\n    at http://localhost:3000/static/js/bundle.js:30090:11\n    at CallbackQueue.notifyAll (http://localhost:3000/static/js/bundle.js:13256:22)\n    at ReactReconcileTransaction.close (http://localhost:3000/static/js/bundle.js:35124:26)\n    at ReactReconcileTransaction.closeAll (http://localhost:3000/static/js/bundle.js:7390:25)\n    at ReactReconcileTransaction.perform (http://localhost:3000/static/js/bundle.js:7337:16)\n    at batchedMountComponentIntoNode (http://localhost:3000/static/js/bundle.js:14204:15)\n    at ReactDefaultBatchingStrategyTransaction.perform (http://localhost:3000/static/js/bundle.js:7324:20)\n    at Object.batchedUpdates (http://localhost:3000/static/js/bundle.js:33900:26)\n    at Object.batchedUpdates (http://localhost:3000/static/js/bundle.js:2181:27)\n    at Object._renderNewRootComponent (http://localhost:3000/static/js/bundle.js:14398:18)\n    at Object._renderSubtreeIntoContainer (http://localhost:3000/static/js/bundle.js:14479:32)\n    at Object.render (http://localhost:3000/static/js/bundle.js:14500:23)\n    at Object.friendlySyntaxErrorLabel (http://localhost:3000/static/js/bundle.js:17287:20)\n    at __webpack_require__ (http://localhost:3000/static/js/bundle.js:660:30)\n    at fn (http://localhost:3000/static/js/bundle.js:84:20)\n    at Object.<anonymous> (http://localhost:3000/static/js/bundle.js:41219:18)\n    at __webpack_require__ (http://localhost:3000/static/js/bundle.js:660:30)\n    at validateFormat (http://localhost:3000/static/js/bundle.js:709:39)\n    at http://localhost:3000/static/js/bundle.js:712:10';

  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs'))
      .toString('utf8')
  );
  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs.map'))
      .toString('utf8')
  );
  const frames = await map(parse(error), 0);
  expect(frames).toEqual(
    JSON.parse(
      fs
        .readFileSync(resolve(__dirname, '../../fixtures/bundle.json'))
        .toString('utf8')
    )
  );
});

test('default context (3)', async () => {
  expect.assertions(1);
  const error =
    'TypeError: document.body.missing is not a function\n    at App.componentDidMount (http://localhost:3000/static/js/bundle.js:26122:21)';

  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs'))
      .toString('utf8')
  );
  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs.map'))
      .toString('utf8')
  );
  const frames = await map(parse(error));
  expect(frames).toEqual(
    JSON.parse(
      fs
        .readFileSync(resolve(__dirname, '../../fixtures/bundle-default.json'))
        .toString('utf8')
    )
  );
});

test('bad comes back same', async () => {
  expect.assertions(2);
  const error =
    'TypeError: document.body.missing is not a function\n    at App.componentDidMount (A:1:2)';
  const orig = parse(error);
  expect(orig).toEqual([
    {
      _originalColumnNumber: null,
      _originalFileName: null,
      _originalFunctionName: null,
      _originalLineNumber: null,
      _originalScriptCode: null,
      _scriptCode: null,
      columnNumber: 2,
      fileName: 'A',
      functionName: 'App.componentDidMount',
      lineNumber: 1,
    },
  ]);
  const frames = await map(orig);
  expect(frames).toEqual(orig);
});
```

--------------------------------------------------------------------------------

---[FILE: script-lines.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/script-lines.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ScriptLine } from '../utils/stack-frame';

test('script line shape', () => {
  expect(new ScriptLine(5, 'foobar', true)).toMatchSnapshot();
});

test('script line to provide default highlight', () => {
  expect(new ScriptLine(5, 'foobar')).toMatchSnapshot();
});
```

--------------------------------------------------------------------------------

---[FILE: setupJest.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/setupJest.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

global.fetch = require('jest-fetch-mock');
```

--------------------------------------------------------------------------------

---[FILE: stack-frame.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/stack-frame.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { StackFrame } from '../utils/stack-frame';

test('proper empty shape', () => {
  const empty = new StackFrame();
  expect(empty).toMatchSnapshot();

  expect(empty.getFunctionName()).toBe('(anonymous function)');
  expect(empty.getSource()).toBe('');
  expect(empty.toString()).toBe('(anonymous function)');
});

test('proper full shape', () => {
  const empty = new StackFrame(
    'a',
    'b.js',
    13,
    37,
    undefined,
    'apple',
    'test.js',
    37,
    13
  );
  expect(empty).toMatchSnapshot();

  expect(empty.getFunctionName()).toBe('a');
  expect(empty.getSource()).toBe('b.js:13:37');
  expect(empty.toString()).toBe('a (b.js:13:37)');
});
```

--------------------------------------------------------------------------------

---[FILE: unmapper.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/unmapper.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { unmap } from '../utils/unmapper';
import { parse } from '../utils/parser';
import fs from 'fs';
import { resolve } from 'path';

test('basic warning', async () => {
  expect.assertions(2);
  const error = `Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of \`B\`. See https://fb.me/react-warning-keys for more information.
    in div (at B.js:8)
    in B (at A.js:6)
    in A (at App.js:8)
    in div (at App.js:10)
    in App (at index.js:6)`;

  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs'))
      .toString('utf8')
  );
  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs.map'))
      .toString('utf8')
  );
  const frames = await unmap('/static/js/bundle.js', parse(error), 0);

  const expected = JSON.parse(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle2.json'))
      .toString('utf8')
  );
  expect(frames).toEqual(expected);

  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs'))
      .toString('utf8')
  );
  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs.map'))
      .toString('utf8')
  );
  expect(await unmap('/static/js/bundle.js', expected)).toEqual(expected);
});

test('default context & unfound source', async () => {
  expect.assertions(1);
  const error = `Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of \`B\`. See https://fb.me/react-warning-keys for more information.
    in div (at B.js:8)
    in unknown (at blabla.js:10)`;

  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs'))
      .toString('utf8')
  );
  fetch.mockResponseOnce(
    fs
      .readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs.map'))
      .toString('utf8')
  );
  const frames = await unmap('/static/js/bundle.js', parse(error));
  expect(frames).toMatchSnapshot();
});
```

--------------------------------------------------------------------------------

---[FILE: chrome.js]---
Location: create-react-app-main/packages/react-error-overlay/src/__tests__/parser/chrome.js

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
      `TypeError: window[f] is not a function
    at e (file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:25:18)
    at eval (eval at c (file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:12:9), <anonymous>:1:1)
    at a (file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:8:9)
    at file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:32:7`
    )
  ).toMatchSnapshot();
});
```

--------------------------------------------------------------------------------

````

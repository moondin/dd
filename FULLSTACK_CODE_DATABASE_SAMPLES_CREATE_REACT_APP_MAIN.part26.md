---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 26
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 26 of 37)

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

---[FILE: Collapsible.js]---
Location: create-react-app-main/packages/react-error-overlay/src/components/Collapsible.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useState, useContext } from 'react';
import { ThemeContext } from '../iframeScript';

import type { Element as ReactElement } from 'react';
import type { Theme } from '../styles';

const _collapsibleStyle = {
  cursor: 'pointer',
  border: 'none',
  display: 'block',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'Consolas, Menlo, monospace',
  fontSize: '1em',
  padding: '0px',
  lineHeight: '1.5',
};

const collapsibleCollapsedStyle = (theme: Theme) => ({
  ..._collapsibleStyle,
  color: theme.color,
  background: theme.background,
  marginBottom: '1.5em',
});

const collapsibleExpandedStyle = (theme: Theme) => ({
  ..._collapsibleStyle,
  color: theme.color,
  background: theme.background,
  marginBottom: '0.6em',
});

type CollapsiblePropsType = {|
  children: ReactElement<any>[],
|};

function Collapsible(props: CollapsiblePropsType) {
  const theme = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const count = props.children.length;
  return (
    <div>
      <button
        onClick={toggleCollapsed}
        style={
          collapsed
            ? collapsibleCollapsedStyle(theme)
            : collapsibleExpandedStyle(theme)
        }
      >
        {(collapsed ? '▶' : '▼') +
          ` ${count} stack frames were ` +
          (collapsed ? 'collapsed.' : 'expanded.')}
      </button>
      <div style={{ display: collapsed ? 'none' : 'block' }}>
        {props.children}
        <button
          onClick={toggleCollapsed}
          style={collapsibleExpandedStyle(theme)}
        >
          {`▲ ${count} stack frames were expanded.`}
        </button>
      </div>
    </div>
  );
}

export default Collapsible;
```

--------------------------------------------------------------------------------

---[FILE: ErrorOverlay.js]---
Location: create-react-app-main/packages/react-error-overlay/src/components/ErrorOverlay.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useContext, useEffect } from 'react';
import { ThemeContext } from '../iframeScript';

import type { Node as ReactNode } from 'react';
import type { Theme } from '../styles';

const overlayStyle = (theme: Theme) => ({
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  height: '100%',
  width: '1024px',
  maxWidth: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: '0.5rem',
  boxSizing: 'border-box',
  textAlign: 'left',
  fontFamily: 'Consolas, Menlo, monospace',
  fontSize: '11px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  lineHeight: 1.5,
  color: theme.color,
});

type ErrorOverlayPropsType = {|
  children: ReactNode,
  shortcutHandler?: (eventKey: string) => void,
|};

let iframeWindow: window = null;

function ErrorOverlay(props: ErrorOverlayPropsType) {
  const theme = useContext(ThemeContext);

  const getIframeWindow = (element: ?HTMLDivElement) => {
    if (element) {
      const document = element.ownerDocument;
      iframeWindow = document.defaultView;
    }
  };
  const { shortcutHandler } = props;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (shortcutHandler) {
        shortcutHandler(e.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    if (iframeWindow) {
      iframeWindow.addEventListener('keydown', onKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (iframeWindow) {
        iframeWindow.removeEventListener('keydown', onKeyDown);
      }
    };
  }, [shortcutHandler]);

  return (
    <div style={overlayStyle(theme)} ref={getIframeWindow}>
      {props.children}
    </div>
  );
}

export default ErrorOverlay;
```

--------------------------------------------------------------------------------

---[FILE: Footer.js]---
Location: create-react-app-main/packages/react-error-overlay/src/components/Footer.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useContext } from 'react';
import { ThemeContext } from '../iframeScript';
import type { Theme } from '../styles';

const footerStyle = (theme: Theme) => ({
  fontFamily: 'sans-serif',
  color: theme.footer,
  marginTop: '0.5rem',
  flex: '0 0 auto',
});

type FooterPropsType = {|
  line1: string,
  line2?: string,
|};

function Footer(props: FooterPropsType) {
  const theme = useContext(ThemeContext);
  return (
    <div style={footerStyle(theme)}>
      {props.line1}
      <br />
      {props.line2}
    </div>
  );
}

export default Footer;
```

--------------------------------------------------------------------------------

---[FILE: Header.js]---
Location: create-react-app-main/packages/react-error-overlay/src/components/Header.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useContext } from 'react';
import { ThemeContext } from '../iframeScript';
import type { Theme } from '../styles';

const headerStyle = (theme: Theme) => ({
  fontSize: '2em',
  fontFamily: 'sans-serif',
  color: theme.headerColor,
  whiteSpace: 'pre-wrap',
  // Top bottom margin spaces header
  // Right margin revents overlap with close button
  margin: '0 2rem 0.75rem 0',
  flex: '0 0 auto',
  maxHeight: '50%',
  overflow: 'auto',
});

type HeaderPropType = {|
  headerText: string,
|};

function Header(props: HeaderPropType) {
  const theme = useContext(ThemeContext);
  return <div style={headerStyle(theme)}>{props.headerText}</div>;
}

export default Header;
```

--------------------------------------------------------------------------------

---[FILE: NavigationBar.js]---
Location: create-react-app-main/packages/react-error-overlay/src/components/NavigationBar.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useContext } from 'react';
import { ThemeContext } from '../iframeScript';
import type { Theme } from '../styles';

const navigationBarStyle = {
  marginBottom: '0.5rem',
};

const buttonContainerStyle = {
  marginRight: '1em',
};

const _navButtonStyle = {
  border: 'none',
  borderRadius: '4px',
  padding: '3px 6px',
  cursor: 'pointer',
};

const leftButtonStyle = (theme: Theme) => ({
  ..._navButtonStyle,
  backgroundColor: theme.navBackground,
  color: theme.navArrow,
  borderTopRightRadius: '0px',
  borderBottomRightRadius: '0px',
  marginRight: '1px',
});

const rightButtonStyle = (theme: Theme) => ({
  ..._navButtonStyle,
  backgroundColor: theme.navBackground,
  color: theme.navArrow,
  borderTopLeftRadius: '0px',
  borderBottomLeftRadius: '0px',
});

type Callback = () => void;

type NavigationBarPropsType = {|
  currentError: number,
  totalErrors: number,
  previous: Callback,
  next: Callback,
|};

function NavigationBar(props: NavigationBarPropsType) {
  const theme = useContext(ThemeContext);
  const { currentError, totalErrors, previous, next } = props;
  return (
    <div style={navigationBarStyle}>
      <span style={buttonContainerStyle}>
        <button onClick={previous} style={leftButtonStyle(theme)}>
          ←
        </button>
        <button onClick={next} style={rightButtonStyle(theme)}>
          →
        </button>
      </span>
      {`${currentError} of ${totalErrors} errors on the page`}
    </div>
  );
}

export default NavigationBar;
```

--------------------------------------------------------------------------------

---[FILE: CompileErrorContainer.js]---
Location: create-react-app-main/packages/react-error-overlay/src/containers/CompileErrorContainer.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useContext } from 'react';
import { ThemeContext } from '../iframeScript';
import ErrorOverlay from '../components/ErrorOverlay';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CodeBlock from '../components/CodeBlock';
import generateAnsiHTML from '../utils/generateAnsiHTML';
import parseCompileError from '../utils/parseCompileError';
import type { ErrorLocation } from '../utils/parseCompileError';

const codeAnchorStyle = {
  cursor: 'pointer',
};

type CompileErrorContainerPropsType = {|
  error: string,
  editorHandler: (errorLoc: ErrorLocation) => void,
|};

function CompileErrorContainer(props: CompileErrorContainerPropsType) {
  const theme = useContext(ThemeContext);
  const { error, editorHandler } = props;
  const errLoc: ?ErrorLocation = parseCompileError(error);
  const canOpenInEditor = errLoc !== null && editorHandler !== null;
  return (
    <ErrorOverlay>
      <Header headerText="Failed to compile" />
      <div
        onClick={canOpenInEditor && errLoc ? () => editorHandler(errLoc) : null}
        style={canOpenInEditor ? codeAnchorStyle : null}
      >
        <CodeBlock main={true} codeHTML={generateAnsiHTML(error, theme)} />
      </div>
      <Footer line1="This error occurred during the build time and cannot be dismissed." />
    </ErrorOverlay>
  );
}

export default CompileErrorContainer;
```

--------------------------------------------------------------------------------

---[FILE: RuntimeError.js]---
Location: create-react-app-main/packages/react-error-overlay/src/containers/RuntimeError.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React from 'react';
import Header from '../components/Header';
import StackTrace from './StackTrace';

import type { StackFrame } from '../utils/stack-frame';
import type { ErrorLocation } from '../utils/parseCompileError';

const wrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
};

export type ErrorRecord = {|
  error: Error,
  unhandledRejection: boolean,
  contextSize: number,
  stackFrames: StackFrame[],
|};

type Props = {|
  errorRecord: ErrorRecord,
  editorHandler: (errorLoc: ErrorLocation) => void,
|};

function RuntimeError({ errorRecord, editorHandler }: Props) {
  const { error, unhandledRejection, contextSize, stackFrames } = errorRecord;
  const errorName = unhandledRejection
    ? 'Unhandled Rejection (' + error.name + ')'
    : error.name;

  // Make header prettier
  const message = error.message;
  let headerText =
    message.match(/^\w*:/) || !errorName ? message : errorName + ': ' + message;

  headerText = headerText
    // TODO: maybe remove this prefix from fbjs?
    // It's just scaring people
    .replace(/^Invariant Violation:\s*/, '')
    // This is not helpful either:
    .replace(/^Warning:\s*/, '')
    // Break the actionable part to the next line.
    // AFAIK React 16+ should already do this.
    .replace(' Check the render method', '\n\nCheck the render method')
    .replace(' Check your code at', '\n\nCheck your code at');

  return (
    <div style={wrapperStyle}>
      <Header headerText={headerText} />
      <StackTrace
        stackFrames={stackFrames}
        errorName={errorName}
        contextSize={contextSize}
        editorHandler={editorHandler}
      />
    </div>
  );
}

export default RuntimeError;
```

--------------------------------------------------------------------------------

---[FILE: RuntimeErrorContainer.js]---
Location: create-react-app-main/packages/react-error-overlay/src/containers/RuntimeErrorContainer.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { PureComponent } from 'react';
import ErrorOverlay from '../components/ErrorOverlay';
import CloseButton from '../components/CloseButton';
import NavigationBar from '../components/NavigationBar';
import RuntimeError from './RuntimeError';
import Footer from '../components/Footer';

import type { ErrorRecord } from './RuntimeError';
import type { ErrorLocation } from '../utils/parseCompileError';

type Props = {|
  errorRecords: ErrorRecord[],
  close: () => void,
  editorHandler: (errorLoc: ErrorLocation) => void,
|};

type State = {|
  currentIndex: number,
|};

class RuntimeErrorContainer extends PureComponent<Props, State> {
  state = {
    currentIndex: 0,
  };

  previous = () => {
    this.setState((state, props) => ({
      currentIndex:
        state.currentIndex > 0
          ? state.currentIndex - 1
          : props.errorRecords.length - 1,
    }));
  };

  next = () => {
    this.setState((state, props) => ({
      currentIndex:
        state.currentIndex < props.errorRecords.length - 1
          ? state.currentIndex + 1
          : 0,
    }));
  };

  shortcutHandler = (key: string) => {
    if (key === 'Escape') {
      this.props.close();
    } else if (key === 'ArrowLeft') {
      this.previous();
    } else if (key === 'ArrowRight') {
      this.next();
    }
  };

  render() {
    const { errorRecords, close } = this.props;
    const totalErrors = errorRecords.length;
    return (
      <ErrorOverlay shortcutHandler={this.shortcutHandler}>
        <CloseButton close={close} />
        {totalErrors > 1 && (
          <NavigationBar
            currentError={this.state.currentIndex + 1}
            totalErrors={totalErrors}
            previous={this.previous}
            next={this.next}
          />
        )}
        <RuntimeError
          errorRecord={errorRecords[this.state.currentIndex]}
          editorHandler={this.props.editorHandler}
        />
        <Footer
          line1="This screen is visible only in development. It will not appear if the app crashes in production."
          line2="Open your browser’s developer console to further inspect this error.  Click the 'X' or hit ESC to dismiss this message."
        />
      </ErrorOverlay>
    );
  }
}

export default RuntimeErrorContainer;
```

--------------------------------------------------------------------------------

---[FILE: StackFrame.js]---
Location: create-react-app-main/packages/react-error-overlay/src/containers/StackFrame.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useState, useContext } from 'react';
import { ThemeContext } from '../iframeScript';
import CodeBlock from './StackFrameCodeBlock';
import { getPrettyURL } from '../utils/getPrettyURL';

import type { StackFrame as StackFrameType } from '../utils/stack-frame';
import type { ErrorLocation } from '../utils/parseCompileError';
import type { Theme } from '../styles';

const linkStyle = (theme: Theme) => ({
  fontSize: '0.9em',
  marginBottom: '0.9em',
});

const anchorStyle = (theme: Theme) => ({
  textDecoration: 'none',
  color: theme.anchorColor,
  cursor: 'pointer',
});

const codeAnchorStyle = (theme: Theme) => ({
  cursor: 'pointer',
});

const toggleStyle = (theme: Theme) => ({
  marginBottom: '1.5em',
  color: theme.toggleColor,
  cursor: 'pointer',
  border: 'none',
  display: 'block',
  width: '100%',
  textAlign: 'left',
  background: theme.toggleBackground,
  fontFamily: 'Consolas, Menlo, monospace',
  fontSize: '1em',
  padding: '0px',
  lineHeight: '1.5',
});

type StackFramePropsType = {|
  frame: StackFrameType,
  contextSize: number,
  critical: boolean,
  showCode: boolean,
  editorHandler: (errorLoc: ErrorLocation) => void,
|};

function StackFrame(props: StackFramePropsType) {
  const theme = useContext(ThemeContext);
  const [compiled, setCompiled] = useState(false);

  const toggleCompiled = () => {
    setCompiled(!compiled);
  };

  const getErrorLocation = (): ErrorLocation | null => {
    const { _originalFileName: fileName, _originalLineNumber: lineNumber } =
      props.frame;
    // Unknown file
    if (!fileName) {
      return null;
    }
    // e.g. "/path-to-my-app/webpack/bootstrap eaddeb46b67d75e4dfc1"
    const isInternalWebpackBootstrapCode = fileName.trim().indexOf(' ') !== -1;
    if (isInternalWebpackBootstrapCode) {
      return null;
    }
    // Code is in a real file
    return { fileName, lineNumber: lineNumber || 1 };
  };

  const editorHandler = () => {
    const errorLoc = getErrorLocation();
    if (!errorLoc) {
      return;
    }
    props.editorHandler(errorLoc);
  };

  const onKeyDown = (e: SyntheticKeyboardEvent<any>) => {
    if (e.key === 'Enter') {
      editorHandler();
    }
  };

  const { frame, contextSize, critical, showCode } = props;
  const {
    fileName,
    lineNumber,
    columnNumber,
    _scriptCode: scriptLines,
    _originalFileName: sourceFileName,
    _originalLineNumber: sourceLineNumber,
    _originalColumnNumber: sourceColumnNumber,
    _originalScriptCode: sourceLines,
  } = frame;
  const functionName = frame.getFunctionName();

  const url = getPrettyURL(
    sourceFileName,
    sourceLineNumber,
    sourceColumnNumber,
    fileName,
    lineNumber,
    columnNumber,
    compiled
  );

  let codeBlockProps = null;
  if (showCode) {
    if (
      compiled &&
      scriptLines &&
      scriptLines.length !== 0 &&
      lineNumber != null
    ) {
      codeBlockProps = {
        lines: scriptLines,
        lineNum: lineNumber,
        columnNum: columnNumber,
        contextSize,
        main: critical,
      };
    } else if (
      !compiled &&
      sourceLines &&
      sourceLines.length !== 0 &&
      sourceLineNumber != null
    ) {
      codeBlockProps = {
        lines: sourceLines,
        lineNum: sourceLineNumber,
        columnNum: sourceColumnNumber,
        contextSize,
        main: critical,
      };
    }
  }

  const canOpenInEditor =
    getErrorLocation() !== null && props.editorHandler !== null;
  return (
    <div>
      <div>{functionName}</div>
      <div style={linkStyle(theme)}>
        <span
          style={canOpenInEditor ? anchorStyle(theme) : null}
          onClick={canOpenInEditor ? editorHandler : null}
          onKeyDown={canOpenInEditor ? onKeyDown : null}
          tabIndex={canOpenInEditor ? '0' : null}
        >
          {url}
        </span>
      </div>
      {codeBlockProps && (
        <span>
          <span
            onClick={canOpenInEditor ? editorHandler : null}
            style={canOpenInEditor ? codeAnchorStyle(theme) : null}
          >
            <CodeBlock {...codeBlockProps} />
          </span>
          <button style={toggleStyle(theme)} onClick={toggleCompiled}>
            {'View ' + (compiled ? 'source' : 'compiled')}
          </button>
        </span>
      )}
    </div>
  );
}

export default StackFrame;
```

--------------------------------------------------------------------------------

---[FILE: StackFrameCodeBlock.js]---
Location: create-react-app-main/packages/react-error-overlay/src/containers/StackFrameCodeBlock.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useContext } from 'react';
import { ThemeContext } from '../iframeScript';
import CodeBlock from '../components/CodeBlock';
import { absolutifyCaret } from '../utils/dom/absolutifyCaret';
import type { ScriptLine } from '../utils/stack-frame';
import generateAnsiHTML from '../utils/generateAnsiHTML';

import { codeFrameColumns } from '@babel/code-frame';

type StackFrameCodeBlockPropsType = {|
  lines: ScriptLine[],
  lineNum: number,
  columnNum: ?number,
  contextSize: number,
  main: boolean,
|};

// Exact type workaround for spread operator.
// See: https://github.com/facebook/flow/issues/2405
type Exact<T> = $Shape<T>;

function StackFrameCodeBlock(props: Exact<StackFrameCodeBlockPropsType>) {
  const theme = useContext(ThemeContext);
  const { lines, lineNum, columnNum, contextSize, main } = props;
  const sourceCode = [];
  let whiteSpace = Infinity;
  lines.forEach(function (e) {
    const { content: text } = e;
    const m = text.match(/^\s*/);
    if (text === '') {
      return;
    }
    if (m && m[0]) {
      whiteSpace = Math.min(whiteSpace, m[0].length);
    } else {
      whiteSpace = 0;
    }
  });
  lines.forEach(function (e) {
    let { content: text } = e;
    const { lineNumber: line } = e;

    if (isFinite(whiteSpace)) {
      text = text.substring(whiteSpace);
    }
    sourceCode[line - 1] = text;
  });
  const ansiHighlight = codeFrameColumns(
    sourceCode.join('\n'),
    {
      start: {
        line: lineNum,
        column:
          columnNum == null
            ? 0
            : columnNum - (isFinite(whiteSpace) ? whiteSpace : 0),
      },
    },
    {
      forceColor: true,
      linesAbove: contextSize,
      linesBelow: contextSize,
    }
  );
  const htmlHighlight = generateAnsiHTML(ansiHighlight, theme);
  const code = document.createElement('code');
  code.innerHTML = htmlHighlight;
  absolutifyCaret(code);

  const ccn = code.childNodes;
  // eslint-disable-next-line
  oLoop: for (let index = 0; index < ccn.length; ++index) {
    const node = ccn[index];
    const ccn2 = node.childNodes;
    for (let index2 = 0; index2 < ccn2.length; ++index2) {
      const lineNode = ccn2[index2];
      const text = lineNode.innerText;
      if (text == null) {
        continue;
      }
      if (text.indexOf(' ' + lineNum + ' |') === -1) {
        continue;
      }
      // eslint-disable-next-line
      break oLoop;
    }
  }

  return <CodeBlock main={main} codeHTML={code.innerHTML} />;
}

export default StackFrameCodeBlock;
```

--------------------------------------------------------------------------------

---[FILE: StackTrace.js]---
Location: create-react-app-main/packages/react-error-overlay/src/containers/StackTrace.js
Signals: React

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { Component } from 'react';
import StackFrame from './StackFrame';
import Collapsible from '../components/Collapsible';
import { isInternalFile } from '../utils/isInternalFile';
import { isBultinErrorName } from '../utils/isBultinErrorName';

import type { StackFrame as StackFrameType } from '../utils/stack-frame';
import type { ErrorLocation } from '../utils/parseCompileError';

const traceStyle = {
  fontSize: '1em',
  flex: '0 1 auto',
  minHeight: '0px',
  overflow: 'auto',
};

type Props = {|
  stackFrames: StackFrameType[],
  errorName: string,
  contextSize: number,
  editorHandler: (errorLoc: ErrorLocation) => void,
|};

class StackTrace extends Component<Props> {
  renderFrames() {
    const { stackFrames, errorName, contextSize, editorHandler } = this.props;
    const renderedFrames = [];
    let hasReachedAppCode = false,
      currentBundle = [],
      bundleCount = 0;

    stackFrames.forEach((frame, index) => {
      const { fileName, _originalFileName: sourceFileName } = frame;
      const isInternalUrl = isInternalFile(sourceFileName, fileName);
      const isThrownIntentionally = !isBultinErrorName(errorName);
      const shouldCollapse =
        isInternalUrl && (isThrownIntentionally || hasReachedAppCode);

      if (!isInternalUrl) {
        hasReachedAppCode = true;
      }

      const frameEle = (
        <StackFrame
          key={'frame-' + index}
          frame={frame}
          contextSize={contextSize}
          critical={index === 0}
          showCode={!shouldCollapse}
          editorHandler={editorHandler}
        />
      );
      const lastElement = index === stackFrames.length - 1;

      if (shouldCollapse) {
        currentBundle.push(frameEle);
      }

      if (!shouldCollapse || lastElement) {
        if (currentBundle.length === 1) {
          renderedFrames.push(currentBundle[0]);
        } else if (currentBundle.length > 1) {
          bundleCount++;
          renderedFrames.push(
            <Collapsible key={'bundle-' + bundleCount}>
              {currentBundle}
            </Collapsible>
          );
        }
        currentBundle = [];
      }

      if (!shouldCollapse) {
        renderedFrames.push(frameEle);
      }
    });

    return renderedFrames;
  }

  render() {
    return <div style={traceStyle}>{this.renderFrames()}</div>;
  }
}

export default StackTrace;
```

--------------------------------------------------------------------------------

---[FILE: proxyConsole.js]---
Location: create-react-app-main/packages/react-error-overlay/src/effects/proxyConsole.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */

type ReactFrame = {
  fileName: string | null,
  lineNumber: number | null,
  name: string | null,
};
const reactFrameStack: Array<ReactFrame[]> = [];

export type { ReactFrame };

// This is a stripped down barebones version of this proposal:
// https://gist.github.com/sebmarkbage/bdefa100f19345229d526d0fdd22830f
// We're implementing just enough to get the invalid element type warnings
// to display the component stack in React 15.6+:
// https://github.com/facebook/react/pull/9679
/// TODO: a more comprehensive implementation.

const registerReactStack = () => {
  if (typeof console !== 'undefined') {
    // $FlowFixMe
    console.reactStack = frames => reactFrameStack.push(frames);
    // $FlowFixMe
    console.reactStackEnd = frames => reactFrameStack.pop();
  }
};

const unregisterReactStack = () => {
  if (typeof console !== 'undefined') {
    // $FlowFixMe
    console.reactStack = undefined;
    // $FlowFixMe
    console.reactStackEnd = undefined;
  }
};

type ConsoleProxyCallback = (message: string, frames: ReactFrame[]) => void;
const permanentRegister = function proxyConsole(
  type: string,
  callback: ConsoleProxyCallback
) {
  if (typeof console !== 'undefined') {
    const orig = console[type];
    if (typeof orig === 'function') {
      console[type] = function __stack_frame_overlay_proxy_console__() {
        try {
          const message = arguments[0];
          if (typeof message === 'string' && reactFrameStack.length > 0) {
            callback(message, reactFrameStack[reactFrameStack.length - 1]);
          }
        } catch (err) {
          // Warnings must never crash. Rethrow with a clean stack.
          setTimeout(function () {
            throw err;
          });
        }
        return orig.apply(this, arguments);
      };
    }
  }
};

export { permanentRegister, registerReactStack, unregisterReactStack };
```

--------------------------------------------------------------------------------

---[FILE: stackTraceLimit.js]---
Location: create-react-app-main/packages/react-error-overlay/src/effects/stackTraceLimit.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
let stackTraceRegistered: boolean = false;
// Default: https://docs.microsoft.com/en-us/scripting/javascript/reference/stacktracelimit-property-error-javascript
let restoreStackTraceValue: number = 10;

const MAX_STACK_LENGTH: number = 50;

function registerStackTraceLimit(limit: number = MAX_STACK_LENGTH) {
  if (stackTraceRegistered) {
    return;
  }
  try {
    restoreStackTraceValue = Error.stackTraceLimit;
    Error.stackTraceLimit = limit;
    stackTraceRegistered = true;
  } catch (e) {
    // Not all browsers support this so we don't care if it errors
  }
}

function unregisterStackTraceLimit() {
  if (!stackTraceRegistered) {
    return;
  }
  try {
    Error.stackTraceLimit = restoreStackTraceValue;
    stackTraceRegistered = false;
  } catch (e) {
    // Not all browsers support this so we don't care if it errors
  }
}

export {
  registerStackTraceLimit as register,
  unregisterStackTraceLimit as unregister,
};
```

--------------------------------------------------------------------------------

---[FILE: unhandledError.js]---
Location: create-react-app-main/packages/react-error-overlay/src/effects/unhandledError.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
let boundErrorHandler = null;

type ErrorCallback = (error: Error) => void;

function errorHandler(callback: ErrorCallback, e: Event): void {
  // $FlowFixMe
  if (!e.error) {
    return;
  }
  // $FlowFixMe
  const { error } = e;
  if (error instanceof Error) {
    callback(error);
  } else {
    // A non-error was thrown, we don't have a trace. :(
    // Look in your browser's devtools for more information
    callback(new Error(error));
  }
}

function registerUnhandledError(target: EventTarget, callback: ErrorCallback) {
  if (boundErrorHandler !== null) {
    return;
  }
  boundErrorHandler = errorHandler.bind(undefined, callback);
  target.addEventListener('error', boundErrorHandler);
}

function unregisterUnhandledError(target: EventTarget) {
  if (boundErrorHandler === null) {
    return;
  }
  target.removeEventListener('error', boundErrorHandler);
  boundErrorHandler = null;
}

export {
  registerUnhandledError as register,
  unregisterUnhandledError as unregister,
};
```

--------------------------------------------------------------------------------

---[FILE: unhandledRejection.js]---
Location: create-react-app-main/packages/react-error-overlay/src/effects/unhandledRejection.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
let boundRejectionHandler = null;

type ErrorCallback = (error: Error) => void;

function rejectionHandler(
  callback: ErrorCallback,
  e: PromiseRejectionEvent
): void {
  if (e == null || e.reason == null) {
    return callback(new Error('Unknown'));
  }
  let { reason } = e;
  if (reason instanceof Error) {
    return callback(reason);
  }
  // A non-error was rejected, we don't have a trace :(
  // Look in your browser's devtools for more information
  return callback(new Error(reason));
}

function registerUnhandledRejection(
  target: EventTarget,
  callback: ErrorCallback
) {
  if (boundRejectionHandler !== null) {
    return;
  }
  boundRejectionHandler = rejectionHandler.bind(undefined, callback);
  // $FlowFixMe
  target.addEventListener('unhandledrejection', boundRejectionHandler);
}

function unregisterUnhandledRejection(target: EventTarget) {
  if (boundRejectionHandler === null) {
    return;
  }
  // $FlowFixMe
  target.removeEventListener('unhandledrejection', boundRejectionHandler);
  boundRejectionHandler = null;
}

export {
  registerUnhandledRejection as register,
  unregisterUnhandledRejection as unregister,
};
```

--------------------------------------------------------------------------------

---[FILE: generateAnsiHTML.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/generateAnsiHTML.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */

import Anser from 'anser';
import { encode } from 'html-entities';
import type { Theme } from '../styles';

// Map ANSI colors from what babel-code-frame uses to base16-github
// See: https://github.com/babel/babel/blob/e86f62b304d280d0bab52c38d61842b853848ba6/packages/babel-code-frame/src/index.js#L9-L22
const colors = (theme: Theme) => ({
  reset: [theme.base05, 'transparent'],
  black: theme.base05,
  red: theme.base08 /* marker, bg-invalid */,
  green: theme.base0B /* string */,
  yellow: theme.base08 /* capitalized, jsx_tag, punctuator */,
  blue: theme.base0C,
  magenta: theme.base0C /* regex */,
  cyan: theme.base0E /* keyword */,
  gray: theme.base03 /* comment, gutter */,
  lightgrey: theme.base01,
  darkgrey: theme.base03,
});

const anserMap = {
  'ansi-bright-black': 'black',
  'ansi-bright-yellow': 'yellow',
  'ansi-yellow': 'yellow',
  'ansi-bright-green': 'green',
  'ansi-green': 'green',
  'ansi-bright-cyan': 'cyan',
  'ansi-cyan': 'cyan',
  'ansi-bright-red': 'red',
  'ansi-red': 'red',
  'ansi-bright-magenta': 'magenta',
  'ansi-magenta': 'magenta',
  'ansi-white': 'darkgrey',
};

function generateAnsiHTML(txt: string, theme: Theme): string {
  const arr = new Anser().ansiToJson(encode(txt), {
    use_classes: true,
  });

  let result = '';
  let open = false;
  for (let index = 0; index < arr.length; ++index) {
    const c = arr[index];
    const content = c.content,
      fg = c.fg;

    const contentParts = content.split('\n');
    for (let _index = 0; _index < contentParts.length; ++_index) {
      if (!open) {
        result += '<span data-ansi-line="true">';
        open = true;
      }
      const part = contentParts[_index].replace('\r', '');
      const color = colors(theme)[anserMap[fg]];
      if (color != null) {
        result += '<span style="color: ' + color + ';">' + part + '</span>';
      } else {
        if (fg != null) {
          console.log('Missing color mapping: ', fg);
        }
        result += '<span>' + part + '</span>';
      }
      if (_index < contentParts.length - 1) {
        result += '</span>';
        open = false;
        result += '<br/>';
      }
    }
  }
  if (open) {
    result += '</span>';
    open = false;
  }
  return result;
}

export default generateAnsiHTML;
```

--------------------------------------------------------------------------------

---[FILE: getLinesAround.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/getLinesAround.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import { ScriptLine } from './stack-frame';

/**
 *
 * @param {number} line The line number to provide context around.
 * @param {number} count The number of lines you'd like for context.
 * @param {string[] | string} lines The source code.
 */
function getLinesAround(
  line: number,
  count: number,
  lines: string[] | string
): ScriptLine[] {
  if (typeof lines === 'string') {
    lines = lines.split('\n');
  }
  const result = [];
  for (
    let index = Math.max(0, line - 1 - count);
    index <= Math.min(lines.length - 1, line - 1 + count);
    ++index
  ) {
    result.push(new ScriptLine(index + 1, lines[index], index === line - 1));
  }
  return result;
}

export { getLinesAround };
export default getLinesAround;
```

--------------------------------------------------------------------------------

---[FILE: getPrettyURL.js]---
Location: create-react-app-main/packages/react-error-overlay/src/utils/getPrettyURL.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
function getPrettyURL(
  sourceFileName: ?string,
  sourceLineNumber: ?number,
  sourceColumnNumber: ?number,
  fileName: ?string,
  lineNumber: ?number,
  columnNumber: ?number,
  compiled: boolean
): string {
  let prettyURL;
  if (!compiled && sourceFileName && typeof sourceLineNumber === 'number') {
    // Remove everything up to the first /src/ or /node_modules/
    const trimMatch = /^[/|\\].*?[/|\\]((src|node_modules)[/|\\].*)/.exec(
      sourceFileName
    );
    if (trimMatch && trimMatch[1]) {
      prettyURL = trimMatch[1];
    } else {
      prettyURL = sourceFileName;
    }
    prettyURL += ':' + sourceLineNumber;
    // Note: we intentionally skip 0's because they're produced by cheap webpack maps
    if (sourceColumnNumber) {
      prettyURL += ':' + sourceColumnNumber;
    }
  } else if (fileName && typeof lineNumber === 'number') {
    prettyURL = fileName + ':' + lineNumber;
    // Note: we intentionally skip 0's because they're produced by cheap webpack maps
    if (columnNumber) {
      prettyURL += ':' + columnNumber;
    }
  } else {
    prettyURL = 'unknown';
  }
  return prettyURL.replace('webpack://', '.');
}

export { getPrettyURL };
export default getPrettyURL;
```

--------------------------------------------------------------------------------

````

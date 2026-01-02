---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 659
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 659 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/react-table/index.ts

```typescript
import { useReactTable as tanstackUseReactTable } from '@tanstack/react-table';
import type { TableOptions, RowData } from '@tanstack/table-core';

export function useReactTable_unverifiedWithReact18<TData extends RowData>(
  filePath: string,
  options: TableOptions<TData>,
): ReturnType<typeof tanstackUseReactTable<TData>> {
  return tanstackUseReactTable(options);
}

export const useReactTable_verifiedWithReact18 = tanstackUseReactTable;
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/snippet/index.tsx
Signals: React

```typescript
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import go from 'react-syntax-highlighter/dist/cjs/languages/prism/go';
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml';
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
import duotoneDarkStyle from './theme/databricks-duotone-dark';
import lightStyle from './theme/databricks-light';
import type { CSSProperties, ReactNode } from 'react';
import { pick } from 'lodash';

SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('json', json);
export type CodeSnippetTheme = 'duotoneDark' | 'light';
export const buttonBackgroundColorDark = 'rgba(140, 203, 255, 0)';
export const buttonColorDark = 'rgba(255, 255, 255, 0.84)';
export const buttonHoverColorDark = '#8ccbffcc';
export const buttonHoverBackgroundColorDark = 'rgba(140, 203, 255, 0.08)';
export const duboisAlertBackgroundColor = '#fff0f0';
export const snippetPadding = '24px';
const themesStyles: Record<CodeSnippetTheme, any> = {
  light: lightStyle,
  duotoneDark: duotoneDarkStyle,
};

export type CodeSnippetLanguage = 'sql' | 'java' | 'python' | 'javascript' | 'go' | 'yaml' | 'text' | 'json';

export interface CodeSnippetProps {
  /**
   * The code string
   */
  children: string;
  /**
   * The actions that are displayed on the right top corner of the component
   *  see `./actions` for built-in actions
   */
  actions?: NonNullable<ReactNode> | NonNullable<ReactNode>[];
  /**
   * The theme, default theme is `light`
   */
  theme?: CodeSnippetTheme;
  /**
   * Language of the code (`children`)
   */
  language: CodeSnippetLanguage;
  /**
   * Custom styles (passed to the internal `<pre>`)
   */
  style?: CSSProperties;
  /**
   * Whether to show line numbers on the left or not
   */
  showLineNumbers?: boolean;
  /**
   * Custom styles for line numbers
   */
  lineNumberStyle?: CSSProperties;
  /**
   * Boolean to specify whether to style the <code> block with white-space: pre-wrap or white-space: pre
   */
  wrapLongLines?: boolean;
  /**
   * Boolean that determines whether or not each line of code should be wrapped in a parent element
   */
  wrapLines?: boolean;
  /**
   * Props to pass to the line elements
   */
  lineProps?: React.HTMLProps<HTMLElement> | undefined;
  /**
   * Custom tag to use for the `<pre>` element
   */
  PreTag?: keyof JSX.IntrinsicElements | React.ComponentType<React.PropsWithChildren<any>> | undefined;
}

/**
 * `CodeSnippet` is used for highlighting code, use this instead of
 */
export function CodeSnippet({
  theme = 'light',
  language,
  actions,
  style,
  children,
  showLineNumbers,
  lineNumberStyle,
  wrapLongLines,
  wrapLines,
  lineProps,
  PreTag,
}: CodeSnippetProps) {
  const customStyle = {
    border: 'none',
    borderRadius: 0,
    margin: 0,
    padding: snippetPadding,
    ...style,
  };
  return (
    <SyntaxHighlighter
      showLineNumbers={showLineNumbers}
      lineNumberStyle={lineNumberStyle}
      language={language}
      style={themesStyles[theme]}
      customStyle={customStyle}
      codeTagProps={{
        style: pick(style, 'backgroundColor'),
      }}
      lineProps={lineProps}
      wrapLongLines={wrapLongLines}
      wrapLines={wrapLines}
      PreTag={PreTag}
    >
      {children}
    </SyntaxHighlighter>
  );
}

export * from './actions/SnippetCopyAction';
```

--------------------------------------------------------------------------------

---[FILE: SnippetActionButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/snippet/actions/SnippetActionButton.tsx
Signals: React

```typescript
import { css } from '@emotion/react';
import type { ReactNode } from 'react';
import React from 'react';

import type { ButtonProps } from '@databricks/design-system';
import { Button, Tooltip } from '@databricks/design-system';

type SnippetActionButtonProps = Pick<ButtonProps, 'icon' | 'onClick' | 'href' | 'rel' | 'target'> & {
  tooltipMessage: NonNullable<ReactNode>;
};

export default function SnippetActionButton({ tooltipMessage, ...buttonProps }: SnippetActionButtonProps) {
  const style = css({
    zIndex: 1, // required for action buttons to be visible and float
  });
  return (
    <Tooltip content={tooltipMessage} componentId="codegen_web-shared_src_snippet_actions_snippetactionbutton.tsx_26">
      <Button
        componentId="codegen_web-shared_src_snippet_actions_snippetactionbutton.tsx_33"
        {...buttonProps}
        css={style}
      />
    </Tooltip>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: SnippetCopyAction.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/snippet/actions/SnippetCopyAction.tsx
Signals: React

```typescript
import React from 'react';

import type { ButtonProps } from '@databricks/design-system';
import { useCopyController } from '@databricks/web-shared/copy';

import SnippetActionButton from './SnippetActionButton';

export interface SnippetCopyActionProps extends ButtonProps {
  /**
   * The text to be copied into clipboard when action button is clicked.
   */
  copyText: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function SnippetCopyAction({ copyText, onClick, ...props }: SnippetCopyActionProps) {
  const { actionIcon, tooltipMessage, copy } = useCopyController(copyText);

  return (
    <SnippetActionButton
      tooltipMessage={tooltipMessage}
      icon={actionIcon}
      onClick={(e) => {
        copy();
        onClick?.(e);
      }}
      {...props}
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: useCopyController.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/snippet/hooks/useCopyController.tsx
Signals: React

```typescript
import type { ReactElement } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';

import { CheckIcon, CopyIcon } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

export interface CopyController {
  actionIcon: ReactElement;
  tooltipMessage: string;
  copy: () => void;
  copied: boolean;
  ariaLabel: string;
  tooltipOpen: boolean;
  handleTooltipOpenChange: (open: boolean) => void;
}

/**
 * Utility hook that is internal to web-shared, use: `Copyable` or `CopyActionButton`
 *  or if it's a `CodeSnippet`, `SnippetCopyAction`
 */
export function useCopyController(text: string, copyTooltip?: string, onCopy?: () => void): CopyController {
  const intl = useIntl();

  const copyMessage = copyTooltip
    ? copyTooltip
    : intl.formatMessage({
        defaultMessage: 'Copy',
        description: 'Tooltip message displayed on copy action',
      });

  const copiedMessage = intl.formatMessage({
    defaultMessage: 'Copied',
    description: 'Tooltip message displayed on copy action after it has been clicked',
  });

  const clipboard = useClipboard();
  const copiedTimerIdRef = useRef<number>();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      window.clearTimeout(copiedTimerIdRef.current);
    };
  }, []);

  const copy = () => {
    clipboard.copy(text);
    window.clearTimeout(copiedTimerIdRef.current);
    setCopied(true);
    onCopy?.();
    copiedTimerIdRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return {
    actionIcon: copied ? <CheckIcon /> : <CopyIcon />,
    tooltipMessage: copied ? copiedMessage : copyMessage,
    copy,
    copied,
    ariaLabel: copyMessage,
    tooltipOpen: open || copied,
    handleTooltipOpenChange: setOpen,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: databricks-duotone-dark.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/snippet/theme/databricks-duotone-dark.ts

```typescript
/**
 * Adapted from `duotone-dark`
 * Ref: https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/b2457268891948f7005ccf539a70c000f0695bde/src/styles/prism/duotone-dark.js
 */

const databricksDuotoneDarkTheme = {
  'code[class*="language-"]': {
    fontFamily:
      'Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    background: '#2a2734',
    color: '#5DFAFC', // D
  },
  'pre[class*="language-"]': {
    fontFamily:
      'Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    background: '#2a2734',
    color: '#5DFAFC', // D
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  'pre > code[class*="language-"]': {
    fontSize: '1em',
  },
  'pre[class*="language-"]::-moz-selection': {
    textShadow: 'none',
    background: '#6a51e6',
  },
  'pre[class*="language-"] ::-moz-selection': {
    textShadow: 'none',
    background: '#6a51e6',
  },
  'code[class*="language-"]::-moz-selection': {
    textShadow: 'none',
    background: '#6a51e6',
  },
  'code[class*="language-"] ::-moz-selection': {
    textShadow: 'none',
    background: '#6a51e6',
  },
  'pre[class*="language-"]::selection': {
    textShadow: 'none',
    background: '#6a51e6',
  },
  'pre[class*="language-"] ::selection': {
    textShadow: 'none',
    background: '#6a51e6',
  },
  'code[class*="language-"]::selection': {
    textShadow: 'none',
    background: '#6a51e6',
  },
  'code[class*="language-"] ::selection': {
    textShadow: 'none',
    background: '#6a51e6',
  },
  ':not(pre) > code[class*="language-"]': {
    padding: '.1em',
    borderRadius: '.3em',
  },
  comment: {
    color: '#6c6783',
  },
  prolog: {
    color: '#6c6783',
  },
  doctype: {
    color: '#6c6783',
  },
  cdata: {
    color: '#6c6783',
  },
  punctuation: {
    color: '#6c6783',
  },
  namespace: {
    Opacity: '.7',
  },
  tag: {
    color: '#3AACE2', // D
  },
  operator: {
    color: '#3AACE2', // D
  },
  number: {
    color: '#3AACE2', // D
  },
  property: {
    color: '#5DFAFC', // D
  },
  function: {
    color: '#5DFAFC', // D
  },
  'tag-id': {
    color: '#eeebff',
  },
  selector: {
    color: '#eeebff',
  },
  'atrule-id': {
    color: '#eeebff',
  },
  'code.language-javascript': {
    color: '#c4b9fe',
  },
  'attr-name': {
    color: '#c4b9fe',
  },
  'code.language-css': {
    color: '#ffffff', // D
  },
  'code.language-scss': {
    color: '#ffffff', // D
  },
  boolean: {
    color: '#ffffff', // D
  },
  string: {
    color: '#ffffff', // D
  },
  entity: {
    color: '#ffffff', // D
    cursor: 'help',
  },
  url: {
    color: '#ffffff', // D
  },
  '.language-css .token.string': {
    color: '#ffffff', // D
  },
  '.language-scss .token.string': {
    color: '#ffffff', // D
  },
  '.style .token.string': {
    color: '#ffffff', // D
  },
  'attr-value': {
    color: '#ffffff', // D
  },
  keyword: {
    color: '#ffffff', // D
  },
  control: {
    color: '#ffffff', // D
  },
  directive: {
    color: '#ffffff', // D
  },
  unit: {
    color: '#ffffff', // D
  },
  statement: {
    color: '#ffffff', // D
  },
  regex: {
    color: '#ffffff', // D
  },
  atrule: {
    color: '#ffffff', // D
  },
  placeholder: {
    color: '#ffffff', // D
  },
  variable: {
    color: '#ffffff', // D
  },
  deleted: {
    textDecoration: 'line-through',
  },
  inserted: {
    borderBottom: '1px dotted #eeebff',
    textDecoration: 'none',
  },
  italic: {
    fontStyle: 'italic',
  },
  important: {
    fontWeight: 'bold',
    color: '#c4b9fe',
  },
  bold: {
    fontWeight: 'bold',
  },
  'pre > code.highlight': {
    Outline: '.4em solid #8a75f5',
    OutlineOffset: '.4em',
  },
  '.line-numbers.line-numbers .line-numbers-rows': {
    borderRightColor: '#2c2937',
  },
  '.line-numbers .line-numbers-rows > span:before': {
    color: '#3c3949',
  },
  '.line-highlight.line-highlight': {
    background: 'linear-gradient(to right, rgba(224, 145, 66, 0.2) 70%, rgba(224, 145, 66, 0))',
  },
};

export default databricksDuotoneDarkTheme;
```

--------------------------------------------------------------------------------

---[FILE: databricks-light.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/snippet/theme/databricks-light.ts

```typescript
/**
 * Adapted from `material-light`
 * Ref: https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/b2457268891948f7005ccf539a70c000f0695bde/src/styles/prism/material-light.js#L1
 *
 * This theme overwrites colors to be similiar to the `@databricks/editor` theme.
 */

const databricksLightTheme = {
  'code[class*="language-"]': {
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    color: 'rgb(77, 77, 76)', // D
    background: '#fafafa',
    fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, source-code-pro, monospace',
    fontSize: '12px', // D
    lineHeight: '1.5em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    color: 'rgb(77, 77, 76)', // D
    background: '#fafafa',
    fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, source-code-pro, monospace',
    fontSize: '12px', // D
    lineHeight: '1.5em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    overflow: 'auto',
    position: 'relative',
    margin: '0.5em 0',
    padding: '1.25em 1em',
  },
  'code[class*="language-"]::-moz-selection': {
    background: '#cceae7',
    color: '#263238',
  },
  'pre[class*="language-"]::-moz-selection': {
    background: '#cceae7',
    color: '#263238',
  },
  'code[class*="language-"] ::-moz-selection': {
    background: '#cceae7',
    color: '#263238',
  },
  'pre[class*="language-"] ::-moz-selection': {
    background: '#cceae7',
    color: '#263238',
  },
  'code[class*="language-"]::selection': {
    background: '#cceae7',
    color: '#263238',
  },
  'pre[class*="language-"]::selection': {
    background: '#cceae7',
    color: '#263238',
  },
  'code[class*="language-"] ::selection': {
    background: '#cceae7',
    color: '#263238',
  },
  'pre[class*="language-"] ::selection': {
    background: '#cceae7',
    color: '#263238',
  },
  ':not(pre) > code[class*="language-"]': {
    whiteSpace: 'normal',
    borderRadius: '0.2em',
    padding: '0.1em',
  },
  '.language-css > code': {
    color: '#f5871f', // D
  },
  '.language-sass > code': {
    color: '#f5871f', // D
  },
  '.language-scss > code': {
    color: '#f5871f', // D
  },
  '[class*="language-"] .namespace': {
    Opacity: '0.7',
  },
  atrule: {
    color: '#7c4dff',
  },
  'attr-name': {
    color: '#39adb5',
  },
  'attr-value': {
    color: '#f6a434',
  },
  attribute: {
    color: '#f6a434',
  },
  boolean: {
    color: '#7c4dff', // D
  },
  builtin: {
    color: '#39adb5',
  },
  cdata: {
    color: '#39adb5',
  },
  char: {
    color: '#39adb5',
  },
  class: {
    color: '#39adb5',
  },
  'class-name': {
    color: '#6182b8',
  },
  comment: {
    color: '#8e908c', // D
  },
  constant: {
    color: '#7c4dff', // D
  },
  deleted: {
    color: '#e53935',
  },
  doctype: {
    color: '#aabfc9',
  },
  entity: {
    color: '#e53935',
  },
  function: {
    color: '#4271ae', // D
  },
  hexcode: {
    color: '#f5871f', // D
  },
  id: {
    color: '#7c4dff',
    fontWeight: 'bold',
  },
  important: {
    color: '#7c4dff',
    fontWeight: 'bold',
  },
  inserted: {
    color: '#39adb5',
  },
  keyword: {
    color: '#8959a8', // D
  },
  number: {
    color: '#f5871f', // D
  },
  operator: {
    color: '#3e999f', // D
  },
  prolog: {
    color: '#aabfc9',
  },
  property: {
    color: '#39adb5',
  },
  'pseudo-class': {
    color: '#f6a434',
  },
  'pseudo-element': {
    color: '#f6a434',
  },
  punctuation: {
    color: 'rgb(77, 77, 76)', // D
  },
  regex: {
    color: '#6182b8',
  },
  selector: {
    color: '#e53935',
  },
  string: {
    color: '#3ba85f', // D
  },
  symbol: {
    color: '#7c4dff',
  },
  tag: {
    color: '#e53935',
  },
  unit: {
    color: '#f5871f', // D
  },
  url: {
    color: '#e53935',
  },
  variable: {
    color: '#c72d4c', // D
  },
};

export default databricksLightTheme;
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/index.ts

```typescript
export { TagAssignmentRoot } from './components/TagAssignmentRoot';
export { TagAssignmentRow } from './components/TagAssignmentRow';
export { TagAssignmentLabel } from './components/TagAssignmentLabel';
export { TagAssignmentKey } from './components/TagAssignmentKey';
export { TagAssignmentValue } from './components/TagAssignmentValue';
export { TagAssignmentRemoveButton } from './components/TagAssignmentRemoveButton';
export { useTagAssignmentForm } from './hooks/useTagAssignmentForm';
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentKey.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentKey.tsx
Signals: React

```typescript
// Do not modify this file

import React from 'react';
import type { ControllerProps, FieldValues, Path, UseControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { TagAssignmentInput } from './TagAssignmentField/TagAssignmentInput';
import { useTagAssignmentContext } from '../context/TagAssignmentContextProvider';

interface TagAssignmentKeyProps<T extends FieldValues> {
  index: number;
  rules?: UseControllerProps<T>['rules'];
  render?: ControllerProps<T>['render'];
}

export function TagAssignmentKey<T extends FieldValues>({ index, rules, render }: TagAssignmentKeyProps<T>) {
  const { name, keyProperty, getTagsValues, emptyValue, appendIfPossible } = useTagAssignmentContext<T>();

  return (
    <Controller
      name={`${name}.${index}.${keyProperty}` as Path<T>}
      rules={rules}
      render={({ field, fieldState, formState }) => {
        const legacyChange = field.onChange;

        function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
          legacyChange(e);

          const tags = getTagsValues();
          if (!tags?.at(-1)?.[keyProperty]) return;
          appendIfPossible(emptyValue, { shouldFocus: false });
        }
        field.onChange = handleChange;

        if (render) {
          return render({ field, fieldState, formState });
        }

        return (
          <TagAssignmentInput
            componentId="TagAssignmentKey.Default.Input"
            errorMessage={fieldState.error?.message}
            {...field}
          />
        );
      }}
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentLabel.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentLabel.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';

import { TagAssignmentLabel } from './TagAssignmentLabel';

describe('TagAssignmentLabel', () => {
  it('renders children', () => {
    const { getByText } = render(<TagAssignmentLabel>test</TagAssignmentLabel>);
    expect(getByText('test')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentLabel.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentLabel.tsx

```typescript
import { Typography } from '@databricks/design-system';

export function TagAssignmentLabel({ children }: { children: React.ReactNode }) {
  return <Typography.Text bold>{children}</Typography.Text>;
}
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRemoveButton.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentRemoveButton.test.tsx

```typescript
import { describe, it, jest, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { TagAssignmentRemoveButton } from './TagAssignmentRemoveButton';
import { TestTagAssignmentContextProvider } from '../test-utils/TestTagAssignmentContextProvider';

describe('TagAssignmentRemoveButton', () => {
  it('should call function with right index when clicked', async () => {
    const removeOrUpdate = jest.fn();
    render(
      <IntlProvider locale="en">
        <TestTagAssignmentContextProvider removeOrUpdate={removeOrUpdate}>
          <TagAssignmentRemoveButton index={1} componentId="test" />
        </TestTagAssignmentContextProvider>
      </IntlProvider>,
    );

    expect(removeOrUpdate).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button'));

    expect(removeOrUpdate).toHaveBeenCalledWith(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRemoveButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentRemoveButton.tsx

```typescript
import type { ButtonProps } from '@databricks/design-system';

import { TagAssignmentRemoveButtonUI } from './TagAssignmentUI/TagAssignmentRemoveButtonUI';
import { useTagAssignmentContext } from '../context/TagAssignmentContextProvider';

export interface TagAssignmentRemoveButtonProps extends Omit<ButtonProps, 'onClick' | 'icon'> {
  index: number;
}

export function TagAssignmentRemoveButton({ index, ...props }: TagAssignmentRemoveButtonProps) {
  const { removeOrUpdate } = useTagAssignmentContext();

  return <TagAssignmentRemoveButtonUI onClick={() => removeOrUpdate(index)} {...props} />;
}
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRoot.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentRoot.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, renderHook, screen } from '@testing-library/react';
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { IntlProvider } from 'react-intl';

import { TagAssignmentRoot } from './TagAssignmentRoot';
import { useTagAssignmentForm } from '../hooks/useTagAssignmentForm';

describe('TagAssignmentRoot', () => {
  function TestComponent({ children, form }: { children: React.ReactNode; form?: UseFormReturn }) {
    const tagsForm = useTagAssignmentForm({
      name: 'tags',
      emptyValue: { key: '', value: undefined },
      keyProperty: 'key',
      valueProperty: 'value',
      form,
    });

    return <TagAssignmentRoot {...tagsForm}>{children}</TagAssignmentRoot>;
  }
  it('should throw an error when used without a context or form prop', () => {
    expect(() =>
      render(
        <IntlProvider locale="en">
          <TestComponent>
            <div>child</div>
          </TestComponent>
        </IntlProvider>,
      ),
    ).toThrow('Nest your component on a FormProvider or pass a form prop');
  });

  it('should render child correctly if form prop is passed', () => {
    const { result } = renderHook(() => useForm());
    render(
      <IntlProvider locale="en">
        <TestComponent form={result.current}>
          <div>child</div>
        </TestComponent>
      </IntlProvider>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('should render child correctly if inside a form provider', () => {
    const { result } = renderHook(() => useForm());
    render(
      <IntlProvider locale="en">
        <FormProvider {...result.current}>
          <TestComponent>
            <div>child</div>
          </TestComponent>
        </FormProvider>
      </IntlProvider>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRoot.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentRoot.tsx

```typescript
import invariant from 'invariant';
import type { ArrayPath, FieldArray, FieldValues } from 'react-hook-form';
import { FormProvider, useFormContext } from 'react-hook-form';

import { TagAssignmentRowContainer } from './TagAssignmentUI/TagAssignmentRowContainer';
import { TagAssignmentContextProvider } from '../context/TagAssignmentContextProvider';
import type { UseTagAssignmentFormReturn } from '../hooks/useTagAssignmentForm';

export function TagAssignmentRoot<
  T extends FieldValues = FieldValues,
  K extends ArrayPath<T> = ArrayPath<T>,
  V extends FieldArray<T, K> = FieldArray<T, K>,
>({ children, ...props }: { children: React.ReactNode } & UseTagAssignmentFormReturn<T, K, V>) {
  const formCtx = useFormContext();

  const Component = (
    <TagAssignmentContextProvider {...props}>
      <TagAssignmentRowContainer>{children}</TagAssignmentRowContainer>
    </TagAssignmentContextProvider>
  );

  if (formCtx) {
    return Component;
  }

  invariant(props.form, 'Nest your component on a FormProvider or pass a form prop');

  return <FormProvider {...props.form}>{Component}</FormProvider>;
}
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRow.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentRow.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { TagAssignmentRow } from './TagAssignmentRow';

describe('TagAssignmentRow', () => {
  it('should throw an error if more than 3 children are passed', () => {
    const children = Array(4)
      .fill(null)
      .map((_, i) => <div key={i} />);

    const renderComponent = () =>
      render(
        <IntlProvider locale="en">
          <TagAssignmentRow>{children}</TagAssignmentRow>
        </IntlProvider>,
      );

    expect(renderComponent).toThrow('TagAssignmentRow must have 3 children or less');
  });

  it('should render children', () => {
    const children = Array(3)
      .fill(null)
      .map((_, i) => <div key={i} />);

    const { container } = render(
      <IntlProvider locale="en">
        <TagAssignmentRow>{children}</TagAssignmentRow>
      </IntlProvider>,
    );

    expect(container).toMatchSnapshot();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRow.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentRow.tsx
Signals: React

```typescript
import invariant from 'invariant';
import React from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';

export function TagAssignmentRow({ children }: { children: React.ReactNode }) {
  const { theme } = useDesignSystemTheme();

  const stableChildren = React.Children.toArray(children);
  invariant(stableChildren.length <= 3, 'TagAssignmentRow must have 3 children or less');

  const parsedChildren = Array(3)
    .fill(null)
    .map((_, i) => stableChildren[i] ?? <span key={i} style={{ width: theme.general.heightSm }} />); // Sync width with only icon button width

  return (
    <div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr min-content', gap: theme.spacing.sm }}>
      {parsedChildren}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentValue.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentValue.tsx

```typescript
// Do not modify this file

import type { ControllerProps, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { TagAssignmentInput } from './TagAssignmentField/TagAssignmentInput';
import { useTagAssignmentContext } from '../context/TagAssignmentContextProvider';

interface TagAssignmentValueProps<T extends FieldValues> {
  rules?: ControllerProps<T>['rules'];
  index: number;
  render?: ControllerProps<T>['render'];
}

export function TagAssignmentValue<T extends FieldValues>({ rules, index, render }: TagAssignmentValueProps<T>) {
  const { name, valueProperty } = useTagAssignmentContext<T>();

  return (
    <Controller
      rules={rules}
      name={`${name}.${index}.${valueProperty}` as Path<T>}
      render={({ field, fieldState, formState }) => {
        if (render) {
          return render({ field, fieldState, formState });
        }

        return (
          <TagAssignmentInput
            componentId="TagAssignmentValue.Default.Input"
            errorMessage={fieldState.error?.message}
            {...field}
          />
        );
      }}
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentField/index.ts

```typescript
import { TagAssignmentInput } from './TagAssignmentInput';

export const TagAssignmentField = {} as { Input: typeof TagAssignmentInput };

TagAssignmentField.Input = TagAssignmentInput;
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentInput.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentField/TagAssignmentInput.tsx
Signals: React

```typescript
import { forwardRef } from 'react';

import type { InputProps, InputRef } from '@databricks/design-system';
import { FormUI, Input } from '@databricks/design-system';

interface TagAssignmentInputProps extends InputProps {
  errorMessage?: string;
}

export const TagAssignmentInput: React.ForwardRefExoticComponent<
  TagAssignmentInputProps & React.RefAttributes<InputRef>
> = forwardRef<InputRef, TagAssignmentInputProps>(({ errorMessage, ...otherProps }: TagAssignmentInputProps, ref) => {
  return (
    <div css={{ flex: 1 }}>
      <Input validationState={errorMessage ? 'error' : 'info'} {...otherProps} ref={ref} />
      {errorMessage && <FormUI.Message message={errorMessage} type="error" />}
    </div>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentUI/index.ts

```typescript
import { TagAssignmentRemoveButtonUI } from './TagAssignmentRemoveButtonUI';
import { TagAssignmentRowContainer } from './TagAssignmentRowContainer';
import { TagAssignmentInput } from '../TagAssignmentField/TagAssignmentInput';
import { TagAssignmentLabel } from '../TagAssignmentLabel';
import { TagAssignmentRow } from '../TagAssignmentRow';

/**
 * Contains pure UI components without any built-in RHF state handling.
 * These can be used without useTagAssignmentForm or TagAssignmentRoot.
 */
export const TagAssignmentUI: {
  RowContainer: typeof TagAssignmentRowContainer;
  Row: typeof TagAssignmentRow;
  Input: typeof TagAssignmentInput;
  Label: typeof TagAssignmentLabel;
  RemoveButton: typeof TagAssignmentRemoveButtonUI;
} = {
  RowContainer: TagAssignmentRowContainer,
  Row: TagAssignmentRow,
  Input: TagAssignmentInput,
  Label: TagAssignmentLabel,
  RemoveButton: TagAssignmentRemoveButtonUI,
};
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRemoveButtonUI.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentUI/TagAssignmentRemoveButtonUI.test.tsx

```typescript
import { describe, it, jest, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TagAssignmentRemoveButtonUI } from './TagAssignmentRemoveButtonUI';

describe('TagAssignmentRemoveButtonUI', () => {
  it('should render a button', async () => {
    const handleClick = jest.fn();
    render(<TagAssignmentRemoveButtonUI componentId="test" onClick={handleClick} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRemoveButtonUI.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentUI/TagAssignmentRemoveButtonUI.tsx

```typescript
import type { ButtonProps } from '@databricks/design-system';
import { Button, TrashIcon } from '@databricks/design-system';

export function TagAssignmentRemoveButtonUI(props: Omit<ButtonProps, 'icon'>) {
  return <Button icon={<TrashIcon />} {...props} />;
}
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRowContainer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentUI/TagAssignmentRowContainer.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { TagAssignmentRowContainer } from './TagAssignmentRowContainer';

describe('TagAssignmentRowContainer', () => {
  it('should render children', () => {
    render(
      <TagAssignmentRowContainer>
        <div>child</div>
      </TagAssignmentRowContainer>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRowContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/TagAssignmentUI/TagAssignmentRowContainer.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';

export function TagAssignmentRowContainer({ children }: { children: React.ReactNode }) {
  const { theme } = useDesignSystemTheme();
  return <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>{children}</div>;
}
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentRow.test.tsx.snap]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/components/__snapshots__/TagAssignmentRow.test.tsx.snap

```text
// Jest Snapshot v1, https://jestjs.io/docs/snapshot-testing

exports[`TagAssignmentRow should render children 1`] = `
<div>
  <div
    css="[object Object]"
  >
    <div />
    <div />
    <div />
  </div>
</div>
`;
```

--------------------------------------------------------------------------------

---[FILE: TagAssignmentContextProvider.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/context/TagAssignmentContextProvider.tsx
Signals: React

```typescript
import invariant from 'invariant';
import { createContext, useContext } from 'react';
import type { FieldValues, ArrayPath, FieldArray } from 'react-hook-form';

import type { UseTagAssignmentFormReturn } from '../hooks/useTagAssignmentForm';

export const TagAssignmentContext = createContext<UseTagAssignmentFormReturn | null>(null);

export function TagAssignmentContextProvider<
  T extends FieldValues = FieldValues,
  K extends ArrayPath<T> = ArrayPath<T>,
  V extends FieldArray<T, K> = FieldArray<T, K>,
>({ children, ...props }: { children: React.ReactNode } & UseTagAssignmentFormReturn<T, K, V>) {
  return <TagAssignmentContext.Provider value={props as any}>{children}</TagAssignmentContext.Provider>;
}

export function useTagAssignmentContext<
  T extends FieldValues = FieldValues,
  K extends ArrayPath<T> = ArrayPath<T>,
  V extends FieldArray<T, K> = FieldArray<T, K>,
>() {
  const context = useContext(TagAssignmentContext as React.Context<UseTagAssignmentFormReturn<T, K, V> | null>);
  invariant(context, 'useTagAssignmentContext must be used within a TagAssignmentRoot');
  return context;
}
```

--------------------------------------------------------------------------------

````

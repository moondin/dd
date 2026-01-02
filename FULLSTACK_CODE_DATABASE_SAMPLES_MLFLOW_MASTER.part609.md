---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 609
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 609 of 991)

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

---[FILE: PredefinedErrors.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/errors/PredefinedErrors.tsx

```typescript
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line no-restricted-imports
import type { ServerError } from '@apollo/client';

import { ErrorLogType } from './ErrorLogType';
import { ErrorName } from './ErrorName';

export type HandleableError = Error | string | Record<string, unknown> | PredefinedError | Response;

export type CausableError = Error | string | Record<string, unknown>;

export abstract class PredefinedError extends Error {
  abstract errorLogType: ErrorLogType;
  abstract errorName: ErrorName;
  abstract displayMessage: React.ReactNode;
  isUserError = false;

  constructor(message?: string, cause?: CausableError) {
    super(message);
  }
}

export const matchPredefinedError = (error: HandleableError) => {
  if (error instanceof PredefinedError) {
    return error;
  }
  if (error instanceof Error && ('networkError' in error || 'graphQLErrors' in error)) {
    return matchPredefinedApolloError(error);
  }

  if (error instanceof Response) {
    return matchPredefinedErrorFromResponse(error);
  }

  return new UnknownError(error);
};

export function isServerError(e: unknown): e is ServerError {
  return e instanceof Error && e.hasOwnProperty('response');
}

const matchPredefinedApolloError = (error: Error) => {
  // Some errors from Apollo mock provider may have `networkError` but are not `ServerError`
  // only act on ServerError, which do have the response attached
  if ('networkError' in error && isServerError(error.networkError)) {
    return matchPredefinedErrorFromResponse(error.networkError.response, error.networkError);
  }

  return new GraphQLGenericError(error);
};

const getNetworkRequestErrorDetailsFromResponse = (response: Response): NetworkRequestErrorDetails => {
  const status = response.status;

  return { status };
};

export const matchPredefinedErrorFromResponse = (response: Response, originalError?: CausableError) => {
  const errorDetails = NetworkRequestError.getNetworkRequestErrorDetailsFromResponse(response);
  switch (response.status) {
    case 400:
      return new BadRequestError(errorDetails, originalError);
    case 401:
      return new UnauthorizedError(errorDetails, originalError);
    case 403:
      return new PermissionError(errorDetails, originalError);
    case 404:
      return new NotFoundError(errorDetails, originalError);
    case 429:
      return new RateLimitedError(errorDetails, originalError);
    case 500:
      return new InternalServerError(errorDetails, originalError);
    case 503:
      return new ServiceUnavailableError(errorDetails, originalError);
    default:
      return new GenericNetworkRequestError(errorDetails, originalError);
  }
};

interface NetworkRequestErrorDetails {
  status?: number;
  response?: Response;
}

export abstract class NetworkRequestError extends PredefinedError {
  status?: number;
  response?: Response;

  constructor(message: string, details: NetworkRequestErrorDetails, cause?: CausableError) {
    super(message, cause);
    this.status = details.status;
    this.response = details.response;
  }

  static getNetworkRequestErrorDetailsFromResponse = getNetworkRequestErrorDetailsFromResponse;
}

export class GenericNetworkRequestError extends NetworkRequestError {
  errorLogType = ErrorLogType.ServerError;
  errorName = ErrorName.GenericNetworkRequestError;
  displayMessage = (
    <FormattedMessage defaultMessage="A network error occurred." description="Generic message for a network error" />
  );

  constructor(details: NetworkRequestErrorDetails, cause?: CausableError) {
    const message = 'A network error occurred.';

    super(message, details, cause);
  }
}

export class GraphQLGenericError extends PredefinedError {
  errorLogType = ErrorLogType.ApplicationError;
  errorName = ErrorName.GraphQLGenericError;
  displayMessage = (
    <FormattedMessage
      defaultMessage="A GraphQL error occurred."
      description="Generic message for a GraphQL error, typically due to query parsing or validation issues"
    />
  );

  constructor(cause?: CausableError) {
    const message = 'A GraphQL error occurred.';

    super(message, cause);
  }
}

export class BadRequestError extends NetworkRequestError {
  errorLogType = ErrorLogType.UserInputError;
  errorName = ErrorName.BadRequestError;
  displayMessage = (
    <FormattedMessage
      defaultMessage="The request was invalid."
      description="Bad request (HTTP STATUS 400) generic error message"
    />
  );

  constructor(details: NetworkRequestErrorDetails, cause?: CausableError) {
    const message = 'The request was invalid.';

    super(message, details, cause);
  }
}

export class InternalServerError extends NetworkRequestError {
  errorLogType = ErrorLogType.ServerError;
  errorName = ErrorName.InternalServerError;
  displayMessage = (
    <FormattedMessage
      defaultMessage="Internal server error"
      description="Request failed due to internal server error (HTTP STATUS 500) generic error message"
    />
  );

  constructor(details: NetworkRequestErrorDetails, cause?: CausableError) {
    const message = 'Internal server error';

    super(message, details, cause);
  }
}

export class NotFoundError extends NetworkRequestError {
  errorLogType = ErrorLogType.UserInputError;
  errorName = ErrorName.NotFoundError;

  displayMessage = (
    <FormattedMessage
      defaultMessage="The requested resource was not found."
      description="Resource not found (HTTP STATUS 404) generic error message"
    />
  );

  isUserError = true;

  constructor(details: NetworkRequestErrorDetails, cause?: CausableError) {
    const message = 'The requested resource was not found.';

    super(message, details, cause);
  }
}

export class PermissionError extends NetworkRequestError {
  errorLogType = ErrorLogType.UnexpectedSystemStateError;
  errorName = ErrorName.PermissionError;
  displayMessage = (
    <FormattedMessage
      defaultMessage="You do not have permission to access this resource."
      description="Generic message for a permission error (HTTP STATUS 403)"
    />
  );
  isUserError = true;

  constructor(details: NetworkRequestErrorDetails, cause?: CausableError) {
    const message = 'You do not have permission to access this resource.';

    super(message, details, cause);
  }
}

export class RateLimitedError extends NetworkRequestError {
  errorLogType = ErrorLogType.ServerError;
  errorName = ErrorName.RateLimitedError;
  displayMessage = (
    <FormattedMessage
      defaultMessage="This request exceeds the maximum queries per second limit. Please wait and try again."
      description="Too many requests (HTTP STATUS 429) generic error message"
    />
  );

  constructor(details: NetworkRequestErrorDetails, cause?: CausableError) {
    const message = 'This request exceeds the maximum queries per second limit. Please wait and try again.';

    super(message, details, cause);
  }
}

export class ServiceUnavailableError extends NetworkRequestError {
  errorLogType = ErrorLogType.ServerError;
  errorName = ErrorName.InternalServerError;
  displayMessage = (
    <FormattedMessage
      defaultMessage="Service unavailable error"
      description="Request failed due to service being available (HTTP STATUS 503) generic error message"
    />
  );

  constructor(details: NetworkRequestErrorDetails, cause?: CausableError) {
    const message = 'Internal server error';

    super(message, details, cause);
  }
}

export class UnauthorizedError extends NetworkRequestError {
  errorLogType = ErrorLogType.SessionError;
  errorName = ErrorName.UnauthorizedError;
  displayMessage = (
    <FormattedMessage
      defaultMessage="User is not authorized."
      description="Unauthorized (HTTP STATUS 401) generic error message"
    />
  );

  constructor(details: NetworkRequestErrorDetails, cause?: CausableError) {
    const message = 'This request exceeds the maximum queries per second limit. Please wait and try again.';

    super(message, details, cause);
  }
}

export class UnknownError extends PredefinedError {
  errorLogType = ErrorLogType.UnknownError;
  errorName = ErrorName.UnknownError;
  displayMessage = (
    <FormattedMessage defaultMessage="An unknown error occurred." description="Generic message for an unknown error" />
  );

  constructor(cause?: CausableError) {
    const message = 'An unknown error occurred.';

    super(message, cause);
  }
}

export class FormValidationError extends PredefinedError {
  errorLogType = ErrorLogType.UserInputError;
  errorName = ErrorName.FormValidationError;
  isUserError = true;
  displayMessage = (
    <FormattedMessage
      defaultMessage="At least one form field has incorrect value. Please correct and try again."
      description="Generic error message for an invalid form input"
    />
  );

  constructor(cause?: CausableError) {
    const message = 'Incorrect form input.';

    super(message, cause);
  }
}

// have to be defined here to avoid circular dependencies
export class RouteNotFoundError extends PredefinedError {
  errorLogType = ErrorLogType.UserInputError;
  errorName = ErrorName.RouteNotFoundError;
  isUserError = true;
  displayMessage = (
    <FormattedMessage
      defaultMessage="Page not found"
      description="Error message shown to the user when they arrive at a non existent URL"
    />
  );
  constructor() {
    super('Page not found');
  }
}
```

--------------------------------------------------------------------------------

---[FILE: GenAIMarkdownRenderer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-markdown-renderer/GenAIMarkdownRenderer.test.tsx
Signals: React

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ReactMarkdown from 'react-markdown-10';
import remarkGfm from 'remark-gfm-4';

import { TableRow } from '@databricks/design-system';

import { GenAIMarkdownRenderer, getMarkdownComponents } from './GenAIMarkdownRenderer';
import { useParsedTableComponents, VirtualizedTableRow, VirtualizedTableCell } from './TableRenderer';
import type { ReactMarkdownProps } from './types';

const MARKDOWN_CONTENT = `
# Test content
Some sample test content to be rendered.
`;

describe('GenAIMarkdownRenderer', () => {
  it('renders the component', async () => {
    render(<GenAIMarkdownRenderer>{MARKDOWN_CONTENT}</GenAIMarkdownRenderer>);

    expect(screen.getByRole('heading', { name: 'Test content' })).toBeInTheDocument();
  });

  describe('getMarkdownComponents', () => {
    describe('Anchor', () => {
      it('renders anchor component', async () => {
        const Component = getMarkdownComponents({}).a;
        const screen = render(
          <Component node={{} as any} href="test">
            {['Test']}
          </Component>,
        );

        expect(screen.getByRole('link')).toHaveAttribute('href', 'test');
      });
      it('renders anchor that opens in new tab', async () => {
        const Component = getMarkdownComponents({}).a;
        const screen = render(
          <Component node={{} as any} href="https://www.test.com">
            {['Test']}
          </Component>,
        );

        expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
      });
      it('renders anchor that does not open in new tab for ID links', async () => {
        const Component = getMarkdownComponents({}).a;
        const screen = render(
          <Component node={{} as any} href="#foobar">
            {['Test']}
          </Component>,
        );

        expect(screen.getByRole('link')).not.toHaveAttribute('target', '_blank');
      });
      it('renders footnote links', async () => {
        const screen = render(
          <GenAIMarkdownRenderer>
            {`Here is a simple footnote[^1][^2][^3]. With some additional text after it.\n\n[^1]: My reference 1.\n\n[^2]: My reference 2.\n\n[^3]: My reference 3.`}
          </GenAIMarkdownRenderer>,
        );

        expect(screen.getByRole('link', { name: '[1]' })).toHaveAttribute('href', '#user-content-fn-1');
        expect(screen.getByRole('link', { name: '[1]' })).toHaveTextContent('[1]');
        expect(screen.container.querySelector('#user-content-fn-1')).toHaveTextContent('My reference 1.');

        expect(screen.getByRole('link', { name: '[2]' })).toHaveAttribute('href', '#user-content-fn-2');
        expect(screen.getByRole('link', { name: '[2]' })).toHaveTextContent('[2]');
        expect(screen.container.querySelector('#user-content-fn-2')).toHaveTextContent('My reference 2.');

        expect(screen.getByRole('link', { name: '[3]' })).toHaveAttribute('href', '#user-content-fn-3');
        expect(screen.getByRole('link', { name: '[3]' })).toHaveTextContent('[3]');
        expect(screen.container.querySelector('#user-content-fn-3')).toHaveTextContent('My reference 3.');
      });
    });
  });
});

describe('useParsedTableComponents', () => {
  // Helper: render some markdown, intercept <table> to invoke our hook, and resolve its return value.
  function testTableParsing(markdown: string): Promise<ReturnType<typeof useParsedTableComponents>> {
    return new Promise((resolve) => {
      function HookTester({ children }: ReactMarkdownProps<'table'>) {
        const result = useParsedTableComponents({ children });
        React.useEffect(() => {
          resolve(result);
        }, [result]);
        return null;
      }

      render(
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ table: HookTester }}>
          {markdown}
        </ReactMarkdown>,
      );
    });
  }

  it('parses a basic 3x2 table correctly', async () => {
    const markdown = `
| A | B | C |
|---|---|---|
| 1 | 2 | 3 |
| 4 | 5 | 6 |
`;
    const result = await testTableParsing(markdown);

    expect(result.isValid).toBe(true);

    // header should be defined (whatever the first child is)
    expect(result.header).toBeDefined();

    // rows should be exactly two <tr> elements
    expect(result.rows.length).toBe(2);
    result.rows.forEach((rowEl) => {
      expect(rowEl.type).toBe('tr');
    });

    // Spot-check: first cell of header is "A"
    const headerElement = result.header as React.ReactElement;
    const headerRow = React.Children.toArray(headerElement.props.children).find(
      (el) => React.isValidElement(el) && el.type === 'tr',
    ) as React.ReactElement;
    const firstHeaderCell = React.Children.toArray(headerRow.props.children)[0] as React.ReactElement;
    expect(firstHeaderCell.props.children).toStrictEqual('A');

    // Spot-check: first body row's first cell is "1"
    const firstBodyRow = result.rows[0];
    const firstBodyCell = React.Children.toArray(firstBodyRow.props.children)[0] as React.ReactElement;
    expect(firstBodyCell.props.children).toStrictEqual('1');
  });

  it('parses a single-row table correctly', async () => {
    const markdown = `
| X | Y | Z |
|---|---|---|
| only | one | row |
`;
    const result = await testTableParsing(markdown);

    expect(result.isValid).toBe(true);
    expect(result.header).toBeDefined();
    expect(result.rows.length).toBe(1);

    const headerRow = React.Children.toArray((result.header as React.ReactElement).props.children).find(
      (el) => React.isValidElement(el) && el.type === 'tr',
    ) as React.ReactElement;
    const headerTexts = React.Children.toArray(headerRow.props.children).map(
      (cell: any) => (cell as React.ReactElement).props.children,
    );
    expect(headerTexts).toStrictEqual(['X', 'Y', 'Z']);

    // Check the single body row's texts: ['only','one','row']
    const bodyRow = result.rows[0];
    const bodyTexts = React.Children.toArray(bodyRow.props.children).map(
      (cell: any) => (cell as React.ReactElement).props.children,
    );
    expect(bodyTexts).toStrictEqual(['only', 'one', 'row']);
  });

  it('enforces header count equal to row count', async () => {
    const markdown = `
| Col1 | Col2 |
|------|------|
| c    | d    | e |
`;
    const result = await testTableParsing(markdown);

    expect(result.isValid).toBe(true);
    expect(result.header).toBeDefined();

    // Exactly two <tr> rows
    expect(result.rows.length).toBe(1);

    // First body row has 2 cells
    const firstRowCellCount = React.Children.toArray(result.rows[0].props.children).filter((c) =>
      React.isValidElement(c),
    ).length;
    expect(firstRowCellCount).toBe(2);
  });

  it('parses a header-only table (no body rows)', async () => {
    const markdown = `
  | H1 | H2 |
  |----|----|
  `;
    const result = await testTableParsing(markdown);

    expect(result.isValid).toBe(true);
    expect(result.header).toBeDefined();

    // Since there are no body rows, rows.length should be 0
    expect(result.rows.length).toBe(0);

    // Check that header cells are still parsed correctly
    const headerRow = React.Children.toArray((result.header as React.ReactElement).props.children).find(
      (el) => React.isValidElement(el) && el.type === 'tr',
    ) as React.ReactElement;

    const headerTexts = React.Children.toArray(headerRow.props.children).map(
      (cell: any) => (cell as React.ReactElement).props.children,
    );
    expect(headerTexts).toStrictEqual(['H1', 'H2']);
  });

  it('allows inline Markdown (bold, links) inside table cells', async () => {
    const markdown = `
  | Bold       | Link                  | Image                       |
  |------------|-----------------------|-----------------------------|
  | **strong** | [click me](https://)  | ![alt](https://via.placeholder.com/20) |
  | normal     | [here](https://openai.com) | ![icon](https://via.placeholder.com/20) |
  `;
    const result = await testTableParsing(markdown);

    expect(result.isValid).toBe(true);
    expect(result.rows.length).toBe(2);

    // First body row, first cell contains a <strong> element with text "strong"
    const firstBodyRow = result.rows[0];
    const firstBodyCells = React.Children.toArray(firstBodyRow.props.children).filter((c) => React.isValidElement(c));

    // The <td> for "**strong**" should have a <strong> child
    const strongEl = (firstBodyCells[0] as React.ReactElement).props.children;
    expect(strongEl).toBeDefined();
    expect(strongEl.type).toBe('strong');
    expect(strongEl.props.children).toStrictEqual('strong');

    // The link cell should include an <a> element with href
    const linkEl = (firstBodyCells[1] as React.ReactElement).props.children;
    expect(linkEl.props.href).toBe('https://');

    // The image cell should include an <img> element with correct src and alt
    const imgEl = (firstBodyCells[2] as React.ReactElement).props.children;
    expect(imgEl.props.src).toMatch(/via\.placeholder\.com\/20/);
    expect(imgEl.props.alt).toBe('alt');
  });
});

describe('TableRenderer', () => {
  it('renders table with 3 columns and 3 rows', async () => {
    const markdown = `
  | H1 | H2 | H3 |
  |----|----|----|
  | 1  | 2  | 3  |
  | 4  | 5  | 6  |
  | 7  | 8  | 9  |
  
  `;

    const screen = render(<GenAIMarkdownRenderer>{markdown}</GenAIMarkdownRenderer>);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('virtualized-table')).toBeInTheDocument();

    // Expect 4 rows
    expect(screen.getAllByRole('row').length).toBe(4);

    // Expect 3 columns
    expect(screen.getAllByRole('columnheader').length).toBe(3);
  });

  it('uses virtualization when the table is large', async () => {
    const markdown = `
  | H1 |
  |----|
  | 1  |
  | 2  |
  | 3  |
  | 4  |
  | 5  |
  | 6  |
  | 7  |
  | 8  |
  | 9  |
  | 10 |
  | 11 |
  | 12 |
  | 13 |
  | 14 |
  | 15 |
  | 16 |
  | 17 |
  | 18 |
  | 19 |
  | 20 |
  | 21 |
  | 22 |
  | 23 |
  | 24 |
  | 25 |
  | 26 |
  | 27 |
  | 28 |
  | 29 |
  | 30 |
  | 31 |
  | 32 |
  | 33 |
  | 34 |
  | 35 |
  | 36 |
  | 37 |
  | 38 |
  | 39 |
  | 40 |
  | 41 |
  | 42 |
  | 43 |
  | 44 |
  | 45 |
  `;

    const screen = render(<GenAIMarkdownRenderer>{markdown}</GenAIMarkdownRenderer>);

    // Verify virtualized table is being used
    expect(screen.getByTestId('virtualized-table')).toBeInTheDocument();

    const visibleRows = screen.getAllByRole('row');

    expect(visibleRows[0]).toHaveTextContent('H1');

    // With virtualization enabled, we should render less than 30 rows
    expect(visibleRows.length).toBeLessThan(45);
  });
});

describe('VirtualizedTableRow', () => {
  it('renders a regular table row', () => {
    const mockNode = {
      children: [{ tagName: 'td' }],
    };
    const screen = render(<VirtualizedTableRow node={mockNode as any}>{['Cell content']}</VirtualizedTableRow>);

    expect(screen.getByRole('row')).toBeInTheDocument();
    expect(screen.getByText('Cell content')).toBeInTheDocument();
  });

  it('renders a header row with sticky positioning', () => {
    const mockNode = {
      children: [{ tagName: 'th' }],
    };
    const screen = render(<VirtualizedTableRow node={mockNode as any}>{['Header content']}</VirtualizedTableRow>);

    const row = screen.getByRole('row');
    expect(row).toBeInTheDocument();
    expect(row).toHaveStyle({ position: 'sticky', top: '0', zIndex: '1' });
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });
});

describe('VirtualizedTableCell', () => {
  it('renders a regular table cell', () => {
    const mockNode = {
      tagName: 'td',
    };
    const screen = render(<VirtualizedTableCell node={mockNode as any}>{['Cell content']}</VirtualizedTableCell>);

    expect(screen.getByRole('cell')).toBeInTheDocument();
    expect(screen.getByText('Cell content')).toBeInTheDocument();
  });

  it('renders a table header cell when node is th', () => {
    const mockNode = {
      tagName: 'th',
    };

    const screen = render(
      <TableRow isHeader>
        <VirtualizedTableCell node={mockNode as any}>{['Header content']}</VirtualizedTableCell>
      </TableRow>,
    );

    expect(screen.getByRole('columnheader')).toBeInTheDocument();
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: GenAIMarkdownRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-markdown-renderer/GenAIMarkdownRenderer.tsx
Signals: React

```typescript
import React, { type ComponentType, useMemo } from 'react';
import type { Components, Options, UrlTransform } from 'react-markdown-10';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown-10';
import remarkGfm from 'remark-gfm-4';

import { TableCell, Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { CodeSnippetLanguage } from '@databricks/web-shared/snippet';
import { CodeSnippet, SnippetCopyAction } from '@databricks/web-shared/snippet';
import { TableRenderer, VirtualizedTableCell, VirtualizedTableRow } from './TableRenderer';
import type { ReactMarkdownComponent, ReactMarkdownComponents, ReactMarkdownProps } from './types';

/**
 * NOTE: react-markdown sanitizes urls by default, including `data:` urls, with the `urlTransform` prop, documented here: https://github.com/remarkjs/react-markdown?tab=readme-ov-file#defaulturltransformurl
 * It uses `micromark-util-sanitize-uri` package under the hood to escape urls and prevent injection: https://github.com/micromark/micromark/tree/main/packages/micromark-util-sanitize-uri#readme
 * We can allow jpeg and png data urls, and use the default transformer for everything else.
 */
const urlTransform: UrlTransform = (value) => {
  if (value.startsWith('data:image/png') || value.startsWith('data:image/jpeg')) {
    return value;
  }
  return defaultUrlTransform(value);
};

export const GenAIMarkdownRenderer = (props: { children: string; components?: ExtendedComponents }) => {
  const components: Components = useMemo(
    () => getMarkdownComponents({ extensions: props.components }),
    [props.components],
  );
  return (
    <ReactMarkdown components={components} remarkPlugins={RemarkPlugins} urlTransform={urlTransform}>
      {props.children}
    </ReactMarkdown>
  );
};

const CodeMarkdownComponent = ({
  codeBlock,
  codeInline,
  node,
  ...codeProps
}: Required<ExtededCodeRenderers> & ReactMarkdownProps<'code'>) => {
  const language = React.useMemo(() => {
    const match = /language-(\w+)/.exec(codeProps.className ?? '');
    return match && match[1] ? match[1] : undefined;
  }, [codeProps.className]);

  if (node?.position?.start.line === node?.position?.end.line) {
    return React.createElement(codeInline, codeProps);
  }

  return React.createElement(codeBlock, { ...codeProps, language });
};

const InlineCode = ({ children }: ReactMarkdownProps<'code'>) => <Typography.Text code>{children}</Typography.Text>;

/**
 * Since this component is quite expensive to render we memoize it so if multiple
 * code blocks are being rendered, we only update the code blocks with changing props
 */
const CodeBlock = React.memo(({ children, language }: ReactMarkdownProps<'code'> & { language?: string }) => {
  const { theme } = useDesignSystemTheme();
  const code = String(children).replace(/\n$/, '');
  return (
    <div css={{ position: 'relative' }}>
      <CodeSnippet
        actions={<SnippetCopyAction componentId="genai.util.markdown-copy-code-block" copyText={code} />}
        theme={theme.isDarkMode ? 'duotoneDark' : 'light'}
        children={code}
        language={language && isCodeSnippetLanguage(language) ? language : 'text'}
        style={{
          padding: '8px 0',
          borderRadius: 8,
          width: '100%',
          boxSizing: 'border-box',
          // Setting a reasonable max height to avoid long code blocks taking up the entire screen.
          // Component handles scrolling inside it gracefully
          maxHeight: 640,
          // Using column-reverse flex layout so the scroll position will stick to the bottom
          // as new content is streamed in.
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
        showLineNumbers
      />
    </div>
  );
});

const RemarkPlugins: Options['remarkPlugins'] = [remarkGfm];

// react-markdown handles both inline and block code rendering in the same component
// however, we want to render them differently so we need to split them into two components.
// This also allows callees to override the default renderers separately
type ExtededCodeRenderers = {
  codeInline?: ReactMarkdownComponent<'code'>;
  codeBlock?: ComponentType<React.PropsWithChildren<Omit<ReactMarkdownProps<'code'>, 'ref'> & { language?: string }>>;
};

type ExtendedComponents = Omit<ReactMarkdownComponents, 'code'> & ExtededCodeRenderers;

export const getMarkdownComponents = (props: { extensions?: ExtendedComponents }) =>
  ({
    a: ({ href, children }) => (
      <Typography.Link
        componentId="codegen_webapp_js_genai_util_markdown.tsx_71"
        href={href}
        // If the link is to the footnote (starts with #user-content-fn), set id so footnote can link back to it
        id={
          href?.startsWith('#user-content-fn-') ? href.replace('#user-content-fn-', 'user-content-fnref-') : undefined
        }
        disabled={href?.startsWith('.')}
        // If the link is to the footnote, add brackets around the children to make it appear as a footnote reference
        children={href?.startsWith('#user-content-fn-') ? <>[{children}]</> : children}
        // If the link is an id link, don't open in new tab
        openInNewTab={!(href && href.startsWith('#'))}
      />
    ),
    code: (codeProps) => (
      <CodeMarkdownComponent
        {...codeProps}
        codeBlock={props.extensions?.codeBlock ?? CodeBlock} // Optionally override the default code block renderer
        codeInline={props.extensions?.codeInline ?? InlineCode} // Optionally override the default inline code renderer
      />
    ),
    p: ({ children }) => <Typography.Paragraph children={children} />,
    h1: ({ children }) => <Typography.Title level={1} children={children} />,
    h2: ({ children }) => <Typography.Title level={2} children={children} />,
    h3: ({ children }) => <Typography.Title level={3} children={children} />,
    h4: ({ children }) => <Typography.Title level={4} children={children} />,
    h5: ({ children }) => <Typography.Title level={5} children={children} />,
    table: ({ children, node }) => <TableRenderer children={children} node={node} />,
    tr: ({ children, node }) => <VirtualizedTableRow children={children} node={node} />,
    th: ({ children, node }) => <VirtualizedTableCell children={children} node={node} />,
    // Without the multiline prop, the table cell will add ellipsis to the text effictively hiding the content
    // for long text. This is not the desired behavior for markdown tables.
    td: ({ children }) => <TableCell children={children} multiline />,
    // Design system's table does not use thead and tbody elements
    thead: ({ children }) => <>{children}</>,
    tbody: ({ children }) => <>{children}</>,
    img: ({ src, alt }) => <img src={src} alt={alt} css={{ maxWidth: '100%' }} />,
  } satisfies ReactMarkdownComponents);

const isCodeSnippetLanguage = (languageString: string): languageString is CodeSnippetLanguage => {
  // Casting the string to string literal so we can exhaust the union
  const typeCast = languageString as CodeSnippetLanguage;
  switch (typeCast) {
    case 'go':
    case 'java':
    case 'javascript':
    case 'json':
    case 'python':
    case 'sql':
    case 'text':
    case 'yaml':
      return true;
    default:
      return false;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-markdown-renderer/index.ts

```typescript
export * from './GenAIMarkdownRenderer';
```

--------------------------------------------------------------------------------

---[FILE: TableRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-markdown-renderer/TableRenderer.tsx
Signals: React

```typescript
import React from 'react';
import { useVirtual } from 'react-virtual';

import { Table, TableCell, TableHeader, TableRow, useDesignSystemTheme } from '@databricks/design-system';

import type { ReactMarkdownProps } from './types';

export function useParsedTableComponents({ children }: ReactMarkdownProps<'table'>): {
  header: React.ReactNode | undefined;
  rows: React.ReactElement[];
  isValid: boolean;
} {
  if (!children) {
    return {
      header: undefined,
      rows: [],
      isValid: false,
    };
  }

  const childArray = React.Children.toArray(children);

  const header = childArray[0] ?? undefined;

  // Parse rows, expect all children after the header to be tbody element containing the rows
  const rows: React.ReactElement[] = childArray.slice(1).flatMap((child) => {
    if (React.isValidElement(child)) {
      return React.Children.toArray(child.props.children).filter((c): c is React.ReactElement =>
        React.isValidElement(c),
      );
    }
    return [];
  });

  return {
    header,
    rows,
    isValid: true,
  };
}

const BasicTable = ({ children }: ReactMarkdownProps<'table'>) => {
  return (
    // Tables with many columns were not scrollable but instead become squished rendering the content unreadable
    // Fixed by wrapping the table in a div with overflow auto and setting the table to display inline-flex
    <div data-testid="basic-table" css={{ overflow: 'auto' }}>
      {/* Table has a "height: 100%" style that causes layout issues in some cases */}
      <Table
        scrollable
        css={{
          height: 'auto',
          minHeight: 'initial',
          display: 'inline-flex',
          // Tables in tool call responses were not taking up the full width of the container
          minWidth: '100%',
          zIndex: 0, // Ensure the raised header doesn't cover elements outside the table
        }}
        children={children}
      />
    </div>
  );
};

export const TableRenderer = ({ children, node }: ReactMarkdownProps<'table'>) => {
  const { header, rows, isValid } = useParsedTableComponents({ children, node });

  if (!isValid) {
    // If for some reason the table is not valid, fall back to the basic table
    return <BasicTable children={children} node={node} />;
  }

  return <VirtualizedTable header={header} rows={rows} />;
};

const MAX_TABLE_HEIGHT = 420;

const OVERSCAN = 20;

const VirtualizedTable = ({ header, rows }: { header: React.ReactNode; rows: React.ReactNode[] }) => {
  const { theme } = useDesignSystemTheme();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: rows.length,
    parentRef,
    overscan: OVERSCAN,
  });

  const { virtualItems, totalSize } = rowVirtualizer;

  return (
    <div
      data-testid="virtualized-table"
      ref={parentRef}
      css={{
        overflow: 'auto',
        maxHeight: MAX_TABLE_HEIGHT,
        border: '1px solid',
        borderColor: theme.colors.border,
        borderRadius: theme.borders.borderRadiusMd,
        marginBottom: theme.spacing.md,
        zIndex: 0, // Ensure the raised header doesn't cover elements outside the table
      }}
    >
      <Table
        css={{
          height: 'auto',
          minHeight: 'initial',
          display: 'inline-flex',
          minWidth: '100%',
        }}
      >
        {header}
        <div
          css={{
            position: 'relative',
            height: `${totalSize}px`,
            width: '100%',
            // Remove bottom border from the last row
            '& > div:last-child [role="cell"]': { borderBottom: 'none' },
          }}
        >
          {virtualItems.map((virtualRow) => {
            const rowIndex = virtualRow.index;
            const rowElement = rows[rowIndex];

            return (
              <div
                ref={virtualRow.measureRef}
                key={rowIndex}
                css={{
                  position: 'absolute',
                  top: `${virtualRow.start}px`,
                  width: '100%',
                }}
              >
                {rowElement}
              </div>
            );
          })}
        </div>
      </Table>
    </div>
  );
};

export const VirtualizedTableRow = ({ children, node }: ReactMarkdownProps<'tr'>) => {
  // @ts-expect-error Property 'tagName' does not exist on type 'ElementContent
  const isHeader = node?.children.some((child) => child.tagName === 'th');
  const { theme } = useDesignSystemTheme();
  return (
    <TableRow
      style={
        isHeader
          ? { position: 'sticky', top: 0, zIndex: 1, backgroundColor: theme.colors.backgroundPrimary }
          : undefined
      }
      children={children}
      isHeader={isHeader}
    />
  );
};

export const VirtualizedTableCell = ({ children, node }: ReactMarkdownProps<'td' | 'th'>) => {
  const isHeader = node?.tagName === 'th';
  const { theme } = useDesignSystemTheme();

  if (isHeader) {
    return (
      <TableHeader
        data-testid="virtualized-table-header"
        componentId="virtualized-table-header"
        css={{ paddingLeft: theme.spacing.sm, borderColor: theme.colors.border, color: theme.colors.textPrimary }}
        children={children}
      />
    );
  }

  return <TableCell children={children} />;
};
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-markdown-renderer/types.ts
Signals: React

```typescript
import type { ComponentProps, ComponentType } from 'react';
import type { ExtraProps } from 'react-markdown-10';

/**
 * The exported type for Components in react-markdown-10 provides "any" as the type for the props passed to components,
 * and also doesn't doesn't have type safety for the tag names.
 * This type is a workaround to provide type safety for the tag names and the props passed to components.
 */
export type ReactMarkdownComponents = {
  [K in keyof JSX.IntrinsicElements]?: ReactMarkdownComponent<K>;
};

export type ReactMarkdownComponent<T extends keyof JSX.IntrinsicElements> = ComponentType<
  React.PropsWithChildren<ReactMarkdownProps<T>>
>;

export type ReactMarkdownProps<T extends keyof JSX.IntrinsicElements> = ComponentProps<T> & ExtraProps;
```

--------------------------------------------------------------------------------

---[FILE: enum.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/enum.ts

```typescript
export enum GenAiTraceEvaluationArtifactFile {
  Evaluations = '_evaluations.json',
  Assessments = '_assessments.json',
  Metrics = '_metrics.json',
}

export enum KnownEvaluationResultAssessmentMetadataFields {
  IS_OVERALL_ASSESSMENT = 'is_overall_assessment',
  CHUNK_INDEX = 'chunk_index',
  IS_COPIED_FROM_AI = 'is_copied_from_ai',
}

export enum KnownEvaluationResultAssessmentName {
  OVERALL_ASSESSMENT = 'overall_assessment',
  SAFETY = 'safety',
  GROUNDEDNESS = 'groundedness',
  CORRECTNESS = 'correctness',
  RELEVANCE_TO_QUERY = 'relevance_to_query',
  CHUNK_RELEVANCE = 'chunk_relevance',
  CONTEXT_SUFFICIENCY = 'context_sufficiency',
  GUIDELINE_ADHERENCE = 'guideline_adherence',
  GLOBAL_GUIDELINE_ADHERENCE = 'global_guideline_adherence',
  TOTAL_TOKEN_COUNT = 'agent/total_token_count',
  TOTAL_INPUT_TOKEN_COUNT = 'agent/total_input_token_count',
  TOTAL_OUTPUT_TOKEN_COUNT = 'agent/total_output_token_count',
  DOCUMENT_RECALL = 'retrieval/ground_truth/document_recall',
  DOCUMENT_RATINGS = 'retrieval/ground_truth/document_ratings',
}
```

--------------------------------------------------------------------------------

````

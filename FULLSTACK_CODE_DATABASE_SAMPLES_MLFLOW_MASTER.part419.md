---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 419
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 419 of 991)

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

---[FILE: route-defs.ts]---
Location: mlflow-master/mlflow/server/js/src/common/route-defs.ts

```typescript
import PageNotFoundView from './components/PageNotFoundView';
import { createMLflowRoutePath, createRouteElement } from './utils/RoutingUtils';

/**
 * Common route definitions. For the time being it's 404 page only.
 */
export const getRouteDefs = () => [
  {
    path: createMLflowRoutePath('/*'),
    element: createRouteElement(PageNotFoundView),
    pageId: 'mlflow.common.not-found',
  },
];
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/common/types.ts

```typescript
export type AliasMap = { alias: string; version: string }[];

/**
 * Simple key/value
 */
export interface KeyValueEntity {
  key: string;
  value: string;
}
```

--------------------------------------------------------------------------------

---[FILE: AliasSelect.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/AliasSelect.tsx
Signals: React

```typescript
import type { Dispatch } from 'react';
import { useCallback, useState } from 'react';

import { LegacySelect, useDesignSystemTheme } from '@databricks/design-system';

import { AliasTag } from './AliasTag';
import { FormattedMessage, useIntl } from 'react-intl';

/**
 * A specialized <LegacySelect> component used for adding and removing aliases from model versions
 */
export const AliasSelect = ({
  renderKey,
  setDraftAliases,
  existingAliases,
  draftAliases,
  version,
  aliasToVersionMap,
  disabled,
}: {
  renderKey: any;
  disabled: boolean;
  setDraftAliases: Dispatch<React.SetStateAction<string[]>>;
  existingAliases: string[];
  draftAliases: string[];
  version: string;
  aliasToVersionMap: Record<string, string>;
}) => {
  const intl = useIntl();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { theme } = useDesignSystemTheme();

  const removeFromEditedAliases = useCallback(
    (alias: string) => {
      setDraftAliases((aliases) => aliases.filter((existingAlias) => existingAlias !== alias));
    },
    [setDraftAliases],
  );

  const updateEditedAliases = useCallback(
    (aliases: string[]) => {
      const sanitizedAliases = aliases
        // Remove all characters that are not alphanumeric, underscores or hyphens
        .map((alias) =>
          alias
            .replace(/[^\w-]/g, '')
            .toLowerCase()
            .substring(0, 255),
        )
        // After sanitization, filter out invalid aliases
        // so we won't get empty values
        .filter((alias) => alias.length > 0);

      // Remove duplicates that might result from varying letter case
      const uniqueAliases = Array.from(new Set(sanitizedAliases));
      setDraftAliases(uniqueAliases);
      setDropdownVisible(false);
    },
    [setDraftAliases],
  );

  return (
    // For the time being, we will use <LegacySelect /> under the hood,
    // while <TypeaheadCombobox /> is still in the design phase.
    <LegacySelect
      disabled={disabled}
      filterOption={(val, opt) => opt?.value.toLowerCase().startsWith(val.toLowerCase())}
      placeholder={intl.formatMessage({
        defaultMessage: 'Enter aliases (champion, challenger, etc)',
        description: 'Model registry > model version alias select > Alias input placeholder',
      })}
      allowClear
      css={{ width: '100%' }}
      mode="tags"
      // There's a bug with current <LegacySelect /> implementation that causes the dropdown
      // to detach from input vertically when its position on screen changes (in this case, it's
      // caused by the conflict alerts). A small key={} hack ensures that the component is recreated
      // and the dropdown is repositioned each time the alerts below are changed.
      key={JSON.stringify(renderKey)}
      onChange={updateEditedAliases}
      dangerouslySetAntdProps={{
        dropdownMatchSelectWidth: true,
        tagRender: ({ value }) => (
          <AliasTag
            compact
            css={{ marginTop: 2 }}
            closable
            onClose={() => removeFromEditedAliases(value.toString())}
            value={value.toString()}
          />
        ),
      }}
      onDropdownVisibleChange={setDropdownVisible}
      open={dropdownVisible}
      value={draftAliases || []}
    >
      {existingAliases.map((alias) => (
        <LegacySelect.Option key={alias} value={alias} data-testid="model-alias-option">
          <div key={alias} css={{ display: 'flex', marginRight: theme.spacing.xs }}>
            <div css={{ flex: 1 }}>{alias}</div>
            <div>
              <FormattedMessage
                defaultMessage="This version"
                description="Model registry > model version alias select > Indicator for alias of selected version"
              />
            </div>
          </div>
        </LegacySelect.Option>
      ))}
      {Object.entries(aliasToVersionMap)
        .filter(([, otherVersion]) => otherVersion !== version)
        .map(([alias, aliasedVersion]) => (
          <LegacySelect.Option key={alias} value={alias} data-testid="model-alias-option">
            <div key={alias} css={{ display: 'flex', marginRight: theme.spacing.xs }}>
              <div css={{ flex: 1 }}>{alias}</div>
              <div>
                <FormattedMessage
                  defaultMessage="Version {version}"
                  description="Model registry > model version alias select > Indicator for alias of a particular version"
                  values={{ version: aliasedVersion }}
                />
              </div>
            </div>
          </LegacySelect.Option>
        ))}
    </LegacySelect>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AliasTag.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/AliasTag.tsx

```typescript
import { Tag, useDesignSystemTheme } from '@databricks/design-system';
import type { TagProps } from '@databricks/design-system';

type ModelVersionAliasTagProps = { value: string; compact?: boolean } & Pick<
  TagProps,
  'closable' | 'onClose' | 'className'
>;

// When displayed in compact mode (e.g. within <Select>), constrain the width to 160 pixels
const COMPACT_MODE_MAX_WIDTH = 160;
const REGULAR_MAX_WIDTH = 300;
const TAG_SYMBOL = '@';

export const AliasTag = ({ value, closable, onClose, className, compact = false }: ModelVersionAliasTagProps) => {
  const { theme } = useDesignSystemTheme();
  return (
    <Tag
      componentId="codegen_mlflow_app_src_model-registry_components_aliases_modelversionaliastag.tsx_23"
      css={{
        fontWeight: theme.typography.typographyBoldFontWeight,
        marginRight: theme.spacing.xs,
      }}
      className={className}
      closable={closable}
      onClose={onClose}
      title={value}
    >
      <span
        css={{
          display: 'block',
          whiteSpace: 'nowrap',
          maxWidth: compact ? COMPACT_MODE_MAX_WIDTH : REGULAR_MAX_WIDTH,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {TAG_SYMBOL}&nbsp;{value}
      </span>
    </Tag>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: CollapsibleContainer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/CollapsibleContainer.test.tsx
Signals: React

```typescript
import { it, describe, jest, expect } from '@jest/globals';
import React from 'react';

import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';

import { CollapsibleContainer } from './CollapsibleContainer';

// Mock ResizeObserver
const mockResizeObserver: any = jest.fn();
mockResizeObserver.mockImplementation((callback: any) => ({
  observe: jest.fn(() => callback([{ target: {} }])),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.ResizeObserver = mockResizeObserver;

describe('CollapsibleContainer', () => {
  it('renders children correctly', () => {
    const setIsExpanded = jest.fn();
    renderWithIntl(
      <CollapsibleContainer isExpanded={false} setIsExpanded={setIsExpanded}>
        <div>Test content</div>
      </CollapsibleContainer>,
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders container with proper structure', () => {
    const setIsExpanded = jest.fn();
    renderWithIntl(
      <CollapsibleContainer isExpanded={false} setIsExpanded={setIsExpanded} maxHeight={100}>
        <div>Test content</div>
      </CollapsibleContainer>,
    );
    const container = screen.getByText('Test content').parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toContainHTML('<div>Test content</div>');
  });

  it('shows gradient when collapsed and content is taller than maxHeight', () => {
    const setIsExpanded = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 200 });

    renderWithIntl(
      <CollapsibleContainer isExpanded={false} setIsExpanded={setIsExpanded} maxHeight={100}>
        <div>Test content</div>
      </CollapsibleContainer>,
    );

    expect(screen.getByTestId('truncation-gradient')).toBeInTheDocument();
  });

  it('does not show gradient when expanded', () => {
    const setIsExpanded = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 200 });

    renderWithIntl(
      <CollapsibleContainer isExpanded setIsExpanded={setIsExpanded} maxHeight={100}>
        <div>Test content</div>
      </CollapsibleContainer>,
    );

    expect(screen.queryByTestId('truncation-gradient')).not.toBeInTheDocument();
  });

  it('shows "Show more" button when content is collapsible', () => {
    const setIsExpanded = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 200 });

    renderWithIntl(
      <CollapsibleContainer isExpanded={false} setIsExpanded={setIsExpanded} maxHeight={100}>
        <div>Test content</div>
      </CollapsibleContainer>,
    );

    expect(screen.getByText('Show more')).toBeInTheDocument();
  });

  it('shows "Show less" button when expanded', () => {
    const setIsExpanded = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 200 });

    renderWithIntl(
      <CollapsibleContainer isExpanded setIsExpanded={setIsExpanded} maxHeight={100}>
        <div>Test content</div>
      </CollapsibleContainer>,
    );

    expect(screen.getByText('Show less')).toBeInTheDocument();
  });

  it('calls setIsExpanded with a function when toggle button is clicked', async () => {
    const setIsExpanded: any = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 200 });

    renderWithIntl(
      <CollapsibleContainer isExpanded={false} setIsExpanded={setIsExpanded} maxHeight={100}>
        <div>Test content</div>
      </CollapsibleContainer>,
    );

    await userEvent.click(screen.getByText('Show more'));
    expect(setIsExpanded).toHaveBeenCalledTimes(1);
    expect(setIsExpanded).toHaveBeenCalledWith(expect.any(Function));

    // Call the function passed to setIsExpanded and check its result
    const updateFunction = setIsExpanded.mock.calls[0][0];
    expect(updateFunction(false)).toBe(true);
    expect(updateFunction(true)).toBe(false);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CollapsibleContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/CollapsibleContainer.tsx
Signals: React

```typescript
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import { Button, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import { toRGBA } from '../utils/toRGBA';

interface CollapsibleContainerProps {
  children: ReactNode;
  maxHeight?: number;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export const CollapsibleContainer = ({
  children,
  maxHeight = 150,
  setIsExpanded,
  isExpanded,
}: CollapsibleContainerProps) => {
  const { theme } = useDesignSystemTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const intl = useIntl();

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const checkCollapsible = () => {
      if (containerRef.current) {
        const currentHeight = containerRef.current.scrollHeight;
        const shouldBeCollapsible = currentHeight > maxHeight;
        setIsCollapsible(shouldBeCollapsible);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      checkCollapsible();
    });

    resizeObserver.observe(containerRef.current);
    checkCollapsible();

    return () => {
      resizeObserver.disconnect();
    };
  }, [maxHeight, setIsExpanded]);

  const containerStyles = {
    maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
    overflow: isExpanded ? 'visible' : 'hidden',
    position: 'relative' as const,
    width: '100%',
  };

  return (
    <div>
      <div css={containerStyles} ref={containerRef}>
        {children}
        {!isExpanded && isCollapsible && (
          <div
            data-testid="truncation-gradient"
            css={{
              position: 'absolute',
              bottom: 0,
              height: '60%',
              width: '100%',
              background: `linear-gradient(to bottom, ${toRGBA(theme.colors.backgroundPrimary, 0)}, ${toRGBA(
                theme.colors.backgroundPrimary,
                1,
              )})`,
            }}
          />
        )}
      </div>
      {isCollapsible && (
        <Button
          type="link"
          componentId="discovery.data_explorer.entity_comment.show_comment_text_toggle"
          data-testid="show-comment-toggle"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={
            isExpanded
              ? intl.formatMessage({
                  defaultMessage: 'Collapse description',
                  description: 'Aria label for button that collapses a long description',
                })
              : intl.formatMessage({
                  defaultMessage: 'Expand description',
                  description: 'Aria label for button that expands a collapsed long description',
                })
          }
          style={{ marginTop: theme.spacing.xs }}
        >
          {isExpanded ? (
            <FormattedMessage
              defaultMessage="Show less"
              description="Button text to show less description text for the entity"
            />
          ) : (
            <FormattedMessage
              defaultMessage="Show more"
              description="Button text to show more description text for the entity"
            />
          )}
        </Button>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: CollapsibleSection.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/CollapsibleSection.test.tsx
Signals: React

```typescript
import { describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import userEvent from '@testing-library/user-event';

import { CollapsibleSection } from './CollapsibleSection';
import { renderWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

describe('CollapsibleSection', () => {
  let wrapper;
  let minimalProps: {
    title: string | any;
    children: React.ReactNode;
    forceOpen?: boolean;
  };

  beforeEach(() => {
    minimalProps = {
      title: 'testTitle',
      children: 'testChild',
    };
  });

  test('should render in initial collapsed state', () => {
    wrapper = renderWithIntl(<CollapsibleSection {...minimalProps} defaultCollapsed />);
    expect(wrapper.getByRole('button')).toHaveTextContent('testTitle');
    expect(wrapper.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper.container).not.toHaveTextContent('testChild');
  });

  test('should render in initial expanded state', () => {
    wrapper = renderWithIntl(<CollapsibleSection {...minimalProps} />);
    expect(wrapper.container).toHaveTextContent('testChild');
  });

  test('should expand when clicked', async () => {
    wrapper = renderWithIntl(<CollapsibleSection {...minimalProps} defaultCollapsed />);
    expect(wrapper.container).not.toHaveTextContent('testChild');
    expect(wrapper.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(wrapper.getByRole('button'));
    expect(wrapper.container).toHaveTextContent('testChild');
    expect(wrapper.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CollapsibleSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/CollapsibleSection.tsx
Signals: React

```typescript
import React, { useCallback } from 'react';
import { SectionErrorBoundary } from './error-boundaries/SectionErrorBoundary';
import type { DesignSystemThemeInterface } from '@databricks/design-system';
import { ChevronRightIcon, useDesignSystemTheme, Accordion, importantify } from '@databricks/design-system';
import { useIntl } from 'react-intl';

interface CollapsibleSectionProps {
  title: string | any;
  forceOpen?: boolean;
  children: React.ReactNode;
  showServerError?: boolean;
  defaultCollapsed?: boolean;
  onChange?: (key: string | string[]) => void;
  className?: string;
  componentId?: string;
}

// Custom styles to make <Accordion> look like previously used <Collapse> from antd
const getAccordionStyles = ({
  theme,
  getPrefixedClassName,
}: Pick<DesignSystemThemeInterface, 'theme' | 'getPrefixedClassName'>) => {
  const clsPrefix = getPrefixedClassName('collapse');

  const classItem = `.${clsPrefix}-item`;
  const classHeader = `.${clsPrefix}-header`;
  const classContentBox = `.${clsPrefix}-content-box`;

  return {
    fontSize: 14,
    [`& > ${classItem} > ${classHeader}`]: {
      paddingLeft: 0,
      paddingTop: 12,
      paddingBottom: 12,
      display: 'flex',
      alignItems: 'center',
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: theme.typography.lineHeightLg,
    },
    [classContentBox]: {
      padding: `${theme.spacing.xs}px 0 ${theme.spacing.md}px 0`,
    },
  };
};

export function CollapsibleSection(props: CollapsibleSectionProps) {
  const {
    title,
    forceOpen,
    showServerError,
    defaultCollapsed,
    onChange,
    className,
    componentId = 'mlflow.common.generic_collapsible_section',
  } = props;

  // We need to spread `activeKey` into <Collapse/> as an optional prop because its enumerability
  // affects rendering, i.e. passing `activeKey={undefined}` is different from not passing activeKey
  const activeKeyProp = forceOpen && { activeKey: ['1'] };
  const defaultActiveKey = defaultCollapsed ? null : ['1'];

  const { theme, getPrefixedClassName } = useDesignSystemTheme();
  const { formatMessage } = useIntl();

  const getExpandIcon = useCallback(
    ({ isActive }: { isActive?: boolean }) => (
      <div
        css={importantify({ width: theme.general.heightBase / 2, transform: isActive ? 'rotate(90deg)' : undefined })}
      >
        <ChevronRightIcon
          css={{
            svg: { width: theme.general.heightBase / 2, height: theme.general.heightBase / 2 },
          }}
          aria-label={
            isActive
              ? formatMessage(
                  {
                    defaultMessage: 'collapse {title}',
                    description: 'Common component > collapsible section > alternative label when expand',
                  },
                  { title },
                )
              : formatMessage(
                  {
                    defaultMessage: 'expand {title}',
                    description: 'Common component > collapsible section > alternative label when collapsed',
                  },
                  { title },
                )
          }
        />
      </div>
    ),
    [theme, title, formatMessage],
  );

  return (
    <Accordion
      componentId={componentId}
      {...activeKeyProp}
      dangerouslyAppendEmotionCSS={getAccordionStyles({ theme, getPrefixedClassName })}
      dangerouslySetAntdProps={{
        className,
        expandIconPosition: 'left',
        expandIcon: getExpandIcon,
      }}
      defaultActiveKey={defaultActiveKey ?? undefined}
      onChange={onChange}
    >
      <Accordion.Panel header={title} key="1">
        <SectionErrorBoundary showServerError={showServerError}>{props.children}</SectionErrorBoundary>
      </Accordion.Panel>
    </Accordion>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ColorsPaletteDatalist.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/ColorsPaletteDatalist.tsx

```typescript
import { RUNS_COLOR_PALETTE } from '../color-palette';

export const COLORS_PALETTE_DATALIST_ID = 'mlflow_run_colors_select';

/**
 * Datalist containing design system colors palette, to be used by native color picker.
 */
export const ColorsPaletteDatalist = () => (
  <datalist id={COLORS_PALETTE_DATALIST_ID}>
    {RUNS_COLOR_PALETTE.map((color) => (
      <option key={color}>{color}</option>
    ))}
  </datalist>
);
```

--------------------------------------------------------------------------------

---[FILE: DarkThemeSwitch.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/DarkThemeSwitch.test.tsx
Signals: React

```typescript
import { describe, jest, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { DarkThemeSwitch } from './DarkThemeSwitch';
import userEvent from '@testing-library/user-event';

describe('DarkThemeSwitch', () => {
  const mockSetIsDarkTheme = jest.fn();

  beforeEach(() => {
    mockSetIsDarkTheme.mockClear();
  });

  test('should render toggle button with sun icon when light theme is active', () => {
    renderWithIntl(<DarkThemeSwitch isDarkTheme={false} setIsDarkTheme={mockSetIsDarkTheme} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
  });

  test('should render toggle button with moon icon when dark theme is active', () => {
    renderWithIntl(<DarkThemeSwitch isDarkTheme setIsDarkTheme={mockSetIsDarkTheme} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
  });

  test('should call setIsDarkTheme with opposite value when clicked', async () => {
    renderWithIntl(<DarkThemeSwitch isDarkTheme={false} setIsDarkTheme={mockSetIsDarkTheme} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockSetIsDarkTheme).toHaveBeenCalledWith(true);
  });

  test('should call setIsDarkTheme with opposite value when clicked in dark mode', async () => {
    renderWithIntl(<DarkThemeSwitch isDarkTheme setIsDarkTheme={mockSetIsDarkTheme} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockSetIsDarkTheme).toHaveBeenCalledWith(false);
  });

  test('should be keyboard accessible', async () => {
    renderWithIntl(<DarkThemeSwitch isDarkTheme={false} setIsDarkTheme={mockSetIsDarkTheme} />);

    const button = screen.getByRole('button');
    button.focus();

    await userEvent.keyboard('{Enter}');
    expect(mockSetIsDarkTheme).toHaveBeenCalledWith(true);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DarkThemeSwitch.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/DarkThemeSwitch.tsx
Signals: React

```typescript
import React from 'react';

import { ToggleIconButton } from './ToggleIconButton';

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" css={{ fill: 'currentcolor' }}>
    {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
    <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" css={{ fill: 'currentcolor' }}>
    {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
    <path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" />
  </svg>
);

export const DarkThemeSwitch = ({
  isDarkTheme,
  setIsDarkTheme,
}: {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDarkTheme: boolean) => void;
}) => (
  <ToggleIconButton
    componentId="codegen_mlflow_app_src_common_components_darkthemeswitch.tsx_32"
    pressed={isDarkTheme}
    onClick={() => setIsDarkTheme(!isDarkTheme)}
    icon={isDarkTheme ? <MoonIcon /> : <SunIcon />}
    aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
    css={{
      background: 'transparent',
    }}
  />
);
```

--------------------------------------------------------------------------------

---[FILE: Descriptions.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/Descriptions.stories.tsx

```typescript
import { Descriptions } from './Descriptions';

export default {
  title: 'Common/Descriptions',
  component: Descriptions,
  argTypes: {},
};

const renderItems = () => (
  <>
    <Descriptions.Item label="The label">The value</Descriptions.Item>
    <Descriptions.Item label="Another label">Another value</Descriptions.Item>
    <Descriptions.Item label="A label">A value</Descriptions.Item>
    <Descriptions.Item label="Extra label">Extra value</Descriptions.Item>
  </>
);

export const SimpleUse = () => <Descriptions columns={3}>{renderItems()}</Descriptions>;

export const TwoColumns = () => <Descriptions columns={2}>{renderItems()}</Descriptions>;

export const ManyItems = () => (
  <Descriptions columns={3}>
    {renderItems()}
    {renderItems()}
    {renderItems()}
  </Descriptions>
);

export const AutomaticallyResizeItems = () => (
  <Descriptions>
    {renderItems()}
    {renderItems()}
    <Descriptions.Item label="Another label" span={2}>
      A really really really long value that needs extra space
    </Descriptions.Item>
    {renderItems()}
  </Descriptions>
);
```

--------------------------------------------------------------------------------

---[FILE: Descriptions.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/Descriptions.tsx
Signals: React

```typescript
import { Typography } from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import React from 'react';

export interface DescriptionsProps {
  columns?: number;
}

export interface DescriptionsItemProps {
  label: string | React.ReactNode;
  labelSize?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  span?: number;
}

/**
 * A component that displays the informative data in a key-value
 * fashion. Behaves similarly to antd's <Descriptions /> component.
 * If the number of columns is specified, then the key-values will
 * be displayed as such and will always be that number of columns
 * regardless of the width of the window.
 * If the number of columns is not specified, then the number of
 * columns will vary based on the size of the window.
 *
 * The following example will display four key-value descriptions
 * using two columns, which will result in data displayed in two rows:
 *
 * @example
 * <Descriptions columns={2}>
 *   <Descriptions.Item label="The label">The value</Descriptions.Item>
 *   <Descriptions.Item label="Another label">Another value</Descriptions.Item>
 *   <Descriptions.Item label="A label">A value</Descriptions.Item>
 *   <Descriptions.Item label="Extra label">Extra value</Descriptions.Item>
 * </Descriptions>
 */
export const Descriptions = ({ children, columns }: React.PropsWithChildren<DescriptionsProps>) => {
  const instanceStyles = columns ? styles.descriptionsArea(columns) : styles.autoFitArea;

  return <div css={instanceStyles}>{children}</div>;
};

Descriptions.Item = ({ label, labelSize = 'sm', children, span }: React.PropsWithChildren<DescriptionsItemProps>) => {
  return (
    <div data-testid="descriptions-item" css={styles.descriptionItem(span || 1)}>
      <div data-testid="descriptions-item-label" css={{ whiteSpace: 'nowrap' }}>
        <Typography.Text size={labelSize} color="secondary">
          {label}
        </Typography.Text>
      </div>
      <div data-testid="descriptions-item-colon" css={styles.colon}>
        <Typography.Text size={labelSize} color="secondary">
          :
        </Typography.Text>
      </div>
      <div data-testid="descriptions-item-content">{children}</div>
    </div>
  );
};

const styles = {
  descriptionsArea: (columnCount: number) => (theme: Theme) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columnCount}, minmax(100px, 1fr))`,
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  }),
  autoFitArea: (theme: Theme) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gridGap: theme.spacing.md,
  }),
  descriptionItem: (span: number) => ({
    display: 'flex',
    gridColumn: `span ${span}`,
  }),
  colon: {
    margin: '0 8px 0 0',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: DesignSystemContainer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/DesignSystemContainer.test.tsx
Signals: React

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '../utils/TestUtils.react18';
import { DesignSystemContainer } from './DesignSystemContainer';

let mockGetPopupContainerFn: any;

jest.mock('@databricks/design-system', () => ({
  DesignSystemProvider: ({ getPopupContainer, children }: any) => {
    mockGetPopupContainerFn = getPopupContainer;
    return children;
  },
  DesignSystemThemeProvider: ({ children }: any) => {
    return children;
  },
}));

describe('DesignSystemContainer', () => {
  window.customElements.define(
    'demo-shadow-dom',
    class extends HTMLElement {
      _shadowRoot: any;
      constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
      }
      connectedCallback() {
        render(
          <DesignSystemContainer>
            <span>hello in shadow dom</span>
          </DesignSystemContainer>,
          {
            baseElement: this._shadowRoot,
          },
        );
      }
    },
  );

  test('should not attach additional container while in document.body', () => {
    render(
      <DesignSystemContainer>
        <span>hello</span>
      </DesignSystemContainer>,
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(mockGetPopupContainerFn()).toBe(document.body);
  });

  test('should attach additional container while in shadow DOM', () => {
    const customElement = window.document.createElement('demo-shadow-dom');
    window.document.body.appendChild(customElement);

    expect(mockGetPopupContainerFn()).not.toBe(document.body);
    expect(mockGetPopupContainerFn().tagName).toBe('DIV');

    expect(1).toBe(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DesignSystemContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/DesignSystemContainer.tsx
Signals: React

```typescript
import React, { useCallback, useRef } from 'react';
import { DesignSystemProvider, DesignSystemThemeProvider } from '@databricks/design-system';
import { ColorsPaletteDatalist } from './ColorsPaletteDatalist';

const isInsideShadowDOM = (element: HTMLDivElement | null): boolean =>
  element instanceof window.Node && element.getRootNode() !== document;

type DesignSystemContainerProps = {
  isDarkTheme?: boolean;
  children: React.ReactNode;
};

const ThemeProvider = ({ children, isDarkTheme }: { children?: React.ReactNode; isDarkTheme?: boolean }) => {
  // eslint-disable-next-line react/forbid-elements
  return <DesignSystemThemeProvider isDarkMode={isDarkTheme}>{children}</DesignSystemThemeProvider>;
};

export const MLflowImagePreviewContainer = React.createContext({
  getImagePreviewPopupContainer: () => document.body,
});

/**
 * MFE-safe DesignSystemProvider that checks if the application is
 * in the context of the Shadow DOM and if true, provides dedicated
 * DOM element for the purpose of housing modals/popups there.
 */
export const DesignSystemContainer = (props: DesignSystemContainerProps) => {
  const modalContainerElement = useRef<HTMLDivElement | null>(null);
  const { isDarkTheme = false, children } = props;

  const getPopupContainer = useCallback(() => {
    const modelContainerEle = modalContainerElement.current;
    if (modelContainerEle !== null && isInsideShadowDOM(modelContainerEle)) {
      return modelContainerEle;
    }
    return document.body;
  }, []);

  // Specialized container for antd image previews, always rendered near MLflow
  // to maintain prefixed CSS classes and styles.
  const getImagePreviewPopupContainer = useCallback(() => {
    const modelContainerEle = modalContainerElement.current;
    if (modelContainerEle !== null) {
      return modelContainerEle;
    }
    return document.body;
  }, []);

  return (
    <ThemeProvider isDarkTheme={isDarkTheme}>
      <DesignSystemProvider getPopupContainer={getPopupContainer} {...props}>
        <MLflowImagePreviewContainer.Provider value={{ getImagePreviewPopupContainer }}>
          {children}
          <div ref={modalContainerElement} />
        </MLflowImagePreviewContainer.Provider>
      </DesignSystemProvider>
      <ColorsPaletteDatalist />
    </ThemeProvider>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EditableNote.css]---
Location: mlflow-master/mlflow/server/js/src/common/components/EditableNote.css

```text
.mlflow-editable-note-actions {
  margin-top: 16px;
}

.mlflow-editable-note-actions button + button {
  margin-left: 16px;
}

.mde-header {
  background: none;
}
```

--------------------------------------------------------------------------------

---[FILE: EditableNote.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/EditableNote.test.tsx
Signals: React

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import React from 'react';
import { EditableNote, EditableNoteImpl } from './EditableNote';
import { DesignSystemProvider } from '@databricks/design-system';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';

// Mock the Prompt component here. Otherwise, whenever we try to modify the note view's text
// area in the tests, it failed with the "RPC API is not defined" error.
jest.mock('./Prompt', () => {
  return {
    Prompt: jest.fn(() => <div />),
  };
});

const minimalProps = {
  onSubmit: jest.fn(() => Promise.resolve({})),
  onCancel: jest.fn(() => Promise.resolve({})),
};

const commonProps = { ...minimalProps, showEditor: true };

const textAreaDataTestId = 'text-area';
const saveButtonDataTestId = 'editable-note-save-button';

describe('EditableNote', () => {
  test('should render with minimal props without exploding', () => {
    renderWithIntl(
      <DesignSystemProvider>
        <EditableNote {...minimalProps} />
      </DesignSystemProvider>,
    );
    expect(screen.getByTestId('note-view-outer-container')).toBeInTheDocument();
  });

  test('renderActions is called and rendered correctly when showEditor is true', () => {
    renderWithIntl(
      <DesignSystemProvider>
        <EditableNote {...commonProps} />
      </DesignSystemProvider>,
    );
    expect(screen.getByTestId('note-view-outer-container')).toBeInTheDocument();
    expect(screen.getByTestId('editable-note-actions')).toBeInTheDocument();
  });

  test('handleSubmitClick with successful onSubmit', async () => {
    renderWithIntl(
      <DesignSystemProvider>
        <EditableNote {...commonProps} />
      </DesignSystemProvider>,
    );

    await userEvent.type(screen.getByTestId(textAreaDataTestId), 'test note');
    await userEvent.click(screen.getByTestId(saveButtonDataTestId));

    expect(commonProps.onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Failed to submit')).not.toBeInTheDocument();
  });

  test('handleRenameExperiment errors correctly', async () => {
    const mockSubmit = jest.fn(() => Promise.reject());
    const props = {
      onSubmit: mockSubmit,
      onCancel: jest.fn(() => Promise.resolve({})),
      showEditor: true,
    };
    renderWithIntl(
      <DesignSystemProvider>
        <EditableNote {...props} />
      </DesignSystemProvider>,
    );

    await userEvent.type(screen.getByTestId(textAreaDataTestId), 'test note');
    await userEvent.click(screen.getByTestId(saveButtonDataTestId));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Failed to submit')).toBeInTheDocument();
  });
  test('updates displayed description when defaultMarkdown changes', () => {
    const { rerender } = renderWithIntl(<EditableNote {...minimalProps} defaultMarkdown="first description" />);
    expect(screen.getByText('first description')).toBeInTheDocument();

    rerender(<EditableNote {...minimalProps} defaultMarkdown="second description" />);
    expect(screen.getByText('second description')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````

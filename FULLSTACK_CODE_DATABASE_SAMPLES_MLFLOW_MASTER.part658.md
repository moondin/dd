---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 658
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 658 of 991)

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

---[FILE: TimelineTreeFilterButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTreeFilterButton.tsx

```typescript
import {
  Button,
  Checkbox,
  FilterIcon,
  InfoTooltip,
  Popover,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { SpanFilterState } from '../ModelTrace.types';
import { getDisplayNameForSpanType, getIconTypeForSpan } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerIcon } from '../ModelTraceExplorerIcon';

export const TimelineTreeFilterButton = ({
  spanFilterState,
  setSpanFilterState,
}: {
  spanFilterState: SpanFilterState;
  setSpanFilterState: (state: SpanFilterState) => void;
}) => {
  const { theme } = useDesignSystemTheme();

  return (
    <Popover.Root componentId="shared.model-trace-explorer.timeline-tree-filter-popover">
      <Popover.Trigger asChild>
        <Button
          componentId="shared.model-trace-explorer.timeline-tree-filter-button"
          icon={<FilterIcon />}
          size="small"
        >
          <FormattedMessage defaultMessage="Filter" description="Label for the filter button in the trace explorer." />
        </Button>
      </Popover.Trigger>
      <Popover.Content align="start">
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, paddingBottom: theme.spacing.xs }}>
          <Typography.Text bold>
            <FormattedMessage
              defaultMessage="Filter"
              description="Label for the span filters popover in the trace explorer."
            />
          </Typography.Text>
          <Typography.Text color="secondary">
            <FormattedMessage
              defaultMessage="Span type"
              description="Section label for span type filters in the trace explorer."
            />
          </Typography.Text>
          {Object.entries(spanFilterState.spanTypeDisplayState).map(([spanType, shouldDisplay]) => {
            const icon = <ModelTraceExplorerIcon type={getIconTypeForSpan(spanType)} />;
            return (
              <Checkbox
                key={spanType}
                componentId="shared.model-trace-explorer.toggle-span-filter"
                style={{ width: '100%' }}
                isChecked={shouldDisplay}
                onChange={() =>
                  setSpanFilterState({
                    ...spanFilterState,
                    spanTypeDisplayState: {
                      ...spanFilterState.spanTypeDisplayState,
                      [spanType]: !shouldDisplay,
                    },
                  })
                }
              >
                {icon}
                <Typography.Text css={{ marginLeft: theme.spacing.xs }}>
                  {getDisplayNameForSpanType(spanType)}
                </Typography.Text>
              </Checkbox>
            );
          })}
          <Typography.Text color="secondary">
            <FormattedMessage
              defaultMessage="Settings"
              description="Section label for filter settings in the trace explorer."
            />
          </Typography.Text>
          <Checkbox
            componentId={`shared.model-trace-explorer.toggle-show-parents_${!spanFilterState.showParents}`}
            style={{ width: '100%' }}
            isChecked={spanFilterState.showParents}
            onChange={() =>
              setSpanFilterState({
                ...spanFilterState,
                showParents: !spanFilterState.showParents,
              })
            }
          >
            <Typography.Text css={{ marginRight: theme.spacing.xs }}>
              <FormattedMessage
                defaultMessage="Show all parent spans"
                description="Checkbox label for a setting that enables showing all parent spans in the trace explorer regardless of filter conditions."
              />
            </Typography.Text>
            <InfoTooltip
              componentId="shared.model-trace-explorer.show-parents-tooltip"
              content={
                <FormattedMessage
                  defaultMessage="Always show parents of matched spans, regardless of filter conditions"
                  description="Tooltip for a span filter setting that enables showing parents of matched spans"
                />
              }
            />
          </Checkbox>
          <Checkbox
            componentId={`shared.model-trace-explorer.toggle-show-parents_${!spanFilterState.showExceptions}`}
            style={{ width: '100%' }}
            isChecked={spanFilterState.showExceptions}
            onChange={() =>
              setSpanFilterState({
                ...spanFilterState,
                showExceptions: !spanFilterState.showExceptions,
              })
            }
          >
            <Typography.Text css={{ marginRight: theme.spacing.xs }}>
              <FormattedMessage
                defaultMessage="Show exceptions"
                description="Checkbox label for a setting that enables showing spans with exceptions in the trace explorer regardless of filter conditions."
              />
            </Typography.Text>
            <InfoTooltip
              componentId="shared.model-trace-explorer.show-exceptions-tooltip"
              content={
                <FormattedMessage
                  defaultMessage="Always show spans with exceptions, regardless of filter conditions"
                  description="Tooltip for a span filter setting that enables showing spans with exceptions"
                />
              }
            />
          </Checkbox>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeHeader.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTreeHeader.test.tsx
Signals: React

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';

import { TEST_SPAN_FILTER_STATE } from './TimelineTree.test-utils';
import { TimelineTreeHeader } from './TimelineTreeHeader';

const TestWrapper = () => {
  const [showTimelineInfo, setShowTimelineInfo] = useState<boolean>(false);
  const [spanFilterState, setSpanFilterState] = useState(TEST_SPAN_FILTER_STATE);

  return (
    <IntlProvider locale="en">
      <DesignSystemProvider>
        <TimelineTreeHeader
          showTimelineInfo={showTimelineInfo}
          setShowTimelineInfo={setShowTimelineInfo}
          spanFilterState={spanFilterState}
          setSpanFilterState={setSpanFilterState}
        />
        <span>{String(showTimelineInfo)}</span>
      </DesignSystemProvider>
    </IntlProvider>
  );
};

describe('TimelineTreeHeader', () => {
  it('should switch the timeline tree view state', async () => {
    render(<TestWrapper />);

    expect(screen.getByText('false')).toBeInTheDocument();

    const showTimelineButton = screen.getByTestId('show-timeline-info-button');
    await userEvent.click(showTimelineButton);
    expect(await screen.findByText('true')).toBeInTheDocument();

    const hideTimelineButton = screen.getByTestId('hide-timeline-info-button');
    await userEvent.click(hideTimelineButton);
    expect(await screen.findByText('false')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTreeHeader.tsx

```typescript
import {
  BarsAscendingVerticalIcon,
  ListBorderIcon,
  SegmentedControlButton,
  SegmentedControlGroup,
  Tooltip,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { TimelineTreeFilterButton } from './TimelineTreeFilterButton';
import type { SpanFilterState } from '../ModelTrace.types';

export const TimelineTreeHeader = ({
  showTimelineInfo,
  setShowTimelineInfo,
  spanFilterState,
  setSpanFilterState,
}: {
  showTimelineInfo: boolean;
  setShowTimelineInfo: (showTimelineInfo: boolean) => void;
  spanFilterState: SpanFilterState;
  setSpanFilterState: (state: SpanFilterState) => void;
}) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        paddingBottom: 3,
        borderBottom: `1px solid ${theme.colors.border}`,
        boxSizing: 'border-box',
        paddingLeft: theme.spacing.sm,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography.Text bold>
        <FormattedMessage
          defaultMessage="Trace breakdown"
          description="Header for the span tree within the MLflow trace UI"
        />
      </Typography.Text>
      <div css={{ display: 'flex', flexDirection: 'row', gap: theme.spacing.sm }}>
        <TimelineTreeFilterButton spanFilterState={spanFilterState} setSpanFilterState={setSpanFilterState} />
        <SegmentedControlGroup
          name="size-story"
          value={showTimelineInfo}
          onChange={(event) => {
            setShowTimelineInfo(event.target.value);
          }}
          size="small"
          componentId="shared.model-trace-explorer.toggle-show-timeline"
        >
          <SegmentedControlButton
            data-testid="hide-timeline-info-button"
            icon={
              <Tooltip
                componentId="shared.model-trace-explorer.hide-timeline-info-tooltip"
                content={
                  <FormattedMessage
                    defaultMessage="Show span tree"
                    description="Tooltip for a button that show the span tree view of the trace UI."
                  />
                }
              >
                <ListBorderIcon />
              </Tooltip>
            }
            value={false}
          />
          <SegmentedControlButton
            data-testid="show-timeline-info-button"
            icon={
              <Tooltip
                componentId="shared.model-trace-explorer.show-timeline-info-tooltip"
                content={
                  <FormattedMessage
                    defaultMessage="Show execution timeline"
                    description="Tooltip for a button that shows execution timeline info in the trace UI."
                  />
                }
              >
                <BarsAscendingVerticalIcon />
              </Tooltip>
            }
            value
          />
        </SegmentedControlGroup>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeHierarchyBars.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTreeHierarchyBars.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';

import type { HierarchyBar } from './TimelineTree.types';
import { SPAN_INDENT_WIDTH, SPAN_ROW_HEIGHT, TimelineTreeZIndex } from './TimelineTree.utils';

const IconBottomConnector = ({ active }: { active: boolean }) => {
  const { theme } = useDesignSystemTheme();
  const borderColor = active ? theme.colors.blue500 : theme.colors.border;

  return (
    <div
      css={{
        position: 'absolute',
        left: '100%',
        bottom: 0,
        // not sure why the +1 is necessary but
        // there is a 1 pixel misalignment with the
        // left connector otherwise
        width: SPAN_INDENT_WIDTH / 2 + 1,
        height: theme.spacing.md,
        boxSizing: 'border-box',
        borderTopRightRadius: theme.borders.borderRadiusMd,
        borderTop: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        zIndex: TimelineTreeZIndex.LOW, // render behind the span's icon
      }}
    />
  );
};

const IconLeftConnector = ({ active }: { active: boolean }) => {
  const { theme } = useDesignSystemTheme();
  const borderColor = active ? theme.colors.blue500 : theme.colors.border;

  return (
    <div
      css={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: SPAN_INDENT_WIDTH / 2,
        height: theme.spacing.md,
        boxSizing: 'border-box',
        borderBottomLeftRadius: theme.borders.borderRadiusMd,
        borderBottom: `1px solid ${borderColor}`,
        borderLeft: `1px solid ${borderColor}`,
        zIndex: active ? TimelineTreeZIndex.NORMAL : TimelineTreeZIndex.LOW,
      }}
    />
  );
};

const VerticalConnector = ({ active }: { active: boolean }) => {
  const { theme } = useDesignSystemTheme();
  const borderColor = active ? theme.colors.blue500 : theme.colors.border;

  return (
    <div
      css={{
        position: 'absolute',
        width: SPAN_INDENT_WIDTH / 2,
        left: '50%',
        height: SPAN_ROW_HEIGHT,
        borderLeft: `1px solid ${borderColor}`,
        boxSizing: 'border-box',
        zIndex: active ? TimelineTreeZIndex.NORMAL : TimelineTreeZIndex.LOW,
      }}
    />
  );
};

/**
 * This component renders the bars that represent the hierarchical
 * connections in the span tree.
 */
export const TimelineTreeHierarchyBars = ({
  isActiveSpan,
  isInActiveChain,
  linesToRender,
  hasChildren,
  isExpanded,
}: {
  // whether or not the current span is active
  isActiveSpan: boolean;
  // true if the span is either active or a parent of the active span
  isInActiveChain: boolean;
  // an array of bars to render to the left of the span icon / name
  linesToRender: Array<HierarchyBar>;
  hasChildren: boolean;
  isExpanded: boolean;
}) => {
  if (linesToRender.length === 0) {
    return (
      <div
        css={{
          width: 0,
          height: SPAN_ROW_HEIGHT,
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {hasChildren && <IconBottomConnector active={isInActiveChain && !isActiveSpan} />}
      </div>
    );
  }

  return (
    <>
      {linesToRender.map(({ shouldRender, isActive }, idx) => (
        // for each depth level, render a spacer. depending on the span's
        // position within the tree, the spacer might be empty or contain
        // a vertical bar
        <div
          key={idx}
          css={{
            width: SPAN_INDENT_WIDTH,
            height: SPAN_ROW_HEIGHT,
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {shouldRender && (
            // render a vertical bar in the middle of the spacer
            <VerticalConnector active={isActive} />
          )}
          {idx === linesToRender.length - 1 && (
            // at the last spacer, render a curved
            // line that connects up to the parent
            <>
              <IconLeftConnector active={isInActiveChain} />
              {hasChildren && isExpanded && <IconBottomConnector active={isInActiveChain && !isActiveSpan} />}
            </>
          )}
        </div>
      ))}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeNode.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTreeNode.test.tsx
Signals: React

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';

import { TimelineTreeNode } from './TimelineTreeNode';
import type { ModelTraceSpanNode } from '../ModelTrace.types';
import { MOCK_TRACE } from '../ModelTraceExplorer.test-utils';
import { parseModelTraceToTree } from '../ModelTraceExplorer.utils';

const TEST_NODE = parseModelTraceToTree(MOCK_TRACE) as ModelTraceSpanNode;

const TestWrapper = () => {
  const [selectedKey, setSelectedKey] = useState<string | number>(TEST_NODE.key);
  const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(new Set([]));

  return (
    <IntlProvider locale="en">
      <DesignSystemProvider>
        <TimelineTreeNode
          node={TEST_NODE}
          selectedKey={selectedKey}
          expandedKeys={expandedKeys}
          setExpandedKeys={setExpandedKeys}
          traceStartTime={0}
          traceEndTime={0}
          onSelect={(node) => setSelectedKey(node.key)}
          linesToRender={[]}
        />
      </DesignSystemProvider>
    </IntlProvider>
  );
};

describe('TimelineTreeNode', () => {
  it('should expand when the expand button is clicked', async () => {
    render(<TestWrapper />);

    expect(screen.getByTestId(`timeline-tree-node-${TEST_NODE.key}`)).toBeInTheDocument();
    expect(screen.getAllByTestId(/timeline-tree-node/).length).toBe(1);

    const parentExpandButton = screen.getByTestId(`toggle-span-expanded-${TEST_NODE.key}`);
    await userEvent.click(parentExpandButton);
    expect(screen.getAllByTestId(/timeline-tree-node/).length).toBe(2);

    const childExpandButton = screen.getByTestId(`toggle-span-expanded-${TEST_NODE.children?.[0]?.key}`);
    await userEvent.click(childExpandButton);
    expect(screen.getAllByTestId(/timeline-tree-node/).length).toBe(3);

    await userEvent.click(parentExpandButton);
    expect(screen.getAllByTestId(/timeline-tree-node/).length).toBe(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeNode.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTreeNode.tsx

```typescript
import {
  Button,
  Typography,
  useDesignSystemTheme,
  ChevronDownIcon,
  ChevronRightIcon,
  Tag,
  GavelIcon,
} from '@databricks/design-system';

import type { HierarchyBar } from './TimelineTree.types';
import { getActiveChildIndex, TimelineTreeZIndex } from './TimelineTree.utils';
import { TimelineTreeHierarchyBars } from './TimelineTreeHierarchyBars';
import { TimelineTreeSpanTooltip } from './TimelineTreeSpanTooltip';
import { type ModelTraceSpanNode } from '../ModelTrace.types';
import { getSpanExceptionCount } from '../ModelTraceExplorer.utils';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';

export const TimelineTreeNode = ({
  node,
  selectedKey,
  expandedKeys,
  setExpandedKeys,
  traceStartTime,
  traceEndTime,
  onSelect,
  linesToRender,
}: {
  node: ModelTraceSpanNode;
  selectedKey: string | number;
  expandedKeys: Set<string | number>;
  setExpandedKeys: (keys: Set<string | number>) => void;
  traceStartTime: number;
  traceEndTime: number;
  onSelect: ((node: ModelTraceSpanNode) => void) | undefined;
  // a boolean array that signifies whether or not a vertical
  // connecting line is supposed to in at the `i`th spacer. see
  // TimelineTreeHierarchyBars for more details.
  linesToRender: Array<HierarchyBar>;
}) => {
  const expanded = expandedKeys.has(node.key);
  const { theme } = useDesignSystemTheme();
  const hasChildren = (node.children ?? []).length > 0;
  const { setAssessmentsPaneExpanded } = useModelTraceExplorerViewState();

  const isActive = selectedKey === node.key;
  const activeChildIndex = getActiveChildIndex(node, String(selectedKey));
  // true if a span has active children OR is the active span
  const isInActiveChain = activeChildIndex > -1;

  const hasException = getSpanExceptionCount(node) > 0;

  const backgroundColor = isActive ? theme.colors.actionDefaultBackgroundHover : 'transparent';

  return (
    <>
      <TimelineTreeSpanTooltip span={node}>
        <div
          data-testid={`timeline-tree-node-${node.key}`}
          css={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            cursor: 'pointer',
            boxSizing: 'border-box',
            backgroundColor,
            ':hover': {
              backgroundColor: theme.colors.actionDefaultBackgroundHover,
            },
            ':active': {
              backgroundColor: theme.colors.actionDefaultBackgroundPress,
            },
          }}
          onClick={() => {
            onSelect?.(node);
          }}
        >
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              // add padding to root nodes, because they have no connecting lines
              padding: `0px ${theme.spacing.sm}px`,
              justifyContent: 'space-between',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            <div css={{ display: 'flex', flexDirection: 'row', alignItems: 'center', overflow: 'hidden', flex: 1 }}>
              {hasChildren ? (
                <Button
                  size="small"
                  data-testid={`toggle-span-expanded-${node.key}`}
                  css={{ flexShrink: 0, marginRight: theme.spacing.xs }}
                  icon={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  onClick={(event) => {
                    // prevent the node from being selected when the expand button is clicked
                    event.stopPropagation();
                    const newExpandedKeys = new Set(expandedKeys);
                    if (expanded) {
                      newExpandedKeys.delete(node.key);
                    } else {
                      newExpandedKeys.add(node.key);
                    }
                    setExpandedKeys(newExpandedKeys);
                  }}
                  componentId="shared.model-trace-explorer.toggle-span"
                />
              ) : (
                <div css={{ width: 24, marginRight: theme.spacing.xs }} />
              )}
              <TimelineTreeHierarchyBars
                isActiveSpan={isActive}
                isInActiveChain={isInActiveChain}
                linesToRender={linesToRender}
                hasChildren={hasChildren}
                isExpanded={expanded}
              />
              <span
                css={{
                  flexShrink: 0,
                  marginRight: theme.spacing.xs,
                  borderRadius: theme.borders.borderRadiusSm,
                  border: `1px solid ${
                    activeChildIndex > -1 ? theme.colors.blue500 : theme.colors.backgroundSecondary
                  }`,
                  zIndex: TimelineTreeZIndex.NORMAL,
                }}
              >
                {node.icon}
              </span>
              <Typography.Text
                color={hasException ? 'error' : 'primary'}
                css={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  flex: 1,
                }}
              >
                {node.title}
              </Typography.Text>
              {node.assessments.length > 0 && (
                <Tag
                  color="indigo"
                  data-testid={`assessment-tag-${node.key}`}
                  componentId="shared.model-trace-explorer.assessment-count"
                  css={{
                    margin: 0,
                    borderRadius: theme.borders.borderRadiusSm,
                  }}
                  onClick={() => setAssessmentsPaneExpanded?.(true)}
                >
                  <GavelIcon />
                  <Typography.Text css={{ marginLeft: theme.spacing.xs }}>{node.assessments.length}</Typography.Text>
                </Tag>
              )}
            </div>
          </div>
        </div>
      </TimelineTreeSpanTooltip>
      {expanded &&
        node.children?.map((child, idx) => (
          <TimelineTreeNode
            key={child.key}
            node={child}
            expandedKeys={expandedKeys}
            setExpandedKeys={setExpandedKeys}
            selectedKey={selectedKey}
            traceStartTime={traceStartTime}
            traceEndTime={traceEndTime}
            onSelect={onSelect}
            linesToRender={linesToRender.concat({
              // render the connecting line at this depth
              // if there are more children to render
              shouldRender: idx < (node.children?.length ?? 0) - 1,
              // make the vertical line blue if the active span
              // is below this child
              isActive: idx < activeChildIndex,
            })}
          />
        ))}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeSpanTooltip.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTreeSpanTooltip.tsx
Signals: React

```typescript
import React from 'react';

import { Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { spanTimeFormatter } from './TimelineTree.utils';
import type { ModelTraceSpanNode } from '../ModelTrace.types';
import { ModelSpanType } from '../ModelTrace.types';
import { getIconTypeForSpan } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerIcon } from '../ModelTraceExplorerIcon';

export const TimelineTreeSpanTooltip = ({
  span,
  children,
}: {
  span: ModelTraceSpanNode;
  children: React.ReactNode;
}) => {
  const { theme } = useDesignSystemTheme();
  const iconType = getIconTypeForSpan(span.type ?? ModelSpanType.UNKNOWN);
  const primaryTextColor = theme.isDarkMode ? theme.colors.grey800 : theme.colors.grey100;
  const secondaryTextColor = theme.isDarkMode ? theme.colors.grey500 : theme.colors.grey350;

  return (
    <Tooltip
      componentId="shared.model-trace-explorer.timeline-tree-node-tooltip"
      hideWhenDetached={false}
      content={
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              gap: theme.spacing.xs,
              alignItems: 'center',
              overflow: 'hidden',
              wordBreak: 'break-all',
            }}
          >
            <ModelTraceExplorerIcon type={iconType} isInTooltip />
            <span css={{ color: primaryTextColor }}>{span.title}</span>
            <span
              css={{ marginLeft: theme.spacing.xs, color: secondaryTextColor, fontSize: theme.typography.fontSizeSm }}
            >
              {spanTimeFormatter(span.end - span.start)}
            </span>
          </div>
          <div css={{ display: 'flex', flexDirection: 'row', color: primaryTextColor }}>
            <FormattedMessage defaultMessage="Start:" description="Label for the start time of a span" />{' '}
            {spanTimeFormatter(span.start)}
            {' | '}
            <FormattedMessage defaultMessage="End:" description="Label for the end time of a span" />{' '}
            {spanTimeFormatter(span.end)}
          </div>
        </div>
      }
      side="right"
      maxWidth={700}
    >
      {children}
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeTitle.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTreeTitle.tsx
Signals: React

```typescript
import React from 'react';

import { Tag, Typography, useDesignSystemTheme, XCircleIcon } from '@databricks/design-system';

import type { ModelTraceSpanNode } from '../ModelTrace.types';
import { getSpanExceptionCount } from '../ModelTraceExplorer.utils';

export const TimelineTreeTitle = ({
  node,
  spanTimeFormatter,
  withTimePill,
}: {
  node: ModelTraceSpanNode;
  spanTimeFormatter: (us: number) => string;
  withTimePill: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const hasException = getSpanExceptionCount(node) > 0;

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        height: theme.typography.lineHeightBase,
      }}
    >
      <Typography.Text>{node.title}</Typography.Text>
      {withTimePill && (
        <Tag
          color={hasException ? 'coral' : 'default'}
          componentId="shared.model-trace-explorer.timeline-tree-title-time-pill"
          title={spanTimeFormatter(node.end - node.start)}
          css={{
            margin: 0,
            marginLeft: theme.spacing.sm,
            fontSize: theme.typography.fontSizeSm,
          }}
        >
          {hasException && <XCircleIcon css={{ marginRight: theme.spacing.xs, fontSize: 14, color: 'inherit' }} />}
          <span css={{ fontSize: theme.typography.fontSizeSm }}>{spanTimeFormatter(node.end - node.start)}</span>
        </Tag>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeGanttBars.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/gantt/TimelineTreeGanttBars.tsx
Signals: React

```typescript
import { useMemo, useRef } from 'react';

import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useResizeObserver } from '@databricks/web-shared/hooks';

import { TimelineTreeGanttNode } from './TimelineTreeGanttNode';
import type { ModelTraceSpanNode } from '../../ModelTrace.types';
import { spanTimeFormatter, TimelineTreeZIndex } from '../TimelineTree.utils';

// the amount of space required to accomodate the collapse buttons
const TIMELINE_BAR_LEFT_OFFSET = 32;

// this function generates an array of "nice" x-ticks (e.g. nearest 0.1, 0.2, 0.5 to the value)
function getNiceXTicks(left: number, right: number, graphWidth: number, minPixelsBetweenTicks = 60): number[] {
  const range = right - left;
  if (range <= 0 || graphWidth <= 0) return [];

  const maxTickCount = Math.floor(graphWidth / minPixelsBetweenTicks);
  if (maxTickCount < 1) return [];

  // Step 1: raw interval
  const rawInterval = range / maxTickCount;

  // Step 2: round to a "nice" interval
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));
  const residual = rawInterval / magnitude;

  let niceFraction;
  if (residual <= 1) niceFraction = 1;
  else if (residual <= 2) niceFraction = 2;
  else if (residual <= 5) niceFraction = 5;
  else niceFraction = 10;

  const niceInterval = niceFraction * magnitude;

  // Step 3: extend right bound so we always overshoot it
  // this guarantees that there will be enough space to
  // render the span labels.
  const extendedRight = right + 2 * niceInterval;

  // Step 4: Generate tick positions
  const firstTick = Math.ceil(left / niceInterval) * niceInterval;
  const ticks: number[] = [];

  for (let tick = firstTick; tick <= extendedRight; tick += niceInterval) {
    ticks.push(Number(tick.toFixed(10))); // Avoid float errors
  }

  return ticks;
}

// converts timestamp numbers to real pixel values
function scaleX(value: number, left: number, right: number, width: number) {
  return ((value - left) / (right - left)) * width;
}

export const TimelineTreeGanttBars = ({
  nodes,
  selectedKey,
  onSelect,
  traceStartTime,
  traceEndTime,
  expandedKeys,
  setExpandedKeys,
}: {
  nodes: ModelTraceSpanNode[];
  selectedKey: string | number;
  onSelect: ((node: ModelTraceSpanNode) => void) | undefined;
  traceStartTime: number;
  traceEndTime: number;
  expandedKeys: Set<string | number>;
  setExpandedKeys: (keys: Set<string | number>) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const treeElementWidth = useResizeObserver({ ref: treeContainerRef })?.width ?? 0;
  const initialXTicks = useMemo(
    () => getNiceXTicks(traceStartTime, traceEndTime, treeElementWidth),
    [traceEndTime, traceStartTime, treeElementWidth],
  );
  const left = Math.min(...initialXTicks);
  // for the right limit of the graph, we take the average of the last
  // two ticks so that the graph does not end directly on a line. if
  // the graph ends on the line, the ticklabel at the top might render
  // slightly off screen, which looks bad
  const right = (initialXTicks[initialXTicks.length - 1] + initialXTicks[initialXTicks.length - 2]) / 2;
  // pop the last tick since we will not render it (it's beyond the right limit)
  const xTicks = initialXTicks.slice(0, -1);

  const scaleDurationToTreeWidth = (value: number) => scaleX(value, left, right, treeElementWidth);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* gantt bar header with the tick labels */}
      <div
        ref={treeContainerRef}
        css={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          height: theme.typography.lineHeightBase,
          paddingLeft: TIMELINE_BAR_LEFT_OFFSET,
          paddingRight: theme.spacing.lg,
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          backgroundColor: theme.colors.backgroundPrimary,
          zIndex: TimelineTreeZIndex.HIGH,
        }}
      >
        <div
          data-testid="time-marker-area"
          css={{
            position: 'relative',
          }}
        >
          {xTicks.map((n) => (
            <Typography.Text
              css={{
                position: 'absolute',
                transform: `translateX(-50%)`,
                left: scaleDurationToTreeWidth(n),
                whiteSpace: 'nowrap',
              }}
              key={n}
            >
              {spanTimeFormatter(n)}
            </Typography.Text>
          ))}
        </div>
      </div>
      {/* vertical gantt markers */}
      <div
        css={{
          flex: 1,
          pointerEvents: 'none',
          zIndex: TimelineTreeZIndex.LOW,
        }}
      >
        <div
          css={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
        >
          {xTicks.map((n) => (
            <div
              key={n}
              css={{
                position: 'absolute',
                left: scaleDurationToTreeWidth(n) + TIMELINE_BAR_LEFT_OFFSET,
                borderRight: `1px solid ${theme.colors.border}`,
                height: '100%',
              }}
            />
          ))}
        </div>
      </div>
      {/* colored horizontal gantt bars */}
      {nodes.map((node) => {
        const leftOffset = scaleDurationToTreeWidth(node.start);
        const width = scaleDurationToTreeWidth(node.end) - leftOffset;
        return (
          <TimelineTreeGanttNode
            key={node.key}
            selectedKey={selectedKey}
            onSelect={onSelect}
            node={node}
            leftOffset={leftOffset}
            width={width}
            expandedKeys={expandedKeys}
            setExpandedKeys={setExpandedKeys}
          />
        );
      })}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeGanttNode.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/gantt/TimelineTreeGanttNode.tsx
Signals: React

```typescript
import { useLayoutEffect, useRef } from 'react';

import { useDesignSystemTheme, Typography, Button, ChevronDownIcon, ChevronRightIcon } from '@databricks/design-system';

import type { ModelTraceSpanNode } from '../../ModelTrace.types';
import { spanTimeFormatter, TimelineTreeZIndex } from '../TimelineTree.utils';
import { TimelineTreeSpanTooltip } from '../TimelineTreeSpanTooltip';

export const TimelineTreeGanttNode = ({
  node,
  selectedKey,
  leftOffset,
  width,
  onSelect,
  expandedKeys,
  setExpandedKeys,
}: {
  node: ModelTraceSpanNode;
  selectedKey: string | number;
  leftOffset: number;
  width: number;
  onSelect: ((node: ModelTraceSpanNode) => void) | undefined;
  expandedKeys: Set<string | number>;
  setExpandedKeys: (keys: Set<string | number>) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const titleInBarRef = useRef<HTMLSpanElement>(null);
  const titleBesideBarRef = useRef<HTMLSpanElement>(null);
  const isActive = selectedKey === node.key;
  const backgroundColor = isActive ? theme.colors.actionDefaultBackgroundHover : 'transparent';
  const hasChildren = (node.children ?? []).length > 0;
  const expanded = expandedKeys.has(node.key);

  useLayoutEffect(() => {
    if (!titleInBarRef.current || !titleBesideBarRef.current) {
      return;
    }

    const spanWidth = Math.max(titleInBarRef.current.offsetWidth, titleBesideBarRef.current.offsetWidth);

    if (spanWidth < width - theme.spacing.sm) {
      titleInBarRef.current.style.display = 'inline';
      titleBesideBarRef.current.style.display = 'none';
    } else {
      titleInBarRef.current.style.display = 'none';
      titleBesideBarRef.current.style.display = 'inline';
    }
  }, [theme.spacing.sm, width]);

  return (
    <TimelineTreeSpanTooltip span={node}>
      <div
        key={node.key}
        css={{
          display: 'flex',
          flexDirection: 'row',
          cursor: 'pointer',
          boxSizing: 'border-box',
          paddingLeft: theme.spacing.xs,
          paddingRight: theme.spacing.sm,
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.xs,
          backgroundColor: backgroundColor,
          alignItems: 'center',
          ':hover': {
            backgroundColor: theme.colors.actionDefaultBackgroundHover,
          },
          ':active': {
            backgroundColor: theme.colors.actionDefaultBackgroundPress,
          },
          zIndex: TimelineTreeZIndex.NORMAL,
        }}
        onClick={() => onSelect?.(node)}
      >
        {hasChildren ? (
          <Button
            size="small"
            data-testid={`toggle-timeline-span-expanded-${node.key}`}
            css={{ flexShrink: 0, marginRight: theme.spacing.xs }}
            icon={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            onClick={(event) => {
              // prevent the node from being selected when the expand button is clicked
              event.stopPropagation();
              const newExpandedKeys = new Set(expandedKeys);
              if (expanded) {
                newExpandedKeys.delete(node.key);
              } else {
                newExpandedKeys.add(node.key);
              }
              setExpandedKeys(newExpandedKeys);
            }}
            componentId="shared.model-trace-explorer.toggle-timeline-span"
          />
        ) : (
          <div css={{ width: 24, marginRight: theme.spacing.xs }} />
        )}
        <div css={{ width: leftOffset, flexShrink: 0 }} />
        <div
          css={{
            position: 'relative',
            width,
            height: theme.typography.lineHeightBase,
            backgroundColor: theme.colors.blue600,
            borderRadius: theme.borders.borderRadiusSm,
            flexShrink: 0,
          }}
        >
          <Typography.Text>
            <span
              ref={titleInBarRef}
              css={{
                marginLeft: theme.spacing.xs,
                color: theme.colors.white,
                display: 'none',
              }}
            >
              {node.title}
            </span>
          </Typography.Text>
        </div>
        <div css={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          <Typography.Text>
            <span
              ref={titleBesideBarRef}
              css={{
                marginLeft: theme.spacing.xs,
                color: theme.colors.textPrimary,
              }}
            >
              {node.title}
            </span>
          </Typography.Text>
          <Typography.Text css={{ marginLeft: theme.spacing.xs }} color="secondary">
            {spanTimeFormatter(node.end - node.start)}
          </Typography.Text>
        </div>
      </div>
    </TimelineTreeSpanTooltip>
  );
};
```

--------------------------------------------------------------------------------

````

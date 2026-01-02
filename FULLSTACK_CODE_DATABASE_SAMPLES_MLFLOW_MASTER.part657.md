---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 657
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 657 of 991)

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

---[FILE: ModelTraceExplorerSummaryIntermediateNode.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/summary-view/ModelTraceExplorerSummaryIntermediateNode.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';

import { Button, ChevronRightIcon, ChevronDownIcon, useDesignSystemTheme, Typography } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { ModelTraceExplorerSummaryViewExceptionsSection } from './ModelTraceExplorerSummaryViewExceptionsSection';
import { type ModelTraceSpanNode } from '../ModelTrace.types';
import { createListFromObject, getSpanExceptionEvents } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerCollapsibleSection } from '../ModelTraceExplorerCollapsibleSection';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';
import { SpanNameDetailViewLink } from '../assessments-pane/SpanNameDetailViewLink';
import { ModelTraceExplorerFieldRenderer } from '../field-renderers/ModelTraceExplorerFieldRenderer';
import { spanTimeFormatter } from '../timeline-tree/TimelineTree.utils';

const CONNECTOR_WIDTH = 12;
const ROW_HEIGHT = 48;

export const ModelTraceExplorerSummaryIntermediateNode = ({
  node,
  renderMode,
}: {
  node: ModelTraceSpanNode;
  renderMode: 'default' | 'json';
}) => {
  const { theme } = useDesignSystemTheme();
  const [expanded, setExpanded] = useState(false);
  const inputList = useMemo(() => createListFromObject(node.inputs), [node]);
  const outputList = useMemo(() => createListFromObject(node.outputs), [node]);
  const exceptionEvents = getSpanExceptionEvents(node);
  const chatMessageFormat = node.chatMessageFormat;

  const hasException = exceptionEvents.length > 0;
  const containsInputs = inputList.length > 0;
  const containsOutputs = outputList.length > 0;

  const { setSelectedNode, setActiveView, setShowTimelineTreeGantt } = useModelTraceExplorerViewState();

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: ROW_HEIGHT,
        flexShrink: 0,
      }}
    >
      <div css={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center' }}>
        <Button
          size="small"
          data-testid={`toggle-span-expanded-${node.key}`}
          css={{ flexShrink: 0, marginRight: theme.spacing.xs }}
          icon={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={() => setExpanded(!expanded)}
          componentId="shared.model-trace-explorer.toggle-span"
        />
      </div>
      <div
        css={{
          position: 'relative',
          boxSizing: 'border-box',
          height: ROW_HEIGHT,
          borderLeft: `2px solid ${theme.colors.border}`,
          width: CONNECTOR_WIDTH,
        }}
      >
        <div
          css={{
            position: 'absolute',
            left: -2,
            top: 14,
            height: CONNECTOR_WIDTH,
            width: CONNECTOR_WIDTH,
            boxSizing: 'border-box',
            borderBottomLeftRadius: theme.borders.borderRadiusMd,
            borderBottom: `2px solid ${theme.colors.border}`,
            borderLeft: `2px solid ${theme.colors.border}`,
          }}
        />
      </div>
      <div css={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography.Text color="secondary" css={{ display: 'inline-flex', alignItems: 'center', height: ROW_HEIGHT }}>
            <FormattedMessage
              defaultMessage="{spanName} was called"
              description="Label for an intermediate node in the trace explorer summary view, indicating that a span/function was called in the course of execution."
              values={{
                spanName: <SpanNameDetailViewLink node={node} />,
              }}
            />
          </Typography.Text>
          <span
            onClick={() => {
              setSelectedNode(node);
              setActiveView('detail');
              setShowTimelineTreeGantt(true);
            }}
          >
            <Typography.Text
              css={{
                '&:hover': {
                  textDecoration: 'underline',
                  cursor: 'pointer',
                },
              }}
              color="secondary"
            >
              {spanTimeFormatter(node.end - node.start)}
            </Typography.Text>
          </span>
        </div>
        {expanded && (
          <div>
            {hasException && <ModelTraceExplorerSummaryViewExceptionsSection node={node} />}
            {containsInputs && (
              <ModelTraceExplorerCollapsibleSection
                sectionKey="input"
                title={
                  <FormattedMessage
                    defaultMessage="Inputs"
                    description="Model trace explorer > selected span > inputs header"
                  />
                }
              >
                <div
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.sm,
                    paddingLeft: theme.spacing.lg,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {inputList.map(({ key, value }, index) => (
                    <ModelTraceExplorerFieldRenderer
                      key={key || index}
                      title={key}
                      data={value}
                      renderMode={renderMode}
                      chatMessageFormat={chatMessageFormat}
                    />
                  ))}
                </div>
              </ModelTraceExplorerCollapsibleSection>
            )}
            {containsOutputs && (
              <ModelTraceExplorerCollapsibleSection
                sectionKey="output"
                title={
                  <FormattedMessage
                    defaultMessage="Outputs"
                    description="Model trace explorer > selected span > outputs header"
                  />
                }
              >
                <div
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.sm,
                    paddingLeft: theme.spacing.lg,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {outputList.map(({ key, value }) => (
                    <ModelTraceExplorerFieldRenderer
                      key={key}
                      title={key}
                      data={value}
                      renderMode={renderMode}
                      chatMessageFormat={chatMessageFormat}
                    />
                  ))}
                </div>
              </ModelTraceExplorerCollapsibleSection>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerSummarySection.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/summary-view/ModelTraceExplorerSummarySection.tsx
Signals: React

```typescript
import { useState } from 'react';

import { Typography, useDesignSystemTheme } from '@databricks/design-system';

import { ModelTraceExplorerCollapsibleSection } from '../ModelTraceExplorerCollapsibleSection';
import {
  ModelTraceExplorerFieldRenderer,
  DEFAULT_MAX_VISIBLE_CHAT_MESSAGES,
} from '../field-renderers/ModelTraceExplorerFieldRenderer';

const DEFAULT_MAX_VISIBLE_ITEMS = 3;

export const ModelTraceExplorerSummarySection = ({
  title,
  data,
  renderMode,
  sectionKey,
  maxVisibleItems = DEFAULT_MAX_VISIBLE_ITEMS,
  maxVisibleChatMessages = DEFAULT_MAX_VISIBLE_CHAT_MESSAGES,
  className,
  chatMessageFormat,
}: {
  title: React.ReactElement;
  data: { key: string; value: string }[];
  renderMode: 'default' | 'json' | 'text';
  sectionKey: string;
  maxVisibleItems?: number;
  maxVisibleChatMessages?: number;
  className?: string;
  chatMessageFormat?: string;
}) => {
  const { theme } = useDesignSystemTheme();
  const [expanded, setExpanded] = useState(false);
  const shouldTruncateItems = data.length > maxVisibleItems;

  const visibleItems = shouldTruncateItems && !expanded ? data.slice(-maxVisibleItems) : data;
  const hiddenItemCount = shouldTruncateItems ? data.length - visibleItems.length : 0;

  return (
    <ModelTraceExplorerCollapsibleSection withBorder title={title} className={className} sectionKey={sectionKey}>
      <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
        {shouldTruncateItems && (
          <Typography.Link
            css={{ alignSelf: 'flex-start', marginLeft: theme.spacing.xs }}
            componentId="shared.model-trace-explorer.conversation-toggle"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : `Show ${hiddenItemCount} more`}
          </Typography.Link>
        )}
        {visibleItems.map(({ key, value }, index) => (
          <ModelTraceExplorerFieldRenderer
            key={key || index}
            title={key}
            data={value}
            renderMode={renderMode}
            chatMessageFormat={chatMessageFormat}
            maxVisibleMessages={maxVisibleChatMessages}
          />
        ))}
      </div>
    </ModelTraceExplorerCollapsibleSection>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerSummarySpans.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/summary-view/ModelTraceExplorerSummarySpans.tsx
Signals: React

```typescript
import { useState } from 'react';

import { SegmentedControlButton, SegmentedControlGroup, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { ModelTraceExplorerSummaryIntermediateNode } from './ModelTraceExplorerSummaryIntermediateNode';
import { ModelTraceExplorerSummarySection } from './ModelTraceExplorerSummarySection';
import { ModelTraceExplorerSummaryViewExceptionsSection } from './ModelTraceExplorerSummaryViewExceptionsSection';
import type { ModelTraceExplorerRenderMode, ModelTraceSpanNode } from '../ModelTrace.types';
import { createListFromObject, getSpanExceptionEvents } from '../ModelTraceExplorer.utils';
import { AssessmentPaneToggle } from '../assessments-pane/AssessmentPaneToggle';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';
import { ModelTraceExplorerFieldRenderer } from '../field-renderers/ModelTraceExplorerFieldRenderer';

export const SUMMARY_SPANS_MIN_WIDTH = 400;

export const ModelTraceExplorerSummarySpans = ({
  rootNode,
  intermediateNodes,
  hideRenderModeSelector = false,
}: {
  rootNode: ModelTraceSpanNode;
  intermediateNodes: ModelTraceSpanNode[];
  hideRenderModeSelector?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const [renderMode, setRenderMode] = useState<ModelTraceExplorerRenderMode>('default');

  const rootInputs = rootNode.inputs;
  const rootOutputs = rootNode.outputs;
  const chatMessageFormat = rootNode.chatMessageFormat;
  const exceptions = getSpanExceptionEvents(rootNode);
  const hasIntermediateNodes = intermediateNodes.length > 0;
  const hasExceptions = exceptions.length > 0;

  const inputList = createListFromObject(rootInputs).filter(({ value }) => value !== 'null');
  const outputList = createListFromObject(rootOutputs).filter(({ value }) => value !== 'null');

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        padding: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        overflow: 'auto',
        minWidth: SUMMARY_SPANS_MIN_WIDTH,
      }}
    >
      {!hideRenderModeSelector && (
        <div
          css={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: theme.spacing.sm }}
        >
          <div css={{ display: 'flex', gap: theme.spacing.sm }}>
            <SegmentedControlGroup
              name="render-mode"
              componentId="shared.model-trace-explorer.summary-view.render-mode"
              value={renderMode}
              size="small"
              onChange={(event) => setRenderMode(event.target.value)}
            >
              <SegmentedControlButton value="default">
                <FormattedMessage
                  defaultMessage="Default"
                  description="Label for the default render mode selector in the model trace explorer summary view"
                />
              </SegmentedControlButton>
              <SegmentedControlButton value="json">
                <FormattedMessage
                  defaultMessage="JSON"
                  description="Label for the JSON render mode selector in the model trace explorer summary view"
                />
              </SegmentedControlButton>
            </SegmentedControlGroup>
            <AssessmentPaneToggle />
          </div>
        </div>
      )}
      {hasExceptions && <ModelTraceExplorerSummaryViewExceptionsSection node={rootNode} />}
      <ModelTraceExplorerSummarySection
        title={
          <FormattedMessage
            defaultMessage="Inputs"
            description="Model trace explorer > selected span > inputs header"
          />
        }
        css={{ marginBottom: hasIntermediateNodes ? 0 : theme.spacing.md }}
        sectionKey="summary-inputs"
        data={inputList}
        renderMode={renderMode}
        chatMessageFormat={chatMessageFormat}
      />
      {hasIntermediateNodes &&
        intermediateNodes.map((node) => (
          <ModelTraceExplorerSummaryIntermediateNode key={node.key} node={node} renderMode={renderMode} />
        ))}
      <ModelTraceExplorerSummarySection
        title={
          <FormattedMessage
            defaultMessage="Outputs"
            description="Model trace explorer > selected span > outputs header"
          />
        }
        sectionKey="summary-outputs"
        data={outputList}
        renderMode={renderMode}
        chatMessageFormat={chatMessageFormat ?? 'openai'}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerSummaryView.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/summary-view/ModelTraceExplorerSummaryView.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';

import { Empty, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { ModelTraceExplorerSummarySpans, SUMMARY_SPANS_MIN_WIDTH } from './ModelTraceExplorerSummarySpans';
import { useIntermediateNodes } from '../ModelTraceExplorer.utils';
import ModelTraceExplorerResizablePane from '../ModelTraceExplorerResizablePane';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';
import { AssessmentsPane } from '../assessments-pane/AssessmentsPane';
import { ASSESSMENT_PANE_MIN_WIDTH } from '../assessments-pane/AssessmentsPane.utils';

export const ModelTraceExplorerSummaryView = () => {
  const { theme } = useDesignSystemTheme();
  const [paneWidth, setPaneWidth] = useState(500);
  const { rootNode, nodeMap, assessmentsPaneEnabled, assessmentsPaneExpanded, isInComparisonView } =
    useModelTraceExplorerViewState();
  const allAssessments = useMemo(() => Object.values(nodeMap).flatMap((node) => node.assessments), [nodeMap]);

  const intermediateNodes = useIntermediateNodes(rootNode);

  if (!rootNode) {
    return (
      <div css={{ marginTop: theme.spacing.lg }}>
        <Empty
          description={
            <FormattedMessage
              defaultMessage="No span data to display"
              description="Title for the empty state in the model trace explorer summary view"
            />
          }
        />
      </div>
    );
  }
  const AssessmentsPaneComponent = (
    <AssessmentsPane assessments={allAssessments} traceId={rootNode.traceId} activeSpanId={undefined} />
  );

  return !isInComparisonView && assessmentsPaneEnabled && assessmentsPaneExpanded ? (
    <ModelTraceExplorerResizablePane
      initialRatio={0.75}
      paneWidth={paneWidth}
      setPaneWidth={setPaneWidth}
      leftChild={<ModelTraceExplorerSummarySpans rootNode={rootNode} intermediateNodes={intermediateNodes} />}
      rightChild={AssessmentsPaneComponent}
      leftMinWidth={SUMMARY_SPANS_MIN_WIDTH}
      rightMinWidth={ASSESSMENT_PANE_MIN_WIDTH}
    />
  ) : (
    <ModelTraceExplorerSummarySpans rootNode={rootNode} intermediateNodes={intermediateNodes} />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerSummaryViewExceptionsSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/summary-view/ModelTraceExplorerSummaryViewExceptionsSection.tsx

```typescript
import { Typography, XCircleIcon, useDesignSystemTheme } from '@databricks/design-system';

import type { ModelTraceSpanNode } from '../ModelTrace.types';
import { getSpanExceptionEvents } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerCollapsibleSection } from '../ModelTraceExplorerCollapsibleSection';
import { ModelTraceExplorerFieldRenderer } from '../field-renderers/ModelTraceExplorerFieldRenderer';

export const ModelTraceExplorerSummaryViewExceptionsSection = ({ node }: { node: ModelTraceSpanNode }) => {
  const { theme } = useDesignSystemTheme();
  const exceptionEvents = getSpanExceptionEvents(node);
  const isRoot = !node.parentId;
  // to prevent excessive nesting, we only show the first exception.
  // it is likely that any given span only has one exception,
  // since execution usually stops after throwing.
  const firstException = exceptionEvents[0];

  if (!firstException) {
    return null;
  }

  return (
    <ModelTraceExplorerCollapsibleSection
      css={{ marginBottom: isRoot ? theme.spacing.sm : 0 }}
      withBorder={isRoot}
      key={firstException.name}
      sectionKey={firstException.name}
      title={
        <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <XCircleIcon color="danger" />
          <Typography.Text color="error" bold>
            Exception
          </Typography.Text>
        </div>
      }
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
          paddingLeft: isRoot ? 0 : theme.spacing.lg,
        }}
      >
        {Object.entries(firstException.attributes ?? {}).map(([attribute, value]) => (
          <ModelTraceExplorerFieldRenderer
            key={attribute}
            title={attribute}
            data={JSON.stringify(value, null, 2)}
            renderMode="text"
          />
        ))}
      </div>
    </ModelTraceExplorerCollapsibleSection>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/index.ts

```typescript
export { TimelineTree } from './TimelineTree';
export type { TimelineTreeNode } from './TimelineTree.types';
```

--------------------------------------------------------------------------------

---[FILE: TimelineTree.test-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTree.test-utils.ts

```typescript
import type { SpanFilterState } from '../ModelTrace.types';
import { ModelSpanType } from '../ModelTrace.types';

export const TEST_SPAN_FILTER_STATE: SpanFilterState = {
  showParents: true,
  showExceptions: true,
  spanTypeDisplayState: {
    [ModelSpanType.CHAIN]: true,
    [ModelSpanType.LLM]: true,
    [ModelSpanType.AGENT]: true,
    [ModelSpanType.TOOL]: true,
    [ModelSpanType.FUNCTION]: true,
    [ModelSpanType.CHAT_MODEL]: true,
    [ModelSpanType.RETRIEVER]: true,
    [ModelSpanType.PARSER]: true,
    [ModelSpanType.EMBEDDING]: true,
    [ModelSpanType.RERANKER]: true,
    [ModelSpanType.UNKNOWN]: true,
  },
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTree.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTree.tsx
Signals: React

```typescript
import { useCallback, useMemo } from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { getTimelineTreeExpandedNodesList } from './TimelineTree.utils';
import { TimelineTreeHeader } from './TimelineTreeHeader';
import { TimelineTreeNode } from './TimelineTreeNode';
import { TimelineTreeGanttBars } from './gantt/TimelineTreeGanttBars';
import type { ModelTraceSpanNode, SpanFilterState } from '../ModelTrace.types';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';

export const TimelineTree = <NodeType extends ModelTraceSpanNode & { children?: NodeType[] }>({
  rootNodes,
  selectedNode,
  setSelectedNode,
  traceStartTime,
  traceEndTime,
  expandedKeys,
  setExpandedKeys,
  spanFilterState,
  setSpanFilterState,
  className,
}: {
  selectedNode?: NodeType;
  setSelectedNode: (node: ModelTraceSpanNode) => void;
  traceStartTime: number;
  traceEndTime: number;
  rootNodes: NodeType[];
  expandedKeys: Set<string | number>;
  setExpandedKeys: (keys: Set<string | number>) => void;
  spanFilterState: SpanFilterState;
  setSpanFilterState: (state: SpanFilterState) => void;
  className?: string;
}) => {
  const { theme } = useDesignSystemTheme();

  const onSpanClick = useCallback(
    (node) => {
      setSelectedNode?.(node);
    },
    [
      // comment to prevent prettier format after copybara
      setSelectedNode,
    ],
  );

  const { showTimelineTreeGantt: showTimelineInfo, setShowTimelineTreeGantt: setShowTimelineInfo } =
    useModelTraceExplorerViewState();

  const expandedNodesList = useMemo(
    () => getTimelineTreeExpandedNodesList(rootNodes, expandedKeys),
    [rootNodes, expandedKeys],
  );

  const treeElement = useMemo(
    () => (
      <div
        css={{
          flex: 1,
          overflow: 'auto',
          minHeight: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {showTimelineInfo ? (
          <TimelineTreeGanttBars
            nodes={expandedNodesList}
            selectedKey={selectedNode?.key ?? ''}
            onSelect={onSpanClick}
            traceStartTime={traceStartTime}
            traceEndTime={traceEndTime}
            expandedKeys={expandedKeys}
            setExpandedKeys={setExpandedKeys}
          />
        ) : (
          rootNodes.map((node) => (
            <TimelineTreeNode
              key={node.key}
              node={node}
              expandedKeys={expandedKeys}
              setExpandedKeys={setExpandedKeys}
              selectedKey={selectedNode?.key ?? ''}
              traceStartTime={traceStartTime}
              traceEndTime={traceEndTime}
              onSelect={onSpanClick}
              linesToRender={[]}
            />
          ))
        )}
      </div>
    ),
    [
      showTimelineInfo,
      expandedNodesList,
      selectedNode?.key,
      onSpanClick,
      traceStartTime,
      traceEndTime,
      rootNodes,
      expandedKeys,
      setExpandedKeys,
    ],
  );

  return (
    <div
      css={{
        height: '100%',
        borderRadius: theme.legacyBorders.borderRadiusMd,
        overflow: 'hidden',
        display: 'flex',
      }}
      className={className}
    >
      <div
        css={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div css={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <TimelineTreeHeader
            showTimelineInfo={showTimelineInfo}
            setShowTimelineInfo={setShowTimelineInfo}
            spanFilterState={spanFilterState}
            setSpanFilterState={setSpanFilterState}
          />
          {rootNodes.length > 0 ? (
            <div css={{ flex: 1, overflowY: 'auto', display: 'flex' }}>{treeElement}</div>
          ) : (
            <div
              css={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                padding: theme.spacing.md,
                paddingTop: theme.spacing.lg,
              }}
            >
              <FormattedMessage
                defaultMessage="No results found. Try using a different search term."
                description="Model trace explorer > no results found"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTree.types.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTree.types.ts

```typescript
import type { TreeDataNode } from '@databricks/design-system';

export const SPAN_NAMES_MIN_WIDTH = 100;
export const SPAN_NAMES_WITHOUT_GANTT_MIN_WIDTH = 280;
export const GANTT_BARS_MIN_WIDTH = 200;

export interface TimelineTreeNode extends Pick<TreeDataNode, 'key' | 'title' | 'icon'> {
  start: number;
  end: number;
  children?: TimelineTreeNode[];
}

export type HierarchyBar = {
  shouldRender: boolean;
  // the bar will render blue if this is true
  isActive: boolean;
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTree.utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTree.utils.test.ts

```typescript
import { describe, test, expect } from '@jest/globals';

import { getSpanNodeParentIds, getTimelineTreeNodesMap } from './TimelineTree.utils';
import type { ModelTraceSpanNode } from '../ModelTrace.types';
import { MOCK_TRACE } from '../ModelTraceExplorer.test-utils';
import { parseModelTraceToTree } from '../ModelTraceExplorer.utils';

describe('TimelineTree.utils', () => {
  test('getSpanNodeParentIds', () => {
    const rootNode = parseModelTraceToTree(MOCK_TRACE) as ModelTraceSpanNode;
    const nodeMap = getTimelineTreeNodesMap([rootNode]);

    // root node has no parent, so it should be an empty set
    const rootParentIds = getSpanNodeParentIds(rootNode, nodeMap);
    expect(rootParentIds).toEqual(new Set());

    // expect that a nested child has its parents constructed correctly
    const generateResponse = (rootNode?.children ?? [])[0] as ModelTraceSpanNode;
    const rephraseChat = (generateResponse?.children ?? [])[0] as ModelTraceSpanNode;
    const childParentIds = getSpanNodeParentIds(rephraseChat, nodeMap);
    expect(childParentIds).toEqual(new Set(['document-qa-chain', '_generate_response']));
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TimelineTree.utils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTree.utils.ts
Signals: React

```typescript
import { values } from 'lodash';
import { useState } from 'react';

import type { TimelineTreeNode } from './TimelineTree.types';
import type { ModelTraceSpanNode } from '../ModelTrace.types';
import { ModelSpanType } from '../ModelTrace.types';
import { getSpanExceptionCount } from '../ModelTraceExplorer.utils';

// expand all nodes by default
export const DEFAULT_EXPAND_DEPTH = Infinity;
export const SPAN_INDENT_WIDTH = 16;
export const SPAN_ROW_HEIGHT = 32;
export const TimelineTreeZIndex = {
  HIGH: 5,
  NORMAL: 3,
  LOW: 1,
};

// Gets the min and max start and end times of the tree
export const getTimelineTreeSpanConstraints = (
  nodes: TimelineTreeNode[],
  constraints = { min: Number.MAX_SAFE_INTEGER, max: 0 },
) => {
  nodes.forEach((node) => {
    const { start, end, children } = node;
    if (start < constraints.min) {
      constraints.min = start;
    }
    if (end > constraints.max) {
      constraints.max = end;
    }
    getTimelineTreeSpanConstraints(children ?? [], constraints);
  });

  return constraints;
};

// Gets a flat list of all expanded nodes in the tree
export const getTimelineTreeExpandedNodesList = <T extends TimelineTreeNode & { children?: T[] }>(
  nodes: T[],
  expandedKeys: Set<string | number>,
) => {
  const expandedNodesFlat: T[] = [];
  const traverseExpanded = (traversedNode: T | undefined) => {
    if (!traversedNode) {
      return;
    }
    expandedNodesFlat.push(traversedNode);
    if (expandedKeys.has(traversedNode.key)) {
      traversedNode.children?.forEach(traverseExpanded);
    }
  };

  nodes.forEach(traverseExpanded);
  return expandedNodesFlat;
};

// Gets a flat list of all nodes in the tree (regardless of expansion status)
export const getTimelineTreeNodesList = <T extends TimelineTreeNode & { children?: T[] }>(nodes: T[]) => {
  const expandedNodesFlat: T[] = [];
  const traverseExpanded = (traversedNode: T | undefined) => {
    if (!traversedNode) {
      return;
    }
    expandedNodesFlat.push(traversedNode);
    traversedNode.children?.forEach(traverseExpanded);
  };

  nodes.forEach(traverseExpanded);
  return expandedNodesFlat;
};

export const getTimelineTreeNodesMap = <T extends TimelineTreeNode & { children?: T[] }>(
  nodes: T[],
  expandDepth = Infinity,
) => {
  const nodesMap: { [nodeId: string]: T } = {};

  const traverse = (traversedNode: T | undefined, depth: number) => {
    if (!traversedNode || depth > expandDepth) {
      return;
    }
    nodesMap[traversedNode.key] = traversedNode;
    traversedNode.children?.forEach((child: T) => traverse(child, depth + 1));
  };

  nodes.forEach(traverse, 0);
  return nodesMap;
};

export const useTimelineTreeExpandedNodes = <T extends ModelTraceSpanNode & { children?: T[] }>(
  params: {
    rootNodes?: T[];
    // nodes beyond this depth will be collapsed
    initialExpandDepth?: number;
  } = {},
) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(() => {
    if (params.rootNodes) {
      const list = values(getTimelineTreeNodesMap(params.rootNodes, params.initialExpandDepth)).map((node) => node.key);
      return new Set(list);
    }
    return new Set();
  });

  return {
    expandedKeys,
    setExpandedKeys,
  };
};

export const useTimelineTreeSelectedNode = () => {
  const [selectedNode, setSelectedNode] = useState<ModelTraceSpanNode | undefined>(undefined);

  return {
    selectedNode,
    setSelectedNode,
  };
};

export const spanTimeFormatter = (executionTimeUs: number) => {
  // Convert to different units based on the time scale
  if (executionTimeUs === 0) {
    return '0s';
  } else if (executionTimeUs >= 60 * 1e6) {
    // More than or equal to 1 minute
    const executionTimeMin = executionTimeUs / 1e6 / 60;
    return `${executionTimeMin.toFixed(2)}m`;
  } else if (executionTimeUs >= 1e5) {
    // More than or equal to 0.1 second. this
    // is to avoid showing 3-digit ms numbers
    const executionTimeSec = executionTimeUs / 1e6;
    return `${executionTimeSec.toFixed(2)}s`;
  } else {
    // Less than 0.1 second (milliseconds)
    const executionTimeMs = executionTimeUs / 1e3;
    return `${executionTimeMs.toFixed(2)}ms`;
  }
};

export const getActiveChildIndex = (node: ModelTraceSpanNode, activeNodeId: string): number => {
  if (node.key === activeNodeId) {
    return 0;
  }

  return (node.children ?? []).findIndex((child) => getActiveChildIndex(child, activeNodeId) > -1);
};

export const getModelTraceSpanNodeDepth = (node: ModelTraceSpanNode): number => {
  if (!node.children || node.children?.length === 0) {
    return 0;
  }

  const childDepths = node.children.map(getModelTraceSpanNodeDepth);
  return Math.max(...childDepths) + 1;
};

export const getSpanNodeParentIds = (node: ModelTraceSpanNode, nodeMap: { [nodeId: string]: ModelTraceSpanNode }) => {
  const parents = new Set<string | number>();

  let currentNode = node;
  while (currentNode && currentNode.parentId) {
    parents.add(currentNode.parentId);
    currentNode = nodeMap[currentNode.parentId];
  }

  return parents;
};

export const isNodeImportant = (node: ModelTraceSpanNode) => {
  // root node is shown at top level, so we don't need to
  // show it in the intermediate nodes list
  if (!node.parentId) {
    return false;
  }

  return (
    [
      ModelSpanType.AGENT,
      ModelSpanType.RETRIEVER,
      ModelSpanType.CHAT_MODEL,
      ModelSpanType.TOOL,
      ModelSpanType.LLM,
    ].includes(node.type ?? ModelSpanType.UNKNOWN) || getSpanExceptionCount(node) > 0
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TimelineTreeFilterButton.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/timeline-tree/TimelineTreeFilterButton.test.tsx
Signals: React

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';

import { TEST_SPAN_FILTER_STATE } from './TimelineTree.test-utils';
import { TimelineTreeFilterButton } from './TimelineTreeFilterButton';
import type { SpanFilterState } from '../ModelTrace.types';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000);

const TestWrapper = () => {
  const [spanFilterState, setSpanFilterState] = useState<SpanFilterState>(TEST_SPAN_FILTER_STATE);

  return (
    <IntlProvider locale="en">
      <DesignSystemProvider>
        <TimelineTreeFilterButton spanFilterState={spanFilterState} setSpanFilterState={setSpanFilterState} />
        {/* Stringifying the underlying state so we can easily perform asserts */}
        <span>{'Show parents ' + String(spanFilterState.showParents)}</span>
        <span>{'Show exceptions ' + String(spanFilterState.showExceptions)}</span>
        <span>{'Show chain spans ' + String(spanFilterState.spanTypeDisplayState['CHAIN'])}</span>
      </DesignSystemProvider>
    </IntlProvider>
  );
};

describe('TimelineTreeFilterButton', () => {
  it('should switch filter states', async () => {
    render(<TestWrapper />);

    const filterButton = screen.getByRole('button', { name: 'Filter' });
    await userEvent.click(filterButton);

    // assert that the popover is open
    expect(await screen.findByText('Span type')).toBeInTheDocument();

    // Check that the show parents checkbox toggles the state
    expect(screen.getByText('Show parents true')).toBeInTheDocument();
    const showParentsCheckbox = screen.getByRole('checkbox', { name: /Show all parent spans/i });
    await userEvent.click(showParentsCheckbox);
    expect(screen.getByText('Show parents false')).toBeInTheDocument();

    // Same for show exceptions
    expect(screen.getByText('Show exceptions true')).toBeInTheDocument();
    const showExceptionsCheckbox = screen.getByRole('checkbox', { name: /Show exceptions/i });
    await userEvent.click(showExceptionsCheckbox);
    expect(screen.getByText('Show exceptions false')).toBeInTheDocument();

    // Same for span type filters (just check one for simplicity)
    expect(screen.getByText('Show chain spans true')).toBeInTheDocument();
    const showChainCheckbox = screen.getByRole('checkbox', { name: 'Chain' });
    await userEvent.click(showChainCheckbox);
    expect(screen.getByText('Show chain spans false')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 642
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 642 of 991)

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

---[FILE: ModelTraceExplorerAttributeRow.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerAttributeRow.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, ChevronDownIcon, ChevronRightIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';

import type { SearchMatch } from './ModelTrace.types';
import { ModelTraceExplorerHighlightedCodeSnippet } from './ModelTraceExplorerHighlightedCodeSnippet';
import { ModelTraceExplorerHighlightedSnippetTitle } from './ModelTraceExplorerHighlightedSnippetTitle';
// eslint-disable-next-line import/no-deprecated
import { CodeSnippet } from '../snippet';

export function ModelTraceExplorerAttributeRow({
  title,
  value,
  searchFilter,
  activeMatch,
  containsActiveMatch,
}: {
  title: string;
  // values can be arbitrary JSON
  value: string;
  searchFilter: string;
  // the current active search match
  activeMatch: SearchMatch | null;
  // whether the attribute row being rendered contains the
  // current active match (either in the title or value)
  containsActiveMatch: boolean;
}) {
  const stringValue = useMemo(() => JSON.stringify(value, null, 2), [value]);
  const containsMatches =
    Boolean(searchFilter) && !isNil(activeMatch) && stringValue.toLowerCase().includes(searchFilter);
  const [expanded, setExpanded] = useState(containsMatches);
  const [isContentLong, setIsContentLong] = useState(false);
  const snippetRef = useRef<HTMLDivElement>(null);

  // if the content is not expanded, render it as a single line that will get truncated
  const displayValue = useMemo(() => (expanded ? stringValue : JSON.stringify(value)), [value, stringValue, expanded]);
  const { theme } = useDesignSystemTheme();

  const PreWithRef = useCallback((preProps: any) => <pre {...preProps} ref={snippetRef} />, []);
  const isTitleMatch = containsActiveMatch && (activeMatch?.isKeyMatch ?? false);

  useEffect(() => {
    if (snippetRef.current) {
      setIsContentLong(snippetRef.current.scrollWidth > snippetRef.current.clientWidth);
    }
  }, [value]);

  // the returned fragment must have 3 children
  // because the parent is a grid with 3 columns
  return (
    <>
      <Typography.Text
        color="secondary"
        css={{
          display: 'inline-block',
          wordBreak: 'break-all',
        }}
        title={title}
      >
        <ModelTraceExplorerHighlightedSnippetTitle
          title={title}
          searchFilter={searchFilter}
          isActiveMatch={isTitleMatch}
        />
      </Typography.Text>
      {containsMatches ? (
        <>
          <div />
          <ModelTraceExplorerHighlightedCodeSnippet
            searchFilter={searchFilter}
            data={stringValue}
            activeMatch={activeMatch}
            containsActiveMatch={containsActiveMatch}
          />
        </>
      ) : (
        <>
          {isContentLong ? (
            <Button
              size="small"
              componentId={
                expanded
                  ? 'shared.model-trace-explorer.collapse-attribute-row'
                  : 'shared.model-trace-explorer.expand-attribute-row'
              }
              type="tertiary"
              icon={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              onClick={() => setExpanded(!expanded)}
            />
          ) : (
            <div />
          )}
          {/* eslint-disable-next-line import/no-deprecated */}
          <CodeSnippet
            PreTag={PreWithRef}
            language="json"
            lineProps={{
              style: {
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
              },
            }}
            wrapLines={expanded}
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              padding: theme.spacing.xs,
              overflow: expanded ? 'auto' : 'hidden',
              textOverflow: expanded ? 'unset' : 'ellipsis',
              height: 'fit-content',
            }}
          >
            {displayValue}
          </CodeSnippet>
        </>
      )}
    </>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerBadge.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerBadge.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';

export function ModelTraceExplorerBadge({ count }: { count: number }) {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.typography.fontSizeBase,
        height: theme.typography.fontSizeBase,
        backgroundColor: theme.colors.actionDangerPrimaryBackgroundDefault,
        padding: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
        boxSizing: 'border-box',
      }}
    >
      <span css={{ color: theme.colors.actionPrimaryTextDefault, fontSize: 11 }}>{count}</span>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerCodeSnippet.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerCodeSnippet.tsx
Signals: React

```typescript
import { isString } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { ChevronDownIcon, DropdownMenu, Tag, Typography, useDesignSystemTheme } from '@databricks/design-system';

import type { SearchMatch } from './ModelTrace.types';
import { CodeSnippetRenderMode } from './ModelTrace.types';
import { ModelTraceExplorerCodeSnippetBody } from './ModelTraceExplorerCodeSnippetBody';
import { ModelTraceExplorerHighlightedSnippetTitle } from './ModelTraceExplorerHighlightedSnippetTitle';

// return the initial render mode if specified, otherwise
// default to markdown for string data and json for non-string data
function getInitialRenderMode(dataIsString: boolean, initialRenderMode?: CodeSnippetRenderMode) {
  if (initialRenderMode) {
    return initialRenderMode;
  }

  if (dataIsString) {
    return CodeSnippetRenderMode.MARKDOWN;
  }

  return CodeSnippetRenderMode.JSON;
}

function getRenderModeDisplayText(renderMode: CodeSnippetRenderMode) {
  switch (renderMode) {
    case CodeSnippetRenderMode.JSON:
      return 'JSON';
    case CodeSnippetRenderMode.TEXT:
      return 'Text';
    case CodeSnippetRenderMode.MARKDOWN:
      return 'Markdown';
    case CodeSnippetRenderMode.PYTHON:
      return 'Python';
  }
}

export function ModelTraceExplorerCodeSnippet({
  title,
  tokens,
  data,
  searchFilter = '',
  activeMatch = null,
  containsActiveMatch = false,
  initialRenderMode,
}: {
  title: string;
  tokens?: number;
  data: string;
  searchFilter?: string;
  // the current active search match
  activeMatch?: SearchMatch | null;
  // whether the snippet being rendered contains the
  // current active match (either in the key or value)
  containsActiveMatch?: boolean;
  initialRenderMode?: CodeSnippetRenderMode;
}) {
  const parsedData = useMemo(() => JSON.parse(data), [data]);
  const dataIsString = isString(parsedData);
  const { theme } = useDesignSystemTheme();
  // string data can be rendered in multiple formats
  const [renderMode, setRenderMode] = useState<CodeSnippetRenderMode>(
    getInitialRenderMode(dataIsString, initialRenderMode),
  );
  const isTitleMatch = containsActiveMatch && (activeMatch?.isKeyMatch ?? false);
  const shouldShowRenderModeDropdown = dataIsString && !searchFilter;

  // we need to reset the render mode when the data changes
  useEffect(() => {
    setRenderMode(getInitialRenderMode(dataIsString, initialRenderMode));
  }, [dataIsString, initialRenderMode]);

  return (
    <div
      css={{
        position: 'relative',
      }}
    >
      <div
        css={{
          borderRadius: theme.borders.borderRadiusSm,
          border: `1px solid ${theme.colors.border}`,
          overflow: 'hidden',
        }}
      >
        {(title || shouldShowRenderModeDropdown) && (
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: theme.spacing.sm,
            }}
          >
            {/* TODO: support other types of formatting, e.g. markdown */}
            <Typography.Title
              css={{
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              level={4}
              color="secondary"
              withoutMargins
            >
              <ModelTraceExplorerHighlightedSnippetTitle
                title={title}
                searchFilter={searchFilter}
                isActiveMatch={isTitleMatch}
              />
            </Typography.Title>
            <div css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {shouldShowRenderModeDropdown && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Tag
                      componentId="shared.model-trace-explorer.snippet-render-mode-tag"
                      css={{
                        height: 'min-content',
                        margin: 0,
                      }}
                    >
                      {/* for some reason `cursor: pointer` doesn't work if you set it on the Tag css */}
                      <div css={{ paddingLeft: theme.spacing.xs, marginRight: theme.spacing.xs, cursor: 'pointer' }}>
                        <Typography.Text size="sm" color="secondary">
                          {getRenderModeDisplayText(renderMode)}
                        </Typography.Text>
                        <ChevronDownIcon />
                      </div>
                    </Tag>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.RadioGroup
                      componentId="shared.model-trace-explorer.snippet-render-mode-radio"
                      value={renderMode}
                      onValueChange={(value) => setRenderMode(value as CodeSnippetRenderMode)}
                    >
                      {Object.values(CodeSnippetRenderMode).map((mode) => {
                        if (mode === CodeSnippetRenderMode.PYTHON) {
                          return null;
                        }
                        return (
                          <DropdownMenu.RadioItem key={mode} value={mode}>
                            <DropdownMenu.ItemIndicator />
                            {getRenderModeDisplayText(mode)}
                          </DropdownMenu.RadioItem>
                        );
                      })}
                    </DropdownMenu.RadioGroup>
                    <DropdownMenu.Arrow />
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              )}
            </div>
          </div>
        )}
        <ModelTraceExplorerCodeSnippetBody
          data={data}
          searchFilter={searchFilter}
          activeMatch={activeMatch}
          containsActiveMatch={containsActiveMatch}
          renderMode={renderMode}
        />
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerCodeSnippetBody.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerCodeSnippetBody.tsx
Signals: React

```typescript
import { isNil, isString } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, ChevronDownIcon, ChevronUpIcon, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { SearchMatch } from './ModelTrace.types';
import { CodeSnippetRenderMode } from './ModelTrace.types';
import { ModelTraceExplorerHighlightedCodeSnippet } from './ModelTraceExplorerHighlightedCodeSnippet';
import { GenAIMarkdownRenderer } from '../genai-markdown-renderer';
// eslint-disable-next-line import/no-deprecated
import { CodeSnippet, SnippetCopyAction } from '../snippet';

const MAX_LINES_FOR_PREVIEW = 4;
// the `isContentLong` check does not work for
// markdown rendering, since the content is wrapped
const MAX_CHARS_FOR_PREVIEW = 300;

export function ModelTraceExplorerCodeSnippetBody({
  data,
  searchFilter = '',
  activeMatch = null,
  containsActiveMatch = false,
  renderMode = CodeSnippetRenderMode.JSON,
  initialExpanded = false,
}: {
  data: string;
  searchFilter?: string;
  activeMatch?: SearchMatch | null;
  containsActiveMatch?: boolean;
  renderMode?: CodeSnippetRenderMode;
  initialExpanded?: boolean;
}) {
  const containsMatches = Boolean(searchFilter) && !isNil(activeMatch) && data.toLowerCase().includes(searchFilter);
  const { theme } = useDesignSystemTheme();
  const [isContentLong, setIsContentLong] = useState(renderMode === 'json');
  const [expanded, setExpanded] = useState(initialExpanded || containsMatches);
  const snippetRef = useRef<HTMLPreElement>(null);
  // if the data is rendered in text / markdown mode, then
  // we need to parse it so that the newlines are unescaped
  const dataToTruncate: string = useMemo(() => {
    if (renderMode === 'json') {
      return data;
    }

    const parsedData = JSON.parse(data);
    if (isString(parsedData)) {
      return parsedData;
    }

    return data;
  }, [data, renderMode]);

  const expandable =
    isContentLong ||
    dataToTruncate.split('\n').length > MAX_LINES_FOR_PREVIEW ||
    dataToTruncate.length > MAX_CHARS_FOR_PREVIEW;

  // Truncate after first 3 lines if not expanded
  const displayedData = useMemo(() => {
    if (expandable && !expanded) {
      const split = dataToTruncate.split('\n').slice(0, MAX_LINES_FOR_PREVIEW).join('\n');
      return split.length > MAX_CHARS_FOR_PREVIEW ? split.slice(0, MAX_CHARS_FOR_PREVIEW) : split;
    }

    return dataToTruncate;
  }, [dataToTruncate, expandable, expanded]);

  useEffect(() => {
    if (snippetRef.current) {
      setIsContentLong(snippetRef.current.scrollWidth > snippetRef.current.clientWidth);
    }
  }, [renderMode, data]);

  // add a ref to the <pre> component within <CodeSnippet>.
  // we use the ref to check whether the <pre>'s content is overflowing
  const PreWithRef = useCallback((preProps: any) => <pre {...preProps} ref={snippetRef} />, []);

  if (containsMatches) {
    return (
      // if the snippet contains matches, render the search-highlighted version
      <ModelTraceExplorerHighlightedCodeSnippet
        data={data}
        searchFilter={searchFilter}
        activeMatch={activeMatch}
        containsActiveMatch={!activeMatch.isKeyMatch && containsActiveMatch}
      />
    );
  }

  return (
    <div css={{ position: 'relative' }}>
      {renderMode === 'markdown' ? (
        <div
          css={{
            padding: theme.spacing.md,
            backgroundColor: theme.colors.backgroundSecondary,
            marginBottom: -theme.spacing.md,
          }}
        >
          <GenAIMarkdownRenderer>{displayedData}</GenAIMarkdownRenderer>
        </div>
      ) : (
        <>
          <SnippetCopyAction
            key="copy-snippet"
            componentId="shared.model-trace-explorer.copy-snippet"
            copyText={data}
            size="small"
            css={{ position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs, zIndex: 1 }}
          />
          {/* eslint-disable-next-line import/no-deprecated */}
          <CodeSnippet
            PreTag={PreWithRef}
            showLineNumbers
            language={renderMode}
            lineProps={{ style: { wordBreak: 'break-word', whiteSpace: 'pre-wrap' } }}
            wrapLines={expanded}
            theme={theme.isDarkMode ? 'duotoneDark' : 'light'}
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              padding: theme.spacing.sm,
              paddingBottom: expandable ? 0 : theme.spacing.sm,
              paddingRight: theme.spacing.md * 2,
              overflow: expanded ? 'auto' : 'hidden',
              textOverflow: 'ellipsis',
              fontSize: theme.typography.fontSizeSm,
              lineHeight: theme.typography.lineHeightBase,
            }}
          >
            {displayedData}
          </CodeSnippet>
        </>
      )}
      {expandable && (
        <div css={{ backgroundColor: theme.colors.backgroundSecondary }}>
          <Button
            css={{ width: '100%', padding: 0 }}
            componentId={
              expanded ? 'shared.model-trace-explorer.snippet-see-less' : 'shared.model-trace-explorer.snippet-see-more'
            }
            icon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            type="tertiary"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <FormattedMessage
                defaultMessage="See less"
                description="Model trace explorer > selected span > code snippet > see less button"
              />
            ) : (
              <FormattedMessage
                defaultMessage="See more"
                description="Model trace explorer > selected span > code snippet > see more button"
              />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerCollapsibleSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerCollapsibleSection.tsx
Signals: React

```typescript
import { useState } from 'react';

import { Button, ChevronDownIcon, ChevronRightIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';

export const ModelTraceExplorerCollapsibleSection = ({
  sectionKey,
  title,
  children,
  withBorder = false,
  className,
}: {
  sectionKey: string;
  title: React.ReactNode;
  children: React.ReactNode;
  withBorder?: boolean;
  className?: string;
}) => {
  const [expanded, setExpanded] = useState(true);
  const { theme } = useDesignSystemTheme();
  return (
    <div
      className={className}
      css={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: theme.borders.borderRadiusMd,
      }}
    >
      <div
        css={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing.xs,
          padding: withBorder ? theme.spacing.sm : 0,
          background: withBorder ? theme.colors.backgroundSecondary : undefined,
          borderTopLeftRadius: theme.borders.borderRadiusMd,
          borderTopRightRadius: theme.borders.borderRadiusMd,
          borderBottomLeftRadius: expanded ? 0 : theme.borders.borderRadiusMd,
          borderBottomRightRadius: expanded ? 0 : theme.borders.borderRadiusMd,
          border: withBorder ? `1px solid ${theme.colors.border}` : undefined,
          marginBottom: withBorder ? 0 : theme.spacing.sm,
        }}
      >
        <Button
          size="small"
          componentId="shared.model-trace-explorer.expand"
          type="tertiary"
          icon={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={() => setExpanded(!expanded)}
        />
        <Typography.Title withoutMargins level={4} css={{ width: '100%' }}>
          {title}
        </Typography.Title>
      </div>
      {expanded && (
        <div
          css={{
            border: withBorder ? `1px solid ${theme.colors.border}` : undefined,
            borderTop: 'none',
            borderBottomLeftRadius: withBorder ? theme.borders.borderRadiusMd : undefined,
            borderBottomRightRadius: withBorder ? theme.borders.borderRadiusMd : undefined,
            padding: withBorder ? theme.spacing.sm : 0,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerComparisonView.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerComparisonView.tsx

```typescript
import { Button, ChevronDownIcon, ChevronRightIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { AssessmentsPane } from './assessments-pane/AssessmentsPane';
import { useModelTraceExplorerViewState } from './ModelTraceExplorerViewStateContext';
import { ModelTrace } from './ModelTrace.types';
import { ModelTraceExplorerContent } from './ModelTraceExplorerContent';

export const ModelTraceExplorerComparisonView = ({
  modelTraceInfo,
  className,
  selectedSpanId,
  onSelectSpan,
}: {
  modelTraceInfo: ModelTrace['info'];
  className?: string;
  selectedSpanId?: string;
  onSelectSpan?: (selectedSpanId?: string) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const { assessmentsPaneEnabled, assessmentsPaneExpanded, setAssessmentsPaneExpanded, rootNode, selectedNode } =
    useModelTraceExplorerViewState();

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          padding: `0px ${theme.spacing.sm}px`,
          marginBottom: theme.spacing.xs,
        }}
      >
        <Button
          size="small"
          componentId="shared.model-trace-explorer.toggle-assessments-pane"
          icon={assessmentsPaneExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={() => setAssessmentsPaneExpanded(!assessmentsPaneExpanded)}
        />
        <Typography.Text bold>
          <FormattedMessage defaultMessage="Assessments" description="Label for the assessments pane" />
        </Typography.Text>
      </div>
      {assessmentsPaneEnabled && assessmentsPaneExpanded && (
        <div
          css={{
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.sm,
            paddingTop: 0,
          }}
        >
          <AssessmentsPane
            assessments={rootNode?.assessments ?? []}
            traceId={rootNode?.traceId ?? ''}
            activeSpanId={(selectedNode?.key as string) ?? ''}
          />
        </div>
      )}
      <ModelTraceExplorerContent
        modelTraceInfo={modelTraceInfo}
        className={className}
        selectedSpanId={selectedSpanId}
        onSelectSpan={onSelectSpan}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerContent.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerContent.tsx
Signals: React

```typescript
import { Tabs, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { ModelTrace } from './ModelTrace.types';
import { useModelTraceExplorerViewState } from './ModelTraceExplorerViewStateContext';
import { useCallback } from 'react';
import { ModelTraceExplorerSummaryView } from './summary-view/ModelTraceExplorerSummaryView';
import { ModelTraceExplorerDetailView } from './ModelTraceExplorerDetailView';

export const ModelTraceExplorerContent = ({
  modelTraceInfo,
  className,
  selectedSpanId,
  onSelectSpan,
}: {
  modelTraceInfo: ModelTrace['info'];
  className?: string;
  selectedSpanId?: string;
  onSelectSpan?: (selectedSpanId?: string) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const { activeView, setActiveView, rootNode } = useModelTraceExplorerViewState();

  const handleValueChange = useCallback(
    (value: string) => {
      setActiveView(value as 'summary' | 'detail');
    },
    [
      // prettier-ignore
      setActiveView,
    ],
  );

  return (
    <Tabs.Root
      componentId="shared.model-trace-explorer.view-mode-toggle"
      value={activeView}
      onValueChange={handleValueChange}
      css={{
        // this is to remove the margin at the bottom of the <Tabs> component
        '& > div:nth-of-type(1)': {
          marginBottom: 0,
          flexShrink: 0,
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Tabs.List css={{ paddingLeft: theme.spacing.md, flexShrink: 0 }}>
        {rootNode && (
          <Tabs.Trigger value="summary">
            <FormattedMessage
              defaultMessage="Summary"
              description="Label for the summary view tab in the model trace explorer"
            />
          </Tabs.Trigger>
        )}
        <Tabs.Trigger value="detail">
          <FormattedMessage
            defaultMessage="Details & Timeline"
            description="Label for the details & timeline view tab in the model trace explorer"
          />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="summary"
        css={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        <ModelTraceExplorerSummaryView />
      </Tabs.Content>
      <Tabs.Content
        value="detail"
        css={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        <ModelTraceExplorerDetailView
          modelTraceInfo={modelTraceInfo}
          className={className}
          selectedSpanId={selectedSpanId}
          onSelectSpan={onSelectSpan}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerDetailView.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerDetailView.tsx
Signals: React

```typescript
import { values, isString } from 'lodash';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';

import type { ModelTrace, ModelTraceSpanNode } from './ModelTrace.types';
import type { ModelTraceExplorerResizablePaneRef } from './ModelTraceExplorerResizablePane';
import ModelTraceExplorerResizablePane from './ModelTraceExplorerResizablePane';
import ModelTraceExplorerSearchBox from './ModelTraceExplorerSearchBox';
import { useModelTraceExplorerViewState } from './ModelTraceExplorerViewStateContext';
import { useModelTraceSearch } from './hooks/useModelTraceSearch';
import { ModelTraceExplorerRightPaneTabs, RIGHT_PANE_MIN_WIDTH } from './right-pane/ModelTraceExplorerRightPaneTabs';
import { TimelineTree } from './timeline-tree';
import {
  DEFAULT_EXPAND_DEPTH,
  getModelTraceSpanNodeDepth,
  getTimelineTreeNodesMap,
  SPAN_INDENT_WIDTH,
  useTimelineTreeExpandedNodes,
} from './timeline-tree/TimelineTree.utils';

// this is the number of large spacings we need in order to
// properly calculate the min width for the left pane. it's:
// - 1 for left and right padding
// - 4 for the right collapse button + time marker
// - 1 for span icon
// - 1 for buffer (leave some space to render text)
const LEFT_PANE_MIN_WIDTH_LARGE_SPACINGS = 7;
const LEFT_PANE_HEADER_MIN_WIDTH_PX = 275;

const getDefaultSplitRatio = (): number => {
  if (window.innerWidth <= 768) {
    return 0.33;
  }

  return 0.25;
};

export const ModelTraceExplorerDetailView = ({
  modelTraceInfo,
  className,
  selectedSpanId,
  onSelectSpan,
}: {
  modelTraceInfo: ModelTrace['info'];
  className?: string;
  selectedSpanId?: string;
  onSelectSpan?: (selectedSpanId?: string) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const initialRatio = getDefaultSplitRatio();
  const paneRef = useRef<ModelTraceExplorerResizablePaneRef>(null);
  const [paneWidth, setPaneWidth] = useState(500);

  const { selectedNode, setSelectedNode, activeTab, setActiveTab, isInComparisonView, topLevelNodes } =
    useModelTraceExplorerViewState();

  const { expandedKeys, setExpandedKeys } = useTimelineTreeExpandedNodes({
    rootNodes: topLevelNodes,
    // nodes beyond this depth will be collapsed
    initialExpandDepth: DEFAULT_EXPAND_DEPTH,
  });

  const {
    matchData,
    searchFilter,
    setSearchFilter,
    spanFilterState,
    setSpanFilterState,
    filteredTreeNodes,
    handleNextSearchMatch,
    handlePreviousSearchMatch,
  } = useModelTraceSearch({
    treeNodes: topLevelNodes,
    selectedNode,
    setSelectedNode,
    setActiveTab,
    setExpandedKeys,
    modelTraceInfo,
  });

  const onSelectNode = (node?: ModelTraceSpanNode) => {
    setSelectedNode(node);
    if (isString(node?.key)) {
      onSelectSpan?.(node?.key);
    }
  };

  // initial render
  useLayoutEffect(() => {
    // expand all nodes up to the default depth when the tree changes
    const list = values(getTimelineTreeNodesMap(filteredTreeNodes, DEFAULT_EXPAND_DEPTH)).map((node) => node.key);
    setExpandedKeys(new Set(list));
  }, [filteredTreeNodes, setExpandedKeys]);

  const leftPaneMinWidth = useMemo(() => {
    // min width necessary to render all the spans in the tree accounting for indentation
    const minWidthForSpans =
      Math.max(...filteredTreeNodes.map(getModelTraceSpanNodeDepth)) * SPAN_INDENT_WIDTH +
      LEFT_PANE_MIN_WIDTH_LARGE_SPACINGS * theme.spacing.lg;
    // min width necessary to render the header, given that it has a bunch of buttons
    return Math.max(LEFT_PANE_HEADER_MIN_WIDTH_PX, minWidthForSpans);
  }, [filteredTreeNodes, theme.spacing.lg]);

  const { traceStartTime, traceEndTime } = useMemo(() => {
    if (!topLevelNodes || topLevelNodes.length === 0) {
      return { traceStartTime: 0, traceEndTime: 0 };
    }

    const traceStartTime = Math.min(...topLevelNodes.map((node) => node.start));
    const traceEndTime = Math.max(...topLevelNodes.map((node) => node.end));

    return { traceStartTime, traceEndTime };
  }, [topLevelNodes]);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
      className={className}
    >
      <div
        css={{
          padding: theme.spacing.xs,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <ModelTraceExplorerSearchBox
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          matchData={matchData}
          handleNextSearchMatch={handleNextSearchMatch}
          handlePreviousSearchMatch={handlePreviousSearchMatch}
        />
      </div>
      <ModelTraceExplorerResizablePane
        ref={paneRef}
        initialRatio={initialRatio}
        paneWidth={paneWidth}
        setPaneWidth={setPaneWidth}
        leftChild={
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minWidth: leftPaneMinWidth,
            }}
          >
            <TimelineTree
              rootNodes={filteredTreeNodes}
              selectedNode={selectedNode}
              traceStartTime={traceStartTime}
              traceEndTime={traceEndTime}
              setSelectedNode={onSelectNode}
              css={{ flex: 1 }}
              expandedKeys={expandedKeys}
              setExpandedKeys={setExpandedKeys}
              spanFilterState={spanFilterState}
              setSpanFilterState={setSpanFilterState}
            />
          </div>
        }
        leftMinWidth={leftPaneMinWidth}
        rightChild={
          <ModelTraceExplorerRightPaneTabs
            activeSpan={selectedNode}
            searchFilter={searchFilter}
            activeMatch={matchData.match}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        }
        rightMinWidth={RIGHT_PANE_MIN_WIDTH}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerErrorState.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerErrorState.tsx

```typescript
import { DangerIcon, Empty } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

export const ModelTraceExplorerErrorState = () => {
  return (
    <Empty
      title={
        <FormattedMessage
          defaultMessage="Trace failed to render"
          description="Title for the error state in the model trace explorer"
        />
      }
      description={
        <FormattedMessage
          defaultMessage="Unfortunately, the trace could not be rendered due to an unknown error. You can reload the page to try again. If the problem persists, please contact support."
          description="Description for the error state in the model trace explorer"
        />
      }
      image={<DangerIcon />}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerGenericErrorState.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerGenericErrorState.tsx

```typescript
import { DangerIcon, Empty, PageWrapper } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

export const ModelTraceExplorerGenericErrorState = ({ error }: { error?: Error }) => {
  return (
    <PageWrapper css={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        data-testid="fallback"
        title={
          <FormattedMessage
            defaultMessage="Error"
            description="Title for error fallback component in Trace Explorer UI"
          />
        }
        description={
          error?.message ?? (
            <FormattedMessage
              defaultMessage="An error occurred while rendering the trace"
              description="Description for default error message in the Trace Explorer UI"
            />
          )
        }
        image={<DangerIcon />}
      />
    </PageWrapper>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerHighlightedCodeSnippet.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerHighlightedCodeSnippet.tsx
Signals: React

```typescript
import React, { useCallback, useMemo } from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';

import type { SearchMatch } from './ModelTrace.types';
import { getHighlightedSpanComponents } from './ModelTraceExplorer.utils';
import { ACTIVE_HIGHLIGHT_COLOR, INACTIVE_HIGHLIGHT_COLOR } from './constants';

export const ModelTraceExplorerHighlightedCodeSnippet = ({
  searchFilter,
  data,
  activeMatch,
  containsActiveMatch,
}: {
  searchFilter: string;
  data: string;
  activeMatch: SearchMatch;
  containsActiveMatch: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const scrollToActiveMatch = useCallback((node: HTMLElement | null) => {
    node?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, []);

  const spans = useMemo(() => {
    if (!searchFilter) {
      return [];
    }

    return getHighlightedSpanComponents({
      data,
      searchFilter,
      activeMatchBackgroundColor: theme.colors[ACTIVE_HIGHLIGHT_COLOR],
      inactiveMatchBackgroundColor: theme.colors[INACTIVE_HIGHLIGHT_COLOR],
      containsActiveMatch,
      activeMatch,
      scrollToActiveMatch,
    });
  }, [searchFilter, data, theme, containsActiveMatch, activeMatch, scrollToActiveMatch]);

  return (
    <pre
      css={{
        whiteSpace: 'pre-wrap',
        backgroundColor: theme.colors.backgroundSecondary,
        padding: theme.spacing.sm,
        fontSize: theme.typography.fontSizeSm,
      }}
    >
      {spans}
    </pre>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerHighlightedSnippetTitle.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ModelTraceExplorerHighlightedSnippetTitle.tsx
Signals: React

```typescript
import React, { useCallback } from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';

import { ACTIVE_HIGHLIGHT_COLOR, INACTIVE_HIGHLIGHT_COLOR } from './constants';

export const ModelTraceExplorerHighlightedSnippetTitle = ({
  title,
  searchFilter,
  isActiveMatch,
}: {
  title: string;
  searchFilter: string;
  isActiveMatch: boolean;
}): React.ReactElement => {
  const { theme } = useDesignSystemTheme();
  const scrollToActiveMatch = useCallback((node: HTMLElement | null) => {
    node?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, []);

  const titleLower = title.toLowerCase();
  if (!titleLower.includes(searchFilter)) {
    return <div>{title}</div>;
  }

  const startIdx = titleLower.indexOf(searchFilter);
  const endIdx = startIdx + searchFilter.length;
  const backgroundColor = isActiveMatch ? theme.colors[ACTIVE_HIGHLIGHT_COLOR] : theme.colors[INACTIVE_HIGHLIGHT_COLOR];

  return (
    <div>
      {title.slice(0, startIdx)}
      <span ref={isActiveMatch ? scrollToActiveMatch : null} css={{ backgroundColor, scrollMarginTop: 50 }}>
        {title.slice(startIdx, endIdx)}
      </span>
      {title.slice(endIdx)}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

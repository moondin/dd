---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 482
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 482 of 991)

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

---[FILE: ExperimentViewRunsEmptyTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsEmptyTable.tsx

```typescript
import { BeakerIcon, Button, Empty, FilterIcon } from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import { FormattedMessage } from 'react-intl';
import { LoggingRunsDocUrl } from '../../../../../common/constants';

/**
 * This component displays information about no results being displayed in runs tample,
 * either due to no runs recorded in an experiment at all or due to currently used filters.
 */
export const ExperimentViewRunsEmptyTable = ({
  isFiltered,
  onClearFilters,
}: {
  onClearFilters: () => void;
  isFiltered: boolean;
}) => {
  const getLearnMoreLinkUrl = () => LoggingRunsDocUrl;

  return (
    <div css={styles.noResultsWrapper}>
      <div css={styles.noResults}>
        {isFiltered ? (
          <Empty
            button={
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsemptytable.tsx_35"
                type="primary"
                onClick={onClearFilters}
              >
                <FormattedMessage
                  defaultMessage="Clear filters"
                  description="Label for a button that clears all filters, visible on a experiment runs page next to a empty state when all runs have been filtered out"
                />
              </Button>
            }
            description={
              <FormattedMessage
                defaultMessage="All runs in this experiment have been filtered. Change or clear filters to view runs."
                description="Empty state description text for experiment runs page when all runs have been filtered out"
              />
            }
            title={
              <FormattedMessage
                defaultMessage="All runs are filtered"
                description="Empty state title text for experiment runs page when all runs have been filtered out"
              />
            }
            image={<FilterIcon />}
          />
        ) : (
          <Empty
            description={
              <FormattedMessage
                defaultMessage="No runs have been logged yet. <link>Learn more</link> about how to create ML model training runs in this experiment."
                description="Empty state description text for experiment runs page when no runs are logged in the experiment"
                values={{
                  link: (chunks: any) => (
                    <a target="_blank" href={getLearnMoreLinkUrl()} rel="noreferrer">
                      {chunks}
                    </a>
                  ),
                }}
              />
            }
            title={
              <FormattedMessage
                defaultMessage="No runs logged"
                description="Empty state title text for experiment runs page when no runs are logged in the experiment"
              />
            }
            image={<BeakerIcon />}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  noResults: {
    maxWidth: 360,
  },
  noResultsWrapper: (theme: Theme) => ({
    marginTop: theme.spacing.lg,
    inset: 0,
    backgroundColor: theme.colors.backgroundPrimary,
    position: 'absolute' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsGroupBySelector.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsGroupBySelector.test.tsx
Signals: React

```typescript
import { describe, jest, test, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { render, screen } from '../../../../../common/utils/TestUtils.react18';
import type { ExperimentRunsSelectorResult } from '../../utils/experimentRuns.selector';
import { ExperimentViewRunsGroupBySelector } from './ExperimentViewRunsGroupBySelector';
import userEventGlobal, { PointerEventsCheckLevel } from '@testing-library/user-event';
import { DesignSystemProvider } from '@databricks/design-system';
import type { RunsGroupByConfig } from '../../utils/experimentPage.group-row-utils';
import { RunGroupingAggregateFunction, RunGroupingMode } from '../../utils/experimentPage.row-types';
import { useState } from 'react';

const userEvent = userEventGlobal.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });

describe('ExperimentViewRunsGroupBySelector', () => {
  const runsDataDatasets: Partial<ExperimentRunsSelectorResult> = {
    datasetsList: [
      [
        {
          dataset: { digest: 'abcdef', name: 'eval-dataset', profile: '', schema: '', source: '', sourceType: '' },
          tags: [],
        },
      ],
    ],
  };
  const runsDataParams: Partial<ExperimentRunsSelectorResult> = {
    paramKeyList: ['param1', 'param2'],
  };
  const runsDataTags: Partial<ExperimentRunsSelectorResult> = {
    tagsList: [
      { tag1: { key: 'tag1', value: 'value1' } },
      { tag1: { key: 'tag1', value: 'value2' } },
      { tag2: { key: 'tag2', value: 'value2' } },
    ] as any,
  };
  const defaultRunsData: ExperimentRunsSelectorResult = {
    ...runsDataDatasets,
    ...runsDataParams,
    ...runsDataTags,
  } as any;

  const renderComponent = (
    initialGroupBy: RunsGroupByConfig | string | null = null,
    runsData = defaultRunsData,
    onChangeListener = jest.fn(),
  ) => {
    const TestComponent = () => {
      const [groupBy, setGroupBy] = useState<RunsGroupByConfig | string | null>(initialGroupBy);
      return (
        <ExperimentViewRunsGroupBySelector
          groupBy={groupBy}
          isLoading={false}
          runsData={runsData}
          useGroupedValuesInCharts
          onUseGroupedValuesInChartsChange={() => {}}
          onChange={(data) => {
            setGroupBy(data);
            onChangeListener(data);
          }}
        />
      );
    };
    return render(<TestComponent />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <DesignSystemProvider>{children}</DesignSystemProvider>
        </IntlProvider>
      ),
    });
  };

  test('displays selector for dataset, tags and params with nothing checked', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));

    expect(screen.getByRole('menuitemcheckbox', { name: 'tag1' })).not.toBeChecked();
    expect(screen.getByRole('menuitemcheckbox', { name: 'tag2' })).not.toBeChecked();
    expect(screen.getByRole('menuitemcheckbox', { name: 'param1' })).not.toBeChecked();
    expect(screen.getByRole('menuitemcheckbox', { name: 'param2' })).not.toBeChecked();
    expect(screen.getByRole('menuitemcheckbox', { name: 'Dataset' })).not.toBeChecked();
  });

  test('displays selector for dataset, tags and params with group by already set (legacy group by key)', async () => {
    renderComponent('param.min.param1');

    await userEvent.click(screen.getByRole('button', { name: /^Group by:/ }));

    expect(screen.getByRole('menuitemcheckbox', { name: 'param1' })).toBeChecked();
  });

  test('displays selector for dataset, tags and params with group by already set', async () => {
    renderComponent({
      aggregateFunction: RunGroupingAggregateFunction.Min,
      groupByKeys: [
        {
          mode: RunGroupingMode.Param,
          groupByData: 'param1',
        },
      ],
    });

    await userEvent.click(screen.getByRole('button', { name: /^Group by:/ }));

    expect(screen.getByRole('menuitemcheckbox', { name: 'param1' })).toBeChecked();
  });

  test('displays selector with no datasets present', async () => {
    renderComponent(null, {
      ...defaultRunsData,
      datasetsList: [],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));

    expect(screen.queryByRole('menuitemcheckbox', { name: 'Dataset' })).not.toBeInTheDocument();
  });

  test('selects group by tag option', async () => {
    const onChange = jest.fn();
    renderComponent(undefined, undefined, onChange);

    await userEvent.click(screen.getByText('Group by'));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'tag1' }));

    expect(onChange).toHaveBeenCalledWith({
      aggregateFunction: 'average',
      groupByKeys: [{ groupByData: 'tag1', mode: 'tag' }],
    });
  });

  test('selects group by parameter option', async () => {
    const onChange = jest.fn();
    renderComponent(undefined, undefined, onChange);

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'param2' }));

    expect(onChange).toHaveBeenCalledWith({
      aggregateFunction: 'average',
      groupByKeys: [{ groupByData: 'param2', mode: 'param' }],
    });
  });

  test('selects group by dataset option', async () => {
    const onChange = jest.fn();
    renderComponent(undefined, undefined, onChange);

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Dataset' }));

    expect(onChange).toHaveBeenCalledWith({
      aggregateFunction: 'average',
      groupByKeys: [{ groupByData: 'dataset', mode: 'dataset' }],
    });
  });

  test('changes aggregation function', async () => {
    const onChange = jest.fn();
    renderComponent('param.min.param1', undefined, onChange);

    await userEvent.click(screen.getByRole('button', { name: /^Group by:/ }));
    await userEvent.click(screen.getByLabelText('Change aggregation function'));
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Maximum' }));

    expect(onChange).toHaveBeenLastCalledWith({
      aggregateFunction: 'max',
      groupByKeys: [{ groupByData: 'param1', mode: 'param' }],
    });

    await userEvent.click(screen.getByLabelText('Change aggregation function'));
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Average' }));

    expect(onChange).toHaveBeenLastCalledWith({
      aggregateFunction: 'average',
      groupByKeys: [{ groupByData: 'param1', mode: 'param' }],
    });
  });

  test('filters by param name', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.type(screen.getByRole('textbox'), 'param2');

    expect(screen.queryByRole('menuitemcheckbox', { name: 'param2' })).toBeInTheDocument();

    expect(screen.queryByRole('menuitemcheckbox', { name: 'Dataset' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitemcheckbox', { name: 'param1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitemcheckbox', { name: 'tag1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitemcheckbox', { name: 'tag2' })).not.toBeInTheDocument();
  });

  test('cannot change aggregation function when grouping is disabled', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.click(screen.getByLabelText('Change aggregation function'));

    expect(screen.getByRole('menuitemradio', { name: 'Maximum' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Minimum' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Average' })).toHaveAttribute('aria-disabled', 'true');
  });

  test('selects multiple group by keys and remove them one by one', async () => {
    const onChange = jest.fn();
    renderComponent(undefined, undefined, onChange);

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Dataset' }));

    expect(onChange).toHaveBeenCalledWith({
      aggregateFunction: 'average',
      groupByKeys: [{ groupByData: 'dataset', mode: 'dataset' }],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'tag1' }));

    expect(onChange).toHaveBeenLastCalledWith({
      aggregateFunction: 'average',
      groupByKeys: [
        { groupByData: 'dataset', mode: 'dataset' },
        { groupByData: 'tag1', mode: 'tag' },
      ],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'param2' }));

    expect(onChange).toHaveBeenLastCalledWith({
      aggregateFunction: 'average',
      groupByKeys: [
        { groupByData: 'dataset', mode: 'dataset' },
        { groupByData: 'tag1', mode: 'tag' },
        { groupByData: 'param2', mode: 'param' },
      ],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'tag1' }));

    expect(onChange).toHaveBeenLastCalledWith({
      aggregateFunction: 'average',
      groupByKeys: [
        { groupByData: 'dataset', mode: 'dataset' },
        { groupByData: 'param2', mode: 'param' },
      ],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Dataset' }));

    expect(onChange).toHaveBeenLastCalledWith({
      aggregateFunction: 'average',
      groupByKeys: [{ groupByData: 'param2', mode: 'param' }],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group by/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'param2' }));

    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsGroupBySelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsGroupBySelector.tsx
Signals: React

```typescript
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import {
  Button,
  ChevronDownIcon,
  DropdownMenu,
  GearIcon,
  Input,
  ListBorderIcon,
  SearchIcon,
  Spinner,
  Tag,
  Tooltip,
  XCircleFillIcon,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { compact, isEmpty, isString, keys, uniq, values } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MLFLOW_INTERNAL_PREFIX } from '../../../../../common/utils/TagUtils';
import type { RunsGroupByConfig } from '../../utils/experimentPage.group-row-utils';
import { createRunsGroupByKey, isGroupedBy, normalizeRunsGroupByKey } from '../../utils/experimentPage.group-row-utils';
import type { ExperimentRunsSelectorResult } from '../../utils/experimentRuns.selector';
import { RunGroupingAggregateFunction, RunGroupingMode } from '../../utils/experimentPage.row-types';

export interface ExperimentViewRunsGroupBySelectorProps {
  runsData: ExperimentRunsSelectorResult;
  groupBy: RunsGroupByConfig | null | string;
  onChange: (newGroupByConfig: RunsGroupByConfig | null) => void;
  useGroupedValuesInCharts?: boolean;
  onUseGroupedValuesInChartsChange: (newValue: boolean) => void;
}

const messages = defineMessages({
  minimum: {
    defaultMessage: 'Minimum',
    description: 'Experiment page > group by runs control > minimum aggregate function',
  },
  maximum: {
    defaultMessage: 'Maximum',
    description: 'Experiment page > group by runs control > maximum aggregate function',
  },
  average: {
    defaultMessage: 'Average',
    description: 'Experiment page > group by runs control > average aggregate function',
  },
  attributes: {
    defaultMessage: 'Attributes',
    description: 'Experiment page > group by runs control > attributes section label',
  },
  tags: {
    defaultMessage: 'Tags',
    description: 'Experiment page > group by runs control > tags section label',
  },
  params: {
    defaultMessage: 'Params',
    description: 'Experiment page > group by runs control > params section label',
  },
  dataset: {
    defaultMessage: 'Dataset',
    description: 'Experiment page > group by runs control > group by dataset',
  },
  noParams: {
    defaultMessage: 'No params',
    description: 'Experiment page > group by runs control > no params to group by',
  },
  noTags: {
    defaultMessage: 'No tags',
    description: 'Experiment page > group by runs control > no tags to group by',
  },
  aggregationTooltip: {
    defaultMessage: 'Aggregation: {value}',
    description: 'Experiment page > group by runs control > current aggregation function tooltip',
  },
  noResults: {
    defaultMessage: 'No results',
    description: 'Experiment page > group by runs control > no results after filtering by search query',
  },
});

const GroupBySelectorBody = ({
  runsData,
  onChange,
  groupBy,
  useGroupedValuesInCharts,
  onUseGroupedValuesInChartsChange,
}: {
  groupBy: RunsGroupByConfig;
  useGroupedValuesInCharts?: boolean;
  onChange: (newGroupBy: RunsGroupByConfig | null) => void;
  onUseGroupedValuesInChartsChange: (newValue: boolean) => void;
  runsData: ExperimentRunsSelectorResult;
}) => {
  const intl = useIntl();
  const attributeElementRef = useRef<HTMLDivElement>(null);
  const tagElementRef = useRef<HTMLDivElement>(null);
  const paramElementRef = useRef<HTMLDivElement>(null);
  const inputElementRef = useRef<any>(null);

  const minimumLabel = intl.formatMessage(messages.minimum);
  const maximumLabel = intl.formatMessage(messages.maximum);
  const averageLabel = intl.formatMessage(messages.average);
  const datasetLabel = intl.formatMessage(messages.dataset);

  const tagNames = useMemo(
    () =>
      uniq(
        values(runsData.tagsList).flatMap((runTags) =>
          keys(runTags).filter((tagKey) => !tagKey.startsWith(MLFLOW_INTERNAL_PREFIX)),
        ),
      ),
    [runsData.tagsList],
  );
  const { aggregateFunction = RunGroupingAggregateFunction.Average, groupByKeys = [] } = groupBy || {};

  const currentAggregateFunctionLabel = {
    min: minimumLabel,
    max: maximumLabel,
    average: averageLabel,
  }[aggregateFunction];

  const { theme } = useDesignSystemTheme();
  const [filter, setFilter] = useState('');

  // Autofocus won't work everywhere so let's focus input everytime the dropdown is opened
  useEffect(() => {
    requestAnimationFrame(() => {
      inputElementRef.current?.focus();
    });
  }, []);

  const filteredTagNames = tagNames.filter((tag) => tag.toLowerCase().includes(filter.toLowerCase()));
  const filteredParamNames = runsData.paramKeyList.filter((param) =>
    param.toLowerCase().includes(filter.toLowerCase()),
  );
  const containsDatasets = useMemo(() => !isEmpty(compact(runsData.datasetsList)), [runsData.datasetsList]);
  const attributesMatchFilter = containsDatasets && datasetLabel.toLowerCase().includes(filter.toLowerCase());

  const hasAnyResults = filteredTagNames.length > 0 || filteredParamNames.length > 0 || attributesMatchFilter;

  const groupByToggle = useCallback(
    (mode: RunGroupingMode, groupByData: string, checked: boolean) => {
      if (checked) {
        // Scenario #1: user selected new grouping key
        const newGroupByKeys = [...groupByKeys];

        // If the key is already present, we should not add it again
        if (!newGroupByKeys.some((key) => key.mode === mode && key.groupByData === groupByData)) {
          newGroupByKeys.push({ mode, groupByData });
        }

        onChange({
          aggregateFunction,
          groupByKeys: newGroupByKeys,
        });
      } else {
        // Scenario #2: user deselected a grouping key
        const newGroupByKeys = groupByKeys.filter((key) => !(key.mode === mode && key.groupByData === groupByData));

        // If no keys are left, we should reset the group by and set it to null
        if (!newGroupByKeys.length) {
          onChange(null);
          return;
        }
        onChange({
          aggregateFunction,
          groupByKeys: newGroupByKeys,
        });
      }
    },
    [aggregateFunction, groupByKeys, onChange],
  );

  const aggregateFunctionChanged = (aggregateFunctionString: string) => {
    if (values<string>(RunGroupingAggregateFunction).includes(aggregateFunctionString)) {
      const newFunction = aggregateFunctionString as RunGroupingAggregateFunction;
      const newGroupBy: RunsGroupByConfig = { ...groupBy, aggregateFunction: newFunction };
      onChange(newGroupBy);
    }
  };

  return (
    <>
      <div css={{ display: 'flex', gap: theme.spacing.xs, padding: theme.spacing.sm }}>
        <Input
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_191"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          prefix={<SearchIcon />}
          placeholder="Search"
          autoFocus
          ref={inputElementRef}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'Tab') {
              const firstItem = attributeElementRef.current || tagElementRef.current || paramElementRef.current;
              firstItem?.focus();
              return;
            }
            if (e.key !== 'Escape') {
              e.stopPropagation();
            }
          }}
        />
        <DropdownMenu.Root>
          <Tooltip
            componentId="mlflow.experiment-tracking.runs-group-selector.aggregation"
            side="right"
            content={
              <FormattedMessage
                {...messages.aggregationTooltip}
                values={{
                  value: currentAggregateFunctionLabel || aggregateFunction,
                }}
              />
            }
          >
            <DropdownMenu.Trigger asChild>
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_168"
                icon={<GearIcon />}
                css={{ minWidth: 32 }}
                aria-label="Change aggregation function"
              />
            </DropdownMenu.Trigger>
          </Tooltip>
          <DropdownMenu.Content align="start" side="right">
            <DropdownMenu.CheckboxItem
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_233"
              disabled={!groupByKeys.length}
              checked={useGroupedValuesInCharts}
              onCheckedChange={onUseGroupedValuesInChartsChange}
            >
              <DropdownMenu.ItemIndicator />
              Use grouping from the runs table in charts
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioGroup
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_244"
              value={aggregateFunction}
              onValueChange={aggregateFunctionChanged}
            >
              <DropdownMenu.RadioItem
                disabled={!groupByKeys.length}
                value={RunGroupingAggregateFunction.Min}
                key={RunGroupingAggregateFunction.Min}
              >
                <DropdownMenu.ItemIndicator />
                {minimumLabel}
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem
                disabled={!groupByKeys.length}
                value={RunGroupingAggregateFunction.Max}
                key={RunGroupingAggregateFunction.Max}
              >
                <DropdownMenu.ItemIndicator />
                {maximumLabel}
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem
                disabled={!groupByKeys.length}
                value={RunGroupingAggregateFunction.Average}
                key={RunGroupingAggregateFunction.Average}
              >
                <DropdownMenu.ItemIndicator />
                {averageLabel}
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <DropdownMenu.Group css={{ maxHeight: 400, overflowY: 'scroll' }}>
        {attributesMatchFilter && (
          <>
            <DropdownMenu.Label>
              <FormattedMessage {...messages.attributes} />
            </DropdownMenu.Label>
            {datasetLabel.toLowerCase().includes(filter.toLowerCase()) && (
              <DropdownMenu.CheckboxItem
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_280"
                checked={isGroupedBy(groupBy, RunGroupingMode.Dataset, 'dataset')}
                key={createRunsGroupByKey(RunGroupingMode.Dataset, 'dataset', aggregateFunction)}
                ref={attributeElementRef}
                onCheckedChange={(checked) => groupByToggle(RunGroupingMode.Dataset, 'dataset', checked)}
              >
                <DropdownMenu.ItemIndicator />
                {datasetLabel}
              </DropdownMenu.CheckboxItem>
            )}
            <DropdownMenu.Separator />
          </>
        )}
        {filteredTagNames.length > 0 && (
          <>
            <DropdownMenu.Label>
              <FormattedMessage {...messages.tags} />
            </DropdownMenu.Label>

            {filteredTagNames.map((tagName, index) => {
              const groupByKey = createRunsGroupByKey(RunGroupingMode.Tag, tagName, aggregateFunction);
              return (
                <DropdownMenu.CheckboxItem
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_302"
                  checked={isGroupedBy(groupBy, RunGroupingMode.Tag, tagName)}
                  key={groupByKey}
                  ref={index === 0 ? tagElementRef : undefined}
                  onCheckedChange={(checked) => groupByToggle(RunGroupingMode.Tag, tagName, checked)}
                >
                  <DropdownMenu.ItemIndicator />
                  {tagName}
                </DropdownMenu.CheckboxItem>
              );
            })}
            {!tagNames.length && (
              <DropdownMenu.Item
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_314"
                disabled
              >
                <DropdownMenu.ItemIndicator /> <FormattedMessage {...messages.noTags} />
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Separator />
          </>
        )}
        {filteredParamNames.length > 0 && (
          <>
            <DropdownMenu.Label>
              <FormattedMessage {...messages.params} />
            </DropdownMenu.Label>

            {filteredParamNames.map((paramName, index) => {
              const groupByKey = createRunsGroupByKey(RunGroupingMode.Param, paramName, aggregateFunction);
              return (
                <DropdownMenu.CheckboxItem
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_330"
                  checked={isGroupedBy(groupBy, RunGroupingMode.Param, paramName)}
                  key={groupByKey}
                  ref={index === 0 ? paramElementRef : undefined}
                  onCheckedChange={(checked) => groupByToggle(RunGroupingMode.Param, paramName, checked)}
                >
                  <DropdownMenu.ItemIndicator />
                  {paramName}
                </DropdownMenu.CheckboxItem>
              );
            })}
            {!runsData.paramKeyList.length && (
              <DropdownMenu.Item
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_342"
                disabled
              >
                <FormattedMessage {...messages.noParams} />
              </DropdownMenu.Item>
            )}
          </>
        )}
        {!hasAnyResults && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_349"
            disabled
          >
            <FormattedMessage {...messages.noResults} />
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Group>
    </>
  );
};

/**
 * A component displaying searchable "group by" selector
 */
export const ExperimentViewRunsGroupBySelector = React.memo(
  ({
    runsData,
    groupBy,
    isLoading,
    onChange,
    useGroupedValuesInCharts,
    onUseGroupedValuesInChartsChange,
  }: ExperimentViewRunsGroupBySelectorProps & {
    isLoading: boolean;
  }) => {
    const { theme } = useDesignSystemTheme();

    // In case we encounter deprecated string-based group by descriptor
    const normalizedGroupBy = normalizeRunsGroupByKey(groupBy) || {
      aggregateFunction: RunGroupingAggregateFunction.Average,
      groupByKeys: [],
    };

    const isGroupedBy = normalizedGroupBy && !isEmpty(normalizedGroupBy.groupByKeys);

    return (
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_306"
            icon={<ListBorderIcon />}
            style={{ display: 'flex', alignItems: 'center' }}
            data-testid="column-selection-dropdown"
            endIcon={<ChevronDownIcon />}
          >
            {isGroupedBy ? (
              <FormattedMessage
                defaultMessage="Group by: {value}"
                description="Experiment page > group by runs control > trigger button label > with value"
                values={{
                  value: normalizedGroupBy.groupByKeys[0].groupByData,
                  // value: mode === RunGroupingMode.Dataset ? intl.formatMessage(messages.dataset) : groupByData,
                }}
              />
            ) : (
              <FormattedMessage
                defaultMessage="Group by"
                description="Experiment page > group by runs control > trigger button label > empty"
              />
            )}
            {normalizedGroupBy.groupByKeys.length > 1 && (
              <Tag
                componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_426"
                css={{ marginLeft: 4, marginRight: 0 }}
              >
                +{normalizedGroupBy.groupByKeys.length - 1}
              </Tag>
            )}
            {groupBy && (
              <XCircleFillIcon
                aria-hidden="false"
                css={{
                  color: theme.colors.textPlaceholder,
                  fontSize: theme.typography.fontSizeSm,
                  marginLeft: theme.spacing.sm,

                  ':hover': {
                    color: theme.colors.actionTertiaryTextHover,
                  },
                }}
                role="button"
                onClick={() => {
                  onChange(null);
                }}
                onPointerDownCapture={(e) => {
                  // Prevents the dropdown from opening when clearing
                  e.stopPropagation();
                }}
              />
            )}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {isLoading ? (
            <DropdownMenu.Item componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunsgroupbyselector.tsx_436">
              <Spinner />
            </DropdownMenu.Item>
          ) : (
            <GroupBySelectorBody
              groupBy={normalizedGroupBy}
              onChange={onChange}
              runsData={runsData}
              onUseGroupedValuesInChartsChange={onUseGroupedValuesInChartsChange}
              useGroupedValuesInCharts={useGroupedValuesInCharts}
            />
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsSortSelectorV2.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsSortSelectorV2.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../../common/utils/TestUtils.react18';
import { ExperimentViewRunsSortSelectorV2 } from './ExperimentViewRunsSortSelectorV2';
import { DesignSystemProvider } from '@databricks/design-system';
import { MemoryRouter, useSearchParams } from '../../../../../common/utils/RoutingUtils';
import { IntlProvider } from 'react-intl';

const metricKeys = ['metric_alpha', 'metric_beta'];
const paramKeys = ['param_1', 'param_2', 'param_3'];

jest.mock('../../../../../common/utils/RoutingUtils', () => {
  const params = new URLSearchParams();
  const setSearchParamsMock = jest.fn((setter: (newParams: URLSearchParams) => URLSearchParams) => setter(params));
  return {
    ...jest.requireActual<typeof import('../../../../../common/utils/RoutingUtils')>(
      '../../../../../common/utils/RoutingUtils',
    ),
    useSearchParams: () => {
      return [params, setSearchParamsMock];
    },
  };
});

describe('ExperimentViewRunsSortSelectorV2', () => {
  let mockLatestParams = new URLSearchParams();

  const getCurrentSearchParams = () => Object.fromEntries(mockLatestParams.entries());

  const renderComponent = () => {
    const Component = () => {
      const [latestParams] = useSearchParams();
      mockLatestParams = latestParams;

      return (
        <ExperimentViewRunsSortSelectorV2
          metricKeys={metricKeys}
          paramKeys={paramKeys}
          orderByKey=""
          orderByAsc={false}
        />
      );
    };
    render(<Component />, {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <IntlProvider locale="en">
            <DesignSystemProvider>{children}</DesignSystemProvider>
          </IntlProvider>
        </MemoryRouter>
      ),
    });
  };

  beforeEach(() => {
    mockLatestParams = new URLSearchParams();
  });

  test('should change sort options', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: /Sort/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'metric_alpha' }));

    expect(getCurrentSearchParams()).toEqual(expect.objectContaining({ orderByKey: 'metrics.`metric_alpha`' }));

    await userEvent.click(screen.getByRole('button', { name: /Sort/ }));
    await userEvent.click(screen.getByLabelText('Sort ascending'));

    expect(getCurrentSearchParams()).toEqual(
      expect.objectContaining({
        orderByAsc: 'true',
        orderByKey: 'metrics.`metric_alpha`',
      }),
    );

    await userEvent.click(screen.getByRole('button', { name: /Sort/ }));
    await userEvent.click(screen.getByLabelText('Sort descending'));

    expect(getCurrentSearchParams()).toEqual(
      expect.objectContaining({
        orderByAsc: 'false',
        orderByKey: 'metrics.`metric_alpha`',
      }),
    );

    await userEvent.click(screen.getByRole('button', { name: /Sort/ }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'param_2' }));

    expect(getCurrentSearchParams()).toEqual(
      expect.objectContaining({
        orderByAsc: 'false',
        orderByKey: 'params.`param_2`',
      }),
    );
  });

  test('should search for parameter', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: /Sort/ }));
    await userEvent.type(screen.getByPlaceholderText('Search'), 'beta');
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'metric_beta' }));

    expect(getCurrentSearchParams()).toEqual(expect.objectContaining({ orderByKey: 'metrics.`metric_beta`' }));

    await userEvent.click(screen.getByRole('button', { name: /Sort/ }));
    await userEvent.type(screen.getByPlaceholderText('Search'), 'abc-xyz-foo-bar');
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````

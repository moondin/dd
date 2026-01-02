---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 624
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 624 of 991)

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

---[FILE: CategoricalAggregateChart.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/charts/CategoricalAggregateChart.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import React, { useMemo } from 'react';

import { Popover, type ThemeType } from '@databricks/design-system';
import type { IntlShape } from '@databricks/i18n';

import {
  type AssessmentAggregates,
  type AssessmentFilter,
  type AssessmentInfo,
  type AssessmentValueType,
} from '../../types';
import { ERROR_KEY, getBarChartData } from '../../utils/AggregationUtils';
import { getDisplayScore, getDisplayScoreChange } from '../../utils/DisplayUtils';

const MAX_VISIBLE_ITEMS = 4;

export const CategoricalAggregateChart = React.memo(
  ({
    theme,
    intl,
    assessmentInfo,
    assessmentAggregates,
    allAssessmentFilters,
    toggleAssessmentFilter,
    currentRunDisplayName,
    compareToRunDisplayName,
  }: {
    theme: ThemeType;
    intl: IntlShape;
    assessmentInfo: AssessmentInfo;
    assessmentAggregates: AssessmentAggregates;
    allAssessmentFilters: AssessmentFilter[];
    toggleAssessmentFilter: (
      assessmentName: string,
      filterValue: AssessmentValueType,
      run: string,
      filterType?: AssessmentFilter['filterType'],
    ) => void;
    currentRunDisplayName?: string;
    compareToRunDisplayName?: string;
  }) => {
    /** Bar data */
    const barChartData = useMemo(
      () =>
        getBarChartData(
          intl,
          theme,
          assessmentInfo,
          allAssessmentFilters,
          toggleAssessmentFilter,
          assessmentAggregates,
          currentRunDisplayName,
          compareToRunDisplayName,
        ),
      [
        intl,
        theme,
        assessmentInfo,
        allAssessmentFilters,
        toggleAssessmentFilter,
        assessmentAggregates,
        currentRunDisplayName,
        compareToRunDisplayName,
      ],
    );

    // Sort barChartData: most frequent first, ties resolved by original order, error and null entries at bottom
    const sortedBarChartData = useMemo(() => {
      // Keep original order for pass-fail and boolean assessments
      if (assessmentInfo.dtype === 'pass-fail' || assessmentInfo.dtype === 'boolean') {
        return barChartData;
      }

      return barChartData
        .map((item, originalIndex) => ({ ...item, originalIndex }))
        .sort((a, b) => {
          const aIsBottomEntry = a.name === 'null' || a.name === ERROR_KEY;
          const bIsBottomEntry = b.name === 'null' || b.name === ERROR_KEY;

          // Always put error and null entries at the bottom
          if (aIsBottomEntry && !bIsBottomEntry) return 1;
          if (bIsBottomEntry && !aIsBottomEntry) return -1;

          // Sort regular entries by frequency (current.value) in descending order
          if (!aIsBottomEntry && !bIsBottomEntry) {
            const valueComparison = (b.current?.value || 0) - (a.current?.value || 0);
            if (valueComparison !== 0) return valueComparison;
          }

          // Resolve ties by original order
          return a.originalIndex - b.originalIndex;
        });
    }, [barChartData, assessmentInfo]);

    // If there's more than MAX_VISIBLE_ITEMS, show a popover with the <MAX_VISIBLE_ITEMS>th item and the rest
    const visibleItems =
      sortedBarChartData.length > MAX_VISIBLE_ITEMS
        ? sortedBarChartData.slice(0, MAX_VISIBLE_ITEMS - 1)
        : sortedBarChartData;
    const hiddenItems =
      sortedBarChartData.length > MAX_VISIBLE_ITEMS ? sortedBarChartData.slice(MAX_VISIBLE_ITEMS - 1) : [];
    const hasMoreItems = hiddenItems.length > 0;

    const hoverBarColor = theme.colors.actionDefaultBackgroundHover;
    const selectedBarColor = theme.colors.actionDefaultBackgroundPress;

    return (
      <table>
        <tbody>
          {visibleItems.map((barData) => (
            <ChartRow
              key={barData.name}
              barData={barData}
              theme={theme}
              hoverBarColor={hoverBarColor}
              selectedBarColor={selectedBarColor}
              assessmentInfo={assessmentInfo}
            />
          ))}
          {hasMoreItems && (
            <tr>
              <td colSpan={2}>
                <Popover.Root componentId="categorical-aggregate-chart-more-items">
                  <Popover.Trigger asChild>
                    <div
                      css={{
                        cursor: 'pointer',
                        padding: `${theme.spacing.xs}px`,
                        color: theme.colors.actionLinkDefault,
                        fontSize: theme.typography.fontSizeSm,
                        fontWeight: 'normal',
                        ':hover': {
                          backgroundColor: hoverBarColor,
                        },
                        borderRadius: theme.general.borderRadiusBase,
                      }}
                    >
                      {intl.formatMessage(
                        {
                          defaultMessage: '+{count} more',
                          description:
                            'Message for the popover trigger to show more items in the categorical aggregate chart.',
                        },
                        { count: hiddenItems.length },
                      )}
                    </div>
                  </Popover.Trigger>
                  <Popover.Content
                    align="start"
                    side="bottom"
                    css={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      width: '200px',
                      minWidth: '200px',
                    }}
                  >
                    <table>
                      <tbody>
                        {hiddenItems.map((barData) => (
                          <ChartRow
                            key={barData.name}
                            barData={barData}
                            theme={theme}
                            hoverBarColor={hoverBarColor}
                            selectedBarColor={selectedBarColor}
                            assessmentInfo={assessmentInfo}
                          />
                        ))}
                      </tbody>
                    </table>
                  </Popover.Content>
                </Popover.Root>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  },
);

const ChartRow = ({
  barData,
  theme,
  hoverBarColor,
  selectedBarColor,
  assessmentInfo,
}: {
  barData: any;
  theme: ThemeType;
  hoverBarColor: string;
  selectedBarColor: string;
  assessmentInfo: AssessmentInfo;
}) => {
  const isError = barData.name === ERROR_KEY;
  const isNull = barData.name === 'null';

  if (isError || isNull) {
    return (
      <tr
        key={barData.name}
        css={{
          cursor: 'pointer',
          ':hover': {
            backgroundColor: hoverBarColor,
          },
          color: isError ? theme.colors.textValidationWarning : theme.colors.textSecondary,
          fontWeight: 'normal',
          fontSize: theme.typography.fontSizeSm,
        }}
        onClick={barData.current.toggleFilter}
      >
        <td
          css={{
            width: '100%',
            borderTopLeftRadius: theme.general.borderRadiusBase,
            borderBottomLeftRadius: theme.general.borderRadiusBase,
            backgroundColor: `${barData.current.isSelected ? selectedBarColor : ''}`,
            paddingLeft: theme.spacing.xs,
            paddingTop: theme.spacing.xs,
            paddingBottom: theme.spacing.xs,
            fontStyle: barData.name === ERROR_KEY ? 'normal' : 'italic',
          }}
        >
          <span
            css={{
              lineHeight: `${theme.typography.fontSizeSm}px`,
            }}
          >
            {barData.name}
          </span>
        </td>
        <td
          css={{
            textAlign: 'right',
            verticalAlign: 'center',
            borderTopRightRadius: theme.general.borderRadiusBase,
            borderBottomRightRadius: theme.general.borderRadiusBase,
            backgroundColor: `${barData.current.isSelected ? selectedBarColor : ''}`,
            paddingRight: theme.spacing.xs,
            paddingTop: theme.spacing.xs,
            paddingBottom: theme.spacing.xs,
            fontStyle: 'normal',
          }}
        >
          <span
            css={{
              display: 'inline-block',
              verticalAlign: 'center',
              lineHeight: `${theme.typography.fontSizeSm}px`,
            }}
          >
            {!isNil(barData.scoreChange)
              ? getDisplayScoreChange(assessmentInfo, barData.scoreChange, false)
              : barData.current.value}
          </span>
        </td>
      </tr>
    );
  }

  return (
    <tr
      key={barData.name}
      css={{
        cursor: 'pointer',
        ':hover': {
          backgroundColor: hoverBarColor,
        },
      }}
      onClick={barData.current.toggleFilter}
    >
      <td
        css={{
          width: '100%',
          borderTopLeftRadius: theme.general.borderRadiusBase,
          borderBottomLeftRadius: theme.general.borderRadiusBase,
          backgroundColor: `${barData.current.isSelected ? selectedBarColor : ''}`,
          paddingLeft: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.xs,
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            width: '100%',
          }}
        >
          <span
            css={{
              fontWeight: 'normal',
              fontSize: '10px',
              lineHeight: '10px',

              color: theme.colors.textSecondary,
            }}
          >
            {barData.name}
          </span>
          <div
            css={{
              flex: 1,
              width: '100%',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: barData.current.value > 0 ? `${barData.current.fraction * 100}%` : '2px',
                borderRadius: '2px',
              }}
              css={{
                position: 'relative',
                // Allow shrinking for other items with minWidth.
                flexShrink: 1,
                transition: 'width 0.3s',
                backgroundColor: barData.backgroundColor,
                height: '10px',
                display: 'flex',

                alignItems: 'center',
              }}
            />
          </div>
        </div>
      </td>
      <td
        css={{
          textAlign: 'right',
          verticalAlign: 'bottom',
          borderTopRightRadius: theme.general.borderRadiusBase,
          borderBottomRightRadius: theme.general.borderRadiusBase,
          backgroundColor: `${barData.current.isSelected ? selectedBarColor : ''}`,
          paddingRight: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.xs,
        }}
      >
        <span
          css={{
            color: theme.colors.textSecondary,
            fontWeight: 'normal',
            fontSize: theme.typography.fontSizeSm,
            display: 'inline-block',
            verticalAlign: 'bottom',
            lineHeight: `${theme.typography.fontSizeSm}px`,
          }}
        >
          {!isNil(barData.scoreChange)
            ? getDisplayScoreChange(assessmentInfo, barData.scoreChange)
            : getDisplayScore(assessmentInfo, barData.current.fraction)}
        </span>
      </td>
    </tr>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: NumericAggregateChart.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/charts/NumericAggregateChart.tsx
Signals: React

```typescript
import React from 'react';

import { HoverCard, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import type { NumericAggregate } from '../../types';
import { displayFloat } from '../../utils/DisplayUtils';

export const NumericAggregateChart = React.memo(({ numericAggregate }: { numericAggregate: NumericAggregate }) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        {numericAggregate.counts.map((count, index) => (
          <HoverCard
            key={'hover-card-' + index}
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
                  }}
                >
                  <div
                    css={{
                      width: '25%',
                    }}
                  >
                    <Typography.Text>
                      {intl.formatMessage({
                        defaultMessage: 'Range',
                        description: 'Label for the range in the tooltip for the numeric aggregate chart.',
                      })}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text color="secondary">
                      {displayFloat(count.lower, 2) === displayFloat(count.upper, 2)
                        ? displayFloat(count.lower, 2)
                        : `${displayFloat(count.lower, 2)} - ${displayFloat(count.upper, 2)}`}
                    </Typography.Text>
                  </div>
                </div>
                <div
                  css={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div
                    css={{
                      width: '25%',
                    }}
                  >
                    <Typography.Text>
                      {intl.formatMessage({
                        defaultMessage: 'Count',
                        description: 'Label for the count in the tooltip for the numeric aggregate chart.',
                      })}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text color="secondary">{count.count}</Typography.Text>
                  </div>
                </div>
              </div>
            }
            trigger={
              <div
                key={'bar-' + index}
                css={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'column-reverse',
                  height: '60px',
                  width: '10px',
                  ':hover': {
                    backgroundColor: theme.colors.actionDefaultBackgroundHover,
                  },
                }}
              >
                <div
                  css={{
                    height: `${(count.count / numericAggregate.maxCount) * 100}%`,
                    minHeight: '1px',
                    width: '80%',
                    verticalAlign: 'bottom',
                    backgroundColor: theme.colors.blue400,
                    borderTopRightRadius: theme.general.borderRadiusBase,
                    borderTopLeftRadius: theme.general.borderRadiusBase,
                  }}
                />
              </div>
            }
          />
        ))}
      </div>
      {numericAggregate.min === numericAggregate.max ? (
        <div
          css={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            fontWeight: 'normal',
            fontSize: theme.typography.fontSizeSm,
            color: theme.colors.textSecondary,
          }}
        >
          {displayFloat(numericAggregate.min, 2)}
        </div>
      ) : (
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            fontWeight: 'normal',
            fontSize: theme.typography.fontSizeSm,
            color: theme.colors.textSecondary,
          }}
        >
          <div>{displayFloat(numericAggregate.min, 2)}</div>
          <div>{displayFloat(numericAggregate.max, 2)}</div>
        </div>
      )}
    </div>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: TableFilterItem.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/filters/TableFilterItem.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import {
  Button,
  useDesignSystemTheme,
  FormUI,
  SimpleSelect,
  SimpleSelectOption,
  CloseSmallIcon,
  Input,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { TableFilterItemTypeahead } from './TableFilterItemTypeahead';
import { TableFilterItemValueInput } from './TableFilterItemValueInput';
import {
  EXECUTION_DURATION_COLUMN_ID,
  STATE_COLUMN_ID,
  TRACE_NAME_COLUMN_ID,
  USER_COLUMN_ID,
  RUN_NAME_COLUMN_ID,
  LOGGED_MODEL_COLUMN_ID,
  LINKED_PROMPTS_COLUMN_ID,
  SOURCE_COLUMN_ID,
  CUSTOM_METADATA_COLUMN_ID,
  SPAN_NAME_COLUMN_ID,
  SPAN_TYPE_COLUMN_ID,
  SPAN_CONTENT_COLUMN_ID,
} from '../../hooks/useTableColumns';
import { FilterOperator, TracesTableColumnGroup, TracesTableColumnGroupToLabelMap } from '../../types';
import type {
  AssessmentInfo,
  TableFilter,
  TableFilterOption,
  TableFilterOptions,
  TracesTableColumn,
} from '../../types';

const FILTERABLE_INFO_COLUMNS = [
  EXECUTION_DURATION_COLUMN_ID,
  STATE_COLUMN_ID,
  TRACE_NAME_COLUMN_ID,
  USER_COLUMN_ID,
  RUN_NAME_COLUMN_ID,
  LOGGED_MODEL_COLUMN_ID,
  LINKED_PROMPTS_COLUMN_ID,
  SOURCE_COLUMN_ID,
];

const getAvailableOperators = (column: string, key?: string): FilterOperator[] => {
  if (column === EXECUTION_DURATION_COLUMN_ID) {
    return [
      FilterOperator.EQUALS,
      FilterOperator.NOT_EQUALS,
      FilterOperator.GREATER_THAN,
      FilterOperator.LESS_THAN,
      FilterOperator.GREATER_THAN_OR_EQUALS,
      FilterOperator.LESS_THAN_OR_EQUALS,
    ];
  }

  if (column === SPAN_NAME_COLUMN_ID || column === SPAN_TYPE_COLUMN_ID) {
    return [FilterOperator.EQUALS, FilterOperator.NOT_EQUALS, FilterOperator.CONTAINS];
  }

  if (column === SPAN_CONTENT_COLUMN_ID) {
    return [FilterOperator.CONTAINS];
  }

  return [FilterOperator.EQUALS];
};

export const TableFilterItem = ({
  tableFilter,
  index,
  onChange,
  onDelete,
  assessmentInfos,
  experimentId,
  tableFilterOptions,
  allColumns,
  usesV4APIs,
}: {
  tableFilter: TableFilter;
  index: number;
  onChange: (filter: TableFilter, index: number) => void;
  onDelete: () => void;
  assessmentInfos: AssessmentInfo[];
  experimentId: string;
  tableFilterOptions: TableFilterOptions;
  allColumns: TracesTableColumn[];
  usesV4APIs?: boolean;
}) => {
  const { column, operator, key } = tableFilter;
  const { theme } = useDesignSystemTheme();

  // For now, we don't support filtering on numeric values.
  const assessmentKeyOptions: TableFilterOption[] = useMemo(
    () =>
      assessmentInfos
        .filter((assessment) => assessment.dtype !== 'numeric')
        .map((assessment) => ({ value: assessment.name, renderValue: () => assessment.displayName })),
    [assessmentInfos],
  );

  const columnOptions: TableFilterOption[] = useMemo(() => {
    const result = allColumns
      .filter(
        (column) => FILTERABLE_INFO_COLUMNS.includes(column.id) || column.id.startsWith(CUSTOM_METADATA_COLUMN_ID),
      )
      .map((column) => ({ value: column.id, renderValue: () => column.filterLabel ?? column.label }));

    // Add the tag and assessment column groups
    result.push(
      {
        value: TracesTableColumnGroup.TAG,
        renderValue: () => TracesTableColumnGroupToLabelMap[TracesTableColumnGroup.TAG],
      },
      {
        value: TracesTableColumnGroup.ASSESSMENT,
        renderValue: () => TracesTableColumnGroupToLabelMap[TracesTableColumnGroup.ASSESSMENT],
      },
    );

    // Add individual span filter options
    if (usesV4APIs) {
      result.push(
        // TODO: Added via UI sync, but doesn't work in databricks yet. Uncomment
        // these when the search API supports them
        { value: SPAN_CONTENT_COLUMN_ID, renderValue: () => 'Span content' },
        { value: SPAN_NAME_COLUMN_ID, renderValue: () => 'Span name' },
        { value: SPAN_TYPE_COLUMN_ID, renderValue: () => 'Span type' },
      );
    }

    return result;
  }, [allColumns, usesV4APIs]);

  return (
    <>
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing.sm,
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FormUI.Label htmlFor={`filter-column-${index}`}>
            <FormattedMessage
              defaultMessage="Field"
              description="Label for the column field in the GenAI Traces Table Filter form"
            />
          </FormUI.Label>
          <TableFilterItemTypeahead
            id={`filter-column-${index}`}
            item={columnOptions.find((item) => item.value === column)}
            options={columnOptions}
            onChange={(value: string) => {
              if (value !== column) {
                const defaultOperator = getAvailableOperators(value)[0];
                onChange({ column: value, operator: defaultOperator, value: '' }, index);
              }
            }}
            placeholder="Select column"
            width={180}
            canSearchCustomValue={false}
          />
        </div>
        {column === TracesTableColumnGroup.ASSESSMENT && (
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <FormUI.Label htmlFor={`filter-key-${index}`}>
              <FormattedMessage
                defaultMessage="Name"
                description="Label for the name field for assessments in the GenAI Traces Table Filter form"
              />
            </FormUI.Label>
            <TableFilterItemTypeahead
              id={`filter-key-${index}`}
              item={assessmentKeyOptions.find((item) => item.value === key)}
              options={assessmentKeyOptions}
              onChange={(value: string) => {
                onChange({ ...tableFilter, key: value }, index);
              }}
              placeholder="Select name"
              width={200}
              canSearchCustomValue={false}
            />
          </div>
        )}
        {column === TracesTableColumnGroup.TAG && (
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <FormUI.Label htmlFor={`filter-key-${index}`}>
              <FormattedMessage
                defaultMessage="Key"
                description="Label for the key field for tags in the GenAI Traces Table Filter form"
              />
            </FormUI.Label>
            <Input
              aria-label="Key"
              componentId="mlflow.evaluations_review.table_ui.filter_key"
              id={'filter-key-' + index}
              type="text"
              css={{ width: 200 }}
              placeholder={column === TracesTableColumnGroup.TAG ? 'Key' : 'Name'}
              value={key}
              onChange={(e) => {
                onChange({ ...tableFilter, key: e.target.value }, index);
              }}
            />
          </div>
        )}
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FormUI.Label htmlFor={`filter-operator-${index}`}>
            <FormattedMessage
              defaultMessage="Operator"
              description="Label for the operator field in the GenAI Traces Table Filter form"
            />
          </FormUI.Label>
          {(() => {
            const isOperatorSelectorDisabled = column !== '' && getAvailableOperators(column, key).length === 1;
            return (
              <SimpleSelect
                aria-label="Operator"
                componentId="mlflow.evaluations_review.table_ui.filter_operator"
                id={'filter-operator-' + index}
                placeholder="Select"
                width={120}
                contentProps={{
                  // Set the z-index to be higher than the Popover
                  style: { zIndex: theme.options.zIndexBase + 100 },
                }}
                value={!isOperatorSelectorDisabled ? operator : getAvailableOperators(column, key)[0]}
                disabled={isOperatorSelectorDisabled}
                onChange={(e) => {
                  onChange({ ...tableFilter, operator: e.target.value as FilterOperator }, index);
                }}
              >
                {getAvailableOperators(column, key).map((op) => (
                  <SimpleSelectOption key={op} value={op}>
                    {op}
                  </SimpleSelectOption>
                ))}
              </SimpleSelect>
            );
          })()}
        </div>
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FormUI.Label htmlFor={`filter-value-${index}`}>
            <FormattedMessage
              defaultMessage="Value"
              description="Label for the value field in the GenAI Traces Table Filter form"
            />
          </FormUI.Label>
          <TableFilterItemValueInput
            index={index}
            tableFilter={tableFilter}
            assessmentInfos={assessmentInfos}
            onChange={onChange}
            experimentId={experimentId}
            tableFilterOptions={tableFilterOptions}
          />
        </div>
        <div
          css={{
            alignSelf: 'flex-end',
          }}
        >
          <Button
            componentId="mlflow.evaluations_review.table_ui.filter_delete_button"
            type="tertiary"
            icon={<CloseSmallIcon />}
            onClick={onDelete}
          />
        </div>
      </div>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TableFilterItemTypeahead.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/filters/TableFilterItemTypeahead.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';

import {
  useDesignSystemTheme,
  DialogComboboxOptionListSelectItem,
  DialogComboboxOptionListSearch,
  DialogComboboxContent,
  DialogComboboxTrigger,
  DialogComboboxOptionList,
  DialogCombobox,
} from '@databricks/design-system';

import type { TableFilterOption } from '../../types';

interface SimpleQuery<T> {
  data?: T;
  isLoading?: boolean;
}

export const TableFilterItemTypeahead = ({
  id,
  item,
  options,
  query,
  onChange,
  placeholder,
  width,
  canSearchCustomValue,
}: {
  id: string;
  item?: TableFilterOption;
  options?: TableFilterOption[];
  query?: SimpleQuery<TableFilterOption[]>;
  onChange: (value: string) => void;
  placeholder: string;
  width: number;
  canSearchCustomValue: boolean;
}) => {
  const { theme } = useDesignSystemTheme();

  const [searchValue, setSearchValue] = useState<string>('');

  const displayOptions = useMemo(() => query?.data ?? options ?? [], [query?.data, options]);
  const optionValues = useMemo(() => displayOptions.map((option) => option.value), [displayOptions]);

  return (
    <DialogCombobox
      componentId="mlflow.evaluations_review.table_ui.filter_column"
      value={item?.value ? [item.value] : []}
      id={id}
    >
      <DialogComboboxTrigger
        withInlineLabel={false}
        placeholder={placeholder}
        renderDisplayedValue={() => item?.renderValue() ?? ''}
        width={width}
        allowClear={false}
      />
      <DialogComboboxContent
        width={width}
        style={{ zIndex: theme.options.zIndexBase + 100 }}
        loading={query?.isLoading}
      >
        <DialogComboboxOptionList>
          <DialogComboboxOptionListSearch onSearch={(value: string) => setSearchValue(value)}>
            {displayOptions.map((option) => (
              <DialogComboboxOptionListSelectItem
                key={option.value}
                value={option.value}
                onChange={onChange}
                checked={option.value === item?.value}
                css={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {option.renderValue()}
              </DialogComboboxOptionListSelectItem>
            ))}
            {/* Currently there's no use case for searching custom values. Eventually we might need it
                  for tags. */}
            {canSearchCustomValue && searchValue && !optionValues.includes(searchValue) ? (
              <DialogComboboxOptionListSelectItem
                key={searchValue}
                value={searchValue}
                onChange={onChange}
                checked={searchValue === item?.value}
                css={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Use "{searchValue}"
              </DialogComboboxOptionListSelectItem>
            ) : null}
          </DialogComboboxOptionListSearch>
        </DialogComboboxOptionList>
      </DialogComboboxContent>
    </DialogCombobox>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TableFilterItemValueInput.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/filters/TableFilterItemValueInput.tsx
Signals: React

```typescript
import { useCallback, useState, useMemo } from 'react';

import { useDesignSystemTheme, Input } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import { TableFilterItemTypeahead } from './TableFilterItemTypeahead';
import { ExperimentViewTracesStatusLabels } from '../../cellRenderers/StatusRenderer';
import {
  assessmentValueToSerializedString,
  serializedStringToAssessmentValueV2,
} from '../../hooks/useAssessmentFilters';
import { ERROR_KEY } from '../../utils/AggregationUtils';
import { useExperimentVersionsQuery } from '../../hooks/useExperimentVersionsQuery';
import { useGenAiExperimentRunsForComparison } from '../../hooks/useGenAiExperimentRunsForComparison';
import {
  EXECUTION_DURATION_COLUMN_ID,
  STATE_COLUMN_ID,
  RUN_NAME_COLUMN_ID,
  LOGGED_MODEL_COLUMN_ID,
  LINKED_PROMPTS_COLUMN_ID,
  SOURCE_COLUMN_ID,
} from '../../hooks/useTableColumns';
import { TracesTableColumnGroup } from '../../types';
import type { AssessmentInfo, TableFilter, TableFilterOption, TableFilterOptions } from '../../types';
import { getAssessmentValueLabel } from '../GenAiEvaluationTracesReview.utils';

export const TableFilterItemValueInput = ({
  index,
  tableFilter,
  assessmentInfos,
  onChange,
  experimentId,
  tableFilterOptions,
}: {
  index: number;
  tableFilter: TableFilter;
  assessmentInfos: AssessmentInfo[];
  onChange: (tableFilter: TableFilter, index: number) => void;
  experimentId: string;
  tableFilterOptions: TableFilterOptions;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const id = `filter-value-${index}`;

  const [localValue, setLocalValue] = useState(tableFilter.value);

  const onValueBlur = useCallback(() => {
    if (localValue !== tableFilter.value) {
      onChange({ ...tableFilter, value: localValue }, index);
    }
  }, [tableFilter, index, onChange, localValue]);

  // Fetch runs data when the run name column is selected
  const runsQuery = useGenAiExperimentRunsForComparison(experimentId);

  // Transform runs data into the format expected by TableFilterItemTypeahead
  const runNameQuery = useMemo(() => {
    const transformedData = runsQuery.runInfos
      ?.filter((run) => run.runUuid && run.runName)
      ?.map((run) => ({
        value: run.runUuid as string,
        renderValue: () => run.runName as string,
      }));

    return {
      data: transformedData,
      isLoading: runsQuery.isLoading,
    };
  }, [runsQuery]);

  // Fetch versions data when the version column is selected
  const versionsDataQuery = useExperimentVersionsQuery(experimentId);

  // Transform versions data into the format expected by TableFilterItemTypeahead
  const versionsQuery = useMemo(() => {
    const transformedData = versionsDataQuery.data?.map((loggedModel) => ({
      value: loggedModel.info.model_id,
      renderValue: () => loggedModel.info.name,
    }));

    return {
      data: transformedData,
      isLoading: versionsDataQuery.isLoading,
    };
  }, [versionsDataQuery]);

  const stateOptions: TableFilterOption[] = [
    { value: 'IN_PROGRESS', renderValue: () => intl.formatMessage(ExperimentViewTracesStatusLabels.IN_PROGRESS) },
    { value: 'OK', renderValue: () => intl.formatMessage(ExperimentViewTracesStatusLabels.OK) },
    { value: 'ERROR', renderValue: () => intl.formatMessage(ExperimentViewTracesStatusLabels.ERROR) },
  ];

  if (tableFilter.column === RUN_NAME_COLUMN_ID) {
    return (
      <TableFilterItemTypeahead
        id={id}
        item={runNameQuery.data?.find((item) => item.value === tableFilter.value)}
        query={runNameQuery}
        onChange={(value: string) => {
          onChange({ ...tableFilter, value }, index);
        }}
        placeholder="Select run"
        width={200}
        canSearchCustomValue={false}
      />
    );
  }

  if (tableFilter.column === LOGGED_MODEL_COLUMN_ID) {
    return (
      <TableFilterItemTypeahead
        id={id}
        item={versionsQuery.data?.find((item) => item.value === tableFilter.value)}
        query={versionsQuery}
        onChange={(value: string) => {
          onChange({ ...tableFilter, value }, index);
        }}
        placeholder="Select version"
        width={200}
        canSearchCustomValue={false}
      />
    );
  }

  if (tableFilter.column === TracesTableColumnGroup.ASSESSMENT) {
    const assessmentInfo = assessmentInfos.find((assessment) => assessment.name === tableFilter.key);
    if (assessmentInfo && assessmentInfo.dtype !== 'numeric' && assessmentInfo.dtype !== 'unknown') {
      const options: TableFilterOption[] = Array.from(assessmentInfo.uniqueValues.values()).map((value) => {
        return {
          value: assessmentValueToSerializedString(value),
          renderValue: () => getAssessmentValueLabel(intl, theme, assessmentInfo, value).content,
        };
      });

      // Add Error option when assessment contains errors, similar to how bar charts handle it
      if (assessmentInfo.containsErrors) {
        options.push({
          value: assessmentValueToSerializedString(ERROR_KEY),
          renderValue: () => getAssessmentValueLabel(intl, theme, assessmentInfo, ERROR_KEY).content,
        });
      }

      return (
        <TableFilterItemTypeahead
          id={id}
          item={options.find((item) => item.value === assessmentValueToSerializedString(tableFilter.value))}
          options={options}
          onChange={(value: string) => {
            onChange({ ...tableFilter, value: serializedStringToAssessmentValueV2(value) }, index);
          }}
          placeholder="Select"
          width={200}
          canSearchCustomValue={false}
        />
      );
    }
  }

  if (tableFilter.column === STATE_COLUMN_ID) {
    return (
      <TableFilterItemTypeahead
        id={id}
        item={stateOptions.find((item) => item.value === tableFilter.value)}
        options={stateOptions}
        onChange={(value: string) => {
          onChange({ ...tableFilter, value }, index);
        }}
        placeholder="Select"
        width={200}
        canSearchCustomValue={false}
      />
    );
  }

  if (tableFilter.column === SOURCE_COLUMN_ID) {
    const sourceOptions = tableFilterOptions.source;
    return (
      <TableFilterItemTypeahead
        id={id}
        item={sourceOptions.find((item) => item.value === tableFilter.value)}
        options={sourceOptions}
        onChange={(value: string) => {
          onChange({ ...tableFilter, value }, index);
        }}
        placeholder="Select source"
        width={200}
        canSearchCustomValue={false}
      />
    );
  }

  // Only available in OSS
  if (tableFilter.column === LINKED_PROMPTS_COLUMN_ID) {
    const promptOptions = tableFilterOptions.prompt || [];
    return (
      <TableFilterItemTypeahead
        id={id}
        item={promptOptions.find((item) => item.value === tableFilter.value)}
        options={promptOptions}
        onChange={(value: string) => {
          onChange({ ...tableFilter, value }, index);
        }}
        placeholder="Select prompt"
        width={200}
        canSearchCustomValue
      />
    );
  }

  return (
    <Input
      aria-label="Value"
      componentId="mlflow.evaluations_review.table_ui.filter_value"
      id={id}
      placeholder={tableFilter.column === EXECUTION_DURATION_COLUMN_ID ? 'Time in milliseconds' : 'Value'}
      type={tableFilter.column === EXECUTION_DURATION_COLUMN_ID ? 'number' : 'text'}
      value={localValue as string}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
      onBlur={onValueBlur}
      css={{ width: 200 }}
      // Disable it for assessment column at this point, since the data type is not supported yet.
      disabled={tableFilter.column === TracesTableColumnGroup.ASSESSMENT}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useActiveEvaluation.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useActiveEvaluation.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';

import { useActiveEvaluation } from './useActiveEvaluation';
import { useSearchParams } from '../utils/RoutingUtils';

jest.mock('../utils/RoutingUtils', () => ({
  useSearchParams: jest.fn(),
}));

describe('useActiveEvaluation', () => {
  let mockSearchParams = new URLSearchParams();
  const mockSetSearchParams = jest.fn((setter) => {
    // @ts-expect-error 'setter' is of type 'unknown'
    mockSearchParams = setter(mockSearchParams);
  });

  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    jest.clearAllMocks();
    jest.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
  });

  test('should return selectedEvaluationId', () => {
    jest
      .mocked(useSearchParams)
      .mockReturnValue([new URLSearchParams({ selectedEvaluationId: 'some-eval-id' }), mockSetSearchParams]);

    const {
      result: {
        current: [resultEvaluationId],
      },
    } = renderHook(() => useActiveEvaluation());

    expect(resultEvaluationId).toEqual('some-eval-id');
  });

  test('should set selectedEvaluationId to undefined', () => {
    const {
      result: {
        current: [, setSelectedEvaluationId],
      },
    } = renderHook(() => useActiveEvaluation());

    act(() => {
      setSelectedEvaluationId(undefined);
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSearchParams.get('selectedEvaluationId')).toBeNull();
  });

  test('should set selectedEvaluationId to a value', () => {
    const {
      result: {
        current: [, setSelectedEvaluationId],
      },
    } = renderHook(() => useActiveEvaluation());

    act(() => {
      setSelectedEvaluationId('another-eval-id');
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSearchParams.get('selectedEvaluationId')).toEqual('another-eval-id');
  });
});
```

--------------------------------------------------------------------------------

````

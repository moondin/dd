---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 617
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 617 of 991)

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

---[FILE: EvaluationsOverviewSortDropdown.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsOverviewSortDropdown.tsx
Signals: React

```typescript
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  Input,
  SearchIcon,
  useDesignSystemTheme,
  DropdownMenu,
  Button,
  ChevronDownIcon,
  SortUnsortedIcon,
  ToggleButton,
  Spinner,
  DangerIcon,
} from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import { sortGroupedColumns } from '../GenAiTracesTable.utils';
import { SESSION_COLUMN_ID, SORTABLE_INFO_COLUMNS } from '../hooks/useTableColumns';
import type { EvaluationsOverviewTableSort, AssessmentInfo, TracesTableColumn } from '../types';
import { TracesTableColumnType, TracesTableColumnGroup, TracesTableColumnGroupToLabelMap } from '../types';

export interface SortOption {
  label: string;
  key: string;
  type: TracesTableColumnType;
  group?: TracesTableColumnGroup;
}

export const EvaluationsOverviewSortDropdown = React.memo(
  ({
    tableSort,
    columns = [],
    onChange,
    enableGrouping,
    isMetadataLoading,
    metadataError,
  }: {
    tableSort: EvaluationsOverviewTableSort | undefined;
    columns: TracesTableColumn[];
    onChange: (sortOption: SortOption, orderByAsc: boolean) => void;
    enableGrouping?: boolean;
    isMetadataLoading?: boolean;
    metadataError?: Error | null;
  }) => {
    const intl = useIntl();
    const { theme } = useDesignSystemTheme();
    const [open, setOpen] = useState(false);

    const sortOptions = useMemo(() => {
      const sortOptions: SortOption[] = [];

      const assessmentLabelPrefix = intl.formatMessage({
        defaultMessage: 'Assessment',
        description: 'Evaluation review > evaluations list > assessment sort option label prefix',
      });

      if (enableGrouping) {
        const sortedColumns = sortGroupedColumns(columns);

        for (const column of sortedColumns) {
          if (column.type === TracesTableColumnType.ASSESSMENT) {
            const sortableAssessmentInfo = column.assessmentInfo as AssessmentInfo;
            const assessmentLabel = sortableAssessmentInfo.displayName;

            sortOptions.push({
              label: assessmentLabel,
              key: column.id,
              type: TracesTableColumnType.ASSESSMENT,
              group: TracesTableColumnGroup.ASSESSMENT,
            });
          } else if (column.type === TracesTableColumnType.INPUT) {
            sortOptions.push({
              label: column.label,
              key: column.id,
              type: TracesTableColumnType.INPUT,
              group: TracesTableColumnGroup.INFO,
            });
          } else if (column.type === TracesTableColumnType.TRACE_INFO) {
            const label =
              column.id === SESSION_COLUMN_ID
                ? intl.formatMessage({
                    defaultMessage: 'Session time',
                    description: 'Session time sort option label',
                  })
                : column.label;
            if (SORTABLE_INFO_COLUMNS.includes(column.id)) {
              sortOptions.push({
                label,
                key: column.id,
                type: TracesTableColumnType.TRACE_INFO,
                group: TracesTableColumnGroup.INFO,
              });
            }
          }
        }

        return sortOptions;
      }

      // First add assessments.
      for (const sortableAssessmentCol of columns.filter(
        (column) => column.type === TracesTableColumnType.ASSESSMENT,
      )) {
        const sortableAssessmentInfo = sortableAssessmentCol.assessmentInfo as AssessmentInfo;
        const assessmentLabel = sortableAssessmentInfo.displayName;
        sortOptions.push({
          label: `${assessmentLabelPrefix} ﹥ ${assessmentLabel}`,
          key: sortableAssessmentCol.id,
          type: TracesTableColumnType.ASSESSMENT,
        });
      }
      // Next add inputs.
      const inputLabelPrefix = intl.formatMessage({
        defaultMessage: 'Input',
        description: 'Evaluation review > evaluations list > input sort option label prefix',
      });
      for (const inputColumn of columns.filter((column) => column.type === TracesTableColumnType.INPUT)) {
        sortOptions.push({
          label: `${inputLabelPrefix} ﹥ ${inputColumn.label}`,
          key: inputColumn.id,
          type: TracesTableColumnType.INPUT,
        });
      }

      // Add info columns
      for (const infoColumn of columns.filter(
        (column) =>
          (column.type === TracesTableColumnType.TRACE_INFO ||
            column.type === TracesTableColumnType.INTERNAL_MONITOR_REQUEST_TIME) &&
          SORTABLE_INFO_COLUMNS.includes(column.id),
      )) {
        sortOptions.push({
          label: infoColumn.label,
          key: infoColumn.id,
          type: TracesTableColumnType.TRACE_INFO,
        });
      }

      return sortOptions;
    }, [columns, intl, enableGrouping]);

    // Generate the label for the sort select dropdown
    const currentSortSelectLabel = useMemo(() => {
      // Search through all sort options generated basing on the fetched runs
      const sortOption = sortOptions.find((option) => option.key === tableSort?.key);

      let sortOptionLabel = sortOption?.label;

      // If the actually chosen sort value is not found in the sort option list (e.g. because the list of fetched runs is empty),
      // use it to generate the label
      if (!sortOptionLabel) {
        // The following regex extracts plain sort key name from its canonical form, i.e.
        // metrics.`metric_key_name` => metric_key_name
        const extractedKeyName = tableSort?.key?.match(/^.+\.`(.+)`$/);
        if (extractedKeyName) {
          // eslint-disable-next-line prefer-destructuring
          sortOptionLabel = extractedKeyName[1];
        }
      }
      const sortMessage = intl.formatMessage({
        defaultMessage: 'Sort',
        description: 'Experiment page > sort selector > label for the dropdown button',
      });

      return !sortOptionLabel ? sortMessage : `${sortMessage}: ${sortOptionLabel}`;
    }, [sortOptions, intl, tableSort]);

    return (
      <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenu.Trigger data-testid="sort-select-dropdown" asChild>
          <Button
            componentId="mlflow.experiment_page.sort_select_v2.toggle"
            icon={tableSort ? tableSort.asc ? <SortAscendingIcon /> : <SortDescendingIcon /> : <SortUnsortedIcon />}
            css={{ minWidth: 32 }}
            aria-label={currentSortSelectLabel}
            endIcon={<ChevronDownIcon />}
          >
            {currentSortSelectLabel}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content minWidth={250}>
          {metadataError ? (
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.xs,
                padding: `${theme.spacing.md}px`,
                color: theme.colors.textValidationDanger,
              }}
              data-testid="filter-dropdown-error"
            >
              <DangerIcon />
              <FormattedMessage
                defaultMessage="Fetching traces failed"
                description="Error message for fetching traces failed"
              />
            </div>
          ) : isMetadataLoading ? (
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.xs,
                padding: `${theme.spacing.lg}px`,
                color: theme.colors.textSecondary,
              }}
              data-testid="sort-dropdown-loading"
            >
              <Spinner size="small" />
            </div>
          ) : enableGrouping ? (
            <EvaluationsOverviewSortDropdownBodyGrouped
              sortOptions={sortOptions}
              tableSort={tableSort}
              onOptionSelected={(sortOption, orderByAsc) => {
                onChange(sortOption, orderByAsc);
                setOpen(false);
              }}
            />
          ) : (
            <EvaluationsOverviewSortDropdownBody
              sortOptions={sortOptions}
              tableSort={tableSort}
              onOptionSelected={(sortOption, orderByAsc) => {
                onChange(sortOption, orderByAsc);
                setOpen(false);
              }}
            />
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
);

const EvaluationsOverviewSortDropdownBodyGrouped = ({
  sortOptions,
  tableSort,
  onOptionSelected,
}: {
  sortOptions: SortOption[];
  tableSort?: EvaluationsOverviewTableSort;
  onOptionSelected: (opt: SortOption, asc: boolean) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const inputRef = useRef<React.ComponentRef<typeof Input>>(null);
  const firstOptionRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<string>('');

  const filtered = useMemo(
    () => sortOptions.filter((opt) => opt.label.toLowerCase().includes(filter.toLowerCase())),
    [sortOptions, filter],
  );

  const grouped = useMemo(() => {
    const m: Record<string, SortOption[]> = {};
    filtered.forEach((opt) => {
      const grp = opt.group ?? TracesTableColumnGroup.INFO;
      if (!m[grp]) m[grp] = [];
      m[grp].push(opt);
    });
    return m;
  }, [filtered]);

  const handleChange = useCallback(
    (key: string) => {
      const opt = sortOptions.find((o) => o.key === key);
      if (!opt) return;
      onOptionSelected(opt, tableSort?.asc ?? true);
    },
    [onOptionSelected, sortOptions, tableSort?.asc],
  );

  const setOrder = useCallback(
    (asc: boolean) => {
      const opt = sortOptions.find((o) => o.key === tableSort?.key) ?? sortOptions[0];
      onOptionSelected(opt, asc);
    },
    [onOptionSelected, sortOptions, tableSort?.key],
  );

  // Autofocus won't work everywhere so let's focus input everytime the dropdown is opened
  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  return (
    <>
      <div
        css={{
          padding: `${theme.spacing.sm}px ${theme.spacing.lg / 2}px`,
          display: 'flex',
          gap: theme.spacing.xs,
        }}
      >
        <Input
          ref={inputRef}
          componentId="mlflow.genai_traces_table.sort_dropdown.search"
          prefix={<SearchIcon />}
          placeholder="Search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          type="search"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'Tab') {
              firstOptionRef.current?.focus();
              e.preventDefault();
            }
          }}
        />
        <div css={{ display: 'flex', gap: theme.spacing.xs }}>
          <ToggleButton
            pressed={tableSort?.asc === false}
            icon={<ArrowDownIcon />}
            componentId="mlflow.genai_traces_table.sort_dropdown.sort_desc"
            onClick={() => setOrder(false)}
            aria-label="Sort descending"
          />
          <ToggleButton
            pressed={tableSort?.asc === true}
            icon={<ArrowUpIcon />}
            componentId="mlflow.experiment_page.sort_dropdown.sort_asc"
            onClick={() => setOrder(true)}
            aria-label="Sort ascending"
          />
        </div>
      </div>

      <div css={{ maxHeight: 400, overflowY: 'auto', padding: `0 ${theme.spacing.sm}px` }}>
        {Object.entries(grouped).map(([groupName, opts], gi) => (
          <React.Fragment key={groupName}>
            <DropdownMenu.Group>
              <DropdownMenu.Label>
                {groupName === TracesTableColumnGroup.INFO
                  ? 'Attributes'
                  : TracesTableColumnGroupToLabelMap[groupName as TracesTableColumnGroup]}
              </DropdownMenu.Label>
              {opts.map((opt, idx) => (
                <DropdownMenu.CheckboxItem
                  componentId="mlflow.genai_traces_table.sort_dropdown.sort_option"
                  key={opt.key}
                  checked={opt.key === tableSort?.key}
                  onClick={() => handleChange(opt.key)}
                  ref={gi === 0 && idx === 0 ? firstOptionRef : undefined}
                  data-testid={`sort-select-${opt.label}`}
                >
                  <DropdownMenu.ItemIndicator />
                  <span css={{ display: 'flex', alignItems: 'center', gap: 4 }}>{opt.label}</span>
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Group>
          </React.Fragment>
        ))}

        {/* No results fallback */}
        {filtered.length === 0 && (
          <DropdownMenu.Item disabled componentId="mlflow.genai_traces_table.sort_dropdown.no_results">
            <FormattedMessage
              defaultMessage="No results"
              description="Experiment page > sort selector > no results after filtering"
            />
          </DropdownMenu.Item>
        )}
      </div>
    </>
  );
};

const EvaluationsOverviewSortDropdownBody = ({
  sortOptions,
  tableSort,
  onOptionSelected,
}: {
  sortOptions: SortOption[];
  tableSort?: EvaluationsOverviewTableSort;
  onOptionSelected: (sortOption: SortOption, orderByAsc: boolean) => void;
}) => {
  const { theme } = useDesignSystemTheme();

  const inputElementRef = useRef<React.ComponentRef<typeof Input>>(null);
  const [filter, setFilter] = useState('');
  const firstElementRef = useRef<HTMLDivElement>(null);

  // Merge all sort options and filter them by the search query
  const filteredSortOptions = useMemo(
    () =>
      sortOptions.filter((option) => {
        return option.label.toLowerCase().includes(filter.toLowerCase());
      }),
    [sortOptions, filter],
  );

  const handleChange = useCallback(
    (orderByKey: string) => {
      const orderByKeyOption = sortOptions.find((option) => option.key === orderByKey);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- TODO(FEINF-3982)
      onOptionSelected(orderByKeyOption!, tableSort?.asc || true);
    },
    [onOptionSelected, tableSort, sortOptions],
  );

  const setOrder = useCallback(
    (ascending: boolean) => {
      const orderByKeyOption = sortOptions.find((option) => option.key === tableSort?.key);
      onOptionSelected(orderByKeyOption || sortOptions[0], ascending);
    },
    [onOptionSelected, sortOptions, tableSort],
  );

  // Autofocus won't work everywhere so let's focus input everytime the dropdown is opened
  useEffect(() => {
    requestAnimationFrame(() => {
      inputElementRef.current?.focus();
    });
  }, []);

  return (
    <>
      <div
        css={{
          padding: `${theme.spacing.sm}px ${theme.spacing.lg / 2}px ${theme.spacing.sm}px`,
          width: '100%',
          display: 'flex',
          gap: theme.spacing.xs,
        }}
      >
        <Input
          componentId="mlflow.experiment_page.sort_dropdown.search"
          prefix={<SearchIcon />}
          value={filter}
          type="search"
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search"
          autoFocus
          ref={inputElementRef}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'Tab') {
              firstElementRef.current?.focus();
              return;
            }
            e.stopPropagation();
          }}
        />
        <div
          css={{
            display: 'flex',
            gap: theme.spacing.xs,
          }}
        >
          <ToggleButton
            pressed={tableSort?.asc === false}
            icon={<ArrowDownIcon />}
            componentId="mlflow.experiment_page.sort_dropdown.sort_desc"
            onClick={() => setOrder(false)}
            aria-label="Sort descending"
            data-testid="sort-select-desc"
          />
          <ToggleButton
            pressed={tableSort?.asc === true}
            icon={<ArrowUpIcon />}
            componentId="mlflow.experiment_page.sort_dropdown.sort_asc"
            onClick={() => setOrder(true)}
            aria-label="Sort ascending"
            data-testid="sort-select-asc"
          />
        </div>
      </div>
      <DropdownMenu.Group css={{ maxHeight: 400, overflowY: 'auto' }}>
        {filteredSortOptions.map((sortOption, index) => (
          <DropdownMenu.CheckboxItem
            componentId="mlflow.experiment_page.sort_dropdown.sort_option"
            key={sortOption.key}
            onClick={() => handleChange(sortOption.key)}
            checked={sortOption.key === tableSort?.key}
            data-testid={`sort-select-${sortOption.label}`}
            ref={index === 0 ? firstElementRef : undefined}
          >
            <DropdownMenu.ItemIndicator />
            <span css={{ display: 'flex', alignItems: 'center', gap: 4 }}>{sortOption.label}</span>
          </DropdownMenu.CheckboxItem>
        ))}
        {!filteredSortOptions.length && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunssortselectorv2.tsx_151"
            disabled
          >
            <FormattedMessage
              defaultMessage="No results"
              description="Experiment page > sort selector > no results after filtering by search query"
            />
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Group>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsRcaStats.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsRcaStats.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import { Tooltip, useDesignSystemTheme, XCircleFillIcon } from '@databricks/design-system';
import { useIntl, type IntlShape } from '@databricks/i18n';

import {
  KnownEvaluationResultAssessmentStringValue,
  KnownEvaluationResultAssessmentValueMapping,
  withAlpha,
} from './GenAiEvaluationTracesReview.utils';
import { RunColorCircle } from './RunColorCircle';
import type { AssessmentAggregates, AssessmentFilter, AssessmentInfo, AssessmentValueType } from '../types';
import { COMPARE_TO_RUN_COLOR, CURRENT_RUN_COLOR, getEvaluationResultAssessmentBackgroundColor } from '../utils/Colors';
import { displayPercentage } from '../utils/DisplayUtils';

interface RcaAssessmentRunDisplayInfoCount {
  count: number;
  fraction: number;
  percentage: string;
  tooltip: string;
  toggleFilter: () => void;
  isSelected: boolean;
}

interface RcaAssessmentDisplayInfoCount {
  assessment: string;
  title: string;
  currentInfo: RcaAssessmentRunDisplayInfoCount;
  otherInfo?: RcaAssessmentRunDisplayInfoCount;
  icon: JSX.Element;
}

export const EvaluationsRcaStats = ({
  overallAssessmentInfo,
  assessmentNameToAggregates,
  allAssessmentFilters,
  toggleAssessmentFilter,
  runUuid,
  compareToRunUuid,
}: {
  overallAssessmentInfo: AssessmentInfo;
  assessmentNameToAggregates: Record<string, AssessmentAggregates>;
  allAssessmentFilters: AssessmentFilter[];
  toggleAssessmentFilter: (
    assessmentName: string,
    filterValue: AssessmentValueType,
    run: string,
    filterType?: AssessmentFilter['filterType'],
  ) => void;
  runUuid?: string;
  compareToRunUuid?: string;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const rcaData = useMemo(() => {
    return getRcaData(
      intl,
      assessmentNameToAggregates,
      allAssessmentFilters,
      toggleAssessmentFilter,
      Boolean(compareToRunUuid),
      runUuid,
      compareToRunUuid,
    );
  }, [intl, assessmentNameToAggregates, allAssessmentFilters, toggleAssessmentFilter, compareToRunUuid, runUuid]);

  if (rcaData.length === 0) {
    return <></>;
  }
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
      }}
    >
      <div
        css={{
          fontWeight: theme.typography.typographyBoldFontWeight,
        }}
      >
        {intl.formatMessage({
          defaultMessage: 'Root Cause Analysis',
          description: 'Root cause analysis section title',
        })}
      </div>

      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
        }}
      >
        <RcaPills
          overallAssessmentInfo={overallAssessmentInfo}
          rcaData={rcaData}
          run="current"
          runColor={compareToRunUuid ? CURRENT_RUN_COLOR : undefined}
        />
      </div>
      {compareToRunUuid && (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xs,
          }}
        >
          <RcaPills
            overallAssessmentInfo={overallAssessmentInfo}
            rcaData={rcaData}
            run="other"
            runColor={COMPARE_TO_RUN_COLOR}
          />
        </div>
      )}
    </div>
  );
};

export const RcaPills = ({
  rcaData,
  run,
  runColor,
  overallAssessmentInfo,
}: {
  rcaData: RcaAssessmentDisplayInfoCount[];
  run: 'current' | 'other';
  runColor?: string;
  overallAssessmentInfo: AssessmentInfo;
}) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ display: 'flex', flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
      {runColor && (
        <div css={{ display: 'flex' }}>
          <RunColorCircle color={runColor} />
        </div>
      )}
      <div
        css={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: theme.spacing.xs,
        }}
      >
        {rcaData.map((item, i) => {
          const runDisplayInfoCount = run === 'current' ? item.currentInfo : item.otherInfo;
          if (!runDisplayInfoCount) {
            // eslint-disable-next-line react/jsx-key -- TODO(FEINF-1756)
            return <></>;
          }
          const backgroundColor = getEvaluationResultAssessmentBackgroundColor(theme, overallAssessmentInfo, {
            stringValue: 'no',
          });
          return (
            <Tooltip key={i} content={runDisplayInfoCount.tooltip} componentId="mlflow.evaluations_review.rca_pill">
              <>
                <div
                  key={i}
                  style={{
                    border: runDisplayInfoCount.isSelected ? `1px solid ${theme.colors.grey400}` : '',
                  }}
                  css={{
                    color: theme.colors.textSecondary,
                    borderRadius: theme.general.borderRadiusBase,
                    padding: `0 ${theme.spacing.xs}px`,
                    height: '20px',
                    display: 'flex',
                    backgroundColor: runDisplayInfoCount.isSelected
                      ? withAlpha(backgroundColor, 1.0)
                      : withAlpha(backgroundColor, 0.5),
                    // Bring back when we support filtering on RCA.
                    // cursor: 'pointer',
                    // '&:hover': {
                    //   backgroundColor: withAlpha(backgroundColor, 0.9),
                    // },
                    gap: theme.spacing.xs,
                    fontSize: theme.typography.fontSizeSm,
                  }}
                  // Bring back when we support filtering on RCA.
                  // onClick={runDisplayInfoCount.toggleFilter}
                >
                  {runDisplayInfoCount.count}
                  <div>{item.title.toLocaleLowerCase()}</div>
                </div>
              </>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

function getRcaData(
  intl: IntlShape,
  assessmentNameToAggregates: Record<string, AssessmentAggregates>,
  assessmentFilters: AssessmentFilter[],
  toggleAssessmentFilter: (
    assessmentName: string,
    filterValue: AssessmentValueType,
    run: string,
    filterType?: AssessmentFilter['filterType'],
  ) => void,
  isCompareToRun: boolean,
  currentRunDisplayName?: string,
  otherRunDisplayName?: string,
): RcaAssessmentDisplayInfoCount[] {
  // If all of the unfiltered assessment display infos have 0 root cause, return an empty array.
  if (
    Object.values(assessmentNameToAggregates).every(
      (assessmentDisplayInfo) =>
        assessmentDisplayInfo.currentNumRootCause === 0 && (assessmentDisplayInfo.otherNumRootCause || 0) === 0,
    )
  ) {
    return [];
  }
  // Remove any root cause values that are 0 in the unfiltered set. This that the set of rca pills don't hide 0 values when filtered
  // but keep the set minimal when unfiltered.
  const sortedAssessmentAggregates = Object.values(assessmentNameToAggregates)
    .filter((x) => x.currentNumRootCause > 0 || (x.otherNumRootCause || 0) > 0)
    .sort((a, b) => b.currentNumRootCause - a.currentNumRootCause);
  const maxNumRootCause = Math.max(
    sortedAssessmentAggregates[0]?.currentNumRootCause || 0,
    sortedAssessmentAggregates[0]?.otherNumRootCause || 0,
  );
  return sortedAssessmentAggregates.map((assessmentDisplayInfo) => {
    const knownValueLabel =
      KnownEvaluationResultAssessmentValueMapping[assessmentDisplayInfo.assessmentInfo.name]?.[
        KnownEvaluationResultAssessmentStringValue.NO
      ];
    const title = knownValueLabel ? intl.formatMessage(knownValueLabel) : assessmentDisplayInfo.assessmentInfo.name;

    const currentCounts = assessmentDisplayInfo.currentCounts;
    const numPassing = currentCounts?.get(KnownEvaluationResultAssessmentStringValue.YES) || 0;
    const numFailing = currentCounts?.get(KnownEvaluationResultAssessmentStringValue.NO) || 0;
    const numMissing = currentCounts?.get(undefined) || 0;
    const numRootCause = assessmentDisplayInfo.currentNumRootCause;

    const numEvals = numPassing + numFailing + numMissing;

    const otherCounts = assessmentDisplayInfo.otherCounts;
    let otherNumEvals: number | undefined;
    if (assessmentDisplayInfo.otherCounts !== undefined) {
      const otherNumPassing = otherCounts?.get(KnownEvaluationResultAssessmentStringValue.YES) || 0;
      const otherNumFailing = otherCounts?.get(KnownEvaluationResultAssessmentStringValue.NO) || 0;
      const otherNumMissing = otherCounts?.get(undefined) || 0;
      otherNumEvals = otherNumPassing + otherNumFailing + otherNumMissing;
    }
    const otherNumRootCause = assessmentDisplayInfo.otherNumRootCause || 0;
    const rootCauseFraction = numRootCause / numEvals;
    const otherRootCauseFraction = otherNumRootCause / (otherNumEvals || 1);
    const currentPercentage = displayPercentage(rootCauseFraction);
    const otherPercentage = displayPercentage(otherRootCauseFraction);

    return {
      assessment: assessmentDisplayInfo.assessmentInfo.name,
      // Map assessment to known values.
      title,
      currentInfo: {
        count: numRootCause,
        fraction: numRootCause / maxNumRootCause,
        tooltip: intl.formatMessage(
          {
            defaultMessage:
              '{numRootCause}/{numEvals} ({percentage}%) runs failed due to the {assessment} judge failing for the current run "{currentRun}".',
            description: 'Tooltip for the root cause metrics bar on the LLM evaluation page.',
          },
          {
            numRootCause,
            numEvals,
            percentage: currentPercentage,
            assessment: assessmentDisplayInfo.assessmentInfo.name,
            currentRun: currentRunDisplayName,
          },
        ),
        toggleFilter: () =>
          toggleAssessmentFilter(assessmentDisplayInfo.assessmentInfo.name, 'failing_root_cause', 'current'),
        isSelected: assessmentFilters.some(
          (filter) =>
            filter.filterType === 'rca' &&
            filter.run === 'current' &&
            filter.assessmentName === assessmentDisplayInfo.assessmentInfo.name,
        ),
        percentage: currentPercentage,
      },
      otherInfo: isCompareToRun
        ? {
            count: otherNumRootCause,
            fraction: otherNumRootCause / maxNumRootCause,
            tooltip: intl.formatMessage(
              {
                defaultMessage:
                  '{numRootCause}/{numEvals} ({percentage}%) runs failed due to the {assessment} judge failing for run "{otherRunDisplayName}".',
                description: 'Tooltip for the root cause metrics bar on the LLM evaluation page.',
              },
              {
                numRootCause: otherNumRootCause,
                numEvals: otherNumEvals,
                percentage: otherPercentage,
                assessment: assessmentDisplayInfo.assessmentInfo.name,
                otherRunDisplayName,
              },
            ),
            toggleFilter: () => toggleAssessmentFilter(assessmentDisplayInfo.assessmentInfo.name, 'rca', 'other'),
            isSelected: assessmentFilters.some(
              (filter) =>
                filter.filterType === 'rca' &&
                filter.run === 'other' &&
                filter.assessmentName === assessmentDisplayInfo.assessmentInfo.name,
            ),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- TODO(FEINF-3982)
            percentage: otherPercentage!,
          }
        : undefined,
      icon: <XCircleFillIcon />,
    };
  });
}
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewAssessmentDetailedHistory.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewAssessmentDetailedHistory.tsx
Signals: React

```typescript
import { first, isNil, isString } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { Spacer, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import {
  KnownEvaluationResultAssessmentValueMapping,
  getEvaluationResultAssessmentValue,
  isDraftAssessment,
} from './GenAiEvaluationTracesReview.utils';
import type { RunEvaluationResultAssessment, RunEvaluationResultAssessmentDraft } from '../types';
import { timeSinceStr } from '../utils/DisplayUtils';
import { useMarkdownConverter } from '../utils/MarkdownUtils';

type AssessmentWithHistory = RunEvaluationResultAssessment | RunEvaluationResultAssessmentDraft;

export const EvaluationsReviewAssessmentDetailedHistory = ({
  history,
  alwaysExpanded = false,
}: {
  /**
   * List of assessments to display, ordered from the most recent to the oldest.
   */
  history: AssessmentWithHistory[];
  /**
   * Whether the detailed view is always expanded.
   */
  alwaysExpanded?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const [referenceDate, setReferenceDate] = useState<Date>(new Date());

  useEffect(() => {
    const updateDateInterval = setInterval(() => {
      setReferenceDate(new Date());
    }, 5000);
    return () => {
      clearInterval(updateDateInterval);
    };
  }, []);

  const transitions = useMemo(() => {
    return history.reduce<[AssessmentWithHistory, AssessmentWithHistory][]>((result, next, index) => {
      const previous = history[index + 1];
      if (previous) {
        return [...result, [next, previous]];
      }

      return result;
    }, []);
  }, [history]);

  const { makeHTML } = useMarkdownConverter();

  const rationaleHtml = useMemo(() => {
    const rationale = first(history)?.rationale;
    return isString(rationale) ? makeHTML(rationale) : null;
  }, [history, makeHTML]);

  if (!transitions.length) {
    if (first(history)?.rationale) {
      return (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
          }}
        >
          {/* eslint-disable-next-line react/no-danger */}
          <span css={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: rationaleHtml ?? '' }} />
        </div>
      );
    } else if (first(history)?.errorMessage) {
      return (
        <>
          <Typography.Text color="error">{first(history)?.errorMessage}</Typography.Text>
        </>
      );
    } else {
      return (
        <>
          {!alwaysExpanded && (
            <div>
              <Spacer size="sm" />
              <Typography.Hint>
                <FormattedMessage
                  defaultMessage="No details for assessment"
                  description="Evaluation review > assessments > no history"
                />
              </Typography.Hint>
            </div>
          )}
        </>
      );
    }
  }

  const getMappedValue = (assessment: AssessmentWithHistory) => {
    const value = getEvaluationResultAssessmentValue(assessment);
    const knownMapping = KnownEvaluationResultAssessmentValueMapping[assessment.name];

    if (knownMapping && !isNil(value)) {
      const messageDescriptor = knownMapping[value.toString()] ?? knownMapping['default'];
      if (messageDescriptor) {
        return <FormattedMessage {...messageDescriptor} values={{ value }} />;
      }
    }

    return value;
  };

  return (
    <>
      <Spacer size="sm" />
      {transitions.map(([next, previous], index) => {
        const prevValue = getMappedValue(previous);
        const nextValue = getMappedValue(next);

        const isSameValue = prevValue === nextValue;

        const when = isDraftAssessment(next)
          ? intl.formatMessage({
              defaultMessage: 'just now',
              description: 'Evaluation review > assessments > tooltip > just now',
            })
          : timeSinceStr(next.timestamp, referenceDate);

        return (
          <div
            key={`${next.timestamp}-${index}`}
            css={{ marginBottom: !alwaysExpanded ? theme.spacing.md : undefined }}
          >
            <Typography.Hint css={{ marginBottom: theme.spacing.xs }}>
              {prevValue && nextValue && (
                <>
                  <code>{getMappedValue(previous)}</code> &#8594; <code>{getMappedValue(next)}</code>{' '}
                </>
              )}
              {isSameValue ? (
                <FormattedMessage
                  defaultMessage="added {when} by {user}"
                  description="Evaluation review > assessments > detailed history > added history entry"
                  values={{
                    when,
                    user: next.source?.sourceId,
                  }}
                />
              ) : (
                <FormattedMessage
                  defaultMessage="edited {when} by {user}"
                  description="Evaluation review > assessments > detailed history > edited history entry"
                  values={{
                    when,
                    user: next.source?.sourceId,
                  }}
                />
              )}
            </Typography.Hint>
            {next.rationale && <Typography.Text>{next.rationale}</Typography.Text>}
          </div>
        );
      })}
    </>
  );
};
```

--------------------------------------------------------------------------------

````

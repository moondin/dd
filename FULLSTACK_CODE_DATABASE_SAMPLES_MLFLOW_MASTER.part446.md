---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 446
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 446 of 991)

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

---[FILE: DetailsOverviewParamsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/DetailsOverviewParamsTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  Button,
  ChevronDownIcon,
  ChevronRightIcon,
  Empty,
  Input,
  SearchIcon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { KeyValueEntity } from '../../common/types';
import { throttle, values } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getExpandedRowModel } from '@tanstack/react-table';
import type { Interpolation, Theme } from '@emotion/react';
import { ExpandedJSONValueCell } from '@mlflow/mlflow/src/common/components/ExpandableCell';
import { isUnstableNestedComponentsMigrated } from '../../common/utils/FeatureUtils';
import { useExperimentTrackingDetailsPageLayoutStyles } from '../hooks/useExperimentTrackingDetailsPageLayoutStyles';

type ParamsColumnDef = ColumnDef<KeyValueEntity> & {
  meta?: { styles?: Interpolation<Theme>; multiline?: boolean };
};

/**
 * Displays cell with expandable parameter value.
 */
const ExpandableParamValueCell = ({
  name,
  value,
  toggleExpanded,
  isExpanded,
  autoExpandedRowsList,
}: {
  name: string;
  value: string;
  toggleExpanded: () => void;
  isExpanded: boolean;
  autoExpandedRowsList: Record<string, boolean>;
}) => {
  const { theme } = useDesignSystemTheme();
  const cellRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (autoExpandedRowsList[name]) {
      return;
    }
    if (isOverflowing) {
      toggleExpanded();
      autoExpandedRowsList[name] = true;
    }
  }, [autoExpandedRowsList, isOverflowing, name, toggleExpanded]);

  // Check if cell is overflowing using resize observer
  useEffect(() => {
    if (!cellRef.current) return;

    const resizeObserverCallback: ResizeObserverCallback = throttle(
      ([entry]) => {
        const isOverflowing = entry.target.scrollHeight > entry.target.clientHeight;
        setIsOverflowing(isOverflowing);
      },
      500,
      { trailing: true },
    );

    const resizeObserver = new ResizeObserver(resizeObserverCallback);
    resizeObserver.observe(cellRef.current);
    return () => resizeObserver.disconnect();
  }, [cellRef, toggleExpanded]);

  // Re-check if cell is overflowing after collapse
  useEffect(() => {
    if (!cellRef.current) return;
    if (!isExpanded) {
      const isOverflowing = cellRef.current.scrollHeight > cellRef.current.clientHeight;
      if (isOverflowing) {
        setIsOverflowing(true);
      }
    }
  }, [isExpanded]);

  return (
    <div css={{ display: 'flex', gap: theme.spacing.xs }}>
      {(isOverflowing || isExpanded) && (
        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewparamstable.tsx_74"
          size="small"
          icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={() => toggleExpanded()}
          css={{ flexShrink: 0 }}
        />
      )}
      <div
        title={value}
        css={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: isExpanded ? undefined : '3',
        }}
        ref={cellRef}
      >
        {isExpanded ? <ExpandedJSONValueCell value={value} /> : value}
      </div>
    </div>
  );
};

type DetailsOverviewParamsTableMeta = {
  autoExpandedRowsList: React.MutableRefObject<Record<string, boolean>>;
};

const staticColumns: ParamsColumnDef[] = [
  {
    id: 'key',
    accessorKey: 'key',
    header: () => (
      <FormattedMessage
        defaultMessage="Parameter"
        description="Run page > Overview > Parameters table > Key column header"
      />
    ),
    enableResizing: true,
    size: 240,
  },
  {
    id: 'value',
    header: () => (
      <FormattedMessage
        defaultMessage="Value"
        description="Run page > Overview > Parameters table > Value column header"
      />
    ),
    accessorKey: 'value',
    enableResizing: false,
    meta: { styles: { paddingLeft: 0 } },
    cell: ({
      row: { original, getIsExpanded, toggleExpanded },
      table: {
        options: { meta },
      },
    }) => {
      const { autoExpandedRowsList } = meta as DetailsOverviewParamsTableMeta;
      return (
        <ExpandableParamValueCell
          name={original.key}
          value={original.value}
          isExpanded={getIsExpanded()}
          toggleExpanded={toggleExpanded}
          autoExpandedRowsList={autoExpandedRowsList.current}
        />
      );
    },
  },
];

/**
 * Displays filterable table with parameter key/values.
 */
export const DetailsOverviewParamsTable = ({
  params,
  className,
  expandToParentContainer,
}: {
  params: Record<string, KeyValueEntity>;
  className?: string;
  expandToParentContainer?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const [filter, setFilter] = useState('');
  const autoExpandedRowsList = useRef<Record<string, boolean>>({});
  const { detailsPageTableStyles, detailsPageNoEntriesStyles } = useExperimentTrackingDetailsPageLayoutStyles();
  const paramsValues = useMemo(() => values(params), [params]);

  const paramsList = useMemo(
    () =>
      paramsValues.filter(({ key, value }) => {
        const filterLower = filter.toLowerCase();
        return key.toLowerCase().includes(filterLower) || value.toLowerCase().includes(filterLower);
      }),
    [filter, paramsValues],
  );

  const columns = useMemo<ParamsColumnDef[]>(
    () =>
      isUnstableNestedComponentsMigrated()
        ? staticColumns
        : [
            {
              id: 'key',
              accessorKey: 'key',
              header: () => (
                <FormattedMessage
                  defaultMessage="Parameter"
                  description="Run page > Overview > Parameters table > Key column header"
                />
              ),
              enableResizing: true,
              size: 240,
            },
            {
              id: 'value',
              header: () => (
                <FormattedMessage
                  defaultMessage="Value"
                  description="Run page > Overview > Parameters table > Value column header"
                />
              ),
              accessorKey: 'value',
              enableResizing: false,
              meta: { styles: { paddingLeft: 0 } },
              cell: ({ row: { original, getIsExpanded, toggleExpanded } }) => (
                <ExpandableParamValueCell
                  name={original.key}
                  value={original.value}
                  isExpanded={getIsExpanded()}
                  toggleExpanded={toggleExpanded}
                  autoExpandedRowsList={autoExpandedRowsList.current}
                />
              ),
            },
          ],
    [],
  );

  const table = useReactTable('mlflow/server/js/src/experiment-tracking/components/DetailsOverviewParamsTable.tsx', {
    data: paramsList,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row.key,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    columns,
    meta: { autoExpandedRowsList } satisfies DetailsOverviewParamsTableMeta,
  });

  const renderTableContent = () => {
    if (!paramsValues.length) {
      return (
        <div css={detailsPageNoEntriesStyles}>
          <Empty
            description={
              <FormattedMessage
                defaultMessage="No parameters recorded"
                description="Run page > Overview > Parameters table > No parameters recorded"
              />
            }
          />
        </div>
      );
    }

    const areAllResultsFiltered = paramsList.length < 1;

    return (
      <>
        <div css={{ marginBottom: theme.spacing.sm }}>
          <Input
            componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewparamstable.tsx_213"
            prefix={<SearchIcon />}
            placeholder={intl.formatMessage({
              defaultMessage: 'Search parameters',
              description: 'Run page > Overview > Parameters table > Filter input placeholder',
            })}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            allowClear
          />
        </div>
        <Table
          scrollable
          empty={
            areAllResultsFiltered ? (
              <div>
                <Empty
                  description={
                    <FormattedMessage
                      defaultMessage="No parameters match the search filter"
                      description="Run page > Overview > Parameters table > No results after filtering"
                    />
                  }
                />
              </div>
            ) : null
          }
          css={detailsPageTableStyles}
        >
          <TableRow isHeader>
            {table.getLeafHeaders().map((header, index) => (
              <TableHeader
                componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewparamstable.tsx_244"
                key={header.id}
                header={header}
                column={header.column}
                setColumnSizing={table.setColumnSizing}
                isResizing={header.column.getIsResizing()}
                css={{
                  flexGrow: header.column.getCanResize() ? 0 : 1,
                }}
                style={{
                  flexBasis: header.column.getCanResize() ? header.column.getSize() : undefined,
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            ))}
          </TableRow>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  css={(cell.column.columnDef as ParamsColumnDef).meta?.styles}
                  style={{
                    flexGrow: cell.column.getCanResize() ? 0 : 1,
                    flexBasis: cell.column.getCanResize() ? cell.column.getSize() : undefined,
                  }}
                  multiline
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      </>
    );
  };

  return (
    <div
      css={{
        flex: expandToParentContainer ? 1 : '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      className={className}
    >
      <Typography.Title level={4}>
        <FormattedMessage
          defaultMessage="Parameters ({length})"
          description="Run page > Overview > Parameters table > Section title"
          values={{ length: paramsList.length }}
        />
      </Typography.Title>
      <div
        css={{
          padding: theme.spacing.sm,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.general.borderRadiusBase,
          display: 'flex',
          flexDirection: 'column',
          flex: expandToParentContainer ? 1 : '0 0 auto',
          overflow: 'hidden',
        }}
      >
        {renderTableContent()}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: DirectRunPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/DirectRunPage.test.tsx
Signals: React, Redux/RTK

```typescript
import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { Provider } from 'react-redux';
import { useLocation, createMLflowRoutePath } from '../../common/utils/RoutingUtils';
import { testRoute, TestRouter } from '../../common/utils/RoutingTestUtils';
import configureStore from 'redux-mock-store';
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { getRunApi } from '../actions';
import { DirectRunPage } from './DirectRunPage';
import { useEffect } from 'react';
import { renderWithIntl, screen, act } from '../../common/utils/TestUtils.react18';

jest.mock('../../common/components/PageNotFoundView', () => ({
  PageNotFoundView: () => <div>Page not found</div>,
}));

jest.mock('../actions', () => ({
  getRunApi: jest.fn().mockReturnValue({ type: 'getRunApi', payload: Promise.resolve() }),
}));

describe('DirectRunPage', () => {
  let mockLocation: any;
  let mockStore: any;

  const mountComponent = async (runInfosByUuid = {}, runUuid = '') => {
    mockStore = configureStore([])({
      entities: {
        runInfosByUuid,
      },
    });

    const TestComponent = () => {
      const location = useLocation();
      useEffect(() => {
        mockLocation = location;
      }, [location]);
      return null;
    };

    renderWithIntl(
      <Provider store={mockStore}>
        <TestRouter
          initialEntries={[createMLflowRoutePath(`/${runUuid}`)]}
          routes={[
            testRoute(
              <>
                <TestComponent />
              </>,
              createMLflowRoutePath('/experiments/:experimentId/runs/:runId'),
            ),
            testRoute(
              <>
                <TestComponent />
                <DirectRunPage />
              </>,
              createMLflowRoutePath('/:runUuid'),
            ),
          ]}
        />
      </Provider>,
    );
  };

  beforeEach(() => {
    mockLocation = {
      pathname: '',
      search: '',
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockStore?.clearActions();
  });

  test('redirects to main route if run is loaded into store', async () => {
    await mountComponent(
      {
        '321-run-id': { experimentId: '123-exp-id', runUuid: '321-run-id' },
      },
      '321-run-id',
    );

    expect(mockLocation.pathname).toBe(createMLflowRoutePath('/experiments/123-exp-id/runs/321-run-id'));
  });

  test('properly dispatches redux actions for fetching the run', async () => {
    await mountComponent({}, '321-run-id');

    expect(getRunApi).toHaveBeenCalledWith('321-run-id');
    expect(mockStore.getActions()).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'getRunApi' })]));
  });

  test('displays error if run does not exist', async () => {
    // Suppress 404 console error
    jest.spyOn(console, 'error').mockReturnThis();
    // @ts-expect-error TODO(FEINF-4101)
    jest.mocked(getRunApi).mockImplementation(() => ({
      type: 'getRunApi',
      payload: Promise.reject(new ErrorWrapper('', 404)),
    }));

    await act(async () => mountComponent({}, '321-run-id'));

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DirectRunPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/DirectRunPage.tsx
Signals: React, Redux/RTK

```typescript
import { PageWrapper, LegacySkeleton } from '@databricks/design-system';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useParams, useNavigate } from '../../common/utils/RoutingUtils';
import type { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import Utils from '../../common/utils/Utils';
import type { ReduxState } from '../../redux-types';
import { getRunApi } from '../actions';
import Routes from '../routes';
import { PageNotFoundView } from '../../common/components/PageNotFoundView';
import type { WithRouterNextProps } from '../../common/utils/withRouterNext';
import { withRouterNext } from '../../common/utils/withRouterNext';
import { withErrorBoundary } from '../../common/utils/withErrorBoundary';
import ErrorUtils from '../../common/utils/ErrorUtils';

const DirectRunPageImpl = (props: any) => {
  const { runUuid } = useParams<{ runUuid: string }>();
  const [error, setError] = useState<ErrorWrapper>();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // Reset error after changing requested run
  useEffect(() => {
    setError(undefined);
  }, [runUuid]);

  useEffect(() => {
    // Start fetching run info if it doesn't exist in the store yet
    if (!props.runInfo && runUuid) {
      const action = getRunApi(runUuid);
      action.payload.catch((e) => {
        Utils.logErrorAndNotifyUser(e);
        setError(e);
      });
      dispatch(action);
    }
  }, [dispatch, runUuid, props.runInfo]);

  useEffect(() => {
    if (props.runInfo?.experimentId) {
      navigate(Routes.getRunPageRoute(props.runInfo.experimentId, props.runInfo.runUuid), {
        replace: true,
      });
    }
  }, [navigate, props.runInfo]);

  // If encountered 404 error, display a proper component
  if (error?.status === 404) {
    return <PageNotFoundView />;
  }

  // If the run is loading, display skeleton
  return (
    <PageWrapper>
      <LegacySkeleton />
    </PageWrapper>
  );
};

const DirectRunPageWithRouter = withRouterNext(
  connect((state: ReduxState, ownProps: WithRouterNextProps<{ runUuid: string }>) => {
    return { runInfo: state.entities.runInfosByUuid[ownProps.params.runUuid] };
  })(DirectRunPageImpl),
);

export const DirectRunPage = withErrorBoundary(ErrorUtils.mlflowServices.RUN_TRACKING, DirectRunPageWithRouter);

export default DirectRunPage;
```

--------------------------------------------------------------------------------

---[FILE: EntitySearchAutoComplete.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/EntitySearchAutoComplete.tsx
Signals: React

```typescript
import {
  AutoComplete,
  Button,
  CloseIcon,
  InfoFillIcon,
  InfoPopover,
  InfoSmallIcon,
  Input,
  LegacyTooltip,
  SearchIcon,
  Tooltip,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useIntl } from 'react-intl';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import type {
  EntitySearchAutoCompleteEntity,
  EntitySearchAutoCompleteOptionGroup,
} from './EntitySearchAutoComplete.utils';
import { getEntitySearchEntitiesAndIndices, getFilteredOptionsFromEntityName } from './EntitySearchAutoComplete.utils';
import { shouldEnableMinMaxMetricsOnExperimentPage } from '../../common/utils/FeatureUtils';
import {
  createQuickRegexpSearchFilter,
  detectSqlSyntaxInSearchQuery,
} from './experiment-page/utils/experimentPage.fetch-utils';
import { FormattedMessage } from 'react-intl';
import { isEqual } from 'lodash';
import { useExperimentViewLocalStore } from './experiment-page/hooks/useExperimentViewLocalStore';

const TOOLTIP_COOKIE_KEY = 'tooltipLastPopup';
const WEEK_IN_SECONDS = 604800;

export type EntitySearchAutoCompleteCompleteProps = {
  baseOptions: EntitySearchAutoCompleteOptionGroup[];
  searchFilter: string;
  onSearchFilterChange: (newValue: string) => void;
  onClear: () => void;
  requestError?: ErrorWrapper | Error | null;
  tooltipContent?: React.ReactNode;
  placeholder?: string;
  useQuickFilter?: boolean;
  defaultActiveFirstOption?: boolean;
  className?: string;
};

/**
 * Autocomplete component that provides suggestions for MLflow search entity names.
 */
export const EntitySearchAutoComplete = ({
  baseOptions,
  searchFilter,
  requestError = null,
  onSearchFilterChange,
  onClear,
  tooltipContent,
  placeholder,
  useQuickFilter,
  defaultActiveFirstOption = true,
  className,
}: EntitySearchAutoCompleteCompleteProps) => {
  const { theme, getPrefixedClassName } = useDesignSystemTheme();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();

  const [text, setText] = useState<string>('');
  const [autocompleteEnabled, setAutocompleteEnabled] = useState<boolean | undefined>(undefined);
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  // Determines whether the text was changed by making a selection in the autocomplete
  // dialog, as opposed to by typing.
  const [lastSetBySelection, setLastSetBySelection] = useState(false);

  // How many suggestions should be shown per entity group before the group is ellipsized.
  const [suggestionLimits, setSuggestionLimits] = useState({
    Metrics: 10,
    Parameters: 10,
    Tags: 10,
  });
  // List of entities parsed from `text`.
  const currentEntitiesRef = useRef<EntitySearchAutoCompleteEntity[]>([]);
  const [entityBeingEdited, setEntityBeingEdited] = useState<EntitySearchAutoCompleteEntity | undefined>(undefined);

  // Each time we're setting search filter externally, update it here as well
  useEffect(() => {
    setText(searchFilter);
  }, [searchFilter]);

  useEffect(() => {
    const previousEntities = currentEntitiesRef.current;
    const newEntities = getEntitySearchEntitiesAndIndices(text);
    currentEntitiesRef.current = newEntities;

    if (lastSetBySelection) {
      setLastSetBySelection(false);
      return;
    }
    const currentEntitiesNames = newEntities.map((e) => e.name);
    const previousEntitiesNames = previousEntities.map((e) => e.name);
    if (!isEqual(currentEntitiesNames, previousEntitiesNames) && newEntities.length >= previousEntities.length) {
      let i = 0;
      while (i < newEntities.length) {
        if (i >= previousEntities.length || newEntities[i].name.trim() !== previousEntities[i].name.trim()) {
          setAutocompleteEnabled(true);
          setEntityBeingEdited(newEntities[i]);
          return;
        }
        i++;
      }
    }
    // If here, no entity is being edited
    setAutocompleteEnabled(false);
    // currentEntitiesRef is not used anywhere else and state setters are safe to
    // omit from hook dependencies as per react docs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const filteredOptions = useMemo(() => {
    if (!entityBeingEdited) {
      return [];
    }
    return getFilteredOptionsFromEntityName(baseOptions, entityBeingEdited, suggestionLimits);
  }, [baseOptions, entityBeingEdited, suggestionLimits]);

  /**
   * Called when an option is picked from the autocomplete dropdown, either by hitting enter
   * when selected, or clicking on it
   * @param value
   */
  const onSelect = useCallback(
    (value: string, option: any) => {
      if (!entityBeingEdited) {
        return;
      }
      if (value.startsWith('...')) {
        // Keep the dialog open as this is not a real selection
        setAutocompleteEnabled(true);
        const groupName = option.value.split('_')[1];
        setSuggestionLimits((prevSuggestionLimits) => ({
          ...prevSuggestionLimits,
          [groupName]: (prevSuggestionLimits as any)[groupName] + 10,
        }));
      } else {
        const prefix = text.substring(0, entityBeingEdited.startIndex);
        const suffix = text.substring(entityBeingEdited.endIndex);
        setText(prefix + value + ' ' + suffix);
        setLastSetBySelection(true);
        setAutocompleteEnabled(false);
      }
    },
    [text, setText, entityBeingEdited, setAutocompleteEnabled],
  );

  const localStorageInstance = useExperimentViewLocalStore(TOOLTIP_COOKIE_KEY);

  const [showTooltipOnError, setShowTooltipOnError] = useState(() => {
    const currentTimeSecs = Math.floor(Date.now() / 1000);
    const storedItem = localStorageInstance.getItem(TOOLTIP_COOKIE_KEY);
    // Show tooltip again if it was last shown 1 week ago or older
    return !storedItem || parseInt(storedItem, 10) < currentTimeSecs - WEEK_IN_SECONDS;
  });
  const tooltipIcon = React.useRef<HTMLButtonElement>(null);

  const quickRegexpFilter = useMemo(() => {
    if (useQuickFilter && text.length > 0 && !detectSqlSyntaxInSearchQuery(text)) {
      return createQuickRegexpSearchFilter(text);
    }
    return undefined;
  }, [text, useQuickFilter]);

  // If requestError has changed and there is an error, pop up the tooltip
  useEffect(() => {
    if (requestError && showTooltipOnError) {
      const currentTimeSecs = Math.floor(Date.now() / 1000);
      localStorageInstance.setItem(TOOLTIP_COOKIE_KEY, currentTimeSecs);
      setShowTooltipOnError(false);
      tooltipIcon.current?.click();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestError]);

  const noMatches = filteredOptions.flatMap((o) => o.options).length === 0;
  const open = autocompleteEnabled && focused && !noMatches;

  // Callback fired when key is pressed on the input
  const triggerSearch: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      // Get the class name for the active item in the dropdown
      const activeItemClass = getPrefixedClassName('select-item-option-active');
      const dropdownContainsActiveItem = Boolean(dropdownRef.current?.querySelector(`.${activeItemClass}`));

      if (e.key === 'Enter') {
        // If the autocomplete dialog is open, close it
        if (open) {
          setAutocompleteEnabled(false);
        }
        // If the autocomplete dialog is closed or user didn't select any item, trigger search
        if (!open || !dropdownContainsActiveItem) {
          onSearchFilterChange(text);
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (open) {
          setAutocompleteEnabled(false);
        }
      }
    },
    [open, text, onSearchFilterChange, getPrefixedClassName],
  );

  return (
    <div
      css={{
        display: 'flex',
        gap: theme.spacing.sm,
        width: 430,
        [theme.responsive.mediaQueries.xs]: {
          width: 'auto',
        },
        '[type=search]::-webkit-search-cancel-button': {
          WebkitAppearance: 'none',
        },
        '[type=search]::-webkit-search-decoration': {
          WebkitAppearance: 'none',
        },
      }}
      className={className}
    >
      <AutoComplete
        dropdownMatchSelectWidth={560}
        css={{
          width: 560,
          [theme.responsive.mediaQueries.xs]: {
            width: 'auto',
          },
        }}
        defaultOpen={false}
        defaultActiveFirstOption={defaultActiveFirstOption && !useQuickFilter}
        open={open}
        options={filteredOptions}
        onSelect={onSelect}
        value={text}
        data-testid="runs-search-autocomplete"
        dropdownRender={(menu) => (
          <div
            css={{
              '.du-bois-light-select-item-option-active:not(.du-bois-light-select-item-option-disabled)': {
                // TODO: ask the design team about the color existing in the palette
                backgroundColor: '#e6f1f5',
              },
            }}
            ref={dropdownRef}
          >
            {menu}
          </div>
        )}
      >
        <Input
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_runssearchautocomplete.tsx_236"
          value={text}
          prefix={
            <SearchIcon
              css={{
                svg: {
                  width: theme.general.iconFontSize,
                  height: theme.general.iconFontSize,
                  color: theme.colors.textSecondary,
                },
              }}
            />
          }
          onKeyDown={triggerSearch}
          onClick={onFocus}
          onBlur={onBlur}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          data-testid="search-box"
          suffix={
            <div css={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {text && (
                <Button
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_runssearchautocomplete.tsx_212"
                  onClick={() => {
                    onClear();
                    setText('');
                  }}
                  type="link"
                  data-testid="clear-button"
                >
                  <CloseIcon />
                </Button>
              )}
              {quickRegexpFilter ? (
                <Tooltip
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_runssearchautocomplete.tsx_310"
                  content={
                    <FormattedMessage
                      defaultMessage="Using regular expression quick filter. The following query will be used: {filterSample}"
                      description="Experiment page > control bar > search filter > a label displayed when user has entered a simple query that will be automatically transformed into RLIKE SQL query before being sent to the API"
                      values={{
                        filterSample: (
                          <div>
                            <code>{quickRegexpFilter}</code>
                          </div>
                        ),
                      }}
                    />
                  }
                  delayDuration={0}
                >
                  <InfoFillIcon
                    aria-label={intl.formatMessage(
                      {
                        defaultMessage:
                          'Using regular expression quick filter. The following query will be used: {filterSample}',
                        description:
                          'Experiment page > control bar > search filter > a label displayed when user has entered a simple query that will be automatically transformed into RLIKE SQL query before being sent to the API',
                      },
                      {
                        filterSample: quickRegexpFilter,
                      },
                    )}
                    css={{
                      svg: {
                        width: theme.general.iconFontSize,
                        height: theme.general.iconFontSize,
                        color: theme.colors.actionPrimaryBackgroundDefault,
                      },
                    }}
                  />
                </Tooltip>
              ) : (
                <InfoPopover popoverProps={{ side: 'right' }} iconProps={{ ref: tooltipIcon }}>
                  {tooltipContent}
                </InfoPopover>
              )}
            </div>
          }
        />
      </AutoComplete>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EntitySearchAutoComplete.utils.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/EntitySearchAutoComplete.utils.test.tsx

```typescript
import { describe, expect, test } from '@jest/globals';
import { getFilteredOptionsFromEntityName } from './EntitySearchAutoComplete.utils';
import type {
  EntitySearchAutoCompleteEntity,
  EntitySearchAutoCompleteOptionGroup,
} from './EntitySearchAutoComplete.utils';

describe('EntitySearchAutoComplete utils', () => {
  const baseOptions: EntitySearchAutoCompleteOptionGroup[] = [
    {
      label: 'Metrics',
      options: [{ value: 'metrics.accuracy' }, { value: 'metrics.loss' }, { value: 'metrics.precision(micro)' }],
    },
  ];

  const suggestionLimits = {
    Metrics: 10,
  };

  test('getFilteredOptionsFromEntityName handles single open parenthesis without crashing', () => {
    const entityBeingEdited: EntitySearchAutoCompleteEntity = {
      name: 'precision(',
      startIndex: 0,
      endIndex: 10,
    };

    // Should not throw an error
    expect(() => {
      const result = getFilteredOptionsFromEntityName(baseOptions, entityBeingEdited, suggestionLimits);
      expect(result).toBeDefined();
    }).not.toThrow();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: EntitySearchAutoComplete.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/EntitySearchAutoComplete.utils.tsx
Signals: React

```typescript
import React from 'react';
import { shouldEnableMinMaxMetricsOnExperimentPage } from '../../common/utils/FeatureUtils';
import { MLFLOW_INTERNAL_PREFIX } from '../../common/utils/TagUtils';
import { sanitizeStringForRegexp } from '../../common/utils/StringUtils';

export type EntitySearchAutoCompleteOption = {
  label?: string | React.ReactNode;
  value: string;
};

export type EntitySearchAutoCompleteOptionGroup = {
  label: string;
  options: EntitySearchAutoCompleteOption[];
};

export type EntitySearchAutoCompleteEntity = {
  name: string;
  startIndex: number;
  endIndex: number;
};

type EntitySearchAutoCompleteClause = {
  clause: string;
  startIndex: number;
};

export type EntitySearchAutoCompleteEntityNameGroup = {
  metricNames: string[];
  paramNames: string[];
  tagNames: string[];
};

/**
 * Given an input string, returns a list of Clause objects
 * containing the clauses in the input and the indices of their
 * starting positions in the overall string.
 */
const getClausesAndStartIndex = (str: string) => {
  const re = /and[\s]+/gi;
  const results: EntitySearchAutoCompleteClause[] = [];
  let match, position;
  while (((position = re.lastIndex), (match = re.exec(str)))) {
    results.push({ clause: str.substring(position, match.index), startIndex: position });
  }
  results.push({ clause: str.substring(position), startIndex: position });
  return results;
};

/**
 * Filters out internal tag names and wrap names that include control characters in backticks.
 */
export const cleanEntitySearchTagNames = (tagNames: string[]) =>
  tagNames
    .filter((tag: string) => !tag.startsWith(MLFLOW_INTERNAL_PREFIX))
    .map((tag: string) => {
      if (tag.includes('"') || tag.includes(' ') || tag.includes('.')) {
        return `\`${tag}\``;
      } else if (tag.includes('`')) {
        return `"${tag}"`;
      } else return tag;
    });

export const getEntitySearchOptionsFromEntityNames = (
  entityNames: EntitySearchAutoCompleteEntityNameGroup,
  attributeOptions: EntitySearchAutoCompleteOption[],
): EntitySearchAutoCompleteOptionGroup[] => [
  {
    label: 'Metrics',
    options: entityNames.metricNames.map((m) => ({ value: `metrics.${m}` })),
  },
  {
    label: 'Parameters',
    options: entityNames.paramNames.map((p) => ({ value: `params.${p}` })),
  },
  {
    label: 'Tags',
    options: entityNames.tagNames.map((t) => ({ value: `tags.${t}` })),
  },
  {
    label: 'Attributes',
    options: attributeOptions,
  },
];

// Bolds a specified segment of `wholeText`.
const boldedText = (wholeText: string, shouldBeBold: string) => {
  // Escape all the special characters
  const escapedText = sanitizeStringForRegexp(shouldBeBold);

  const textArray = wholeText.split(RegExp(escapedText, 'ig'));
  const match = wholeText.match(RegExp(escapedText, 'ig'));

  return (
    // Autocomplete sets font weight to 600 on full match resulting in double bolding.
    // Override this here
    <span css={{ fontWeight: 'normal' }} data-testid={wholeText}>
      {textArray.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index !== textArray.length - 1 && match && <b>{match[index]}</b>}
        </React.Fragment>
      ))}
    </span>
  );
};

/**
 * Given an input string, returns a list of Entity objects
 * containing the search entities in the input and their
 * start and end indices in the whole string.
 */
export const getEntitySearchEntitiesAndIndices = (str: string) => {
  const re = />|<|>=|<=|=|!=|like|ilike/gi;
  const clauses = getClausesAndStartIndex(str);
  const results: EntitySearchAutoCompleteEntity[] = [];
  clauses.forEach((clauseObj) => {
    const clauseText = clauseObj.clause;
    const entity = clauseText.split(re)[0];
    const { startIndex } = clauseObj;
    results.push({
      name: entity,
      startIndex: 0 + startIndex,
      endIndex: entity.length + startIndex,
    });
  });
  return results;
};

export const getFilteredOptionsFromEntityName = (
  baseOptions: EntitySearchAutoCompleteOptionGroup[],
  entityBeingEdited: EntitySearchAutoCompleteEntity,
  suggestionLimits: Record<string, number>,
): EntitySearchAutoCompleteOptionGroup[] => {
  return baseOptions
    .map((group) => {
      const newOptions = group.options
        .filter((option) => option.value.toLowerCase().includes(entityBeingEdited.name.toLowerCase().trim()))
        .map((match) => ({
          value: match.value,
          label: boldedText(match.value, entityBeingEdited.name.trim()),
        }));
      const limitForGroup = suggestionLimits[group.label];
      const ellipsized = [
        ...newOptions.slice(0, limitForGroup),
        ...(newOptions.length > limitForGroup ? [{ label: '...', value: `..._${group.label}` }] : []),
      ];
      return {
        label: group.label,
        options: ellipsized,
      };
    })
    .filter((group) => group.options.length > 0);
};
```

--------------------------------------------------------------------------------

````

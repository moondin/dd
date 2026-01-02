---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 485
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 485 of 991)

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

---[FILE: ExperimentViewRunsTableResizer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsTableResizer.tsx
Signals: React

```typescript
import { Button, ChevronLeftIcon, ChevronRightIcon, useDesignSystemTheme } from '@databricks/design-system';
import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { useUpdateExperimentViewUIState } from '../../contexts/ExperimentPageUIStateContext';
import { Global } from '@emotion/react';

const RESIZE_BAR_WIDTH = 3;

/**
 * A component wrapping experiment runs table and providing a resizer
 * to adjust its width when displayed in a split view.
 */
export const ExperimentViewRunsTableResizer = ({
  runListHidden,
  width,
  onResize,
  children,
  onHiddenChange,
  maxWidth,
}: React.PropsWithChildren<{
  runListHidden: boolean;
  width: number;
  onResize: React.Dispatch<React.SetStateAction<number>>;
  onHiddenChange?: (isHidden: boolean) => void;
  maxWidth: number | undefined;
}>) => {
  const updateUIState = useUpdateExperimentViewUIState();
  const [dragging, setDragging] = useState(false);

  return (
    <>
      <ResizableBox
        css={{ display: 'flex', position: 'relative' }}
        style={{ flex: `0 0 ${runListHidden ? 0 : width}px` }}
        width={width}
        axis="x"
        resizeHandles={['e']}
        minConstraints={[250, 0]}
        maxConstraints={maxWidth === undefined ? undefined : [maxWidth, 0]}
        handle={
          <ExperimentViewRunsTableResizerHandle
            runListHidden={runListHidden}
            updateRunListHidden={(value) => {
              if (onHiddenChange) {
                onHiddenChange(value);
                return;
              }
              updateUIState((state) => ({ ...state, runListHidden: value }));
            }}
          />
        }
        onResize={(event, { size }) => {
          if (runListHidden) {
            return;
          }
          onResize(size.width);
        }}
        onResizeStart={() => !runListHidden && setDragging(true)}
        onResizeStop={() => setDragging(false)}
      >
        {children}
      </ResizableBox>
      {dragging && (
        <Global
          styles={{
            'body, :host': {
              userSelect: 'none',
            },
          }}
        />
      )}
    </>
  );
};

export const ExperimentViewRunsTableResizerHandle = React.forwardRef<
  HTMLDivElement,
  {
    updateRunListHidden: (newValue: boolean) => void;
    runListHidden: boolean;
  }
>(({ updateRunListHidden, runListHidden, ...props }, ref) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      ref={ref}
      {...props}
      css={{
        transition: 'opacity 0.2s',
        width: 0,
        overflow: 'visible',
        height: '100%',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        opacity: runListHidden ? 1 : 0,
        '&:hover': {
          opacity: 1,
          '.bar': { opacity: 1 },
          '.button': {
            border: `2px solid ${theme.colors.actionDefaultBorderHover}`,
          },
        },
      }}
    >
      <div
        css={{
          position: 'absolute',
          // For the resizing area, use the icon size which is
          // the same as "collapse" button
          left: -theme.general.iconSize / 2,
          width: theme.general.iconSize,
          cursor: runListHidden ? undefined : 'ew-resize',
          height: '100%',
          top: 0,
          bottom: 0,
        }}
      >
        <div
          className="button"
          css={{
            top: '50%',
            transition: 'border-color 0.2s',
            position: 'absolute',
            width: theme.general.iconSize,
            height: theme.general.iconSize,
            backgroundColor: theme.colors.backgroundPrimary,
            borderRadius: theme.general.iconSize,
            overflow: 'hidden',
            border: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 11,
          }}
        >
          <Button
            componentId="mlflow.experiment_page.table_resizer.collapse"
            onClick={() => updateRunListHidden(!runListHidden)}
            icon={runListHidden ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            size="small"
          />
        </div>
      </div>
      <div
        className="bar"
        css={{
          position: 'absolute',
          opacity: 0,
          left: -RESIZE_BAR_WIDTH / 2,
          width: RESIZE_BAR_WIDTH,
          height: '100%',
          top: 0,
          bottom: 0,
          backgroundColor: theme.colors.actionPrimaryBackgroundDefault,
        }}
      />
    </div>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsTableStatusBar.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsTableStatusBar.tsx

```typescript
import { Spinner, Typography } from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import { FormattedMessage } from 'react-intl';

interface ExperimentViewRunsTableStatusBarProps {
  isLoading: boolean;
  allRunsCount: number;
}

// Strongifies the i18n string, used in <FormattedMessage> below
const strong = (text: string) => <strong>{text}</strong>;

export const ExperimentViewRunsTableStatusBar = ({
  isLoading,
  allRunsCount,
}: ExperimentViewRunsTableStatusBarProps) => (
  <div css={styles.statusBar}>
    <Typography.Text size="sm" color={isLoading ? 'secondary' : undefined}>
      <FormattedMessage
        // eslint-disable-next-line max-len
        defaultMessage="<strong>{length}</strong> matching {length, plural, =0 {runs} =1 {run} other {runs}}"
        // eslint-disable-next-line max-len
        description="Message for displaying how many runs match search criteria on experiment page"
        values={{
          strong,
          length: allRunsCount,
        }}
      />
    </Typography.Text>
    {isLoading && <Spinner size="small" />}
  </div>
);

const styles = {
  statusBar: (theme: Theme) => ({
    height: 28,
    display: 'flex',
    gap: 8,
    marginTop: -1,
    position: 'relative' as const,
    alignItems: 'center',
    borderTop: `1px solid ${theme.colors.border}`,
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: RunsSearchAutoComplete.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/RunsSearchAutoComplete.enzyme.test.tsx
Signals: React

```typescript
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import React, { useState } from 'react';
import { DesignSystemProvider, Input } from '@databricks/design-system';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../../fixtures/experiment-runs.fixtures';
import { experimentRunsSelector } from '../../utils/experimentRuns.selector';
import { RunsSearchAutoComplete } from './RunsSearchAutoComplete';
import { ErrorWrapper } from '../../../../../common/utils/ErrorWrapper';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';

const MOCK_EXPERIMENT = EXPERIMENT_RUNS_MOCK_STORE.entities.experimentsById['123456789'];

const MOCK_RUNS_DATA = experimentRunsSelector(EXPERIMENT_RUNS_MOCK_STORE, {
  experiments: [MOCK_EXPERIMENT],
});

const onClearMock = jest.fn();

const doStatefulMock = (additionalProps?: any) => {
  const mockUpdateSearchFacets = jest.fn();
  let currentState: any;

  const getCurrentState = () => currentState;

  const Component = () => {
    const [searchFacetsState, setSearchFacetsState] = useState(() => createExperimentPageSearchFacetsState());

    currentState = searchFacetsState;

    const updateSearchFacets = (updatedFilterState: Partial<ExperimentPageSearchFacetsState>) => {
      mockUpdateSearchFacets(updatedFilterState);
      if (typeof updatedFilterState === 'function') {
        setSearchFacetsState(updatedFilterState);
      } else {
        setSearchFacetsState((s: any) => ({ ...s, ...updatedFilterState }));
      }
    };

    const props = {
      runsData: MOCK_RUNS_DATA,
      searchFilter: searchFacetsState.searchFilter,
      onSearchFilterChange: (newSearchFilter: string) => {
        updateSearchFacets({ searchFilter: newSearchFilter });
      },
      onClear: onClearMock,
    } as any;
    return (
      <DesignSystemProvider>
        <RunsSearchAutoComplete {...{ ...props, ...additionalProps }} />
      </DesignSystemProvider>
    );
  };
  return {
    wrapper: mountWithIntl(<Component />),
    mockUpdateSearchFacets,
    getCurrentState,
  };
};

describe('AutoComplete', () => {
  test('Dialog has correct base options', () => {
    const { wrapper } = doStatefulMock();
    const groups = (wrapper.find('AutoComplete').props() as any).options;
    wrapper.update();
    expect(groups.length).toBe(4);
  });

  test('Dialog has correct options when starting to type metric name', () => {
    const { wrapper } = doStatefulMock();
    const searchBox = wrapper.find("input[data-testid='search-box']");
    searchBox.simulate('change', { target: { value: 'metrics.' } });

    (wrapper.find(Input).prop('onClick') as any)();
    wrapper.update();

    // Should only have metric option group
    const props = wrapper.find('AutoComplete').props() as any;
    const groups = props.options;
    expect(props.open).toBe(true);
    expect(groups.length).toBe(1);
    expect(groups[0].label).toBe('Metrics');
  });

  test('Dialog opens when typing full metric name', () => {
    const { wrapper } = doStatefulMock();
    const searchBox = wrapper.find("input[data-testid='search-box']");
    searchBox.simulate('change', { target: { value: 'metrics.met1' } });

    (wrapper.find(Input).prop('onClick') as any)();
    wrapper.update();

    const props = wrapper.find('AutoComplete').props() as any;
    const groups = props.options;
    expect(props.open).toBe(true);
    expect(groups.length).toBe(1);
    expect(groups[0].options[0].value).toBe('metrics.met1');
  });

  test('Dialog closes when typing entity name and comparator', () => {
    const { wrapper } = doStatefulMock();
    const searchBox = wrapper.find("input[data-testid='search-box']");
    searchBox.simulate('change', { target: { value: 'metrics.met1' } });
    searchBox.simulate('change', { target: { value: 'metrics.met1<' } });

    (wrapper.find(Input).prop('onClick') as any)();
    wrapper.update();

    const props = wrapper.find('AutoComplete').props() as any;
    expect(props.open).toBe(false);
  });

  test('Dialog is not open with a full search clause', () => {
    const { wrapper } = doStatefulMock();
    const searchBox = wrapper.find("input[data-testid='search-box']");
    searchBox.simulate('change', { target: { value: 'metrics.met1' } });
    searchBox.simulate('change', { target: { value: 'metrics.met1 < 3' } });

    (wrapper.find(Input).prop('onClick') as any)();
    wrapper.update();

    const props = wrapper.find('AutoComplete').props() as any;
    expect(props.open).toBe(false);
  });

  test('Dialog is not open with `and` and no space', () => {
    const { wrapper } = doStatefulMock();
    const searchBox = wrapper.find("input[data-testid='search-box']");
    searchBox.simulate('change', { target: { value: 'metrics.met1 < 3' } });
    searchBox.simulate('change', { target: { value: 'metrics.met1 < 3 and' } });

    (wrapper.find(Input).prop('onClick') as any)();
    wrapper.update();

    const props = wrapper.find('AutoComplete').props() as any;
    expect(props.open).toBe(false);
  });

  test('Dialog opens with `and` and a space', () => {
    const { wrapper } = doStatefulMock();
    const searchBox = wrapper.find("input[data-testid='search-box']");
    searchBox.simulate('change', { target: { value: 'metrics.met1 < 3' } });
    searchBox.simulate('change', { target: { value: 'metrics.met1 < 3 and' } });
    searchBox.simulate('change', { target: { value: 'metrics.met1 < 3 and ' } });

    (wrapper.find(Input).prop('onClick') as any)();
    wrapper.update();

    const props = wrapper.find('AutoComplete').props() as any;
    const groups = props.options;
    expect(props.open).toBe(true);
    expect(groups.length).toBe(4); // all groups should be visible here
  });

  test('Options are targeted at entity last edited', () => {
    const { wrapper } = doStatefulMock();
    const searchBox = wrapper.find("input[data-testid='search-box']");
    searchBox.simulate('change', { target: { value: 'metrics.met1 < 3 and params.p1 < 2' } });
    searchBox.simulate('change', { target: { value: 'metrics.met1 < 3 and params.p < 2' } });

    (wrapper.find(Input).prop('onClick') as any)();
    wrapper.update();

    let groups = (wrapper.find('AutoComplete').props() as any).options;
    expect(groups.length).toBe(1);
    expect(groups[0].label).toBe('Parameters');
    expect(groups[0].options.length).toBe(3); // all params should be shown here
    expect(groups[0].options[0].value).toBe('params.p1');
    expect(groups[0].options[1].value).toBe('params.p2');

    searchBox.simulate('change', { target: { value: 'metrics.met < 3 and params.p < 2' } });
    wrapper.update();
    groups = (wrapper.find('AutoComplete').props() as any).options;
    expect(groups.length).toBe(1);
    expect(groups[0].label).toBe('Metrics');
    expect(groups[0].options.length).toBe(3);
    expect(groups[0].options[0].value).toBe('metrics.met1');
    expect(groups[0].options[2].value).toBe('metrics.met3');
  });

  test('Dialog stays open when typing an entity name with it', () => {
    const { wrapper } = doStatefulMock();
    const searchBox = wrapper.find("input[data-testid='search-box']");

    searchBox.simulate('change', { target: { value: 'tags.' } });
    (wrapper.find(Input).prop('onClick') as any)();
    wrapper.update();
    let groups = (wrapper.find('AutoComplete').props() as any).options;
    expect(groups.length).toBe(1);
    expect(groups[0].label).toBe('Tags');
    expect(groups[0].options.length).toBe(4);

    searchBox.simulate('change', { target: { value: 'tags.`' } });
    wrapper.update();
    groups = (wrapper.find('AutoComplete').props() as any).options;
    expect(groups.length).toBe(1);
    expect(groups[0].label).toBe('Tags');
    expect(groups[0].options.length).toBe(1);
    expect(groups[0].options[0].value).toBe('tags.`tag with a space`');

    searchBox.simulate('change', { target: { value: 'tags.` ' } });
    wrapper.update();
    groups = (wrapper.find('AutoComplete').props() as any).options;
    expect(groups.length).toBe(1);
    expect(groups[0].label).toBe('Tags');
    expect(groups[0].options.length).toBe(1);
    expect(groups[0].options[0].value).toBe('tags.`tag with a space`');

    searchBox.simulate('change', { target: { value: 'tags.`tag w' } });
    wrapper.update();
    groups = (wrapper.find('AutoComplete').props() as any).options;
    expect(groups.length).toBe(1);
    expect(groups[0].label).toBe('Tags');
    expect(groups[0].options.length).toBe(1);
    expect(groups[0].options[0].value).toBe('tags.`tag with a space`');
  });
});

describe('Input', () => {
  test('should update search facets model when searching by query', () => {
    const props = {
      runsData: MOCK_RUNS_DATA,
      onSearchFilterChange: jest.fn(),
      requestError: null,
    };

    const { wrapper } = doStatefulMock(props);

    const searchInput = wrapper.find("input[data-testid='search-box']");
    searchInput.simulate('change', { target: { value: 'test-query' } });
    searchInput.simulate('keydown', { key: 'Enter' });
    // First keydown dismisses autocomplete, second will search
    searchInput.simulate('keydown', { key: 'Enter' });

    expect(props.onSearchFilterChange).toHaveBeenCalledWith('test-query');
  });

  test('should update search facets model and properly clear filters afterwards', () => {
    const { wrapper, getCurrentState } = doStatefulMock();

    wrapper.find("input[data-testid='search-box']").simulate('change', { target: { value: 'test-query' } });
    wrapper.find("input[data-testid='search-box']").simulate('keydown', { key: 'Enter' });
    // First keydown dismisses autocomplete, second will search
    wrapper.find("input[data-testid='search-box']").simulate('keydown', { key: 'Enter' });

    expect(getCurrentState()).toMatchObject(expect.objectContaining({ searchFilter: 'test-query' }));

    expect(onClearMock).not.toHaveBeenCalled();

    wrapper.find("input[data-testid='search-box']").simulate('click');
    wrapper.find("button[data-testid='clear-button']").simulate('click');

    expect(onClearMock).toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunsSearchAutoComplete.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/RunsSearchAutoComplete.test.tsx

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { render, screen, waitFor } from '@testing-library/react';
import { RunsSearchAutoComplete } from './RunsSearchAutoComplete';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider } from '@databricks/design-system';
import { shouldUseRegexpBasedAutoRunsSearchFilter } from '../../../../../common/utils/FeatureUtils';

jest.mock('../../../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../../../common/utils/FeatureUtils')>(
    '../../../../../common/utils/FeatureUtils',
  ),
  shouldUseRegexpBasedAutoRunsSearchFilter: jest.fn(),
}));

describe('RunsSearchAutoComplete', () => {
  const onClear = jest.fn();
  const onSearchFilterChange = jest.fn();

  const renderTestComponent = ({ requestError = null }: { requestError?: Error | null } = {}) => {
    render(
      <RunsSearchAutoComplete
        onClear={onClear}
        onSearchFilterChange={onSearchFilterChange}
        requestError={requestError}
        runsData={{
          datasetsList: [],
          experimentTags: {},
          metricKeyList: [],
          metricsList: [],
          modelVersionsByRunUuid: {},
          paramKeyList: [],
          paramsList: [],
          runInfos: [],
          runUuidsMatchingFilter: [],
          tagsList: [],
        }}
        searchFilter=""
      />,
      {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <DesignSystemProvider>{children}</DesignSystemProvider>
          </IntlProvider>
        ),
      },
    );
  };
  it('should render', async () => {
    // Enable automatic transformation from plain text to regexp-based RLIKE filter
    jest.mocked(shouldUseRegexpBasedAutoRunsSearchFilter).mockReturnValue(true);
    renderTestComponent();

    await userEvent.type(screen.getByRole('combobox'), 'foobar{Enter}');

    // Wait for the search filter to be updated
    await waitFor(() => {
      expect(onSearchFilterChange).toHaveBeenCalledWith('foobar');
    });

    // Expect relevant tooltip to be displayed
    expect(
      screen.getByLabelText(/The following query will be used: attributes\.run_name RLIKE 'foobar'/),
    ).toBeInTheDocument();
  });

  it('should display informational tooltip on error', async () => {
    // Render a component with a simulated syntax error
    renderTestComponent({ requestError: new Error('Bad syntax') });

    // Help tooltip should be displayed immediately
    expect(await screen.findByText(/Search runs using a simplified version of the SQL/)).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunsSearchAutoComplete.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/RunsSearchAutoComplete.tsx
Signals: React

```typescript
import { useMemo, useRef } from 'react';
import type { ErrorWrapper } from '../../../../../common/utils/ErrorWrapper';
import { EntitySearchAutoComplete } from '../../../EntitySearchAutoComplete';
import type { ExperimentRunsSelectorResult } from '../../utils/experimentRuns.selector';
import { RunsSearchTooltipContent } from './RunsSearchTooltipContent';
import type {
  EntitySearchAutoCompleteEntityNameGroup,
  EntitySearchAutoCompleteOptionGroup,
} from '../../../EntitySearchAutoComplete.utils';
import {
  cleanEntitySearchTagNames,
  getEntitySearchOptionsFromEntityNames,
} from '../../../EntitySearchAutoComplete.utils';
import { shouldUseRegexpBasedAutoRunsSearchFilter } from '../../../../../common/utils/FeatureUtils';

// A default placeholder for the search box
const SEARCH_BOX_PLACEHOLDER = 'metrics.rmse < 1 and params.model = "tree"';

export type RunsSearchAutoCompleteProps = {
  runsData: ExperimentRunsSelectorResult;
  searchFilter: string;
  onSearchFilterChange: (newValue: string) => void;
  onClear: () => void;
  requestError: ErrorWrapper | Error | null;
  className?: string;
};

const ATTRIBUTE_OPTIONS = [
  'run_id',
  'run_name',
  'status',
  'artifact_uri',
  'user_id',
  'start_time',
  'end_time',
  'created',
].map((s) => ({ value: `attributes.${s}` }));

const mergeDeduplicate = (list1: string[], list2: string[]) => [...new Set([...list1, ...list2])];
const getTagNames = (tagsList: any[]) => tagsList.flatMap((tagRecord) => Object.keys(tagRecord));

const getEntityNamesFromRunsData = (
  newRunsData: ExperimentRunsSelectorResult,
  existingNames: EntitySearchAutoCompleteEntityNameGroup,
): EntitySearchAutoCompleteEntityNameGroup => {
  const metricNames = mergeDeduplicate(existingNames.metricNames, newRunsData.metricKeyList);
  const paramNames = mergeDeduplicate(existingNames.paramNames, newRunsData.paramKeyList);
  const tagNames = cleanEntitySearchTagNames(
    mergeDeduplicate(getTagNames(existingNames.tagNames), getTagNames(newRunsData.tagsList)),
  );

  return {
    metricNames,
    paramNames,
    tagNames,
  };
};

export const RunsSearchAutoComplete = ({ runsData, ...restProps }: RunsSearchAutoCompleteProps) => {
  const existingEntityNamesRef = useRef<EntitySearchAutoCompleteEntityNameGroup>({
    metricNames: [],
    paramNames: [],
    tagNames: [],
  });

  const baseOptions = useMemo<EntitySearchAutoCompleteOptionGroup[]>(() => {
    const existingEntityNames = existingEntityNamesRef.current;
    const mergedEntityNames = getEntityNamesFromRunsData(runsData, existingEntityNames);
    existingEntityNamesRef.current = mergedEntityNames;
    return getEntitySearchOptionsFromEntityNames(mergedEntityNames, ATTRIBUTE_OPTIONS);
  }, [runsData]);

  return (
    <EntitySearchAutoComplete
      {...restProps}
      baseOptions={baseOptions}
      tooltipContent={<RunsSearchTooltipContent />}
      placeholder={SEARCH_BOX_PLACEHOLDER}
      useQuickFilter={shouldUseRegexpBasedAutoRunsSearchFilter()}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsSearchTooltipContent.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/RunsSearchTooltipContent.tsx
Signals: React

```typescript
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ExperimentRunSearchSyntaxDocUrl } from '../../../../../common/constants';

export const RunsSearchTooltipContent = () => {
  return (
    <div className="search-input-tooltip-content">
      <FormattedMessage
        defaultMessage="Search runs using a simplified version of the SQL {whereBold} clause."
        description="Tooltip string to explain how to search runs from the experiments table"
        values={{ whereBold: <b>WHERE</b> }}
      />{' '}
      <FormattedMessage
        defaultMessage="<link>Learn more</link>"
        description="Learn more tooltip link to learn more on how to search in an experiments run table"
        values={{
          link: (chunks: any) => (
            <a href={ExperimentRunSearchSyntaxDocUrl} target="_blank" rel="noopener noreferrer">
              {chunks}
            </a>
          ),
        }}
      />
      <br />
      <FormattedMessage defaultMessage="Examples:" description="Text header for examples of mlflow search syntax" />
      <br />
      {'• metrics.rmse >= 0.8'}
      <br />
      {'• metrics.`f1 score` < 1'}
      <br />
      • params.model = 'tree'
      <br />
      • attributes.run_name = 'my run'
      <br />
      • tags.`mlflow.user` = 'myUser'
      <br />
      {"• metric.f1_score > 0.9 AND params.model = 'tree'"}
      <br />
      • dataset.name IN ('dataset1', 'dataset2')
      <br />
      • attributes.run_id IN ('a1b2c3d4', 'e5f6g7h8')
      <br />• tags.model_class LIKE 'sklearn.linear_model%'
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AggregateMetricValueCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/AggregateMetricValueCell.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { RunRowType } from '../../../utils/experimentPage.row-types';

export const AggregateMetricValueCell = ({
  value,
  data,
  valueFormatted,
}: {
  value: string;
  valueFormatted: null | string;
  data: RunRowType;
}) => {
  const { theme } = useDesignSystemTheme();
  if (data.groupParentInfo?.aggregateFunction) {
    return (
      <Typography.Text>
        {valueFormatted ?? value}{' '}
        <span css={{ color: theme.colors.textSecondary }}>({data.groupParentInfo.aggregateFunction})</span>
      </Typography.Text>
    );
  }
  return value;
};
```

--------------------------------------------------------------------------------

---[FILE: cells.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/cells.stories.tsx
Signals: React

```typescript
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import { AgGridReact } from '@ag-grid-community/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from '../../../../../../common/utils/RoutingUtils';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../../../fixtures/experiment-runs.fixtures';
import type {
  RunRowDateAndNestInfo,
  RunRowModelsInfo,
  RunRowType,
  RunRowVersionInfo,
} from '../../../utils/experimentPage.row-types';
import { ColumnHeaderCell } from './ColumnHeaderCell';
import { DateCellRenderer } from './DateCellRenderer';
import { ExperimentNameCellRenderer } from './ExperimentNameCellRenderer';
import { ModelsCellRenderer } from './ModelsCellRenderer';
import { SourceCellRenderer } from './SourceCellRenderer';
import { VersionCellRenderer } from './VersionCellRenderer';

export default {
  title: 'ExperimentView/Table Cells',
  argTypes: {},
};

const MOCK_MODEL = EXPERIMENT_RUNS_MOCK_STORE.entities.modelVersionsByRunUuid['experiment123456789_run4'][0];

const createAgTable = (
  component: React.ComponentType<React.PropsWithChildren<any>>,
  name: string,
  defs?: any[],
  rows?: any[],
) => (
  <div className="ag-theme-balham" style={{ height: 400 }}>
    <MemoryRouter initialEntries={['/']}>
      <IntlProvider locale="en">
        <AgGridReact
          components={{ [name]: component }}
          suppressMovableColumns
          columnDefs={
            defs || [
              {
                field: 'key',
                headerName: 'Key',
                headerComponentParams: {
                  canonicalSortKey: 'key',
                  orderByKey: 'key',
                  orderByAsc: true,
                  enableSorting: true,
                  onSortBy: () => {},
                },
              },
              { field: 'foo', headerName: 'Foo' },
            ]
          }
          rowData={
            rows || [
              { id: 'test-1', key: 'value', foo: 'bar' },
              { id: 'test-2', key: 'other value', foo: 'baz' },
            ]
          }
          modules={[ClientSideRowModelModule]}
          rowModelType="clientSide"
          domLayout="normal"
        />
      </IntlProvider>
    </MemoryRouter>
  </div>
);

export const ColumnHeader = () => {
  return createAgTable(ColumnHeaderCell, 'agColumnHeader');
};
export const DateRenderer = () => {
  const rowsWithDateAndNestInfo: { date: RunRowDateAndNestInfo }[] = [10000, 100000, 1000000].map((timeAgo) => ({
    date: {
      childrenIds: [],
      expanderOpen: false,
      experimentId: '12345',
      hasExpander: false,
      isParent: false,
      level: 0,
      referenceTime: new Date(),
      runStatus: 'FINISHED',
      runUuid: '123',
      startTime: Date.now() - timeAgo,
      belongsToGroup: false,
    },
  }));

  return createAgTable(
    DateCellRenderer,
    'dateCellRenderer',
    [
      {
        field: 'date',
        cellRenderer: 'dateCellRenderer',
      },
    ],
    rowsWithDateAndNestInfo,
  );
};
export const DateRendererWithExpander = () => {
  const rowsWithDateAndNestInfo: { date: Partial<RunRowDateAndNestInfo> }[] = [
    {
      date: {
        childrenIds: ['1001', '1002'],
        expanderOpen: true,
        experimentId: '12345',
        hasExpander: true,
        isParent: true,
        level: 0,
        referenceTime: new Date(),
        runStatus: 'FINISHED',
        runUuid: '1000',
        startTime: Date.now() - 10000,
      },
    },
    {
      date: {
        childrenIds: [],
        expanderOpen: false,
        experimentId: '12345',
        level: 1,
        runStatus: 'FINISHED',
        runUuid: '1001',
        startTime: Date.now() - 10000,
      },
    },
    {
      date: {
        childrenIds: [],
        expanderOpen: false,
        experimentId: '12345',
        level: 1,
        runStatus: 'FINISHED',
        runUuid: '1002',
        startTime: Date.now() - 10000,
      },
    },
  ];

  return createAgTable(
    DateCellRenderer,
    'dateCellRenderer',
    [
      {
        field: 'date',
        cellRenderer: 'dateCellRenderer',
        cellRendererParams: { onExpand: () => {} },
      },
    ],
    rowsWithDateAndNestInfo,
  );
};

export const ExperimentName = () => {
  return createAgTable(
    ExperimentNameCellRenderer,
    'experimentNameCellRenderer',
    [
      {
        field: 'experimentName',
        cellRenderer: 'experimentNameCellRenderer',
        cellRendererParams: {},
      },
    ],
    [
      {
        experimentId: 12345,
        experimentName: { name: 'An experiment name', basename: 'An experiment basename' },
      },
      {
        experimentId: 321,
        experimentName: { name: 'Other experiment name', basename: 'Other experiment basename' },
      },
    ],
  );
};

export const ModelsRenderer = () => {
  const loggedModels = [
    {
      artifactPath: 'model',
      flavors: ['sklearn'],
      utcTimeCreated: 1000,
    },
  ];
  const rowsWithModelInfo: { models: Partial<RunRowModelsInfo> }[] = [
    {
      models: {
        experimentId: '1234',
        registeredModels: [MOCK_MODEL],
        loggedModels: loggedModels,
      },
    },
    {
      models: {
        experimentId: '1234',
        registeredModels: [{ ...MOCK_MODEL, version: '2' }],
        loggedModels: loggedModels,
      },
    },
  ];

  return createAgTable(
    ModelsCellRenderer,
    'modelsCellRenderer',
    [
      {
        field: 'models',
        cellRenderer: 'modelsCellRenderer',
        cellRendererParams: {},
      },
    ],
    rowsWithModelInfo,
  );
};

export const SourceRenderer = () => {
  const rowsWithTagsInfo: Partial<RunRowType>[] = [
    {
      tags: {
        'mlflow.source.name': { key: 'mlflow.source.name', value: 'Notebook name' },
        'mlflow.databricks.notebookID': { key: 'mlflow.databricks.notebookID', value: '123456' },
        'mlflow.source.type': { key: 'mlflow.source.type', value: 'NOTEBOOK' },
      },
    },
    {
      tags: {
        'mlflow.source.name': {
          key: 'mlflow.source.name',
          value: 'https://github.com/xyz/path-to-repo',
        },
        'mlflow.source.type': { key: 'mlflow.source.type', value: 'LOCAL' },
      },
    },
    {
      tags: {
        'mlflow.source.name': {
          key: 'mlflow.source.name',
          value: 'https://github.com/xyz/path-to-repo',
        },
        'mlflow.source.type': { key: 'mlflow.source.type', value: 'PROJECT' },
      },
    },
    {
      tags: {
        'mlflow.source.name': { key: 'mlflow.source.name', value: '1234' },
        'mlflow.databricks.jobID': { key: 'mlflow.databricks.jobID', value: '1234' },
        'mlflow.databricks.jobRunID': { key: 'mlflow.databricks.jobRunID', value: '4321' },
        'mlflow.source.type': { key: 'mlflow.source.type', value: 'JOB' },
      },
    },
  ];

  return createAgTable(
    SourceCellRenderer,
    'sourceCellRenderer',
    [
      {
        field: 'tags',
        cellRenderer: 'sourceCellRenderer',
        cellRendererParams: {},
      },
    ],
    rowsWithTagsInfo,
  );
};

export const VersionRenderer = () => {
  const rowsWithVersionInfo: { version: Partial<RunRowVersionInfo> }[] = [
    {
      version: {
        name: 'https://github.com/xyz/path-to-repo',
        type: 'PROJECT',
        version: '654321',
      },
    },
    {
      version: {
        name: 'Just a version',
        type: 'OTHER',
        version: '123',
      },
    },
  ];

  return createAgTable(
    VersionCellRenderer,
    'versionCellRenderer',
    [
      {
        field: 'version',
        cellRenderer: 'versionCellRenderer',
        cellRendererParams: {},
      },
    ],
    rowsWithVersionInfo,
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ColumnHeaderCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/ColumnHeaderCell.tsx

```typescript
import { SortAscendingIcon, SortDescendingIcon, useDesignSystemTheme } from '@databricks/design-system';
import { useUpdateExperimentPageSearchFacets } from '../../../hooks/useExperimentPageSearchFacets';

export interface ColumnHeaderCellProps {
  enableSorting: boolean;
  displayName: string;
  canonicalSortKey: string;
  context: {
    orderByKey: string;
    orderByAsc: boolean;
  };
}

export const ColumnHeaderCell = ({
  enableSorting,
  canonicalSortKey,
  displayName,
  context: tableContext,
}: ColumnHeaderCellProps) => {
  const { orderByKey, orderByAsc } = tableContext || {};
  const updateSearchFacets = useUpdateExperimentPageSearchFacets();
  const selectedCanonicalSortKey = canonicalSortKey;

  const handleSortBy = () => {
    let newOrderByAsc = !orderByAsc;

    // If the new sortKey is not equal to the previous sortKey, reset the orderByAsc
    if (selectedCanonicalSortKey !== orderByKey) {
      newOrderByAsc = false;
    }
    updateSearchFacets({ orderByKey: selectedCanonicalSortKey, orderByAsc: newOrderByAsc });
  };

  const { theme } = useDesignSystemTheme();
  const isOrderedByClassName = 'is-ordered-by';

  return (
    <div
      role="columnheader"
      css={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        css={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          paddingLeft: theme.spacing.xs + theme.spacing.sm,
          paddingRight: theme.spacing.xs + theme.spacing.sm,
          gap: theme.spacing.sm,
          svg: {
            color: theme.colors.textSecondary,
          },
          '&:hover': {
            color: enableSorting ? theme.colors.actionTertiaryTextHover : 'unset',
            svg: {
              color: theme.colors.actionTertiaryTextHover,
            },
          },
        }}
        className={selectedCanonicalSortKey === orderByKey ? isOrderedByClassName : ''}
        onClick={enableSorting ? handleSortBy : undefined}
      >
        <span data-testid={`sort-header-${displayName}`}>{displayName}</span>
        {enableSorting && selectedCanonicalSortKey === orderByKey ? (
          orderByAsc ? (
            <SortAscendingIcon />
          ) : (
            <SortDescendingIcon />
          )
        ) : null}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 447
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 447 of 991)

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

---[FILE: ExperimentListTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ExperimentListTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import { useMemo } from 'react';
import type { CursorPaginationProps } from '@databricks/design-system';
import {
  Checkbox,
  useDesignSystemTheme,
  Empty,
  NoIcon,
  Table,
  CursorPagination,
  TableRow,
  TableHeader,
  TableCell,
  TableSkeletonRows,
} from '@databricks/design-system';
import 'react-virtualized/styles.css';
import type { ExperimentEntity } from '../types';
import type { ColumnDef, OnChangeFn, RowSelectionState, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel } from '@tanstack/react-table';
import { isEmpty } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import Utils from '../../common/utils/Utils';
import { Link } from '../../common/utils/RoutingUtils';
import Routes from '../routes';
import { ExperimentListTableTagsCell } from './ExperimentListTableTagsCell';

export type ExperimentTableColumnDef = ColumnDef<ExperimentEntity>;

export type ExperimentTableMetadata = { onEditTags: (editedEntity: ExperimentEntity) => void };

const useExperimentsTableColumns = () => {
  const intl = useIntl();
  return useMemo(() => {
    const resultColumns: ExperimentTableColumnDef[] = [
      {
        header: ({ table }) => (
          <Checkbox
            componentId="mlflow.experiment_list_view.check_all_box"
            isChecked={table.getIsSomeRowsSelected() ? null : table.getIsAllRowsSelected()}
            onChange={(_, event) => table.getToggleAllRowsSelectedHandler()(event)}
          />
        ),
        id: 'select',
        cell: ExperimentListCheckbox,
        enableSorting: false,
      },
      {
        header: intl.formatMessage({
          defaultMessage: 'Name',
          description: 'Header for the name column in the experiments table',
        }),
        accessorKey: 'name',
        id: 'name',
        cell: ExperimentListTableCell,
        enableSorting: true,
      },
      {
        header: intl.formatMessage({
          defaultMessage: 'Time created',
          description: 'Header for the time created column in the experiments table',
        }),
        id: 'creation_time',
        accessorFn: ({ creationTime }) => Utils.formatTimestamp(creationTime, intl),
        enableSorting: true,
      },
      {
        header: intl.formatMessage({
          defaultMessage: 'Last modified',
          description: 'Header for the last modified column in the experiments table',
        }),
        id: 'last_update_time',
        accessorFn: ({ lastUpdateTime }) => Utils.formatTimestamp(lastUpdateTime, intl),
        enableSorting: true,
      },
      {
        header: intl.formatMessage({
          defaultMessage: 'Description',
          description: 'Header for the description column in the experiments table',
        }),
        id: 'description',
        accessorFn: ({ tags }) => tags?.find(({ key }) => key === 'mlflow.note.content')?.value ?? '-',
        enableSorting: false,
      },
      {
        header: intl.formatMessage({
          defaultMessage: 'Tags',
          description: 'Header for the tags column in the experiments table',
        }),
        id: 'tags',
        accessorKey: 'tags',
        enableSorting: false,
        cell: ExperimentListTableTagsCell,
      },
    ];

    return resultColumns;
  }, [intl]);
};

export const ExperimentListTable = ({
  experiments,
  isFiltered,
  isLoading,
  rowSelection,
  setRowSelection,
  cursorPaginationProps,
  sortingProps: { sorting, setSorting },
  onEditTags,
}: {
  experiments?: ExperimentEntity[];
  isFiltered?: boolean;
  isLoading: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  cursorPaginationProps?: Omit<CursorPaginationProps, 'componentId'>;
  sortingProps: { sorting: SortingState; setSorting: OnChangeFn<SortingState> };
  onEditTags: (editedEntity: ExperimentEntity) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const columns = useExperimentsTableColumns();

  const table = useReactTable('mlflow/server/js/src/experiment-tracking/components/ExperimentListTable.tsx', {
    data: experiments ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.experimentId,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: { rowSelection, sorting },
    meta: { onEditTags } satisfies ExperimentTableMetadata,
  });

  const getEmptyState = () => {
    const isEmptyList = !isLoading && isEmpty(experiments);
    if (isEmptyList && isFiltered) {
      return (
        <Empty
          image={<NoIcon />}
          title={
            <FormattedMessage
              defaultMessage="No experiments found"
              description="Label for the empty state in the experiments table when no experiments are found"
            />
          }
          description={null}
        />
      );
    }
    if (isEmptyList) {
      return (
        <Empty
          title={
            <FormattedMessage
              defaultMessage="No experiments created"
              description="A header for the empty state in the experiments table"
            />
          }
          description={
            <FormattedMessage
              defaultMessage='Use "Create experiment" button in order to create a new experiment'
              description="Guidelines for the user on how to create a new experiment in the experiments list page"
            />
          }
        />
      );
    }

    return null;
  };

  const selectColumnStyles = { flex: 'none', height: theme.general.heightBase };

  return (
    <Table
      scrollable
      pagination={
        cursorPaginationProps ? (
          <CursorPagination {...cursorPaginationProps} componentId="mlflow.experiment_list_view.pagination" />
        ) : undefined
      }
      empty={getEmptyState()}
    >
      <TableRow isHeader>
        {table.getLeafHeaders().map((header) => (
          <TableHeader
            componentId="mlflow.experiment_list_view.table.header"
            key={header.id}
            css={header.column.id === 'select' ? selectColumnStyles : undefined}
            sortable={header.column.getCanSort()}
            sortDirection={header.column.getIsSorted() || 'none'}
            onToggleSort={header.column.getToggleSortingHandler()}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </TableHeader>
        ))}
      </TableRow>
      {isLoading ? (
        <TableSkeletonRows table={table} />
      ) : (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} css={{ height: theme.general.buttonHeight }} data-testid="experiment-list-item">
            {row.getAllCells().map((cell) => (
              <TableCell
                key={cell.id}
                css={{ alignItems: 'center', ...(cell.column.id === 'select' ? selectColumnStyles : undefined) }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </Table>
  );
};

const ExperimentListTableCell: ExperimentTableColumnDef['cell'] = ({ row: { original } }) => {
  return (
    <Link
      className="experiment-link"
      css={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
      to={Routes.getExperimentPageRoute(original.experimentId)}
      title={original.name}
      data-testid="experiment-list-item-link"
    >
      {original.name}
    </Link>
  );
};

const ExperimentListCheckbox: ExperimentTableColumnDef['cell'] = ({ row }) => {
  return (
    <Checkbox
      componentId="mlflow.experiment_list_view.check_box"
      id={row.original.experimentId}
      key={row.original.experimentId}
      data-testid="experiment-list-item-check-box"
      isChecked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onChange={row.getToggleSelectedHandler()}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentListTableTagsCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ExperimentListTableTagsCell.tsx

```typescript
import { Button, PencilIcon } from '@databricks/design-system';
import 'react-virtualized/styles.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { KeyValueTag } from '../../common/components/KeyValueTag';
import { isUserFacingTag } from '../../common/utils/TagUtils';
import type { ExperimentTableColumnDef, ExperimentTableMetadata } from './ExperimentListTable';

export const ExperimentListTableTagsCell: ExperimentTableColumnDef['cell'] = ({
  row: { original },
  table: {
    options: { meta },
  },
}) => {
  const intl = useIntl();

  const { onEditTags } = meta as ExperimentTableMetadata;

  const visibleTagList = original?.tags?.filter((tag) => isUserFacingTag(tag.key)) || [];
  const containsTags = visibleTagList.length > 0;

  return (
    <div css={{ display: 'flex' }}>
      <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex' }}>
        {visibleTagList?.map((tag) => (
          <KeyValueTag key={tag.key} tag={tag} />
        ))}
      </div>
      <Button
        componentId="mlflow.experiment.list.tag.add"
        size="small"
        icon={!containsTags ? undefined : <PencilIcon />}
        onClick={() => onEditTags?.(original)}
        aria-label={intl.formatMessage({
          defaultMessage: 'Edit tags',
          description: 'Label for the edit tags button in the experiment list table',
        })}
        css={{
          flexShrink: 0,
          opacity: 0,
          '[role=row]:hover &': {
            opacity: 1,
          },
          '[role=row]:focus-within &': {
            opacity: 1,
          },
        }}
        type="tertiary"
      >
        {!containsTags ? (
          <FormattedMessage
            defaultMessage="Add tags"
            description="Label for the add tags button in the experiment list table"
          />
        ) : undefined}
      </Button>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentListView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ExperimentListView.test.tsx
Signals: Redux/RTK

```typescript
import { jest, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { screen, renderWithIntl } from '../../common/utils/TestUtils.react18';
import { BrowserRouter } from '../../common/utils/RoutingUtils';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { ExperimentListView } from './ExperimentListView';
import Fixtures from '../utils/test-utils/Fixtures';
import { DesignSystemProvider } from '@databricks/design-system';
import { useExperimentListQuery } from './experiment-page/hooks/useExperimentListQuery';
import { useUpdateExperimentTags } from './experiment-page/hooks/useUpdateExperimentTags';

jest.mock('./experiment-page/hooks/useExperimentListQuery', () => ({
  useExperimentListQuery: jest.fn(),
  useInvalidateExperimentList: jest.fn(),
}));

jest.mock('./experiment-page/hooks/useUpdateExperimentTags', () => ({
  useUpdateExperimentTags: jest.fn(),
}));

const mountComponent = (props: any) => {
  const mockStore = configureStore([thunk, promiseMiddleware()]);

  jest.mocked(useExperimentListQuery).mockImplementation(() => ({
    data: props.experiments.slice(25),
    error: undefined,
    isLoading: false,
    hasNextPage: false,
    hasPreviousPage: false,
    onNextPage: jest.fn(),
    onPreviousPage: jest.fn(),
    // @ts-expect-error Type 'Mock<UnknownFunction>' is not assignable to parameter
    refetch: jest.fn(),
    pageSizeSelect: {
      options: [10],
      default: 10,
      onChange: jest.fn(),
    },
    sorting: [],
    setSorting: jest.fn(),
  }));

  jest.mocked(useUpdateExperimentTags).mockReturnValue({
    isLoading: false,
    EditTagsModal: <span />,
    showEditExperimentTagsModal: jest.fn(),
  });

  return renderWithIntl(
    <DesignSystemProvider>
      <Provider
        store={mockStore({
          entities: {
            experimentsById: {},
          },
        })}
      >
        <BrowserRouter>
          <ExperimentListView />
        </BrowserRouter>
      </Provider>
    </DesignSystemProvider>,
  );
};

test('If button to create experiment is pressed then open CreateExperimentModal', async () => {
  mountComponent({ experiments: Fixtures.experiments });
  await userEvent.click(screen.getByTestId('create-experiment-button'));
  expect(screen.getByText('Create Experiment')).toBeInTheDocument();
});

test('should render when experiments are empty', () => {
  mountComponent({
    experiments: [],
  });

  // Get the sidebar header as proof that the component rendered
  expect(screen.getByText('No experiments created')).toBeInTheDocument();
});

test('paginated list should not render everything when there are many experiments', () => {
  const keys = Array.from(Array(1000).keys()).map((k) => k.toString());
  const localExperiments = keys.map((k) => Fixtures.createExperiment({ experimentId: k, name: k }));

  mountComponent({
    experiments: localExperiments,
  });
  const selected = screen.getAllByTestId('experiment-list-item');
  expect(selected.length).toBeLessThan(keys.length);
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentListView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ExperimentListView.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import { Interpolation, Theme } from '@emotion/react';
import {
  Button,
  TableFilterLayout,
  TableFilterInput,
  Spacer,
  Header,
  Alert,
  useDesignSystemTheme,
  Popover,
  FilterIcon,
  ChevronDownIcon,
} from '@databricks/design-system';
import 'react-virtualized/styles.css';
import Routes from '../routes';
import { CreateExperimentModal } from './modals/CreateExperimentModal';
import { useExperimentListQuery, useInvalidateExperimentList } from './experiment-page/hooks/useExperimentListQuery';
import type { RowSelectionState } from '@tanstack/react-table';
import { FormattedMessage, useIntl } from 'react-intl';
import { ScrollablePageWrapper } from '../../common/components/ScrollablePageWrapper';
import { ExperimentListTable } from './ExperimentListTable';
import { useNavigate } from '../../common/utils/RoutingUtils';
import { BulkDeleteExperimentModal } from './modals/BulkDeleteExperimentModal';
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { useUpdateExperimentTags } from './experiment-page/hooks/useUpdateExperimentTags';
import { useSearchFilter } from './experiment-page/hooks/useSearchFilter';
import { TagFilter, useTagsFilter } from './experiment-page/hooks/useTagsFilter';
import { ExperimentListViewTagsFilter } from './experiment-page/components/ExperimentListViewTagsFilter';

export const ExperimentListView = () => {
  const [searchFilter, setSearchFilter] = useSearchFilter();
  const { tagsFilter, setTagsFilter, isTagsFilterOpen, setIsTagsFilterOpen } = useTagsFilter();

  const {
    data: experiments,
    isLoading,
    error,
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
    pageSizeSelect,
    sorting,
    setSorting,
  } = useExperimentListQuery({ searchFilter, tagsFilter });
  const invalidateExperimentList = useInvalidateExperimentList();

  const { EditTagsModal, showEditExperimentTagsModal } = useUpdateExperimentTags({
    onSuccess: invalidateExperimentList,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchInput, setSearchInput] = useState('');
  const [showCreateExperimentModal, setShowCreateExperimentModal] = useState(false);
  const [showBulkDeleteExperimentModal, setShowBulkDeleteExperimentModal] = useState(false);

  const handleSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchFilter(searchInput);
  };

  const handleSearchClear = () => {
    setSearchFilter('');
  };

  const handleCreateExperiment = () => {
    setShowCreateExperimentModal(true);
  };

  const handleCloseCreateExperimentModal = () => {
    setShowCreateExperimentModal(false);
  };

  const { theme } = useDesignSystemTheme();
  const navigate = useNavigate();
  const intl = useIntl();

  const checkedKeys = Object.entries(rowSelection)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);

  const pushExperimentRoute = () => {
    const route = Routes.getCompareExperimentsPageRoute(checkedKeys);
    navigate(route);
  };

  return (
    <ScrollablePageWrapper css={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Spacer shrinks={false} />
      <Header
        title={<FormattedMessage defaultMessage="Experiments" description="Header title for the experiments page" />}
        buttons={
          <>
            <Button
              componentId="mlflow.experiment_list_view.new_experiment_button"
              type="primary"
              onClick={handleCreateExperiment}
              data-testid="create-experiment-button"
            >
              <FormattedMessage
                defaultMessage="Create"
                description="Label for the create experiment action on the experiments list page"
              />
            </Button>
            <Button
              componentId="mlflow.experiment_list_view.compare_experiments_button"
              onClick={pushExperimentRoute}
              data-testid="compare-experiment-button"
              disabled={checkedKeys.length < 2}
            >
              <FormattedMessage
                defaultMessage="Compare"
                description="Label for the compare experiments action on the experiments list page"
              />
            </Button>
            <Button
              componentId="mlflow.experiment_list_view.bulk_delete_button"
              onClick={() => setShowBulkDeleteExperimentModal(true)}
              data-testid="delete-experiments-button"
              disabled={checkedKeys.length < 1}
              danger
            >
              <FormattedMessage
                defaultMessage="Delete"
                description="Label for the delete experiments action on the experiments list page"
              />
            </Button>
          </>
        }
      />
      <Spacer shrinks={false} />
      {error && (
        <Alert
          css={{ marginBlockEnd: theme.spacing.sm }}
          type="error"
          message={
            error instanceof ErrorWrapper
              ? error.getMessageField()
              : error.message || (
                  <FormattedMessage
                    defaultMessage="A network error occurred."
                    description="Error message for generic network error"
                  />
                )
          }
          componentId="mlflow.experiment_list_view.error"
          closable={false}
        />
      )}
      <div css={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TableFilterLayout>
          <TableFilterInput
            data-testid="search-experiment-input"
            placeholder={intl.formatMessage({
              defaultMessage: 'Filter experiments by name',
              description: 'Placeholder text inside experiments search bar',
            })}
            componentId="mlflow.experiment_list_view.search"
            defaultValue={searchFilter}
            onChange={handleSearchInputChange}
            onSubmit={handleSearchSubmit}
            onClear={handleSearchClear}
            showSearchButton
          />
          <Popover.Root
            componentId="mlflow.experiment_list_view.tag_filter"
            open={isTagsFilterOpen}
            onOpenChange={setIsTagsFilterOpen}
          >
            <Popover.Trigger asChild>
              <Button
                componentId="mlflow.experiment_list_view.tag_filter.trigger"
                icon={<FilterIcon />}
                endIcon={<ChevronDownIcon />}
                type={tagsFilter.length > 0 ? 'primary' : undefined}
              >
                <FormattedMessage
                  defaultMessage="Tag filter"
                  description="Button to open the tags filter popover in the experiments page"
                />
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <ExperimentListViewTagsFilter tagsFilter={tagsFilter} setTagsFilter={setTagsFilter} />
            </Popover.Content>
          </Popover.Root>
        </TableFilterLayout>
        <ExperimentListTable
          experiments={experiments}
          isLoading={isLoading}
          isFiltered={Boolean(searchFilter)}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          cursorPaginationProps={{
            hasNextPage,
            hasPreviousPage,
            onNextPage,
            onPreviousPage,
            pageSizeSelect,
          }}
          sortingProps={{ sorting, setSorting }}
          onEditTags={showEditExperimentTagsModal}
        />
      </div>
      <CreateExperimentModal
        isOpen={showCreateExperimentModal}
        onClose={handleCloseCreateExperimentModal}
        onExperimentCreated={invalidateExperimentList}
      />
      <BulkDeleteExperimentModal
        experiments={(experiments ?? []).filter(({ experimentId }) => checkedKeys.includes(experimentId))}
        isOpen={showBulkDeleteExperimentModal}
        onClose={() => setShowBulkDeleteExperimentModal(false)}
        onExperimentsDeleted={() => {
          invalidateExperimentList();
          setRowSelection({});
        }}
      />
      {EditTagsModal}
    </ScrollablePageWrapper>
  );
};

export default ExperimentListView;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentSourceTypeIcon.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ExperimentSourceTypeIcon.tsx

```typescript
import { FileCodeIcon, FolderBranchIcon, NotebookIcon, WorkflowsIcon } from '@databricks/design-system';
import { SourceType } from '../sdk/MlflowEnums';

/**
 * Displays an icon corresponding to the source type of an experiment run.
 */
export const ExperimentSourceTypeIcon = ({
  sourceType,
  className,
}: {
  sourceType: SourceType | string;
  className?: string;
}) => {
  if (sourceType === SourceType.NOTEBOOK) {
    return <NotebookIcon className={className} />;
  } else if (sourceType === SourceType.LOCAL) {
    return <FileCodeIcon className={className} />;
  } else if (sourceType === SourceType.PROJECT) {
    return <FolderBranchIcon className={className} />;
  } else if (sourceType === SourceType.JOB) {
    return <WorkflowsIcon className={className} />;
  }
  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: HomePage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/HomePage.tsx

```typescript
import { Navigate } from '../../common/utils/RoutingUtils';
import Routes from '../routes';

const HomePage = () => {
  return <Navigate to={Routes.experimentsObservatoryRoute} />;
};

export default HomePage;
```

--------------------------------------------------------------------------------

---[FILE: HtmlTableView.css]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/HtmlTableView.css

```text
/* Overriding the table styles since antd tables take the full screen by default.
We would like to change it to auto to automatically grow based on the columns */

.mlflow-html-table-view table {
  width: auto;
  min-width: 400px;
}

.mlflow-html-table-view th {
  width: auto;
  min-width: 200px;
  margin-right: 80px;
  font-size: 13px;
  color: #888;
}
```

--------------------------------------------------------------------------------

---[FILE: HtmlTableView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/HtmlTableView.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, test, expect } from '@jest/globals';
import { shallow, mount } from 'enzyme';
import React from 'react';
import { LegacyTable } from '@databricks/design-system';
import { HtmlTableView } from './HtmlTableView';

describe('HtmlTableView', () => {
  let wrapper;
  let minimalProps: any;

  beforeEach(() => {
    minimalProps = {
      columns: [],
      values: [],
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<HtmlTableView {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should render column and values', () => {
    const props = {
      columns: [
        { title: 'one', dataIndex: 'one' },
        { title: 'two', dataIndex: 'two' },
        { title: 'three', dataIndex: 'three' },
      ],
      values: [
        { key: 'row-one', one: 1, two: 2, three: 3 },
        { key: 'row-two', one: 4, two: 5, three: 6 },
      ],
    };

    wrapper = mount(<HtmlTableView {...props} />);
    const table = wrapper.find(LegacyTable);
    expect(wrapper.find(LegacyTable).length).toBe(1);

    const rows = table.find('tr');
    expect(rows.length).toBe(3);

    const headers = rows.first().find('th');
    expect(headers.at(0).text()).toBe('one');
    expect(headers.at(1).text()).toBe('two');
    expect(headers.at(2).text()).toBe('three');

    const rowOne = rows.at(1).find('td');
    expect(rowOne.at(0).text()).toBe('1');
    expect(rowOne.at(1).text()).toBe('2');
    expect(rowOne.at(2).text()).toBe('3');

    const rowTwo = rows.at(2).find('td');
    expect(rowTwo.at(0).text()).toBe('4');
    expect(rowTwo.at(1).text()).toBe('5');
    expect(rowTwo.at(2).text()).toBe('6');
  });

  test('should render styles', () => {
    const props = {
      ...minimalProps,
      styles: {
        width: 'auto',
        minWidth: '400px',
      },
    };

    wrapper = shallow(<HtmlTableView {...props} />);
    const tableStlye = wrapper.find(LegacyTable).get(0).props.style;
    expect(tableStlye).toHaveProperty('width', 'auto');
    expect(tableStlye).toHaveProperty('minWidth', '400px');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: HtmlTableView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/HtmlTableView.tsx
Signals: TypeORM

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { LegacyTable } from '@databricks/design-system';
import './HtmlTableView.css';

type Props = {
  columns: any[];
  values: any[];
  styles?: any;
  testId?: string;
  scroll?: any;
};

export function HtmlTableView({ columns, values, styles = {}, testId, scroll }: Props) {
  return (
    <LegacyTable
      className="mlflow-html-table-view"
      data-testid={testId}
      dataSource={values}
      columns={columns}
      scroll={scroll}
      size="middle"
      pagination={false}
      style={styles}
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: LazyPlot.d.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/LazyPlot.d.ts

```typescript
import type { PlotParams } from 'react-plotly.js';

export const LazyPlot: (props: PlotParams) => EmotionJSX.Element;
```

--------------------------------------------------------------------------------

---[FILE: LazyPlot.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/LazyPlot.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import { LegacySkeleton } from '@databricks/design-system';
import { SectionErrorBoundary } from '../../common/components/error-boundaries/SectionErrorBoundary';

const Plot = React.lazy(() => import('react-plotly.js'));

export const LazyPlot = ({ fallback, ...props }: any) => (
  <SectionErrorBoundary>
    <React.Suspense fallback={fallback ?? <LegacySkeleton active />}>
      <Plot {...props} />
    </React.Suspense>
  </SectionErrorBoundary>
);
```

--------------------------------------------------------------------------------

---[FILE: LineSmoothSlider.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/LineSmoothSlider.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { LineSmoothSlider } from './LineSmoothSlider';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';

describe('LineSmoothSlider', () => {
  const TestComponent = ({ marks }: { marks?: Record<string, any> }) => {
    const [value, setValue] = useState(50);
    return (
      <>
        <LineSmoothSlider min={0} max={100} value={value} onChange={setValue} marks={marks} />
        current value: {value}
      </>
    );
  };

  test('should change value when slider is used', async () => {
    render(<TestComponent />);

    expect(screen.getByText('current value: 50')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(screen.getByText('current value: 51')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'End' });
    expect(screen.getByText('current value: 100')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'Home' });
    expect(screen.getByText('current value: 0')).toBeInTheDocument();
  });

  test('should change value when input value is changed with respect to boundaries', async () => {
    render(<TestComponent />);

    expect(screen.getByText('current value: 50')).toBeInTheDocument();

    await userEvent.clear(screen.getByRole('spinbutton'));
    await userEvent.type(screen.getByRole('spinbutton'), '25');
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText('current value: 25')).toBeInTheDocument();

    await userEvent.clear(screen.getByRole('spinbutton'));
    await userEvent.type(screen.getByRole('spinbutton'), '333');
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText('current value: 100')).toBeInTheDocument();
  });

  test('should respect marks when changing the value', async () => {
    const marks = { '0': '0', '30': '30', '50': '50', '100': '100' };
    render(<TestComponent marks={marks} />);

    expect(screen.getByText('current value: 50')).toBeInTheDocument();

    await userEvent.clear(screen.getByRole('spinbutton'));
    await userEvent.type(screen.getByRole('spinbutton'), '25');
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(screen.getByText('current value: 30')).toBeInTheDocument();

    await userEvent.clear(screen.getByRole('spinbutton'));
    await userEvent.type(screen.getByRole('spinbutton'), '888');
    fireEvent.blur(screen.getByRole('spinbutton'));

    expect(screen.getByText('current value: 100')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowLeft' });

    expect(screen.getByText('current value: 50')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowLeft' });

    expect(screen.getByText('current value: 30')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: LineSmoothSlider.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/LineSmoothSlider.tsx
Signals: React

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';
import { Input, Slider } from '@databricks/design-system';
import { clamp, isEmpty, isUndefined, keys } from 'lodash';
import { useState } from 'react';

const TRACK_SIZE = 20;
const THUMB_SIZE = 14;
const MARK_SIZE = 8;
const MARK_OFFSET_X = (THUMB_SIZE - MARK_SIZE) / 2;
const MARK_OFFSET_Y = (TRACK_SIZE - MARK_SIZE) / 2;

const ZINDEX_MARK = 1;
const ZINDEX_THUMB = 2;

const STEP_MARKS_DISPLAY_THRESHOLD = 10;

interface LineSmoothSliderProps {
  max?: number;
  min?: number;
  step?: number;
  marks?: Record<number, any>;
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
  componentId?: string;
  onAfterChange?: (value: number) => void;
  className?: string;
}

// Internal helper function: finds the closest value to the given value from the marks
const getClosestValue = (marks: Record<number, string>, value: number, defaultValue: number) =>
  keys(marks).reduce(
    (prev, curr) => (Math.abs(Number(curr) - value) < Math.abs(prev - value) ? Number(curr) : Number(prev)),
    defaultValue,
  );

// Internal helper function: finds the next value based on direction (down or up) from the marks
const getNextValue = (marks: Record<number, string>, currentValue: number, direction: 'down' | 'up') =>
  direction === 'down'
    ? Math.max(
        ...Object.keys(marks)
          .filter((mark) => Number(mark) < currentValue)
          .map(Number),
      )
    : Math.min(
        ...Object.keys(marks)
          .filter((mark) => Number(mark) > currentValue)
          .map(Number),
      );

export const LineSmoothSlider = ({
  max = 1,
  min = 0,
  step,
  marks,
  value,
  onChange,
  disabled,
  onAfterChange,
  componentId,
  className,
}: LineSmoothSliderProps) => {
  const { theme } = useDesignSystemTheme();
  const shouldUseMarks = !isEmpty(marks);
  const shouldDisplayMarks = shouldUseMarks && Object.keys(marks).length < STEP_MARKS_DISPLAY_THRESHOLD;

  // Temporary value is used to store the value of the input field before it is committed
  const [temporaryValue, setTemporaryValue] = useState<number | undefined>(undefined);

  return (
    <div
      css={{
        display: 'flex',
        height: theme.general.heightSm,
        gap: theme.spacing.md,
        alignItems: 'center',
      }}
    >
      <Slider.Root
        disabled={disabled}
        css={{
          flex: 1,
          position: 'relative',
          'span:last-child': { zIndex: ZINDEX_THUMB },
        }}
        className={className}
        min={min}
        max={max}
        value={[value ?? 0]}
        onValueCommit={([newValue]) => onAfterChange?.(newValue)}
        onKeyDown={(e) => {
          // If marks are used, we want to find the next value based on direction (arrow left/down or arrow right/up)
          if (shouldUseMarks) {
            e.preventDefault();

            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
              const nextValue = getNextValue(
                marks,
                value ?? 0,
                e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? 'down' : 'up',
              );

              onAfterChange?.(nextValue);
              onChange(nextValue);
            }
          }
        }}
        onValueChange={([newValue]) => {
          if (shouldUseMarks) {
            onChange(getClosestValue(marks, newValue, value ?? 0));
            return;
          }
          onChange(newValue);
        }}
        step={step ?? undefined}
      >
        {/* Render marks if needed */}
        {shouldDisplayMarks && (
          <div css={{ position: 'absolute', inset: 0, marginRight: THUMB_SIZE }}>
            {keys(marks).map((markPosition) => (
              <div
                key={markPosition}
                css={{
                  position: 'absolute',
                  zIndex: ZINDEX_MARK,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  marginLeft: -MARK_OFFSET_X / 2,
                  marginTop: MARK_OFFSET_Y,
                  pointerEvents: 'none',
                  borderRadius: '100%',
                  backgroundColor: theme.colors.actionPrimaryBackgroundDefault,
                  height: MARK_SIZE,
                  width: MARK_SIZE,
                  opacity: 0.5,
                }}
                style={{
                  left: `${(Number(markPosition) / (max - min)) * 100}%`,
                }}
              />
            ))}
          </div>
        )}
        <Slider.Track className="TRACK">
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb css={{ position: 'relative', height: THUMB_SIZE, width: THUMB_SIZE }} />
      </Slider.Root>
      <Input
        componentId={componentId ?? 'mlflow.experiment_tracking.common.line_smooth_slider'}
        type="number"
        disabled={disabled}
        min={min}
        max={max}
        css={{ width: 'min-content' }}
        step={step}
        value={temporaryValue ?? value}
        onBlur={() => {
          // If temporary value is set, we want to commit it to the value
          if (!isUndefined(temporaryValue)) {
            if (shouldUseMarks) {
              onAfterChange?.(getClosestValue(marks, temporaryValue, value ?? 0));
              onChange(getClosestValue(marks, temporaryValue, value ?? 0));
            } else {
              onAfterChange?.(clamp(temporaryValue, min, max));
              onChange(clamp(temporaryValue, min, max));
            }
            setTemporaryValue(undefined);
          }
        }}
        onChange={({ target, nativeEvent }) => {
          // If the input event is an input event, we want to set the temporary value
          // to be commited on blur instead of directly setting the value
          if (nativeEvent instanceof InputEvent) {
            setTemporaryValue(Number(target.value));
            return;
          }

          // If using marks, find the next value based on the direction of the change
          if (shouldUseMarks) {
            const nextValue = getNextValue(marks, value ?? 0, Number(target.value) < Number(value) ? 'down' : 'up');

            onChange(nextValue);
            return;
          }

          // If not using marks, clamp the value to the min and max
          onChange(clamp(Number(target.value), min, max));
        }}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

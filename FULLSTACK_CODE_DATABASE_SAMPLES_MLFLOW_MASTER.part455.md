---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 455
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 455 of 991)

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

---[FILE: ShowArtifactLoggedTableView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactLoggedTableView.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  Button,
  DangerIcon,
  DropdownMenu,
  Empty,
  GearIcon,
  Pagination,
  SidebarIcon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableSkeleton,
  useDesignSystemTheme,
  Tooltip,
} from '@databricks/design-system';
import { isArray, isObject, isUndefined } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { getArtifactContent, getArtifactLocationUrl } from '../../../common/utils/ArtifactUtils';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SortingState, PaginationState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table';
import React from 'react';
import { parseJSONSafe } from '@mlflow/mlflow/src/common/utils/TagUtils';
import type { ArtifactLogTableImageObject } from '@mlflow/mlflow/src/experiment-tracking/types';
import { LOG_TABLE_IMAGE_COLUMN_TYPE } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { ImagePlot } from '../runs-charts/components/charts/ImageGridPlot.common';
import { ToggleIconButton } from '../../../common/components/ToggleIconButton';
import { ShowArtifactLoggedTableViewDataPreview } from './ShowArtifactLoggedTableViewDataPreview';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import type { LoggedModelArtifactViewerProps } from './ArtifactViewComponents.types';
import { fetchArtifactUnified } from './utils/fetchArtifactUnified';

const MAX_ROW_HEIGHT = 160;
const MIN_COLUMN_WIDTH = 100;
const getDuboisTableHeight = (isCompact?: boolean) => 1 + (isCompact ? 24 : 32);
const DEFAULT_PAGINATION_COMPONENT_HEIGHT = 48;

/**
 * This function ensures we have a valid ID for every column in the table.
 * If the column name is a number, null or undefined we will convert it to a string.
 * If the column name is an empty string, we will use a fallback name with numbered suffix.
 * Refer to the corresponding unit test for more context.
 */
const sanitizeColumnId = (columnName: string, columnIndex: number) =>
  columnName === '' ? `column-${columnIndex + 1}` : String(columnName);

const LoggedTable = ({ data, runUuid }: { data: { columns: string[]; data: any[][] }; runUuid: string }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCompactView, setIsCompactView] = useState(false);
  const intl = useIntl();

  const { theme } = useDesignSystemTheme();

  // MAX_IMAGE_SIZE would be the minimum of the max row height and the cell width
  // max(image width, image height) <= MAX_IMAGE_SIZE
  const MAX_IMAGE_SIZE = MAX_ROW_HEIGHT - 2 * theme.spacing.sm;

  const containerRef = useRef<HTMLDivElement>(null);
  // Use resize observer to measure the containerRef width and height
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }
  }, []);

  const columns = useMemo(() => data['columns']?.map(sanitizeColumnId) ?? [], [data]);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<string | undefined>(undefined);
  const rows = useMemo(() => data['data'], [data]);

  const imageColumns = useMemo(() => {
    // Check if the column is an image column based on the type of element in the first row
    if (rows.length > 0) {
      return columns.filter((col: string, index: number) => {
        // Check that object is of type ArtifactLogTableImageObject
        if (rows[0][index] !== null && typeof rows[0][index] === 'object') {
          const { type } = rows[0][index] as ArtifactLogTableImageObject;
          return type === LOG_TABLE_IMAGE_COLUMN_TYPE;
        } else {
          return false;
        }
      });
    }
    return [];
  }, [columns, rows]);

  // Calculate the number of rows that can fit in the container, flooring the integer value
  const numRowsPerPage = useMemo(() => {
    const tableRowHeight = getDuboisTableHeight(isCompactView);
    if (imageColumns.length > 0) {
      return Math.floor(
        (containerDimensions.height - tableRowHeight - DEFAULT_PAGINATION_COMPONENT_HEIGHT) / MAX_ROW_HEIGHT,
      );
    } else {
      return Math.floor(
        (containerDimensions.height - tableRowHeight - DEFAULT_PAGINATION_COMPONENT_HEIGHT) / tableRowHeight,
      );
    }
  }, [containerDimensions, imageColumns, isCompactView]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 1,
    pageIndex: 0,
  });

  useEffect(() => {
    // Set pagination when numRowsPerPage changes
    setPagination((pagination) => {
      return { ...pagination, pageSize: numRowsPerPage };
    });
  }, [numRowsPerPage]);

  const tableColumns = useMemo(
    () =>
      columns
        .filter((col) => !hiddenColumns.includes(col))
        .map((col: string) => {
          const col_string = String(col);
          if (imageColumns.includes(col)) {
            return {
              id: col_string,
              header: col_string,
              accessorKey: col_string,
              minSize: MIN_COLUMN_WIDTH,
              cell: (row: any) => {
                try {
                  const parsedRowValue = JSON.parse(row.getValue());
                  const { filepath, compressed_filepath } = parsedRowValue as ArtifactLogTableImageObject;
                  const imageUrl = getArtifactLocationUrl(filepath, runUuid);
                  const compressedImageUrl = getArtifactLocationUrl(compressed_filepath, runUuid);
                  return (
                    <ImagePlot
                      imageUrl={imageUrl}
                      compressedImageUrl={compressedImageUrl}
                      maxImageSize={MAX_IMAGE_SIZE}
                    />
                  );
                } catch {
                  Utils.logErrorAndNotifyUser("Error parsing image data in logged table's image column");
                  return row.getValue();
                }
              },
            };
          }
          return {
            id: col_string,
            header: col_string,
            accessorKey: col_string,
            minSize: MIN_COLUMN_WIDTH,
          };
        }),
    [columns, MAX_IMAGE_SIZE, imageColumns, runUuid, hiddenColumns],
  );
  const tableData = useMemo(
    () =>
      rows.map((row: any[]) => {
        const obj: Record<string, any> = {};
        for (let i = 0; i < columns.length; i++) {
          const cellData = row[i];
          obj[columns[i]] = typeof cellData === 'string' ? cellData : JSON.stringify(cellData);
        }
        return obj;
      }),
    [rows, columns],
  );
  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactLoggedTableView.tsx',
    {
      columns: tableColumns,
      data: tableData,
      state: {
        pagination,
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      enableColumnResizing: true,
      columnResizeMode: 'onChange',
    },
  );

  const paginationComponent = (
    <Pagination
      componentId="codegen_mlflow_app_src_experiment-tracking_components_artifact-view-components_showartifactloggedtableview.tsx_181"
      currentPageIndex={pagination.pageIndex + 1}
      numTotal={rows.length}
      onChange={(page, pageSize) => {
        setPagination({
          pageSize: pageSize || pagination.pageSize,
          pageIndex: page - 1,
        });
      }}
      pageSize={pagination.pageSize}
    />
  );

  return (
    <div
      ref={containerRef}
      css={{
        paddingLeft: theme.spacing.md,
        height: '100%',
        display: 'flex',
        gap: theme.spacing.xs,
        overflow: 'hidden',
      }}
    >
      <div css={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div css={{ overflow: 'auto', flex: 1 }}>
          <Table
            scrollable
            size={isCompactView ? 'small' : 'default'}
            css={{
              '.table-header-icon-container': {
                lineHeight: 0,
              },
            }}
            style={{ width: table.getTotalSize() }}
          >
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow isHeader key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHeader
                        componentId="codegen_mlflow_app_src_experiment-tracking_components_artifact-view-components_showartifactloggedtableview.tsx_223"
                        key={header.id}
                        sortable
                        sortDirection={header.column.getIsSorted() || 'none'}
                        onToggleSort={header.column.getToggleSortingHandler()}
                        header={header}
                        column={header.column}
                        setColumnSizing={table.setColumnSizing}
                        isResizing={header.column.getIsResizing()}
                        style={{ maxWidth: header.column.getSize() }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHeader>
                    );
                  })}
                </TableRow>
              );
            })}
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => {
                  return (
                    <TableCell
                      css={{
                        maxHeight: MAX_ROW_HEIGHT,
                        '&:hover': {
                          backgroundColor: theme.colors.tableBackgroundSelectedHover,
                          cursor: 'pointer',
                        },
                      }}
                      key={cell.id}
                      onClick={() => {
                        setPreviewData(String(cell.getValue()));
                      }}
                      // Enable keyboard navigation
                      tabIndex={0}
                      onKeyDown={({ key }) => {
                        if (key === 'Enter') {
                          setPreviewData(String(cell.getValue()));
                        }
                      }}
                      style={{ maxWidth: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </Table>
        </div>
        <div
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingBottom: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
          }}
        >
          {paginationComponent}
        </div>
      </div>
      {!isUndefined(previewData) && (
        <ShowArtifactLoggedTableViewDataPreview data={previewData} onClose={() => setPreviewData(undefined)} />
      )}
      <div
        css={{
          paddingTop: theme.spacing.sm,
          paddingRight: theme.spacing.sm,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xs,
        }}
      >
        <DropdownMenu.Root modal={false}>
          <Tooltip
            componentId="mlflow.run.artifact_view.table_settings.tooltip"
            content={intl.formatMessage({
              defaultMessage: 'Table settings',
              description: 'Run view > artifact view > logged table > table settings tooltip',
            })}
          >
            <DropdownMenu.Trigger
              asChild
              aria-label={intl.formatMessage({
                defaultMessage: 'Table settings',
                description: 'Run view > artifact view > logged table > table settings tooltip',
              })}
            >
              <Button componentId="mlflow.run.artifact_view.table_settings" icon={<GearIcon />} />
            </DropdownMenu.Trigger>
          </Tooltip>
          <DropdownMenu.Content css={{ maxHeight: theme.general.heightSm * 10, overflowY: 'auto' }} side="left">
            <DropdownMenu.Arrow />
            <DropdownMenu.CheckboxItem
              componentId="codegen_mlflow_app_src_experiment-tracking_components_artifact-view-components_showartifactloggedtableview.tsx_315"
              checked={isCompactView}
              onCheckedChange={setIsCompactView}
            >
              <DropdownMenu.ItemIndicator />
              <FormattedMessage
                defaultMessage="Compact view"
                description="Run page > artifact view > logged table view > compact view toggle button"
              />
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Label>
                <FormattedMessage
                  defaultMessage="Columns"
                  description="Run page > artifact view > logged table view > columns selector label"
                />
              </DropdownMenu.Label>
              {columns.map((column) => (
                <DropdownMenu.CheckboxItem
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_artifact-view-components_showartifactloggedtableview.tsx_331"
                  onSelect={(event) => event.preventDefault()}
                  checked={!hiddenColumns.includes(column)}
                  key={column}
                  onCheckedChange={() => {
                    setHiddenColumns((prev) => {
                      if (prev.includes(column)) {
                        return prev.filter((col) => col !== column);
                      } else {
                        return [...prev, column];
                      }
                    });
                  }}
                >
                  <DropdownMenu.ItemIndicator />
                  {column}
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <ToggleIconButton
          onClick={() => {
            setPreviewData(() => {
              return !isUndefined(previewData) ? undefined : '';
            });
          }}
          pressed={!isUndefined(previewData)}
          componentId="mlflow.run.artifact_view.preview_sidebar_toggle"
          icon={<SidebarIcon />}
        />
      </div>
    </div>
  );
};

type ShowArtifactLoggedTableViewProps = {
  runUuid: string;
  path: string;
} & LoggedModelArtifactViewerProps;

export const ShowArtifactLoggedTableView = React.memo(
  ({
    runUuid,
    path,
    isLoggedModelsMode,
    loggedModelId,
    experimentId,
    entityTags,
  }: ShowArtifactLoggedTableViewProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [curPath, setCurPath] = useState<string | undefined>(undefined);
    const [text, setText] = useState<string>('');

    useEffect(() => {
      setLoading(true);
      fetchArtifactUnified(
        { runUuid, path, isLoggedModelsMode, loggedModelId, experimentId, entityTags },
        getArtifactContent,
      )
        .then((value) => {
          setLoading(false);
          // Check if value is stringified JSON
          if (value && typeof value === 'string') {
            setText(value);
            setError(undefined);
          } else {
            setError(Error('Artifact is not a JSON file'));
          }
        })
        .catch((error: Error) => {
          setError(error);
          setLoading(false);
        });
      setCurPath(path);
    }, [path, runUuid, isLoggedModelsMode, loggedModelId, experimentId, entityTags]);

    const data = useMemo<{
      columns: string[];
      data: any[][];
    }>(() => {
      const parsedJSON = parseJSONSafe(text);
      if (!parsedJSON || !isArray(parsedJSON?.columns) || !isArray(parsedJSON?.data)) {
        return undefined;
      }
      return parsedJSON;
    }, [text]);

    const { theme } = useDesignSystemTheme();

    const renderErrorState = (description: React.ReactNode) => {
      return (
        <div css={{ padding: theme.spacing.md }}>
          <Empty
            image={<DangerIcon />}
            title={
              <FormattedMessage
                defaultMessage="Error occurred"
                description="Run page > artifact view > logged table view > generic error empty state title"
              />
            }
            description={description}
          />
        </div>
      );
    };

    if (loading || path !== curPath) {
      return (
        <div
          css={{
            padding: theme.spacing.md,
          }}
        >
          <TableSkeleton lines={5} />
        </div>
      );
    }
    if (error) {
      return renderErrorState(error.message);
    } else if (text) {
      if (!data) {
        return renderErrorState(
          <FormattedMessage
            defaultMessage="Unable to parse JSON file. The file should contain an object with 'columns' and 'data' keys."
            description="An error message displayed when the logged table JSON file is malformed or does not contain 'columns' and 'data' keys"
          />,
        );
      }
      return <LoggedTable data={data} runUuid={runUuid} />;
    }
    return renderErrorState(null);
  },
);
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactLoggedTableViewDataPreview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactLoggedTableViewDataPreview.tsx
Signals: React

```typescript
import { Button, CloseIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { Global } from '@emotion/react';
import { FormattedJsonDisplay } from '@mlflow/mlflow/src/common/components/JsonFormatting';
import { isUndefined } from 'lodash';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ResizableBox } from 'react-resizable';

const initialWidth = 200;
const maxWidth = 500;

export const ShowArtifactLoggedTableViewDataPreview = ({
  data,
  onClose,
}: {
  data: string | undefined;
  onClose: VoidFunction;
}) => {
  const { theme } = useDesignSystemTheme();
  const [dragging, setDragging] = useState(false);

  if (isUndefined(data)) {
    return null;
  }

  return (
    <div
      css={{
        display: 'flex',
        height: '100%',
        flexDirection: 'row-reverse',
        position: 'relative',
        borderLeft: `1px solid ${theme.colors.border}`,
      }}
    >
      {dragging && (
        <Global
          styles={{
            'body, :host': {
              userSelect: 'none',
            },
          }}
        />
      )}
      <ResizableBox
        width={initialWidth}
        height={undefined}
        axis="x"
        resizeHandles={['w']}
        minConstraints={[initialWidth, 150]}
        maxConstraints={[maxWidth, 150]}
        onResizeStart={() => setDragging(true)}
        onResizeStop={() => setDragging(false)}
        handle={
          <div
            css={{
              width: theme.spacing.xs,
              left: -(theme.spacing.xs / 2),
              height: '100%',
              position: 'absolute',
              top: 0,
              cursor: 'ew-resize',
              '&:hover': {
                backgroundColor: theme.colors.border,
                opacity: 0.5,
              },
            }}
          />
        }
        css={{
          position: 'relative',
          display: 'flex',
        }}
      >
        <div css={{ padding: theme.spacing.sm, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div css={{ display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
            <Typography.Title level={5}>
              <FormattedMessage
                defaultMessage="Preview"
                description="Run page > artifact view > logged table view > preview box > title"
              />
            </Typography.Title>
            <Button
              componentId="mlflow.run.artifact_view.preview_close"
              onClick={() => onClose()}
              icon={<CloseIcon />}
            />
          </div>
          {!data && (
            <Typography.Text color="secondary">
              <FormattedMessage
                defaultMessage="Click a cell to preview data"
                description="Run page > artifact view > logged table view > preview box > CTA"
              />
            </Typography.Text>
          )}
          <div css={{ flex: 1, overflow: 'auto' }}>
            <FormattedJsonDisplay json={data} />
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactMapView.css]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactMapView.css

```text
.mlflow-ui-container .map-container {
  height: 100%;
  width: 100%;
}

.mlflow-ui-container .leaflet-container {
  height: 100%;
  width: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactMapView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactMapView.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import React from 'react';
import { shallow, mount } from 'enzyme';
import ShowArtifactMapView from './ShowArtifactMapView';
import { mountWithIntl } from '../../../common/utils/TestUtils.enzyme';

describe('ShowArtifactMapView', () => {
  let wrapper: any;
  let instance;
  let minimalProps: any;
  let commonProps;

  beforeEach(() => {
    minimalProps = {
      path: 'fakepath',
      runUuid: 'fakeUuid',
    };
    // Mock the `getArtifact` function to avoid spurious network errors
    // during testing
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve('some content');
    });
    commonProps = { ...minimalProps, getArtifact: getArtifact };
    wrapper = shallow(<ShowArtifactMapView {...commonProps} />);
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ShowArtifactMapView {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render error message when error occurs', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.reject(new Error('my error text'));
    });
    const props = { ...minimalProps, getArtifact: getArtifact };
    wrapper = shallow(<ShowArtifactMapView {...props} />);
    setImmediate(() => {
      expect(wrapper.find('.artifact-map-view-error').length).toBe(1);
      expect(wrapper.instance().state.loading).toBe(false);
      expect(wrapper.instance().state.html).toBeUndefined();
      expect(wrapper.instance().state.error).toBeDefined();
      done();
    });
  });

  test('should render loading text when view is loading', () => {
    instance = wrapper.instance();
    instance.setState({ loading: true });
    expect(wrapper.find('.artifact-map-view-loading').length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render simple geoJSON in map view', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [125.6, 10.1],
        },
        properties: {
          name: 'Dinagat Islands',
        },
      };
      return Promise.resolve(JSON.stringify(geojson));
    });

    const div = global.document.createElement('div');
    global.document.body.appendChild(div);
    const props = { ...minimalProps, getArtifact: getArtifact };
    wrapper = mountWithIntl(<ShowArtifactMapView {...props} />, {
      attachTo: div,
    });

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('#map')).toHaveLength(1);
      const center = wrapper.instance().leafletMap.getCenter();
      expect(center.lat).toBeCloseTo(10.1);
      expect(center.lng).toBeCloseTo(125.6);
      done();
    });
  });

  test('should fetch artifacts on component update', () => {
    instance = wrapper.instance();
    instance.fetchArtifacts = jest.fn();
    wrapper.setProps({ path: 'newpath', runUuid: 'newRunId' });
    expect(instance.fetchArtifacts).toHaveBeenCalled();
    expect(instance.props.getArtifact).toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactMapView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactMapView.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { getArtifactContent } from '../../../common/utils/ArtifactUtils';
import './ShowArtifactMapView.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { ArtifactViewSkeleton } from './ArtifactViewSkeleton';
import { ArtifactViewErrorState } from './ArtifactViewErrorState';
import type { LoggedModelArtifactViewerProps } from './ArtifactViewComponents.types';
import { fetchArtifactUnified, type FetchArtifactUnifiedFn } from './utils/fetchArtifactUnified';

function onEachFeature(feature: any, layer: any) {
  if (feature.properties && feature.properties.popupContent) {
    const { popupContent } = feature.properties;
    layer.bindPopup(popupContent);
  }
}

type Props = {
  runUuid: string;
  path: string;
  getArtifact: FetchArtifactUnifiedFn;
} & LoggedModelArtifactViewerProps;

type State = any;

class ShowArtifactMapView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.fetchArtifacts = this.fetchArtifacts.bind(this);
    this.leafletMap = undefined;
    this.mapDivId = 'map';
  }

  static defaultProps = {
    getArtifact: fetchArtifactUnified,
  };

  leafletMap: any;
  mapDivId: any;
  mapRef: HTMLDivElement | null = null;

  state = {
    loading: true,
    error: undefined,
    features: undefined,
  };

  componentDidMount() {
    this.fetchArtifacts();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.path !== prevProps.path || this.props.runUuid !== prevProps.runUuid) {
      this.fetchArtifacts();
    }

    if (this.leafletMap !== undefined) {
      if (this.leafletMap.hasOwnProperty('_layers')) {
        this.leafletMap.off();
        this.leafletMap.remove();
        const inner = "<div id='" + this.mapDivId + "'></div>";
        document.getElementsByClassName('map-container')[0].innerHTML = inner;
        this.leafletMap = undefined;
      }
    }

    if (this.state.features !== undefined && this.mapRef) {
      const map = L.map(this.mapRef);

      // Load tiles from OSM with the corresponding attribution
      // Potentially, these could be set in an ENV VAR to use a custom map
      const tilesURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const attr = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

      L.tileLayer(tilesURL, {
        attribution: attr,
      }).addTo(map);

      const geojsonLayer = L.geoJSON(this.state.features, {
        style(feature: any) {
          return feature.properties && feature.properties.style;
        },
        pointToLayer(feature: any, latlng: any) {
          if (feature.properties && feature.properties.style) {
            return L.circleMarker(latlng, feature.properties && feature.properties.style);
          } else if (feature.properties && feature.properties.icon) {
            return L.marker(latlng, {
              icon: L.icon(feature.properties && feature.properties.icon),
            });
          }
          return L.marker(latlng, {
            icon: L.icon({
              iconRetinaUrl: iconRetina,
              iconUrl: icon,
              shadowUrl: iconShadow,
              iconSize: [24, 36],
              iconAnchor: [12, 36],
            }),
          });
        },
        onEachFeature: onEachFeature,
      }).addTo(map);
      map.fitBounds(geojsonLayer.getBounds());
      this.leafletMap = map;
    }
  }

  render() {
    if (this.state.loading) {
      return <ArtifactViewSkeleton className="artifact-map-view-loading" />;
    }
    if (this.state.error) {
      return <ArtifactViewErrorState className="artifact-map-view-error" />;
    } else {
      return (
        <div className="map-container">
          <div
            id={this.mapDivId}
            ref={(ref) => {
              this.mapRef = ref;
            }}
          />
        </div>
      );
    }
  }

  /** Fetches artifacts and updates component state with the result */
  fetchArtifacts() {
    const { path, runUuid, isLoggedModelsMode, loggedModelId, experimentId, entityTags } = this.props;

    this.props
      .getArtifact?.({ path, runUuid, isLoggedModelsMode, loggedModelId, experimentId, entityTags }, getArtifactContent)
      .then((rawFeatures: any) => {
        const parsedFeatures = JSON.parse(rawFeatures);
        this.setState({ features: parsedFeatures, loading: false });
      })
      .catch((error: any) => {
        this.setState({ error: error, loading: false, features: undefined });
      });
  }
}

export default ShowArtifactMapView;
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactPage.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactPage.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import ShowArtifactPage from './ShowArtifactPage';
import ShowArtifactImageView from './ShowArtifactImageView';
import ShowArtifactTextView from './ShowArtifactTextView';
import { LazyShowArtifactMapView } from './LazyShowArtifactMapView';
import ShowArtifactHtmlView from './ShowArtifactHtmlView';
import { LazyShowArtifactTableView } from './LazyShowArtifactTableView';
import ShowArtifactLoggedModelView from './ShowArtifactLoggedModelView';
import {
  IMAGE_EXTENSIONS,
  TEXT_EXTENSIONS,
  MAP_EXTENSIONS,
  HTML_EXTENSIONS,
  DATA_EXTENSIONS,
  AUDIO_EXTENSIONS,
} from '../../../common/utils/FileUtils';
import { RunTag } from '../../sdk/MlflowMessages';
import { LazyShowArtifactAudioView } from './LazyShowArtifactAudioView';

// Mock these methods because js-dom doesn't implement window.Request
jest.mock('../../../common/utils/ArtifactUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/ArtifactUtils')>('../../../common/utils/ArtifactUtils'),
  // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
  getArtifactContent: jest.fn().mockResolvedValue(),
  // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
  getArtifactBytesContent: jest.fn().mockResolvedValue(),
}));

describe('ShowArtifactPage', () => {
  let wrapper: any;
  let minimalProps: any;
  let commonProps;
  beforeEach(() => {
    minimalProps = {
      runUuid: 'fakeUuid',
      artifactRootUri: 'path/to/root/artifact',
    };
    (ShowArtifactPage.prototype as any).fetchArtifacts = jest.fn();
    commonProps = { ...minimalProps, path: 'fakepath' };
    wrapper = mountWithIntl(<ShowArtifactPage {...commonProps} />);
  });
  test('should render with minimal props without exploding', () => {
    wrapper = mountWithIntl(<ShowArtifactPage {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });
  test('should render "select to preview" view when path is unspecified', () => {
    wrapper = mountWithIntl(<ShowArtifactPage {...minimalProps} />);
    expect(wrapper.text().includes('Select a file to preview')).toBe(true);
  });
  test('should render "too large to preview" view when size is too large', () => {
    wrapper.setProps({ path: 'file_without_extension', runUuid: 'runId', size: 100000000 });
    expect(wrapper.text().includes('Select a file to preview')).toBe(false);
    expect(wrapper.text().includes('File is too large to preview')).toBe(true);
  });
  test('should render logged model view when path is in runs tag logged model history', () => {
    wrapper.setProps({
      path: 'somePath',
      isDirectory: true,
      runTags: {
        'mlflow.log-model.history': (RunTag as any).fromJs({
          key: 'mlflow.log-model.history',
          value: JSON.stringify([
            {
              run_id: 'run-uuid',
              artifact_path: 'somePath',
              flavors: { keras: {}, python_function: {} },
            },
          ]),
        }),
      },
    });
    expect(wrapper.find(ShowArtifactLoggedModelView).length).toBe(1);
  });
  test('should render logged model view when path is nested in subdirectory', () => {
    wrapper.setProps({
      path: 'dir/somePath',
      isDirectory: true,
      runTags: {
        'mlflow.log-model.history': (RunTag as any).fromJs({
          key: 'mlflow.log-model.history',
          value: JSON.stringify([
            {
              run_id: 'run-uuid',
              artifact_path: 'dir/somePath',
              flavors: { keras: {}, python_function: {} },
            },
          ]),
        }),
      },
    });
    expect(wrapper.find(ShowArtifactLoggedModelView).length).toBe(1);
  });
  test('should render "select to preview" view when path has no extension', () => {
    wrapper.setProps({ path: 'file_without_extension', runUuid: 'runId' });
    expect(wrapper.text().includes('Select a file to preview')).toBe(true);
  });
  test('should render "select to preview" view when path has unknown extension', () => {
    wrapper.setProps({ path: 'file.unknown', runUuid: 'runId' });
    expect(wrapper.text().includes('Select a file to preview')).toBe(true);
  });
  test('should render image view for common image extensions', () => {
    IMAGE_EXTENSIONS.forEach((ext) => {
      wrapper.setProps({ path: `image.${ext}`, runUuid: 'runId' });
      expect(wrapper.find(ShowArtifactImageView).length).toBe(1);
    });
  });
  test('should render "select to preview" view for folder with common image extensions', () => {
    IMAGE_EXTENSIONS.forEach((ext) => {
      wrapper.setProps({ path: `image.${ext}`, runUuid: 'runId', isDirectory: 'true' });
      expect(wrapper.text().includes('Select a file to preview')).toBe(true);
    });
  });
  test('should render html view for common html extensions', () => {
    HTML_EXTENSIONS.forEach((ext) => {
      wrapper.setProps({ path: `image.${ext}`, runUuid: 'runId' });
      expect(wrapper.find(ShowArtifactHtmlView).length).toBe(1);
    });
  });
  test('should render map view for common map extensions', () => {
    MAP_EXTENSIONS.forEach((ext) => {
      wrapper.setProps({ path: `image.${ext}`, runUuid: 'runId' });
      expect(wrapper.find(LazyShowArtifactMapView).length).toBe(1);
    });
  });
  test('should render text view for common text extensions', () => {
    TEXT_EXTENSIONS.forEach((ext) => {
      wrapper.setProps({ path: `image.${ext}`, runUuid: 'runId' });
      expect(wrapper.find(ShowArtifactTextView).length).toBe(1);
    });
  });
  test('should render data table view for common tabular data extensions', () => {
    DATA_EXTENSIONS.forEach((ext) => {
      wrapper.setProps({ path: `image.${ext}`, runUuid: 'runId' });
      expect(wrapper.find(LazyShowArtifactTableView).length).toBe(1);
    });
  });
  test('should render audio view for common audio data extensions', () => {
    AUDIO_EXTENSIONS.forEach((ext) => {
      wrapper.setProps({ path: `image.${ext}`, runUuid: 'runId' });
      expect(wrapper.find(LazyShowArtifactAudioView).length).toBe(1);
    });
  });
});
```

--------------------------------------------------------------------------------

````

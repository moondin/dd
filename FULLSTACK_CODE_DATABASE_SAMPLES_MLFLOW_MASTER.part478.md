---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 478
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 478 of 991)

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

---[FILE: ExperimentViewDatasetDrawer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetDrawer.tsx
Signals: React, Redux/RTK

```typescript
import React from 'react';
import { useState } from 'react';
import {
  Button,
  Drawer,
  Header,
  Spacer,
  TableIcon,
  Tag,
  Typography,
  useDesignSystemTheme,
  Tooltip,
} from '@databricks/design-system';
import type { RunDatasetWithTags } from '../../../../types';
import { MLFLOW_RUN_DATASET_CONTEXT_TAG } from '../../../../constants';
import { ExperimentViewDatasetSchema } from './ExperimentViewDatasetSchema';
import { ExperimentViewDatasetLink } from './ExperimentViewDatasetLink';
import { Link } from '../../../../../common/utils/RoutingUtils';
import Routes from '../../../../routes';
import { FormattedMessage } from 'react-intl';
import { ExperimentViewDatasetWithContext } from './ExperimentViewDatasetWithContext';
import { RunColorPill } from '../RunColorPill';
import { ExperimentViewDatasetSourceType } from './ExperimentViewDatasetSourceType';
import { ExperimentViewDatasetSourceURL } from './ExperimentViewDatasetSourceURL';
import { ExperimentViewDatasetDigest } from './ExperimentViewDatasetDigest';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../../../redux-types';
import { useGetExperimentRunColor } from '../../hooks/useExperimentRunColor';

export type DatasetWithRunType = {
  datasetWithTags: RunDatasetWithTags;
  runData: {
    experimentId?: string;
    tags?: Record<string, { key: string; value: string }>;
    runUuid: string;
    runName?: string;
    datasets: RunDatasetWithTags[];
  };
};

export interface DatasetsCellRendererProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedDatasetWithRun: DatasetWithRunType;
  setSelectedDatasetWithRun: (datasetWithRun: DatasetWithRunType) => void;
}

const DRAWER_WITDH = '800px';
const MAX_PROFILE_LENGTH = 80;

const areDatasetsEqual = (datasetA: RunDatasetWithTags, datasetB: RunDatasetWithTags) => {
  return datasetA.dataset.digest === datasetB.dataset.digest && datasetA.dataset.name === datasetB.dataset.name;
};

const ExperimentViewDatasetDrawerImpl = ({
  isOpen,
  setIsOpen,
  selectedDatasetWithRun,
  setSelectedDatasetWithRun,
}: DatasetsCellRendererProps): JSX.Element => {
  const { theme } = useDesignSystemTheme();
  const { datasetWithTags, runData } = selectedDatasetWithRun;
  const contextTag = selectedDatasetWithRun
    ? datasetWithTags?.tags?.find((tag) => tag.key === MLFLOW_RUN_DATASET_CONTEXT_TAG)
    : undefined;
  const fullProfile =
    datasetWithTags.dataset.profile && datasetWithTags.dataset.profile !== 'null'
      ? datasetWithTags.dataset.profile
      : undefined;

  const getRunColor = useGetExperimentRunColor();
  const { experimentId = '', tags = {} } = runData;

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
        }
      }}
    >
      <Drawer.Content
        componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetdrawer.tsx_81"
        title={
          <div css={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography.Title level={4} css={{ marginRight: theme.spacing.sm, marginBottom: 0 }} withoutMargins>
              <FormattedMessage
                defaultMessage="Data details for "
                description="Text for data details for the experiment run in the dataset drawer"
              />
            </Typography.Title>
            <Link to={Routes.getRunPageRoute(experimentId, runData.runUuid)} css={styles.runLink}>
              <RunColorPill color={getRunColor(runData.runUuid)} />
              <span css={styles.runName}>{runData.runName}</span>
            </Link>
          </div>
        }
        width={DRAWER_WITDH}
        footer={<Spacer size="xs" />}
      >
        <div
          css={{
            display: 'flex',
            borderTop: `1px solid ${theme.colors.border}`,
            height: '100%',
            marginLeft: -theme.spacing.sm,
          }}
        >
          {/* column for dataset selection */}
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              width: '300px',
              borderRight: `1px solid ${theme.colors.border}`,
              height: '100%',
            }}
          >
            <Typography.Text
              color="secondary"
              css={{
                marginBottom: theme.spacing.sm,
                marginTop: theme.spacing.sm,
                paddingLeft: theme.spacing.sm,
              }}
            >
              {runData.datasets.length}{' '}
              <FormattedMessage
                defaultMessage="datasets used"
                description="Text for dataset count in the experiment run dataset drawer"
              />
            </Typography.Text>
            <div
              css={{
                height: '100%',
                display: 'flex',
                overflow: 'auto',
              }}
              onWheel={(e) => e.stopPropagation()}
            >
              <div
                css={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'visible',
                  flex: 1,
                }}
              >
                {runData.datasets.map((dataset) => (
                  <Typography.Link
                    componentId="mlflow.dataset_drawer.dataset_link"
                    aria-label={`${dataset.dataset.name} (${dataset.dataset.digest})`}
                    key={`${dataset.dataset.name}-${dataset.dataset.digest}`}
                    css={{
                      display: 'flex',
                      whiteSpace: 'nowrap',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      backgroundColor: areDatasetsEqual(dataset, datasetWithTags)
                        ? theme.colors.actionTertiaryBackgroundPress
                        : 'transparent',
                      paddingBottom: theme.spacing.sm,
                      paddingTop: theme.spacing.sm,
                      paddingLeft: theme.spacing.sm,
                      border: 0,
                      borderTop: `1px solid ${theme.colors.border}`,
                      '&:hover': {
                        backgroundColor: theme.colors.actionTertiaryBackgroundHover,
                      },
                    }}
                    onClick={() => {
                      setSelectedDatasetWithRun({ datasetWithTags: dataset, runData: runData });
                      setIsOpen(true);
                    }}
                  >
                    <ExperimentViewDatasetWithContext datasetWithTags={dataset} displayTextAsLink={false} />
                  </Typography.Link>
                ))}
              </div>
            </div>
          </div>
          {/* column for dataset details */}
          <div
            css={{
              overflow: 'hidden',
              paddingLeft: theme.spacing.md,
              paddingTop: theme.spacing.md,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {/* dataset metadata */}
            <div
              css={{
                display: 'flex',
                gap: theme.spacing.sm,
              }}
            >
              <div css={{ flex: '1' }}>
                <Header
                  title={
                    <div css={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
                      <TableIcon css={{ marginRight: theme.spacing.xs }} />
                      <Tooltip
                        content={datasetWithTags.dataset.name}
                        componentId="mlflow.dataset_drawer.dataset_name_tooltip"
                        align="start"
                      >
                        <span>
                          <Typography.Title ellipsis level={3} css={{ maxWidth: 200 }} withoutMargins>
                            {datasetWithTags.dataset.name}
                          </Typography.Title>
                        </span>
                      </Tooltip>
                      {contextTag && (
                        <Tag
                          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetdrawer.tsx_206"
                          css={{
                            textTransform: 'capitalize',
                            marginLeft: theme.spacing.xs,
                            marginRight: theme.spacing.xs,
                          }}
                        >
                          {contextTag.value}
                        </Tag>
                      )}
                    </div>
                  }
                />
                <Typography.Title
                  level={4}
                  color="secondary"
                  css={{ marginBottom: theme.spacing.xs, marginTop: theme.spacing.xs }}
                  title={fullProfile}
                >
                  {datasetWithTags.dataset.profile && datasetWithTags.dataset.profile !== 'null' ? (
                    datasetWithTags.dataset.profile.length > MAX_PROFILE_LENGTH ? (
                      `${datasetWithTags.dataset.profile.substring(0, MAX_PROFILE_LENGTH)} ...`
                    ) : (
                      datasetWithTags.dataset.profile
                    )
                  ) : (
                    <FormattedMessage
                      defaultMessage="No profile available"
                      description="Text for no profile available in the experiment run dataset drawer"
                    />
                  )}
                </Typography.Title>
              </div>
              <ExperimentViewDatasetLink datasetWithTags={datasetWithTags} runTags={tags} />
            </div>
            <div css={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
              <ExperimentViewDatasetDigest datasetWithTags={datasetWithTags} />
              <ExperimentViewDatasetSourceType datasetWithTags={datasetWithTags} />
              <ExperimentViewDatasetSourceURL datasetWithTags={datasetWithTags} />
            </div>
            {/* dataset schema */}
            <div
              css={{
                marginTop: theme.spacing.sm,
                marginBottom: theme.spacing.xs,
                borderTop: `1px solid ${theme.colors.border}`,
                opacity: 0.5,
              }}
            />
            <ExperimentViewDatasetSchema datasetWithTags={datasetWithTags} />
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
};

// Memoize the component so it rerenders only when props change directly, preventing
// rerenders caused e.g. by the overarching context provider.
export const ExperimentViewDatasetDrawer = React.memo(ExperimentViewDatasetDrawerImpl);

const styles = {
  runLink: {
    overflow: 'hidden',
    display: 'flex',
    gap: 4,
    alignItems: 'center',
    fontWeight: 'normal',
  },
  runName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '13px',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDatasetLink.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetLink.tsx
Signals: React

```typescript
import { Button, CopyIcon, NewWindowIcon, Typography } from '@databricks/design-system';
import type { RunDatasetWithTags } from '../../../../types';
import { DatasetSourceTypes } from '../../../../types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getDatasetSourceUrl } from '../../../../utils/DatasetUtils';
import { CopyButton } from '../../../../../shared/building_blocks/CopyButton';

export interface DatasetLinkProps {
  datasetWithTags: RunDatasetWithTags;
  runTags: Record<string, { key: string; value: string }>;
}

export const ExperimentViewDatasetLink = ({ datasetWithTags, runTags }: DatasetLinkProps) => {
  const { dataset } = datasetWithTags;
  if (dataset.sourceType === DatasetSourceTypes.HTTP || dataset.sourceType === DatasetSourceTypes.HUGGING_FACE) {
    const url = getDatasetSourceUrl(datasetWithTags);
    if (url) {
      return (
        <Button
          type="primary"
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetlink.tsx_19_1"
          icon={<NewWindowIcon />}
          href={url}
          target="_blank"
        >
          <FormattedMessage
            defaultMessage="Open dataset"
            description="Text for the HTTP/HF location link in the experiment run dataset drawer"
          />
        </Button>
      );
    }
  }
  if (dataset.sourceType === DatasetSourceTypes.S3) {
    const url = getDatasetSourceUrl(datasetWithTags);
    if (url) {
      return (
        <CopyButton
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetlink.tsx_19_2"
          icon={<CopyIcon />}
          copyText={url}
        >
          <FormattedMessage
            defaultMessage="Copy S3 URI to clipboard"
            description="Text for the HTTP/HF location link in the experiment run dataset drawer"
          />
        </CopyButton>
      );
    }
  }
  if (dataset.sourceType === DatasetSourceTypes.EXTERNAL) {
    return (
      <Button
        componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetlink.tsx_19_3"
        icon={<NewWindowIcon />}
      >
        <FormattedMessage
          defaultMessage="Go to external location"
          description="Text for the external location link in the experiment run dataset drawer"
        />
      </Button>
    );
  }
  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDatasetSchema.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetSchema.tsx
Signals: React, TypeORM

```typescript
import {
  Header,
  TableIcon,
  useDesignSystemTheme,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableFilterInput,
  Spacer,
  Typography,
} from '@databricks/design-system';
import { ExperimentViewDatasetSchemaTable } from './ExperimentViewDatasetSchemaTable';
import type { RunDatasetWithTags } from '../../../../types';
import { DatasetSourceTypes } from '../../../../types';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export interface DatasetsCellRendererProps {
  datasetWithTags: RunDatasetWithTags;
}

export const ExperimentViewDatasetSchema = ({ datasetWithTags }: DatasetsCellRendererProps): JSX.Element => {
  const { theme } = useDesignSystemTheme();
  const { dataset } = datasetWithTags;
  const [filter, setFilter] = useState('');

  if (dataset.schema === null || dataset.schema === '') {
    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <div
          css={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignContent: 'center',
          }}
        >
          <Header title={<div css={{ color: theme.colors.grey600 }}>No schema available</div>} />
        </div>
      </div>
    );
  }
  try {
    const schema = JSON.parse(dataset.schema);
    if ('mlflow_colspec' in schema) {
      // if the dataset schema is colspec
      return (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100vh',
          }}
        >
          <div
            css={{
              marginTop: theme.spacing.sm,
              form: { width: '100%' },
            }}
          >
            <TableFilterInput
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetschema.tsx_92"
              value={filter}
              placeholder="Search fields"
              onChange={(e) => setFilter(e.target.value)}
              onClear={() => {
                setFilter('');
              }}
              css={{ width: '100%' }}
              containerProps={{ style: { width: 'auto' } }}
            />
          </div>
          <div
            css={{
              marginTop: theme.spacing.sm,
              overflow: 'hidden',
            }}
          >
            <ExperimentViewDatasetSchemaTable schema={schema.mlflow_colspec} filter={filter} />
          </div>
        </div>
      );
    } else if ('mlflow_tensorspec' in schema) {
      // if the dataset schema is tensorspec
      return (
        <div css={{ height: '100vh' }}>
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <TableIcon css={{ fontSize: '56px', color: theme.colors.grey600 }} />
            <Header title={<div css={{ color: theme.colors.grey600 }}>Array Datasource</div>} />
            {/* @ts-expect-error Type 'string' is not assignable to type '"primary" | "secondary" | "info" | "error" | "success" | "warning" | undefined' */}
            <Typography.Text color={theme.colors.grey600} css={{ textAlign: 'center' }}>
              <FormattedMessage
                defaultMessage="The dataset is an array. To see a preview of the dataset, view the dataset in the training notebook."
                description="Notification when the dataset is an array data source in the experiment run dataset schema"
              />
            </Typography.Text>
          </div>
        </div>
      );
    } else {
      // if the dataset schema is not colspec or tensorspec
      return (
        <div css={{ marginLeft: theme.spacing.lg, marginTop: theme.spacing.md, width: '100%' }}>
          <div css={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Header title={<div css={{ color: theme.colors.grey600 }}>Unrecognized Schema Format</div>} />
            {/* @ts-expect-error Type 'string' is not assignable to type '"primary" | "secondary" | "info" | "error" | "success" | "warning" | undefined' */}
            <Typography.Text color={theme.colors.grey600}>
              <FormattedMessage
                defaultMessage="Raw Schema JSON: "
                description="Label for the raw schema JSON in the experiment run dataset schema"
              />
              {JSON.stringify(schema)}
            </Typography.Text>
          </div>
        </div>
      );
    }
  } catch {
    return (
      <div css={{ marginLeft: theme.spacing.lg, marginTop: theme.spacing.md, width: '100%' }}>
        <div css={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <Header title={<div css={{ color: theme.colors.grey600 }}>No schema available</div>} />
        </div>
      </div>
    );
  }
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDatasetSchemaTable.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetSchemaTable.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { render, screen } from '../../../../../common/utils/TestUtils.react18';
import { ExperimentViewDatasetSchemaTable } from './ExperimentViewDatasetSchemaTable';
import { DesignSystemProvider } from '@databricks/design-system';

describe('ExperimentViewDatasetSchemaTable', () => {
  const renderTestComponent = ({ schema, filter }: { schema: any[]; filter: string }) => {
    return render(<ExperimentViewDatasetSchemaTable schema={schema} filter={filter} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <DesignSystemProvider>{children}</DesignSystemProvider>
        </IntlProvider>
      ),
    });
  };

  test('it renders regular column names', () => {
    const schema = [
      { name: 'feature_a', type: 'long' },
      { name: 'feature_b', type: 'string' },
      { name: 'target', type: 'double' },
    ];
    renderTestComponent({ schema, filter: '' });

    expect(screen.getByText('feature_a')).toBeInTheDocument();
    expect(screen.getByText('feature_b')).toBeInTheDocument();
    expect(screen.getByText('target')).toBeInTheDocument();
  });

  test('it renders MultiIndex column names as dot-separated strings', () => {
    const schema = [
      { name: ['foo', 'a'], type: 'long' },
      { name: ['foo', 'b'], type: 'long' },
      { name: ['bar', 'c'], type: 'long' },
      { name: ['bar', 'd'], type: 'long' },
    ];
    renderTestComponent({ schema, filter: '' });

    expect(screen.getByText('foo.a')).toBeInTheDocument();
    expect(screen.getByText('foo.b')).toBeInTheDocument();
    expect(screen.getByText('bar.c')).toBeInTheDocument();
    expect(screen.getByText('bar.d')).toBeInTheDocument();
  });

  test('it filters regular columns by name', () => {
    const schema = [
      { name: 'feature_a', type: 'long' },
      { name: 'feature_b', type: 'string' },
      { name: 'target', type: 'double' },
    ];
    renderTestComponent({ schema, filter: 'feature' });

    expect(screen.getByText('feature_a')).toBeInTheDocument();
    expect(screen.getByText('feature_b')).toBeInTheDocument();
    expect(screen.queryByText('target')).not.toBeInTheDocument();
  });

  test('it filters MultiIndex columns by first level', () => {
    const schema = [
      { name: ['foo', 'a'], type: 'long' },
      { name: ['foo', 'b'], type: 'long' },
      { name: ['bar', 'c'], type: 'long' },
      { name: ['bar', 'd'], type: 'long' },
    ];
    renderTestComponent({ schema, filter: 'foo' });

    expect(screen.getByText('foo.a')).toBeInTheDocument();
    expect(screen.getByText('foo.b')).toBeInTheDocument();
    expect(screen.queryByText('bar.c')).not.toBeInTheDocument();
    expect(screen.queryByText('bar.d')).not.toBeInTheDocument();
  });

  test('it filters MultiIndex columns by second level', () => {
    const schema = [
      { name: ['foo', 'a'], type: 'long' },
      { name: ['foo', 'b'], type: 'long' },
      { name: ['bar', 'c'], type: 'long' },
      { name: ['bar', 'd'], type: 'long' },
    ];
    renderTestComponent({ schema, filter: '.d' });

    expect(screen.queryByText('foo.a')).not.toBeInTheDocument();
    expect(screen.queryByText('foo.b')).not.toBeInTheDocument();
    expect(screen.queryByText('bar.c')).not.toBeInTheDocument();
    expect(screen.getByText('bar.d')).toBeInTheDocument();
  });

  test('it filters columns by type', () => {
    const schema = [
      { name: 'feature_a', type: 'long' },
      { name: 'feature_b', type: 'string' },
      { name: 'target', type: 'double' },
    ];
    renderTestComponent({ schema, filter: 'string' });

    expect(screen.queryByText('feature_a')).not.toBeInTheDocument();
    expect(screen.getByText('feature_b')).toBeInTheDocument();
    expect(screen.queryByText('target')).not.toBeInTheDocument();
  });

  test('it shows "No results" message when no columns match filter', () => {
    const schema = [
      { name: 'feature_a', type: 'long' },
      { name: 'feature_b', type: 'string' },
    ];
    renderTestComponent({ schema, filter: 'nonexistent' });

    expect(screen.getByText('No results match this search.')).toBeInTheDocument();
    expect(screen.queryByText('feature_a')).not.toBeInTheDocument();
    expect(screen.queryByText('feature_b')).not.toBeInTheDocument();
  });

  test('it handles case-insensitive filtering', () => {
    const schema = [
      { name: 'Feature_A', type: 'long' },
      { name: 'feature_b', type: 'string' },
    ];
    renderTestComponent({ schema, filter: 'FEATURE' });

    expect(screen.getByText('Feature_A')).toBeInTheDocument();
    expect(screen.getByText('feature_b')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDatasetSchemaTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetSchemaTable.tsx

```typescript
import { Table, TableCell, TableHeader, TableRow } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

export interface ExperimentViewDatasetSchemaTableProps {
  schema: Array<{ name: string | string[]; type: string }>;
  filter: string;
}

export const ExperimentViewDatasetSchemaTable = ({
  schema,
  filter,
}: ExperimentViewDatasetSchemaTableProps): JSX.Element => {
  const hasFilter = (name?: string | string[], type?: string) => {
    // Handle both string names (regular columns) and array names (MultiIndex columns)
    const nameStr = Array.isArray(name) ? name.join('.') : name;
    return (
      filter === '' ||
      nameStr?.toLowerCase().includes(filter.toLowerCase()) ||
      type?.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const filteredSchema = schema.filter((row) => hasFilter(row.name, row.type));

  const getNameHeader = () => {
    return (
      <FormattedMessage
        defaultMessage="Name"
        description='Header for "name" column in the experiment run dataset schema'
      />
    );
  };

  const getTypeHeader = () => {
    return <FormattedMessage defaultMessage="Type" description='Header for "type" column in the UC table schema' />;
  };

  return (
    <Table scrollable css={{ width: '100%' }}>
      <TableRow isHeader>
        <TableHeader componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetschematable.tsx_57">
          {getNameHeader()}
        </TableHeader>
        <TableHeader componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetschematable.tsx_58">
          {getTypeHeader()}
        </TableHeader>
      </TableRow>
      <div onWheel={(e) => e.stopPropagation()}>
        {filteredSchema.length === 0 ? (
          <TableRow>
            <TableCell>
              <FormattedMessage
                defaultMessage="No results match this search."
                description="No results message in datasets drawer table"
              />
            </TableCell>
          </TableRow>
        ) : (
          filteredSchema.map((row, idx: number) => (
            <TableRow key={`table-body-row-${idx}`}>
              <TableCell>{Array.isArray(row.name) ? row.name.join('.') : row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
            </TableRow>
          ))
        )}
      </div>
    </Table>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDatasetSourceType.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetSourceType.tsx
Signals: React

```typescript
import { Typography } from '@databricks/design-system';
import type { RunDatasetWithTags } from '../../../../types';
import { DatasetSourceTypes } from '../../../../types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export interface ExperimentViewDatasetSourceTypeProps {
  datasetWithTags: RunDatasetWithTags;
}

export const ExperimentViewDatasetSourceType = ({ datasetWithTags }: ExperimentViewDatasetSourceTypeProps) => {
  const { dataset } = datasetWithTags;

  const sourceType = dataset.sourceType;

  const getSourceTypeLabel = () => {
    if (sourceType === DatasetSourceTypes.HTTP || sourceType === DatasetSourceTypes.EXTERNAL) {
      return (
        <FormattedMessage
          defaultMessage="HTTP"
          description="Experiment dataset drawer > source type > HTTP source type label"
        />
      );
    }
    if (sourceType === DatasetSourceTypes.S3) {
      return (
        <FormattedMessage
          defaultMessage="S3"
          description="Experiment dataset drawer > source type > S3 source type label"
        />
      );
    }
    if (sourceType === DatasetSourceTypes.HUGGING_FACE) {
      return (
        <FormattedMessage
          defaultMessage="Hugging Face"
          description="Experiment dataset drawer > source type > Hugging Face source type label"
        />
      );
    }
    return null;
  };

  const typeLabel = getSourceTypeLabel();

  if (typeLabel) {
    return (
      <Typography.Hint>
        <FormattedMessage
          defaultMessage="Source type: {typeLabel}"
          description="Experiment dataset drawer > source type > label"
          values={{ typeLabel }}
        />
      </Typography.Hint>
    );
  }

  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDatasetSourceURL.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetSourceURL.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { RunDatasetWithTags } from '../../../../types';
import { DatasetSourceTypes } from '../../../../types';
import { getDatasetSourceUrl } from '../../../../utils/DatasetUtils';

export interface ExperimentViewDatasetSourceProps {
  datasetWithTags: RunDatasetWithTags;
}

export const ExperimentViewDatasetSourceURL = ({ datasetWithTags }: ExperimentViewDatasetSourceProps) => {
  const { dataset } = datasetWithTags;
  const { theme } = useDesignSystemTheme();

  const sourceType = dataset.sourceType;

  if (
    sourceType === DatasetSourceTypes.HTTP ||
    sourceType === DatasetSourceTypes.EXTERNAL ||
    sourceType === DatasetSourceTypes.HUGGING_FACE
  ) {
    const url = getDatasetSourceUrl(datasetWithTags);
    if (url) {
      return (
        <div
          css={{
            whiteSpace: 'nowrap',
            display: 'flex',
            fontSize: theme.typography.fontSizeSm,
            color: theme.colors.textSecondary,
            columnGap: theme.spacing.xs,
          }}
          title={url}
        >
          URL:{' '}
          <Typography.Link
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetsourceurl.tsx_34"
            openInNewTab
            href={url}
            css={{ display: 'flex', overflow: 'hidden' }}
          >
            <span css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
          </Typography.Link>
        </div>
      );
    }
  }
  if (sourceType === DatasetSourceTypes.S3) {
    try {
      const { uri } = JSON.parse(dataset.source);
      if (uri) {
        return (
          <Typography.Hint
            title={uri}
            css={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            S3 URI: {uri}
          </Typography.Hint>
        );
      }
    } catch {
      return null;
    }
  }
  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewDatasetWithContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewDatasetWithContext.tsx
Signals: React

```typescript
import { TableIcon, Tag, Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { RunDatasetWithTags } from '../../../../types';
import React from 'react';
import { MLFLOW_RUN_DATASET_CONTEXT_TAG } from '../../../../constants';

export interface DatasetWithContextProps {
  datasetWithTags: RunDatasetWithTags;
  displayTextAsLink: boolean;
  className?: string;
}

export const ExperimentViewDatasetWithContext = ({
  datasetWithTags,
  displayTextAsLink,
  className,
}: DatasetWithContextProps) => {
  const { dataset, tags } = datasetWithTags;
  const { theme } = useDesignSystemTheme();

  const contextTag = tags?.find(({ key }) => key === MLFLOW_RUN_DATASET_CONTEXT_TAG)?.value;

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.xs,
      }}
      className={className}
    >
      <TableIcon css={{ marginRight: theme.spacing.xs, color: theme.colors.textSecondary }} />
      {displayTextAsLink ? (
        <div>
          {dataset.name} ({dataset.digest})
        </div>
      ) : (
        <Typography.Text size="md" css={{ marginBottom: 0 }}>
          {dataset.name} ({dataset.digest})
        </Typography.Text>
      )}
      {contextTag && (
        <Tag
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewdatasetwithcontext.tsx_41"
          css={{
            textTransform: 'capitalize',
            marginLeft: theme.spacing.xs,
            marginRight: theme.spacing.xs,
          }}
        >
          {contextTag}
        </Tag>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunModals.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunModals.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import DeleteRunModal from '../../../modals/DeleteRunModal';
import { RenameRunModal } from '../../../modals/RenameRunModal';
import RestoreRunModal from '../../../modals/RestoreRunModal';

export interface ExperimentViewModalsProps {
  showDeleteRunModal: boolean;
  showRestoreRunModal: boolean;
  showRenameRunModal: boolean;
  runsSelected: Record<string, boolean>;
  onCloseDeleteRunModal: () => void;
  onCloseRestoreRunModal: () => void;
  onCloseRenameRunModal: () => void;
  renamedRunName: string;
  refreshRuns: () => void;
}

/**
 * A component that contains modals required for the run
 * management, i.e. delete and restore actions.
 */
export const ExperimentViewRunModals = ({
  showDeleteRunModal,
  showRestoreRunModal,
  showRenameRunModal,
  runsSelected,
  onCloseDeleteRunModal,
  onCloseRestoreRunModal,
  onCloseRenameRunModal,
  renamedRunName,
  refreshRuns,
}: ExperimentViewModalsProps) => {
  const selectedRunIds = Object.entries(runsSelected)
    .filter(([, selected]) => selected)
    .map(([key]) => key);

  return (
    <>
      <DeleteRunModal
        isOpen={showDeleteRunModal}
        onClose={onCloseDeleteRunModal}
        selectedRunIds={selectedRunIds}
        onSuccess={() => {
          refreshRuns();
        }}
      />
      <RestoreRunModal
        isOpen={showRestoreRunModal}
        onClose={onCloseRestoreRunModal}
        selectedRunIds={selectedRunIds}
        onSuccess={() => {
          refreshRuns();
        }}
      />
      <RenameRunModal
        runUuid={selectedRunIds[0]}
        onClose={onCloseRenameRunModal}
        runName={renamedRunName}
        isOpen={showRenameRunModal}
        onSuccess={() => {
          refreshRuns();
        }}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

````

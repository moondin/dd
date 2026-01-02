---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 471
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 471 of 991)

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

---[FILE: ExperimentLoggedModelListPageTableEmpty.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageTableEmpty.tsx
Signals: React

```typescript
import { Button, DangerIcon, Empty, Modal, Spacer, Typography, useDesignSystemTheme } from '@databricks/design-system';
import versionsEmptyImg from '@mlflow/mlflow/src/common/static/versions-empty.svg';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ExperimentKind, getMlflow3DocsLink } from '../../constants';
import { getExperimentKindFromTags } from '../../utils/ExperimentKindUtils';
import { useGetExperimentQuery } from '../../hooks/useExperimentQuery';
import { useParams } from '../../../common/utils/RoutingUtils';
import invariant from 'invariant';

const EXAMPLE_INSTALL_CODE = `pip install -U 'mlflow>=3.1'`;

const getGenAILearnMoreLink = (cloud: 'AWS' | 'GCP' | 'Azure') => {
  return 'https://mlflow.org/docs/latest/genai/prompt-version-mgmt/version-tracking/';
};

const getMLLearnMoreLink = (cloud: 'AWS' | 'GCP' | 'Azure') => {
  return 'https://mlflow.org/docs/latest/ml/mlflow-3/deep-learning/';
};

const getExampleCode = (isGenAIExperiment: boolean, experimentId: string) => {
  if (isGenAIExperiment) {
    return getExampleCodeGenAI(experimentId);
  }
  return getExampleCodeML(experimentId);
};

const getExampleCodeML = (experimentId: string) =>
  `
import pandas as pd
from sklearn.linear_model import ElasticNet
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

import mlflow
import mlflow.sklearn
from mlflow.entities import Dataset

mlflow.set_experiment(experimentid="${experimentId}")

# Helper function to compute metrics
def compute_metrics(actual, predicted):
    rmse = mean_squared_error(actual, predicted) 
    mae = mean_absolute_error(actual, predicted)
    r2 = r2_score(actual, predicted)
    return rmse, mae, r2

# Load Iris dataset and prepare the DataFrame
iris = load_iris()
iris_df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
iris_df['quality'] = (iris.target == 2).astype(int)  # Create a binary target for simplicity

# Split into training and testing datasets
train_df, test_df = train_test_split(iris_df, test_size=0.2, random_state=42)

# Start a run to represent the training job
with mlflow.start_run() as training_run:
    # Load the training dataset with MLflow. We will link training metrics to this dataset.
    train_dataset: Dataset = mlflow.data.from_pandas(train_df, name="train")
    train_x = train_dataset.df.drop(["quality"], axis=1)
    train_y = train_dataset.df[["quality"]]

    # Fit a model to the training dataset
    lr = ElasticNet(alpha=0.5, l1_ratio=0.5, random_state=42)
    lr.fit(train_x, train_y)

    # Log the model, specifying its ElasticNet parameters (alpha, l1_ratio)
    # As a new feature, the LoggedModel entity is linked to its name and params
    model_info = mlflow.sklearn.log_model(
        sk_model=lr,
        name="elasticnet",
        params={
            "alpha": 0.5,
            "l1_ratio": 0.5,
        },
        input_example = train_x
    )

    # Inspect the LoggedModel and its properties
    logged_model = mlflow.get_logged_model(model_info.model_id)
    print(logged_model.model_id, logged_model.params)

    # Evaluate the model on the training dataset and log metrics
    # These metrics are now linked to the LoggedModel entity
    predictions = lr.predict(train_x)
    (rmse, mae, r2) = compute_metrics(train_y, predictions)
    mlflow.log_metrics(
        metrics={
            "rmse": rmse,
            "r2": r2,
            "mae": mae,
        },
        model_id=logged_model.model_id,
        dataset=train_dataset
    )

    # Inspect the LoggedModel, now with metrics
    logged_model = mlflow.get_logged_model(model_info.model_id)
    print(logged_model.model_id, logged_model.metrics)`.trim();

const getExampleCodeGenAI = (experimentId: string) =>
  `
import mlflow

mlflow.set_experiment(experiment_id="${experimentId}")

# Define a new GenAI app version, represented as an MLflow LoggedModel
mlflow.set_active_model(name="my-app-v1")

# Log LLM hyperparameters, prompts, and more
mlflow.log_model_params({
    "prompt_template": "My prompt template",
    "llm": "databricks-llama-4-maverick",
    "temperature": 0.2,
})

# Define application code and add MLflow tracing to capture requests and responses.
# (Replace this with your GenAI application or agent code)
@mlflow.trace
def predict(query):
    return f"Response to query: {query}"

# Run your application code. Resulting traces are automatically linked to
# your GenAI app version.
predict("What is MLflow?")
`.trim();

export const ExperimentLoggedModelListPageTableEmpty = ({
  displayShowExampleButton = true,
  isFilteringActive = false,
  badRequestError,
}: {
  displayShowExampleButton?: boolean;
  isFilteringActive?: boolean;
  badRequestError?: Error;
}) => {
  const { theme } = useDesignSystemTheme();
  const { experimentId } = useParams();
  const cloud = 'AWS';

  invariant(experimentId, 'Experiment ID must be defined');

  const [isCodeExampleVisible, setIsCodeExampleVisible] = useState(false);
  const { data: experimentEntity, loading: isExperimentLoading } = useGetExperimentQuery({
    experimentId,
  });
  const experiment = experimentEntity;
  const experimentKind = getExperimentKindFromTags(experiment?.tags);
  const isGenAIExperiment =
    experimentKind === ExperimentKind.GENAI_DEVELOPMENT || experimentKind === ExperimentKind.GENAI_DEVELOPMENT_INFERRED;

  const isEmpty = !badRequestError && !isFilteringActive;

  return (
    <div
      css={{
        inset: 0,
        top: theme.general.heightBase + theme.spacing.lg,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 160,
      }}
    >
      {isEmpty ? (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 'min(100%, 600px)',
            padding: `0px ${theme.spacing.md}px`,
          }}
        >
          <Typography.Title level={3} color="secondary">
            {isGenAIExperiment ? (
              <FormattedMessage
                defaultMessage="Track and compare versions of your GenAI app"
                description="Empty state title displayed when no models are logged in the genai logged models list page"
              />
            ) : (
              <FormattedMessage
                defaultMessage="Track and compare versions of your models"
                description="Empty state title displayed when no models are logged in the machine learning logged models list page"
              />
            )}
          </Typography.Title>
          <Typography.Paragraph color="secondary" css={{ textAlign: 'center' }}>
            {isGenAIExperiment ? (
              <FormattedMessage
                defaultMessage="Track every version of your app's code and prompts to understand how quality changes over time. {learnMoreLink}"
                description="Empty state description displayed when no models are logged in the genai logged models list page"
                values={{
                  learnMoreLink: (
                    <Typography.Link
                      componentId="mlflow.logged_models.list.genai_no_results_learn_more"
                      openInNewTab
                      href={getGenAILearnMoreLink(cloud as 'AWS' | 'GCP' | 'Azure')}
                      css={{ whiteSpace: 'nowrap' }}
                    >
                      <FormattedMessage defaultMessage="Learn more" description="Learn more link text" />
                    </Typography.Link>
                  ),
                }}
              />
            ) : (
              <FormattedMessage
                defaultMessage="Track every version of your model to understand how quality changes over time. {learnMoreLink}"
                description="Empty state description displayed when no models are logged in the machine learning logged models list page"
                values={{
                  learnMoreLink: (
                    <Typography.Link
                      componentId="mlflow.logged_models.list.ml_no_results_learn_more"
                      openInNewTab
                      href={getMLLearnMoreLink(cloud as 'AWS' | 'GCP' | 'Azure')}
                      css={{ whiteSpace: 'nowrap' }}
                    >
                      <FormattedMessage defaultMessage="Learn more" description="Learn more link text" />
                    </Typography.Link>
                  ),
                }}
              />
            )}
          </Typography.Paragraph>
          <img css={{ maxWidth: 'min(100%, 600px)' }} src={versionsEmptyImg} alt="No models found" />
          <div css={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
            <Button
              componentId="mlflow.logged_models.list.show_example_code"
              onClick={() => setIsCodeExampleVisible(!isCodeExampleVisible)}
            >
              {isGenAIExperiment ? (
                <FormattedMessage
                  defaultMessage="Create version"
                  description="Button for creating a new genai model version"
                />
              ) : (
                <FormattedMessage
                  defaultMessage="Create model version"
                  description="Button for creating a new classic ML model version"
                />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <Empty
          title={
            badRequestError ? (
              <FormattedMessage
                defaultMessage="Request error"
                description="Error state title displayed in the logged models list page"
              />
            ) : (
              <FormattedMessage
                defaultMessage="No models found"
                description="Empty state title displayed when all models are filtered out in the logged models list page"
              />
            )
          }
          description={
            badRequestError ? (
              badRequestError.message
            ) : isFilteringActive ? (
              <FormattedMessage
                defaultMessage="We couldn't find any models matching your search criteria. Try changing your search filters."
                description="Empty state message displayed when all models are filtered out in the logged models list page"
              />
            ) : (
              <FormattedMessage
                defaultMessage="Your models will appear here once you log them using newest version of MLflow. <link>Learn more</link>."
                description="Placeholder for empty models table on the logged models list page"
                values={{
                  link: (chunks) => (
                    <Typography.Link
                      componentId="mlflow.logged_models.list.no_results_learn_more"
                      openInNewTab
                      href={getMlflow3DocsLink()}
                    >
                      {chunks}
                    </Typography.Link>
                  ),
                }}
              />
            )
          }
          image={badRequestError ? <DangerIcon /> : undefined}
          button={
            displayShowExampleButton && !isFilteringActive && !badRequestError ? (
              <Button
                type="primary"
                componentId="mlflow.logged_models.list.show_example_code"
                loading={isExperimentLoading}
                onClick={() => setIsCodeExampleVisible(!isCodeExampleVisible)}
              >
                {isGenAIExperiment ? (
                  <FormattedMessage
                    defaultMessage="Create version"
                    description="Button for creating a new genai model version"
                  />
                ) : (
                  <FormattedMessage
                    defaultMessage="Create model version"
                    description="Button for creating a new classic ML model version"
                  />
                )}
              </Button>
            ) : null
          }
        />
      )}
      <Modal
        size="wide"
        visible={isCodeExampleVisible}
        onCancel={() => setIsCodeExampleVisible(false)}
        title={
          <FormattedMessage
            defaultMessage="Example code"
            description="Title of the modal with the logged models quickstart example code"
          />
        }
        componentId="mlflow.logged_models.list.example_code_modal"
        okText={
          <FormattedMessage
            defaultMessage="Close"
            description="Button for closing modal with the logged models quickstart example code"
          />
        }
        onOk={() => setIsCodeExampleVisible(false)}
      >
        <Typography.Text>
          <FormattedMessage
            defaultMessage="Install MLflow 3:"
            description="Instruction for installing MLflow from mlflow-3 branch in log MLflow 3 models"
          />
        </Typography.Text>
        <CodeSnippet language="text">{EXAMPLE_INSTALL_CODE}</CodeSnippet>
        <Spacer size="sm" />
        {isGenAIExperiment ? (
          <FormattedMessage
            defaultMessage="Run example code:"
            description="Instruction for running example GenAI code in order to log MLflow 3 models"
          />
        ) : (
          <FormattedMessage
            defaultMessage="Run example training code:"
            description="Instruction for running example training code in order to log MLflow 3 models"
          />
        )}
        <CodeSnippet language="python">{getExampleCode(isGenAIExperiment, experimentId)}</CodeSnippet>
      </Modal>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelSourceBox.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelSourceBox.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { ExperimentLoggedModelSourceBox } from './ExperimentLoggedModelSourceBox';
import type { LoggedModelProto } from '../../types';
import { DesignSystemProvider } from '@databricks/design-system';
import { TestRouter, testRoute } from '../../../common/utils/RoutingTestUtils';

const defaultTestTags = [
  { key: 'mlflow.source.git.branch', value: 'branch-abc' },
  { key: 'mlflow.source.git.commit', value: 'abc123def456' },
  { key: 'mlflow.source.type', value: 'NOTEBOOK' },
];

describe('ExperimentLoggedModelSourceBox', () => {
  const renderTestComponent = (tags = defaultTestTags) => {
    const mockLoggedModel: LoggedModelProto = {
      info: {
        tags,
      },
    };

    render(<ExperimentLoggedModelSourceBox loggedModel={mockLoggedModel} displayDetails />, {
      wrapper: ({ children }) => (
        <DesignSystemProvider>
          <TestRouter routes={[testRoute(<>{children}</>)]} />
        </DesignSystemProvider>
      ),
    });
  };

  it('renders local source', async () => {
    renderTestComponent([
      ...defaultTestTags,
      { key: 'mlflow.source.type', value: 'LOCAL' },
      { key: 'mlflow.source.name', value: 'some-file.py' },
    ]);
    await waitFor(() => {
      expect(screen.getByText('some-file.py')).toBeInTheDocument();
    });
    expect(screen.getByText('branch-abc')).toBeInTheDocument();
    expect(screen.getByText('abc123d')).toBeInTheDocument();
  });

  it('renders a placeholder when run source is not defined', async () => {
    renderTestComponent([]);
    await waitFor(() => {
      expect(screen.getByText('—')).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelSourceBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelSourceBox.tsx
Signals: React

```typescript
import {
  BranchIcon,
  CopyIcon,
  GitCommitIcon,
  Tag,
  Typography,
  useDesignSystemTheme,
  Tooltip,
  Popover,
} from '@databricks/design-system';
import Utils from '../../../common/utils/Utils';
import type { LoggedModelKeyValueProto, LoggedModelProto } from '../../types';
import { MLFLOW_RUN_GIT_SOURCE_BRANCH_TAG } from '../../constants';
import { CopyButton } from '@mlflow/mlflow/src/shared/building_blocks/CopyButton';
import { ExperimentSourceTypeIcon } from '../ExperimentSourceTypeIcon';
import { useMemo } from 'react';
import { useSearchParams } from '../../../common/utils/RoutingUtils';

export const ExperimentLoggedModelSourceBox = ({
  loggedModel,
  displayDetails,
  className,
}: {
  loggedModel: LoggedModelProto;
  /**
   * Set to true to display the branch name and commit hash.
   */
  displayDetails?: boolean;
  className?: string;
}) => {
  const [searchParams] = useSearchParams();

  const tagsByKey = useMemo(
    () =>
      loggedModel?.info?.tags?.reduce((acc, tag) => {
        if (!tag.key) {
          return acc;
        }
        acc[tag.key] = tag;
        return acc;
      }, {} as Record<string, LoggedModelKeyValueProto>) ?? {},
    [loggedModel?.info?.tags],
  );

  const branchName = tagsByKey?.[MLFLOW_RUN_GIT_SOURCE_BRANCH_TAG]?.value;
  const commitHash = tagsByKey?.[Utils.gitCommitTag]?.value;

  const runSource = useMemo(() => {
    try {
      return Utils.renderSource(tagsByKey, searchParams.toString(), undefined, branchName);
    } catch (e) {
      return undefined;
    }
  }, [tagsByKey, searchParams, branchName]);

  const sourceTypeValue = tagsByKey[Utils.sourceTypeTag]?.value;

  const { theme } = useDesignSystemTheme();
  return runSource ? (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        flexWrap: displayDetails ? 'wrap' : undefined,
      }}
      className={className}
    >
      {sourceTypeValue && (
        <ExperimentSourceTypeIcon
          sourceType={sourceTypeValue}
          css={{ color: theme.colors.actionPrimaryBackgroundDefault }}
        />
      )}
      {runSource}{' '}
      {displayDetails && branchName && (
        <Tooltip componentId="mlflow.logged_model.details.source.branch_tooltip" content={branchName}>
          <Tag componentId="mlflow.logged_model.details.source.branch" css={{ marginRight: 0 }}>
            <div css={{ display: 'flex', gap: theme.spacing.xs, whiteSpace: 'nowrap' }}>
              <BranchIcon /> {branchName}
            </div>
          </Tag>
        </Tooltip>
      )}
      {displayDetails && commitHash && (
        <Popover.Root componentId="mlflow.logged_model.details.source.commit_hash_popover">
          <Popover.Trigger asChild>
            <Tag
              componentId="mlflow.logged_model.details.source.commit_hash"
              css={{ marginRight: 0, '&>div': { paddingRight: 0 } }}
            >
              <div css={{ display: 'flex', gap: theme.spacing.xs, whiteSpace: 'nowrap', alignContent: 'center' }}>
                <GitCommitIcon />
                {commitHash.slice(0, 7)}
              </div>
            </Tag>
          </Popover.Trigger>
          <Popover.Content align="start">
            <Popover.Arrow />
            <div css={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center' }}>
              {commitHash}
              <CopyButton showLabel={false} size="small" type="tertiary" copyText={commitHash} icon={<CopyIcon />} />
            </div>
          </Popover.Content>
        </Popover.Root>
      )}
    </div>
  ) : (
    <Typography.Hint>—</Typography.Hint>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelStatusIndicator.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelStatusIndicator.tsx

```typescript
import {
  CheckCircleIcon,
  ClockIcon,
  Tag,
  Typography,
  useDesignSystemTheme,
  XCircleIcon,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { LoggedModelStatusProtoEnum, type LoggedModelProto } from '../../types';

const LoggedModelStatusIcon = ({ status }: { status: LoggedModelStatusProtoEnum }) => {
  if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_READY) {
    return <CheckCircleIcon color="success" />;
  }

  if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_UPLOAD_FAILED) {
    return <XCircleIcon color="danger" />;
  }

  if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_PENDING) {
    return <ClockIcon color="warning" />;
  }

  return null;
};

export const ExperimentLoggedModelStatusIndicator = ({ data }: { data: LoggedModelProto }) => {
  const { theme } = useDesignSystemTheme();
  const status = data.info?.status ?? LoggedModelStatusProtoEnum.LOGGED_MODEL_STATUS_UNSPECIFIED;

  const getTagColor = () => {
    if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_READY) {
      return theme.isDarkMode ? theme.colors.green800 : theme.colors.green100;
    }
    if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_UPLOAD_FAILED) {
      return theme.isDarkMode ? theme.colors.red800 : theme.colors.red100;
    }
    if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_PENDING) {
      return theme.isDarkMode ? theme.colors.yellow800 : theme.colors.yellow100;
    }

    return undefined;
  };

  const getStatusLabel = () => {
    if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_READY) {
      return (
        <Typography.Text color="success">
          <FormattedMessage defaultMessage="Ready" description="Label for ready state of a experiment logged model" />
        </Typography.Text>
      );
    }

    if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_UPLOAD_FAILED) {
      return (
        <Typography.Text color="error">
          <FormattedMessage
            defaultMessage="Failed"
            description="Label for upload failed state of a experiment logged model"
          />
        </Typography.Text>
      );
    }
    if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_PENDING) {
      return (
        <Typography.Text color="warning">
          <FormattedMessage
            defaultMessage="Pending"
            description="Label for pending state of a experiment logged model"
          />
        </Typography.Text>
      );
    }

    return status;
  };

  if (status === LoggedModelStatusProtoEnum.LOGGED_MODEL_STATUS_UNSPECIFIED) {
    return null;
  }

  return (
    <Tag componentId="mlflow.logged_model.status" css={{ backgroundColor: getTagColor() }}>
      {status && <LoggedModelStatusIcon status={status} />}{' '}
      <Typography.Text css={{ marginLeft: theme.spacing.sm }}>{getStatusLabel()}</Typography.Text>
    </Tag>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelTableDatasetCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelTableDatasetCell.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import type { LoggedModelProto } from '../../types';
import { Overflow } from '@databricks/design-system';
import { ExperimentLoggedModelDatasetButton } from './ExperimentLoggedModelDatasetButton';

export const ExperimentLoggedModelTableDatasetCell = ({ data: loggedModel }: { data?: LoggedModelProto }) => {
  const uniqueDatasets = useMemo(() => {
    const allMetrics = loggedModel?.data?.metrics ?? [];
    return allMetrics.reduce<{ dataset_name: string; dataset_digest: string; run_id: string | undefined }[]>(
      (aggregate, { dataset_digest, dataset_name, run_id }) => {
        if (
          dataset_name &&
          dataset_digest &&
          !aggregate.find(
            (dataset) => dataset.dataset_name === dataset_name && dataset.dataset_digest === dataset_digest,
          )
        ) {
          aggregate.push({ dataset_name, dataset_digest, run_id });
        }
        return aggregate;
      },
      [],
    );
  }, [loggedModel]);

  if (!uniqueDatasets.length) {
    return <>-</>;
  }

  return (
    <Overflow>
      {uniqueDatasets.map(({ dataset_digest, dataset_name, run_id }) => (
        <ExperimentLoggedModelDatasetButton
          datasetName={dataset_name}
          datasetDigest={dataset_digest}
          runId={run_id ?? null}
          key={[dataset_name, dataset_digest].join('.')}
        />
      ))}
    </Overflow>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelTableDatasetColHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelTableDatasetColHeader.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';

import type { LoggedModelProto } from '../../types';
import { Overflow, Spinner, TableIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { ExperimentLoggedModelDatasetButton } from './ExperimentLoggedModelDatasetButton';
import type { ColumnGroup } from '@ag-grid-community/core';
import { useExperimentLoggedModelOpenDatasetDetails } from './hooks/useExperimentLoggedModelOpenDatasetDetails';
import { FormattedMessage } from 'react-intl';

export const createLoggedModelDatasetColumnGroupId = (datasetName?: string, datasetDigest?: string, runId?: string) =>
  `metrics.${JSON.stringify([datasetName, datasetDigest, runId])}`;
const parseLoggedModelDatasetColumnGroupId = (groupId: string) => {
  try {
    const match = groupId.match(/metrics\.(.+)/);
    if (!match) {
      return null;
    }
    const datasetHash = match[1];
    const [datasetName, datasetDigest, runId] = JSON.parse(datasetHash);
    if (!datasetName || !datasetDigest) {
      return null;
    }
    return { datasetName, datasetDigest, runId };
  } catch {
    return null;
  }
};

export const ExperimentLoggedModelTableDatasetColHeader = ({ columnGroup }: { columnGroup: ColumnGroup }) => {
  const { onDatasetClicked } = useExperimentLoggedModelOpenDatasetDetails();
  const { theme } = useDesignSystemTheme();
  const [loading, setLoading] = useState(false);

  const datasetObject = useMemo(() => {
    try {
      const groupId = columnGroup.getGroupId();
      return groupId ? parseLoggedModelDatasetColumnGroupId(groupId) : null;
    } catch {
      return null;
    }
  }, [columnGroup]);
  if (!datasetObject) {
    return (
      <FormattedMessage
        defaultMessage="No dataset"
        description="Label for the metrics column group header that are not grouped by dataset"
      />
    );
  }
  return (
    <span css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, overflow: 'hidden' }}>
      Dataset:{' '}
      <Typography.Link
        css={{
          '.anticon': {
            fontSize: theme.general.iconFontSize,
          },
          fontSize: theme.typography.fontSizeBase,
          fontWeight: 'normal',
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}
        role="button"
        componentId="mlflow.logged_model.list.metric_by_dataset_column_header"
        onClick={async () => {
          setLoading(true);
          try {
            await onDatasetClicked({
              datasetName: datasetObject.datasetName,
              datasetDigest: datasetObject.datasetDigest,
              runId: datasetObject.runId,
            });
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? <Spinner size="small" /> : <TableIcon />}
        {datasetObject.datasetName} (#{datasetObject.datasetDigest})
      </Typography.Link>
    </span>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelTableDateCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelTableDateCell.tsx
Signals: React

```typescript
import React from 'react';

import { TimeAgo } from '@databricks/web-shared/browse';

export const ExperimentLoggedModelTableDateCell = ({ value }: { value?: string | number | null }) => {
  const date = new Date(Number(value));

  if (isNaN(date as any)) {
    return null;
  }

  return <TimeAgo date={date} />;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelTableGroupCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelTableGroupCell.tsx

```typescript
import { Button, ChevronDownIcon, ChevronRightIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { Link } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';
import { useExperimentLoggedModelListPageTableContext } from './ExperimentLoggedModelListPageTableContext';
import type { LoggedModelDataGroupDataRow } from './ExperimentLoggedModelListPageTable.utils';
import { LoggedModelsTableSpecialRowID } from './ExperimentLoggedModelListPageTable.utils';
import { FormattedMessage } from 'react-intl';

export const ExperimentLoggedModelTableGroupCell = ({ data }: { data: LoggedModelDataGroupDataRow }) => {
  const { theme } = useDesignSystemTheme();
  const { expandedGroups, onGroupToggle } = useExperimentLoggedModelListPageTableContext();

  const groupId = data.groupUuid;
  const isExpanded = expandedGroups?.includes(groupId);

  return (
    <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
      <Button
        icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        componentId="mlflow.logged_model_table.group_toggle"
        onClick={() => onGroupToggle?.(groupId)}
        size="small"
      />
      {data.groupData?.sourceRun ? (
        <Link
          to={Routes.getRunPageRoute(data.groupData.sourceRun.info.experimentId, data.groupData.sourceRun.info.runUuid)}
          target="_blank"
        >
          {data.groupData.sourceRun.info.runName || data.groupData.sourceRun.info.runUuid}
        </Link>
      ) : null}
      {groupId === LoggedModelsTableSpecialRowID.REMAINING_MODELS_GROUP ? (
        <Typography.Text>
          {/* Shouldn't really happen, but we should handle it gracefully */}
          <FormattedMessage
            defaultMessage="Ungrouped"
            description="Label for the group of logged models that are not grouped by any source run"
          />
        </Typography.Text>
      ) : null}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelTableNameCell.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelTableNameCell.test.tsx

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ExperimentLoggedModelTableNameCell } from './ExperimentLoggedModelTableNameCell';
import type { LoggedModelProto } from '../../types';
import { DesignSystemProvider } from '@databricks/design-system';
import { useExperimentLoggedModelRegisteredVersions } from './hooks/useExperimentLoggedModelRegisteredVersions';
import { BrowserRouter } from '../../../common/utils/RoutingUtils';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

// Mock the hooks and safex
jest.mock('./hooks/useExperimentLoggedModelRegisteredVersions');
const mockUseExperimentLoggedModelRegisteredVersions = jest.mocked(useExperimentLoggedModelRegisteredVersions);
describe('ExperimentLoggedModelTableNameCell', () => {
  const createMockLoggedModel = (
    experimentId = 'exp-123',
    modelId = 'model-456',
    name = 'test-logged-model',
  ): LoggedModelProto => ({
    info: {
      experiment_id: experimentId,
      model_id: modelId,
      name,
    },
  });

  const renderComponent = (loggedModel: LoggedModelProto) => {
    render(<ExperimentLoggedModelTableNameCell data={loggedModel} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <DesignSystemProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </DesignSystemProvider>
        </IntlProvider>
      ),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default hook mock - access granted and no models
    mockUseExperimentLoggedModelRegisteredVersions.mockReturnValue({
      modelVersions: [],
      isLoading: false,
    });
  });
  describe('when feature flag is disabled', () => {
    it('should display original logged model name and link to logged model details', () => {
      const loggedModel = createMockLoggedModel();
      renderComponent(loggedModel);

      expect(screen.getByText('test-logged-model')).toBeInTheDocument();
      expect(screen.queryByText('v1')).not.toBeInTheDocument();
    });

    it('should render without link when experiment_id or model_id is missing', () => {
      const loggedModel: LoggedModelProto = {
        info: {
          experiment_id: undefined,
          model_id: undefined,
          name: 'test-logged-model',
        },
      };
      renderComponent(loggedModel);

      expect(screen.getByText('test-logged-model')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should not display tooltip when feature flag is disabled', async () => {
      const userEvent_ = userEvent.setup();
      const loggedModel = createMockLoggedModel('exp-123', 'model-456', 'test-logged-model');
      renderComponent(loggedModel);

      const modelLink = screen.getByRole('link');
      await userEvent_.hover(modelLink);

      // Tooltip should not appear when feature flag is disabled
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(screen.queryByText(/Original logged model:/)).not.toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

````

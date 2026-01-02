---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 454
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 454 of 991)

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

---[FILE: ShowArtifactLoggedModelView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactLoggedModelView.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import yaml from 'js-yaml';
import '../../../common/styles/CodeSnippet.css';
import { MLMODEL_FILE_NAME, SERVING_INPUT_FILE_NAME } from '../../constants';
import { getArtifactContent, getArtifactLocationUrl } from '../../../common/utils/ArtifactUtils';
import { SchemaTable } from '../../../model-registry/components/SchemaTable';
import {
  RegisteringModelDocUrl,
  ModelSignatureUrl,
  PyfuncDocUrl,
  CustomPyfuncModelsDocUrl,
} from '../../../common/constants';
import { Typography } from '@databricks/design-system';
import type { IntlShape } from 'react-intl';
import { FormattedMessage, injectIntl } from 'react-intl';

import './ShowArtifactLoggedModelView.css';
import { ArtifactViewSkeleton } from './ArtifactViewSkeleton';
import { ArtifactViewErrorState } from './ArtifactViewErrorState';
import { ShowArtifactCodeSnippet } from './ShowArtifactCodeSnippet';
import { fetchArtifactUnified } from './utils/fetchArtifactUnified';
import type { KeyValueEntity } from '../../../common/types';

const { Paragraph, Text, Title } = Typography;

type OwnProps = {
  experimentId: string;
  runUuid: string;
  path: string;
  getArtifact?: (...args: any[]) => any;
  artifactRootUri: string;
  registeredModelLink?: string;
  intl: IntlShape;
  entityTags?: Partial<KeyValueEntity>[];
};

type State = any;

type Props = OwnProps & typeof ShowArtifactLoggedModelViewImpl.defaultProps;

export class ShowArtifactLoggedModelViewImpl extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.fetchLoggedModelMetadata = this.fetchLoggedModelMetadata.bind(this);
  }

  static defaultProps = {
    getArtifact: getArtifactContent,
  };

  state = {
    loading: true,
    error: undefined,
    inputs: undefined,
    outputs: undefined,
    flavor: undefined,
    loader_module: undefined,
    hasInputExample: false,
  };

  componentDidMount() {
    this.fetchLoggedModelMetadata();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.path !== prevProps.path || this.props.runUuid !== prevProps.runUuid) {
      this.fetchLoggedModelMetadata();
    }
  }
  static getLearnModelRegistryLinkUrl = () => RegisteringModelDocUrl;

  renderModelRegistryText() {
    return this.props.registeredModelLink ? (
      <>
        <FormattedMessage
          defaultMessage="This model is also registered to the <link>model registry</link>."
          description="Sub text to tell the users where the registered models are located "
          values={{
            link: (
              chunks: any, // Reported during ESLint upgrade
            ) => (
              // eslint-disable-next-line react/jsx-no-target-blank
              <a href={ShowArtifactLoggedModelViewImpl.getLearnModelRegistryLinkUrl()} target="_blank">
                {chunks}
              </a>
            ),
          }}
        />
      </>
    ) : (
      <>
        <FormattedMessage
          // eslint-disable-next-line max-len
          defaultMessage="You can also <link>register it to the model registry</link> to version control"
          description="Sub text to tell the users where one can go to register the model artifact"
          values={{
            link: (
              chunks: any, // Reported during ESLint upgrade
            ) => (
              // eslint-disable-next-line react/jsx-no-target-blank
              <a href={ShowArtifactLoggedModelViewImpl.getLearnModelRegistryLinkUrl()} target="_blank">
                {chunks}
              </a>
            ),
          }}
        />
      </>
    );
  }

  sparkDataFrameCodeText(modelPath: any) {
    return (
      `import mlflow\n` +
      `from pyspark.sql.functions import struct, col\n` +
      `logged_model = '${modelPath}'\n\n` +
      `# ${this.props.intl.formatMessage({
        defaultMessage: 'Load model as a Spark UDF. Override result_type if the model does not return double values.',
        description: 'Code comment which states how to load model using spark UDF',
      })}\n` +
      `loaded_model = mlflow.pyfunc.spark_udf(spark, model_uri=logged_model)\n\n` +
      `# ${this.props.intl.formatMessage({
        defaultMessage: 'Predict on a Spark DataFrame.',
        description: 'Code comment which states on how we can predict using spark DataFrame',
      })}\n` +
      `df.withColumn('predictions', loaded_model(struct(*map(col, df.columns))))`
    );
  }

  loadModelCodeText(modelPath: any, flavor: any) {
    return (
      `import mlflow\n` +
      `logged_model = '${modelPath}'\n\n` +
      `# ${this.props.intl.formatMessage({
        defaultMessage: 'Load model',
        description: 'Code comment which states how to load the model',
      })}\n` +
      `loaded_model = mlflow.${flavor}.load_model(logged_model)\n`
    );
  }

  pandasDataFrameCodeText(modelPath: any) {
    return (
      `import mlflow\n` +
      `logged_model = '${modelPath}'\n\n` +
      `# ${this.props.intl.formatMessage({
        defaultMessage: 'Load model as a PyFuncModel.',
        description: 'Code comment which states how to load model using PyFuncModel',
      })}\n` +
      `loaded_model = mlflow.pyfunc.load_model(logged_model)\n\n` +
      `# ${this.props.intl.formatMessage({
        defaultMessage: 'Predict on a Pandas DataFrame.',
        description: 'Code comment which states on how we can predict using pandas DataFrame',
      })}\n` +
      `import pandas as pd\n` +
      `loaded_model.predict(pd.DataFrame(data))`
    );
  }

  mlflowSparkCodeText(modelPath: any) {
    return (
      `import mlflow\n` +
      `logged_model = '${modelPath}'\n\n` +
      `# ${this.props.intl.formatMessage({
        defaultMessage: 'Load model',
        description: 'Code comment which states how to load a SparkML model',
      })}\n` +
      `loaded_model = mlflow.spark.load_model(logged_model)\n\n` +
      `# ${this.props.intl.formatMessage({
        defaultMessage: 'Perform inference via model.transform()',
        description: 'Code comment which states how we can perform SparkML inference',
      })}\n` +
      `loaded_model.transform(data)`
    );
  }

  validateModelPredict(modelPath: any) {
    if (this.state.hasInputExample) {
      return `import mlflow
from mlflow.models import Model

model_uri = '${modelPath}'
# The model is logged with an input example
pyfunc_model = mlflow.pyfunc.load_model(model_uri)
input_data = pyfunc_model.input_example

# Verify the model with the provided input data using the logged dependencies.
# For more details, refer to:
# https://mlflow.org/docs/latest/models.html#validate-models-before-deployment
mlflow.models.predict(
    model_uri=model_uri,
    input_data=input_data,
    env_manager="uv",
)`;
    } else {
      return `import mlflow

model_uri = '${modelPath}'

# Replace INPUT_EXAMPLE with your own input example to the model
# A valid input example is a data instance suitable for pyfunc prediction
input_data = INPUT_EXAMPLE

# Verify the model with the provided input data using the logged dependencies.
# For more details, refer to:
# https://mlflow.org/docs/latest/models.html#validate-models-before-deployment
mlflow.models.predict(
    model_uri=model_uri,
    input_data=input_data,
    env_manager="uv",
)`;
    }
  }

  renderNonPyfuncCodeSnippet() {
    const { flavor } = this.state;
    const { runUuid, path } = this.props;
    const modelPath = `runs:/${runUuid}/${path}`;

    if (flavor === 'mleap') {
      // MLeap models can't be reloaded in Python.
      return <></>;
    }

    return (
      <>
        <Title level={3}>
          <FormattedMessage
            defaultMessage="Load the model"
            // eslint-disable-next-line max-len
            description="Heading text for stating how to load the model from the experiment run"
          />
        </Title>
        <div className="artifact-logged-model-view-code-content">
          <div>
            <ShowArtifactCodeSnippet code={this.loadModelCodeText(modelPath, flavor)} />
            <FormattedMessage
              // eslint-disable-next-line max-len
              defaultMessage="See the documents below to learn how to customize this model and deploy it for batch or real-time scoring using the pyfunc model flavor."
              // eslint-disable-next-line max-len
              description="Subtext heading for a list of documents that describe how to customize the model using the mlflow.pyfunc module"
            />
            <ul>
              <li>
                <a href={PyfuncDocUrl}>API reference for the mlflow.pyfunc module</a>
              </li>
              <li>
                <a href={CustomPyfuncModelsDocUrl}>Creating custom Pyfunc models</a>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }

  renderPandasDataFramePrediction(modelPath: any) {
    return (
      <div css={{ marginBottom: 16 }}>
        <Text>
          <FormattedMessage
            defaultMessage="Predict on a Pandas DataFrame:" // eslint-disable-next-line max-len
            description="Section heading to display the code block on how we can use registered model to predict using pandas DataFrame"
          />
        </Text>
        <ShowArtifactCodeSnippet code={this.pandasDataFrameCodeText(modelPath)} />
      </div>
    );
  }

  renderPyfuncCodeSnippet() {
    if (this.state.loader_module === 'mlflow.spark') {
      return this.renderMlflowSparkCodeSnippet();
    }
    const { runUuid, path } = this.props;
    const modelPath = `runs:/${runUuid}/${path}`;
    return (
      <>
        <Title level={3}>
          <FormattedMessage
            defaultMessage="Make Predictions"
            // eslint-disable-next-line max-len
            description="Heading text for the prediction section on the registered model from the experiment run"
          />
        </Title>
        <div className="artifact-logged-model-view-code-content">
          {this.renderPandasDataFramePrediction(modelPath)}
          <Text>
            <FormattedMessage
              defaultMessage="Predict on a Spark DataFrame:"
              // eslint-disable-next-line max-len
              description="Section heading to display the code block on how we can use registered model to predict using spark DataFrame"
            />
          </Text>
          <ShowArtifactCodeSnippet code={this.sparkDataFrameCodeText(modelPath)} />
        </div>
      </>
    );
  }

  renderMlflowSparkCodeSnippet() {
    const { runUuid, path } = this.props;
    const modelPath = `runs:/${runUuid}/${path}`;
    return (
      <>
        <Title level={3}>
          <FormattedMessage
            defaultMessage="Make Predictions"
            // eslint-disable-next-line max-len
            description="Heading text for the prediction section on the registered model from the experiment run"
          />
        </Title>
        <div className="artifact-logged-model-view-code-content">
          {this.renderPandasDataFramePrediction(modelPath)}
          <ShowArtifactCodeSnippet code={this.mlflowSparkCodeText(modelPath)} />
        </div>
      </>
    );
  }

  renderModelPredict(modelPath: any) {
    return (
      <div css={{ marginBottom: 16 }}>
        <Text>
          <FormattedMessage
            defaultMessage="Run the following code to validate model inference works on the example input data and logged model dependencies, prior to deploying it to a serving endpoint" // eslint-disable-next-line max-len
            description="Section heading to display the code block on how we can validate a model locally prior to serving"
          />
        </Text>
        <ShowArtifactCodeSnippet code={this.validateModelPredict(modelPath)} />
      </div>
    );
  }

  renderModelPredictCodeSnippet() {
    const { runUuid, path } = this.props;
    const modelPath = `runs:/${runUuid}/${path}`;
    return (
      <>
        <Title level={3}>
          <FormattedMessage
            defaultMessage="Validate the model before deployment"
            // eslint-disable-next-line max-len
            description="Heading text for validating the model before deploying it for serving"
          />
        </Title>
        <div className="artifact-logged-model-view-code-content">{this.renderModelPredict(modelPath)}</div>
      </>
    );
  }

  render() {
    if (this.state.loading) {
      return <ArtifactViewSkeleton className="artifact-logged-model-view-loading" />;
    } else if (this.state.error) {
      return (
        <ArtifactViewErrorState
          className="artifact-logged-model-view-error"
          description={
            <FormattedMessage
              defaultMessage="Couldn't load model information due to an error."
              description="Error state text when the model artifact was unable to load"
            />
          }
        />
      );
    } else {
      return (
        <div className="mlflow-ShowArtifactPage">
          <div className="mlflow-show-artifact-logged-model-view">
            <div
              className="artifact-logged-model-view-header"
              style={{ marginTop: 16, marginBottom: 16, marginLeft: 16 }}
            >
              <Title level={2}>
                <FormattedMessage defaultMessage="MLflow Model" description="Heading text for mlflow model artifact" />
              </Title>
              {this.state.flavor === 'pyfunc' ? (
                <FormattedMessage
                  // eslint-disable-next-line max-len
                  defaultMessage="The code snippets below demonstrate how to make predictions using the logged model."
                  // eslint-disable-next-line max-len
                  description="Subtext heading explaining the below section of the model artifact view on how users can prediction using the registered logged model"
                />
              ) : (
                <FormattedMessage
                  // eslint-disable-next-line max-len
                  defaultMessage="The code snippets below demonstrate how to load the logged model."
                  // eslint-disable-next-line max-len
                  description="Subtext heading explaining the below section of the model artifact view on how users can load the registered logged model"
                />
              )}{' '}
              {this.renderModelRegistryText()}
            </div>
            <hr />
            <div
              className="artifact-logged-model-view-schema-table"
              style={{ width: '45%', marginLeft: 16, float: 'left' }}
            >
              <Title level={3}>
                <FormattedMessage
                  defaultMessage="Model schema"
                  // eslint-disable-next-line max-len
                  description="Heading text for the model schema of the registered model from the experiment run"
                />
              </Title>
              <div className="content">
                <Text>
                  <FormattedMessage
                    defaultMessage="Input and output schema for your model. <link>Learn more</link>"
                    // eslint-disable-next-line max-len
                    description="Input and output params of the model that is registered from the experiment run"
                    values={{
                      link: (
                        chunks: any, // Reported during ESLint upgrade
                      ) => (
                        // eslint-disable-next-line react/jsx-no-target-blank
                        <a href={ModelSignatureUrl} target="_blank">
                          {chunks}
                        </a>
                      ),
                    }}
                  />
                </Text>
              </div>
              <div style={{ marginTop: 12 }}>
                <SchemaTable schema={{ inputs: this.state.inputs, outputs: this.state.outputs }} defaultExpandAllRows />
              </div>
            </div>
            <div
              className="artifact-logged-model-view-code-group"
              style={{ width: '50%', marginRight: 16, float: 'right' }}
            >
              {this.renderModelPredictCodeSnippet()}
              {this.state.flavor === 'pyfunc' ? this.renderPyfuncCodeSnippet() : this.renderNonPyfuncCodeSnippet()}
            </div>
          </div>
        </div>
      );
    }
  }

  /** Fetches artifacts and updates component state with the result */
  fetchLoggedModelMetadata() {
    const MLModelArtifactPath = `${this.props.path}/${MLMODEL_FILE_NAME}`;
    const { getArtifact, path, runUuid, experimentId, entityTags } = this.props;

    fetchArtifactUnified(
      {
        path: MLModelArtifactPath,
        runUuid,
        experimentId,
        entityTags,
      },
      getArtifact,
    )
      .then((response: any) => {
        const parsedJson = yaml.load(response);
        if (parsedJson.signature) {
          const inputs = Array.isArray(parsedJson.signature.inputs)
            ? parsedJson.signature.inputs
            : JSON.parse(parsedJson.signature.inputs || '[]');

          const outputs = Array.isArray(parsedJson.signature.outputs)
            ? parsedJson.signature.outputs
            : JSON.parse(parsedJson.signature.outputs || '[]');

          this.setState({
            inputs,
            outputs,
          });
        } else {
          this.setState({ inputs: '', outputs: '' });
        }
        if (parsedJson.flavors.mleap) {
          this.setState({ flavor: 'mleap' });
        } else if (parsedJson.flavors.python_function) {
          this.setState({
            flavor: 'pyfunc',
            loader_module: parsedJson.flavors.python_function.loader_module,
          });
        } else {
          this.setState({ flavor: Object.keys(parsedJson.flavors)[0] });
        }
        this.setState({ loading: false });
        if (parsedJson.saved_input_example_info && parsedJson.saved_input_example_info.artifact_path) {
          this.setState({ hasInputExample: true });
        }
      })
      .catch((error: any) => {
        this.setState({ error: error, loading: false });
      });
  }
}

export default injectIntl(ShowArtifactLoggedModelViewImpl);
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactLoggedTableView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactLoggedTableView.test.tsx

```typescript
import { jest, describe, beforeEach, beforeAll, afterAll, afterEach, it, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../common/utils/TestUtils.react18';
import { ShowArtifactLoggedTableView } from './ShowArtifactLoggedTableView';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import { getArtifactContent } from '../../../common/utils/ArtifactUtils';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // Larger timeout for integration testing (table rendering)

const testArtifactData = {
  columns: ['timestamp', 'level', 'message'],
  data: [
    ['row-1', 'INFO', 'Hello'],
    ['row-2', 'ERROR', 'Lorem ipsum'],
    ['row-3', 123, { key: 'value' }],
    ['row-4', false, null],
    ['row-5', true, [{ key: 'value' }]],
  ],
};

jest.mock('../../../common/utils/ArtifactUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/ArtifactUtils')>('../../../common/utils/ArtifactUtils'),
  getArtifactContent: jest.fn(),
}));

describe('ShowArtifactLoggedTableView', () => {
  const renderComponent = () => {
    render(
      <ShowArtifactLoggedTableView
        runUuid="test-run-uuid"
        experimentId="test-experiment-id"
        path="/path/to/artifact"
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

  beforeEach(() => {
    // Mock getBoundingClientRect to satisfy the table row layout
    jest.spyOn(window.Element.prototype, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          width: 1000,
          height: 1000,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        } as DOMRect),
    );
  });

  let originalImageSrc: any;

  beforeAll(() => {
    // Mock <img> src setter to trigger load callback
    originalImageSrc = Object.getOwnPropertyDescriptor(window.Image.prototype, 'src');
    Object.defineProperty(window.Image.prototype, 'src', {
      set() {
        setTimeout(() => this.onload?.());
      },
      get() {},
    });
  });

  afterAll(() => {
    Object.defineProperty(window.Image.prototype, 'src', originalImageSrc);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the table and expected values in the cells', async () => {
    // @ts-expect-error Type 'Promise<string>' is not assignable to type 'Promise<R>'
    jest.mocked(getArtifactContent).mockImplementation(() => Promise.resolve(JSON.stringify(testArtifactData)));

    renderComponent();

    // Wait for the table headers to render
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'timestamp' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'level' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'message' })).toBeInTheDocument();
    });

    // Wait for the table cells to render
    await waitFor(() => {
      for (const row of testArtifactData.data) {
        for (const cellValue of row) {
          const expectedValue = typeof cellValue === 'string' ? cellValue : JSON.stringify(cellValue);
          expect(screen.getByRole('cell', { name: expectedValue })).toBeInTheDocument();
        }
      }
    });
  });

  it('renders the table with columns and allows showing/hiding them', async () => {
    // @ts-expect-error Type 'Promise<string>' is not assignable to type 'Promise<R>'
    jest.mocked(getArtifactContent).mockImplementation(() => Promise.resolve(JSON.stringify(testArtifactData)));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'timestamp' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'level' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'message' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Table settings' }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'level' }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'message' }));

    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'timestamp' })).toBeInTheDocument();
      expect(screen.queryByRole('columnheader', { name: 'level' })).not.toBeInTheDocument();
      expect(screen.queryByRole('columnheader', { name: 'message' })).not.toBeInTheDocument();
    });
  });

  it('renders the table of mixed types', async () => {
    const testMixedTypes = {
      columns: ['mixed_type_column'],
      data: [[1], ['two'], [3.0], [null], [[1, null, 3]], [{ 1: null, 3: 5 }]],
    };

    // @ts-expect-error Type 'Promise<string>' is not assignable to type 'Promise<R>'
    jest.mocked(getArtifactContent).mockImplementation(() => Promise.resolve(JSON.stringify(testMixedTypes)));

    renderComponent();

    // Wait for the table headers to render
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'mixed_type_column' })).toBeInTheDocument();
    });

    // Wait for the table cells to render
    await waitFor(() => {
      for (const row of testMixedTypes.data) {
        for (const cellValue of row) {
          const expectedValue = typeof cellValue === 'string' ? cellValue : JSON.stringify(cellValue);
          expect(screen.getByRole('cell', { name: expectedValue })).toBeInTheDocument();
        }
      }
    });
  });

  it('renders table with mixed column types', async () => {
    const testMixedColumnTypes = {
      columns: [1, 'test', null, true],
      data: [
        [1, 'test', null, true],
        [2, 'test2', { key: 'value2' }, false],
      ],
    };

    // @ts-expect-error Type 'Promise<string>' is not assignable to type 'Promise<R>'
    jest.mocked(getArtifactContent).mockImplementation(() => Promise.resolve(JSON.stringify(testMixedColumnTypes)));

    renderComponent();

    // Wait for the table headers to render
    await waitFor(() => {
      for (const column of testMixedColumnTypes.columns) {
        const columnName = typeof column === 'string' ? column : JSON.stringify(column);
        expect(screen.getByRole('columnheader', { name: columnName })).toBeInTheDocument();
      }
    });

    // Wait for the table cells to render
    await waitFor(() => {
      for (const row of testMixedColumnTypes.data) {
        for (const cellValue of row) {
          const expectedValue = typeof cellValue === 'string' ? cellValue : JSON.stringify(cellValue);
          expect(screen.getByRole('cell', { name: expectedValue })).toBeInTheDocument();
        }
      }
    });
  });

  it('renders table with empty data', async () => {
    const testEmptyData = {
      columns: ['column1', 'column2'],
      data: [],
    };

    // @ts-expect-error Type 'Promise<string>' is not assignable to type 'Promise<R>'
    jest.mocked(getArtifactContent).mockImplementation(() => Promise.resolve(JSON.stringify(testEmptyData)));
    renderComponent();

    // Wait for the table headers to render
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'column1' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'column2' })).toBeInTheDocument();
    });

    // Wait for the table cells to render
    await waitFor(() => {
      expect(screen.queryByRole('cell')).not.toBeInTheDocument();
    });
  });

  it('renders table with empty columns', async () => {
    const testEmptyTable = {
      columns: [],
      data: [],
    };

    // @ts-expect-error Type 'Promise<string>' is not assignable to type 'Promise<R>'
    jest.mocked(getArtifactContent).mockImplementation(() => Promise.resolve(JSON.stringify(testEmptyTable)));
    renderComponent();

    // Wait for the table headers to render
    await waitFor(() => {
      expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
    });

    // Wait for the table cells to render
    await waitFor(() => {
      expect(screen.queryByRole('cell')).not.toBeInTheDocument();
    });
  });

  it('renders table with image', async () => {
    const testImageTable = {
      columns: ['images'],
      data: [
        [
          {
            type: 'image',
            filepath: 'fakePathUncompressed',
            compressed_filepath: 'fakePath',
          },
        ],
      ],
    };

    // @ts-expect-error Type 'Promise<string>' is not assignable to type 'Promise<R>'
    jest.mocked(getArtifactContent).mockImplementation(() => Promise.resolve(JSON.stringify(testImageTable)));
    renderComponent();

    // Wait for the table headers to render
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'images' })).toBeInTheDocument();
    });

    // Wait for the table cells to render
    await waitFor(() => {
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('get-artifact?path=fakePath&run_uuid=test-run-uuid'),
      );
    });
  });

  it.each([
    { artifactContent: ['definitely-not-object-with-columns-and-data'], testName: 'non-standard array' },
    { artifactContent: { data: [] }, testName: 'object without columns' },
    { artifactContent: { columns: [] }, testName: 'object without data' },
  ])('renders error message when artifact contents is a $testName', async ({ artifactContent }) => {
    // @ts-expect-error Type 'Promise<string>' is not assignable to type 'Promise<R>'
    jest.mocked(getArtifactContent).mockImplementation(() => Promise.resolve(JSON.stringify(artifactContent)));

    renderComponent();

    // Wait for the render error message
    await waitFor(() => {
      expect(
        screen.getByText(
          "Unable to parse JSON file. The file should contain an object with 'columns' and 'data' keys.",
        ),
      ).toBeInTheDocument();
    });
  });

  it('renders fallback column headers when column names are not provided', async () => {
    jest.mocked(getArtifactContent).mockImplementation(() =>
      // @ts-expect-error Type 'Promise<string>' is not assignable to type 'Promise<R>'
      Promise.resolve(
        JSON.stringify({
          columns: ['guid', '', 'sentence', ''],
          data: [
            ['123', 'value_in_unnamed_column', 'Nostrud eu velit', 'value_in_unnamed_column'],
            ['345', 'value_in_unnamed_column', 'Excepteur consectetur', 'value_in_unnamed_column'],
          ],
        }),
      ),
    );

    renderComponent();

    // Autogenerated fallback column headers should appear
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'column-2' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'column-4' })).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

````

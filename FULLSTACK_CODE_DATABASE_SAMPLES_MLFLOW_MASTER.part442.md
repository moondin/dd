---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 442
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 442 of 991)

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

---[FILE: ArtifactView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ArtifactView.enzyme.test.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { DesignSystemProvider, Typography } from '@databricks/design-system';
import { shallowWithIntl, mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { ArtifactView, ArtifactViewImpl } from './ArtifactView';
import ShowArtifactTextView from './artifact-view-components/ShowArtifactTextView';
import ShowArtifactImageView from './artifact-view-components/ShowArtifactImageView';
import { LazyShowArtifactMapView } from './artifact-view-components/LazyShowArtifactMapView';
import ShowArtifactHtmlView from './artifact-view-components/ShowArtifactHtmlView';
import { ArtifactNode } from '../utils/ArtifactUtils';
import { mockModelVersionDetailed } from '../../model-registry/test-utils';
import { ModelVersionStatus, Stages } from '../../model-registry/constants';
import { Provider } from 'react-redux';
import { BrowserRouter } from '../../common/utils/RoutingUtils';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import Utils from '../../common/utils/Utils';

const { Text } = Typography;

// Mock these methods because js-dom doesn't implement window.Request
jest.mock('../../common/utils/ArtifactUtils', () => ({
  ...jest.requireActual<typeof import('../../common/utils/ArtifactUtils')>('../../common/utils/ArtifactUtils'),
  // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
  getArtifactContent: jest.fn().mockResolvedValue(),
  // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
  getArtifactBytesContent: jest.fn().mockResolvedValue(),
}));

describe('ArtifactView', () => {
  let wrapper;
  let minimalProps: any;
  let minimalStore: any;
  let minimalEntities: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);
  const getMockStore = (rootNode: any) => {
    return mockStore({
      entities: {
        ...minimalEntities,
        artifactsByRunUuid: { fakeUuid: rootNode },
      },
    });
  };
  const getWrapper = (fakeStore: any, mockProps: any) =>
    mountWithIntl(
      <Provider store={fakeStore}>
        <DesignSystemProvider>
          <BrowserRouter>
            <ArtifactView {...mockProps} />
          </BrowserRouter>
        </DesignSystemProvider>
      </Provider>,
    );
  beforeEach(() => {
    // TODO: remove global fetch mock by explicitly mocking all the service API calls
    // @ts-expect-error TS(2322): Type 'Mock<Promise<{ ok: true; status: number; tex... Remove this comment to see the full error message
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('') }));
    const node = getTestArtifactNode();
    minimalProps = {
      runUuid: 'fakeUuid',
      artifactNode: node,
      artifactRootUri: 'test_root',
      listArtifactsApi: jest.fn(() => Promise.resolve({})),
      modelVersionsBySource: {},
      handleActiveNodeChange: jest.fn(),
    };
    minimalEntities = {
      modelByName: {},
      artifactsByRunUuid: { fakeUuid: node },
      artifactRootUriByRunUuid: { fakeUuid: 'test_root' },
      modelVersionsByModel: {},
    };
    minimalStore = mockStore({
      entities: minimalEntities,
    });

    if (jest.isMockFunction(Utils.isModelRegistryEnabled)) {
      jest.mocked(Utils.isModelRegistryEnabled).mockRestore();
    }
  });
  const getTestArtifactNode = () => {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const rootNode = new ArtifactNode(true, undefined);
    rootNode.isLoaded = true;
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const file1 = new ArtifactNode(false, { path: 'file1', is_dir: false, file_size: '159' });
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const dir1 = new ArtifactNode(false, { path: 'dir1', is_dir: true });
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const dir2 = new ArtifactNode(false, { path: 'dir2', is_dir: true });
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const file2 = new ArtifactNode(false, { path: 'dir1/file2', is_dir: false, file_size: '67' });
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const file3 = new ArtifactNode(false, { path: 'dir1/file3', is_dir: false, file_size: '123' });
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const file4 = new ArtifactNode(false, { path: 'dir2/file4', is_dir: false, file_size: '67' });
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const file5 = new ArtifactNode(false, { path: 'dir2/MLmodel', is_dir: false, file_size: '67' });
    dir1.setChildren([file2.fileInfo, file3.fileInfo]);
    dir2.setChildren([file4.fileInfo, file5.fileInfo]);
    rootNode.children = { file1, dir1, dir2 };
    return rootNode;
  };
  test('should render with minimal props without exploding', () => {
    wrapper = shallowWithIntl(<ArtifactViewImpl {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });
  test('should render NoArtifactView when no artifacts are present', () => {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const emptyNode = new ArtifactNode(true, undefined);
    const props = { ...minimalProps, artifactNode: emptyNode };
    wrapper = getWrapper(getMockStore(emptyNode), props);
    expect(wrapper.find('Empty')).toHaveLength(1);
  });
  test('should render text file in text artifact view', () => {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const rootNode = new ArtifactNode(true, undefined);
    rootNode.isLoaded = true;
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const textFile = new ArtifactNode(false, {
      path: 'file1.txt',
      is_dir: false,
      file_size: '159',
    });
    rootNode.setChildren([textFile.fileInfo]);
    wrapper = getWrapper(getMockStore(rootNode), minimalProps);
    const textFileElement = wrapper.find('NodeHeader').at(0);
    textFileElement.simulate('click');
    expect(wrapper.find(ShowArtifactTextView)).toHaveLength(1);
  });
  test('should render image file in image artifact view', () => {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const rootNode = new ArtifactNode(true, undefined);
    rootNode.isLoaded = true;
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const imageFile = new ArtifactNode(false, {
      path: 'file1.png',
      is_dir: false,
      file_size: '159',
    });
    rootNode.setChildren([imageFile.fileInfo]);
    wrapper = getWrapper(getMockStore(rootNode), minimalProps);
    const imageFileElement = wrapper.find('NodeHeader').at(0);
    imageFileElement.simulate('click');
    expect(wrapper.find(ShowArtifactImageView)).toHaveLength(1);
  });
  test('should render HTML file in HTML artifact view', () => {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const rootNode = new ArtifactNode(true, undefined);
    rootNode.isLoaded = true;
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const htmlFile = new ArtifactNode(false, {
      path: 'file1.html',
      is_dir: false,
      file_size: '159',
    });
    rootNode.setChildren([htmlFile.fileInfo]);
    wrapper = getWrapper(getMockStore(rootNode), minimalProps);
    const htmlFileElement = wrapper.find('NodeHeader').at(0);
    htmlFileElement.simulate('click');
    expect(wrapper.find(ShowArtifactHtmlView)).toHaveLength(1);
  });
  test('should render geojson file in map artifact view', () => {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const rootNode = new ArtifactNode(true, undefined);
    rootNode.isLoaded = true;
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const geojsonFile = new ArtifactNode(false, {
      path: 'file1.geojson',
      is_dir: false,
      file_size: '159',
    });
    rootNode.setChildren([geojsonFile.fileInfo]);
    wrapper = getWrapper(getMockStore(rootNode), minimalProps);
    const geojsonFileElement = wrapper.find('NodeHeader').at(0);
    geojsonFileElement.simulate('click');
    expect(wrapper.find(LazyShowArtifactMapView)).toHaveLength(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ArtifactView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ArtifactView.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { IntlShape } from 'react-intl';
import { injectIntl, FormattedMessage, useIntl } from 'react-intl';
import { Link } from '../../common/utils/RoutingUtils';
import { getBasename } from '../../common/utils/FileUtils';
import { ArtifactNode as ArtifactUtils, ArtifactNode } from '../utils/ArtifactUtils';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'byte... Remove this comment to see the full error message
import bytes from 'bytes';
import { RegisterModel } from '../../model-registry/components/RegisterModel';
import ShowArtifactPage from './artifact-view-components/ShowArtifactPage';
import {
  ModelVersionStatus,
  ModelVersionStatusIcons,
  DefaultModelVersionStatusMessages,
  modelVersionStatusIconTooltips,
} from '../../model-registry/constants';
import Utils from '../../common/utils/Utils';
import { first, flatMap, groupBy, last } from 'lodash';
import { ModelRegistryRoutes } from '../../model-registry/routes';
import type { DesignSystemHocProps } from '@databricks/design-system';
import {
  Alert,
  Empty,
  InfoTooltip,
  LayerIcon,
  LegacyTooltip,
  Tooltip,
  Typography,
  WithDesignSystemThemeHoc,
} from '@databricks/design-system';
import './ArtifactView.css';

import { getArtifactRootUri, getArtifacts } from '../reducers/Reducers';
import { getAllModelVersions } from '../../model-registry/reducers';
import { listArtifactsApi, listArtifactsLoggedModelApi } from '../actions';
import { MLMODEL_FILE_NAME } from '../constants';
import { FallbackToLoggedModelArtifactsInfo } from './artifact-view-components/FallbackToLoggedModelArtifactsInfo';
import { getArtifactLocationUrl, getLoggedModelArtifactLocationUrl } from '../../common/utils/ArtifactUtils';
import { ArtifactViewTree } from './ArtifactViewTree';
import { useDesignSystemTheme } from '@databricks/design-system';
import { Button } from '@databricks/design-system';
import { CopyIcon } from '@databricks/design-system';
import { DownloadIcon } from '@databricks/design-system';
import { Checkbox } from '@databricks/design-system';
import { getLoggedTablesFromTags } from '@mlflow/mlflow/src/common/utils/TagUtils';
import { CopyButton } from '../../shared/building_blocks/CopyButton';
import type { LoggedModelArtifactViewerProps } from './artifact-view-components/ArtifactViewComponents.types';
import { MlflowService } from '../sdk/MlflowService';
import type { KeyValueEntity } from '../../common/types';

const { Text } = Typography;

type ArtifactViewImplProps = DesignSystemHocProps & {
  experimentId: string;
  runUuid: string;
  loggedModelId?: string;
  initialSelectedArtifactPath?: string;
  artifactNode: any; // TODO: PropTypes.instanceOf(ArtifactNode)
  artifactRootUri: string;
  listArtifactsApi: (...args: any[]) => any;
  listArtifactsLoggedModelApi: typeof listArtifactsLoggedModelApi;
  modelVersionsBySource: any;
  handleActiveNodeChange: (...args: any[]) => any;
  runTags?: any;
  modelVersions?: any[];
  intl: IntlShape;
  getCredentialsForArtifactReadApi: (...args: any[]) => any;
  entityTags?: Partial<KeyValueEntity>[];

  /**
   * If true, the artifact browser will try to use all available height
   */
  useAutoHeight?: boolean;
} & LoggedModelArtifactViewerProps;

type ArtifactViewImplState = any;

export class ArtifactViewImpl extends Component<ArtifactViewImplProps, ArtifactViewImplState> {
  state = {
    activeNodeId: undefined,
    toggledNodeIds: {},
    requestedNodeIds: new Set(),
    viewAsTable: true,
  };

  getExistingModelVersions() {
    const { modelVersionsBySource } = this.props;
    const activeNodeRealPath = Utils.normalize(this.getActiveNodeRealPath());
    return modelVersionsBySource[activeNodeRealPath];
  }

  renderRegisterModelButton() {
    const { runUuid } = this.props;
    const { activeNodeId } = this.state;
    const activeNodeRealPath = this.getActiveNodeRealPath();
    return (
      <RegisterModel
        runUuid={runUuid}
        modelPath={activeNodeRealPath}
        modelRelativePath={String(activeNodeId)}
        disabled={activeNodeId === undefined}
        showButton
        buttonType={undefined}
      />
    );
  }

  renderModelVersionInfoSection(existingModelVersions: any, intl: IntlShape) {
    return <ModelVersionInfoSection modelVersion={last(existingModelVersions)} intl={this.props.intl} />;
  }

  renderPathAndSizeInfo() {
    // We will only be in this function if this.state.activeNodeId is defined
    const node = ArtifactUtils.findChild(this.props.artifactNode, this.state.activeNodeId);
    const activeNodeRealPath = this.getActiveNodeRealPath();

    return (
      <div className="mlflow-artifact-info-left">
        <div className="mlflow-artifact-info-path">
          <label>
            <FormattedMessage
              defaultMessage="Full Path:"
              // eslint-disable-next-line max-len
              description="Label to display the full path of where the artifact of the experiment runs is located"
            />
          </label>{' '}
          {/* @ts-expect-error TS(2322): Type '{ children: string; className: string; ellip... Remove this comment to see the full error message */}
          <Text className="mlflow-artifact-info-text" ellipsis copyable>
            {activeNodeRealPath}
          </Text>
        </div>
        {node.fileInfo.is_dir === false ? (
          <div className="mlflow-artifact-info-size">
            <label>
              <FormattedMessage
                defaultMessage="Size:"
                description="Label to display the size of the artifact of the experiment"
              />
            </label>{' '}
            {bytes(this.getActiveNodeSize())}
          </div>
        ) : null}
      </div>
    );
  }

  renderSizeInfo() {
    // We will only be in this function if this.state.activeNodeId is defined
    const node = ArtifactUtils.findChild(this.props.artifactNode, this.state.activeNodeId);
    const { theme } = this.props.designSystemThemeApi;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <Typography.Text bold size="lg" ellipsis title={this.state.activeNodeId}>
          {this.state.activeNodeId}
        </Typography.Text>
        {node.fileInfo.is_dir === false && (
          <Typography.Text color="secondary">{bytes(this.getActiveNodeSize())}</Typography.Text>
        )}
      </div>
    );
  }

  renderPathInfo() {
    const activeNodeRealPath = this.getActiveNodeRealPath();
    const { theme } = this.props.designSystemThemeApi;

    return (
      <div
        css={{
          display: 'flex',
          overflow: 'hidden',
          alignItems: 'center',
          gap: theme.spacing.sm,
        }}
      >
        <div
          css={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            flex: '0 auto',
            color: theme.colors.textSecondary,
          }}
          title={activeNodeRealPath}
        >
          <FormattedMessage
            defaultMessage="Path:"
            description="Label to display the full path of where the artifact of the experiment runs is located"
          />{' '}
          {activeNodeRealPath}
        </div>

        <CopyButton
          css={{ flex: '0 0 auto' }}
          showLabel={false}
          size="small"
          type="tertiary"
          copyText={activeNodeRealPath}
          icon={<CopyIcon />}
        />
      </div>
    );
  }

  onDownloadClick(
    // comment for copybara formatting
    runUuid: any,
    artifactPath: any,
    loggedModelId?: string,
    isFallbackToLoggedModelArtifacts?: boolean,
  ) {
    // Logged model artifact API should be used when falling back to logged model artifacts on the run artifact page.
    if (runUuid && !isFallbackToLoggedModelArtifacts) {
      window.location.href = getArtifactLocationUrl(artifactPath, runUuid);
    } else if (loggedModelId) {
      window.location.href = getLoggedModelArtifactLocationUrl(artifactPath, loggedModelId);
    }
  }

  renderControls() {
    const { runUuid, loggedModelId, isFallbackToLoggedModelArtifacts } = this.props;
    const { activeNodeId } = this.state;
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          {this.shouldShowViewAsTableCheckbox && (
            <Checkbox
              componentId="codegen_mlflow_app_src_experiment-tracking_components_artifactview.tsx_288"
              isChecked={this.state.viewAsTable}
              onChange={() =>
                this.setState({
                  viewAsTable: !this.state.viewAsTable,
                })
              }
            >
              <FormattedMessage
                defaultMessage="View as table"
                description="Experiment tracking > Artifact view > View as table checkbox"
              />
            </Checkbox>
          )}
          <Tooltip
            componentId="mlflow.artifact_view.download_artifact"
            side="top"
            align="end"
            content={this.props.intl.formatMessage({
              defaultMessage: 'Download artifact',
              description: 'Link to download the artifact of the experiment',
            })}
          >
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_artifactview.tsx_337"
              icon={<DownloadIcon />}
              onClick={() =>
                this.onDownloadClick(runUuid, activeNodeId, loggedModelId, isFallbackToLoggedModelArtifacts)
              }
            />
          </Tooltip>
        </div>
      </div>
    );
  }

  renderArtifactInfo() {
    const existingModelVersions = this.getExistingModelVersions();
    let toRender;
    if (existingModelVersions && Utils.isModelRegistryEnabled()) {
      // note that this case won't trigger for files inside a registered model/model version folder
      // React searches for existing model versions under the path of the file, which won't exist.
      toRender = this.renderModelVersionInfoSection(existingModelVersions, this.props.intl);
    } else if (this.activeNodeCanBeRegistered() && Utils.isModelRegistryEnabled()) {
      toRender = this.renderRegisterModelButton();
    } else if (this.activeNodeIsDirectory()) {
      toRender = null;
    } else {
      toRender = this.renderControls();
    }
    const { theme } = this.props.designSystemThemeApi;
    return (
      <div
        css={{
          padding: `${theme.spacing.xs}px ${theme.spacing.sm}px ${theme.spacing.sm}px ${theme.spacing.md}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xs,
        }}
      >
        <div
          css={{
            whiteSpace: 'nowrap',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: theme.spacing.md,
          }}
        >
          <div css={{ flex: '1 1', overflow: 'hidden' }}>{this.renderSizeInfo()}</div>
          <div css={{ flex: '0 1' }}>{toRender}</div>
        </div>

        {this.renderPathInfo()}
      </div>
    );
  }

  onToggleTreebeard = (
    dataNode: {
      id: string;
      loading: boolean;
    },
    toggled: boolean,
  ) => {
    const { id, loading } = dataNode;

    const usingLoggedModels = this.props.isLoggedModelsMode;

    const newRequestedNodeIds = new Set(this.state.requestedNodeIds);
    // - loading indicates that this node is a directory and has not been loaded yet.
    // - requestedNodeIds keeps track of in flight requests.
    if (loading && !this.state.requestedNodeIds.has(id)) {
      // Call relevant API based on the mode we are in
      if (usingLoggedModels && this.props.loggedModelId) {
        this.props.listArtifactsLoggedModelApi(
          this.props.loggedModelId,
          id,
          this.props.experimentId,
          undefined,
          this.props.entityTags,
        );
      } else {
        this.props.listArtifactsApi(this.props.runUuid, id, undefined, this.props.experimentId, this.props.entityTags);
      }
    }
    this.setState({
      activeNodeId: id,
      toggledNodeIds: {
        ...this.state.toggledNodeIds,
        [id]: toggled,
      },
      requestedNodeIds: newRequestedNodeIds,
    });
  };

  getTreebeardData = (artifactNode: any): any => {
    const { isRoot } = artifactNode;
    if (isRoot) {
      if (artifactNode.children) {
        return Object.values(artifactNode.children).map((c) => this.getTreebeardData(c));
      }
      // This case should never happen since we should never call this function on an empty root.
      throw Error('unreachable code.');
    }

    let id;
    let name;
    let toggled;
    let children;
    let active;

    if (artifactNode.fileInfo) {
      const { path } = artifactNode.fileInfo;
      id = path;
      name = getBasename(path);
    }

    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const toggleState = this.state.toggledNodeIds[id];
    if (toggleState) {
      toggled = toggleState;
    }

    if (artifactNode.children) {
      children = Object.values(artifactNode.children).map((c) => this.getTreebeardData(c));
    }

    if (this.state.activeNodeId === id) {
      active = true;
    }

    const loading = artifactNode.children !== undefined && !artifactNode.isLoaded;

    return {
      id,
      name,
      toggled,
      children,
      active,
      loading,
    };
  };

  getActiveNodeRealPath() {
    if (this.state.activeNodeId) {
      return `${this.props.artifactRootUri}/${this.state.activeNodeId}`;
    }
    return this.props.artifactRootUri;
  }

  getActiveNodeSize() {
    if (this.state.activeNodeId) {
      const node = ArtifactUtils.findChild(this.props.artifactNode, this.state.activeNodeId);
      const size = node.fileInfo.file_size || '0';
      return parseInt(size, 10);
    }
    return 0;
  }

  activeNodeIsDirectory() {
    if (this.state.activeNodeId) {
      const node = ArtifactUtils.findChild(this.props.artifactNode, this.state.activeNodeId);
      return node.fileInfo.is_dir;
    } else {
      // No node is highlighted so we're displaying the root, which is a directory.
      return true;
    }
  }

  activeNodeCanBeRegistered() {
    if (this.state.activeNodeId) {
      const node = ArtifactUtils.findChild(this.props.artifactNode, this.state.activeNodeId);
      if (node && node.children && MLMODEL_FILE_NAME in node.children) {
        return true;
      }
    }
    return false;
  }

  componentDidUpdate(prevProps: ArtifactViewImplProps, prevState: ArtifactViewImplState) {
    const { activeNodeId } = this.state;
    if (prevState.activeNodeId !== activeNodeId) {
      this.props.handleActiveNodeChange(this.activeNodeIsDirectory());
    }
  }

  componentDidMount() {
    if (this.props.initialSelectedArtifactPath) {
      const artifactPathParts = this.props.initialSelectedArtifactPath.split('/');
      if (artifactPathParts) {
        try {
          // Check if valid artifactId was supplied in URL. If not, don't select
          // or expand anything.
          ArtifactUtils.findChild(this.props.artifactNode, this.props.initialSelectedArtifactPath);
        } catch (err) {
          // eslint-disable-next-line no-console -- TODO(FEINF-3587)
          console.error(err);
          return;
        }
      }
      let pathSoFar = '';
      const toggledArtifactState = {
        activeNodeId: this.props.initialSelectedArtifactPath,
        toggledNodeIds: {},
      };
      artifactPathParts.forEach((part) => {
        pathSoFar += part;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        toggledArtifactState['toggledNodeIds'][pathSoFar] = true;
        pathSoFar += '/';
      });
      this.setArtifactState(toggledArtifactState);
    }
  }

  setArtifactState(artifactState: any) {
    this.setState(artifactState);
  }

  get shouldShowViewAsTableCheckbox() {
    return (
      this.state.activeNodeId &&
      this.props.runTags &&
      getLoggedTablesFromTags(this.props.runTags).includes(this.state.activeNodeId)
    );
  }

  render() {
    if (!this.props.artifactNode || ArtifactUtils.isEmpty(this.props.artifactNode)) {
      return <NoArtifactView useAutoHeight={this.props.useAutoHeight} />;
    }
    const { theme } = this.props.designSystemThemeApi;

    const { loggedModelId, isLoggedModelsMode } = this.props;

    return (
      <div
        className="mlflow-artifact-view"
        css={{
          flex: this.props.useAutoHeight ? 1 : 'unset',
          height: this.props.useAutoHeight ? 'auto' : undefined,
          [theme.responsive.mediaQueries.xs]: {
            overflowX: 'auto',
          },
        }}
      >
        <div
          style={{
            minWidth: '200px',
            maxWidth: '400px',
            flex: 1,
            whiteSpace: 'nowrap',
            borderRight: `1px solid ${theme.colors.borderDecorative}`,
          }}
        >
          <ArtifactViewTree
            data={this.getTreebeardData(this.props.artifactNode)}
            onToggleTreebeard={this.onToggleTreebeard}
          />
        </div>
        <div className="mlflow-artifact-right">
          {this.props.isFallbackToLoggedModelArtifacts && this.props.loggedModelId && (
            <FallbackToLoggedModelArtifactsInfo loggedModelId={this.props.loggedModelId} />
          )}
          {this.state.activeNodeId ? this.renderArtifactInfo() : null}
          <ShowArtifactPage
            experimentId={this.props.experimentId}
            runUuid={this.props.runUuid}
            path={this.state.activeNodeId}
            isDirectory={this.activeNodeIsDirectory()}
            size={this.getActiveNodeSize()}
            runTags={this.props.runTags}
            artifactRootUri={this.props.artifactRootUri}
            modelVersions={this.props.modelVersions}
            showArtifactLoggedTableView={this.state.viewAsTable && this.shouldShowViewAsTableCheckbox}
            loggedModelId={loggedModelId}
            isLoggedModelsMode={isLoggedModelsMode}
            entityTags={this.props.entityTags}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  const { runUuid, loggedModelId, isLoggedModelsMode } = ownProps;
  const { apis } = state;
  const artifactNode =
    isLoggedModelsMode && loggedModelId ? getArtifacts(loggedModelId, state) : getArtifacts(runUuid, state);
  const artifactRootUri = ownProps?.artifactRootUri ?? getArtifactRootUri(runUuid, state);
  const modelVersions = getAllModelVersions(state);
  const modelVersionsWithNormalizedSource = flatMap(modelVersions, (version) => {
    // @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
    return { ...version, source: Utils.normalize((version as any).source) };
  });
  const modelVersionsBySource = groupBy(modelVersionsWithNormalizedSource, 'source');
  return { artifactNode, artifactRootUri, modelVersions, modelVersionsBySource, apis };
};

const mapDispatchToProps = {
  listArtifactsApi,
  listArtifactsLoggedModelApi,
};

export const ArtifactView = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithDesignSystemThemeHoc(injectIntl(ArtifactViewImpl)));

type ModelVersionInfoSectionProps = {
  modelVersion: any;
  intl: IntlShape;
};

function ModelVersionInfoSection(props: ModelVersionInfoSectionProps) {
  const { modelVersion, intl } = props;
  const { name, version, status, status_message } = modelVersion;

  // eslint-disable-next-line prefer-const
  let mvPageRoute = ModelRegistryRoutes.getModelVersionPageRoute(name, version);
  const modelVersionLink = (
    <Tooltip componentId="mlflow.artifacts.model_version.link" content={`${name} version ${version}`}>
      <span>
        <Link to={mvPageRoute} className="model-version-link" target="_blank" rel="noreferrer">
          <span className="model-name">{name}</span>
          <span>,&nbsp;v{version}&nbsp;</span>
          <i className="fa fa-external-link-o" />
        </Link>
      </span>
    </Tooltip>
  );

  return (
    <div className="model-version-info">
      <div className="model-version-link-section">
        <Tooltip
          componentId="mlflow.artifacts.model_version.status"
          content={status_message || modelVersionStatusIconTooltips[status]}
        >
          <div>{ModelVersionStatusIcons[status]}</div>
        </Tooltip>
        {modelVersionLink}
      </div>
      <div className="model-version-status-text">
        {status === ModelVersionStatus.READY ? (
          <React.Fragment>
            <FormattedMessage
              defaultMessage="Registered on {registeredDate}"
              description="Label to display at what date the model was registered"
              values={{
                registeredDate: Utils.formatTimestamp(modelVersion.creation_timestamp, intl),
              }}
            />
          </React.Fragment>
        ) : (
          status_message || DefaultModelVersionStatusMessages[status]
        )}
      </div>
    </div>
  );
}

function NoArtifactView({ useAutoHeight }: { useAutoHeight?: boolean }) {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        flex: useAutoHeight ? 1 : 'unset',
        height: useAutoHeight ? 'auto' : undefined,
        paddingTop: theme.spacing.md,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Empty
        image={<LayerIcon />}
        title={
          <FormattedMessage
            defaultMessage="No Artifacts Recorded"
            description="Empty state string when there are no artifacts record for the experiment"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="Use the log artifact APIs to store file outputs from MLflow runs."
            description="Information in the empty state explaining how one could log artifacts output files for the experiment runs"
          />
        }
      />
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: ArtifactViewTree.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ArtifactViewTree.tsx
Signals: React

```typescript
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import type { TreebeardData } from 'react-treebeard';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { decorators, Treebeard } from 'react-treebeard';
import { DATA_EXTENSIONS, getExtension, IMAGE_EXTENSIONS, TEXT_EXTENSIONS } from '../../common/utils/FileUtils';

import spinner from '../../common/static/mlflow-spinner.png';
import { useDesignSystemTheme } from '@databricks/design-system';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import type { Theme } from '@emotion/react';

interface ArtifactViewTreeProps {
  onToggleTreebeard: (
    dataNode: {
      id: string;
      loading: boolean;
    },
    toggled: boolean,
  ) => void;
  data: TreebeardData;
}

export const ArtifactViewTree = ({ data, onToggleTreebeard }: ArtifactViewTreeProps) => {
  const { theme } = useDesignSystemTheme();
  const treebeardStyle = useMemo(() => getTreebeardStyle(theme), [theme]);
  return <Treebeard data={data} onToggle={onToggleTreebeard} style={treebeardStyle} decorators={decorators} />;
};

interface DecoratorStyle {
  style: React.CSSProperties & {
    base: React.CSSProperties;
    title: React.CSSProperties;
  };
  node: {
    name: string;
    children: string[];
  };
}
decorators.Header = ({ style, node }: DecoratorStyle) => {
  let iconType;
  if (node.children) {
    iconType = 'folder';
  } else {
    const extension = getExtension(node.name);
    if (IMAGE_EXTENSIONS.has(extension)) {
      iconType = 'file-image-o';
    } else if (DATA_EXTENSIONS.has(extension)) {
      iconType = 'file-excel-o';
    } else if (TEXT_EXTENSIONS.has(extension)) {
      iconType = 'file-code-o';
    } else {
      iconType = 'file-text-o';
    }
  }
  const iconClass = `fa fa-${iconType}`;

  // Add margin-left to the non-directory nodes to align the arrow, icons, and texts.
  const iconStyle = node.children ? { marginRight: '5px' } : { marginRight: '5px', marginLeft: '19px' };

  return (
    <div
      style={style.base}
      data-testid="artifact-tree-node"
      // eslint-disable-next-line react/no-unknown-property
      artifact-name={node.name}
      aria-label={node.name}
    >
      <div style={style.title}>
        <i className={iconClass} style={iconStyle} />
        {node.name}
      </div>
    </div>
  );
};

decorators.Loading = ({ style }: DecoratorStyle) => {
  return (
    <div style={style}>
      <img alt="" className="mlflow-loading-spinner" src={spinner} />
      <FormattedMessage
        defaultMessage="loading..."
        description="Loading spinner text to show that the artifact loading is in progress"
      />
    </div>
  );
};

const getTreebeardStyle = (theme: Theme) => ({
  tree: {
    base: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      backgroundColor: theme.colors.backgroundPrimary,
      color: theme.colors.textPrimary,
      fontSize: theme.typography.fontSizeMd,
      maxWidth: '500px',
      height: '100%',
      overflow: 'scroll',
    },
    node: {
      base: {
        position: 'relative',
      },
      link: {
        cursor: 'pointer',
        position: 'relative',
        padding: '0px 5px',
        display: 'block',
      },
      activeLink: {
        background: theme.isDarkMode ? theme.colors.grey700 : theme.colors.grey300,
      },
      toggle: {
        base: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top',
          marginLeft: '-5px',
          height: '24px',
          width: '24px',
        },
        wrapper: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-12px 0 0 -4px',
          height: '14px',
          display: 'flex',
          alignItems: 'end',
        },
        height: 7,
        width: 7,
        arrow: {
          fill: '#7a7a7a',
          strokeWidth: 0,
        },
      },
      header: {
        base: {
          display: 'inline-block',
          verticalAlign: 'top',
          color: theme.colors.textPrimary,
        },
        connector: {
          width: '2px',
          height: '12px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          left: '-21px',
        },
        title: {
          lineHeight: '24px',
          verticalAlign: 'middle',
        },
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '19px',
      },
    },
  },
});
```

--------------------------------------------------------------------------------

---[FILE: CompareRunArtifactView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunArtifactView.tsx
Signals: React

```typescript
import { useState } from 'react';
import ShowArtifactPage from './artifact-view-components/ShowArtifactPage';
import type { RunInfoEntity } from '../types';
import { useRunsArtifacts } from './experiment-page/hooks/useRunsArtifacts';
import { getCommonArtifacts } from './experiment-page/utils/getCommonArtifacts';
import { useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { ArtifactViewTree } from './ArtifactViewTree';
import { getBasename } from '../../common/utils/FileUtils';

export const CompareRunArtifactView = ({
  runUuids,
  runInfos,
  colWidth,
}: {
  runUuids: string[];
  runInfos: RunInfoEntity[];
  colWidth: number;
}) => {
  const { theme } = useDesignSystemTheme();
  const [artifactPath, setArtifactPath] = useState<string | undefined>();

  const { artifactsKeyedByRun } = useRunsArtifacts(runUuids);
  const commonArtifacts = getCommonArtifacts(artifactsKeyedByRun);

  if (commonArtifacts.length === 0) {
    return (
      <h2>
        <FormattedMessage
          defaultMessage="No common artifacts to display."
          description="Text shown when there are no common artifacts between the runs"
        />
      </h2>
    );
  }
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
      }}
    >
      <div
        css={{
          backgroundColor: theme.colors.backgroundPrimary,
          color: theme.colors.textPrimary,
          flex: '1 1 0%',
          whiteSpace: 'nowrap',
          border: `1px solid ${theme.colors.grey300}`,
          overflowY: 'auto',
        }}
      >
        <ArtifactViewTree
          data={commonArtifacts.map((path: string) => ({
            id: path,
            active: artifactPath === path,
            name: getBasename(path),
          }))}
          onToggleTreebeard={({ id }) => setArtifactPath(id)}
        />
      </div>
      <div
        css={{
          border: `1px solid ${theme.colors.grey300}`,
          borderLeft: 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div css={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {runUuids.map((runUuid, index) => (
            <div
              key={runUuid}
              style={{
                width: `${colWidth}px`,
                borderBottom: `1px solid ${theme.colors.grey300}`,
                padding: !artifactPath ? theme.spacing.md : 0,
                overflow: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              <ShowArtifactPage
                runUuid={runUuid}
                artifactRootUri={runInfos[index].artifactUri}
                path={artifactPath}
                experimentId={runInfos[index].experimentId}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

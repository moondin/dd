---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 456
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 456 of 991)

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

---[FILE: ShowArtifactPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactPage.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import {
  getExtension,
  IMAGE_EXTENSIONS,
  TEXT_EXTENSIONS,
  MAP_EXTENSIONS,
  HTML_EXTENSIONS,
  PDF_EXTENSIONS,
  DATA_EXTENSIONS,
  AUDIO_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from '../../../common/utils/FileUtils';
import { getLoggedModelPathsFromTags, getLoggedTablesFromTags } from '../../../common/utils/TagUtils';
import { ONE_MB } from '../../constants';
import ShowArtifactImageView from './ShowArtifactImageView';
import ShowArtifactTextView from './ShowArtifactTextView';
import { LazyShowArtifactMapView } from './LazyShowArtifactMapView';
import ShowArtifactHtmlView from './ShowArtifactHtmlView';
import { LazyShowArtifactPdfView } from './LazyShowArtifactPdfView';
import { LazyShowArtifactTableView } from './LazyShowArtifactTableView';
import ShowArtifactLoggedModelView from './ShowArtifactLoggedModelView';
import previewIcon from '../../../common/static/preview-icon.png';
import warningSvg from '../../../common/static/warning.svg';
import { ModelRegistryRoutes } from '../../../model-registry/routes';
import Utils from '../../../common/utils/Utils';
import { FormattedMessage } from 'react-intl';
import { ShowArtifactLoggedTableView } from './ShowArtifactLoggedTableView';
import { Empty, Spacer } from '@databricks/design-system';
import { LazyShowArtifactAudioView } from './LazyShowArtifactAudioView';
import type { LoggedModelArtifactViewerProps } from './ArtifactViewComponents.types';
import { LazyShowArtifactVideoView } from './LazyShowArtifactVideoView';
import type { KeyValueEntity } from '../../../common/types';

const MAX_PREVIEW_ARTIFACT_SIZE_MB = 50;

type ShowArtifactPageProps = {
  runUuid: string;
  artifactRootUri: string;
  path?: string;
  isDirectory?: boolean;
  size?: number;
  runTags?: any;
  modelVersions?: any[];
  showArtifactLoggedTableView?: boolean;
  entityTags?: Partial<KeyValueEntity>[];
} & LoggedModelArtifactViewerProps;

class ShowArtifactPage extends Component<ShowArtifactPageProps> {
  render() {
    if (this.props.path) {
      const { loggedModelId, isLoggedModelsMode, path, runUuid, experimentId, entityTags } = this.props;
      const commonArtifactProps = {
        loggedModelId,
        isLoggedModelsMode,
        path,
        runUuid,
        experimentId,
        entityTags,
      };

      const normalizedExtension = getExtension(this.props.path);
      let registeredModelLink;
      const { modelVersions } = this.props;
      if (modelVersions) {
        const [registeredModel] = modelVersions.filter((model) =>
          model.source.endsWith(`artifacts/${normalizedExtension}`),
        );
        if (registeredModel) {
          const { name: registeredModelName, version } = registeredModel;
          registeredModelLink = ModelRegistryRoutes.getModelVersionPageRoute(registeredModelName, version);
        }
      }
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      if (this.props.size > MAX_PREVIEW_ARTIFACT_SIZE_MB * ONE_MB) {
        return getFileTooLargeView();
      } else if (this.props.isDirectory) {
        if (this.props.runTags && getLoggedModelPathsFromTags(this.props.runTags).includes(this.props.path)) {
          return (
            // getArtifact has a default in the component
            // @ts-expect-error TS(2741): Property 'getArtifact' is missing
            <ShowArtifactLoggedModelView
              runUuid={this.props.runUuid}
              path={this.props.path}
              artifactRootUri={this.props.artifactRootUri}
              registeredModelLink={registeredModelLink}
              experimentId={this.props.experimentId}
            />
          );
        }
      } else if (this.props.showArtifactLoggedTableView) {
        return <ShowArtifactLoggedTableView {...commonArtifactProps} />;
      } else if (normalizedExtension) {
        if (IMAGE_EXTENSIONS.has(normalizedExtension.toLowerCase())) {
          return <ShowArtifactImageView {...commonArtifactProps} />;
        } else if (DATA_EXTENSIONS.has(normalizedExtension.toLowerCase())) {
          return <LazyShowArtifactTableView {...commonArtifactProps} />;
        } else if (TEXT_EXTENSIONS.has(normalizedExtension.toLowerCase())) {
          return <ShowArtifactTextView {...commonArtifactProps} size={this.props.size} />;
        } else if (MAP_EXTENSIONS.has(normalizedExtension.toLowerCase())) {
          return <LazyShowArtifactMapView {...commonArtifactProps} />;
        } else if (HTML_EXTENSIONS.has(normalizedExtension.toLowerCase())) {
          return <ShowArtifactHtmlView {...commonArtifactProps} />;
        } else if (PDF_EXTENSIONS.has(normalizedExtension.toLowerCase())) {
          return <LazyShowArtifactPdfView {...commonArtifactProps} />;
        } else if (AUDIO_EXTENSIONS.has(normalizedExtension.toLowerCase())) {
          return <LazyShowArtifactAudioView {...commonArtifactProps} />;
        } else if (VIDEO_EXTENSIONS.has(normalizedExtension.toLowerCase())) {
          return <LazyShowArtifactVideoView {...commonArtifactProps} />;
        }
      }
    }
    return getSelectFileView();
  }
}

const getSelectFileView = () => {
  return (
    <div css={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Empty
        image={
          <>
            <img alt="Preview icon." src={previewIcon} css={{ width: 64, height: 64 }} />
            <Spacer size="sm" />
          </>
        }
        title={
          <FormattedMessage
            defaultMessage="Select a file to preview"
            description="Label to suggests users to select a file to preview the output"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="Supported formats: image, text, html, pdf, audio, video, geojson files"
            description="Text to explain users which formats are supported to display the artifacts"
          />
        }
      />
    </div>
  );
};

const getFileTooLargeView = () => {
  return (
    <div css={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Empty
        image={
          <>
            <img alt="Preview icon." src={warningSvg} css={{ width: 64, height: 64 }} />
            <Spacer size="sm" />
          </>
        }
        title={
          <FormattedMessage
            defaultMessage="File is too large to preview"
            description="Label to indicate that the file is too large to preview"
          />
        }
        description={
          <FormattedMessage
            // eslint-disable-next-line formatjs/enforce-default-message
            defaultMessage={`Maximum file size for preview: ${MAX_PREVIEW_ARTIFACT_SIZE_MB}MiB`}
            description="Text to notify users of the maximum file size for which artifact previews are displayed"
          />
        }
      />
    </div>
  );
};

export default ShowArtifactPage;
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactPdfView.css]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactPdfView.css

```text
.mlflow-pdf-outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-left: 16px;
  overflow: hidden;
}
.mlflow-pdf-viewer {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
}

.mlflow-paginator {
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  z-index: 1001;
  top: 0;
  padding-bottom: 15px;
  background-color: rgba(250, 250, 250, 0.6);
  padding-top: 10px;
}

.mlflow-document {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactPdfView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactPdfView.enzyme.test.tsx
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
import { shallow } from 'enzyme';
import ShowArtifactPdfView from './ShowArtifactPdfView';
import { setupReactPDFWorker } from './utils/setupReactPDFWorker';

jest.mock('react-pdf', () => ({
  Document: () => null,
  Page: () => null,
  pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
}));
jest.mock('./utils/setupReactPDFWorker', () => ({
  setupReactPDFWorker: jest.fn(),
}));

describe('ShowArtifactPdfView', () => {
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
    commonProps = { ...minimalProps, getArtifact };
    wrapper = shallow(<ShowArtifactPdfView {...commonProps} />);
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ShowArtifactPdfView {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should render loading text when view is loading', () => {
    instance = wrapper.instance();
    instance.setState({ loading: true });
    expect(wrapper.find('.artifact-pdf-view-loading').length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render error message when error occurs', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.reject(new Error('my error text'));
    });
    const props = { ...minimalProps, getArtifact: getArtifact };
    wrapper = shallow(<ShowArtifactPdfView {...props} />);
    setImmediate(() => {
      expect(wrapper.find('.artifact-pdf-view-error').length).toBe(1);
      expect(wrapper.instance().state.loading).toBe(false);
      expect(wrapper.instance().state.html).toBeUndefined();
      expect(wrapper.instance().state.error).toBeDefined();
      done();
    });
  });

  test('should render PDF in container', () => {
    wrapper.setProps({ path: 'fake.pdf', runUuid: 'fakeRunId' });
    wrapper.setState({ loading: false });
    expect(wrapper.find('.mlflow-pdf-outer-container')).toHaveLength(1);
    expect(wrapper.find('.mlflow-pdf-viewer')).toHaveLength(1);
    expect(wrapper.find('.mlflow-paginator')).toHaveLength(1);
    expect(wrapper.find('.mlflow-document')).toHaveLength(1);
  });

  test('should call fetchPdf on component update', () => {
    instance = wrapper.instance();
    instance.fetchPdf = jest.fn();
    wrapper.setProps({ path: 'newpath', runUuid: 'newRunId' });
    expect(instance.fetchPdf).toHaveBeenCalledTimes(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactPdfView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactPdfView.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Pagination, Spinner } from '@databricks/design-system';
import {
  getArtifactBytesContent,
  getArtifactLocationUrl,
  getLoggedModelArtifactLocationUrl,
} from '../../../common/utils/ArtifactUtils';
import './ShowArtifactPdfView.css';
import Utils from '../../../common/utils/Utils';
import { ErrorWrapper } from '../../../common/utils/ErrorWrapper';
import { ArtifactViewSkeleton } from './ArtifactViewSkeleton';
import { ArtifactViewErrorState } from './ArtifactViewErrorState';
import type { LoggedModelArtifactViewerProps } from './ArtifactViewComponents.types';
import { fetchArtifactUnified, type FetchArtifactUnifiedFn } from './utils/fetchArtifactUnified';
import { setupReactPDFWorker } from './utils/setupReactPDFWorker';

setupReactPDFWorker(pdfjs);

type Props = {
  runUuid: string;
  path: string;
  getArtifact: FetchArtifactUnifiedFn;
} & LoggedModelArtifactViewerProps;

type State = any;

class ShowArtifactPdfView extends Component<Props, State> {
  state = {
    loading: true,
    error: undefined,
    pdfData: undefined,
    currentPage: 1,
    numPages: 1,
  };

  static defaultProps = {
    getArtifact: fetchArtifactUnified,
  };

  /** Fetches artifacts and updates component state with the result */
  fetchPdf() {
    const { path, runUuid, isLoggedModelsMode, loggedModelId, experimentId, entityTags } = this.props;

    this.props
      .getArtifact?.(
        { path, runUuid, isLoggedModelsMode, loggedModelId, experimentId, entityTags },
        getArtifactBytesContent,
      )
      .then((artifactPdfData: any) => {
        this.setState({ pdfData: { data: artifactPdfData }, loading: false });
      })
      .catch((error: any) => {
        this.setState({ error: error, loading: false });
      });
  }

  componentDidMount() {
    this.fetchPdf();
  }

  resetPDFState() {
    this.setState({
      pdfData: undefined,
      loading: true,
      currentPage: 1,
      numPages: 1,
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.path !== prevProps.path || this.props.runUuid !== prevProps.runUuid) {
      this.resetPDFState();
      this.fetchPdf();
    }
  }

  onDocumentLoadSuccess = ({ numPages }: any) => {
    this.setState({ numPages });
  };

  onDocumentLoadError = (error: any) => {
    Utils.logErrorAndNotifyUser(new ErrorWrapper(error));
  };

  onPageChange = (newPageNumber: any, itemsPerPage: any) => {
    this.setState({ currentPage: newPageNumber });
  };

  renderPdf = () => {
    return (
      <React.Fragment>
        <div className="mlflow-pdf-viewer">
          <div className="mlflow-paginator">
            <Pagination
              // @ts-expect-error TS(2322): Type '{ simple: true; currentPageIndex: number; nu... Remove this comment to see the full error message
              simple
              currentPageIndex={this.state.currentPage}
              numTotal={this.state.numPages}
              pageSize={1}
              onChange={this.onPageChange}
              /*
               * Currently DuBois pagination does not natively support
               * "simple" mode which is required here, hence `dangerouslySetAntdProps`
               */
              dangerouslySetAntdProps={{ simple: true }}
            />
          </div>
          <div className="mlflow-document">
            <Document
              file={this.state.pdfData}
              onLoadSuccess={this.onDocumentLoadSuccess}
              onLoadError={this.onDocumentLoadError}
              loading={<Spinner />}
            >
              <Page
                pageNumber={this.state.currentPage}
                loading={<Spinner />}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    if (this.state.loading) {
      return <ArtifactViewSkeleton className="artifact-pdf-view-loading" />;
    }
    if (this.state.error) {
      return <ArtifactViewErrorState className="artifact-pdf-view-error" />;
    } else {
      return <div className="mlflow-pdf-outer-container">{this.renderPdf()}</div>;
    }
  }
}

export default ShowArtifactPdfView;
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactTableView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactTableView.enzyme.test.tsx
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
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import ShowArtifactTableView from './ShowArtifactTableView';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'papa... Remove this comment to see the full error message
import Papa from 'papaparse';

describe('ShowArtifactTableView', () => {
  let wrapper: any;
  let minimalProps: any;
  let commonProps;

  beforeEach(() => {
    minimalProps = {
      path: 'fakePath.csv',
      runUuid: 'fakeUuid',
    };
    // Mock the `getArtifact` function to avoid spurious network errors
    // during testing
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve('some content');
    });
    commonProps = { ...minimalProps, getArtifact };
    wrapper = shallow(<ShowArtifactTableView {...commonProps} />);
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ShowArtifactTableView {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render raw file text if parsing invalid CSV', (done) => {
    const fileContents = 'abcd\n&&&&&';
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(fileContents);
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(<ShowArtifactTableView {...props} />);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.mlflow-ShowArtifactPage').length).toBe(1);
      expect(wrapper.find('.text-area-border-box').length).toBe(1);
      expect(wrapper.find('.text-area-border-box').text()).toBe(fileContents);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should only render the first 500 rows when the number of rows is larger than 500', (done) => {
    const data = Array(600).fill({ a: 0, b: 1 });
    const fileContents = Papa.unparse(data);

    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(fileContents);
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(<ShowArtifactTableView {...props} />);
    setImmediate(() => {
      wrapper.update();
      expect(
        wrapper.find('tbody').findWhere((n: any) => n.name() === 'tr' && n.prop('aria-hidden') !== 'true').length,
      ).toBe(500);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render CSV file correctly', (done) => {
    const data = Array(2).fill({ a: '0', b: '1' });
    const fileContents = Papa.unparse(data);

    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(fileContents);
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(<ShowArtifactTableView {...props} />);
    setImmediate(() => {
      wrapper.update();
      // Handle matching table headers
      const headerTextNodes = wrapper
        .find('thead')
        .find('tr')
        .findWhere((n: any) => n.name() === 'span' && n.text() !== '')
        .children();
      const csvHeaderValues = headerTextNodes.map((c: any) => c.text());
      expect(csvHeaderValues).toEqual(Object.keys(data[0]));

      // Handle matching row values
      const rowTextNodes = wrapper
        .find('tbody')
        .findWhere((n: any) => n.name() === 'tr' && n.prop('aria-hidden') !== 'true')
        .children();
      const csvPreviewValues = rowTextNodes.map((c: any) => c.text());
      const flatData = data.flatMap((d) => [d.a, d.b]);
      expect(csvPreviewValues).toEqual(flatData);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render TSV file correctly', (done) => {
    const data = Array(2).fill({ a: '0', b: '1' });
    const fileContents = Papa.unparse(data, { delimiter: '\t' });

    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(fileContents);
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(<ShowArtifactTableView {...props} />);
    setImmediate(() => {
      wrapper.update();
      // Handle matching table headers
      const headerTextNodes = wrapper
        .find('thead')
        .find('tr')
        .findWhere((n: any) => n.name() === 'span' && n.text() !== '')
        .children();
      const csvHeaderValues = headerTextNodes.map((c: any) => c.text());
      expect(csvHeaderValues).toEqual(Object.keys(data[0]));

      // Handle matching row values
      const rowTextNodes = wrapper
        .find('tbody')
        .findWhere((n: any) => n.name() === 'tr' && n.prop('aria-hidden') !== 'true')
        .children();
      const csvPreviewValues = rowTextNodes.map((c: any) => c.text());
      const flatData = data.flatMap((d) => [d.a, d.b]);
      expect(csvPreviewValues).toEqual(flatData);
      done();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactTableView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactTableView.tsx
Signals: React, TypeORM

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { useEffect, useState } from 'react';
import { getArtifactContent } from '../../../common/utils/ArtifactUtils';
import { LegacyTable } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'papa... Remove this comment to see the full error message
import Papa from 'papaparse';
import { ArtifactViewSkeleton } from './ArtifactViewSkeleton';
import type { LoggedModelArtifactViewerProps } from './ArtifactViewComponents.types';
import { fetchArtifactUnified } from './utils/fetchArtifactUnified';

type Props = {
  runUuid: string;
  path: string;
  getArtifact: typeof getArtifactContent;
} & LoggedModelArtifactViewerProps;

const ShowArtifactTableView = ({
  runUuid,
  path,
  getArtifact,
  isLoggedModelsMode,
  loggedModelId,
  experimentId,
  entityTags,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [headers, setHeaders] = useState();
  const [text, setText] = useState();

  const MAX_NUM_ROWS = 500;

  useEffect(() => {
    resetState();

    function fetchArtifacts() {
      fetchArtifactUnified?.(
        { runUuid, path, isLoggedModelsMode, loggedModelId, experimentId, entityTags },
        getArtifact,
      )
        .then((artifactText: any) => {
          try {
            const result = Papa.parse(artifactText, {
              header: true,
              preview: MAX_NUM_ROWS,
              skipEmptyLines: 'greedy',
              dynamicTyping: true,
            });
            const dataPreview = result.data;

            if (result.errors.length > 0) {
              throw Error(result.errors[0].message);
            }

            setLoading(false);
            setHeaders(result.meta.fields);
            setData(dataPreview);
          } catch (_) {
            setLoading(false);
            setText(artifactText);
          }
        })
        .catch((e: any) => {
          setError(e);
          setLoading(false);
        });
    }

    fetchArtifacts();
  }, [runUuid, path, getArtifact, isLoggedModelsMode, loggedModelId, experimentId, entityTags]);

  function resetState() {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    setError();
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    setData();
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    setHeaders();
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    setText();
    setLoading(true);
  }

  if (loading) {
    return <ArtifactViewSkeleton className="artifact-text-view-loading" />;
  }
  if (error) {
    return <div className="artifact-text-view-error">Oops we couldn't load your file because of an error.</div>;
  }

  if (data) {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const columns = headers.map((f: any) => ({
      title: f,
      dataIndex: f,
      key: f,
      sorter: (a: any, b: any) => (typeof a[f] === 'string' ? a[f].localeCompare(b[f]) : a[f] - b[f]),
      width: 200,

      ellipsis: {
        showTitle: true,
      },
    }));

    const numRows = (data as any).length;

    return (
      <div css={{ overscrollBehaviorX: 'contain', overflowX: 'scroll', margin: 10 }}>
        <span css={{ display: 'flex', justifyContent: 'center' }}>
          <FormattedMessage
            defaultMessage="Previewing the first {numRows} rows"
            description="Title for showing the number of rows in the parsed data preview"
            values={{ numRows }}
          />
        </span>
        <LegacyTable
          columns={columns}
          dataSource={data}
          pagination={false}
          sticky
          // @ts-expect-error TS(2322): Type 'true' is not assignable to type 'string | nu... Remove this comment to see the full error message
          scroll={{ x: 'min-content', y: true }}
        />
      </div>
    );
  } else {
    return (
      <div className="mlflow-ShowArtifactPage">
        <div className="text-area-border-box">{text}</div>
      </div>
    );
  }
};

ShowArtifactTableView.defaultProps = {
  getArtifact: getArtifactContent,
};

export default ShowArtifactTableView;
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactTextView.css]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactTextView.css

```text
.mlflow-ShowArtifactPage .text-area {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-family: Menlo, Consolas, monospace;
}

.mlflow-ShowArtifactPage,
.mlflow-ShowArtifactPage .text-area-border-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactTextView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactTextView.enzyme.test.tsx
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
import ShowArtifactTextView, { prettifyArtifactText } from './ShowArtifactTextView';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { mountWithIntl } from '../../../common/utils/TestUtils.enzyme';

describe('ShowArtifactTextView', () => {
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
    commonProps = { ...minimalProps, getArtifact };
    wrapper = shallow(<ShowArtifactTextView {...commonProps} />).dive();
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ShowArtifactTextView {...minimalProps} />).dive();
    expect(wrapper.length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render error message when error occurs', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.reject(new Error('my error text'));
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = shallow(<ShowArtifactTextView {...props} />).dive();
    setImmediate(() => {
      expect(wrapper.find('.artifact-text-view-error').length).toBe(1);
      expect(wrapper.instance().state.loading).toBe(false);
      expect(wrapper.instance().state.html).toBeUndefined();
      expect(wrapper.instance().state.error).toBeDefined();
      done();
    });
  });

  test('should render loading text when view is loading', () => {
    instance = wrapper.instance();
    instance.setState({ loading: true });
    expect(wrapper.find('.artifact-text-view-loading').length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render text content when available', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve('my text');
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(<ShowArtifactTextView {...props} />);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.mlflow-ShowArtifactPage').length).toBe(1);
      expect(wrapper.find('code').length).toBe(1);
      expect(wrapper.find('code').text()).toBe('my text');
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('SyntaxHighlighter has an appropriate language prop for a python script', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve('print("foo")');
    });
    const props = { path: 'fake.py', runUuid: 'fakeUuid', getArtifact, experimentId: '123' };
    wrapper = shallow(<ShowArtifactTextView {...props} />).dive();
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(SyntaxHighlighter).first().props().language).toBe('py');
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('SyntaxHighlighter has an appropriate language prop for an MLproject file', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve('key: value');
    });
    const props = { path: 'MLproject', runUuid: 'fakeUuid', getArtifact, experimentId: '123' };
    wrapper = shallow(<ShowArtifactTextView {...props} />).dive();
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(SyntaxHighlighter).first().props().language).toBe('yaml');
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('SyntaxHighlighter has an appropriate language prop for an MLmodel file', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve('key: value');
    });
    const props = { path: 'MLmodel', runUuid: 'fakeUuid', getArtifact, experimentId: '123' };
    wrapper = shallow(<ShowArtifactTextView {...props} />).dive();
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(SyntaxHighlighter).first().props().language).toBe('yaml');
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

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render prettified valid json', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve('{"key1": "val1", "key2": "val2"}');
    });
    const props = { path: 'fake.json', runUuid: 'fakeUuid', getArtifact, experimentId: '123' };
    wrapper = mountWithIntl(<ShowArtifactTextView {...props} />);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.mlflow-ShowArtifactPage').length).toBe(1);
      expect(wrapper.find('code').length).toBe(1);
      expect(wrapper.find('code').text()).toContain('\n');
      expect(wrapper.find('code').text()).toContain('key1');
      done();
    });
  });

  test('should leave invalid json untouched', () => {
    const outputText = prettifyArtifactText('json', '{"hello');
    expect(outputText).toBe('{"hello');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactTextView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactTextView.tsx
Signals: React

```typescript
import React, { Component } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy as style, atomDark as darkStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { getLanguage } from '../../../common/utils/FileUtils';
import { getArtifactContent } from '../../../common/utils/ArtifactUtils';
import './ShowArtifactTextView.css';
import type { DesignSystemHocProps } from '@databricks/design-system';
import { WithDesignSystemThemeHoc } from '@databricks/design-system';
import { ArtifactViewSkeleton } from './ArtifactViewSkeleton';
import { ArtifactViewErrorState } from './ArtifactViewErrorState';
import type { LoggedModelArtifactViewerProps } from './ArtifactViewComponents.types';
import { fetchArtifactUnified } from './utils/fetchArtifactUnified';

const LARGE_ARTIFACT_SIZE = 100 * 1024;

type Props = DesignSystemHocProps & {
  runUuid: string;
  path: string;
  size?: number;
  getArtifact?: (...args: any[]) => any;
} & LoggedModelArtifactViewerProps;

type State = {
  loading?: boolean;
  error?: Error;
  text?: string;
  path?: string;
};

class ShowArtifactTextView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.fetchArtifacts = this.fetchArtifacts.bind(this);
  }

  static defaultProps = {
    getArtifact: fetchArtifactUnified,
  };

  state = {
    loading: true,
    error: undefined,
    text: undefined,
    path: undefined,
  };

  componentDidMount() {
    this.fetchArtifacts();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.path !== prevProps.path || this.props.runUuid !== prevProps.runUuid) {
      this.fetchArtifacts();
    }
  }

  render() {
    if (this.state.loading || this.state.path !== this.props.path) {
      return <ArtifactViewSkeleton className="artifact-text-view-loading" />;
    }
    if (this.state.error) {
      return <ArtifactViewErrorState className="artifact-text-view-error" />;
    } else {
      const isLargeFile = (this.props.size || 0) > LARGE_ARTIFACT_SIZE;
      const language = isLargeFile ? 'text' : getLanguage(this.props.path);
      const { theme } = this.props.designSystemThemeApi;

      const overrideStyles = {
        fontFamily: 'Source Code Pro,Menlo,monospace',
        fontSize: theme.typography.fontSizeMd,
        overflow: 'auto',
        marginTop: '0',
        width: '100%',
        height: '100%',
        padding: theme.spacing.xs,
        borderColor: theme.colors.borderDecorative,
        border: 'none',
      };
      const renderedContent = this.state.text ? prettifyArtifactText(language, this.state.text) : this.state.text;

      const syntaxStyle = theme.isDarkMode ? darkStyle : style;

      return (
        <div className="mlflow-ShowArtifactPage">
          <div className="text-area-border-box">
            <SyntaxHighlighter language={language} style={syntaxStyle} customStyle={overrideStyles}>
              {renderedContent ?? ''}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }
  }

  /** Fetches artifacts and updates component state with the result */
  fetchArtifacts() {
    this.setState({ loading: true });
    const { isLoggedModelsMode, loggedModelId, path, runUuid, experimentId, entityTags } = this.props;

    this.props
      .getArtifact?.({ isLoggedModelsMode, loggedModelId, path, runUuid, experimentId, entityTags }, getArtifactContent)
      .then((text: string) => {
        this.setState({ text: text, loading: false });
      })
      .catch((error: Error) => {
        this.setState({ error: error, loading: false });
      });
    this.setState({ path: this.props.path });
  }
}

export function prettifyArtifactText(language: string, rawText: string) {
  if (language === 'json') {
    try {
      const parsedJson = JSON.parse(rawText);
      return JSON.stringify(parsedJson, null, 2);
    } catch (e) {
      // No-op
    }
    return rawText;
  }
  return rawText;
}
export default React.memo(WithDesignSystemThemeHoc(ShowArtifactTextView));
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactVideoView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactVideoView.test.tsx

```typescript
import { jest, describe, beforeAll, it, expect } from '@jest/globals';
import { render, screen, waitFor } from '../../../common/utils/TestUtils.react18';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';

import ShowArtifactVideoView from './ShowArtifactVideoView';

jest.mock('../../../common/utils/ArtifactUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/ArtifactUtils')>('../../../common/utils/ArtifactUtils'),
  getArtifactContent: jest.fn(),
}));

describe('ShowArtifactVideoView', () => {
  const DUMMY_BLOB = new Blob(['unit-test'], { type: 'video/mp4' });
  const getArtifactMock = jest.fn(() => Promise.resolve(DUMMY_BLOB));

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob://dummy-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('shows a skeleton placeholder first, then renders the video', async () => {
    render(
      <ShowArtifactVideoView
        runUuid="run-123"
        path="foo/bar/video.mp4"
        getArtifact={getArtifactMock}
        isLoggedModelsMode={false}
        experimentId="experiment-123"
      />,
      {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <DesignSystemProvider>{children}</DesignSystemProvider>
          </IntlProvider>
        ),
      },
    );

    expect(screen.queryByRole('video')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText('video')).toBeInTheDocument();
      expect((screen.getByLabelText('video') as HTMLVideoElement).src).toBe('blob://dummy-url');
    });
  });
});
```

--------------------------------------------------------------------------------

````

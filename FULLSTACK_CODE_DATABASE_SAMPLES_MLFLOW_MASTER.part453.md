---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 453
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 453 of 991)

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

---[FILE: LazyShowArtifactAudioView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/LazyShowArtifactAudioView.tsx
Signals: React

```typescript
import React from 'react';
import { LegacySkeleton } from '@databricks/design-system';
import { SectionErrorBoundary } from '../../../common/components/error-boundaries/SectionErrorBoundary';
import type { ShowArtifactAudioViewProps } from './ShowArtifactAudioView';

const ShowArtifactAudioView = React.lazy(() => import('./ShowArtifactAudioView'));

export const LazyShowArtifactAudioView = (props: ShowArtifactAudioViewProps) => (
  <SectionErrorBoundary>
    <React.Suspense fallback={<LegacySkeleton active />}>
      <ShowArtifactAudioView {...props} />
    </React.Suspense>
  </SectionErrorBoundary>
);
```

--------------------------------------------------------------------------------

---[FILE: LazyShowArtifactMapView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/LazyShowArtifactMapView.tsx
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
import { SectionErrorBoundary } from '../../../common/components/error-boundaries/SectionErrorBoundary';

const ShowArtifactMapView = React.lazy(() => import('./ShowArtifactMapView'));

export const LazyShowArtifactMapView = (props: any) => (
  <SectionErrorBoundary>
    <React.Suspense fallback={<LegacySkeleton active />}>
      <ShowArtifactMapView {...props} />
    </React.Suspense>
  </SectionErrorBoundary>
);
```

--------------------------------------------------------------------------------

---[FILE: LazyShowArtifactPdfView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/LazyShowArtifactPdfView.tsx
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
import { SectionErrorBoundary } from '../../../common/components/error-boundaries/SectionErrorBoundary';

const ShowArtifactPdfView = React.lazy(() => import('./ShowArtifactPdfView'));

export const LazyShowArtifactPdfView = (props: any) => (
  <SectionErrorBoundary>
    <React.Suspense fallback={<LegacySkeleton active />}>
      <ShowArtifactPdfView {...props} />
    </React.Suspense>
  </SectionErrorBoundary>
);
```

--------------------------------------------------------------------------------

---[FILE: LazyShowArtifactTableView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/LazyShowArtifactTableView.tsx
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
import { SectionErrorBoundary } from '../../../common/components/error-boundaries/SectionErrorBoundary';

const ShowArtifactTableView = React.lazy(() => import('./ShowArtifactTableView'));

export const LazyShowArtifactTableView = (props: any) => (
  <SectionErrorBoundary>
    <React.Suspense fallback={<LegacySkeleton active />}>
      <ShowArtifactTableView {...props} />
    </React.Suspense>
  </SectionErrorBoundary>
);
```

--------------------------------------------------------------------------------

---[FILE: LazyShowArtifactVideoView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/LazyShowArtifactVideoView.tsx
Signals: React

```typescript
import { lazy } from 'react';

export const LazyShowArtifactVideoView = lazy(() => import('./ShowArtifactVideoView'));
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactAudioView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactAudioView.test.tsx

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { render, screen } from '../../../common/utils/TestUtils.react18';
import ShowArtifactAudioView from './ShowArtifactAudioView';

import { IntlProvider } from 'react-intl';
import type { WaveSurferOptions } from 'wavesurfer.js';
import WaveSurfer from 'wavesurfer.js';

jest.mock('wavesurfer.js', () => {
  const mWaveSurfer = {
    load: jest.fn(),
    destroy: jest.fn(),
    on: jest.fn((event, callback) => {
      if (event === 'ready') {
        // @ts-expect-error Argument of type 'unknown' is not assignable to parameter of type '() => void'
        setTimeout(callback, 0); // Simulate async event
      }
    }),
  };
  return {
    create: jest.fn().mockReturnValue(mWaveSurfer),
  };
});

const minimalProps = {
  path: 'fakepath',
  runUuid: 'fakeUuid',
};

describe('ShowArtifactAudioView tests', () => {
  test('should render with minimal props without exploding', () => {
    render(
      <IntlProvider locale="en">
        <ShowArtifactAudioView {...minimalProps} />
      </IntlProvider>,
    );
    expect(screen.getByTestId('audio-artifact-preview')).toBeInTheDocument();
  });

  test('destroys WaveSurfer on component unmount', async () => {
    const { unmount } = render(
      <IntlProvider locale="en">
        <ShowArtifactAudioView {...minimalProps} />
      </IntlProvider>,
    );

    unmount();

    expect(WaveSurfer.create({} as WaveSurferOptions).destroy).toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactAudioView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactAudioView.tsx
Signals: React

```typescript
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { getArtifactBlob, getArtifactLocationUrl } from '../../../common/utils/ArtifactUtils';
import { ArtifactViewErrorState } from './ArtifactViewErrorState';
import { ArtifactViewSkeleton } from './ArtifactViewSkeleton';

const waveSurferStyling = {
  waveColor: '#1890ff',
  progressColor: '#0b3574',
  height: 500,
};

export type ShowArtifactAudioViewProps = {
  runUuid: string;
  path: string;
  getArtifact?: (...args: any[]) => any;
};

const ShowArtifactAudioView = ({ runUuid, path, getArtifact = getArtifactBlob }: ShowArtifactAudioViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      mediaControls: true,
      container: containerRef.current,
      ...waveSurferStyling,
      url: getArtifactLocationUrl(path, runUuid),
    });

    ws.on('ready', () => {
      setLoading(false);
    });

    ws.on('error', () => {
      setError(true);
    });

    setWaveSurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [containerRef, path, runUuid]);

  const showLoading = loading && !error;

  return (
    <div data-testid="audio-artifact-preview">
      {showLoading && <ArtifactViewSkeleton />}
      {error && <ArtifactViewErrorState />}
      {/* This div is always rendered, but its visibility is controlled by the loading and error states */}
      <div
        css={{
          display: loading || error ? 'none' : 'block',
          padding: 20,
        }}
      >
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default ShowArtifactAudioView;
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactCodeSnippet.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactCodeSnippet.tsx
Signals: React

```typescript
import React from 'react';
import { CopyIcon, useDesignSystemTheme } from '@databricks/design-system';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { CopyButton } from '@mlflow/mlflow/src/shared/building_blocks/CopyButton';

export const ShowArtifactCodeSnippet = ({ code }: { code: string }): React.ReactElement => {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ position: 'relative' }}>
      <CopyButton
        css={{ zIndex: 1, position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs }}
        showLabel={false}
        copyText={code}
        icon={<CopyIcon />}
      />
      <CodeSnippet
        language="python"
        showLineNumbers={false}
        style={{
          padding: theme.spacing.sm,
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.backgroundSecondary,
          whiteSpace: 'pre-wrap',
        }}
        wrapLongLines
      >
        {code}
      </CodeSnippet>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactHtmlView.css]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactHtmlView.css

```text
.mlflow-html-iframe {
  border: none;
}

.mlflow-artifact-html-view {
  width: 100%;
  height: 100%;
  overflow: auto;
}
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactHtmlView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactHtmlView.enzyme.test.tsx
Signals: React

```typescript
/* eslint-disable jest/no-standalone-expect */
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { shallow } from 'enzyme';
import ShowArtifactHtmlView from './ShowArtifactHtmlView';
import Iframe from 'react-iframe';

describe('ShowArtifactHtmlView', () => {
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
    wrapper = shallow(<ShowArtifactHtmlView {...commonProps} />);
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ShowArtifactHtmlView {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should render loading text when view is loading', () => {
    instance = wrapper.instance();
    instance.setState({ loading: true });
    expect(wrapper.find('.artifact-html-view-loading').length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render error message when error occurs', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.reject(new Error('my error text'));
    });
    const props = { ...minimalProps, getArtifact: getArtifact };
    wrapper = shallow(<ShowArtifactHtmlView {...props} />);
    setImmediate(() => {
      expect(wrapper.find('.artifact-html-view-error').length).toBe(1);
      expect(wrapper.instance().state.loading).toBe(false);
      expect(wrapper.instance().state.html).toBeFalsy();
      expect(wrapper.instance().state.error).toBeDefined();
      done();
    });
  });

  test('should render html content in IFrame', (done: any) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve('my text');
    });
    const props = { ...minimalProps, getArtifact: getArtifact };
    wrapper = shallow(<ShowArtifactHtmlView {...props} />);
    setImmediate(() => {
      expect(wrapper.instance().state.loading).toBe(false);
      expect(wrapper.instance().state.html).toBeTruthy();
      expect(wrapper.instance().state.error).toBeUndefined();
      expect(wrapper.find(Iframe).length).toBe(1);
      expect(wrapper.find(Iframe).first().dive().prop('id')).toEqual('html');
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

---[FILE: ShowArtifactHtmlView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactHtmlView.tsx
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
  getArtifactContent,
  getArtifactLocationUrl,
  getLoggedModelArtifactLocationUrl,
} from '../../../common/utils/ArtifactUtils';
import './ShowArtifactHtmlView.css';
import Iframe from 'react-iframe';
import { ArtifactViewSkeleton } from './ArtifactViewSkeleton';
import type { LoggedModelArtifactViewerProps } from './ArtifactViewComponents.types';
import { fetchArtifactUnified, type FetchArtifactUnifiedFn } from './utils/fetchArtifactUnified';

type ShowArtifactHtmlViewState = {
  loading: boolean;
  error?: any;
  html: string;
  path: string;
};

type ShowArtifactHtmlViewProps = {
  runUuid: string;
  path: string;
  getArtifact: FetchArtifactUnifiedFn;
} & LoggedModelArtifactViewerProps;

class ShowArtifactHtmlView extends Component<ShowArtifactHtmlViewProps, ShowArtifactHtmlViewState> {
  constructor(props: ShowArtifactHtmlViewProps) {
    super(props);
    this.fetchArtifacts = this.fetchArtifacts.bind(this);
  }

  static defaultProps = {
    getArtifact: fetchArtifactUnified,
  };

  state = {
    loading: true,
    error: undefined,
    html: '',
    path: '',
  };

  componentDidMount() {
    this.fetchArtifacts();
  }

  componentDidUpdate(prevProps: ShowArtifactHtmlViewProps) {
    if (this.props.path !== prevProps.path || this.props.runUuid !== prevProps.runUuid) {
      this.fetchArtifacts();
    }
  }

  render() {
    if (this.state.loading || this.state.path !== this.props.path) {
      return <ArtifactViewSkeleton className="artifact-html-view-loading" />;
    }
    if (this.state.error) {
      // eslint-disable-next-line no-console -- TODO(FEINF-3587)
      console.error('Unable to load HTML artifact, got error ' + this.state.error);
      return <div className="artifact-html-view-error">Oops we couldn't load your file because of an error.</div>;
    } else {
      return (
        <div className="mlflow-artifact-html-view">
          <Iframe
            url=""
            src={this.getBlobURL(this.state.html, 'text/html')}
            width="100%"
            height="100%"
            id="html"
            className="mlflow-html-iframe"
            display="block"
            position="relative"
            sandbox="allow-scripts"
          />
        </div>
      );
    }
  }

  getBlobURL = (code: string, type: string) => {
    const blob = new Blob([code], { type });
    return URL.createObjectURL(blob);
  };

  /** Fetches artifacts and updates component state with the result */
  fetchArtifacts() {
    const { path, runUuid, isLoggedModelsMode, loggedModelId, experimentId, entityTags } = this.props;

    this.props
      .getArtifact?.({ path, runUuid, isLoggedModelsMode, loggedModelId, experimentId, entityTags }, getArtifactContent)
      .then((html: string) => {
        this.setState({ html: html, loading: false, path: this.props.path });
      })
      .catch((error: Error) => {
        this.setState({ error: error, loading: false, path: this.props.path });
      });
  }
}

export default ShowArtifactHtmlView;
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactImageView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactImageView.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeAll, jest, afterAll, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { mount, shallow } from 'enzyme';
import ShowArtifactImageView from './ShowArtifactImageView';

describe('ShowArtifactImageView', () => {
  let wrapper: any;
  let minimalProps: any;
  let objectUrlSpy: any;

  beforeAll(() => {
    objectUrlSpy = jest.spyOn(window.URL, 'createObjectURL').mockImplementation(() => 'blob:abc-12345');
  });

  afterAll(() => {
    objectUrlSpy.mockRestore();
  });

  beforeEach(() => {
    minimalProps = {
      path: 'fakePath',
      runUuid: 'fakeUuid',
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ShowArtifactImageView {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should fetch image as an XHR', (done) => {
    const getArtifact = jest.fn(() => Promise.resolve(new ArrayBuffer(8)));
    wrapper = mount(<ShowArtifactImageView {...minimalProps} getArtifact={getArtifact} />);
    // @ts-expect-error Expected 0 arguments, but got 1
    expect(getArtifact).toHaveBeenCalledWith(expect.stringMatching(/get-artifact\?path=fakePath&run_uuid=fakeUuid/));

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('img[src="blob:abc-12345"]').length).toBeTruthy();
      done();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactImageView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactImageView.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { useState, useEffect } from 'react';
import { LegacySkeleton } from '@databricks/design-system';
import {
  getArtifactBytesContent,
  getArtifactLocationUrl,
  getLoggedModelArtifactLocationUrl,
} from '../../../common/utils/ArtifactUtils';
import { ImagePreviewGroup, Image } from '../../../shared/building_blocks/Image';
import type { LoggedModelArtifactViewerProps } from './ArtifactViewComponents.types';
import { fetchArtifactUnified } from './utils/fetchArtifactUnified';

type Props = {
  runUuid: string;
  path: string;
  getArtifact?: (...args: any[]) => any;
} & LoggedModelArtifactViewerProps;

const ShowArtifactImageView = ({
  experimentId,
  runUuid,
  path,
  getArtifact = getArtifactBytesContent,
  isLoggedModelsMode,
  loggedModelId,
  entityTags,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    // Download image contents using XHR so all necessary
    // HTTP headers will be automatically added
    fetchArtifactUnified(
      {
        runUuid,
        path,
        isLoggedModelsMode,
        loggedModelId,
        experimentId,
        entityTags,
      },
      getArtifact,
    ).then((result: any) => {
      const options = path.toLowerCase().endsWith('.svg') ? { type: 'image/svg+xml' } : undefined;
      // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      setImageUrl(URL.createObjectURL(new Blob([new Uint8Array(result)], options)));
      setIsLoading(false);
    });
  }, [runUuid, path, getArtifact, isLoggedModelsMode, loggedModelId, experimentId, entityTags]);

  return (
    imageUrl && (
      <div css={{ flex: 1 }}>
        <div css={classNames.imageOuterContainer}>
          {isLoading && <LegacySkeleton active />}
          <div css={isLoading ? classNames.hidden : classNames.imageWrapper}>
            <img
              alt={path}
              css={classNames.image}
              src={imageUrl}
              onLoad={() => setIsLoading(false)}
              onClick={() => setPreviewVisible(true)}
            />
          </div>
          <div css={[classNames.hidden]}>
            <ImagePreviewGroup visible={previewVisible} onVisibleChange={setPreviewVisible}>
              <Image src={imageUrl} />
            </ImagePreviewGroup>
          </div>
        </div>
      </div>
    )
  );
};

const classNames = {
  imageOuterContainer: {
    padding: '10px',
    overflow: 'scroll',
    // Let's keep images (esp. transparent PNGs) on the white background regardless of the theme
    background: 'white',
    minHeight: '100%',
  },
  imageWrapper: { display: 'inline-block' },
  image: {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 0 4px gray',
    },
  },
  hidden: { display: 'none' },
};

export default ShowArtifactImageView;
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactLoggedModelView.css]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactLoggedModelView.css

```text
.mlflow-show-artifact-logged-model-view {
  width: 100%;
  height: 100%;
  overflow: auto;
}
```

--------------------------------------------------------------------------------

---[FILE: ShowArtifactLoggedModelView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactLoggedModelView.enzyme.test.tsx
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
import { shallow } from 'enzyme';
import ShowArtifactLoggedModelView, { ShowArtifactLoggedModelViewImpl } from './ShowArtifactLoggedModelView';
import { mountWithIntl, shallowWithInjectIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { DesignSystemProvider } from '@databricks/design-system';

describe('ShowArtifactLoggedModelView', () => {
  let wrapper: any;
  let instance;
  let minimalProps: any;
  let commonProps: any;
  const minimumFlavors = `
flavors:
  python_function:
    loader_module: mlflow.sklearn
`;
  const validMlModelFile =
    minimumFlavors +
    'signature:\n' +
    '  inputs: \'[{"name": "sepal length (cm)", "type": "double"}, {"name": "sepal width\n' +
    '    (cm)", "type": "double"}, {"name": "petal length (cm)", "type": "double"}, {"name":\n' +
    '    "petal width (cm)", "type": "double"}]\'\n' +
    '  outputs: \'[{"type": "long"}]\'';

  beforeEach(() => {
    minimalProps = { path: 'fakePath', runUuid: 'fakeUuid', artifactRootUri: 'fakeRootUri' };
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(minimumFlavors);
    });
    commonProps = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...commonProps} />
      </DesignSystemProvider>,
    );
  });

  test('should render with minimal props without exploding', () => {
    expect(wrapper.length).toBe(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render error message when error occurs', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.reject(new Error('my error text'));
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );

    // Wait for the promise rejection to be processed
    setTimeout(() => {
      wrapper.update();
      const impl = wrapper.find(ShowArtifactLoggedModelViewImpl);
      expect(wrapper.find('.artifact-logged-model-view-error').length).toBeGreaterThan(0);
      expect(impl.state().loading).toBe(false);
      expect(impl.state().error).toBeDefined();
      done();
    }, 100);
  });

  test('should render loading text when view is loading', () => {
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...commonProps} />
      </DesignSystemProvider>,
    );
    const impl = wrapper.find(ShowArtifactLoggedModelViewImpl);
    impl.instance().setState({ loading: true });
    wrapper.update();
    expect(wrapper.find('.artifact-logged-model-view-loading').length).toBeGreaterThan(0);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render schema table when valid signature in MLmodel file', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(validMlModelFile);
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-schema-table').length).toBe(1);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should not render schema table when invalid signature in MLmodel file', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(validMlModelFile + '\nhahaha');
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-schema-table').length).toBe(0);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should not break schema table when inputs only in MLmodel file', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(
        minimumFlavors +
          'signature:\n' +
          '  inputs: \'[{"name": "sepal length (cm)", "type": "double"}, {"name": "sepal width\n' +
          '    (cm)", "type": "double"}, {"name": "petal length (cm)", "type": "double"}, {"name":\n' +
          '    "petal width (cm)", "type": "double"}]\'\n',
      );
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-schema-table').length).toBe(1);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should not break schema table when outputs only in MLmodel file', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(
        minimumFlavors +
          'signature:\n' +
          '  outputs: \'[{"name": "sepal length (cm)", "type": "double"}, {"name": "sepal width\n' +
          '    (cm)", "type": "double"}, {"name": "petal length (cm)", "type": "double"}, {"name":\n' +
          '    "petal width (cm)", "type": "double"}]\'\n',
      );
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-schema-table').length).toBe(1);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should not break schema table when no inputs or outputs in MLmodel file', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(minimumFlavors + 'signature:');
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-schema-table').length).toBe(1);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render code group and code snippet', (done) => {
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...commonProps} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-code-group').length).toBe(1);
      expect(wrapper.find('.artifact-logged-model-view-code-content').length).toBe(2);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should find model path in code snippet', (done) => {
    const props = { ...commonProps, path: 'modelPath', artifactRootUri: 'some/root' };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-code-content').at(1).html()).toContain(
        'runs:/fakeUuid/modelPath',
      );
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render models predict in code snippet', (done) => {
    const props = { ...commonProps, path: 'modelPath', artifactRootUri: 'some/root' };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-code-content').at(0).text()).toContain('mlflow.models.predict');
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should suggest registration when model not registered', (done) => {
    const props = { ...commonProps };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-header').text()).toContain('You can also');
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should not suggest registration when model already registered', (done) => {
    const props = { ...commonProps, registeredModelLink: 'someLink' };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.artifact-logged-model-view-header').text()).toContain(
        'This model is also registered to the',
      );
      done();
    });
  });

  test('should fetch artifacts and serving input on component update', () => {
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...commonProps} />
      </DesignSystemProvider>,
    );
    const impl = wrapper.find(ShowArtifactLoggedModelViewImpl);
    const instance = impl.instance();
    instance.fetchLoggedModelMetadata = jest.fn();
    wrapper.setProps({ children: <ShowArtifactLoggedModelView {...commonProps} path="newpath" runUuid="newRunId" /> });
    wrapper.update();
    expect(instance.fetchLoggedModelMetadata).toHaveBeenCalled();
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render code snippet with original flavor when no pyfunc flavor', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(`
flavors:
  sklearn:
    version: 1.2.3
`);
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      const impl = wrapper.find(ShowArtifactLoggedModelViewImpl);
      expect(impl.state().flavor).toBe('sklearn');
      const codeContent = impl.find('.artifact-logged-model-view-code-content');
      expect(codeContent.length).toBe(2);
      expect(codeContent.at(1).text().includes('mlflow.sklearn.load_model')).toBe(true);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should not render code snippet for mleap flavor', (done) => {
    const getArtifact = jest.fn((artifactLocation) => {
      return Promise.resolve(`
flavors:
  mleap:
    version: 1.2.3
`);
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      const impl = wrapper.find(ShowArtifactLoggedModelViewImpl);
      expect(impl.state().flavor).toBe('mleap');
      // Only validate model serving code snippet is rendered
      expect(impl.find('.artifact-logged-model-view-code-content').length).toBe(1);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render serving validation code snippet if serving_input_example exists', (done) => {
    const getArtifact = jest.fn().mockImplementationOnce((artifactLocation) => {
      return Promise.resolve(`
flavors:
  python_function:
    python_version: 3.9.18
saved_input_example_info:
  artifact_path: input_example.json
`);
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      const impl = wrapper.find(ShowArtifactLoggedModelViewImpl);
      expect(impl.state().hasInputExample).toBe(true);
      const codeContent = impl.find('.artifact-logged-model-view-code-content');
      expect(codeContent.length).toBe(2);
      const codeContentText = codeContent.at(0).text();
      expect(codeContentText.includes('input_data = pyfunc_model.input_example')).toBe(true);
      expect(codeContentText.includes('mlflow.models.predict')).toBe(true);
      done();
    });
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('should render serving validation code snippet if serving_input_example does not exist', (done) => {
    const getArtifact = jest.fn().mockImplementationOnce((artifactLocation) => {
      return Promise.resolve(`
flavors:
  sklearn:
    version: 1.2.3
`);
    });
    const props = { ...minimalProps, getArtifact };
    wrapper = mountWithIntl(
      <DesignSystemProvider>
        <ShowArtifactLoggedModelView {...props} />
      </DesignSystemProvider>,
    );
    setImmediate(() => {
      wrapper.update();
      const impl = wrapper.find(ShowArtifactLoggedModelViewImpl);
      expect(impl.state().hasInputExample).toBe(false);
      const codeContent = impl.find('.artifact-logged-model-view-code-content');
      expect(codeContent.length).toBe(2);
      const codeContentText = codeContent.at(0).text();
      expect(codeContentText.includes('# Replace INPUT_EXAMPLE with your own input example to the model')).toBe(true);
      expect(codeContentText.includes('mlflow.models.predict')).toBe(true);
      done();
    });
  });
});
```

--------------------------------------------------------------------------------

````

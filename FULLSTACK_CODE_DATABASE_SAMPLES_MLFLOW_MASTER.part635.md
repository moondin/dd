---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 635
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 635 of 991)

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

---[FILE: MlflowUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/MlflowUtils.tsx

```typescript
/**
 * This file is a subset of functions from mlflow/server/js/src/common/Utils.tsx
 */
import moment from 'moment';

import type { IntlShape } from '@databricks/i18n';
import type { ModelTraceInfoV3 } from '../../model-trace-explorer';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
class MlflowUtils {
  static runNameTag = 'mlflow.runName';
  static sourceNameTag = 'mlflow.source.name';
  static sourceTypeTag = 'mlflow.source.type';
  static entryPointTag = 'mlflow.project.entryPoint';

  static getEntryPointName(runTags: any) {
    const entryPointTag = runTags[MlflowUtils.entryPointTag];
    if (entryPointTag) {
      return entryPointTag.value;
    }
    return '';
  }

  static getSourceType(runTags: any) {
    const sourceTypeTag = runTags[MlflowUtils.sourceTypeTag];
    if (sourceTypeTag) {
      return sourceTypeTag.value;
    }
    return '';
  }

  static dropExtension(path: any) {
    return path.replace(/(.*[^/])\.[^/.]+$/, '$1');
  }

  static baseName(path: any) {
    const pieces = path.split('/');
    return pieces[pieces.length - 1];
  }

  /**
   * Renders the source name and entry point into a string. Used for sorting.
   * @param run MlflowMessages.RunInfo
   */
  static formatSource(tags: any) {
    const sourceName = MlflowUtils.getSourceName(tags);
    const sourceType = MlflowUtils.getSourceType(tags);
    const entryPointName = MlflowUtils.getEntryPointName(tags);
    if (sourceType === 'PROJECT') {
      let res = MlflowUtils.dropExtension(MlflowUtils.baseName(sourceName));
      if (entryPointName && entryPointName !== 'main') {
        res += ':' + entryPointName;
      }
      return res;
    } else if (sourceType === 'JOB') {
      const jobIdTag = 'mlflow.databricks.jobID';
      const jobRunIdTag = 'mlflow.databricks.jobRunID';
      const jobId = tags && tags[jobIdTag] && tags[jobIdTag].value;
      const jobRunId = tags && tags[jobRunIdTag] && tags[jobRunIdTag].value;
      if (jobId && jobRunId) {
        return MlflowUtils.getDefaultJobRunName(jobId, jobRunId);
      }
      return sourceName;
    } else {
      return MlflowUtils.baseName(sourceName);
    }
  }

  static getDefaultJobRunName(jobId: any, runId: any, workspaceId = null) {
    if (!jobId) {
      return '-';
    }
    let name = `job ${jobId}`;
    if (runId) {
      name = `run ${runId} of ` + name;
    }
    if (workspaceId) {
      name = `workspace ${workspaceId}: ` + name;
    }
    return name;
  }

  static getSourceName(runTags: any) {
    const sourceNameTag = runTags[MlflowUtils.sourceNameTag];
    if (sourceNameTag) {
      return sourceNameTag.value;
    }
    return '';
  }

  static getGitHubRegex() {
    return /[@/]github.com[:/]([^/.]+)\/([^/#]+)#?(.*)/;
  }

  static getGitLabRegex() {
    return /[@/]gitlab.com[:/]([^/.]+)\/([^/#]+)#?(.*)/;
  }

  static getBitbucketRegex() {
    return /[@/]bitbucket.org[:/]([^/.]+)\/([^/#]+)#?(.*)/;
  }

  static getExperimentChatSessionPageRoute(experimentId: string, sessionId: string) {
    return `/experiments/${experimentId}/chat-sessions/${sessionId}`;
  }

  static getRunPageRoute(experimentId: string, runUuid: string) {
    return `/experiments/${experimentId}/runs/${runUuid}`;
  }

  static getLoggedModelPageRoute(experimentId: string, loggedModelId: string) {
    return `/experiments/${experimentId}/models/${loggedModelId}`;
  }

  /**
   * Regular expression for URLs containing the string 'git'.
   * It can be a custom git domain (e.g. https://git.custom.in/repo/dir#file/dir).
   * Excluding the first overall match, there are three groups:
   *    git url, repo directory, and file directory.
   * (e.g. group1: https://custom.git.domain, group2: repo/directory, group3: project/directory)
   */
  static getGitRegex() {
    return /(.*?[@/][^?]*git.*?)[:/]([^#]+)(?:#(.*))?/;
  }

  static getGitRepoUrl(sourceName: any, branchName = 'master') {
    const gitHubMatch = sourceName.match(MlflowUtils.getGitHubRegex());
    const gitLabMatch = sourceName.match(MlflowUtils.getGitLabRegex());
    const bitbucketMatch = sourceName.match(MlflowUtils.getBitbucketRegex());
    const gitMatch = sourceName.match(MlflowUtils.getGitRegex());
    let url = null;
    if (gitHubMatch) {
      url = `https://github.com/${gitHubMatch[1]}/${gitHubMatch[2].replace(/.git/, '')}`;
      if (gitHubMatch[3]) {
        url += `/tree/${branchName}/${gitHubMatch[3]}`;
      }
    } else if (gitLabMatch) {
      url = `https://gitlab.com/${gitLabMatch[1]}/${gitLabMatch[2].replace(/.git/, '')}`;
      if (gitLabMatch[3]) {
        url += `/-/tree/${branchName}/${gitLabMatch[3]}`;
      }
    } else if (bitbucketMatch) {
      url = `https://bitbucket.org/${bitbucketMatch[1]}/${bitbucketMatch[2].replace(/.git/, '')}`;
      if (bitbucketMatch[3]) {
        url += `/src/${branchName}/${bitbucketMatch[3]}`;
      }
    } else if (gitMatch) {
      const [, baseUrl, repoDir, fileDir] = gitMatch;
      url = baseUrl.replace(/git@/, 'https://') + '/' + repoDir.replace(/.git/, '');
      if (fileDir) {
        url += `/tree/${branchName}/${fileDir}`;
      }
    }
    return url;
  }

  static getNotebookRevisionId(tags: any) {
    const revisionIdTag = 'mlflow.databricks.notebookRevisionID';
    return tags && tags[revisionIdTag] && tags[revisionIdTag].value;
  }

  static getNotebookId(tags: any) {
    const notebookIdTag = 'mlflow.databricks.notebookID';
    return tags && tags[notebookIdTag] && tags[notebookIdTag].value;
  }

  /**
   * Check if the given workspaceId matches the current workspaceId.
   * @param workspaceId
   * @returns {boolean}
   */
  static isCurrentWorkspace(workspaceId: any) {
    return true;
  }

  static getDefaultNotebookRevisionName(notebookId: any, revisionId: any, workspaceId = null) {
    if (!notebookId) {
      return '-';
    }
    let name = `notebook ${notebookId}`;
    if (revisionId) {
      name = `revision ${revisionId} of ` + name;
    }
    if (workspaceId) {
      name = `workspace ${workspaceId}: ` + name;
    }
    return name;
  }

  /**
   * Makes sure that the URL begins with correct scheme according
   * to RFC3986 [https://datatracker.ietf.org/doc/html/rfc3986#section-3.1]
   * It does not support slash-less schemes (e.g. news:abc, urn:anc).
   * @param url URL string like "my-mlflow-server.com/#/experiments/9" or
   *        "https://my-mlflow-server.com/#/experiments/9"
   * @param defaultScheme scheme to add if missing in the provided URL, defaults to "https"
   * @returns {string} the URL string with ensured default scheme
   */
  static ensureUrlScheme(url: any, defaultScheme = 'https') {
    // Falsy values should yield itself
    if (!url) return url;

    // Scheme-less URL with colon and dashes
    if (url.match(/^:\/\//i)) {
      return `${defaultScheme}${url}`;
    }

    // URL without scheme, colon nor dashes
    if (!url.match(/^[a-z1-9+-.]+:\/\//i)) {
      return `${defaultScheme}://${url}`;
    }

    // Pass-through for "correct" entries
    return url;
  }

  /**
   * Returns a copy of the provided URL with its query parameters set to `queryParams`.
   * @param url URL string like "http://my-mlflow-server.com/#/experiments/9.
   * @param queryParams Optional query parameter string like "?param=12345". Query params provided
   *        via this string will override existing query param values in `url`
   */
  static setQueryParams(url: any, queryParams: any) {
    // Using new URL() is the preferred way of constructing the URL object,
    // however according to [https://url.spec.whatwg.org/#constructors] it requires
    // providing the protocol. We're gracefully ensuring that the scheme exists here.
    const urlObj = new URL(MlflowUtils.ensureUrlScheme(url));
    urlObj.search = queryParams || '';
    return urlObj.toString();
  }

  /**
   * Returns the URL for the notebook source.
   */
  static getNotebookSourceUrl(queryParams: any, notebookId: any, revisionId: any, runUuid: any, workspaceUrl = null) {
    let url = MlflowUtils.setQueryParams(workspaceUrl || window.location.origin, queryParams);
    url += `#notebook/${notebookId}`;
    if (revisionId) {
      url += `/revision/${revisionId}`;
      if (runUuid) {
        url += `/mlflow/run/${runUuid}`;
      }
    }
    return url;
  }

  /**
   * Renders the notebook source name and entry point into an HTML element. Used for display.
   */
  static renderNotebookSource(
    queryParams: any,
    notebookId: any,
    revisionId: any,
    runUuid: any,
    sourceName: any,
    workspaceUrl = null,
    nameOverride: string | null = null,
  ) {
    // sourceName may not be present when rendering feature table notebook consumers from remote
    // workspaces or when notebook fetcher failed to fetch the sourceName. Always provide a default
    // notebook name in such case.
    const baseName = sourceName
      ? MlflowUtils.baseName(sourceName)
      : MlflowUtils.getDefaultNotebookRevisionName(notebookId, revisionId);
    const name = nameOverride || baseName;

    if (notebookId) {
      const url = MlflowUtils.getNotebookSourceUrl(queryParams, notebookId, revisionId, runUuid, workspaceUrl);
      return (
        <a
          title={sourceName || MlflowUtils.getDefaultNotebookRevisionName(notebookId, revisionId)}
          href={url}
          target="_top"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {name}
        </a>
      );
    } else {
      return name;
    }
  }

  /**
   * Set query params and returns the updated query params.
   * @returns {string} updated query params
   */
  static addQueryParams(currentQueryParams: any, newQueryParams: any) {
    if (!newQueryParams || Object.keys(newQueryParams).length === 0) {
      return currentQueryParams;
    }
    const urlSearchParams = new URLSearchParams(currentQueryParams);
    Object.entries(newQueryParams).forEach(
      // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
      ([key, value]) => Boolean(key) && Boolean(value) && urlSearchParams.set(key, value),
    );
    const queryParams = urlSearchParams.toString();
    if (queryParams !== '' && !queryParams.includes('?')) {
      return `?${queryParams}`;
    }
    return queryParams;
  }

  /**
   * Returns the URL for the job source.
   */
  static getJobSourceUrl(queryParams: any, jobId: any, jobRunId: any, workspaceUrl = null) {
    let url = MlflowUtils.setQueryParams(workspaceUrl || window.location.origin, queryParams);
    url += `#job/${jobId}`;
    if (jobRunId) {
      url += `/run/${jobRunId}`;
    }
    return url;
  }

  /**
   * Renders the job source name and entry point into an HTML element. Used for display.
   */
  static renderJobSource(
    queryParams: any,
    jobId: any,
    jobRunId: any,
    jobName: any,
    workspaceUrl = null,
    nameOverride: string | null = null,
  ) {
    // jobName may not be present when rendering feature table job consumers from remote
    // workspaces or when getJob API failed to fetch the jobName. Always provide a default
    // job name in such case.
    const reformatJobName = jobName || MlflowUtils.getDefaultJobRunName(jobId, jobRunId);
    const name = nameOverride || reformatJobName;

    if (jobId) {
      const url = MlflowUtils.getJobSourceUrl(queryParams, jobId, jobRunId, workspaceUrl);
      return (
        <a
          title={reformatJobName}
          href={url}
          target="_top"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {name}
        </a>
      );
    } else {
      return name;
    }
  }

  /**
   * Renders the source name and entry point into an HTML element. Used for display.
   * @param tags Object containing tag key value pairs.
   * @param queryParams Query params to add to certain source type links.
   * @param runUuid ID of the MLflow run to add to certain source (revision) links.
   */
  static renderSource(tags: any, queryParams: any, runUuid: any, branchName = 'master') {
    const sourceName = MlflowUtils.getSourceName(tags);
    let res = MlflowUtils.formatSource(tags);
    const gitRepoUrlOrNull = MlflowUtils.getGitRepoUrl(sourceName, branchName);
    if (gitRepoUrlOrNull) {
      res = (
        <a
          target="_top"
          href={gitRepoUrlOrNull}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {res}
        </a>
      );
    }
    const sourceType = MlflowUtils.getSourceType(tags);
    if (sourceType === 'NOTEBOOK') {
      const revisionId = MlflowUtils.getNotebookRevisionId(tags);
      const notebookId = MlflowUtils.getNotebookId(tags);
      const workspaceIdTag = 'mlflow.databricks.workspaceID';
      const workspaceId = tags && tags[workspaceIdTag] && tags[workspaceIdTag].value;
      if (MlflowUtils.isCurrentWorkspace(workspaceId)) {
        return MlflowUtils.renderNotebookSource(queryParams, notebookId, revisionId, runUuid, sourceName, null);
      } else {
        const workspaceUrlTag = 'mlflow.databricks.workspaceURL';
        const workspaceUrl = tags && tags[workspaceUrlTag] && tags[workspaceUrlTag].value;
        const notebookQueryParams = MlflowUtils.addQueryParams(queryParams, { o: workspaceId });
        return MlflowUtils.renderNotebookSource(
          notebookQueryParams,
          notebookId,
          revisionId,
          runUuid,
          sourceName,
          workspaceUrl,
        );
      }
    }
    if (sourceType === 'JOB') {
      const jobIdTag = 'mlflow.databricks.jobID';
      const jobRunIdTag = 'mlflow.databricks.jobRunID';
      const jobId = tags && tags[jobIdTag] && tags[jobIdTag].value;
      const jobRunId = tags && tags[jobRunIdTag] && tags[jobRunIdTag].value;
      const workspaceIdTag = 'mlflow.databricks.workspaceID';
      const workspaceId = tags && tags[workspaceIdTag] && tags[workspaceIdTag].value;
      if (MlflowUtils.isCurrentWorkspace(workspaceId)) {
        return MlflowUtils.renderJobSource(queryParams, jobId, jobRunId, res, null);
      } else {
        const workspaceUrlTag = 'mlflow.databricks.workspaceURL';
        const workspaceUrl = tags && tags[workspaceUrlTag] && tags[workspaceUrlTag].value;
        const jobQueryParams = MlflowUtils.addQueryParams(queryParams, { o: workspaceId });
        return MlflowUtils.renderJobSource(jobQueryParams, jobId, jobRunId, res, workspaceUrl);
      }
    }
    return res;
  }

  static renderSourceFromMetadata(traceInfoV3: ModelTraceInfoV3) {
    const sourceName = traceInfoV3.trace_metadata?.[MlflowUtils.sourceNameTag];
    const sourceType = traceInfoV3.trace_metadata?.[MlflowUtils.sourceTypeTag];
    let res = sourceName ? MlflowUtils.baseName(sourceName) : '';

    // Handle git repository links using explicit git metadata
    const gitRepoUrl = traceInfoV3.trace_metadata?.['mlflow.source.git.repoURL'];
    const gitBranch = traceInfoV3.trace_metadata?.['mlflow.source.git.branch'];
    const gitCommit = traceInfoV3.trace_metadata?.['mlflow.source.git.commit'];

    if (gitRepoUrl) {
      // Convert SSH URL to HTTPS if needed
      const httpsUrl = gitRepoUrl
        .replace('git@github.com:', 'https://github.com/')
        .replace('git@gitlab.com:', 'https://gitlab.com/')
        .replace('git@bitbucket.org:', 'https://bitbucket.org/')
        .replace('.git', '');

      // Use commit hash if available, otherwise use branch
      const ref = gitCommit || gitBranch || 'master';
      const filePath = sourceName ? `/${sourceName}` : '';

      // Construct URL based on the git host
      let url = httpsUrl;
      if (httpsUrl.includes('github.com')) {
        url = `${httpsUrl}/tree/${ref}${filePath}`;
      } else if (httpsUrl.includes('gitlab.com')) {
        url = `${httpsUrl}/-/tree/${ref}${filePath}`;
      } else if (httpsUrl.includes('bitbucket.org')) {
        url = `${httpsUrl}/src/${ref}${filePath}`;
      } else {
        // For other git hosts, just append the ref and file path
        url = `${httpsUrl}/tree/${ref}${filePath}`;
      }

      res = (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={url}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {res}
        </a>
      );
    }

    if (sourceType === 'NOTEBOOK') {
      const revisionId = traceInfoV3.trace_metadata?.['mlflow.databricks.notebookRevisionID'];
      const notebookId = traceInfoV3.trace_metadata?.['mlflow.databricks.notebookID'];
      const workspaceId = traceInfoV3.trace_metadata?.['mlflow.databricks.workspaceID'];

      if (MlflowUtils.isCurrentWorkspace(workspaceId)) {
        return MlflowUtils.renderNotebookSource(null, notebookId, revisionId, null, sourceName, null);
      } else {
        const workspaceUrlTag = 'mlflow.databricks.workspaceURL';
        const workspaceUrl: any = traceInfoV3.trace_metadata?.[workspaceUrlTag] || undefined;
        const notebookQueryParams = MlflowUtils.addQueryParams(null, { o: workspaceId });
        return MlflowUtils.renderNotebookSource(
          notebookQueryParams,
          notebookId,
          revisionId,
          null,
          sourceName,
          workspaceUrl,
        );
      }
    }

    if (sourceType === 'JOB') {
      const jobId = traceInfoV3.trace_metadata?.['mlflow.databricks.jobID'];
      const jobRunId = traceInfoV3.trace_metadata?.['mlflow.databricks.jobRunID'];
      const workspaceId = traceInfoV3.trace_metadata?.['mlflow.databricks.workspaceID'];

      if (MlflowUtils.isCurrentWorkspace(workspaceId)) {
        return MlflowUtils.renderJobSource(null, jobId, jobRunId, res, null);
      } else {
        const workspaceUrlTag = 'mlflow.databricks.workspaceURL';
        const workspaceUrl: any = traceInfoV3.trace_metadata?.[workspaceUrlTag] || undefined;
        const jobQueryParams = MlflowUtils.addQueryParams(null, { o: workspaceId });
        return MlflowUtils.renderJobSource(jobQueryParams, jobId, jobRunId, res, workspaceUrl);
      }
    }

    return res;
  }

  static formatDuration(duration: any) {
    if (duration < 500) {
      return duration + 'ms';
    } else if (duration < 1000 * 60) {
      return (duration / 1000).toFixed(1) + 's';
    } else if (duration < 1000 * 60 * 60) {
      return (duration / 1000 / 60).toFixed(1) + 'min';
    } else if (duration < 1000 * 60 * 60 * 24) {
      return (duration / 1000 / 60 / 60).toFixed(1) + 'h';
    } else {
      return (duration / 1000 / 60 / 60 / 24).toFixed(1) + 'd';
    }
  }

  static formatTimestamp(timestamp: any, intl?: IntlShape) {
    const d = new Date(0);
    d.setUTCMilliseconds(timestamp);

    if (intl) {
      return intl.formatDate(d, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
    return moment(d).format('YYYY-MM-DD HH:mm:ss');
  }
}

export default MlflowUtils;
```

--------------------------------------------------------------------------------

---[FILE: RoutingTestUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/RoutingTestUtils.tsx
Signals: React

```typescript
import React from 'react';
import type { ComponentProps } from 'react';

import { MemoryRouter, Route, Routes } from './RoutingUtils';

/**
 * A dummy router to be used in jest tests. Usage:
 *
 * @example
 * ```ts
 *  import { testRoute, TestRouter } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
 *  import { setupTestRouter, waitForRoutesToBeRendered } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
 *
 *  describe('ComponentUnderTest', () => {
 *    it('renders', async () => {
 *      render(<Router history={history} routes={[testRoute(<ComponentUnderTest props={...}/>)]}/>);
 *
 *      expect(...);
 *    });
 *  });
 * ```
 *
 */
export const TestRouter = ({ routes, history, initialEntries }: TestRouterProps) => {
  return (
    <MemoryRouter initialEntries={initialEntries ?? ['/']}>
      <Routes>
        {routes.map(({ element, path = '*', pageId }: any) => (
          <Route element={element} key={pageId || path} path={path} />
        ))}
      </Routes>
    </MemoryRouter>
  );
};

type TestRouteReturnValue = {
  element: React.ReactElement;
  path?: string;
  pageId?: string;
};
interface TestRouterProps {
  routes: TestRouteReturnValue[];
  history?: any;
  initialEntries?: string[];
}

export const testRoute = (element: React.ReactNode, path = '*', pageId = ''): TestRouteReturnValue => {
  return { element, path, pageId } as any;
};

export const setupTestRouter = () => ({ history: {} });
export const waitForRoutesToBeRendered = async () => {
  return Promise.resolve();
};
```

--------------------------------------------------------------------------------

---[FILE: RoutingUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/RoutingUtils.tsx
Signals: React

```typescript
/**
 * This file re-exports the appropriate package for routing based on the environment.
 *
 * Duplicate of mlflow/server/js/src/common/utils/RoutingUtils.tsx, because unfortunately
 * this package is located in web-shared and we can't directly access it from here.
 */
/* eslint-disable no-restricted-imports */
import React from 'react';
/**
 * Import React Router V6 parts
 */
import {
  BrowserRouter,
  MemoryRouter,
  HashRouter,
  matchPath,
  generatePath,
  Navigate,
  Route,
  Outlet as OutletDirect,
  Link as LinkDirect,
  useNavigate as useNavigateDirect,
  useLocation as useLocationDirect,
  useParams as useParamsDirect,
  useSearchParams as useSearchParamsDirect,
  createHashRouter,
  RouterProvider,
  Routes,
  type To,
  type NavigateOptions,
  type Location,
  type NavigateFunction,
  type Params,
} from 'react-router-dom';

const useLocation = useLocationDirect;

const useSearchParams = useSearchParamsDirect;

const useParams = useParamsDirect;

const useNavigate = useNavigateDirect;

const Outlet = OutletDirect;

const Link = LinkDirect;

export {
  // React Router V6 API exports
  BrowserRouter,
  MemoryRouter,
  HashRouter,
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  generatePath,
  matchPath,
  Navigate,
  Route,
  Routes,
  Outlet,

  // Exports used to build hash-based data router
  createHashRouter,
  RouterProvider,
};

export const createLazyRouteElement = (
  // Load the module's default export and turn it into React Element
  componentLoader: () => Promise<{ default: React.ComponentType<React.PropsWithChildren<any>> }>,
) => React.createElement(React.lazy(componentLoader));
export const createRouteElement = (component: React.ComponentType<React.PropsWithChildren<any>>) =>
  React.createElement(component);

export type { Location, NavigateFunction, Params, To, NavigateOptions };
```

--------------------------------------------------------------------------------

---[FILE: TraceLocationUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/TraceLocationUtils.ts

```typescript
import {
  type ModelTraceLocationMlflowExperiment,
  type ModelTraceLocationUcSchema,
  isV3ModelTraceInfo,
  type ModelTrace,
} from '../../model-trace-explorer';

/**
 * Helper utility: creates experiment trace location descriptor based on provided experiment ID.
 */
export const createTraceLocationForExperiment = (experimentId: string): ModelTraceLocationMlflowExperiment => ({
  type: 'MLFLOW_EXPERIMENT',
  mlflow_experiment: {
    experiment_id: experimentId,
  },
});

export const createTraceLocationForUCSchema = (ucSchemaFullPath: string): ModelTraceLocationUcSchema => {
  const [catalog_name, schema_name] = ucSchemaFullPath.split('.');
  return {
    type: 'UC_SCHEMA',
    uc_schema: {
      catalog_name,
      schema_name,
    },
  };
};

/**
 * Determines if a trace (by provided info object) supports being queried using V4 API.
 * For now, only UC_SCHEMA-located traces are supported.
 */
export const doesTraceSupportV4API = (traceInfo?: ModelTrace['info']) => {
  return Boolean(traceInfo && isV3ModelTraceInfo(traceInfo) && traceInfo.trace_location?.type === 'UC_SCHEMA');
};
```

--------------------------------------------------------------------------------

````

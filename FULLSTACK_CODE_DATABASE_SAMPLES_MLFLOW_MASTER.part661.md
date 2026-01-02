---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 661
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 661 of 991)

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

---[FILE: TelemetryInfoAlert.tsx]---
Location: mlflow-master/mlflow/server/js/src/telemetry/TelemetryInfoAlert.tsx

```typescript
import {
  TELEMETRY_INFO_ALERT_DISMISSED_STORAGE_KEY,
  TELEMETRY_INFO_ALERT_DISMISSED_STORAGE_VERSION,
} from '../telemetry/utils';
import { useLocalStorage } from '../shared/web-shared/hooks';
import { Alert, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { Link } from '../common/utils/RoutingUtils';

export const TelemetryInfoAlert = () => {
  const { theme } = useDesignSystemTheme();

  const [isTelemetryAlertDismissed, setIsTelemetryAlertDismissed] = useLocalStorage({
    key: TELEMETRY_INFO_ALERT_DISMISSED_STORAGE_KEY,
    version: TELEMETRY_INFO_ALERT_DISMISSED_STORAGE_VERSION,
    initialValue: false,
  });

  if (isTelemetryAlertDismissed) {
    return null;
  }

  return (
    <Alert
      componentId="mlflow.home.telemetry-alert"
      message="Information about UI telemetry"
      type="info"
      onClose={() => setIsTelemetryAlertDismissed(true)}
      description={
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          <span>
            <FormattedMessage
              defaultMessage="MLflow collects usage data to improve the product. To confirm your preferences, please visit the settings page in the navigation sidebar. To learn more about what data is collected, please visit the <documentation>documentation</documentation>."
              description="Telemetry alert description"
              values={{
                documentation: (chunks: any) => (
                  <Link
                    to="https://mlflow.org/docs/latest/community/usage-tracking.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </Link>
                ),
              }}
            />
          </span>
        </div>
      }
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/telemetry/types.ts

```typescript
import type {
  DesignSystemEventProviderComponentTypes,
  DesignSystemEventProviderAnalyticsEventTypes,
} from '@databricks/design-system';

export interface DesignSystemObservabilityEvent {
  componentId: string;
  componentViewId: string;
  componentType: DesignSystemEventProviderComponentTypes;
  componentSubType?: string | null;
  eventType: DesignSystemEventProviderAnalyticsEventTypes;
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: mlflow-master/mlflow/server/js/src/telemetry/utils.ts

```typescript
import { has, isObject } from 'lodash';
import { DesignSystemObservabilityEvent } from './types';

export const TELEMETRY_ENABLED_STORAGE_VERSION = 1;

export const TELEMETRY_ENABLED_STORAGE_KEY = 'mlflow.settings.telemetry.enabled';

export const TELEMETRY_INFO_ALERT_DISMISSED_STORAGE_KEY = 'mlflow.telemetry.info.alert.dismissed';

export const TELEMETRY_INFO_ALERT_DISMISSED_STORAGE_VERSION = 1;

export const isDesignSystemEvent = (event: any): event is DesignSystemObservabilityEvent => {
  if (!event || !isObject(event) || Array.isArray(event)) {
    return false;
  }

  return (
    has(event, 'componentId') &&
    typeof event.componentId === 'string' &&
    has(event, 'componentType') &&
    typeof event.componentType === 'string' &&
    has(event, 'componentViewId') &&
    typeof event.componentViewId === 'string' &&
    has(event, 'eventType') &&
    typeof event.eventType === 'string'
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useLogTelemetryEvent.tsx]---
Location: mlflow-master/mlflow/server/js/src/telemetry/hooks/useLogTelemetryEvent.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import { DesignSystemObservabilityEvent } from '../types';
import { telemetryClient } from '../TelemetryClient';

export const useLogTelemetryEvent = () => {
  const logTelemetryEvent = useCallback((event: DesignSystemObservabilityEvent) => {
    telemetryClient.logEvent(event);
  }, []);

  return logTelemetryEvent;
};
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: mlflow-master/mlflow/server/js/src/telemetry/worker/constants.ts

```typescript
/**
 * API endpoint for telemetry. We don't use an absolute URL because it breaks
 * reverse-proxy setups (e.g. someone deploys mlflow at www.example.com/mlflow).
 * Instead, we use a relative URL that goes up one level, since the worker JS file
 * is served from the static files directory under the root.
 */
// eslint-disable-next-line mlflow/no-absolute-ajax-urls
export const UI_TELEMETRY_ENDPOINT = '../ajax-api/3.0/mlflow/ui-telemetry';
```

--------------------------------------------------------------------------------

---[FILE: LogQueue.ts]---
Location: mlflow-master/mlflow/server/js/src/telemetry/worker/LogQueue.ts

```typescript
/**
 * LogQueue for batching and uploading telemetry events
 *
 * Maintains a queue of telemetry records and flushes them every 15 seconds
 * by batching and uploading to the telemetry endpoint.
 */

import { UI_TELEMETRY_ENDPOINT } from './constants';
import { type TelemetryRecord } from './types';

const FLUSH_INTERVAL_MS = 30000; // 30 seconds

export class LogQueue {
  private queue: TelemetryRecord[] = [];
  private flushTimer: number | null = null;

  constructor() {
    this.startFlushTimer();
  }

  public enqueue(record: TelemetryRecord): void {
    // if the queue has been destroyed, don't enqueue any more records
    if (this.flushTimer === null) {
      return;
    }
    this.queue.push(record);
  }

  private startFlushTimer(): void {
    if (this.flushTimer !== null) {
      return; // Loop already running
    }
    this.scheduleNextFlush();
  }

  private scheduleNextFlush(): void {
    // eslint-disable-next-line no-restricted-globals
    this.flushTimer = self.setTimeout(() => {
      this.flush();
      this.scheduleNextFlush(); // Continue the loop
    }, FLUSH_INTERVAL_MS) as unknown as number;
  }

  private stopFlushTimer(): void {
    if (this.flushTimer !== null) {
      // eslint-disable-next-line no-restricted-globals
      self.clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    this.flush();
  }

  /**
   * Flush the queue by batching and uploading logs to the server. Re-queues
   * failed records.
   */
  public async flush(): Promise<void> {
    if (this.queue.length === 0 || !navigator.onLine) {
      return;
    }

    const records = [...this.queue];
    this.queue = [];

    try {
      // Send batch to server
      const response = await fetch(UI_TELEMETRY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records }),
      });

      if (!response.ok) {
        console.error(`[LogQueue] Failed to upload batch: ${response.status}`);
        this.queue.unshift(...records);
        return;
      }

      const responseJson = await response.json();
      if (responseJson.status === 'disabled') {
        this.destroy();
      }
    } catch (error) {
      console.error('[LogQueue] Error uploading batch:', error);
      this.queue.unshift(...records);
    }
  }

  public clear(): void {
    this.queue = [];
  }

  public destroy(): void {
    this.stopFlushTimer();
    this.queue = [];
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TelemetryLogger.worker.ts]---
Location: mlflow-master/mlflow/server/js/src/telemetry/worker/TelemetryLogger.worker.ts

```typescript
import {
  WorkerToClientMessageType,
  type TelemetryRecord,
  type TelemetryConfig,
  ClientToWorkerMessageType,
} from './types';
import { UI_TELEMETRY_ENDPOINT } from './constants';
import { LogQueue } from './LogQueue';

// eslint-disable-next-line no-restricted-globals
const scope = self as any as SharedWorkerGlobalScope;

async function fetchConfig(): Promise<TelemetryConfig | null> {
  try {
    const response = await fetch(UI_TELEMETRY_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[TelemetryWorker] Failed to fetch config:', error);
    return null;
  }
}

class TelemetryLogger {
  private config: Promise<TelemetryConfig | null> = fetchConfig();
  private sessionId = crypto.randomUUID();
  private logQueue: LogQueue = new LogQueue();
  private samplingValue: number = Math.random() * 100;

  public async addLogToQueue(record: Omit<TelemetryRecord, 'session_id'>): Promise<void> {
    const config = await this.config;

    if (!config || (config.disable_ui_telemetry ?? true)) {
      return;
    }

    // check if the sampling value is less than the rollout percentage
    const isEnabled = this.samplingValue < (config.ui_rollout_percentage ?? 0);
    if (!isEnabled) {
      return;
    }

    const isIgnored = config.disable_ui_events?.includes(record.params?.['componentId'] ?? '');
    if (isIgnored) {
      return;
    }

    this.logQueue.enqueue({ ...record, session_id: this.sessionId });
  }

  public destroy(): void {
    this.logQueue.destroy();
  }
}

const logger = new TelemetryLogger();

function handleMessage(event: MessageEvent): void {
  const message = event.data;

  switch (message.type) {
    case ClientToWorkerMessageType.LOG_EVENT:
      logger.addLogToQueue(message.payload as TelemetryRecord).catch((error) => {
        console.error('[TelemetryWorker] Error logging event:', error);
      });
      break;
    case ClientToWorkerMessageType.SHUTDOWN:
      logger.destroy();
      scope.close();
      break;
  }
}

scope.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  port.onmessage = handleMessage;
  // client only starts sending logs after receiving the READY message
  port.postMessage({ type: WorkerToClientMessageType.READY });
};
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/telemetry/worker/types.ts

```typescript
export enum WorkerToClientMessageType {
  READY = 'READY',
}

export enum ClientToWorkerMessageType {
  LOG_EVENT = 'LOG_EVENT',
  SHUTDOWN = 'SHUTDOWN',
}

export interface TelemetryRecord {
  installation_id: string;
  session_id: string;
  event_name: string;
  timestamp_ns: number;
  params?: Record<string, string | null | undefined>;
  status?: string;
  duration_ms?: number;
}

export interface TelemetryConfig {
  disable_ui_events?: string[];
  disable_ui_telemetry?: boolean;
  ui_rollout_percentage?: number;
}

export interface TelemetryConfigResponse {
  config: TelemetryConfig | null;
}

export interface TelemetryMessage {
  type: ClientToWorkerMessageType;
  payload?: unknown;
  requestId?: string;
}
```

--------------------------------------------------------------------------------

---[FILE: @floating-ui-dom-0.5.4.diff]---
Location: mlflow-master/mlflow/server/js/yarn/patches/@floating-ui-dom-0.5.4.diff

```text
diff --git a/dist/floating-ui.dom.umd.js b/dist/floating-ui.dom.umd.js
index 32ad1612f1f5eacab392faabf37b98cff25da2af..a0ab25d978958cf4b8878916e03b1c3a84e84fd0 100644
--- a/dist/floating-ui.dom.umd.js
+++ b/dist/floating-ui.dom.umd.js
@@ -130,6 +130,9 @@
   }
 
   function getDocumentElement(node) {
+    if (process.env.NODE_ENV === 'test') {
+      return ((isNode(node) ? node.ownerDocument : node.document) || window.document)?.documentElement;
+    }
     return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
   }
 
diff --git a/dist/floating-ui.dom.esm.js b/dist/floating-ui.dom.esm.js
--- a/dist/floating-ui.dom.esm.js
+++ b/dist/floating-ui.dom.esm.js
@@ -127,5 +127,8 @@
 }
 
 function getDocumentElement(node) {
+  if (process.env.NODE_ENV === 'test') {
+    return ((isNode(node) ? node.ownerDocument : node.document) || window.document)?.documentElement;
+  }
   return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
 }
```

--------------------------------------------------------------------------------

---[FILE: rc-virtual-list-npm-3.2.0-5efaefc12e.patch]---
Location: mlflow-master/mlflow/server/js/yarn/patches/rc-virtual-list-npm-3.2.0-5efaefc12e.patch

```text
diff --git a/es/hooks/useScrollTo.js b/es/hooks/useScrollTo.js
index ce26ac996d809ed9869f8a8a5cca4913aba1100c..29e9522ad8b6c1c8aabb366ac7c49142b614f5cb 100644
--- a/es/hooks/useScrollTo.js
+++ b/es/hooks/useScrollTo.js
@@ -22,7 +22,7 @@ export default function useScrollTo(containerRef, data, heights, itemHeight, get
       var align = arg.align;
 
       if ('index' in arg) {
-        index = arg.index;
+        index = Math.min(arg.index, data.length - 1);
       } else {
         index = data.findIndex(function (item) {
           return getKey(item) === arg.key;
@@ -46,7 +46,11 @@ export default function useScrollTo(containerRef, data, heights, itemHeight, get
           var itemBottom = 0;
 
           for (var i = 0; i <= index; i += 1) {
-            var key = getKey(data[i]);
+            var el = data[i];
+            if (el === undefined) {
+              continue;
+	    }
+            var key = getKey(el);
             itemTop = stackTop;
             var cacheHeight = heights.get(key);
             itemBottom = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);
diff --git a/lib/hooks/useScrollTo.js b/lib/hooks/useScrollTo.js
index 09a013fdaa4c8f83ce0bf1f9c2f841e7994f82db..6016006354267f242550a6e21954a5c427c9ffa4 100644
--- a/lib/hooks/useScrollTo.js
+++ b/lib/hooks/useScrollTo.js
@@ -36,7 +36,7 @@ function useScrollTo(containerRef, data, heights, itemHeight, getKey, collectHei
       var align = arg.align;
 
       if ('index' in arg) {
-        index = arg.index;
+        index = Math.min(arg.index, data.length - 1);
       } else {
         index = data.findIndex(function (item) {
           return getKey(item) === arg.key;
@@ -60,7 +60,11 @@ function useScrollTo(containerRef, data, heights, itemHeight, getKey, collectHei
           var itemBottom = 0;
 
           for (var i = 0; i <= index; i += 1) {
-            var key = getKey(data[i]);
+            var el = data[i];
+            if (el === undefined) {
+              continue;
+            }
+            var key = getKey(el);
             itemTop = stackTop;
             var cacheHeight = heights.get(key);
             itemBottom = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/shap/__init__.py

```python
import os
import tempfile
import types
import warnings
from contextlib import contextmanager
from typing import Any

import numpy as np
import yaml

import mlflow
import mlflow.utils.autologging_utils
from mlflow import pyfunc
from mlflow.models import Model, ModelInputExample, ModelSignature
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.models.utils import _save_example
from mlflow.tracking._model_registry import DEFAULT_AWAIT_MAX_SLEEP_SECONDS
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.docstring_utils import LOG_MODEL_PARAM_DOCS, format_docstring
from mlflow.utils.environment import (
    _CONDA_ENV_FILE_NAME,
    _CONSTRAINTS_FILE_NAME,
    _PYTHON_ENV_FILE_NAME,
    _REQUIREMENTS_FILE_NAME,
    _get_pip_deps,
    _mlflow_conda_env,
    _process_conda_env,
    _process_pip_requirements,
    _PythonEnv,
    _validate_env_arguments,
)
from mlflow.utils.file_utils import write_to
from mlflow.utils.model_utils import (
    _add_code_from_conf_to_system_path,
    _get_flavor_configuration,
    _validate_and_copy_code_paths,
    _validate_and_prepare_target_save_path,
)
from mlflow.utils.requirements_utils import _get_package_name
from mlflow.utils.uri import append_to_uri_path

FLAVOR_NAME = "shap"

_MAXIMUM_BACKGROUND_DATA_SIZE = 100
_DEFAULT_ARTIFACT_PATH = "model_explanations_shap"
_SUMMARY_BAR_PLOT_FILE_NAME = "summary_bar_plot.png"
_BASE_VALUES_FILE_NAME = "base_values.npy"
_SHAP_VALUES_FILE_NAME = "shap_values.npy"
_UNKNOWN_MODEL_FLAVOR = "unknown"
_UNDERLYING_MODEL_SUBPATH = "underlying_model"


def get_underlying_model_flavor(model):
    """
    Find the underlying models flavor.

    Args:
        model: underlying model of the explainer.
    """

    # checking if underlying model is wrapped

    if hasattr(model, "inner_model"):
        unwrapped_model = model.inner_model

        # check if passed model is a method of object
        if isinstance(unwrapped_model, types.MethodType):
            model_object = unwrapped_model.__self__

            # check if model object is of type sklearn
            try:
                import sklearn

                if issubclass(type(model_object), sklearn.base.BaseEstimator):
                    return mlflow.sklearn.FLAVOR_NAME
            except ImportError:
                pass

        # check if passed model is of type pytorch
        try:
            import torch

            if issubclass(type(unwrapped_model), torch.nn.Module):
                return mlflow.pytorch.FLAVOR_NAME
        except ImportError:
            pass

    return _UNKNOWN_MODEL_FLAVOR


def get_default_pip_requirements():
    """
    A list of default pip requirements for MLflow Models produced by this flavor. Calls to
    :func:`save_explainer()` and :func:`log_explainer()` produce a pip environment that, at
    minimum, contains these requirements.
    """
    import shap

    return [f"shap=={shap.__version__}"]


def get_default_conda_env():
    """
    Returns:
        The default Conda environment for MLflow Models produced by calls to
        :func:`save_explainer()` and :func:`log_explainer()`.
    """
    return _mlflow_conda_env(additional_pip_deps=get_default_pip_requirements())


def _load_pyfunc(path):
    """
    Load PyFunc implementation. Called by ``pyfunc.load_model``.
    """
    return _SHAPWrapper(path)


@contextmanager
def _log_artifact_contextmanager(out_file, artifact_path=None):
    """
    A context manager to make it easier to log an artifact.
    """
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = os.path.join(tmp_dir, out_file)
        yield tmp_path
        mlflow.log_artifact(tmp_path, artifact_path)


def _log_numpy(numpy_obj, out_file, artifact_path=None):
    """
    Log a numpy object.
    """
    with _log_artifact_contextmanager(out_file, artifact_path) as tmp_path:
        np.save(tmp_path, numpy_obj)


def _log_matplotlib_figure(fig, out_file, artifact_path=None):
    """
    Log a matplotlib figure.
    """
    with _log_artifact_contextmanager(out_file, artifact_path) as tmp_path:
        fig.savefig(tmp_path)


def _get_conda_env_for_underlying_model(underlying_model_path):
    underlying_model_conda_path = os.path.join(underlying_model_path, "conda.yaml")
    with open(underlying_model_conda_path) as underlying_model_conda_file:
        return yaml.safe_load(underlying_model_conda_file)


def log_explanation(predict_function, features, artifact_path=None):
    r"""
    Given a ``predict_function`` capable of computing ML model output on the provided ``features``,
    computes and logs explanations of an ML model's output. Explanations are logged as a directory
    of artifacts containing the following items generated by `SHAP`_ (SHapley Additive
    exPlanations).

        - Base values
        - SHAP values (computed using `shap.KernelExplainer`_)
        - Summary bar plot (shows the average impact of each feature on model output)

    Args:
        predict_function:
            A function to compute the output of a model (e.g. ``predict_proba`` method of
            scikit-learn classifiers). Must have the following signature:

            .. code-block:: python

                def predict_function(X) -> pred: ...

            - ``X``: An array-like object whose shape should be (# samples, # features).
            - ``pred``: An array-like object whose shape should be (# samples) for a regressor or
              (# classes, # samples) for a classifier. For a classifier, the values in ``pred``
              should correspond to the predicted probability of each class.

            Acceptable array-like object types:

                - ``numpy.array``
                - ``pandas.DataFrame``
                - ``shap.common.DenseData``
                - ``scipy.sparse matrix``

        features:
            A matrix of features to compute SHAP values with. The provided features should
            have shape (# samples, # features), and can be either of the array-like object
            types listed above.

            .. note::
                Background data for `shap.KernelExplainer`_ is generated by subsampling ``features``
                with `shap.kmeans`_. The background data size is limited to 100 rows for performance
                reasons.

        artifact_path:
            The run-relative artifact path to which the explanation is saved.
            If unspecified, defaults to "model_explanations_shap".

    Returns:
        Artifact URI of the logged explanations.

    .. _SHAP: https://github.com/slundberg/shap

    .. _shap.KernelExplainer: https://shap.readthedocs.io/en/latest/generated
        /shap.KernelExplainer.html#shap.KernelExplainer

    .. _shap.kmeans: https://github.com/slundberg/shap/blob/v0.36.0/shap/utils/_legacy.py#L9

    .. code-block:: python
        :caption: Example

        import os

        import numpy as np
        import pandas as pd
        from sklearn.datasets import load_diabetes
        from sklearn.linear_model import LinearRegression

        import mlflow
        from mlflow import MlflowClient

        # prepare training data
        X, y = dataset = load_diabetes(return_X_y=True, as_frame=True)
        X = pd.DataFrame(dataset.data[:50, :8], columns=dataset.feature_names[:8])
        y = dataset.target[:50]

        # train a model
        model = LinearRegression()
        model.fit(X, y)

        # log an explanation
        with mlflow.start_run() as run:
            mlflow.shap.log_explanation(model.predict, X)

        # list artifacts
        client = MlflowClient()
        artifact_path = "model_explanations_shap"
        artifacts = [x.path for x in client.list_artifacts(run.info.run_id, artifact_path)]
        print("# artifacts:")
        print(artifacts)

        # load back the logged explanation
        dst_path = client.download_artifacts(run.info.run_id, artifact_path)
        base_values = np.load(os.path.join(dst_path, "base_values.npy"))
        shap_values = np.load(os.path.join(dst_path, "shap_values.npy"))

        print("\n# base_values:")
        print(base_values)
        print("\n# shap_values:")
        print(shap_values[:3])

    .. code-block:: text
        :caption: Output

        # artifacts:
        ['model_explanations_shap/base_values.npy',
         'model_explanations_shap/shap_values.npy',
         'model_explanations_shap/summary_bar_plot.png']

        # base_values:
        20.502000000000002

        # shap_values:
        [[ 2.09975523  0.4746513   7.63759026  0.        ]
         [ 2.00883109 -0.18816665 -0.14419184  0.        ]
         [ 2.00891772 -0.18816665 -0.14419184  0.        ]]

    .. figure:: ../_static/images/shap-ui-screenshot.png

        Logged artifacts
    """
    import matplotlib.pyplot as plt
    import shap

    artifact_path = _DEFAULT_ARTIFACT_PATH if artifact_path is None else artifact_path
    with mlflow.utils.autologging_utils.disable_autologging():
        background_data = shap.kmeans(features, min(_MAXIMUM_BACKGROUND_DATA_SIZE, len(features)))
        explainer = shap.KernelExplainer(predict_function, background_data)
        shap_values = explainer.shap_values(features)

        _log_numpy(explainer.expected_value, _BASE_VALUES_FILE_NAME, artifact_path)
        _log_numpy(shap_values, _SHAP_VALUES_FILE_NAME, artifact_path)

        shap.summary_plot(shap_values, features, plot_type="bar", show=False)
        fig = plt.gcf()
        fig.tight_layout()
        _log_matplotlib_figure(fig, _SUMMARY_BAR_PLOT_FILE_NAME, artifact_path)
        plt.close(fig)

    return append_to_uri_path(mlflow.active_run().info.artifact_uri, artifact_path)


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def log_explainer(
    explainer,
    artifact_path: str | None = None,
    serialize_model_using_mlflow=True,
    conda_env=None,
    code_paths=None,
    registered_model_name=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    await_registration_for=DEFAULT_AWAIT_MAX_SLEEP_SECONDS,
    pip_requirements=None,
    extra_pip_requirements=None,
    name: str | None = None,
    metadata=None,
    params: dict[str, Any] | None = None,
    tags: dict[str, Any] | None = None,
    model_type: str | None = None,
    step: int = 0,
    model_id: str | None = None,
):
    """
    Log an SHAP explainer as an MLflow artifact for the current run.

    Args:
        explainer: SHAP explainer to be saved.
        artifact_path: Deprecated. Use `name` instead.
        serialize_model_using_mlflow: When set to True, MLflow will extract the underlying
            model and serialize it as an MLmodel, otherwise it uses SHAP's internal serialization.
            Defaults to True. Currently MLflow serialization is only supported for models of
            'sklearn' or 'pytorch' flavors.
        conda_env: {{ conda_env }}
        code_paths: {{ code_paths }}
        registered_model_name: If given, create a model version under ``registered_model_name``,
            also creating a registered model if one with the given name does not exist.
        signature: :py:class:`ModelSignature <mlflow.models.ModelSignature>` describes model input
            and output :py:class:`Schema <mlflow.types.Schema>`. The model signature can be
            :py:func:`inferred <mlflow.models.infer_signature>` from datasets with valid model input
            (e.g. the training dataset with target column omitted) and valid model output
            (e.g. model predictions generated on the training dataset), for example:

            .. code-block:: python

                from mlflow.models import infer_signature

                train = df.drop_column("target_label")
                predictions = ...  # compute model predictions
                signature = infer_signature(train, predictions)
        input_example: {{ input_example }}
        await_registration_for: Number of seconds to wait for the model version to finish
            being created and is in ``READY`` status. By default, the function waits for five
            minutes. Specify 0 or None to skip waiting.
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        name: {{ name }}
        metadata: {{ metadata }}
        params: {{ params }}
        tags: {{ tags }}
        model_type: {{ model_type }}
        step: {{ step }}
        model_id: {{ model_id }}
    """

    return Model.log(
        artifact_path=artifact_path,
        name=name,
        flavor=mlflow.shap,
        explainer=explainer,
        conda_env=conda_env,
        code_paths=code_paths,
        serialize_model_using_mlflow=serialize_model_using_mlflow,
        registered_model_name=registered_model_name,
        signature=signature,
        input_example=input_example,
        await_registration_for=await_registration_for,
        pip_requirements=pip_requirements,
        extra_pip_requirements=extra_pip_requirements,
        metadata=metadata,
        params=params,
        tags=tags,
        model_type=model_type,
        step=step,
        model_id=model_id,
    )


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def save_explainer(
    explainer,
    path,
    serialize_model_using_mlflow=True,
    conda_env=None,
    code_paths=None,
    mlflow_model=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    pip_requirements=None,
    extra_pip_requirements=None,
    metadata=None,
):
    """
    Save a SHAP explainer to a path on the local file system. Produces an MLflow Model
    containing the following flavors:

        - :py:mod:`mlflow.shap`
        - :py:mod:`mlflow.pyfunc`

    Args:
        explainer: SHAP explainer to be saved.
        path: Local path where the explainer is to be saved.
        serialize_model_using_mlflow: When set to True, MLflow will extract the underlying
            model and serialize it as an MLmodel, otherwise it uses SHAP's internal serialization.
            Defaults to True. Currently MLflow serialization is only supported for models of
            'sklearn' or 'pytorch' flavors.
        conda_env: {{ conda_env }}
        code_paths: {{ code_paths }}
        mlflow_model: :py:mod:`mlflow.models.Model` this flavor is being added to.
        signature: :py:class:`ModelSignature <mlflow.models.ModelSignature>` describes model input
            and output :py:class:`Schema <mlflow.types.Schema>`. The model signature can be
            :py:func:`inferred <mlflow.models.infer_signature>` from datasets with valid model input
            (e.g. the training dataset with target column omitted) and valid model output (e.g.
            model predictions generated on the training dataset), for example:

            .. code-block:: python

                from mlflow.models import infer_signature

                train = df.drop_column("target_label")
                predictions = ...  # compute model predictions
                signature = infer_signature(train, predictions)
        input_example: {{ input_example }}
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata: {{ metadata }}
    """
    import shap

    _validate_env_arguments(conda_env, pip_requirements, extra_pip_requirements)

    _validate_and_prepare_target_save_path(path)
    code_dir_subpath = _validate_and_copy_code_paths(code_paths, path)

    if mlflow_model is None:
        mlflow_model = Model()
    if signature is not None:
        mlflow_model.signature = signature
    if input_example is not None:
        _save_example(mlflow_model, input_example, path)
    if metadata is not None:
        mlflow_model.metadata = metadata

    underlying_model_flavor = None
    underlying_model_path = None
    serializable_by_mlflow = False

    # saving the underlying model if required
    if serialize_model_using_mlflow:
        underlying_model_flavor = get_underlying_model_flavor(explainer.model)

        if underlying_model_flavor != _UNKNOWN_MODEL_FLAVOR:
            serializable_by_mlflow = True  # prevents SHAP from serializing the underlying model
            underlying_model_path = os.path.join(path, _UNDERLYING_MODEL_SUBPATH)
        else:
            warnings.warn(
                "Unable to serialize underlying model using MLflow, will use SHAP serialization"
            )

        if underlying_model_flavor == mlflow.sklearn.FLAVOR_NAME:
            mlflow.sklearn.save_model(explainer.model.inner_model.__self__, underlying_model_path)
        elif underlying_model_flavor == mlflow.pytorch.FLAVOR_NAME:
            mlflow.pytorch.save_model(explainer.model.inner_model, underlying_model_path)

    # saving the explainer object
    explainer_data_subpath = "explainer.shap"
    explainer_output_path = os.path.join(path, explainer_data_subpath)
    with open(explainer_output_path, "wb") as explainer_output_file_handle:
        if serialize_model_using_mlflow and serializable_by_mlflow:
            explainer.save(explainer_output_file_handle, model_saver=False)
        else:
            explainer.save(explainer_output_file_handle)

    pyfunc.add_to_model(
        mlflow_model,
        loader_module="mlflow.shap",
        model_path=explainer_data_subpath,
        underlying_model_flavor=underlying_model_flavor,
        conda_env=_CONDA_ENV_FILE_NAME,
        python_env=_PYTHON_ENV_FILE_NAME,
        code=code_dir_subpath,
    )

    mlflow_model.add_flavor(
        FLAVOR_NAME,
        shap_version=shap.__version__,
        serialized_explainer=explainer_data_subpath,
        underlying_model_flavor=underlying_model_flavor,
        code=code_dir_subpath,
    )

    mlflow_model.save(os.path.join(path, MLMODEL_FILE_NAME))

    if conda_env is None:
        if pip_requirements is None:
            default_reqs = get_default_pip_requirements()
            # To ensure `_load_pyfunc` can successfully load the model during the dependency
            # inference, `mlflow_model.save` must be called beforehand to save an MLmodel file.
            inferred_reqs = mlflow.models.infer_pip_requirements(
                path,
                FLAVOR_NAME,
                fallback=default_reqs,
            )
            default_reqs = sorted(set(inferred_reqs).union(default_reqs))
        else:
            default_reqs = None
        conda_env, pip_requirements, pip_constraints = _process_pip_requirements(
            default_reqs,
            pip_requirements,
            extra_pip_requirements,
        )
    else:
        conda_env, pip_requirements, pip_constraints = _process_conda_env(conda_env)

    if underlying_model_path is not None:
        underlying_model_conda_env = _get_conda_env_for_underlying_model(underlying_model_path)
        conda_env = _merge_environments(conda_env, underlying_model_conda_env)
        pip_requirements = _get_pip_deps(conda_env)

    with open(os.path.join(path, _CONDA_ENV_FILE_NAME), "w") as f:
        yaml.safe_dump(conda_env, stream=f, default_flow_style=False)

    # Save `constraints.txt` if necessary
    if pip_constraints:
        write_to(os.path.join(path, _CONSTRAINTS_FILE_NAME), "\n".join(pip_constraints))

    # Save `requirements.txt`
    write_to(os.path.join(path, _REQUIREMENTS_FILE_NAME), "\n".join(pip_requirements))

    _PythonEnv.current().to_yaml(os.path.join(path, _PYTHON_ENV_FILE_NAME))


# Defining save_model (Required by Model.log) to refer to save_explainer
save_model = save_explainer


def _get_conda_and_pip_dependencies(conda_env):
    """
    Extract conda and pip dependencies from conda environments

    Args:
        conda_env: Conda environment
    """

    conda_deps = []
    # NB: Set operations are required in case there are multiple references of MLflow as a
    # dependency to ensure that duplicate entries are not present in the final consolidated
    # dependency list.
    pip_deps_set = set()

    for dependency in conda_env["dependencies"]:
        if isinstance(dependency, dict) and dependency["pip"]:
            for pip_dependency in dependency["pip"]:
                if pip_dependency != "mlflow":
                    pip_deps_set.add(pip_dependency)
        else:
            package_name = _get_package_name(dependency)
            if package_name is not None and package_name not in ["python", "pip"]:
                conda_deps.append(dependency)

    return conda_deps, sorted(pip_deps_set)


def _union_lists(l1, l2):
    """
    Returns the union of two lists as a new list.
    """
    return list(dict.fromkeys(l1 + l2))


def _merge_environments(shap_environment, model_environment):
    """
    Merge conda environments of underlying model and shap.

    Args:
        shap_environment: SHAP conda environment.
        model_environment: Underlying model conda environment.
    """
    # merge the channels from the two environments and remove the default conda
    # channels if present since its added later in `_mlflow_conda_env`
    merged_conda_channels = _union_lists(
        shap_environment["channels"], model_environment["channels"]
    )
    merged_conda_channels = [x for x in merged_conda_channels if x != "conda-forge"]

    shap_conda_deps, shap_pip_deps = _get_conda_and_pip_dependencies(shap_environment)
    model_conda_deps, model_pip_deps = _get_conda_and_pip_dependencies(model_environment)

    merged_conda_deps = _union_lists(shap_conda_deps, model_conda_deps)
    merged_pip_deps = _union_lists(shap_pip_deps, model_pip_deps)
    return _mlflow_conda_env(
        additional_conda_deps=merged_conda_deps,
        additional_pip_deps=merged_pip_deps,
        additional_conda_channels=merged_conda_channels,
    )


def load_explainer(model_uri):
    """
    Load a SHAP explainer from a local file or a run.

    Args:
        model_uri: The location, in URI format, of the MLflow model. For example:

            - ``/Users/me/path/to/local/model``
            - ``relative/path/to/local/model``
            - ``s3://my_bucket/path/to/model``
            - ``runs:/<mlflow_run_id>/run-relative/path/to/model``
            - ``models:/<model_name>/<model_version>``
            - ``models:/<model_name>/<stage>``

            For more information about supported URI schemes, see
            `Referencing Artifacts <https://www.mlflow.org/docs/latest/concepts.html#
            artifact-locations>`_.

    Returns:
        A SHAP explainer.
    """

    explainer_path = _download_artifact_from_uri(artifact_uri=model_uri)
    flavor_conf = _get_flavor_configuration(model_path=explainer_path, flavor_name=FLAVOR_NAME)
    _add_code_from_conf_to_system_path(explainer_path, flavor_conf)
    explainer_artifacts_path = os.path.join(explainer_path, flavor_conf["serialized_explainer"])
    underlying_model_flavor = flavor_conf["underlying_model_flavor"]
    model = None

    if underlying_model_flavor != _UNKNOWN_MODEL_FLAVOR:
        underlying_model_path = os.path.join(explainer_path, _UNDERLYING_MODEL_SUBPATH)
        if underlying_model_flavor == mlflow.sklearn.FLAVOR_NAME:
            model = mlflow.sklearn._load_pyfunc(underlying_model_path).predict
        elif underlying_model_flavor == mlflow.pytorch.FLAVOR_NAME:
            model = mlflow.pytorch._load_model(os.path.join(underlying_model_path, "data"))

    return _load_explainer(explainer_file=explainer_artifacts_path, model=model)


def _load_explainer(explainer_file, model=None):
    """
    Load a SHAP explainer saved as an MLflow artifact on the local file system.

    Args:
        explainer_file: Local filesystem path to the MLflow Model saved with the ``shap`` flavor.
        model: Model to override underlying explainer model.

    """
    import shap

    def inject_model_loader(_in_file):
        return model

    with open(explainer_file, "rb") as explainer:
        if model is None:
            explainer = shap.Explainer.load(explainer)
        else:
            explainer = shap.Explainer.load(explainer, model_loader=inject_model_loader)
        return explainer


class _SHAPWrapper:
    def __init__(self, path):
        flavor_conf = _get_flavor_configuration(model_path=path, flavor_name=FLAVOR_NAME)
        shap_explainer_artifacts_path = os.path.join(path, flavor_conf["serialized_explainer"])
        underlying_model_flavor = flavor_conf["underlying_model_flavor"]
        model = None
        if underlying_model_flavor != _UNKNOWN_MODEL_FLAVOR:
            underlying_model_path = os.path.join(path, _UNDERLYING_MODEL_SUBPATH)
            if underlying_model_flavor == mlflow.sklearn.FLAVOR_NAME:
                model = mlflow.sklearn._load_pyfunc(underlying_model_path).predict
            elif underlying_model_flavor == mlflow.pytorch.FLAVOR_NAME:
                model = mlflow.pytorch._load_model(os.path.join(underlying_model_path, "data"))

        self.explainer = _load_explainer(explainer_file=shap_explainer_artifacts_path, model=model)

    def get_raw_model(self):
        """
        Returns the underlying model.
        """
        return self.explainer

    def predict(
        self,
        dataframe,
        params: dict[str, Any] | None = None,
    ):
        """
        Args:
            dataframe: Model input data.
            params: Additional parameters to pass to the model for inference.

        Returns:
            Model predictions.
        """
        return self.explainer(dataframe.values).values
```

--------------------------------------------------------------------------------

````

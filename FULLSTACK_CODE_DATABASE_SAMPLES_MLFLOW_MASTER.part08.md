---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 8
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 8 of 991)

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

---[FILE: bug_report_template.yaml]---
Location: mlflow-master/.github/ISSUE_TEMPLATE/bug_report_template.yaml

```yaml
name: Bug Report (Use "UI Bug Report" for UI bugs)
description: Create a report to help us reproduce and correct the bug
labels: "bug"
title: "[BUG]"

body:
  - type: markdown
    attributes:
      value: |
        Thank you for submitting an issue. Please refer to our [issue policy](https://www.github.com/mlflow/mlflow/blob/master/ISSUE_POLICY.md) for additional information about bug reports. For help with debugging your code, please refer to [Stack Overflow](https://stackoverflow.com/questions/tagged/mlflow).
        #### Please fill in this bug report template to ensure a timely and thorough response.
  - type: checkboxes
    attributes:
      label: Issues Policy acknowledgement
      description: |
        I understand that failure to adhere to the issues guidance may result in my issue being closed without warning or response.
      options:
        - label: I have read and agree to submit bug reports in accordance with the [issues policy](https://www.github.com/mlflow/mlflow/blob/master/ISSUE_POLICY.md)
          required: true
  - type: dropdown
    attributes:
      label: Where did you encounter this bug?
      options:
        - Local machine
        - Databricks
        - Azure Machine Learning
        - Other
    validations:
      required: true

  - type: textarea
    validations:
      required: true
    attributes:
      label: MLflow version
      description: MLflow version (run `mlflow --version`) or commit SHA if you have MLflow installed from source (run `pip freeze | grep mlflow`). The tracking server version is required if `mlflow server` is used.
      value: |
        - Client: 1.x.y
        - Tracking server: 1.x.y

  - type: textarea
    attributes:
      label: System information
      description: |
        Describe the system where you encountered the bug.
      value: |
        - **OS Platform and Distribution (e.g., Linux Ubuntu 16.04)**:
        - **Python version**:
        - **yarn version, if running the dev UI**:
    validations:
      required: true
  - type: textarea
    attributes:
      label: Describe the problem
      description: |
        Describe the problem clearly here. Include descriptions of the expected behavior and the actual behavior.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Tracking information
      description: |
        For bugs related to the tracking features (e.g. mlflow should log a run in my database but it doesn't), please insert the following code in your python script / notebook where you encountered the bug and run it:
        ```python
        # MLflow < 2.0
        print("MLflow version:", mlflow.__version__)
        print("Tracking URI:", mlflow.get_tracking_uri())
        print("Artifact URI:", mlflow.get_artifact_uri())

        # MLflow >= 2.0
        mlflow.doctor()
        ```
        Then, make sure the printed out information matches what you expect and paste it (with sensitive information masked) in the box below. If you know the command that was used to launch your tracking server (e.g. `mlflow server -h 0.0.0.0 -p 5000`), please provide it.
      value: |
        <!-- PLEASE KEEP BACKTICKS AND CHECK PREVIEW -->
        ```shell
        REPLACE_ME
        ```

    validations:
      required: false
  - type: textarea
    attributes:
      label: Code to reproduce issue
      description: |
        Provide a reproducible test case that is the bare minimum necessary to generate the problem.

        ### Bad

        Requires modifications (e.g., adding missing import statements) to run.

        ```python
        with mlflow.start_run():  # `mlflow` is not imported
            mlflow.sklearn.log_model(model, "model")  # `model` is undefined
        ```

        ### Good

        Does not require any modifications to run.

        ```python
        from sklearn.datasets import load_iris
        from sklearn.linear_model import LogisticRegression
        import mlflow

        X, y = load_iris(return_X_y=True)
        model = LogisticRegression().fit(X, y)
        with mlflow.start_run():
            mlflow.sklearn.log_model(model, "model")
        ```

      value: |
        <!-- PLEASE KEEP BACKTICKS AND CHECK PREVIEW -->
        ```
        REPLACE_ME
        ```

    validations:
      required: true
  - type: textarea
    attributes:
      label: Stack trace
      description: |
        Provide a **full** stack trace.

        ### Bad

        ```python
        TypeError: expected string or bytes-like object
        ```

        ### Good

        ```python
        Traceback (most recent call last):
          File "a.py", line 3, in <module>
            mlflow.log_param(1, 2)
          File "/home/user/mlflow/mlflow/tracking/fluent.py", line 541, in log_param
            return MlflowClient().log_param(run_id, key, value)
          File "/home/user/mlflow/mlflow/tracking/client.py", line 742, in log_param
            self._tracking_client.log_param(run_id, key, value)
          File "/home/user/mlflow/mlflow/tracking/_tracking_service/client.py", line 295, in log_param
            self.store.log_param(run_id, param)
          File "/home/user/mlflow/mlflow/store/tracking/file_store.py", line 917, in log_param
            _validate_param(param.key, param.value)
          File "/home/user/mlflow/mlflow/utils/validation.py", line 150, in _validate_param
            _validate_param_name(key)
          File "/home/user/mlflow/mlflow/utils/validation.py", line 217, in _validate_param_name
            if not _VALID_PARAM_AND_METRIC_NAMES.match(name):
        TypeError: expected string or bytes-like object
        ```
      value: |
        <!-- PLEASE KEEP BACKTICKS AND CHECK PREVIEW -->
        ```
        REPLACE_ME
        ```

    validations:
      required: true
  - type: textarea
    attributes:
      label: Other info / logs
      description: |
        Include any logs or source code that would be helpful to diagnose the problem. Large logs and files should be attached.

        ### Example

        ```
        # Tracking server logs
        [2022-08-01 16:03:02 +0900] [222636] [INFO] Starting gunicorn 20.1.0
        [2022-08-01 16:03:02 +0900] [222636] [INFO] Listening at: http://127.0.0.1:5000 (222636)
        [2022-08-01 16:03:02 +0900] [222636] [INFO] Using worker: sync
        [2022-08-01 16:03:02 +0900] [222639] [INFO] Booting worker with pid: 222639
        ```
      value: |
        <!-- PLEASE KEEP BACKTICKS AND CHECK PREVIEW -->
        ```
        REPLACE_ME
        ```

    validations:
      required: false
  - type: checkboxes
    id: component
    attributes:
      label: What component(s) does this bug affect?
      description: Please choose one or more components below.
      options:
        - label: "`area/tracking`: Tracking Service, tracking client APIs, autologging"
          required: false
        - label: "`area/model-registry`: Model Registry service, APIs, and the fluent client calls for Model Registry"
          required: false
        - label: "`area/scoring`: MLflow model serving, deployment tools, Spark UDFs"
          required: false
        - label: "`area/evaluation`: MLflow model evaluation features, evaluation metrics, and evaluation workflows"
          required: false
        - label: "`area/prompt`: MLflow prompt engineering features, prompt templates, and prompt management"
          required: false
        - label: "`area/tracing`: MLflow Tracing features, tracing APIs, and LLM tracing functionality"
          required: false
        - label: "`area/gateway`: MLflow AI Gateway client APIs, server, and third-party integrations"
          required: false
        - label: "`area/projects`: MLproject format, project running backends"
          required: false
        - label: "`area/uiux`: Front-end, user experience, plotting"
          required: false
        - label: "`area/docs`: MLflow documentation pages"
          required: false
```

--------------------------------------------------------------------------------

---[FILE: doc_fix_template.yaml]---
Location: mlflow-master/.github/ISSUE_TEMPLATE/doc_fix_template.yaml

```yaml
name: Documentation Fix
description: Use this template for proposing documentation fixes/improvements.
labels: "area/docs"
title: "[DOC-FIX]"

body:
  - type: markdown
    attributes:
      value: |
        Thank you for submitting an issue. Please refer to our [issue policy](https://www.github.com/mlflow/mlflow/blob/master/ISSUE_POLICY.md) for information on what types of issues we address.

        **Is this the right repository?**
        - ✅ **Documentation pages** under https://mlflow.org/docs (API reference, tutorials, how-to guides) — you're in the right place!
        - ❌ **Main website content** (blog posts, marketing pages, other site content) — please file at https://github.com/mlflow/mlflow-website/issues instead

        **Important note about documentation branches:**
        The production documentation at https://mlflow.org/docs/latest/ is built from the **release branch** (e.g., `branch-3.7`), not `master`. If you notice a discrepancy between the live docs and the source code on `master`, the fix may already exist on `master`. You can verify this by checking the preview site at https://dev--mlflow-docs-preview.netlify.app/docs/latest which is built from `master`.

        **Please fill in this documentation issue template to ensure a timely and thorough response.**
  - type: dropdown
    id: contribution
    attributes:
      label: Willingness to contribute
      description: The MLflow Community encourages documentation fix contributions. Would you or another member of your organization be willing to contribute a fix for this documentation issue to the MLflow code base?
      options:
        - Yes. I can contribute a documentation fix independently.
        - Yes. I would be willing to contribute a document fix with guidance from the MLflow community.
        - No. I cannot contribute a documentation fix at this time.
    validations:
      required: true
  - type: textarea
    attributes:
      label: URL(s) with the issue
      description: |
        Please provide a link to the documentation entry in question.
        Note: This repo is for https://mlflow.org/docs pages only. For other website content, use https://github.com/mlflow/mlflow-website/issues.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Description of proposal (what needs changing)
      description: |
        Provide a clear description. Why is the proposed documentation better?
    validations:
      required: true
```

--------------------------------------------------------------------------------

---[FILE: feature_request_template.yaml]---
Location: mlflow-master/.github/ISSUE_TEMPLATE/feature_request_template.yaml

```yaml
name: Feature Request
description: Use this template for feature and enhancement proposals.
labels: "enhancement"
title: "[FR]"

body:
  - type: markdown
    attributes:
      value: |
        Thank you for submitting a feature request. **Before proceeding, please review MLflow's [Issue Policy for feature requests](https://www.github.com/mlflow/mlflow/blob/master/ISSUE_POLICY.md#feature-requests) and the [MLflow Contributing Guide](https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md)**.
        **Please fill in this feature request template to ensure a timely and thorough response.**
  - type: dropdown
    id: contribution
    attributes:
      label: Willingness to contribute
      description: The MLflow Community encourages new feature contributions. Would you or another member of your organization be willing to contribute an implementation of this feature (either as an MLflow Plugin or an enhancement to the MLflow code base)?
      options:
        - Yes. I can contribute this feature independently.
        - Yes. I would be willing to contribute this feature with guidance from the MLflow community.
        - No. I cannot contribute this feature at this time.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Proposal Summary
      description: |
        In a few sentences, provide a clear, high-level description of the feature request
    validations:
      required: true
  - type: textarea
    attributes:
      label: Motivation
      description: |
        - What is the use case for this feature?
        - Why is this use case valuable to support for MLflow users in general?
        - Why is this use case valuable to support for your project(s) or organization?
        - Why is it currently difficult to achieve this use case? (please be as specific as possible about why related MLflow features and components are insufficient)
      value: |
        > #### What is the use case for this feature?

        > #### Why is this use case valuable to support for MLflow users in general?

        > #### Why is this use case valuable to support for your project(s) or organization?

        > #### Why is it currently difficult to achieve this use case?
    validations:
      required: true
  - type: textarea
    attributes:
      label: Details
      description: |
        Use this section to include any additional information about the feature. If you have a proposal for how to implement this feature, please include it here. For implementation guidelines, please refer to the [Contributing Guide](https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#contribution-guidelines).
    validations:
      required: false

  - type: checkboxes
    id: domain
    attributes:
      label: What machine learning domain(s) is this feature request about?
      description: Please choose one or more domains below.
      options:
        - label: "`domain/genai`: LLMs, Agents, and other GenAI-related use cases"
          required: false
        - label: "`domain/classical-ml`: Traditional machine learning, such as linear regression."
          required: false
        - label: "`domain/deep-learning`: Deep learning and neural networks."
          required: false
        - label: "`domain/platform`: MLflow platform foundation, not specific to a particular machine learning domain."

  - type: checkboxes
    id: component
    attributes:
      label: What area(s) of MLflow is this feature request about?
      description: Please choose one or more components below.
      options:
        - label: "`area/tracking`: Tracking Service, tracking client APIs, autologging"
          required: false
        - label: "`area/model-registry`: Model Registry service, APIs, and the fluent client calls for Model Registry"
          required: false
        - label: "`area/scoring`: MLflow model serving, deployment tools, Spark UDFs"
          required: false
        - label: "`area/evaluation`: MLflow model evaluation features, evaluation metrics, and evaluation workflows"
          required: false
        - label: "`area/prompt`: MLflow prompt engineering features, prompt templates, and prompt management"
          required: false
        - label: "`area/tracing`: MLflow Tracing features, tracing APIs, and LLM tracing functionality"
          required: false
        - label: "`area/gateway`: MLflow AI Gateway client APIs, server, and third-party integrations"
          required: false
        - label: "`area/projects`: MLproject format, project running backends"
          required: false
        - label: "`area/uiux`: Front-end, user experience, plotting"
          required: false
        - label: "`area/docs`: MLflow documentation pages"
          required: false
```

--------------------------------------------------------------------------------

---[FILE: good_first_issue.yaml]---
Location: mlflow-master/.github/ISSUE_TEMPLATE/good_first_issue.yaml

```yaml
name: Good First Issue
description: "[Maintainer only] Use this template for issues that are good for first time contributors."
labels: "good first issue"

body:
  - type: textarea
    validations:
      required: true
    attributes:
      label: Summary
      description: |
        A summary of the issue.
  - type: textarea
    attributes:
      label: Notes
      value: |
        - Make sure to open a PR from a **non-master** branch.
        - Sign off the commit using the `-s` flag when making a commit:

          ```sh
          git commit -s -m "..."
                   # ^^ make sure to use this
          ```

        - Include `#{issue_number}` (e.g. `#123`) in the PR description when opening a PR.
```

--------------------------------------------------------------------------------

---[FILE: installation_issue_template.yaml]---
Location: mlflow-master/.github/ISSUE_TEMPLATE/installation_issue_template.yaml

```yaml
name: Installation Issues
description: Use this template for reporting bugs encountered while installing MLflow.
labels: "bug"
title: "[SETUP-BUG]"

body:
  - type: markdown
    attributes:
      value: |
        Thank you for submitting an issue. Please refer to our [issue policy](https://www.github.com/mlflow/mlflow/blob/master/ISSUE_POLICY.md) for information on what types of issues we address.
        **Please fill in this installation issue template to ensure a timely and thorough response.**
  - type: textarea
    attributes:
      label: System information
      description: |
        Describe the system where you encountered the installation issue.
      value: |
        - **OS Platform and Distribution (e.g., Linux Ubuntu 16.04)**:
        - **MLflow installed from (source or binary)**:
        - **MLflow version (run ``mlflow --version``)**:
        - **Python version**:
    validations:
      required: true
  - type: textarea
    attributes:
      label: Code to reproduce issue
      description: |
        Provide a reproducible test case that is the bare minimum necessary to generate the problem.
      placeholder: |
        ```bash
        pip install mlflow=x.y.z
        ```
    validations:
      required: true
  - type: textarea
    attributes:
      label: Describe the problem
      description: |
        Provide the exact sequence of commands / steps that you executed before running into the problem.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Other info / logs
      description: |
        Include any logs or source code that would be helpful to diagnose the problem. If including tracebacks, please include the full traceback. Large logs and files should be attached.
      placeholder: |
        ```
        ERROR: Could not find a version that satisfies the requirement mlflow==x.y.z
        ```
    validations:
      required: false
```

--------------------------------------------------------------------------------

---[FILE: ui_bug_report_template.yaml]---
Location: mlflow-master/.github/ISSUE_TEMPLATE/ui_bug_report_template.yaml
Signals: React

```yaml
name: UI Bug Report
description: Create a report to help us reproduce and correct the UI bug
labels: ["bug", "area/uiux"]
title: "[BUG]"

body:
  - type: markdown
    attributes:
      value: |
        Thank you for submitting an issue. Please refer to our [issue policy](https://www.github.com/mlflow/mlflow/blob/master/ISSUE_POLICY.md) for additional information about bug reports. For help with debugging your code, please refer to [Stack Overflow](https://stackoverflow.com/questions/tagged/mlflow).
        #### Please fill in this UI bug report template to ensure a timely and thorough response.

    validations:
      required: true

  - type: input
    validations:
      required: true
    attributes:
      label: MLflow version
      description: MLflow version (run `mlflow --version`) or commit SHA if you have MLflow installed from source (run `pip freeze | grep mlflow`).

  - type: textarea
    validations:
      required: true
    attributes:
      label: System information
      description: |
        Describe the system where you encountered the bug.
      value: |
        - **OS Platform and Distribution (e.g., Linux Ubuntu 16.04)**:
        - **Python version**:
        - **yarn version, if running the dev UI**:

  - type: textarea
    validations:
      required: true
    attributes:
      label: Describe the problem
      description: |
        Describe the problem clearly here. Include descriptions of the expected behavior and the actual behavior.

  - type: textarea
    validations:
      required: true
    attributes:
      label: Steps to reproduce the bug
      description: |
        **Record steps to reproduce the bug as a video or GIF** (to eliminate ambiguity) and attach it here.

  - type: textarea
    attributes:
      label: Code to generate data required to reproduce the bug
      description: |
        Please provide code to generate data required to reproduce the bug.
      placeholder: |
        ```python
        import mlflow

        with mlflow.start_run():
            mlflow.log_param("p", 0)
            mlflow.log_metric("m", 1)
        ```

  - type: textarea
    attributes:
      label: Is the console panel in DevTools showing errors relevant to the bug?
      description: |
        If the console panel in your browser's DevTools is showing errors (displayed in red) relevant to the bug as shown in the screenshot below, please provide them as text (preferred) or a screenshot.

        #### Instructions on how to use DevTools:
        - Chrome: [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
        - Firefox: [Firefox DevTools User Docs](https://firefox-source-docs.mozilla.org/devtools-user/index.html)
        - Edge: [Overview of DevTools](https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/overview)

        ![console-panel](https://github.com/mlflow/mlflow/blob/master/.github/ISSUE_TEMPLATE/images/console-panel.png?raw=true)
        <p align="center">Console panel on Chrome</P>
      placeholder: |
        ```
        TypeError: Cannot read properties of undefined (reading 'x')
          at n.value (HomeView.js:33:22)
          at za (react-dom.production.min.js:187:188)
          at Za (react-dom.production.min.js:186:173)
          at qs (react-dom.production.min.js:269:427)
          at Tl (react-dom.production.min.js:250:347)
        ```

  - type: textarea
    attributes:
      label: Does the network panel in DevTools contain failed requests relevant to the bug?
      description: |
        If the network panel in your browser's DevTools contain failed requests (displayed in red) relevant to the bug as shown in the screenshot below, please provide them as text (preferred) or a screenshot.

        ![network-panel](https://github.com/mlflow/mlflow/blob/master/.github/ISSUE_TEMPLATE/images/network-panel.png?raw=true)
        <p align="center">Network panel on Chrome</P>
      placeholder: |
        ```
        # Request URL
        http://localhost:5000/ajax-api/2.0/preview/mlflow/xxx/yyy

        # Status Code
        400

        # Payload
        {"a": 0}

        # Response
        {"b": 1}
        ```
```

--------------------------------------------------------------------------------

````

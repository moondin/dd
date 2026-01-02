---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 5
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 5 of 991)

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

---[FILE: ISSUE_POLICY.md]---
Location: mlflow-master/ISSUE_POLICY.md

```text
# Issue Policy

The MLflow Issue Policy outlines the categories of MLflow GitHub issues and discusses the guidelines & processes
associated with each type of issue.

Before filing an issue, make sure to [search for related issues](https://github.com/mlflow/mlflow/issues) and check if
they address yours.

For support (ex. "How do I do X?"), please ask on [Stack Overflow](https://stackoverflow.com/questions/tagged/mlflow).

## Issue Categories

Our policy is that GitHub issues fall into one of the following categories:

1. Feature Requests
2. Bug reports
3. Documentation fixes
4. Installation issues

Each category has its own GitHub issue template. Please do not delete the issue template unless you are certain your
issue is outside its scope.

### Feature Requests

#### Guidelines

Feature requests that are likely to be accepted:

- Are minimal in scope (note that it's always easier to add additional functionality later than remove functionality)
- Are extensible (e.g. if adding an integration with an ML framework, is it possible to add similar integrations with other frameworks?)
- Have user impact & value that justifies the maintenance burden of supporting the feature moving forwards. The
  [JQuery contributor guide](https://contribute.jquery.org/open-source/#contributing-something-new) has an excellent discussion on this.

#### Lifecycle

Feature requests typically go through the following lifecycle:

1. A feature request GitHub Issue is submitted, which contains a high-level description of the proposal and its motivation.
   We encourage requesters to provide an overview of the feature's implementation as well, if possible.
2. The [issue is triaged](ISSUE_TRIAGE.rst) to identify whether more information is needed from the author, give an indication of priority, and route feature requests to appropriate committers.
3. The feature request is discussed with a committer. The committer will provide input on the implementation overview or
   ask for a more detailed design, if applicable.
4. After discussion & agreement on the feature request and its implementation, an implementation owner is identified.
5. The implementation owner begins developing the feature and ultimately files associated pull requests against the
   MLflow Repository or packages the feature as an MLflow Plugin.

### Bug reports

#### Guidelines

In order to ensure that maintainers are able to assist in any reported bug:

- Ensure that the bug report template is filled out in its entirety with appropriate levels of detail, particularly in the `Code to reproduce issue` section.
- Verify that the bug you are reporting meets one of the following criteria:
  - A recent release of MLflow does not support the operation you are doing that an earlier release did (a regression).
  - A [documented feature](https://mlflow.org/docs/latest/index.html) or functionality does not work properly by executing a provided example from the docs.
  - Any exception raised is directly from MLflow and is not the result of an underlying package's exception (e.g., don't file an issue that MLflow can't log a model that can't be trained due to a tensorflow Exception)
- Make a best effort to diagnose and troubleshoot the issue prior to filing.
- Verify that the environment that you're experiencing the bug in is supported as defined in the docs.
- Validate that MLflow supports the functionality that you're having an issue with. _A lack of a feature does not constitute a bug_.
- Read the docs on the feature for the issue that you're reporting. If you're certain that you're following documented guidelines, please file a bug report.

Bug reports typically go through the following lifecycle:

1. A bug report GitHub Issue is submitted, which contains a high-level description of the bug and information required to reproduce it.
2. The [bug report is triaged](ISSUE_TRIAGE.rst) to identify whether more information is needed from the author, give an indication of priority, and route to request appropriate committers.
3. An MLflow committer reproduces the bug and provides feedback about how to implement a fix.
4. After an approach has been agreed upon, an owner for the fix is identified. MLflow committers may choose to adopt
   ownership of severe bugs to ensure a timely fix.
5. The fix owner begins implementing the fix and ultimately files associated pull requests.

### Documentation fixes

Documentation issues typically go through the following lifecycle:

1. A documentation GitHub Issue is submitted, which contains a description of the issue and its location(s) in the MLflow documentation.
2. The [issue is triaged](ISSUE_TRIAGE.rst) to identify whether more information is needed from the author, give an indication of priority, and route the request to appropriate committers.
3. An MLflow committer confirms the documentation issue and provides feedback about how to implement a fix.
4. After an approach has been agreed upon, an owner for the fix is identified. MLflow committers may choose to adopt
   ownership of severe documentation issues to ensure a timely fix.
5. The fix owner begins implementing the fix and ultimately files associated pull requests.

### Installation issues

Installation issues typically go through the following lifecycle:

1. An installation GitHub Issue is submitted, which contains a description of the issue and the platforms its affects.
2. The [issue is triaged](ISSUE_TRIAGE.rst) to identify whether more information is needed from the author, give an indication of priority, and route the issue to appropriate committers.
3. An MLflow committer confirms the installation issue and provides feedback about how to implement a fix.
4. After an approach has been agreed upon, an owner for the fix is identified. MLflow committers may choose to adopt
   ownership of severe installation issues to ensure a timely fix.
5. The fix owner begins implementing the fix and ultimately files associated pull requests.
```

--------------------------------------------------------------------------------

---[FILE: ISSUE_TRIAGE.rst]---
Location: mlflow-master/ISSUE_TRIAGE.rst

```text

This document is a hands-on manual for doing issue and pull request triage for `MLflow issues
on GitHub <https://github.com/mlflow/mlflow/issues>`_ .
The purpose of triage is to speed up issue management and get community members faster responses.

Issue and pull request triage has three steps:

- assign one or more process labels (e.g. ``needs design`` or ``help wanted``),
- mark a priority, and
- label one or more relevant areas, languages, or integrations to help route issues to appropriate contributors or reviewers.

The remainder of the document describes the labels used in each of these steps and how to apply them.

Assign appropriate process labels
#######
Assign at least one process label to every issue you triage.

- ``needs author feedback``: We need input from the author of the issue or PR to proceed.
- | ``needs design``: This feature is large or tricky enough that we think it warrants a design doc
  | and review before someone begins implementation.
- | ``needs committer feedback``: The issue has a design that is ready for committer review, or there is
  | an issue or pull request that needs feedback from a committer about the approach or appropriateness
  | of the contribution.
- | ``needs review``: Use this label for issues that need a more detailed design review or pull
  | requests ready for review (all questions answered, PR updated if requests have been addressed,
  | tests passing).
- ``help wanted``: We would like community help for this issue.
- ``good first issue``: This would make a good first issue.


Assign priority
#######

You should assign a priority to each issue you triage. We use `kubernetes-style <https://github.com/
kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority>`_ priority
labels.

- | ``priority/critical-urgent``: This is the highest priority and should be worked on by
  | somebody right now. This should typically be reserved for things like security bugs,
  | regressions, release blockers.
- | ``priority/important-soon``: The issue is worked on by the community currently or will
  | be very soon, ideally in time for the next release.
- | ``priority/important-longterm``: Important over the long term, but may not be staffed or
  | may need multiple releases to complete. Also used for things we know are on a
  | contributor's roadmap in the next few months. We can use this in conjunction with
  | ``help wanted`` to mark issues we would like to get help with. If someone begins actively
  | working on an issue with this label and we think it may be merged by the next release, change
  | the priority to ``priority/important-soon``.
- | ``priority/backlog``: We believe it is useful but don't see it being prioritized in the
  | next few months. Use this for issues that are lower priority than ``priority/important-longterm``.
  | We welcome community members to pick up a ``priority/backlog`` issue, but there may be some
  | delay in getting support through design review or pull request feedback.
- | ``priority/awaiting-more-evidence``: Lowest priority. Possibly useful, but not yet enough
  | support to actually get it done. This is a good place to put issues that could be useful but
  | require more evidence to demonstrate broad value. Don't use it as a way to say no.
  | If we think it doesn't fit in MLflow, we should just say that and why.

Label relevant areas
#######

Assign one more labels for relevant component or interface surface areas, languages, or
integrations. As a principle, we aim to have the minimal set of labels needed to help route issues
and PRs to appropriate contributors. For example, a ``language/python`` label would not be
particularly helpful for routing issues to committers, since most PRs involve Python code.
``language/java`` and ``language/r`` make sense to have, as the clients in these languages differ from the Python client and aren't maintained by many people. As with process labels, we
take inspiration from Kubernetes on naming conventions.

Components
""""""""
- ``area/artifacts``: Artifact stores and artifact logging
- ``area/build``: Build and test infrastructure for MLflow
- ``area/docs``: MLflow documentation pages
- ``area/evaluation``: MLflow model evaluation features, evaluation metrics, and evaluation workflows
- ``area/examples``: Example code
- ``area/gateway``: AI Gateway service, Gateway client APIs, third-party Gateway integrations
- ``area/model-registry``: Model Registry service, APIs, and the fluent client calls for Model Registry
- ``area/models``: MLmodel format, model serialization/deserialization, flavors
- ``area/projects``: MLproject format, project execution backends
- ``area/prompt``: MLflow prompt engineering features, prompt templates, and prompt management
- ``area/scoring``: MLflow Model server, model deployment tools, Spark UDFs
- ``area/server-infra``: MLflow Tracking server backend
- ``area/tracing``: MLflow Tracing features, tracing APIs, and LLM tracing functionality
- ``area/tracking``: Tracking Service, tracking client APIs, autologging

Interface Surface
""""""""
- ``area/uiux``: Front-end, user experience, plotting, JavaScript, JavaScript dev server
- ``area/docker``: Docker use across MLflow's components, such as MLflow Projects and MLflow Models
- ``area/sqlalchemy``: Use of SQLAlchemy in the Tracking Service or Model Registry
- ``area/windows``: Windows support

Language Surface
""""""""
- ``language/r``: R APIs and clients
- ``language/java``: Java APIs and clients
- ``language/new``: Proposals for new client languages

Integrations
""""""""
- ``integrations/azure``: Azure and Azure ML integrations
- ``integrations/sagemaker``: SageMaker integrations
- ``integrations/databricks``: Databricks integrations
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.txt]---
Location: mlflow-master/LICENSE.txt

```text
Copyright 2018 Databricks, Inc.  All rights reserved.

				Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS
   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

--------------------------------------------------------------------------------

---[FILE: MANIFEST.in]---
Location: mlflow-master/MANIFEST.in

```text
exclude mlflow/server/js/node_modules/**/*
exclude tests/**/*
```

--------------------------------------------------------------------------------

---[FILE: prettier.config.js]---
Location: mlflow-master/prettier.config.js

```javascript
module.exports = {
  printWidth: 100,
};
```

--------------------------------------------------------------------------------

---[FILE: pyproject.release.toml]---
Location: mlflow-master/pyproject.release.toml
Signals: Docker

```toml
# Auto-generated by dev/pyproject.py. Do not edit manually.
# This file defines the package metadata of `mlflow`. `mlflow-skinny` and `mlflow-tracing`
# are included in the requirements to prevent a version mismatch between `mlflow` and those
# child packages. This file will replace `pyproject.toml` when releasing a new version.

[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "mlflow"
version = "3.8.1.dev0"
description = "MLflow is an open source platform for the complete machine learning lifecycle"
readme = "README.md"
keywords = ["mlflow", "ai", "databricks"]
classifiers = [
  "Development Status :: 5 - Production/Stable",
  "Intended Audience :: Developers",
  "Intended Audience :: End Users/Desktop",
  "Intended Audience :: Science/Research",
  "Intended Audience :: Information Technology",
  "Topic :: Scientific/Engineering :: Artificial Intelligence",
  "Topic :: Software Development :: Libraries :: Python Modules",
  "License :: OSI Approved :: Apache Software License",
  "Operating System :: OS Independent",
  "Programming Language :: Python :: 3.10",
]
requires-python = ">=3.10"
dependencies = [
  "mlflow-skinny==3.8.1.dev0",
  "mlflow-tracing==3.8.1.dev0",
  "Flask-CORS<7",
  "Flask<4",
  "alembic<2,!=1.10.0",
  "cryptography<47,>=43.0.0",
  "docker<8,>=4.0.0",
  "graphene<4",
  "gunicorn<24; platform_system != 'Windows'",
  "huey<3,>=2.5.0",
  "matplotlib<4",
  "numpy<3",
  "pandas<3",
  "pyarrow<23,>=4.0.0",
  "scikit-learn<2",
  "scipy<2",
  "sqlalchemy<3,>=1.4.0",
  "waitress<4; platform_system == 'Windows'",
]
[[project.maintainers]]
name = "Databricks"
email = "mlflow-oss-maintainers@googlegroups.com"

[project.license]
file = "LICENSE.txt"

[project.optional-dependencies]
extras = [
  "pyarrow",
  "requests-auth-aws-sigv4",
  "boto3",
  "botocore",
  "google-cloud-storage>=1.30.0",
  "azureml-core>=1.2.0",
  "pysftp",
  "kubernetes",
  "virtualenv",
  "prometheus-flask-exporter",
]
databricks = [
  "azure-storage-file-datalake>12",
  "google-cloud-storage>=1.30.0",
  "boto3>1",
  "botocore",
  "databricks-agents>=1.2.0,<2.0",
]
mlserver = [
  "mlserver>=1.2.0,!=1.3.1,<2.0.0",
  "mlserver-mlflow>=1.2.0,!=1.3.1,<2.0.0",
]
gateway = [
  "aiohttp<4",
  "boto3<2,>=1.28.56",
  "fastapi<1",
  "slowapi<1,>=0.1.9",
  "tiktoken<1",
  "uvicorn[standard]<1",
  "watchfiles<2",
]
genai = [
  "aiohttp<4",
  "boto3<2,>=1.28.56",
  "fastapi<1",
  "litellm<2,>=1.0.0",
  "slowapi<1,>=0.1.9",
  "tiktoken<1",
  "uvicorn[standard]<1",
  "watchfiles<2",
]
mcp = ["fastmcp<3,>=2.0.0", "click!=8.3.0"]
sqlserver = ["mlflow-dbstore"]
aliyun-oss = ["aliyunstoreplugin"]
jfrog = ["mlflow-jfrog-plugin"]
langchain = ["langchain>=0.3.12,<=1.1.3"]
auth = ["Flask-WTF<2"]

[project.urls]
homepage = "https://mlflow.org"
issues = "https://github.com/mlflow/mlflow/issues"
documentation = "https://mlflow.org/docs/latest"
repository = "https://github.com/mlflow/mlflow"

[project.scripts]
mlflow = "mlflow.cli:cli"

[project.entry-points."mlflow.app"]
basic-auth = "mlflow.server.auth:create_app"

[project.entry-points."mlflow.app.client"]
basic-auth = "mlflow.server.auth.client:AuthServiceClient"

[project.entry-points."mlflow.deployments"]
databricks = "mlflow.deployments.databricks"
http = "mlflow.deployments.mlflow"
https = "mlflow.deployments.mlflow"
openai = "mlflow.deployments.openai"

[tool.setuptools.package-data]
mlflow = [
  "store/db_migrations/alembic.ini",
  "temporary_db_migrations_for_pre_1_users/alembic.ini",
  "pyspark/ml/log_model_allowlist.txt",
  "server/auth/basic_auth.ini",
  "server/auth/db/migrations/alembic.ini",
  "models/notebook_resources/**/*",
  "ai_commands/**/*.md",
  "models/container/**/*",
  "server/js/build/**/*",
]

[tool.setuptools.packages.find]
where = ["."]
include = ["mlflow", "mlflow.*"]
exclude = ["tests", "tests.*"]
namespaces = false
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 41
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 41 of 991)

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

---[FILE: testcode_block.py]---
Location: mlflow-master/docs/api_reference/source/testcode_block.py

```python
"""
Standalone script to extract code blocks marked with :test: from Python docstrings.
Uses AST to parse Python files and extract docstrings with test code blocks.
"""

import ast
import re
import subprocess
import textwrap
from pathlib import Path

_CODE_BLOCK_HEADER_REGEX = re.compile(r"^\.\.\s+code-block::\s*py(thon)?")
_CODE_BLOCK_OPTION_REGEX = re.compile(r"^:\w+:")


def _get_indent(s: str) -> int:
    return len(s) - len(s.lstrip())


def _get_header_indent(s: str) -> int | None:
    if _CODE_BLOCK_HEADER_REGEX.match(s.lstrip()):
        return _get_indent(s)
    return None


def extract_code_blocks_from_docstring(docstring: str | None) -> list[tuple[int, str]]:
    """
    Extract all code blocks marked with :test: from a docstring.
    Uses the same approach as clint for parsing code blocks.

    Returns a list of tuples: (line_number, code_content)
    """
    if not docstring:
        return []

    blocks = []
    header_indent: int | None = None
    code_lines: list[str] = []
    has_test_option = False
    code_block_lineno = 0

    line_iter = enumerate(docstring.splitlines())
    while t := next(line_iter, None):
        idx, line = t

        if code_lines:
            # We're inside a code block
            indent = _get_indent(line)
            # If we encounter a non-blank line with an indent less than or equal to the header
            # we are done parsing the code block
            if line.strip() and (header_indent is not None) and indent <= header_indent:
                if has_test_option:
                    code = textwrap.dedent("\n".join(code_lines))
                    blocks.append((code_block_lineno, code))

                # Reset state
                code_lines.clear()
                has_test_option = False
                # It's possible that another code block follows the current one
                header_indent = _get_header_indent(line)
                continue

            code_lines.append(line)

        elif header_indent is not None:
            # We found a code-block header, now advance to the code body
            # Skip options like :test:, :caption:, etc.
            while True:
                stripped = line.lstrip()
                if stripped.startswith(":test:") or stripped == ":test:":
                    has_test_option = True

                # Check if this is still an option line or blank
                if stripped and not _CODE_BLOCK_OPTION_REGEX.match(stripped):
                    # We are at the first line of the code block
                    code_lines.append(line)
                    code_block_lineno = idx + 1  # Line number in docstring (1-indexed)
                    break

                if next_line := next(line_iter, None):
                    idx, line = next_line
                else:
                    break

        else:
            # Look for code-block headers
            header_indent = _get_header_indent(line)

    # The docstring ends with a code block
    if code_lines and has_test_option:
        code = textwrap.dedent("\n".join(code_lines))
        blocks.append((code_block_lineno, code))

    return blocks


def extract_code_blocks_from_file(filepath: Path, repo_root: Path) -> list[tuple[str, int, str]]:
    """
    Extract all code blocks marked with :test: from a Python file.

    Args:
        filepath: Path to the Python file
        repo_root: Root of the repository

    Returns:
        List of tuples: (location_string, line_number, code_content)
    """
    source = filepath.read_text()
    tree = ast.parse(source)

    results = []
    rel_path = filepath.relative_to(repo_root)

    for node in ast.walk(tree):
        # Check functions and classes for docstrings
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            docstring = ast.get_docstring(node)
            if not docstring:
                continue

            blocks = extract_code_blocks_from_docstring(docstring)
            for lineno_in_docstring, code in blocks:
                # Calculate the actual line number in the file
                # The docstring starts at node.lineno, and lineno_in_docstring is relative to that
                actual_line = node.lineno + lineno_in_docstring
                location = f"{rel_path}:{actual_line}"
                results.append((location, lineno_in_docstring, code))

    return results


def find_python_files(directory: Path, repo_root: Path) -> list[Path]:
    """Find all Python files tracked by git in a directory."""
    # Get relative path from repo root
    rel_dir = directory.relative_to(repo_root)

    # Run git ls-files from repo root with the directory as a pattern
    output = subprocess.check_output(
        ["git", "ls-files", f"{rel_dir}/*.py"],
        cwd=repo_root,
        text=True,
    )
    files = [repo_root / line for line in output.strip().split("\n") if line]
    return sorted(files)


def generate_test_file(location: str, line_num: int, code: str, output_dir: Path) -> Path:
    """Generate a pytest test file for a code block."""
    # Create a unique filename based on location
    safe_name = re.sub(r"[/\\:.]", "_", location)
    filename = f"test_{safe_name}_{line_num}.py"
    content = textwrap.indent(code, " " * 4)

    test_code = "\n".join(
        [
            f"# Location: {location}",
            "import pytest",
            "",
            "",
            # Show the code block location in the test report.
            f"@pytest.mark.parametrize('_', [' {location} '])",
            "def test(_):",
            content,
            "",
            "",
            'if __name__ == "__main__":',
            "    test()",
            "",
        ]
    )

    output_path = output_dir / filename
    output_path.write_text(test_code)
    return output_path


def extract_examples(mlflow_dir: Path, output_dir: Path, repo_root: Path) -> None:
    """
    Extract test examples from Python files and generate test files.

    Args:
        mlflow_dir: Directory containing Python files to scan
        output_dir: Directory to write test files to
        repo_root: Root of the repository
    """
    output_dir.mkdir(exist_ok=True)

    # Clean up old test files
    for old_file in output_dir.glob("test_*.py"):
        old_file.unlink()

    print(f"Scanning Python files in: {mlflow_dir}")
    python_files = find_python_files(mlflow_dir, repo_root)
    print(f"Found {len(python_files)} Python files")

    for filepath in python_files:
        results = extract_code_blocks_from_file(filepath, repo_root)

        for location, line_num, code in results:
            output_path = generate_test_file(location, line_num, code, output_dir)
            print(f"  Generated: {output_path.name}")


def main() -> None:
    output = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True)
    repo_root = Path(output.strip())
    scan_dir = repo_root / "mlflow"
    output_dir = Path(".examples")
    extract_examples(scan_dir, output_dir, repo_root)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: python-api.rst]---
Location: mlflow-master/docs/api_reference/source/auth/python-api.rst

```text

.. _auth-python-api:

================================
MLflow Authentication Python API
================================

mlflow.server.auth.client
=========================

.. autoclass:: mlflow.server.auth.client.AuthServiceClient()
    :members:
    :undoc-members:
    :show-inheritance:

mlflow.server.auth.entities
===========================

.. automodule:: mlflow.server.auth.entities
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: rest-api.rst]---
Location: mlflow-master/docs/api_reference/source/auth/rest-api.rst

```text

.. _auth-rest-api:

==============================
MLflow Authentication REST API
==============================


The MLflow Authentication REST API allows you to create, get, update and delete users, 
experiment permissions and registered model permissions.
The API is hosted under the ``/api`` route on the MLflow tracking server. For example, to list
experiments on a tracking server hosted at ``http://localhost:5000``, access
``http://localhost:5000/api/2.0/mlflow/users/create``.

.. important::
    The MLflow REST API requires content type ``application/json`` for all POST requests.

.. contents:: Table of Contents
    :local:
    :depth: 1

===========================

.. _mlflowAuthServiceCreateUser:

Create User
===========

+-----------------------------+-------------+
|          Endpoint           | HTTP Method |
+=============================+=============+
| ``2.0/mlflow/users/create`` | ``POST``    |
+-----------------------------+-------------+

.. _mlflowCreateUser:

Request Structure
-----------------

+------------+------------+-------------+
| Field Name |    Type    | Description |
+============+============+=============+
| username   | ``STRING`` | Username.   |
+------------+------------+-------------+
| password   | ``STRING`` | Password.   |
+------------+------------+-------------+

.. _mlflowCreateUserResponse:

Response Structure
------------------

+------------+-------------------+----------------+
| Field Name |       Type        |  Description   |
+============+===================+================+
| user       | :ref:`mlflowUser` | A user object. |
+------------+-------------------+----------------+

===========================

.. _mlflowAuthServiceGetUser:

Get User
========

+--------------------------+-------------+
|         Endpoint         | HTTP Method |
+==========================+=============+
| ``2.0/mlflow/users/get`` | ``GET``     |
+--------------------------+-------------+

.. _mlflowGetUser:

Request Structure
-----------------

+------------+------------+-------------+
| Field Name |    Type    | Description |
+============+============+=============+
| username   | ``STRING`` | Username.   |
+------------+------------+-------------+

.. _mlflowGetUserResponse:

Response Structure
------------------

+------------+-------------------+----------------+
| Field Name |       Type        |  Description   |
+============+===================+================+
| user       | :ref:`mlflowUser` | A user object. |
+------------+-------------------+----------------+

===========================

.. _mlflowAuthServiceUpdateUserPassword:

Update User Password
====================

+--------------------------------------+-------------+
|               Endpoint               | HTTP Method |
+======================================+=============+
| ``2.0/mlflow/users/update-password`` | ``PATCH``   |
+--------------------------------------+-------------+

.. _mlflowUpdateUserPassword:

Request Structure
-----------------

+------------+------------+---------------+
| Field Name | Type       | Description   |
+============+============+===============+
| username   | ``STRING`` | Username.     |
+------------+------------+---------------+
| password   | ``STRING`` | New password. |
+------------+------------+---------------+

===========================

.. _mlflowAuthServiceUpdateUserAdmin:

Update User Admin
=================

+-----------------------------------+-------------+
|             Endpoint              | HTTP Method |
+===================================+=============+
| ``2.0/mlflow/users/update-admin`` | ``PATCH``   |
+-----------------------------------+-------------+

.. _mlflowUpdateUserAdmin:

Request Structure
-----------------

+------------+-------------+-------------------+
| Field Name |    Type     |    Description    |
+============+=============+===================+
| username   | ``STRING``  | Username.         |
+------------+-------------+-------------------+
| is_admin   | ``BOOLEAN`` | New admin status. |
+------------+-------------+-------------------+

===========================

.. _mlflowAuthServiceDeleteUser:

Delete User
===========

+-----------------------------+-------------+
|          Endpoint           | HTTP Method |
+=============================+=============+
| ``2.0/mlflow/users/delete`` | ``DELETE``  |
+-----------------------------+-------------+

.. _mlflowDeleteUser:

Request Structure
-----------------

+------------+------------+-------------+
| Field Name |    Type    | Description |
+============+============+=============+
| username   | ``STRING`` | Username.   |
+------------+------------+-------------+

===========================

.. _mlflowAuthServiceCreateExperimentPermission:

Create Experiment Permission
============================

+-----------------------------------------------+-------------+
|                   Endpoint                    | HTTP Method |
+===============================================+=============+
| ``2.0/mlflow/experiments/permissions/create`` | ``POST``    |
+-----------------------------------------------+-------------+

.. _mlflowCreateExperimentPermission:

Request Structure
-----------------

+---------------+-------------------------+----------------------+
|  Field Name   |          Type           |     Description      |
+===============+=========================+======================+
| experiment_id | ``STRING``              | Experiment id.       |
+---------------+-------------------------+----------------------+
| username      | ``STRING``              | Username.            |
+---------------+-------------------------+----------------------+
| permission    | :ref:`mlflowPermission` | Permission to grant. |
+---------------+-------------------------+----------------------+

.. _mlflowCreateExperimentPermissionResponse:

Response Structure
------------------

+-----------------------+-----------------------------------+----------------------------------+
|      Field Name       |               Type                |           Description            |
+=======================+===================================+==================================+
| experiment_permission | :ref:`mlflowExperimentPermission` | An experiment permission object. |
+-----------------------+-----------------------------------+----------------------------------+

===========================

.. _mlflowAuthServiceGetExperimentPermission:

Get Experiment Permission
=========================

+--------------------------------------------+-------------+
|                  Endpoint                  | HTTP Method |
+============================================+=============+
| ``2.0/mlflow/experiments/permissions/get`` | ``GET``     |
+--------------------------------------------+-------------+

.. _mlflowGetExperimentPermission:

Request Structure
-----------------

+---------------+------------+----------------+
|  Field Name   |    Type    |  Description   |
+===============+============+================+
| experiment_id | ``STRING`` | Experiment id. |
+---------------+------------+----------------+
| username      | ``STRING`` | Username.      |
+---------------+------------+----------------+

.. _mlflowGetExperimentPermissionResponse:

Response Structure
------------------

+-----------------------+-----------------------------------+----------------------------------+
|      Field Name       |               Type                |           Description            |
+=======================+===================================+==================================+
| experiment_permission | :ref:`mlflowExperimentPermission` | An experiment permission object. |
+-----------------------+-----------------------------------+----------------------------------+

===========================

.. _mlflowAuthServiceUpdateExperimentPermission:

Update Experiment Permission
============================

+-----------------------------------------------+-------------+
|                   Endpoint                    | HTTP Method |
+===============================================+=============+
| ``2.0/mlflow/experiments/permissions/update`` | ``PATCH``   |
+-----------------------------------------------+-------------+

.. _mlflowUpdateExperimentPermission:

Request Structure
-----------------

+---------------+-------------------------+--------------------------+
|  Field Name   |          Type           |       Description        |
+===============+=========================+==========================+
| experiment_id | ``STRING``              | Experiment id.           |
+---------------+-------------------------+--------------------------+
| username      | ``STRING``              | Username.                |
+---------------+-------------------------+--------------------------+
| permission    | :ref:`mlflowPermission` | New permission to grant. |
+---------------+-------------------------+--------------------------+

===========================

.. _mlflowAuthServiceDeleteExperimentPermission:

Delete Experiment Permission
============================

+-----------------------------------------------+-------------+
|                   Endpoint                    | HTTP Method |
+===============================================+=============+
| ``2.0/mlflow/experiments/permissions/delete`` | ``DELETE``  |
+-----------------------------------------------+-------------+

.. _mlflowDeleteExperimentPermission:

Request Structure
-----------------

+---------------+------------+----------------+
|  Field Name   |    Type    |  Description   |
+===============+============+================+
| experiment_id | ``STRING`` | Experiment id. |
+---------------+------------+----------------+
| username      | ``STRING`` | Username.      |
+---------------+------------+----------------+

===========================

.. _mlflowAuthServiceCreateRegisteredModelPermission:

Create Registered Model Permission
==================================

+-----------------------------------------------------+-------------+
|                      Endpoint                       | HTTP Method |
+=====================================================+=============+
| ``2.0/mlflow/registered-models/permissions/create`` | ``CREATE``  |
+-----------------------------------------------------+-------------+

.. _mlflowCreateRegisteredModelPermission:

Request Structure
-----------------

+------------+-------------------------+------------------------+
| Field Name |          Type           |      Description       |
+============+=========================+========================+
| name       | ``STRING``              | Registered model name. |
+------------+-------------------------+------------------------+
| username   | ``STRING``              | Username.              |
+------------+-------------------------+------------------------+
| permission | :ref:`mlflowPermission` | Permission to grant.   |
+------------+-------------------------+------------------------+

.. _mlflowCreateRegisteredModelPermissionResponse:

Response Structure
------------------

+-----------------------------+----------------------------------------+---------------------------------------+
|         Field Name          |                  Type                  |              Description              |
+=============================+========================================+=======================================+
| registered_model_permission | :ref:`mlflowRegisteredModelPermission` | A registered model permission object. |
+-----------------------------+----------------------------------------+---------------------------------------+

===========================

.. _mlflowAuthServiceGetRegisteredModelPermission:

Get Registered Model Permission
===============================

+--------------------------------------------------+-------------+
|                     Endpoint                     | HTTP Method |
+==================================================+=============+
| ``2.0/mlflow/registered-models/permissions/get`` | ``GET``     |
+--------------------------------------------------+-------------+

.. _mlflowGetRegisteredModelPermission:

Request Structure
-----------------

+------------+------------+------------------------+
| Field Name |    Type    |      Description       |
+============+============+========================+
| name       | ``STRING`` | Registered model name. |
+------------+------------+------------------------+
| username   | ``STRING`` | Username.              |
+------------+------------+------------------------+

.. _mlflowGetRegisteredModelPermissionResponse:

Response Structure
------------------

+-----------------------------+----------------------------------------+---------------------------------------+
|         Field Name          |                  Type                  |              Description              |
+=============================+========================================+=======================================+
| registered_model_permission | :ref:`mlflowRegisteredModelPermission` | A registered model permission object. |
+-----------------------------+----------------------------------------+---------------------------------------+

===========================

.. _mlflowAuthServiceUpdateRegisteredModelPermission:

Update Registered Model Permission
==================================

+-----------------------------------------------------+-------------+
|                      Endpoint                       | HTTP Method |
+=====================================================+=============+
| ``2.0/mlflow/registered-models/permissions/update`` | ``PATCH``   |
+-----------------------------------------------------+-------------+

.. _mlflowUpdateRegisteredModelPermission:

Request Structure
-----------------

+------------+-------------------------+--------------------------+
| Field Name |          Type           |       Description        |
+============+=========================+==========================+
| name       | ``STRING``              | Registered model name.   |
+------------+-------------------------+--------------------------+
| username   | ``STRING``              | Username.                |
+------------+-------------------------+--------------------------+
| permission | :ref:`mlflowPermission` | New permission to grant. |
+------------+-------------------------+--------------------------+

===========================

.. _mlflowAuthServiceDeleteRegisteredModelPermission:

Delete Registered Model Permission
==================================

+-----------------------------------------------------+-------------+
|                      Endpoint                       | HTTP Method |
+=====================================================+=============+
| ``2.0/mlflow/registered-models/permissions/delete`` | ``DELETE``  |
+-----------------------------------------------------+-------------+

.. _mlflowDeleteRegisteredModelPermission:

Request Structure
-----------------

+------------+------------+------------------------+
| Field Name |    Type    |      Description       |
+============+============+========================+
| name       | ``STRING`` | Registered model name. |
+------------+------------+------------------------+
| username   | ``STRING`` | Username.              |
+------------+------------+------------------------+


.. _auth-rest-struct:

Data Structures
===============


.. _mlflowUser:

User
----

+------------------------------+----------------------------------------------------+------------------------------------------------------------------+
|          Field Name          |                        Type                        |                            Description                           |
+==============================+====================================================+==================================================================+
| id                           | ``STRING``                                         | User ID.                                                         |
+------------------------------+----------------------------------------------------+------------------------------------------------------------------+
| username                     | ``STRING``                                         | Username.                                                        |
+------------------------------+----------------------------------------------------+------------------------------------------------------------------+
| is_admin                     | ``BOOLEAN``                                        | Whether the user is an admin.                                    |
+------------------------------+----------------------------------------------------+------------------------------------------------------------------+
| experiment_permissions       | An array of :ref:`mlflowExperimentPermission`      | All experiment permissions explicitly granted to the user.       |
+------------------------------+----------------------------------------------------+------------------------------------------------------------------+
| registered_model_permissions | An array of :ref:`mlflowRegisteredModelPermission` | All registered model permissions explicitly granted to the user. |
+------------------------------+----------------------------------------------------+------------------------------------------------------------------+

.. _mlflowPermission:

Permission
----------

Permission of a user to an experiment or a registered model.

+----------------+--------------------------------------+
|      Name      |             Description              |
+================+======================================+
| READ           | Can read.                            |
+----------------+--------------------------------------+
| EDIT           | Can read and update.                 |
+----------------+--------------------------------------+
| MANAGE         | Can read, update, delete and manage. |
+----------------+--------------------------------------+
| NO_PERMISSIONS | No permissions.                      |
+----------------+--------------------------------------+

.. _mlflowExperimentPermission:

ExperimentPermission
--------------------

+---------------+-------------------------+---------------------+
|  Field Name   |          Type           |     Description     |
+===============+=========================+=====================+
| experiment_id | ``STRING``              | Experiment id.      |
+---------------+-------------------------+---------------------+
| user_id       | ``STRING``              | User id.            |
+---------------+-------------------------+---------------------+
| permission    | :ref:`mlflowPermission` | Permission granted. |
+---------------+-------------------------+---------------------+

.. _mlflowRegisteredModelPermission:

RegisteredModelPermission
-------------------------

+------------+-------------------------+------------------------+
| Field Name |          Type           |      Description       |
+============+=========================+========================+
| name       | ``STRING``              | Registered model name. |
+------------+-------------------------+------------------------+
| user_id    | ``STRING``              | User id.               |
+------------+-------------------------+------------------------+
| permission | :ref:`mlflowPermission` | Permission granted.    |
+------------+-------------------------+------------------------+
```

--------------------------------------------------------------------------------

---[FILE: index.rst]---
Location: mlflow-master/docs/api_reference/source/java_api/index.rst

```text
.. _java_api:

Java API
==========

This file is a placeholder. Javadoc is filled in by the build-javadoc.sh script, executed during "make html".
```

--------------------------------------------------------------------------------

---[FILE: languagesections.js]---
Location: mlflow-master/docs/api_reference/source/languagesections/languagesections.js

```javascript

$(function() {

  $('div.code-section').each(function() {
    var example_sel = $('<ul />', { class: 'section-selector' });
    var i = 0;
    $('div[class^="highlight-"]', this).each(function() {
      language_name = $(this).attr('class').substring(10).replace('notranslate', '');
      language_name = language_name.charAt(0).toUpperCase() + language_name.substr(1);

      var sel_item = $('<li />', {
          class: $(this).attr('class'),
          text: language_name
      });
      if (i++) {
        $(this).hide();
      } else {
        sel_item.addClass('selected');
      }
      example_sel.append(sel_item);
      $(this).addClass('example');
    });
    $(this).prepend(example_sel);
    example_sel = null;
    i = null;
  });

  $('div.plain-section').each(function() {
    var example_sel = $('<ul />', { class: 'section-selector' });
    var i = 0;
    $('div.container', this).each(function() {
      var language_name = $(this).attr('class').replace(' docutils container', '').trim();
      language_name = language_name.charAt(0).toUpperCase() + language_name.substr(1);

      var sel_item = $('<li />', {
          class: $(this).attr('class'),
          text: language_name
      });
      if (i++) {
        $(this).hide();
      } else {
        sel_item.addClass('selected');
      }
      example_sel.append(sel_item);
      $(this).addClass('example');
    });
    $(this).prepend(example_sel);
    example_sel = null;
    i = null;
  });

  $('div.code-section ul.section-selector li,div.plain-section ul.section-selector li').click(function(evt) {
    evt.preventDefault();

    var sel_class = $(this).attr('class')
      .replace(' docutils container', '')
      .replace('notranslate', '')
      .replace(' selected', '');

    $('ul.section-selector li').each(function() {
      var parent = $(this).parent().parent();
      var my_sel_class = sel_class;
      // When the target language is not available, default to bash or python.
      if (!$('div.' + sel_class, parent).length) {
        if ($('div.highlight-bash', parent).length)
          my_sel_class = 'highlight-bash';
        else
          my_sel_class = 'highlight-python';
      }

      $('div.example', parent).hide();
      $('div.' + my_sel_class, parent).show();

      $('ul.section-selector li', parent).removeClass('selected');
      $('ul.section-selector li.' + my_sel_class, parent).addClass('selected');
    });
  });

});
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/docs/api_reference/source/languagesections/__init__.py

```python
import os

from docutils import nodes
from docutils.parsers.rst import Directive
from sphinx.util import logging
from sphinx.util.osutil import copyfile

logger = logging.getLogger(__name__)

JS_FILE = "languagesections.js"


class CodeSectionDirective(Directive):
    has_content = True

    def run(self):
        self.assert_has_content()
        text = "\n".join(self.content)
        node = nodes.container(text)
        node["classes"].append("code-section")
        self.add_name(node)
        self.state.nested_parse(self.content, self.content_offset, node)
        return [node]


class PlainSectionDirective(Directive):
    has_content = True

    def run(self):
        self.assert_has_content()
        text = "\n".join(self.content)
        node = nodes.container(text)
        node["classes"].append("plain-section")
        self.add_name(node)
        self.state.nested_parse(self.content, self.content_offset, node)
        return [node]


def add_assets(app):
    app.add_js_file(JS_FILE)


def copy_assets(app, exception):
    if app.builder.name != "html" or exception:
        return
    logger.info("Copying examplecode stylesheet/javascript... ", nonl=True)
    dest = os.path.join(app.builder.outdir, "_static", JS_FILE)
    source = os.path.join(os.path.abspath(os.path.dirname(__file__)), JS_FILE)
    copyfile(source, dest)
    logger.info("done")


def setup(app):
    app.add_directive("code-section", CodeSectionDirective)
    app.add_directive("plain-section", PlainSectionDirective)
    app.connect("builder-inited", add_assets)
    app.connect("build-finished", copy_assets)
```

--------------------------------------------------------------------------------

---[FILE: index.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/index.rst

```text
.. _python-api:

Python API
==========

The MLflow Python API is organized into the following modules. The most common functions are
exposed in the :py:mod:`mlflow` module, so we recommend starting there.

.. toctree::
  :glob:
  :maxdepth: 1

  *


See also the :ref:`index of all functions and classes<genindex>`.

Log Levels
----------

MLflow Python APIs log information during execution using the Python Logging API. You can 
configure the log level for MLflow logs using the following code snippet. Learn more about Python
log levels at the
`Python language logging guide <https://docs.python.org/3/howto/logging.html>`_.

.. code-block:: python

    import logging

    logger = logging.getLogger("mlflow")

    # Set log level to debugging
    logger.setLevel(logging.DEBUG)
```

--------------------------------------------------------------------------------

---[FILE: mlflow.ag2.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.ag2.rst

```text
mlflow.ag2
==========

.. automodule:: mlflow.ag2
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.agno.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.agno.rst

```text
mlflow.agno
==================

.. automodule:: mlflow.agno
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.anthropic.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.anthropic.rst

```text
mlflow.anthropic
================

.. automodule:: mlflow.anthropic
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.artifacts.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.artifacts.rst

```text
mlflow.artifacts
================

.. automodule:: mlflow.artifacts
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.autogen.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.autogen.rst

```text
mlflow.autogen
==============

.. automodule:: mlflow.autogen
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.bedrock.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.bedrock.rst

```text
mlflow.bedrock
==============

.. automodule:: mlflow.bedrock
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.catboost.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.catboost.rst

```text
mlflow.catboost
===============

.. automodule:: mlflow.catboost
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.client.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.client.rst

```text
.. _mlflow.tracking:

mlflow.client
===============

.. automodule:: mlflow.client
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.config.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.config.rst

```text
mlflow.config
==============

.. automodule:: mlflow.config
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.crewai.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.crewai.rst

```text
mlflow.crewai
==============

.. automodule:: mlflow.crewai
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

````

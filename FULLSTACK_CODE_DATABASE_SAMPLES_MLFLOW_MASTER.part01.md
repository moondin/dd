---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 1
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 1 of 991)

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

---[FILE: .dockerignore]---
Location: mlflow-master/.dockerignore

```text
.git
mlruns
docs
apidocs
mlflow.Rcheck
outputs
examples

dev
# required for Docker build
!requirements/test-requirements.txt
!requirements/lint-requirements.txt
!requirements/extra-ml-requirements.txt

tests
# required for Docker build
!tests/resources/mlflow-test-plugin/

node_modules
coverage
build
npm-debug.log*
yarn-debug.log*
yarn-error.log*
__pycache__
.*
~*
*.swp
*.pyc
```

--------------------------------------------------------------------------------

---[FILE: .git-blame-ignore-revs]---
Location: mlflow-master/.git-blame-ignore-revs

```text
# Since git version 2.23, git-blame has a feature to ignore
# certain commits.
#
# This file contains a list of commits that are not likely what
# you are looking for in `git blame`. You can set this file as
# a default ignore file for blame by running the following
# command.
#
# $ git config blame.ignoreRevsFile .git-blame-ignore-revs

# PR: https://github.com/mlflow/mlflow/pull/3191
# Commit: https://github.com/mlflow/mlflow/commit/d743a40426d5dedbde395a4e6bbdeebadbccd4dc
# Migrate code style to Black
d743a40426d5dedbde395a4e6bbdeebadbccd4dc

# PR: https://github.com/mlflow/mlflow/pull/5548
# Commit: https://github.com/mlflow/mlflow/commit/43c15f7aea7ca737ce41c02d1d5e996006aa3006
# Upgrade Black version to 22.3.0
43c15f7aea7ca737ce41c02d1d5e996006aa3006

# https://github.com/mlflow/mlflow/pull/9409
5ed36a0f88def458496382777620e9a5ebcf0f2a

# https://github.com/mlflow/mlflow/pull/9424
9df7c92567c22b00374396ec5a18cb66ea9b8a0c
```

--------------------------------------------------------------------------------

---[FILE: .gitattributes]---
Location: mlflow-master/.gitattributes

```text
* text=auto eol=lf

# Collapse auto-generated Python stub files in pull request diffs on GitHub
mlflow/protos/**/*.pyi linguist-generated=true
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: mlflow-master/.gitignore

```text
# MLflow
mlruns/
mlartifacts/
outputs/
mlruns.db
mlflow.db
**/basic_auth.db

# Mac
.DS_Store

# Byte-compiled / optimized / DLL files
__pycache__
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST
node_modules
yarn-error.log
.docusaurus
*-ipynb.mdx
docs/src/api_modules.json
docs/static/api_reference

# PyInstaller
#  Usually these files are written by a python script from a template
#  before PyInstaller builds the exe, so as to inject date/other infos into it.
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
.hypothesis/
.pytest_cache/
.deepeval/

# Sphinx documentation
docs/_build/

# Jupyter Notebook
.ipynb_checkpoints

# Environments
env
env3
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/
dev-env-setup-progress

# Editor files
.*project
*.swp
*.swo
*.idea
*.iml
*~

# vscode
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json

# mkdocs documentation
/site

# mypy
.mypy_cache/

# java targets
target/

# R notebooks
.Rproj.user
example/tutorial/R/*.nb.html

# travis_wait command logs
travis_wait*.log

# Pytorch logs
lightning_logs

# Downloaded datasets
examples/pytorch/*/data/

a.py
a.ipynb
a.md

# Log file created by pre-commit hook for black
.black.log

# Pytest-monitor load testing DB file
*.pymon

# Ignore a gunicorn config file
gunicorn.conf.py

# ignore everything in .claude
.claude/*
# except commands and skills
!.claude/commands/
!.claude/skills/
!.claude/hooks/
!.claude/settings.json
```

--------------------------------------------------------------------------------

---[FILE: .pre-commit-config.yaml]---
Location: mlflow-master/.pre-commit-config.yaml

```yaml
minimum_pre_commit_version: 4.0.1
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
        files: \.(mdx|ya?ml|txt)$
      - id: end-of-file-fixer
        files: \.(txt|sh|rst)$
        exclude: ^examples/|^mlflow/protos/opentelemetry/
      - id: check-vcs-permalinks
        files: \.py$
        require_serial: true
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: "v2.7.1"
    hooks:
      - id: prettier
        files: '^(?!docs/|mlflow/server/js/|libs/typescript/).+\.(js|ts|md|json|ya?ml)$'
        require_serial: true

  - repo: local
    hooks:
      - id: normalize-chars
        name: normalize-chars
        entry: uv run --only-group lint dev/normalize_chars.py
        language: system
        stages: [pre-commit]
        types: [text]
        exclude: '^mlflow/server/js/|^docs/api_reference/source/R-api\.rst$'
        require_serial: true

      - id: ruff
        name: ruff
        entry: uv run --only-group lint dev/ruff.py
        language: system
        files: '\.(py|ipynb)$'
        stages: [pre-commit]
        require_serial: true

      - id: format
        name: format
        entry: uv run --only-group lint dev/format.py
        language: system
        files: '\.(py|ipynb)$'
        stages: [pre-commit]
        require_serial: true

      - id: mypy
        name: mypy
        language: system
        files: '^dev/clint/.*\.py$'
        entry: uv run --only-group lint mypy
        require_serial: true

      - id: blacken-docs
        name: blacken-docs
        entry: uv run --only-group lint blacken-docs
        language: system
        files: '\.(rst|md|mdx)$'
        stages: [pre-commit]
        require_serial: true

      - id: clint
        name: clint
        entry: uv run --only-group lint clint
        language: system
        files: '\.(py|ipynb|rst|mdx?)$'
        stages: [pre-commit]
        require_serial: true

      - id: install-bin
        name: install-bin
        entry: uv run --only-group lint bin/install.py
        language: system
        stages: [pre-commit]
        require_serial: true
        pass_filenames: false

      - id: taplo
        name: taplo
        entry: bin/taplo format
        language: system
        files: '\.toml$'
        stages: [pre-commit]
        require_serial: true

      - id: must-have-signoff
        name: must-have-signoff
        entry: 'grep "Signed-off-by:"'
        language: system
        stages: [prepare-commit-msg]
        require_serial: true

      - id: mlflow-typo
        name: mlflow-typo
        entry: dev/mlflow-typo.sh
        language: system
        stages: [pre-commit]
        require_serial: true

      - id: check-mlflow-ui
        name: check-mlflow-ui
        entry: |
          bash -c '
            if bin/rg "mlflow ui" --line-number --with-filename "$@"; then
              echo
              echo "Error - Use \"mlflow server\" instead of \"mlflow ui\""
              exit 1
            fi
          ' --
        language: system
        stages: [pre-commit]
        require_serial: true
        types: [text]
        exclude: |
          (?x)^(
            \.pre-commit-config\.yaml|
            CHANGELOG\.md|
            docs/api_reference/source/R-api\.rst|
            examples/llms/RAG/.*\.(json|csv)|
            mlflow/cli/__init__\.py|
            mlflow/R/mlflow/.*|
            tests/test_cli\.py
          )$

      - id: pyproject
        name: pyproject
        entry: uv run --only-group lint dev/pyproject.py
        language: system
        stages: [pre-commit]
        require_serial: true
        pass_filenames: false

      - id: mlver
        name: ml-package-versions-consistency
        entry: "uv run --only-group lint dev/update_ml_package_versions.py --skip-yml"
        files: '^(mlflow/ml-package-versions\.yml|mlflow/ml_package_versions\.py)$'
        language: system
        stages: [pre-commit]
        require_serial: true
        pass_filenames: false

      - id: lint-proto
        name: lint-proto
        entry: dev/lint-proto.sh
        files: '\.proto$'
        language: system
        stages: [pre-commit]
        require_serial: true

      - id: buf
        name: buf
        entry: bin/buf format -d -w --exit-code --exclude-path mlflow/protos/opentelemetry mlflow/protos
        files: '\.proto$'
        language: system
        stages: [pre-commit]
        require_serial: true
        pass_filenames: false

      - id: typos
        name: typos
        entry: bin/typos --format brief --force-exclude --color never
        files: '\.(py$|mdx?$)'
        language: system
        stages: [pre-commit]
        require_serial: true

      - id: conftest
        name: conftest
        entry: bin/conftest test --namespace mlflow --policy .github/policy.rego
        files: '^\.github/(workflows|actions)/.*\.ya?ml$'
        exclude: '^\.github/workflows/copilot-setup-steps\.yml$'
        language: system
        stages: [pre-commit]
        require_serial: true

      - id: regal
        name: regal
        entry: bin/regal lint
        files: '\.rego$'
        language: system
        stages: [pre-commit]
        require_serial: true

      - id: check-init-py
        name: check-init-py
        entry: uv run --only-group lint dev/check_init_py.py
        language: system
        files: '^(mlflow|tests)/.*\.py$'
        stages: [pre-commit]
        require_serial: true
        pass_filenames: false

      - id: uv-lock
        name: uv-lock
        entry: uv lock
        language: system
        files: '^pyproject\.toml$'
        stages: [pre-commit]
        require_serial: true
        pass_filenames: false

      - id: forbid-gif
        name: forbid-gif
        language: fail
        entry: "Please use MP4 instead of GIF for docs animations"
        files: ^docs/.*\.gif$
        stages: [pre-commit]
```

--------------------------------------------------------------------------------

---[FILE: .python-version]---
Location: mlflow-master/.python-version

```text
3.10
```

--------------------------------------------------------------------------------

````

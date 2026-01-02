---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 18
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 18 of 991)

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

---[FILE: dev-env-setup.sh]---
Location: mlflow-master/dev/dev-env-setup.sh

```bash
#!/usr/bin/env bash

MLFLOW_HOME="$(pwd)"
directory="$MLFLOW_HOME/.venvs/mlflow-dev"
REPO_ROOT=$(git rev-parse --show-toplevel)
rd="$REPO_ROOT/requirements"
VENV_DIR="$directory/bin/activate"
# Progress file to resume the script from where it exited previously
PROGRESS_FILE="$MLFLOW_HOME/dev-env-setup-progress"

showHelp() {
cat << EOF
Usage: ./install-dev-env.sh [-d] [directory to install virtual environment] [-v] [-q] [-f] [-o] [override python version]
Development environment setup script for Python in linux-based Operating Systems (including OSX).
Note: this script will not work on Windows or MacOS M1 arm64 chipsets.

This script will:

  - Install pyenv if not installed
  - Retrieve the appropriate Python version (minimum required) for compatibility support
  - Check if the virtual environment already exists
    - If it does, prompt for replacement
      - If replacing, delete old virtual environment.
  - Create a virtual environment using the minimum required Python version based on previous step logic
  - Activate the environment
  - Install required dependencies for the dev environment

  Example usage:

  From root of MLflow repository on local with a destination virtualenv path of <REPO_ROOT>/.venvs/mlflow-dev:

  dev/dev-env-setup.sh -d $(pwd)/.venvs/mlflow-dev

  Note: it is recommended to preface virtualenv locations with a directory name prefaced by '.' (i.e., ".venvs").

  The default environment setup is for basic functionality, installing the minimum development requirements dependencies.
  To install the full development environment that supports working on all flavors and running all tests locally, set
  the flag '-f' or '--full'

-h,     --help        Display help

-d,     --directory   The path to install the virtual environment into

-f,     --full        Whether to install all dev requirements (Default: false)

-q,     --quiet       Whether to have pip install in quiet mode (Default: false)

-o,     --override    Override the python version

-c,     --clean       Discard the previous installation progress and restart the setup from scratch

EOF
}

while :
do
  case "$1" in
    -d | --directory)
      directory="$2"
      shift 2
      ;;
    -f | --full)
      full="full"
      shift
      ;;
    -q | --quiet)
      quiet="quiet"
      shift
      ;;
    -o | --override)
      override_py_ver="$2"
      shift 2
      ;;
    -h | --help)
      showHelp
      exit 0
      ;;
    -c | --clean)
      rm $PROGRESS_FILE
      shift
      ;;
    --)
      shift
      break
      ;;
    -*)
      echo "Error: unknown option: $1" >&2
      exit 1
      ;;
    *)
      break
      ;;
  esac
done

if [[ -n "$verbose" ]]; then
  set -exv
fi

# Acquire the OS for this environment
case "$(uname -s)" in
  Darwin*)                       machine=mac;;
  Linux*)                        machine=linux;;
  *)                             machine=unknown;;
esac

load_progress() {
  if [[ ! -f "$PROGRESS_FILE" ]]; then
    echo "0" > "$PROGRESS_FILE"
  fi
  cat "$PROGRESS_FILE"
}

PROGRESS=$(load_progress)

save_progress() {
  echo "$1" > "$PROGRESS_FILE"
  PROGRESS=$(load_progress)
}

quiet_command(){
  echo $( [[ -n $quiet ]] && printf %s '-q' )
}

minor_to_micro() {
  case $1 in
    "3.10") echo "3.10.13" ;;
  esac
}

# Check if brew is installed and install it if it isn't present
# Note: if xcode isn't installed, this will fail.
# $1: name of package that requires brew
check_and_install_brew() {
  # command -v returns exit code 1 if brew does not exist, which directly terminates our test script.
  # Appending `|| true` to ignore the exit code.
  if [ -z "$(command -v brew || true)" ]; then
    echo "Homebrew is required to install $1 on MacOS. Installing in your home directory."
    bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
  echo "Updating brew..."
  brew update
}

# Compare two version numbers
# Usage: version_gt version1 version2
# Returns 0 (true) if version1 > version2, 1 (false) otherwise
version_gt() {
    IFS='.' read -ra VER1 <<< "$1"
    IFS='.' read -ra VER2 <<< "$2"

    # Compare each segment of the version numbers
    for (( i=0; i<"${#VER1[@]}"; i++ )); do
        # If VER2 is shorter and we haven't found a difference yet, VER1 is greater
        if [[ -z ${VER2[i]} ]]; then
            return 0
        fi

        # If some segments are not equal, return their comparison result
        if (( ${VER1[i]} > ${VER2[i]} )); then
            return 0
        elif (( ${VER1[i]} < ${VER2[i]} )); then
            return 1
        fi
    done

    # If all common length segments are same, the one with more segments is greater
    return $(( ${#VER1[@]} <= ${#VER2[@]} ))
}

# Check if pyenv is installed and offer to install it if not present
check_and_install_pyenv() {
  # command -v returns exit code 1 if pyenv does not exist, which directly terminates our test script.
  # Appending `|| true` to ignore the exit code.
  pyenv_exist=$(command -v pyenv || true)
  if [ -z "$pyenv_exist" ]; then
    if [ -z "$GITHUB_ACTIONS" ]; then
      read -p "pyenv is required to be installed to manage python versions. Would you like to install it? $(tput bold)(y/n)$(tput sgr0): " -n 1 -r
      echo
    fi
    if [[ $REPLY =~ ^[Yy]$ || -n "$GITHUB_ACTIONS" ]]; then
      if [[ "$machine" == mac ]]; then
        check_and_install_brew "pyenv"
        echo "Installing pyenv..."
        echo "Note: this will probably take a considerable amount of time."
        brew install pyenv
        brew install openssl readline sqlite3 xz zlib libomp
      elif [[ "$machine" == linux ]]; then
        sudo apt-get update -y
        sudo apt-get install -y make build-essential libssl-dev zlib1g-dev \
          libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
          libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
        # Install pyenv from source
        git clone --depth 1 https://github.com/pyenv/pyenv.git "$HOME/.pyenv"
        PYENV_ROOT="$HOME/.pyenv"
        PYENV_BIN="$PYENV_ROOT/bin"
        PATH="$PYENV_BIN:$PATH"
        if [ -n "$GITHUB_ACTIONS" ]; then
          echo "$PYENV_BIN" >>"$GITHUB_PATH"
          echo "PYENV_ROOT=$PYENV_ROOT" >>"$GITHUB_ENV"
        fi
      else
        echo "Unsupported operating system environment: $machine. This setup script only supports MacOS and Linux. For other operating systems, please follow the manual setup instruction here: https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#manual-python-development-environment-configuration "
        exit 1
      fi
    else
      PYENV_README=https://github.com/pyenv/pyenv/blob/master/README.md
      echo "pyenv is required to use this environment setup script. Please install by following instructions here: $PYENV_README"
      exit 1
    fi
  fi
}

check_and_install_min_py_version() {
  # Get the minimum supported version for development purposes
  min_py_version="3.10"

  echo "The minimum version of Python to ensure backwards compatibility for MLflow development is: $(
    tput bold
    tput setaf 3
  )$min_py_version$(tput sgr0)"

  if [[ -n "$override_py_ver" ]]; then
    version_levels=$(grep -o '\.' <<<"$override_py_ver" | wc -l)
    if [[ $version_levels -eq 1 ]]; then
      PY_INSTALL_VERSION=$(minor_to_micro $override_py_ver)
    elif [[ $version_levels -eq 2 ]]; then
      PY_INSTALL_VERSION=$override_py_ver
    else
      echo "You must supply a python override version with either minor (e.g., '3.10') or micro (e.g., '3.10.13'). '$override_py_ver' is invalid."
      exit 1
    fi
  else
    PY_INSTALL_VERSION=$(minor_to_micro $min_py_version)
  fi

  echo "$(tput setaf 2) Installing Python version $(tput bold)$PY_INSTALL_VERSION$(tput sgr0)"

  # Install the Python version if it cannot be found
  pyenv install -s "$PY_INSTALL_VERSION"
  pyenv local "$PY_INSTALL_VERSION"
  pyenv exec pip install $(quiet_command) --upgrade pip
  pyenv exec pip install $(quiet_command) virtualenv
}

# Check if the virtualenv already exists at the specified path
create_virtualenv() {
  if [[ -d "$directory" ]]; then
    if [ -z "$GITHUB_ACTIONS" ]; then
      read -p "A virtual environment is already located at $directory. Do you wish to replace it? $(
        tput bold
        tput setaf 2
      )(y/n) $(tput sgr0)" -n 1 -r
      echo
    fi
    if [[ $REPLY =~ ^[Yy]$ || -n "$GITHUB_ACTIONS" ]]; then
      echo "Replacing Virtual environment in '$directory'. Installing new instance."
      pyenv exec virtualenv --clear "$directory"
    fi
  else
    # Create a virtual environment with the specified Python version
    pyenv exec virtualenv --python "$PY_INSTALL_VERSION" "$directory"
  fi

  # Activate the virtual environment
  # shellcheck disable=SC1090
  source "$VENV_DIR"

  echo "$(tput setaf 2)Current Python version: $(tput bold)$(python --version)$(tput sgr0)"
  echo "$(tput setaf 3)Activated environment is located: $(tput bold) $directory/bin/activate$(tput sgr0)"
}

# Install mlflow dev version and required dependencies
install_mlflow_and_dependencies() {
  # Install current checked out version of mlflow (local)
  pip install -e .[extras]

  echo "Installing pip dependencies for development environment."
  if [[ -n "$full" ]]; then
    # Install dev requirements
    pip install -r "$rd/dev-requirements.txt"
    # Install test plugin
    pip install -e "$MLFLOW_HOME/tests/resources/mlflow-test-plugin"
  else
    files=("$rd/test-requirements.txt" "$rd/lint-requirements.txt" "$rd/doc-requirements.txt")
    for r in "${files[@]}"; do
      pip install -r "$r"
    done
  fi
  echo "Finished installing pip dependencies."

  echo "$(
    tput setaf 2
    tput smul
  )Python packages that have been installed:$(tput rmul)"
  echo "$(pip freeze)$(tput sgr0)"
}

check_docker() {
   command -v docker >/dev/null 2>&1 || echo "$(
    tput bold
    tput setaf 1
  )A docker installation cannot be found. Docker is optional but you may need it for developing some features and running all tests locally. $(tput sgr0)"
}

# Check if pandoc with required version is installed and offer to install it if not present
check_and_install_pandoc() {
  pandoc_version=$(pandoc --version | grep "pandoc" | awk '{print $2}')
  if [[ -z "$pandoc_version" ]] || ! version_gt "$pandoc_version" "2.2.1"; then
    if [ -z "$GITHUB_ACTIONS" ]; then
      read -p "Pandoc version 2.2.1 or above is an optional requirement for compiling documentation. Would you like to install it? $(tput bold)(y/n)$(tput sgr0): " -n 1 -r
      echo
    fi

    if [[ $REPLY =~ ^[Yy]$ || -n "$GITHUB_ACTIONS" ]]; then
      echo "Installing Pandoc..."
      if [[ "$machine" == mac ]]; then
        check_and_install_brew "pandoc"
        brew install pandoc
      elif [[ "$machine" == linux ]]; then
        # Install pandoc via deb package as `apt-get` gives too old version
        TEMP_DEB=$(mktemp) &&
          wget --directory-prefix $TEMP_DEB https://github.com/jgm/pandoc/releases/download/2.16.2/pandoc-2.16.2-1-amd64.deb &&
          sudo dpkg --install $(find $TEMP_DEB -name '*.deb') &&
          rm -rf $TEMP_DEB
      else
        echo "Unsupported operating system environment: $machine. This setup script only supports MacOS and Linux. For other operating systems, please follow the manual setup instruction here: https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#manual-python-development-environment-configuration "
        exit 1
      fi
    fi
  fi
}

# Set up pre-commit hooks and git environment configuration for proper signing of commits
set_pre_commit_and_git_signoff() {
  git_user=$(git config user.name)
  git_email=$(git config user.email)

  if [[ -z "$git_email" || -z "$git_user" ]]; then
    read -p "Your git environment is not setup to automatically sign your commits. Would you like to configure it? $(
      tput bold
      tput setaf 2
    )(y/n): $(tput sgr0)" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      read -p "Enter the user name you would like to have associated with your commit signature: " -r git_user_name
      echo
      git config --global user.name "$git_user_name"
      echo "Git user name set as: $(git config user.name)"
      read -p "Enter your email address for your commit signature: " -r git_user_email
      git config --global user.email "$git_user_email"
      echo "Git user email set as: $(git config user.email)"
    else
      echo "Failing to set git 'user.name' and 'user.email' will result in unsigned commits. Ensure that you sign commits manually for CI checks to pass."
    fi
  fi

  # Set up pre-commit hooks
  pre-commit install --install-hooks
}

# Execute mandatory setups with strict error handling
set +xv && set -e
# Mandatory setups
if [[ "$PROGRESS" -eq "0" ]]; then
  check_and_install_pyenv
  save_progress 1
fi
if [[ "$PROGRESS" -eq "1" ]]; then
  check_and_install_min_py_version
  save_progress 2
fi
if [[ "$PROGRESS" -eq "2" ]]; then
  create_virtualenv
  save_progress 3
fi
if [[ "$PROGRESS" -eq "3" ]]; then
  install_mlflow_and_dependencies
  save_progress 4
fi
if [[ "$PROGRESS" -eq "4" ]]; then
  set_pre_commit_and_git_signoff
  save_progress 5
fi
if [[ "$PROGRESS" -eq "5" ]]; then
  # Clear progress file if all mandatory steps are executed successfully
  rm $PROGRESS_FILE
fi

# Execute optional setups without strict error handling
set +exv
# Optional setups
check_and_install_pandoc
check_docker

echo "$(tput setaf 2)Your MLflow development environment can be activated by running: $(tput bold)source $VENV_DIR$(tput sgr0)"
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile.protos]---
Location: mlflow-master/dev/Dockerfile.protos

```text
FROM python:3.10-slim

WORKDIR /mlflow

# Copy only necessary files to compile protos
COPY mlflow/protos ./mlflow/protos/
COPY dev/generate_protos.py ./dev/generate_protos.py
COPY tests/protos ./tests/protos/
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile.protos.dockerignore]---
Location: mlflow-master/dev/Dockerfile.protos.dockerignore

```text
**/*_pb2.py
**/*.pyc
**/__pycache__/
*.class
*.jar
**/build
**/dist
**/*.egg-info
```

--------------------------------------------------------------------------------

---[FILE: extract_deps.py]---
Location: mlflow-master/dev/extract_deps.py

```python
import ast
import re
from pathlib import Path


def parse_dependencies(content: str) -> list[str]:
    pattern = r"dependencies\s*=\s*(\[[\s\S]*?\])"
    match = re.search(pattern, content)
    deps_str = match.group(1)
    return ast.literal_eval(deps_str)


def main():
    content = Path("pyproject.toml").read_text()
    dependencies = parse_dependencies(content)
    print("\n".join(dependencies))


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: find-unused-media.sh]---
Location: mlflow-master/dev/find-unused-media.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Find unused images and videos under docs/ (basename matching).
# Exits with 1 if unused images are found.
#
# Requires: git, ripgrep (rg)

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

if [[ -x "$repo_root/bin/rg" ]]; then
  rg="$repo_root/bin/rg"
elif command -v rg &> /dev/null; then
  rg="rg"
else
  echo "Error: ripgrep (rg) is not installed. Run 'python bin/install.py' first." >&2
  exit 1
fi

tmp_images="$(mktemp)"
tmp_image_map="$(mktemp)"
tmp_used="$(mktemp)"
trap 'rm -f "$tmp_images" "$tmp_image_map" "$tmp_used"' EXIT

# 1) List tracked files under docs/, then filter image extensions via grep
git ls-files docs/ \
  | grep -Ei '\.(png|jpe?g|gif|webp|ico|avif|mp4)$' \
  > "$tmp_images"

if [[ ! -s "$tmp_images" ]]; then
  echo "No tracked images under docs/."
  exit 0
fi

# basename<TAB>path
awk -F/ '{print $NF "\t" $0}' "$tmp_images" > "$tmp_image_map"

# 2) Extract used basenames from entire repo
"$rg" -o --no-heading --no-line-number \
  '[^"'\''[:space:]()]+\.(png|jpe?g|gif|webp|ico|avif|mp4)\b' \
  . \
  | sed 's#.*/##' \
  | sort -u \
  > "$tmp_used" || true

# 3) Compute unused (join by basename)
sort -k1,1 "$tmp_image_map" -o "$tmp_image_map"
sort "$tmp_used" -o "$tmp_used"

unused_paths="$(join -t $'\t' -v 1 "$tmp_image_map" "$tmp_used" | cut -f2)"

if [[ -z "$unused_paths" ]]; then
  echo "No unused media files" >&2
  exit 0
fi

echo "$unused_paths"
echo >&2
echo 'Unused media files found. Run `./dev/find-unused-media.sh | xargs rm` to remove them.' >&2
exit 1
```

--------------------------------------------------------------------------------

---[FILE: format.py]---
Location: mlflow-master/dev/format.py

```python
import os
import re
import subprocess
import sys

RUFF_FORMAT = [sys.executable, "-m", "ruff", "format"]
MESSAGE_REGEX = re.compile(r"^Would reformat: (.+)$")


def transform(stdout: str, is_maintainer: bool) -> str:
    if not stdout:
        return stdout
    transformed = []
    for line in stdout.splitlines():
        if m := MESSAGE_REGEX.match(line):
            path = m.group(1)
            command = (
                "`ruff format .` or comment `/autoformat`" if is_maintainer else "`ruff format .`"
            )
            # As a workaround for https://github.com/orgs/community/discussions/165826,
            # add fake line:column numbers (1:1)
            line = f"{path}:1:1: Unformatted file. Run {command} to format."

        transformed.append(line)
    return "\n".join(transformed) + "\n"


def main():
    if "NO_FIX" in os.environ:
        with subprocess.Popen(
            [
                *RUFF_FORMAT,
                "--check",
                *sys.argv[1:],
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        ) as prc:
            stdout, stderr = prc.communicate()
            is_maintainer = os.environ.get("IS_MAINTAINER", "false").lower() == "true"
            sys.stdout.write(transform(stdout, is_maintainer))
            sys.stderr.write(stderr)
            sys.exit(prc.returncode)
    else:
        with subprocess.Popen(
            [
                *RUFF_FORMAT,
                *sys.argv[1:],
            ]
        ) as prc:
            prc.communicate()
            sys.exit(prc.returncode)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: generate-protos.sh]---
Location: mlflow-master/dev/generate-protos.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Parse command line arguments
BUILD_ARGS=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-cache)
            BUILD_ARGS="--no-cache"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--no-cache]"
            exit 1
            ;;
    esac
done

if ! docker info >/dev/null 2>&1; then
    echo "Docker is not available. Please install Docker or start Docker daemon and try again."
    exit 1
fi

echo "Building Docker image for proto compilation..."
IMAGE_NAME="mlflow-protos-gen"
docker build -t "$IMAGE_NAME" -f dev/Dockerfile.protos $BUILD_ARGS .

echo "Running proto compilation..."
CONTAINER_NAME="mlflow-protos-gen-$$"
# Cleanup function to ensure container is always removed
cleanup() {
    echo "Cleaning up container..."
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
}
# Set trap to call cleanup on EXIT (normal or error)
trap cleanup EXIT

docker run --name "$CONTAINER_NAME" "$IMAGE_NAME" python dev/generate_protos.py

echo "Copying generated files back..."
docker cp "$CONTAINER_NAME:/mlflow/mlflow/protos/." "mlflow/protos/"
docker cp "$CONTAINER_NAME:/mlflow/tests/protos/." "tests/protos/"
docker cp "$CONTAINER_NAME:/mlflow/mlflow/java/client/src/main/java/." "mlflow/java/client/src/main/java/"

echo "Generating GraphQL schema from Protobuf files..."
uv run ./dev/proto_to_graphql/code_generator.py

echo "Done!"
```

--------------------------------------------------------------------------------

---[FILE: generate_protos.py]---
Location: mlflow-master/dev/generate_protos.py

```python
import platform
import subprocess
import tempfile
import textwrap
import urllib.request
import zipfile
from pathlib import Path
from typing import Literal

SYSTEM = platform.system()
MACHINE = platform.machine()
CACHE_DIR = Path(".cache/protobuf_cache")
MLFLOW_PROTOS_DIR = Path("mlflow/protos")
TEST_PROTOS_DIR = Path("tests/protos")
OTEL_PROTOS_DIR = Path("mlflow/protos/opentelemetry")


def gen_protos(
    proto_dir: Path,
    proto_files: list[Path],
    lang: Literal["python", "java"],
    protoc_bin: Path,
    protoc_include_paths: list[Path],
    out_dir: Path,
) -> None:
    assert lang in ["python", "java"]
    out_dir.mkdir(parents=True, exist_ok=True)
    subprocess.check_call(
        [
            protoc_bin,
            "--fatal_warnings",
            *(f"-I={p}" for p in protoc_include_paths),
            f"-I={proto_dir}",
            f"--{lang}_out={out_dir}",
            *[proto_dir / pf for pf in proto_files],
        ]
    )


def gen_stub_files(
    proto_dir: Path,
    proto_files: list[Path],
    protoc_bin: Path,
    protoc_include_paths: list[Path],
    out_dir: Path,
) -> None:
    subprocess.check_call(
        [
            protoc_bin,
            "--fatal_warnings",
            *(f"-I={p}" for p in protoc_include_paths),
            f"-I={proto_dir}",
            f"--pyi_out={out_dir}",
            *[proto_dir / pf for pf in proto_files],
        ]
    )


def apply_python_gencode_replacement(file_path: Path) -> None:
    content = file_path.read_text()

    for old, new in python_gencode_replacements:
        content = content.replace(old, new)

    file_path.write_text(content, encoding="UTF-8")


def _get_python_output_path(proto_file_path: Path) -> Path:
    return proto_file_path.parent / (proto_file_path.stem + "_pb2.py")


def to_paths(*args: str) -> list[Path]:
    return list(map(Path, args))


basic_proto_files = to_paths(
    "databricks.proto",
    "service.proto",
    "model_registry.proto",
    "databricks_artifacts.proto",
    "mlflow_artifacts.proto",
    "internal.proto",
    "scalapb/scalapb.proto",
    "assessments.proto",
    "datasets.proto",
    "webhooks.proto",
)
uc_proto_files = to_paths(
    "databricks_managed_catalog_messages.proto",
    "databricks_managed_catalog_service.proto",
    "databricks_uc_registry_messages.proto",
    "databricks_uc_registry_service.proto",
    "databricks_filesystem_service.proto",
    "unity_catalog_oss_messages.proto",
    "unity_catalog_oss_service.proto",
    "unity_catalog_prompt_messages.proto",
    "unity_catalog_prompt_service.proto",
)
tracing_proto_files = to_paths("databricks_tracing.proto")
facet_proto_files = to_paths("facet_feature_statistics.proto")
python_proto_files = basic_proto_files + uc_proto_files + facet_proto_files + tracing_proto_files
test_proto_files = to_paths("test_message.proto")


python_gencode_replacements = [
    (
        "from scalapb import scalapb_pb2 as scalapb_dot_scalapb__pb2",
        "from .scalapb import scalapb_pb2 as scalapb_dot_scalapb__pb2",
    ),
    (
        "import databricks_pb2 as databricks__pb2",
        "from . import databricks_pb2 as databricks__pb2",
    ),
    (
        "import databricks_uc_registry_messages_pb2 as databricks__uc__registry__messages__pb2",
        "from . import databricks_uc_registry_messages_pb2 as databricks_uc_registry_messages_pb2",
    ),
    (
        "import databricks_managed_catalog_messages_pb2 as databricks__managed__catalog__"
        "messages__pb2",
        "from . import databricks_managed_catalog_messages_pb2 as databricks_managed_"
        "catalog_messages_pb2",
    ),
    (
        "import unity_catalog_oss_messages_pb2 as unity__catalog__oss__messages__pb2",
        "from . import unity_catalog_oss_messages_pb2 as unity_catalog_oss_messages_pb2",
    ),
    (
        "import unity_catalog_prompt_messages_pb2 as unity__catalog__prompt__messages__pb2",
        "from . import unity_catalog_prompt_messages_pb2 as unity_catalog_prompt_messages_pb2",
    ),
    (
        "import service_pb2 as service__pb2",
        "from . import service_pb2 as service__pb2",
    ),
    (
        "import assessments_pb2 as assessments__pb2",
        "from . import assessments_pb2 as assessments__pb2",
    ),
    (
        "import datasets_pb2 as datasets__pb2",
        "from . import datasets_pb2 as datasets__pb2",
    ),
    (
        "import webhooks_pb2 as webhooks__pb2",
        "from . import webhooks_pb2 as webhooks__pb2",
    ),
]


def gen_python_protos(protoc_bin: Path, protoc_include_paths: list[Path], out_dir: Path) -> None:
    gen_protos(
        MLFLOW_PROTOS_DIR,
        python_proto_files,
        "python",
        protoc_bin,
        protoc_include_paths,
        out_dir,
    )

    gen_protos(
        TEST_PROTOS_DIR,
        test_proto_files,
        "python",
        protoc_bin,
        protoc_include_paths,
        out_dir,
    )

    for proto_file in python_proto_files:
        apply_python_gencode_replacement(out_dir / _get_python_output_path(proto_file))


def download_file(url: str, output_path: Path) -> None:
    urllib.request.urlretrieve(url, output_path)


def download_and_extract_protoc(version: Literal["3.19.4", "26.0"]) -> tuple[Path, Path]:
    """
    Download and extract specific version protoc tool for Linux systems,
    return extracted protoc executable file path and include path.
    """
    assert SYSTEM == "Linux", "This script only supports Linux systems."
    assert MACHINE in ["x86_64", "aarch64"], (
        "This script only supports x86_64 or aarch64 CPU architectures."
    )

    cpu_type = "x86_64" if MACHINE == "x86_64" else "aarch_64"
    protoc_zip_filename = f"protoc-{version}-linux-{cpu_type}.zip"

    downloaded_protoc_bin = CACHE_DIR / f"protoc-{version}" / "bin" / "protoc"
    downloaded_protoc_include_path = CACHE_DIR / f"protoc-{version}" / "include"
    if not (downloaded_protoc_bin.is_file() and downloaded_protoc_include_path.is_dir()):
        with tempfile.TemporaryDirectory() as t:
            zip_path = Path(t) / protoc_zip_filename
            download_file(
                f"https://github.com/protocolbuffers/protobuf/releases/download/v{version}/{protoc_zip_filename}",
                zip_path,
            )
            with zipfile.ZipFile(zip_path, "r") as zip_ref:
                zip_ref.extractall(CACHE_DIR / f"protoc-{version}")

        # Make protoc executable
        downloaded_protoc_bin.chmod(0o755)
    return downloaded_protoc_bin, downloaded_protoc_include_path


def generate_final_python_gencode(
    gencode3194_path: Path, gencode5260_path: Path, out_path: Path
) -> None:
    gencode3194 = gencode3194_path.read_text()
    gencode5260 = gencode5260_path.read_text()

    merged_code = f"""
import google.protobuf
from packaging.version import Version
if Version(google.protobuf.__version__).major >= 5:
{textwrap.indent(gencode5260, "  ")}
else:
{textwrap.indent(gencode3194, "  ")}
"""
    out_path.write_text(merged_code, encoding="UTF-8")


def main() -> None:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as temp_gencode_dir:
        temp_gencode_path = Path(temp_gencode_dir)
        proto3194_out = temp_gencode_path / "3.19.4"
        proto5260_out = temp_gencode_path / "26.0"
        proto3194_out.mkdir(exist_ok=True)
        proto5260_out.mkdir(exist_ok=True)

        protoc3194, protoc3194_include = download_and_extract_protoc("3.19.4")
        protoc5260, protoc5260_include = download_and_extract_protoc("26.0")

        # Build include paths list
        protoc3194_includes = [protoc3194_include, OTEL_PROTOS_DIR]
        protoc5260_includes = [protoc5260_include, OTEL_PROTOS_DIR]

        gen_python_protos(protoc3194, protoc3194_includes, proto3194_out)
        gen_python_protos(protoc5260, protoc5260_includes, proto5260_out)

        for proto_files, protos_dir in [
            (python_proto_files, MLFLOW_PROTOS_DIR),
            (test_proto_files, TEST_PROTOS_DIR),
        ]:
            for proto_file in proto_files:
                gencode_path = _get_python_output_path(proto_file)

                generate_final_python_gencode(
                    proto3194_out / gencode_path,
                    proto5260_out / gencode_path,
                    protos_dir / gencode_path,
                )

    # generate java gencode using pinned protoc 3.19.4 version.
    gen_protos(
        MLFLOW_PROTOS_DIR,
        basic_proto_files,
        "java",
        protoc3194,
        protoc3194_includes,
        Path("mlflow/java/client/src/main/java"),
    )

    gen_stub_files(
        MLFLOW_PROTOS_DIR,
        python_proto_files,
        protoc5260,
        protoc5260_includes,
        Path("mlflow/protos/"),
    )


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: install-common-deps.sh]---
Location: mlflow-master/dev/install-common-deps.sh

```bash
#!/usr/bin/env bash

set -ex

function retry-with-backoff() {
    for BACKOFF in 0 1 2; do
        sleep $BACKOFF
        if "$@"; then
            return 0
        fi
    done
    return 1
}

while :
do
  case "$1" in
    # Install skinny dependencies
    --skinny)
      SKINNY="true"
      shift
      ;;
    # Install ML dependencies
    --ml)
      ML="true"
      shift
      ;;
    --)
      shift
      break
      ;;
    -*)
      echo "Error: unknown option: $1" >&2
      exit 1
      ;;
    *)
      break
      ;;
  esac
done

# Cleanup apt repository to make room for tests.
sudo apt clean
df -h

python --version
pip install --upgrade pip!=25.1 setuptools wheel
pip --version

if [[ "$SKINNY" == "true" ]]; then
  pip install ./libs/skinny
else
  pip install .[extras,gateway,mcp] --upgrade
fi

req_files=""
# Install Python test dependencies only if we're running Python tests
if [[ "$ML" == "true" ]]; then
  req_files+=" -r requirements/extra-ml-requirements.txt"
fi

if [[ "$SKINNY" == "true" ]]; then
  req_files+=" -r requirements/skinny-test-requirements.txt"
else
  req_files+=" -r requirements/test-requirements.txt"
fi

if [[ ! -z $req_files ]]; then
  retry-with-backoff pip install $req_files
fi

# Install `mlflow-test-plugin`
pip install tests/resources/mlflow-test-plugin

# Print current environment info
pip install aiohttp
which mlflow

# Print mlflow version
mlflow --version

# Turn off trace output & exit-on-errors
set +ex
```

--------------------------------------------------------------------------------

---[FILE: install-skinny.sh]---
Location: mlflow-master/dev/install-skinny.sh

```bash
#!/usr/bin/env bash
# Install from master:
# curl -LsSf https://raw.githubusercontent.com/mlflow/mlflow/HEAD/dev/install-skinny.sh | sh
#
# Install from a specific branch:
# curl -LsSf https://raw.githubusercontent.com/mlflow/mlflow/HEAD/dev/install-skinny.sh | sh -s <branch>
#
# Install from a specific PR:
# curl -LsSf https://raw.githubusercontent.com/mlflow/mlflow/HEAD/dev/install-skinny.sh | sh -s pull/<pr_num>/merge
REF=${1:-HEAD}

# Fetching the entire repo is slow. Use sparse-checkout to only fetch the necessary files.
TEMP_DIR=$(mktemp -d)
git clone --filter=blob:none --no-checkout https://github.com/mlflow/mlflow.git $TEMP_DIR
cd $TEMP_DIR
# Exclude the mlflow/server/js folder as it contains frontend JavaScript files not needed for mlflow-skinny installation.
git sparse-checkout set --no-cone /mlflow /libs/skinny /pyproject.toml '!/mlflow/server/js/*'
git fetch origin "$REF"
git config advice.detachedHead false
git checkout FETCH_HEAD
OPTIONS=$(if pip freeze | grep -q "mlflow-skinny @"; then echo "--force-reinstall --no-deps"; fi)
pip install $OPTIONS ./libs/skinny
rm -rf $TEMP_DIR
```

--------------------------------------------------------------------------------

---[FILE: lint-proto.sh]---
Location: mlflow-master/dev/lint-proto.sh

```bash
#!/usr/bin/env bash

if grep -n 'com.databricks.mlflow.api.MlflowTrackingMessage' "$@"; then
  echo 'Remove com.databricks.mlflow.api.MlflowTrackingMessage'
  exit 1
fi
```

--------------------------------------------------------------------------------

---[FILE: list_changed_files.py]---
Location: mlflow-master/dev/list_changed_files.py

```python
"""
A python script to list changed files in a specified pull request.

Usage:
---------------------------------------------------------------------------
# List changed files in https://github.com/mlflow/mlflow/pull/3191
$ python dev/list_changed_files.py --repository mlflow/mlflow --pr-num 3191
---------------------------------------------------------------------------
"""

import argparse
import json
import os
import urllib.request


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--repository", help="Owner and repository name", required=True)
    parser.add_argument("--pr-num", help="Pull request number", required=True)
    return parser.parse_args()


def main():
    args = parse_args()
    changed_files = []
    per_page = 100
    page = 1
    token = os.environ.get("GITHUB_TOKEN")
    headers = {"Authorization": f"token {token}"} if token else {}
    # Ref: https://docs.github.com/en/rest/reference/pulls#list-pull-requests-files
    url = f"https://api.github.com/repos/{args.repository}/pulls/{args.pr_num}/files"
    while True:
        full_url = f"{url}?per_page={per_page}&page={page}"
        req = urllib.request.Request(full_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            files = json.loads(resp.read().decode())
        changed_files.extend(f["filename"] for f in files)
        if len(files) < per_page:
            break
        page += 1

    print("\n".join(changed_files))


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: mlflow-typo.sh]---
Location: mlflow-master/dev/mlflow-typo.sh

```bash
#!/usr/bin/env bash

ALLOWED_PATTERNS='Mlflow\(|"Mlflow"|import Mlflow$'
# add globs to this list to ignore them in grep
EXCLUDED_FILES=(
    # ignore typos in i18n files, since they're not controlled by us
    "mlflow/server/js/src/lang/*.json"
    "mlflow/server/js/src/common/utils/StringUtils.ts"
    "dev/clint/tests/rules/test_mlflow_class_name.py"
)

EXCLUDE_ARGS=""
for pattern in "${EXCLUDED_FILES[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude=$pattern"
done

if grep -InE ' \bM(lf|LF|lF)low\b' $EXCLUDE_ARGS "$@" | grep -vE "$ALLOWED_PATTERNS"; then
    echo -e "\nFound typo for MLflow spelling in above file(s). Please use 'MLflow' instead of 'Mlflow'."
    exit 1
else
    exit 0
fi
```

--------------------------------------------------------------------------------

---[FILE: normalize_chars.py]---
Location: mlflow-master/dev/normalize_chars.py

```python
import sys
from pathlib import Path

# Mapping of characters to normalize. Start with quotes; extend as needed.
CHAR_MAP = {
    "\u2018": "'",  # left single quotation mark
    "\u2019": "'",  # right single quotation mark
    "\u201c": '"',  # left double quotation mark
    "\u201d": '"',  # right double quotation mark
}


def fix_file(path: Path) -> bool:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        # Non-UTF8 (likely binary) — skip
        return False

    new_text = text
    for bad, good in CHAR_MAP.items():
        new_text = new_text.replace(bad, good)

    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main(argv: list[str]) -> int:
    changed = 0
    for arg in argv:
        p = Path(arg)
        if p.is_file():
            if fix_file(p):
                changed += 1
    if changed:
        print(f"Normalized characters in {changed} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 16
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 16 of 991)

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

---[FILE: ruff.json]---
Location: mlflow-master/.github/workflows/matchers/ruff.json

```json
{
  "problemMatcher": [
    {
      "owner": "ruff",
      "severity": "error",
      "pattern": [
        {
          "regexp": "^(.+):(\\d+):(\\d+):\\s+([A-Z]+\\d+)\\s+(.+)$",
          "file": 1,
          "line": 2,
          "column": 3,
          "message": 5,
          "code": 4
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: typos.json]---
Location: mlflow-master/.github/workflows/matchers/typos.json

```json
{
  "problemMatcher": [
    {
      "owner": "typos",
      "severity": "error",
      "pattern": [
        {
          "regexp": "^(.+?):(\\d+):(\\d+):\\s*(.+)$",
          "file": 1,
          "line": 2,
          "column": 3,
          "message": 4
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions.json]---
Location: mlflow-master/.vscode/extensions.json

```json
{
  "recommendations": [
    // Python
    "charliermarsh.ruff",
    "ms-python.python",
    "ms-python.vscode-pylance",

    // JavaScript/TypeScript
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",

    // Other helpful extensions
    "eamodio.gitlens",
    "usernamehw.errorlens"
  ],
  "unwantedRecommendations": [
    // Disable extensions that conflict with Ruff
    "ms-python.pylint",
    "ms-python.flake8",
    "ms-python.black-formatter",
    "ms-python.isort"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: settings.json]---
Location: mlflow-master/.vscode/settings.json

```json
{
  // Python Configuration
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  },

  // Ruff configuration (uses pyproject.toml automatically)
  // The Ruff extension will automatically detect and use the pyproject.toml settings

  // Disable mypy completely (repo only checks dev/clint files)
  // The mypy extension doesn't support per-file filtering, so we disable it entirely
  // to avoid false positives on files the repo doesn't check
  "mypy-type-checker.enabled": false,

  // Python analysis
  "python.analysis.typeCheckingMode": "off", // Disable Pylance strict checking
  "python.analysis.exclude": [
    // Default paths to exclude
    "**/node_modules",
    "**/__pycache__",
    "**/.*",
    // Extra paths to exclude
    "libs/**"
  ],

  // TypeScript/JavaScript Configuration
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },

  // ESLint configuration
  "eslint.workingDirectories": ["./mlflow/server/js"],
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],

  // TypeScript configuration
  "typescript.tsdk": "./mlflow/server/js/node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  // JSON formatting
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // YAML formatting
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // GitHub Actions workflow formatting
  "[github-actions-workflow]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // Markdown formatting
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // `.prompt.md` files in `.github/prompts`
  "[prompt]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // Files to exclude from explorer
  "files.exclude": {
    "**/__pycache__": true,
    "**/.pytest_cache": true,
    "**/*.pyc": true,
    "**/.mypy_cache": true,
    "**/.ruff_cache": true,
    "**/node_modules": true
  },

  // Search exclusions
  "search.exclude": {
    "**/node_modules": true,
    "**/__pycache__": true,
    "**/.pytest_cache": true,
    "**/build": true,
    "**/dist": true,
    "mlflow/server/js/build": true
  },

  // Prevent VS Code from following symlinks during searches
  // This avoids duplicate results from symlinks in libs/ directory
  "search.followSymlinks": false,

  // Editor settings
  "editor.rulers": [100], // Show ruler at 100 chars for Python

  // Python specific settings
  "python.terminal.activateEnvironment": true,

  // File associations
  "files.associations": {
    "*.mdx": "markdown",
    "*.ipynb": "jupyter"
  },
  "python.testing.pytestArgs": ["tests"],
  "python.testing.unittestEnabled": false,
  "python.testing.pytestEnabled": true
}
```

--------------------------------------------------------------------------------

---[FILE: icon.svg]---
Location: mlflow-master/assets/icon.svg

```text
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.9509 2.17634C14.0635 -1.24345 7.40926 -0.571051 3.30485 3.75735C-0.799556 8.08576 -1.11776 14.7663 2.55667 19.4652L6.22524 16.7724C4.40423 14.5134 4.03437 11.4124 5.27298 8.78843C6.51159 6.16448 9.1408 4.47914 12.0422 4.44929V7.31581Z" fill="#43C9ED"/>
<path d="M5.0491 21.8237C9.9365 25.2435 16.5907 24.5711 20.6951 20.2427C24.7996 15.9142 25.1178 9.2337 21.4433 4.5348L17.7748 7.2276C19.5958 9.4866 19.9656 12.5876 18.727 15.2116C17.4884 17.8355 14.8592 19.5209 11.9578 19.5507V16.6842Z" fill="#0194E2"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: logo-white.svg]---
Location: mlflow-master/assets/logo-white.svg

```text
<svg width="109" height="40" viewBox="0 0 109 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 31.0316V15.5024H3.54258V17.4699C4.43636 15.8756 6.38278 15.045 8.13589 15.045C10.178 15.045 11.9636 15.9713 12.7943 17.7895C14.0096 15.7474 15.8278 15.045 17.8373 15.045C20.6469 15.045 23.3263 16.8325 23.3263 20.9493V31.0316H19.7531V21.5541C19.7531 19.7359 18.8268 18.3636 16.7522 18.3636C14.8057 18.3636 13.5292 19.8947 13.5292 21.8086V31.0297H9.89282V21.5541C9.89282 19.7684 8.99522 18.3732 6.88995 18.3732C4.91292 18.3732 3.66699 19.8412 3.66699 21.8182V31.0392Z" fill="white"/>
<path d="M27.8546 31.0316V7.92917H31.5579V31.0316Z" fill="white"/>
<path d="M30.0708 39.4871C30.9033 39.7187 31.6517 39.8699 33.2402 39.8699C36.1933 39.8699 39.6765 38.2048 40.5933 33.5311L44.3789 14.7923H50.0076L50.6947 11.6746H45.0086L45.7741 7.95023C46.3598 5.05837 47.9598 3.59234 50.5282 3.59234C51.1962 3.59234 51.0086 3.64975 51.6038 3.76267L52.4268 0.570327C51.6344 0.333006 50.9244 0.191379 49.378 0.191379C47.7454 0.166831 46.1514 0.688934 44.8497 1.67463C43.4086 2.78851 42.4574 4.42487 42.023 6.53779L40.9569 11.6746H35.9234L35.5119 14.7943H40.3349L36.8593 32.1206C36.4765 34.0861 35.3588 36.4364 32.1512 36.4364C31.4239 36.4364 31.688 36.3809 31.0297 36.2737Z" fill="#0194E2"/>
<path d="M53.3416 30.9053H49.6402L54.7139 7.59616H58.4153Z" fill="#0194E2"/>
<path d="M71.8067 16.4766C68.5762 14.2161 64.1778 14.6606 61.4649 17.5216C58.7519 20.3826 58.5416 24.7984 60.9703 27.9043L63.3952 26.1244C62.1915 24.6312 61.9471 22.5815 62.7658 20.8471C63.5845 19.1127 65.3224 17.9987 67.2402 17.979V19.8737Z" fill="#43C9ED"/>
<path d="M62.6179 29.4717C65.8484 31.7322 70.2468 31.2877 72.9597 28.4267C75.6727 25.5657 75.883 21.1499 73.4543 18.044L71.0294 19.8239C72.2331 21.3171 72.4775 23.3668 71.6588 25.1012C70.8401 26.8356 69.1022 27.9496 67.1844 27.9693V26.0746Z" fill="#0194E2"/>
<path d="M78.0919 15.4928H82.1359L82.9588 26.1053L88.7177 15.4928L92.5569 15.5483L94.0651 26.1053L99.1387 15.4928L102.84 15.5483L95.1617 31.0412H91.4603L89.6765 19.9349L83.7818 31.0412H79.9426Z" fill="#0194E2"/>
<path d="M105.072 15.7684H104.306V15.5024H106.151V15.7741H105.386V18.0172H105.072Z" fill="#0194E2"/>
<path d="M106.614 15.5024H106.997L107.479 16.8421C107.541 17.0143 107.598 17.1904 107.657 17.3665H107.675C107.734 17.1904 107.788 17.0143 107.847 16.8421L108.325 15.5024H108.708V18.0172H108.41V16.6297C108.41 16.4096 108.434 16.1072 108.45 15.8832H108.434L108.243 16.4574L107.768 17.7608H107.56L107.079 16.4593L106.888 15.8852H106.873C106.89 16.1091 106.915 16.4115 106.915 16.6316V18.0191H106.624Z" fill="#0194E2"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: logo.svg]---
Location: mlflow-master/assets/logo.svg

```text
<svg width="109" height="40" viewBox="0 0 109 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 31.0316V15.5024H3.54258V17.4699C4.43636 15.8756 6.38278 15.045 8.13589 15.045C10.178 15.045 11.9636 15.9713 12.7943 17.7895C14.0096 15.7474 15.8278 15.045 17.8373 15.045C20.6469 15.045 23.3263 16.8325 23.3263 20.9493V31.0316H19.7531V21.5541C19.7531 19.7359 18.8268 18.3636 16.7522 18.3636C14.8057 18.3636 13.5292 19.8947 13.5292 21.8086V31.0297H9.89282V21.5541C9.89282 19.7684 8.99522 18.3732 6.88995 18.3732C4.91292 18.3732 3.66699 19.8412 3.66699 21.8182V31.0392Z" fill="#333333"/>
<path d="M27.8546 31.0316V7.92917H31.5579V31.0316Z" fill="#333333"/>
<path d="M30.0708 39.4871C30.9033 39.7187 31.6517 39.8699 33.2402 39.8699C36.1933 39.8699 39.6765 38.2048 40.5933 33.5311L44.3789 14.7923H50.0076L50.6947 11.6746H45.0086L45.7741 7.95023C46.3598 5.05837 47.9598 3.59234 50.5282 3.59234C51.1962 3.59234 51.0086 3.64975 51.6038 3.76267L52.4268 0.570327C51.6344 0.333006 50.9244 0.191379 49.378 0.191379C47.7454 0.166831 46.1514 0.688934 44.8497 1.67463C43.4086 2.78851 42.4574 4.42487 42.023 6.53779L40.9569 11.6746H35.9234L35.5119 14.7943H40.3349L36.8593 32.1206C36.4765 34.0861 35.3588 36.4364 32.1512 36.4364C31.4239 36.4364 31.688 36.3809 31.0297 36.2737Z" fill="#0194E2"/>
<path d="M53.3416 30.9053H49.6402L54.7139 7.59616H58.4153Z" fill="#0194E2"/>
<path d="M71.8067 16.4766C68.5762 14.2161 64.1778 14.6606 61.4649 17.5216C58.7519 20.3826 58.5416 24.7984 60.9703 27.9043L63.3952 26.1244C62.1915 24.6312 61.9471 22.5815 62.7658 20.8471C63.5845 19.1127 65.3224 17.9987 67.2402 17.979V19.8737Z" fill="#43C9ED"/>
<path d="M62.6179 29.4717C65.8484 31.7322 70.2468 31.2877 72.9597 28.4267C75.6727 25.5657 75.883 21.1499 73.4543 18.044L71.0294 19.8239C72.2331 21.3171 72.4775 23.3668 71.6588 25.1012C70.8401 26.8356 69.1022 27.9496 67.1844 27.9693V26.0746Z" fill="#0194E2"/>
<path d="M78.0919 15.4928H82.1359L82.9588 26.1053L88.7177 15.4928L92.5569 15.5483L94.0651 26.1053L99.1387 15.4928L102.84 15.5483L95.1617 31.0412H91.4603L89.6765 19.9349L83.7818 31.0412H79.9426Z" fill="#0194E2"/>
<path d="M105.072 15.7684H104.306V15.5024H106.151V15.7741H105.386V18.0172H105.072Z" fill="#0194E2"/>
<path d="M106.614 15.5024H106.997L107.479 16.8421C107.541 17.0143 107.598 17.1904 107.657 17.3665H107.675C107.734 17.1904 107.788 17.0143 107.847 16.8421L108.325 15.5024H108.708V18.0172H108.41V16.6297C108.41 16.4096 108.434 16.1072 108.45 15.8832H108.434L108.243 16.4574L107.768 17.7608H107.56L107.079 16.4593L106.888 15.8852H106.873C106.89 16.1091 106.915 16.4115 106.915 16.6316V18.0191H106.624Z" fill="#0194E2"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: mlflow-master/bin/.gitignore

```text
# Ignore everything in this directory
*
# Except these files
!.gitignore
!install.py
!README.md
```

--------------------------------------------------------------------------------

---[FILE: install.py]---
Location: mlflow-master/bin/install.py

```python
"""
Install binary tools for MLflow development.
"""

# ruff: noqa: T201
import argparse
import gzip
import http.client
import json
import platform
import subprocess
import tarfile
import time
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Literal
from urllib.error import HTTPError

INSTALLED_VERSIONS_FILE = ".installed_versions.json"

# Type definitions
PlatformKey = tuple[
    Literal["linux", "darwin"],
    Literal["x86_64", "arm64"],
]
ExtractType = Literal["gzip", "tar", "binary"]


@dataclass
class Tool:
    name: str
    version: str
    urls: dict[PlatformKey, str]  # platform -> URL mapping
    version_args: list[str] | None = None  # Custom version check args (default: ["--version"])

    def get_url(self, platform_key: PlatformKey) -> str | None:
        return self.urls.get(platform_key)

    def get_version_args(self) -> list[str]:
        """Get version check arguments, defaulting to --version."""
        return self.version_args or ["--version"]

    def get_extract_type(self, url: str) -> ExtractType:
        """Infer extract type from URL file extension."""
        if url.endswith(".gz") and not url.endswith(".tar.gz"):
            return "gzip"
        elif url.endswith((".tar.gz", ".tgz")):
            return "tar"
        elif url.endswith(".exe") or ("/" in url and not url.split("/")[-1].count(".")):
            # Windows executables or files without extensions (plain binaries)
            return "binary"
        else:
            # Default to tar for unknown extensions
            return "tar"


# Tool configurations
TOOLS = [
    Tool(
        name="taplo",
        version="0.9.3",
        urls={
            (
                "linux",
                "x86_64",
            ): "https://github.com/tamasfe/taplo/releases/download/0.9.3/taplo-linux-x86_64.gz",
            (
                "darwin",
                "arm64",
            ): "https://github.com/tamasfe/taplo/releases/download/0.9.3/taplo-darwin-aarch64.gz",
        },
    ),
    Tool(
        name="typos",
        version="1.39.2",
        urls={
            (
                "linux",
                "x86_64",
            ): "https://github.com/crate-ci/typos/releases/download/v1.39.2/typos-v1.39.2-x86_64-unknown-linux-musl.tar.gz",
            (
                "darwin",
                "arm64",
            ): "https://github.com/crate-ci/typos/releases/download/v1.39.2/typos-v1.39.2-aarch64-apple-darwin.tar.gz",
        },
    ),
    Tool(
        name="conftest",
        version="0.63.0",
        urls={
            (
                "linux",
                "x86_64",
            ): "https://github.com/open-policy-agent/conftest/releases/download/v0.63.0/conftest_0.63.0_Linux_x86_64.tar.gz",
            (
                "darwin",
                "arm64",
            ): "https://github.com/open-policy-agent/conftest/releases/download/v0.63.0/conftest_0.63.0_Darwin_arm64.tar.gz",
        },
    ),
    Tool(
        name="regal",
        version="0.36.1",
        urls={
            (
                "linux",
                "x86_64",
            ): "https://github.com/open-policy-agent/regal/releases/download/v0.36.1/regal_Linux_x86_64",
            (
                "darwin",
                "arm64",
            ): "https://github.com/open-policy-agent/regal/releases/download/v0.36.1/regal_Darwin_arm64",
        },
        version_args=["version"],
    ),
    Tool(
        name="buf",
        version="1.59.0",
        urls={
            (
                "linux",
                "x86_64",
            ): "https://github.com/bufbuild/buf/releases/download/v1.59.0/buf-Linux-x86_64",
            (
                "darwin",
                "arm64",
            ): "https://github.com/bufbuild/buf/releases/download/v1.59.0/buf-Darwin-arm64",
        },
    ),
    Tool(
        name="rg",
        version="14.1.1",
        urls={
            (
                "linux",
                "x86_64",
            ): "https://github.com/BurntSushi/ripgrep/releases/download/14.1.1/ripgrep-14.1.1-x86_64-unknown-linux-musl.tar.gz",
            (
                "darwin",
                "arm64",
            ): "https://github.com/BurntSushi/ripgrep/releases/download/14.1.1/ripgrep-14.1.1-aarch64-apple-darwin.tar.gz",
        },
    ),
]


def get_platform_key() -> PlatformKey | None:
    system = platform.system().lower()
    machine = platform.machine().lower()

    # Normalize machine architecture
    if machine in ["x86_64", "amd64"]:
        machine = "x86_64"
    elif machine in ["aarch64", "arm64"]:
        machine = "arm64"

    # Return if it's a supported platform combination
    if system == "linux" and machine == "x86_64":
        return ("linux", "x86_64")
    elif system == "darwin" and machine == "arm64":
        return ("darwin", "arm64")

    return None


def urlopen_with_retry(
    url: str, max_retries: int = 5, base_delay: float = 1.0
) -> http.client.HTTPResponse:
    """Open a URL with retry logic for transient HTTP errors (e.g., 503)."""
    for attempt in range(max_retries):
        try:
            return urllib.request.urlopen(url)
        except HTTPError as e:
            if e.code in (502, 503, 504) and attempt < max_retries - 1:
                delay = base_delay * (2**attempt)
                print(f"  HTTP {e.code}, retrying in {delay}s... ({attempt + 1}/{max_retries})")
                time.sleep(delay)
            else:
                raise


def extract_gzip_from_url(url: str, dest_dir: Path, binary_name: str) -> Path:
    print(f"Downloading from {url}")
    output_path = dest_dir / binary_name

    with urlopen_with_retry(url) as response:
        with gzip.open(response, "rb") as gz:
            output_path.write_bytes(gz.read())

    return output_path


def extract_tar_from_url(url: str, dest_dir: Path, binary_name: str) -> Path:
    print(f"Downloading from {url}...")
    output_path = dest_dir / binary_name
    with (
        urlopen_with_retry(url) as response,
        tarfile.open(fileobj=response, mode="r|*") as tar,
    ):
        # Find and extract only the binary file we need
        for member in tar:
            if member.isfile() and member.name.endswith(binary_name):
                # Extract the file content and write directly to destination
                f = tar.extractfile(member)
                if f is not None:
                    output_path.write_bytes(f.read())
                    return output_path

    raise FileNotFoundError(f"Could not find {binary_name} in archive")


def download_binary_from_url(url: str, dest_dir: Path, binary_name: str) -> Path:
    print(f"Downloading from {url}...")
    output_path = dest_dir / binary_name

    with urlopen_with_retry(url) as response:
        output_path.write_bytes(response.read())

    return output_path


def install_tool(tool: Tool, dest_dir: Path, force: bool = False) -> None:
    # Check if tool already exists
    binary_path = dest_dir / tool.name
    if binary_path.exists():
        if not force:
            print(f"  ✓ {tool.name} already installed")
            return
        else:
            print(f"  Removing existing {tool.name}...")
            binary_path.unlink()

    platform_key = get_platform_key()

    if platform_key is None:
        supported = [f"{os}-{arch}" for os, arch in tool.urls.keys()]
        raise RuntimeError(
            f"Current platform is not supported. Supported platforms: {', '.join(supported)}"
        )

    url = tool.get_url(platform_key)
    if url is None:
        os, arch = platform_key
        supported = [f"{os}-{arch}" for os, arch in tool.urls.keys()]
        raise RuntimeError(
            f"Platform {os}-{arch} not supported for {tool.name}. "
            f"Supported platforms: {', '.join(supported)}"
        )

    # Extract based on inferred type from URL
    extract_type = tool.get_extract_type(url)
    if extract_type == "gzip":
        binary_path = extract_gzip_from_url(url, dest_dir, tool.name)
    elif extract_type == "tar":
        binary_path = extract_tar_from_url(url, dest_dir, tool.name)
    elif extract_type == "binary":
        binary_path = download_binary_from_url(url, dest_dir, tool.name)
    else:
        raise ValueError(f"Unknown extract type: {extract_type}")

    # Make executable
    binary_path.chmod(0o755)

    # Verify installation by running version command
    version_cmd = [binary_path] + tool.get_version_args()
    subprocess.check_call(version_cmd, timeout=5)
    print(f"Successfully installed {tool.name} to {binary_path}")


def load_installed_versions(dest_dir: Path) -> dict[str, str]:
    f = dest_dir / INSTALLED_VERSIONS_FILE
    if f.exists():
        return json.loads(f.read_text())
    return {}


def save_installed_versions(dest_dir: Path, versions: dict[str, str]) -> None:
    f = dest_dir / INSTALLED_VERSIONS_FILE
    f.write_text(json.dumps(versions, indent=2, sort_keys=True) + "\n")


def main() -> None:
    all_tool_names = [t.name for t in TOOLS]
    parser = argparse.ArgumentParser(description="Install binary tools for MLflow development")
    parser.add_argument(
        "-f",
        "--force-reinstall",
        action="store_true",
        help="Force reinstall by removing existing tools",
    )
    parser.add_argument(
        "tools",
        nargs="*",
        metavar="TOOL",
        help=f"Tools to install (default: all). Available: {', '.join(all_tool_names)}",
    )
    args = parser.parse_args()

    # Filter tools if specific ones requested
    if args.tools:
        if invalid_tools := set(args.tools) - set(all_tool_names):
            parser.error(
                f"Unknown tools: {', '.join(sorted(invalid_tools))}. "
                f"Available: {', '.join(all_tool_names)}"
            )
        tools_to_install = [t for t in TOOLS if t.name in args.tools]
    else:
        tools_to_install = TOOLS

    dest_dir = Path(__file__).resolve().parent
    dest_dir.mkdir(parents=True, exist_ok=True)

    installed_versions = load_installed_versions(dest_dir)
    outdated_tools = sorted(
        t.name for t in tools_to_install if installed_versions.get(t.name) != t.version
    )
    force_all = args.force_reinstall

    if force_all:
        print("Force reinstall: removing existing tools and reinstalling...")
    elif outdated_tools:
        print(f"Version changes detected for: {', '.join(outdated_tools)}")
    else:
        print("Installing tools to bin/ directory...")

    for tool in tools_to_install:
        # Force reinstall if globally forced or if this tool's version changed
        force = force_all or tool.name in outdated_tools
        print(f"\nInstalling {tool.name}...")
        install_tool(tool, dest_dir, force=force)
        installed_versions[tool.name] = tool.version

    save_installed_versions(dest_dir, installed_versions)
    print("\nDone!")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/bin/README.md

```text
# bin

Binary tools for MLflow development.

## Installation

```bash
python bin/install.py
```
```

--------------------------------------------------------------------------------

---[FILE: build-docs.sh]---
Location: mlflow-master/dev/build-docs.sh

```bash
#!/usr/bin/env bash
# =============================================================================
# Static Site Build Script
#
# This script performs the following tasks:
#   1. Checks that NodeJS (>=18.0) is installed; if not, it prints instructions
#      for installing via nvm.
#   2. Changes directory into the docs folder so that all commands run from there.
#      (Note: This ensures that the DOCS_BASE_URL value is interpreted relative
#      to the docs folder. For example, if running from the project root, the
#      effective path will be: <root>/docs/docs/latest.)
#   3. Installs dependencies via npm.
#   4. (Optional) Builds the API docs:
#         - If --build-api-docs is provided, then the API docs are built.
#         - If --with-r-docs is also provided, the build includes R docs;
#           otherwise, R docs are skipped.
#   5. Converts notebooks to MDX.
#   6. Exports the DOCS_BASE_URL environment variable (default: /docs/latest) so
#      that Docusaurus uses the proper base URL.
#   7. Builds the static site.
#
# Once complete, the script instructs the user to navigate into the docs folder
# and run:
#
#     npm run serve -- --port <your_port_number>
#
# Options:
#   --build-api-docs        Opt in to build the API docs (default: do not build)
#   --with-r-docs           When building API docs, include R documentation 
#                           (default: skip R docs)
#   --docs-base-url URL     Override the default DOCS_BASE_URL (default: /docs/latest)
#   -h, --help              Display this help message and exit
#
# Example:
#   ./dev/build-docs.sh --build-api-docs --with-r-docs --docs-base-url /docs/latest
# =============================================================================

# Exit immediately if a command exits with a non-zero status,
# treat unset variables as an error, and fail on pipeline errors.
set -euo pipefail

# -----------------------------------------------------------------------------
# Define color and style variables for styled output.
# -----------------------------------------------------------------------------
BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'  # No Color

# -----------------------------------------------------------------------------
# Logging functions for consistent output styling.
# -----------------------------------------------------------------------------
log_info()    { echo -e "${BOLD}${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${BOLD}${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${BOLD}${YELLOW}[WARNING]${NC} $1"; }
log_error()   { echo -e "${BOLD}${RED}[ERROR]${NC} $1"; }

# -----------------------------------------------------------------------------
# Default configuration values.
# -----------------------------------------------------------------------------
BUILD_API_DOCS=false
WITH_R_DOCS=false
# Default DOCS_BASE_URL is set as expected when running from within the docs folder.
# Note: When running from the project root, since we change into docs/,
# the effective reference becomes: <root>/docs/docs/latest.
DOCS_BASE_URL="/docs/latest"

# -----------------------------------------------------------------------------
# Display usage information.
# -----------------------------------------------------------------------------
usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  --build-api-docs        Opt in to build the API docs (default: do not build)
  --with-r-docs           When building API docs, include R documentation 
                          (default: skip R docs)
  --docs-base-url URL     Override the default DOCS_BASE_URL (default: /docs/latest)
  -h, --help              Display this help and exit

Example:
  $0 --build-api-docs --with-r-docs --docs-base-url /docs/latest
EOF
}

# -----------------------------------------------------------------------------
# Parse command-line arguments manually.
# -----------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --build-api-docs)
      BUILD_API_DOCS=true
      shift
      ;;
    --with-r-docs)
      WITH_R_DOCS=true
      shift
      ;;
    --docs-base-url)
      if [[ -n "${2:-}" ]]; then
          DOCS_BASE_URL="$2"
          shift 2
      else
          log_error "--docs-base-url requires an argument."
          usage
          exit 1
      fi
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      log_error "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

# -----------------------------------------------------------------------------
# Function to compare semantic version numbers.
# Returns 0 (true) if version $1 is greater than or equal to version $2.
# -----------------------------------------------------------------------------
version_ge() {
    # Usage: version_ge "18.15.0" "18.0.0"
    [ "$(printf '%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]
}

# -----------------------------------------------------------------------------
# Check that NodeJS is installed and meets the version requirement (>= 18.0).
# -----------------------------------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
    log_error "NodeJS is not installed. Please install NodeJS (>= 18.0) from https://nodejs.org/ or via nvm."
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_VERSION="18.0.0"
if ! version_ge "$NODE_VERSION" "$REQUIRED_VERSION"; then
    log_error "Detected NodeJS version $NODE_VERSION. Please install NodeJS >= $REQUIRED_VERSION."
    log_info "If you have nvm installed, you can run:"
    echo -e "${BOLD}nvm install node && nvm use node${NC}"
    exit 1
fi
log_success "NodeJS version $NODE_VERSION is valid."

# -----------------------------------------------------------------------------
# Check that npm is installed.
# -----------------------------------------------------------------------------
if ! command -v npm >/dev/null 2>&1; then
    log_error "npm is not installed. Please install npm from https://nodejs.org/."
    exit 1
fi

# -----------------------------------------------------------------------------
# Change directory into the docs folder so that all commands run from there.
# This ensures that DOCS_BASE_URL is interpreted correctly.
# -----------------------------------------------------------------------------
if [ ! -d "docs" ]; then
    log_error "The docs directory was not found. Make sure you're running this script from the project root."
    exit 1
fi

log_info "Changing directory to docs/ ..."
cd docs

# -----------------------------------------------------------------------------
# Install dependencies via npm.
# -----------------------------------------------------------------------------
log_info "Installing dependencies with npm..."
npm install
log_success "Dependencies installed."

# -----------------------------------------------------------------------------
# Optionally build the API documentation.
# This step is opt-in via the --build-api-docs flag.
# If building API docs, the --with-r-docs flag controls whether R docs are included.
# -----------------------------------------------------------------------------
if [ "$BUILD_API_DOCS" = true ]; then
    if [ "$WITH_R_DOCS" = true ]; then
        log_info "Building API docs including R documentation..."
        npm run build-api-docs
    else
        log_info "Building API docs without R documentation..."
        npm run build-api-docs:no-r
    fi
    log_success "API docs built successfully."
else
    log_info "Skipping API docs build phase."
fi

# -----------------------------------------------------------------------------
# Update the API module references for link functionality
# -----------------------------------------------------------------------------
log_info "Updating API module links..."
npm run update-api-modules
log_success "Updated API module links."

# -----------------------------------------------------------------------------
# Convert notebooks to MDX format.
# -----------------------------------------------------------------------------
log_info "Converting notebooks to MDX..."
npm run convert-notebooks
log_success "Notebooks converted to MDX."

# -----------------------------------------------------------------------------
# Export DOCS_BASE_URL and build the static site.
#
# Since we're in the docs folder, exporting DOCS_BASE_URL as "/docs/latest"
# means that when served from the project root, the built site will be available
# at <root>/docs/docs/latest.
# -----------------------------------------------------------------------------
export DOCS_BASE_URL
log_info "DOCS_BASE_URL set to '${DOCS_BASE_URL}'."
log_info "Building static site files with npm..."
npm run build
log_success "Static site built successfully."

# -----------------------------------------------------------------------------
# Final instructions for the user.
# -----------------------------------------------------------------------------
log_info "To run the site locally, please navigate to the 'docs' folder and execute:"
echo -e "${BOLD}npm run serve -- --port <your_port_number>${NC}"
log_info "For example: ${BOLD}npm run serve -- --port 3000${NC}"
log_success "Static site build process completed."
```

--------------------------------------------------------------------------------

---[FILE: build.py]---
Location: mlflow-master/dev/build.py

```python
import argparse
import contextlib
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Package:
    # name of the package on PyPI.
    pypi_name: str
    # type of the package, one of "dev", "skinny", "tracing", "release"
    type: str
    # path to the package relative to the root of the repository
    build_path: str


DEV = Package("mlflow", "dev", ".")
RELEASE = Package("mlflow", "release", ".")
SKINNY = Package("mlflow-skinny", "skinny", "libs/skinny")
TRACING = Package("mlflow-tracing", "tracing", "libs/tracing")

PACKAGES = [
    DEV,
    SKINNY,
    RELEASE,
    TRACING,
]


def parse_args():
    parser = argparse.ArgumentParser(description="Build MLflow package.")
    parser.add_argument(
        "--package-type",
        help="Package type to build. Default is 'dev'.",
        choices=[p.type for p in PACKAGES],
        default="dev",
    )
    parser.add_argument(
        "--sha",
        help="If specified, include the SHA in the wheel name as a build tag.",
    )
    return parser.parse_args()


@contextlib.contextmanager
def restore_changes():
    try:
        yield
    finally:
        subprocess.check_call(
            [
                "git",
                "restore",
                "README.md",
                "pyproject.toml",
            ]
        )


def main():
    args = parse_args()

    # Clean up build artifacts generated by previous builds
    paths_to_clean_up = ["build"]
    for pkg in PACKAGES:
        paths_to_clean_up += [
            f"{pkg.build_path}/dist",
            f"{pkg.build_path}/{pkg.pypi_name}.egg_info",
        ]
    for path in map(Path, paths_to_clean_up):
        if not path.exists():
            continue
        if path.is_file():
            path.unlink()
        else:
            shutil.rmtree(path)

    package = next(p for p in PACKAGES if p.type == args.package_type)

    with restore_changes():
        pyproject = Path("pyproject.toml")
        if package == RELEASE:
            pyproject.write_text(Path("pyproject.release.toml").read_text())

        subprocess.check_call(
            [
                sys.executable,
                "-m",
                "build",
                package.build_path,
            ]
        )

        DIST_DIR = Path("dist")
        DIST_DIR.mkdir(exist_ok=True)
        if package in (SKINNY, TRACING):
            # Move `libs/xyz/dist/*` to `dist/`
            for src in (Path(package.build_path) / "dist").glob("*"):
                print(src)
                dst = DIST_DIR / src.name
                if dst.exists():
                    dst.unlink()
                src.rename(dst)

    if args.sha:
        # If build succeeds, there should be one wheel in the dist directory
        wheel = next(DIST_DIR.glob("mlflow*.whl"))
        name, version, rest = wheel.name.split("-", 2)
        build_tag = f"0.sha.{args.sha}"  # build tag must start with a digit
        wheel.rename(wheel.with_name(f"{name}-{version}-{build_tag}-{rest}"))


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 143
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 143 of 991)

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

---[FILE: network.mdx]---
Location: mlflow-master/docs/docs/self-hosting/security/network.mdx

```text
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import { Shield } from "lucide-react";

# Protect Your Tracking Server from Network Exposure

MLflow 3.5.0+ includes security middleware to protect against DNS rebinding, CORS attacks, and clickjacking. These features are available with the default FastAPI-based tracking server (uvicorn).

<FeatureHighlights features={[
  {
    icon: Shield,
    title: "DNS Rebinding Protection",
    description: "Validates Host headers to prevent attacks on internal services"
  },
  {
    icon: Shield,
    title: "CORS Protection",
    description: "Controls which web apps can access your MLflow API"
  },
  {
    icon: Shield,
    title: "Clickjacking Prevention",
    description: "X-Frame-Options header controls iframe embedding"
  },
  {
    icon: Shield,
    title: "Security Headers",
    description: "Automatic headers prevent MIME sniffing and XSS"
  },
]} />

Security settings can be configured through CLI options or environment variables. Default settings are designed to be safe for local development while requiring explicit configuration for production:

:::important Requirements

Security middleware features require the FastAPI-based tracking server (uvicorn), which is the default server in MLflow 3.5.0+.

These features are not available when using `--gunicorn-opts` or `--waitress-opts`.

:::

### Allowed Hosts

Controls which Host headers the server accepts. This prevents DNS rebinding attacks by validating incoming requests:

| CLI Option        | Environment Variable          | Default                |
| ----------------- | ----------------------------- | ---------------------- |
| `--allowed-hosts` | `MLFLOW_SERVER_ALLOWED_HOSTS` | localhost, private IPs |

**Example**:

```bash
# Specific hosts
mlflow server --allowed-hosts "mlflow.company.com,192.168.1.100"

# Wildcard patterns
mlflow server --allowed-hosts "*.company.com,192.168.*"

# Allow all (not recommended)
mlflow server --allowed-hosts "*"
```

### CORS Origins

Specifies which web applications can make API requests from browsers:

| CLI Option               | Environment Variable                 | Default                             |
| ------------------------ | ------------------------------------ | ----------------------------------- |
| `--cors-allowed-origins` | `MLFLOW_SERVER_CORS_ALLOWED_ORIGINS` | localhost:\* (any localhost origin) |

```bash
# Specific origins
mlflow server --cors-allowed-origins "https://app.company.com,https://notebook.company.com"

# Wildcard for subdomains
mlflow server --cors-allowed-origins "https://*.company.com"

# Allow all origins (development only)
mlflow server --cors-allowed-origins "*"
```

### X-Frame-Options

Sets the X-Frame-Options header to control iframe embedding behavior:

| CLI Option          | Environment Variable            | Default    |
| ------------------- | ------------------------------- | ---------- |
| `--x-frame-options` | `MLFLOW_SERVER_X_FRAME_OPTIONS` | SAMEORIGIN |

- `SAMEORIGIN` - Only same origin can embed (default)
- `DENY` - No embedding allowed
- `NONE` - Any site can embed

```bash
# Allow cross-origin iframe embedding
mlflow server --x-frame-options NONE
```

### Disable Security Middleware

Completely disables security middleware. Use this only when security is handled by a reverse proxy or gateway:

| CLI Option                      | Environment Variable                        | Default |
| ------------------------------- | ------------------------------------------- | ------- |
| `--disable-security-middleware` | `MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE` | false   |

```bash
mlflow server --disable-security-middleware
```

## Common Scenarios

### Local Development

Default configuration works out of the box:

```bash
mlflow server
```

This setup accepts connections from localhost and any private IPs.

### Remote Tracking Server

For a shared server accessed by multiple known users, you can configure it to allow connections
from specific hosts.

```bash
mlflow server --host 0.0.0.0 --allowed-hosts "mlflow.internal:5000,localhost:*"
```

Then use MLflow Python SDK to connect to remote tracking servers:

```python
import mlflow

# Connect to remote server
mlflow.set_tracking_uri("http://mlflow.company.com:5000")

with mlflow.start_run():
    mlflow.log_param("alpha", 0.5)
    mlflow.log_metric("rmse", 0.1)
```

:::info Host vs Allowed Hosts

:::

### Render MLflow UI within Jupyter Notebooks

When notebooks run on a different domain than your MLflow server, configure CORS and frame options:

```bash
# Allow embedding from notebook domain
mlflow server --host 0.0.0.0 \
  --x-frame-options NONE \
  --cors-allowed-origins "https://jupyter.company.com"
```

Then embed specific MLflow views directly in notebook cells:

```python
from IPython.display import IFrame

# Embed MLflow UI
IFrame(src="http://mlflow.company.com:5000", width=1000, height=600)
```

### Embedding MLflow UI in Web Applications

Create a component to display MLflow content:

```jsx
function MLflowDashboard() {
  return (
    <iframe
      src="http://mlflow.company.com:5000/experiments/1"
      style={{ width: '100%', height: '800px' }}
      title="MLflow"
    />
  );
}
```

Configure the MLflow server to accept requests from your webapp:

```bash
mlflow server --host 0.0.0.0 \
  --x-frame-options NONE \
  --cors-allowed-origins "http://localhost:3000,https://app.company.com"
```

Use this HTML file to verify iframe configuration works correctly:

```html
<!DOCTYPE html>
<html>
<head>
    <title>MLflow iframe Test</title>
</head>
<body>
    <h1>MLflow Embedding Test</h1>
    <iframe
        src="http://localhost:5000"
        style="width: 100%; height: 600px; border: 1px solid #ccc;"
        onload="document.getElementById('status').innerHTML = '✅ Loaded'"
        onerror="document.getElementById('status').innerHTML = '❌ Failed'">
    </iframe>
    <div id="status">Loading...</div>
</body>
</html>
```
```

--------------------------------------------------------------------------------

---[FILE: sso.mdx]---
Location: mlflow-master/docs/docs/self-hosting/security/sso.mdx

```text
import ImageBox from "@site/src/components/ImageBox";

# SSO (Single Sign-On)

You can use SSO (Single Sign-On) to authenticate users to your MLflow instance, by installing a custom plugin or using a reverse proxy.

## Using OIDC Plugin

MLflow supports SSO (Single Sign-On) with custom plugins for authentication. The [mlflow-oidc-auth](https://github.com/mlflow-oidc/mlflow-oidc-auth) plugin provides OIDC support for MLflow.

**Features**:

- OIDC-based authentication for MLflow UI and API
- User management through OIDC provider
- User-level access control
- Group-based access control
- Permissions management based on regular expressions (allows or denies access to specific MLflow resources based on regular expressions and assigns permissions to users or groups)
- Support for session, JWT, and basic authentication methods
- Compatible with mlflow-client (basic auth)

:::note

This plugin is maintained by the community.

:::

```bash
pip install mlflow-oidc-auth[full]
mlflow server --app-name oidc-auth --host 0.0.0.0 --port 8080
```

## Reverse proxy pattern

Another common approach is to place MLflow behind a proxy that handles SSO and forwards authenticated requests. The most popular way is to use [oauth2-proxy](https://github.com/oauth2-proxy/oauth2-proxy) reverse proxy.

1. Configure your proxy (NGINX, Traefik, Envoy, or cloud gateways such as AWS ALB with OIDC) to authenticate users against your IdP (Okta, Azure AD, Google Workspace).
2. After a successful login, inject user identity headers (for example, `X-Email` or `X-Forwarded-User`) and restrict access to authenticated sessions only.
3. Run MLflow without the Basic Auth app and rely on the proxy as the enforcement layer, or map the incoming identity header to a Basic Auth user using a custom middleware.

This pattern keeps MLflow stateless while deferring token validation and MFA enforcement to systems designed for it. You can find the reference implementation in [this repository](https://github.com/cloudacode/mlflow-oauth-sidecar).

<ImageBox src="https://github.com/cloudacode/mlflow-oauth-sidecar/raw/main/mlflow-google-auth.gif" alt="Example" />
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: mlflow-master/docs/eslint-plugin-mlflow-docs/index.js

```javascript
/**
 * ESLint plugin for MLflow documentation with custom rules.
 *
 * @type {import('eslint').ESLint.Plugin}
 */
module.exports = {
  rules: {
    /** Rule to validate NotebookDownloadButton URLs */
    'valid-notebook-url': require('./rules/valid-notebook-url'),
    /** Rule to detect raw image paths that should use useBaseUrl */
    'use-base-url-for-images': require('./rules/use-base-url-for-images'),
    /** Rule to enforce <APILink> usage when referencing the API doc **/
    'prefer-apilink-component': require('./rules/prefer-apilink-component'),
  },
};
```

--------------------------------------------------------------------------------

---[FILE: prefer-apilink-component.js]---
Location: mlflow-master/docs/eslint-plugin-mlflow-docs/rules/prefer-apilink-component.js

```javascript
/**
 * ESLint rule to validate API Reference URLs.
 *
 * This rule ensures that links to /api_reference/ use the <APILink> component.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect `Link` components with `to` props to API references and suggest using APILink',
      category: 'Best Practices',
    },
    schema: [],
    messages: {
      useAPILink: 'Use the <APILink> component for API reference links',
    },
  },

  /**
   * Creates the rule implementation.
   *
   * @param {import('eslint').Rule.RuleContext} context - The ESLint rule context
   * @returns {import('eslint').Rule.RuleListener} The rule visitor methods
   */
  create(context) {
    return {
      /**
       * Validates JSX opening elements for `Link` tags.
       *
       * @param {import('estree').Node} node - The JSX opening element node
       */
      JSXOpeningElement(node) {
        if (node.type !== 'JSXOpeningElement' || node.name.type !== 'JSXIdentifier' || node.name.name !== 'Link') {
          return;
        }
        const toAttr = node.attributes.find((attr) => attr.type === 'JSXAttribute' && attr.name.name === 'to');

        if (!toAttr) {
          return;
        }

        const toValue = getHrefValue(toAttr);

        if (!toValue) {
          // Can't determine a static value.
          return;
        }

        // Ignore REST API links
        if (toValue.startsWith('/api_reference/') && !toValue.startsWith('/api_reference/rest-api.html')) {
          context.report({
            node,
            messageId: 'useAPILink',
          });
        }
      },
    };
  },
};

/**
 * Extracts the href value from a JSX attribute.
 *
 * @param {import('estree-jsx').JSXAttribute} attr - The JSX attribute node
 * @returns {string|null} The href value or null if it can't be determined
 */
function getHrefValue(attr) {
  if (!attr.value) return null;

  if (attr.value.type === 'Literal') {
    return attr.value.value;
  }

  if (attr.value.type === 'JSXExpressionContainer' && attr.value.expression.type === 'Literal') {
    return attr.value.expression.value;
  }

  if (
    attr.value.type === 'JSXExpressionContainer' &&
    attr.value.expression.type === 'TemplateLiteral' &&
    attr.value.expression.expressions.length === 0
  ) {
    return attr.value.expression.quasis[0].value.raw;
  }

  // Can't determine value for dynamic expressions
  return null;
}
```

--------------------------------------------------------------------------------

---[FILE: use-base-url-for-images.js]---
Location: mlflow-master/docs/eslint-plugin-mlflow-docs/rules/use-base-url-for-images.js

```javascript
/**
 * ESLint rule to detect raw image paths that should use useBaseUrl in Docusaurus.
 *
 * This rule ensures that image paths in JSX elements use the useBaseUrl hook
 * instead of raw paths to prevent broken links in the published site.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect raw image paths that should use useBaseUrl in Docusaurus',
      category: 'Possible Errors',
    },
    fixable: null,
    schema: [],
    messages: {
      rawImagePath:
        "Raw image path \"{{path}}\" will break in production. Use one of these methods:\n\n1. Import as ES6 module:\n  import ImageUrl from '@site/static{{path}}';\n  <img src={ImageUrl} />\n\n2. Use useBaseUrl:\n  import useBaseUrl from '@docusaurus/useBaseUrl';\n  <img src={useBaseUrl('{{path}}')} />\n\nSee: https://docusaurus.io/docs/static-assets#referencing-your-static-asset",
    },
  },

  /**
   * Creates the rule implementation.
   *
   * @param {import('eslint').Rule.RuleContext} context - The ESLint rule context
   * @returns {import('eslint').Rule.RuleListener} The rule visitor methods
   */
  create(context) {
    /**
     * Extracts the string value from various node types.
     *
     * @param {import('estree').Node} node - The node to extract value from
     * @returns {string|null} The extracted string value or null
     */
    function getStringValue(node) {
      if (!node) return null;

      // Handle literal strings
      if (node.type === 'Literal' && typeof node.value === 'string') {
        return node.value;
      }

      // Handle template literals without expressions
      if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
        return node.quasis[0].value.raw;
      }

      return null;
    }

    return {
      /**
       * Validates JSX opening elements for img tags and Image components.
       *
       * @param {import('estree').Node} node - The JSX opening element node
       */
      JSXOpeningElement(node) {
        if (node.type !== 'JSXOpeningElement') return;

        const elementName = node.name.type === 'JSXIdentifier' ? node.name.name : null;

        // Check if this is an img tag or Image component
        if (elementName !== 'img' && elementName !== 'Image') return;

        // Find the src attribute
        const srcAttr = node.attributes.find((attr) => attr.type === 'JSXAttribute' && attr.name.name === 'src');

        if (!srcAttr || !srcAttr.value) return;

        let srcValue = null;

        // Handle different attribute value types
        if (srcAttr.value.type === 'Literal') {
          srcValue = srcAttr.value.value;
        } else if (srcAttr.value.type === 'JSXExpressionContainer') {
          srcValue = getStringValue(srcAttr.value.expression);
        }

        // Check if it's a raw static path
        if (srcValue && srcValue.startsWith('/')) {
          context.report({
            node: srcAttr,
            messageId: 'rawImagePath',
            data: { path: srcValue },
          });
        }
      },
    };
  },
};
```

--------------------------------------------------------------------------------

---[FILE: valid-notebook-url.js]---
Location: mlflow-master/docs/eslint-plugin-mlflow-docs/rules/valid-notebook-url.js

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRootCache = new Map();

/**
 * ESLint rule to validate NotebookDownloadButton URLs.
 *
 * This rule ensures that NotebookDownloadButton components have valid MLflow repository URLs
 * that point to existing files in the repository.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect NotebookDownloadButton with invalid MLflow repository URLs',
      category: 'Possible Errors',
    },
    fixable: null,
    schema: [],
    messages: {
      missingHref: 'NotebookDownloadButton is missing href attribute',
      emptyHref: 'NotebookDownloadButton href is empty',
      invalidFormat:
        'NotebookDownloadButton href must start with "https://raw.githubusercontent.com/mlflow/mlflow/master/"',
      fileNotFound: 'NotebookDownloadButton href points to non-existent file: "{{path}}"',
    },
  },

  /**
   * Creates the rule implementation.
   *
   * @param {import('eslint').Rule.RuleContext} context - The ESLint rule context
   * @returns {import('eslint').Rule.RuleListener} The rule visitor methods
   */
  create(context) {
    return {
      /**
       * Validates JSX opening elements for NotebookDownloadButton components.
       *
       * @param {import('estree').Node} node - The JSX opening element node
       */
      JSXOpeningElement(node) {
        if (
          node.type !== 'JSXOpeningElement' ||
          node.name.type !== 'JSXIdentifier' ||
          node.name.name !== 'NotebookDownloadButton'
        ) {
          return;
        }
        const hrefAttr = node.attributes.find((attr) => attr.type === 'JSXAttribute' && attr.name.name === 'href');

        if (!hrefAttr) {
          context.report({
            node,
            messageId: 'missingHref',
          });
          return;
        }

        const hrefValue = getHrefValue(hrefAttr);

        if (!hrefValue) {
          context.report({
            node: hrefAttr,
            messageId: 'emptyHref',
          });
          return;
        }

        validateMlflowUrl(context, hrefAttr, hrefValue);
      },
    };
  },
};

/**
 * Extracts the href value from a JSX attribute.
 *
 * @param {import('estree-jsx').JSXAttribute} attr - The JSX attribute node
 * @returns {string|null} The href value or null if it can't be determined
 */
function getHrefValue(attr) {
  if (!attr.value) return null;

  if (attr.value.type === 'Literal') {
    return attr.value.value;
  }

  if (attr.value.type === 'JSXExpressionContainer' && attr.value.expression.type === 'Literal') {
    return attr.value.expression.value;
  }

  if (
    attr.value.type === 'JSXExpressionContainer' &&
    attr.value.expression.type === 'TemplateLiteral' &&
    attr.value.expression.expressions.length === 0
  ) {
    return attr.value.expression.quasis[0].value.raw;
  }

  // Can't determine value for dynamic expressions
  return null;
}

/**
 * Validates that an href points to a valid MLflow repository URL.
 *
 * Checks two things:
 * 1. URL format: Must start with https://raw.githubusercontent.com/mlflow/mlflow/master/
 * 2. File existence: The referenced file must exist in the local repository
 *
 * @param {import('eslint').Rule.RuleContext} context - The ESLint rule context
 * @param {import('estree-jsx').JSXAttribute} hrefAttr - The href attribute node
 * @param {string} href - The href value to validate
 */
function validateMlflowUrl(context, hrefAttr, href) {
  const expectedPrefix = 'https://raw.githubusercontent.com/mlflow/mlflow/master/';

  if (!href.startsWith(expectedPrefix)) {
    context.report({
      node: hrefAttr,
      messageId: 'invalidFormat',
    });
    return;
  }

  const filePath = href.substring(expectedPrefix.length);
  const repoRoot = findRepoRoot();
  if (repoRoot) {
    const fullPath = path.join(repoRoot, filePath);

    if (!fs.existsSync(fullPath)) {
      context.report({
        node: hrefAttr,
        messageId: 'fileNotFound',
        data: { path: filePath },
      });
    }
  }
}

/**
 * Finds the root directory of the git repository using git rev-parse.
 *
 * @returns {string|null} The repository root path or null if not found
 */
function findRepoRoot() {
  const cacheKey = 'repoRoot';

  if (repoRootCache.has(cacheKey)) {
    return repoRootCache.get(cacheKey);
  }

  try {
    const repoRoot = execSync('git rev-parse --show-toplevel', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    repoRootCache.set(cacheKey, repoRoot);
    return repoRoot;
  } catch {
    repoRootCache.set(cacheKey, null);
    return null;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: build-all.py]---
Location: mlflow-master/docs/scripts/build-all.py

```python
import os
import shutil
import subprocess
from pathlib import Path

import click

import mlflow

mlflow_version = mlflow.version.VERSION


def build_docs(package_manager, version):
    env = os.environ.copy()

    # ensure it ends with a "/"
    base_url = env.get("DOCS_BASE_URL", "/docs/").rstrip("/") + "/"
    api_reference_prefix = (
        env.get("API_REFERENCE_PREFIX", "https://mlflow.org/docs/").rstrip("/") + "/"
    )

    output_path = Path(f"_build/{version}")
    versioned_url = Path(f"{base_url}{version}")
    build_path = Path("build")

    print(f"Building for `{versioned_url}`...")

    if output_path.exists():
        shutil.rmtree(output_path)

    if build_path.exists():
        shutil.rmtree(build_path)

    subprocess.check_call(
        package_manager + ["build"],
        env={
            **env,
            "DOCS_BASE_URL": str(versioned_url),
            "API_REFERENCE_PREFIX": f"{api_reference_prefix}{version}",
        },
    )
    shutil.copytree(build_path, output_path)


@click.command()
@click.option(
    "--use-npm",
    "use_npm",
    is_flag=True,
    default=False,
    help="Whether or not to use NPM as a package manager (in case yarn in unavailable)",
)
@click.option(
    "--no-r",
    "no_r",
    is_flag=True,
    default=False,
    help="Whether or not to skip building R documentation.",
)
def main(use_npm, no_r):
    gtm_id = os.environ.get("GTM_ID")

    assert gtm_id, (
        "Google Tag Manager ID is missing, please ensure that the GTM_ID environment variable is set"
    )

    package_manager = ["npm", "run"] if use_npm else ["yarn"]
    build_command = ["build-api-docs:no-r"] if no_r else ["build-api-docs"]

    subprocess.check_call(package_manager + build_command)
    subprocess.check_call(package_manager + ["convert-notebooks"])

    output_path = Path("_build")
    if output_path.exists():
        shutil.rmtree(output_path)
    output_path.mkdir(parents=True, exist_ok=True)

    for v in [mlflow_version, "latest"]:
        build_docs(package_manager, v)

    final_path = Path("build")
    if final_path.exists():
        shutil.rmtree(final_path)

    shutil.move(output_path, final_path)

    print("Finished building! Output can be found in the `build` directory")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: build-api-docs.py]---
Location: mlflow-master/docs/scripts/build-api-docs.py

```python
import os
import shutil
import subprocess

import click


@click.command()
@click.option("--with-r", "with_r", is_flag=True, default=False, help="Build R documentation")
@click.option(
    "--with-ts", "with_ts", is_flag=True, default=True, help="Build TypeScript documentation"
)
def main(with_r, with_ts):
    try:
        # Run "make rsthtml" in "api_reference" subfolder
        print("Building API reference documentation...")
        subprocess.run(["make", "clean"], check=True, cwd="api_reference")
        subprocess.run(["make", "rsthtml"], check=True, cwd="api_reference")
        subprocess.run(["make", "javadocs"], check=True, cwd="api_reference")
        if with_r:
            subprocess.run(["make", "rdocs"], check=True, cwd="api_reference")
        if with_ts:
            subprocess.run(["make", "tsdocs"], check=True, cwd="api_reference")
        print("Build successful.")
    except subprocess.CalledProcessError as e:
        print(f"Build failed: {e}")
        exit(1)

    destination_folder = "static/api_reference"
    source_folder = "api_reference/build/html"

    # Remove the destination folder if it exists
    if os.path.exists(destination_folder):
        shutil.rmtree(destination_folder)
        print(f"Removed existing static API docs at {destination_folder}.")

    # Copy the contents of "api_reference/build/html" to "static/api_reference"
    shutil.copytree(source_folder, destination_folder)
    print(f"Copied files from {source_folder} to {destination_folder}.")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: check-links.mts]---
Location: mlflow-master/docs/scripts/check-links.mts

```text
import markdownLinkCheck from 'markdown-link-check';
import { glob } from 'glob';
import * as fs from 'fs/promises';

async function main() {
  let encounteredBrokenLinks = false;

  const checkExternalLinks = process.env.CHECK_EXTERNAL_LINKS === 'true';
  for (const filename of await glob('docs/**/*.mdx')) {
    console.log('[CHECKING FILE]', filename);

    const content = await fs.readFile(filename, 'utf8');
    const brokenLinks = await check(content, checkExternalLinks);

    if (brokenLinks.length > 0) {
      console.log('[BROKEN LINKS]');
      brokenLinks.forEach((result) => console.log(`${result.link} ${result.statusCode}`));
      encounteredBrokenLinks = true;
    } else {
      console.log('[NO BROKEN LINKS]');
    }
  }

  if (encounteredBrokenLinks) {
    console.error('Found some broken links!');
    process.exit(1);
  }
}

await main();

type Result = {
  link: string;
  status: 'alive' | 'dead' | 'ignored';
  statusCode: number;
  err: Error | null;
};

async function check(content: string, checkExternalLinks: boolean): Promise<Result[]> {
  return new Promise((resolve, reject) => {
    const config = {
      httpHeaders: [
        {
          urls: ['https://openai.com', 'https://platform.openai.com'],
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',
          },
        },
      ],
      ignorePatterns: checkExternalLinks
        ? [
            { pattern: '^(?!http)' }, // relative links
            { pattern: '^http:\/\/127\.0\.0\.1' }, // local dev
            { pattern: '^http:\/\/localhost' },
            { pattern: '^https:\/\/YOUR_DATABRICKS_HOST' },
          ]
        : [
            { pattern: '^(?!https?:\/\/(www\.)?mlflow.org|https:\/\/(www\.)?github\.com\/mlflow\/mlflow)' }, // internal links or mlflow/mlflow repo
          ],
    };

    markdownLinkCheck(content, config, function (err: Error | null, results: Result[]) {
      const brokenLinks = [];

      if (err) {
        console.error('Error', err);
        reject(err);
      } else {
        results.forEach(function (result: Result) {
          console.info(`[INFO] ${result.link} is ${result.status} ${result.statusCode}`);
          if (result.status === 'dead') {
            brokenLinks.push(result);
          }
        });

        resolve(brokenLinks);
      }
    });
  });
}
```

--------------------------------------------------------------------------------

---[FILE: compare-sitemaps.ts]---
Location: mlflow-master/docs/scripts/compare-sitemaps.ts

```typescript
import * as fs from 'fs';
import { XMLParser } from 'fast-xml-parser';
import fetch from 'node-fetch';

async function readSitemap(input: string): Promise<string> {
  if (/^https?:\/\//.test(input)) {
    const res = await fetch(input);
    if (!res.ok) {
      const responseBody = await res.text();
      throw new Error(`Failed to fetch ${input}: ${res.status} ${res.statusText}. Response body: ${responseBody}`);
    }
    return await res.text();
  } else {
    return await fs.promises.readFile(input, 'utf8');
  }
}

function normalizePath(url: string): string {
  const idx = url.indexOf('/latest/');
  return idx >= 0 ? url.slice(idx + 'latest/'.length) : url;
}

async function parseSitemap(input: string): Promise<Map<string, string>> {
  const xml = await readSitemap(input);
  const parser = new XMLParser();
  const parsed = parser.parse(xml);
  const urlset = parsed.urlset.url as { loc: string }[];

  const urlMap = new Map<string, string>();
  for (const { loc } of urlset) {
    const normalized = normalizePath(loc);
    urlMap.set(normalized, loc);
  }
  return urlMap;
}

function compareSitemaps(mapA: Map<string, string>, mapB: Map<string, string>) {
  const onlyInA: string[] = [];
  const onlyInB: string[] = [];
  const inBoth: string[] = [];

  for (const [url, _] of mapA) {
    if (!mapB.has(url)) {
      onlyInA.push(url);
    } else {
      inBoth.push(url);
    }
  }

  for (const url of mapB.keys()) {
    if (!mapA.has(url)) {
      onlyInB.push(url);
    }
  }

  return { onlyInA, onlyInB, inBoth };
}

(async () => {
  const fileA = process.argv[2];
  const fileB = process.argv[3];

  if (!fileA || !fileB) {
    console.error('Usage: tsx compare-sitemaps.ts <fileA|urlA> <fileB|urlB>');
    process.exit(1);
  }

  const [mapA, mapB] = await Promise.all([parseSitemap(fileA), parseSitemap(fileB)]);

  const { onlyInA, onlyInB, inBoth } = compareSitemaps(mapA, mapB);

  console.log(`URLs in both: ${inBoth.length}`);
  console.log(`Only in ${fileA}: ${onlyInA.length}`);
  onlyInA.forEach((url) => console.log(`  ${url}`));

  console.log(`Only in ${fileB}: ${onlyInB.length}`);
  onlyInB.forEach((url) => console.log(`  ${url}`));
})();
```

--------------------------------------------------------------------------------

---[FILE: convert-notebooks.py]---
Location: mlflow-master/docs/scripts/convert-notebooks.py

```python
"""
Converts all .ipynb files from the docs/ folder into .mdx files.

This script uses nbconvert to do the processing.
"""

import multiprocessing
import re
from pathlib import Path

import nbformat
import yaml
from nbconvert.exporters import MarkdownExporter
from nbconvert.preprocessors import Preprocessor

SOURCE_DIR = Path("docs/")
NOTEBOOK_BASE_EDIT_URL = "https://github.com/mlflow/mlflow/edit/master/docs/"
NOTEBOOK_BASE_DOWNLOAD_URL = "https://raw.githubusercontent.com/mlflow/mlflow/master/docs/"


class EscapeBackticksPreprocessor(Preprocessor):
    def preprocess_cell(self, cell, resources, cell_index):
        if cell.cell_type == "code":
            # escape backticks, as code blocks will be rendered
            # inside a custom react component like:
            # <NotebookCellOutput>`{{ content }}`</NotebookCellOutput>
            # and having the backticks causes issues
            cell.source = cell.source.replace("`", r"\`")

            if "outputs" in cell:
                for i, output in enumerate(cell["outputs"]):
                    if "text" in output:
                        output["text"] = output["text"].replace("`", r"\`")
                    elif "data" in output:
                        for key, value in output["data"].items():
                            if isinstance(value, str):
                                output["data"][key] = value.replace("`", r"\`")
        elif cell.cell_type == "raw":
            cell.source = cell.source.replace("<br>", "<br />")

        return cell, resources


exporter = MarkdownExporter(
    preprocessors=[EscapeBackticksPreprocessor],
    template_name="mdx",
    extra_template_basedirs=["./scripts/nbconvert_templates"],
)


def add_frontmatter(
    body: str,
    nb_path: Path,
) -> str:
    frontmatter = {
        "custom_edit_url": NOTEBOOK_BASE_EDIT_URL + str(nb_path),
        "slug": nb_path.stem,
    }
    formatted_frontmatter = yaml.dump(frontmatter)

    return f"""---
{formatted_frontmatter}
---

{body}"""


def add_download_button(
    body: str,
    nb_path: Path,
) -> str:
    download_url = NOTEBOOK_BASE_DOWNLOAD_URL + str(nb_path)
    download_button = f'<NotebookDownloadButton href="{download_url}">Download this notebook</NotebookDownloadButton>'

    # Insert the notebook underneath the first H1 header (assumed to be the title)
    pattern = r"(^#\s+.+$)"
    return re.sub(pattern, rf"\1\n\n{download_button}", body, count=1, flags=re.MULTILINE)


# add the imports for our custom cell output components
def add_custom_component_imports(
    body: str,
) -> str:
    return f"""import {{ NotebookCodeCell }} from "@site/src/components/NotebookCodeCell"
import {{ NotebookCellOutput }} from "@site/src/components/NotebookCellOutput"
import {{ NotebookHTMLOutput }} from "@site/src/components/NotebookHTMLOutput"
import {{ NotebookDownloadButton }} from "@site/src/components/NotebookDownloadButton"

{body}
"""


def convert_path(nb_path: Path):
    mdx_path = nb_path.with_stem(nb_path.stem + "-ipynb").with_suffix(".mdx")
    with open(nb_path) as f:
        nb = nbformat.read(f, as_version=4)

        body, _ = exporter.from_notebook_node(nb)
        body = add_custom_component_imports(body)
        body = add_frontmatter(body, nb_path)
        body = add_download_button(body, nb_path)

        with open(mdx_path, "w") as f:
            f.write(body)

        return mdx_path


def main():
    nb_paths = list(SOURCE_DIR.rglob("*.ipynb"))

    with multiprocessing.Pool() as pool:
        pool.map(convert_path, nb_paths)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: update-api-modules.ts]---
Location: mlflow-master/docs/scripts/update-api-modules.ts

```typescript
import * as fs from 'fs';
import path, { basename } from 'path';

const PYTHON_API_PATH = 'api_reference/source/python_api/';
const files = fs.readdirSync(PYTHON_API_PATH, { withFileTypes: false });
const fileMap = {};

files.forEach((file) => {
  if (file.startsWith('mlflow') && file.endsWith('.rst')) {
    const filename = basename(file, '.rst');
    // the eventual website path
    fileMap[filename] = 'api_reference/python_api/' + filename + '.html';
  }
});

// manual mapping for auth since it's a special case in the docs hierarchy
fileMap['mlflow.server.auth'] = 'api_reference/auth/python-api.html';
fileMap['mlflow.server.cli'] = 'api_reference/cli.html';
fileMap['mlflow.r'] = 'api_reference/R-api.html';
fileMap['mlflow.java'] = 'api_reference/java_api/index.html';
fileMap['mlflow.python'] = 'api_reference/python_api/index.html';
fileMap['mlflow.rest'] = 'api_reference/rest-api.html';
fileMap['mlflow.typescript'] = 'api_reference/typescript_api/index.html';
fileMap['mlflow.llms.deployments.api'] = 'api_reference/llms/deployments/api.html';

// write filemap to json file
fs.writeFileSync('src/api_modules.json', JSON.stringify(fileMap, null, 2));
```

--------------------------------------------------------------------------------

---[FILE: conf.json]---
Location: mlflow-master/docs/scripts/nbconvert_templates/mdx/conf.json

```json
{
  "mimetypes": {
    "text/markdown": true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.md.j2]---
Location: mlflow-master/docs/scripts/nbconvert_templates/mdx/index.md.j2

```text
{% extends 'markdown/index.md.j2' %}

{% block input %}
<NotebookCodeCell executionCount={ {{ "\" \"" if cell.execution_count is none else cell.execution_count }} }>
{`{{ cell.source}}`}
</NotebookCodeCell>{{ "\n" }}
{% endblock input %}

{%- block traceback_line -%}
<NotebookCellOutput isStderr>
{`{{ line.rstrip() | strip_ansi }}`}
</NotebookCellOutput>{{ "\n" }}
{%- endblock traceback_line -%}

{%- block stream -%}
<NotebookCellOutput {%- if output.name == "stderr" -%} {{ " isStderr" }} {%- endif %}>
{`{{ output.text.rstrip() }}`}
</NotebookCellOutput>{{ "\n" }}
{%- endblock stream -%}

{%- block data_text scoped -%}
<NotebookCellOutput>
{`{{ output.data['text/plain'].rstrip() }}`}
</NotebookCellOutput>{{ "\n" }}
{%- endblock data_text -%}

{%- block data_html scoped -%}
<NotebookHTMLOutput>
  <div dangerouslySetInnerHTML={% raw %}{{{% endraw %} __html: `{{ output.data['text/html'] | safe }}`{% raw %}}}{% endraw %} />
</NotebookHTMLOutput>{{ "\n" }}
{%- endblock data_html -%}

{%- block data_jpg scoped -%}
![](data:image/jpg;base64,{{ output.data['image/jpeg'] }})

{%- endblock data_jpg -%}

{%- block data_png scoped -%}
![](data:image/png;base64,{{ output.data['image/png'] }})

{%- endblock data_png -%}
```

--------------------------------------------------------------------------------

````

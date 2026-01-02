---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 34
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 34 of 991)

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

---[FILE: package.json]---
Location: mlflow-master/docs/package.json
Signals: React

```json
{
  "name": "docs",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "preview": "npm run build && npm run serve",
    "build": "DOCUSAURUS_IGNORE_SSG_WARNINGS=true docusaurus build",
    "build-api-docs": "uv run --group docs --extra gateway scripts/build-api-docs.py --with-r && tsx scripts/update-api-modules.ts",
    "build-api-docs:no-r": "uv run --group docs --extra gateway scripts/build-api-docs.py && tsx scripts/update-api-modules.ts",
    "build-all": "uv run --group docs --extra gateway scripts/build-all.py",
    "update-api-modules": "tsx scripts/update-api-modules.ts",
    "convert-notebooks": "uv run --group docs scripts/convert-notebooks.py",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear && git clean -Xdf docs/",
    "serve": "docusaurus serve",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids",
    "typecheck": "tsc",
    "prettier": "prettier",
    "prettier:fix": "prettier '**/*.{js,jsx,ts,tsx,md,mdx,css}' --write",
    "prettier:check": "prettier '**/*.{js,jsx,ts,tsx,md,mdx,css}' --check",
    "check-links": "tsx scripts/check-links.mts",
    "sitemap": "tsx scripts/compare-sitemaps.ts",
    "eslint": "eslint docs"
  },
  "dependencies": {
    "@docusaurus/core": "^3.6.3",
    "@docusaurus/faster": "^3.9.2",
    "@docusaurus/plugin-client-redirects": "^3.6.3",
    "@docusaurus/preset-classic": "^3.6.3",
    "@docusaurus/theme-mermaid": "^3.7.0",
    "@mdx-js/react": "^3.0.0",
    "@signalwire/docusaurus-plugin-llms-txt": "^2.0.0-alpha.6",
    "@signalwire/docusaurus-theme-llms-txt": "^1.0.0-alpha.8",
    "@tailwindcss/postcss": "^4.1.8",
    "@types/node": "^22.8.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.0.0",
    "fast-xml-parser": "^5.2.3",
    "lucide-react": "^0.522.0",
    "postcss": "^8.5.4",
    "prism-react-renderer": "^2.3.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^4.1.8",
    "tsx": "^4.19.2"
  },
  "devDependencies": {
    "@docusaurus/eslint-plugin": "^3.8.1",
    "@docusaurus/module-type-aliases": "^3.6.3",
    "@docusaurus/tsconfig": "^3.5.2",
    "@docusaurus/types": "^3.5.2",
    "@types/estree": "^1.0.8",
    "@types/estree-jsx": "^1.0.5",
    "eslint": "^9.29.0",
    "eslint-plugin-mdx": "^3.5.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-unused-imports": "^4.3.0",
    "markdown-link-check": "^3.13.7",
    "node-fetch": "^3.3.2",
    "prettier": "^3.6.1",
    "remark-cli": "^12.0.1",
    "remark-mdx": "^3.0.1",
    "typescript": "^5.6.3"
  },
  "browserslist": {
    "production": [
      ">0.5%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 3 chrome version",
      "last 3 firefox version",
      "last 5 safari version"
    ]
  },
  "engines": {
    "node": ">=18.0"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: postcss.config.mjs]---
Location: mlflow-master/docs/postcss.config.mjs

```text
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  }
}
```

--------------------------------------------------------------------------------

---[FILE: prettier.config.js]---
Location: mlflow-master/docs/prettier.config.js

```javascript
module.exports = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  embeddedLanguageFormatting: 'off',
};
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/docs/README.md

```text
# MLflow Documentation

This README covers information about the main MLflow documentation. The API reference is built separately and included as a static folder during the full build process. Please check out the [README](https://github.com/mlflow/mlflow/blob/master/docs/api_reference/README.md) in the `api_reference` folder for more information.

## Prerequisites

**Necessary**

- NodeJS >= 18.0 (see the [NodeJS documentation](https://nodejs.org/en/download) for installation instructions)
- (For building MDX files from `.ipynb` files) Python 3.9+, [nbconvert](https://pypi.org/project/nbconvert/), [nbformat](https://pypi.org/project/nbformat/) and [pyyml](https://pypi.org/project/pyyml/)

**Optional**

- (For building API docs) See [doc-requirements.txt](https://github.com/mlflow/mlflow/blob/master/requirements/doc-requirements.txt) for API doc requirements.

## Installation

```
$ npm install
```

## Local Development

1. If you haven't done this before, run `npm run convert-notebooks` to convert `.ipynb` files to `.mdx` files. The generated files are git-ignored.

2. Run the development server:

```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

**Note**: Some server-side rendering features will not work in this mode (e.g. the [client redirects plugin](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-client-redirects)). To test these, please use the "Build and Serve" workflow below.

## Build and Serve

In order to build the full MLflow documentation (i.e. the contents of https://mlflow.org/docs/latest/), please follow the following steps:

1. Run `npm run build-api-docs` in order to build the API reference and copy the generated HTML to `static/api_reference`.
   a. To speed up the build locally, you can run `npm run build-api-docs:no-r` to skip building R documentation
2. Run `npm run convert-notebooks` to convert `.ipynb` files to `.mdx` files. The generated files are git-ignored.
3. **⚠️ Important!** Run `export DOCS_BASE_URL=/docs/latest` (or wherever the docs are expected to be served). This configures the [Docusaurus baseUrl](https://docusaurus.io/docs/api/docusaurus-config#baseUrl), and the site may not render correctly if this is improperly set.
4. Finally, run `npm run build`. This generates static files in the `build` directory, which can then be served.
5. (Optional) To serve the artifacts generated in the above step, run `npm run serve`.

## Building for release

The generated `build` folder is expected to be hosted at https://mlflow.org/docs/latest. However, as our docs are versioned, we also have to generate the documentation for `https://mlflow.org/docs/{version}`. To do this conveniently, you can run the following command:

```
npm run build-all
```

This command will run all the necessary steps from the "Build and Serve" workflow above, and set the correct values for `DOCS_BASE_URL`. The generated HTML will be dumped to `build/latest` and `build/{version}`. These two folders can then be copied to the [docs repo](https://github.com/mlflow/mlflow-legacy-website/tree/main/docs) and uploaded to the website.

## Troubleshooting

### `Error: Invalid sidebar file at "sidebarsGenAI.ts". These sidebar document ids do not exist:`

This error occurs when some links in the sidebar point to non-existent documents.

When it errors for `-ipynb` pages, it is not the link problem but the notebook conversion script is not run. Run `npm run convert-notebooks` in the above steps to convert `.ipynb` files to `.mdx` files. The generated files are git-ignored.

```
[ERROR] Error: Invalid sidebar file at "sidebarsGenAI.ts".
These sidebar document ids do not exist:

eval-monitor/notebooks/huggingface-evaluation-ipynb
eval-monitor/notebooks/question-answering-evaluation-ipynb
...
```
```

--------------------------------------------------------------------------------

---[FILE: sidebars.ts]---
Location: mlflow-master/docs/sidebars.ts

```typescript
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { apiReferencePrefix } from './docusaurusConfigUtils';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docsSidebar: [
    {
      type: 'doc',
      id: 'index',
      className: 'sidebar-top-level-category',
    },
    {
      type: 'doc',
      id: 'mlflow-3/index',
      label: 'MLflow 3.0 Migration',
      className: 'sidebar-top-level-category',
    },
    {
      type: 'category',
      label: 'Getting Started',
      className: 'sidebar-top-level-category',
      items: [
        {
          type: 'doc',
          id: 'getting-started/intro-quickstart/index',
          label: 'Quickstart',
        },
        {
          type: 'doc',
          id: 'introduction/index',
          label: 'Introduction',
        },
        {
          type: 'doc',
          id: 'getting-started/running-notebooks/index',
        },
        {
          type: 'doc',
          id: 'getting-started/databricks-trial/index',
        },
        {
          type: 'category',
          label: 'More Tutorials',
          items: [
            {
              type: 'doc',
              label: 'Hyperparameter Tuning Tutorial',
              id: 'getting-started/quickstart-2/index',
            },
            {
              type: 'category',
              label: 'Model Registry Tutorial',
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'getting-started/registering-first-model',
                },
              ],
            },
            {
              type: 'doc',
              id: 'getting-started/tracking-server-overview/index',
            },
          ],
        },
      ],
      link: {
        type: 'doc',
        id: 'getting-started/index',
      },
    },
    {
      type: 'category',
      label: 'Machine Learning 🧠',
      className: 'sidebar-top-level-category',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'LLM / GenAI',
          items: [
            {
              type: 'doc',
              label: 'Overview',
              id: 'llms/index',
            },
            {
              type: 'category',
              label: 'Integrations',
              items: [
                {
                  type: 'category',
                  label: 'OpenAI',
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'llms/openai',
                    },
                  ],
                  link: {
                    type: 'doc',
                    id: 'llms/openai/index',
                  },
                },
                {
                  type: 'category',
                  label: 'LangChain',
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'llms/langchain',
                    },
                  ],
                  link: {
                    type: 'doc',
                    id: 'llms/langchain/index',
                  },
                },
                {
                  type: 'category',
                  label: 'DSPy',
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'llms/dspy',
                    },
                  ],
                  link: {
                    type: 'doc',
                    id: 'llms/dspy/index',
                  },
                },
                {
                  type: 'doc',
                  id: 'llms/llama-index/index',
                  label: 'LlamaIndex',
                },
                {
                  type: 'category',
                  label: 'Transformers',
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'llms/transformers',
                    },
                  ],
                  link: {
                    type: 'doc',
                    id: 'llms/transformers/index',
                  },
                },
                {
                  type: 'category',
                  label: 'Sentence Transformers',
                  items: [
                    {
                      type: 'autogenerated',
                      dirName: 'llms/sentence-transformers',
                    },
                  ],
                  link: {
                    type: 'doc',
                    id: 'llms/sentence-transformers/index',
                  },
                },
                {
                  type: 'link',
                  href: '/tracing/integrations/',
                  label: 'More',
                },
              ],
            },
            {
              type: 'link',
              label: 'Tracing (Observability)',
              href: '/tracing/',
            },
            {
              type: 'category',
              label: 'Evaluation',
              link: {
                type: 'doc',
                id: 'llms/llm-evaluate/index',
              },
              items: [
                {
                  type: 'autogenerated',
                  dirName: 'llms/llm-evaluate',
                },
              ],
            },
            {
              type: 'doc',
              label: 'Production Monitoring',
              id: 'tracing/production',
            },
            {
              type: 'category',
              label: 'ResponsesAgent',
              items: [
                {
                  type: 'doc',
                  id: 'llms/responses-agent-intro/index',
                  label: 'ResponsesAgent Introduction',
                },
              ],
            },
            {
              type: 'category',
              label: 'ChatModel',
              items: [
                {
                  type: 'doc',
                  id: 'llms/chat-model-intro/index',
                  label: 'What is ChatModel?',
                },
                {
                  type: 'doc',
                  id: 'llms/chat-model-guide/index',
                  label: 'Advanced Guide',
                },
                {
                  type: 'doc',
                  id: 'llms/custom-pyfunc-for-llms/index',
                  label: 'More Customization',
                },
              ],
            },
            {
              type: 'category',
              label: 'RAG',
              items: [
                {
                  type: 'doc',
                  id: 'llms/rag/index',
                  label: 'What is RAG?',
                },
                {
                  type: 'doc',
                  id: 'llms/rag/notebooks/index',
                },
              ],
            },
            {
              type: 'link',
              label: 'Prompt Engineering',
              href: '/prompts',
            },
          ],
          link: {
            type: 'doc',
            id: 'llms/index',
          },
        },
        {
          type: 'category',
          label: 'Deep Learning',
          items: [
            {
              type: 'autogenerated',
              dirName: 'deep-learning',
            },
          ],
          link: {
            type: 'doc',
            id: 'deep-learning/index',
          },
        },
        {
          type: 'category',
          label: 'Traditional ML',
          items: [
            {
              type: 'autogenerated',
              dirName: 'traditional-ml',
            },
          ],
          link: {
            type: 'doc',
            id: 'traditional-ml/index',
          },
        },
      ],
    },
    {
      type: 'category',
      label: 'Build 🔨 ',
      className: 'sidebar-top-level-category',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'MLflow Tracking',
          items: [
            {
              type: 'doc',
              id: 'tracking/index',
            },
            /* Using link instead of doc to avoid duplicated select state in sidebar */
            {
              type: 'link',
              href: '/getting-started/intro-quickstart/',
              label: 'Quickstart',
            },
            {
              type: 'doc',
              id: 'tracking/autolog/index',
            },
            {
              type: 'link',
              label: 'Tracking Server',
              href: '/self-hosting/architecture',
            },
            {
              type: 'category',
              label: 'Searching Runs & Experiments',
              items: [
                {
                  type: 'doc',
                  id: 'search-runs/index',
                },
                {
                  type: 'doc',
                  id: 'search-experiments/index',
                },
              ],
            },
            {
              type: 'doc',
              id: 'system-metrics/index',
            },
          ],
          link: {
            type: 'doc',
            id: 'tracking/index',
          },
        },
        {
          type: 'category',
          label: 'MLflow Model',
          items: [
            {
              type: 'autogenerated',
              dirName: 'model',
            },
          ],
        },
        {
          type: 'category',
          label: 'MLflow Prompts 🆕',
          items: [
            {
              type: 'doc',
              label: 'Overview',
              id: 'prompts/index',
            },
            {
              type: 'doc',
              id: 'prompts/cm',
            },
            {
              type: 'doc',
              id: 'prompts/evaluate',
            },
            {
              type: 'doc',
              id: 'prompts/run-and-model',
            },
            {
              type: 'doc',
              id: 'prompts/optimize-prompt',
            },
            {
              type: 'doc',
              id: 'llms/prompt-engineering/index',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Evaluate & Monitor 📊',
      className: 'sidebar-top-level-category',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'model-evaluation/index',
          label: 'MLflow Evaluation',
        },
        {
          type: 'category',
          label: 'MLflow Tracing (Observability)',
          items: [
            {
              type: 'autogenerated',
              dirName: 'tracing',
            },
          ],
          link: {
            type: 'doc',
            id: 'tracing/index',
          },
        },
        {
          type: 'doc',
          id: 'dataset/index',
          label: 'MLflow Dataset',
        },
      ],
    },
    {
      type: 'category',
      label: 'Deploy 🚀',
      className: 'sidebar-top-level-category',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'model-registry/index',
        },
        {
          type: 'category',
          label: 'MLflow Serving',
          items: [
            {
              type: 'autogenerated',
              dirName: 'deployment',
            },
          ],
        },
        {
          type: 'category',
          label: 'MLflow AI Gateway',
          link: {
            type: 'doc',
            id: 'llms/deployments/index',
          },
          items: [
            {
              type: 'autogenerated',
              dirName: 'llms/deployments',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Team Collaboration 👥',
      className: 'sidebar-top-level-category',
      collapsed: true,
      items: [
        {
          type: 'link',
          href: '/self-hosting',
          label: 'Self-Hosting',
        },
        {
          type: 'link',
          href: '/#running-mlflow-anywhere',
          label: 'Managed Services',
        },
        {
          type: 'doc',
          id: '/self-hosting/security/basic-http-auth',
          label: 'Access Control',
        },
        {
          type: 'doc',
          id: 'projects/index',
          label: 'MLflow Projects',
        },
      ],
    },
    {
      type: 'category',
      label: 'API References',
      className: 'sidebar-top-level-category',
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'Python API',
          href: `${apiReferencePrefix()}api_reference/python_api/index.html`,
        },
        {
          type: 'link',
          label: 'Java API',
          href: `${apiReferencePrefix()}api_reference/java_api/index.html`,
        },
        {
          type: 'link',
          label: 'R API',
          href: `${apiReferencePrefix()}api_reference/R-api.html`,
        },
        {
          type: 'link',
          label: 'REST API',
          href: `${apiReferencePrefix()}api_reference/rest-api.html`,
        },
        {
          type: 'link',
          label: 'CLI',
          href: `${apiReferencePrefix()}api_reference/cli.html`,
        },
      ],
    },
    {
      type: 'category',
      label: 'More',
      collapsed: true,
      className: 'sidebar-top-level-category',
      items: [
        {
          type: 'link',
          label: 'Contributing',
          href: 'https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md',
        },
        {
          type: 'link',
          label: 'MLflow Blogs',
          href: 'https://mlflow.org/blog/index.html',
        },
        {
          type: 'doc',
          id: 'plugins/index',
        },
      ],
    },
  ],
};

export default sidebars;
```

--------------------------------------------------------------------------------

---[FILE: sidebarsClassicML.ts]---
Location: mlflow-master/docs/sidebarsClassicML.ts

```typescript
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { apiReferencePrefix } from './docusaurusConfigUtils';

const sidebarsClassicML: SidebarsConfig = {
  classicMLSidebar: [
    {
      type: 'doc',
      id: 'index',
      className: 'sidebar-top-level-category',
      label: 'MLflow',
    },
    {
      type: 'category',
      label: 'Getting Started',
      className: 'sidebar-top-level-category',
      items: [
        {
          type: 'doc',
          id: 'getting-started/running-notebooks/index',
          label: 'Set Up MLflow',
        },
        {
          type: 'doc',
          id: 'getting-started/quickstart',
        },
        {
          type: 'doc',
          id: 'getting-started/hyperparameter-tuning/index',
        },
        {
          type: 'doc',
          id: 'getting-started/deep-learning',
        },
      ],
      link: {
        type: 'doc',
        id: 'getting-started/index',
      },
    },
    {
      type: 'category',
      label: 'Machine Learning',
      className: 'sidebar-top-level-category',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Traditional ML',
          items: [
            {
              type: 'category',
              label: 'Tutorials',
              items: [
                {
                  type: 'category',
                  label: 'Hyperparameter Tuning with MLflow and Optuna',
                  items: [
                    {
                      type: 'doc',
                      id: 'traditional-ml/tutorials/hyperparameter-tuning/part1-child-runs/index',
                    },
                    {
                      type: 'doc',
                      id: 'traditional-ml/tutorials/hyperparameter-tuning/part2-logging-plots/index',
                    },
                    {
                      type: 'category',
                      label: 'Notebooks',
                      items: [
                        {
                          type: 'doc',
                          id: 'traditional-ml/tutorials/hyperparameter-tuning/notebooks/hyperparameter-tuning-with-child-runs-ipynb',
                        },
                        {
                          type: 'doc',
                          id: 'traditional-ml/tutorials/hyperparameter-tuning/notebooks/logging-plots-in-mlflow-ipynb',
                        },
                        {
                          type: 'doc',
                          id: 'traditional-ml/tutorials/hyperparameter-tuning/notebooks/parent-child-runs-ipynb',
                        },
                      ],
                      link: {
                        type: 'doc',
                        id: 'traditional-ml/tutorials/hyperparameter-tuning/notebooks/index',
                      },
                    },
                  ],
                  link: {
                    type: 'doc',
                    id: 'traditional-ml/tutorials/hyperparameter-tuning/index',
                  },
                },
                {
                  type: 'category',
                  label: 'Building Custom Python Function Models with MLflow',
                  items: [
                    {
                      type: 'doc',
                      id: 'traditional-ml/tutorials/creating-custom-pyfunc/part1-named-flavors/index',
                    },
                    {
                      type: 'doc',
                      id: 'traditional-ml/tutorials/creating-custom-pyfunc/part2-pyfunc-components/index',
                    },
                    {
                      type: 'category',
                      label: 'Notebooks',
                      items: [
                        {
                          type: 'doc',
                          id: 'traditional-ml/tutorials/creating-custom-pyfunc/notebooks/basic-pyfunc-ipynb',
                          label: 'Introduction to PythonModel',
                        },
                        {
                          type: 'doc',
                          id: 'traditional-ml/tutorials/creating-custom-pyfunc/notebooks/introduction-ipynb',
                          label: 'Custom Model Basics',
                        },
                        {
                          type: 'doc',
                          id: 'traditional-ml/tutorials/creating-custom-pyfunc/notebooks/override-predict-ipynb',
                          label: 'Customizing the `predict` method',
                        },
                      ],
                      link: {
                        type: 'doc',
                        id: 'traditional-ml/tutorials/creating-custom-pyfunc/notebooks/index',
                      },
                    },
                  ],
                  link: {
                    type: 'doc',
                    id: 'traditional-ml/tutorials/creating-custom-pyfunc/index',
                  },
                },
                {
                  type: 'category',
                  label: 'Serving Multiple Models on a Single Endpoint with a Custom PyFunc Model',
                  items: [
                    {
                      type: 'doc',
                      id: 'traditional-ml/tutorials/serving-multiple-models-with-pyfunc/notebooks/MME_Tutorial-ipynb',
                      label: 'Notebooks',
                    },
                  ],
                  link: {
                    type: 'doc',
                    id: 'traditional-ml/tutorials/serving-multiple-models-with-pyfunc/index',
                  },
                },
              ],
            },
            {
              type: 'doc',
              id: 'traditional-ml/sklearn/index',
              label: 'Scikit-learn',
            },
            {
              type: 'doc',
              id: 'traditional-ml/xgboost/index',
              label: 'XGBoost',
            },
            {
              type: 'doc',
              id: 'traditional-ml/sparkml/index',
              label: 'SparkML',
            },
            {
              type: 'doc',
              id: 'traditional-ml/prophet/index',
              label: 'Prophet',
            },
          ],
          link: {
            type: 'doc',
            id: 'traditional-ml/index',
          },
        },
        {
          type: 'category',
          label: 'Deep Learning',
          items: [
            {
              type: 'doc',
              id: 'deep-learning/pytorch/index',
              label: 'PyTorch',
            },
            {
              type: 'doc',
              id: 'deep-learning/tensorflow/index',
              label: 'TensorFlow',
            },
            {
              type: 'doc',
              id: 'deep-learning/keras/index',
              label: 'Keras',
            },
            {
              type: 'category',
              label: 'Transformers',
              items: [
                {
                  type: 'doc',
                  id: 'deep-learning/transformers/guide/index',
                },
                {
                  type: 'doc',
                  id: 'deep-learning/transformers/large-models/index',
                  label: 'Working with Large Transformers Models',
                },
                {
                  type: 'doc',
                  id: 'deep-learning/transformers/task/index',
                  label: 'Transformers Task Types',
                },
                {
                  type: 'category',
                  label: 'Tutorials',
                  items: [
                    {
                      type: 'doc',
                      id: 'deep-learning/transformers/tutorials/conversational/conversational-model-ipynb',
                      label: 'Introduction to Conversational Models',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/transformers/tutorials/conversational/pyfunc-chat-model-ipynb',
                      label: 'Custom Conversational Models',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/transformers/tutorials/fine-tuning/transformers-fine-tuning-ipynb',
                      label: 'Introduction to Fine Tuning',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/transformers/tutorials/fine-tuning/transformers-peft-ipynb',
                      label: 'Leveraging PEFT for Fine Tuning',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/transformers/tutorials/audio-transcription/whisper-ipynb',
                      label: 'Introduction to Audio Transcription',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/transformers/tutorials/prompt-templating/prompt-templating-ipynb',
                      label: 'Introduction to Prompt Templating',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/transformers/tutorials/text-generation/text-generation-ipynb',
                      label: 'Text Generation Models',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/transformers/tutorials/translation/component-translation-ipynb',
                      label: 'Translation Models',
                    },
                  ],
                  link: {
                    type: 'doc',
                    id: 'deep-learning/transformers/tutorials/index',
                  },
                },
              ],
              link: {
                type: 'doc',
                id: 'deep-learning/transformers/index',
              },
            },
            {
              type: 'category',
              label: 'Sentence Transformers',
              items: [
                {
                  type: 'category',
                  label: 'Tutorials',
                  items: [
                    {
                      type: 'doc',
                      id: 'deep-learning/sentence-transformers/tutorials/quickstart/sentence-transformers-quickstart-ipynb',
                      label: 'Quickstart',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/sentence-transformers/tutorials/semantic-similarity/semantic-similarity-sentence-transformers-ipynb',
                      label: 'Semantic Similarity',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/sentence-transformers/tutorials/semantic-search/semantic-search-sentence-transformers-ipynb',
                      label: 'Semantic Search',
                    },
                    {
                      type: 'doc',
                      id: 'deep-learning/sentence-transformers/tutorials/paraphrase-mining/paraphrase-mining-sentence-transformers-ipynb',
                      label: 'Paraphrase Mining',
                    },
                  ],
                },
              ],
              link: {
                type: 'doc',
                id: 'deep-learning/sentence-transformers/index',
              },
            },
            {
              type: 'doc',
              id: 'deep-learning/spacy/index',
              label: 'spaCy',
            },
          ],
          link: {
            type: 'doc',
            id: 'deep-learning/index',
          },
        },
      ],
    },
    {
      type: 'category',
      label: 'Build ',
      className: 'sidebar-top-level-category',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'MLflow Tracking',
          items: [
            {
              type: 'doc',
              id: 'tracking/quickstart/index',
            },
            {
              type: 'doc',
              id: 'tracking/autolog/index',
              label: 'Auto Logging',
            },
            {
              type: 'link',
              label: 'Tracking Server',
              href: '/self-hosting/architecture/tracking-server/',
            },
            {
              type: 'category',
              label: 'Search',
              items: [
                {
                  type: 'doc',
                  id: 'search/search-models/index',
                },
                {
                  type: 'doc',
                  id: 'search/search-runs/index',
                },
                {
                  type: 'doc',
                  id: 'search/search-experiments/index',
                },
              ],
            },
            {
              type: 'doc',
              id: 'tracking/system-metrics/index',
              label: 'System Metrics',
            },
            {
              type: 'doc',
              id: 'tracking/tracking-api/index',
              label: 'Tracking APIs',
            },
          ],
          link: {
            type: 'doc',
            id: 'tracking/index',
          },
        },
        {
          type: 'category',
          label: 'MLflow Model',
          items: [
            {
              type: 'autogenerated',
              dirName: 'model',
            },
            {
              type: 'doc',
              id: 'community-model-flavors/index',
              label: 'Community-Managed Model Integrations',
            },
          ],
        },
        {
          type: 'doc',
          id: 'dataset/index',
          label: 'MLflow Datasets',
        },
      ],
    },
    {
      type: 'doc',
      id: 'evaluation/index',
      label: 'Evaluate',
      className: 'sidebar-top-level-category',
    },
    {
      type: 'category',
      label: 'Deploy',
      className: 'sidebar-top-level-category',
      items: [
        {
          type: 'category',
          label: 'MLflow Model Registry',
          items: [
            {
              type: 'autogenerated',
              dirName: 'model-registry',
            },
          ],
          link: {
            type: 'doc',
            id: 'model-registry/index',
          },
        },
        {
          type: 'category',
          label: 'MLflow Serving',
          items: [
            {
              type: 'doc',
              id: 'deployment/deploy-model-locally/index',
            },
            {
              type: 'category',
              label: 'Deploy MLflow Model to Kubernetes',
              items: [
                {
                  type: 'doc',
                  id: 'deployment/deploy-model-to-kubernetes/tutorial',
                },
              ],
              link: {
                type: 'doc',
                id: 'deployment/deploy-model-to-kubernetes/index',
              },
            },
            {
              type: 'doc',
              id: 'deployment/deploy-model-to-sagemaker/index',
            },
          ],
          link: {
            type: 'doc',
            id: 'deployment/index',
          },
        },
        {
          type: 'doc',
          id: 'docker/index',
          label: 'Docker',
        },
      ],
    },
    {
      type: 'doc',
      id: 'webhooks/index',
      label: 'Webhooks',
    },
    {
      type: 'category',
      label: 'Team Collaboration',
      className: 'sidebar-top-level-category',
      collapsed: true,
      items: [
        {
          type: 'link',
          href: '/self-hosting',
          label: 'Self-Hosting',
        },
        {
          type: 'link',
          href: '/ml/#running-mlflow-anywhere',
          label: 'Managed Services',
        },
        {
          type: 'link',
          href: '/self-hosting/security/basic-http-auth',
          label: 'Access Control',
        },
        {
          type: 'doc',
          id: 'projects/index',
          label: 'MLflow Projects',
        },
      ],
    },
    {
      type: 'category',
      label: 'API References',
      className: 'sidebar-top-level-category',
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'Python API',
          href: `${apiReferencePrefix()}api_reference/python_api/index.html`,
        },
        {
          type: 'link',
          label: 'Java API',
          href: `${apiReferencePrefix()}api_reference/java_api/index.html`,
        },
        {
          type: 'link',
          label: 'R API',
          href: `${apiReferencePrefix()}api_reference/R-api.html`,
        },
        {
          type: 'link',
          label: 'REST API',
          href: `${apiReferencePrefix()}api_reference/rest-api.html`,
        },
        {
          type: 'link',
          label: 'CLI',
          href: `${apiReferencePrefix()}api_reference/cli.html`,
        },
      ],
    },
    {
      type: 'doc',
      id: 'mlflow-3/index',
      label: 'MLflow 3.0 Migration',
      className: 'sidebar-top-level-category',
    },
    {
      type: 'category',
      label: 'More',
      collapsed: true,
      className: 'sidebar-top-level-category',
      items: [
        {
          type: 'link',
          label: 'Contributing',
          href: 'https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md',
        },
        {
          type: 'link',
          label: 'MLflow Blogs',
          href: 'https://mlflow.org/blog/index.html',
        },
        {
          type: 'doc',
          id: 'plugins/index',
          label: 'MLflow Plugins',
        },
        {
          type: 'doc',
          id: 'tutorials-and-examples/index',
          label: 'External Tutorials',
        },
      ],
    },
  ],
};

export default sidebarsClassicML;
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 220
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 220 of 991)

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

---[FILE: tsconfig.json]---
Location: mlflow-master/libs/typescript/integrations/openai/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"],
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .nojekyll]---
Location: mlflow-master/libs/typescript/integrations/openai/docs/.nojekyll

```text
TypeDoc added this file to prevent GitHub Pages from using Jekyll. You can turn off this behavior by setting the `githubPages` option to false.
```

--------------------------------------------------------------------------------

---[FILE: hierarchy.html]---
Location: mlflow-master/libs/typescript/integrations/openai/docs/hierarchy.html

```text
<!doctype html>
<html class="default" lang="en" data-base="./">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <title>mlflow-openai</title>
    <meta name="description" content="Documentation for mlflow-openai" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="assets/style.css" />
    <link rel="stylesheet" href="assets/highlight.css" />
    <script defer src="assets/main.js"></script>
    <script async src="assets/icons.js" id="tsd-icons-script"></script>
    <script async src="assets/search.js" id="tsd-search-script"></script>
    <script async src="assets/navigation.js" id="tsd-nav-script"></script>
  </head>
  <body>
    <script>
      document.documentElement.dataset.theme = localStorage.getItem('tsd-theme') || 'os';
      document.body.style.display = 'none';
      setTimeout(
        () => (window.app ? app.showPage() : document.body.style.removeProperty('display')),
        500
      );
    </script>
    <header class="tsd-page-toolbar">
      <div class="tsd-toolbar-contents container">
        <a href="index.html" class="title">mlflow-openai</a>
        <div id="tsd-toolbar-links"></div>
        <button id="tsd-search-trigger" class="tsd-widget" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <use href="assets/icons.svg#icon-search"></use>
          </svg>
        </button>
        <dialog id="tsd-search" aria-label="Search">
          <input
            role="combobox"
            id="tsd-search-input"
            aria-controls="tsd-search-results"
            aria-autocomplete="list"
            aria-expanded="true"
            autocapitalize="off"
            autocomplete="off"
            placeholder="Search the docs"
            maxlength="100"
          />
          <ul role="listbox" id="tsd-search-results"></ul>
          <div id="tsd-search-status" aria-live="polite" aria-atomic="true">
            <div>Preparing search index...</div>
          </div>
        </dialog>
        <a
          href="#"
          class="tsd-widget menu"
          id="tsd-toolbar-menu-trigger"
          data-toggle="menu"
          aria-label="Menu"
          ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <use href="assets/icons.svg#icon-menu"></use></svg
        ></a>
      </div>
    </header>
    <div class="container container-main">
      <div class="col-content">
        <div class="tsd-page-title"><h1>mlflow-openai</h1></div>
        <h2>Hierarchy Summary</h2>
      </div>
      <div class="col-sidebar">
        <div class="page-menu">
          <div class="tsd-navigation settings">
            <details class="tsd-accordion">
              <summary class="tsd-accordion-summary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <use href="assets/icons.svg#icon-chevronDown"></use>
                </svg>
                <h3>Settings</h3>
              </summary>
              <div class="tsd-accordion-details">
                <div class="tsd-filter-visibility">
                  <span class="settings-label">Member Visibility</span>
                  <ul id="tsd-filter-options">
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input type="checkbox" id="tsd-filter-protected" name="protected" /><svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>Protected</span></label
                      >
                    </li>
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input
                          type="checkbox"
                          id="tsd-filter-inherited"
                          name="inherited"
                          checked
                        /><svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>Inherited</span></label
                      >
                    </li>
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input type="checkbox" id="tsd-filter-external" name="external" /><svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>External</span></label
                      >
                    </li>
                  </ul>
                </div>
                <div class="tsd-theme-toggle">
                  <label class="settings-label" for="tsd-theme">Theme</label
                  ><select id="tsd-theme">
                    <option value="os">OS</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </details>
          </div>
        </div>
        <div class="site-menu">
          <nav class="tsd-navigation">
            <a href="modules.html">mlflow-openai</a>
            <ul class="tsd-small-nested-navigation" id="tsd-nav-container">
              <li>Loading...</li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <footer>
      <p class="tsd-generator">
        Generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>
      </p>
    </footer>
    <div class="overlay"></div>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: mlflow-master/libs/typescript/integrations/openai/docs/index.html

```text
<!doctype html>
<html class="default" lang="en" data-base="./">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <title>mlflow-openai</title>
    <meta name="description" content="Documentation for mlflow-openai" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="assets/style.css" />
    <link rel="stylesheet" href="assets/highlight.css" />
    <script defer src="assets/main.js"></script>
    <script async src="assets/icons.js" id="tsd-icons-script"></script>
    <script async src="assets/search.js" id="tsd-search-script"></script>
    <script async src="assets/navigation.js" id="tsd-nav-script"></script>
  </head>
  <body>
    <script>
      document.documentElement.dataset.theme = localStorage.getItem('tsd-theme') || 'os';
      document.body.style.display = 'none';
      setTimeout(
        () => (window.app ? app.showPage() : document.body.style.removeProperty('display')),
        500
      );
    </script>
    <header class="tsd-page-toolbar">
      <div class="tsd-toolbar-contents container">
        <a href="index.html" class="title">mlflow-openai</a>
        <div id="tsd-toolbar-links"></div>
        <button id="tsd-search-trigger" class="tsd-widget" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <use href="assets/icons.svg#icon-search"></use>
          </svg>
        </button>
        <dialog id="tsd-search" aria-label="Search">
          <input
            role="combobox"
            id="tsd-search-input"
            aria-controls="tsd-search-results"
            aria-autocomplete="list"
            aria-expanded="true"
            autocapitalize="off"
            autocomplete="off"
            placeholder="Search the docs"
            maxlength="100"
          />
          <ul role="listbox" id="tsd-search-results"></ul>
          <div id="tsd-search-status" aria-live="polite" aria-atomic="true">
            <div>Preparing search index...</div>
          </div>
        </dialog>
        <a
          href="#"
          class="tsd-widget menu"
          id="tsd-toolbar-menu-trigger"
          data-toggle="menu"
          aria-label="Menu"
          ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <use href="assets/icons.svg#icon-menu"></use></svg
        ></a>
      </div>
    </header>
    <div class="container container-main">
      <div class="col-content">
        <div class="tsd-page-title"><h1>mlflow-openai</h1></div>
        <div class="tsd-panel tsd-typography">
          <h1 id="mlflow-typescript-sdk---openai" class="tsd-anchor-link">
            MLflow Typescript SDK - OpenAI<a
              href="#mlflow-typescript-sdk---openai"
              aria-label="Permalink"
              class="tsd-anchor-icon"
              ><svg viewBox="0 0 24 24" aria-hidden="true">
                <use href="assets/icons.svg#icon-anchor"></use></svg
            ></a>
          </h1>
          <p>
            Seamlessly integrate
            <a href="https://github.com/mlflow/mlflow/tree/main/libs/typescript">MLflow Tracing</a>
            with OpenAI to automatically trace your OpenAI API calls.
          </p>
          <table>
            <thead>
              <tr>
                <th>Package</th>
                <th>NPM</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><a href="./libs/typescript/integrations/openai">mlflow-openai</a></td>
                <td>
                  <a href="https://www.npmjs.com/package/mlflow-tracing-openai"
                    ><img
                      src="https://img.shields.io/npm/v/mlflow-tracing-openai?style=flat-square"
                      alt="npm package"
                  /></a>
                </td>
                <td>Auto-instrumentation integration for OpenAI.</td>
              </tr>
            </tbody>
          </table>
          <h2 id="installation" class="tsd-anchor-link">
            Installation<a href="#installation" aria-label="Permalink" class="tsd-anchor-icon"
              ><svg viewBox="0 0 24 24" aria-hidden="true">
                <use href="assets/icons.svg#icon-anchor"></use></svg
            ></a>
          </h2>
          <pre><code class="bash"><span class="hl-0">npm</span><span class="hl-1"> </span><span class="hl-2">install</span><span class="hl-1"> </span><span class="hl-2">mlflow-openai</span>
</code><button type="button">Copy</button></pre>

          <p>
            The package includes the
            <a href="https://github.com/mlflow/mlflow/tree/main/libs/typescript"
              ><code>mlflow-tracing</code></a
            >
            package and <code>openai</code> package as peer dependencies. Depending on your package
            manager, you may need to install these two packages separately.
          </p>
          <h2 id="quickstart" class="tsd-anchor-link">
            Quickstart<a href="#quickstart" aria-label="Permalink" class="tsd-anchor-icon"
              ><svg viewBox="0 0 24 24" aria-hidden="true">
                <use href="assets/icons.svg#icon-anchor"></use></svg
            ></a>
          </h2>
          <p>Start MLflow Tracking Server if you don't have one already:</p>
          <pre><code class="bash"><span class="hl-0">pip</span><span class="hl-1"> </span><span class="hl-2">install</span><span class="hl-1"> </span><span class="hl-2">mlflow</span><br/><span class="hl-0">mlflow</span><span class="hl-1"> </span><span class="hl-2">server</span><span class="hl-1"> </span><span class="hl-3">--backend-store-uri</span><span class="hl-1"> </span><span class="hl-2">sqlite:///mlruns.db</span><span class="hl-1"> </span><span class="hl-3">--port</span><span class="hl-1"> </span><span class="hl-4">5000</span>
</code><button type="button">Copy</button></pre>

          <p>
            Self-hosting MLflow server requires Python 3.10 or higher. If you don't have one, you
            can also use <a href="https://mlflow.org/#get-started">managed MLflow service</a> for
            free to get started quickly.
          </p>
          <p>Instantiate MLflow SDK in your application:</p>
          <pre><code class="typescript"><span class="hl-5">import</span><span class="hl-1"> </span><span class="hl-3">*</span><span class="hl-1"> </span><span class="hl-5">as</span><span class="hl-1"> </span><span class="hl-6">mlflow</span><span class="hl-1"> </span><span class="hl-5">from</span><span class="hl-1"> </span><span class="hl-2">&#39;mlflow-tracing&#39;</span><span class="hl-1">;</span><br/><br/><span class="hl-6">mlflow</span><span class="hl-1">.</span><span class="hl-0">init</span><span class="hl-1">({</span><br/><span class="hl-1">  </span><span class="hl-6">trackingUri:</span><span class="hl-1"> </span><span class="hl-2">&#39;http://localhost:5000&#39;</span><span class="hl-1">,</span><br/><span class="hl-1">  </span><span class="hl-6">experimentId:</span><span class="hl-1"> </span><span class="hl-2">&#39;&lt;experiment-id&gt;&#39;</span><br/><span class="hl-1">});</span>
</code><button type="button">Copy</button></pre>

          <p>Create a trace:</p>
          <pre><code class="typescript"><span class="hl-5">import</span><span class="hl-1"> { </span><span class="hl-6">OpenAI</span><span class="hl-1"> } </span><span class="hl-5">from</span><span class="hl-1"> </span><span class="hl-2">&#39;openai&#39;</span><span class="hl-1">;</span><br/><span class="hl-5">import</span><span class="hl-1"> { </span><span class="hl-6">tracedOpenAI</span><span class="hl-1"> } </span><span class="hl-5">from</span><span class="hl-1"> </span><span class="hl-2">&#39;mlflow-openai&#39;</span><span class="hl-1">;</span><br/><br/><span class="hl-7">// Wrap the OpenAI client with the tracedOpenAI function</span><br/><span class="hl-3">const</span><span class="hl-1"> </span><span class="hl-8">client</span><span class="hl-1"> = </span><span class="hl-0">tracedOpenAI</span><span class="hl-1">(</span><span class="hl-3">new</span><span class="hl-1"> </span><span class="hl-0">OpenAI</span><span class="hl-1">());</span><br/><br/><span class="hl-7">// Invoke the client as usual</span><br/><span class="hl-3">const</span><span class="hl-1"> </span><span class="hl-8">response</span><span class="hl-1"> = </span><span class="hl-5">await</span><span class="hl-1"> </span><span class="hl-6">client</span><span class="hl-1">.</span><span class="hl-6">chat</span><span class="hl-1">.</span><span class="hl-6">completions</span><span class="hl-1">.</span><span class="hl-0">create</span><span class="hl-1">({</span><br/><span class="hl-1">  </span><span class="hl-6">model:</span><span class="hl-1"> </span><span class="hl-2">&#39;o4-mini&#39;</span><span class="hl-1">,</span><br/><span class="hl-1">  </span><span class="hl-6">messages:</span><span class="hl-1"> [</span><br/><span class="hl-1">    { </span><span class="hl-6">role:</span><span class="hl-1"> </span><span class="hl-2">&#39;system&#39;</span><span class="hl-1">, </span><span class="hl-6">content:</span><span class="hl-1"> </span><span class="hl-2">&#39;You are a helpful weather assistant.&#39;</span><span class="hl-1"> },</span><br/><span class="hl-1">    { </span><span class="hl-6">role:</span><span class="hl-1"> </span><span class="hl-2">&#39;user&#39;</span><span class="hl-1">, </span><span class="hl-6">content:</span><span class="hl-1"> </span><span class="hl-2">&quot;What&#39;s the weather like in Seattle?&quot;</span><span class="hl-1"> }</span><br/><span class="hl-1">  ]</span><br/><span class="hl-1">});</span>
</code><button type="button">Copy</button></pre>

          <p>View traces in MLflow UI:</p>
          <p>
            <img
              src="https://github.com/mlflow/mlflow/blob/891fed9a746477f808dd2b82d3abb2382293c564/docs/static/images/llms/tracing/quickstart/single-openai-trace-detail.png?raw=true"
              alt="MLflow Tracing UI"
            />
          </p>
          <h2 id="documentation-📘" class="tsd-anchor-link">
            Documentation 📘<a
              href="#documentation-📘"
              aria-label="Permalink"
              class="tsd-anchor-icon"
              ><svg viewBox="0 0 24 24" aria-hidden="true">
                <use href="assets/icons.svg#icon-anchor"></use></svg
            ></a>
          </h2>
          <p>
            Official documentation for MLflow Typescript SDK can be found
            <a href="https://mlflow.org/docs/latest/genai/tracing/quickstart">here</a>.
          </p>
          <h2 id="license" class="tsd-anchor-link">
            License<a href="#license" aria-label="Permalink" class="tsd-anchor-icon"
              ><svg viewBox="0 0 24 24" aria-hidden="true">
                <use href="assets/icons.svg#icon-anchor"></use></svg
            ></a>
          </h2>
          <p>
            This project is licensed under the
            <a href="https://github.com/mlflow/mlflow/blob/master/LICENSE.txt">Apache License 2.0</a
            >.
          </p>
        </div>
      </div>
      <div class="col-sidebar">
        <div class="page-menu">
          <div class="tsd-navigation settings">
            <details class="tsd-accordion">
              <summary class="tsd-accordion-summary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <use href="assets/icons.svg#icon-chevronDown"></use>
                </svg>
                <h3>Settings</h3>
              </summary>
              <div class="tsd-accordion-details">
                <div class="tsd-filter-visibility">
                  <span class="settings-label">Member Visibility</span>
                  <ul id="tsd-filter-options">
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input type="checkbox" id="tsd-filter-protected" name="protected" /><svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>Protected</span></label
                      >
                    </li>
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input
                          type="checkbox"
                          id="tsd-filter-inherited"
                          name="inherited"
                          checked
                        /><svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>Inherited</span></label
                      >
                    </li>
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input type="checkbox" id="tsd-filter-external" name="external" /><svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>External</span></label
                      >
                    </li>
                  </ul>
                </div>
                <div class="tsd-theme-toggle">
                  <label class="settings-label" for="tsd-theme">Theme</label
                  ><select id="tsd-theme">
                    <option value="os">OS</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </details>
          </div>
          <details open class="tsd-accordion tsd-page-navigation">
            <summary class="tsd-accordion-summary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <use href="assets/icons.svg#icon-chevronDown"></use>
              </svg>
              <h3>On This Page</h3>
            </summary>
            <div class="tsd-accordion-details">
              <a href="#mlflow-typescript-sdk---openai"
                ><span
                  >M<wbr />Lflow <wbr />Typescript <wbr />SDK -<wbr /> <wbr />Open<wbr />AI</span
                ></a
              >
              <ul>
                <li>
                  <a href="#installation"><span>Installation</span></a>
                </li>
                <li>
                  <a href="#quickstart"><span>Quickstart</span></a>
                </li>
                <li>
                  <a href="#documentation-📘"><span>Documentation 📘</span></a>
                </li>
                <li>
                  <a href="#license"><span>License</span></a>
                </li>
              </ul>
            </div>
          </details>
        </div>
        <div class="site-menu">
          <nav class="tsd-navigation">
            <a href="modules.html">mlflow-openai</a>
            <ul class="tsd-small-nested-navigation" id="tsd-nav-container">
              <li>Loading...</li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <footer>
      <p class="tsd-generator">
        Generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>
      </p>
    </footer>
    <div class="overlay"></div>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: modules.html]---
Location: mlflow-master/libs/typescript/integrations/openai/docs/modules.html

```text
<!doctype html>
<html class="default" lang="en" data-base="./">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <title>mlflow-openai</title>
    <meta name="description" content="Documentation for mlflow-openai" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="assets/style.css" />
    <link rel="stylesheet" href="assets/highlight.css" />
    <script defer src="assets/main.js"></script>
    <script async src="assets/icons.js" id="tsd-icons-script"></script>
    <script async src="assets/search.js" id="tsd-search-script"></script>
    <script async src="assets/navigation.js" id="tsd-nav-script"></script>
  </head>
  <body>
    <script>
      document.documentElement.dataset.theme = localStorage.getItem('tsd-theme') || 'os';
      document.body.style.display = 'none';
      setTimeout(
        () => (window.app ? app.showPage() : document.body.style.removeProperty('display')),
        500
      );
    </script>
    <header class="tsd-page-toolbar">
      <div class="tsd-toolbar-contents container">
        <a href="index.html" class="title">mlflow-openai</a>
        <div id="tsd-toolbar-links"></div>
        <button id="tsd-search-trigger" class="tsd-widget" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <use href="assets/icons.svg#icon-search"></use>
          </svg>
        </button>
        <dialog id="tsd-search" aria-label="Search">
          <input
            role="combobox"
            id="tsd-search-input"
            aria-controls="tsd-search-results"
            aria-autocomplete="list"
            aria-expanded="true"
            autocapitalize="off"
            autocomplete="off"
            placeholder="Search the docs"
            maxlength="100"
          />
          <ul role="listbox" id="tsd-search-results"></ul>
          <div id="tsd-search-status" aria-live="polite" aria-atomic="true">
            <div>Preparing search index...</div>
          </div>
        </dialog>
        <a
          href="#"
          class="tsd-widget menu"
          id="tsd-toolbar-menu-trigger"
          data-toggle="menu"
          aria-label="Menu"
          ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <use href="assets/icons.svg#icon-menu"></use></svg
        ></a>
      </div>
    </header>
    <div class="container container-main">
      <div class="col-content">
        <div class="tsd-page-title">
          <ul class="tsd-breadcrumb" aria-label="Breadcrumb"></ul>
          <h1>mlflow-openai</h1>
        </div>
        <details class="tsd-panel-group tsd-member-group tsd-accordion" open>
          <summary class="tsd-accordion-summary" data-key="section-Functions">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <use href="assets/icons.svg#icon-chevronDown"></use>
            </svg>
            <h2>Functions</h2>
          </summary>
          <dl class="tsd-member-summaries">
            <dt class="tsd-member-summary" id="tracedopenai">
              <span class="tsd-member-summary-name"
                ><svg class="tsd-kind-icon" viewBox="0 0 24 24" aria-label="Function">
                  <use href="assets/icons.svg#icon-64"></use></svg
                ><a href="functions/tracedOpenAI.html">tracedOpenAI</a
                ><a href="#tracedopenai" aria-label="Permalink" class="tsd-anchor-icon"
                  ><svg viewBox="0 0 24 24" aria-hidden="true">
                    <use href="assets/icons.svg#icon-anchor"></use></svg></a
              ></span>
            </dt>
            <dd class="tsd-member-summary"></dd>
          </dl>
        </details>
      </div>
      <div class="col-sidebar">
        <div class="page-menu">
          <div class="tsd-navigation settings">
            <details class="tsd-accordion">
              <summary class="tsd-accordion-summary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <use href="assets/icons.svg#icon-chevronDown"></use>
                </svg>
                <h3>Settings</h3>
              </summary>
              <div class="tsd-accordion-details">
                <div class="tsd-filter-visibility">
                  <span class="settings-label">Member Visibility</span>
                  <ul id="tsd-filter-options">
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input type="checkbox" id="tsd-filter-protected" name="protected" /><svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>Protected</span></label
                      >
                    </li>
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input
                          type="checkbox"
                          id="tsd-filter-inherited"
                          name="inherited"
                          checked
                        /><svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>Inherited</span></label
                      >
                    </li>
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input type="checkbox" id="tsd-filter-external" name="external" /><svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>External</span></label
                      >
                    </li>
                  </ul>
                </div>
                <div class="tsd-theme-toggle">
                  <label class="settings-label" for="tsd-theme">Theme</label
                  ><select id="tsd-theme">
                    <option value="os">OS</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </details>
          </div>
          <details open class="tsd-accordion tsd-page-navigation">
            <summary class="tsd-accordion-summary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <use href="assets/icons.svg#icon-chevronDown"></use>
              </svg>
              <h3>On This Page</h3>
            </summary>
            <div class="tsd-accordion-details">
              <details open class="tsd-accordion tsd-page-navigation-section">
                <summary class="tsd-accordion-summary" data-key="section-Functions">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <use href="assets/icons.svg#icon-chevronDown"></use></svg
                  >Functions
                </summary>
                <div>
                  <a href="#tracedopenai"
                    ><svg class="tsd-kind-icon" viewBox="0 0 24 24" aria-label="Function">
                      <use href="assets/icons.svg#icon-64"></use></svg
                    ><span>traced<wbr />Open<wbr />AI</span></a
                  >
                </div>
              </details>
            </div>
          </details>
        </div>
        <div class="site-menu">
          <nav class="tsd-navigation">
            <a href="modules.html" class="current">mlflow-openai</a>
            <ul class="tsd-small-nested-navigation" id="tsd-nav-container">
              <li>Loading...</li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <footer>
      <p class="tsd-generator">
        Generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>
      </p>
    </footer>
    <div class="overlay"></div>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: hierarchy.js]---
Location: mlflow-master/libs/typescript/integrations/openai/docs/assets/hierarchy.js

```javascript
window.hierarchyData = 'eJyrVirKzy8pVrKKjtVRKkpNy0lNLsnMzytWsqqurQUAmx4Kpg==';
```

--------------------------------------------------------------------------------

---[FILE: highlight.css]---
Location: mlflow-master/libs/typescript/integrations/openai/docs/assets/highlight.css

```text
:root {
  --light-hl-0: #795e26;
  --dark-hl-0: #dcdcaa;
  --light-hl-1: #000000;
  --dark-hl-1: #d4d4d4;
  --light-hl-2: #a31515;
  --dark-hl-2: #ce9178;
  --light-hl-3: #0000ff;
  --dark-hl-3: #569cd6;
  --light-hl-4: #098658;
  --dark-hl-4: #b5cea8;
  --light-hl-5: #af00db;
  --dark-hl-5: #c586c0;
  --light-hl-6: #001080;
  --dark-hl-6: #9cdcfe;
  --light-hl-7: #008000;
  --dark-hl-7: #6a9955;
  --light-hl-8: #0070c1;
  --dark-hl-8: #4fc1ff;
  --light-code-background: #ffffff;
  --dark-code-background: #1e1e1e;
}

@media (prefers-color-scheme: light) {
  :root {
    --hl-0: var(--light-hl-0);
    --hl-1: var(--light-hl-1);
    --hl-2: var(--light-hl-2);
    --hl-3: var(--light-hl-3);
    --hl-4: var(--light-hl-4);
    --hl-5: var(--light-hl-5);
    --hl-6: var(--light-hl-6);
    --hl-7: var(--light-hl-7);
    --hl-8: var(--light-hl-8);
    --code-background: var(--light-code-background);
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --hl-0: var(--dark-hl-0);
    --hl-1: var(--dark-hl-1);
    --hl-2: var(--dark-hl-2);
    --hl-3: var(--dark-hl-3);
    --hl-4: var(--dark-hl-4);
    --hl-5: var(--dark-hl-5);
    --hl-6: var(--dark-hl-6);
    --hl-7: var(--dark-hl-7);
    --hl-8: var(--dark-hl-8);
    --code-background: var(--dark-code-background);
  }
}

:root[data-theme='light'] {
  --hl-0: var(--light-hl-0);
  --hl-1: var(--light-hl-1);
  --hl-2: var(--light-hl-2);
  --hl-3: var(--light-hl-3);
  --hl-4: var(--light-hl-4);
  --hl-5: var(--light-hl-5);
  --hl-6: var(--light-hl-6);
  --hl-7: var(--light-hl-7);
  --hl-8: var(--light-hl-8);
  --code-background: var(--light-code-background);
}

:root[data-theme='dark'] {
  --hl-0: var(--dark-hl-0);
  --hl-1: var(--dark-hl-1);
  --hl-2: var(--dark-hl-2);
  --hl-3: var(--dark-hl-3);
  --hl-4: var(--dark-hl-4);
  --hl-5: var(--dark-hl-5);
  --hl-6: var(--dark-hl-6);
  --hl-7: var(--dark-hl-7);
  --hl-8: var(--dark-hl-8);
  --code-background: var(--dark-code-background);
}

.hl-0 {
  color: var(--hl-0);
}
.hl-1 {
  color: var(--hl-1);
}
.hl-2 {
  color: var(--hl-2);
}
.hl-3 {
  color: var(--hl-3);
}
.hl-4 {
  color: var(--hl-4);
}
.hl-5 {
  color: var(--hl-5);
}
.hl-6 {
  color: var(--hl-6);
}
.hl-7 {
  color: var(--hl-7);
}
.hl-8 {
  color: var(--hl-8);
}
pre,
code {
  background: var(--code-background);
}
```

--------------------------------------------------------------------------------

````

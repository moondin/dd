---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 37
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 37 of 991)

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

---[FILE: broken_links.py]---
Location: mlflow-master/docs/api_reference/broken_links.py

```python
import contextlib
import socket
import subprocess
import sys
import time

import requests
from scrapy.crawler import CrawlerProcess
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule


def get_safe_port():
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        sock.bind(("localhost", 0))
        return sock.getsockname()[1]


@contextlib.contextmanager
def server(port):
    with subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--directory", "build/html"],
        stderr=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
    ) as prc:
        try:
            for _ in range(5):
                try:
                    if requests.get(f"http://localhost:{port}").ok:
                        break
                except requests.exceptions.ConnectionError:
                    time.sleep(0.5)
            else:
                raise RuntimeError("Server did not start")

            yield
        finally:
            prc.terminate()


def main():
    port = get_safe_port()

    class Crawler(CrawlSpider):
        name = "broken-links"
        allowed_domains = ["localhost"]
        start_urls = [f"http://localhost:{port}/"]
        handle_httpstatus_list = [404]
        rules = (Rule(LinkExtractor(), callback="parse_item", follow=True),)
        links = set()

        def parse_item(self, response):
            if response.status == 404:
                self.links.add(
                    (
                        response.url,
                        response.request.headers.get("Referer", None).decode("utf-8"),
                    )
                )

    with server(port):
        process = CrawlerProcess(settings={"LOG_LEVEL": "ERROR"})
        process.crawl(Crawler)
        process.start()

    if Crawler.links:
        print("Broken links found:")
        for link, referer in Crawler.links:
            print(f"{link} in {referer}")
        sys.exit(1)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: build-javadoc.sh]---
Location: mlflow-master/docs/api_reference/build-javadoc.sh

```bash
#!/usr/bin/env bash

# Builds the MLflow Javadoc and places it into build/html/java_api/

set -ex
pushd ../../mlflow/java/client/
# the MAVEN_JAVADOC_ARGS env var is used to dynamically pass
# args to the mvn command. this can be used to direct maven to use
# a mirror, in case we encounter rate limiting from maven central
mvn clean javadoc:javadoc ${MAVEN_JAVADOC_ARGS} -q
popd
rm -rf build/html/java_api/
mkdir -p build/html/java_api/
cp -r ../../mlflow/java/client/target/site/apidocs/* build/html/java_api/
echo "Copied JavaDoc into docs/build/html/java_api/"
```

--------------------------------------------------------------------------------

---[FILE: build-rdoc.sh]---
Location: mlflow-master/docs/api_reference/build-rdoc.sh

```bash
#!/usr/bin/env bash

set -ex

pushd ../../mlflow/R/mlflow

image_name="mlflow-r-dev"

# Workaround for this issue:
# https://discuss.circleci.com/t/increased-rate-of-errors-when-pulling-docker-images-on-machine-executor/42094
n=0
until [ "$n" -ge 3 ]
do
  docker build -f Dockerfile.dev -t $image_name . --platform linux/amd64 && break
  n=$((n+1))
  sleep 5
done

docker run \
  --rm \
  -v $(pwd):/mlflow/mlflow/R/mlflow \
  -v $(pwd)/../../../docs/api_reference/source:/mlflow/docs/api_reference/source \
  $image_name \
  Rscript -e 'source(".build-doc.R", echo = TRUE)'

popd
```

--------------------------------------------------------------------------------

---[FILE: build-tsdoc.sh]---
Location: mlflow-master/docs/api_reference/build-tsdoc.sh

```bash
#!/usr/bin/env bash

set -ex

# Function to build TypeDoc for a package
build_tsdoc() {
    local package_path=$1
    local package_name=$2
    local output_path=$3

    echo "Building TypeDoc for $package_name..."

    # Store the absolute path to the analytics file before changing directories
    local analytics_js_path="$(cd "$(dirname "$0")" && pwd)/typedoc-analytics.js"

    pushd "$package_path"

    # Skip npm install since we're using yarn workspaces
    # Dependencies should be installed at the workspace root

    # Generate TypeDoc documentation
    npx typedoc \
        --out "$output_path" \
        --name "$package_name" \
        --readme README.md \
        --tsconfig tsconfig.json \
        --excludePrivate \
        --excludeProtected \
        --excludeExternals \
        --includeVersion \
        --searchInComments \
        --navigation \
        --excludeNotDocumented false \
        --customJs "$analytics_js_path" \
        src/index.ts

    popd
}

# Base paths
TYPESCRIPT_BASE="../../libs/typescript"
DOCS_OUTPUT_BASE="build/html/typescript_api"

# First ensure dependencies are installed at workspace root
echo "Ensuring TypeScript workspace dependencies are installed..."
pushd "$TYPESCRIPT_BASE"
npm install
popd

# Remove existing docs if they exist
rm -rf "$DOCS_OUTPUT_BASE"
# Create output directory
mkdir -p "$DOCS_OUTPUT_BASE"

# Build documentation for mlflow-tracing
build_tsdoc \
    "$TYPESCRIPT_BASE/core" \
    "mlflow-tracing" \
    "$(pwd)/$DOCS_OUTPUT_BASE/mlflow-tracing"

# Build documentation for mlflow-openai
build_tsdoc \
    "$TYPESCRIPT_BASE/integrations/openai" \
    "mlflow-openai" \
    "$(pwd)/$DOCS_OUTPUT_BASE/mlflow-openai"

# Copy the HTML template to create index.html
cp "$(dirname "$0")/tsdoc.index.html.template" "$DOCS_OUTPUT_BASE/index.html"

echo "Copied TypeScript documentation into docs/build/html/typescript_api/"
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/docs/api_reference/conftest.py

```python
import os

import pytest

import mlflow


@pytest.fixture(autouse=True)
def tracking_uri_mock(tmp_path, monkeypatch):
    tracking_uri = "sqlite:///{}".format(tmp_path / "mlruns.sqlite")
    mlflow.set_tracking_uri(tracking_uri)
    monkeypatch.setenv("MLFLOW_TRACKING_URI", tracking_uri)
    yield
    mlflow.set_tracking_uri(None)


@pytest.fixture(autouse=True)
def reset_active_experiment_id():
    yield
    mlflow.tracking.fluent._active_experiment_id = None
    os.environ.pop("MLFLOW_EXPERIMENT_ID", None)


@pytest.fixture(autouse=True)
def reset_mlflow_uri():
    yield
    os.environ.pop("MLFLOW_TRACKING_URI", None)
    os.environ.pop("MLFLOW_REGISTRY_URI", None)
```

--------------------------------------------------------------------------------

---[FILE: gateway_api_docs.py]---
Location: mlflow-master/docs/api_reference/gateway_api_docs.py

```python
import json
import tempfile
from pathlib import Path

from mlflow.gateway.app import create_app_from_path

# This HTML was obtained by sending a request to the `/docs` route and saving the response.
# To hide the "try it out" button, we set `supportedSubmitMethods` to an empty list.
# The url was changed to "./openapi.json" from "/openapi.json" because `api.html` and `openapi.json`
# are served from the same directory.
API_HTML = """
<!DOCTYPE html>
<html>
  <head>
    <link
      type="text/css"
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css"
    />
    <link
      rel="shortcut icon"
      href="../_static/favicon.ico"
    />
    <title>MLflow AI Gateway - Swagger UI</title>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <!-- `SwaggerUIBundle` is now available on the page -->
    <script>
      const ui = SwaggerUIBundle({
        supportedSubmitMethods: [],
        url: "./openapi.json",
        dom_id: "#swagger-ui",
        layout: "BaseLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true,
        oauth2RedirectUrl: window.location.origin + "/docs/oauth2-redirect",
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset,
        ],
      });
    </script>
  </body>
</html>
"""


def main():
    config = """
endpoints:
  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-4o-mini
      config:
        openai_api_key: key

  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: openai
      name: gpt-4o-mini
      config:
        openai_api_key: key

  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: openai
      name: text-embedding-ada-002
      config:
        openai_api_key: key
"""
    with tempfile.TemporaryDirectory() as tmpdir:
        config_path = Path(tmpdir).joinpath("config.yaml")
        config_path.write_text(config)

        app = create_app_from_path(config_path)
        docs_build = Path("build/html/llms/deployments")
        docs_build.mkdir(parents=True, exist_ok=True)
        with docs_build.joinpath("openapi.json").open("w") as f:
            json.dump(app.openapi(), f)

        with docs_build.joinpath("api.html").open("w") as f:
            f.write(API_HTML)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: make.bat]---
Location: mlflow-master/docs/api_reference/make.bat

```bat
@ECHO OFF

REM Command file for Sphinx documentation

if "%SPHINXBUILD%" == "" (
	set SPHINXBUILD=sphinx-build
)
set BUILDDIR=build
set ALLSPHINXOPTS=-d %BUILDDIR%/doctrees %SPHINXOPTS% source
set I18NSPHINXOPTS=%SPHINXOPTS% source
if NOT "%PAPER%" == "" (
	set ALLSPHINXOPTS=-D latex_paper_size=%PAPER% %ALLSPHINXOPTS%
	set I18NSPHINXOPTS=-D latex_paper_size=%PAPER% %I18NSPHINXOPTS%
)

if "%1" == "" goto help

if "%1" == "help" (
	:help
	echo.Please use `make ^<target^>` where ^<target^> is one of
	echo.  html       to make standalone HTML files
	echo.  dirhtml    to make HTML files named index.html in directories
	echo.  singlehtml to make a single large HTML file
	echo.  pickle     to make pickle files
	echo.  json       to make JSON files
	echo.  htmlhelp   to make HTML files and a HTML help project
	echo.  qthelp     to make HTML files and a qthelp project
	echo.  devhelp    to make HTML files and a Devhelp project
	echo.  epub       to make an epub
	echo.  epub3      to make an epub3
	echo.  latex      to make LaTeX files, you can set PAPER=a4 or PAPER=letter
	echo.  text       to make text files
	echo.  man        to make manual pages
	echo.  texinfo    to make Texinfo files
	echo.  gettext    to make PO message catalogs
	echo.  changes    to make an overview over all changed/added/deprecated items
	echo.  xml        to make Docutils-native XML files
	echo.  pseudoxml  to make pseudoxml-XML files for display purposes
	echo.  linkcheck  to check all external links for integrity
	echo.  doctest    to run all doctests embedded in the documentation if enabled
	echo.  coverage   to run coverage check of the documentation if enabled
	echo.  dummy      to check syntax errors of document sources
	goto end
)

if "%1" == "clean" (
	for /d %%i in (%BUILDDIR%\*) do rmdir /q /s %%i
	del /q /s %BUILDDIR%\*
	goto end
)


REM Check if sphinx-build is available and fallback to Python version if any
%SPHINXBUILD% 1>NUL 2>NUL
if errorlevel 9009 goto sphinx_python
goto sphinx_ok

:sphinx_python

set SPHINXBUILD=python -m sphinx.__init__
%SPHINXBUILD% 2> nul
if errorlevel 9009 (
	echo.
	echo.The 'sphinx-build' command was not found. Make sure you have Sphinx
	echo.installed, then set the SPHINXBUILD environment variable to point
	echo.to the full path of the 'sphinx-build' executable. Alternatively you
	echo.may add the Sphinx directory to PATH.
	echo.
	echo.If you don't have Sphinx installed, grab it from
	echo.http://sphinx-doc.org/
	exit /b 1
)

:sphinx_ok


if "%1" == "html" (
	%SPHINXBUILD% -b html %ALLSPHINXOPTS% %BUILDDIR%/html
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The HTML pages are in %BUILDDIR%/html.
	goto end
)

if "%1" == "dirhtml" (
	%SPHINXBUILD% -b dirhtml %ALLSPHINXOPTS% %BUILDDIR%/dirhtml
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The HTML pages are in %BUILDDIR%/dirhtml.
	goto end
)

if "%1" == "singlehtml" (
	%SPHINXBUILD% -b singlehtml %ALLSPHINXOPTS% %BUILDDIR%/singlehtml
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The HTML pages are in %BUILDDIR%/singlehtml.
	goto end
)

if "%1" == "pickle" (
	%SPHINXBUILD% -b pickle %ALLSPHINXOPTS% %BUILDDIR%/pickle
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; now you can process the pickle files.
	goto end
)

if "%1" == "json" (
	%SPHINXBUILD% -b json %ALLSPHINXOPTS% %BUILDDIR%/json
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; now you can process the JSON files.
	goto end
)

if "%1" == "htmlhelp" (
	%SPHINXBUILD% -b htmlhelp %ALLSPHINXOPTS% %BUILDDIR%/htmlhelp
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; now you can run HTML Help Workshop with the ^
.hhp project file in %BUILDDIR%/htmlhelp.
	goto end
)

if "%1" == "qthelp" (
	%SPHINXBUILD% -b qthelp %ALLSPHINXOPTS% %BUILDDIR%/qthelp
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; now you can run "qcollectiongenerator" with the ^
.qhcp project file in %BUILDDIR%/qthelp, like this:
	echo.^> qcollectiongenerator %BUILDDIR%\qthelp\twitterpandas.qhcp
	echo.To view the help file:
	echo.^> assistant -collectionFile %BUILDDIR%\qthelp\twitterpandas.ghc
	goto end
)

if "%1" == "devhelp" (
	%SPHINXBUILD% -b devhelp %ALLSPHINXOPTS% %BUILDDIR%/devhelp
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished.
	goto end
)

if "%1" == "epub" (
	%SPHINXBUILD% -b epub %ALLSPHINXOPTS% %BUILDDIR%/epub
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The epub file is in %BUILDDIR%/epub.
	goto end
)

if "%1" == "epub3" (
	%SPHINXBUILD% -b epub3 %ALLSPHINXOPTS% %BUILDDIR%/epub3
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The epub3 file is in %BUILDDIR%/epub3.
	goto end
)

if "%1" == "latex" (
	%SPHINXBUILD% -b latex %ALLSPHINXOPTS% %BUILDDIR%/latex
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; the LaTeX files are in %BUILDDIR%/latex.
	goto end
)

if "%1" == "latexpdf" (
	%SPHINXBUILD% -b latex %ALLSPHINXOPTS% %BUILDDIR%/latex
	cd %BUILDDIR%/latex
	make all-pdf
	cd %~dp0
	echo.
	echo.Build finished; the PDF files are in %BUILDDIR%/latex.
	goto end
)

if "%1" == "latexpdfja" (
	%SPHINXBUILD% -b latex %ALLSPHINXOPTS% %BUILDDIR%/latex
	cd %BUILDDIR%/latex
	make all-pdf-ja
	cd %~dp0
	echo.
	echo.Build finished; the PDF files are in %BUILDDIR%/latex.
	goto end
)

if "%1" == "text" (
	%SPHINXBUILD% -b text %ALLSPHINXOPTS% %BUILDDIR%/text
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The text files are in %BUILDDIR%/text.
	goto end
)

if "%1" == "man" (
	%SPHINXBUILD% -b man %ALLSPHINXOPTS% %BUILDDIR%/man
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The manual pages are in %BUILDDIR%/man.
	goto end
)

if "%1" == "texinfo" (
	%SPHINXBUILD% -b texinfo %ALLSPHINXOPTS% %BUILDDIR%/texinfo
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The Texinfo files are in %BUILDDIR%/texinfo.
	goto end
)

if "%1" == "gettext" (
	%SPHINXBUILD% -b gettext %I18NSPHINXOPTS% %BUILDDIR%/locale
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The message catalogs are in %BUILDDIR%/locale.
	goto end
)

if "%1" == "changes" (
	%SPHINXBUILD% -b changes %ALLSPHINXOPTS% %BUILDDIR%/changes
	if errorlevel 1 exit /b 1
	echo.
	echo.The overview file is in %BUILDDIR%/changes.
	goto end
)

if "%1" == "linkcheck" (
	%SPHINXBUILD% -b linkcheck %ALLSPHINXOPTS% %BUILDDIR%/linkcheck
	if errorlevel 1 exit /b 1
	echo.
	echo.Link check complete; look for any errors in the above output ^
or in %BUILDDIR%/linkcheck/output.txt.
	goto end
)

if "%1" == "doctest" (
	%SPHINXBUILD% -b doctest %ALLSPHINXOPTS% %BUILDDIR%/doctest
	if errorlevel 1 exit /b 1
	echo.
	echo.Testing of doctests in the sources finished, look at the ^
results in %BUILDDIR%/doctest/output.txt.
	goto end
)

if "%1" == "coverage" (
	%SPHINXBUILD% -b coverage %ALLSPHINXOPTS% %BUILDDIR%/coverage
	if errorlevel 1 exit /b 1
	echo.
	echo.Testing of coverage in the sources finished, look at the ^
results in %BUILDDIR%/coverage/python.txt.
	goto end
)

if "%1" == "xml" (
	%SPHINXBUILD% -b xml %ALLSPHINXOPTS% %BUILDDIR%/xml
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The XML files are in %BUILDDIR%/xml.
	goto end
)

if "%1" == "pseudoxml" (
	%SPHINXBUILD% -b pseudoxml %ALLSPHINXOPTS% %BUILDDIR%/pseudoxml
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The pseudo-XML files are in %BUILDDIR%/pseudoxml.
	goto end
)

if "%1" == "dummy" (
	%SPHINXBUILD% -b dummy %ALLSPHINXOPTS% %BUILDDIR%/dummy
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. Dummy builder generates no files.
	goto end
)

:end
```

--------------------------------------------------------------------------------

---[FILE: Makefile]---
Location: mlflow-master/docs/api_reference/Makefile

```text
# Makefile for Sphinx documentation
#

# You can set these variables from the command line.
SPHINXOPTS    = -W --keep-going -n -T
SPHINXBUILD   = sphinx-build
PAPER         =
BUILDDIR      = build

# User-friendly check for sphinx-build
ifeq ($(shell which $(SPHINXBUILD) >/dev/null 2>&1; echo $$?), 1)
    $(error The '$(SPHINXBUILD)' command was not found. Make sure you have Sphinx installed, then set the SPHINXBUILD environment variable to point to the full path of the '$(SPHINXBUILD)' executable. Alternatively you can add the directory with the executable to your PATH. If you don\'t have Sphinx installed, grab it from http://sphinx-doc.org/)
endif

# Internal variables.
PAPEROPT_a4     = -D latex_paper_size=a4
PAPEROPT_letter = -D latex_paper_size=letter
ALLSPHINXOPTS   = -d $(BUILDDIR)/doctrees $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) source
# the i18n builder cannot share the environment and doctrees with the others
I18NSPHINXOPTS  = $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) source

.PHONY: default
default: html

.PHONY: help
help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  html       to make standalone HTML files"
	@echo "  dirhtml    to make HTML files named index.html in directories"
	@echo "  singlehtml to make a single large HTML file"
	@echo "  pickle     to make pickle files"
	@echo "  json       to make JSON files"
	@echo "  htmlhelp   to make HTML files and a HTML help project"
	@echo "  qthelp     to make HTML files and a qthelp project"
	@echo "  applehelp  to make an Apple Help Book"
	@echo "  devhelp    to make HTML files and a Devhelp project"
	@echo "  epub       to make an epub"
	@echo "  epub3      to make an epub3"
	@echo "  latex      to make LaTeX files, you can set PAPER=a4 or PAPER=letter"
	@echo "  latexpdf   to make LaTeX files and run them through pdflatex"
	@echo "  latexpdfja to make LaTeX files and run them through platex/dvipdfmx"
	@echo "  text       to make text files"
	@echo "  man        to make manual pages"
	@echo "  texinfo    to make Texinfo files"
	@echo "  info       to make Texinfo files and run them through makeinfo"
	@echo "  gettext    to make PO message catalogs"
	@echo "  changes    to make an overview of all changed/added/deprecated items"
	@echo "  xml        to make Docutils-native XML files"
	@echo "  pseudoxml  to make pseudoxml-XML files for display purposes"
	@echo "  linkcheck  to check all external links for integrity"
	@echo "  doctest    to run all doctests embedded in the documentation (if enabled)"
	@echo "  coverage   to run coverage check of the documentation (if enabled)"
	@echo "  dummy      to check syntax errors of document sources"

.PHONY: clean
clean:
	rm -rf $(BUILDDIR)/*

.PHONY: javadocs
javadocs:
	./build-javadoc.sh

.PHONY: rdocs
rdocs:
	./build-rdoc.sh

.PHONY: tsdocs
tsdocs:
	./build-tsdoc.sh

.PHONY: test-examples
test-examples:
	@pytest --no-cov .examples

.PHONY: gateway-api-docs
gateway-api-docs:
	@python gateway_api_docs.py

# Builds only the RST-based documentation (i.e., everything but Java & R docs)
.PHONY: rsthtml
rsthtml: gateway-api-docs
	$(SPHINXBUILD) -b html $(ALLSPHINXOPTS) $(BUILDDIR)/html
	@echo
	@echo "Build finished. The HTML pages are in $(BUILDDIR)/html."
	@echo "Use 'make view' to preview docs."

.PHONY: view
view:
	python -m http.server --directory build/html

.PHONY: html
html: rdocs rsthtml javadocs tsdocs

.PHONY: dirhtml
dirhtml:
	$(SPHINXBUILD) -b dirhtml $(ALLSPHINXOPTS) $(BUILDDIR)/dirhtml
	@echo
	@echo "Build finished. The HTML pages are in $(BUILDDIR)/dirhtml."

.PHONY: singlehtml
singlehtml:
	$(SPHINXBUILD) -b singlehtml $(ALLSPHINXOPTS) $(BUILDDIR)/singlehtml
	@echo
	@echo "Build finished. The HTML page is in $(BUILDDIR)/singlehtml."

.PHONY: livehtml
livehtml:
	# Remove `--keep-going` option because `sphinx-autobuild` doesn't support it and raises an error.
	# See: https://github.com/executablebooks/sphinx-autobuild/blob/master/src/sphinx_autobuild/build.py#L7
	sphinx-autobuild -b html $(shell echo $(ALLSPHINXOPTS) | sed -e "s/--keep-going//g") $(BUILDDIR)/html

.PHONY: pickle
pickle:
	$(SPHINXBUILD) -b pickle $(ALLSPHINXOPTS) $(BUILDDIR)/pickle
	@echo
	@echo "Build finished; now you can process the pickle files."

.PHONY: json
json:
	$(SPHINXBUILD) -b json $(ALLSPHINXOPTS) $(BUILDDIR)/json
	@echo
	@echo "Build finished; now you can process the JSON files."

.PHONY: htmlhelp
htmlhelp:
	$(SPHINXBUILD) -b htmlhelp $(ALLSPHINXOPTS) $(BUILDDIR)/htmlhelp
	@echo
	@echo "Build finished; now you can run HTML Help Workshop with the" \
	      ".hhp project file in $(BUILDDIR)/htmlhelp."

.PHONY: qthelp
qthelp:
	$(SPHINXBUILD) -b qthelp $(ALLSPHINXOPTS) $(BUILDDIR)/qthelp
	@echo
	@echo "Build finished; now you can run "qcollectiongenerator" with the" \
	      ".qhcp project file in $(BUILDDIR)/qthelp, like this:"
	@echo "# qcollectiongenerator $(BUILDDIR)/qthelp/twitterpandas.qhcp"
	@echo "To view the help file:"
	@echo "# assistant -collectionFile $(BUILDDIR)/qthelp/twitterpandas.qhc"

.PHONY: applehelp
applehelp:
	$(SPHINXBUILD) -b applehelp $(ALLSPHINXOPTS) $(BUILDDIR)/applehelp
	@echo
	@echo "Build finished. The help book is in $(BUILDDIR)/applehelp."
	@echo "N.B. You won't be able to view it unless you put it in" \
	      "~/Library/Documentation/Help or install it in your application" \
	      "bundle."

.PHONY: devhelp
devhelp:
	$(SPHINXBUILD) -b devhelp $(ALLSPHINXOPTS) $(BUILDDIR)/devhelp
	@echo
	@echo "Build finished."
	@echo "To view the help file:"
	@echo "# mkdir -p $$HOME/.local/share/devhelp/twitterpandas"
	@echo "# ln -s $(BUILDDIR)/devhelp $$HOME/.local/share/devhelp/twitterpandas"
	@echo "# devhelp"

.PHONY: epub
epub:
	$(SPHINXBUILD) -b epub $(ALLSPHINXOPTS) $(BUILDDIR)/epub
	@echo
	@echo "Build finished. The epub file is in $(BUILDDIR)/epub."

.PHONY: epub3
epub3:
	$(SPHINXBUILD) -b epub3 $(ALLSPHINXOPTS) $(BUILDDIR)/epub3
	@echo
	@echo "Build finished. The epub3 file is in $(BUILDDIR)/epub3."

.PHONY: latex
latex:
	$(SPHINXBUILD) -b latex $(ALLSPHINXOPTS) $(BUILDDIR)/latex
	@echo
	@echo "Build finished; the LaTeX files are in $(BUILDDIR)/latex."
	@echo "Run \`make' in that directory to run these through (pdf)latex" \
	      "(use \`make latexpdf' here to do that automatically)."

.PHONY: latexpdf
latexpdf:
	$(SPHINXBUILD) -b latex $(ALLSPHINXOPTS) $(BUILDDIR)/latex
	@echo "Running LaTeX files through pdflatex..."
	$(MAKE) -C $(BUILDDIR)/latex all-pdf
	@echo "pdflatex finished; the PDF files are in $(BUILDDIR)/latex."

.PHONY: latexpdfja
latexpdfja:
	$(SPHINXBUILD) -b latex $(ALLSPHINXOPTS) $(BUILDDIR)/latex
	@echo "Running LaTeX files through platex and dvipdfmx..."
	$(MAKE) -C $(BUILDDIR)/latex all-pdf-ja
	@echo "pdflatex finished; the PDF files are in $(BUILDDIR)/latex."

.PHONY: text
text:
	$(SPHINXBUILD) -b text $(ALLSPHINXOPTS) $(BUILDDIR)/text
	@echo
	@echo "Build finished. The text files are in $(BUILDDIR)/text."

.PHONY: man
man:
	$(SPHINXBUILD) -b man $(ALLSPHINXOPTS) $(BUILDDIR)/man
	@echo
	@echo "Build finished. The manual pages are in $(BUILDDIR)/man."

.PHONY: texinfo
texinfo:
	$(SPHINXBUILD) -b texinfo $(ALLSPHINXOPTS) $(BUILDDIR)/texinfo
	@echo
	@echo "Build finished. The Texinfo files are in $(BUILDDIR)/texinfo."
	@echo "Run \`make' in that directory to run these through makeinfo" \
	      "(use \`make info' here to do that automatically)."

.PHONY: info
info:
	$(SPHINXBUILD) -b texinfo $(ALLSPHINXOPTS) $(BUILDDIR)/texinfo
	@echo "Running Texinfo files through makeinfo..."
	make -C $(BUILDDIR)/texinfo info
	@echo "makeinfo finished; the Info files are in $(BUILDDIR)/texinfo."

.PHONY: gettext
gettext:
	$(SPHINXBUILD) -b gettext $(I18NSPHINXOPTS) $(BUILDDIR)/locale
	@echo
	@echo "Build finished. The message catalogs are in $(BUILDDIR)/locale."

.PHONY: changes
changes:
	$(SPHINXBUILD) -b changes $(ALLSPHINXOPTS) $(BUILDDIR)/changes
	@echo
	@echo "The overview file is in $(BUILDDIR)/changes."

.PHONY: linkcheck
linkcheck:
	$(SPHINXBUILD) -b linkcheck $(ALLSPHINXOPTS) $(BUILDDIR)/linkcheck
	@echo
	@echo "Link check complete; look for any errors in the above output " \
	      "or in $(BUILDDIR)/linkcheck/output.txt."

.PHONY: doctest
doctest:
	$(SPHINXBUILD) -b doctest $(ALLSPHINXOPTS) $(BUILDDIR)/doctest
	@echo "Testing of doctests in the sources finished, look at the " \
	      "results in $(BUILDDIR)/doctest/output.txt."

.PHONY: coverage
coverage:
	$(SPHINXBUILD) -b coverage $(ALLSPHINXOPTS) $(BUILDDIR)/coverage
	@echo "Testing of coverage in the sources finished, look at the " \
	      "results in $(BUILDDIR)/coverage/python.txt."

.PHONY: xml
xml:
	$(SPHINXBUILD) -b xml $(ALLSPHINXOPTS) $(BUILDDIR)/xml
	@echo
	@echo "Build finished. The XML files are in $(BUILDDIR)/xml."

.PHONY: pseudoxml
pseudoxml:
	$(SPHINXBUILD) -b pseudoxml $(ALLSPHINXOPTS) $(BUILDDIR)/pseudoxml
	@echo
	@echo "Build finished. The pseudo-XML files are in $(BUILDDIR)/pseudoxml."

.PHONY: dummy
dummy:
	$(SPHINXBUILD) -b dummy $(ALLSPHINXOPTS) $(BUILDDIR)/dummy
	@echo
	@echo "Build finished. Dummy builder generates no files."
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/docs/api_reference/README.md

```text
# MLflow API Documentation

This directory contains the MLflow API reference. The source code (`.rst` files) is relatively minimal, as the API docs are mainly populated by docstrings in the MLflow Python source.

## Building the docs

First, install dependencies for building docs as described in the [Environment Setup and Python configuration](https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#environment-setup-and-python-configuration) section of the main MLflow contribution guide.

Building documentation requires [Pandoc](https://pandoc.org/index.html). It should have already been
installed if you used the automated env setup script
([dev-env-setup.sh](https://github.com/mlflow/mlflow/blob/master/dev/dev-env-setup.sh)),
but if you are manually installing dependencies, please follow [the official instruction](https://pandoc.org/installing.html).

Also, check the version of your installation via `pandoc --version` and ensure it is 2.2.1 or above.
If you are using Mac OSX, be aware that the Homebrew installation of Pandoc may be outdated. If you are using Linux,
you should use a deb installer or install from the source, instead of running `apt` / `apt-get` commands. Pandoc package available on official
repositories is an older version and contains several bugs. You can find newer versions at <https://github.com/jgm/pandoc/releases>.

To generate a live preview of Python & other rst documentation, run the
following snippet. Note that R & Java API docs must be regenerated
separately after each change and are not live-updated; see subsequent
sections for instructions on generating R and Java docs.

```bash
cd docs
make livehtml
```

Generate R API rst doc files via:

```bash
cd docs
make rdocs
```

---

**NOTE**

If you attempt to build the R documentation on an ARM-based platform (Apple silicon M1, M2, etc.)
you will likely get an error when trying to execute the Docker build process for the make command.
To address this, set the default docker platform environment variable as follows:

```bash
export DOCKER_DEFAULT_PLATFORM=linux/amd64
```

---

Generate Java API rst doc files via:

```bash
cd docs
make javadocs
```

Generate API docs for all languages via:

```bash
cd docs
make html
```

Generate only the main .rst based documentation:

```bash
cd docs
make rsthtml
```

After running these commands, a build folder containing the generated
HTML will be generated at `build/html`.

If changing existing Python APIs or adding new APIs under existing
modules, ensure that references to the modified APIs are updated in
existing docs under `docs/source`. Note that the Python doc generation
process will automatically produce updated API docs, but you should
still audit for usages of the modified APIs in guides and examples.

If adding a new public Python module, create a corresponding doc file
for the module under `docs/source/python_api` - [see
here](https://github.com/mlflow/mlflow/blob/v0.9.1/docs/source/python_api/mlflow.tracking.rst#mlflowtracking)
for an example.

> Note: If you are experiencing issues with rstcheck warning of failures in files that you did not modify, try:

```bash
cd docs
make clean; make html
```
```

--------------------------------------------------------------------------------

---[FILE: tsdoc.index.html.template]---
Location: mlflow-master/docs/api_reference/tsdoc.index.html.template

```text
<!DOCTYPE html>
<html>
<head>
    <title>MLflow TypeScript SDK Documentation</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16857946923"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'AW-16857946923');
    </script>
    <!-- End gtag -->
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f8f9fa;
        }
        .content {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid #e1e4e8;
        }
        .header h1 {
            font-size: 2.5rem;
            color: #2c3e50;
            margin: 1rem 0;
            font-weight: 600;
        }
        .header .logo {
            margin-bottom: 1rem;
        }
        .header .logo img {
            width: 200px;
            height: auto;
        }
        .description {
            font-size: 1.1rem;
            color: #586069;
            text-align: center;
            margin: 2rem 0;
        }
        .description a {
            color: #0366d6;
            text-decoration: none;
        }
        .description a:hover {
            text-decoration: underline;
        }
        .quickstart-section {
            margin-top: 3rem;
        }
        .quickstart-section h2 {
            font-size: 1.8rem;
            color: #2c3e50;
            margin-bottom: 1rem;
        }
        .quickstart-link {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background-color: #28a745;
            color: white;
            border-radius: 4px;
            font-weight: 500;
            text-decoration: none;
        }
        .quickstart-link:hover {
            background-color: #218838;
            text-decoration: none;
        }
        .api-docs-section {
            margin-top: 3rem;
        }
        .api-docs-section h2 {
            font-size: 1.8rem;
            color: #2c3e50;
            margin-bottom: 1rem;
        }
        .package-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .package-item {
            background-color: #f6f8fa;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #e1e4e8;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .package-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .package-item h3 {
            margin-top: 0;
            color: #2c3e50;
            font-size: 1.3rem;
        }
        .package-item p {
            margin: 0.5rem 0;
            color: #586069;
        }
        .package-link {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background-color: #0366d6;
            color: white;
            border-radius: 4px;
            font-weight: 500;
            text-decoration: none;
        }
        .package-link:hover {
            background-color: #0256c7;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="content">
        <div class="header">
            <div class="logo">
                <img src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/logo.svg" alt="MLflow Logo" />
            </div>
            <h1>MLflow TypeScript SDK</h1>
            <div class="description">
                This is the API reference for the MLflow TypeScript SDK, a set of packages for integrating your Node.js applications with <a href="https://mlflow.org">MLflow</a>.
            </div>
        </div>

        <div class="quickstart-section">
            <h2>🚀 New to MLflow?</h2>
            <p>Get started with our comprehensive quickstart guide that walks you through setting up MLflow tracing for your TypeScript applications.</p>
            <a href="https://mlflow.org/docs/latest/genai/tracing/quickstart/typescript-openai" class="quickstart-link">View Quickstart Guide →</a>
        </div>

        <div class="api-docs-section">
            <h2>📚 API Reference</h2>
            <p>Explore the detailed API documentation for each package:</p>
            <div class="package-list">
                <div class="package-item">
                    <h3>mlflow-tracing</h3>
                    <p>Core tracing functionality and manual instrumentation for MLflow TypeScript SDK.</p>
                    <a href="mlflow-tracing/index.html" class="package-link">View API Docs →</a>
                </div>
                <div class="package-item">
                    <h3>mlflow-openai</h3>
                    <p>Auto-instrumentation integration for OpenAI, making it easy to trace OpenAI API calls.</p>
                    <a href="mlflow-openai/index.html" class="package-link">View API Docs →</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: typedoc-analytics.js]---
Location: mlflow-master/docs/api_reference/typedoc-analytics.js

```javascript
// Google Analytics for TypeDoc generated pages
(function() {
  // Create the Google Analytics script tag
  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16857946923';

  // Insert it as the first script in the head
  var firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(gtagScript, firstScript);
  } else {
    document.head.appendChild(gtagScript);
  }

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-16857946923');
})();
```

--------------------------------------------------------------------------------

---[FILE: mlflow_tracking.mermaid]---
Location: mlflow-master/docs/api_reference/image-sources/quickstart/mlflow_tracking.mermaid

```text
---
title: MLflow Tracking
---

flowchart LR 
id4[(Datalake)]
A[Data Prep] -->B[Train]
B --> id1
B --> B
id1 --> C
C[Review & Select]
C --> id2
C --> B
id2 --> D[Deploy]
D --> E[Monitor]
E --> id4
id4 --> A
id1[(Tracking backend)]
id2[(Model Registry)]
```

--------------------------------------------------------------------------------

---[FILE: cli.rst]---
Location: mlflow-master/docs/api_reference/source/cli.rst

```text
.. _cli:

Command-Line Interface
======================

The MLflow command-line interface (CLI) provides a simple interface to various functionality in MLflow. You can use the CLI to run projects, start the tracking UI, create and list experiments, download run artifacts,
serve MLflow Python Function and scikit-learn models, serve MLflow Python Function and scikit-learn models, and serve models on
`Microsoft Azure Machine Learning <https://azure.microsoft.com/en-us/services/machine-learning-service/>`_
and `Amazon SageMaker <https://aws.amazon.com/sagemaker/>`_.

Each individual command has a detailed help screen accessible via ``mlflow command_name --help``.

.. attention::
    It is advisable to set the ``MLFLOW_TRACKING_URI`` environment variable by default, 
    as the CLI does not automatically connect to a tracking server. Without this, 
    the CLI will default to using the local filesystem where the command is executed, 
    rather than connecting to a localhost or remote HTTP server. 
    Setting ``MLFLOW_TRACKING_URI`` to the URL of your desired tracking server is required for most of the commands below.


.. contents:: Table of Contents
  :local:
  :depth: 2

.. click:: mlflow.cli:cli
  :prog: mlflow
  :show-nested:
```

--------------------------------------------------------------------------------

````

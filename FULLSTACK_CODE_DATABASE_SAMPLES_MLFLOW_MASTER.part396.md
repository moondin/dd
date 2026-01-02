---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 396
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 396 of 991)

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

---[FILE: .build-doc.R]---
Location: mlflow-master/mlflow/R/mlflow/.build-doc.R

```text
unlink("man", recursive = TRUE)
roxygen2::roxygenise()
# remove mlflow-package doc temporarily because no rst doc should be generated for it.
file.remove("man/mlflow-package.Rd")
source("document.R", echo = TRUE)
# roxygenize again to make sure the previously removed mlflow-packge doc is available as R helpfile
roxygen2::roxygenise()
```

--------------------------------------------------------------------------------

---[FILE: .build-package.R]---
Location: mlflow-master/mlflow/R/mlflow/.build-package.R

```text
source(".utils.R")

# Bundle up the package into a .tar.gz file.
package_path <- devtools::build(".", path = ".")

# Hack to get around this issue:
# https://stat.ethz.ch/pipermail/r-package-devel/2020q3/005930.html
#
# The system clock check during `R CMD check` relies on two external web APIs and fails
# when they are unavailable. By setting `_R_CHECK_SYSTEM_CLOCK_` to FALSE, we can skip it:
# https://github.com/wch/r-source/blob/59a1965239143ca6242b9cc948d8834e1194e84a/src/library/tools/R/check.R#L511
Sys.setenv("_R_CHECK_SYSTEM_CLOCK_" = "FALSE")

# Run the check with `cran = TRUE`
devtools::check_built(
    path = package_path,
    cran = TRUE,
    remote = should_enable_cran_incoming_checks(),
    error_on = "note",
    check_dir = getwd(),
    args = "--no-tests",
)

# Run the check with `cran = FALSE` to detect unused imports:
# https://github.com/wch/r-source/blob/b12ffba7584825d6b11bba8b7dbad084a74c1c20/src/library/tools/R/check.R#L6070
devtools::check_built(
    path = package_path,
    cran = FALSE,
    error_on = "note",
    check_dir = getwd(),
    args = "--no-tests",
)
```

--------------------------------------------------------------------------------

---[FILE: .create-test-env.R]---
Location: mlflow-master/mlflow/R/mlflow/.create-test-env.R

```text
# Install MLflow for R
files <- dir(".", full.names = TRUE)
package <- files[grepl("mlflow_.+\\.tar\\.gz$", files)]
install.packages(package)

mlflow:::mlflow_maybe_create_conda_env(python_version = "3.7")
# Install python dependencies
reticulate::conda_install(Sys.getenv("MLFLOW_HOME", "../../.."), envname = mlflow:::mlflow_conda_env_name(), pip = TRUE, pip_options = c("-e"))
# pinning tensorflow version to 1.14 until test_keras_model.R is fixed
keras::install_keras(method = "conda", envname = mlflow:::mlflow_conda_env_name(), tensorflow="1.15.2")
# pinning h5py < 3.0.0 to avoid this issue:  https://github.com/tensorflow/tensorflow/issues/44467
# TODO: unpin after we use tensorflow >= 2.4
reticulate::conda_install(c("'h5py<3.0.0'", "protobuf<4.0.0"), envname = mlflow:::mlflow_conda_env_name(), pip = TRUE)
reticulate::conda_install("xgboost", envname = mlflow:::mlflow_conda_env_name(), pip = TRUE)
reticulate::conda_install(paste0("h2o==", packageVersion("h2o")), envname = mlflow:::mlflow_conda_env_name(), pip = TRUE)
```

--------------------------------------------------------------------------------

---[FILE: .dump-r-dependencies.R]---
Location: mlflow-master/mlflow/R/mlflow/.dump-r-dependencies.R

```text
# Make sure the current working directory is 'mlflow/R/mlflow'
print(R.version)
install.packages('remotes')
saveRDS(remotes::dev_package_deps(".", dependencies = TRUE), "depends.Rds", version = 2)
writeLines(sprintf("R-%i.%i", getRversion()$major, getRversion()$minor), "R-version")
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: mlflow-master/mlflow/R/mlflow/.gitignore

```text
# History files
.Rhistory
.Rapp.history
# Session Data files
.RData
# User Data files
.Ruserdata
# Example code in package build process
*-Ex.R
# RStudio files
.Rproj.user
mlruns/
.DS_Store
model/
internal
packrat.lock
r-dependencies.txt
Reference_Manual_mlflow.md
*.Rcheck/
depends.Rds
R-version
*.tar.gz
crate.bin
```

--------------------------------------------------------------------------------

---[FILE: .install-deps.R]---
Location: mlflow-master/mlflow/R/mlflow/.install-deps.R

```text
# Increase the timeout length for `utils::download.file` because the default value (60 seconds)
# could be too short to download large packages such as h2o.
options(timeout=300)
install.packages("devtools", dependencies = TRUE)
devtools::install_version("usethis", "3.2.1")
devtools::install_dev_deps(dependencies = TRUE)

# Install dependencies for documentation build
# Install Rd2md from source as a temporary fix for the rendering of code examples, until
# a release is published including the fixes in https://github.com/quantsch/Rd2md/issues/1
# Note that this commit is equivalent to commit 6b48255 of Rd2md master
# (https://github.com/quantsch/Rd2md/tree/6b4825579a2df8a22898316d93729384f92a756b)
# with a single extra commit to fix rendering of \link tags between methods in R documentation.
devtools::install_git("https://github.com/smurching/Rd2md", ref = "mlflow-patches")
devtools::install_version("roxygen2", "7.1.2")
# The latest version of git2r (0.35.0) doesn't work with the rocker/r-ver:4.2.1 docker image
devtools::install_version("git2r", "0.33.0")
install.packages("rmarkdown", repos = "https://cloud.r-project.org")
```

--------------------------------------------------------------------------------

---[FILE: .install-mlflow-r.R]---
Location: mlflow-master/mlflow/R/mlflow/.install-mlflow-r.R

```text
# Install MLflow for R
files <- dir(".", full.names = TRUE)
package <- files[grepl("mlflow_.+\\.tar\\.gz$", files)]
install.packages(package)
```

--------------------------------------------------------------------------------

---[FILE: .lintr]---
Location: mlflow-master/mlflow/R/mlflow/.lintr

```text
linters: with_defaults(line_length_linter(120), closed_curly_linter = NULL, open_curly_linter = NULL, absolute_paths_linter = NULL, object_usage_linter = NULL, object_length_linter = NULL, commented_code_linter = NULL)
```

--------------------------------------------------------------------------------

---[FILE: .Rbuildignore]---
Location: mlflow-master/mlflow/R/mlflow/.Rbuildignore

```text
^.*\.Rproj$
^\.Rproj\.user$
mlruns
^mlflow-model$
packrat
^\.run-tests\.R$
^\.create-test-env\.R$
^\.install-mlflow-r\.R$
^\.spark-version$
^\.dump-r-dependencies\.R$
^README.Rmd$
^docs$
^model$
^r-dependencies.txt$
document.R
Reference_Manual_mlflow.md
.lintr
^man-roxygen/
^internal/
^logs/
^depends\.Rds
^R-version
^\.utils\.R$
^\.install-deps\.R$
^\.build-package\.R$
^\.build-doc\.R$
^build-package\.sh$
^Dockerfile\.dev$
^Dockerfile\.r-devel$
```

--------------------------------------------------------------------------------

---[FILE: .Rprofile]---
Location: mlflow-master/mlflow/R/mlflow/.Rprofile

```text
repos <- getOption("repos")
# https://packagemanager.rstudio.com provides pre-compiled package binaries for Linux
# that can be installed significantly faster than uncompiled package sources.
if (Sys.which("lsb_release") != "") {
    ubuntu_codename <- tolower(system("lsb_release -cs", intern = TRUE))
    repo_name <- sprintf("https://packagemanager.rstudio.com/cran/__linux__/%s/latest", ubuntu_codename)
    options(repos = c(repos, REPO_NAME = repo_name))
}
```

--------------------------------------------------------------------------------

---[FILE: .run-tests.R]---
Location: mlflow-master/mlflow/R/mlflow/.run-tests.R

```text
source("testthat.R", echo = TRUE)
```

--------------------------------------------------------------------------------

---[FILE: .utils.R]---
Location: mlflow-master/mlflow/R/mlflow/.utils.R

```text

# This script defines utility functions only used during development.

should_enable_cran_incoming_checks <- function() {
    # The CRAN incoming feasibility check performs a package recency check (this is undocumented)
    # that examines the number of days since the last release and raises a NOTE if it's < 7.
    # Relevant code:
    # https://github.com/wch/r-source/blob/4561aea946a75425ddcc8869cdb129ed5e27af97/src/library/tools/R/QC.R#L8005-L8008
    # This check needs to be disabled for a week after releasing a new version.
    cran_url <- getOption("repos")["CRAN"]
    desc_url <- url(paste0(cran_url, "/web/packages/mlflow/DESCRIPTION"))
    field <- "Date/Publication"
    desc <- read.dcf(desc_url, fields = c(field))
    close(desc_url)
    publication_date <- as.Date(unname(desc[1, field]))
    today <- Sys.Date()
    days_since_last_release <- as.numeric(difftime(today, publication_date, units="days"))
    if (days_since_last_release < 7) {
        return(FALSE)
    }

    # Skip the release frequency check if the number of releases in the last 180 days exceeds 6.
    url <- "https://crandb.r-pkg.org/mlflow/all"
    response <- httr::GET(url)
    json_data <- httr::content(response, "parsed")
    release_dates <- as.Date(sapply(json_data$timeline, function(x) substr(x, 1, 10)))
    today <- Sys.Date()
    days_ago_180 <- as.Date(today) - 180
    recent_releases <- sum(release_dates >= days_ago_180)
    if (recent_releases > 6) {
        return(FALSE)
    }

    return(TRUE)
}
```

--------------------------------------------------------------------------------

---[FILE: build-package.sh]---
Location: mlflow-master/mlflow/R/mlflow/build-package.sh

```bash
#!/usr/bin/env bash
set -ex

image_name="mlflow-r-dev"

if [ "${USE_R_DEVEL:-false}" = "true" ]
then
  docker_file="Dockerfile.r-devel"
else
  docker_file="Dockerfile.dev"
fi
docker build -f $docker_file -t $image_name .
docker run --rm -v $(pwd):/mlflow/mlflow/R/mlflow $image_name Rscript -e 'source(".build-package.R", echo = TRUE)'
```

--------------------------------------------------------------------------------

---[FILE: DESCRIPTION]---
Location: mlflow-master/mlflow/R/mlflow/DESCRIPTION

```text
Type: Package
Package: mlflow
Title: Interface to 'MLflow'
Version: 3.8.1
Authors@R: 
    c(person(given = "Ben",
             family = "Wilson",
             role = c("aut", "cre"),
             email = "benjamin.wilson@databricks.com"),
      person(given = "Matei",
             family = "Zaharia",
             role = "aut",
             email = "matei@databricks.com"),
      person(given = "Javier",
             family = "Luraschi",
             role = "aut",
             email = "jluraschi@gmail.com"),
      person(given = "Kevin",
             family = "Kuo",
             role = "aut",
             email = "kevin.kuo@rstudio.com",
             comment = c(ORCID = "0000-0001-7803-7901")),
      person(family = "RStudio",
             role = "cph"))
Description: R interface to 'MLflow', open source platform for
    the complete machine learning life cycle, see <https://mlflow.org/>.
    This package supports installing 'MLflow', tracking experiments,
    creating and running projects, and saving and serving models.
License: Apache License 2.0
URL: https://github.com/mlflow/mlflow
BugReports: https://github.com/mlflow/mlflow/issues
Depends:
    R (>= 3.3.0)
Imports:
    base64enc,
    fs,
    git2r,
    glue,
    httpuv,
    httr,
    ini,
    jsonlite,
    openssl,
    processx,
    purrr,
    rlang (>= 0.2.0),
    swagger,
    tibble (>= 2.0.0),
    withr,
    yaml,
    zeallot
Suggests:
    carrier,
    covr,
    h2o,
    keras,
    lintr,
    sparklyr,
    stringi,
    testthat (>= 2.0.0),
    reticulate,
    xgboost
Encoding: UTF-8
RoxygenNote: 7.1.2
Collate:
    'cast-utils.R'
    'cli.R'
    'databricks-utils.R'
    'globals.R'
    'imports.R'
    'logging.R'
    'mlflow-package.R'
    'model-crate.R'
    'model-python.R'
    'model.R'
    'model-utils.R'
    'model-h2o.R'
    'model-keras.R'
    'model-registry.R'
    'model-serve.R'
    'model-swagger.R'
    'model-xgboost.R'
    'project-param.R'
    'project-run.R'
    'project-source.R'
    'python.R'
    'tracking-client.R'
    'tracking-experiments.R'
    'tracking-observer.R'
    'tracking-globals.R'
    'tracking-rest.R'
    'tracking-runs.R'
    'tracking-server.R'
    'tracking-ui.R'
    'tracking-utils.R'
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile.dev]---
Location: mlflow-master/mlflow/R/mlflow/Dockerfile.dev

```text
# Our internal Jenkins job can't build an image from rocker/r-ver:>=4.2.2 (which is based on Ubuntu 22.04).
FROM rocker/r-ver:4.2.1

WORKDIR /mlflow/mlflow/R/mlflow
RUN apt-get update -y
RUN apt-get install lsb-release git wget libxml2-dev libgit2-dev -y

# Install miniforge
RUN wget https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh -O ~/miniforge.sh
RUN sh ~/miniforge.sh -b -p ~/miniforge
RUN rm ~/miniforge.sh
ENV PATH=$PATH:/root/miniforge/bin

# pandoc installed by `apt-get` is too old and contains a bug.
RUN TEMP_DEB=$(mktemp) && \
    wget --directory-prefix $TEMP_DEB https://github.com/jgm/pandoc/releases/download/2.16.2/pandoc-2.16.2-1-amd64.deb && \
    dpkg --install $(find $TEMP_DEB -name '*.deb') && \
    rm -rf $TEMP_DEB

COPY DESCRIPTION .
COPY .install-deps.R .
COPY .Rprofile .
RUN Rscript -e 'source(".install-deps.R", echo = TRUE)'
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile.r-devel]---
Location: mlflow-master/mlflow/R/mlflow/Dockerfile.r-devel

```text
FROM rocker/r-ver:devel

# Daily News about R-devel:
# https://developer.r-project.org/blosxom.cgi/R-devel

WORKDIR /mlflow/mlflow/R/mlflow
RUN apt-get update -y
RUN apt-get install lsb-release git wget libxml2-dev libgit2-dev libfontconfig1-dev \
    libssl-dev libharfbuzz-dev libfribidi-dev libcurl4-openssl-dev \
    libfreetype6-dev libpng-dev libtiff5-dev libjpeg-dev -y
# pandoc installed by `apt-get` is too old and contains a bug.
RUN TEMP_DEB=$(mktemp) && \
    wget --directory-prefix $TEMP_DEB https://github.com/jgm/pandoc/releases/download/2.16.2/pandoc-2.16.2-1-amd64.deb && \
    dpkg --install $(find $TEMP_DEB -name '*.deb') && \
    rm -rf $TEMP_DEB
COPY DESCRIPTION .
COPY .install-deps.R .
COPY .Rprofile .
RUN Rscript -e 'source(".install-deps.R", echo = TRUE)'
```

--------------------------------------------------------------------------------

---[FILE: document.R]---
Location: mlflow-master/mlflow/R/mlflow/document.R

```text
# Generate docs as markdown into a per-session tempdir that's automatically cleaned up when
# the R session terminates.
Rd2md::ReferenceManual(outdir = tempdir())

# Remove markdown package description
markdown_doc <- readLines(file.path(tempdir(), "Reference_Manual_mlflow.md"))
# Somewhat of a hack: find the second occurrence of "```", which delimits the TOC generated by
# Rd2md, and remove all preceding lines to delete the TOC.
toc_delimiter = "```"
first_function <- which(grepl(toc_delimiter, markdown_doc))[[2]] + 1
markdown_fixed <- markdown_doc[first_function:length(markdown_doc)]

# Remove function name from section
markdown_fixed <- gsub("# `[^`]+`:", "#", markdown_fixed)

# Remove description and usage headers
markdown_fixed <- gsub("## Description", "", markdown_fixed)
markdown_fixed <- gsub("## Usage", "", markdown_fixed)

# Remove objects exported from other packages section
last_section <- which(grepl("reexports", markdown_fixed))[[1]]
markdown_fixed <- markdown_fixed[1:last_section - 1]

# Write fixed markdown file
writeLines(markdown_fixed, "Reference_Manual_mlflow.md")

# Clear Sphinx docs and tree to correctly generate sections
if (dir.exists("../../../docs/api_reference/build")) {
  unlink("../../../docs/api_reference/build", recursive = TRUE)
}

# Generate reStructuredText documentation
rmarkdown::pandoc_convert("Reference_Manual_mlflow.md", output = "../../../docs/api_reference/source/R-api.rst")

# Add R API header to RST docs
rst_header <- ".. _R-api:

========
R API
========

The MLflow `R <https://www.r-project.org/about.html>`_ API allows you to use MLflow `Tracking <../tracking/index.html>`_, `Projects <../projects/index.html>`_ and `Models <../models/index.html>`_.

Prerequisites
=============

To use the MLflow R API, you must install `the MLflow Python package <https://pypi.org/project/mlflow/>`_.

.. code-block:: bash

    pip install mlflow

Installing with an Available Conda Environment example:

.. code-block:: bash
    
    conda create -n mlflow-env python
    conda activate mlflow-env
    pip install mlflow

The above provided commands create a new Conda environment named mlflow-env, specifying the default Python version. It then activates this environment, making it the active working environment. Finally, it installs the MLflow package using pip, ensuring that MLflow is isolated within this environment, allowing for independent Python and package management for MLflow-related tasks.

Optionally, you can set the ``MLFLOW_PYTHON_BIN`` and ``MLFLOW_BIN`` environment variables to specify the Python and MLflow binaries to use. By default, the R client automatically finds them using ``Sys.which('python')`` and ``Sys.which('mlflow')``.

.. code-block:: bash

    export MLFLOW_PYTHON_BIN=/path/to/bin/python
    export MLFLOW_BIN=/path/to/bin/mlflow

You can use the R API to start the `user interface <mlflow_ui_>`_, `create experiment <mlflow_create_experiment_>`_ and `search experiments <mlflow_search_experiments_>`_, `save models <mlflow_save_model.crate_>`_, `run projects <mlflow_run_>`_ and `serve models <mlflow_rfunc_serve_>`_ among many other functions available in the R API.

.. contents:: Table of Contents
    :local:
    :depth: 1
"
rst_doc <- readLines("../../../docs/api_reference/source/R-api.rst")
# Convert non-breaking spaces inserted by pandoc to regular spaces
rst_doc <- gsub("\302\240", " ", rst_doc)
rst_doc <- c(rst_header, rst_doc)
writeLines(rst_doc, "../../../docs/api_reference/source/R-api.rst")

# Generate docs by using an mlflow virtualenv and running `make` from `mlflow/docs`
```

--------------------------------------------------------------------------------

---[FILE: mlflow.Rproj]---
Location: mlflow-master/mlflow/R/mlflow/mlflow.Rproj

```text
Version: 1.0

RestoreWorkspace: Default
SaveWorkspace: Default
AlwaysSaveHistory: Default

EnableCodeIndexing: Yes
UseSpacesForTab: Yes
NumSpacesForTab: 2
Encoding: UTF-8

RnwWeave: Sweave
LaTeX: pdfLaTeX

AutoAppendNewline: Yes
StripTrailingWhitespace: Yes

BuildType: Package
PackageUseDevtools: Yes
PackageInstallArgs: --no-multiarch --with-keep.source
PackageRoxygenize: rd,collate,namespace
```

--------------------------------------------------------------------------------

---[FILE: NAMESPACE]---
Location: mlflow-master/mlflow/R/mlflow/NAMESPACE

```text
# Generated by roxygen2: do not edit by hand

S3method(mlflow_id,mlflow_experiment)
S3method(mlflow_id,mlflow_run)
S3method(mlflow_load_flavor,mlflow_flavor_crate)
S3method(mlflow_load_flavor,mlflow_flavor_h2o)
S3method(mlflow_load_flavor,mlflow_flavor_keras)
S3method(mlflow_load_flavor,mlflow_flavor_xgboost)
S3method(mlflow_predict,H2OModel)
S3method(mlflow_predict,crate)
S3method(mlflow_predict,keras.engine.training.Model)
S3method(mlflow_predict,xgb.Booster)
S3method(mlflow_save_model,H2OModel)
S3method(mlflow_save_model,crate)
S3method(mlflow_save_model,keras.engine.training.Model)
S3method(mlflow_save_model,xgb.Booster)
S3method(mlflow_ui,"NULL")
S3method(mlflow_ui,mlflow_client)
S3method(print,mlflow_host_creds)
S3method(with,mlflow_run)
export(mlflow_client)
export(mlflow_create_experiment)
export(mlflow_create_model_version)
export(mlflow_create_registered_model)
export(mlflow_delete_experiment)
export(mlflow_delete_model_version)
export(mlflow_delete_registered_model)
export(mlflow_delete_run)
export(mlflow_delete_tag)
export(mlflow_download_artifacts)
export(mlflow_end_run)
export(mlflow_get_experiment)
export(mlflow_get_latest_versions)
export(mlflow_get_metric_history)
export(mlflow_get_model_version)
export(mlflow_get_registered_model)
export(mlflow_get_run)
export(mlflow_get_tracking_uri)
export(mlflow_id)
export(mlflow_list_artifacts)
export(mlflow_load_flavor)
export(mlflow_load_model)
export(mlflow_log_artifact)
export(mlflow_log_batch)
export(mlflow_log_metric)
export(mlflow_log_model)
export(mlflow_log_param)
export(mlflow_param)
export(mlflow_predict)
export(mlflow_register_external_observer)
export(mlflow_rename_experiment)
export(mlflow_rename_registered_model)
export(mlflow_restore_experiment)
export(mlflow_restore_run)
export(mlflow_rfunc_serve)
export(mlflow_run)
export(mlflow_save_model)
export(mlflow_search_experiments)
export(mlflow_search_registered_models)
export(mlflow_search_runs)
export(mlflow_server)
export(mlflow_set_experiment)
export(mlflow_set_experiment_tag)
export(mlflow_set_model_version_tag)
export(mlflow_set_tag)
export(mlflow_set_tracking_uri)
export(mlflow_source)
export(mlflow_start_run)
export(mlflow_transition_model_version_stage)
export(mlflow_ui)
export(mlflow_update_model_version)
export(mlflow_update_registered_model)
import(swagger)
importFrom(base64enc,base64encode)
importFrom(httpuv,runServer)
importFrom(httpuv,startDaemonizedServer)
importFrom(httpuv,stopServer)
importFrom(ini,read.ini)
importFrom(jsonlite,fromJSON)
importFrom(openssl,rand_num)
importFrom(processx,process)
importFrom(processx,run)
importFrom(purrr,"%>%")
importFrom(rlang,"%||%")
importFrom(utils,browseURL)
importFrom(utils,modifyList)
importFrom(withr,with_envvar)
importFrom(yaml,write_yaml)
importFrom(zeallot,"%<-%")
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/mlflow/R/mlflow/README.md

```text
# mlflow: R interface for MLflow

[![CRAN_Status_Badge](https://www.r-pkg.org/badges/version/mlflow)](https://cran.r-project.org/package=mlflow)

- Install [MLflow](https://mlflow.org/) from R to track experiments
  locally.
- Connect to MLflow servers to share experiments with others.
- Use MLflow to export models that can be served locally and remotely.

## Prerequisites

To use the MLflow R API, you must install [the MLflow Python package](https://pypi.org/project/mlflow/).

```bash
pip install mlflow
```

Optionally, you can set the `MLFLOW_PYTHON_BIN` and `MLFLOW_BIN` environment variables to specify
the Python and MLflow binaries to use. By default, the R client automatically finds them using
`Sys.which("python")` and `Sys.which("mlflow")`.

```bash
export MLFLOW_PYTHON_BIN=/path/to/bin/python
export MLFLOW_BIN=/path/to/bin/mlflow
```

## Installation

Install `mlflow` as follows:

```r
devtools::install_github("mlflow/mlflow", subdir = "mlflow/R/mlflow")
```

## Development

Install the `mlflow` package as follows:

```r
devtools::install_github("mlflow/mlflow", subdir = "mlflow/R/mlflow")
```

Then install the latest released `mlflow` runtime.

However, currently, the development runtime of `mlflow` is also
required; which means you also need to download or clone the `mlflow`
GitHub repo:

```bash
git clone https://github.com/mlflow/mlflow
```

And upgrade the runtime to the development version as follows:

```bash
# Upgrade to the latest development version
pip install -e <local github repo>
```

## Tracking

MLflow Tracking allows you to logging parameters, code versions,
metrics, and output files when running R code and for later visualizing
the results.

MLflow allows you to group runs under experiments, which can be useful
for comparing runs intended to tackle a particular task. You can create
and activate a new experiment locally using `mlflow` as follows:

```r
library(mlflow)
mlflow_set_experiment("Test")
```

Then you can list view your experiments from MLflows user interface by
running:

```r
mlflow_ui()
```

<img src="tools/readme/mlflow-user-interface.png" class="screenshot" width=520 />

You can also use a MLflow server to track and share experiments, see
[running a tracking
server](https://www.mlflow.org/docs/latest/tracking.html#running-a-tracking-server),
and then make use of this server by running:

```r
mlflow_set_tracking_uri("http://tracking-server:5000")
```

Once the tracking url is defined, the experiments will be stored and
tracked in the specified server which others will also be able to
access.

## Projects

An MLflow Project is a format for packaging data science code in a
reusable and reproducible way.

MLflow projects can be [explicitly
created](https://www.mlflow.org/docs/latest/projects.html#specifying-projects)
or implicitly used by running `R` with `mlflow` from the terminal as
follows:

```bash
mlflow run examples/r_wine --entry-point train.R
```

Notice that is equivalent to running from `examples/r_wine`,

```bash
Rscript -e "mlflow::mlflow_source('train.R')"
```

and `train.R` performing training and logging as follows:

```r
library(mlflow)

# read parameters
column <- mlflow_log_param("column", 1)

# log total rows
mlflow_log_metric("rows", nrow(iris))

# train model
model <- lm(
  Sepal.Width ~ x,
  data.frame(Sepal.Width = iris$Sepal.Width, x = iris[,column])
)

# log models intercept
mlflow_log_metric("intercept", model$coefficients[["(Intercept)"]])
```

### Parameters

You will often want to parameterize your scripts to support running and
tracking multiple experiments. You can define parameters with type under
a `params_example.R` example as follows:

```r
library(mlflow)

# define parameters
my_int <- mlflow_param("my_int", 1, "integer")
my_num <- mlflow_param("my_num", 1.0, "numeric")

# log parameters
mlflow_log_param("param_int", my_int)
mlflow_log_param("param_num", my_num)
```

Then run `mlflow run` with custom parameters as
follows

    mlflow run tests/testthat/examples/ --entry-point params_example.R -P my_int=10 -P my_num=20.0 -P my_str=XYZ

    === Created directory /var/folders/ks/wm_bx4cn70s6h0r5vgqpsldm0000gn/T/tmpi6d2_wzf for downloading remote URIs passed to arguments of type 'path' ===
    === Running command 'source /miniconda2/bin/activate mlflow-da39a3ee5e6b4b0d3255bfef95601890afd80709 && Rscript -e "mlflow::mlflow_source('params_example.R')" --args --my_int 10 --my_num 20.0 --my_str XYZ' in run with ID '191b489b2355450a8c3cc9bf96cb1aa3' ===
    === Run (ID '191b489b2355450a8c3cc9bf96cb1aa3') succeeded ===

Run results that we can view with `mlflow_ui()`.

## Models

An MLflow Model is a standard format for packaging machine learning
models that can be used in a variety of downstream tools—for example,
real-time serving through a REST API or batch inference on Apache Spark.
They provide a convention to save a model in different "flavors" that
can be understood by different downstream tools.

To save a model use `mlflow_save_model()`. For instance, you can add the
following lines to the previous `train.R` script:

```r
# train model (...)

# save model
mlflow_save_model(
  crate(~ stats::predict(model, .x), model)
)
```

And trigger a run with that will also save your model as follows:

```bash
mlflow run train.R
```

Each MLflow Model is simply a directory containing arbitrary files,
together with an MLmodel file in the root of the directory that can
define multiple flavors that the model can be viewed in.

The directory containing the model looks as follows:

```r
dir("model")
```

    ## [1] "crate.bin" "MLmodel"

and the model definition `model/MLmodel` like:

```r
cat(paste(readLines("model/MLmodel"), collapse = "\n"))
```

    ## flavors:
    ##   crate:
    ##     version: 0.1.0
    ##     model: crate.bin
    ## time_created: 18-10-03T22:18:25.25.55
    ## run_id: 4286a3d27974487b95b19e01b7b3caab

Later on, the R model can be deployed which will perform predictions
using
`mlflow_rfunc_predict()`:

```r
mlflow_rfunc_predict("model", data = data.frame(x = c(0.3, 0.2)))
```

    ## Warning in mlflow_snapshot_warning(): Running without restoring the
    ## packages snapshot may not reload the model correctly. Consider running
    ## 'mlflow_restore_snapshot()' or setting the 'restore' parameter to 'TRUE'.

    ## 3.400381396714573.40656987651099

    ##        1        2
    ## 3.400381 3.406570

## Deployment

MLflow provides tools for deployment on a local machine and several
production environments. You can use these tools to easily apply your
models in a production environment.

You can serve a model by running,

```bash
mlflow rfunc serve model
```

which is equivalent to
running,

```bash
Rscript -e "mlflow_rfunc_serve('model')"
```

<img src="tools/readme/mlflow-serve-rfunc.png" class="screenshot" width=520 />

You can also run:

```bash
mlflow rfunc predict model data.json
```

which is equivalent to running,

```bash
Rscript -e "mlflow_rfunc_predict('model', 'data.json')"
```

## Dependencies

When running a project, `mlflow_snapshot()` is automatically called to
generate a `r-dependencies.txt` file which contains a list of required
packages and versions.

However, restoring dependencies is not automatic since it's usually an
expensive operation. To restore dependencies run:

```r
mlflow_restore_snapshot()
```

Notice that the `MLFLOW_SNAPSHOT_CACHE` environment variable can be set
to a cache directory to improve the time required to restore
dependencies.

## RStudio

To enable fast iteration while tracking with MLflow improvements over a
model, [RStudio 1.2.897](https://dailies.rstudio.com/) an be configured
to automatically trigger `mlflow_run()` when sourced. This is enabled by
including a `# !source mlflow::mlflow_run` comment at the top of the R
script as
follows:

<img src="tools/readme/mlflow-source-rstudio.png" class="screenshot" width=520 />

## Contributing

See the [MLflow contribution guidelines](https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md).
```

--------------------------------------------------------------------------------

---[FILE: README.Rmd]---
Location: mlflow-master/mlflow/R/mlflow/README.Rmd

```text
---
title: "mlflow: R interface for MLflow"
output:
  github_document:
    fig_width: 9
    fig_height: 5
---

[![CRAN_Status_Badge](https://www.r-pkg.org/badges/version/mlflow)](https://cran.r-project.org/package=mlflow)

```{r setup, include=FALSE}
knitr::opts_chunk$set(fig.path = "tools/readme/", dev = "png")
```

- Install [MLflow](https://mlflow.org/) from R to track experiments locally.
- Connect to MLflow servers to share experiments with others.
- Use MLflow to export models that can be served locally and remotely.

```{r echo=FALSE, message=F, results='hide'}
unlink("mlruns", recursive = T)
```

## Prerequisites

To use the MLflow R API, you must install [the MLflow Python package](https://pypi.org/project/mlflow/).

```{bash eval=FALSE}
pip install mlflow
```

Optionally, you can set the ``MLFLOW_PYTHON_BIN`` and ``MLFLOW_BIN`` environment variables to specify
the Python and MLflow binaries to use. By default, the R client automatically finds them using
``Sys.which("python")`` and ``Sys.which("mlflow")``.

```{bash eval=FALSE}
export MLFLOW_PYTHON_BIN=/path/to/bin/python
export MLFLOW_BIN=/path/to/bin/mlflow
```

## Installation

Install `mlflow` as follows:

```{r eval=FALSE}
devtools::install_github("mlflow/mlflow", subdir = "mlflow/R/mlflow")
```

Notice also that [Anaconda](https://www.anaconda.com/products/distribution) or [Miniconda](https://docs.conda.io/en/latest/miniconda.html) need to be manually installed.

## Development

Install the `mlflow` package as follows:

```{r, eval=FALSE}
devtools::install_github("mlflow/mlflow", subdir = "mlflow/R/mlflow")
```

However, currently, the development runtime of `mlflow` is also required; which means you also need to download or clone the `mlflow` GitHub repo:

```{bash eval=FALSE}
git clone https://github.com/mlflow/mlflow
```

And upgrade the runtime to the development version as follows:

```{r, eval=FALSE}
# Upgrade to the latest development version
pip install -e <local github repo>
```

## Tracking

MLflow Tracking allows you to logging parameters, code versions, metrics, and output files when running R code and for later visualizing the results.

MLflow allows you to group runs under experiments, which can be useful for comparing runs intended to tackle a particular task. You can create and activate a new experiment locally using `mlflow` as follows:

```{r, message=FALSE}
library(mlflow)
mlflow_set_experiment("Test")
```

Then you can list view your experiments from MLflows user interface by running:

```{r eval=FALSE}
mlflow_ui()
```

<img src="tools/readme/mlflow-user-interface.png" class="screenshot" width=520 />

You can also use a MLflow server to track and share experiments, see [running a tracking server](https://www.mlflow.org/docs/latest/tracking.html#running-a-tracking-server), and then make use of this server by running:

```{r eval=FALSE}
mlflow_set_tracking_uri("http://tracking-server:5000")
```

Once the tracking url is defined, the experiments will be stored and tracked in the specified server which others will also be able to access.

## Projects

An MLflow Project is a format for packaging data science code in a reusable and reproducible way.

MLflow projects can be [explicitly created](https://www.mlflow.org/docs/latest/projects.html#specifying-projects) or implicitly used by running `R` with `mlflow` from the terminal as follows:

```{bash eval=FALSE}
mlflow run examples/r_wine --entry-point train.R
```

Notice that is equivalent to running from `examples/r_wine`,

```{bash eval=FALSE}
Rscript -e "mlflow::mlflow_source('train.R')"
```

and `train.R` performing training and logging as follows:

```{r}
library(mlflow)

# read parameters
column <- mlflow_log_param("column", 1)

# log total rows
mlflow_log_metric("rows", nrow(iris))

# train model
model <- lm(
  Sepal.Width ~ x,
  data.frame(Sepal.Width = iris$Sepal.Width, x = iris[,column])
)

# log models intercept
mlflow_log_metric("intercept", model$coefficients[["(Intercept)"]])
```

### Parameters

You will often want to parameterize your scripts to support running and tracking multiple experiments. Ypu can define parameters with type under a `params_example.R` example as follows:

```{r eval=FALSE}
library(mlflow)

# define parameters
my_int <- mlflow_param("my_int", 1, "integer")
my_num <- mlflow_param("my_num", 1.0, "numeric")

# log parameters
mlflow_log_param("param_int", my_int)
mlflow_log_param("param_num", my_num)
```

Then run `mlflow run` with custom parameters as follows

```
mlflow run tests/testthat/examples/ --entry-point params_example.R -P my_int=10 -P my_num=20.0 -P my_str=XYZ
```
```
=== Created directory /var/folders/ks/wm_bx4cn70s6h0r5vgqpsldm0000gn/T/tmpi6d2_wzf for downloading remote URIs passed to arguments of type 'path' ===
=== Running command 'source /miniconda2/bin/activate mlflow-da39a3ee5e6b4b0d3255bfef95601890afd80709 && Rscript -e "mlflow::mlflow_source('params_example.R')" --args --my_int 10 --my_num 20.0 --my_str XYZ' in run with ID '191b489b2355450a8c3cc9bf96cb1aa3' === 
=== Run (ID '191b489b2355450a8c3cc9bf96cb1aa3') succeeded ===
```

Run results that we can view with `mlflow_ui()`.

## Models

An MLflow Model is a standard format for packaging machine learning models that can be used in a variety of downstream tools—for example, real-time serving through a REST API or batch inference on Apache Spark. They provide a convention to save a model in different "flavors" that can be understood by different downstream tools.

To save a model use `mlflow_save_model()`. For instance, you can add the following lines to the previous `train.R` script:

```{r}
# train model (...)

# save model
mlflow_save_model(
  crate(~ stats::predict(model, .x), model)
)
```

And trigger a run with that will also save your model as follows:

```{bash eval=FALSE}
mlflow run train.R
```

Each MLflow Model is simply a directory containing arbitrary files, together with an MLmodel file in the root of the directory that can define multiple flavors that the model can be viewed in. 

The directory containing the model looks as follows:

```{r}
dir("model")
```

and the model definition `model/MLmodel` like:

```{r}
cat(paste(readLines("model/MLmodel"), collapse = "\n"))
```

Later on, the R model can be deployed which will perform predictions using `mlflow_rfunc_predict()`:

```{r}
mlflow_rfunc_predict("model", data = data.frame(x = c(0.3, 0.2)))
```

## Deployment

MLflow provides tools for deployment on a local machine and several production environments. You can use these tools to easily apply your models in a production environment.

You can serve a model by running,

```{bash eval=FALSE}
mlflow rfunc serve model
```

which is equivalent to running,

```{bash eval=FALSE}
Rscript -e "mlflow_rfunc_serve('model')"
```

<img src="tools/readme/mlflow-serve-rfunc.png" class="screenshot" width=520 />

You can also run:

```{bash eval=FALSE}
mlflow rfunc predict model data.json
```

which is equivalent to running,

```{bash eval=FALSE}
Rscript -e "mlflow_rfunc_predict('model', 'data.json')"
```

## Dependencies

When running a project, `mlflow_snapshot()` is automatically called to generate a `r-dependencies.txt` file which contains a list of required packages and versions.

However, restoring dependencies is not automatic since it's usually an expensive operation. To restore dependencies run:

```{r eval=FALSE}
mlflow_restore_snapshot()
```

Notice that the `MLFLOW_SNAPSHOT_CACHE` environment variable can be set to a cache directory to improve the time required to restore dependencies.

## RStudio

To enable fast iteration while tracking with MLflow improvements over a model, [RStudio 1.2.897](https://dailies.rstudio.com/) an be configured to automatically trigger `mlflow_run()` when sourced. This is enabled by including a `# !source mlflow::mlflow_run` comment at the top of the R script as follows:

<img src="tools/readme/mlflow-source-rstudio.png" class="screenshot" width=520 />

## Contributing

See the [MLflow contribution guidelines](../../../CONTRIBUTING.md).
```

--------------------------------------------------------------------------------

---[FILE: build_context_tags_from_databricks_job_info.Rd]---
Location: mlflow-master/mlflow/R/mlflow/man/build_context_tags_from_databricks_job_info.Rd

```text
% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/databricks-utils.R
\name{build_context_tags_from_databricks_job_info}
\alias{build_context_tags_from_databricks_job_info}
\title{Get information from a Databricks job execution context}
\usage{
build_context_tags_from_databricks_job_info(job_info)
}
\arguments{
\item{job_info}{The job-related metadata from a running Databricks job}
}
\value{
A list of tags to be set by the run context when creating MLflow runs in the
current Databricks Job environment
}
\description{
Parses the data from a job execution context when running on Databricks in a non-interactive
mode. This function extracts relevant data that MLflow needs in order to properly utilize the
MLflow APIs from this context.
}
```

--------------------------------------------------------------------------------

---[FILE: build_context_tags_from_databricks_notebook_info.Rd]---
Location: mlflow-master/mlflow/R/mlflow/man/build_context_tags_from_databricks_notebook_info.Rd

```text
% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/databricks-utils.R
\name{build_context_tags_from_databricks_notebook_info}
\alias{build_context_tags_from_databricks_notebook_info}
\title{Get information from Databricks Notebook environment}
\usage{
build_context_tags_from_databricks_notebook_info(notebook_info)
}
\arguments{
\item{notebook_info}{The configuration data from the Databricks Notebook environment}
}
\value{
A list of tags to be set by the run context when creating MLflow runs in the
current Databricks Notebook environment
}
\description{
Retrieves the notebook id, path, url, name, version, and type from the Databricks Notebook
execution environment and sets them to a list to be used for setting the configured environment
for executing an MLflow run in R from Databricks.
}
```

--------------------------------------------------------------------------------

````

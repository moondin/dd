---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 400
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 400 of 991)

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

---[FILE: project-param.R]---
Location: mlflow-master/mlflow/R/mlflow/R/project-param.R

```text
#' Read Command-Line Parameter
#'
#' Reads a command-line parameter passed to an MLflow project
#' MLflow allows you to define named, typed input parameters to your R scripts via the mlflow_param
#' API. This is useful for experimentation, e.g. tracking multiple invocations of the same script
#' with different parameters.
#'
#' @examples
#' \dontrun{
#' # This parametrized script trains a GBM model on the Iris dataset and can be run as an MLflow
#' # project. You can run this script (assuming it's saved at /some/directory/params_example.R)
#' # with custom parameters via:
#' # mlflow_run(entry_point = "params_example.R", uri = "/some/directory",
#' #   parameters = list(num_trees = 200, learning_rate = 0.1))
#' install.packages("gbm")
#' library(mlflow)
#' library(gbm)
#' # define and read input parameters
#' num_trees <- mlflow_param(name = "num_trees", default = 200, type = "integer")
#' lr <- mlflow_param(name = "learning_rate", default = 0.1, type = "numeric")
#' # use params to fit a model
#' ir.adaboost <- gbm(Species ~., data=iris, n.trees=num_trees, shrinkage=lr)
#' }
#'

#' @param name The name of the parameter.
#' @param default The default value of the parameter.
#' @param type Type of this parameter. Required if `default` is not set. If specified,
#'  must be one of "numeric", "integer", or "string".
#' @param description Optional description for the parameter.
#'
#' @export
mlflow_param <- function(name, default = NULL, type = NULL, description = NULL) {
  target_type <- cast_choice(
    type,
    c("numeric", "integer", "string"),
    allow_null = TRUE
  ) %||% typeof(default)

  if (identical(target_type, "NULL"))
    stop("At least one of `default` or `type` must be specified", call. = FALSE)

  caster <- switch(
    target_type,
    integer = cast_nullable_scalar_integer,
    double = cast_nullable_scalar_double,
    numeric = cast_nullable_scalar_double,
    cast_nullable_string
  )

  default <- tryCatch(
    if (!is.null(default)) caster(default),
    error = function(e) stop("`default` value for `", name, "` cannot be casted to type ",
                             type, ": ", conditionMessage(e), call. = FALSE)
  )

  tryCatch(
    caster(.globals$run_params[[name]]) %||% default,
    error = function(e) stop("Provided value for `", name,
                             "` cannot be casted to type ",
                             type, ": ", conditionMessage(e),
                             call. = FALSE)
  )
}

# from rstudio/tfruns R/flags.R
# parse command line arguments
parse_command_line <- function(arguments) {
  arguments <- arguments[!arguments == "--args"]

  if (!length(arguments)) return(NULL)
  # initialize some state
  values <- list()

  i <- 0; n <- length(arguments)
  while (i < n) {
    i <- i + 1
    argument <- arguments[[i]]

    # skip any command line arguments without a '--' prefix
    if (!grepl("^--", argument))
      next

    # check to see if an '=' was specified for this argument
    equals_idx <- regexpr("=", argument)
    if (identical(c(equals_idx), -1L)) {
      # no '='; the next argument is the value for this key
      key <- substring(argument, 3)
      val <- arguments[[i + 1]]
      i <- i + 1
    } else {
      # found a '='; the next argument is all the text following
      # that character
      key <- substring(argument, 3, equals_idx - 1)
      val <- substring(argument, equals_idx + 1)
    }

    # convert '-' to '_' in key
    key <- gsub("-", "_", key)

    # update our map of argument values
    values[[key]] <- yaml::yaml.load(val)
  }

  values
}
```

--------------------------------------------------------------------------------

---[FILE: project-run.R]---
Location: mlflow-master/mlflow/R/mlflow/R/project-run.R

```text
#' Run an MLflow Project
#'
#' Wrapper for the `mlflow run` CLI command. See
#' https://www.mlflow.org/docs/latest/cli.html#mlflow-run for more info.
#'
#' @examples
#' \dontrun{
#' # This parametrized script trains a GBM model on the Iris dataset and can be run as an MLflow
#' # project. You can run this script (assuming it's saved at /some/directory/params_example.R)
#' # with custom parameters via:
#' # mlflow_run(entry_point = "params_example.R", uri = "/some/directory",
#' #   parameters = list(num_trees = 200, learning_rate = 0.1))
#' install.packages("gbm")
#' library(mlflow)
#' library(gbm)
#' # define and read input parameters
#' num_trees <- mlflow_param(name = "num_trees", default = 200, type = "integer")
#' lr <- mlflow_param(name = "learning_rate", default = 0.1, type = "numeric")
#' # use params to fit a model
#' ir.adaboost <- gbm(Species ~., data=iris, n.trees=num_trees, shrinkage=lr)
#' }
#'

#'
#' @param entry_point Entry point within project, defaults to `main` if not specified.
#' @param uri A directory containing modeling scripts, defaults to the current directory.
#' @param version Version of the project to run, as a Git commit reference for Git projects.
#' @param parameters A list of parameters.
#' @param experiment_id ID of the experiment under which to launch the run.
#' @param experiment_name Name of the experiment under which to launch the run.
#' @param backend Execution backend to use for run.
#' @param backend_config Path to JSON file which will be passed to the backend. For the Databricks backend,
#'   it should describe the cluster to use when launching a run on Databricks.
#' @param env_manager If specified, create an environment for the project using the specified environment manager.
#'   Available options are 'local', 'virtualenv', and 'conda'.
#' @param storage_dir Valid only when `backend` is local. MLflow downloads artifacts from distributed URIs passed to
#'  parameters of type `path` to subdirectories of `storage_dir`.
#'
#' @return The run associated with this run.
#'
#' @export
mlflow_run <- function(uri = ".", entry_point = NULL, version = NULL, parameters = NULL,
                       experiment_id = NULL, experiment_name = NULL, backend = NULL, backend_config = NULL,
                       env_manager = NULL, storage_dir = NULL) {
  if (!is.null(experiment_name) && !is.null(experiment_id)) {
    stop("Specify only one of `experiment_name` or `experiment_id`.")
  }
  if (is.null(experiment_name)) {
    experiment_id <- mlflow_infer_experiment_id(experiment_id)
  }
  if (file.exists(uri))
    uri <- fs::path_expand(uri)

  param_list <- if (!is.null(parameters)) parameters %>%
    purrr::imap_chr(~ paste0(.y, "=", format(.x, scientific = FALSE))) %>%
    purrr::reduce(~ mlflow_cli_param(.x, "--param-list", .y), .init = list())

  args <- list(uri) %>%
    mlflow_cli_param("--entry-point", entry_point) %>%
    mlflow_cli_param("--version", version) %>%
    mlflow_cli_param("--experiment-id", experiment_id) %>%
    mlflow_cli_param("--experiment-name", experiment_name) %>%
    mlflow_cli_param("--backend", backend) %>%
    mlflow_cli_param("--backend-config", backend_config) %>%
    mlflow_cli_param("--storage-dir", storage_dir) %>%
    mlflow_cli_param("--env-manager", env_manager) %>%
    c(param_list)

  result <- do.call(mlflow_cli, c("run", args))
  matches <- regexec(".*Run \\(ID \\'([^\\']+).*", result$stderr)
  run_id <- regmatches(result$stderr, matches)[[1]][[2]]
  invisible(run_id)
}
```

--------------------------------------------------------------------------------

---[FILE: project-source.R]---
Location: mlflow-master/mlflow/R/mlflow/R/project-source.R

```text
#' Source a Script with MLflow Params
#'
#' This function should not be used interactively. It is designed to be called via `Rscript` from
#'   the terminal or through the MLflow CLI.
#'
#' @param uri Path to an R script, can be a quoted or unquoted string.
#' @keywords internal
#' @export
mlflow_source <- function(uri) {
  if (interactive()) stop(
    "`mlflow_source()` cannot be used interactively; use `mlflow_run()` instead.",
    call. = FALSE
  )

  uri <- as.character(substitute(uri))

  .globals$run_params <- list()
  command_args <- parse_command_line(commandArgs(trailingOnly = TRUE))

  if (!is.null(command_args)) {
    purrr::iwalk(command_args, function(value, key) {
      .globals$run_params[[key]] <- value
    })
  }

  tryCatch(
    suppressPackageStartupMessages(source(uri, local = parent.frame())),
    error = function(cnd) {
      message(cnd, "\n")
      mlflow_end_run(status = "FAILED")
    },
    interrupt = function(cnd) mlflow_end_run(status = "KILLED"),
    finally = {
      if (!is.null(mlflow_get_active_run_id())) mlflow_end_run(status = "FAILED")
      clear_run_params()
    }
  )

  invisible(NULL)
}

clear_run_params <- function() {
  rlang::env_unbind(.globals, "run_params")
}
```

--------------------------------------------------------------------------------

---[FILE: python.R]---
Location: mlflow-master/mlflow/R/mlflow/R/python.R

```text
# Computes path to Python executable from the MLFLOW_PYTHON_BIN environment variable.
get_python_bin <- function() {
  in_env <- Sys.getenv("MLFLOW_PYTHON_BIN")
  if (in_env != "") {
    return(in_env)
  }
  # MLFLOW_PYTHON_EXECUTABLE is an environment variable that's defined in a Databricks notebook
  # environment.
  mlflow_python_executable <- Sys.getenv("MLFLOW_PYTHON_EXECUTABLE")
  if (mlflow_python_executable != "") {
    stdout <- system(paste(mlflow_python_executable, '-c "import sys; print(sys.executable)"'),
                     intern = TRUE,
                     ignore.stderr = TRUE)
    return(paste(stdout, collapse = ""))
  }
  python_bin <- Sys.which("python")
  if (python_bin != "") {
    return(python_bin)
  }
  stop(paste("MLflow not configured, please run `pip install mlflow` or ",
             "set MLFLOW_PYTHON_BIN and MLFLOW_BIN environment variables.", sep = ""))
}

# Returns path to Python executable
python_bin <- function() {
  if (is.null(.globals$python_bin)) {
    python <- get_python_bin()
    .globals$python_bin <- path.expand(python)
  }

  .globals$python_bin
}

# Returns path to MLflow CLI, assumed to be in the same bin/ directory as the
# Python executable
python_mlflow_bin <- function() {
  in_env <- Sys.getenv("MLFLOW_BIN")
  if (in_env != "") {
    return(in_env)
  }
  mlflow_bin <- Sys.which("mlflow")
  if (mlflow_bin != "") {
    return(mlflow_bin)
  }
  python_bin_dir <- dirname(python_bin())
  if (.Platform$OS.type == "windows") {
    file.path(python_bin_dir, "Scripts", "mlflow")
  } else {
    file.path(python_bin_dir, "mlflow")
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tracking-client.R]---
Location: mlflow-master/mlflow/R/mlflow/R/tracking-client.R

```text

new_mlflow_client <- function(tracking_uri) {
  UseMethod("new_mlflow_client")
}

new_mlflow_uri <- function(raw_uri) {
  # Special case 'databricks'
  if (identical(raw_uri, "databricks")) {
    raw_uri <- paste0("databricks", "://")
  }

  if (!grepl("://", raw_uri)) {
    raw_uri <- paste0("file://", raw_uri)
  }
  parts <- strsplit(raw_uri, "://")[[1]]
  structure(
    list(scheme = parts[1], path = parts[2]),
    class = c(paste("mlflow_", parts[1], sep = ""), "mlflow_uri")
  )
}

new_mlflow_client_impl <- function(get_host_creds, get_cli_env = list, class = character()) {
  structure(
    list(get_host_creds = get_host_creds,
         get_cli_env = get_cli_env
    ),
    class = c(class, "mlflow_client")
  )
}

new_mlflow_host_creds <- function(host = NA, username = NA, password = NA, token = NA,
                                   insecure = "False") {
  insecure_arg <- if (is.null(insecure) || is.na(insecure)) {
    "False"
  } else {
    list(true = "True", false = "False")[[tolower(insecure)]]
  }
  structure(
    list(host = host, username = username, password = password, token = token,
         insecure = insecure_arg),
    class = "mlflow_host_creds"
  )
}

#' @export
print.mlflow_host_creds <- function(x, ...) {
  mlflow_host_creds <- x
  args <- list(
    host = if (is.na(mlflow_host_creds$host)) {
      ""
    } else {
      paste ("host = ", mlflow_host_creds$host, sep = "")
    },
    username = if (is.na(mlflow_host_creds$username)) {
      ""
    } else {
      paste ("username = ", mlflow_host_creds$username, sep = "")
    },
    password = if (is.na(mlflow_host_creds$password)) {
      ""
    } else {
      "password = *****"
    },
    token = if (is.na(mlflow_host_creds$token)) {
      ""
    } else {
      "token = *****"
    },
    insecure = paste("insecure = ", as.character(mlflow_host_creds$insecure),
                     sep = ""),
    sep = ", "
  )
  cat("mlflow_host_creds( ")
  do.call(cat, args[args != ""])
  cat(")\n")
}

new_mlflow_client.mlflow_file <- function(tracking_uri) {
  path <- tracking_uri$path
  server_url <- if (!is.null(mlflow_local_server(path)$server_url)) {
    mlflow_local_server(path)$server_url
  } else {
    local_server <- mlflow_server(file_store = path, port = mlflow_connect_port())
    mlflow_register_local_server(tracking_uri = path, local_server = local_server)
    local_server$server_url
  }
  new_mlflow_client_impl(get_host_creds = function () {
    new_mlflow_host_creds(host = server_url)
  }, class = "mlflow_file_client")
}

new_mlflow_client.default <- function(tracking_uri) {
  stop(paste("Unsupported scheme: '", tracking_uri$scheme, "'", sep = ""))
}

get_env_var <- function(x) {
  new_name <- paste("MLFLOW_TRACKING_", x, sep = "")
  res <- Sys.getenv(new_name, NA)
  if (is.na(res)) {
    old_name <- paste("MLFLOW_", x, sep = "")
    res <- Sys.getenv(old_name, NA)
    if (!is.na(res)) {
      warning(paste("'", old_name, "' is deprecated. Please use '", new_name, "' instead."),
                    sepc = "" )
    }
  }
  res
}

basic_http_client <- function(tracking_uri) {
  host <- paste(tracking_uri$scheme, tracking_uri$path, sep = "://")
  get_host_creds <- function () {
    new_mlflow_host_creds(
      host = host,
      username = get_env_var("USERNAME"),
      password = get_env_var("PASSWORD"),
      token = get_env_var("TOKEN"),
      insecure = get_env_var("INSECURE")
    )
  }
  cli_env <- function() {
    creds <- get_host_creds()
    res <- list(
      MLFLOW_TRACKING_USERNAME = creds$username,
      MLFLOW_TRACKING_PASSWORD = creds$password,
      MLFLOW_TRACKING_TOKEN = creds$token,
      MLFLOW_TRACKING_INSECURE = creds$insecure
    )
    res[!is.na(res)]
  }
  new_mlflow_client_impl(get_host_creds, cli_env, class = "mlflow_http_client")
}

new_mlflow_client.mlflow_http <- function(tracking_uri) {
  basic_http_client(tracking_uri)
}

new_mlflow_client.mlflow_https <- function(tracking_uri) {
  basic_http_client(tracking_uri)
}

#' Initialize an MLflow Client
#'
#' Initializes and returns an MLflow client that communicates with the tracking server or store
#' at the specified URI.
#'
#' @param tracking_uri The tracking URI. If not provided, defaults to the service
#'  set by `mlflow_set_tracking_uri()`.
#' @export
mlflow_client <- function(tracking_uri = NULL) {
  tracking_uri <- new_mlflow_uri(tracking_uri %||% mlflow_get_tracking_uri())
  client <- new_mlflow_client(tracking_uri)
  if (inherits(client, "mlflow_file_client")) mlflow_validate_server(client)
  client
}
```

--------------------------------------------------------------------------------

---[FILE: tracking-experiments.R]---
Location: mlflow-master/mlflow/R/mlflow/R/tracking-experiments.R

```text
#' Create Experiment
#'
#' Creates an MLflow experiment and returns its id.
#'
#' @param name The name of the experiment to create.
#' @param artifact_location Location where all artifacts for this experiment are stored. If
#'   not provided, the remote server will select an appropriate default.
#' @param tags Experiment tags to set on the experiment upon experiment creation.
#' @template roxlate-client
#' @export
mlflow_create_experiment <- function(name, artifact_location = NULL, client = NULL, tags = NULL) {
  client <- resolve_client(client)
  name <- cast_string(name)

  tags <- if (!is.null(tags)) tags %>%
    purrr::imap(~ list(key = .y, value = .x)) %>%
    unname()

  response <- mlflow_rest(
    "experiments", "create",
    client = client, verb = "POST",
    data = list(
      name = name,
      artifact_location = artifact_location,
      tags = tags
    )
  )
  response$experiment_id
}

#' Search Experiments
#'
#' Search for experiments that satisfy specified criteria.
#'
#' @param filter A filter expression used to identify specific experiments.
#'   The syntax is a subset of SQL which allows only ANDing together binary operations.
#'   Examples: "attribute.name = 'MyExperiment'", "tags.problem_type = 'iris_regression'"
#' @param experiment_view_type Experiment view type. Only experiments matching this view type are
#'   returned.
#' @param order_by List of properties to order by. Example: "attribute.name".
#' @param max_results Maximum number of experiments to retrieve.
#' @param page_token Pagination token to go to the next page based on a
#'   previous query.
#' @template roxlate-client
#' @export
mlflow_search_experiments <- function(filter = NULL,
                                      experiment_view_type = c(
                                        "ACTIVE_ONLY", "DELETED_ONLY", "ALL"
                                      ),
                                      max_results = 1000,
                                      order_by = list(),
                                      page_token = NULL,
                                      client = NULL) {
  client <- resolve_client(client)
  experiment_view_type <- match.arg(experiment_view_type)
  response <- mlflow_rest("experiments", "search", client = client, verb = "POST", data = list(
    filter = filter,
    view_type = experiment_view_type,
    max_results = max_results,
    order_by = cast_string_list(order_by),
    page_token = page_token
  ))

  # Return `NULL` if no experiments
  if (!length(response)) return(NULL)
  experiments <- purrr::map(response$experiments, function(x) {
    x$tags <- parse_run_data(x$tags)
    tibble::as_tibble(x)
  }) %>%
    do.call(rbind, .)

  return(list(
    experiments=experiments,
    next_page_token = response$next_page_token
  ))
}

#' Set Experiment Tag
#'
#' Sets a tag on an experiment with the specified ID. Tags are experiment metadata that can be updated.
#'
#' @param key Name of the tag. All storage backends are guaranteed to support
#'   key values up to 250 bytes in size. This field is required.
#' @param value String value of the tag being logged. All storage backends are
#'   guaranteed to support key values up to 5000 bytes in size. This field is required.
#' @param experiment_id ID of the experiment.
#' @template roxlate-client
#' @export
mlflow_set_experiment_tag <- function(key, value, experiment_id = NULL, client = NULL) {
  key <- cast_string(key)
  value <- cast_string(value)
  client <- resolve_client(client)

  experiment_id <- resolve_experiment_id(experiment_id)
  experiment_id <- cast_string(experiment_id)
  response <- mlflow_rest("experiments", "set-experiment-tag", client = client, verb = "POST", data = list(
      experiment_id = experiment_id,
      key = key,
      value = value
  ))

  invisible(NULL)
}

#' Get Experiment
#'
#' Gets metadata for an experiment and a list of runs for the experiment. Attempts to obtain the
#' active experiment if both `experiment_id` and `name` are unspecified.
#'
#' @param experiment_id ID of the experiment.
#' @param name The experiment name. Only one of `name` or `experiment_id` should be specified.
#' @template roxlate-client
#' @export
mlflow_get_experiment <- function(experiment_id = NULL, name = NULL, client = NULL) {
  if (!is.null(name) && !is.null(experiment_id)) {
    stop("Only one of `name` or `experiment_id` should be specified.", call. = FALSE)
  }
  client <- resolve_client(client)
  response <- if (!is.null(name)) {
    mlflow_rest("experiments", "get-by-name",client = client,
                query = list(experiment_name = name))
  } else {
    experiment_id <- resolve_experiment_id(experiment_id)
    experiment_id <- cast_string(experiment_id)
    response <- mlflow_rest(
      "experiments", "get",
      client = client, query = list(experiment_id = experiment_id)
    )
  }
  response$experiment$tags <- parse_run_data(response$experiment$tags)
  response$experiment %>%
    new_mlflow_experiment()
}

#' Delete Experiment
#'
#' Marks an experiment and associated runs, params, metrics, etc. for deletion. If the
#'   experiment uses FileStore, artifacts associated with experiment are also deleted.
#'
#' @param experiment_id ID of the associated experiment. This field is required.
#' @template roxlate-client
#' @export
mlflow_delete_experiment <- function(experiment_id, client = NULL) {
  if (identical(experiment_id, mlflow_get_active_experiment_id()))
    stop("Cannot delete an active experiment.", call. = FALSE)

  client <- resolve_client(client)
  mlflow_rest(
    "experiments", "delete",
    verb = "POST", client = client,
    data = list(experiment_id = experiment_id)

  )
  invisible(NULL)
}



#' Restore Experiment
#'
#' Restores an experiment marked for deletion. This also restores associated metadata,
#'   runs, metrics, and params. If experiment uses FileStore, underlying artifacts
#'   associated with experiment are also restored.
#'
#' Throws `RESOURCE_DOES_NOT_EXIST` if the experiment was never created or was permanently deleted.
#'
#' @param experiment_id ID of the associated experiment. This field is required.
#' @template roxlate-client
#' @export
mlflow_restore_experiment <- function(experiment_id, client = NULL) {
  client <- resolve_client(client)
  mlflow_rest(
    "experiments", "restore",
    client = client, verb = "POST",
    data = list(experiment_id = experiment_id)
  )
  invisible(NULL)
}

#' Rename Experiment
#'
#' Renames an experiment.
#'
#' @template roxlate-client
#' @param experiment_id ID of the associated experiment. This field is required.
#' @param new_name The experiment's name will be changed to this. The new name must be unique.
#' @export
mlflow_rename_experiment <- function(new_name, experiment_id = NULL, client = NULL) {
  experiment_id <- resolve_experiment_id(experiment_id)

  client <- resolve_client(client)
  mlflow_rest(
    "experiments", "update",
    client = client, verb = "POST",
    data = list(
      experiment_id = experiment_id,
      new_name = new_name
    )
  )
  invisible(NULL)
}

#' Set Experiment
#'
#' Sets an experiment as the active experiment. Either the name or ID of the experiment can be provided.
#'   If the a name is provided but the experiment does not exist, this function creates an experiment
#'   with provided name. Returns the ID of the active experiment.
#'
#' @param experiment_name Name of experiment to be activated.
#' @param experiment_id ID of experiment to be activated.
#' @param artifact_location Location where all artifacts for this experiment are stored. If
#'   not provided, the remote server will select an appropriate default.
#' @export
mlflow_set_experiment <- function(experiment_name = NULL, experiment_id = NULL, artifact_location = NULL) {
  if (!is.null(experiment_name) && !is.null(experiment_id)) {
    stop("Only one of `experiment_name` or `experiment_id` should be specified.",
         call. = FALSE
    )
  }

  if (is.null(experiment_name) && is.null(experiment_id)) {
    stop("Exactly one of `experiment_name` or `experiment_id` should be specified.",
         call. = FALSE)
  }

  client <- mlflow_client()

  final_experiment_id <- if (!is.null(experiment_name)) {
    tryCatch(
      mlflow_id(mlflow_get_experiment(client = client, name = experiment_name)),
      error = function(e) {
        if (grep("RESOURCE_DOES_NOT_EXIST", e$message, fixed = TRUE)) {
          message("Experiment `", experiment_name, "` does not exist. Creating a new experiment.")
          mlflow_create_experiment(client = client, name = experiment_name, artifact_location = artifact_location)
        } else {
          stop(e)
        }
      }
    )
  } else {
    experiment_id
  }
  invisible(mlflow_set_active_experiment_id(final_experiment_id))
  return(final_experiment_id)
}
```

--------------------------------------------------------------------------------

---[FILE: tracking-globals.R]---
Location: mlflow-master/mlflow/R/mlflow/R/tracking-globals.R

```text
#' @include tracking-observer.R
NULL

mlflow_push_active_run_id <- function(run_id) {
  .globals$active_run_stack <- c(.globals$active_run_stack, run_id)
  mlflow_register_tracking_event("active_run_id", list(run_id = run_id))
}

mlflow_pop_active_run_id <- function() {
  .globals$active_run_stack <- .globals$active_run_stack[1:length(.globals$active_run_stack) - 1]
}

mlflow_get_active_run_id <- function() {
  if (length(.globals$active_run_stack) == 0) {
    NULL
  } else {
    .globals$active_run_stack[length(.globals$active_run_stack)]
  }
}

mlflow_set_active_experiment_id <- function(experiment_id) {
  .globals$active_experiment_id <- experiment_id
  mlflow_register_tracking_event(
    "active_experiment_id", list(experiment_id = experiment_id)
  )
}

mlflow_get_active_experiment_id <- function() {
  .globals$active_experiment_id
}

#' Set Remote Tracking URI
#'
#' Specifies the URI to the remote MLflow server that will be used
#' to track experiments.
#'
#' @param uri The URI to the remote MLflow server.
#'
#' @export
mlflow_set_tracking_uri <- function(uri) {
  .globals$tracking_uri <- uri
  mlflow_register_tracking_event("tracking_uri", list(uri = uri))

  invisible(uri)
}

#' Get Remote Tracking URI
#'
#' Gets the remote tracking URI.
#'
#' @export
mlflow_get_tracking_uri <- function() {
  .globals$tracking_uri %||% {
    env_uri <- Sys.getenv("MLFLOW_TRACKING_URI")
    if (nchar(env_uri)) env_uri else paste("file://", fs::path_abs("mlruns"), sep = "")
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tracking-observer.R]---
Location: mlflow-master/mlflow/R/mlflow/R/tracking-observer.R

```text
#' Register an external MLflow observer
#'
#' Registers an external MLflow observer that will receive a
#' `register_tracking_event(event_name, data)` callback on any model tracking
#' event such as "create_run", "delete_run", or "log_metric".
#' Each observer should have a `register_tracking_event(event_name, data)`
#' callback accepting a character vector `event_name` specifying the name of
#' the tracking event, and `data` containing a list of attributes of the event.
#' The callback should be non-blocking, and ideally should complete
#'  instantaneously. Any exception thrown from the callback will be ignored.
#'
#' @examples
#'
#' library(mlflow)
#'
#' observer <- structure(list())
#' observer$register_tracking_event <- function(event_name, data) {
#'   print(event_name)
#'   print(data)
#' }
#' mlflow_register_external_observer(observer)
#'
#' @param observer The observer object (see example)
#' @export
mlflow_register_external_observer <- function(observer) {
  observers <- getOption("MLflowObservers")
  observers <- append(observers, list(observer))
  options(MLflowObservers = observers)
}

# If one or more external observer(s) are present, then inform them of the
# event. Otherwise do nothing.
mlflow_register_tracking_event <- function(event_name, data) {
  observers <- getOption("MLflowObservers")
  if (length(observers) > 0) {
    lapply(
      observers,
      function(o) {
        tryCatch(
          o$register_tracking_event(event_name, data),
          error = function(e) { }
        )
      }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tracking-rest.R]---
Location: mlflow-master/mlflow/R/mlflow/R/tracking-rest.R

```text
mlflow_rest_path <- function(version) {
  switch(
    version,
    "2.0" = "api/2.0/mlflow"
  )
}

mlflow_rest_timeout <- function() {
  httr::timeout(getOption("mlflow.rest.timeout", 60))
}

try_parse_response_as_text <- function(response) {
  raw_content <- httr::content(response, type = "raw")
  tryCatch({
    rawToChar(raw_content)
  }, error = function(e) {
    do.call(paste, as.list(raw_content))
  })
}

#' @importFrom base64enc base64encode
get_rest_config <- function(host_creds) {
  headers <- list()
  auth_header <- if (!is.na(host_creds$username) && !is.na(host_creds$password)) {
    basic_auth_str <- paste(host_creds$username, host_creds$password, sep = ":")
    paste("Basic", base64encode(charToRaw(basic_auth_str)), sep = " ")
  } else if (!is.na(host_creds$token)) {
    paste("Bearer", host_creds$token, sep = " ")
  } else {
    NA
  }
  if (!is.na(auth_header)) {
    headers$Authorization <- auth_header
  }
  headers$`User-Agent` <- paste("mlflow-r-client", utils::packageVersion("mlflow"), sep = "/")
  is_insecure <- as.logical(host_creds$insecure)
  list(
    headers = headers,
    config = if (is_insecure) {
      httr::config(ssl_verifypeer = 0, ssl_verifyhost = 0)
    } else {
      list()
    }
  )
}

mlflow_rest <- function( ..., client, query = NULL, data = NULL, verb = "GET", version = "2.0",
                         max_rate_limit_interval=60) {
  host_creds <- client$get_host_creds()
  rest_config <- get_rest_config(host_creds)
  args <- list(...)
  api_url <- file.path(
    host_creds$host,
    mlflow_rest_path(version),
    paste(args, collapse = "/")
  )
  req_headers <- do.call(httr::add_headers, rest_config$headers)
  get_response <- switch(
    verb,
    GET = function() {
      httr::GET( api_url, query = query, mlflow_rest_timeout(), config = rest_config$config,
           req_headers)
    },
    POST = function(){
      httr::POST( api_url,
            body = if (is.null(data)) NULL else rapply(data, as.character, how = "replace"),
            encode = "json",
            mlflow_rest_timeout(),
            config = rest_config$config,
            req_headers
      )
    },
    PATCH = function(){
      httr::PATCH( api_url,
            body = if (is.null(data)) NULL else rapply(data, as.character, how = "replace"),
            encode = "json",
            mlflow_rest_timeout(),
            config = rest_config$config,
            req_headers
      )
    },
    DELETE = function() {
      httr::DELETE(api_url,
              body = if (is.null(data)) NULL else rapply(data, as.character, how = "replace"),
              encode = "json",
              mlflow_rest_timeout(),
              config = rest_config$config,
              req_headers
      )
    },
    stop("Verb '", verb, "' is unsupported.", call. = FALSE)
  )
  sleep_for <- 1
  time_left <- max_rate_limit_interval
  response <- get_response()
  while (response$status_code == 429 && time_left > 0) {
    time_left <- time_left - sleep_for
    warning(paste("Request returned with status code 429 (Rate limit exceeded). Retrying after ",
                  sleep_for, " seconds. Will continue to retry 429s for up to ", time_left,
                  " second.", sep = ""))
    Sys.sleep(sleep_for)
    sleep_for <- min(time_left, sleep_for * 2)
    response <- get_response()
  }

  if (response$status_code != 200) {
    message_body <- tryCatch(
      paste(httr::content(response, "parsed", type = "application/json"), collapse = "; "),
      error = function(e) {
        try_parse_response_as_text(response)
      }
    )
    msg <- paste("API request to endpoint '",
                 paste(args, collapse = "/"),
                 "' failed with error code ",
                 response$status_code,
                 ". Reponse body: '",
                 message_body,
                 "'",
                 sep = "")
    stop(msg, call. = FALSE)
  }
  text <- httr::content(response, "text", encoding = "UTF-8")
  jsonlite::fromJSON(text, simplifyVector = FALSE)
}
```

--------------------------------------------------------------------------------

````

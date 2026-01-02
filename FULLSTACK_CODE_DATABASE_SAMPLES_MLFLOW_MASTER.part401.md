---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 401
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 401 of 991)

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

---[FILE: tracking-runs.R]---
Location: mlflow-master/mlflow/R/mlflow/R/tracking-runs.R

```text
#' @include tracking-globals.R
NULL

# Translate metric to value to safe format for REST.
metric_value_to_rest <- function(value) {
  if (is.nan(value)) {
    as.character(NaN)
  } else if (is.infinite(value) && value > 0) {
    "Infinity"
  } else if (is.infinite(value) && value < 0) {
    "-Infinity"
  } else {
    as.character(value)
  }
}

#' Log Metric
#'
#' Logs a metric for a run. Metrics key-value pair that records a single float measure.
#'   During a single execution of a run, a particular metric can be logged several times.
#'   The MLflow Backend keeps track of historical metric values along two axes: timestamp and step.
#'
#' @param key Name of the metric.
#' @param value Float value for the metric being logged.
#' @param timestamp Timestamp at which to log the metric. Timestamp is rounded to the nearest
#'  integer. If unspecified, the number of milliseconds since the Unix epoch is used.
#' @param step Step at which to log the metric. Step is rounded to the nearest integer. If
#'  unspecified, the default value of zero is used.
#' @template roxlate-run-id
#' @template roxlate-client
#' @export
mlflow_log_metric <- function(key, value, timestamp = NULL, step = NULL, run_id = NULL,
                              client = NULL) {
  c(client, run_id) %<-% resolve_client_and_run_id(client, run_id)
  key <- cast_string(key)
  value <- cast_scalar_double(value, allow_na = TRUE)
  # convert Inf to 'Infinity'
  value <- metric_value_to_rest(value)
  timestamp <- cast_nullable_scalar_double(timestamp)
  timestamp <- round(timestamp %||% current_time())
  step <- round(cast_nullable_scalar_double(step) %||% 0)
  data <- list(
    run_uuid = run_id,
    run_id = run_id,
    key = key,
    value = value,
    timestamp = timestamp,
    step = step
  )
  mlflow_rest("runs", "log-metric", client = client, verb = "POST", data = data)
  mlflow_register_tracking_event("log_metric", data)

  invisible(value)
}

mlflow_create_run <- function(start_time = NULL, tags = NULL, experiment_id = NULL, client) {
  experiment_id <- resolve_experiment_id(experiment_id)

  # Read user_id from tags
  # user_id is deprecated and will be removed from a future release
  user_id <- tags[[MLFLOW_TAGS$MLFLOW_USER]] %||% "unknown"

  tags <- if (!is.null(tags)) tags %>%
    purrr::imap(~ list(key = .y, value = .x)) %>%
    unname()

  start_time <- start_time %||% current_time()

  data <- list(
    experiment_id = experiment_id,
    user_id = user_id,
    start_time = start_time,
    tags = tags
  )
  response <- mlflow_rest(
    "runs", "create", client = client, verb = "POST", data = data
  )
  run_id <- response$run$info$run_uuid
  data$run_id <- run_id
  mlflow_register_tracking_event("create_run", data)

  mlflow_get_run(run_id = run_id, client = client)
}

#' Delete a Run
#'
#' Deletes the run with the specified ID.
#' @template roxlate-client
#' @template roxlate-run-id
#' @export
mlflow_delete_run <- function(run_id, client = NULL) {
  run_id <- cast_string(run_id)
  if (identical(run_id, mlflow_get_active_run_id()))
    stop("Cannot delete an active run.", call. = FALSE)
  client <- resolve_client(client)
  data <- list(run_id = run_id)
  mlflow_rest("runs", "delete", client = client, verb = "POST", data = data)
  mlflow_register_tracking_event("delete_run", data)
  invisible(NULL)
}

#' Restore a Run
#'
#' Restores the run with the specified ID.
#' @template roxlate-client
#' @template roxlate-run-id
#' @export
mlflow_restore_run <- function(run_id, client = NULL) {
  run_id <- cast_string(run_id)
  client <- resolve_client(client)
  data <- list(run_id = run_id)
  mlflow_rest("runs", "restore", client = client, verb = "POST", data = data)
  mlflow_register_tracking_event("restore_run", data)

  mlflow_get_run(run_id, client = client)
}

#' Get Run
#'
#' Gets metadata, params, tags, and metrics for a run. Returns a single value for each metric
#' key: the most recently logged metric value at the largest step.
#'
#' @template roxlate-run-id
#' @template roxlate-client
#' @export
mlflow_get_run <- function(run_id = NULL, client = NULL) {
  run_id <- resolve_run_id(run_id)
  client <- resolve_client(client)
  response <- mlflow_rest(
    "runs", "get",
    client = client, verb = "GET",
    query = list(run_uuid = run_id, run_id = run_id)
  )
  parse_run(response$run)
}

#' Log Batch
#'
#' Log a batch of metrics, params, and/or tags for a run. The server will respond with an error (non-200 status code)
#'   if any data failed to be persisted. In case of error (due to internal server error or an invalid request), partial
#'   data may be written.
#' @template roxlate-client
#' @template roxlate-run-id
#' @param metrics A dataframe of metrics to log, containing the following columns: "key", "value",
#'  "step", "timestamp". This dataframe cannot contain any missing ('NA') entries.
#' @param params A dataframe of params to log, containing the following columns: "key", "value".
#'  This dataframe cannot contain any missing ('NA') entries.
#' @param tags A dataframe of tags to log, containing the following columns: "key", "value".
#'  This dataframe cannot contain any missing ('NA') entries.
#' @export
mlflow_log_batch <- function(metrics = NULL, params = NULL, tags = NULL, run_id = NULL,
                             client = NULL) {
  validate_batch_input("metrics", metrics, c("key", "value", "step", "timestamp"))
  metrics$value <- unlist(lapply(metrics$value, metric_value_to_rest))
  validate_batch_input("params", params, c("key", "value"))
  validate_batch_input("tags", tags, c("key", "value"))

  c(client, run_id) %<-% resolve_client_and_run_id(client, run_id)

  data <- list(
    run_id = run_id,
    metrics = metrics,
    params = params,
    tags = tags
  )
  mlflow_rest("runs", "log-batch", client = client, verb = "POST", data = data)
  mlflow_register_tracking_event("log_batch", data)

  invisible(NULL)
}

has_nas <- function(df) {
  any(is.na(df[, which(names(df) != "value")])) ||
  any(is.na(df$value) & !is.nan(df$value))
}

validate_batch_input <- function(input_type, input_dataframe, expected_column_names) {
  if (is.null(input_dataframe)) {
    return()
  } else if (!setequal(names(input_dataframe), expected_column_names)) {
    msg <- paste(input_type,
                 " batch input dataframe must contain exactly the following columns: ",
                 paste(expected_column_names, collapse = ", "),
                 ". Found: ",
                 paste(names(input_dataframe), collapse = ", "),
                 sep = "")
    stop(msg, call. = FALSE)
  } else if (has_nas(input_dataframe)) {
    msg <- paste(input_type,
                 " batch input dataframe contains a missing ('NA') entry.",
                 sep = "")
    stop(msg, call. = FALSE)
  }
}

#' Set Tag
#'
#' Sets a tag on a run. Tags are run metadata that can be updated during a run and
#'  after a run completes.
#'
#' @param key Name of the tag. Maximum size is 255 bytes. This field is required.
#' @param value String value of the tag being logged. Maximum size is 500 bytes. This field is required.
#' @template roxlate-run-id
#' @template roxlate-client
#' @export
mlflow_set_tag <- function(key, value, run_id = NULL, client = NULL) {
  c(client, run_id) %<-% resolve_client_and_run_id(client, run_id)

  key <- cast_string(key)
  value <- cast_string(value)

  data <- list(
    run_uuid = run_id,
    run_id = run_id,
    key = key,
    value = value
  )
  mlflow_rest("runs", "set-tag", client = client, verb = "POST", data = data)
  mlflow_register_tracking_event("set_tag", data)

  invisible(NULL)
}

#' Delete Tag
#'
#' Deletes a tag on a run. This is irreversible. Tags are run metadata that can be updated during a run and
#'  after a run completes.
#'
#' @param key Name of the tag. Maximum size is 255 bytes. This field is required.
#' @template roxlate-run-id
#' @template roxlate-client
#' @export
mlflow_delete_tag <- function(key, run_id = NULL, client = NULL) {
  c(client, run_id) %<-% resolve_client_and_run_id(client, run_id)

  key <- cast_string(key)

  data <- list(run_id = run_id, key = key)
  mlflow_rest("runs", "delete-tag", client = client, verb = "POST", data = data)
  mlflow_register_tracking_event("delete_tag", data)

  invisible(NULL)
}

#' Log Parameter
#'
#' Logs a parameter for a run. Examples are params and hyperparams
#'   used for ML training, or constant dates and values used in an ETL pipeline.
#'   A param is a STRING key-value pair. For a run, a single parameter is allowed
#'   to be logged only once.
#'
#' @param key Name of the parameter.
#' @param value String value of the parameter.
#' @template roxlate-run-id
#' @template roxlate-client
#' @export
mlflow_log_param <- function(key, value, run_id = NULL, client = NULL) {
  c(client, run_id) %<-% resolve_client_and_run_id(client, run_id)

  key <- cast_string(key)
  value <- cast_string(value, allow_na = TRUE)
  value <- ifelse(is.na(value), "NA", value)

  data <- list(
    run_uuid = run_id,
    run_id = run_id,
    key = key,
    value = value
  )
  mlflow_rest("runs", "log-parameter", client = client, verb = "POST", data = data)
  mlflow_register_tracking_event("log_param", data)

  invisible(value)
}

paged_metric_history_request <- function(client, run_id, metric_key, page_token = NULL) {
  response <- mlflow_rest(
    "metrics", "get-history",
    client = client, verb = "GET",
    query = list(run_uuid = run_id,
                 run_id = run_id,
                 metric_key = metric_key,
                 max_results = 25000,
                 page_token = page_token)
  )
  response
}

paged_metric_history_to_dataframe <- function(metrics) {
  metrics %>%
    purrr::transpose() %>%
    purrr::map(unlist) %>%
    purrr::map_at("timestamp", milliseconds_to_date) %>%
    purrr::map_at("step", as.double) %>%
    tibble::as_tibble()
}

#' Get Metric History
#'
#' Get a list of all values for the specified metric for a given run.
#'
#' @template roxlate-run-id
#' @template roxlate-client
#' @param metric_key Name of the metric.
#'
#' @export
mlflow_get_metric_history <- function(metric_key, run_id = NULL, client = NULL) {
  run_id <- resolve_run_id(run_id)
  client <- resolve_client(client)

  metric_key <- cast_string(metric_key)
  response <- paged_metric_history_request(client, run_id, metric_key)
  history <- paged_metric_history_to_dataframe(response$metrics)
  next_token <- response$next_page_token

  # Handle client-side pagination if a next_page_token is returned
  while (!is.null(next_token)) {
    next_page <- paged_metric_history_request(
      client, run_id,
      metric_key, next_token
    )
    next_token <- next_page$next_page_token
    next_page_metrics <- paged_metric_history_to_dataframe(next_page$metrics)
    history <- rbind(history, next_page_metrics)
  }
  history
}

#' Search Runs
#'
#' Search for runs that satisfy expressions. Search expressions can use Metric and Param keys.
#'
#' @template roxlate-client
#' @param experiment_ids List of string experiment IDs (or a single string experiment ID) to search
#' over. Attempts to use active experiment if not specified.
#' @param filter A filter expression over params, metrics, and tags, allowing returning a subset
#'   of runs. The syntax is a subset of SQL which allows only ANDing together binary operations
#'   between a param/metric/tag and a constant.
#' @param run_view_type Run view type.
#' @param order_by List of properties to order by. Example: "metrics.acc DESC".
#'
#' @export
mlflow_search_runs <- function(filter = NULL,
                               run_view_type = c("ACTIVE_ONLY", "DELETED_ONLY", "ALL"),
                               experiment_ids = NULL,
                               order_by = list(),
                               client = NULL) {
  experiment_ids <- resolve_experiment_id(experiment_ids)
  # If we get back a single experiment ID, e.g. the active experiment ID, convert it to a list
  if (is.atomic(experiment_ids)) {
    experiment_ids <- list(experiment_ids)
  }
  client <- resolve_client(client)

  run_view_type <- match.arg(run_view_type)
  experiment_ids <- cast_string_list(experiment_ids)
  filter <- cast_nullable_string(filter)

  response <- mlflow_rest("runs", "search", client = client, verb = "POST", data = list(
    experiment_ids = experiment_ids,
    filter = filter,
    run_view_type = run_view_type,
    order_by = cast_string_list(order_by)
  ))

  runs_list <- response$run %>%
    purrr::map(parse_run)
  do.call("rbind", runs_list) %||% data.frame()
}

#' List Artifacts
#'
#' Gets a list of artifacts.
#'
#' @template roxlate-client
#' @template roxlate-run-id
#' @param path The run's relative artifact path to list from. If not specified, it is
#'  set to the root artifact path
#'
#' @export
mlflow_list_artifacts <- function(path = NULL, run_id = NULL, client = NULL) {
  run_id <- resolve_run_id(run_id)
  client <- resolve_client(client)

  response <-   mlflow_rest(
    "artifacts", "list",
    client = client, verb = "GET",
    query = list(
      run_uuid = run_id,
      run_id = run_id,
      path = path
    )
  )

  message(glue::glue("Root URI: {uri}", uri = response$root_uri))

  files_list <- if (!is.null(response$files)) response$files else list()
  files_list <- purrr::map(files_list, function(file_info) {
    if (is.null(file_info$file_size)) {
      file_info$file_size <- NA
    }
    file_info
  })
  files_list %>%
    purrr::transpose() %>%
    purrr::map(unlist) %>%
    tibble::as_tibble()
}

mlflow_set_terminated <- function(status, end_time, run_id, client) {
  data <- list(
    run_uuid = run_id,
    run_id = run_id,
    status = status,
    end_time = end_time
  )
  response <- mlflow_rest("runs", "update", verb = "POST", client = client, data = data)
  mlflow_register_tracking_event("set_terminated", data)

  mlflow_get_run(client = client, run_id = response$run_info$run_uuid)
}

#' Download Artifacts
#'
#' Download an artifact file or directory from a run to a local directory if applicable,
#'   and return a local path for it.
#'
#' @template roxlate-client
#' @template roxlate-run-id
#' @param path Relative source path to the desired artifact.
#' @export
mlflow_download_artifacts <- function(path, run_id = NULL, client = NULL) {
  run_id <- resolve_run_id(run_id)
  client <- resolve_client(client)
  result <- mlflow_cli(
    "artifacts", "download",
    "--run-id", run_id,
    "--artifact-path", path,
    echo = FALSE,
    stderr_callback = function(x, p) {
      if (grepl("FileNotFoundError", x)) {
        stop(
          gsub("(.|\n)*(?=FileNotFoundError)", "", x, perl = TRUE),
          call. = FALSE
        )
      }
    },
    client = client
  )
  gsub("\n", "", result$stdout)
}

# ' Download Artifacts from URI.
mlflow_download_artifacts_from_uri <- function(artifact_uri, client = mlflow_client()) {
  result <- mlflow_cli("artifacts", "download", "-u", artifact_uri, echo = FALSE, client = client)
  # NB: The return type from the artifacts download instruction from the cli can be either
  # a path as a "string" (character vector in R with length of 1) or as a string with a newline
  # ("\n") character separating the source runs:/ path and the local path that is the destination
  # directory. Due to this alternate behavior based on whether the download artifact progress logic
  # is enabled or not, this conditional logic is required.
  paths <- strsplit(result$stdout, "\n")[[1]]
  if (length(paths) > 1) {
    trimws(paths[-1])
  } else if (length(paths) == 1) {
    trimws(paths[1])
  } else {
    stop("Unknown return type after newline split parsing", class(paths),
         ". Expected character type return from cli download artifacts call.", call. = FALSE)
  }
}

#' Log Artifact
#'
#' Logs a specific file or directory as an artifact for a run.
#'
#' @param path The file or directory to log as an artifact.
#' @param artifact_path Destination path within the run's artifact URI.
#' @template roxlate-client
#' @template roxlate-run-id
#'
#' @details
#'
#' When logging to Amazon S3, ensure that you have the s3:PutObject, s3:GetObject,
#' s3:ListBucket, and s3:GetBucketLocation permissions on your bucket.
#'
#' Additionally, at least the \code{AWS_ACCESS_KEY_ID} and \code{AWS_SECRET_ACCESS_KEY}
#' environment variables must be set to the corresponding key and secrets provided
#' by Amazon IAM.
#'
#' @export
mlflow_log_artifact <- function(path, artifact_path = NULL, run_id = NULL, client = NULL) {
  c(client, run_id) %<-% resolve_client_and_run_id(client, run_id)
  artifact_param <- NULL
  if (!is.null(artifact_path)) artifact_param <- "--artifact-path"

  if (as.logical(fs::is_file(path))) {
    command <- "log-artifact"
    local_param <- "--local-file"
  } else {
    command <- "log-artifacts"
    local_param <- "--local-dir"
  }

  mlflow_cli("artifacts",
             command,
             local_param,
             path,
             artifact_param,
             artifact_path,
             "--run-id",
             run_id,
             client = client
  )

  invisible(mlflow_list_artifacts(run_id = run_id, path = artifact_path, client = client))
}

# Record logged model metadata with the tracking server.
mlflow_record_logged_model <- function(model_spec, run_id = NULL, client = NULL) {
  c(client, run_id) %<-% resolve_client_and_run_id(client, run_id)
  mlflow_rest("runs", "log-model", client = client, verb = "POST", data = list(
    run_id = run_id,
    model_json = jsonlite::toJSON(model_spec, auto_unbox = TRUE)
  ))
}

#' Start Run
#'
#' Starts a new run. If `client` is not provided, this function infers contextual information such as
#'   source name and version, and also registers the created run as the active run. If `client` is provided,
#'   no inference is done, and additional arguments such as `start_time` can be provided.
#'
#' @param run_id If specified, get the run with the specified UUID and log metrics
#'   and params under that run. The run's end time is unset and its status is set to
#'   running, but the run's other attributes remain unchanged.
#' @param experiment_id Used only when `run_id` is unspecified. ID of the experiment under
#'   which to create the current run. If unspecified, the run is created under
#'   a new experiment with a randomly generated name.
#' @param start_time Unix timestamp of when the run started in milliseconds. Only used when `client` is specified.
#' @param tags Additional metadata for run in key-value pairs. Only used when `client` is specified.
#' @param nested Controls whether the run to be started is nested in a parent run. `TRUE` creates a nest run.
#' @template roxlate-client
#'
#' @examples
#' \dontrun{
#' with(mlflow_start_run(), {
#'   mlflow_log_metric("test", 10)
#' })
#' }
#'
#' @export
mlflow_start_run <- function(run_id = NULL, experiment_id = NULL,
                             start_time = NULL, tags = NULL,
                             client = NULL, nested = FALSE) {

  # When `client` is provided, this function acts as a wrapper for `runs/create` and does not register
  #  an active run.
  if (!is.null(client)) {
    if (!is.null(run_id))
        stop("`run_id` should not be specified when `client` is specified.", call. = FALSE)
    run <- mlflow_create_run(client = client, start_time = start_time,
                             tags = tags, experiment_id = experiment_id)
    return(run)
  }

  # Fluent mode, check to see if extraneous params passed.

  if (!is.null(start_time))
    stop("`start_time` should only be specified when `client` is specified.", call. = FALSE)
  if (!is.null(tags))
    stop("`tags` should only be specified when `client` is specified.", call. = FALSE)

  active_run_id <- mlflow_get_active_run_id()
  if (!is.null(active_run_id) && !nested) {
    stop("Run with UUID ",
         active_run_id,
         " is already active. To start a nested run, Call `mlflow_start_run()` with `nested = TRUE`.",
         call. = FALSE
    )
  }

  existing_run_id <- run_id %||% {
    env_run_id <- Sys.getenv("MLFLOW_RUN_ID")
    if (nchar(env_run_id)) env_run_id
  }

  client <- mlflow_client()

  run <- if (!is.null(existing_run_id)) {
    # This is meant to pick up existing run when we're inside `mlflow_source()` called via `mlflow run`.
    mlflow_get_run(client = client, run_id = existing_run_id)
  } else {
    experiment_id <- mlflow_infer_experiment_id(experiment_id)
    client <- mlflow_client()

    args <- mlflow_get_run_context(
      client,
      experiment_id = experiment_id
    )
    do.call(mlflow_create_run, args)
  }
  mlflow_push_active_run_id(mlflow_id(run))
  mlflow_set_experiment(experiment_id = run$experiment_id)
  run
}

mlflow_get_run_context <- function(client, ...) {
  UseMethod("mlflow_get_run_context")
}

mlflow_get_run_context.default <- function(client, experiment_id, ...) {
  tags <- list()
  tags[[MLFLOW_TAGS$MLFLOW_USER]] <- mlflow_user()
  tags[[MLFLOW_TAGS$MLFLOW_SOURCE_NAME]] <- get_source_name()
  tags[[MLFLOW_TAGS$MLFLOW_SOURCE_VERSION]] <- get_source_version()
  tags[[MLFLOW_TAGS$MLFLOW_SOURCE_TYPE]] <- MLFLOW_SOURCE_TYPE$LOCAL
  parent_run_id <- mlflow_get_active_run_id()
  if (!is.null(parent_run_id)) {
    # create a tag containing the parent run ID so that MLflow UI can display
    # nested runs properly
    tags[[MLFLOW_TAGS$MLFLOW_PARENT_RUN_ID]] <- parent_run_id
  }
  list(
    client = client,
    tags = tags,
    experiment_id = experiment_id %||% 0,
    ...
  )
}

#' End a Run
#'
#' Terminates a run. Attempts to end the current active run if `run_id` is not specified.
#'
#' @param status Updated status of the run. Defaults to `FINISHED`. Can also be set to
#' "FAILED" or "KILLED".
#' @param end_time Unix timestamp of when the run ended in milliseconds.
#' @template roxlate-run-id
#' @template roxlate-client
#'
#' @export
mlflow_end_run <- function(status = c("FINISHED", "FAILED", "KILLED"),
                           end_time = NULL, run_id = NULL, client = NULL) {

  status <- match.arg(status)
  end_time <- end_time %||% current_time()

  active_run_id <- mlflow_get_active_run_id()

  if (!is.null(client) && is.null(run_id))
    stop("`run_id` must be specified when `client` is specified.", call. = FALSE)

  run <- if (!is.null(run_id)) {
    client <- resolve_client(client)
    mlflow_set_terminated(client = client, run_id = run_id, status = status,
                          end_time = end_time)
  } else {
    if (is.null(active_run_id)) stop("There is no active run to end.", call. = FALSE)
    client <- mlflow_client()
    run_id <- active_run_id
    mlflow_set_terminated(client = client, run_id = active_run_id, status = status,
                          end_time = end_time)
  }

  if (identical(run_id, active_run_id)) mlflow_pop_active_run_id()
  run
}

MLFLOW_TAGS <- list(
  MLFLOW_USER = "mlflow.user",
  MLFLOW_SOURCE_NAME = "mlflow.source.name",
  MLFLOW_SOURCE_VERSION = "mlflow.source.version",
  MLFLOW_SOURCE_TYPE = "mlflow.source.type",
  MLFLOW_PARENT_RUN_ID = "mlflow.parentRunId"
)
```

--------------------------------------------------------------------------------

---[FILE: tracking-server.R]---
Location: mlflow-master/mlflow/R/mlflow/R/tracking-server.R

```text
#' @importFrom httpuv startDaemonizedServer
#' @importFrom httpuv stopServer
mlflow_port_available <- function(port) {
  tryCatch({
    handle <- httpuv::startDaemonizedServer("127.0.0.1", port, list())
    httpuv::stopServer(handle)
    TRUE
  }, error = function(e) {
    FALSE
  })
}

#' @importFrom openssl rand_num
mlflow_connect_port <- function() {
  port <- getOption(
    "mlflow.port",
    NULL
  )

  retries <- getOption("mlflow.port.retries", 10)
  while (is.null(port) && retries > 0) {
    port <- floor(5000 + rand_num(1) * 1000)
    if (!mlflow_port_available(port)) {
      port <- NULL
    }

    retries <- retries - 1
  }

  port
}

mlflow_cli_param <- function(args, param, value) {
  if (!is.null(value)) {
    args <- c(
      args,
      param,
      value
    )
  }

  args
}

#' Run MLflow Tracking Server
#'
#' Wrapper for `mlflow server`.
#'
#' @param file_store The root of the backing file store for experiment and run data.
#' @param default_artifact_root Local or S3 URI to store artifacts in, for newly created experiments.
#' @param host The network address to listen on (default: 127.0.0.1).
#' @param port The port to listen on (default: 5000).
#' @param workers Number of gunicorn worker processes to handle requests (default: 4).
#' @param static_prefix A prefix which will be prepended to the path of all static paths.
#' @param serve_artifacts A flag specifying whether or not to enable artifact serving (default: FALSE).
#' @export
mlflow_server <- function(file_store = "mlruns", default_artifact_root = NULL,
                          host = "127.0.0.1", port = 5000, workers = NULL, static_prefix = NULL,
                          serve_artifacts = FALSE) {
  file_store <- fs::path_abs(file_store)
  if (.Platform$OS.type == "windows") file_store <- paste0("file://", file_store)

  args <- mlflow_cli_param(list(), "--port", port) %>%
    mlflow_cli_param("--backend-store-uri", file_store) %>%
    mlflow_cli_param("--default-artifact-root", default_artifact_root) %>%
    mlflow_cli_param("--host", host) %>%
    mlflow_cli_param("--port", port) %>%
    mlflow_cli_param("--static-prefix", static_prefix) %>%
    append(if (serve_artifacts) "--serve-artifacts" else "--no-serve-artifacts")

  if (.Platform$OS.type != "windows") {
    workers <- workers %||% 4
    args <- args %>% mlflow_cli_param("--workers", workers)
  }

  mlflow_verbose_message("MLflow starting: http://", host, ":", port)

  handle <- do.call(
    "mlflow_cli",
    c(
      "server",
      args,
      list(
        background = getOption("mlflow.ui.background", TRUE),
        client = NULL
      )
    )
  )

  server_url <- getOption("mlflow.ui", paste(host, port, sep = ":"))
  new_mlflow_server(server_url, handle, file_store = file_store)
}

new_mlflow_server <- function(server_url, handle, ...) {
  ms <- structure(
    list(
      server_url = if (startsWith(server_url, "http")) server_url else paste0("http://", server_url),
      handle = handle,
      ...
    ),
    class = "mlflow_server"
  )
  ms
}

mlflow_validate_server <- function(client) {
  wait_for(
    function() mlflow_rest(
      "experiments",
      "search",
      client = client,
      verb = "POST",
      data = list(
        max_results = 1
      )
    ),
    getOption("mlflow.connect.wait", 10),
    getOption("mlflow.connect.sleep", 1)
  )
}

mlflow_register_local_server <- function(tracking_uri, local_server) {
  .globals$url_mapping[[tracking_uri]] <- local_server
}

mlflow_local_server <- function(tracking_uri) {
  .globals$url_mapping[[tracking_uri]]
}
```

--------------------------------------------------------------------------------

---[FILE: tracking-ui.R]---
Location: mlflow-master/mlflow/R/mlflow/R/tracking-ui.R

```text
#' @importFrom utils browseURL
mlflow_view_url <- function(url) {
  getOption("page_viewer", browseURL)(url)

  invisible(url)
}

#' Run MLflow User Interface
#'
#' Launches the MLflow user interface.
#'
#' @examples
#' \dontrun{
#' library(mlflow)
#'
#' # launch mlflow ui locally
#' mlflow_ui()
#'
#' # launch mlflow ui for existing mlflow server
#' mlflow_set_tracking_uri("http://tracking-server:5000")
#' mlflow_ui()
#' }
#'
#' @template roxlate-client
#' @param ... Optional arguments passed to `mlflow_server()` when `x` is a path to a file store.
#' @export
mlflow_ui <- function(client, ...) {
  UseMethod("mlflow_ui")
}

#' @export
mlflow_ui.mlflow_client <- function(client, ...) {
  mlflow_view_url(client$get_host_creds()$host)
}

#' @export
mlflow_ui.NULL <- function(client, ...) {
  client <- mlflow_client()
  mlflow_ui(client)
}
```

--------------------------------------------------------------------------------

---[FILE: tracking-utils.R]---
Location: mlflow-master/mlflow/R/mlflow/R/tracking-utils.R

```text
mlflow_relative_paths <- function(paths) {
  gsub(paste0("^", file.path(getwd(), "")), "", paths)
}

get_executing_file_name <- function() {
  pattern <- "^--file="
  v <- grep(pattern, commandArgs(), value = TRUE)
  file_name <- gsub(pattern, "", v)
  if (length(file_name)) file_name
}

get_source_name <- function() {
  get_executing_file_name() %||% "<console>"
}

get_source_version <- function() {
  file_name <- get_executing_file_name()
  tryCatch(
    error = function(cnd) NULL,
    {
      repo <- git2r::repository(file_name, discover = TRUE)
      commit <- git2r::commits(repo, n = 1)
      commit[[1]]@sha
    }
  )
}

mlflow_get_active_run_id_or_start_run <- function() {
  mlflow_get_active_run_id() %||% mlflow_id(mlflow_start_run())
}


mlflow_get_experiment_id_from_env <- function(client = mlflow_client()) {
  name <- Sys.getenv("MLFLOW_EXPERIMENT_NAME", unset = NA)
  if (!is.na(name)) {
    mlflow_get_experiment(client = client, name = name)$experiment_id
  } else {
    id <- Sys.getenv("MLFLOW_EXPERIMENT_ID", unset = NA)
    if (is.na(id)) NULL else id
  }
}

mlflow_infer_experiment_id <- function(experiment_id = NULL) {
  experiment_id %||% mlflow_get_active_experiment_id() %||% mlflow_get_experiment_id_from_env()
}

#' @export
with.mlflow_run <- function(data, expr, ...) {
  run_id <- mlflow_id(data)
  if (!identical(run_id, mlflow_get_active_run_id())) {
    stop("`with()` should only be used with `mlflow_start_run()`.", call. = FALSE)
  }

  tryCatch(
    {
      force(expr)
      mlflow_end_run()
    },
    error = function(cnd) {
      message(cnd)
      mlflow_end_run(status = "FAILED")
    },
    interrupt = function(cnd) mlflow_end_run(status = "KILLED")
  )

  invisible(NULL)
}

current_time <- function() {
  round(as.numeric(Sys.time()) * 1000)
}

milliseconds_to_date <- function(x) as.POSIXct(as.double(x) / 1000, origin = "1970-01-01")

tidy_run_info <- function(run_info) {
  df <- as.data.frame(run_info, stringsAsFactors = FALSE)
  df$start_time <- milliseconds_to_date(df$start_time %||% NA)
  df$end_time <- milliseconds_to_date(df$end_time %||% NA)
  df
}

wait_for <- function(f, wait, sleep) {
  command_start <- Sys.time()

  success <- FALSE
  while (!success && Sys.time() < command_start + wait) {
    success <- suppressWarnings({
      tryCatch({
        f()
        TRUE
      }, error = function(err) {
        FALSE
      })
    })

    if (!success) Sys.sleep(sleep)
  }

  if (!success) {
    stop("Operation failed after waiting for ", wait, " seconds")
  }
}

mlflow_user <- function() {
  if ("user" %in% names(Sys.info()))
    Sys.info()[["user"]]
  else
    "unknown"
}

MLFLOW_SOURCE_TYPE <- list(
  NOTEBOOK = "NOTEBOOK",
  JOB = "JOB",
  PROJECT = "PROJECT",
  LOCAL = "LOCAL",
  UNKNOWN = "UNKNOWN"
)

resolve_client_and_run_id <- function(client, run_id) {
  run_id <- cast_nullable_string(run_id)
  if (is.null(client)) {
    if (is.null(run_id)) {
      run_id <- mlflow_get_active_run_id_or_start_run()
    }
    client <- mlflow_client()
  } else {
    client <- resolve_client(client)
    if (is.null(run_id)) stop("`run_id` must be specified when `client` is specified.", call. = FALSE)
  }
  list(client = client, run_id = run_id)
}

parse_run <- function(r) {
  info <- parse_run_info(r$info)

  info$metrics <- parse_metric_data(r$data$metrics)
  info$params <- parse_run_data(r$data$params)
  info$tags <- parse_run_data(r$data$tags)

  new_mlflow_run(info)
}

fill_missing_run_cols <- function(r) {
  # Ensure the current runs list has at least all the names in expected_list
  expected_names <- c("run_uuid", "experiment_id", "user_id", "status", "start_time",
    "artifact_uri", "lifecycle_stage", "run_id", "end_time")
  r[setdiff(expected_names, names(r))] <- NA
  r
}

parse_run_info <- function(r) {
  # TODO: Consider adding dplyr back after 1.0 along with a minimum rlang version to avoid
  # dependency conflicts. The dplyr implementation is likely faster.
  r %>%
    purrr::map_at(c("start_time", "end_time"), milliseconds_to_date) %>%
    fill_missing_run_cols %>%
    tibble::as_tibble()
}

parse_metric_data <- function(d) {
  if (is.null(d)) return(NA)
  d %>%
    purrr::transpose() %>%
    purrr::map(unlist) %>%
    purrr::map_at("timestamp", milliseconds_to_date) %>%
    purrr::map_at("step", as.double) %>%
    purrr::map_at("value", as.double) %>%
    tibble::as_tibble() %>%
    list()
}

parse_run_data <- function(d) {
  if (is.null(d)) return(NA)
  d %>%
    purrr::transpose() %>%
    purrr::map(unlist) %>%
    tibble::as_tibble() %>%
    list()
}

resolve_experiment_id <- function(experiment_id) {
  mlflow_infer_experiment_id(experiment_id) %||%
    stop("`experiment_id` must be specified when there is no active experiment.", call. = FALSE)
}

resolve_run_id <- function(run_id) {
  cast_nullable_string(run_id) %||%
    mlflow_get_active_run_id() %||%
    stop("`run_id` must be specified when there is no active run.", call. = FALSE)
}

new_mlflow_experiment <- function(x) {
  tibble::new_tibble(x, nrow = 1, class = "mlflow_experiment")
}

new_mlflow_run <- function(x) {
  tibble::new_tibble(x, nrow = 1, class = "mlflow_run")
}


#' Get Run or Experiment ID
#'
#' Extracts the ID of the run or experiment.
#'
#' @param object An `mlflow_run` or `mlflow_experiment` object.
#' @export
mlflow_id <- function(object) {
  UseMethod("mlflow_id")
}

#' @rdname mlflow_id
#' @export
mlflow_id.mlflow_run <- function(object) {
  object$run_uuid %||% stop("Cannot extract Run ID.", call. = FALSE)
}

#' @rdname mlflow_id
#' @export
mlflow_id.mlflow_experiment <- function(object) {
  object$experiment_id %||% stop("Cannot extract Experiment ID.", call. = FALSE)
}

resolve_client <- function(client) {
  if (is.null(client)) {
    mlflow_client()
  } else {
    if (!inherits(client, "mlflow_client")) stop("`client` must be an `mlflow_client` object.", call. = FALSE)
    client
  }
}
```

--------------------------------------------------------------------------------

---[FILE: testthat.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat.R

```text
# `trivial` is a dummy MLflow flavor that exists only for unit testing purposes

mlflow_save_model.trivial <- function(model, path, model_spec = list(), ...) {
  if (dir.exists(path)) unlink(path, recursive = TRUE)
  dir.create(path, recursive = TRUE)
  path <- normalizePath(path)

  trivial_conf = list(
    trivial = list(key1 = "value1", key2 = "value2")
  )
  model_spec$flavors <- c(model_spec$flavors, trivial_conf)
  mlflow:::mlflow_write_model_spec(path, model_spec)
}

mlflow_load_flavor.mlflow_flavor_trivial <- function(flavor, model_path) {
  list(flavor = flavor)
}

library(testthat)
library(mlflow)

if (identical(Sys.getenv("NOT_CRAN"), "true")) {
  message("Current working directory: ", getwd())
  test_check("mlflow", reporter = ProgressReporter)
}
```

--------------------------------------------------------------------------------

---[FILE: helpers.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/helpers.R

```text
mlflow_clear_test_dir <- function(path) {
  purrr::safely(mlflow_end_run)()
  mlflow:::mlflow_set_active_experiment_id(NULL)
  if (dir.exists(path)) {
    unlink(path, recursive = TRUE)
  }
  deregister_local_servers()
}

deregister_local_servers <- function() {
  purrr::walk(as.list(mlflow:::.globals$url_mapping), ~ .x$handle$kill())
  rlang::env_unbind(mlflow:::.globals, "url_mapping")
}
```

--------------------------------------------------------------------------------

---[FILE: test-bypass-conda.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-bypass-conda.R

```text
context("Bypass conda")


test_that("MLflow finds MLFLOW_PYTHON_BIN environment variable", {
  orig_global <- mlflow:::.globals$python_bin
  rm("python_bin", envir = mlflow:::.globals)
  orig <- Sys.getenv("MLFLOW_PYTHON_BIN")
  expected_path <- "/test/python"
  Sys.setenv(MLFLOW_PYTHON_BIN = expected_path)
  python_bin <- mlflow:::get_python_bin()
  expect_equal(python_bin, expected_path)
  # Clean up
  Sys.setenv(MLFLOW_PYTHON_BIN = orig)
  assign("python_bin", orig_global, envir = mlflow:::.globals)
})

test_that("MLflow finds MLFLOW_BIN environment variable", {
  orig_global <- mlflow:::.globals$python_bin
  rm("python_bin", envir = mlflow:::.globals)
  orig_env <- Sys.getenv("MLFLOW_BIN")
  expected_path <- "/test/mlflow"
  Sys.setenv(MLFLOW_BIN = expected_path)
  mlflow_bin <- mlflow:::python_mlflow_bin()
  expect_equal(mlflow_bin, expected_path)
  # Clean up
  Sys.setenv(MLFLOW_BIN = orig_env)
  assign("python_bin", orig_global, envir = mlflow:::.globals)
})
```

--------------------------------------------------------------------------------

---[FILE: test-cast-utils.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-cast-utils.R

```text
context("Cast utils")

test_that("cast_string works correctly", {
  expect_equal(cast_string("test"), "test")
  expect_equal(cast_string(123), "123")
  expect_equal(cast_string(TRUE), "TRUE")
  
  expect_equal(cast_string(NA, allow_na = TRUE), NA_character_)
  expect_error(cast_string(NA, allow_na = FALSE))
  expect_error(cast_string(NULL, allow_na = FALSE))
})

test_that("cast_nullable_string works correctly", {
  expect_equal(cast_nullable_string("test"), "test")
  expect_equal(cast_nullable_string(123), "123")
  expect_null(cast_nullable_string(NULL))
})

test_that("cast_scalar_double works correctly", {
  expect_equal(cast_scalar_double(123), 123)
  expect_equal(cast_scalar_double("123.5"), 123.5)
  
  expect_equal(cast_scalar_double(NA, allow_na = TRUE), NA_real_)
  expect_error(cast_scalar_double(NA, allow_na = FALSE))
  expect_error(cast_scalar_double(NULL, allow_na = FALSE))
  expect_error(cast_scalar_double(c(1, 2)))
})

test_that("cast_nullable_scalar_double works correctly", {
  expect_equal(cast_nullable_scalar_double(123), 123)
  expect_equal(cast_nullable_scalar_double("123.5"), 123.5)
  expect_null(cast_nullable_scalar_double(NULL))
  expect_error(cast_nullable_scalar_double(c(1, 2)))
})

test_that("cast_nullable_scalar_integer works correctly", {
  expect_equal(cast_nullable_scalar_integer(123), 123L)
  expect_equal(cast_nullable_scalar_integer("123"), 123L)
  expect_null(cast_nullable_scalar_integer(NULL))
  expect_error(cast_nullable_scalar_integer(c(1, 2)))
})

test_that("cast_string_list works correctly", {
  expect_equal(cast_string_list(c("a", "b")), list("a", "b"))
  expect_equal(cast_string_list(list("a", "b")), list("a", "b"))
  expect_equal(cast_string_list(c(1, 2)), list("1", "2"))
  expect_null(cast_string_list(NULL))
})

test_that("cast_choice works correctly", {
  expect_equal(cast_choice("a", c("a", "b")), "a")
  expect_equal(cast_choice(1, c("1", "2")), "1")
  
  expect_null(cast_choice(NULL, c("a", "b"), allow_null = TRUE))
  expect_error(cast_choice(NULL, c("a", "b"), allow_null = FALSE))
  expect_error(cast_choice("c", c("a", "b")))
})
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 399
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 399 of 991)

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

---[FILE: model-h2o.R]---
Location: mlflow-master/mlflow/R/mlflow/R/model-h2o.R

```text
#' @include model-utils.R
NULL

#' @rdname mlflow_save_model
#' @export
mlflow_save_model.H2OModel <- function(model,
                                       path,
                                       model_spec = list(),
                                       conda_env = NULL,
                                       ...) {
  assert_pkg_installed("h2o")

  if (dir.exists(path)) unlink(path, recursive = TRUE)
  dir.create(path, recursive = TRUE)
  path <- normalizePath(path)

  model_data_subpath <- "model.h2o"
  model_data_path <- file.path(path, model_data_subpath)

  dir.create(model_data_path)

  h2o_save_location <- h2o::h2o.saveModel(
    object = model, path = model_data_path, force = TRUE
  )
  model_file <- basename(h2o_save_location)

  settings <- list(
    full_file = h2o_save_location,
    model_file = model_file,
    model_dir = model_data_path
  )
  yaml::write_yaml(settings, file.path(model_data_path, "h2o.yaml"))

  pip_deps <- list("mlflow", paste0("h2o==", as.character(utils::packageVersion("h2o"))))
  conda_env <- create_default_conda_env_if_absent(path, conda_env, default_pip_deps = pip_deps)
  python_env <- create_python_env(path, dependencies = pip_deps)

  h2o_conf <- list(
    h2o = list(h2o_version = version, data = model_data_subpath)
  )
  pyfunc_conf <- create_pyfunc_conf(
    loader_module = "mlflow.h2o",
    data = model_data_subpath,
    env = list(conda = conda_env, virtualenv = python_env)
  )
  model_spec$flavors <- c(model_spec$flavors, h2o_conf, pyfunc_conf)
  mlflow_write_model_spec(path, model_spec)
}

#' @importFrom rlang %||%
#' @export
mlflow_load_flavor.mlflow_flavor_h2o <- function(flavor, model_path) {
  assert_pkg_installed("h2o")

  model_path <- normalizePath(model_path)
  # Flavor configurations for models saved in MLflow version <= 0.8.0 may not contain a
  # `data` key; in this case, we assume the model artifact path to be `model.h2o
  model_data_subpath <- attributes(flavor)$spec$data %||% "model.h2o"

  h2o_model_file_path <- file.path(model_path, model_data_subpath)
  settings <- yaml::read_yaml(file.path(h2o_model_file_path, "h2o.yaml"))
  h2o::h2o.loadModel(file.path(h2o_model_file_path, settings$model_file))
}

#' @export
mlflow_predict.H2OModel <- function(model, data, ...) {
  assert_pkg_installed("h2o")
  as.data.frame(h2o::h2o.predict(model, h2o::as.h2o(data), ...))
}
```

--------------------------------------------------------------------------------

---[FILE: model-keras.R]---
Location: mlflow-master/mlflow/R/mlflow/R/model-keras.R

```text
#' @rdname mlflow_save_model
#' @param conda_env Path to Conda dependencies file.
#' @export
mlflow_save_model.keras.engine.training.Model <- function(model,
                                                          path,
                                                          model_spec = list(),
                                                          conda_env = NULL,
                                                          ...) {
  assert_pkg_installed("keras")

  if (dir.exists(path)) unlink(path, recursive = TRUE)
  dir.create(path)

  keras::save_model_hdf5(model, filepath = file.path(path, "model.h5"), include_optimizer = TRUE)
  version <- as.character(utils::packageVersion("keras"))

  pip_deps <- list("mlflow", paste("keras>=", version, sep = ""))
  conda_env <- create_default_conda_env_if_absent(path, conda_env, default_pip_deps = pip_deps)
  python_env <- create_python_env(path, dependencies = pip_deps)
  keras_conf <- list(
    keras = list(
      version = "2.2.2",
      data = "model.h5"))
  pyfunc_conf <- create_pyfunc_conf(
    loader_module = "mlflow.keras",
    data = "model.h5",
    env = list(conda = conda_env, virtualenv = python_env),
  )
  model_spec$flavors <- append(append(model_spec$flavors, keras_conf), pyfunc_conf)
  mlflow_write_model_spec(path, model_spec)

  model_spec
}

#' @export
mlflow_load_flavor.mlflow_flavor_keras <- function(flavor, model_path) {
  if (!requireNamespace("keras", quietly = TRUE)) {
    stop("The 'keras' package must be installed.")
  }

  keras::load_model_hdf5(file.path(model_path, "model.h5"))
}

#' @export
mlflow_predict.keras.engine.training.Model <- function(model, data, ...) {
  if (!requireNamespace("keras", quietly = TRUE)) {
    stop("The 'keras' package must be installed.")
  }

  stats::predict(model, as.matrix(data), ...)
}
```

--------------------------------------------------------------------------------

---[FILE: model-python.R]---
Location: mlflow-master/mlflow/R/mlflow/R/model-python.R

```text
create_conda_env <- function(name,
                             path,
                             channels = list("defaults"),
                             conda_deps = list(),
                             pip_deps = list()) {
  conda_deps$pip <- pip_deps
  deps <- list(
    name = name,
    channels = channels,
    dependencies = list(conda_deps)
  )
  write_yaml(deps, path)
}

create_pyfunc_conf <- function(loader_module, code = NULL, data = NULL, env = NULL) {
  res <- list(loader_module = loader_module)
  if (!is.null(code)) {
    res$code <- code
  }
  if (!is.null(data)) {
    res$data <- data
  }
  if (!is.null(env)) {
    res$env <- env
  }
  list(python_function = res)
}
```

--------------------------------------------------------------------------------

---[FILE: model-registry.R]---
Location: mlflow-master/mlflow/R/mlflow/R/model-registry.R

```text
#' Create registered model
#'
#' Creates a new registered model in the model registry
#'
#' @param name The name of the model to create.
#' @param tags Additional metadata for the registered model (Optional).
#' @param description Description for the registered model (Optional).
#' @template roxlate-client
#' @export
mlflow_create_registered_model <- function(name, tags = NULL,
                                           description = NULL, client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "registered-models",
    "create",
    client = client,
    verb = "POST",
    version = "2.0",
    data = list(
      name = cast_string(name),
      tags = tags,
      description = description
    )
  )

  return(response$registered_model)
}

#' Get a registered model
#'
#' Retrieves a registered model from the Model Registry.
#'
#' @param name The name of the model to retrieve.
#' @template roxlate-client
#' @export
mlflow_get_registered_model <- function(name, client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "registered-models",
    "get",
    client = client,
    verb = "GET",
    version = "2.0",
    query = list(name = name)
  )

  return(response$registered_model)
}

#' Rename a registered model
#'
#' Renames a model in the Model Registry.
#'
#' @param name The current name of the model.
#' @param new_name The new name for the model.
#' @template roxlate-client
#' @export
mlflow_rename_registered_model <- function(name, new_name, client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "registered-models",
    "rename",
    client = client,
    verb = "POST",
    version = "2.0",
    data = list(
      name = cast_string(name),
      new_name = cast_string(new_name)
    )
  )

  return(response$registered_model)
}

#' Update a registered model
#'
#' Updates a model in the Model Registry.
#'
#' @param name The name of the registered model.
#' @param description The updated description for this registered model.
#' @template roxlate-client
#' @export
mlflow_update_registered_model <- function(name, description, client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "registered-models",
    "update",
    client = client,
    verb = "PATCH",
    version = "2.0",
    data = list(
      name = cast_string(name),
      description = cast_string(description)
    )
  )

  return(response$registered_model)
}

#' Delete registered model
#'
#' Deletes an existing registered model by name
#'
#' @param name The name of the model to delete
#' @template roxlate-client
#' @export
mlflow_delete_registered_model <- function(name, client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "registered-models",
    "delete",
    client = client,
    verb = "DELETE",
    version = "2.0",
    data = list(name = cast_string(name))
  )
}

#' List registered models
#'
#' Retrieves a list of registered models.
#'
#' @param filter A filter expression used to identify specific registered models.
#'   The syntax is a subset of SQL which allows only ANDing together binary operations.
#'   Example: "name = 'my_model_name' and tag.key = 'value1'"
#' @param max_results Maximum number of registered models to retrieve.
#' @param page_token Pagination token to go to the next page based on a
#'   previous query.
#' @param order_by List of registered model properties to order by. Example: "name".
#' @template roxlate-client
#' @export
mlflow_search_registered_models <- function(filter = NULL,
                                            max_results = 100,
                                            order_by = list(),
                                            page_token = NULL,
                                            client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "registered-models",
    "search",
    client = client,
    verb = "POST",
    version = "2.0",
    data = list(
      filter = filter,
      max_results = max_results,
      order_by = cast_string_list(order_by),
      page_token = page_token
    )
  )

  return(list(
    registered_models = response$registered_model,
    next_page_token = response$next_page_token
  ))
}

#' Get latest model versions
#'
#' Retrieves a list of the latest model versions for a given model.
#'
#' @param name Name of the model.
#' @param stages A list of desired stages. If the input list is NULL, return
#'   latest versions for ALL_STAGES.
#' @template roxlate-client
#' @export
mlflow_get_latest_versions <- function(name, stages = list(), client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "registered-models",
    "get-latest-versions",
    client = client,
    verb = "GET",
    version = "2.0",
    query = list(
      name = cast_string(name),
      stages = cast_string_list(stages)
    )
  )

  return(response$model_versions)
}

#' Create a model version
#'
#' @param name Register model under this name.
#' @param source URI indicating the location of the model artifacts.
#' @param run_id MLflow run ID for correlation, if `source` was generated
#'   by an experiment run in MLflow Tracking.
#' @param tags Additional metadata.
#' @param run_link MLflow run link - This is the exact link of the run that
#'   generated this model version.
#' @param description Description for model version.
#' @template roxlate-client
#' @export
mlflow_create_model_version <- function(name, source, run_id = NULL,
                                        tags = NULL, run_link = NULL,
                                        description = NULL, client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "model-versions",
    "create",
    client = client,
    verb = "POST",
    version = "2.0",
    data = list(
      name = name,
      source = source,
      run_id = run_id,
      run_link = run_link,
      description = description
    )
  )

  return(response$model_version)
}

#' Get a model version
#'
#' @param name Name of the registered model.
#' @param version Model version number.
#' @template roxlate-client
#' @export
mlflow_get_model_version <- function(name, version, client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "model-versions",
    "get",
    client = client,
    verb = "GET",
    version = "2.0",
    query = list(
      name = name,
      version = version
    )
  )

  return(response$model_version)
}

#' Update model version
#'
#' Updates a model version
#'
#' @param name Name of the registered model.
#' @param version Model version number.
#' @param description Description of this model version.
#' @template roxlate-client
#' @export
mlflow_update_model_version <- function(name, version, description,
                                        client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "model-versions",
    "update",
    client = client,
    verb = "PATCH",
    version = "2.0",
    data = list(
      name = name,
      version = version,
      description = description
    )
  )

  return(response$model_version)
}

#' Delete a model version
#'
#' @param name Name of the registered model.
#' @param version Model version number.
#' @template roxlate-client
#' @export
mlflow_delete_model_version <- function(name, version, client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "model-versions",
    "delete",
    client = client,
    verb = "DELETE",
    version = "2.0",
    data = list(
      name = cast_string(name),
      version = cast_string(version)
    )
  )
}

#' Transition ModelVersion Stage
#'
#' Transition a model version to a different stage.
#'
#' @param name Name of the registered model.
#' @param version Model version number.
#' @param stage Transition `model_version` to this stage.
#' @param archive_existing_versions (Optional)
#' @template roxlate-client
#' @export
mlflow_transition_model_version_stage <- function(name, version, stage,
                                                  archive_existing_versions = FALSE,
                                                  client = NULL) {
  client <- resolve_client(client)

  response <- mlflow_rest(
    "model-versions",
    "transition-stage",
    client = client,
    verb = "POST",
    version = "2.0",
    data = list(
      name = name,
      version = version,
      stage = stage,
      archive_existing_versions = archive_existing_versions
    )
  )

  return(response$model_version)
}

#' Set Model version tag
#'
#' Set a tag for the model version.
#' When stage is set, tag will be set for latest model version of the stage.
#' Setting both version and stage parameter will result in error.
#'
#' @param name Registered model name.
#' @param version Registered model version.
#' @param key Tag key to log. key is required.
#' @param value Tag value to log. value is required.
#' @param stage Registered model stage.
#' @template roxlate-client
#' @export
mlflow_set_model_version_tag <- function(name, version = NULL, key = NULL, value = NULL, stage = NULL, client = NULL) {
    if (!is.null(version) && !is.null(stage)) {
        stop("version and stage cannot be set together",
            call. = FALSE
        )
    }

    if (is.null(version) && is.null(stage)) {
        stop("version or stage must be set",
            call. = FALSE
        )
    }

    client <- resolve_client(client)

    if (!is.null(stage)) {
        latest_versions <- mlflow_get_latest_versions(name = name, stages = list(stage))
        if (is.null(latest_versions)) {
            stop(sprintf("Could not find any model version for %s stage", stage),
                call. = FALSE
            )
        }
        version <- latest_versions[[1]]$version
    }

    response <- mlflow_rest(
        "model-versions", "set-tag",
        client = client, verb = "POST",
        data = list(
            name = name,
            version = version,
            key = key,
            value = value
        )
    )
    invisible(NULL)
}
```

--------------------------------------------------------------------------------

---[FILE: model-serve.R]---
Location: mlflow-master/mlflow/R/mlflow/R/model-serve.R

```text
# nocov start

#' Serve an RFunc MLflow Model
#'
#' Serves an RFunc MLflow model as a local REST API server. This interface provides similar
#' functionality to ``mlflow models serve`` cli command, however, it can only be used to deploy
#' models that include RFunc flavor. The deployed server supports standard mlflow models interface
#' with /ping and /invocation endpoints. In addition, R function models also support deprecated
#' /predict endpoint for generating predictions. The /predict endpoint will be removed in a future
#' version of mlflow.
#'
#' @template roxlate-model-uri
#' @param host Address to use to serve model, as a string.
#' @param port Port to use to serve model, as numeric.
#' @param daemonized Makes `httpuv` server daemonized so R interactive sessions
#'   are not blocked to handle requests. To terminate a daemonized server, call
#'   `httpuv::stopDaemonizedServer()` with the handle returned from this call.
#' @param ... Optional arguments passed to `mlflow_predict()`.
#' @param browse Launch browser with serving landing page?
#'
#' @examples
#' \dontrun{
#' library(mlflow)
#'
#' # save simple model with constant prediction
#' mlflow_save_model(function(df) 1, "mlflow_constant")
#'
#' # serve an existing model over a web interface
#' mlflow_rfunc_serve("mlflow_constant")
#'
#' # request prediction from server
#' httr::POST("http://127.0.0.1:8090/predict/")
#' }
#' @importFrom httpuv runServer
#' @importFrom httpuv startDaemonizedServer
#' @importFrom jsonlite fromJSON
#' @import swagger
#' @export
mlflow_rfunc_serve <- function(model_uri,
                               host = "127.0.0.1",
                               port = 8090,
                               daemonized = FALSE,
                               browse = !daemonized,
                               ...) {
  model_path <- mlflow_download_artifacts_from_uri(model_uri)
  httpuv_start <- if (daemonized) httpuv::startDaemonizedServer else httpuv::runServer
  serve_run(model_path, host, port, httpuv_start, browse && interactive(), ...)
}

serve_content_type <- function(file_path) {
  file_split <- strsplit(file_path, split = "\\.")[[1]]
  switch(file_split[[length(file_split)]],
    "css" = "text/css",
    "html" = "text/html",
    "js" = "application/javascript",
    "json" = "application/json",
    "map" = "text/plain",
    "png" = "image/png"
  )
}

serve_static_file_response <- function(package, file_path, replace = NULL) {
  mlflow_verbose_message("Serving static file: ", file_path)

  file_path <- system.file(file_path, package = package)
  file_contents <- if (file.exists(file_path)) readBin(file_path, "raw", n = file.info(file_path)$size) else NULL

  if (!is.null(remove)) {
    contents <- rawToChar(file_contents)
    for (r in names(replace)) {
      contents <- sub(r, replace[[r]], contents)
    }
    file_contents <- charToRaw(enc2utf8(contents))
  }

  list(
    status = 200L,
    headers = list(
      "Content-Type" = paste0(serve_content_type(file_path))
    ),
    body = file_contents
  )
}

serve_invalid_request <- function(message = NULL) {
  list(
    status = 404L,
    headers = list(
      "Content-Type" = "text/plain; charset=UTF-8"
    ),
    body = charToRaw(enc2utf8(
      paste(
        "Invalid Request. ",
        message
      )
    ))
  )
}

serve_prediction <- function(json_raw, model, ...) {
  mlflow_verbose_message("Serving prediction: ", json_raw)
  df <- data.frame()
  if (length(json_raw) > 0) {
    df <- jsonlite::fromJSON(
      rawToChar(json_raw),
      simplifyDataFrame = FALSE,
      simplifyMatrix = FALSE
    )
  }

  df <- as.data.frame(df)

  mlflow_predict(model, df, ...)
}

serve_empty_page <- function(req, sess, model) {
  list(
    status = 200L,
    headers = list(
      "Content-Type" = "text/html"
    ),
    body = "<html></html>"
  )
}

serve_handlers <- function(host, port, ...) {
  handlers <- list(
    "^/swagger.json" = function(req, model) {
      list(
        status = 200L,
        headers = list(
          "Content-Type" = paste0(serve_content_type("json"), "; charset=UTF-8")
        ),
        body = charToRaw(enc2utf8(
          mlflow_swagger()
        ))
      )
    },
    "^/$" = function(req, model) {
      serve_static_file_response(
        "swagger",
        "dist/index.html",
        list(
          "http://petstore\\.swagger\\.io/v2" = "",
          "layout: \"StandaloneLayout\"" = "layout: \"StandaloneLayout\",\nvalidatorUrl : false"
        )
      )
    },
    "^/predict" = function(req, model) {
      json_raw <- req$rook.input$read()

      results <- serve_prediction(json_raw, model, ...)

      list(
        status = 200L,
        headers = list(
          "Content-Type" = paste0(serve_content_type("json"), "; charset=UTF-8")
        ),
        body = charToRaw(enc2utf8(
          jsonlite::toJSON(results, auto_unbox = TRUE, digits = NA)
        ))
      )
    },
    "^/ping" = function(req, model) {
      if (!is.na(model) && !is.null(model)) {
        res <- list(status = 200L,
             headers = list(
                 "Content-Type" = paste0(serve_content_type("json"), "; charset=UTF-8")
             ),
             body = ""
        )
        res
      } else {
        list(status = 404L,
             headers = list(
                 "Content-Type" = paste0(serve_content_type("json"), "; charset=UTF-8")
             )
        )
      }
    },
    "^/invocation" = function(req, model) {
      data_raw <- rawToChar(req$rook.input$read())
      headers <- strsplit(req$HEADERS, "\n")
      content_type <- headers$`content-type` %||% "application/json"
      df <- switch( content_type,
        "application/json" = parse_json(data_raw),
        "text/csv" = utils::read.csv(text = data_raw, stringsAsFactors = FALSE),
        stop("Unsupported input format.")
      )
      results <- mlflow_predict(model, df, ...)
      list(
        status = 200L,
        headers = list(
          "Content-Type" = paste0(serve_content_type("json"), "; charset=UTF-8")
        ),
        body = charToRaw(enc2utf8(
          jsonlite::toJSON(results, auto_unbox = TRUE, digits = NA, simplifyVector = TRUE)
        ))
      )
    },
    "^/[^/]*$" = function(req, model) {
      serve_static_file_response("swagger", file.path("dist", req$PATH_INFO))
    },
    ".*" = function(req, sess, model) {
      stop("Invalid path.")
    }
  )

  if (!getOption("mlflow.swagger", default = TRUE)) {
    handlers[["^/swagger.json"]] <- serve_empty_page
    handlers[["^/$"]] <- serve_empty_page
  }

  handlers
}

message_serve_start <- function(host, port, model) {
  hostname <- paste("http://", host, ":", port, sep = "")

  message()
  message("Starting serving endpoint: ", hostname)
}

#' @importFrom utils browseURL
serve_run <- function(model_path, host, port, start, browse, ...) {
  model <- mlflow_load_model(model_path)

  message_serve_start(host, port, model)

  if (browse) browseURL(paste0("http://", host, ":", port))

  handlers <- serve_handlers(host, port, ...)

  start(host, port, list(
    onHeaders = function(req) {
      NULL
    },
    call = function(req) {
      tryCatch({
        matches <- sapply(names(handlers), function(e) grepl(e, req$PATH_INFO))
        handlers[matches][[1]](req, model)
      }, error = function(e) {
        serve_invalid_request(e$message)
      })
    },
    onWSOpen = function(ws) {
      NULL
    }
  ))
}

# nocov end
```

--------------------------------------------------------------------------------

---[FILE: model-swagger.R]---
Location: mlflow-master/mlflow/R/mlflow/R/model-swagger.R

```text
# nocov start

mlflow_swagger <- function() {
  def <- c(
    swagger_header(),
    swagger_paths(),
    swagger_defs()
  )

  jsonlite::toJSON(def)
}

swagger_header <- function() {
  list(
    swagger = jsonlite::unbox("2.0"),
    info = list(
      description = jsonlite::unbox("API to MLflow Model."),
      version = jsonlite::unbox("1.0.0"),
      title = jsonlite::unbox("MLflow Model")
    ),
    basePath = jsonlite::unbox("/"),
    schemes = list(
      jsonlite::unbox("http")
    )
  )
}

swagger_path <- function() {
  list(
    post = list(
      summary = jsonlite::unbox(paste0("Perform prediction")),
      description = jsonlite::unbox(""),
      consumes = list(
        jsonlite::unbox("application/json")
      ),
      produces = list(
        jsonlite::unbox("application/json")
      ),
      parameters = list(
        list(
          "in" = jsonlite::unbox("body"),
          name = jsonlite::unbox("body"),
          description = jsonlite::unbox(paste0("Prediction instances for model")),
          required = jsonlite::unbox(TRUE),
          schema = list(
            "$ref" = jsonlite::unbox(paste0("#/definitions/Type"))
          )
        )
      ),
      responses = list(
        "200" = list(
          description = jsonlite::unbox("Success")
        )
      )
    )
  )
}

swagger_paths <- function() {
  list(
    paths = list(
      "/predict/" = swagger_path()
    )
  )
}

swagger_defs <- function() {
  list(
    definitions = list(
      Type = list(
        type = jsonlite::unbox("object")
      )
    )
  )
}

# nocov end
```

--------------------------------------------------------------------------------

---[FILE: model-utils.R]---
Location: mlflow-master/mlflow/R/mlflow/R/model-utils.R

```text
#' @include model.R
#' @include model-python.R
NULL

create_default_conda_env_if_absent <- function(
					       model_path,
					       conda_env,
					       default_conda_deps = list(),
					       default_pip_deps = list()) {
  if (!is.null(conda_env)) {
    dst <- file.path(model_path, basename(conda_env))
    if (conda_env != dst) {
      file.copy(from = conda_env, to = dst)
    }

    basename(conda_env)
  } else { # create default conda environment
    conda_env_file_name <- "conda_env.yaml"
    create_conda_env(
      name = "conda_env",
      path = file.path(model_path, conda_env_file_name),
      conda_deps = default_conda_deps,
      pip_deps = default_pip_deps
    )

    conda_env_file_name
  }
}

create_python_env <- function(model_path,
                              dependencies,
                              build_dependencies = list("pip", "setuptools", "wheel")) {
  python_env_file_name <- "python_env.yaml"
  deps <- list(build_dependencies = build_dependencies, dependencies = dependencies)
  write_yaml(deps, file.path(model_path, python_env_file_name))
  python_env_file_name
}

assert_pkg_installed <- function(pkg) {
  if (!requireNamespace(pkg, quietly = TRUE)) {
    stop(sprintf("'%s' package must be installed!", pkg))
  }
}

remove_patch_version <- function(version) {
  gsub("([^.]*\\.[^.]*)(\\..*)", "\\1", version)
}
```

--------------------------------------------------------------------------------

---[FILE: model-xgboost.R]---
Location: mlflow-master/mlflow/R/mlflow/R/model-xgboost.R

```text
#' @include model-utils.R
NULL

#' @rdname mlflow_save_model
#' @export
mlflow_save_model.xgb.Booster <- function(model,
                                          path,
                                          model_spec = list(),
                                          conda_env = NULL,
                                          ...) {
  assert_pkg_installed("xgboost")
  if (dir.exists(path)) unlink(path, recursive = TRUE)
  dir.create(path)

  model_data_subpath <- "model.ubj"
  xgboost::xgb.save(model, fname = file.path(path, model_data_subpath))
  version <- remove_patch_version(
    as.character(utils::packageVersion("xgboost"))
  )

  pip_deps <- list("mlflow", paste("xgboost>=", version, sep = ""))
  conda_env <- create_default_conda_env_if_absent(path, conda_env, default_pip_deps = pip_deps)
  python_env <- create_python_env(path, dependencies = pip_deps)
  xgboost_conf <- list(
    xgboost = list(xgb_version = version, data = model_data_subpath)
  )
  pyfunc_conf <- create_pyfunc_conf(
    loader_module = "mlflow.xgboost",
    data = model_data_subpath,
    env = list(conda = conda_env, virtualenv = python_env)
  )
  model_spec$flavors <- append(append(model_spec$flavors, xgboost_conf), pyfunc_conf)

  mlflow_write_model_spec(path, model_spec)
}

#' @export
mlflow_load_flavor.mlflow_flavor_xgboost <- function(flavor, model_path) {
  assert_pkg_installed("xgboost")
  model_data_subpath <- "model.ubj"
  xgboost::xgb.load(file.path(model_path, model_data_subpath))
}

#' @export
mlflow_predict.xgb.Booster <- function(model, data, ...) {
  assert_pkg_installed("xgboost")
  stats::predict(model, xgboost::xgb.DMatrix(as.matrix(data)), ...)
}
```

--------------------------------------------------------------------------------

---[FILE: model.R]---
Location: mlflow-master/mlflow/R/mlflow/R/model.R

```text
#' Save Model for MLflow
#'
#' Saves model in MLflow format that can later be used for prediction and serving. This method is
#' generic to allow package authors to save custom model types.
#'
#' @param model The model that will perform a prediction.
#' @param path Destination path where this MLflow compatible model
#'   will be saved.
#' @param model_spec MLflow model config this model flavor is being added to.
#' @param ... Optional additional arguments.
#' @importFrom yaml write_yaml
#' @export
mlflow_save_model <- function(model, path, model_spec = list(), ...) {
  UseMethod("mlflow_save_model")
}

#' Log Model
#'
#' Logs a model for this run. Similar to `mlflow_save_model()`
#' but stores model as an artifact within the active run.
#'
#' @param model The model that will perform a prediction.
#' @param artifact_path Destination path where this MLflow compatible model
#'   will be saved.
#' @param ... Optional additional arguments passed to `mlflow_save_model()` when persisting the
#'   model. For example, `conda_env = /path/to/conda.yaml` may be passed to specify a conda
#'   dependencies file for flavors (e.g. keras) that support conda environments.
#'
#' @export
mlflow_log_model <- function(model, artifact_path, ...) {
  temp_path <- fs::path_temp(artifact_path)
  model_spec <- mlflow_save_model(model, path = temp_path, model_spec = list(
    utc_time_created = mlflow_timestamp(),
    run_id = mlflow_get_active_run_id_or_start_run(),
    artifact_path = artifact_path,
    flavors = list()
  ), ...)
  res <- mlflow_log_artifact(path = temp_path, artifact_path = artifact_path)
  tryCatch({ mlflow_record_logged_model(model_spec) }, error = function(e) {
    warning(paste("Logging model metadata to the tracking server has failed, possibly due to older",
                  "server version. The model artifacts have been logged successfully.",
                  "In addition to exporting model artifacts, MLflow clients 1.7.0 and above",
                  "attempt to record model metadata to the  tracking store. If logging to a",
                  "mlflow server via REST, consider  upgrading the server version to MLflow",
                  "1.7.0 or above.", sep=" "))
  })
  res
}

mlflow_write_model_spec <- function(path, content) {
  write_yaml(
    purrr::compact(content),
    file.path(path, "MLmodel")
  )
}

mlflow_timestamp <- function() {
  withr::with_options(
    c(digits.secs = 2),
    format(
      as.POSIXlt(Sys.time(), tz = "GMT"),
      "%Y-%m-%d %H:%M:%OS6"
    )
  )
}

#' Load MLflow Model
#'
#' Loads an MLflow model. MLflow models can have multiple model flavors. Not all flavors / models
#' can be loaded in R. This method by default searches for a flavor supported by R/MLflow.
#'
#' @template roxlate-model-uri
#' @template roxlate-client
#' @param flavor Optional flavor specification (string). Can be used to load a particular flavor in
#' case there are multiple flavors available.
#' @export
mlflow_load_model <- function(model_uri, flavor = NULL, client = mlflow_client()) {
  model_path <- mlflow_download_artifacts_from_uri(model_uri, client = client)
  supported_flavors <- supported_model_flavors()
  spec <- yaml::read_yaml(fs::path(model_path, "MLmodel"))
  available_flavors <- intersect(names(spec$flavors), supported_flavors)

  if (length(available_flavors) == 0) {
    stop(
      "Model does not contain any flavor supported by mlflow/R. ",
      "Model flavors: ",
      paste(names(spec$flavors), collapse = ", "),
      ". Supported flavors: ",
      paste(supported_flavors, collapse = ", "))
  }

  if (!is.null(flavor)) {
    if (!flavor %in% supported_flavors) {
      stop("Invalid flavor.", paste("Supported flavors:",
                              paste(supported_flavors, collapse = ", ")))
    }
    if (!flavor %in% available_flavors) {
      stop("Model does not contain requested flavor. ",
           paste("Available flavors:", paste(available_flavors, collapse = ", ")))
    }
  } else {
    if (length(available_flavors) > 1) {
      warning(paste("Multiple model flavors available (", paste(available_flavors, collapse = ", "),
                    " ).  loading flavor '", available_flavors[[1]], "'", ""))
    }
    flavor <- available_flavors[[1]]
  }

  flavor <- mlflow_flavor(flavor, spec$flavors[[flavor]])
  mlflow_load_flavor(flavor, model_path)
}

new_mlflow_flavor <- function(class = character(0), spec = NULL) {
  flavor <- structure(character(0), class = c(class, "mlflow_flavor"))
  attributes(flavor)$spec <- spec

  flavor
}

# Create an MLflow Flavor Object
#
# This function creates an `mlflow_flavor` object that can be used to dispatch
#   the `mlflow_load_flavor()` method.
#
# @param flavor The name of the flavor.
# @keywords internal
mlflow_flavor <- function(flavor, spec) {
  new_mlflow_flavor(class = paste0("mlflow_flavor_", flavor), spec = spec)
}

#' Load MLflow Model Flavor
#'
#' Loads an MLflow model using a specific flavor. This method is called internally by
#' \link[mlflow]{mlflow_load_model}, but is exposed for package authors to extend the supported
#' MLflow models. See https://mlflow.org/docs/latest/models.html#storage-format for more
#' info on MLflow model flavors.
#'
#' @param flavor An MLflow flavor object loaded by \link[mlflow]{mlflow_load_model}, with class
#' loaded from the flavor field in an MLmodel file.
#' @param model_path The path to the MLflow model wrapped in the correct
#'   class.
#'
#' @export
mlflow_load_flavor <- function(flavor, model_path) {
  UseMethod("mlflow_load_flavor")
}

#' Generate Prediction with MLflow Model
#'
#' Performs prediction over a model loaded using
#' \code{mlflow_load_model()}, to be used by package authors
#' to extend the supported MLflow models.
#'
#' @param model The loaded MLflow model flavor.
#' @param data A data frame to perform scoring.
#' @param ... Optional additional arguments passed to underlying predict
#'   methods.
#'
#' @export
mlflow_predict <- function(model, data, ...) {
  UseMethod("mlflow_predict")
}


# Generate predictions using a saved R MLflow model.
# Input and output are read from and written to a specified input / output file or stdin / stdout.
#
# @param input_path Path to 'JSON' or 'CSV' file to be used for prediction. If not specified data is
#                   read from the stdin.
# @param output_path 'JSON' file where the prediction will be written to. If not specified,
#                     data is written out to stdout.

mlflow_rfunc_predict <- function(model_path, input_path = NULL, output_path = NULL,
                                 content_type = NULL) {
  model <- mlflow_load_model(model_path)
  input_path <- input_path %||% "stdin"
  output_path <- output_path %||% stdout()

  data <- switch(
    content_type %||% "json",
    json = parse_json(input_path),
    csv = utils::read.csv(input_path),
    stop("Unsupported input file format.")
  )
  model <- mlflow_load_model(model_path)
  prediction <- mlflow_predict(model, data)
  jsonlite::write_json(prediction, output_path, digits = NA)
  invisible(NULL)
}

supported_model_flavors <- function() {
  purrr::map(utils::methods(generic.function = mlflow_load_flavor),
             ~ gsub("mlflow_load_flavor\\.mlflow_flavor_", "", .x))
}

# Helper function to parse data frame from json.
parse_json <- function(input_path) {
  json <- jsonlite::fromJSON(input_path, simplifyVector = TRUE)
  data_fields <- intersect(names(json), c("dataframe_split", "dataframe_records"))
  if (length(data_fields) != 1) {
    stop(paste(
      "Invalid input. The input must contain 'dataframe_split' or 'dataframe_records' but not both.",
      "Got input fields", names(json))
    )
  }
  switch(data_fields[[1]],
    dataframe_split = {
      elms <- names(json$dataframe_split)
      if (length(setdiff(elms, c("columns", "index", "data"))) != 0
      || length(setdiff(c("data"), elms) != 0)) {
        stop(paste("Invalid input. Make sure the input json data is in 'split' format.", elms))
      }
      data <- if (any(class(json$dataframe_split$data) == "list")) {
        max_len <- max(sapply(json$dataframe_split$data, length))
        fill_nas <- function(row) {
          append(row, rep(NA, max_len - length(row)))
        }
        rows <- lapply(json$dataframe_split$data, fill_nas)
        Reduce(rbind, rows)
      } else {
        json$dataframe_split$data
      }

      df <- data.frame(data, row.names=json$dataframe_split$index)
      names(df) <- json$dataframe_split$columns
      df
    },
    dataframe_records = json$dataframe_records,
    stop(paste("Unsupported JSON format"))
  )
}
```

--------------------------------------------------------------------------------

````

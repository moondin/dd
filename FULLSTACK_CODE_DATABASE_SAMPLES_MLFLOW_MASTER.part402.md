---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 402
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 402 of 991)

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

---[FILE: test-client.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-client.R

```text
context("client")

teardown({
  mlflow_clear_test_dir("mlruns")
})

test_that("http(s) clients work as expected", {
  mlflow_clear_test_dir("mlruns")
  with_mocked_bindings(.package = "mlflow", mlflow_rest = function(..., client) {
    args <- list(...)
    expect_true(paste(args[1:2], collapse = "/") == "experiments/search")
    list(experiments = c(1, 2, 3))
  }, {
    with_mocked_bindings(.package = "mlflow", mlflow_register_local_server = function(...) NA, {
      env <- list(
        MLFLOW_TRACKING_USERNAME = "DonaldDuck",
        MLFLOW_TRACKING_PASSWORD = "Quack",
        MLFLOW_TRACKING_TOKEN = "$$$",
        MLFLOW_TRACKING_INSECURE = "True"
      )
      with_envvar(env, {
        http_host <- "http://remote"
        client1 <- mlflow:::mlflow_client(http_host)
        config <- client1$get_host_creds()
        print(config)
        expect_true(config$host == http_host)
        expect_true(config$username == "DonaldDuck")
        expect_true(config$password == "Quack")
        expect_true(config$token == "$$$")
        expect_true(config$insecure == "True")
        https_host <- "https://remote"
        client2 <- mlflow:::mlflow_client("https://remote")
        config <- client2$get_host_creds()
        expect_true(config$host == https_host)
        env_str <- paste(env, collapse = "|")
        env_str_2 <- paste(client2$get_cli_env(), collapse = "|")
        expect_true(env_str == env_str_2)
      })
      with_mocked_bindings(.package = "mlflow", mlflow_server = function(...) list(server_url = "local_server"), {
        client3 <- mlflow:::mlflow_client()
        config <- client3$get_host_creds()
        expect_true(config$host == "local_server")
      })
    })
  })
})


test_that("http(s) clients works with deprecated env vars", {
  mlflow_clear_test_dir("mlruns")
  with_mocked_bindings(.package = "mlflow", mlflow_rest = function(..., client) {
    args <- list(...)
    expect_true(paste(args[1:2], collapse = "/") == "experiments/search")
    list(experiments = c(1, 2, 3))
  }, {
    with_mocked_bindings(.package = "mlflow", mlflow_register_local_server = function(...) NA, {
      env <- list(
        MLFLOW_USERNAME = "DonaldDuck",
        MLFLOW_PASSWORD = "Quack",
        MLFLOW_TOKEN = "$$$",
        MLFLOW_INSECURE = "True"
      )
      with_envvar(env, {
        http_host <- "http://remote"
        client1 <- mlflow:::mlflow_client(http_host)
        config <- client1$get_host_creds()
        print(config)
        expect_true(config$host == http_host)
        expect_true(config$username == "DonaldDuck")
        expect_true(config$password == "Quack")
        expect_true(config$token == "$$$")
        expect_true(config$insecure == "True")
        https_host <- "https://remote"
        client2 <- mlflow:::mlflow_client("https://remote")
        config <- client2$get_host_creds()
        expect_true(config$host == https_host)
        env_str <- paste(list(
          MLFLOW_TRACKING_USERNAME = "DonaldDuck",
          MLFLOW_TRACKING_PASSWORD = "Quack",
          MLFLOW_TRACKING_TOKEN = "$$$",
          MLFLOW_TRACKING_INSECURE = "True"
        ), collapse = "|")
        env_str_2 <- paste(client2$get_cli_env(), collapse = "|")
        expect_true(env_str == env_str_2)
      })

      with_mocked_bindings(.package = "mlflow", mlflow_server = function(...) list(server_url = "local_server"), {
        client3 <- mlflow:::mlflow_client()
        config <- client3$get_host_creds()
        expect_true(config$host == "local_server")
      })
    })
  })
})

test_that("rest call handles errors correctly", {
  mlflow_clear_test_dir("mlruns")
  mock_client <- mlflow:::new_mlflow_client_impl(get_host_creds = function() {
     mlflow:::new_mlflow_host_creds(host = "localhost")
  })
  with_mocked_bindings(.package  = "httr", POST = function(...) {
    httr:::response(
      status_code = 400,
      content = charToRaw(paste("{\"error_code\":\"INVALID_PARAMETER_VALUE\",",
                                 "\"message\":\"experiment_id must be set to a non-zero value\"}",
                                 sep = "")
      )
    )}, {
    error_msg_regexp <- paste(
                          "API request to endpoint \'runs/create\' failed with error code 400",
                          "INVALID_PARAMETER_VALUE",
                          "experiment_id must be set to a non-zero value",
                          sep = ".*")
    expect_error(
      mlflow:::mlflow_rest( "runs", "create", client = mock_client, verb = "POST"),
      error_msg_regexp
    )
  })

  with_mocked_bindings(.package  = "httr", GET = function(...) {
    httr:::response(
      status_code = 500,
      content = charToRaw(paste("some text."))
    )
    }, {
    error_msg_regexp <- paste(
                          "API request to endpoint \'runs/create\' failed with error code 500",
                          "some text",
                          sep = ".*")
    expect_error(
      mlflow:::mlflow_rest( "runs", "create", client = mock_client, verb = "GET"),
      error_msg_regexp
    )
  })

  with_mocked_bindings(.package  = "httr", POST = function(...) {
    httr:::response(
      status_code = 503,
      content = as.raw(c(0, 255))
    )
    }, {
    error_msg_regexp <- paste(
                          "API request to endpoint \'runs/create\' failed with error code 503",
                          "00 ff",
                          sep = ".*")
    expect_error(
      mlflow:::mlflow_rest( "runs", "create", client = mock_client, verb = "POST"),
      error_msg_regexp
    )
  })
})
```

--------------------------------------------------------------------------------

---[FILE: test-databricks-utils.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-databricks-utils.R

```text
context("databricks-utils")

library(withr)

test_that("mlflow creates databricks client when scheme is databricks", {
  with_mocked_bindings(.package = "mlflow", get_databricks_config = function(profile) {
      config_vars <- list(host = "databricks-host", token = "databricks")
      config <- new_databricks_config( config_source = "env", config_vars = config_vars)
      config$profile <- profile
      config
  }, {
    with_mocked_bindings(.package = "mlflow", mlflow_rest = function(..., client) {
      args <- list(...)
      expect_true(paste(args, collapse = "/") == "experiments/list")
      list(experiments = c(1, 2, 3))
    }, {
      client1 <- mlflow:::mlflow_client("databricks")
      creds1 <- client1$get_host_creds()
      expect_true(creds1$host == "databricks-host")
      expect_true(creds1$token == "databricks")
      expect_true(is.na(creds1$profile))
      env1 <- client1$get_cli_env()
      expect_true(env1$DATABRICKS_HOST == "databricks-host")
      expect_true(env1$DATABRICKS_TOKEN == "databricks")
      client2 <- mlflow:::mlflow_client("databricks://dbprofile")
      creds2 <- client2$get_host_creds()
      expect_true(creds2$host == "databricks-host")
      expect_true(creds2$token == "databricks")
      expect_true(creds2$profile == "dbprofile")
    })
  })
})

test_that("mlflow reads databricks config from correct sources", {
  with_mocked_bindings(.package = "mlflow", get_databricks_config_for_profile = function(profile) list(
    host = "databricks-host", token = "databricks", profile = profile), {
      config <- get_databricks_config("profile")
      expect_true(config$profile == "profile")
      expect_true(config$host == "databricks-host")
      expect_true(config$host == "databricks-host")
      expect_true(config$token == "databricks")
      config <- get_databricks_config(NA)
      expect_true(config$profile == "DEFAULT")
      expect_true(config$host == "databricks-host")
      expect_true(config$host == "databricks-host")
      expect_true(config$token == "databricks")

      with_mocked_bindings(.package = "mlflow",
        get_databricks_config_from_env = function() {
            new_databricks_config("env", list(host = "host"))
        }, {
        config <- get_databricks_config(NA)
        expect_true(config$profile == "DEFAULT")
        expect_true(config$host == "databricks-host")
        expect_true(config$host == "databricks-host")
        expect_true(config$token == "databricks")
      })
      with_mocked_bindings(.package = "mlflow",
        get_databricks_config_from_env = function() {
            new_databricks_config("env", list(host = "env", token = "env"))
        }, {
        config <- get_databricks_config(NA)
        expect_true(config$host == "env")
        expect_true(config$token == "env")
      })
  })
})

test_that("mlflow can read .databrickscfg files", {
  config_file <- file.path(tempdir(), ".databrickscfg")
  Sys.setenv(DATABRICKS_CONFIG_FILE = config_file)
   tryCatch(
    {
      config_file <- file.path(tempdir(), ".databrickscfg")
      profile1 <- c("[PROFILE1]", "host = host1", "token = token1")
      donald <- c("[DONALD]", "host = duckburg", "username = donaldduck", "password = quackquack",
                  "insecure = True")
      broken_1 <- c("[BROKEN1]", "username = donaldduck", "token = abc")
      broken_2 <- c("[BROKEN2]", "username = donaldduck", "host = duckburg")
      profiles <- c(profile1, default_profile, donald, broken_1, broken_2)
      write(profiles, file = config_file,
            ncolumns = 1, append = FALSE, sep = "\n")

       profile1 <- mlflow:::get_databricks_config_for_profile("PROFILE1")
       expect_true(profile1$config_source == "cfgfile")
       expect_true(profile1$host == "host1")
       expect_true(profile1$token == "token1")
       expect_true(is.na(profile1$username))
       expect_true(is.na(profile1$password))
       expect_true(profile1$insecure == "False")
       expect_true(mlflow:::databricks_config_is_valid(profile1))

       profile2 <- mlflow:::get_databricks_config_for_profile("DONALD")
       expect_true(profile2$config_source == "cfgfile")
       expect_true(profile2$host == "duckburg")
       expect_true(is.na(profile2$token))
       expect_true(profile2$username == "donaldduck")
       expect_true(profile2$password == "quackquack")
       expect_true(profile2$insecure == "True")
       expect_true(mlflow:::databricks_config_is_valid(profile2))

       profile3 <- mlflow:::get_databricks_config_for_profile("BROKEN1")
       expect_true(profile3$config_source == "cfgfile")
       expect_true(is.na(profile3$host))
       expect_true(profile3$token == "abc")
       expect_true(profile3$username == "donaldduck")
       expect_true(is.na(profile3$password))
       expect_true(profile3$insecure == "False")
       expect_false(mlflow:::databricks_config_is_valid(profile3))

       profile4 <- mlflow:::get_databricks_config_for_profile("BROKEN2")
       expect_true(profile4$config_source == "cfgfile")
       expect_true(profile4$host == "duckburg")
       expect_true(is.na(profile4$token))
       expect_true(profile4$username == "donaldduck")
       expect_true(is.na(profile4$password))
       expect_true(profile1$insecure == "False")
       expect_false(mlflow:::databricks_config_is_valid(profile4))

       unlink(config_file)
       Sys.unsetenv(DATABRICKS_CONFIG_FILE)
    },
    error = function(cnd) {
      unlink(config_file)
      Sys.unsetenv(DATABRICKS_CONFIG_FILE)
    },
    interrupt = function(cnd) {
      unlink(config_file)
      Sys.unsetenv(DATABRICKS_CONFIG_FILE)
    }
  )
})

test_that("mlflow can read databricks env congfig", {
  env <- list(
    DATABRICKS_HOST = "envhost",
    DATABRICKS_USERNAME = "envusername",
    DATABRICKS_PASSWORD = "envpassword",
    DATABRICKS_TOKEN = "envtoken",
    DATABRICKS_INSECURE = "True")
  with_envvar( env, {
      envprofile <- mlflow:::get_databricks_config_from_env()
      expect_true(envprofile$host == "envhost")
      expect_true(envprofile$token == "envtoken")
      expect_true(envprofile$username == "envusername")
      expect_true(envprofile$password == "envpassword")
      expect_true(envprofile$insecure == "True")
      expect_true(mlflow:::databricks_config_is_valid(envprofile))

      extracted_env <- mlflow:::databricks_config_as_env(envprofile)
      expect_true(paste(env, collapse = "|") == paste(extracted_env, collapse = "|"))
      expect_true(length(setdiff(extracted_env, env)) == 0)
    }
  )
  env <- list(DATABRICKS_HOST = "envhost",
              DATABRICKS_USERNAME = "envusername",
              DATABRICKS_TOKEN = "envtoken")

  with_envvar(env, {
    envprofile <- mlflow:::get_databricks_config_from_env()
    expect_true(envprofile$host == "envhost")
    expect_true(envprofile$token == "envtoken")
    expect_true(envprofile$username == "envusername")
    expect_true(is.na(envprofile$password))
    expect_true(envprofile$insecure == "False")
    expect_true(mlflow:::databricks_config_is_valid(envprofile))
    extracted_env <- mlflow:::databricks_config_as_env(envprofile)
    expect_true(paste(env, collapse = "|") == paste(extracted_env, collapse = "|"))
    expect_true(length(setdiff(extracted_env, env)) == 0)
  })
})

#' Executes the specified functions while creating mock `.get_notebook_info` and
#' `.get_job_info` functions in the `.databricks_internals` environment
run_with_mock_notebook_and_job_info <- function(func, notebook_info = NULL, job_info = NULL) {
  tryCatch({
    assign(".databricks_internals", new.env(parent = baseenv()), envir = .GlobalEnv)
    databricks_internal_env = get(".databricks_internals", envir = .GlobalEnv)
    assign(".get_notebook_info", function() {
        if (is.null(notebook_info)) {
          notebook_info <- list(id = NA, path = NA, webapp_url = NA)
        }
        notebook_info
      },
      envir = databricks_internal_env)
    if (!is.null(job_info)) {
      assign(".get_job_info", function() { job_info }, envir = databricks_internal_env)
    }
    return(func())
  },
  finally = {
    rm(".databricks_internals", envir = .GlobalEnv)
  })
}

test_that("databricks get run context fetches expected info for notebook environment", {
  mock_notebook_info <- list(id = "5",
                             path = "/path/to/notebook",
                             webapp_url = "https://databricks-url.com")
  expected_tags = list("5", "/path/to/notebook", "https://databricks-url.com",
                       MLFLOW_SOURCE_TYPE$NOTEBOOK, "/path/to/notebook")
  names(expected_tags) <- c(
    MLFLOW_DATABRICKS_TAGS$MLFLOW_DATABRICKS_NOTEBOOK_ID,
    MLFLOW_DATABRICKS_TAGS$MLFLOW_DATABRICKS_NOTEBOOK_PATH,
    MLFLOW_DATABRICKS_TAGS$MLFLOW_DATABRICKS_WEBAPP_URL,
    MLFLOW_TAGS$MLFLOW_SOURCE_TYPE,
    MLFLOW_TAGS$MLFLOW_SOURCE_NAME
  )

  run_with_mock_notebook_and_job_info(function() {
    context <- mlflow:::mlflow_get_run_context.mlflow_databricks_client(
      client = mlflow:::mlflow_client("databricks"),
      experiment_id = "52"
    )
    expect_true(all(expected_tags %in% context$tags))
    expect_true(context$experiment_id == "52")
  }, notebook_info = mock_notebook_info, job_info = NULL)

  run_with_mock_notebook_and_job_info(function() {
    context <- mlflow:::mlflow_get_run_context.mlflow_databricks_client(
      client = mlflow:::mlflow_client("databricks"),
      experiment_id = NULL
    )
    expect_true(all(expected_tags %in% context$tags))
    expect_true(context$experiment_id == "5")
  }, notebook_info = mock_notebook_info, job_info = NULL)
})

test_that("databricks get run context fetches expected info for job environment", {
  mock_job_info <- list(job_id = "10",
                        run_id = "2",
                        job_type = "notebook",
                        webapp_url = "https://databricks-url.com")
  expected_tags = list("10", "2", "notebook", "https://databricks-url.com",
                       MLFLOW_SOURCE_TYPE$JOB, "jobs/10/run/2")
  names(expected_tags) <- c(
    MLFLOW_DATABRICKS_TAGS$MLFLOW_DATABRICKS_JOB_ID,
    MLFLOW_DATABRICKS_TAGS$MLFLOW_DATABRICKS_JOB_RUN_ID,
    MLFLOW_DATABRICKS_TAGS$MLFLOW_DATABRICKS_JOB_TYPE,
    MLFLOW_TAGS$MLFLOW_SOURCE_TYPE,
    MLFLOW_TAGS$MLFLOW_SOURCE_NAME
  )

  run_with_mock_notebook_and_job_info(function() {
    context <- mlflow:::mlflow_get_run_context.mlflow_databricks_client(
      mlflow:::mlflow_client("databricks"),
      experiment_id = "52"
    )
    expect_true(all(expected_tags %in% context$tags))
    expect_true(context$experiment_id == "52")
  }, notebook_info = NULL, job_info = mock_job_info)

  run_with_mock_notebook_and_job_info(function() {
    context <- mlflow:::mlflow_get_run_context.mlflow_databricks_client(
      mlflow:::mlflow_client("databricks"),
      experiment_id = NULL
    )
    expect_true(all(expected_tags %in% context$tags))
    expect_true(context$experiment_id == 0)
  }, notebook_info = NULL, job_info = mock_job_info)
})

#' Verifies that, when notebook information is unavailable and there is no function
#' available for fetching job info (as is the case for older Spark images), fetching
#' the databricks run context delegates to the next context provider
test_that("databricks get run context succeeds when job info function is unavailable", {
  run_with_mock_notebook_and_job_info(function() {
    test_env = new.env()
    test_env$next_method_calls <- 0
    mock_delegate_function = function() {
      test_env$next_method_calls <- test_env$next_method_calls + 1
    }
    with_mocked_bindings(.package = "mlflow",
      mlflow_databricks_delegate_to_next_method = mock_delegate_function, {
      context <- mlflow:::mlflow_get_run_context.mlflow_databricks_client(
        mlflow:::mlflow_client("databricks"),
        experiment_id = 0
      )
    })
    expect_true(test_env$next_method_calls == 1)
  }, notebook_info = NULL, job_info = NULL)
})
```

--------------------------------------------------------------------------------

---[FILE: test-keras-model.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-keras-model.R

```text
context("Model")

library("keras")
library("reticulate")

testthat_model_dir <- tempfile("model_")

setup({
    use_python(Sys.getenv("RETICULATE_PYTHON_BIN", "python"))
})

teardown({
  mlflow_clear_test_dir(testthat_model_dir)
})

test_that("mlflow can save keras model ", {
  PATH <- Sys.getenv("PATH", "") # keras package modifies PATH which breaks other tests
  mlflow_clear_test_dir(testthat_model_dir)
  model <- keras_model_sequential() %>%
  layer_dense(units = 8, activation = "relu", input_shape = dim(iris)[2] - 1) %>%
  layer_dense(units = 3, activation = "softmax")
  model %>% compile(
    loss = "categorical_crossentropy",
    optimizer = optimizer_rmsprop(),
    metrics = c("accuracy")
  )
  train_x <- as.matrix(iris[, 1:4])
  train_y <- to_categorical(as.numeric(iris[, 5]) - 1, 3)
  model %>% fit(train_x, train_y, epochs = 1)
  model %>% mlflow_save_model(testthat_model_dir)
  expect_true(dir.exists(testthat_model_dir))
  detach("package:keras", unload = TRUE)
  model_reloaded <- mlflow_load_model(testthat_model_dir)
  expect_equal(
    predict(model, train_x),
    predict(model_reloaded, train_x),
  )
  Sys.setenv(PATH = PATH)
})
```

--------------------------------------------------------------------------------

---[FILE: test-model-h2o.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-model-h2o.R

```text
context("Model h2o")

setup({
  h2o::h2o.init()
})

idx <- withr::with_seed(3809, sample(nrow(iris)))
prediction <- "Species"
predictors <- setdiff(colnames(iris), prediction)
train <- iris[idx[1:100], ]
test <- iris[idx[101:nrow(iris)], ]

model <- h2o::h2o.randomForest(
  x = predictors, y = prediction, training_frame = h2o::as.h2o(train)
)
testthat_model_dir <- tempfile("model_")

teardown({
  h2o::h2o.shutdown(prompt = FALSE)
  mlflow_clear_test_dir(testthat_model_dir)
})

test_that("mlflow can save model", {
  mlflow_save_model(model, testthat_model_dir)
  expect_true(dir.exists(testthat_model_dir))
})

test_that("can load model and predict with rfunc backend", {
  saved_model <- mlflow_load_model(testthat_model_dir)
  prediction <- mlflow_predict(saved_model, test)
  expect_equal(
    prediction,
    as.data.frame(h2o::h2o.predict(model, h2o::as.h2o(test)))
  )
})

test_that("can print model correctly after it is loaded", {
  saved_model <- mlflow_load_model(testthat_model_dir)
  expect_equal(capture_output(print(model)), capture_output(print(saved_model)))
})

test_that("can load and predict with python pyfunct and h2o backend", {
  pyfunc <- reticulate::import("mlflow.pyfunc")
  py_model <- pyfunc$load_model(testthat_model_dir)

  expected <- as.data.frame(h2o::h2o.predict(model, h2o::as.h2o(test)))
  expected$predict <- as.character(expected$predict)

  expect_equivalent(
    as.data.frame(py_model$predict(test)), expected
  )

  mlflow.h2o <- reticulate::import("mlflow.h2o")
  h2o_native_model <- mlflow.h2o$load_model(testthat_model_dir)
  h2o <- reticulate::import("h2o")

  expect_equivalent(
    as.data.frame(
      h2o_native_model$predict(h2o$H2OFrame(test))$as_data_frame()
    ),
    expected
  )
})

test_that("Can predict with cli backend", {
  expected <- as.data.frame(h2o::h2o.predict(model, h2o::as.h2o(test)))

  # # Test that we can score this model with pyfunc backend
  temp_in_csv <- tempfile(fileext = ".csv")
  temp_in_json <- tempfile(fileext = ".json")
  temp_in_json_split <- tempfile(fileext = ".json")
  temp_out <- tempfile(fileext = ".json")

  check_output <- function() {
    actual <- do.call(
      rbind,
      lapply(jsonlite::read_json(temp_out)$predictions, as.data.frame)
    )

    expect_true(!is.null(actual))
    actual$predict <- as.factor(actual$predict)
    expect_equal(actual, expected)
  }

  write.csv(test[, predictors], temp_in_csv, row.names = FALSE)
  mlflow_cli(
    "models", "predict", "-m", testthat_model_dir, "-i", temp_in_csv,
    "-o", temp_out, "-t", "csv", "--env-manager", "uv", "--install-mlflow"
  )
  check_output()

  # json records
  jsonlite::write_json(list(dataframe_records = test[, predictors]), temp_in_json)
  mlflow_cli(
    "models", "predict", "-m", testthat_model_dir, "-i", temp_in_json, "-o", temp_out,
    "-t", "json", "--env-manager", "uv", "--install-mlflow"
  )
  check_output()

  # json split
  mtcars_split <- list(
    columns = colnames(test), index = row.names(test), data = as.matrix(test)
  )
  jsonlite::write_json(list(dataframe_split = mtcars_split), temp_in_json_split)
  mlflow_cli(
    "models", "predict", "-m", testthat_model_dir, "-i", temp_in_json_split,
    "-o", temp_out, "-t",
    "json", "--env-manager", "uv", "--install-mlflow"
  )
  check_output()
})
```

--------------------------------------------------------------------------------

---[FILE: test-model-registry.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-model-registry.R

```text
context("Model Registry")

get_mock_client <- function() {
  client <- new_mlflow_client_impl(
    get_host_creds = function() {
      new_mlflow_host_creds(host = "localhost")
    }
  )

  return(client)
}

test_that("mlflow can register a model", {
  with_mocked_bindings(.package = "mlflow",
            mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2], collapse = "/") == "registered-models/create")

      data <- args$data
      expect_equal(data$name, "test_model")

      return(list(
        registered_model = list(
          name = "test_model",
          creation_timestamp = 1.6241e+12,
          last_updated_timestamp = 1.6241e+12,
          user_id = "donald.duck"
        )
      ))
    }, {
      mock_client <- get_mock_client()
      registered_model <- mlflow_create_registered_model("test_model", client = mock_client)

      expect_true("name" %in% names(registered_model))
      expect_true("creation_timestamp" %in% names(registered_model))
      expect_true("last_updated_timestamp" %in% names(registered_model))
      expect_true("user_id" %in% names(registered_model))
    })
})

test_that("mlflow can register a model with tags and description", {
  with_mocked_bindings(
    .package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2], collapse = "/") == "registered-models/create")

      data <- args$data
      expect_equal(data$name, "test_model")
      expect_equal(data$description, "Some test model")

      return(list(
        registered_model = list(
          name = "test_model",
          creation_timestamp = 1.6241e+12,
          last_updated_timestamp = 1.6241e+12,
          user_id = "donald.duck",
          tags = list(list(
            key = "creator", value = "Donald Duck"
          )),
          description = "Some test model"
        )
      ))
    }, {
      mock_client <- get_mock_client()

      registered_model <- mlflow_create_registered_model(
          "test_model",
          tags = list(list(key = "creator", value = "Donald Duck")),
          description = "Some test model",
          client = mock_client
        )
      expect_equal(length(registered_model$tags), 1)
    }
  )
})

test_that("mlflow can get a registered model", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2], collapse = "/") == "registered-models/get")
      expect_equal(args$verb, "GET")
      expect_equal(args$query$name, "test_model")
      return(list(
        registered_model = list(name = "test_model")
      ))
    }, {
      mock_client <- get_mock_client()

      mlflow_get_registered_model("test_model", client = mock_client)
  })
})

test_that("mlflow can rename a registered model", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_equal(paste(args[1:2], collapse = "/"), "registered-models/rename")
      expect_equal(args$verb, "POST")
      expect_equal(args$data$name, "old_model_name")
      expect_equal(args$data$new_name, "new_model_name")

      return(list(
        registered_model = list(name = "new_model_name")
      ))
    }, {
      mock_client <- get_mock_client()
      mlflow_rename_registered_model("old_model_name", "new_model_name",
                                     client = mock_client)
  })
})

test_that("mlflow can update a model", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_equal(paste(args[1:2], collapse = "/"), "registered-models/update")
      expect_equal(args$verb, "PATCH")
      expect_equal(args$data$name, "test_model")
      return(list(
        registered_model = list(
          name = "test_model",
          description = "New Description"
        )
      ))
    }, {
      mock_client <- get_mock_client()
      mlflow_update_registered_model("test_model", "New Description",
                                     client = mock_client)
  })
})

test_that("mlflow can delete a model", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_equivalent(paste(args[1:2], collapse = "/"), "registered-models/delete")
      expect_equal(args$data$name, "test_model")
  }, {
    mock_client <- get_mock_client()

    mlflow_delete_registered_model("test_model", client = mock_client)
  })
})

test_that("mlflow can retrieve a list of registered models without args", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2], collapse = "/") == "registered-models/search")
      expect_equal(args$verb, "POST")

      return(list(
        registered_models = list(),
        next_page_token = NULL
      ))
    }, {
      mock_client <- get_mock_client()
      search_result <- mlflow_search_registered_models(client = mock_client)
      expect_null(search_result$next_page_token)
  })
})

test_that("mlflow can retrieve a list of registered models with args", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2], collapse = "/") == "registered-models/search")
      expect_equal(args$verb, "POST")
      expect_equal(args$data$max_results, 5)
      expect_equal(args$data$page_token, "abc")
      expect_equal(args$data$filter, "name LIKE '%foo'")
      expect_equal(
        args$data$order_by, mlflow:::cast_string_list(list("name ASC", "last_updated_timestamp"))
      )

      return(list(
        registered_models = list(
          list(
            name = "test_model",
            creation_timestamp = 1.6241e+12,
            last_updated_timestamp = 1.6241e+12,
            user_id = "donald.duck"
          )
        ),
        next_page_token = "def"
      ))
    }, {
      mock_client <- get_mock_client()
      search_result <- mlflow_search_registered_models(filter = "name LIKE '%foo'",
                                                       max_results = 5,
                                                       order_by = list(
                                                         "name ASC", "last_updated_timestamp"
                                                       ),
                                                       page_token = "abc",
                                                       client = mock_client)
      expect_equal(search_result$registered_models, list(
        list(
          name = "test_model",
          creation_timestamp = 1.6241e+12,
          last_updated_timestamp = 1.6241e+12,
          user_id = "donald.duck"
        )
      ))
      expect_equal(search_result$next_page_token, "def")
  })
})

test_that("mlflow can retrieve a list of model versions", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2],
                  collapse = "/") == "registered-models/get-latest-versions")
      expect_equal(args$verb, "GET")

      return(list(model_versions = list()))
    }, {
      mock_client <- get_mock_client()
      mlflow_get_latest_versions(name = "mymodel", client = mock_client)
  })
})

test_that("mlflow can retrieve a list of model versions for given stages", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2],
                  collapse = "/") == "registered-models/get-latest-versions")
      expect_equal(args$verb, "GET")
      return(list(model_versions = list()))
    }, {
      mock_client <- get_mock_client()
      mlflow_get_latest_versions(name = "mymodel",
                                 stages=list("Production", "Archived"),
                                 client = mock_client)
  })
})

test_that("mlflow can create a model version", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2],
                  collapse = "/") == "model-versions/create")
      expect_equal(args$verb, "POST")
      return(list(model_version = list(
        name = "mymodel",
        version = 1,
        source = "test_uri"
      )))
    }, {
      mock_client <- get_mock_client()
      mlflow_create_model_version(name = "mymodel",
                                 source="test_uri",
                                 client = mock_client)
  })
})

test_that("mlflow can get a model version", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2],
                  collapse = "/") == "model-versions/get")
      expect_equal(args$verb, "GET")
      return(list(model_version = list(
                name = "mymodel",
                version = 1,
                source = "test_uri"
      )))
    }, {
      mock_client <- get_mock_client()
      mlflow_get_model_version(name = "mymodel",
                               version = 1,
                               client = mock_client)
  })
})

test_that("mlflow can update a model version", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2],
                        collapse = "/") == "model-versions/update")
      expect_equal(args$verb, "PATCH")
      return(list(model_version = list(
                  name = "mymodel",
                  version = 1,
                  description = "New Description"
      )))
    }, {
      mock_client <- get_mock_client()
      mlflow_update_model_version(name = "mymodel",
                                  version = 1,
                                  description = "New Description",
                                  client = mock_client)
  })
})

test_that("mlflow can delete a model version", {
  with_mocked_bindings(.package = "mlflow",
            mlflow_rest = function(...) {
              args <- list(...)
              expect_true(paste(args[1:2],
                                collapse = "/") == "model-versions/delete")
              expect_equal(args$verb, "DELETE")
              return(list(model_version = list(
                name = "mymodel",
                version = 1,
                source = "test_uri"
              )))
            }, {
              mock_client <- get_mock_client()
              mlflow_delete_model_version(name = "mymodel",
                                       version = 1,
                                       client = mock_client)
            })
})

test_that("mlflow can transition a model", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2],
                  collapse = "/") == "model-versions/transition-stage")
      expect_equal(args$verb, "POST")
      return(list(model_version = list(
                  name = "mymodel",
                  version = 1,
                  source = "test_uri"
      )))
    }, {
      mock_client <- get_mock_client()
      mlflow_transition_model_version_stage(name = "mymodel",
                                            version = 1,
                                            stage = "Production",
                                            client = mock_client)
  })
})

test_that("mlflow can set model version tag", {
  with_mocked_bindings(.package = "mlflow",
    mlflow_rest = function(...) {
      args <- list(...)
      expect_true(paste(args[1:2],
                  collapse = "/") == "model-versions/set-tag")
      expect_equal(args$verb, "POST")
      return(list(model_version = list(
                  name = "mymodel",
                  version = 1,
                  source = "test_uri"
      )))
    }, {
      mock_client <- get_mock_client()
      mlflow_set_model_version_tag(name = "mymodel",
                                   version = 1,
                                   key = "test_key",
                                   value = "test_value",
                                   client = mock_client)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: test-model-xgboost.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-model-xgboost.R

```text
context("Model xgboost")

idx <- withr::with_seed(3809, sample(nrow(mtcars)))
predictors <- c(
  "mpg", "cyl", "disp", "hp", "drat", "wt", "qsec", "vs",
  "gear", "carb"
)
rownames(mtcars) <- NULL
train <- mtcars[idx[1:25], ]
train <- list(data = train[, predictors], label = train$am)
test <- mtcars[idx[26:32], ]
test <- list(data = test[, predictors], label = test$am)

model <- xgboost::xgboost(
  data = as.matrix(train$data), label = train$label, max_depth = 2,
  eta = 1, nthread = 2, nrounds = 2, objective = "reg:squarederror"
)

testthat_model_dir <- tempfile("model_")

teardown({
  mlflow_clear_test_dir(testthat_model_dir)
})

test_that("mlflow can save model", {
  mlflow_save_model(model, testthat_model_dir)
  expect_true(dir.exists(testthat_model_dir))
  # Test that we can load the model back and score it.
})

test_that("can load model and predict with rfunc backend", {

  loaded_back_model <- mlflow_load_model(testthat_model_dir)
  prediction <- mlflow_predict(loaded_back_model, as.matrix(test$data))
  expect_equal(
    unname(prediction),
    unname(predict(model, as.matrix(test$data)))
  )

})

test_that("can load and predict with python pyfunct and xgboost backend", {
  pyfunc <- reticulate::import("mlflow.pyfunc")
  py_model <- pyfunc$load_model(testthat_model_dir)
  expect_equal(
    as.numeric(py_model$predict(test$data)),
    unname(predict(model, as.matrix(test$data))),
    tolerance = 0.2
  )

  mlflow.xgboost <- reticulate::import("mlflow.xgboost")
  xgboost_native_model <- mlflow.xgboost$load_model(testthat_model_dir)
  xgboost <- reticulate::import("xgboost")

  expect_equal(
    as.numeric(xgboost_native_model$predict(xgboost$DMatrix(test$data))),
    unname(predict(model, as.matrix(test$data))),
    tolerance = 0.2
  )
})

test_that("Can predict with cli backend", {
  # # Test that we can score this model with pyfunc backend
  temp_in_csv <- tempfile(fileext = ".csv")
  temp_in_json <- tempfile(fileext = ".json")
  temp_in_json_split <- tempfile(fileext = ".json")
  temp_out <- tempfile(fileext = ".json")
  write.csv(test$data, temp_in_csv, row.names = FALSE)
  mlflow_cli(
    "models", "predict", "-m", testthat_model_dir, "-i", temp_in_csv,
    "-o", temp_out, "-t", "csv", "--env-manager", "uv", "--install-mlflow"
  )
  prediction <- unlist(jsonlite::read_json(temp_out)$predictions)
  expect_true(!is.null(prediction))
  expect_equal(
    unname(prediction),
    unname(predict(model, as.matrix(test$data)))
  )
  # json records
  jsonlite::write_json(list(dataframe_records = test$data), temp_in_json)
  mlflow_cli(
    "models", "predict", "-m", testthat_model_dir, "-i", temp_in_json, "-o", temp_out,
    "-t", "json", "--env-manager", "uv", "--install-mlflow"
  )
  prediction <- unlist(jsonlite::read_json(temp_out)$predictions)
  expect_true(!is.null(prediction))
  expect_equal(
    prediction,
    unname(predict(model, as.matrix(test$data)))
  )
  # json split
  mtcars_split <- list(
    columns = names(test$data), index = row.names(test$data),
    data = as.matrix(test$data)
  )
  jsonlite::write_json(list(dataframe_split = mtcars_split), temp_in_json_split)
  mlflow_cli(
    "models", "predict", "-m", testthat_model_dir, "-i", temp_in_json_split,
    "-o", temp_out, "-t",
    "json", "--env-manager", "uv", "--install-mlflow"
  )
  prediction <- unlist(jsonlite::read_json(temp_out)$predictions)
  expect_true(!is.null(prediction))
  expect_equal(
    prediction,
    unname(predict(model, as.matrix(test$data)))
  )
})
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 403
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 403 of 991)

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

---[FILE: test-model.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-model.R

```text
context("Model")

library("carrier")

testthat_model_name <- basename(tempfile("model_"))

teardown({
  mlflow_clear_test_dir(testthat_model_name)
})

test_that("mlflow model creation time format", {
  mlflow_clear_test_dir(testthat_model_name)
  model <- lm(Sepal.Width ~ Sepal.Length, iris)
  fn <- crate(~ stats::predict(model, .x), model = model)
  model_spec <- mlflow_save_model(fn, testthat_model_name, model_spec = list(
    utc_time_created = mlflow_timestamp()
  ))
  
  expect_true(dir.exists(testthat_model_name))
  expect_match(model_spec$utc_time_created, "^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{6}")
})

test_that("mlflow can save model function", {
  mlflow_clear_test_dir(testthat_model_name)
  model <- lm(Sepal.Width ~ Sepal.Length, iris)
  fn <- crate(~ stats::predict(model, .x), model = model)
  mlflow_save_model(fn, testthat_model_name)
  expect_true(dir.exists(testthat_model_name))
  # Test that we can load the model back and score it.
  loaded_back_model <- mlflow_load_model(testthat_model_name)
  prediction <- mlflow_predict(loaded_back_model, iris)
  expect_equal(
    prediction,
    predict(model, iris)
  )
  # Test that we can score this model with RFunc backend
  temp_in_csv <- tempfile(fileext = ".csv")
  temp_in_json <- tempfile(fileext = ".json")
  temp_in_json_split <- tempfile(fileext = ".json")
  temp_out <- tempfile(fileext = ".json")
  write.csv(iris, temp_in_csv, row.names = FALSE)
  mlflow_cli("models", "predict", "-m", testthat_model_name, "-i", temp_in_csv, "-o", temp_out, "-t", "csv", "--env-manager", "uv", "--install-mlflow")
  prediction <- unlist(jsonlite::read_json(temp_out))
  expect_true(!is.null(prediction))
  expect_equal(
    prediction,
    unname(predict(model, iris))
  )
  # json records
  jsonlite::write_json(list(dataframe_records = iris), temp_in_json, row.names = FALSE)
  mlflow_cli("models", "predict", "-m", testthat_model_name, "-i", temp_in_json, "-o", temp_out, "-t", "json", "--env-manager", "uv", "--install-mlflow")
  prediction <- unlist(jsonlite::read_json(temp_out))
  expect_true(!is.null(prediction))
  expect_equal(
    prediction,
    unname(predict(model, iris))
  )
  # json split
  iris_split <- list(
    dataframe_split = list(
      columns = names(iris)[1:4],
      index = row.names(iris),
      data = as.matrix(iris[, 1:4])))
  jsonlite::write_json(iris_split, temp_in_json_split, row.names = FALSE)
  mlflow_cli("models", "predict", "-m", testthat_model_name, "-i", temp_in_json_split, "-o", temp_out, "-t",
             "json", "--env-manager", "uv", "--install-mlflow")
  prediction <- unlist(jsonlite::read_json(temp_out))
  expect_true(!is.null(prediction))
  expect_equal(
    prediction,
    unname(predict(model, iris))
  )
})

test_that("mlflow can log model and load it back with a uri", {
  with(run <- mlflow_start_run(), {
    model <- structure(
      list(some = "stuff"),
      class = "test"
    )
    predictor <- crate(~ mean(as.matrix(.x)), model = model)
    predicted <- predictor(0:10)
    expect_true(5 == predicted)
    mlflow_log_model(predictor, testthat_model_name)
  })
  runs_uri <- paste("runs:", run$run_uuid, testthat_model_name, sep = "/")
  loaded_model <- mlflow_load_model(runs_uri)
  expect_true(5 == mlflow_predict(loaded_model, 0:10))
  actual_uri <- paste(run$artifact_uri, testthat_model_name, sep = "/")
  loaded_model_2 <- mlflow_load_model(actual_uri)
  expect_true(5 == mlflow_predict(loaded_model_2, 0:10))
  temp_in  <- tempfile(fileext = ".json")
  temp_out  <- tempfile(fileext = ".json")
  jsonlite::write_json(list(dataframe_records=0:10), temp_in)
  mlflow:::mlflow_cli("models", "predict", "-m", runs_uri, "-i", temp_in, "-o", temp_out,
                      "--content-type", "json", "--env-manager", "uv", "--install-mlflow")
  prediction <- unlist(jsonlite::read_json(temp_out))
  expect_true(5 == prediction)
  mlflow:::mlflow_cli("models", "predict", "-m", actual_uri, "-i", temp_in, "-o", temp_out,
                      "--content-type", "json", "--env-manager", "uv", "--install-mlflow")
  prediction <- unlist(jsonlite::read_json(temp_out))
  expect_true(5 == prediction)
})

test_that("mlflow log model records correct metadata with the tracking server", {
  with(run <- mlflow_start_run(), {
    print(run$run_uuid[1])
    model <- structure(
      list(some = "stuff"),
      class = "test"
    )
    predictor <- crate(~ mean(as.matrix(.x)), model = model)
    predicted <- predictor(0:10)
    expect_true(5 == predicted)
    mlflow_log_model(predictor, testthat_model_name)
    model_spec_expected <- mlflow_save_model(predictor, "test")
    tags <- mlflow_get_run()$tags[[1]]
    models <- tags$value[which(tags$key == "mlflow.log-model.history")]
    model_spec_actual <- fromJSON(models, simplifyDataFrame = FALSE)[[1]]
    expect_equal(testthat_model_name, model_spec_actual$artifact_path)
    expect_equal(run$run_uuid[1], model_spec_actual$run_id)
    expect_equal(model_spec_expected$flavors, model_spec_actual$flavors)
  })
})

test_that("mlflow can save and load attributes of model flavor correctly", {
  model_name <- basename(tempfile("model_"))
  model <- structure(list(), class = "trivial")
  path <- file.path(tempdir(), model_name)
  mlflow_save_model(model, path = path)
  model <- mlflow_load_model(path)

  expect_equal(attributes(model$flavor)$spec$key1, "value1")
  expect_equal(attributes(model$flavor)$spec$key2, "value2")
})
```

--------------------------------------------------------------------------------

---[FILE: test-params.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-params.R

```text
context("Params")

test_that("mlflow can read typed command line parameters", {
  mlflow_clear_test_dir("mlruns")

  mlflow_cli(
    "run",
    "examples/",
    "--env-manager",
    "uv",
    "--entry-point",
    "params_example.R",
    "-P", "my_int=10",
    "-P", "my_num=20.0",
    "-P", "my_str=XYZ"
  )

  expect_true(dir.exists("mlruns"))
  expect_true(dir.exists("mlruns/0"))
  expect_true(file.exists("mlruns/0/meta.yaml"))

  run_dir <- file.path("mlruns/0/", dir("mlruns/0/", pattern = "^[a-zA-Z0-9]+$")[[1]])
  params_dir <- dir(file.path(run_dir, "params"))

  expect_true("my_int" %in% params_dir)
  expect_true("my_num" %in% params_dir)
  expect_true("my_str" %in% params_dir)
})

test_that("ml_param() type checking works", {
  expect_identical(mlflow_param("p1", "a", "string"), "a")
  expect_identical(mlflow_param("p2", 42, "integer"), 42L)
  expect_identical(mlflow_param("p3", 42L), 42L)
  expect_identical(mlflow_param("p4", 12), 12)
})
```

--------------------------------------------------------------------------------

---[FILE: test-rest.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-rest.R

```text
context("rest")

library(withr)


test_that("user-agent header is set", {
  config <- list()
  config$insecure <- FALSE
  config$username <- NA
  config$password <- NA
  config$token <- NA

  rest_config <- mlflow:::get_rest_config(config)

  expected_user_agent <- paste("mlflow-r-client", packageVersion("mlflow"), sep = "/")
  expect_equal(rest_config$headers$`User-Agent`, expected_user_agent)
  expect_equal(rest_config$config, list())
})

test_that("basic auth is used", {
  config <- list()
  config$insecure <- FALSE
  config$username <- "hello"
  config$password <- "secret"
  config$token <- NA

  rest_config <- mlflow:::get_rest_config(config)

  expect_equal(rest_config$headers$Authorization, "Basic aGVsbG86c2VjcmV0")
})

test_that("token auth is used", {
  config <- list()
  config$insecure <- FALSE
  config$username <- NA
  config$password <- NA
  config$token <- "taken"

  rest_config <- mlflow:::get_rest_config(config)

  expect_equal(rest_config$headers$Authorization, "Bearer taken")
})

test_that("insecure is used", {
  config <- list()
  config$insecure <- TRUE
  config$username <- NA
  config$password <- NA
  config$token <- NA

  rest_config <- mlflow:::get_rest_config(config)

  expect_equal(rest_config$config, httr::config(ssl_verifypeer = 0, ssl_verifyhost = 0))
})


test_that("429s are retried", {
  next_id <<- 1
  client <- mlflow:::mlflow_client("local")
  new_response <- function(status_code) {
    structure(
      list(status_code = status_code,
           content = charToRaw('{"text":"text"}'),
           headers = list(`Content-Type` = "raw")
      ), class = "response"
    )
  }
  responses <- list(new_response(429), new_response(429), new_response(200))
  with_mocked_bindings(.package  = "httr", GET = function(...) {
    res <- responses[[next_id]]
    next_id <<- next_id + 1
    res
  }, {
    tryCatch({
      mlflow_rest(client = client, max_rate_limit_interval = 0)
      stop("The rest call should have returned 429 and the function should have thrown.")
    }, error = function(cnd) {
      # pass
      TRUE
    })
    x <- mlflow_rest(client = client, max_rate_limit_interval = 2)
    expect_equal(x$text, "text")
    next_id <<- 1
    x <- mlflow_rest(client = client, max_rate_limit_interval = 2)
    expect_equal(x$text, "text")
    next_id <<- 1
    x <- mlflow_rest(client = client, max_rate_limit_interval = 3)
    expect_equal(x$text, "text")
    next_id <<- 1
    tryCatch({
      mlflow_rest(client = client, max_rate_limit_interval = 1)
      stop("The rest call should have returned 429 and the function should have thrown.")
    }, error = function(cnd) {
      # pass
      TRUE
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: test-run.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-run.R

```text
context("Run")

teardown({
  mlflow_clear_test_dir("mlruns")
})

test_that("mlflow can run and save model", {
  mlflow_clear_test_dir("mlruns")

  mlflow_source("examples/train_example.R")

  expect_true(dir.exists("mlruns"))
  expect_true(dir.exists("mlruns/0"))
  expect_true(file.exists("mlruns/0/meta.yaml"))
})


test_that("mlflow run uses active experiment if not specified", {
  with_mocked_bindings(.package = "mlflow", mlflow_get_active_experiment_id = function() {
    123}, {
      with_mocked_bindings(.package = "mlflow", mlflow_cli = function(...){
        args <- list(...)
        expect_true("--experiment-id" %in% args)
        expect_false("--experiment-name" %in% args)
        id <- which(args == "--experiment-id") + 1
        expect_true(args[[id]] == 123)
        list(stderr = "=== Run (ID '48734e7e2e8f44228a11c0c2cbcdc8b0') succeeded ===")
      }, {
        mlflow_run("project")
      })
      with_mocked_bindings(.package = "mlflow", mlflow_cli = function(...){
        args <- list(...)
        expect_true("--experiment-id" %in% args)
        expect_false("--experiment-name" %in% args)
        id <- which(args == "--experiment-id") + 1
        expect_true(args[[id]] == 321)
        list(stderr = "=== Run (ID '48734e7e2e8f44228a11c0c2cbcdc8b0') succeeded ===")
      }, {
        mlflow_run("project", experiment_id = 321)
      })
      with_mocked_bindings(.package = "mlflow", mlflow_cli = function(...){
        args <- list(...)
        expect_false("--experiment-id" %in% args)
        expect_true("--experiment-name" %in% args)
        id <- which(args == "--experiment-name") + 1
        expect_true(args[[id]] == "name")
        list(stderr = "=== Run (ID '48734e7e2e8f44228a11c0c2cbcdc8b0') succeeded ===")
      }, {
        mlflow_run("project", experiment_name = "name")
      })
  })
})


test_that("mlflow_run passes all numbers as non-scientific", {
  # we can only be sure conversion is actively avoided
  # if default formatting turns into scientific.
  expect_equal(as.character(10e4), "1e+05")
  with_mocked_bindings(.package = "mlflow", mlflow_cli = function(...){
    args <- c(...)
    expect_equal(sum("scientific=100000" == args), 1)
    expect_equal(sum("non_scientific=30000" == args), 1)
    list(stderr = "=== Run (ID '48734e7e2e8f44228a11c0c2cbcdc8b0') succeeded ===")
  }, {
    mlflow_run("project", parameters = c(scientific = 10e4, non_scientific = 30000))
  })
})

test_that("active experiment is set when starting a run with experiment specified", {
  mlflow_clear_test_dir("mlruns")
  id <- mlflow_create_experiment("one-more")
  mlflow_start_run(experiment_id = id)
  expect_equal(
    mlflow_get_experiment()$experiment_id,
    id
  )
  mlflow_end_run()
})

test_that("active experiment is set when starting a run without experiment specified", {
  mlflow_clear_test_dir("mlruns")
  id <- mlflow_create_experiment("second-exp")
  mlflow_start_run()
  expect_equal(
    mlflow_get_experiment()$experiment_id,
    "0"
  )
  mlflow_end_run()
})
```

--------------------------------------------------------------------------------

---[FILE: test-serve.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-serve.R

```text
context("Serve")

library("carrier")

wait_for_server_to_start <- function(server_process, port) {
  status_code <- 500
  for (i in 1:5) {
    tryCatch(
      {
        status_code <- httr::status_code(httr::GET(sprintf("http://127.0.0.1:%d/ping/", port)))
      },
      error = function(...) {
        status_code <- 500
      }
    )
    if (status_code != 200) {
      Sys.sleep(5)
    } else {
      break
    }
  }
  if (status_code != 200) {
    write("FAILED to start the server!", stderr())
    error_text <- server_process$read_error()
    stop("Failed to start the server!", error_text)
  }
}

testthat_model_server <- NULL

teardown({
  if (!is.null(testthat_model_server)) {
    testthat_model_server$kill()
  }
})

test_that("mlflow can serve a model function", {
  mlflow_clear_test_dir("model")

  model <- lm(Sepal.Width ~ Sepal.Length + Petal.Width, iris)
  fn <- crate(~ stats::predict(model, .x), model = model)
  mlflow_save_model(fn, path = "model")
  expect_true(dir.exists("model"))
  port <- httpuv::randomPort()
  testthat_model_server <<- processx::process$new(
    "Rscript",
    c(
      "-e",
      sprintf(
        "mlflow::mlflow_rfunc_serve('model', port = %d, browse = FALSE)",
        port
      )
    ),
    supervise = TRUE,
    stdout = "|",
    stderr = "|"
  )
  wait_for_server_to_start(testthat_model_server, port)
  newdata <- iris[1:2, c("Sepal.Length", "Petal.Width")]

  http_prediction <- httr::content(
    httr::POST(
      sprintf("http://127.0.0.1:%d/predict/", port),
      body = jsonlite::toJSON(as.list(newdata))
    )
  )
  if (is.character(http_prediction)) {
    stop(http_prediction)
  }

  expect_equal(
    unlist(http_prediction),
    as.vector(predict(model, newdata)),
    tolerance = 1e-5
  )
})

test_that("mlflow models server api works with R model function", {
  model <- lm(Sepal.Width ~ Sepal.Length + Petal.Width, iris)
  fn <- crate(~ stats::predict(model, .x), model = model)
  mlflow_save_model(fn, path = "model")
  expect_true(dir.exists("model"))
  port <- httpuv::randomPort()
  testthat_model_server <<- mlflow:::mlflow_cli("models", "serve", "-m", "model", "-p", as.character(port),
    background = TRUE
  )
  wait_for_server_to_start(testthat_model_server, port)
  newdata <- iris[1:2, c("Sepal.Length", "Petal.Width")]
  check_prediction <- function(http_prediction) {
    if (is.character(http_prediction)) {
      stop(http_prediction)
    }
    expect_equal(
      unlist(http_prediction),
      as.vector(predict(model, newdata)),
      tolerance = 1e-5
    )
  }
  # json records
  check_prediction(
    httr::content(
      httr::POST(
        sprintf("http://127.0.0.1:%d/invocation/", port),
        httr::content_type("application/json"),
        body = jsonlite::toJSON(list(dataframe_records=as.list(newdata)))
      )
    )
  )
  newdata_split <- list(
    columns = names(newdata), index = row.names(newdata),
    data = as.matrix(newdata)
  )
  # json split
  content_type <- "application/json"
  check_prediction(
    httr::content(
      httr::POST(
        sprintf("http://127.0.0.1:%d/invocation/", port),
        httr::content_type(content_type),
        body = jsonlite::toJSON(list(dataframe_split=newdata_split))
      )
    )
  )

  # csv
  csv_header <- paste(names(newdata), collapse = ", ")
  csv_row_1 <- paste(newdata[1, ], collapse = ", ")
  csv_row_2 <- paste(newdata[2, ], collapse = ", ")
  newdata_csv <- paste(csv_header, csv_row_1, csv_row_2, "", sep = "\n")
  check_prediction(
    httr::content(
      httr::POST(
        sprintf("http://127.0.0.1:%d/invocation/", port),
        httr::content_type("text/csv"),
        body = newdata_csv
      )
    )
  )
})
```

--------------------------------------------------------------------------------

---[FILE: test-style.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-style.R

```text
context("lints")

test_that("mlflow package conforms to lintr::lint_package() style", {
  if (nchar(Sys.getenv("COVR_RUNNING")) > 0) {
    skip("No linting during code coverage")
  }

  # removing lint check until lint is cleaned up
  # lintr::expect_lint_free()
})
```

--------------------------------------------------------------------------------

---[FILE: test-tracking-experiments.R]---
Location: mlflow-master/mlflow/R/mlflow/tests/testthat/test-tracking-experiments.R

```text
context("Tracking - Experiments")

teardown({
  mlflow_clear_test_dir("mlruns")
})

test_that("mlflow_create/set/get_experiment() basic functionality (fluent)", {
  mlflow_clear_test_dir("mlruns")
  artifact_relative_path <- "art_loc"
  experiment_1_id <- mlflow_create_experiment("exp_name_1", artifact_relative_path)
  experiment_2_id <- mlflow_set_experiment(experiment_name = "exp_name_2", artifact_location = artifact_relative_path)
  experiment_1a <- mlflow_get_experiment(experiment_id = experiment_1_id)
  experiment_1b <- mlflow_get_experiment(name = "exp_name_1")
  experiment_2a <- mlflow_get_experiment(name = "exp_name_2")

  expect_identical(experiment_1a, experiment_1b)
  expected_artifact_location <- sprintf("%s/%s", getwd(), artifact_relative_path)
  expect_identical(experiment_1a$artifact_location, expected_artifact_location)
  expect_identical(experiment_1a$name, "exp_name_1")
  expect_identical(experiment_2a$name, "exp_name_2")
  expect_identical(experiment_2a$artifact_location, expected_artifact_location)
})

test_that("mlflow_create/get_experiment() basic functionality (client)", {
  mlflow_clear_test_dir("mlruns")

  client <- mlflow_client()
  artifact_relative_path <- "art_loc"
  experiment_1_id <- mlflow_create_experiment(
    client = client,
    name = "exp_name",
    artifact_location = artifact_relative_path,
    tags = list(foo = "bar", foz = "baz", fiz = "biz")
  )
  experiment_1a <- mlflow_get_experiment(client = client, experiment_id = experiment_1_id)
  experiment_1b <- mlflow_get_experiment(client = client, name = "exp_name")

  expect_identical(experiment_1a, experiment_1b)
  expected_artifact_location <- sprintf("%s/%s", getwd(), artifact_relative_path)
  expect_identical(experiment_1a$artifact_location, expected_artifact_location)
  expect_identical(experiment_1a$name, "exp_name")

  expect_true(
    all(purrr::transpose(experiment_1b$tags[[1]]) %in%
      list(
        list(key = "foz", value = "baz"),
        list(key = "foo", value = "bar"),
        list(key = "fiz", value = "biz")
      )
    )
  )
})

test_that("mlflow_get_experiment() not found error", {
  mlflow_clear_test_dir("mlruns")

  expect_error(
    mlflow_get_experiment(experiment_id = "42"),
    "Could not find experiment with ID 42"
  )
})

test_that("mlflow_search_experiments() works properly", {
  mlflow_clear_test_dir("mlruns")
  client <- mlflow_client()
  ex1 <- mlflow_create_experiment(client = client, "foo1", "art_loc1")
  ex2 <- mlflow_create_experiment(client = client, "foo2", "art_loc2")
  ex3 <- mlflow_create_experiment(client = client, "foo3", "art_loc3")

  mlflow_set_experiment_tag("expgroup", "group1", experiment_id = ex1)
  mlflow_set_experiment_tag("expgroup", "group1", experiment_id = ex3)

  allexperiments_result <- mlflow_search_experiments(client = client)
  allexperiments <- allexperiments_result$experiments
  expect_setequal(allexperiments$experiment_id, c("0", ex1, ex2, ex3))
  expect_setequal(allexperiments$name, c("Default", "foo1", "foo2", "foo3"))
  default_artifact_loc <- file.path(getwd(), "mlruns", "0", fsep = "/")
  expect_setequal(allexperiments$artifact_location, c(default_artifact_loc,
                                                      sprintf("%s/%s", getwd(), "art_loc1"),
                                                      sprintf("%s/%s", getwd(), "art_loc2"),
                                                      sprintf("%s/%s", getwd(), "art_loc3")))
  expect_null(allexperiments_result$next_page_token)

  ex1_result = mlflow_search_experiments(filter = "attribute.name = 'foo1'")
  expect_setequal(ex1_result$experiments$experiment_id, c(ex1))
  expect_null(ex1_result$next_page_token)

  exgroup1_result = mlflow_search_experiments(filter = "tags.expgroup = 'group1'")
  expect_setequal(exgroup1_result$experiments$experiment_id, c(ex1, ex3))
  expect_null(exgroup1_result$next_page_token)

  mlflow_delete_experiment(experiment_id = ex1)
  deleted_experiments_result <- mlflow_search_experiments(experiment_view_type = "DELETED_ONLY")
  expect_setequal(deleted_experiments_result$experiments$experiment_id, c(ex1))
  expect_null(deleted_experiments_result$next_page_token)

  # By default, only active experiments should be returned
  active_experiments_result <- mlflow_search_experiments()
  expect_setequal(active_experiments_result$experiments$experiment_id, c("0", ex2, ex3))
  expect_null(active_experiments_result$next_page_token)

  order_limit_result1 <- mlflow_search_experiments(
    max_results = 2,
    order_by = c("attribute.name desc"),
    experiment_view_type="ALL",
  )
  expect_setequal(order_limit_result1$experiments$name, c("foo3", "foo2"))

  order_limit_result2 <- mlflow_search_experiments(
    max_results = 2,
    order_by = c("attribute.name desc"),
    page_token = order_limit_result1$next_page_token,
    experiment_view_type="ALL",
  )
  expect_setequal(order_limit_result2$experiments$name, c("foo1", "Default"))
  expect_null(order_limit_result2$next_page_token)
})

test_that("mlflow_search_experiments() works properly", {
  mlflow_clear_test_dir("mlruns")
  client <- mlflow_client()
  art_loc_1 <- "art_loc1"
  art_loc_2 <- "art_loc2"
  art_loc_3 <- "art_loc3"
  ex1 <- mlflow_create_experiment(client = client, "foo1", art_loc_1)
  ex2 <- mlflow_create_experiment(client = client, "foo2", art_loc_2)
  ex3 <- mlflow_create_experiment(client = client, "foo3", art_loc_3)

  mlflow_set_experiment_tag("expgroup", "group1", experiment_id = ex1)
  mlflow_set_experiment_tag("expgroup", "group1", experiment_id = ex3)

  allexperiments_result <- mlflow_search_experiments(client = client)
  allexperiments <- allexperiments_result$experiments
  expect_setequal(allexperiments$experiment_id, c("0", ex1, ex2, ex3))
  expect_setequal(allexperiments$name, c("Default", "foo1", "foo2", "foo3"))
  default_artifact_loc <- file.path(getwd(), "mlruns", "0", fsep = "/")
  expect_setequal(allexperiments$artifact_location, c(default_artifact_loc,
                                                      sprintf("%s/%s", getwd(), art_loc_1),
                                                      sprintf("%s/%s", getwd(), art_loc_2),
                                                      sprintf("%s/%s", getwd(), art_loc_3)))
  expect_null(allexperiments_result$next_page_token)

  ex1_result = mlflow_search_experiments(filter = "attribute.name = 'foo1'")
  expect_setequal(ex1_result$experiments$experiment_id, c(ex1))
  expect_null(ex1_result$next_page_token)

  exgroup1_result = mlflow_search_experiments(filter = "tags.expgroup = 'group1'")
  expect_setequal(exgroup1_result$experiments$experiment_id, c(ex1, ex3))
  expect_null(exgroup1_result$next_page_token)

  mlflow_delete_experiment(experiment_id = ex1)
  deleted_experiments_result <- mlflow_search_experiments(experiment_view_type = "DELETED_ONLY")
  expect_setequal(deleted_experiments_result$experiments$experiment_id, c(ex1))
  expect_null(deleted_experiments_result$next_page_token)

  # By default, only active experiments should be returned
  active_experiments_result <- mlflow_search_experiments()
  expect_setequal(active_experiments_result$experiments$experiment_id, c("0", ex2, ex3))
  expect_null(active_experiments_result$next_page_token)

  order_limit_result1 <- mlflow_search_experiments(
    max_results = 2,
    order_by = c("attribute.name desc"),
    experiment_view_type="ALL",
  )
  expect_setequal(order_limit_result1$experiments$name, c("foo3", "foo2"))

  order_limit_result2 <- mlflow_search_experiments(
    max_results = 2,
    order_by = c("attribute.name desc"),
    page_token = order_limit_result1$next_page_token,
    experiment_view_type="ALL",
  )
  expect_setequal(order_limit_result2$experiments$name, c("foo1", "Default"))
  expect_null(order_limit_result2$next_page_token)
})

test_that("mlflow_set_experiment_tag() works correctly", {
  mlflow_clear_test_dir("mlruns")
  client <- mlflow_client()
  experiment_id <- mlflow_create_experiment(client = client, "setExperimentTagTestExperiment", "art_exptag_loc")
  mlflow_set_experiment_tag("dataset", "imagenet1K", experiment_id, client = client)
  experiment <- mlflow_get_experiment(experiment_id = experiment_id, client = client)
  tags <- experiment$tags[[1]]
  expect_identical(tags, tibble::tibble(key = 'dataset', value = 'imagenet1K'))
  expect_identical("imagenet1K", tags$value[tags$key == "dataset"])

  # test that updating a tag works
  mlflow_set_experiment_tag("dataset", "birdbike", experiment_id, client = client)
  experiment <- mlflow_get_experiment(experiment_id = experiment_id, client = client)
  expect_equal(experiment$tags, list(tibble::tibble(key = 'dataset', value = 'birdbike')))

  # test that setting a tag on 1 experiment does not impact another experiment.
  experiment_id_2 <- mlflow_create_experiment(client = client, "setExperimentTagTestExperiment2", "art_exptag_loc2")
  experiment_2 <- mlflow_get_experiment(experiment_id = experiment_id_2, client = client)
  expect_equal(experiment_2$tags, NA)

  # test that setting a tag on different experiments maintain different values across experiments
  mlflow_set_experiment_tag("dataset", "birds200", experiment_id_2, client = client)
  experiment <- mlflow_get_experiment(experiment_id = experiment_id, client = client)
  tags <- experiment$tags[[1]]
  experiment_2 <- mlflow_get_experiment(experiment_id = experiment_id_2, client = client)
  tags_2 <- experiment_2$tags[[1]]
  expect_equal(tags, tibble::tibble(key = 'dataset', value = 'birdbike'))
  expect_equal(tags_2, tibble::tibble(key = 'dataset', value = 'birds200'))

  # test can set multi-line tags
  mlflow_set_experiment_tag("multiline tag", "value2\nvalue2\nvalue2", experiment_id, client = client)
  experiment <- mlflow_get_experiment(experiment_id = experiment_id, client = client)
  expect_identical(
        tibble::tibble(
          key = c('dataset', 'multiline tag'),
          value= c("birdbike", "value2\nvalue2\nvalue2")
        ),
        experiment$tags[[1]][order(experiment$tags[[1]]$key),]
  )
})


test_that("mlflow_get_experiment_by_name() works properly", {
  mlflow_clear_test_dir("mlruns")
  client <- mlflow_client()
  expect_error(
    mlflow_get_experiment(client = client, name = "exp"),
    "Could not find experiment with name 'exp'"
  )
  artifact_relative_path <- "art"
  experiment_id <- mlflow_create_experiment(client = client, "exp", artifact_relative_path)
  experiment <- mlflow_get_experiment(client = client, name = "exp")
  expect_identical(experiment_id, experiment$experiment_id)
  expect_identical(experiment$name, "exp")
  expect_identical(experiment$artifact_location, sprintf("%s/%s", getwd(), artifact_relative_path))
})

test_that("infer experiment id works properly", {
  mlflow_clear_test_dir("mlruns")
  experiment_id <- mlflow_create_experiment("test")
  Sys.setenv(MLFLOW_EXPERIMENT_NAME = "test")
  expect_true(experiment_id == mlflow_infer_experiment_id())
  Sys.unsetenv("MLFLOW_EXPERIMENT_NAME")
  Sys.setenv(MLFLOW_EXPERIMENT_ID = experiment_id)
  expect_true(experiment_id == mlflow_infer_experiment_id())
  Sys.unsetenv("MLFLOW_EXPERIMENT_ID")
  mlflow_set_experiment("test")
  expect_true(experiment_id == mlflow_infer_experiment_id())
})

test_that("experiment setting works", {
  mlflow_clear_test_dir("mlruns")
  exp1_id <- mlflow_create_experiment("exp1")
  exp2_id <- mlflow_create_experiment("exp2")
  mlflow_set_experiment(experiment_name = "exp1")
  expect_identical(exp1_id, mlflow_get_active_experiment_id())
  expect_identical(mlflow_get_experiment(exp1_id), mlflow_get_experiment())
  mlflow_set_experiment(experiment_id = exp2_id)
  expect_identical(exp2_id, mlflow_get_active_experiment_id())
  expect_identical(mlflow_get_experiment(exp2_id), mlflow_get_experiment())
})

test_that("mlflow_set_experiment() creates experiments", {
  mlflow_clear_test_dir("mlruns")
  artifact_relative_path <- "artifact/location"
  mlflow_set_experiment(experiment_name = "foo", artifact_location = artifact_relative_path)
  experiment <- mlflow_get_experiment()
  expected_artifact_location <- sprintf("%s/%s", getwd(), artifact_relative_path)
  expect_identical(experiment$artifact_location, expected_artifact_location)
  expect_identical(experiment$name, "foo")
})
```

--------------------------------------------------------------------------------

````

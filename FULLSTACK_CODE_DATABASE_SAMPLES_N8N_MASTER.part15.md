---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 15
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 15 of 51)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - n8n-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/n8n-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: data-request-response-reconstruct.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/data-request/data-request-response-reconstruct.ts
Signals: N/A
Excerpt (<=80 chars): export class DataRequestResponseReconstruct {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataRequestResponseReconstruct
```

--------------------------------------------------------------------------------

---[FILE: js-task-runner.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/js-task-runner.ts
Signals: N/A
Excerpt (<=80 chars):  export interface RpcCallObject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsTaskRunner
- RpcCallObject
- JSExecSettings
- JsTaskData
```

--------------------------------------------------------------------------------

---[FILE: obj-utils.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/obj-utils.ts
Signals: N/A
Excerpt (<=80 chars): export function isObject(maybe: unknown): maybe is object {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isObject
```

--------------------------------------------------------------------------------

---[FILE: require-resolver.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/require-resolver.ts
Signals: N/A
Excerpt (<=80 chars):  export type RequireResolverOpts = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createRequireResolver
- RequireResolverOpts
- RequireResolver
```

--------------------------------------------------------------------------------

---[FILE: acorn-helpers.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/built-ins-parser/acorn-helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function isLiteral(node?: Node): node is Literal {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isLiteral
- isIdentifier
- isMemberExpression
- isVariableDeclarator
- isAssignmentExpression
```

--------------------------------------------------------------------------------

---[FILE: built-ins-parser-state.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/built-ins-parser/built-ins-parser-state.ts
Signals: N/A
Excerpt (<=80 chars): export class BuiltInsParserState {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BuiltInsParserState
```

--------------------------------------------------------------------------------

---[FILE: built-ins-parser.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/built-ins-parser/built-ins-parser.ts
Signals: N/A
Excerpt (<=80 chars): export class BuiltInsParser {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BuiltInsParser
```

--------------------------------------------------------------------------------

---[FILE: disallowed-module.error.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/errors/disallowed-module.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class DisallowedModuleError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DisallowedModuleError
```

--------------------------------------------------------------------------------

---[FILE: error-like.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/errors/error-like.ts
Signals: N/A
Excerpt (<=80 chars): export interface ErrorLike {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isErrorLike
- ErrorLike
```

--------------------------------------------------------------------------------

---[FILE: execution-error.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/errors/execution-error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExecutionError extends SerializableError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionError
```

--------------------------------------------------------------------------------

---[FILE: serializable-error.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/errors/serializable-error.ts
Signals: N/A
Excerpt (<=80 chars): export function makeSerializable(error: Error) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- makeSerializable
```

--------------------------------------------------------------------------------

---[FILE: task-cancelled-error.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/errors/task-cancelled-error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskCancelledError extends ApplicationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskCancelledError
```

--------------------------------------------------------------------------------

---[FILE: timeout-error.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/errors/timeout-error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TimeoutError extends ApplicationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TimeoutError
```

--------------------------------------------------------------------------------

---[FILE: unsupported-function.error.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/errors/unsupported-function.error.ts
Signals: N/A
Excerpt (<=80 chars): export class UnsupportedFunctionError extends ApplicationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnsupportedFunctionError
```

--------------------------------------------------------------------------------

---[FILE: test-data.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/js-task-runner/__tests__/test-data.ts
Signals: N/A
Excerpt (<=80 chars): export const newTaskParamsWithSettings = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- newTaskParamsWithSettings
- newNode
- newTaskData
- newDataRequestResponse
- wrapIntoJson
- withPairedItem
- newTaskState
```

--------------------------------------------------------------------------------

---[FILE: env.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/env.py
Signals: N/A
Excerpt (<=80 chars):  def read_env(env_name: str) -> str | None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- read_env
- read_str_env
- read_int_env
- read_bool_env
```

--------------------------------------------------------------------------------

---[FILE: health_check_server.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/health_check_server.py
Signals: N/A
Excerpt (<=80 chars):  class HealthCheckServer:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HealthCheckServer
- __init__
```

--------------------------------------------------------------------------------

---[FILE: import_validation.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/import_validation.py
Signals: N/A
Excerpt (<=80 chars):  def validate_module_import(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validate_module_import
```

--------------------------------------------------------------------------------

---[FILE: logs.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/logs.py
Signals: N/A
Excerpt (<=80 chars):  class ColorFormatter(logging.Formatter):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ColorFormatter
- __init__
- format
- setup_logging
```

--------------------------------------------------------------------------------

---[FILE: message_serde.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/message_serde.py
Signals: N/A
Excerpt (<=80 chars):  def _get_node_mode(node_mode_str: str) -> NodeMode:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _get_node_mode
- _parse_task_settings
- _parse_task_offer_accept
- _parse_task_cancel
- _parse_rpc_response
- MessageSerde
- deserialize_broker_message
- serialize_runner_message
- _snake_to_camel_case
```

--------------------------------------------------------------------------------

---[FILE: nanoid.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/nanoid.py
Signals: N/A
Excerpt (<=80 chars):  def nanoid() -> str:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nanoid
```

--------------------------------------------------------------------------------

---[FILE: pipe_reader.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/pipe_reader.py
Signals: N/A
Excerpt (<=80 chars):  class PipeReader(threading.Thread):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PipeReader
- __init__
- run
- _read_exact_bytes
- _validate_pipe_message
```

--------------------------------------------------------------------------------

---[FILE: sentry.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/sentry.py
Signals: N/A
Excerpt (<=80 chars):  class TaskRunnerSentry:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerSentry
- __init__
- init
- shutdown
- _filter_out_ignored_errors
- _is_from_user_code
- setup_sentry
```

--------------------------------------------------------------------------------

---[FILE: shutdown.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/shutdown.py
Signals: N/A
Excerpt (<=80 chars):  class Shutdown:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Shutdown
- __init__
- _register_handler
```

--------------------------------------------------------------------------------

---[FILE: task_analyzer.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/task_analyzer.py
Signals: N/A
Excerpt (<=80 chars):  class SecurityValidator(ast.NodeVisitor):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityValidator
- __init__
- visit_Import
- visit_ImportFrom
- visit_Name
- visit_Attribute
- visit_Call
- visit_Subscript
- _validate_import
- _add_violation
- TaskAnalyzer
- validate
- _raise_security_error
- _to_cache_key
- _set_in_cache
```

--------------------------------------------------------------------------------

---[FILE: task_executor.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/task_executor.py
Signals: N/A
Excerpt (<=80 chars):  class TaskExecutor:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskExecutor
- create_process
- execute_process
- stop_process
- _all_items
- _per_item
- _wrap_code
- _extract_json_data_per_item
- _put_result
- _put_error
- _create_custom_print
- custom_print
- _format_print_args
- _truncate_print_args
- _filter_builtins
- _sanitize_sys_modules
- _create_safe_import
- safe_import
```

--------------------------------------------------------------------------------

---[FILE: task_runner.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/task_runner.py
Signals: N/A
Excerpt (<=80 chars): class TaskOffer:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskOffer
- has_expired
- TaskRunner
- __init__
- running_tasks_count
- _get_duration
- _get_result_size
- _reset_idle_timer
```

--------------------------------------------------------------------------------

---[FILE: task_state.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/task_state.py
Signals: N/A
Excerpt (<=80 chars):  class TaskStatus(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskStatus
- TaskState
- __init__
- context
```

--------------------------------------------------------------------------------

---[FILE: health_check_config.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/config/health_check_config.py
Signals: N/A
Excerpt (<=80 chars): class HealthCheckConfig:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HealthCheckConfig
- from_env
```

--------------------------------------------------------------------------------

---[FILE: security_config.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/config/security_config.py
Signals: N/A
Excerpt (<=80 chars): class SecurityConfig:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityConfig
```

--------------------------------------------------------------------------------

---[FILE: sentry_config.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/config/sentry_config.py
Signals: N/A
Excerpt (<=80 chars): class SentryConfig:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SentryConfig
- enabled
- from_env
```

--------------------------------------------------------------------------------

---[FILE: task_runner_config.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/config/task_runner_config.py
Signals: N/A
Excerpt (<=80 chars):  def parse_allowlist(allowlist_str: str, list_name: str) -> set[str]:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parse_allowlist
- TaskRunnerConfig
- is_auto_shutdown_enabled
- from_env
```

--------------------------------------------------------------------------------

---[FILE: configuration_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/configuration_error.py
Signals: N/A
Excerpt (<=80 chars): class ConfigurationError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConfigurationError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: invalid_pipe_msg_content_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/invalid_pipe_msg_content_error.py
Signals: N/A
Excerpt (<=80 chars): class InvalidPipeMsgContentError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidPipeMsgContentError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: invalid_pipe_msg_length_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/invalid_pipe_msg_length_error.py
Signals: N/A
Excerpt (<=80 chars): class InvalidPipeMsgLengthError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidPipeMsgLengthError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: no_idle_timeout_handler_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/no_idle_timeout_handler_error.py
Signals: N/A
Excerpt (<=80 chars): class NoIdleTimeoutHandlerError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoIdleTimeoutHandlerError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: security_violation_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/security_violation_error.py
Signals: N/A
Excerpt (<=80 chars): class SecurityViolationError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityViolationError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: task_cancelled_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/task_cancelled_error.py
Signals: N/A
Excerpt (<=80 chars): class TaskCancelledError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskCancelledError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: task_killed_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/task_killed_error.py
Signals: N/A
Excerpt (<=80 chars): class TaskKilledError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskKilledError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: task_missing_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/task_missing_error.py
Signals: N/A
Excerpt (<=80 chars): class TaskMissingError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskMissingError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: task_result_missing_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/task_result_missing_error.py
Signals: N/A
Excerpt (<=80 chars): class TaskResultMissingError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskResultMissingError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: task_result_read_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/task_result_read_error.py
Signals: N/A
Excerpt (<=80 chars): class TaskResultReadError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskResultReadError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: task_runtime_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/task_runtime_error.py
Signals: N/A
Excerpt (<=80 chars):  class TaskRuntimeError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRuntimeError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: task_subprocess_failed_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/task_subprocess_failed_error.py
Signals: N/A
Excerpt (<=80 chars): class TaskSubprocessFailedError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskSubprocessFailedError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: task_timeout_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/task_timeout_error.py
Signals: N/A
Excerpt (<=80 chars): class TaskTimeoutError(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskTimeoutError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: websocket_connection_error.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/errors/websocket_connection_error.py
Signals: N/A
Excerpt (<=80 chars): class WebsocketConnectionError(ConnectionError):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsocketConnectionError
- __init__
```

--------------------------------------------------------------------------------

---[FILE: broker.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/message_types/broker.py
Signals: N/A
Excerpt (<=80 chars): class BrokerInfoRequest:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BrokerInfoRequest
- BrokerRunnerRegistered
- BrokerTaskOfferAccept
- TaskSettings
- BrokerTaskSettings
- BrokerTaskCancel
- BrokerRpcResponse
```

--------------------------------------------------------------------------------

---[FILE: pipe.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/message_types/pipe.py
Signals: N/A
Excerpt (<=80 chars):  class TaskErrorInfo(TypedDict):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskErrorInfo
- PipeResultMessage
- PipeErrorMessage
```

--------------------------------------------------------------------------------

---[FILE: runner.py]---
Location: n8n-master/packages/@n8n/task-runner-python/src/message_types/runner.py
Signals: N/A
Excerpt (<=80 chars): class RunnerInfo:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RunnerInfo
- RunnerTaskOffer
- RunnerTaskAccepted
- RunnerTaskRejected
- RunnerTaskDone
- RunnerTaskError
- RunnerRpcCall
```

--------------------------------------------------------------------------------

---[FILE: local_task_broker.py]---
Location: n8n-master/packages/@n8n/task-runner-python/tests/fixtures/local_task_broker.py
Signals: N/A
Excerpt (<=80 chars): class ActiveTask:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActiveTask
- LocalTaskBroker
- __init__
- get_url
- get_messages_of_type
- get_task_rpc_messages
```

--------------------------------------------------------------------------------

---[FILE: task_runner_manager.py]---
Location: n8n-master/packages/@n8n/task-runner-python/tests/fixtures/task_runner_manager.py
Signals: N/A
Excerpt (<=80 chars):  class TaskRunnerManager:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerManager
- __init__
- is_running
- get_health_check_url
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: n8n-master/packages/@n8n/task-runner-python/tests/integration/conftest.py
Signals: N/A
Excerpt (<=80 chars):  def create_task_settings(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- create_task_settings
- get_browser_console_msgs
```

--------------------------------------------------------------------------------

---[FILE: test_env.py]---
Location: n8n-master/packages/@n8n/task-runner-python/tests/unit/test_env.py
Signals: N/A
Excerpt (<=80 chars):  class TestReadEnv:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestReadEnv
- test_returns_direct_env_var_when_exists
- test_returns_none_when_no_env_var
- test_reads_from_file_when_file_env_var_exists
- test_strips_whitespace_from_file_content
- test_direct_env_var_takes_precedence_over_file
- test_raises_error_when_file_not_found
- test_handles_empty_file
- test_handles_multiline_file_content
- test_handles_unicode_content
- test_raises_error_with_permission_denied
- TestReadStrEnv
- test_returns_string_from_direct_env
- test_returns_string_from_file
- test_returns_default_when_not_set
- test_handles_empty_string_from_env
- TestReadIntEnv
- test_returns_int_from_direct_env
```

--------------------------------------------------------------------------------

---[FILE: test_sentry.py]---
Location: n8n-master/packages/@n8n/task-runner-python/tests/unit/test_sentry.py
Signals: N/A
Excerpt (<=80 chars): def sentry_config():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sentry_config
- disabled_sentry_config
- TestTaskRunnerSentry
- test_init_configures_sentry_correctly
- test_shutdown_flushes_sentry
- test_filter_out_ignored_errors
- test_filter_out_syntax_error_subclasses
- test_filter_out_errors_by_type_name
- test_filter_out_user_code_errors_from_executors
- test_allows_non_user_code_errors
- test_handles_malformed_exception_data
- TestSetupSentry
- test_returns_none_when_disabled
- test_initializes_sentry_when_enabled
- test_handles_import_error
- test_handles_general_exception
- TestSentryConfig
- test_enabled_returns_true_with_dsn
```

--------------------------------------------------------------------------------

---[FILE: test_task_analyzer.py]---
Location: n8n-master/packages/@n8n/task-runner-python/tests/unit/test_task_analyzer.py
Signals: N/A
Excerpt (<=80 chars):  class TestTaskAnalyzer:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestTaskAnalyzer
- analyzer
- TestImportValidation
- test_allowed_standard_imports
- test_blocked_dangerous_imports
- test_blocked_relative_imports
- TestAttributeAccessValidation
- test_all_blocked_attributes_are_blocked
- test_all_blocked_names_are_blocked
- test_loader_access_attempts_blocked
- test_spec_access_attempts_blocked
- test_dunder_name_attempts_blocked
- test_allowed_attribute_access
- test_name_mangled_attributes_blocked
- TestDynamicImportDetection
- test_various_dynamic_import_patterns
- test_allowed_modules_via_dynamic_import
- TestAllowAll
```

--------------------------------------------------------------------------------

---[FILE: test_task_executor.py]---
Location: n8n-master/packages/@n8n/task-runner-python/tests/unit/test_task_executor.py
Signals: N/A
Excerpt (<=80 chars):  class TestTaskExecutorProcessExitHandling:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestTaskExecutorProcessExitHandling
- test_sigterm_raises_task_cancelled_error
- test_sigkill_raises_task_killed_error
- test_other_non_zero_exit_code_raises_task_subprocess_failed_error
- test_zero_exit_code_with_empty_pipe_raises_task_result_read_error
- TestTaskExecutorPipeCommunication
- test_successful_result_communication
- test_successful_error_communication
- TestTaskExecutorLowLevelIO
- test_read_exact_bytes_single_read
- test_read_exact_bytes_multiple_reads
- test_read_exact_bytes_eof_error
- test_write_bytes_write_failure
```

--------------------------------------------------------------------------------

---[FILE: test_task_runner.py]---
Location: n8n-master/packages/@n8n/task-runner-python/tests/unit/test_task_runner.py
Signals: N/A
Excerpt (<=80 chars):  class TestTaskRunnerConnectionRetry:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestTaskRunnerConnectionRetry
- config
- connection_side_effect
```

--------------------------------------------------------------------------------

---[FILE: assert.ts]---
Location: n8n-master/packages/@n8n/utils/src/assert.ts
Signals: N/A
Excerpt (<=80 chars): export function assert(condition: unknown, message?: string): asserts conditi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- assert
```

--------------------------------------------------------------------------------

---[FILE: event-bus.ts]---
Location: n8n-master/packages/@n8n/utils/src/event-bus.ts
Signals: N/A
Excerpt (<=80 chars): export type CallbackFn = (...args: any[]) => any;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CallbackFn
- EventBus
```

--------------------------------------------------------------------------------

---[FILE: sanitize.ts]---
Location: n8n-master/packages/@n8n/utils/src/files/sanitize.ts
Signals: N/A
Excerpt (<=80 chars): export const sanitizeFilename = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizeFilename
```

--------------------------------------------------------------------------------

---[FILE: smartDecimal.ts]---
Location: n8n-master/packages/@n8n/utils/src/number/smartDecimal.ts
Signals: N/A
Excerpt (<=80 chars): export const smartDecimal = (value: number, decimals = 2): number => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- smartDecimal
```

--------------------------------------------------------------------------------

---[FILE: sublimeSearch.ts]---
Location: n8n-master/packages/@n8n/utils/src/search/sublimeSearch.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_KEYS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_KEYS
```

--------------------------------------------------------------------------------

---[FILE: sortByProperty.ts]---
Location: n8n-master/packages/@n8n/utils/src/sort/sortByProperty.ts
Signals: N/A
Excerpt (<=80 chars): export const sortByProperty = <T>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sortByProperty
```

--------------------------------------------------------------------------------

---[FILE: truncate.ts]---
Location: n8n-master/packages/@n8n/utils/src/string/truncate.ts
Signals: N/A
Excerpt (<=80 chars): export const truncate = (text: string, length = 30): string =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- truncateBeforeLast
- truncate
```

--------------------------------------------------------------------------------

---[FILE: frontend.ts]---
Location: n8n-master/packages/@n8n/vitest-config/frontend.ts
Signals: N/A
Excerpt (<=80 chars):  export const createVitestConfig = (options: InlineConfig = {}) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createVitestConfig
- vitestConfig
```

--------------------------------------------------------------------------------

---[FILE: node.ts]---
Location: n8n-master/packages/@n8n/vitest-config/node.ts
Signals: N/A
Excerpt (<=80 chars):  export const createVitestConfig = (options: InlineConfig = {}) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createVitestConfig
- vitestConfig
```

--------------------------------------------------------------------------------

---[FILE: abstract-server.ts]---
Location: n8n-master/packages/cli/src/abstract-server.ts
Signals: Express
Excerpt (<=80 chars): import { inTest, inDevelopment, Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: activation-errors.service.ts]---
Location: n8n-master/packages/cli/src/activation-errors.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ActivationErrorsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActivationErrorsService
```

--------------------------------------------------------------------------------

---[FILE: active-executions.ts]---
Location: n8n-master/packages/cli/src/active-executions.ts
Signals: N/A
Excerpt (<=80 chars): export class ActiveExecutions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActiveExecutions
```

--------------------------------------------------------------------------------

---[FILE: active-workflow-manager.ts]---
Location: n8n-master/packages/cli/src/active-workflow-manager.ts
Signals: N/A
Excerpt (<=80 chars): export class ActiveWorkflowManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActiveWorkflowManager
```

--------------------------------------------------------------------------------

---[FILE: command-registry.ts]---
Location: n8n-master/packages/cli/src/command-registry.ts
Signals: Zod
Excerpt (<=80 chars): export class CommandRegistry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommandRegistry
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const inE2ETests = E2E_TESTS === 'true';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- inE2ETests
- CUSTOM_API_CALL_NAME
- CUSTOM_API_CALL_KEY
- CLI_DIR
- TEMPLATES_DIR
- NODES_BASE_DIR
- EDITOR_UI_DIST_DIR
- N8N_VERSION
- N8N_RELEASE_DATE
- STARTING_NODES
- TRIGGER_COUNT_EXCLUDED_NODES
- MCP_TRIGGER_NODE_TYPE
- NODE_PACKAGE_PREFIX
- STARTER_TEMPLATE_NAME
- RESPONSE_ERROR_MESSAGES
- AUTH_COOKIE_NAME
- OIDC_STATE_COOKIE_NAME
- OIDC_NONCE_COOKIE_NAME
```

--------------------------------------------------------------------------------

---[FILE: controller.registry.ts]---
Location: n8n-master/packages/cli/src/controller.registry.ts
Signals: Express, Zod
Excerpt (<=80 chars): export class ControllerRegistry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControllerRegistry
```

--------------------------------------------------------------------------------

---[FILE: crash-journal.ts]---
Location: n8n-master/packages/cli/src/crash-journal.ts
Signals: N/A
Excerpt (<=80 chars):  export const touchFile = async (filePath: string): Promise<void> => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- touchFile
- init
- cleanup
```

--------------------------------------------------------------------------------

---[FILE: credential-types.ts]---
Location: n8n-master/packages/cli/src/credential-types.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialTypes implements ICredentialTypes {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialTypes
```

--------------------------------------------------------------------------------

---[FILE: credentials-helper.ts]---
Location: n8n-master/packages/cli/src/credentials-helper.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialsHelper extends ICredentialsHelper {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createCredentialsFromCredentialsEntity
- CredentialsHelper
```

--------------------------------------------------------------------------------

---[FILE: credentials-overwrites.ts]---
Location: n8n-master/packages/cli/src/credentials-overwrites.ts
Signals: Express
Excerpt (<=80 chars): export class CredentialsOverwrites {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsOverwrites
```

--------------------------------------------------------------------------------

---[FILE: external-hooks.ts]---
Location: n8n-master/packages/cli/src/external-hooks.ts
Signals: N/A
Excerpt (<=80 chars): export class ExternalHooks {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalHooks
```

--------------------------------------------------------------------------------

---[FILE: generic-helpers.ts]---
Location: n8n-master/packages/cli/src/generic-helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_EXECUTIONS_GET_ALL_LIMIT = 20;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_EXECUTIONS_GET_ALL_LIMIT
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/cli/src/interfaces.ts
Signals: Express
Excerpt (<=80 chars):  export interface ICredentialsTypeData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICredentialsDecryptedDb
- ICredentialsDecryptedResponse
- SaveExecutionDataType
- UpdateExecutionPayload
- ICredentialsTypeData
- ICredentialsOverwrite
- ITagToImport
- IWorkflowResponse
- IWorkflowToImport
- IExecutionFlatted
- IExecutionFlattedResponse
- IExecutionsListResponse
- ExecutionStopResult
- IExecutionsCurrentSummary
- IExecutingWorkflowData
- IActiveDirectorySettings
- IPackageVersions
- IWorkflowErrorData
```

--------------------------------------------------------------------------------

---[FILE: license.ts]---
Location: n8n-master/packages/cli/src/license.ts
Signals: N/A
Excerpt (<=80 chars):  export type FeatureReturnType = Partial<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- License
- FeatureReturnType
```

--------------------------------------------------------------------------------

---[FILE: load-nodes-and-credentials.ts]---
Location: n8n-master/packages/cli/src/load-nodes-and-credentials.ts
Signals: N/A
Excerpt (<=80 chars): export class LoadNodesAndCredentials {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadNodesAndCredentials
```

--------------------------------------------------------------------------------

---[FILE: manual-execution.service.ts]---
Location: n8n-master/packages/cli/src/manual-execution.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ManualExecutionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManualExecutionService
```

--------------------------------------------------------------------------------

---[FILE: node-types.ts]---
Location: n8n-master/packages/cli/src/node-types.ts
Signals: N/A
Excerpt (<=80 chars): export class NodeTypes implements INodeTypes {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeTypes
```

--------------------------------------------------------------------------------

---[FILE: requests.ts]---
Location: n8n-master/packages/cli/src/requests.ts
Signals: N/A
Excerpt (<=80 chars):  export type AuthlessRequest<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasSharing
- AuthlessRequest
- Request
- Params
- Options
- SurveyAnswers
- InviteResponse
- Delete
- Get
- PasswordResetLink
```

--------------------------------------------------------------------------------

---[FILE: response-helper.ts]---
Location: n8n-master/packages/cli/src/response-helper.ts
Signals: Express
Excerpt (<=80 chars):  export function sendSuccessResponse(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sendSuccessResponse
- sendErrorResponse
- reportError
- isUniqueConstraintError
```

--------------------------------------------------------------------------------

---[FILE: server.ts]---
Location: n8n-master/packages/cli/src/server.ts
Signals: Express
Excerpt (<=80 chars): export class Server extends AbstractServer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Server
```

--------------------------------------------------------------------------------

---[FILE: typed-emitter.ts]---
Location: n8n-master/packages/cli/src/typed-emitter.ts
Signals: N/A
Excerpt (<=80 chars):  export class TypedEmitter<ListenerMap extends Payloads<ListenerMap>> extends...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TypedEmitter
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/cli/src/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function isWorkflowIdValid(id: string | null | undefined): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isWorkflowIdValid
- removeTrailingSlash
- findSubworkflowStart
- findCliWorkflowStart
- toError
- isIntegerString
- assertNever
- isPositiveInteger
- shouldAssignExecuteMethod
- getAllKeyPaths
```

--------------------------------------------------------------------------------

---[FILE: utlity.types.ts]---
Location: n8n-master/packages/cli/src/utlity.types.ts
Signals: N/A
Excerpt (<=80 chars): export type Resolve<T> = T extends Function ? T : { [K in keyof T]: T[K] };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resolve
```

--------------------------------------------------------------------------------

---[FILE: wait-tracker.ts]---
Location: n8n-master/packages/cli/src/wait-tracker.ts
Signals: N/A
Excerpt (<=80 chars): export class WaitTracker {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WaitTracker
```

--------------------------------------------------------------------------------

---[FILE: workflow-execute-additional-data.ts]---
Location: n8n-master/packages/cli/src/workflow-execute-additional-data.ts
Signals: N/A
Excerpt (<=80 chars):  export function getRunData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRunData
- setExecutionStatus
- sendDataToUI
```

--------------------------------------------------------------------------------

---[FILE: workflow-helpers.ts]---
Location: n8n-master/packages/cli/src/workflow-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function getDataLastExecutedNodeData(inputData: IRun): ITaskData | und...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDataLastExecutedNodeData
- addNodeIds
- shouldRestartParentExecution
- getActiveVersionUpdateValue
```

--------------------------------------------------------------------------------

````

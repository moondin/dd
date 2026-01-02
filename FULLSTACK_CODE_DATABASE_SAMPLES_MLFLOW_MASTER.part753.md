---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 753
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 753 of 991)

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

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/utils/import_hooks/__init__.py

```python
"""
NOTE: The contents of this file have been inlined from the wrapt package's source code
https://github.com/GrahamDumpleton/wrapt/blob/1.12.1/src/wrapt/importer.py.
Some modifications, have been made in order to:
    - avoid duplicate registration of import hooks
    - inline functions from dependent wrapt submodules rather than importing them.

This module implements a post import hook mechanism styled after what is described in PEP-369.
Note that it doesn't cope with modules being reloaded.
It also extends the functionality to support custom hooks for import errors
(as opposed to only successful imports).
"""

import importlib.resources
import sys
import threading

string_types = (str,)


# from .decorators import synchronized
# NOTE: Instead of using this import (from wrapt's decorator module, see
# https://github.com/GrahamDumpleton/wrapt/blob/68316bea668fd905a4acb21f37f12596d8c30d80/src/wrapt/decorators.py#L430-L456),
# we define a decorator with similar behavior that acquires a lock while calling the decorated
# function
def synchronized(lock):
    def decorator(f):
        # See e.g. https://www.python.org/dev/peps/pep-0318/#examples
        def new_fn(*args, **kwargs):
            with lock:
                return f(*args, **kwargs)

        return new_fn

    return decorator


# The dictionary registering any post import hooks to be triggered once
# the target module has been imported. Once a module has been imported
# and the hooks fired, the list of hooks recorded against the target
# module will be truncated but the list left in the dictionary. This
# acts as a flag to indicate that the module had already been imported.

_post_import_hooks = {}
_post_import_hooks_lock = threading.RLock()

# A dictionary for any import hook error handlers to be triggered when the
# target module import fails.

_import_error_hooks = {}
_import_error_hooks_lock = threading.RLock()

_import_hook_finder_init = False

# Register a new post import hook for the target module name. This
# differs from the PEP-369 implementation in that it also allows the
# hook function to be specified as a string consisting of the name of
# the callback in the form 'module:function'. This will result in a
# proxy callback being registered which will defer loading of the
# specified module containing the callback function until required.


def _create_import_hook_from_string(name):
    def import_hook(module):
        module_name, function = name.split(":")
        attrs = function.split(".")
        __import__(module_name)
        callback = sys.modules[module_name]
        for attr in attrs:
            callback = getattr(callback, attr)
        return callback(module)

    return import_hook


def register_generic_import_hook(hook, name, hook_dict, overwrite):
    # Create a deferred import hook if hook is a string name rather than
    # a callable function.

    if isinstance(hook, string_types):
        hook = _create_import_hook_from_string(hook)

    # Automatically install the import hook finder if it has not already
    # been installed.

    global _import_hook_finder_init
    if not _import_hook_finder_init:
        _import_hook_finder_init = True
        sys.meta_path.insert(0, ImportHookFinder())

    # Determine if any prior registration of an import hook for
    # the target modules has occurred and act appropriately.

    hooks = hook_dict.get(name, None)

    if hooks is None:
        # No prior registration of import hooks for the target
        # module. We need to check whether the module has already been
        # imported. If it has we fire the hook immediately and add an
        # empty list to the registry to indicate that the module has
        # already been imported and hooks have fired. Otherwise add
        # the post import hook to the registry.

        module = sys.modules.get(name, None)

        if module is not None:
            hook_dict[name] = []
            hook(module)

        else:
            hook_dict[name] = [hook]

    elif hooks == []:
        # A prior registration of import hooks for the target
        # module was done and the hooks already fired. Fire the hook
        # immediately.

        module = sys.modules[name]
        hook(module)

    else:
        # A prior registration of import hooks for the target
        # module was done but the module has not yet been imported.

        def hooks_equal(existing_hook, hook):
            if hasattr(existing_hook, "__name__") and hasattr(hook, "__name__"):
                return existing_hook.__name__ == hook.__name__
            else:
                return False

        if overwrite:
            hook_dict[name] = [
                existing_hook
                for existing_hook in hook_dict[name]
                if not hooks_equal(existing_hook, hook)
            ]

        hook_dict[name].append(hook)


@synchronized(_import_error_hooks_lock)
def register_import_error_hook(hook, name, overwrite=True):
    """
    Args:
        hook: A function or string entrypoint to invoke when the specified module is imported
            and an error occurs.
        name: The name of the module for which to fire the hook at import error detection time.
        overwrite: Specifies the desired behavior when a preexisting hook for the same
            function / entrypoint already exists for the specified module. If `True`,
            all preexisting hooks matching the specified function / entrypoint will be
            removed and replaced with a single instance of the specified `hook`.
    """
    register_generic_import_hook(hook, name, _import_error_hooks, overwrite)


@synchronized(_post_import_hooks_lock)
def register_post_import_hook(hook, name, overwrite=True):
    """
    Args:
        hook: A function or string entrypoint to invoke when the specified module is imported.
        name: The name of the module for which to fire the hook at import time.
        overwrite: Specifies the desired behavior when a preexisting hook for the same
            function / entrypoint already exists for the specified module. If `True`,
            all preexisting hooks matching the specified function / entrypoint will be
            removed and replaced with a single instance of the specified `hook`.
    """
    register_generic_import_hook(hook, name, _post_import_hooks, overwrite)


@synchronized(_post_import_hooks_lock)
def get_post_import_hooks(name):
    return _post_import_hooks.get(name)


# Register post import hooks defined as package entry points.


def _create_import_hook_from_entrypoint(entrypoint):
    def import_hook(module):
        __import__(entrypoint.module_name)
        callback = sys.modules[entrypoint.module_name]
        for attr in entrypoint.attrs:
            callback = getattr(callback, attr)
        return callback(module)

    return import_hook


def discover_post_import_hooks(group):
    for entrypoint in (
        resource.name
        for resource in importlib.resources.files(group).iterdir()
        if resource.is_file()
    ):
        callback = _create_import_hook_from_entrypoint(entrypoint)
        register_post_import_hook(callback, entrypoint.name)


# Indicate that a module has been loaded. Any post import hooks which
# were registered against the target module will be invoked. If an
# exception is raised in any of the post import hooks, that will cause
# the import of the target module to fail.


@synchronized(_post_import_hooks_lock)
def notify_module_loaded(module):
    name = getattr(module, "__name__", None)
    if hooks := _post_import_hooks.get(name):
        _post_import_hooks[name] = []

        for hook in hooks:
            hook(module)


@synchronized(_import_error_hooks_lock)
def notify_module_import_error(module_name):
    if hooks := _import_error_hooks.get(module_name):
        # Error hooks differ from post import hooks, in that we don't clear the
        # hook as soon as it fires.
        for hook in hooks:
            hook(module_name)


# A custom module import finder. This intercepts attempts to import
# modules and watches out for attempts to import target modules of
# interest. When a module of interest is imported, then any post import
# hooks which are registered will be invoked.


class _ImportHookChainedLoader:
    def __init__(self, loader):
        self.loader = loader

    def load_module(self, fullname):
        try:
            module = self.loader.load_module(fullname)
            notify_module_loaded(module)
        except (ImportError, AttributeError):
            notify_module_import_error(fullname)
            raise

        return module


class ImportHookFinder:
    def __init__(self):
        self.in_progress = {}

    @synchronized(_post_import_hooks_lock)
    @synchronized(_import_error_hooks_lock)
    def find_module(self, fullname, path=None):
        # If the module being imported is not one we have registered
        # import hooks for, we can return immediately. We will
        # take no further part in the importing of this module.

        if fullname not in _post_import_hooks and fullname not in _import_error_hooks:
            return None

        # When we are interested in a specific module, we will call back
        # into the import system a second time to defer to the import
        # finder that is supposed to handle the importing of the module.
        # We set an in progress flag for the target module so that on
        # the second time through we don't trigger another call back
        # into the import system and cause a infinite loop.

        if fullname in self.in_progress:
            return None

        self.in_progress[fullname] = True

        # Now call back into the import system again.

        try:
            # For Python 3 we need to use find_spec().loader
            # from the importlib.util module. It doesn't actually
            # import the target module and only finds the
            # loader. If a loader is found, we need to return
            # our own loader which will then in turn call the
            # real loader to import the module and invoke the
            # post import hooks.
            try:
                import importlib.util  # clint: disable=lazy-builtin-import

                loader = importlib.util.find_spec(fullname).loader
            # If an ImportError (or AttributeError) is encountered while finding the module,
            # notify the hooks for import errors
            except (ImportError, AttributeError):
                notify_module_import_error(fullname)
                loader = importlib.find_loader(fullname, path)
            if loader:
                return _ImportHookChainedLoader(loader)
        finally:
            del self.in_progress[fullname]

    @synchronized(_post_import_hooks_lock)
    @synchronized(_import_error_hooks_lock)
    def find_spec(self, fullname, path, target=None):
        # If the module being imported is not one we have registered
        # import hooks for, we can return immediately. We will
        # take no further part in the importing of this module.

        if fullname not in _post_import_hooks and fullname not in _import_error_hooks:
            return None

        # When we are interested in a specific module, we will call back
        # into the import system a second time to defer to the import
        # finder that is supposed to handle the importing of the module.
        # We set an in progress flag for the target module so that on
        # the second time through we don't trigger another call back
        # into the import system and cause a infinite loop.

        if fullname in self.in_progress:
            return None

        self.in_progress[fullname] = True

        # Now call back into the import system again.

        try:
            import importlib.util  # clint: disable=lazy-builtin-import

            spec = importlib.util.find_spec(fullname)
            # Replace the module spec's loader with a wrapped version that executes import
            # hooks when the module is loaded
            spec.loader = _ImportHookChainedLoader(spec.loader)
            return spec
        except (ImportError, AttributeError):
            notify_module_import_error(fullname)
        finally:
            del self.in_progress[fullname]


# Decorator for marking that a function should be called as a post
# import hook when the target module is imported.
# If error_handler is True, then apply the marked function as an import hook
# for import errors (instead of successful imports).
# It is assumed that all error hooks are added during driver start-up,
# and thus added prior to any import calls. If an error hook is added
# after a module has already failed the import, there's no guarantee
# that the hook will fire.


def when_imported(name, error_handler=False):
    def register(hook):
        if error_handler:
            register_import_error_hook(hook, name)
        else:
            register_post_import_hook(hook, name)
        return hook

    return register
```

--------------------------------------------------------------------------------

---[FILE: constants.py]---
Location: mlflow-master/mlflow/webhooks/constants.py

```python
# MLflow webhook headers
WEBHOOK_SIGNATURE_HEADER = "X-MLflow-Signature"
WEBHOOK_TIMESTAMP_HEADER = "X-MLflow-Timestamp"
WEBHOOK_DELIVERY_ID_HEADER = "X-MLflow-Delivery-Id"

# Webhook signature version
WEBHOOK_SIGNATURE_VERSION = "v1"
```

--------------------------------------------------------------------------------

---[FILE: delivery.py]---
Location: mlflow-master/mlflow/webhooks/delivery.py

```python
"""Webhook delivery implementation following Standard Webhooks conventions.

This module implements webhook delivery patterns similar to the Standard Webhooks
specification (https://www.standardwebhooks.com), providing consistent and secure
webhook delivery with HMAC signature verification and timestamp-based replay protection.
"""

import base64
import hashlib
import hmac
import json
import logging
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

import requests
import urllib3
from cachetools import TTLCache
from packaging.version import Version
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from mlflow.entities.webhook import Webhook, WebhookEvent, WebhookTestResult
from mlflow.environment_variables import (
    MLFLOW_WEBHOOK_CACHE_TTL,
    MLFLOW_WEBHOOK_DELIVERY_MAX_WORKERS,
    MLFLOW_WEBHOOK_REQUEST_MAX_RETRIES,
    MLFLOW_WEBHOOK_REQUEST_TIMEOUT,
)
from mlflow.store.model_registry.abstract_store import AbstractStore
from mlflow.store.model_registry.file_store import FileStore
from mlflow.webhooks.constants import (
    WEBHOOK_DELIVERY_ID_HEADER,
    WEBHOOK_SIGNATURE_HEADER,
    WEBHOOK_SIGNATURE_VERSION,
    WEBHOOK_TIMESTAMP_HEADER,
)
from mlflow.webhooks.types import (
    WebhookPayload,
    get_example_payload_for_event,
)

_logger = logging.getLogger(__name__)

# Thread pool for non-blocking webhook delivery
_webhook_delivery_executor = ThreadPoolExecutor(
    max_workers=MLFLOW_WEBHOOK_DELIVERY_MAX_WORKERS.get(),
    thread_name_prefix="webhook-delivery",
)

# Shared session for webhook requests (thread-safe)
_webhook_session: requests.Session | None = None
_webhook_session_lock: threading.Lock = threading.Lock()

# Cache for webhook listings by event
# TTLCache is thread-safe for basic operations, but we still use a lock for
# complex operations to ensure consistency
_webhook_cache_lock: threading.Lock = threading.Lock()
_webhook_cache: TTLCache[WebhookEvent, list[Webhook]] | None = None


def _create_webhook_session() -> requests.Session:
    """Create a new webhook session with retry configuration.

    Returns:
        Configured requests.Session object
    """
    max_retries = MLFLOW_WEBHOOK_REQUEST_MAX_RETRIES.get()

    # urllib3 >= 2.0 supports additional features
    extra_kwargs = {}
    if Version(urllib3.__version__) >= Version("2.0"):
        extra_kwargs["backoff_jitter"] = 1.0  # Add up to 1 second of jitter

    retry_strategy = Retry(
        total=max_retries,
        status_forcelist=[429, 500, 502, 503, 504],  # Retry on these status codes
        allowed_methods=["POST"],  # Only retry POST requests
        backoff_factor=1.0,  # Exponential backoff: 1s, 2s, 4s, etc.
        backoff_max=60.0,  # Cap maximum backoff at 60 seconds
        respect_retry_after_header=True,  # Automatically handle Retry-After headers
        raise_on_status=False,  # Don't raise on these status codes
        **extra_kwargs,
    )

    adapter = HTTPAdapter(max_retries=retry_strategy)
    session = requests.Session()
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    return session


def _get_or_create_webhook_session() -> requests.Session:
    """Get or create a shared webhook session with retry configuration.

    Returns:
        Configured requests.Session object
    """
    global _webhook_session

    if _webhook_session is None:  # To avoid unnecessary locking
        with _webhook_session_lock:
            if _webhook_session is None:
                _webhook_session = _create_webhook_session()

    return _webhook_session


def _generate_hmac_signature(secret: str, delivery_id: str, timestamp: str, payload: str) -> str:
    """Generate webhook HMAC-SHA256 signature.

    Args:
        secret: The webhook secret key
        delivery_id: The unique delivery ID
        timestamp: Unix timestamp as string
        payload: The JSON payload as string

    Returns:
        The signature in the format "v1,<base64_encoded_signature>"
    """
    # Signature format: delivery_id.timestamp.payload
    signed_content = f"{delivery_id}.{timestamp}.{payload}"
    signature = hmac.new(
        secret.encode("utf-8"), signed_content.encode("utf-8"), hashlib.sha256
    ).digest()
    signature_b64 = base64.b64encode(signature).decode("utf-8")
    return f"{WEBHOOK_SIGNATURE_VERSION},{signature_b64}"


def _send_webhook_request(
    webhook: Webhook,
    payload: WebhookPayload,
    event: WebhookEvent,
    session: requests.Session,
) -> requests.Response:
    """Send a webhook request to the specified URL with retry logic.

    Args:
        webhook: The webhook object containing the URL and secret
        payload: The payload to send
        event: The webhook event type
        session: Configured requests session with retry logic

    Returns:
        requests.Response object from the webhook request
    """
    # Create webhook payload with metadata
    webhook_payload = {
        "entity": event.entity.value,
        "action": event.action.value,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": payload,
    }

    payload_json = json.dumps(webhook_payload)
    payload_bytes = payload_json.encode("utf-8")

    # Generate IDs and timestamps for webhooks
    delivery_id = str(uuid.uuid4())
    unix_timestamp = str(int(time.time()))

    # MLflow webhook headers
    headers = {
        "Content-Type": "application/json",
        WEBHOOK_DELIVERY_ID_HEADER: delivery_id,
        WEBHOOK_TIMESTAMP_HEADER: unix_timestamp,
    }

    # Add signature if secret is configured
    if webhook.secret:
        signature = _generate_hmac_signature(
            webhook.secret, delivery_id, unix_timestamp, payload_json
        )
        headers[WEBHOOK_SIGNATURE_HEADER] = signature

    timeout = MLFLOW_WEBHOOK_REQUEST_TIMEOUT.get()

    try:
        return session.post(webhook.url, data=payload_bytes, headers=headers, timeout=timeout)
    except requests.exceptions.RetryError as e:
        # urllib3 exhausted all retries
        max_retries = MLFLOW_WEBHOOK_REQUEST_MAX_RETRIES.get()
        _logger.error(f"Webhook request to {webhook.url} failed after {max_retries} retries: {e}")
        raise
    except requests.RequestException as e:
        # Other request errors
        _logger.error(f"Webhook request to {webhook.url} failed: {e}")
        raise


def _get_or_create_webhook_cache(ttl_seconds: int) -> TTLCache[WebhookEvent, list[Webhook]]:
    """Get or create the webhook cache with the specified TTL.

    Args:
        ttl_seconds: Cache TTL in seconds

    Returns:
        The webhook cache instance
    """
    global _webhook_cache

    if _webhook_cache is None:
        with _webhook_cache_lock:
            # Check again in case another thread just created it
            if _webhook_cache is None:
                # Max size of 1000 should be enough for event types
                _webhook_cache = TTLCache(maxsize=1000, ttl=ttl_seconds)

    return _webhook_cache


def _get_cached_webhooks_by_event(
    store: AbstractStore,
    event: WebhookEvent,
    ttl_seconds: int,
) -> list[Webhook]:
    """Get webhooks for a specific event from cache or fetch from store if cache is stale.

    Args:
        store: The abstract store to fetch webhooks from
        event: The webhook event to filter by
        ttl_seconds: Cache TTL in seconds

    Returns:
        List of webhooks subscribed to the event
    """
    cache = _get_or_create_webhook_cache(ttl_seconds)

    # Try to get from cache first (TTLCache handles expiry automatically)
    cached_webhooks = cache.get(event)
    if cached_webhooks is not None:
        return cached_webhooks

    # Cache miss, need to fetch from store
    with _webhook_cache_lock:
        # Check again in case another thread just populated it
        cached_webhooks = cache.get(event)
        if cached_webhooks is not None:
            return cached_webhooks

        # Fetch fresh data - only webhooks for this specific event
        # Fetch all pages to ensure we don't miss any webhooks
        webhooks: list[Webhook] = []
        page_token: str | None = None
        while True:
            page = store.list_webhooks_by_event(event, max_results=100, page_token=page_token)
            webhooks.extend(page)
            if not page.token:
                break
            page_token = page.token

        # Store in cache
        cache[event] = webhooks
        return webhooks


def _send_webhook_with_error_handling(
    webhook: Webhook,
    payload: WebhookPayload,
    event: WebhookEvent,
    session: requests.Session,
) -> None:
    try:
        _send_webhook_request(webhook, payload, event, session)
    except Exception as e:
        _logger.error(
            f"Failed to send webhook to {webhook.url} for event {event}: {e}",
            exc_info=True,
        )


def _deliver_webhook_impl(
    *,
    event: WebhookEvent,
    payload: WebhookPayload,
    store: AbstractStore,
) -> None:
    session = _get_or_create_webhook_session()
    ttl_seconds = MLFLOW_WEBHOOK_CACHE_TTL.get()

    # Get only webhooks subscribed to this specific event (filtered at DB level when possible)
    webhooks = _get_cached_webhooks_by_event(store, event, ttl_seconds)
    for webhook in webhooks:
        if webhook.status.is_active():
            _webhook_delivery_executor.submit(
                _send_webhook_with_error_handling,
                webhook,
                payload,
                event,
                session,
            )


def deliver_webhook(
    *,
    event: WebhookEvent,
    payload: WebhookPayload,
    store: AbstractStore,
) -> None:
    # Exit early if the store is a FileStore since it does not support webhook APIs
    if isinstance(store, FileStore):
        return

    try:
        _deliver_webhook_impl(event=event, payload=payload, store=store)
    except Exception as e:
        _logger.error(
            f"Failed to deliver webhook for event {event}: {e}",
            exc_info=True,
        )


def test_webhook(webhook: Webhook, event: WebhookEvent | None = None) -> WebhookTestResult:
    """Test a webhook by sending a test payload.

    Args:
        webhook: The webhook object to test
        event: Optional event type to test. If not specified, uses the first event from webhook.

    Returns:
        WebhookTestResult indicating success/failure and response details
    """
    # Use provided event or the first event type for testing
    test_event = event or webhook.events[0]
    session = _get_or_create_webhook_session()
    try:
        test_payload = get_example_payload_for_event(test_event)
        response = _send_webhook_request(
            webhook=webhook, payload=test_payload, event=test_event, session=session
        )
        return WebhookTestResult(
            success=response.status_code < 400,
            response_status=response.status_code,
            response_body=response.text,
        )
    except Exception as e:
        return WebhookTestResult(
            success=False,
            error_message=f"Failed to test webhook: {e!r}",
        )
```

--------------------------------------------------------------------------------

---[FILE: types.py]---
Location: mlflow-master/mlflow/webhooks/types.py

```python
"""Type definitions for MLflow webhook payloads.

This module contains class definitions for all webhook event payloads
that are sent when various model registry events occur.
"""

from typing import TypeAlias, TypedDict

from mlflow.entities.webhook import WebhookAction, WebhookEntity, WebhookEvent


class RegisteredModelCreatedPayload(TypedDict):
    """Payload sent when a new registered model is created.

    Example payload:

    .. code-block:: python

        {
            "name": "example_model",
            "tags": {"example_key": "example_value"},
            "description": "An example registered model",
        }

    """

    name: str
    """The name of the registered model."""
    tags: dict[str, str]
    """Tags associated with the registered model."""
    description: str | None
    """Description of the registered model."""

    @classmethod
    def example(cls) -> "RegisteredModelCreatedPayload":
        return cls(
            name="example_model",
            tags={"example_key": "example_value"},
            description="An example registered model",
        )


class ModelVersionCreatedPayload(TypedDict):
    """Payload sent when a new model version is created.

    Example payload:

    .. code-block:: python

        {
            "name": "example_model",
            "version": "1",
            "source": "models:/123",
            "run_id": "abcd1234abcd5678",
            "tags": {"example_key": "example_value"},
            "description": "An example model version",
        }

    """

    name: str
    """The name of the registered model."""
    version: str
    """The version of the model."""
    source: str
    """The source URI of the model version."""
    run_id: str | None
    """The run ID associated with the model version, if applicable."""
    tags: dict[str, str]
    """Tags associated with the model version."""
    description: str | None
    """Description of the model version."""

    @classmethod
    def example(cls) -> "ModelVersionCreatedPayload":
        return cls(
            name="example_model",
            version="1",
            source="models:/123",
            run_id="abcd1234abcd5678",
            tags={"example_key": "example_value"},
            description="An example model version",
        )


class ModelVersionTagSetPayload(TypedDict):
    """Payload sent when a tag is set on a model version.

    Example payload:

    .. code-block:: python

        {
            "name": "example_model",
            "version": "1",
            "key": "example_key",
            "value": "example_value",
        }

    """

    name: str
    """The name of the registered model."""
    version: str
    """The version of the model."""
    key: str
    """The tag key being set."""
    value: str
    """The tag value being set."""

    @classmethod
    def example(cls) -> "ModelVersionTagSetPayload":
        return cls(
            name="example_model",
            version="1",
            key="example_key",
            value="example_value",
        )


class ModelVersionTagDeletedPayload(TypedDict):
    """Payload sent when a tag is deleted from a model version.

    Example payload:

    .. code-block:: python

        {
            "name": "example_model",
            "version": "1",
            "key": "example_key",
        }

    """

    name: str
    """The name of the registered model."""
    version: str
    """The version of the model."""
    key: str
    """The tag key being deleted."""

    @classmethod
    def example(cls) -> "ModelVersionTagDeletedPayload":
        return cls(
            name="example_model",
            version="1",
            key="example_key",
        )


class ModelVersionAliasCreatedPayload(TypedDict):
    """
    Payload sent when an alias is created for a model version.

    Example payload:

    .. code-block:: python

        {
            "name": "example_model",
            "alias": "example_alias",
            "version": "1",
        }

    """

    name: str
    """The name of the registered model."""
    alias: str
    """The alias being created."""
    version: str
    """The version of the model the alias is being assigned to."""

    @classmethod
    def example(cls) -> "ModelVersionAliasCreatedPayload":
        return cls(
            name="example_model",
            alias="example_alias",
            version="1",
        )


class ModelVersionAliasDeletedPayload(TypedDict):
    """Payload sent when an alias is deleted from a model version.

    Example payload:

    .. code-block:: python

        {
            "name": "example_model",
            "alias": "example_alias",
        }

    """

    name: str
    """The name of the registered model."""
    alias: str
    """The alias being deleted."""

    @classmethod
    def example(cls) -> "ModelVersionAliasDeletedPayload":
        return cls(
            name="example_model",
            alias="example_alias",
        )


class PromptCreatedPayload(TypedDict):
    """Payload sent when a new prompt is created.

    Example payload:

    .. code-block:: python

        {
            "name": "example_prompt",
            "tags": {"example_key": "example_value"},
            "description": "An example prompt",
        }

    """

    name: str
    """The name of the prompt."""
    tags: dict[str, str]
    """Tags associated with the prompt."""
    description: str | None
    """Description of the prompt."""

    @classmethod
    def example(cls) -> "PromptCreatedPayload":
        return cls(
            name="example_prompt",
            tags={"example_key": "example_value"},
            description="An example prompt",
        )


class PromptVersionCreatedPayload(TypedDict):
    """Payload sent when a new prompt version is created.

    Example payload:

    .. code-block:: python

        {
            "name": "example_prompt",
            "version": "1",
            "template": "Hello {{name}}!",
            "tags": {"example_key": "example_value"},
            "description": "An example prompt version",
        }

    """

    name: str
    """The name of the prompt."""
    version: str
    """The version of the prompt."""
    template: str
    """The template content of the prompt version."""
    tags: dict[str, str]
    """Tags associated with the prompt version."""
    description: str | None
    """Description of the prompt version."""

    @classmethod
    def example(cls) -> "PromptVersionCreatedPayload":
        return cls(
            name="example_prompt",
            version="1",
            template="Hello {{name}}!",
            tags={"example_key": "example_value"},
            description="An example prompt version",
        )


class PromptTagSetPayload(TypedDict):
    """Payload sent when a tag is set on a prompt.

    Example payload:

    .. code-block:: python

        {
            "name": "example_prompt",
            "key": "example_key",
            "value": "example_value",
        }

    """

    name: str
    """The name of the prompt."""
    key: str
    """The tag key being set."""
    value: str
    """The tag value being set."""

    @classmethod
    def example(cls) -> "PromptTagSetPayload":
        return cls(
            name="example_prompt",
            key="example_key",
            value="example_value",
        )


class PromptTagDeletedPayload(TypedDict):
    """Payload sent when a tag is deleted from a prompt.

    Example payload:

    .. code-block:: python

        {
            "name": "example_prompt",
            "key": "example_key",
        }

    """

    name: str
    """The name of the prompt."""
    key: str
    """The tag key being deleted."""

    @classmethod
    def example(cls) -> "PromptTagDeletedPayload":
        return cls(
            name="example_prompt",
            key="example_key",
        )


class PromptVersionTagSetPayload(TypedDict):
    """Payload sent when a tag is set on a prompt version.

    Example payload:

    .. code-block:: python

        {
            "name": "example_prompt",
            "version": "1",
            "key": "example_key",
            "value": "example_value",
        }

    """

    name: str
    """The name of the prompt."""
    version: str
    """The version of the prompt."""
    key: str
    """The tag key being set."""
    value: str
    """The tag value being set."""

    @classmethod
    def example(cls) -> "PromptVersionTagSetPayload":
        return cls(
            name="example_prompt",
            version="1",
            key="example_key",
            value="example_value",
        )


class PromptVersionTagDeletedPayload(TypedDict):
    """Payload sent when a tag is deleted from a prompt version.

    Example payload:

    .. code-block:: python

        {
            "name": "example_prompt",
            "version": "1",
            "key": "example_key",
        }

    """

    name: str
    """The name of the prompt."""
    version: str
    """The version of the prompt."""
    key: str
    """The tag key being deleted."""

    @classmethod
    def example(cls) -> "PromptVersionTagDeletedPayload":
        return cls(
            name="example_prompt",
            version="1",
            key="example_key",
        )


class PromptAliasCreatedPayload(TypedDict):
    """Payload sent when an alias is created for a prompt version.

    Example payload:

    .. code-block:: python

        {
            "name": "example_prompt",
            "alias": "example_alias",
            "version": "1",
        }

    """

    name: str
    """The name of the prompt."""
    alias: str
    """The alias being created."""
    version: str
    """The version of the prompt the alias is being assigned to."""

    @classmethod
    def example(cls) -> "PromptAliasCreatedPayload":
        return cls(
            name="example_prompt",
            alias="example_alias",
            version="1",
        )


class PromptAliasDeletedPayload(TypedDict):
    """Payload sent when an alias is deleted from a prompt.

    Example payload:

    .. code-block:: python

        {
            "name": "example_prompt",
            "alias": "example_alias",
        }

    """

    name: str
    """The name of the prompt."""
    alias: str
    """The alias being deleted."""

    @classmethod
    def example(cls) -> "PromptAliasDeletedPayload":
        return cls(
            name="example_prompt",
            alias="example_alias",
        )


WebhookPayload: TypeAlias = (
    RegisteredModelCreatedPayload
    | ModelVersionCreatedPayload
    | ModelVersionTagSetPayload
    | ModelVersionTagDeletedPayload
    | ModelVersionAliasCreatedPayload
    | ModelVersionAliasDeletedPayload
    | PromptCreatedPayload
    | PromptVersionCreatedPayload
    | PromptTagSetPayload
    | PromptTagDeletedPayload
    | PromptVersionTagSetPayload
    | PromptVersionTagDeletedPayload
    | PromptAliasCreatedPayload
    | PromptAliasDeletedPayload
)

# Mapping of (entity, action) tuples to their corresponding payload classes
EVENT_TO_PAYLOAD_CLASS: dict[tuple[WebhookEntity, WebhookAction], type[WebhookPayload]] = {
    (WebhookEntity.REGISTERED_MODEL, WebhookAction.CREATED): RegisteredModelCreatedPayload,
    (WebhookEntity.MODEL_VERSION, WebhookAction.CREATED): ModelVersionCreatedPayload,
    (WebhookEntity.MODEL_VERSION_TAG, WebhookAction.SET): ModelVersionTagSetPayload,
    (WebhookEntity.MODEL_VERSION_TAG, WebhookAction.DELETED): ModelVersionTagDeletedPayload,
    (WebhookEntity.MODEL_VERSION_ALIAS, WebhookAction.CREATED): ModelVersionAliasCreatedPayload,
    (WebhookEntity.MODEL_VERSION_ALIAS, WebhookAction.DELETED): ModelVersionAliasDeletedPayload,
    (WebhookEntity.PROMPT, WebhookAction.CREATED): PromptCreatedPayload,
    (WebhookEntity.PROMPT_VERSION, WebhookAction.CREATED): PromptVersionCreatedPayload,
    (WebhookEntity.PROMPT_TAG, WebhookAction.SET): PromptTagSetPayload,
    (WebhookEntity.PROMPT_TAG, WebhookAction.DELETED): PromptTagDeletedPayload,
    (WebhookEntity.PROMPT_VERSION_TAG, WebhookAction.SET): PromptVersionTagSetPayload,
    (WebhookEntity.PROMPT_VERSION_TAG, WebhookAction.DELETED): PromptVersionTagDeletedPayload,
    (WebhookEntity.PROMPT_ALIAS, WebhookAction.CREATED): PromptAliasCreatedPayload,
    (WebhookEntity.PROMPT_ALIAS, WebhookAction.DELETED): PromptAliasDeletedPayload,
}


def get_example_payload_for_event(event: WebhookEvent) -> WebhookPayload:
    """Get an example payload for the given webhook event type.

    Args:
        event: The webhook event instance

    Returns:
        Example payload for the event type

    Raises:
        ValueError: If the event type is unknown
    """
    event_key = (event.entity, event.action)
    if payload_class := EVENT_TO_PAYLOAD_CLASS.get(event_key):
        return payload_class.example()

    raise ValueError(f"Unknown event type: {event.entity}.{event.action}")


def get_payload_class_for_event(event: WebhookEvent) -> type[WebhookPayload] | None:
    """Get the payload class for the given webhook event type.

    Args:
        event: The webhook event instance

    Returns:
        Payload class for the event type, or None if unknown
    """
    return EVENT_TO_PAYLOAD_CLASS.get((event.entity, event.action))
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/webhooks/__init__.py

```python
"""MLflow webhooks module.

This module provides webhook functionality for MLflow model registry and prompt registry events.
"""

from mlflow.webhooks.constants import WEBHOOK_SIGNATURE_HEADER
from mlflow.webhooks.types import (
    ModelVersionAliasCreatedPayload,
    ModelVersionAliasDeletedPayload,
    ModelVersionCreatedPayload,
    ModelVersionTagDeletedPayload,
    ModelVersionTagSetPayload,
    PromptAliasCreatedPayload,
    PromptAliasDeletedPayload,
    PromptCreatedPayload,
    PromptTagDeletedPayload,
    PromptTagSetPayload,
    PromptVersionCreatedPayload,
    PromptVersionTagDeletedPayload,
    PromptVersionTagSetPayload,
    RegisteredModelCreatedPayload,
    WebhookPayload,
)

__all__ = [
    "RegisteredModelCreatedPayload",
    "ModelVersionCreatedPayload",
    "ModelVersionTagSetPayload",
    "ModelVersionTagDeletedPayload",
    "ModelVersionAliasCreatedPayload",
    "ModelVersionAliasDeletedPayload",
    "PromptCreatedPayload",
    "PromptVersionCreatedPayload",
    "PromptTagSetPayload",
    "PromptTagDeletedPayload",
    "PromptVersionTagSetPayload",
    "PromptVersionTagDeletedPayload",
    "PromptAliasCreatedPayload",
    "PromptAliasDeletedPayload",
    "WebhookPayload",
    "WEBHOOK_SIGNATURE_HEADER",
]
```

--------------------------------------------------------------------------------

````

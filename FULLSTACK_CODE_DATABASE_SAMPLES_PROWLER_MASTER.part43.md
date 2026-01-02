---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 43
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 43 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: custom_logging.py]---
Location: prowler-master/api/src/backend/config/custom_logging.py
Signals: Django

```python
import json
import logging
from enum import StrEnum

from config.env import env
from django_guid.log_filters import CorrelationId


class BackendLogger(StrEnum):
    GUNICORN = "gunicorn"
    GUNICORN_ACCESS = "gunicorn.access"
    GUNICORN_ERROR = "gunicorn.error"
    DJANGO = "django"
    SECURITY = "django.security"
    DB = "django.db"
    API = "api"
    TASKS = "tasks"


# Formatters


class NDJSONFormatter(logging.Formatter):
    """NDJSON custom formatter for logging messages.

    If available, it will include all kind of API request metadata.
    """

    def format(self, record):
        log_record = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "module": record.module,
            "pathname": record.pathname,
            "lineno": record.lineno,
            "funcName": record.funcName,
            "process": record.process,
            "thread": record.thread,
            "transaction_id": (
                record.transaction_id if hasattr(record, "transaction_id") else None
            ),
        }

        # Add REST API extra fields
        if hasattr(record, "user_id"):
            log_record["user_id"] = record.user_id
        if hasattr(record, "tenant_id"):
            log_record["tenant_id"] = record.tenant_id
        if hasattr(record, "api_key_prefix"):
            log_record["api_key_prefix"] = (
                record.api_key_prefix if record.api_key_prefix != "N/A" else None
            )
        if hasattr(record, "method"):
            log_record["method"] = record.method
        if hasattr(record, "path"):
            log_record["path"] = record.path
        if hasattr(record, "query_params"):
            log_record["query_params"] = record.query_params
        if hasattr(record, "duration"):
            log_record["duration"] = record.duration
        if hasattr(record, "status_code"):
            log_record["status_code"] = record.status_code

        if record.exc_info:
            log_record["exc_info"] = self.formatException(record.exc_info)

        return json.dumps(log_record)


class HumanReadableFormatter(logging.Formatter):
    """Human-readable custom formatter for logging messages.

    If available, it will include all kinds of API request metadata.
    """

    def format(self, record):
        log_components = [
            f"{self.formatTime(record, self.datefmt)}",
            f"[{record.name}]",
            f"{record.levelname}:",
            f"({record.module})",
            f"[module={record.module}",
            f"path={record.pathname}",
            f"line={record.lineno}",
            f"function={record.funcName}",
            f"process={record.process}",
            f"thread={record.thread}",
            f"transaction-id={record.transaction_id if hasattr(record, 'transaction_id') else None}]",
            f"{record.getMessage()}",
        ]

        # Add REST API extra fields
        if hasattr(record, "user_id"):
            log_components.append(f"({record.user_id})")
        if hasattr(record, "api_key_prefix"):
            if record.api_key_prefix != "N/A":
                log_components.append(f"(API-Key {record.api_key_prefix})")
        if hasattr(record, "tenant_id"):
            log_components.append(f"[{record.tenant_id}]")
        if hasattr(record, "method"):
            log_components.append(f'"{record.method} {record.path}"')
        if hasattr(record, "query_params"):
            log_components.append(f"with parameters {record.query_params}")
        if hasattr(record, "duration"):
            log_components.append(f"done in {record.duration}s:")
        if hasattr(record, "status_code"):
            log_components.append(f"{record.status_code}")

        if record.exc_info:
            log_components.append(self.formatException(record.exc_info))

        return " ".join(log_components)


# Filters


class TransactionIdFilter(CorrelationId):
    """Logging filter class.

    Used to override the `correlation_id_field` parameter in the parent class to use a different name.
    """

    CORRELATION_ID_FIELD = "transaction_id"

    def __init__(self):
        super().__init__(correlation_id_field=self.CORRELATION_ID_FIELD)


# Logging settings

LEVEL = env("DJANGO_LOGGING_LEVEL", default="INFO")
FORMATTER = env("DJANGO_LOGGING_FORMATTER", default="ndjson")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "filters": {"transaction_id": {"()": TransactionIdFilter}},
    "formatters": {
        "ndjson": {
            "()": NDJSONFormatter,
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "human_readable": {
            "()": HumanReadableFormatter,
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "gunicorn_console": {
            "level": LEVEL,
            "class": "logging.StreamHandler",
            "formatter": FORMATTER,
            "filters": ["transaction_id"],
        },
        "django_console": {
            "level": LEVEL,
            "class": "logging.StreamHandler",
            "formatter": FORMATTER,
            "filters": ["transaction_id"],
        },
        "api_console": {
            "level": LEVEL,
            "class": "logging.StreamHandler",
            "formatter": FORMATTER,
            "filters": ["transaction_id"],
        },
        "db_console": {
            "level": f"{'DEBUG' if LEVEL == 'DEBUG' else 'INFO'}",
            "class": "logging.StreamHandler",
            "formatter": FORMATTER,
            "filters": ["transaction_id"],
        },
        "security_console": {
            "level": LEVEL,
            "class": "logging.StreamHandler",
            "formatter": FORMATTER,
            "filters": ["transaction_id"],
        },
        "tasks_console": {
            "level": LEVEL,
            "class": "logging.StreamHandler",
            "formatter": FORMATTER,
            "filters": ["transaction_id"],
        },
    },
    "loggers": {
        BackendLogger.GUNICORN: {
            "handlers": ["gunicorn_console"],
            "level": LEVEL,
            "propagate": False,
        },
        BackendLogger.GUNICORN_ACCESS: {
            "handlers": ["gunicorn_console"],
            "level": "CRITICAL",
            "propagate": False,
        },
        BackendLogger.GUNICORN_ERROR: {
            "handlers": ["gunicorn_console"],
            "level": LEVEL,
            "propagate": False,
        },
        BackendLogger.DJANGO: {
            "handlers": ["django_console"],
            "level": "WARNING",
            "propagate": True,
        },
        BackendLogger.DB: {
            "handlers": ["db_console"],
            "level": LEVEL,
            "propagate": False,
        },
        BackendLogger.SECURITY: {
            "handlers": ["security_console"],
            "level": LEVEL,
            "propagate": False,
        },
        BackendLogger.API: {
            "handlers": ["api_console"],
            "level": LEVEL,
            "propagate": False,
        },
        BackendLogger.TASKS: {
            "handlers": ["tasks_console"],
            "level": LEVEL,
            "propagate": False,
        },
    },
    # Gunicorn required configuration
    "root": {
        "level": "ERROR",
        "handlers": ["gunicorn_console"],
    },
}
```

--------------------------------------------------------------------------------

---[FILE: env.py]---
Location: prowler-master/api/src/backend/config/env.py

```python
from pathlib import Path

import environ

env = environ.Env()

BASE_DIR = Path(__file__).resolve().parent.parent
```

--------------------------------------------------------------------------------

---[FILE: guniconf.py]---
Location: prowler-master/api/src/backend/config/guniconf.py
Signals: Django

```python
import logging
import multiprocessing
import os

from config.env import env

# Ensure the environment variable for Django settings is set
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.django.production")

# Import Django and set it up before accessing settings
import django  # noqa: E402

django.setup()
from config.django.production import LOGGING as DJANGO_LOGGERS, DEBUG  # noqa: E402
from config.custom_logging import BackendLogger  # noqa: E402

BIND_ADDRESS = env("DJANGO_BIND_ADDRESS", default="127.0.0.1")
PORT = env("DJANGO_PORT", default=8000)

# Server settings
bind = f"{BIND_ADDRESS}:{PORT}"

workers = env.int("DJANGO_WORKERS", default=multiprocessing.cpu_count() * 2 + 1)
reload = DEBUG

# Logging
logconfig_dict = DJANGO_LOGGERS
gunicorn_logger = logging.getLogger(BackendLogger.GUNICORN)


# Hooks
def on_starting(_):
    gunicorn_logger.info(f"Starting gunicorn server with {workers} workers")
    if reload:
        gunicorn_logger.warning("Reload settings enabled (dev mode)")


def on_reload(_):
    gunicorn_logger.warning("Gunicorn server has reloaded")


def when_ready(_):
    gunicorn_logger.info("Gunicorn server is ready")
```

--------------------------------------------------------------------------------

---[FILE: urls.py]---
Location: prowler-master/api/src/backend/config/urls.py
Signals: Django

```python
from django.urls import include, path

urlpatterns = [
    path("api/v1/", include("api.v1.urls")),
]
```

--------------------------------------------------------------------------------

---[FILE: wsgi.py]---
Location: prowler-master/api/src/backend/config/wsgi.py
Signals: Django

```python
"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.django.production")

application = get_wsgi_application()
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: prowler-master/api/src/backend/config/django/base.py
Signals: Django, Celery

```python
from datetime import timedelta

from config.custom_logging import LOGGING  # noqa
from config.env import BASE_DIR, env  # noqa
from config.settings.celery import *  # noqa
from config.settings.partitions import *  # noqa
from config.settings.sentry import *  # noqa
from config.settings.social_login import *  # noqa

SECRET_KEY = env("SECRET_KEY", default="secret")
DEBUG = env.bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.postgres",
    "psqlextra",
    "api",
    "rest_framework",
    "corsheaders",
    "drf_spectacular",
    "drf_spectacular_jsonapi",
    "django_guid",
    "rest_framework_json_api",
    "django_celery_results",
    "django_celery_beat",
    "rest_framework_simplejwt.token_blacklist",
    "allauth",
    "django.contrib.sites",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.github",
    "allauth.socialaccount.providers.saml",
    "dj_rest_auth.registration",
    "rest_framework.authtoken",
    "drf_simple_apikey",
]

MIDDLEWARE = [
    "django_guid.middleware.guid_middleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "api.middleware.APILoggingMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

SITE_ID = 1

CORS_ALLOWED_ORIGINS = ["http://localhost", "http://127.0.0.1"]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular_jsonapi.schemas.openapi.JsonApiAutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "api.authentication.CombinedJWTOrAPIKeyAuthentication",
    ),
    "PAGE_SIZE": 10,
    "EXCEPTION_HANDLER": "api.exceptions.custom_exception_handler",
    "DEFAULT_PAGINATION_CLASS": "drf_spectacular_jsonapi.schemas.pagination.JsonApiPageNumberPagination",
    "DEFAULT_PARSER_CLASSES": (
        "rest_framework_json_api.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ),
    "DEFAULT_RENDERER_CLASSES": ("api.renderers.APIJSONRenderer",),
    "DEFAULT_METADATA_CLASS": "rest_framework_json_api.metadata.JSONAPIMetadata",
    "DEFAULT_FILTER_BACKENDS": (
        "rest_framework_json_api.filters.QueryParameterValidationFilter",
        "rest_framework_json_api.filters.OrderingFilter",
        "rest_framework_json_api.django_filters.backends.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
    ),
    "SEARCH_PARAM": "filter[search]",
    "TEST_REQUEST_RENDERER_CLASSES": (
        "rest_framework_json_api.renderers.JSONRenderer",
    ),
    "TEST_REQUEST_DEFAULT_FORMAT": "vnd.api+json",
    "JSON_API_UNIFORM_EXCEPTIONS": True,
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "token-obtain": env("DJANGO_THROTTLE_TOKEN_OBTAIN", default=None),
        "dj_rest_auth": None,
    },
}

SPECTACULAR_SETTINGS = {
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "PREPROCESSING_HOOKS": [
        "drf_spectacular_jsonapi.hooks.fix_nested_path_parameters",
    ],
    "POSTPROCESSING_HOOKS": [
        "api.schema_hooks.attach_task_202_examples",
    ],
    "TITLE": "API Reference - Prowler",
}

WSGI_APPLICATION = "config.wsgi.application"

DJANGO_GUID = {
    "GUID_HEADER_NAME": "Transaction-ID",
    "VALIDATE_GUID": True,
    "RETURN_HEADER": True,
    "EXPOSE_HEADER": True,
    "INTEGRATIONS": [],
    "IGNORE_URLS": [],
    "UUID_LENGTH": 32,
}

DATABASE_ROUTERS = ["api.db_router.MainRouter"]


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_USER_MODEL = "api.User"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 12},
    },
    {
        "NAME": "api.validators.MaximumLengthValidator",
        "OPTIONS": {
            "max_length": 72,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
    {
        "NAME": "api.validators.SpecialCharactersValidator",
        "OPTIONS": {
            "min_special_characters": 1,
        },
    },
    {
        "NAME": "api.validators.UppercaseValidator",
        "OPTIONS": {
            "min_uppercase": 1,
        },
    },
    {
        "NAME": "api.validators.LowercaseValidator",
        "OPTIONS": {
            "min_lowercase": 1,
        },
    },
    {
        "NAME": "api.validators.NumericValidator",
        "OPTIONS": {
            "min_numeric": 1,
        },
    },
]

SIMPLE_JWT = {
    # Token lifetime settings
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=env.int("DJANGO_ACCESS_TOKEN_LIFETIME", 30)
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        minutes=env.int("DJANGO_REFRESH_TOKEN_LIFETIME", 60 * 24)
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    # Algorithm and keys
    "ALGORITHM": "RS256",
    "SIGNING_KEY": env.str("DJANGO_TOKEN_SIGNING_KEY", "").replace("\\n", "\n"),
    "VERIFYING_KEY": env.str("DJANGO_TOKEN_VERIFYING_KEY", "").replace("\\n", "\n"),
    # Authorization header configuration
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    # Custom serializers
    "TOKEN_OBTAIN_SERIALIZER": "api.serializers.TokenSerializer",
    "TOKEN_REFRESH_SERIALIZER": "api.serializers.TokenRefreshSerializer",
    # Standard JWT claims
    "TOKEN_TYPE_CLAIM": "typ",
    "JTI_CLAIM": "jti",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "sub",
    # Issuer and Audience claims, for the moment we will keep these values as default values, they may change in the
    # future.
    "AUDIENCE": env.str("DJANGO_JWT_AUDIENCE", "https://api.prowler.com"),
    "ISSUER": env.str("DJANGO_JWT_ISSUER", "https://api.prowler.com"),
    # Additional security settings
    "UPDATE_LAST_LOGIN": True,
}

SECRETS_ENCRYPTION_KEY = env.str("DJANGO_SECRETS_ENCRYPTION_KEY", "")

# DRF Simple API Key settings
DRF_API_KEY = {
    "FERNET_SECRET": SECRETS_ENCRYPTION_KEY,
    "API_KEY_LIFETIME": 365,
    "AUTHENTICATION_KEYWORD_HEADER": "Api-Key",
}

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"
LANGUAGES = [
    ("en", "English"),
]

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Cache settings
CACHE_MAX_AGE = env.int("DJANGO_CACHE_MAX_AGE", 3600)
CACHE_STALE_WHILE_REVALIDATE = env.int("DJANGO_STALE_WHILE_REVALIDATE", 60)


TESTING = False

FINDINGS_MAX_DAYS_IN_RANGE = env.int("DJANGO_FINDINGS_MAX_DAYS_IN_RANGE", 7)


# API export settings
DJANGO_TMP_OUTPUT_DIRECTORY = env.str(
    "DJANGO_TMP_OUTPUT_DIRECTORY", "/tmp/prowler_api_output"
)
DJANGO_FINDINGS_BATCH_SIZE = env.str("DJANGO_FINDINGS_BATCH_SIZE", 1000)

DJANGO_OUTPUT_S3_AWS_OUTPUT_BUCKET = env.str("DJANGO_OUTPUT_S3_AWS_OUTPUT_BUCKET", "")
DJANGO_OUTPUT_S3_AWS_ACCESS_KEY_ID = env.str("DJANGO_OUTPUT_S3_AWS_ACCESS_KEY_ID", "")
DJANGO_OUTPUT_S3_AWS_SECRET_ACCESS_KEY = env.str(
    "DJANGO_OUTPUT_S3_AWS_SECRET_ACCESS_KEY", ""
)
DJANGO_OUTPUT_S3_AWS_SESSION_TOKEN = env.str("DJANGO_OUTPUT_S3_AWS_SESSION_TOKEN", "")
DJANGO_OUTPUT_S3_AWS_DEFAULT_REGION = env.str("DJANGO_OUTPUT_S3_AWS_DEFAULT_REGION", "")

# HTTP Security Headers
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

DJANGO_DELETION_BATCH_SIZE = env.int("DJANGO_DELETION_BATCH_SIZE", 5000)

# SAML requirement
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
```

--------------------------------------------------------------------------------

---[FILE: devel.py]---
Location: prowler-master/api/src/backend/config/django/devel.py
Signals: Django

```python
from config.django.base import *  # noqa
from config.env import env

DEBUG = env.bool("DJANGO_DEBUG", default=True)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["*"])

# Database
default_db_name = env("POSTGRES_DB", default="prowler_db")
default_db_user = env("POSTGRES_USER", default="prowler_user")
default_db_password = env("POSTGRES_PASSWORD", default="prowler")
default_db_host = env("POSTGRES_HOST", default="postgres-db")
default_db_port = env("POSTGRES_PORT", default="5432")

DATABASES = {
    "prowler_user": {
        "ENGINE": "psqlextra.backend",
        "NAME": default_db_name,
        "USER": default_db_user,
        "PASSWORD": default_db_password,
        "HOST": default_db_host,
        "PORT": default_db_port,
    },
    "admin": {
        "ENGINE": "psqlextra.backend",
        "NAME": default_db_name,
        "USER": env("POSTGRES_ADMIN_USER", default="prowler"),
        "PASSWORD": env("POSTGRES_ADMIN_PASSWORD", default="S3cret"),
        "HOST": default_db_host,
        "PORT": default_db_port,
    },
    "replica": {
        "ENGINE": "psqlextra.backend",
        "NAME": env("POSTGRES_REPLICA_DB", default=default_db_name),
        "USER": env("POSTGRES_REPLICA_USER", default=default_db_user),
        "PASSWORD": env("POSTGRES_REPLICA_PASSWORD", default=default_db_password),
        "HOST": env("POSTGRES_REPLICA_HOST", default=default_db_host),
        "PORT": env("POSTGRES_REPLICA_PORT", default=default_db_port),
    },
    "admin_replica": {
        "ENGINE": "psqlextra.backend",
        "NAME": env("POSTGRES_REPLICA_DB", default=default_db_name),
        "USER": env("POSTGRES_ADMIN_USER", default="prowler"),
        "PASSWORD": env("POSTGRES_ADMIN_PASSWORD", default="S3cret"),
        "HOST": env("POSTGRES_REPLICA_HOST", default=default_db_host),
        "PORT": env("POSTGRES_REPLICA_PORT", default=default_db_port),
    },
}

DATABASES["default"] = DATABASES["prowler_user"]

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = tuple(  # noqa: F405
    render_class
    for render_class in REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"]  # noqa: F405
) + ("rest_framework_json_api.renderers.BrowsableAPIRenderer",)

REST_FRAMEWORK["DEFAULT_FILTER_BACKENDS"] = tuple(  # noqa: F405
    filter_backend
    for filter_backend in REST_FRAMEWORK["DEFAULT_FILTER_BACKENDS"]  # noqa: F405
    if "DjangoFilterBackend" not in filter_backend
) + ("api.filters.CustomDjangoFilterBackend",)

SECRETS_ENCRYPTION_KEY = "ZMiYVo7m4Fbe2eXXPyrwxdJss2WSalXSv3xHBcJkPl0="
```

--------------------------------------------------------------------------------

---[FILE: production.py]---
Location: prowler-master/api/src/backend/config/django/production.py
Signals: Django

```python
from config.django.base import *  # noqa
from config.env import env

DEBUG = env.bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

# Database
# TODO Use Django database routers https://docs.djangoproject.com/en/5.0/topics/db/multi-db/#automatic-database-routing
default_db_name = env("POSTGRES_DB")
default_db_user = env("POSTGRES_USER")
default_db_password = env("POSTGRES_PASSWORD")
default_db_host = env("POSTGRES_HOST")
default_db_port = env("POSTGRES_PORT")

DATABASES = {
    "prowler_user": {
        "ENGINE": "psqlextra.backend",
        "NAME": default_db_name,
        "USER": default_db_user,
        "PASSWORD": default_db_password,
        "HOST": default_db_host,
        "PORT": default_db_port,
    },
    "admin": {
        "ENGINE": "psqlextra.backend",
        "NAME": default_db_name,
        "USER": env("POSTGRES_ADMIN_USER"),
        "PASSWORD": env("POSTGRES_ADMIN_PASSWORD"),
        "HOST": default_db_host,
        "PORT": default_db_port,
    },
    "replica": {
        "ENGINE": "psqlextra.backend",
        "NAME": env("POSTGRES_REPLICA_DB", default=default_db_name),
        "USER": env("POSTGRES_REPLICA_USER", default=default_db_user),
        "PASSWORD": env("POSTGRES_REPLICA_PASSWORD", default=default_db_password),
        "HOST": env("POSTGRES_REPLICA_HOST", default=default_db_host),
        "PORT": env("POSTGRES_REPLICA_PORT", default=default_db_port),
    },
    "admin_replica": {
        "ENGINE": "psqlextra.backend",
        "NAME": env("POSTGRES_REPLICA_DB", default=default_db_name),
        "USER": env("POSTGRES_ADMIN_USER"),
        "PASSWORD": env("POSTGRES_ADMIN_PASSWORD"),
        "HOST": env("POSTGRES_REPLICA_HOST", default=default_db_host),
        "PORT": env("POSTGRES_REPLICA_PORT", default=default_db_port),
    },
}

DATABASES["default"] = DATABASES["prowler_user"]
```

--------------------------------------------------------------------------------

---[FILE: testing.py]---
Location: prowler-master/api/src/backend/config/django/testing.py
Signals: Django

```python
from config.django.base import *  # noqa
from config.env import env

DEBUG = env.bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])


DATABASES = {
    "default": {
        "ENGINE": "psqlextra.backend",
        "NAME": "prowler_db_test",
        "USER": env("POSTGRES_USER", default="prowler_admin"),
        "PASSWORD": env("POSTGRES_PASSWORD", default="postgres"),
        "HOST": env("POSTGRES_HOST", default="localhost"),
        "PORT": env("POSTGRES_PORT", default="5432"),
    },
}

DATABASE_ROUTERS = []
TESTING = True
SECRETS_ENCRYPTION_KEY = "ZMiYVo7m4Fbe2eXXPyrwxdJss2WSalXSv3xHBcJkPl0="

# DRF Simple API Key settings
DRF_API_KEY = {
    "FERNET_SECRET": SECRETS_ENCRYPTION_KEY,
    "API_KEY_LIFETIME": 365,
    "AUTHENTICATION_KEYWORD_HEADER": "Api-Key",
}

# JWT

SIMPLE_JWT["ALGORITHM"] = "HS256"  # noqa: F405
```

--------------------------------------------------------------------------------

---[FILE: celery.py]---
Location: prowler-master/api/src/backend/config/settings/celery.py
Signals: Django

```python
from config.env import env

VALKEY_HOST = env("VALKEY_HOST", default="valkey")
VALKEY_PORT = env("VALKEY_PORT", default="6379")
VALKEY_DB = env("VALKEY_DB", default="0")

CELERY_BROKER_URL = f"redis://{VALKEY_HOST}:{VALKEY_PORT}/{VALKEY_DB}"
CELERY_RESULT_BACKEND = "django-db"
CELERY_TASK_TRACK_STARTED = True

CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True

CELERY_DEADLOCK_ATTEMPTS = env.int("DJANGO_CELERY_DEADLOCK_ATTEMPTS", default=5)
```

--------------------------------------------------------------------------------

---[FILE: partitions.py]---
Location: prowler-master/api/src/backend/config/settings/partitions.py

```python
from config.env import env

# Partitioning
PSQLEXTRA_PARTITIONING_MANAGER = "api.partitions.manager"

# Set the months for each partition. Setting the partition months to 1 will create partitions with a size of 1 natural month.
FINDINGS_TABLE_PARTITION_MONTHS = env.int("FINDINGS_TABLE_PARTITION_MONTHS", 1)

# Set the number of partitions to create
FINDINGS_TABLE_PARTITION_COUNT = env.int("FINDINGS_TABLE_PARTITION_COUNT", 7)

# Set the number of months to keep partitions before deleting them
# Setting this to None will keep partitions indefinitely
FINDINGS_TABLE_PARTITION_MAX_AGE_MONTHS = env.int(
    "FINDINGS_TABLE_PARTITION_MAX_AGE_MONTHS", None
)
```

--------------------------------------------------------------------------------

---[FILE: sentry.py]---
Location: prowler-master/api/src/backend/config/settings/sentry.py

```python
import sentry_sdk
from config.env import env

IGNORED_EXCEPTIONS = [
    # Provider is not connected due to credentials errors
    "is not connected",
    "ProviderConnectionError",
    # Provider was deleted during a scan
    "ProviderDeletedException",
    "violates foreign key constraint",
    # Authentication Errors from AWS
    "InvalidToken",
    "AccessDeniedException",
    "AuthorizationErrorException",
    "UnrecognizedClientException",
    "UnauthorizedOperation",
    "AuthFailure",
    "InvalidClientTokenId",
    "AWSInvalidProviderIdError",
    "InternalServerErrorException",
    "AccessDenied",
    "No Shodan API Key",  # Shodan Check
    "RequestLimitExceeded",  # For now, we don't want to log the RequestLimitExceeded errors
    "ThrottlingException",
    "Rate exceeded",
    "SubscriptionRequiredException",
    "UnknownOperationException",
    "OptInRequired",
    "ReadTimeout",
    "LimitExceeded",
    "ConnectTimeoutError",
    "ExpiredToken",
    "IncompleteSignature",
    "RegionDisabledException",
    "TooManyRequestsException",
    "SignatureDoesNotMatch",
    "InvalidParameterValueException",
    "InvalidInputException",
    "ValidationException",
    "AWSSecretAccessKeyInvalidError",
    "InvalidAction",
    "InvalidRequestException",
    "RequestExpired",
    "ConnectionClosedError",
    "MaxRetryError",
    "AWSAccessKeyIDInvalidError",
    "AWSSessionTokenExpiredError",
    "EndpointConnectionError",  # AWS Service is not available in a region
    # The following comes from urllib3: eu-west-1 -- HTTPClientError[126]: An HTTP Client raised an
    # unhandled exception: AWSHTTPSConnectionPool(host='hostname.s3.eu-west-1.amazonaws.com', port=443): Pool is closed.
    "Pool is closed",
    # Authentication Errors from GCP
    "ClientAuthenticationError",
    "AuthorizationFailed",
    "Reauthentication is needed",
    "Permission denied to get service",
    "API has not been used in project",
    "HttpError 404 when requesting",
    "HttpError 403 when requesting",
    "HttpError 400 when requesting",
    "GCPNoAccesibleProjectsError",
    # Authentication Errors from Azure
    "ClientAuthenticationError",
    "AuthorizationFailed",
    "Subscription Not Registered",
    "AzureNotValidClientIdError",
    "AzureNotValidClientSecretError",
    "AzureNotValidTenantIdError",
    "AzureInvalidProviderIdError",
    "AzureTenantIdAndClientSecretNotBelongingToClientIdError",
    "AzureTenantIdAndClientIdNotBelongingToClientSecretError",
    "AzureClientIdAndClientSecretNotBelongingToTenantIdError",
    "AzureHTTPResponseError",
    "Error with credentials provided",
    # PowerShell Errors in User Authentication
    "Microsoft Teams User Auth connection failed: Please check your permissions and try again.",
    "Exchange Online User Auth connection failed: Please check your permissions and try again.",
]


def before_send(event, hint):
    """
    before_send handles the Sentry events in order to send them or not
    """
    # Ignore logs with the ignored_exceptions
    # https://docs.python.org/3/library/logging.html#logrecord-objects
    if "log_record" in hint:
        log_msg = hint["log_record"].msg
        log_lvl = hint["log_record"].levelno

        # Handle Error and Critical events and discard the rest
        if log_lvl <= 40 and any(ignored in log_msg for ignored in IGNORED_EXCEPTIONS):
            return None  # Explicitly return None to drop the event

    # Ignore exceptions with the ignored_exceptions
    if "exc_info" in hint and hint["exc_info"]:
        exc_value = str(hint["exc_info"][1])
        if any(ignored in exc_value for ignored in IGNORED_EXCEPTIONS):
            return None  # Explicitly return None to drop the event

    return event


sentry_sdk.init(
    dsn=env.str("DJANGO_SENTRY_DSN", ""),
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    before_send=before_send,
    send_default_pii=True,
    _experiments={
        # Set continuous_profiling_auto_start to True
        # to automatically start the profiler on when
        # possible.
        "continuous_profiling_auto_start": True,
    },
    attach_stacktrace=True,
    ignore_errors=IGNORED_EXCEPTIONS,
)
```

--------------------------------------------------------------------------------

---[FILE: social_login.py]---
Location: prowler-master/api/src/backend/config/settings/social_login.py
Signals: Django

```python
from config.env import env

# Provider Oauth settings
GOOGLE_OAUTH_CLIENT_ID = env("SOCIAL_GOOGLE_OAUTH_CLIENT_ID", default="")
GOOGLE_OAUTH_CLIENT_SECRET = env("SOCIAL_GOOGLE_OAUTH_CLIENT_SECRET", default="")
GOOGLE_OAUTH_CALLBACK_URL = env("SOCIAL_GOOGLE_OAUTH_CALLBACK_URL", default="")

GITHUB_OAUTH_CLIENT_ID = env("SOCIAL_GITHUB_OAUTH_CLIENT_ID", default="")
GITHUB_OAUTH_CLIENT_SECRET = env("SOCIAL_GITHUB_OAUTH_CLIENT_SECRET", default="")
GITHUB_OAUTH_CALLBACK_URL = env("SOCIAL_GITHUB_OAUTH_CALLBACK_URL", default="")

# Allauth settings
ACCOUNT_LOGIN_METHODS = {"email"}  # Use Email / Password authentication
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]
ACCOUNT_EMAIL_VERIFICATION = "none"  # Do not require email confirmation
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
REST_AUTH = {
    "TOKEN_MODEL": None,
    "REST_USE_JWT": True,
}
# django-allauth (social)
# Authenticate if local account with this email address already exists
SOCIALACCOUNT_EMAIL_AUTHENTICATION = True
# Connect local account and social account if local account with that email address already exists
SOCIALACCOUNT_EMAIL_AUTHENTICATION_AUTO_CONNECT = True
SOCIALACCOUNT_ADAPTER = "api.adapters.ProwlerSocialAccountAdapter"


# def inline(pem: str) -> str:
#     return "".join(
#         line.strip()
#         for line in pem.splitlines()
#         if "CERTIFICATE" not in line and "KEY" not in line
#     )


# # SAML keys (TODO: Validate certificates)
# SAML_PUBLIC_CERT = inline(env("SAML_PUBLIC_CERT", default=""))
# SAML_PRIVATE_KEY = inline(env("SAML_PRIVATE_KEY", default=""))

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": GOOGLE_OAUTH_CLIENT_ID,
            "secret": GOOGLE_OAUTH_CLIENT_SECRET,
            "key": "",
        },
        "SCOPE": [
            "email",
            "profile",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
    },
    "github": {
        "APP": {
            "client_id": GITHUB_OAUTH_CLIENT_ID,
            "secret": GITHUB_OAUTH_CLIENT_SECRET,
        },
        "SCOPE": [
            "user",
            "read:org",
        ],
    },
    "saml": {
        "use_nameid_for_email": True,
        "sp": {
            "entity_id": "urn:prowler.com:sp",
        },
        "advanced": {
            # TODO: Validate certificates
            # "x509cert": SAML_PUBLIC_CERT,
            # "private_key": SAML_PRIVATE_KEY,
            # "authn_request_signed": True,
            # "want_message_signed": True,
            # "want_assertion_signed": True,
            "reject_idp_initiated_sso": False,
            "name_id_format": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        },
    },
}
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: prowler-master/api/src/backend/config/settings/__init__.py
Signals: Celery

```python
from config.celery import celery_app

__all__ = ("celery_app",)
```

--------------------------------------------------------------------------------

---[FILE: beat.py]---
Location: prowler-master/api/src/backend/tasks/beat.py

```python
import json
from datetime import datetime, timedelta, timezone

from django_celery_beat.models import IntervalSchedule, PeriodicTask
from tasks.tasks import perform_scheduled_scan_task

from api.db_utils import rls_transaction
from api.exceptions import ConflictException
from api.models import Provider, Scan, StateChoices


def schedule_provider_scan(provider_instance: Provider):
    tenant_id = str(provider_instance.tenant_id)
    provider_id = str(provider_instance.id)

    schedule, _ = IntervalSchedule.objects.get_or_create(
        every=24,
        period=IntervalSchedule.HOURS,
    )

    # Create a unique name for the periodic task
    task_name = f"scan-perform-scheduled-{provider_instance.id}"

    if PeriodicTask.objects.filter(
        interval=schedule, name=task_name, task="scan-perform-scheduled"
    ).exists():
        raise ConflictException(
            detail="There is already a scheduled scan for this provider.",
            pointer="/data/attributes/provider_id",
        )

    with rls_transaction(tenant_id):
        scheduled_scan = Scan.objects.create(
            tenant_id=tenant_id,
            name="Daily scheduled scan",
            provider_id=provider_id,
            trigger=Scan.TriggerChoices.SCHEDULED,
            state=StateChoices.AVAILABLE,
            scheduled_at=datetime.now(timezone.utc),
        )

    # Schedule the task
    periodic_task_instance = PeriodicTask.objects.create(
        interval=schedule,
        name=task_name,
        task="scan-perform-scheduled",
        kwargs=json.dumps(
            {
                "tenant_id": tenant_id,
                "provider_id": provider_id,
            }
        ),
        one_off=False,
        start_time=datetime.now(timezone.utc) + timedelta(hours=24),
    )
    scheduled_scan.scheduler_task_id = periodic_task_instance.id
    scheduled_scan.save()

    return perform_scheduled_scan_task.apply_async(
        kwargs={
            "tenant_id": str(provider_instance.tenant_id),
            "provider_id": provider_id,
        },
        countdown=5,  # Avoid race conditions between the worker and the database
    )
```

--------------------------------------------------------------------------------

````

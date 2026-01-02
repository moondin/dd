---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1288
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1288 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: sentry.py]---
Location: zulip-main/zproject/sentry.py
Signals: Django, SQLAlchemy

```python
import os
from typing import TYPE_CHECKING, Any, Optional

import sentry_sdk
from django.utils.translation import override as override_language
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.logging import ignore_logger
from sentry_sdk.integrations.redis import RedisIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.tornado import TornadoIntegration
from sentry_sdk.utils import capture_internal_exceptions

from version import ZULIP_VERSION
from zproject.config import DEPLOY_ROOT

if TYPE_CHECKING:
    from sentry_sdk._types import Event, Hint


def add_context(event: "Event", hint: "Hint") -> Optional["Event"]:
    if "exc_info" in hint:
        _, exc_value, _ = hint["exc_info"]
        # Ignore GeneratorExit, KeyboardInterrupt, and SystemExit exceptions
        if not isinstance(exc_value, Exception):
            return None
    from django.conf import settings

    from zerver.models.users import get_user_profile_by_id

    with capture_internal_exceptions():
        # event.user is the user context, from Sentry, which is
        # pre-populated with some keys via its Django integration:
        # https://docs.sentry.io/platforms/python/guides/django/enriching-error-data/additional-data/identify-user/
        event.setdefault("tags", {})
        user_info = event.get("user", {})
        user_id = user_info.get("id")
        if isinstance(user_id, str):
            user_profile = get_user_profile_by_id(int(user_id))
            event["tags"]["realm"] = user_info["realm"] = user_profile.realm.string_id or "root"
            with override_language(settings.LANGUAGE_CODE):
                # str() to force the lazy-translation to apply now,
                # since it won't serialize into json for Sentry otherwise
                user_info["role"] = str(user_profile.get_role_name())

        # These are PII, and should be scrubbed
        if "username" in user_info:
            del user_info["username"]
        if "email" in user_info:
            del user_info["email"]

    return event


def traces_sampler(sampling_context: dict[str, Any]) -> float | bool:
    from django.conf import settings

    queue = sampling_context.get("queue")
    if queue is not None and isinstance(queue, str):
        if isinstance(settings.SENTRY_TRACE_WORKER_RATE, dict):
            return settings.SENTRY_TRACE_WORKER_RATE.get(queue, 0.0)
        else:
            return settings.SENTRY_TRACE_WORKER_RATE
    else:
        return settings.SENTRY_TRACE_RATE


def setup_sentry(dsn: str | None, environment: str) -> None:
    from django.conf import settings

    if not dsn:
        return

    sentry_release = ZULIP_VERSION
    if os.path.exists(os.path.join(DEPLOY_ROOT, "sentry-release")):
        with open(os.path.join(DEPLOY_ROOT, "sentry-release")) as sentry_release_file:
            sentry_release = sentry_release_file.readline().strip()
    integrations = [
        RedisIntegration(),
        SqlalchemyIntegration(),
    ]
    disabled_integrations = []
    if settings.RUNNING_INSIDE_TORNADO:
        integrations.append(TornadoIntegration())
        disabled_integrations.append(DjangoIntegration())
    else:
        integrations.append(DjangoIntegration())
    sentry_sdk.init(
        dsn=dsn,
        environment=environment,
        release=sentry_release,
        integrations=integrations,
        disabled_integrations=disabled_integrations,
        before_send=add_context,
        # Increase possible max wait to send exceptions during
        # shutdown, from 2 to 10; potentially-large exceptions are of
        # value to catch during shutdown.
        shutdown_timeout=10,
        # Because we strip the email/username from the Sentry data
        # above, the effect of this flag is that the requests/users
        # involved in exceptions will be identified in Sentry only by
        # their IP address, user ID, realm, and role.  We consider
        # this an appropriate balance between avoiding Sentry getting
        # PII while having the identifiers needed to determine that an
        # exception only affects a small subset of users or realms.
        send_default_pii=True,
        traces_sampler=traces_sampler,
        profiles_sample_rate=settings.SENTRY_PROFILE_RATE,
    )

    # Ignore all of the loggers from django.security that are for user
    # errors; see https://docs.djangoproject.com/en/5.0/ref/exceptions/#suspiciousoperation
    ignore_logger("django.security.SuspiciousOperation")
    ignore_logger("django.security.DisallowedHost")
    ignore_logger("django.security.DisallowedModelAdminLookup")
    ignore_logger("django.security.DisallowedModelAdminToField")
    ignore_logger("django.security.DisallowedRedirect")
    ignore_logger("django.security.InvalidSessionKey")
    ignore_logger("django.security.RequestDataTooBig")
    ignore_logger("django.security.SuspiciousFileOperation")
    ignore_logger("django.security.SuspiciousMultipartForm")
    ignore_logger("django.security.SuspiciousSession")
    ignore_logger("django.security.TooManyFieldsSent")
```

--------------------------------------------------------------------------------

---[FILE: settings.py]---
Location: zulip-main/zproject/settings.py
Signals: Django

```python
# Django settings for zulip project.
########################################################################
# Here's how settings for the Zulip project work:
#
# * configured_settings.py imports default_settings.py, which contains
#   default values for settings configurable in prod_settings.py.
#
# * configured_settings.py imports prod_settings.py, and any site-specific
#   configuration belongs there.  The template for prod_settings.py is
#   prod_settings_template.py.
#
# * computed_settings.py contains non-site-specific and settings
#   configuration for the Zulip Django app.
#
# See https://zulip.readthedocs.io/en/latest/subsystems/settings.html for more information
#
########################################################################
import sys
from typing import TYPE_CHECKING

# Patch datetime.fromisoformat for Python < 3.11
if sys.version_info < (3, 11):  # nocoverage
    from backports.datetime_fromisoformat import MonkeyPatch

    MonkeyPatch.patch_fromisoformat()

# Monkey-patch certain types that are declared as generic types
# generic in django-stubs, but not (yet) as generic types in Django
# itself. This is necessary to ensure type references like
# django.db.models.Lookup[int] work correctly at runtime.
#
# Hide this from mypy to avoid creating stupid cycles like
# zproject.settings → django_stubs_ext → django_stubs_ext.patch →
# django.contrib.admin.options → django.contrib.contenttypes.models →
# confirmation.models → django.conf → zproject.settings.
if not TYPE_CHECKING:
    import django_stubs_ext

    django_stubs_ext.monkeypatch()

from .configured_settings import *  # noqa: F403 isort: skip
from .computed_settings import *  # noqa: F403 isort: skip

# Do not add any code after these wildcard imports!  Add it to
# computed_settings instead.
```

--------------------------------------------------------------------------------

---[FILE: settings_types.py]---
Location: zulip-main/zproject/settings_types.py

```python
from typing import TypedDict


class JwtAuthKey(TypedDict):
    key: str
    # See https://pyjwt.readthedocs.io/en/latest/algorithms.html for a list
    # of supported algorithms.
    algorithms: list[str]


class SAMLIdPConfigDict(TypedDict, total=False):
    entity_id: str
    url: str
    slo_url: str
    sp_initiated_logout_enabled: bool
    attr_user_permanent_id: str
    attr_first_name: str
    attr_last_name: str
    attr_username: str
    attr_email: str
    attr_org_membership: str
    auto_signup: bool
    display_name: str
    display_icon: str
    limit_to_subdomains: list[str]
    extra_attrs: list[str]
    x509cert: str
    x509cert_path: str


class OIDCIdPConfigDict(TypedDict, total=False):
    oidc_url: str
    display_name: str
    display_icon: str | None
    client_id: str
    secret: str | None
    auto_signup: bool
    limit_to_subdomains: list[str]


class SCIMConfigDict(TypedDict, total=False):
    bearer_token: str
    scim_client_name: str
    name_formatted_included: bool
    create_guests_without_streams: bool
```

--------------------------------------------------------------------------------

---[FILE: template_loaders.py]---
Location: zulip-main/zproject/template_loaders.py
Signals: Django

```python
from pathlib import Path

from django.template.loaders import app_directories
from typing_extensions import override


class TwoFactorLoader(app_directories.Loader):
    @override
    def get_dirs(self) -> list[str | Path]:
        dirs = super().get_dirs()
        # app_directories.Loader returns only a list of
        # Path objects by calling get_app_template_dirs
        two_factor_dirs: list[str | Path] = []
        for d in dirs:
            assert isinstance(d, Path)
            if d.match("two_factor/*"):
                two_factor_dirs.append(d)
        return two_factor_dirs
```

--------------------------------------------------------------------------------

---[FILE: test_extra_settings.py]---
Location: zulip-main/zproject/test_extra_settings.py
Signals: Django

```python
import os

import ldap
from django_auth_ldap.config import LDAPSearch

from zerver.lib.db import TimeTrackingConnection, TimeTrackingCursor
from zerver.lib.types import AnalyticsDataUploadLevel
from zproject.settings_types import OIDCIdPConfigDict, SAMLIdPConfigDict, SCIMConfigDict

from .config import DEPLOY_ROOT, get_from_file_if_exists
from .settings import (
    AUTHENTICATION_BACKENDS,
    CACHES,
    DATABASES,
    EXTERNAL_HOST,
    LOCAL_DATABASE_PASSWORD,
    LOGGING,
)

FULL_STACK_ZULIP_TEST = "FULL_STACK_ZULIP_TEST" in os.environ
PUPPETEER_TESTS = "PUPPETEER_TESTS" in os.environ


FAKE_EMAIL_DOMAIN = "zulip.testserver"

# Clear out the REALM_HOSTS set in dev_settings.py
REALM_HOSTS: dict[str, str] = {}

DATABASES["default"] = {
    "NAME": os.getenv("ZULIP_DB_NAME", "zulip_test"),
    "USER": "zulip_test",
    "PASSWORD": LOCAL_DATABASE_PASSWORD,
    "HOST": "localhost",
    "ENGINE": "django.db.backends.postgresql",
    "TEST_NAME": "django_zulip_tests",
    "OPTIONS": {
        "connection_factory": TimeTrackingConnection,
        "cursor_factory": TimeTrackingCursor,
    },
}


if FULL_STACK_ZULIP_TEST:
    TORNADO_PORTS = [9983]
else:
    # Backend tests don't use tornado
    USING_TORNADO = False
    CAMO_URI = "https://external-content.zulipcdn.net/external_content/"
    CAMO_KEY = "dummy"

if "RUNNING_OPENAPI_CURL_TEST" in os.environ:
    RUNNING_OPENAPI_CURL_TEST = True

if "GENERATE_STRIPE_FIXTURES" in os.environ:
    GENERATE_STRIPE_FIXTURES = True

if "GENERATE_LITELLM_FIXTURES" in os.environ:
    GENERATE_LITELLM_FIXTURES = True

if "BAN_CONSOLE_OUTPUT" in os.environ:
    BAN_CONSOLE_OUTPUT = True

# Decrease the get_updates timeout to 1 second.
# This allows frontend tests to proceed quickly to the next test step.
EVENT_QUEUE_LONGPOLL_TIMEOUT_SECONDS = 1

# Stores the messages in `django.core.mail.outbox` rather than sending them.
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# The test suite uses EmailAuthBackend
AUTHENTICATION_BACKENDS += ("zproject.backends.EmailAuthBackend",)

# Configure Google OAuth2
GOOGLE_OAUTH2_CLIENT_ID = "test_client_id"

# Makes testing LDAP backend require less mocking
AUTH_LDAP_ALWAYS_UPDATE_USER = False
AUTH_LDAP_USER_SEARCH = LDAPSearch(
    "ou=users,dc=zulip,dc=com", ldap.SCOPE_ONELEVEL, "(uid=%(user)s)"
)
AUTH_LDAP_USERNAME_ATTR = "uid"
AUTH_LDAP_REVERSE_EMAIL_SEARCH = LDAPSearch(
    "ou=users,dc=zulip,dc=com", ldap.SCOPE_ONELEVEL, "(mail=%(email)s)"
)

RATE_LIMITING = False
RATE_LIMITING_AUTHENTICATE = False
# Don't use RabbitMQ from the test suite -- the user_profile_ids for
# any generated queue elements won't match those being used by the
# real app.
USING_RABBITMQ = False

CACHES["database"] = {
    "BACKEND": "django.core.cache.backends.dummy.DummyCache",
    "LOCATION": "zulip-database-test-cache",
    "TIMEOUT": 3600,
    "CONN_MAX_AGE": 600,
    "OPTIONS": {
        "MAX_ENTRIES": 100000,
    },
}

# Disable caching on sessions to make query counts consistent
SESSION_ENGINE = "django.contrib.sessions.backends.db"

# Use production config from Webpack in tests
if PUPPETEER_TESTS:
    WEBPACK_STATS_FILE = os.path.join(DEPLOY_ROOT, "webpack-stats-production.json")
else:
    WEBPACK_STATS_FILE = os.path.join(DEPLOY_ROOT, "var", "webpack-stats-test.json")
WEBPACK_BUNDLES = "webpack-bundles/"

if not PUPPETEER_TESTS:
    # Use local memory cache for backend tests.
    CACHES["default"] = {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }

    # Here we set various loggers to be less noisy for unit tests.
    def set_loglevel(logger_name: str, level: str) -> None:
        LOGGING["loggers"].setdefault(logger_name, {})["level"] = level

    set_loglevel("zulip.requests", "CRITICAL")
    set_loglevel("zulip.management", "CRITICAL")
    set_loglevel("zulip.auth", "WARNING")
    set_loglevel("django.request", "ERROR")
    set_loglevel("django_auth_ldap", "WARNING")
    set_loglevel("fakeldap", "ERROR")
    set_loglevel("zulip.send_email", "ERROR")
    set_loglevel("zerver.lib.push_notifications", "WARNING")
    set_loglevel("zerver.lib.digest", "ERROR")
    set_loglevel("zerver.lib.email_mirror", "ERROR")
    set_loglevel("zerver.worker", "WARNING")
    set_loglevel("stripe", "WARNING")

# This is set dynamically in `zerver/lib/test_runner.py`.
# Allow setting LOCAL_UPLOADS_DIR in the environment so that the
# frontend/API tests in test_server.py can control this.
if "LOCAL_UPLOADS_DIR" in os.environ:
    LOCAL_UPLOADS_DIR = os.getenv("LOCAL_UPLOADS_DIR")
    assert LOCAL_UPLOADS_DIR is not None
    LOCAL_AVATARS_DIR = os.path.join(LOCAL_UPLOADS_DIR, "avatars")
    LOCAL_FILES_DIR = os.path.join(LOCAL_UPLOADS_DIR, "files")
# Otherwise, we use the default value from dev_settings.py

S3_KEY = "test-key"
S3_SECRET_KEY = "test-secret-key"
S3_AUTH_UPLOADS_BUCKET = "test-authed-bucket"
S3_AVATAR_BUCKET = "test-avatar-bucket"
S3_EXPORT_BUCKET = "test-export-bucket"

INLINE_URL_EMBED_PREVIEW = False

HOME_NOT_LOGGED_IN = "/login/"
LOGIN_URL = "/accounts/login/"

# If dev_settings.py found a key or cert file to use here, ignore it.
APNS_TOKEN_KEY_FILE: str | None = None
APNS_CERT_FILE: str | None = None

# By default will not send emails when login occurs.
# Explicitly set this to True within tests that must have this on.
SEND_LOGIN_EMAILS = False

GOOGLE_OAUTH2_CLIENT_ID = "id"
GOOGLE_OAUTH2_CLIENT_SECRET = "secret"

SOCIAL_AUTH_GITHUB_KEY = "key"
SOCIAL_AUTH_GITHUB_SECRET = "secret"
SOCIAL_AUTH_GITLAB_KEY = "key"
SOCIAL_AUTH_GITLAB_SECRET = "secret"
SOCIAL_AUTH_GOOGLE_KEY = "key"
SOCIAL_AUTH_GOOGLE_SECRET = "secret"
SOCIAL_AUTH_SUBDOMAIN = "auth"
SOCIAL_AUTH_APPLE_SERVICES_ID = "com.zulip.chat"
SOCIAL_AUTH_APPLE_APP_ID = "com.zulip.bundle.id"
SOCIAL_AUTH_APPLE_CLIENT = "com.zulip.chat"
SOCIAL_AUTH_APPLE_AUDIENCE = [SOCIAL_AUTH_APPLE_APP_ID, SOCIAL_AUTH_APPLE_SERVICES_ID]
SOCIAL_AUTH_APPLE_KEY = "KEYISKEY"
SOCIAL_AUTH_APPLE_TEAM = "TEAMSTRING"
SOCIAL_AUTH_APPLE_SECRET = get_from_file_if_exists("zerver/tests/fixtures/apple/private_key.pem")


SOCIAL_AUTH_OIDC_ENABLED_IDPS: dict[str, OIDCIdPConfigDict] = {
    "testoidc": {
        "display_name": "Test OIDC",
        "oidc_url": "https://example.com/api/openid",
        "display_icon": None,
        "client_id": "key",
        "secret": "secret",
    }
}
SOCIAL_AUTH_OIDC_FULL_NAME_VALIDATED = True


VIDEO_ZOOM_SERVER_TO_SERVER_ACCOUNT_ID = "account_id"
VIDEO_ZOOM_API_URL = "https://api.zoom.us"
VIDEO_ZOOM_OAUTH_URL = "https://zoom.example.com"
VIDEO_ZOOM_CLIENT_ID = "client_id"
VIDEO_ZOOM_CLIENT_SECRET = "client_secret"

BIG_BLUE_BUTTON_SECRET = "123"
BIG_BLUE_BUTTON_URL = "https://bbb.example.com/bigbluebutton/"

# By default two factor authentication is disabled in tests.
# Explicitly set this to True within tests that must have this on.
TWO_FACTOR_AUTHENTICATION_ENABLED = False

DEVELOPMENT_DISABLE_PUSH_BOUNCER_DOMAIN_CHECK = False
ZULIP_SERVICES_URL = f"http://push.{EXTERNAL_HOST}"

# Disable all Zulip services by default. Tests can activate them by
# overriding settings explicitly when they want to enable something,
# often using activate_push_notification_service.
ZULIP_SERVICE_PUSH_NOTIFICATIONS = False
ZULIP_SERVICE_SUBMIT_USAGE_STATISTICS = False
ZULIP_SERVICE_SECURITY_ALERTS = False

# Hack: This should be computed in computed_settings, but the transmission
# of test settings overrides is wonky. See test_settings for more details.
ANALYTICS_DATA_UPLOAD_LEVEL = AnalyticsDataUploadLevel.NONE

# The most common value used by tests. Set it as the default so that it doesn't
# have to be repeated every time.
ZULIP_SERVICES_URL = "https://push.zulip.org.example.com"

# Logging the emails while running the tests adds them
# to /emails page.
DEVELOPMENT_LOG_EMAILS = False

SOCIAL_AUTH_SAML_SP_ENTITY_ID = "http://" + EXTERNAL_HOST
SOCIAL_AUTH_SAML_SP_PUBLIC_CERT = get_from_file_if_exists("zerver/tests/fixtures/saml/zulip.crt")
SOCIAL_AUTH_SAML_SP_PRIVATE_KEY = get_from_file_if_exists("zerver/tests/fixtures/saml/zulip.key")

SOCIAL_AUTH_SAML_ORG_INFO = {
    "en-US": {
        "name": "example",
        "displayname": "Example Inc.",
        "url": "{}{}".format("http://", EXTERNAL_HOST),
    },
}

SOCIAL_AUTH_SAML_TECHNICAL_CONTACT = {
    "givenName": "Tech Gal",
    "emailAddress": "technical@example.com",
}

SOCIAL_AUTH_SAML_SUPPORT_CONTACT = {
    "givenName": "Support Guy",
    "emailAddress": "support@example.com",
}

SOCIAL_AUTH_SAML_ENABLED_IDPS: dict[str, SAMLIdPConfigDict] = {
    "test_idp": {
        "entity_id": "https://idp.testshib.org/idp/shibboleth",
        "url": "https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO",
        "slo_url": "https://idp.testshib.org/idp/profile/SAML2/Redirect/Logout",
        "sp_initiated_logout_enabled": True,
        "x509cert": get_from_file_if_exists("zerver/tests/fixtures/saml/idp.crt"),
        "attr_user_permanent_id": "email",
        "attr_first_name": "first_name",
        "attr_last_name": "last_name",
        "attr_username": "email",
        "attr_email": "email",
        "display_name": "Test IdP",
    },
}

RATE_LIMITING_RULES: dict[str, list[tuple[int, int]]] = {
    "api_by_user": [],
    "api_by_ip": [],
    "api_by_remote_server": [],
    "authenticate_by_username": [],
    "sends_email_by_ip": [],
    "email_change_by_user": [],
    "password_reset_form_by_email": [],
    "sends_email_by_remote_server": [],
}

CLOUD_FREE_TRIAL_DAYS: int | None = None
SELF_HOSTING_FREE_TRIAL_DAYS: int | None = None

SCIM_CONFIG: dict[str, SCIMConfigDict] = {
    "zulip": {
        "bearer_token": "token1234",
        "scim_client_name": "test-scim-client",
        "name_formatted_included": True,
    }
}

# This override disables the grace period for undoing resolving/unresolving
# a topic in tests.
# This allows tests to not worry about the special behavior during the grace period.
# Otherwise they would have to do lots of mocking of the timer to work around this.
RESOLVE_TOPIC_UNDO_GRACE_PERIOD_SECONDS = 0

KATEX_SERVER = False

ROOT_DOMAIN_LANDING_PAGE = False

# Disable verifying webhook signatures in tests by default.
# Tests that intend to verify webhook signatures should override this setting.
VERIFY_WEBHOOK_SIGNATURES = False

AUTH_LDAP_USER_ATTR_MAP = {
    "full_name": "cn",
}
```

--------------------------------------------------------------------------------

---[FILE: test_settings.py]---
Location: zulip-main/zproject/test_settings.py

```python
import os

# test_settings.py works differently from
# dev_settings.py/prod_settings.py; it actually is directly referenced
# by the test suite as DJANGO_SETTINGS_MODULE and imports settings.py
# directly and then hacks up the values that are different for the
# test suite.  As will be explained, this is kinda messy and probably
# we'd be better off switching it to work more like dev_settings.py,
# but for now, this is what we have.
#
# An important downside of the test_settings.py approach is that if we
# want to change any settings that settings.py then computes
# additional settings from (e.g. EXTERNAL_HOST), we need to do a hack
# like the below line(s) before we import from settings, for
# transmitting the value of EXTERNAL_HOST to dev_settings.py so that
# it can be set there, at the right place in the settings.py flow.
# Ick.
os.environ["EXTERNAL_HOST"] = os.getenv("TEST_EXTERNAL_HOST", "testserver")
os.environ["ZULIP_TEST_SUITE"] = "true"

from .settings import *  # noqa: F403 isort: skip
from .test_extra_settings import *  # noqa: F403 isort: skip

# Do not add any code after these wildcard imports!  Add it to
# test_extra_settings instead.
```

--------------------------------------------------------------------------------

````

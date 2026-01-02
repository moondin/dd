---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1286
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1286 of 1290)

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

---[FILE: dev_settings.py]---
Location: zulip-main/zproject/dev_settings.py
Signals: Django

```python
import os
import pwd

from scripts.lib.zulip_tools import deport
from zproject.settings_types import SCIMConfigDict

ZULIP_ADMINISTRATOR = "desdemona+admin@zulip.com"

# Initiatize TEST_SUITE early, so other code can rely on the setting.
TEST_SUITE = os.getenv("ZULIP_TEST_SUITE") == "true"

# We want LOCAL_UPLOADS_DIR to be an absolute path so that code can
# chdir without having problems accessing it.  Unfortunately, this
# means we need a duplicate definition of DEPLOY_ROOT with the one in
# settings.py.
DEPLOY_ROOT = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
LOCAL_UPLOADS_DIR = os.path.join(DEPLOY_ROOT, "var/uploads")

# We assume dev droplets are the only places where
# users use zulipdev as the user.
IS_DEV_DROPLET = pwd.getpwuid(os.getuid()).pw_name == "zulipdev"

FORWARD_ADDRESS_CONFIG_FILE = "var/forward_address.ini"
# Check if test_settings.py set EXTERNAL_HOST.
external_host_env = os.getenv("EXTERNAL_HOST")
if external_host_env is None:
    if IS_DEV_DROPLET:
        # For our droplets, we use the hostname (eg github_username.zulipdev.org) by default.
        # Note that this code is duplicated in run-dev.
        EXTERNAL_HOST = os.uname()[1].lower() + ":9991"
    else:
        # For local development environments, we use localhost by
        # default, via the "zulipdev.com" hostname.
        EXTERNAL_HOST = "zulipdev.com:9991"
        # Serve the main dev realm at the literal name "localhost",
        # so it works out of the box even when not on the Internet.
        REALM_HOSTS = {
            "zulip": "localhost:9991",
        }
else:
    EXTERNAL_HOST = external_host_env
    REALM_HOSTS = {
        "zulip": EXTERNAL_HOST,
    }

EXTERNAL_HOST_WITHOUT_PORT = deport(EXTERNAL_HOST)

FAKE_EMAIL_DOMAIN = "zulipdev.com"

ALLOWED_HOSTS = ["*"]

# Uncomment extra backends if you want to test with them.  Note that
# for Google and GitHub auth you'll need to do some pre-setup.
AUTHENTICATION_BACKENDS: tuple[str, ...] = (
    "zproject.backends.DevAuthBackend",
    "zproject.backends.EmailAuthBackend",
    "zproject.backends.GitHubAuthBackend",
    "zproject.backends.GoogleAuthBackend",
    "zproject.backends.SAMLAuthBackend",
    # 'zproject.backends.AzureADAuthBackend',
    "zproject.backends.GitLabAuthBackend",
    "zproject.backends.AppleAuthBackend",
    "zproject.backends.GenericOpenIdConnectBackend",
)

EXTERNAL_URI_SCHEME = "http://"

if os.getenv("BEHIND_HTTPS_PROXY"):
    # URLs served by the development environment will be HTTPS
    EXTERNAL_URI_SCHEME = "https://"
    # Trust requests from this host (required due to Nginx proxy)
    CSRF_TRUSTED_ORIGINS = [EXTERNAL_URI_SCHEME + EXTERNAL_HOST]

EMAIL_GATEWAY_PATTERN = "%s@" + EXTERNAL_HOST_WITHOUT_PORT
NOTIFICATION_BOT = "notification-bot@zulip.com"
EMAIL_GATEWAY_BOT = "emailgateway@zulip.com"
PHYSICAL_ADDRESS = "Zulip Headquarters, 123 Octo Stream, South Pacific Ocean"
STAFF_SUBDOMAIN = "zulip"
EXTRA_INSTALLED_APPS = ["zilencer", "analytics", "corporate"]
# Disable Camo in development
CAMO_URI = ""
KATEX_SERVER = False

TORNADO_PORTS = [9993]

OPEN_REALM_CREATION = True
WEB_PUBLIC_STREAMS_ENABLED = True
INVITES_MIN_USER_AGE_DAYS = 0

# Redirect to /devlogin/ by default in dev mode
CUSTOM_HOME_NOT_LOGGED_IN = "/devlogin/"
LOGIN_URL = "/devlogin/"

# For development convenience, configure the ToS/Privacy Policies
POLICIES_DIRECTORY = "corporate/policies"
TERMS_OF_SERVICE_VERSION = "1.0"
TERMS_OF_SERVICE_MESSAGE: str | None = "Description of changes to the ToS!"

EMBEDDED_BOTS_ENABLED = True

SYSTEM_ONLY_REALMS: set[str] = set()
USING_PGROONGA = True
# Flush cache after migration.
POST_MIGRATION_CACHE_FLUSHING = True

# If a sandbox APNs key or cert is provided, use it.
# To create such a key or cert, see instructions at:
#   https://github.com/zulip/zulip-mobile/blob/main/docs/howto/push-notifications.md#ios
_candidate_apns_token_key_file = "zproject/apns-dev-key.p8"
_candidate_apns_cert_file = "zproject/apns-dev.pem"
if os.path.isfile(_candidate_apns_token_key_file):
    APNS_TOKEN_KEY_FILE = _candidate_apns_token_key_file
elif os.path.isfile(_candidate_apns_cert_file):
    APNS_CERT_FILE = _candidate_apns_cert_file

# Don't require anything about password strength in development
PASSWORD_MIN_LENGTH = 0
PASSWORD_MAX_LENGTH = 100
PASSWORD_MIN_GUESSES = 0

# Two factor authentication: Use the fake backend for development.
TWO_FACTOR_CALL_GATEWAY = "two_factor.gateways.fake.Fake"
TWO_FACTOR_SMS_GATEWAY = "two_factor.gateways.fake.Fake"

# FAKE_LDAP_MODE supports using a fake LDAP database in the
# development environment, without needing an LDAP server!
#
# Three modes are allowed, and each will set up Zulip and the fake LDAP
# database in a way appropriate for the corresponding mode described
# in https://zulip.readthedocs.io/en/latest/production/authentication-methods.html#ldap-including-active-directory
#   (A) If users' email addresses are in LDAP and used as username.
#   (B) If LDAP only has usernames but email addresses are of the form
#       username@example.com
#   (C) If LDAP usernames are completely unrelated to email addresses.
#
# Fake LDAP data has e.g. ("ldapuser1", "ldapuser1@zulip.com") for username/email.
FAKE_LDAP_MODE: str | None = None
# FAKE_LDAP_NUM_USERS = 8

if FAKE_LDAP_MODE:
    import ldap
    from django_auth_ldap.config import LDAPSearch

    # To understand these parameters, read the docs in
    # prod_settings_template.py and on ReadTheDocs.
    LDAP_APPEND_DOMAIN = None
    AUTH_LDAP_USER_SEARCH = LDAPSearch(
        "ou=users,dc=zulip,dc=com", ldap.SCOPE_ONELEVEL, "(uid=%(user)s)"
    )
    AUTH_LDAP_REVERSE_EMAIL_SEARCH = LDAPSearch(
        "ou=users,dc=zulip,dc=com", ldap.SCOPE_ONELEVEL, "(email=%(email)s)"
    )

    if FAKE_LDAP_MODE == "a":
        AUTH_LDAP_REVERSE_EMAIL_SEARCH = LDAPSearch(
            "ou=users,dc=zulip,dc=com", ldap.SCOPE_ONELEVEL, "(uid=%(email)s)"
        )
        AUTH_LDAP_USERNAME_ATTR = "uid"
        AUTH_LDAP_USER_ATTR_MAP = {
            "full_name": "cn",
            "avatar": "thumbnailPhoto",
            # This won't do much unless one changes the fact that
            # all users have LDAP_USER_ACCOUNT_CONTROL_NORMAL in
            # zerver/lib/dev_ldap_directory.py
            "userAccountControl": "userAccountControl",
        }
    elif FAKE_LDAP_MODE == "b":
        LDAP_APPEND_DOMAIN = "zulip.com"
        AUTH_LDAP_USER_ATTR_MAP = {
            "full_name": "cn",
            "avatar": "jpegPhoto",
            "custom_profile_field__birthday": "birthDate",
            "custom_profile_field__phone_number": "phoneNumber",
        }
    elif FAKE_LDAP_MODE == "c":
        AUTH_LDAP_USERNAME_ATTR = "uid"
        LDAP_EMAIL_ATTR = "email"
        AUTH_LDAP_USER_ATTR_MAP = {
            "full_name": "cn",
        }
    AUTHENTICATION_BACKENDS += ("zproject.backends.ZulipLDAPAuthBackend",)

BILLING_ENABLED = True
LANDING_PAGE_NAVBAR_MESSAGE: str | None = None

# Our run-dev proxy uses X-Forwarded-Port to communicate to Django
# that the request is actually on port 9991, not port 9992 (the Django
# server's own port); this setting tells Django to read that HTTP
# header.  Important for SAML authentication in the development
# environment.
USE_X_FORWARDED_PORT = True

# Override the default SAML entity ID
SOCIAL_AUTH_SAML_SP_ENTITY_ID = "http://localhost:9991"

SOCIAL_AUTH_SUBDOMAIN = "auth"

MEMCACHED_USERNAME: str | None = None

SCIM_CONFIG: dict[str, SCIMConfigDict] = {
    "zulip": {
        "bearer_token": "token1234",
        "scim_client_name": "test-scim-client",
        "name_formatted_included": True,
    }
}

SELF_HOSTING_MANAGEMENT_SUBDOMAIN = "selfhosting"
DEVELOPMENT_DISABLE_PUSH_BOUNCER_DOMAIN_CHECK = True
ZULIP_SERVICES_URL = f"http://{EXTERNAL_HOST}"

ZULIP_SERVICE_PUSH_NOTIFICATIONS = True
ZULIP_SERVICE_SUBMIT_USAGE_STATISTICS = True

# This value needs to be lower in development than usual to allow
# for quicker testing of the feature.
RESOLVE_TOPIC_UNDO_GRACE_PERIOD_SECONDS = 5

# In a dev environment, 'zulipdev.com:9991' is used to access the landing page.
# See: https://zulip.readthedocs.io/en/latest/subsystems/realms.html#working-with-subdomains-in-development-environment
ROOT_DOMAIN_LANDING_PAGE = True

# Enable demo organizations feature in dev environment.
DEMO_ORG_DEADLINE_DAYS = 30

# Enable ALTCHA, so that we test this flow; we can only do this on localhost.
if external_host_env is None and not IS_DEV_DROPLET:
    USING_CAPTCHA = True

TOPIC_SUMMARIZATION_MODEL = "groq/llama-3.3-70b-versatile"
# Defaults based on groq's pricing for Llama 3.3 70B Versatile 128k.
# https://groq.com/pricing/
OUTPUT_COST_PER_GIGATOKEN = 590
INPUT_COST_PER_GIGATOKEN = 790
MAX_PER_USER_MONTHLY_AI_COST = 1
MAX_WEB_DATA_IMPORT_SIZE_MB = 1024
```

--------------------------------------------------------------------------------

---[FILE: dev_urls.py]---
Location: zulip-main/zproject/dev_urls.py
Signals: Django

```python
import os
from urllib.parse import urlsplit

from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.views import serve as staticfiles_serve
from django.http.request import HttpRequest
from django.http.response import FileResponse
from django.urls import path
from django.views.generic import RedirectView, TemplateView
from django.views.static import serve

from zerver.views.auth import login_page
from zerver.views.development.cache import remove_caches
from zerver.views.development.camo import handle_camo_url
from zerver.views.development.dev_login import (
    api_dev_fetch_api_key,
    api_dev_list_users,
    dev_direct_login,
)
from zerver.views.development.email_log import clear_emails, email_page, generate_all_emails
from zerver.views.development.help import help_dev_mode_view
from zerver.views.development.integrations import (
    check_send_webhook_fixture_message,
    dev_panel,
    get_fixtures,
    send_all_webhook_fixture_messages,
)
from zerver.views.development.registration import (
    confirmation_key,
    register_demo_development_realm,
    register_development_realm,
    register_development_user,
)
from zerver.views.development.showroom import (
    showroom_component_banners,
    showroom_component_buttons,
    showroom_component_inputs,
)
from zerver.views.errors import config_error

# These URLs are available only in the development environment

use_prod_static = not settings.DEBUG

urls = [
    # Serve useful development environment resources (docs, coverage reports, etc.)
    path(
        "coverage/<path:path>",
        serve,
        {"document_root": os.path.join(settings.DEPLOY_ROOT, "var/coverage"), "show_indexes": True},
    ),
    path(
        "node-coverage/<path:path>",
        serve,
        {
            "document_root": os.path.join(settings.DEPLOY_ROOT, "var/node-coverage/lcov-report"),
            "show_indexes": True,
        },
    ),
    path("docs/", RedirectView.as_view(url="/docs/index.html")),
    path(
        "docs/<path:path>",
        serve,
        {"document_root": os.path.join(settings.DEPLOY_ROOT, "docs/_build/html")},
    ),
    # The special no-password login endpoint for development
    path(
        "devlogin/",
        login_page,
        {"template_name": "zerver/development/dev_login.html"},
        name="login_page",
    ),
    # Page for testing email templates
    path("emails/", email_page),
    path("emails/generate/", generate_all_emails),
    path("emails/clear/", clear_emails),
    # Listing of useful URLs and various tools for development
    path("devtools/", TemplateView.as_view(template_name="zerver/development/dev_tools.html")),
    # Register new user and realm
    path("devtools/register_user/", register_development_user, name="register_dev_user"),
    path("devtools/register_realm/", register_development_realm, name="register_dev_realm"),
    path(
        "devtools/register_demo_realm/",
        register_demo_development_realm,
        name="register_demo_dev_realm",
    ),
    # Have easy access for error pages
    path("errors/404/", TemplateView.as_view(template_name="404.html")),
    path("errors/5xx/", TemplateView.as_view(template_name="500.html")),
    # Add a convenient way to generate webhook messages from fixtures.
    path("devtools/integrations/", dev_panel),
    path(
        "devtools/integrations/check_send_webhook_fixture_message",
        check_send_webhook_fixture_message,
    ),
    path(
        "devtools/integrations/send_all_webhook_fixture_messages", send_all_webhook_fixture_messages
    ),
    path("devtools/integrations/<integration_name>/fixtures", get_fixtures),
    path("config-error/<error_name>", config_error, name="config_error"),
    # Special endpoint to remove all the server-side caches.
    path("flush_caches", remove_caches),
    # Redirect camo URLs for development
    path("external_content/<digest>/<received_url>", handle_camo_url),
    # Endpoints for Showroom components.
    path("devtools/buttons/", showroom_component_buttons),
    path("devtools/banners/", showroom_component_banners),
    path("devtools/inputs/", showroom_component_inputs),
    # Development server for the help center in not run by default, we
    # show this page with zulip.com and view source links instead.
    path("help", help_dev_mode_view),
    path("help/", help_dev_mode_view),
    path("help/<path:subpath>", help_dev_mode_view),
]

v1_api_mobile_patterns = [
    # This is for the signing in through the devAuthBackEnd on mobile apps.
    path("dev_fetch_api_key", api_dev_fetch_api_key),
    # This is for fetching the emails of the admins and the users.
    path("dev_list_users", api_dev_list_users),
]
# Serve static assets via the Django server
if use_prod_static:
    urls += [
        path("static/<path:path>", serve, {"document_root": settings.STATIC_ROOT}),
    ]
else:  # nocoverage

    def serve_static(request: HttpRequest, path: str) -> FileResponse:
        response = staticfiles_serve(request, path)
        response["Access-Control-Allow-Origin"] = "*"
        return response

    assert settings.STATIC_URL is not None
    urls += static(urlsplit(settings.STATIC_URL).path, view=serve_static)

i18n_urls = [
    path("accounts/login/local/", dev_direct_login, name="login-local"),
    path("confirmation_key/", confirmation_key),
]
urls += i18n_urls
```

--------------------------------------------------------------------------------

---[FILE: email_backends.py]---
Location: zulip-main/zproject/email_backends.py
Signals: Django

```python
# https://zulip.readthedocs.io/en/latest/subsystems/email.html#testing-in-a-real-email-client
import configparser
import logging
from collections.abc import Sequence
from email.message import Message

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.mail.backends.smtp import EmailBackend
from django.core.mail.message import EmailAlternative, EmailMessage
from django.template import loader
from typing_extensions import override


def get_forward_address() -> str:
    config = configparser.ConfigParser()
    config.read(settings.FORWARD_ADDRESS_CONFIG_FILE)
    try:
        return config.get("DEV_EMAIL", "forward_address")
    except (configparser.NoSectionError, configparser.NoOptionError):
        return ""


def set_forward_address(forward_address: str) -> None:
    config = configparser.ConfigParser()
    config.read(settings.FORWARD_ADDRESS_CONFIG_FILE)

    if not config.has_section("DEV_EMAIL"):
        config.add_section("DEV_EMAIL")
    config.set("DEV_EMAIL", "forward_address", forward_address)

    with open(settings.FORWARD_ADDRESS_CONFIG_FILE, "w") as cfgfile:
        config.write(cfgfile)


class EmailLogBackEnd(EmailBackend):
    @staticmethod
    def log_email(email: EmailMessage) -> None:
        """Used in development to record sent emails in a nice HTML log"""
        html_message: bytes | EmailMessage | Message | str = "Missing HTML message"
        assert isinstance(email, EmailMultiAlternatives)
        if len(email.alternatives) > 0:
            html_message = email.alternatives[0][0]

        context = {
            "subject": email.subject,
            "envelope_from": email.from_email,
            "from_email": email.extra_headers.get("From", email.from_email),
            "reply_to": email.reply_to,
            "recipients": email.to,
            "body": email.body,
            "date": email.extra_headers.get("Date", "?"),
            "html_message": html_message,
        }

        new_email = loader.render_to_string("zerver/email.html", context)

        # Read in the pre-existing log, so that we can add the new entry
        # at the top.
        try:
            with open(settings.EMAIL_CONTENT_LOG_PATH) as f:
                previous_emails = f.read()
        except FileNotFoundError:
            previous_emails = ""

        with open(settings.EMAIL_CONTENT_LOG_PATH, "w+") as f:
            f.write(new_email + previous_emails)

    @staticmethod
    def prepare_email_messages_for_forwarding(email_messages: Sequence[EmailMessage]) -> None:
        localhost_email_images_base_url = settings.ROOT_DOMAIN_URI + "/static/images/emails"
        czo_email_images_base_url = "https://chat.zulip.org/static/images/emails"

        for email_message in email_messages:
            assert isinstance(email_message, EmailMultiAlternatives)
            # Here, we replace the image URLs used in development with
            # chat.zulip.org URLs, so that web email providers like Gmail
            # will be able to fetch the illustrations used in the emails.
            assert isinstance(email_message.alternatives[0], EmailAlternative)
            original_content = email_message.alternatives[0].content
            original_mimetype = email_message.alternatives[0].mimetype
            assert isinstance(original_content, str)
            email_message.alternatives[0] = EmailAlternative(
                content=original_content.replace(
                    localhost_email_images_base_url, czo_email_images_base_url
                ),
                mimetype=original_mimetype,
            )

            email_message.to = [get_forward_address()]

    # This wrapper function exists to allow tests easily to mock the
    # step of trying to send the emails. Previously, we had mocked
    # Django's connection.send_messages(), which caused unexplained
    # test failures when running test-backend at very high
    # concurrency.
    def _do_send_messages(self, email_messages: Sequence[EmailMessage]) -> int:
        return super().send_messages(email_messages)  # nocoverage

    @override
    def send_messages(self, email_messages: Sequence[EmailMessage]) -> int:
        num_sent = len(email_messages)
        if get_forward_address():
            self.prepare_email_messages_for_forwarding(email_messages)
            num_sent = self._do_send_messages(email_messages)

        if settings.DEVELOPMENT_LOG_EMAILS:
            for email in email_messages:
                self.log_email(email)
                email_log_url = settings.ROOT_DOMAIN_URI + "/emails"
                logging.info("Emails sent in development are available at %s", email_log_url)
        return num_sent
```

--------------------------------------------------------------------------------

---[FILE: prod_settings.pyi]---
Location: zulip-main/zproject/prod_settings.pyi

```text
from .prod_settings_template import *  # noqa: F403
```

--------------------------------------------------------------------------------

````

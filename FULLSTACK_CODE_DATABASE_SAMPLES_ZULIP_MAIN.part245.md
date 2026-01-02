---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 245
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 245 of 1290)

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

---[FILE: upgrade.py]---
Location: zulip-main/corporate/views/upgrade.py
Signals: Django, Pydantic

```python
import logging
from typing import TYPE_CHECKING

from django.conf import settings
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from pydantic import Json

from corporate.lib.billing_types import BillingModality, BillingSchedule, LicenseManagement
from corporate.lib.decorator import (
    authenticated_remote_realm_management_endpoint,
    authenticated_remote_server_management_endpoint,
)
from corporate.models.plans import CustomerPlan
from zerver.decorator import require_organization_member, zulip_login_required
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import UserProfile
from zilencer.lib.remote_counts import MissingDataError

if TYPE_CHECKING:
    from corporate.lib.stripe import RemoteRealmBillingSession, RemoteServerBillingSession

billing_logger = logging.getLogger("corporate.stripe")


@require_organization_member
@typed_endpoint
def upgrade(
    request: HttpRequest,
    user: UserProfile,
    *,
    billing_modality: BillingModality,
    schedule: BillingSchedule,
    signed_seat_count: str,
    salt: str,
    license_management: LicenseManagement | None = None,
    licenses: Json[int] | None = None,
    tier: Json[int] = CustomerPlan.TIER_CLOUD_STANDARD,
) -> HttpResponse:
    from corporate.lib.stripe import BillingError, RealmBillingSession, UpgradeRequest

    try:
        upgrade_request = UpgradeRequest(
            billing_modality=billing_modality,
            schedule=schedule,
            signed_seat_count=signed_seat_count,
            salt=salt,
            license_management=license_management,
            licenses=licenses,
            tier=tier,
            remote_server_plan_start_date=None,
        )
        billing_session = RealmBillingSession(user)
        data = billing_session.do_upgrade(upgrade_request)
        return json_success(request, data)
    except BillingError as e:
        billing_logger.warning(
            "BillingError during upgrade: %s. user=%s, realm=%s (%s), billing_modality=%s, "
            "schedule=%s, license_management=%s, licenses=%s",
            e.error_description,
            user.id,
            user.realm.id,
            user.realm.string_id,
            billing_modality,
            schedule,
            license_management,
            licenses,
        )
        raise e
    except Exception:
        billing_logger.exception("Uncaught exception in billing:", stack_info=True)
        error_message = BillingError.CONTACT_SUPPORT.format(email=settings.ZULIP_ADMINISTRATOR)
        error_description = "uncaught exception during upgrade"
        raise BillingError(error_description, error_message)


@typed_endpoint
@authenticated_remote_realm_management_endpoint
def remote_realm_upgrade(
    request: HttpRequest,
    billing_session: "RemoteRealmBillingSession",
    *,
    billing_modality: BillingModality,
    schedule: BillingSchedule,
    signed_seat_count: str,
    salt: str,
    license_management: LicenseManagement | None = None,
    licenses: Json[int] | None = None,
    remote_server_plan_start_date: str | None = None,
    tier: Json[int] = CustomerPlan.TIER_SELF_HOSTED_BUSINESS,
) -> HttpResponse:
    from corporate.lib.stripe import BillingError, UpgradeRequest

    try:
        upgrade_request = UpgradeRequest(
            billing_modality=billing_modality,
            schedule=schedule,
            signed_seat_count=signed_seat_count,
            salt=salt,
            license_management=license_management,
            licenses=licenses,
            tier=tier,
            remote_server_plan_start_date=remote_server_plan_start_date,
        )
        data = billing_session.do_upgrade(upgrade_request)
        return json_success(request, data)
    except BillingError as e:  # nocoverage
        billing_logger.warning(
            "BillingError during upgrade: %s. remote_realm=%s (%s), billing_modality=%s, "
            "schedule=%s, license_management=%s, licenses=%s",
            e.error_description,
            billing_session.remote_realm.id,
            billing_session.remote_realm.host,
            billing_modality,
            schedule,
            license_management,
            licenses,
        )
        raise e
    except Exception:  # nocoverage
        billing_logger.exception("Uncaught exception in billing:", stack_info=True)
        error_message = BillingError.CONTACT_SUPPORT.format(email=settings.ZULIP_ADMINISTRATOR)
        error_description = "uncaught exception during upgrade"
        raise BillingError(error_description, error_message)


@typed_endpoint
@authenticated_remote_server_management_endpoint
def remote_server_upgrade(
    request: HttpRequest,
    billing_session: "RemoteServerBillingSession",
    *,
    billing_modality: BillingModality,
    schedule: BillingSchedule,
    signed_seat_count: str,
    salt: str,
    license_management: LicenseManagement | None = None,
    licenses: Json[int] | None = None,
    remote_server_plan_start_date: str | None = None,
    tier: Json[int] = CustomerPlan.TIER_SELF_HOSTED_BUSINESS,
) -> HttpResponse:
    from corporate.lib.stripe import BillingError, UpgradeRequest

    try:
        upgrade_request = UpgradeRequest(
            billing_modality=billing_modality,
            schedule=schedule,
            signed_seat_count=signed_seat_count,
            salt=salt,
            license_management=license_management,
            licenses=licenses,
            tier=tier,
            remote_server_plan_start_date=remote_server_plan_start_date,
        )
        data = billing_session.do_upgrade(upgrade_request)
        return json_success(request, data)
    except BillingError as e:  # nocoverage
        billing_logger.warning(
            "BillingError during upgrade: %s. remote_server=%s (%s), billing_modality=%s, "
            "schedule=%s, license_management=%s, licenses=%s",
            e.error_description,
            billing_session.remote_server.id,
            billing_session.remote_server.hostname,
            billing_modality,
            schedule,
            license_management,
            licenses,
        )
        raise e
    except Exception:  # nocoverage
        billing_logger.exception("Uncaught exception in billing:", stack_info=True)
        error_message = BillingError.CONTACT_SUPPORT.format(email=settings.ZULIP_ADMINISTRATOR)
        error_description = "uncaught exception during upgrade"
        raise BillingError(error_description, error_message)


@zulip_login_required
@typed_endpoint
def upgrade_page(
    request: HttpRequest,
    *,
    manual_license_management: Json[bool] = False,
    tier: Json[int] = CustomerPlan.TIER_CLOUD_STANDARD,
    setup_payment_by_invoice: Json[bool] = False,
) -> HttpResponse:
    from corporate.lib.stripe import InitialUpgradeRequest, RealmBillingSession

    user = request.user
    assert user.is_authenticated

    if not settings.BILLING_ENABLED or user.is_guest:
        return render(request, "404.html", status=404)

    billing_modality = "charge_automatically"
    if setup_payment_by_invoice:
        billing_modality = "send_invoice"

    initial_upgrade_request = InitialUpgradeRequest(
        manual_license_management=manual_license_management,
        tier=tier,
        billing_modality=billing_modality,
    )
    billing_session = RealmBillingSession(user)
    if billing_session.realm.demo_organization_scheduled_deletion_date is not None:
        return render(
            request,
            "corporate/billing/demo_organization_billing_disabled.html",
            context={
                "upgrade_request": True,
            },
        )

    redirect_url, context = billing_session.get_initial_upgrade_context(initial_upgrade_request)
    if redirect_url:
        return HttpResponseRedirect(redirect_url)

    if not user.has_billing_access:
        return HttpResponseRedirect(reverse("billing_page"))

    response = render(request, "corporate/billing/upgrade.html", context=context)
    return response


@typed_endpoint
@authenticated_remote_realm_management_endpoint
def remote_realm_upgrade_page(
    request: HttpRequest,
    billing_session: "RemoteRealmBillingSession",
    *,
    manual_license_management: Json[bool] = False,
    success_message: str = "",
    tier: str = str(CustomerPlan.TIER_SELF_HOSTED_BUSINESS),
    setup_payment_by_invoice: Json[bool] = False,
) -> HttpResponse:
    from corporate.lib.stripe import InitialUpgradeRequest

    billing_modality = "charge_automatically"
    if setup_payment_by_invoice:  # nocoverage
        billing_modality = "send_invoice"

    initial_upgrade_request = InitialUpgradeRequest(
        manual_license_management=manual_license_management,
        tier=int(tier),
        success_message=success_message,
        billing_modality=billing_modality,
    )
    try:
        redirect_url, context = billing_session.get_initial_upgrade_context(initial_upgrade_request)
    except MissingDataError:  # nocoverage
        return billing_session.missing_data_error_page(request)

    if redirect_url:  # nocoverage
        return HttpResponseRedirect(redirect_url)

    response = render(request, "corporate/billing/upgrade.html", context=context)
    return response


@typed_endpoint
@authenticated_remote_server_management_endpoint
def remote_server_upgrade_page(
    request: HttpRequest,
    billing_session: "RemoteServerBillingSession",
    *,
    manual_license_management: Json[bool] = False,
    success_message: str = "",
    tier: str = str(CustomerPlan.TIER_SELF_HOSTED_BUSINESS),
    setup_payment_by_invoice: Json[bool] = False,
) -> HttpResponse:
    from corporate.lib.stripe import InitialUpgradeRequest

    billing_modality = "charge_automatically"
    if setup_payment_by_invoice:  # nocoverage
        billing_modality = "send_invoice"

    initial_upgrade_request = InitialUpgradeRequest(
        manual_license_management=manual_license_management,
        tier=int(tier),
        success_message=success_message,
        billing_modality=billing_modality,
    )
    try:
        redirect_url, context = billing_session.get_initial_upgrade_context(initial_upgrade_request)
    except MissingDataError:  # nocoverage
        return billing_session.missing_data_error_page(request)

    if redirect_url:  # nocoverage
        return HttpResponseRedirect(redirect_url)

    response = render(request, "corporate/billing/upgrade.html", context=context)
    return response
```

--------------------------------------------------------------------------------

---[FILE: user_activity.py]---
Location: zulip-main/corporate/views/user_activity.py
Signals: Django

```python
from typing import Any

from django.db.models import QuerySet
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from corporate.lib.activity import (
    ActivityHeaderEntry,
    format_optional_datetime,
    make_table,
    user_activity_link,
    user_support_link,
)
from zerver.decorator import require_server_admin
from zerver.models import UserActivity, UserProfile
from zerver.models.users import get_user_profile_by_id


def get_user_activity_records(
    user_profile: UserProfile,
) -> QuerySet[UserActivity]:
    fields = [
        "query",
        "client__name",
        "count",
        "last_visit",
    ]

    records = (
        UserActivity.objects.filter(
            user_profile=user_profile,
        )
        .order_by("-last_visit")
        .select_related("client")
        .only(*fields)
    )
    return records


@require_server_admin
def get_user_activity(request: HttpRequest, user_profile_id: int) -> HttpResponse:
    user_profile = get_user_profile_by_id(user_profile_id)
    records = get_user_activity_records(user_profile)

    title = f"{user_profile.full_name}"
    cols = [
        "Query",
        "Client",
        "Count",
        "Last visit (UTC)",
    ]

    def row(record: UserActivity) -> list[Any]:
        return [
            record.query,
            record.client.name,
            record.count,
            format_optional_datetime(record.last_visit),
        ]

    rows = list(map(row, records))

    header_entries = []
    header_entries.append(ActivityHeaderEntry(name="Email", value=user_profile.delivery_email))
    header_entries.append(ActivityHeaderEntry(name="Realm", value=user_profile.realm.name))

    if user_profile.is_bot and user_profile.bot_owner is not None:
        bot_owner_link = user_activity_link(
            user_profile.bot_owner.delivery_email, user_profile.bot_owner.id
        )
        header_entries.append(ActivityHeaderEntry(name="Bot owner", value=bot_owner_link))

    user_support = user_support_link(user_profile.delivery_email)

    content = make_table(title, cols, rows, header=header_entries, title_link=user_support)

    return render(
        request,
        "corporate/activity/activity.html",
        context=dict(
            data=content,
            title=title,
            is_home=False,
        ),
    )
```

--------------------------------------------------------------------------------

---[FILE: webhook.py]---
Location: zulip-main/corporate/views/webhook.py
Signals: Django

```python
import json
import logging

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from corporate.models.stripe_state import Event, Invoice, Session
from zproject.config import get_secret

billing_logger = logging.getLogger("corporate.stripe")


@csrf_exempt
def stripe_webhook(request: HttpRequest) -> HttpResponse:
    import stripe

    from corporate.lib.stripe import STRIPE_API_VERSION
    from corporate.lib.stripe_event_handler import (
        handle_checkout_session_completed_event,
        handle_invoice_paid_event,
    )

    stripe_webhook_endpoint_secret = get_secret("stripe_webhook_endpoint_secret", "")
    if (
        stripe_webhook_endpoint_secret and not settings.TEST_SUITE
    ):  # nocoverage: We can't verify the signature in test suite since we fetch the events
        # from Stripe events API and manually post to the webhook endpoint.
        try:
            stripe_event = stripe.Webhook.construct_event(
                request.body,
                request.headers["Stripe-Signature"],
                stripe_webhook_endpoint_secret,
            )
        except ValueError:
            return HttpResponse(status=400)
        except stripe.SignatureVerificationError:
            return HttpResponse(status=400)
    else:
        assert not settings.PRODUCTION
        try:
            stripe_event = stripe.Event.construct_from(json.loads(request.body), stripe.api_key)
        except Exception:
            return HttpResponse(status=400)

    if stripe_event.api_version != STRIPE_API_VERSION:
        error_message = f"Mismatch between billing system Stripe API version({STRIPE_API_VERSION}) and Stripe webhook event API version({stripe_event.api_version})."
        billing_logger.error(error_message)
        return HttpResponse(status=400)

    if stripe_event.type not in [
        "checkout.session.completed",
        "invoice.paid",
    ]:
        return HttpResponse(status=200)

    if Event.objects.filter(stripe_event_id=stripe_event.id).exists():
        return HttpResponse(status=200)

    event = Event(stripe_event_id=stripe_event.id, type=stripe_event.type)

    if stripe_event.type == "checkout.session.completed":
        stripe_session = stripe_event.data.object
        assert isinstance(stripe_session, stripe.checkout.Session)
        try:
            session = Session.objects.get(stripe_session_id=stripe_session.id)
        except Session.DoesNotExist:
            return HttpResponse(status=200)
        event.content_type = ContentType.objects.get_for_model(Session)
        event.object_id = session.id
        event.save()
        handle_checkout_session_completed_event(stripe_session, event)
    elif stripe_event.type == "invoice.paid":
        stripe_invoice = stripe_event.data.object
        assert isinstance(stripe_invoice, stripe.Invoice)
        try:
            invoice = Invoice.objects.get(stripe_invoice_id=stripe_invoice.id)
        except Invoice.DoesNotExist:
            return HttpResponse(status=200)
        event.content_type = ContentType.objects.get_for_model(Invoice)
        event.object_id = invoice.id
        event.save()
        handle_invoice_paid_event(stripe_invoice, event)
    # We don't need to process failed payments via webhooks since we directly charge users
    # when they click on "Purchase" button and immediately provide feedback for failed payments.
    # If the feedback is not immediate, our event_status handler checks for payment status and informs the user.
    return HttpResponse(status=200)
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: zulip-main/docs/.gitignore

```text
/_build
```

--------------------------------------------------------------------------------

---[FILE: code-of-conduct.md]---
Location: zulip-main/docs/code-of-conduct.md

```text
../CODE_OF_CONDUCT.md
```

--------------------------------------------------------------------------------

---[FILE: conf.py]---
Location: zulip-main/docs/conf.py

```python
# For documentation on Sphinx configuration options, see:
# https://www.sphinx-doc.org/en/master/usage/configuration.html
# https://myst-parser.readthedocs.io/en/latest/sphinx/reference.html
# https://sphinx-rtd-theme.readthedocs.io/en/stable/configuring.html
# https://sphinx-design.readthedocs.io/en/latest/tabs.html

import os
import sys
from typing import Any

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from version import LATEST_RELEASE_VERSION, ZULIP_VERSION

on_rtd = os.environ.get("READTHEDOCS") == "True"

# General configuration

extensions = [
    "sphinx.ext.autosectionlabel",
    "myst_parser",
    "sphinx_rtd_theme",
    "sphinx_design",
]
templates_path = ["_templates"]
project = "Zulip"
copyright = "2012–2015 Dropbox, Inc., 2015–2021 Kandra Labs, Inc., and contributors"
author = "The Zulip Team"
version = ZULIP_VERSION
release = ZULIP_VERSION
exclude_patterns = ["_build", "README.md"]
suppress_warnings = [
    "myst.header",
    "autosectionlabel.git/terminology",  # HEAD vs head
]
pygments_style = "sphinx"

autosectionlabel_prefix_document = True
autosectionlabel_maxdepth = 2

# Options for Markdown parser

myst_enable_extensions = [
    "colon_fence",
    "substitution",
]
myst_heading_anchors = 6
myst_substitutions = {
    "LATEST_RELEASE_VERSION": LATEST_RELEASE_VERSION,
}

# Options for HTML output

html_theme = "sphinx_rtd_theme"
html_theme_options = {
    "collapse_navigation": not on_rtd,  # makes local builds much faster
    "logo_only": True,
}
html_logo = "images/zulip-logo.svg"
html_static_path = ["_static"]


def setup(app: Any) -> None:
    # overrides for wide tables in RTD theme
    app.add_css_file("theme_overrides.css")  # path relative to _static
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/index.md

```text
# Zulip documentation overview

Welcome! This is the documentation site for running [Zulip organized team
chat](https://zulip.com) in production, contributing to the [Zulip open-source
project](https://github.com/zulip), and generally learning how Zulip works under
the hood.

The following pages may help you get started:

- [Installation instructions](production/install.md) for setting up your Zulip
  server.
- [Contributing guide](contributing/contributing.md), with step-by-step
  instructions on how to get started contributing code to Zulip.

You may also want to check out:

- [An overview](https://zulip.com/features/) of the features available in Zulip.
- [Help center documentation](https://zulip.com/help/) for users and
  administrators of Zulip organizations.
- [API documentation](https://zulip.com/api/) for writing integrations or bots
  using the Zulip API.

If there's any information you can't find, please drop by the
[#documentation](https://chat.zulip.org/#narrow/channel/19-documentation)
channel in the [Zulip development
community](https://zulip.com/development-community/) and let us know! We work
hard to make Zulip's documentation comprehensive and easy to follow.

The documentation here is organized into the following sections:

- {ref}`Overview <overview>`
- {ref}`Zulip in production <zulip-in-production>`
- {ref}`Contributing to Zulip <contributing-to-zulip>`
- {ref}`Development environment <development-environment>`
- {ref}`Developer tutorials <developer-tutorials>`
- {ref}`Git guide <git-guide>`
- {ref}`Code testing <code-testing>`
- {ref}`Subsystem documentation <subsystem-documentation>`
- {ref}`Writing documentation <writing-documentation>`
- {ref}`Translating Zulip <translating>`
- {ref}`Outreach programs <outreach>`

## Documentation index

(overview)=

```{toctree}
---
maxdepth: 3
---

Zulip homepage <https://zulip.com/>
overview/index
```

(zulip-in-production)=

```{toctree}
---
maxdepth: 3
---

production/index
```

(contributing-to-zulip)=

```{toctree}
---
maxdepth: 3
---

contributing/index
```

(development-environment)=

```{toctree}
---
maxdepth: 3
---

development/index
```

(developer-tutorials)=

```{toctree}
---
maxdepth: 3
---

tutorials/index
```

(git-guide)=

```{toctree}
---
maxdepth: 3
---

git/index
```

(code-testing)=

```{toctree}
---
maxdepth: 3
---

testing/index
```

(subsystem-documentation)=

```{toctree}
---
maxdepth: 3
---

subsystems/index
```

(writing-documentation)=

```{toctree}
---
maxdepth: 3
---

documentation/index
```

(translating)=

```{toctree}
---
maxdepth: 3
---

translating/index
```

(outreach)=

```{toctree}
---
maxdepth: 3
---

outreach/index

Index <https://zulip.readthedocs.io/en/latest/>
```
```

--------------------------------------------------------------------------------

---[FILE: Makefile]---
Location: zulip-main/docs/Makefile

```text
# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line.
SPHINXOPTS    = -j auto -W
SPHINXBUILD   = sphinx-build
SOURCEDIR     = .
BUILDDIR      = _build

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

.PHONY: help Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: zulip-main/docs/README.md

```text
# Zulip Markdown documentation hosted elsewhere

The Markdown files in this directory ( /zulip/docs ) are not intended
to be read on GitHub. Instead, visit our
[ReadTheDocs](https://zulip.readthedocs.io/en/latest/index.html) to
read the Zulip documentation.
```

--------------------------------------------------------------------------------

````

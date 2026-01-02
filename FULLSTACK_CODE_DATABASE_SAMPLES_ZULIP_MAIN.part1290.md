---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1290
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1290 of 1290)

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

---[FILE: wsgi.py]---
Location: zulip-main/zproject/wsgi.py
Signals: Django

```python
"""
WSGI config for zulip project.

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It should expose a module-level variable
named ``application``. Django's ``runserver`` and ``runfcgi`` commands discover
this application via the ``WSGI_APPLICATION`` setting.

Usually you will have the standard Django WSGI application here, but it also
might make sense to replace the whole Django WSGI application with a custom one
that later delegates to the Django one. For example, you could introduce WSGI
middleware here, or combine a Django application with an application of another
framework.

"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
from scripts.lib.setup_path import setup_path

setup_path()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "zproject.settings")

import contextlib
from collections.abc import Callable
from typing import Any

import orjson
from django.core.wsgi import get_wsgi_application

try:
    # This application object is used by any WSGI server configured to use this
    # file. This includes Django's development server, if the WSGI_APPLICATION
    # setting points here.

    application = get_wsgi_application()

    # We force loading of the main parts of the application now, by
    # handing it a fake request, rather than have to pay that price
    # during the first request served by this process.  Hitting the
    # /health endpoint will not only load Django and all of the views
    # (by loading the URL dispatcher) but will also force open any
    # lazy-loaded service connections.
    #
    # The return value (and thus response status) of this healthcheck
    # request is ignored, so we do return the application handler even
    # if connections are not fully available yet.  This at least
    # allows application logging to handle any such errors, instead of
    # arcane errors from uwsgi not being able to load its handler
    # function.
    def ignored_start_response(
        status: str, headers: list[tuple[str, str]], exc_info: Any = None, /
    ) -> Callable[[bytes], object]:
        return lambda x: None

    application(
        {
            "REQUEST_METHOD": "GET",
            "SERVER_NAME": "127.0.0.1",
            "SERVER_PORT": "443",
            "PATH_INFO": "/health",
            "REMOTE_ADDR": "127.0.0.1",
            "wsgi.input": sys.stdin,
            "wsgi.url_scheme": "https",
        },
        ignored_start_response,
    )

    with contextlib.suppress(ModuleNotFoundError):
        # The uwsgi module is only importable when running under
        # uwsgi; development uses this file as well, but inside a
        # pure-Python server.  The surrounding contextmanager ensures
        # that we don't bother with these steps if we're in
        # development.
        import uwsgi

        if uwsgi.worker_id() == uwsgi.numproc:
            # This is the last worker to load in the chain reload
            with open("/var/lib/zulip/django-workers.ready", "wb") as f:
                # The contents of this file are not read by restart-server
                # in any way, but leave some useful information about the
                # state of uwsgi.
                f.write(
                    orjson.dumps(
                        uwsgi.workers(), option=orjson.OPT_INDENT_2, default=lambda e: e.decode()
                    ),
                )

except Exception:
    # If /etc/zulip/settings.py contains invalid syntax, Django
    # initialization will fail in django.setup().  In this case, our
    # normal configuration to logs errors to /var/log/zulip/errors.log
    # won't have been initialized.  Since it's really valuable for the
    # debugging process for a Zulip 500 error to always be "check
    # /var/log/zulip/errors.log", we log to that file directly here.
    import logging

    logging.basicConfig(
        filename="/var/log/zulip/errors.log",
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    logger = logging.getLogger(__name__)
    logger.exception("get_wsgi_application() failed:")
    raise
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: zulip-main/zproject/jinja2/__init__.py
Signals: Django

```python
from typing import Any

import orjson
from django.contrib.staticfiles.storage import staticfiles_storage
from django.template.defaultfilters import pluralize, slugify
from django.urls import reverse
from django.utils import translation
from django.utils.formats import localize
from django.utils.timesince import timesince
from jinja2 import Environment
from two_factor.plugins.phonenumber.templatetags.phonenumber import device_action

from zerver.context_processors import DEFAULT_PAGE_PARAMS
from zerver.lib.send_email import FromAddress
from zerver.lib.templates import display_list, render_markdown_path, webpack_entry


def json_dumps(obj: object) -> str:
    return orjson.dumps(obj).decode()


def environment(**options: Any) -> Environment:
    env = Environment(autoescape=options.pop("autoescape", True), **options)
    env.globals.update(
        # default_page_params is provided here for responses where
        # zulip_default_context is not run, including the 404.html and
        # 500.html error pages.
        default_page_params=DEFAULT_PAGE_PARAMS,
        static=staticfiles_storage.url,
        url=reverse,
        render_markdown_path=render_markdown_path,
        webpack_entry=webpack_entry,
        support_email=FromAddress.SUPPORT,
    )

    env.install_gettext_translations(translation, True)  # type: ignore[attr-defined] # Added by jinja2.ext.i18n

    env.filters["slugify"] = slugify
    env.filters["pluralize"] = pluralize
    env.filters["display_list"] = display_list
    env.filters["device_action"] = device_action
    env.filters["timesince"] = timesince
    env.filters["localize"] = localize

    env.policies["json.dumps_function"] = json_dumps
    env.policies["json.dumps_kwargs"] = {}
    env.policies["ext.i18n.trimmed"] = True

    return env
```

--------------------------------------------------------------------------------

````

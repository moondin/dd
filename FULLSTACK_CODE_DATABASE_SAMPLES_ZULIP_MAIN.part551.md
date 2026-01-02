---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 551
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 551 of 1290)

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

---[FILE: production-build]---
Location: zulip-main/tools/ci/production-build

```text
#!/usr/bin/env bash
# In short, this provisions a Zulip development environment and then
# builds a Zulip release tarball (the same way we build them for an
# actual release).  The actual test job will then install that.

set -e
set -x

# Provisioning may fail due to many issues but most of the times a network
# connection issue is the reason. So we are going to retry entire provisioning
# once again if that fixes our problem.
tools/provision --build-release-tarball-only || {
    ret=$?
    if [ "$ret" = 1 ]; then
        echo "\`provision\`: Something went wrong with the provisioning, might be a network issue, Retrying to provision..."
        tools/provision --build-release-tarball-only
    else
        echo "\`provision\`: Something REALLY BAD went wrong with the provisioning, not retrying."
        exit "$ret"
    fi
}

source tools/ci/activate-venv

if ! ./tools/build-release-tarball test; then
    echo "Attempting to output failure logging data"
    cat /tmp/tmp.*/update-prod-static.log || true
    exit 1
fi

# Move all the required artifacts to /tmp/production-build
# that will be later sent down to downstream install jobs.
mkdir /tmp/production-build
mv /tmp/tmp.*/zulip-server-test.tar.gz /tmp/production-build
cp -a \
    tools/ci/success-http-headers.template.txt \
    tools/ci/production-install \
    tools/ci/production-verify \
    tools/ci/production-upgrade \
    tools/ci/production-pgroonga \
    tools/ci/production-upgrade-pg \
    tools/ci/generate-failure-message \
    package.json pnpm-lock.yaml \
    /tmp/production-build

# Check that webpack bundles use only ES2022 syntax.
# Use the pnpm binary installed by tools/provision.
PNPM="/usr/local/bin/pnpm"
tar -C /tmp -xzf /tmp/production-build/zulip-server-test.tar.gz zulip-server-test/prod-static/serve/webpack-bundles
(
    GLOBIGNORE="/tmp/zulip-server-test/prod-static/serve/webpack-bundles/katex*.js"
    "$PNPM" exec es-check es2022 /tmp/zulip-server-test/prod-static/serve/webpack-bundles/*.js
)
```

--------------------------------------------------------------------------------

---[FILE: production-install]---
Location: zulip-main/tools/ci/production-install

```text
#!/usr/bin/env bash
# This test installs a Zulip production environment (from the release
# tarball from production-build).
set -e
set -x

usage() {
    cat <<'EOF'
Usage:
  production-install
  production-install --test-custom-db
  production-install --help

Options:
  --test-custom-db
      This will instruct the install test to be run with a custom database name and user.

EOF
}

# Shell option parsing.
args="$(getopt -o '' --long help,test-custom-db -n "$0" -- "$@")"
eval "set -- $args"
while true; do
    case "$1" in
        --help)
            usage
            exit 0
            ;;

        --test-custom-db)
            TEST_CUSTOM_DB=1
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

ZULIP_PATH=/root/zulip-latest
mkdir -p "$ZULIP_PATH"
tar -xf /tmp/zulip-server-test.tar.gz -C "$ZULIP_PATH" --strip-components=1

# Do an apt upgrade to start with an up-to-date machine
APT_OPTIONS=(-o 'Dpkg::Options::=--force-confdef' -o 'Dpkg::Options::=--force-confold')
apt-get update

if ! apt-get dist-upgrade -y "${APT_OPTIONS[@]}"; then
    echo "\`apt-get dist-upgrade\`: Failure occurred while trying to perform distribution upgrade, Retrying..."
    apt-get dist-upgrade -y "${APT_OPTIONS[@]}"
fi

os_info="$(
    . /etc/os-release
    printf '%s\n' "$ID" "$VERSION_ID"
)"
{
    read -r os_id
    read -r os_version_id
} <<<"$os_info"

# Pin PostgreSQL on Ubuntu 22.04, so we can test upgrading it
if [ "$os_id $os_version_id" = 'ubuntu 22.04' ]; then
    export POSTGRESQL_VERSION=14
fi

# Install
if [ -z "$TEST_CUSTOM_DB" ]; then
    echo "Testing production install with default database name and user."
    "$ZULIP_PATH"/scripts/setup/install --self-signed-cert --hostname 127.0.0.1 --email ci@example.com
else
    echo "Testing production install with custom database name and user."
    "$ZULIP_PATH"/scripts/setup/install --self-signed-cert --hostname 127.0.0.1 --email ci@example.com --postgresql-database-user zulipcustomuser --postgresql-database-name zulipcustomdb
fi

if [ -n "${POSTGRESQL_VERSION:-}" ]; then
    if [ "$(crudini --get /etc/zulip/zulip.conf postgresql version)" != "$POSTGRESQL_VERSION" ]; then
        echo "Installer did not install the PostgreSQL $POSTGRESQL_VERSION that we asked for!"
        exit 1
    fi
    if ! su - zulip -c "psql -tc 'select version()'" | grep -q "^ PostgreSQL $POSTGRESQL_VERSION\."; then
        echo "Installed PostgreSQL is not actually PostgreSQL $POSTGRESQL_VERSION!"
        exit 1
    fi
fi

echo "Production installation complete!"
exit 0
```

--------------------------------------------------------------------------------

---[FILE: production-pgroonga]---
Location: zulip-main/tools/ci/production-pgroonga

```text
#!/usr/bin/env bash
# This tests installing the pgroonga extension
set -e
set -x

crudini --set /etc/zulip/zulip.conf machine pgroonga enabled
/home/zulip/deployments/current/scripts/zulip-puppet-apply -f
echo 'USING_PGROONGA = True' >>/etc/zulip/settings.py
su zulip -c '/home/zulip/deployments/current/manage.py migrate pgroonga'

su zulip -c /home/zulip/deployments/current/scripts/restart-server

echo 'Installation of pgroonga complete!'
exit 0
```

--------------------------------------------------------------------------------

---[FILE: production-upgrade]---
Location: zulip-main/tools/ci/production-upgrade

```text
#!/usr/bin/env bash
# Given a Zulip production environment that had been installed with a
# previous version of Zulip, upgrade it to the commit being tested.
# This takes as input the tarball generated by production-build.
set -e
set -x

# Start the services that would be running on a working Zulip host;
# since this is a container, these services are not started
# automatically.

# Start the postgresql service.
sudo service postgresql start

# Starting the rabbitmq-server
epmd -daemon
sudo service rabbitmq-server start

# Start the supervisor
sudo service supervisor start

# Zulip releases before 2.1.8/3.5/4.4 have a bug in their
# `upgrade-zulip` scripts, resulting in them exiting with status 0
# unconditionally. We work around that by running
# scripts/lib/upgrade-zulip instead.
UPGRADE_SCRIPT=/home/zulip/deployments/current/scripts/lib/upgrade-zulip

# Execute the upgrade.
sudo "$UPGRADE_SCRIPT" /tmp/zulip-server-test.tar.gz
```

--------------------------------------------------------------------------------

---[FILE: production-upgrade-pg]---
Location: zulip-main/tools/ci/production-upgrade-pg

```text
#!/usr/bin/env bash
# This tests upgrading PostgreSQL
set -e
set -x

su zulip -c /home/zulip/deployments/current/scripts/stop-server
/home/zulip/deployments/current/scripts/setup/upgrade-postgresql
su zulip -c /home/zulip/deployments/current/scripts/start-server

echo "Upgrade of PostgreSQL complete!"
exit 0
```

--------------------------------------------------------------------------------

---[FILE: production-verify]---
Location: zulip-main/tools/ci/production-verify

```text
#!/usr/bin/env bash
# This tests a Zulip production environment (installed via
# production-install) with some Nagios checks and other tools to
# verify that everything is working properly.
set -e
set -x

usage() {
    cat <<'EOF'
Usage:
  production-verify
  production-verify --test-custom-db
  production-verify --help

Options:
  --test-custom-db
      Use custom database and user names.

EOF
}

# Shell option parsing.
args="$(getopt -o '' --long help,test-custom-db -n "$0" -- "$@")"
eval "set -- $args"
NAGIOS_USER="zulip"
while true; do
    case "$1" in
        --help)
            usage
            exit 0
            ;;

        --test-custom-db)
            NAGIOS_USER="zulipcustomuser"
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

cat >>/etc/zulip/settings.py <<EOF
# CircleCI override settings above
AUTHENTICATION_BACKENDS = ( 'zproject.backends.EmailAuthBackend', )
NOREPLY_EMAIL_ADDRESS = 'noreply@example.com'
ALLOWED_HOSTS = []
EOF

check_header() {
    if ! sed "s|{nginx_version_string}|$nginx_version|g" "$success_header_file" \
        | diff -ur - /tmp/http-headers-processed; then
        set +x
        echo
        echo "FAILURE: The HTTP headers returned from loading the homepage on the server do not match the contents of tools/ci/success-http-headers.template.txt.  Typically, this means that the server threw a 500 when trying to load the homepage."
        echo "Displaying the contents of the server's error log:"
        echo
        cat /var/log/zulip/errors.log
        echo
        echo "Displaying the contents of the main server log:"
        echo
        cat /var/log/zulip/server.log
        exit 1
    fi
}

echo
echo "Now testing that the supervisord jobs are running properly"
echo
sleep 15 # Guaranteed to have a working supervisord process get an extra digit
if supervisorctl status | grep -vq RUNNING || supervisorctl status | sed 's/^.*uptime //' | grep -q 0:00:0; then
    set +x
    echo
    echo "FAILURE: Supervisor output shows daemons are crashing:"
    echo
    supervisorctl status
    echo
    echo "DEBUG: printing Zulip server's error log:"
    cat /var/log/zulip/errors.log
    echo
    echo "DEBUG: printing Zulip server's workers log:"
    cat /var/log/zulip/workers.log
    echo
    echo "DEBUG: printing Zulip server's tornado log:"
    cat /var/log/zulip/tornado.log
    echo
    echo "DEBUG: printing process_fts_updates log:"
    cat /var/log/zulip/fts-updates.log
    exit 1
fi

# TODO: Ideally this would test actually logging in, but this is a start.
echo
echo "Now testing that the newly installed server's settings endpoint loads"
echo

curl -ILk https://localhost/api/v1/server_settings -o /tmp/http-headers
grep -vi -e '^content-length:' -e '^date:' -e '^expires:' -e '^set-cookie:' /tmp/http-headers >/tmp/http-headers-processed

nginx_version="$(nginx -v 2>&1)"
nginx_version="${nginx_version#nginx version: }"
success_header_file="/tmp/success-http-headers.template.txt"
check_header

# Start the RabbitMQ queue worker related section
echo
echo "Now confirming all the RabbitMQ queue processors are correctly registered!"
echo
# These hacky shell scripts just extract the sorted list of queue processors, running and expected
supervisorctl status | cut -f1 -dR | cut -f2- -d: | grep events | cut -f1 -d" " | cut -f3- -d_ | cut -f1 -d- | sort -u >/tmp/running_queue_processors.txt
su zulip -c /home/zulip/deployments/current/scripts/lib/queue_workers.py | sort -u >/tmp/expected_queue_processors.txt
if ! diff /tmp/expected_queue_processors.txt /tmp/running_queue_processors.txt >/dev/null; then
    set +x
    echo "FAILURE: Runnable queue processors declared in zerver/worker/queue_processors.py "
    echo "do not match those in puppet/zulip/manifests/profile/base.pp"
    echo "See https://zulip.readthedocs.io/en/latest/subsystems/queuing.html for details."
    echo
    diff -ur /tmp/expected_queue_processors.txt /tmp/running_queue_processors.txt
    exit 1
fi

echo
echo "Now running RabbitMQ consumer Nagios tests"
echo
# First run the check that usually runs in cron and populates the state files
/home/zulip/deployments/current/scripts/nagios/check-rabbitmq-consumers

# Then, compute the list of all Django queue workers to run Nagios checks against
consumer_list=$(/home/zulip/deployments/current/scripts/lib/queue_workers.py --queue-type=consumer)
for consumer in $consumer_list; do
    if ! /usr/lib/nagios/plugins/zulip_app_frontend/check_cron_file "/var/lib/nagios_state/check-rabbitmq-consumers-$consumer"; then
        set +x
        echo
        echo "FAILURE: Missing Nagios consumer for $consumer; displaying full consumer output:"
        set -x
        rabbitmqctl list_consumers
        supervisorctl status
        tail -n +1 /var/log/zulip/events*.log
        exit 1
    fi
done

# Some of the Nagios tests have been temporarily disabled to work
# around a Travis CI infrastructure issue.
echo
echo "Now running additional Nagios tests"
echo
if ! /usr/lib/nagios/plugins/zulip_app_frontend/check_queue_worker_errors \
    || ! su zulip -c "/usr/local/bin/process_fts_updates --nagios-check --nagios-user=$NAGIOS_USER"; then # || \
    #   ! su zulip -c "/usr/lib/nagios/plugins/zulip_app_frontend/check_send_receive_time --site=https://127.0.0.1/api --nagios --insecure"; then
    set +x
    echo
    echo "FAILURE: Nagios checks don't pass:"
    echo
    echo "DEBUG: printing Zulip server's error log:"
    cat /var/log/zulip/errors.log
    exit 1
fi
echo "Production installation test successful!"
exit 0
```

--------------------------------------------------------------------------------

---[FILE: setup-backend]---
Location: zulip-main/tools/ci/setup-backend

```text
#!/usr/bin/env bash
set -e
set -x

ZULIP_PATH="$(dirname "${BASH_SOURCE[0]}")/../.."
. "$ZULIP_PATH/tools/python-warnings.bash"

# This is just a thin wrapper around provision.
# Provisioning may fail due to many issues but most of the times a network
# connection issue is the reason. So we are going to retry entire provisioning
# once again if that fixes our problem.
tools/provision "$@" || {
    ret=$?
    if [ "$ret" = 1 ]; then
        echo "\`provision\`: Something went wrong with the provisioning, might be a network issue, Retrying to provision..."
        tools/provision
    else
        echo "\`provision\`: Something REALLY BAD went wrong with the provisioning, not retrying."
        exit "$ret"
    fi
}
```

--------------------------------------------------------------------------------

---[FILE: setup-frontend]---
Location: zulip-main/tools/ci/setup-frontend

```text
setup-backend
```

--------------------------------------------------------------------------------

---[FILE: success-http-headers.template.txt]---
Location: zulip-main/tools/ci/success-http-headers.template.txt

```text
HTTP/2 200 
server: {nginx_version_string}
content-type: application/json
vary: Accept-Encoding
vary: Accept-Language, Cookie
content-language: en
strict-transport-security: max-age=15768000
x-frame-options: DENY
x-content-type-options: nosniff
access-control-allow-origin: *
access-control-allow-headers: Authorization
access-control-allow-methods: GET, POST, DELETE, PUT, PATCH, HEAD
```

--------------------------------------------------------------------------------

---[FILE: scrapy.cfg]---
Location: zulip-main/tools/documentation_crawler/scrapy.cfg

```text
[settings]
default = documentation_crawler.settings

[deploy]
project = documentation_crawler
```

--------------------------------------------------------------------------------

---[FILE: settings.py]---
Location: zulip-main/tools/documentation_crawler/documentation_crawler/settings.py

```python
# Scrapy settings for documentation_crawler project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html

BOT_NAME = "documentation_crawler"

SPIDER_MODULES = ["documentation_crawler.spiders"]
NEWSPIDER_MODULE = "documentation_crawler.spiders"
COMMANDS_MODULE = "documentation_crawler.commands"
LOG_LEVEL = "WARNING"
DOWNLOAD_TIMEOUT = 15


# Crawl responsibly by identifying yourself (and your website) on the user-agent
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/54.0.2840.59 Safari/537.36"
)

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Configure maximum concurrent requests performed by Scrapy (default: 16)
# CONCURRENT_REQUESTS = 32

# Configure a delay for requests for the same website (default: 0)
# See https://docs.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
# DOWNLOAD_DELAY = 3
# The download delay setting will honor only one of:
# CONCURRENT_REQUESTS_PER_DOMAIN = 16
# CONCURRENT_REQUESTS_PER_IP = 16

# Disable cookies (enabled by default)
# COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
# TELNETCONSOLE_ENABLED = False

# Override the default request headers:
# DEFAULT_REQUEST_HEADERS = {
#   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
#   'Accept-Language': 'en',
# }

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
# SPIDER_MIDDLEWARES = {
#    'documentation_crawler.middlewares.DocumentationCrawlerSpiderMiddleware': 543,
# }

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
# DOWNLOADER_MIDDLEWARES = {
#    'documentation_crawler.middlewares.DocumentationCrawlerDownloaderMiddleware': 543,
# }

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
# EXTENSIONS = {
#    'scrapy.extensions.telnet.TelnetConsole': None,
# }

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
# ITEM_PIPELINES = {
#    'documentation_crawler.pipelines.DocumentationCrawlerPipeline': 300,
# }

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
# AUTOTHROTTLE_ENABLED = True
# The initial download delay
# AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
# AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
# AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
# AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
# HTTPCACHE_ENABLED = True
# HTTPCACHE_EXPIRATION_SECS = 0
# HTTPCACHE_DIR = 'httpcache'
# HTTPCACHE_IGNORE_HTTP_CODES = []
# HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.FilesystemCacheStorage'

# Set settings whose default value is deprecated to a future-proof value
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
```

--------------------------------------------------------------------------------

---[FILE: crawl_with_status.py]---
Location: zulip-main/tools/documentation_crawler/documentation_crawler/commands/crawl_with_status.py

```python
import argparse

from scrapy.commands import crawl
from scrapy.crawler import Crawler
from scrapy.spiders import Spider
from typing_extensions import override


class Command(crawl.Command):
    @override
    def run(self, args: list[str], opts: argparse.Namespace) -> None:
        crawlers = []
        assert self.crawler_process is not None
        real_create_crawler = self.crawler_process.create_crawler

        def create_crawler(crawler_or_spidercls: type[Spider] | Crawler | str) -> Crawler:
            crawler = real_create_crawler(crawler_or_spidercls)
            crawlers.append(crawler)
            return crawler

        self.crawler_process.create_crawler = create_crawler  # type: ignore[method-assign]  # monkey patching
        super().run(args, opts)
        for crawler in crawlers:
            assert crawler.stats is not None
            if crawler.stats.get_value("log_count/ERROR"):
                self.exitcode = 1
```

--------------------------------------------------------------------------------

---[FILE: check_documentation.py]---
Location: zulip-main/tools/documentation_crawler/documentation_crawler/spiders/check_documentation.py

```python
import os
import pathlib

from .common.spiders import BaseDocumentationSpider


def get_start_url() -> list[str]:
    # Get index.html file as start URL and convert it to file URI
    dir_path = os.path.dirname(os.path.realpath(__file__))
    start_file = os.path.join(
        dir_path, os.path.join(*[os.pardir] * 4), "docs/_build/html/index.html"
    )
    return [
        pathlib.Path(os.path.abspath(start_file)).as_uri(),
    ]


class DocumentationSpider(BaseDocumentationSpider):
    name = "documentation_crawler"
    deny_domains = ["localhost:9991"]
    deny = [r"\_sources\/.*\.txt"]
    start_urls = get_start_url()
```

--------------------------------------------------------------------------------

---[FILE: check_help_documentation.py]---
Location: zulip-main/tools/documentation_crawler/documentation_crawler/spiders/check_help_documentation.py

```python
import os
from posixpath import basename
from typing import Any
from urllib.parse import urlsplit

from typing_extensions import override

from .common.spiders import BaseDocumentationSpider


def get_images_dir(images_path: str) -> str:
    # Get index html file as start url and convert it to file uri
    dir_path = os.path.dirname(os.path.realpath(__file__))
    target_path = os.path.join(dir_path, os.path.join(*[os.pardir] * 4), images_path)
    return os.path.realpath(target_path)


class UnusedImagesLinterSpider(BaseDocumentationSpider):
    images_path = ""

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.static_images: set[str] = set()
        self.images_static_dir: str = get_images_dir(self.images_path)

    @override
    def _is_external_url(self, url: str) -> bool:
        is_external = url.startswith("http") and self.start_urls[0] not in url
        if self._has_extension(url) and f"localhost:9981/{self.images_path}" in url:
            self.static_images.add(basename(urlsplit(url).path))
        return is_external or self._has_extension(url)

    def closed(self, *args: Any, **kwargs: Any) -> None:
        unused_images = set(os.listdir(self.images_static_dir)) - self.static_images
        if unused_images:
            exception_message = (
                "The following images are not used in documentation and can be removed: {}"
            )
            unused_images_relatedpath = [
                os.path.join(self.images_path, img) for img in unused_images
            ]
            self.logger.error(exception_message.format(", ".join(unused_images_relatedpath)))


class HelpDocumentationSpider(BaseDocumentationSpider):
    name = "help_documentation_crawler"
    start_urls = ["http://localhost:9981/help"]
    deny_domains: list[str] = []
    deny = ["/policies/privacy"]

    @override
    def _is_external_url(self, url: str) -> bool:
        return not f"{url}/".startswith("http://localhost:9981/help/") or self._has_extension(url)


class APIDocumentationSpider(UnusedImagesLinterSpider):
    name = "api_documentation_crawler"
    start_urls = ["http://localhost:9981/api"]
    deny_domains: list[str] = []
    images_path = "static/images/api"


class PorticoDocumentationSpider(BaseDocumentationSpider):
    @override
    def _is_external_url(self, url: str) -> bool:
        return (
            not url.startswith("http://localhost:9981")
            or url.startswith(("http://localhost:9981/help", "http://localhost:9981/api"))
            or self._has_extension(url)
        )

    name = "portico_documentation_crawler"
    start_urls = [
        "http://localhost:9981/hello/",
        "http://localhost:9981/history/",
        "http://localhost:9981/plans/",
        "http://localhost:9981/team/",
        "http://localhost:9981/apps/",
        "http://localhost:9981/integrations/",
        "http://localhost:9981/policies/terms",
        "http://localhost:9981/policies/privacy",
        "http://localhost:9981/features/",
        "http://localhost:9981/why-zulip/",
        "http://localhost:9981/for/open-source/",
        "http://localhost:9981/for/business/",
        "http://localhost:9981/for/communities/",
        "http://localhost:9981/for/research/",
        "http://localhost:9981/security/",
    ]
    deny_domains: list[str] = []
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: zulip-main/tools/documentation_crawler/documentation_crawler/spiders/__init__.py

```python
# This package will contain the spiders of your Scrapy project
#
# Please refer to the documentation for information on how to create and manage
# your spiders.
```

--------------------------------------------------------------------------------

---[FILE: spiders.py]---
Location: zulip-main/tools/documentation_crawler/documentation_crawler/spiders/common/spiders.py

```python
import json
import os
import re
from collections.abc import AsyncIterator, Callable, Iterator
from urllib.parse import urlsplit

import scrapy
from scrapy.http.request import Request
from scrapy.http.response import Response
from scrapy.http.response.text import TextResponse
from scrapy.linkextractors import IGNORED_EXTENSIONS
from scrapy.linkextractors.lxmlhtml import LxmlLinkExtractor
from scrapy.spidermiddlewares.httperror import HttpError
from scrapy.utils.url import url_has_any_extension
from twisted.python.failure import Failure
from typing_extensions import override

EXCLUDED_DOMAINS = [
    # Returns 429 rate-limiting errors
    "github.com",
    "gist.github.com",
    # Returns 503 errors
    "www.amazon.com",
    "gitlab.com",
]

EXCLUDED_URLS = [
    # Google calendar returns 404s on HEAD requests unconditionally
    "https://calendar.google.com/calendar/embed?src=ktiduof4eoh47lmgcl2qunnc0o@group.calendar.google.com",
    # Returns 409 errors to HEAD requests frequently
    "https://medium.freecodecamp.org/",
    # Returns 404 to HEAD requests unconditionally
    "https://www.git-tower.com/blog/command-line-cheat-sheet/",
    "https://marketplace.visualstudio.com/items?itemName=rafaelmaiolla.remote-vscode",
    "https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh",
    # Requires authentication
    "https://www.linkedin.com/company/zulip-project",
    # Returns 403 errors to HEAD requests
    "https://giphy.com",
    "https://giphy.com/apps/giphycapture",
    "https://www.udemy.com/course/the-complete-react-native-and-redux-course/",
]

VNU_IGNORE = [
    # Real errors that should be fixed.
    r"Attribute “markdown” not allowed on element “div” at this point\.",
    r"No “p” element in scope but a “p” end tag seen\.",
    # Opinionated informational messages.
    r"Trailing slash on void elements has no effect and interacts badly with unquoted attribute values\.",
]
VNU_IGNORE_REGEX = re.compile(r"|".join(VNU_IGNORE))

DEPLOY_ROOT = os.path.abspath(os.path.join(__file__, "../../../../../.."))

ZULIP_SERVER_GITHUB_FILE_PATH_PREFIX = "/zulip/zulip/blob/main"
ZULIP_SERVER_GITHUB_DIRECTORY_PATH_PREFIX = "/zulip/zulip/tree/main"


class BaseDocumentationSpider(scrapy.Spider):
    # Exclude domain address.
    deny_domains: list[str] = []
    start_urls: list[str] = []
    deny: list[str] = []
    file_extensions: list[str] = ["." + ext for ext in IGNORED_EXTENSIONS]
    tags = ("a", "area", "img")
    attrs = ("href", "src")

    def _has_extension(self, url: str) -> bool:
        return url_has_any_extension(url, self.file_extensions)

    def _is_external_url(self, url: str) -> bool:
        return url.startswith("http") or self._has_extension(url)

    def check_existing(self, response: Response) -> None:
        self.log(response)

    def _is_external_link(self, url: str) -> bool:
        split_url = urlsplit(url)
        if split_url.hostname in ("chat.zulip.org", "status.zulip.com"):
            # Since most chat.zulip.org URLs will be links to specific
            # logged-in content that the spider cannot verify, or the
            # homepage, there's no need to check those (which can
            # cause errors when chat.zulip.org is being updated).
            #
            # status.zulip.com is externally hosted and, in a peculiar twist of
            # cosmic irony, often itself offline.
            return True
        if split_url.hostname == "zulip.readthedocs.io" or f".{split_url.hostname}".endswith(
            (".zulip.com", ".zulip.org")
        ):
            # We want CI to check any links to Zulip sites.
            return False
        if split_url.scheme == "file" or split_url.hostname == "localhost":
            # We also want CI to check any links to built documentation.
            return False
        if split_url.hostname == "github.com" and f"{split_url.path}/".startswith(
            (
                f"{ZULIP_SERVER_GITHUB_FILE_PATH_PREFIX}/",
                f"{ZULIP_SERVER_GITHUB_DIRECTORY_PATH_PREFIX}/",
            )
        ):
            # We can verify these links directly in the local Git repo without making any requests to GitHub servers.
            return False
        if split_url.hostname == "github.com" and split_url.path.startswith("/zulip/"):
            # We want to check these links but due to rate limiting from GitHub, these checks often
            # fail in the CI. Thus, we should treat these as external links for now.
            # TODO: Figure out how to test github.com/zulip links in CI.
            return True
        return True

    def check_fragment(self, response: Response) -> None:
        self.log(response)
        xpath_template = "//*[@id='{fragment}' or @name='{fragment}']"
        assert isinstance(response, TextResponse)
        assert response.request is not None
        fragment = urlsplit(response.request.url).fragment
        # Check fragment existing on response page.
        if not response.selector.xpath(xpath_template.format(fragment=fragment)):
            self.logger.error(
                "Fragment #%s is not found on page %s", fragment, response.request.url
            )

    def _vnu_callback(self, url: str) -> Callable[[Response], None]:
        def callback(response: Response) -> None:
            vnu_out = json.loads(response.text)
            for message in vnu_out["messages"]:
                if not VNU_IGNORE_REGEX.fullmatch(message["message"]):
                    self.logger.error(
                        '"%s":%d.%d-%d.%d: %s: %s',
                        url,
                        message.get("firstLine", message["lastLine"]),
                        message.get("firstColumn", message["lastColumn"]),
                        message["lastLine"],
                        message["lastColumn"],
                        message["type"],
                        message["message"],
                    )

        return callback

    def _make_requests(self, url: str) -> Iterator[Request]:
        # These URLs are for Zulip's web app, which with recent changes
        # can be accessible without logging into an account.  While we
        # do crawl documentation served by the web app (e.g. /help/),
        # we don't want to crawl the web app itself, so we exclude
        # these.
        split_url = urlsplit(url)
        if split_url.netloc == "localhost:9981" and split_url.path in ["", "/"]:
            return

        # These pages have some invisible to the user anchor links like #all
        # that are currently invisible, and thus would otherwise fail this test.
        if url.startswith("http://localhost:9981/communities"):
            return
        if url.startswith("http://localhost:9981/plans"):
            return

        callback: Callable[[Response], Iterator[Request] | None] = self.parse
        dont_filter = False
        method = "GET"
        if self._is_external_url(url):
            callback = self.check_existing
            method = "HEAD"

            if split_url.hostname == "github.com" and f"{split_url.path}/".startswith(
                f"{ZULIP_SERVER_GITHUB_FILE_PATH_PREFIX}/"
            ):
                file_path = DEPLOY_ROOT + split_url.path.removeprefix(
                    ZULIP_SERVER_GITHUB_FILE_PATH_PREFIX
                )
                if not os.path.isfile(file_path):
                    self.logger.error(
                        "There is no local file associated with the GitHub URL: %s", url
                    )
                return
            elif split_url.hostname == "github.com" and f"{split_url.path}/".startswith(
                f"{ZULIP_SERVER_GITHUB_DIRECTORY_PATH_PREFIX}/"
            ):
                dir_path = DEPLOY_ROOT + split_url.path.removeprefix(
                    ZULIP_SERVER_GITHUB_DIRECTORY_PATH_PREFIX
                )
                if not os.path.isdir(dir_path):
                    self.logger.error(
                        "There is no local directory associated with the GitHub URL: %s", url
                    )
                return
        elif split_url.fragment != "":
            dont_filter = True
            callback = self.check_fragment
        if getattr(self, "skip_external", False) and self._is_external_link(url):
            return
        if split_url.hostname in EXCLUDED_DOMAINS:
            return
        if url in EXCLUDED_URLS:
            return
        yield Request(
            url,
            method=method,
            callback=callback,
            dont_filter=dont_filter,
            errback=self.error_callback,
        )

    @override
    async def start(self) -> AsyncIterator[Request]:
        for url in self.start_urls:
            for request in self._make_requests(url):
                yield request

    @override
    def parse(self, response: Response) -> Iterator[Request]:
        self.log(response)

        if getattr(self, "validate_html", False):
            yield Request(
                "http://127.0.0.1:9988/?out=json",
                method="POST",
                headers={"Content-Type": response.headers["Content-Type"]},
                body=response.body,
                callback=self._vnu_callback(response.url),
                errback=self.error_callback,
            )

        assert isinstance(response, TextResponse)
        for link in LxmlLinkExtractor(
            deny_domains=self.deny_domains,
            deny_extensions=["doc"],
            tags=self.tags,
            attrs=self.attrs,
            deny=self.deny,
            canonicalize=False,
        ).extract_links(response):
            yield from self._make_requests(link.url)

    def retry_request_with_get(self, request: Request) -> Iterator[Request]:
        request.method = "GET"
        request.dont_filter = True
        yield request

    def error_callback(self, failure: Failure) -> Failure | Iterator[Request] | None:
        if isinstance(failure.value, HttpError):
            response = failure.value.response
            # Hack: The filtering above does not catch this URL,
            # likely due to a redirect.
            if urlsplit(response.url).netloc == "idmsa.apple.com":
                return None
            assert response.request is not None
            if response.status == 405 and response.request.method == "HEAD":
                # Method 'HEAD' not allowed, repeat request with 'GET'
                return self.retry_request_with_get(response.request)
            self.logger.error("Please check link: %s", response.request.url)

        return failure
```

--------------------------------------------------------------------------------

---[FILE: add_mentor.py]---
Location: zulip-main/tools/droplets/add_mentor.py

```python
# Allows a mentor to ssh into a DigitalOcean droplet. This is designed to be
# executed on the target machine.
#
# This script takes the username of the mentor as an argument:
#
# $ python3 add_mentor.py <mentor's username>
#
# Alternatively you can pass in --remove to remove their SSH key from the
# machine:
#
# $ python3 add_mentor.py --remove <mentor's username>
import os
import re
import socket
import sys
from argparse import ArgumentParser

import requests

parser = ArgumentParser(description="Give a mentor ssh access to this machine.")
parser.add_argument("username", help="GitHub username of the mentor.")
parser.add_argument("--remove", help="Remove his/her key from the machine.", action="store_true")

# Wrap keys with line comments for easier key removal.
append_key = """\
#<{username}>{{{{
{key}
#}}}}<{username}>
"""


def get_mentor_keys(username: str) -> list[str]:
    url = f"https://api.github.com/users/{username}/keys"

    r = requests.get(url)
    if r.status_code != 200:
        print("Cannot connect to GitHub...")
        sys.exit(1)

    keys = r.json()
    if not keys:
        print(f'Mentor "{username}" has no public key.')
        sys.exit(1)

    return [key["key"] for key in keys]


if __name__ == "__main__":
    args = parser.parse_args()
    authorized_keys = os.path.expanduser("~/.ssh/authorized_keys")

    if args.remove:
        remove_re = re.compile(
            rf"#<{args.username}>{{{{.+}}}}<{args.username}>(\n)?", re.DOTALL | re.MULTILINE
        )

        with open(authorized_keys, "r+") as f:
            old_content = f.read()
            new_content = re.sub(remove_re, "", old_content)
            f.seek(0)
            f.write(new_content)
            f.truncate()

        print(f"Successfully removed {args.username}' SSH key!")

    else:
        keys = get_mentor_keys(args.username)
        with open(authorized_keys, "a") as f:
            f.writelines(append_key.format(username=args.username, key=key) for key in keys)

        print(f"Successfully added {args.username}'s SSH key!")
        print("Can you let your mentor know that they can connect to this machine with:\n")
        print(f"    $ ssh zulipdev@{socket.gethostname()}\n")
```

--------------------------------------------------------------------------------

---[FILE: cleanup.py]---
Location: zulip-main/tools/droplets/cleanup.py

```python
import argparse
import configparser
import os

import digitalocean


def get_config() -> configparser.ConfigParser:
    config = configparser.ConfigParser()
    config.read(os.path.join(os.path.dirname(os.path.abspath(__file__)), "conf.ini"))
    return config


parser = argparse.ArgumentParser(description="Clean up old A / AAAA records in zulipdev.org")
parser.add_argument("--force", action="store_true")

if __name__ == "__main__":
    args = parser.parse_args()

    config = get_config()
    api_token = config["digitalocean"]["api_token"]

    seen_ips = set()
    if not args.force:
        print("WOULD DELETE:")

    manager = digitalocean.Manager(token=api_token)
    my_droplets = manager.get_all_droplets()
    for droplet in my_droplets:
        seen_ips.add(droplet.ip_address)
        if droplet.ipv6:
            seen_ips.update(net["ip_address"] for net in droplet.networks["v6"])

    domain = digitalocean.Domain(token=api_token, name="zulipdev.org")
    domain.load()
    records = domain.get_records()

    for record in sorted(records, key=lambda e: ".".join(reversed(e.name.split(".")))):
        if record.type not in ("AAAA", "A"):
            continue
        elif record.data in seen_ips:
            continue
        else:
            print(f"{record.type} {record.name} = {record.data}")
            if args.force:
                record.destroy()

    if not args.force:
        print("Re-run with --force to delete")
```

--------------------------------------------------------------------------------

---[FILE: conf.ini-template]---
Location: zulip-main/tools/droplets/conf.ini-template

```text
[digitalocean]
api_token = APITOKEN
```

--------------------------------------------------------------------------------

````

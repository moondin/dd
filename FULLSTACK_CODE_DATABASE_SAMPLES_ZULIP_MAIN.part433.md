---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 433
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 433 of 1290)

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

---[FILE: statuspage-pusher]---
Location: zulip-main/puppet/kandra/files/statuspage-pusher

```text
#!/usr/bin/env python3

import configparser
import http.client
import json
import logging
import time
from urllib.parse import urlencode


def fetch_metric(metric_id: str, query: str) -> float:
    logging.info("Fetching %s", metric_id)
    params = urlencode({"query": query})
    conn = http.client.HTTPConnection("localhost:9090")
    conn.request("GET", "/api/v1/query?" + params)
    response = conn.getresponse()
    if response.status != 200:
        raise Exception(
            f"Failed to request {metric_id} from Prometheus: {response.status} {response.reason}"
        )
    raw_bytes = response.read()
    conn.close()
    data = json.loads(raw_bytes)
    if data["status"] != "success":
        raise Exception(f"Failed to request {metric_id}: {raw_bytes.decode()}")
    return float(data["data"]["result"][0]["value"][1])


def push_metric(metric_id: str, metric_value: float, page_id: str, oauth_token: str) -> None:
    conn = http.client.HTTPSConnection("api.statuspage.io")
    params = json.dumps({"data": {"timestamp": time.time(), "value": metric_value}})
    headers = {"Content-Type": "application/json", "Authorization": "OAuth " + oauth_token}
    conn.request(
        "POST", "/v1/pages/" + page_id + "/metrics/" + metric_id + "/data.json", params, headers
    )
    response = conn.getresponse()
    if not (response.status >= 200 and response.status < 300):
        raise Exception(
            f"Failed to push {metric_id} to statuspage.io: {response.status} {response.reason}"
        )
    logging.info("Wrote %s: %s", metric_id, response.read().decode())
    conn.close()


def update_metric(metric_id: str, query: str, page_id: str, oauth_token: str) -> None:
    metric_value = fetch_metric(metric_id, query)
    push_metric(metric_id, metric_value, page_id, oauth_token)


def main() -> None:
    logging.basicConfig(format="%(asctime)s statuspage-pusher: %(message)s", level=logging.INFO)

    secrets_file = configparser.RawConfigParser()
    secrets_file.read("/etc/zulip/zulip-secrets.conf")

    oauth_token = secrets_file.get("secrets", "statuspage_token")
    if oauth_token is None:
        raise RuntimeError("statuspage_token secret is required")

    config_file = configparser.RawConfigParser()
    config_file.read("/etc/zulip/zulip.conf")
    page_id = config_file.get("statuspage", "page_id")
    if page_id is None:
        raise RuntimeError("statuspage.page_id in zulip.conf is required")

    metrics_file = configparser.RawConfigParser()
    metrics_file.read("/etc/zulip/statuspage.conf")
    metrics = metrics_file["metrics"]

    while True:
        for metric_id, query in metrics.items():
            try:
                update_metric(metric_id, query, page_id, oauth_token)
            except Exception as e:
                logging.exception(e)
        time.sleep(30)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: teleport-aws-credentials]---
Location: zulip-main/puppet/kandra/files/teleport-aws-credentials

```text
#!/usr/bin/env bash

# This uses AWS IAM Roles Anywhere[1] to acquire the NonAWSInstance
# role for the whole server.  It does this by having configured the
# Teleport CA to be a "trust anchor," allowing the Teleport host
# certificate to be used for authentication; the NonAWSInstance role
# itself has a trust relationship which lists the CA as sufficient to
# authorize for the role.
#
# [1]: https://docs.aws.amazon.com/rolesanywhere/latest/userguide

set -eu

# Check if we have cached credentials; they're good for 60 minutes, so
# check within 55min.
cache="/etc/aws-credential-cache.json"
if [ -s "$cache" ] && [ "$(find "$cache" -mmin -55)" ]; then
    cat "$cache"
    exit 0
fi

# Extract the current host cert and key from the Teleport database.
# These are nominally static for the lifetime of the host, but there's
# little reason to not refresh them on every run, in case they get
# rotated.

teleport_json=$(
    sqlite3 /var/lib/teleport/proc/sqlite.db "select value from kv where key = '/ids/node/current'"
)

# $teleport_json is a secret (it has the host key) so extract it
# carefully (i.e. not using `echo $teleport_json"`")
jq -r .spec.tls_cert <<<"$teleport_json" | base64 -d >/var/lib/teleport/host.crt
jq -r .spec.key <<<"$teleport_json" | base64 -d >/var/lib/teleport/host.key

# Write the cache out
/srv/zulip-aws-tools/bin/aws_signing_helper credential-process \
    --certificate /var/lib/teleport/host.crt \
    --private-key /var/lib/teleport/host.key \
    "$@" >"$cache"

cat "$cache"
```

--------------------------------------------------------------------------------

---[FILE: teleport_app.yaml]---
Location: zulip-main/puppet/kandra/files/teleport_app.yaml

```yaml
app_service:
  enabled: yes
  apps:
```

--------------------------------------------------------------------------------

---[FILE: teleport_server.yaml]---
Location: zulip-main/puppet/kandra/files/teleport_server.yaml

```yaml
# See https://goteleport.com/docs/config-reference/ and
# https://goteleport.com/docs/admin-guide/#configuration
teleport:
  ca_pin: "sha256:062db37249ea74c450579da8f02043b317cb8a174d653bb5090a89752d68efe7"

auth_service:
  enabled: "yes"
  listen_addr: 0.0.0.0:3025
  cluster_name: teleport.zulipchat.net
  authentication:
    type: local
    second_factor: on
    signature_algorithm_suite: balanced-v1
    u2f:
      app_id: https://teleport.zulipchat.net
    webauthn:
      rp_id: teleport.zulipchat.net

proxy_service:
  enabled: "yes"
  listen_addr: 0.0.0.0:3023
  web_listen_addr: 0.0.0.0:443
  public_addr: teleport.zulipchat.net:443
  acme:
    enabled: "yes"
    email: zulip-ops@zulip.com

ssh_service:
  enabled: no
```

--------------------------------------------------------------------------------

---[FILE: weblate_exporter]---
Location: zulip-main/puppet/kandra/files/weblate_exporter

```text
#!/usr/bin/env python3

import argparse
import configparser
import json
import logging
import os
import sys
import time
from collections.abc import Callable
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Any
from urllib.request import Request, urlopen

DEFAULT_PORT = 9189
PROJECT = "zulip"
COMPONENTS = ["frontend", "django", "desktop", "zulip-flutter"]

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


class WeblateMetricsCollector:
    def __init__(self, token: str) -> None:
        self.token = token

    def make_request(self, endpoint: str) -> dict[str, Any]:
        request = Request(f"https://hosted.weblate.org/{endpoint}")
        request.add_header("Authorization", f"Token {self.token}")
        request.add_header("Accept", "application/json")
        request.add_header("User-Agent", "WeblatePrometheusExporter/1.0")
        with urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))

    def fetch_component_languages(self, project: str, component: str) -> list[str]:
        endpoint = f"api/components/{project}/{component}/translations/"
        try:
            response = self.make_request(endpoint)
            logger.debug("Fetched translations for %s/%s: %s", project, component, response)

            # Extract language codes from the paginated response
            languages = []
            if response.get("results"):
                languages.extend(
                    [
                        translation["language"]["code"]
                        for translation in response["results"]
                        if "language" in translation and "code" in translation["language"]
                    ]
                )

                logger.debug("Found languages for %s/%s: %s", project, component, languages)
                return languages
            else:
                logger.warning("No translations found for %s/%s", project, component)
                return []
        except Exception as e:
            logger.error("Failed to fetch languages for %s/%s: %s", project, component, e)
            return []

    def fetch_translation_statistics(
        self, project: str, component: str, language: str
    ) -> dict[str, Any] | None:
        endpoint = f"api/translations/{project}/{component}/{language}/statistics/"
        try:
            stats = self.make_request(endpoint)
            logger.debug("Fetched stats for %s/%s/%s: %s", project, component, language, stats)
            return stats
        except Exception as e:
            logger.error(
                "Failed to fetch statistics for %s/%s/%s: %s", project, component, language, e
            )
            return None

    def collect_all_metrics(self) -> dict[str, dict[str, dict[str, Any]]]:
        metrics = {}

        for component in COMPONENTS:
            logger.info("Fetching statistics for %s/%s", PROJECT, component)

            languages = self.fetch_component_languages(PROJECT, component)
            if not languages:
                logger.warning("No languages found for %s/%s", PROJECT, component)
                continue

            component_metrics = {}
            for language in languages:
                logger.info("Fetching statistics for %s/%s/%s", PROJECT, component, language)
                stats = self.fetch_translation_statistics(PROJECT, component, language)

                if stats:
                    component_metrics[language] = stats
                else:
                    logger.warning(
                        "No statistics available for %s/%s/%s", PROJECT, component, language
                    )

            if component_metrics:
                metrics[component] = component_metrics
            else:
                logger.warning("No translation statistics available for component %s", component)

        logger.info("Collected metrics for %d components", len(metrics))
        return metrics

    def format_prometheus_metrics(self, metrics_data: dict[str, dict[str, dict[str, Any]]]) -> str:
        if not metrics_data:
            return "# No metrics data available\n"

        lines = [
            "# HELP weblate_translation_info Translation information",
            "# TYPE weblate_translation_info gauge",
        ]

        for component, languages in metrics_data.items():
            for language, stats in languages.items():
                lines.append(
                    f'weblate_translation_info{{component="{component}",language="{language}",name="{stats.get("name", f"{component}-{language}")}"}} 1'
                )

        metric_definitions = [
            ("translated", "Number of translated strings"),
            ("translated_words", "Number of translated words"),
            ("translated_chars", "Number of translated characters"),
            ("total", "Total number of strings"),
            ("total_words", "Total number of words"),
            ("total_chars", "Total number of characters"),
            ("fuzzy", "Number of fuzzy strings"),
            ("fuzzy_words", "Number of fuzzy words"),
            ("fuzzy_chars", "Number of fuzzy characters"),
            ("failing", "Number of failing checks"),
            ("failing_words", "Number of words with failing checks"),
            ("failing_chars", "Number of characters with failing checks"),
            ("approved", "Number of approved strings"),
            ("approved_words", "Number of approved words"),
            ("approved_chars", "Number of approved characters"),
            ("suggestions", "Number of suggestions"),
            ("comments", "Number of comments"),
            ("translated_percent", "Percentage of translated strings"),
            ("translated_words_percent", "Percentage of translated words"),
            ("translated_chars_percent", "Percentage of translated characters"),
            ("approved_percent", "Percentage of approved strings"),
            ("approved_words_percent", "Percentage of approved words"),
            ("approved_chars_percent", "Percentage of approved characters"),
        ]

        for metric_key, description in metric_definitions:
            lines.extend(
                [
                    f"# HELP weblate_{metric_key} {description}",
                    f"# TYPE weblate_{metric_key} gauge",
                ]
            )
            for component, languages in metrics_data.items():
                for language, stats in languages.items():
                    value = stats.get(metric_key, 0)
                    lines.append(
                        f'weblate_{metric_key}{{component="{component}",language="{language}"}} {value}'
                    )

        lines.extend(
            [
                "# HELP weblate_last_update_timestamp Unix timestamp of last metrics update",
                "# TYPE weblate_last_update_timestamp gauge",
                f"weblate_last_update_timestamp {time.time()}",
            ]
        )

        return "\n".join(lines) + "\n"


class PrometheusHandler(BaseHTTPRequestHandler):
    def __init__(self, collector: WeblateMetricsCollector, *args: Any, **kwargs: Any) -> None:
        self.collector = collector
        super().__init__(*args, **kwargs)

    def do_GET(self) -> None:
        if self.path == "/metrics":
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()

            try:
                metrics_data = self.collector.collect_all_metrics()
                metrics = self.collector.format_prometheus_metrics(metrics_data)
            except Exception as e:
                logger.error("Error collecting metrics: %s", e)
                metrics = f"# Error collecting metrics: {e}\n"

            self.wfile.write(metrics.encode("utf-8"))
            return

        elif self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"OK\n")
            return

        elif self.path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            html = """<!DOCTYPE html>
<html>
<head><title>Weblate Prometheus Exporter</title></head>
<body>
<h1>Weblate Prometheus Exporter</h1>
<p><a href="/metrics">Metrics</a></p>
<p><a href="/health">Health Check</a></p>
</body>
</html>"""
            self.wfile.write(html.encode("utf-8"))
            return

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found\n")
            return

    def log_message(self, format: str, *args: Any) -> None:  # type: ignore[explicit-override]  # @override is available in typing_extensions, which is not core Python
        logger.info("%s - %s", self.address_string(), format % args)


def create_handler(
    collector: WeblateMetricsCollector,
) -> Callable[..., PrometheusHandler]:
    def handler(*args: Any, **kwargs: Any) -> PrometheusHandler:
        return PrometheusHandler(collector, *args, **kwargs)

    return handler


def main() -> None:
    parser = argparse.ArgumentParser(description="Weblate Prometheus Exporter")
    parser.add_argument(
        "--port",
        type=int,
        default=DEFAULT_PORT,
        help=f"Port to listen on (default: {DEFAULT_PORT})",
    )
    parser.add_argument(
        "--token",
        default=os.getenv("WEBLATE_TOKEN"),
        help="Weblate API token (can also be set via WEBLATE_TOKEN env var)",
    )
    parser.add_argument("--verbose", "-v", action="store_true", help="Enable verbose logging")

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    token = args.token
    if args.token is None:
        secrets_file = configparser.RawConfigParser()
        secrets_file.read("/etc/zulip/zulip-secrets.conf")
        token = secrets_file["secrets"]["weblate_api_key"]

    handler = create_handler(WeblateMetricsCollector(token=token))
    server = HTTPServer(("", args.port), handler)

    logger.info("Metrics available at http://localhost:%d/metrics", args.port)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        logger.info("Shutting down server...")
        server.shutdown()
        sys.exit(0)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: ports.conf]---
Location: zulip-main/puppet/kandra/files/apache/ports.conf

```text
# If you just change the port or add more ports here, you will likely also
# have to change the VirtualHost statement in
# /etc/apache2/sites-enabled/000-default
# This is also true if you have upgraded from before 2.2.9-3 (i.e. from
# Debian etch). See /usr/share/doc/apache2.2-common/NEWS.Debian.gz and
# README.Debian.gz

# Only serve Nagios on localhost
Listen 127.0.0.1:3000
```

--------------------------------------------------------------------------------

---[FILE: 02periodic]---
Location: zulip-main/puppet/kandra/files/apt/apt.conf.d/02periodic

```text
# Every day, update package lists and install upgrades; see 50unattended-upgrades

APT::Periodic::Enable "1";
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
```

--------------------------------------------------------------------------------

---[FILE: 50unattended-upgrades]---
Location: zulip-main/puppet/kandra/files/apt/apt.conf.d/50unattended-upgrades

```text
// Automatically upgrade packages from these (origin:archive) pairs
//
// Note that in Ubuntu security updates may pull in new dependencies
// from non-security sources (e.g. chromium). By allowing the release
// pocket these get automatically pulled in.
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}:${distro_codename}-updates";
    // Extended Security Maintenance; doesn't necessarily exist for
    // every release and this system may not have it installed, but if
    // available, the policy for updates is such that unattended-upgrades
    // should also install from here by default.
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};

// Python regular expressions, matching packages to exclude from upgrading
Unattended-Upgrade::Package-Blacklist {
    "libc\d+";
    "memcached$";
    "nginx-full$";
    "postgresql-\d+$";
    "postgresql-\d+-pgdg-pgroonga$";
    "rabbitmq-server$";
    "erlang-base$";
    "redis-server$";
    "supervisor$";
};

// This option controls whether the development release of Ubuntu will be
// upgraded automatically. Valid values are "true", "false", and "auto".
Unattended-Upgrade::DevRelease "false";

// This option allows you to control if on a unclean dpkg exit
// unattended-upgrades will automatically run
//   dpkg --force-confold --configure -a
Unattended-Upgrade::AutoFixInterruptedDpkg "true";

// Split the upgrade into the smallest possible chunks so that
// they can be interrupted with SIGTERM. This makes the upgrade
// a bit slower but it has the benefit that shutdown while a upgrade
// is running is possible (with a small delay)
Unattended-Upgrade::MinimalSteps "true";

// Remove unused automatically installed kernel-related packages
// (kernel images, kernel headers and kernel version locked tools).
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";

// Do automatic removal of newly unused dependencies after the upgrade
Unattended-Upgrade::Remove-New-Unused-Dependencies "true";

// Do automatic removal of unused packages after the upgrade
// (equivalent to apt-get autoremove)
//Unattended-Upgrade::Remove-Unused-Dependencies "false";

// Automatically reboot *WITHOUT CONFIRMATION*
//  if the file /var/run/reboot-required is found after the upgrade 
Unattended-Upgrade::Automatic-Reboot "false";
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: zulip-main/puppet/kandra/files/certs/.gitignore

```text
# Don't check SSL private keys into git!
*.key
```

--------------------------------------------------------------------------------

---[FILE: emacs.el]---
Location: zulip-main/puppet/kandra/files/dotfiles/emacs.el

```text
; Move automatic backups into a directory off to the side
(defvar backup-dir "~/.emacs-backups/")
(setq backup-directory-alist (list (cons "." backup-dir)))
```

--------------------------------------------------------------------------------

---[FILE: restart_mirror_to_czo.hook]---
Location: zulip-main/puppet/kandra/files/hooks/post-deploy.d/restart_mirror_to_czo.hook

```text
#!/usr/bin/env bash

set -e
set -u

# This script uses `uv run`, and thus uses the production venv.  This
# means that we need to make sure that we restart into the new venv,
# so we don't start to error when the old venv gets garbage collected.
supervisorctl restart mirror_to_czo:*
```

--------------------------------------------------------------------------------

---[FILE: zulip_notify_schema_diff.hook]---
Location: zulip-main/puppet/kandra/files/hooks/post-deploy.d/zulip_notify_schema_diff.hook

```text
#!/usr/bin/env bash

set -e
set -u

source "$(dirname "$0")/../common/zulip_notify.sh"

if ! ref=$(crudini --get /etc/zulip/zulip.conf push_git_ref ref); then
    exit 0
fi

diffstat=$(git diff --stat "$ZULIP_NEW_MERGE_BASE_COMMIT" ./*/migrations/)

if [ -z "$diffstat" ]; then
    exit 0
fi

echo "zulip_notify_schema_diff: Found schema differences from merge-base!"

zulip_send "${deploy_environment} deploy on $(hostname) found differences in schema from merge-base:

\`\`\`
${diffstat}
\`\`\`

Please manually adjust the \`${ref}\` ref.
"
```

--------------------------------------------------------------------------------

---[FILE: header.v4]---
Location: zulip-main/puppet/kandra/files/iptables/header.v4

```text
# This file was auto-generated by Puppet.  Do not edit by hand.

# The raw table is used to disable connection tracking for DNS
# traffic, so it works even when the conntrack table fills.
*raw
:PREROUTING ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
-A PREROUTING -p udp -m udp --dport 53 -j CT --notrack
-A PREROUTING -p udp -m udp --sport 53 -j CT --notrack
-A OUTPUT -p udp -m udp --dport 53 -j CT --notrack
-A OUTPUT -p udp -m udp --sport 53 -j CT --notrack
COMMIT


*filter
# Allow all outbound traffic
-A OUTPUT -j ACCEPT

# Accept all loopback traffic
-A INPUT -i lo -j ACCEPT

# Drop all traffic to loopback IPs on other interfaces
-A INPUT ! -i lo -d 127.0.0.0/8 -j DROP

# Accept incoming traffic related to established connections, or the
# untracked port-53-UDP set up above.  See iptables-extensions(8) for
# the --state flag.  This drops INVALID and NEW states.
-A INPUT -m state --state ESTABLISHED,RELATED,UNTRACKED -j ACCEPT

# Host-specific rules follow:
```

--------------------------------------------------------------------------------

---[FILE: header.v6]---
Location: zulip-main/puppet/kandra/files/iptables/header.v6

```text
# This file was auto-generated by Puppet.  Do not edit by hand.
*filter

# Allow all outbound traffic
-A OUTPUT -j ACCEPT

# Accept all loopback traffic
-A INPUT -i lo -j ACCEPT

# Drop all traffic to loopback IPs on other interfaces
-A INPUT ! -i lo -d ::1/128 -j DROP

# Allow ICMP; it is more fundamental to IPv6 functioning.
-A INPUT -p icmpv6 -j ACCEPT

# Accept incoming traffic related to established connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Host-specific rules follow:
```

--------------------------------------------------------------------------------

---[FILE: trailer.v4]---
Location: zulip-main/puppet/kandra/files/iptables/trailer.v4

```text

# Drop everything else
-A INPUT   -j DROP
-A FORWARD -j DROP

COMMIT
```

--------------------------------------------------------------------------------

---[FILE: trailer.v6]---
Location: zulip-main/puppet/kandra/files/iptables/trailer.v6

```text

# Drop everything else
-A INPUT   -j DROP
-A FORWARD -j DROP

COMMIT
```

--------------------------------------------------------------------------------

---[FILE: commands.cfg]---
Location: zulip-main/puppet/kandra/files/nagios4/commands.cfg

```text
###############################################################################
# COMMANDS.CFG - SAMPLE COMMAND DEFINITIONS FOR NAGIOS
###############################################################################


################################################################################
# NOTIFICATION COMMANDS
################################################################################

# 'notify-host-by-email' command definition
define command{
      command_name notify-host-by-email
      command_line /usr/bin/printf "%b" "Subject: $NOTIFICATIONTYPE$ Host Alert: $HOSTNAME$ is $HOSTSTATE$\n\n***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\nHost: $HOSTNAME$\nState: $HOSTSTATE$\nAddress: $HOSTADDRESS$\nInfo: $HOSTOUTPUT$\n\nDate/Time: $LONGDATETIME$\n" | /usr/bin/msmtp -C /var/lib/nagios/msmtprc -vt $CONTACTEMAIL$ 2>&1
      }

# 'notify-service-by-email' command definition
define command{
      command_name notify-service-by-email
      command_line /usr/bin/printf "%b" "Subject: $NOTIFICATIONTYPE$ Service Alert: $HOSTALIAS$/$SERVICEDESC$ is $SERVICESTATE$\n\n***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\n\nService: $SERVICEDESC$\nHost: $HOSTALIAS$\nAddress: $HOSTADDRESS$\nState: $SERVICESTATE$\n\nDate/Time: $LONGDATETIME$\n\nAdditional Info:\n\n$SERVICEOUTPUT$\n$LONGSERVICEOUTPUT$\n" | /usr/bin/msmtp -C /var/lib/nagios/msmtprc -vt $CONTACTEMAIL$
      }

# Zulip commands
define command {
    command_name    notify-host-by-zulip
    command_line    /usr/local/share/zulip/integrations/nagios/nagios-notify-zulip --stream="kandra ops" --type="$NOTIFICATIONTYPE$" --host="$HOSTADDRESS$" --state="$HOSTSTATE$" --output="$HOSTOUTPUT$" --long-output="$LONGHOSTOUTPUT$"
}

define command {
    command_name    notify-service-by-zulip
    command_line    /usr/local/share/zulip/integrations/nagios/nagios-notify-zulip --stream="kandra ops" --type="$NOTIFICATIONTYPE$" --host="$HOSTADDRESS$" --service="$SERVICEDESC$" --state="$SERVICESTATE$" --output="$SERVICEOUTPUT$" --long-output="$LONGSERVICEOUTPUT$"
}

################################################################################
# HOST CHECK COMMANDS
################################################################################

# On Debian, check-host-alive is being defined from within the
# monitoring-plugins-basic package

################################################################################
# PERFORMANCE DATA COMMANDS
################################################################################


# 'process-host-perfdata' command definition
define command{
        command_name    process-host-perfdata
        command_line    /usr/bin/printf "%b" "$LASTHOSTCHECK$\t$HOSTNAME$\t$HOSTSTATE$\t$HOSTATTEMPT$\t$HOSTSTATETYPE$\t$HOSTEXECUTIONTIME$\t$HOSTOUTPUT$\t$HOSTPERFDATA$\n" >> /var/lib/nagios4/host-perfdata.out
        }


# 'process-service-perfdata' command definition
define command{
        command_name    process-service-perfdata
        command_line    /usr/bin/printf "%b" "$LASTSERVICECHECK$\t$HOSTNAME$\t$SERVICEDESC$\t$SERVICESTATE$\t$SERVICEATTEMPT$\t$SERVICESTATETYPE$\t$SERVICEEXECUTIONTIME$\t$SERVICELATENCY$\t$SERVICEOUTPUT$\t$SERVICEPERFDATA$\n" >> /var/lib/nagios4/service-perfdata.out
        }

define command{
        command_name    check_remote_disk
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p 22 -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/check_disk -W$ARG1$ -K$ARG2$ -w $ARG1$ -c $ARG2$ -A -l -X cgroup -X tmpfs -X devtmpfs -X squashfs -X configfs -X tracefs'
}

# Copy of check_remote_disk without the SSH
define command{
        command_name    check_local_disk
        command_line    /usr/lib/nagios/plugins/check_disk -W$ARG1$ -K$ARG2$ -w $ARG1$ -c $ARG2$ -A -l -X cgroup -X tmpfs -X devtmpfs -X squashfs -X configfs -X tracefs
}

define command{
        command_name    check_debian_packages
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p $ARG1$ -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/zulip_base/check_debian_packages'
}

define command{
        command_name    check_ntp_time
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p $ARG1$ -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/check_ntp_time -H $ARG2$ -w .5 -c 1'
}

define command{
        command_name    check_queue_worker_errors
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p $ARG1$ -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/zulip_app_frontend/check_queue_worker_errors'
}

define command{
        command_name    check_postgres
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p 22 -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/bin/check_postgres --dbname=$ARG1$ --dbuser=$ARG2$ --action $ARG3$'
}

define command{
        command_name    check_postgres_alert_args
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p 22 -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/bin/check_postgres --dbname=$ARG1$ --dbuser=$ARG2$ --action $ARG3$ --warning="$ARG4$" --critical="$ARG5$"'
}

define command{
        command_name    check_redis_ssh
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p $ARG1$ -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/check_redis -H 127.0.0.1 -C /var/lib/nagios/redis_password'
}

define command{
        command_name    check_rabbitmq_queues
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p $ARG1$ -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/zulip_app_frontend/check_cron_file /var/lib/nagios_state/check-rabbitmq-results'
}

define command{
        command_name    check_send_receive_time
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p $ARG1$ -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/zulip_app_frontend/check_cron_file /var/lib/nagios_state/check_send_receive_state'
}

define command{
        command_name    check_rabbitmq_consumers
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p 22 -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/zulip_app_frontend/check_cron_file /var/lib/nagios_state/check-rabbitmq-consumers-$ARG1$'
}

define command{
        command_name    check_analytics_state
        command_line    /usr/lib/nagios/plugins/check_by_ssh -p 22 -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/zulip_app_frontend/check_cron_file /var/lib/nagios_state/check-analytics-state 4000'  # Last argument is acceptable delay in seconds.
}

define command {
        command_name    check_named_procs
        command_line    /usr/lib/nagios/plugins/check_procs -C $ARG1$ -w $ARG2$ -c $ARG3$
}

define command{
        command_name    check_procs_nokthreads
        command_line    /usr/lib/nagios/plugins/check_procs -w '$ARG1$' -c '$ARG2$' -k
}

define command {
        command_name    check_fts_update_log
        command_line    /usr/lib/nagios/plugins/check_by_ssh -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/local/bin/process_fts_updates --nagios-check'
}

define command {
        command_name    check_postgresql_replication_lag
        command_line    /usr/lib/nagios/plugins/check_by_ssh -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/zulip_postgresql/check_postgresql_replication_lag'
}

define command{
       command_name     check_worker_memory
       command_line    /usr/lib/nagios/plugins/check_by_ssh -l nagios -t 30 -i /var/lib/nagios/.ssh/id_ed25519 -H $HOSTADDRESS$ -C '/usr/lib/nagios/plugins/zulip_app_frontend/check_worker_memory'
}

define command{
       command_name     check_https_status
       command_line     /usr/lib/nagios/plugins/check_http --ssl -H '$HOSTADDRESS$' -I '$HOSTADDRESS$' --expect=200,302,401
}

define command{
       command_name     check_ssl_certificate
       command_line     /usr/lib/nagios/plugins/check_http --ssl -H '$ARG1$' -I '$ARG1$' --sni --expect=200,302,401 -C30,14
}

define command{
       command_name     check_proxy_status
       command_line     /usr/lib/nagios/plugins/check_http --ssl -H 'www.google.com' -u 'https://www.google.com/' -j CONNECT -I '$HOSTADDRESS$' -p 4750 --expect=200,302,401 -s Search
}

define command{
       command_name     check_apt_repo_status
       command_line     /usr/lib/nagios/plugins/check_http --sni --ssl -H '$ARG1$' -u 'https://$ARG1$$ARG2$/dists/stable/Release' --expect=200 -s Contents-amd64
}

define command{
       command_name     check_camo
       command_line     /usr/lib/nagios/plugins/check_http --sni --ssl -H '$ARG1$' -u '$ARG2$' -k 'Accept-Encoding: identity' -w '$ARG3$' -c '$ARG4$'
}
```

--------------------------------------------------------------------------------

````

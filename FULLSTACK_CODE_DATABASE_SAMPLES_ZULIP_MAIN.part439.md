---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 439
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 439 of 1290)

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

---[FILE: mirror_to_czo.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/mirror_to_czo.conf.template.erb

```text
[program:mirror_to_czo]
# We record the hash of the script so that we can update this file
# with it, which will make `supervisorctl reread && supervisorctl
# update` restart this job.
command=uv run --no-sync /usr/local/bin/mirror_to_czo
directory=/home/zulip/deployments/current/
process_name=mirror_to_czo_<%= @script_hash %>
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/mirror_to_czo.log
```

--------------------------------------------------------------------------------

---[FILE: prometheus.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/prometheus.conf.template.erb

```text
[program:prometheus]
command=<%= @bin %> --storage.tsdb.path="<%= @data_dir %>" --config.file="/etc/prometheus/prometheus.yaml" --web.listen-address="127.0.0.1:9090" --storage.tsdb.retention.time=1y
directory=<%= @dir %>
priority=10
autostart=true
autorestart=true
user=prometheus
redirect_stderr=true
stdout_logfile=/var/log/prometheus.log
```

--------------------------------------------------------------------------------

---[FILE: prometheus_grok_exporter.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/prometheus_grok_exporter.conf.template.erb

```text
[program:prometheus_grok_exporter]
command=<%= @bin %> -config /etc/grok_exporter.yaml
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/grok_exporter.log
```

--------------------------------------------------------------------------------

---[FILE: prometheus_node_exporter.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/prometheus_node_exporter.conf.template.erb

```text
[program:prometheus_node_exporter]
command=<%= @bin %> --collector.supervisord --collector.supervisord.url=unix:///var/run/supervisor.sock --no-collector.hwmon
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/node_exporter.log
```

--------------------------------------------------------------------------------

---[FILE: prometheus_postgres_exporter.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/prometheus_postgres_exporter.conf.template.erb

```text
[program:prometheus_postgres_exporter]
command=<%= @bin %> --collector.stat_user_indexes
environment=DATA_SOURCE_NAME="postgresql://prometheus@:5432/zulip?host=/var/run/postgresql"
priority=10
autostart=true
autorestart=true
user=prometheus
redirect_stderr=true
stdout_logfile=/var/log/zulip/postgres_exporter.log
```

--------------------------------------------------------------------------------

---[FILE: prometheus_process_exporter.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/prometheus_process_exporter.conf.template.erb

```text
[program:prometheus_process_exporter]
command=<%= @bin %> -config.path <%= @conf %> -recheck-with-time-limit 1m
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/process_exporter.log
```

--------------------------------------------------------------------------------

---[FILE: prometheus_pushgateway.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/prometheus_pushgateway.conf.template.erb

```text
[program:prometheus_pushgateway]
command=<%= @bin %>
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/pushgateway.log
```

--------------------------------------------------------------------------------

---[FILE: prometheus_redis_exporter.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/prometheus_redis_exporter.conf.template.erb

```text
[program:prometheus_redis_exporter]
command=/usr/local/bin/secret-env-wrapper REDIS_PASSWORD=redis_password <%= @bin %>
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/redis_exporter.log
```

--------------------------------------------------------------------------------

---[FILE: prometheus_uwsgi_exporter.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/prometheus_uwsgi_exporter.conf.template.erb

```text
[program:prometheus_uwsgi_exporter]
command=<%= @bin %> --stats.uri=unix:///home/zulip/deployments/uwsgi-stats --web.listen-address=:9238
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/uwsgi_exporter.log
```

--------------------------------------------------------------------------------

---[FILE: prometheus_wal_g_exporter.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/prometheus_wal_g_exporter.conf.template.erb

```text
[program:prometheus_wal_g_exporter]
# We record the hash of the script so that we can update this file
# with it, which will make `supervisorctl reread && supervisorctl
# update` restart this job.
command=/usr/local/bin/wal-g-exporter
process_name=wal-g-exporter_<%= @exporter_hash %>
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/wal_g_exporter.log
```

--------------------------------------------------------------------------------

---[FILE: redis_tunnel.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/redis_tunnel.conf.template.erb

```text
[program:redis-tunnel]
command=autossh -M 0 -N -L 127.0.0.1:6379:127.0.0.1:6379 -o ServerAliveInterval=30 -o ServerAliveCountMax=3 <%= @redis_hostname %>
priority=50
user=redistunnel
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/zulip/redis_tunnel.log
```

--------------------------------------------------------------------------------

---[FILE: statuspage-pusher.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/statuspage-pusher.conf.template.erb

```text
[program:statuspage-pusher]
command=<%= @bin %>
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/statuspage-pusher.log
```

--------------------------------------------------------------------------------

---[FILE: vector.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/vector.conf.template.erb

```text
[program:vector]
command=<%= @bin %> --config <%= @conf %> --require-healthy true
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/vector.log
```

--------------------------------------------------------------------------------

---[FILE: weblate_exporter.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/weblate_exporter.conf.template.erb

```text
[program:weblate_exporter]
# We record the hash of the script so that we can update this file
# with it, which will make `supervisorctl reread && supervisorctl
# update` restart this job.
command=<%= @bin %>
process_name=weblate_exporter_<%= @exporter_hash %>
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/weblate_exporter.log
```

--------------------------------------------------------------------------------

---[FILE: uptrack.conf.erb]---
Location: zulip-main/puppet/kandra/templates/uptrack/uptrack.conf.erb

```text
[Auth]
accesskey = <%= @ksplice_access_key %>

[Network]
# Proxy to use when accessing the Uptrack server, of the form
# [protocol://][username:password@]<host>[:port], where
# * protocol is the protocol to connect to the proxy (http or https)
# * the username and password are the authentication
#   information needed to use your proxy (if any).
# * host and port are the hostname/ip address and port number used to
#   connect to the proxy
#
# The proxy must support making HTTPS connections. If this is unset,
# Uptrack will look for the https_proxy, HTTPS_PROXY, and http_proxy
# environment variables in that order, and then finally look for a
# proxy setting in the system-wide GConf database, if available and
# enabled below.
#
# You can also set this to "None" to force Uptrack not to use a proxy,
# even if one is set in the environment.
https_proxy =

# Look for proxy setting in the system-wide GConf database, if it's
# not set in the above variable or in an environment variable.
#
# This is broken in later versions of Ubuntu (and other distros too)
# so we disable this by default. See LP: #812940.
gconf_proxy_lookup = no

### Uptrack Local Server options ###

# The path to the CA certificate file used to verify the Uptrack
# server.
#ssl_ca_cert_file =

# The directory for CA certificate files used to verify the Uptrack
# server.
#ssl_ca_cert_dir =

# The location of the Uptrack updates repository.
#update_repo_url=

### End of Uptrack Local Server options ###

[Settings]
# Automatically install updates at boot time. If this is set, on
# reboot into the same kernel, Uptrack will re-install the same set of
# updates that were present before the reboot.
install_on_reboot = yes

# Automatically install all available updates at boot time, even if
# rebooted into a different kernel.
#upgrade_on_reboot = yes

# Uptrack runs in a cron job every few hours to check for and download
# new updates. You can can configure this cron job to automatically
# install new updates as they become available.
#
# Enable this option to make the cron job automatically install new
# updates.
#
# Please note that enabling autoinstall does not mean the Uptrack
# client itself is automatically upgraded. You will be notified via
# e-mail when a new Uptrack client is available, and it can be
# upgraded through your package manager.
autoinstall = yes
```

--------------------------------------------------------------------------------

---[FILE: secret-env-wrapper]---
Location: zulip-main/puppet/zulip/files/secret-env-wrapper

```text
#!/usr/bin/env bash

set -eu

for arg in "$@"; do
    if [ "$arg" == "--" ]; then
        shift
        exec "$@"
    elif [[ "$arg" == *"="* ]]; then
        shift
        varname="${arg%%=*}"
        secretname="${arg#*=}"
        secret=$(crudini --get /etc/zulip/zulip-secrets.conf secrets "$secretname")
        export "$varname"="$secret"
    else
        exec "$@"
    fi
done

{
    echo "Usage:"
    echo "    secret-env-wrapper ENVNAME=secretname binary [argument [argument [...]]]"
} >&2

exit 1
```

--------------------------------------------------------------------------------

---[FILE: ports.conf]---
Location: zulip-main/puppet/zulip/files/apache/ports.conf

```text
# This file is empty since we want nginx to serve ports 80 and 443 on
# this system.
```

--------------------------------------------------------------------------------

---[FILE: zulip-sso.example]---
Location: zulip-main/puppet/zulip/files/apache/sites/zulip-sso.example

```text
# Copyright © 2013 Zulip, Inc. All rights reserved.

# Copy, modify, and enable this site if you need to use an Apache httpd module
# for user authentication.

# Requests to /accounts/login/sso/ will be passed unchanged by the primary
# Zulip web server to Apache. Once a request is authenticated, the REMOTE_USER
# environment variable should be set by your authentication module.

# The config below will then invoke the Zulip web app under Apache, which will
# detect the presence of the variable, log the user in, and then redirect back
# to the app (served by the primary web server). You should configure your
# authentication module below.

NameVirtualHost 127.0.0.1:8888
Listen 127.0.0.1:8888

<VirtualHost 127.0.0.1:8888>
	# As an example, we've configured this service to use HTTP basic auth.
	# Insert the configuration for your SSO authentication module here:
	<Location />
		AuthType basic
		AuthName "zulip.example.com"
		AuthUserFile /home/zulip/zpasswd
		Require valid-user
	</Location>

	ServerAdmin webmaster@localhost

	ServerSignature Off

	# You shouldn't need to edit anything below this line.

	SSLEngine On
	SSLCertificateFile /etc/ssl/certs/zulip.combined-chain.crt
	SSLCertificateKeyFile /etc/ssl/private/zulip.key

	WSGIScriptAlias / /home/zulip/deployments/current/zproject/wsgi.py
	WSGIDaemonProcess zulip threads=5 user=zulip python-path=/home/zulip/deployments/current/
	WSGIProcessGroup zulip
	WSGIApplicationGroup %{GLOBAL}

	ErrorLog ${APACHE_LOG_DIR}/zulip_auth_error.log

	# Possible values include: debug, info, notice, warn, error, crit,
	# alert, emerg.
	LogLevel warn

	CustomLog ${APACHE_LOG_DIR}/zulip_auth_access.log combined
</VirtualHost>
```

--------------------------------------------------------------------------------

---[FILE: email-mirror]---
Location: zulip-main/puppet/zulip/files/cron.d/email-mirror

```text
MAILTO=root

* * * * *   zulip cd /home/zulip/deployments/current && ./manage.py email_mirror
```

--------------------------------------------------------------------------------

---[FILE: sentry.sh]---
Location: zulip-main/puppet/zulip/files/hooks/common/sentry.sh

```bash
#!/usr/bin/env bash

set -e
set -u

if ! grep -Eq 'SENTRY_DSN|SENTRY_FRONTEND_DSN' /etc/zulip/settings.py; then
    echo "sentry: No DSN configured!  Set SENTRY_DSN or SENTRY_FRONTEND_DSN in /etc/zulip/settings.py"
    exit 0
fi

if ! SENTRY_AUTH_TOKEN=$(crudini --get /etc/zulip/zulip-secrets.conf secrets sentry_release_auth_token); then
    echo "sentry: No release auth token set!  Set sentry_release_auth_token in /etc/zulip/zulip-secrets.conf"
    exit 0
fi
export SENTRY_AUTH_TOKEN

# shellcheck disable=SC2034
if ! sentry_org=$(crudini --get /etc/zulip/zulip.conf sentry organization); then
    echo "sentry: No organization set!  Set sentry.organization in /etc/zulip/zulip.conf"
    exit 0
fi

sentry_project=$(crudini --get /etc/zulip/zulip.conf sentry project)
sentry_frontend_project=$(crudini --get /etc/zulip/zulip.conf sentry frontend_project)
if [ -z "$sentry_project" ] && [ -z "$sentry_frontend_project" ]; then
    echo "sentry: No project set!  Set sentry.project and/or sentry.frontend_project in /etc/zulip/zulip.conf"
    exit 0
fi

if [ -n "$sentry_project" ] && ! grep -q 'SENTRY_DSN' /etc/zulip/settings.py; then
    echo "sentry: sentry.project is set but SENTRY_DSN is not set in /etc/zulip/settings.py"
    exit 0
fi
if [ -n "$sentry_frontend_project" ] && ! grep -q 'SENTRY_FRONTEND_DSN' /etc/zulip/settings.py; then
    echo "sentry: sentry.frontend_project is set but SENTRY_FRONTEND_DSN is not set in /etc/zulip/settings.py"
    exit 0
fi

if ! which sentry-cli >/dev/null; then
    echo "sentry: No sentry-cli installed!"
    exit 0
fi

# shellcheck disable=SC2034
sentry_release="zulip-server@$ZULIP_NEW_VERSION"
```

--------------------------------------------------------------------------------

---[FILE: zulip_notify.sh]---
Location: zulip-main/puppet/zulip/files/hooks/common/zulip_notify.sh

```bash
#!/usr/bin/env bash

set -e
set -u

if ! zulip_api_key=$(crudini --get /etc/zulip/zulip-secrets.conf secrets zulip_release_api_key); then
    echo "zulip_notify: No zulip_release_api_key set!  Set zulip_release_api_key in /etc/zulip/zulip-secrets.conf"
    exit 0
fi

if ! zulip_notify_bot_email=$(crudini --get /etc/zulip/zulip.conf zulip_notify bot_email); then
    echo "zulip_notify: No zulip_notify.bot_email set in /etc/zulip/zulip.conf"
    exit 0
fi

if ! zulip_notify_server=$(crudini --get /etc/zulip/zulip.conf zulip_notify server); then
    echo "zulip_notify: No zulip_notify.server set in /etc/zulip/zulip.conf"
    exit 0
fi

if ! zulip_notify_stream=$(crudini --get /etc/zulip/zulip.conf zulip_notify stream); then
    echo "zulip_notify: No zulip_notify.stream set in /etc/zulip/zulip.conf"
    exit 0
fi

from=${ZULIP_OLD_MERGE_BASE_COMMIT:-$ZULIP_OLD_VERSION}
to=${ZULIP_NEW_MERGE_BASE_COMMIT:-$ZULIP_NEW_VERSION}
deploy_environment=$(crudini --get /etc/zulip/zulip.conf machine deploy_type || echo "development")
# shellcheck disable=SC2034
commit_count=$(git rev-list "${from}..${to}" | wc -l)

zulip_send() {
    uv run --no-sync zulip-send \
        --site "$zulip_notify_server" \
        --user "$zulip_notify_bot_email" \
        --api-key "$zulip_api_key" \
        --stream "$zulip_notify_stream" \
        --subject "$deploy_environment deploy" \
        --message "$1"
}
```

--------------------------------------------------------------------------------

---[FILE: push_git_ref.hook]---
Location: zulip-main/puppet/zulip/files/hooks/post-deploy.d/push_git_ref.hook

```text
#!/usr/bin/env bash

set -e
set -u

if [ -z "${ZULIP_NEW_MERGE_BASE_COMMIT:-}" ]; then
    echo "push_git_ref: Can't push because deploy is not from git!"
    exit 0
fi

if ! repo=$(crudini --get /etc/zulip/zulip.conf push_git_ref repo); then
    echo "push_git_ref: No repo set!  Set push_git_ref.repo in /etc/zulip/zulip.conf"
    exit 0
fi

if ! ref=$(crudini --get /etc/zulip/zulip.conf push_git_ref ref); then
    echo "push_git_ref: No ref set!  Set push_git_ref.ref in /etc/zulip/zulip.conf"
    exit 0
fi

git push -f "$repo" "$ZULIP_NEW_MERGE_BASE_COMMIT:$ref"
```

--------------------------------------------------------------------------------

---[FILE: send_zulip_update_announcements.hook]---
Location: zulip-main/puppet/zulip/files/hooks/post-deploy.d/send_zulip_update_announcements.hook

```text
#!/usr/bin/env bash

set -e

/home/zulip/deployments/current/manage.py send_zulip_update_announcements --automated --progress
```

--------------------------------------------------------------------------------

---[FILE: sentry.hook]---
Location: zulip-main/puppet/zulip/files/hooks/post-deploy.d/sentry.hook

```text
#!/usr/bin/env bash

set -e
set -u

source "$(dirname "$0")/../common/sentry.sh"

deploy_environment=$(crudini --get /etc/zulip/zulip.conf machine deploy_type || echo "development")

echo "sentry: Adding deploy of '$deploy_environment' and finalizing release"

sentry-cli releases --org="$sentry_org" deploys "$sentry_release" new \
    --env "$deploy_environment" \
    --started "$(stat -c %Y ./sentry-release)" \
    --finished "$(date +%s)" \
    --name "$(hostname --fqdn)"
sentry-cli releases --org="$sentry_org" finalize "$sentry_release"
```

--------------------------------------------------------------------------------

---[FILE: zulip_notify.hook]---
Location: zulip-main/puppet/zulip/files/hooks/post-deploy.d/zulip_notify.hook

```text
#!/usr/bin/env bash

set -e
set -u

source "$(dirname "$0")/../common/zulip_notify.sh"

echo "zulip_notify: Sending notify of $from .. $to ($commit_count commits) for $deploy_environment to $zulip_notify_server"

zulip_send "Finished ${deploy_environment} deploy of [${commit_count} new commits](https://github.com/zulip/zulip/compare/${from}...${to}) on $(hostname)"
```

--------------------------------------------------------------------------------

---[FILE: sentry.hook]---
Location: zulip-main/puppet/zulip/files/hooks/pre-deploy.d/sentry.hook

```text
#!/usr/bin/env bash

set -e
set -u

source "$(dirname "$0")/../common/sentry.sh"

echo "$sentry_release" >./sentry-release

echo "sentry: Creating release $sentry_release"

# sentry-cli only supports passing one project when making a new
# release, and we want to possibly create more than once at once.  Use
# curl to make the API request.
json=$(jq -nc '{version: $ARGS.named.version,
                projects: $ARGS.positional | map(select( . != ""))}' \
    --arg version "$sentry_release" \
    --args "$sentry_project" "$sentry_frontend_project")
curl "https://sentry.io/api/0/organizations/$sentry_org/releases/" \
    -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
    -H 'Content-Type: application/json' \
    -d "$json" \
    --silent -o /dev/null

merge_base="${ZULIP_NEW_MERGE_BASE_COMMIT:-}"
if [ -n "$merge_base" ]; then
    old_merge_base="$ZULIP_OLD_MERGE_BASE_COMMIT"
    echo "sentry: Setting commit range based on merge-base to upstream of $merge_base"
    sentry-cli releases --org="$sentry_org" set-commits "$sentry_release" --commit="zulip/zulip@$old_merge_base..$merge_base"
fi

if [ -n "$sentry_frontend_project" ]; then
    echo "sentry: Uploading sourcemaps"
    sentry-cli releases --org="$sentry_org" --project="$sentry_frontend_project" files "$sentry_release" upload-sourcemaps static/webpack-bundles/
fi
```

--------------------------------------------------------------------------------

---[FILE: zulip_notify.hook]---
Location: zulip-main/puppet/zulip/files/hooks/pre-deploy.d/zulip_notify.hook

```text
#!/usr/bin/env bash

set -e
set -u

source "$(dirname "$0")/../common/zulip_notify.sh"

echo "zulip_notify: Sending notify of $from .. $to ($commit_count commits) for $deploy_environment to $zulip_notify_server"

zulip_send "Starting ${deploy_environment} deploy of [${commit_count} new commits](https://github.com/zulip/zulip/compare/${from}...${to}) on $(hostname)"
```

--------------------------------------------------------------------------------

---[FILE: 020-symlink.sh]---
Location: zulip-main/puppet/zulip/files/letsencrypt/020-symlink.sh

```bash
#!/usr/bin/env bash

symlink_with_backup() {
    if [ -e "$2" ]; then
        # If the user is setting up our automatic certbot-management on a
        # system that already has certs for Zulip, use some extra caution
        # to keep the old certs available.
        mv -f --backup=numbered "$2" "$2".setup-certbot || true
    fi
    ln -nsf "$1" "$2"
}

if [ -n "${ZULIP_DOMAIN:-}" ]; then
    CERT_DIR="/etc/letsencrypt/live/$ZULIP_DOMAIN"
    symlink_with_backup "$CERT_DIR/privkey.pem" /etc/ssl/private/zulip.key
    symlink_with_backup "$CERT_DIR/fullchain.pem" /etc/ssl/certs/zulip.combined-chain.crt
fi
```

--------------------------------------------------------------------------------

---[FILE: 050-nginx.sh]---
Location: zulip-main/puppet/zulip/files/letsencrypt/050-nginx.sh

```bash
#!/usr/bin/env bash

service nginx reload
```

--------------------------------------------------------------------------------

---[FILE: 055-email-server.sh]---
Location: zulip-main/puppet/zulip/files/letsencrypt/055-email-server.sh

```bash
#!/usr/bin/env bash

supervisorctl restart zulip-email-server
```

--------------------------------------------------------------------------------

---[FILE: zulip.conf]---
Location: zulip-main/puppet/zulip/files/limits.d/zulip.conf

```text
zulip		 soft	 nofile		1000000
zulip		 hard	 nofile		1048576
root		 soft	 nofile		1000000
root		 hard	 nofile		1048576
```

--------------------------------------------------------------------------------

---[FILE: smokescreen]---
Location: zulip-main/puppet/zulip/files/logrotate/smokescreen

```text
/var/log/zulip/smokescreen.log
{
    missingok
    rotate 14
    daily
    compress
    delaycompress
    notifempty
    copytruncate
}
```

--------------------------------------------------------------------------------

---[FILE: check_cron_file]---
Location: zulip-main/puppet/zulip/files/nagios_plugins/zulip_app_frontend/check_cron_file

```text
#!/usr/bin/env python3
"""
Nagios plugin paired with a cron job.  This just verifies that the
file output by the cron job is correct.
"""

import sys
import time


def nagios_from_file(results_file: str, max_time_diff: int = 60 * 2) -> tuple[int, str]:
    """Returns a nagios-appropriate string and return code obtained by
    parsing the desired file on disk. The file on disk should be of format

    %s|%s % (timestamp, nagios_string)

    This file is created by various nagios checking cron jobs such as
    check-rabbitmq-queues and check-rabbitmq-consumers"""

    try:
        with open(results_file) as f:
            data = f.read().strip()
    except FileNotFoundError:
        state = "UNKNOWN"
        ret = 3
        data = "Results file is missing"
    else:
        pieces = data.split("|")

        if len(pieces) != 4:
            state = "UNKNOWN"
            ret = 3
            data = "Results file malformed"
        else:
            timestamp = int(pieces[0])

            time_diff = int(time.time() - timestamp)
            if time_diff > max_time_diff:
                ret = 3
                state = "UNKNOWN"
                data = "Results file is stale"
            else:
                ret = int(pieces[1])
                state = pieces[2]
                data = pieces[3]

    return (ret, f"{state}: {data}")


if __name__ == "__main__":
    RESULTS_FILE = sys.argv[1]
    extra_args = {}
    if len(sys.argv) > 2:
        extra_args["max_time_diff"] = int(sys.argv[2])
    ret, result = nagios_from_file(RESULTS_FILE, **extra_args)

    print(result)
    sys.exit(ret)
```

--------------------------------------------------------------------------------

---[FILE: check_queue_worker_errors]---
Location: zulip-main/puppet/zulip/files/nagios_plugins/zulip_app_frontend/check_queue_worker_errors

```text
#!/usr/bin/env python3

"""
Nagios plugin to check that none of our queue workers have reported errors.
"""

import glob
import os
import sys

# settings.QUEUE_ERROR_DIR; not importing Django so that this can run
# as the nagios user.
wildcard = os.path.join("/var/log/zulip/queue_error", "*.errors")
clean = True
for fn in glob.glob(wildcard):
    print(f"WARNING: Queue errors logged in {fn}")
    clean = False

if not clean:
    sys.exit(1)

sys.exit(0)
```

--------------------------------------------------------------------------------

---[FILE: check_send_receive_time]---
Location: zulip-main/puppet/zulip/files/nagios_plugins/zulip_app_frontend/check_send_receive_time

```text
#!/usr/bin/env python3

"""
Script to provide information about send-receive times.

It must be run on a machine that is using the live database for the
Django ORM.
"""

import argparse
import os
import random
import sys
import time
import traceback
from typing import Any, Literal, NoReturn

sys.path.append(".")
sys.path.append("/home/zulip/deployments/current")
from scripts.lib.setup_path import setup_path
from scripts.lib.zulip_tools import atomic_nagios_write

setup_path()

import django
import zulip

sys.path.append("/home/zulip/deployments/current")
os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"

django.setup()

from django.conf import settings

from zerver.models.realms import get_realm
from zerver.models.users import get_system_bot
from zproject.config import get_config

usage = """Usage: send-receive.py [options] [config]

       'config' is optional, if present will return config info.
        Otherwise, returns the output data."""

parser = argparse.ArgumentParser(usage=usage)
parser.add_argument("--site", default=f"https://{settings.NAGIOS_BOT_HOST}")
parser.add_argument("--insecure", action="store_true")

options = parser.parse_args()


def report(
    state: Literal["ok", "warning", "critical", "unknown"],
    timestamp: float | None = None,
    msg: str | None = None,
) -> NoReturn:
    if msg is None:
        msg = f"send time was {timestamp}"
    sys.exit(atomic_nagios_write("check_send_receive_state", state, msg))


def send_zulip(sender: zulip.Client, message: dict[str, Any]) -> None:
    result = sender.send_message(message)
    if result["result"] != "success":
        report("critical", msg=f"Error sending Zulip, args were: {message}, {result}")


def get_zulips() -> list[dict[str, Any]]:
    global last_event_id
    res = zulip_recipient.get_events(queue_id=queue_id, last_event_id=last_event_id)
    if "error" in res.get("result", {}):
        report("critical", msg="Error receiving Zulips, error was: {}".format(res["msg"]))
    for event in res["events"]:
        last_event_id = max(last_event_id, int(event["id"]))
    # If we get a heartbeat event, that means we've been hanging for
    # 40s, and we should bail.
    if "heartbeat" in (event["type"] for event in res["events"]):
        report("critical", msg="Got heartbeat waiting for Zulip, which means get_events is hanging")
    return [event["message"] for event in res["events"]]


internal_realm_id = get_realm(settings.SYSTEM_BOT_REALM).id
if (
    get_config("machine", "deploy_type") == "staging"
    and settings.NAGIOS_STAGING_SEND_BOT is not None
    and settings.NAGIOS_STAGING_RECEIVE_BOT is not None
):
    sender = get_system_bot(settings.NAGIOS_STAGING_SEND_BOT, internal_realm_id)
    recipient = get_system_bot(settings.NAGIOS_STAGING_RECEIVE_BOT, internal_realm_id)
else:
    sender = get_system_bot(settings.NAGIOS_SEND_BOT, internal_realm_id)
    recipient = get_system_bot(settings.NAGIOS_RECEIVE_BOT, internal_realm_id)

zulip_sender = zulip.Client(
    email=sender.email,
    api_key=sender.api_key,
    verbose=True,
    insecure=options.insecure,
    client="ZulipMonitoring/0.1",
    site=options.site,
)

zulip_recipient = zulip.Client(
    email=recipient.email,
    api_key=recipient.api_key,
    verbose=True,
    insecure=options.insecure,
    client="ZulipMonitoring/0.1",
    site=options.site,
)

try:
    res = zulip_recipient.register(event_types=["message"])
    if "error" in res.get("result", {}):
        report("critical", msg="Error subscribing to Zulips: {}".format(res["msg"]))
    queue_id, last_event_id = (res["queue_id"], res["last_event_id"])
except Exception:
    report("critical", msg=f"Error subscribing to Zulips:\n{traceback.format_exc()}")
msg_to_send = str(random.getrandbits(64))
time_start = time.perf_counter()

send_zulip(
    zulip_sender,
    {
        "type": "private",
        "content": msg_to_send,
        "subject": "time to send",
        "to": recipient.email,
    },
)

complete = False
while not complete:
    messages = get_zulips()
    seconds_diff = time.perf_counter() - time_start
    for m in messages:
        if msg_to_send == m["content"]:
            zulip_sender.delete_message(m["id"])
            complete = True
            break

zulip_recipient.deregister(queue_id)

if seconds_diff > 12:
    report("critical", timestamp=seconds_diff)
if seconds_diff > 3:
    report("warning", timestamp=seconds_diff)
else:
    report("ok", timestamp=seconds_diff)
```

--------------------------------------------------------------------------------

---[FILE: check_worker_memory]---
Location: zulip-main/puppet/zulip/files/nagios_plugins/zulip_app_frontend/check_worker_memory

```text
#!/usr/bin/env bash
# Checks for any Zulip queue workers that are leaking memory and thus have a high vsize
datafile=$(mktemp)

# We expect other Nagios checks to monitor for whether no queue
# workers are running, so we give that condition a pass
processes=$(pgrep -xf 'python.* /home/zulip/deployments/current/manage.py process_queue .*')
if [ -z "$processes" ]; then
    echo "No workers running"
    exit 0
fi
mapfile -t processes <<<"$processes"
ps -o vsize,size,pid,user,command --sort -vsize "${processes[@]}" >"$datafile"
cat "$datafile"
top_worker=$(head -n2 "$datafile" | tail -n1)
top_worker_memory_usage=$(echo "$top_worker" | cut -f1 -d" ")
rm -f "$datafile"
if [ "$top_worker_memory_usage" -gt 800000 ]; then
    exit 2
elif [ "$top_worker_memory_usage" -gt 600000 ]; then
    exit 1
else
    exit 0
fi
```

--------------------------------------------------------------------------------

---[FILE: check_debian_packages]---
Location: zulip-main/puppet/zulip/files/nagios_plugins/zulip_base/check_debian_packages

```text
#!/usr/bin/perl -w
#
# check_debian_packages - nagios plugin
#
#
# Copyright (C) 2005 Francesc Guasch
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
#
# Report bugs to: frankie@etsetb.upc.edu
#
use strict;
use lib '/usr/lib/nagios/plugins';
use utils qw(%ERRORS &print_revision &support &usage);
use Getopt::Long;

my $VERSION = '0.06';

my $RET = 'OK';
my $LOCK_FILE = "/var/lib/dpkg/lock";
my $CMD_APT = "/usr/bin/apt-get -s upgrade";
my $TIMEOUT = 60;
my $DEBUG	= 0;

#####################################################################
#
# Command line arguments
#

sub print_usage ();

my ($help,$version);
GetOptions(    help => \$help,
			  debug => \$DEBUG,
		    version => \$version,
		'timeout=s' => \$TIMEOUT
);
my ($PROGNAME) = $0 =~ m#.*/(.*)#;

if ($help) {
	print_revision($PROGNAME,"\$Revision: $VERSION \$");
	print "Copyright (c) 2005 Francesc Guasch - Ortiz

	Perl Check debian packages plugin for Nagios

";
	print_usage();
	exit($ERRORS{OK});
}

if ($version) {
	print_revision($PROGNAME,"\$Revision: $VERSION \$");
	exit($ERRORS{OK});
}

#
# unlikely but compliant
#
$SIG{'ALRM'} = sub {
	print ("ERROR: Timeout\n");
	exit $ERRORS{"UNKNOWN"};
};
alarm($TIMEOUT);


######################################################################
#
# subs
#

sub print_usage () {
	print "Usage: $PROGNAME [--debug] [--version] [--help]"
			." [--timeout=$TIMEOUT]\n";
}

sub add_info {
	my ($info,$type,$pkg) = @_;
	$$info .= scalar(keys %$pkg)." new pkgs in $type: ";
	if (keys %$pkg< 5 ) {
		$$info .= join " ",keys %$pkg;
	} else {
		my $alguns = join " ",keys %$pkg;
		$alguns = substr($alguns,0,80);
		$alguns .= "...";
		$$info .= $alguns;
	}
}

sub exit_unknown {
	my ($info) = @_;
	chomp $info;
    $RET='UNKNOWN';
    print "$RET: $info\n";
    exit $ERRORS{$RET};
};

sub run_apt {
	my ($pkg,$ver,$type,$release);
	open APT,"$CMD_APT 2>&1|" or exit_unknown($!);
	my (%stable,%security,%other);
	while (<APT>) {
		print "APT: $_" if $DEBUG;
		exit_unknown($_) if /(Could not open lock file)|(Could not get lock)/;
		next unless /^Inst/;
		($pkg,$ver,$release) = /Inst (.*?) .*\((.*?) (.*?)\)/;
		print "$_\npkg=$pkg ver=$ver release=$release\n" if $DEBUG;
		die "$_\n" unless defined $release;
		$release = 'stable'  
				if $release =~ /stable$/ && $release !~/security/i;
		$release = 'security' 
				if $release =~ /security/i;
		if ($release eq 'stable') {
			$stable{$pkg} = $ver;
		} elsif ($release eq 'security') {
			$security{$pkg} = $ver;
		} else {
			$other{$pkg}=$ver;
		}
	}
	close APT;
	my $info = '';
	if (keys (%security)) {
		$RET = 'CRITICAL';
		add_info(\$info,'security',\%security);
	} elsif (keys (%other) or keys(%stable)) {
    	$RET = 'WARNING';
		add_info(\$info,'stable',\%stable);
		add_info(\$info,'other',\%other) if keys %other;
	}
	print "$RET: $info\n";
}

run_apt();
exit $ERRORS{$RET};
```

--------------------------------------------------------------------------------

---[FILE: check_postgresql_replication_lag]---
Location: zulip-main/puppet/zulip/files/nagios_plugins/zulip_postgresql/check_postgresql_replication_lag

```text
#!/usr/bin/env python3

"""Nagios plugin to check the difference between the primary and
replica PostgreSQL servers' xlog location.  Requires that the user this
connects to PostgreSQL as has been granted the `pg_monitor` role.

This can only use stdlib modules from python.
"""

import configparser
import re
import subprocess
import sys


def get_config(
    config_file: configparser.RawConfigParser,
    section: str,
    key: str,
    default_value: str = "",
) -> str:
    if config_file.has_option(section, key):
        return config_file.get(section, key)
    return default_value


config_file = configparser.RawConfigParser()
config_file.read("/etc/zulip/zulip.conf")

states = {
    "OK": 0,
    "WARNING": 1,
    "CRITICAL": 2,
    "UNKNOWN": 3,
}

MAXSTATE = 0


def report(state: str, msg: str) -> None:
    global MAXSTATE
    print(f"{state}: {msg}")
    MAXSTATE = max(MAXSTATE, states[state])


def run_sql_query(query: str) -> list[list[str]]:
    command = [
        "psql",
        "-t",  # Omit header line
        "-A",  # Don't pad with spaces
        "-z",  # Separate columns with nulls
        "-v",
        "ON_ERROR_STOP=1",
        "-d",
        get_config(config_file, "postgresql", "database_name", "zulip"),
        # No -U; nagios connects as itself
        "-c",
        f"SELECT {query}",
    ]
    try:
        output = subprocess.check_output(command, stderr=subprocess.STDOUT, text=True).strip()
        if not output:
            return []
        return [x.split("\0") for x in output.split("\n")]
    except subprocess.CalledProcessError as e:
        report("CRITICAL", f"psql failed: {e}: {e.output}")
        sys.exit(MAXSTATE)


def loc_to_abs_offset(loc_str: str) -> int:
    m = re.match(r"^\s*([0-9a-fA-F]+)/([0-9a-fA-F]+)\s*$", loc_str)
    if not m:
        raise ValueError("Unknown xlog location format: " + loc_str)
    (xlog_file, file_offset) = (m.group(1), m.group(2))

    # From PostgreSQL 9.2's pg_xlog_location_diff:
    #   result = XLogFileSize * (xlogid1 - xlogid2) + xrecoff1 - xrecoff2
    # Taking xlogid2 and xrecoff2 to be zero to get the absolute offset:
    #   result = XLogFileSize * xlogid1 + xrecoff1
    #
    # xlog_internal.h says:
    #   #define XLogSegSize ((uint32) XLOG_SEG_SIZE)
    #   #define XLogSegsPerFile (((uint32) 0xffffffff) / XLogSegSize)
    #   #define XLogFileSize (XLogSegsPerFile * XLogSegSize)
    #
    # Since XLOG_SEG_SIZE is normally 16MB, XLogFileSize comes out to 0xFF000000
    return 0xFF000000 * int(xlog_file, 16) + int(file_offset, 16)


is_in_recovery = run_sql_query("pg_is_in_recovery()")

if is_in_recovery[0][0] == "t":
    replication_info = run_sql_query(
        "sender_host, status, pg_last_wal_replay_lsn(), pg_last_wal_receive_lsn()"
        " from pg_stat_wal_receiver"
    )
    if not replication_info:
        report("CRITICAL", "Replaying WAL logs from backups")
    else:
        (primary_server, state, replay_loc, recv_loc) = replication_info[0]
        recv_offset = loc_to_abs_offset(recv_loc)
        replay_lag = recv_offset - loc_to_abs_offset(replay_loc)

        if state != "streaming":
            report("CRITICAL", f"replica is in state {state}, not streaming")

        msg = f"replica is {replay_lag} bytes behind in replay of WAL logs from {primary_server}"
        if replay_lag > 5 * 16 * 1024**2:
            report("CRITICAL", msg)
        elif replay_lag > 16 * 1024**2:
            report("WARNING", msg)
        else:
            report("OK", msg)

else:
    replication_info = run_sql_query(
        "client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn from pg_stat_replication"
    )
    if not replication_info:
        report("CRITICAL", "No replicas!")
    elif len(replication_info) == 1:
        report("WARNING", "Only one replica!")
    else:
        report("OK", f"Found {len(replication_info)} replicas")

    for replica in replication_info:
        (client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn) = replica
        if state != "streaming":
            report("CRITICAL", f"replica {client_addr} is in state {state}, not streaming")

        sent_offset = loc_to_abs_offset(sent_lsn)
        lag: dict[str, int] = {}
        lag["write"] = sent_offset - loc_to_abs_offset(write_lsn)
        lag["flush"] = sent_offset - loc_to_abs_offset(flush_lsn)
        lag["replay"] = sent_offset - loc_to_abs_offset(replay_lsn)
        for lag_type in ("write", "flush", "replay"):
            lag_bytes = lag[lag_type]
            msg = f"replica {client_addr} is {lag_bytes} bytes behind in {lag_type} of WAL logs"
            if lag_bytes > 5 * 16 * 1024**2:
                report("CRITICAL", msg)
            elif lag_bytes > 16 * 1024**2:
                report("WARNING", msg)
            else:
                report("OK", msg)

sys.exit(MAXSTATE)
```

--------------------------------------------------------------------------------

````

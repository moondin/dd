---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 440
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 440 of 1290)

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

---[FILE: dhparam.pem]---
Location: zulip-main/puppet/zulip/files/nginx/dhparam.pem

```text
-----BEGIN DH PARAMETERS-----
MIIBCAKCAQEA//////////+t+FRYortKmq/cViAnPTzx2LnFg84tNpWp4TZBFGQz
+8yTnc4kmz75fS/jY2MMddj2gbICrsRhetPfHtXV/WVhJDP1H18GbtCFY2VVPe0a
87VXE15/V8k1mE8McODmi3fipona8+/och3xWKE2rec1MKzKT0g6eXq8CrGCsyT7
YdEIqUuyyOP7uWrat2DX9GgdT0Kj3jlN9K5W7edjcrsZCwenyO4KbXCeAvzhzffi
7MA0BM0oNC9hkXL+nOmFg/+OTxIy7vKBg8P+OxtMb61zO7X8vC7CIAXFjvGDfRaD
ssbzSibBsu/6iGtCOGEoXJf//////////wIBAg==
-----END DH PARAMETERS-----
```

--------------------------------------------------------------------------------

---[FILE: uwsgi_params]---
Location: zulip-main/puppet/zulip/files/nginx/uwsgi_params

```text
uwsgi_param QUERY_STRING    $query_string;
uwsgi_param REQUEST_METHOD  $request_method;
uwsgi_param CONTENT_TYPE    $content_type;
uwsgi_param CONTENT_LENGTH  $content_length;
uwsgi_param REQUEST_URI     $request_uri;
uwsgi_param PATH_INFO       $document_uri;
uwsgi_param DOCUMENT_ROOT   $document_root;
uwsgi_param SERVER_PROTOCOL $server_protocol;
uwsgi_param REQUEST_SCHEME  $scheme;
uwsgi_param HTTPS           $https if_not_empty;
uwsgi_param REMOTE_ADDR     $remote_addr;
uwsgi_param REMOTE_PORT     $remote_port;
uwsgi_param SERVER_ADDR     $server_addr;
uwsgi_param SERVER_PORT     $server_port;
uwsgi_param SERVER_NAME     $server_name;
uwsgi_param HTTP_X_REAL_IP  $remote_addr;
uwsgi_param HTTP_X_FORWARDED_PROTO $trusted_x_forwarded_proto;
uwsgi_param HTTP_X_FORWARDED_SSL "";
uwsgi_param HTTP_X_PROXY_MISCONFIGURATION $x_proxy_misconfiguration;

# This value is the default, and is provided for explicitness; it must
# be longer than the configured 55s "harakiri" timeout in uwsgi
uwsgi_read_timeout 60s;

uwsgi_pass django;
```

--------------------------------------------------------------------------------

---[FILE: camo.conf]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-app.d/camo.conf

```text
# Proxies /external_content to a local installation of the camo image
# proxy software.  Because camo serves its metrics at /metrics,
# explicitly 404 that to external requests.
location /external_content/metrics {
    return 404;
}
location /external_content {
    rewrite /external_content/(.*) /$1 break;
    proxy_pass http://camo;
    include /etc/nginx/zulip-include/proxy;
}
```

--------------------------------------------------------------------------------

---[FILE: external-sso.conf]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-app.d/external-sso.conf

```text
# Use this when you have a server listening on localhost that is serving Zulip
# with some sort of authentication middleware installed. The proxied-to server
# should pass REMOTE_USER to /accounts/login/sso/ once it has satisfactorily
# identified the user.
location /accounts/login/sso/ {
    proxy_pass https://localhost_sso;
    include /etc/nginx/zulip-include/proxy;
}
```

--------------------------------------------------------------------------------

---[FILE: keepalive-loadbalancer.conf]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-app.d/keepalive-loadbalancer.conf

```text
# This file should be used if the nginx is behind a dedicated
# loadbalancer.  This allows nginx to be configured for long
# keep-alive timeouts, to keep connections open to the loadbalancer.
#
# All timeouts here should be _longer_ than those on the loadbalancer.
# This ensures that there cannot be a race condition between nginx
# deciding to shut down the connection, and the load-balancer sending
# a request, resulting in a 502 from the loadbalancer.
#
# The timeouts on the loadbalancer are assumed to be 20min (1200s) or
# less; these timeouts are hence for 21min.

keepalive_timeout     1260;
client_header_timeout 1260;
client_body_timeout   1260;

keepalive_requests     500;
```

--------------------------------------------------------------------------------

---[FILE: api_headers]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-common/api_headers

```text
include /etc/nginx/zulip-include/headers;
add_header Access-Control-Allow-Origin * always;
add_header Access-Control-Allow-Headers Authorization always;
add_header Access-Control-Allow-Methods 'GET, POST, DELETE, PUT, PATCH, HEAD' always;
```

--------------------------------------------------------------------------------

---[FILE: certbot]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-common/certbot

```text
# Directory needed for certbot --webroot to work.
location /.well-known/acme-challenge/ {
    alias /var/lib/zulip/certbot-webroot/.well-known/acme-challenge/;
}
```

--------------------------------------------------------------------------------

---[FILE: headers]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-common/headers

```text
# Enable HSTS: tell browsers to always use HTTPS
add_header Strict-Transport-Security max-age=15768000 always;

# Set X-Frame-Options to deny to prevent clickjacking
add_header X-Frame-Options DENY always;

add_header X-Content-Type-Options nosniff;
```

--------------------------------------------------------------------------------

---[FILE: proxy]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-common/proxy

```text
proxy_http_version 1.1;
# Clearing the Connection header is required for keepalives from the load balancer
# http://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive
proxy_set_header Connection "";
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-Proto $trusted_x_forwarded_proto;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Real-Ip $remote_addr;
proxy_set_header X-Proxy-Misconfiguration $x_proxy_misconfiguration;
proxy_next_upstream off;
proxy_redirect off;
```

--------------------------------------------------------------------------------

---[FILE: proxy_longpolling]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-common/proxy_longpolling

```text
include /etc/nginx/zulip-include/proxy;
proxy_buffering off;
proxy_read_timeout 1200;
```

--------------------------------------------------------------------------------

---[FILE: tornado_cors_headers]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-common/tornado_cors_headers

```text
include /etc/nginx/zulip-include/headers;
add_header Access-Control-Allow-Origin * always;
add_header Access-Control-Allow-Headers Authorization always;
add_header Access-Control-Allow-Methods 'OPTIONS, GET, DELETE' always;
```

--------------------------------------------------------------------------------

---[FILE: app]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-frontend/app

```text
access_log /var/log/nginx/access.log combined_with_host_and_time;
error_log /var/log/nginx/error.log;

include /etc/nginx/zulip-include/headers;

# Serve a custom error page when the app is down
error_page 502 503 504 /static/webpack-bundles/5xx.html;

# Serve static files directly
location /local-static {
    alias /home/zulip/local-static;
}
location /static/ {
    alias /home/zulip/prod-static/;
    gzip_static on;
    include /etc/nginx/zulip-include/headers;
    add_header Access-Control-Allow-Origin *;
    add_header Timing-Allow-Origin *;

    # Set a nonexistent path, so we just serve the nice Django 404 page.
    error_page 404 /django_static_404.html;

    # These files are hashed and thus immutable; cache them aggressively.
    # Django adds 12 hex digits; Webpack adds 20.
    location ~ '\.[0-9a-f]{12}\.|[./][0-9a-f]{20}\.' {
        include /etc/nginx/zulip-include/headers;
        add_header Access-Control-Allow-Origin *;
        add_header Timing-Allow-Origin *;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}

# Canonical URL for the root is /help/.
location = /help {
    return 301 /help/;
}

# Redirect to links without the trailing slash except for root /help/.
location ~ ^(/help(?:/[^/]+)+)/+$ {
    return 301 $1$is_args$args;
}

# Serve help center generated by astro/starlight.
location /help {
    alias $help_alias;

    gzip_static on;
    include /etc/nginx/zulip-include/headers;
    add_header Access-Control-Allow-Origin *;
    add_header Timing-Allow-Origin *;

    error_page 404 /404.html;
    index /index.html;
    try_files $uri $uri/index.html =404;

    # These files are hashed and thus immutable; cache them aggressively.
    # https://github.com/Pagefind/pagefind/issues/747#issuecomment-2510564644
    location ~ ^/help/(pagefind/.*\.(?:pf_fragment|pf_index|pf_meta))$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # These files are hashed and thus immutable; cache them aggressively.
    # https://github.com/withastro/docs/blob/53603ad048e8aedbca1aed77bac8eb00dcada79d/src/content/docs/en/guides/integrations-guide/node.mdx?plain=1#L304
    location /help/_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}

# Send longpoll requests to Tornado
location /json/events {
    if ($request_method = 'OPTIONS') {
        # add_header does not propagate into/out of blocks, so this
        # include cannot be factored out
        include /etc/nginx/zulip-include/headers;
        add_header Allow 'OPTIONS, GET, DELETE' always;
        return 204;
    }

    if ($request_method !~ ^(GET|DELETE)$ ) {
        # add_header does not propagate into/out of blocks, so this
        # include cannot be factored out
        include /etc/nginx/zulip-include/headers;
        add_header Allow 'OPTIONS, GET, DELETE' always;
        return 405;
    }

    proxy_pass $tornado_server;
    include /etc/nginx/zulip-include/proxy_longpolling;
}

# Send longpoll requests to Tornado
location /api/v1/events {

    if ($request_method = 'OPTIONS') {
        include /etc/nginx/zulip-include/tornado_cors_headers;
        add_header Allow 'OPTIONS, GET, DELETE' always;
        return 204;
    }

    if ($request_method !~ ^(GET|DELETE)$ ) {
        include /etc/nginx/zulip-include/headers;
        add_header Allow 'OPTIONS, GET, DELETE' always;
        return 405;
    }

    include /etc/nginx/zulip-include/tornado_cors_headers;
    proxy_pass $tornado_server;
    include /etc/nginx/zulip-include/proxy_longpolling;
}

# Handle X-Accel-Redirect from Tornado to Tornado
location ~ ^/internal/tornado/(\d+)(/.*)$ {
    internal;
    proxy_pass http://tornado$1$2$is_args$args;
    include /etc/nginx/zulip-include/proxy_longpolling;
}

location /api/v1/tus {
    include /etc/nginx/zulip-include/api_headers;
    include /etc/nginx/zulip-include/proxy;
    # https://github.com/tus/tusd/blob/main/examples/nginx.conf
    # Disable request body size limits, and stream the request and
    # response from tusd directly.
    client_max_body_size    0;
    proxy_request_buffering off;
    proxy_buffering         off;
    proxy_pass              http://tusd;
}

# Send everything else to Django via uWSGI
location / {
    include uwsgi_params;
}

# These Django routes not under /api are shared between mobile and
# web, and thus need API headers added.  We can't easily collapse
# these blocks with the /api block, because regular expressions take
# priority over paths in nginx's order-of-operations, and we don't
# want to override the tornado configuration for /api/v1/events.
location /thumbnail {
    include /etc/nginx/zulip-include/api_headers;

    include uwsgi_params;
}
location /avatar {
    include /etc/nginx/zulip-include/api_headers;

    include uwsgi_params;
}
location /user_uploads {
    include /etc/nginx/zulip-include/api_headers;

    include uwsgi_params;
}

location /api/internal/ {
    # These only need be accessed from localhost
    allow 127.0.0.1;
    allow ::1;
    deny all;

    include /etc/nginx/zulip-include/api_headers;
    include uwsgi_params;
}

# Send all API routes not covered above to Django via uWSGI
location /api/ {
    include /etc/nginx/zulip-include/api_headers;

    include uwsgi_params;
}

include /etc/nginx/zulip-include/app.d/*.conf;
```

--------------------------------------------------------------------------------

---[FILE: uploads-internal.conf]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-frontend/uploads-internal.conf

```text
# Handle redirects to S3
location ~ ^/internal/s3/(?<s3_hostname>[^/]+)/(?<s3_path>.*) {
    internal;
    include /etc/nginx/zulip-include/headers;
    add_header Content-Security-Policy "default-src 'none'; media-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; object-src 'self'; plugin-types application/pdf;";

    # The components of this path are originally double-URI-escaped
    # (see zerver/view/upload.py).  "location" matches are on
    # unescaped values, which fills $s3_path with a properly
    # single-escaped path to pass to the upstream server.
    # (see associated commit message for more details)
    set $download_url https://$s3_hostname/$s3_path;
    proxy_set_header Host $s3_hostname;
    proxy_ssl_name $s3_hostname;
    proxy_ssl_server_name on;

    # Strip off X-amz-cf-id header, which otherwise the request has to
    # have been signed over, leading to signature mismatches.
    proxy_set_header x-amz-cf-id "";

    # Strip off any auth request headers which the Zulip client might
    # have sent, as they will not work for S3, and will report an error due
    # to the signed auth header we also provide.
    proxy_set_header Authorization "";
    proxy_set_header x-amz-security-token "";

    # These headers are only valid if there is a body, but better to
    # strip them to be safe.
    proxy_set_header Content-Length "";
    proxy_set_header Content-Type "";
    proxy_set_header Content-MD5 "";
    proxy_set_header x-amz-content-sha256 "";
    proxy_set_header Expect "";

    # Ensure that we only get _one_ of these response headers: the one
    # that Django added, not the one from S3.
    proxy_hide_header Cache-Control;
    proxy_hide_header Expires;
    proxy_hide_header Set-Cookie;
    # We are _leaving_ S3 to provide Content-Type,
    # Content-Disposition, and Accept-Ranges headers, which are the
    # three remaining headers which nginx would also pass through from
    # the first response.  Django explicitly unsets the first, and
    # does not set the latter two.

    # We slice the content into 5M chunks; this means that the client
    # doesn't need to wait for nginx to download and cache the full
    # content if the client just requested a small range (e.g. for
    # showing a thumbnail of a large video).  5M is chosen to be
    # enough for videos to be able to thumbnail in one slice, but not
    # take overly long to retrieve from S3, or cause overwhelming
    # numbers of cache entries for large files.
    slice 5m;
    proxy_set_header Range $slice_range;

    proxy_pass $download_url$is_args$args;
    proxy_cache uploads;
    # If the S3 response doesn't contain Cache-Control headers (which
    # we don't expect it to) then we assume they are valid for a very
    # long time.  The size of the cache is controlled by
    # `s3_disk_cache_size` and read frequency, set via
    # `s3_cache_inactive_time`.
    proxy_cache_valid 200 206 1y;

    # We only include the requested content-disposition (and range
    # slice) in the cache key, so that we cache "Content-Disposition:
    # attachment" separately from the inline version.
    proxy_cache_key $download_url$s3_disposition_cache_key$slice_range;
}

# Internal file-serving
location /internal/local/uploads {
    internal;
    include /etc/nginx/zulip-include/headers;
    add_header Content-Security-Policy "default-src 'none'; media-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; object-src 'self'; plugin-types application/pdf;";

    # Django handles setting Content-Type, Content-Disposition, and Cache-Control.

    alias /home/zulip/uploads/files;
}

location /internal/local/user_avatars {
    internal;
    include /etc/nginx/zulip-include/headers;
    add_header Content-Security-Policy "default-src 'none' img-src 'self'";
    include /etc/nginx/zulip-include/uploads.types;
    alias /home/zulip/uploads/avatars;
}
```

--------------------------------------------------------------------------------

---[FILE: uploads.types]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-frontend/uploads.types

```text
types {
    text/plain                            txt;

    application/pdf                       pdf;

    image/gif                             gif;
    image/jpeg                            jpeg jpg jpe;
    image/png                             png;
    image/tiff                            tif tiff;
    image/webp                            webp;

    video/3gpp                            3gpp 3gp;
    video/mp4                             mp4;
    video/mpeg                            mpeg mpg;
    video/quicktime                       mov;
    video/webm                            webm;
    video/x-flv                           flv;
    video/x-m4v                           m4v;
    video/x-mng                           mng;
    video/x-ms-asf                        asx asf;
    video/x-ms-wmv                        wmv;
    video/x-msvideo                       avi;
}
```

--------------------------------------------------------------------------------

---[FILE: upstreams]---
Location: zulip-main/puppet/zulip/files/nginx/zulip-include-frontend/upstreams

```text
include /etc/nginx/zulip-include/tornado-upstreams;

upstream django {
    server unix:/home/zulip/deployments/uwsgi-socket;
}

upstream localhost_sso {
    server 127.0.0.1:8888;
}

upstream camo {
    server 127.0.0.1:9292;
}

upstream tusd {
    server 127.0.0.1:9900;
}
```

--------------------------------------------------------------------------------

---[FILE: centos_pg_hba.conf]---
Location: zulip-main/puppet/zulip/files/postgresql/centos_pg_hba.conf

```text
# PostgreSQL Client Authentication Configuration File
# ===================================================
#
# Refer to the "Client Authentication" section in the PostgreSQL
# documentation for a complete description of this file.  A short
# synopsis follows.
#
# This file controls: which hosts are allowed to connect, how clients
# are authenticated, which PostgreSQL user names they can use, which
# databases they can access.  Records take one of these forms:
#
# local      DATABASE  USER  METHOD  [OPTIONS]
# host       DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
# hostssl    DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
# hostnossl  DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
#
# (The uppercase items must be replaced by actual values.)
#
# The first field is the connection type: "local" is a Unix-domain
# socket, "host" is either a plain or SSL-encrypted TCP/IP socket,
# "hostssl" is an SSL-encrypted TCP/IP socket, and "hostnossl" is a
# plain TCP/IP socket.
#
# DATABASE can be "all", "sameuser", "samerole", "replication", a
# database name, or a comma-separated list thereof. The "all"
# keyword does not match "replication". Access to replication
# must be enabled in a separate record (see example below).
#
# USER can be "all", a user name, a group name prefixed with "+", or a
# comma-separated list thereof.  In both the DATABASE and USER fields
# you can also write a file name prefixed with "@" to include names
# from a separate file.
#
# ADDRESS specifies the set of hosts the record matches.  It can be a
# host name, or it is made up of an IP address and a CIDR mask that is
# an integer (between 0 and 32 (IPv4) or 128 (IPv6) inclusive) that
# specifies the number of significant bits in the mask.  A host name
# that starts with a dot (.) matches a suffix of the actual host name.
# Alternatively, you can write an IP address and netmask in separate
# columns to specify the set of hosts.  Instead of a CIDR-address, you
# can write "samehost" to match any of the server's own IP addresses,
# or "samenet" to match any address in any subnet that the server is
# directly connected to.
#
# METHOD can be "trust", "reject", "md5", "password", "scram-sha-256",
# "gss", "sspi", "ident", "peer", "pam", "ldap", "radius" or "cert".
# Note that "password" sends passwords in clear text; "md5" or
# "scram-sha-256" are preferred since they send encrypted passwords.
#
# OPTIONS are a set of options for the authentication in the format
# NAME=VALUE.  The available options depend on the different
# authentication methods -- refer to the "Client Authentication"
# section in the documentation for a list of which options are
# available for which authentication methods.
#
# Database and user names containing spaces, commas, quotes and other
# special characters must be quoted.  Quoting one of the keywords
# "all", "sameuser", "samerole" or "replication" makes the name lose
# its special character, and just match a database or username with
# that name.
#
# This file is read on server startup and when the server receives a
# SIGHUP signal.  If you edit the file on a running system, you have to
# SIGHUP the server for the changes to take effect, run "pg_ctl reload",
# or execute "SELECT pg_reload_conf()".
#
# Put your actual configuration here
# ----------------------------------
#
# If you want to allow non-local connections, you need to add more
# "host" records.  In that case you will also need to make PostgreSQL
# listen on a non-local interface via the listen_addresses
# configuration parameter, or via the -i or -h command line switches.



# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            ident
host    replication     all             ::1/128                 ident
```

--------------------------------------------------------------------------------

---[FILE: env-wal-g]---
Location: zulip-main/puppet/zulip/files/postgresql/env-wal-g

```text
#!/bin/sh
if [ -z "$ZULIP_SECRETS_CONF" ]; then
    ZULIP_SECRETS_CONF=/etc/zulip/zulip-secrets.conf
fi

export PGHOST=/var/run/postgresql/

WALG_DELTA_MAX_STEPS=$(crudini --get /etc/zulip/zulip.conf postgresql backups_incremental 2>/dev/null)
export WALG_DELTA_MAX_STEPS

WALG_COMPRESSION_METHOD=$(crudini --get /etc/zulip/zulip.conf postgresql backups_compression_method 2>/dev/null)
export WALG_COMPRESSION_METHOD

s3_backups_bucket=$(crudini --get "$ZULIP_SECRETS_CONF" secrets s3_backups_bucket 2>/dev/null)

if [ "$s3_backups_bucket" != "" ] || [ -n "$WALG_S3_PREFIX" ]; then
    AWS_REGION=$(crudini --get "$ZULIP_SECRETS_CONF" secrets s3_region 2>/dev/null)
    if [ "$AWS_REGION" = "" ]; then
        # Fall back to the current region, if possible
        AZ=$(ec2metadata --availability-zone || true)
        if [ -n "$AZ" ] && [ "$AZ" != "unavailable" ]; then
            AWS_REGION=$(echo "$AZ" | sed 's/.$//')
        fi
    fi
    export AWS_REGION
    AWS_ACCESS_KEY_ID=$(crudini --get "$ZULIP_SECRETS_CONF" secrets s3_backups_key 2>/dev/null)
    export AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY=$(crudini --get "$ZULIP_SECRETS_CONF" secrets s3_backups_secret_key 2>/dev/null)
    export AWS_SECRET_ACCESS_KEY
    : "${WALG_S3_PREFIX:=s3://$s3_backups_bucket}"
    export WALG_S3_PREFIX

    if storage_class=$(crudini --get /etc/zulip/zulip.conf postgresql backups_storage_class 2>&1); then
        export WALG_S3_STORAGE_CLASS="$storage_class"
    fi
else
    WALG_FILE_PREFIX=$(crudini --get /etc/zulip/zulip.conf postgresql backups_directory 2>/dev/null)
    if [ "$WALG_FILE_PREFIX" != "" ]; then
        export WALG_FILE_PREFIX
        if [ "$WALG_DELTA_MAX_STEPS" = "" ]; then
            # Default to only taking a full backup every week
            export WALG_DELTA_MAX_STEPS=6
        fi

    else
        echo "Could not determine where to back up data to!"
        exit 1
    fi
fi

exec /usr/local/bin/wal-g "$@"
```

--------------------------------------------------------------------------------

---[FILE: pg_backup_and_purge]---
Location: zulip-main/puppet/zulip/files/postgresql/pg_backup_and_purge

```text
#!/usr/bin/env python3
import configparser
import glob
import json
import logging
import os
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone

import dateutil.parser

logging.Formatter.converter = time.gmtime
logging.basicConfig(format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


config_file = configparser.RawConfigParser()
config_file.read("/etc/zulip/zulip.conf")


def get_config(
    section: str,
    key: str,
    default_value: str = "",
) -> str:
    if config_file.has_option(section, key):
        return config_file.get(section, key)
    return default_value


replicas = subprocess.check_output(
    ["psql", "-v", "ON_ERROR_STOP=1", "-t", "-c", "SELECT COUNT(*) FROM pg_stat_replication"],
    stdin=subprocess.DEVNULL,
    text=True,
).strip()
if int(replicas) > 0:
    # We are the primary and we have replicas; we expect that backups
    # will be taken on one of them.
    sys.exit(0)

skip_backups = get_config("postgresql", "skip_backups", "")
if skip_backups.lower() in [1, "y", "t", "yes", "true", "enable", "enabled"]:
    sys.exit(0)

is_rhel_based = os.path.exists("/etc/redhat-release")
if is_rhel_based:
    pg_data_paths = glob.glob("/var/lib/pgsql/*/data")
else:
    pg_data_paths = glob.glob("/var/lib/postgresql/*/main")
if len(pg_data_paths) != 1:
    print(f"PostgreSQL installation is not unique: {pg_data_paths}")
    sys.exit(1)
pg_data_path = pg_data_paths[0]

disk_concurrency = get_config("postgresql", "backups_disk_concurrency", "1")
env = os.environ.copy()
env["WALG_UPLOAD_DISK_CONCURRENCY"] = disk_concurrency
subprocess.check_call(["env-wal-g", "backup-push", pg_data_path], env=env)

data = json.loads(subprocess.check_output(["env-wal-g", "backup-list", "--json"]))
backups = {dateutil.parser.parse(backup["time"]): backup["backup_name"] for backup in data}

one_month_ago = datetime.now(tz=timezone.utc) - timedelta(days=30)
for date in sorted(backups.keys(), reverse=True):
    if date < one_month_ago:
        # We pass `FIND_FULL` such that if delta backups are being
        # used, we keep the prior FULL backup and all of the deltas
        # that we need.  In practice, this means that if we're doing
        # weekly full backups (`backups_incremental = 6`), we only
        # delete any data once a week.
        subprocess.check_call(
            ["env-wal-g", "delete", "--confirm", "before", "FIND_FULL", backups[date]]
        )
        # Because we're going from most recent to least recent, we
        # only have to do one delete operation
        break
```

--------------------------------------------------------------------------------

---[FILE: process_fts_updates]---
Location: zulip-main/puppet/zulip/files/postgresql/process_fts_updates

```text
#!/usr/bin/env python3
# Processes updates to PostgreSQL full-text search for new/edited messages.
#
# Zulip manages its PostgreSQL full-text search as follows.  When the
# content of a message is modified, a PostgreSQL trigger logs the
# message ID to the `fts_update_log` table.  In the background, this
# program processes `fts_update_log`, updating the PostgreSQL full-text
# search column search_tsvector in the main zerver_message.
#
# There are four cases this has to cover:
#
# 1. Running in development, with a venv but no
#    /home/zulip/deployments/current nor /etc/zulip/zulip.conf
#
# 2. Running in production, with postgresql on the same machine as the
#    frontend, with a venv and both /home/zulip/deployments/current
#    and /etc/zulip/zulip.conf
#
# 3. Running in production, on a postgresql machine which is not the
#    frontend, with a /etc/zulip/zulip.conf but no venv nor
#    /home/zulip/deployments/current
#
# 4. Running in production, on an application frontend server connected
#    to a remote postgresql server, because we cannot run code _on_ the
#    PostgreSQL server, such as in docker-zulip.
#
# Because of case (3), we cannot rely on functions from outside this
# file (e.g. provided by scripts.lib.zulip_tools).  For case (1),
# however, we wish to import `zerver.settings` since we have no
# /etc/zulip/zulip.conf to read, and that case _requires_ loading the
# venv.
#
# We also must handle the cases where we are run as the `nagios` user,
# which may not have permission to read all configuration files, and
# thus (2) will look like (3).

import argparse
import configparser
import logging
import os
import select
import sys
import time
from collections.abc import Sequence

import psycopg2
import psycopg2.extensions
from psycopg2.sql import SQL

BATCH_SIZE = 1000

parser = argparse.ArgumentParser()
parser.add_argument("--quiet", action="store_true")
parser.add_argument("--nagios-check", action="store_true")
parser.add_argument("--nagios-user")
options = parser.parse_args()

logging.Formatter.converter = time.gmtime
logging.basicConfig(format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger("process_fts_updates")
if options.quiet:
    logger.setLevel(logging.INFO)
else:
    logger.setLevel(logging.DEBUG)


def update_fts_columns(conn: psycopg2.extensions.connection) -> int:
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT id, message_id FROM fts_update_log ORDER BY id LIMIT %s FOR UPDATE SKIP LOCKED",
            (BATCH_SIZE,),
        )
        cursor.arraysize = BATCH_SIZE
        parts = list(zip(*cursor.fetchmany(), strict=True))
        if not parts:
            row_ids: Sequence[int] = []
            message_ids: Sequence[int] = []
        else:
            row_ids, message_ids = parts[0], parts[1]

        if message_ids:
            if USING_PGROONGA:
                update_sql = SQL(
                    "search_pgroonga = escape_html(subject) || ' ' || rendered_content"
                )
            else:
                update_sql = SQL(
                    "search_tsvector = to_tsvector('zulip.english_us_search', subject || rendered_content)"
                )
            cursor.execute(
                SQL(
                    "UPDATE zerver_message SET {update_sql} "
                    "WHERE ctid IN ("
                    "  SELECT ctid FROM zerver_message"
                    "  WHERE id IN %s"
                    "  ORDER BY id FOR UPDATE"
                    ")"
                ).format(update_sql=update_sql),
                (message_ids,),
            )
        if row_ids:
            cursor.execute("DELETE FROM fts_update_log WHERE id IN %s", (row_ids,))
        conn.commit()
        return len(row_ids)


def update_all_rows(msg: str, conn: psycopg2.extensions.connection) -> None:
    while True:
        start_time = time.perf_counter()
        rows_updated = update_fts_columns(conn)
        if rows_updated:
            logger.log(
                logging.INFO,
                "process_fts_updates: %s %d rows, %d rows/sec",
                msg,
                rows_updated,
                rows_updated / (time.perf_counter() - start_time),
            )

        if rows_updated != BATCH_SIZE:
            return


def am_master(conn: psycopg2.extensions.connection) -> bool:
    with conn.cursor() as cursor:
        cursor.execute("SELECT pg_is_in_recovery()")
        return not cursor.fetchall()[0][0]


def get_config(
    config_file: configparser.RawConfigParser,
    section: str,
    key: str,
    default_value: str = "",
) -> str:
    if config_file.has_option(section, key):
        return config_file.get(section, key)
    return default_value


pg_args = {}

USING_PGROONGA = False
try:
    # Case (1); we insert the path to the development root.
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")))

    # Cases (2) and (4); we insert the path to the production root.
    # This likely works out the same as the above path.
    #
    # We insert this path after the above, so that if running this
    # command from a specific non-current Zulip deployment, we prefer
    # that deployment's libraries.
    sys.path.insert(1, "/home/zulip/deployments/current")

    # For cases (2) and (4), we also need to set up the virtualenv, so we
    # can read the Django settings.
    from scripts.lib.setup_path import setup_path

    setup_path()

    os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"
    from django.conf import settings

    pg_args["host"] = settings.DATABASES["default"]["HOST"]
    pg_args["port"] = settings.DATABASES["default"].get("PORT")
    pg_args["password"] = settings.DATABASES["default"].get("PASSWORD")
    pg_args["user"] = settings.DATABASES["default"]["USER"]
    pg_args["dbname"] = settings.DATABASES["default"]["NAME"]
    pg_args["sslmode"] = settings.DATABASES["default"]["OPTIONS"].get("sslmode")
    pg_args["connect_timeout"] = "600"
    USING_PGROONGA = settings.USING_PGROONGA
except (ImportError, PermissionError):
    # Case (3): we know that the PostgreSQL server is on this host.
    pg_args["user"] = "zulip"

    config_file = configparser.RawConfigParser()
    config_file.read("/etc/zulip/zulip.conf")

    if get_config(config_file, "machine", "pgroonga", "false").lower() in [
        "1",
        "y",
        "t",
        "yes",
        "true",
        "enable",
        "enabled",
    ]:
        USING_PGROONGA = True

    pg_args["user"] = get_config(config_file, "postgresql", "database_user", "zulip")
    if pg_args["user"] != "zulip":
        secrets_file = configparser.RawConfigParser()
        secrets_file.read("/etc/zulip/zulip-secrets.conf")
        pg_args["password"] = get_config(secrets_file, "secrets", "postgres_password")
        pg_args["host"] = "localhost"
    pg_args["dbname"] = get_config(config_file, "postgresql", "database_name", "zulip")

conn: psycopg2.extensions.connection | None

if options.nagios_check:
    # Nagios connects as itself, unless you specify otherwise
    if options.nagios_user:
        pg_args["user"] = options.nagios_user
    else:
        del pg_args["user"]
    # connection_factory=None lets mypy understand the return type
    conn = psycopg2.connect(connection_factory=None, **pg_args)
    cursor = conn.cursor()
    cursor.execute("SELECT count(*) FROM fts_update_log")
    num = cursor.fetchall()[0][0]

    # nagios exit codes
    states = {
        "OK": 0,
        "WARNING": 1,
        "CRITICAL": 2,
        "UNKNOWN": 3,
    }

    state = "OK"
    if num > 5:
        state = "CRITICAL"
    print(f"{state}: {num} rows in fts_update_log table")
    sys.exit(states[state])


conn = None

retries = 1

while True:
    try:
        if conn is None:
            # connection_factory=None lets mypy understand the return type
            conn = psycopg2.connect(connection_factory=None, **pg_args)
            retries = 30

            conn.autocommit = False
            conn.isolation_level = psycopg2.extensions.ISOLATION_LEVEL_READ_COMMITTED

            first_check = True
            while not am_master(conn):
                if first_check:
                    first_check = False
                    logger.warning("In recovery; sleeping")
                time.sleep(5)

            logger.debug("process_fts_updates: listening for search index updates")

            with conn.cursor() as cursor:
                cursor.execute("LISTEN fts_update_log;")
                conn.commit()

            # Catch up on any historical columns
            update_all_rows("Caught up", conn)

        if select.select([conn], [], [], 30) != ([], [], []):
            conn.poll()
            conn.notifies.clear()
            update_all_rows("Updated", conn)

    except psycopg2.OperationalError as e:
        # We will end up here if the database is restarted, or becomes read-only.
        retries -= 1
        if retries <= 0:
            raise
        logger.info(e.pgerror, exc_info=True)
        logger.info("Sleeping and reconnecting")
        time.sleep(5)
        if conn is not None:
            conn.close()
            conn = None
    except KeyboardInterrupt:
        print(sys.argv[0], "exited after receiving KeyboardInterrupt")
        break
```

--------------------------------------------------------------------------------

````

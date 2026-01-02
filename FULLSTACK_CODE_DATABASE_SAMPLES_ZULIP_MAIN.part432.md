---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 432
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 432 of 1290)

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

---[FILE: @uppy__utils.patch]---
Location: zulip-main/patches/@uppy__utils.patch

```text
diff --git a/lib/generateFileID.d.ts b/lib/generateFileID.d.ts
index c699b2453ff6d019b03509d65d66f8ffcb2c1be6..b83c4ffa9b7e7c2755416e8b7631d8971e9952d5 100644
--- a/lib/generateFileID.d.ts
+++ b/lib/generateFileID.d.ts
@@ -11,6 +11,6 @@ export default function generateFileID<M extends Meta, B extends Body>(file: Par
 export declare function getSafeFileId<M extends Meta, B extends Body>(file: Partial<Pick<UppyFile<M, B>, 'id' | 'type'>> & Pick<UppyFile<M, B>, 'data'> & (Pick<RemoteUppyFile<M, B>, 'isRemote' | 'remote'> | Pick<LocalUppyFile<M, B>, 'isRemote'>) & {
     meta?: {
         relativePath?: unknown;
-    };
+    } | undefined;
 }, instanceId: string): string;
 //# sourceMappingURL=generateFileID.d.ts.map
diff --git a/src/generateFileID.ts b/src/generateFileID.ts
index 53124860637e5b56dee7e5663a595c2e18d12410..7f6fcc4d8b1356ad26c03509d12186fa4363c31f 100644
--- a/src/generateFileID.ts
+++ b/src/generateFileID.ts
@@ -83,7 +83,7 @@ export function getSafeFileId<M extends Meta, B extends Body>(
     (
       | Pick<RemoteUppyFile<M, B>, 'isRemote' | 'remote'>
       | Pick<LocalUppyFile<M, B>, 'isRemote'>
-    ) & { meta?: { relativePath?: unknown } },
+    ) & { meta?: { relativePath?: unknown } | undefined },
   instanceId: string,
 ): string {
   if (hasFileStableId(file)) return file.id!
```

--------------------------------------------------------------------------------

---[FILE: eslint-plugin-astro.patch]---
Location: zulip-main/patches/eslint-plugin-astro.patch

```text
diff --git a/lib/index.d.mts b/lib/index.d.mts
index a9989abbc716669b86a7f5e5e020869718eff9f0..9d3a5cb15bdd72eb610ed73411435c53831d16fa 100644
--- a/lib/index.d.mts
+++ b/lib/index.d.mts
@@ -1,4 +1,4 @@
-import * as node_modules__eslint_core_dist_cjs_types_d_cts from 'node_modules/@eslint/core/dist/cjs/types.d.cts';
+import * as node_modules__eslint_core_dist_cjs_types_d_cts from '@eslint/core';
 import * as eslint from 'eslint';
 
 declare const configs: {
```

--------------------------------------------------------------------------------

---[FILE: handlebars.patch]---
Location: zulip-main/patches/handlebars.patch

```text
diff --git a/runtime.d.ts b/runtime.d.ts
index 0d5105eb73794b7ab88a7c30502977d10a836f45..a8e8768addd7c424eb8e82372eb3d955582eb456 100644
--- a/runtime.d.ts
+++ b/runtime.d.ts
@@ -1,5 +1,3 @@
 import Handlebars = require('handlebars')
 
-declare module "handlebars/runtime" {
-   
-}
\ No newline at end of file
+export = Handlebars;
diff --git a/types/index.d.ts b/types/index.d.ts
index 3f2f8b792edbd621d06c399ff4c722234f233742..3b3d8cb0d3c9f264b00104c3ea0ba96a2e63d485 100644
--- a/types/index.d.ts
+++ b/types/index.d.ts
@@ -14,7 +14,8 @@
  */
 // TypeScript Version: 2.3
 
-declare namespace Handlebars {
+declare global {
+namespace Handlebars {
   export interface TemplateDelegate<T = any> {
       (context: T, options?: RuntimeOptions): string;
   }
@@ -243,7 +244,7 @@ interface PrecompileOptions extends CompileOptions {
   destName?: string;
 }
 
-declare namespace hbs {
+namespace hbs {
   // for backward compatibility of this typing
   type SafeString = Handlebars.SafeString;
 
@@ -264,7 +265,7 @@ interface Logger {
 
 type CompilerInfo = [number/* revision */, string /* versions */];
 
-declare namespace hbs {
+namespace hbs {
   namespace AST {
       interface Node {
           type: string;
@@ -412,11 +413,6 @@ declare namespace hbs {
       }
   }
 }
-
-declare module "handlebars" {
-  export = Handlebars;
 }
 
-declare module "handlebars/runtime" {
-  export = Handlebars;
-}
+export = Handlebars;
```

--------------------------------------------------------------------------------

---[FILE: simplebar.patch]---
Location: zulip-main/patches/simplebar.patch

```text
diff --git a/package.json b/package.json
index c32d49a585411bce4d1e0ce02895c23f8d3f7849..1935c22ae7f4db47ffce1d8341bf975f0d99c046 100644
--- a/package.json
+++ b/package.json
@@ -25,6 +25,7 @@
       "require": "./dist/index.cjs",
       "types": "./dist/index.d.ts"
     },
+    "./dist/simplebar.css": "./dist/simplebar.css",
     "./dist/simplebar.min.css": "./dist/simplebar.min.css"
   },
   "homepage": "https://grsmto.github.io/simplebar/",
```

--------------------------------------------------------------------------------

---[FILE: stylelint-high-performance-animation.patch]---
Location: zulip-main/patches/stylelint-high-performance-animation.patch

```text
diff --git a/index.js b/index.js
index 8cc85d49192c244d6f895ee38bfca59bec7f78f5..9f7789da1d8de0dd845d08c3be3825016b5a2253 100644
--- a/index.js
+++ b/index.js
@@ -183,12 +183,14 @@ module.exports = stylelint.createPlugin(
           (blacklist.indexOf(val) > -1 || val === "all")
         ) {
           const index = declarationValueIndex(decl) + node.sourceIndex;
+          const endIndex = index + node.value.length;
           stylelint.utils.report({
             ruleName,
             result,
             node: decl,
             message: messages.rejected("transition", node.value),
             index,
+            endIndex,
           });
         }
       });
@@ -217,12 +219,15 @@ module.exports = stylelint.createPlugin(
         });
 
         if (nodes.length && transitionProp.length === 0) {
+          const index = declarationValueIndex(decl) + nodes[0].index;
+          const endIndex = index + nodes[0].value.length;
           stylelint.utils.report({
             ruleName,
             result,
             node: decl,
             message: messages.rejected("transition", "all"),
-            index: declarationValueIndex(decl) + nodes[0].index,
+            index,
+            endIndex,
           });
           return;
         }
@@ -230,6 +235,7 @@ module.exports = stylelint.createPlugin(
 
       for (const prop of nodes) {
         const index = declarationValueIndex(decl) + prop.index;
+        const endIndex = index + prop.value.length;
         const val = unprefixed(prop.value);
         if (
           ignored.indexOf(val) === -1 &&
@@ -241,6 +247,7 @@ module.exports = stylelint.createPlugin(
             node: decl,
             message: messages.rejected("transition", prop.value),
             index,
+            endIndex,
           });
         }
       }
```

--------------------------------------------------------------------------------

---[FILE: svgicons2svgfont.patch]---
Location: zulip-main/patches/svgicons2svgfont.patch

```text
diff --git a/src/index.js b/src/index.js
index ae8106081908e6ef98ebac640b506d8dbc34d00e..6ab77b98e9d7ab69d7addab4586512a380f464c7 100755
--- a/src/index.js
+++ b/src/index.js
@@ -3,7 +3,6 @@
 
 'use strict';
 
-const { ucs2 } = require('punycode');
 const { Transform } = require('stream');
 const Sax = require('sax');
 const { SVGPathData } = require('svg-pathdata');
@@ -479,9 +478,11 @@ class SVGIcons2SVGFontStream extends Transform {
       delete glyph.paths;
       const d = glyphPath.round(this._options.round).encode();
       glyph.unicode.forEach((unicode, i) => {
-        const unicodeStr = ucs2
-          .decode(unicode)
-          .map((point) => '&#x' + point.toString(16).toUpperCase() + ';')
+        const unicodeStr = [...unicode]
+          .map(
+            (char) =>
+              '&#x' + char.codePointAt(0).toString(16).toUpperCase() + ';',
+          )
           .join('');
 
         this.push(
```

--------------------------------------------------------------------------------

---[FILE: textarea-caret@3.1.0.patch]---
Location: zulip-main/patches/textarea-caret@3.1.0.patch

```text
diff --git a/index.js b/index.js
index 0b06d12bb550fbf8043645a8d680817909cb2b04..c94bbcbf0e65ecf370195f6f3b03a2be62012d0c 100644
--- a/index.js
+++ b/index.js
@@ -65,7 +65,6 @@ function getCaretCoordinates(element, position, options) {
   // The mirror div will replicate the textarea's style
   var div = document.createElement('div');
   div.id = 'input-textarea-caret-position-mirror-div';
-  document.body.appendChild(div);
 
   var style = div.style;
   var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
@@ -113,6 +112,7 @@ function getCaretCoordinates(element, position, options) {
   // For inputs, just '.' would be enough, but no need to bother.
   span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
   div.appendChild(span);
+  document.body.appendChild(div);
 
   var coordinates = {
     top: span.offsetTop + parseInt(computed['borderTopWidth']),
```

--------------------------------------------------------------------------------

---[FILE: tippy.js@6.3.7.patch]---
Location: zulip-main/patches/tippy.js@6.3.7.patch

```text
diff --git a/dist/tippy.esm.js b/dist/tippy.esm.js
index 55346f57874b0af79fec3b6f9f0253f9d55bfee2..c7a4e1549dcc3e1815c908825d914d44467e60f3 100644
--- a/dist/tippy.esm.js
+++ b/dist/tippy.esm.js
@@ -1907,7 +1907,7 @@
   var normalizedReturnValue = normalizeToArray(returnValue);
 
   function onTrigger(event) {
-    if (!event.target || disabled) {
+    if (!isElement(event.target) || disabled) {
       return;
     }
```

--------------------------------------------------------------------------------

---[FILE: 0001_enable.py]---
Location: zulip-main/pgroonga/migrations/0001_enable.py
Signals: Django

```python
from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0001_initial"),
    ]

    database_setting = settings.DATABASES["default"]

    operations = [
        # This previously had additional operations, but they are all
        # undone in migration 0003 because we switched to using the
        # PGroonga v2 API.
        migrations.RunSQL(
            sql="ALTER TABLE zerver_message ADD COLUMN search_pgroonga text;",
            reverse_sql="ALTER TABLE zerver_message DROP COLUMN search_pgroonga;",
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0002_html_escape_subject.py]---
Location: zulip-main/pgroonga/migrations/0002_html_escape_subject.py
Signals: Django

```python
from django.db import connection, migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.migrations.state import StateApps
from psycopg2.sql import SQL

from zerver.lib.migrate import do_batch_update


def rebuild_pgroonga_index(apps: StateApps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    with connection.cursor() as cursor:
        do_batch_update(
            cursor,
            "zerver_message",
            [SQL("search_pgroonga = escape_html(subject) || ' ' || rendered_content")],
            batch_size=10000,
        )


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("pgroonga", "0001_enable"),
    ]

    operations = [
        migrations.RunPython(rebuild_pgroonga_index, reverse_code=migrations.RunPython.noop),
    ]
```

--------------------------------------------------------------------------------

---[FILE: 0003_v2_api_upgrade.py]---
Location: zulip-main/pgroonga/migrations/0003_v2_api_upgrade.py
Signals: Django

```python
from django.db import migrations


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("pgroonga", "0002_html_escape_subject"),
    ]

    operations = [
        # This migration does the following things:
        # * Undoes the `search_path` changes from the original migration 0001,
        #   which are no longer necessary with the modern PGroonga API.
        #   (Note that we've deleted those changes from the current version of the
        #    0001 migration).
        # * Drops a legacy-format v1 index if present (will be only if upgrading
        #   an old server).
        # * Does a CREATE INDEX CONCURRENTLY to add a PGroonga v2 search index
        #   on the message.search_pgroonga column (which was populated in
        #   migration 0002).
        migrations.RunSQL(
            sql=[
                "ALTER ROLE CURRENT_USER SET search_path TO zulip,public",
                "SET search_path = zulip,public",
                "DROP INDEX IF EXISTS zerver_message_search_pgroonga",
                (
                    "CREATE INDEX CONCURRENTLY zerver_message_search_pgroonga ON zerver_message "
                    "USING pgroonga(search_pgroonga pgroonga_text_full_text_search_ops_v2)"
                ),
            ],
            reverse_sql=[
                "ALTER ROLE CURRENT_USER SET search_path TO zulip,public,pgroonga,pg_catalog",
                "SET search_path = zulip,public,pgroonga,pg_catalog",
                "DROP INDEX IF EXISTS zerver_message_search_pgroonga",
                (
                    "CREATE INDEX CONCURRENTLY zerver_message_search_pgroonga ON zerver_message "
                    "USING pgroonga(search_pgroonga pgroonga.text_full_text_search_ops)"
                ),
            ],
        ),
    ]
```

--------------------------------------------------------------------------------

---[FILE: deps.yaml]---
Location: zulip-main/puppet/deps.yaml

```yaml
puppetlabs-stdlib:
  version: 8.6.0
  sha256sum: 5bbaf59faf684726ca683ecddd5f62da34a725cdda6eabb6141db824431b807b
puppetlabs-concat:
  version: 7.3.3
  sha256sum: 63d59db5fe908e851e4b92b5c3f8230c08f38d4fff000e15f92bc67c8a46a36b
```

--------------------------------------------------------------------------------

---[FILE: chrony.conf]---
Location: zulip-main/puppet/kandra/files/chrony.conf

```text
# Welcome to the chrony configuration file. See chrony.conf(5) for more
# information about usable directives.

# Include configuration files found in /etc/chrony/conf.d.
confdir /etc/chrony/conf.d

# This will use the AWS local atomic clocks as a datasource; see
# https://aws.amazon.com/blogs/aws/keeping-time-with-amazon-time-sync-service/
server 169.254.169.123 prefer iburst minpoll 4 maxpoll 4

# Use time sources from DHCP.
sourcedir /run/chrony-dhcp

# Use NTP sources found in /etc/chrony/sources.d.
sourcedir /etc/chrony/sources.d

# This directive specify the location of the file containing ID/key pairs for
# NTP authentication.
keyfile /etc/chrony/chrony.keys

# This directive specify the file into which chronyd will store the rate
# information.
driftfile /var/lib/chrony/chrony.drift

# Save NTS keys and cookies.
ntsdumpdir /var/lib/chrony

# Uncomment the following line to turn logging on.
#log tracking measurements statistics

# Log files location.
logdir /var/log/chrony

# Stop bad estimates upsetting machine clock.
maxupdateskew 100.0

# This directive enables kernel synchronisation (every 11 minutes) of the
# real-time clock. Note that it can’t be used along with the 'rtcfile' directive.
rtcsync

# Step the system clock instead of slewing it if the adjustment is larger than
# one second, but only in the first three clock updates.
makestep 1 3

# Get TAI-UTC offset and leap seconds from the system tz database.
# This directive is commented out because AWS time servers do smear
# leap seconds.
#
#leapsectz right/UTC
```

--------------------------------------------------------------------------------

---[FILE: github.keys]---
Location: zulip-main/puppet/kandra/files/github.keys

```text
github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl
github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=
github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk=
```

--------------------------------------------------------------------------------

---[FILE: install-aws-cli]---
Location: zulip-main/puppet/kandra/files/install-aws-cli

```text
#!/usr/bin/env bash

set -eu

ARCH=$(uname -m)

AWS_CLI_VERSION="2.23.6"
if [ "$ARCH" == "x86_64" ]; then
    AWS_CLI_SHA="8d26ffa2e9427804a9f8928c692ee83e1c88456e0519a69e63bc992caf2b2339"
elif [ "$ARCH" == "aarch64" ]; then
    AWS_CLI_SHA="9c2b05dfc370cc99ec47ad374be52b828cd77d14702b2edae071d73224aacd6e"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

# Check if we're already installed
if [ -L "/srv/zulip-aws-tools/v2/current" ] \
    && [ "$(readlink /srv/zulip-aws-tools/v2/current)" = "/srv/zulip-aws-tools/v2/$AWS_CLI_VERSION" ]; then
    exit 0
fi

# If not running in the initial host bootstrap, and was called with
# arguments, this is just a check.
if [ -z "${RUNNING_IN_CLOUD_INIT+x}" ] && [[ $# -gt 0 ]]; then
    exit 1
fi

mkdir -p /srv/zulip-aws-tools

cd /srv/zulip-aws-tools || exit 1
rm -rf awscli.zip awscli.zip.sha256 aws/
curl -fL --retry 3 "https://awscli.amazonaws.com/awscli-exe-linux-$ARCH-$AWS_CLI_VERSION.zip" -o awscli.zip
echo "$AWS_CLI_SHA  awscli.zip" >awscli.zip.sha256
sha256sum -c awscli.zip.sha256
unzip -q awscli.zip

cd ./aws || exit 1
./install -i /srv/zulip-aws-tools -b /srv/zulip-aws-tools/bin -u
echo "$AWS_CLI_VERSION" >/srv/zulip-aws-tools/version

(
    cd /srv/zulip-aws-tools/
    rm -rf awscli.zip awscli.zip.sha256 aws/
)
```

--------------------------------------------------------------------------------

---[FILE: install-ssh-authorized-keys]---
Location: zulip-main/puppet/kandra/files/install-ssh-authorized-keys

```text
#!/usr/bin/env bash
set -euo pipefail

args="$(getopt -o '' --long check -- "$@")"
eval "set -- $args"
check=false
while true; do
    case "$1" in
        --check)
            check=true
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

username="$1"
shift

homedir="$(getent passwd "$username" | cut -d: -f6)"
sshdir="$homedir/.ssh"

workfile=$(mktemp)
cleanup() { rm "$workfile"; }
trap cleanup EXIT

for ssh_secret_name in "$@"; do
    /srv/zulip-aws-tools/bin/aws --output text \
        secretsmanager get-secret-value \
        --secret-id "$ssh_secret_name" \
        --query SecretString \
        | jq -r 'keys[] as $k | "\(.[$k]) \($k)"' \
            >>"$workfile"
done

chmod 644 "$workfile"
chown "$username:$username" "$workfile"

if [ "$check" = "true" ]; then
    diff -N "$workfile" "$sshdir/authorized_keys"
    exit 0
fi

rsync -av "$workfile" "$sshdir/authorized_keys"
```

--------------------------------------------------------------------------------

---[FILE: install-ssh-keys]---
Location: zulip-main/puppet/kandra/files/install-ssh-keys

```text
#!/usr/bin/env bash
set -euo pipefail

args="$(getopt -o '' --long check -- "$@")"
eval "set -- $args"
check=false
while true; do
    case "$1" in
        --check)
            check=true
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

username="$1"
shift

homedir="$(getent passwd "$username" | cut -d: -f6)"
sshdir="$homedir/.ssh"

umask 077
workdir=$(mktemp -d)
chown "$username:$username" "$workdir"
cleanup() { ls -al "$workdir" && rm -rf "$workdir"; }
trap cleanup EXIT

umask 033

for ssh_secret_name in "$@"; do
    keydata="$(/srv/zulip-aws-tools/bin/aws --output text \
        secretsmanager get-secret-value \
        --secret-id "$ssh_secret_name" \
        --query SecretString)"
    for keyfile in $(jq -r 'keys[]' <<<"$keydata"); do
        touch "$workdir/$keyfile"
        if [[ "$keyfile" != *".pub" ]]; then
            chmod 600 "$workdir/$keyfile"
        fi
        jq -r ".[\"$keyfile\"]" <<<"$keydata" | base64 -d >"$workdir/$keyfile"
        chown "$username:$username" "$workdir/$keyfile"
    done
done

if [ "$check" = "true" ]; then
    diff -rN -x config -x authorized_keys -x known_hosts \
        "$workdir/" "$sshdir/"
    exit 0
fi

rsync -av --delete \
    --exclude config --exclude authorized_keys --exclude known_hosts \
    "$workdir/" "$sshdir/"
```

--------------------------------------------------------------------------------

---[FILE: memcached_exporter]---
Location: zulip-main/puppet/kandra/files/memcached_exporter

```text
#!/usr/bin/env python3

import contextlib
import sys
import time
from collections.abc import Iterable, Sequence
from typing import Any

sys.path.append("/home/zulip/deployments/current")
from scripts.lib.setup_path import setup_path

setup_path()

import bmemcached
from prometheus_client import start_http_server
from prometheus_client.core import REGISTRY, CounterMetricFamily, GaugeMetricFamily
from prometheus_client.metrics_core import Metric
from prometheus_client.registry import Collector
from prometheus_client.samples import Sample
from typing_extensions import override

from zproject import settings


class MemcachedCollector(Collector):
    @override
    def collect(self) -> Iterable[Metric]:
        def gauge(
            name: str,
            doc: str,
            value: float | bytes | None = None,
            labels: Sequence[str] | None = None,
        ) -> GaugeMetricFamily:
            return GaugeMetricFamily(
                f"memcached_{name}", doc, float(value) if value else None, labels
            )

        def counter(
            name: str,
            doc: str,
            labels: Iterable[str] | None = None,
        ) -> CounterMetricFamily:
            return CounterMetricFamily(
                f"memcached_{name}", doc, labels=list(labels) if labels is not None else None
            )

        def counter_value(
            name: str,
            doc: str,
            value: bytes | float,
            labels: dict[str, str] | None = None,
        ) -> CounterMetricFamily:
            if labels is None:
                labels = {}
            metric = counter(name, doc, labels=labels.keys())
            # CounterMetricFamily strips off a trailing "_total" from
            # the metric's .name, and force-appends "_total" when you
            # use .add_metric.  Since we have counters that don't end
            # in _total, manually add samples, re-appending _total
            # only if we originally ended with it.
            append_total = name.endswith("_total")
            metric.samples.append(
                Sample(metric.name + ("_total" if append_total else ""), labels, float(value), None)
            )
            return metric

        cache: dict[str, Any] = settings.CACHES["default"]
        client = None
        with contextlib.suppress(Exception):
            client = bmemcached.Client((cache["LOCATION"],), **cache["OPTIONS"])
        yield gauge("up", "If memcached is up", value=client is not None)

        if client is None:
            return

        raw_stats = client.stats()
        stats: dict[str, bytes] = next(iter(raw_stats.values()))

        version_gauge = gauge(
            "version", "The version of this memcached server.", labels=["version"]
        )
        version_gauge.add_metric(value=1, labels=[stats["version"].decode()])
        yield version_gauge
        yield counter_value(
            "uptime_seconds", "Number of seconds since the server started.", value=stats["uptime"]
        )

        commands_counter = counter(
            "commands_total",
            "Total number of all requests broken down by command (get, set, etc.) and status.",
            labels=["command", "status"],
        )
        for op in ("get", "delete", "incr", "decr", "cas", "touch"):
            commands_counter.add_metric(value=float(stats[f"{op}_hits"]), labels=[op, "hit"])
            commands_counter.add_metric(value=float(stats[f"{op}_misses"]), labels=[op, "miss"])
        commands_counter.add_metric(value=float(stats["cas_badval"]), labels=["cas", "badval"])
        commands_counter.add_metric(value=float(stats["cmd_flush"]), labels=["flush", "hit"])

        # memcached includes cas operations again in cmd_set
        commands_counter.add_metric(
            value=int(stats["cmd_set"])
            - (int(stats["cas_hits"]) + int(stats["cas_hits"]) + int(stats["cas_badval"])),
            labels=["set", "hit"],
        )
        yield commands_counter

        yield counter_value(
            "process_user_cpu_seconds_total",
            "Accumulated user time for this process.",
            value=stats["rusage_user"],
        )

        yield counter_value(
            "process_system_cpu_seconds_total",
            "Accumulated system time for this process.",
            value=stats["rusage_system"],
        )

        yield gauge(
            "current_bytes", "Current number of bytes used to store items.", value=stats["bytes"]
        )
        yield gauge(
            "limit_bytes",
            "Number of bytes this server is allowed to use for storage.",
            value=stats["limit_maxbytes"],
        )
        yield gauge(
            "current_items",
            "Current number of items stored by this instance.",
            value=stats["curr_items"],
        )
        yield counter_value(
            "items_total",
            "Total number of items stored during the life of this instance.",
            value=stats["total_items"],
        )

        yield counter_value(
            "read_bytes_total",
            "Total number of bytes read by this server from network.",
            value=stats["bytes_read"],
        )
        yield counter_value(
            "written_bytes_total",
            "Total number of bytes sent by this server to network.",
            value=stats["bytes_written"],
        )

        yield gauge(
            "current_connections",
            "Current number of open connections.",
            value=stats["curr_connections"],
        )
        yield counter_value(
            "connections_total",
            "Total number of connections opened since the server started running.",
            value=stats["total_connections"],
        )
        yield counter_value(
            "connections_rejected_total",
            "Total number of connections rejected due to hitting the memcached's -c limit in maxconns_fast mode.",
            value=stats["rejected_connections"],
        )
        yield counter_value(
            "connections_yielded_total",
            "Total number of connections yielded running due to hitting the memcached's -R limit.",
            value=stats["conn_yields"],
        )
        yield counter_value(
            "connections_listener_disabled_total",
            "Number of times that memcached has hit its connections limit and disabled its listener.",
            value=stats["listen_disabled_num"],
        )

        yield counter_value(
            "items_evicted_total",
            "Total number of valid items removed from cache to free memory for new items.",
            value=stats["evictions"],
        )
        yield counter_value(
            "items_reclaimed_total",
            "Total number of times an entry was stored using memory from an expired entry.",
            value=stats["reclaimed"],
        )
        if "store_too_large" in stats:
            yield counter_value(
                "item_too_large_total",
                "The number of times an item exceeded the max-item-size when being stored.",
                value=stats["store_too_large"],
            )
        if "store_no_memory" in stats:
            yield counter_value(
                "item_no_memory_total",
                "The number of times an item could not be stored due to no more memory.",
                value=stats["store_no_memory"],
            )

        raw_stats = client.stats("settings")
        settings_stats = next(iter(raw_stats.values()))
        yield counter_value(
            "max_connections",
            "Maximum number of clients allowed.",
            value=settings_stats["maxconns"],
        )
        yield counter_value(
            "max_item_size_bytes",
            "Maximum item size.",
            value=settings_stats["item_size_max"],
        )

        raw_stats = client.stats("slabs")
        slab_stats = next(iter(raw_stats.values()))
        yield counter_value(
            "malloced_bytes",
            "Number of bytes of memory allocated to slab pages.",
            value=slab_stats["total_malloced"],
        )

        slabs = {key.split(":", 1)[0] for key in slab_stats if ":" in key}
        slab_commands = counter(
            "slab_commands_total",
            "Total number of all requests broken down by command (get, set, etc.) and status per slab.",
            labels=["slab", "command", "status"],
        )
        for slab_no in slabs:
            for op in ("get", "delete", "incr", "decr", "cas", "touch"):
                slab_commands.add_metric(
                    labels=[slab_no, op, "hit"], value=slab_stats[f"{slab_no}:{op}_hits"]
                )
            slab_commands.add_metric(
                labels=[slab_no, "cas", "badval"], value=slab_stats[f"{slab_no}:cas_badval"]
            )
            slab_commands.add_metric(
                labels=[slab_no, "set", "hit"],
                value=float(slab_stats[f"{slab_no}:cmd_set"])
                - (
                    float(slab_stats[f"{slab_no}:cas_hits"])
                    + float(slab_stats[f"{slab_no}:cas_badval"])
                ),
            )
        yield slab_commands

        def slab_counter(name: str, doc: str) -> CounterMetricFamily:
            return counter(f"slab_{name}", doc, labels=["slab"])

        def slab_gauge(name: str, doc: str) -> GaugeMetricFamily:
            return gauge(f"slab_{name}", doc, labels=["slab"])

        slab_metrics = {
            "chunk_size": slab_gauge("chunk_size_bytes", "The amount of space each chunk uses."),
            "chunks_per_page": slab_gauge(
                "chunks_per_page", "How many chunks exist within one page."
            ),
            "total_pages": slab_gauge(
                "current_pages", "Total number of pages allocated to the slab class."
            ),
            "total_chunks": slab_gauge(
                "current_chunks", "Total number of chunks allocated to the slab class."
            ),
            "used_chunks": slab_gauge(
                "chunks_used", "How many chunks have been allocated to items."
            ),
            "free_chunks": slab_gauge(
                "chunks_free", "Chunks not yet allocated to items, or freed via delete."
            ),
            "free_chunks_end": slab_gauge(
                "chunks_free_end", "Number of free chunks at the end of the last allocated page."
            ),
        }
        for slab_no in slabs:
            for key, slab_metric in slab_metrics.items():
                slab_metric.samples.append(
                    Sample(
                        slab_metric.name,
                        {"slab": slab_no},
                        slab_stats.get(f"{slab_no}:{key}", b"0"),
                    )
                )
        for slab_metric in slab_metrics.values():
            yield slab_metric

        raw_stats = client.stats("items")
        item_stats = next(iter(raw_stats.values()))
        item_hits_counter = counter(
            "slab_lru_hits_total", "Number of get_hits to the LRU.", labels=["slab", "lru"]
        )
        for slab_no in slabs:
            for lru in ("hot", "warm", "cold", "temp"):
                item_hits_counter.add_metric(
                    labels=[slab_no, lru],
                    value=item_stats.get(f"items:{slab_no}:hits_to_{lru}", b"0"),
                )
        yield item_hits_counter

        item_metrics = {
            "number": slab_gauge(
                "current_items", "Number of items presently stored in this class."
            ),
            "number_hot": slab_gauge(
                "hot_items", "Number of items presently stored in the HOT LRU."
            ),
            "number_warm": slab_gauge(
                "warm_items", "Number of items presently stored in the WARM LRU."
            ),
            "number_cold": slab_gauge(
                "cold_items", "Number of items presently stored in the COLD LRU."
            ),
            "number_temp": slab_gauge(
                "temporary_items", "Number of items presently stored in the TEMPORARY LRU."
            ),
            "age_hot": slab_gauge("hot_age_seconds", "Age of the oldest item in HOT LRU."),
            "age_warm": slab_gauge("warm_age_seconds", "Age of the oldest item in WARM LRU."),
            "age": slab_gauge("items_age_seconds", "Age of the oldest item in the LRU."),
            "mem_requested": slab_gauge(
                "mem_requested_bytes", "Number of bytes requested to be stored in this LRU."
            ),
            "evicted": slab_counter(
                "items_evicted_total",
                "Total number of times an item had to be evicted from the LRU before it expired.",
            ),
            "evicted_nonzero": slab_counter(
                "items_evicted_nonzero_total",
                "Number of times an item which had an explicit expire time set had to be evicted from the LRU before it expired.",
            ),
            "evicted_time": slab_gauge(
                "items_evicted_time_seconds",
                "Seconds since the last access for the most recent item evicted from this class.",
            ),
            "outofmemory": slab_counter(
                "items_outofmemory_total",
                " Number of times the underlying slab class was unable to store a new item.",
            ),
            "tailrepairs": slab_counter(
                "items_tailrepairs_total",
                "Number of times we self-healed a slab with a refcount leak.",
            ),
            "reclaimed": slab_counter(
                "items_reclaimed_total",
                "Number of times an entry was stored using memory from an expired entry.",
            ),
            "expired_unfetched": slab_counter(
                "items_expired_unfetched_total",
                "Number of expired items reclaimed from the LRU which were never touched after being set.",
            ),
            "evicted_unfetched": slab_counter(
                "items_evicted_unfetched_total",
                "Number of valid items evicted from the LRU which were never touched after being set.",
            ),
            "evicted_active": slab_counter(
                "items_evicted_active_total",
                "Number of valid items evicted from the LRU which were recently touched but were evicted before being moved to the top of the LRU again.",
            ),
            "crawler_reclaimed": slab_counter(
                "items_crawler_reclaimed_total", "Number of items freed by the LRU Crawler."
            ),
            "lrutail_reflocked": slab_counter(
                "items_lrutail_reflocked_total",
                "Number of items found to be refcount locked in the LRU tail.",
            ),
            "moves_to_cold": slab_counter(
                "moves_to_cold_total", "Number of items moved from HOT or WARM into COLD."
            ),
            "moves_to_warm": slab_counter(
                "moves_to_warm_total", "Number of items moved from COLD to WARM."
            ),
            "moves_within_lru": slab_counter(
                "moves_within_lru_total",
                "Number of times active items were bumped within HOW or WARM.",
            ),
        }
        for slab_no in slabs:
            for key, item_metric in item_metrics.items():
                item_metric.samples.append(
                    Sample(
                        item_metric.name,
                        {"slab": slab_no},
                        item_stats.get(f"items:{slab_no}:{key}", b"0"),
                    )
                )
        for item_metric in item_metrics.values():
            yield item_metric

        raw_stats = client.stats("sizes")
        sizes_stats = next(iter(raw_stats.values()))
        if sizes_stats.get("sizes_status") != b"disabled" and sizes_stats != {}:
            sizes = sorted([int(x) for x in sizes_stats])
            yield gauge(
                "item_max_bytes", "Largest item (rounded to 32 bytes) in bytes.", value=sizes[-1]
            )

        client.disconnect_all()


if __name__ == "__main__":
    REGISTRY.register(MemcachedCollector())
    start_http_server(11212)
    while True:
        time.sleep(60)
```

--------------------------------------------------------------------------------

---[FILE: mirror_to_czo]---
Location: zulip-main/puppet/kandra/files/mirror_to_czo

```text
#!/usr/bin/env python3

import configparser
import logging
import time
from contextlib import suppress
from typing import Any

# This import (and its dependencies) come from the production venv,
# because we use `uv run` to execute this script.
import zulip

config_file = configparser.RawConfigParser()
config_file.read("/etc/zulip/zulip.conf")
send_to_channel = config_file.get("mirror_to_czo", "send_to_channel")

reading = zulip.Client(config_file="/etc/zulip/mirror_to_czo.zulipcore.zuliprc")
sending = zulip.Client(config_file="/etc/zulip/mirror_to_czo.czo.zuliprc")

logging.Formatter.converter = time.gmtime
logging.basicConfig(format="%(asctime)s mirror_to_czo: %(message)s", level=logging.INFO)


def send_mirror(msg: dict[str, Any]) -> None:
    logging.info(msg["message"]["content"])
    sending.send_message(
        {
            "type": "stream",
            "to": send_to_channel,
            "topic": msg["message"]["subject"],
            "content": msg["message"]["content"],
        }
    )


with suppress(KeyboardInterrupt):
    reading.call_on_each_event(
        send_mirror,
        event_types=["message"],
        narrow=[["stream", "signups"]],
    )
```

--------------------------------------------------------------------------------

---[FILE: nagios_ssh_config]---
Location: zulip-main/puppet/kandra/files/nagios_ssh_config

```text
Host *
  ControlMaster no
  ControlPath /tmp/ssh-%C

  ServerAliveInterval 30
  ServerAliveCountMax 3
```

--------------------------------------------------------------------------------

---[FILE: process_exporter.yaml]---
Location: zulip-main/puppet/kandra/files/process_exporter.yaml

```yaml
process_names:
  - name: "tornado-{{.Matches.Port}}"
    comm:
      - python3
    cmdline:
      - runtornado\s+127\.0\.0\.1:(?P<Port>\S+)
  - name: "uwsgi-{{.Matches.Worker}}"
    comm:
      - uwsgi
    cmdline:
      - zulip-django uWSGI worker (?P<Worker>\d+)
  - name: process_fts_updates
    comm:
      - python3
    cmdline:
      - /usr/local/bin/process_fts_updates
  - name: email_server
    comm:
      - python3
    cmdline:
      - /home/zulip/deployments/current/manage.py email_server
  - name: "worker-{{.Matches.Queue}}"
    comm:
      - python3
    cmdline:
      - /home/zulip/deployments/current/manage.py process_queue --queue_name=(?P<Queue>\S+)
  - name: "deliver-scheduled-{{.Matches.What}}"
    comm:
      - python3
    cmdline:
      - /home/zulip/deployments/current/manage.py deliver_scheduled_(?P<What>\S+)
```

--------------------------------------------------------------------------------

````

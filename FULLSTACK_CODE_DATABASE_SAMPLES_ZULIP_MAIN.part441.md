---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 441
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 441 of 1290)

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

---[FILE: wal-g-exporter]---
Location: zulip-main/puppet/zulip/files/postgresql/wal-g-exporter

```text
#!/usr/bin/env python3
import configparser
import contextlib
import json
import logging
import os
import subprocess
import sys
from collections import defaultdict
from collections.abc import Mapping
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Protocol
from urllib.parse import parse_qs, urlsplit


class GaugeMetric(Protocol):
    def __call__(self, value: float, labels: Mapping[str, str] | None = None, /) -> None:
        pass


class WalGPrometheusServer(BaseHTTPRequestHandler):
    METRIC_PREFIX = "wal_g_backup_"

    metrics: dict[str, list[str]] = {}
    metric_values: dict[str, dict[str, str]] = defaultdict(dict)

    server_version = "wal-g-prometheus-server/1.0"

    def gauge(
        self, name: str, description: str | None = None, default_value: float | None = None
    ) -> GaugeMetric:
        if name in self.metrics:
            raise ValueError(f"Redefinition of {name} metric")
        self.metrics[name] = [f"# TYPE {self.METRIC_PREFIX}{name} gauge"]
        if description is not None:
            self.metrics[name].append(f"# HELP {self.METRIC_PREFIX}{name} {description}")

        def inner(value: float, labels: Mapping[str, str] | None = None) -> None:
            label_str = ""
            if labels:
                label_str = "{" + ",".join(f'{k}="{v}"' for k, v in labels.items()) + "}"
            self.metric_values[name][label_str] = f"{self.METRIC_PREFIX}{name}{label_str} {value}"

        if default_value is not None:
            inner(default_value)
        return inner

    def print_metrics(self) -> None:
        lines = []
        for metric_name in self.metrics:
            if self.metric_values[metric_name]:
                # Print preamble
                lines += self.metrics[metric_name]
                lines += self.metric_values[metric_name].values()
                lines.append("")
        self.wfile.write("\n".join(lines).encode())

    def do_GET(self) -> None:
        if urlsplit(self.path).path != "/metrics":
            self.send_response(404)
            self.end_headers()
            sys.stderr.flush()
            return

        self.send_response(200)
        self.send_header("Content-type", "text/plain; version=0.0.4")
        self.end_headers()

        self.metrics = {}
        self.metric_values = defaultdict(dict)

        backup_ok = self.gauge("ok", "If wal-g backup-list was OK", 0)
        backup_count = self.gauge("count", "Number of backups")
        backup_earliest_age_seconds = self.gauge("earliest_age_seconds", "Age of the oldest backup")
        backup_latest_age_seconds = self.gauge(
            "latest_age_seconds", "Age of the most recent backup"
        )
        backup_latest_duration_seconds = self.gauge(
            "latest_duration_seconds", "Duration the most recent backup took, in seconds"
        )
        backup_latest_compressed_size_bytes = self.gauge(
            "latest_compressed_size_bytes", "Size of the most recent backup, in bytes"
        )
        backup_latest_uncompressed_size_bytes = self.gauge(
            "latest_uncompressed_size_bytes",
            "Uncompressed size of the most recent backup, in bytes",
        )
        backup_total_compressed_size_bytes = self.gauge(
            "total_compressed_size_bytes", "Total compressed size of all backups, in bytes"
        )

        now = datetime.now(tz=timezone.utc)
        try:
            query = parse_qs(urlsplit(self.path).query)
            modified_env = os.environ.copy()
            if query.get("bucket") and len(query["bucket"]) == 1:
                bucket = query["bucket"][0]
                modified_env["WALG_S3_PREFIX"] = f"s3://{bucket}"
            else:
                config_file = configparser.RawConfigParser()
                config_file.read("/etc/zulip/zulip-secrets.conf")
                bucket = config_file["secrets"]["s3_backups_bucket"]

            backup_list_output = subprocess.check_output(
                ["env-wal-g", "backup-list", "--detail", "--json"],
                text=True,
                env=modified_env,
            )
            data = json.loads(backup_list_output) if backup_list_output else []
            backup_count(len(data), {"bucket": bucket})

            backup_total_compressed_size_bytes(
                sum(e["compressed_size"] for e in data), {"bucket": bucket}
            )

            if len(data) > 0:
                data.sort(key=lambda e: e["start_time"], reverse=True)
                latest = data[0]
                labels = {
                    "host": latest["hostname"],
                    "pg_version": str(latest["pg_version"]),
                    "bucket": bucket,
                }
                backup_latest_compressed_size_bytes(latest["compressed_size"], labels)
                backup_latest_uncompressed_size_bytes(latest["uncompressed_size"], labels)

                def t(key: str, e: dict[str, str] = latest) -> datetime:
                    return datetime.strptime(e[key], e["date_fmt"]).replace(tzinfo=timezone.utc)

                backup_earliest_age_seconds(
                    (now - t("start_time", data[-1])) / timedelta(seconds=1),
                    {
                        "host": data[-1]["hostname"],
                        "pg_version": data[-1]["pg_version"],
                        "bucket": bucket,
                    },
                )
                backup_latest_age_seconds((now - t("start_time")) / timedelta(seconds=1), labels)
                backup_latest_duration_seconds(
                    (t("finish_time") - t("start_time")) / timedelta(seconds=1), labels
                )
            backup_ok(1)
        except Exception as e:
            logging.exception(e)
        finally:
            self.print_metrics()
            self.log_message(
                "Served in %.2f seconds",
                (datetime.now(tz=timezone.utc) - now) / timedelta(seconds=1),
            )
            sys.stderr.flush()


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s: %(message)s")
server = HTTPServer(("127.0.0.1", 9188), WalGPrometheusServer)
logging.info("Starting server...")
with contextlib.suppress(KeyboardInterrupt):
    server.serve_forever()

server.server_close()
logging.info("Stopping server...")
```

--------------------------------------------------------------------------------

---[FILE: zulip_english.stop]---
Location: zulip-main/puppet/zulip/files/postgresql/zulip_english.stop

```text
i
me
my
myself
we
our
ours
ourselves
you
your
yours
yourself
yourselves
he
him
his
himself
she
her
hers
herself
it
its
itself
they
them
their
theirs
themselves
what
which
who
whom
this
that
these
those
am
is
are
was
were
be
been
being
have
has
had
having
do
does
did
doing
a
an
the
and
but
if
or
because
as
until
while
of
at
by
for
with
about
against
between
into
through
during
before
after
above
below
to
from
up
down
in
out
on
off
over
under
again
further
then
once
here
there
when
where
why
how
all
any
both
each
few
more
most
other
some
such
no
nor
not
only
own
same
so
than
too
very
s
t
can
will
just
don
should
now
b
c
d
e
f
g
h
j
k
l
m
n
o
p
q
r
u
v
w
x
y
z
```

--------------------------------------------------------------------------------

---[FILE: rabbitmq-env.conf]---
Location: zulip-main/puppet/zulip/files/rabbitmq/rabbitmq-env.conf

```text
# Defaults to rabbit. This can be useful if you want to run more than one node
# per machine - RABBITMQ_NODENAME should be unique per erlang-node-and-machine
# combination. See the clustering on a single machine guide for details:
# http://www.rabbitmq.com/clustering.html#single-machine
#
# By default, we set nodename to zulip@localhost so it will always resolve
NODENAME=zulip@localhost

# By default RabbitMQ will bind to all interfaces, on IPv4 and IPv6 if
# available. Set this if you only want to bind to one network interface or#
# address family.
#NODE_IP_ADDRESS=127.0.0.1

# Defaults to 5672.
#NODE_PORT=5672
```

--------------------------------------------------------------------------------

---[FILE: rabbitmq.config]---
Location: zulip-main/puppet/zulip/files/rabbitmq/rabbitmq.config

```text
[{kernel, [{inet_dist_use_interface, {127,0,0,1}}]},
 {rabbit, [{tcp_listeners, [{"127.0.0.1", 5672}]}]}].
```

--------------------------------------------------------------------------------

---[FILE: memcached.conf]---
Location: zulip-main/puppet/zulip/files/sasl2/memcached.conf

```text
mech_list: plain
sasldb_path: /etc/sasl2/memcached-sasldb2
```

--------------------------------------------------------------------------------

---[FILE: cron.conf]---
Location: zulip-main/puppet/zulip/files/supervisor/conf.d/cron.conf

```text
; Used in docker.pp, starts cron (for docker use only)
[program:cron]
command = /usr/sbin/cron -f -L 15
stdout_events_enabled=true
stderr_events_enabled=true
autorestart = true
```

--------------------------------------------------------------------------------

---[FILE: nginx.conf]---
Location: zulip-main/puppet/zulip/files/supervisor/conf.d/nginx.conf

```text
; Used in docker.pp, starts nginx web server (for docker use only)
[program:nginx]
command = /usr/sbin/nginx -g 'daemon off;'
stdout_events_enabled=true
stderr_events_enabled=true
autorestart = true
```

--------------------------------------------------------------------------------

---[FILE: zulip_db.conf]---
Location: zulip-main/puppet/zulip/files/supervisor/conf.d/zulip_db.conf

```text
[program:process-fts-updates]
command=/usr/local/bin/process_fts_updates
priority=600                   ; the relative start priority (default 999)
autostart=true                 ; start at supervisord start (default: true)
autorestart=true               ; whether/when to restart (default: unexpected)
stopsignal=TERM                ; signal used to kill process (default TERM)
stopwaitsecs=30                ; max num secs to wait b4 SIGKILL (default 10)
user=zulip                     ; setuid to this UNIX account to run the program
redirect_stderr=true           ; redirect proc stderr to stdout (default false)
stdout_logfile=/var/log/zulip/fts-updates.log         ; stdout log path, NONE for none; default AUTO
```

--------------------------------------------------------------------------------

---[FILE: limits.conf]---
Location: zulip-main/puppet/zulip/files/systemd/system.conf.d/limits.conf

```text
[Manager]
DefaultLimitNOFILE=1000000
```

--------------------------------------------------------------------------------

---[FILE: container_memory_limit.rb]---
Location: zulip-main/puppet/zulip/lib/facter/container_memory_limit.rb

```ruby
Facter.add(:container_memory_limit_mb) do
  confine kernel: 'Linux'

  setcode do
    begin
      memory_limit_mb = nil

      # Check for cgroup v2
      if File.exist?('/sys/fs/cgroup/memory.max')
        val = File.read('/sys/fs/cgroup/memory.max').strip
        memory_limit_mb = val.to_i / 1024 / 1024 unless val == 'max'

      # Fallback to cgroup v1
      elsif File.exist?('/sys/fs/cgroup/memory/memory.limit_in_bytes')
        val = File.read('/sys/fs/cgroup/memory/memory.limit_in_bytes').strip.to_i
        memory_limit_mb = val / 1024 / 1024 if val < 9223372036854771712
      end

      memory_limit_mb
    rescue => e
      Facter.debug("container_memory_limit_mb error: #{e}")
      nil
    end
  end
end
```

--------------------------------------------------------------------------------

---[FILE: zulip_version.rb]---
Location: zulip-main/puppet/zulip/lib/facter/zulip_version.rb

```ruby
Facter.add(:zulip_version) do
  setcode do
    Dir.chdir("/home/zulip/deployments/current") do
      output = `python3 -c 'import version; print(version.ZULIP_VERSION_WITHOUT_COMMIT)' 2>&1`
      if not $?.success?
        Facter.debug("zulip_version error: #{output}")
        nil
      else
        output.strip
      end
    end
  end
end
```

--------------------------------------------------------------------------------

---[FILE: get_django_setting_slow.rb]---
Location: zulip-main/puppet/zulip/lib/puppet/functions/get_django_setting_slow.rb

```ruby
require "shellwords"

# Note that this is very slow (~350ms) and may get values which will
# rapidly go out of date, since settings are changed much more
# frequently than deploys -- in addition to potentially just not
# working if we're not on the application server.  We should generally
# avoid using this if at all possible.

Puppet::Functions.create_function(:get_django_setting_slow) do
  def get_django_setting_slow(name)
    if File.exist?("/etc/zulip/settings.py")
      if Dir.exist?("/home/zulip/deployments/current")
        deploy_dir = "current"
      else
        # First puppet runs during install don't have a "current" yet, only a "next"
        deploy_dir = "next"
      end
      output = `/home/zulip/deployments/#{deploy_dir}/scripts/get-django-setting #{name.shellescape} 2>&1`
      if $?.success?
        output.strip
      else
        nil
      end
    else
      nil
    end
  end
end
```

--------------------------------------------------------------------------------

---[FILE: resolver_ip.rb]---
Location: zulip-main/puppet/zulip/lib/puppet/functions/resolver_ip.rb

```ruby
require "resolv"

Puppet::Functions.create_function(:resolver_ip) do
  def resolver_ip()
    parsed = Resolv::DNS::Config.default_config_hash()
    if parsed[:nameserver].empty?
      raise 'No nameservers found in /etc/resolv.conf!  Configure one by setting application_server.nameserver in /etc/zulip/zulip.conf'
    end
    resolver = parsed[:nameserver][0]
    if resolver.include?(':')
      '[' + resolver + ']'
    else
      resolver
    end
  end
end
```

--------------------------------------------------------------------------------

---[FILE: zulipconf.rb]---
Location: zulip-main/puppet/zulip/lib/puppet/functions/zulipconf.rb

```ruby
require "shellwords"

Puppet::Functions.create_function(:zulipconf) do
  def zulipconf(section, key, default)
    zulip_conf_path = Facter.value("zulip_conf_path")
    output = `/usr/bin/crudini --get -- #{[zulip_conf_path, section, key].shelljoin} 2>&1`; result = $?.success?
    if result
      if [true, false].include? default
        # If the default is a bool, coerce into a bool.  This list is also
        # maintained in scripts/lib/zulip_tools.py
        ["1", "y", "t", "true", "yes", "enable", "enabled"].include? output.strip.downcase
      else
        output.strip
      end
    else
      default
    end
  end
end
```

--------------------------------------------------------------------------------

---[FILE: zulipconf_keys.rb]---
Location: zulip-main/puppet/zulip/lib/puppet/functions/zulipconf_keys.rb

```ruby
require "shellwords"

Puppet::Functions.create_function(:zulipconf_keys) do
  def zulipconf_keys(section)
    zulip_conf_path = Facter.value("zulip_conf_path")
    output = `/usr/bin/crudini --get -- #{[zulip_conf_path, section].shelljoin} 2>&1`; result = $?.success?
    if result
      return output.lines.map { |l| l.strip }
    else
      return []
    end
  end
end
```

--------------------------------------------------------------------------------

---[FILE: zulipconf_nagios_hosts.rb]---
Location: zulip-main/puppet/zulip/lib/puppet/functions/zulipconf_nagios_hosts.rb

```ruby
require "shellwords"

Puppet::Functions.create_function(:zulipconf_nagios_hosts) do
  def zulipconf_nagios_hosts
    section = "nagios"
    prefix = "hosts_"
    zulip_conf_path = Facter.value("zulip_conf_path")
    keys = `/usr/bin/crudini --get -- #{[zulip_conf_path, section].shelljoin} 2>&1`; result = $?.success?
    if result
      filtered_keys = keys.lines.map { |l| l.strip }.select { |l| l.start_with?(prefix) }
      all_values = []
      filtered_keys.each do |key|
        values = `/usr/bin/crudini --get -- #{[zulip_conf_path, section, key].shelljoin} 2>&1`; result = $?.success?
        if result
          all_values += values.strip.split(/,\s*/)
        end
      end
      return all_values
    else
      return []
    end
  end
end
```

--------------------------------------------------------------------------------

---[FILE: zulipsecret.rb]---
Location: zulip-main/puppet/zulip/lib/puppet/functions/zulipsecret.rb

```ruby
require "shellwords"

Puppet::Functions.create_function(:zulipsecret) do
  def zulipsecret(section, key, default)
    output = `/usr/bin/crudini --get -- /etc/zulip/zulip-secrets.conf #{[section, key].shelljoin} 2>&1`; result = $?.success?
    if result
      output.strip()
    else
      default
    end
  end
end
```

--------------------------------------------------------------------------------

---[FILE: apache2conf.rb]---
Location: zulip-main/puppet/zulip/lib/puppet/type/apache2conf.rb

```ruby
Puppet::Type.newtype(:apache2conf) do
  ensurable
  newparam(:name) do
    desc "The name of the conf to enable"
    isnamevar
  end
end

Puppet::Type.type(:apache2conf).provide(:apache2conf) do
  def exists?
    File.exists?("/etc/apache2/conf-enabled/" + resource[:name] + ".conf")
  end

  def create
    system("a2enconf #{@resource[:name]}")
  end

  def destroy
    system("a2disconf #{@resource[:name]}")
  end
end
```

--------------------------------------------------------------------------------

---[FILE: apache2mod.rb]---
Location: zulip-main/puppet/zulip/lib/puppet/type/apache2mod.rb

```ruby
Puppet::Type.newtype(:apache2mod) do
  ensurable
  newparam(:name) do
    desc "The name of the module to enable"
    isnamevar
  end
end

Puppet::Type.type(:apache2mod).provide(:apache2mod) do
  def exists?
    File.exists?("/etc/apache2/mods-enabled/" + resource[:name] + ".load")
  end

  def create
    system("a2enmod #{@resource[:name]}")
  end

  def destroy
    system("a2dismod #{@resource[:name]}")
  end
end
```

--------------------------------------------------------------------------------

---[FILE: apache2site.rb]---
Location: zulip-main/puppet/zulip/lib/puppet/type/apache2site.rb

```ruby
Puppet::Type.newtype(:apache2site) do
  ensurable
  newparam(:name) do
    desc "The name of the site to enable"
    isnamevar
  end
end

Puppet::Type.type(:apache2site).provide(:apache2site) do
  def exists?
    File.exists?("/etc/apache2/sites-enabled/" + resource[:name] + ".conf")
  end

  def create
    system("a2ensite #{@resource[:name]}")
  end

  def destroy
    system("a2ensite #{@resource[:name]}")
  end
end
```

--------------------------------------------------------------------------------

---[FILE: apache_sso.pp]---
Location: zulip-main/puppet/zulip/manifests/apache_sso.pp

```text
class zulip::apache_sso {
  include zulip::localhost_sso

  case $facts['os']['family'] {
    'Debian': {
      $apache_packages = [ 'apache2', 'libapache2-mod-wsgi-py3', ]
      $conf_dir = '/etc/apache2'
      $apache2 = 'apache2'
    }
    'RedHat': {
      $apache_packages = [ 'httpd', 'python36u-mod_wsgi', ]
      $conf_dir = '/etc/httpd'
      $apache2 = 'httpd'
    }
    default: {
      fail('osfamily not supported')
    }
  }
  package { $apache_packages: ensure => installed }

  apache2mod { [ 'headers', 'proxy', 'proxy_http', 'rewrite', 'ssl', 'wsgi', ]:
    ensure  => present,
    require => Package[$apache2],
  }

  file { "${conf_dir}/ports.conf":
    ensure  => file,
    require => Package[$apache2],
    owner   => 'root',
    group   => 'root',
    mode    => '0640',
    source  => 'puppet:///modules/zulip/apache/ports.conf',
  }

  file { "${conf_dir}/sites-available/":
    recurse => true,
    require => Package[$apache2],
    owner   => 'root',
    group   => 'root',
    mode    => '0640',
    source  => 'puppet:///modules/zulip/apache/sites/',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: app_frontend_base.pp]---
Location: zulip-main/puppet/zulip/manifests/app_frontend_base.pp

```text
# Minimal configuration to run a Zulip application server.
# Default nginx configuration is included in extension app_frontend.pp.
class zulip::app_frontend_base {
  include zulip::nginx
  include zulip::tusd
  include zulip::sasl_modules
  include zulip::supervisor
  include zulip::tornado_sharding
  include zulip::hooks::base

  if $facts['os']['family'] == 'Debian' {
    # Upgrade and other tooling wants to be able to get a database
    # shell.  This is not necessary on CentOS because the PostgreSQL
    # package already includes the client.
    include zulip::postgresql_client
  }
  zulip::safepackage {
    [
      # For `manage.py compilemessages` when upgrading from Git.
      'gettext',
      # For Slack import.
      'unzip',
      # Ensures `/etc/ldap/ldap.conf` exists; the default
      # `TLS_CACERTDIR` specified there is necessary for LDAP
      # authentication to work. This package is "Recommended" by
      # `libldap` where is required by postgres, so has been on most
      # Zulip servers by default; adding it here explicitly ensures it
      # is available on those that don't include the database server.
      'libldap-common',
    ]:
      ensure => installed,
  }

  file { '/etc/nginx/zulip-include/app':
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/zulip/nginx/zulip-include-frontend/app',
    notify  => Service['nginx'],
  }
  file { '/etc/nginx/zulip-include/uploads.types':
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/zulip/nginx/zulip-include-frontend/uploads.types',
    notify  => Service['nginx'],
  }
  file { '/etc/nginx/zulip-include/app.d/':
    ensure => directory,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
  }
  file { '/etc/nginx/zulip-include/localhost.d/':
    ensure => directory,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
  }

  $loadbalancers = split(zulipconf('loadbalancer', 'ips', ''), ',')
  if $loadbalancers != [] {
    file { '/etc/nginx/zulip-include/app.d/accept-loadbalancer.conf':
      require => File['/etc/nginx/zulip-include/app.d'],
      owner   => 'root',
      group   => 'root',
      mode    => '0644',
      content => template('zulip/accept-loadbalancer.conf.template.erb'),
      notify  => Service['nginx'],
    }
    file { '/etc/nginx/zulip-include/app.d/keepalive-loadbalancer.conf':
      require => File['/etc/nginx/zulip-include/app.d'],
      owner   => 'root',
      group   => 'root',
      mode    => '0644',
      source  => 'puppet:///modules/zulip/nginx/zulip-include-app.d/keepalive-loadbalancer.conf',
      notify  => Service['nginx'],
    }
  } else {
    file { ['/etc/nginx/zulip-include/app.d/accept-loadbalancer.conf',
            '/etc/nginx/zulip-include/app.d/keepalive-loadbalancer.conf']:
      ensure => absent,
      notify => Service['nginx'],
    }
  }
  file { '/etc/nginx/zulip-include/app.d/healthcheck.conf':
    require => File['/etc/nginx/zulip-include/app.d'],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/nginx/healthcheck.conf.template.erb'),
    notify  => Service['nginx'],
  }

  file { '/etc/nginx/zulip-include/upstreams':
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/zulip/nginx/zulip-include-frontend/upstreams',
    notify  => Service['nginx'],
  }

  $s3_memory_cache_size = zulipconf('application_server', 's3_memory_cache_size', '1M')
  $s3_disk_cache_size = zulipconf('application_server', 's3_disk_cache_size', '200M')
  $s3_cache_inactive_time = zulipconf('application_server', 's3_cache_inactive_time', '30d')
  $configured_nginx_resolver = zulipconf('application_server', 'nameserver', '')
  if $configured_nginx_resolver == '' {
    # This may fail in the unlikely change that there is no configured
    # resolver in /etc/resolv.conf, so only call it is unset in zulip.conf
    $nginx_resolver_ip = resolver_ip()
  } elsif (':' in $configured_nginx_resolver) and ! ('.' in $configured_nginx_resolver)  and ! ('[' in $configured_nginx_resolver) {
    # Assume this is IPv6, which needs square brackets.
    $nginx_resolver_ip = "[${configured_nginx_resolver}]"
  } else {
    $nginx_resolver_ip = $configured_nginx_resolver
  }
  file { '/etc/nginx/zulip-include/s3-cache':
    require => [
      Package[$zulip::common::nginx],
      File['/srv/zulip-uploaded-files-cache'],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/nginx/s3-cache.template.erb'),
    notify  => Service['nginx'],
  }

  file { '/etc/nginx/zulip-include/app.d/uploads-internal.conf':
    ensure  => file,
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    notify  => Service['nginx'],
    source  => 'puppet:///modules/zulip/nginx/zulip-include-frontend/uploads-internal.conf',
  }

  # This determines whether we run queue processors multithreaded or
  # multiprocess.  Multiprocess scales much better, but requires more
  # RAM; we just auto-detect based on available system RAM.
  #
  # Because Zulip can run in the multiprocess mode with 4GB of memory,
  # and it's a common instance size, we aim for that to be the cutoff
  # for this higher-performance mode.
  #
  # We use a cutoff less than 4000 here to detect systems advertised
  # as "4GB"; some may have as little as 4 x 1000^3 / 1024^2 ≈ 3815 MiB
  # of memory.
  $queues_multiprocess_default = $zulip::common::total_memory_mb > 3800
  $queues_multiprocess = zulipconf('application_server', 'queue_workers_multiprocess', $queues_multiprocess_default)
  $queues = [
    'deferred_work',
    'digest_emails',
    'email_mirror',
    'embed_links',
    'embedded_bots',
    'email_senders',
    'deferred_email_senders',
    'missedmessage_emails',
    'missedmessage_mobile_notifications',
    'outgoing_webhooks',
    'thumbnail',
    'user_activity',
    'user_activity_interval',
  ]

  if $zulip::common::total_memory_mb > 24000 {
    $uwsgi_default_processes = 16
  } elsif $zulip::common::total_memory_mb > 12000 {
    $uwsgi_default_processes = 8
  } elsif $zulip::common::total_memory_mb > 6000 {
    $uwsgi_default_processes = 6
  } elsif $zulip::common::total_memory_mb > 3000 {
    $uwsgi_default_processes = 4
  } else {
    $uwsgi_default_processes = 3
  }

  # Not the different naming scheme for sharded workers, where each gets its own queue,
  # vs when multiple workers service the same queue.
  $worker_counts = Hash(zulipconf_keys('application_server').filter |$key| {
    $key =~ /_workers$/
  }.map |$key| {
    [regsubst($key, '_workers$', ''), Integer(zulipconf('application_server', $key, 1))]
  })
  $mobile_notification_shards = Integer(zulipconf('application_server', 'mobile_notification_shards', 1))
  $user_activity_shards = Integer(zulipconf('application_server', 'user_activity_shards', 1))
  $tornado_ports = $zulip::tornado_sharding::tornado_ports

  $proxy_host = zulipconf('http_proxy', 'host', 'localhost')
  $proxy_port = zulipconf('http_proxy', 'port', '4750')

  if ($proxy_host in ['localhost', '127.0.0.1', '::1']) and ($proxy_port == '4750') {
    include zulip::smokescreen
  }

  $katex_server = zulipconf('application_server', 'katex_server', true)
  $katex_server_port = zulipconf('application_server', 'katex_server_port', '9700')

  $tusd_server_listen = zulipconf('application_server', 'tusd_server_listen', '127.0.0.1')

  if $proxy_host != '' and $proxy_port != '' {
    $proxy = "http://${proxy_host}:${proxy_port}"
  } else {
    $proxy = ''
  }
  file { "${zulip::common::supervisor_conf_dir}/zulip.conf":
    ensure  => file,
    require => [Package[supervisor], Exec['stage_updated_sharding']],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/supervisor/zulip.conf.template.erb'),
    notify  => Service[$zulip::common::supervisor_service],
  }

  $uwsgi_rolling_restart = zulipconf('application_server', 'rolling_restart', false)
  $uwsgi_listen_backlog_limit = zulipconf('application_server', 'uwsgi_listen_backlog_limit', 128)
  $uwsgi_processes = zulipconf('application_server', 'uwsgi_processes', $uwsgi_default_processes)
  $somaxconn = 2 * Integer($uwsgi_listen_backlog_limit)
  file { '/etc/zulip/uwsgi.ini':
    ensure  => file,
    require => Package[supervisor],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/uwsgi.ini.template.erb'),
    notify  => Service[$zulip::common::supervisor_service],
  }
  zulip::sysctl { 'uwsgi':
    comment => 'Allow larger listen backlog',
    key     => 'net.core.somaxconn',
    value   => $somaxconn,
  }

  file { [
    '/home/zulip/tornado',
    '/home/zulip/prod-static',
    '/home/zulip/deployments',
    '/srv/zulip-locks',
    '/srv/zulip-emoji-cache',
    '/srv/zulip-uploaded-files-cache',
  ]:
    ensure => directory,
    owner  => 'zulip',
    group  => 'zulip',
    mode   => '0755',
  }
  file { [
    '/var/log/zulip/queue_error',
    '/var/log/zulip/queue_stats',
  ]:
    ensure => directory,
    owner  => 'zulip',
    group  => 'zulip',
    mode   => '0750',
  }
  $access_log_retention_days = zulipconf('application_server','access_log_retention_days', 14)
  file { '/etc/logrotate.d/zulip':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/logrotate/zulip.template.erb'),
  }

  zulip::nagios_plugins {'zulip_app_frontend': }

  # This cron job does nothing unless RATE_LIMIT_TOR_TOGETHER is enabled.
  zulip::cron { 'fetch-tor-exit-nodes':
    minute => '17',
  }
  # This was originally added with a typo in the name.
  file { '/etc/cron.d/fetch-for-exit-nodes':
    ensure => absent,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: app_frontend_once.pp]---
Location: zulip-main/puppet/zulip/manifests/app_frontend_once.pp

```text
# Cron jobs and other tools that should run on only one Zulip server
# in a cluster.

class zulip::app_frontend_once {
  include zulip::hooks::send_zulip_update_announcements

  $proxy_host = zulipconf('http_proxy', 'host', 'localhost')
  $proxy_port = zulipconf('http_proxy', 'port', '4750')
  if $proxy_host != '' and $proxy_port != '' {
    $proxy = "http://${proxy_host}:${proxy_port}"
  } else {
    $proxy = ''
  }
  file { "${zulip::common::supervisor_conf_dir}/zulip-once.conf":
    ensure  => file,
    require => [Package[supervisor], Exec['stage_updated_sharding']],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/supervisor/zulip-once.conf.template.erb'),
    notify  => Service[$zulip::common::supervisor_service],
  }

  # Every-hour
  zulip::cron { 'update-analytics-counts':
    minute => '5',
  }
  zulip::cron { 'check-analytics-state':
    minute => '30',
  }
  zulip::cron { 'promote-new-full-members':
    minute => '35',
  }
  zulip::cron { 'send_zulip_update_announcements':
    minute => '47',
  }

  # Daily
  zulip::cron { 'soft-deactivate-users':
    hour   => '5',
    minute => '0',
    manage => 'soft_deactivate_users -d',
  }
  zulip::cron { 'delete-old-unclaimed-attachments':
    hour   => '5',
    minute => '0',
    manage => 'delete_old_unclaimed_attachments -f',
  }
  zulip::cron { 'archive-messages':
    hour   => '6',
    minute => '0',
  }
  zulip::cron { 'send-digest-emails':
    hour   => '18',
    minute => '0',
    manage => 'enqueue_digest_emails',
  }
  # Most deploys will re-run this for all streams, daily; large
  # deploys may set this to a number >= 25 to only update streams with
  # recent potential changes.
  $update_subscriber_count_incremental = zulipconf('application_server', 'update_subscriber_count_incremental', '')
  if $update_subscriber_count_incremental != '' {
    $update_subscriber_count_arg = " --since ${update_subscriber_count_incremental}"
  } else {
    $update_subscriber_count_arg = ''
  }
  zulip::cron { 'update_subscriber_counts':
    hour   => '6',
    minute => '0',
    manage => "update_subscriber_counts${update_subscriber_count_arg}"
  }
  zulip::cron { 'clearsessions':
    hour   => '22',
    minute => '22',
  }

  # Weekly
  zulip::cron { 'update-channel-recently-active-status':
    hour   => '5',
    minute => '0',
    dow    => '0',
    manage => 'update_channel_recently_active_status',
  }

}
```

--------------------------------------------------------------------------------

---[FILE: apt_repository.pp]---
Location: zulip-main/puppet/zulip/manifests/apt_repository.pp

```text
class zulip::apt_repository {
  $setup_apt_repo_file = "${facts['zulip_scripts_path']}/lib/setup-apt-repo"
  exec{'setup_apt_repo':
    command => "bash -c '${setup_apt_repo_file}'",
    unless  => "bash -c '${setup_apt_repo_file} --verify'",
  }
}
```

--------------------------------------------------------------------------------

---[FILE: camo.pp]---
Location: zulip-main/puppet/zulip/manifests/camo.pp

```text
class zulip::camo (String $listen_address = '0.0.0.0') {
  $version = $zulip::common::versions['go-camo']['version']
  $goversion = $zulip::common::versions['go-camo']['goversion']
  $dir = "/srv/zulip-go-camo-${version}"
  $bin = "${dir}/bin/go-camo"

  zulip::external_dep { 'go-camo':
    version        => $version,
    url            => "https://github.com/cactus/go-camo/releases/download/v${version}/go-camo-${version}.go${goversion}.linux-${zulip::common::goarch}.tar.gz",
    tarball_prefix => "go-camo-${version}",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }

  # We would like to not waste resources by going through Smokescreen,
  # as go-camo already prohibits private-IP access; but a
  # non-Smokescreen exit proxy may be required to access the public
  # Internet.  The `enable_for_camo` flag, if it exists, can override
  # our guess, in either direction.
  $proxy_host = zulipconf('http_proxy', 'host', 'localhost')
  $proxy_port = zulipconf('http_proxy', 'port', '4750')
  $proxy_is_smokescreen = ($proxy_host in ['localhost', '127.0.0.1', '::1']) and ($proxy_port == '4750')
  $camo_use_proxy = zulipconf('http_proxy', 'enable_for_camo', !$proxy_is_smokescreen)
  if $camo_use_proxy {
    if $proxy_is_smokescreen {
      include zulip::smokescreen
    }

    if $proxy_host != '' and $proxy_port != '' {
      $proxy = "http://${proxy_host}:${proxy_port}"
    } else {
      $proxy = ''
    }
  } else {
    $proxy = ''
  }

  $zulip_version = $facts['zulip_version']
  $external_uri = pick(get_django_setting_slow('ROOT_DOMAIN_URI'), 'https://zulip.com')
  file { "${zulip::common::supervisor_conf_dir}/go-camo.conf":
    ensure  => file,
    require => [
      Package[supervisor],
      File[$bin],
      File['/usr/local/bin/secret-env-wrapper'],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/supervisor/go-camo.conf.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: certbot.pp]---
Location: zulip-main/puppet/zulip/manifests/certbot.pp

```text
class zulip::certbot {
  package { 'certbot':
    ensure => installed,
  }
  file { ['/etc/letsencrypt/renewal-hooks', '/etc/letsencrypt/renewal-hooks/deploy']:
    ensure  => directory,
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
    require => Package[certbot],
  }
}
```

--------------------------------------------------------------------------------

````

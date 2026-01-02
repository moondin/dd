---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 437
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 437 of 1290)

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

---[FILE: prometheus_server.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/prometheus_server.pp

```text
# @summary Gathers Prometheus statistics from all nodes.
#
# Only one instance is necessary.
#
class kandra::profile::prometheus_server inherits kandra::profile::base {

  include kandra::prometheus::base

  # This blackbox monitoring of the backup system runs locally
  include kandra::prometheus::wal_g

  # Ditto the Akamai logs
  include kandra::prometheus::akamai

  # Ditto Weblate
  include kandra::prometheus::weblate

  # The SES log ETL (writing to S3) runs on vector
  include kandra::ses_logs

  # Export prometheus stats to status.zulip.com
  include kandra::statuspage

  $version = $zulip::common::versions['prometheus']['version']
  $dir = "/srv/zulip-prometheus-${version}"
  $bin = "${dir}/prometheus"
  $data_dir = '/var/lib/prometheus'

  zulip::external_dep { 'prometheus':
    version        => $version,
    url            => "https://github.com/prometheus/prometheus/releases/download/v${version}/prometheus-${version}.linux-${zulip::common::goarch}.tar.gz",
    tarball_prefix => "prometheus-${version}.linux-${zulip::common::goarch}",
    bin            => [$bin, "${dir}/promtool"],
    cleanup_after  => [Service[supervisor]],
  }
  file { '/usr/local/bin/promtool':
    ensure  => link,
    target  => "${dir}/promtool",
    require => File["${dir}/promtool"],
    before  => Exec['Cleanup prometheus'],
  }

  file { $data_dir:
    ensure  => directory,
    owner   => 'prometheus',
    group   => 'prometheus',
    require => [ User[prometheus], Group[prometheus] ],
  }
  file { '/etc/prometheus':
    ensure => directory,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
  }

  $czo = zulipconf('prometheus', 'czo', '')
  $other_hosts = split(zulipconf('prometheus', 'other_hosts', ''), ',')
  $backup_buckets = split(zulipconf('prometheus', 'walg_buckets', ''), ',')
  file { '/etc/prometheus/prometheus.yaml':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/prometheus/prometheus.yaml.template.erb'),
    notify  => Service[supervisor],
  }

  file { "${zulip::common::supervisor_conf_dir}/prometheus.conf":
    ensure  => file,
    require => [
      Package[supervisor],
      File[$bin],
      File[$data_dir],
      File['/etc/prometheus/prometheus.yaml'],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/prometheus.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: redis.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/redis.pp

```text
class kandra::profile::redis inherits kandra::profile::base {
  include zulip::profile::redis
  include kandra::prometheus::redis

  zulip::sysctl { 'redis-somaxconn':
    key   => 'net.core.somaxconn',
    value => '65535',
  }

  # Need redis_password in its own file for Nagios
  file { '/var/lib/nagios/redis_password':
    ensure  => file,
    mode    => '0600',
    owner   => 'nagios',
    group   => 'nagios',
    content => "${zulip::profile::redis::redis_password}\n",
  }

  group { 'redistunnel':
    ensure => present,
    gid    => '1080',
  }
  user { 'redistunnel':
    ensure     => present,
    uid        => '1080',
    gid        => '1080',
    groups     => ['zulip'],
    shell      => '/bin/true',
    home       => '/home/redistunnel',
    managehome => true,
  }
  kandra::user_dotfiles { 'redistunnel':
    authorized_keys => true,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: smokescreen.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/smokescreen.pp

```text
class kandra::profile::smokescreen inherits kandra::profile::base {


  include zulip::profile::smokescreen
  kandra::firewall_allow { 'smokescreen': port => '4750' }
  kandra::firewall_allow { 'smokescreen_metrics': port => '4760' }

  include kandra::camo
}
```

--------------------------------------------------------------------------------

---[FILE: staging_app_frontend.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/staging_app_frontend.pp

```text
class kandra::profile::staging_app_frontend inherits kandra::profile::base {

  include kandra::app_frontend

  file { '/etc/nginx/sites-available/zulip-staging':
    ensure  => file,
    require => Package['nginx-full'],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/kandra/nginx/sites-available/zulip-staging',
    notify  => Service['nginx'],
  }
  file { '/etc/nginx/sites-enabled/zulip-staging':
    ensure  => link,
    require => Package['nginx-full'],
    target  => '/etc/nginx/sites-available/zulip-staging',
    notify  => Service['nginx'],
  }

  # Eventually, this will go in a staging_app_frontend_once.pp
  zulip::cron { 'check_send_receive_time':
    hour      => '*',
    minute    => '*',
    command   => '/usr/lib/nagios/plugins/zulip_app_frontend/check_send_receive_time',
    use_proxy => false,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: teleport.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/teleport.pp

```text
class kandra::profile::teleport inherits kandra::profile::base {


  file { '/etc/teleport_server.yaml':
    owner  => 'root',
    group  => 'root',
    mode   => '0644',
    source => 'puppet:///modules/kandra/teleport_server.yaml',
    notify => Service['teleport_server'],
  }
  kandra::teleport::part { 'server': }

  # https://goteleport.com/docs/admin-guide/#ports
  # Port 443 is outward-facing, for UI
  kandra::firewall_allow { 'teleport_server_ui': port => 443 }
  # Port 3023 is outward-facing, for teleport clients to connect to.
  kandra::firewall_allow { 'teleport_server_proxy': port => 3023 }
  # Port 3034 is outward-facing, for teleport servers outside the
  # cluster to connect back to establish reverse proxies.
  kandra::firewall_allow { 'teleport_server_reverse': port => 3024 }
  # Port 3025 is inward-facing, for other nodes to look up auth information
  kandra::firewall_allow { 'teleport_server_auth': port => 3025 }
}
```

--------------------------------------------------------------------------------

---[FILE: zulipbot_zulip_org.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/zulipbot_zulip_org.pp

```text
class kandra::profile::zulipbot_zulip_org inherits kandra::profile::base {

  kandra::firewall_allow { 'http': }
  kandra::firewall_allow { 'https': }

  # TODO: This does not do any configuration of zulipbot itself, or of
  # caddy.
}
```

--------------------------------------------------------------------------------

---[FILE: akamai.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/akamai.pp

```text
# @summary Prometheus monitoring of Akamai access logs
#
class kandra::prometheus::akamai {
  include kandra::prometheus::base
  include kandra::vector
  include zulip::supervisor

  $pipelines = {
    'static' => zulipsecret('secrets', 'akamai_static_sqs_url', ''),
    'realm'  => zulipsecret('secrets', 'akamai_realm_sqs_url', ''),
  }

  concat::fragment { 'vector_akamai':
    target  => $kandra::vector::conf,
    order   => '50',
    content => template('kandra/vector_akamai.toml.template.erb'),
  }
  concat::fragment { 'vector_akamai_export':
    target  => $kandra::vector::conf,
    content => ',"akamai_logs2metrics*"',
    order   => '90',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: base.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/base.pp

```text
# @summary Configures a node for monitoring with Prometheus
#
class kandra::prometheus::base {
  group { 'prometheus':
    ensure => present,
    gid    => '1060',
  }
  user { 'prometheus':
    ensure     => present,
    uid        => '1060',
    gid        => '1060',
    shell      => '/bin/bash',
    home       => '/nonexistent',
    managehome => false,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: grok.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/grok.pp

```text
# @summary Parses nginx access_log files
#
class kandra::prometheus::grok {
  include kandra::prometheus::base
  include zulip::supervisor

  $version = $zulip::common::versions['grok_exporter']['version']
  $dir = "/srv/zulip-grok_exporter-${version}"
  $bin = "${dir}/grok_exporter"

  zulip::external_dep { 'grok_exporter':
    version        => $version,
    url            => "https://github.com/fstab/grok_exporter/releases/download/v${version}/grok_exporter-${version}.linux-${zulip::common::goarch}.zip",
    tarball_prefix => "grok_exporter-${version}.linux-${zulip::common::goarch}",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }

  $realm_names_regex = zulipconf('grok_exporter', 'realm_names_regex', '__impossible__')
  $include_dir = "${dir}/patterns"
  file { '/etc/grok_exporter.yaml':
    ensure  => file,
    owner   => zulip,
    group   => zulip,
    mode    => '0644',
    content => template('kandra/prometheus/grok_exporter.yaml.template.erb'),
    notify  => Service[supervisor],
  }

  kandra::firewall_allow { 'grok_exporter': port => '9144' }
  file { "${zulip::common::supervisor_conf_dir}/prometheus_grok_exporter.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File[$bin],
      File['/etc/grok_exporter.yaml'],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/prometheus_grok_exporter.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: memcached.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/memcached.pp

```text
# @summary Export memcached stats, with SASL auth
#
# We cannot use the stock
# https://github.com/prometheus/memcached_exporter because it does not
# support SASL auth, which we require.  Re-implement it in Python,
# using bmemcached.
class kandra::prometheus::memcached {
  include kandra::prometheus::base
  include zulip::supervisor

  # We embed the hash of the contents into the name of the process, so
  # that `supervisorctl reread` knows that it has updated.
  $full_exporter_hash = sha256(file('kandra/memcached_exporter'))
  $exporter_hash = $full_exporter_hash[0,8]

  $bin = '/usr/local/bin/memcached_exporter'
  file { $bin:
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
    source => 'puppet:///modules/kandra/memcached_exporter',
  }

  kandra::firewall_allow { 'memcached_exporter': port => '11212' }
  file { "${zulip::common::supervisor_conf_dir}/memcached_exporter.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File[$bin],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/memcached_exporter.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: node.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/node.pp

```text
# @summary Configures a node for monitoring with Prometheus
#
class kandra::prometheus::node {
  include kandra::prometheus::base
  include zulip::supervisor

  $version = $zulip::common::versions['node_exporter']['version']
  $dir = "/srv/zulip-node_exporter-${version}"
  $bin = "${dir}/node_exporter"

  zulip::external_dep { 'node_exporter':
    version        => $version,
    url            => "https://github.com/prometheus/node_exporter/releases/download/v${version}/node_exporter-${version}.linux-${zulip::common::goarch}.tar.gz",
    tarball_prefix => "node_exporter-${version}.linux-${zulip::common::goarch}",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }

  kandra::firewall_allow { 'node_exporter': port => '9100' }
  file { "${zulip::common::supervisor_conf_dir}/prometheus_node_exporter.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File[$bin],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/prometheus_node_exporter.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/postgresql.pp

```text
# @summary Prometheus monitoring of postgresql servers
#
class kandra::prometheus::postgresql {
  include kandra::prometheus::base
  include zulip::supervisor
  include zulip::golang

  $version = $zulip::common::versions['postgres_exporter-src']['version']
  $dir = "/srv/zulip-postgres_exporter-src-${version}"
  $bin = "/usr/local/bin/postgres_exporter-${version}-go-${zulip::golang::version}"

  # Binary builds: https://github.com/prometheus-community/postgres_exporter/releases/download/v${version}/postgres_exporter-${version}.linux-${zulip::common::goarch}.tar.gz

  zulip::external_dep { 'postgres_exporter-src':
    version        => $version,
    url            => "https://github.com/alexmv/postgres_exporter/archive/${version}.tar.gz",
    tarball_prefix => "postgres_exporter-${version}",
  }

  exec { 'compile postgres_exporter':
    command     => "make build && cp ./postgres_exporter ${bin}",
    cwd         => $dir,
    # GOCACHE is required; nothing is written to GOPATH, but it is required to be set
    environment => ['GOCACHE=/tmp/gocache', 'GOPATH=/root/go'],
    path        => [
      "${zulip::golang::dir}/bin",
      '/usr/local/bin',
      '/usr/bin',
      '/bin',
    ],
    creates     => $bin,
    require     => [
      Zulip::External_Dep['golang'],
      Zulip::External_Dep['postgres_exporter-src'],
    ],
    notify      => Exec['Cleanup postgres_exporter'],
  }
  # This resource is created by the 'compile postgres_exporter' step.
  file { $bin:
    ensure  => file,
    require => Exec['compile postgres_exporter'],
  }
  exec { 'Cleanup postgres_exporter':
    refreshonly => true,
    provider    => shell,
    onlyif      => "ls /usr/local/bin/postgres_exporter-* | grep -xv '${bin}'",
    command     => "ls /usr/local/bin/postgres_exporter-* | grep -xv '${bin}' | xargs rm -r",
    require     => [File[$bin], Service[supervisor]],
  }

  if false {
    # This is left commented out, since it only makes sense to run
    # against a server where the database exists and is writable --
    # the former of which happens outside th scope of puppet right
    # now, and the latter of which can only be determined after the
    # database is in place.  Given that it has been run once, we do
    # not expect to ever need it to run again; it is left here for
    # completeness.
    include zulip::postgresql_client
    exec { 'create prometheus postgres user':
      require => Class['zulip::postgresql_client'],
      command => '/usr/bin/createuser -g pg_monitor prometheus',
      unless  => 'test -f /usr/bin/psql && /usr/bin/psql -tAc "select usename from pg_user" | /bin/grep -xq prometheus)',
      user    => 'postgres',
      before  => File["${zulip::common::supervisor_conf_dir}/prometheus_postgres_exporter.conf"],
    }
  }

  kandra::firewall_allow { 'postgres_exporter': port => '9187' }
  file { "${zulip::common::supervisor_conf_dir}/prometheus_postgres_exporter.conf":
    ensure  => file,
    require => [
      User[prometheus],
      Package[supervisor],
      File[$bin],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/prometheus_postgres_exporter.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: process.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/process.pp

```text
# @summary Prometheus monitoring of Zulip server processes
#
class kandra::prometheus::process {
  include kandra::prometheus::base
  include zulip::supervisor

  $version = $zulip::common::versions['process_exporter']['version']
  $dir = "/srv/zulip-process_exporter-${version}"
  $bin = "${dir}/process-exporter"
  $conf = '/etc/zulip/process_exporter.yaml'

  zulip::external_dep { 'process_exporter':
    version        => $version,
    url            => "https://github.com/ncabatoff/process-exporter/releases/download/v${version}/process-exporter-${version}.linux-${zulip::common::goarch}.tar.gz",
    tarball_prefix => "process-exporter-${version}.linux-${zulip::common::goarch}",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }

  kandra::firewall_allow { 'process_exporter': port => '9256' }
  file { $conf:
    ensure  => file,
    require => User[zulip],
    owner   => 'zulip',
    group   => 'zulip',
    mode    => '0644',
    source  => 'puppet:///modules/kandra/process_exporter.yaml',
  }
  file { "${zulip::common::supervisor_conf_dir}/prometheus_process_exporter.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File[$bin],
      File[$conf],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/prometheus_process_exporter.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: pushgateway.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/pushgateway.pp

```text
# @summary Pushgateway for cron jobs
#
class kandra::prometheus::pushgateway {
  include kandra::prometheus::base
  include zulip::supervisor

  $version = $zulip::common::versions['pushgateway']['version']
  $dir = "/srv/zulip-pushgateway-${version}"
  $bin = "${dir}/pushgateway"

  zulip::external_dep { 'pushgateway':
    version        => $version,
    url            => "https://github.com/prometheus/pushgateway/releases/download/v${version}/pushgateway-${version}.linux-${zulip::common::goarch}.tar.gz",
    tarball_prefix => "pushgateway-${version}.linux-${zulip::common::goarch}",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }

  file { "${zulip::common::supervisor_conf_dir}/prometheus_pushgateway.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File[$bin],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/prometheus_pushgateway.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: rabbitmq.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/rabbitmq.pp

```text
# @summary Prometheus monitoring of rabbitmq server.  This is done via
# the built-in prometheus plugin which serves on port 15692:
# https://www.rabbitmq.com/prometheus.html
#
class kandra::prometheus::rabbitmq {
  include kandra::prometheus::base

  exec { 'enable rabbitmq-prometheus':
    command => 'rabbitmq-plugins enable rabbitmq_prometheus',
    unless  => 'grep -q rabbitmq_prometheus /etc/rabbitmq/enabled_plugins',
    require => Service['rabbitmq-server'],
  }
  exec { 'enable rabbitmq-prometheus-per-metric':
    command => "rabbitmqctl eval 'application:set_env(rabbitmq_prometheus, return_per_object_metrics, true).'",
    unless  => @("EOT"),
      [ -f /usr/sbin/rabbitmqctl ] &&
      /usr/sbin/rabbitmqctl eval 'application:get_env(rabbitmq_prometheus, return_per_object_metrics).' \
        | grep -q true
      | EOT
    require => Exec['enable rabbitmq-prometheus'],
  }
  kandra::firewall_allow { 'rabbitmq': port => '15692' }
}
```

--------------------------------------------------------------------------------

---[FILE: redis.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/redis.pp

```text
# @summary Prometheus monitoring of redis servers
#
class kandra::prometheus::redis {
  include kandra::prometheus::base
  include zulip::supervisor

  $version = $zulip::common::versions['redis_exporter']['version']
  $dir = "/srv/zulip-redis_exporter-${version}"
  $bin = "${dir}/redis_exporter"

  zulip::external_dep { 'redis_exporter':
    version        => $version,
    url            => "https://github.com/oliver006/redis_exporter/releases/download/v${version}/redis_exporter-v${version}.linux-${zulip::common::goarch}.tar.gz",
    tarball_prefix => "redis_exporter-v${version}.linux-${zulip::common::goarch}",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }

  kandra::firewall_allow { 'redis_exporter': port => '9121' }
  file { "${zulip::common::supervisor_conf_dir}/prometheus_redis_exporter.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File[$bin],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/prometheus_redis_exporter.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: uwsgi.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/uwsgi.pp

```text
# @summary Prometheus monitoring of uwsgi servers
#
class kandra::prometheus::uwsgi {
  include kandra::prometheus::base
  include zulip::supervisor

  $version = $zulip::common::versions['uwsgi_exporter']['version']
  $dir = "/srv/zulip-uwsgi_exporter-${version}"
  $bin = "${dir}/uwsgi_exporter"

  zulip::external_dep { 'uwsgi_exporter':
    version        => $version,
    url            => "https://github.com/timonwong/uwsgi_exporter/releases/download/v${version}/uwsgi_exporter-${version}.linux-${zulip::common::goarch}.tar.gz",
    tarball_prefix => "uwsgi_exporter-${version}.linux-${zulip::common::goarch}",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }

  kandra::firewall_allow { 'uwsgi_exporter': port => '9238' }
  file { "${zulip::common::supervisor_conf_dir}/prometheus_uwsgi_exporter.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File[$bin],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/prometheus_uwsgi_exporter.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: wal_g.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/wal_g.pp

```text
# @summary Prometheus monitoring of wal-g backups
#
class kandra::prometheus::wal_g {
  include kandra::prometheus::base
  include zulip::supervisor
  include zulip::wal_g

  file { '/usr/local/bin/wal-g-exporter':
    ensure  => file,
    require => User[zulip],
    owner   => 'zulip',
    group   => 'zulip',
    mode    => '0755',
    source  => 'puppet:///modules/zulip/postgresql/wal-g-exporter',
  }

  # We embed the hash of the contents into the name of the process, so
  # that `supervisorctl reread` knows that it has updated.
  $full_exporter_hash = sha256(file('zulip/postgresql/wal-g-exporter'))
  $exporter_hash = $full_exporter_hash[0,8]
  file { "${zulip::common::supervisor_conf_dir}/prometheus_wal_g_exporter.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File['/usr/local/bin/wal-g-exporter'],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/prometheus_wal_g_exporter.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: weblate.pp]---
Location: zulip-main/puppet/kandra/manifests/prometheus/weblate.pp

```text
# @summary Export Weblate translation stats
class kandra::prometheus::weblate {
  include kandra::prometheus::base
  include zulip::supervisor

  # We embed the hash of the contents into the name of the process, so
  # that `supervisorctl reread` knows that it has updated.
  $full_exporter_hash = sha256(file('kandra/weblate_exporter'))
  $exporter_hash = $full_exporter_hash[0,8]

  $bin = '/usr/local/bin/weblate_exporter'
  file { $bin:
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
    source => 'puppet:///modules/kandra/weblate_exporter',
  }

  file { "${zulip::common::supervisor_conf_dir}/weblate_exporter.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File[$bin],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/weblate_exporter.conf.template.erb'),
    notify  => Service[supervisor],
  }

  include kandra::prometheus::pushgateway
  zulip::cron { 'weblate-to-pushgateway':
    minute    => '*/15',
    command   => 'curl http://localhost:9189/metrics | curl --data-binary @- http://localhost:9091/metrics/job/weblate',
    use_proxy => false,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: application.pp]---
Location: zulip-main/puppet/kandra/manifests/teleport/application.pp

```text
# @summary Adds an http "application" to the Teleport configuration for the host.
#
# See https://goteleport.com/docs/application-access/
define kandra::teleport::application (
  $port,
  $description = '',
  $order = '50',
) {
  include kandra::teleport::application_top
  concat::fragment { "teleport_app_${name}":
    target  => '/etc/teleport_node.yaml',
    order   => $order,
    content => template('kandra/teleport_app.yaml.template.erb'),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: application_top.pp]---
Location: zulip-main/puppet/kandra/manifests/teleport/application_top.pp

```text
# @summary Enables application support on the node; include once.
#
# See https://goteleport.com/docs/application-access/
class kandra::teleport::application_top {
  concat::fragment { 'teleport_app':
    target => '/etc/teleport_node.yaml',
    order  => '10',
    source => 'puppet:///modules/kandra/teleport_app.yaml',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: base.pp]---
Location: zulip-main/puppet/kandra/manifests/teleport/base.pp

```text
class kandra::teleport::base {
  include zulip::supervisor

  $setup_apt_repo_file = "${facts['zulip_scripts_path']}/lib/setup-apt-repo"
  exec{ 'setup-apt-repo-teleport':
    command => "${setup_apt_repo_file} --list teleport",
    unless  => "${setup_apt_repo_file} --list teleport --verify",
  }
  package { 'teleport':
    ensure  => installed,
    require => Exec['setup-apt-repo-teleport'],
  }
  service { 'teleport':
    ensure  => stopped,
    enable  => mask,
    require => Package['teleport'],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: db.pp]---
Location: zulip-main/puppet/kandra/manifests/teleport/db.pp

```text
# @summary Provide Teleport SSH access to a node.
#
# https://goteleport.com/docs/admin-guide/#adding-nodes-to-the-cluster
# details additional manual steps to allow a node to join the cluster.
class kandra::teleport::db {
  include kandra::teleport::base

  $fqdn = $facts['networking']['fqdn']
  $hostname = $facts['networking']['hostname']
  $is_ec2 = zulipconf('machine', 'hosting_provider', 'ec2') == 'ec2'
  $join_token = zulipsecret('secrets', 'teleport_join_token', '')
  file { '/etc/teleport_db.yaml':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/teleport_db.yaml.template.erb'),
    notify  => Service['teleport_db'],
  }

  kandra::teleport::part { 'db': }
}
```

--------------------------------------------------------------------------------

---[FILE: node.pp]---
Location: zulip-main/puppet/kandra/manifests/teleport/node.pp

```text
# @summary Provide Teleport SSH access to a node.
#
# EC2 nodes will automatically join the cluster; non-EC2 hosts will
# need to set a teleport_join_token secret.  See
# https://goteleport.com/docs/agents/join-services-to-your-cluster/join-token/#generate-a-token
class kandra::teleport::node {
  include kandra::teleport::base

  $is_ec2 = zulipconf('machine', 'hosting_provider', 'ec2') == 'ec2'
  $join_token = zulipsecret('secrets', 'teleport_join_token', '')
  concat { '/etc/teleport_node.yaml':
    ensure => present,
    owner  => 'root',
    group  => 'root',
    mode   => '0644',
    notify => Service['teleport_node'],
  }
  concat::fragment { 'teleport_node_base':
    target  => '/etc/teleport_node.yaml',
    content => template('kandra/teleport_node.yaml.template.erb'),
    order   => '01',
  }

  kandra::teleport::part { 'node': }

  $host_ca_path = '/etc/ssl/certs/teleport-ca-host.cert'
  $host_ca_extract = @("EOT")
    sqlite3 /var/lib/teleport/proc/sqlite.db "select value from kv where key = '/ids/node/current'" \
      | jq -r .spec.tls_ca_certs[] \
      | base64 -d \
      > ${host_ca_path}
    | EOT
  exec { 'teleport host CA':
    require => [Service['teleport_node'], Package['sqlite3']],
    creates => $host_ca_path,
    command => $host_ca_extract,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: part.pp]---
Location: zulip-main/puppet/kandra/manifests/teleport/part.pp

```text
# @summary Adds a systemd service named teleport_$name
#
define kandra::teleport::part() {
  $part = $name

  include zulip::systemd_daemon_reload
  file { "/etc/systemd/system/teleport_${part}.service":
    require => [
      Package[teleport],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/teleport.service.template.erb'),
    notify  => [Exec['reload systemd'], Service["teleport_${part}"]],
  }

  service {"teleport_${part}":
    ensure  => running,
    enable  => true,
    require => [Service['supervisor'], Service['teleport'], Exec['reload systemd']],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: grafana.ini.template.erb]---
Location: zulip-main/puppet/kandra/templates/grafana.ini.template.erb

```text
#################################### Paths ####################################
[paths]
# Path to where grafana can store temp files, sessions, and the sqlite3 db
data = /var/lib/grafana

# Directory where grafana can store logs
logs = /var/log/grafana

# Directory where grafana will automatically scan and look for plugins
plugins = /var/lib/grafana/plugins


#################################### Server ####################################
[server]
# Protocol (http, https, h2, socket)
protocol = http

# The ip address to bind to, empty will bind to all interfaces
http_addr = 127.0.0.1

# The http port to use
http_port = 3000

# The public facing domain name used to access grafana from a browser
domain = monitoring.teleport.zulipchat.net

# The full public facing url you use in browser, used for redirects and emails
# If you use reverse proxy and sub path specify full url (with sub path)
root_url = https://monitoring.teleport.zulipchat.net/


#################################### SMTP ####################################
[smtp]
enabled = true
from_name = Grafana
from_address = <%= @email_from %>
host = <%= @email_host %>
user = <%= @email_user %>
password = <%= @email_password %>
startTLS_policy = MandatoryStartTLS


#################################### Auth JWT ####################################
[auth.jwt]
# Grafana should trust the JWT that is provided in a header from Teleport; see
# https://goteleport.com/docs/application-access/guides/jwt/ and
# https://grafana.com/docs/grafana/latest/auth/jwt/
enabled = true
header_name = Teleport-Jwt-Assertion
username_claim = sub
jwk_set_url = https://teleport.zulipchat.net/.well-known/jwks.json
cache_ttl = 24h
expect_claims = {"iss": "teleport.zulipchat.net"}
auto_sign_up = true
skip_org_role_sync = true

#################################### Alerting ####################################
# Switch to the Grafana 8 unified alerting
# https://grafana.com/docs/grafana/latest/alerting/unified-alerting/opt-in/#enable-grafana-alerting
[unified_alerting]
enabled = true

[alerting]
enabled = false
```

--------------------------------------------------------------------------------

---[FILE: msmtprc_nagios.template.erb]---
Location: zulip-main/puppet/kandra/templates/msmtprc_nagios.template.erb

```text
from <%= @nagios_alert_email %>
user postmaster@nagios.<%= @default_host_domain %>
password <%= @nagios_mail_password %>

host <%= @nagios_mail_host %>
port 587
auth on

protocol smtp

maildomain <%= @nagios_mail_domain %>
domain <%= @nagios_mail_domain %>

tls on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
```

--------------------------------------------------------------------------------

---[FILE: nagios_apache_site.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/nagios_apache_site.conf.template.erb

```text
<VirtualHost 127.0.0.1>
    ServerName nagios.teleport.<%= @default_host_domain %>

    Header add Strict-Transport-Security "max-age=15768000"
    Header add X-Frame-Options DENY

    ScriptAlias /cgi-bin/nagios4 /usr/lib/cgi-bin/nagios4
    ScriptAlias /nagios4/cgi-bin /usr/lib/cgi-bin/nagios4

    # Where the stylesheets (config files) reside
    Alias /nagios4/stylesheets /etc/nagios4/stylesheets

    # Where the HTML pages live
    Alias /nagios4 /usr/share/nagios4/htdocs

    <Location "/">
        Require all granted
    </Location>

    RedirectMatch ^/?$ https://nagios.teleport.<%= @default_host_domain %>/cgi-bin/nagios4/status.cgi?host=all

    <DirectoryMatch (/usr/share/nagios4/htdocs|/usr/lib/cgi-bin/nagios4|/etc/nagios4/stylesheets)>
        Options FollowSymLinks

        DirectoryIndex index.php index.html

        Order Allow,Deny
        Allow From All
    </DirectoryMatch>

    <Directory /usr/share/nagios4/htdocs>
        Options +ExecCGI
    </Directory>

    # Enable this ScriptAlias if you want to enable the grouplist patch.
    # See http://apan.sourceforge.net/download.html for more info
    # It allows you to see a clickable list of all hostgroups in the
    # left pane of the Nagios web interface
    ScriptAlias /nagios4/side.html /usr/lib/cgi-bin/nagios4/grouplist.cgi
</VirtualHost>
```

--------------------------------------------------------------------------------

---[FILE: nagios_autossh.template.erb]---
Location: zulip-main/puppet/kandra/templates/nagios_autossh.template.erb

```text
define service{
        use                             generic-service
        host_name                       nagios
        service_description             Number of autossh processes
        check_command                   check_named_procs!autossh!<%= @hosts.length %>:<%= @hosts.length %>!<%= @hosts.length %>:<%= @hosts.length + 2 %>
        }
```

--------------------------------------------------------------------------------

---[FILE: teleport.service.template.erb]---
Location: zulip-main/puppet/kandra/templates/teleport.service.template.erb

```text
[Unit]
Description=Teleport <%= @part %> Service
After=network.target

[Service]
Type=simple
Restart=on-failure
EnvironmentFile=-/etc/default/teleport_<%= @part %>
ExecStart=/usr/local/bin/teleport start --pid-file=/run/teleport_<%= @part %>.pid --config=/etc/teleport_<%= @part %>.yaml
ExecReload=/bin/kill -HUP $MAINPID
PIDFile=/run/teleport_<%= @part %>.pid
LimitNOFILE=524288

[Install]
WantedBy=multi-user.target
```

--------------------------------------------------------------------------------

---[FILE: teleport_app.yaml.template.erb]---
Location: zulip-main/puppet/kandra/templates/teleport_app.yaml.template.erb

```text
<%# This is appended to puppet/kandra/files/teleport_node.yaml, so should be
    indented.  Specifically, the "-" should be in the same column as the "T" at
    the start of this comment. -%>
    - name: "<%= @name %>"
      description: "<%= @description %>"
      uri: "http://127.0.0.1:<%= @port %>"
      labels:
        name: "<%= @name %>"
```

--------------------------------------------------------------------------------

---[FILE: teleport_db.yaml.template.erb]---
Location: zulip-main/puppet/kandra/templates/teleport_db.yaml.template.erb

```text
# See https://goteleport.com/docs/config-reference/ and
# https://goteleport.com/docs/database-access/guides/postgres-self-hosted/
#
# This establishes a reverse proxy back to the central auth server,
# allowing that to connect to the postgres server running on
# localhost:5432.  Auth is checked using role-based access control,
# which determines which hosts, databases, and database users the
# remote user is allowed to connect to.
teleport:
  ca_pin: "sha256:062db37249ea74c450579da8f02043b317cb8a174d653bb5090a89752d68efe7"
  auth_servers:
    # Use the proxy address, to support running the db_service, which requires
    # a reverse tunnel.
    - teleport.zulipchat.net:443
<% if @is_ec2 -%>
  join_params:
    method: iam
    token_name: iam-token
<% else -%>
  join_params:
    method: token
    token_name: <%= @join_token %>
<% end %>

ssh_service:
  enabled: no
app_service:
  enabled: no
proxy_service:
  enabled: no
auth_service:
  enabled: no

db_service:
  enabled: yes
  databases:
    - name: "<%= @hostname %>"
      protocol: "postgres"
      uri: "<%= @fqdn %>:5432"
      static_labels:
        hostname: "<%= @hostname %>"
      dynamic_labels:
        # Every hour, refresh the label that describes if this
        # instance is a replica; this allows access to be granted only
        # to replicas.
        - name: "is_replica"
          command:
            ["sudo", "-u", "zulip", "psql", "-tc", "select pg_is_in_recovery()"]
          period: 1h
```

--------------------------------------------------------------------------------

---[FILE: teleport_node.yaml.template.erb]---
Location: zulip-main/puppet/kandra/templates/teleport_node.yaml.template.erb

```text
# See https://goteleport.com/docs/config-reference/
teleport:
  ca_pin: "sha256:062db37249ea74c450579da8f02043b317cb8a174d653bb5090a89752d68efe7"
  auth_servers:
    # Use the proxy address, to support running the app_service, which requires
    # a reverse tunnel.
    - teleport.zulipchat.net:443
<% if @is_ec2 -%>
  join_params:
    method: iam
    token_name: iam-token
<% else -%>
  join_params:
    method: token
    token_name: <%= @join_token %>
<% end %>
ssh_service:
  enabled: "yes"
  commands:
    - name: hostname
      command: ["/bin/hostname"]
      period: 1h0m0s
    - name: uname
      command: ["/usr/bin/uptrack-uname", "-r"]
      period: 1h0m0s
    - name: distro
      command:
        ["/bin/sh", "-c", '. /etc/os-release && printf "%s\n" "$PRETTY_NAME"']
      period: 1h0m0s
    - name: classes
      command:
        - /usr/bin/crudini
        - --get
        - /etc/zulip/zulip.conf
        - machine
        - puppet_classes
      period: 1h0m0s

proxy_service:
  enabled: no
auth_service:
  enabled: no
```

--------------------------------------------------------------------------------

````

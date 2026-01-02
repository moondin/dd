---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 443
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 443 of 1290)

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

---[FILE: tornado_sharding.pp]---
Location: zulip-main/puppet/zulip/manifests/tornado_sharding.pp

```text
class zulip::tornado_sharding {
  include zulip::nginx

  # The file entries below serve only to initialize the sharding config files
  # with the correct default content for the "only one shard" setup. For this
  # reason they use "replace => false", because the files are managed by
  # the sharding script afterwards and Puppet shouldn't overwrite them.
  file { '/etc/zulip/nginx_sharding_map.conf':
    ensure  => file,
    owner   => 'zulip',
    group   => 'zulip',
    mode    => '0644',
    notify  => Service['nginx'],
    content => @(EOT),
      map "" $tornado_server {
          default http://tornado;
      }
      | EOT
    replace => false,
  }
  file { '/etc/zulip/nginx_sharding.conf':
    ensure => absent,
  }
  file { '/etc/zulip/sharding.json':
    ensure  => file,
    require => User['zulip'],
    owner   => 'zulip',
    group   => 'zulip',
    mode    => '0644',
    content => "{}\n",
    replace => false,
  }

  # This creates .tmp files which scripts/refresh-sharding-and-restart
  # moves into place
  exec { 'stage_updated_sharding':
    command   => "${facts['zulip_scripts_path']}/lib/sharding.py",
    onlyif    => "${facts['zulip_scripts_path']}/lib/sharding.py --errors-ok",
    require   => [File['/etc/zulip/nginx_sharding_map.conf'], File['/etc/zulip/sharding.json']],
    logoutput => true,
    loglevel  => warning,
  }

  # The ports of Tornado processes to run on the server, computed from
  # the zulip.conf configuration. Default is just port 9800.
  $tornado_groups = zulipconf_keys('tornado_sharding').map |$key| { $key.regsubst(/_regex$/, '').split('_') }.unique
  $tornado_ports = $tornado_groups.flatten.unique

  file { '/etc/nginx/zulip-include/tornado-upstreams':
    require => [Package[$zulip::common::nginx], Exec['stage_updated_sharding']],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/nginx/tornado-upstreams.conf.template.erb'),
    notify  => Service['nginx'],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tusd.pp]---
Location: zulip-main/puppet/zulip/manifests/tusd.pp

```text
# @summary Provide the tusd service binary
#
class zulip::tusd {
  $version = $zulip::common::versions['tusd']['version']
  $bin = "/srv/zulip-tusd-${version}/tusd"

  # This tarball contains only a single file, which is extracted as $bin
  zulip::external_dep { 'tusd':
    version        => $version,
    url            => "https://github.com/tus/tusd/releases/download/v${version}/tusd_linux_${zulip::common::goarch}.tar.gz",
    tarball_prefix => "tusd_linux_${zulip::common::goarch}",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }
  file { '/usr/local/bin/tusd':
    ensure  => link,
    target  => $bin,
    require => File[$bin],
    before  => Exec['Cleanup tusd'],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: wal_g.pp]---
Location: zulip-main/puppet/zulip/manifests/wal_g.pp

```text
# @summary Provide the wal-g and env-wal-g binaries.
#
class zulip::wal_g {
  $wal_g_version = $zulip::common::versions['wal-g']['version']
  $bin = "/srv/zulip-wal-g-${wal_g_version}"

  if ($zulip::common::goarch == 'aarch64') {
    $package = "wal-g-pg-ubuntu-20.04-${zulip::common::goarch}"
  } else {
    $package = "wal-g-pg-ubuntu-22.04-${zulip::common::goarch}"
  }
  # This tarball contains only a single file, which is extracted as $bin
  zulip::external_dep { 'wal-g':
    version        => $wal_g_version,
    url            => "https://github.com/wal-g/wal-g/releases/download/v${wal_g_version}/${package}.tar.gz",
    tarball_prefix => $package,
  }
  file { '/usr/local/bin/wal-g':
    ensure  => link,
    target  => $bin,
    require => File[$bin],
    before  => Exec['Cleanup wal-g'],
  }
  # We used to install versions into /usr/local/bin/wal-g-VERSION,
  # until we moved to using Zulip::External_Dep which places them in
  # /srv/zulip-wal-g-VERSION.  Tidy old versions.
  tidy { '/usr/local/bin/wal-g-*':
    recurse => 1,
    path    => '/usr/local/bin/',
    matches => 'wal-g-*',
  }

  file { '/usr/local/bin/env-wal-g':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
    source  => 'puppet:///modules/zulip/postgresql/env-wal-g',
    require => [
      File['/usr/local/bin/wal-g'],
    ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: yum_repository.pp]---
Location: zulip-main/puppet/zulip/manifests/yum_repository.pp

```text
class zulip::yum_repository {
  $setup_yum_repo_file = "${facts['zulip_scripts_path']}/lib/setup-yum-repo"
  exec{'setup_yum_repo':
    command => "bash -c '${setup_yum_repo_file} --prod'",
  }
}
```

--------------------------------------------------------------------------------

---[FILE: base.pp]---
Location: zulip-main/puppet/zulip/manifests/hooks/base.pp

```text
# @summary Install sentry-cli binary and pre/post deploy hooks
#
class zulip::hooks::base {
  file { [
    '/etc/zulip/hooks',
    '/etc/zulip/hooks/common',
    '/etc/zulip/hooks/pre-deploy.d',
    '/etc/zulip/hooks/post-deploy.d',
  ]:
    ensure => directory,
    owner  => 'zulip',
    group  => 'zulip',
    mode   => '0755',
    tag    => ['hooks'],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: file.pp]---
Location: zulip-main/puppet/zulip/manifests/hooks/file.pp

```text
# @summary Install a static hook file
#
define zulip::hooks::file() {
  include zulip::hooks::base

  file { "/etc/zulip/hooks/${title}":
    ensure => file,
    mode   => '0755',
    owner  => 'zulip',
    group  => 'zulip',
    source => "puppet:///modules/zulip/hooks/${title}",
    tag    => ['hooks'],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: push_git_ref.pp]---
Location: zulip-main/puppet/zulip/manifests/hooks/push_git_ref.pp

```text
# @summary Push the merge_base to a git repo after deploy
#
class zulip::hooks::push_git_ref {
  include zulip::hooks::base

  zulip::hooks::file { [
    'post-deploy.d/push_git_ref.hook',
  ]: }
}
```

--------------------------------------------------------------------------------

---[FILE: send_zulip_update_announcements.pp]---
Location: zulip-main/puppet/zulip/manifests/hooks/send_zulip_update_announcements.pp

```text
# @summary Send zuip update announcements after deploy
#
class zulip::hooks::send_zulip_update_announcements {
  include zulip::hooks::base

  zulip::hooks::file { [
    'post-deploy.d/send_zulip_update_announcements.hook',
  ]: }
}
```

--------------------------------------------------------------------------------

---[FILE: sentry.pp]---
Location: zulip-main/puppet/zulip/manifests/hooks/sentry.pp

```text
# @summary Install Sentry pre/post deploy hooks
#
class zulip::hooks::sentry {
  include zulip::hooks::base
  include zulip::sentry_cli

  zulip::hooks::file { [
    'common/sentry.sh',
    'pre-deploy.d/sentry.hook',
    'post-deploy.d/sentry.hook',
  ]: }
}
```

--------------------------------------------------------------------------------

---[FILE: zulip_common.pp]---
Location: zulip-main/puppet/zulip/manifests/hooks/zulip_common.pp

```text
# @summary zulip_notify common file
#
class zulip::hooks::zulip_common {
  include zulip::hooks::base

  zulip::hooks::file { 'common/zulip_notify.sh': }
}
```

--------------------------------------------------------------------------------

---[FILE: zulip_notify.pp]---
Location: zulip-main/puppet/zulip/manifests/hooks/zulip_notify.pp

```text
# @summary Install hook that notifies when a deploy starts/stops
#
class zulip::hooks::zulip_notify {
  include zulip::hooks::base
  include zulip::hooks::zulip_common

  zulip::hooks::file { [
    'pre-deploy.d/zulip_notify.hook',
    'post-deploy.d/zulip_notify.hook',
  ]: }
}
```

--------------------------------------------------------------------------------

---[FILE: app_frontend.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/app_frontend.pp

```text
# Default configuration for a Zulip app frontend
class zulip::profile::app_frontend {
  include zulip::profile::base
  include zulip::app_frontend_base
  include zulip::app_frontend_once

  $nginx_http_only = zulipconf('application_server', 'http_only', false)
  if $nginx_http_only {
    $nginx_listen_port = zulipconf('application_server', 'nginx_listen_port', 80)
  } else {
    $nginx_listen_port = zulipconf('application_server', 'nginx_listen_port', 443)
  }
  $ssl_dir = $facts['os']['family'] ? {
    'Debian' => '/etc/ssl',
    'RedHat' => '/etc/pki/tls',
  }
  file { '/etc/nginx/sites-available/zulip-enterprise':
    ensure  => file,
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/nginx/zulip-enterprise.template.erb'),
    notify  => Service['nginx'],
  }
  file { '/etc/nginx/sites-enabled/zulip-enterprise':
    ensure  => link,
    require => Package[$zulip::common::nginx],
    target  => '/etc/nginx/sites-available/zulip-enterprise',
    notify  => Service['nginx'],
  }

  # Reload nginx after deploying a new cert.
  file { '/etc/letsencrypt/renewal-hooks/deploy/001-nginx.sh':
    # This was renumbered
    ensure => absent,
  }
  file { '/etc/letsencrypt/renewal-hooks/deploy/020-symlink.sh':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
    source  => 'puppet:///modules/zulip/letsencrypt/020-symlink.sh',
    require => [
      Package[certbot],
      File['/etc/letsencrypt/renewal-hooks/deploy'],
    ]
  }
  file { '/etc/letsencrypt/renewal-hooks/deploy/050-nginx.sh':
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
    source => 'puppet:///modules/zulip/letsencrypt/050-nginx.sh',
  }

  # Restart the server regularly to avoid potential memory leak problems.
  zulip::cron { 'restart-zulip':
    hour    => '6',
    minute  => '0',
    dow     => '0',
    command => '/home/zulip/deployments/current/scripts/restart-server --fill-cache --skip-client-reloads',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: base.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/base.pp

```text
# @summary Included only by classes that can be deployed.
#
# This class should only be included by classes that are intended to
# be able to be deployed on their own host.
class zulip::profile::base {
  include zulip::timesync
  include zulip::common
  case $facts['os']['family'] {
    'Debian': {
      include zulip::apt_repository
    }
    'RedHat': {
      include zulip::yum_repository
    }
    default: {
      fail('osfamily not supported')
    }
  }
  case $facts['os']['family'] {
    'Debian': {
      $base_packages = [
        # Basics
        'python3',
        'python3-yaml',
        'puppet',
        'git',
        'curl',
        'jq',
        'procps',
        # Used to read /etc/zulip/zulip.conf for `zulipconf` Puppet function
        'crudini',
        # Used for tools like sponge
        'moreutils',
        # Nagios monitoring plugins
        $zulip::common::nagios_plugins,
        # Required for using HTTPS in apt repositories.
        'apt-transport-https',
        # Needed for the cron jobs installed by Puppet
        'cron',
      ]
    }
    'RedHat': {
      $base_packages = [
        'python3',
        'python3-pyyaml',
        'puppet',
        'git',
        'curl',
        'jq',
        'crudini',
        'moreutils',
        'nmap-ncat',
        'nagios-plugins',  # there is no dummy package on CentOS 7
        'cronie',
      ]
    }
    default: {
      fail('osfamily not supported')
    }
  }
  package { $base_packages: ensure => installed }

  group { 'zulip':
    ensure => present,
  }

  user { 'zulip':
    ensure     => present,
    require    => Group['zulip'],
    gid        => 'zulip',
    shell      => '/bin/bash',
    home       => '/home/zulip',
    managehome => true,
  }

  file { '/etc/zulip':
    ensure => directory,
    mode   => '0755',
    owner  => 'zulip',
    group  => 'zulip',
    links  => follow,
  }
  file { ['/etc/zulip/zulip.conf', '/etc/zulip/settings.py']:
    ensure  => present,
    require => File['/etc/zulip'],
    mode    => '0644',
    owner   => 'zulip',
    group   => 'zulip',
  }
  file { '/etc/zulip/zulip-secrets.conf':
    ensure  => present,
    require => File['/etc/zulip'],
    mode    => '0640',
    owner   => 'zulip',
    group   => 'zulip',
  }

  file { '/etc/security/limits.d/zulip.conf':
    ensure => file,
    mode   => '0640',
    owner  => 'root',
    group  => 'root',
    source => 'puppet:///modules/zulip/limits.d/zulip.conf',
  }
  file { '/etc/systemd/system.conf.d/':
    ensure => directory,
    mode   => '0755',
    owner  => 'root',
    group  => 'root',
  }
  file { '/etc/systemd/system.conf.d/limits.conf':
    ensure => file,
    mode   => '0644',
    owner  => 'root',
    group  => 'root',
    source => 'puppet:///modules/zulip/systemd/system.conf.d/limits.conf',
  }

  service { 'puppet':
    ensure  => stopped,
    enable  => false,
    require => Package['puppet'],
  }

  # This directory is written to by cron jobs for reading by Nagios
  file { '/var/lib/nagios_state/':
    ensure => directory,
    group  => 'zulip',
    mode   => '0775',
  }

  file { '/var/log/zulip':
    ensure => directory,
    owner  => 'zulip',
    group  => 'zulip',
    mode   => '0750',
  }

  zulip::nagios_plugins { 'zulip_base': }
}
```

--------------------------------------------------------------------------------

---[FILE: docker.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/docker.pp

```text
# This class includes all the modules you need to install/run a Zulip installation
# in a single container (without the database, memcached, Redis services).
# The database, memcached, Redis services need to be run in separate containers.
# Through this split of services, it is easier to scale the services to the needs.
class zulip::profile::docker {
  include zulip::profile::base
  include zulip::profile::app_frontend
  include zulip::localhost_camo
  include zulip::local_mailserver
  include zulip::supervisor
  include zulip::process_fts_updates

  file { "${zulip::common::supervisor_conf_dir}/cron.conf":
    ensure  => file,
    require => Package[supervisor],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/zulip/supervisor/conf.d/cron.conf',
  }
  file { "${zulip::common::supervisor_conf_dir}/nginx.conf":
    ensure  => file,
    require => Package[supervisor],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/zulip/supervisor/conf.d/nginx.conf',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: memcached.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/memcached.pp

```text
class zulip::profile::memcached {
  include zulip::profile::base
  include zulip::sasl_modules

  case $facts['os']['family'] {
    'Debian': {
      $memcached_packages = [ 'memcached', 'sasl2-bin' ]
      $memcached_user = 'memcache'
    }
    'RedHat': {
      $memcached_packages = [ 'memcached', 'cyrus-sasl' ]
      $memcached_user = 'memcached'
    }
    default: {
      fail('osfamily not supported')
    }
  }
  package { $memcached_packages: ensure => installed }

  $memcached_max_item_size = zulipconf('memcached', 'max_item_size', '1m')
  $memcached_size_reporting = zulipconf('memcached', 'size_reporting', false)
  $memcached_memory = zulipconf('memcached', 'memory', $zulip::common::total_memory_mb / 8)
  file { '/etc/sasl2':
    ensure => directory,
  }
  file { '/etc/sasl2/memcached-zulip-password':
    # We cache the password in this file so we can check whether it
    # changed and avoid running saslpasswd2 if it didn't.
    require => File['/etc/sasl2'],
    owner   => 'root',
    group   => 'root',
    mode    => '0600',
    content => zulipsecret('secrets', 'memcached_password', ''),
    notify  => Exec[generate_memcached_sasldb2],
  }
  file { '/var/lib/zulip/memcached-sasldb2.stamp':
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => '1',
    notify  => Exec[generate_memcached_sasldb2],
  }
  exec { 'generate_memcached_sasldb2':
    require     => [
      Package[$memcached_packages],
      Package[$zulip::sasl_modules::sasl_module_packages],
    ],
    refreshonly => true,
    # Use localhost for the currently recommended MEMCACHED_USERNAME =
    # "zulip@localhost" and the hostname for compatibility with
    # MEMCACHED_USERNAME = "zulip".
    command     => "bash -euc '
rm -f /etc/sasl2/memcached-sasldb2
saslpasswd2 -p -f /etc/sasl2/memcached-sasldb2 \
    -a memcached -u localhost zulip < /etc/sasl2/memcached-zulip-password
saslpasswd2 -p -f /etc/sasl2/memcached-sasldb2 \
    -a memcached -u \"\$HOSTNAME\" zulip < /etc/sasl2/memcached-zulip-password
'",
  }
  file { '/etc/sasl2/memcached-sasldb2':
    require => Exec[generate_memcached_sasldb2],
    owner   => $memcached_user,
    group   => $memcached_user,
    mode    => '0600',
  }
  file { '/etc/sasl2/memcached.conf':
    require => File['/etc/sasl2'],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/zulip/sasl2/memcached.conf',
    notify  => Service[memcached],
  }
  file { '/etc/memcached.conf':
    ensure  => file,
    require => [
      Package[$memcached_packages],
      Package[$zulip::sasl_modules::sasl_module_packages]
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/memcached.conf.template.erb'),
  }
  file { '/run/memcached':
    ensure  => directory,
    owner   => 'memcache',
    group   => 'memcache',
    mode    => '0755',
    require => Package[$memcached_packages],
  }
  service { 'memcached':
    ensure    => running,
    subscribe => File['/etc/memcached.conf'],
    require   => File['/run/memcached'],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/postgresql.pp

```text
# @summary Extends postgresql_base by tuning the configuration.
class zulip::profile::postgresql(Boolean $start = true) {
  include zulip::profile::base
  include zulip::postgresql_base

  $version = $zulip::postgresql_common::version

  if defined(Class['zulip::app_frontend_base']) {
    $total_postgres_memory_mb = zulipconf('postgresql', 'memory', $zulip::common::total_memory_mb / 2)
  } else {
    $total_postgres_memory_mb = zulipconf('postgresql', 'memory', $zulip::common::total_memory_mb)
  }
  $work_mem = zulipconf('postgresql', 'work_mem', sprintf('%dMB', $total_postgres_memory_mb / 256))
  $shared_buffers = zulipconf('postgresql', 'shared_buffers', sprintf('%dMB', $total_postgres_memory_mb / 4))
  $effective_cache_size = zulipconf('postgresql', 'effective_cache_size', sprintf('%dMB', $total_postgres_memory_mb * 3 / 4))
  $maintenance_work_mem = zulipconf('postgresql', 'maintenance_work_mem', sprintf('%dMB', min(2048, $total_postgres_memory_mb / 8)))

  $max_worker_processes = zulipconf('postgresql', 'max_worker_processes', undef)
  $max_parallel_workers_per_gather = zulipconf('postgresql', 'max_parallel_workers_per_gather', undef)
  $max_parallel_workers = zulipconf('postgresql', 'max_parallel_workers', undef)
  $max_parallel_maintenance_workers = zulipconf('postgresql', 'max_parallel_maintenance_workers', undef)

  $wal_buffers = zulipconf('postgresql', 'wal_buffers', undef)
  $min_wal_size = zulipconf('postgresql', 'min_wal_size', undef)
  $max_wal_size = zulipconf('postgresql', 'max_wal_size', undef)
  $random_page_cost = zulipconf('postgresql', 'random_page_cost', '1.1')
  $effective_io_concurrency = zulipconf('postgresql', 'effective_io_concurrency', undef)

  $listen_addresses = zulipconf('postgresql', 'listen_addresses', undef)

  $s3_backups_bucket = zulipsecret('secrets', 's3_backups_bucket', '')
  $replication_primary = zulipconf('postgresql', 'replication_primary', undef)
  $replication_user = zulipconf('postgresql', 'replication_user', undef)
  $replication_password = zulipsecret('secrets', 'postgresql_replication_password', '')

  $ssl_cert_file = zulipconf('postgresql', 'ssl_cert_file', undef)
  $ssl_key_file = zulipconf('postgresql', 'ssl_key_file', undef)
  $ssl_ca_file = zulipconf('postgresql', 'ssl_ca_file', undef)
  $ssl_mode = zulipconf('postgresql', 'ssl_mode', undef)

  file { $zulip::postgresql_base::postgresql_confdirs:
    ensure => directory,
    owner  => 'postgres',
    group  => 'postgres',
  }

  if $version in ['14'] {
    $postgresql_conf_file = "${zulip::postgresql_base::postgresql_confdir}/postgresql.conf"
    file { $postgresql_conf_file:
      ensure  => file,
      require => Package[$zulip::postgresql_base::postgresql],
      owner   => 'postgres',
      group   => 'postgres',
      mode    => '0644',
      content => template("zulip/postgresql/${version}/postgresql.conf.template.erb"),
    }
  } elsif $version in ['15', '16', '17', '18'] {
    $postgresql_conf_file = "${zulip::postgresql_base::postgresql_confdir}/conf.d/zulip.conf"
    file { $postgresql_conf_file:
      ensure  => file,
      require => Package[$zulip::postgresql_base::postgresql],
      owner   => 'postgres',
      group   => 'postgres',
      mode    => '0644',
      content => template('zulip/postgresql/zulip.conf.template.erb'),
    }
  } else {
    fail("PostgreSQL ${version} not supported")
  }

  if $replication_primary != undef and $replication_user != undef {
    # The presence of a standby.signal file triggers replication
    file { "${zulip::postgresql_base::postgresql_datadir}/standby.signal":
      ensure  => file,
      require => Package[$zulip::postgresql_base::postgresql],
      before  => Service['postgresql'],
      owner   => 'postgres',
      group   => 'postgres',
      mode    => '0644',
      content => '',
    }
  }

  $backups_s3_bucket = zulipsecret('secrets', 's3_backups_bucket', '')
  $backups_directory = zulipconf('postgresql', 'backups_directory', '')
  if $backups_s3_bucket != '' or $backups_directory != '' {
    $require = [File['/usr/local/bin/env-wal-g'], Package[$zulip::postgresql_base::postgresql]]
  } else {
    $require = [Package[$zulip::postgresql_base::postgresql]]
  }
  service { 'postgresql':
    ensure    => $start,
    require   => $require,
    subscribe => [ File[$postgresql_conf_file] ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: rabbitmq.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/rabbitmq.pp

```text
class zulip::profile::rabbitmq {
  include zulip::profile::base
  $erlang = $facts['os']['family'] ? {
    'Debian' => 'erlang-base',
    'RedHat' => 'erlang',
  }
  $rabbitmq_packages = [
    $erlang,
    'rabbitmq-server',
  ]

  group { 'rabbitmq':
    ensure => present,
    system => true,
  }
  user { 'rabbitmq':
    ensure  => present,
    comment => 'RabbitMQ messaging server',
    gid     => 'rabbitmq',
    home    => '/var/lib/rabbitmq',
    shell   => '/usr/sbin/nologin',
    system  => true,
    require => Group['rabbitmq'],
  }
  file { '/etc/rabbitmq':
    ensure  => directory,
    owner   => 'rabbitmq',
    group   => 'rabbitmq',
    mode    => '0755',
    require => User['rabbitmq'],
    before  => Package['rabbitmq-server'],
  }
  file { '/etc/rabbitmq/rabbitmq.config':
    ensure => file,
    owner  => 'rabbitmq',
    group  => 'rabbitmq',
    mode   => '0644',
    source => 'puppet:///modules/zulip/rabbitmq/rabbitmq.config',
    # This config file must be installed before the package, so that
    # port 25672 is not even briefly open to the Internet world, which
    # would be a security risk, due to insecure defaults in the
    # RabbitMQ package.
    before => Package['rabbitmq-server'],
    notify => Service['rabbitmq-server'],
  }
  exec { 'warn-rabbitmq-nodename-change':
    command   => "${facts['zulip_scripts_path']}/lib/warn-rabbitmq-nodename-change",
    onlyif    => '[ -f /etc/rabbitmq/rabbitmq-env.conf ] && ! grep -xq NODENAME=zulip@localhost /etc/rabbitmq/rabbitmq-env.conf',
    before    => [
      File['/etc/rabbitmq/rabbitmq-env.conf'],
      Service['rabbitmq-server'],
    ],
    logoutput => true,
    loglevel  => warning,
  }
  file { '/etc/rabbitmq/rabbitmq-env.conf':
    ensure => file,
    owner  => 'rabbitmq',
    group  => 'rabbitmq',
    mode   => '0644',
    source => 'puppet:///modules/zulip/rabbitmq/rabbitmq-env.conf',
    before => Package['rabbitmq-server'],
    notify => [
      Service['rabbitmq-server'],
      Exec['configure-rabbitmq'],
    ],
  }
  package { $rabbitmq_packages:
    ensure => installed,
  }
  # epmd doesn't have an init script, so we just check if it is
  # running, and if it isn't, start it.  Even in case of a race, this
  # won't leak epmd processes, because epmd checks if one is already
  # running and exits if so.
  exec { 'epmd':
    command => 'epmd -daemon',
    unless  => 'which pgrep && pgrep -x epmd >/dev/null',
    require => Package[$erlang],
    path    => '/usr/bin/:/bin/',
  }

  service { 'rabbitmq-server':
    ensure  => running,
    require => [
      Exec['epmd'],
      Package['rabbitmq-server'],
    ],
  }

  exec { 'configure-rabbitmq':
    command     => "${facts['zulip_scripts_path']}/setup/configure-rabbitmq",
    refreshonly => true,
    require     => Service['rabbitmq-server'],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: redis.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/redis.pp

```text
class zulip::profile::redis {
  include zulip::profile::base
  case $facts['os']['family'] {
    'Debian': {
      $redis = 'redis-server'
      $redis_dir = '/etc/redis'
    }
    'RedHat': {
      $redis = 'redis'
      $redis_dir = '/etc'
    }
    default: {
      fail('osfamily not supported')
    }
  }
  $redis_packages = [ # The server itself
                      $redis,
                      ]

  package { $redis_packages: ensure => installed }

  $file = "${redis_dir}/redis.conf"
  $zulip_redisconf = "${redis_dir}/zulip-redis.conf"
  $line = "include ${zulip_redisconf}"
  exec { 'redis':
    unless  => "/bin/grep -Fxqe '${line}' '${file}'",
    path    => '/bin',
    command => "bash -c \"(/bin/echo; /bin/echo '# Include Zulip-specific configuration'; /bin/echo '${line}') >> '${file}'\"",
    require => [Package[$redis],
                File[$zulip_redisconf],
                Exec['rediscleanup-zuli-redis']],
  }

  # Fix the typo in the path to $zulip_redisconf introduced in
  # 071e32985c1207f20043e1cf28f82300d9f23f31 without triggering a
  # redis restart.
  $legacy_wrong_filename = "${redis_dir}/zuli-redis.conf"
  exec { 'rediscleanup-zuli-redis':
    onlyif   => "test -e ${legacy_wrong_filename}",
    command  => "
      mv ${legacy_wrong_filename} ${zulip_redisconf}
      perl -0777 -pe '
        if (m|^\\Q${line}\\E\$|m) {
          s|^\\n?(:?# Include Zulip-specific configuration\\n)?include \\Q${legacy_wrong_filename}\\E\\n||m;
        } else {
          s|^include \\Q${legacy_wrong_filename}\\E\$|${line}|m;
        }
      ' -i /etc/redis/redis.conf
    ",
    provider => shell,
  }

  $redis_password = zulipsecret('secrets', 'redis_password', '')
  file { $zulip_redisconf:
    ensure  => file,
    require => [Package[$redis], Exec['rediscleanup-zuli-redis']],
    owner   => 'redis',
    group   => 'redis',
    mode    => '0640',
    content => template('zulip/zulip-redis.template.erb'),
  }

  # https://redis.io/docs/management/admin/#linux
  zulip::sysctl { 'redis-server':
    key   => 'vm.overcommit_memory',
    value => '1',
  }
  package { 'sysfsutils': }
  file { '/etc/sysfs.d/40-disable-transpatent-hugepages.conf':
    require => Package['sysfsutils'],
    notify  => Service['sysfsutils'],
    content => 'kernel/mm/transparent_hugepage/enabled = never',
  }
  service { 'sysfsutils':
    ensure  => running,
    require => Package['sysfsutils'],
  }
  file { '/run/redis':
    ensure  => directory,
    owner   => 'redis',
    group   => 'redis',
    mode    => '0755',
    require => Package[$redis],
  }
  service { $redis:
    ensure    => running,
    require   => [
      Service['sysfsutils'],
      File['/run/redis'],
    ],
    subscribe => [
      File[$zulip_redisconf],
      Exec['redis'],
    ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: smokescreen.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/smokescreen.pp

```text
# @summary Outgoing HTTP CONNECT proxy for HTTP/HTTPS on port 4750.
#
class zulip::profile::smokescreen {
  include zulip::profile::base
  include zulip::smokescreen
}
```

--------------------------------------------------------------------------------

---[FILE: standalone.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/standalone.pp

```text
# @summary Complete Zulip server on one server
#
# This class includes all the modules you need to run an entire Zulip
# installation on a single server.  If desired, you can split up the
# different `zulip::profile::*` components of a Zulip installation
# onto different servers:
#
#  - zulip::profile::app_frontend
#  - zulip::profile::memcached
#  - zulip::profile::postgresql
#  - zulip::profile::rabbitmq
#  - zulip::profile::redis
#  - zulip::profile::smokescreen
#
# See the corresponding configuration in /etc/zulip/settings.py for
# how to find the various services is also required to make this work.

class zulip::profile::standalone {
  include zulip::profile::standalone_nodb
  include zulip::profile::postgresql
}
```

--------------------------------------------------------------------------------

---[FILE: standalone_nodb.pp]---
Location: zulip-main/puppet/zulip/manifests/profile/standalone_nodb.pp

```text
# @summary Complete Zulip server, except the database server.
#
# This includes all of the parts necessary to run an entire Zulip
# installation on a single server, except the database.  It is assumed
# that the PostgreSQL database is either hosted on another server with
# the `zulip::profile::postgresql` class applied, or a cloud-managed
# database is used (e.g. AWS RDS).
#
# @see https://zulip.readthedocs.io/en/latest/production/postgresql.html
class zulip::profile::standalone_nodb {
  include zulip::profile::app_frontend
  include zulip::profile::memcached
  include zulip::profile::rabbitmq
  include zulip::profile::redis
  include zulip::localhost_camo
}
```

--------------------------------------------------------------------------------

---[FILE: accept-loadbalancer.conf.template.erb]---
Location: zulip-main/puppet/zulip/templates/accept-loadbalancer.conf.template.erb

```text
# Configuration for making Zulip app frontends accept the
# X-Forwarded-For header used by proxies.  The trusted IP addresses
# here are set by `loadbalancer.ips` in /etc/zulip/zulip.conf.
#
# This causes us to update $remote_addr, which we use in logging, and
# also pass down to Zulip as X-Real-Ip.
real_ip_header X-Forwarded-For;
real_ip_recursive on;
<% @loadbalancers.each do |host| -%>
set_real_ip_from <%= host %>;
<%
end
-%>
```

--------------------------------------------------------------------------------

---[FILE: cron.template.erb]---
Location: zulip-main/puppet/zulip/templates/cron.template.erb

```text
MAILTO=zulip
PATH=/usr/local/bin:/usr/bin:/bin
SHELL=/bin/bash
USER=<%= @user %>
RUNNING_UNDER_CRON=1
<% if @proxy != '' -%>
HTTP_proxy="<%= @proxy %>"
HTTPS_proxy="<%= @proxy %>"
<% end -%>
<% if @dsn != '' -%>
SENTRY_DSN=<%= @dsn %>
<% end -%>

<%= @minute %> <%= @hour %> * * <%= @dow %>    <%= @user %>    <%= @run %>
```

--------------------------------------------------------------------------------

---[FILE: memcached.conf.template.erb]---
Location: zulip-main/puppet/zulip/templates/memcached.conf.template.erb

```text
# memcached default config file
# 2003 - Jay Bonci <jaybonci@debian.org>
# This configuration file is read by the start-memcached script provided as
# part of the Debian GNU/Linux distribution.

# Run memcached as a daemon. This command is implied, and is not needed for the
# daemon to run. See the README.Debian that comes with this package for more
# information.
-d

# Log memcached's output to /var/log/memcached
logfile /var/log/memcached.log

# Be verbose
# -v

# Be even more verbose (print client commands as well)
# -vv

# Start with a cap of 64 megs of memory. It's reasonable, and the daemon default
# Note that the daemon will grow to this size, but does not start out holding this much
# memory
-m <%= @memcached_memory %>

# Default connection port is 11211
-p 11211

# Run the daemon as root. The start-memcached will default to running as root if no
# -u command is present in this config file
-u memcache

# Specify which IP address to listen on. The default is to listen on all IP addresses
# This parameter is one of the only security measures that memcached has, so make sure
# it's listening on a firewalled interface.
-l 127.0.0.1

# Limit the number of simultaneous incoming connections. The daemon default is 1024
# -c 1024

# Lock down all paged memory. Consult with the README and homepage before you do this
# -k

# Return error when memory is exhausted (rather than removing items)
# -M

# Maximize core file limit
# -r

# Use a pidfile
-P /var/run/memcached/memcached.pid

# Enable SASL authentication
-S
<% if @memcached_max_item_size != '1m' %>
# Larger max-item-size
-I <%= @memcached_max_item_size %>
<% end -%>
<%- if @memcached_size_reporting %>
# Enable `stats sizes` (see https://github.com/memcached/memcached/blob/master/doc/protocol.txt)
-o track_sizes
<% end -%>
```

--------------------------------------------------------------------------------

---[FILE: nginx.conf.template.erb]---
Location: zulip-main/puppet/zulip/templates/nginx.conf.template.erb

```text
user zulip;

worker_processes <%= @worker_processes %>;
pid /var/run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

worker_rlimit_nofile 1000000;
events {
    worker_connections <%= @worker_connections %>;

    use epoll;

    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 25m;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format combined_with_host_and_time '$remote_addr - $remote_user [$time_local] '
                                           '"$request" $status $body_bytes_sent '
                                           '"$http_referer" "$http_user_agent" $host $request_time';
    access_log /var/log/nginx/access.log combined_with_host_and_time;
    error_log /var/log/nginx/error.log;

    reset_timedout_connection on;

    gzip on;
    gzip_proxied any;
    gzip_comp_level 3;
    gzip_types
      application/javascript
      application/json
      application/xml
      application/x-javascript
      image/svg+xml
      text/css
      text/javascript
      text/plain;
    gzip_vary on;

    # https://wiki.mozilla.org/Security/Server_Side_TLS intermediate profile
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_dhparam /etc/nginx/dhparam.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate <%= @ca_crt %>;


    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    map $host $help_alias {
        zulip.com /home/zulip/deployments/current/starlight_help/dist_no_relative_links/;
        default   /home/zulip/deployments/current/starlight_help/dist/;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: uwsgi.ini.template.erb]---
Location: zulip-main/puppet/zulip/templates/uwsgi.ini.template.erb

```text
[uwsgi]
# Catch typos in configuration options
strict=true

# Basic environment
env=LANG=C.UTF-8
uid=zulip
gid=zulip

# We run the main process in /, and chdir to the current "current"
# directory in each forked process
chdir=/
hook-post-fork=chdir:/home/zulip/deployments/current

# lazy-apps means that the application is loaded after forking (and
# thus chdir'ing).  This lets us do rolling restarts into new
# versions.
# https://uwsgi-docs.readthedocs.io/en/latest/articles/TheArtOfGracefulReloading.html#preforking-vs-lazy-apps-vs-lazy
lazy-apps=true

# Entrypoint of the application
module=zproject.wsgi:application




# Start a master process listening on this socket
master=true
chmod-socket=700
chown-socket=zulip:zulip
socket=/home/zulip/deployments/uwsgi-socket
listen=<%= @uwsgi_listen_backlog_limit %>

# Create a control socket, allowing rolling restarts ("chain reloading").
master-fifo=/home/zulip/deployments/uwsgi-control


# Let threads run when processes aren't responding to requests;
# required for Sentry background worker
enable-threads=true

# How many serving processes to fork
processes=<%= @uwsgi_processes %>

# Give the processes short process names
auto-procname=true
procname-prefix-spaced=zulip-django

# Longest response allowed, in seconds, before killing the worker
harakiri=55



# Default buffer for client HTTP headers is 4k, and nginx gets a 502
# if the client sends more.  Set this high; nginx limits headers to
# 32k, and will 400 requests with more than that.
buffer-size=65535

# The master process will buffer requests with bodies longer than 4096
# bytes, freeing up workers from hanging around waiting to read them.
post-buffering=4096



# Create a socket to serve very basic UWSGI stats
stats=/home/zulip/deployments/uwsgi-stats


# Silence warnings from clients closing their connection early
ignore-sigpipe = true
ignore-write-errors = true
disable-write-exception = true
```

--------------------------------------------------------------------------------

---[FILE: zulip-redis.template.erb]---
Location: zulip-main/puppet/zulip/templates/zulip-redis.template.erb

```text
# Zulip custom redis configuration

# Disable saving to disk to optimize performance
save ""

<% if @redis_password != '' -%>
# Set a Redis password based on zulip-secrets.conf
requirepass '<%= @redis_password %>'
<% end -%>
```

--------------------------------------------------------------------------------

---[FILE: nginx.template.erb]---
Location: zulip-main/puppet/zulip/templates/logrotate/nginx.template.erb

```text
/var/log/nginx/*.log {
	daily
	missingok
	rotate <%= @access_log_retention_days %>
	compress
	delaycompress
	notifempty
	create 0640 zulip adm
	sharedscripts
	prerotate
		if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
			run-parts /etc/logrotate.d/httpd-prerotate; \
		fi \
	endscript
	postrotate
		invoke-rc.d nginx rotate >/dev/null 2>&1
	endscript
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 442
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 442 of 1290)

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

---[FILE: common.pp]---
Location: zulip-main/puppet/zulip/manifests/common.pp

```text
class zulip::common {
  # Common parameters
  case $facts['os']['family'] {
    'Debian': {
      $nagios_plugins = 'monitoring-plugins-basic'
      $nagios_plugins_dir = '/usr/lib/nagios/plugins'
      $nginx = 'nginx-full'
      $supervisor_system_conf_dir = '/etc/supervisor/conf.d'
      $supervisor_conf_file = '/etc/supervisor/supervisord.conf'
      $supervisor_service = 'supervisor'
      $supervisor_start = '/usr/sbin/service supervisor start'
      $supervisor_reload = @(EOT)
        # The init script's timeout waiting for supervisor is shorter
        # than supervisor's timeout waiting for its programs, so we need
        # to ask supervisor to stop its programs first.
        supervisorctl stop all &&
        service supervisor restart &&
        # https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=877086
        # "restart" is actually "stop" under sysvinit
        { service supervisor start || true; } &&
        service supervisor status
        | EOT
      $supervisor_status = '/usr/sbin/service supervisor status'
    }
    'RedHat': {
      $nagios_plugins = 'nagios-plugins'
      $nagios_plugins_dir = '/usr/lib64/nagios/plugins'
      $nginx = 'nginx'
      $supervisor_system_conf_dir = '/etc/supervisord.d/conf.d'
      $supervisor_conf_file = '/etc/supervisord.conf'
      $supervisor_service = 'supervisord'
      $supervisor_start = 'systemctl start supervisord'
      $supervisor_reload = 'systemctl reload supervisord'
      $supervisor_status = 'systemctl status supervisord'
    }
    default: {
      fail('osfamily not supported')
    }
  }
  $supervisor_conf_dir = "${supervisor_system_conf_dir}/zulip"

  if $facts['container_memory_limit_mb'] {
    $total_memory_mb = Integer($facts['container_memory_limit_mb'])
  } else {
    $total_memory_mb = Integer($facts['memory']['system']['total_bytes'] / 1024 / 1024)
  }

  $goarch = $facts['os']['architecture'] ? {
    'amd64'   => 'amd64',
    'aarch64' => 'arm64',
  }

  $versions = {
    # https://github.com/cactus/go-camo/releases
    'go-camo' => {
      'version'   => '2.7.1',
      'goversion' => '1252',
      'sha256'    => {
        'amd64'   => 'dd90f226d9305fcea4a91e90710615ed20b44339e3c4f4425356c80c3203ed8a',
        'aarch64' => 'a7f380eca870e0eb26774592271df9d8f2d325f8c45fec5cb989b5c3ef23135a',
      },
    },

    # https://go.dev/dl/
    'golang' => {
      'version' => '1.25.3',
      'sha256'  => {
        'amd64'   => '0335f314b6e7bfe08c3d0cfaa7c19db961b7b99fb20be62b0a826c992ad14e0f',
        'aarch64' => '1d42ebc84999b5e2069f5e31b67d6fc5d67308adad3e178d5a2ee2c9ff2001f5',
      },
    },

    # https://github.com/stripe/smokescreen/tags
    'smokescreen-src' => {
      'version' => '3ec99c08f3a42840e6a5c9a47d0f85c6d591f52c',
      # Source code, so arch-invariant sha256
      'sha256'  => '32e18f5bb04001079a05996088ea33600bedd25b6abd0caf636049677a9e94a5',
    },

    # https://github.com/tus/tusd/releases
    # Keep in sync with tools/setup/install-tusd
    'tusd' => {
      'version' => '2.8.0',
      'sha256'  => {
        'amd64'   => 'e13c8adc9bed4c993a72f60140f688736058d2c3f4a18fb6e59ca26e829fb93b',
        'aarch64' => '089eb6d144df7cc5e10ac611a18f407308aedb3f9024a78fa01cb60ba99005a9',
      },
    },

    # https://github.com/wal-g/wal-g/releases
    'wal-g' => {
      'version' => '3.0.7',
      'sha256'  => {
        'amd64'   => '76d51ed915165d45314bc947300b9d1776adb2d875d857f580a730fd6f66900e',  # The ubuntu-22.04 version
        'aarch64' => 'fcf25aac732f66e77e121e9d287a08d8bf867c604b81cb6fcfff2d6c692d38c9',  # The ubuntu-22.04 version
      },
    },

    ### kandra packages

    # https://docs.aws.amazon.com/rolesanywhere/latest/userguide/credential-helper.html
    'aws_signing_helper' => {
      'version' => '1.7.1',
      'sha256'  => {
        'amd64'   => '807f911124a7192bba23c6e8f37f6cb41e9defe4722fbeaf471e2c5951c6229c',
        'aarch64' => '5413ea1c86c1747254fc14450f44013ccec32901fb2b70f9105f5679dd6eaa5d',
      },
    },

    # https://release-registry.services.sentry.io/apps/sentry-cli/latest
    'sentry-cli' => {
      'version' => '2.56.1',
      'sha256'  => {
        'amd64'   => 'be0bcbf4740c95330cf2d735769f31640d69fd297a2b74ad0cd9ed383814cafa',
        'aarch64' => 'cc58bca49593cd6fcda4d934e1bf68f3bed9194156ba122cdb2e4cfd79a23878',
      },
    },

    # https://grafana.com/grafana/download?edition=oss
    'grafana' => {
      'version' => '12.2.0',
      'sha256'  => {
        'amd64'   => 'c4f53551ed4887c792caeb9d02fa0c1a36e3db9ee8bdda32b1ced810cb135a93',
        'aarch64' => 'ef84a75b6888e4674e3d2a21ae586cda61999ec202298e855c5de71fd242eb35',
      },
    },

    # https://github.com/fstab/grok_exporter/tags
    'grok_exporter' => {
      'version' => '1.0.0.RC5',
      'sha256'  => {
        'amd64' => 'b8771a6d7ca8447c222548d6cb8b2f8ee058b55bfd1801c2f6eb739534df5ded',
        # No aarch64 builds
      },
    },

    # https://prometheus.io/download/#node_exporter
    'node_exporter' => {
      'version' => '1.9.1',
      'sha256'  => {
        'amd64'   => 'becb950ee80daa8ae7331d77966d94a611af79ad0d3307380907e0ec08f5b4e8',
        'aarch64' => '848f139986f63232ced83babe3cad1679efdbb26c694737edc1f4fbd27b96203',
      },
    },

    # https://github.com/prometheus-community/postgres_exporter/tags
    'postgres_exporter' => {
      'version' => '0.18.1',
      'sha256'  => {
        'amd64'   => '1630965540d49a4907ad181cef5696306d7a481f87f43978538997e85d357272',
        'aarch64' => '81c22dc2b6dcc58e9e2b5c0e557301dbf0ca0812ee3113d31984c1a37811d1cc',
      },
    },

    # https://github.com/prometheus-community/postgres_exporter/pull/843
    'postgres_exporter-src' => {
      'version' => '8067b51a82bba267497d64b8708e141aa493450c',
      'sha256'  => '9b74d48019a46fafb88948c8209fa713ccd8d1c34a0d935593ddb301656f0871',
    },

    # https://github.com/ncabatoff/process-exporter/releases
    'process_exporter' => {
      'version' => '0.8.7',
      'sha256'  => {
        'amd64'   => '6d274cca5e94c6a25e55ec05762a472561859ce0a05b984aaedb67dd857ceee2',
        'aarch64' => '4a2502f290323e57eeeb070fc10e64047ad0cd838ae5a1b347868f75667b5ab0',
      }
    },

    # https://prometheus.io/download/#prometheus
    'prometheus' => {
      'version' => '3.7.1',
      'sha256'  => {
        'amd64'   => 'a2e8a89c09b14b2277e6151e87fc8ed18858486cbf89372656d71fcd666b51da',
        'aarch64' => '7ede3f3f0541b9bfd2ccca9cef57af80554f131b8e7af8900896c6e49ed2d4ef',
      },
    },

    # https://github.com/prometheus/pushgateway/releases
    'pushgateway' => {
      'version' => '1.11.1',
      'sha256'  => {
        'amd64'   => '6ce6ffab84d0d71195036326640295c02165462abd12b8092b0fa93188f5ee37',
        'aarch64' => 'b6dc1c1c46d1137e5eda253f6291247e39330d3065a839857b947e59b4f3e64b',
      },
    },

    # https://github.com/oliver006/redis_exporter/releases
    'redis_exporter' => {
      'version' => '1.79.0',
      'sha256'  => {
        'amd64'   => 'cd584b0ec12dfb539c5df0c9cac9ca277f4383022576182e9ecb1df8c45642f0',
        'aarch64' => '278becb6e7343577846d76d7250a6c84bd18efb9fe893cf4f3d5ee9534b39496',
      },
    },

    # https://github.com/timonwong/uwsgi_exporter/releases
    'uwsgi_exporter' => {
      'version' => '1.3.0',
      'sha256'  => {
        'amd64'   => 'f83411b508676237bbd1b791c1bdc043a68bf914c7e48e005e2e295255f9245f',
        'aarch64' => 'ab7c9298d2fe5c5f58e3fe7c905929e93979d2b3b11c75eb8ba6ccc7a547238c',
      },
    },

    # https://vector.dev/download/
    'vector' => {
      'version' => '0.50.0',
      'sha256'  => {
        'amd64'   => '951ceb14f2382c1438696552745221c5584d6895f9aa2b0e12ff0e30271d4b0e',
        'aarch64' => 'ed73245a88638962093b9b5eb92ba3e17681a7b641e26eac674d07b137a605b8',
      },
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: cron.pp]---
Location: zulip-main/puppet/zulip/manifests/cron.pp

```text
# @summary Install a cron file into /etc/cron.d
#
define zulip::cron(
  String $minute,
  String $hour = '*',
  String $dow = '*',
  String $user = 'zulip',
  Optional[String] $command = undef,
  Optional[String] $manage = undef,
  Boolean $use_proxy = true,
) {
  if $use_proxy {
    $proxy_host = zulipconf('http_proxy', 'host', 'localhost')
    $proxy_port = zulipconf('http_proxy', 'port', '4750')
    if $proxy_host != '' and $proxy_port != '' {
      $proxy = "http://${proxy_host}:${proxy_port}"
    } else {
      $proxy = ''
    }
  } else {
    $proxy = ''
  }

  $dsn = zulipconf('sentry', 'project_dsn', '')
  if $dsn != '' {
    include zulip::sentry_cli
    $environment = zulipconf('machine', 'deploy_type', 'development')
    $sentry = "sentry-cli monitors run -e ${environment} --schedule '${minute} ${hour} * * ${dow}' ${title} -- "
    $cron_require = [File['/usr/local/bin/sentry-cli']]
  } else {
    $sentry = ''
    $cron_require = []
  }
  if $command != undef {
    $run = "${sentry}${command}"
  } elsif $manage != undef {
    $run = "cd /home/zulip/deployments/current/ && ${sentry}./manage.py ${manage} >/dev/null"
  } else {
    $underscores = regsubst($title, '-', '_', 'G')
    $run = "cd /home/zulip/deployments/current/ && ${sentry}./manage.py ${underscores} >/dev/null"
  }
  file { "/etc/cron.d/${title}":
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/cron.template.erb'),
    require => $cron_require,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: dockervoyager.pp]---
Location: zulip-main/puppet/zulip/manifests/dockervoyager.pp

```text
# @summary Temporary shim for docker all-in-one profile
class zulip::dockervoyager {
  include zulip::profile::docker
}
```

--------------------------------------------------------------------------------

---[FILE: external_dep.pp]---
Location: zulip-main/puppet/zulip/manifests/external_dep.pp

```text
define zulip::external_dep(
  String $version,
  String $url,
  String $tarball_prefix = '',
  String $sha256 = '',
  String $mode = '0755',
  Array[String] $bin = [],
  Array[Type[Resource]] $cleanup_after = [],
) {
  $arch = $facts['os']['architecture']
  if $sha256 == '' {
    if $zulip::common::versions[$title]['sha256'] =~ Hash {
      $sha256_filled = $zulip::common::versions[$title]['sha256'][$arch]
      if $sha256_filled == undef {
        err("No sha256 found for ${title} for architecture ${arch}")
        fail()
      }
    } else {
      # For things like source code which are arch-invariant
      $sha256_filled = $zulip::common::versions[$title]['sha256']
    }
  } else {
    $sha256_filled = $sha256
  }

  $path = "/srv/zulip-${title}-${version}"

  if $tarball_prefix == '' {
    zulip::sha256_file_to { $title:
      url        => $url,
      sha256     => $sha256_filled,
      install_to => $path,
      notify     => Exec["Cleanup ${title}"],
    }
    file { $path:
      ensure  => file,
      require => Zulip::Sha256_File_To[$title],
      before  => Exec["Cleanup ${title}"],
      mode    => $mode,
    }
  } else {
    zulip::sha256_tarball_to { $title:
      url          => $url,
      sha256       => $sha256_filled,
      install_from => $tarball_prefix,
      install_to   => $path,
      notify       => Exec["Cleanup ${title}"],
    }
    file { $path:
      ensure  => present,
      require => Zulip::Sha256_Tarball_To[$title],
      before  => Exec["Cleanup ${title}"],
    }
    file { $bin:
      ensure  => file,
      require => [File[$path], Zulip::Sha256_Tarball_To[$title]],
      before  => Exec["Cleanup ${title}"],
      mode    => $mode,
    }
  }

  exec { "Cleanup ${title}":
    refreshonly => true,
    provider    => shell,
    onlyif      => "ls -d /srv/zulip-${title}-* | grep -xv '${path}'",
    command     => "ls -d /srv/zulip-${title}-* | grep -xv '${path}' | xargs rm -r",
    require     => $cleanup_after,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: golang.pp]---
Location: zulip-main/puppet/zulip/manifests/golang.pp

```text
# @summary go compiler and tools
#
class zulip::golang {
  $version = $zulip::common::versions['golang']['version']
  $dir = "/srv/zulip-golang-${version}"
  $bin = "${dir}/bin/go"

  zulip::external_dep { 'golang':
    version        => $version,
    url            => "https://go.dev/dl/go${version}.linux-${zulip::common::goarch}.tar.gz",
    tarball_prefix => 'go',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: localhost_camo.pp]---
Location: zulip-main/puppet/zulip/manifests/localhost_camo.pp

```text
class zulip::localhost_camo {
  class { 'zulip::camo':
    listen_address => '127.0.0.1',
  }

  # Install nginx configuration to run camo locally
  file { '/etc/nginx/zulip-include/app.d/camo.conf':
    ensure  => file,
    require => Package['nginx-full'],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    notify  => Service['nginx'],
    source  => 'puppet:///modules/zulip/nginx/zulip-include-app.d/camo.conf',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: localhost_sso.pp]---
Location: zulip-main/puppet/zulip/manifests/localhost_sso.pp

```text
class zulip::localhost_sso {
  file { '/etc/nginx/zulip-include/app.d/external-sso.conf':
    ensure  => file,
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    notify  => Service['nginx'],
    source  => 'puppet:///modules/zulip/nginx/zulip-include-app.d/external-sso.conf',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: local_mailserver.pp]---
Location: zulip-main/puppet/zulip/manifests/local_mailserver.pp

```text
class zulip::local_mailserver {
  include zulip::snakeoil
  include zulip::certbot

  if zulipconf('postfix', 'uninstall', true) {
    package { 'postfix':
      # TODO/compatibility: We can remove this when upgrading directly
      # from 10.x is no longer possible.  We do not use "purged" here,
      # since that would remove config files, which users may have had
      # installed.
      ensure => absent,
      before => Service[$zulip::common::supervisor_service],
    }
  }
  file { "${zulip::common::supervisor_conf_dir}/email-mirror.conf":
    ensure  => file,
    require => [
      Package[supervisor],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/supervisor/email-mirror.conf.template.erb'),
    notify  => Service[$zulip::common::supervisor_service],
  }
  file { '/etc/letsencrypt/renewal-hooks/deploy/055-email-server.sh':
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
    source => 'puppet:///modules/zulip/letsencrypt/055-email-server.sh',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: nagios_plugins.pp]---
Location: zulip-main/puppet/zulip/manifests/nagios_plugins.pp

```text
# @summary Installs a subdirectory from puppet/zulip/files/nagios_plugins/
define zulip::nagios_plugins () {
  include zulip::common

  file { "${zulip::common::nagios_plugins_dir}/${name}":
    require => Package[$zulip::common::nagios_plugins],
    recurse => true,
    purge   => true,
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
    source  => "puppet:///modules/zulip/nagios_plugins/${name}",
  }
}
```

--------------------------------------------------------------------------------

---[FILE: nginx.pp]---
Location: zulip-main/puppet/zulip/manifests/nginx.pp

```text
class zulip::nginx {
  include zulip::certbot
  $web_packages = [
    # Needed to run nginx with the modules we use
    $zulip::common::nginx,
    'ca-certificates',
  ]
  package { $web_packages: ensure => installed }

  if $facts['os']['family'] == 'RedHat' {
    file { '/etc/nginx/sites-available':
      ensure => directory,
      owner  => 'root',
      group  => 'root',
    }
    file { '/etc/nginx/sites-enabled':
      ensure => directory,
      owner  => 'root',
      group  => 'root',
    }
  }

  file { '/etc/nginx/zulip-include/':
    require => Package[$zulip::common::nginx],
    recurse => true,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/zulip/nginx/zulip-include-common/',
    notify  => Service['nginx'],
  }

  file { '/etc/nginx/dhparam.pem':
    ensure  => file,
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    notify  => Service['nginx'],
    source  => 'puppet:///modules/zulip/nginx/dhparam.pem',
  }

  if $facts['os']['family'] == 'Debian' {
    $ca_crt = '/etc/ssl/certs/ca-certificates.crt'
  } else {
    $ca_crt = '/etc/pki/tls/certs/ca-bundle.crt'
  }
  $worker_processes = zulipconf('application_server', 'nginx_worker_processes', 'auto')
  $worker_connections = zulipconf('application_server', 'nginx_worker_connections', 10000)
  file { '/etc/nginx/nginx.conf':
    ensure  => file,
    require => Package[$zulip::common::nginx, 'ca-certificates'],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    notify  => Service['nginx'],
    content => template('zulip/nginx.conf.template.erb'),
  }

  $loadbalancers = split(zulipconf('loadbalancer', 'ips', ''), ',')
  $lb_rejects_http_requests = zulipconf('loadbalancer', 'rejects_http_requests', false)
  file { '/etc/nginx/zulip-include/trusted-proto':
    ensure  => file,
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    notify  => Service['nginx'],
    content => template('zulip/nginx/trusted-proto.template.erb'),
  }

  file { '/etc/nginx/uwsgi_params':
    ensure  => file,
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    notify  => Service['nginx'],
    source  => 'puppet:///modules/zulip/nginx/uwsgi_params',
  }

  file { '/etc/nginx/sites-enabled/default':
    ensure => absent,
    notify => Service['nginx'],
  }

  file { '/var/log/nginx':
    ensure => directory,
    owner  => 'zulip',
    group  => 'adm',
    mode   => '0750',
  }
  $access_log_retention_days = zulipconf('application_server','access_log_retention_days', 14)
  file { '/etc/logrotate.d/nginx':
    ensure  => file,
    require => Package[$zulip::common::nginx],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/logrotate/nginx.template.erb'),
  }
  file { ['/var/lib/zulip', '/var/lib/zulip/certbot-webroot']:
    ensure => directory,
    owner  => 'zulip',
    group  => 'adm',
    mode   => '0770',
  }

  service { 'nginx':
    ensure => running,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_backups.pp]---
Location: zulip-main/puppet/zulip/manifests/postgresql_backups.pp

```text
# @summary Use wal-g to take daily backups of PostgreSQL
#
class zulip::postgresql_backups {
  include zulip::postgresql_common
  include zulip::wal_g

  file { '/var/log/pg_backup_and_purge.log':
    ensure => file,
    owner  => 'postgres',
    group  => 'postgres',
    mode   => '0644',
  }
  file { '/usr/local/bin/pg_backup_and_purge':
    ensure  => file,
    owner   => 'root',
    group   => 'postgres',
    mode    => '0754',
    source  => 'puppet:///modules/zulip/postgresql/pg_backup_and_purge',
    require => [
      File['/usr/local/bin/env-wal-g'],
      Package[
        $zulip::postgresql_common::postgresql,
        'python3-dateutil',
      ],
    ],
  }

  zulip::cron { 'pg_backup_and_purge':
    hour    => '2',
    minute  => '0',
    command => '/usr/local/bin/pg_backup_and_purge >/var/log/pg_backup_and_purge.log 2>&1',
    user    => 'postgres',
    require => [
      File['/var/log/pg_backup_and_purge.log'],
      File['/usr/local/bin/pg_backup_and_purge'],
    ],
  }

  $postgresql_backup_directory = zulipconf('postgresql', 'backups_directory', '')
  if $postgresql_backup_directory != '' {
    file { $postgresql_backup_directory:
      ensure => directory,
      owner  => 'postgres',
      group  => 'postgres',
      mode   => '0600',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_base.pp]---
Location: zulip-main/puppet/zulip/manifests/postgresql_base.pp

```text
# Minimal shared configuration needed to run a Zulip PostgreSQL database.
class zulip::postgresql_base {
  include zulip::postgresql_common
  include zulip::process_fts_updates

  case $facts['os']['family'] {
    'Debian': {
      $postgresql = "postgresql-${zulip::postgresql_common::version}"
      $postgresql_sharedir = "/usr/share/postgresql/${zulip::postgresql_common::version}"
      $postgresql_confdirs = [
        "/etc/postgresql/${zulip::postgresql_common::version}",
        "/etc/postgresql/${zulip::postgresql_common::version}/main",
      ]
      $postgresql_confdir = $postgresql_confdirs[-1]
      $postgresql_datadir = "/var/lib/postgresql/${zulip::postgresql_common::version}/main"
      $tsearch_datadir = "${postgresql_sharedir}/tsearch_data"
      $pgroonga_setup_sql_path = "${postgresql_sharedir}/pgroonga_setup.sql"
      $setup_system_deps = 'setup_apt_repo'
    }
    'RedHat': {
      $postgresql = "postgresql${zulip::postgresql_common::version}"
      $postgresql_sharedir = "/usr/pgsql-${zulip::postgresql_common::version}/share"
      $postgresql_confdirs = [
        "/var/lib/pgsql/${zulip::postgresql_common::version}",
        "/var/lib/pgsql/${zulip::postgresql_common::version}/data",
      ]
      $postgresql_confdir = $postgresql_confdirs[-1]
      $postgresql_datadir = "/var/lib/pgsql/${zulip::postgresql_common::version}/data"
      $tsearch_datadir = "${postgresql_sharedir}/tsearch_data/"
      $pgroonga_setup_sql_path = "${postgresql_sharedir}/pgroonga_setup.sql"
      $setup_system_deps = 'setup_yum_repo'
    }
    default: {
      fail('osfamily not supported')
    }
  }

  file { "${tsearch_datadir}/zulip_english.stop":
    ensure  => file,
    require => Package[$postgresql],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/zulip/postgresql/zulip_english.stop',
    tag     => ['postgresql_upgrade'],
  }
  zulip::nagios_plugins { 'zulip_postgresql': }

  $pgroonga = zulipconf('machine', 'pgroonga', false)
  if $pgroonga {
    # Needed for optional our full text search system
    package{"${postgresql}-pgdg-pgroonga":
      ensure  => latest,
      require => [
        Package[$postgresql],
        Exec[$setup_system_deps]
      ],
      tag     => ['postgresql_upgrade'],
    }
    exec { 'pgroonga-config':
      require => Package["${postgresql}-pgdg-pgroonga"],
      unless  => @("EOT"/$),
          test -f ${pgroonga_setup_sql_path}.applied &&
          test "$(dpkg-query --show --showformat='\${Version}' "${postgresql}-pgdg-pgroonga")" \
             = "$(cat ${pgroonga_setup_sql_path}.applied)"
          | EOT
      command => "${facts['zulip_scripts_path']}/setup/pgroonga-config ${postgresql_sharedir}",
    }
  }

  $backups_s3_bucket = zulipsecret('secrets', 's3_backups_bucket', '')
  $backups_directory = zulipconf('postgresql', 'backups_directory', '')
  if $backups_s3_bucket != '' or $backups_directory != '' {
    include zulip::postgresql_backups
  } else {
    file { '/etc/cron.d/pg_backup_and_purge':
      ensure => absent,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_client.pp]---
Location: zulip-main/puppet/zulip/manifests/postgresql_client.pp

```text
class zulip::postgresql_client {
  $version = zulipconf('postgresql', 'version', undef)
  if $version != undef {
    package { "postgresql-client-${version}":
      ensure => installed,
    }
  } else {
    package { 'postgresql-client':
      ensure => installed,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_common.pp]---
Location: zulip-main/puppet/zulip/manifests/postgresql_common.pp

```text
class zulip::postgresql_common {
  include zulip::snakeoil
  $version = zulipconf('postgresql', 'version', undef)
  case $facts['os']['family'] {
    'Debian': {
      $postgresql = "postgresql-${version}"
      $postgresql_packages = [
        # The database itself
        $postgresql,
        # tools for database monitoring; formerly ptop
        'pgtop',
        # our dictionary
        'hunspell-en-us',
        # PostgreSQL Nagios check plugin
        'check-postgres',
        # Python modules used in our monitoring/worker threads
        'python3-dateutil', # TODO: use a virtualenv instead
      ]
      $postgresql_user_reqs = [
        Package[$postgresql],
        Package['ssl-cert'],
      ]
    }
    'RedHat': {
      $postgresql = "postgresql${version}"
      $postgresql_packages = [
        $postgresql,
        "${postgresql}-server",
        "${postgresql}-devel",
        'pg_top',
        'hunspell-en-US',
        # exists on CentOS 6 and Fedora 29 but not CentOS 7
        # see https://pkgs.org/download/check_postgres
        # alternatively, download directly from:
        # https://bucardo.org/check_postgres/
        # 'check-postgres',  # TODO
      ]
      exec {'pip3_deps':
        command => 'python3 -m pip install python-dateutil',
      }
      group { 'ssl-cert':
        ensure => present,
      }
      # allows ssl-cert group to read /etc/pki/tls/private
      file { '/etc/pki/tls/private':
        ensure => directory,
        mode   => '0750',
        owner  => 'root',
        group  => 'ssl-cert',
      }
      $postgresql_user_reqs = [
        Package[$postgresql],
        Group['ssl-cert'],
      ]
    }
    default: {
      fail('osfamily not supported')
    }
  }

  zulip::safepackage { $postgresql_packages:
    ensure  => installed,
    require => Exec['generate-default-snakeoil'],
    tag     => ['postgresql_upgrade'],
  }

  if $facts['os']['family'] == 'Debian' {
    # The logrotate file only created in debian-based systems
    exec { 'disable_logrotate':
      # lint:ignore:140chars
      command => '/usr/bin/dpkg-divert --rename --divert /etc/logrotate.d/postgresql-common.disabled --add /etc/logrotate.d/postgresql-common',
      # lint:endignore
      creates => '/etc/logrotate.d/postgresql-common.disabled',
    }
  }

  # Use arcane puppet virtual resources to add postgres user to zulip group
  @user { 'postgres':
    groups     => ['ssl-cert'],
    membership => minimum,
    require    => $postgresql_user_reqs,
  }
  User <| title == postgres |> { groups +> 'zulip' }
}
```

--------------------------------------------------------------------------------

---[FILE: process_fts_updates.pp]---
Location: zulip-main/puppet/zulip/manifests/process_fts_updates.pp

```text
class zulip::process_fts_updates {
  include zulip::supervisor
  case $facts['os']['family'] {
    'Debian': {
      $fts_updates_packages = [
        # Needed to run process_fts_updates
        'python3-psycopg2', # TODO: use a virtualenv instead
      ]
      zulip::safepackage { $fts_updates_packages: ensure => installed }
    }
    'RedHat': {
      exec {'pip_process_fts_updates':
        command => 'python3 -m pip install psycopg2',
      }
    }
    default: {
      fail('osfamily not supported')
    }
  }

  file { '/usr/local/bin/process_fts_updates':
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
    source => 'puppet:///modules/zulip/postgresql/process_fts_updates',
  }

  file { "${zulip::common::supervisor_conf_dir}/zulip_db.conf":
    ensure  => file,
    require => [Package[supervisor], Package['python3-psycopg2']],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/zulip/supervisor/conf.d/zulip_db.conf',
    notify  => Service[$zulip::common::supervisor_service],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: safepackage.pp]---
Location: zulip-main/puppet/zulip/manifests/safepackage.pp

```text
define zulip::safepackage ( $ensure = present ) {
  if !defined(Package[$title]) {
    package { $title: ensure => $ensure }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sasl_modules.pp]---
Location: zulip-main/puppet/zulip/manifests/sasl_modules.pp

```text
class zulip::sasl_modules {
  $sasl_module_packages = $facts['os']['family'] ? {
    'Debian' => [ 'libsasl2-modules' ],
    'RedHat' => [ 'cyrus-sasl-plain' ],
  }
  package { $sasl_module_packages: ensure => installed }
}
```

--------------------------------------------------------------------------------

---[FILE: sentry_cli.pp]---
Location: zulip-main/puppet/zulip/manifests/sentry_cli.pp

```text
# @summary Install sentry-cli binary
#
class zulip::sentry_cli {
  $version = $zulip::common::versions['sentry-cli']['version']
  $bin = "/srv/zulip-sentry-cli-${version}"

  $arch = $facts['os']['architecture'] ? {
    'amd64'   => 'x86_64',
    'aarch64' => 'aarch64',
  }

  zulip::external_dep { 'sentry-cli':
    version => $version,
    url     => "https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Linux-${arch}",
  }

  file { '/usr/local/bin/sentry-cli':
    ensure  => link,
    target  => $bin,
    require => File[$bin],
    before  => Exec['Cleanup sentry-cli'],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sha256_file_to.pp]---
Location: zulip-main/puppet/zulip/manifests/sha256_file_to.pp

```text
# @summary Downloads, verifies hash, and copies the one file out.
#
define zulip::sha256_file_to(
  String $sha256,
  String $url,
  String $install_to,
) {
  exec { $url:
    command => "${facts['zulip_scripts_path']}/setup/sha256-file-to ${sha256} ${url} ${install_to}",
    creates => $install_to,
    timeout => 600,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sha256_tarball_to.pp]---
Location: zulip-main/puppet/zulip/manifests/sha256_tarball_to.pp

```text
# @summary Downloads, verifies hash, and copies files out.
#
define zulip::sha256_tarball_to(
  String $sha256,
  String $url,
  String $install_from,
  String $install_to,
) {
  exec { $url:
    command => "${facts['zulip_scripts_path']}/setup/sha256-tarball-to ${sha256} ${url} ${install_from} ${install_to}",
    creates => $install_to,
    timeout => 600,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: smokescreen.pp]---
Location: zulip-main/puppet/zulip/manifests/smokescreen.pp

```text
class zulip::smokescreen {
  include zulip::supervisor
  include zulip::golang

  $version = $zulip::common::versions['smokescreen-src']['version']
  $dir = "/srv/zulip-smokescreen-src-${version}"
  $bin = "/usr/local/bin/smokescreen-${version}-go-${zulip::golang::version}"

  zulip::external_dep { 'smokescreen-src':
    version        => $version,
    url            => "https://github.com/stripe/smokescreen/archive/${version}.tar.gz",
    tarball_prefix => "smokescreen-${version}",
  }

  exec { 'compile smokescreen':
    command     => "${zulip::golang::bin} build -o ${bin}",
    cwd         => $dir,
    # GOCACHE is required; nothing is written to GOPATH, but it is required to be set
    environment => ['GOCACHE=/tmp/gocache', 'GOPATH=/root/go'],
    creates     => $bin,
    require     => [
      Zulip::External_Dep['golang'],
      Zulip::External_Dep['smokescreen-src'],
    ],
  }
  # This resource is created by the 'compile smokescreen' step.
  file { $bin:
    ensure  => file,
    require => Exec['compile smokescreen'],
  }
  exec { 'Cleanup smokescreen':
    refreshonly => true,
    provider    => shell,
    onlyif      => "ls /usr/local/bin/smokescreen-* | grep -xv '${bin}'",
    command     => "ls /usr/local/bin/smokescreen-* | grep -xv '${bin}' | xargs rm -r",
    require     => [File[$bin], Service[supervisor]],
  }

  $listen_address = zulipconf('http_proxy', 'listen_address', '127.0.0.1')
  $allow_addresses = split(zulipconf('http_proxy', 'allow_addresses', ''), ',')
  $allow_ranges = split(zulipconf('http_proxy', 'allow_ranges', ''), ',')
  $deny_addresses = split(zulipconf('http_proxy', 'deny_addresses', ''), ',')
  $deny_ranges = split(zulipconf('http_proxy', 'deny_ranges', ''), ',')

  file { "${zulip::common::supervisor_conf_dir}/smokescreen.conf":
    ensure  => file,
    require => [
      Package[supervisor],
      Exec['compile smokescreen'],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/supervisor/smokescreen.conf.erb'),
    notify  => Service[supervisor],
  }

  file { '/etc/logrotate.d/smokescreen':
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0644',
    source => 'puppet:///modules/zulip/logrotate/smokescreen',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: snakeoil.pp]---
Location: zulip-main/puppet/zulip/manifests/snakeoil.pp

```text
class zulip::snakeoil {
  zulip::safepackage { 'ssl-cert': ensure => installed }

  # We use the snakeoil certificate for PostgreSQL and SMTP; some VMs
  # install the `ssl-cert` package but (reasonably) don't build the
  # snakeoil certs into the image; build them as needed.
  exec { 'generate-default-snakeoil':
    require => Package['ssl-cert'],
    creates => '/etc/ssl/certs/ssl-cert-snakeoil.pem',
    command => '/usr/sbin/make-ssl-cert generate-default-snakeoil',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: supervisor.pp]---
Location: zulip-main/puppet/zulip/manifests/supervisor.pp

```text
class zulip::supervisor {
  $supervisor_service = $zulip::common::supervisor_service

  package { 'supervisor': ensure => installed }

  $system_conf_dir = $zulip::common::supervisor_system_conf_dir
  file { $system_conf_dir:
    ensure  => directory,
    require => Package['supervisor'],
    owner   => 'root',
    group   => 'root',
  }

  $conf_dir = $zulip::common::supervisor_conf_dir
  file { $conf_dir:
    ensure  => directory,
    require => Package['supervisor'],
    owner   => 'root',
    group   => 'root',
    purge   => true,
    recurse => true,
    notify  => Service[$supervisor_service],
  }

  # In the docker environment, we don't want/need supervisor to be
  # started/stopped /bin/true is used as a decoy command, to maintain
  # compatibility with other code using the supervisor service.
  $puppet_classes = zulipconf('machine', 'puppet_classes', undef)
  if 'docker' in $puppet_classes {
    service { $supervisor_service:
      ensure     => running,
      require    => [
        File['/var/log/zulip'],
        Package['supervisor'],
      ],
      hasstatus  => true,
      status     => '/bin/true',
      hasrestart => true,
      restart    => '/bin/true',
    }
    exec { 'supervisor-restart':
      refreshonly => true,
      command     => '/bin/true',
    }
  } else {
    service { $supervisor_service:
      ensure     => running,
      require    => [
        File['/var/log/zulip'],
        Package['supervisor'],
      ],
      hasstatus  => true,
      status     => $zulip::common::supervisor_status,
      # Restarting the whole supervisorctl on every update to its
      # configuration files has the unfortunate side-effect of
      # restarting all of the services it controls; this results in an
      # unduly large disruption.  The better option is to tell
      # supervisord to reread its config via supervisorctl and then to
      # "update".  You need to do both -- after a "reread", supervisor
      # won't actually take action based on the changed configuration
      # until you do an "update" (I assume this is so you can check if
      # your config file parses without doing anything, but it's
      # really confusing).
      #
      # If restarting supervisor itself is necessary, see
      # Exec['supervisor-restart']
      #
      # Also, to handle the case that supervisord wasn't running at
      # all, we check if it is not running and if so, start it.
      hasrestart => true,
      # lint:ignore:140chars
      restart    => "bash -c 'if pgrep -x supervisord >/dev/null; then supervisorctl reread && supervisorctl update; else ${zulip::common::supervisor_start}; fi'",
      # lint:endignore
    }
    exec { 'supervisor-restart':
      refreshonly => true,
      provider    => shell,
      command     => $zulip::common::supervisor_reload,
      require     => Service[$supervisor_service],
    }
  }

  $file_descriptor_limit = zulipconf('application_server', 'service_file_descriptor_limit', 40000)
  file { $zulip::common::supervisor_conf_file:
    ensure  => file,
    require => Package[supervisor],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('zulip/supervisor/supervisord.conf.erb'),
    notify  => Exec['supervisor-restart'],
  }

  file { '/usr/local/bin/secret-env-wrapper':
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
    source => 'puppet:///modules/zulip/secret-env-wrapper',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sysctl.pp]---
Location: zulip-main/puppet/zulip/manifests/sysctl.pp

```text
# @summary Adds a sysctl file, and immediately runs it.
define zulip::sysctl (
  $key,
  $value,
  $order = 40,
  $comment = '',
) {
  if $comment == '' {
    $content = "${key} = ${value}\n"
  } else {
    $content = "# ${comment}\n${key} = ${value}\n"
  }
  file { "/etc/sysctl.d/${order}-${name}.conf":
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => $content,
  }

  # Try to touch the procfile before trying to adjust it -- if we're
  # in a containerized environment, failure to set this is not a fatal
  # exception.
  $procpath = regsubst($key, '\.', '/')
  exec { "sysctl_p_${name}":
    command     => "/sbin/sysctl -p /etc/sysctl.d/${order}-${name}.conf",
    subscribe   => File["/etc/sysctl.d/${order}-${name}.conf"],
    refreshonly => true,
    onlyif      => "touch /proc/sys/${procpath}",
  }
}
```

--------------------------------------------------------------------------------

---[FILE: systemd_daemon_reload.pp]---
Location: zulip-main/puppet/zulip/manifests/systemd_daemon_reload.pp

```text
class zulip::systemd_daemon_reload {
  exec { 'reload systemd':
    command     => 'sh -c "! command -v systemctl > /dev/null || systemctl daemon-reload"',
    refreshonly => true,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: timesync.pp]---
Location: zulip-main/puppet/zulip/manifests/timesync.pp

```text
# @summary Allows configuration of timesync tool.
class zulip::timesync {
  $timesync = zulipconf('machine', 'timesync', 'chrony')

  case $timesync {
    'chrony': {
      package { 'ntp': ensure => purged, before => Package['chrony'] }
      package { 'chrony': ensure => installed }
      service { 'chrony': require => Package['chrony'] }
    }
    'ntpd': {
      package { 'chrony': ensure => purged, before => Package['ntp'] }
      package { 'ntp': ensure => installed }
      service { 'ntp': require => Package['ntp'] }
    }
    'none': {
      package { ['ntp', 'chrony']: ensure => purged }
    }
    default: {
      fail('Unknown timesync tool: $timesync')
    }
  }
}
```

--------------------------------------------------------------------------------

````

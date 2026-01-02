---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 436
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 436 of 1290)

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

---[FILE: app_frontend.pp]---
Location: zulip-main/puppet/kandra/manifests/app_frontend.pp

```text
class kandra::app_frontend {
  include zulip::app_frontend_base
  include zulip::profile::memcached
  include zulip::profile::rabbitmq
  include zulip::local_mailserver
  include zulip::hooks::sentry
  include kandra::app_frontend_monitoring

  kandra::firewall_allow{ 'smtp': }
  kandra::firewall_allow{ 'http': }
  kandra::firewall_allow{ 'https': }

  $redis_hostname = zulipconf('redis', 'hostname', undef)
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
    keys        => true,
    known_hosts => [$redis_hostname],
  }
  package { 'autossh': ensure => installed }
  file { "${zulip::common::supervisor_conf_dir}/redis_tunnel.conf":
    ensure  => file,
    require => [
      Package['supervisor', 'autossh'],
      Kandra::User_Dotfiles['redistunnel'],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/redis_tunnel.conf.template.erb'),
    notify  => Service['supervisor'],
  }
  # Need redis_password in its own file for Nagios
  file { '/var/lib/nagios/redis_password':
    ensure  => file,
    mode    => '0600',
    owner   => 'nagios',
    group   => 'nagios',
    content => zulipsecret('secrets', 'redis_password', ''),
  }

  # Mount /etc/zulip/well-known/ as /.well-known/
  file { '/etc/nginx/zulip-include/app.d/well-known.conf':
    require => File['/etc/nginx/zulip-include/app.d'],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/kandra/nginx/zulip-include-app.d/well-known.conf',
    notify  => Service['nginx'],
  }

  # Serve /static/navigation-tour-video/
  file { '/etc/nginx/zulip-include/app.d/navigation-tour-video.conf':
    require => File['/etc/nginx/zulip-include/app.d'],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/kandra/nginx/zulip-include-app.d/navigation-tour-video.conf',
    notify  => Service['nginx'],
  }

  # Each server does its own fetching of contributor data, since
  # we don't have a way to synchronize that among several servers.
  zulip::cron { 'fetch-contributor-data':
    hour    => '8',
    minute  => '0',
    command => '/home/zulip/deployments/current/tools/fetch-contributor-data',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: app_frontend_monitoring.pp]---
Location: zulip-main/puppet/kandra/manifests/app_frontend_monitoring.pp

```text
# @summary Prometheus monitoring of a Django frontend and RabbitMQ server.
#
class kandra::app_frontend_monitoring {
  include kandra::prometheus::memcached
  include kandra::prometheus::rabbitmq
  include kandra::prometheus::uwsgi
  include kandra::prometheus::process
  include kandra::prometheus::grok
  kandra::firewall_allow { 'tusd': port => '9900' }

  file { '/etc/cron.d/rabbitmq-monitoring':
    ensure => absent,
  }
  zulip::cron { 'check-rabbitmq-queue':
    minute  => '*',
    user    => 'root',
    command => '/home/zulip/deployments/current/scripts/nagios/check-rabbitmq-queue',
  }
  zulip::cron { 'check-rabbitmq-consumers':
    minute  => '*',
    user    => 'root',
    command => '/home/zulip/deployments/current/scripts/nagios/check-rabbitmq-consumers',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: aws_tools.pp]---
Location: zulip-main/puppet/kandra/manifests/aws_tools.pp

```text
# @summary Installs the AWS CLI
#
class kandra::aws_tools {
  $is_ec2 = zulipconf('machine', 'hosting_provider', 'ec2') == 'ec2'

  file { '/usr/local/bin/install-aws-cli':
    ensure => file,
    mode   => '0755',
    source => 'puppet:///modules/kandra/install-aws-cli',
  }
  exec { 'install-aws-cli':
    require => File['/usr/local/bin/install-aws-cli'],
    command => '/usr/local/bin/install-aws-cli',
    # When puppet is initially determining which resources need to be
    # applied, it will call the unless -- but install-aws-cli may not
    # exist yet.  Count this as needing to run.
    unless  => '[ -f /usr/local/bin/install-aws-cli ] && /usr/local/bin/install-aws-cli check',
  }

  if ! $is_ec2 {
    if $facts['os']['architecture'] == 'amd64' {
      $archname = 'X86_64'
    } else {
      $archname = 'Aarch64'
    }
    $helper_version = $zulip::common::versions['aws_signing_helper']['version']
    zulip::external_dep { 'aws_signing_helper':
      version => $helper_version,
      url     => "https://rolesanywhere.amazonaws.com/releases/${helper_version}/${archname}/Linux/Amzn2023/aws_signing_helper",
      before  => File['/root/.aws/config'],
    }
    file { '/srv/zulip-aws-tools/bin/aws_signing_helper':
      ensure  => link,
      target  => "/srv/zulip-aws_signing_helper-${helper_version}",
      require => [
        File["/srv/zulip-aws_signing_helper-${helper_version}"],
        Exec['install-aws-cli'],
      ],
      before  => Exec['Cleanup aws_signing_helper'],
    }
    file { '/usr/local/bin/teleport-aws-credentials':
      ensure  => file,
      require => [
        Package['sqlite3'],
        Service['teleport_node'],
      ],
      before  => [
        File['/root/.aws/config'],
      ],
      mode    => '0755',
      owner   => 'root',
      group   => 'root',
      source  => 'puppet:///modules/kandra/teleport-aws-credentials',
    }
  }
  file { '/root/.aws':
    ensure => directory,
    mode   => '0755',
    owner  => 'root',
    group  => 'root',
  }
  $aws_trust_arn = zulipsecret('secrets','aws_trust_arn','')
  $aws_profile_arn = zulipsecret('secrets','aws_profile_arn','')
  $aws_role_arn = zulipsecret('secrets','aws_role_arn','')
  file { '/root/.aws/config':
    ensure  => file,
    mode    => '0644',
    owner   => 'root',
    group   => 'root',
    content => template('kandra/dotfiles/aws_config.erb'),
  }

  # Pull keys and authorized_keys from AWS secretsmanager
  file { '/usr/local/bin/install-ssh-keys':
    ensure  => file,
    require => File['/root/.aws/config'],
    mode    => '0755',
    owner   => 'root',
    group   => 'root',
    source  => 'puppet:///modules/kandra/install-ssh-keys',
  }
  file { '/usr/local/bin/install-ssh-authorized-keys':
    ensure  => file,
    require => File['/root/.aws/config'],
    mode    => '0755',
    owner   => 'root',
    group   => 'root',
    source  => 'puppet:///modules/kandra/install-ssh-authorized-keys',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: camo.pp]---
Location: zulip-main/puppet/kandra/manifests/camo.pp

```text
class kandra::camo {
  class { 'zulip::camo':
    listen_address => '0.0.0.0',
  }

  kandra::firewall_allow { 'camo': port => '9292' }
}
```

--------------------------------------------------------------------------------

---[FILE: firewall.pp]---
Location: zulip-main/puppet/kandra/manifests/firewall.pp

```text
class kandra::firewall {
  package { 'iptables-persistent': }
  concat { '/etc/iptables/rules.v4':
    ensure  => present,
    mode    => '0600',
    require => Package['iptables-persistent'],
  }
  concat::fragment { 'iptables-header.v4':
    target => '/etc/iptables/rules.v4',
    source => 'puppet:///modules/kandra/iptables/header.v4',
    order  => '01',
  }
  concat::fragment { 'iptables-trailer.v4':
    target => '/etc/iptables/rules.v4',
    source => 'puppet:///modules/kandra/iptables/trailer.v4',
    order  => '99',
  }

  concat { '/etc/iptables/rules.v6':
    ensure  => present,
    mode    => '0600',
    require => Package['iptables-persistent'],
  }
  concat::fragment { 'iptables-header.v6':
    target => '/etc/iptables/rules.v6',
    source => 'puppet:///modules/kandra/iptables/header.v6',
    order  => '01',
  }
  concat::fragment { 'iptables-trailer.v6':
    target => '/etc/iptables/rules.v6',
    source => 'puppet:///modules/kandra/iptables/trailer.v6',
    order  => '99',
  }

  service { 'netfilter-persistent':
    ensure     => running,

    # Because there is no running process for this service, the normal status
    # checks fail.  Because Puppet then thinks the service has been manually
    # stopped, it won't restart it.  This fake status command will trick Puppet
    # into thinking the service is *always* running (which in a way it is, as
    # iptables is part of the kernel.)
    hasstatus  => true,
    status     => '/bin/true',

    # Under Debian, the "restart" parameter does not reload the rules, so tell
    # Puppet to fall back to stop/start, which does work.
    hasrestart => false,

    require    => Package['iptables-persistent'],
    subscribe  => [
      Concat['/etc/iptables/rules.v4'],
      Concat['/etc/iptables/rules.v6'],
    ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: firewall_allow.pp]---
Location: zulip-main/puppet/kandra/manifests/firewall_allow.pp

```text
# @summary Adds an iptables "allow" rule for the host for a port.
#
# Rules with the same ordering are ordered by the rule name.
#
define kandra::firewall_allow (
  $port = '',
  $proto = 'tcp',
  $order = '50',
) {
  if $port == '' {
    $portname = $name
  } else {
    $portname = $port
  }

  concat::fragment { "iptables_v4_${portname}":
    target  => '/etc/iptables/rules.v4',
    order   => $order,
    content => "-A INPUT -p ${proto} --dport ${portname} -j ACCEPT -m comment --comment \"${name}\"\n",
  }

  concat::fragment { "iptables_v6_${portname}":
    target  => '/etc/iptables/rules.v6',
    order   => $order,
    content => "-A INPUT -p ${proto} --dport ${portname} -j ACCEPT -m comment --comment \"${name}\"\n",
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ksplice_uptrack.pp]---
Location: zulip-main/puppet/kandra/manifests/ksplice_uptrack.pp

```text
class kandra::ksplice_uptrack {
  $ksplice_access_key = zulipsecret('secrets', 'ksplice_access_key', '')
  if $ksplice_access_key != '' {
    file { '/etc/uptrack':
      ensure => directory,
      owner  => 'root',
      group  => 'adm',
      mode   => '0750',
    }
    file { '/etc/uptrack/uptrack.conf':
      ensure  => file,
      owner   => 'root',
      group   => 'adm',
      mode    => '0640',
      content => template('kandra/uptrack/uptrack.conf.erb'),
    }
    $setup_apt_repo_file = "${facts['zulip_scripts_path']}/lib/setup-apt-repo"
    exec{ 'setup-apt-repo-ksplice':
      command => "${setup_apt_repo_file} --list ksplice",
      unless  => "${setup_apt_repo_file} --list ksplice --verify",
    }
    Package { 'uptrack':
      require => [
        Exec['setup-apt-repo-ksplice'],
        File['/etc/uptrack/uptrack.conf'],
      ],
    }
  } else {
    warning('No ksplice uptrack key is configured; ksplice is not installed!')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: mirror_to_czo.pp]---
Location: zulip-main/puppet/kandra/manifests/mirror_to_czo.pp

```text
class kandra::mirror_to_czo {
  include zulip::hooks::base
  include zulip::supervisor

  # We embed the hash of the contents into the name of the process, so
  # that `supervisorctl reread` knows that it has updated.
  $full_script_hash = sha256(file('kandra/mirror_to_czo'))
  $script_hash = $full_script_hash[0,8]

  $bin = '/usr/local/bin/mirror_to_czo'
  file { $bin:
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
    source => 'puppet:///modules/kandra/mirror_to_czo',
  }

  file { "${zulip::common::supervisor_conf_dir}/mirror_to_czo.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      File[$bin],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/mirror_to_czo.conf.template.erb'),
    notify  => Service[supervisor],
  }

  kandra::hooks::file { 'post-deploy.d/restart_mirror_to_czo.hook': }
}
```

--------------------------------------------------------------------------------

---[FILE: prod_app_frontend_once.pp]---
Location: zulip-main/puppet/kandra/manifests/prod_app_frontend_once.pp

```text
class kandra::prod_app_frontend_once {
  include zulip::app_frontend_once
  include zulip::hooks::push_git_ref
  include zulip::hooks::zulip_notify
  include kandra::hooks::zulip_notify_schema_diff
  include kandra::mirror_to_czo

  zulip::cron { 'update-first-visible-message-id':
    hour   => '7',
    minute => '0',
    manage => 'calculate_first_visible_message_id --lookback-hours 30',
  }

  zulip::cron { 'invoice-plans':
    hour   => '22',
    minute => '0',
  }
  zulip::cron { 'downgrade-small-realms-behind-on-payments':
    hour   => '17',
    minute => '0',
  }

  zulip::cron { 'check_send_receive_time':
    hour      => '*',
    minute    => '*',
    command   => '/usr/lib/nagios/plugins/zulip_app_frontend/check_send_receive_time',
    use_proxy => false,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ses_logs.pp]---
Location: zulip-main/puppet/kandra/manifests/ses_logs.pp

```text
class kandra::ses_logs {
  include kandra::vector

  $ses_logs_sqs_url = zulipsecret('secrets', 'ses_logs_sqs_url', '')
  $ses_logs_s3_bucket = zulipsecret('secrets', 'ses_logs_s3_bucket', '')

  concat::fragment { 'vector_ses_logs':
    target  => $kandra::vector::conf,
    order   => '50',
    content => template('kandra/vector_ses.toml.template.erb'),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ssh_authorized_keys.pp]---
Location: zulip-main/puppet/kandra/manifests/ssh_authorized_keys.pp

```text
define kandra::ssh_authorized_keys(
  $keys = true,
) {
  $user = $name
  if $keys == true {
    $keypath = "prod/ssh/authorized_keys/${user}"
  } elsif $keys.is_a(Array) {
    $keypath = join($keys.map |$k| {"prod/ssh/authorized_keys/${k}"}, ' ')
  } else {
    $keypath = "prod/ssh/authorized_keys/${keys}"
  }
  exec { "ssh_authorized_keys ${user}":
    require => File['/usr/local/bin/install-ssh-authorized-keys'],
    command => "/usr/local/bin/install-ssh-authorized-keys ${user} ${keypath}",
    unless  => "[ -f /usr/local/bin/install-ssh-authorized-keys ] && /usr/local/bin/install-ssh-authorized-keys --check ${user} ${keypath}",
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ssh_keys.pp]---
Location: zulip-main/puppet/kandra/manifests/ssh_keys.pp

```text
define kandra::ssh_keys(
  $keys = true,
) {
  $user = $name
  if $keys == true {
    $keypath = "prod/ssh/keys/${user}"
  } elsif $keys.is_a(Array) {
    $keypath = join($keys.map |$k| {"prod/ssh/keys/${k}"}, ' ')
  } else {
    $keypath = "prod/ssh/keys/${keys}"
  }
  exec { "ssh_keys ${user}":
    require => File['/usr/local/bin/install-ssh-keys'],
    command => "/usr/local/bin/install-ssh-keys ${user} ${keypath}",
    unless  => "[ -f /usr/local/bin/install-ssh-keys ] && /usr/local/bin/install-ssh-keys --check ${user} ${keypath}",
  }
}
```

--------------------------------------------------------------------------------

---[FILE: statuspage.pp]---
Location: zulip-main/puppet/kandra/manifests/statuspage.pp

```text
# @summary Plumb Prometheus stats into status.zulip.com
#
# Requires a /etc/zulip/statuspage.conf which maps statuspage.io
# metric_ids to Prometheus queries.
class kandra::statuspage {
  $bin = '/usr/local/bin/statuspage-pusher'

  file { $bin:
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
    source => 'puppet:///modules/kandra/statuspage-pusher',
  }

  file { "${zulip::common::supervisor_conf_dir}/statuspage-pusher.conf":
    ensure  => file,
    require => [
      Package[supervisor],
      File[$bin],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/statuspage-pusher.conf.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: user_dotfiles.pp]---
Location: zulip-main/puppet/kandra/manifests/user_dotfiles.pp

```text
define kandra::user_dotfiles (
  $home = '',
  $keys = false,
  $authorized_keys = false,
  $known_hosts = false,
) {
  $user = $name

  if $home == '' {
    $homedir = "/home/${user}"
  } else {
    $homedir = $home
  }

  file { "${homedir}/.ssh":
    ensure  => directory,
    require => User[$user],
    owner   => $user,
    group   => $user,
    mode    => '0700',
  }

  file { "${homedir}/.emacs":
    ensure  => file,
    require => User[$user],
    owner   => $user,
    group   => $user,
    mode    => '0644',
    source  => 'puppet:///modules/kandra/dotfiles/emacs.el',
  }

  # Suppress MOTD printing, to fix load problems with Nagios caused by
  # Ubuntu's default MOTD tools for things like "checking for the next
  # release" being super slow.
  file { "${homedir}/.hushlogin":
    ensure  => file,
    require => User[$user],
    owner   => $user,
    group   => $user,
    mode    => '0644',
    content => '',
  }

  if $keys != false {
    kandra::ssh_keys{ $user:
      keys    => $keys,
      require => File["${homedir}/.ssh"],
    }
  }
  if $authorized_keys != false {
    kandra::ssh_authorized_keys{ $user:
      keys    => $authorized_keys,
      require => File["${homedir}/.ssh"],
    }
  }
  if $known_hosts != false {
    file { "${homedir}/.ssh/known_hosts":
      # We mark this as "present" to ensure that it exists, but not to
      # directly control its contents.
      ensure  => present,
      owner   => $user,
      group   => $user,
      mode    => '0644',
      require => File["${homedir}/.ssh"],
    }
    $known_hosts.each |Optional[String] $hostname| {
      if $hostname == undef {
        # pass
      } elsif $hostname == 'github.com' {
        $github_keys = file('kandra/github.keys')
        exec { "${user} ssh known_hosts ${hostname}":
          command => "echo '${github_keys}' >> ${homedir}/.ssh/known_hosts",
          unless  => "grep ${hostname} ${homedir}/.ssh/known_hosts",
          require => File["${homedir}/.ssh/known_hosts"],
        }
      } else {
        exec { "${user} ssh known_hosts ${hostname}":
          command => "ssh-keyscan ${hostname} >> ${homedir}/.ssh/known_hosts",
          unless  => "grep ${hostname} ${homedir}/.ssh/known_hosts",
          require => File["${homedir}/.ssh/known_hosts"],
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: vector.pp]---
Location: zulip-main/puppet/kandra/manifests/vector.pp

```text
# @summary Installs Vector to transform Prometheus data
#
class kandra::vector {
  $version = $zulip::common::versions['vector']['version']
  $dir = "/srv/zulip-vector-${version}"
  $bin = "${dir}/bin/vector"
  $conf = '/etc/vector.toml'

  $arch = $facts['os']['architecture'] ? {
    'amd64'   => 'x86_64',
    'aarch64' => 'aarch64',
  }

  zulip::external_dep { 'vector':
    version        => $version,
    url            => "https://packages.timber.io/vector/${version}/vector-${version}-${arch}-unknown-linux-gnu.tar.gz",
    tarball_prefix => "vector-${arch}-unknown-linux-gnu",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }
  file { "${zulip::common::supervisor_conf_dir}/vector.conf":
    ensure  => file,
    require => [
      User[zulip],
      Package[supervisor],
      Concat[$conf],
      File[$bin],
    ],
    before  => Exec['Cleanup vector'],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/vector.conf.template.erb'),
    notify  => Service[supervisor],
  }

  exec { 'reload vector':
    command     => 'supervisorctl signal HUP vector',
    require     => Service[supervisor],
    refreshonly => true,
  }
  concat { $conf:
    ensure => present,
    owner  => 'root',
    group  => 'root',
    mode   => '0644',
    notify => Exec['reload vector'],
  }
  # All of the pipelines need to be included in the Prometheus
  # exporter; they insert their strings at order 90, with a leading
  # comma, in the middle of the "inputs" block
  $vector_export = @(VECTOR)
    [sources.vector_metrics]
      type = "internal_metrics"
    [sinks.prometheus_exporter]
      type = "prometheus_exporter"
      address = "0.0.0.0:9081"
      flush_period_secs = 120
      suppress_timestamp = true
      buckets = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
      inputs = ["vector_metrics"
    |-VECTOR
  concat::fragment { 'vector_export_prefix':
    target  => $conf,
    content => $vector_export,
    order   => '89',
  }
  concat::fragment { 'vector_export_suffix':
    target  => $conf,
    content => "]\n",
    order   => '99',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: file.pp]---
Location: zulip-main/puppet/kandra/manifests/hooks/file.pp

```text
# @summary Install a static hook file
#
define kandra::hooks::file() {
  include zulip::hooks::base

  file { "/etc/zulip/hooks/${title}":
    ensure => file,
    mode   => '0755',
    owner  => 'zulip',
    group  => 'zulip',
    source => "puppet:///modules/kandra/hooks/${title}",
    tag    => ['hooks'],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: zulip_notify_schema_diff.pp]---
Location: zulip-main/puppet/kandra/manifests/hooks/zulip_notify_schema_diff.pp

```text
# @summary Install hook that checks for schema drift from published ref
#
class kandra::hooks::zulip_notify_schema_diff {
  include zulip::hooks::base
  include zulip::hooks::zulip_common

  kandra::hooks::file { 'post-deploy.d/zulip_notify_schema_diff.hook': }
}
```

--------------------------------------------------------------------------------

---[FILE: base.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/base.pp

```text
class kandra::profile::base {
  include zulip::profile::base
  include kandra::ksplice_uptrack
  include kandra::firewall
  include kandra::teleport::node
  include kandra::prometheus::node

  kandra::firewall_allow { 'ssh': order => '10'}
  $is_ec2 = zulipconf('machine', 'hosting_provider', 'ec2') == 'ec2'

  $org_base_packages = [
    # Standard kernel, not AWS', so ksplice works
    'linux-image-virtual',
    # Management for our systems
    'openssh-server',
    # package management
    'aptitude',
    # SSL certificates
    'certbot',
    # For managing our current Debian packages
    'debian-goodies',
    # Popular editors
    'vim',
    'emacs-nox',
    # Prevent accidental reboots
    'molly-guard',
    # For extracting Teleport certs
    'sqlite3',
    # Useful tools in a production environment
    'screen',
    'strace',
    'bind9-host',
    'git',
    'nagios-plugins-contrib',
    'ripgrep',
    'bat',
  ]
  zulip::safepackage { $org_base_packages: ensure => installed }
  file { '/usr/local/bin/bat':
    ensure => link,
    target => '/usr/bin/batcat',
  }

  # Uninstall the AWS kernel, but only after we install the usual one
  package { ['linux-image-aws', 'linux-headers-aws', 'linux-aws-*', 'linux-image-*-aws', 'linux-modules-*-aws']:
    ensure  => absent,
    require => Package['linux-image-virtual'],
  }

  file { '/etc/apt/apt.conf.d/02periodic':
    ensure => file,
    mode   => '0644',
    source => 'puppet:///modules/kandra/apt/apt.conf.d/02periodic',
  }

  file { '/etc/apt/apt.conf.d/50unattended-upgrades':
    ensure => file,
    mode   => '0644',
    source => 'puppet:///modules/kandra/apt/apt.conf.d/50unattended-upgrades',
  }
  file { '/etc/needrestart/conf.d/zulip.conf':
    ensure => file,
    mode   => '0644',
    source => 'puppet:///modules/kandra/needrestart/zulip.conf',
  }

  user { 'root': }
  kandra::user_dotfiles { 'root':
    home            => '/root',
    keys            => 'internal-read-only-deploy-key',
    authorized_keys => 'common',
    known_hosts     => ['github.com'],
  }

  kandra::user_dotfiles { 'zulip':
    keys            => 'internal-read-only-deploy-key',
    authorized_keys => 'common',
    known_hosts     => ['github.com'],
  }

  service { 'ssh':
    ensure => running,
  }

  include kandra::aws_tools

  if $is_ec2 {
    # EC2 hosts can use the in-VPC timeserver
    file { '/etc/chrony/chrony.conf':
      ensure  => file,
      mode    => '0644',
      source  => 'puppet:///modules/kandra/chrony.conf',
      require => Package['chrony'],
      notify  => Service['chrony'],
    }
  }

  group { 'nagios':
    ensure => present,
    gid    => '1050',
  }
  user { 'nagios':
    ensure     => present,
    uid        => '1050',
    gid        => '1050',
    shell      => '/bin/bash',
    home       => '/var/lib/nagios',
    managehome => true,
  }
  file { '/var/lib/nagios':
    ensure  => directory,
    require => User['nagios'],
    owner   => 'nagios',
    group   => 'nagios',
    mode    => '0700',
  }
  kandra::user_dotfiles { 'nagios':
    home            => '/var/lib/nagios',
    authorized_keys => true,
  }
  file { '/home/nagios':
    ensure  => absent,
    force   => true,
    recurse => true,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: chat_zulip_org.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/chat_zulip_org.pp

```text
class kandra::profile::chat_zulip_org inherits kandra::profile::base {
  include zulip::profile::standalone
  include zulip::local_mailserver
  include zulip::hooks::sentry
  include zulip::hooks::zulip_notify

  include kandra::app_frontend_monitoring
  include kandra::prometheus::redis
  include kandra::prometheus::postgresql
  kandra::firewall_allow { 'smokescreen_metrics': port => '4760' }
  kandra::firewall_allow { 'http': }
  kandra::firewall_allow { 'https': }
  kandra::firewall_allow { 'smtp': }

  Kandra::User_Dotfiles['root'] {
    keys => false,
  }
  Kandra::User_Dotfiles['zulip'] {
    keys => false,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: grafana.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/grafana.pp

```text
# @summary Observability using Grafana
#
class kandra::profile::grafana inherits kandra::profile::base {

  include zulip::supervisor

  $version = $zulip::common::versions['grafana']['version']
  $dir = "/srv/zulip-grafana-${version}"
  $bin = "${dir}/bin/grafana-server"
  $data_dir = '/var/lib/grafana'

  zulip::external_dep { 'grafana':
    version        => $version,
    url            => "https://dl.grafana.com/oss/release/grafana-${version}.linux-${zulip::common::goarch}.tar.gz",
    tarball_prefix => "grafana-v${version}",
    bin            => [$bin],
    cleanup_after  => [Service[supervisor]],
  }

  group { 'grafana':
    ensure => present,
    gid    => '1070',
  }
  user { 'grafana':
    ensure     => present,
    uid        => '1070',
    gid        => '1070',
    shell      => '/bin/bash',
    home       => $data_dir,
    managehome => false,
  }
  file { $data_dir:
    ensure  => directory,
    owner   => 'grafana',
    group   => 'grafana',
    require => [ User[grafana], Group[grafana] ],
  }
  file { '/var/log/grafana':
    ensure => directory,
    owner  => 'grafana',
    group  => 'grafana',
  }

  kandra::teleport::application { 'monitoring': port => '3000' }
  kandra::firewall_allow { 'grafana': port => '3000' }
  file { "${zulip::common::supervisor_conf_dir}/grafana.conf":
    ensure  => file,
    require => [
      Package[supervisor],
      File[$bin],
      File[$data_dir],
      File['/var/log/grafana'],
    ],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/supervisor/conf.d/grafana.conf.erb'),
    notify  => Service[supervisor],
  }

  $email_host = zulipconf('grafana', 'email_host', '')
  $email_from = zulipconf('grafana', 'email_from', '')
  $email_user = zulipsecret('secrets', 'grafana_email_user', '')
  $email_password = zulipsecret('secrets', 'grafana_email_password', '')
  file { '/etc/grafana':
    ensure => directory,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
  }
  file { '/etc/grafana/grafana.ini':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/grafana.ini.template.erb'),
    notify  => Service[supervisor],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: nagios.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/nagios.pp

```text
class kandra::profile::nagios inherits kandra::profile::base {

  include kandra::apache

  package { ['nagios4', 'msmtp', 'autossh']: ensure => installed }
  $nagios_alert_email = zulipconf('nagios', 'alert_email', undef)
  $nagios_test_email = zulipconf('nagios', 'test_email', undef)
  $nagios_pager_email = zulipconf('nagios', 'pager_email', undef)

  $nagios_mail_domain = zulipconf('nagios', 'mail_domain', undef)
  $nagios_mail_host = zulipconf('nagios', 'mail_host', undef)
  $nagios_mail_password = zulipsecret('secrets', 'nagios_mail_password', '')
  if zulipconf('nagios', 'camo_check_url', undef) =~ /^https:\/\/([^\/]*)(\/.*)$/ {
    $nagios_camo_check_host = $1
    $nagios_camo_check_path = $2
  }

  $default_host_domain = zulipconf('nagios', 'default_host_domain', undef)
  $hosts_app_prod = split(zulipconf('nagios', 'hosts_app_prod', undef), ',')
  $hosts_app_staging = split(zulipconf('nagios', 'hosts_app_staging', undef), ',')
  $hosts_postgresql_primary = split(zulipconf('nagios', 'hosts_postgresql_primary', undef), ',')
  $hosts_postgresql_replica = split(zulipconf('nagios', 'hosts_postgresql_replica', undef), ',')
  $hosts_redis = split(zulipconf('nagios', 'hosts_redis', undef), ',')
  $hosts_fullstack = split(zulipconf('nagios', 'hosts_fullstack', undef), ',')
  $hosts_smokescreen = split(zulipconf('nagios', 'hosts_smokescreen', undef), ',')
  $hosts_other = split(zulipconf('nagios', 'hosts_other', undef), ',')

  $hosts = zulipconf_nagios_hosts()
  $qualified_hosts = $hosts.map |$h| { if '.' in $h { $h } else { "${h}.${default_host_domain}" }}
  Kandra::User_Dotfiles['nagios'] {
    keys        => 'nagios',
    known_hosts => $qualified_hosts,
  }

  file { '/etc/nagios4/':
    recurse => true,
    purge   => false,
    require => Package[nagios4],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/kandra/nagios4/',
    notify  => Service['nagios4'],
  }

  file { '/etc/apache2/sites-available/nagios.conf':
    purge   => false,
    require => Package[apache2],
    owner   => 'root',
    group   => 'root',
    mode    => '0640',
    content => template('kandra/nagios_apache_site.conf.template.erb'),
  }
  apache2site { 'nagios':
    ensure  => present,
    require => [
      File['/etc/apache2/sites-available/nagios.conf'],
      Apache2mod['headers'], Apache2mod['ssl'],
    ],
    notify  => Service['apache2'],
  }
  kandra::teleport::application{ 'nagios':
    description => 'Monitoring: nagios',
    port        => '3000',
  }

  file { '/etc/nagios4/conf.d/contacts.cfg':
    require => Package[nagios4],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/nagios4/contacts.cfg.template.erb'),
    notify  => Service['nagios4'],
  }
  file { '/etc/nagios4/conf.d/hosts.cfg':
    require => Package[nagios4],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/nagios4/hosts.cfg.template.erb'),
    notify  => Service['nagios4'],
  }
  file { '/etc/nagios4/conf.d/localhost.cfg':
    require => Package[nagios4],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/nagios4/localhost.cfg.template.erb'),
    notify  => Service['nagios4'],
  }

  file { '/etc/nagios4/cgi.cfg':
    require => Package[nagios4],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('kandra/nagios4/cgi.cfg.template.erb'),
    notify  => Service['nagios4'],
  }

  service { 'nagios4':
    ensure  => running,
    require => Kandra::User_Dotfiles['nagios'],
  }

  file { [
    '/etc/nagios4/conf.d/extinfo_nagios2.cfg',
    '/etc/nagios4/conf.d/services_nagios2.cfg',
    '/etc/nagios4/conf.d/contacts_nagios2.cfg',
    '/etc/nagios4/conf.d/hostgroups_nagios2.cfg',
    '/etc/nagios4/conf.d/localhost_nagios2.cfg',
    '/etc/nagios4/conf.d/zulip_nagios.cfg',
  ]:
    ensure => absent,
  }

  file { "${zulip::common::supervisor_conf_dir}/autossh_tunnels.conf":
    ensure  => file,
    require => [
      Package['supervisor', 'autossh'],
      Kandra::User_Dotfiles['nagios'],
    ],
    mode    => '0644',
    owner   => 'root',
    group   => 'root',
    content => template('kandra/supervisor/conf.d/autossh_tunnels.conf.erb'),
    notify  => Service['supervisor'],
  }
  file { '/etc/nagios4/conf.d/zulip_autossh.cfg':
    ensure  => file,
    mode    => '0644',
    owner   => 'root',
    group   => 'root',
    content => template('kandra/nagios_autossh.template.erb'),
    notify  => Service['nagios4'],
  }

  file { '/var/lib/nagios/msmtprc':
    ensure  => file,
    mode    => '0600',
    owner   => 'nagios',
    group   => 'nagios',
    content => template('kandra/msmtprc_nagios.template.erb'),
    require => File['/var/lib/nagios'],
  }

  file { '/var/lib/nagios/.ssh/config':
    ensure => file,
    mode   => '0644',
    owner  => 'nagios',
    group  => 'nagios',
    source => 'puppet:///modules/kandra/nagios_ssh_config',
  }

  # Disable apparmor for msmtp so it can read the above config file
  file { '/etc/apparmor.d/disable/usr.bin.msmtp':
    ensure => link,
    target => '/etc/apparmor.d/usr.bin.msmtp',
    notify => Exec['reload apparmor'],
  }
  exec {'reload apparmor':
    command     => '/sbin/apparmor_parser -R /etc/apparmor.d/usr.bin.msmtp',
    refreshonly => true,
  }

  exec { 'fix_nagios_permissions':
    command => 'dpkg-statoverride --update --add nagios www-data 2710 /var/lib/nagios4/rw',
    unless  => 'bash -c "ls -ld /var/lib/nagios4/rw | grep ^drwx--s--- -q"',
    notify  => Service['nagios4'],
  }
  exec { 'fix_nagios_permissions2':
    command => 'dpkg-statoverride --update --add nagios nagios 751 /var/lib/nagios4',
    unless  => 'bash -c "ls -ld /var/lib/nagios4 | grep ^drwxr-x--x -q"',
    notify  => Service['nagios4'],
  }

  # TODO: Install our API
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/postgresql.pp

```text
class kandra::profile::postgresql inherits kandra::profile::base {
  include kandra::teleport::db
  include kandra::prometheus::postgresql

  # We key off of `listen_addresses` being set to know if we should be starting PostgreSQL.
  $listen_addresses = zulipconf('postgresql', 'listen_addresses', undef)
  $is_stage1 = ($listen_addresses == undef)
  class { 'zulip::profile::postgresql':
    start => ! $is_stage1,
  }

  package { ['xfsprogs', 'nvme-cli']: ensure => installed }

  kandra::firewall_allow{ 'postgresql': }

  zulip::sysctl { 'postgresql-swappiness':
    key   => 'vm.swappiness',
    value => '0',
  }
  zulip::sysctl { 'postgresql-overcommit':
    key   => 'vm.overcommit_memory',
    value => '2',
  }

  file { '/root/setup_disks.sh':
    ensure => file,
    owner  => 'root',
    group  => 'root',
    mode   => '0744',
    source => 'puppet:///modules/kandra/postgresql/setup_disks.sh',
  }
  exec { 'setup_disks':
    command => '/root/setup_disks.sh',
    # We need to not have started installing the non-AWS kernel, so
    # the xfs module gets installed for the running kernel, and we can
    # mount it.
    before  => Package['linux-image-virtual'],
    require => Package["postgresql-${zulip::postgresql_common::version}", 'xfsprogs', 'nvme-cli'],
    unless  => 'test /var/lib/postgresql/ -ef /srv/data/postgresql/',
  }

  # This is the second stage, after secrets are configured
  if (! $is_stage1) {
    $replication_primary = zulipconf('postgresql', 'replication_primary', undef)
    $replication_user = zulipconf('postgresql', 'replication_user', undef)
    if $replication_primary != undef and $replication_user != undef {
      file { '/root/setup_data.sh':
        ensure => file,
        owner  => 'root',
        group  => 'root',
        mode   => '0744',
        source => 'puppet:///modules/kandra/postgresql/setup_data.sh',
      }
      exec { 'setup_data':
        command => '/root/setup_data.sh',
        require => [File['/usr/local/bin/env-wal-g'], Exec['setup_disks']],
        unless  => "test -d /srv/data/postgresql/${zulip::postgresql_common::version}/main",
        timeout => 0,
        before  => File["${zulip::postgresql_base::postgresql_datadir}/standby.signal"],
        notify  => Service['postgresql'],
      }
    }
  }

  file { "${zulip::postgresql_base::postgresql_confdir}/pg_hba.conf":
    ensure  => file,
    require => Package["postgresql-${zulip::postgresql_common::version}"],
    notify  => Service['postgresql'],
    owner   => 'postgres',
    group   => 'postgres',
    mode    => '0640',
    source  => 'puppet:///modules/kandra/postgresql/pg_hba.conf',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: prod_app_frontend.pp]---
Location: zulip-main/puppet/kandra/manifests/profile/prod_app_frontend.pp

```text
class kandra::profile::prod_app_frontend inherits kandra::profile::base {
  include kandra::app_frontend
  include zulip::hooks::zulip_notify

  Kandra::User_Dotfiles['root'] {
    keys => 'internal-limited-write-deploy-key',
  }
  Kandra::User_Dotfiles['zulip'] {
    keys => 'internal-limited-write-deploy-key',
  }

  zulip::sysctl { 'conntrack':
    comment => 'Increase conntrack kernel table size',
    key     => 'net.nf_conntrack_max',
    value   => zulipconf('application_server', 'conntrack_max', 262144),
  }

  file { '/etc/nginx/sites-available/zulip':
    ensure  => file,
    require => Package['nginx-full'],
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    source  => 'puppet:///modules/kandra/nginx/sites-available/zulip',
    notify  => Service['nginx'],
  }

  file { '/etc/nginx/sites-enabled/zulip':
    ensure  => link,
    require => Package['nginx-full'],
    target  => '/etc/nginx/sites-available/zulip',
    notify  => Service['nginx'],
  }

  # Prod has our Apple Push Notifications Service private key at
  # /etc/ssl/django-private/apns-dist.pem
}
```

--------------------------------------------------------------------------------

````

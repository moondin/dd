---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 435
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 435 of 1290)

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

---[FILE: resource.cfg]---
Location: zulip-main/puppet/kandra/files/nagios4/resource.cfg

```text
###########################################################################
#
# RESOURCE.CFG - Resource File for Nagios
#
# You can define $USERx$ macros in this file, which can in turn be used
# in command definitions in your host config file(s).  $USERx$ macros are
# useful for storing sensitive information such as usernames, passwords,
# etc.  They are also handy for specifying the path to plugins and
# event handlers - if you decide to move the plugins or event handlers to
# a different directory in the future, you can just update one or two
# $USERx$ macros, instead of modifying a lot of command definitions.
#
# The CGIs will not attempt to read the contents of resource files, so
# you can set restrictive permissions (600 or 660) on them.
#
# Nagios supports up to 32 $USERx$ macros ($USER1$ through $USER32$)
#
# Resource files may also be used to store configuration directives for
# external data sources like MySQL...
#
###########################################################################

# Sets $USER1$ to be the path to the plugins
$USER1$=/usr/lib/nagios/plugins

# Sets $USER2$ to be the path to event handlers
#$USER2$=/usr/lib/nagios/plugins/eventhandlers

# Store some usernames and passwords (hidden from the CGIs)
#$USER3$=someuser
#$USER4$=somepassword
```

--------------------------------------------------------------------------------

---[FILE: zuliprc]---
Location: zulip-main/puppet/kandra/files/nagios4/zuliprc

```text
# Zulip, Inc's internal nagios plugin configuration.
# The plugin and example config are under api/integrations/

[api]
email = nagios-bot@zulip.com
key = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
site = https://staging.zulip.com
```

--------------------------------------------------------------------------------

---[FILE: generic-host_nagios2.cfg]---
Location: zulip-main/puppet/kandra/files/nagios4/conf.d/generic-host_nagios2.cfg

```text
# Generic host definition template - This is NOT a real host, just a template!

define host{
        name                            generic-host    ; The name of this host template
        notifications_enabled           1       ; Host notifications are enabled
        event_handler_enabled           1       ; Host event handler is enabled
        flap_detection_enabled          0
        failure_prediction_enabled      1       ; Failure prediction is enabled
        process_perf_data               1       ; Process performance data
        retain_status_information       1       ; Retain status information across program restarts
        retain_nonstatus_information    1       ; Retain non-status information across program restarts
                check_command           check_tcp!22
                max_check_attempts              10
                notification_interval           0
                notification_period             24x7
                notification_options            d,u,r
                contact_groups                  admins
        register                        0       ; DONT REGISTER THIS DEFINITION - ITS NOT A REAL HOST, JUST A TEMPLATE!
        }
```

--------------------------------------------------------------------------------

---[FILE: generic-service_nagios2.cfg]---
Location: zulip-main/puppet/kandra/files/nagios4/conf.d/generic-service_nagios2.cfg

```text
# generic service template definition
define service{
        name                            generic-service ; The 'name' of this service template
        active_checks_enabled           1       ; Active service checks are enabled
        passive_checks_enabled          1       ; Passive service checks are enabled/accepted
        parallelize_check               1       ; Active service checks should be parallelized (disabling this can lead to major performance problems)
        obsess_over_service             1       ; We should obsess over this service (if necessary)
        check_freshness                 0       ; Default is to NOT check service 'freshness'
        notifications_enabled           1       ; Service notifications are enabled
        event_handler_enabled           1       ; Service event handler is enabled
        flap_detection_enabled          0
        failure_prediction_enabled      1       ; Failure prediction is enabled
        process_perf_data               1       ; Process performance data
        retain_status_information       1       ; Retain status information across program restarts
        retain_nonstatus_information    1       ; Retain non-status information across program restarts
                notification_interval           0               ; Only send notifications on status change by default.
                is_volatile                     0
                check_period                    24x7
                check_interval                  1
                retry_interval                  1
                max_check_attempts              2
                notification_period             24x7
                notification_options            w,u,c,r
                contact_groups                  admins
        register                        0       ; DONT REGISTER THIS DEFINITION - ITS NOT A REAL SERVICE, JUST A TEMPLATE!
        }
```

--------------------------------------------------------------------------------

---[FILE: hostgroups.cfg]---
Location: zulip-main/puppet/kandra/files/nagios4/conf.d/hostgroups.cfg

```text
define hostgroup {
        hostgroup_name          all
        alias                   All servers
        members                 *
}

define hostgroup {
        hostgroup_name          aws_host
        alias                   Hosts in AWS
}

define hostgroup {
        hostgroup_name          non_aws_host
        alias                   Hosts not in AWS
}

define hostgroup {
        hostgroup_name          pageable_servers
        alias                   Servers for whom we want to page
}

define hostgroup {
        hostgroup_name          not_pageable_servers
        alias                   Servers for whom we do not want to page
}

define hostgroup {
        hostgroup_name          flaky_servers
        alias                   Servers for whom we do not page, and have flakier net
}

define hostgroup {
        hostgroup_name          fullstack
        alias                   Fullstack hosts
}

define hostgroup {
        hostgroup_name          frontends
        alias                   Frontend web servers
        hostgroup_members       staging_frontends, prod_frontends
}

define hostgroup {
        hostgroup_name          staging_frontends
        alias                   Staging frontend web servers
}

define hostgroup {
        hostgroup_name          prod_frontends
        alias                   Production frontend web servers
}

define hostgroup {
        hostgroup_name          redis
        alias                   Redis servers
}

define hostgroup {
        hostgroup_name          postgresql
        alias                   PostgreSQL app servers
        hostgroup_members       postgresql_primary, postgresql_replica
}

define hostgroup {
        hostgroup_name          postgresql_primary
        alias                   Primary PostgreSQL app servers
}

define hostgroup {
        hostgroup_name          postgresql_replica
        alias                   Replica PostgreSQL servers
}

define hostgroup {
        hostgroup_name          smokescreen
        alias                   Servers that run the Smokescreen HTTP proxy
}

define hostgroup {
        hostgroup_name          other
        alias                   Other servers
}
```

--------------------------------------------------------------------------------

---[FILE: services.cfg]---
Location: zulip-main/puppet/kandra/files/nagios4/conf.d/services.cfg

```text
### SSH

define service {
        use                             generic-service
        service_description             SSH - pageable
        hostgroup_name                  pageable_servers
        check_command                   check_ssh
        contact_groups                  page_admins
}

define service {
        use                             generic-service
        service_description             SSH
        hostgroup_name                  not_pageable_servers
        check_command                   check_ssh
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             SSH for flaky machines
        hostgroup_name                  flaky_servers
        check_command                   check_ssh
        normal_check_interval           2
        retry_check_interval            2
        max_check_attempts              5
        contact_groups                  admins
}


### Disk usage

define service {
        use                             generic-service
        service_description             Disk usage - pageable
        hostgroup_name                  pageable_servers
        check_command                   check_remote_disk!20%!10%
        contact_groups                  ops_message
}

define service {
        use                             generic-service
        service_description             Disk usage
        hostgroup_name                  not_pageable_servers
        check_command                   check_remote_disk!20%!10%
        contact_groups                  ops_message
}

define service {
        use                             generic-service
        service_description             Disk usage for flaky machines
        hostgroup_name                  flaky_servers
        check_command                   check_remote_disk!20%!10%
        normal_check_interval           2
        retry_check_interval            2
        max_check_attempts              5
        contact_groups                  admins
}


### System updates

define service {
        use                             generic-service
        service_description             Debian update availability
        hostgroup_name                  all
        check_command                   check_debian_packages!22
        contact_groups                  admins
}


### NTP

define service {
        use                             generic-service
        service_description             Check AWS NTP time
        hostgroup_name                  aws_host
        check_command                   check_ntp_time!22!169.254.169.123
        max_check_attempts              3
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check non-AWS NTP time
        hostgroup_name                  non_aws_host
        check_command                   check_ntp_time!22!pool.ntp.org
        max_check_attempts              5
        contact_groups                  admins
}





### Service groups

#### Application frontends

define service {
        use                             generic-service
        service_description             HTTPS
        hostgroup_name                  prod_frontends, fullstack
        check_command                   check_https_status
        contact_groups                  page_admins
}

define service {
        use                             generic-service
        service_description             HTTPS
        hostgroup_name                  staging_frontends
        check_command                   check_https_status
        contact_groups                  ops_message
}

define service {
        use                             generic-service
        service_description             Check send receive time
        hostgroup_name                  prod_frontends, fullstack
        check_command                   check_send_receive_time!22
        max_check_attempts              2
        contact_groups                  page_admins
}

define service {
        use                             generic-service
        service_description             Check send receive time
        hostgroup_name                  staging_frontends
        check_command                   check_send_receive_time!22
        max_check_attempts              2
        contact_groups                  ops_message
}

define service {
        use                             generic-service
        service_description             Check analytics state
        hostgroup_name                  prod_frontends
        check_command                   check_analytics_state!22
        max_check_attempts              2
        contact_groups                  admins
}


#### PostgreSQL

define service {
        use                             generic-service
        service_description             Check PostgreSQL connection
        hostgroup_name                  postgresql
        check_command                   check_postgres!zulip!nagios!connection
        contact_groups                  page_admins
}

define service {
        use                             generic-service
        service_description             Check PostgreSQL autovac_freeze
        hostgroup_name                  postgresql
        check_command                   check_postgres_alert_args!zulip!nagios!autovac_freeze!101%!105%
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check PostgreSQL backends
        hostgroup_name                  postgresql
        check_command                   check_postgres!zulip!nagios!backends
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check PostgreSQL disabled triggers
        hostgroup_name                  postgresql
        check_command                   check_postgres!zulip!nagios!disabled_triggers
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check PostgreSQL hitratio
        hostgroup_name                  postgresql
        check_command                   check_postgres!zulip!nagios!hitratio
        contact_groups                  admins
}

# define service {
#         use                             generic-service
#         service_description             Check PostgreSQL locks
#         hostgroup_name                  postgresql
#         check_command                   check_postgres_alert_args!zulip!nagios!locks!400!600
#         contact_groups                  admins
# }

define service {
        use                             generic-service
        service_description             Check PostgreSQL query_time
        hostgroup_name                  postgresql
        check_command                   check_postgres_alert_args!zulip!nagios!query_time!20 seconds!40 seconds
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check PostgreSQL sequence
        hostgroup_name                  postgresql
        check_command                   check_postgres!zulip!nagios!sequence
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check PostgreSQL timesync
        hostgroup_name                  postgresql
        check_command                   check_postgres!zulip!nagios!timesync
        contact_groups                  admins
}

# define service {
#         use                             generic-service
#         service_description             Check PostgreSQL txn_idle
#         hostgroup_name                  postgresql
#         check_command                   check_postgres_alert_args!zulip!nagios!txn_idle!20 seconds!40 seconds
#         contact_groups                  admins
# }

define service {
        use                             generic-service
        service_description             Check PostgreSQL txn_time
        hostgroup_name                  postgresql
        check_command                   check_postgres_alert_args!zulip!nagios!txn_time!20 seconds!40 seconds
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check FTS update log length
        hostgroup_name                  postgresql_primary
        check_command                   check_fts_update_log
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check PostgreSQL replication lag
        hostgroup_name                  postgresql_primary, postgresql_replica
        check_command                   check_postgresql_replication_lag
        contact_groups                  admins
}


#### Redis

define service {
        use                             generic-service
        service_description             Check redis service
        # Both redis and frontends hostgroups, since frontends SSH proxy redis to themselves
        hostgroup_name                  prod_frontends, fullstack, redis
        check_command                   check_redis_ssh!22
        max_check_attempts              3
        contact_groups                  page_admins
}

define service {
        use                             generic-service
        service_description             Check redis service
        hostgroup_name                  staging_frontends
        check_command                   check_redis_ssh!22
        max_check_attempts              3
        contact_groups                  ops_message
}

#### RabbitMQ / queue workers

define service {
        use                             generic-service
        service_description             Check RabbitMQ queue sizes
        hostgroup_name                  prod_frontends, fullstack
        check_command                   check_rabbitmq_queues!22
        # Workaround weird checks 40s after first error causing alerts
        # from a single failure because cron hasn't run again yet
        max_check_attempts              3
        contact_groups                  page_admins_and_warn_czo
}

define service {
        use                             generic-service
        service_description             Check RabbitMQ queue sizes
        hostgroup_name                  staging_frontends
        check_command                   check_rabbitmq_queues!22
        # Workaround weird checks 40s after first error causing alerts
        # from a single failure because cron hasn't run again yet
        max_check_attempts              3
        contact_groups                  ops_message
}

define service {
        name                            rabbitmq-consumer-service
        use                             generic-service
        service_description             RabbitMQ consumer check template
        hostgroup_name                  frontends
        # Workaround weird checks 40s after first error causing alerts
        # from a single failure because cron hasn't run again yet
        max_check_attempts              3
        contact_groups                  admins
        register                        0
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ notify_tornado consumers
        hostgroup_name                  prod_frontends, fullstack
        check_command                   check_rabbitmq_consumers!notify_tornado
        contact_groups                  page_admins
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ notify_tornado consumers
        hostgroup_name                  staging_frontends
        check_command                   check_rabbitmq_consumers!notify_tornado
        contact_groups                  admins
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ deferred_work consumers
        check_command                   check_rabbitmq_consumers!deferred_work
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ digest digest_emails consumers
        check_command                   check_rabbitmq_consumers!digest_emails
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ email_mirror consumers
        check_command                   check_rabbitmq_consumers!email_mirror
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ email_senders consumers
        check_command                   check_rabbitmq_consumers!email_senders
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ deferred_email_senders consumers
        check_command                   check_rabbitmq_consumers!deferred_email_senders
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ embed_links consumers
        check_command                   check_rabbitmq_consumers!embed_links

}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ embedded_bots consumers
        check_command                   check_rabbitmq_consumers!embedded_bots
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ missedmessage_emails consumers
        check_command                   check_rabbitmq_consumers!missedmessage_emails
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ missedmessage_mobile_notifications consumers
        check_command                   check_rabbitmq_consumers!missedmessage_mobile_notifications
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ outgoing_webhooks consumers
        check_command                   check_rabbitmq_consumers!outgoing_webhooks
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ thumbnail consumers
        check_command                   check_rabbitmq_consumers!thumbnail

}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ user_activity consumers
        check_command                   check_rabbitmq_consumers!user_activity
}

define service {
        use                             rabbitmq-consumer-service
        service_description             Check RabbitMQ user_activity_interval consumers
        check_command                   check_rabbitmq_consumers!user_activity_interval
}

define service {
        use                             generic-service
        service_description             Check worker memory usage
        hostgroup_name                  frontends
        check_command                   check_worker_memory
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check for queue worker errors.
        hostgroup_name                  frontends
        check_command                   check_queue_worker_errors!22
        contact_groups                  admins
}



### Smokescreen

define service {
        use                             generic-service
        service_description             Check Smokescreen proxy
        hostgroup_name                  smokescreen
        check_command                   check_proxy_status
        contact_groups                  page_admins
}
```

--------------------------------------------------------------------------------

---[FILE: timeperiods_nagios2.cfg]---
Location: zulip-main/puppet/kandra/files/nagios4/conf.d/timeperiods_nagios2.cfg

```text
###############################################################################
# timeperiods.cfg
###############################################################################

# This defines a timeperiod where all times are valid for checks,
# notifications, etc.  The classic "24x7" support nightmare. :-)

define timeperiod{
        timeperiod_name 24x7
        alias           24 Hours A Day, 7 Days A Week
        sunday          00:00-24:00
        monday          00:00-24:00
        tuesday         00:00-24:00
        wednesday       00:00-24:00
        thursday        00:00-24:00
        friday          00:00-24:00
        saturday        00:00-24:00
        }

# Here is a slightly friendlier period during work hours
define timeperiod{
        timeperiod_name workhours
        alias           Standard Work Hours
        monday          09:00-17:00
        tuesday         09:00-17:00
        wednesday       09:00-17:00
        thursday        09:00-17:00
        friday          09:00-17:00
        }

# The complement of workhours
define timeperiod{
        timeperiod_name nonworkhours
        alias           Non-Work Hours
        sunday          00:00-24:00
        monday          00:00-09:00,17:00-24:00
        tuesday         00:00-09:00,17:00-24:00
        wednesday       00:00-09:00,17:00-24:00
        thursday        00:00-09:00,17:00-24:00
        friday          00:00-09:00,17:00-24:00
        saturday        00:00-24:00
        }

# This one is a favorite: never :)
define timeperiod{
        timeperiod_name never
        alias           Never
        }

# end of file
```

--------------------------------------------------------------------------------

---[FILE: zulip.conf]---
Location: zulip-main/puppet/kandra/files/needrestart/zulip.conf

```text
# -*-cperl-*-
my @ignore = (
    qr/^memcached\.service$/,
    qr/^nginx\.service$/,
    qr/^postgresql(@[0-9a-zA-Z_-]+)?.service$/,
    qr/^epmd\.service$/,
    qr/^rabbitmq-server\.service$/,
    qr/^redis-server\.service$/,
    qr/^supervisor\.service$/,
    qr/^teleport(\w*)\.service$/,
);

$nrconf{override_rc}{$_} = 0 for @ignore;

# ksplice keeps the kernel updated in a way that needrestart does not
# understand; silence these hints
$nrconf{kernelhints} = -1
```

--------------------------------------------------------------------------------

---[FILE: zulip]---
Location: zulip-main/puppet/kandra/files/nginx/sites-available/zulip

```text
server {
    # If coming from localhost, we do allow access to internal
    # APIs over HTTP.
    listen 127.0.0.1:80;
    listen [::1]:80;

    location /api/internal/ {
        include /etc/nginx/zulip-include/api_headers;
        include uwsgi_params;
    }
}

include /etc/nginx/zulip-include/trusted-proto;
include /etc/nginx/zulip-include/s3-cache;
include /etc/nginx/zulip-include/upstreams;
include /etc/zulip/nginx_sharding_map.conf;

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    # This server is behind an ALB, which does not check the
    # certificate validity:
    # https://kevin.burke.dev/kevin/aws-alb-validation-tls-reply/
    #
    # Snakeoil verts are good for 10 years after initial creation, but
    # the ALBs don't even check expiration. ¯\_(ツ)_/¯
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;

    server_name zulipchat.com *.zulipchat.com;

    include /etc/nginx/zulip-include/app;
}
```

--------------------------------------------------------------------------------

---[FILE: zulip-staging]---
Location: zulip-main/puppet/kandra/files/nginx/sites-available/zulip-staging

```text
server {
    # If coming from localhost, we do allow access to internal
    # APIs over HTTP.
    listen 127.0.0.1:80;
    listen [::1]:80;

    location /api/internal/ {
        include /etc/nginx/zulip-include/api_headers;
        include uwsgi_params;
    }
}

include /etc/nginx/zulip-include/trusted-proto;
include /etc/nginx/zulip-include/s3-cache;
include /etc/nginx/zulip-include/upstreams;
include /etc/zulip/nginx_sharding_map.conf;

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    # This server is behind an ALB, which does not check the
    # certificate validity:
    # https://kevin.burke.dev/kevin/aws-alb-validation-tls-reply/
    #
    # Snakeoil verts are good for 10 years after initial creation, but
    # the ALBs don't even check expiration. ¯\_(ツ)_/¯
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;

    server_name zulipstaging.com;

    include /etc/nginx/zulip-include/app;
}
```

--------------------------------------------------------------------------------

---[FILE: navigation-tour-video.conf]---
Location: zulip-main/puppet/kandra/files/nginx/zulip-include-app.d/navigation-tour-video.conf

```text
location /static/navigation-tour-video/ {
    alias /home/zulip/prod-static/navigation-tour-video/;
    error_page 404 /django_static_404.html;
    include /etc/nginx/zulip-include/headers;
    add_header Access-Control-Allow-Origin *;
    add_header Timing-Allow-Origin *;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location = /static/navigation-tour-video/zulip-10.mp4 {
    return 302 fffe1bb0baefab1a448fd9082738eaf271feb7ec247901242cd7bccb2280914b.mp4;
}
```

--------------------------------------------------------------------------------

---[FILE: well-known.conf]---
Location: zulip-main/puppet/kandra/files/nginx/zulip-include-app.d/well-known.conf

```text
location /.well-known/ {
    alias /etc/zulip/well-known/;
}
```

--------------------------------------------------------------------------------

---[FILE: pg_hba.conf]---
Location: zulip-main/puppet/kandra/files/postgresql/pg_hba.conf

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
# METHOD can be "trust", "reject", "md5", "password", "gss", "sspi",
# "krb5", "ident", "peer", "pam", "ldap", "radius" or "cert".  Note that
# "password" sends passwords in clear text; "md5" is preferred since
# it sends encrypted passwords.
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
# This file is read on server startup and when the postmaster receives
# a SIGHUP signal.  If you edit the file on a running system, you have
# to SIGHUP the postmaster for the changes to take effect.  You can
# use "pg_ctl reload" to do that.

# Put your actual configuration here
# ----------------------------------
#
# If you want to allow non-local connections, you need to add more
# "host" records.  In that case you will also need to make PostgreSQL
# listen on a non-local interface via the listen_addresses
# configuration parameter, or via the -i or -h command line switches.




# DO NOT DISABLE!
# If you change this first entry you will need to make sure that the
# database superuser can access the database using some other method.
# Noninteractive access to all databases is required during automatic
# maintenance (custom daily cronjobs, replication, and similar tasks).
#
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
#host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
#host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
#local   replication     postgres                                peer
#host    replication     postgres        127.0.0.1/32            md5
#host    replication     postgres        ::1/128                 md5

# Local connections with certs from Teleport
hostssl zulip           zulip           127.0.0.1/32            cert
# Zulip app frontends access the zulip user
hostssl zulip           zulip           172.31.0.0/16           cert
# Zulip replication accesses the replicator user
hostssl replication     replicator      172.31.0.0/16           cert
```

--------------------------------------------------------------------------------

---[FILE: setup_data.sh]---
Location: zulip-main/puppet/kandra/files/postgresql/setup_data.sh

```bash
#!/usr/bin/env bash

set -eux

service postgresql stop

cert_file="$(crudini --get /etc/zulip/zulip.conf postgresql ssl_cert_file)"
if [ -z "$cert_file" ] || [ ! -f "$cert_file" ]; then
    echo "Certificate file is not set or does not exist!"
    exit 1
fi

key_file="$(crudini --get /etc/zulip/zulip.conf postgresql ssl_key_file)"
if [ -z "$key_file" ] || [ ! -f "$key_file" ]; then
    echo "Key file is not set or does not exist!"
    exit 1
fi

cert_cn="$(openssl x509 -noout -subject -in "$cert_file" | sed -n '/^subject/s/^.*CN\s*=\s*//p')"

if [ "$cert_cn" != "$(hostname)" ]; then
    echo "Configured certificate does not match host!"
    exit 1
fi

echo "Checking for S3 secrets..."
crudini --get /etc/zulip/zulip-secrets.conf secrets s3_region >/dev/null
crudini --get /etc/zulip/zulip-secrets.conf secrets s3_backups_bucket >/dev/null
crudini --get /etc/zulip/zulip-secrets.conf secrets s3_backups_key >/dev/null
crudini --get /etc/zulip/zulip-secrets.conf secrets s3_backups_secret_key >/dev/null

if [ ! -f "/var/lib/postgresql/.postgresql/postgresql.crt" ]; then
    echo "Replication certificate file is not set or does not exist!"
    exit 1
fi
if [ ! -f "/var/lib/postgresql/.postgresql/postgresql.key" ]; then
    echo "Replication key file is not set or does not exist!"
    exit 1
fi

version="$(crudini --get /etc/zulip/zulip.conf postgresql version)"
mkdir -p "/srv/data/postgresql/$version"
chown postgres.postgres "/srv/data/postgresql/$version"
chmod 700 "/srv/data/postgresql/$version"

/usr/local/bin/env-wal-g backup-fetch "/var/lib/postgresql/$version/main" LATEST
chown -R postgres.postgres "/var/lib/postgresql/$version/main"
```

--------------------------------------------------------------------------------

---[FILE: setup_disks.sh]---
Location: zulip-main/puppet/kandra/files/postgresql/setup_disks.sh

```bash
#!/bin/bash
set -x
set -e

set -o pipefail

LOCALDISK=$(
    nvme list -o json \
        | jq -r '.Devices[] | select(.ModelNumber | contains("Instance Storage")) | .DevicePath' \
        | head -n1
)

if [ -z "$LOCALDISK" ]; then
    echo "No instance storage found!"
    nvme list
    exit 1
fi

if ! grep -q "$LOCALDISK" /etc/fstab; then
    echo "$LOCALDISK   /srv/data  xfs    nofail,noatime 1 1" >>/etc/fstab
fi

if [ ! -d /srv/data ]; then
    mkdir /srv/data
fi

if ! mountpoint -q /srv/data; then
    mkfs.xfs "$LOCALDISK"
    mount /srv/data
fi

if [ ! -L /var/lib/postgresql ]; then
    service postgresql stop
    if [ -e /var/lib/postgresql ]; then
        mv /var/lib/postgresql "/root/postgresql-data-$(date +'%m-%d-%Y-%T')"
    fi
    ln -s /srv/data/postgresql/ /var/lib
fi

if [ ! -e "/srv/data/postgresql" ]; then
    service postgresql stop
    mkdir "/srv/data/postgresql"
    chown postgres:postgres /srv/data/postgresql
fi
```

--------------------------------------------------------------------------------

---[FILE: apache.pp]---
Location: zulip-main/puppet/kandra/manifests/apache.pp

```text
class kandra::apache {
  package { 'apache2':
    ensure => installed,
  }
  service { 'apache2':
    require => Package['apache2'],
  }

  apache2mod { [ 'headers', 'proxy', 'proxy_http', 'rewrite', 'auth_digest', 'ssl' ]:
    ensure  => present,
    require => Package['apache2'],
    notify  => Service['apache2'],
  }

  file { '/etc/apache2/certs/':
    ensure  => directory,
    require => Package['apache2'],
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
  }

  file { '/etc/apache2/ports.conf':
    ensure  => file,
    require => Package[apache2],
    owner   => 'root',
    group   => 'root',
    mode    => '0640',
    source  => 'puppet:///modules/kandra/apache/ports.conf',
    notify  => Service['apache2'],
  }

  file { '/etc/apache2/sites-available/':
    ensure  => directory,
    require => Package[apache2],
    owner   => 'root',
    group   => 'root',
    mode    => '0750',
  }
}
```

--------------------------------------------------------------------------------

````

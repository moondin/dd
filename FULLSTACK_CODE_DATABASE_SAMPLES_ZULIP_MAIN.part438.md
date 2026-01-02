---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 438
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 438 of 1290)

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

---[FILE: vector_akamai.toml.template.erb]---
Location: zulip-main/puppet/kandra/templates/vector_akamai.toml.template.erb

```text
# Akamai Datastream2 logs all accesses into AWS S3:
# https://techdocs.akamai.com/datastream2/docs/stream-amazon-s3
#
# The S3 bucket is configured to send event notifications to the SQS
# queue, which this host is allowed to read from.  This consumer
# deletes the messages from the queue, and the S3 bucket is
# configured to purge old logs.
# https://vector.dev/docs/reference/configuration/sources/aws_s3/

<% @pipelines.each do |key,sqs_url| %>
[sources.s3_akamai_<%= key %>]
  type = "aws_s3"
  region = "us-east-1"
  compression = "gzip"
  sqs.delete_message = true
  sqs.poll_secs = 15
  sqs.queue_url = "<%= sqs_url %>"

[transforms.akamai_parse_<%= key %>]
  type = "remap"
  inputs = ["s3_akamai_<%= key %>"]
  source = '''
  . = parse_json!(string!(.message))
  .turnAroundTimeSec = to_int!(.turnAroundTimeMSec) / 1000.0
  '''

[transforms.akamai_logs2metrics_<%= key %>]
  type = "log_to_metric"
  inputs = ["akamai_parse_<%= key %>"]

  [[transforms.akamai_logs2metrics_<%= key %>.metrics]]
    field = "cacheStatus"
    name = "requests_cache_count"
    namespace = "akamai_<%= key %>"
    type = "counter"
      [transforms.akamai_logs2metrics_<%= key %>.metrics.tags]
      status_code = "{{statusCode}}"
      cached = "{{cacheStatus}}"
      host = "{{reqHost}}"

  [[transforms.akamai_logs2metrics_<%= key %>.metrics]]
    field = "bytes"
    name = "requests_bytes"
    namespace = "akamai_<%= key %>"
    type = "counter"
    increment_by_value = true
      [transforms.akamai_logs2metrics_<%= key %>.metrics.tags]
      status_code = "{{statusCode}}"
      cached = "{{cacheStatus}}"
      host = "{{reqHost}}"

  [[transforms.akamai_logs2metrics_<%= key %>.metrics]]
    field = "turnAroundTimeSec"
    name = "turnaround_time_sec"
    namespace = "akamai_<%= key %>"
    type = "histogram"
      [transforms.akamai_logs2metrics_<%= key %>.metrics.tags]
      status_code = "{{statusCode}}"
      cached = "{{cacheStatus}}"
      host = "{{reqHost}}"

<% end %>
```

--------------------------------------------------------------------------------

---[FILE: vector_ses.toml.template.erb]---
Location: zulip-main/puppet/kandra/templates/vector_ses.toml.template.erb

```text
# SES writes all of its logs to a single SQS queue; we consume them,
# batch them, and write them to files in S3 for later analysis.
[sources.ses_logs_sqs]
  type = "aws_sqs"
  queue_url = "<%= @ses_logs_sqs_url %>"

[transforms.extract_ses_message]
  type = "remap"
  inputs = ["ses_logs_sqs"]
  # SES puts its JSON into the text .Message field of the SQS JSON
  # event, which itself is serialized before we get it
  source = '''
  . = parse_json!(string!(.message)).Message
  '''

[sinks.ses_logs_s3]
  type = "aws_s3"
  inputs = ["extract_ses_message"]
  bucket = "<%= @ses_logs_s3_bucket %>"
  compression = "gzip"
  batch.max_bytes = 10000000  # 100k, before compression
  batch.timeout_secs = 300    # ..or 5min, whichever is first
  encoding.codec = "text"
  key_prefix = "%F/"
  storage_class = "STANDARD_IA"
```

--------------------------------------------------------------------------------

---[FILE: aws_config.erb]---
Location: zulip-main/puppet/kandra/templates/dotfiles/aws_config.erb

```text
[default]
region = us-east-1
output = text
<% if @is_ec2 -%>
# Credentials are from the IAM role attached to the EC2 instance
<% else -%>
# We pull the Teleport host certificate and use that to auth to AWS
# using IAM Roles Anywhere
credential_process = /usr/local/bin/teleport-aws-credentials --trust-anchor-arn <%= @aws_trust_arn %> --profile-arn <%= @aws_profile_arn %> --role-arn <%= @aws_role_arn %>
<% end %>
```

--------------------------------------------------------------------------------

---[FILE: cgi.cfg.template.erb]---
Location: zulip-main/puppet/kandra/templates/nagios4/cgi.cfg.template.erb

```text
#################################################################
#
# CGI.CFG - Sample CGI Configuration File for Nagios
#
#################################################################


# MAIN CONFIGURATION FILE
# This tells the CGIs where to find your main configuration file.
# The CGIs will read the main and host config files for any other
# data they might need.

main_config_file=/etc/nagios4/nagios.cfg



# PHYSICAL HTML PATH
# This is the path where the HTML files for Nagios reside.  This
# value is used to locate the logo images needed by the statusmap
# and statuswrl CGIs.

physical_html_path=/usr/share/nagios4/htdocs



# URL HTML PATH
# This is the path portion of the URL that corresponds to the
# physical location of the Nagios HTML files (as defined above).
# This value is used by the CGIs to locate the online documentation
# and graphics.  If you access the Nagios pages with an URL like
# http://www.myhost.com/nagios, this value should be '/nagios'
# (without the quotes).

url_html_path=/nagios4



# CONTEXT-SENSITIVE HELP
# This option determines whether or not a context-sensitive
# help icon will be displayed for most of the CGIs.
# Values: 0 = disables context-sensitive help
#         1 = enables context-sensitive help

show_context_help=1



# PENDING STATES OPTION
# This option determines what states should be displayed in the web
# interface for hosts/services that have not yet been checked.
# Values: 0 = leave hosts/services that have not been check yet in their original state
#         1 = mark hosts/services that have not been checked yet as PENDING

use_pending_states=1

# NAGIOS PROCESS CHECK COMMAND
# This is the full path and filename of the program used to check
# the status of the Nagios process.  It is used only by the CGIs
# and is completely optional.  However, if you don't use it, you'll
# see warning messages in the CGIs about the Nagios process
# not running and you won't be able to execute any commands from
# the web interface.  The program should follow the same rules
# as plugins; the return codes are the same as for the plugins,
# it should have timeout protection, it should output something
# to STDIO, etc.
#
# Note: The command line for the check_nagios plugin below may
# have to be tweaked a bit, as different versions of the plugin
# use different command line arguments/syntaxes.

nagios_check_command=/usr/lib/nagios/plugins/check_nagios /var/cache/nagios4/status.dat 5 '/usr/sbin/nagios4'


# AUTHENTICATION USAGE
# This option controls whether or not the CGIs will use any
# authentication when displaying host and service information, as
# well as committing commands to Nagios for processing.
#
# Read the HTML documentation to learn how the authorization works!
#
# NOTE: It is a really *bad* idea to disable authorization, unless
# you plan on removing the command CGI (cmd.cgi)!  Failure to do
# so will leave you wide open to kiddies messing with Nagios and
# possibly hitting you with a denial of service attack by filling up
# your drive by continuously writing to your command file!
#
# Setting this value to 0 will cause the CGIs to *not* use
# authentication (bad idea), while any other value will make them
# use the authentication functions (the default).

use_authentication=1




# x509 CERT AUTHENTICATION
# When enabled, this option allows you to use x509 cert (SSL)
# authentication in the CGIs.  This is an advanced option and should
# not be enabled unless you know what you're doing.

use_ssl_authentication=0




# DEFAULT USER
# Setting this variable will define a default user name that can
# access pages without authentication.  This allows people within a
# secure domain (i.e., behind a firewall) to see the current status
# without authenticating.  You may want to use this to avoid basic
# authentication if you are not using a secure server since basic
# authentication transmits passwords in the clear.
#
# Important:  Do not define a default username unless you are
# running a secure web server and are sure that everyone who has
# access to the CGIs has been authenticated in some manner!  If you
# define this variable, anyone who has not authenticated to the web
# server will inherit all rights you assign to this user!

default_user_name=nagiosadmin



# SYSTEM/PROCESS INFORMATION ACCESS
# This option is a comma-delimited list of all usernames that
# have access to viewing the Nagios process information as
# provided by the Extended Information CGI (extinfo.cgi).  By
# default, *no one* has access to this unless you choose to
# not use authorization.  You may use an asterisk (*) to
# authorize any user who has authenticated to the web server.

authorized_for_system_information=*



# CONFIGURATION INFORMATION ACCESS
# This option is a comma-delimited list of all usernames that
# can view ALL configuration information (hosts, commands, etc).
# By default, users can only view configuration information
# for the hosts and services they are contacts for. You may use
# an asterisk (*) to authorize any user who has authenticated
# to the web server.

authorized_for_configuration_information=*



# SYSTEM/PROCESS COMMAND ACCESS
# This option is a comma-delimited list of all usernames that
# can issue shutdown and restart commands to Nagios via the
# command CGI (cmd.cgi).  Users in this list can also change
# the program mode to active or standby. By default, *no one*
# has access to this unless you choose to not use authorization.
# You may use an asterisk (*) to authorize any user who has
# authenticated to the web server.

authorized_for_system_commands=*



# GLOBAL HOST/SERVICE VIEW ACCESS
# These two options are comma-delimited lists of all usernames that
# can view information for all hosts and services that are being
# monitored.  By default, users can only view information
# for hosts or services that they are contacts for (unless you
# you choose to not use authorization). You may use an asterisk (*)
# to authorize any user who has authenticated to the web server.


authorized_for_all_services=*
authorized_for_all_hosts=*



# GLOBAL HOST/SERVICE COMMAND ACCESS
# These two options are comma-delimited lists of all usernames that
# can issue host or service related commands via the command
# CGI (cmd.cgi) for all hosts and services that are being monitored.
# By default, users can only issue commands for hosts or services
# that they are contacts for (unless you choose to not use
# authorization).  You may use an asterisk (*) to authorize any
# user who has authenticated to the web server.

authorized_for_all_service_commands=*
authorized_for_all_host_commands=*



# READ-ONLY USERS
# A comma-delimited list of usernames that have read-only rights in
# the CGIs.  This will block any service or host commands normally shown
# on the extinfo CGI pages.  It will also block comments from being shown
# to read-only users.

#authorized_for_read_only=user1,user2




# STATUSMAP BACKGROUND IMAGE
# This option allows you to specify an image to be used as a
# background in the statusmap CGI.  It is assumed that the image
# resides in the HTML images path (i.e. /usr/local/nagios/share/images).
# This path is automatically determined by appending "/images"
# to the path specified by the 'physical_html_path' directive.
# Note:  The image file may be in GIF, PNG, JPEG, or GD2 format.
# However, I recommend that you convert your image to GD2 format
# (uncompressed), as this will cause less CPU load when the CGI
# generates the image.

#statusmap_background_image=smbackground.gd2




# STATUSMAP TRANSPARENCY INDEX COLOR
# These options set the r,g,b values of the background color used the statusmap CGI,
# so normal browsers that can't show real png transparency set the desired color as
# a background color instead (to make it look pretty).
# Defaults to white: (R,G,B) = (255,255,255).

#color_transparency_index_r=255
#color_transparency_index_g=255
#color_transparency_index_b=255




# DEFAULT STATUSMAP LAYOUT METHOD
# This option allows you to specify the default layout method
# the statusmap CGI should use for drawing hosts.  If you do
# not use this option, the default is to use user-defined
# coordinates.  Valid options are as follows:
#       0 = User-defined coordinates
#       1 = Depth layers
#       2 = Collapsed tree
#       3 = Balanced tree
#       4 = Circular
#       5 = Circular (Marked Up)

default_statusmap_layout=5



# DEFAULT STATUSWRL LAYOUT METHOD
# This option allows you to specify the default layout method
# the statuswrl (VRML) CGI should use for drawing hosts.  If you
# do not use this option, the default is to use user-defined
# coordinates.  Valid options are as follows:
#       0 = User-defined coordinates
#       2 = Collapsed tree
#       3 = Balanced tree
#       4 = Circular

default_statuswrl_layout=4



# STATUSWRL INCLUDE
# This option allows you to include your own objects in the
# generated VRML world.  It is assumed that the file
# resides in the HTML path (i.e. /usr/local/nagios/share).

#statuswrl_include=myworld.wrl



# PING SYNTAX
# This option determines what syntax should be used when
# attempting to ping a host from the WAP interface (using
# the statuswml CGI.  You must include the full path to
# the ping binary, along with all required options.  The
# $HOSTADDRESS$ macro is substituted with the address of
# the host before the command is executed.
# Please note that the syntax for the ping binary is
# notorious for being different on virtually ever *NIX
# OS and distribution, so you may have to tweak this to
# work on your system.

ping_syntax=/bin/ping -n -U -c 5 $HOSTADDRESS$



# REFRESH RATE
# This option allows you to specify the refresh rate in seconds
# of various CGIs (status, statusmap, extinfo, and outages).

refresh_rate=90

# DEFAULT PAGE LIMIT
# This option allows you to specify the default number of results
# displayed on the status.cgi.  This number can be adjusted from
# within the UI after the initial page load. Setting this to 0
# will show all results.

# Zulip config: Show all results on the same page
result_limit=0


# ESCAPE HTML TAGS
# This option determines whether HTML tags in host and service
# status output is escaped in the web interface.  If enabled,
# your plugin output will not be able to contain clickable links.

escape_html_tags=1




# SOUND OPTIONS
# These options allow you to specify an optional audio file
# that should be played in your browser window when there are
# problems on the network.  The audio files are used only in
# the status CGI.  Only the sound for the most critical problem
# will be played.  Order of importance (higher to lower) is as
# follows: unreachable hosts, down hosts, critical services,
# warning services, and unknown services. If there are no
# visible problems, the sound file optionally specified by
# 'normal_sound' variable will be played.
#
#
# <varname>=<sound_file>
#
# Note: All audio files must be placed in the /media subdirectory
# under the HTML path (i.e. /usr/local/nagios/share/media/).

#host_unreachable_sound=hostdown.wav
#host_down_sound=hostdown.wav
#service_critical_sound=critical.wav
#service_warning_sound=warning.wav
#service_unknown_sound=warning.wav
#normal_sound=noproblem.wav



# URL TARGET FRAMES
# These options determine the target frames in which notes and
# action URLs will open.

action_url_target=_blank
notes_url_target=_blank




# LOCK AUTHOR NAMES OPTION
# This option determines whether users can change the author name
# when submitting comments, scheduling downtime.  If disabled, the
# author names will be locked into their contact name, as defined in Nagios.
# Values: 0 = allow editing author names
#         1 = lock author names (disallow editing)

lock_author_names=1




# SPLUNK INTEGRATION OPTIONS
# These options allow you to enable integration with Splunk
# in the web interface.  If enabled, you'll be presented with
# "Splunk It" links in various places in the CGIs (log file,
# alert history, host/service detail, etc).  Useful if you're
# trying to research why a particular problem occurred.
# For more information on Splunk, visit http://www.splunk.com/

# This option determines whether the Splunk integration is enabled
# Values: 0 = disable Splunk integration
#         1 = enable Splunk integration

#enable_splunk_integration=1


# This option should be the URL used to access your instance of Splunk

#splunk_url=http://127.0.0.1:8000/
```

--------------------------------------------------------------------------------

---[FILE: contacts.cfg.template.erb]---
Location: zulip-main/puppet/kandra/templates/nagios4/contacts.cfg.template.erb

```text
###############################################################################
# contacts.cfg
###############################################################################



###############################################################################
###############################################################################
#
# CONTACTS
#
###############################################################################
###############################################################################

define contact{
        contact_name                    monitoring
        alias                           Monitoring
        service_notification_period     24x7
        host_notification_period        24x7
        service_notification_options    w,u,c,r
        host_notification_options       d,r
        service_notification_commands   notify-service-by-email
        host_notification_commands      notify-host-by-email
        email                           <%= @nagios_alert_email %>
        }

define contact{
        contact_name                    test
        alias                           Test Monitoring
        service_notification_period     24x7
        host_notification_period        24x7
        service_notification_options    w,u,c,r
        host_notification_options       d,r
        service_notification_commands   notify-service-by-email
        host_notification_commands      notify-host-by-email
        email                           <%= @nagios_test_email %>
        }

define contact {
       contact_name                             pager
       alias                                    Pseudo-contact to an email that pages
       service_notification_period              24x7
       host_notification_period                 24x7
       service_notification_options             w,u,c,r
       host_notification_options                d,r
       email                                    <%= @nagios_pager_email %>
       service_notification_commands            notify-service-by-email
       host_notification_commands               notify-host-by-email
}

define contact {
       contact_name                    kandra-ops-in-czo
       alias                           Notify kandra-ops on chat.zulip.org
       service_notification_period     24x7
       host_notification_period        24x7
       service_notification_options    w,u,c,r
       host_notification_options       d,r
       service_notification_commands   notify-service-by-zulip
       host_notification_commands      notify-host-by-zulip
}

define contact {
       contact_name                    kandra-ops-in-czo-warnings
       alias                           Notify kandra-ops on chat.zulip.org on warnings
       service_notifications_enabled   1
       host_notifications_enabled      0
       service_notification_period     24x7
       host_notification_period        24x7
       service_notification_options    w,r
       host_notification_options       n
       service_notification_commands   notify-service-by-zulip
       host_notification_commands      notify-host-by-zulip
}

###############################################################################
###############################################################################
#
# CONTACT GROUPS
#
###############################################################################
###############################################################################

define contactgroup{
        contactgroup_name       admins
        alias                   Nagios Administrators
        members                 monitoring
        }

define contactgroup{
        contactgroup_name       page_admins
        alias                   Nagios Administrators
        members                 monitoring,pager
        }

define contactgroup{
        contactgroup_name       page_admins_and_warn_czo
        alias                   Nagios Administrators
        members                 monitoring,pager,kandra-ops-in-czo-warnings
        }

define contactgroup{
        contactgroup_name       ops_message
        alias                   Message admins on CZO
        members                 monitoring,kandra-ops-in-czo
}

define contactgroup{
        contactgroup_name       test
        alias                   Nagios Test Administrators
        members                 test
        }
```

--------------------------------------------------------------------------------

---[FILE: hosts.cfg.template.erb]---
Location: zulip-main/puppet/kandra/templates/nagios4/hosts.cfg.template.erb

```text
<% @hosts_fullstack.each do |host| -%>
define host{
       use              generic-host
       host_name        <%= host %>
       alias            <%= host %>
       address          <%= host %><% unless host.include?(".") %>.<%= @default_host_domain %><% end %>
       hostgroups       all,fullstack,non_aws_host,frontends,not_pageable_servers,postgresql
       }
<% end -%>

<% @hosts_app_prod.each do |host| -%>
define host{
       use              generic-host
       host_name        <%= host %>
       alias            <%= host %>
       address          <%= host %><% unless host.include?(".") %>.<%= @default_host_domain %><% end %>
       hostgroups       all,aws_host,prod_frontends,pageable_servers
       }
<% end -%>

<% @hosts_app_staging.each do |host| -%>
define host{
       use              generic-host
       host_name        <%= host %>
       alias            <%= host %>
       address          <%= host %><% unless host.include?(".") %>.<%= @default_host_domain %><% end %>
       hostgroups       all,aws_host,staging_frontends,not_pageable_servers
       }
<% end -%>

<% @hosts_postgresql_primary.each do |host| -%>
define host{
       use              generic-host
       host_name        <%= host %>
       alias            <%= host %>
       address          <%= host %><% unless host.include?(".") %>.<%= @default_host_domain %><% end %>
       hostgroups       all,aws_host,postgresql_primary,pageable_servers
       }
<% end -%>

<% @hosts_postgresql_replica.each do |host| -%>
define host{
       use              generic-host
       host_name        <%= host %>
       alias            <%= host %>
       address          <%= host %><% unless host.include?(".") %>.<%= @default_host_domain %><% end %>
       hostgroups       all,aws_host,postgresql_replica,pageable_servers
       }
<% end -%>

<% @hosts_redis.each do |host| -%>
define host{
       use              generic-host
       host_name        <%= host %>
       alias            <%= host %>
       address          <%= host %><% unless host.include?(".") %>.<%= @default_host_domain %><% end %>
       hostgroups       all,aws_host,not_pageable_servers, redis
       }
<% end -%>

<% @hosts_smokescreen.each do |host| -%>
define host{
       use              generic-host
       host_name        <%= host %>
       alias            <%= host %>
       address          <%= host %><% unless host.include?(".") %>.<%= @default_host_domain %><% end %>
       hostgroups       all,aws_host,pageable_servers,smokescreen
       }
<% end -%>

<% @hosts_other.each do |host| -%>
define host{
       use              generic-host
       host_name        <%= host %>
       alias            <%= host %>
       address          <%= host %><% unless host.include?(".") %>.<%= @default_host_domain %><% end %>
       hostgroups       all,<% if host.include?(".") %>non_<% end %>aws_host,not_pageable_servers,other
       }
<% end -%>
```

--------------------------------------------------------------------------------

---[FILE: localhost.cfg.template.erb]---
Location: zulip-main/puppet/kandra/templates/nagios4/localhost.cfg.template.erb

```text
define host{
        use                     generic-host
        host_name               nagios
        alias                   nagios
        address                 127.0.0.1
        hostgroups              all
}

define service{
        use                             generic-service
        host_name                       nagios
        service_description             Current Users
        check_command                   check_users!20!50
}

define service{
        use                             generic-service
        host_name                       nagios
        service_description             Total Processes
        check_command                   check_procs_nokthreads!500!650
}

define service{
        use                             generic-service
        host_name                       nagios
        service_description             Disk Space
        check_command                   check_local_disk!20%!10%
}

define service{
        use                             generic-service
        host_name                       nagios
        service_description             Current Load
        check_command                   check_load!7.0!6.0!5.0!10.0!8.0!6.0
}



### External resources, only run on localhost

define service{
        use                             generic-service
        host_name                       nagios
        service_description             Check Camo is operational
        check_command                   check_camo!<%= @nagios_camo_check_host %>!<%= @nagios_camo_check_path %>!6!12
}

define service {
        use                             generic-service
        service_description             Check desktop APT repository
        host_name                       nagios
        check_command                   check_apt_repo_status!download.zulip.com!/desktop/apt
        contact_groups                  admins
}

define service {
        use                             generic-service
        service_description             Check chat.fhir.org cert
        host_name                       nagios
        check_command                   check_ssl_certificate!chat.fhir.org
        contact_groups                  admins
}
```

--------------------------------------------------------------------------------

---[FILE: grok_exporter.yaml.template.erb]---
Location: zulip-main/puppet/kandra/templates/prometheus/grok_exporter.yaml.template.erb

```text
global:
  config_version: 3
input:
  type: file
  path: /var/log/nginx/access.log
  fail_on_missing_logfile: false
  readall: false
imports:
- type: grok_patterns
  dir: <%= @include_dir %>
grok_patterns:
  - 'NONQUERY [^? ]+'
  - 'OPTIONALQUERY (?:\?%{NOTSPACE})?'
  - 'APIPATH /+(api/v1|json)(?<apipath>/(events|users/me/presence|messages(/flags)?|remotes/push/(register|unregister|notify)|remotes/server/(register|analytics|analytics/status)|typing|register|server_settings|tus/))'
  - 'EXTERNALPATH /+(?<external>api/v1/external/)[a-zA-Z0-9_-]+'
  - 'ROOTPATH (?<rootpath>/+)'
  - 'TOPPATH /+(?<toppath>(api/internal/(email_mirror_message|tusd)|compatibility|error_tracing))'
  - 'PREFIXPATH /+(?<prefixpath>(static|user_uploads|avatar|api/v1/tus)/)\S+'
  - 'ANYPATH (%{APIPATH}|%{EXTERNALPATH}|%{TOPPATH}|%{PREFIXPATH}|%{ROOTPATH}|%{NONQUERY:otherpath})%{OPTIONALQUERY}'
  - 'OURHOSTNAME (?<hostname>((?<realm><%= @realm_names_regex %>)|%{NOTSPACE}))'
  - 'OURLOG %{IPORHOST:clientip} - \S+ \[%{HTTPDATE:timestamp}\] "%{WORD:verb} %{ANYPATH} HTTP/%{NUMBER:httpversion}" %{NUMBER:response} (?:%{NUMBER:bytes}|-) %{QS:referrer} %{QS:agent} %{OURHOSTNAME} %{NUMBER:response_time}'
metrics:
- type: counter
  name: nginx_http_response_codes_total
  help: Total number of requests, by response code, normalized path, and HTTP method
  match: '%{OURLOG}'
  labels:
    code: '{{.response}}'
    method: '{{.verb}}'
    path: '{{if .apipath}}/api/v1{{.apipath}}{{else if .external}}/api/v1/external/...{{else if .rootpath}}{{if .realm}}/{{else}}(other){{end}}{{else if .toppath}}/{{.toppath}}{{else if .prefixpath}}/{{.prefixpath}}...{{else}}(other){{end}}'
- type: counter
  name: nginx_http_response_bytes
  help: Total number of bytes, by normalized path
  match: '%{OURLOG}'
  value: '{{.bytes}}'
  labels:
    path: '{{if .apipath}}/api/v1{{.apipath}}{{else if .external}}/api/v1/external/...{{else if .rootpath}}{{if .realm}}/{{else}}(other){{end}}{{else if .toppath}}/{{.toppath}}{{else if .prefixpath}}/{{.prefixpath}}...{{else}}(other){{end}}'
- type: histogram
  name: nginx_http_response_time_seconds
  help: Response time in seconds, from first request byte to last response byte
  match: '%{OURLOG}'
  value: '{{.response_time}}'
  buckets:
    - 0.001
    - 0.002
    - 0.005
    - 0.010
    - 0.025
    - 0.050
    - 0.100
    - 0.200
    - 0.500
    - 1.000
    - 2.000
    - 5.000
    - 10.00
    - 20.00
    - 50.00
    - 60.00
    - 120.0
  labels:
    code: '{{.response}}'
    method: '{{.verb}}'
    path: '{{if .apipath}}/api/v1{{.apipath}}{{else if .external}}/api/v1/external/...{{else if .rootpath}}{{if .realm}}/{{else}}(other){{end}}{{else if .toppath}}/{{.toppath}}{{else if .prefixpath}}/{{.prefixpath}}...{{else}}(other){{end}}'

server:
  protocol: http
  port: 9144
```

--------------------------------------------------------------------------------

---[FILE: prometheus.yaml.template.erb]---
Location: zulip-main/puppet/kandra/templates/prometheus/prometheus.yaml.template.erb

```text
global:
  # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  scrape_interval: 15s
  # Evaluate rules every 15 seconds. The default is every 1 minute.
  evaluation_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "grafana"
    static_configs:
      - targets: ["localhost:3000"]

  - job_name: "pushgateway"
    scrape_interval: 2m
    honor_labels: true
    static_configs:
      - targets: ["localhost:9091"]

  - job_name: "node"
    ec2_sd_configs:
      - region: us-east-1
        port: 9100
        refresh_interval: 1m
        filters:
          - name: instance-state-name
            values: ["running"]
    static_configs:
      - targets: ["<%= @czo %>:9100"]
        labels:
          role: prod
          instance: <%= @czo %>
<% if @other_hosts -%>
      - targets:
<%   @other_hosts.each do |host| -%>
        - <%= host %>:9100
<%   end -%>
<% end -%>
    relabel_configs:
      - source_labels: ["__address__"]
        regex: "([^.]+).*"
        target_label: "instance"
      - source_labels: ["__address__"]
        regex: "([^.-]+).*"
        target_label: "role"

      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"
      - source_labels: ["__meta_ec2_tag_role"]
        regex: "(.+)"
        target_label: "role"

  - job_name: "camo"
    ec2_sd_configs:
      - region: us-east-1
        port: 9292
        filters:
          - name: "tag:role"
            values: ["smokescreen"]
          - name: instance-state-name
            values: ["running"]
    static_configs:
      - targets: ["<%= @czo %>:9292"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    relabel_configs:
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"

  - job_name: "smokescreen"
    ec2_sd_configs:
      - region: us-east-1
        port: 4760
        filters:
          - name: "tag:role"
            values: ["smokescreen"]
          - name: instance-state-name
            values: ["running"]
    static_configs:
      - targets: ["<%= @czo %>:4760"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    relabel_configs:
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"

  - job_name: "access_logs"
    ec2_sd_configs:
      - region: us-east-1
        port: 9144
        filters:
          - name: "tag:role"
            values: ["prod_app_frontend", "staging_app_frontend"]
          - name: instance-state-name
            values: ["running"]
    static_configs:
      - targets: ["<%= @czo %>:9144"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    relabel_configs:
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"
      - source_labels: ["__meta_ec2_tag_role"]
        regex: "(prod|staging)_app_frontend"
        replacement: "${1}"
        target_label: "deploy"

  - job_name: "uwsgi"
    ec2_sd_configs:
      - region: us-east-1
        port: 9238
        filters:
          - name: "tag:role"
            values: ["prod_app_frontend", "staging_app_frontend"]
          - name: instance-state-name
            values: ["running"]
    static_configs:
      - targets: ["<%= @czo %>:9238"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    relabel_configs:
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"
      - source_labels: ["__meta_ec2_tag_role"]
        regex: "(prod|staging)_app_frontend"
        replacement: "${1}"
        target_label: "deploy"

  - job_name: "rabbitmq"
    ec2_sd_configs:
      - region: us-east-1
        port: 15692
        filters:
          - name: "tag:role"
            values: ["prod_app_frontend", "staging_app_frontend"]
          - name: instance-state-name
            values: ["running"]
    static_configs:
      - targets: ["<%= @czo %>:15692"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    relabel_configs:
      - target_label: __metrics_path__
        replacement: "/metrics/per-object"
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"
      - source_labels: ["__meta_ec2_tag_role"]
        regex: "(prod|staging)_app_frontend"
        replacement: "${1}"
        target_label: "deploy"

  - job_name: "tornado"
    ec2_sd_configs:
      - region: us-east-1
        port: 9256
        filters:
          - name: "tag:role"
            values: ["prod_app_frontend", "staging_app_frontend"]
          - name: instance-state-name
            values: ["running"]
    static_configs:
      - targets: ["<%= @czo %>:9256"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    relabel_configs:
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"
      - source_labels: ["__meta_ec2_tag_role"]
        regex: "(prod|staging)_app_frontend"
        replacement: "${1}"
        target_label: "deploy"

  - job_name: "redis"
    ec2_sd_configs:
      - region: us-east-1
        port: 9121
        filters:
          - name: "tag:role"
            values: ["redis"]
          - name: instance-state-name
            values: ["running"]
    static_configs:
      - targets: ["<%= @czo %>:9121"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    relabel_configs:
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"

  - job_name: "postgres"
    ec2_sd_configs:
      - region: us-east-1
        port: 9187
        filters:
          - name: "tag:role"
            values: ["postgresql"]
          - name: instance-state-name
            values: ["running"]
    static_configs:
      - targets: ["<%= @czo %>:9187"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    relabel_configs:
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"

  - job_name: "memcached"
    static_configs:
      - targets: ["<%= @czo %>:11212"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    ec2_sd_configs:
      - region: us-east-1
        port: 11212
        filters:
          - name: "tag:role"
            values: ["prod_app_frontend", "staging_app_frontend"]
          - name: instance-state-name
            values: ["running"]
    relabel_configs:
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"
      - source_labels: ["__meta_ec2_tag_role"]
        regex: "(prod|staging)_app_frontend"
        replacement: "${1}"
        target_label: "deploy"

  - job_name: "tusd"
    static_configs:
      - targets: ["<%= @czo %>:9900"]
        labels:
          deploy: prod
          instance: <%= @czo %>
    ec2_sd_configs:
      - region: us-east-1
        port: 9900
        filters:
          - name: "tag:role"
            values: ["prod_app_frontend", "staging_app_frontend"]
          - name: instance-state-name
            values: ["running"]
    relabel_configs:
      - source_labels: ["__meta_ec2_tag_Name"]
        regex: "(.+)"
        target_label: "instance"
      - source_labels: ["__meta_ec2_tag_role"]
        regex: "(prod|staging)_app_frontend"
        replacement: "${1}"
        target_label: "deploy"

  - job_name: "wal-g"
    scrape_interval: 5m
    scrape_timeout: 20s
    static_configs:
      - targets:
<% @backup_buckets.each do |bucket| -%>
        - <%= bucket %>
<% end -%>
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_bucket
      - source_labels: [__param_bucket]
        target_label: bucket
      - target_label: __address__
        replacement: localhost:9188

  - job_name: "vector"
    scrape_interval: 30s
    scrape_timeout: 3s
    static_configs:
      - targets: ["localhost:9081"]
```

--------------------------------------------------------------------------------

---[FILE: autossh_tunnels.conf.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/autossh_tunnels.conf.erb

```text
; This file was auto-generated by Puppet.  Do not edit by hand.

<%
i = 0
@hosts.each do |host|
-%>
[program:autossh-tunnel-<%= host %>]
environment=AUTOSSH_DEBUG=1
command=bash -c 'exec autossh -N -M <%= 20000 + 2 * i %> -o ControlMaster=yes nagios@<%= host %><% unless host.include?(".") %>.<%= @default_host_domain %><% end %> 2>&1 | ts "%%b %%d %%H:%%M:%%.S"'
priority=200                   ; the relative start priority (default 999)
autostart=true                 ; start at supervisord start (default: true)
autorestart=true               ; whether/when to restart (default: unexpected)
stopsignal=TERM                 ; signal used to kill process (default TERM)
stopwaitsecs=30                ; max num secs to wait b4 SIGKILL (default 10)
stopasgroup=true
user=nagios                    ; setuid to this UNIX account to run the program
redirect_stderr=true           ; redirect proc stderr to stdout (default false)
stdout_logfile=/var/log/zulip/autossh.<%= host %>.log         ; stdout log path, NONE for none; default AUTO

<%
i += 1
end
-%>
```

--------------------------------------------------------------------------------

---[FILE: grafana.conf.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/grafana.conf.erb

```text
[program:grafana]
command=<%= @bin %> -config /etc/grafana/grafana.ini
directory=<%= @dir %>
priority=15
autostart=true
autorestart=true
user=grafana
```

--------------------------------------------------------------------------------

---[FILE: memcached_exporter.conf.template.erb]---
Location: zulip-main/puppet/kandra/templates/supervisor/conf.d/memcached_exporter.conf.template.erb

```text
[program:memcached_exporter]
# We record the hash of the script so that we can update this file
# with it, which will make `supervisorctl reread && supervisorctl
# update` restart this job.
command=<%= @bin %>
process_name=memcached_exporter_<%= @exporter_hash %>
priority=10
autostart=true
autorestart=true
user=zulip
redirect_stderr=true
stdout_logfile=/var/log/zulip/memcached_exporter.log
```

--------------------------------------------------------------------------------

````

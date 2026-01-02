---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 446
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 446 of 1290)

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

---[FILE: zulip.conf.template.erb]---
Location: zulip-main/puppet/zulip/templates/supervisor/zulip.conf.template.erb

```text
; Supervisor config file.
; on Debian squeeze, place me in /etc/supervisor/conf.d/zulip.conf
;
; For more information on the config file, please see:
; http://supervisord.org/configuration.html
;
; Note: shell expansion ("~" or "$HOME") is not supported.  Environment
; variables can be expanded using this syntax: "%(ENV_HOME)s".

[program:zulip-django]
command=nice -n5 uv run --no-sync uwsgi --ini /etc/zulip/uwsgi.ini
environment=HTTP_proxy="<%= @proxy %>",HTTPS_proxy="<%= @proxy %>"
priority=100                   ; the relative start priority (default 999)
autostart=true                 ; start at supervisord start (default: true)
autorestart=true               ; whether/when to restart (default: unexpected)
stopsignal=INT                 ; signal used to kill process (default TERM)
stopwaitsecs=30                ; max num secs to wait b4 SIGKILL (default 10)
user=zulip                    ; setuid to this UNIX account to run the program
redirect_stderr=true           ; redirect proc stderr to stdout (default false)
stdout_logfile=/var/log/zulip/django.log        ; stdout log path, NONE for none; default AUTO
stdout_logfile_maxbytes=100MB   ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=10     ; # of stdout logfile backups (default 10)
stopasgroup=true              ; Without this, we leak processes every restart
killasgroup=true              ; Without this, we leak processes every restart
directory=/home/zulip/deployments/current/

[program:zulip-tus]
command=nice -n5 /home/zulip/deployments/current/manage.py runtusd <%= @tusd_server_listen %>:9900
environment=HTTP_proxy="<%= @proxy %>",HTTPS_proxy="<%= @proxy %>"
priority=100                   ; the relative start priority (default 999)
autostart=true                 ; start at supervisord start (default: true)
autorestart=true               ; whether/when to restart (default: unexpected)
stopsignal=INT                 ; signal used to kill process (default TERM)
stopwaitsecs=30                ; max num secs to wait b4 SIGKILL (default 10)
user=zulip                    ; setuid to this UNIX account to run the program
redirect_stderr=true           ; redirect proc stderr to stdout (default false)
stdout_logfile=/var/log/zulip/tusd.log        ; stdout log path, NONE for none; default AUTO
stdout_logfile_maxbytes=0     ; Rotated by logrotate
stdout_logfile_backups=0
stopasgroup=true              ; Without this, we leak processes every restart
killasgroup=true              ; Without this, we leak processes every restart
directory=/home/zulip/deployments/current/

<% if @tornado_ports.length > 1 -%>
[program:zulip-tornado]
command=/home/zulip/deployments/current/manage.py runtornado 127.0.0.1:98%(process_num)02d --skip-checks
process_name=zulip-tornado-port-98%(process_num)02d
environment=PYTHONUNBUFFERED=1,HTTP_proxy="<%= @proxy %>",HTTPS_proxy="<%= @proxy %>"
priority=200                   ; the relative start priority (default 999)
autostart=true                 ; start at supervisord start (default: true)
autorestart=true               ; whether/when to restart (default: unexpected)
stopsignal=TERM                 ; signal used to kill process (default TERM)
stopwaitsecs=30                ; max num secs to wait b4 SIGKILL (default 10)
user=zulip                    ; setuid to this UNIX account to run the program
redirect_stderr=true           ; redirect proc stderr to stdout (default false)
stdout_logfile=/var/log/zulip/tornado-98%(process_num)02d.log         ; stdout log path, NONE for none; default AUTO
stdout_logfile_maxbytes=0     ; Rotated by logrotate
stdout_logfile_backups=0
directory=/home/zulip/deployments/current/
numprocs=<%= @tornado_ports.length %>
<% else -%>
[program:zulip-tornado]
command=/home/zulip/deployments/current/manage.py runtornado 127.0.0.1:9800 --skip-checks
environment=PYTHONUNBUFFERED=1,HTTP_proxy="<%= @proxy %>",HTTPS_proxy="<%= @proxy %>"
priority=200                   ; the relative start priority (default 999)
autostart=true                 ; start at supervisord start (default: true)
autorestart=true               ; whether/when to restart (default: unexpected)
stopsignal=TERM                 ; signal used to kill process (default TERM)
stopwaitsecs=30                ; max num secs to wait b4 SIGKILL (default 10)
user=zulip                    ; setuid to this UNIX account to run the program
redirect_stderr=true           ; redirect proc stderr to stdout (default false)
stdout_logfile=/var/log/zulip/tornado.log         ; stdout log path, NONE for none; default AUTO
stdout_logfile_maxbytes=0     ; Rotated by logrotate
stdout_logfile_backups=0
directory=/home/zulip/deployments/current/
<% end -%>

<% if @queues_multiprocess %>
<% @queues.each do |queue| -%>
[program:zulip_events_<%= queue %>]
<%-
  numprocs = 1
  term = "worker"
  if queue == "missedmessage_mobile_notifications"
    numprocs = @mobile_notification_shards
    term = "shard"
  elsif queue == "user_activity"
    numprocs = @user_activity_shards
    term = "shard"
  elsif @worker_counts.has_key?(queue)
    numprocs = @worker_counts[queue]
  end -%>
<%- if numprocs > 1 -%>
process_name=zulip_events_<%= queue %>_<%= term %>%(process_num)s
command=nice -n10 /home/zulip/deployments/current/manage.py process_queue --queue_name=<%= queue %> --skip-checks --worker_num %(process_num)s
stdout_logfile=/var/log/zulip/events_<%= queue %>_<%= term %>%(process_num)s.log         ; stdout log path, NONE for none; default AUTO
numprocs=<%= numprocs %>
numprocs_start=1
<% else -%>
command=nice -n10 /home/zulip/deployments/current/manage.py process_queue --queue_name=<%= queue %> --skip-checks
stdout_logfile=/var/log/zulip/events_<%= queue %>.log         ; stdout log path, NONE for none; default AUTO
<%end -%>
environment=HTTP_proxy="<%= @proxy %>",HTTPS_proxy="<%= @proxy %>"
priority=300                   ; the relative start priority (default 999)
autostart=true                 ; start at supervisord start (default: true)
autorestart=true               ; whether/when to restart (default: unexpected)
stopsignal=TERM                 ; signal used to kill process (default TERM)
stopwaitsecs=30                ; max num secs to wait b4 SIGKILL (default 10)
user=zulip                    ; setuid to this UNIX account to run the program
redirect_stderr=true           ; redirect proc stderr to stdout (default false)
stdout_logfile_maxbytes=20MB   ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=3     ; # of stdout logfile backups (default 10)
directory=/home/zulip/deployments/current/
<% end -%>
<% else %>
[program:zulip_events]
command=nice -n10 /home/zulip/deployments/current/manage.py process_queue --multi_threaded <%= @queues.join(' ') %> --skip-checks
environment=HTTP_proxy="<%= @proxy %>",HTTPS_proxy="<%= @proxy %>"
priority=300                   ; the relative start priority (default 999)
autostart=true                 ; start at supervisord start (default: true)
autorestart=true               ; whether/when to restart (default: unexpected)
stopsignal=TERM                 ; signal used to kill process (default TERM)
stopwaitsecs=30                ; max num secs to wait b4 SIGKILL (default 10)
user=zulip                    ; setuid to this UNIX account to run the program
redirect_stderr=true           ; redirect proc stderr to stdout (default false)
stdout_logfile=/var/log/zulip/events.log         ; stdout log path, NONE for none; default AUTO
stdout_logfile_maxbytes=20MB   ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=3     ; # of stdout logfile backups (default 10)
directory=/home/zulip/deployments/current/
stopasgroup=true              ; Without this, we leak processes every restart
killasgroup=true              ; Without this, we leak processes every restart
<% end %>

; The below sample group section shows all possible group values,
; create one or more 'real' group: sections to create "heterogeneous"
; process groups.

[group:zulip-workers]
<% if @queues_multiprocess %>
; each refers to 'x' in [program:x] definitions
programs=<% @queues.each_with_index do |queue, i| -%>zulip_events_<%= queue %><%= ',' if i < (@queues.size - 1) %> <% end -%>
<% else %>
programs=zulip_events
<% end %>

<% if @katex_server %>
[program:zulip-katex]
command=/usr/local/bin/secret-env-wrapper SHARED_SECRET=shared_secret /srv/zulip-node/bin/node /home/zulip/prod-static/webpack-bundles/katex_server.js <%= @katex_server_port %>
environment=NODE_ENV=production
priority=200                   ; the relative start priority (default 999)
autostart=true                 ; start at supervisord start (default: true)
autorestart=true               ; whether/when to restart (default: unexpected)
stopsignal=TERM                 ; signal used to kill process (default TERM)
stopwaitsecs=30                ; max num secs to wait b4 SIGKILL (default 10)
user=zulip                    ; setuid to this UNIX account to run the program
redirect_stderr=true           ; redirect proc stderr to stdout (default false)
stdout_logfile=/var/log/zulip/katex.log         ; stdout log path, NONE for none; default AUTO
stdout_logfile_maxbytes=20MB   ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=3     ; # of stdout logfile backups (default 10)
directory=/home/zulip/deployments/current/
<% end %>

; The [include] section can just contain the "files" setting.  This
; setting can list multiple files (separated by whitespace or
; newlines).  It can also contain wildcards.  The filenames are
; interpreted as relative to this file.  Included files *cannot*
; include files themselves.

;[include]
;files = relative/directory/*.ini

;enable server restarts without requiring superuser access. This assumes that this is the only service being controlled by supervisord on this machine.
[unix_http_server]
chown=zulip:zulip
```

--------------------------------------------------------------------------------

---[FILE: get-django-setting]---
Location: zulip-main/scripts/get-django-setting

```text
#!/usr/bin/env python3
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
from scripts.lib.setup_path import setup_path

setup_path()

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"
from django.conf import settings

print(getattr(settings, sys.argv[1]))
```

--------------------------------------------------------------------------------

---[FILE: log-search]---
Location: zulip-main/scripts/log-search

```text
#!/usr/bin/env python3

import argparse
import calendar
import gzip
import logging
import os
import re
import signal
import statistics
import sys
from datetime import date, datetime, timedelta, timezone
from enum import Enum, auto
from re import Match
from typing import TextIO

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ZULIP_PATH)

from scripts.lib.setup_path import setup_path

setup_path()

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"

from typing import Protocol

from django.conf import settings

from scripts.lib.zulip_tools import (
    BOLD,
    CYAN,
    ENDC,
    FAIL,
    GRAY,
    OKBLUE,
    get_config,
    get_config_file,
)


def parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Search logfiles, ignoring commonly-fetched URLs.")
    log_selection = parser.add_argument_group("File selection")
    log_selection_options = log_selection.add_mutually_exclusive_group()
    access_log_retention_days = int(
        get_config(get_config_file(), "application_server", "access_log_retention_days", "14")
    )
    log_selection_options.add_argument(
        "--log-files",
        "-n",
        help="Number of log files to search",
        choices=range(1, access_log_retention_days + 2),
        metavar=f"[1-{access_log_retention_days + 1}]",
        type=int,
    )
    log_selection_options.add_argument(
        "--all-logs",
        "-A",
        help="Parse all logfiles, not just most recent",
        action="store_true",
    )
    log_selection_options.add_argument(
        "--min-hours",
        "-H",
        help="Estimated minimum number of hours; includes previous log file, if estimated less than this",
        type=int,
        choices=range(24),
        default=3,
    )
    log_selection.add_argument(
        "--nginx",
        "-N",
        help="Parse from NGINX logs, not server.log",
        action="store_true",
    )

    filtering = parser.add_argument_group("Filtering")
    filtering.add_argument(
        "filter_terms",
        help="IP address, hostname, user-id, HTTP method, path, datetime prefix, or status code to search for; multiple are AND'ed together",
        nargs="+",
    )
    filtering.add_argument(
        "--all-lines",
        "-L",
        help="Show all matching lines; equivalent to -suaemtpr",
        action="store_true",
    )
    filtering.add_argument("--static", "-s", help="Include static file paths", action="store_true")
    filtering.add_argument("--uploads", "-u", help="Include file upload paths", action="store_true")
    filtering.add_argument("--avatars", "-a", help="Include avatar paths", action="store_true")
    filtering.add_argument("--events", "-e", help="Include event fetch paths", action="store_true")
    filtering.add_argument("--messages", "-m", help="Include message paths", action="store_true")
    filtering.add_argument(
        "--typing",
        "-t",
        help="Include typing notification path",
        action="store_true",
    )
    filtering.add_argument("--presence", "-p", help="Include presence paths", action="store_true")
    filtering.add_argument(
        "--report", "-r", help="Include Sentry reporting paths", action="store_true"
    )
    filtering.add_argument(
        "--no-other", "-O", help="Exclude paths not explicitly included", action="store_true"
    )
    filtering.add_argument(
        "--client",
        "--user-agent",
        "-C",
        help="Only include requests whose client/user-agent contains this string",
    )
    filtering.add_argument(
        "--extra",
        "-X",
        help="Only include requests whose logline includes this in [extra] flags",
    )

    output = parser.add_argument_group("Output")
    output.add_argument("--full-line", "-F", help="Show full matching line", action="store_true")
    output.add_argument("--timeline", "-T", help="Show start, end, and gaps", action="store_true")
    output.add_argument("--stats", "-S", help="Compute and show statistics", action="store_true")
    return parser


def maybe_gzip(logfile_name: str) -> TextIO:
    if logfile_name.endswith(".gz"):
        return gzip.open(logfile_name, "rt")
    return open(logfile_name)


NGINX_LOG_LINE_RE = re.compile(
    r"""
      (?P<ip> \S+ ) \s+
      - \s+
      (?P<user> \S+ ) \s+
      \[
         (?P<date> \d+/\w+/\d+ )
         :
         (?P<time> \d+:\d+:\d+ )
         \s+ [+-]\d+
      \] \s+
      "
         (?P<method> \S+ )
         \s+
         (?P<full_path> (?P<path> [^"?]+ ) (\?[^"]*)? )
         \s+
         (?P<http_version> HTTP/[^"]+ )
      " \s+
      (?P<code> \d+ ) \s+
      (?P<bytes> \d+ ) \s+
      "(?P<referer> [^"]* )" \s+
      "(?P<user_agent> [^"]* )" \s+
      (?P<hostname> \S+ ) \s+
      (?P<duration> \S+ )
    """,
    re.VERBOSE,
)

PYTHON_LOG_LINE_RE = re.compile(
    r"""
      (?P<date> \d+-\d+-\d+ ) \s+
      (?P<time> \d+:\d+:\d+\.\d+ ) \s+
      INFO \s+  # All access log lines are INFO
      (pid:\d+ \s+) ?
      \[ (?P<source> zr(:\d+)?) \] \s+
      (?P<ip>
        \d{1,3}(\.\d{1,3}){3}
      | ([a-f0-9:]+:+){1,7}[a-f0-9]*
      ) \s+
      (?P<method> [A-Z]+ ) \s+
      (?P<code> \d+ ) \s+
      (?P<duration> \S+ ) \s+ # This can be "217ms" or "1.7s"
      ( \( (?P<perf> [^)]+ ) \) \s+ )*
      (?P<full_path> (?P<path> /\S* ) ) \s+
      (?P<extra> .* )   # Multiple extra things can go here
      \(
        (?P<user>
           ( (?P<user_id> \d+ ) | unauth )
           @
           (?P<hostname> \S+ )
         | zulip-server:\S+
         | scim-client:\S+
         | internal
        ) \s+ via \s+ (?P<user_agent> .* )
      \)
    """,
    re.VERBOSE,
)


class FilterType(Enum):
    HOSTNAME = auto()
    CLIENT_IP = auto()
    USER_ID = auto()
    METHOD = auto()
    PATH = auto()
    STATUS = auto()
    DATETIME = auto()


class FilterFunc(Protocol):
    def __call__(self, m: Match[str], t: str = ...) -> bool: ...


def main() -> None:
    args = parser().parse_args()

    (filter_types, filter_funcs, substr_terms) = parse_filters(args)
    logfile_names = parse_logfile_names(args)
    if args.timeline and args.nginx:
        print("! nginx logs not suggested for timeline, due to imprecision", file=sys.stderr)

    use_color = sys.stdout.isatty()
    lowered_terms = [term.lower() for term in substr_terms]
    if args.stats:
        durations: list[int] | None = []
    else:
        durations = None
    try:
        for logfile_name in reversed(logfile_names):
            with maybe_gzip(logfile_name) as logfile:
                for logline in logfile:
                    # As a performance optimization, just do a substring
                    # check before we parse the line fully
                    lowered = logline.lower()
                    if not all(f in lowered for f in lowered_terms):
                        continue

                    if args.nginx:
                        match = NGINX_LOG_LINE_RE.match(logline)
                    else:
                        match = PYTHON_LOG_LINE_RE.match(logline)
                    if match is None:
                        # We expect other types of loglines in the Python logfiles
                        if args.nginx:
                            print(f"! Failed to parse:\n{logline}", file=sys.stderr)
                        continue
                    if passes_filters(filter_funcs, match, args):
                        print_line(
                            match,
                            args,
                            filter_types=filter_types,
                            use_color=use_color,
                            durations=durations,
                        )
    except BrokenPipeError:
        # Python flushes standard streams on exit; redirect remaining output
        # to devnull to avoid another BrokenPipeError at shutdown
        devnull = os.open(os.devnull, os.O_WRONLY)
        os.dup2(devnull, sys.stdout.fileno())
        sys.exit(1)
    except KeyboardInterrupt:
        sys.exit(signal.SIGINT + 128)

    if durations is not None:
        # Prepend [0] to make the percentiles 1-indexed, instead of 0-indexed
        percentiles = [0, *statistics.quantiles(durations, n=100)]
        print()
        print(f"Total requests: {len(durations)}")
        print(f"Min duration:   {min(durations):>5}ms")
        print(f"p50 duration:   {int(percentiles[50]):>5}ms")
        print(f"p75 duration:   {int(percentiles[75]):>5}ms")
        print(f"p90 duration:   {int(percentiles[90]):>5}ms")
        print(f"p95 duration:   {int(percentiles[95]):>5}ms")
        print(f"p99 duration:   {int(percentiles[99]):>5}ms")
        print(f"Max duration:   {max(durations):>5}ms")


def parse_logfile_names(args: argparse.Namespace) -> list[str]:
    if args.nginx:
        base_path = "/var/log/nginx/access.log"
    else:
        base_path = "/var/log/zulip/server.log"

    for term in args.filter_terms:
        date_term = re.match(r"2\d\d\d-\d\d-\d\d", term)
        if not date_term:
            continue
        # They're limiting to a specific day; find the right logfile
        # which is going to have any matches
        rotations = int(
            (datetime.now(tz=timezone.utc).date() - date.fromisoformat(date_term[0]))
            / timedelta(days=1)
        )
        access_log_retention_days = int(
            get_config(get_config_file(), "application_server", "access_log_retention_days", "14")
        )
        if rotations > access_log_retention_days:
            raise RuntimeError(f"Date is too old (more than {access_log_retention_days} days ago)")
        if rotations == 0:
            return [base_path]
        if rotations == 1:
            return [f"{base_path}.1"]
        else:
            return [f"{base_path}.{rotations}.gz"]

    logfile_names = [base_path]
    if args.all_logs:
        logfile_count = 15
    elif args.log_files is not None:
        logfile_count = args.log_files
    else:
        # Detect if there was a logfile rotation in the last
        # (min-hours)-ish hours, and if so include the previous
        # logfile as well.
        logfile_count = 1
        try:
            current_size = os.path.getsize(base_path)
            past_size = os.path.getsize(base_path + ".1")
            if current_size < (args.min_hours / 24.0) * past_size:
                logfile_count = 2
        except FileNotFoundError:
            pass
    for n in range(1, logfile_count):
        logname = f"{base_path}.{n}"
        if n > 1:
            logname += ".gz"
        logfile_names.append(logname)
    return logfile_names


month_no_to_name_lookup = {f"{k:02d}": v for k, v in enumerate(calendar.month_abbr)}
month_name_to_no_lookup = {v: k for k, v in month_no_to_name_lookup.items()}


def convert_from_nginx_date(date: str) -> str:
    day_of_month, month_abbr, year = date.split("/")
    return f"{year}-{month_name_to_no_lookup[month_abbr]}-{day_of_month}"


def convert_to_nginx_date(date: str) -> str:
    year, month_no, day_of_month = date.split("-")
    return f"{day_of_month}/{month_no_to_name_lookup[month_no]}/{year}"


def parse_filters(
    args: argparse.Namespace,
) -> tuple[set[FilterType], list[FilterFunc], list[str]]:
    # The heuristics below are not intended to be precise -- they
    # certainly count things as "IPv4" or "IPv6" addresses that are
    # invalid.  However, we expect the input here to already be
    # reasonably well-formed.

    filter_types = set()
    filter_funcs = []
    filter_terms = []

    if args.events and not args.nginx:
        logging.warning("Adding --nginx -- /events requests do not appear in Django logs.")
        args.nginx = True

    for filter_term in args.filter_terms:
        if re.match(r"[1-5][0-9][0-9]$", filter_term):
            filter_func = lambda m, t=filter_term: m["code"] == t
            filter_type = FilterType.STATUS
            if not args.nginx and filter_term == "502":
                logging.warning("Adding --nginx -- 502's do not appear in Django logs.")
                args.nginx = True
        elif re.match(r"[1-5]xx$", filter_term):
            filter_term = filter_term[0]
            filter_func = lambda m, t=filter_term: m["code"].startswith(t)
            filter_type = FilterType.STATUS
        elif re.match(r"\d+$", filter_term):
            if args.nginx:
                raise parser().error("Cannot parse user-ids with nginx logs; try without --nginx")
            filter_func = lambda m, t=filter_term: m["user_id"] == t
            filter_type = FilterType.USER_ID
        elif re.match(r"\d{1,3}(\.\d{1,3}){3}$", filter_term):
            filter_func = lambda m, t=filter_term: m["ip"] == t
            filter_type = FilterType.CLIENT_IP
        elif re.match(r"([a-f0-9:]+:+){1,7}[a-f0-9]+$", filter_term):
            filter_func = lambda m, t=filter_term: m["ip"] == t
            filter_type = FilterType.CLIENT_IP
        elif re.match(r"DELETE|GET|HEAD|OPTIONS|PATCH|POST|PUT", filter_term):
            filter_func = lambda m, t=filter_term: m["method"].upper() == t
            filter_type = FilterType.METHOD
        elif re.match(r"(2\d\d\d-\d\d-\d\d)( \d(\d(:(\d(\d(:(\d\d?)?)?)?)?)?)?)?", filter_term):
            if args.nginx:
                datetime_parts = filter_term.split(" ")
                filter_term = ":".join(
                    [convert_to_nginx_date(datetime_parts[0]), *datetime_parts[1:]]
                )
                filter_func = lambda m, t=filter_term: f"{m['date']}:{m['time']}".startswith(t)
            else:
                filter_func = lambda m, t=filter_term: f"{m['date']} {m['time']}".startswith(t)
            filter_type = FilterType.DATETIME
        elif re.match(r"[a-z0-9]([a-z0-9-]*[a-z0-9])?$", filter_term.lower()):
            filter_term = filter_term.lower()
            if args.nginx:
                filter_func = lambda m, t=filter_term: m["hostname"].startswith(t + ".")
            else:
                filter_func = lambda m, t=filter_term: m["hostname"] == t
            filter_type = FilterType.HOSTNAME
        elif re.match(r"[a-z0-9-]+(\.[a-z0-9-]+)+$", filter_term.lower()) and re.search(
            r"[a-z-]", filter_term.lower()
        ):
            if not args.nginx:
                raise parser().error("Cannot parse full domains with Python logs; try --nginx")
            filter_term = filter_term.lower()
            filter_func = lambda m, t=filter_term: m["hostname"] == t
            filter_type = FilterType.HOSTNAME
        elif re.match(r"/\S*$", filter_term):
            filter_func = lambda m, t=filter_term: m["path"] == t
            filter_type = FilterType.PATH
            args.all_lines = True
        else:
            raise RuntimeError(
                f"Can't parse {filter_term} as an IP, hostname, user-id, HTTP method, path, or status code."
            )
        if filter_type in filter_types:
            parser().error("Supplied the same time of value more than once, which cannot match!")
        filter_types.add(filter_type)
        filter_funcs.append(filter_func)
        filter_terms.append(filter_term)

    if args.client:
        filter_funcs.append(lambda m, t=args.client: t in m["user_agent"])
        filter_terms.append(args.client)

    if args.extra:
        if args.nginx:
            raise parser().error("nginx logs do not contain [extra] data; try without --nginx")
        filter_funcs.append(lambda m, t=args.extra: t in m["extra"])
        filter_terms.append(args.extra)

    return (filter_types, filter_funcs, filter_terms)


def passes_filters(
    string_filters: list[FilterFunc],
    match: Match[str],
    args: argparse.Namespace,
) -> bool:
    if not all(f(match) for f in string_filters):
        return False

    if args.all_lines:
        return True

    path = match["path"]
    if path.startswith("/static/"):
        return args.static
    elif path.startswith("/user_uploads/"):
        return args.uploads
    elif path.startswith(("/user_avatars/", "/avatar/")):
        return args.avatars
    elif re.match(r"/(json|api/v1)/events($|\?|/)", path):
        return args.events
    elif path in ("/api/v1/typing", "/json/typing"):
        return args.typing
    elif re.match(r"/(json|api/v1)/messages($|\?|/)", path):
        return args.messages
    elif path in ("/api/v1/users/me/presence", "/json/users/me/presence"):
        return args.presence
    elif path == "/error_tracing":
        return args.report
    else:
        return not args.no_other


last_match_end: datetime | None = None


def print_line(
    match: Match[str],
    args: argparse.Namespace,
    filter_types: set[FilterType],
    use_color: bool,
    durations: list[int] | None = None,
) -> None:
    global last_match_end

    if match["duration"].endswith("ms"):
        duration_ms = int(match["duration"].removesuffix("ms"))
    else:
        duration_ms = int(float(match["duration"].removesuffix("s")) * 1000)
    if durations is not None:
        durations.append(duration_ms)

    if args.full_line:
        print(match.group(0))
        return

    if args.nginx:
        date = convert_from_nginx_date(match["date"])
    else:
        date = match["date"]
    if args.all_logs or (args.log_files is not None and args.log_files > 1):
        ts = date + " " + match["time"]
    else:
        ts = match["time"]

    if match["duration"].endswith("ms"):
        duration_ms = int(match["duration"].removesuffix("ms"))
    else:
        duration_ms = int(float(match["duration"].removesuffix("s")) * 1000)

    code = int(match["code"])
    indicator = " "
    color = ""
    if code == 401:
        indicator = ":"
        color = CYAN
    elif code == 499:
        indicator = "-"
        color = GRAY
    elif code >= 400 and code < 499:
        indicator = ">"
        color = OKBLUE
    elif code >= 500 and code <= 599:
        indicator = "!"
        color = FAIL

    if use_color:
        url = f"{BOLD}{match['full_path']}"
    else:
        url = match["full_path"]
        color = ""

    if FilterType.HOSTNAME not in filter_types:
        hostname = match["hostname"]
        if hostname is None:
            hostname = "???." + settings.EXTERNAL_HOST
        elif not args.nginx:
            if hostname != "root":
                hostname += "." + settings.EXTERNAL_HOST
            elif settings.EXTERNAL_HOST == "zulipchat.com":
                hostname = "zulip.com"
            else:
                hostname = settings.EXTERNAL_HOST
        url = "https://" + hostname + url

    user_id = ""
    if not args.nginx and match["user_id"] is not None:
        user_id = match["user_id"] + "@"

    if args.timeline:
        logline_end = datetime.fromisoformat(date + " " + match["time"])
        logline_start = logline_end - timedelta(milliseconds=duration_ms)
        if last_match_end is not None:
            gap_ms = int((logline_start - last_match_end) / timedelta(milliseconds=1))
            if gap_ms > 5000:
                print()
                print(f"========== {int(gap_ms / 1000):>4} second gap ==========")
                print()
            elif gap_ms > 1000:
                print(f"============ {gap_ms:>5}ms gap ============")
            elif gap_ms > 0:
                print(f"------------ {gap_ms:>5}ms gap ------------")
            else:
                print(f"!!!!!!!!!! {abs(gap_ms):>5}ms overlap !!!!!!!!!!")
        if args.all_logs or (args.log_files is not None and args.log_files > 1):
            print(logline_start.isoformat(" ", timespec="milliseconds") + " (start)")
        else:
            print(logline_start.time().isoformat(timespec="milliseconds") + " (start)")
        last_match_end = logline_end

    parts = [
        ts,
        f"{duration_ms:>5}ms",
        f"{user_id:7}" if not args.nginx and FilterType.USER_ID not in filter_types else None,
        f"{match['ip']:39}" if FilterType.CLIENT_IP not in filter_types else None,
        indicator + match["code"],
        f"{match['method']:6}",
        url,
    ]

    print(color + " ".join(p for p in parts if p is not None) + (ENDC if use_color else ""))


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: purge-old-deployments]---
Location: zulip-main/scripts/purge-old-deployments

```text
#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ZULIP_PATH)
from scripts.lib import clean_unused_caches
from scripts.lib.zulip_tools import (
    DEPLOYMENTS_DIR,
    get_recent_deployments,
    maybe_perform_purging,
    su_to_zulip,
)

LOCAL_GIT_CACHE_DIR = "/srv/zulip.git"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="This script can be used for cleaning old unused deployments.",
        epilog="Orphaned/unused caches older than threshold days will be automatically "
        "examined and removed.",
    )
    parser.add_argument(
        "--threshold",
        dest="threshold_days",
        type=int,
        default=14,
        metavar="<days>",
        help="Deployments older than threshold days will be deleted. (defaults to 14)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="If specified then script will only print the deployments and "
        "caches that it will delete/keep back. It will not delete anything.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="If specified then script will print a detailed report of what is going on.",
    )
    parser.add_argument(
        "--no-print-headings",
        dest="no_headings",
        action="store_true",
        help="If specified then script will not print headings for what will be deleted/kept back.",
    )

    args = parser.parse_args()
    args.verbose |= args.dry_run  # Always print a detailed report in case of dry run.
    return args


def get_deployments_to_be_purged(recent_deployments: set[str]) -> set[str]:
    all_deployments = {
        os.path.join(DEPLOYMENTS_DIR, deployment) for deployment in os.listdir(DEPLOYMENTS_DIR)
    }
    deployments_to_purge = set()
    for deployment in all_deployments:
        # Deployments whose name is not in the format of a timestamp are
        # always included in the recent_deployments and are not deleted.
        if not os.path.isdir(deployment):
            # Skip things like uwsgi sockets.
            continue
        if not os.path.exists(os.path.join(deployment, "zerver")):
            # Skip things like "lock" that aren't actually a deployment directory
            continue
        if deployment not in recent_deployments:
            deployments_to_purge.add(deployment)
    return deployments_to_purge


def main() -> None:
    args = parse_args()
    deployments_to_keep = get_recent_deployments(args.threshold_days)
    deployments_to_purge = get_deployments_to_be_purged(deployments_to_keep)

    maybe_perform_purging(
        deployments_to_purge, deployments_to_keep, "deployment", args.dry_run, args.verbose, True
    )

    if not args.dry_run:
        if os.path.exists(LOCAL_GIT_CACHE_DIR):
            subprocess.check_call(
                ["git", "worktree", "prune"], cwd=LOCAL_GIT_CACHE_DIR, preexec_fn=su_to_zulip
            )

        if not args.no_headings:
            print("Deployments cleaned successfully...")
            print("Cleaning orphaned/unused caches...")

    # Call 'clean_unused_caches.py' script to clean any orphaned/unused caches.
    clean_unused_caches.main(args)
    print("Done!")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: zulip-main/scripts/README.md

```text
This directory contains scripts that:

- Generally do not require access to Django or the database (those are
  "management commands"), and thus are suitable to run operationally.

- Are useful for managing a production deployment of Zulip (many are
  also used in a Zulip development environment, though
  development-only scripts live in `tools/`).

For more details, see
https://zulip.readthedocs.io/en/latest/overview/directory-structure.html.
```

--------------------------------------------------------------------------------

---[FILE: refresh-sharding-and-restart]---
Location: zulip-main/scripts/refresh-sharding-and-restart

```text
#!/usr/bin/env bash

set -e

# Stand up the new zulip-tornado supervisor instances, and write out
# the newly generated config files, with .tmp suffix
SUPPRESS_SHARDING_NOTICE=1 "$(dirname "$0")/zulip-puppet-apply" -f

# Verify, before we move them into place
if ! [ -e /etc/zulip/nginx_sharding_map.conf.tmp ] || ! [ -e /etc/zulip/sharding.json.tmp ]; then
    echo "No sharding updates found to apply."
    exit 1
fi

# In the ordering of operations below, the crucial detail is that
# Django, Tornado, and workers need to be restarted before reloading
# nginx. Django and Tornado have in-memory maps of which realm belongs
# to which shard. Reloading nginx will cause users' tornado requests
# to be routed according to the new sharding scheme. If that happens
# before Django is restarted, updating its realm->shard map, users on
# realms whose shard has changed will have their tornado requests
# handled by the new tornado process, while Django will still use the
# old process for its internal communication with tornado when
# servicing the user's requests.  That's a bad state that leads to
# clients getting into reload loops ending in crashing on 500 response
# while Django is restarting.  For this reason it's important to
# reload nginx only after Django and Tornado.
"$(dirname "$0")/restart-server" --tornado-reshard
service nginx reload
```

--------------------------------------------------------------------------------

---[FILE: reload-clients]---
Location: zulip-main/scripts/reload-clients

```text
#!/usr/bin/env python3
import argparse
import configparser
import logging
import os
import sys
import time

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from scripts.lib.setup_path import setup_path

setup_path()

import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

from scripts.lib.zulip_tools import get_config, get_config_file, get_tornado_ports

config_file = get_config_file()
reload_rate = int(
    get_config(
        config_file,
        "application_server",
        "client_reload_rate",
        "50",
    )
)

parser = argparse.ArgumentParser()
parser.add_argument(
    "--rate", type=int, help="Number of clients to reload per second", default=reload_rate
)
parser.add_argument("--background", action="store_true", help="Daemonize the process")

args = parser.parse_args()
reload_rate = args.rate

secret_config_file = configparser.RawConfigParser()
secret_config_file.read("/etc/zulip/zulip-secrets.conf")
shared_secret = get_config(secret_config_file, "secrets", "shared_secret")
assert shared_secret

# Perform relatively slow retries (2s, 4s, 8s) with backoff, including
# on POST requests.  Failure to send this request successfully means
# that clients may fail to reload, so we want to be somewhat resilient
# to failures.  Since we are on localhost, we do not expect network
# failures, only Tornado restarts, to cause failures here.
retry = Retry(total=3, backoff_factor=1, allowed_methods=Retry.DEFAULT_ALLOWED_METHODS | {"POST"})
c = requests.Session()
c.mount("http://", HTTPAdapter(max_retries=retry))

log_filename = None
if args.background:
    # Double-fork to daemonize
    pid = os.fork()
    if pid > 0:
        sys.exit(0)
    os.setsid()
    pid = os.fork()
    if pid > 0:
        sys.exit(0)
    log_filename = "/var/log/zulip/reload-clients.log"

logging.Formatter.converter = time.gmtime
logging.basicConfig(
    format="%(asctime)s reload-clients: %(message)s",
    level=logging.INFO,
    filename=log_filename,
)

first = True
server_total = 0
for port in get_tornado_ports(config_file):
    logging.info("Starting to send client reload events to Tornado port %d", port)
    try:
        shard_total = 0
        complete = False
        # Rather than make a sustained one request per second, we batch
        # into 5-second chunks of 5 times the client_reload_rate
        SECONDS_PER_BATCH = 5
        while not complete:
            if not first:
                time.sleep(SECONDS_PER_BATCH)
            first = False

            logging.info("Sending reload events to %d clients", reload_rate * SECONDS_PER_BATCH)
            resp = c.post(
                f"http://127.0.0.1:{port}/api/internal/web_reload_clients",
                data={"client_count": reload_rate * SECONDS_PER_BATCH, "secret": shared_secret},
                timeout=5,
                proxies={"http": ""},  # Make sure we don't go through Smokescreen
            )
            resp.raise_for_status()
            shard_total += resp.json()["sent_events"]
            complete = resp.json()["complete"]
        logging.info("Sent %d reload events to Tornado port %d", shard_total, port)
        server_total += shard_total
    except requests.exceptions.HTTPError:
        # Failures in one shard likely won't affect other shards --
        # give up on this shard, and try the next one,
        logging.exception("Failed to send web_reload_clients request to Tornado port %d", port)

if len(get_tornado_ports(config_file)) > 1:
    logging.info("Sent total of %d reload events, across all Tornado instances", server_total)
```

--------------------------------------------------------------------------------

````

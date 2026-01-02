---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 448
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 448 of 1290)

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

---[FILE: install]---
Location: zulip-main/scripts/lib/install

```text
#!/usr/bin/env bash
set -e

usage() {
    # A subset of this documentation also appears in docs/production/install.md
    cat <<'EOF'
Usage:
  install --hostname=zulip.example.com --email=zulip-admin@example.com [options...]
  install --help

Options:
  --hostname=zulip.example.com
      The user-accessible domain name for this Zulip server, i.e.,
      what users will type in their web browser.  Required, unless
      --no-init-db or --puppet-classes is set, and --certbot is not.

  --email=zulip-admin@example.com
      The email address of the person or team who should get support
      and error emails from this Zulip server.  Required, unless
      --no-init-db or --puppet-classes is set and --certbot is not.

  --certbot
      Obtains a free SSL certificate for the server using Certbot,
      https://certbot.eff.org/  Recommended.  Conflicts with --self-signed-cert.
  --self-signed-cert
      Generate a self-signed SSL certificate for the server. This isn’t suitable for
      production use, but may be convenient for testing.  Conflicts with --certbot.

  --postgresql-database-name=zulip
      Sets the PostgreSQL database name.
  --postgresql-database-user=zulip
      Sets the PostgreSQL database user.
  --postgresql-version=18
      Sets the version of PostgreSQL that will be installed.

  --no-init-db
      Does not do any database initialization; use when you already have a Zulip
      database.
  --puppet-classes
      Comma-separated list of Puppet classes to install; defaults to
      'zulip:::profile::standalone'.  Implies --no-init-db.

  --no-overwrite-settings
      Preserve existing `/etc/zulip` configuration files.
  --no-dist-upgrade
      Skip the initial `apt-get dist-upgrade`.

  --push-notifications
      With this option, the Zulip installer registers your server for the Mobile
      Push Notification Service, and sets up the initial default configuration.
      You will be immediately prompted to agree to the Terms of Service, and your
      server will be registered at the end of the installation process.
  --no-push-notifications
      Disable push notifications registration (the default if neither
      flag is provided).

  --no-submit-usage-statistics
      If you enable push notifications, by default your server
      will submit basic metadata (required for billing and for
      determining free plan eligibility), as well as aggregate usage
      statistics. You can disable submitting usage statistics by passing
      this flag.
      If push notifications are not enabled, data won't be submitted, so
      this flag is redundant.

  --agree-to-terms-of-service
      If you enable push notifications, you can pass this flag to indicate
      that you have read and agree to the Zulip Terms of Service:
      <https://zulip.com/policies/terms>.
      This skips the Terms of Service prompt, allowing for running the installer
      with --push-notifications in scripts without requiring user input.


EOF
}

system_requirements_failure() {
    set +x
    echo >&2
    cat >&2
    cat <<EOF >&2

For more information, see:
  https://zulip.readthedocs.io/en/latest/production/requirements.html
EOF
    exit 1
}

# Shell option parsing.  Over time, we'll want to move some of the
# environment variables below into this self-documenting system.
args="$(getopt -o '' --long help,hostname:,email:,certbot,self-signed-cert,cacert:,postgresql-database-name:,postgresql-database-user:,postgresql-version:,no-init-db,puppet-classes:,no-overwrite-settings,no-dist-upgrade,push-notifications,no-push-notifications,no-submit-usage-statistics,agree-to-terms-of-service -n "$0" -- "$@")"

eval "set -- $args"
while true; do
    case "$1" in
        --help)
            usage
            exit 0
            ;;

        --hostname)
            EXTERNAL_HOST="$2"
            shift
            shift
            ;;
        --email)
            ZULIP_ADMINISTRATOR="$2"
            shift
            shift
            ;;

        --certbot)
            USE_CERTBOT=1
            shift
            ;;
        --self-signed-cert)
            SELF_SIGNED_CERT=1
            shift
            ;;
        --postgresql-database-name)
            POSTGRESQL_DATABASE_NAME="$2"
            shift
            shift
            ;;
        --postgresql-database-user)
            POSTGRESQL_DATABASE_USER="$2"
            shift
            shift
            ;;
        --postgresql-version)
            POSTGRESQL_VERSION="$2"
            shift
            shift
            ;;
        --no-init-db)
            NO_INIT_DB=1
            shift
            ;;
        --puppet-classes)
            PUPPET_CLASSES="$2"
            NO_INIT_DB=1
            shift
            shift
            ;;

        --no-overwrite-settings)
            NO_OVERWRITE_SETTINGS=1
            shift
            ;;
        --no-dist-upgrade)
            NO_DIST_UPGRADE=1
            shift
            ;;
        --push-notifications)
            if [ -n "$NO_PUSH_NOTIFICATIONS" ]; then
                echo "error: --push-notifications and --no-push-notifications are incompatible." >&2
                exit 1
            fi
            PUSH_NOTIFICATIONS=1
            shift
            ;;
        --no-push-notifications)
            if [ -n "$PUSH_NOTIFICATIONS" ]; then
                echo "error: --push-notifications and --no-push-notifications are incompatible." >&2
                exit 1
            fi
            NO_PUSH_NOTIFICATIONS=1
            shift
            ;;
        --no-submit-usage-statistics)
            NO_SUBMIT_USAGE_STATISTICS=1
            shift
            ;;
        --agree-to-terms-of-service)
            AGREE_TO_TERMS_OF_SERVICE_FLAG=1
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

if [ "$#" -gt 0 ]; then
    usage >&2
    exit 1
fi

## Options from environment variables.
#
# Specify options for apt.
read -r -a APT_OPTIONS <<<"${APT_OPTIONS:-}"
# Install additional packages.
read -r -a ADDITIONAL_PACKAGES <<<"${ADDITIONAL_PACKAGES:-}"
# Comma-separated list of Puppet manifests to install.  The default is
# zulip::profile::standalone for an all-in-one system or
# zulip::profile::docker for Docker.  Use
# e.g. zulip::profile::app_frontend for a Zulip frontend server.
PUPPET_CLASSES="${PUPPET_CLASSES:-zulip::profile::standalone}"
POSTGRESQL_VERSION="${POSTGRESQL_VERSION:-18}"

if [ -n "$SELF_SIGNED_CERT" ] && [ -n "$USE_CERTBOT" ]; then
    set +x
    echo "error: --self-signed-cert and --certbot are incompatible" >&2
    echo >&2
    usage >&2
    exit 1
fi

if [ -z "$EXTERNAL_HOST" ] || [ -z "$ZULIP_ADMINISTRATOR" ]; then
    if [ -n "$USE_CERTBOT" ] || [ -z "$NO_INIT_DB" ]; then
        usage >&2
        exit 1
    fi
fi

if [ "$EXTERNAL_HOST" = zulip.example.com ] \
    || [ "$ZULIP_ADMINISTRATOR" = zulip-admin@example.com ]; then
    # These example values are specifically checked for and would fail
    # later; see zerver/checks.py
    echo 'error: The example hostname and email must be replaced with real values.' >&2
    echo >&2
    usage >&2
    exit 1
fi

case "$POSTGRESQL_VERSION" in
    [0-9] | [0-9].* | 1[0-3] | 1[0-3].*)
        echo "error: PostgreSQL 14 or newer is required." >&2
        exit 1
        ;;
esac

if [ -z "$PUSH_NOTIFICATIONS" ] && [ -z "$NO_PUSH_NOTIFICATIONS" ]; then
    # Unless specified, we default to --no-push-notifications
    NO_PUSH_NOTIFICATIONS=1
fi

# We set these to Python-style True/False string values, for easy
# insertion into the settings.py file.
if [ -n "$PUSH_NOTIFICATIONS" ]; then
    SERVICE_MOBILE_PUSH="True"

    # --push-notifications also enables SUBMIT_USAGE_STATISTICS, unless the user
    # explicitly opted out by passing --no-submit-usage-statistics.
    if [ -n "$NO_SUBMIT_USAGE_STATISTICS" ]; then
        SERVICE_SUBMIT_USAGE_STATISTICS="False"
    else
        SERVICE_SUBMIT_USAGE_STATISTICS="True"
    fi
else
    SERVICE_MOBILE_PUSH="False"
    # SUBMIT_USAGE_STATISTICS without PUSH_NOTIFICATIONS is an unusual
    # configuration that we don't need to offer in the installer.
    SERVICE_SUBMIT_USAGE_STATISTICS="False"
fi

# ToS acceptance needs to be ensured if --push-notifications is passed.
if [ -n "$PUSH_NOTIFICATIONS" ]; then
    # If the user provided the --agree-to-terms-of-service flag, we can just proceed.
    if [ -n "$AGREE_TO_TERMS_OF_SERVICE_FLAG" ]; then
        PUSH_NOTIFICATIONS_SERVICE_TOS_AGREED=1
        echo "Push notifications will be enabled, as you agreed to the Zulip Terms of Service"
        echo "by passing the --agree-to-terms-of-service flag."
        sleep 2
    else
        # If user asked for push notifications, prompt for ToS acceptance.
        echo
        echo "You chose to register your server for the Mobile Push Notifications Service."
        echo "Doing so will share basic metadata with the service's maintainers, including:"
        echo
        echo "* The server's configured hostname: $EXTERNAL_HOST"
        echo "* The server's configured contact email address: $ZULIP_ADMINISTRATOR"
        echo "* Basic metadata about each organization hosted by the server; see:"
        echo "    <https://zulip.com/doc-permalinks/basic-metadata>"
        if [ -z "$NO_SUBMIT_USAGE_STATISTICS" ]; then
            echo "* The server's usage statistics; see:"
            echo "    <https://zulip.com/doc-permalinks/usage-statistics>"
        fi
        echo
        echo "For details on why a centralized push notification service is necessary, see:"
        echo "    <https://zulip.com/doc-permalinks/why-service>"
        echo
        echo "Use of this service is governed by the Zulip Terms of Service:"
        echo "    <https://zulip.com/policies/terms>"
        echo
        read -r -p "Do you want to agree to the Zulip Terms of Service and proceed? [Y/n] " tos_prompt
        echo

        # Normalize the user’s response to lowercase.
        case "${tos_prompt,,}" in
            "" | y | yes)
                echo "Great! Push notifications will be enabled; continuing with installation..."
                PUSH_NOTIFICATIONS_SERVICE_TOS_AGREED=1
                sleep 2
                ;;
            *)
                echo "In order to enable push notifications, you must agree to the Terms of Service."
                echo "If you do not want to enable push notifications, run the command without the --push-notifications flag."
                exit 1
                ;;
        esac
    fi
fi

# Do set -x after option parsing is complete
set -x

ZULIP_PATH="$(readlink -f "$(dirname "$0")"/../..)"

# Force a known locale.  Some packages on PyPI fail to install in some locales.
export LC_ALL="C.UTF-8"
export LANG="C.UTF-8"
export LANGUAGE="C.UTF-8"

# Force a known path; this fixes problems on Debian where `su` from
# non-root may not adjust `$PATH` to root's.
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Check for a supported OS release.
if [ -f /etc/os-release ]; then
    os_info="$(
        . /etc/os-release
        printf '%s\n' "$ID" "$ID_LIKE" "$VERSION_ID" "$VERSION_CODENAME"
    )"
    {
        read -r os_id
        read -r os_id_like
        read -r os_version_id
        read -r os_version_codename || true
    } <<<"$os_info"
    case " $os_id $os_id_like " in
        *' debian '*)
            package_system="apt"
            ;;
        *' rhel '*)
            package_system="yum"
            ;;
    esac
fi

if ! "$ZULIP_PATH/scripts/lib/supported-os"; then
    system_requirements_failure <<EOF
Unsupported OS release: $os_id $os_version_id

Zulip in production is supported only on:
 - Debian 12
 - Debian 13
 - Ubuntu 22.04 LTS
 - Ubuntu 24.04 LTS
EOF
fi

machine="$(uname -m)"
if [ "$machine" != x86_64 ] && [ "$machine" != aarch64 ]; then
    system_requirements_failure <<EOF
Unsupported CPU architecture: $machine (expected x86_64 or aarch64).
EOF
fi

dpkg_architecture="$(dpkg --print-architecture)"
if [ "$dpkg_architecture" != amd64 ] && [ "$dpkg_architecture" != arm64 ]; then
    system_requirements_failure <<EOF
Unsupported OS architecture: $dpkg_architecture (expected amd64 or arm64).
EOF
fi

has_universe() {
    apt-cache policy \
        | grep -q "^     release v=$os_version_id,o=Ubuntu,a=$os_version_codename,n=$os_version_codename,l=Ubuntu,c=universe"
}

if [ "$os_id" = ubuntu ] && ! has_universe && ! { apt-get update && has_universe; }; then
    system_requirements_failure <<EOF
You must enable the Ubuntu Universe repository before installing
Zulip.  You can do this with:

    sudo add-apt-repository universe
    sudo apt update
EOF
fi

case ",$PUPPET_CLASSES," in
    *,zulip::profile::standalone,* | *,zulip::profile::postgresql,*)
        if [ "$package_system" = apt ]; then
            # We're going to install PostgreSQL from the PostgreSQL apt
            # repository; this may conflict with the existing PostgreSQL.
            OTHER_PG="$(dpkg --get-selections \
                | grep -E '^postgresql-[0-9]+\s+install$' \
                | grep -v "^postgresql-$POSTGRESQL_VERSION\b" \
                | cut -f 1)" || true
            if [ -n "$OTHER_PG" ]; then
                INDENTED="${OTHER_PG//$'\n'/$'\n'    }"
                SPACED="${OTHER_PG//$'\n'/ }"
                cat <<EOF

The following PostgreSQL servers were found to already be installed:

    $INDENTED

Zulip needs to install PostgreSQL $POSTGRESQL_VERSION, but does not wish
to uninstall existing databases in order to do so.  Remove all other
PostgreSQL servers manually before running the installer:

    sudo apt-get remove $SPACED

EOF
                exit 1
            fi
        fi
        ;;
esac

# Check for at least ~1.86GB of RAM before starting installation;
# otherwise users will find out about insufficient RAM via weird
# errors like a segfault running `pip install`.
# Additionally, some AWS images that are advertised to be 2 GB
# are actually 1880000B in size.
mem_kb=$(head -n1 /proc/meminfo | awk '{print $2}')
if [ "$mem_kb" -lt 1860000 ]; then
    set +x
    echo -e '\033[0;31m' >&2
    echo "Insufficient RAM.  Zulip requires at least 2GB of RAM." >&2
    echo >&2
    echo -e '\033[0m' >&2
    exit 1
fi

# Anything under 5GB, we recommended allocating 2GB of swap.  Error
# out if there's no swap.
swap_kb=$(grep SwapTotal /proc/meminfo | awk '{print $2}')
if [ "$mem_kb" -lt 5000000 ] && [ "$swap_kb" -eq 0 ]; then
    set +x
    echo -e '\033[0;31m' >&2
    echo "No swap allocated; when running with < 5GB of RAM, we recommend at least 2GB of swap." >&2
    echo "https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-22-04" >&2
    echo >&2
    echo -e '\033[0m' >&2
    exit 1
fi

# Do package update, e.g. do `apt-get update` on Debian
if [ "$package_system" = apt ]; then
    # setup-apt-repo does an `apt-get update`
    "$ZULIP_PATH"/scripts/lib/setup-apt-repo
elif [ "$package_system" = yum ]; then
    "$ZULIP_PATH"/scripts/lib/setup-yum-repo
fi

# Check early for missing SSL certificates
if [ "$PUPPET_CLASSES" = "zulip::profile::standalone" ] && [ -z "$USE_CERTBOT""$SELF_SIGNED_CERT" ] && { ! [ -e "/etc/ssl/private/zulip.key" ] || ! [ -e "/etc/ssl/certs/zulip.combined-chain.crt" ]; }; then
    set +x
    cat <<EOF

No SSL certificate found.  One or both required files is missing:
    /etc/ssl/private/zulip.key
    /etc/ssl/certs/zulip.combined-chain.crt

Suggested solutions:
 * For most sites, the --certbot option is recommended.
 * If you have your own key and cert, see docs linked below
   for how to install them.
 * For non-production testing, try the --self-signed-cert option.

For help and more details, see our SSL documentation:
  https://zulip.readthedocs.io/en/latest/production/ssl-certificates.html

Once fixed, just rerun scripts/setup/install; it'll pick up from here!

EOF
    exit 1
fi

# don't run dist-upgrade in one click apps to make the
# installation process more seamless.
if [ -z "$NO_DIST_UPGRADE" ]; then
    if [ "$package_system" = apt ]; then
        apt-get -y dist-upgrade "${APT_OPTIONS[@]}"
    elif [ "$package_system" = yum ]; then
        # On CentOS, there is no need to do `yum -y upgrade` because `yum -y
        # update` already does the same thing.
        :
    fi
fi

if [ "$package_system" = apt ]; then
    # Note that any additions to these lists must also be added to
    # `zulip::profile::base` such that the new dependency is seen by
    # upgrades, as well as new installs.
    if ! apt-get install -y --no-install-recommends \
        python3 python3-yaml puppet git curl jq crudini \
        "${ADDITIONAL_PACKAGES[@]}"; then
        set +x
        echo -e '\033[0;31m' >&2
        echo "Installing packages failed; is network working and (on Ubuntu) the universe repository enabled?" >&2
        echo >&2
        echo -e '\033[0m' >&2
        exit 1
    fi
elif [ "$package_system" = yum ]; then
    if ! yum install -y \
        python3 python3-pyyaml puppet git curl jq crudini \
        "${ADDITIONAL_PACKAGES[@]}"; then
        set +x
        echo -e '\033[0;31m' >&2
        echo "Installing packages failed; is network working?" >&2
        echo >&2
        echo -e '\033[0m' >&2
        exit 1
    fi
fi

# We generate a self-signed cert even with certbot, so we can use the
# webroot authenticator, which requires nginx be set up with a
# certificate.
if [ -n "$SELF_SIGNED_CERT" ] || [ -n "$USE_CERTBOT" ]; then
    "$ZULIP_PATH"/scripts/setup/generate-self-signed-cert \
        --exists-ok "${EXTERNAL_HOST:-$(hostname)}"
fi

# Generate /etc/zulip/zulip.conf .
mkdir -p /etc/zulip
has_class() {
    grep -qx "$1" /var/lib/puppet/classes.txt
}

# puppet apply --noop fails unless the user that it _would_ chown
# files to exists; https://tickets.puppetlabs.com/browse/PUP-3907
#
# The home directory here should match what's declared in base.pp.
id -u zulip &>/dev/null || useradd -m zulip --home-dir /home/zulip
if [ -n "$NO_OVERWRITE_SETTINGS" ] && [ -e "/etc/zulip/zulip.conf" ]; then
    "$ZULIP_PATH"/scripts/zulip-puppet-apply --noop \
        --write-catalog-summary \
        --classfile=/var/lib/puppet/classes.txt
else
    # Write out more than we need, and remove sections that are not
    # applicable to the classes that are actually necessary.
    cat <<EOF >/etc/zulip/zulip.conf
[machine]
puppet_classes = $PUPPET_CLASSES
deploy_type = production

[postgresql]
version = $POSTGRESQL_VERSION
EOF

    "$ZULIP_PATH"/scripts/zulip-puppet-apply --noop \
        --write-catalog-summary \
        --classfile=/var/lib/puppet/classes.txt

    # We only need the PostgreSQL version setting on database hosts,
    # or hosts which talk directly to the database (e.g. application
    # hosts); but we don't know if this is a database host until we
    # have the catalog summary.
    if (! has_class "zulip::postgresql_common" && ! has_class "zulip::postgresql_client") || [ "$package_system" != apt ]; then
        crudini --del /etc/zulip/zulip.conf postgresql
    fi

    if [ -n "$POSTGRESQL_DATABASE_NAME" ]; then
        crudini --set /etc/zulip/zulip.conf postgresql database_name "$POSTGRESQL_DATABASE_NAME"
    fi

    if [ -n "$POSTGRESQL_DATABASE_USER" ]; then
        crudini --set /etc/zulip/zulip.conf postgresql database_user "$POSTGRESQL_DATABASE_USER"
    fi
fi

if has_class "zulip::app_frontend_base"; then
    # Frontend deploys use /home/zulip/deployments; without this, the
    # install directory is also only readable by root.
    mkdir -p /home/zulip/deployments
    deploy_path=$("$ZULIP_PATH"/scripts/lib/zulip_tools.py make_deploy_path)
    mv "$ZULIP_PATH" "$deploy_path"
    ln -nsf /home/zulip/deployments/next "$ZULIP_PATH"
    ln -nsf "$deploy_path" /home/zulip/deployments/next

    # Create and activate a virtualenv
    "$deploy_path"/scripts/lib/create-production-venv "$deploy_path"

    "$deploy_path"/scripts/lib/install-node

    if [ -z "$NO_OVERWRITE_SETTINGS" ] || ! [ -e "/etc/zulip/settings.py" ]; then
        cp -a "$deploy_path"/zproject/prod_settings_template.py /etc/zulip/settings.py
        if [ -n "$EXTERNAL_HOST" ]; then
            sed -i "s/^EXTERNAL_HOST =.*/EXTERNAL_HOST = '$EXTERNAL_HOST'/" /etc/zulip/settings.py
        fi
        if [ -n "$ZULIP_ADMINISTRATOR" ]; then
            sed -i "s/^ZULIP_ADMINISTRATOR =.*/ZULIP_ADMINISTRATOR = '$ZULIP_ADMINISTRATOR'/" /etc/zulip/settings.py
        fi

        # Set SERVICE settings based on what the user provided.
        if grep -q -E "^#?\s*ZULIP_SERVICE_PUSH_NOTIFICATIONS = " /etc/zulip/settings.py; then
            sed -i -E "s/^#?\s*ZULIP_SERVICE_PUSH_NOTIFICATIONS = .*/ZULIP_SERVICE_PUSH_NOTIFICATIONS = $SERVICE_MOBILE_PUSH/" /etc/zulip/settings.py
        else
            echo "ZULIP_SERVICE_PUSH_NOTIFICATIONS = $SERVICE_MOBILE_PUSH" >>/etc/zulip/settings.py
        fi

        if grep -q -E "^#?\s*ZULIP_SERVICE_SUBMIT_USAGE_STATISTICS = " /etc/zulip/settings.py; then
            sed -i -E "s/^#?\s*ZULIP_SERVICE_SUBMIT_USAGE_STATISTICS = .*/ZULIP_SERVICE_SUBMIT_USAGE_STATISTICS = $SERVICE_SUBMIT_USAGE_STATISTICS/" /etc/zulip/settings.py
        else
            echo "ZULIP_SERVICE_SUBMIT_USAGE_STATISTICS = $SERVICE_SUBMIT_USAGE_STATISTICS" >>/etc/zulip/settings.py
        fi
    fi
    ln -nsf /etc/zulip/settings.py "$deploy_path"/zproject/prod_settings.py
    "$deploy_path"/scripts/setup/generate_secrets.py --production
else
    deploy_path="$ZULIP_PATH"
fi

"$deploy_path"/scripts/zulip-puppet-apply -f

if [ "$package_system" = apt ]; then
    apt-get -y --with-new-pkgs upgrade
elif [ "$package_system" = yum ]; then
    # No action is required because `yum update` already does upgrade.
    :
fi

if [ -n "$USE_CERTBOT" ]; then
    "$deploy_path"/scripts/setup/setup-certbot \
        "$EXTERNAL_HOST" --email "$ZULIP_ADMINISTRATOR"
fi

if has_class "zulip::nginx" && ! has_class "zulip::profile::docker"; then
    # Check nginx was configured properly now that we've installed it.
    # Most common failure mode is certs not having been installed.
    if ! nginx -t; then
        (
            set +x
            cat <<EOF

Verifying the Zulip nginx configuration failed!

This is almost always a problem with your SSL certificates.  See:
  https://zulip.readthedocs.io/en/latest/production/ssl-certificates.html

Once fixed, just rerun scripts/setup/install; it'll pick up from here!

EOF
            exit 1
        )
    fi
fi

if has_class "zulip::profile::rabbitmq"; then
    if ! rabbitmqctl status >/dev/null; then
        set +x
        cat <<EOF

RabbitMQ seems to not have started properly after the installation process.
Often this is caused by misconfigured /etc/hosts in virtualized environments.
For more information, see:
  https://github.com/zulip/zulip/issues/53#issuecomment-143805121

EOF
        exit 1
    fi
fi

# Set up a basic .gitconfig for the 'zulip' user
if [ -n "$ZULIP_ADMINISTRATOR" ]; then
    (
        cd / # Make sure the current working directory is readable by zulip
        su zulip -c "git config --global user.email $ZULIP_ADMINISTRATOR"
        su zulip -c "git config --global user.name 'Zulip Server ($EXTERNAL_HOST)'"
    )
fi

if ! has_class "zulip::app_frontend_base"; then
    set +x
    cat <<EOF

Success!

Not configuring PostgreSQL, or /home/zulip/deployments, because this
is not a front-end install.

EOF
    exit 0
fi

ln -nsf "$deploy_path" /home/zulip/deployments/current
ln -nsf /etc/zulip/settings.py "$deploy_path"/zproject/prod_settings.py
mkdir -p "$deploy_path"/prod-static/serve
cp -rT "$deploy_path"/prod-static/serve /home/zulip/prod-static
chown -R zulip:zulip /home/zulip /var/log/zulip /etc/zulip/settings.py

if ! [ -e /home/zulip/deployments/current/zulip-git-version ]; then
    mkdir /srv/zulip.git
    chown zulip:zulip /srv/zulip.git
    su zulip -c 'git clone --bare --mirror /home/zulip/deployments/current /srv/zulip.git'
    su zulip -c 'cd /home/zulip/deployments/current && ./scripts/lib/update-git-upstream && ./tools/cache-zulip-git-version'
fi

if ! [ -e "/home/zulip/prod-static/generated" ]; then
    # If we're installing from a Git checkout, we need to run
    # `tools/update-prod-static` in order to build the static
    # assets.
    su zulip -c '/home/zulip/deployments/current/tools/update-prod-static'
fi

if [ -n "$NO_INIT_DB" ]; then
    set +x
    cat <<EOF

Success!

Stopping because --no-init-db was passed.  To complete the
installation, configure PostgreSQL by creating the database and
database user, and then run:

   su zulip -c '/home/zulip/deployments/current/scripts/setup/initialize-database'
   su zulip -c '/home/zulip/deployments/current/manage.py generate_realm_creation_link'
EOF

    if [ -n "$PUSH_NOTIFICATIONS" ]; then
        echo
        echo "Since you specified you want to enable the push notification service, you'll also need to "
        echo "manually register your server by running:"
        echo
        echo "   su zulip -c '/home/zulip/deployments/current/manage.py register_server'"
        echo
    fi
    exit 0
else
    /home/zulip/deployments/current/scripts/setup/create-database
    su zulip -c '/home/zulip/deployments/current/scripts/setup/initialize-database --quiet'

    if [ -n "$PUSH_NOTIFICATIONS" ]; then
        if [ -z "$PUSH_NOTIFICATIONS_SERVICE_TOS_AGREED" ]; then
            # This should be impossible as the installation should have aborted early if the user
            # passed --push-notifications without accepting the ToS. But we include this as a precaution
            # to not allow future bugs to cause ToS acceptance to be skipped.
            SKIP_TOS_AGREEMENT_OPTION=""
        else
            SKIP_TOS_AGREEMENT_OPTION="--agree-to-terms-of-service"
        fi
        set +x
        echo "Services enabled, attempting to register server..."
        set -x

        # Without PYTHONUNBUFFERED=1, stdout/stderr might end up displayed not in chronological order, resulting
        # in confusing output to the user.
        su zulip -c "PYTHONUNBUFFERED=1 /home/zulip/deployments/current/manage.py register_server ${SKIP_TOS_AGREEMENT_OPTION}" \
            || {
                set +x
                echo
                echo "WARNING: Server registration for push notifications failed."
                echo "This does not affect the rest of your Zulip installation."
                echo
                echo "To enable push notifications after resolving the issue, run:"
                echo "  su zulip -c '/home/zulip/deployments/current/manage.py register_server'"
                echo
                set -x
            }
    fi

    su zulip -c '/home/zulip/deployments/current/manage.py generate_realm_creation_link'
fi
```

--------------------------------------------------------------------------------

---[FILE: install-node]---
Location: zulip-main/scripts/lib/install-node

```text
#!/usr/bin/env bash
set -euo pipefail

version=24.11.1
arch="$(uname -m)"

case $arch in
    x86_64)
        tarball="node-v$version-linux-x64.tar.xz"
        sha256=60e3b0a8500819514aca603487c254298cd776de0698d3cd08f11dba5b8289a8
        ;;

    aarch64)
        tarball="node-v$version-linux-arm64.tar.xz"
        sha256=6b0863fb9f627bf4a6c5948dce1de4398174a2e05dbe717503d828e211ca01f0
        ;;
esac

check_version() {
    out="$(node --version)" && [ "$out" = "v$version" ] \
        && [ /usr/local/bin/pnpm -ef /srv/zulip-node/lib/node_modules/corepack/dist/pnpm.js ]
}

if ! check_version 2>/dev/null; then
    set -x
    tmpdir="$(mktemp -d)"
    trap 'rm -r "$tmpdir"' EXIT
    cd "$tmpdir"
    curl -fLO --retry 3 "https://nodejs.org/dist/v$version/$tarball"
    sha256sum -c <<<"$sha256 $tarball"
    rm -rf /srv/zulip-node
    mkdir -p /srv/zulip-node
    tar -xJf "$tarball" --no-same-owner --strip-components=1 -C /srv/zulip-node
    ln -sf /srv/zulip-node/bin/{corepack,node,npm,npx} /usr/local/bin
    COREPACK_DEFAULT_TO_LATEST=0 /usr/local/bin/corepack enable

    # Clean up after previous versions of this script
    rm -rf /srv/zulip-yarn /usr/bin/yarn /usr/local/nvm

    check_version
fi
```

--------------------------------------------------------------------------------

---[FILE: install-uv]---
Location: zulip-main/scripts/lib/install-uv

```text
#!/usr/bin/env bash
set -eu

version=0.9.12
arch="$(uname -m)"
tarball="uv-$arch-unknown-linux-gnu.tar.gz"
declare -A sha256=(
    [aarch64]=3c4dd18c1db6bd1af3b84ea3b3cc34dd9d8b955d3e700d1e1e4a18249decbe69
    [x86_64]=4e43dac0c82b12b66564d91d5649350377b771d1df84374d9be1b9e6c8dd8152
)

check_version() {
    out="$(uv --version)" && [ "$out" = "uv $version" ]
}

if ! check_version 2>/dev/null; then
    set -x
    tmpdir="$(mktemp -d)"
    trap 'rm -r "$tmpdir"' EXIT
    cd "$tmpdir"
    curl -fLO --retry 3 "https://github.com/astral-sh/uv/releases/download/$version/$tarball"
    sha256sum -c <<<"${sha256[$arch]} $tarball"
    tar -xzf "$tarball" --no-same-owner --strip-components=1 -C /usr/local/bin "uv-$arch-unknown-linux-gnu"/{uv,uvx}
    check_version
fi
```

--------------------------------------------------------------------------------

---[FILE: node_cache.py]---
Location: zulip-main/scripts/lib/node_cache.py

```python
import os

from scripts.lib.zulip_tools import run

DEFAULT_PRODUCTION = False


def setup_node_modules(production: bool = DEFAULT_PRODUCTION) -> None:
    if os.path.islink("node_modules"):
        os.unlink("node_modules")

    skip = False

    try:
        with open("node_modules/.pnpm/lock.yaml") as a, open("pnpm-lock.yaml") as b:
            if a.read() == b.read():
                skip = True
    except FileNotFoundError:
        pass

    # We need this check when switching between branches without `starlight_help`
    # package. `node_modules` will be removed when working on a non `starlight_help`
    # branch, but if `node_modules/.pnpm/lock.yaml` has not been updated by that
    # branch, we will end up in a situation where we might not have `node_modules`
    # even when we run the provision command.
    if not os.path.exists("starlight_help/node_modules"):
        skip = False

    if not skip:
        run(
            [
                "/usr/local/bin/corepack",
                "pnpm",
                "install",
                "--frozen-lockfile",
                "--prefer-offline",
                *(["--prod"] if production else []),
            ],
        )
```

--------------------------------------------------------------------------------

---[FILE: puppet_cache.py]---
Location: zulip-main/scripts/lib/puppet_cache.py

```python
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
from urllib.request import urlopen

import yaml

from .zulip_tools import run

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ZULIP_SRV_PATH = "/srv"

PUPPET_MODULES_CACHE_PATH = os.path.join(ZULIP_SRV_PATH, "zulip-puppet-cache")
PUPPET_DEPS_FILE_PATH = os.path.join(ZULIP_PATH, "puppet/deps.yaml")
PUPPET_THIRDPARTY = os.path.join(PUPPET_MODULES_CACHE_PATH, "current")


def generate_sha1sum_puppet_modules() -> str:
    data = {}
    with open(PUPPET_DEPS_FILE_PATH) as fb:
        data["deps.yaml"] = fb.read().strip()
    data["puppet-version"] = subprocess.check_output(
        # This is 10x faster than `puppet --version`
        ["ruby", "-r", "puppet/version", "-e", "puts Puppet.version"],
        text=True,
    ).strip()

    sha1sum = hashlib.sha1()
    sha1sum.update(json.dumps(data, sort_keys=True).encode())
    return sha1sum.hexdigest()


def setup_puppet_modules() -> None:
    sha1sum = generate_sha1sum_puppet_modules()
    target_path = os.path.join(PUPPET_MODULES_CACHE_PATH, sha1sum)
    success_stamp = os.path.join(target_path, ".success-stamp")
    # Check if a cached version already exists
    if not os.path.exists(success_stamp):
        do_puppet_module_install(target_path, success_stamp)

    if os.path.islink(PUPPET_THIRDPARTY):
        os.remove(PUPPET_THIRDPARTY)
    elif os.path.isdir(PUPPET_THIRDPARTY):
        shutil.rmtree(PUPPET_THIRDPARTY)
    os.symlink(target_path, PUPPET_THIRDPARTY)


def do_puppet_module_install(
    target_path: str,
    success_stamp: str,
) -> None:
    os.makedirs(target_path, exist_ok=True)
    with open(PUPPET_DEPS_FILE_PATH) as yaml_file:
        deps = yaml.safe_load(yaml_file)
    for module, metadata in deps.items():
        install_puppet_module(target_path, module, metadata["version"], metadata["sha256sum"])
    with open(success_stamp, "w"):
        pass


def install_puppet_module(
    target_path: str, module: str, version: str, expected_sha256sum: str
) -> None:
    with urlopen(f"https://forgeapi.puppet.com/v3/releases/{module}-{version}") as forge_resp:
        forge_data = json.load(forge_resp)

    forge_sha256sum = forge_data["file_sha256"]
    if forge_sha256sum != expected_sha256sum:
        raise Exception(
            f"Forge API returned unexpected SHA256 sum for {module}-{version}: "
            f"expected {expected_sha256sum}, got {forge_sha256sum}"
        )

    with tempfile.NamedTemporaryFile(
        prefix=f"zulip-puppet-{module}-{version}-",
        suffix=".tar.gz",
    ) as tarball:
        with urlopen("https://forgeapi.puppet.com" + forge_data["file_uri"]) as tarball_resp:
            tarball_content = tarball_resp.read()
            local_sha256sum = hashlib.sha256(tarball_content).hexdigest()
            if local_sha256sum != expected_sha256sum:
                raise Exception(
                    f"Downloaded file had unexpected SHA256 sum for {module}-{version}: "
                    f"expected {expected_sha256sum}, got {forge_sha256sum}"
                )
            tarball.write(tarball_content)
            tarball.flush()

        run(
            [
                "puppet",
                "module",
                "--modulepath",
                target_path,
                "install",
                tarball.name,
                "--ignore-dependencies",
            ],
        )
```

--------------------------------------------------------------------------------

---[FILE: queue_workers.py]---
Location: zulip-main/scripts/lib/queue_workers.py
Signals: Django

```python
#!/usr/bin/env python3
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)
from scripts.lib.setup_path import setup_path

setup_path()

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"

import django

django.setup()
from zerver.worker.queue_processors import get_active_worker_queues

if __name__ == "__main__":
    for worker in sorted(get_active_worker_queues()):
        print(worker)
```

--------------------------------------------------------------------------------

---[FILE: run_hooks.py]---
Location: zulip-main/scripts/lib/run_hooks.py

```python
#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from scripts.lib.zulip_tools import (
    DEPLOYMENTS_DIR,
    assert_running_as_root,
    get_deploy_root,
    get_zulip_pwent,
    parse_version_from,
    su_to_zulip,
)

assert_running_as_root()

# Updates to the below choices to add a new hook type should
# adjust puppet's `app_frontend_base.pp` as well.
parser = argparse.ArgumentParser()
parser.add_argument("kind", choices=["pre-deploy", "post-deploy"], help="")
parser.add_argument("--from-git", action="store_true", help="Upgrading from git")
args = parser.parse_args()

from version import ZULIP_MERGE_BASE as NEW_ZULIP_MERGE_BASE
from version import ZULIP_VERSION as NEW_ZULIP_VERSION

deploy_path = get_deploy_root()

if args.kind == "post-deploy":
    old_dir_name = "last"
    if not os.path.exists(DEPLOYMENTS_DIR + "/last"):
        # Fresh installs which are doing an OS upgrade don't have a
        # "last" yet
        old_dir_name = "current"
else:
    old_dir_name = "current"
old_version = parse_version_from(DEPLOYMENTS_DIR + "/" + old_dir_name)
old_merge_base = parse_version_from(DEPLOYMENTS_DIR + "/" + old_dir_name, merge_base=True)

path = f"/etc/zulip/hooks/{args.kind}.d"
if not os.path.exists(path):
    sys.exit(0)

# Pass in, via environment variables, the old/new "version
# string" (which is a `git describe` output)
env = os.environ.copy()
env["ZULIP_OLD_VERSION"] = old_version
env["ZULIP_NEW_VERSION"] = NEW_ZULIP_VERSION

# preexec_fn=su_to_zulip normally handles this, but our explicit
# env overrides that
env["HOME"] = get_zulip_pwent().pw_dir


def resolve_version_string(version: str) -> str:
    return subprocess.check_output(
        ["git", "rev-parse", version], cwd=deploy_path, preexec_fn=su_to_zulip, text=True
    ).strip()


if args.from_git:
    # If we have a git repo, we also resolve those `git describe`
    # values to full commit hashes, as well as provide the
    # merge-base of the old/new commits with mainline.
    env["ZULIP_OLD_COMMIT"] = resolve_version_string(old_version)
    env["ZULIP_NEW_COMMIT"] = resolve_version_string(NEW_ZULIP_VERSION)
    env["ZULIP_OLD_MERGE_BASE_COMMIT"] = resolve_version_string(old_merge_base)
    env["ZULIP_NEW_MERGE_BASE_COMMIT"] = resolve_version_string(NEW_ZULIP_MERGE_BASE)

failures = []
for script_name in sorted(f for f in os.listdir(path) if f.endswith(".hook")):
    result = subprocess.run(
        [os.path.join(path, script_name)],
        check=False,
        cwd=deploy_path,
        preexec_fn=su_to_zulip,
        env=env,
    )
    if result.returncode != 0:
        # Pre-deploy hooks abort on the first failure; post-deploy
        # hooks are best-effort and a failure of one does not abort
        # the rest of them.
        if args.kind == "pre-deploy":
            sys.exit(1)
        failures.append(script_name)

if failures:
    print("Failed hooks:")
    for failed_script in failures:
        print(f"  {failed_script}")
```

--------------------------------------------------------------------------------

````

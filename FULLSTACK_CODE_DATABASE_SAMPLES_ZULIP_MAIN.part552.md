---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 552
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 552 of 1290)

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

---[FILE: create.py]---
Location: zulip-main/tools/droplets/create.py

```python
# Creates a Zulip remote development environment droplet or
# a production droplet in DigitalOcean.
#
# Particularly useful for sprints/hackathons, interns, and other
# situation where one wants to quickly onboard new contributors.
#
# Requires python-digitalocean library:
# https://github.com/koalalorenzo/python-digitalocean
#
# Also requires DigitalOcean team membership for Zulip and API token:
# https://cloud.digitalocean.com/settings/api/tokens
#
# Copy conf.ini-template to conf.ini and populate with your API token.
import argparse
import configparser
import json
import os
import secrets
import sys
import time
import urllib.error
import urllib.request
from typing import Any

import digitalocean
import requests

parser = argparse.ArgumentParser(description="Create a Zulip development VM DigitalOcean droplet.")
parser.add_argument(
    "username", help="GitHub username for whom you want to create a Zulip dev droplet"
)
parser.add_argument("--tags", nargs="+", default=[])
parser.add_argument("-f", "--recreate", action="store_true")
parser.add_argument("-s", "--subdomain")
parser.add_argument("-p", "--production", action="store_true")
parser.add_argument("-r", "--region", choices=("nyc3", "sfo3", "blr1", "fra1"), default="nyc3")


def get_config() -> configparser.ConfigParser:
    config = configparser.ConfigParser()
    config.read(os.path.join(os.path.dirname(os.path.abspath(__file__)), "conf.ini"))
    return config


def assert_github_user_exists(github_username: str) -> bool:
    print(f"Checking to see if GitHub user {github_username} exists...")
    user_api_url = f"https://api.github.com/users/{github_username}"
    try:
        response = urllib.request.urlopen(user_api_url)
        json.load(response)
        print("...user exists!")
        return True
    except urllib.error.HTTPError as err:
        print(err)
        print(f"Does the GitHub user {github_username} exist?")
        sys.exit(1)


def get_ssh_public_keys_from_github(github_username: str) -> list[dict[str, Any]]:
    print("Checking to see that GitHub user has available public keys...")
    apiurl_keys = f"https://api.github.com/users/{github_username}/keys"
    try:
        response = urllib.request.urlopen(apiurl_keys)
        userkeys = json.load(response)
        if not userkeys:
            print(
                f"No keys found. Has user {github_username} added SSH keys to their GitHub account?"
            )
            sys.exit(1)
        print("...public keys found!")
        return userkeys
    except urllib.error.HTTPError as err:
        print(err)
        print(f"Has user {github_username} added SSH keys to their GitHub account?")
        sys.exit(1)


def assert_user_forked_zulip_server_repo(username: str) -> bool:
    print("Checking to see GitHub user has forked zulip/zulip...")
    apiurl_fork = f"https://api.github.com/repos/{username}/zulip"
    try:
        response = urllib.request.urlopen(apiurl_fork)
        json.load(response)
        print("...fork found!")
        return True
    except urllib.error.HTTPError as err:
        print(err)
        print(f"Has user {username} forked zulip/zulip?")
        sys.exit(1)


def assert_droplet_does_not_exist(my_token: str, droplet_name: str, recreate: bool) -> None:
    print(f"Checking to see if droplet {droplet_name} already exists...")
    manager = digitalocean.Manager(token=my_token)
    my_droplets = manager.get_all_droplets()
    for droplet in my_droplets:
        if droplet.name.lower() == droplet_name:
            if not recreate:
                print(
                    f"Droplet {droplet_name} already exists. Pass --recreate if you "
                    "need to recreate the droplet."
                )
                sys.exit(1)
            else:
                print(f"Deleting existing droplet {droplet_name}.")
                droplet.destroy()
                return
    print("...No droplet found...proceeding.")


def get_ssh_keys_string_from_github_ssh_key_dicts(userkey_dicts: list[dict[str, Any]]) -> str:
    return "\n".join(userkey_dict["key"] for userkey_dict in userkey_dicts)


def generate_dev_droplet_user_data(
    username: str, subdomain: str, userkey_dicts: list[dict[str, Any]]
) -> str:
    ssh_keys_string = get_ssh_keys_string_from_github_ssh_key_dicts(userkey_dicts)
    setup_root_ssh_keys = f"printf '{ssh_keys_string}' > /root/.ssh/authorized_keys"
    setup_zulipdev_ssh_keys = f"printf '{ssh_keys_string}' > /home/zulipdev/.ssh/authorized_keys"

    # We pass the hostname as username.zulipdev.org to the DigitalOcean API.
    # But some droplets (eg on 18.04) are created with with hostname set to just username.
    # So we fix the hostname using cloud-init.
    hostname_setup = f"hostnamectl set-hostname {subdomain}.zulipdev.org"

    setup_repo = (
        "cd /home/zulipdev/{1} && "
        "git remote add origin https://github.com/{0}/{1}.git && "
        "git fetch origin && "
        "git clean -f"
    )

    server_repo_setup = setup_repo.format(username, "zulip")
    python_api_repo_setup = setup_repo.format(username, "python-zulip-api")

    erlang_cookie = secrets.token_hex(16)
    setup_erlang_cookie = (
        f"echo '{erlang_cookie}' > /var/lib/rabbitmq/.erlang.cookie && "
        "chown rabbitmq:rabbitmq /var/lib/rabbitmq/.erlang.cookie && "
        "service rabbitmq-server restart"
    )

    cloudconf = f"""\
#!/bin/bash

{setup_zulipdev_ssh_keys}
{setup_root_ssh_keys}
{setup_erlang_cookie}
sed -i "s/PasswordAuthentication yes/PasswordAuthentication no/g" /etc/ssh/sshd_config
service ssh restart
{hostname_setup}
su -c '{server_repo_setup}' zulipdev
su -c '{python_api_repo_setup}' zulipdev
su -c 'git config --global core.editor nano' zulipdev
su -c 'git config --global pull.rebase true' zulipdev
"""
    print("...returning cloud-config data.")
    return cloudconf


def generate_prod_droplet_user_data(username: str, userkey_dicts: list[dict[str, Any]]) -> str:
    ssh_keys_string = get_ssh_keys_string_from_github_ssh_key_dicts(userkey_dicts)
    setup_root_ssh_keys = f"printf '{ssh_keys_string}' > /root/.ssh/authorized_keys"

    cloudconf = f"""\
#!/bin/bash

{setup_root_ssh_keys}
passwd -d root
sed -i "s/PasswordAuthentication yes/PasswordAuthentication no/g" /etc/ssh/sshd_config
service ssh restart
"""
    print("...returning cloud-config data.")
    return cloudconf


def create_droplet(
    my_token: str,
    template_id: str,
    name: str,
    tags: list[str],
    user_data: str,
    region: str = "nyc3",
) -> tuple[str, str]:
    droplet = digitalocean.Droplet(
        token=my_token,
        name=name,
        region=region,
        image=template_id,
        size_slug="s-2vcpu-4gb",
        user_data=user_data,
        tags=tags,
        backups=False,
        ipv6=True,
    )

    print("Initiating droplet creation...")
    droplet.create()

    incomplete = True
    while incomplete:
        actions = droplet.get_actions()
        for action in actions:
            action.load()
            print(f"...[{action.type}]: {action.status}")
            if action.type == "create" and action.status == "completed":
                incomplete = False
                break
        if incomplete:
            time.sleep(15)
    print("...droplet created!")
    droplet.load()
    print(f"...ip address for new droplet is: {droplet.ip_address}.")
    return (droplet.ip_address, droplet.ip_v6_address)


def delete_existing_records(records: list[digitalocean.Record], record_name: str) -> None:
    count = 0
    for record in records:
        if (
            record.name == record_name
            and record.domain == "zulipdev.org"
            and record.type in ("AAAA", "A")
        ):
            record.destroy()
            count += 1
    if count:
        print(f"Deleted {count} existing A / AAAA records for {record_name}.zulipdev.org.")


def create_dns_record(my_token: str, record_name: str, ipv4: str, ipv6: str) -> None:
    domain = digitalocean.Domain(token=my_token, name="zulipdev.org")
    domain.load()
    records = domain.get_records()

    delete_existing_records(records, record_name)
    wildcard_name = "*." + record_name
    delete_existing_records(records, wildcard_name)

    print(f"Creating new A record for {record_name}.zulipdev.org that points to {ipv4}.")
    domain.create_new_domain_record(type="A", name=record_name, data=ipv4)
    print(f"Creating new A record for *.{record_name}.zulipdev.org that points to {ipv4}.")
    domain.create_new_domain_record(type="A", name=wildcard_name, data=ipv4)

    print(f"Creating new AAAA record for {record_name}.zulipdev.org that points to {ipv6}.")
    domain.create_new_domain_record(type="AAAA", name=record_name, data=ipv6)
    print(f"Creating new AAAA record for *.{record_name}.zulipdev.org that points to {ipv6}.")
    domain.create_new_domain_record(type="AAAA", name=wildcard_name, data=ipv6)


def print_dev_droplet_instructions(username: str, droplet_domain_name: str) -> None:
    print(
        f"""
COMPLETE! Droplet for GitHub user {username} is available at {droplet_domain_name}.

Instructions for use are below. (copy and paste to the user)

------
Your remote Zulip dev server has been created!

- Connect to your server by running
  `ssh zulipdev@{droplet_domain_name}` on the command line
  (Terminal for macOS and Linux, Bash for Git on Windows).
- There is no password; your account is configured to use your SSH keys.
- Once you log in, you should see `(zulip-server) ~$`.
- To start the dev server, `cd zulip` and then run `./tools/run-dev`.
- While the dev server is running, you can see the Zulip server in your browser at
  http://{droplet_domain_name}:9991.
"""
    )

    print(
        "See [Developing remotely](https://zulip.readthedocs.io/en/latest/development/remote.html) "
        "for tips on using the remote dev instance and "
        "[Git & GitHub guide](https://zulip.readthedocs.io/en/latest/git/index.html) "
        "to learn how to use Git with Zulip.\n"
    )
    print(
        "Note that this droplet will automatically be deleted after a month of inactivity. "
        "If you are leaving Zulip for more than a few weeks, we recommend pushing all of your "
        "active branches to GitHub."
    )
    print("------")


def print_production_droplet_instructions(droplet_domain_name: str) -> None:
    print(
        f"""
-----

Production droplet created successfully!

Connect to the server by running

ssh root@{droplet_domain_name}

-----
"""
    )


def get_zulip_oneclick_app_slug(api_token: str) -> str:
    response = requests.get(
        "https://api.digitalocean.com/v2/1-clicks", headers={"Authorization": f"Bearer {api_token}"}
    ).json()
    one_clicks = response["1_clicks"]

    for one_click in one_clicks:
        if one_click["slug"].startswith("kandralabs"):
            return one_click["slug"]
    raise Exception("Unable to find Zulip One-click app slug")


if __name__ == "__main__":
    args = parser.parse_args()
    username = args.username.lower()
    if args.subdomain:
        subdomain = args.subdomain.lower()
    elif args.production:
        subdomain = f"{username}-prod"
    else:
        subdomain = username

    if args.production:
        print(f"Creating production droplet for GitHub user {username}...")
    else:
        print(f"Creating Zulip developer environment for GitHub user {username}...")

    config = get_config()
    api_token = config["digitalocean"]["api_token"]

    assert_github_user_exists(github_username=username)

    public_keys = get_ssh_public_keys_from_github(github_username=username)
    droplet_domain_name = f"{subdomain}.zulipdev.org"

    if args.production:
        template_id = get_zulip_oneclick_app_slug(api_token)
        user_data = generate_prod_droplet_user_data(username=username, userkey_dicts=public_keys)

    else:
        assert_user_forked_zulip_server_repo(username=username)
        user_data = generate_dev_droplet_user_data(
            username=username, subdomain=subdomain, userkey_dicts=public_keys
        )

        # define id of image to create new droplets from; see:
        #     curl -u <API_KEY>: "https://api.digitalocean.com/v2/snapshots | jq .
        template_id = "157280701"

    assert_droplet_does_not_exist(
        my_token=api_token, droplet_name=droplet_domain_name, recreate=args.recreate
    )

    (ipv4, ipv6) = create_droplet(
        my_token=api_token,
        template_id=template_id,
        name=droplet_domain_name,
        tags=[*args.tags, "dev"],
        user_data=user_data,
        region=args.region,
    )

    create_dns_record(my_token=api_token, record_name=subdomain, ipv4=ipv4, ipv6=ipv6)

    if args.production:
        print_production_droplet_instructions(droplet_domain_name=droplet_domain_name)
    else:
        print_dev_droplet_instructions(username=username, droplet_domain_name=droplet_domain_name)

    sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: new-droplet-image]---
Location: zulip-main/tools/droplets/new-droplet-image

```text
#!/bin/bash

set -eux

if [[ $(id -u) -eq 0 ]]; then
    # First pass through -- make the zulip user

    # Add the zulipdev user, let it sudo
    useradd -U -G sudo -m zulipdev -s /bin/bash
    echo "zulipdev ALL=(ALL) NOPASSWD:ALL" >>/etc/sudoers.d/90-cloud-init-users

    # Re-run as zulip for the remainder, which is below. We disable
    # the shellcheck because we _do_ want to read $0 as root, as it's
    # potentially not readable as zulipdev.
    # shellcheck disable=SC2024
    sudo -u zulipdev bash <"$0"

    # Clear out the authorized_keys; this is filled in when the image
    # is cloned.
    true >~/.ssh/authorized_keys

    # Clear history and reboot
    true >~/.bash_history && history -c && rm "$0" && shutdown -h now
    exit 0
fi

# This section is run as zulipdev
cd

# Set up an empty authorized_keys with the right permissions; this is
# filled in when the image is cloned.
mkdir -p .ssh
chmod 700 .ssh
true >.ssh/authorized_keys
chmod 600 .ssh/authorized_keys

(
    # Set up Zulip
    git clone https://github.com/zulip/zulip
    cd zulip
    git remote rename origin upstream

    # Provision
    ./tools/provision

    # Make sure the nodename in RabbitMQ is not host-dependent
    sudo perl -pi -e 's/#?NODENAME=.*/NODENAME=zulip\@localhost/' /etc/rabbitmq/rabbitmq-env.conf
    sudo service rabbitmq-server stop
    sudo rm -rf /var/lib/rabbitmq/mnesia/
    sudo service rabbitmq-server start

    # Re-provision for the new rabbitmq nodename
    ./tools/provision

    # Make sure it's clean
    git clean -f
)

(
    # Set up python-zulip-api
    git clone https://github.com/zulip/python-zulip-api
    cd python-zulip-api
    git remote rename origin upstream
)

# rabbitmq-server's /var/lib/rabbitmq/.erlang.cookie is a secret, and
# should not be included in the base image
sudo service rabbitmq-server stop
sudo rm /var/lib/rabbitmq/.erlang.cookie

# Clear our history
true >~/.bash_history && history -c && exit
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: zulip-main/tools/droplets/README.md

```text
# Create a remote Zulip dev server

This guide is for mentors who want to help create remote Zulip dev servers
for hackathon, GCI, or sprint participants.

The machines (droplets) have been generously provided by
[DigitalOcean](https://www.digitalocean.com/) to help Zulip contributors
get up and running as easily as possible. Thank you DigitalOcean!

The `create.py` create uses the DigitalOcean API to quickly create new virtual
machines (droplets) with the Zulip dev server already configured.

## Step 1: Join Zulip DigitalOcean team

We have created a team on DigitalOcean for Zulip mentors. Ask Rishi or Tim
to be added. You need access to the team so you can create your DigitalOcean
API token.

## Step 2: Create your DigitalOcean API token

Once you've been added to the Zulip team,
[log in](https://cloud.digitalocean.com/droplets) to the DigitalOcean control
panel and [create your personal API token][do-create-api-token]. **Make sure
you create your API token under the Zulip team.** (It should look something
like [this][image-zulip-team]).

Copy the API token and store it somewhere safe. You'll need it in the next
step.

## Step 3: Configure create.py

In `tools/droplets/` there is a sample configuration file `conf.ini-template`.

Copy this file to `conf.ini`:

```
$ cd tools/droplets/
$ cp conf.ini-template conf.ini
```

Now edit the file and replace `APITOKEN` with the personal API token you
generated earlier.

```
[digitalocean]
api_token = APITOKEN
```

Now you're ready to use the script.

## Usage

`create.py` takes two arguments

- GitHub username
- Tags (Optional argument)

```
$ python3 create.py <username>
$ python3 create.py <username> --tags <tag>
$ python3 create.py <username> --tags <tag1> <tag2> <tag3>
```

Assigning tags to droplets like `GCI` can be later useful for
listing all the droplets created during GCI.
[Tags](https://www.digitalocean.com/community/tutorials/how-to-tag-digitalocean-droplets)
may contain letters, numbers, colons, dashes, and underscores.

You'll need to run this from the Zulip development environment (e.g., in
Vagrant).

The script will also stop if a droplet has already been created for the
user. If you want to recreate a droplet for a user you can pass the
`--recreate` flag.

```
$ python3 create.py <username> --recreate
```

This will destroy the old droplet and create a new droplet for
the user.

In order for the script to work, the GitHub user must have:

- forked the [zulip/zulip][zulip-zulip] repository, and
- created an SSH key pair and added it to their GitHub account.

(Share [this link][how-to-request] with students if they need to do these
steps.)

The script will stop if it can't find the user's fork or SSH keys.

Once the droplet is created, you will see something similar to this message:

```
Your remote Zulip dev server has been created!

- Connect to your server by running
  `ssh zulipdev@<username>.zulipdev.org` on the command line
  (Terminal for macOS and Linux, Bash for Git on Windows).
- There is no password; your account is configured to use your SSH keys.
- Once you log in, you should see `(zulip-server) ~$`.
- To start the dev server, `cd zulip` and then run `./tools/run-dev`.
- While the dev server is running, you can see the Zulip server in your browser
  at http://<username>.zulipdev.org:9991.

See [Developing
remotely](https://zulip.readthedocs.io/en/latest/development/remote.html) for tips on
using the remote dev instance and [Git & GitHub
Guide](https://zulip.readthedocs.io/en/latest/git/index.html) to learn how to
use Git with Zulip.
```

Copy and paste this message to the user via Zulip chat. Be sure to CC the user
so they are notified.

[do-create-api-token]: https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2#how-to-generate-a-personal-access-token
[image-zulip-team]: http://cdn.subfictional.com/dropshare/Screen-Shot-2016-11-28-10-53-24-X86JYrrOzu.png
[zulip-zulip]: https://github.com/zulip/zulip
[python-digitalocean]: https://github.com/koalalorenzo/python-digitalocean
[how-to-request]: https://zulip.readthedocs.io/en/latest/development/request-remote.html

## Updating the base image

1. Switch to the Zulip organization.
1. Create a new droplet, with:
   - "Regular with SSD" / "2GB RAM / 1 CPU"
   - Select your SSH key; this will not be built into the image, and
     is only for access to debug if the build does not succeed.
   - Check "Monitoring", "IPv6", and "User data"
   - Paste the contents of `tools/droplets/new-droplet-image` into the
     text box which says `Enter user data here...`
   - Name it (e.g., `base-ubuntu-22-04.zulipdev.org`)
1. Wait for the host to boot.
1. Wait for the host to complete provisioning and shut down; this will take
   about 15 minutes.
1. Go to the Snapshots tab on the image, and "Take a Snapshot".
1. Wait for several minutes for it to complete.
1. "Add to region" the snapshot into `NYC3`, `SFO3`, `BLR1`, and `FRA1`.
1. `curl -u <API_KEY>: https://api.digitalocean.com/v2/snapshots | jq .`
1. Replace `template_id` in `create.py` in this directory with the
   appropriate `id`.
1. Clean up by destroying the droplet (but _leaving_ all "associated
   resources"), and removing the DNS entry for `base.zulipdev.org`
1. Open a PR with the updated `template_id`.

## Remotely debugging a droplet

To SSH into a droplet, first make sure you have a SSH key associated with your
GitHub account, then ask the student to run the following in their
VM:

```
$ python3 ~/zulip/tools/droplets/add_mentor.py <your username>
```

You should now be able to connect to it using:

```
$ ssh zulipdev@<their username>.zulipdev.org
```

They can remove your SSH keys by running:

```
$ python3 ~/zulip/tools/droplets/add_mentor.py <your username> --remove
```

# Creating a production droplet

`create.py` can also create a production droplet quickly for testing purposes.

```
$ python3 create.py <username> --production
```
```

--------------------------------------------------------------------------------

---[FILE: zulipdev]---
Location: zulip-main/tools/droplets/zulipdev

```text
server {
    listen 80;
    listen [::]:80;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /etc/ssl/certs/zulip.combined-chain.crt;
    ssl_certificate_key /etc/ssl/private/zulip.key;

    location / {
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass          http://127.0.0.1:9991;
        proxy_read_timeout  1200;

        proxy_redirect off;
        proxy_next_upstream off;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: sync-translations]---
Location: zulip-main/tools/i18n/sync-translations

```text
#!/usr/bin/env bash

# See https://zulip.readthedocs.io/en/latest/translating/internationalization.html
# for background on this subsystem.

set -e
set -x

# Check we're on `main` or `\d+\.x`
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" == "main" ]; then
    suffix=""
elif [[ "$branch" =~ ^[0-9]+\.x$ ]]; then
    suffix="-${branch/./-}"
else
    echo "Unexpected branch name: $branch"
    exit 1
fi

git fetch upstream

local_branch="update-translations-$branch"
if git rev-parse --verify --quiet "origin/$local_branch" >/dev/null; then
    echo "Remote branch origin/$local_branch already exists -- delete it before continuing"
    exit 1
fi
git checkout -b "$local_branch" "upstream/$branch"

# Clear out local `.mo` files which cause locale/*/LC_MESSAGES/
# directories to not be empty when their .po files vanish, so git
# doesn't remove the directory.
rm locale/*/LC_MESSAGES/*.mo

wlc lock "zulip/frontend$suffix"
wlc lock "zulip/django$suffix"
trap 'wlc unlock "zulip/frontend$suffix" && wlc unlock "zulip/django$suffix"' EXIT

wlc commit "zulip/frontend$suffix"
wlc commit "zulip/django$suffix"

git fetch "https://hosted.weblate.org/git/zulip/django$suffix/"
if [ "$(git rev-list FETCH_HEAD "^upstream/$branch")" == "" ]; then
    echo "No changes from Weblate to commit!"
else
    git cherry-pick FETCH_HEAD "^upstream/$branch"

    git clean -dxf locale/

    # Check that everything is normalized into NFC; if it isn't, we
    # need to fix it in Weblate, or Weblate will fail to rebase the
    # changes out after we push.
    files="$(find locale -type f -name '*.json' -o -name '*.po')"
    mapfile -t files <<<"$files"
    for file in "${files[@]}"; do
        uconv -x any-nfc "$file" | sponge -- "$file"
    done

    git add locale/
    if ! git diff-index --quiet --cached HEAD locale/; then
        echo "Non-NFC translations exist!  Fix them in Weblate first."
        git diff --cached
        exit 1
    fi

    # Update locale/*/legacy_stream_translations.json
    ./tools/i18n/update-for-legacy-translations

    # Trim out any now-empty locale directories
    find locale/ -type d -empty -delete

    git add locale/

    # Double-check that they all compile
    ./manage.py compilemessages --ignore='*'

    git commit --amend -m 'i18n: Sync translations from Weblate.'
fi

./manage.py makemessages --all
git add locale/

if git diff-index --quiet --cached HEAD locale/; then
    echo "No changes to PO files to commit!"
else
    git commit -m 'i18n: Updated .po files for new strings.'
fi

if [ "$(git rev-list HEAD "^upstream/$branch")" == "" ]; then
    echo "No commits to push, aborting!"
    git checkout "$branch"
    git branch -D "$local_branch"
else
    git push origin "HEAD:$local_branch"

    gh_username="$(gh api user --jq '.login')"
    gh pr create --title "Updated translations for $branch from Weblate." --body "" --base "$branch" --head "$gh_username:$local_branch"
    gh pr merge --rebase --auto "$gh_username:$local_branch"
    commit=$(git rev-parse HEAD)

    git checkout "$branch"
    git branch -D "$local_branch"

    echo "Waiting for PR to merge..."
    while [ "$(gh pr list --search "$commit" --state all --json state --jq .[0].state)" != "MERGED" ]; do
        sleep 30
    done

    git push origin --delete "$local_branch"
fi
```

--------------------------------------------------------------------------------

````

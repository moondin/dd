---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 251
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 251 of 1290)

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

---[FILE: remote.md]---
Location: zulip-main/docs/development/remote.md

```text
# Developing on a remote machine

The Zulip developer environment works well on remote virtual machines. This can
be a good alternative for those with poor network connectivity or who have
limited storage/memory on their local machines.

We recommend giving the Zulip development environment its own virtual
machine with at least 2GB of memory. If the Zulip development
environment will be the only thing running on the remote virtual
machine, we recommend installing
[directly][install-direct]. Otherwise, we recommend the
[Vagrant][install-vagrant] method so you can easily uninstall if you
need to.

## Connecting to the remote environment

The best way to connect to your server is using the command line tool `ssh`.

- On macOS and Linux/UNIX, `ssh` is a part of Terminal.
- On Windows, `ssh` comes with [Bash for Git][git-bash].

Open _Terminal_ or _Bash for Git_, and connect with the following:

```console
$ ssh username@host
```

If you have poor internet connectivity, we recommend using
[Mosh](https://mosh.org/) as it is more reliable over slow or unreliable
networks.

## Setting up user accounts

You will need a non-root user account with sudo privileges to set up
the Zulip development environment. If you have one already, continue
to the next section.

You can create a new user with sudo privileges by running the
following commands as root:

- You can create a `zulipdev` user by running the command
  `adduser zulipdev`. Run through the prompts to assign a password and
  user information. (You can pick any username you like for this user
  account.)
- You can add the user to the sudo group by running the command
  `usermod -aG sudo zulipdev`.
- Finally, you can switch to the user by running the command
  `su - zulipdev` (or just log in to that user using `ssh`).

## Setting up the development environment

After you have connected to your remote server, you need to install the
development environment.

If the Zulip development environment will be the only thing running on
the remote virtual machine, we recommend installing
[directly][install-direct]. Otherwise, we recommend the
[Vagrant][install-vagrant] method so you can easily uninstall if you
need to.

The main difference from the standard instructions is that for a
remote development environment, and you're not using our Digital Ocean
Droplet infrastructure (which handles `EXTERNAL_HOST` for you), you'll
need to run `export EXTERNAL_HOST=<REMOTE_IP>:9991` in a shell before
running `run-dev` (and see also the `--interface=''` option
documented below).

If your server has a static IP address, we recommend putting this
command in `~/.bashrc`, so you don't need to remember to run it every
time. This allows you to access Zulip running in your development
environment using a browser on another host.

## Running the development server

Once you have set up the development environment, you can start up the
development server with the following command in the directory where
you cloned Zulip:

```bash
./tools/run-dev --interface=''
```

This will start up the Zulip server on port 9991. You can then
navigate to `http://<REMOTE_IP>:9991/devlogin` and you should see something like
this screenshot of the Zulip development environment:

![Image of Zulip development environment](../images/zulip-devlogin.png)

The `--interface=''` option makes the Zulip development environment
accessible from any IP address (in contrast with the much more secure
default of only being accessible from localhost, which is great for
developing on your laptop).

To properly secure your remote development environment, you can
[port forward](https://help.ubuntu.com/community/SSH/OpenSSH/PortForwarding)
using ssh instead of running the development environment on an exposed
interface. For example, if you're running Zulip on a remote server
such as a DigitalOcean Droplet or an AWS EC2 instance, you can set up
port-forwarding to access Zulip by running the following command in
your terminal:

```bash
ssh -L 3000:127.0.0.1:9991 <username>@<remote_server_ip> -N
```

Now you can access Zulip by navigating to `http://127.0.0.1:3000` in
your local computer's browser.

For more information, see [Using the development
environment][rtd-using-dev-env].

## Making changes to code on your remote development server

To see changes on your remote development server, you need to do one of the following:

- [Edit locally](#editing-locally): Clone Zulip code to your computer and
  then use your favorite editor to make changes. When you want to see changes
  on your remote Zulip development instance, sync with Git.
- [Edit remotely](#editing-remotely): Edit code directly on your remote
  Zulip development instance using a [Web-based IDE](#web-based-ide) (recommended for
  beginners) or a [command line editor](#command-line-editors), or a
  [desktop IDE](#desktop-gui-editors) using a plugin to sync your
  changes to the server when you save.

#### Editing locally

If you want to edit code locally install your favorite text editor. If you
don't have a favorite, here are some suggestions:

- [atom](https://atom.io/)
- [emacs](https://www.gnu.org/software/emacs/)
- [vim](https://www.vim.org/)
- [spacemacs](https://github.com/syl20bnr/spacemacs)
- [sublime](https://www.sublimetext.com/)
- [PyCharm](https://www.jetbrains.com/pycharm/)

Next, follow our [Git and GitHub guide](../git/index.md) to clone and configure
your fork of zulip on your local computer.

Once you have cloned your code locally, you can get to work.

##### Syncing changes

The easiest way to see your changes on your remote development server
is to **push them to GitHub** and then **fetch and merge** them from
the remote server.

For more detailed instructions about how to do this, see our [Git & GitHub
guide][rtd-git-guide]. In brief, the steps are as follows.

On your **local computer**:

1. Open _Terminal_ (macOS/Linux) or _Git for BASH_.
2. Change directory to where you cloned Zulip (e.g., `cd zulip`).
3. Use `git add` and `git commit` to stage and commit your changes (if you
   haven't already).
4. Push your commits to GitHub with `git push origin branchname`.

Be sure to replace `branchname` with the name of your actual feature branch.

Once `git push` has completed successfully, you are ready to fetch the commits
from your remote development instance:

1. In _Terminal_ or _Git BASH_, connect to your remote development
   instance with `ssh user@host`.
2. Change to the zulip directory (e.g., `cd zulip`).
3. Fetch new commits from GitHub with `git fetch origin`.
4. Change to the branch you want to work on with `git checkout branchname`.
5. Merge the new commits into your branch with `git merge origin/branchname`.

#### Editing remotely

There are a few good ways to edit code in your remote development
environment:

- With a command-line editor like vim or emacs run over SSH.
- With a desktop GUI editor like VS Code or Atom and a plugin for
  syncing your changes to the remote server.
- With a web-based IDE like CodeAnywhere.

We document these options below; we recommend using whatever editor
you prefer for development in general.

##### Desktop GUI editors

If you use [TextMate](https://macromates.com), Atom, VS Code, or a
similar GUI editor, tools like
[Visual Studio Code Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) and
[rmate](https://github.com/textmate/rmate) that are designed to
integrate that editor with remote development over SSH allow you to
develop remotely from the comfort of your local machine.

Similar packages/extensions exist for other popular code editors as
well; contributions of precise documentation for them are welcome!

- [VSCode Remote - SSH][vscode-remote-ssh]: Lets you use Visual Studio
  Code against a remote repository with a similar user experience to
  developing locally.

[vscode-remote-ssh]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh

- [rmate](https://github.com/textmate/rmate) for TextMate + VS Code:

1. Install the extension
   [Remote VSCode](https://marketplace.visualstudio.com/items?itemName=rafaelmaiolla.remote-vscode).
2. On your remote machine, run:
   ```console
   $ mkdir -p ~/bin
   $ curl -fL -o ~/bin/rmate https://raw.githubusercontent.com/textmate/rmate/master/bin/rmate
   $ chmod a+x ~/bin/rmate
   ```
3. Make sure the remote server is running in VS Code (you can
   force-start through the Command Palette).
4. SSH to your remote machine using:
   ```console
   $ ssh -R 52698:localhost:52698 user@example.org
   ```
5. On your remote machine, run:
   ```console
   $ rmate [options] file
   ```
   and the file should open up in VS Code. Any changes you make now will be saved remotely.

##### Command line editors

Another way to edit directly on the remote development server is with
a command line text editor on the remote machine.

Two editors often available by default on Linux systems are:

- **Nano**: A very simple, beginner-friendly editor. However, it lacks a lot of
  features useful for programming, such as syntax highlighting, so we only
  recommended it for quick edits to things like configuration files. Launch by
  running command `nano <filename>`. Exit by pressing _Ctrl-X_.

- **[Vim](https://www.vim.org/)**: A very powerful editor that can take a while
  to learn. Launch by running `vim <filename>`. Quit Vim by pressing _Esc_,
  typing `:q`, and then pressing _Enter_. Vim comes with a program to learn it
  called `vimtutor` (just run that command to start it).

Other options include:

- [emacs](https://www.gnu.org/software/emacs/)
- [spacemacs](https://github.com/syl20bnr/spacemacs)

##### Web-based IDE

If you are relatively new to working on the command line, or just want to get
started working quickly, we recommend web-based IDE
[Codeanywhere][codeanywhere].

To set up Codeanywhere for Zulip:

1. Create a [Codeanywhere][codeanywhere] account and log in.
2. Create a new **SFTP-SSH** project. Use _Public key_ for authentication.
3. Click **GET YOUR PUBLIC KEY** to get the new public key that
   Codeanywhere generates when you create a new project. Add this public key to
   `~/.ssh/authorized_keys` on your remote development instance.
4. Once you've added the new public key to your remote development instance, click
   _CONNECT_.

Now your workspace should look similar this:
![Codeanywhere workspace][img-ca-workspace]

#### Next steps

Next, read the following to learn more about developing for Zulip:

- [Git & GitHub guide][rtd-git-guide]
- [Using the development environment][rtd-using-dev-env]
- [Testing][rtd-testing]

[install-direct]: setup-advanced.md#installing-directly-on-ubuntu-debian-centos-or-fedora
[install-vagrant]: setup-recommended.md
[rtd-git-guide]: ../git/index.md
[rtd-using-dev-env]: using.md
[rtd-testing]: ../testing/testing.md
[git-bash]: https://git-for-windows.github.io/
[codeanywhere]: https://codeanywhere.com/
[img-ca-settings]: ../images/codeanywhere-settings.png
[img-ca-workspace]: ../images/codeanywhere-workspace.png

## Using an nginx reverse proxy

For some applications (e.g., developing an OAuth2 integration for
Facebook), you may need your Zulip development to have a valid SSL
certificate. While `run-dev` doesn't support that, you can do this
with an `nginx` reverse proxy sitting in front of `run-dev`.

The following instructions assume you have a Zulip Droplet working and
that the user is `zulipdev`; edit accordingly if the situation is
different.

1. First, get an SSL certificate; you can use
   [our certbot wrapper script used for production](../production/ssl-certificates.md#certbot-recommended)
   by running the following commands as root:

   ```bash
   # apt install -y crudini
   mkdir -p /var/lib/zulip/certbot-webroot/
   # if nginx running this will fail and you need to run `service nginx stop`
   /home/zulipdev/zulip/scripts/setup/setup-certbot \
     hostname.example.com \
     --email=username@example.com --method=standalone
   ```

1. Install nginx configuration:

   ```bash
   apt install -y nginx-full
   cp -a /home/zulipdev/zulip/tools/droplets/zulipdev /etc/nginx/sites-available/
   ln -nsf /etc/nginx/sites-available/zulipdev /etc/nginx/sites-enabled/
   nginx -t  # Verifies your nginx configuration
   service nginx reload  # Actually enabled your nginx configuration
   ```

1. Start the Zulip development environment in HTTPS mode with the following command:
   ```bash
   env EXTERNAL_HOST="hostname.example.com" ./tools/run-dev --behind-https-proxy --interface=''
   ```
```

--------------------------------------------------------------------------------

---[FILE: request-remote.md]---
Location: zulip-main/docs/development/request-remote.md

```text
---
orphan: true
---

# How to request a remote Zulip development instance

Under specific circumstances, typically during sprints, hackathons, and
Google Code-in, Zulip can provide you with a virtual machine with the
development environment already set up.

The machines (droplets) are being generously provided by
[DigitalOcean](https://www.digitalocean.com/). Thank you DigitalOcean!

## Step 1: Join GitHub and create SSH keys

To contribute to Zulip and to use a remote Zulip developer instance, you'll
need a GitHub account. If you don't already have one, sign up
[here][github-join].

You'll also need to [create SSH keys and add them to your GitHub
account][github-help-add-ssh-key].

## Step 2: Create a fork of zulip/zulip

Zulip uses a **forked-repo** and **[rebase][gitbook-rebase]-oriented
workflow**. This means that all contributors create a fork of the [Zulip
repository][github-zulip-zulip] they want to contribute to and then submit pull
requests to the upstream repository to have their contributions reviewed and
accepted.

When we create your Zulip dev instance, we'll connect it to your fork of Zulip,
so that needs to exist before you make your request.

While you're logged in to GitHub, navigate to [zulip/zulip][github-zulip-zulip]
and click the **Fork** button. (See [GitHub's help article][github-help-fork]
for further details).

## Step 3: Make request via chat.zulip.org

Now that you have a GitHub account, have added your SSH keys, and forked
zulip/zulip, you are ready to request your Zulip developer instance.

If you haven't already, create an account on https://chat.zulip.org/.

Next, join the [development
help](https://chat.zulip.org/#narrow/channel/49-development-help) channel. Create a
new **channel message** with your GitHub username as the **topic** and request
your remote dev instance. **Please make sure you have completed steps 1 and 2
before doing so**. A core developer should reply letting you know they're
working on creating it as soon as they are available to help.

Once requested, it will only take a few minutes to create your instance. You
will be contacted when it is complete and available.

## Next steps

Once your remote dev instance is ready:

- Connect to your server by running
  `ssh zulipdev@<username>.zulipdev.org` on the command line
  (Terminal for macOS and Linux, Bash for Git on Windows).
- There is no password; your account is configured to use your SSH keys.
- Once you log in, you should see `(zulip-server) ~$`.
- To start the dev server, `cd zulip` and then run `./tools/run-dev`.
- While the dev server is running, you can see the Zulip server in your browser
  at http://zulip.username.zulipdev.org:9991.
- The development server actually runs on all subdomains of
  `username.zulipdev.org`; this is important for testing Zulip's
  support for multiple organizations in your development server.

Once you've confirmed you can connect to your remote server, take a look at:

- [developing remotely](remote.md) for tips on using the remote dev
  instance, and
- our [Git & GitHub guide](../git/index.md) to learn how to use Git with Zulip.

Next, read the following to learn more about developing for Zulip:

- [Using the development environment](using.md)
- [Testing](../testing/testing.md)

[github-join]: https://github.com/join
[github-help-add-ssh-key]: https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account
[github-zulip-zulip]: https://github.com/zulip/zulip/
[github-help-fork]: https://help.github.com/en/articles/fork-a-repo
[gitbook-rebase]: https://git-scm.com/book/en/v2/Git-Branching-Rebasing
```

--------------------------------------------------------------------------------

---[FILE: setup-advanced.md]---
Location: zulip-main/docs/development/setup-advanced.md

```text
# Advanced setup

Contents:

- [Installing directly on Ubuntu, Debian, CentOS, or Fedora](#installing-directly-on-ubuntu-debian-centos-or-fedora)
- [Installing using Vagrant with VirtualBox on Windows 10](#installing-using-vagrant-with-virtualbox-on-windows-10)
- [Using the Vagrant Hyper-V provider on Windows](#using-the-vagrant-hyper-v-provider-on-windows-beta)
- [Newer versions of supported platforms](#newer-versions-of-supported-platforms)

## Installing directly on Ubuntu, Debian, CentOS, or Fedora

:::{warning}
There is no supported uninstallation process with the direct-install
method. If you want that, use [the Vagrant environment](setup-recommended.md),
where you can just do `vagrant destroy` to clean up the development environment.
:::

One can install the Zulip development environment directly on a Linux
host by following these instructions. Currently supported platforms
are:

- Ubuntu 22.04, 24.04
- Debian 12, 13
- CentOS 7 (beta)
- Fedora 38 (beta)
- RHEL 7 (beta)

**Note**: You should not use the `root` user to run the installation.
If you are using a [remote server](remote.md), see
the
[section on creating appropriate user accounts](remote.md#setting-up-user-accounts).

Start by [cloning your fork of the Zulip repository][zulip-rtd-git-cloning]
and [connecting the Zulip upstream repository][zulip-rtd-git-connect]:

```bash
git clone --config pull.rebase git@github.com:YOURUSERNAME/zulip.git
cd zulip
git remote add -f upstream https://github.com/zulip/zulip.git
```

CentOS, Fedora, and RHEL users should ensure that python3 is installed on their
systems (Debian and Ubuntu distributions already include it):

```bash
# On CentOS/Fedora/RHEL, you must first install python3.
# For example, this command installs python3 with yum:
yum install python
```

With python3 installed, change into the directory where you have cloned
Zulip and run the following commands:

```bash
# From inside a clone of zulip.git:
./tools/provision
source .venv/bin/activate
./tools/run-dev  # starts the development server
```

Once you've done the above setup, you can pick up the [documentation
on using the Zulip development
environment](setup-recommended.md#step-4-developing),
ignoring the parts about `vagrant` (since you're not using it).

## Installing using Vagrant with VirtualBox on Windows 10

:::{note}
We recommend using [WSL 2 for Windows development](setup-recommended.md)
because it is easier to set up and provides a substantially better experience.
:::

1. Install [Git for Windows][git-bash], which installs _Git BASH_.
2. Install [VirtualBox][vbox-dl] (latest).
3. Install [Vagrant][vagrant-dl] (latest).

(Note: While _Git BASH_ is recommended, you may also use [Cygwin][cygwin-dl].
If you do, make sure to **install default required packages** along with
**git**, **curl**, **openssh**, and **rsync** binaries.)

Also, you must have hardware virtualization enabled (VT-x or AMD-V) in your
computer's BIOS.

#### Running Git BASH as an administrator

It is important that you **always run Git BASH with administrator
privileges** when working on Zulip code, as not doing so will cause
errors in the development environment (such as symlink creation). You
might wish to configure your Git BASH shortcut to always run with
these privileges enabled (see this [guide][bash-admin-setup] for how
to set this up).

##### Enable native symlinks

The Zulip code includes symbolic links (symlinks). By default, native Windows
symlinks are not enabled in either Git BASH or Cygwin, so you need to do a bit
of configuration. **You must do this before you clone the Zulip code.**

In **Git for BASH**:

Open **Git BASH as an administrator** and run:

```console
$ git config --global core.symlinks true
```

Now confirm the setting:

```console
$ git config core.symlinks
true
```

If you see `true`, you are ready for [Step 2: Get Zulip code](setup-recommended.md#step-2-get-zulip-code).

Otherwise, if the above command prints `false` or nothing at all, then symlinks
have not been enabled.

In **Cygwin**:

Open a Cygwin window **as an administrator** and do this:

```console
christie@win10 ~
$ echo 'export "CYGWIN=$CYGWIN winsymlinks:native"' >> ~/.bash_profile
```

Next, close that Cygwin window and open another. If you `echo` $CYGWIN you
should see:

```console
christie@win10 ~
$ echo $CYGWIN
winsymlinks:native
```

Now you are ready for [Step 2: Get Zulip code](setup-recommended.md#step-2-get-zulip-code).

(Note: The **GitHub Desktop client** for Windows has a bug where it
will automatically set `git config core.symlink false` on a repository
if you use it to clone a repository, which will break the Zulip
development environment, because we use symbolic links. For that
reason, we recommend avoiding using GitHub Desktop client to clone
projects and to instead follow these instructions exactly.)

[cygwin-dl]: https://cygwin.com
[git-bash]: https://git-for-windows.github.io
[vbox-dl]: https://www.virtualbox.org/wiki/Downloads
[vagrant-dl]: https://www.vagrantup.com/downloads.html
[bash-admin-setup]: https://superuser.com/questions/1002262/run-applications-as-administrator-by-default-in-windows-10

## Using the Vagrant Hyper-V provider on Windows (beta)

You should have [Vagrant](https://www.vagrantup.com/downloads) and
[Hyper-V][hyper-v] installed on your system. Ensure they both work as
expected.

[hyper-v]: https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v

**NOTE**: Hyper-V is available only on Windows Enterprise, Pro, or Education.

1. Start by [cloning your fork of the Zulip repository][zulip-rtd-git-cloning]
   and [connecting the Zulip upstream repository][zulip-rtd-git-connect]:

   ```bash
   git clone --config pull.rebase git@github.com:YOURUSERNAME/zulip.git
   cd zulip
   git remote add -f upstream https://github.com/zulip/zulip.git
   ```

1. You will have to open up powershell with administrator rights in
   order to use Hyper-V. Then provision the development environment:

   ```bash
   vagrant up --provider=hyperv
   ```

   You should get output like this:

   ```console
   Bringing machine 'default' up with 'hyperv' provider...
   ==> default: Verifying Hyper-V is enabled...
   ==> default: Verifying Hyper-V is accessible...
   <other stuff>...
   ==> default: Waiting for the machine to report its IP address...
       default: Timeout: 120 seconds
       default: IP: 172.28.119.70
   ==> default: Waiting for machine to boot. This may take a few minutes...
       default: SSH address: 172.28.122.156
   ==> default: Machine booted and ready!
   ==> default: Preparing SMB shared folders...
   Vagrant requires administrator access for pruning SMB shares and
   may request access to complete removal of stale shares.
   ==> default: Starting the machine...
   <other stuff>...
    default: Username (user[@domain]): <your-machine-username>
    default: Password (will be hidden):
   ```

   At this point, you will be prompted for your Windows administrator
   username and password (not your Microsoft account credentials).

1. SSH into your newly created virtual machine

   ```bash
   vagrant ssh
   ```

   This will ssh you into the bash shell of the Zulip development environment
   where you can execute bash commands.

1. Set the `EXTERNAL_HOST` environment variable.

   ```console
   (zulip-server) vagrant@ubuntu-18:/srv/zulip$ export EXTERNAL_HOST="$(hostname -I | xargs):9991"
   (zulip-server) vagrant@ubuntu-18:/srv/zulip$ echo $EXTERNAL_HOST
   ```

   The output will be like:

   ```console
   172.28.122.156:9991
   ```

   Make sure you note down this down. This is where your zulip development web
   server can be accessed.

   :::{important}
   The output of the above command changes every time you restart the Vagrant
   development machine. Thus, it will have to be run every time you bring one up.
   This quirk is one reason this method is marked experimental.
   :::

1. You should now be able to start the Zulip development server.

   ```console
   (zulip-server) vagrant@ubuntu-18:/srv/zulip$ ./tools/run-dev
   ```

   The output will look like:

   ```console
   Starting Zulip on:

        http://172.30.24.235:9991/

   Internal ports:
      9991: Development server proxy (connect here)
      9992: Django
      9993: Tornado
      9994: webpack
   ```

   Visit the indicated URL in your web browser.

1. You can stop the development environment using `vagrant halt`, and restart it
   using `vagrant up` and then going through steps **3** and **4** again.

### Problems you may encounter

1. If you get the error `Hyper-V could not initialize memory`, this is
   likely because your system has insufficient free memory to start
   the virtual machine. You can generally work around this error by
   closing all other running programs and running
   `vagrant up --provider=hyperv` again. You can reopen the other
   programs after the provisioning is completed. If it still isn't
   enough, try restarting your system and running the command again.

2. Be patient the first time you run `./tools/run-dev`.

As with other installation methods, please visit [#provision
help][provision-help] in the [Zulip development community
server](https://zulip.com/development-community/) if you need help.

[provision-help]: https://chat.zulip.org/#narrow/channel/21-provision-help

## Newer versions of supported platforms

You can use
[our provisioning tool](#installing-directly-on-ubuntu-debian-centos-or-fedora)
to set up the Zulip development environment on current versions of
these platforms reliably and easily, so we no longer maintain manual
installation instructions for these platforms.

If `tools/provision` doesn't yet support a newer release of Debian or
Ubuntu that you're using, we'd love to add support for it. It's
likely only a few lines of changes to `tools/lib/provision.py` and
`scripts/lib/setup-apt-repo` if you'd like to do it yourself and
submit a pull request, or you can ask for help in
[#development help](https://chat.zulip.org/#narrow/channel/49-development-help)
in [the Zulip development community](https://zulip.com/development-community/),
and a core team member can help guide you through adding support for the platform.

[zulip-rtd-git-cloning]: ../git/cloning.md#step-1b-clone-to-your-machine
[zulip-rtd-git-connect]: ../git/cloning.md#step-1c-connect-your-fork-to-zulip-upstream
```

--------------------------------------------------------------------------------

````

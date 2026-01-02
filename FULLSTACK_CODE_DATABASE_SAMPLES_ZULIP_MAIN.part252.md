---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 252
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 252 of 1290)

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

---[FILE: setup-recommended.md]---
Location: zulip-main/docs/development/setup-recommended.md

```text
## Recommended environment setup tutorial

This section guides first-time contributors through installing the
Zulip development environment on Windows, macOS, and Linux.

The recommended method for installing the Zulip development environment is
to use WSL 2 on Windows, and Vagrant with Docker on macOS and Linux.

All of these recommended methods work by creating a container or VM
for the Zulip server and related services, with the Git repository
containing your source code mounted inside it. This strategy allows
the environment to be as reliable and portable as possible. The
specific technologies (Vagrant/Docker and WSL 2) were chosen based on
what technologies have been most reliable through our experience
supporting the thousands of people who've set up the Zulip development
environment.

Contents:

- [Requirements](#requirements)
- [Step 0: Set up Git & GitHub](#step-0-set-up-git--github)
- [Step 1: Install prerequisites](#step-1-install-prerequisites)
- [Step 2: Get Zulip code](#step-2-get-zulip-code)
- [Step 3: Start the development environment](#step-3-start-the-development-environment)
- [Step 4: Developing](#step-4-developing)
- [Troubleshooting and common errors](#troubleshooting-and-common-errors)
- [Specifying an Ubuntu mirror](#specifying-an-ubuntu-mirror)
- [Specifying a proxy](#specifying-a-proxy)
- [Customizing CPU and RAM allocation](#customizing-cpu-and-ram-allocation)

### Requirements

Installing the Zulip development environment requires downloading several
hundred megabytes of dependencies. You will need an active internet
connection throughout the entire installation processes. (See
[Specifying a proxy](#specifying-a-proxy) if you need a proxy to access
the internet.)

- 2GB available RAM
- active broadband internet connection
- [GitHub account](#step-0-set-up-git--github)

::::{tab-set}

:::{tab-item} Windows
:sync: os-windows

- Windows 64-bit (Windows 10 recommended)
- hardware virtualization enabled (VT-x or AMD-V)
- administrator access
  :::

:::{tab-item} macOS
:sync: os-mac

- macOS (10.11 El Capitan or newer recommended)
  :::

:::{tab-item} Ubuntu/Debian
:sync: os-ubuntu

- Ubuntu 22.04 or 24.04
- Debian 12 or 13
  :::

:::{tab-item} Fedora
:sync: os-fedora

- tested for Fedora 36
  :::

:::{tab-item} Other Linux
:sync: os-other-linux

- Any Linux distribution should work, if it supports Git, Vagrant and
  Docker. We don't maintain documentation for installing Vagrant,
  Docker, and other dependencies on those systems, so you'll want to
  roughly follow the Ubuntu/Debian instructions, using upstream
  documentation for installing dependencies.
  :::

::::

### Step 0: Set up Git & GitHub

You can skip this step if you already have Git, GitHub, and SSH access
to GitHub working on your machine.

Follow our [Git guide][set-up-git] in order to install Git, set up a
GitHub account, create an SSH key to access code on GitHub
efficiently, etc. Be sure to create an SSH key and add it to your
GitHub account using
[these instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

### Step 1: Install prerequisites

::::{tab-set}

:::{tab-item} Windows
:sync: os-windows

Zulip's development environment is most easily set up on Windows using
the Windows Subsystem for Linux ([WSL
2](https://learn.microsoft.com/en-us/windows/wsl/compare-versions))
installation method described here. We require version 0.67.6+ of WSL 2.

1. Enable virtualization through your BIOS settings. This sequence
   depends on your specific hardware and brand, but here are [some
   basic instructions.][windows-bios-virtualization]

1. [Install WSL
   2](https://docs.microsoft.com/en-us/windows/wsl/setup/environment),
   which includes installing an Ubuntu WSL distribution.

1. **Create a new WSL instance for Zulip development**.
   You can refer [this article](https://cloudbytes.dev/snippets/how-to-install-multiple-instances-of-ubuntu-in-wsl2)
   for instructions on how to do so. Using an existing instance will
   probably work, but a fresh distribution is recommended if you
   previously installed other software like `node` in your WSL environment that
   might conflict with the Zulip environment.

1. It is required to enable `systemd` for WSL 2 to manage the database, cache and other services.
   To configure it, please follow [these instructions](https://learn.microsoft.com/en-us/windows/wsl/wsl-config#systemd-support).
   Then, you will need to restart WSL 2 before continuing.

1. Launch the Ubuntu shell as an administrator and run the following command:

   ```console
   $ sudo apt update && sudo apt upgrade
   ```

1. Install dependencies with the following command:

   ```console
   $ sudo apt install rabbitmq-server memcached redis-server postgresql
   ```

1. Open `/etc/rabbitmq/rabbitmq-env.conf` using, for example:

   ```console
   $ sudo nano /etc/rabbitmq/rabbitmq-env.conf
   ```

   Confirm the following lines are at the end of your file, and add
   them if not present:

   ```ini
   NODE_IP_ADDRESS=127.0.0.1
   NODE_PORT=5672
   ```

   Then save your changes (`Ctrl+O`, then `Enter` to confirm the path),
   and exit `nano` (`Ctrl+X`).

1. Run the command below to make sure you are inside the WSL disk and not
   in a Windows mounted disk. You will run into permission issues if you
   run `./tools/provision` from `zulip` in a Windows mounted disk.

   ```console
   $ cd ~  # or cd /home/USERNAME
   ```

1. [Create a new SSH key][create-ssh-key] for the WSL 2 virtual
   machine and add it to your GitHub account. Note that SSH keys
   linked to your Windows computer will not work within the virtual
   machine.

WSL 2 can be uninstalled by following [Microsoft's documentation][uninstall-wsl]

[create-ssh-key]: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account
[uninstall-wsl]: https://learn.microsoft.com/en-us/windows/wsl/faq#how-do-i-uninstall-a-wsl-distribution-
[windows-bios-virtualization]: https://www.thewindowsclub.com/disable-hardware-virtualization-in-windows-10

:::

:::{tab-item} macOS
:sync: os-mac

1. Install [Vagrant][vagrant-dl] (latest).
2. Install [Docker Desktop](https://docs.docker.com/desktop/mac/install/) (latest).
3. Open the Docker desktop app's settings panel, and uncheck "Use gRPC FUSE for file sharing" to use the `osxfs (legacy)` file sharing instead.
   :::

:::{tab-item} Ubuntu/Debian
:sync: os-ubuntu

##### 1. Install Vagrant, Docker, and Git

Install vagrant:

```console
$ wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
$ echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
$ sudo apt update && sudo apt install vagrant
```

Install Docker and Git:

```console
$ sudo apt install docker.io git
```

```{include} setup/install-docker.md

```

:::

:::{tab-item} Fedora
:sync: os-fedora

##### 1. Install Vagrant, Docker, and Git

```console
$ sudo yum install vagrant git moby-engine
```

Fedora does not include the
official `docker-ce` package in their repositories. They provide the package
`moby-engine` which you can choose instead. In case you prefer the official
docker distribution, you can follow
[their documentation to install Docker on Fedora](https://docs.docker.com/engine/install/fedora/).

```{include} setup/install-docker.md

```

:::

::::

### Step 2: Get Zulip code

1. In your browser, visit <https://github.com/zulip/zulip>
   and click the **Fork** button. You will need to be logged in to GitHub to
   do this.
2. Open Terminal (macOS/Linux) or Git BASH (Windows; must
   **run as an Administrator**).
3. In Terminal/Git BASH,
   [clone your fork of the Zulip repository](../git/cloning.md#step-1b-clone-to-your-machine) and
   [connect the Zulip upstream repository](../git/cloning.md#step-1c-connect-your-fork-to-zulip-upstream):

```console
$ git clone --config pull.rebase git@github.com:YOURUSERNAME/zulip.git
$ cd zulip
$ git remote add -f upstream https://github.com/zulip/zulip.git
```

This will create a `zulip` directory and download the Zulip code into it.

Don't forget to replace `YOURUSERNAME` with your Git username. You will see
something like:

```console
$ git clone --config pull.rebase git@github.com:YOURUSERNAME/zulip.git
Cloning into 'zulip'...
remote: Counting objects: 73571, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 73571 (delta 1), reused 0 (delta 0), pack-reused 73569
Receiving objects: 100% (73571/73571), 105.30 MiB | 6.46 MiB/s, done.
Resolving deltas: 100% (51448/51448), done.
Checking connectivity... done.
Checking out files: 100% (1912/1912), done.
```

### Step 3: Start the development environment

::::{tab-set}

:::{tab-item} Windows (WSL)
:sync: os-windows

Run the following to install the Zulip development environment and
start it. (If Windows Firewall creates popups to block services,
simply click **Allow access**.)

```console
$ # Install/update the Zulip development environment
$ ./tools/provision
$ # Enter the Zulip Python environment
$ source .venv/bin/activate
$ # Start the development server
$ ./tools/run-dev
```

If you are facing problems or you see error messages after running `./tools/run-dev`,
you can try running `./tools/provision` again.
:::

:::{tab-item} Windows (VM)
:sync: os-windows-vm

Change into the zulip directory and tell Vagrant to start the Zulip
development environment with `vagrant up`:

```console
$ cd zulip
$ vagrant plugin install vagrant-vbguest
$ vagrant up --provider=virtualbox
```

```{include} setup/vagrant-up.md

```

On Windows, you will see the message
`The system cannot find the path specified.` several times. This is
normal and is not a problem.

```{include} setup/vagrant-ssh.md

```

:::

:::{tab-item} macOS
:sync: os-mac

Change into the zulip directory and tell Vagrant to start the Zulip
development environment with `vagrant up`:

```console
$ cd zulip
$ vagrant up --provider=docker
```

**Important note**: There is a [known upstream issue on
macOS](https://chat.zulip.org/#narrow/channel/21-provision-help/topic/provision.20error.20ERR_PNPM_LINKING_FAILED/near/1649241)
that can cause provisioning to fail with `ERR_PNPM_LINKING_FAILED` or
other errors. The temporary fix is to open the Docker desktop app's
settings panel, and choose `osxfs (legacy)` under "Choose file sharing
implementation for your containers." Once Docker restarts, you should
be able to successfully run `vagrant up --provider=docker`. Back in
Docker, you should return to using VirtioFS so that your files sync
properly while developing, but you may need to revert to `osxfs (legacy)`
whenever you need to re-provision.

```{include} setup/vagrant-up.md

```

```{include} setup/vagrant-ssh.md

```

:::

:::{tab-item} Ubuntu/Debian
:sync: os-ubuntu

Change into the zulip directory and tell Vagrant to start the Zulip
development environment with `vagrant up`:

```console
$ cd zulip
$ vagrant up --provider=docker
```

```{include} setup/vagrant-up.md

```

```{include} setup/vagrant-ssh.md

```

:::

:::{tab-item} Fedora
:sync: os-fedora

Change into the zulip directory and tell Vagrant to start the Zulip
development environment with `vagrant up`:

```console
$ cd zulip
$ vagrant up --provider=docker
```

```{include} setup/vagrant-up.md

```

```{include} setup/vagrant-ssh.md

```

:::

::::

### Step 4: Developing

#### Where to edit files

You'll work by editing files on your host machine, in the directory where you
cloned Zulip. Use your favorite editor (Sublime, Atom, Vim, Emacs, Notepad++,
etc.).

When you save changes they will be synced automatically to the Zulip
development environment on the virtual machine/container.

Each component of the Zulip development server will automatically
restart itself or reload data appropriately when you make changes. So,
to see your changes, all you usually have to do is reload your
browser. More details on how this works are available below.

Zulip's whitespace rules are all enforced by linters, so be sure to
run `tools/lint` often to make sure you're following our coding style
(or use `tools/setup-git-repo` to run it on just the changed files
automatically whenever you commit).

#### VSCode setup (optional)

::::{tab-set}

:::{tab-item} Windows (WSL)
:sync: os-windows

The [Visual Studio Code Remote -
WSL](https://code.visualstudio.com/docs/remote/wsl) extension is
recommended for editing files when developing with WSL. When you
have it installed, you can run:

```console
$ code .
```

to open VS Code connected to your WSL environment. See the [Remote development in WSL][remote-wsl] tutorial for more information.
:::

:::{tab-item} Windows (VM)
:sync: os-windows-vm

```{include} setup/vscode-vagrant.md

```

:::

:::{tab-item} macOS
:sync: os-mac

```{include} setup/vscode-vagrant.md

```

:::

:::{tab-item} Ubuntu/Debian
:sync: os-ubuntu

```{include} setup/vscode-vagrant.md

```

:::

:::{tab-item} Fedora
:sync: os-fedora

```{include} setup/vscode-vagrant.md

```

:::

::::

#### Understanding run-dev debugging output

It's good to have the terminal running `./tools/run-dev` up as you work since error
messages including tracebacks along with every backend request will be printed
there.

See [Logging](../subsystems/logging.md) for further details on the run-dev console
output.

#### Committing and pushing changes with Git

When you're ready to commit or push changes via Git, you will do this by
running Git commands in Terminal (macOS/Linux) or Git BASH (Windows) in the
directory where you cloned Zulip on your main machine.

If you're new to working with Git/GitHub, check out our [Git & GitHub
guide][rtd-git-guide].

#### Maintaining the development environment

::::{tab-set}

:::{tab-item} Windows (WSL)
:sync: os-windows

If after rebasing onto a new version of the Zulip server, you receive
new errors while starting the Zulip server or running tests, this is
probably not because Zulip's `main` branch is broken. Instead, this
is likely because we've recently merged changes to the development
environment provisioning process that you need to apply to your
development environment. To update your environment, you'll need to
re-provision using `tools/provision` from your Zulip checkout; this
should complete in about a minute.

After provisioning, you'll want to
[(re)start the Zulip development server](/development/setup-recommended.md#step-3-start-the-development-environment).

If you run into any trouble, [#provision
help](https://chat.zulip.org/#narrow/channel/21-provision-help) in the
[Zulip development community
server](https://zulip.com/development-community/) is a great place to ask for
help.

:::

:::{tab-item} Windows (VM)
:sync: os-windows-vm

```{include} setup/vagrant-update.md

```

:::

:::{tab-item} macOS
:sync: os-mac

```{include} setup/vagrant-update.md

```

:::

:::{tab-item} Ubuntu/Debian
:sync: os-ubuntu

```{include} setup/vagrant-update.md

```

:::

:::{tab-item} Fedora
:sync: os-fedora

```{include} setup/vagrant-update.md

```

:::

::::

#### Rebuilding the development environment

::::{tab-set}

:::{tab-item} Windows (WSL)
:sync: os-windows

```{include} setup/wsl-rebuild.md

```

:::

:::{tab-item} Windows (VM)
:sync: os-windows-vm

```{include} setup/vagrant-rebuild.md

```

:::

:::{tab-item} macOS
:sync: os-mac

```{include} setup/vagrant-rebuild.md

```

:::

:::{tab-item} Ubuntu/Debian
:sync: os-ubuntu

```{include} setup/vagrant-rebuild.md

```

:::

:::{tab-item} Fedora
:sync: os-fedora

```{include} setup/vagrant-rebuild.md

```

:::

::::

#### Shutting down the development environment for use later

::::{tab-set}

:::{tab-item} Windows (WSL)
:sync: os-windows

On Windows with WSL 2, you do not need to shut down the environment. Simply
close your terminal window(s).

Alternatively, you can use a command to terminate/shutdown your WSL2 environment with PowerShell using:

```console
> wsl --terminate <environment_name>
```

:::

:::{tab-item} Windows (VM)
:sync: os-windows-vm

```{include} setup/vagrant-halt.md

```

:::

:::{tab-item} macOS
:sync: os-mac

```{include} setup/vagrant-halt.md

```

:::

:::{tab-item} Ubuntu/Debian
:sync: os-ubuntu

```{include} setup/vagrant-halt.md

```

:::

:::{tab-item} Fedora
:sync: os-fedora

```{include} setup/vagrant-halt.md

```

:::

::::

#### Resuming the development environment

::::{tab-set}

:::{tab-item} Windows (WSL)
:sync: os-windows

On Windows with WSL 2, to resume developing you just need to open a new Git
BASH window. Then change into your `zulip` folder and verify the Python
environment was properly activated (you should see `(zulip-server)`). If the
`(zulip-server)` part is missing, run:

```console
$ source .venv/bin/activate
```

:::

:::{tab-item} Windows (VM)
:sync: os-windows-vm

```{include} setup/vagrant-resume.md

```

:::

:::{tab-item} macOS
:sync: os-mac

```{include} setup/vagrant-resume.md

```

:::

:::{tab-item} Ubuntu/Debian
:sync: os-ubuntu

```{include} setup/vagrant-resume.md

```

:::

:::{tab-item} Fedora
:sync: os-fedora

```{include} setup/vagrant-resume.md

```

:::

::::

### Next steps

Next, read the following to learn more about developing for Zulip:

- [Git & GitHub guide][rtd-git-guide]
- [Using the development environment][rtd-using-dev-env]
- [Testing][rtd-testing] (and [Configuring CI][ci] to
  run the full test suite against any branches you push to your fork,
  which can help you optimize your development workflow).

### Troubleshooting and common errors

Below you'll find a list of common errors and their solutions. Most
issues are resolved by just provisioning again by running
`./tools/provision` (from `/srv/zulip`) inside the Vagrant guest (or
equivalently `vagrant provision` from outside) or by running
`./tools/provision` in `~/zulip` inside the WSL instance.

If these solutions aren't working for you or you encounter an issue not
documented below, there are a few ways to get further help:

- Ask in [#provision help](https://chat.zulip.org/#narrow/channel/21-provision-help)
  in the [Zulip development community server](https://zulip.com/development-community/).
- [File an issue](https://github.com/zulip/zulip/issues).

When reporting your issue, please include the following information:

- The host operating system
- The installation method (e.g., Vagrant or WSL)
- Whether or not you are using a proxy
- A copy of Zulip's `vagrant` provisioning logs, available in
  `/var/log/provision.log` on your virtual machine or
  `~/zulip/var/log/provision.log` on your WSL instance. If you
  choose to post just the error output, please include the
  **beginning of the error output**, not just the last few lines.

The output of `tools/diagnose` (run inside the Vagrant guest or
WSL instance) is also usually helpful.

::::{tab-set}

:::{tab-item} Windows (WSL)
:sync: os-windows

```{include} setup/wsl-troubleshoot.md

```

:::

:::{tab-item} Windows (VM)
:sync: os-windows-vm

```{include} setup/shared-vagrant-errors.md

```

```{include} setup/winvm-troubleshoot.md

```

:::

:::{tab-item} macOS
:sync: os-mac

```{include} setup/shared-vagrant-errors.md

```

```{include} setup/unix-troubleshoot.md

```

:::

:::{tab-item} Ubuntu/Debian
:sync: os-ubuntu

```{include} setup/shared-vagrant-errors.md

```

```{include} setup/unix-troubleshoot.md

```

:::

:::{tab-item} Fedora
:sync: os-fedora

```{include} setup/shared-vagrant-errors.md

```

```{include} setup/unix-troubleshoot.md

```

:::
::::

### Specifying an Ubuntu mirror

Bringing up a development environment for the first time involves
downloading many packages from the Ubuntu archive. The Ubuntu cloud
images use the global mirror `http://archive.ubuntu.com/ubuntu/` by
default, but you may find that you can speed up the download by using
a local mirror closer to your location. To do this, create
`~/.zulip-vagrant-config` and add a line like this, replacing the URL
as appropriate:

```text
UBUNTU_MIRROR http://us.archive.ubuntu.com/ubuntu/
```

### Specifying a proxy

If you need to use a proxy server to access the Internet, you will
need to specify the proxy settings before running `vagrant up`.
First, install the Vagrant plugin `vagrant-proxyconf`:

```console
$ vagrant plugin install vagrant-proxyconf
```

Then create `~/.zulip-vagrant-config` and add the following lines to
it (with the appropriate values in it for your proxy):

```text
HTTP_PROXY http://proxy_host:port
HTTPS_PROXY http://proxy_host:port
NO_PROXY localhost,127.0.0.1,.example.com,.zulipdev.com
```

For proxies that require authentication, the config will be a bit more
complex, for example:

```text
HTTP_PROXY http://userName:userPassword@192.168.1.1:8080
HTTPS_PROXY http://userName:userPassword@192.168.1.1:8080
NO_PROXY localhost,127.0.0.1,.example.com,.zulipdev.com
```

You'll want to **double-check** your work for mistakes (a common one
is using `https://` when your proxy expects `http://`). Invalid proxy
configuration can cause confusing/weird exceptions; if you're using a
proxy and get an error, the first thing you should investigate is
whether you entered your proxy configuration correctly.

Now run `vagrant up` in your terminal to install the development
server. If you ran `vagrant up` before and failed, you'll need to run
`vagrant destroy` first to clean up the failed installation.

If you no longer want to use proxy with Vagrant, you can remove the
`HTTP_PROXY` and `HTTPS_PROXY` lines in `~/.zulip-vagrant-config` and
then do a `vagrant reload`.

### Using a different port for Vagrant

You can also change the port on the host machine that Vagrant uses by
adding to your `~/.zulip-vagrant-config` file. E.g., if you set:

```text
HOST_PORT 9971
```

(and `vagrant reload` to apply the new configuration), then you would visit
http://localhost:9971/ to connect to your development server.

If you'd like to be able to connect to your development environment from other
machines than the VM host, you can manually set the host IP address in the
`~/.zulip-vagrant-config` file as well. For example, if you set:

```text
HOST_IP_ADDR 0.0.0.0
```

(and restart the Vagrant guest with `vagrant reload`), your host IP would be
0.0.0.0, a special value for the IP address that means any IP address can
connect to your development server.

### Customizing CPU and RAM allocation

When running Vagrant using a VM-based provider such as VirtualBox or
VMware Fusion, CPU and RAM resources must be explicitly allocated to
the guest system (with Docker and other container-based Vagrant
providers, explicit allocation is unnecessary and the settings
described here are ignored).

Our default Vagrant settings allocate 2 CPUs with 2 GiB of memory for
the guest, which is sufficient to run everything in the development
environment. If your host system has more CPUs, or you have enough
RAM that you'd like to allocate more than 2 GiB to the guest, you can
improve performance of the Zulip development environment by allocating
more resources.

To do so, create a `~/.zulip-vagrant-config` file containing the
following lines:

```text
GUEST_CPUS <number of cpus>
GUEST_MEMORY_MB <system memory (in MB)>
```

For example:

```text
GUEST_CPUS 4
GUEST_MEMORY_MB 8192
```

would result in an allocation of 4 CPUs and 8 GiB of memory to the
guest VM.

After changing the configuration, run `vagrant reload` to reboot the
guest VM with your new configuration.

If at any time you wish to revert back to the default settings, simply
remove the `GUEST_CPUS` and `GUEST_MEMORY_MB` lines from
`~/.zulip-vagrant-config`.

[vagrant-dl]: https://www.vagrantup.com/downloads.html
[install-advanced]: setup-advanced.md
[remote-wsl]: https://code.visualstudio.com/docs/remote/wsl-tutorial
[rtd-git-guide]: ../git/index.md
[rtd-testing]: ../testing/testing.md
[rtd-using-dev-env]: using.md
[rtd-dev-remote]: remote.md
[set-up-git]: ../git/setup.md
[ci]: ../git/cloning.md#step-3-configure-continuous-integration-for-your-fork
```

--------------------------------------------------------------------------------

---[FILE: test-install.md]---
Location: zulip-main/docs/development/test-install.md

```text
# Testing the installer

Zulip's install process is tested as part of [its continuous
integrations suite][ci], but that only tests the most common
configurations; when making changes to more complicated [installation
options][installer-docs], Zulip provides tooling to repeatedly test
the installation process in a clean environment each time.

[ci]: https://github.com/zulip/zulip/actions/workflows/production-suite.yml?query=branch%3Amain
[installer-docs]: ../production/install.md

## Configuring

Using the test installer framework requires a Linux operating system;
it will not work on WSL, for instance. It requires at least 3G of
RAM, in order to accommodate the VMs and the steps which build the
release assets.

To begin, install the LXC toolchain:

```bash
sudo apt-get install lxc lxc-utils
```

All LXC commands (and hence many parts of the test installer) will
need to be run as root.

## Running a test install

### Build and unpack a release tarball

You only need to do this step once per time you work on a set of
changes, to refresh the package that the installer uses. The installer
doesn't work cleanly out of a source checkout; it wants a release
checkout, so we build a tarball of one of those first:

```bash
./tools/build-release-tarball test-installer
```

This will produce a file in /tmp, which it will print out the path to
as the last step; for example,
`/tmp/tmp.fepqqNBWxp/zulip-server-test-installer.tar.gz`

Next, unpack that file into a local directory; we will make any
changes we want in our source checkout and copy them into this
directory. The test installer needs the release directory to be named
`zulip-server`, so we rename it and move it appropriately. In the
first line, you'll need to substitute the actual path that you got for
the tarball, above:

```bash
tar xzf /tmp/tmp.fepqqNBWxp/zulip-server-test-installer.tar.gz
mkdir zulip-test-installer
mv zulip-server-test-installer zulip-test-installer/zulip-server
```

You should delete and re-create this `zulip-test-installer` directory
(using these steps) if you are working on a different installer
branch, or a significant time has passed since you last used it.

### Test an install

The `test-install` tooling takes a distribution release name
(e.g., "jammy"), the path to an unpacked release directory
or tarball, and then any of the normal options you want to pass down
into the installer.

For example, to test an install onto Ubuntu 22.04 "Jammy", we might
call:

```bash
sudo ./tools/test-install/install \
  -r jammy \
  ./zulip-test-installer/ \
  --hostname=zulip.example.net \
  --email=username@example.net
```

The first time you run this command for a given distribution, it will
build a "base" image for that to use on subsequent times; this will
take a while.

### See running containers after installation

Regardless of if the install succeeds or fails, it will stay running
so you can inspect it. You can see all of the containers which are
running, and their randomly-generated names, by running:

```bash
sudo lxc-ls -f
```

### Connect to a running container

After using `lxc-ls` to list containers, you can choose one of them
and connect to its terminal:

```bash
sudo lxc-attach --clear-env -n zulip-install-jammy-PUvff
```

### Stopping and destroying containers

To destroy all containers (but leave the base containers, which speed
up the initial install):

```bash
sudo ./tools/test-install/destroy-all -f
```

To destroy just one container:

```bash
sudo lxc-destroy -f -n zulip-install-jammy-PUvff
```

### Iterating on the installer

Iterate on the installer by making changes to your source tree,
copying them into the release directory, and re-running the installer,
which will start up a new container. Here, we update just the
`scripts` and `puppet` directories of the release directory:

```bash
rsync -az scripts puppet zulip-test-installer/zulip-server/

sudo ./tools/test-install/install \
 -r jammy \
 ./zulip-test-installer/ \
 --hostname=zulip.example.net \
 --email=username@example.net
```
```

--------------------------------------------------------------------------------

---[FILE: using.md]---
Location: zulip-main/docs/development/using.md

```text
# Using the development environment

This page describes the basic edit/refresh workflows for working with
the Zulip development environment. Generally, the development
environment will automatically update as soon as you save changes
using your editor. Details for work on the [server](#server),
[web app](#web), and [mobile apps](#mobile) are below.

If you're working on authentication methods or need to use the [Zulip
REST API][rest-api], which requires an API key, see [authentication in
the development environment][authentication-dev-server].

## Common

- Zulip's `main` branch moves quickly, and you should rebase
  constantly with, for example,
  `git fetch upstream; git rebase upstream/main` to avoid developing
  on an old version of the Zulip codebase (leading to unnecessary
  merge conflicts).
- Remember to run `tools/provision` to update your development
  environment after switching branches; it will run in under a second
  if no changes are required.
- After making changes, you'll often want to run the
  [linters](../testing/linters.md) and relevant [test
  suites](../testing/testing.md). Consider using our [Git pre-commit
  hook](../git/zulip-tools.md#set-up-git-repo-script) to
  automatically lint whenever you make a commit.
- All of our test suites are designed to support quickly testing just
  a single file or test case, which you should take advantage of to
  save time.
- Many useful development tools, including tools for rebuilding the
  database with different test data, are documented in-app at
  `https://localhost:9991/devtools`.
- If you want to restore your development environment's database to a
  pristine state, you can use `./tools/rebuild-dev-database`.

## Server

- For changes that don't affect the database model, the Zulip
  development environment will automatically detect changes and
  restart:
  - The main Django/Tornado server processes are run on top of
    Django's [manage.py runserver][django-runserver], which will
    automatically restart them when you save changes to Python code
    they use. You can watch this happen in the `run-dev` console
    to make sure the backend has reloaded.
  - The Python queue workers will also automatically restart when you
    save changes, as long as they haven't crashed (which can happen if
    they reloaded into a version with a syntax error).
- If you change the database schema (`zerver/models/*.py`), you'll need
  to use the [Django migrations
  process](../subsystems/schema-migrations.md); see also the [new
  feature tutorial][new-feature-tutorial] for an example.
- While testing server changes, it's helpful to watch the `run-dev`
  console output, which will show tracebacks for any 500 errors your
  Zulip development server encounters (which are probably caused by
  bugs in your code).
- To manually query Zulip's database interactively, use
  `./manage.py shell` or `manage.py dbshell`.
- The database(s) used for the automated tests are independent from
  the one you use for manual testing in the UI, so changes you make to
  the database manually will never affect the automated tests.

## Web

- Once the development server (`run-dev`) is running, you can visit
  <http://localhost:9991/> in your browser.
- By default, the development server homepage just shows a list of the
  users that exist on the server and you can log in as any of them by
  just clicking on a user.
  - This setup saves time for the common case where you want to test
    something other than the login process.
  - You can test the login or registration process by clicking the
    links for the normal login page.
- Most changes will take effect automatically. Details:
  - If you change CSS files, your changes will appear immediately via
    webpack hot module replacement.
  - If you change JavaScript code (`web/src`) or Handlebars
    templates (`web/templates`), the browser window will be
    reloaded automatically.
  - For Jinja2 backend templates (`templates/*`), you'll need to reload
    the browser window to see your changes.
- Any JavaScript exceptions encountered while using the web app in a
  development environment will be displayed as a large notice, so you
  don't need to watch the JavaScript console for exceptions.
- Both Chrome and Firefox have great debuggers, inspectors, and
  profilers in their built-in developer tools.
- `debug.js` has some occasionally useful JavaScript profiling code.

## Mobile

See the mobile project's documentation on [getting set up to develop
and contribute to the mobile app][mobile-development-guide].

[rest-api]: https://zulip.com/api/rest
[authentication-dev-server]: authentication.md
[django-runserver]: https://docs.djangoproject.com/en/5.0/ref/django-admin/#runserver
[new-feature-tutorial]: ../tutorials/new-feature-tutorial.md
[testing-docs]: ../testing/testing.md
[mobile-development-guide]: https://github.com/zulip/zulip-flutter/blob/main/docs/setup.md
```

--------------------------------------------------------------------------------

---[FILE: install-docker.md]---
Location: zulip-main/docs/development/setup/install-docker.md

```text
##### 2. Add yourself to the `docker` group:

```console
$ sudo adduser $USER docker
Adding user `YOURUSERNAME' to group `docker' ...
Adding user YOURUSERNAME to group docker
Done.
```

You will need to reboot for this change to take effect. If it worked,
you will see `docker` in your list of groups:

```console
$ groups | grep docker
YOURUSERNAME adm cdrom sudo dip plugdev lpadmin sambashare docker
```

##### 3. Make sure the Docker daemon is running:

If you had previously installed and removed an older version of
Docker, an [Ubuntu
bug](https://bugs.launchpad.net/ubuntu/+source/docker.io/+bug/1844894)
may prevent Docker from being automatically enabled and started after
installation. You can check using the following:

```console
$ systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2019-07-15 23:20:46 IST; 18min ago
```

If the service is not running, you'll see `Active: inactive (dead)` on
the second line, and will need to enable and start the Docker service
using the following:

```console
$ sudo systemctl unmask docker
$ sudo systemctl enable docker
$ sudo systemctl start docker
```
```

--------------------------------------------------------------------------------

---[FILE: shared-vagrant-errors.md]---
Location: zulip-main/docs/development/setup/shared-vagrant-errors.md

```text
#### Vagrant guest doesn't show (zulip-server) at start of prompt

This is caused by provisioning failing to complete successfully. You
can see the errors in `var/log/provision.log`; it should end with
something like this:

```text
ESC[94mZulip development environment setup succeeded!ESC[0m
```

The `ESC` stuff are the terminal color codes that make it show as a nice
blue in the terminal, which unfortunately looks ugly in the logs.

If you encounter an incomplete `/var/log/provision.log file`, you need to
update your environment. Re-provision your Vagrant machine; if the problem
persists, please come chat with us (see instructions above) for help.

After you provision successfully, you'll need to exit your `vagrant ssh`
shell and run `vagrant ssh` again to get the virtualenv setup properly.

#### ssl read error

If you receive the following error while running `vagrant up`:

```console
SSL read: error:00000000:lib(0):func(0):reason(0), errno 104
```

It means that either your network connection is unstable and/or very
slow. To resolve it, run `vagrant up` until it works (possibly on a
better network connection).

#### ssh connection closed by remote host

On running `vagrant ssh`, if you see the following error:

```console
ssh_exchange_identification: Connection closed by remote host
```

It usually means the Vagrant guest is not running, which is usually
solved by rebooting the Vagrant guest via `vagrant halt; vagrant up`. See
[Vagrant was unable to communicate with the guest machine](/development/setup-recommended.md#vagrant-was-unable-to-communicate-with-the-guest-machine)
for more details.

#### Vagrant was unable to communicate with the guest machine

If you see the following error when you run `vagrant up`:

```console
Timed out while waiting for the machine to boot. This means that
Vagrant was unable to communicate with the guest machine within
the configured ("config.vm.boot_timeout" value) time period.

If you look above, you should be able to see the error(s) that
Vagrant had when attempting to connect to the machine. These errors
are usually good hints as to what may be wrong.

If you're using a custom box, make sure that networking is properly
working and you're able to connect to the machine. It is a common
problem that networking isn't setup properly in these boxes.
Verify that authentication configurations are also setup properly,
as well.

If the box appears to be booting properly, you may want to increase
the timeout ("config.vm.boot_timeout") value.
```

This has a range of possible causes, that usually amount to a bug in
Virtualbox or Vagrant. If you see this error, you usually can fix it
by rebooting the guest via `vagrant halt; vagrant up`.

#### Vagrant up fails with subprocess.CalledProcessError

The `vagrant up` command basically does the following:

- Downloads an Ubuntu image and starts it using a Vagrant provider.
- Uses `vagrant ssh` to connect to that Ubuntu guest, and then runs
  `tools/provision`, which has a lot of subcommands that are
  executed via Python's `subprocess` module. These errors mean that
  one of those subcommands failed.

To debug such errors, you can log in to the Vagrant guest machine by
running `vagrant ssh`, which should present you with a standard shell
prompt. You can debug interactively by using, for example,
`cd zulip && ./tools/provision`, and then running the individual
subcommands that failed. Once you've resolved the problem, you can
rerun `tools/provision` to proceed; the provisioning system is
designed to recover well from failures.

The Zulip provisioning system is generally highly reliable; the most common
cause of issues here is a poor network connection (or one where you need a
proxy to access the Internet and haven't [configured the development
environment to use it](/development/setup-recommended.md#specifying-a-proxy)).

Once you've provisioned successfully, you'll get output like this:

```console
Zulip development environment setup succeeded!
(zulip-server) vagrant@vagrant:/srv/zulip$
```

If the `(zulip-server)` part is missing, this is because your
installation failed the first time before the Zulip virtualenv was
created. You can fix this by just closing the shell and running
`vagrant ssh` again, or using `source .venv/bin/activate`.

Finally, if you encounter any issues that weren't caused by your
Internet connection, please report them! We try hard to keep Zulip
development environment provisioning free of bugs.

##### `pip install` fails during `vagrant up` on Linux

Likely causes are:

1. Networking issues
2. Insufficient RAM. Check whether you've allotted at least two
   gigabytes of RAM, which is the minimum Zulip
   [requires](/development/setup-recommended.md#requirements). If
   not, go to your VM settings and increase the RAM, then restart
   the VM.
```

--------------------------------------------------------------------------------

````

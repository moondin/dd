---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 253
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 253 of 1290)

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

---[FILE: unix-troubleshoot.md]---
Location: zulip-main/docs/development/setup/unix-troubleshoot.md

```text
#### Unmet dependencies error

When running `vagrant up` or `provision`, if you see the following error:

```console
==> default: E:unmet dependencies. Try 'apt-get -f install' with no packages (or specify a solution).
```

It means that your local apt repository has been corrupted, which can
usually be resolved by executing the command:

```console
$ apt-get -f install
```
```

--------------------------------------------------------------------------------

---[FILE: vagrant-halt.md]---
Location: zulip-main/docs/development/setup/vagrant-halt.md

```text
To shut down but preserve the development environment so you can use
it again later use `vagrant halt` or `vagrant suspend`.

You can do this from the same Terminal/Git BASH window that is running
run-dev by pressing ^C to halt the server and then typing `exit`. Or you
can halt Vagrant from another Terminal/Git BASH window.

From the window where run-dev is running:

```console
2016-05-04 18:33:13,330 INFO     127.0.0.1       GET     200  92ms /register/ (unauth@zulip via ?)
^C
KeyboardInterrupt
(zulip-server) vagrant@vagrant:/srv/zulip$ exit
logout
Connection to 127.0.0.1 closed.
$
```

Now you can suspend the development environment:

```console
$ vagrant suspend
==> default: Saving VM state and suspending execution...
```

If `vagrant suspend` doesn't work, try `vagrant halt`:

```console
$ vagrant halt
==> default: Attempting graceful shutdown of VM...
```

Check out the Vagrant documentation to learn more about
[suspend](https://www.vagrantup.com/docs/cli/suspend.html) and
[halt](https://www.vagrantup.com/docs/cli/halt.html).
```

--------------------------------------------------------------------------------

---[FILE: vagrant-rebuild.md]---
Location: zulip-main/docs/development/setup/vagrant-rebuild.md

```text
If you ever want to recreate your development environment again from
scratch (e.g., to test a change you've made to the provisioning
process, or because you think something is broken), you can do so
using `vagrant destroy` and then `vagrant up`. This will usually be
much faster than the original `vagrant up` since the base image is
already cached on your machine (it takes about 5 minutes to run with a
fast Internet connection).

Any additional programs (e.g., Zsh, emacs, etc.) or configuration that
you may have installed in the development environment will be lost
when you recreate it. To address this, you can create a script called
`tools/custom_provision` in your Zulip Git checkout; and place any
extra setup commands there. Vagrant will run `tools/custom_provision`
every time you run `vagrant provision` (or create a Vagrant guest via
`vagrant up`).
```

--------------------------------------------------------------------------------

---[FILE: vagrant-resume.md]---
Location: zulip-main/docs/development/setup/vagrant-resume.md

```text
When you're ready to work on Zulip again, run `vagrant up` (no need to
pass the `--provider` option required above). You will also need to
connect to the virtual machine with `vagrant ssh` and re-start the
Zulip server:

```console
$ vagrant up
$ vagrant ssh

(zulip-server) vagrant@vagrant:/srv/zulip$ ./tools/run-dev
```
```

--------------------------------------------------------------------------------

---[FILE: vagrant-ssh.md]---
Location: zulip-main/docs/development/setup/vagrant-ssh.md

```text
Once `vagrant up` has completed, connect to the development environment
with `vagrant ssh`:

```console
$ vagrant ssh
```

You should see output that starts like this:

```console
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-92-generic x86_64)
```

Congrats, you're now inside the Zulip development environment!

You can confirm this by looking at the command prompt, which starts
with `(zulip-server) vagrant@`. If it just starts with `vagrant@`, your
provisioning failed and you should look at the
[troubleshooting section](/development/setup-recommended.md#troubleshooting-and-common-errors).

Next, start the Zulip server:

```console
(zulip-server) vagrant@vagrant:/srv/zulip$ ./tools/run-dev
```

You will see something like:

```console
Starting Zulip on:

        http://localhost:9991/

Internal ports:
   9991: Development server proxy (connect here)
   9992: Django
   9993: Tornado
   9994: webpack

Tornado server (re)started on port 9993

2023-12-15 20:57:14.206 INFO [process_queue] 13 queue worker threads were launched
frontend:
  frontend (webpack 5.89.0) compiled successfully in 8054 ms
```

Now the Zulip server should be running and accessible. Verify this by
navigating to <http://localhost:9991/devlogin> in the browser on your main machine.

You should see something like this:

![Image of Zulip devlogin](/images/zulip-devlogin.png)

The Zulip server will continue to run and send output to the terminal window.
When you navigate to Zulip in your browser, check your terminal and you
should see something like:

```console
2016-05-04 18:21:57,547 INFO     127.0.0.1       GET     302 582ms (+start: 417ms) / (unauth@zulip via ?)
[04/May/2016 18:21:57]"GET / HTTP/1.0" 302 0
2016-05-04 18:21:57,568 INFO     127.0.0.1       GET     301   4ms /login (unauth@zulip via ?)
[04/May/2016 18:21:57]"GET /login HTTP/1.0" 301 0
2016-05-04 18:21:57,819 INFO     127.0.0.1       GET     200 209ms (db: 7ms/2q) /login/ (unauth@zulip via ?)
```
```

--------------------------------------------------------------------------------

---[FILE: vagrant-up.md]---
Location: zulip-main/docs/development/setup/vagrant-up.md

```text
The first time you run this command it will take some time because Vagrant
does the following:

- downloads the base Ubuntu 22.04 virtual machine/Docker image
- configures this virtual machine/container for use with Zulip,
- creates a shared directory mapping your clone of the Zulip code inside the
  virtual machine/container at `~/zulip`
- runs the `./tools/provision` script inside the virtual machine/container, which
  downloads all required dependencies, sets up the Python environment for
  the Zulip development server, and initializes a default test
  database. We call this process "provisioning", and it is documented
  in some detail in our [dependencies documentation](/subsystems/dependencies.md).

You will need an active internet connection during the entire
process. (See [Specifying a proxy](/development/setup-recommended.md#specifying-a-proxy) if you need a
proxy to access the internet.) `vagrant up` can fail while
provisioning if your Internet connection is unreliable. To retry, you
can use `vagrant provision` (`vagrant up` will just boot the guest
without provisioning after the first time). Other common issues are
documented in the
[Troubleshooting and common errors](/development/setup-recommended.md#troubleshooting-and-common-errors)
section. If that doesn't help, please visit
[#provision help](https://chat.zulip.org/#narrow/channel/21-provision-help)
in the [Zulip development community server](https://zulip.com/development-community/) for
real-time help.
```

--------------------------------------------------------------------------------

---[FILE: vagrant-update.md]---
Location: zulip-main/docs/development/setup/vagrant-update.md

```text
If after rebasing onto a new version of the Zulip server, you receive
new errors while starting the Zulip server or running tests, this is
probably not because Zulip's `main` branch is broken. Instead, this
is likely because we've recently merged changes to the development
environment provisioning process that you need to apply to your
development environment. To update your environment, you'll need to
re-provision your Vagrant machine using `vagrant provision` (this just
runs `tools/provision` from your Zulip checkout inside the Vagrant
guest); this should complete in about a minute.

After provisioning, you'll want to
[(re)start the Zulip development server](/development/setup-recommended.md#step-3-start-the-development-environment).

If you run into any trouble, [#provision
help](https://chat.zulip.org/#narrow/channel/21-provision-help) in the
[Zulip development community
server](https://zulip.com/development-community/) is a great place to ask for
help.
```

--------------------------------------------------------------------------------

---[FILE: vscode-vagrant.md]---
Location: zulip-main/docs/development/setup/vscode-vagrant.md

```text
If your preferred editor is Visual Studio Code, the [Visual Studio
Code Remote - SSH](https://code.visualstudio.com/docs/remote/ssh)
extension is recommended for editing files when developing with
Vagrant. When you have it installed, you can run:

```console
$ code .
```

to open VS Code connected to your Vagrant environment. See the
[Remote development over SSH](https://code.visualstudio.com/docs/remote/ssh-tutorial) tutorial for more information.

When using this plugin with Vagrant, you will want to run the command
`vagrant ssh-config` from your `zulip` folder:

```console
$ vagrant ssh-config
Host default
  HostName 127.0.0.1
  User vagrant
  Port 2222
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile /PATH/TO/zulip/.vagrant/machines/default/docker/private_key
  IdentitiesOnly yes
  LogLevel FATAL
  PubkeyAcceptedKeyTypes +ssh-rsa
  HostKeyAlgorithms +ssh-rsa
```

Then copy that config into your `~/.ssh/config` file. You may want to change
the host name from `default` to something more descriptive, like `zulip`.
Finally, refresh the known remotes in Visual Studio Code's Remote Explorer.
```

--------------------------------------------------------------------------------

---[FILE: winvm-troubleshoot.md]---
Location: zulip-main/docs/development/setup/winvm-troubleshoot.md

```text
#### Vagrant was unable to mount VirtualBox shared folders

For the following error:

```console
Vagrant was unable to mount VirtualBox shared folders. This is usually
because the filesystem "vboxsf" is not available. This filesystem is
made available via the VirtualBox Guest Additions and kernel
module. Please verify that these guest additions are properly
installed in the guest. This is not a bug in Vagrant and is usually
caused by a faulty Vagrant box. For context, the command attempted
was:

 mount -t vboxsf -o uid=1000,gid=1000 keys /keys
```

If this error starts happening unexpectedly, then just run:

```console
$ vagrant halt
$ vagrant up
```

to reboot the guest. After this, you can do `vagrant provision` and
`vagrant ssh`.

#### os.symlink error

If you receive the following error while running `vagrant up`:

```console
==> default: Traceback (most recent call last):
==> default: File "./emoji_dump.py", line 75, in <module>
==> default:
==> default: os.symlink('unicode/{}.png'.format(code_point), 'out/{}.png'.format(name))
==> default: OSError
==> default: :
==> default: [Errno 71] Protocol error
```

Then Vagrant was not able to create a symbolic link.

First, if you are using Windows, **make sure you have run Git BASH (or
Cygwin) as an administrator**. By default, only administrators can
create symbolic links on Windows. Additionally [UAC][windows-uac], a
Windows feature intended to limit the impact of malware, can prevent
even administrator accounts from creating symlinks. [Turning off
UAC][disable-uac] will allow you to create symlinks. You can also try
some of the solutions mentioned
[here](https://superuser.com/questions/124679/how-do-i-create-a-link-in-windows-7-home-premium-as-a-regular-user).

[windows-uac]: https://docs.microsoft.com/en-us/windows/security/identity-protection/user-account-control/how-user-account-control-works
[disable-uac]: https://stackoverflow.com/questions/15320550/why-is-secreatesymboliclinkprivilege-ignored-on-windows-8

If you ran Git BASH as administrator but you already had VirtualBox
running, you might still get this error because VirtualBox is not
running as administrator. In that case: close the Zulip VM with
`vagrant halt`; close any other VirtualBox VMs that may be running;
exit VirtualBox; and try again with `vagrant up --provision` from a
Git BASH running as administrator.

Second, VirtualBox does not enable symbolic links by default. Vagrant
starting with version 1.6.0 enables symbolic links for VirtualBox shared
folder.

You can check to see that this is enabled for your virtual machine with
`vboxmanage` command.

Get the name of your virtual machine by running `vboxmanage list vms` and
then print out the custom settings for this virtual machine with
`vboxmanage getextradata YOURVMNAME enumerate`:

```console
$ vboxmanage list vms
"zulip_default_1462498139595_55484" {5a65199d-8afa-4265-b2f6-6b1f162f157d}

$ vboxmanage getextradata zulip_default_1462498139595_55484 enumerate
Key: VBoxInternal2/SharedFoldersEnableSymlinksCreate/srv_zulip, Value: 1
Key: supported, Value: false
```

If you see "command not found" when you try to run VBoxManage, you need to
add the VirtualBox directory to your path. On Windows this is mostly likely
`C:\Program Files\Oracle\VirtualBox\`.

If `vboxmanage enumerate` prints nothing, or shows a value of 0 for
VBoxInternal2/SharedFoldersEnableSymlinksCreate/srv_zulip, then enable
symbolic links by running this command in Terminal/Git BASH/Cygwin:

```console
$ vboxmanage setextradata YOURVMNAME VBoxInternal2/SharedFoldersEnableSymlinksCreate/srv_zulip 1
```

The virtual machine needs to be shut down when you run this command.

#### Hyper-V error messages

If you get an error message on Windows about lack of Windows Home
support for Hyper-V when running `vagrant up`, the problem is that
Windows is incorrectly attempting to use Hyper-V rather than
Virtualbox as the virtualization provider. You can fix this by
explicitly passing the virtualbox provider to `vagrant up`:

```console
$ vagrant up --provide=virtualbox
```

#### Connection timeout on `vagrant up`

If you see the following error after running `vagrant up`:

```console
default: SSH address: 127.0.0.1:2222
default: SSH username: vagrant
default: SSH auth method: private key
default: Error: Connection timeout. Retrying...
default: Error: Connection timeout. Retrying...
default: Error: Connection timeout. Retrying...
```

A likely cause is that hardware virtualization is not enabled for your
computer. This must be done via your computer's BIOS settings. Look for a
setting called VT-x (Intel) or (AMD-V).

If this is already enabled in your BIOS, double-check that you are running a
64-bit operating system.

For further information about troubleshooting Vagrant timeout errors [see
this post](https://stackoverflow.com/questions/22575261/vagrant-stuck-connection-timeout-retrying#22575302).

#### VBoxManage errors related to VT-x or WHvSetupPartition

```console
There was an error while executing `VBoxManage`, a CLI used by Vagrant
for controlling VirtualBox. The command and stderr is shown below.

Command: ["startvm", "8924a681-b4e4-4b7a-96f2-4cb11619f123", "--type", "headless"]

Stderr: VBoxManage.exe: error: (VERR_NEM_MISSING_KERNEL_API).
VBoxManage.exe: error: VT-x is not available (VERR_VMX_NO_VMX)
VBoxManage.exe: error: Details: code E_FAIL (0x80004005), component ConsoleWrap, interface IConsole
```

or

```console
Stderr: VBoxManage.exe: error: Call to WHvSetupPartition failed: ERROR_SUCCESS (Last=0xc000000d/87) (VERR_NEM_VM_CREATE_FAILED)
VBoxManage.exe: error: Details: code E_FAIL (0x80004005), component ConsoleWrap, interface IConsole
```

First, ensure that hardware virtualization support (VT-x or AMD-V) is
enabled in your BIOS.

If the error persists, you may have run into an incompatibility
between VirtualBox and Hyper-V on Windows. To disable Hyper-V, open
command prompt as administrator, run
`bcdedit /set hypervisorlaunchtype off`, and reboot. If you need to
enable it later, run `bcdedit /deletevalue hypervisorlaunchtype`, and
reboot.

#### OSError: [Errno 26] Text file busy

```console
default: Traceback (most recent call last):
…
default:   File "/srv/zulip-py3-venv/lib/python3.6/shutil.py", line 426, in _rmtree_safe_fd
default:     os.rmdir(name, dir_fd=topfd)
default: OSError: [Errno 26] Text file busy: 'baremetrics'
```

This error is caused by a
[bug](https://www.virtualbox.org/ticket/19004) in recent versions of
the VirtualBox Guest Additions for Linux on Windows hosts. You can
check the running version of VirtualBox Guest Additions with this
command:

```console
$ vagrant ssh -- 'sudo modinfo -F version vboxsf'
```

The bug has not been fixed upstream as of this writing, but you may be
able to work around it by downgrading VirtualBox Guest Additions to
5.2.44. To do this, create a `~/.zulip-vagrant-config` file and add
this line:

```text
VBOXADD_VERSION 5.2.44
```

Then run these commands (yes, reload is needed twice):

```console
$ vagrant plugin install vagrant-vbguest
$ vagrant reload
$ vagrant reload --provision
```
```

--------------------------------------------------------------------------------

---[FILE: wsl-rebuild.md]---
Location: zulip-main/docs/development/setup/wsl-rebuild.md

```text
If you ever want to recreate your development environment again from
scratch (e.g., to test a change you've made to the provisioning
process, or because you think something is broken), you can do so
using the following steps:

1. To find the distribution name to unregister (delete), open Command
   Prompt or PowerShell and use the following command:

```console
$ wsl --list --verbose
```

If you are unsure about which distribution to unregister, you can log
into the WSL distributions to ensure you are deleting the one
containing your development environment using the command:

```console
wsl -d <Distribution Name>
```

2. To uninstall your WSL distribution, enter the command:

```console
$ wsl --unregister <Distribution Name>
```

For more information, checkout the [official documentation for WSL
commands](https://learn.microsoft.com/en-us/windows/wsl/basic-commands#unregister-or-uninstall-a-linux-distribution)

3. **Next, follow the setup instructions**, starting from [[Step 1:
Install
prerequisites]](/development/setup-recommended.md#step-1-install-prerequisites)

If you just want to rebuild the development database, the following is
much faster:

```console
$ ./tools/rebuild-dev-database
```

For more details, see the [schema migration
documentation](/subsystems/schema-migrations.md#schema-and-initial-data-changes).
```

--------------------------------------------------------------------------------

---[FILE: wsl-troubleshoot.md]---
Location: zulip-main/docs/development/setup/wsl-troubleshoot.md

```text
WSL2 users often encounter issues where services fail to start or remain inactive. Follow the steps below to diagnose and resolve such problems.

#### 1. Check the Status of the Service

To verify if a service is running, use the following command:

```console
$ systemctl status <service_name>
```

If the service is inactive, you can attempt to start it with:

```console
$ systemctl start <service_name>
```

#### 2. Diagnose Port Conflicts

Services like `postgresql` may fail to start due to port conflicts. These conflicts can be caused by:

- Other services running in Windows.
- Services running in another WSL2 instance.

#### Resolving Port Conflicts with Other WSL Instances

To resolve port conflicts with another WSL2 instance, stop the conflicting instance using the following command:

```console
> wsl -t <WSL_Instance_Name>
```

After stopping the conflicting instance, restart your WSL instance with:

```console
> wsl -d <Your_Zulip_Instance_Name>
```

#### Resolving Port Conflicts with Services Running on Windows

To resolve conflicts caused by Windows processes:

1. Identify the process using the conflicting port by running:

```console
> Get-Process -Id (Get-NetTCPConnection -LocalPort <your_port_number>).OwningProcess
```

2. If a process is found, terminate it using:

```console
> taskkill /PID <pid> /F
```

3. Restart the Service or Enable Auto-Start

After resolving port conflicts, try restarting the service using:

```console
$ systemctl start <service_name>
```

To ensure the service always starts on boot, enable it with:

```console
$ systemctl enable <service_name>
```

---

#### Additional Tips

- Use `wsl --list` to view all running WSL2 instances and their states.
- Avoid overlapping port usage between WSL2 instances and Windows processes.
- Keep a record of services and their associated port numbers to prevent conflicts in the future.
- Ensure that you use a fresh WSL instance to setup the Zulip development environment to avoid dependency conflicts.
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 160
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 160 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: resources/linux/snap/electron-launch]---
Location: vscode-main/resources/linux/snap/electron-launch

```text
#!/usr/bin/env bash

# On Fedora $SNAP is under /var and there is some magic to map it to /snap.
# We need to handle that case and reset $SNAP
SNAP=$(echo "$SNAP" | sed -e "s|/var/lib/snapd||g")

#
# Exports are based on https://github.com/snapcore/snapcraft/blob/master/extensions/desktop/common/desktop-exports
#

# ensure_dir_exists calls `mkdir -p` if the given path is not a directory.
# This speeds up execution time by avoiding unnecessary calls to mkdir.
#
# Usage: ensure_dir_exists <path> [<mkdir-options>]...
#
function ensure_dir_exists() {
  [ -d "$1" ] || mkdir -p "$@"
}

declare -A PIDS
function async_exec() {
  "$@" &
  PIDS[$!]=$*
}
function wait_for_async_execs() {
  for pid in "${!PIDS[@]}"
  do
    wait "$pid" && continue || echo "ERROR: ${PIDS[$pid]} exited abnormally with status $?"
  done
}

function prepend_dir() {
  local -n var="$1"
  local dir="$2"
  # We can't check if the dir exists when the dir contains variables
  if [[ "$dir" == *"\$"*  || -d "$dir" ]]; then
    export "${!var}=${dir}${var:+:$var}"
  fi
}

function append_dir() {
  local -n var="$1"
  local dir="$2"
  # We can't check if the dir exists when the dir contains variables
  if [[ "$dir" == *"\$"*  || -d "$dir" ]]; then
    export "${!var}=${var:+$var:}${dir}"
  fi
}

function copy_env_variable() {
  local -n var="$1"
  if [[ "+$var" ]]; then
    export "${!var}_VSCODE_SNAP_ORIG=${var}"
  else
    export "${!var}_VSCODE_SNAP_ORIG=''"
  fi
}

# shellcheck source=/dev/null
source "$SNAP_USER_DATA/.last_revision" 2>/dev/null || true
if [ "$SNAP_DESKTOP_LAST_REVISION" = "$SNAP_VERSION" ]; then
  needs_update=false
else
  needs_update=true
fi

# Set $REALHOME to the users real home directory
REALHOME=$(getent passwd $UID | cut -d ':' -f 6)

# Set config folder to local path
ensure_dir_exists "$SNAP_USER_DATA/.config"
chmod 700 "$SNAP_USER_DATA/.config"

if [ "$SNAP_ARCH" == "amd64" ]; then
  ARCH="x86_64-linux-gnu"
elif [ "$SNAP_ARCH" == "armhf" ]; then
  ARCH="arm-linux-gnueabihf"
elif [ "$SNAP_ARCH" == "arm64" ]; then
  ARCH="aarch64-linux-gnu"
else
  ARCH="$SNAP_ARCH-linux-gnu"
fi

export SNAP_LAUNCHER_ARCH_TRIPLET="$ARCH"

function is_subpath() {
  dir="$(realpath "$1")"
  parent="$(realpath "$2")"
  [ "${dir##"${parent}"/}" != "${dir}" ] && return 0 || return 1
}

function can_open_file() {
  [ -f "$1" ] && [ -r "$1" ]
}

# Preserve system variables that get modified below
copy_env_variable XDG_CONFIG_DIRS
copy_env_variable XDG_DATA_DIRS
copy_env_variable XDG_DATA_HOME
copy_env_variable LOCPATH
copy_env_variable GIO_MODULE_DIR
copy_env_variable GSETTINGS_SCHEMA_DIR
copy_env_variable GDK_PIXBUF_MODULE_FILE
copy_env_variable GDK_PIXBUF_MODULEDIR
copy_env_variable GDK_BACKEND
copy_env_variable GTK_PATH
copy_env_variable GTK_EXE_PREFIX
copy_env_variable GTK_IM_MODULE_FILE

# XDG Config
prepend_dir XDG_CONFIG_DIRS "$SNAP/etc/xdg"

# Define snaps' own data dir
prepend_dir XDG_DATA_DIRS "$SNAP/usr/share"
prepend_dir XDG_DATA_DIRS "$SNAP/share"
prepend_dir XDG_DATA_DIRS "$SNAP/data-dir"
prepend_dir XDG_DATA_DIRS "$SNAP_USER_DATA"

# Set XDG_DATA_HOME to local path
export XDG_DATA_HOME="$SNAP_USER_DATA/.local/share"
ensure_dir_exists "$XDG_DATA_HOME"

# Workaround for GLib < 2.53.2 not searching for schemas in $XDG_DATA_HOME:
#   https://bugzilla.gnome.org/show_bug.cgi?id=741335
prepend_dir XDG_DATA_DIRS "$XDG_DATA_HOME"

# Set cache folder to local path
if [[ -d "$SNAP_USER_DATA/.cache" && ! -e "$SNAP_USER_COMMON/.cache" ]]; then
  # the .cache directory used to be stored under $SNAP_USER_DATA, migrate it
  mv "$SNAP_USER_DATA/.cache" "$SNAP_USER_COMMON/"
fi
ensure_dir_exists "$SNAP_USER_COMMON/.cache"

# Create $XDG_RUNTIME_DIR if not exists (to be removed when LP: #1656340 is fixed)
# shellcheck disable=SC2174
ensure_dir_exists "$XDG_RUNTIME_DIR" -m 700

# Ensure the app finds locale definitions (requires locales-all to be installed)
append_dir LOCPATH "$SNAP/usr/lib/locale"

# If detect wayland server socket, then set environment so applications prefer
# wayland, and setup compat symlink (until we use user mounts. Remember,
# XDG_RUNTIME_DIR is /run/user/<uid>/snap.$SNAP so look in the parent directory
# for the socket. For details:
# https://forum.snapcraft.io/t/wayland-dconf-and-xdg-runtime-dir/186/10
# Applications that don't support wayland natively may define DISABLE_WAYLAND
# (to any non-empty value) to skip that logic entirely.
wayland_available=false
if [[ -n "$XDG_RUNTIME_DIR" && -z "$DISABLE_WAYLAND" ]]; then
    wdisplay="wayland-0"
    if [ -n "$WAYLAND_DISPLAY" ]; then
        wdisplay="$WAYLAND_DISPLAY"
    fi
    wayland_sockpath="$XDG_RUNTIME_DIR/../$wdisplay"
    wayland_snappath="$XDG_RUNTIME_DIR/$wdisplay"
    if [ -S "$wayland_sockpath" ]; then
        # if running under wayland, use it
        #export WAYLAND_DEBUG=1
        # shellcheck disable=SC2034
        wayland_available=true
        # create the compat symlink for now
        if [ ! -e "$wayland_snappath" ]; then
            ln -s "$wayland_sockpath" "$wayland_snappath"
        fi
    fi
fi

# Keep an array of data dirs, for looping through them
IFS=':' read -r -a data_dirs_array <<< "$XDG_DATA_DIRS"

# Font Config
export FONTCONFIG_PATH="/etc/fonts"
export FONTCONFIG_FILE="/etc/fonts/fonts.conf"

if [ "$needs_update" = true ]; then
  rm -rf "$XDG_DATA_HOME"/fonts

  if [ -d "$SNAP_REAL_HOME/.local/share/fonts" ]; then
    ln -s "$SNAP_REAL_HOME/.local/share/fonts" "$XDG_DATA_HOME/fonts"
  fi
fi

# Build mime.cache needed for gtk and qt icon
# TODO(deepak1556): Re-enable this once we move to core22
# Refs https://github.com/microsoft/vscode/issues/230454#issuecomment-2418352959
if [ "$needs_update" = true ]; then
  rm -rf "$XDG_DATA_HOME/mime"
#  if [ ! -f "$SNAP/usr/share/mime/mime.cache" ]; then
#    if command -v $SNAP/usr/bin/update-mime-database >/dev/null; then
#      cp --preserve=timestamps -dR "$SNAP/usr/share/mime" "$XDG_DATA_HOME"
#      async_exec $SNAP/usr/bin/update-mime-database "$XDG_DATA_HOME/mime"
#    fi
#  fi
fi

# Gio modules and cache (including gsettings module)
export GIO_MODULE_DIR="$SNAP_USER_COMMON/.cache/gio-modules"
function compile_giomodules {
  if [ -f "$1/glib-2.0/gio-querymodules" ]; then
    rm -rf "$GIO_MODULE_DIR"
    ensure_dir_exists "$GIO_MODULE_DIR"
    ln -s "$SNAP"/usr/lib/"$ARCH"/gio/modules/*.so "$GIO_MODULE_DIR"
    "$1/glib-2.0/gio-querymodules" "$GIO_MODULE_DIR"
  fi
}
if [ "$needs_update" = true ]; then
  async_exec compile_giomodules "/snap/core20/current/usr/lib/$ARCH"
fi

# Setup compiled gsettings schema
export GSETTINGS_SCHEMA_DIR="$SNAP_USER_DATA/.local/share/glib-2.0/schemas"
function compile_schemas {
  if [ -f "$1" ]; then
    rm -rf "$GSETTINGS_SCHEMA_DIR"
    ensure_dir_exists "$GSETTINGS_SCHEMA_DIR"
    for ((i = 0; i < ${#data_dirs_array[@]}; i++)); do
      schema_dir="${data_dirs_array[$i]}/glib-2.0/schemas"
      if [ -f "$schema_dir/gschemas.compiled" ]; then
        # This directory already has compiled schemas
        continue
      fi
      if [ -n "$(ls -A "$schema_dir"/*.xml 2>/dev/null)" ]; then
        ln -s "$schema_dir"/*.xml "$GSETTINGS_SCHEMA_DIR"
      fi
      if [ -n "$(ls -A "$schema_dir"/*.override 2>/dev/null)" ]; then
        ln -s "$schema_dir"/*.override "$GSETTINGS_SCHEMA_DIR"
      fi
    done
    # Only compile schemas if we copied anything
    if [ -n "$(ls -A "$GSETTINGS_SCHEMA_DIR"/*.xml "$GSETTINGS_SCHEMA_DIR"/*.override 2>/dev/null)" ]; then
      "$1" "$GSETTINGS_SCHEMA_DIR"
    fi
  fi
}
if [ "$needs_update" = true ]; then
  async_exec compile_schemas "/snap/core20/current/usr/lib/$ARCH/glib-2.0/glib-compile-schemas"
fi

# Gdk-pixbuf loaders
export GDK_PIXBUF_MODULE_FILE="$SNAP_USER_COMMON/.cache/gdk-pixbuf-loaders.cache"
export GDK_PIXBUF_MODULEDIR="$SNAP/usr/lib/$ARCH/gdk-pixbuf-2.0/2.10.0/loaders"
if [ "$needs_update" = true ] || [ ! -f "$GDK_PIXBUF_MODULE_FILE" ]; then
  rm -f "$GDK_PIXBUF_MODULE_FILE"
  if [ -f "$SNAP/usr/lib/$ARCH/gdk-pixbuf-2.0/gdk-pixbuf-query-loaders" ]; then
    async_exec "$SNAP/usr/lib/$ARCH/gdk-pixbuf-2.0/gdk-pixbuf-query-loaders" > "$GDK_PIXBUF_MODULE_FILE"
  fi
fi

# shellcheck disable=SC2154
if [ "$wayland_available" = true ]; then
  export GDK_BACKEND="wayland"
fi

append_dir GTK_PATH "$SNAP/usr/lib/$ARCH/gtk-3.0"
append_dir GTK_PATH "$SNAP/usr/lib/gtk-3.0"
# We don't have gtk libraries in this path but
# enforcing this environment variable will disallow
# gtk binaries like `gtk-query-immodules` to not search
# in system default library paths.
# Based on https://gitlab.gnome.org/GNOME/gtk/-/blob/main/gtk/gtkmodules.c#L104-136
export GTK_EXE_PREFIX="$SNAP/usr"

# ibus and fcitx integration
GTK_IM_MODULE_DIR="$SNAP_USER_COMMON/.cache/immodules"
export GTK_IM_MODULE_FILE="$GTK_IM_MODULE_DIR/immodules.cache"
# shellcheck disable=SC2154
if [ "$needs_update" = true ]; then
  rm -rf "$GTK_IM_MODULE_DIR"
  ensure_dir_exists "$GTK_IM_MODULE_DIR"
  ln -s "$SNAP"/usr/lib/"$ARCH"/gtk-3.0/3.0.0/immodules/*.so "$GTK_IM_MODULE_DIR"
  async_exec "$SNAP/usr/lib/$ARCH/libgtk-3-0/gtk-query-immodules-3.0" > "$GTK_IM_MODULE_FILE"
fi

# shellcheck disable=SC2154
[ "$needs_update" = true ] && echo "SNAP_DESKTOP_LAST_REVISION=$SNAP_VERSION" > "$SNAP_USER_DATA/.last_revision"

wait_for_async_execs

exec "$@" --ozone-platform=x11
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/snap/snapcraft.yaml]---
Location: vscode-main/resources/linux/snap/snapcraft.yaml

```yaml
name: @@NAME@@
version: '@@VERSION@@'
summary: Code editing. Redefined.
description: |
  Visual Studio Code is a new choice of tool that combines the
  simplicity of a code editor with what developers need for the core
  edit-build-debug cycle.

architectures:
  - build-on: amd64
    run-on: @@ARCHITECTURE@@

grade: stable
confinement: classic
base: core20
compression: lzo

parts:
  code:
    plugin: dump
    source: .
    stage-packages:
      - ca-certificates
      - libasound2
      - libatk-bridge2.0-0
      - libatk1.0-0
      - libatspi2.0-0
      - libcairo2
      - libcanberra-gtk3-module
      - libcurl3-gnutls
      - libcurl3-nss
      - libcurl4
      - libegl1
      - libdrm2
      - libgbm1
      - libgl1
      - libgles2
      - libglib2.0-0
      - libgtk-3-0
      - libibus-1.0-5
      - libnss3
      - libpango-1.0-0
      - libsecret-1-0
      - libwayland-egl1
      - libxcomposite1
      - libxdamage1
      - libxfixes3
      - libxkbcommon0
      - libxkbfile1
      - libxrandr2
      - libxss1
      - locales-all
      - packagekit-gtk3-module
      - xdg-utils
    prime:
      - -usr/share/doc
      - -usr/share/fonts
      - -usr/share/icons
      - -usr/share/lintian
      - -usr/share/man
    override-build: |
      snapcraftctl build
      patchelf --force-rpath --set-rpath '$ORIGIN/../../lib/x86_64-linux-gnu:$ORIGIN:/snap/core20/current/lib/x86_64-linux-gnu' $SNAPCRAFT_PART_INSTALL/usr/share/@@NAME@@/chrome_crashpad_handler
      chmod 0755 $SNAPCRAFT_PART_INSTALL/usr/share/@@NAME@@/chrome-sandbox
  cleanup:
    after:
      - code
    plugin: nil
    build-snaps:
      - core20
    override-prime: |
      set -eux
      for snap in "core20"; do
        cd "/snap/$snap/current" && find . -type f,l -exec rm -f "$SNAPCRAFT_PRIME/{}" \;
      done
      patchelf --print-rpath $SNAPCRAFT_PRIME/usr/share/@@NAME@@/chrome_crashpad_handler


apps:
  @@NAME@@:
    command: electron-launch $SNAP/usr/share/@@NAME@@/bin/@@NAME@@ --no-sandbox
    common-id: @@NAME@@.desktop

  url-handler:
    command: electron-launch $SNAP/usr/share/@@NAME@@/bin/@@NAME@@ --open-url --no-sandbox
```

--------------------------------------------------------------------------------

---[FILE: resources/server/manifest.json]---
Location: vscode-main/resources/server/manifest.json

```json
{
	"name": "Code - OSS",
	"short_name": "Code- OSS",
	"start_url": "/",
	"lang": "en-US",
	"display": "standalone",
	"display_override": ["window-controls-overlay"],
	"icons": [
		{
			"src": "code-192.png",
			"type": "image/png",
			"sizes": "192x192"
		},
		{
			"src": "code-512.png",
			"type": "image/png",
			"sizes": "512x512"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/code-server-darwin.sh]---
Location: vscode-main/resources/server/bin/code-server-darwin.sh

```bash
#!/usr/bin/env bash
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#

case "$1" in
	--inspect*) INSPECT="$1"; shift;;
esac

realdir() {
	SOURCE=$1
	while [ -h "$SOURCE" ]; do
		DIR=$(dirname "$SOURCE")
		SOURCE=$(readlink "$SOURCE")
		[[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE
	done
	echo "$( cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd )"
}

ROOT="$(dirname "$(realdir "$0")")"

"$ROOT/node" ${INSPECT:-} "$ROOT/out/server-main.js" "$@"
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/code-server-linux.sh]---
Location: vscode-main/resources/server/bin/code-server-linux.sh

```bash
#!/usr/bin/env sh
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#

case "$1" in
	--inspect*) INSPECT="$1"; shift;;
esac

ROOT="$(dirname "$(dirname "$(readlink -f "$0")")")"

# Set rpath before changing the interpreter path
# Refs https://github.com/NixOS/patchelf/issues/524
if [ -n "$VSCODE_SERVER_CUSTOM_GLIBC_LINKER" ] && [ -n "$VSCODE_SERVER_CUSTOM_GLIBC_PATH" ] && [ -n "$VSCODE_SERVER_PATCHELF_PATH" ]; then
	echo "Patching glibc from $VSCODE_SERVER_CUSTOM_GLIBC_PATH with $VSCODE_SERVER_PATCHELF_PATH..."
	"$VSCODE_SERVER_PATCHELF_PATH" --set-rpath "$VSCODE_SERVER_CUSTOM_GLIBC_PATH" "$ROOT/node"
	echo "Patching linker from $VSCODE_SERVER_CUSTOM_GLIBC_LINKER with $VSCODE_SERVER_PATCHELF_PATH..."
	"$VSCODE_SERVER_PATCHELF_PATH" --set-interpreter "$VSCODE_SERVER_CUSTOM_GLIBC_LINKER" "$ROOT/node"
	echo "Patching complete."
fi

"$ROOT/node" ${INSPECT:-} "$ROOT/out/server-main.js" "$@"
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/code-server.cmd]---
Location: vscode-main/resources/server/bin/code-server.cmd

```bat
@echo off
setlocal

set ROOT_DIR=%~dp0..

set _FIRST_ARG=%1
if "%_FIRST_ARG:~0,9%"=="--inspect" (
	set INSPECT=%1
	shift
) else (
	set INSPECT=
)

:loop1
if "%~1"=="" goto after_loop
set RESTVAR=%RESTVAR% %1
shift
goto loop1

:after_loop

"%ROOT_DIR%\node.exe" %INSPECT% "%ROOT_DIR%\out\server-main.js" %RESTVAR%

endlocal
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/helpers/browser-darwin.sh]---
Location: vscode-main/resources/server/bin/helpers/browser-darwin.sh

```bash
#!/usr/bin/env bash
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#
realdir() {
	SOURCE=$1
	while [ -h "$SOURCE" ]; do
		DIR=$(dirname "$SOURCE")
		SOURCE=$(readlink "$SOURCE")
		[[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE
	done
	echo "$( cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd )"
}

ROOT="$(dirname "$(dirname "$(realdir "$0")")")"

APP_NAME="@@APPNAME@@"
VERSION="@@VERSION@@"
COMMIT="@@COMMIT@@"
EXEC_NAME="@@APPNAME@@"
CLI_SCRIPT="$ROOT/out/server-cli.js"
"$ROOT/node" "$CLI_SCRIPT" "$APP_NAME" "$VERSION" "$COMMIT" "$EXEC_NAME" "--openExternal" "$@"
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/helpers/browser-linux.sh]---
Location: vscode-main/resources/server/bin/helpers/browser-linux.sh

```bash
#!/usr/bin/env sh
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#
ROOT="$(dirname "$(dirname "$(dirname "$(readlink -f "$0")")")")"

APP_NAME="@@APPNAME@@"
VERSION="@@VERSION@@"
COMMIT="@@COMMIT@@"
EXEC_NAME="@@APPNAME@@"
CLI_SCRIPT="$ROOT/out/server-cli.js"
"$ROOT/node" "$CLI_SCRIPT" "$APP_NAME" "$VERSION" "$COMMIT" "$EXEC_NAME" "--openExternal" "$@"
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/helpers/browser.cmd]---
Location: vscode-main/resources/server/bin/helpers/browser.cmd

```bat
@echo off
setlocal
set ROOT_DIR=%~dp0..\..
start "Open Browser" /B "%ROOT_DIR%\node.exe" "%ROOT_DIR%\out\server-cli.js" "@@APPNAME@@" "@@VERSION@@" "@@COMMIT@@" "@@APPNAME@@.cmd" "--openExternal" "%*"
endlocal
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/helpers/check-requirements-linux.sh]---
Location: vscode-main/resources/server/bin/helpers/check-requirements-linux.sh

```bash
#!/usr/bin/env sh
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#

set -e

# The script checks necessary server requirements for the classic server
# scenarios. Currently, the script can exit with any of the following
# 2 exit codes and should be handled accordingly on the extension side.
#
# 0: All requirements are met, use the default server.
# 99: Unsupported OS, abort server startup with appropriate error message.
#

# Do not remove this check.
# Provides a way to skip the server requirements check from
# outside the install flow. A system process can create this
# file before the server is downloaded and installed.
if [ -f "/tmp/vscode-skip-server-requirements-check" ] || [ -n "$VSCODE_SERVER_CUSTOM_GLIBC_LINKER" ]; then
    echo "!!! WARNING: Skipping server pre-requisite check !!!"
    echo "!!! Server stability is not guaranteed. Proceed at your own risk. !!!"
    exit 0
fi

ARCH=$(uname -m)
found_required_glibc=0
found_required_glibcxx=0
MIN_GLIBCXX_VERSION="3.4.25"

# Extract the ID value from /etc/os-release
if [ -f /etc/os-release ]; then
    OS_ID="$(cat /etc/os-release | grep -Eo 'ID=([^"]+)' | sed -n '1s/ID=//p')"
    if [ "$OS_ID" = "nixos" ]; then
        echo "Warning: NixOS detected, skipping GLIBC check"
        exit 0
    fi
fi

# Based on https://github.com/bminor/glibc/blob/520b1df08de68a3de328b65a25b86300a7ddf512/elf/cache.c#L162-L245
case $ARCH in
	x86_64) LDCONFIG_ARCH="x86-64";;
	armv7l | armv8l)
        MIN_GLIBCXX_VERSION="3.4.26"
        LDCONFIG_ARCH="hard-float"
        ;;
	arm64 | aarch64)
        BITNESS=$(getconf LONG_BIT)
		if [ "$BITNESS" = "32" ]; then
			# Can have 32-bit userland on 64-bit kernel
			LDCONFIG_ARCH="hard-float"
		else
			LDCONFIG_ARCH="AArch64"
		fi
		;;
esac

if [ "$OS_ID" != "alpine" ]; then
    if [ -f /sbin/ldconfig ]; then
        # Look up path
        libstdcpp_paths=$(/sbin/ldconfig -p | grep 'libstdc++.so.6')

        if [ "$(echo "$libstdcpp_paths" | wc -l)" -gt 1 ]; then
            libstdcpp_path=$(echo "$libstdcpp_paths" | grep "$LDCONFIG_ARCH" | awk '{print $NF}')
        else
            libstdcpp_path=$(echo "$libstdcpp_paths" | awk '{print $NF}')
        fi
    elif [ -f /usr/lib/libstdc++.so.6 ]; then
	    # Typical path
	    libstdcpp_path='/usr/lib/libstdc++.so.6'
    elif [ -f /usr/lib64/libstdc++.so.6 ]; then
	    # Typical path
	    libstdcpp_path='/usr/lib64/libstdc++.so.6'
    else
	    echo "Warning: Can't find libstdc++.so or ldconfig, can't verify libstdc++ version"
    fi

    while [ -n "$libstdcpp_path" ]; do
	    # Extracts the version number from the path, e.g. libstdc++.so.6.0.22 -> 6.0.22
	    # which is then compared based on the fact that release versioning and symbol versioning
	    # are aligned for libstdc++. Refs https://gcc.gnu.org/onlinedocs/libstdc++/manual/abi.html
	    # (i-e) GLIBCXX_3.4.<release> is provided by libstdc++.so.6.y.<release>
        libstdcpp_path_line=$(echo "$libstdcpp_path" | head -n1)
        libstdcpp_real_path=$(readlink -f "$libstdcpp_path_line")
        libstdcpp_version=$(grep -ao 'GLIBCXX_[0-9]*\.[0-9]*\.[0-9]*' "$libstdcpp_real_path" | sort -V | tail -1)
        libstdcpp_version_number=$(echo "$libstdcpp_version" | sed 's/GLIBCXX_//')
        if [ "$(printf '%s\n' "$MIN_GLIBCXX_VERSION" "$libstdcpp_version_number" | sort -V | head -n1)" = "$MIN_GLIBCXX_VERSION" ]; then
            found_required_glibcxx=1
            break
        fi
        libstdcpp_path=$(echo "$libstdcpp_path" | tail -n +2)    # remove first line
    done
else
    echo "Warning: alpine distro detected, skipping GLIBCXX check"
    found_required_glibcxx=1
fi
if [ "$found_required_glibcxx" = "0" ]; then
    echo "Warning: Missing GLIBCXX >= $MIN_GLIBCXX_VERSION! from $libstdcpp_real_path"
fi

if [ "$OS_ID" = "alpine" ]; then
    MUSL_RTLDLIST="/lib/ld-musl-aarch64.so.1 /lib/ld-musl-x86_64.so.1"
    for rtld in ${MUSL_RTLDLIST}; do
        if [ -x $rtld ]; then
            musl_version=$("$rtld" --version 2>&1 | grep "Version" | awk '{print $NF}')
            break
        fi
    done
    if [ "$(printf '%s\n' "1.2.3" "$musl_version" | sort -V | head -n1)" != "1.2.3" ]; then
        echo "Error: Unsupported alpine distribution. Please refer to our supported distro section https://aka.ms/vscode-remote/linux for additional information."
        exit 99
    fi
    found_required_glibc=1
elif [ -z "$(ldd --version 2>&1 | grep 'musl libc')" ]; then
    if [ -f /sbin/ldconfig ]; then
        # Look up path
        libc_paths=$(/sbin/ldconfig -p | grep 'libc.so.6')

        if [ "$(echo "$libc_paths" | wc -l)" -gt 1 ]; then
            libc_path=$(echo "$libc_paths" | grep "$LDCONFIG_ARCH" | awk '{print $NF}')
        else
            libc_path=$(echo "$libc_paths" | awk '{print $NF}')
        fi
    elif [ -f /usr/lib/libc.so.6 ]; then
        # Typical path
        libc_path='/usr/lib/libc.so.6'
    elif [ -f /lib64/libc.so.6 ]; then
        # Typical path (OpenSUSE)
        libc_path='/lib64/libc.so.6'
    elif [ -f /usr/lib64/libc.so.6 ]; then
        # Typical path
        libc_path='/usr/lib64/libc.so.6'
    else
        echo "Warning: Can't find libc.so or ldconfig, can't verify libc version"
    fi

    while [ -n "$libc_path" ]; do
		# Rather than trusting the output of ldd --version (which is not always accurate)
		# we instead use the version of the cached libc.so.6 file itself.
        libc_path_line=$(echo "$libc_path" | head -n1)
        libc_real_path=$(readlink -f "$libc_path_line")
        libc_version=$(cat "$libc_real_path" | sed -n 's/.*release version \([0-9]\+\.[0-9]\+\).*/\1/p')
        if [ "$(printf '%s\n' "2.28" "$libc_version" | sort -V | head -n1)" = "2.28" ]; then
            found_required_glibc=1
            break
        fi
	    libc_path=$(echo "$libc_path" | tail -n +2)    # remove first line
    done
    if [ "$found_required_glibc" = "0" ]; then
        echo "Warning: Missing GLIBC >= 2.28! from $libc_real_path"
    fi
else
    echo "Warning: musl detected, skipping GLIBC check"
    found_required_glibc=1
fi

if [ "$found_required_glibc" = "0" ] || [ "$found_required_glibcxx" = "0" ]; then
	echo "Error: Missing required dependencies. Please refer to our FAQ https://aka.ms/vscode-remote/faq/old-linux for additional information."
	# Custom exit code based on https://tldp.org/LDP/abs/html/exitcodes.html
	exit 99
fi
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/remote-cli/code-darwin.sh]---
Location: vscode-main/resources/server/bin/remote-cli/code-darwin.sh

```bash
#!/usr/bin/env bash
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#
realdir() {
	SOURCE=$1
	while [ -h "$SOURCE" ]; do
		DIR=$(dirname "$SOURCE")
		SOURCE=$(readlink "$SOURCE")
		[[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE
	done
	echo "$( cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd )"
}

ROOT="$(dirname "$(dirname "$(realdir "$0")")")"

APP_NAME="@@APPNAME@@"
VERSION="@@VERSION@@"
COMMIT="@@COMMIT@@"
EXEC_NAME="@@APPNAME@@"
CLI_SCRIPT="$ROOT/out/server-cli.js"
"$ROOT/node" "$CLI_SCRIPT" "$APP_NAME" "$VERSION" "$COMMIT" "$EXEC_NAME" "$@"
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/remote-cli/code-linux.sh]---
Location: vscode-main/resources/server/bin/remote-cli/code-linux.sh

```bash
#!/usr/bin/env sh
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#
ROOT="$(dirname "$(dirname "$(dirname "$(readlink -f "$0")")")")"

APP_NAME="@@APPNAME@@"
VERSION="@@VERSION@@"
COMMIT="@@COMMIT@@"
EXEC_NAME="@@APPNAME@@"
CLI_SCRIPT="$ROOT/out/server-cli.js"
"$ROOT/node" "$CLI_SCRIPT" "$APP_NAME" "$VERSION" "$COMMIT" "$EXEC_NAME" "$@"
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin/remote-cli/code.cmd]---
Location: vscode-main/resources/server/bin/remote-cli/code.cmd

```bat
@echo off
setlocal
set ROOT_DIR=%~dp0..\..
call "%ROOT_DIR%\node.exe" "%ROOT_DIR%\out\server-cli.js" "@@APPNAME@@" "@@VERSION@@" "@@COMMIT@@" "@@APPNAME@@.cmd" %*
endlocal
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin-dev/helpers/browser.cmd]---
Location: vscode-main/resources/server/bin-dev/helpers/browser.cmd

```bat
@echo off
setlocal
SET VSCODE_PATH=%~dp0..\..\..\..
FOR /F "tokens=* USEBACKQ" %%g IN (`where /r "%VSCODE_PATH%\.build\node" node.exe`) do (SET "NODE=%%g")
call "%NODE%" "%VSCODE_PATH%\out\server-cli.js" "Code Server - Dev" "" "" "code.cmd" "--openExternal" %*
endlocal
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin-dev/helpers/browser.sh]---
Location: vscode-main/resources/server/bin-dev/helpers/browser.sh

```bash
#!/usr/bin/env bash
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	VSCODE_PATH=$(dirname $(dirname $(dirname $(dirname $(dirname $(realpath "$0"))))))
else
	VSCODE_PATH=$(dirname $(dirname $(dirname $(dirname $(dirname $(readlink -f $0))))))
fi

PROD_NAME="Code Server - Dev"
VERSION=""
COMMIT=""
EXEC_NAME=""
CLI_SCRIPT="$VSCODE_PATH/out/server-cli.js"
node "$CLI_SCRIPT" "$PROD_NAME" "$VERSION" "$COMMIT" "$EXEC_NAME" "--openExternal" "$@"
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin-dev/remote-cli/code.cmd]---
Location: vscode-main/resources/server/bin-dev/remote-cli/code.cmd

```bat
@echo off
setlocal
SET VSCODE_PATH=%~dp0..\..\..\..
SET VSCODE_DEV=1
FOR /F "tokens=* USEBACKQ" %%g IN (`where /r "%VSCODE_PATH%\.build\node" node.exe`) do (SET "NODE=%%g")
call "%NODE%" "%VSCODE_PATH%\out\server-cli.js" "Code Server - Dev" "" "" "code.cmd" %*
endlocal
```

--------------------------------------------------------------------------------

---[FILE: resources/server/bin-dev/remote-cli/code.sh]---
Location: vscode-main/resources/server/bin-dev/remote-cli/code.sh

```bash
#!/usr/bin/env bash
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	VSCODE_PATH=$(dirname $(dirname $(dirname $(dirname $(dirname $(realpath "$0"))))))
else
	VSCODE_PATH=$(dirname $(dirname $(dirname $(dirname $(dirname $(readlink -f $0))))))
fi

export VSCODE_DEV=1

PROD_NAME="Code Server - Dev"
VERSION=""
COMMIT=""
EXEC_NAME="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
CLI_SCRIPT="$VSCODE_PATH/out/server-cli.js"
node "$CLI_SCRIPT" "$PROD_NAME" "$VERSION" "$COMMIT" "$EXEC_NAME" "$@"
```

--------------------------------------------------------------------------------

---[FILE: resources/win32/VisualElementsManifest.xml]---
Location: vscode-main/resources/win32/VisualElementsManifest.xml

```text
<Application xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
		<VisualElements
				BackgroundColor="#2D2D30"
				ShowNameOnSquare150x150Logo="on"
				Square150x150Logo="resources\app\resources\win32\code_150x150.png"
				Square70x70Logo="resources\app\resources\win32\code_70x70.png"
				ForegroundText="light" 
				ShortDisplayName="Code - OSS" />
</Application>
```

--------------------------------------------------------------------------------

---[FILE: resources/win32/appx/AppxManifest.xml]---
Location: vscode-main/resources/win32/appx/AppxManifest.xml

```text
<?xml version="1.0" encoding="utf-8"?>
<Package
  xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
  xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
  xmlns:uap2="http://schemas.microsoft.com/appx/manifest/uap/windows10/2"
  xmlns:uap3="http://schemas.microsoft.com/appx/manifest/uap/windows10/3"
  xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities"
  xmlns:desktop="http://schemas.microsoft.com/appx/manifest/desktop/windows10"
  xmlns:desktop4="http://schemas.microsoft.com/appx/manifest/desktop/windows10/4"
  xmlns:desktop5="http://schemas.microsoft.com/appx/manifest/desktop/windows10/5"
  xmlns:desktop6="http://schemas.microsoft.com/appx/manifest/desktop/windows10/6"
  xmlns:desktop10="http://schemas.microsoft.com/appx/manifest/desktop/windows10/10"
  xmlns:uap10="http://schemas.microsoft.com/appx/manifest/uap/windows10/10"
  xmlns:com="http://schemas.microsoft.com/appx/manifest/com/windows10"
  IgnorableNamespaces="uap uap2 uap3 rescap desktop desktop4 desktop5 desktop6 desktop10 uap10 com">
  <Identity
    Name="@@AppxPackageName@@"
    Publisher="CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US"
    Version="@@AppxPackageVersion@@"
    ProcessorArchitecture="neutral" />
  <Properties>
    <DisplayName>@@AppxPackageDisplayName@@</DisplayName>
    <PublisherDisplayName>Microsoft Corporation</PublisherDisplayName>
    <Logo>resources\app\resources\win32\code_150x150.png</Logo>
    <uap10:AllowExternalContent>true</uap10:AllowExternalContent>
    <desktop6:RegistryWriteVirtualization>disabled</desktop6:RegistryWriteVirtualization>
    <desktop6:FileSystemWriteVirtualization>disabled</desktop6:FileSystemWriteVirtualization>
  </Properties>
  <Resources>
    <Resource Language="en-us" />
    <Resource Language="es-es" />
    <Resource Language="de-de" />
    <Resource Language="fr-fr" />
    <Resource Language="hu-hu" />
    <Resource Language="it-it" />
    <Resource Language="ja-jp" />
    <Resource Language="ko-kr" />
    <Resource Language="pt-br" />
    <Resource Language="ru-ru" />
    <Resource Language="tr-tr" />
    <Resource Language="zh-cn" />
    <Resource Language="zh-tw" />
  </Resources>
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.19041.0" MaxVersionTested="10.0.26100.0" />
  </Dependencies>
  <Capabilities>
    <rescap:Capability Name="runFullTrust" />
    <rescap:Capability Name="unvirtualizedResources"/>
    <DeviceCapability Name="microphone"/>
  </Capabilities>
  <Applications>
    <Application Id="@@ApplicationIdShort@@"
      Executable="@@ApplicationExe@@"
      uap10:TrustLevel="mediumIL"
      uap10:RuntimeBehavior="win32App">
      <uap:VisualElements
        AppListEntry="none"
        DisplayName="@@AppxPackageDisplayName@@"
        Description="@@AppxPackageDescription@@"
        BackgroundColor="transparent"
        Square150x150Logo="resources\app\resources\win32\code_150x150.png"
        Square44x44Logo="resources\app\resources\win32\code_70x70.png">
      </uap:VisualElements>
      <Extensions>
        <desktop4:Extension Category="windows.fileExplorerContextMenus">
          <desktop4:FileExplorerContextMenus>
            <desktop5:ItemType Type="Directory">
              <desktop5:Verb Id="@@FileExplorerContextMenuID@@" Clsid="@@FileExplorerContextMenuCLSID@@" />
            </desktop5:ItemType>
            <desktop5:ItemType Type="Directory\Background">
              <desktop5:Verb Id="@@FileExplorerContextMenuID@@" Clsid="@@FileExplorerContextMenuCLSID@@" />
            </desktop5:ItemType>
            <desktop5:ItemType Type="*">
              <desktop5:Verb Id="@@FileExplorerContextMenuID@@" Clsid="@@FileExplorerContextMenuCLSID@@" />
            </desktop5:ItemType>
          </desktop4:FileExplorerContextMenus>
        </desktop4:Extension>
        <com:Extension Category="windows.comServer">
          <com:ComServer>
            <com:SurrogateServer DisplayName="@@AppxPackageDisplayName@@">
              <com:Class Id="@@FileExplorerContextMenuCLSID@@" Path="@@FileExplorerContextMenuDLL@@" ThreadingModel="STA"/>
            </com:SurrogateServer>
          </com:ComServer>
        </com:Extension>
      </Extensions>
    </Application>
  </Applications>
</Package>
```

--------------------------------------------------------------------------------

---[FILE: resources/win32/bin/code.cmd]---
Location: vscode-main/resources/win32/bin/code.cmd

```bat
@echo off
setlocal
set VSCODE_DEV=
set ELECTRON_RUN_AS_NODE=1
"%~dp0..\@@NAME@@.exe" "%~dp0..\resources\app\out\cli.js" %*
IF %ERRORLEVEL% NEQ 0 EXIT /b %ERRORLEVEL%
endlocal
```

--------------------------------------------------------------------------------

---[FILE: resources/win32/bin/code.sh]---
Location: vscode-main/resources/win32/bin/code.sh

```bash
#!/usr/bin/env sh
#
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
if [ "$VSCODE_WSL_DEBUG_INFO" = true ]; then
	set -x
fi

COMMIT="@@COMMIT@@"
APP_NAME="@@APPNAME@@"
QUALITY="@@QUALITY@@"
NAME="@@NAME@@"
SERVERDATAFOLDER="@@SERVERDATAFOLDER@@"
VSCODE_PATH="$(dirname "$(dirname "$(realpath "$0")")")"
ELECTRON="$VSCODE_PATH/$NAME.exe"

IN_WSL=false
if [ -n "$WSL_DISTRO_NAME" ]; then
	# $WSL_DISTRO_NAME is available since WSL builds 18362, also for WSL2
	IN_WSL=true
else
	WSL_BUILD=$(uname -r | sed -E 's/^[0-9.]+-([0-9]+)-Microsoft.*|.*/\1/')
	if [ -n "$WSL_BUILD" ]; then
		if [ "$WSL_BUILD" -ge 17063 ]; then
			# WSLPATH is available since WSL build 17046
			# WSLENV is available since WSL build 17063
			IN_WSL=true
		else
			# If running under older WSL, don't pass cli.js to Electron as
			# environment vars cannot be transferred from WSL to Windows
			# See: https://github.com/microsoft/BashOnWindows/issues/1363
			#      https://github.com/microsoft/BashOnWindows/issues/1494
			"$ELECTRON" "$@"
			exit $?
		fi
	fi
fi
if [ $IN_WSL = true ]; then

	export WSLENV="ELECTRON_RUN_AS_NODE/w:$WSLENV"
	CLI=$(wslpath -m "$VSCODE_PATH/resources/app/out/cli.js")

	# use the Remote WSL extension if installed
	WSL_EXT_ID="ms-vscode-remote.remote-wsl"

	ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" --locate-extension $WSL_EXT_ID >/tmp/remote-wsl-loc.txt 2>/dev/null </dev/null
	WSL_EXT_WLOC=$(cat /tmp/remote-wsl-loc.txt)

	if [ -n "$WSL_EXT_WLOC" ]; then
		# replace \r\n with \n in WSL_EXT_WLOC
		WSL_CODE=$(wslpath -u "${WSL_EXT_WLOC%%[[:cntrl:]]}")/scripts/wslCode.sh
		"$WSL_CODE" "$COMMIT" "$QUALITY" "$ELECTRON" "$APP_NAME" "$SERVERDATAFOLDER" "$@"
		exit $?
	fi

elif [ -x "$(command -v cygpath)" ]; then
	CLI=$(cygpath -m "$VSCODE_PATH/resources/app/out/cli.js")
else
	CLI="$VSCODE_PATH/resources/app/out/cli.js"
fi
ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" "$@"
exit $?
```

--------------------------------------------------------------------------------

---[FILE: resources/win32/insider/bin/code.cmd]---
Location: vscode-main/resources/win32/insider/bin/code.cmd

```bat
@echo off
setlocal
set VSCODE_DEV=
set ELECTRON_RUN_AS_NODE=1
"%~dp0..\@@NAME@@.exe" "%~dp0..\@@VERSIONFOLDER@@\resources\app\out\cli.js" %*
IF %ERRORLEVEL% NEQ 0 EXIT /b %ERRORLEVEL%
endlocal
```

--------------------------------------------------------------------------------

---[FILE: resources/win32/insider/bin/code.sh]---
Location: vscode-main/resources/win32/insider/bin/code.sh

```bash
#!/usr/bin/env sh
#
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
if [ "$VSCODE_WSL_DEBUG_INFO" = true ]; then
	set -x
fi

COMMIT="@@COMMIT@@"
APP_NAME="@@APPNAME@@"
QUALITY="@@QUALITY@@"
NAME="@@NAME@@"
SERVERDATAFOLDER="@@SERVERDATAFOLDER@@"
VERSIONFOLDER="@@VERSIONFOLDER@@"
VSCODE_PATH="$(dirname "$(dirname "$(realpath "$0")")")"
ELECTRON="$VSCODE_PATH/$NAME.exe"

IN_WSL=false
if [ -n "$WSL_DISTRO_NAME" ]; then
	# $WSL_DISTRO_NAME is available since WSL builds 18362, also for WSL2
	IN_WSL=true
else
	WSL_BUILD=$(uname -r | sed -E 's/^[0-9.]+-([0-9]+)-Microsoft.*|.*/\1/')
	if [ -n "$WSL_BUILD" ]; then
		if [ "$WSL_BUILD" -ge 17063 ]; then
			# WSLPATH is available since WSL build 17046
			# WSLENV is available since WSL build 17063
			IN_WSL=true
		else
			# If running under older WSL, don't pass cli.js to Electron as
			# environment vars cannot be transferred from WSL to Windows
			# See: https://github.com/microsoft/BashOnWindows/issues/1363
			#      https://github.com/microsoft/BashOnWindows/issues/1494
			"$ELECTRON" "$@"
			exit $?
		fi
	fi
fi
if [ $IN_WSL = true ]; then

	export WSLENV="ELECTRON_RUN_AS_NODE/w:$WSLENV"
	CLI=$(wslpath -m "$VSCODE_PATH/$VERSIONFOLDER/resources/app/out/cli.js")

	# use the Remote WSL extension if installed
	WSL_EXT_ID="ms-vscode-remote.remote-wsl"

	ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" --locate-extension $WSL_EXT_ID >/tmp/remote-wsl-loc.txt 2>/dev/null </dev/null
	WSL_EXT_WLOC=$(cat /tmp/remote-wsl-loc.txt)

	if [ -n "$WSL_EXT_WLOC" ]; then
		# replace \r\n with \n in WSL_EXT_WLOC
		WSL_CODE=$(wslpath -u "${WSL_EXT_WLOC%%[[:cntrl:]]}")/scripts/wslCode.sh
		"$WSL_CODE" "$COMMIT" "$QUALITY" "$ELECTRON" "$APP_NAME" "$SERVERDATAFOLDER" "$@"
		exit $?
	fi

elif [ -x "$(command -v cygpath)" ]; then
	CLI=$(cygpath -m "$VSCODE_PATH/$VERSIONFOLDER/resources/app/out/cli.js")
else
	CLI="$VSCODE_PATH/$VERSIONFOLDER/resources/app/out/cli.js"
fi
ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" "$@"
exit $?
```

--------------------------------------------------------------------------------

---[FILE: scripts/code-cli.bat]---
Location: vscode-main/scripts/code-cli.bat

```bat
@echo off
setlocal

title VSCode Dev

pushd %~dp0..

:: Get electron, compile, built-in extensions
if "%VSCODE_SKIP_PRELAUNCH%"=="" node build/lib/preLaunch.ts

for /f "tokens=2 delims=:," %%a in ('findstr /R /C:"\"nameShort\":.*" product.json') do set NAMESHORT=%%~a
set NAMESHORT=%NAMESHORT: "=%
set NAMESHORT=%NAMESHORT:"=%.exe
set CODE=".build\electron\%NAMESHORT%"

:: Manage built-in extensions
if "%~1"=="--builtin" goto builtin

:: Configuration
set ELECTRON_RUN_AS_NODE=1
set NODE_ENV=development
set VSCODE_DEV=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1

set DISABLE_TEST_EXTENSION="--disable-extension=vscode.vscode-api-tests"
for %%A in (%*) do (
	if "%%~A"=="--extensionTestsPath" (
		set DISABLE_TEST_EXTENSION=""
	)
)

:: Launch Code
%CODE% --inspect=5874 out\cli.js %~dp0.. %DISABLE_TEST_EXTENSION% %*
goto end

:builtin
%CODE% build/builtin

:end

popd

endlocal
```

--------------------------------------------------------------------------------

---[FILE: scripts/code-cli.sh]---
Location: vscode-main/scripts/code-cli.sh

```bash
#!/usr/bin/env bash

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname $(dirname $(realpath "$0")))
else
	ROOT=$(dirname $(dirname $(readlink -f $0)))
fi

function code() {
	cd $ROOT

	if [[ "$OSTYPE" == "darwin"* ]]; then
		NAME=`node -p "require('./product.json').nameLong"`
		CODE="./.build/electron/$NAME.app/Contents/MacOS/Electron"
	else
		NAME=`node -p "require('./product.json').applicationName"`
		CODE=".build/electron/$NAME"
	fi

	# Get electron, compile, built-in extensions
	if [[ -z "${VSCODE_SKIP_PRELAUNCH}" ]]; then
		node build/lib/preLaunch.ts
	fi

	# Manage built-in extensions
	if [[ "$1" == "--builtin" ]]; then
		exec "$CODE" build/builtin
		return
	fi

	# Disable test extension
	DISABLE_TEST_EXTENSION="--disable-extension=vscode.vscode-api-tests"
	if [[ "$@" == *"--extensionTestsPath"* ]]; then
		DISABLE_TEST_EXTENSION=""
	fi

	ELECTRON_RUN_AS_NODE=1 \
	NODE_ENV=development \
	VSCODE_DEV=1 \
	ELECTRON_ENABLE_LOGGING=1 \
	ELECTRON_ENABLE_STACK_DUMPING=1 \
	"$CODE" --inspect=5874 "$ROOT/out/cli.js" . $DISABLE_TEST_EXTENSION "$@"
}

code "$@"
```

--------------------------------------------------------------------------------

---[FILE: scripts/code-perf.js]---
Location: vscode-main/scripts/code-perf.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

const path = require('path');
const perf = require('@vscode/vscode-perf');

const VSCODE_FOLDER = path.join(__dirname, '..');

async function main() {

	const args = process.argv;
	/** @type {string | undefined} */
	let build = undefined;

	if (args.indexOf('--help') === -1 && args.indexOf('-h') === -1) {
		// get build arg from args
		let buildArgIndex = args.indexOf('--build');
		buildArgIndex = buildArgIndex === -1 ? args.indexOf('-b') : buildArgIndex;
		if (buildArgIndex === -1) {
			let runtimeArgIndex = args.indexOf('--runtime');
			runtimeArgIndex = runtimeArgIndex === -1 ? args.indexOf('-r') : runtimeArgIndex;
			if (runtimeArgIndex !== -1 && args[runtimeArgIndex + 1] !== 'desktop') {
				console.error('Please provide the --build argument. It is an executable file for desktop or a URL for web');
				process.exit(1);
			}
			build = getLocalCLIPath();
		} else {
			build = args[buildArgIndex + 1];
			if (build !== 'insider' && build !== 'stable' && build !== 'exploration') {
				build = getExePath(args[buildArgIndex + 1]);
			}
			args.splice(buildArgIndex + 1, 1);
		}

		args.push('--folder');
		args.push(VSCODE_FOLDER);
		args.push('--file');
		args.push(path.join(VSCODE_FOLDER, 'package.json'));
	}

	if (build) {
		args.push('--build');
		args.push(build);
	}

	await perf.run();
	process.exit(0);
}

/**
 * @param {string} buildPath
 * @returns {string}
 */
function getExePath(buildPath) {
	buildPath = path.normalize(path.resolve(buildPath));
	if (buildPath === path.normalize(getLocalCLIPath())) {
		return buildPath;
	}
	let relativeExePath;
	switch (process.platform) {
		case 'darwin':
			relativeExePath = path.join('Contents', 'MacOS', 'Electron');
			break;
		case 'linux': {
			const product = require(path.join(buildPath, 'resources', 'app', 'product.json'));
			relativeExePath = product.applicationName;
			break;
		}
		case 'win32': {
			const product = require(path.join(buildPath, 'resources', 'app', 'product.json'));
			relativeExePath = `${product.nameShort}.exe`;
			break;
		}
		default:
			throw new Error('Unsupported platform.');
	}
	return buildPath.endsWith(relativeExePath) ? buildPath : path.join(buildPath, relativeExePath);
}

/**
 * @returns {string}
 */
function getLocalCLIPath() {
	return process.platform === 'win32' ? path.join(VSCODE_FOLDER, 'scripts', 'code.bat') : path.join(VSCODE_FOLDER, 'scripts', 'code.sh');
}

main();
```

--------------------------------------------------------------------------------

---[FILE: scripts/code-server.bat]---
Location: vscode-main/scripts/code-server.bat

```bat
@echo off
setlocal

title VSCode Server

set ROOT_DIR=%~dp0..

pushd %ROOT_DIR%

:: Configuration
set NODE_ENV=development
set VSCODE_DEV=1

:: Get electron, compile, built-in extensions
if "%VSCODE_SKIP_PRELAUNCH%"=="" (
	node build/lib/preLaunch.ts
)

:: Node executable
FOR /F "tokens=*" %%g IN ('node build/lib/node.ts') do (SET NODE=%%g)

if not exist "%NODE%" (
	:: Download nodejs executable for remote
	call npm run gulp node
)

popd

:: Launch Server
call "%NODE%" %ROOT_DIR%\scripts\code-server.js %*


endlocal
```

--------------------------------------------------------------------------------

---[FILE: scripts/code-server.js]---
Location: vscode-main/scripts/code-server.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

const cp = require('child_process');
const path = require('path');
const open = require('open');
const minimist = require('minimist');

async function main() {

	const args = minimist(process.argv.slice(2), {
		boolean: [
			'help',
			'launch'
		]
	});

	if (args.help) {
		console.log(
			'./scripts/code-server.sh|bat [options]\n' +
			' --launch              Opens a browser'
		);
		startServer(['--help']);
		return;
	}

	process.env['VSCODE_SERVER_PORT'] = '9888';

	const serverArgs = process.argv.slice(2).filter(v => v !== '--launch');
	const addr = await startServer(serverArgs);
	if (args['launch']) {
		open.default(addr);
	}
}

function startServer(programArgs) {
	return new Promise((s, e) => {
		const env = { ...process.env };
		const entryPoint = path.join(__dirname, '..', 'out', 'server-main.js');

		console.log(`Starting server: ${entryPoint} ${programArgs.join(' ')}`);
		const proc = cp.spawn(process.execPath, [entryPoint, ...programArgs], { env, stdio: [process.stdin, null, process.stderr] });
		proc.stdout.on('data', e => {
			const data = e.toString();
			process.stdout.write(data);
			const m = data.match(/Web UI available at (.*)/);
			if (m) {
				s(m[1]);
			}
		});

		proc.on('exit', (code) => process.exit(code));

		process.on('exit', () => proc.kill());
		process.on('SIGINT', () => {
			proc.kill();
			process.exit(128 + 2); // https://nodejs.org/docs/v14.16.0/api/process.html#process_signal_events
		});
		process.on('SIGTERM', () => {
			proc.kill();
			process.exit(128 + 15); // https://nodejs.org/docs/v14.16.0/api/process.html#process_signal_events
		});
	});

}

main();
```

--------------------------------------------------------------------------------

---[FILE: scripts/code-server.sh]---
Location: vscode-main/scripts/code-server.sh

```bash
#!/usr/bin/env bash

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname $(dirname $(realpath "$0")))
else
	ROOT=$(dirname $(dirname $(readlink -f $0)))
fi

function code() {
	pushd $ROOT

	# Get electron, compile, built-in extensions
	if [[ -z "${VSCODE_SKIP_PRELAUNCH}" ]]; then
		node build/lib/preLaunch.ts
	fi

	NODE=$(node build/lib/node.ts)
	if [ ! -e $NODE ];then
		# Load remote node
		npm run gulp node
	fi

	popd

	NODE_ENV=development \
	VSCODE_DEV=1 \
	$NODE $ROOT/scripts/code-server.js "$@"
}

code "$@"
```

--------------------------------------------------------------------------------

---[FILE: scripts/code-web.bat]---
Location: vscode-main/scripts/code-web.bat

```bat
@echo off
setlocal

title VSCode Web Serverless

pushd %~dp0\..

:: Sync built-in extensions
call npm run download-builtin-extensions

:: Node executable
FOR /F "tokens=*" %%g IN ('node build/lib/node.ts') do (SET NODE=%%g)

if not exist "%NODE%" (
	:: Download nodejs executable for remote
	call npm run gulp node
)

:: Launch Server
call "%NODE%" scripts\code-web.js %*

popd

endlocal
```

--------------------------------------------------------------------------------

---[FILE: scripts/code-web.js]---
Location: vscode-main/scripts/code-web.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

const testWebLocation = require.resolve('@vscode/test-web');

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const minimist = require('minimist');
const fancyLog = require('fancy-log');
const ansiColors = require('ansi-colors');
const open = require('open');
const https = require('https');

const APP_ROOT = path.join(__dirname, '..');
const WEB_DEV_EXTENSIONS_ROOT = path.join(APP_ROOT, '.build', 'builtInWebDevExtensions');

const WEB_PLAYGROUND_VERSION = '0.0.13';

async function main() {

	const args = minimist(process.argv.slice(2), {
		boolean: [
			'help',
			'playground'
		],
		string: [
			'host',
			'port',
			'extensionPath',
			'browser',
			'browserType'
		],
	});

	if (args.help) {
		console.log(
			'./scripts/code-web.sh|bat[, folderMountPath[, options]]\n' +
			'                           Start with an empty workspace and no folder opened in explorer\n' +
			'  folderMountPath          Open local folder (eg: use `.` to open current directory)\n' +
			'  --playground             Include the vscode-web-playground extension\n'
		);
		startServer(['--help']);
		return;
	}

	const serverArgs = [];

	const HOST = args['host'] ?? 'localhost';
	const PORT = args['port'] ?? '8080';

	if (args['host'] === undefined) {
		serverArgs.push('--host', HOST);
	}
	if (args['port'] === undefined) {
		serverArgs.push('--port', PORT);
	}

	// only use `./scripts/code-web.sh --playground` to add vscode-web-playground extension by default.
	if (args['playground'] === true) {
		serverArgs.push('--extensionPath', WEB_DEV_EXTENSIONS_ROOT);
		serverArgs.push('--folder-uri', 'memfs:///sample-folder');
		await ensureWebDevExtensions(args['verbose']);
	}

	let openSystemBrowser = false;
	if (!args['browser'] && !args['browserType']) {
		serverArgs.push('--browserType', 'none');
		openSystemBrowser = true;
	}

	serverArgs.push('--sourcesPath', APP_ROOT);

	serverArgs.push(...process.argv.slice(2).filter(v => !v.startsWith('--playground') && v !== '--no-playground'));

	startServer(serverArgs);
	if (openSystemBrowser) {
		open.default(`http://${HOST}:${PORT}/`);
	}
}

function startServer(runnerArguments) {
	const env = { ...process.env };

	console.log(`Starting @vscode/test-web: ${testWebLocation} ${runnerArguments.join(' ')}`);
	const proc = cp.spawn(process.execPath, [testWebLocation, ...runnerArguments], { env, stdio: 'inherit' });

	proc.on('exit', (code) => process.exit(code));

	process.on('exit', () => proc.kill());
	process.on('SIGINT', () => {
		proc.kill();
		process.exit(128 + 2); // https://nodejs.org/docs/v14.16.0/api/process.html#process_signal_events
	});
	process.on('SIGTERM', () => {
		proc.kill();
		process.exit(128 + 15); // https://nodejs.org/docs/v14.16.0/api/process.html#process_signal_events
	});
}

async function directoryExists(path) {
	try {
		return (await fs.promises.stat(path)).isDirectory();
	} catch {
		return false;
	}
}

/** @return {Promise<void>} */
async function downloadPlaygroundFile(fileName, httpsLocation, destinationRoot) {
	const destination = path.join(destinationRoot, fileName);
	await fs.promises.mkdir(path.dirname(destination), { recursive: true });
	const fileStream = fs.createWriteStream(destination);
	return (new Promise((resolve, reject) => {
		const request = https.get(path.posix.join(httpsLocation, fileName), response => {
			response.pipe(fileStream);
			fileStream.on('finish', () => {
				fileStream.close();
				resolve();
			});
		});
		request.on('error', reject);
	}));
}

async function ensureWebDevExtensions(verbose) {

	// Playground (https://github.com/microsoft/vscode-web-playground)
	const webDevPlaygroundRoot = path.join(WEB_DEV_EXTENSIONS_ROOT, 'vscode-web-playground');
	const webDevPlaygroundExists = await directoryExists(webDevPlaygroundRoot);

	let downloadPlayground = false;
	if (webDevPlaygroundExists) {
		try {
			const webDevPlaygroundPackageJson = JSON.parse(((await fs.promises.readFile(path.join(webDevPlaygroundRoot, 'package.json'))).toString()));
			if (webDevPlaygroundPackageJson.version !== WEB_PLAYGROUND_VERSION) {
				downloadPlayground = true;
			}
		} catch (error) {
			downloadPlayground = true;
		}
	} else {
		downloadPlayground = true;
	}

	if (downloadPlayground) {
		if (verbose) {
			fancyLog(`${ansiColors.magenta('Web Development extensions')}: Downloading vscode-web-playground to ${webDevPlaygroundRoot}`);
		}
		const playgroundRepo = `https://raw.githubusercontent.com/microsoft/vscode-web-playground/main/`;
		await Promise.all(['package.json', 'dist/extension.js', 'dist/extension.js.map'].map(
			fileName => downloadPlaygroundFile(fileName, playgroundRepo, webDevPlaygroundRoot)
		));

	} else {
		if (verbose) {
			fancyLog(`${ansiColors.magenta('Web Development extensions')}: Using existing vscode-web-playground in ${webDevPlaygroundRoot}`);
		}
	}
}

main();
```

--------------------------------------------------------------------------------

---[FILE: scripts/code-web.sh]---
Location: vscode-main/scripts/code-web.sh

```bash
#!/usr/bin/env bash

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname $(dirname $(realpath "$0")))
else
	ROOT=$(dirname $(dirname $(readlink -f $0)))
fi

function code() {
	cd $ROOT

	# Sync built-in extensions
	npm run download-builtin-extensions

	NODE=$(node build/lib/node.ts)
	if [ ! -e $NODE ];then
		# Load remote node
		npm run gulp node
	fi

	NODE=$(node build/lib/node.ts)

	$NODE ./scripts/code-web.js "$@"
}

code "$@"
```

--------------------------------------------------------------------------------

---[FILE: scripts/code.bat]---
Location: vscode-main/scripts/code.bat

```bat
@echo off
setlocal

title VSCode Dev

pushd %~dp0\..

:: Get electron, compile, built-in extensions
if "%VSCODE_SKIP_PRELAUNCH%"=="" (
	node build/lib/preLaunch.ts
)

for /f "tokens=2 delims=:," %%a in ('findstr /R /C:"\"nameShort\":.*" product.json') do set NAMESHORT=%%~a
set NAMESHORT=%NAMESHORT: "=%
set NAMESHORT=%NAMESHORT:"=%.exe
set CODE=".build\electron\%NAMESHORT%"

:: Manage built-in extensions
if "%~1"=="--builtin" goto builtin

:: Configuration
set NODE_ENV=development
set VSCODE_DEV=1
set VSCODE_CLI=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1

set DISABLE_TEST_EXTENSION="--disable-extension=vscode.vscode-api-tests"
for %%A in (%*) do (
	if "%%~A"=="--extensionTestsPath" (
		set DISABLE_TEST_EXTENSION=""
	)
)

:: Launch Code
%CODE% . %DISABLE_TEST_EXTENSION% %*
goto end

:builtin
%CODE% build/builtin

:end

popd

endlocal
```

--------------------------------------------------------------------------------

---[FILE: scripts/code.sh]---
Location: vscode-main/scripts/code.sh

```bash
#!/usr/bin/env bash

set -e

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname "$(dirname "$(realpath "$0")")")
else
	ROOT=$(dirname "$(dirname "$(readlink -f $0)")")
	# If the script is running in Docker using the WSL2 engine, powershell.exe won't exist
	if grep -qi Microsoft /proc/version && type powershell.exe > /dev/null 2>&1; then
		IN_WSL=true
	fi
fi

function code() {
	cd "$ROOT"

	if [[ "$OSTYPE" == "darwin"* ]]; then
		NAME=`node -p "require('./product.json').nameLong"`
		CODE="./.build/electron/$NAME.app/Contents/MacOS/Electron"
	else
		NAME=`node -p "require('./product.json').applicationName"`
		CODE=".build/electron/$NAME"
	fi

	# Get electron, compile, built-in extensions
	if [[ -z "${VSCODE_SKIP_PRELAUNCH}" ]]; then
		node build/lib/preLaunch.ts
	fi

	# Manage built-in extensions
	if [[ "$1" == "--builtin" ]]; then
		exec "$CODE" build/builtin
		return
	fi

	# Configuration
	export NODE_ENV=development
	export VSCODE_DEV=1
	export VSCODE_CLI=1
	export ELECTRON_ENABLE_STACK_DUMPING=1
	export ELECTRON_ENABLE_LOGGING=1

	DISABLE_TEST_EXTENSION="--disable-extension=vscode.vscode-api-tests"
	if [[ "$@" == *"--extensionTestsPath"* ]]; then
		DISABLE_TEST_EXTENSION=""
	fi

	# Launch Code
	exec "$CODE" . $DISABLE_TEST_EXTENSION "$@"
}

function code-wsl()
{
	HOST_IP=$(echo "" | powershell.exe -noprofile -Command "& {(Get-NetIPAddress | Where-Object {\$_.InterfaceAlias -like '*WSL*' -and \$_.AddressFamily -eq 'IPv4'}).IPAddress | Write-Host -NoNewline}")
	export DISPLAY="$HOST_IP:0"

	# in a wsl shell
	ELECTRON="$ROOT/.build/electron/Code - OSS.exe"
	if [ -f "$ELECTRON"  ]; then
		local CWD=$(pwd)
		cd $ROOT
		export WSLENV=ELECTRON_RUN_AS_NODE/w:VSCODE_DEV/w:$WSLENV
		local WSL_EXT_ID="ms-vscode-remote.remote-wsl"
		local WSL_EXT_WLOC=$(echo "" | VSCODE_DEV=1 ELECTRON_RUN_AS_NODE=1 "$ROOT/.build/electron/Code - OSS.exe" "out/cli.js" --locate-extension $WSL_EXT_ID)
		cd $CWD
		if [ -n "$WSL_EXT_WLOC" ]; then
			# replace \r\n with \n in WSL_EXT_WLOC
			local WSL_CODE=$(wslpath -u "${WSL_EXT_WLOC%%[[:cntrl:]]}")/scripts/wslCode-dev.sh
			$WSL_CODE "$ROOT" "$@"
			exit $?
		else
			echo "Remote WSL not installed, trying to run VSCode in WSL."
		fi
	fi
}

if [ "$IN_WSL" == "true" ] && [ -z "$DISPLAY" ]; then
	code-wsl "$@"
elif [ -f /mnt/wslg/versions.txt ]; then
	code --disable-gpu "$@"
elif [ -f /.dockerenv ]; then
	# Workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=1263267
	# Chromium does not release shared memory when streaming scripts
	# which might exhaust the available resources in the container environment
	# leading to failed script loading.
	code --disable-dev-shm-usage "$@"
else
	code "$@"
fi

exit $?
```

--------------------------------------------------------------------------------

---[FILE: scripts/generate-definitelytyped.sh]---
Location: vscode-main/scripts/generate-definitelytyped.sh

```bash
#!/usr/bin/env bash

if [ $# -eq 0 ]; then
	echo "Pass in a version like ./scripts/generate-vscode-dts.sh 1.30."
	echo "Failed to generate index.d.ts."
	exit 1
fi

header="// Type definitions for Visual Studio Code ${1}
// Project: https://github.com/microsoft/vscode
// Definitions by: Visual Studio Code Team, Microsoft <https://github.com/microsoft>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *  See https://github.com/microsoft/vscode/blob/main/LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Type Definition for Visual Studio Code ${1} Extension API
 * See https://code.visualstudio.com/api for more information
 */"

if [ -f ./src/vscode-dts/vscode.d.ts ]; then
	echo "$header" > index.d.ts
	sed "1,4d" ./src/vscode-dts/vscode.d.ts >> index.d.ts
	echo "Generated index.d.ts for version ${1}."
else
	echo "Can't find ./src/vscode-dts/vscode.d.ts. Run this script at vscode root."
fi
```

--------------------------------------------------------------------------------

---[FILE: scripts/node-electron.bat]---
Location: vscode-main/scripts/node-electron.bat

```bat
@echo off
setlocal

set ELECTRON_RUN_AS_NODE=1

pushd %~dp0\..

for /f "tokens=2 delims=:," %%a in ('findstr /R /C:"\"nameShort\":.*" product.json') do set NAMESHORT=%%~a
set NAMESHORT=%NAMESHORT: "=%
set NAMESHORT=%NAMESHORT:"=%.exe
set CODE=".build\electron\%NAMESHORT%"

%CODE% %*

popd

endlocal
exit /b %errorlevel%
```

--------------------------------------------------------------------------------

---[FILE: scripts/node-electron.sh]---
Location: vscode-main/scripts/node-electron.sh

```bash
#!/usr/bin/env bash

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname $(dirname $(realpath "$0")))
else
	ROOT=$(dirname $(dirname $(readlink -f $0)))
fi

pushd $ROOT

if [[ "$OSTYPE" == "darwin"* ]]; then
	NAME=`node -p "require('./product.json').nameLong"`
	CODE="$ROOT/.build/electron/$NAME.app/Contents/MacOS/Electron"
else
	NAME=`node -p "require('./product.json').applicationName"`
	CODE="$ROOT/.build/electron/$NAME"
fi

# Get electron
npm run electron

popd

export VSCODE_DEV=1
if [[ "$OSTYPE" == "darwin"* ]]; then
	ulimit -n 4096 ; ELECTRON_RUN_AS_NODE=1 \
		"$CODE" \
		"$@"
else
	ELECTRON_RUN_AS_NODE=1 \
		"$CODE" \
		"$@"
fi
```

--------------------------------------------------------------------------------

---[FILE: scripts/package.json]---
Location: vscode-main/scripts/package.json

```json
{
	"type": "commonjs"
}
```

--------------------------------------------------------------------------------

---[FILE: scripts/playground-server.ts]---
Location: vscode-main/scripts/playground-server.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fsPromise from 'fs/promises';
import path from 'path';
import * as http from 'http';
import * as parcelWatcher from '@parcel/watcher';

/**
 * Launches the server for the monaco editor playground
 */
function main() {
	const server = new HttpServer({ host: 'localhost', port: 5001, cors: true });
	server.use('/', redirectToMonacoEditorPlayground());

	const rootDir = path.join(__dirname, '..');
	const fileServer = new FileServer(rootDir);
	server.use(fileServer.handleRequest);

	const moduleIdMapper = new SimpleModuleIdPathMapper(path.join(rootDir, 'out'));
	const editorMainBundle = new CachedBundle('vs/editor/editor.main', moduleIdMapper);
	fileServer.overrideFileContent(editorMainBundle.entryModulePath, () => editorMainBundle.bundle());

	const loaderPath = path.join(rootDir, 'out/vs/loader.js');
	fileServer.overrideFileContent(loaderPath, async () =>
		Buffer.from(new TextEncoder().encode(makeLoaderJsHotReloadable(await fsPromise.readFile(loaderPath, 'utf8'), new URL('/file-changes', server.url))))
	);

	const watcher = DirWatcher.watchRecursively(moduleIdMapper.rootDir);
	watcher.onDidChange((path, newContent) => {
		editorMainBundle.setModuleContent(path, newContent);
		editorMainBundle.bundle();
		console.log(`${new Date().toLocaleTimeString()}, file change: ${path}`);
	});
	server.use('/file-changes', handleGetFileChangesRequest(watcher, fileServer, moduleIdMapper));

	console.log(`Server listening on ${server.url}`);
}
setTimeout(main, 0);

// #region Http/File Server

type RequestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
type ChainableRequestHandler = (req: http.IncomingMessage, res: http.ServerResponse, next: RequestHandler) => Promise<void>;

class HttpServer {
	private readonly server: http.Server;
	public readonly url: URL;

	private handler: ChainableRequestHandler[] = [];

	constructor(options: { host: string; port: number; cors: boolean }) {
		this.server = http.createServer(async (req, res) => {
			if (options.cors) {
				res.setHeader('Access-Control-Allow-Origin', '*');
			}

			let i = 0;
			const next = async (req: http.IncomingMessage, res: http.ServerResponse) => {
				if (i >= this.handler.length) {
					res.writeHead(404, { 'Content-Type': 'text/plain' });
					res.end('404 Not Found');
					return;
				}
				const handler = this.handler[i];
				i++;
				await handler(req, res, next);
			};
			await next(req, res);
		});
		this.server.listen(options.port, options.host);
		this.url = new URL(`http://${options.host}:${options.port}`);
	}

	use(handler: ChainableRequestHandler);
	use(path: string, handler: ChainableRequestHandler);
	use(...args: [path: string, handler: ChainableRequestHandler] | [handler: ChainableRequestHandler]) {
		const handler = args.length === 1 ? args[0] : (req, res, next) => {
			const path = args[0];
			const requestedUrl = new URL(req.url, this.url);
			if (requestedUrl.pathname === path) {
				return args[1](req, res, next);
			} else {
				return next(req, res);
			}
		};

		this.handler.push(handler);
	}
}

function redirectToMonacoEditorPlayground(): ChainableRequestHandler {
	return async (req, res) => {
		const url = new URL('https://microsoft.github.io/monaco-editor/playground.html');
		url.searchParams.append('source', `http://${req.headers.host}/out/vs`);
		res.writeHead(302, { Location: url.toString() });
		res.end();
	};
}

class FileServer {
	private readonly overrides = new Map<string, () => Promise<Buffer>>();

	constructor(public readonly publicDir: string) { }

	public readonly handleRequest: ChainableRequestHandler = async (req, res, next) => {
		const requestedUrl = new URL(req.url!, `http://${req.headers.host}`);

		const pathName = requestedUrl.pathname;

		const filePath = path.join(this.publicDir, pathName);
		if (!filePath.startsWith(this.publicDir)) {
			res.writeHead(403, { 'Content-Type': 'text/plain' });
			res.end('403 Forbidden');
			return;
		}

		try {
			const override = this.overrides.get(filePath);
			let content: Buffer;
			if (override) {
				content = await override();
			} else {
				content = await fsPromise.readFile(filePath);
			}

			const contentType = getContentType(filePath);
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(content);
		} catch (err) {
			if (err.code === 'ENOENT') {
				next(req, res);
			} else {
				res.writeHead(500, { 'Content-Type': 'text/plain' });
				res.end('500 Internal Server Error');
			}
		}
	};

	public filePathToUrlPath(filePath: string): string | undefined {
		const relative = path.relative(this.publicDir, filePath);
		const isSubPath = !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);

		if (!isSubPath) {
			return undefined;
		}
		const relativePath = relative.replace(/\\/g, '/');
		return `/${relativePath}`;
	}

	public overrideFileContent(filePath: string, content: () => Promise<Buffer>): void {
		this.overrides.set(filePath, content);
	}
}

function getContentType(filePath: string): string {
	const extname = path.extname(filePath);
	switch (extname) {
		case '.js':
			return 'text/javascript';
		case '.css':
			return 'text/css';
		case '.json':
			return 'application/json';
		case '.png':
			return 'image/png';
		case '.jpg':
			return 'image/jpg';
		case '.svg':
			return 'image/svg+xml';
		case '.html':
			return 'text/html';
		case '.wasm':
			return 'application/wasm';
		default:
			return 'text/plain';
	}
}

// #endregion

// #region File Watching

interface IDisposable {
	dispose(): void;
}

class DirWatcher {
	public static watchRecursively(dir: string): DirWatcher {
		const listeners: ((path: string, newContent: string) => void)[] = [];
		const fileContents = new Map<string, string>();
		const event = (handler: (path: string, newContent: string) => void) => {
			listeners.push(handler);
			return {
				dispose: () => {
					const idx = listeners.indexOf(handler);
					if (idx >= 0) {
						listeners.splice(idx, 1);
					}
				}
			};
		};
		parcelWatcher.subscribe(dir, async (err, events) => {
			for (const e of events) {
				if (e.type === 'update') {
					const newContent = await fsPromise.readFile(e.path, 'utf8');
					if (fileContents.get(e.path) !== newContent) {
						fileContents.set(e.path, newContent);
						listeners.forEach(l => l(e.path, newContent));
					}
				}
			}
		});
		return new DirWatcher(event);
	}

	constructor(public readonly onDidChange: (handler: (path: string, newContent: string) => void) => IDisposable) {
	}
}

function handleGetFileChangesRequest(watcher: DirWatcher, fileServer: FileServer, moduleIdMapper: SimpleModuleIdPathMapper): ChainableRequestHandler {
	return async (req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		const d = watcher.onDidChange((fsPath, newContent) => {
			const path = fileServer.filePathToUrlPath(fsPath);
			if (path) {
				res.write(JSON.stringify({ changedPath: path, moduleId: moduleIdMapper.getModuleId(fsPath), newContent }) + '\n');
			}
		});
		res.on('close', () => d.dispose());
	};
}
function makeLoaderJsHotReloadable(loaderJsCode: string, fileChangesUrl: URL): string {
	loaderJsCode = loaderJsCode.replace(
		/constructor\(env, scriptLoader, defineFunc, requireFunc, loaderAvailableTimestamp = 0\) {/,
		'$&globalThis.___globalModuleManager = this; globalThis.vscode = { process: { env: { VSCODE_DEV: true } } }'
	);

	const ___globalModuleManager: any = undefined;

	// This code will be appended to loader.js
	function $watchChanges(fileChangesUrl: string) {
		interface HotReloadConfig { }

		let reloadFn;
		if (globalThis.$sendMessageToParent) {
			reloadFn = () => globalThis.$sendMessageToParent({ kind: 'reload' });
		} else if (typeof window !== 'undefined') {
			reloadFn = () => window.location.reload();
		} else {
			reloadFn = () => { };
		}

		console.log('Connecting to server to watch for changes...');
		// eslint-disable-next-line local/code-no-any-casts
		(fetch as any)(fileChangesUrl)
			.then(async request => {
				const reader = request.body.getReader();
				let buffer = '';
				while (true) {
					const { done, value } = await reader.read();
					if (done) { break; }
					buffer += new TextDecoder().decode(value);
					const lines = buffer.split('\n');
					buffer = lines.pop()!;

					const changes: { relativePath: string; config: HotReloadConfig | undefined; path: string; newContent: string }[] = [];

					for (const line of lines) {
						const data = JSON.parse(line);
						const relativePath = data.changedPath.replace(/\\/g, '/').split('/out/')[1];
						changes.push({ config: {}, path: data.changedPath, relativePath, newContent: data.newContent });
					}

					const result = handleChanges(changes, 'playground-server');
					if (result.reloadFailedJsFiles.length > 0) {
						reloadFn();
					}
				}
			}).catch(err => {
				console.error(err);
				setTimeout(() => $watchChanges(fileChangesUrl), 1000);
			});


		function handleChanges(changes: {
			relativePath: string;
			config: HotReloadConfig | undefined;
			path: string;
			newContent: string;
		}[], debugSessionName: string) {
			// This function is stringified and injected into the debuggee.

			const hotReloadData: { count: number; originalWindowTitle: any; timeout: any; shouldReload: boolean } = globalThis.$hotReloadData || (globalThis.$hotReloadData = { count: 0, messageHideTimeout: undefined, shouldReload: false });

			const reloadFailedJsFiles: { relativePath: string; path: string }[] = [];

			for (const change of changes) {
				handleChange(change.relativePath, change.path, change.newContent, change.config);
			}

			return { reloadFailedJsFiles };

			function handleChange(relativePath: string, path: string, newSrc: string, config: any) {
				if (relativePath.endsWith('.css')) {
					handleCssChange(relativePath);
				} else if (relativePath.endsWith('.js')) {
					handleJsChange(relativePath, path, newSrc, config);
				}
			}

			function handleCssChange(relativePath: string) {
				if (typeof document === 'undefined') {
					return;
				}

				const styleSheet = (([...document.querySelectorAll(`link[rel='stylesheet']`)] as HTMLLinkElement[]))
					.find(l => new URL(l.href, document.location.href).pathname.endsWith(relativePath));
				if (styleSheet) {
					setMessage(`reload ${formatPath(relativePath)} - ${new Date().toLocaleTimeString()}`);
					console.log(debugSessionName, 'css reloaded', relativePath);
					styleSheet.href = styleSheet.href.replace(/\?.*/, '') + '?' + Date.now();
				} else {
					setMessage(`could not reload ${formatPath(relativePath)} - ${new Date().toLocaleTimeString()}`);
					console.log(debugSessionName, 'ignoring css change, as stylesheet is not loaded', relativePath);
				}
			}


			function handleJsChange(relativePath: string, path: string, newSrc: string, config: any) {
				const moduleIdStr = trimEnd(relativePath, '.js');

				const requireFn: any = globalThis.require;
				// eslint-disable-next-line local/code-no-any-casts
				const moduleManager = (requireFn as any).moduleManager;
				if (!moduleManager) {
					console.log(debugSessionName, 'ignoring js change, as moduleManager is not available', relativePath);
					return;
				}

				const moduleId = moduleManager._moduleIdProvider.getModuleId(moduleIdStr);
				const oldModule = moduleManager._modules2[moduleId];

				if (!oldModule) {
					console.log(debugSessionName, 'ignoring js change, as module is not loaded', relativePath);
					return;
				}

				// Check if we can reload
				// eslint-disable-next-line local/code-no-any-casts
				const g = globalThis as any;

				// A frozen copy of the previous exports
				const oldExports = Object.freeze({ ...oldModule.exports });
				const reloadFn = g.$hotReload_applyNewExports?.({ oldExports, newSrc, config });

				if (!reloadFn) {
					console.log(debugSessionName, 'ignoring js change, as module does not support hot-reload', relativePath);
					hotReloadData.shouldReload = true;

					reloadFailedJsFiles.push({ relativePath, path });

					setMessage(`hot reload not supported for ${formatPath(relativePath)} - ${new Date().toLocaleTimeString()}`);
					return;
				}

				// Eval maintains source maps
				function newScript(/* this parameter is used by newSrc */ define) {
					// eslint-disable-next-line no-eval
					eval(newSrc); // CodeQL [SM01632] This code is only executed during development. It is required for the hot-reload functionality.
				}

				newScript(/* define */ function (deps, callback) {
					// Evaluating the new code was successful.

					// Redefine the module
					delete moduleManager._modules2[moduleId];
					moduleManager.defineModule(moduleIdStr, deps, callback);
					const newModule = moduleManager._modules2[moduleId];


					// Patch the exports of the old module, so that modules using the old module get the new exports
					Object.assign(oldModule.exports, newModule.exports);
					// We override the exports so that future reloads still patch the initial exports.
					newModule.exports = oldModule.exports;

					const successful = reloadFn(newModule.exports);
					if (!successful) {
						hotReloadData.shouldReload = true;
						setMessage(`hot reload failed ${formatPath(relativePath)} - ${new Date().toLocaleTimeString()}`);
						console.log(debugSessionName, 'hot reload was not successful', relativePath);
						return;
					}

					console.log(debugSessionName, 'hot reloaded', moduleIdStr);
					setMessage(`successfully reloaded ${formatPath(relativePath)} - ${new Date().toLocaleTimeString()}`);
				});
			}

			function setMessage(message: string) {
				const domElem = (document.querySelector('.titlebar-center .window-title')) as HTMLDivElement | undefined;
				if (!domElem) { return; }
				if (!hotReloadData.timeout) {
					hotReloadData.originalWindowTitle = domElem.innerText;
				} else {
					clearTimeout(hotReloadData.timeout);
				}
				if (hotReloadData.shouldReload) {
					message += ' (manual reload required)';
				}

				domElem.innerText = message;
				hotReloadData.timeout = setTimeout(() => {
					hotReloadData.timeout = undefined;
					// If wanted, we can restore the previous title message
					// domElem.replaceChildren(hotReloadData.originalWindowTitle);
				}, 5000);
			}

			function formatPath(path: string): string {
				const parts = path.split('/');
				parts.reverse();
				let result = parts[0];
				parts.shift();
				for (const p of parts) {
					if (result.length + p.length > 40) {
						break;
					}
					result = p + '/' + result;
					if (result.length > 20) {
						break;
					}
				}
				return result;
			}

			function trimEnd(str, suffix) {
				if (str.endsWith(suffix)) {
					return str.substring(0, str.length - suffix.length);
				}
				return str;
			}
		}
	}

	const additionalJsCode = `
(${(function () {
			globalThis.$hotReload_deprecateExports = new Set<(oldExports: any, newExports: any) => void>();
		}).toString()})();
${$watchChanges.toString()}
$watchChanges(${JSON.stringify(fileChangesUrl)});
`;

	return `${loaderJsCode}\n${additionalJsCode}`;
}

// #endregion

// #region Bundling

class CachedBundle {
	public readonly entryModulePath = this.mapper.resolveRequestToPath(this.moduleId)!;

	constructor(
		private readonly moduleId: string,
		private readonly mapper: SimpleModuleIdPathMapper,
	) {
	}

	private loader: ModuleLoader | undefined = undefined;

	private bundlePromise: Promise<Buffer> | undefined = undefined;
	public async bundle(): Promise<Buffer> {
		if (!this.bundlePromise) {
			this.bundlePromise = (async () => {
				if (!this.loader) {
					this.loader = new ModuleLoader(this.mapper);
					await this.loader.addModuleAndDependencies(this.entryModulePath);
				}
				const editorEntryPoint = await this.loader.getModule(this.entryModulePath);
				const content = bundleWithDependencies(editorEntryPoint!);
				return content;
			})();
		}
		return this.bundlePromise;
	}

	public async setModuleContent(path: string, newContent: string): Promise<void> {
		if (!this.loader) {
			return;
		}
		const module = await this.loader!.getModule(path);
		if (module) {
			if (!this.loader.updateContent(module, newContent)) {
				this.loader = undefined;
			}
		}
		this.bundlePromise = undefined;
	}
}

function bundleWithDependencies(module: IModule): Buffer {
	const visited = new Set<IModule>();
	const builder = new SourceMapBuilder();

	function visit(module: IModule) {
		if (visited.has(module)) {
			return;
		}
		visited.add(module);
		for (const dep of module.dependencies) {
			visit(dep);
		}
		builder.addSource(module.source);
	}

	visit(module);

	const sourceMap = builder.toSourceMap();
	sourceMap.sourceRoot = module.source.sourceMap.sourceRoot;
	const sourceMapBase64Str = Buffer.from(JSON.stringify(sourceMap)).toString('base64');

	builder.addLine(`//# sourceMappingURL=data:application/json;base64,${sourceMapBase64Str}`);

	return builder.toContent();
}

class ModuleLoader {
	private readonly modules = new Map<string, Promise<IModule | undefined>>();

	constructor(private readonly mapper: SimpleModuleIdPathMapper) { }

	public getModule(path: string): Promise<IModule | undefined> {
		return Promise.resolve(this.modules.get(path));
	}

	public updateContent(module: IModule, newContent: string): boolean {
		const parsedModule = parseModule(newContent, module.path, this.mapper);
		if (!parsedModule) {
			return false;
		}
		if (!arrayEquals(parsedModule.dependencyRequests, module.dependencyRequests)) {
			return false;
		}

		module.dependencyRequests = parsedModule.dependencyRequests;
		module.source = parsedModule.source;

		return true;
	}

	async addModuleAndDependencies(path: string): Promise<IModule | undefined> {
		if (this.modules.has(path)) {
			return this.modules.get(path)!;
		}

		const promise = (async () => {
			const content = await fsPromise.readFile(path, { encoding: 'utf-8' });

			const parsedModule = parseModule(content, path, this.mapper);
			if (!parsedModule) {
				return undefined;
			}

			const dependencies = (await Promise.all(parsedModule.dependencyRequests.map(async r => {
				if (r === 'require' || r === 'exports' || r === 'module') {
					return null;
				}

				const depPath = this.mapper.resolveRequestToPath(r, path);
				if (!depPath) {
					return null;
				}
				return await this.addModuleAndDependencies(depPath);
			}))).filter((d): d is IModule => !!d);

			const module: IModule = {
				id: this.mapper.getModuleId(path)!,
				dependencyRequests: parsedModule.dependencyRequests,
				dependencies,
				path,
				source: parsedModule.source,
			};
			return module;
		})();

		this.modules.set(path, promise);
		return promise;
	}
}

function arrayEquals<T>(a: T[], b: T[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

const encoder = new TextEncoder();

function parseModule(content: string, path: string, mapper: SimpleModuleIdPathMapper): { source: Source; dependencyRequests: string[] } | undefined {
	const m = content.match(/define\((\[.*?\])/);
	if (!m) {
		return undefined;
	}

	const dependencyRequests = JSON.parse(m[1].replace(/'/g, '"')) as string[];

	const sourceMapHeader = '//# sourceMappingURL=data:application/json;base64,';
	const idx = content.indexOf(sourceMapHeader);

	let sourceMap: any = null;
	if (idx !== -1) {
		const sourceMapJsonStr = Buffer.from(content.substring(idx + sourceMapHeader.length), 'base64').toString('utf-8');
		sourceMap = JSON.parse(sourceMapJsonStr);
		content = content.substring(0, idx);
	}

	content = content.replace('define([', `define("${mapper.getModuleId(path)}", [`);

	const contentBuffer = Buffer.from(encoder.encode(content));
	const source = new Source(contentBuffer, sourceMap);

	return { dependencyRequests, source };
}

class SimpleModuleIdPathMapper {
	constructor(public readonly rootDir: string) { }

	public getModuleId(path: string): string | null {
		if (!path.startsWith(this.rootDir) || !path.endsWith('.js')) {
			return null;
		}
		const moduleId = path.substring(this.rootDir.length + 1);


		return moduleId.replace(/\\/g, '/').substring(0, moduleId.length - 3);
	}

	public resolveRequestToPath(request: string, requestingModulePath?: string): string | null {
		if (request.indexOf('css!') !== -1) {
			return null;
		}

		if (request.startsWith('.')) {
			return path.join(path.dirname(requestingModulePath!), request + '.js');
		} else {
			return path.join(this.rootDir, request + '.js');
		}
	}
}

interface IModule {
	id: string;
	dependencyRequests: string[];
	dependencies: IModule[];
	path: string;
	source: Source;
}

// #endregion

// #region SourceMapBuilder

// From https://stackoverflow.com/questions/29905373/how-to-create-sourcemaps-for-concatenated-files with modifications

class Source {
	// Ends with \n
	public readonly content: Buffer;
	public readonly sourceMap: SourceMap;
	public readonly sourceLines: number;

	public readonly sourceMapMappings: Buffer;


	constructor(content: Buffer, sourceMap: SourceMap | undefined) {
		if (!sourceMap) {
			sourceMap = SourceMapBuilder.emptySourceMap;
		}

		let sourceLines = countNL(content);
		if (content.length > 0 && content[content.length - 1] !== 10) {
			sourceLines++;
			content = Buffer.concat([content, Buffer.from([10])]);
		}

		this.content = content;
		this.sourceMap = sourceMap;
		this.sourceLines = sourceLines;
		this.sourceMapMappings = typeof this.sourceMap.mappings === 'string'
			? Buffer.from(encoder.encode(sourceMap.mappings as string))
			: this.sourceMap.mappings;
	}
}

class SourceMapBuilder {
	public static emptySourceMap: SourceMap = { version: 3, sources: [], mappings: Buffer.alloc(0) };

	private readonly outputBuffer = new DynamicBuffer();
	private readonly sources: string[] = [];
	private readonly mappings = new DynamicBuffer();
	private lastSourceIndex = 0;
	private lastSourceLine = 0;
	private lastSourceCol = 0;

	addLine(text: string) {
		this.outputBuffer.addString(text);
		this.outputBuffer.addByte(10);
		this.mappings.addByte(59); // ;
	}

	addSource(source: Source) {
		const sourceMap = source.sourceMap;
		this.outputBuffer.addBuffer(source.content);

		const sourceRemap: number[] = [];
		for (const v of sourceMap.sources) {
			let pos = this.sources.indexOf(v);
			if (pos < 0) {
				pos = this.sources.length;
				this.sources.push(v);
			}
			sourceRemap.push(pos);
		}
		let lastOutputCol = 0;

		const inputMappings = source.sourceMapMappings;
		let outputLine = 0;
		let ip = 0;
		let inOutputCol = 0;
		let inSourceIndex = 0;
		let inSourceLine = 0;
		let inSourceCol = 0;
		let shift = 0;
		let value = 0;
		let valpos = 0;
		const commit = () => {
			if (valpos === 0) { return; }
			this.mappings.addVLQ(inOutputCol - lastOutputCol);
			lastOutputCol = inOutputCol;
			if (valpos === 1) {
				valpos = 0;
				return;
			}
			const outSourceIndex = sourceRemap[inSourceIndex];
			this.mappings.addVLQ(outSourceIndex - this.lastSourceIndex);
			this.lastSourceIndex = outSourceIndex;
			this.mappings.addVLQ(inSourceLine - this.lastSourceLine);
			this.lastSourceLine = inSourceLine;
			this.mappings.addVLQ(inSourceCol - this.lastSourceCol);
			this.lastSourceCol = inSourceCol;
			valpos = 0;
		};
		while (ip < inputMappings.length) {
			let b = inputMappings[ip++];
			if (b === 59) { // ;
				commit();
				this.mappings.addByte(59);
				inOutputCol = 0;
				lastOutputCol = 0;
				outputLine++;
			} else if (b === 44) { // ,
				commit();
				this.mappings.addByte(44);
			} else {
				b = charToInteger[b];
				if (b === 255) { throw new Error('Invalid sourceMap'); }
				value += (b & 31) << shift;
				if (b & 32) {
					shift += 5;
				} else {
					const shouldNegate = value & 1;
					value >>= 1;
					if (shouldNegate) { value = -value; }
					switch (valpos) {
						case 0: inOutputCol += value; break;
						case 1: inSourceIndex += value; break;
						case 2: inSourceLine += value; break;
						case 3: inSourceCol += value; break;
					}
					valpos++;
					value = shift = 0;
				}
			}
		}
		commit();
		while (outputLine < source.sourceLines) {
			this.mappings.addByte(59);
			outputLine++;
		}
	}

	toContent(): Buffer {
		return this.outputBuffer.toBuffer();
	}

	toSourceMap(sourceRoot?: string): SourceMap {
		return { version: 3, sourceRoot, sources: this.sources, mappings: this.mappings.toBuffer().toString() };
	}
}

export interface SourceMap {
	version: number; // always 3
	file?: string;
	sourceRoot?: string;
	sources: string[];
	sourcesContent?: string[];
	names?: string[];
	mappings: string | Buffer;
}

const charToInteger = Buffer.alloc(256);
const integerToChar = Buffer.alloc(64);

charToInteger.fill(255);

'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('').forEach((char, i) => {
	charToInteger[char.charCodeAt(0)] = i;
	integerToChar[i] = char.charCodeAt(0);
});

class DynamicBuffer {
	private buffer: Buffer;
	private size: number;

	constructor() {
		this.buffer = Buffer.alloc(512);
		this.size = 0;
	}

	ensureCapacity(capacity: number) {
		if (this.buffer.length >= capacity) {
			return;
		}
		const oldBuffer = this.buffer;
		this.buffer = Buffer.alloc(Math.max(oldBuffer.length * 2, capacity));
		oldBuffer.copy(this.buffer);
	}

	addByte(b: number) {
		this.ensureCapacity(this.size + 1);
		this.buffer[this.size++] = b;
	}

	addVLQ(num: number) {
		let clamped: number;

		if (num < 0) {
			num = (-num << 1) | 1;
		} else {
			num <<= 1;
		}

		do {
			clamped = num & 31;
			num >>= 5;

			if (num > 0) {
				clamped |= 32;
			}

			this.addByte(integerToChar[clamped]);
		} while (num > 0);
	}

	addString(s: string) {
		const l = Buffer.byteLength(s);
		this.ensureCapacity(this.size + l);
		this.buffer.write(s, this.size);
		this.size += l;
	}

	addBuffer(b: Buffer) {
		this.ensureCapacity(this.size + b.length);
		b.copy(this.buffer, this.size);
		this.size += b.length;
	}

	toBuffer(): Buffer {
		return this.buffer.slice(0, this.size);
	}
}

function countNL(b: Buffer): number {
	let res = 0;
	for (let i = 0; i < b.length; i++) {
		if (b[i] === 10) { res++; }
	}
	return res;
}

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: scripts/test-documentation.bat]---
Location: vscode-main/scripts/test-documentation.bat

```bat
@echo off
setlocal

echo Runs tests against the current documentation in https://github.com/microsoft/vscode-docs/tree/vnext

pushd %~dp0\..

:: Endgame tests
call .\scripts\test.bat --runGlob **\*.releaseTest.js %*
if %errorlevel% neq 0 exit /b %errorlevel%


rmdir /s /q %VSCODEUSERDATADIR%

popd

endlocal
```

--------------------------------------------------------------------------------

---[FILE: scripts/test-documentation.sh]---
Location: vscode-main/scripts/test-documentation.sh

```bash
#!/usr/bin/env bash
set -e

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname $(dirname $(realpath "$0")))
	VSCODEUSERDATADIR=`mktemp -d -t 'myuserdatadir'`
else
	ROOT=$(dirname $(dirname $(readlink -f $0)))
	VSCODEUSERDATADIR=`mktemp -d 2>/dev/null`
fi

cd $ROOT

echo "Runs tests against the current documentation in https://github.com/microsoft/vscode-docs/tree/vnext"

# Tests
./scripts/test.sh --runGlob **/*.releaseTest.js "$@"


rm -r $VSCODEUSERDATADIR
```

--------------------------------------------------------------------------------

---[FILE: scripts/test-integration.bat]---
Location: vscode-main/scripts/test-integration.bat

```bat
@echo off
setlocal

pushd %~dp0\..

set VSCODEUSERDATADIR=%TEMP%\vscodeuserfolder-%RANDOM%-%TIME:~6,2%
set VSCODECRASHDIR=%~dp0\..\.build\crashes
set VSCODELOGSDIR=%~dp0\..\.build\logs\integration-tests

:: Figure out which Electron to use for running tests
if "%INTEGRATION_TEST_ELECTRON_PATH%"=="" (
	chcp 65001
	set INTEGRATION_TEST_ELECTRON_PATH=.\scripts\code.bat
	set VSCODE_BUILD_BUILTIN_EXTENSIONS_SILENCE_PLEASE=1

	echo Running integration tests out of sources.
) else (
	set VSCODE_CLI=1
	set ELECTRON_ENABLE_LOGGING=1

	echo Running integration tests with '%INTEGRATION_TEST_ELECTRON_PATH%' as build.
)

echo Storing crash reports into '%VSCODECRASHDIR%'.
echo Storing log files into '%VSCODELOGSDIR%'.


:: Unit tests

echo.
echo ### node.js integration tests
call .\scripts\test.bat --runGlob **\*.integrationTest.js %*
if %errorlevel% neq 0 exit /b %errorlevel%


:: Tests in the extension host

set API_TESTS_EXTRA_ARGS=--disable-telemetry --disable-experiments --skip-welcome --skip-release-notes --crash-reporter-directory=%VSCODECRASHDIR% --logsPath=%VSCODELOGSDIR% --no-cached-data --disable-updates --use-inmemory-secretstorage --disable-extensions --disable-workspace-trust --user-data-dir=%VSCODEUSERDATADIR%

echo.
echo ### API tests (folder)
call "%INTEGRATION_TEST_ELECTRON_PATH%" %~dp0\..\extensions\vscode-api-tests\testWorkspace --enable-proposed-api=vscode.vscode-api-tests --extensionDevelopmentPath=%~dp0\..\extensions\vscode-api-tests --extensionTestsPath=%~dp0\..\extensions\vscode-api-tests\out\singlefolder-tests %API_TESTS_EXTRA_ARGS%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### API tests (workspace)
call "%INTEGRATION_TEST_ELECTRON_PATH%" %~dp0\..\extensions\vscode-api-tests\testworkspace.code-workspace --enable-proposed-api=vscode.vscode-api-tests --extensionDevelopmentPath=%~dp0\..\extensions\vscode-api-tests --extensionTestsPath=%~dp0\..\extensions\vscode-api-tests\out\workspace-tests %API_TESTS_EXTRA_ARGS%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Colorize tests
call npm run test-extension -- -l vscode-colorize-tests
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Terminal Suggest tests
call npm run test-extension -- -l terminal-suggest --enable-proposed-api=vscode.vscode-api-tests
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### TypeScript tests
call "%INTEGRATION_TEST_ELECTRON_PATH%" %~dp0\..\extensions\typescript-language-features\test-workspace --extensionDevelopmentPath=%~dp0\..\extensions\typescript-language-features --extensionTestsPath=%~dp0\..\extensions\typescript-language-features\out\test\unit %API_TESTS_EXTRA_ARGS%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Markdown tests
call npm run test-extension -- -l markdown-language-features
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Emmet tests
call "%INTEGRATION_TEST_ELECTRON_PATH%" %~dp0\..\extensions\emmet\test-workspace --extensionDevelopmentPath=%~dp0\..\extensions\emmet --extensionTestsPath=%~dp0\..\extensions\emmet\out\test %API_TESTS_EXTRA_ARGS%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Git tests
for /f "delims=" %%i in ('node -p "require('fs').realpathSync.native(require('os').tmpdir())"') do set TEMPDIR=%%i
set GITWORKSPACE=%TEMPDIR%\git-%RANDOM%
mkdir %GITWORKSPACE%
call "%INTEGRATION_TEST_ELECTRON_PATH%" %GITWORKSPACE% --extensionDevelopmentPath=%~dp0\..\extensions\git --extensionTestsPath=%~dp0\..\extensions\git\out\test %API_TESTS_EXTRA_ARGS%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Git Base tests
call npm run test-extension -- -l git-base
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Ipynb tests
call npm run test-extension -- -l ipynb
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Notebook Output tests
call npm run test-extension -- -l notebook-renderers
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Configuration editing tests
set CFWORKSPACE=%TEMPDIR%\cf-%RANDOM%
mkdir %CFWORKSPACE%
call npm run test-extension -- -l configuration-editing
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### GitHub Authentication tests
call npm run test-extension -- -l github-authentication
if %errorlevel% neq 0 exit /b %errorlevel%

:: Tests standalone (CommonJS)

echo.
echo ### CSS tests
call %~dp0\node-electron.bat %~dp0\..\extensions\css-language-features/server/test/index.js
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### HTML tests
call %~dp0\node-electron.bat %~dp0\..\extensions\html-language-features/server/test/index.js
if %errorlevel% neq 0 exit /b %errorlevel%


:: Cleanup

rmdir /s /q %VSCODEUSERDATADIR%

popd

endlocal
```

--------------------------------------------------------------------------------

---[FILE: scripts/test-integration.sh]---
Location: vscode-main/scripts/test-integration.sh

```bash
#!/usr/bin/env bash
set -e

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname $(dirname $(realpath "$0")))
else
	ROOT=$(dirname $(dirname $(readlink -f $0)))
fi

VSCODEUSERDATADIR=`mktemp -d 2>/dev/null`
VSCODECRASHDIR=$ROOT/.build/crashes
VSCODELOGSDIR=$ROOT/.build/logs/integration-tests

cd $ROOT

# Figure out which Electron to use for running tests
if [ -z "$INTEGRATION_TEST_ELECTRON_PATH" ]
then
	INTEGRATION_TEST_ELECTRON_PATH="./scripts/code.sh"

	echo "Running integration tests out of sources."
else
	export VSCODE_CLI=1
	export ELECTRON_ENABLE_LOGGING=1

	echo "Running integration tests with '$INTEGRATION_TEST_ELECTRON_PATH' as build."
fi

echo "Storing crash reports into '$VSCODECRASHDIR'."
echo "Storing log files into '$VSCODELOGSDIR'."


# Unit tests

echo
echo "### node.js integration tests"
echo
./scripts/test.sh --runGlob **/*.integrationTest.js "$@"


# Tests in the extension host

API_TESTS_EXTRA_ARGS="--disable-telemetry --disable-experiments --skip-welcome --skip-release-notes --crash-reporter-directory=$VSCODECRASHDIR --logsPath=$VSCODELOGSDIR --no-cached-data --disable-updates --use-inmemory-secretstorage --disable-extensions --disable-workspace-trust --user-data-dir=$VSCODEUSERDATADIR"

if [ -z "$INTEGRATION_TEST_APP_NAME" ]; then
	kill_app() { true; }
else
	kill_app() { killall $INTEGRATION_TEST_APP_NAME || true; }
fi

echo
echo "### API tests (folder)"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" $ROOT/extensions/vscode-api-tests/testWorkspace --enable-proposed-api=vscode.vscode-api-tests --extensionDevelopmentPath=$ROOT/extensions/vscode-api-tests --extensionTestsPath=$ROOT/extensions/vscode-api-tests/out/singlefolder-tests $API_TESTS_EXTRA_ARGS
kill_app

echo
echo "### API tests (workspace)"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" $ROOT/extensions/vscode-api-tests/testworkspace.code-workspace --enable-proposed-api=vscode.vscode-api-tests --extensionDevelopmentPath=$ROOT/extensions/vscode-api-tests --extensionTestsPath=$ROOT/extensions/vscode-api-tests/out/workspace-tests $API_TESTS_EXTRA_ARGS
kill_app

echo
echo "### Colorize tests"
echo
npm run test-extension -- -l vscode-colorize-tests
kill_app

echo
echo "### Terminal Suggest tests"
echo
npm run test-extension -- -l terminal-suggest --enable-proposed-api=vscode.vscode-api-tests
kill_app

echo
echo "### TypeScript tests"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" $ROOT/extensions/typescript-language-features/test-workspace --extensionDevelopmentPath=$ROOT/extensions/typescript-language-features --extensionTestsPath=$ROOT/extensions/typescript-language-features/out/test/unit $API_TESTS_EXTRA_ARGS
kill_app

echo
echo "### Markdown tests"
echo
npm run test-extension -- -l markdown-language-features
kill_app

echo
echo "### Emmet tests"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" $ROOT/extensions/emmet/test-workspace --extensionDevelopmentPath=$ROOT/extensions/emmet --extensionTestsPath=$ROOT/extensions/emmet/out/test $API_TESTS_EXTRA_ARGS
kill_app

echo
echo "### Git tests"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" $(mktemp -d 2>/dev/null) --extensionDevelopmentPath=$ROOT/extensions/git --extensionTestsPath=$ROOT/extensions/git/out/test $API_TESTS_EXTRA_ARGS
kill_app

echo
echo "### Git Base tests"
echo
npm run test-extension -- -l git-base
kill_app

echo
echo "### Ipynb tests"
echo
npm run test-extension -- -l ipynb
kill_app

echo
echo "### Notebook Output tests"
echo
npm run test-extension -- -l notebook-renderers
kill_app

echo
echo "### Configuration editing tests"
echo
npm run test-extension -- -l configuration-editing
kill_app

echo
echo "### GitHub Authentication tests"
echo
npm run test-extension -- -l github-authentication
kill_app

# Tests standalone (CommonJS)

echo
echo "### CSS tests"
echo
cd $ROOT/extensions/css-language-features/server && $ROOT/scripts/node-electron.sh test/index.js

echo
echo "### HTML tests"
echo
cd $ROOT/extensions/html-language-features/server && $ROOT/scripts/node-electron.sh test/index.js


# Cleanup

rm -rf $VSCODEUSERDATADIR
```

--------------------------------------------------------------------------------

---[FILE: scripts/test-remote-integration.bat]---
Location: vscode-main/scripts/test-remote-integration.bat

```bat
@echo off
setlocal

pushd %~dp0\..

IF "%~1" == "" (
	set AUTHORITY=vscode-remote://test+test/
	:: backward to forward slashed
	set EXT_PATH=%CD:\=/%/extensions

	:: Download nodejs executable for remote
	call npm run gulp node
) else (
	set AUTHORITY=%1
	set EXT_PATH=%2
	set VSCODEUSERDATADIR=%3
)
IF "%VSCODEUSERDATADIR%" == "" (
	set VSCODEUSERDATADIR=%TMP%\vscodeuserfolder-%RANDOM%-%TIME:~6,5%
)

set REMOTE_EXT_PATH=%AUTHORITY%%EXT_PATH%
set VSCODECRASHDIR=%~dp0\..\.build\crashes
set VSCODELOGSDIR=%~dp0\..\.build\logs\integration-tests-remote
set TESTRESOLVER_DATA_FOLDER=%TMP%\testresolverdatafolder-%RANDOM%-%TIME:~6,5%
set TESTRESOLVER_LOGS_FOLDER=%VSCODELOGSDIR%\server

if "%VSCODE_REMOTE_SERVER_PATH%"=="" (
	echo Using remote server out of sources for integration tests
) else (
	set TESTRESOLVER_INSTALL_BUILTIN_EXTENSION=ms-vscode.vscode-smoketest-check
	echo Using '%VSCODE_REMOTE_SERVER_PATH%' as server path
)

:: Figure out which Electron to use for running tests
if "%INTEGRATION_TEST_ELECTRON_PATH%"=="" (
	chcp 65001
	set INTEGRATION_TEST_ELECTRON_PATH=.\scripts\code.bat
	set API_TESTS_EXTRA_ARGS_BUILT=

	echo Running integration tests out of sources.
) else (
	set VSCODE_CLI=1
	set ELECTRON_ENABLE_LOGGING=1

	:: Extra arguments only when running against a built version
	set API_TESTS_EXTRA_ARGS_BUILT=--extensions-dir=%EXT_PATH% --enable-proposed-api=vscode.vscode-test-resolver --enable-proposed-api=vscode.vscode-api-tests

 	echo Using %INTEGRATION_TEST_ELECTRON_PATH% as Electron path
)

echo Storing crash reports into '%VSCODECRASHDIR%'
echo Storing log files into '%VSCODELOGSDIR%'


:: Tests in the extension host

set API_TESTS_EXTRA_ARGS=--disable-telemetry --disable-experiments --skip-welcome --skip-release-notes --crash-reporter-directory=%VSCODECRASHDIR% --logsPath=%VSCODELOGSDIR% --no-cached-data --disable-updates --use-inmemory-secretstorage --disable-inspect --disable-workspace-trust --user-data-dir=%VSCODEUSERDATADIR%

echo.
echo ### API tests (folder)
call "%INTEGRATION_TEST_ELECTRON_PATH%" --folder-uri=%REMOTE_EXT_PATH%/vscode-api-tests/testWorkspace --extensionDevelopmentPath=%REMOTE_EXT_PATH%/vscode-api-tests --extensionTestsPath=%REMOTE_EXT_PATH%/vscode-api-tests/out/singlefolder-tests %API_TESTS_EXTRA_ARGS% %API_TESTS_EXTRA_ARGS_BUILT%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### API tests (workspace)
call "%INTEGRATION_TEST_ELECTRON_PATH%" --file-uri=%REMOTE_EXT_PATH%/vscode-api-tests/testworkspace.code-workspace --extensionDevelopmentPath=%REMOTE_EXT_PATH%/vscode-api-tests --extensionTestsPath=%REMOTE_EXT_PATH%/vscode-api-tests/out/workspace-tests %API_TESTS_EXTRA_ARGS% %API_TESTS_EXTRA_ARGS_BUILT%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### TypeScript tests
call "%INTEGRATION_TEST_ELECTRON_PATH%" --folder-uri=%REMOTE_EXT_PATH%/typescript-language-features/test-workspace --extensionDevelopmentPath=%REMOTE_EXT_PATH%/typescript-language-features --extensionTestsPath=%REMOTE_EXT_PATH%/typescript-language-features\out\test\unit %API_TESTS_EXTRA_ARGS% %API_TESTS_EXTRA_ARGS_BUILT%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Markdown tests
call "%INTEGRATION_TEST_ELECTRON_PATH%" --folder-uri=%REMOTE_EXT_PATH%/markdown-language-features/test-workspace --extensionDevelopmentPath=%REMOTE_EXT_PATH%/markdown-language-features --extensionTestsPath=%REMOTE_EXT_PATH%/markdown-language-features/out/test %API_TESTS_EXTRA_ARGS% %API_TESTS_EXTRA_ARGS_BUILT%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Emmet tests
call "%INTEGRATION_TEST_ELECTRON_PATH%" --folder-uri=%REMOTE_EXT_PATH%/emmet/test-workspace --extensionDevelopmentPath=%REMOTE_EXT_PATH%/emmet --extensionTestsPath=%REMOTE_EXT_PATH%/emmet/out/test %API_TESTS_EXTRA_ARGS% %API_TESTS_EXTRA_ARGS_BUILT%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Git tests
for /f "delims=" %%i in ('node -p "require('fs').realpathSync.native(require('os').tmpdir())"') do set TEMPDIR=%%i
set GITWORKSPACE=%TEMPDIR%\git-%RANDOM%
mkdir %GITWORKSPACE%
call "%INTEGRATION_TEST_ELECTRON_PATH%" --folder-uri=%AUTHORITY%%GITWORKSPACE% --extensionDevelopmentPath=%REMOTE_EXT_PATH%/git --extensionTestsPath=%REMOTE_EXT_PATH%/git/out/test %API_TESTS_EXTRA_ARGS% %API_TESTS_EXTRA_ARGS_BUILT%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Ipynb tests
set IPYNBWORKSPACE=%TEMPDIR%\ipynb-%RANDOM%
mkdir %IPYNBWORKSPACE%
call "%INTEGRATION_TEST_ELECTRON_PATH%" --folder-uri=%AUTHORITY%%IPYNBWORKSPACE% --extensionDevelopmentPath=%REMOTE_EXT_PATH%/ipynb --extensionTestsPath=%REMOTE_EXT_PATH%/ipynb/out/test %API_TESTS_EXTRA_ARGS% %API_TESTS_EXTRA_ARGS_BUILT%
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Configuration editing tests
set CFWORKSPACE=%TEMPDIR%\cf-%RANDOM%
mkdir %CFWORKSPACE%
call "%INTEGRATION_TEST_ELECTRON_PATH%" --folder-uri=%AUTHORITY%/%CFWORKSPACE% --extensionDevelopmentPath=%REMOTE_EXT_PATH%/configuration-editing --extensionTestsPath=%REMOTE_EXT_PATH%/configuration-editing/out/test %API_TESTS_EXTRA_ARGS% %API_TESTS_EXTRA_ARGS_BUILT%
if %errorlevel% neq 0 exit /b %errorlevel%

:: Cleanup

IF "%3" == "" (
	rmdir /s /q %VSCODEUSERDATADIR%
)

rmdir /s /q %TESTRESOLVER_DATA_FOLDER%

popd

endlocal
```

--------------------------------------------------------------------------------

---[FILE: scripts/test-remote-integration.sh]---
Location: vscode-main/scripts/test-remote-integration.sh

```bash
#!/usr/bin/env bash
set -e

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname $(dirname $(realpath "$0")))
else
	ROOT=$(dirname $(dirname $(readlink -f $0)))
fi

VSCODEUSERDATADIR=`mktemp -d 2>/dev/null`
VSCODECRASHDIR=$ROOT/.build/crashes
VSCODELOGSDIR=$ROOT/.build/logs/integration-tests-remote
TESTRESOLVER_DATA_FOLDER=`mktemp -d 2>/dev/null`

cd $ROOT

if [[ "$1" == "" ]]; then
	AUTHORITY=vscode-remote://test+test
	EXT_PATH=$ROOT/extensions
	# Load remote node
	npm run gulp node
else
	AUTHORITY=$1
	EXT_PATH=$2
	VSCODEUSERDATADIR=${3:-$VSCODEUSERDATADIR}
fi

export REMOTE_VSCODE=$AUTHORITY$EXT_PATH

# Figure out which Electron to use for running tests
if [ -z "$INTEGRATION_TEST_ELECTRON_PATH" ]
then
	INTEGRATION_TEST_ELECTRON_PATH="./scripts/code.sh"

	# No extra arguments when running out of sources
	EXTRA_INTEGRATION_TEST_ARGUMENTS=""

	echo "Running remote integration tests out of sources."
else
	export VSCODE_CLI=1
	export ELECTRON_ENABLE_LOGGING=1

	# Running from a build, we need to enable the vscode-test-resolver extension
	EXTRA_INTEGRATION_TEST_ARGUMENTS="--extensions-dir=$EXT_PATH  --enable-proposed-api=vscode.vscode-test-resolver --enable-proposed-api=vscode.vscode-api-tests"

	echo "Running remote integration tests with $INTEGRATION_TEST_ELECTRON_PATH as build."
fi

export TESTRESOLVER_DATA_FOLDER=$TESTRESOLVER_DATA_FOLDER
export TESTRESOLVER_LOGS_FOLDER=$VSCODELOGSDIR/server

# Figure out which remote server to use for running tests
if [ -z "$VSCODE_REMOTE_SERVER_PATH" ]
then
	echo "Using remote server out of sources for integration tests"
else
	echo "Using $VSCODE_REMOTE_SERVER_PATH as server path for integration tests"
	export TESTRESOLVER_INSTALL_BUILTIN_EXTENSION='ms-vscode.vscode-smoketest-check'
fi

if [ -z "$INTEGRATION_TEST_APP_NAME" ]; then
	kill_app() { true; }
else
	kill_app() { killall $INTEGRATION_TEST_APP_NAME || true; }
fi

API_TESTS_EXTRA_ARGS="--disable-telemetry --disable-experiments --skip-welcome --skip-release-notes --crash-reporter-directory=$VSCODECRASHDIR --logsPath=$VSCODELOGSDIR --no-cached-data --disable-updates --use-inmemory-secretstorage --disable-workspace-trust --user-data-dir=$VSCODEUSERDATADIR"

echo "Storing crash reports into '$VSCODECRASHDIR'."
echo "Storing log files into '$VSCODELOGSDIR'."


# Tests in the extension host

echo
echo "### API tests (folder)"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" --folder-uri=$REMOTE_VSCODE/vscode-api-tests/testWorkspace --extensionDevelopmentPath=$REMOTE_VSCODE/vscode-api-tests --extensionTestsPath=$REMOTE_VSCODE/vscode-api-tests/out/singlefolder-tests $API_TESTS_EXTRA_ARGS $EXTRA_INTEGRATION_TEST_ARGUMENTS
kill_app

echo
echo "### API tests (workspace)"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" --file-uri=$REMOTE_VSCODE/vscode-api-tests/testworkspace.code-workspace --extensionDevelopmentPath=$REMOTE_VSCODE/vscode-api-tests --extensionTestsPath=$REMOTE_VSCODE/vscode-api-tests/out/workspace-tests $API_TESTS_EXTRA_ARGS $EXTRA_INTEGRATION_TEST_ARGUMENTS
kill_app

echo
echo "### TypeScript tests"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" --folder-uri=$REMOTE_VSCODE/typescript-language-features/test-workspace --extensionDevelopmentPath=$REMOTE_VSCODE/typescript-language-features --extensionTestsPath=$REMOTE_VSCODE/typescript-language-features/out/test/unit $API_TESTS_EXTRA_ARGS $EXTRA_INTEGRATION_TEST_ARGUMENTS
kill_app

echo
echo "### Markdown tests"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" --folder-uri=$REMOTE_VSCODE/markdown-language-features/test-workspace --extensionDevelopmentPath=$REMOTE_VSCODE/markdown-language-features --extensionTestsPath=$REMOTE_VSCODE/markdown-language-features/out/test $API_TESTS_EXTRA_ARGS $EXTRA_INTEGRATION_TEST_ARGUMENTS
kill_app

echo
echo "### Emmet tests"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" --folder-uri=$REMOTE_VSCODE/emmet/test-workspace --extensionDevelopmentPath=$REMOTE_VSCODE/emmet --extensionTestsPath=$REMOTE_VSCODE/emmet/out/test $API_TESTS_EXTRA_ARGS $EXTRA_INTEGRATION_TEST_ARGUMENTS
kill_app

echo
echo "### Git tests"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" --folder-uri=$AUTHORITY$(mktemp -d 2>/dev/null) --extensionDevelopmentPath=$REMOTE_VSCODE/git --extensionTestsPath=$REMOTE_VSCODE/git/out/test $API_TESTS_EXTRA_ARGS $EXTRA_INTEGRATION_TEST_ARGUMENTS
kill_app

echo
echo "### Ipynb tests"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" --folder-uri=$AUTHORITY$(mktemp -d 2>/dev/null) --extensionDevelopmentPath=$REMOTE_VSCODE/ipynb --extensionTestsPath=$REMOTE_VSCODE/ipynb/out/test $API_TESTS_EXTRA_ARGS $EXTRA_INTEGRATION_TEST_ARGUMENTS
kill_app

echo
echo "### Configuration editing tests"
echo
"$INTEGRATION_TEST_ELECTRON_PATH" --folder-uri=$AUTHORITY$(mktemp -d 2>/dev/null) --extensionDevelopmentPath=$REMOTE_VSCODE/configuration-editing --extensionTestsPath=$REMOTE_VSCODE/configuration-editing/out/test $API_TESTS_EXTRA_ARGS $EXTRA_INTEGRATION_TEST_ARGUMENTS
kill_app

# Cleanup

if [[ "$3" == "" ]]; then
	rm -rf $VSCODEUSERDATADIR
fi

rm -rf $TESTRESOLVER_DATA_FOLDER
```

--------------------------------------------------------------------------------

---[FILE: scripts/test-web-integration.bat]---
Location: vscode-main/scripts/test-web-integration.bat

```bat
@echo off
setlocal

pushd %~dp0\..

IF "%~1" == "" (
	set AUTHORITY=vscode-remote://test+test/
	:: backward to forward slashed
	set EXT_PATH=%CD:\=/%/extensions

	:: Download nodejs executable for remote
	call npm run gulp node
) else (
	set AUTHORITY=%1
	set EXT_PATH=%2
)

set REMOTE_VSCODE=%AUTHORITY%%EXT_PATH%

if "%VSCODE_REMOTE_SERVER_PATH%"=="" (
	chcp 65001

	echo Using remote server out of sources for integration web tests
) else (
	echo Using '%VSCODE_REMOTE_SERVER_PATH%' as server path for web integration tests
)

if not exist ".\test\integration\browser\out\index.js" (
	pushd test\integration\browser
	call npm run compile
	popd
	call npm run playwright-install
)


:: Tests in the extension host

echo.
echo ### API tests (folder)
call node .\test\integration\browser\out\index.js --workspacePath=.\extensions\vscode-api-tests\testWorkspace --enable-proposed-api=vscode.vscode-api-tests --extensionDevelopmentPath=.\extensions\vscode-api-tests --extensionTestsPath=.\extensions\vscode-api-tests\out\singlefolder-tests %*
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### API tests (workspace)
call node .\test\integration\browser\out\index.js --workspacePath=.\extensions\vscode-api-tests\testworkspace.code-workspace --enable-proposed-api=vscode.vscode-api-tests --extensionDevelopmentPath=.\extensions\vscode-api-tests --extensionTestsPath=.\extensions\vscode-api-tests\out\workspace-tests %*
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### TypeScript tests
call node .\test\integration\browser\out\index.js --workspacePath=.\extensions\typescript-language-features\test-workspace --extensionDevelopmentPath=.\extensions\typescript-language-features --extensionTestsPath=.\extensions\typescript-language-features\out\test\unit %*
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Markdown tests
call node .\test\integration\browser\out\index.js --workspacePath=.\extensions\markdown-language-features\test-workspace --extensionDevelopmentPath=.\extensions\markdown-language-features --extensionTestsPath=.\extensions\markdown-language-features\out\test %*
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Emmet tests
call node .\test\integration\browser\out\index.js --workspacePath=.\extensions\emmet\test-workspace --extensionDevelopmentPath=.\extensions\emmet --extensionTestsPath=.\extensions\emmet\out\test %*
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Git tests
for /f "delims=" %%i in ('node -p "require('fs').realpathSync.native(require('os').tmpdir())"') do set TEMPDIR=%%i
set GITWORKSPACE=%TEMPDIR%\git-%RANDOM%
mkdir %GITWORKSPACE%
call node .\test\integration\browser\out\index.js --workspacePath=%GITWORKSPACE% --extensionDevelopmentPath=.\extensions\git --extensionTestsPath=.\extensions\git\out\test %*
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Ipynb tests
set IPYNBWORKSPACE=%TEMPDIR%\ipynb-%RANDOM%
mkdir %IPYNBWORKSPACE%
call node .\test\integration\browser\out\index.js --workspacePath=%IPYNBWORKSPACE% --extensionDevelopmentPath=.\extensions\ipynb --extensionTestsPath=.\extensions\ipynb\out\test %*
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ### Configuration editing tests
set CFWORKSPACE=%TEMPDIR%\git-%RANDOM%
mkdir %CFWORKSPACE%
call node .\test\integration\browser\out\index.js --workspacePath=%CFWORKSPACE% --extensionDevelopmentPath=.\extensions\configuration-editing --extensionTestsPath=.\extensions\configuration-editing\out\test %*
if %errorlevel% neq 0 exit /b %errorlevel%

popd

endlocal
```

--------------------------------------------------------------------------------

---[FILE: scripts/test-web-integration.sh]---
Location: vscode-main/scripts/test-web-integration.sh

```bash
#!/usr/bin/env bash
set -e

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname $(dirname $(realpath "$0")))
else
	ROOT=$(dirname $(dirname $(readlink -f $0)))
fi

cd $ROOT

if [ -z "$VSCODE_REMOTE_SERVER_PATH" ]
then
	echo "Using remote server out of sources for integration web tests"
else
	echo "Using $VSCODE_REMOTE_SERVER_PATH as server path for web integration tests"
fi

if [ ! -e 'test/integration/browser/out/index.js' ];then
	(cd test/integration/browser && npm run compile)
	npm run playwright-install
fi


# Tests in the extension host

echo
echo "### API tests (folder)"
echo
node test/integration/browser/out/index.js --workspacePath $ROOT/extensions/vscode-api-tests/testWorkspace --enable-proposed-api=vscode.vscode-api-tests --extensionDevelopmentPath=$ROOT/extensions/vscode-api-tests --extensionTestsPath=$ROOT/extensions/vscode-api-tests/out/singlefolder-tests "$@"

echo
echo "### API tests (workspace)"
echo
node test/integration/browser/out/index.js --workspacePath $ROOT/extensions/vscode-api-tests/testworkspace.code-workspace --enable-proposed-api=vscode.vscode-api-tests --extensionDevelopmentPath=$ROOT/extensions/vscode-api-tests --extensionTestsPath=$ROOT/extensions/vscode-api-tests/out/workspace-tests "$@"

echo
echo "### TypeScript tests"
echo
node test/integration/browser/out/index.js --workspacePath $ROOT/extensions/typescript-language-features/test-workspace --extensionDevelopmentPath=$ROOT/extensions/typescript-language-features --extensionTestsPath=$ROOT/extensions/typescript-language-features/out/test/unit "$@"

echo
echo "### Markdown tests"
echo
node test/integration/browser/out/index.js --workspacePath $ROOT/extensions/markdown-language-features/test-workspace --extensionDevelopmentPath=$ROOT/extensions/markdown-language-features --extensionTestsPath=$ROOT/extensions/markdown-language-features/out/test "$@"

echo
echo "### Emmet tests"
echo
node test/integration/browser/out/index.js --workspacePath $ROOT/extensions/emmet/test-workspace --extensionDevelopmentPath=$ROOT/extensions/emmet --extensionTestsPath=$ROOT/extensions/emmet/out/test "$@"

echo
echo "### Git tests"
echo
node test/integration/browser/out/index.js --workspacePath $(mktemp -d 2>/dev/null) --extensionDevelopmentPath=$ROOT/extensions/git --extensionTestsPath=$ROOT/extensions/git/out/test "$@"

echo
echo "### Ipynb tests"
echo
node test/integration/browser/out/index.js --workspacePath $(mktemp -d 2>/dev/null) --extensionDevelopmentPath=$ROOT/extensions/ipynb --extensionTestsPath=$ROOT/extensions/ipynb/out/test "$@"

echo
echo "### Configuration editing tests"
echo
node test/integration/browser/out/index.js --workspacePath $(mktemp -d 2>/dev/null) --extensionDevelopmentPath=$ROOT/extensions/configuration-editing --extensionTestsPath=$ROOT/extensions/configuration-editing/out/test "$@"
```

--------------------------------------------------------------------------------

---[FILE: scripts/test.bat]---
Location: vscode-main/scripts/test.bat

```bat
@echo off
setlocal

set ELECTRON_RUN_AS_NODE=

pushd %~dp0\..

:: Get Code.exe location
for /f "tokens=2 delims=:," %%a in ('findstr /R /C:"\"nameShort\":.*" product.json') do set NAMESHORT=%%~a
set NAMESHORT=%NAMESHORT: "=%
set NAMESHORT=%NAMESHORT:"=%.exe
set CODE=".build\electron\%NAMESHORT%"

:: Download Electron if needed
call node build\lib\electron.js
if %errorlevel% neq 0 node .\node_modules\gulp\bin\gulp.js electron

:: Run tests
set ELECTRON_ENABLE_LOGGING=1
%CODE% .\test\unit\electron\index.js --crash-reporter-directory=%~dp0\..\.build\crashes %*

popd

endlocal

:: app.exit(0) is exiting with code 255 in Electron 1.7.4.
:: See https://github.com/microsoft/vscode/issues/28582
echo errorlevel: %errorlevel%
if %errorlevel% == 255 set errorlevel=0

exit /b %errorlevel%
```

--------------------------------------------------------------------------------

---[FILE: scripts/test.sh]---
Location: vscode-main/scripts/test.sh

```bash
#!/usr/bin/env bash
set -e

if [[ "$OSTYPE" == "darwin"* ]]; then
	realpath() { [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"; }
	ROOT=$(dirname $(dirname $(realpath "$0")))
else
	ROOT=$(dirname $(dirname $(readlink -f $0)))
fi

cd $ROOT

if [[ "$OSTYPE" == "darwin"* ]]; then
	NAME=`node -p "require('./product.json').nameLong"`
	CODE="./.build/electron/$NAME.app/Contents/MacOS/Electron"
else
	NAME=`node -p "require('./product.json').applicationName"`
	CODE=".build/electron/$NAME"
fi

VSCODECRASHDIR=$ROOT/.build/crashes

# Node modules
test -d node_modules || npm i

# Get electron
npm run electron

# Unit Tests
if [[ "$OSTYPE" == "darwin"* ]]; then
	cd $ROOT ; ulimit -n 4096 ; \
		ELECTRON_ENABLE_LOGGING=1 \
		"$CODE" \
		test/unit/electron/index.js --crash-reporter-directory=$VSCODECRASHDIR "$@"
else
	cd $ROOT ; \
		ELECTRON_ENABLE_LOGGING=1 \
		"$CODE" \
		test/unit/electron/index.js --crash-reporter-directory=$VSCODECRASHDIR "$@"
fi
```

--------------------------------------------------------------------------------

---[FILE: scripts/xterm-symlink.ps1]---
Location: vscode-main/scripts/xterm-symlink.ps1

```powershell
<#
.SYNOPSIS
    Symlinks ./node_modules/xterm to provided $XtermFolder.
#>

Param(
	[Parameter(Mandatory=$True)]
	$XtermFolder
)

$TargetFolder = "./node_modules/@xterm/xterm"

if (Test-Path $TargetFolder -PathType Container)
{
	Write-Host -ForegroundColor Green ":: Deleting $TargetFolder`n"
	Remove-Item -Path $TargetFolder
}

if (Test-Path $XtermFolder -PathType Container)
{
	Write-Host -ForegroundColor Green "`n:: Creating symlink $TargetFolder -> $XtermFolder`n"
	New-Item -Path $TargetFolder -ItemType SymbolicLink -Value $XtermFolder

	Write-Host -ForegroundColor Green "`n:: Packaging xterm.js`n"
	Set-Location $TargetFolder
	yarn package -- --mode development
	Set-Location -

	Write-Host -ForegroundColor Green "`n:: Finished! To watch changes, open the VS Code terminal in the xterm.js repo and run:`n`n    yarn package -- --mode development --watch"
}
else
{
	Write-Error -ForegroundColor Red "`n:: $XtermFolder is not a valid folder"
}
```

--------------------------------------------------------------------------------

---[FILE: scripts/xterm-update.js]---
Location: vscode-main/scripts/xterm-update.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const cp = require('child_process');
const path = require('path');

const moduleNames = [
	'@xterm/xterm',
	'@xterm/addon-clipboard',
	'@xterm/addon-image',
	'@xterm/addon-ligatures',
	'@xterm/addon-progress',
	'@xterm/addon-search',
	'@xterm/addon-serialize',
	'@xterm/addon-unicode11',
	'@xterm/addon-webgl',
];

const backendOnlyModuleNames = [
	'@xterm/headless'
];

const vscodeDir = process.argv.length >= 3 ? process.argv[2] : process.cwd();
if (path.basename(vscodeDir) !== 'vscode') {
	console.error('The cwd is not named "vscode"');
	return;
}

function getLatestModuleVersion(moduleName) {
	return new Promise((resolve, reject) => {
		cp.exec(`npm view ${moduleName} versions --json`, { cwd: vscodeDir }, (err, stdout, stderr) => {
			if (err) {
				reject(err);
			}
			let versions = JSON.parse(stdout);
			// Fix format if there is only a single version published
			if (typeof versions === 'string') {
				versions = [versions];
			}
			resolve(versions[versions.length - 1]);
		});
	});
}

async function update() {
	console.log('Fetching latest versions');
	const allModules = moduleNames.concat(backendOnlyModuleNames);
	const versionPromises = [];
	for (const m of allModules) {
		versionPromises.push(getLatestModuleVersion(m));
	}
	const latestVersionsArray = await Promise.all(versionPromises);
	const latestVersions = {};
	for (const [i, v] of latestVersionsArray.entries()) {
		latestVersions[allModules[i]] = v;
	}

	console.log('Detected versions:');
	for (const m of moduleNames.concat(backendOnlyModuleNames)) {
		console.log(`  ${m}@${latestVersions[m]}`);
	}

	const pkg = require(path.join(vscodeDir, 'package.json'));

	const modulesWithVersion = [];
	for (const m of moduleNames) {
		const moduleWithVersion = `${m}@${latestVersions[m]}`;
		if (pkg.dependencies[m] === latestVersions[m]) {
			console.log(`Skipping ${moduleWithVersion}, already up to date`);
			continue;
		}
		modulesWithVersion.push(moduleWithVersion);
	}

	if (modulesWithVersion.length > 0) {
		for (const cwd of [vscodeDir, path.join(vscodeDir, 'remote'), path.join(vscodeDir, 'remote/web')]) {
			console.log(`${path.join(cwd, 'package.json')}: Updating\n  ${modulesWithVersion.join('\n  ')}`);
			cp.execSync(`npm install ${modulesWithVersion.join(' ')}`, { cwd });
		}
	}

	const backendOnlyModulesWithVersion = [];
	for (const m of backendOnlyModuleNames) {
		const moduleWithVersion = `${m}@${latestVersions[m]}`;
		if (pkg.dependencies[m] === latestVersions[m]) {
			console.log(`Skipping ${moduleWithVersion}, already up to date`);
			continue;
		}
		backendOnlyModulesWithVersion.push(moduleWithVersion);
	}
	if (backendOnlyModulesWithVersion.length > 0) {
		for (const cwd of [vscodeDir, path.join(vscodeDir, 'remote')]) {
			console.log(`${path.join(cwd, 'package.json')}: Updating\n  ${backendOnlyModulesWithVersion.join('\n  ')}`);
			cp.execSync(`npm install ${backendOnlyModulesWithVersion.join(' ')}`, { cwd });
		}
	}
}

update();
```

--------------------------------------------------------------------------------

---[FILE: scripts/xterm-update.ps1]---
Location: vscode-main/scripts/xterm-update.ps1

```powershell
$scriptPath = Join-Path $PSScriptRoot "xterm-update.js"
node $scriptPath (Get-Location)
```

--------------------------------------------------------------------------------

---[FILE: src/bootstrap-cli.ts]---
Location: vscode-main/src/bootstrap-cli.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Delete `VSCODE_CWD` very early. We have seen
// reports where `code .` would use the wrong
// current working directory due to our variable
// somehow escaping to the parent shell
// (https://github.com/microsoft/vscode/issues/126399)
delete process.env['VSCODE_CWD'];
```

--------------------------------------------------------------------------------

---[FILE: src/bootstrap-esm.ts]---
Location: vscode-main/src/bootstrap-esm.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'node:fs';
import { register } from 'node:module';
import { product, pkg } from './bootstrap-meta.js';
import './bootstrap-node.js';
import * as performance from './vs/base/common/performance.js';
import { INLSConfiguration } from './vs/nls.js';

// Install a hook to module resolution to map 'fs' to 'original-fs'
if (process.env['ELECTRON_RUN_AS_NODE'] || process.versions['electron']) {
	const jsCode = `
	export async function resolve(specifier, context, nextResolve) {
		if (specifier === 'fs') {
			return {
				format: 'builtin',
				shortCircuit: true,
				url: 'node:original-fs'
			};
		}

		// Defer to the next hook in the chain, which would be the
		// Node.js default resolve if this is the last user-specified loader.
		return nextResolve(specifier, context);
	}`;
	register(`data:text/javascript;base64,${Buffer.from(jsCode).toString('base64')}`, import.meta.url);
}

// Prepare globals that are needed for running
globalThis._VSCODE_PRODUCT_JSON = { ...product };
globalThis._VSCODE_PACKAGE_JSON = { ...pkg };
globalThis._VSCODE_FILE_ROOT = import.meta.dirname;

//#region NLS helpers

let setupNLSResult: Promise<INLSConfiguration | undefined> | undefined = undefined;

function setupNLS(): Promise<INLSConfiguration | undefined> {
	if (!setupNLSResult) {
		setupNLSResult = doSetupNLS();
	}

	return setupNLSResult;
}

async function doSetupNLS(): Promise<INLSConfiguration | undefined> {
	performance.mark('code/willLoadNls');

	let nlsConfig: INLSConfiguration | undefined = undefined;

	let messagesFile: string | undefined;
	if (process.env['VSCODE_NLS_CONFIG']) {
		try {
			nlsConfig = JSON.parse(process.env['VSCODE_NLS_CONFIG']);
			if (nlsConfig?.languagePack?.messagesFile) {
				messagesFile = nlsConfig.languagePack.messagesFile;
			} else if (nlsConfig?.defaultMessagesFile) {
				messagesFile = nlsConfig.defaultMessagesFile;
			}

			globalThis._VSCODE_NLS_LANGUAGE = nlsConfig?.resolvedLanguage;
		} catch (e) {
			console.error(`Error reading VSCODE_NLS_CONFIG from environment: ${e}`);
		}
	}

	if (
		process.env['VSCODE_DEV'] ||	// no NLS support in dev mode
		!messagesFile					// no NLS messages file
	) {
		return undefined;
	}

	try {
		globalThis._VSCODE_NLS_MESSAGES = JSON.parse((await fs.promises.readFile(messagesFile)).toString());
	} catch (error) {
		console.error(`Error reading NLS messages file ${messagesFile}: ${error}`);

		// Mark as corrupt: this will re-create the language pack cache next startup
		if (nlsConfig?.languagePack?.corruptMarkerFile) {
			try {
				await fs.promises.writeFile(nlsConfig.languagePack.corruptMarkerFile, 'corrupted');
			} catch (error) {
				console.error(`Error writing corrupted NLS marker file: ${error}`);
			}
		}

		// Fallback to the default message file to ensure english translation at least
		if (nlsConfig?.defaultMessagesFile && nlsConfig.defaultMessagesFile !== messagesFile) {
			try {
				globalThis._VSCODE_NLS_MESSAGES = JSON.parse((await fs.promises.readFile(nlsConfig.defaultMessagesFile)).toString());
			} catch (error) {
				console.error(`Error reading default NLS messages file ${nlsConfig.defaultMessagesFile}: ${error}`);
			}
		}
	}

	performance.mark('code/didLoadNls');

	return nlsConfig;
}

//#endregion

export async function bootstrapESM(): Promise<void> {

	// NLS
	await setupNLS();
}
```

--------------------------------------------------------------------------------

---[FILE: src/bootstrap-fork.ts]---
Location: vscode-main/src/bootstrap-fork.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as performance from './vs/base/common/performance.js';
import { removeGlobalNodeJsModuleLookupPaths, devInjectNodeModuleLookupPath } from './bootstrap-node.js';
import { bootstrapESM } from './bootstrap-esm.js';

performance.mark('code/fork/start');

//#region Helpers

function pipeLoggingToParent(): void {
	const MAX_STREAM_BUFFER_LENGTH = 1024 * 1024;
	const MAX_LENGTH = 100000;

	/**
	 * Prevent circular stringify and convert arguments to real array
	 */
	function safeToString(args: ArrayLike<unknown>): string {
		const seen: unknown[] = [];
		const argsArray: unknown[] = [];

		// Massage some arguments with special treatment
		if (args.length) {
			for (let i = 0; i < args.length; i++) {
				let arg = args[i];

				// Any argument of type 'undefined' needs to be specially treated because
				// JSON.stringify will simply ignore those. We replace them with the string
				// 'undefined' which is not 100% right, but good enough to be logged to console
				if (typeof arg === 'undefined') {
					arg = 'undefined';
				}

				// Any argument that is an Error will be changed to be just the error stack/message
				// itself because currently cannot serialize the error over entirely.
				else if (arg instanceof Error) {
					const errorObj = arg;
					if (errorObj.stack) {
						arg = errorObj.stack;
					} else {
						arg = errorObj.toString();
					}
				}

				argsArray.push(arg);
			}
		}

		try {
			const res = JSON.stringify(argsArray, function (key, value: unknown) {

				// Objects get special treatment to prevent circles
				if (isObject(value) || Array.isArray(value)) {
					if (seen.indexOf(value) !== -1) {
						return '[Circular]';
					}

					seen.push(value);
				}

				return value;
			});

			if (res.length > MAX_LENGTH) {
				return 'Output omitted for a large object that exceeds the limits';
			}

			return res;
		} catch (error) {
			return `Output omitted for an object that cannot be inspected ('${error.toString()}')`;
		}
	}

	function safeSend(arg: { type: string; severity: string; arguments: string }): void {
		try {
			if (process.send) {
				process.send(arg);
			}
		} catch (error) {
			// Can happen if the parent channel is closed meanwhile
		}
	}

	function isObject(obj: unknown): boolean {
		return typeof obj === 'object'
			&& obj !== null
			&& !Array.isArray(obj)
			&& !(obj instanceof RegExp)
			&& !(obj instanceof Date);
	}

	function safeSendConsoleMessage(severity: 'log' | 'warn' | 'error', args: string): void {
		safeSend({ type: '__$console', severity, arguments: args });
	}

	/**
	 * Wraps a console message so that it is transmitted to the renderer.
	 *
	 * The wrapped property is not defined with `writable: false` to avoid
	 * throwing errors, but rather a no-op setting. See https://github.com/microsoft/vscode-extension-telemetry/issues/88
	 */
	function wrapConsoleMethod(method: 'log' | 'info' | 'warn' | 'error', severity: 'log' | 'warn' | 'error'): void {
		Object.defineProperty(console, method, {
			set: () => { },
			get: () => function () { safeSendConsoleMessage(severity, safeToString(arguments)); },
		});
	}

	/**
	 * Wraps process.stderr/stdout.write() so that it is transmitted to the
	 * renderer or CLI. It both calls through to the original method as well
	 * as to console.log with complete lines so that they're made available
	 * to the debugger/CLI.
	 */
	function wrapStream(streamName: 'stdout' | 'stderr', severity: 'log' | 'warn' | 'error'): void {
		const stream = process[streamName];
		const original = stream.write;

		let buf = '';

		Object.defineProperty(stream, 'write', {
			set: () => { },
			get: () => (chunk: string | Buffer | Uint8Array, encoding: BufferEncoding | undefined, callback: ((err?: Error | null) => void) | undefined) => {
				buf += chunk.toString(encoding);
				const eol = buf.length > MAX_STREAM_BUFFER_LENGTH ? buf.length : buf.lastIndexOf('\n');
				if (eol !== -1) {
					console[severity](buf.slice(0, eol));
					buf = buf.slice(eol + 1);
				}

				original.call(stream, chunk, encoding, callback);
			},
		});
	}

	// Pass console logging to the outside so that we have it in the main side if told so
	if (process.env['VSCODE_VERBOSE_LOGGING'] === 'true') {
		wrapConsoleMethod('info', 'log');
		wrapConsoleMethod('log', 'log');
		wrapConsoleMethod('warn', 'warn');
		wrapConsoleMethod('error', 'error');
	} else {
		console.log = function () { /* ignore */ };
		console.warn = function () { /* ignore */ };
		console.info = function () { /* ignore */ };
		wrapConsoleMethod('error', 'error');
	}

	wrapStream('stderr', 'error');
	wrapStream('stdout', 'log');
}

function handleExceptions(): void {

	// Handle uncaught exceptions
	process.on('uncaughtException', function (err) {
		console.error('Uncaught Exception: ', err);
	});

	// Handle unhandled promise rejections
	process.on('unhandledRejection', function (reason) {
		console.error('Unhandled Promise Rejection: ', reason);
	});
}

function terminateWhenParentTerminates(): void {
	const parentPid = Number(process.env['VSCODE_PARENT_PID']);

	if (typeof parentPid === 'number' && !isNaN(parentPid)) {
		setInterval(function () {
			try {
				process.kill(parentPid, 0); // throws an exception if the main process doesn't exist anymore.
			} catch (e) {
				process.exit();
			}
		}, 5000);
	}
}

function configureCrashReporter(): void {
	const crashReporterProcessType = process.env['VSCODE_CRASH_REPORTER_PROCESS_TYPE'];
	if (crashReporterProcessType) {
		try {
			//@ts-expect-error
			if (process['crashReporter'] && typeof process['crashReporter'].addExtraParameter === 'function' /* Electron only */) {
				//@ts-expect-error
				process['crashReporter'].addExtraParameter('processType', crashReporterProcessType);
			}
		} catch (error) {
			console.error(error);
		}
	}
}

//#endregion

// Crash reporter
configureCrashReporter();

// Remove global paths from the node module lookup (node.js only)
removeGlobalNodeJsModuleLookupPaths();

if (process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH']) {
	devInjectNodeModuleLookupPath(process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH']);
}

// Configure: pipe logging to parent process
if (!!process.send && process.env['VSCODE_PIPE_LOGGING'] === 'true') {
	pipeLoggingToParent();
}

// Handle Exceptions
if (!process.env['VSCODE_HANDLES_UNCAUGHT_ERRORS']) {
	handleExceptions();
}

// Terminate when parent terminates
if (process.env['VSCODE_PARENT_PID']) {
	terminateWhenParentTerminates();
}

// Bootstrap ESM
await bootstrapESM();

// Load ESM entry point
await import([`./${process.env['VSCODE_ESM_ENTRYPOINT']}.js`].join('/') /* workaround: esbuild prints some strange warnings when trying to inline? */);
```

--------------------------------------------------------------------------------

---[FILE: src/bootstrap-import.ts]---
Location: vscode-main/src/bootstrap-import.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// *********************************************************************
// *                                                                   *
// *  We need this to redirect to node_modules from the remote-folder. *
// *  This ONLY applies when running out of source.                   *
// *                                                                   *
// *********************************************************************

import { fileURLToPath, pathToFileURL } from 'node:url';
import { promises } from 'node:fs';
import { join } from 'node:path';

// SEE https://nodejs.org/docs/latest/api/module.html#initialize

const _specifierToUrl: Record<string, string> = {};

export async function initialize(injectPath: string): Promise<void> {
	// populate mappings

	const injectPackageJSONPath = fileURLToPath(new URL('../package.json', pathToFileURL(injectPath)));
	const packageJSON = JSON.parse(String(await promises.readFile(injectPackageJSONPath)));

	for (const [name] of Object.entries(packageJSON.dependencies)) {
		try {
			const path = join(injectPackageJSONPath, `../node_modules/${name}/package.json`);
			let { main } = JSON.parse(String(await promises.readFile(path)));

			if (!main) {
				main = 'index.js';
			}
			if (!main.endsWith('.js')) {
				main += '.js';
			}
			const mainPath = join(injectPackageJSONPath, `../node_modules/${name}/${main}`);
			_specifierToUrl[name] = pathToFileURL(mainPath).href;

		} catch (err) {
			console.error(name);
			console.error(err);
		}
	}

	console.log(`[bootstrap-import] Initialized node_modules redirector for: ${injectPath}`);
}

export async function resolve(specifier: string | number, context: unknown, nextResolve: (arg0: unknown, arg1: unknown) => unknown) {

	const newSpecifier = _specifierToUrl[specifier];
	if (newSpecifier !== undefined) {
		return {
			format: 'commonjs',
			shortCircuit: true,
			url: newSpecifier
		};
	}

	// Defer to the next hook in the chain, which would be the
	// Node.js default resolve if this is the last user-specified loader.
	return nextResolve(specifier, context);
}
```

--------------------------------------------------------------------------------

---[FILE: src/bootstrap-meta.ts]---
Location: vscode-main/src/bootstrap-meta.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createRequire } from 'node:module';
import type { IProductConfiguration } from './vs/base/common/product.js';

const require = createRequire(import.meta.url);

let productObj: Partial<IProductConfiguration> & { BUILD_INSERT_PRODUCT_CONFIGURATION?: string } = { BUILD_INSERT_PRODUCT_CONFIGURATION: 'BUILD_INSERT_PRODUCT_CONFIGURATION' }; // DO NOT MODIFY, PATCHED DURING BUILD
if (productObj['BUILD_INSERT_PRODUCT_CONFIGURATION']) {
	productObj = require('../product.json'); // Running out of sources
}

let pkgObj = { BUILD_INSERT_PACKAGE_CONFIGURATION: 'BUILD_INSERT_PACKAGE_CONFIGURATION' }; // DO NOT MODIFY, PATCHED DURING BUILD
if (pkgObj['BUILD_INSERT_PACKAGE_CONFIGURATION']) {
	pkgObj = require('../package.json'); // Running out of sources
}

let productOverridesObj = {};
if (process.env['VSCODE_DEV']) {
	try {
		productOverridesObj = require('../product.overrides.json');
		productObj = Object.assign(productObj, productOverridesObj);
	} catch (error) { /* ignore */ }
}

export const product = productObj;
export const pkg = pkgObj;
```

--------------------------------------------------------------------------------

---[FILE: src/bootstrap-node.ts]---
Location: vscode-main/src/bootstrap-node.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'node:path';
import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import type { IProductConfiguration } from './vs/base/common/product.js';

const require = createRequire(import.meta.url);
const isWindows = process.platform === 'win32';

// increase number of stack frames(from 10, https://github.com/v8/v8/wiki/Stack-Trace-API)
Error.stackTraceLimit = 100;

if (!process.env['VSCODE_HANDLES_SIGPIPE']) {
	// Workaround for Electron not installing a handler to ignore SIGPIPE
	// (https://github.com/electron/electron/issues/13254)
	let didLogAboutSIGPIPE = false;
	process.on('SIGPIPE', () => {
		// See https://github.com/microsoft/vscode-remote-release/issues/6543
		// In certain situations, the console itself can be in a broken pipe state
		// so logging SIGPIPE to the console will cause an infinite async loop
		if (!didLogAboutSIGPIPE) {
			didLogAboutSIGPIPE = true;
			console.error(new Error(`Unexpected SIGPIPE`));
		}
	});
}

// Setup current working directory in all our node & electron processes
// - Windows: call `process.chdir()` to always set application folder as cwd
// -  all OS: store the `process.cwd()` inside `VSCODE_CWD` for consistent lookups
function setupCurrentWorkingDirectory(): void {
	try {

		// Store the `process.cwd()` inside `VSCODE_CWD`
		// for consistent lookups, but make sure to only
		// do this once unless defined already from e.g.
		// a parent process.
		if (typeof process.env['VSCODE_CWD'] !== 'string') {
			process.env['VSCODE_CWD'] = process.cwd();
		}

		// Windows: always set application folder as current working dir
		if (process.platform === 'win32') {
			process.chdir(path.dirname(process.execPath));
		}
	} catch (err) {
		console.error(err);
	}
}

setupCurrentWorkingDirectory();

/**
 * Add support for redirecting the loading of node modules
 *
 * Note: only applies when running out of sources.
 */
export function devInjectNodeModuleLookupPath(injectPath: string): void {
	if (!process.env['VSCODE_DEV']) {
		return; // only applies running out of sources
	}

	if (!injectPath) {
		throw new Error('Missing injectPath');
	}

	// register a loader hook
	const Module = require('node:module');
	Module.register('./bootstrap-import.js', { parentURL: import.meta.url, data: injectPath });
}

export function removeGlobalNodeJsModuleLookupPaths(): void {
	if (typeof process?.versions?.electron === 'string') {
		return; // Electron disables global search paths in https://github.com/electron/electron/blob/3186c2f0efa92d275dc3d57b5a14a60ed3846b0e/shell/common/node_bindings.cc#L653
	}

	const Module = require('module');
	const globalPaths = Module.globalPaths;

	const originalResolveLookupPaths = Module._resolveLookupPaths;

	Module._resolveLookupPaths = function (moduleName: string, parent: unknown): string[] {
		const paths = originalResolveLookupPaths(moduleName, parent);
		if (Array.isArray(paths)) {
			let commonSuffixLength = 0;
			while (commonSuffixLength < paths.length && paths[paths.length - 1 - commonSuffixLength] === globalPaths[globalPaths.length - 1 - commonSuffixLength]) {
				commonSuffixLength++;
			}

			return paths.slice(0, paths.length - commonSuffixLength);
		}

		return paths;
	};

	const originalNodeModulePaths = Module._nodeModulePaths;
	Module._nodeModulePaths = function (from: string): string[] {
		let paths: string[] = originalNodeModulePaths(from);
		if (!isWindows) {
			return paths;
		}

		// On Windows, remove drive(s) and users' home directory from search paths,
		// UNLESS 'from' is explicitly set to one of those.
		const isDrive = (p: string) => p.length >= 3 && p.endsWith(':\\');

		if (!isDrive(from)) {
			paths = paths.filter(p => !isDrive(path.dirname(p)));
		}

		if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
			const userDir = path.dirname(path.join(process.env.HOMEDRIVE, process.env.HOMEPATH));

			const isUsersDir = (p: string) => path.relative(p, userDir).length === 0;

			// Check if 'from' is the same as 'userDir'
			if (!isUsersDir(from)) {
				paths = paths.filter(p => !isUsersDir(path.dirname(p)));
			}
		}

		return paths;
	};
}

/**
 * Helper to enable portable mode.
 */
export function configurePortable(product: Partial<IProductConfiguration>): { portableDataPath: string; isPortable: boolean } {
	const appRoot = path.dirname(import.meta.dirname);

	function getApplicationPath(): string {
		if (process.env['VSCODE_DEV']) {
			return appRoot;
		}

		if (process.platform === 'darwin') {
			return path.dirname(path.dirname(path.dirname(appRoot)));
		}

		// appRoot = ..\Microsoft VS Code Insiders\<version>\resources\app
		if (process.platform === 'win32' && product.quality === 'insider') {
			return path.dirname(path.dirname(path.dirname(appRoot)));
		}

		return path.dirname(path.dirname(appRoot));
	}

	function getPortableDataPath(): string {
		if (process.env['VSCODE_PORTABLE']) {
			return process.env['VSCODE_PORTABLE'];
		}

		if (process.platform === 'win32' || process.platform === 'linux') {
			return path.join(getApplicationPath(), 'data');
		}

		const portableDataName = product.portable || `${product.applicationName}-portable-data`;
		return path.join(path.dirname(getApplicationPath()), portableDataName);
	}

	const portableDataPath = getPortableDataPath();
	const isPortable = !('target' in product) && fs.existsSync(portableDataPath);
	const portableTempPath = path.join(portableDataPath, 'tmp');
	const isTempPortable = isPortable && fs.existsSync(portableTempPath);

	if (isPortable) {
		process.env['VSCODE_PORTABLE'] = portableDataPath;
	} else {
		delete process.env['VSCODE_PORTABLE'];
	}

	if (isTempPortable) {
		if (process.platform === 'win32') {
			process.env['TMP'] = portableTempPath;
			process.env['TEMP'] = portableTempPath;
		} else {
			process.env['TMPDIR'] = portableTempPath;
		}
	}

	return {
		portableDataPath,
		isPortable
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/bootstrap-server.ts]---
Location: vscode-main/src/bootstrap-server.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Keep bootstrap-esm.js from redefining 'fs'.
delete process.env['ELECTRON_RUN_AS_NODE'];
```

--------------------------------------------------------------------------------

---[FILE: src/cli.ts]---
Location: vscode-main/src/cli.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './bootstrap-cli.js'; // this MUST come before other imports as it changes global state
import { configurePortable } from './bootstrap-node.js';
import { bootstrapESM } from './bootstrap-esm.js';
import { resolveNLSConfiguration } from './vs/base/node/nls.js';
import { product } from './bootstrap-meta.js';

// NLS
const nlsConfiguration = await resolveNLSConfiguration({ userLocale: 'en', osLocale: 'en', commit: product.commit, userDataPath: '', nlsMetadataPath: import.meta.dirname });
process.env['VSCODE_NLS_CONFIG'] = JSON.stringify(nlsConfiguration); // required for `bootstrap-esm` to pick up NLS messages

// Enable portable support
configurePortable(product);

// Signal processes that we got launched as CLI
process.env['VSCODE_CLI'] = '1';

// Bootstrap ESM
await bootstrapESM();

// Load Server
await import('./vs/code/node/cli.js');
```

--------------------------------------------------------------------------------

---[FILE: src/main.ts]---
Location: vscode-main/src/main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'node:path';
import * as fs from 'original-fs';
import * as os from 'node:os';
import { performance } from 'node:perf_hooks';
import { configurePortable } from './bootstrap-node.js';
import { bootstrapESM } from './bootstrap-esm.js';
import { app, protocol, crashReporter, Menu, contentTracing } from 'electron';
import minimist from 'minimist';
import { product } from './bootstrap-meta.js';
import { parse } from './vs/base/common/jsonc.js';
import { getUserDataPath } from './vs/platform/environment/node/userDataPath.js';
import * as perf from './vs/base/common/performance.js';
import { resolveNLSConfiguration } from './vs/base/node/nls.js';
import { getUNCHost, addUNCHostToAllowlist } from './vs/base/node/unc.js';
import { INLSConfiguration } from './vs/nls.js';
import { NativeParsedArgs } from './vs/platform/environment/common/argv.js';

perf.mark('code/didStartMain');

perf.mark('code/willLoadMainBundle', {
	// When built, the main bundle is a single JS file with all
	// dependencies inlined. As such, we mark `willLoadMainBundle`
	// as the start of the main bundle loading process.
	startTime: Math.floor(performance.timeOrigin)
});
perf.mark('code/didLoadMainBundle');

// Enable portable support
const portable = configurePortable(product);

const args = parseCLIArgs();
// Configure static command line arguments
const argvConfig = configureCommandlineSwitchesSync(args);
// Enable sandbox globally unless
// 1) disabled via command line using either
//    `--no-sandbox` or `--disable-chromium-sandbox` argument.
// 2) argv.json contains `disable-chromium-sandbox: true`.
if (args['sandbox'] &&
	!args['disable-chromium-sandbox'] &&
	!argvConfig['disable-chromium-sandbox']) {
	app.enableSandbox();
} else if (app.commandLine.hasSwitch('no-sandbox') &&
	!app.commandLine.hasSwitch('disable-gpu-sandbox')) {
	// Disable GPU sandbox whenever --no-sandbox is used.
	app.commandLine.appendSwitch('disable-gpu-sandbox');
} else {
	app.commandLine.appendSwitch('no-sandbox');
	app.commandLine.appendSwitch('disable-gpu-sandbox');
}

// Set userData path before app 'ready' event
const userDataPath = getUserDataPath(args, product.nameShort ?? 'code-oss-dev');
if (process.platform === 'win32') {
	const userDataUNCHost = getUNCHost(userDataPath);
	if (userDataUNCHost) {
		addUNCHostToAllowlist(userDataUNCHost); // enables to use UNC paths in userDataPath
	}
}
app.setPath('userData', userDataPath);

// Resolve code cache path
const codeCachePath = getCodeCachePath();

// Disable default menu (https://github.com/electron/electron/issues/35512)
Menu.setApplicationMenu(null);

// Configure crash reporter
perf.mark('code/willStartCrashReporter');
// If a crash-reporter-directory is specified we store the crash reports
// in the specified directory and don't upload them to the crash server.
//
// Appcenter crash reporting is enabled if
// * enable-crash-reporter runtime argument is set to 'true'
// * --disable-crash-reporter command line parameter is not set
//
// Disable crash reporting in all other cases.
if (args['crash-reporter-directory'] || (argvConfig['enable-crash-reporter'] && !args['disable-crash-reporter'])) {
	configureCrashReporter();
}
perf.mark('code/didStartCrashReporter');

// Set logs path before app 'ready' event if running portable
// to ensure that no 'logs' folder is created on disk at a
// location outside of the portable directory
// (https://github.com/microsoft/vscode/issues/56651)
if (portable.isPortable) {
	app.setAppLogsPath(path.join(userDataPath, 'logs'));
}

// Register custom schemes with privileges
protocol.registerSchemesAsPrivileged([
	{
		scheme: 'vscode-webview',
		privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, allowServiceWorkers: true, codeCache: true }
	},
	{
		scheme: 'vscode-file',
		privileges: { secure: true, standard: true, supportFetchAPI: true, corsEnabled: true, codeCache: true }
	}
]);

// Global app listeners
registerListeners();

/**
 * We can resolve the NLS configuration early if it is defined
 * in argv.json before `app.ready` event. Otherwise we can only
 * resolve NLS after `app.ready` event to resolve the OS locale.
 */
let nlsConfigurationPromise: Promise<INLSConfiguration> | undefined = undefined;

// Use the most preferred OS language for language recommendation.
// The API might return an empty array on Linux, such as when
// the 'C' locale is the user's only configured locale.
// No matter the OS, if the array is empty, default back to 'en'.
const osLocale = processZhLocale((app.getPreferredSystemLanguages()?.[0] ?? 'en').toLowerCase());
const userLocale = getUserDefinedLocale(argvConfig);
if (userLocale) {
	nlsConfigurationPromise = resolveNLSConfiguration({
		userLocale,
		osLocale,
		commit: product.commit,
		userDataPath,
		nlsMetadataPath: import.meta.dirname
	});
}

// Pass in the locale to Electron so that the
// Windows Control Overlay is rendered correctly on Windows.
// For now, don't pass in the locale on macOS due to
// https://github.com/microsoft/vscode/issues/167543.
// If the locale is `qps-ploc`, the Microsoft
// Pseudo Language Language Pack is being used.
// In that case, use `en` as the Electron locale.

if (process.platform === 'win32' || process.platform === 'linux') {
	const electronLocale = (!userLocale || userLocale === 'qps-ploc') ? 'en' : userLocale;
	app.commandLine.appendSwitch('lang', electronLocale);
}

// Load our code once ready
app.once('ready', function () {
	if (args['trace']) {
		let traceOptions: Electron.TraceConfig | Electron.TraceCategoriesAndOptions;
		if (args['trace-memory-infra']) {
			const customCategories = args['trace-category-filter']?.split(',') || [];
			customCategories.push('disabled-by-default-memory-infra', 'disabled-by-default-memory-infra.v8.code_stats');
			traceOptions = {
				included_categories: customCategories,
				excluded_categories: ['*'],
				memory_dump_config: {
					allowed_dump_modes: ['light', 'detailed'],
					triggers: [
						{
							type: 'periodic_interval',
							mode: 'detailed',
							min_time_between_dumps_ms: 10000
						},
						{
							type: 'periodic_interval',
							mode: 'light',
							min_time_between_dumps_ms: 1000
						}
					]
				}
			};
		} else {
			traceOptions = {
				categoryFilter: args['trace-category-filter'] || '*',
				traceOptions: args['trace-options'] || 'record-until-full,enable-sampling'
			};
		}

		contentTracing.startRecording(traceOptions).finally(() => onReady());
	} else {
		onReady();
	}
});

async function onReady() {
	perf.mark('code/mainAppReady');

	try {
		const [, nlsConfig] = await Promise.all([
			mkdirpIgnoreError(codeCachePath),
			resolveNlsConfiguration()
		]);

		await startup(codeCachePath, nlsConfig);
	} catch (error) {
		console.error(error);
	}
}

/**
 * Main startup routine
 */
async function startup(codeCachePath: string | undefined, nlsConfig: INLSConfiguration): Promise<void> {
	process.env['VSCODE_NLS_CONFIG'] = JSON.stringify(nlsConfig);
	process.env['VSCODE_CODE_CACHE_PATH'] = codeCachePath || '';

	// Bootstrap ESM
	await bootstrapESM();

	// Load Main
	await import('./vs/code/electron-main/main.js');
	perf.mark('code/didRunMainBundle');
}

function configureCommandlineSwitchesSync(cliArgs: NativeParsedArgs) {
	const SUPPORTED_ELECTRON_SWITCHES = [

		// alias from us for --disable-gpu
		'disable-hardware-acceleration',

		// override for the color profile to use
		'force-color-profile',

		// disable LCD font rendering, a Chromium flag
		'disable-lcd-text',

		// bypass any specified proxy for the given semi-colon-separated list of hosts
		'proxy-bypass-list',

		'remote-debugging-port'
	];

	if (process.platform === 'linux') {

		// Force enable screen readers on Linux via this flag
		SUPPORTED_ELECTRON_SWITCHES.push('force-renderer-accessibility');

		// override which password-store is used on Linux
		SUPPORTED_ELECTRON_SWITCHES.push('password-store');
	}

	const SUPPORTED_MAIN_PROCESS_SWITCHES = [

		// Persistently enable proposed api via argv.json: https://github.com/microsoft/vscode/issues/99775
		'enable-proposed-api',

		// Log level to use. Default is 'info'. Allowed values are 'error', 'warn', 'info', 'debug', 'trace', 'off'.
		'log-level',

		// Use an in-memory storage for secrets
		'use-inmemory-secretstorage',

		// Enables display tracking to restore maximized windows under RDP: https://github.com/electron/electron/issues/47016
		'enable-rdp-display-tracking',
	];

	// Read argv config
	const argvConfig = readArgvConfigSync();

	Object.keys(argvConfig).forEach(argvKey => {
		const argvValue = argvConfig[argvKey];

		// Append Electron flags to Electron
		if (SUPPORTED_ELECTRON_SWITCHES.indexOf(argvKey) !== -1) {
			if (argvValue === true || argvValue === 'true') {
				if (argvKey === 'disable-hardware-acceleration') {
					app.disableHardwareAcceleration(); // needs to be called explicitly
				} else {
					app.commandLine.appendSwitch(argvKey);
				}
			} else if (typeof argvValue === 'string' && argvValue) {
				if (argvKey === 'password-store') {
					// Password store
					// TODO@TylerLeonhardt: Remove this migration in 3 months
					let migratedArgvValue = argvValue;
					if (argvValue === 'gnome' || argvValue === 'gnome-keyring') {
						migratedArgvValue = 'gnome-libsecret';
					}
					app.commandLine.appendSwitch(argvKey, migratedArgvValue);
				} else {
					app.commandLine.appendSwitch(argvKey, argvValue);
				}
			}
		}

		// Append main process flags to process.argv
		else if (SUPPORTED_MAIN_PROCESS_SWITCHES.indexOf(argvKey) !== -1) {
			switch (argvKey) {
				case 'enable-proposed-api':
					if (Array.isArray(argvValue)) {
						argvValue.forEach(id => id && typeof id === 'string' && process.argv.push('--enable-proposed-api', id));
					} else {
						console.error(`Unexpected value for \`enable-proposed-api\` in argv.json. Expected array of extension ids.`);
					}
					break;

				case 'log-level':
					if (typeof argvValue === 'string') {
						process.argv.push('--log', argvValue);
					} else if (Array.isArray(argvValue)) {
						for (const value of argvValue) {
							process.argv.push('--log', value);
						}
					}
					break;

				case 'use-inmemory-secretstorage':
					if (argvValue) {
						process.argv.push('--use-inmemory-secretstorage');
					}
					break;

				case 'enable-rdp-display-tracking':
					if (argvValue) {
						process.argv.push('--enable-rdp-display-tracking');
					}
					break;
			}
		}
	});

	// Following features are enabled from the runtime:
	// `NetAdapterMaxBufSizeFeature` - Specify the max buffer size for NetToMojoPendingBuffer, refs https://github.com/microsoft/vscode/issues/268800
	// `DocumentPolicyIncludeJSCallStacksInCrashReports` - https://www.electronjs.org/docs/latest/api/web-frame-main#framecollectjavascriptcallstack-experimental
	// `EarlyEstablishGpuChannel` - Refs https://issues.chromium.org/issues/40208065
	// `EstablishGpuChannelAsync` - Refs https://issues.chromium.org/issues/40208065
	const featuresToEnable =
		`NetAdapterMaxBufSizeFeature:NetAdapterMaxBufSize/8192,DocumentPolicyIncludeJSCallStacksInCrashReports,EarlyEstablishGpuChannel,EstablishGpuChannelAsync,${app.commandLine.getSwitchValue('enable-features')}`;
	app.commandLine.appendSwitch('enable-features', featuresToEnable);

	// Following features are disabled from the runtime:
	// `CalculateNativeWinOcclusion` - Disable native window occlusion tracker (https://groups.google.com/a/chromium.org/g/embedder-dev/c/ZF3uHHyWLKw/m/VDN2hDXMAAAJ)
	const featuresToDisable =
		`CalculateNativeWinOcclusion,${app.commandLine.getSwitchValue('disable-features')}`;
	app.commandLine.appendSwitch('disable-features', featuresToDisable);

	// Blink features to configure.
	// `FontMatchingCTMigration` - Siwtch font matching on macOS to Appkit (Refs https://github.com/microsoft/vscode/issues/224496#issuecomment-2270418470).
	// `StandardizedBrowserZoom` - Disable zoom adjustment for bounding box (https://github.com/microsoft/vscode/issues/232750#issuecomment-2459495394)
	const blinkFeaturesToDisable =
		`FontMatchingCTMigration,StandardizedBrowserZoom,${app.commandLine.getSwitchValue('disable-blink-features')}`;
	app.commandLine.appendSwitch('disable-blink-features', blinkFeaturesToDisable);

	// Support JS Flags
	const jsFlags = getJSFlags(cliArgs);
	if (jsFlags) {
		app.commandLine.appendSwitch('js-flags', jsFlags);
	}

	// Use portal version 4 that supports current_folder option
	// to address https://github.com/microsoft/vscode/issues/213780
	// Runtime sets the default version to 3, refs https://github.com/electron/electron/pull/44426
	app.commandLine.appendSwitch('xdg-portal-required-version', '4');

	return argvConfig;
}

interface IArgvConfig {
	[key: string]: string | string[] | boolean | undefined;
	readonly locale?: string;
	readonly 'disable-lcd-text'?: boolean;
	readonly 'proxy-bypass-list'?: string;
	readonly 'disable-hardware-acceleration'?: boolean;
	readonly 'force-color-profile'?: string;
	readonly 'enable-crash-reporter'?: boolean;
	readonly 'crash-reporter-id'?: string;
	readonly 'enable-proposed-api'?: string[];
	readonly 'log-level'?: string | string[];
	readonly 'disable-chromium-sandbox'?: boolean;
	readonly 'use-inmemory-secretstorage'?: boolean;
	readonly 'enable-rdp-display-tracking'?: boolean;
	readonly 'remote-debugging-port'?: string;
}

function readArgvConfigSync(): IArgvConfig {

	// Read or create the argv.json config file sync before app('ready')
	const argvConfigPath = getArgvConfigPath();
	let argvConfig: IArgvConfig | undefined = undefined;
	try {
		argvConfig = parse(fs.readFileSync(argvConfigPath).toString());
	} catch (error) {
		if (error && error.code === 'ENOENT') {
			createDefaultArgvConfigSync(argvConfigPath);
		} else {
			console.warn(`Unable to read argv.json configuration file in ${argvConfigPath}, falling back to defaults (${error})`);
		}
	}

	// Fallback to default
	if (!argvConfig) {
		argvConfig = {};
	}

	return argvConfig;
}

function createDefaultArgvConfigSync(argvConfigPath: string): void {
	try {

		// Ensure argv config parent exists
		const argvConfigPathDirname = path.dirname(argvConfigPath);
		if (!fs.existsSync(argvConfigPathDirname)) {
			fs.mkdirSync(argvConfigPathDirname);
		}

		// Default argv content
		const defaultArgvConfigContent = [
			'// This configuration file allows you to pass permanent command line arguments to VS Code.',
			'// Only a subset of arguments is currently supported to reduce the likelihood of breaking',
			'// the installation.',
			'//',
			'// PLEASE DO NOT CHANGE WITHOUT UNDERSTANDING THE IMPACT',
			'//',
			'// NOTE: Changing this file requires a restart of VS Code.',
			'{',
			'	// Use software rendering instead of hardware accelerated rendering.',
			'	// This can help in cases where you see rendering issues in VS Code.',
			'	// "disable-hardware-acceleration": true',
			'}'
		];

		// Create initial argv.json with default content
		fs.writeFileSync(argvConfigPath, defaultArgvConfigContent.join('\n'));
	} catch (error) {
		console.error(`Unable to create argv.json configuration file in ${argvConfigPath}, falling back to defaults (${error})`);
	}
}

function getArgvConfigPath(): string {
	const vscodePortable = process.env['VSCODE_PORTABLE'];
	if (vscodePortable) {
		return path.join(vscodePortable, 'argv.json');
	}

	let dataFolderName = product.dataFolderName;
	if (process.env['VSCODE_DEV']) {
		dataFolderName = `${dataFolderName}-dev`;
	}

	return path.join(os.homedir(), dataFolderName!, 'argv.json');
}

function configureCrashReporter(): void {
	let crashReporterDirectory = args['crash-reporter-directory'];
	let submitURL = '';
	if (crashReporterDirectory) {
		crashReporterDirectory = path.normalize(crashReporterDirectory);

		if (!path.isAbsolute(crashReporterDirectory)) {
			console.error(`The path '${crashReporterDirectory}' specified for --crash-reporter-directory must be absolute.`);
			app.exit(1);
		}

		if (!fs.existsSync(crashReporterDirectory)) {
			try {
				fs.mkdirSync(crashReporterDirectory, { recursive: true });
			} catch (error) {
				console.error(`The path '${crashReporterDirectory}' specified for --crash-reporter-directory does not seem to exist or cannot be created.`);
				app.exit(1);
			}
		}

		// Crashes are stored in the crashDumps directory by default, so we
		// need to change that directory to the provided one
		console.log(`Found --crash-reporter-directory argument. Setting crashDumps directory to be '${crashReporterDirectory}'`);
		app.setPath('crashDumps', crashReporterDirectory);
	}

	// Otherwise we configure the crash reporter from product.json
	else {
		const appCenter = product.appCenter;
		if (appCenter) {
			const isWindows = (process.platform === 'win32');
			const isLinux = (process.platform === 'linux');
			const isDarwin = (process.platform === 'darwin');
			const crashReporterId = argvConfig['crash-reporter-id'];
			const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
			if (crashReporterId && uuidPattern.test(crashReporterId)) {
				if (isWindows) {
					switch (process.arch) {
						case 'x64':
							submitURL = appCenter['win32-x64'];
							break;
						case 'arm64':
							submitURL = appCenter['win32-arm64'];
							break;
					}
				} else if (isDarwin) {
					if (product.darwinUniversalAssetId) {
						submitURL = appCenter['darwin-universal'];
					} else {
						switch (process.arch) {
							case 'x64':
								submitURL = appCenter['darwin'];
								break;
							case 'arm64':
								submitURL = appCenter['darwin-arm64'];
								break;
						}
					}
				} else if (isLinux) {
					submitURL = appCenter['linux-x64'];
				}
				submitURL = submitURL.concat('&uid=', crashReporterId, '&iid=', crashReporterId, '&sid=', crashReporterId);
				// Send the id for child node process that are explicitly starting crash reporter.
				// For vscode this is ExtensionHost process currently.
				const argv = process.argv;
				const endOfArgsMarkerIndex = argv.indexOf('--');
				if (endOfArgsMarkerIndex === -1) {
					argv.push('--crash-reporter-id', crashReporterId);
				} else {
					// if the we have an argument "--" (end of argument marker)
					// we cannot add arguments at the end. rather, we add
					// arguments before the "--" marker.
					argv.splice(endOfArgsMarkerIndex, 0, '--crash-reporter-id', crashReporterId);
				}
			}
		}
	}

	// Start crash reporter for all processes
	const productName = (product.crashReporter ? product.crashReporter.productName : undefined) || product.nameShort;
	const companyName = (product.crashReporter ? product.crashReporter.companyName : undefined) || 'Microsoft';
	const uploadToServer = Boolean(!process.env['VSCODE_DEV'] && submitURL && !crashReporterDirectory);
	crashReporter.start({
		companyName,
		productName: process.env['VSCODE_DEV'] ? `${productName} Dev` : productName,
		submitURL,
		uploadToServer,
		compress: true,
		ignoreSystemCrashHandler: true
	});
}

function getJSFlags(cliArgs: NativeParsedArgs): string | null {
	const jsFlags: string[] = [];

	// Add any existing JS flags we already got from the command line
	if (cliArgs['js-flags']) {
		jsFlags.push(cliArgs['js-flags']);
	}

	if (process.platform === 'linux') {
		// Fix cppgc crash on Linux with 16KB page size.
		// Refs https://issues.chromium.org/issues/378017037
		// The fix from https://github.com/electron/electron/commit/6c5b2ef55e08dc0bede02384747549c1eadac0eb
		// only affects non-renderer process.
		// The following will ensure that the flag will be
		// applied to the renderer process as well.
		// TODO(deepak1556): Remove this once we update to
		// Chromium >= 134.
		jsFlags.push('--nodecommit_pooled_pages');
	}

	return jsFlags.length > 0 ? jsFlags.join(' ') : null;
}

function parseCLIArgs(): NativeParsedArgs {
	return minimist(process.argv, {
		string: [
			'user-data-dir',
			'locale',
			'js-flags',
			'crash-reporter-directory'
		],
		boolean: [
			'disable-chromium-sandbox',
		],
		default: {
			'sandbox': true
		},
		alias: {
			'no-sandbox': 'sandbox'
		}
	});
}

function registerListeners(): void {

	/**
	 * macOS: when someone drops a file to the not-yet running VSCode, the open-file event fires even before
	 * the app-ready event. We listen very early for open-file and remember this upon startup as path to open.
	 */
	const macOpenFiles: string[] = [];
	(globalThis as { macOpenFiles?: string[] }).macOpenFiles = macOpenFiles;
	app.on('open-file', function (event, path) {
		macOpenFiles.push(path);
	});

	/**
	 * macOS: react to open-url requests.
	 */
	const openUrls: string[] = [];
	const onOpenUrl =
		function (event: { preventDefault: () => void }, url: string) {
			event.preventDefault();

			openUrls.push(url);
		};

	app.on('will-finish-launching', function () {
		app.on('open-url', onOpenUrl);
	});

	(globalThis as { getOpenUrls?: () => string[] }).getOpenUrls = function () {
		app.removeListener('open-url', onOpenUrl);

		return openUrls;
	};
}

function getCodeCachePath(): string | undefined {

	// explicitly disabled via CLI args
	if (process.argv.indexOf('--no-cached-data') > 0) {
		return undefined;
	}

	// running out of sources
	if (process.env['VSCODE_DEV']) {
		return undefined;
	}

	// require commit id
	const commit = product.commit;
	if (!commit) {
		return undefined;
	}

	return path.join(userDataPath, 'CachedData', commit);
}

async function mkdirpIgnoreError(dir: string | undefined): Promise<string | undefined> {
	if (typeof dir === 'string') {
		try {
			await fs.promises.mkdir(dir, { recursive: true });

			return dir;
		} catch (error) {
			// ignore
		}
	}

	return undefined;
}

//#region NLS Support

function processZhLocale(appLocale: string): string {
	if (appLocale.startsWith('zh')) {
		const region = appLocale.split('-')[1];

		// On Windows and macOS, Chinese languages returned by
		// app.getPreferredSystemLanguages() start with zh-hans
		// for Simplified Chinese or zh-hant for Traditional Chinese,
		// so we can easily determine whether to use Simplified or Traditional.
		// However, on Linux, Chinese languages returned by that same API
		// are of the form zh-XY, where XY is a country code.
		// For China (CN), Singapore (SG), and Malaysia (MY)
		// country codes, assume they use Simplified Chinese.
		// For other cases, assume they use Traditional.
		if (['hans', 'cn', 'sg', 'my'].includes(region)) {
			return 'zh-cn';
		}

		return 'zh-tw';
	}

	return appLocale;
}

/**
 * Resolve the NLS configuration
 */
async function resolveNlsConfiguration(): Promise<INLSConfiguration> {

	// First, we need to test a user defined locale.
	// If it fails we try the app locale.
	// If that fails we fall back to English.

	const nlsConfiguration = nlsConfigurationPromise ? await nlsConfigurationPromise : undefined;
	if (nlsConfiguration) {
		return nlsConfiguration;
	}

	// Try to use the app locale which is only valid
	// after the app ready event has been fired.

	let userLocale = app.getLocale();
	if (!userLocale) {
		return {
			userLocale: 'en',
			osLocale,
			resolvedLanguage: 'en',
			defaultMessagesFile: path.join(import.meta.dirname, 'nls.messages.json'),

			// NLS: below 2 are a relic from old times only used by vscode-nls and deprecated
			locale: 'en',
			availableLanguages: {}
		};
	}

	// See above the comment about the loader and case sensitiveness
	userLocale = processZhLocale(userLocale.toLowerCase());

	return resolveNLSConfiguration({
		userLocale,
		osLocale,
		commit: product.commit,
		userDataPath,
		nlsMetadataPath: import.meta.dirname
	});
}

/**
 * Language tags are case insensitive however an ESM loader is case sensitive
 * To make this work on case preserving & insensitive FS we do the following:
 * the language bundles have lower case language tags and we always lower case
 * the locale we receive from the user or OS.
 */
function getUserDefinedLocale(argvConfig: IArgvConfig): string | undefined {
	const locale = args['locale'];
	if (locale) {
		return locale.toLowerCase(); // a directly provided --locale always wins
	}

	return typeof argvConfig?.locale === 'string' ? argvConfig.locale.toLowerCase() : undefined;
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/server-cli.ts]---
Location: vscode-main/src/server-cli.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './bootstrap-server.js'; // this MUST come before other imports as it changes global state
import { join } from 'node:path';
import { devInjectNodeModuleLookupPath } from './bootstrap-node.js';
import { bootstrapESM } from './bootstrap-esm.js';
import { resolveNLSConfiguration } from './vs/base/node/nls.js';
import { product } from './bootstrap-meta.js';

// NLS
const nlsConfiguration = await resolveNLSConfiguration({ userLocale: 'en', osLocale: 'en', commit: product.commit, userDataPath: '', nlsMetadataPath: import.meta.dirname });
process.env['VSCODE_NLS_CONFIG'] = JSON.stringify(nlsConfiguration); // required for `bootstrap-esm` to pick up NLS messages

if (process.env['VSCODE_DEV']) {
	// When running out of sources, we need to load node modules from remote/node_modules,
	// which are compiled against nodejs, not electron
	process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH'] = process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH'] || join(import.meta.dirname, '..', 'remote', 'node_modules');
	devInjectNodeModuleLookupPath(process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH']);
} else {
	delete process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH'];
}

// Bootstrap ESM
await bootstrapESM();

// Load Server
await import('./vs/server/node/server.cli.js');
```

--------------------------------------------------------------------------------

---[FILE: src/server-main.ts]---
Location: vscode-main/src/server-main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './bootstrap-server.js'; // this MUST come before other imports as it changes global state
import * as path from 'node:path';
import * as http from 'node:http';
import type { AddressInfo } from 'node:net';
import * as os from 'node:os';
import * as readline from 'node:readline';
import { performance } from 'node:perf_hooks';
import minimist from 'minimist';
import { devInjectNodeModuleLookupPath, removeGlobalNodeJsModuleLookupPaths } from './bootstrap-node.js';
import { bootstrapESM } from './bootstrap-esm.js';
import { resolveNLSConfiguration } from './vs/base/node/nls.js';
import { product } from './bootstrap-meta.js';
import * as perf from './vs/base/common/performance.js';
import { INLSConfiguration } from './vs/nls.js';
import { IServerAPI } from './vs/server/node/remoteExtensionHostAgentServer.js';

perf.mark('code/server/start');
(globalThis as { vscodeServerStartTime?: number }).vscodeServerStartTime = performance.now();

// Do a quick parse to determine if a server or the cli needs to be started
const parsedArgs = minimist(process.argv.slice(2), {
	boolean: ['start-server', 'list-extensions', 'print-ip-address', 'help', 'version', 'accept-server-license-terms', 'update-extensions'],
	string: ['install-extension', 'install-builtin-extension', 'uninstall-extension', 'locate-extension', 'socket-path', 'host', 'port', 'compatibility'],
	alias: { help: 'h', version: 'v' }
});
['host', 'port', 'accept-server-license-terms'].forEach(e => {
	if (!parsedArgs[e]) {
		const envValue = process.env[`VSCODE_SERVER_${e.toUpperCase().replace('-', '_')}`];
		if (envValue) {
			parsedArgs[e] = envValue;
		}
	}
});

const extensionLookupArgs = ['list-extensions', 'locate-extension'];
const extensionInstallArgs = ['install-extension', 'install-builtin-extension', 'uninstall-extension', 'update-extensions'];

const shouldSpawnCli = parsedArgs.help || parsedArgs.version || extensionLookupArgs.some(a => !!parsedArgs[a]) || (extensionInstallArgs.some(a => !!parsedArgs[a]) && !parsedArgs['start-server']);

const nlsConfiguration = await resolveNLSConfiguration({ userLocale: 'en', osLocale: 'en', commit: product.commit, userDataPath: '', nlsMetadataPath: import.meta.dirname });

if (shouldSpawnCli) {
	loadCode(nlsConfiguration).then((mod) => {
		mod.spawnCli();
	});
} else {
	let _remoteExtensionHostAgentServer: IServerAPI | null = null;
	let _remoteExtensionHostAgentServerPromise: Promise<IServerAPI> | null = null;
	const getRemoteExtensionHostAgentServer = () => {
		if (!_remoteExtensionHostAgentServerPromise) {
			_remoteExtensionHostAgentServerPromise = loadCode(nlsConfiguration).then(async (mod) => {
				const server = await mod.createServer(address);
				_remoteExtensionHostAgentServer = server;
				return server;
			});
		}
		return _remoteExtensionHostAgentServerPromise;
	};

	if (Array.isArray(product.serverLicense) && product.serverLicense.length) {
		console.log(product.serverLicense.join('\n'));
		if (product.serverLicensePrompt && parsedArgs['accept-server-license-terms'] !== true) {
			if (hasStdinWithoutTty()) {
				console.log('To accept the license terms, start the server with --accept-server-license-terms');
				process.exit(1);
			}
			try {
				const accept = await prompt(product.serverLicensePrompt);
				if (!accept) {
					process.exit(1);
				}
			} catch (e) {
				console.log(e);
				process.exit(1);
			}
		}
	}

	let firstRequest = true;
	let firstWebSocket = true;

	let address: string | AddressInfo | null = null;
	const server = http.createServer(async (req, res) => {
		if (firstRequest) {
			firstRequest = false;
			perf.mark('code/server/firstRequest');
		}
		const remoteExtensionHostAgentServer = await getRemoteExtensionHostAgentServer();
		return remoteExtensionHostAgentServer.handleRequest(req, res);
	});
	server.on('upgrade', async (req, socket) => {
		if (firstWebSocket) {
			firstWebSocket = false;
			perf.mark('code/server/firstWebSocket');
		}
		const remoteExtensionHostAgentServer = await getRemoteExtensionHostAgentServer();
		// @ts-expect-error
		return remoteExtensionHostAgentServer.handleUpgrade(req, socket);
	});
	server.on('error', async (err) => {
		const remoteExtensionHostAgentServer = await getRemoteExtensionHostAgentServer();
		return remoteExtensionHostAgentServer.handleServerError(err);
	});

	const host = sanitizeStringArg(parsedArgs['host']) || (parsedArgs['compatibility'] !== '1.63' ? 'localhost' : undefined);
	const nodeListenOptions = (
		parsedArgs['socket-path']
			? { path: sanitizeStringArg(parsedArgs['socket-path']) }
			: { host, port: await parsePort(host, sanitizeStringArg(parsedArgs['port'])) }
	);
	server.listen(nodeListenOptions, async () => {
		let output = Array.isArray(product.serverGreeting) && product.serverGreeting.length ? `\n\n${product.serverGreeting.join('\n')}\n\n` : ``;

		if (typeof nodeListenOptions.port === 'number' && parsedArgs['print-ip-address']) {
			const ifaces = os.networkInterfaces();
			Object.keys(ifaces).forEach(function (ifname) {
				ifaces[ifname]?.forEach(function (iface) {
					if (!iface.internal && iface.family === 'IPv4') {
						output += `IP Address: ${iface.address}\n`;
					}
				});
			});
		}

		address = server.address();
		if (address === null) {
			throw new Error('Unexpected server address');
		}

		output += `Server bound to ${typeof address === 'string' ? address : `${address.address}:${address.port} (${address.family})`}\n`;
		// Do not change this line. VS Code looks for this in the output.
		output += `Extension host agent listening on ${typeof address === 'string' ? address : address.port}\n`;
		console.log(output);

		perf.mark('code/server/started');
		(globalThis as { vscodeServerListenTime?: number }).vscodeServerListenTime = performance.now();

		await getRemoteExtensionHostAgentServer();
	});

	process.on('exit', () => {
		server.close();
		if (_remoteExtensionHostAgentServer) {
			_remoteExtensionHostAgentServer.dispose();
		}
	});
}

function sanitizeStringArg(val: unknown): string | undefined {
	if (Array.isArray(val)) { // if an argument is passed multiple times, minimist creates an array
		val = val.pop(); // take the last item
	}
	return typeof val === 'string' ? val : undefined;
}

/**
 * If `--port` is specified and describes a single port, connect to that port.
 *
 * If `--port`describes a port range
 * then find a free port in that range. Throw error if no
 * free port available in range.
 *
 * In absence of specified ports, connect to port 8000.
 */
async function parsePort(host: string | undefined, strPort: string | undefined): Promise<number> {
	if (strPort) {
		let range: { start: number; end: number } | undefined;
		if (strPort.match(/^\d+$/)) {
			return parseInt(strPort, 10);
		} else if (range = parseRange(strPort)) {
			const port = await findFreePort(host, range.start, range.end);
			if (port !== undefined) {
				return port;
			}
			// Remote-SSH extension relies on this exact port error message, treat as an API
			console.warn(`--port: Could not find free port in range: ${range.start} - ${range.end} (inclusive).`);
			process.exit(1);

		} else {
			console.warn(`--port "${strPort}" is not a valid number or range. Ranges must be in the form 'from-to' with 'from' an integer larger than 0 and not larger than 'end'.`);
			process.exit(1);
		}
	}
	return 8000;
}

function parseRange(strRange: string): { start: number; end: number } | undefined {
	const match = strRange.match(/^(\d+)-(\d+)$/);
	if (match) {
		const start = parseInt(match[1], 10), end = parseInt(match[2], 10);
		if (start > 0 && start <= end && end <= 65535) {
			return { start, end };
		}
	}
	return undefined;
}

/**
 * Starting at the `start` port, look for a free port incrementing
 * by 1 until `end` inclusive. If no free port is found, undefined is returned.
 */
async function findFreePort(host: string | undefined, start: number, end: number): Promise<number | undefined> {
	const testPort = (port: number) => {
		return new Promise((resolve) => {
			const server = http.createServer();
			server.listen(port, host, () => {
				server.close();
				resolve(true);
			}).on('error', () => {
				resolve(false);
			});
		});
	};
	for (let port = start; port <= end; port++) {
		if (await testPort(port)) {
			return port;
		}
	}
	return undefined;
}

async function loadCode(nlsConfiguration: INLSConfiguration) {

	// required for `bootstrap-esm` to pick up NLS messages
	process.env['VSCODE_NLS_CONFIG'] = JSON.stringify(nlsConfiguration);

	// See https://github.com/microsoft/vscode-remote-release/issues/6543
	// We would normally install a SIGPIPE listener in bootstrap-node.js
	// But in certain situations, the console itself can be in a broken pipe state
	// so logging SIGPIPE to the console will cause an infinite async loop
	process.env['VSCODE_HANDLES_SIGPIPE'] = 'true';

	if (process.env['VSCODE_DEV']) {
		// When running out of sources, we need to load node modules from remote/node_modules,
		// which are compiled against nodejs, not electron
		process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH'] = process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH'] || path.join(import.meta.dirname, '..', 'remote', 'node_modules');
		devInjectNodeModuleLookupPath(process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH']);
	} else {
		delete process.env['VSCODE_DEV_INJECT_NODE_MODULE_LOOKUP_PATH'];
	}

	// Remove global paths from the node module lookup (node.js only)
	removeGlobalNodeJsModuleLookupPaths();

	// Bootstrap ESM
	await bootstrapESM();

	// Load Server
	return import('./vs/server/node/server.main.js');
}

function hasStdinWithoutTty(): boolean {
	try {
		return !process.stdin.isTTY; // Via https://twitter.com/MylesBorins/status/782009479382626304
	} catch (error) {
		// Windows workaround for https://github.com/nodejs/node/issues/11656
	}
	return false;
}

function prompt(question: string): Promise<boolean> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise((resolve, reject) => {
		rl.question(question + ' ', async function (data) {
			rl.close();
			const str = data.toString().trim().toLowerCase();
			if (str === '' || str === 'y' || str === 'yes') {
				resolve(true);
			} else if (str === 'n' || str === 'no') {
				resolve(false);
			} else {
				process.stdout.write('\nInvalid Response. Answer either yes (y, yes) or no (n, no)\n');
				resolve(await prompt(question));
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/tsconfig.base.json]---
Location: vscode-main/src/tsconfig.base.json

```json
{
	"compilerOptions": {
		"module": "nodenext",
		"moduleResolution": "nodenext",
		"moduleDetection": "legacy",
		"experimentalDecorators": true,
		"noImplicitReturns": true,
		"noImplicitOverride": true,
		"noUnusedLocals": true,
		"noUncheckedSideEffectImports": true,
		"allowUnreachableCode": false,
		"strict": true,
		"exactOptionalPropertyTypes": false,
		"useUnknownInCatchVariables": false,
		"forceConsistentCasingInFileNames": true,
		"target": "ES2024",
		"useDefineForClassFields": false,
		"lib": [
			"ES2024",
			"DOM",
			"DOM.Iterable",
			"WebWorker.ImportScripts"
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/tsconfig.defineClassFields.json]---
Location: vscode-main/src/tsconfig.defineClassFields.json

```json
{
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"useDefineForClassFields": true,
		"noEmit": true,
		"skipLibCheck": true
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/tsconfig.json]---
Location: vscode-main/src/tsconfig.json

```json
{
	"extends": "./tsconfig.base.json",
	"compilerOptions": {
		"esModuleInterop": true,
		"removeComments": false,
		"preserveConstEnums": true,
		"sourceMap": false,
		"allowJs": true,
		"resolveJsonModule": true,
		"isolatedModules": false,
		"outDir": "../out/vs",
		"types": [
			"@webgpu/types",
			"mocha",
			"semver",
			"sinon",
			"trusted-types",
			"winreg",
			"wicg-file-system-access"
		],
		"plugins": [
			{
				"name": "tsec",
				"exemptionConfig": "./tsec.exemptions.json"
			}
		]
	},
	"include": [
		"./*.ts",
		"./typings",
		"./vs/**/*.ts",
		"./vscode-dts/vscode.proposed.*.d.ts",
		"./vscode-dts/vscode.d.ts"
	],
	"exclude": [
		"vs/workbench/contrib/webview/browser/pre/service-worker.js"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/tsconfig.monaco.json]---
Location: vscode-main/src/tsconfig.monaco.json

```json
{
	"extends": "./tsconfig.base.json",
	"compilerOptions": {
		"noEmit": true,
		"types": [
			"@webgpu/types",
			"trusted-types",
			"wicg-file-system-access"
		],
		"module": "nodenext",
		"moduleResolution": "nodenext",
		"removeComments": false,
		"preserveConstEnums": true,
		"target": "ES2022",
		"sourceMap": false,
		"declaration": true,
		"skipLibCheck": true
	},
	"include": [
		"typings/css.d.ts",
		"typings/thenable.d.ts",
		"typings/vscode-globals-product.d.ts",
		"typings/vscode-globals-nls.d.ts",
		"typings/editContext.d.ts",
		"typings/base-common.d.ts",
		"vs/monaco.d.ts",
		"vs/editor/*",
		"vs/base/common/*",
		"vs/base/browser/*",
		"vs/platform/*/common/*",
		"vs/platform/*/browser/*"
	],
	"exclude": [
		"node_modules/*",
		"vs/platform/files/browser/htmlFileSystemProvider.ts",
		"vs/platform/files/browser/webFileSystemAccess.ts",
		"vs/platform/telemetry/*",
		"vs/platform/assignment/*",
		"vs/platform/terminal/*",
		"vs/platform/externalTerminal/*"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/tsconfig.tsec.json]---
Location: vscode-main/src/tsconfig.tsec.json

```json
{
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"noEmit": true,
		"skipLibCheck": true,
		"plugins": [
			{
				"name": "tsec",
				"exemptionConfig": "./tsec.exemptions.json"
			}
		]
	},
	"exclude": [
		"./vs/workbench/contrib/webview/browser/pre/service-worker.js",
		"*/test/*",
		"**/*.test.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/tsconfig.vscode-dts.json]---
Location: vscode-main/src/tsconfig.vscode-dts.json

```json
{
	"compilerOptions": {
		"noEmit": true,
		"module": "None",
		"experimentalDecorators": false,
		"noImplicitReturns": true,
		"noImplicitOverride": true,
		"noUnusedLocals": true,
		"allowUnreachableCode": false,
		"strict": true,
		"exactOptionalPropertyTypes": false,
		"useUnknownInCatchVariables": false,
		"forceConsistentCasingInFileNames": true,
		"types": [],
		"lib": [
			"ES2022"
		],
	},
	"include": [
		"vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/tsconfig.vscode-proposed-dts.json]---
Location: vscode-main/src/tsconfig.vscode-proposed-dts.json

```json
{
	"extends": "./tsconfig.vscode-dts.json",
	"include": [
		"vscode-dts/vscode.d.ts",
		"vscode-dts/vscode.proposed.*.d.ts",
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/tsec.exemptions.json]---
Location: vscode-main/src/tsec.exemptions.json

```json
{
	"ban-document-execcommand": [
		"vs/workbench/contrib/codeEditor/electron-browser/inputClipboardActions.ts",
		"vs/editor/contrib/clipboard/browser/clipboard.ts"
	],
	"ban-eval-calls": [
		"vs/workbench/api/worker/extHostExtensionService.ts"
	],
	"ban-function-calls": [
		"vs/workbench/api/worker/extHostExtensionService.ts",
		"vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts",
		"vs/workbench/services/keybinding/test/node/keyboardMapperTestUtils.ts"
	],
	"ban-trustedtypes-createpolicy": [
		"vs/code/electron-browser/workbench/workbench.ts",
		"vs/amdX.ts",
		"vs/base/browser/trustedTypes.ts",
		"vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts"
	],
	"ban-worker-calls": [
		"vs/platform/webWorker/browser/webWorkerServiceImpl.ts",
		"vs/workbench/services/extensions/browser/webWorkerExtensionHost.ts"
	],
	"ban-worker-importscripts": [
		"vs/amdX.ts",
		"vs/workbench/services/extensions/worker/polyfillNestedWorker.ts",
		"vs/workbench/api/worker/extensionHostWorker.ts"
	],
	"ban-domparser-parsefromstring": [
		"vs/base/browser/markdownRenderer.ts",
		"vs/base/test/browser/markdownRenderer.test.ts"
	],
	"ban-element-setattribute": [
		"**/*.ts"
	],
	"ban-element-insertadjacenthtml": [
		"**/*.ts"
	],
	"ban-script-content-assignments": [
		"vs/code/electron-browser/workbench/workbench.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/typings/base-common.d.ts]---
Location: vscode-main/src/typings/base-common.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Declare types that we probe for to implement util and/or polyfill functions

declare global {

	// --- idle callbacks

	interface IdleDeadline {
		readonly didTimeout: boolean;
		timeRemaining(): number;
	}

	function requestIdleCallback(callback: (args: IdleDeadline) => void, options?: { timeout: number }): number;
	function cancelIdleCallback(handle: number): void;


	// --- timeout / interval (available in all contexts, but different signatures in node.js vs web)

	interface TimeoutHandle { readonly _: never; /* this is a trick that seems needed to prevent direct number assignment */ }
	type Timeout = TimeoutHandle;
	function setTimeout(handler: string | Function, timeout?: number, ...arguments: any[]): Timeout;
	function clearTimeout(timeout: Timeout | undefined): void;

	function setInterval(callback: (...args: any[]) => void, delay?: number, ...args: any[]): Timeout;
	function clearInterval(timeout: Timeout | undefined): void;


	// --- error

	interface ErrorConstructor {
		captureStackTrace(targetObject: object, constructorOpt?: Function): void;
		stackTraceLimit: number;
	}
}

export { }
```

--------------------------------------------------------------------------------

````

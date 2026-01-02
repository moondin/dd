---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 554
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 554 of 1290)

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

---[FILE: html_elements.py]---
Location: zulip-main/tools/lib/html_elements.py

```python
from collections.abc import Iterator

VALID_HTML_CONTEXTS: dict[tuple[str, str], str] = {
    # https://html.spec.whatwg.org/multipage/indices.html#elements-3
    ("a", "phrasing"): "transparent",
    ("abbr", "phrasing"): "phrasing",
    ("address", "flow"): "flow",
    ("area", "phrasing"): "void",
    ("article", "flow"): "flow",
    ("aside", "flow"): "flow",
    ("audio", "phrasing"): "<audio>",
    ("b", "phrasing"): "phrasing",
    ("base", "<head>"): "void",
    ("bdi", "phrasing"): "phrasing",
    ("bdo", "phrasing"): "phrasing",
    ("blockquote", "flow"): "flow",
    ("body", "<html>"): "flow",
    ("br", "phrasing"): "void",
    ("button", "phrasing"): "phrasing",
    ("button", "<select>"): "phrasing",
    ("canvas", "phrasing"): "transparent",
    ("caption", "<table>"): "flow",
    ("center", "flow"): "flow",  # FIXME: obsolete, remove this
    ("cite", "phrasing"): "phrasing",
    ("code", "phrasing"): "phrasing",
    ("col", "<colgroup>"): "void",
    ("colgroup", "<table>"): "<colgroup>",
    ("data", "phrasing"): "phrasing",
    ("datalist", "phrasing"): "<datalist>",
    ("dd", "<dl>"): "flow",
    ("del", "phrasing"): "transparent",
    ("details", "flow"): "<details>",
    ("dfn", "phrasing"): "phrasing",
    ("dialog", "flow"): "flow",
    ("div", "flow"): "flow",
    ("div", "<dl>"): "<dl>",
    ("div", "<select> content"): "<select> content",
    ("div", "<optgroup> content"): "<optgroup> content",
    ("div", "<option> content"): "<option> content",
    ("dl", "flow"): "<dl>",
    ("dt", "<dl>"): "phrasing",
    ("em", "phrasing"): "phrasing",
    ("embed", "phrasing"): "void",
    ("fieldset", "flow"): "<fieldset>",
    ("figcaption", "<figure>"): "flow",
    ("figure", "flow"): "<figure>",
    ("footer", "flow"): "flow",
    ("form", "flow"): "flow",
    ("h1", "plain heading"): "phrasing",
    ("h2", "plain heading"): "phrasing",
    ("h3", "plain heading"): "phrasing",
    ("h4", "plain heading"): "phrasing",
    ("h5", "plain heading"): "phrasing",
    ("h6", "plain heading"): "phrasing",
    ("head", "<html>"): "<head>",
    ("header", "flow"): "flow",
    ("hgroup", "heading"): "<hgroup>",
    ("hr", "flow"): "void",
    ("hr", "<select> content"): "void",
    ("html", "document"): "<html>",
    ("i", "phrasing"): "phrasing",
    ("iframe", "phrasing"): "empty",
    ("img", "phrasing"): "void",
    ("img", "<picture>"): "void",
    ("input", "phrasing"): "void",
    ("ins", "phrasing"): "transparent",
    ("kbd", "phrasing"): "phrasing",
    ("label", "phrasing"): "phrasing",
    ("legend", "<fieldset>"): "phrasing/heading",
    ("li", "list"): "flow",
    ("link", "<head>"): "void",
    ("link", "phrasing"): "void",
    ("main", "flow"): "flow",
    ("map", "phrasing"): "<map>",
    ("mark", "phrasing"): "phrasing",
    ("math", "phrasing"): "MathML",
    ("menu", "flow"): "list",
    ("meta", "<head>"): "void",
    ("meta", "phrasing"): "void",
    ("meter", "phrasing"): "phrasing",
    ("nav", "flow"): "flow",
    ("noscript", "<head>"): "transparent",
    ("noscript", "phrasing"): "transparent",
    ("noscript", "<select> content"): "transparent",
    ("noscript", "<optgroup> content"): "transparent",
    ("object", "phrasing"): "transparent",
    ("ol", "flow"): "list",
    ("optgroup", "<select>"): "<optgroup> content",
    ("option", "<select>"): "<option> content",
    ("option", "<datalist>"): "<option> content",
    ("option", "<optgroup>"): "<option> content",
    ("output", "phrasing"): "phrasing",
    ("p", "flow"): "phrasing",
    ("p", "<hgroup>"): "phrasing",
    ("picture", "phrasing"): "<picture>",
    ("pre", "flow"): "phrasing",
    ("progress", "phrasing"): "phrasing",
    ("q", "phrasing"): "phrasing",
    ("rp", "<ruby>"): "phrasing",
    ("rt", "<ruby>"): "phrasing",
    ("ruby", "phrasing"): "<ruby>",
    ("s", "phrasing"): "phrasing",
    ("samp", "phrasing"): "phrasing",
    ("script", "<head>"): "<script>",
    ("script", "phrasing"): "<script>",
    ("script", "script-supporting"): "<script>",
    ("search", "flow"): "flow",
    ("section", "flow"): "flow",
    ("select", "phrasing"): "<select>",
    ("selectedcontent", "<button>"): "empty",
    ("slot", "phrasing"): "transparent",
    ("small", "phrasing"): "phrasing",
    ("source", "<picture>"): "void",
    ("source", "<video>"): "void",
    ("source", "<audio>"): "void",
    ("span", "phrasing"): "phrasing",
    ("strong", "phrasing"): "phrasing",
    ("style", "<head>"): "<style>",
    ("sub", "phrasing"): "phrasing",
    ("summary", "<details>"): "phrasing/heading",
    ("sup", "phrasing"): "phrasing",
    ("svg", "phrasing"): "SVG",
    ("table", "flow"): "<table>",
    ("tbody", "<table>"): "<tbody>",
    ("td", "<tr>"): "flow",
    ("template", "<head>"): "unknown",
    ("template", "phrasing"): "unknown",
    ("template", "script-supporting"): "unknown",
    ("template", "<colgroup>"): "unknown",
    ("textarea", "phrasing"): "text",
    ("tfoot", "<table>"): "<tfoot>",
    ("th", "<tr>"): "flow",
    ("thead", "<table>"): "<thead>",
    ("time", "phrasing"): "phrasing",
    ("title", "<head>"): "text",
    ("tr", "<table>"): "<tr>",
    ("tr", "<thead>"): "<tr>",
    ("tr", "<tbody>"): "<tr>",
    ("tr", "<tfoot>"): "<tr>",
    ("track", "<audio>"): "void",
    ("track", "<video>"): "void",
    ("u", "phrasing"): "phrasing",
    ("ul", "flow"): "list",
    ("var", "phrasing"): "phrasing",
    ("video", "phrasing"): "<video>",
    ("wbr", "phrasing"): "void",
    # https://html.spec.whatwg.org/multipage/embedded-content-other.html#mathml
    ("annotation-xml", "MathML"): "flow",
    ("mi", "MathML"): "phrasing",
    ("mo", "MathML"): "phrasing",
    ("mn", "MathML"): "phrasing",
    ("ms", "MathML"): "phrasing",
    ("mtext", "MathML"): "phrasing",
    # https://html.spec.whatwg.org/multipage/embedded-content-other.html#svg-0
    ("foreignObject", "SVG"): "flow",
    ("title", "SVG"): "phrasing",
}

HTML_CONTEXT_FALLBACKS: dict[str, list[str]] = {
    "<datalist>": ["phrasing", "script-supporting"],
    "<details>": ["flow"],
    "<dl>": ["script-supporting"],
    "<fieldset>": ["flow"],
    "<figure>": ["flow"],
    "<hgroup>": ["plain heading", "script-supporting"],
    "<optgroup> content": ["script-supporting"],
    "<option> content": ["phrasing"],
    "<option>": ["<option> content"],
    "<picture>": ["script-supporting"],
    "<ruby>": ["phrasing"],
    "<select> content": ["script-supporting"],
    "<select>": ["<select> content"],
    "<table>": ["script-supporting"],
    "<tbody>": ["script-supporting"],
    "<tfoot>": ["script-supporting"],
    "<thead>": ["script-supporting"],
    "<tr>": ["script-supporting"],
    "flow": ["phrasing", "heading"],
    "heading": ["plain heading"],
    "list": ["script-supporting"],
    "phrasing/heading": ["phrasing", "heading"],
    "unknown": ["document", "flow", "list", "<head>", "<select>", "<table>", "<tr>"],
}

FOREIGN_CONTEXTS = ["MathML", "SVG"]


def html_context_fallbacks(context: str) -> Iterator[str]:
    yield context
    for fallback_context in HTML_CONTEXT_FALLBACKS.get(context, []):
        yield from html_context_fallbacks(fallback_context)
```

--------------------------------------------------------------------------------

---[FILE: pretty_print.py]---
Location: zulip-main/tools/lib/pretty_print.py

```python
import subprocess

from zulint.printer import BOLDRED, CYAN, ENDC, GREEN

from .template_parser import Token


def shift_indents_to_the_next_tokens(tokens: list[Token]) -> None:
    """
    During the parsing/validation phase, it's useful to have separate
    tokens for "indent" chunks, but during pretty printing, we like
    to attach an `.indent` field to the substantive node, whether
    it's an HTML tag or template directive or whatever.
    """
    tokens[0].indent = ""

    for i, token in enumerate(tokens[:-1]):
        next_token = tokens[i + 1]

        if token.kind == "indent":
            next_token.indent = token.s
            token.new_s = ""

        if token.kind == "newline" and next_token.kind != "indent":
            next_token.indent = ""


def token_allows_children_to_skip_indents(token: Token) -> bool:
    # To avoid excessive indentation in templates with other
    # conditionals, we don't require extra indentation for template
    # logic blocks don't contain further logic as direct children.

    # Each blocks are excluded from this rule, since we want loops to
    # stand out.
    if token.tag == "each":
        return False

    return token.kind in ("django_start", "handlebars_start") or token.tag == "a"


def adjust_block_indentation(tokens: list[Token], fn: str) -> None:
    start_token: Token | None = None

    for token in tokens:
        if token.kind in ("indent", "whitespace", "newline"):
            continue

        if token.tag in ("code", "pre"):
            continue

        # print(token.line, repr(start_token.indent) if start_token else "?", repr(token.indent), token.s, token.end_token and "start", token.start_token and "end")

        if token.tag == "else":
            assert token.start_token
            if token.indent is not None:
                token.indent = token.start_token.indent
            continue

        if start_token and token.indent is not None:
            if (
                not start_token.indent_is_final
                and token.indent == start_token.orig_indent
                and token_allows_children_to_skip_indents(start_token)
            ):
                start_token.child_indent = start_token.indent
            start_token.indent_is_final = True

        # Detect start token by its having a end token
        if token.end_token:
            if token.indent is not None:
                token.orig_indent = token.indent
                if start_token:
                    assert start_token.child_indent is not None
                    token.indent = start_token.child_indent
                else:
                    token.indent = ""
                token.child_indent = token.indent + "    "
            token.parent_token = start_token
            start_token = token
            continue

        # Detect end token by its having a start token
        if token.start_token:
            if start_token != token.start_token:
                raise AssertionError(
                    f"""
                    {token.kind} was unexpected in {token.s}
                    in row {token.line} of {fn}
                    """
                )

            if token.indent is not None:
                token.indent = start_token.indent
            start_token = start_token.parent_token
            continue

        if token.indent is None:
            continue

        if start_token is None:
            token.indent = ""
            continue

        if start_token.child_indent is not None:
            token.indent = start_token.child_indent


def fix_indents_for_multi_line_tags(tokens: list[Token]) -> None:
    def fix(frag: str) -> str:
        frag = frag.strip()
        return continue_indent + frag if frag else ""

    for token in tokens:
        if token.kind == "code":
            continue

        if token.line_span == 1 or token.indent is None:
            continue

        if token.kind in ("django_comment", "handlebars_comment", "html_comment", "text"):
            continue_indent = token.indent
        else:
            continue_indent = token.indent + "  "

        frags = token.new_s.split("\n")

        token.new_s = frags[0] + "\n" + "\n".join(fix(frag) for frag in frags[1:])


def apply_token_indents(tokens: list[Token]) -> None:
    for token in tokens:
        if token.indent:
            token.new_s = token.indent + token.new_s


def pretty_print_html(tokens: list[Token], fn: str) -> str:
    for token in tokens:
        token.new_s = token.s

    shift_indents_to_the_next_tokens(tokens)
    adjust_block_indentation(tokens, fn)
    fix_indents_for_multi_line_tags(tokens)
    apply_token_indents(tokens)

    return "".join(token.new_s for token in tokens)


def numbered_lines(s: str) -> str:
    return "".join(f"{i + 1: >5} {line}\n" for i, line in enumerate(s.split("\n")))


def validate_indent_html(fn: str, tokens: list[Token], fix: bool) -> bool:
    with open(fn) as f:
        html = f.read()
    phtml = pretty_print_html(tokens, fn)
    if html.split("\n") != phtml.split("\n"):
        if fix:
            print(GREEN + f"Automatically fixing indentation for {fn}" + ENDC)
            with open(fn, "w") as f:
                f.write(phtml)
            # Since we successfully fixed the issues, we return True.
            return True
        print(
            f"""
{BOLDRED}PROBLEM{ENDC}: formatting errors in {fn}

Here is how we would like you to format
{CYAN}{fn}{ENDC}:
---
{numbered_lines(phtml)}
---

Here is the diff that you should either execute in your editor
or apply automatically with the --fix option.

({CYAN}Scroll up{ENDC} to see how we would like the file formatted.)

Proposed {BOLDRED}diff{ENDC} for {CYAN}{fn}{ENDC}:
            """,
            flush=True,
        )
        subprocess.run(["diff", fn, "-"], input=phtml, text=True, check=False)
        print(
            f"""
---

{BOLDRED}PROBLEM!!!{ENDC}

    You have formatting errors in {CYAN}{fn}{ENDC}
    (Usually these messages are related to indentation.)

This problem can be fixed with the {CYAN}`--fix`{ENDC} option.
Scroll up for more details about {BOLDRED}what you need to fix ^^^{ENDC}.
            """
        )
        return False
    return True
```

--------------------------------------------------------------------------------

---[FILE: provision.py]---
Location: zulip-main/tools/lib/provision.py

```python
#!/usr/bin/env python3
import argparse
import contextlib
import hashlib
import logging
import os
import platform
import subprocess
import sys
from typing import NoReturn

os.environ["PYTHONUNBUFFERED"] = "y"

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

sys.path.append(ZULIP_PATH)

from scripts.lib.node_cache import setup_node_modules
from scripts.lib.setup_venv import get_venv_dependencies
from scripts.lib.zulip_tools import (
    ENDC,
    FAIL,
    WARNING,
    get_dev_uuid_var_path,
    os_families,
    parse_os_release,
    run,
    run_as_root,
)

VAR_DIR_PATH = os.path.join(ZULIP_PATH, "var")

CONTINUOUS_INTEGRATION = "GITHUB_ACTIONS" in os.environ

if not os.path.exists(os.path.join(ZULIP_PATH, ".git")):
    print(FAIL + "Error: No Zulip Git repository present!" + ENDC)
    print("To set up the Zulip development environment, you should clone the code")
    print("from GitHub, rather than using a Zulip production release tarball.")
    sys.exit(1)

# Check the RAM on the user's system, and throw an effort if <1.5GB.
# This avoids users getting segfaults running `pip install` that are
# generally more annoying to debug.
with open("/proc/meminfo") as meminfo:
    ram_size = meminfo.readlines()[0].strip().split(" ")[-2]
ram_gb = float(ram_size) / 1024.0 / 1024.0
if ram_gb < 1.5:
    print(
        f"You have insufficient RAM ({round(ram_gb, 2)} GB) to run the Zulip development environment."
    )
    print("We recommend at least 2 GB of RAM, and require at least 1.5 GB.")
    sys.exit(1)

try:
    UUID_VAR_PATH = get_dev_uuid_var_path(create_if_missing=True)
    os.makedirs(UUID_VAR_PATH, exist_ok=True)
    if os.path.exists(os.path.join(VAR_DIR_PATH, "zulip-test-symlink")):
        os.remove(os.path.join(VAR_DIR_PATH, "zulip-test-symlink"))
    os.symlink(
        os.path.join(ZULIP_PATH, "README.md"),
        os.path.join(VAR_DIR_PATH, "zulip-test-symlink"),
    )
    os.remove(os.path.join(VAR_DIR_PATH, "zulip-test-symlink"))
except OSError:
    print(
        FAIL + "Error: Unable to create symlinks. "
        "Make sure you have permission to create symbolic links." + ENDC
    )
    print("See this page for more information:")
    print(
        "  https://zulip.readthedocs.io/en/latest/development/setup-recommended.html#os-symlink-error"
    )
    sys.exit(1)

distro_info = parse_os_release()
vendor = distro_info["ID"]
os_version = distro_info["VERSION_ID"]
if vendor == "debian" and os_version == "12":  # bookworm
    POSTGRESQL_VERSION = "15"
elif vendor == "debian" and os_version == "13":  # trixie
    POSTGRESQL_VERSION = "17"
elif vendor == "ubuntu" and os_version == "22.04":  # jammy
    POSTGRESQL_VERSION = "14"
elif vendor == "ubuntu" and os_version == "24.04":  # noble
    POSTGRESQL_VERSION = "16"
elif vendor == "fedora" and os_version == "38":
    POSTGRESQL_VERSION = "15"
elif vendor == "rhel" and os_version.startswith("7."):
    POSTGRESQL_VERSION = "10"
elif vendor == "centos" and os_version == "7":
    POSTGRESQL_VERSION = "10"
else:
    logging.critical("Unsupported platform: %s %s", vendor, os_version)
    sys.exit(1)

VENV_DEPENDENCIES = get_venv_dependencies(vendor, os_version)

COMMON_DEPENDENCIES = [
    "memcached",
    "rabbitmq-server",
    "supervisor",
    "git",
    "curl",
    "ca-certificates",  # Explicit dependency in case e.g. curl is already installed
    "puppet",  # Used by lint (`puppet parser validate`)
    "gettext",  # Used by makemessages i18n
    "curl",  # Used for testing our API documentation
    "moreutils",  # Used for sponge command
    "unzip",  # Needed for Slack import
    "crudini",  # Used for shell tooling w/ zulip.conf
    # Puppeteer dependencies from here
    "xdg-utils",
    # Puppeteer dependencies end here.
]

UBUNTU_COMMON_APT_DEPENDENCIES = [
    *COMMON_DEPENDENCIES,
    "redis-server",
    "hunspell-en-us",
    "puppet-lint",
    "default-jre-headless",  # Required by vnu-jar
    # Puppeteer dependencies from here
    "fonts-freefont-ttf",
    "libatk-bridge2.0-0",
    "libgbm1",
    "libgtk-3-0",
    "libx11-xcb1",
    "libxcb-dri3-0",
    "libxss1",
    "xvfb",
    # Puppeteer dependencies end here.
]

COMMON_YUM_DEPENDENCIES = [
    *COMMON_DEPENDENCIES,
    "redis",
    "hunspell-en-US",
    "rubygem-puppet-lint",
    "nmap-ncat",
    "ccache",  # Required to build pgroonga from source.
    # Puppeteer dependencies from here
    "at-spi2-atk",
    "GConf2",
    "gtk3",
    "libX11-xcb",
    "libxcb",
    "libXScrnSaver",
    "mesa-libgbm",
    "xorg-x11-server-Xvfb",
    # Puppeteer dependencies end here.
]

BUILD_GROONGA_FROM_SOURCE = False
BUILD_PGROONGA_FROM_SOURCE = False
if (vendor == "debian" and os_version in ["13"]) or (vendor == "ubuntu" and os_version in []):
    # For platforms without a PGroonga release, we need to build it
    # from source.
    BUILD_PGROONGA_FROM_SOURCE = True
    SYSTEM_DEPENDENCIES = [
        *UBUNTU_COMMON_APT_DEPENDENCIES,
        f"postgresql-{POSTGRESQL_VERSION}",
        # Dependency for building PGroonga from source
        f"postgresql-server-dev-{POSTGRESQL_VERSION}",
        "libgroonga-dev",
        "libmsgpack-dev",
        "clang",
        *VENV_DEPENDENCIES,
    ]
elif "debian" in os_families():
    DEBIAN_DEPENDENCIES = UBUNTU_COMMON_APT_DEPENDENCIES

    # If we are on an aarch64 processor, ninja will be built from source,
    # so cmake is required
    if platform.machine() == "aarch64":
        DEBIAN_DEPENDENCIES.append("cmake")

    SYSTEM_DEPENDENCIES = [
        *DEBIAN_DEPENDENCIES,
        f"postgresql-{POSTGRESQL_VERSION}",
        f"postgresql-{POSTGRESQL_VERSION}-pgroonga",
        *VENV_DEPENDENCIES,
    ]
elif "rhel" in os_families():
    SYSTEM_DEPENDENCIES = [
        *COMMON_YUM_DEPENDENCIES,
        f"postgresql{POSTGRESQL_VERSION}-server",
        f"postgresql{POSTGRESQL_VERSION}",
        f"postgresql{POSTGRESQL_VERSION}-devel",
        f"postgresql{POSTGRESQL_VERSION}-pgdg-pgroonga",
        *VENV_DEPENDENCIES,
    ]
elif "fedora" in os_families():
    SYSTEM_DEPENDENCIES = [
        *COMMON_YUM_DEPENDENCIES,
        f"postgresql{POSTGRESQL_VERSION}-server",
        f"postgresql{POSTGRESQL_VERSION}",
        f"postgresql{POSTGRESQL_VERSION}-devel",
        # Needed to build PGroonga from source
        "msgpack-devel",
        *VENV_DEPENDENCIES,
    ]
    BUILD_GROONGA_FROM_SOURCE = True
    BUILD_PGROONGA_FROM_SOURCE = True

if "fedora" in os_families():
    TSEARCH_STOPWORDS_PATH = f"/usr/pgsql-{POSTGRESQL_VERSION}/share/tsearch_data/"
else:
    TSEARCH_STOPWORDS_PATH = f"/usr/share/postgresql/{POSTGRESQL_VERSION}/tsearch_data/"
REPO_STOPWORDS_PATH = os.path.join(
    ZULIP_PATH,
    "puppet",
    "zulip",
    "files",
    "postgresql",
    "zulip_english.stop",
)


def install_system_deps() -> None:
    # By doing list -> set -> list conversion, we remove duplicates.
    deps_to_install = sorted(set(SYSTEM_DEPENDENCIES))

    if "fedora" in os_families():
        install_yum_deps(deps_to_install)
    elif "debian" in os_families():
        install_apt_deps(deps_to_install)
    else:
        raise AssertionError("Invalid vendor")

    # For some platforms, there aren't published PGroonga
    # packages available, so we build them from source.
    if BUILD_GROONGA_FROM_SOURCE:
        run_as_root(["./scripts/lib/build-groonga"])
    if BUILD_PGROONGA_FROM_SOURCE:
        run_as_root(["./scripts/lib/build-pgroonga"])


def install_apt_deps(deps_to_install: list[str]) -> None:
    # setup-apt-repo does an `apt-get update` if the sources.list files changed.
    run_as_root(["./scripts/lib/setup-apt-repo"])

    # But we still need to do our own to make sure we have up-to-date
    # data before installing new packages, as the system might not have
    # done an apt update in weeks otherwise, which could result in 404s
    # trying to download old versions that were already removed from mirrors.
    run_as_root(["apt-get", "update"])
    run_as_root(
        [
            "env",
            "DEBIAN_FRONTEND=noninteractive",
            "apt-get",
            "-y",
            "install",
            "--allow-downgrades",
            "--no-install-recommends",
            *deps_to_install,
        ]
    )


def install_yum_deps(deps_to_install: list[str]) -> None:
    print(WARNING + "RedHat support is still experimental." + ENDC)
    run_as_root(["./scripts/lib/setup-yum-repo"])

    # Hack specific to unregistered RHEL system.  The moreutils
    # package requires a perl module package, which isn't available in
    # the unregistered RHEL repositories.
    #
    # Error: Package: moreutils-0.49-2.el7.x86_64 (epel)
    #        Requires: perl(IPC::Run)
    yum_extra_flags: list[str] = []
    if vendor == "rhel":
        proc = subprocess.run(
            ["sudo", "subscription-manager", "status"],
            stdout=subprocess.PIPE,
            text=True,
            check=False,
        )
        if proc.returncode == 1:
            # TODO this might overkill since `subscription-manager` is already
            # called in setup-yum-repo
            if "Status" in proc.stdout:
                # The output is well-formed
                yum_extra_flags = ["--skip-broken"]
            else:
                print("Unrecognized output. `subscription-manager` might not be available")

    run_as_root(["yum", "install", "-y", *yum_extra_flags, *deps_to_install])
    if "rhel" in os_families():
        # This is how a pip3 is installed to /usr/bin in CentOS/RHEL
        # for python35 and later.
        run_as_root(["python36", "-m", "ensurepip"])
        # `python36` is not aliased to `python3` by default
        run_as_root(["ln", "-nsf", "/usr/bin/python36", "/usr/bin/python3"])
    postgresql_dir = f"pgsql-{POSTGRESQL_VERSION}"
    for cmd in ["pg_config", "pg_isready", "psql"]:
        # Our tooling expects these PostgreSQL scripts to be at
        # well-known paths.  There's an argument for eventually
        # making our tooling auto-detect, but this is simpler.
        run_as_root(["ln", "-nsf", f"/usr/{postgresql_dir}/bin/{cmd}", f"/usr/bin/{cmd}"])

    # From here, we do the first-time setup/initialization for the PostgreSQL database.
    pg_datadir = f"/var/lib/pgsql/{POSTGRESQL_VERSION}/data"
    pg_hba_conf = os.path.join(pg_datadir, "pg_hba.conf")

    # We can't just check if the file exists with os.path, since the
    # current user likely doesn't have permission to read the
    # pg_datadir directory.
    if subprocess.call(["sudo", "test", "-e", pg_hba_conf]) == 0:
        # Skip setup if it has been applied previously
        return

    run_as_root(
        [f"/usr/{postgresql_dir}/bin/postgresql-{POSTGRESQL_VERSION}-setup", "initdb"],
        sudo_args=["-H"],
    )
    # Use vendored pg_hba.conf, which enables password authentication.
    run_as_root(["cp", "-a", "puppet/zulip/files/postgresql/centos_pg_hba.conf", pg_hba_conf])
    # Later steps will ensure PostgreSQL is started

    # Link in tsearch data files
    if vendor == "fedora":
        # Since F36 dictionary files were moved away from /usr/share/myspell
        tsearch_source_prefix = "/usr/share/hunspell"
    else:
        tsearch_source_prefix = "/usr/share/myspell"
    run_as_root(
        [
            "ln",
            "-nsf",
            os.path.join(tsearch_source_prefix, "en_US.dic"),
            f"/usr/pgsql-{POSTGRESQL_VERSION}/share/tsearch_data/en_us.dict",
        ]
    )
    run_as_root(
        [
            "ln",
            "-nsf",
            os.path.join(tsearch_source_prefix, "en_US.aff"),
            f"/usr/pgsql-{POSTGRESQL_VERSION}/share/tsearch_data/en_us.affix",
        ]
    )


def main(options: argparse.Namespace) -> NoReturn:
    # pnpm and management commands expect to be run from the root of the
    # project.
    os.chdir(ZULIP_PATH)

    # hash the apt dependencies
    sha_sum = hashlib.sha1()

    for apt_dependency in SYSTEM_DEPENDENCIES:
        sha_sum.update(apt_dependency.encode())
    if "debian" in os_families():
        with open("scripts/lib/setup-apt-repo", "rb") as fb:
            sha_sum.update(fb.read())
    else:
        # hash the content of setup-yum-repo*
        with open("scripts/lib/setup-yum-repo", "rb") as fb:
            sha_sum.update(fb.read())

    # hash the content of build-pgroonga if Groonga is built from source
    if BUILD_GROONGA_FROM_SOURCE:
        with open("scripts/lib/build-groonga", "rb") as fb:
            sha_sum.update(fb.read())

    # hash the content of build-pgroonga if PGroonga is built from source
    if BUILD_PGROONGA_FROM_SOURCE:
        with open("scripts/lib/build-pgroonga", "rb") as fb:
            sha_sum.update(fb.read())

    new_apt_dependencies_hash = sha_sum.hexdigest()
    last_apt_dependencies_hash = None
    apt_hash_file_path = os.path.join(UUID_VAR_PATH, "apt_dependencies_hash")
    with open(apt_hash_file_path, "a+") as hash_file:
        hash_file.seek(0)
        last_apt_dependencies_hash = hash_file.read()

    if new_apt_dependencies_hash != last_apt_dependencies_hash:
        try:
            install_system_deps()
        except subprocess.CalledProcessError:
            try:
                # Might be a failure due to network connection issues. Retrying...
                print(WARNING + "Installing system dependencies failed; retrying..." + ENDC)
                install_system_deps()
            except BaseException as e:
                # Suppress exception chaining
                raise e from None
        with open(apt_hash_file_path, "w") as hash_file:
            hash_file.write(new_apt_dependencies_hash)
    else:
        print("No changes to apt dependencies, so skipping apt operations.")

    # Here we install node.
    proxy_env = [
        "env",
        "http_proxy=" + os.environ.get("http_proxy", ""),
        "https_proxy=" + os.environ.get("https_proxy", ""),
        "no_proxy=" + os.environ.get("no_proxy", ""),
    ]
    # Preserve PATH to catch mistaken extra installations of node in the user's
    # home directory.
    run_as_root([*proxy_env, "scripts/lib/install-node"], sudo_args=["--preserve-env=PATH"])

    try:
        setup_node_modules()
    except subprocess.CalledProcessError:
        print(WARNING + "`pnpm install` failed; retrying..." + ENDC)
        try:
            setup_node_modules()
        except subprocess.CalledProcessError:
            print(
                FAIL
                + "`pnpm install` is failing; check your network connection (and proxy settings)."
                + ENDC
            )
            sys.exit(1)

    # Install shellcheck.
    run_as_root([*proxy_env, "tools/setup/install-shellcheck"], sudo_args=["--preserve-env=PATH"])
    # Install shfmt.
    run_as_root([*proxy_env, "tools/setup/install-shfmt"], sudo_args=["--preserve-env=PATH"])

    # Install tusd
    run_as_root([*proxy_env, "tools/setup/install-tusd"], sudo_args=["--preserve-env=PATH"])

    # Install Python environment
    run_as_root([*proxy_env, "scripts/lib/install-uv"], sudo_args=["--preserve-env=PATH"])
    run(
        [*proxy_env, "uv", "sync", "--frozen"],
        env={k: v for k, v in os.environ.items() if k not in {"PYTHONDEVMODE", "PYTHONWARNINGS"}},
    )
    # Clean old symlinks used before uv migration
    with contextlib.suppress(FileNotFoundError):
        os.unlink("zulip-py3-venv")
    if os.path.lexists("/srv/zulip-py3-venv"):
        run_as_root(["rm", "/srv/zulip-py3-venv"])

    run_as_root(["cp", REPO_STOPWORDS_PATH, TSEARCH_STOPWORDS_PATH])

    if CONTINUOUS_INTEGRATION and not options.is_build_release_tarball_only:
        run_as_root(["service", "redis-server", "start"])
        run_as_root(["service", "memcached", "start"])
        run_as_root(["service", "rabbitmq-server", "start"])
        run_as_root(["service", "postgresql", "start"])
    elif "fedora" in os_families():
        # These platforms don't enable and start services on
        # installing their package, so we do that here.
        for service in [
            f"postgresql-{POSTGRESQL_VERSION}",
            "rabbitmq-server",
            "memcached",
            "redis",
        ]:
            run_as_root(["systemctl", "enable", service], sudo_args=["-H"])
            run_as_root(["systemctl", "start", service], sudo_args=["-H"])

    # If we imported modules after activating the virtualenv in this
    # Python process, they could end up mismatching with modules we’ve
    # already imported from outside the virtualenv.  That seems like a
    # bad idea, and empirically it can cause Python to segfault on
    # certain cffi-related imports.  Instead, start a new Python
    # process inside the virtualenv.
    provision_inner = os.path.join(ZULIP_PATH, "tools", "lib", "provision_inner.py")
    os.execvp(
        "uv",
        [
            "uv",
            "run",
            "--no-sync",
            provision_inner,
            *(["--force"] if options.is_force else []),
            *(["--build-release-tarball-only"] if options.is_build_release_tarball_only else []),
            *(["--skip-dev-db-build"] if options.skip_dev_db_build else []),
        ],
    )


if __name__ == "__main__":
    description = "Provision script to install Zulip"
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument(
        "--force",
        action="store_true",
        dest="is_force",
        help="Ignore all provisioning optimizations.",
    )

    parser.add_argument(
        "--build-release-tarball-only",
        action="store_true",
        dest="is_build_release_tarball_only",
        help="Provision needed to build release tarball.",
    )

    parser.add_argument(
        "--skip-dev-db-build", action="store_true", help="Don't run migrations on dev database."
    )

    options = parser.parse_args()
    main(options)
```

--------------------------------------------------------------------------------

````

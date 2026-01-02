---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 565
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 565 of 1290)

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

---[FILE: emoji_setup_utils.py]---
Location: zulip-main/tools/setup/emoji/emoji_setup_utils.py

```python
# This file contains various helper functions used by `build_emoji` tool.
# See docs/subsystems/emoji.md for details on how this system works.
from collections import defaultdict
from typing import Any

from zerver.lib.emoji_utils import emoji_to_hex_codepoint, hex_codepoint_to_emoji, unqualify_emoji

# Some image files in the old emoji farm had a different name than in the new emoji
# farm. `remapped_emojis` is a map that contains a mapping of their name in the old
# emoji farm to their name in the new emoji farm.
REMAPPED_EMOJIS = {
    "0023": "0023-20e3",  # Hash
    "0030": "0030-20e3",  # Zero
    "0031": "0031-20e3",  # One
    "0032": "0032-20e3",  # Two
    "0033": "0033-20e3",  # Three
    "0034": "0034-20e3",  # Four
    "0035": "0035-20e3",  # Five
    "0036": "0036-20e3",  # Six
    "0037": "0037-20e3",  # Seven
    "0038": "0038-20e3",  # Eight
    "0039": "0039-20e3",  # Nine
    "1f1e8": "1f1e8-1f1f3",  # cn
    "1f1e9": "1f1e9-1f1ea",  # de
    "1f1ea": "1f1ea-1f1f8",  # es
    "1f1eb": "1f1eb-1f1f7",  # fr
    "1f1ec": "1f1ec-1f1e7",  # gb/us
    "1f1ee": "1f1ee-1f1f9",  # it
    "1f1ef": "1f1ef-1f1f5",  # jp
    "1f1f0": "1f1f0-1f1f7",  # kr
    "1f1f7": "1f1f7-1f1fa",  # ru
    "1f1fa": "1f1fa-1f1f8",  # us
}

# Emoticons and which emoji they should become. Duplicate emoji are allowed.
# Changes here should be mimicked in `help/configure-emoticon-translations.md`.
EMOTICON_CONVERSIONS = {
    ":)": ":slight_smile:",
    "(:": ":slight_smile:",
    ":(": ":frown:",
    "<3": ":heart:",
    ":|": ":neutral:",
    ":/": ":confused:",
    ";)": ":wink:",
    ":D": ":smile:",
    ":o": ":open_mouth:",
    ":O": ":open_mouth:",
    ":p": ":stuck_out_tongue:",
    ":P": ":stuck_out_tongue:",
}


def emoji_names_for_picker(emoji_name_maps: dict[str, dict[str, Any]]) -> list[str]:
    emoji_names: list[str] = []
    for name_info in emoji_name_maps.values():
        emoji_names.append(name_info["canonical_name"])
        emoji_names.extend(name_info["aliases"])

    return sorted(emoji_names)


def get_emoji_code(emoji_dict: dict[str, Any]) -> str:
    # There is a `non_qualified` field on `emoji_dict` but it's
    # inconsistently present, so we'll always use the unqualified
    # emoji by unqualifying it ourselves. This gives us more consistent
    # behaviour between emojis, and doesn't rely on the incomplete
    # upstream package (https://github.com/iamcal/emoji-data/pull/217).
    return emoji_to_hex_codepoint(unqualify_emoji(hex_codepoint_to_emoji(emoji_dict["unified"])))


# Returns a dict from categories to list of codepoints. The list of
# codepoints are sorted according to the `sort_order` as defined in
# `emoji_data`.
def generate_emoji_catalog(
    emoji_data: list[dict[str, Any]], emoji_name_maps: dict[str, dict[str, Any]]
) -> dict[str, list[str]]:
    sort_order: dict[str, int] = {}
    emoji_catalog: dict[str, list[str]] = defaultdict(list)

    for emoji_dict in emoji_data:
        emoji_code = get_emoji_code(emoji_dict)
        if not emoji_is_supported(emoji_dict) or emoji_code not in emoji_name_maps:
            continue
        category = emoji_dict["category"]
        sort_order[emoji_code] = emoji_dict["sort_order"]
        emoji_catalog[category].append(emoji_code)

    # Sort the emojis according to iamcal's sort order. This sorting determines the
    # order in which emojis will be displayed in emoji picker.
    for emoji_codes in emoji_catalog.values():
        emoji_codes.sort(key=lambda emoji_code: sort_order[emoji_code])

    return dict(emoji_catalog)


def generate_codepoint_to_name_map(emoji_name_maps: dict[str, dict[str, Any]]) -> dict[str, str]:
    codepoint_to_name: dict[str, str] = {}
    for emoji_code, name_info in emoji_name_maps.items():
        codepoint_to_name[emoji_code] = name_info["canonical_name"]
    return codepoint_to_name


# We support Google Modern, and fall back to Google Modern when emoji
# aren't supported by the other styles we use.
def emoji_is_supported(emoji_dict: dict[str, Any]) -> bool:
    return emoji_dict["has_img_google"]


def generate_codepoint_to_names_map(
    emoji_name_maps: dict[str, dict[str, Any]],
) -> dict[str, list[str]]:
    # The first element of the names list is always the canonical name.
    return {
        emoji_code: [name_info["canonical_name"], *name_info["aliases"]]
        for emoji_code, name_info in emoji_name_maps.items()
    }


def generate_name_to_codepoint_map(emoji_name_maps: dict[str, dict[str, Any]]) -> dict[str, str]:
    name_to_codepoint = {}
    for emoji_code, name_info in emoji_name_maps.items():
        canonical_name = name_info["canonical_name"]
        aliases = name_info["aliases"]
        name_to_codepoint[canonical_name] = emoji_code
        for alias in aliases:
            name_to_codepoint[alias] = emoji_code
    return name_to_codepoint
```

--------------------------------------------------------------------------------

---[FILE: generate_emoji_names]---
Location: zulip-main/tools/setup/emoji/generate_emoji_names

```text
#!/usr/bin/env python3
import os
import re
import sys
from collections import defaultdict

import orjson

ZULIP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../")
sys.path.append(ZULIP_PATH)

from tools.setup.emoji.custom_emoji_names import CUSTOM_EMOJI_NAME_MAPS
from tools.setup.emoji.emoji_setup_utils import get_emoji_code
from zerver.lib.emoji_utils import hex_codepoint_to_emoji, unqualify_emoji

CLDR_DATA_FILE = os.path.join(
    ZULIP_PATH, "node_modules", "cldr-annotations-full", "annotations", "en", "annotations.json"
)
CLDR_DERIVED_DATA_FILE = os.path.join(
    ZULIP_PATH,
    "node_modules",
    "cldr-annotations-derived-full",
    "annotationsDerived",
    "en",
    "annotations.json",
)
EMOJI_DATA_FILE = os.path.join(ZULIP_PATH, "node_modules", "emoji-datasource-google", "emoji.json")
OUT_EMOJI_FILE = os.path.join(ZULIP_PATH, "tools", "setup", "emoji", "emoji_names.py")

with open(EMOJI_DATA_FILE, "rb") as fp:
    EMOJI_DATA = orjson.loads(fp.read())
with open(CLDR_DATA_FILE, "rb") as fp:
    CLDR_DATA = orjson.loads(fp.read())["annotations"]["annotations"]
with open(CLDR_DERIVED_DATA_FILE, "rb") as fp:
    CLDR_DATA.update(orjson.loads(fp.read())["annotationsDerived"]["annotations"])

# We don't include most clock emojis. See `custom_emoji_names` for more context.
SKIPPED_CLOCK_EMOJI_CODES = [
    "1f550",
    "1f551",
    "1f552",
    "1f553",
    "1f554",
    "1f555",
    "1f556",
    "1f558",
    "1f559",
    "1f55a",
    "1f55b",
    "1f55c",
    "1f55d",
    "1f55e",
    "1f55f",
    "1f560",
    "1f561",
    "1f562",
    "1f563",
    "1f564",
    "1f565",
    "1f566",
    "1f567",
]

# We don't include the skin tones as emojis that one can search for on their own.
SKIN_TONE_EMOJI_CODES = [
    "1f3fb",
    "1f3fc",
    "1f3fd",
    "1f3fe",
    "1f3ff",
]


def cleanup_name(name: str) -> str:
    replacements = {
        " ": "_",
        "-": "_",
        "–": "_",
        "“": "",
        "”": "",
        ":": "",
        ".": "",
        ",": "",
        "(": "",
        ")": "",
        "&": "and",
        "‘": "",
        "’": "",
        "'": "",
    }
    for before, after in replacements.items():
        name = name.replace(before, after)
    name = re.sub(r"_{2,}", "_", name)
    return name.lower()


def convert_non_ascii_chars(name: str) -> str:
    replacements = {
        "è": "e",
        "ǐ": "i",
        "ó": "o",
        "ā": "a",
        "ō": "o",
        "ñ": "n",
        "ô": "o",
        "ç": "c",
        "é": "e",
        "ã": "a",
        "í": "i",
        "å": "a",
        "ü": "u",
    }
    for before, after in replacements.items():
        name = name.replace(before, after)
    assert name.isascii(), (
        f"{name} still contains non-ascii characters. Add them to convert_non_ascii_chars."
    )
    return name


def main() -> None:
    all_emojis = {}
    all_canonical_names = set()

    alias_to_emoji_code = defaultdict(list)

    # STEP 1: Generate first draft of all_emojis.
    for emoji_dict in EMOJI_DATA:
        emoji_code = get_emoji_code(emoji_dict)
        if emoji_code in SKIPPED_CLOCK_EMOJI_CODES or emoji_code in SKIN_TONE_EMOJI_CODES:
            continue

        if emoji_code in CUSTOM_EMOJI_NAME_MAPS:
            canonical_name = cleanup_name(CUSTOM_EMOJI_NAME_MAPS[emoji_code]["canonical_name"])
            if canonical_name in all_canonical_names:
                raise Exception(
                    f"{canonical_name} was already added with a different codepoint. "
                    f"Rename it in `custom_emoji_names` or add an entry for {emoji_code}."
                )
            all_canonical_names.add(canonical_name)
            all_emojis[emoji_code] = CUSTOM_EMOJI_NAME_MAPS[emoji_code]
        else:
            # create the unicode character(s) for the emoji, since this is the key into the CLDR data
            # We can't just use emoji_dict["non_qualified"] because of this upstream bug:
            # https://github.com/iamcal/emoji-data/pull/217
            emoji = unqualify_emoji(hex_codepoint_to_emoji(emoji_dict["unified"]))
            if emoji not in CLDR_DATA:
                print(
                    f"{emoji} not found in custom emoji name maps, but also not found in CLDR data. Skipping."
                )
                continue
            # CLDR_DATA[emoji] is of the form {'default': [...], 'tts': [...]}
            # * "tts" is what's used for text-to-speech and always has one item, so we use that
            #    as the canonical name.
            # * "default" has several items in it that we use as aliases.
            # See also: https://www.unicode.org/reports/tr35/tr35-general.html#14-annotations-and-labels
            assert len(CLDR_DATA[emoji]["tts"]) == 1
            canonical_name = cleanup_name(CLDR_DATA[emoji]["tts"][0].strip())
            if canonical_name in all_canonical_names:
                raise Exception(
                    f"{canonical_name} was already added with a different codepoint. "
                    f"Rename it in `custom_emoji_names` or add an entry for {emoji_code}."
                )
            aliases = [cleanup_name(alias.strip()) for alias in CLDR_DATA[emoji]["default"]]
            all_emojis[emoji_code] = {"canonical_name": canonical_name, "aliases": aliases}
            all_canonical_names.add(canonical_name)

    # STEP 2: We don't support having aliases that collide with canonical names for emoji, so remove them.
    for emoji_code, emoji_names in all_emojis.items():
        # Copy the list to not iterate while elements are being deleted.
        aliases = emoji_names["aliases"][:]
        for alias in aliases:
            if alias in all_canonical_names:
                emoji_names["aliases"].remove(alias)
            else:
                alias_to_emoji_code[alias].append(emoji_code)  # This is used in STEP 3.

    # STEP 3: We don't support multiple emoji sharing the same alias, but the CLDR data
    # doesn't have that same restriction, so we have to fix this up to have unique aliases.
    # If the alias was specifically specified in custom_emoji_names, then we can keep just
    # that one, but otherwise there's no particular emoji that is an obvious candidate
    # for the alias so just remove the alias for all relevant emoji.
    for alias in alias_to_emoji_code:
        if len(alias_to_emoji_code[alias]) > 1:
            for emoji_code in alias_to_emoji_code[alias]:
                if emoji_code not in CUSTOM_EMOJI_NAME_MAPS:
                    all_emojis[emoji_code]["aliases"].remove(alias)

    # STEP 4: We keep non-ascii (non-"English") characters in some emoji names if that's the correct
    # way to spell that word, but always add an alias for an ascii-only version of the word.
    for emoji_names in all_emojis.values():
        for name in [emoji_names["canonical_name"]] + emoji_names["aliases"]:
            # These are known names where we don't have an ascii-only version and there are ascii aliases
            # that a user can still enter instead to get the same emoji.
            if name in ["ココ", "サ", "指", "空"]:
                assert any(alias.isascii() for alias in emoji_names["aliases"])
                continue
            if not name.isascii():
                ascii_alias = convert_non_ascii_chars(name)
                # Now no other emoji can use this alias.
                for code in alias_to_emoji_code[ascii_alias]:
                    all_emojis[code]["aliases"].remove(ascii_alias)
                emoji_names["aliases"].append(ascii_alias)

    # STEP 5: Write final dictionary to `emoji_names.py`.
    with open(OUT_EMOJI_FILE, "w") as f:
        f.write(
            "from typing import Any\n\n"
            "# Generated with `generate_emoji_names`.\n\n"
            "EMOJI_NAME_MAPS: dict[str, dict[str, Any]] = {\n"
        )
        for key, emoji_names in all_emojis.items():
            f.write(f"    {key!r}: {emoji_names!r},\n")
        f.write("}\n")

    print(
        "\n\nDone! You should run the linter to format emoji_names.py with `./tools/lint --fix -m --only ruff-format`"
    )


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: generate_emoji_names_table]---
Location: zulip-main/tools/setup/emoji/generate_emoji_names_table

```text
#!/usr/bin/env python3
#
# This is a debugging tool that takes as input a bunch of different
# emoji data sources, and outputs a convenient HTML table that can be
# used to sanity-check the differences between these different data
# sources' decisions about what names to provide to each Unicode
# codepoint.
import os
import sys
from typing import Any

import orjson

TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ZULIP_PATH = os.path.dirname(TOOLS_DIR)
sys.path.append(ZULIP_PATH)

from tools.setup.emoji.emoji_names import EMOJI_NAME_MAPS
from tools.setup.emoji.emoji_setup_utils import emoji_is_supported, get_emoji_code

UNIFIED_REACTIONS_FILE = os.path.join(
    ZULIP_PATH, "zerver", "management", "data", "unified_reactions.json"
)
EMOJI_DATA_FILE = os.path.join(ZULIP_PATH, "node_modules", "emoji-datasource-google", "emoji.json")
EMOJI_CACHE = os.path.join(ZULIP_PATH, "static", "generated", "emoji")
OUTPUT_FILE = os.path.join(EMOJI_CACHE, "emoji_names_table.html")

# Emoji sets that we currently support.
EMOJISETS = ["google", "twitter"]

with open(EMOJI_DATA_FILE, "rb") as fp:
    EMOJI_DATA = orjson.loads(fp.read())
with open(UNIFIED_REACTIONS_FILE, "rb") as fp:
    UNIFIED_REACTIONS_MAP = orjson.loads(fp.read())

EMOJI_IMAGE_TEMPLATE = """
    <img class="emoji" src="images-{emojiset}-64/{emoji_code}.png" title={emojiset}>
"""

TABLE_ROW_TEMPLATE = """
    <tr>
        <td class="new-sorting-info">{sorting_info}</td>
        <td class="emoji-code">{emoji_code}</td>
        <td class="emoji-images">{images_html}</td>
        <td class="zulip-emoji-names">{zulip_names}</td>
        <td class="iamcal-emoji-names">{iamcal_names}</td>
        <td class="gemoji-emoji-names">{gemoji_names}</td>
        <td class="unicode-name">{unicode_name}</td>
    </tr>
"""

EMOJI_LISTING_TEMPLATE = """
<html>
    <head>
        <style>
            {table_css}
        </style>
        <title>Zulip emoji names</title>
    </head>
    <body>
        <table>
            <thead>
                <tr>
                    <th class="new-sorting-info">Category</th>
                    <th class="emoji-code">Emoji code</th>
                    <th class="emoji-images">Images</th>
                    <th class="zulip-emoji-names">Zulip</th>
                    <th class="iamcal-emoji-names">Iamcal (Slack)</th>
                    <th class="gemoji-emoji-names">Gemoji (unordered)</th>
                    <th class="unicode-name">Unicode</th>
                </tr>
            </thead>
            <tbody>
                {tbody}
            </tbody>
        </table>
    </body>
</html>
"""

TABLE_CSS = """
    .emoji {
        height: 35px;
        width: 35px;
        position: relative;
        margin-top: -7px;
        vertical-align: middle;
        top: 3px;
    }

    .emoji-images {
        width: 200px;
    }

    table, td, th {
        border: 1px solid black;
        border-collapse: collapse;
    }

    td, th {
        height: 40px;
        text-align: center;
    }

    .google {
        background-image: url('sheet-google-64.png') !important;
    }

    .twitter {
        background-image: url('sheet-twitter-64.png') !important;
    }
"""

SORTED_CATEGORIES = [
    "Smileys & Emotion",
    "People & Body",
    "Animals & Nature",
    "Food & Drink",
    "Activities",
    "Travel & Places",
    "Objects",
    "Symbols",
    "Flags",
    "Component",
]

emoji_code_to_zulip_names: dict[str, str] = {}
emoji_code_to_iamcal_names: dict[str, str] = {}
emoji_code_to_gemoji_names: dict[str, str] = {}
emoji_collection: dict[str, list[dict[str, Any]]] = {category: [] for category in SORTED_CATEGORIES}


def generate_emoji_code_to_emoji_names_maps() -> None:
    # Prepare gemoji names map.
    reverse_unified_reactions_map: dict[str, list[str]] = {}
    for name in UNIFIED_REACTIONS_MAP:
        emoji_code = UNIFIED_REACTIONS_MAP[name]
        if emoji_code in reverse_unified_reactions_map:
            reverse_unified_reactions_map[emoji_code].append(name)
        else:
            reverse_unified_reactions_map[emoji_code] = [name]

    for emoji_code, names in reverse_unified_reactions_map.items():
        emoji_code_to_gemoji_names[emoji_code] = ", ".join(names)

    # Prepare iamcal names map.
    for emoji_dict in EMOJI_DATA:
        emoji_code = get_emoji_code(emoji_dict)
        emoji_code_to_iamcal_names[emoji_code] = ", ".join(emoji_dict["short_names"])

    # Prepare zulip names map.
    for emoji_code in EMOJI_NAME_MAPS:
        canonical_name = EMOJI_NAME_MAPS[emoji_code]["canonical_name"]
        aliases = EMOJI_NAME_MAPS[emoji_code]["aliases"]
        names = [canonical_name]
        names.extend(aliases)
        emoji_code_to_zulip_names[emoji_code] = ", ".join(names)


def get_sorting_info(category: str, sort_order: int) -> str:
    return f"{category} {sort_order}"


def get_images_html(emoji_code: str) -> str:
    images_html = ""
    for emojiset in EMOJISETS:
        images_html += EMOJI_IMAGE_TEMPLATE.format(
            emoji_code=emoji_code,
            emojiset=emojiset,
        )

    return images_html


def generate_emoji_collection() -> None:
    generate_emoji_code_to_emoji_names_maps()
    # Prepare `emoji_collection`.
    for emoji_dict in EMOJI_DATA:
        if not emoji_is_supported(emoji_dict):
            continue
        category = emoji_dict["category"]
        emoji_code = get_emoji_code(emoji_dict)
        sort_order = emoji_dict["sort_order"]
        emoji_collection[category].append(
            {
                "category": category,
                "emoji_code": emoji_code,
                "images_html": get_images_html(emoji_code),
                "gemoji_names": emoji_code_to_gemoji_names.get(emoji_code, ""),
                "iamcal_names": emoji_code_to_iamcal_names.get(emoji_code, ""),
                "zulip_names": emoji_code_to_zulip_names.get(emoji_code, ""),
                "unicode_name": (emoji_dict["name"] or "").lower(),
                "sort_order": sort_order,
                "sorting_info": get_sorting_info(category, sort_order),
            }
        )

    # Sort `emoji_collection`.
    for category in SORTED_CATEGORIES:
        emoji_collection[category].sort(key=lambda x: x["sort_order"])


def main() -> None:
    generate_emoji_collection()

    tbody = ""
    for category in SORTED_CATEGORIES:
        for emoji_entry in emoji_collection[category]:
            tbody += TABLE_ROW_TEMPLATE.format(**emoji_entry)

    with open(OUTPUT_FILE, "w") as fp:
        fp.write(
            EMOJI_LISTING_TEMPLATE.format(
                tbody=tbody,
                table_css=TABLE_CSS,
            )
        )

    print(
        "Done! Open http://localhost:9991/static/generated/emoji/emoji_names_table.html "
        "to view(after starting the dev server)."
    )


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: destroy-all]---
Location: zulip-main/tools/test-install/destroy-all

```text
#!/usr/bin/env bash
set -e

usage() {
    echo "usage: destroy-all -f" >&2
    exit 1
}

args="$(getopt -o +f --long help,force -- "$@")"
eval "set -- $args"
while true; do
    case "$1" in
        --help) usage ;;
        -f | --force)
            FORCE=1
            shift
            ;;
        --)
            shift
            break
            ;;
        *) usage ;;
    esac
done

if [ -z "$FORCE" ] || [ "$#" -gt 0 ]; then
    usage
fi

if [ "$EUID" -ne 0 ]; then
    echo "error: this script must be run as root" >&2
    exit 1
fi

lxc-ls -f \
    | perl -lane '$_ = $F[0]; print if (/^zulip-install-/ && !/-base$/)' \
    | while read -r c; do
        echo "$c"
        lxc-destroy -f -n "$c"
    done
```

--------------------------------------------------------------------------------

---[FILE: install]---
Location: zulip-main/tools/test-install/install

```text
#!/usr/bin/env bash
set -e

usage() {
    echo "usage: install -r RELEASE {TARBALL|DIR} [...installer opts..]" >&2
    exit 1
}

args="$(getopt -o +r: --long help,release: -- "$@")"
eval "set -- $args"
while true; do
    case "$1" in
        --help) usage ;;
        -r | --release)
            RELEASE="$2"
            shift
            shift
            ;;
        --)
            shift
            break
            ;;
        *) usage ;;
    esac
done
INSTALLER="$1"
shift || usage
INSTALLER_ARGS=("$@")
set --

if [ -z "$RELEASE" ] || [ -z "$INSTALLER" ]; then
    usage
fi

if [ "$EUID" -ne 0 ]; then
    echo "error: this script must be run as root" >&2
    exit 1
fi

set -x

THIS_DIR="$(dirname "$(readlink -f "$0")")"

BASE_CONTAINER_NAME=zulip-install-"$RELEASE"-base
if ! lxc-info -n "$BASE_CONTAINER_NAME" >/dev/null 2>&1; then
    "$THIS_DIR"/prepare-base "$RELEASE"
fi

while [ -z "$CONTAINER_NAME" ] || lxc-info -n "$CONTAINER_NAME" >/dev/null 2>&1; do
    shared_dir="$(mktemp -d --tmpdir "$RELEASE"-XXXXX)"
    CONTAINER_NAME=zulip-install-"$(basename "$shared_dir")"
done

message="$(
    cat <<EOF

Container:
  sudo lxc-attach --clear-env -n $CONTAINER_NAME

Unpacked tree:
  sudo ls $shared_dir/mnt/zulip-server
EOF
)"
trap 'set +x; echo "$message"' EXIT

if [ -d "$INSTALLER" ]; then
    installer_dir="$(readlink -f "$INSTALLER")"
else
    installer_dir="$(mktemp -d --tmpdir zulip-server-XXXXX)"
    tar -xf "$INSTALLER" -C "$installer_dir" --transform='s,^[^/]*,zulip-server,'
fi

mkdir -p /srv/zulip/test-install/pip-cache

mkdir "$shared_dir"/upper "$shared_dir"/work "$shared_dir"/mnt
mount -t overlay overlay \
    -o lowerdir="$installer_dir",upperdir="$shared_dir"/upper,workdir="$shared_dir"/work \
    "$shared_dir"/mnt

lxc-copy --ephemeral --keepdata -n "$BASE_CONTAINER_NAME" -N "$CONTAINER_NAME" \
    -m bind="$shared_dir"/mnt:/mnt/src/,bind=/srv/zulip/test-install/pip-cache:/root/.cache/pip

"$THIS_DIR"/lxc-wait -n "$CONTAINER_NAME"

run() {
    lxc-attach --clear-env -n "$CONTAINER_NAME" -- "$@"
}

run eatmydata -- /mnt/src/zulip-server/scripts/setup/install --self-signed-cert "${INSTALLER_ARGS[@]}"

# TODO settings.py, initialize-database, create realm
```

--------------------------------------------------------------------------------

---[FILE: lxc-wait]---
Location: zulip-main/tools/test-install/lxc-wait

```text
#!/usr/bin/env bash
set -e

usage() {
    echo "usage: lxc-wait -n CONTAINER" >&2
    exit 1
}

args="$(getopt -o +n: --long help,name: -- "$@")"
eval "set -- $args"
while true; do
    case "$1" in
        --help) usage ;;
        -n | --name)
            CONTAINER_NAME="$2"
            shift
            shift
            ;;
        --)
            shift
            break
            ;;
        *) usage ;;
    esac
done

if [ -z "$CONTAINER_NAME" ] || [ "$#" -gt 0 ]; then
    usage
fi

if [ "$EUID" -ne 0 ]; then
    echo "error: this script must be run as root" >&2
    exit 1
fi

# We poll.
poll_runlevel() {
    for _ in {1..60}; do
        echo "lxc-wait: $CONTAINER_NAME: polling for boot..." >&2
        runlevel="$(lxc-attach --clear-env -n "$CONTAINER_NAME" -- runlevel 2>/dev/null)" \
            || {
                sleep 1
                continue
            }
        if [ "$runlevel" != "${0%[0-9]}" ]; then
            echo "lxc-wait: $CONTAINER_NAME: booted!" >&2
            poll_network
        fi
        sleep 1
    done
    echo "error: timeout waiting for container to boot" >&2
    exit 1
}

poll_network() {
    for _ in {1..60}; do
        echo "lxc-wait: $CONTAINER_NAME: polling for network..." >&2
        # New hosts don't have `host` or `nslookup`
        lxc-attach --clear-env -n "$CONTAINER_NAME" -- \
            ping -q -c 1 archive.ubuntu.com 2>/dev/null >/dev/null \
            || {
                sleep 1
                continue
            }
        echo "lxc-wait: $CONTAINER_NAME: network is up!" >&2
        exit 0
    done
    echo "error: timeout waiting for container to get network" >&2
    exit 1
}

poll_runlevel
```

--------------------------------------------------------------------------------

---[FILE: prepare-base]---
Location: zulip-main/tools/test-install/prepare-base

```text
#!/usr/bin/env bash
set -e

if [ "$EUID" -ne 0 ]; then
    echo "error: this script must be run as root" >&2
    exit 1
fi

RELEASE="$1"
ARCH=amd64 # TODO: maybe i686 too

case "$RELEASE" in
    jammy)
        extra_packages=(python3-pip)
        ;;
    *)
        echo "error: unsupported target release: $RELEASE" >&2
        exit 1
        ;;
esac

THIS_DIR="$(dirname "$(readlink -f "$0")")"

set -x

CONTAINER_NAME=zulip-install-$RELEASE-base

if ! lxc-info -n "$CONTAINER_NAME" >/dev/null 2>&1; then
    lxc-create -n "$CONTAINER_NAME" -t download -- -d ubuntu -r "$RELEASE" -a "$ARCH"
fi

lxc-start -n "$CONTAINER_NAME"
"$THIS_DIR"/lxc-wait -n "$CONTAINER_NAME"

run() {
    lxc-attach --clear-env -n "$CONTAINER_NAME" -- "$@"
}

run passwd -d root

run apt-get update

run apt-get dist-upgrade -y

# As an optimization, we install a bunch of packages the installer
# would install for itself.
run apt-get install -y --no-install-recommends \
    xvfb parallel unzip zip jq python3-pip curl eatmydata \
    git crudini openssl ssl-cert \
    build-essential python3-dev \
    memcached redis-server \
    hunspell-en-us supervisor libssl-dev puppet \
    gettext libffi-dev libfreetype6-dev zlib1g-dev libjpeg-dev \
    libldap2-dev \
    libxml2-dev libxslt1-dev libpq-dev \
    virtualenv \
    "${extra_packages[@]}"

run ln -sf /usr/share/zoneinfo/Etc/UTC /etc/localtime
run locale-gen C.UTF-8 || true
echo "LC_ALL=C.UTF-8" | run tee /etc/default/locale

# TODO: on failure, either stop or print message
lxc-stop -n "$CONTAINER_NAME"
```

--------------------------------------------------------------------------------

---[FILE: test_capitalization_checker.py]---
Location: zulip-main/tools/tests/test_capitalization_checker.py

```python
from unittest import TestCase

from bs4 import BeautifulSoup

from tools.lib.capitalization import check_capitalization, get_safe_text, is_capitalized


class GetSafeTextTestCase(TestCase):
    def test_get_safe_text(self) -> None:
        string = "Zulip Zulip. Zulip some text!"
        safe_text = get_safe_text(string)
        self.assertEqual(safe_text, "Zulip zulip. Zulip some text!")

        string = "Zulip Zulip? Zulip some text!"
        safe_text = get_safe_text(string)
        self.assertEqual(safe_text, "Zulip zulip? Zulip some text!")

        string = "Zulip Zulip! Zulip some text!"
        safe_text = get_safe_text(string)
        self.assertEqual(safe_text, "Zulip zulip! Zulip some text!")

        string = "Zulip Zulip, Zulip some text!"
        safe_text = get_safe_text(string)
        self.assertEqual(safe_text, "Zulip zulip, zulip some text!")

        string = "Not Ignored Phrase"
        safe_text = get_safe_text(string)
        self.assertEqual(safe_text, "Not Ignored Phrase")

        string = "Not ignored phrase"
        safe_text = get_safe_text(string)
        self.assertEqual(safe_text, "Not ignored phrase")

        string = ""
        safe_text = get_safe_text(string)
        self.assertEqual(safe_text, "")

        string = """
        <p>Please re-enter your password to confirm your identity.
                (<a href="/accounts/password/reset/" target="_blank">Forgotten it?</a>)</p>
                """
        safe_text = get_safe_text(string)
        soup = BeautifulSoup(safe_text, "lxml")
        rendered_text = " ".join(soup.text.split())
        self.assertEqual(safe_text, rendered_text)

        string = "Edited (__last_edit_timestr__)"
        safe_text = get_safe_text(string)
        self.assertEqual(safe_text, string)


class IsCapitalizedTestCase(TestCase):
    def test_process_text(self) -> None:
        string = "Zulip zulip. Zulip some text!"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = "Zulip zulip? Zulip some text!"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = "Zulip zulip! Zulip some text!"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = "Zulip zulip, Zulip some text!"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = "Some number 25mib"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = "Not Ignored Phrase"
        capitalized = is_capitalized(string)
        self.assertFalse(capitalized)

        string = "Not ignored phrase"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = ""
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = "Please re-enter your password to confirm your identity. (Forgotten it?)"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = "Edited (__last_edit_timestr__)"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = "Iphone application"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)

        string = "One two etc_ three"
        capitalized = is_capitalized(string)
        self.assertTrue(capitalized)


class CheckCapitalizationTestCase(TestCase):
    def test_check_capitalization(self) -> None:
        strings = [
            "Zulip Zulip. Zulip some text!",
            "Zulip Zulip? Zulip some text!",
            "Zulip Zulip! Zulip some text!",
            "Zulip Zulip, Zulip some text!",
            "Not Ignored Phrase",
            "Not ignored phrase",
            "Some text with realm in it",
            "Realm in capital case",
        ]
        errored, ignored, banned = check_capitalization(strings)
        self.assertEqual(errored, ["Not Ignored Phrase"])
        self.assertEqual(
            ignored,
            sorted(
                [
                    "Zulip Zulip. Zulip some text!",
                    "Zulip Zulip? Zulip some text!",
                    "Zulip Zulip! Zulip some text!",
                    "Zulip Zulip, Zulip some text!",
                ]
            ),
        )

        self.assertEqual(
            banned,
            sorted(
                [
                    "realm found in 'Some text with realm in it'. "
                    "The term realm should not appear in user-facing "
                    "strings. Use organization instead.",
                    "realm found in 'Realm in capital case'. "
                    "The term realm should not appear in user-facing "
                    "strings. Use organization instead.",
                ]
            ),
        )
```

--------------------------------------------------------------------------------

---[FILE: test_check_rabbitmq_queue.py]---
Location: zulip-main/tools/tests/test_check_rabbitmq_queue.py

```python
import time
from unittest import TestCase, mock

from scripts.lib.check_rabbitmq_queue import CRITICAL, OK, UNKNOWN, WARNING, analyze_queue_stats


class AnalyzeQueueStatsTests(TestCase):
    def test_no_stats_available(self) -> None:
        result = analyze_queue_stats("name", {}, 0)
        self.assertEqual(result["status"], UNKNOWN)

    def test_queue_stuck(self) -> None:
        """Last update > 5 minutes ago and there's events in the queue."""

        result = analyze_queue_stats("name", {"update_time": time.time() - 301}, 100)
        self.assertEqual(result["status"], CRITICAL)
        self.assertIn("queue appears to be stuck", result["message"])

    def test_queue_just_started(self) -> None:
        """
        We just started processing a burst of events, and haven't processed enough
        to log productivity statistics yet.
        """
        result = analyze_queue_stats(
            "name",
            {
                "update_time": time.time(),
                "recent_average_consume_time": None,
            },
            10000,
        )
        self.assertEqual(result["status"], OK)

    def test_queue_normal(self) -> None:
        """10000 events and each takes a second => it'll take a long time to empty."""
        result = analyze_queue_stats(
            "name",
            {
                "update_time": time.time(),
                "queue_last_emptied_timestamp": time.time() - 10000,
                "recent_average_consume_time": 1,
            },
            10000,
        )
        self.assertEqual(result["status"], CRITICAL)
        self.assertIn("clearing the backlog", result["message"])

        # If we're doing 10K/sec, it's OK.
        result = analyze_queue_stats(
            "name",
            {
                "update_time": time.time(),
                "queue_last_emptied_timestamp": time.time() - 10000,
                "recent_average_consume_time": 0.0001,
            },
            10000,
        )
        self.assertEqual(result["status"], OK)

        # Verify logic around whether it'll take MAX_SECONDS_TO_CLEAR to clear queue.
        with mock.patch.dict("scripts.lib.check_rabbitmq_queue.MAX_SECONDS_TO_CLEAR", {"name": 10}):
            result = analyze_queue_stats(
                "name",
                {
                    "update_time": time.time(),
                    "queue_last_emptied_timestamp": time.time() - 10000,
                    "recent_average_consume_time": 1,
                },
                11,
            )
            self.assertEqual(result["status"], WARNING)
            self.assertIn("clearing the backlog", result["message"])

            result = analyze_queue_stats(
                "name",
                {
                    "update_time": time.time(),
                    "queue_last_emptied_timestamp": time.time() - 10000,
                    "recent_average_consume_time": 1,
                },
                9,
            )
            self.assertEqual(result["status"], OK)
```

--------------------------------------------------------------------------------

---[FILE: test_html_branches.py]---
Location: zulip-main/tools/tests/test_html_branches.py

```python
import os
import unittest

import tools.lib.template_parser
from tools.lib.html_branches import build_id_dict, get_tag_info, split_for_id_and_class

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEST_TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_template_data")


class TestHtmlBranches(unittest.TestCase):
    def test_get_tag_info(self) -> None:
        html = """<p id="test" class="test1 test2">foo</p>"""

        start_tag, text, end_tag = tools.lib.template_parser.tokenize(html)

        start_tag_info = get_tag_info(start_tag)
        end_tag_info = get_tag_info(end_tag)

        self.assertEqual(start_tag_info.text(), "p.test1.test2#test")
        self.assertEqual(end_tag_info.text(), "p")
        self.assertEqual(text.s, "foo")

    def test_build_id_dict(self) -> None:
        templates = ["test_template1.html", "test_template2.html"]
        templates = [os.path.join(TEST_TEMPLATES_DIR, fn) for fn in templates]

        template_id_dict = build_id_dict(templates)

        self.assertEqual(
            set(template_id_dict.keys()), {"below_navbar", "hello_{{ message }}", "intro"}
        )
        self.assertEqual(
            template_id_dict["hello_{{ message }}"],
            [
                f"Line 12:{ZULIP_PATH}/tools/tests/test_template_data/test_template1.html",
                f"Line 12:{ZULIP_PATH}/tools/tests/test_template_data/test_template2.html",
            ],
        )
        self.assertEqual(
            template_id_dict["intro"],
            [
                f"Line 10:{ZULIP_PATH}/tools/tests/test_template_data/test_template1.html",
                f"Line 11:{ZULIP_PATH}/tools/tests/test_template_data/test_template1.html",
                f"Line 11:{ZULIP_PATH}/tools/tests/test_template_data/test_template2.html",
            ],
        )
        self.assertEqual(
            template_id_dict["below_navbar"],
            [f"Line 10:{ZULIP_PATH}/tools/tests/test_template_data/test_template2.html"],
        )

    def test_split_for_id_and_class(self) -> None:
        id1 = "{{ red|blue }}"
        id2 = "search_box_{{ page }}"

        class1 = "chat_box message"
        class2 = "stream_{{ topic }}"
        class3 = "foo {{ a|b|c }} bar"

        self.assertEqual(split_for_id_and_class(id1), ["{{ red|blue }}"])
        self.assertEqual(split_for_id_and_class(id2), ["search_box_{{ page }}"])

        self.assertEqual(split_for_id_and_class(class1), ["chat_box", "message"])
        self.assertEqual(split_for_id_and_class(class2), ["stream_{{ topic }}"])
        self.assertEqual(split_for_id_and_class(class3), ["foo", "{{ a|b|c }}", "bar"])
```

--------------------------------------------------------------------------------

````

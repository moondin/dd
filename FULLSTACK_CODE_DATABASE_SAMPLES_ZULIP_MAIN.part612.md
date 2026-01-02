---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 612
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 612 of 1290)

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

---[FILE: emoji.ts]---
Location: zulip-main/web/src/emoji.ts
Signals: Zod

```typescript
import _ from "lodash";
import type * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import type {StateData, realm_emoji_map_schema, server_emoji_schema} from "./state_data.ts";

// This is the data structure that we get from the server on initialization.
export type ServerEmoji = z.infer<typeof server_emoji_schema>;

type RealmEmojiMap = z.infer<typeof realm_emoji_map_schema>;

// The data the server provides about unicode emojis.
type ServerUnicodeEmojiData = {
    codepoint_to_name: Record<string, string>;
    name_to_codepoint: Record<string, string>;
    emoji_catalog: Record<string, string[]>;
    emoticon_conversions: Record<string, string>;
    names: string[];
};

export type EmoticonTranslation = {
    regex: RegExp;
    replacement_text: string;
};

type RealmEmoji = {
    id: string;
    emoji_name: string;
    emoji_url: string;
    still_url: string | null;
    deactivated: boolean;
};

// Data structure which every widget(like Emoji Picker) in the web app is supposed to use for displaying emojis.
export type EmojiDict = {
    name: string;
    display_name: string;
    aliases: string[];
    has_reacted: boolean;
    url?: string;
} & (
    | {
          is_realm_emoji: true;
          emoji_code?: undefined;
      }
    | {
          is_realm_emoji: false;
          emoji_code: string;
      }
);

// Details needed by template to render an emoji.
export type EmojiRenderingDetails = {
    emoji_name: string;
    reaction_type: "zulip_extra_emoji" | "realm_emoji" | "unicode_emoji";
    emoji_code: string;
    url?: string;
    still_url?: string | null;
};

// We will get actual values when we get initialized.
let emoji_codes: ServerUnicodeEmojiData;

// `emojis_by_name` is the central data source that is supposed to be
// used by every widget in the web app for gathering data for displaying
// emojis. Emoji picker uses this data to derive data for its own use.
export let emojis_by_name = new Map<string, EmojiDict>();
export const all_realm_emojis = new Map<number | string, RealmEmoji | typeof zulip_emoji>();
export const active_realm_emojis = new Map<
    string,
    Omit<RealmEmoji, "deactivated"> | typeof zulip_emoji
>();

let default_emoji_aliases = new Map<string, string[]>();

// For legacy reasons we track server_realm_emoji_data,
// since our settings code builds off that format.  We
// should move it to use all_realm_emojis, which requires
// adding author_id here and then changing the settings code
// in a slightly non-trivial way.
let server_realm_emoji_data: RealmEmojiMap = {};

// We really want to deprecate this, too.
export function get_server_realm_emoji_data(): RealmEmojiMap {
    return server_realm_emoji_data;
}

let emoticon_translations: EmoticonTranslation[] = [];

function build_emoticon_translations({
    emoticon_conversions,
}: Pick<ServerUnicodeEmojiData, "emoticon_conversions">): EmoticonTranslation[] {
    /*

    Please keep this as a pure function so that we can
    eventually share this code with the mobile codebase.

    Build a data structure that looks like something
    like this:

    [
        { regex: /(\:\))/g, replacement_text: ':smile:' },
        { regex: /(\(\:)/g, replacement_text: ':smile:' },
        { regex: /(\:\/)/g, replacement_text: ':confused:' },
        { regex: /(<3)/g, replacement_text: ':heart:' },
        { regex: /(\:\()/g, replacement_text: ':frown:' },
        { regex: /(\:\|)/g, replacement_text: ':expressionless:' },
        ....
    ]

        We build up this list of ~12 emoticon translations even
        if user_settings.translate_emoticons is false, since
        that setting can be flipped via live update events.
        On the other hand, we assume that emoticon_conversions
        won't change until the next reload, which is fine for
        now (and we want to avoid creating new regexes on
        every new message).
    */

    const translations: EmoticonTranslation[] = [];
    for (const [emoticon, replacement_text] of Object.entries(emoticon_conversions)) {
        const regex = new RegExp("(" + _.escapeRegExp(emoticon) + ")", "g");

        translations.push({
            regex,
            replacement_text,
        });
    }

    return translations;
}

const zulip_emoji = {
    id: "zulip",
    emoji_name: "zulip",
    // We don't use a webpack'd URL here, for consistency with the
    // server-side markdown, which doesn't want to render it into the
    // message content.
    emoji_url: "/static/generated/emoji/images/emoji/unicode/zulip.png",
    still_url: null,
    is_realm_emoji: true,
    deactivated: false,
};

export function get_emoji_name(codepoint: string): string | undefined {
    // get_emoji_name('1f384') === 'holiday_tree'
    if (Object.hasOwn(emoji_codes.codepoint_to_name, codepoint)) {
        return emoji_codes.codepoint_to_name[codepoint];
    }
    return undefined;
}

export function get_emoji_codepoint(emoji_name: string): string | undefined {
    // get_emoji_codepoint('avocado') === '1f951'
    if (Object.hasOwn(emoji_codes.name_to_codepoint, emoji_name)) {
        return emoji_codes.name_to_codepoint[emoji_name];
    }
    return undefined;
}

export function get_realm_emoji_url(emoji_name: string): string | undefined {
    // If the emoji name is a realm emoji, returns the URL for it.
    // Returns undefined for Unicode emoji.
    // get_realm_emoji_url('shrug') === '/user_avatars/2/emoji/images/31.png'

    const data = active_realm_emojis.get(emoji_name);

    if (!data) {
        // Not all emojis have URLs, plus the user
        // may have hand-typed an invalid emoji.
        // The caller can check the result for falsiness
        // and then try alternate ways of parsing the
        // emoji (in the case of Markdown) or just do
        // whatever makes sense for the caller.
        return undefined;
    }

    return data.emoji_url;
}

function build_emojis_by_name({
    realm_emojis,
    emoji_catalog,
    get_emoji_name,
    default_emoji_aliases,
}: {
    realm_emojis: typeof active_realm_emojis;
    emoji_catalog: ServerUnicodeEmojiData["emoji_catalog"];
    get_emoji_name: (codepoint: string) => string | undefined;
    default_emoji_aliases: Map<string, string[]>;
}): Map<string, EmojiDict> {
    // Please keep this as a pure function so that we can
    // eventually share this code with the mobile codebase.
    const map = new Map<string, EmojiDict>();

    for (const codepoints of Object.values(emoji_catalog)) {
        for (const codepoint of codepoints) {
            const emoji_name = get_emoji_name(codepoint);
            if (emoji_name !== undefined) {
                const emoji_dict: EmojiDict = {
                    name: emoji_name,
                    display_name: emoji_name,
                    aliases: default_emoji_aliases.get(codepoint) ?? [],
                    is_realm_emoji: false,
                    emoji_code: codepoint,
                    has_reacted: false,
                };
                // We may later get overridden by a realm emoji.
                map.set(emoji_name, emoji_dict);
            }
        }
    }

    for (const [realm_emoji_name, realm_emoji] of realm_emojis) {
        const emoji_dict: EmojiDict = {
            name: realm_emoji_name,
            display_name: realm_emoji_name,
            aliases: [realm_emoji_name],
            is_realm_emoji: true,
            url: realm_emoji.emoji_url,
            has_reacted: false,
            emoji_code: undefined,
        };

        // We want the realm emoji to overwrite any existing entry in this map.
        map.set(realm_emoji_name, emoji_dict);
    }

    return map;
}

export function update_emojis(realm_emojis: RealmEmojiMap): void {
    // The settings code still works with the
    // server format of the data.
    server_realm_emoji_data = realm_emojis;

    // all_realm_emojis is emptied before adding the realm-specific emoji
    // to it. This makes sure that in case of deletion, the deleted realm_emojis
    // don't persist in active_realm_emojis.
    all_realm_emojis.clear();
    active_realm_emojis.clear();

    for (const data of Object.values(realm_emojis)) {
        all_realm_emojis.set(data.id, {
            id: data.id,
            emoji_name: data.name,
            emoji_url: data.source_url,
            still_url: data.still_url,
            deactivated: data.deactivated,
        });
        if (!data.deactivated) {
            active_realm_emojis.set(data.name, {
                id: data.id,
                emoji_name: data.name,
                emoji_url: data.source_url,
                still_url: data.still_url,
            });
        }
    }

    // Add the special Zulip emoji as though it were a realm emoji.

    // The Zulip emoji is the only emoji that uses a string ("zulip")
    // as its ID. All other emoji use numeric IDs. This special case
    // is confusing; ideally we'd convert the Zulip emoji to be
    // implemented using the RealmEmoji infrastructure.
    all_realm_emojis.set("zulip", zulip_emoji);

    // here "zulip" is an emoji name, which is fine.
    active_realm_emojis.set("zulip", zulip_emoji);

    emojis_by_name = build_emojis_by_name({
        realm_emojis: active_realm_emojis,
        emoji_catalog: emoji_codes.emoji_catalog,
        get_emoji_name,
        default_emoji_aliases,
    });
}

// This function will provide required parameters that would
// need by template to render an emoji.
export function get_emoji_details_by_name(emoji_name: string): EmojiRenderingDetails {
    // To call this function you must pass an emoji name.
    if (!emoji_name) {
        throw new Error("Emoji name must be passed.");
    }

    if (active_realm_emojis.has(emoji_name)) {
        const emoji_code_info = active_realm_emojis.get(emoji_name)!;
        return {
            emoji_name,
            emoji_code: emoji_code_info.id,
            url: emoji_code_info.emoji_url,
            still_url: emoji_code_info.still_url,
            reaction_type: emoji_name === "zulip" ? "zulip_extra_emoji" : "realm_emoji",
        };
    }

    const codepoint = get_emoji_codepoint(emoji_name);
    if (codepoint === undefined) {
        throw new Error("Bad emoji name: " + emoji_name);
    }

    return {
        emoji_name,
        reaction_type: "unicode_emoji",
        emoji_code: codepoint,
    };
}

export function get_emoji_details_for_rendering(opts: {
    emoji_name: string;
    emoji_code: string;
    reaction_type: "zulip_extra_emoji" | "realm_emoji" | "unicode_emoji";
}): EmojiRenderingDetails {
    if (opts.reaction_type !== "unicode_emoji") {
        const realm_emoji = all_realm_emojis.get(opts.emoji_code);
        if (!realm_emoji) {
            throw new Error(`Cannot find realm emoji for code '${opts.emoji_code}'.`);
        }
        return {
            url: realm_emoji.emoji_url,
            still_url: realm_emoji.still_url,
            emoji_name: opts.emoji_name,
            emoji_code: opts.emoji_code,
            reaction_type: opts.reaction_type,
        };
    }
    // else
    return {
        emoji_name: opts.emoji_name,
        emoji_code: opts.emoji_code,
        reaction_type: opts.reaction_type,
    };
}

function build_default_emoji_aliases({
    names,
    get_emoji_codepoint,
}: {
    names: string[];
    get_emoji_codepoint: (name: string) => string | undefined;
}): Map<string, string[]> {
    // Please keep this as a pure function so that we can
    // eventually share this code with the mobile codebase.

    // Create a map of codepoint -> names
    const map = new Map<string, string[]>();

    for (const name of names) {
        const base_name = get_emoji_codepoint(name);

        if (base_name === undefined) {
            blueslip.error(`No codepoint for emoji name ${name}`);
            continue;
        }

        if (map.has(base_name)) {
            map.get(base_name)!.push(name);
        } else {
            map.set(base_name, [name]);
        }
    }

    return map;
}

export function initialize(
    params: StateData["emoji"] & {emoji_codes: ServerUnicodeEmojiData},
): void {
    emoji_codes = params.emoji_codes;

    emoticon_translations = build_emoticon_translations({
        emoticon_conversions: emoji_codes.emoticon_conversions,
    });

    default_emoji_aliases = build_default_emoji_aliases({
        names: emoji_codes.names,
        get_emoji_codepoint,
    });

    update_emojis(params.realm_emoji);
}

export function get_canonical_name(emoji_name: string): string | undefined {
    if (active_realm_emojis.has(emoji_name)) {
        return emoji_name;
    }
    const codepoint = get_emoji_codepoint(emoji_name);
    if (codepoint === undefined) {
        // Our caller needs to handle this possibility.
        return undefined;
    }

    return get_emoji_name(codepoint);
}

export function get_emoticon_translations(): EmoticonTranslation[] {
    return emoticon_translations;
}
```

--------------------------------------------------------------------------------

---[FILE: emojisets.ts]---
Location: zulip-main/web/src/emojisets.ts

```typescript
import octopus_url from "../../static/generated/emoji/images-google-64/1f419.png";
import google_sheet from "../generated/emoji/google.webp";
import twitter_sheet from "../generated/emoji/twitter.webp";

import * as blueslip from "./blueslip.ts";
import {user_settings} from "./user_settings.ts";

import google_css from "!style-loader?injectType=lazyStyleTag!css-loader!../generated/emoji-styles/google-sprite.css";
import twitter_css from "!style-loader?injectType=lazyStyleTag!css-loader!../generated/emoji-styles/twitter-sprite.css";

type EmojiSet = {
    css: {use: () => void; unuse: () => void};
    sheet: string;
};

const emojisets = new Map<string, EmojiSet>([
    ["google", {css: google_css, sheet: google_sheet}],
    ["twitter", {css: twitter_css, sheet: twitter_sheet}],
]);

// For `text` emoji set we fallback to `google` emoji set
// for displaying emojis in emoji picker and typeahead.
emojisets.set("text", emojisets.get("google")!);

let current_emojiset: EmojiSet | undefined;

async function fetch_emojiset(name: string, url: string): Promise<void> {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 10000; // 10 seconds

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // If the fetch is successful, resolve the promise and return
            return;
        } catch (error) {
            if (!navigator.onLine) {
                // If the user is offline, retry once they are online.
                await new Promise<void>((resolve) => {
                    // We don't want to throw an error here since this is clearly something wrong with user's network.
                    blueslip.warn(
                        `Failed to load emojiset ${name} from ${url}. Retrying when online.`,
                    );
                    window.addEventListener(
                        "online",
                        () => {
                            resolve();
                        },
                        {once: true},
                    );
                });
            } else {
                blueslip.warn(
                    `Failed to load emojiset ${name} from ${url}. Attempt ${attempt} of ${MAX_RETRIES}.`,
                );

                // If this was the last attempt, rethrow the error
                if (attempt === MAX_RETRIES) {
                    blueslip.error(
                        `Failed to load emojiset ${name} from ${url} after ${MAX_RETRIES} attempts.`,
                    );
                    throw error;
                }

                // Wait before the next attempt
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }
}

export async function select(name: string): Promise<void> {
    const new_emojiset = emojisets.get(name);
    if (new_emojiset === current_emojiset) {
        return;
    }

    if (!new_emojiset) {
        throw new Error("Unknown emojiset " + name);
    }

    await fetch_emojiset(name, new_emojiset.sheet);

    if (current_emojiset) {
        current_emojiset.css.unuse();
    }
    new_emojiset.css.use();
    current_emojiset = new_emojiset;
}

export function initialize(): void {
    void select(user_settings.emojiset);

    // Load the octopus image in the background, so that the browser
    // will cache it for later use.  Note that we hardcode the octopus
    // emoji to the old Google one because it's better.
    //
    // TODO: We should probably just make this work just like the Zulip emoji.
    const octopus_image = new Image();
    octopus_image.src = octopus_url;
}
```

--------------------------------------------------------------------------------

---[FILE: emoji_frequency.ts]---
Location: zulip-main/web/src/emoji_frequency.ts

```typescript
import assert from "minimalistic-assert";

import * as all_messages_data from "./all_messages_data.ts";
import * as emoji_picker from "./emoji_picker.ts";
import * as message_store from "./message_store.ts";
import * as reactions from "./reactions.ts";
import {current_user} from "./state_data.ts";
import * as typeahead from "./typeahead.ts";

export type ReactionUsage = {
    score: number;
    emoji_code: string;
    emoji_type: string;
    message_ids: Set<number>;
    current_user_reacted_message_ids: Set<number>;
};

const MAX_FREQUENTLY_USED_EMOJIS = 12;
const CURRENT_USER_REACTION_WEIGHT = 5;
export const reaction_data = new Map<string, ReactionUsage>();

export function update_frequently_used_emojis_list(): void {
    const frequently_used_emojis = [...reaction_data.values()].toSorted(
        (a, b) => b.score - a.score,
    );

    const top_frequently_used_emojis = [];
    let popular_emojis = typeahead.get_popular_emojis();
    for (const emoji of frequently_used_emojis) {
        if (
            top_frequently_used_emojis.length + popular_emojis.length ===
            MAX_FREQUENTLY_USED_EMOJIS
        ) {
            break;
        }
        assert(emoji !== undefined);
        top_frequently_used_emojis.push({
            emoji_type: emoji.emoji_type,
            emoji_code: emoji.emoji_code,
        });
        popular_emojis = popular_emojis.filter(
            (popular_emoji) => popular_emoji.emoji_code !== emoji.emoji_code,
        );
    }

    const final_frequently_used_emoji_list = [...top_frequently_used_emojis, ...popular_emojis];
    typeahead.set_frequently_used_emojis(
        final_frequently_used_emoji_list.slice(0, MAX_FREQUENTLY_USED_EMOJIS),
    );
    emoji_picker.rebuild_catalog();
}

/*
    This function assumes reactions.add_reaction has already been called.
    TODO: Split reactions.ts into data and UI modules, so that this can
    be called from directly from reactions.add_reaction without creating
    an import cycle.
*/
export function update_emoji_frequency_on_add_reaction_event(event: reactions.ReactionEvent): void {
    const message_id = event.message_id;
    const message = message_store.get(message_id);
    if (message === undefined) {
        return;
    }
    const emoji_id = reactions.get_local_reaction_id(event);
    const clean_reaction_object = message.clean_reactions.get(emoji_id);

    assert(clean_reaction_object !== undefined);

    if (!reaction_data.has(emoji_id)) {
        reaction_data.set(emoji_id, {
            score: 0,
            emoji_code: clean_reaction_object.emoji_code,
            emoji_type: clean_reaction_object.reaction_type,
            message_ids: new Set(),
            current_user_reacted_message_ids: new Set(),
        });
    }

    const reaction_usage = reaction_data.get(emoji_id);
    assert(reaction_usage !== undefined);

    if (reaction_usage.message_ids.has(message_id)) {
        return;
    }
    reaction_usage.message_ids.add(message_id);

    if (event.user_id === current_user.user_id) {
        reaction_usage.score += CURRENT_USER_REACTION_WEIGHT;
        reaction_usage.current_user_reacted_message_ids.add(message.id);
    } else {
        reaction_usage.score += 1;
    }
    update_frequently_used_emojis_list();
}

export function update_emoji_frequency_on_remove_reaction_event(
    event: reactions.ReactionEvent,
): void {
    const message_id = event.message_id;
    const message = message_store.get(message_id);
    if (message === undefined) {
        return;
    }

    const emoji_id = reactions.get_local_reaction_id(event);
    const reaction_usage = reaction_data.get(emoji_id);
    if (reaction_usage === undefined) {
        return;
    }

    if (!reaction_usage.message_ids.has(message_id)) {
        return;
    }
    reaction_usage.message_ids.delete(message_id);

    if (event.user_id === current_user.user_id) {
        reaction_usage.score -= CURRENT_USER_REACTION_WEIGHT;
        reaction_usage.current_user_reacted_message_ids.delete(message.id);
    } else {
        reaction_usage.score -= 1;
    }
    update_frequently_used_emojis_list();
}

export function update_emoji_frequency_on_messages_deletion(message_ids: number[]): void {
    for (const message_id of message_ids) {
        const message = message_store.get(message_id);
        assert(message !== undefined);
        const message_reactions = message.clean_reactions.values();
        for (const emoji of message_reactions) {
            const emoji_id = emoji.local_id;
            const reaction_usage = reaction_data.get(emoji_id);
            if (reaction_usage === undefined) {
                return;
            }
            if (reaction_usage.message_ids.delete(message_id)) {
                reaction_usage.score -= 1;
            }
            if (reaction_usage.current_user_reacted_message_ids.delete(message_id)) {
                reaction_usage.score -= CURRENT_USER_REACTION_WEIGHT - 1;
            }
        }
    }
    update_frequently_used_emojis_list();
}

export function initialize_frequently_used_emojis(): void {
    const message_data = all_messages_data.all_messages_data;
    const messages = message_data.all_messages_after_mute_filtering();

    for (let i = messages.length - 1; i >= 0; i -= 1) {
        const message = messages[i];
        assert(message !== undefined);
        const message_reactions = message.clean_reactions.values();
        for (const emoji of message_reactions) {
            const emoji_id = emoji.local_id;
            if (!reaction_data.has(emoji_id)) {
                reaction_data.set(emoji_id, {
                    score: 0,
                    emoji_code: emoji.emoji_code,
                    emoji_type: emoji.reaction_type,
                    message_ids: new Set(),
                    current_user_reacted_message_ids: new Set(),
                });
            }
            const reaction = reaction_data.get(emoji_id);
            assert(reaction !== undefined);
            reaction.score += 1;
            reaction.message_ids.add(message.id);

            if (emoji.user_ids.includes(current_user.user_id)) {
                reaction.score += CURRENT_USER_REACTION_WEIGHT - 1;
                reaction.current_user_reacted_message_ids.add(message.id);
            }
        }
    }
    update_frequently_used_emojis_list();
}
```

--------------------------------------------------------------------------------

````

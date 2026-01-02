---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 287
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 287 of 1290)

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

---[FILE: internationalization.md]---
Location: zulip-main/docs/translating/internationalization.md

```text
# Internationalization for developers

Zulip is designed with internationalization (i18n) in mind, which lets users
view the Zulip UI in their preferred language. As a developer, it's your
responsibility to make sure that:

- UIs you implement look good when translated into languages other than English.
- Any strings your code changes touch are correctly marked for translation.

This pages gives concrete guidance on how to accomplish these goals, as well as
providing additional context for those who are curious.

## How internationalization impacts Zulip's UI

Always be mindful that **text width is not a constant**. The width of the string
needed to express something varies dramatically between languages. This means
you can't just hardcode a button or widget to look great for English and expect
it to work in all languages.

You can test your work by changing the lengths of strings to be 50% longer and
50% shorter than in English. For strings that are already in the Zulip UI,
Russian is a good test case for translations that are generally longer than
English. Japanese translations are generally shorter.

## What should be marked for translation

Our goal is for **all user-facing strings** in Zulip to be tagged for
translation in both [HTML templates][html-templates] and code, and our linters
attempt to enforce this. This applies to every bit of language a user might see,
including things like error strings, dates, and email content.

The exceptions to the "tag everything users sees" rule are:

- Landing pages (e.g., <https://zulip.com/features/>)
- [Help center pages](../documentation/helpcenter.md)
- [Zulip updates](https://zulip.com/help/configure-automated-notices#zulip-update-announcements)

We do aim for those pages to be usable with tools like Google Translate.

Note that the "user-facing" part is also important. To make good use of our
community translators' valuable time, we only tag content that will actually be
displayed to users.

## How to mark a string for translation

When tagging strings for translation, variation between languages means that you
have to be careful in exactly what you tag, and how you split things up:

- **Punctuation** varies between languages (e.g., Japanese doesn't use
  `.`s at the end of sentences). This means that you should always
  include end-of-sentence symbols like `.` and `?` inside the
  to-be-translated strings, so that translators can correctly
  translate the content.
- **Word order** varies between languages (e.g., some languages put subjects
  before verbs, others the other way around). This means that **concatenating
  translatable strings** produces broken results. If a sentence contains a
  variable, never tag the part before the variable separately from the part
  after the variable.
- **Strings with numerals** (e.g., "5 bananas") work quite differently between
  languages, so double-check your work when tagging strings with numerals for
  translation. See the [plurals](#plurals-and-lists) section below for details.

Note also that we have a "sentence case" [capitalization
policy](translating.md#capitalization) that we enforce using linters that check
all strings tagged for translation in Zulip.

## Translation syntax in Zulip

A few general notes:

- Translation functions must be passed the string to translate, not a
  variable containing the target string. Otherwise, the parsers that
  extract the strings in a project to send to translators will not
  find your string.

- Zulip makes use of the [Jinja2][] templating system for the server
  and [Handlebars][] for the web app. Our [HTML templates][html-templates]
  documentation includes useful information on the syntax and
  behavior of these systems.

### Web application translations

We use the [FormatJS][] library for translations in the Zulip web app,
both in [Handlebars][] templates and JavaScript.

FormatJS uses the standard [ICU MessageFormat][], which includes
useful features such as [plural translations](#plurals-and-lists).

To mark a string translatable in JavaScript files, pass it to the
`intl.formatMessage` function, which we alias to `$t` in `intl.js`:

```js
$t({defaultMessage: "English text"})
```

The string to be translated must be a constant literal string, but
variables can be interpolated by enclosing them in braces (like
`{variable}`) and passing a context object:

```js
$t({defaultMessage: "English text with a {variable}"}, {variable: "Variable value"})
```

`$t` does not escape any variables, so if your translated string is
eventually going to be used as HTML, use `$t_html` instead.

```js
html_content = $t_html({defaultMessage: "HTML with a {variable}"}, {variable: "Variable value"});
$("#foo").html(html_content);
```

The only HTML tags allowed directly in translated strings are the
simple HTML tags enumerated in `default_html_elements`
(`web/src/i18n.ts`) with no attributes. This helps to avoid
exposing HTML details to translators. If you need to include more
complex markup such as a link, you can define a custom HTML tag
locally to the translation, or use a Handlebars template:

```js
$t_html(
    {defaultMessage: "<b>HTML</b> linking to the <z-link>login page</z-link>"},
    {"z-link": (content_html) => `<a href="/login/">${content_html.join("")}</a>`},
)
```

#### Plurals and lists

Plurals are a complex detail of human language. In English, there are
only two variants for how a word like "banana" might be spelled
depending on the number of objects being discussed: "1 banana" and "2
bananas". But languages vary greatly in how plurals work. For example,
in Russian, the form a noun takes
[depends](https://en.wikipedia.org/wiki/Russian_declension#Declension_of_cardinal_numerals)
in part on the last digit of its quantity.

To solve this problem, Zulip expresses plural strings using the
standard [ICU MessageFormat][] syntax, which defines how the string
varies depending on whether there's one item or many in English:

```js
"{N, plural, one {Done! {N} message marked as read.} other {Done! {N} messages marked as read.}}"
```

Translators are then able to write a translation using this same
syntax, potentially using a different set of cases, like this Russian
translation, which varies the string based on whether there was 1,
few, or many items:

```js
"{N, plural, one {Готово! {N} сообщение помечено как прочитанное.} few {Готово! {N} сообщений помечены как прочитанные.} many {Готово! {N} сообщений помечены как прочитанные.} other {Готово! {N} сообщений помечены как прочитанные.}}"
```

You don't need to understand how to write Russian plurals. As a
developer, you just need to write the correct ICU plurals for English,
which will always just have singular and plural variants, and
translators can take care of the rest.

Nonetheless, even the English format takes some concentration to
read. So when designing UI, we generally try to avoid unnecessarily
writing strings that require plurals in favor of other ways to present
information, like displaying an icon with a number next to it.

Languages differ greatly in how to construct a list of the form "foo,
bar, and baz". Some languages don't use commas! The web application
has a handy `util.format_array_as_list` function for correctly doing
this using the `Intl` module; use `git grep` to find examples.

#### Handlebars templates

For translations in Handlebars templates we also use FormatJS, through two
Handlebars [helpers][] that Zulip registers. The syntax for simple strings is:

```html+handlebars
{{t 'English text' }}

{{t 'Block of English text with a {variable}.' }}
```

If you are passing a translated string to a Handlebars partial, you can use:

```html+handlebars
{{> template_name
    variable_name=(t 'English text')
    }}
```

The syntax for HTML strings is:

<!-- The html+handlebars lexer fails to lex the single braces. -->

```text
{{#tr}}
    <p>Block of English text.</p>
{{/tr}}

{{#tr}}
    <p>Block of English text with a {variable}.</p>
{{/tr}}
```

Just like in JavaScript code, variables are enclosed in _single_
braces (rather than the usual Handlebars double braces). Unlike in
JavaScript code, variables are automatically escaped by our Handlebars
helper.

Handlebars expressions like `{{variable}}` or blocks like
`{{#if}}...{{/if}}` aren't permitted inside a `{{#tr}}...{{/tr}}`
translated block, because they don't work properly with translation.
The Handlebars expression would be evaluated before the string is
processed by FormatJS, so that the string to be translated wouldn't be
constant. We have a linter to enforce that translated blocks don't
contain Handlebars.

Restrictions on including HTML tags in translated strings are the same
as in JavaScript. You can insert more complex markup using a local
custom HTML tag like this:

```html+handlebars
{{#tr}}
    <b>HTML</b> linking to the <z-link>login page</z-link>
    {{#*inline "z-link"}}<a href="/login/">{{> @partial-block}}</a>{{/inline}}
{{/tr}}
```

### Server translations

Strings in the server primarily comprise two areas:

- Error strings and other values returned by the API.
- Strings in portico pages, such as the login flow, that are not
  rendered using JavaScript or Handlebars.

#### Jinja2 templates

All user-facing text in the Zulip UI should be generated by an Jinja2 HTML
template so that it can be translated.

To mark a string for translation in a Jinja2 template, you
can use the `_()` function in the templates like this:

```jinja
{{ _("English text") }}
```

If a piece of text contains both a literal string component and variables, use a
block translation. This puts in placeholders for variables, to allow translators
to translate an entire sentence.

To tag a block for translation, Jinja2 uses the [trans][trans] tag, like this:

```jinja
{% trans %}This string will have {{ value }} inside.{% endtrans %}
```

Never break up a sentence like this, as it will make it impossible to translate
correctly:

```jinja
# Don't do this!
{{ _("This string will have") }} {{ value }} {{ _("inside") }}
```

#### Python

A string in Python can be marked for translation using the `_()` function,
which can be imported as follows:

```python
from django.utils.translation import gettext as _
```

Zulip expects all the error messages to be translatable as well. To
ensure this, the error message passed to `JsonableError`
should always be a literal string enclosed by `_()`
function, for example:

```python
JsonableError(_('English text'))
```

If you're declaring a user-facing string at top level or in a class, you need to
use `gettext_lazy` instead, to ensure that the translation happens at
request-processing time when Django knows what language to use, for example:

```python
from zproject.backends import check_password_strength, email_belongs_to_ldap

AVATAR_CHANGES_DISABLED_ERROR = gettext_lazy("Avatar changes are disabled in this organization.")

def confirm_email_change(request: HttpRequest, confirmation_key: str) -> HttpResponse:
  ...
```

```python
class Realm(models.Model):
    MAX_REALM_NAME_LENGTH = 40
    MAX_REALM_SUBDOMAIN_LENGTH = 40

    ...
    ...

    STREAM_EVENTS_NOTIFICATION_TOPIC = gettext_lazy("channel events")
```

To ensure we always internationalize our JSON error messages, the
Zulip linter (`tools/lint`) attempts to verify correct usage.

## Translation process

The end-to-end tooling process for translations in Zulip is as follows.

1. The strings are marked for translation (see sections for
   [server](#server-translations) and
   [web app](#web-application-translations) translations for details on
   this).

2. Translation resource files are created using the
   `./manage.py makemessages` command. This command will create, for
   each language, a resource file called `translations.json` for the
   web app strings and `django.po` for the server strings.

   The `makemessages` command is idempotent in that:

   - It will only delete singular keys in the resource file when they
     are no longer used in Zulip code.
   - It will only delete plural keys (see above for the documentation
     on plural translations) when the corresponding singular key is
     absent.
   - It will not override the value of a singular key if that value
     contains a translated text.

3. Those resource files, when committed, are automatically scanned by
   Weblate.

4. Translators translate the strings in the Weblate UI.

5. Weblate makes the translations into a Git commit, which then can be
   merged into the codebase by a maintainer.

If you're interested, you may also want to check out the [translators'
workflow](translating.md#translators-workflow), just so you have a
sense of how everything fits together.

## Translation resource files

All the translation magic happens through resource files, which hold
the translated text. Server resource files are located at
`locale/<lang_code>/LC_MESSAGES/django.po`, while web app resource
files are located at `locale/<lang_code>/translations.json`.

## Additional resources

We recommend the [EdX i18n guide][edx-i18n] as a great resource for learning
more about internationalization in general; we agree with essentially all of
their style guidelines.

[edx-i18n]: https://docs.openedx.org/en/latest/developers/references/developer_guide/internationalization/i18n.html
[jinja2]: http://jinja.pocoo.org/
[handlebars]: https://handlebarsjs.com/
[trans]: https://jinja.palletsprojects.com/en/3.0.x/extensions/#i18n-extension
[formatjs]: https://formatjs.github.io/
[icu messageformat]: https://formatjs.github.io/docs/core-concepts/icu-syntax#plural-format
[helpers]: https://handlebarsjs.com/guide/block-helpers.html
[html-templates]: ../subsystems/html-css.md#html-templates
```

--------------------------------------------------------------------------------

---[FILE: japanese.md]---
Location: zulip-main/docs/translating/japanese.md

```text
# Japanese translation style guide

## Rules

- Use full-width parentheses `（）` for half-width parentheses `()` in original text.

## Terms

- alert word - **キーワード**/**キーワード通知**

  "Alert" can be literally translated as "アラート", however, it gives a negative impression in Japanese. To describe the function clearly, use "キーワード" or more fully "キーワード通知".

- narrow - **～だけ表示**
- subscribe - **フォロー**
- subscriber - **フォロワー**
```

--------------------------------------------------------------------------------

---[FILE: polish.md]---
Location: zulip-main/docs/translating/polish.md

```text
# Polish translation style guide

Use semi-formal Polish for translation, some specifics:

- Informal "you" (_ty_) instead of more formal approaches (e.g., plural
  "you" (_wy_), using any formal titles like _Państwo_, _Pan/Pani_).

- Gender-neutral forms of verbs, e.g., _unsubscribed_ - _odsubskrybowano_,
  not \*odsubskrybowałeś".

- Imperative, active and continuous verbs, e.g., _manage streams_ -
  _zarządzaj kanałami_, not _zarządź kanałami_.

- Not using reflexive _się_, e.g., _log out_ would be simply _wyloguj_,
  not _wyloguj się_.

- Warm and friendly phrasing whenever appropriate.

- No slang or regional phrases that could be unclear or too informal,
  e.g., _zajawka_.

- Consistent usage of Zulip-specific terms and common verbs for
  actions, even if it means repeating - this is one of the key aspects
  of "semi-formal", as synonyms would be often more appropriate in
  written Polish.

- Mindful usage of long words and phrases - it's sometimes hard to
  translate English to Polish concisely, be mindful of how it looks on
  the frontend after translating.

- Balance common verbs and nouns with specific IT-related translations
  of English terms - this can be tricky, try to check how other
  resources were translated (e.g., Gmail, Microsoft websites, Facebook)
  to decide what wouldn't sound awkward in Polish.

Some terms are very tricky to translate, so be sure to communicate
with other Polish speakers in the community. It's all about making
Zulip friendly and usable.

## Special terms used in Zulip

**alert word**: powiadomienie, "ostrzeżenie" could mean something negative
and alert words in Zulip are used to help users find relevant content

example:

You can set your own alert words for Zulip messages.

> Możesz ustawić powiadomienia dla wybranych fraz w Zulipie.

**Combined feed**: wszystkie wiadomości

example:

You can see all messages in unmuted streams and topics with "Combined feed".

> Możesz zobaczyć pełną listę wiadomości poprzez widok "Wszystkie wiadomości".

**bot**: bot

example:

You can add bots to your Zulip.

> Możesz dodać boty do swojego Zulipa.

**customization**: personalizacja, _kastomizacja_ could be too awkward
and _dostosowanie do potrzeb klienta_ is too long

example:

You can personalize Zulip in many ways, e.g., by pinning certain streams.

> Możesz spersonalizować Zulipa na wiele sposobów, np. przypinając niektóre kanały.

**emoji**: emoji, both in singular and plural, _ikona emoji_ is a pleonasm

example:

Zulip supports emoji both in messages and as reactions.

> Zulip wspiera używanie emoji w wiadomościach i jako reakcje.

**filter**: filtr (noun) and filtrowanie (verb)

example:

You can filter the messages by searching for relevant terms.

> Możesz przefiltrować wiadomości poprzez wyszukiwanie.

**group DM**: czat grupowy, different from _wiadomość_ since the usage
of _czat grupowy_ seems more common

example:

You can start a group DM with users in your organization.

> Możesz rozpocząć czat grupowy z użytkownikami w Twojej organizacji.

**integration**: integracja

example:

Zulip supports multiple third-party integrations.

> Zulip wspiera wiele zewnętrznych integracji.

**I want**: chcę

example:

I want to change my password.

> Chcę zmienić hasło.

**invalid**: niepoprawny/a

example:

Invalid command.

> Niepoprawna instrukcja.

**me**: me, no translation since it's used as `/me`

example:

You can use `/me` to write a reaction message.

> Możesz napisać wiadomość w formie komentarza poprzez użycie `me`.

**mention**: oznaczenie (noun) and oznaczyć (verb)

example:

You can mention other Zulip users by using @.

> Możesz oznaczyć innych użytkowników Zulipa używając @.

**message**: wiadomość

example:

You got a new message.

> Masz nową wiadomość.

**message table**: lista wiadomości

example:

The middle column in Zulip is a message table of all messages in current narrow.

> Środkowa kolumna w Zulipie zawiera listę wiadomości w wybranym widoku.

**muting a stream/topic**: wyciszenie kanału/wątku
**unmuting a stream/topic**: wyłącz wyciszenie kanału/wątku

example:

You can mute any topic in Zulip through the left-side panel.

> Możesz wyciszyć dowolny wątek w Zulipie używając menu kontekstowego po lewej.

**narrow**: widok (noun) and zawęzić (verb)

example:

You can narrow the messages to any stream, topic or search results.

> Możesz zawęzić wiadomości do wybranego kanału, wątku lub wyników wyszukiwania.

**notification**: powiadomienie

example:

Turn on notifications.

> Włącz powiadomienia.

**person**: osoba, najczęściej użytkownik
**people**: osoby, najczęściej użytkownicy

**pinning**: przypięcie (noun) and przypiąć (verb)

example:

You can pin streams in the left-side panel.

> Możesz przypiąć wybrane kanały w menu kontekstowym po lewej.

**direct message**: Wiadomość bezpośrednia

example:

You can send a direct message to other users in your organization.

> Możesz wysłać bezpośrednią wiadomość do innych użytkowników w Twojej organizacji.

**DM**: DM, translation could be confusing

example:

Direct messages are often abbreviated to DM.

> Wiadomości bezpośrednie są też nazywane DMami, od angielskiego "direct message".

**private stream**: prywatny kanał
**public stream**: publiczny kanał

example:

Join a private stream.

> Dołącz do prywatnego kanału.

**search**: wyszukiwanie (noun) and wyszukaj (verb)

example:

Zulip allows you to search messages in all streams and topics you are
subscribed to.

> Zulip pozwala na wyszukiwanie wiadomości we wszystkich subskrybowanych kanałach
> i wątkach.

**starred message**: oznaczona wiadomość (noun)
**star**: oznaczyć

example:

You starred this message.

> Ta wiadomość została oznaczona.

**stream**: kanał, similar to a tv channel - _strumień_ sounds a bit artificial

example:

You can create new streams in Zulip.

> Możesz tworzyć nowe kanały w Zulipie.

**subscribing to a stream**: (za)subskrybowanie kanału (noun) and
(za)subskrybować kanał (verb), perfective form depending on the
context

examples:

Subscribe to a stream.

> Zasubskrybuj kanał.

You are not subscribed to this stream.

> Nie subskrybujesz tego kanału.

**topic**: wątek

example:

Add a new topic.

> Dodaj nowy wątek.

**unsubscribing from a stream**: odsubskrybowanie kanału (noun) and
odsubskrybować kanał (verb)

example:

You have unsubscribed from this stream.

> Odsubskrybowano kanał.

**user**: użytkownik

example:

Zulip supports an unlimited number of users in an organization.

> Zulip nie limituje liczby użytkowników w organizacji.

**view**: widok, see: **narrow**
```

--------------------------------------------------------------------------------

---[FILE: russian.md]---
Location: zulip-main/docs/translating/russian.md

```text
# Russian translation style guide

Вот некоторые правила, которых стоит придерживаться для поддержания
качества перевода. Они продиктованы опытом - собственным и коллег,
здравым смыслом и техническими особенностями продукта.

- Переводите you, как "вы", не как "Вы"
- Не используйте "ё"
- Не переводите Zulip
- Избегайте IT-жаргонизмы и кальки. Например, не приватный, а личный;
  не email, а электронная почта / адрес электронной почты.
- Фразы должны правильно читаться и передавать исходный смысл. Для
  этого анализируйте контекст фразы.
- Вместо изобретения собственных терминов, используйте устоявшиеся
  фразы из других чатов: Slack, VKontakte, Skype - то, к чему уже
  привыкли люди.

## Перевод некоторых терминов

- login - **войти**
- sign up - **зарегистрироваться**
- stream - **канал**
- organization - **организация**
- message - **сообщение**
- messages - **переписка**
- conversation - **беседа**
- chat - **чат**
- send - **отправить**
- email - **адрес электронной почты**
- feedback - **обратная связь**
- user - **пользователь**
- topic - **тема**
- narrow - **показать только**
- narrowing - **уточнение**
- private - **личный**
- alert word - **сигнальное слово**
- upload - **загрузить**
- uploads - **файлы**
- settings - **настройки**
- invalid - **неверный**
- incorrect - **неправильный**
- unknown - **неизвестный**
- account - **учетная запись**
- subdomain - **поддомен**
- API key - **API-ключ**
- recipient - **получатель**
- subscriber - **участник**
- invite-only - **закрытый**
- public - **открытый**
- name - **название** for things, **имя** for people
- id - **код**
- notifications - **оповещения**
- @-mentions - **@-упоминания**
- mute - **заглушить**
- emoji - **эмодзи**
- user - **пользователь**
- compose - **написать**
- custom - **дополнительный**
- home view - **общий список сообщений**
```

--------------------------------------------------------------------------------

---[FILE: spanish.md]---
Location: zulip-main/docs/translating/spanish.md

```text
# Spanish translation style guide

Use informal Spanish for translation:

- Informal "you" (_tú_) instead of formal form _usted_. Many top software
  companies (e.g., Google) use the informal one, because it's much more common in
  the daily language and avoids making translations look like they were written
  by machines.

- Imperative, active, and continuous verbs, e.g., _manage streams_ -
  _gestionar canales_, not _gestión de canales_.

- Not using reflexive _se_ e.g., _log out_ should be _salir_, not _salirse_,
  whenever the infinitive form is possible without making the translation
  awkward.

- Warm and friendly phrasing whenever appropriate.

- No slang or regional phrases that could be unclear or too informal.

- Balance common verbs and nouns with specific IT-related translations
  of English terms - this can be tricky, try to check how other
  resources were translated (e.g., Gmail, Microsoft websites, Facebook)
  to decide what wouldn't sound awkward / rude in Spanish.

- Latest RAE rule ("solo" should
  [**never**](https://www.rae.es/espanol-al-dia/el-adverbio-solo-y-los-pronombres-demostrativos-sin-tilde)
  have accent, even when it can be replaced with "solamente").

Some terms are very tricky to translate, so be sure to communicate
with other Spanish speakers in the community. It's all about making
Zulip friendly and usable.

## Términos

- Message - **Mensaje**
- Direct message (DM) - **Mensaje directo (MD)**
- Group DM - **Mensaje directo grupal**: many users may not associate "MD" with
  _direct message_ in a group context, so it's better to use the unabbreviated
  form rather than "MD grupal".
- Stream - **Canal**: the use of the literal Spanish word for stream
  "Flujo" is very confusing and not the correct metaphor for Spanish
  speaking people. The correct term would be "canal" (_channel_).
- Topic - **Tema**
- Private/invite-only stream - **Canal privado/limitado por invitación**: (lit.
  _channel limited by invitation_)
- Public stream - **Canal público**
- Bot - **Bot**
- Embedded bot - **Bot integrado**
- Interactive bot - **Bot interactivo**
- Integration - **Integración**
- Notification - **Notificación**
- Alert word - **Alerta**: this is only _alert_. Nonetheless, adding _word_ may
  make the term confusing (something like _danger!_ could be a "palabra de
  alerta" as well). Google Alerts uses "alerta" in its Spanish translation.
- View - **Vista**
- Filter - **Filtro**: as used with narrowing (see below).
- Home - **Inicio**: we never use the term "Hogar" (literally home) in Spanish.
- Emoji - **Emoticono** (plural: **emoticonos**)
- Slash command - **/comando**
- Webhook - **Webhook**
- Endpoint - **Endpoint**

## Frases

- Subscribe/Unsubscribe to a stream - **Suscribir a/Desuscribir de un canal**
- Narrow to - **Buscar solo**: this translates to _search only_. We use this
  term because there's no other word that's common enough in Spanish for
  _to narrow_ except for "filtrar", but this word can be incorrectly
  interpreted as _filter out_. We should stick to a term that we can use
  unambiguously and consistently for all instances of _Narrow to_.
- Mute/Unmute - **Silenciar/No silenciar**
- Deactivate/Reactivate - **Desactivar/Reactivar**
- Search - **Buscar**
- Pin - **Fijar** (lit. _to fixate_)
- Mention/@mention - **Mencionar/@mención**
- Invalid - **Inválido**
- Customization - **Personalización**
- I want - **Yo quiero**
- User - **Usuario**
- Person/People - **Persona/Personas**: "personas" is the correct plural for
  "person", but when talking of _people_ referring to it as a crowd, we use
  "gente" instead.

## Otros

- You - **Tú**: also "vosotros" if it's in plural.
- We - **Nosotros**
- Message table - **Tablón de mensajes**
- Enter/Intro - **Enter/Intro**
```

--------------------------------------------------------------------------------

---[FILE: translating.md]---
Location: zulip-main/docs/translating/translating.md

```text
# Translation guidelines

Zulip has full support for Unicode (and partial support for RTL
languages), so you can use your preferred language everywhere in
Zulip.

Additionally, the Zulip UI is translated into more than a dozen major
languages, including Spanish, German, Hindi, French, Chinese, Russian,
and Japanese, and we're always excited to add more. If you speak a
language other than English, your help with translating Zulip would be
greatly appreciated!

If you are interested in knowing about the technical end-to-end
tooling and processes for tagging strings for translation and syncing
translations in Zulip, read about [Internationalization for
Developers](internationalization.md).

## Translators' workflow

These are the steps you should follow if you want to help translate
Zulip:

1. Join [#translation][translation-channel] in the [Zulip development
   community server](https://zulip.com/development-community/), and say hello.
   That channel is also the right place for any questions, updates on your
   progress, reporting problematic strings, etc.

1. [Sign up for Weblate](https://hosted.weblate.org/accounts/register/).

   :::{note}
   Unless you plan to contribute country-specific translations, do not
   select a country-specific language in the **Languages** list when
   you sign up. E.g., use **English (United Kingdom) (en_GB)** if you
   plan to translate Zulip into UK English, but select **Spanish
   (es)** rather than **Spanish (Colombia) (es_CO)** for general
   Spanish translations.
   :::

1. Navigate to the [Zulip project on Weblate](https://hosted.weblate.org/projects/zulip/).

1. Choose the language you'd like to translate into; your preferred
   languages should be at the top.

1. Optionally, use the "Components" tab at the top to translate only
   part of the project. Zulip has several different components, split
   up by where they are used:

   - `Flutter` is used for the mobile app.
   - `Desktop` is for the parts of the Zulip desktop apps that are not
     shared with the Zulip web app. This is a fairly small number of
     strings.
   - `Django` and `Frontend` have strings for the next major release
     of the Zulip server and web app (which is what we run on
     chat.zulip.org and Zulip Cloud).
   - The variants of `Django` and `Frontend` with names
     ending with a version, like `(10.x)`, are strings for Zulip's
     current [stable release series](../overview/release-lifecycle.md).

   Weblate is smart about only asking you to translate a string once
   even if it appears in multiple resources. The `(10.x)` type variants
   allow translators to get a language to 100% translated for the
   current release.

1. Click the "Translate" button to begin translating. Refer to
   [Weblate's
   documentation](https://docs.weblate.org/en/latest/user/translating.html#translating)
   for how to translate each string.

1. If possible, test your translations (details below).

1. Ask in Zulip for a maintainer to merge the strings from Weblate,
   and deploy the update to chat.zulip.org so you can verify them in
   action there.

Some useful tips for your translating journey:

- Follow your language's [translation guide](#translation-style-guides).
  Keeping it open in a tab while translating is very handy. If one
  doesn't exist one, write one as you go; they're easiest to write as
  you go along and will help any future translators a lot.

- Use, and update, the [Weblate
  glossary](https://hosted.weblate.org/projects/zulip/glossary/) for
  your language. This will help by providing consistent, inline
  translation references for terms (e.g., "channel") which are used
  repeatedly throughout the application.

- Don't translate variables or code (usually preceded by a `%`, inside
  HTML tags `<...>`, or enclosed in braces like `{variable}`); just
  keep them verbatim.

- When context is unclear, you may find it helpful to follow the
  "Source string location" link in the right sidebar of the Weblate
  UI.

- When in doubt, ask for context in
  [#translation](https://chat.zulip.org/#narrow/channel/58-translation) in
  the [Zulip development community server](https://zulip.com/development-community/).

- Pay attention to capital letters and punctuation. Details make the
  difference! Weblate will catch, and warn about, some cases of
  mismatched punctuation.

- Take advantage of Weblate's [key
  bindings](https://docs.weblate.org/en/latest/user/translating.html#keyboard-shortcuts)
  for efficiency.

- While one should definitely prioritize translating the `Frontend`
  and `Flutter` components, since the most prominent user-facing
  strings are there, API error messages in `Django` are presented to
  users, so a full translation should include them.

### Testing translations

This section assumes you have a
[Zulip development environment](../development/overview.md) set up;
if setting one up is a problem for you, ask in chat.zulip.org and we
can usually just deploy the latest translations there.

1. Add the Weblate remote to your Git repository:

   ```shell
   git remote add weblate https://hosted.weblate.org/git/zulip/django/
   ```

1. Merge the changes into your local repository:

   ```shell
   git cherry-pick weblate/main ^upstream/main
   ```

There are a few ways to see your translations in the Zulip UI:

- You can insert the language code as a URL prefix. For example, you
  can view the login page in German using
  `http://localhost:9991/de/login/`. This works for any part of the
  Zulip UI, including portico (logged-out) pages.
- For Zulip's logged-in UI (i.e. the actual web app), you can [pick the
  language](https://zulip.com/help/change-your-language) in the
  Zulip UI.
- If your system has languages configured in your OS/browser, Zulip's
  portico (logged-out) pages will automatically use your configured
  language. Note that we only tag for translation strings in pages
  that individual users need to use (e.g., `/login/`, `/register/`,
  etc.), not marketing pages like `/features/`.
- In case you need to understand how the above interact, Zulip figures
  out the language the user requests in a browser using the following
  prioritization (mostly copied from the Django docs):

  1. It looks for the language code as a URL prefix (e.g., `/de/login/`).
  1. It looks for the cookie named 'django_language'. You can set a
     different name through the `LANGUAGE_COOKIE_NAME` setting.
  1. It looks for the `Accept-Language` HTTP header in the HTTP request
     (this is how browsers tell Zulip about the OS/browser language).

- Using an HTTP client library like `requests`, `cURL` or `urllib`,
  you can pass the `Accept-Language` header; here is some sample code to
  test `Accept-Language` header using Python and `requests`:

  ```python
  import requests
  headers = {"Accept-Language": "de"}
  response = requests.get("http://localhost:9991/login/", headers=headers)
  print(response.content)
  ```

  This can occasionally be useful for debugging.

### Machine translation

Weblate has [built-in machine translation
capabilities](https://docs.weblate.org/en/latest/admin/machine.html).
If machine translation is enabled for your language, you can generate one by
clicking the **Automatic suggestions** tab below the translation box.

Bear in mind that we expect human-quality translations for
Zulip. While machine translation can be a helpful aid, please be sure
to review all machine translated strings.

### Translation style guides

We maintain translation style guides for Zulip, giving guidance on how
Zulip should be translated into specific languages (e.g., what word to
translate words like "channel" to), with reasoning, so that future
translators can understand and preserve those decisions:

- [Chinese](chinese.md)
- [Finnish](finnish.md)
- [French](french.md)
- [German](german.md)
- [Hindi](hindi.md)
- [Japanese](japanese.md)
- [Polish](polish.md)
- [Russian](russian.md)
- [Spanish](spanish.md)

We encourage this information to also be placed in [Weblate's
glossary](https://hosted.weblate.org/projects/zulip/glossary/), which
will help provide inline suggestions when translating.

Some translated languages don't have these, but we highly encourage
translators for new languages (or those updating a language) write a
style guide as they work, since it's easy to take notes as you
translate, and doing so greatly increases the ability of future
translators to update the translations in a consistent way. See [our
docs on this documentation](../documentation/overview.md) for how to
submit your changes.

### Capitalization

We expect that all the English translatable strings in Zulip are
properly capitalized in a way consistent with how Zulip does
capitalization in general. This means that:

- The first letter of a sentence or phrase should be capitalized.
  - Correct: "Channel settings"
  - Incorrect: "Channel Settings"
- All proper nouns should be capitalized.
  - Correct: "This is Zulip"
  - Incorrect: "This is zulip"
- All common words like URL, HTTP, etc. should be written in their
  standard forms.
  - Correct: "URL"
  - Incorrect: "Url"

The Zulip test suite enforces these capitalization guidelines in the
web app codebase [in our test
suite](../testing/testing.md#other-test-suites)
(`./tools/check-capitalization`; `tools/lib/capitalization.py` has
some exclude lists, e.g., `IGNORED_PHRASES`).

[translation-channel]: https://chat.zulip.org/#narrow/channel/58-translation
```

--------------------------------------------------------------------------------

---[FILE: urdu.md]---
Location: zulip-main/docs/translating/urdu.md

```text
# Urdu translation style guide(انداذِ ترجمہ کا رہنما)

Use semi-formal Urdu for translation:

- Formal "you" (_آپ_) instead of informal form _تم_. Many top software
  companies (e.g., Google, Facebook, Microsoft) use the formal one, because it's typically
  considered rude to use the informal one without an established acquaintance with someone.

- Imperative, active, and continuous verbs, e.g., _manage streams_ -
  _سٹریمس کی رہنمائ کریں_, not _سٹریمس کی رہنمائ_.

- Warm and friendly phrasing whenever appropriate.

- No slang or regional phrases that could be unclear or too informal.

- Balance common verbs and nouns with specific IT-related translations
  of English terms - this can be tricky, try to check how other
  resources were translated (e.g., Gmail, Microsoft websites, Facebook)
  to decide what wouldn't sound awkward/rude in Urdu.

Some terms are very tricky to translate, so be sure to communicate
with other Urdu speakers in the community. It's all about making
Zulip friendly and usable.

## Terms(اصطلاحات)

- Message - **پیغام**
- Direct message (DM) - **براہ راست پیغام**
- Stream - **سٹریم**
- Topic - **موضوع**
- Private/invite-only stream - **ذاتی / دعوت کی ضرورت والی سٹریم**
- Public stream - **عوامی سٹریم**
- Bot - **بوٹ**
- Integration - **انضمام**
- Notification - **اطلاع**
- Alert word - **الفاظِ چوکس**: this literally translate to "word(s) to remain vigilant of".
- View - **دیکھیں**
- Filter - **فلٹر**: as used with narrowing (see below).
- Home - **ھُوم**: using the literal translation--"گھر" (literally home)--would seem out of place.
- Emoji - **ایموجی**

## Phrases (فِقْرے)

- Narrow to - **محدود کریں**: the literal Urdu translation is "تنگ کریں" which may end up being
  interpreted as its more common meaning which is incorrect here. The correct phrase is
  "محدود کریں".
- Subscribe/Unsubscribe to a stream - **سٹریم کو سبسکرائب ی / اَنسبسکرائب**
- Mute/Unmute - **خاموش کریں / نا خاموسش کریں**
- Deactivate/Reactivate - **فعال کریں/غیر فعال کریں**
- Search - **تلاش کریں**
- Pin - **پن کریں**
- Mention/@mention - **زکر کریں / @زکر کریں**
- Invalid - **غلط**
- Customization - **ضرورت کے مطابق بنانا**
- I want - **مجھےچاھءے**
- User - **صارف**
- Person/People - **شخص / لوگ**

## Others(مختلف دیگر)

- We - **ہم**
- Message table - **پیغام بورڈ**
- Enter/Intro - **تعارف / درج**
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/tutorials/index.md

```text
# Developer tutorials

```{toctree}
---
maxdepth: 3
---

new-feature-tutorial
writing-views
life-of-a-request
reading-list
screenshot-and-gif-software
shell-tips
```
```

--------------------------------------------------------------------------------

````

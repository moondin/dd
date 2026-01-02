---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 286
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 286 of 1290)

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

---[FILE: testing.md]---
Location: zulip-main/docs/testing/testing.md

```text
# Testing overview

Zulip takes pride in its extensive, carefully designed test suites.
For example, `test-backend` runs a complete test suite (~98% test
coverage; 100% on core code) for the Zulip server in under a minute on
a fast laptop; very few web apps of similar scope can say something
similar.

This page focused on the mechanics of running automated tests in a
[development environment](../development/overview.md); you may also
want to read about our [testing philosophy](philosophy.md)
and [continuous integration
setup](continuous-integration.md).

Manual testing with a web browser is primarily discussed in the docs
on [using the development environment](../development/using.md).

## Running tests

Zulip tests must be run inside a Zulip development environment; if
you're using Vagrant, you may need to enter it with `vagrant ssh`.

You can run all of the test suites (similar to our continuous integration)
as follows:

```bash
./tools/test-all
```

However, you will rarely want to do this while actively developing,
because it takes a long time. Instead, your edit/refresh cycle will
typically involve running subsets of the tests with commands like these:

```bash
./tools/lint zerver/models/__init__.py # Lint the file you just changed
./tools/test-backend zerver.tests.test_markdown.MarkdownEmbedsTest.test_inline_youtube
./tools/test-backend MarkdownEmbedsTest # Run `test-backend --help` for more options
./tools/test-js-with-node util
# etc.
```

The commands above will all run in just a few seconds. Many more
useful options are discussed in each tool's documentation (e.g.,
`./tools/test-backend --help`).

## Major test suites

Zulip has a handful of major tests suite that every developer will
eventually work with, each with its own page detailing how it works:

- [Linters](linters.md): Our dozen or so linters run in parallel.
- [Django](testing-with-django.md): Server/backend Python tests.
- [Node](testing-with-node.md): JavaScript tests for the
  frontend run via node.js.
- [Puppeteer](testing-with-puppeteer.md): End-to-end
  UI tests run via a Chromium browser.

## Other test suites

Additionally, Zulip also has about a dozen smaller tests suites:

- `tools/test-migrations`: Checks whether the `zerver/migrations`
  migration content the models defined in `zerver/models/*.py`. See our
  [schema migration documentation](../subsystems/schema-migrations.md)
  for details on how to do database migrations correctly.
- `tools/test-documentation`: Checks for broken links in this
  ReadTheDocs documentation site.
- `tools/test-help-documentation`: Checks for broken links in the
  `/help/` help center documentation, and related pages.
- `tools/test-api`: Tests that the API documentation at `/api`
  actually works; the actual code for this is defined in
  `zerver/openapi/python_examples.py`.
- `tools/check-capitalization`: Checks whether translated strings (aka
  user-facing strings) correctly follow Zulip's capitalization
  conventions. This requires some maintenance of an exclude list
  (`tools.lib.capitalization.IGNORED_PHRASES`) of proper nouns
  mentioned in the Zulip project, but helps a lot in avoiding new
  strings being added that don't match our style.
- `tools/check-frontend-i18n`: Checks for a common bug in Handlebars
  templates, of using the wrong syntax for translating blocks
  containing variables.
- `./tools/test-run-dev`: Checks that `run-dev` starts properly;
  this helps prevent bugs that break the development environment.
- `./tools/test-queue-worker-reload`: Verifies that Zulip's queue
  processors properly reload themselves after code changes.
- `./tools/setup/optimize-svg`: Checks whether all integration logo SVG
  graphics are optimized.
  logos are properly optimized for size (since we're not going to edit
  third-party logos, this helps keep the Zulip codebase from getting huge).
- `./tools/test-tools`: Automated tests for various parts of our
  development tooling (mostly various linters) that are not used in
  production.

Each of these has a reason (usually, performance or a need to do messy
things to the environment) why they are not part of the handful of
major test suites like `test-backend`, but they all contribute
something valuable to helping keep Zulip bug-free.

## Internet access inside test suites

As a policy matter, the Zulip test suites should never make outgoing
HTTP or other network requests. This is important for 2 major
reasons:

- Tests that make outgoing Internet requests will fail when the user
  isn't on the Internet.
- Tests that make outgoing Internet requests often have a hidden
  dependency on the uptime of a third-party service, and will fail
  nondeterministically if that service has a temporary outage.
  Nondeterministically failing tests can be a big waste of
  developer time, and we try to avoid them wherever possible.

As a result, Zulip's major test suites should never access the
Internet directly. Since code in Zulip does need to access the
Internet (e.g., to access various third-party APIs), this means that
the Zulip tests use mocking to basically hardcode (for the purposes of
the test) what responses should be used for any outgoing Internet
requests that Zulip would make in the code path being tested.

This is easy to do using test fixtures (a fancy word for fixed data
used in tests) and the `mock.patch` function to specify what HTTP
response should be used by the tests for every outgoing HTTP (or other
network) request. Consult
[our guide on mocking](testing-with-django.md#zulip-mocking-practices) to
learn how to mock network requests easily; there are also a number of
examples throughout the codebase.

We partially enforce this policy in the main Django/backend test suite
by overriding certain library functions that are used in outgoing HTTP
code paths (`httplib2.Http().request`, `requests.request`, etc.) to
throw an exception in the backend tests. While this is enforcement is
not complete (there a lot of other ways to use the Internet from
Python), it is easy to do and catches most common cases of new code
depending on Internet access.

This enforcement code results in the following exception:

```pytb
File "tools/test-backend", line 120, in internet_guard
  raise Exception("Outgoing network requests are not allowed in the Zulip tests."
Exception: Outgoing network requests are not allowed in the Zulip tests.
...
```

#### Documentation tests

The one exception to this policy is our documentation tests, which
will attempt to verify that the links included in our documentation
aren't broken. Those tests end up failing nondeterministically fairly
often, which is unfortunate, but there's simply no other correct way
to verify links other than attempting to access them. The compromise
we've implemented is that in CI, these tests only verify links to
websites controlled by the Zulip project (zulip.com, our GitHub,
our ReadTheDocs), and not links to third-party websites.
```

--------------------------------------------------------------------------------

---[FILE: typescript.md]---
Location: zulip-main/docs/testing/typescript.md

```text
# TypeScript static types

Zulip is early in the process of migrating our codebase to use
[TypeScript](https://www.typescriptlang.org/), the leading static type
system for JavaScript. It works as an extension of the ES6 JavaScript
standard, and provides similar benefits to our use of
[the mypy static type system for Python](mypy.md).

We expect to eventually migrate the entire JavaScript codebase to
TypeScript, though our current focus is on getting the tooling and
migration process right, not on actually migrating the codebase.

As a result, the details in this document are preliminary ideas for
discussion and very much subject to change.

A typical piece of TypeScript code looks like this:

```ts
setdefault(key: K, value: V): V {
    const mapping = this._items[this._munge(key)];
    if (mapping === undefined) {
        return this.set(key, value);
    }
    return mapping.v;
}
```

The following resources are valuable for learning TypeScript:

- The main documentation on [TypeScript syntax][typescript-handbook].

## Type checking

TypeScript types are checked by the TypeScript compiler, `tsc`, which
is run as part of our [lint checks](linters.md). You can run the
compiler yourself with `tools/run-tsc`, which will check all the
TypeScript files once, or `tools/run-tsc --watch`, which will
continually recheck the files as you edit them.

## Linting and style

We use the ESLint plugin for TypeScript to lint TypeScript code, just
like we do for JavaScript. Our long-term goal is to use an idiomatic
TypeScript style for our TypeScript codebase.

However, because we are migrating an established JavaScript codebase,
we plan to start with a style that is closer to the existing
JavaScript code, so that we can easily migrate individual modules
without too much code churn. A few examples:

- TypeScript generally prefers explicit `return undefined;`, whereas
  our existing JavaScript style uses just `return;`.
- With TypeScript, we expect to make heavy use of `let` and `const`
  rather than `var`.
- With TypeScript/ES6, we may no longer need to use `_.each()` as our
  recommended way to do loop iteration.

For each of the details, we will either want to bulk-migrate the
existing JavaScript codebase before the migration or plan to do it
after JS->TS migration for a given file, so that we don't need to
modify these details as part of converting a file from JavaScript to
TypeScript.

A possibly useful technique for this will be setting some eslint
override rules at the top of individual files in the first commit that
converts them from JS to TS.

## Migration strategy

Our plan is to order which modules we migrate carefully, starting with
those that:

- Appear frequently as reverse dependencies of other modules
  (e.g., `people.js`). These are most valuable to do first because
  then we have types on the data being interacted with by other
  modules when we migrate those.
- Don't have large open pull requests (to avoid merge conflicts); one
  can scan for these using [TinglingGit](https://github.com/zulip/TinglingGit).
- Have good unit test coverage, which limits the risk of breaking
  correctness through refactoring. Use
  `tools/test-js-with-node --coverage` to get a coverage report.

When migrating a module, we want to be especially thoughtful about
putting together a commit structure that makes mistakes unlikely and
the changes easy to verify. For example:

- First a commit that just converts the language to TypeScript adding
  types. The result may potentially have some violations of the
  long-term style we want (e.g., not using `const`). Depending on how
  we're handling linting, we set some override eslint rules at the top
  of the module at this stage so CI still passes.
- Then a commit just migrating use of `var` to `const/let` without
  other changes (other than removing any relevant linter overrides).
- Etc.

With this approach, we should be able to produce a bunch of really
simple commits that can be merged the same day they're written without
significant risk of introducing regressions from typos, refactors that
don't quite work how they were expected to, etc.

[typescript-handbook]: https://www.typescriptlang.org/docs/handbook/basic-types.html
```

--------------------------------------------------------------------------------

---[FILE: chinese.md]---
Location: zulip-main/docs/translating/chinese.md

```text
# Chinese translation style guide(中文翻译指南)

## Note(题记)

The language style of Zulip is a little colloquial, while the Chinese
translation prefers a formal style and also avoids stereotypes. Since
Zulip is a modern internet application, many Chinese translations are
borrowed from the popular Web software, such as WeiBo, WeChat, QQ
Mail etc. that most Chinese users are familiar with.

Zulip 的文风比较口语化，考虑到大多数中国用户的习惯，翻译时的语言习惯稍
微正式了一点，但也尽量避免刻板。Zulip 是一款时尚的互联网应用，翻译时也
借鉴了中国用户熟悉的微博、微信、QQ 邮箱等软件的用语习惯，以期贴近用户。

## Terms(术语)

- Message - **消息**

"Message" can be literally translated as "消息" and "信息", both
OK. Here "消息" is chosen for translation. For example, "Stream
Message" is translated as "频道消息", while "Direct Message" is
translated as "直信". The domestic WeiBo, WeChat also keep in line
with the habit. "Starred Message" is similar to "Star Mail (星标邮件)"
feature in QQ Mail, so it is translated into "星标消息".

Message 可直译为“消息”、“信息”等，两者皆可，这里统一选用“消息”。例如，
“Stream Message”译作“频道消息”；但“Direct Message”又译为“直信"，与国
内微博、微信的使用习惯保持一致。“Starred Message”类似于 QQ 邮箱中的“星标
邮件”功能，这里也借鉴翻译为“星标消息”。

- Stream - **频道**

There were several other optional translations, e.g., "群组(Group)", "
主题(Subject)", and "栏目(Column)". The "频道(Channel)" is in use now,
which is inspired by the chat "Channel" in the game Ingress. Since
"Stream" can be "Created/Deleted" or "Subscribed/Unsubscribed",
"Stream" can also initiate a "Topic" discussion, the meanings of "频道
(Channel) are closer to "Stream" than others. Another translation is "
讨论组", which is a term of QQ, in which it is a temporary chat
group. However, "讨论组" has one more Chinese character than "频道
(Channel)".

曾经使用的翻译有“群组”、“主题”、“版块”，还有“栏目”。现在选择的“频道”灵
感来源于 Ingress 游戏中的聊天“Channel”。因为“Stream”可以“新建/删除
（Create/Delete）”、也可以“订阅/退订（Subscribe/Unsubscribe）”，
“Stream”内部还可以发起“话题（Topic）讨论。“Stream”还有一个备选方案，就
是“讨论组”，字多一个，稍微有点啰嗦。主要参考自以前 QQ 的“讨论组”，在 QQ 中
是一种临时的群组。

- Topic - **话题**

- Invite-Only/Public Stream - **私有/公开频道**

"Invite-Only Stream" requires users must be invited explicitly to
subscribe, which assures a high privacy. Other users cannot perceive
the presence of such streams. Since literal translation is hard to
read, it is translated sense to sense as "私有频道(Private Stream)"。

“Invite-Only Stream”是需要频道内部用户邀请才能订阅的频道；“Invite-Only
Stream”具有非常好的私密性，用户在没有订阅时是不能感知这类频道的存在的。
直译读起来有点拗口，因此选择译为“私有频道”。

- Bot - **机器人**

- Integration - **应用整合**

"Integration" is literally translated as "集成" or "整合". It means
integrating Zulip production with other applications and services. For
integrity in Chinese expression, it is translated as "应用整合
(Application Integration)".

“Integration”原意为“集成”与“整合”，这里表示将其它的应用或者服务与 Zulip
实现整合。为表达意思完整，补充翻译为“应用整合”。

- Notification - **通知**

- Alert Word - **提示词**

## Phrases(习惯用语)

- Subscribe/Unsubscribe - **订阅/退订**

The perfect tense subscribed/unsubscribed is translated as "已订阅/已
退订". Sometimes "Join" is used to express the same meanings as
"Subscribe", also be translated as "订阅(Subscribe)".

完成时态译为“已订阅（Subscribed）”和“已退订（Unsubscribed）”。有时，
“Join”也会用来表达与“Subscribe”相同的意思，也一并翻译为“订阅”。

- Narrow to ... - **筛选**

"Narrow to" is translated as "筛选(Filter by)" for now, based on two considerations:

1. In Chinese, the word "筛选(Filter)" means a way to select according
   to the specific conditions. "Narrow to ..." means "to narrow the
   scope of ...". The two words share the common meanings.

2. "筛选" is a common computer phrase and has been well
   accepted by public, e.g., the "Filter(筛选)" feature in Microsoft
   Excel.

In addition, in the searching context "Narrow to ..." is not
translated as "筛选(Filter)" but as "搜索(Search)" because of
readability considerations.

这里暂且翻译为“筛选”。主要有两点考虑：

1. 在汉语中，“筛选”表示按照指定条件进行挑选的方式。“Narrow to ...”的含
   义为“使...缩小范围”，两者有一定共通性。

2. “筛选”也是比较大众化的计算机用语，易于为大家所接受。例如 Microsoft
   Excel 中的“筛选”功能。

另外，在搜索功能的语境中，“Narrow to ...”没有翻译为“筛选”，而翻译为“搜
索”，这是出于可读性的考虑。

- Mute/Unmute - **开启/关闭免打扰**

"Mute" is mostly translated as "静音(Silent)", which is common in TV
set. Such a translation is not appropriate for Zulip. "开启/关闭免打
扰(Turn off/on Notification)" is a sense to sense translation, which
is also borrowed from the WeChat.

“Mute”常见的中文翻译为“静音”，在电视设备中常见，用在 Zulip 中并不太合适。
这里取意译，与大家常用的微信（WeChat）中“消息免打扰”用语习惯一致。

- Deactivate/Reactivate - **禁用/启用(帐户)，关闭/激活(社区)**

When applied to a user account, translated as "禁用/启用
(Disable/Enable)", for example, "Deactivated users" to "禁用的用户";
when applied to a realm, translated as "关闭/激活(Close/Open)", for
example "Your realm has been deactivated." to "您的社区已关闭".

当应用于用户帐户时，选择翻译为“禁用/启用”，例如“Deactivated users”翻译
为“禁用的用户”；当应用于“社区”（Realm）时，选择翻译为“关闭/激活”，如
“Your realm has been deactivated.”翻译为“您的社区已关闭”。

- Invalid - **不正确**

"Invalid" is mainly used in exception information, which is uncommon
for general users. Other translations "错误(Error)", "非法(Illegal)",
"不合法(Invalid)" are all ok. Generally, it is translated as "不正确
(Incorrect)" for consistency. For example, "Invalid API key" is
translated as "API 码不正确".

“Invalid”大部分用于一些异常信息，这些信息普通用户应该很少见到。可选翻
译有“错误”、“非法”、“不合法”；为保持一致的习惯，这里统一翻译为“不正确”。
例如“Invalid API key”翻译为“API 码不正确”。

- I want - **开启**

Mainly used in the settings page, literally translated as "I want to
...", which is colloquial and inappropriate in Chinese expression. It
is translated sense to sense as "开启(Turn on some options)".

主要出现在设置页面（Setting Page）中，直译为“我想...”、“我要...”。取直
译过于口语化，并不合乎中文的使用习惯。因此这里取意译，翻译为“开启（某
某功能选项）”。

- User/People/Person - **用户**

All translated as "用户(User)".

统一翻译为“用户”。

## Others(其它)

- You/Your - **您/您的**

It is translated as 您/您的(You/Your) rather than "你/你的(You/Your)",
so as to express respect to the user.

出于尊重用户的目的，翻译为敬语“您/您的”，而不翻译为“你/你的”。

- We - **我们（或不翻）**

"We" is generally translated as the first person "我们(We)", while in
formal Chinese, extensive use of "We" is relatively rare. So in many
times and places it can be ignored not to translate or transforming
expression. For example, "Still no email? We can resend it" is
translated as "仍然没有收到邮件？点击重新发送(Still no email? Click to
resend.)".

一般翻译为第一人称“我们”；但也有不少地方选择不翻译，因为在中文使用习惯
中，不太以自我为中心，大量使用“我们”的情况比较少。因此有时会有下面这样
翻译：“Still no email? We can resend it” 译为 “仍然没有收到邮件？点击
重新发送”。

- The Exclamation/Dot - (一般省略)

The exclamation appears in many places in Zulip. The tone that the
exclamation expresses should be stronger in Chinese than in
English. So the exclamation can be just deleted when translating or
replaced with the dot, unless you are sure to write it. In addition,
the dot in Chinese (。) often has a bad effect on page layout. It is
recommended to omit the dot, just leave empty at the end of the
sentence or paragraph.

感叹号在 Zulip 中出现非常多，可能英文中感叹号的语气比中文中略轻一点。在
中文翻译建议省略大部分的感叹号。另外，句号在中文排版中比较影响美观，因
此也一般建议省略不翻。句末留空即可。
```

--------------------------------------------------------------------------------

---[FILE: finnish.md]---
Location: zulip-main/docs/translating/finnish.md

```text
# Finnish translation style guide

## Guidelines

Tervetuloa!

Before you start, take a look these instructions we have gathered here
for you to help on your translation journey.

### Word order

Consider translating the same thing with the easiest Finnish possible.
It's not mandatory to follow the English text word by word, as long as
the message is clear.

Eg.

- Click the button below to create the organization and register your
  account. -> Luo organisaatio ja rekisteröi tilisi napsauttamalla
  alla olevaa painiketta.

- Sent! Your message is outside your current narrow. -> Lähetetty!
  Viesti on nykyisen näkymäsi ulkopuolella.

### Grammatical case (Sijamuodot)

Translate using the UI to be sure what is the correct grammatical
case. Basic form of a word might not always be suitable for the
purpose.

Eg.

- Topics marked as resolved -> Ratkaistut aiheet (versus Aiheet, jotka on merkitty ratkaistuiksi)
- View Shortcuts -> Katsel**un** pikanäppäimet

### Loan word (Lainasanat)

Even though it's common to use words formed directly from English, try
to consider also users without IT background, people that don't speak
English and accessibility. User interface should contain these with
minimum amount, but for technical error messages could be preferred.
There are some amount of software related words that are widely used
as loan words.

See section [Terms](#terms) for more details.

### **_Please_**, in error messages

As it might appeal to use correspondence _Ole hyvä ja_, it's not
commonly used in Finnish. We are strict and used to more direct
messaging. Let's not translate _please_ and use instruction format
only. No Finn is going to be offended by this.

Eg.

- Please enter at most 10 emails. -> Lisää korkeintaan 10 sähköpostia.

But

- Yes, please! -> Kyllä, kiitos!

### Zulip word inflection

- in/from Zulip - **Zulipissa** / **Zulipista** / **Zulipin**
- Zulip organization - **Zulip-organisaatio**
- Zulip app - **Zulip-sovellus**

### Your -expression

Finnish language has _form of ownership_ so there shouldn't be need to
thanslate _your_ as _sinun_ but rather use _si_ ending. It might be
considered to leave out as well.

Eg.

- Your organization -> Organisaatio**si**
- Your account -> Tili**si**

But

- You do have active accounts in the following organization(s). ->
  Sinulla ei ole aktiivista tiliä seuraavissa organisaatio(i)ssa.

### Comma

Use commas in whole sentences where it is required. You can use these instructions as help.
[Kotimaisten kielten keskus - pilkku.](http://www.kielitoimistonohjepankki.fi/haku/pilkku/ohje/86)

## Terms

- Administrator - **Järjestelmänvalvoja**
- App - **Sovellus**
- Authorization - **Valtuus**
- Avatar - **Avatar**
- Beta - **Beta**
- Change - **Muuta**
- Cheat sheet - **Lunttilappu**
- Click - **Napsauta**
- Configure - **Määritä**
- Deactivate - **Poista käytöstä**
- Domain - **Verkkotunnus**
- Export - **Poiminta**
- Filter - **Suodata**
- Full member - **Täysivaltainen jäsen**
- Host - **Isäntä**
- Help center - **Tukikeskus**
- ID - **Tunnus**
- Integraatio - **Integraatio**
- Interactive - **Interaktiivinen**
- Invalid - **Virheellinen**
- Moderator - **Moderaattori**
- Mute - **Mykistää**
- Narrow - **Rajaa hakua**
- Notification - **Ilmoitus**
- Topic - **Aihe**
- Organization - **Organisaatio**
- Permission - **Lupa**
- Pin - **Kiinnitä**
- Picker - **Valitsin**
- Plan - **Tilaus**
- DM (direct messages) - **SV (suoraviesti)** - Short version is needed in mobile.
- Reset - **Nollata**
- Save - **Tallenna**
- Stream - **Kanava**
- Subscriber - **Tilaaja**
- Subscription - **Tilaus**
- Subscribe a stream - **Tilaa kanava**
- Subdomain - **Aliverkkotunnus**
- Shortcuts - **Pikanäppäimet**
- Unsubscribe - **Peru tilaus**
- Unsupported - **Ei-tuettu**
- Unresolve - **Merkitse ratkaisemattomaksi**
- Webhook - **Webhook**
- Whoops - **Hupsista**
- Widget - **Widgetti**

## Other

Some translations can be tricky, so please don't hesitate to ask the
community or to contribute to this guide! Thanks for your effort!
```

--------------------------------------------------------------------------------

---[FILE: french.md]---
Location: zulip-main/docs/translating/french.md

```text
# French translation style guide

## Community

In addition to the topic [#translation > French translations][]
in the main "#translation" stream, there is a dedicated stream
[#translation/fr][] for discussing the French translations.
Please join there too and say hello.

[#translation > French translations]: https://chat.zulip.org/#narrow/channel/58-translation/topic/French.20translations
[#translation/fr]: https://chat.zulip.org/#narrow/channel/371-translation.2Ffr

## Rules

- Use of _vous_ instead of _tu_,
- A space before and after a colon and a semi-colon and a space after a dot and a comma,
- Follow english capitalization,
- Prefer the infinitive form of a verb: _Save_ into _Sauver_ (instead of _Sauvez_).

Some translations can be tricky, so please don't hesitate to ask the community or contribute to this guide.

## Terms

- stream - **canal**
- topic - **sujet**
- edit - **modifier**
- email - **courriel**
- upload - **envoyer**
- bot - **robot**
- alert word - **mot alerte**
- emoji - **emoji**
- subscription - **abonnement**
- mute - **rendre muet**/**muet**
- home - **accueil**
- narrow - **restreindre**
- pin - **épingler**
- star - **favori**/**mettre en favori**
- organization - **organisation**
```

--------------------------------------------------------------------------------

---[FILE: german.md]---
Location: zulip-main/docs/translating/german.md

```text
# German translation style guide (Richtlinien für die deutsche Übersetzung)

Thank you for considering to contribute to the German translation!
Before you start writing, please make sure that you have read the
following general translation rules.

## Rules

### Formal or informal?

**Informal.**

Although written German tends to be quite formal, websites in German are
usually following informal netiquette. As Zulip's guides are written
in a more colloquial style, German translations should be rather informal as well.

**Don't use slang or regional phrases in the German translation:**

- Instead of _"So'n Dreck kann jedem mal passieren."_, you could
  say _"Dieser Fehler tritt häufiger auf."_

- "Das ist die Seite, wo der Quelltext steht." - the "_wo_" is regional,
  say _"Das ist die Seite, auf der Quelltext steht."_ instead.

### Gender-inclusive language

**Use gender-inclusive language, placing a _gender colon_
([Gender-Doppelpunkt](https://de.wikipedia.org/wiki/Gender-Doppelpunkt))
where necessary.**

Place the gender colon between the word stem and the feminine ending.

- Instead of _Nutzer_, use _Nutzer:innen_
- Instead of _dieser Nutzer_, use _diese:r Nutzer:in_

**Try to find gender-neutral alternatives before using the gender colon.**

- Instead of _jede:r_, try to use _alle_.

**If a gender-neutral term is readily available, consider using it.**

- Instead of _benutzerdefiniert_, consider using _eigen_.

**In compound nouns, only use the gender colon in the last element, if appropriate.**

- Instead of _Nutzer:innengruppe_ or _Nutzer:innen-Gruppe_, use _Nutzergruppe_.

### Form of address

**Use "Du" instead of "Sie".**

For the reasons provided in [the previous section](#formal-or-informal),
stick to _Du_ (informal) instead of _Sie_ (formal) when addressing
the reader and remember to capitalize _Du_.

### Form of instruction

**Prefer imperative over constructions with auxiliary verbs.**

For instructions, try to use the imperative (e.g., _"Gehe auf die Seite"_ -
_"Go to the page"_) instead of constructions with auxiliary verbs
(e.g., _"Du musst auf die Seite ... gehen"_ - _"You have to go the page ..."_).
This keeps the phrases short, less stiff and avoids unnecessary addressing
of the reader.

### Rules for labels

**Use continuous labels with verbs in infinitive form**

To be consistent with other online platforms, use continuous labels for buttons,
item titles, etc. with verbs in infinitive form,
e.g., _Manage streams_ - _Kanäle verwalten_ instead of _Verwalte Kanäle_.

### Concatenation of words

**Try to avoid it.**

German is famous for its concatenations of nouns
(e.g., _Heizölrückstoßdämpfung_, which means _fuel oil recoil attenuation_).
For the sake of correct rendering and simplicity, you should try to avoid such
concatenations whenever possible, since they can break the layout of the Zulip
frontend. Try to stick to a maximum length of 20 characters and follow your
intuition.

- A term like _Tastaturkürzel_ for _Keyboard shortcuts_ is fine - it is
  shorter than 20 characters and commonly used in web applications.

- A term like _Benachrichtigungsstichwörter_ for _Alert words_ should
  not be used, it sounds odd and is longer than 20 characters.
  You could use "_Stichwörter, die mich benachrichtigen_" instead.

### Anglicisms

**Use them if other web apps do so and a teenager could understand the term.**

Unlike other languages, German happily adapts modern words from English.
This becomes even more evident in internet applications,
so you should not be afraid of using them if they provide an advantage over
the German equivalent. Take the following two examples as a reference:

- Translating _Bot_: Use _Bot_, as a completely accurate German
  equivalent **doesn't** exist (e.g., _Roboter_) and the term _Bot_ is not
  unknown to German speakers.

### Special characters

**Use "ä, ö, ü" and "ß" consistently.**

While _ä, ö, ü_ and _ß_ are more and more being replaced by _ae, oe, ue_
and _ss_ in chats, forums and even websites, German translations
containing umlauts have a more trustworthy appearance.
For capitalizations, you can replace the _ß_ by _ss_.

### False friends

**Watch out!**

A false friend is a word in another language that is spelled
or sounds similar to a word in one's own language,
yet has a different meaning.
False friends for the translation from German to English include
_actually_ - _eigentlich_, _eventually_ - _schließlich_, _map_ - _Karte_, etc.
Make sure to not walk into such a trap.

### Other

- Try to keep words and phrases short and understandable. The front-end
  developers will thank you ;)

- Be consistent. Use the same terms for the same things, even if that
  means repeating. Have a look at other German translations on Zulip
  to get a feeling for the vocabulary.

- Balance common verbs and nouns with specific IT-related translations
  of English terms - this can be tricky, try to check how other resources
  were translated (e.g., Gmail, Microsoft websites, Facebook) to decide
  what wouldn't sound awkward / rude in German.

- For additional translation information, feel free to check out
  [this](https://en.wikipedia.org/wiki/Wikipedia:Translating_German_WP) Wikipedia guide
  on translating German Wikipedia articles into English.

Some terms are very tricky to translate, so be sure to communicate with other German
speakers in the community. It's all about making Zulip friendly and usable.

## Terms (Begriffe)

- Message - **Nachricht**

_"Nachricht" (Facebook, WhatsApp, Transifex)_

- Direct Message (DM), Direct Messages (DMs) - **Direktnachricht (DM), Direktnachrichten (DMs)**

While we try to avoid concatenating words whenever possible, "Direktnachricht" is used
by many other platforms (e.g., X/Twitter, Slack, Discord).
Use _DM_ with its plural form _DMs_ rather than DN/DNs in line with other services.

_"Direktnachricht" (X/Twitter, Slack)_

- Starred Message - **Markierte Nachricht**

We go with "markiert" instead of "gesternt" (which is not even a proper
German word) here, since it comes closer to the original meaning of "starred".

_"Markierte Nachricht" (Gmail, Transifex),
"Nachricht mit Stern" (WhatsApp)_

_"Bereich" (Transifex), "Community" (Google+)_

- Stream - **Stream**

Even though the term **Stream** is not commonly used in German web applications,
it is both understood well enough by many Germans with only little English
skills, and the best choice for describing Zulip's chat hierarchy. The term
"Kanal" wouldn't fit here, since it translates to "channel" - these are used
by other chat applications with a simple, flat chat hierarchy, that is,
no differentiation between streams and topics.

_"Stream" (Transifex), "Kanal" (KDE IRC documentation, various
small German forums)_

- Topic - **Thema**

_(Gmail - for email subjects, Transifex)_

- Public Stream - **Öffentlicher Stream**

While some might find this direct translation a tad long, the alternative
"Offener Stream" can be ambiguous - especially users who are inexperienced
with Zulip could think of this as streams that are online.

_"Öffentlicher Stream" (Transifex)_

- Bot - **Bot**

Not only is "bot" a short and easily memorable term, it is also widely used
in German technology magazines, forums, etc.

_"Bot" (Transifex, Heise, Die Zeit)_

- Integration - **Integration**

While the German translation of "Integration" is spelled just like the English
version, the translation is referring to the German term. For this reason,
use "Integrationen" instead of "Integrations" when speaking of multiple
integrations in German. There aren't many German sources available for this
translation, but "Integration" has the same meaning in German and English.

_"Integration/-en" (Transifex)_

- Notification - **Benachrichtigung**

Nice and easy. Other translations for "notification" like
"Erwähnung", "Bescheid" or "Notiz" don't fit here.

_"Benachrichtigung" (Facebook, Gmail, Transifex, Wikipedia)_

- Alert Word - **Signalwort**

This one is tricky, since one might initially think of "Alarmwort" as a proper
translation. "Alarm", however, has a negative connotation, people link it to
unpleasant events. "Signal", on the other hand, is neutral, just like
"alert word". Nevertheless, [Linguee](https://www.linguee.de/deutsch-englisch/search?source=auto&query=alert+word)
shows that some websites misuse "Alarm" for the translation.

_"Signalwort" (Transifex), "Wort-Alarm" (Linguee)_

- View - **View** (Developer documentation)

Since this is a Zulip-specific term for

> every path that the Zulip server supports (doesn’t show a 404 page for),

and there is no German equivalent, talking of "Views" is preferable in the
developer documentation and makes it easier to rely on parts of the German
_and_ parts of the English documentation.

- View - **Ansicht** (User-facing documentation)

For user-facing documentation, we want to use "Ansicht" instead of "view",
as "Ansicht" provides a translated description for what you think of when
hearing "view". "Ansicht" is not desirable for the developer documentation,
since it does not emphasize the developing aspects of views (in contrast to
anglicisms, which Germans often link to IT-related definitions).

_"Ansicht" (Transifex)_

- Home - **Startseite**

Nice and easy. "Zuhause" obviously doesn't fit here ;).

_"Startseite" (Facebook, Transifex)_

- Emoji - **Emoji**

"Emoji" is the standard term for Emojis. Any other Germanized translation like
"Bildschriftzeichen" (which exists!) would sound stiff and outdated. "Emoticon"
works as well, but is not that common in German.

_"Emoji" (Facebook, WhatsApp), "Emoticon" (Google+)_

## Phrases (Ausdrücke)

- Subscribe/Unsubscribe - **Abonnieren/Deabonnieren**

This translation is unambiguous.

_"Deabonnieren" (YouTube, Transifex)_

- Narrow to - **Begrenzen auf**

Transifex has two different translations for "Narrow to" -
"Schränke auf ... ein." and "Begrenze auf ... ." Both sound a bit strange to a
German speaker, since they would expect grammatically correct sentences when
using the imperative (e.g., "Schränke diesen Stream ein auf ... .") Since this
would be too long for many labels, the infinitive "begrenzen auf" is preferable.
"einschränken auf" sounds equally good, but Transifex shows more use cases for
"begrenzen auf".

_"Schränke auf ... ein." (Transifex) "Begrenze auf ... ." (Transifex)_

- Filter - **Filtern**

A direct translation is fine here. Watch out to use the infinitive instead
of the imperative, e.g., "Nachrichten filtern" instead of "Filtere Nachrichten".

_"Filtern" (Thunderbird, LinkedIn)_

- Mute/Unmute - **Stummschalten/Lautschalten**

"Lautschalten" is rarely used in German, but so is "Stummschaltung
deaktivieren". Since anyone can understand the idea behind "Lautschalten", it is
preferable due to its brevity.

- Deactivate/Reactivate - **Deaktivieren/Reaktivieren**

_"Deaktivieren/Reaktivieren" (Transifex)_

- Search - **Suchen**

_"Suchen" (YouTube, Google, Facebook, Transifex)_

- Pin/Unpin - **Anpinnen/Loslösen**

While "pinnen" is shorter than "anpinnen", "anpinnen" sweeps any ambiguity out of
the way. This term is not used too often on Zulip, so the length shouldn't be a
problem.

_"Anpinnen/Ablösen" (Transifex), "Pinnen" (Pinterest)_

- Mention/@mention - **Erwähnen/@-erwähnen**

Make sure to say "@-erwähnen", but "die @-Erwähnung" (capitalized).

_"Erwähnen/@-Erwähnen" (Transifex)_

- Invalid - **Ungültig**

_"Ungültig" (Transifex)_

- Customization - **Anpassen**

The literal translation "Anpassung" would sound weird in most cases, so we use
the infinitive form "anpassen".

- I want - **Ich möchte**

"Ich möchte" is the polite form of "Ich will".

_"Ich möchte" - (Transifex, general sense of politeness)_

- User - **Nutzer:in**

"Benutzer:in" would work as well, but "Nutzer:in" is shorter and more commonly
used in web applications.

_"Nutzer\*innen" (Figma, Facebook), "Benutzer\*innen" (GitHub,
Airtable), "Nutzer" (Facebook, Gmail), "Benutzer" (Transifex)_

- Person/People - Personen

We use "Personen" instead of plural "Nutzer:innen" for "people".

_"Nutzer/Personen" (Transifex)_

## Other (Verschiedenes)

- You - **Du**

Why not "Sie"? In brief, Zulip and other web applications tend to use a rather
informal language. If you would like to read more about the reasoning behind
this, refer to the [general notes](#formal-or-informal) for
translating German.

_"Du" (Google, Facebook), "Sie" (Transifex)_

- We - **Wir** (rarely used)

German guides don't use "wir" very often - they tend to reformulate the
phrases instead.

_"Wir" (Google, Transifex)_
```

--------------------------------------------------------------------------------

---[FILE: hindi.md]---
Location: zulip-main/docs/translating/hindi.md

```text
# Hindi translation style guide (हिन्दी अनुवाद शैली मार्गदर्शक)

- Use _आप_ as the second-person pronoun. Don't use तुम or तू.
  (See [chat thread](https://chat.zulip.org/#narrow/channel/58-translation/topic/Hindi.20Translation/near/1762384).)

- Imperative, active, and continuous verbs, e.g., _manage streams_ -
  _चैनल प्रबंधित करें_, not _चैनल प्रबंधन_.

- Warm and friendly phrasing whenever appropriate.

- No slang or regional phrases that could be unclear or too informal.

- Balance common verbs and nouns with specific IT-related translations
  of English terms - this can be tricky, try to check how other
  resources were translated (e.g., Gmail, Microsoft websites, Facebook)
  to decide what wouldn't sound awkward / rude in Hindi.

Some terms are very tricky to translate, so be sure to communicate
with other Hindi speakers in the community. It's all about making
Zulip friendly and usable.

## Terms (शर्तें)

- Message - **संदेश**
- Direct message (DM) - **सीधा संदेश**
- Stream - **धारा**: the use of the literal Hindi word for stream
  "प्रवाह" is very confusing and not the correct metaphor for Hindi
  speaking people. The correct term would be "धारा".
- Topic - **विषय**
- Private/invite-only stream - **निजी / केवल-आमंत्रण धारा**
- Public stream - **सार्वजनिक धारा**
- Bot - **बॉट**
- Integration - **एकीकरण**
- Notification - **अधिसूचना**
- Alert word - **सतर्क शब्द**
- View - **राय**
- Filter - **छानना**: as used with narrowing (see below).
- Home - **मुख पृष्ठ**: we never use the term "घर" (literally home) in Hindi.
- Emoji - **इमोजी**

## Phrases (वाक्यांश)

- Subscribe/Unsubscribe to a stream - **एक धारा में सदस्यता लें/सदस्यता समाप्त करें**
- Narrow to - **अकेले फ़िल्टर करें**: this is _filter only_, because there's no other
  word that's common enough in Hindi for _to narrow_.
- Mute/Unmute - **शांत/अशांत**
- Deactivate/Reactivate - **निष्क्रिय करें / पुन: सक्रिय करें**
- Search - **खोज करें/ढूंढें**
- Pin - **ठीक करना**
- Mention/@mention - **ज़िक्र करना / @ज़िक्र करना**
- Invalid - **अमान्य**
- Customization - **अनुकूलन**
- I want - **मुझे चाहिए**
- User - **उपयोगकर्ता**
- Person/People - **व्यक्ति/लोग**: "लोग" is the correct plural for
  "व्यक्ति", but when talking of _लोग_ referring to it as a crowd, we use
  "भीड़" instead.

## Others (अन्य)

- We - **हम**
- Message table - **संदेश बोर्ड**
- Enter/Intro - **दर्ज / परिचय**
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/translating/index.md

```text
# Translating Zulip

```{toctree}
---
maxdepth: 3
---

translating
internationalization
chinese
finnish
french
german
hindi
japanese
polish
russian
spanish
urdu
```
```

--------------------------------------------------------------------------------

````

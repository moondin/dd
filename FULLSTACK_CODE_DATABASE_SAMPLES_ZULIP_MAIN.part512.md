---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 512
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 512 of 1290)

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

---[FILE: development-community.html]---
Location: zulip-main/templates/corporate/development-community.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Development community | Zulip" %}

{% set PAGE_DESCRIPTION = "Join the Zulip development community to contribute,
  ask questions, or provide feedback to the creators of Zulip. Everyone is
  welcome!" %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}


<div class="portico-landing why-page solutions-page">
    <div class="hero bg-pycon">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">{% trans %}The Zulip development community{% endtrans %}</h1>
        </div>
        <div class="hero-text">
            Join today! The buttons below provide customized channel subscriptions.
        </div>
        <div class="hero-buttons center">
            <a href="https://chat.zulip.org/join/t5crtoe62bpcxyisiyglmtvb/" class="button">
                {{ _('Join as a user') }}
            </a>
            <a href="https://chat.zulip.org/join/wnhv3jzm6afa4raenedanfno/" class="button">
                {{ _('Join as a self-hoster') }}
            </a>
            <a href="https://chat.zulip.org/join/npzwak7vpmaknrhxthna3c7p/" class="button">
                {{ _('Join as a contributor') }}
            </a>
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/development-community.md') }}
            </div>
        </div>
    </div>

    <div class="feature-end">
        <div class="bottom-register-buttons extra_margin_before_footer">
            <h1>
                Join today!
            </h1>
            <div class="hero-buttons center">
                <a href="https://chat.zulip.org/join/t5crtoe62bpcxyisiyglmtvb/" class="button">
                    {{ _('Join as a user') }}
                </a>
                <a href="https://chat.zulip.org/join/wnhv3jzm6afa4raenedanfno/" class="button">
                    {{ _('Join as a self-hoster') }}
                </a>
                <a href="https://chat.zulip.org/join/npzwak7vpmaknrhxthna3c7p/" class="button">
                    {{ _('Join as a contributor') }}
                </a>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: development-community.md]---
Location: zulip-main/templates/corporate/development-community.md

```text
The primary communication forum for the Zulip community is the Zulip
server hosted at [chat.zulip.org](https://chat.zulip.org/):

- **Users** and **administrators** of Zulip organizations stop by to
  ask questions, offer feedback, and participate in product design
  discussions.
- **Contributors to the project**, including the **core Zulip
  development team**, discuss ongoing and future projects, brainstorm
  ideas, and generally help each other out.

Everyone is welcome to [sign up](https://chat.zulip.org/) and
participate — we love hearing from our users! Public channels in the
community receive thousands of messages a week. We recommend signing
up using the special invite links for
[users](https://chat.zulip.org/join/t5crtoe62bpcxyisiyglmtvb/),
[self-hosters](https://chat.zulip.org/join/wnhv3jzm6afa4raenedanfno/)
and
[contributors](https://chat.zulip.org/join/npzwak7vpmaknrhxthna3c7p/)
to get a curated list of initial channel subscriptions.

To get help in real time, you will have the best luck finding core
developers during daylight hours in North America (roughly between
15:00 UTC and 1:00 UTC), but the sun never sets on the Zulip
community. Most questions get a reply within minutes to a few hours.

Before posting your first message, please read the [community
norms](#community-norms) section below in its entirety. It explains how to
engage with the Zulip community.

You can also [read conversations](https://chat.zulip.org/) in the community
without creating an account. If you are evaluating using Zulip for your
organization, check out these [tips](https://chat.zulip.org/?show_try_zulip_modal)
for exploring the product in action in the development community.

<br/>
# Community norms

## How we communicate

- Use **informal language**; there’s no need for titles like “Sir” or “Madam”.
- Use **[gender-neutral
  language](https://en.wikipedia.org/wiki/Gender-neutral_language)**. For
  example:
    - **Good**: Does anyone need a review on **their** PR?
    - **Not good**: Does anyone need a review on **his** PR?
- Aim to **communicate professionally**, using full sentences with correct spelling
  and grammar.
- Follow the community **[code of
  conduct](https://zulip.readthedocs.io/en/latest/code-of-conduct.html)**.

Read the [guide on how we
communicate](https://zulip.readthedocs.io/en/latest/contributing/how-we-communicate.html)
to learn more.

## How to ask for help

- Formulate a **clear question**, which includes an appropriate amount of context
  and a specific request for help. Link to **relevant references** (e.g., GitHub
  issues, Zulip's documentation, etc.).
- When relevant, include the **full traceback** in a [code
  block](/help/code-blocks) (not a screenshot).
- If working on a code contribution, **try to solve your own problem first**,
  including reading through relevant documentation and code. Identify and
  describe the precise point on which you feel stuck.

 Moderators read every public channel, and make sure that questions are
 addressed. To avoid disrupting work in the community:

- **Never ask the same question in multiple places**.
- If you are new to the community, **default to never using @-mentions**.
  Unnecessary mentions make it harder for Zulip's maintainers to see and respond
  to urgent messages. You can use Zulip's [silent
  mentions](https://zulip.com/help/mention-a-user-or-group#silently-mention-a-user)
  to refer to a user without notifying them.

## How to give feedback

If you have ideas for how to make Zulip better, we’d love to hear from you!
Learn how to [report
bugs](https://zulip.readthedocs.io/en/latest/contributing/reporting-bugs.html),
[suggest features and
improvements](https://zulip.readthedocs.io/en/latest/contributing/suggesting-features.html),
and [share your
experience](https://zulip.readthedocs.io/en/latest/contributing/suggesting-features.html#evaluation-and-onboarding-feedback)
with Zulip.

## Where to post

- **Ask questions in channels**, rather than DMing core contributors. You’ll get
  answers faster since more people can help, and others will be able to benefit
  from the discussion.
- **Start a [new topic](/help/introduction-to-topics)** unless you’re replying
  to an existing conversation.
- If you like, **introduce yourself** in the [#new members
  channel](https://chat.zulip.org/#narrow/channel/95-new-members), using your
  name as the topic. Tells us what brings you to the community!
- **Test messages** should only be sent to the [#test
  here](https://chat.zulip.org/#narrow/channel/7-test-here) channel, or as DMs
  to yourself.

The section below gives a detailed overview of the channels in the Zulip
community — take a look there to learn more.

<br/>
# Where do I send my message?

This section describes popular public channels on chat.zulip.org. Kick
off the discussion by starting a [new topic](/help/introduction-to-topics)
in the appropriate channel! Don’t stress too much about picking the
right place if you’re not sure; anyone in the community can edit a
topic name, and [moderators](/help/user-roles) can [move a
topic to a different channel](/help/move-content-to-another-channel).

## Channels for everyone

- [#feedback](https://chat.zulip.org/#narrow/channel/137-feedback) is
  for posting feedback on Zulip, including feature requests, suggestions for
  improvements to the UI or existing features, or anything else! We also
  appreciate hearing about how Zulip is used in your organization.
- [#integrations](https://chat.zulip.org/#narrow/channel/127-integrations)
  is for bug reports or questions about integrations.
- [#issues](https://chat.zulip.org/#narrow/channel/9-issues) is for reporting
  bugs (or possible bugs) in the Zulip web app or server implementation.
- [#mobile](https://chat.zulip.org/#narrow/channel/48-mobile),
  [#desktop](https://chat.zulip.org/#narrow/channel/16-desktop), and
  [#zulip-terminal](https://chat.zulip.org/#narrow/channel/206-zulip-terminal)
  are the best places to post bug reports or questions about Zulip's apps. Note
  that [#desktop](https://chat.zulip.org/#narrow/channel/16-desktop) should only
  be used for issues specific to the desktop app, which shares most of its UI
  and implementation with the web app.
- Everyone is welcome to introduce themselves in [#new
  members](https://chat.zulip.org/#narrow/channel/95-new-members). Posting
  here with your name as the topic is a great option if you’re
  uncertain where to start a conversation.
- [#test here](https://chat.zulip.org/#narrow/channel/7-test-here) is
  for sending test messages without inconveniencing other users :). We
  recommend muting this channel when not using it.

## Channels for Zulip users and administrators

- [#user questions](https://chat.zulip.org/#narrow/channel/138-user-questions) is
  for questions about how to configure your Zulip organization, and accomplish
  your goals with Zulip. You can also refer to the [Zulip help center](/help)
  for detailed documentation.
- [#production help](https://chat.zulip.org/#narrow/channel/31-production-help) is
  for all questions related to [self-hosting
  Zulip](/self-hosting/).
- [#zulip
  cloud](https://chat.zulip.org/#narrow/channel/387-zulip-cloud) is for
  all conversations about the [Zulip Cloud](https://zulip.com/plans/)
  service.

## Channels for code contributors

### All codebases

- [#git help](https://chat.zulip.org/#narrow/channel/44-git-help) is
  for help with using Git.
- [#code review](https://chat.zulip.org/#narrow/channel/91-code-review)
  is for getting feedback on your work. We encourage all developers to
  comment on work posted here, even if you’re new to the Zulip
  project; reviewing other PRs is a great way to develop experience,
  and even just manually testing a proposed new feature and posting
  feedback is super helpful. Note that GitHub is our primary system
  for managing code reviews.
- [#api design](https://chat.zulip.org/#narrow/channel/378-api-design)
  is a low-traffic channel for discussing and coordinating changes to
  the [Zulip API](https://zulip.com/api/rest), with all stakeholders
  present.
- [#documentation](https://chat.zulip.org/#narrow/channel/19-documentation)
  is the right place for general conversations about work on
  documentation (including design discussions, questions, updates on a
  project, or anything else).

### Server and web app

- [#development help](https://chat.zulip.org/#narrow/channel/49-development-help)
  is for asking for help with any Zulip server/web app development work.
- [#provision help](https://chat.zulip.org/#narrow/channel/21-provision-help)
  is for help specifically on setting up the server/web app development
  environment. [#tools](https://chat.zulip.org/#narrow/channel/18-tools)
  is other conversations about the server/web app developer tooling.
- [#backend](https://chat.zulip.org/#narrow/channel/3-backend) and
  [#frontend](https://chat.zulip.org/#narrow/channel/6-frontend) are
  the right place for general conversations about work on the Zulip
  server and web app respectively (including design discussions,
  questions, updates on a project, or anything else).
- [#design](https://chat.zulip.org/#narrow/channel/101-design) is the
  place to discuss the detailed UI and UX design of a change you're
  working on, meaning how it looks and how it behaves as seen by the
  user.  (Technical discussions, including how the code itself is
  designed, go in one of the other channels above.)
- [#automated
  testing](https://chat.zulip.org/#narrow/channel/43-automated-testing)
  is primarily used for automated notifications about [CI
  failures](https://zulip.readthedocs.io/en/latest/testing/continuous-integration.html),
  but is also a good place to discuss projects to improve Zulip’s
  automated testing infrastructure.

### Mobile app

- [#mobile-dev-help](https://chat.zulip.org/#narrow/channel/516-mobile-dev-help)
  is for asking for help with any development work on the Zulip mobile app.
- [#mobile-team](https://chat.zulip.org/#narrow/channel/243-mobile-team)
  is the right place for general conversations about work on the
  mobile app (including technical design discussions, questions,
  updates on a project, or anything else).
- [#mobile-design](https://chat.zulip.org/#narrow/channel/530-mobile-design)
  is the place to discuss the detailed UI and UX design of a change
  you're working on, meaning how it looks and how it behaves as seen
  by the user.  (Technical discussions, including how the code itself
  is designed, go in one of the other channels above.)
- [#mobile](https://chat.zulip.org/#narrow/channel/48-mobile) is
  primarily for user feedback and issue reports, not work on the code.

### Desktop and terminal apps

- [#desktop](https://chat.zulip.org/#narrow/channel/16-desktop) and
  [#zulip-terminal](https://chat.zulip.org/#narrow/channel/206-zulip-terminal)
  are for discussing work on the Zulip desktop and terminal apps
  respectively.

## Channels for translators
- [#translation](https://chat.zulip.org/#narrow/channel/58-translation)
  is for discussing [Zulip’s
  translations](https://zulip.readthedocs.io/en/latest/translating/translating.html).
- Some languages have channels named like
  [#translation/fr](https://chat.zulip.org/#narrow/channel/371-translation.2Ffr)
  and
  [#translation/zh_tw](https://chat.zulip.org/#narrow/channel/377-translation.2Fzh_tw)
  to coordinate translation work for that language.

## Channels for anyone spending time in the community
- [#announce](https://chat.zulip.org/#narrow/channel/1-announce) is our
  low-traffic channel for project announcements (releases, etc.).
- [#checkins](https://chat.zulip.org/#narrow/channel/65-checkins) is
  for progress updates on what you’re working on and its status;
  usually folks post with their name as the topic. Everyone is welcome
  to participate!
- [#design](https://chat.zulip.org/#narrow/channel/101-design) and
  [#mobile-design](https://chat.zulip.org/#narrow/channel/530-mobile-design)
  are where we discuss UI and feature design and collect feedback on
  potential design changes. We love feedback, so take a look at the
  active discussions and don’t hesitate to speak up!
  <br><p>These "design" channels are primarily intended for discussing
  changes the community is actively working on. For starting a topic
  to propose a new design change, the best place is
  [#feedback](https://chat.zulip.org/#narrow/channel/137-feedback) or
  [#mobile](https://chat.zulip.org/#narrow/channel/48-mobile).</p>
- [#discussions](https://chat.zulip.org/#narrow/channel/277-discussions)
  is where we do fun community conversations like “Ask Me Anything”
  Q&A sessions with project members.
- [#documentation](https://chat.zulip.org/#narrow/channel/19-documentation)
  and
  [#api documentation](https://chat.zulip.org/#narrow/channel/412-api-documentation)
  are where we discuss improving Zulip’s user, sysadmin, API, and
  developer documentation.
- [#general](https://chat.zulip.org/#narrow/channel/2-general) is for
  all topics of general interest.
- [#learning](https://chat.zulip.org/#narrow/channel/92-learning) is
  for posting great learning resources one comes across.
- [#off topic](https://chat.zulip.org/#narrow/channel/97-off-topic) is
  is for occasional conversations not related to Zulip, usually things
  of general interest to open-source communities.

You can always find the description for the channel you’re reading at
the top of the Zulip app.

<br/>
# Anything else to keep in mind?

## Don’t try to read *everything*

Keeping up with **everything** happening in the Zulip project is both
difficult and rarely a useful goal. To make the best use of your time,
we highly recommend that you unsubscribe from channels that you aren’t
interested in, mute channels that are only of occasional interest, and
make use of [Zulip’s skimming features](/help/reading-strategies),
like Recent conversations, to spend your time on topics that interest
you.

## Searching for past conversations

To look for previous threads about something, we recommend using the
following [search filters](/help/search-for-messages#search-filters):
`streams:public <your keyword(s)>`.

This will search the full history of all public channels for `<your
keyword(s)>`, including messages sent before you joined and messages
on public channels you’re not subscribed to.

## Linking to GitHub issues and pull requests

We've set up [custom linkifiers](/help/add-a-custom-linkifier)
so that it's easy to link to issues and pull requests in Zulip
project repositories when composing a message or starting a
[new topic](/help/introduction-to-topics). Here are examples for linking
to issue 1234 in the main Zulip project repositories:

- [Server and web app][server-web-repository]: `#1234`
- [Flutter mobile client][flutter-repository]: `#F1234`
- [Terminal client][terminal-repository]: `#T1234`
- [Desktop client][desktop-repository]: `#D1234`

## New features are tested here

We [continuously test out new features or ideas][release-lifecycle] on
chat.zulip.org before rolling them out to Zulip Cloud or including
them in a Zulip Server release (or deciding not to!). Please report in
[#issues](https://chat.zulip.org/#narrow/channel/9-issues) anything you
notice that seems broken! It’s likely you’ve found a bug in an upcoming
feature.

[release-lifecycle]: https://zulip.readthedocs.io/en/latest/overview/release-lifecycle.html
[server-web-repository]: https://github.com/zulip/zulip
[flutter-repository]: https://github.com/zulip/zulip-flutter
[terminal-repository]: https://github.com/zulip/zulip-terminal
[desktop-repository]: https://github.com/zulip/zulip-desktop
```

--------------------------------------------------------------------------------

---[FILE: features.html]---
Location: zulip-main/templates/corporate/features.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "plans-page" %}

{% set PAGE_TITLE = "Features | Zulip" %}

{% set PAGE_DESCRIPTION = "From highly configurable notifications, to powerful
  formatting and flexible administration, Zulip has you covered." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-pricing features-page showing-cloud">
    <div class="body-bg">
        <div class="body-bg__layer"></div>
    </div>

    <h1>Organized team chat solution</h1>
    <div class="h1-subheader">
        From small teams to organizations with thousands of users, Zulip has you
        covered. See <a href="/plans/">plans and pricing</a>.
    </div>

    <div class="main">
        {% include "corporate/comparison_table_integrated.html" %}
    </div>
</div>

{% include 'zerver/footer.html' %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: hello.html]---
Location: zulip-main/templates/corporate/hello.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "landing-page-hello" %}

{% set PAGE_TITLE = "Zulip — organized team chat" %}

{% set PAGE_DESCRIPTION = "Zulip is an organized team chat app for distributed
  teams of all sizes." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block content %}
    {% include 'zerver/landing_nav.html' %}
    <div class="portico-hello-page">
        <div class='body-bg'>
            <div class='body-bg__layer'></div>
        </div>
        <div class="screen-1">
            <h1>Organized chat for distributed&nbsp;teams</h1>
            <div class='appshot-1'>
                <picture>
                    <!-- dark theme is only with webp images, since webp support was at the same time or earlier than prefers-color-scheme https://caniuse.com/?search=prefers-color-scheme https://caniuse.com/webp -->
                    <source class='appshot-1__img'
                      type="image/webp"
                      srcset="{{ static('images/landing-page/hello/generated/screen-1-dark-2x.webp') }}"
                      media="(min-width: 941px) and (prefers-color-scheme: dark)"/>
                    <source class='appshot-1__img'
                      type="image/webp"
                      srcset="{{ static('images/landing-page/hello/generated/screen-1-mobile-dark-2x.webp') }}"
                      media="(max-width: 940px) and (prefers-color-scheme: dark)"/>
                    <source width="1095" height="496" class='appshot-1__img'
                      type="image/webp"
                      srcset="{{ static('images/landing-page/hello/generated/screen-1-2x.webp') }}"
                      media="(min-width: 941px)"/>
                    <source class='appshot-1__img'
                      type="image/webp"
                      srcset="{{ static('images/landing-page/hello/generated/screen-1-mobile-2x.webp') }}"
                      media="(max-width: 940px)"/>
                    <source class='appshot-1__img'
                      srcset="{{ static('images/landing-page/hello/generated/screen-1-mobile-2x.jpg') }}"
                      media="(max-width: 940px)"/>
                    <img alt="" width="1095" height="496" class='appshot-1__img' src="{{ static('images/landing-page/hello/generated/screen-1-2x.jpg') }}"/>
                </picture>
                <div class="cta-buttons">
                    <a href="{{ 'https://chat.zulip.org' if not development_environment}}/?show_try_zulip_modal">
                        See it in use
                        <div class="cta-desc">in an open organization</div>
                    </a>
                    <a href="/new/">
                        Create an organization
                        <div class="cta-desc">in 1 minute for free</div>
                    </a>
                    <a href="/request-demo/">
                        Get a demo
                        <div class="cta-desc">request a call</div>
                    </a>
                </div>
            </div>
            <div class="client-logos">
                <div class='client-logos-div client-logos__logo_pilot'></div>
                <div class='client-logos-div client-logos__logo_linux_foundation'></div>
                <div class='client-logos-div client-logos__logo_tum'></div>
                <div class='client-logos-div client-logos__logo_wikimedia'></div>
                <div class='client-logos-div client-logos__logo_rust'></div>
                <div class='client-logos-div client-logos__logo_dr_on_demand'></div>
            </div>
        </div>
        <div class="screen-2">
            <div class="screen-2__container">
                <div>
                    <h2 class="screen-2__header">Designed for async conversations.</h2>
                    <div class="screen-2__subtitle">Here's what it looks like in action.</div>
                </div>
                <div class="screen-2__tabs">
                    <input type="radio" id="screen-2__tab1" name="screen-2__tabs-radio" class="screen-2__tab-input" checked />
                    <input type="radio" id="screen-2__tab2" name="screen-2__tabs-radio" class="screen-2__tab-input" />
                    <input type="radio" id="screen-2__tab3" name="screen-2__tabs-radio" class="screen-2__tab-input" />
                    <input type="radio" id="screen-2__tab4" name="screen-2__tabs-radio" class="screen-2__tab-input" />
                    <input type="radio" id="screen-2__tab5" name="screen-2__tabs-radio" class="screen-2__tab-input" />
                    <ul>
                        <li>
                            <label for="screen-2__tab1">
                                Get an overview of conversations with unread messages in your inbox.
                            </label>
                        </li>
                        <li>
                            <label for="screen-2__tab2">
                                Focus on one conversation at a time, no matter how many others are happening.
                            </label>
                        </li>
                        <li>
                            <label for="screen-2__tab3">
                                Reply to each conversation in context.
                            </label>
                        </li>
                        <li>
                            <label for="screen-2__tab4">
                                Conversations continue seamlessly over time.
                            </label>
                        </li>
                        <li>
                            <label for="screen-2__tab5">
                                Start a new conversation by giving it a brief topic.
                            </label>
                        </li>
                    </ul>
                    <div class="screen-2__tabs-content">
                        <div class="screen-2__tab-image">
                            <picture>
                                <source
                                  srcset="{{ static('images/landing-page/hello/generated/01-tab-cont-dark-2x.jpg') }}"
                                  media="(prefers-color-scheme: dark)" />
                                <img alt="" src="{{ static('images/landing-page/hello/generated/01-tab-cont-2x.jpg') }}"/>
                            </picture>
                        </div>
                        <div class="screen-2__tab-image">
                            <picture>
                                <source
                                  srcset="{{ static('images/landing-page/hello/generated/02-tab-cont-dark-2x.jpg') }}"
                                  media="(prefers-color-scheme: dark)" />
                                <img alt="" src="{{ static('images/landing-page/hello/generated/02-tab-cont-2x.jpg') }}"/>
                            </picture>
                        </div>
                        <div class="screen-2__tab-image">
                            <picture>
                                <source
                                  srcset="{{ static('images/landing-page/hello/generated/03-tab-cont-dark-2x.jpg') }}"
                                  media="(prefers-color-scheme: dark)" />
                                <img alt="" src="{{ static('images/landing-page/hello/generated/03-tab-cont-2x.jpg') }}"/>
                            </picture>
                        </div>
                        <div class="screen-2__tab-image">
                            <picture>
                                <source
                                  srcset="{{ static('images/landing-page/hello/generated/04-tab-cont-dark-2x.jpg') }}"
                                  media="(prefers-color-scheme: dark)" />
                                <img alt="" src="{{ static('images/landing-page/hello/generated/04-tab-cont-2x.jpg') }}"/>
                            </picture>
                        </div>
                        <div class="screen-2__tab-image">
                            <picture>
                                <source
                                  srcset="{{ static('images/landing-page/hello/generated/05-tab-cont-dark-2x.jpg') }}"
                                  media="(prefers-color-scheme: dark)" />
                                <img alt="" src="{{ static('images/landing-page/hello/generated/05-tab-cont-2x.jpg') }}"/>
                            </picture>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="screen-3">
            <div class="screen-3__container">
                <div class="screen-3__content">
                    <h2 class="screen-3__header">Zulip empowers remote and flexible work.</h2>
                    <div class="screen-3__subtitle">Check out these case studies to see the impact.</div>
                    <div class='screen-3__quotes'>
                        <a class="quote" href="/case-studies/atolio/">
                            <div class="quote__text">
                                <h4>Work better together</h4>
                                The first-class threads in Zulip are <strong>absolutely critical to how we work</strong>. So many people on Hacker News talk about using Zulip — I'm so glad we joined them!
                            </div>
                            <div class="quote__source">
                                <strong>David Lanstein</strong>, <i>co-founder and CEO of Atolio</i>
                            </div>
                        </a>
                        <a class="quote" href="/case-studies/idrift/">
                            <div class="quote__text">
                                <h4>Empower leaders</h4>
                                Using Zulip significantly <strong>increases the size of the team</strong> for which a manager can meaningfully know what’s going on.
                            </div>
                            <div class="quote__source">
                                <strong>Gaute Lund</strong>, <i>co-founder of iDrift AS</i>
                            </div>
                        </a>
                        <a class="quote" href="/case-studies/rust/">
                            <div class="quote__text">
                                <h4>Make decisions faster</h4>
                                Some decisions that were blocked for months on
                                GitHub were <strong>resolved within 24 hours</strong> on Zulip.
                            </div>
                            <div class="quote__source">
                                <strong>Josh Triplett</strong>, <i>Rust Language team co-lead</i>
                            </div>
                        </a>
                        <a class="quote" href="https://monadical.com/posts/how-to-make-remote-work-part-two-zulip.html">
                            <div class="quote__text">
                                <h4>Simplify knowledge management</h4>
                                Using Zulip in a way that feels natural creates
                                an <strong>organized repository</strong> of knowledge <i>as a
                                side effect</i>.
                            </div>
                            <div class="quote__source">
                                <strong>Max McCrea</strong>, <i>Co-founder of Monadical</i>
                            </div>
                        </a>
                        <a class="quote" href="/case-studies/end-point/">
                            <div class="quote__text">
                                <h4>Organize 100s of workstreams</h4>
                                Other apps like Slack would struggle with
                                organizing the flow of information in a complex
                                organization like ours. Zulip’s UI makes it easy
                                to <strong>access all the information you need</strong>.
                            </div>
                            <div class="quote__source">
                                <strong>Jon Jensen</strong>, <i>CTO of End Point
                                Dev</i>
                            </div>
                        </a>
                        <a class="quote" href="/case-studies/gut-contact/">
                            <div class="quote__text">
                                <h4>Communicate with efficiency</h4>
                                I don’t like going back to Slack now. It’s just
                                not as efficient a way to <strong>organize
                                communication</strong>.
                            </div>
                            <div class="quote__source">
                                <strong>James van Lommel</strong>, <i>Director of Engineering at Semsee</i>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="screen-4">
            <div class="screen-4__container">
                <div class="screen-4__content">
                    <img alt="" class="switch-diagram mirror-image" loading="lazy" width="300"
                      src="{{ static('images/landing-page/education/privacy.svg') }}"
                      />
                    <div class="screen-4__desc">
                        <h2 class="screen-4__header">You own your data</h2>
                        <p>
                            Escape corporate vendor lock-in. You can <a
                            href="/self-hosting/">self-host</a> Zulip’s 100% <a
                            href="https://github.com/zulip/zulip#readme">open-source</a>
                            software for full data sovereignty, or start
                            with a convenient <a href="/plans">cloud
                            solution</a> and <a
                            href="https://zulip.readthedocs.io/en/stable/production/export-and-import.html#import-into-a-new-zulip-server">move</a>
                            any time.
                        </p>
                        <p>
                            We make it easy to switch from <a
                            href="/help/moving-from-slack">Slack</a>, <a
                            href="/help/moving-from-teams">Teams</a> and <a
                            href="/help/migrating-from-other-chat-tools">other
                            tools</a>.
                        </p>
                    </div>
                </div>
            </div>
            <div class="badges">
                <a class="badge-getapp" href="https://www.getapp.com/collaboration-software/web-collaboration/category-leaders">
                    <img alt="" src="https://brand-assets.getapp.com/badge/05c62fe0-cb84-41bf-ae2d-cd0105373a2c.svg"/>
                </a>
                <a class="badge-capterra" href="https://www.capterra.com/p/197945/Zulip/">
                    <img alt="" src="https://brand-assets.capterra.com/badge/d7c03c95-8f34-466e-b964-546b102899f1.svg"/>
                </a>
            </div>
        </div>
        <div class="screen-5">
            <div class="screen-5__container">
                <h2 class="screen-5__header">Curious to learn more?</h2>
                <div class="screen-5__subtitle">Dive into our detailed guide for organizations like yours.</div>
                <div class="screen-5__cards">
                    <a href="/for/business/" class="card">
                        <div class="card__text">
                            <h4 class="right-arrow-icon">Business</h4>
                            Organizations from small businesses to enterprises communicate more efficiently.
                        </div>
                    </a>
                    <a href="/for/research/" class="card">
                        <div class="card__text">
                            <h4 class="right-arrow-icon">Research</h4>
                            For your group, lab, department or scientific field.
                        </div>
                    </a>
                    <a href="/for/education/" class="card">
                        <div class="card__text">
                            <h4 class="right-arrow-icon">Education</h4>
                            Communication hub for classes, in-person or online.
                        </div>
                    </a>
                    <a href="/for/open-source/" class="card">
                        <div class="card__text">
                            <h4 class="right-arrow-icon">Open-source</h4>
                            Grow and engage your community.
                        </div>
                    </a>
                    <a href="/for/communities/" class="card">
                        <div class="card__text">
                            <h4 class="right-arrow-icon">Non-profits, Governments</h4>
                            Free or highly-discounted plans are available for most non-business uses.
                        </div>
                    </a>
                    <a href="/for/events/" class="card">
                        <div class="card__text">
                            <h4 class="right-arrow-icon">Events and conferences</h4>
                            For organizers and attendees at your conference, workshop, or hackathon.
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
    {% include 'zerver/footer.html' %}
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: history.html]---
Location: zulip-main/templates/corporate/history.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "History of the Zulip project" %}

{% set PAGE_DESCRIPTION = "Learn how Zulip grew from a small startup to become
  the project with the most active open-source development community of any team
  chat software." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page">
    <div class="hero bg-pycon">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">History of the Zulip project</h1>
        </div>
    </div>
    <div class="main">
        <div class="padded-content">
            <div class="photo-description">
                Zulip at the PyCon Sprints in Portland, Oregon.
                Over seventy-five people sprinted during the four day event.
            </div>

            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/history.md') }}
            </div>


            <div class="inner-content history markdown">
                <div class="sponsors">
                    <div class="sponsor-picture">
                        <a href="https://seedfund.nsf.gov/">
                            <img src="{{ static('images/landing-page/history/nsf-logo.png') }}" alt="" />
                        </a>
                    </div>
                    <div class="sponsor-picture">
                        <a href="https://summerofcode.withgoogle.com/">
                            <img src="{{ static('images/landing-page/history/gsoc-logo.png') }}" alt="" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

````

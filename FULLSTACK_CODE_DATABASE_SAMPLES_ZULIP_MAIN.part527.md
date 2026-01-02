---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 527
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 527 of 1290)

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

---[FILE: research.html]---
Location: zulip-main/templates/corporate/for/research.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Zulip for researchers and academics" %}

{% set PAGE_DESCRIPTION = "Make Zulip the communication hub for your research
  group, department or scientific field. Organized team chat ideal for both
  live and asynchronous conversations." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}


<div class="portico-landing why-page solutions-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Zulip for research</h1>
            <p>
                Chat for your project, research group, department or scientific
                field. <br/><a href="/plans/">Zulip Cloud Standard</a> is free for academic
                research!
            </p>
        </div>
        <div class="hero-text">
            Learn how the <a href="/case-studies/lean/">Lean theorem prover
            community</a> is using Zulip.
        </div>
        <div class="hero-buttons center">
            <a href="/new/" class="button">
                {{ _('Create organization') }}
            </a>
            <a href="/accounts/go/?next=/sponsorship/" class="button">
                {{ _('Request sponsorship') }}
            </a>
            <a href="/self-hosting/" class="button">
                {{ _('Self-host Zulip') }}
            </a>
        </div>
    </div>

    <div class="feature-intro">
        <h1 class="center"> Make Zulip the communication hub for your research community. </h1>
        <p>
            Zulip is the <a href="/why-zulip/">organized team chat</a> app that is ideal for both live and asynchronous conversations. Coordinate with collaborators, post questions and ideas, and learn from others in your field.
        </p>
    </div>

    <div class="feature-container">
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Use topics to organize the discussion
                </h1>
                <ul>
                    <li>
                        <div class="list-content">
                            <a href="/help/introduction-to-topics">Zulip
                            topics</a> create a separate space for each
                            discussion.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            Find active conversations, or see what happened while you were away,
                            with the <a href="/help/recent-conversations">Recent conversations</a> view.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            Keep discussions orderly
                            by <a href="/help/rename-a-topic">moving</a>
                            or <a href="/help/move-content-to-another-topic">splitting</a>
                            topics when conversations digress.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            Check out <a href="/for/communities/">Zulip for communities</a>
                            to learn how Zulip empowers welcoming communities by making it
                            easy to participate on your own time.
                        </div>
                    </li>
                </ul>
                <div class="quote">
                    <blockquote>
                        The Lean community switched from Gitter to Zulip in early 2018,
                        and never looked back. Zulip’s model of conversations labeled with topics has been
                        essential for organising research work and simultaneously
                        onboarding newcomers as our community scaled. My experience with
                        both the app and the website is extremely positive!
                    </blockquote>
                    <div class="author">
                        &mdash; <a href="https://www.imperial.ac.uk/people/k.buzzard">Kevin Buzzard</a>,
                        Professor of Pure Mathematics at
                        <a href="https://www.imperial.ac.uk/">Imperial College London</a>
                    </div>
                    <a class="case-study-link" href="/case-studies/lean/"
                      target="_blank">How the Lean prover
                    community uses Zulip ↗</a>
                </div>
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-image topics-image">
                <img alt="" src="{{ static('images/landing-page/research/streams_and_topics_day.png') }}" />
            </div>
        </div>
    </div>

    <div class="feature-container alternate-grid">
        <div class="feature-half md-hide">
            <div class="feature-image">
                <img alt="" src="{{ static('images/landing-page/education/knowledge-repository.svg') }}" />
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Lasting knowledge repository
                </h1>
                <ul>
                    <li>
                        <div class="list-content">
                            Maintain access to your organization's entire
                            message history with free <a href="/plans/">Zulip
                            Cloud Standard</a> hosting. Information is at your
                            fingertips with Zulip's <a
                            href="/help/search-for-messages">powerful full-text
                            search</a>.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            <a href="/help/link-to-a-message-or-conversation#link-to-zulip-from-anywhere">Permanently link</a>
                            to a Zulip conversation or a message in context
                            from emails, notes, talk slides, or anywhere else.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            With the <a href="/help/public-access-option">public
                            access option</a>, anyone can view, browse, and
                            search your organization's public content — no
                            account required.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            Zulip is <a href="https://github.com/zulip">100%
                            free and open-source software</a>, so you are never
                            locked into a proprietary tool.  You can move your
                            data with our high quality <a
                            href="/help/export-your-organization">export</a> and
                            <a
                              href="https://zulip.readthedocs.io/en/latest/production/export-and-import.html">import</a>
                            tools.
                        </div>
                    </li>
                </ul>
                <div class="quote">
                    <blockquote>
                        +10 or maybe even 💯 for <a href="https://twitter.com/zulip">@zulip</a>. Was originally put onto it by <a href="https://twitter.com/five9a2">@five9a2</a> (thanks!). Have since used it at all levels - my research group (~10 ppl), my dept group (CS Theory, ~30 ppl), my research community (algebraic complexity), and small collaborations. All great!
                    </blockquote>
                    <div class="author">
                        &mdash; Joshua Grochow (@joshuagrochow), <a href="https://twitter.com/joshuagrochow/status/1383141209934163969">April 16, 2021</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="feature-half md-display">
            <div class="feature-image">
                <img alt="" src="{{ static('images/landing-page/education/knowledge-repository.svg') }}" />
            </div>
        </div>
    </div>

    <div class="feature-container">
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Powerful formatting
                </h1>
                <ul>
                    <li>
                        <div class="list-content">
                            <a href="/help/format-your-message-using-markdown#latex">Type LaTeX</a>
                            directly into your Zulip message, and see it beautifully rendered.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            <a href="/help/code-blocks">Zulip code blocks</a>
                            come with syntax highlighting for over 250 languages, and integrated
                            <a href="/help/code-blocks#code-playgrounds">code playgrounds.</a>
                        </div>
                    </li>
                    <li><div class="list-content">Structure your points with bulleted and numbered <a href="/help/format-your-message-using-markdown#lists">lists</a>.</div></li>
                    <li>
                        <div class="list-content">
                            If you made a mistake, no worries! You
                            can <a href="/help/edit-a-message">edit your
                            message</a>, or move it to a
                            different <a href="/help/move-content-to-another-topic">topic</a>
                            or <a href="/help/move-content-to-another-channel">channel</a>.
                        </div>
                    </li>
                </ul>
                <div class="quote">
                    <blockquote>
                        I&#39;ve been using <a href="https://twitter.com/zulip">@zulip</a> recently for my research collaborations, and I was pleasantly surprised how effective it is! The excellent LaTeX rendering and clever threading make it far superior to email and Slack. I found myself shifting most of my research correspondences to Zulip.
                    </blockquote>
                    <div class="author">
                        &mdash; Tom Gur (@TomGur), <a href="https://twitter.com/TomGur/status/1294322062274842624">August 14, 2020</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="feature-half">
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/events/message_formatting_day.png') }}" />
            </div>
        </div>
    </div>

    <div class="feature-container alternate-grid">
        <div class="feature-half md-hide">
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/research/interactive_messaging_day_1.png') }}" />
            </div>
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/research/interactive_messaging_day_2.png') }}" />
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Interactive messaging
                </h1>
                <ul>
                    <li>
                        <div class="list-content">
                            Start a <a href="/help/start-a-call">video
                            call</a> with the click of a button, or
                            make plans for later without worrying
                            about time zones
                            using <a href="/help/format-your-message-using-markdown#global-times">global
                            times</a>.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            Use <a href="/help/emoji-reactions">emoji
                            reactions</a> for lightweight
                            interactions. Have fun
                            with <a href="/help/custom-emoji">custom
                            emoji</a> and gather feedback
                            with <a href="/help/create-a-poll">polls</a>.
                        </div>
                    </li>
                    <li><div class="list-content">Share papers, presentations or images with <a href="/help/share-and-upload-files">drag-and-drop file uploads</a>.</div></li>
                </ul>
                <div class="quote">
                    <blockquote>
                        For more than a year, Zulip has been the cornerstone of our online
                        Category Theory community. We greatly appreciate the seamless
                        integration of Latex in every message as well as being able to get
                        sidetracked (which, let's face it, happens a lot with
                        mathematicians) without compromising an entire conversation: we
                        can simply create a new topic for every tangent! Moreover, the
                        flexible channels-and-topics system greatly helps us navigate
                        through the constant influx of messages, as it is simple to tell
                        if a message is relevant to one's interests.
                        <br />
                        <br />
                        All in all, Zulip
                        enabled us to create an unprecedentedly extensive, active and
                        vibrant community for all category theory enthusiasts out there.
                    </blockquote>
                    <div class="author">
                        &mdash; <a
                        href="https://www8.cs.fau.de/people/stelios/">Stelios
                        Tsampas</a>, postdoctoral researcher at <a href="https://www.fau.eu/">FAU</a>
                    </div>
                </div>

            </div>
        </div>
        <div class="feature-half md-display">
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/research/interactive_messaging_day_1.png') }}" />
            </div>
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/research/interactive_messaging_day_2.png') }}" />
            </div>
        </div>
    </div>

    <div class="feature-container">
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Flexible administration and moderation
                </h1>
                <ul>
                    <li><div class="list-content">Invite new members with <a href="/help/invite-new-users">multi-use invite links</a>, or allow anyone to <a href="/help/restrict-account-creation#set-whether-invitations-are-required-to-join">join without an invitation</a>.</div></li>
                    <li>
                        <div class="list-content">
                            Automatically subscribe members to
                            channels <a href="/help/set-default-channels-for-new-users">when
                            they join.</a>
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            Manage your community with <a
                            href="/help/manage-permissions">fine-grained
                            permission settings</a> you can assign to <a
                            href="/help/user-roles">user roles</a>,
                            <a href="/help/user-groups">user groups</a>, and <a
                            href="/help/introduction-to-users">individual users</a>.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            Zulip offers dozens of features
                            for <a href="/help/moderating-open-organizations">moderating
                            discussions</a>. Members can
                            also <a href="/help/mute-a-user">mute</a> anyone they'd rather
                            not interact with.
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-image">
                <img alt="" src="{{ static('images/landing-page/education/flexible-administration.svg') }}" />
            </div>
        </div>
    </div>

    <div class="feature-container alternate-grid">
        <div class="feature-half md-hide">
            <div class="feature-image">
                <img alt="" src="{{ static('images/landing-page/education/mobile.svg') }}" />
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    When and how you want it
                </h1>
                <ul>
                    <li>
                        <div class="list-content">
                            With <a href="/apps/">apps for every
                            platform</a>, you can check Zulip at your computer or on your
                            phone. Zulip works great in a browser, so no download is
                            required.
                        </div>
                    </li>
                    <li><div class="list-content">Zulip alerts you about timely messages with <a href="/help/channel-notifications">fully customizable</a> mobile, email and desktop notifications.</div></li>
                    <li>
                        <div class="list-content">
                            Mention <a href="/help/mention-a-user-or-group">users</a>, <a href="/help/user-groups">groups
                            of users</a>
                            or <a href="/help/dm-mention-alert-notifications#wildcard-mentions">everyone</a>
                            when you need their attention.
                        </div>
                    </li>
                    <li><div class="list-content">Use Zulip in your language of choice, with translations into <a href="https://hosted.weblate.org/projects/zulip/">23 languages</a>.</div></li>
                </ul>
                <div class="quote">
                    <blockquote>
                        As a research consortium spread across 14 locations in
                        Germany, we use Zulip to communicate with each other in
                        a low-threshold manner, without the overhead of email.
                        Even with more than 200 users across different
                        institutions, Zulip’s model of topic-labeled
                        conversations makes it easy for our team members to keep
                        up-to-date on what's relevant, and work productively
                        together.
                    </blockquote>
                    <div class="author">
                        &mdash; Christina Schüttler, IT department Team Lead, University
                        Hospital Erlangen
                    </div>
                </div>
            </div>
        </div>
        <div class="feature-half md-display">
            <div class="feature-image">
                <img alt="" src="{{ static('images/landing-page/education/mobile.svg') }}" />
            </div>
        </div>
    </div>

    <div class="feature-container">
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Make the move today
                </h1>
                <ul>
                    <li>
                        <div class="list-content">
                            Zulip's founder is a former MIT PhD student, and we love
                            helping academics succeed. Learn about using Zulip
                            for <a href="/for/education/">teaching</a> and
                            <a href="/for/events/">conferences</a>.
                        </div>
                    </li>
                    <li><div class="list-content">Getting started or moving from another platform is easy! Import your existing organization from <a href="/help/import-from-slack">Slack</a>, <a href="/help/import-from-mattermost">Mattermost</a>, or <a href="/help/import-from-rocketchat">Rocket.Chat</a>.</div></li>
                    <li><div class="list-content">If you have any questions, please contact us at <a href="mailto:sales@zulip.com">sales@zulip.com</a>. You can also drop by our <a href="/development-community/">friendly development community at chat.zulip.org</a> to ask for help or suggest improvements!</div></li>
                </ul>
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-image">
                <div class="quote">
                    <blockquote>
                        I have to use Slack for some other research groups
                        I collaborate with, but my own graduate students
                        voted to switch to Zulip a few years ago and it's
                        just vastly better.
                    </blockquote>
                    <div class="author">
                        &mdash; <a href="https://cs.stanford.edu/~keithw/">Keith Winstein</a>, Assistant Professor of Computer Science at <a href="https://www.stanford.edu/">Stanford University</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="feature-end">
        <div class="bottom-register-buttons extra_margin_before_footer">
            <h1>
                <a href="/plans/">Zulip Cloud Standard</a> is free for
                academic research!
            </h1>
            <div class="hero-buttons center">
                <a href="/new/" class="button">
                    {{ _('Create organization') }}
                </a>
                <a href="/accounts/go/?next=/sponsorship/" class="button">
                    {{ _('Request sponsorship') }}
                </a>
                <a href="/self-hosting/" class="button">
                    {{ _('Self-host Zulip') }}
                </a>
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: use-cases.html]---
Location: zulip-main/templates/corporate/for/use-cases.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Use cases and customer stories | Zulip" %}

{% set PAGE_DESCRIPTION = "Learn how our customers are using Zulip." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing plans why-page solutions-page for-companies">
    <div class="hero bg-companies">
        <div class="bg-dimmer"></div>
        <h1 class="center">Use cases and customer stories</h1>
        <p>Learn how our customers are using Zulip.</p>
        <div class="hero-buttons center">
            <a href="/new/" class="button">
                {{ _('Create organization') }}
            </a>
            <a href="/plans/" class="button">
                {{ _('View pricing') }}
            </a>
            <a href="/self-hosting/" class="button">
                {{ _('Self-host Zulip') }}
            </a>
        </div>
    </div>

    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                {{ render_markdown_path('corporate/for/use-cases.md') }}
            </div>
        </div>
    </div>

</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: use-cases.md]---
Location: zulip-main/templates/corporate/for/use-cases.md

```text
## Use cases

* [Business](/for/business/)
* [Education](/for/education/)
* [Research](/for/research/)
* [Events and conferences](/for/events/)
* [Open source projects](/for/open-source/)
* [Communities](/for/communities/)

## Customer stories

### Business

* [iDrift AS company](/case-studies/idrift/)
* [GUT contact support agency](/case-studies/gut-contact/)
* [End Point Dev software consultancy](/case-studies/end-point/)
* [WindBorne startup](/case-studies/windborne/)
* [Semsee InsurTech startup](/case-studies/semsee/)
* [Atolio startup](/case-studies/atolio/)

### Education and research

* [Technical University of Munich](/case-studies/tum/)
* [University of California San Diego](/case-studies/ucsd/)
* [National University of Córdoba](/case-studies/university-of-cordoba/)
* [Lean theorem prover community](/case-studies/lean/)

### Open source and communities

* [Asciidoctor open-source community](/case-studies/asciidoctor/)
* [Rust language community](/case-studies/rust/)
* [Recurse Center](/case-studies/recurse-center/)
* [Rush Stack](/case-studies/rush-stack/)
* [Mixxx open-source community](/case-studies/mixxx/)
```

--------------------------------------------------------------------------------

---[FILE: age-of-consent.md]---
Location: zulip-main/templates/corporate/policies/age-of-consent.md

```text
# Age of consent by country

Our [Terms of Service](/policies/terms) state, in part:

> “if you are a child under the age of thirteen (13) or below the minimum age of
> consent in your country, please do not attempt to register for or otherwise
> use the Services or send us any personal information”

As a convenience, we provide a reference below of age of consent by country where it
is higher than our minimal requirement of 13 years of age.

## Asia

* Hong Kong: 18
* South Korea: 14
* Vietnam: 16

## Caribbean

* Aruba: 16
* Caribbean Netherlands: 16
* Curaçao: 16
* Sint Maarten: 16

## Europe

* Austria: 14
* Bulgaria: 14
* Croatia: 16
* Cyprus: 14
* Czech Republic: 15
* France: 15
* Germany: 16
* Greece: 15
* Hungary: 16
* Ireland: 16
* Italy: 14
* Lithuania: 16
* Luxembourg: 16
* Netherlands: 16
* Poland: 16
* Portugal: 16
* Romania: 16
* Russia: 18
* San Marino: 16
* Serbia: 15
* Slovakia: 16
* Slovenia: 16
* Spain: 14

## Pacific

* Australia: 15
* Indonesia: 18
* Malaysia: 18
* Philippines: 18

## South America

* Brazil: 18
* Chile: 14
* Colombia: 14
* Peru: 14
* Venezuela: 14
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/templates/corporate/policies/index.md

```text
sidebar_index.md
```

--------------------------------------------------------------------------------

---[FILE: missing.md]---
Location: zulip-main/templates/corporate/policies/missing.md

```text
No such page.
```

--------------------------------------------------------------------------------

---[FILE: privacy-before-2022.md]---
Location: zulip-main/templates/corporate/policies/privacy-before-2022.md

```text
# Privacy Policy (prior to 2022)

!!! warn ""
    Starting January 1, 2022, this policy is replaced by the updated
    [Privacy Policy](/policies/privacy).

As you use our services, we want you to be clear how we’re using
information.

Our Privacy Policy explains:

* What information we collect and why we collect it.
* How we use that information.

## Information we collect

We collect information to provide better services to all of our users.

We collect information in two ways:

* **Information you give us.** For example, many of our services
require you to sign up for a Kandra Labs Zulip Account. When you do,
we’ll ask for personal information, like your name, email address, or
telephone number.

* **Information we get from your use of our services.** We may collect
information about the services that you use and how you use them, like
when you interact with our content.  This information includes:

    * **Device information.** We may collect device-specific
    information (such as your hardware model, operating system
    version, and unique device identifiers). Kandra Labs may associate
    your device identifiers with your Kandra Labs Zulip Account.
    * **Log information.** When you use our services or view content
    provided by Kandra Labs, we may automatically collect and store
    certain information in server logs. This may include:
        * details of how you used our service.
        * Internet protocol address.
        * device event information such as crashes, system activity,
          hardware settings, browser type, browser language, the date
          and time of your request and referral URL.
        * cookies that may uniquely identify your browser or your
          Kandra Labs Zulip Account.

    * **Unique application numbers.**  Certain services include a
     unique application number. This number and information about your
     installation (for example, the operating system type and
     application version number) may be sent to Kandra Labs when you
     install or uninstall that service or when that service
     periodically contacts our servers, such as for automatic
     updates.

    * **Local storage.** We may collect and store information
    (including personal information) locally on your device using
    mechanisms such as browser web storage (including HTML 5) and
    application data caches.

    * **Cookies and anonymous identifiers.** We use various
    technologies to collect and store information when you visit our
    Zulip service, and this may include sending one or more cookies or
    anonymous identifiers to your device. We may also use cookies and
    anonymous identifiers when you interact with services we offer to
    our partners, such as Zulip features that may appear on other
    sites.

## How we use information we collect

We use the information we collect from all of our services to provide,
maintain, protect and improve them, to develop new ones, and to protect Kandra Labs
and our users.

We may use the name you provide for your Kandra Labs Zulip Account across all of the
services we offer that require an account. In addition, we may replace
past names associated with your account so that you are represented
consistently across all our services.  We may show other users your publicly
visible account information, such as your name.

When you contact Kandra Labs, we may keep a record of your communication to help
solve any issues you might be facing. We may use your email address to inform
you about our services, such as letting you know about upcoming changes or
improvements.

We use information collected from cookies and other technologies to improve
your user experience and the overall quality of our services.

We may combine personal information from one service with information,
including personal information, from other Kandra Labs services.

Kandra Labs processes personal information on our servers in many countries
around the world. We may process your personal information on a server located
outside the country where you live.


## Accessing and updating your personal information

Whenever you use our services, we aim to provide you with access to your
personal information. If that information is wrong, we strive to give you ways
to update it quickly or to delete it – unless we have to keep that information
for legitimate business or legal purposes. When updating your personal
information, we may ask you to verify your identity before we can act on your
request.

We may reject requests that are unreasonably repetitive, require
disproportionate technical effort (for example, developing a new system or
fundamentally changing an existing practice), risk the privacy of others, or
would be extremely impractical (for instance, requests concerning information
residing on backup tapes).

Where we can provide information access and correction, we will do so for
free, except where it would require a disproportionate effort. We aim to
maintain our services in a manner that protects information from accidental or
malicious destruction. Because of this, after you delete information from our
services, we may not immediately delete residual copies from our active servers
and may not remove information from our backup systems.


## Information we share

We do not share personal information with companies, organizations and
individuals outside of Kandra Labs unless one of the following circumstances
apply:


* **With your consent.** We will share personal information with
companies, organizations or individuals outside of Kandra Labs when we
have your consent to do so. We require opt-in consent for the sharing
of any sensitive personal information.

* **With domain administrators.** If your Kandra Labs Zulip Account is
managed for you by a domain administrator then your domain
administrator and resellers who provide user support to your
organization will have access to your account information (including
your email and other data). Your domain administrator may be able to:

    * view statistics regarding your account.
    * change your account password.
    * suspend or terminate your account access.
    * access or retain information stored as part of your account.
    * receive your account information in order to satisfy applicable
    law, regulation, legal process or enforceable governmental
    request.
    * restrict your ability to delete or edit information or settings.

    Please refer to your domain administrator’s privacy policy for
    more information.

* **For external processing.** We provide personal information to our
affiliates or other trusted businesses or persons to process it for
us, based on our instructions and in compliance with our Privacy
Policy.

* **For legal reasons.** We will share personal information with
companies, organizations or individuals outside of Kandra Labs if we,
in our sole discretion, determine that that access, use, preservation
or disclosure of the information is necessary to:

    * meet any applicable law, regulation, legal process or
    enforceable governmental request.

    * enforce applicable Terms of Service, including investigation of
    potential violations.

    * detect, prevent, or otherwise address fraud, security or
    technical issues.

    * protect against harm to the rights, property or safety of Kandra
    Labs, our users or the public as required or permitted by law.

We may share aggregated, non-personally identifiable information publicly
and with our partners.  For example, we may share information publicly to show
trends about the general use of our services.

We may share personal information in connection with an acquisition, merger,
or sale of all or a substantial portion of our business, with or to another
company. In any such event, you will receive notice if your data is transferred
and becomes subject to a substantially different privacy policy.

## Application

Our Privacy Policy applies to all of the services offered by Kandra Labs, Inc.
and its affiliates, including services offered on other sites, but excludes
services that have separate privacy policies that do not incorporate this
Privacy Policy.

Our Privacy Policy does not apply to services offered by other companies or
individuals, sites that may include Zulip services, or other sites linked from
our services. Our Privacy Policy does not cover the information practices of
other companies and organizations who advertise our services, and who may use
cookies, pixel tags and other technologies to serve and offer relevant ads.

## Data Protection Officer

To communicate with our Data Protection Officer, please email
data-protection-officer@zulipchat.com.

## GDPR Compliance

See the article on [Zulip's GDPR compliance](/help/gdpr-compliance)
for details on how Kandra Labs and Zulip comply with the General Data
Protection Regulation.

## Changes

Our Privacy Policy may change from time to time.  We will post the latest
version of our privacy policy on this page.

Last modified: May 7, 2021
```

--------------------------------------------------------------------------------

````

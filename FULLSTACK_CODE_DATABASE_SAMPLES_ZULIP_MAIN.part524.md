---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 524
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 524 of 1290)

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

---[FILE: communities.md]---
Location: zulip-main/templates/corporate/for/communities.md

```text
Zulip connects communities of all kinds by making it easy to chat real-time or
async. Why are communities choosing Zulip over Discord, WhatsApp, Slack,
Facebook, and other apps you might consider? Zulip provides:

- A platform that helps [community members to
  connect](#encourage-all-community-members-to-connect-real-time-or-async) and
  [communities to grow](#grow-your-community).
- A comprehensive [moderation
  toolkit](#a-moderation-toolkit-that-offers-everything-you-need).
- Control over [how to sign up](#as-public-as-you-want-it-to-be), and a [public
  access option](#as-public-as-you-want-it-to-be).
- [An open-source platform](#open-source-platform-where-your-data-is-yours),
  where your data is yours.
- [A free version, discounted pricing, and full
  sponsorships](#free-version-discounted-pricing-and-full-sponsorships-available).

> “The core of the Recurse Center is the community, and the core of our online
> community is Zulip… Switching to Zulip has turned out to be one of the best
> decisions we’ve made, and it’s impossible to imagine RC today without it. No
> other tool has a user experience that scales to a community of our size.”
>
> — Nick Bergson-Shilcock, founder and CEO, [Recurse
> Center](https://www.recurse.com/); [learn how the Recurse Center uses
> Zulip](/case-studies/recurse-center/)

If you're considering Zulip for [an open-source project](/for/open-source/) or
[research collaboration](/for/research), check out our dedicated guides.

## Encourage all community members to connect, real-time or async

When people are online at the same time, a lightweight real-time chat experience
encourages active participation, and makes interactions feel more personal.

![](/static/images/landing-page/research/interactive_messaging_day_2.png)

But community participants are often online only for a short while each day, or
they drop by every week or two to check on what's happening. A forum-style
experience makes it easier for them to participate async.

<div class="text-image-in-row">
  <p class="text-image-in-row-text">
    With conversations organized by topic, Zulip combines the best of both worlds.
    You get seamless real-time communication, with a chronological feed of messages
    in each conversation, typing notifications, presence indicators, status emoji
    — everything you might expect from a modern chat experience.
<br/><br/>
    At the same time, community members can read one conversation at a time, so
    it's easy to circle back to a topic hours later, the next day, or next week.
  </p>
  <img class="text-image-in-row-image" src="/static/images/landing-page/research/streams_and_topics_day.png" alt="Illustration of channels and topics list in Zulip">
</div>

> “When we made the switch to [@zulip](https://twitter.com/zulip) a few months
> ago for chat, never in my wildest dreams did I imagine it was going to become
> the beating heart of the community, and so quickly. It&#39;s a game changer.
> 🧑‍💻🗨️👩‍💻”

> — Dan Allen (@mojavelinux), [June 29,
2021](https://twitter.com/mojavelinux/status/1409702273400201217) &nbsp;

## A moderation toolkit that offers everything you need

Zulip's [moderation toolkit](/help/moderating-open-organizations) lets you:

- Skim the [combined message feed](/help/combined-feed) or [browse
  conversations](/help/recent-conversations) to find where moderator attention
  is needed.
- Keep discussions organized by [moving](/help/move-content-to-another-channel)
  conversations, or [splitting](/help/move-content-to-another-topic) them when
  they digress.
- Address bad behavior, for example by
  [banning](/help/deactivate-or-reactivate-a-user) the offender and
  [deleting](/help/delete-a-message) their messages.
- Fight spam in an open community, for example by [prohibiting disposable email
  addresses](/help/restrict-account-creation#dont-allow-disposable-domains).
- [Restrict permissions](/help/restrict-permissions-of-new-members) for new
  users.

Community members can [mute](/help/mute-a-user) anyone who's bothering them.

### Delegate moderation responsibilities

Permissions in Zulip can be granted to any combination of
[roles](/help/user-roles), [groups](/help/user-groups), and individual
[users](/help/introduction-to-users), so trusted community members can help
moderate. In larger communities, different people can
[administer](/help/configure-who-can-administer-a-channel) different channels.

## Grow your community

### Lots of activity, but no chaos

On Zulip, dozens of discussions can happen in parallel,
without getting in each other's way: Zulip's
[channels](/help/introduction-to-channels) and
[topics](/help/introduction-to-topics) create dedicated spaces for each
conversation.

Participants can ask a question or kick off a new discussion without having to worry
about interrupting.

>  “Zulip helped the FHIR community grow from a tiny group of dreamers to 500
>  active users sending 6000 messages per month, all driving the creation of
>  better healthcare standards. Zulip’s topic-based threading helps us manage
>  simultaneous discussions with clarity, ensuring the right people can pay
>  attention to the right messages. This makes our large-group discussion far
>  more manageable than what we’ve experienced with Skype and Slack.”

> — Grahame Grieve, founder, FHIR health care standards body

### Occasional participants welcome

Community members often have just a bit of time to participate, and folks
with the deepest expertise might also be the most busy. To stay connected with your
group, they need to quickly discover conversations that are interesting to them
when they drop by.

With traditional chat tools like Discord or WhatsApp, occasional participants
usually skim just the last few messages. If those messages don't spark interest,
they'll bounce for the day, and eventually stop coming by altogether.

Zulip's list of [recent conversations](/help/recent-conversations) offers a
quick overview of what's been happening in your community. It's easy to scan the
list of topics to find which ones you want to dive into.

> “I had never engaged with the Changelog podcast community in Slack because I
> always got too overwhelmed with the linear flow of conversations. Topic based
> systems are such a fresh breath of air.”

> — [Siddhartha Golu](https://www.siddharthagolu.com/),
>   [Changelog](https://changelog.com/podcast) community member

### Many ways to participate

You can use Zulip from the browser, a [desktop app](/apps), and Android and iOS
mobile devices. If you prefer a [Terminal
app](https://github.com/zulip/zulip-terminal#readme) or just want to use it
[from your email](/help/using-zulip-via-email), you can do that too.

Zulip's apps offer lots of ways to customize your experience, including [dark
and light themes](/help/dark-theme), flexible [font size](/help/font-size) and
[line spacing](/help/line-spacing), configurable [notification
options](/help/channel-notifications), and much more. There are convenient
[keyboard shortcuts](/help/keyboard-shortcuts) for all the common actions.

Zulip's UI is translated into over two dozen [languages](/help/change-your-language).

## As public as you want it to be

Your community can require an invitation to join, or you can [allow anyone to
create an
account](/help/restrict-account-creation#set-whether-invitations-are-required-to-join).
You can use:

- [Private channels](/help/channel-permissions#private-channels) for
  conversations only some community members should have access to (e.g.,
  discussions among organizers).
- [Public channels](/help/channel-permissions#public-channels) for
  conversations all community members can see.
- [Web-public channels](/help/channel-permissions#web-public-channels) for
  discussions anyone on the internet should be able to read without logging in.
  Posting always requires log in.

## Open-source platform, where your data is yours

Zulip is [100% open-source software](https://github.com/zulip), so you always
know what you're running. There are no ads, and we [don't sell your
data](https://zulip.com/policies/privacy#how-we-share-your-personal-data), or
[feed it to AI
models](https://blog.zulip.com/2024/05/23/self-hosting-keeps-your-private-data-out-of-ai-models/).

If you're looking for a simple, reliable SaaS solution, it only takes
a minute to [sign up for Zulip Cloud](https://zulip.com/new/). It's
professionally operated and is always up to date with the latest
features.

For full control over your data, follow our simple [installation
instructions](https://zulip.readthedocs.io/en/stable/production/install.html) to
host Zulip yourself. If you like, you can develop [custom
integrations](/api/incoming-webhooks-overview) and
[features](https://zulip.readthedocs.io/en/stable/production/modify.html). If
your needs change, you can always move [from self-hosting to Zulip
Cloud](/help/move-to-zulip-cloud) or [the other
way](https://zulip.readthedocs.io/en/stable/production/export-and-import.html#import-into-a-new-zulip-server).

> "We just moved the Lichess team (~100 persons) to <a
> href="https://twitter.com/zulip">@zulip</a>, and I&#39;m loving it. The topics
> in particular make it vastly superior to slack &amp; discord, when it comes to
> dealing with many conversations. Zulip is also open-source!"

> — <a href="https://twitter.com/ornicar">Thibault D (@ornicar)</a>

## Free version, discounted pricing, and full sponsorships available

We sponsor over 1,500 organizations, and most non-business uses of Zulip are
eligible for discounted pricing or full sponsorship.

- **Zulip Cloud:** Many communities that are working towards the public good are
  eligible for a fully sponsored [Zulip Cloud Standard plan](/plans/#cloud).
  Other community groups pay a highly discounted rate, or use [Zulip Cloud
  Free](/plans/#cloud). [Learn
  more.](/help/zulip-cloud-billing#free-and-discounted-zulip-cloud-standard)

- **Self-hosting**: Communities and personal organizations (clubs,
  groups of friends, volunteer groups, etc.) are eligible for our
  [Community plan](/help/self-hosted-billing#free-community-plan) for
  self-hosted organizations.

## Other apps you might consider

We’ve talked to hundreds of people about their experiences with
community chat. Here are some reasons why folks choose Zulip over
other apps you might consider for hosting your community.

> “Zulip makes all my Slack and Discord communities feel tedious by comparison.”

> — AJ Kerrigan, [Changelog](https://changelog.com/podcast) community member

### Group chat apps (WhatsApp, Telegram, Signal, Messenger, etc.)

Group chat apps can be convenient for small or low-activity groups,
but managing an active community quickly becomes unwieldy. Having more
than one conversation at a time in a single group chat feels chaotic,
and membership management is a big pain if you try to solve that by
using several group chats.

### Discord

In Discord, only the latest messages are easy to read and reply
to. Many less frequent participants will miss much of what's
happening in an active community.

You're also subjecting community members to intrusive in-app
advertising, even if they purchase Discord's paid plans.

### Slack

Like Discord, Slack doesn't work well for less frequent participants in an
active community. Additionally, on Slack's free plan, messages are hidden after
90 days, and are permanently deleted after a year. Slack's paid plans are
generally unaffordable for community use.

### Facebook

On Facebook, your relationship with your community is mediated by
algorithms: even replies to a user's own post are by default resorted
and partially hidden from them. From Meta's perspective, advertisers
are the customers, and your attention is the product being sold.

>  “I highly recommend Zulip to other communities… Slack is a no-go for many due
>  to not being FLOSS, and I’m concerned about vendor lock-in if they were to
>  stop being so generous. Slack’s threading model is much worse than Zulip’s
>  IMO. The channels/topics flow is an incredibly intuitive way to keep track of
>  everything that is going on.”

> — RJ Ryan, Mixxx Developer
```

--------------------------------------------------------------------------------

---[FILE: education.html]---
Location: zulip-main/templates/corporate/for/education.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Zulip for education" %}

{% set PAGE_DESCRIPTION = "Make Zulip the communication hub for your class.
  Online, in-person, and anything in between. Free for most classes!" %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}


<div class="portico-landing why-page solutions-page">
    <div class="hero bg-education">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Teach a course with Zulip.</h1>
            <p>Online, in-person, and anything in between. <br/><a href="#feature-pricing">Free</a> for most classes!</p>
        </div>
        <div class="hero-text">
            Learn how <a href="/case-studies/tum/">Technical University of Munich</a>,
            <br /><a href="/case-studies/ucsd/">University of California San Diego</a>,
            <br />and <a href="/case-studies/recurse-center/">Recurse Center</a> are using Zulip.
        </div>
        <div class="hero-buttons center">
            <a href="/new/" class="button">
                {{ _('Create organization') }}
            </a>
            <a href="#feature-pricing" class="button">
                {{ _('Education pricing') }}
            </a>
            <a href="/self-hosting/" class="button">
                {{ _('Self-host Zulip') }}
            </a>
        </div>
    </div>

    <div class="feature-intro">
        <h1 class="center"> Make Zulip the communication hub for your class. </h1>
        <p>
            Zulip is the <a href="/why-zulip/">organized team chat</a> app that is ideal for both live and asynchronous conversations. Post lecture notes and announcements, answer students’ questions, and coordinate with teaching staff all in one place.
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
                            <a href="/help/introduction-to-topics">Zulip topics</a> create a separate space for each discussion.
                        </div>
                    </li>
                    <li><div class="list-content"> Questions and answers are easy to find, so each question is only asked once.</div></li>
                    <li><div class="list-content">Refer to relevant points by <a href="/help/link-to-a-message-or-conversation">linking to a message or a topic.</a></div></li>
                    <li><div class="list-content">Keep discussions orderly by <a href="/help/rename-a-topic">moving</a> or <a href="/help/move-content-to-another-topic">splitting</a> topics when conversations digress.</div></li>
                    <li><div><a href="/help/resolve-a-topic">Mark the topic ✓ resolved</a> when done!</div></li>

                </ul>
                <div class="quote">
                    <blockquote>
                        Zulip has the best user experience of all the chat apps I’ve tried. With the discussion organized by topic within each channel, Zulip is the only app that makes hundreds of conversations manageable.
                    </blockquote>
                    <div class="author">
                        &mdash; <a href="https://ciip.in.tum.de/people/lasser.html">Tobias Lasser</a>, lecturer at the Technical University of Munich Department of Informatics
                    </div>
                    <a class="case-study-link" href="/case-studies/tum/" target="_blank">Learn more about how TUM uses Zulip ↗</a>
                </div>
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-image topics-image">
                <img alt="" src="{{ static('images/landing-page/education/streams_and_topics_day.png') }}" />
            </div>
        </div>
    </div>

    <div class="feature-container alternate-grid">
        <div class="feature-half md-hide">
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/education/message_formatting_day_1.png') }}" />
            </div>
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/education/message_formatting_day_2.png') }}" />
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Powerful formatting
                </h1>
                <ul>
                    <li><div class="list-content"><a href="/help/format-your-message-using-markdown#latex">Type LaTeX</a> directly into your Zulip message, and see it beautifully rendered.</div></li>
                    <li><div class="list-content">Structure your points with bulleted and numbered <a href="/help/format-your-message-using-markdown#lists">lists</a>.</div></li>
                    <li><div class="list-content"><a href="/help/code-blocks">Zulip code blocks</a> come with syntax highlighting for over 250 languages, and integrated <a href="/help/code-blocks#code-playgrounds">code playgrounds.</a></div></li>
                </ul>
                <div class="quote">
                    <blockquote>
                        I used Piazza &amp; Zulip. Piazza lets students ask questions anonymously. Zulip better all-around for chatting, announcements, group work (has built-in LaTeX, as well as threading). Zulip basically replaced email for my class. Easy to pick up if you&#39;ve used Slack &amp; email before.
                    </blockquote>
                    <div class="author">
                        &mdash; Joshua Grochow (@joshuagrochow), <a href="https://twitter.com/joshuagrochow/status/1336008355911970822">December 7, 2020</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="feature-half md-display">
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/education/message_formatting_day_1.png') }}" />
            </div>
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/education/message_formatting_day_2.png') }}" />
            </div>
        </div>
    </div>

    <div class="feature-container">
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Interactive messaging
                </h1>
                <ul>
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
                    <li><div class="list-content">Hide answers behind <a href="/help/format-your-message-using-markdown#spoilers">spoilers</a>, letting students think before they read.</div></li>
                    <li><div class="list-content">Share lecture notes and reading materials with <a href="/help/share-and-upload-files">drag-and-drop file uploads</a>.</div></li>
                </ul>
                <div class="quote">
                    <blockquote>
                        Participants across six continents signed up for my graduate-level classes when I decided to open them up to the world during the pandemic. Zulip became a central hub for asynchronous Q&A and posting Zoom links for lectures, whiteboard PDFs, and announcements. Zulip’s topics, and the ability to change the topic of someone else's message, has made it much easier for me to keep things coherent. It’s super easy to discuss technical material using the TeX integration, and spoilers are a great way to answer questions about homework without depriving students of a chance to keep thinking about the problem on their own.
                    </blockquote>
                    <div class="author">
                        &mdash; <a href="https://kskedlaya.org/">Kiran S. Kedlaya</a>, Professor of Mathematics at University of California San Diego
                    </div>
                    <a class="case-study-link" href="/case-studies/ucsd/" target="_blank">Learn more about how UCSD uses Zulip ↗</a>
                </div>
            </div>
        </div>
        <div class="feature-half">
            <div class="message-screenshot message-starred">
                <img alt="" src="{{ static('images/landing-page/education/interactive_messaging_day_1.png') }}" />
            </div>
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/education/interactive_messaging_day_2.png') }}" />
            </div>
            <div class="message-screenshot">
                <img alt="" src="{{ static('images/landing-page/education/interactive_messaging_day_3.png') }}" />
            </div>
        </div>
    </div>

    <div class="feature-container alternate-grid">
        <div class="feature-half md-hide">
            <div class="feature-image">
                <img alt="" src="{{ static('images/landing-page/education/flexible-administration.svg') }}" />
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Flexible administration and moderation
                </h1>
                <ul>
                    <li><div class="list-content">Zulip offers dozens of features for <a href="/help/moderating-open-organizations">moderating discussions.</a></div></li>
                    <li>
                        <div class="list-content">Assign permissions to course staff with <a
                            href="/help/manage-permissions">fine-grained settings</a> for <a
                            href="/help/user-roles">user roles</a>, <a
                            href="/help/user-groups">user groups</a> (like TAs), and <a
                            href="/help/introduction-to-users">individual
                            users</a>.
                        </div>
                    </li>
                    <li><div class="list-content">Make an announcement channel where only course staff <a href="/help/channel-posting-policy">can post messages</a>.</div></li>
                    <li><div class="list-content">Quickly add staff and students to the right channels. Automatically subscribe users <a href="/help/set-default-channels-for-new-users">when they join</a>, subscribe a <a href="/help/user-groups">group of users</a>, or copy membership from another channel.</div></li>
                </ul>
            </div>
        </div>
        <div class="feature-half md-display">
            <div class="feature-image">
                <img alt="" src="{{ static('images/landing-page/education/flexible-administration.svg') }}" />
            </div>
        </div>
    </div>


    <div class="feature-container">
        <div class="feature-half">
            <div class="feature-text">
                <h1>
                    Maintain student privacy
                </h1>
                <ul>
                    <li>
                        <div class="list-content">
                            Zulip Cloud is built with <a href="/policies/privacy">privacy</a> and <a href="/security/">security</a> in mind. We will never sell data or ads.
                        </div>
                    </li>
                    <li><div class="list-content">Zulip is <a href="https://github.com/zulip">100% open source</a>. We work hard to make it <a href="https://zulip.readthedocs.io/en/latest/production/install.html">easy to set up</a> and run a self-hosted Zulip installation, where you have full control of the data.</div></li>
                    <li><div class="list-content">Email addresses <a href="/help/configure-email-visibility">can be hidden</a>, and students <a href="/help/status-and-availability#disable-updating-availability">don’t have to share</a> when they are online.</div></li>
                    <li><div class="list-content">Students can <a href="/help/mute-a-user">mute</a> anyone they'd rather not interact with.</div></li>
                </ul>
            </div>
        </div>
        <div class="feature-half">
            <div class="feature-image">
                <img alt="" src="{{ static('images/landing-page/education/privacy.svg') }}" />
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
                    Never miss a beat
                </h1>
                <ul>
                    <li>
                        <div class="list-content">
                            With <a href="/apps/">apps for every platform</a>, you can check Zulip at your computer or on your phone.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">
                            Zulip alerts you about timely messages with
                            <a href="/help/channel-notifications">fully customizable</a> mobile, email and desktop notifications.
                        </div>
                    </li>
                    <li>
                        <div class="list-content">Mention <a href="/help/mention-a-user-or-group">users</a>, <a href="/help/user-groups">groups of users</a> or <a href="/help/dm-mention-alert-notifications#wildcard-mentions">everyone</a> when you need their attention.</div>
                    </li>
                    <li>
                        <div class="list-content">Use Zulip in your language of choice, with translations into <a href="https://hosted.weblate.org/projects/zulip/">23 languages</a>.</div>
                    </li>
                    <li>
                        <div class="list-content">Zulip works reliably for organizations with thousands of users online at once.</div>
                    </li>
                </ul>
                <div class="quote">
                    <blockquote>
                        We are a public university that offers free education to
                        33,000 students across 13 cities in Brazil. We started
                        using Zulip in early 2020, and it works perfectly for
                        our needs. Zulip’s interface is simple and intuitive.
                    </blockquote>
                    <div class="author">
                        &mdash; Rafael Cordeiro, head of IT at <a href="https://www.utfpr.edu.br/">UTFPR</a>
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

    <div class="feature-end">
        <div class="feature-pricing" id="feature-pricing">
            <h1 class="center"> Zulip Cloud for Education plans </h1>
            <div class="for-education-pricing-model">
                <div class="padded-content">
                    <div class="pricing-container">
                        <div class="price-box" id="for-education-free-price-box" tabindex="-1">
                            <div class="text-content">
                                <h2>Free</h2>
                                <div class="description">
                                    Recommended for a typical class.
                                </div>
                                <hr />
                                <ul class="feature-list">
                                    <li>All features on this page</li>
                                    <li>10,000 messages of search history</li>
                                    <li>File storage up to 5 GB total</li>
                                    <li><a href="/features/">Complete</a> team chat solution</li>
                                    <li><a href="/integrations/">Hundreds of integrations</a></li>
                                    <li>Advanced <a href="/help/user-roles">roles</a> and <a href="/help/manage-permissions">permissions</a></li>
                                    <li><a href="/help/guest-users">Guest</a> accounts</li>
                                </ul>
                            </div>
                            <div class="bottom">
                                <div class="text-content free-text">
                                    <div class="pricing-details">
                                        Free
                                    </div>
                                    <a href="/new/" class="button green">
                                        Create organization
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="price-box" tabindex="-1">
                            <div class="text-content">
                                <h2>Standard for Education</h2>
                                <div class="description">
                                    For large classes and departments.
                                </div>
                                <hr />
                                <ul class="feature-list">
                                    <li>Unlimited search history</li>
                                    <li>File storage up to 5 GB per user</li>
                                    <li><a href="/help/message-retention-policy">Message retention policies</a></li>
                                    <li>Brand Zulip with your logo</li>
                                    <li>Priority commercial support</li>
                                    <li><a href="/help/public-access-option">Public access option</a></li>
                                    <li>Additional legal agreements</li>
                                </ul>
                            </div>
                            <div class="bottom">
                                <div class="text-content">
                                    <div class="standard-price-box">
                                        <p>Education (for-profit)</p>
                                        <div class="price">1</div>
                                        <div class="details">
                                            <span class="pricing-period">per user per month</span>
                                            <br />
                                            with annual billing discount
                                            <br />
                                            $1.20/month billed monthly
                                        </div>
                                    </div>
                                    <div class="standard-price-box">
                                        <p>Education (non-profit)</p>
                                        <div class="price">0<span class="price-cents">.67</span></div>
                                        <div class="details">
                                            <span class="pricing-period">per user per month</span>
                                            <br />
                                            with annual billing discount
                                            <br />
                                            $0.80/month billed monthly
                                        </div>
                                    </div>
                                    <a href="/accounts/go/?next=/sponsorship/" class="button green standard-register-button">
                                        Request education pricing
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="price-asterisk">
                <a href="/help/zulip-cloud-billing#education-pricing">Learn
                more</a> about education pricing, or contact <a
                href="mailto:sales@zulip.com">sales@zulip.com</a> with any
                questions.
            </p>
        </div>

        <p>
            Learn about using Zulip
            for <a href="/for/events/">conferences</a> and
            <a href="/for/research/">research communities</a>.  If you have any
            questions or feedback, please contact us
            at <a href="mailto:sales@zulip.com">sales@zulip.com</a>. You
            can also drop by
            our <a href="/development-community/">friendly development
            community at chat.zulip.org</a> to ask for help or suggest
            improvements!
        </p>
    </div>

    {% include "corporate/compare-education.html" %}

</div>

{% endblock %}
```

--------------------------------------------------------------------------------

````

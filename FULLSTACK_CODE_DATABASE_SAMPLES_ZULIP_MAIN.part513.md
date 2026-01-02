---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 513
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 513 of 1290)

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

---[FILE: history.md]---
Location: zulip-main/templates/corporate/history.md

```text
## Startup inspired by MIT's messaging system

Zulip was originally created by Zulip, Inc., a small startup in Cambridge,
Massachusetts.  Zulip, Inc. was founded in August 2012 by the
[MIT](https://www.mit.edu/) alumni team that previously created the
[Ksplice](https://www.ksplice.com) software for live-patching a running Linux
kernel.  Zulip was inspired by the [BarnOwl](https://barnowl.mit.edu/) client
for the [Zephyr](https://en.wikipedia.org/wiki/Zephyr_(protocol)) instant
messaging protocol, and the incredible community that Zephyr supported at MIT.

## Early acquisition by Dropbox

Zulip, Inc. was acquired by [Dropbox](https://www.dropbox.com/) in
early 2014, while the product was still in private beta, which put
Zulip development on hold. However, because they loved Zulip's
topic-based threading experience, Zulip's early customers [continued
using Zulip all through that time](/case-studies/recurse-center/).

> “We strongly prefer Zulip to other options for several reasons – its message
> threading being a key one.”
>
> — [Nick Bergson-Shilcock](https://github.com/nicholasbs), Recurse Center
> [co-founder and CEO](https://www.recurse.com/team), September 2015

## Zulip released as open source!

In 2015, a year and a half after the acquisition, Dropbox generously decided to
[release Zulip as open-source software](https://blogs.dropbox.com/tech/2015/09/open-sourcing-zulip-a-dropbox-hack-week-project/).

A group of Zulip's developers [and early
users](https://www.recurse.com/blog/90-zulip-supporting-oss-at-the-recurse-center)
spent Dropbox's Hack Week preparing Zulip's code base for release. The
entire product, including the server, Android and iOS mobile apps, and
desktop apps for Mac, Linux and Windows, was released [under the Apache
2 license](https://github.com/zulip/zulip/blob/main/LICENSE) with
complete version control history.

The Zulip community is incredibly grateful to both Dropbox and those
enthusiastic early users for making the Zulip open source project possible.
Dropbox has no ongoing relationship with the Zulip project.

## Zulip's second founding

At first, the [Zulip open-source project](https://github.com/zulip/zulip#readme)
was maintained by the project's founder and leader [Tim
Abbott](/team/#the-core-team) on nights and weekends. In the months following
the open-source release, the project quickly gained contributors and users.

It soon became clear that guiding the contributor community in developing a
world-class team chat product would require leadership from a dedicated team.
Thus, in April 2016, Tim Abbott founded a [mission-driven](/values/) company,
Kandra Labs, to steward and financially sustain Zulip’s development.
Incorporating as a business has helped Zulip attract top talent, and has made
Zulip eligible for [large innovation grants](https://seedfund.nsf.gov/) from the
US National Science Foundation, which Kandra Labs was awarded in 2017 and 2018.

## Early days as an open-source company

In its early days, the Zulip community was focused on three main goals:

- Turning an innovative product (that had been in private beta when its
  development was put on hold) into a **polished application**, complete with
  enterprise-ready features like [single sign-on
  options](/help/configure-authentication-methods) and [hundreds of
  integrations](/integrations/).

- Making Zulip more **widely available**. In mid-2017, Kandra Labs
  launched two products: a hosted [Zulip Cloud](/plans/) service, and
  an enterprise support offering for [self-hosted](/self-hosting/)
  deployments. Zulip’s original customers were migrated from Dropbox’s
  servers to the new Zulip Cloud offering, fully preserving their chat
  history. Despite the acquisition by Dropbox, Zulip's customers have
  thus [enjoyed uninterrupted
  service](https://blog.zulip.com/2021/12/17/why-zulip-will-stand-the-test-of-time/)
  since 2013.

- **Building a vibrant community around the project**, with effort and
  care dedicated to making it [easy to get
  started](https://zulip.readthedocs.io/en/latest/overview/contributing.html)
  contributing to Zulip. The Zulip development community gathered at
  PyCon sprints [in
  2016](https://blog.zulip.org/2016/10/13/static-types-in-python-oh-mypy/),
  and led the largest PyCon sprint ever [in
  2017](https://us.pycon.org/2017/community/sprints/), with over 75
  developers contributing to Zulip over course of the 4-day event. By
  late 2016, [more than 150
  people](https://github.com/zulip/zulip/graphs/contributors) from all
  over the world had contributed almost 1000 pull requests to the
  software, and the Zulip project was moving faster than when the
  original startup employed 11 full-time engineers. Zulip also began
  mentoring [Google Summer of
  Code](https://developers.google.com/open-source/gsoc/) contributors
  in 2016, and continues to [mentor 15-20 outreach program
  participants](https://zulip.readthedocs.io/en/latest/outreach/overview.html)
  every year.

We are proud to have achieved those early goals for the
project.

## Zulip continues to thrive

These days, we regularly hear from users that they prefer Zulip's user
experience to that of team chat products produced by some of the
world's largest companies. More than 1000 people have contributed a
total of over 60,000 commits to the Zulip project, which has more than
16 thousand stars on GitHub.

In 2020, Zulip experienced an extraordinary increase in usage as a result of
the Covid-19 pandemic changing how people work. During this extremely difficult
time, we found joy in hearing from users about how Zulip has helped them make
[remote work](/for/business/), [research collaborations](/for/research/),
[teaching](/for/education/), and [events and conferences](/for/events/)
successful.

Starting August 2022, [Slack’s free plan change caused an
exodus](https://blog.zulip.com/2022/08/26/why-slacks-free-plan-change-is-causing-an-exodus/)
of open-source projects, researchers, and a wide variety of other
negatively impacted communities to Zulip and other chat
platforms. [Data imports](/help/import-from-slack) from Slack into
Zulip Cloud increased an incredible 40x in the month after Slack’s
[announcement](https://slack.com/blog/news/pricing-and-plan-updates).

In 2023, Zulip earned first place in [GetApp’s Collaboration Software Category
Leaders
report](https://www.getapp.com/collaboration-software/web-collaboration/category-leaders/).
With over 100 reviews on Capterra, Zulip's 4.8 star rating beat out reviews for
other team chat apps, earning Capterra's [Best Value
badge](https://www.capterra.com/p/197945/Zulip/).

## Press highlights

- June 2025: Zulip's head of product is interviewed about how we’ve built a
  welcoming open-source community around Zulip [on the Business of Open Source
  podcast](https://open.spotify.com/episode/3KMLGk4buv8zfDxTjVnChw).

- September 2024: An in-depth interview with Zulip’s head of product [on The
  Changelog podcast](https://changelog.com/podcast/607): *“We talk about Zulip’s
  origins, how it’s open source, the way it’s led, no VC funding, what makes it
  different/better, how you can self-host it or use their cloud, moving to
  Zulip, contributing and being a part of the community… all the things.”*

- June 2024: An in-depth [review of
  Zulip](https://www.hostingadvice.com/blog/emerging-open-source-team-chat-app-set-to-rival-slack/)
  is published on [HostingAdvice.com](https://www.hostingadvice.com/).

> "An excellent solution for teams collaborating across different time zones."
>
> — [Zulip
> review](https://www.hostingadvice.com/blog/emerging-open-source-team-chat-app-set-to-rival-slack/)
> on *HostingAdvice.com*

- March 2023: A long-form [video
  interview](https://www.youtube.com/watch?v=cbj59mVwErg) with Zulip’s founder
  and project leader about Zulip’s history, our goals for the product and how we
  approach its design, Zulip’s engineering philosophy, and more produced by
  [FUTO](https://futo.org/).

- March 2022:
  [Deep-dive](https://opensource.com/article/22/3/open-source-chat-zulip) into
  how one open-source community uses Zulip published on
  [opensource.com](https://opensource.com/).

- June 2021: Zulip is covered in a [VentureBeat
  article](https://venturebeat.com/2021/06/18/cutting-slack-when-open-source-and-team-chat-tools-collide/)
  about open-source Slack alternatives.

- February 2021: TechRadar publishes a [Zulip overview and installation
  walkthrough](https://www.techradar.com/how-to/set-up-your-own-slack-like-chat-system-on-linux).

- July 2021: An in-depth [review of
  Zulip](https://www.theregister.com/2021/07/28/zulip_open_source_chat_collaboration_software/)
  is published in *[The Register](https://www.theregister.com)*.

> “In fact now it seems strange to me to just fire off messages in Slack with no
> subject – that's chaos, madness. The genius of subject lines is that you can
> quickly and easily catch up on the messages you missed in your off-hours...
> This feature alone saves me hours a week.”
>
> — [Zulip
> review](https://www.theregister.com/2021/07/28/zulip_open_source_chat_collaboration_software/)
> in *The Register*

- [July
  2021](https://www.quantamagazine.org/lean-computer-program-confirms-peter-scholze-proof-20210728/)
  and [October
  2020](https://www.quantamagazine.org/building-the-mathematical-library-of-the-future-20201001/):
  Zulip earns mentions in Quanta Magazine articles about the [formalization of
  mathematics](/case-studies/lean/).

> “Every day, dozens of like-minded mathematicians gather on an online forum
> called Zulip to build what they believe is the future of their field.”
>
> — *Quanta Magazine*, [“Building the Mathematical Library of the
> Future“](https://www.quantamagazine.org/building-the-mathematical-library-of-the-future-20201001/)

- November 2020: An interview with Tim Abbott is [featured in Linux
  Format](https://linuxformat.com/archives?issue=269).

- September 2020: [TFiR](https://www.tfir.io/) publishes an [in-depth video
  interview](https://www.tfir.io/zulip-is-slack-for-busy-project-managers/) with
  Zulip founder and lead developer Tim Abbott.

- July 2017: Podcast [interview with Tim
  Abbott](https://www.pythonpodcast.com/zulip-chat-with-tim-abbott-episode-118/)
  is featured on the Python podcast
  [Podcast.__init__](https://www.pythonpodcast.com/about/).

## Major server releases and product announcements

- August 2025: [Zulip Server 11.0
  released](https://blog.zulip.com/2025/08/13/zulip-11-0-released/), with over
  3300 new commits. 76 people contributed commits to Zulip since the 10.0
  release.

- June 2025: Zulip’s next-generation mobile app for Android and iOS, built on
  Flutter,
  [becomes](https://blog.zulip.com/2025/06/17/flutter-mobile-app-launched/) the
  official mobile app.

- March 2025: [Zulip Server 10.0
  released](https://blog.zulip.com/2025/03/20/zulip-10-0-released/), with over
  5200 new commits. 121 people contributed commits to Zulip since the 9.0
  release.

- March 2025: Zulip
  [announces](https://blog.zulip.com/2025/03/20/flexible-permissions-management/)
  a new flexible system for permissions management. Zulip users can now grant
  permissions across the app to any combination of roles, groups, and individual
  users.

- July 2024: [Zulip Server 9.0
  released](https://blog.zulip.com/2024/07/25/zulip-9-0-released/), with over
  5300 new commits. 124 people contributed commits to Zulip since the 8.0
  release.

- December 2023: [Zulip Server 8.0
  released](https://blog.zulip.com/2023/12/15/zulip-8-0-released/), with over
  4700 new commits. 116 people contributed commits to Zulip since the 7.0
  release. Zulip announces new [plans](/plans#self-hosted) for self-hosted
  customers.

- May 2023: [Zulip Server 7.0
  released](https://blog.zulip.com/2023/05/31/zulip-7-0-released/), with over
  3800 new commits. 107 people contributed commits to Zulip since the 6.0
  release.

- November 2022: [Zulip Server 6.0
  released](https://blog.zulip.com/2022/11/17/zulip-6-0-released/), with over
  3400 new commits. 118 people contributed commits to Zulip since the 5.0
  release.

- May 2022: Zulip
  [announces](https://blog.zulip.com/2022/05/05/public-access-option/) the
  general availability of a [public access option](/help/public-access-option).
  Open-source projects and other open communities can now offer one-click access
  (no login required!) to part or all of their Zulip chat.

- March 2022: [Zulip Server 5.0
  released](https://blog.zulip.com/2022/03/29/zulip-5-0-released/), with over
  7000 new commits. 157 people contributed commits to Zulip since the 4.0
  release.

- July 2021: In response to [interest from educators](/case-studies/ucsd/),
  Zulip
  [launches](https://blog.zulip.com/2021/07/26/zulip-for-education-launch/) a
  dedicated [Zulip for Education](/for/education/) offering.

> “Zulip has the best user experience of all the chat apps I’ve tried. With the
> discussion organized by topic within each channel, Zulip is the only app that
> makes hundreds of conversations manageable.”
>
> — [Tobias Lasser](https://ciip.in.tum.de/people/lasser.html), lecturer at the
> Technical University of Munich Department of Informatics [[customer
> story](/case-studies/tum/)]

- May 2021: [Zulip Server 4.0
  released](https://blog.zulip.com/2021/05/13/zulip-4-0-released/), with over 4300
  new commits by 137 contributors.

> “This has been an unusually long release cycle, because I took a few months off
> work on Zulip to welcome my new daughter Zoe. Coming back to work was a great
> stress-test of Zulip’s asynchronous model: I received over 20,000 messages in
> chat.zulip.org during my paternity leave. I really enjoyed reading everything
> and replying to the hundreds of topics where I had something to contribute or
> someone to thank. Systematically reading months of history would have been
> impossible with any other tool!”

> —Tim Abbott, Zulip founder and lead developer, [Zulip 4.0 release blog
> post](https://blog.zulip.com/2021/05/13/zulip-4-0-released/)

- July 2020: [Zulip Server 3.0
  released](https://blog.zulip.com/2020/07/16/zulip-3-0-released/), with 4100
  new commits by 110 contributors.

- March 2019: [Zulip Server 2.1
  released](https://blog.zulip.com/2019/12/13/zulip-2-1-released/), with 3190
  new commits by 123 contributors.

- March 2019: [Zulip Server 2.0
  released](https://blog.zulip.com/2019/03/01/zulip-2-0-released/), with 1900
  new commits by 87 contributors.

- November 2018: [Zulip Server 1.9
  released](https://blog.zulip.com/2018/11/07/zulip-1-9-released/), with 3300
  new commits by 81 contributors.

- April 2018: [Zulip Server 1.8
  released](https://blog.zulip.com/2018/04/18/zulip-1-8-released/), with over
  3500 new commits by 131 contributors.

- October 2017: [Zulip Server 1.7
  released](https://blog.zulip.com/2017/10/25/zulip-server-1-7-released/), with 3675
  new commits by about 100 contributors.

- June 2017: [Zulip Server 1.6
  released](https://blog.zulip.com/2017/06/06/zulip-server-1-6-released/), with
  over 3100 new commits by more than 150 contributors.

## Support

- Zulip is on [GitHub Sponsors](https://github.com/sponsors/zulip),
  [Patreon](https://www.patreon.com/zulip), and [Open
  Collective](https://opencollective.com/zulip). Our [blog
  post](https://blog.zulip.com/2021/04/28/why-zulip-is-on-github-sponsors/)
  explains Zulip’s values-driven approach and why we ask for support.

- Kandra Labs is supported by nearly $1M in <a
  href="https://seedfund.nsf.gov/">SBIR grants</a> from the US National Science
  Foundation.

- Zulip has benefited enormously from the work of over 100 contributors
  supported by [Google Summer of Code](https://summerofcode.withgoogle.com/).
```

--------------------------------------------------------------------------------

---[FILE: jobs.html]---
Location: zulip-main/templates/corporate/jobs.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Jobs | Zulip" %}

{% set PAGE_DESCRIPTION = "We're hiring! Learn about our openings and how to
  apply." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing jobs why-page">
    <div class="hero bg-pycon drone">
        <div class="bg-dimmer"></div>
        <div class="content">
            <h1 class="center">Work with us</h1>
            <p>We're 100% open source, and we're hiring.</p>
        </div>
    </div>

    <div class="main">
        <div class="padded-content">
            <div class="inner-content markdown">
                <div class="open-positions">
                    <h1 id="open-positions">Open positions</h1>
                    <p>

                        To apply for an open position, please send your <b>resume</b>
                        and a brief <b>cover letter</b> (which can be in the
                        body of your email) to the email provided in the
                        description for the opening. Your cover letter should
                        explain what makes you excited about working at Zulip in
                        the role you're applying for. Applications without a
                        cover letter will not be considered.
                    </p>
                    <p>
                        We are not actively recruiting for any engineering roles
                        at this time. However, if you are an experienced
                        engineer, and you believe that your background would be
                        a great fit for Zulip, please email us at <a
                        href="mailto:jobs+engineer@zulip.com">jobs+engineer@zulip.com</a>
                        with your resume and cover letter.
                    </p>
                    <p>
                        All openings are remote, or partially in-person in our San Francisco, CA office.
                    </p>
                    <hr/>
                    <h2 id="gtm">Go-to-market leader (full-time)</h2>
                    <p>
                        <a href="/">Zulip</a> is an open-source team chat
                        application designed for seamless remote and hybrid
                        work. With conversations organized by topic, Zulip is
                        <a href="/why-zulip">ideal</a> for both live and
                        asynchronous communication. Zulip’s 100% open-source
                        software is available as a
                        <a href="/plans/#cloud">cloud service</a> or a
                        <a href="/self-hosting">self-hosted solution</a>, and is
                        used by thousands of organizations around the world.
                    </p>
                    <p>
                        We’re increasing our focus on go-to-market initiatives,
                        and are looking for a go-to-market leader with hands-on
                        B2B startup experience to take our business to the next
                        level. You'll be working closely with the COO (who's
                        currently driving go-to-market efforts) and the CEO to
                        develop new and existing markets for our product.
                    </p>
                    <h3>You'll build on the strength of an amazing product to
                        develop an amazing business:
                    </h3>
                    <ul>
                        <li>Own and drive the company’s GTM strategies.</li>
                        <li>
                            Develop market hypotheses, and run experiments to
                            figure out where to go deeper. You'll be responsible
                            for both vision and hands-on execution (with
                            appropriate support from the rest of the team).
                        </li>
                        <li>
                            Build out processes and teams to scale what's
                            working.
                        </li>
                        <li>
                            Work closely with the other leaders to align product
                            and GTM strategy.
                        </li>
                        <li>
                            Drive a substantial increase in revenue by the end
                            of 2025.
                        </li>
                    </ul>
                    <h3>Essential qualifications:</h3>
                    <ul>
                        <li>
                            A start-up mentality. You will do whatever is needed
                            to make things happen. If you don't know how, you'll
                            figure it out.
                        </li>
                        <li>
                            A deep understanding of B2B sales, demand
                            generation, and revenue growth strategies, with
                            extensive hands-on experience.
                        </li>
                        <li>
                            Excellent writing skills. We expect all our
                            published content to clearly and concisely get the
                            message across.
                        </li>
                        <li>
                            Experience in a similar role (e.g., business
                            founder, Head of Growth, Sales & Growth Lead, etc.).
                        </li>
                    </ul>
                    <h3>Bonus qualifications:</h3>
                    <ul>
                        <li>Experience setting up partnerships.</li>
                        <li>
                            Experience selling open-source or
                            self-hosted/on-premise software.
                        </li>
                    </ul>
                    <h3>You’ll love this job if:</h3>
                    <ul>
                        <li>
                            You want a high degree of freedom and
                            responsibility. You love to experiment, and to be
                            the one writing your own playbooks.
                        </li>
                        <li>
                            You’re excited to grow an independent business built
                            on shared <a href="/values/">values</a>: building
                            software that will always be there for our users,
                            keeping Zulip 100% open-source, investing in
                            community and mentorship, and supporting other
                            worthy organizations.
                        </li>
                        <li>
                            You’re energized by the idea of working on a complex
                            product with heterogeneous use cases and buyer
                            personas, in a market dominated by giant
                            corporations.
                        </li>
                    </ul>
                    <p>
                        Email us at
                        <a href="mailto:jobs+gtm@zulip.com"
                          >jobs+gtm@zulip.com</a
                        >
                        with your resume and cover letter to apply, or learn
                        more about
                        <a href="/jobs/#how-we-work">how we work</a>.
                    </p>
                    <hr />
                    <h2 id="designer">
                        Senior Product Designer (full-time or part-time)
                    </h2>
                    <p>
                        <a href="/">Zulip</a> is an open-source team chat
                        application designed for seamless remote and hybrid
                        work. With conversations organized by topic, Zulip is <a
                        href="/why-zulip">ideal</a> for both live and
                        asynchronous communication. Zulip’s 100% open-source
                        software is available as a <a href="/plans/#cloud">cloud
                        service</a> or a
                        <a href="/self-hosting">self-hosted solution</a>, and is
                        used by thousands of organizations around the world.
                    </p>
                    <p>
                        We are looking for an experienced product designer with a
                        strong background in visual design to make our web application,
                        mobile application, and marketing pages shine.
                    </p>
                    <p>
                        You will work closely with Zulip's leadership team.
                    </p>

                    <h3>What you’ll do:</h3>
                    <ul>
                        <li>
                            Improve and maintain a web app design system in
                            Figma. You'll be developing design patterns,
                            guidelines, and reusable components to help create a
                            consistent and maintainable application.
                        </li>
                        <li>
                            Break down design changes into manageable pieces that
                            can be incrementally integrated into an actively
                            evolving product.
                        </li>
                        <li>
                            Actively participate in design discussions. Review
                            design implementations and tune designs in response
                            to feedback.
                        </li>
                        <li>
                            Help design new product features, working in a
                            dynamic collaboration with product, engineering, and
                            users.
                        </li>
                        <li>
                            Design new marketing pages and redesign old ones.
                            Strengthen our brand's look and feel to make it
                            instantly recognizable across apps, landing pages,
                            social accounts, and ads.
                        </li>
                        <li>
                            Create and prepare icons for web and mobile apps.
                        </li>
                    </ul>
                    <h3>Essential qualifications:</h3>
                    <ul>
                        <li>
                            Your portfolio showcases a track record of designing
                            high-quality web applications. You've had a leading
                            role in designing a complex application.
                        </li>
                        <li>
                            You have a strong understanding of mobile and web UI
                            guidelines, standards, approaches, and patterns.
                            Working within those structures, you can think
                            creatively to develop elegant solutions to complex
                            problems.
                        </li>
                        <li>
                            You communicate with clarity and precision, and are
                            comfortable in a distributed work environment. You
                            thrive in an inclusive culture where ideas are
                            debated openly and everyone is treated with respect.
                        </li>
                        <li>Expert knowledge of Figma.</li>
                    </ul>
                    <h3>Extra credit for any of the following:</h3>
                    <ul>
                        <li>
                            Familiarity with HTML, CSS, and JavaScript.
                        </li>
                        <li>
                            Your portfolio includes mobile applications (iOS or
                            Android).
                        </li>
                        <li>
                            You've worked on a chat app in the past.
                        </li>
                        <li>
                            You are deeply familiar with a team chat app as an
                            advanced user or administrator. Better yet, you are an
                            experienced user of Zulip.
                        </li>
                        <li>
                            You've created an icon set.
                        </li>
                    </ul>
                    <p>
                        Email us at <a
                        href="mailto:jobs+designer@zulip.com">jobs+designer@zulip.com</a>
                        with your resume and cover letter to apply, or learn
                        more about
                        <a href="/jobs/#how-we-work">how we work</a>.
                    </p>
                </div>
                <div class="how-we-work">
                    <h1 id="how-we-work">
                        How we work
                    </h1>
                    <p>
                        <strong>Open source.</strong> The Zulip software is 100%
                        free and open source.  We're <a href="/team/">an
                        open-source project</a> first, and we’re building an
                        independent <a href="/values">sustainable business</a>
                        as a means to support the project's growth and long-term
                        future. We provide the same open-source code to our
                        largest customers as to anyone with <code>git clone</code>.
                    </p>
                    <p>
                        <strong>Open project.</strong> The Zulip project is one where people
                        really do show up through the Internet and start making real changes.
                        That doesn’t happen by accident; it takes work and thoughtfulness.  Most
                        of us work remotely, and we discuss our code and our plans in public, in
                        writing, primarily asynchronously, using Zulip and GitHub.
                    </p>
                    <p>
                        <strong>Inclusive community.</strong> The Zulip community is made up of a
                        mixture of volunteers and professionals from all walks of life. Diversity is
                        one of our strengths, and we strive to be a community that welcomes and
                        supports people of all backgrounds and identities from anywhere in the world.
                    </p>
                    <p>
                        <strong>Globally distributed.</strong> Our company is
                        headquartered in San Francisco, CA, but like our
                        community, our ~15 person team works from around the
                        world. We communicate primarily async, in the <a
                        href="/development-community">Zulip development
                        community</a> and <a href="https://github.com/zulip">on
                        GitHub</a>. Our roles are open to all applicants without
                        regard for location.
                    </p>
                    <p>
                        <strong>Maintainable software.</strong> Great
                        software over time depends on a team’s shared
                        understanding of a system and how to change it, as
                        much as on the code itself. Beyond writing our
                        code so it works today, we put equal effort into
                        writing code, tests, comments, commit history,
                        and <a href="https://zulip.readthedocs.io/en/latest/">documentation</a>
                        clearly, to share with each other and future
                        contributors our understanding of how and why it
                        works, so we can build on it tomorrow.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="what-were-building">
        <div class="main">
            <div class="padded-content">
                <div class="inner-content markdown">
                    <h1 id="what-were-building">
                        What we're building
                    </h1>
                    <p>
                        People working together need to communicate with their teammates, and they
                        also need to tune out the conversation to get work done. Teams tired of
                        wasting time in meetings move discussion to email; tired of waiting all
                        day for email replies, move to a team chat like Slack or
                        Microsoft Teams; and then
                        team chat becomes an always-on meeting, leaving people constantly
                        distracted, missing out on important conversations, or both.
                    </p>
                    <p>
                        Zulip is reinventing chat so teams can accomplish more together. We've
                        created a place where a conversation can shift seamlessly from the
                        immediacy of chat to the reply-whenever efficiency of email, and back;
                        where you can participate in the conversations that matter to you and
                        efficiently tune out the rest, no matter whether you're there in real
                        time, coming online after a morning hard at work, or returning from a
                        vacation away from it.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: partners.html]---
Location: zulip-main/templates/corporate/partners.html

```text
{% extends "zerver/portico.html" %}
{% set entrypoint = "marketing-page" %}

{% set PAGE_TITLE = "Partner program | Zulip" %}

{% set PAGE_DESCRIPTION = "Zulip works with a variety of partners to deliver the
  product to customers, and integrate it with other tools in their workplace
  suite." %}

{% block customhead %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endblock %}

{% block portico_content %}

{% include 'zerver/landing_nav.html' %}

<div class="portico-landing why-page solutions-page partners-page">
    <div class="hero bg-pycon partners">
        <div class="bg-dimmer"></div>
        <h1 class="center">Partner program</h1>
        <p>Zulip works with a variety of partners to deliver the product,<br />
            and integrate it with other tools in the customer's workplace
            suite.
        </p>
        <div class="hero-buttons center">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScBoUMw8Nm2pWwh2RcNa_t_X-V9gXcuhAl-UVR_FxCReXHg4g/viewform?usp=sharing" class="button">
                Become a partner
            </a>
        </div>
    </div>

    <div class="feature-grid">
        <div class="feature-row">
            <div class="feature-box">
                <div class="feature-text">
                    <h1>
                        Resellers
                    </h1>
                    <p>
                        Help customers discover how Zulip can address their
                        needs. Our partner onboarding kit helps you get started.
                    </p>
                </div>
            </div>
            <div class="feature-box">
                <div class="feature-text">
                    <h1>
                        Value Added Resellers (VARs)
                    </h1>
                    <p>
                        Support customer deployments. Build custom integrations
                        with our <a href="/api">easy-to-use APIs</a>.
                    </p>
                </div>
            </div>
        </div>
        <div class="feature-row">
            <div class="feature-box">
                <div class="feature-text">
                    <h1>
                        Managed Service Providers
                    </h1>
                    <p>
                        Host and manage Zulip deployments, and customize Zulip's
                        open-source software.
                    </p>
                </div>
            </div>
            <div class="feature-box">
                <div class="feature-text">
                    <h1>
                        Hosting providers
                    </h1>
                    <p>
                        Host Zulip's secure, easy to deploy software. Efficient
                        multi-tenant hosting available.
                    </p>
                </div>
            </div>
        </div>

        <div class="feature-end">
            <div class="bottom-register-buttons extra_margin_before_footer">
                <div class="hero-buttons center">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScBoUMw8Nm2pWwh2RcNa_t_X-V9gXcuhAl-UVR_FxCReXHg4g/viewform?usp=sharing" class="button">
                        Become a partner
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

````

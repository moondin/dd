---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 260
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 260 of 1290)

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

---[FILE: zulip-logo.svg]---
Location: zulip-main/docs/images/zulip-logo.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" viewBox="68.96 55.62 1742.12 450.43" width="97" height="25">
    <path fill="hsl(0, 0%, 100%)" d="M473.09 122.97c0 22.69-10.19 42.85-25.72 55.08L296.61 312.69c-2.8 2.4-6.44-1.47-4.42-4.7l55.3-110.72c1.55-3.1-.46-6.91-3.64-6.91H129.36c-33.22 0-60.4-30.32-60.4-67.37 0-37.06 27.18-67.37 60.4-67.37h283.33c33.22-.02 60.4 30.3 60.4 67.35zM129.36 506.05h283.33c33.22 0 60.4-30.32 60.4-67.37 0-37.06-27.18-67.37-60.4-67.37H198.2c-3.18 0-5.19-3.81-3.64-6.91l55.3-110.72c2.02-3.23-1.62-7.1-4.42-4.7L94.68 383.6c-15.53 12.22-25.72 32.39-25.72 55.08 0 37.05 27.18 67.37 60.4 67.37zm522.5-124.15l124.78-179.6v-1.56H663.52v-48.98h190.09v34.21L731.55 363.24v1.56h124.01v48.98h-203.7V381.9zm338.98-230.14V302.6c0 45.09 17.1 68.03 47.43 68.03 31.1 0 48.2-21.77 48.2-68.03V151.76h59.09V298.7c0 80.86-40.82 119.34-109.24 119.34-66.09 0-104.96-36.54-104.96-120.12V151.76h59.48zm244.91 0h59.48v212.25h104.18v49.76h-163.66V151.76zm297 0v262.01h-59.48V151.76h59.48zm90.18 3.5c18.27-3.11 43.93-5.44 80.08-5.44 36.54 0 62.59 7 80.08 20.99 16.72 13.22 27.99 34.99 27.99 60.64 0 25.66-8.55 47.43-24.1 62.2-20.21 19.05-50.15 27.6-85.13 27.6-7.77 0-14.77-.39-20.21-1.17v93.69h-58.7V155.26zm58.7 118.96c5.05 1.17 11.27 1.55 19.83 1.55 31.49 0 50.92-15.94 50.92-42.76 0-24.1-16.72-38.49-46.26-38.49-12.05 0-20.21 1.17-24.49 2.33v77.37z"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: apply.md]---
Location: zulip-main/docs/outreach/apply.md

```text
# How to apply

This page should help you get started with applying for an outreach program
with Zulip.

We try to make the application process as valuable for the applicant as
possible. Expect high-quality code reviews, a supportive community, and
publicly viewable patches you can link to from your resume, regardless of
whether you are selected.

## Application criteria

We expect applicants to have experience with the technologies relevant
to their project, or else have strong general programming
experience. If you are just getting started learning how to program,
we recommend taking time to learn the basics (there are many great
online materials available for free!), and applying in the next
program cycle.

In addition to the requirements of the specific outreach program
you're applying to, successful applicants are expected to demonstrate
the following:

1. **Ability to contribute to a large codebase.** Accepted applicants
   generally have five or more merged (or nearly merged) pull
   requests, including at least a couple involving significant
   complexity. The quality of your best work is more important than
   the quantity, so be sure to [follow our coding
   guidelines](../contributing/code-style.md) and [self-review your
   work](../contributing/code-reviewing.md#reviewing-your-own-code)
   before submitting it for review.

2. **Clear communication.** Building open-source software is a collaborative
   venture, and effective communication is key to making it successful. Learn
   how to [ask great questions](../contributing/asking-great-questions.md), and
   explain your decisions clearly [in your commit
   messages](../contributing/commit-discipline.md#commit-messages) and [on your
   pull requests](../contributing/reviewable-prs.md).

3. **Improvement in response to feedback.** Don't worry if you make
   mistakes in your first few contributions! Everyone makes mistakes
   getting started — just make sure you learn from them!

We are especially excited about applicants who:

- Help out other applicants

- Try to solve their own obstacles, and then [ask well-formed
  questions](/contributing/asking-great-questions)

- Develop well thought out project proposals

Starting in 2022, being a student is not required in order to apply to
GSoC. We are happy to accept both student and non-student GSoC
participants.

## Getting started

If you are new to Zulip, our [contributor
guide](../contributing/contributing.md) is the place to start. It
offers a detailed walkthrough for submitting your first pull request,
with many pointers to additional documentation, and tips on how to get
help if you need it.

We recommend taking the following steps before diving into the issue tracker:

- Join the [Zulip development
  community](https://zulip.com/development-community/), and introduce yourself
  in the channel for the program you are participating in
  ([#GSoC](https://chat.zulip.org/#narrow/channel/14-GSoC) or
  [#Outreachy](https://chat.zulip.org/#narrow/channel/391-Outreachy)). Before you
  jump in, be sure to review the [Zulip community
  norms](https://zulip.com/development-community/).

- Follow our instructions to [install the development
  environment](../development/overview.md), getting help in [#provision
  help](https://chat.zulip.org/#narrow/channel/21-provision-help) if needed.

- Familiarize yourself with [using the development
  environment](../development/using.md).

- Go through the [new application feature
  tutorial](../tutorials/new-feature-tutorial.md) to get familiar with how the
  Zulip codebase is organized, and how to find code in it.

As you are getting started on your first pull request:

- Read the [Zulip guide to Git](../git/overview.md). It's especially important
  to master using `git rebase`, so that you can restructure your commits. You can
  get help in [#git help](https://chat.zulip.org/#narrow/channel/44-git-help) if
  you get stuck.

- To make it easier to structure your PRs well, we recommend installing a
  [graphical Git client](../git/setup.md#get-a-graphical-client).

- Construct [coherent, mergeable
  commits](../contributing/commit-discipline.md), with clear
  commit messages that follow the [Zulip commit style
  guide](../contributing/commit-discipline.md). More broadly, clear
  communication on your pull request will make your work stand out.

- Carefully follow our [guide to reviewing your own
  code](../contributing/code-reviewing.md) before asking anyone else for a
  review. Catching mistakes yourself will help your PRs be merged faster, and
  folks will appreciate the quality and professionalism of your work.

Our documentation on [how to be a successful
contributor](../contributing/contributing.md#how-to-be-a-successful-contributor)
offers some additional advice.

## Putting together your application

### What to include

In addition to following all the instructions for the program you are applying
to, your application should describe the following:

- Why you are applying:
  - Why you're excited about working on Zulip.
  - What you are hoping to get out of your participation in the program.
  - How you selected your project.
- Relevant experience:
  - Summary of your **prior experience with the technologies** used by Zulip.
  - Your **prior contributions to open-source projects** (including pull requests, bug
    reports, etc.), with links.
  - Any other **materials which will help us evaluate how you work**, such as
    links to personal or school projects, along with brief descriptions.
- Your **contributions to Zulip**, including pull requests, bug reports, and helping
  others in the development community (with links to all materials).
- A **project proposal** (see below).

**A note for Outreachy applicants**: It is not practical for us to individually
help you develop a specific timeline for your application. We expect you to
submit a project proposal as described below, and will help you manage the
timeline for your project if your application is selected.

### Project proposals

Your first priority during the contribution period should be figuring out how to
become an effective Zulip contributor. Start developing your project proposal
only once you have experience with iterating on your PRs to get them ready for
integration. That way, you'll have a much better idea of what you want to work
on and how much you can accomplish.

As [discussed in the guide to having an amazing experience during the
program](./experience.md#what-about-my-proposal):

> We have a fluid approach to planning, which means you are very unlikely to end
> up working on the exact set of issues described in your proposal. Your proposal
> is not a strict commitment (on either side).

Your proposal should demonstrate your thoughtfulness about what you want to work
on, and consideration of project complexity. We will evaluate it based on the
following criteria:

- Does it give us a good idea of what areas of Zulip you are most excited to
  work on?
- Does it demonstrate some familiarity with the Zulip codebase, and reflection
  on what makes for a coherent project that is well-aligned with your interests
  and skill set?
- Does it demonstrate your ability to put together a reasonable plan? Have you
  thought carefully about the scope of various pieces of your project and their
  dependencies? Are you taking into account the fact that there can be a lot of
  time in software development between having an initial prototype and merging
  the final, fully reviewed and tested, version of your code?
- Are you proposing a project that would make a significant positive impact on the
  areas you plan to focus on?

Regardless of which program you are applying to, you can use the [GSoC project
ideas list](./gsoc.md#project-ideas-by-area) as a source of inspiration for
putting together your proposal.

### Circulating your application for feedback

We highly recommend posting a rough draft of your application at least one week
before the deadline. That way, the whole development community has a chance to
give you feedback and help you improve your proposal.

- If you do not have a complete draft ready, at a minimum, we recommend posting
  your **project proposal**, along with **your contributions to Zulip** for
  context.

- Please post a link to your draft in the Zulip development community
  channel dedicated to your program (e.g.,
  [#GSoC](https://chat.zulip.org/#narrow/channel/14-GSoC) or
  [#Outreachy](https://chat.zulip.org/#narrow/channel/391-Outreachy)). Use
  `Your name - project proposal` as the topic.

- We recommend linking to a draft in an app that works in the browser and allows
  commenting, such as Dropbox Paper or Google Docs.
```

--------------------------------------------------------------------------------

---[FILE: experience.md]---
Location: zulip-main/docs/outreach/experience.md

```text
# How to have an amazing experience

If you are joining Zulip as part of an outreach program (e.g.,
[GSoC](https://summerofcode.withgoogle.com/) or
[Outreachy](https://www.outreachy.org/)), welcome! Please make sure you read
this page carefully early on, and we encourage you to come back to it over the
course of the program.

## Your goals

Your experience as a Zulip outreach program participant is your
responsibility, and we strongly encourage you take full ownership. The
more care, attention, and energy you put in, the more you'll be able
to get out of the program. We're here to support you, but the journey
is yours to make!

The following are the main goals we'll be guiding you towards, as they are
shared by the great majority of program participants, and are aligned with the
objectives for our umbrella programs. If you have additional goals in mind for
your experience, please let your mentor and the community know, so that we can
help you along.

- You should gain mastery of the skills needed to be a self-sufficient and
  effective open-source developer. By the end of the program, all but the most
  complex PRs should ideally go through only a couple of rounds of code review
  before being merged. Our most successful contributors gain the expertise to
  become a maintainer for one or more areas within Zulip.

- You should become a valued member of the Zulip community, who works to make it
  better for all involved. Reviewing PRs, helping others debug, providing
  feedback, and finding bugs are wonderful ways to contribute beyond the code in
  your own project.

- You should feel proud of the significant positive impact you've made on the
  areas you focused on. Your areas should be more polished, and have several
  new major features that you have implemented. The sections of code you worked
  on should be more readable, better-tested, and have clearer documentation.

Don't forget to have fun! Spending a few months coding on open source is an
amazing opportunity, and we hope you'll have a blast. Your acceptance to the
program means that we are confident that if you put in the effort, your
contributions to the open source world will be something you can be proud of for
the rest of your life.

## You and your mentor

Zulip operates under a **group mentorship** model. Every participant in a Zulip
mentorship program will:

- Have an assigned mentor, who will be their go-to for personal questions and
  concerns, and a consistent point of contact throughout the program.

- Receive lots of feedback and mentorship from others in the Zulip development
  community, in code reviews on pull requests, and by posting
  [questions](../contributing/asking-great-questions.md) and ideas in public
  channels.

Mentors and contributors should stay in close contact. We recommend setting up a
weekly check-in call to make sure you stay on track and have a regular
opportunity to ask your mentor questions and get their feedback. Talk with your
mentor about the status of your projects, and get their advice on how to make
progress if some project feels stuck.

Bring up problems early, whether technical or otherwise. If you're stressed
about something, mention it your mentor immediately, so they can help you solve
the problem. If you're stressed about something involving your mentor, bring it
up with an organization admin.

## Communication and check-ins

Communicating proactively with your mentor, your peers, and the rest of the
Zulip community is vital to having a successful mentorship program with Zulip.
It's how we can help you make sure you're working on a great set of impactful
issues, and not getting stuck or taking an approach that won't work out.

A key communication tool we use is posting regular public check-ins, which are
a required part of the program. We recommend reading your peers' check-ins
to get a feel for what they are working on and share ideas!

### Getting feedback and advice

We strongly encourage all Zulip contributors to post their questions and ideas
in public channels in the [Zulip development
community](https://zulip.com/development-community/). When you post in a public
channel, you give everyone the opportunity to help you out, and to learn from
reading the discussion.

Examples of topics you might ask about include:

- Making a technical decision while solving the issue.

- Making a product decision, e.g., if the issue description does not address some
  details, or you've identified a problem with the plan proposed in the issue.

- Making a design decision, e.g., if you have a couple of different ideas and
  aren't sure what looks best.

See our guide to [asking great
questions](../contributing/asking-great-questions.md) for detailed advice on how
to ask your questions effectively.

### How to post your check-ins

A check-in is a regular update that you post in the Zulip development community.
You can find many examples in the
[#checkins](https://chat.zulip.org/#narrow/channel/65-checkins) and
[#GSoC](https://chat.zulip.org/#narrow/channel/14-GSoC) channels.

- **Frequency**: _Regular check-ins are a required for all program
  participants._ If you are working 20+ hours per week, post a check-in at least
  twice a week, e.g., Tuesday and Friday. If you are working less than 20 hours
  per week, post a check-in at least once a week.

- **Where to post**: Unless your mentor or program administrator requests
  otherwise, post your check-ins in the channel for your program
  (e.g., [#GSoC](https://chat.zulip.org/#narrow/channel/14-GSoC) or
  [#Outreachy](https://chat.zulip.org/#narrow/channel/391-Outreachy)), using your
  name as the topic.

- **What to include** in each check-in:

  - The **status** of each ongoing project, e.g., in progress, awaiting feedback,
    addressing review feedback, stuck on something, blocked on other work, etc.
    To make your update easy to read, include brief descriptions of what you're
    working on, not just issue/PR numbers.

  - For projects where you are waiting on feedback, what **type of feedback** is
    needed (e.g., product review, next round of code review after initial
    feedback has been addressed, answer to some question, etc.). Use [silent
    mentions](https://zulip.com/help/mention-a-user-or-group#silently-mention-a-user)
    to indicate whose feedback is required, if you think you know who it should
    be.

  - Any questions or problems you **feel stuck** on. If there's an ongoing thread
    elsewhere, please link to it. Please post each question/problem in a
    separate message to make it convenient to quote-and-reply to address it.
    Note that discussions about your work will happen in all the usual places
    (#**frontend**, #**backend**, #**design**, etc.), and those are the
    channels where you should be _starting_ conversations. Your check-ins are a
    place to point out where you're feeling stuck, e.g., there was some
    discussion in a channel or on GitHub, but it seems to have petered out
    without getting to a decision, and you aren't sure what to do.

  - What you've been **actively working** on since your last check-in.

  - What you **intend to focus** on until your next check-in. Indicate if you are
    unsure and would appreciate some suggestions or feedback on your plan.

## Peer reviews

Reviewing others' changes is one of the best ways to learn to be a better
developer, since you'll both see how others solve problems and also practice the
art of catching bugs in unfamiliar code. As discussed in the [code review
guide](../contributing/code-reviewing.md):

> Doing code reviews is a valuable contribution to the Zulip project. It’s also
> an important skill to develop for participating in open-source projects and
> working in the industry in general... Anyone can do a code review – you don’t
> have to have a ton of experience.

For programs with multiple participants, we will set up a **code review buddies**
system at the start of the program:

1. Everyone will be assigned to a group of 2-3 people who will be your buddies
   for first-round code reviews. (In some cases, your buddy will be your
   mentor.)

2. Start by [self-reviewing your own code](../contributing/code-reviewing.md).

3. When ready, request a review from your code review buddies. Use [GitHub's
   review request
   feature](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/requesting-a-pull-request-review)
   to send your request. This makes the PR's status clear to project maintainers.
   You may also want to send a quick direct message to let your buddies know
   their attention is needed.

4. Please respond to code review requests promptly (within one workday), and
   follow the guidelines [in the code review
   guide](../contributing/code-reviewing.md).

Your initial reply does not have to be a full review. If you’re pressed for
time, start by quickly sharing your initial thoughts or feedback on the general
direction, and let the PR author know when you expect to provide a more detailed
review.

Make sure the GitHub comments on the PR are always clear on the status -- e.g.,
buddy code review has been requested, feedback is being discussed, code buddy
has approved the PR, etc. This will help project maintainers know when it's time
to move on to the next step of the review process.

## How do I figure out what to work on?

Our goal is for contributors to improve their skills while making meaningful
contributions to Zulip. We like to be flexible, which means that you are
unlikely to work precisely on the issues described in your proposal, and that's
OK!

In practice, this means that over the course of the program, you will:

- Get frequent guidance regarding what to work on next by posting your ideas and
  questions about what to tackle next in your
  [check-ins](#how-to-post-your-check-ins).

- Like other Zulip contributors, [claim
  issues](../contributing/contributing.md#claiming-an-issue) only when you
  actually start work on them.

If someone else fixes an issue you were planning to fix, don't worry about it!
Consider [reviewing their work](../contributing/code-reviewing.md) to build your
expertise in the subsystem you're working on.

### Prioritization

Always keep the following order of priorities in mind:

1. Your top priorities should be **fixing any regressions you introduced** with
   recently merged work, and **fixing any important bugs or regressions** that
   you pick up or are assigned.

2. **Review others' pull requests** promptly. As you'll experience yourself, getting quick
   feedback on your PR helps immensely. As such, if you are asked to review a
   PR, aim to provide an initial reply within one workday.

3. If any of your PRs are actively undergoing review or are marked as
   "integration review" ready, be sure to **rebase** them whenever merge
   conflicts arise.

4. Next, prioritize **responding to code review feedback** over starting new
   work. This helps you and your reviewers maintain context, which makes it
   easier to make progress towards getting your work integrated.

5. Do any relevant **follow-ups to larger projects** you've completed, to make sure
   that you've left things better than how you found them.

6. Finally, if all of the above are in good shape, **find a new issue** to pick up!

### What about my proposal?

We have a fluid approach to planning, which means you are very unlikely to end
up working on the exact set of issues described in your proposal. Your proposal
is not a strict commitment (on either side).

In terms of managing your work:

- Regardless of whether an issue was mentioned in your proposal, make
  sure you bring it up in your check-ins when you plan to start
  working on something. Project priorities shift over time, and we
  may have suggestions for higher-priority work in your area of
  interest, or issues that will serve as good preparation for other
  work you are excited about. It's also possible that a project idea
  is not ready to be worked on, or needs to be sequenced after other projects.

- When asking for recommendations for what to work on next, it's helpful to
  include a reminder of what areas you're most excited about, especially early
  on in the program when we're still getting to know you. Do not expect program
  administrators to remember what issues were listed in your proposal.

While some program participants stick closely to the spirit of their proposal,
others find new areas they are excited about in the course of their work. You
can be highly successful in the program either way!

### Tips for finding issues to pick up

- Look for, claim, and fix bugs to help keep Zulip polished. Bugs and polish
  make a huge difference to our users' experience. If you can fix a
  [high-priority
  bug](https://github.com/zulip/zulip/issues?page=2&q=is%3Aopen+is%3Aissue+label%3Abug+label%3A%22priority%3A+high%22)
  in an area you've been working on, it is likely to have more impact than any
  new feature you might build.

- If you're working on something other than the Zulip server / web app codebase,
  follow your project on GitHub to keep track of what's happening.

- The Zulip server / web app project is too active to follow, so instead we
  recommend joining [Zulip's GitHub teams](https://github.com/orgs/zulip/teams)
  that relate to your projects and/or interests. When an area label is added to
  an issue or PR, [Zulipbot](https://github.com/zulip/zulipbot) automatically
  mentions the relevant teams for that area, subscribing all team members to the
  issue or PR thread.

### Staying productive

Here are some tips for making sure you can always be productive, even when
waiting for a question to be answered or for the next round of feedback on a PR:

- You should be working on multiple issues (or parallelizable parts of a large
  issue) at a time. That way, if you find yourself blocked on one project, you
  can always push on a different one in the meantime.

- It can help to plan a bit in advance by thinking about the issue you intend to
  pick up next. Are there decisions that will require input from others? Try to
  start the conversation a few days before you need an answer.

- If you are waiting for some decision to be finalized, consider doing
  preparatory refactoring that will make the feature easier to complete and can
  already be merged.

## How else can I contribute?

- Participate and be helpful in the community! Helping a new contributor get
  started or answering a user's question are great ways to contribute.

- Test and give feedback on new features that are deployed in the development
  community! It's fun, and it helps us find bugs before they reach our users.

- As you are doing your work, keep thinking about what could make contributing to Zulip
  easier for both yourself and the next generation of Zulip contributors. And then
  make those ideas reality!

## Timeline extensions for GSoC

Starting in 2022, it became possible to extend the timeline of a GSoC project.
This can be a great idea if you don't have a lot of time to dedicate each week,
or have an interruption during the program (e.g., getting sick, travel, family
obligations, etc.).

We're generally very flexible, so if extending your project dates would make it
less stressful to put in the required hours, please discuss this with your
mentor and Zulip's GSoC administrator. Please start this conversation
proactively as soon as you realize that you might need an extension, as this
will give us confidence that you'll be able to manage your time effectively to
successfully complete the program.

It is possible to have the midterm evaluation happen more than half-way through
the project timeline. If the balance of hours you plan to spend on GSoC is
significantly weighted towards the latter half of your GSoC contribution period,
please contact Zulip's program administrator to discuss pushing out the midterm
evaluation.
```

--------------------------------------------------------------------------------

````

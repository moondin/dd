---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 249
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 249 of 1290)

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

---[FILE: design-discussions.md]---
Location: zulip-main/docs/contributing/design-discussions.md

```text
# Design discussions

We discuss ideas for improving Zulip's user experience, interface, and visual
design in the [Zulip development
community](https://zulip.com/development-community/). The purpose of these
design discussions is to help us make smart, well-informed decisions about
design changes to the Zulip product. We want Zulip to work great for a diverse
array of users and organizations, and discussions in the development community
are an incredibly valuable source of insight and ideas. We welcome all
perspectives, respectfully shared.

Most design discussions take place in the [#design][design channel] channel in the
development community. Discussions about mobile app design happen in
[#mobile-design][mobile-design channel],
and design of the terminal app is discussed in
[#zulip-terminal][zulip-terminal channel].

## Guidelines for all participants

Everyone is encouraged to participate in design discussions! Your participation
greatly helps improve the product, especially when you focus your contributions
on supporting the productivity of the design team. The more we are able to
incorporate a variety of ideas, experiences, and perspectives into the
discussion, the better decisions we'll be able to make.

Please start by reviewing the guide to [how we
communicate](how-we-communicate.md) in the Zulip community. Also, when sharing
your ideas:

- Think about corner cases and interactions with existing features that the
  design will need to handle, and bring up problems with them, especially if they
  are not obvious. (E.g., “This component also appears with a darker background
  in the Drafts UI,” with a screenshot).

- Present technical considerations _where appropriate_. “X requires
  some refactoring that would take me another hour,” is probably not
  worth bringing up if X would produce a better user
  experience. “Adding X might require removing feature Y,” or “X is
  incompatible with Zulip's security model,” is important to present
  early.

Note that [#design][design channel] is a high-traffic channel, and thoughtful
participation takes time. Don’t let it prevent you from doing your own work. It
can be helpful to pick particular conversations to follow, where you feel that
you have insight to share.

## Participant roles

At this point, it will be helpful to define a few key roles in design
discussions:

- [Code contributor](#guidelines-for-code-contributors): Anyone working on a PR
  that includes some frontend changes.

- [Community moderator](#guidelines-for-community-moderators): Any core
  contributor or other experienced community member who is helping guide the
  discussion (with or without "moderator" permissions in the organization).

- **Design team**: Anyone working actively on the design of the feature at hand
  and/or overall design for the Zulip product.

- [Decision makers](#guidelines-for-decision-makers): Project maintainers
  responsible for design decisions, including design leaders, product leaders,
  and overall project leadership.

## Guidelines for code contributors

When you are working on a PR that includes frontend changes, you may find it helpful
to get interactive feedback on the design. The best way to do so is by posting a
message in the appropriate design channel in the Zulip development
community: [#design][design channel] for the web/desktop app,
[#mobile-design][mobile-design channel] for the mobile app, or
[#zulip-terminal][zulip-terminal channel] for the terminal app.

### When to post

- The issue or a comment on your PR specifically asks you to get feedback in
  [#design][design channel] or another design channel.

- The issue you’re working on is not specific about some design point, and you
  would like advice.

- You’ve implemented an issue as described, but the UI doesn’t look good or
  seems awkward to use.

- You’re prototyping an idea that’s not fully fleshed out.

### Guidelines for requesting design feedback

You will get the most helpful feedback by sharing enough context for community
participants to understand what you're trying to do, and clearly stating the
questions you are looking for feedback on. Some advice:

- Start a new topic, or use an existing one if there is a topic linked from the
  issue you’re working on. If you’re starting a new topic, appending the issue
  or PR number (e.g., `#1234`) to the topic name will turn it into a handy link.

- Summarize the feature you’re working on. You should provide enough
  context for readers to understand your question, and include links
  to any relevant issues or in-progress PRs for additional background.

- Post screenshots, and screen captures if there is an interaction that
  screenshots fail to show.

  - You may want to post a few screenshots of different options you’re
    considering.

  - Screenshots should show enough of the app to evaluate how the new feature
    looks in its context, but not so much that it’s hard to see the feature.

  - Screen captures should demonstrate the feature with a minimal amount of
    extraneous content.

  - See [here](../tutorials/screenshot-and-gif-software.md) for some
    recommended tools.

- Post a clear question or set of questions that you need help with. What
  specifically are you looking for feedback on?

- Since you’ve been working on this issue, you have likely gained some expertise
  in this area. Educate others by sharing any tradeoffs and relevant
  considerations you’re aware of.

Keep in mind that the Zulip community is distributed around the world, and you
should not expect to get realtime feedback. However, feel free to bump the
thread if you don’t see a response after a couple of business days.

## Guidelines for community moderators

Any experienced community participant can guide design discussions, and help
make sure that we use everyone's time productively towards making the best
decisions we can.

### Improving the quality of discussions

Here are some suggestions for how you can help the community have a productive
design discussion:

- If a design discussion seems to have been derailed by a tangent or argument,
  consider moving the tangent to another topic so that the conversation can
  refocus on the questions at hand.

- If the direction of the discussion seems unproductive, you can explicitly
  suggest circling back to a topic where additional discussion seems valuable.

- If someone is repeating the same points in a way that’s unhelpful, you can let
  them know that you understand what they are saying and appreciate their
  feedback, but at this point would find it helpful to hear feedback from other
  participants. People may sometimes repeat themselves because they are not feeling
  heard.

- That said, sometimes the best way to deal with questions or feedback that
  don’t move the discussion forward is to let them go by without comment, rather
  than potentially getting into a protracted back-and-forth that derails the
  thread. Examples of such feedback include unmotivated personal opinions,
  proposals that ignore counterarguments that have already been discussed, etc.

- It’s totally fine to let the conversation slow down or die, especially if it
  seems to be going off-track. If the decision makers feel that they do not have
  enough feedback yet, they can revive the conversation as needed, and the pause
  can serve as a good reset.

If a conversation is going off-track and you are not sure how to fix it, please
ping someone on the core team to intervene and help get the conversion into a
better state.

### Moving threads to the most appropriate channel

Sometimes it helps to move (part of) a thread to a different channel, so that
it's seen by the appropriate audience.

- We generally aim to discuss raw user feedback on the product’s design in
  [#feedback](https://chat.zulip.org/#narrow/channel/137-feedback) (when it
  applies to the web and desktop apps, or to all Zulip clients). The
  [#design][design channel] should be reserved for design aspects that we’re
  actively (considering) working on. This lets the design team focus on
  discussions that are expected to result in actionable decisions.

- If a discussion that started in another channel has shifted into the design
  phase, moving the discussion to [#design][design channel] helps the design team
  follow the conversation.

- Discussion of implementation-related decisions should ideally happen in
  non-design channels:
  [#frontend](https://chat.zulip.org/#narrow/channel/6-frontend) for the web
  app, and see our [guide to chat.zulip.org
  channels](https://zulip.com/development-community/#channels-for-code-contributors)
  for other Zulip codebases. The line can sometimes blur (and that’s OK), but we
  should aim to move (parts of) the thread if there is an extensive conversation
  that belongs in the other channel.

- Similarly, for changes to the mobile app:

  - We aim to discuss raw user feedback in
    [#mobile](https://chat.zulip.org/#narrow/channel/48-mobile).
    The [#mobile-design][mobile-design channel] channel is reserved for design
    aspects that we're actively (considering) working on.
  - A discussion that has shifted into the design phase should be moved to
    [#mobile-design][mobile-design channel], to help the design team closely
    follow the discussion that calls for their input.
  - Discussion of implementation details should move to
    [#mobile-team](https://chat.zulip.org/#narrow/channel/243-mobile-team) or to
    [#mobile-dev-help](https://chat.zulip.org/#narrow/channel/516-mobile-dev-help).

- Discussions of the mobile app's design should move to
  [#mobile-design][mobile-design channel] (instead of #design), which the
  mobile team follows closely.

  Similarly, discussions of the design of the terminal app should move to
  [#zulip-terminal][zulip-terminal channel].

## Guidelines for decision makers

The main purpose of design discussions is to help us make the best design
decisions we can. Decision makers should guide the conversation to elicit the
ideas, feedback and advice they need from the community.

Ideally, design discussions should also help us learn as a community. Community
members who follow the conversation should get a better understanding of the
considerations behind the decisions being discussed, and thus be better able to
contribute to the next conversation.

### Managing the discussion

Decision makers should actively manage the discussion to make sure we're making
good use of everyone's time and attention, and getting useful feedback.

- Decision makers should aim to follow design threads closely and provide input
  early and often, so that conversations don’t get blocked waiting for their
  opinion.

- Decision makers should actively manage discussion threads when needed in order
  to seek the types of inputs that will help them. This may include outlining a
  set of alternatives to consider, posing questions to dig into someone’s
  feedback, asking for ideas to solve a specific design challenge, etc.

- Decision makers should explain the reasoning behind their proposed decisions,
  so that it’s possible to identify any gaps in their thinking, and in order to
  build a shared understanding in the community.

- That said, decision makers are not required to respond to every comment being
  made regarding a proposal, or to answer every question.

### From discussion to decision

There is a number of factors that affect when it’s time to move a thread from
discussion to a decision. In part, this depends on how significant a commitment
we are making with the decision at hand:

- We want to be very thoughtful about decisions that will take a lot of work to
  implement, and/or will be difficult to undo.

- We should try to come up with good designs for the features we're building,
  but sometimes it's difficult to foresee how an interaction will feel until we
  try it. Prototyping a UI we are not sure about is a normal part of the design
  process.

- When the decision results in filing a non-urgent issue, it’s fine to write up
  the conclusions on GitHub relatively quickly, and update the issue if more
  ideas come in later on.

- We should accept that sometimes an idea we decided on is just not working out,
  and be willing to go back to the drawing board or iterate further until we get
  to a state we're happy with.

With those considerations in mind, here are rough guidelines for when to move on
to a decision:

- For very small decisions, it may be enough to get a sanity-check from one or
  two well-informed community participants.

- For more significant decisions, one should generally allow at least 1-2 business
  days for discussion, to give core team members time to share their perspective
  if they have something to contribute.

- Beyond that minimum, the decision makers can move to the decision phase
  whenever they have enough input to make a well-informed decision. Here are
  some situations that would indicate that it’s time to move on:

  - There is general consensus on how to proceed. Or, there is consensus
    between the well-informed participants in the discussion.

  - For a relatively small decision, there is enough useful feedback to
    generate a solid proposal.

  - If the discussion is primarily rehashing old points, and doesn’t seem to
    be generating additional insights, it’s time to redirect the conversation
    or move on to a decision.

  - If the thread has died down, and the decision makers feel that they have
    enough information to go on. (If they don’t, the thread can be bumped.)

[design channel]: https://chat.zulip.org/#narrow/channel/101-design
[mobile-design channel]: https://chat.zulip.org/#narrow/channel/530-mobile-design
[zulip-terminal channel]: https://chat.zulip.org/#narrow/channel/206-zulip-terminal
```

--------------------------------------------------------------------------------

---[FILE: how-we-communicate.md]---
Location: zulip-main/docs/contributing/how-we-communicate.md

```text
# How we communicate

The primary communication forum for the Zulip community is the Zulip server
hosted at [chat.zulip.org](https://chat.zulip.org/). If you are not familiar
with it, start by reading the [Zulip development community
guide](https://zulip.com/development-community/). The guidelines here also apply
to how we communicate on GitHub issues and pull requests, but other pages in
this section go into greater detail about expectations that are specific to pull
requests.

We are deeply committed to maintaining a respectful, collaborative atmosphere in
across all interactions in the Zulip community. To get a feel for what that
means to us, please review the [code of conduct](../code-of-conduct.md) for our
community.

Beyond that, the following guidelines should help you communicate effectively to
express your perspective, and support and encourage other participants in the
community. By incorporating these patterns of behavior, we'll be able to reach
better decisions as a group, and learn and have fun along the way.

## Providing suggestions and feedback

- Aim to present your feedback precisely, with reasoning, and in as objective a
  fashion as you can manage. E.g., “This button really jumps out at me in a way
  that’s distracting; maybe it’s because of the color has a higher contrast than
  the surrounding components?” is better than, “Can we make that color less
  dark?”.

- Clarify your feedback if there are follow-up questions or points of confusion.
  However, avoid simply repeating the same points, as it does not move us closer
  to making the best decisions we can.

- When relevant, highlight information you have beyond your personal opinion.
  E.g., “I moderate a community, and often have to answer questions about how
  this works,” is more helpful than, “This is confusing.”

- In addition to offering constructive feedback, call out specific things that
  someone is doing well. This helps folks feel good about their work, and also
  helps them learn. E.g., “I particularly like the test you added, because...”

- When asking someone to do something, explain the reasoning behind your
  request. This is more motivating, and educates folks on what to do next time.

- If you are not certain about a suggestion you're making, it often works well
  to frame it as a question. E.g., “Would this be clearer if we...?” or “Could
  we...?”.

- Invite others to disagree or contribute additional thoughts, especially if you
  might be considered an authority in the area being discussed. When more folks
  feel comfortable speaking up, we are better able to identify problems and
  fine-tune solutions.

## Handling disagreements

- Always treat other participants in the discussion with respect, regardless of
  whether you agree with their ideas. Ad hominem attacks are never appropriate.

- Approach discussions with a perspective of curiosity. If someone has expressed
  an opinion you find odd or surprising, ask them to explain in more detail
  where they are coming from.

- If you think someone is factually mistaken, consider how they might have reached
  their conclusion, and aim to get to a shared understanding. For example:

  - “I wasn't able to replicate this -- is it possible you are on an old Zulip
    server?”, rather than “This bug report is wrong.”
  - “Using this function won't work here, because...” instead of “That's the
    wrong function.”

- If you disagree with someone on the core team, the best way to make progress
  is usually to state your opinions and reasoning clearly and respectfully, and
  then let the other core team members catch up on the conversation. Other
  project members may find your argument persuasive, and may have ideas that
  address your concerns.

## Expressing your appreciation

There are many ways to contribute to the Zulip community, and it's important to
express our appreciation for all the different ways in which folks jump in to
help. It helps motivate others, builds consensus towards decisions, and creates
a more positive atmosphere in the community.

For many community participants, it takes stepping out their comfort zone to try
something for the first time, such as submitting a pull request, answering a
question in the development community, or suggesting a new feature. It's
especially important to thank and encourage folks who are stretching themselves
to try something new.

- Remember to say “thanks” when responding to a question or suggestion. For
  example:

  - “Thanks for the report! ... ” when someone reports a bug.
  - “Thanks for reviewing my PR! ... ”

- Express your appreciation for the work that went into a pull request, even
  when it turns out that the approach taken in the PR is not successful. E.g.,
  “Thanks for working on this! ... ”

- Try especially hard to express your appreciation for others' contributions,
  effort and ideas when you are also providing negative (constructive) feedback
  on their work.

- You can use a variety of channels to express your appreciation. A comment
  directly in a Zulip thread or on a pull request is often best, but in some
  cases you may also want to send a friendly direct message. For example:

  - “I've noticed that you've been answering lots of questions in #**development
    help** lately. Thanks so much for doing that!”
  - “Thanks for moving those messages into a new topic -- the discussion was
    getting really tangled!”

- Sometimes a quick emoji reaction can help someone feel that their work is
  appreciated. 🎉

- Look over the message you just sent. Did you forget to say “thanks”? It's easy
  to edit your message, or send a quick follow-up.
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/contributing/index.md

```text
# Contributing to Zulip

```{toctree}
---
maxdepth: 3
---

contributing
../code-of-conduct
how-we-communicate
asking-great-questions
design-discussions
commit-discipline
code-style
code-reviewing
reviewable-prs
review-process
continuing-unfinished-work
zulipbot-usage
reporting-bugs
reporting-security-vulnerabilities
suggesting-features
counting-contributions
licensing
```
```

--------------------------------------------------------------------------------

---[FILE: licensing.md]---
Location: zulip-main/docs/contributing/licensing.md

```text
# Licensing

Zulip is distributed under the [Apache 2.0
license](https://github.com/zulip/zulip/blob/main/LICENSE). This means that all
contributions to Zulip — code, images, sounds, etc. — must be compatible with
this license.

## Contributing your own work

If the work you are contributing is 100% your own, Zulip doesn't require you to
sign a copyright assignment or a contributor license agreement for your
contribution. As noted [in the GitHub Terms of
Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#6-contributions-under-repository-license):

> “Whenever you add Content to a repository containing notice of a license, you
> license that Content under the same terms, and you agree that you have the
> right to license that Content under those terms... This is widely accepted as
> the norm in the open-source community; ...”

## Contributing someone else's work

If any part of your contribution is from someone else (code snippets, images,
sounds, or any other copyrightable work, modified or unmodified), you need to
check whether it was distributed under an open-source license that is
[compatible][wiki-compatibility] with the [Apache 2.0
license](https://github.com/zulip/zulip/blob/main/LICENSE). If it was not, this
work cannot be contributed to Zulip, with or without modification.

[wiki-compatibility]: https://en.wikipedia.org/wiki/License_compatibility#Compatibility_of_FOSS_licenses

If you have verified that the work is OK to use, you will need to provide
appropriate attribution in the [`docs/THIRDPARTY`
file](https://github.com/zulip/zulip/blob/main/docs/THIRDPARTY) as part of your
PR. Please refer to the [`debian/copyright` file
documentation](https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/)
for a detailed description (including examples) of how to correctly describe the
copyright and licensing information in your PR.

If you are not sure about the licensing or attribution for your work, please
include the full details of your open questions in the description for your PR.
```

--------------------------------------------------------------------------------

---[FILE: reporting-bugs.md]---
Location: zulip-main/docs/contributing/reporting-bugs.md

```text
# Reporting bugs

There are several ways to report bugs (or possible bugs) you encounter in Zulip:

- If you have a concrete bug report with steps to reproduce the behavior, [file an
  issue](#filing-a-github-issue) in the appropriate GitHub repository.
- If you are not sure whether the issue you encountered is a bug, or how to
  reproduce it, [start a
  conversation](#starting-a-conversation-about-a-possible-bug) in the Zulip
  development community.
- To report a possible security issue, contact Zulip's security team at
  [security@zulip.com](mailto:security@zulip.com). _Do not_ report security issues
  publicly (in GitHub or in the Zulip development community). We create a CVE for
  every security issue in our released software.
- If reporting a bug requires sharing private details about your
  organization, email [support@zulip.com](mailto:support@zulip.com).

No matter where you report the bug, please follow the instructions below for
what to include in a bug report.

## What to include in a bug report

1. **Describe** what you were expecting to see, what you saw instead, and steps
   that may help others reproduce the surprising behavior you experienced.
   Include screenshots and/or screen captures (see [recommended
   tools](../tutorials/screenshot-and-gif-software.md)) if they help
   communicate what you are describing, but avoid posting long videos.
1. **Indicate the [version](https://zulip.com/help/view-zulip-version)** of the
   Zulip app where you encountered the bug. It may also be helpful to note your
   operating system, whether you are using the web app or the desktop app, and
   your browser if using the web app.

## Filing a GitHub issue

Filing a GitHub issue works best when:

- You are confident that the behavior you encountered is a bug, not some quirk
  of how a feature works that may turn out to be intentional.
- You can describe clearly what you were expecting to see, and what you saw instead.
- You can provide steps for someone else to reproduce the issue you encountered.
  This is important for developers to be able to fix the bug, and test that
  their fix worked.

If all of the above accurately describe your situation, please file an issue!
Otherwise, we recommend [starting a
conversation](#starting-a-conversation-about-a-possible-bug) in the Zulip
development community so that the problem you encountered can be discussed
interactively.

Steps and best practices for filing a GitHub issue:

1. Report the issue in the **appropriate [Zulip
   repository](https://github.com/zulip)**. The most commonly used repositories
   are:
   - [zulip/zulip](https://github.com/zulip/zulip/issues) for issues with the
     Zulip web app or server. A good default if you aren't sure which repository
     to use.
   - [zulip/zulip-flutter](https://github.com/zulip/zulip-flutter/issues) for
     issues with the mobile apps.
   - [zulip/zulip-desktop](https://github.com/zulip/zulip-desktop/issues) for
     issues that are specific to the Zulip desktop app, and therefore _do not_
     occur in the web app.
   - [zulip/zulip-terminal](https://github.com/zulip/zulip-terminal/issues) for
     issues with the terminal app.
2. Do a **quick search** of the repository to see if your issue has already
   been filed. If it has, you can add a comment if that seems helpful.
3. If you are aware of a related discussion in the Zulip development community,
   please **cross-link** between the issue and the discussion thread. [Link to a
   specific
   message](https://zulip.com/help/link-to-a-message-or-conversation#get-a-link-to-a-specific-message)
   in the discussion thread, as message links will still work even if the topic is
   renamed or resolved.

To encourage prompt attention and discussion for a bug report you have filed,
you can send a message in the Zulip development community with the key points
from your report. Be sure to [link to the GitHub
issue](https://zulip.com/development-community/#linking-to-github-issues-and-pull-requests).
See the following section for advice on where and how to start the conversation.

## Starting a conversation about a possible bug

If you are not sure whether the issue you encountered is a bug, or how to
reproduce it, we highly recommend reporting it in the [Zulip development
community](https://zulip.com/development-community/). It's the best place to
interactively discuss your problem.

Steps and best practices for starting a conversation:

1. [**Join** the Zulip development
   community](https://zulip.com/development-community/) if you don't already
   have an account.
2. Pick an **appropriate channel** to report your issue:
   - [#issues](https://chat.zulip.org/#narrow/channel/9-issues) for issues with
     the Zulip web app or server. Use this channel if you aren't sure which
     channel is most appropriate.
   - [#mobile](https://chat.zulip.org/#narrow/channel/48-mobile) for issues with
     the mobile apps.
   - [#desktop](https://chat.zulip.org/#narrow/channel/16-desktop) for issues
     that are specific to the Zulip desktop app, and therefore _do not_
     occur in the web app.
   - [#zulip-terminal](https://chat.zulip.org/#narrow/channel/206-zulip-terminal)
     for issues with the terminal app.
   - [#production
     help](https://chat.zulip.org/#narrow/channel/31-production-help) for issues
     related to self-hosting Zulip. See the [troubleshooting
     guide](../production/troubleshooting.md) for additional details.
3. **[Start a new topic](https://zulip.com/help/introduction-to-topics#how-to-start-a-new-topic)**
   for discussing your issue, using a brief summary of the issue as the name of
   the topic.

If you aren't sure where to post or how to name your topic, don't worry!
Moderators can always rename the topic, or move the thread to another channel.

Once a possible bug is reported, members of the development community will jump
in to discuss whether the report constitutes a bug, how to reproduce it, and how
it can be resolved. The initial reporter can help by monitoring the discussion
and replying to any follow-up questions. If the report is determined to be a
reproducible bug, a GitHub issue will be filed to keep track of it (see below).

## Managing bug reports

This section describes our process for managing bugs. All community members are
encouraged to help make sure this process runs smoothly, whether or not they
originally reported the bug.

Whenever a bug is tracked in GitHub and also discussed in the development
community, be sure to cross-link between the issue and the conversation. [Link
to a specific
message](https://zulip.com/help/link-to-a-message-or-conversation#get-a-link-to-a-specific-message)
in the discussion thread, as message links will still work even if the topic is
renamed or resolved.

- If you encounter a definite bug with a clear reproducer and significant user
  impact, it is best to both file a GitHub issue and immediately start a
  discussion in the development community. This helps us address important
  issues as quickly as possible.
- For minor bugs (e.g., a visual glitch in a settings menu for very long channel
  names), filing a GitHub issue is sufficient.
- If a potential bug discussed in the development community is confirmed to be
  an actual, reproducible bug, anyone can help out by filing a GitHub issue to
  track it:
  - In some cases, especially if we're planning to fix the issue right away, the
    GitHub issue description can simply quote and link to a message from the
    discussion in the development community -- no need to stress over making it
    perfect.
  - [Use Zulipbot](../contributing/zulipbot-usage.md) to add the appropriate
    labels, including “bug” and at least one area label; leave a comment on
    the issue if you don't know what area labels to use.
  - You can add the “help wanted” label (and claim the issue if you like) if
    that is appropriate based on the discussion. Note that sometimes we won't
    mark a reproducible bug as “help wanted” for various reasons. For example,
    we might want a core contributor to take it on, or the fix might be planned
    as part of a larger project.
  - Don't forget to cross-link between the issue and the discussion.
- If a bug report in GitHub is not sufficiently clear, Zulip maintainers will
  often encourage the reporter to discuss it interactively in the development
  community.
```

--------------------------------------------------------------------------------

---[FILE: reporting-security-vulnerabilities.md]---
Location: zulip-main/docs/contributing/reporting-security-vulnerabilities.md

```text
../../SECURITY.md
```

--------------------------------------------------------------------------------

---[FILE: review-process.md]---
Location: zulip-main/docs/contributing/review-process.md

```text
# Pull request review process

Pull requests submitted to Zulip go through a rigorous review process, which is
designed to ensure that we are building a high-quality product with a
maintainable codebase. This page describes the stages of review your pull
request may go through, and offers guidance on how you can help keep your pull
request moving along.

## Labels for managing the stages of pull request review

In the Zulip server/web app repository
([`zulip/zulip`](https://github.com/zulip/zulip/)), we use GitHub labels to help
everyone understand where a pull request is in the review process. These labels
are noted below, alongside their corresponding pull-request stage. Each label is
removed by the reviewer for that stage when they have no more feedback on the PR
and consider it ready for the next stage of review.

Sometimes, a label may also be removed because significant changes by
the contributor are required before the PR ready to be reviewed again. In that
case, the contributor should post a comment mentioning the reviewer when the
changes have been completed, unless the reviewer requested some other action.

## Stages of a pull request review

This section describes the stages of the pull request review process. Each stage
may require several rounds of iteration. Don't feel daunted! Not every PR will
require all the stages described, and the process often goes quite quickly for
smaller changes that are clearly explained.

1. **Product review.** Oftentimes, seeing an initial implementation will make it
   clear that the product design for a feature needs to be revised, or that
   additional changes are needed. The reviewer may therefore ask you to amend or
   change the implementation. Some changes may be blockers for getting the PR
   merged, while others may be improvements that can happen afterwards. Feel
   free to ask if it's unclear which type of feedback you're getting.
   (Follow-ups can be a great next issue to work on!)

   Your PR might be assigned the [product
   review](https://github.com/zulip/zulip/pulls?q=is%3Aopen+is%3Apr+label%3A%22product+review%22)
   label at this stage, or later in the review process as questions come up. You
   can also add this label yourself if appropriate. If doing so, be sure to
   clearly outline the product questions that need to be addressed.

2. **QA.** If your PR makes user-facing changes, it may get a round of testing
   without reference to the code. You will get feedback on any user-facing bugs
   in the implementation. To minimize the number of review round-trips, make
   sure to [thoroughly test](../contributing/code-reviewing.md#manual-testing)
   your own PR prior to asking for review.

   Your PR might be assigned the [QA
   needed](https://github.com/zulip/zulip/pulls?q=is%3Aopen+is%3Apr+label%3A%22QA+needed%22)
   label at this stage, or later on if re-testing is required.

3. **Initial code review.** All PRs will go through one or more rounds of code
   review. Your code may initially be [reviewed by other
   contributors](../contributing/code-reviewing.md). This helps us make good use
   of project maintainers' time, and helps you make progress on the PR by
   getting quick feedback. A project maintainer may leave a comment asking
   someone with expertise in the area you're working on to review your work.

4. **Maintainer code review.** In this phase, a Zulip maintainer will do a
   thorough review of your proposed code changes. Your PR may be assigned the
   [maintainer
   review](https://github.com/zulip/zulip/pulls?q=is%3Aopen+is%3Apr+label%3A%22maintainer+review%22)
   label at this stage.

5. **Documentation review.** If your PR includes documentation changes, those
   changes will require review. This generally happens fairly late in the review
   process, once the UI and the code are unlikely to undergo major changes.
   Maintainers may indicate that a PR is ready for documentation review by
   adding a [help center
   review](https://github.com/zulip/zulip/pulls?q=is%3Aopen+is%3Apr+label%3A%22help+center+review%22)
   and/or [api docs
   review](https://github.com/zulip/zulip/pulls?q=is%3Aopen+is%3Apr+label%3A%22api+docs+review%22)
   label, and mentioning a documentation maintainer in the comments.

6. **Integration review**. This is the final round of the review process,
   generally done by `@timabbott` for server and web app PRs. A maintainer will
   usually assign the [integration
   review](https://github.com/zulip/zulip/pulls?q=is%3Aopen+is%3Apr+label%3A%22integration+review%22)
   label when the PR is ready for this phase.

## How to help move the review process forward

If there are no comments on your PR for a week after you submit it, you can
check again to make sure that it's ready for review, and then post a quick
comment to remind Zulip's maintainers to take a look at your work. Consider also
[asking for a
review](../contributing/code-reviewing.md#asking-for-a-code-review) in the Zulip
development community.

After that, the key to keeping your review moving through the review process is to:

- Address _all_ the feedback to the best of your ability.
- Make it clear when the requested changes have been made
  and you believe it's time for another look.
- Make it as easy as possible to review the changes you made.

In order to do this, when you believe you have addressed the previous round of
feedback on your PR as best you can, post a comment asking reviewers to take
another look. Your comment should make it easy to understand what has been done
and what remains by:

- Summarizing the changes made since the last review you received. Be clear
  about which issues you've resolved (and how!).
- Highlighting remaining questions or decisions, with links to any relevant
  threads in the [Zulip development
  community](https://zulip.com/development-community/). It should be clear which
  feedback you _haven't_ addressed yet.
- Providing updated screenshots and information on manual testing if
  appropriate.

The easier it is to review your work, the more likely you are to receive quick
feedback.

## Follow-ups

Sometimes reviewers will comment on "follow-ups" to your pull request. A
follow-up is something that can be done separately from the changes in the
current pull request, because it's tangential to the current changes, or would
be the next task to do once the current changes are completed.

You should prioritize completing the current pull request over working on
follow-ups. However, you are expected to manage follow-ups to your work:

1. If possible, it's best to complete follow-ups as soon as you are done with
   the current pull request. That way, both you and reviewers have the context
   for the changes fresh in mind.

1. If you don't expect to have time to complete a follow-up soon (or aren't sure
   if you will), please file an issue to track it. Include a description of the
   required changes, and a link to the comment where the follow-up was
   discussed. You can copy-paste the issue description from the prior
   discussion, but be sure that what you write makes sense without needing to
   refer to the original thread.
```

--------------------------------------------------------------------------------

````

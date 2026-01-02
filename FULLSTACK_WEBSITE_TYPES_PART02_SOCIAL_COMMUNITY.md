# FULLSTACK WEBSITE TYPES - PART 02: SOCIAL & COMMUNITY PLATFORMS

**Category:** Social & Community  
**Total Types:** 8  
**Complexity:** Medium to Very High  
**Database References:** PART1, PART2, PART4, Zulip (1,290 parts), Breadit samples

---

## 📋 WEBSITE TYPES IN THIS CATEGORY

1. [Social Network (Facebook-like)](#1-social-network)
2. [Professional Network (LinkedIn-like)](#2-professional-network)
3. [Forum/Discussion Platform (Reddit-like)](#3-forum-discussion-platform)
4. [Team Chat Application (Slack-like)](#4-team-chat-application)
5. [Community Platform with Channels](#5-community-platform)
6. [Q&A Platform (Stack Overflow-like)](#6-qa-platform)
7. [Microblogging Platform (Twitter-like)](#7-microblogging-platform)
8. [Event & Meetup Platform](#8-event--meetup-platform)

---

## 1. SOCIAL NETWORK

### Description
Full-featured social networking platform with profiles, posts, comments, likes, follows, news feed, messaging, and media sharing.

### Tech Stack
- **Framework:** Next.js 14+ + TypeScript
- **Auth:** NextAuth.js
- **Database:** PostgreSQL + Prisma ORM
- **Caching:** Redis (Upstash)
- **Storage:** S3 or UploadThing
- **Real-time:** Pusher or Socket.io
- **API:** REST + tRPC

### Database Parts
- **Core:** PART1 (Auth), PART4 (Social features), PART2 (Real-time)
- **Reference:** Breadit samples for voting/interaction patterns

### Project Scaffold

```
social-network/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (feed)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # Home feed
│   │   │   └── explore/
│   │   ├── profile/
│   │   │   └── [username]/
│   │   │       ├── page.tsx
│   │   │       ├── posts/
│   │   │       ├── followers/
│   │   │       └── following/
│   │   ├── post/
│   │   │   └── [id]/
│   │   ├── messages/
│   │   │   ├── page.tsx
│   │   │   └── [conversationId]/
│   │   ├── notifications/
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       ├── posts/
│   │       ├── comments/
│   │       └── upload/
│   ├── components/
│   │   ├── feed/
│   │   │   ├── post-card.tsx
│   │   │   ├── post-composer.tsx
│   │   │   └── infinite-feed.tsx
│   │   ├── profile/
│   │   │   ├── profile-header.tsx
│   │   │   ├── profile-tabs.tsx
│   │   │   └── edit-profile-modal.tsx
│   │   ├── comments/
│   │   │   ├── comment-list.tsx
│   │   │   └── comment-form.tsx
│   │   ├── messaging/
│   │   │   ├── conversation-list.tsx
│   │   │   ├── message-thread.tsx
│   │   │   └── message-input.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── redis.ts
│   │   └── uploadthing.ts
│   └── hooks/
│       ├── use-infinite-scroll.ts
│       └── use-optimistic-update.ts
├── public/
├── .env.local
└── package.json
```

### Complete Database Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// USER MODEL
model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  name          String
  bio           String?   @db.Text
  image         String?
  coverImage    String?
  location      String?
  website       String?
  birthDate     DateTime?
  
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Auth
  accounts      Account[]
  sessions      Session[]
  
  // Content
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  
  // Social Graph
  followers     Follow[]  @relation("Following")
  following     Follow[]  @relation("Follower")
  
  // Messaging
  sentMessages      Message[] @relation("MessageSender")
  receivedMessages  Message[] @relation("MessageReceiver")
  conversations     ConversationParticipant[]
  
  // Notifications
  notifications     Notification[] @relation("NotificationRecipient")
  triggeredNotifications Notification[] @relation("NotificationActor")
  
  @@index([username])
  @@index([email])
}

// AUTHENTICATION (NextAuth)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// POSTS
model Post {
  id          String   @id @default(cuid())
  content     String   @db.Text
  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  // Media
  images      String[] // Array of image URLs
  videoUrl    String?
  
  // Engagement
  likes       Like[]
  comments    Comment[]
  shares      Share[]
  
  // Privacy
  visibility  String   @default("public") // public, friends, private
  
  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([authorId])
  @@index([createdAt])
}

// COMMENTS
model Comment {
  id          String    @id @default(cuid())
  content     String    @db.Text
  postId      String
  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  // Nested comments
  parentId    String?
  parent      Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies     Comment[] @relation("CommentReplies")
  
  // Engagement
  likes       Like[]
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([postId])
  @@index([authorId])
}

// LIKES
model Like {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Polymorphic like (can be on post or comment)
  postId    String?
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  commentId String?
  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, postId])
  @@unique([userId, commentId])
  @@index([userId])
}

// FOLLOWS
model Follow {
  id          String   @id @default(cuid())
  followerId  String
  follower    User     @relation("Follower", fields: [followerId], references: [id], onDelete: Cascade)
  followingId String
  following   User     @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  
  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

// SHARES
model Share {
  id        String   @id @default(cuid())
  userId    String
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  
  @@unique([userId, postId])
}

// MESSAGING
model Conversation {
  id           String                    @id @default(cuid())
  isGroup      Boolean                   @default(false)
  name         String?                   // For group chats
  image        String?                   // For group chats
  
  messages     Message[]
  participants ConversationParticipant[]
  
  createdAt    DateTime                  @default(now())
  updatedAt    DateTime                  @updatedAt
}

model ConversationParticipant {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  lastReadAt     DateTime?
  
  @@unique([conversationId, userId])
  @@index([userId])
}

model Message {
  id             String       @id @default(cuid())
  content        String       @db.Text
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String
  sender         User         @relation("MessageSender", fields: [senderId], references: [id], onDelete: Cascade)
  
  // Optional: for direct messages without conversation
  receiverId     String?
  receiver       User?        @relation("MessageReceiver", fields: [receiverId], references: [id])
  
  read           Boolean      @default(false)
  createdAt      DateTime     @default(now())
  
  @@index([conversationId])
  @@index([senderId])
}

// NOTIFICATIONS
model Notification {
  id         String   @id @default(cuid())
  type       String   // like, comment, follow, mention, share
  content    String
  read       Boolean  @default(false)
  
  recipientId String
  recipient   User    @relation("NotificationRecipient", fields: [recipientId], references: [id], onDelete: Cascade)
  
  actorId     String
  actor       User    @relation("NotificationActor", fields: [actorId], references: [id], onDelete: Cascade)
  
  // Links to related content
  postId      String?
  commentId   String?
  
  createdAt   DateTime @default(now())
  
  @@index([recipientId])
  @@index([createdAt])
}
```

### API Routes (Next.js App Router)

```typescript
// src/app/api/posts/create/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  images: z.array(z.string()).optional(),
  visibility: z.enum(["public", "friends", "private"]).default("public"),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { content, images, visibility } = createPostSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        content,
        images: images || [],
        visibility,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
```

```typescript
// src/app/api/posts/feed/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"

export async function GET(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get("cursor")
    const limit = 20

    // Check cache first
    const cacheKey = `feed:${session.user.id}:${cursor || "start"}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(JSON.parse(cached as string))
    }

    // Get user's following list
    const following = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    })

    const followingIds = following.map((f) => f.followingId)
    followingIds.push(session.user.id) // Include user's own posts

    // Fetch posts
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: followingIds },
        visibility: { in: ["public", "friends"] },
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        likes: {
          where: { userId: session.user.id },
          select: { id: true },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            shares: true,
          },
        },
      },
    })

    let nextCursor: string | undefined = undefined
    if (posts.length > limit) {
      const nextItem = posts.pop()
      nextCursor = nextItem!.id
    }

    const result = { posts, nextCursor }

    // Cache for 30 seconds
    await redis.setex(cacheKey, 30, JSON.stringify(result))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 })
  }
}
```

### Feed Component with Infinite Scroll

```typescript
// src/components/feed/infinite-feed.tsx
"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import PostCard from "./post-card"

export default function InfiniteFeed() {
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam = undefined }) => {
      const url = pageParam
        ? `/api/posts/feed?cursor=${pageParam}`
        : "/api/posts/feed"
      const res = await fetch(url)
      return res.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  if (status === "loading") {
    return <FeedSkeleton />
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page, i) => (
        <div key={i} className="space-y-4">
          {page.posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ))}

      {hasNextPage && (
        <div ref={ref} className="py-4">
          {isFetchingNextPage ? <LoadingSpinner /> : <div>Load more</div>}
        </div>
      )}
    </div>
  )
}
```

### Estimated Build Time
- **MVP:** 8-12 weeks
- **Production:** 16-24 weeks

### Key Features
- User profiles with customization
- News feed algorithm
- Real-time notifications
- Direct messaging
- Media uploads (photos/videos)
- Like, comment, share
- Follow/unfollow users
- Privacy controls
- Search and discovery
- Mobile responsive

---

## 2. PROFESSIONAL NETWORK

### Description
LinkedIn-style professional networking platform with profiles, connections, job postings, and industry content.

### Tech Stack
Same as Social Network with additions:
- **Search:** Elasticsearch or Algolia
- **Jobs:** Separate job board module
- **Recommendations:** ML-based connection suggestions

### Additional Schema

```prisma
model Experience {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  company     String
  location    String?
  startDate   DateTime
  endDate     DateTime?
  current     Boolean   @default(false)
  description String?   @db.Text
  
  @@index([userId])
}

model Education {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  school      String
  degree      String
  field       String?
  startDate   DateTime
  endDate     DateTime?
  description String?   @db.Text
  
  @@index([userId])
}

model Skill {
  id     String           @id @default(cuid())
  name   String           @unique
  users  UserSkill[]
}

model UserSkill {
  id            String        @id @default(cuid())
  userId        String
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  skillId       String
  skill         Skill         @relation(fields: [skillId], references: [id])
  endorsements  Endorsement[]
  
  @@unique([userId, skillId])
}

model Endorsement {
  id          String     @id @default(cuid())
  userSkillId String
  userSkill   UserSkill  @relation(fields: [userSkillId], references: [id], onDelete: Cascade)
  endorserId  String
  createdAt   DateTime   @default(now())
  
  @@unique([userSkillId, endorserId])
}

model Job {
  id          String   @id @default(cuid())
  title       String
  company     String
  location    String
  type        String   // full-time, part-time, contract, remote
  description String   @db.Text
  requirements String  @db.Text
  salary      String?
  posterId    String
  poster      User     @relation(fields: [posterId], references: [id])
  applications Application[]
  createdAt   DateTime @default(now())
  expiresAt   DateTime
  
  @@index([company])
  @@index([createdAt])
}

model Application {
  id        String   @id @default(cuid())
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  status    String   @default("pending") // pending, reviewed, accepted, rejected
  coverLetter String? @db.Text
  resumeUrl String?
  createdAt DateTime @default(now())
  
  @@unique([jobId, userId])
}
```

### Estimated Build Time
- **MVP:** 10-14 weeks
- **Production:** 20-28 weeks

---

## 3. FORUM/DISCUSSION PLATFORM

### Description
Reddit-like forum with subreddits, posts, nested comments, voting system, and moderation tools.

### Tech Stack
- **Framework:** Next.js 13+
- **Auth:** NextAuth
- **Database:** PostgreSQL + Prisma
- **Caching:** Redis (for vote counting)
- **Search:** PostgreSQL full-text or Algolia

### Database Parts
- **Core:** PART1, PART4 (Complete Breadit implementation)
- **Reference:** Breadit source (voting, nested comments)

### Complete Schema (from PART4)

```prisma
model Subreddit {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?  @db.Text
  imageUrl    String?
  creatorId   String
  creator     User     @relation("CreatedBy", fields: [creatorId], references: [id])
  
  posts       Post[]
  subscribers Subscription[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([name])
}

model Subscription {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  subredditId String
  subreddit   Subreddit @relation(fields: [subredditId], references: [id], onDelete: Cascade)
  
  @@unique([userId, subredditId])
}

enum VoteType {
  UP
  DOWN
}

model Post {
  id          String    @id @default(cuid())
  title       String
  content     Json?
  subredditId String
  subreddit   Subreddit @relation(fields: [subredditId], references: [id], onDelete: Cascade)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  comments    Comment[]
  votes       Vote[]
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([subredditId])
  @@index([authorId])
}

model Comment {
  id        String   @id @default(cuid())
  text      String
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  replyToId String?
  replyTo   Comment? @relation("ReplyTo", fields: [replyToId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  replies   Comment[] @relation("ReplyTo")
  
  votes     CommentVote[]
  
  createdAt DateTime @default(now())
  
  @@index([postId])
}

model Vote {
  id     String   @id @default(cuid())
  type   VoteType
  userId String
  user   User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  postId String
  post   Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@unique([userId, postId])
}

model CommentVote {
  id        String   @id @default(cuid())
  type      VoteType
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  commentId String
  comment   Comment  @relation(fields: [commentId], references: [id], onDelete: Cascade)
  
  @@unique([userId, commentId])
}
```

### Voting System with Redis (from PART4)

```typescript
// lib/redis.ts
import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache post vote counts
export async function cachePostVotes(postId: string, votes: number) {
  await redis.setex(`post:${postId}:votes`, 3600, votes) // Cache for 1 hour
}

export async function getCachedPostVotes(postId: string): Promise<number | null> {
  const cached = await redis.get(`post:${postId}:votes`)
  return cached ? Number(cached) : null
}
```

```typescript
// app/api/subreddit/post/vote/route.ts
import { getAuthSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redis, cachePostVotes } from "@/lib/redis"
import { z } from "zod"

const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
})

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { postId, voteType } = PostVoteValidator.parse(body)

    // Check if vote exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          postId,
          userId: session.user.id,
        },
      },
    })

    if (existingVote) {
      if (existingVote.type === voteType) {
        // Delete vote (unvote)
        await prisma.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        })
      } else {
        // Update vote
        await prisma.vote.update({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
          data: { type: voteType },
        })
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          type: voteType,
          userId: session.user.id,
          postId,
        },
      })
    }

    // Recount votes and cache
    const votesAmt = await prisma.vote.count({
      where: {
        postId,
        type: "UP",
      },
    }) - await prisma.vote.count({
      where: {
        postId,
        type: "DOWN",
      },
    })

    await cachePostVotes(postId, votesAmt)

    return new Response("OK")
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 })
  }
}
```

### Estimated Build Time
- **MVP:** 6-8 weeks
- **Production:** 12-16 weeks

---

## 4. TEAM CHAT APPLICATION

### Description
Slack-like team chat with channels, direct messages, threads, file sharing, and real-time updates.

### Tech Stack
- **Backend:** Django 5.0 + Python 3.10+
- **Frontend:** TypeScript + React
- **Database:** PostgreSQL
- **Real-time:** WebSockets (Django Channels)
- **Search:** PostgreSQL full-text

### Database Parts
- **Core:** PART2 (Real-time), Zulip samples (1,290 parts - most comprehensive)
- **Reference:** Complete Zulip architecture

### Project Scaffold (Django-based, from Zulip)

```
team-chat/
├── backend/
│   ├── zerver/              # Main Django app
│   │   ├── models/
│   │   │   ├── users.py
│   │   │   ├── streams.py    # Channels
│   │   │   ├── messages.py
│   │   │   └── realms.py     # Organizations
│   │   ├── views/
│   │   │   ├── messages.py
│   │   │   ├── streams.py
│   │   │   └── users.py
│   │   ├── lib/
│   │   │   ├── actions.py
│   │   │   ├── events.py
│   │   │   └── push_notifications.py
│   │   ├── webhooks/
│   │   └── tornado/          # WebSocket server
│   ├── settings.py
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── message_list.ts
│   │   ├── compose.ts
│   │   ├── stream_list.ts
│   │   └── socket.ts
│   └── package.json
├── docker-compose.yml
└── requirements.txt
```

### Core Models (Django)

```python
# zerver/models/streams.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class Realm(models.Model):
    """Organization/Workspace"""
    string_id = models.CharField(max_length=40, unique=True)
    name = models.CharField(max_length=40)
    description = models.TextField(default="")
    date_created = models.DateTimeField(auto_now_add=True)
    
    # Settings
    allow_message_editing = models.BooleanField(default=True)
    message_content_edit_limit_seconds = models.IntegerField(default=600)
    
    def __str__(self):
        return self.name

class Stream(models.Model):
    """Channel"""
    name = models.CharField(max_length=60)
    realm = models.ForeignKey(Realm, on_delete=models.CASCADE)
    description = models.CharField(max_length=1024, default="")
    date_created = models.DateTimeField(auto_now_add=True)
    
    # Privacy
    invite_only = models.BooleanField(default=False)
    is_web_public = models.BooleanField(default=False)
    
    # Settings
    stream_post_policy = models.PositiveSmallIntegerField(default=1)
    message_retention_days = models.IntegerField(null=True, default=None)
    
    class Meta:
        unique_together = ('realm', 'name')
    
    def __str__(self):
        return f"{self.realm.name}: {self.name}"

class Subscription(models.Model):
    """User's subscription to a stream"""
    user_profile = models.ForeignKey('UserProfile', on_delete=models.CASCADE)
    stream = models.ForeignKey(Stream, on_delete=models.CASCADE)
    
    # Notification settings
    desktop_notifications = models.BooleanField(default=True)
    audible_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=False)
    
    # Display
    pin_to_top = models.BooleanField(default=False)
    color = models.CharField(max_length=10, default="#c2c2c2")
    
    class Meta:
        unique_together = ('user_profile', 'stream')

# zerver/models/messages.py
class Message(models.Model):
    """Chat message"""
    sender = models.ForeignKey('UserProfile', on_delete=models.CASCADE)
    realm = models.ForeignKey(Realm, on_delete=models.CASCADE)
    
    # Content
    content = models.TextField()
    rendered_content = models.TextField(null=True)
    rendered_content_version = models.IntegerField(null=True)
    
    # Metadata
    date_sent = models.DateTimeField(db_index=True)
    last_edit_time = models.DateTimeField(null=True)
    edit_history = models.TextField(null=True)
    
    # Recipient (stream or DM)
    recipient = models.ForeignKey('Recipient', on_delete=models.CASCADE)
    subject = models.CharField(max_length=60)  # Thread topic
    
    # Special flags
    has_attachment = models.BooleanField(default=False, db_index=True)
    has_image = models.BooleanField(default=False, db_index=True)
    has_link = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['realm', '-id']),
            models.Index(fields=['sender', '-id']),
        ]

class Recipient(models.Model):
    """Message recipient (stream or direct message)"""
    type = models.PositiveSmallIntegerField(db_index=True)
    # 1 = personal (DM), 2 = stream, 3 = huddle (group DM)
    
    type_id = models.IntegerField(db_index=True)
    
    class Meta:
        unique_together = ('type', 'type_id')

class UserMessage(models.Model):
    """User's relationship to a message (read status, flags, etc.)"""
    user_profile = models.ForeignKey('UserProfile', on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    
    # Flags (bitfield)
    flags = models.BigIntegerField(default=0, db_index=True)
    # Flags include: read, starred, mentioned, wildcard_mentioned, etc.
    
    class Meta:
        unique_together = ('user_profile', 'message')
        indexes = [
            models.Index(fields=['user_profile', '-message']),
        ]
```

### WebSocket Event System

```python
# zerver/lib/events.py
from typing import Dict, Any, List
import ujson

def send_event(realm: Realm, event: Dict[str, Any], users: List[int]) -> None:
    """Send real-time event to users via WebSocket"""
    from zerver.tornado.event_queue import send_event_to_clients
    send_event_to_clients(realm.id, event, users)

def do_send_messages(messages: List[Dict[str, Any]]) -> List[int]:
    """Send messages and trigger events"""
    # Save to database
    message_ids = []
    for message_dict in messages:
        message = Message.objects.create(**message_dict)
        message_ids.append(message.id)
        
        # Create event
        event = {
            'type': 'message',
            'message': {
                'id': message.id,
                'sender_id': message.sender.id,
                'sender_full_name': message.sender.full_name,
                'sender_email': message.sender.email,
                'content': message.content,
                'timestamp': message.date_sent.timestamp(),
                'recipient_id': message.recipient.id,
                'subject': message.subject,
            }
        }
        
        # Get recipients
        if message.recipient.type == 2:  # Stream message
            stream = Stream.objects.get(id=message.recipient.type_id)
            subscribers = Subscription.objects.filter(stream=stream).values_list('user_profile_id', flat=True)
            send_event(message.realm, event, list(subscribers))
        else:  # Direct message
            send_event(message.realm, event, [message.recipient.type_id])
    
    return message_ids
```

### Frontend WebSocket Connection

```typescript
// frontend/src/socket.ts
class SocketConnection {
  private ws: WebSocket | null = null
  private eventQueue: Event[] = []
  private lastEventId: number = -1

  connect() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    this.ws = new WebSocket(`${protocol}//${window.location.host}/sockjs`)

    this.ws.onopen = () => {
      console.log("WebSocket connected")
      // Register for events
      this.send({
        type: "register",
        queue_id: this.getQueueId(),
        last_event_id: this.lastEventId,
      })
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleEvent(data)
    }

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    this.ws.onclose = () => {
      console.log("WebSocket closed, reconnecting...")
      setTimeout(() => this.connect(), 5000)
    }
  }

  handleEvent(event: any) {
    this.lastEventId = event.id

    switch (event.type) {
      case "message":
        this.handleNewMessage(event.message)
        break
      case "update_message":
        this.handleMessageUpdate(event)
        break
      case "typing":
        this.handleTyping(event)
        break
      // ... more event types
    }
  }

  handleNewMessage(message: any) {
    // Add to message list
    messageList.addMessage(message)
    
    // Update unread counts
    if (message.sender_id !== currentUserId) {
      unreadCounter.increment(message.recipient_id)
    }
    
    // Show notification
    if (document.hidden && message.sender_id !== currentUserId) {
      new Notification(`${message.sender_full_name}: ${message.content}`)
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }
}

export const socket = new SocketConnection()
```

### Estimated Build Time
- **MVP:** 10-14 weeks
- **Production:** 20-30 weeks

### Key Features from Zulip
- Topic-based threading
- Real-time message updates
- File/image uploads
- Markdown support
- Emoji reactions
- Search across all messages
- User presence (online/away)
- Typing indicators
- Desktop/mobile notifications
- Message editing/deletion
- Integrations/webhooks

---

## 5-8. ADDITIONAL PLATFORMS (Quick Reference)

### 5. Community Platform with Channels
- **Stack:** Next.js + PostgreSQL + WebSockets
- **Build Time:** 8-12 weeks
- **Key:** Discord-like with voice/video channels
- **DB Parts:** PART1, PART2, Zulip patterns

### 6. Q&A Platform
- **Stack:** Next.js + PostgreSQL + Search
- **Build Time:** 6-10 weeks
- **Key:** Stack Overflow-like with reputation system
- **DB Parts:** PART1, PART4 (voting)

### 7. Microblogging Platform
- **Stack:** Next.js + Redis + PostgreSQL
- **Build Time:** 6-8 weeks
- **Key:** Twitter-like with short posts, hashtags
- **DB Parts:** PART1, PART4, PART2 (real-time)

### 8. Event & Meetup Platform
- **Stack:** Next.js + PostgreSQL + Maps API
- **Build Time:** 8-10 weeks
- **Key:** Meetup.com-like with RSVPs, location search
- **DB Parts:** PART1, PART2, PART3 (payments)

---

**Next:** [PART 03 - E-commerce & Marketplace →](FULLSTACK_WEBSITE_TYPES_PART03_ECOMMERCE_MARKETPLACE.md)

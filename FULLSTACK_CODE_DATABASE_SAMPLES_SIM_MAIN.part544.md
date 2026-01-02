---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 544
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 544 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: subscription.ts]---
Location: sim-main/apps/sim/lib/billing/webhooks/subscription.ts

```typescript
import { db } from '@sim/db'
import { member, organization, subscription } from '@sim/db/schema'
import { and, eq, ne } from 'drizzle-orm'
import { calculateSubscriptionOverage } from '@/lib/billing/core/billing'
import { syncUsageLimitsFromSubscription } from '@/lib/billing/core/usage'
import { restoreUserProSubscription } from '@/lib/billing/organizations/membership'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import {
  getBilledOverageForSubscription,
  resetUsageForSubscription,
} from '@/lib/billing/webhooks/invoices'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('StripeSubscriptionWebhooks')

/**
 * Restore personal Pro subscriptions for all members of an organization
 * when the team/enterprise subscription ends.
 */
async function restoreMemberProSubscriptions(organizationId: string): Promise<number> {
  let restoredCount = 0

  try {
    const members = await db
      .select({ userId: member.userId })
      .from(member)
      .where(eq(member.organizationId, organizationId))

    for (const m of members) {
      const result = await restoreUserProSubscription(m.userId)
      if (result.restored) {
        restoredCount++
      }
    }

    if (restoredCount > 0) {
      logger.info('Restored Pro subscriptions for team members', {
        organizationId,
        restoredCount,
        totalMembers: members.length,
      })
    }
  } catch (error) {
    logger.error('Failed to restore member Pro subscriptions', {
      organizationId,
      error,
    })
  }

  return restoredCount
}

/**
 * Cleanup organization when team/enterprise subscription is deleted.
 * - Restores member Pro subscriptions
 * - Deletes the organization
 * - Syncs usage limits for former members (resets to free or Pro tier)
 */
async function cleanupOrganizationSubscription(organizationId: string): Promise<{
  restoredProCount: number
  membersSynced: number
}> {
  // Get member userIds before deletion (needed for limit syncing after org deletion)
  const memberUserIds = await db
    .select({ userId: member.userId })
    .from(member)
    .where(eq(member.organizationId, organizationId))

  const restoredProCount = await restoreMemberProSubscriptions(organizationId)

  await db.delete(organization).where(eq(organization.id, organizationId))

  // Sync usage limits for former members (now free or Pro tier)
  for (const m of memberUserIds) {
    await syncUsageLimitsFromSubscription(m.userId)
  }

  return { restoredProCount, membersSynced: memberUserIds.length }
}

/**
 * Handle new subscription creation - reset usage if transitioning from free to paid
 */
export async function handleSubscriptionCreated(subscriptionData: {
  id: string
  referenceId: string
  plan: string | null
  status: string
}) {
  try {
    const otherActiveSubscriptions = await db
      .select()
      .from(subscription)
      .where(
        and(
          eq(subscription.referenceId, subscriptionData.referenceId),
          eq(subscription.status, 'active'),
          ne(subscription.id, subscriptionData.id) // Exclude current subscription
        )
      )

    const wasFreePreviously = otherActiveSubscriptions.length === 0
    const isPaidPlan =
      subscriptionData.plan === 'pro' ||
      subscriptionData.plan === 'team' ||
      subscriptionData.plan === 'enterprise'

    if (wasFreePreviously && isPaidPlan) {
      logger.info('Detected free -> paid transition, resetting usage', {
        subscriptionId: subscriptionData.id,
        referenceId: subscriptionData.referenceId,
        plan: subscriptionData.plan,
      })

      await resetUsageForSubscription({
        plan: subscriptionData.plan,
        referenceId: subscriptionData.referenceId,
      })

      logger.info('Successfully reset usage for free -> paid transition', {
        subscriptionId: subscriptionData.id,
        referenceId: subscriptionData.referenceId,
        plan: subscriptionData.plan,
      })
    } else {
      logger.info('No usage reset needed', {
        subscriptionId: subscriptionData.id,
        referenceId: subscriptionData.referenceId,
        plan: subscriptionData.plan,
        wasFreePreviously,
        isPaidPlan,
        otherActiveSubscriptionsCount: otherActiveSubscriptions.length,
      })
    }
  } catch (error) {
    logger.error('Failed to handle subscription creation usage reset', {
      subscriptionId: subscriptionData.id,
      referenceId: subscriptionData.referenceId,
      error,
    })
    throw error
  }
}

/**
 * Handle subscription deletion/cancellation - bill for final period overages
 * This fires when a subscription reaches its cancel_at_period_end date or is cancelled immediately
 */
export async function handleSubscriptionDeleted(subscription: {
  id: string
  plan: string | null
  referenceId: string
  stripeSubscriptionId: string | null
  seats?: number | null
}) {
  try {
    const stripeSubscriptionId = subscription.stripeSubscriptionId || ''

    logger.info('Processing subscription deletion', {
      stripeSubscriptionId,
      subscriptionId: subscription.id,
    })

    // Calculate overage for the final billing period
    const totalOverage = await calculateSubscriptionOverage(subscription)
    const stripe = requireStripeClient()

    // Enterprise plans have no overages - reset usage and cleanup org
    if (subscription.plan === 'enterprise') {
      await resetUsageForSubscription({
        plan: subscription.plan,
        referenceId: subscription.referenceId,
      })

      const { restoredProCount, membersSynced } = await cleanupOrganizationSubscription(
        subscription.referenceId
      )

      logger.info('Successfully processed enterprise subscription cancellation', {
        subscriptionId: subscription.id,
        stripeSubscriptionId,
        restoredProCount,
        organizationDeleted: true,
        membersSynced,
      })
      return
    }

    // Get already-billed overage from threshold billing
    const billedOverage = await getBilledOverageForSubscription(subscription)

    // Only bill the remaining unbilled overage
    const remainingOverage = Math.max(0, totalOverage - billedOverage)

    logger.info('Subscription deleted overage calculation', {
      subscriptionId: subscription.id,
      totalOverage,
      billedOverage,
      remainingOverage,
    })

    // Create final overage invoice if needed
    if (remainingOverage > 0 && stripeSubscriptionId) {
      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
      const customerId = stripeSubscription.customer as string
      const cents = Math.round(remainingOverage * 100)

      // Use the subscription end date for the billing period
      const endedAt = stripeSubscription.ended_at || Math.floor(Date.now() / 1000)
      const billingPeriod = new Date(endedAt * 1000).toISOString().slice(0, 7)

      const itemIdemKey = `final-overage-item:${customerId}:${stripeSubscriptionId}:${billingPeriod}`
      const invoiceIdemKey = `final-overage-invoice:${customerId}:${stripeSubscriptionId}:${billingPeriod}`

      try {
        // Create a one-time invoice for the final overage
        const overageInvoice = await stripe.invoices.create(
          {
            customer: customerId,
            collection_method: 'charge_automatically',
            auto_advance: true, // Auto-finalize and attempt payment
            description: `Final overage charges for ${subscription.plan} subscription (${billingPeriod})`,
            metadata: {
              type: 'final_overage_billing',
              billingPeriod,
              subscriptionId: stripeSubscriptionId,
              cancelledAt: stripeSubscription.canceled_at?.toString() || '',
            },
          },
          { idempotencyKey: invoiceIdemKey }
        )

        // Add the overage line item
        await stripe.invoiceItems.create(
          {
            customer: customerId,
            invoice: overageInvoice.id,
            amount: cents,
            currency: 'usd',
            description: `Usage overage for ${subscription.plan} plan (Final billing period)`,
            metadata: {
              type: 'final_usage_overage',
              usage: remainingOverage.toFixed(2),
              totalOverage: totalOverage.toFixed(2),
              billedOverage: billedOverage.toFixed(2),
              billingPeriod,
            },
          },
          { idempotencyKey: itemIdemKey }
        )

        // Finalize the invoice (this will trigger payment collection)
        if (overageInvoice.id) {
          await stripe.invoices.finalizeInvoice(overageInvoice.id)
        }

        logger.info('Created final overage invoice for cancelled subscription', {
          subscriptionId: subscription.id,
          stripeSubscriptionId,
          invoiceId: overageInvoice.id,
          totalOverage,
          billedOverage,
          remainingOverage,
          cents,
          billingPeriod,
        })
      } catch (invoiceError) {
        logger.error('Failed to create final overage invoice', {
          subscriptionId: subscription.id,
          stripeSubscriptionId,
          totalOverage,
          billedOverage,
          remainingOverage,
          error: invoiceError,
        })
        // Don't throw - we don't want to fail the webhook
      }
    } else {
      logger.info('No overage to bill for cancelled subscription', {
        subscriptionId: subscription.id,
        plan: subscription.plan,
      })
    }

    // Reset usage after billing
    await resetUsageForSubscription({
      plan: subscription.plan,
      referenceId: subscription.referenceId,
    })

    // Plan-specific cleanup after billing
    let restoredProCount = 0
    let organizationDeleted = false
    let membersSynced = 0

    if (subscription.plan === 'team') {
      const cleanup = await cleanupOrganizationSubscription(subscription.referenceId)
      restoredProCount = cleanup.restoredProCount
      membersSynced = cleanup.membersSynced
      organizationDeleted = true
    } else if (subscription.plan === 'pro') {
      await syncUsageLimitsFromSubscription(subscription.referenceId)
      membersSynced = 1
    }

    // Note: better-auth's Stripe plugin already updates status to 'canceled' before calling this handler
    // We handle overage billing, usage reset, Pro restoration, limit syncing, and org cleanup

    logger.info('Successfully processed subscription cancellation', {
      subscriptionId: subscription.id,
      stripeSubscriptionId,
      plan: subscription.plan,
      totalOverage,
      restoredProCount,
      organizationDeleted,
      membersSynced,
    })
  } catch (error) {
    logger.error('Failed to handle subscription deletion', {
      subscriptionId: subscription.id,
      stripeSubscriptionId: subscription.stripeSubscriptionId || '',
      error,
    })
    throw error // Re-throw to signal webhook failure for retry
  }
}
```

--------------------------------------------------------------------------------

---[FILE: code.tsx]---
Location: sim-main/apps/sim/lib/blog/code.tsx

```typescript
'use client'

import { Code } from '@/components/emcn'

interface CodeBlockProps {
  code: string
  language: 'javascript' | 'json' | 'python'
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return <Code.Viewer code={code} showGutter={true} language={language} />
}
```

--------------------------------------------------------------------------------

---[FILE: faq.tsx]---
Location: sim-main/apps/sim/lib/blog/faq.tsx

```typescript
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  if (!items || items.length === 0) return null
  return (
    <section className='mt-12'>
      <h2 className='mb-4 font-medium text-[24px]'>FAQ</h2>
      <div className='space-y-6'>
        {items.map((it, i) => (
          <div key={i}>
            <h3 className='mb-2 font-medium text-[20px]'>{it.q}</h3>
            <p className='text-[19px] text-gray-800 leading-relaxed'>{it.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: mdx.tsx]---
Location: sim-main/apps/sim/lib/blog/mdx.tsx
Signals: Next.js

```typescript
import clsx from 'clsx'
import Image from 'next/image'
import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import { CodeBlock } from '@/lib/blog/code'

export const mdxComponents: MDXRemoteProps['components'] = {
  img: (props: any) => (
    <Image
      src={props.src}
      alt={props.alt || ''}
      width={props.width ? Number(props.width) : 800}
      height={props.height ? Number(props.height) : 450}
      className={clsx('h-auto w-full rounded-lg', props.className)}
      sizes='(max-width: 768px) 100vw, 800px'
      loading='lazy'
      unoptimized
    />
  ),
  h2: (props: any) => (
    <h2
      {...props}
      style={{ fontSize: '30px', marginTop: '3rem', marginBottom: '1.5rem' }}
      className={clsx('font-medium text-black leading-tight', props.className)}
    />
  ),
  h3: (props: any) => (
    <h3
      {...props}
      style={{ fontSize: '24px', marginTop: '1.5rem', marginBottom: '0.75rem' }}
      className={clsx('font-medium leading-tight', props.className)}
    />
  ),
  h4: (props: any) => (
    <h4
      {...props}
      style={{ fontSize: '19px', marginTop: '1.5rem', marginBottom: '0.75rem' }}
      className={clsx('font-medium leading-tight', props.className)}
    />
  ),
  p: (props: any) => (
    <p
      {...props}
      style={{ fontSize: '19px', marginBottom: '1.5rem', fontWeight: '400' }}
      className={clsx('text-gray-800 leading-relaxed', props.className)}
    />
  ),
  ul: (props: any) => (
    <ul
      {...props}
      style={{ fontSize: '19px', marginBottom: '1rem', fontWeight: '400' }}
      className={clsx('list-outside list-disc pl-6 text-gray-800 leading-relaxed', props.className)}
    />
  ),
  ol: (props: any) => (
    <ol
      {...props}
      style={{ fontSize: '19px', marginBottom: '1rem', fontWeight: '400' }}
      className={clsx(
        'list-outside list-decimal pl-6 text-gray-800 leading-relaxed',
        props.className
      )}
    />
  ),
  li: (props: any) => <li {...props} className={clsx('mb-2', props.className)} />,
  strong: (props: any) => <strong {...props} className={clsx('font-semibold', props.className)} />,
  em: (props: any) => <em {...props} className={clsx('italic', props.className)} />,
  a: (props: any) => {
    const isAnchorLink = props.className?.includes('anchor')
    if (isAnchorLink) {
      return <a {...props} />
    }
    return (
      <a
        {...props}
        className={clsx(
          'font-medium text-[#33B4FF] underline hover:text-[#2A9FE8]',
          props.className
        )}
      />
    )
  },
  figure: (props: any) => (
    <figure {...props} className={clsx('my-8 overflow-hidden rounded-lg', props.className)} />
  ),
  hr: (props: any) => (
    <hr
      {...props}
      className={clsx('my-8 border-gray-200', props.className)}
      style={{ marginBottom: '1.5rem' }}
    />
  ),
  pre: (props: any) => {
    const child = props.children
    const isCodeBlock = child && typeof child === 'object' && child.props

    if (isCodeBlock) {
      const codeContent = child.props.children || ''
      const className = child.props.className || ''
      const language = className.replace('language-', '') || 'javascript'

      const languageMap: Record<string, 'javascript' | 'json' | 'python'> = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'javascript',
        tsx: 'javascript',
        typescript: 'javascript',
        javascript: 'javascript',
        json: 'json',
        python: 'python',
        py: 'python',
      }

      const mappedLanguage = languageMap[language.toLowerCase()] || 'javascript'

      return (
        <div className='my-6'>
          <CodeBlock
            code={typeof codeContent === 'string' ? codeContent.trim() : String(codeContent)}
            language={mappedLanguage}
          />
        </div>
      )
    }
    return <pre {...props} className={clsx('my-4 overflow-x-auto rounded-lg', props.className)} />
  },
  code: (props: any) => {
    if (!props.className) {
      return (
        <code
          {...props}
          className={clsx(
            'rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] text-red-600',
            props.className
          )}
        />
      )
    }
    return <code {...props} />
  },
}
```

--------------------------------------------------------------------------------

---[FILE: registry.ts]---
Location: sim-main/apps/sim/lib/blog/registry.ts

```typescript
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { mdxComponents } from '@/lib/blog/mdx'
import type { BlogMeta, BlogPost, TagWithCount } from '@/lib/blog/schema'
import { AuthorSchema, BlogFrontmatterSchema } from '@/lib/blog/schema'
import { AUTHORS_DIR, BLOG_DIR, byDateDesc, ensureContentDirs, toIsoDate } from '@/lib/blog/utils'

let cachedMeta: BlogMeta[] | null = null
let cachedAuthors: Record<string, any> | null = null

async function loadAuthors(): Promise<Record<string, any>> {
  if (cachedAuthors) return cachedAuthors
  await ensureContentDirs()
  const files = await fs.readdir(AUTHORS_DIR).catch(() => [])
  const authors: Record<string, any> = {}
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const raw = await fs.readFile(path.join(AUTHORS_DIR, file), 'utf-8')
    const json = JSON.parse(raw)
    const author = AuthorSchema.parse(json)
    authors[author.id] = author
  }
  cachedAuthors = authors
  return authors
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

async function scanFrontmatters(): Promise<BlogMeta[]> {
  if (cachedMeta) return cachedMeta
  await ensureContentDirs()
  const entries = await fs.readdir(BLOG_DIR).catch(() => [])
  const authorsMap = await loadAuthors()
  const results: BlogMeta[] = []
  for (const slug of entries) {
    const postDir = path.join(BLOG_DIR, slug)
    const stat = await fs.stat(postDir).catch(() => null)
    if (!stat || !stat.isDirectory()) continue
    const mdxPath = path.join(postDir, 'index.mdx')
    const hasMdx = await fs
      .stat(mdxPath)
      .then((s) => s.isFile())
      .catch(() => false)
    if (!hasMdx) continue
    const raw = await fs.readFile(mdxPath, 'utf-8')
    const { data } = matter(raw)
    const fm = BlogFrontmatterSchema.parse(data)
    const authors = fm.authors.map((id) => authorsMap[id]).filter(Boolean)
    if (authors.length === 0) throw new Error(`Authors not found for "${slug}"`)
    results.push({
      slug: fm.slug,
      title: fm.title,
      description: fm.description,
      date: toIsoDate(fm.date),
      updated: fm.updated ? toIsoDate(fm.updated) : undefined,
      author: authors[0],
      authors,
      readingTime: fm.readingTime,
      tags: fm.tags,
      ogImage: fm.ogImage,
      canonical: fm.canonical,
      ogAlt: fm.ogAlt,
      about: fm.about,
      timeRequired: fm.timeRequired,
      faq: fm.faq,
      draft: fm.draft,
      featured: fm.featured ?? false,
    })
  }
  cachedMeta = results.sort(byDateDesc)
  return cachedMeta
}

export async function getAllPostMeta(): Promise<BlogMeta[]> {
  return (await scanFrontmatters()).filter((p) => !p.draft)
}

export async function getAllTags(): Promise<TagWithCount[]> {
  const posts = await getAllPostMeta()
  const counts: Record<string, number> = {}
  for (const p of posts) {
    for (const t of p.tags) counts[t] = (counts[t] || 0) + 1
  }
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const meta = await scanFrontmatters()
  const found = meta.find((m) => m.slug === slug)
  if (!found) throw new Error(`Post not found: ${slug}`)
  const mdxPath = path.join(BLOG_DIR, slug, 'index.mdx')
  const raw = await fs.readFile(mdxPath, 'utf-8')
  const { content, data } = matter(raw)
  const fm = BlogFrontmatterSchema.parse(data)
  const compiled = await compileMDX({
    source: content,
    components: mdxComponents as any,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: 'anchor' } }],
        ],
      },
    },
  })
  const headings: { text: string; id: string }[] = []
  const lines = content.split('\n')
  for (const line of lines) {
    const match = /^##\s+(.+)$/.exec(line.trim())
    if (match) {
      const text = match[1].trim()
      headings.push({ text, id: slugify(text) })
    }
  }
  return {
    ...found,
    Content: () => (compiled as any).content,
    updated: fm.updated ? toIsoDate(fm.updated) : found.updated,
    headings,
  }
}

export function invalidateBlogCaches() {
  cachedMeta = null
  cachedAuthors = null
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogMeta[]> {
  const posts = await getAllPostMeta()
  const current = posts.find((p) => p.slug === slug)
  if (!current) return []
  const scored = posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || byDateDesc(a.post, b.post))
    .slice(0, limit)
    .map((x) => x.post)
  return scored
}
```

--------------------------------------------------------------------------------

---[FILE: schema.ts]---
Location: sim-main/apps/sim/lib/blog/schema.ts
Signals: Zod

```typescript
import { z } from 'zod'

export const AuthorSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    url: z.string().url().optional(),
    xHandle: z.string().optional(),
    avatarUrl: z.string().optional(), // allow relative or absolute
  })
  .strict()

export type Author = z.infer<typeof AuthorSchema>

export const BlogFrontmatterSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(5),
    description: z.string().min(20),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    authors: z.array(z.string()).min(1),
    readingTime: z.number().int().positive().optional(),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().min(1),
    ogAlt: z.string().optional(),
    about: z.array(z.string()).optional(),
    timeRequired: z.string().optional(),
    faq: z
      .array(
        z.object({
          q: z.string().min(1),
          a: z.string().min(1),
        })
      )
      .optional(),
    canonical: z.string().url(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  })
  .strict()

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>

export interface BlogMeta {
  slug: string
  title: string
  description: string
  date: string // ISO
  updated?: string // ISO
  author: Author
  authors: Author[]
  readingTime?: number
  tags: string[]
  ogImage: string
  ogAlt?: string
  about?: string[]
  timeRequired?: string
  faq?: { q: string; a: string }[]
  canonical: string
  draft: boolean
  featured: boolean
  sourcePath?: string
}

export interface BlogPost extends BlogMeta {
  Content: React.ComponentType
  headings?: { text: string; id: string }[]
}

export interface TagWithCount {
  tag: string
  count: number
}
```

--------------------------------------------------------------------------------

---[FILE: seo.ts]---
Location: sim-main/apps/sim/lib/blog/seo.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { BlogMeta } from '@/lib/blog/schema'

export function buildPostMetadata(post: BlogMeta): Metadata {
  const base = new URL(post.canonical)
  const baseUrl = `${base.protocol}//${base.host}`
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: (post.authors && post.authors.length > 0 ? post.authors : [post.author]).map((a) => ({
      name: a.name,
      url: a.url,
    })),
    creator: post.author.name,
    publisher: 'Sim',
    robots: post.draft
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: post.canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.canonical,
      siteName: 'Sim',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: (post.authors && post.authors.length > 0 ? post.authors : [post.author]).map(
        (a) => a.name
      ),
      tags: post.tags,
      images: [
        {
          url: post.ogImage.startsWith('http') ? post.ogImage : `${baseUrl}${post.ogImage}`,
          width: 1200,
          height: 630,
          alt: post.ogAlt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.ogImage],
      creator: post.author.url?.includes('x.com') ? `@${post.author.xHandle || ''}` : undefined,
      site: '@simdotai',
    },
    other: {
      'article:published_time': post.date,
      'article:modified_time': post.updated ?? post.date,
      'article:author': post.author.name,
      'article:section': 'Technology',
    },
  }
}

export function buildArticleJsonLd(post: BlogMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: [
      {
        '@type': 'ImageObject',
        url: post.ogImage,
        caption: post.ogAlt || post.title,
      },
    ],
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: (post.authors && post.authors.length > 0 ? post.authors : [post.author]).map((a) => ({
      '@type': 'Person',
      name: a.name,
      url: a.url,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'Sim',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sim.ai/logo/primary/medium.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonical,
    },
    keywords: post.tags.join(', '),
    about: (post.about || []).map((a) => ({ '@type': 'Thing', name: a })),
    isAccessibleForFree: true,
    timeRequired: post.timeRequired,
    articleSection: 'Technology',
    inLanguage: 'en-US',
  }
}

export function buildBreadcrumbJsonLd(post: BlogMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sim.ai' },
      { '@type': 'ListItem', position: 2, name: 'Sim Studio', item: 'https://sim.ai/studio' },
      { '@type': 'ListItem', position: 3, name: post.title, item: post.canonical },
    ],
  }
}

export function buildFaqJsonLd(items: { q: string; a: string }[] | undefined) {
  if (!items || items.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function buildBlogJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Sim Studio',
    url: 'https://sim.ai/studio',
    description: 'Announcements, insights, and guides for building AI agent workflows.',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/blog/utils.ts

```typescript
import fs from 'fs/promises'
import path from 'path'

export const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
export const AUTHORS_DIR = path.join(process.cwd(), 'content', 'authors')

export async function ensureContentDirs() {
  await fs.mkdir(BLOG_DIR, { recursive: true })
  await fs.mkdir(AUTHORS_DIR, { recursive: true })
}

export function toIsoDate(value: Date | string | number): string {
  if (value instanceof Date) return value.toISOString()
  return new Date(value).toISOString()
}

export function byDateDesc<T extends { date: string }>(a: T, b: T) {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

export function stripMdxExtension(file: string) {
  return file.replace(/\.mdx?$/i, '')
}

export function isRelativeUrl(url: string) {
  return url.startsWith('/')
}
```

--------------------------------------------------------------------------------

---[FILE: branding.ts]---
Location: sim-main/apps/sim/lib/branding/branding.ts

```typescript
import { getEnv } from '@/lib/core/config/env'

export interface ThemeColors {
  primaryColor?: string
  primaryHoverColor?: string
  accentColor?: string
  accentHoverColor?: string
  backgroundColor?: string
}

export interface BrandConfig {
  name: string
  logoUrl?: string
  faviconUrl?: string
  customCssUrl?: string
  supportEmail?: string
  documentationUrl?: string
  termsUrl?: string
  privacyUrl?: string
  theme?: ThemeColors
}

/**
 * Default brand configuration values
 */
const defaultConfig: BrandConfig = {
  name: 'Sim',
  logoUrl: undefined,
  faviconUrl: '/favicon/favicon.ico',
  customCssUrl: undefined,
  supportEmail: 'help@sim.ai',
  documentationUrl: undefined,
  termsUrl: undefined,
  privacyUrl: undefined,
  theme: {
    primaryColor: '#701ffc',
    primaryHoverColor: '#802fff',
    accentColor: '#9d54ff',
    accentHoverColor: '#a66fff',
    backgroundColor: '#0c0c0c',
  },
}

const getThemeColors = (): ThemeColors => {
  return {
    primaryColor: getEnv('NEXT_PUBLIC_BRAND_PRIMARY_COLOR') || defaultConfig.theme?.primaryColor,
    primaryHoverColor:
      getEnv('NEXT_PUBLIC_BRAND_PRIMARY_HOVER_COLOR') || defaultConfig.theme?.primaryHoverColor,
    accentColor: getEnv('NEXT_PUBLIC_BRAND_ACCENT_COLOR') || defaultConfig.theme?.accentColor,
    accentHoverColor:
      getEnv('NEXT_PUBLIC_BRAND_ACCENT_HOVER_COLOR') || defaultConfig.theme?.accentHoverColor,
    backgroundColor:
      getEnv('NEXT_PUBLIC_BRAND_BACKGROUND_COLOR') || defaultConfig.theme?.backgroundColor,
  }
}

/**
 * Get branding configuration from environment variables
 * Supports runtime configuration via Docker/Kubernetes
 */
export const getBrandConfig = (): BrandConfig => {
  return {
    name: getEnv('NEXT_PUBLIC_BRAND_NAME') || defaultConfig.name,
    logoUrl: getEnv('NEXT_PUBLIC_BRAND_LOGO_URL') || defaultConfig.logoUrl,
    faviconUrl: getEnv('NEXT_PUBLIC_BRAND_FAVICON_URL') || defaultConfig.faviconUrl,
    customCssUrl: getEnv('NEXT_PUBLIC_CUSTOM_CSS_URL') || defaultConfig.customCssUrl,
    supportEmail: getEnv('NEXT_PUBLIC_SUPPORT_EMAIL') || defaultConfig.supportEmail,
    documentationUrl: getEnv('NEXT_PUBLIC_DOCUMENTATION_URL') || defaultConfig.documentationUrl,
    termsUrl: getEnv('NEXT_PUBLIC_TERMS_URL') || defaultConfig.termsUrl,
    privacyUrl: getEnv('NEXT_PUBLIC_PRIVACY_URL') || defaultConfig.privacyUrl,
    theme: getThemeColors(),
  }
}

/**
 * Hook to use brand configuration in React components
 */
export const useBrandConfig = () => {
  return getBrandConfig()
}
```

--------------------------------------------------------------------------------

---[FILE: inject-theme.ts]---
Location: sim-main/apps/sim/lib/branding/inject-theme.ts

```typescript
// Helper to detect if background is dark
function isDarkBackground(hexColor: string): boolean {
  const hex = hexColor.replace('#', '')
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

export function generateThemeCSS(): string {
  const cssVars: string[] = []

  if (process.env.NEXT_PUBLIC_BRAND_PRIMARY_COLOR) {
    cssVars.push(`--brand-primary-hex: ${process.env.NEXT_PUBLIC_BRAND_PRIMARY_COLOR};`)
  }

  if (process.env.NEXT_PUBLIC_BRAND_PRIMARY_HOVER_COLOR) {
    cssVars.push(`--brand-primary-hover-hex: ${process.env.NEXT_PUBLIC_BRAND_PRIMARY_HOVER_COLOR};`)
  }

  if (process.env.NEXT_PUBLIC_BRAND_ACCENT_COLOR) {
    cssVars.push(`--brand-accent-hex: ${process.env.NEXT_PUBLIC_BRAND_ACCENT_COLOR};`)
  }

  if (process.env.NEXT_PUBLIC_BRAND_ACCENT_HOVER_COLOR) {
    cssVars.push(`--brand-accent-hover-hex: ${process.env.NEXT_PUBLIC_BRAND_ACCENT_HOVER_COLOR};`)
  }

  if (process.env.NEXT_PUBLIC_BRAND_BACKGROUND_COLOR) {
    cssVars.push(`--brand-background-hex: ${process.env.NEXT_PUBLIC_BRAND_BACKGROUND_COLOR};`)

    // Add dark theme class when background is dark
    const isDark = isDarkBackground(process.env.NEXT_PUBLIC_BRAND_BACKGROUND_COLOR)
    if (isDark) {
      cssVars.push(`--brand-is-dark: 1;`)
    }
  }

  return cssVars.length > 0 ? `:root { ${cssVars.join(' ')} }` : ''
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: sim-main/apps/sim/lib/branding/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import { getBrandConfig } from '@/lib/branding/branding'
import { getBaseUrl } from '@/lib/core/utils/urls'

/**
 * Generate dynamic metadata based on brand configuration
 */
export function generateBrandedMetadata(override: Partial<Metadata> = {}): Metadata {
  const brand = getBrandConfig()

  const defaultTitle = brand.name
  const summaryFull = `Sim is an open-source AI agent workflow builder. Developers at trail-blazing startups to Fortune 500 companies deploy agentic workflows on the Sim platform. 60,000+ developers already use Sim to build and deploy AI agent workflows and connect them to 100+ apps. Sim is SOC2 and HIPAA compliant, ensuring enterprise-grade security for AI automation.`
  const summaryShort = `Sim is an open-source AI agent workflow builder for production workflows.`

  return {
    title: {
      template: `%s | ${brand.name}`,
      default: defaultTitle,
    },
    description: summaryShort,
    applicationName: brand.name,
    authors: [{ name: brand.name }],
    generator: 'Next.js',
    keywords: [
      'AI agent',
      'AI agent builder',
      'AI agent workflow',
      'AI workflow automation',
      'visual workflow editor',
      'AI agents',
      'workflow canvas',
      'intelligent automation',
      'AI tools',
      'workflow designer',
      'artificial intelligence',
      'business automation',
      'AI agent workflows',
      'visual programming',
    ],
    referrer: 'origin-when-cross-origin',
    creator: brand.name,
    publisher: brand.name,
    metadataBase: new URL(getBaseUrl()),
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/en-US',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: getBaseUrl(),
      title: defaultTitle,
      description: summaryFull,
      siteName: brand.name,
      images: [
        {
          url: brand.logoUrl || '/social/facebook.png',
          width: 1200,
          height: 630,
          alt: brand.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: summaryFull,
      images: [brand.logoUrl || '/social/twitter.png'],
      creator: '@simstudioai',
      site: '@simstudioai',
    },
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        {
          url: '/favicon/favicon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          url: '/favicon/favicon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        { url: brand.faviconUrl || '/sim.png', sizes: 'any', type: 'image/png' },
      ],
      apple: '/favicon/apple-touch-icon.png',
      shortcut: brand.faviconUrl || '/favicon/favicon.ico',
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: brand.name,
    },
    formatDetection: {
      telephone: false,
    },
    category: 'technology',
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': '#701FFC', // Default Sim brand primary color
      'msapplication-config': '/favicon/browserconfig.xml',
    },
    ...override,
  }
}

/**
 * Generate static structured data for SEO
 */
export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sim',
    description:
      'Sim is an open-source AI agent workflow builder. Developers at trail-blazing startups to Fortune 500 companies deploy agentic workflows on the Sim platform. 60,000+ developers already use Sim to build and deploy AI agent workflows and connect them to 100+ apps. Sim is SOC2 and HIPAA compliant, ensuring enterprise-level security.',
    url: getBaseUrl(),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    applicationSubCategory: 'AIWorkflowAutomation',
    areaServed: 'Worldwide',
    availableLanguage: ['en'],
    offers: {
      '@type': 'Offer',
      category: 'SaaS',
    },
    creator: {
      '@type': 'Organization',
      name: 'Sim',
      url: 'https://sim.ai',
    },
    featureList: [
      'Visual AI Agent Builder',
      'Workflow Canvas Interface',
      'AI Agent Automation',
      'Custom AI Workflows',
    ],
  }
}
```

--------------------------------------------------------------------------------

````

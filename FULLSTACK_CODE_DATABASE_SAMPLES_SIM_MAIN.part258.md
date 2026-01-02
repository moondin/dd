---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 258
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 258 of 933)

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

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/(landing)/studio/page.tsx
Signals: Next.js

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAllPostMeta } from '@/lib/blog/registry'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'

export const revalidate = 3600

export default async function StudioIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>
}) {
  const { page, tag } = await searchParams
  const pageNum = Math.max(1, Number(page || 1))
  const perPage = 20

  const all = await getAllPostMeta()
  const filtered = tag ? all.filter((p) => p.tags.includes(tag)) : all

  // Sort to ensure featured post is first on page 1
  const sorted =
    pageNum === 1
      ? filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
      : filtered

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))
  const start = (pageNum - 1) * perPage
  const posts = sorted.slice(start, start + perPage)
  // Tag filter chips are intentionally disabled for now.
  // const tags = await getAllTags()
  const studioJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Sim Studio',
    url: 'https://sim.ai/studio',
    description: 'Announcements, insights, and guides for building AI agent workflows.',
  }

  return (
    <main className={`${soehne.className} mx-auto max-w-[1200px] px-6 py-12 sm:px-8 md:px-12`}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studioJsonLd) }}
      />
      <h1 className='mb-3 font-medium text-[40px] leading-tight sm:text-[56px]'>Sim Studio</h1>
      <p className='mb-10 text-[18px] text-gray-700'>
        Announcements, insights, and guides for building AI agent workflows.
      </p>

      {/* Tag filter chips hidden until we have more posts */}
      {/* <div className='mb-10 flex flex-wrap gap-3'>
        <Link href='/studio' className={`rounded-full border px-3 py-1 text-sm ${!tag ? 'border-black bg-black text-white' : 'border-gray-300'}`}>All</Link>
        {tags.map((t) => (
          <Link key={t.tag} href={`/studio?tag=${encodeURIComponent(t.tag)}`} className={`rounded-full border px-3 py-1 text-sm ${tag === t.tag ? 'border-black bg-black text-white' : 'border-gray-300'}`}>
            {t.tag} ({t.count})
          </Link>
        ))}
      </div> */}

      {/* Grid layout for consistent rows */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
        {posts.map((p, i) => {
          return (
            <Link key={p.slug} href={`/studio/${p.slug}`} className='group flex flex-col'>
              <div className='flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 transition-colors duration-300 hover:border-gray-300'>
                <Image
                  src={p.ogImage}
                  alt={p.title}
                  width={800}
                  height={450}
                  className='h-48 w-full object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  loading='lazy'
                  unoptimized
                />
                <div className='flex flex-1 flex-col p-4'>
                  <div className='mb-2 text-gray-600 text-xs'>
                    {new Date(p.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <h3 className='shine-text mb-1 font-medium text-lg leading-tight'>{p.title}</h3>
                  <p className='mb-3 line-clamp-3 flex-1 text-gray-700 text-sm'>{p.description}</p>
                  <div className='flex items-center gap-2'>
                    <div className='-space-x-1.5 flex'>
                      {(p.authors && p.authors.length > 0 ? p.authors : [p.author])
                        .slice(0, 3)
                        .map((author, idx) => (
                          <Avatar key={idx} className='size-4 border border-white'>
                            <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                            <AvatarFallback className='border border-white bg-gray-100 text-[10px] text-gray-600'>
                              {author?.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                    </div>
                    <span className='text-gray-600 text-xs'>
                      {(p.authors && p.authors.length > 0 ? p.authors : [p.author])
                        .slice(0, 2)
                        .map((a) => a?.name)
                        .join(', ')}
                      {(p.authors && p.authors.length > 0 ? p.authors : [p.author]).length > 2 && (
                        <>
                          {' '}
                          and{' '}
                          {(p.authors && p.authors.length > 0 ? p.authors : [p.author]).length - 2}{' '}
                          other
                          {(p.authors && p.authors.length > 0 ? p.authors : [p.author]).length - 2 >
                          1
                            ? 's'
                            : ''}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className='mt-10 flex items-center justify-center gap-3'>
          {pageNum > 1 && (
            <Link
              href={`/studio?page=${pageNum - 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
              className='rounded border px-3 py-1 text-sm'
            >
              Previous
            </Link>
          )}
          <span className='text-gray-600 text-sm'>
            Page {pageNum} of {totalPages}
          </span>
          {pageNum < totalPages && (
            <Link
              href={`/studio?page=${pageNum + 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
              className='rounded border px-3 py-1 text-sm'
            >
              Next
            </Link>
          )}
        </div>
      )}
    </main>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/(landing)/studio/authors/[id]/page.tsx
Signals: Next.js

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { getAllPostMeta } from '@/lib/blog/registry'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'

export const revalidate = 3600

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const posts = (await getAllPostMeta()).filter((p) => p.author.id === id)
  const author = posts[0]?.author
  if (!author) {
    return (
      <main className={`${soehne.className} mx-auto max-w-[900px] px-6 py-10 sm:px-8 md:px-12`}>
        <h1 className='font-medium text-[32px]'>Author not found</h1>
      </main>
    )
  }
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `https://sim.ai/studio/authors/${author.id}`,
    sameAs: author.url ? [author.url] : [],
    image: author.avatarUrl,
  }
  return (
    <main className={`${soehne.className} mx-auto max-w-[900px] px-6 py-10 sm:px-8 md:px-12`}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className='mb-6 flex items-center gap-3'>
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={40}
            height={40}
            className='rounded-full'
            unoptimized
          />
        ) : null}
        <h1 className='font-medium text-[32px] leading-tight'>{author.name}</h1>
      </div>
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
        {posts.map((p) => (
          <Link key={p.slug} href={`/studio/${p.slug}`} className='group'>
            <div className='overflow-hidden rounded-lg border border-gray-200'>
              <Image
                src={p.ogImage}
                alt={p.title}
                width={600}
                height={315}
                className='h-[160px] w-full object-cover transition-transform group-hover:scale-[1.02]'
                unoptimized
              />
              <div className='p-3'>
                <div className='mb-1 text-gray-600 text-xs'>
                  {new Date(p.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className='font-medium text-sm leading-tight'>{p.title}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/(landing)/studio/rss.xml/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { getAllPostMeta } from '@/lib/blog/registry'

export const revalidate = 3600

export async function GET() {
  const posts = await getAllPostMeta()
  const items = posts.slice(0, 50)
  const site = 'https://sim.ai'

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Sim Studio</title>
    <link>${site}</link>
    <description>Announcements, insights, and guides for AI agent workflows.</description>
    ${items
      .map(
        (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${p.canonical}</link>
      <guid>${p.canonical}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
      ${(p.authors || [p.author])
        .map((a) => `<author><![CDATA[${a.name}${a.url ? ` (${a.url})` : ''}]]></author>`)
        .join('\n')}
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/(landing)/studio/sitemap-images.xml/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { getAllPostMeta } from '@/lib/blog/registry'

export const revalidate = 3600

export async function GET() {
  const posts = await getAllPostMeta()
  const base = 'https://sim.ai'
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${posts
  .map(
    (p) => `<url>
  <loc>${p.canonical}</loc>
  <image:image>
    <image:loc>${p.ogImage.startsWith('http') ? p.ogImage : `${base}${p.ogImage}`}</image:loc>
    <image:title><![CDATA[${p.title}]]></image:title>
    <image:caption><![CDATA[${p.description}]]></image:caption>
  </image:image>
</url>`
  )
  .join('\n')}
</urlset>`
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/(landing)/studio/tags/page.tsx
Signals: Next.js

```typescript
import Link from 'next/link'
import { getAllTags } from '@/lib/blog/registry'

export default async function TagsIndex() {
  const tags = await getAllTags()
  return (
    <main className='mx-auto max-w-[900px] px-6 py-10 sm:px-8 md:px-12'>
      <h1 className='mb-6 font-medium text-[32px] leading-tight'>Browse by tag</h1>
      <div className='flex flex-wrap gap-3'>
        <Link href='/studio' className='rounded-full border border-gray-300 px-3 py-1 text-sm'>
          All
        </Link>
        {tags.map((t) => (
          <Link
            key={t.tag}
            href={`/studio?tag=${encodeURIComponent(t.tag)}`}
            className='rounded-full border border-gray-300 px-3 py-1 text-sm'
          >
            {t.tag} ({t.count})
          </Link>
        ))}
      </div>
    </main>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/(landing)/studio/[slug]/page.tsx
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FAQ } from '@/lib/blog/faq'
import { getAllPostMeta, getPostBySlug, getRelatedPosts } from '@/lib/blog/registry'
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildPostMetadata } from '@/lib/blog/seo'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'

export async function generateStaticParams() {
  const posts = await getAllPostMeta()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return buildPostMetadata(post)
}

export const revalidate = 86400

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  const Article = post.Content
  const jsonLd = buildArticleJsonLd(post)
  const breadcrumbLd = buildBreadcrumbJsonLd(post)
  const related = await getRelatedPosts(slug, 3)

  return (
    <article
      className={`${soehne.className} w-full`}
      itemScope
      itemType='https://schema.org/BlogPosting'
    >
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <header className='mx-auto max-w-[1450px] px-6 pt-8 sm:px-8 sm:pt-12 md:px-12 md:pt-16'>
        <div className='mb-6'>
          <Link href='/studio' className='text-gray-600 text-sm hover:text-gray-900'>
            ← Back to Sim Studio
          </Link>
        </div>
        <div className='flex flex-col gap-8 md:flex-row md:gap-12'>
          <div className='w-full flex-shrink-0 md:w-[450px]'>
            <div className='relative w-full overflow-hidden rounded-lg'>
              <Image
                src={post.ogImage}
                alt={post.title}
                width={450}
                height={360}
                className='h-auto w-full'
                sizes='(max-width: 768px) 100vw, 450px'
                priority
                itemProp='image'
                unoptimized
              />
            </div>
          </div>
          <div className='flex flex-1 flex-col justify-between'>
            <h1
              className='font-medium text-[36px] leading-tight tracking-tight sm:text-[48px] md:text-[56px] lg:text-[64px]'
              itemProp='headline'
            >
              {post.title}
            </h1>
            <div className='mt-4 flex items-center gap-3'>
              {(post.authors || [post.author]).map((a, idx) => (
                <div key={idx} className='flex items-center gap-2'>
                  {a?.avatarUrl ? (
                    <Avatar className='size-6'>
                      <AvatarImage src={a.avatarUrl} alt={a.name} />
                      <AvatarFallback>{a.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  ) : null}
                  <Link
                    href={a?.url || '#'}
                    target='_blank'
                    rel='noopener noreferrer author'
                    className='text-[14px] text-gray-600 leading-[1.5] hover:text-gray-900 sm:text-[16px]'
                    itemProp='author'
                    itemScope
                    itemType='https://schema.org/Person'
                  >
                    <span itemProp='name'>{a?.name}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr className='mt-8 border-gray-200 border-t sm:mt-12' />
        <div className='flex flex-col gap-6 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:py-10'>
          <div className='flex flex-shrink-0 items-center gap-4'>
            <time
              className='block text-[14px] text-gray-600 leading-[1.5] sm:text-[16px]'
              dateTime={post.date}
              itemProp='datePublished'
            >
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <meta itemProp='dateModified' content={post.updated ?? post.date} />
          </div>
          <div className='flex-1'>
            <p className='m-0 block translate-y-[-4px] font-[400] text-[18px] leading-[1.5] sm:text-[20px] md:text-[26px]'>
              {post.description}
            </p>
          </div>
        </div>
      </header>

      <div className='mx-auto max-w-[900px] px-6 pb-20 sm:px-8 md:px-12' itemProp='articleBody'>
        <div className='prose prose-lg max-w-none'>
          <Article />
          {post.faq && post.faq.length > 0 ? <FAQ items={post.faq} /> : null}
        </div>
      </div>
      {related.length > 0 && (
        <div className='mx-auto max-w-[900px] px-6 pb-24 sm:px-8 md:px-12'>
          <h2 className='mb-4 font-medium text-[24px]'>Related posts</h2>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
            {related.map((p) => (
              <Link key={p.slug} href={`/studio/${p.slug}`} className='group'>
                <div className='overflow-hidden rounded-lg border border-gray-200'>
                  <Image
                    src={p.ogImage}
                    alt={p.title}
                    width={600}
                    height={315}
                    className='h-[160px] w-full object-cover'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    loading='lazy'
                    unoptimized
                  />
                  <div className='p-3'>
                    <div className='mb-1 text-gray-600 text-xs'>
                      {new Date(p.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className='font-medium text-sm leading-tight'>{p.title}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <meta itemProp='publisher' content='Sim' />
      <meta itemProp='inLanguage' content='en-US' />
      <meta itemProp='keywords' content={post.tags.join(', ')} />
    </article>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/(landing)/terms/page.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { getEnv } from '@/lib/core/config/env'
import { LegalLayout } from '@/app/(landing)/components'

export default function TermsOfService() {
  useEffect(() => {
    const termsUrl = getEnv('NEXT_PUBLIC_TERMS_URL')
    if (termsUrl?.startsWith('http')) {
      window.location.href = termsUrl
    }
  }, [])
  return (
    <LegalLayout title='Terms of Service'>
      <section>
        <p className='mb-4'>Last Updated: October 11, 2025</p>
        <p>
          Please read these Terms of Service ("Terms") carefully before using the Sim platform (the
          "Service") operated by Sim, Inc ("us", "we", or "our").
        </p>
        <p className='mt-4'>
          By accessing or using the Service, you agree to be bound by these Terms. If you disagree
          with any part of the terms, you may not access the Service.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>1. Accounts</h2>
        <p className='mb-4'>
          When you create an account with us, you must provide accurate, complete, and current
          information. Failure to do so constitutes a breach of the Terms, which may result in
          immediate termination of your account on our Service.
        </p>
        <p className='mb-4'>
          You are responsible for safeguarding the password that you use to access the Service and
          for any activities or actions under your password.
        </p>
        <p>
          You agree not to disclose your password to any third party. You must notify us immediately
          upon becoming aware of any breach of security or unauthorized use of your account.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>2. License to Use Service</h2>
        <p className='mb-4'>
          Subject to your compliance with these Terms, we grant you a limited, non-exclusive,
          non-transferable, revocable license to access and use the Service for your internal
          business or personal purposes.
        </p>
        <p>
          This license does not permit you to resell, redistribute, or make the Service available to
          third parties, or to use the Service to build a competitive product or service.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>3. Subscription Plans & Payment Terms</h2>
        <p className='mb-4'>
          We offer Free, Pro, Team, and Enterprise subscription plans. Paid plans include a base
          subscription fee plus usage-based charges for inference and other services that exceed
          your plan's included limits.
        </p>
        <p className='mb-4'>
          You agree to pay all fees associated with your account. Your base subscription fee is
          charged at the beginning of each billing cycle (monthly or annually). Inference overages
          are charged incrementally every $50 during your billing period, which may result in
          multiple invoices within a single billing cycle. Payment is due upon receipt of invoice.
          If payment fails, we may suspend or terminate your access to paid features.
        </p>
        <p>
          We reserve the right to change our pricing with 30 days' notice to paid subscribers. Price
          changes will take effect at your next renewal.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>4. Auto-Renewal & Cancellation</h2>
        <p className='mb-4'>
          Paid subscriptions automatically renew at the end of each billing period unless you cancel
          before the renewal date. You can cancel your subscription at any time through your account
          settings or by contacting us.
        </p>
        <p className='mb-4'>
          Cancellations take effect at the end of the current billing period. You will retain access
          to paid features until that time. We do not provide refunds for partial billing periods.
        </p>
        <p>
          Upon cancellation or termination, you may export your data within 30 days. After 30 days,
          we may delete your data in accordance with our data retention policies.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>5. Data Ownership & Retention</h2>
        <p className='mb-4'>
          You retain all ownership rights to data, content, and information you submit to the
          Service ("Your Data"). You grant us a limited license to process, store, and transmit Your
          Data solely to provide and improve the Service as described in our Privacy Policy.
        </p>
        <p>
          We retain Your Data while your account is active and for 30 days after account termination
          or cancellation. You may request data export or deletion at any time through your account
          settings.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>6. Intellectual Property</h2>
        <p className='mb-4'>
          The Service and its original content, features, and functionality are and will remain the
          exclusive property of Sim, Inc and its licensors. The Service is protected by copyright,
          trademark, and other laws of both the United States and foreign countries.
        </p>
        <p>
          Our trademarks and trade dress may not be used in connection with any product or service
          without the prior written consent of Sim, Inc.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>7. User Content</h2>
        <p className='mb-4'>
          Our Service allows you to post, link, store, share and otherwise make available certain
          information, text, graphics, videos, or other material ("User Content"). You are
          responsible for the User Content that you post on or through the Service, including its
          legality, reliability, and appropriateness.
        </p>
        <p className='mb-4'>
          By posting User Content on or through the Service, you represent and warrant that:
        </p>
        <ul className='mb-4 list-disc space-y-2 pl-6'>
          <li>
            The User Content is yours (you own it) or you have the right to use it and grant us the
            rights and license as provided in these Terms.
          </li>
          <li>
            The posting of your User Content on or through the Service does not violate the privacy
            rights, publicity rights, copyrights, contract rights or any other rights of any person.
          </li>
        </ul>
        <p>
          We reserve the right to terminate the account of any user found to be infringing on a
          copyright.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>8. Third-Party Services</h2>
        <p className='mb-4'>
          The Service may integrate with third-party services (such as Google Workspace, cloud
          storage providers, and AI model providers). Your use of third-party services is subject to
          their respective terms and privacy policies.
        </p>
        <p>
          We are not responsible for the availability, functionality, or actions of third-party
          services. Any issues with third-party integrations should be directed to the respective
          provider.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>9. Acceptable Use</h2>
        <p className='mb-4'>You agree not to use the Service:</p>
        <ul className='mb-4 list-disc space-y-2 pl-6'>
          <li>
            In any way that violates any applicable national or international law or regulation.
          </li>
          <li>
            For the purpose of exploiting, harming, or attempting to exploit or harm minors in any
            way.
          </li>
          <li>
            To transmit, or procure the sending of, any advertising or promotional material,
            including any "junk mail", "chain letter," "spam," or any other similar solicitation.
          </li>
          <li>
            To impersonate or attempt to impersonate Sim, Inc, a Sim employee, another user, or any
            other person or entity.
          </li>
          <li>
            In any way that infringes upon the rights of others, or in any way is illegal,
            threatening, fraudulent, or harmful.
          </li>
          <li>
            To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of
            the Service, or which, as determined by us, may harm Sim, Inc or users of the Service or
            expose them to liability.
          </li>
        </ul>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>10. Termination</h2>
        <p className='mb-4'>
          We may terminate or suspend your account immediately, without prior notice or liability,
          for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        <p>
          Upon termination, your right to use the Service will immediately cease. If you wish to
          terminate your account, you may simply discontinue using the Service.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>11. Limitation of Liability</h2>
        <p className='mb-4'>
          In no event shall Sim, Inc, nor its directors, employees, partners, agents, suppliers, or
          affiliates, be liable for any indirect, incidental, special, consequential or punitive
          damages, including without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from:
        </p>
        <ul className='list-disc space-y-2 pl-6'>
          <li>Your access to or use of or inability to access or use the Service;</li>
          <li>Any conduct or content of any third party on the Service;</li>
          <li>Any content obtained from the Service; and</li>
          <li>
            Unauthorized access, use or alteration of your transmissions or content, whether based
            on warranty, contract, tort (including negligence) or any other legal theory, whether or
            not we have been informed of the possibility of such damage.
          </li>
        </ul>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>12. Disclaimer</h2>
        <p className='mb-4'>
          Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and
          "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether
          express or implied, including, but not limited to, implied warranties of merchantability,
          fitness for a particular purpose, non-infringement or course of performance.
        </p>
        <p>Sim, Inc, its subsidiaries, affiliates, and its licensors do not warrant that:</p>
        <ul className='mb-4 list-disc space-y-2 pl-6'>
          <li>
            The Service will function uninterrupted, secure or available at any particular time or
            location;
          </li>
          <li>Any errors or defects will be corrected;</li>
          <li>The Service is free of viruses or other harmful components; or</li>
          <li>The results of using the Service will meet your requirements.</li>
        </ul>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>13. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Sim, Inc and its officers, directors,
          employees, and agents from any claims, damages, losses, liabilities, and expenses
          (including reasonable attorneys' fees) arising from your use of the Service, your
          violation of these Terms, or your violation of any rights of another party.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>14. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the United
          States, without regard to its conflict of law provisions.
        </p>
        <p className='mt-4'>
          Our failure to enforce any right or provision of these Terms will not be considered a
          waiver of those rights. If any provision of these Terms is held to be invalid or
          unenforceable by a court, the remaining provisions of these Terms will remain in effect.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>15. Arbitration Agreement</h2>
        <p className='mb-4'>
          Please read the following arbitration agreement carefully. It requires you to arbitrate
          disputes with Sim, Inc, its parent companies, subsidiaries, affiliates, successors and
          assigns and all of their respective officers, directors, employees, agents, and
          representatives (collectively, the "Company Parties") and limits the manner in which you
          can seek relief from the Company Parties.
        </p>
        <p className='mb-4'>
          You agree that any dispute between you and any of the Company Parties relating to the
          Site, the Service or these Terms will be resolved by binding arbitration, rather than in
          court, except that (1) you and the Company Parties may assert individualized claims in
          small claims court if the claims qualify, remain in such court and advance solely on an
          individual, non-class basis; and (2) you or the Company Parties may seek equitable relief
          in court for infringement or other misuse of intellectual property rights.
        </p>
        <p className='mb-4'>
          The Federal Arbitration Act governs the interpretation and enforcement of this Arbitration
          Agreement. The arbitration will be conducted by JAMS, an established alternative dispute
          resolution provider.
        </p>
        <p className='mb-4 border-[var(--brand-primary-hex)] border-l-4 bg-[var(--brand-primary-hex)]/10 p-3'>
          YOU AND COMPANY AGREE THAT EACH OF US MAY BRING CLAIMS AGAINST THE OTHER ONLY ON AN
          INDIVIDUAL BASIS AND NOT ON A CLASS, REPRESENTATIVE, OR COLLECTIVE BASIS. ONLY INDIVIDUAL
          RELIEF IS AVAILABLE, AND DISPUTES OF MORE THAN ONE CUSTOMER OR USER CANNOT BE ARBITRATED
          OR CONSOLIDATED WITH THOSE OF ANY OTHER CUSTOMER OR USER.
        </p>
        <p className='mb-4'>
          You have the right to opt out of the provisions of this Arbitration Agreement by sending a
          timely written notice of your decision to opt out to:{' '}
          <Link
            href='mailto:legal@sim.ai'
            className='text-[var(--brand-primary-hex)] underline hover:text-[var(--brand-primary-hover-hex)]'
          >
            legal@sim.ai{' '}
          </Link>
          within 30 days after first becoming subject to this Arbitration Agreement.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>16. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any
          time. If a revision is material, we will try to provide at least 30 days' notice prior to
          any new terms taking effect. What constitutes a material change will be determined at our
          sole discretion.
        </p>
        <p className='mt-4'>
          By continuing to access or use our Service after those revisions become effective, you
          agree to be bound by the revised terms. If you do not agree to the new terms, please stop
          using the Service.
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>17. Copyright Policy</h2>
        <p className='mb-4'>
          We respect the intellectual property of others and ask that users of our Service do the
          same. If you believe that one of our users is, through the use of our Service, unlawfully
          infringing the copyright(s) in a work, please send a notice to our designated Copyright
          Agent, including the following information:
        </p>
        <ul className='mb-4 list-disc space-y-2 pl-6'>
          <li>Your physical or electronic signature;</li>
          <li>Identification of the copyrighted work(s) that you claim to have been infringed;</li>
          <li>Identification of the material on our services that you claim is infringing;</li>
          <li>Your address, telephone number, and e-mail address;</li>
          <li>
            A statement that you have a good-faith belief that the disputed use is not authorized by
            the copyright owner, its agent, or the law; and
          </li>
          <li>
            A statement, made under the penalty of perjury, that the above information in your
            notice is accurate and that you are the copyright owner or authorized to act on the
            copyright owner's behalf.
          </li>
        </ul>
        <p>
          Our Copyright Agent can be reached at:{' '}
          <Link
            href='mailto:copyright@sim.ai'
            className='text-[var(--brand-primary-hex)] underline hover:text-[var(--brand-primary-hover-hex)]'
          >
            copyright@sim.ai
          </Link>
        </p>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>18. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:{' '}
          <Link
            href='mailto:legal@sim.ai'
            className='text-[var(--brand-primary-hex)] underline hover:text-[var(--brand-primary-hover-hex)]'
          >
            legal@sim.ai
          </Link>
        </p>
      </section>
    </LegalLayout>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/accounts/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { account } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('AuthAccountsAPI')

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider')

    const whereConditions = [eq(account.userId, session.user.id)]

    if (provider) {
      whereConditions.push(eq(account.providerId, provider))
    }

    const accounts = await db
      .select({
        id: account.id,
        accountId: account.accountId,
        providerId: account.providerId,
      })
      .from(account)
      .where(and(...whereConditions))

    return NextResponse.json({ accounts })
  } catch (error) {
    logger.error('Failed to fetch accounts', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````

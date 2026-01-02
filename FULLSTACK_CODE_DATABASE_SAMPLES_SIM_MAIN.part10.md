---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 10
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 10 of 933)

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

---[FILE: page-actions.tsx]---
Location: sim-main/apps/docs/components/page-actions.tsx
Signals: React

```typescript
'use client'

import { useState } from 'react'
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button'
import { Check, Copy } from 'lucide-react'

const cache = new Map<string, string>()

export function LLMCopyButton({
  markdownUrl,
}: {
  /**
   * A URL to fetch the raw Markdown/MDX content of page
   */
  markdownUrl: string
}) {
  const [isLoading, setLoading] = useState(false)
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl)
    if (cached) return navigator.clipboard.writeText(cached)

    setLoading(true)

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': fetch(markdownUrl).then(async (res) => {
            const content = await res.text()
            cache.set(markdownUrl, content)

            return content
          }),
        }),
      ])
    } finally {
      setLoading(false)
    }
  })

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className='flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/40 bg-background px-2.5 py-2 text-muted-foreground/60 text-sm leading-none transition-all hover:border-border hover:bg-accent/50 hover:text-muted-foreground'
      aria-label={checked ? 'Copied to clipboard' : 'Copy page content'}
    >
      {checked ? (
        <>
          <Check className='h-3.5 w-3.5' />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className='h-3.5 w-3.5' />
          <span>Copy page</span>
        </>
      )}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: structured-data.tsx]---
Location: sim-main/apps/docs/components/structured-data.tsx
Signals: Next.js

```typescript
import Script from 'next/script'

interface StructuredDataProps {
  title: string
  description: string
  url: string
  lang: string
  dateModified?: string
  breadcrumb?: Array<{ name: string; url: string }>
}

export function StructuredData({
  title,
  description,
  url,
  lang,
  dateModified,
  breadcrumb,
}: StructuredDataProps) {
  const baseUrl = 'https://docs.sim.ai'

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description,
    url: url,
    datePublished: dateModified || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Sim Team',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sim',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/static/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: lang,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Sim Documentation',
      url: baseUrl,
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: url,
    },
  }

  const breadcrumbStructuredData = breadcrumb && {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  const websiteStructuredData = url === baseUrl && {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sim Documentation',
    url: baseUrl,
    description:
      'Comprehensive documentation for Sim visual workflow builder for AI applications. Create powerful AI agents, automation workflows, and data processing pipelines.',
    publisher: {
      '@type': 'Organization',
      name: 'Sim',
      url: baseUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en', 'es', 'fr', 'de', 'ja', 'zh'],
  }

  const faqStructuredData = title.toLowerCase().includes('faq') && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [],
  }

  const softwareStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sim',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    description:
      'Visual workflow builder for AI applications. Create powerful AI agents, automation workflows, and data processing pipelines by connecting blocks on a canvas—no coding required.',
    url: baseUrl,
    author: {
      '@type': 'Organization',
      name: 'Sim Team',
    },
    offers: {
      '@type': 'Offer',
      category: 'Developer Tools',
    },
    featureList: [
      'Visual workflow builder with drag-and-drop interface',
      'AI agent creation and automation',
      '80+ built-in integrations',
      'Real-time team collaboration',
      'Multiple deployment options',
      'Custom integrations via MCP protocol',
    ],
  }

  return (
    <>
      <Script
        id='article-structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      {breadcrumbStructuredData && (
        <Script
          id='breadcrumb-structured-data'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      )}
      {websiteStructuredData && (
        <Script
          id='website-structured-data'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      )}
      {faqStructuredData && (
        <Script
          id='faq-structured-data'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      )}
      {url === baseUrl && (
        <Script
          id='software-structured-data'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareStructuredData),
          }}
        />
      )}
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page-navigation-arrows.tsx]---
Location: sim-main/apps/docs/components/docs-layout/page-navigation-arrows.tsx
Signals: Next.js

```typescript
'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PageNavigationArrowsProps {
  previous?: {
    url: string
  }
  next?: {
    url: string
  }
}

export function PageNavigationArrows({ previous, next }: PageNavigationArrowsProps) {
  if (!previous && !next) return null

  return (
    <div className='flex items-center gap-2'>
      {previous && (
        <Link
          href={previous.url}
          className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/40 bg-background px-2.5 py-1.5 text-muted-foreground/60 text-sm transition-all hover:border-border hover:bg-accent/50 hover:text-muted-foreground'
          aria-label='Previous page'
          title='Previous page'
        >
          <ChevronLeft className='h-4 w-4' />
        </Link>
      )}
      {next && (
        <Link
          href={next.url}
          className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/40 bg-background px-2.5 py-1.5 text-muted-foreground/60 text-sm transition-all hover:border-border hover:bg-accent/50 hover:text-muted-foreground'
          aria-label='Next page'
          title='Next page'
        >
          <ChevronRight className='h-4 w-4' />
        </Link>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: sidebar-components.tsx]---
Location: sim-main/apps/docs/components/docs-layout/sidebar-components.tsx
Signals: React, Next.js

```typescript
'use client'

import { type ReactNode, useEffect, useState } from 'react'
import type { Folder, Item, Separator } from 'fumadocs-core/page-tree'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const LANG_PREFIXES = ['/en', '/es', '/fr', '/de', '/ja', '/zh']

function stripLangPrefix(path: string): string {
  for (const prefix of LANG_PREFIXES) {
    if (path === prefix) return '/'
    if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length)
  }
  return path
}

function isActive(url: string, pathname: string, nested = true): boolean {
  const normalizedPathname = stripLangPrefix(pathname)
  const normalizedUrl = stripLangPrefix(url)
  return (
    normalizedUrl === normalizedPathname ||
    (nested && normalizedPathname.startsWith(`${normalizedUrl}/`))
  )
}

export function SidebarItem({ item }: { item: Item }) {
  const pathname = usePathname()
  const active = isActive(item.url, pathname, false)

  return (
    <Link
      href={item.url}
      data-active={active}
      className={cn(
        // Mobile styles (default)
        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
        'text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-accent-foreground',
        active && 'bg-fd-primary/10 font-medium text-fd-primary',
        // Desktop styles (lg+)
        'lg:mb-[0.0625rem] lg:block lg:rounded-md lg:px-2.5 lg:py-1.5 lg:font-normal lg:text-[13px] lg:leading-tight',
        'lg:text-gray-600 lg:dark:text-gray-400',
        !active && 'lg:hover:bg-gray-100/60 lg:dark:hover:bg-gray-800/40',
        active &&
          'lg:bg-purple-50/80 lg:font-normal lg:text-purple-600 lg:dark:bg-purple-900/15 lg:dark:text-purple-400'
      )}
    >
      {item.name}
    </Link>
  )
}

export function SidebarFolder({ item, children }: { item: Folder; children: ReactNode }) {
  const pathname = usePathname()
  const hasActiveChild = checkHasActiveChild(item, pathname)
  const hasChildren = item.children.length > 0
  const [open, setOpen] = useState(hasActiveChild)

  useEffect(() => {
    setOpen(hasActiveChild)
  }, [hasActiveChild])

  const active = item.index ? isActive(item.index.url, pathname, false) : false

  if (item.index && !hasChildren) {
    return (
      <Link
        href={item.index.url}
        data-active={active}
        className={cn(
          // Mobile styles (default)
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
          'text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-accent-foreground',
          active && 'bg-fd-primary/10 font-medium text-fd-primary',
          // Desktop styles (lg+)
          'lg:mb-[0.0625rem] lg:block lg:rounded-md lg:px-2.5 lg:py-1.5 lg:font-normal lg:text-[13px] lg:leading-tight',
          'lg:text-gray-600 lg:dark:text-gray-400',
          !active && 'lg:hover:bg-gray-100/60 lg:dark:hover:bg-gray-800/40',
          active &&
            'lg:bg-purple-50/80 lg:font-normal lg:text-purple-600 lg:dark:bg-purple-900/15 lg:dark:text-purple-400'
        )}
      >
        {item.name}
      </Link>
    )
  }

  return (
    <div className='flex flex-col lg:mb-[0.0625rem]'>
      <div className='flex w-full items-center lg:gap-0.5'>
        {item.index ? (
          <Link
            href={item.index.url}
            data-active={active}
            className={cn(
              // Mobile styles (default)
              'flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
              'text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-accent-foreground',
              active && 'bg-fd-primary/10 font-medium text-fd-primary',
              // Desktop styles (lg+)
              'lg:block lg:flex-1 lg:rounded-md lg:px-2.5 lg:py-1.5 lg:font-medium lg:text-[13px] lg:leading-tight',
              'lg:text-gray-800 lg:dark:text-gray-200',
              !active && 'lg:hover:bg-gray-100/60 lg:dark:hover:bg-gray-800/40',
              active &&
                'lg:bg-purple-50/80 lg:text-purple-600 lg:dark:bg-purple-900/15 lg:dark:text-purple-400'
            )}
          >
            {item.name}
          </Link>
        ) : (
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              // Mobile styles (default)
              'flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
              'text-fd-muted-foreground hover:bg-fd-accent/50',
              // Desktop styles (lg+)
              'lg:flex lg:w-full lg:cursor-pointer lg:items-center lg:justify-between lg:rounded-md lg:px-2.5 lg:py-1.5 lg:text-left lg:font-medium lg:text-[13px] lg:leading-tight',
              'lg:text-gray-800 lg:hover:bg-gray-100/60 lg:dark:text-gray-200 lg:dark:hover:bg-gray-800/40'
            )}
          >
            <span>{item.name}</span>
            {/* Desktop-only chevron for non-index folders */}
            <ChevronRight
              className={cn(
                'ml-auto hidden h-3 w-3 flex-shrink-0 text-gray-400 transition-transform duration-200 ease-in-out lg:block dark:text-gray-500',
                open && 'rotate-90'
              )}
            />
          </button>
        )}
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              // Mobile styles
              'rounded p-1 hover:bg-fd-accent/50',
              // Desktop styles
              'lg:cursor-pointer lg:rounded lg:p-1 lg:transition-colors lg:hover:bg-gray-100/60 lg:dark:hover:bg-gray-800/40'
            )}
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            <ChevronRight
              className={cn(
                // Mobile styles
                'h-4 w-4 transition-transform',
                // Desktop styles
                'lg:h-3 lg:w-3 lg:text-gray-400 lg:duration-200 lg:ease-in-out lg:dark:text-gray-500',
                open && 'rotate-90'
              )}
            />
          </button>
        )}
      </div>
      {hasChildren && (
        <div
          className={cn(
            'overflow-hidden transition-all duration-200 ease-in-out',
            open ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          {/* Mobile: simple indent */}
          <div className='ml-4 flex flex-col gap-0.5 lg:hidden'>{children}</div>
          {/* Desktop: styled with border */}
          <ul className='mt-0.5 ml-2 hidden space-y-[0.0625rem] border-gray-200/60 border-l pl-2.5 lg:block dark:border-gray-700/60'>
            {children}
          </ul>
        </div>
      )}
    </div>
  )
}

export function SidebarSeparator({ item }: { item: Separator }) {
  return (
    <p
      className={cn(
        // Mobile styles
        'mt-4 mb-2 px-2 font-medium text-fd-muted-foreground text-xs',
        // Desktop styles
        'lg:mt-4 lg:mb-1.5 lg:px-2.5 lg:font-semibold lg:text-[10px] lg:text-gray-500/80 lg:uppercase lg:tracking-wide lg:dark:text-gray-500'
      )}
    >
      {item.name}
    </p>
  )
}

function checkHasActiveChild(node: Folder, pathname: string): boolean {
  if (node.index && isActive(node.index.url, pathname)) {
    return true
  }

  for (const child of node.children) {
    if (child.type === 'page' && isActive(child.url, pathname)) {
      return true
    }
    if (child.type === 'folder' && checkHasActiveChild(child, pathname)) {
      return true
    }
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: toc-footer.tsx]---
Location: sim-main/apps/docs/components/docs-layout/toc-footer.tsx
Signals: React, Next.js

```typescript
'use client'

import { useState } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function TOCFooter() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className='sticky bottom-0 mt-6'>
      <div className='flex flex-col gap-2 rounded-lg border border-border bg-secondary p-6 text-sm'>
        <div className='text-balance font-semibold text-base leading-tight'>
          Start building today
        </div>
        <div className='text-muted-foreground'>Trusted by over 60,000 builders.</div>
        <div className='text-muted-foreground'>
          Build Agentic workflows visually on a drag-and-drop canvas or with natural language.
        </div>
        <Link
          href='https://sim.ai/signup'
          target='_blank'
          rel='noopener noreferrer'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className='group mt-2 inline-flex h-8 w-fit items-center justify-center gap-1 whitespace-nowrap rounded-[10px] border border-[#6F3DFA] bg-gradient-to-b from-[#8357FF] to-[#6F3DFA] px-3 pr-[10px] pl-[12px] font-medium text-sm text-white shadow-[inset_0_2px_4px_0_#9B77FF] outline-none transition-all hover:shadow-lg focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'
          aria-label='Get started with Sim - Sign up for free'
        >
          <span>Get started</span>
          <span className='inline-flex transition-transform duration-200 group-hover:translate-x-0.5'>
            {isHovered ? (
              <ArrowRight className='h-4 w-4' aria-hidden='true' />
            ) : (
              <ChevronRight className='h-4 w-4' aria-hidden='true' />
            )}
          </span>
        </Link>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: navbar.tsx]---
Location: sim-main/apps/docs/components/navbar/navbar.tsx
Signals: Next.js

```typescript
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LanguageDropdown } from '@/components/ui/language-dropdown'
import { SearchTrigger } from '@/components/ui/search-trigger'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Navbar() {
  return (
    <nav
      className='sticky top-0 z-50 border-border/50 border-b'
      style={{
        backdropFilter: 'blur(25px) saturate(180%)',
        WebkitBackdropFilter: 'blur(25px) saturate(180%)',
      }}
    >
      {/* Desktop: Single row layout */}
      <div className='hidden h-16 w-full items-center lg:flex'>
        <div
          className='relative flex w-full items-center justify-between'
          style={{
            paddingLeft: 'calc(var(--sidebar-offset) + 32px)',
            paddingRight: 'calc(var(--toc-offset) + 60px)',
          }}
        >
          {/* Left cluster: logo */}
          <div className='flex items-center'>
            <Link href='/' className='flex min-w-[100px] items-center'>
              <Image
                src='/static/logo.png'
                alt='Sim'
                width={72}
                height={28}
                className='h-7 w-auto'
              />
            </Link>
          </div>

          {/* Center cluster: search - absolutely positioned to center */}
          <div className='-translate-x-1/2 absolute left-1/2 flex items-center justify-center'>
            <SearchTrigger />
          </div>

          {/* Right cluster aligns with TOC edge */}
          <div className='flex items-center gap-4'>
            <Link
              href='https://sim.ai'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-xl px-3 py-2 font-normal text-[0.9375rem] text-foreground/60 leading-[1.4] transition-colors hover:bg-foreground/8 hover:text-foreground'
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              Platform
            </Link>
            <LanguageDropdown />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: block-info-card.tsx]---
Location: sim-main/apps/docs/components/ui/block-info-card.tsx
Signals: React

```typescript
'use client'

import type * as React from 'react'
import { blockTypeToIconMap } from '@/components/ui/icon-mapping'

interface BlockInfoCardProps {
  type: string
  color: string
  icon?: React.ComponentType<{ className?: string }>
  iconSvg?: string // Deprecated: Use automatic icon resolution instead
}

export function BlockInfoCard({
  type,
  color,
  icon: IconComponent,
  iconSvg,
}: BlockInfoCardProps): React.ReactNode {
  // Auto-resolve icon component from block type if not explicitly provided
  const ResolvedIcon = IconComponent || blockTypeToIconMap[type] || null

  return (
    <div className='mb-6 overflow-hidden rounded-lg border border-border'>
      <div className='flex items-center justify-center p-6'>
        <div
          className='flex h-20 w-20 items-center justify-center rounded-lg'
          style={{ background: color }}
        >
          {ResolvedIcon ? (
            <ResolvedIcon className='h-10 w-10 text-white' />
          ) : iconSvg ? (
            <div className='h-10 w-10 text-white' dangerouslySetInnerHTML={{ __html: iconSvg }} />
          ) : (
            <div className='font-mono text-xl opacity-70'>{type.substring(0, 2)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: button.tsx]---
Location: sim-main/apps/docs/components/ui/button.tsx

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const variants = {
  primary: 'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80',
  outline: 'border hover:bg-fd-accent hover:text-fd-accent-foreground',
  ghost: 'hover:bg-fd-accent hover:text-fd-accent-foreground',
  secondary:
    'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
} as const

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
  {
    variants: {
      variant: variants,
      color: variants,
      size: {
        sm: 'gap-1 px-2 py-1.5 text-xs',
        icon: 'p-1.5 [&_svg]:size-5',
        'icon-sm': 'p-1.5 [&_svg]:size-4.5',
        'icon-xs': 'p-1 [&_svg]:size-4',
      },
    },
  }
)

export type ButtonProps = VariantProps<typeof buttonVariants>
```

--------------------------------------------------------------------------------

---[FILE: code-block.tsx]---
Location: sim-main/apps/docs/components/ui/code-block.tsx
Signals: React

```typescript
'use client'

import { useState } from 'react'
import { CodeBlock as FumadocsCodeBlock } from 'fumadocs-ui/components/codeblock'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CodeBlock(props: React.ComponentProps<typeof FumadocsCodeBlock>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <FumadocsCodeBlock
      {...props}
      Actions={({ children, className }) => (
        <div className={cn('empty:hidden', className)}>
          {/* Custom copy button */}
          <button
            type='button'
            aria-label={copied ? 'Copied Text' : 'Copy Text'}
            onClick={(e) => {
              const pre = (e.currentTarget as HTMLElement)
                .closest('.nd-codeblock')
                ?.querySelector('pre')
              if (pre) handleCopy(pre.textContent || '')
            }}
            className={cn(
              'cursor-pointer rounded-md p-2 transition-all',
              'border border-border bg-background/80 hover:bg-muted',
              'backdrop-blur-sm'
            )}
          >
            <span className='flex items-center justify-center'>
              {copied ? (
                <Check size={16} className='text-green-600 dark:text-green-400' />
              ) : (
                <Copy size={16} className='text-muted-foreground' />
              )}
            </span>
          </button>
        </div>
      )}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: heading.tsx]---
Location: sim-main/apps/docs/components/ui/heading.tsx
Signals: React

```typescript
'use client'

import { type ComponentPropsWithoutRef, useState } from 'react'
import { Check, Link } from 'lucide-react'
import { cn } from '@/lib/utils'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  as?: HeadingTag
}

export function Heading({ as, className, ...props }: HeadingProps) {
  const [copied, setCopied] = useState(false)
  const As = as ?? 'h1'

  if (!props.id) {
    return <As className={className} {...props} />
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    const url = `${window.location.origin}${window.location.pathname}#${props.id}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)

      // Update URL hash without scrolling
      window.history.pushState(null, '', `#${props.id}`)

      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: just navigate to the anchor
      window.location.hash = props.id as string
    }
  }

  return (
    <As className={cn('group flex scroll-m-28 flex-row items-center gap-2', className)} {...props}>
      <a data-card='' href={`#${props.id}`} className='peer' onClick={handleClick}>
        {props.children}
      </a>
      {copied ? (
        <Check
          aria-hidden
          className='size-3.5 shrink-0 text-green-500 opacity-100 transition-opacity'
        />
      ) : (
        <Link
          aria-hidden
          className='size-3.5 shrink-0 text-fd-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 peer-hover:opacity-100'
        />
      )}
    </As>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: icon-mapping.ts]---
Location: sim-main/apps/docs/components/ui/icon-mapping.ts
Signals: React

```typescript
// Auto-generated file - do not edit manually
// Generated by scripts/generate-docs.ts
// Maps block types to their icon component references

import type { ComponentType, SVGProps } from 'react'
import {
  AhrefsIcon,
  AirtableIcon,
  ApifyIcon,
  ApolloIcon,
  ArxivIcon,
  AsanaIcon,
  BrainIcon,
  BrowserUseIcon,
  CalendlyIcon,
  ClayIcon,
  ConfluenceIcon,
  CursorIcon,
  DatadogIcon,
  DiscordIcon,
  DocumentIcon,
  DropboxIcon,
  DuckDuckGoIcon,
  DynamoDBIcon,
  ElasticsearchIcon,
  ElevenLabsIcon,
  ExaAIIcon,
  EyeIcon,
  FirecrawlIcon,
  GithubIcon,
  GitLabIcon,
  GmailIcon,
  GoogleCalendarIcon,
  GoogleDocsIcon,
  GoogleDriveIcon,
  GoogleFormsIcon,
  GoogleGroupsIcon,
  GoogleIcon,
  GoogleSheetsIcon,
  GoogleSlidesIcon,
  GoogleVaultIcon,
  GrafanaIcon,
  HubspotIcon,
  HuggingFaceIcon,
  HunterIOIcon,
  ImageIcon,
  IncidentioIcon,
  IntercomIcon,
  JinaAIIcon,
  JiraIcon,
  KalshiIcon,
  LinearIcon,
  LinkedInIcon,
  LinkupIcon,
  MailchimpIcon,
  MailgunIcon,
  Mem0Icon,
  MicrosoftExcelIcon,
  MicrosoftOneDriveIcon,
  MicrosoftPlannerIcon,
  MicrosoftSharepointIcon,
  MicrosoftTeamsIcon,
  MistralIcon,
  MongoDBIcon,
  MySQLIcon,
  Neo4jIcon,
  NotionIcon,
  OpenAIIcon,
  OutlookIcon,
  PackageSearchIcon,
  ParallelIcon,
  PerplexityIcon,
  PineconeIcon,
  PipedriveIcon,
  PolymarketIcon,
  PostgresIcon,
  PosthogIcon,
  QdrantIcon,
  RDSIcon,
  RedditIcon,
  ResendIcon,
  S3Icon,
  SalesforceIcon,
  SearchIcon,
  SendgridIcon,
  SentryIcon,
  SerperIcon,
  ServiceNowIcon,
  SftpIcon,
  ShopifyIcon,
  SlackIcon,
  SmtpIcon,
  SpotifyIcon,
  SQSIcon,
  SshIcon,
  STTIcon,
  StagehandIcon,
  StripeIcon,
  SupabaseIcon,
  TavilyIcon,
  TelegramIcon,
  TranslateIcon,
  TrelloIcon,
  TTSIcon,
  TwilioIcon,
  TypeformIcon,
  VideoIcon,
  WealthboxIcon,
  WebflowIcon,
  WhatsAppIcon,
  WikipediaIcon,
  WordpressIcon,
  xIcon,
  YouTubeIcon,
  ZendeskIcon,
  ZepIcon,
  ZoomIcon,
} from '@/components/icons'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export const blockTypeToIconMap: Record<string, IconComponent> = {
  zoom: ZoomIcon,
  zep: ZepIcon,
  zendesk: ZendeskIcon,
  youtube: YouTubeIcon,
  x: xIcon,
  wordpress: WordpressIcon,
  wikipedia: WikipediaIcon,
  whatsapp: WhatsAppIcon,
  webflow: WebflowIcon,
  wealthbox: WealthboxIcon,
  vision: EyeIcon,
  video_generator: VideoIcon,
  typeform: TypeformIcon,
  twilio_voice: TwilioIcon,
  twilio_sms: TwilioIcon,
  tts: TTSIcon,
  trello: TrelloIcon,
  translate: TranslateIcon,
  thinking: BrainIcon,
  telegram: TelegramIcon,
  tavily: TavilyIcon,
  supabase: SupabaseIcon,
  stt: STTIcon,
  stripe: StripeIcon,
  stagehand: StagehandIcon,
  ssh: SshIcon,
  sqs: SQSIcon,
  spotify: SpotifyIcon,
  smtp: SmtpIcon,
  slack: SlackIcon,
  shopify: ShopifyIcon,
  sharepoint: MicrosoftSharepointIcon,
  sftp: SftpIcon,
  servicenow: ServiceNowIcon,
  serper: SerperIcon,
  sentry: SentryIcon,
  sendgrid: SendgridIcon,
  search: SearchIcon,
  salesforce: SalesforceIcon,
  s3: S3Icon,
  resend: ResendIcon,
  reddit: RedditIcon,
  rds: RDSIcon,
  qdrant: QdrantIcon,
  posthog: PosthogIcon,
  postgresql: PostgresIcon,
  polymarket: PolymarketIcon,
  pipedrive: PipedriveIcon,
  pinecone: PineconeIcon,
  perplexity: PerplexityIcon,
  parallel_ai: ParallelIcon,
  outlook: OutlookIcon,
  openai: OpenAIIcon,
  onedrive: MicrosoftOneDriveIcon,
  notion: NotionIcon,
  neo4j: Neo4jIcon,
  mysql: MySQLIcon,
  mongodb: MongoDBIcon,
  mistral_parse: MistralIcon,
  microsoft_teams: MicrosoftTeamsIcon,
  microsoft_planner: MicrosoftPlannerIcon,
  microsoft_excel: MicrosoftExcelIcon,
  memory: BrainIcon,
  mem0: Mem0Icon,
  mailgun: MailgunIcon,
  mailchimp: MailchimpIcon,
  linkup: LinkupIcon,
  linkedin: LinkedInIcon,
  linear: LinearIcon,
  knowledge: PackageSearchIcon,
  kalshi: KalshiIcon,
  jira: JiraIcon,
  jina: JinaAIIcon,
  intercom: IntercomIcon,
  incidentio: IncidentioIcon,
  image_generator: ImageIcon,
  hunter: HunterIOIcon,
  huggingface: HuggingFaceIcon,
  hubspot: HubspotIcon,
  grafana: GrafanaIcon,
  google_vault: GoogleVaultIcon,
  google_slides: GoogleSlidesIcon,
  google_sheets: GoogleSheetsIcon,
  google_groups: GoogleGroupsIcon,
  google_forms: GoogleFormsIcon,
  google_drive: GoogleDriveIcon,
  google_docs: GoogleDocsIcon,
  google_calendar: GoogleCalendarIcon,
  google_search: GoogleIcon,
  gmail: GmailIcon,
  gitlab: GitLabIcon,
  github: GithubIcon,
  firecrawl: FirecrawlIcon,
  file: DocumentIcon,
  exa: ExaAIIcon,
  elevenlabs: ElevenLabsIcon,
  elasticsearch: ElasticsearchIcon,
  dynamodb: DynamoDBIcon,
  duckduckgo: DuckDuckGoIcon,
  dropbox: DropboxIcon,
  discord: DiscordIcon,
  datadog: DatadogIcon,
  cursor: CursorIcon,
  confluence: ConfluenceIcon,
  clay: ClayIcon,
  calendly: CalendlyIcon,
  browser_use: BrowserUseIcon,
  asana: AsanaIcon,
  arxiv: ArxivIcon,
  apollo: ApolloIcon,
  apify: ApifyIcon,
  airtable: AirtableIcon,
  ahrefs: AhrefsIcon,
}
```

--------------------------------------------------------------------------------

---[FILE: image.tsx]---
Location: sim-main/apps/docs/components/ui/image.tsx
Signals: React, Next.js

```typescript
'use client'

import { useState } from 'react'
import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import { Lightbox } from '@/components/ui/lightbox'
import { cn } from '@/lib/utils'

interface ImageProps extends Omit<NextImageProps, 'className'> {
  className?: string
  enableLightbox?: boolean
}

export function Image({
  className = 'w-full',
  enableLightbox = true,
  alt = '',
  src,
  ...props
}: ImageProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const handleImageClick = () => {
    if (enableLightbox) {
      setIsLightboxOpen(true)
    }
  }

  return (
    <>
      <NextImage
        className={cn(
          'overflow-hidden rounded-xl border border-border object-cover shadow-sm',
          enableLightbox && 'cursor-pointer transition-opacity hover:opacity-90',
          className
        )}
        alt={alt}
        src={src}
        onClick={handleImageClick}
        {...props}
      />

      {enableLightbox && (
        <Lightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          src={typeof src === 'string' ? src : String(src)}
          alt={alt}
          type='image'
        />
      )}
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: language-dropdown.tsx]---
Location: sim-main/apps/docs/components/ui/language-dropdown.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ja: { name: '日本語', flag: '🇯🇵' },
  zh: { name: '简体中文', flag: '🇨🇳' },
}

export function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  const [currentLang, setCurrentLang] = useState(() => {
    const langFromParams = params?.lang as string
    return langFromParams && Object.keys(languages).includes(langFromParams) ? langFromParams : 'en'
  })

  useEffect(() => {
    const langFromParams = params?.lang as string

    if (langFromParams && Object.keys(languages).includes(langFromParams)) {
      if (langFromParams !== currentLang) {
        setCurrentLang(langFromParams)
      }
    } else {
      if (currentLang !== 'en') {
        setCurrentLang('en')
      }
    }
  }, [params, currentLang])

  const handleLanguageChange = (locale: string) => {
    if (locale === currentLang) {
      setIsOpen(false)
      return
    }

    setIsOpen(false)

    const segments = pathname.split('/').filter(Boolean)

    if (segments[0] && Object.keys(languages).includes(segments[0])) {
      segments.shift()
    }

    let newPath = ''
    if (locale === 'en') {
      newPath = segments.length > 0 ? `/${segments.join('/')}` : '/introduction'
    } else {
      newPath = `/${locale}${segments.length > 0 ? `/${segments.join('/')}` : '/introduction'}`
    }

    router.push(newPath)
  }

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  return (
    <div className='relative'>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-controls='language-menu'
        className='flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 font-normal text-[0.9375rem] text-foreground/60 leading-[1.4] transition-colors hover:bg-foreground/8 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <span>{languages[currentLang as keyof typeof languages]?.name}</span>
        <ChevronRight className='h-3.5 w-3.5' />
      </button>

      {isOpen && (
        <>
          <div className='fixed inset-0 z-[1000]' aria-hidden onClick={() => setIsOpen(false)} />
          <div
            id='language-menu'
            role='listbox'
            className='absolute top-full right-0 z-[1001] mt-1 max-h-[75vh] w-56 overflow-auto rounded-xl border border-border/50 bg-white shadow-2xl md:w-44 md:bg-background/95 md:backdrop-blur-md dark:bg-neutral-950 md:dark:bg-background/95'
          >
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleLanguageChange(code)
                }}
                role='option'
                aria-selected={currentLang === code}
                className={`flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-base transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:gap-2 md:px-2.5 md:py-2 md:text-sm ${
                  currentLang === code ? 'bg-muted/60 font-medium text-primary' : 'text-foreground'
                }`}
              >
                <span className='text-base md:text-sm'>{lang.flag}</span>
                <span className='leading-none'>{lang.name}</span>
                {currentLang === code && (
                  <Check className='ml-auto h-4 w-4 text-primary md:h-3.5 md:w-3.5' />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: lightbox.tsx]---
Location: sim-main/apps/docs/components/ui/lightbox.tsx
Signals: React

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { getAssetUrl } from '@/lib/utils'

interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt: string
  type: 'image' | 'video'
}

export function Lightbox({ isOpen, onClose, src, alt, type }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && event.target === overlayRef.current) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-12 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      aria-label='Media viewer'
    >
      <div className='relative max-h-full max-w-full overflow-hidden rounded-xl shadow-2xl'>
        {type === 'image' ? (
          <img
            src={src}
            alt={alt}
            className='max-h-[calc(100vh-6rem)] max-w-[calc(100vw-6rem)] rounded-xl object-contain'
            loading='lazy'
          />
        ) : (
          <video
            src={getAssetUrl(src)}
            autoPlay
            loop
            muted
            playsInline
            className='max-h-[calc(100vh-6rem)] max-w-[calc(100vw-6rem)] rounded-xl outline-none focus:outline-none'
          />
        )}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````

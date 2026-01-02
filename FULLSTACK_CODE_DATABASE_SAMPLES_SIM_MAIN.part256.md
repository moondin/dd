---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 256
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 256 of 933)

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

---[FILE: landing-pricing.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/landing-pricing/landing-pricing.tsx
Signals: React, Next.js

```typescript
'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  ChevronRight,
  Code2,
  Database,
  DollarSign,
  HardDrive,
  Workflow,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { inter } from '@/app/_styles/fonts/inter/inter'
import {
  ENTERPRISE_PLAN_FEATURES,
  PRO_PLAN_FEATURES,
  TEAM_PLAN_FEATURES,
} from '@/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/plan-configs'

const logger = createLogger('LandingPricing')

interface PricingFeature {
  icon: LucideIcon
  text: string
}

interface PricingTier {
  name: string
  tier: string
  price: string
  features: PricingFeature[]
  ctaText: string
  featured?: boolean
}

/**
 * Free plan features with consistent icons
 */
const FREE_PLAN_FEATURES: PricingFeature[] = [
  { icon: DollarSign, text: '$10 usage limit' },
  { icon: HardDrive, text: '5GB file storage' },
  { icon: Workflow, text: 'Public template access' },
  { icon: Database, text: 'Limited log retention' },
  { icon: Code2, text: 'CLI/SDK Access' },
]

/**
 * Available pricing tiers with their features and pricing
 */
const pricingTiers: PricingTier[] = [
  {
    name: 'COMMUNITY',
    tier: 'Free',
    price: 'Free',
    features: FREE_PLAN_FEATURES,
    ctaText: 'Get Started',
  },
  {
    name: 'PRO',
    tier: 'Pro',
    price: '$20/mo',
    features: PRO_PLAN_FEATURES,
    ctaText: 'Get Started',
    featured: true,
  },
  {
    name: 'TEAM',
    tier: 'Team',
    price: '$40/mo',
    features: TEAM_PLAN_FEATURES,
    ctaText: 'Get Started',
  },
  {
    name: 'ENTERPRISE',
    tier: 'Enterprise',
    price: 'Custom',
    features: ENTERPRISE_PLAN_FEATURES,
    ctaText: 'Contact Sales',
  },
]

/**
 * Individual pricing card component
 * @param tier - The pricing tier data
 * @param index - The index of the card in the grid
 * @param isBeforeFeatured - Whether this card is immediately before a featured card
 */
function PricingCard({
  tier,
  index,
  isBeforeFeatured,
}: {
  tier: PricingTier
  index: number
  isBeforeFeatured?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleCtaClick = () => {
    logger.info(`Pricing CTA clicked: ${tier.name}`)

    if (tier.ctaText === 'Contact Sales') {
      // Open enterprise form in new tab
      window.open('https://form.typeform.com/to/jqCO12pF', '_blank')
    } else {
      // Navigate to signup page for all "Get Started" buttons
      router.push('/signup')
    }
  }

  return (
    <div
      className={cn(
        `${inter.className}`,
        'relative flex h-full flex-col justify-between bg-[#FEFEFE]',
        tier.featured ? 'p-0' : 'px-0 py-0',
        'sm:px-5 sm:pt-4 sm:pb-4',
        tier.featured
          ? 'sm:p-0'
          : isBeforeFeatured
            ? 'sm:border-[#E7E4EF] sm:border-r-0'
            : 'sm:border-[#E7E4EF] sm:border-r-2 sm:last:border-r-0',
        !tier.featured && !isBeforeFeatured && 'lg:[&:nth-child(4n)]:border-r-0',
        !tier.featured &&
          !isBeforeFeatured &&
          'sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r-2',
        tier.featured ? 'z-10 bg-gradient-to-b from-[#8357FF] to-[#6F3DFA] text-white' : ''
      )}
    >
      <div
        className={cn(
          'flex h-full flex-col justify-between',
          tier.featured
            ? 'border-2 border-[#6F3DFA] px-5 pt-4 pb-5 shadow-[inset_0_2px_4px_0_#9B77FF] sm:px-5 sm:pt-4 sm:pb-4'
            : ''
        )}
      >
        <div className='flex-1'>
          <div className='mb-1'>
            <span
              className={cn(
                'font-medium text-xs uppercase tracking-wider',
                tier.featured ? 'text-white/90' : 'text-gray-500'
              )}
            >
              {tier.name}
            </span>
          </div>
          <div className='mb-6'>
            <span
              className={cn(
                'font-medium text-4xl leading-none',
                tier.featured ? 'text-white' : 'text-black'
              )}
            >
              {tier.price}
            </span>
          </div>

          <ul className='mb-[2px] space-y-3'>
            {tier.features.map((feature, idx) => (
              <li key={idx} className='flex items-start gap-2'>
                <feature.icon
                  className={cn(
                    'mt-0.5 h-4 w-4 flex-shrink-0',
                    tier.featured ? 'text-white/90' : 'text-gray-600'
                  )}
                />
                <span className={cn('text-sm', tier.featured ? 'text-white' : 'text-gray-700')}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-9'>
          {tier.featured ? (
            <button
              onClick={handleCtaClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className='group inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#E8E8E8] bg-gradient-to-b from-[#F8F8F8] to-white px-3 py-[6px] font-medium text-[#6F3DFA] text-[14px] shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.9)] transition-all'
            >
              <span className='flex items-center gap-1'>
                {tier.ctaText}
                <span className='inline-flex transition-transform duration-200 group-hover:translate-x-0.5'>
                  {isHovered ? (
                    <ArrowRight className='h-4 w-4' />
                  ) : (
                    <ChevronRight className='h-4 w-4' />
                  )}
                </span>
              </span>
            </button>
          ) : (
            <button
              onClick={handleCtaClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className='group inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#343434] bg-gradient-to-b from-[#060606] to-[#323232] px-3 py-[6px] font-medium text-[14px] text-white shadow-[inset_0_1.25px_2.5px_0_#9B77FF] transition-all'
            >
              <span className='flex items-center gap-1'>
                {tier.ctaText}
                <span className='inline-flex transition-transform duration-200 group-hover:translate-x-0.5'>
                  {isHovered ? (
                    <ArrowRight className='h-4 w-4' />
                  ) : (
                    <ChevronRight className='h-4 w-4' />
                  )}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Landing page pricing section displaying tiered pricing plans
 */
export default function LandingPricing() {
  return (
    <section id='pricing' className='px-4 pt-[19px] sm:px-0 sm:pt-0' aria-label='Pricing plans'>
      <h2 className='sr-only'>Pricing Plans</h2>
      <div className='relative mx-auto w-full max-w-[1289px]'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0 lg:grid-cols-4'>
          {pricingTiers.map((tier, index) => {
            const nextTier = pricingTiers[index + 1]
            const isBeforeFeatured = nextTier?.featured
            return (
              <PricingCard
                key={tier.name}
                tier={tier}
                index={index}
                isBeforeFeatured={isBeforeFeatured}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: landing-templates.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/landing-templates/landing-templates.tsx

```typescript
import { inter } from '@/app/_styles/fonts/inter/inter'
import LandingTemplatePreview from '@/app/(landing)/components/landing-templates/components/landing-template-preview'

const templates = [
  {
    id: 1,
    previewImage: '/placeholder-template-1.jpg',
    avatarImage: '/placeholder-avatar-1.jpg',
    title: 'Meeting notetaker',
    authorName: 'Emir Ayaz',
    usageCount: 7800,
  },
  {
    id: 2,
    previewImage: '/placeholder-template-2.jpg',
    avatarImage: '/placeholder-avatar-2.jpg',
    title: 'Cold outreach sender',
    authorName: 'Liam Chen',
    usageCount: 15000,
  },
  {
    id: 3,
    previewImage: '/placeholder-template-3.jpg',
    avatarImage: '/placeholder-avatar-3.jpg',
    title: 'Campaign scheduler',
    authorName: 'Jade Monroe',
    usageCount: 11800,
  },
  {
    id: 4,
    previewImage: '/placeholder-template-4.jpg',
    avatarImage: '/placeholder-avatar-4.jpg',
    title: 'Lead qualifier',
    authorName: 'Marcus Vega',
    usageCount: 13200,
  },
  {
    id: 5,
    previewImage: '/placeholder-template-5.jpg',
    avatarImage: '/placeholder-avatar-5.jpg',
    title: 'Performance reporter',
    authorName: 'Emily Zhao',
    usageCount: 9500,
  },
  {
    id: 6,
    previewImage: '/placeholder-template-6.jpg',
    avatarImage: '/placeholder-avatar-6.jpg',
    title: 'Ad copy generator',
    authorName: 'Carlos Mendez',
    usageCount: 14200,
  },
  {
    id: 7,
    previewImage: '/placeholder-template-7.jpg',
    avatarImage: '/placeholder-avatar-7.jpg',
    title: 'Product launch email',
    authorName: 'Lucas Patel',
    usageCount: 10500,
  },
  {
    id: 8,
    previewImage: '/placeholder-template-8.jpg',
    avatarImage: '/placeholder-avatar-8.jpg',
    title: 'Customer support chatbot',
    authorName: 'Sophia Nguyen',
    usageCount: 12000,
  },
  {
    id: 9,
    previewImage: '/placeholder-template-9.jpg',
    avatarImage: '/placeholder-avatar-9.jpg',
    title: 'Event planner',
    authorName: 'Aiden Kim',
    usageCount: 13500,
  },
]

export default function LandingTemplates() {
  return (
    <section
      id='templates'
      className={`${inter.className} flex flex-col px-4 pt-[40px] sm:px-[50px] sm:pt-[34px]`}
      aria-labelledby='templates-heading'
    >
      <h2
        id='templates-heading'
        className='mb-[16px] font-medium text-[28px] text-foreground tracking-tight sm:mb-[24px]'
      >
        Templates
      </h2>

      {/* Templates Grid */}
      <div className='grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {templates.map((template, index) => (
          <div
            key={template.id}
            className={`
              ${index >= 3 ? 'hidden md:block' : ''} ${index >= 6 ? 'md:hidden lg:block' : ''} `}
          >
            <LandingTemplatePreview
              previewImage={template.previewImage}
              avatarImage={template.avatarImage}
              title={template.title}
              authorName={template.authorName}
              usageCount={template.usageCount}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: landing-template-preview.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/landing-templates/components/landing-template-preview.tsx

```typescript
import { inter } from '@/app/_styles/fonts/inter/inter'

interface LandingTemplatePreviewProps {
  previewImage: string
  avatarImage: string
  title: string
  authorName: string
  usageCount: number
}

export default function LandingTemplatePreview({
  previewImage,
  avatarImage,
  title,
  authorName,
  usageCount,
}: LandingTemplatePreviewProps) {
  return (
    <div className='flex flex-col'>
      {/* Preview Image */}
      <div
        className='h-44 w-full rounded-[10px] bg-center bg-cover bg-no-repeat'
        style={{
          backgroundImage: `url(${previewImage}), linear-gradient(to right, #F5F5F5, #F5F5F5)`,
        }}
      />

      {/* Author and Info Section */}
      <div className='mt-4 flex items-center gap-3'>
        {/* Avatar */}
        <div
          className='h-[32px] w-[32px] flex-shrink-0 rounded-full bg-center bg-cover bg-no-repeat'
          style={{
            backgroundImage: `url(${avatarImage}), linear-gradient(to right, #F5F5F5, #F5F5F5)`,
          }}
        />

        {/* Title and Author Info */}
        <div className='min-w-0 flex-1'>
          <h4
            className={`${inter.className} truncate font-medium text-foreground text-sm leading-none`}
          >
            {title}
          </h4>
          <p
            className={`${inter.className} mt-1 flex items-center gap-2 text-muted-foreground text-xs`}
          >
            <span>{authorName}</span>
            <span>{usageCount.toLocaleString()} copies</span>
          </p>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: nav.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/nav/nav.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GithubIcon } from '@/components/icons'
import { useBrandConfig } from '@/lib/branding/branding'
import { isHosted } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import { getFormattedGitHubStars } from '@/app/(landing)/actions/github'

const logger = createLogger('nav')

interface NavProps {
  hideAuthButtons?: boolean
  variant?: 'landing' | 'auth' | 'legal'
}

export default function Nav({ hideAuthButtons = false, variant = 'landing' }: NavProps = {}) {
  const [githubStars, setGithubStars] = useState('18.6k')
  const [isHovered, setIsHovered] = useState(false)
  const [isLoginHovered, setIsLoginHovered] = useState(false)
  const router = useRouter()
  const brand = useBrandConfig()

  useEffect(() => {
    if (variant !== 'landing') return

    const timeoutId = setTimeout(() => {
      const fetchStars = async () => {
        try {
          const stars = await getFormattedGitHubStars()
          setGithubStars(stars)
        } catch (error) {
          logger.warn('Error fetching GitHub stars:', error)
        }
      }
      fetchStars()
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [variant])

  const handleLoginClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      router.push('/login')
    },
    [router]
  )

  const handleEnterpriseClick = useCallback(() => {
    window.open('https://form.typeform.com/to/jqCO12pF', '_blank', 'noopener,noreferrer')
  }, [])

  const NavLinks = () => (
    <>
      <li>
        <Link
          href='https://docs.sim.ai'
          target='_blank'
          rel='noopener noreferrer'
          className='text-[16px] text-muted-foreground transition-colors hover:text-foreground'
          prefetch={false}
        >
          Docs
        </Link>
      </li>
      <li>
        <Link
          href='/?from=nav#pricing'
          className='text-[16px] text-muted-foreground transition-colors hover:text-foreground'
          scroll={true}
        >
          Pricing
        </Link>
      </li>
      <li>
        <button
          onClick={handleEnterpriseClick}
          className='text-[16px] text-muted-foreground transition-colors hover:text-foreground'
          type='button'
          aria-label='Contact for Enterprise pricing'
        >
          Enterprise
        </button>
      </li>
      <li>
        <Link
          href='/careers'
          className='text-[16px] text-muted-foreground transition-colors hover:text-foreground'
        >
          Careers
        </Link>
      </li>
      <li>
        <a
          href='https://github.com/simstudioai/sim'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 text-[16px] text-muted-foreground transition-colors hover:text-foreground'
          aria-label={`GitHub repository - ${githubStars} stars`}
        >
          <GithubIcon className='h-[16px] w-[16px]' aria-hidden='true' />
          <span aria-live='polite'>{githubStars}</span>
        </a>
      </li>
    </>
  )

  return (
    <nav
      aria-label='Primary navigation'
      className={`${soehne.className} flex w-full items-center justify-between px-4 ${
        variant === 'auth' ? 'pt-[20px] sm:pt-[16.5px]' : 'pt-[12px] sm:pt-[8.5px]'
      } pb-[21px] sm:px-8 md:px-[44px]`}
      itemScope
      itemType='https://schema.org/SiteNavigationElement'
    >
      <div className='flex items-center gap-[34px]'>
        <Link href='/?from=nav' aria-label={`${brand.name} home`} itemProp='url'>
          <span itemProp='name' className='sr-only'>
            {brand.name} Home
          </span>
          {brand.logoUrl ? (
            <Image
              src={brand.logoUrl}
              alt={`${brand.name} Logo`}
              width={49.78314}
              height={24.276}
              className='h-[24.276px] w-auto object-contain'
              priority
              loading='eager'
              quality={100}
              unoptimized
            />
          ) : (
            <Image
              src='/logo/b&w/text/b&w.svg'
              alt='Sim - Workflows for LLMs'
              width={49.78314}
              height={24.276}
              priority
              loading='eager'
              quality={100}
            />
          )}
        </Link>
        {/* Desktop Navigation Links - only show on landing and if hosted */}
        {variant === 'landing' && isHosted && (
          <ul className='hidden items-center justify-center gap-[20px] pt-[4px] md:flex'>
            <NavLinks />
          </ul>
        )}
      </div>

      {/* Auth Buttons - show only when hosted, regardless of variant */}
      {!hideAuthButtons && isHosted && (
        <div className='flex items-center justify-center gap-[16px] pt-[1.5px]'>
          <button
            onClick={handleLoginClick}
            onMouseEnter={() => setIsLoginHovered(true)}
            onMouseLeave={() => setIsLoginHovered(false)}
            className='group hidden text-[#2E2E2E] text-[16px] transition-colors hover:text-foreground md:block'
            type='button'
            aria-label='Log in to your account'
          >
            <span className='flex items-center gap-1'>
              Log in
              <span className='inline-flex transition-transform duration-200 group-hover:translate-x-0.5'>
                {isLoginHovered ? (
                  <ArrowRight className='h-4 w-4' aria-hidden='true' />
                ) : (
                  <ChevronRight className='h-4 w-4' aria-hidden='true' />
                )}
              </span>
            </span>
          </button>
          <Link
            href='/signup'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className='group inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#6F3DFA] bg-gradient-to-b from-[#8357FF] to-[#6F3DFA] py-[6px] pr-[10px] pl-[12px] text-[14px] text-white shadow-[inset_0_2px_4px_0_#9B77FF] transition-all sm:text-[16px]'
            aria-label='Get started with Sim - Sign up for free'
            prefetch={true}
          >
            <span className='flex items-center gap-1'>
              Get started
              <span className='inline-flex transition-transform duration-200 group-hover:translate-x-0.5'>
                {isHovered ? (
                  <ArrowRight className='h-4 w-4' aria-hidden='true' />
                ) : (
                  <ChevronRight className='h-4 w-4' aria-hidden='true' />
                )}
              </span>
            </span>
          </Link>
        </div>
      )}
    </nav>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: testimonials.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/testimonials/testimonials.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { inter } from '@/app/_styles/fonts/inter/inter'

interface Testimonial {
  text: string
  name: string
  username: string
  viewCount: string
  tweetUrl: string
  profileImage: string
}

const allTestimonials: Testimonial[] = [
  {
    text: "🚨 BREAKING: This startup just dropped the fastest way to build AI agents.\n\nThis Figma-like canvas to build agents will blow your mind.\n\nHere's why this is the best tool for building AI agents:",
    name: 'Hasan Toor',
    username: '@hasantoxr',
    viewCount: '515k',
    tweetUrl: 'https://x.com/hasantoxr/status/1912909502036525271',
    profileImage: '/twitter/hasan.jpg',
  },
  {
    text: "Drag-and-drop AI workflows for devs who'd rather build agents than babysit them.",
    name: 'GitHub Projects',
    username: '@GithubProjects',
    viewCount: '90.4k',
    tweetUrl: 'https://x.com/GithubProjects/status/1906383555707490499',
    profileImage: '/twitter/github-projects.jpg',
  },
  {
    text: "🚨 BREAKING: This startup just dropped the fastest way to build AI agents.\n\nThis Figma-like canvas to build agents will blow your mind.\n\nHere's why this is the best tool for building AI agents:",
    name: 'Ryan Lazuka',
    username: '@lazukars',
    viewCount: '47.4k',
    tweetUrl: 'https://x.com/lazukars/status/1913136390503600575',
    profileImage: '/twitter/lazukars.png',
  },
  {
    text: 'omfggggg this is the zapier of agent building\n\ni always believed that building agents and using ai should not be limited to technical people. i think this solves just that\n\nthe fact that this is also open source makes me so optimistic about the future of building with ai :)))\n\ncongrats @karabegemir & @typingwala !!!',
    name: 'nizzy',
    username: '@nizzyabi',
    viewCount: '6,269',
    tweetUrl: 'https://x.com/nizzyabi/status/1907864421227180368',
    profileImage: '/twitter/nizzy.jpg',
  },
  {
    text: 'A very good looking agent workflow builder 🔥 and open source!',
    name: 'xyflow',
    username: '@xyflowdev',
    viewCount: '3,246',
    tweetUrl: 'https://x.com/xyflowdev/status/1909501499719438670',
    profileImage: '/twitter/xyflow.jpg',
  },
  {
    text: "One of the best products I've seen in the space, and the hustle and grind I've seen from @karabegemir and @typingwala is insane. Sim is positioned to build something game-changing, and there's no better team for the job.\n\nCongrats on the launch 🚀 🎊 great things ahead!",
    name: 'samarth',
    username: '@firestorm776',
    viewCount: '1,256',
    tweetUrl: 'https://x.com/firestorm776/status/1907896097735061598',
    profileImage: '/twitter/samarth.jpg',
  },
  {
    text: 'lfgg got access to @simstudioai via @zerodotemail 😎',
    name: 'nizzy',
    username: '@nizzyabi',
    viewCount: '1,762',
    tweetUrl: 'https://x.com/nizzyabi/status/1910482357821595944',
    profileImage: '/twitter/nizzy.jpg',
  },
  {
    text: 'Feels like we\'re finally getting a "Photoshop moment" for AI devs—visual, intuitive, and fast enough to keep up with ideas mid-flow.',
    name: 'Syamraj K',
    username: '@syamrajk',
    viewCount: '2,784',
    tweetUrl: 'https://x.com/syamrajk/status/1912911980110946491',
    profileImage: '/twitter/syamrajk.jpg',
  },
  {
    text: 'The use cases are endless. Great work @simstudioai',
    name: 'Daniel Kim',
    username: '@daniel_zkim',
    viewCount: '103',
    tweetUrl: 'https://x.com/daniel_zkim/status/1907891273664782708',
    profileImage: '/twitter/daniel.jpg',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const extendedTestimonials = [...allTestimonials, ...allTestimonials]

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused])

  useEffect(() => {
    if (currentIndex >= allTestimonials.length) {
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
      }, 500)
    }
  }, [currentIndex])

  const getTransformValue = () => {
    // Each card unit (card + separator) takes exactly 25% width
    return `translateX(-${currentIndex * 25}%)`
  }

  return (
    <section
      id='testimonials'
      className={`flex hidden h-[150px] items-center sm:block ${inter.variable}`}
      aria-label='Social proof testimonials'
    >
      <div className='relative mx-auto h-full w-full max-w-[1289px] pl-[2px]'>
        <div
          className='relative h-full w-full overflow-hidden'
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex h-full ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
            style={{
              transform: getTransformValue(),
            }}
          >
            {extendedTestimonials.map((tweet, absoluteIndex) => {
              // Always show separator except for the very last card in the extended array
              const showSeparator = absoluteIndex < extendedTestimonials.length - 1

              return (
                /* Card unit wrapper - exactly 25% width including separator */
                <div key={`${absoluteIndex}`} className='flex h-full w-1/4 flex-shrink-0'>
                  {/* Tweet container */}
                  <div
                    className='group flex h-full w-full cursor-pointer flex-col px-[12px] py-[12px] transition-all duration-100 hover:bg-[#0A0A0A] sm:px-[14px]'
                    onClick={() => window.open(tweet.tweetUrl, '_blank', 'noopener,noreferrer')}
                  >
                    {/* Top section with profile info */}
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-2'>
                        {/* Profile image */}
                        <Image
                          src={tweet.profileImage}
                          alt={`${tweet.username} profile`}
                          width={34}
                          height={34}
                          className='h-[34px] w-[34px] rounded-full object-cover'
                          quality={75}
                          loading='lazy'
                        />
                        {/* Name and username stacked */}
                        <div className='flex flex-col'>
                          <span className='font-[500] text-gray-900 text-sm transition-colors duration-300 group-hover:text-white'>
                            {tweet.name}
                          </span>
                          <span className='text-gray-500 text-xs transition-colors duration-300 group-hover:text-white/80'>
                            {tweet.username}
                          </span>
                        </div>
                      </div>
                      {/* View count in top right */}
                      <span className='text-gray-400 text-xs transition-colors duration-300 group-hover:text-white/70'>
                        {tweet.viewCount} views
                      </span>
                    </div>

                    {/* Tweet content below with padding */}
                    <p
                      className={`${inter.className} mt-2 line-clamp-4 font-[380] text-[#0A0A0A] text-[13px] leading-[1.3] transition-colors duration-300 group-hover:text-white`}
                    >
                      {tweet.text}
                    </p>
                  </div>

                  {/* Full height vertical separator line */}
                  {showSeparator && (
                    <div className='relative h-full flex-shrink-0'>
                      <svg
                        width='2'
                        height='100%'
                        viewBox='0 0 2 200'
                        preserveAspectRatio='none'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-full'
                      >
                        {/* Vertical line */}
                        <path d='M1 0V200' stroke='#E7E4EF' strokeWidth='2' />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 337
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 337 of 933)

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

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/changelog/layout.tsx

```typescript
import Nav from '@/app/(landing)/components/nav/nav'

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Nav />
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/changelog/page.tsx
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import ChangelogContent from '@/app/changelog/components/changelog-content'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Stay up-to-date with the latest features, improvements, and bug fixes in Sim.',
  openGraph: {
    title: 'Changelog',
    description: 'Stay up-to-date with the latest features, improvements, and bug fixes in Sim.',
    type: 'website',
  },
}

export default function ChangelogPage() {
  return <ChangelogContent />
}
```

--------------------------------------------------------------------------------

---[FILE: changelog-content.tsx]---
Location: sim-main/apps/sim/app/changelog/components/changelog-content.tsx
Signals: Next.js

```typescript
import { BookOpen, Github, Rss } from 'lucide-react'
import Link from 'next/link'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import ChangelogList from '@/app/changelog/components/timeline-list'

export interface ChangelogEntry {
  tag: string
  title: string
  content: string
  date: string
  url: string
  contributors?: string[]
}

function extractMentions(body: string): string[] {
  const matches = body.match(/@([A-Za-z0-9-]+)/g) ?? []
  const uniq = Array.from(new Set(matches.map((m) => m.slice(1))))
  return uniq
}

export default async function ChangelogContent() {
  let entries: ChangelogEntry[] = []

  try {
    const res = await fetch(
      'https://api.github.com/repos/simstudioai/sim/releases?per_page=10&page=1',
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 3600 },
      }
    )
    const releases: any[] = await res.json()
    entries = (releases || [])
      .filter((r) => !r.prerelease)
      .map((r) => ({
        tag: r.tag_name,
        title: r.name || r.tag_name,
        content: String(r.body || ''),
        date: r.published_at,
        url: r.html_url,
        contributors: extractMentions(String(r.body || '')),
      }))
  } catch (err) {
    entries = []
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='relative grid md:grid-cols-2'>
        {/* Left intro panel */}
        <div className='relative top-0 overflow-hidden border-border border-b px-6 py-16 sm:px-10 md:sticky md:h-dvh md:border-r md:border-b-0 md:px-12 md:py-24'>
          <div className='absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.06]' />
          <div className='absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/60' />

          <div className='relative mx-auto h-full max-w-xl md:flex md:flex-col md:justify-center'>
            <h1
              className={`${soehne.className} mt-6 font-semibold text-4xl tracking-tight sm:text-5xl`}
            >
              Changelog
            </h1>
            <p className={`${inter.className} mt-4 text-muted-foreground text-sm`}>
              Stay up-to-date with the latest features, improvements, and bug fixes in Sim. All
              changes are documented here with detailed release notes.
            </p>
            <hr className='mt-6 border-border' />

            <div className='mt-6 flex flex-wrap items-center gap-3 text-sm'>
              <Link
                href='https://github.com/simstudioai/sim/releases'
                target='_blank'
                rel='noopener noreferrer'
                className='group inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#6F3DFA] bg-gradient-to-b from-[#8357FF] to-[#6F3DFA] py-[6px] pr-[10px] pl-[12px] text-[14px] text-white shadow-[inset_0_2px_4px_0_#9B77FF] transition-all sm:text-[16px]'
              >
                <Github className='h-4 w-4' />
                View on GitHub
              </Link>
              <Link
                href='https://docs.sim.ai'
                className='inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 hover:bg-muted'
              >
                <BookOpen className='h-4 w-4' />
                Documentation
              </Link>
              <Link
                href='/changelog.xml'
                className='inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 hover:bg-muted'
              >
                <Rss className='h-4 w-4' />
                RSS Feed
              </Link>
            </div>
          </div>
        </div>

        {/* Right timeline */}
        <div className='relative px-4 py-10 sm:px-6 md:px-8 md:py-12'>
          <div className='relative max-w-2xl pl-8'>
            <ChangelogList initialEntries={entries} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: timeline-list.tsx]---
Location: sim-main/apps/sim/app/changelog/components/timeline-list.tsx
Signals: React

```typescript
'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import type { ChangelogEntry } from '@/app/changelog/components/changelog-content'

type Props = { initialEntries: ChangelogEntry[] }

function sanitizeContent(body: string): string {
  return body.replace(/&nbsp/g, '')
}

function stripContributors(body: string): string {
  let output = body
  output = output.replace(
    /(^|\n)#{1,6}\s*Contributors\s*\n[\s\S]*?(?=\n\s*\n|\n#{1,6}\s|$)/gi,
    '\n'
  )
  output = output.replace(
    /(^|\n)\s*(?:\*\*|__)?\s*Contributors\s*(?:\*\*|__)?\s*:?\s*\n[\s\S]*?(?=\n\s*\n|\n#{1,6}\s|$)/gi,
    '\n'
  )
  output = output.replace(
    /(^|\n)[-*+]\s*(?:@[A-Za-z0-9-]+(?:\s*,\s*|\s+))+@[A-Za-z0-9-]+\s*(?=\n)/g,
    '\n'
  )
  output = output.replace(
    /(^|\n)\s*(?:@[A-Za-z0-9-]+(?:\s*,\s*|\s+))+@[A-Za-z0-9-]+\s*(?=\n)/g,
    '\n'
  )
  return output
}

function isContributorsLabel(nodeChildren: React.ReactNode): boolean {
  return /^\s*contributors\s*:?\s*$/i.test(String(nodeChildren))
}

function stripPrReferences(body: string): string {
  return body.replace(/\s*\(\s*\[#\d+\]\([^)]*\)\s*\)/g, '').replace(/\s*\(\s*#\d+\s*\)/g, '')
}

function cleanMarkdown(body: string): string {
  const sanitized = sanitizeContent(body)
  const withoutContribs = stripContributors(sanitized)
  const withoutPrs = stripPrReferences(withoutContribs)
  return withoutPrs
}

function extractMentions(body: string): string[] {
  const matches = body.match(/@([A-Za-z0-9-]+)/g) ?? []
  return Array.from(new Set(matches.map((m) => m.slice(1))))
}

export default function ChangelogList({ initialEntries }: Props) {
  const [entries, setEntries] = React.useState<ChangelogEntry[]>(initialEntries)
  const [page, setPage] = React.useState<number>(1)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [done, setDone] = React.useState<boolean>(false)

  const loadMore = async () => {
    if (loading || done) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await fetch(
        `https://api.github.com/repos/simstudioai/sim/releases?per_page=10&page=${nextPage}`,
        { headers: { Accept: 'application/vnd.github+json' } }
      )
      const releases: any[] = await res.json()
      const mapped: ChangelogEntry[] = (releases || [])
        .filter((r) => !r.prerelease)
        .map((r) => ({
          tag: r.tag_name,
          title: r.name || r.tag_name,
          content: sanitizeContent(String(r.body || '')),
          date: r.published_at,
          url: r.html_url,
          contributors: extractMentions(String(r.body || '')),
        }))

      if (mapped.length === 0) {
        setDone(true)
      } else {
        setEntries((prev) => [...prev, ...mapped])
        setPage(nextPage)
      }
    } catch {
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-10'>
      {entries.map((entry) => (
        <div key={entry.tag}>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <div className={`${soehne.className} font-semibold text-[18px] tracking-tight`}>
                {entry.tag}
              </div>
              {entry.contributors && entry.contributors.length > 0 && (
                <div className='-space-x-2 flex'>
                  {entry.contributors.slice(0, 5).map((contributor) => (
                    <a
                      key={contributor}
                      href={`https://github.com/${contributor}`}
                      target='_blank'
                      rel='noreferrer noopener'
                      aria-label={`View @${contributor} on GitHub`}
                      title={`@${contributor}`}
                      className='block'
                    >
                      <Avatar className='size-6 ring-2 ring-background'>
                        <AvatarImage
                          src={`https://avatars.githubusercontent.com/${contributor}`}
                          alt={`@${contributor}`}
                          className='hover:z-10'
                        />
                        <AvatarFallback>{contributor.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </a>
                  ))}
                  {entry.contributors.length > 5 && (
                    <div className='relative flex size-6 items-center justify-center rounded-full bg-muted text-[10px] text-foreground ring-2 ring-background hover:z-10'>
                      +{entry.contributors.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={`${inter.className} text-muted-foreground text-xs`}>
              {new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>

          <div
            className={`${inter.className} prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-brand-primary prose-headings:text-foreground prose-p:text-muted-foreground prose-a:no-underline hover:prose-a:underline`}
          >
            <ReactMarkdown
              components={{
                h2: ({ children, ...props }) =>
                  isContributorsLabel(children) ? null : (
                    <h3
                      className={`${soehne.className} mt-5 mb-2 font-medium text-[13px] text-foreground tracking-tight`}
                      {...props}
                    >
                      {children}
                    </h3>
                  ),
                h3: ({ children, ...props }) =>
                  isContributorsLabel(children) ? null : (
                    <h4
                      className={`${soehne.className} mt-4 mb-1 font-medium text-[13px] text-foreground tracking-tight`}
                      {...props}
                    >
                      {children}
                    </h4>
                  ),
                ul: ({ children, ...props }) => (
                  <ul className='mt-2 mb-3 space-y-1.5' {...props}>
                    {children}
                  </ul>
                ),
                li: ({ children, ...props }) => {
                  const text = String(children)
                  if (/^\s*contributors\s*:?\s*$/i.test(text)) return null
                  return (
                    <li className='text-[13px] text-muted-foreground leading-relaxed' {...props}>
                      {children}
                    </li>
                  )
                },
                p: ({ children, ...props }) =>
                  /^\s*contributors\s*:?\s*$/i.test(String(children)) ? null : (
                    <p
                      className='mb-3 text-[13px] text-muted-foreground leading-relaxed'
                      {...props}
                    >
                      {children}
                    </p>
                  ),
                strong: ({ children, ...props }) => (
                  <strong className='font-medium text-foreground' {...props}>
                    {children}
                  </strong>
                ),
                code: ({ children, ...props }) => (
                  <code
                    className='rounded bg-muted px-1 py-0.5 font-mono text-foreground text-xs'
                    {...props}
                  >
                    {children}
                  </code>
                ),
                img: () => null,
                a: ({ className, ...props }: any) => (
                  <a
                    {...props}
                    className={`underline ${className ?? ''}`}
                    target='_blank'
                    rel='noreferrer'
                  />
                ),
              }}
            >
              {cleanMarkdown(entry.content)}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      {!done && (
        <div>
          <button
            type='button'
            onClick={loadMore}
            disabled={loading}
            className='rounded-md border border-border px-3 py-1.5 text-[13px] hover:bg-muted disabled:opacity-60'
          >
            {loading ? 'Loading…' : 'Show more'}
          </button>
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/changelog.xml/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 3600

interface Release {
  id: number
  tag_name: string
  name: string
  body: string
  html_url: string
  published_at: string
  prerelease: boolean
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  try {
    const res = await fetch('https://api.github.com/repos/simstudioai/sim/releases', {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate },
    })
    const releases: Release[] = await res.json()
    const items = (releases || [])
      .filter((r) => !r.prerelease)
      .map(
        (r) => `
        <item>
          <title>${escapeXml(r.name || r.tag_name)}</title>
          <link>${r.html_url}</link>
          <guid isPermaLink="true">${r.html_url}</guid>
          <pubDate>${new Date(r.published_at).toUTCString()}</pubDate>
          <description><![CDATA[${r.body || ''}]]></description>
        </item>
      `
      )
      .join('')

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Sim Changelog</title>
          <link>https://sim.ai/changelog</link>
          <description>Latest changes, fixes and updates in Sim.</description>
          <language>en-us</language>
          ${items}
        </channel>
      </rss>`

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}`,
      },
    })
  } catch {
    return new NextResponse('Service Unavailable', { status: 503 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/app/chat/constants.ts

```typescript
export const CHAT_ERROR_MESSAGES = {
  GENERIC_ERROR: 'Sorry, there was an error processing your message. Please try again.',
  NETWORK_ERROR: 'Unable to connect to the server. Please check your connection and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  AUTH_REQUIRED_PASSWORD: 'This chat requires a password to access.',
  AUTH_REQUIRED_EMAIL: 'Please provide your email to access this chat.',
  CHAT_UNAVAILABLE: 'This chat is currently unavailable. Please try again later.',
  NO_CHAT_TRIGGER:
    'No Chat trigger configured for this workflow. Add a Chat Trigger block to enable chat execution.',
  USAGE_LIMIT_EXCEEDED: 'Usage limit exceeded. Please upgrade your plan to continue using chat.',
} as const

export const CHAT_REQUEST_TIMEOUT_MS = 300000 // 5 minutes (same as in chat.tsx)

export type ChatErrorType = keyof typeof CHAT_ERROR_MESSAGES
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/chat/components/index.ts

```typescript
export { default as EmailAuth } from './auth/email/email-auth'
export { default as PasswordAuth } from './auth/password/password-auth'
export { default as SSOAuth } from './auth/sso/sso-auth'
export { ChatErrorState } from './error-state/error-state'
export { ChatHeader } from './header/header'
export { ChatInput } from './input/input'
export { ChatLoadingState } from './loading-state/loading-state'
export type { ChatMessage } from './message/message'
export { ChatMessageContainer } from './message-container/message-container'
export { VoiceInterface } from './voice-interface/voice-interface'
```

--------------------------------------------------------------------------------

---[FILE: email-auth.tsx]---
Location: sim-main/apps/sim/app/chat/components/auth/email/email-auth.tsx
Signals: React

```typescript
'use client'

import { type KeyboardEvent, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { quickValidateEmail } from '@/lib/messaging/email/validation'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import Nav from '@/app/(landing)/components/nav/nav'

const logger = createLogger('EmailAuth')

interface EmailAuthProps {
  identifier: string
  onAuthSuccess: () => void
  title?: string
  primaryColor?: string
}

const validateEmailField = (emailValue: string): string[] => {
  const errors: string[] = []

  if (!emailValue || !emailValue.trim()) {
    errors.push('Email is required.')
    return errors
  }

  const validation = quickValidateEmail(emailValue.trim().toLowerCase())
  if (!validation.isValid) {
    errors.push(validation.reason || 'Please enter a valid email address.')
  }

  return errors
}

export default function EmailAuth({
  identifier,
  onAuthSuccess,
  title = 'chat',
  primaryColor = 'var(--brand-primary-hover-hex)',
}: EmailAuthProps) {
  // Email auth state
  const [email, setEmail] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [emailErrors, setEmailErrors] = useState<string[]>([])
  const [showEmailValidationError, setShowEmailValidationError] = useState(false)
  const [buttonClass, setButtonClass] = useState('auth-button-gradient')

  // OTP verification state
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(false)

  useEffect(() => {
    // Check if CSS variable has been customized
    const checkCustomBrand = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const brandAccent = computedStyle.getPropertyValue('--brand-accent-hex').trim()

      // Check if the CSS variable exists and is different from the default
      if (brandAccent && brandAccent !== '#6f3dfa') {
        setButtonClass('auth-button-custom')
      } else {
        setButtonClass('auth-button-gradient')
      }
    }

    checkCustomBrand()

    // Also check on window resize or theme changes
    window.addEventListener('resize', checkCustomBrand)
    const observer = new MutationObserver(checkCustomBrand)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    return () => {
      window.removeEventListener('resize', checkCustomBrand)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false)
    }
  }, [countdown, isResendDisabled])

  // Handle email input key down
  const handleEmailKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendOtp()
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)

    // Silently validate but don't show errors until submit
    const errors = validateEmailField(newEmail)
    setEmailErrors(errors)
    setShowEmailValidationError(false)
  }

  // Handle sending OTP
  const handleSendOtp = async () => {
    // Validate email on submit
    const emailValidationErrors = validateEmailField(email)
    setEmailErrors(emailValidationErrors)
    setShowEmailValidationError(emailValidationErrors.length > 0)

    // If there are validation errors, stop submission
    if (emailValidationErrors.length > 0) {
      return
    }

    setAuthError(null)
    setIsSendingOtp(true)

    try {
      const response = await fetch(`/api/chat/${identifier}/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setEmailErrors([errorData.error || 'Failed to send verification code'])
        setShowEmailValidationError(true)
        return
      }

      setShowOtpVerification(true)
    } catch (error) {
      logger.error('Error sending OTP:', error)
      setEmailErrors(['An error occurred while sending the verification code'])
      setShowEmailValidationError(true)
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async (otp?: string) => {
    const codeToVerify = otp || otpValue

    if (!codeToVerify || codeToVerify.length !== 6) {
      return
    }

    setAuthError(null)
    setIsVerifyingOtp(true)

    try {
      const response = await fetch(`/api/chat/${identifier}/otp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email, otp: codeToVerify }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setAuthError(errorData.error || 'Invalid verification code')
        return
      }

      onAuthSuccess()
    } catch (error) {
      logger.error('Error verifying OTP:', error)
      setAuthError('An error occurred during verification')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleResendOtp = async () => {
    setAuthError(null)
    setIsSendingOtp(true)
    setIsResendDisabled(true)
    setCountdown(30)

    try {
      const response = await fetch(`/api/chat/${identifier}/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setAuthError(errorData.error || 'Failed to resend verification code')
        setIsResendDisabled(false)
        setCountdown(0)
        return
      }

      // Don't show success message in error state, just reset OTP
      setOtpValue('')
    } catch (error) {
      logger.error('Error resending OTP:', error)
      setAuthError('An error occurred while resending the verification code')
      setIsResendDisabled(false)
      setCountdown(0)
    } finally {
      setIsSendingOtp(false)
    }
  }

  return (
    <div className='bg-white'>
      <Nav variant='auth' />
      <div className='flex min-h-[calc(100vh-120px)] items-center justify-center px-4'>
        <div className='w-full max-w-[410px]'>
          <div className='flex flex-col items-center justify-center'>
            {/* Header */}
            <div className='space-y-1 text-center'>
              <h1
                className={`${soehne.className} font-medium text-[32px] text-black tracking-tight`}
              >
                {showOtpVerification ? 'Verify Your Email' : 'Email Verification'}
              </h1>
              <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
                {showOtpVerification
                  ? `A verification code has been sent to ${email}`
                  : 'This chat requires email verification'}
              </p>
            </div>

            {/* Form */}
            <div className={`${inter.className} mt-8 w-full`}>
              {!showOtpVerification ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendOtp()
                  }}
                  className='space-y-8'
                >
                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='email'>Email</Label>
                      </div>
                      <Input
                        id='email'
                        name='email'
                        placeholder='Enter your email'
                        required
                        autoCapitalize='none'
                        autoComplete='email'
                        autoCorrect='off'
                        value={email}
                        onChange={handleEmailChange}
                        onKeyDown={handleEmailKeyDown}
                        className={cn(
                          'rounded-[10px] shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                          showEmailValidationError &&
                            emailErrors.length > 0 &&
                            'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                        )}
                        autoFocus
                      />
                      {showEmailValidationError && emailErrors.length > 0 && (
                        <div className='mt-1 space-y-1 text-red-400 text-xs'>
                          {emailErrors.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type='submit'
                    className={`${buttonClass} flex w-full items-center justify-center gap-2 rounded-[10px] border font-medium text-[15px] text-white transition-all duration-200`}
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Sending Code...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </form>
              ) : (
                <div className='space-y-8'>
                  <div className='space-y-6'>
                    <p className='text-center text-muted-foreground text-sm'>
                      Enter the 6-digit code to verify your account. If you don't see it in your
                      inbox, check your spam folder.
                    </p>

                    <div className='flex justify-center'>
                      <InputOTP
                        maxLength={6}
                        value={otpValue}
                        onChange={(value) => {
                          setOtpValue(value)
                          if (value.length === 6) {
                            handleVerifyOtp(value)
                          }
                        }}
                        disabled={isVerifyingOtp}
                        className={cn('gap-2', authError && 'otp-error')}
                      >
                        <InputOTPGroup className='[&>div]:!rounded-[10px] gap-2'>
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={cn(
                                '!rounded-[10px] h-12 w-12 border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                                'border-gray-300 hover:border-gray-400',
                                'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                                authError &&
                                  'border-red-500 focus:border-red-500 focus:ring-red-100'
                              )}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {/* Error message */}
                    {authError && (
                      <div className='mt-1 space-y-1 text-center text-red-400 text-xs'>
                        <p>{authError}</p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleVerifyOtp()}
                    className={`${buttonClass} flex w-full items-center justify-center gap-2 rounded-[10px] border font-medium text-[15px] text-white transition-all duration-200`}
                    disabled={otpValue.length !== 6 || isVerifyingOtp}
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Verify Email'}
                  </Button>

                  <div className='text-center'>
                    <p className='text-muted-foreground text-sm'>
                      Didn't receive a code?{' '}
                      {countdown > 0 ? (
                        <span>
                          Resend in{' '}
                          <span className='font-medium text-foreground'>{countdown}s</span>
                        </span>
                      ) : (
                        <button
                          className='font-medium text-[var(--brand-accent-hex)] underline-offset-4 transition hover:text-[var(--brand-accent-hover-hex)] hover:underline'
                          onClick={handleResendOtp}
                          disabled={isVerifyingOtp || isResendDisabled}
                        >
                          Resend
                        </button>
                      )}
                    </p>
                  </div>

                  <div className='text-center font-light text-[14px]'>
                    <button
                      onClick={() => {
                        setShowOtpVerification(false)
                        setOtpValue('')
                        setAuthError(null)
                      }}
                      className='font-medium text-[var(--brand-accent-hex)] underline-offset-4 transition hover:text-[var(--brand-accent-hover-hex)] hover:underline'
                    >
                      Change email
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: password-auth.tsx]---
Location: sim-main/apps/sim/app/chat/components/auth/password/password-auth.tsx
Signals: React

```typescript
'use client'

import { type KeyboardEvent, useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import Nav from '@/app/(landing)/components/nav/nav'

const logger = createLogger('PasswordAuth')

interface PasswordAuthProps {
  identifier: string
  onAuthSuccess: () => void
  title?: string
  primaryColor?: string
}

export default function PasswordAuth({
  identifier,
  onAuthSuccess,
  title = 'chat',
  primaryColor = 'var(--brand-primary-hover-hex)',
}: PasswordAuthProps) {
  // Password auth state
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showValidationError, setShowValidationError] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [buttonClass, setButtonClass] = useState('auth-button-gradient')

  useEffect(() => {
    // Check if CSS variable has been customized
    const checkCustomBrand = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const brandAccent = computedStyle.getPropertyValue('--brand-accent-hex').trim()

      // Check if the CSS variable exists and is different from the default
      if (brandAccent && brandAccent !== '#6f3dfa') {
        setButtonClass('auth-button-custom')
      } else {
        setButtonClass('auth-button-gradient')
      }
    }

    checkCustomBrand()

    // Also check on window resize or theme changes
    window.addEventListener('resize', checkCustomBrand)
    const observer = new MutationObserver(checkCustomBrand)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    return () => {
      window.removeEventListener('resize', checkCustomBrand)
      observer.disconnect()
    }
  }, [])

  // Handle keyboard input for auth forms
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAuthenticate()
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setShowValidationError(false)
    setPasswordErrors([])
  }

  // Handle authentication
  const handleAuthenticate = async () => {
    if (!password.trim()) {
      setPasswordErrors(['Password is required'])
      setShowValidationError(true)
      return
    }

    setAuthError(null)
    setIsAuthenticating(true)

    try {
      const payload = { password }

      const response = await fetch(`/api/chat/${identifier}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setPasswordErrors([errorData.error || 'Invalid password. Please try again.'])
        setShowValidationError(true)
        return
      }

      // Authentication successful, notify parent
      onAuthSuccess()

      // Reset auth state
      setPassword('')
    } catch (error) {
      logger.error('Authentication error:', error)
      setPasswordErrors(['An error occurred during authentication'])
      setShowValidationError(true)
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className='bg-white'>
      <Nav variant='auth' />
      <div className='flex min-h-[calc(100vh-120px)] items-center justify-center px-4'>
        <div className='w-full max-w-[410px]'>
          <div className='flex flex-col items-center justify-center'>
            {/* Header */}
            <div className='space-y-1 text-center'>
              <h1
                className={`${soehne.className} font-medium text-[32px] text-black tracking-tight`}
              >
                Password Required
              </h1>
              <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
                This chat is password-protected
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAuthenticate()
              }}
              className={`${inter.className} mt-8 w-full space-y-8`}
            >
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='password'>Password</Label>
                  </div>
                  <div className='relative'>
                    <Input
                      id='password'
                      name='password'
                      required
                      type={showPassword ? 'text' : 'password'}
                      autoCapitalize='none'
                      autoComplete='new-password'
                      autoCorrect='off'
                      placeholder='Enter password'
                      value={password}
                      onChange={handlePasswordChange}
                      onKeyDown={handleKeyDown}
                      className={cn(
                        'rounded-[10px] pr-10 shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                        showValidationError &&
                          passwordErrors.length > 0 &&
                          'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                      )}
                      autoFocus
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='-translate-y-1/2 absolute top-1/2 right-3 text-gray-500 transition hover:text-gray-700'
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {showValidationError && passwordErrors.length > 0 && (
                    <div className='mt-1 space-y-1 text-red-400 text-xs'>
                      {passwordErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type='submit'
                className={`${buttonClass} flex w-full items-center justify-center gap-2 rounded-[10px] border font-medium text-[15px] text-white transition-all duration-200`}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? 'Authenticating...' : 'Continue'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````

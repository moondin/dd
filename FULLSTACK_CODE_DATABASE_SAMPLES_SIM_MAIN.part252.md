---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 252
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 252 of 933)

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

---[FILE: use-verification.ts]---
Location: sim-main/apps/sim/app/(auth)/verify/use-verification.ts
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { client, useSession } from '@/lib/auth/auth-client'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useVerification')

interface UseVerificationParams {
  hasEmailService: boolean
  isProduction: boolean
  isEmailVerificationEnabled: boolean
}

interface UseVerificationReturn {
  otp: string
  email: string
  isLoading: boolean
  isVerified: boolean
  isInvalidOtp: boolean
  errorMessage: string
  isOtpComplete: boolean
  hasEmailService: boolean
  isProduction: boolean
  isEmailVerificationEnabled: boolean
  verifyCode: () => Promise<void>
  resendCode: () => void
  handleOtpChange: (value: string) => void
}

export function useVerification({
  hasEmailService,
  isProduction,
  isEmailVerificationEnabled,
}: UseVerificationParams): UseVerificationReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refetch: refetchSession } = useSession()
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSendingInitialOtp, setIsSendingInitialOtp] = useState(false)
  const [isInvalidOtp, setIsInvalidOtp] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [isInviteFlow, setIsInviteFlow] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('verificationEmail')
      if (storedEmail) {
        setEmail(storedEmail)
      }

      const storedRedirectUrl = sessionStorage.getItem('inviteRedirectUrl')
      if (storedRedirectUrl) {
        setRedirectUrl(storedRedirectUrl)
      }

      const storedIsInviteFlow = sessionStorage.getItem('isInviteFlow')
      if (storedIsInviteFlow === 'true') {
        setIsInviteFlow(true)
      }
    }

    const redirectParam = searchParams.get('redirectAfter')
    if (redirectParam) {
      setRedirectUrl(redirectParam)
    }

    const inviteFlowParam = searchParams.get('invite_flow')
    if (inviteFlowParam === 'true') {
      setIsInviteFlow(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (email && !isSendingInitialOtp && hasEmailService) {
      setIsSendingInitialOtp(true)
    }
  }, [email, isSendingInitialOtp, hasEmailService])

  const isOtpComplete = otp.length === 6

  async function verifyCode() {
    if (!isOtpComplete || !email) return

    setIsLoading(true)
    setIsInvalidOtp(false)
    setErrorMessage('')

    try {
      const normalizedEmail = email.trim().toLowerCase()
      const response = await client.signIn.emailOtp({
        email: normalizedEmail,
        otp,
      })

      if (response && !response.error) {
        setIsVerified(true)

        try {
          await refetchSession()
        } catch (e) {
          logger.warn('Failed to refetch session after verification', e)
        }

        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('verificationEmail')

          if (isInviteFlow) {
            sessionStorage.removeItem('inviteRedirectUrl')
            sessionStorage.removeItem('isInviteFlow')
          }
        }

        setTimeout(() => {
          if (isInviteFlow && redirectUrl) {
            window.location.href = redirectUrl
          } else {
            window.location.href = '/workspace'
          }
        }, 1000)
      } else {
        logger.info('Setting invalid OTP state - API error response')
        const message = 'Invalid verification code. Please check and try again.'
        setIsInvalidOtp(true)
        setErrorMessage(message)
        logger.info('Error state after API error:', {
          isInvalidOtp: true,
          errorMessage: message,
        })
        setOtp('')
      }
    } catch (error: any) {
      let message = 'Verification failed. Please check your code and try again.'

      if (error.message?.includes('expired')) {
        message = 'The verification code has expired. Please request a new one.'
      } else if (error.message?.includes('invalid')) {
        logger.info('Setting invalid OTP state - caught error')
        message = 'Invalid verification code. Please check and try again.'
      } else if (error.message?.includes('attempts')) {
        message = 'Too many failed attempts. Please request a new code.'
      }

      setIsInvalidOtp(true)
      setErrorMessage(message)
      logger.info('Error state after caught error:', {
        isInvalidOtp: true,
        errorMessage: message,
      })

      setOtp('')
    } finally {
      setIsLoading(false)
    }
  }

  function resendCode() {
    if (!email || !hasEmailService || !isEmailVerificationEnabled) return

    setIsLoading(true)
    setErrorMessage('')

    const normalizedEmail = email.trim().toLowerCase()
    client.emailOtp
      .sendVerificationOtp({
        email: normalizedEmail,
        type: 'sign-in',
      })
      .then(() => {})
      .catch(() => {
        setErrorMessage('Failed to resend verification code. Please try again later.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleOtpChange(value: string) {
    if (value.length === 6) {
      setIsInvalidOtp(false)
      setErrorMessage('')
    }
    setOtp(value)
  }

  useEffect(() => {
    if (otp.length === 6 && email && !isLoading && !isVerified) {
      const timeoutId = setTimeout(() => {
        verifyCode()
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [otp, email, isLoading, isVerified])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!isEmailVerificationEnabled) {
        setIsVerified(true)

        const handleRedirect = async () => {
          try {
            await refetchSession()
          } catch (error) {
            logger.warn('Failed to refetch session during verification skip:', error)
          }

          if (isInviteFlow && redirectUrl) {
            window.location.href = redirectUrl
          } else {
            router.push('/workspace')
          }
        }

        handleRedirect()
      }
    }
  }, [isEmailVerificationEnabled, router, isInviteFlow, redirectUrl])

  return {
    otp,
    email,
    isLoading,
    isVerified,
    isInvalidOtp,
    errorMessage,
    isOtpComplete,
    hasEmailService,
    isProduction,
    isEmailVerificationEnabled,
    verifyCode,
    resendCode,
    handleOtpChange,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: verify-content.tsx]---
Location: sim-main/apps/sim/app/(auth)/verify/verify-content.tsx
Signals: React, Next.js

```typescript
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { cn } from '@/lib/core/utils/cn'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import { useVerification } from '@/app/(auth)/verify/use-verification'

interface VerifyContentProps {
  hasEmailService: boolean
  isProduction: boolean
  isEmailVerificationEnabled: boolean
}

function VerificationForm({
  hasEmailService,
  isProduction,
  isEmailVerificationEnabled,
}: {
  hasEmailService: boolean
  isProduction: boolean
  isEmailVerificationEnabled: boolean
}) {
  const {
    otp,
    email,
    isLoading,
    isVerified,
    isInvalidOtp,
    errorMessage,
    isOtpComplete,
    verifyCode,
    resendCode,
    handleOtpChange,
  } = useVerification({ hasEmailService, isProduction, isEmailVerificationEnabled })

  const [countdown, setCountdown] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false)
    }
  }, [countdown, isResendDisabled])

  const router = useRouter()

  const handleResend = () => {
    resendCode()
    setIsResendDisabled(true)
    setCountdown(30)
  }

  const [buttonClass, setButtonClass] = useState('auth-button-gradient')

  useEffect(() => {
    const checkCustomBrand = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const brandAccent = computedStyle.getPropertyValue('--brand-accent-hex').trim()

      if (brandAccent && brandAccent !== '#6f3dfa') {
        setButtonClass('auth-button-custom')
      } else {
        setButtonClass('auth-button-gradient')
      }
    }

    checkCustomBrand()

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

  return (
    <>
      <div className='space-y-1 text-center'>
        <h1 className={`${soehne.className} font-medium text-[32px] text-black tracking-tight`}>
          {isVerified ? 'Email Verified!' : 'Verify Your Email'}
        </h1>
        <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
          {isVerified
            ? 'Your email has been verified. Redirecting to dashboard...'
            : !isEmailVerificationEnabled
              ? 'Email verification is disabled. Redirecting to dashboard...'
              : hasEmailService
                ? `A verification code has been sent to ${email || 'your email'}`
                : !isProduction
                  ? 'Development mode: Check your console logs for the verification code'
                  : 'Error: Email verification is enabled but no email service is configured'}
        </p>
      </div>

      {!isVerified && isEmailVerificationEnabled && (
        <div className={`${inter.className} mt-8 space-y-8`}>
          <div className='space-y-6'>
            <p className='text-center text-muted-foreground text-sm'>
              Enter the 6-digit code to verify your account.
              {hasEmailService ? " If you don't see it in your inbox, check your spam folder." : ''}
            </p>

            <div className='flex justify-center'>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                disabled={isLoading}
                className={cn('gap-2', isInvalidOtp && 'otp-error')}
              >
                <InputOTPGroup className='[&>div]:!rounded-[10px] gap-2'>
                  <InputOTPSlot
                    index={0}
                    className={cn(
                      '!rounded-[10px] h-12 w-12 border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={1}
                    className={cn(
                      '!rounded-[10px] h-12 w-12 border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={2}
                    className={cn(
                      '!rounded-[10px] h-12 w-12 border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={3}
                    className={cn(
                      '!rounded-[10px] h-12 w-12 border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={4}
                    className={cn(
                      '!rounded-[10px] h-12 w-12 border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={5}
                    className={cn(
                      '!rounded-[10px] h-12 w-12 border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className='mt-1 space-y-1 text-center text-red-400 text-xs'>
                <p>{errorMessage}</p>
              </div>
            )}
          </div>

          <Button
            onClick={verifyCode}
            className={`${buttonClass} flex w-full items-center justify-center gap-2 rounded-[10px] border font-medium text-[15px] text-white transition-all duration-200`}
            disabled={!isOtpComplete || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Button>

          {hasEmailService && (
            <div className='text-center'>
              <p className='text-muted-foreground text-sm'>
                Didn't receive a code?{' '}
                {countdown > 0 ? (
                  <span>
                    Resend in <span className='font-medium text-foreground'>{countdown}s</span>
                  </span>
                ) : (
                  <button
                    className='font-medium text-[var(--brand-accent-hex)] underline-offset-4 transition hover:text-[var(--brand-accent-hover-hex)] hover:underline'
                    onClick={handleResend}
                    disabled={isLoading || isResendDisabled}
                  >
                    Resend
                  </button>
                )}
              </p>
            </div>
          )}

          <div className='text-center font-light text-[14px]'>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('verificationEmail')
                  sessionStorage.removeItem('inviteRedirectUrl')
                  sessionStorage.removeItem('isInviteFlow')
                }
                router.push('/signup')
              }}
              className='font-medium text-[var(--brand-accent-hex)] underline-offset-4 transition hover:text-[var(--brand-accent-hover-hex)] hover:underline'
            >
              Back to signup
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function VerificationFormFallback() {
  return (
    <div className='text-center'>
      <div className='animate-pulse'>
        <div className='mx-auto mb-4 h-8 w-48 rounded bg-gray-200' />
        <div className='mx-auto h-4 w-64 rounded bg-gray-200' />
      </div>
    </div>
  )
}

export function VerifyContent({
  hasEmailService,
  isProduction,
  isEmailVerificationEnabled,
}: VerifyContentProps) {
  return (
    <Suspense fallback={<VerificationFormFallback />}>
      <VerificationForm
        hasEmailService={hasEmailService}
        isProduction={isProduction}
        isEmailVerificationEnabled={isEmailVerificationEnabled}
      />
    </Suspense>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: landing.tsx]---
Location: sim-main/apps/sim/app/(landing)/landing.tsx
Signals: React, Next.js

```typescript
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Background, Footer, Nav, StructuredData } from '@/app/(landing)/components'

const Hero = dynamic(() => import('@/app/(landing)/components/hero/hero'), {
  loading: () => <div className='h-[600px] animate-pulse bg-gray-50' />,
})

const LandingPricing = dynamic(
  () => import('@/app/(landing)/components/landing-pricing/landing-pricing'),
  {
    loading: () => <div className='h-[400px] animate-pulse bg-gray-50' />,
  }
)

const Integrations = dynamic(() => import('@/app/(landing)/components/integrations/integrations'), {
  loading: () => <div className='h-[300px] animate-pulse bg-gray-50' />,
})

const Testimonials = dynamic(() => import('@/app/(landing)/components/testimonials/testimonials'), {
  loading: () => <div className='h-[150px] animate-pulse bg-gray-50' />,
})

export default function Landing() {
  return (
    <>
      <StructuredData />
      <Background>
        <header>
          <Nav />
        </header>
        <main className='relative'>
          <Suspense
            fallback={
              <div
                className='h-[600px] animate-pulse bg-gray-50'
                aria-label='Loading hero section'
              />
            }
          >
            <Hero />
          </Suspense>
          <Suspense
            fallback={
              <div
                className='h-[400px] animate-pulse bg-gray-50'
                aria-label='Loading pricing section'
              />
            }
          >
            <LandingPricing />
          </Suspense>
          <Suspense
            fallback={
              <div
                className='h-[300px] animate-pulse bg-gray-50'
                aria-label='Loading integrations section'
              />
            }
          >
            <Integrations />
          </Suspense>
          <Suspense
            fallback={
              <div
                className='h-[150px] animate-pulse bg-gray-50'
                aria-label='Loading testimonials section'
              />
            }
          >
            <Testimonials />
          </Suspense>
        </main>
        <Footer />
      </Background>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/(landing)/layout.tsx
Signals: Next.js

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://sim.ai'),
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

--------------------------------------------------------------------------------

---[FILE: github.ts]---
Location: sim-main/apps/sim/app/(landing)/actions/github.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const DEFAULT_STARS = '19.4k'

const logger = createLogger('GitHubStars')

export async function getFormattedGitHubStars(): Promise<string> {
  try {
    const response = await fetch('/api/stars', {
      headers: {
        'Cache-Control': 'max-age=3600', // Cache for 1 hour
      },
    })

    if (!response.ok) {
      logger.warn('Failed to fetch GitHub stars from API')
      return DEFAULT_STARS
    }

    const data = await response.json()
    return data.stars || DEFAULT_STARS
  } catch (error) {
    logger.warn('Error fetching GitHub stars:', error)
    return DEFAULT_STARS
  }
}
```

--------------------------------------------------------------------------------

````

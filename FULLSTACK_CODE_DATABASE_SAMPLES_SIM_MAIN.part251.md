---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 251
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 251 of 933)

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
Location: sim-main/apps/sim/app/(auth)/signup/page.tsx

```typescript
import { isRegistrationDisabled } from '@/lib/core/config/feature-flags'
import { getOAuthProviderStatus } from '@/app/(auth)/components/oauth-provider-checker'
import SignupForm from '@/app/(auth)/signup/signup-form'

export const dynamic = 'force-dynamic'

export default async function SignupPage() {
  if (isRegistrationDisabled) {
    return <div>Registration is disabled, please contact your admin.</div>
  }

  const { githubAvailable, googleAvailable, isProduction } = await getOAuthProviderStatus()

  return (
    <SignupForm
      githubAvailable={githubAvailable}
      googleAvailable={googleAvailable}
      isProduction={isProduction}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: signup-form.tsx]---
Location: sim-main/apps/sim/app/(auth)/signup/signup-form.tsx
Signals: React, Next.js

```typescript
'use client'

import { Suspense, useEffect, useState } from 'react'
import { ArrowRight, ChevronRight, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { client, useSession } from '@/lib/auth/auth-client'
import { getEnv, isFalsy, isTruthy } from '@/lib/core/config/env'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { quickValidateEmail } from '@/lib/messaging/email/validation'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import { SocialLoginButtons } from '@/app/(auth)/components/social-login-buttons'
import { SSOLoginButton } from '@/app/(auth)/components/sso-login-button'

const logger = createLogger('SignupForm')

const PASSWORD_VALIDATIONS = {
  minLength: { regex: /.{8,}/, message: 'Password must be at least 8 characters long.' },
  uppercase: {
    regex: /(?=.*?[A-Z])/,
    message: 'Password must include at least one uppercase letter.',
  },
  lowercase: {
    regex: /(?=.*?[a-z])/,
    message: 'Password must include at least one lowercase letter.',
  },
  number: { regex: /(?=.*?[0-9])/, message: 'Password must include at least one number.' },
  special: {
    regex: /(?=.*?[#?!@$%^&*-])/,
    message: 'Password must include at least one special character.',
  },
}

const NAME_VALIDATIONS = {
  required: {
    test: (value: string) => Boolean(value && typeof value === 'string'),
    message: 'Name is required.',
  },
  notEmpty: {
    test: (value: string) => value.trim().length > 0,
    message: 'Name cannot be empty.',
  },
  validCharacters: {
    regex: /^[\p{L}\s\-']+$/u,
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes.',
  },
  noConsecutiveSpaces: {
    regex: /^(?!.*\s\s).*$/,
    message: 'Name cannot contain consecutive spaces.',
  },
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

function SignupFormContent({
  githubAvailable,
  googleAvailable,
  isProduction,
}: {
  githubAvailable: boolean
  googleAvailable: boolean
  isProduction: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refetch: refetchSession } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [showValidationError, setShowValidationError] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailErrors, setEmailErrors] = useState<string[]>([])
  const [showEmailValidationError, setShowEmailValidationError] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('')
  const [isInviteFlow, setIsInviteFlow] = useState(false)
  const [buttonClass, setButtonClass] = useState('auth-button-gradient')
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const [name, setName] = useState('')
  const [nameErrors, setNameErrors] = useState<string[]>([])
  const [showNameValidationError, setShowNameValidationError] = useState(false)

  useEffect(() => {
    setMounted(true)
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }

    const redirectParam = searchParams.get('redirect')
    if (redirectParam) {
      setRedirectUrl(redirectParam)

      if (redirectParam.startsWith('/invite/')) {
        setIsInviteFlow(true)
      }
    }

    const inviteFlowParam = searchParams.get('invite_flow')
    if (inviteFlowParam === 'true') {
      setIsInviteFlow(true)
    }

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
  }, [searchParams])

  const validatePassword = (passwordValue: string): string[] => {
    const errors: string[] = []

    if (!PASSWORD_VALIDATIONS.minLength.regex.test(passwordValue)) {
      errors.push(PASSWORD_VALIDATIONS.minLength.message)
    }

    if (!PASSWORD_VALIDATIONS.uppercase.regex.test(passwordValue)) {
      errors.push(PASSWORD_VALIDATIONS.uppercase.message)
    }

    if (!PASSWORD_VALIDATIONS.lowercase.regex.test(passwordValue)) {
      errors.push(PASSWORD_VALIDATIONS.lowercase.message)
    }

    if (!PASSWORD_VALIDATIONS.number.regex.test(passwordValue)) {
      errors.push(PASSWORD_VALIDATIONS.number.message)
    }

    if (!PASSWORD_VALIDATIONS.special.regex.test(passwordValue)) {
      errors.push(PASSWORD_VALIDATIONS.special.message)
    }

    return errors
  }

  const validateName = (nameValue: string): string[] => {
    const errors: string[] = []

    if (!NAME_VALIDATIONS.required.test(nameValue)) {
      errors.push(NAME_VALIDATIONS.required.message)
      return errors
    }

    if (!NAME_VALIDATIONS.notEmpty.test(nameValue)) {
      errors.push(NAME_VALIDATIONS.notEmpty.message)
      return errors
    }

    if (!NAME_VALIDATIONS.validCharacters.regex.test(nameValue.trim())) {
      errors.push(NAME_VALIDATIONS.validCharacters.message)
    }

    if (!NAME_VALIDATIONS.noConsecutiveSpaces.regex.test(nameValue)) {
      errors.push(NAME_VALIDATIONS.noConsecutiveSpaces.message)
    }

    return errors
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    const errors = validatePassword(newPassword)
    setPasswordErrors(errors)
    setShowValidationError(false)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    setName(rawValue)

    const errors = validateName(rawValue)
    setNameErrors(errors)
    setShowNameValidationError(false)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)

    const errors = validateEmailField(newEmail)
    setEmailErrors(errors)
    setShowEmailValidationError(false)

    if (emailError) {
      setEmailError('')
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const emailValueRaw = formData.get('email') as string
    const emailValue = emailValueRaw.trim().toLowerCase()
    const passwordValue = formData.get('password') as string
    const nameValue = formData.get('name') as string

    const trimmedName = nameValue.trim()

    const nameValidationErrors = validateName(trimmedName)
    setNameErrors(nameValidationErrors)
    setShowNameValidationError(nameValidationErrors.length > 0)

    const emailValidationErrors = validateEmailField(emailValue)
    setEmailErrors(emailValidationErrors)
    setShowEmailValidationError(emailValidationErrors.length > 0)

    const errors = validatePassword(passwordValue)
    setPasswordErrors(errors)

    setShowValidationError(errors.length > 0)

    try {
      if (
        nameValidationErrors.length > 0 ||
        emailValidationErrors.length > 0 ||
        errors.length > 0
      ) {
        if (nameValidationErrors.length > 0) {
          setNameErrors([nameValidationErrors[0]])
          setShowNameValidationError(true)
        }
        if (emailValidationErrors.length > 0) {
          setEmailErrors([emailValidationErrors[0]])
          setShowEmailValidationError(true)
        }
        if (errors.length > 0) {
          setPasswordErrors([errors[0]])
          setShowValidationError(true)
        }
        setIsLoading(false)
        return
      }

      if (trimmedName.length > 100) {
        setNameErrors(['Name will be truncated to 100 characters. Please shorten your name.'])
        setShowNameValidationError(true)
        setIsLoading(false)
        return
      }

      const sanitizedName = trimmedName

      const response = await client.signUp.email(
        {
          email: emailValue,
          password: passwordValue,
          name: sanitizedName,
        },
        {
          onError: (ctx) => {
            logger.error('Signup error:', ctx.error)
            const errorMessage: string[] = ['Failed to create account']

            if (ctx.error.code?.includes('USER_ALREADY_EXISTS')) {
              errorMessage.push(
                'An account with this email already exists. Please sign in instead.'
              )
              setEmailError(errorMessage[0])
            } else if (
              ctx.error.code?.includes('BAD_REQUEST') ||
              ctx.error.message?.includes('Email and password sign up is not enabled')
            ) {
              errorMessage.push('Email signup is currently disabled.')
              setEmailError(errorMessage[0])
            } else if (ctx.error.code?.includes('INVALID_EMAIL')) {
              errorMessage.push('Please enter a valid email address.')
              setEmailError(errorMessage[0])
            } else if (ctx.error.code?.includes('PASSWORD_TOO_SHORT')) {
              errorMessage.push('Password must be at least 8 characters long.')
              setPasswordErrors(errorMessage)
              setShowValidationError(true)
            } else if (ctx.error.code?.includes('PASSWORD_TOO_LONG')) {
              errorMessage.push('Password must be less than 128 characters long.')
              setPasswordErrors(errorMessage)
              setShowValidationError(true)
            } else if (ctx.error.code?.includes('network')) {
              errorMessage.push('Network error. Please check your connection and try again.')
              setPasswordErrors(errorMessage)
              setShowValidationError(true)
            } else if (ctx.error.code?.includes('rate limit')) {
              errorMessage.push('Too many requests. Please wait a moment before trying again.')
              setPasswordErrors(errorMessage)
              setShowValidationError(true)
            } else {
              setPasswordErrors(errorMessage)
              setShowValidationError(true)
            }
          },
        }
      )

      if (!response || response.error) {
        setIsLoading(false)
        return
      }

      try {
        await refetchSession()
        logger.info('Session refreshed after successful signup')
      } catch (sessionError) {
        logger.error('Failed to refresh session after signup:', sessionError)
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('verificationEmail', emailValue)
        if (isInviteFlow && redirectUrl) {
          sessionStorage.setItem('inviteRedirectUrl', redirectUrl)
          sessionStorage.setItem('isInviteFlow', 'true')
        }
      }

      try {
        await client.emailOtp.sendVerificationOtp({
          email: emailValue,
          type: 'sign-in',
        })
      } catch (otpErr) {
        logger.warn('Failed to send sign-in OTP after signup; user can press Resend', otpErr)
      }

      router.push('/verify?fromSignup=true')
    } catch (error) {
      logger.error('Signup error:', error)
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='space-y-1 text-center'>
        <h1 className={`${soehne.className} font-medium text-[32px] text-black tracking-tight`}>
          Create an account
        </h1>
        <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
          Create an account or log in
        </p>
      </div>

      {/* SSO Login Button (primary top-only when it is the only method) */}
      {(() => {
        const ssoEnabled = isTruthy(getEnv('NEXT_PUBLIC_SSO_ENABLED'))
        const emailEnabled = !isFalsy(getEnv('NEXT_PUBLIC_EMAIL_PASSWORD_SIGNUP_ENABLED'))
        const hasSocial = githubAvailable || googleAvailable
        const hasOnlySSO = ssoEnabled && !emailEnabled && !hasSocial
        return hasOnlySSO
      })() && (
        <div className={`${inter.className} mt-8`}>
          <SSOLoginButton
            callbackURL={redirectUrl || '/workspace'}
            variant='primary'
            primaryClassName={buttonClass}
          />
        </div>
      )}

      {/* Email/Password Form - show unless explicitly disabled */}
      {!isFalsy(getEnv('NEXT_PUBLIC_EMAIL_PASSWORD_SIGNUP_ENABLED')) && (
        <form onSubmit={onSubmit} className={`${inter.className} mt-8 space-y-8`}>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='name'>Full name</Label>
              </div>
              <Input
                id='name'
                name='name'
                placeholder='Enter your name'
                type='text'
                autoCapitalize='words'
                autoComplete='name'
                title='Name can only contain letters, spaces, hyphens, and apostrophes'
                value={name}
                onChange={handleNameChange}
                className={cn(
                  'rounded-[10px] shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                  showNameValidationError &&
                    nameErrors.length > 0 &&
                    'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                )}
              />
              {showNameValidationError && nameErrors.length > 0 && (
                <div className='mt-1 space-y-1 text-red-400 text-xs'>
                  {nameErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='email'>Email</Label>
              </div>
              <Input
                id='email'
                name='email'
                placeholder='Enter your email'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
                value={email}
                onChange={handleEmailChange}
                className={cn(
                  'rounded-[10px] shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                  (emailError || (showEmailValidationError && emailErrors.length > 0)) &&
                    'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                )}
              />
              {showEmailValidationError && emailErrors.length > 0 && (
                <div className='mt-1 space-y-1 text-red-400 text-xs'>
                  {emailErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
              {emailError && !showEmailValidationError && (
                <div className='mt-1 text-red-400 text-xs'>
                  <p>{emailError}</p>
                </div>
              )}
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
              </div>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoCapitalize='none'
                  autoComplete='new-password'
                  placeholder='Enter your password'
                  autoCorrect='off'
                  value={password}
                  onChange={handlePasswordChange}
                  className={cn(
                    'rounded-[10px] pr-10 shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                    showValidationError &&
                      passwordErrors.length > 0 &&
                      'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                  )}
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
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className='group inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#6F3DFA] bg-gradient-to-b from-[#8357FF] to-[#6F3DFA] py-[6px] pr-[10px] pl-[12px] text-[15px] text-white shadow-[inset_0_2px_4px_0_#9B77FF] transition-all'
            disabled={isLoading}
          >
            <span className='flex items-center gap-1'>
              {isLoading ? 'Creating account' : 'Create account'}
              <span className='inline-flex transition-transform duration-200 group-hover:translate-x-0.5'>
                {isButtonHovered ? (
                  <ArrowRight className='h-4 w-4' aria-hidden='true' />
                ) : (
                  <ChevronRight className='h-4 w-4' aria-hidden='true' />
                )}
              </span>
            </span>
          </Button>
        </form>
      )}

      {/* Divider - show when we have multiple auth methods */}
      {(() => {
        const ssoEnabled = isTruthy(getEnv('NEXT_PUBLIC_SSO_ENABLED'))
        const emailEnabled = !isFalsy(getEnv('NEXT_PUBLIC_EMAIL_PASSWORD_SIGNUP_ENABLED'))
        const hasSocial = githubAvailable || googleAvailable
        const hasOnlySSO = ssoEnabled && !emailEnabled && !hasSocial
        const showBottomSection = hasSocial || (ssoEnabled && !hasOnlySSO)
        const showDivider = (emailEnabled || hasOnlySSO) && showBottomSection
        return showDivider
      })() && (
        <div className={`${inter.className} relative my-6 font-light`}>
          <div className='absolute inset-0 flex items-center'>
            <div className='auth-divider w-full border-t' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-4 font-[340] text-muted-foreground'>Or continue with</span>
          </div>
        </div>
      )}

      {(() => {
        const ssoEnabled = isTruthy(getEnv('NEXT_PUBLIC_SSO_ENABLED'))
        const emailEnabled = !isFalsy(getEnv('NEXT_PUBLIC_EMAIL_PASSWORD_SIGNUP_ENABLED'))
        const hasSocial = githubAvailable || googleAvailable
        const hasOnlySSO = ssoEnabled && !emailEnabled && !hasSocial
        const showBottomSection = hasSocial || (ssoEnabled && !hasOnlySSO)
        return showBottomSection
      })() && (
        <div
          className={cn(
            inter.className,
            isFalsy(getEnv('NEXT_PUBLIC_EMAIL_PASSWORD_SIGNUP_ENABLED')) ? 'mt-8' : undefined
          )}
        >
          <SocialLoginButtons
            githubAvailable={githubAvailable}
            googleAvailable={googleAvailable}
            callbackURL={redirectUrl || '/workspace'}
            isProduction={isProduction}
          >
            {isTruthy(getEnv('NEXT_PUBLIC_SSO_ENABLED')) && (
              <SSOLoginButton
                callbackURL={redirectUrl || '/workspace'}
                variant='outline'
                primaryClassName={buttonClass}
              />
            )}
          </SocialLoginButtons>
        </div>
      )}

      <div className={`${inter.className} pt-6 text-center font-light text-[14px]`}>
        <span className='font-normal'>Already have an account? </span>
        <Link
          href={isInviteFlow ? `/login?invite_flow=true&callbackUrl=${redirectUrl}` : '/login'}
          className='font-medium text-[var(--brand-accent-hex)] underline-offset-4 transition hover:text-[var(--brand-accent-hover-hex)] hover:underline'
        >
          Sign in
        </Link>
      </div>

      <div
        className={`${inter.className} auth-text-muted absolute right-0 bottom-0 left-0 px-8 pb-8 text-center font-[340] text-[13px] leading-relaxed sm:px-8 md:px-[44px]`}
      >
        By creating an account, you agree to our{' '}
        <Link
          href='/terms'
          target='_blank'
          rel='noopener noreferrer'
          className='auth-link underline-offset-4 transition hover:underline'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          target='_blank'
          rel='noopener noreferrer'
          className='auth-link underline-offset-4 transition hover:underline'
        >
          Privacy Policy
        </Link>
      </div>
    </>
  )
}

export default function SignupPage({
  githubAvailable,
  googleAvailable,
  isProduction,
}: {
  githubAvailable: boolean
  googleAvailable: boolean
  isProduction: boolean
}) {
  return (
    <Suspense
      fallback={<div className='flex h-screen items-center justify-center'>Loading...</div>}
    >
      <SignupFormContent
        githubAvailable={githubAvailable}
        googleAvailable={googleAvailable}
        isProduction={isProduction}
      />
    </Suspense>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/(auth)/sso/page.tsx
Signals: Next.js

```typescript
import { redirect } from 'next/navigation'
import { getEnv, isTruthy } from '@/lib/core/config/env'
import SSOForm from '@/app/(auth)/sso/sso-form'

export const dynamic = 'force-dynamic'

export default async function SSOPage() {
  if (!isTruthy(getEnv('NEXT_PUBLIC_SSO_ENABLED'))) {
    redirect('/login')
  }

  return <SSOForm />
}
```

--------------------------------------------------------------------------------

---[FILE: sso-form.tsx]---
Location: sim-main/apps/sim/app/(auth)/sso/sso-form.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { client } from '@/lib/auth/auth-client'
import { env, isFalsy } from '@/lib/core/config/env'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { quickValidateEmail } from '@/lib/messaging/email/validation'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'

const logger = createLogger('SSOForm')

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

const validateCallbackUrl = (url: string): boolean => {
  try {
    if (url.startsWith('/')) {
      return true
    }

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
    if (url.startsWith(currentOrigin)) {
      return true
    }

    return false
  } catch (error) {
    logger.error('Error validating callback URL:', { error, url })
    return false
  }
}

export default function SSOForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailErrors, setEmailErrors] = useState<string[]>([])
  const [showEmailValidationError, setShowEmailValidationError] = useState(false)
  const [buttonClass, setButtonClass] = useState('auth-button-gradient')
  const [callbackUrl, setCallbackUrl] = useState('/workspace')

  useEffect(() => {
    if (searchParams) {
      const callback = searchParams.get('callbackUrl')
      if (callback) {
        if (validateCallbackUrl(callback)) {
          setCallbackUrl(callback)
        } else {
          logger.warn('Invalid callback URL detected and blocked:', { url: callback })
        }
      }

      // Pre-fill email if provided in URL (e.g., from deployed chat SSO)
      const emailParam = searchParams.get('email')
      if (emailParam) {
        setEmail(emailParam)
      }

      // Check for SSO error from redirect
      const error = searchParams.get('error')
      if (error) {
        const errorMessages: Record<string, string> = {
          account_not_found:
            'No account found. Please contact your administrator to set up SSO access.',
          sso_failed: 'SSO authentication failed. Please try again.',
          invalid_provider: 'SSO provider not configured correctly.',
        }
        setEmailErrors([errorMessages[error] || 'SSO authentication failed. Please try again.'])
        setShowEmailValidationError(true)
      }
    }

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
  }, [searchParams])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)

    const errors = validateEmailField(newEmail)
    setEmailErrors(errors)
    setShowEmailValidationError(false)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const emailRaw = formData.get('email') as string
    const emailValue = emailRaw.trim().toLowerCase()

    const emailValidationErrors = validateEmailField(emailValue)
    setEmailErrors(emailValidationErrors)
    setShowEmailValidationError(emailValidationErrors.length > 0)

    if (emailValidationErrors.length > 0) {
      setIsLoading(false)
      return
    }

    try {
      const safeCallbackUrl = validateCallbackUrl(callbackUrl) ? callbackUrl : '/workspace'

      await client.signIn.sso({
        email: emailValue,
        callbackURL: safeCallbackUrl,
        errorCallbackURL: `/sso?error=sso_failed&callbackUrl=${encodeURIComponent(safeCallbackUrl)}`,
      })
    } catch (err) {
      logger.error('SSO sign-in failed', { error: err, email: emailValue })

      let errorMessage = 'SSO sign-in failed. Please try again.'
      if (err instanceof Error) {
        if (err.message.includes('NO_PROVIDER_FOUND')) {
          errorMessage = 'SSO provider not found. Please check your configuration.'
        } else if (err.message.includes('INVALID_EMAIL_DOMAIN')) {
          errorMessage = 'Email domain not configured for SSO. Please contact your administrator.'
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (err.message.includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.'
        } else if (err.message.includes('SSO_DISABLED')) {
          errorMessage = 'SSO authentication is disabled. Please use another sign-in method.'
        } else {
          errorMessage = err.message
        }
      }

      setEmailErrors([errorMessage])
      setShowEmailValidationError(true)
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='space-y-1 text-center'>
        <h1 className={`${soehne.className} font-medium text-[32px] text-black tracking-tight`}>
          Sign in with SSO
        </h1>
        <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
          Enter your work email to continue
        </p>
      </div>

      <form onSubmit={onSubmit} className={`${inter.className} mt-8 space-y-8`}>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='email'>Work email</Label>
            </div>
            <Input
              id='email'
              name='email'
              placeholder='Enter your work email'
              required
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              autoFocus
              value={email}
              onChange={handleEmailChange}
              className={cn(
                'rounded-[10px] shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                showEmailValidationError &&
                  emailErrors.length > 0 &&
                  'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
              )}
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
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting to SSO provider...' : 'Continue with SSO'}
        </Button>
      </form>

      {/* Only show divider and email signin button if email/password is enabled */}
      {!isFalsy(env.NEXT_PUBLIC_EMAIL_PASSWORD_SIGNUP_ENABLED) && (
        <>
          <div className={`${inter.className} relative my-6 font-light`}>
            <div className='absolute inset-0 flex items-center'>
              <div className='auth-divider w-full border-t' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-4 font-[340] text-muted-foreground'>Or</span>
            </div>
          </div>

          <div className={`${inter.className} space-y-3`}>
            <Link
              href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            >
              <Button
                variant='outline'
                className='w-full rounded-[10px] shadow-sm hover:bg-gray-50'
                type='button'
              >
                Sign in with email
              </Button>
            </Link>
          </div>
        </>
      )}

      {/* Only show signup link if email/password signup is enabled */}
      {!isFalsy(env.NEXT_PUBLIC_EMAIL_PASSWORD_SIGNUP_ENABLED) && (
        <div className={`${inter.className} pt-6 text-center font-light text-[14px]`}>
          <span className='font-normal'>Don't have an account? </span>
          <Link
            href={`/signup${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className='font-medium text-[var(--brand-accent-hex)] underline-offset-4 transition hover:text-[var(--brand-accent-hover-hex)] hover:underline'
          >
            Sign up
          </Link>
        </div>
      )}

      <div
        className={`${inter.className} auth-text-muted absolute right-0 bottom-0 left-0 px-8 pb-8 text-center font-[340] text-[13px] leading-relaxed sm:px-8 md:px-[44px]`}
      >
        By signing in, you agree to our{' '}
        <Link
          href='/terms'
          target='_blank'
          rel='noopener noreferrer'
          className='auth-link underline-offset-4 transition hover:underline'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          target='_blank'
          rel='noopener noreferrer'
          className='auth-link underline-offset-4 transition hover:underline'
        >
          Privacy Policy
        </Link>
      </div>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/(auth)/verify/page.tsx

```typescript
import { isEmailVerificationEnabled, isProd } from '@/lib/core/config/feature-flags'
import { hasEmailService } from '@/lib/messaging/email/mailer'
import { VerifyContent } from '@/app/(auth)/verify/verify-content'

export const dynamic = 'force-dynamic'

export default function VerifyPage() {
  const emailServiceConfigured = hasEmailService()

  return (
    <VerifyContent
      hasEmailService={emailServiceConfigured}
      isProduction={isProd}
      isEmailVerificationEnabled={isEmailVerificationEnabled}
    />
  )
}
```

--------------------------------------------------------------------------------

````

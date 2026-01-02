---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 253
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 253 of 933)

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
Location: sim-main/apps/sim/app/(landing)/careers/page.tsx
Signals: React

```typescript
'use client'

import { useRef, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { isHosted } from '@/lib/core/config/feature-flags'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { quickValidateEmail } from '@/lib/messaging/email/validation'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import Footer from '@/app/(landing)/components/footer/footer'
import Nav from '@/app/(landing)/components/nav/nav'

const logger = createLogger('CareersPage')

const validateName = (name: string): string[] => {
  const errors: string[] = []
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  return errors
}

const validateEmail = (email: string): string[] => {
  const errors: string[] = []
  if (!email || !email.trim()) {
    errors.push('Email is required')
    return errors
  }
  const validation = quickValidateEmail(email.trim().toLowerCase())
  if (!validation.isValid) {
    errors.push(validation.reason || 'Please enter a valid email address')
  }
  return errors
}

const validatePosition = (position: string): string[] => {
  const errors: string[] = []
  if (!position || position.trim().length < 2) {
    errors.push('Please specify the position you are interested in')
  }
  return errors
}

const validateLinkedIn = (url: string): string[] => {
  if (!url || url.trim() === '') return []
  const errors: string[] = []
  try {
    new URL(url)
  } catch {
    errors.push('Please enter a valid LinkedIn URL')
  }
  return errors
}

const validatePortfolio = (url: string): string[] => {
  if (!url || url.trim() === '') return []
  const errors: string[] = []
  try {
    new URL(url)
  } catch {
    errors.push('Please enter a valid portfolio URL')
  }
  return errors
}

const validateLocation = (location: string): string[] => {
  const errors: string[] = []
  if (!location || location.trim().length < 2) {
    errors.push('Please enter your location')
  }
  return errors
}

const validateMessage = (message: string): string[] => {
  const errors: string[] = []
  if (!message || message.trim().length < 50) {
    errors.push('Please tell us more about yourself (at least 50 characters)')
  }
  return errors
}

export default function CareersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showErrors, setShowErrors] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [experience, setExperience] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Field errors
  const [nameErrors, setNameErrors] = useState<string[]>([])
  const [emailErrors, setEmailErrors] = useState<string[]>([])
  const [positionErrors, setPositionErrors] = useState<string[]>([])
  const [linkedinErrors, setLinkedinErrors] = useState<string[]>([])
  const [portfolioErrors, setPortfolioErrors] = useState<string[]>([])
  const [experienceErrors, setExperienceErrors] = useState<string[]>([])
  const [locationErrors, setLocationErrors] = useState<string[]>([])
  const [messageErrors, setMessageErrors] = useState<string[]>([])
  const [resumeErrors, setResumeErrors] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setResume(file)
    if (file) {
      setResumeErrors([])
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setShowErrors(true)

    // Validate all fields
    const nameErrs = validateName(name)
    const emailErrs = validateEmail(email)
    const positionErrs = validatePosition(position)
    const linkedinErrs = validateLinkedIn(linkedin)
    const portfolioErrs = validatePortfolio(portfolio)
    const experienceErrs = experience ? [] : ['Please select your years of experience']
    const locationErrs = validateLocation(location)
    const messageErrs = validateMessage(message)
    const resumeErrs = resume ? [] : ['Resume is required']

    setNameErrors(nameErrs)
    setEmailErrors(emailErrs)
    setPositionErrors(positionErrs)
    setLinkedinErrors(linkedinErrs)
    setPortfolioErrors(portfolioErrs)
    setExperienceErrors(experienceErrs)
    setLocationErrors(locationErrs)
    setMessageErrors(messageErrs)
    setResumeErrors(resumeErrs)

    if (
      nameErrs.length > 0 ||
      emailErrs.length > 0 ||
      positionErrs.length > 0 ||
      linkedinErrs.length > 0 ||
      portfolioErrs.length > 0 ||
      experienceErrs.length > 0 ||
      locationErrs.length > 0 ||
      messageErrs.length > 0 ||
      resumeErrs.length > 0
    ) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('phone', phone || '')
      formData.append('position', position)
      formData.append('linkedin', linkedin || '')
      formData.append('portfolio', portfolio || '')
      formData.append('experience', experience)
      formData.append('location', location)
      formData.append('message', message)
      if (resume) formData.append('resume', resume)

      const response = await fetch('/api/careers/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      setSubmitStatus('success')
    } catch (error) {
      logger.error('Error submitting application:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={`${soehne.className} min-h-screen bg-white text-gray-900`}>
      <Nav variant='landing' />

      {/* Content */}
      <div className='px-4 pt-[60px] pb-[80px] sm:px-8 md:px-[44px]'>
        <h1 className='mb-10 text-center font-bold text-4xl text-gray-900 md:text-5xl'>
          Join Our Team
        </h1>

        <div className='mx-auto max-w-4xl'>
          {/* Form Section */}
          <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10'>
            <form onSubmit={onSubmit} className='space-y-5'>
              {/* Name and Email */}
              <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='name' className='font-medium text-sm'>
                    Full Name *
                  </Label>
                  <Input
                    id='name'
                    placeholder='John Doe'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(
                      showErrors &&
                        nameErrors.length > 0 &&
                        'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                    )}
                  />
                  {showErrors && nameErrors.length > 0 && (
                    <div className='mt-1 space-y-1 text-red-400 text-xs'>
                      {nameErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email' className='font-medium text-sm'>
                    Email *
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='john@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      showErrors &&
                        emailErrors.length > 0 &&
                        'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                    )}
                  />
                  {showErrors && emailErrors.length > 0 && (
                    <div className='mt-1 space-y-1 text-red-400 text-xs'>
                      {emailErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone and Position */}
              <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='phone' className='font-medium text-sm'>
                    Phone Number
                  </Label>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='+1 (555) 123-4567'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='position' className='font-medium text-sm'>
                    Position of Interest *
                  </Label>
                  <Input
                    id='position'
                    placeholder='e.g. Full Stack Engineer, Product Designer'
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className={cn(
                      showErrors &&
                        positionErrors.length > 0 &&
                        'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                    )}
                  />
                  {showErrors && positionErrors.length > 0 && (
                    <div className='mt-1 space-y-1 text-red-400 text-xs'>
                      {positionErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* LinkedIn and Portfolio */}
              <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='linkedin' className='font-medium text-sm'>
                    LinkedIn Profile
                  </Label>
                  <Input
                    id='linkedin'
                    placeholder='https://linkedin.com/in/yourprofile'
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className={cn(
                      showErrors &&
                        linkedinErrors.length > 0 &&
                        'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                    )}
                  />
                  {showErrors && linkedinErrors.length > 0 && (
                    <div className='mt-1 space-y-1 text-red-400 text-xs'>
                      {linkedinErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='portfolio' className='font-medium text-sm'>
                    Portfolio / Website
                  </Label>
                  <Input
                    id='portfolio'
                    placeholder='https://yourportfolio.com'
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className={cn(
                      showErrors &&
                        portfolioErrors.length > 0 &&
                        'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                    )}
                  />
                  {showErrors && portfolioErrors.length > 0 && (
                    <div className='mt-1 space-y-1 text-red-400 text-xs'>
                      {portfolioErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Experience and Location */}
              <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='experience' className='font-medium text-sm'>
                    Years of Experience *
                  </Label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger
                      className={cn(
                        showErrors &&
                          experienceErrors.length > 0 &&
                          'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                      )}
                    >
                      <SelectValue placeholder='Select experience level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='0-1'>0-1 years</SelectItem>
                      <SelectItem value='1-3'>1-3 years</SelectItem>
                      <SelectItem value='3-5'>3-5 years</SelectItem>
                      <SelectItem value='5-10'>5-10 years</SelectItem>
                      <SelectItem value='10+'>10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {showErrors && experienceErrors.length > 0 && (
                    <div className='mt-1 space-y-1 text-red-400 text-xs'>
                      {experienceErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='location' className='font-medium text-sm'>
                    Location *
                  </Label>
                  <Input
                    id='location'
                    placeholder='e.g. San Francisco, CA'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={cn(
                      showErrors &&
                        locationErrors.length > 0 &&
                        'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                    )}
                  />
                  {showErrors && locationErrors.length > 0 && (
                    <div className='mt-1 space-y-1 text-red-400 text-xs'>
                      {locationErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className='space-y-2'>
                <Label htmlFor='message' className='font-medium text-sm'>
                  Tell us about yourself *
                </Label>
                <Textarea
                  id='message'
                  placeholder='Tell us about your experience, what excites you about Sim, and why you would be a great fit for this role...'
                  className={cn(
                    'min-h-[140px]',
                    showErrors &&
                      messageErrors.length > 0 &&
                      'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                  )}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className='mt-1.5 text-gray-500 text-xs'>Minimum 50 characters</p>
                {showErrors && messageErrors.length > 0 && (
                  <div className='mt-1 space-y-1 text-red-400 text-xs'>
                    {messageErrors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Resume Upload */}
              <div className='space-y-2'>
                <Label htmlFor='resume' className='font-medium text-sm'>
                  Resume *
                </Label>
                <div className='relative'>
                  {resume ? (
                    <div className='flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2'>
                      <span className='flex-1 truncate text-sm'>{resume.name}</span>
                      <button
                        type='button'
                        onClick={(e) => {
                          e.preventDefault()
                          setResume(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className='flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground'
                        aria-label='Remove file'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  ) : (
                    <Input
                      id='resume'
                      type='file'
                      accept='.pdf,.doc,.docx'
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className={cn(
                        showErrors &&
                          resumeErrors.length > 0 &&
                          'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                      )}
                    />
                  )}
                </div>
                <p className='mt-1.5 text-gray-500 text-xs'>PDF or Word document, max 10MB</p>
                {showErrors && resumeErrors.length > 0 && (
                  <div className='mt-1 space-y-1 text-red-400 text-xs'>
                    {resumeErrors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className='flex justify-end pt-2'>
                <Button
                  type='submit'
                  disabled={isSubmitting || submitStatus === 'success'}
                  className='min-w-[200px] rounded-[10px] border border-[#6F3DFA] bg-gradient-to-b from-[#8357FF] to-[#6F3DFA] text-white shadow-[inset_0_2px_4px_0_#9B77FF] transition-all duration-300 hover:opacity-90 disabled:opacity-50'
                  size='lg'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Submitting...
                    </>
                  ) : submitStatus === 'success' ? (
                    'Submitted'
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </form>
          </section>

          {/* Additional Info */}
          <section className='mt-6 text-center text-gray-600 text-sm'>
            <p>
              Questions? Email us at{' '}
              <a
                href='mailto:careers@sim.ai'
                className='font-medium text-gray-900 underline transition-colors hover:text-gray-700'
              >
                careers@sim.ai
              </a>
            </p>
          </section>
        </div>
      </div>

      {/* Footer - Only for hosted instances */}
      {isHosted && (
        <div className='relative z-20'>
          <Footer fullWidth={true} />
        </div>
      )}
    </main>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/(landing)/components/index.ts

```typescript
import Background from '@/app/(landing)/components/background/background'
import Footer from '@/app/(landing)/components/footer/footer'
import Hero from '@/app/(landing)/components/hero/hero'
import Integrations from '@/app/(landing)/components/integrations/integrations'
import LandingPricing from '@/app/(landing)/components/landing-pricing/landing-pricing'
import LandingTemplates from '@/app/(landing)/components/landing-templates/landing-templates'
import LegalLayout from '@/app/(landing)/components/legal-layout'
import Nav from '@/app/(landing)/components/nav/nav'
import StructuredData from '@/app/(landing)/components/structured-data'
import Testimonials from '@/app/(landing)/components/testimonials/testimonials'

export {
  Integrations,
  Testimonials,
  LandingTemplates,
  Nav,
  Background,
  Hero,
  LandingPricing,
  Footer,
  StructuredData,
  LegalLayout,
}
```

--------------------------------------------------------------------------------

---[FILE: legal-layout.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/legal-layout.tsx

```typescript
'use client'

import { isHosted } from '@/lib/core/config/feature-flags'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import Footer from '@/app/(landing)/components/footer/footer'
import Nav from '@/app/(landing)/components/nav/nav'

interface LegalLayoutProps {
  title: string
  children: React.ReactNode
  navVariant?: 'landing' | 'auth' | 'legal'
}

export default function LegalLayout({ title, children, navVariant = 'legal' }: LegalLayoutProps) {
  return (
    <main className={`${soehne.className} min-h-screen bg-white text-gray-900`}>
      {/* Header - Nav handles all conditional logic */}
      <Nav variant={navVariant} />

      {/* Content */}
      <div className='px-12 pt-[40px] pb-[40px]'>
        <h1 className='mb-12 text-center font-bold text-4xl text-gray-900 md:text-5xl'>{title}</h1>
        <div className='prose prose-gray mx-auto prose-h2:mt-12 prose-h3:mt-8 prose-h2:mb-6 prose-h3:mb-4 space-y-8 text-gray-700'>
          {children}
        </div>
      </div>

      {/* Footer - Only for hosted instances */}
      {isHosted && (
        <div className='relative z-20'>
          <Footer fullWidth={true} />
        </div>
      )}
    </main>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: structured-data.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/structured-data.tsx

```typescript
export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sim.ai/#organization',
        name: 'Sim',
        alternateName: 'Sim Studio',
        description:
          'Open-source AI agent workflow builder used by developers at trail-blazing startups to Fortune 500 companies',
        url: 'https://sim.ai',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://sim.ai/#logo',
          url: 'https://sim.ai/logo/b&w/text/b&w.svg',
          contentUrl: 'https://sim.ai/logo/b&w/text/b&w.svg',
          width: 49.78314,
          height: 24.276,
          caption: 'Sim Logo',
        },
        image: { '@id': 'https://sim.ai/#logo' },
        sameAs: [
          'https://x.com/simdotai',
          'https://github.com/simstudioai/sim',
          'https://www.linkedin.com/company/simstudioai/',
          'https://discord.gg/Hr4UWYEcTT',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          availableLanguage: ['en'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sim.ai/#website',
        url: 'https://sim.ai',
        name: 'Sim - AI Agent Workflow Builder',
        description:
          'Open-source AI agent workflow builder. 60,000+ developers build and deploy agentic workflows. SOC2 and HIPAA compliant.',
        publisher: {
          '@id': 'https://sim.ai/#organization',
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            '@id': 'https://sim.ai/#searchaction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://sim.ai/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://sim.ai/#webpage',
        url: 'https://sim.ai',
        name: 'Sim - Workflows for LLMs | Build AI Agent Workflows',
        isPartOf: {
          '@id': 'https://sim.ai/#website',
        },
        about: {
          '@id': 'https://sim.ai/#software',
        },
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: new Date().toISOString(),
        description:
          'Build and deploy AI agent workflows with Sim. Visual drag-and-drop interface for creating powerful LLM-powered automations.',
        breadcrumb: {
          '@id': 'https://sim.ai/#breadcrumb',
        },
        inLanguage: 'en-US',
        potentialAction: [
          {
            '@type': 'ReadAction',
            target: ['https://sim.ai'],
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sim.ai/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://sim.ai',
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://sim.ai/#software',
        name: 'Sim - AI Agent Workflow Builder',
        description:
          'Open-source AI agent workflow builder used by 60,000+ developers. Build agentic workflows with visual drag-and-drop interface. SOC2 and HIPAA compliant. Integrate with 100+ apps.',
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: 'AI Development Tools',
        operatingSystem: 'Web, Windows, macOS, Linux',
        softwareVersion: '1.0',
        offers: [
          {
            '@type': 'Offer',
            '@id': 'https://sim.ai/#offer-free',
            name: 'Community Plan',
            price: '0',
            priceCurrency: 'USD',
            priceValidUntil: '2025-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
              '@id': 'https://sim.ai/#organization',
            },
            eligibleRegion: {
              '@type': 'Place',
              name: 'Worldwide',
            },
          },
          {
            '@type': 'Offer',
            '@id': 'https://sim.ai/#offer-pro',
            name: 'Pro Plan',
            price: '20',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '20',
              priceCurrency: 'USD',
              unitText: 'MONTH',
              billingIncrement: 1,
            },
            priceValidUntil: '2025-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
              '@id': 'https://sim.ai/#organization',
            },
          },
          {
            '@type': 'Offer',
            '@id': 'https://sim.ai/#offer-team',
            name: 'Team Plan',
            price: '40',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '40',
              priceCurrency: 'USD',
              unitText: 'MONTH',
              billingIncrement: 1,
            },
            priceValidUntil: '2025-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
              '@id': 'https://sim.ai/#organization',
            },
          },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '150',
          bestRating: '5',
          worstRating: '1',
        },
        featureList: [
          'Visual workflow builder',
          'Drag-and-drop interface',
          '100+ integrations',
          'AI model support (OpenAI, Anthropic, Google, xAI, Mistral, Perplexity)',
          'Real-time collaboration',
          'Version control',
          'API access',
          'Custom functions',
          'Scheduled workflows',
          'Event triggers',
        ],
        screenshot: [
          {
            '@type': 'ImageObject',
            url: 'https://sim.ai/screenshots/workflow-builder.png',
            caption: 'Sim workflow builder interface',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://sim.ai/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Sim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim is an open-source AI agent workflow builder used by 60,000+ developers at trail-blazing startups to Fortune 500 companies. It provides a visual drag-and-drop interface for building and deploying agentic workflows. Sim is SOC2 and HIPAA compliant.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which AI models does Sim support?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim supports all major AI models including OpenAI (GPT-5, GPT-4o), Anthropic (Claude), Google (Gemini), xAI (Grok), Mistral, Perplexity, and many more. You can also connect to open-source models via Ollama.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need coding skills to use Sim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No coding skills are required! Sim features a visual drag-and-drop interface that makes it easy to build AI workflows. However, developers can also use custom functions and our API for advanced use cases.',
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* LLM-friendly semantic HTML comments */}
      {/* About: Sim is a visual workflow builder for AI agents and large language models (LLMs) */}
      {/* Purpose: Enable users to create AI-powered automations without coding */}
      {/* Features: Drag-and-drop interface, 100+ integrations, multi-model support */}
      {/* Use cases: Email automation, chatbots, data analysis, content generation */}
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: background-svg.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/background/background-svg.tsx

```typescript
export default function BackgroundSVG() {
  return (
    <svg
      aria-hidden='true'
      focusable='false'
      className='-translate-x-1/2 pointer-events-none absolute top-0 left-1/2 z-10 hidden h-full min-h-full w-[1308px] sm:block'
      width='1308'
      height='4942'
      viewBox='0 18 1308 4066'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      preserveAspectRatio='xMidYMin slice'
    >
      {/* Pricing section (original height ~380 units) */}
      <path d='M6.71704 1236.22H1300.76' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='11.0557' cy='1236.48' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1298.02' cy='1236.48' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M10.7967 1245.42V1613.91' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M1297.76 1245.96V1613.91' stroke='#E7E4EF' strokeWidth='2' />

      {/* Integrations section (original height ~412 units) */}
      <path d='M6.71704 1614.89H1291.05' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='11.0557' cy='1615.15' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1298.02' cy='1615.15' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M10.7967 1624.61V2026.93' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M1297.76 1624.61V2026.93' stroke='#E7E4EF' strokeWidth='2' />

      {/* Testimonials section (original short height ~149 units) */}
      <path d='M6.71704 2026.71H1300.76' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='11.0557' cy='2026.97' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1298.02' cy='2026.97' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M10.7967 2036.43V2177.43' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M1297.76 2036.43V2177.43' stroke='#E7E4EF' strokeWidth='2' />

      {/* Footer section line */}
      <path d='M6.71704 2177.71H1300.76' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='11.0557' cy='2177.97' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1298.02' cy='2177.97' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M10.7967 2187.43V4090.25' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M1297.76 2187.43V4090.25' stroke='#E7E4EF' strokeWidth='2' />
      <path
        d='M959.828 116.604C1064.72 187.189 1162.61 277.541 1293.45 536.597'
        stroke='#E7E4EF'
        strokeWidth='1.90903'
      />
      <path d='M1118.77 612.174V88' stroke='#E7E4EF' strokeWidth='1.90903' />
      <path d='M1261.95 481.414L1289.13 481.533' stroke='#E7E4EF' strokeWidth='1.90903' />
      <path d='M960 109.049V88' stroke='#E7E4EF' strokeWidth='1.90903' />
      <circle
        cx='960.214'
        cy='115.214'
        r='6.25942'
        transform='rotate(90 960.214 115.214)'
        fill='white'
        stroke='#E7E4EF'
        strokeWidth='1.90903'
      />
      <circle
        cx='1119.21'
        cy='258.214'
        r='6.25942'
        transform='rotate(90 1119.21 258.214)'
        fill='white'
        stroke='#E7E4EF'
        strokeWidth='1.90903'
      />
      <circle
        cx='1265.19'
        cy='481.414'
        r='6.25942'
        transform='rotate(90 1265.19 481.414)'
        fill='white'
        stroke='#E7E4EF'
        strokeWidth='1.90903'
      />
      <path
        d='M77 179C225.501 165.887 294.438 145.674 390 85'
        stroke='#E7E4EF'
        strokeWidth='1.90903'
      />
      <path d='M214.855 521.491L215 75' stroke='#E7E4EF' strokeWidth='1.90903' />
      <path
        d='M76.6567 381.124C177.305 448.638 213.216 499.483 240.767 613.253'
        stroke='#E7E4EF'
        strokeWidth='1.90903'
      />
      <path d='M76.5203 175.703V613.253' stroke='#E7E4EF' strokeWidth='1.90903' />
      <path d='M1.07967 179.225L76.6567 179.225' stroke='#E7E4EF' strokeWidth='1.90903' />
      <circle
        cx='76.3128'
        cy='178.882'
        r='6.25942'
        transform='rotate(90 76.3128 178.882)'
        fill='white'
        stroke='#E7E4EF'
        strokeWidth='1.90903'
      />
      <circle
        cx='214.511'
        cy='528.695'
        r='6.25942'
        transform='rotate(90 214.511 528.695)'
        fill='white'
        stroke='#E7E4EF'
        strokeWidth='1.90903'
      />
      <circle
        cx='76.3129'
        cy='380.78'
        r='6.25942'
        transform='rotate(90 76.3129 380.78)'
        fill='white'
        stroke='#E7E4EF'
        strokeWidth='1.90903'
      />
      <path d='M10.7967 18V1226.51' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M1297.76 18V1227.59' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M6.71704 78.533H1300.76' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='10.7967' cy='78.792' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='214.976' cy='78.9761' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='396.976' cy='78.9761' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1298.02' cy='78.792' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1118.98' cy='78.9761' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='959.976' cy='78.9761' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M16.4341 620.811H1292.13' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='11.0557' cy='621.07' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='76.3758' cy='621.07' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='244.805' cy='621.07' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='10.7967' cy='178.405' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1298.02' cy='621.07' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1119.23' cy='621.07' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1298.02' cy='481.253' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1298.02' cy='541.714' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: background.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/background/background.tsx
Signals: Next.js

```typescript
import dynamic from 'next/dynamic'
import { cn } from '@/lib/core/utils/cn'

// Lazy load the SVG to reduce initial bundle size
const BackgroundSVG = dynamic(() => import('./background-svg'), {
  ssr: true, // Enable SSR for SEO
  loading: () => null, // Don't show loading state
})

type BackgroundProps = {
  className?: string
  children?: React.ReactNode
}

export default function Background({ className, children }: BackgroundProps) {
  return (
    <div className={cn('relative min-h-screen w-full', className)}>
      <BackgroundSVG />
      <div className='relative z-0 mx-auto w-full max-w-[1308px]'>{children}</div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: consts.ts]---
Location: sim-main/apps/sim/app/(landing)/components/footer/consts.ts

```typescript
export const FOOTER_BLOCKS = [
  'Agent',
  'API',
  'Condition',
  'Evaluator',
  'Function',
  'Guardrails',
  'Human In The Loop',
  'Loop',
  'Parallel',
  'Response',
  'Router',
  'Starter',
  'Webhook',
  'Workflow',
]

export const FOOTER_TOOLS = [
  'Airtable',
  'Apify',
  'Apollo',
  'ArXiv',
  'Browser Use',
  'Calendly',
  'Clay',
  'Confluence',
  'Discord',
  'ElevenLabs',
  'Exa',
  'Firecrawl',
  'GitHub',
  'Gmail',
  'Google Drive',
  'HubSpot',
  'HuggingFace',
  'Hunter',
  'Incidentio',
  'Intercom',
  'Jina',
  'Jira',
  'Knowledge',
  'Linear',
  'LinkUp',
  'LinkedIn',
  'Mailchimp',
  'Mailgun',
  'MCP',
  'Mem0',
  'Microsoft Excel',
  'Microsoft Planner',
  'Microsoft Teams',
  'Mistral Parse',
  'MongoDB',
  'MySQL',
  'Neo4j',
  'Notion',
  'OneDrive',
  'OpenAI',
  'Outlook',
  'Parallel AI',
  'Perplexity',
  'Pinecone',
  'Pipedrive',
  'PostHog',
  'PostgreSQL',
  'Qdrant',
  'Reddit',
  'Resend',
  'S3',
  'Salesforce',
  'SendGrid',
  'Serper',
  'ServiceNow',
  'SharePoint',
  'Slack',
  'Smtp',
  'Stagehand',
  'Stripe',
  'Supabase',
  'Tavily',
  'Telegram',
  'Translate',
  'Trello',
  'Twilio',
  'Typeform',
  'Vision',
  'Wait',
  'Wealthbox',
  'Webflow',
  'WhatsApp',
  'Wikipedia',
  'X',
  'YouTube',
  'Zendesk',
  'Zep',
]
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 254
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 254 of 933)

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

---[FILE: footer.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/footer/footer.tsx
Signals: Next.js

```typescript
import Link from 'next/link'
import { inter } from '@/app/_styles/fonts/inter/inter'
import {
  ComplianceBadges,
  Logo,
  SocialLinks,
  StatusIndicator,
} from '@/app/(landing)/components/footer/components'
import { FOOTER_BLOCKS, FOOTER_TOOLS } from '@/app/(landing)/components/footer/consts'

interface FooterProps {
  fullWidth?: boolean
}

export default function Footer({ fullWidth = false }: FooterProps) {
  return (
    <footer className={`${inter.className} relative w-full overflow-hidden bg-white`}>
      <div
        className={
          fullWidth
            ? 'px-4 pt-[40px] pb-[40px] sm:px-4 sm:pt-[34px] sm:pb-[340px]'
            : 'px-4 pt-[40px] pb-[40px] sm:px-[50px] sm:pt-[34px] sm:pb-[340px]'
        }
      >
        <div className={`flex gap-[80px] ${fullWidth ? 'justify-center' : ''}`}>
          {/* Logo and social links */}
          <div className='flex flex-col gap-[24px]'>
            <Logo />
            <SocialLinks />
            <ComplianceBadges />
            <StatusIndicator />
          </div>

          {/* Links section */}
          <div>
            <h2 className='mb-[16px] font-medium text-[14px] text-foreground'>More Sim</h2>
            <div className='flex flex-col gap-[12px]'>
              <Link
                href='https://docs.sim.ai'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
              >
                Docs
              </Link>
              <Link
                href='#pricing'
                className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
              >
                Pricing
              </Link>
              <Link
                href='https://form.typeform.com/to/jqCO12pF'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
              >
                Enterprise
              </Link>
              <Link
                href='/studio'
                className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
              >
                Sim Studio
              </Link>
              <Link
                href='/changelog'
                className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
              >
                Changelog
              </Link>
              <Link
                href='https://status.sim.ai'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
              >
                Status
              </Link>
              <Link
                href='/careers'
                className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
              >
                Careers
              </Link>
              <Link
                href='/privacy'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Blocks section */}
          <div className='hidden sm:block'>
            <h2 className='mb-[16px] font-medium text-[14px] text-foreground'>Blocks</h2>
            <div className='flex flex-col gap-[12px]'>
              {FOOTER_BLOCKS.map((block) => (
                <Link
                  key={block}
                  href={`https://docs.sim.ai/blocks/${block.toLowerCase().replaceAll(' ', '-')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[14px] text-muted-foreground transition-colors hover:text-foreground'
                >
                  {block}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools section - split into columns */}
          <div className='hidden sm:block'>
            <h2 className='mb-[16px] font-medium text-[14px] text-foreground'>Tools</h2>
            <div className='flex gap-[80px]'>
              {/* First column */}
              <div className='flex flex-col gap-[12px]'>
                {FOOTER_TOOLS.slice(0, Math.ceil(FOOTER_TOOLS.length / 4)).map((tool) => (
                  <Link
                    key={tool}
                    href={`https://docs.sim.ai/tools/${tool.toLowerCase().replace(/\s+/g, '_')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='whitespace-nowrap text-[14px] text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {tool}
                  </Link>
                ))}
              </div>
              {/* Second column */}
              <div className='flex flex-col gap-[12px]'>
                {FOOTER_TOOLS.slice(
                  Math.ceil(FOOTER_TOOLS.length / 4),
                  Math.ceil((FOOTER_TOOLS.length * 2) / 4)
                ).map((tool) => (
                  <Link
                    key={tool}
                    href={`https://docs.sim.ai/tools/${tool.toLowerCase().replace(/\s+/g, '_')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='whitespace-nowrap text-[14px] text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {tool}
                  </Link>
                ))}
              </div>
              {/* Third column */}
              <div className='flex flex-col gap-[12px]'>
                {FOOTER_TOOLS.slice(
                  Math.ceil((FOOTER_TOOLS.length * 2) / 4),
                  Math.ceil((FOOTER_TOOLS.length * 3) / 4)
                ).map((tool) => (
                  <Link
                    key={tool}
                    href={`https://docs.sim.ai/tools/${tool.toLowerCase().replace(/\s+/g, '_')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='whitespace-nowrap text-[14px] text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {tool}
                  </Link>
                ))}
              </div>
              {/* Fourth column */}
              <div className='flex flex-col gap-[12px]'>
                {FOOTER_TOOLS.slice(Math.ceil((FOOTER_TOOLS.length * 3) / 4)).map((tool) => (
                  <Link
                    key={tool}
                    href={`https://docs.sim.ai/tools/${tool.toLowerCase().replace(/\s+/g, '_')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='whitespace-nowrap text-[14px] text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {tool}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large SIM logo at bottom - half cut off */}
      <div className='-translate-x-1/2 pointer-events-none absolute bottom-[-240px] left-1/2 hidden sm:block'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='1128'
          height='550'
          viewBox='0 0 1128 550'
          fill='none'
        >
          <g filter='url(#filter0_dd_122_4989)'>
            <path
              d='M3 420.942H77.9115C77.9115 441.473 85.4027 457.843 100.385 470.051C115.367 481.704 135.621 487.53 161.147 487.53C188.892 487.53 210.255 482.258 225.238 471.715C240.22 460.617 247.711 445.913 247.711 427.601C247.711 414.283 243.549 403.185 235.226 394.307C227.457 385.428 213.03 378.215 191.943 372.666L120.361 356.019C84.2929 347.14 57.3802 333.545 39.6234 315.234C22.4215 296.922 13.8206 272.784 13.8206 242.819C13.8206 217.849 20.2019 196.208 32.9646 177.896C46.2822 159.584 64.3165 145.434 87.0674 135.446C110.373 125.458 137.008 120.464 166.973 120.464C196.938 120.464 222.74 125.735 244.382 136.278C266.578 146.821 283.779 161.526 295.987 180.393C308.75 199.259 315.409 221.733 315.964 247.813H241.052C240.497 226.727 233.561 210.357 220.243 198.705C206.926 187.052 188.337 181.225 164.476 181.225C140.06 181.225 121.194 186.497 107.876 197.04C94.5585 207.583 87.8997 222.01 87.8997 240.322C87.8997 267.512 107.876 286.101 147.829 296.09L219.411 313.569C253.815 321.337 279.618 334.1 296.82 351.857C314.022 369.059 322.622 392.642 322.622 422.607C322.622 448.132 315.686 470.606 301.814 490.027C287.941 508.894 268.797 523.599 244.382 534.142C220.521 544.13 192.221 549.124 159.482 549.124C111.76 549.124 73.7498 537.471 45.4499 514.165C17.15 490.86 3 459.785 3 420.942Z'
              fill='#DCDCDC'
            />
            <path
              d='M377.713 539.136V132.117C408.911 143.439 422.667 143.439 455.954 132.117V539.136H377.713ZM416.001 105.211C402.129 105.211 389.921 100.217 379.378 90.2291C369.39 79.686 364.395 67.4782 364.395 53.6057C364.395 39.1783 369.39 26.9705 379.378 16.9823C389.921 6.9941 402.129 2 416.001 2C430.428 2 442.636 6.9941 452.625 16.9823C462.613 26.9705 467.607 39.1783 467.607 53.6057C467.607 67.4782 462.613 79.686 452.625 90.2291C442.636 100.217 430.428 105.211 416.001 105.211Z'
              fill='#DCDCDC'
            />
            <path
              d='M593.961 539.136H515.72V132.117H585.637V200.792C593.961 178.041 610.053 158.752 632.249 143.769C655 128.232 682.467 120.464 714.651 120.464C750.72 120.464 780.685 130.174 804.545 149.596C822.01 163.812 835.016 181.446 843.562 202.5C851.434 181.446 864.509 163.812 882.786 149.596C907.757 130.174 938.554 120.464 975.177 120.464C1021.79 120.464 1058.41 134.059 1085.05 161.249C1111.68 188.439 1125 225.617 1125 272.784V539.136H1048.42V291.928C1048.42 259.744 1040.1 235.051 1023.45 217.849C1007.36 200.092 985.443 191.213 957.698 191.213C938.276 191.213 921.074 195.653 906.092 204.531C891.665 212.855 880.289 225.062 871.966 241.154C863.642 257.247 859.48 276.113 859.48 297.754V539.136H782.072V291.095C782.072 258.911 774.026 234.496 757.934 217.849C741.841 200.647 719.923 192.046 692.178 192.046C672.756 192.046 655.555 196.485 640.572 205.363C626.145 213.687 614.769 225.895 606.446 241.987C598.122 257.524 593.961 276.113 593.961 297.754V539.136Z'
              fill='#DCDCDC'
            />
            <path
              d='M166.973 121.105C196.396 121.105 221.761 126.201 243.088 136.367L244.101 136.855L244.106 136.858C265.86 147.191 282.776 161.528 294.876 179.865L295.448 180.741L295.455 180.753C308.032 199.345 314.656 221.475 315.306 247.171H241.675C240.996 226.243 234.012 209.899 220.666 198.222C207.196 186.435 188.437 180.583 164.476 180.583C139.977 180.583 120.949 185.871 107.478 196.536C93.9928 207.212 87.2578 221.832 87.2578 240.322C87.2579 254.096 92.3262 265.711 102.444 275.127C112.542 284.524 127.641 291.704 147.673 296.712L147.677 296.713L219.259 314.192L219.27 314.195C253.065 321.827 278.469 334.271 295.552 351.48L296.358 352.304L296.365 352.311C313.42 369.365 321.98 392.77 321.98 422.606C321.98 448.005 315.082 470.343 301.297 489.646C287.502 508.408 268.456 523.046 244.134 533.55C220.369 543.498 192.157 548.482 159.481 548.482C111.864 548.482 74.0124 536.855 45.8584 513.67C17.8723 490.623 3.80059 459.948 3.64551 421.584H77.2734C77.4285 441.995 84.9939 458.338 99.9795 470.549L99.9854 470.553L99.9912 470.558C115.12 482.324 135.527 488.172 161.146 488.172C188.96 488.172 210.474 482.889 225.607 472.24L225.613 472.236L225.619 472.231C240.761 461.015 248.353 446.12 248.353 427.601C248.352 414.145 244.145 402.89 235.709 393.884C227.81 384.857 213.226 377.603 192.106 372.045L192.098 372.043L192.089 372.04L120.507 355.394C84.5136 346.533 57.7326 332.983 40.0908 314.794H40.0918C23.0227 296.624 14.4629 272.654 14.4629 242.819C14.4629 217.969 20.8095 196.463 33.4834 178.273C46.7277 160.063 64.6681 145.981 87.3252 136.034L87.3242 136.033C110.536 126.086 137.081 121.106 166.973 121.105ZM975.177 121.105C1021.66 121.105 1058.1 134.658 1084.59 161.698C1111.08 188.741 1124.36 225.743 1124.36 272.784V538.494H1049.07V291.928C1049.07 259.636 1040.71 234.76 1023.92 217.402H1023.91C1007.68 199.5 985.584 190.571 957.697 190.571C938.177 190.571 920.862 195.034 905.771 203.975C891.228 212.365 879.77 224.668 871.396 240.859C863.017 257.059 858.838 276.03 858.838 297.754V538.494H782.714V291.096C782.714 258.811 774.641 234.209 758.395 217.402C742.16 200.053 720.062 191.404 692.178 191.404C673.265 191.404 656.422 195.592 641.666 203.985L640.251 204.808C625.711 213.196 614.254 225.497 605.88 241.684C597.496 257.333 593.318 276.031 593.318 297.754V538.494H516.361V132.759H584.995V200.792L586.24 201.013C594.51 178.408 610.505 159.221 632.607 144.302L632.61 144.3C655.238 128.847 682.574 121.105 714.651 121.105C750.599 121.105 780.413 130.781 804.14 150.094C821.52 164.241 834.461 181.787 842.967 202.741L843.587 204.268L844.163 202.725C851.992 181.786 864.994 164.248 883.181 150.103C908.021 130.782 938.673 121.106 975.177 121.105ZM455.312 538.494H378.354V133.027C393.534 138.491 404.652 141.251 416.05 141.251C427.46 141.251 439.095 138.485 455.312 133.009V538.494ZM416.001 2.6416C430.262 2.6416 442.306 7.57157 452.171 17.4365C462.036 27.3014 466.965 39.3445 466.965 53.6055C466.965 67.3043 462.04 79.3548 452.16 89.7842C442.297 99.6427 430.258 104.569 416.001 104.569C402.303 104.569 390.254 99.6452 379.825 89.7676C369.957 79.3421 365.037 67.2967 365.037 53.6055C365.037 39.3444 369.966 27.3005 379.831 17.4355C390.258 7.56247 402.307 2.64163 416.001 2.6416Z'
              stroke='#C1C1C1'
              strokeWidth='1.28396'
            />
          </g>
          <defs>
            <filter
              id='filter0_dd_122_4989'
              x='0'
              y='0'
              width='1128'
              height='550'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'
            >
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feColorMatrix
                in='SourceAlpha'
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                result='hardAlpha'
              />
              <feMorphology
                radius='1'
                operator='erode'
                in='SourceAlpha'
                result='effect1_dropShadow_122_4989'
              />
              <feOffset dy='1' />
              <feGaussianBlur stdDeviation='1' />
              <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0' />
              <feBlend
                mode='normal'
                in2='BackgroundImageFix'
                result='effect1_dropShadow_122_4989'
              />
              <feColorMatrix
                in='SourceAlpha'
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                result='hardAlpha'
              />
              <feOffset dy='1' />
              <feGaussianBlur stdDeviation='1.5' />
              <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0' />
              <feBlend
                mode='normal'
                in2='effect1_dropShadow_122_4989'
                result='effect2_dropShadow_122_4989'
              />
              <feBlend
                mode='normal'
                in='SourceGraphic'
                in2='effect2_dropShadow_122_4989'
                result='shape'
              />
            </filter>
          </defs>
        </svg>
      </div>
    </footer>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: compliance-badges.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/footer/components/compliance-badges.tsx
Signals: Next.js

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { HIPAABadgeIcon } from '@/components/icons'

export default function ComplianceBadges() {
  return (
    <div className='mt-[6px] flex items-center gap-[12px]'>
      {/* SOC2 badge */}
      <Link href='https://trust.delve.co/sim-studio' target='_blank' rel='noopener noreferrer'>
        <Image
          src='/footer/soc2.png'
          alt='SOC2 Compliant'
          width={54}
          height={54}
          className='object-contain'
          loading='lazy'
          quality={75}
        />
      </Link>
      {/* HIPAA badge */}
      <Link href='https://trust.delve.co/sim-studio' target='_blank' rel='noopener noreferrer'>
        <HIPAABadgeIcon className='h-[54px] w-[54px]' />
      </Link>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/(landing)/components/footer/components/index.ts

```typescript
import ComplianceBadges from './compliance-badges'
import Logo from './logo'
import SocialLinks from './social-links'
import StatusIndicator from './status-indicator'

export { ComplianceBadges, Logo, SocialLinks, StatusIndicator }
```

--------------------------------------------------------------------------------

---[FILE: logo.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/footer/components/logo.tsx
Signals: Next.js

```typescript
import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href='/' aria-label='Sim home'>
      <Image
        src='/logo/b&w/text/b&w.svg'
        alt='Sim - Workflows for LLMs'
        width={49.78314}
        height={24.276}
        priority
        quality={90}
      />
    </Link>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: social-links.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/footer/components/social-links.tsx

```typescript
import { DiscordIcon, GithubIcon, LinkedInIcon, xIcon as XIcon } from '@/components/icons'

export default function SocialLinks() {
  return (
    <div className='flex items-center gap-[12px]'>
      <a
        href='https://discord.gg/Hr4UWYEcTT'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center text-[16px] text-muted-foreground transition-colors hover:text-foreground'
        aria-label='Discord'
      >
        <DiscordIcon className='h-[20px] w-[20px]' aria-hidden='true' />
      </a>
      <a
        href='https://x.com/simdotai'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center text-[16px] text-muted-foreground transition-colors hover:text-foreground'
        aria-label='X (Twitter)'
      >
        <XIcon className='h-[18px] w-[18px]' aria-hidden='true' />
      </a>
      <a
        href='https://www.linkedin.com/company/simstudioai/'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center text-[16px] text-muted-foreground transition-colors hover:text-foreground'
        aria-label='LinkedIn'
      >
        <LinkedInIcon className='h-[18px] w-[18px]' aria-hidden='true' />
      </a>
      <a
        href='https://github.com/simstudioai/sim'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center text-[16px] text-muted-foreground transition-colors hover:text-foreground'
        aria-label='GitHub'
      >
        <GithubIcon className='h-[20px] w-[20px]' aria-hidden='true' />
      </a>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: status-indicator.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/footer/components/status-indicator.tsx
Signals: React, Next.js

```typescript
'use client'

import type { SVGProps } from 'react'
import Link from 'next/link'
import type { StatusType } from '@/app/api/status/types'
import { useStatus } from '@/hooks/queries/status'

interface StatusDotIconProps extends SVGProps<SVGSVGElement> {
  status: 'operational' | 'degraded' | 'outage' | 'maintenance' | 'loading' | 'error'
}

export function StatusDotIcon({ status, className, ...props }: StatusDotIconProps) {
  const colors = {
    operational: '#10B981',
    degraded: '#F59E0B',
    outage: '#EF4444',
    maintenance: '#3B82F6',
    loading: '#9CA3AF',
    error: '#9CA3AF',
  }

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={6}
      height={6}
      viewBox='0 0 6 6'
      fill='none'
      className={className}
      {...props}
    >
      <circle cx={3} cy={3} r={3} fill={colors[status]} />
    </svg>
  )
}

const STATUS_COLORS: Record<StatusType, string> = {
  operational: 'text-[#10B981] hover:text-[#059669]',
  degraded: 'text-[#F59E0B] hover:text-[#D97706]',
  outage: 'text-[#EF4444] hover:text-[#DC2626]',
  maintenance: 'text-[#3B82F6] hover:text-[#2563EB]',
  loading: 'text-muted-foreground hover:text-foreground',
  error: 'text-muted-foreground hover:text-foreground',
}

export default function StatusIndicator() {
  const { data, isLoading, isError } = useStatus()

  const status = isLoading ? 'loading' : isError ? 'error' : data?.status || 'error'
  const message = isLoading
    ? 'Checking Status...'
    : isError
      ? 'Status Unknown'
      : data?.message || 'Status Unknown'
  const statusUrl = data?.url || 'https://status.sim.ai'

  return (
    <Link
      href={statusUrl}
      target='_blank'
      rel='noopener noreferrer'
      className={`flex items-center gap-[6px] whitespace-nowrap text-[12px] transition-colors ${STATUS_COLORS[status]}`}
      aria-label={`System status: ${message}`}
    >
      <StatusDotIcon status={status} className='h-[6px] w-[6px]' aria-hidden='true' />
      <span>{message}</span>
    </Link>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: hero.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/hero.tsx
Signals: React, Next.js

```typescript
'use client'

import React from 'react'
import {
  ArrowUp,
  BinaryIcon,
  BookIcon,
  CalendarIcon,
  CodeIcon,
  Globe2Icon,
  MessageSquareIcon,
  VariableIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type Edge, type Node, Position } from 'reactflow'
import {
  AgentIcon,
  AirtableIcon,
  DiscordIcon,
  GmailIcon,
  GoogleDriveIcon,
  GoogleSheetsIcon,
  JiraIcon,
  LinearIcon,
  NotionIcon,
  OpenAIIcon,
  OutlookIcon,
  PackageSearchIcon,
  PineconeIcon,
  ScheduleIcon,
  SlackIcon,
  StripeIcon,
  SupabaseIcon,
} from '@/components/icons'
import { LandingPromptStorage } from '@/lib/core/utils/browser-storage'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import {
  CARD_WIDTH,
  IconButton,
  LandingCanvas,
  type LandingGroupData,
  type LandingManualBlock,
  type LandingViewportApi,
} from '@/app/(landing)/components/hero/components'

/**
 * Service-specific template messages for the hero input
 */
const SERVICE_TEMPLATES = {
  slack: 'Summarizer agent that summarizes each new message in #general and sends me a DM',
  gmail: 'Alert agent that flags important Gmail messages in my inbox',
  outlook:
    'Auto-forwarding agent that classifies each new Outlook email and forwards to separate inboxes for further analysis',
  pinecone: 'RAG chat agent that uses memories stored in Pinecone',
  supabase: 'Natural language to SQL agent to query and update data in Supabase',
  linear: 'Agent that uses Linear to triage issues, assign owners, and draft updates',
  discord: 'Moderator agent that responds back to users in my Discord server',
  airtable: 'Alert agent that validates each new record in a table and prepares a weekly report',
  stripe: 'Agent that analyzes Stripe payment history to spot churn risks and generate summaries',
  notion: 'Support agent that appends new support tickets to my Notion workspace',
  googleSheets: 'Data science agent that analyzes Google Sheets data and generates insights',
  googleDrive: 'Drive reader agent that summarizes content in my Google Drive',
  jira: 'Engineering manager agent that uses Jira to update ticket statuses, generate sprint reports, and identify blockers',
} as const

/**
 * Landing blocks for the canvas preview
 */
const LANDING_BLOCKS: LandingManualBlock[] = [
  {
    id: 'schedule',
    name: 'Schedule',
    color: '#7B68EE',
    icon: <ScheduleIcon className='h-4 w-4' />,
    positions: {
      mobile: { x: 8, y: 60 },
      tablet: { x: 40, y: 120 },
      desktop: { x: 60, y: 180 },
    },
    tags: [
      { icon: <CalendarIcon className='h-3 w-3' />, label: '09:00AM Daily' },
      { icon: <Globe2Icon className='h-3 w-3' />, label: 'PST' },
    ],
  },
  {
    id: 'knowledge',
    name: 'Knowledge',
    color: '#00B0B0',
    icon: <PackageSearchIcon className='h-4 w-4' />,
    positions: {
      mobile: { x: 120, y: 140 },
      tablet: { x: 220, y: 200 },
      desktop: { x: 420, y: 241 },
    },
    tags: [
      { icon: <BookIcon className='h-3 w-3' />, label: 'Product Vector DB' },
      { icon: <BinaryIcon className='h-3 w-3' />, label: 'Limit: 10' },
    ],
  },
  {
    id: 'agent',
    name: 'Agent',
    color: '#802FFF',
    icon: <AgentIcon className='h-4 w-4' />,
    positions: {
      mobile: { x: 340, y: 60 },
      tablet: { x: 540, y: 120 },
      desktop: { x: 880, y: 142 },
    },
    tags: [
      { icon: <OpenAIIcon className='h-3 w-3' />, label: 'gpt-5' },
      { icon: <MessageSquareIcon className='h-3 w-3' />, label: 'You are a support ag...' },
    ],
  },
  {
    id: 'function',
    name: 'Function',
    color: '#FF402F',
    icon: <CodeIcon className='h-4 w-4' />,
    positions: {
      mobile: { x: 480, y: 220 },
      tablet: { x: 740, y: 280 },
      desktop: { x: 880, y: 340 },
    },
    tags: [
      { icon: <CodeIcon className='h-3 w-3' />, label: 'Python' },
      { icon: <VariableIcon className='h-3 w-3' />, label: 'time = "2025-09-01...' },
    ],
  },
]

/**
 * Sample workflow edges for the canvas preview
 */
const SAMPLE_WORKFLOW_EDGES = [
  { id: 'e1', from: 'schedule', to: 'knowledge' },
  { id: 'e2', from: 'knowledge', to: 'agent' },
  { id: 'e3', from: 'knowledge', to: 'function' },
]

/**
 * Hero component for the landing page featuring service integrations and workflow preview
 */
export default function Hero() {
  const router = useRouter()

  /**
   * State management for the text input
   */
  const [textValue, setTextValue] = React.useState('')
  const isEmpty = textValue.trim().length === 0

  /**
   * State for responsive icon display
   */
  const [visibleIconCount, setVisibleIconCount] = React.useState(13)
  const [isMobile, setIsMobile] = React.useState(false)

  /**
   * React Flow state for workflow preview canvas
   */
  const [rfNodes, setRfNodes] = React.useState<Node[]>([])
  const [rfEdges, setRfEdges] = React.useState<Edge[]>([])
  const [groupBox, setGroupBox] = React.useState<LandingGroupData | null>(null)
  const [worldWidth, setWorldWidth] = React.useState<number>(1000)
  const viewportApiRef = React.useRef<LandingViewportApi | null>(null)

  /**
   * Auto-hover animation state
   */
  const [autoHoverIndex, setAutoHoverIndex] = React.useState(1)
  const [isUserHovering, setIsUserHovering] = React.useState(false)
  const [lastHoveredIndex, setLastHoveredIndex] = React.useState<number | null>(null)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  /**
   * Handle service icon click to populate textarea with template
   */
  const handleServiceClick = (service: keyof typeof SERVICE_TEMPLATES) => {
    setTextValue(SERVICE_TEMPLATES[service])
  }

  /**
   * Set visible icon count based on screen size
   */
  React.useEffect(() => {
    const updateVisibleIcons = () => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth < 640
        setVisibleIconCount(mobile ? 6 : 13)
        setIsMobile(mobile)
      }
    }

    updateVisibleIcons()
    window.addEventListener('resize', updateVisibleIcons)

    return () => window.removeEventListener('resize', updateVisibleIcons)
  }, [])

  /**
   * Service icons array for easier indexing
   */
  const serviceIcons: Array<{
    key: string
    icon: React.ComponentType<{ className?: string }>
    label: string
    style?: React.CSSProperties
  }> = [
    { key: 'slack', icon: SlackIcon, label: 'Slack' },
    { key: 'gmail', icon: GmailIcon, label: 'Gmail' },
    { key: 'outlook', icon: OutlookIcon, label: 'Outlook' },
    { key: 'pinecone', icon: PineconeIcon, label: 'Pinecone' },
    { key: 'supabase', icon: SupabaseIcon, label: 'Supabase' },
    { key: 'linear', icon: LinearIcon, label: 'Linear', style: { color: '#5E6AD2' } },
    { key: 'discord', icon: DiscordIcon, label: 'Discord', style: { color: '#5765F2' } },
    { key: 'airtable', icon: AirtableIcon, label: 'Airtable' },
    { key: 'stripe', icon: StripeIcon, label: 'Stripe', style: { color: '#635BFF' } },
    { key: 'notion', icon: NotionIcon, label: 'Notion' },
    { key: 'googleSheets', icon: GoogleSheetsIcon, label: 'Google Sheets' },
    { key: 'googleDrive', icon: GoogleDriveIcon, label: 'Google Drive' },
    { key: 'jira', icon: JiraIcon, label: 'Jira' },
  ]

  /**
   * Auto-hover animation effect
   */
  React.useEffect(() => {
    // Start the interval when component mounts
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setAutoHoverIndex((prev) => (prev + 1) % visibleIconCount)
      }, 2000)
    }

    // Only run interval when user is not hovering
    if (!isUserHovering) {
      startInterval()
    }

    // Cleanup on unmount or when hovering state changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isUserHovering, visibleIconCount])

  /**
   * Handle mouse enter on icon container
   */
  const handleIconContainerMouseEnter = () => {
    setIsUserHovering(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  /**
   * Handle mouse leave on icon container
   */
  const handleIconContainerMouseLeave = () => {
    setIsUserHovering(false)
    // Start from the next icon after the last hovered one
    if (lastHoveredIndex !== null) {
      setAutoHoverIndex((lastHoveredIndex + 1) % visibleIconCount)
    }
  }

  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    if (!isEmpty) {
      LandingPromptStorage.store(textValue)
      router.push('/signup')
    }
  }

  /**
   * Handle keyboard shortcuts (Enter to submit)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isEmpty) {
        handleSubmit()
      }
    }
  }

  /**
   * Initialize workflow preview with sample data
   */
  React.useEffect(() => {
    // Determine breakpoint for responsive positioning
    const breakpoint =
      typeof window !== 'undefined' && window.innerWidth < 640
        ? 'mobile'
        : typeof window !== 'undefined' && window.innerWidth < 1024
          ? 'tablet'
          : 'desktop'

    // Convert landing blocks to React Flow nodes
    const nodes: Node[] = [
      // Add the loop block node as a group with custom rendering
      {
        id: 'loop',
        type: 'group',
        position: { x: 720, y: 20 },
        data: {
          label: 'Loop',
        },
        draggable: false,
        selectable: false,
        focusable: false,
        connectable: false,
        // Group node properties for subflow functionality
        style: {
          width: 1198,
          height: 528,
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
        },
      },
      // Convert blocks to nodes
      ...LANDING_BLOCKS.map((block, index) => {
        // Make agent and function nodes children of the loop
        const isLoopChild = block.id === 'agent' || block.id === 'function'
        const baseNode = {
          id: block.id,
          type: 'landing',
          position: isLoopChild
            ? {
                // Adjust positions relative to loop parent (original positions - loop position)
                x: block.id === 'agent' ? 160 : 160,
                y: block.id === 'agent' ? 122 : 320,
              }
            : block.positions[breakpoint],
          data: {
            icon: block.icon,
            color: block.color,
            name: block.name,
            tags: block.tags,
            delay: index * 0.18,
            hideTargetHandle: block.id === 'schedule', // Hide target handle for schedule node
            hideSourceHandle: block.id === 'agent' || block.id === 'function', // Hide source handle for agent and function nodes
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        }

        // Add parent properties for loop children
        if (isLoopChild) {
          return {
            ...baseNode,
            parentId: 'loop',
            extent: 'parent',
          }
        }

        return baseNode
      }),
    ]

    // Convert sample edges to React Flow edges
    const rfEdges: Edge[] = SAMPLE_WORKFLOW_EDGES.map((e) => ({
      id: e.id,
      source: e.from,
      target: e.to,
      type: 'landingEdge',
      animated: false,
      data: { delay: 0.6 },
    }))

    setRfNodes(nodes)
    setRfEdges(rfEdges)

    // Calculate world width for canvas
    const maxX = Math.max(...nodes.map((n) => n.position.x))
    setWorldWidth(maxX + CARD_WIDTH + 32)
  }, [])

  return (
    <section
      id='hero'
      className={`${soehne.className} flex w-full flex-col items-center justify-center pt-[36px] sm:pt-[80px]`}
      aria-labelledby='hero-heading'
    >
      <h1
        id='hero-heading'
        className='px-4 text-center font-medium text-[36px] leading-none tracking-tight sm:px-0 sm:text-[74px]'
      >
        Workflows for LLMs
      </h1>
      <p className='px-4 pt-[6px] text-center text-[18px] opacity-70 sm:px-0 sm:pt-[10px] sm:text-[22px]'>
        Build and deploy AI agent workflows
      </p>
      <div
        className='flex items-center justify-center gap-[2px] pt-[18px] sm:pt-[32px]'
        onMouseEnter={handleIconContainerMouseEnter}
        onMouseLeave={handleIconContainerMouseLeave}
      >
        {/* Service integration buttons */}
        {serviceIcons.slice(0, visibleIconCount).map((service, index) => {
          const Icon = service.icon
          return (
            <IconButton
              key={service.key}
              aria-label={service.label}
              onClick={() => handleServiceClick(service.key as keyof typeof SERVICE_TEMPLATES)}
              onMouseEnter={() => setLastHoveredIndex(index)}
              style={service.style}
              isAutoHovered={!isUserHovering && index === autoHoverIndex}
            >
              <Icon className='h-5 w-5 sm:h-6 sm:w-6' />
            </IconButton>
          )
        })}
      </div>
      <div className='flex w-full items-center justify-center px-4 pt-[8px] sm:px-8 sm:pt-[12px] md:px-[50px]'>
        <div className='relative w-full sm:w-[640px]'>
          <label htmlFor='agent-description' className='sr-only'>
            Describe the AI agent you want to build
          </label>
          <textarea
            id='agent-description'
            placeholder={
              isMobile ? 'Build an AI agent...' : 'Ask Sim to build an agent to read my emails...'
            }
            className='h-[100px] w-full resize-none px-3 py-2.5 text-sm sm:h-[120px] sm:px-4 sm:py-3 sm:text-base'
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              borderRadius: 16,
              border: 'var(--border-width-border, 1px) solid #E5E5E5',
              outline: 'none',
              background: '#FFFFFF',
              boxShadow:
                'var(--shadow-xs-offset-x, 0) var(--shadow-xs-offset-y, 2px) var(--shadow-xs-blur-radius, 4px) var(--shadow-xs-spread-radius, 0) var(--shadow-xs-color, rgba(0, 0, 0, 0.08))',
            }}
          />
          <button
            key={isEmpty ? 'empty' : 'filled'}
            type='button'
            aria-label='Submit description'
            className='absolute right-2.5 bottom-4 flex h-[30px] w-[30px] items-center justify-center transition-all duration-200 sm:right-[11px] sm:bottom-[16px] sm:h-[34px] sm:w-[34px]'
            disabled={isEmpty}
            onClick={handleSubmit}
            style={{
              padding: '3.75px 3.438px 3.75px 4.063px',
              borderRadius: 55,
              ...(isEmpty
                ? {
                    border: '0.625px solid #E0E0E0',
                    background: '#E5E5E5',
                    boxShadow: 'none',
                    cursor: 'not-allowed',
                  }
                : {
                    border: '0.625px solid #343434',
                    background: 'linear-gradient(180deg, #060606 0%, #323232 100%)',
                    boxShadow: '0 1.25px 2.5px 0 #9B77FF inset',
                    cursor: 'pointer',
                  }),
            }}
          >
            <ArrowUp size={18} className='sm:h-5 sm:w-5' color={isEmpty ? '#999999' : '#FFFFFF'} />
          </button>
        </div>
      </div>

      {/* Canvas - hidden on mobile */}
      {!isMobile && (
        <div className='mt-[60px] w-full max-w-[1308px] sm:mt-[127.5px]'>
          <LandingCanvas
            nodes={rfNodes}
            edges={rfEdges}
            groupBox={groupBox}
            worldWidth={worldWidth}
            viewportApiRef={viewportApiRef}
          />
        </div>
      )}
    </section>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: icon-button.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/icon-button.tsx
Signals: React

```typescript
'use client'

import type React from 'react'

interface IconButtonProps {
  children: React.ReactNode
  onClick?: () => void
  onMouseEnter?: () => void
  style?: React.CSSProperties
  'aria-label': string
  isAutoHovered?: boolean
}

export function IconButton({
  children,
  onClick,
  onMouseEnter,
  style,
  'aria-label': ariaLabel,
  isAutoHovered = false,
}: IconButtonProps) {
  return (
    <button
      type='button'
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`flex items-center justify-center rounded-xl border p-2 outline-none transition-all duration-300 ${
        isAutoHovered
          ? 'border-[#E5E5E5] shadow-[0_2px_4px_0_rgba(0,0,0,0.08)]'
          : 'border-transparent hover:border-[#E5E5E5] hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.08)]'
      }`}
      style={style}
    >
      {children}
    </button>
  )
}
```

--------------------------------------------------------------------------------

````

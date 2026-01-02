---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 505
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 505 of 933)

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

---[FILE: panel-left.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/panel-left.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * PanelLeft icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function PanelLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='16'
      height='14'
      viewBox='0 0 16 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M9.33301 0.5C10.4138 0.5 11.2687 0.499523 11.9482 0.580078C12.6403 0.662154 13.209 0.833996 13.6963 1.21777C14.0303 1.48085 14.3188 1.80524 14.5488 2.1748C14.8787 2.70489 15.0256 3.3188 15.0967 4.07715C15.1672 4.82972 15.167 5.77992 15.167 7C15.167 8.22008 15.1672 9.17028 15.0967 9.92285C15.0256 10.6812 14.8787 11.2951 14.5488 11.8252C14.3188 12.1948 14.0303 12.5191 13.6963 12.7822C13.209 13.166 12.6403 13.3378 11.9482 13.4199C11.2687 13.5005 10.4138 13.5 9.33301 13.5H6.66699C5.58622 13.5 4.73134 13.5005 4.05176 13.4199C3.35971 13.3378 2.79101 13.166 2.30371 12.7822C1.96974 12.5191 1.68123 12.1948 1.45117 11.8252C1.1213 11.2951 0.974405 10.6812 0.90332 9.92285C0.832808 9.17028 0.833008 8.22008 0.833008 7C0.833008 5.77992 0.832808 4.82972 0.90332 4.07715C0.974405 3.3188 1.1213 2.70489 1.45117 2.1748C1.68123 1.80524 1.96974 1.48085 2.30371 1.21777C2.79101 0.833996 3.35971 0.662154 4.05176 0.580078C4.73134 0.499523 5.58622 0.5 6.66699 0.5H9.33301ZM6.83301 12.5H9.33301C10.4382 12.5 11.2239 12.4988 11.8311 12.4268C12.4253 12.3563 12.7908 12.2234 13.0781 11.9971C13.3173 11.8086 13.5289 11.5721 13.7002 11.2969C13.9126 10.9555 14.036 10.5178 14.1006 9.8291C14.1657 9.13409 14.167 8.23916 14.167 7C14.167 5.76084 14.1657 4.86591 14.1006 4.1709C14.036 3.48215 13.9126 3.04452 13.7002 2.70312C13.5289 2.42788 13.3173 2.19139 13.0781 2.00293C12.7908 1.77661 12.4253 1.64375 11.8311 1.57324C11.2239 1.50125 10.4382 1.5 9.33301 1.5H6.83301V12.5ZM5.83301 1.50098C5.14755 1.50512 4.61095 1.52083 4.16895 1.57324C3.57469 1.64375 3.20925 1.77661 2.92188 2.00293C2.68266 2.19139 2.47113 2.42788 2.2998 2.70312C2.08736 3.04452 1.96397 3.48215 1.89941 4.1709C1.83432 4.86591 1.83301 5.76084 1.83301 7C1.83301 8.23916 1.83432 9.13409 1.89941 9.8291C1.96397 10.5178 2.08736 10.9555 2.2998 11.2969C2.47113 11.5721 2.68266 11.8086 2.92188 11.9971C3.20925 12.2234 3.57469 12.3563 4.16895 12.4268C4.61095 12.4792 5.14755 12.4939 5.83301 12.498V1.50098ZM4 5.16699C4.27614 5.16699 4.5 5.39085 4.5 5.66699C4.49982 5.94298 4.27603 6.16699 4 6.16699H3.33301C3.05712 6.16682 2.83318 5.94288 2.83301 5.66699C2.83301 5.39096 3.05702 5.16717 3.33301 5.16699H4ZM4 3.16699C4.27614 3.16699 4.5 3.39085 4.5 3.66699C4.49982 3.94298 4.27603 4.16699 4 4.16699H3.33301C3.05712 4.16682 2.83318 3.94288 2.83301 3.66699C2.83301 3.39096 3.05702 3.16717 3.33301 3.16699H4Z'
        fill='currentColor'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: play.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/play.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * Play icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function Play(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='10'
      height='10'
      viewBox='0 0 10 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M6.13231 1.69656C7.08485 2.23771 7.83339 2.66296 8.36666 3.0525C8.9036 3.44472 9.30069 3.85468 9.44293 4.39515C9.54724 4.79151 9.54724 5.20844 9.44293 5.6048C9.30069 6.14527 8.9036 6.55523 8.36666 6.94744C7.8334 7.33698 7.08487 7.76223 6.13234 8.30337L6.13233 8.30338L6.13231 8.30339C5.21218 8.82615 4.43625 9.26697 3.8472 9.51751C3.25341 9.77007 2.71208 9.89808 2.18595 9.74899C1.7993 9.63942 1.44748 9.43146 1.16407 9.14552C0.779435 8.75745 0.62504 8.22109 0.551993 7.5756C0.479482 6.93484 0.479486 6.09605 0.479492 5.0292V5.0292V4.97075V4.97075C0.479486 3.9039 0.479482 3.06511 0.551993 2.42435C0.62504 1.77886 0.779435 1.2425 1.16407 0.85443C1.44748 0.568491 1.7993 0.360528 2.18595 0.250961C2.71208 0.10187 3.25341 0.229878 3.8472 0.482438C4.43626 0.732984 5.21217 1.1738 6.13231 1.69656L6.13231 1.69656Z'
        fill='currentColor'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: redo.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/redo.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * Redo icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function Redo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M9.5 4.5H4C2.61929 4.5 1.5 5.61929 1.5 7C1.5 8.38071 2.61929 9.5 4 9.5H7'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8 2.5L10 4.5L8 6.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: rocket.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/rocket.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * Rocket icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function Rocket(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='10'
      height='12'
      viewBox='0 0 10 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M0.859375 11.9483C0.651042 12.0344 0.455833 12.0129 0.27375 11.8837C0.0916668 11.7546 0.000416667 11.577 0 11.3509V8.47686C0 8.26157 0.0495833 8.05705 0.14875 7.8633C0.247917 7.66954 0.385833 7.51346 0.5625 7.39505L1.25 6.92681C1.32292 7.79871 1.435 8.55221 1.58625 9.1873C1.7375 9.82239 1.98479 10.5436 2.32812 11.3509L0.859375 11.9483ZM3.625 11.0118C3.47917 11.0118 3.35417 10.9634 3.25 10.8665C3.14583 10.7696 3.06771 10.6512 3.01562 10.5113C2.73437 9.76857 2.52604 9.08246 2.39062 8.45296C2.25521 7.82347 2.1875 7.09947 2.1875 6.28095C2.1875 5.07536 2.39583 3.92638 2.8125 2.83402C3.22917 1.74167 3.79687 0.856199 4.51562 0.17762C4.57812 0.113035 4.65375 0.0671791 4.7425 0.0400531C4.83125 0.0129272 4.91708 -0.000420479 5 1.00915e-05C5.08292 0.000440662 5.16896 0.0140036 5.25812 0.0406989C5.34729 0.0673943 5.42271 0.113035 5.48437 0.17762C6.20312 0.855768 6.77083 1.74124 7.1875 2.83402C7.60417 3.92681 7.8125 5.07579 7.8125 6.28095C7.8125 7.1098 7.74479 7.83639 7.60937 8.46071C7.47396 9.08504 7.26562 9.76857 6.98437 10.5113C6.93229 10.6512 6.85417 10.7696 6.75 10.8665C6.64583 10.9634 6.52083 11.0118 6.375 11.0118H3.625ZM5 6.49085C5.34375 6.49085 5.63812 6.36448 5.88312 6.11174C6.12812 5.85899 6.25042 5.5548 6.25 5.19914C6.24958 4.84349 6.12729 4.53951 5.88312 4.2872C5.63896 4.03488 5.34458 3.90829 5 3.90743C4.65542 3.90657 4.36125 4.03316 4.1175 4.2872C3.87375 4.54123 3.75125 4.84522 3.75 5.19914C3.74875 5.55307 3.87125 5.85727 4.1175 6.11174C4.36375 6.3662 4.65792 6.49258 5 6.49085ZM9.14062 11.9483L7.67187 11.3509C8.01562 10.5436 8.26312 9.82239 8.41437 9.1873C8.56562 8.55221 8.6775 7.79871 8.75 6.92681L9.4375 7.39505C9.61458 7.51346 9.75271 7.66954 9.85187 7.8633C9.95104 8.05705 10.0004 8.26157 10 8.47686V11.3509C10 11.577 9.90896 11.7546 9.72687 11.8837C9.54479 12.0129 9.34937 12.0344 9.14062 11.9483Z'
        fill='currentColor'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: trash.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/trash.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * Trash icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function Trash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M7.01953 0.729492C7.31504 0.729492 7.56629 0.728543 7.77344 0.74707C7.98846 0.766337 8.18903 0.808188 8.38379 0.90918C8.46082 0.94915 8.53493 0.995966 8.60449 1.04785C8.78031 1.17908 8.90547 1.34127 9.0166 1.52637C9.12361 1.70466 9.23245 1.93044 9.36133 2.19629L9.63965 2.77051H12.25C12.4915 2.77051 12.6873 2.96654 12.6875 3.20801C12.6875 3.44963 12.4916 3.64551 12.25 3.64551H11.7861L11.4502 9.08301C11.4045 9.82153 11.3689 10.4069 11.2949 10.873C11.2199 11.3461 11.0996 11.7404 10.8594 12.085C10.6395 12.4002 10.3556 12.6662 10.0273 12.8662C9.66872 13.0846 9.26853 13.1808 8.79199 13.2266C8.32221 13.2716 7.73592 13.2705 6.99609 13.2705C6.25513 13.2705 5.66768 13.2717 5.19727 13.2266C4.72012 13.1808 4.31887 13.085 3.95996 12.8662C3.63147 12.6658 3.34869 12.3979 3.12891 12.082C2.8888 11.7369 2.76882 11.3428 2.69434 10.8691C2.62095 10.4024 2.58566 9.81663 2.54102 9.07715L2.21289 3.64551H1.75C1.50838 3.64551 1.3125 3.44963 1.3125 3.20801C1.31268 2.96654 1.50849 2.77051 1.75 2.77051H4.41602L4.65332 2.25195C4.77894 1.97637 4.88385 1.7424 4.98926 1.55762C5.09878 1.36567 5.22422 1.19722 5.40234 1.06055C5.47251 1.00674 5.54694 0.958523 5.625 0.916992C5.82327 0.811566 6.02891 0.768098 6.24902 0.748047C6.46075 0.728786 6.71692 0.729492 7.01953 0.729492ZM3.41406 9.02441C3.45972 9.78076 3.49227 10.3177 3.55762 10.7334C3.62187 11.1419 3.71262 11.3903 3.84668 11.583C3.99693 11.7989 4.19054 11.9811 4.41504 12.1182C4.61548 12.2404 4.86941 12.316 5.28125 12.3555C5.70019 12.3957 6.23815 12.3955 6.99609 12.3955C7.75281 12.3955 8.28967 12.3956 8.70801 12.3555C9.11897 12.3161 9.37203 12.241 9.57227 12.1191C9.79676 11.9824 9.99119 11.8005 10.1416 11.585C10.2758 11.3926 10.3659 11.1434 10.4307 10.7354C10.4965 10.3203 10.5305 9.78447 10.5771 9.0293L10.9102 3.64551H3.08984L3.41406 9.02441ZM5.54199 5.6875C5.78346 5.68768 5.97949 5.88349 5.97949 6.125V9.625C5.97949 9.86652 5.78347 10.0623 5.54199 10.0625C5.30037 10.0625 5.10449 9.86662 5.10449 9.625V6.125C5.1045 5.88338 5.30037 5.6875 5.54199 5.6875ZM8.45801 5.6875C8.69963 5.6875 8.8955 5.88338 8.89551 6.125V9.625C8.89551 9.86662 8.69963 10.0625 8.45801 10.0625C8.21653 10.0623 8.02051 9.86652 8.02051 9.625V6.125C8.02051 5.88349 8.21654 5.68768 8.45801 5.6875ZM7.01953 1.60449C6.7012 1.60449 6.49116 1.6043 6.32812 1.61914C6.17346 1.63324 6.09462 1.65837 6.03613 1.68945C6.00064 1.70833 5.96647 1.73042 5.93457 1.75488C5.88212 1.79519 5.82681 1.85666 5.75 1.99121C5.66883 2.13349 5.58138 2.32531 5.44922 2.61523L5.37793 2.77051H8.66699L8.57422 2.57812C8.43859 2.29835 8.34888 2.11363 8.2666 1.97656C8.18861 1.84665 8.13309 1.78785 8.08105 1.74902C8.04945 1.72545 8.01546 1.70468 7.98047 1.68652C7.92288 1.65669 7.84594 1.63264 7.69531 1.61914C7.53608 1.6049 7.33045 1.60449 7.01953 1.60449Z'
        fill='currentColor'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: trash2.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/trash2.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * Trash2 icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function Trash2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='14'
      height='15'
      viewBox='0 0 14 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M6.66699 0.000366211C7.00752 0.000913484 7.31388 -0.000648154 7.56543 0.0218506C7.942 0.0555623 8.29566 0.171188 8.59961 0.397827C8.82432 0.565423 8.98087 0.770393 9.11426 0.992554C9.23792 1.19859 9.36266 1.45603 9.50391 1.74744L9.78809 2.33435H12.667C13.035 2.33435 13.3337 2.63238 13.334 3.00037C13.334 3.36856 13.0352 3.66736 12.667 3.66736H12.085L11.7217 9.60486C11.6706 10.4402 11.63 11.1037 11.5469 11.6332C11.4616 12.176 11.3248 12.6283 11.0518 13.0238C10.8019 13.3856 10.4804 13.6918 10.1074 13.9213C9.69974 14.172 9.24394 14.2819 8.70215 14.3344H4.61816C4.07581 14.2818 3.61985 14.1715 3.21191 13.9203C2.83881 13.6904 2.51729 13.3841 2.26758 13.0219C1.9946 12.6257 1.8581 12.172 1.77344 11.6283C1.69093 11.0982 1.65154 10.4342 1.60156 9.59802L1.24707 3.66736H0.666992C0.298802 3.66736 0 3.36856 0 3.00037C0.000242997 2.63238 0.298952 2.33435 0.666992 2.33435H3.60645L3.84375 1.81384C3.98146 1.51171 4.10279 1.24514 4.22461 1.03162C4.35593 0.801489 4.5119 0.588935 4.73926 0.414429C5.04706 0.178295 5.40876 0.057893 5.79395 0.0228271C6.08383 -0.0035379 6.37607 -0.000101342 6.66699 0.000366211ZM5 6.14099C4.72412 6.14117 4.50018 6.36511 4.5 6.64099V10.641C4.50019 10.9169 4.72412 11.1408 5 11.141C5.27603 11.141 5.49981 10.917 5.5 10.641V6.64099C5.49982 6.365 5.27603 6.14099 5 6.14099ZM8.33398 6.14099C8.05795 6.14099 7.83416 6.365 7.83398 6.64099V10.641C7.83417 10.917 8.05796 11.141 8.33398 11.141C8.60986 11.1408 8.8338 10.9169 8.83398 10.641V6.64099C8.83381 6.36511 8.60987 6.14117 8.33398 6.14099ZM6.69043 1.33435C6.32322 1.33435 6.09122 1.33482 5.91406 1.35095C5.66491 1.37373 5.50939 1.47089 5.38281 1.69275C5.29982 1.83822 5.20966 2.03321 5.07227 2.33435H8.30664C8.15559 2.02281 8.05925 1.82498 7.97168 1.67908C7.8435 1.46553 7.68951 1.37173 7.44629 1.34998C7.27352 1.33453 7.04836 1.33435 6.69043 1.33435Z'
        fill='currentColor'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: undo.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/undo.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * Undo icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function Undo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M2.5 4.5H8C9.38071 4.5 10.5 5.61929 10.5 7C10.5 8.38071 9.38071 9.5 8 9.5H5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4 2.5L2 4.5L4 6.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: wrap.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/wrap.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * Wrap icon component - shows text wrapping to next line
 * @param props - SVG properties including className, fill, etc.
 */
export function Wrap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M3 6h18' />
      <path d='M3 12h15a3 3 0 1 1 0 6h-4' />
      <path d='m11 15 3 3-3 3' />
      <path d='M3 18h7' />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: zoom-in.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/zoom-in.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * ZoomIn icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function ZoomIn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <circle
        cx='5'
        cy='5'
        r='3.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M5 3.5V6.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3.5 5H6.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.5 7.5L10.5 10.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: zoom-out.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/zoom-out.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * ZoomOut icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function ZoomOut(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <circle
        cx='5'
        cy='5'
        r='3.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3.5 5H6.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.5 7.5L10.5 10.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: copy.module.css]---
Location: sim-main/apps/sim/components/emcn/icons/animate/copy.module.css

```text
/**
 * Copy icon animation
 * Creates a continuous flow where elements cycle through positions:
 * 1. Top-left segment moves away and disappears
 * 2. Bottom-right block slides to the top-left position
 * 3. New block appears in the bottom-right position
 */

@keyframes segment-cycle {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  25% {
    transform: translate(-8px, -8px);
    opacity: 0;
  }
  25.01% {
    transform: translate(4px, 4px);
    opacity: 0;
  }
  50% {
    transform: translate(4px, 4px);
    opacity: 0;
  }
  75% {
    transform: translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}

@keyframes block-slide {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  25% {
    transform: translate(0, 0);
    opacity: 1;
  }
  50% {
    transform: translate(-4px, -4px);
    opacity: 1;
  }
  75% {
    transform: translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}

.animated-copy-svg .rect-bottom-right {
  animation: block-slide 2s ease-in-out infinite;
  transform-box: fill-box;
}

.animated-copy-svg .rect-top-left {
  animation: segment-cycle 2s ease-in-out infinite;
  transform-box: fill-box;
}
```

--------------------------------------------------------------------------------

---[FILE: layout.module.css]---
Location: sim-main/apps/sim/components/emcn/icons/animate/layout.module.css

```text
/* Counterclockwise animations */
@keyframes move-top-right-ccw {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-11px, 0);
  }
  50% {
    transform: translate(-11px, 13px);
  }
  75% {
    transform: translate(0, 13px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes move-top-left-ccw {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(0, 9px);
  }
  50% {
    transform: translate(11px, 9px);
  }
  75% {
    transform: translate(11px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes move-bottom-left-ccw {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(11px, 0);
  }
  50% {
    transform: translate(11px, -13px);
  }
  75% {
    transform: translate(0, -13px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes move-bottom-right-ccw {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(0, -9px);
  }
  50% {
    transform: translate(-11px, -9px);
  }
  75% {
    transform: translate(-11px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

/* Clockwise animations */
@keyframes move-top-right-cw {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(0, 13px);
  }
  50% {
    transform: translate(-11px, 13px);
  }
  75% {
    transform: translate(-11px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes move-top-left-cw {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(11px, 0);
  }
  50% {
    transform: translate(11px, 9px);
  }
  75% {
    transform: translate(0, 9px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes move-bottom-left-cw {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(0, -13px);
  }
  50% {
    transform: translate(11px, -13px);
  }
  75% {
    transform: translate(11px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes move-bottom-right-cw {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-11px, 0);
  }
  50% {
    transform: translate(-11px, -9px);
  }
  75% {
    transform: translate(0, -9px);
  }
  100% {
    transform: translate(0, 0);
  }
}

/* Counterclockwise variant */
.animated-layout-svg .block-top-left {
  animation: move-top-left-ccw 2.5s ease-in-out infinite;
}

.animated-layout-svg .block-top-right {
  animation: move-top-right-ccw 2.5s ease-in-out infinite;
}

.animated-layout-svg .block-bottom-right {
  animation: move-bottom-right-ccw 2.5s ease-in-out infinite;
}

.animated-layout-svg .block-bottom-left {
  animation: move-bottom-left-ccw 2.5s ease-in-out infinite;
}

/* Clockwise variant overrides */
.animated-layout-svg.clockwise .block-top-left {
  animation: move-top-left-cw 2.5s ease-in-out infinite;
}

.animated-layout-svg.clockwise .block-top-right {
  animation: move-top-right-cw 2.5s ease-in-out infinite;
}

.animated-layout-svg.clockwise .block-bottom-right {
  animation: move-bottom-right-cw 2.5s ease-in-out infinite;
}

.animated-layout-svg.clockwise .block-bottom-left {
  animation: move-bottom-left-cw 2.5s ease-in-out infinite;
}
```

--------------------------------------------------------------------------------

---[FILE: document-icons.tsx]---
Location: sim-main/apps/sim/components/icons/document-icons.tsx
Signals: React

```typescript
import type React from 'react'

interface IconProps {
  className?: string
}

export const PdfIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#E53935'
    />
    <path d='M14 2V8H20' fill='#EF5350' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#C62828'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <text
      x='12'
      y='16'
      textAnchor='middle'
      fontSize='7'
      fontWeight='bold'
      fill='white'
      fontFamily='Arial, sans-serif'
    >
      PDF
    </text>
  </svg>
)

export const DocxIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#2196F3'
    />
    <path d='M14 2V8H20' fill='#64B5F6' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#1565C0'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <text
      x='12'
      y='16'
      textAnchor='middle'
      fontSize='8'
      fontWeight='bold'
      fill='white'
      fontFamily='Arial, sans-serif'
    >
      W
    </text>
  </svg>
)

export const XlsxIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#4CAF50'
    />
    <path d='M14 2V8H20' fill='#81C784' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#2E7D32'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <text
      x='12'
      y='16'
      textAnchor='middle'
      fontSize='8'
      fontWeight='bold'
      fill='white'
      fontFamily='Arial, sans-serif'
    >
      X
    </text>
  </svg>
)

export const CsvIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#4CAF50'
    />
    <path d='M14 2V8H20' fill='#81C784' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#2E7D32'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <g transform='translate(0, -1)'>
      <rect x='8' y='11' width='8' height='0.5' fill='white' />
      <rect x='8' y='13' width='8' height='0.5' fill='white' />
      <rect x='8' y='15' width='8' height='0.5' fill='white' />
      <rect x='11.75' y='11' width='0.5' height='6' fill='white' />
    </g>
  </svg>
)

export const TxtIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#757575'
    />
    <path d='M14 2V8H20' fill='#9E9E9E' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#424242'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <text
      x='12'
      y='16'
      textAnchor='middle'
      fontSize='6'
      fontWeight='bold'
      fill='white'
      fontFamily='Arial, sans-serif'
    >
      TXT
    </text>
  </svg>
)

export const DefaultFileIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#607D8B'
    />
    <path d='M14 2V8H20' fill='#90A4AE' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#37474F'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <rect x='8' y='13' width='8' height='1' fill='white' rx='0.5' />
    <rect x='8' y='15' width='8' height='1' fill='white' rx='0.5' />
    <rect x='8' y='17' width='5' height='1' fill='white' rx='0.5' />
  </svg>
)

// Helper function to get the appropriate icon component
export function getDocumentIcon(mimeType: string, filename: string): React.FC<IconProps> {
  const extension = filename.split('.').pop()?.toLowerCase()

  if (mimeType === 'application/pdf' || extension === 'pdf') {
    return PdfIcon
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    extension === 'docx' ||
    extension === 'doc'
  ) {
    return DocxIcon
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel' ||
    extension === 'xlsx' ||
    extension === 'xls'
  ) {
    return XlsxIcon
  }
  if (mimeType === 'text/csv' || extension === 'csv') {
    return CsvIcon
  }
  if (mimeType === 'text/plain' || extension === 'txt') {
    return TxtIcon
  }
  return DefaultFileIcon
}
```

--------------------------------------------------------------------------------

---[FILE: alert-dialog.tsx]---
Location: sim-main/apps/sim/components/ui/alert-dialog.tsx
Signals: React

```typescript
'use client'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/core/utils/cn'

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

// Context for communication between overlay and content
const AlertDialogCloseContext = React.createContext<{
  triggerClose: () => void
} | null>(null)

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, style, onClick, ...props }, ref) => {
  const [isStable, setIsStable] = React.useState(false)
  const closeContext = React.useContext(AlertDialogCloseContext)

  React.useEffect(() => {
    // Add a small delay before allowing overlay interactions to prevent rapid state changes
    const timer = setTimeout(() => setIsStable(true), 150)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[10000150] bg-white/50 data-[state=closed]:animate-out data-[state=open]:animate-in dark:bg-black/50',
        className
      )}
      style={{ backdropFilter: 'blur(1.5px)', ...style }}
      onClick={(e) => {
        // Only allow overlay clicks after component is stable
        if (!isStable) {
          e.preventDefault()
          return
        }
        // Only close if clicking directly on the overlay, not child elements
        if (e.target === e.currentTarget) {
          // Trigger close via context
          closeContext?.triggerClose()
        }
        // Call original onClick if provided
        onClick?.(e)
      }}
      {...props}
      ref={ref}
    />
  )
})
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
    hideCloseButton?: boolean
  }
>(({ className, children, hideCloseButton = false, ...props }, ref) => {
  const [isInteractionReady, setIsInteractionReady] = React.useState(false)
  const hiddenCancelRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    // Prevent rapid interactions that can cause instability
    const timer = setTimeout(() => setIsInteractionReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const closeContextValue = React.useMemo(
    () => ({
      triggerClose: () => hiddenCancelRef.current?.click(),
    }),
    []
  )

  return (
    <AlertDialogPortal>
      <AlertDialogCloseContext.Provider value={closeContextValue}>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-[10000151] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-3)] px-6 py-5 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in dark:bg-[var(--surface-3)]',
            className
          )}
          onPointerDown={(e) => {
            // Prevent event bubbling that might interfere with parent hover states
            e.stopPropagation()
          }}
          onPointerUp={(e) => {
            // Prevent event bubbling that might interfere with parent hover states
            e.stopPropagation()
          }}
          {...props}
        >
          {children}
          {!hideCloseButton && (
            <AlertDialogPrimitive.Cancel
              className='absolute top-4 right-4 h-4 w-4 border-0 bg-transparent p-0 text-muted-foreground transition-colors hover:bg-transparent hover:bg-transparent hover:text-foreground focus:outline-none disabled:pointer-events-none'
              disabled={!isInteractionReady}
              tabIndex={-1}
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </AlertDialogPrimitive.Cancel>
          )}
          {/* Hidden cancel button for overlay clicks */}
          <AlertDialogPrimitive.Cancel
            ref={hiddenCancelRef}
            style={{ display: 'none' }}
            tabIndex={-1}
            aria-hidden='true'
          />
        </AlertDialogPrimitive.Content>
      </AlertDialogCloseContext.Provider>
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('font-semibold text-lg', className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('font-[360] text-sm', className)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

--------------------------------------------------------------------------------

---[FILE: alert.tsx]---
Location: sim-main/apps/sim/components/ui/alert.tsx
Signals: React

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/core/utils/cn'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role='alert' className={cn(alertVariants({ variant }), className)} {...props} />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
```

--------------------------------------------------------------------------------

---[FILE: avatar.tsx]---
Location: sim-main/apps/sim/components/ui/avatar.tsx
Signals: React

```typescript
'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/core/utils/cn'

const avatarStatusVariants = cva(
  'flex items-center rounded-full size-2 border-2 border-background',
  {
    variants: {
      variant: {
        online: 'bg-green-600',
        offline: 'bg-zinc-600 dark:bg-zinc-300',
        busy: 'bg-yellow-600',
        away: 'bg-blue-600',
      },
    },
    defaultVariants: {
      variant: 'online',
    },
  }
)

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover object-center', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full border border-border bg-accent text-accent-foreground text-xs',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

function AvatarIndicator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot='avatar-indicator'
      className={cn('absolute flex size-6 items-center justify-center', className)}
      {...props}
    />
  )
}

function AvatarStatus({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof avatarStatusVariants>) {
  return (
    <div
      data-slot='avatar-status'
      className={cn(avatarStatusVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarIndicator, AvatarStatus, avatarStatusVariants }
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 817
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 817 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: aws-provider-badge.tsx]---
Location: prowler-master/ui/components/icons/providers-badge/aws-provider-badge.tsx
Signals: React

```typescript
import * as React from "react";

import { IconSvgProps } from "@/types";

export const AWSProviderBadge: React.FC<IconSvgProps> = ({
  size,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 256 256"
    width={size || width}
    {...props}
  >
    <g fill="none">
      <rect width="256" height="256" fill="#f4f2ed" rx="60" />
      <path
        fill="#252f3e"
        d="M84.745 111.961c0 2.434.263 4.407.723 5.855a35 35 0 0 0 2.106 4.737c.329.526.46 1.052.46 1.513c0 .658-.395 1.316-1.25 1.973l-4.145 2.764c-.592.394-1.184.592-1.71.592c-.658 0-1.316-.329-1.974-.921a20.4 20.4 0 0 1-2.368-3.092a51 51 0 0 1-2.04-3.882q-7.697 9.08-19.342 9.079c-5.526 0-9.934-1.579-13.158-4.737c-3.223-3.158-4.868-7.368-4.868-12.631c0-5.593 1.974-10.132 5.987-13.553s9.342-5.132 16.118-5.132c2.237 0 4.54.198 6.974.527s4.934.855 7.566 1.447v-4.803c0-5-1.053-8.487-3.092-10.526c-2.106-2.04-5.658-3.026-10.724-3.026c-2.303 0-4.671.263-7.105.855s-4.803 1.316-7.106 2.237a19 19 0 0 1-2.302.855c-.46.132-.79.198-1.053.198c-.92 0-1.382-.658-1.382-2.04v-3.224c0-1.052.132-1.842.461-2.302s.921-.921 1.842-1.382q3.454-1.776 8.29-2.96c3.223-.856 6.644-1.25 10.263-1.25c7.829 0 13.552 1.776 17.237 5.328c3.618 3.553 5.46 8.948 5.46 16.185v21.316zm-26.71 10c2.17 0 4.407-.395 6.776-1.185c2.368-.789 4.473-2.237 6.25-4.21c1.052-1.25 1.842-2.632 2.236-4.211s.658-3.487.658-5.723v-2.764a55 55 0 0 0-6.052-1.118a50 50 0 0 0-6.185-.395c-4.408 0-7.631.856-9.802 2.632s-3.224 4.276-3.224 7.566c0 3.092.79 5.394 2.434 6.973c1.58 1.645 3.882 2.435 6.908 2.435m52.828 7.105c-1.184 0-1.974-.198-2.5-.658c-.526-.395-.987-1.316-1.381-2.566l-15.46-50.855c-.396-1.316-.593-2.171-.593-2.632c0-1.052.526-1.645 1.579-1.645h6.447c1.25 0 2.106.198 2.566.658c.526.395.921 1.316 1.316 2.566l11.052 43.553l10.264-43.553c.329-1.316.723-2.17 1.25-2.566c.526-.394 1.447-.657 2.631-.657h5.263c1.25 0 2.106.197 2.632.657c.526.395.987 1.316 1.25 2.566l10.395 44.079l11.381-44.079c.395-1.316.856-2.17 1.316-2.566c.526-.394 1.382-.657 2.566-.657h6.118c1.053 0 1.645.526 1.645 1.644c0 .33-.066.658-.132 1.053c-.065.395-.197.92-.46 1.645l-15.855 50.855q-.593 1.974-1.382 2.566c-.526.394-1.382.658-2.5.658h-5.658c-1.25 0-2.105-.198-2.631-.658c-.527-.461-.987-1.316-1.25-2.632l-10.198-42.434l-10.131 42.368c-.329 1.316-.724 2.171-1.25 2.632c-.527.46-1.448.658-2.632.658zm84.54 1.776c-3.421 0-6.842-.395-10.132-1.184c-3.289-.79-5.855-1.645-7.566-2.632c-1.052-.592-1.776-1.25-2.039-1.842a4.65 4.65 0 0 1-.395-1.842v-3.355c0-1.382.526-2.04 1.513-2.04q.593 0 1.184.198c.395.131.987.394 1.645.658a35.8 35.8 0 0 0 7.237 2.302a39.5 39.5 0 0 0 7.829.79c4.145 0 7.368-.724 9.605-2.171c2.237-1.448 3.421-3.553 3.421-6.25c0-1.842-.592-3.356-1.776-4.606s-3.421-2.368-6.645-3.421l-9.539-2.96c-4.803-1.513-8.356-3.75-10.527-6.71c-2.171-2.895-3.289-6.12-3.289-9.54q0-4.144 1.776-7.303c1.184-2.105 2.763-3.947 4.737-5.394c1.974-1.514 4.211-2.632 6.842-3.422c2.632-.79 5.395-1.118 8.29-1.118c1.447 0 2.96.066 4.408.263c1.513.197 2.894.46 4.276.724c1.316.329 2.566.658 3.75 1.053q1.776.591 2.763 1.184c.921.526 1.579 1.052 1.974 1.644q.592.79.592 2.172v3.092c0 1.381-.526 2.105-1.513 2.105c-.527 0-1.382-.263-2.5-.79q-5.625-2.565-12.632-2.565c-3.75 0-6.71.592-8.75 1.842s-3.092 3.158-3.092 5.855c0 1.842.658 3.421 1.974 4.671s3.75 2.5 7.237 3.618l9.342 2.96c4.736 1.514 8.158 3.619 10.197 6.317s3.026 5.789 3.026 9.21c0 2.829-.592 5.395-1.71 7.632c-1.184 2.237-2.763 4.21-4.803 5.789c-2.039 1.645-4.474 2.829-7.302 3.685c-2.961.921-6.053 1.381-9.408 1.381"
      />
      <path
        fill="#f90"
        fillRule="evenodd"
        d="M207.837 162.816c-21.645 15.987-53.092 24.474-80.132 24.474c-37.894 0-72.04-14.014-97.829-37.303c-2.04-1.842-.197-4.342 2.237-2.895c27.895 16.184 62.303 25.987 97.895 25.987c24.013 0 50.395-5 74.671-15.263c3.618-1.645 6.71 2.368 3.158 5"
        clipRule="evenodd"
      />
      <path
        fill="#f90"
        fillRule="evenodd"
        d="M216.85 152.553c-2.763-3.553-18.289-1.711-25.329-.856c-2.105.264-2.434-1.579-.526-2.96c12.368-8.684 32.697-6.184 35.066-3.29c2.368 2.961-.658 23.29-12.237 33.027c-1.777 1.513-3.487.723-2.698-1.25c2.632-6.513 8.487-21.185 5.724-24.671"
        clipRule="evenodd"
      />
    </g>
  </svg>
);
```

--------------------------------------------------------------------------------

---[FILE: azure-provider-badge.tsx]---
Location: prowler-master/ui/components/icons/providers-badge/azure-provider-badge.tsx
Signals: React

```typescript
import * as React from "react";

import { IconSvgProps } from "@/types";

export const AzureProviderBadge: React.FC<IconSvgProps> = ({
  size,
  width,
  height,
  ...props
}) => {
  const uniqueId = React.useId();
  const gradientId0 = `azure-gradient-0-${uniqueId}`;
  const gradientId1 = `azure-gradient-1-${uniqueId}`;
  const gradientId2 = `azure-gradient-2-${uniqueId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 256 256"
      width={size || width}
      {...props}
    >
      <g fill="none">
        <rect width="256" height="256" fill="#f4f2ed" rx="60" />
        <path
          fill={`url(#${gradientId0})`}
          d="M94.674 34.002h59.182L92.42 216.032a9.44 9.44 0 0 1-8.94 6.419H37.422a9.42 9.42 0 0 1-9.318-8.026a9.4 9.4 0 0 1 .39-4.407L85.733 40.421A9.44 9.44 0 0 1 94.674 34z"
        />
        <path
          fill="#0078d4"
          d="M180.674 156.095H86.826a4.34 4.34 0 0 0-4.045 2.75a4.34 4.34 0 0 0 1.079 4.771l60.305 56.287a9.48 9.48 0 0 0 6.468 2.548h53.141z"
        />
        <path
          fill={`url(#${gradientId1})`}
          d="M94.675 34.002a9.36 9.36 0 0 0-8.962 6.544L28.565 209.863a9.412 9.412 0 0 0 8.882 12.588h47.247a10.1 10.1 0 0 0 7.75-6.592l11.397-33.586l40.708 37.968a9.63 9.63 0 0 0 6.059 2.21h52.943l-23.22-66.355l-67.689.016l41.428-122.11z"
        />
        <path
          fill={`url(#${gradientId2})`}
          d="M170.264 40.412a9.42 9.42 0 0 0-8.928-6.41H95.379a9.42 9.42 0 0 1 8.928 6.41l57.241 169.604a9.43 9.43 0 0 1-1.273 8.509a9.43 9.43 0 0 1-7.655 3.928h65.959a9.43 9.43 0 0 0 7.654-3.929a9.42 9.42 0 0 0 1.272-8.508z"
        />
        <defs>
          <linearGradient
            id={gradientId0}
            x1="116.244"
            x2="54.783"
            y1="47.967"
            y2="229.54"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#114a8b" />
            <stop offset="1" stopColor="#0669bc" />
          </linearGradient>
          <linearGradient
            id={gradientId1}
            x1="135.444"
            x2="121.227"
            y1="132.585"
            y2="137.392"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopOpacity="0.3" />
            <stop offset="0.071" stopOpacity="0.2" />
            <stop offset="0.321" stopOpacity="0.1" />
            <stop offset="0.623" stopOpacity="0.05" />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={gradientId2}
            x1="127.625"
            x2="195.091"
            y1="42.671"
            y2="222.414"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3ccbf4" />
            <stop offset="1" stopColor="#2892df" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: gcp-provider-badge.tsx]---
Location: prowler-master/ui/components/icons/providers-badge/gcp-provider-badge.tsx
Signals: React

```typescript
import * as React from "react";

import { IconSvgProps } from "@/types";

export const GCPProviderBadge: React.FC<IconSvgProps> = ({
  size,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 256 256"
    width={size || width}
    {...props}
  >
    <g fill="none">
      <rect width="256" height="256" fill="#f4f2ed" rx="60" />
      <path
        fill="#ea4335"
        d="m161.009 92.39l17.385-17.386l1.159-7.32c-31.68-28.807-82.04-25.54-110.6 6.816c-7.932 8.986-13.817 20.19-16.955 31.76l6.226-.878l34.77-5.733l2.684-2.745c15.466-16.986 41.617-19.272 59.475-4.82z"
      />
      <path
        fill="#4285f4"
        d="M203.16 105.749a78.3 78.3 0 0 0-23.607-38.064l-24.4 24.4a43.37 43.37 0 0 1 15.921 34.404v4.331c11.993 0 21.716 9.722 21.716 21.715s-9.723 21.473-21.716 21.473h-43.493l-4.27 4.636v26.047l4.27 4.087h43.493c31.195.243 56.681-24.605 56.924-55.8a56.48 56.48 0 0 0-24.838-47.229"
      />
      <path
        fill="#34a853"
        d="M84.149 208.778h43.432v-34.77H84.149a21.3 21.3 0 0 1-8.906-1.952l-6.161 1.891l-17.507 17.385l-1.525 5.917c9.818 7.413 21.796 11.582 34.099 11.529"
      />
      <path
        fill="#fbbc05"
        d="M84.149 95.989C52.953 96.175 27.815 121.615 28 152.81a56.49 56.49 0 0 0 22.049 44.438l25.193-25.193c-10.93-4.938-15.787-17.802-10.849-28.731s17.802-15.787 28.73-10.85a21.72 21.72 0 0 1 10.85 10.85l25.193-25.193a56.42 56.42 0 0 0-45.018-22.143"
      />
    </g>
  </svg>
);
```

--------------------------------------------------------------------------------

---[FILE: github-provider-badge.tsx]---
Location: prowler-master/ui/components/icons/providers-badge/github-provider-badge.tsx
Signals: React

```typescript
import * as React from "react";

import { IconSvgProps } from "@/types";

export const GitHubProviderBadge: React.FC<IconSvgProps> = ({
  size,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 98 96"
    width={size || width}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      fill="currentColor"
    />
  </svg>
);
```

--------------------------------------------------------------------------------

---[FILE: iac-provider-badge.tsx]---
Location: prowler-master/ui/components/icons/providers-badge/iac-provider-badge.tsx
Signals: React

```typescript
import * as React from "react";

import { IconSvgProps } from "@/types";

export const IacProviderBadge: React.FC<IconSvgProps> = ({
  size,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M13 21L17 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 8L3 12L7 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 8L21 12L17 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/icons/providers-badge/index.ts

```typescript
import { IconSvgProps } from "@/types";

import { AWSProviderBadge } from "./aws-provider-badge";
import { AzureProviderBadge } from "./azure-provider-badge";
import { GCPProviderBadge } from "./gcp-provider-badge";
import { GitHubProviderBadge } from "./github-provider-badge";
import { IacProviderBadge } from "./iac-provider-badge";
import { KS8ProviderBadge } from "./ks8-provider-badge";
import { M365ProviderBadge } from "./m365-provider-badge";
import { MongoDBAtlasProviderBadge } from "./mongodbatlas-provider-badge";
import { OracleCloudProviderBadge } from "./oraclecloud-provider-badge";

export {
  AWSProviderBadge,
  AzureProviderBadge,
  GCPProviderBadge,
  GitHubProviderBadge,
  IacProviderBadge,
  KS8ProviderBadge,
  M365ProviderBadge,
  MongoDBAtlasProviderBadge,
  OracleCloudProviderBadge,
};

// Map provider display names to their icon components
export const PROVIDER_ICONS: Record<string, React.FC<IconSvgProps>> = {
  AWS: AWSProviderBadge,
  Azure: AzureProviderBadge,
  "Google Cloud": GCPProviderBadge,
  Kubernetes: KS8ProviderBadge,
  "Microsoft 365": M365ProviderBadge,
  GitHub: GitHubProviderBadge,
  "Infrastructure as Code": IacProviderBadge,
  "Oracle Cloud Infrastructure": OracleCloudProviderBadge,
  "MongoDB Atlas": MongoDBAtlasProviderBadge,
};
```

--------------------------------------------------------------------------------

---[FILE: ks8-provider-badge.tsx]---
Location: prowler-master/ui/components/icons/providers-badge/ks8-provider-badge.tsx
Signals: React

```typescript
import * as React from "react";

import { IconSvgProps } from "@/types";

export const KS8ProviderBadge: React.FC<IconSvgProps> = ({
  size,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 256 256"
    width={size || width}
    {...props}
  >
    <g fill="none">
      <rect width="256" height="256" fill="#326ce5" rx="60" />
      <path
        fill="#fff"
        stroke="#fff"
        strokeWidth=".11"
        d="M128.073 30a6.014 6.014 0 0 0-5.589 6.314v1.605c.153 1.817.426 3.617.785 5.4a53 53 0 0 1 .563 10.326 6.23 6.23 0 0 1-1.86 2.943l-.128 2.407c-3.456.29-6.886.819-10.265 1.587a73.1 73.1 0 0 0-37.153 21.204l-2.047-1.45a4.42 4.42 0 0 1-3.37-.342 53 53 0 0 1-7.655-6.912 47 47 0 0 0-3.729-3.967l-1.263-1.007a6.82 6.82 0 0 0-3.95-1.493 5.46 5.46 0 0 0-4.531 2.013 6.02 6.02 0 0 0 1.4 8.388l1.177.939a47 47 0 0 0 4.71 2.756 49 49 0 0 1 8.516 5.973 6.3 6.3 0 0 1 1.134 3.276l1.86 1.707a73.54 73.54 0 0 0-11.587 51.248l-2.39.683a7.8 7.8 0 0 1-2.44 2.457 53 53 0 0 1-10.188 1.681 48 48 0 0 0-5.46.427l-1.511.341h-.17a5.716 5.716 0 0 0-4.791 6.924 5.7 5.7 0 0 0 1.488 2.736 5.72 5.72 0 0 0 5.836 1.407h.111l1.536-.17a46 46 0 0 0 5.103-1.86 53 53 0 0 1 9.915-2.901 6.2 6.2 0 0 1 3.26 1.151l2.56-.426a73.92 73.92 0 0 0 32.766 40.983l-1.041 2.176a5.7 5.7 0 0 1 .512 3.208 55 55 0 0 1-5.146 9.318 48 48 0 0 0-3.054 4.548l-.726 1.536a5.72 5.72 0 0 0 2.49 8.015 5.7 5.7 0 0 0 3.057.527 5.72 5.72 0 0 0 4.719-3.687l.707-1.45a47 47 0 0 0 1.639-5.205c1.51-3.729 2.33-7.731 4.394-10.206a4.6 4.6 0 0 1 2.441-1.194l1.28-2.33a73.55 73.55 0 0 0 52.443.128l1.134 2.176a4.44 4.44 0 0 1 2.902 1.749 54 54 0 0 1 3.891 9.557 48 48 0 0 0 1.655 5.214l.708 1.45a5.72 5.72 0 0 0 7.784 3.154 5.7 5.7 0 0 0 2.345-2.036 5.71 5.71 0 0 0 .136-5.981l-.742-1.536a47 47 0 0 0-3.055-4.531c-1.962-2.833-3.652-5.854-5.12-9.019a4.43 4.43 0 0 1 .581-3.414 20 20 0 0 1-.948-2.295 74.02 74.02 0 0 0 32.622-41.128l2.423.426a4.53 4.53 0 0 1 3.183-1.177c3.387.648 6.706 1.706 9.915 2.901a43 43 0 0 0 5.102 1.963c.41.111 1.007.204 1.468.315h.111a5.71 5.71 0 0 0 5.823-1.421 5.7 5.7 0 0 0 1.504-2.729 5.7 5.7 0 0 0-.151-3.111 5.72 5.72 0 0 0-4.642-3.806l-1.655-.392a48 48 0 0 0-5.461-.427 52 52 0 0 1-10.188-1.681 6.4 6.4 0 0 1-2.458-2.457l-2.304-.683a73.8 73.8 0 0 0-11.826-51.137l2.014-1.86a4.5 4.5 0 0 1 1.058-3.226 53.6 53.6 0 0 1 8.447-5.939 48 48 0 0 0 4.71-2.756l1.246-1.007a5.72 5.72 0 0 0 1.456-8.42 5.716 5.716 0 0 0-8.53-.463l-1.262 1.007a48 48 0 0 0-3.729 3.968 53.3 53.3 0 0 1-7.45 7.023 6.3 6.3 0 0 1-3.447.375l-2.159 1.536a74.55 74.55 0 0 0-47.229-22.783c0-.853-.111-2.133-.128-2.534a4.48 4.48 0 0 1-1.86-2.833 53 53 0 0 1 .648-10.3c.367-1.791.623-3.583.785-5.4v-1.707a6.01 6.01 0 0 0-5.589-6.314zm-7.117 44.08-1.706 29.806h-.128c-.086 1.843-1.169 3.413-2.833 4.301-1.664.887-3.635.623-5.12-.461L86.722 90.404a58.54 58.54 0 0 1 28.184-15.35 60 60 0 0 1 6.033-.973zm14.233 0a59.1 59.1 0 0 1 34.046 16.418l-24.216 17.211a5.02 5.02 0 0 1-5.274.614 5.02 5.02 0 0 1-2.867-4.471zm-57.34 27.536 22.355 19.95v.128a5.02 5.02 0 0 1 1.587 4.898 5.02 5.02 0 0 1-3.558 3.712v.085l-28.687 8.251a58.53 58.53 0 0 1 8.31-37.032zm100.286 0a59.58 59.58 0 0 1 8.55 36.922l-28.73-8.277v-.111a4.96 4.96 0 0 1-3.559-3.712 5.05 5.05 0 0 1 1.588-4.897l22.185-19.856zm-54.645 21.503h9.148l5.589 7.099-2.031 8.875-8.217 3.95-8.235-3.95-1.937-8.875zm29.302 24.216a5.3 5.3 0 0 1 1.152 0l29.584 4.992c-4.267 12.287-12.689 22.783-23.679 29.805l-11.434-27.68a5 5 0 0 1-.383-2.354 5.04 5.04 0 0 1 4.726-4.635zm-49.687.128a5.03 5.03 0 0 1 4.13 2.287 4.99 4.99 0 0 1 .401 4.693v.111l-11.365 27.459a58.7 58.7 0 0 1-23.534-29.498l29.327-4.975q.489-.051.99 0zm24.78 11.946a5.04 5.04 0 0 1 4.582 2.628h.111l14.455 26.085-5.777 1.707a58.83 58.83 0 0 1-32.067-1.655l14.506-26.085c.879-1.536 2.5-2.475 4.267-2.518z"
      />
    </g>
  </svg>
);
```

--------------------------------------------------------------------------------

---[FILE: m365-provider-badge.tsx]---
Location: prowler-master/ui/components/icons/providers-badge/m365-provider-badge.tsx
Signals: React

```typescript
import type { FC } from "react";
import { useId } from "react";

import type { IconSvgProps } from "@/types";

export const M365ProviderBadge: FC<IconSvgProps> = ({
  size,
  width,
  height,
  ...props
}) => {
  const uniqueId = useId();
  const gradientId0 = `m365-gradient-0-${uniqueId}`;
  const gradientId1 = `m365-gradient-1-${uniqueId}`;
  const gradientId2 = `m365-gradient-2-${uniqueId}`;
  const gradientId4 = `m365-gradient-4-${uniqueId}`;
  const clipId0 = `m365-clip-0-${uniqueId}`;
  const clipId1 = `m365-clip-1-${uniqueId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 256 256"
      width={size || width}
      {...props}
    >
      <g>
        <rect width="256" height="256" rx="60" fill="#f4f2ed" />
        <g transform="scale(3.1) translate(2 2)">
          <g clipPath={`url(#${clipId0})`}>
            <g clipPath={`url(#${clipId1})`}>
              <path
                d="M53.1574 10.3146C52.1706 7.19669 49.2773 5.07764 46.007 5.07764L43.5352 5.07764C39.9228 5.07764 36.8237 7.65268 36.1621 11.2039L32.4891 30.9179L33.5912 27.2788C34.5491 24.1158 37.4644 21.9526 40.7692 21.9526H52.2499L58.8326 24.2562L62.3337 21.9644C59.0634 21.9644 56.1701 19.8336 55.1833 16.7157L53.1574 10.3146Z"
                fill={`url(#${gradientId0})`}
              />
              <path
                d="M20.615 62.8082C21.5914 65.9426 24.4927 68.0777 27.7757 68.0777H32.6415C36.7421 68.0777 40.0824 64.7845 40.1408 60.6844L40.3984 42.5737L39.4114 45.86C38.459 49.0313 35.5396 51.2027 32.2284 51.2027H20.75L14.8141 48.4965L11.4807 51.2027C14.7636 51.2027 17.665 53.3378 18.6414 56.4722L20.615 62.8082Z"
                fill={`url(#${gradientId1})`}
              />
              <path
                d="M45.5 5.07764H19.25C11.75 5.07764 7.25001 14.7496 4.25002 24.4216C0.695797 35.8804 -3.95498 51.2056 9.50001 51.2056H20.931C24.2656 51.2056 27.1975 49.0121 28.135 45.812C30.1073 39.0797 33.5545 27.3661 36.2631 18.446C37.6417 13.906 38.79 10.007 40.5523 7.57888C41.5404 6.21761 43.1871 5.07764 45.5 5.07764Z"
                fill={`url(#${gradientId2})`}
              />
              <path
                d="M27.4946 68.0776H53.7446C61.2446 68.0776 65.7446 58.4071 68.7446 48.7365C72.2988 37.2794 76.9496 21.9565 63.4946 21.9565H52.0633C48.7288 21.9565 45.797 24.1499 44.8594 27.3499C42.8871 34.0812 39.44 45.7927 36.7314 54.7113C35.3529 59.2506 34.2046 63.149 32.4422 65.5768C31.4542 66.9378 29.8075 68.0776 27.4946 68.0776Z"
                fill={`url(#${gradientId4})`}
              />
              <rect
                x="24.125"
                y="51.2031"
                width="48.375"
                height="21.375"
                rx="3.63727"
                fill="#131313"
              />
              <text
                x="27.5"
                y="67"
                fill="#ffffff"
                fontFamily="Inter, Arial, sans-serif"
                fontSize="16"
                fontWeight="700"
              >
                M365
              </text>
            </g>
          </g>
          <defs>
            <radialGradient
              id={gradientId0}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(59.4363 31.0868) rotate(-130.285) scale(27.6431 26.1575)"
            >
              <stop offset="0.0955758" stopColor="#00AEFF" />
              <stop offset="0.773185" stopColor="#2253CE" />
              <stop offset="1" stopColor="#0736C4" />
            </radialGradient>
            <radialGradient
              id={gradientId1}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(15.3608 50.9716) rotate(50.2556) scale(25.0142 24.5538)"
            >
              <stop stopColor="#FFB657" />
              <stop offset="0.633728" stopColor="#FF5F3D" />
              <stop offset="0.923392" stopColor="#C02B3C" />
            </radialGradient>
            <linearGradient
              id={gradientId2}
              x1="17.6789"
              y1="10.6669"
              x2="21.2461"
              y2="52.961"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.156162" stopColor="#0D91E1" />
              <stop offset="0.487484" stopColor="#52B471" />
              <stop offset="0.652394" stopColor="#98BD42" />
              <stop offset="0.937361" stopColor="#FFC800" />
            </linearGradient>
            <radialGradient
              id={gradientId4}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(64.843 17.441) rotate(109.722) scale(61.4524 75.0539)"
            >
              <stop offset="0.0661714" stopColor="#8C48FF" />
              <stop offset="0.5" stopColor="#F2598A" />
              <stop offset="0.895833" stopColor="#FFB152" />
            </radialGradient>
            <clipPath id={clipId0}>
              <rect
                width="72"
                height="72"
                fill="white"
                transform="translate(0.5 0.578125)"
              />
            </clipPath>
            <clipPath id={clipId1}>
              <rect
                width="72"
                height="72"
                fill="white"
                transform="translate(0.5 0.578125)"
              />
            </clipPath>
          </defs>
        </g>
      </g>
    </svg>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: mongodbatlas-provider-badge.tsx]---
Location: prowler-master/ui/components/icons/providers-badge/mongodbatlas-provider-badge.tsx
Signals: React

```typescript
import * as React from "react";

import { IconSvgProps } from "@/types";

export const MongoDBAtlasProviderBadge: React.FC<IconSvgProps> = ({
  size,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 256 256"
    width={size || width}
    {...props}
  >
    <g fill="none">
      <rect width="256" height="256" fill="#e6f4ec" rx="60" />
      <g transform="translate(128 128) scale(7.25) translate(-16 -16)">
        <path
          d="M15.9.087l.854 1.604c.192.296.4.558.645.802.715.715 1.394 1.464 2.004 2.266 1.447 1.9 2.423 4.01 3.12 6.292.418 1.394.645 2.824.662 4.27.07 4.323-1.412 8.035-4.4 11.12-.488.488-1.01.94-1.57 1.342-.296 0-.436-.227-.558-.436-.227-.383-.366-.82-.436-1.255-.105-.523-.174-1.046-.14-1.586v-.244C16.057 24.21 15.796.21 15.9.087z"
          fill="#599636"
        />
        <path
          d="M15.9.034c-.035-.07-.07-.017-.105.017.017.35-.105.662-.296.96-.21.296-.488.523-.767.767-1.55 1.342-2.77 2.963-3.747 4.776-1.3 2.44-1.97 5.055-2.16 7.808-.087.993.314 4.497.627 5.508.854 2.684 2.388 4.933 4.375 6.885.488.47 1.01.906 1.55 1.325.157 0 .174-.14.21-.244a4.78 4.78 0 0 0 .157-.68l.35-2.614L15.9.034z"
          fill="#6cac48"
        />
        <path
          d="M16.754 28.845c.035-.4.227-.732.436-1.063-.21-.087-.366-.26-.488-.453-.105-.174-.192-.383-.26-.575-.244-.732-.296-1.5-.366-2.248v-.453c-.087.07-.105.662-.105.75a17.37 17.37 0 0 1-.314 2.353c-.052.314-.087.627-.28.906 0 .035 0 .07.017.122.314.924.4 1.865.453 2.824v.35c0 .418-.017.33.33.47.14.052.296.07.436.174.105 0 .122-.087.122-.157l-.052-.575v-1.604c-.017-.28.035-.558.07-.82z"
          fill="#c2bfbf"
        />
      </g>
    </g>
  </svg>
);
```

--------------------------------------------------------------------------------

---[FILE: oraclecloud-provider-badge.tsx]---
Location: prowler-master/ui/components/icons/providers-badge/oraclecloud-provider-badge.tsx
Signals: React

```typescript
import * as React from "react";

import { IconSvgProps } from "@/types";

export const OracleCloudProviderBadge: React.FC<IconSvgProps> = ({
  size,
  width,
  height,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 256 256"
    width={size || width}
    {...props}
  >
    <g fill="none">
      <rect width="256" height="256" fill="#f4f2ed" rx="60" />
      <path
        fill="#c74634"
        d="M 56 128
           C 56 101.5 87.2 80 128 80
           C 168.8 80 200 101.5 200 128
           C 200 154.5 168.8 176 128 176
           C 87.2 176 56 154.5 56 128 Z
           M 72 128
           C 72 145.7 96.5 160 128 160
           C 159.5 160 184 145.7 184 128
           C 184 110.3 159.5 96 128 96
           C 96.5 96 72 110.3 72 128 Z"
        fillRule="evenodd"
      />
    </g>
  </svg>
);
```

--------------------------------------------------------------------------------

---[FILE: ProwlerIcons.tsx]---
Location: prowler-master/ui/components/icons/prowler/ProwlerIcons.tsx
Signals: React

```typescript
import React from "react";

import { IconSvgProps } from "../../../types/index";

export const ProwlerExtended: React.FC<IconSvgProps> = ({
  size,
  width = 216,
  height,
  ...props
}) => {
  return (
    <svg
      className="text-prowler-black dark:text-prowler-white"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1233.67 204.4"
      fill="none"
      height={size || height}
      width={size || width}
      color="evenodd"
      {...props}
    >
      <path
        className="cls-1"
        d="M1169.38 132.04c20.76-12.21 34.44-34.9 34.44-59.79 0-38.18-31.06-69.25-69.25-69.25l-216.9.23V148.4h-64.8V3h-79.95l-47.14 95.97V3h-52.09l-47.14 95.97V3h-53.48v69.6C560.37 30.64 521.34 0 475.28 0c-42.63 0-79.24 26.25-94.54 63.43C376.39 29.4 347.26 3 312.07 3H212.06v47.43C202.9 22.91 176.91 3 146.35 3H0l46.34 46.33v151.64h53.47v-76.68l17.21 17.21h29.33c30.56 0 56.54-19.91 65.71-47.43v106.91h53.48v-81.51l76.01 81.51h69.62l-64.29-68.94c11.14-6.56 20.22-16.15 26.26-27.46 1.27 55.26 46.58 99.82 102.14 99.82 46.06 0 85.09-30.64 97.81-72.6v69.18h60.88l38.34-78.06v78.06h60.88l66.2-134.78v135.69h95.41l22.86-22.86v22.86h95.05l21.84-21.84v20.93h53.48v-81.5l76.01 81.5h69.62l-64.29-68.94ZM146.35 88.02H99.81V56.48h46.54c8.7 0 15.77 7.07 15.77 15.77s-7.07 15.77-15.77 15.77Zm165.72 0-46.54-.18V56.48h46.54c8.7 0 15.77 7.07 15.77 15.77s-7.08 15.77-15.77 15.77Zm163.21 62.9c-26.86 0-48.72-21.86-48.72-48.72s21.86-48.72 48.72-48.72S524 75.34 524 102.2s-21.86 48.72-48.72 48.72Zm559.28-2.51h-63.41v-20.35h42.91V77.18h-42.91V56.72h63.41v91.69Zm100.01-60.39-46.54-.18V56.48h46.54c8.7 0 15.77 7.07 15.77 15.77s-7.07 15.77-15.77 15.77Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const ProwlerShort: React.FC<IconSvgProps> = ({
  size,
  width = 30,
  height,
  ...props
}) => (
  <svg
    className="text-prowler-black dark:text-prowler-white"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 432.08 396.77"
    fill="none"
    height={size || height}
    width={size || width}
    color="evenodd"
    {...props}
  >
    <path
      className="cls-1"
      d="M293.3.01H0s92.87,92.85,92.87,92.85v303.9h107.17v-153.68l34.48,34.49h58.78c76.52,0,138.78-62.26,138.78-138.78S369.82.01,293.3.01ZM293.3,170.4h-93.27v-63.21h93.27c17.43,0,31.6,14.18,31.6,31.6s-14.18,31.6-31.6,31.6Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      color="evenodd"
    />
  </svg>
);
```

--------------------------------------------------------------------------------

````

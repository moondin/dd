---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 780
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 780 of 867)

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

---[FILE: threat-map.adapter.ts]---
Location: prowler-master/ui/actions/overview/regions/threat-map.adapter.ts

```typescript
import { getProviderDisplayName } from "@/types/providers";

import { RegionsOverviewResponse } from "./types";

export interface ThreatMapLocation {
  id: string;
  name: string;
  region: string;
  regionCode: string;
  providerType: string;
  coordinates: [number, number];
  totalFindings: number;
  failFindings: number;
  riskLevel: "low-high" | "high" | "critical";
  severityData: Array<{
    name: string;
    value: number;
    percentage?: number;
    color?: string;
  }>;
  change?: number;
}

export interface ThreatMapData {
  locations: ThreatMapLocation[];
  regions: string[];
}

const AWS_REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "us-east-1": { lat: 37.5, lng: -77.5 }, // N. Virginia
  "us-east-2": { lat: 40.0, lng: -83.0 }, // Ohio
  "us-west-1": { lat: 37.8, lng: -122.4 }, // N. California
  "us-west-2": { lat: 45.5, lng: -122.7 }, // Oregon
  "af-south-1": { lat: -33.9, lng: 18.4 }, // Cape Town
  "ap-east-1": { lat: 22.3, lng: 114.2 }, // Hong Kong
  "ap-south-1": { lat: 19.1, lng: 72.9 }, // Mumbai
  "ap-south-2": { lat: 17.4, lng: 78.5 }, // Hyderabad
  "ap-northeast-1": { lat: 35.7, lng: 139.7 }, // Tokyo
  "ap-northeast-2": { lat: 37.6, lng: 127.0 }, // Seoul
  "ap-northeast-3": { lat: 34.7, lng: 135.5 }, // Osaka
  "ap-southeast-1": { lat: 1.4, lng: 103.8 }, // Singapore
  "ap-southeast-2": { lat: -33.9, lng: 151.2 }, // Sydney
  "ap-southeast-3": { lat: -6.2, lng: 106.8 }, // Jakarta
  "ap-southeast-4": { lat: -37.8, lng: 144.96 }, // Melbourne
  "ca-central-1": { lat: 45.5, lng: -73.6 }, // Montreal
  "ca-west-1": { lat: 51.0, lng: -114.1 }, // Calgary
  "eu-central-1": { lat: 50.1, lng: 8.7 }, // Frankfurt
  "eu-central-2": { lat: 47.4, lng: 8.5 }, // Zurich
  "eu-west-1": { lat: 53.3, lng: -6.3 }, // Ireland
  "eu-west-2": { lat: 51.5, lng: -0.1 }, // London
  "eu-west-3": { lat: 48.9, lng: 2.3 }, // Paris
  "eu-north-1": { lat: 59.3, lng: 18.1 }, // Stockholm
  "eu-south-1": { lat: 45.5, lng: 9.2 }, // Milan
  "eu-south-2": { lat: 40.4, lng: -3.7 }, // Spain
  "il-central-1": { lat: 32.1, lng: 34.8 }, // Tel Aviv
  "me-central-1": { lat: 25.3, lng: 55.3 }, // UAE
  "me-south-1": { lat: 26.1, lng: 50.6 }, // Bahrain
  "sa-east-1": { lat: -23.5, lng: -46.6 }, // São Paulo
};

const AZURE_REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  eastus: { lat: 37.5, lng: -79.0 },
  eastus2: { lat: 36.7, lng: -78.9 },
  westus: { lat: 37.8, lng: -122.4 },
  westus2: { lat: 47.6, lng: -122.3 },
  westus3: { lat: 33.4, lng: -112.1 },
  centralus: { lat: 41.6, lng: -93.6 },
  northcentralus: { lat: 41.9, lng: -87.6 },
  southcentralus: { lat: 29.4, lng: -98.5 },
  westcentralus: { lat: 40.9, lng: -110.0 },
  canadacentral: { lat: 43.7, lng: -79.4 },
  canadaeast: { lat: 46.8, lng: -71.2 },
  brazilsouth: { lat: -23.5, lng: -46.6 },
  northeurope: { lat: 53.3, lng: -6.3 },
  westeurope: { lat: 52.4, lng: 4.9 },
  uksouth: { lat: 51.5, lng: -0.1 },
  ukwest: { lat: 53.4, lng: -3.0 },
  francecentral: { lat: 46.3, lng: 2.4 },
  francesouth: { lat: 43.8, lng: 2.1 },
  switzerlandnorth: { lat: 47.5, lng: 8.5 },
  switzerlandwest: { lat: 46.2, lng: 6.1 },
  germanywestcentral: { lat: 50.1, lng: 8.7 },
  germanynorth: { lat: 53.1, lng: 8.8 },
  norwayeast: { lat: 59.9, lng: 10.7 },
  norwaywest: { lat: 58.97, lng: 5.73 },
  swedencentral: { lat: 60.67, lng: 17.14 },
  polandcentral: { lat: 52.23, lng: 21.01 },
  italynorth: { lat: 45.5, lng: 9.2 },
  spaincentral: { lat: 40.4, lng: -3.7 },
  australiaeast: { lat: -33.9, lng: 151.2 },
  australiasoutheast: { lat: -37.8, lng: 145.0 },
  australiacentral: { lat: -35.3, lng: 149.1 },
  eastasia: { lat: 22.3, lng: 114.2 },
  southeastasia: { lat: 1.3, lng: 103.8 },
  japaneast: { lat: 35.7, lng: 139.7 },
  japanwest: { lat: 34.7, lng: 135.5 },
  koreacentral: { lat: 37.6, lng: 127.0 },
  koreasouth: { lat: 35.2, lng: 129.0 },
  centralindia: { lat: 18.6, lng: 73.9 },
  southindia: { lat: 12.9, lng: 80.2 },
  westindia: { lat: 19.1, lng: 72.9 },
  uaenorth: { lat: 25.3, lng: 55.3 },
  uaecentral: { lat: 24.5, lng: 54.4 },
  southafricanorth: { lat: -26.2, lng: 28.0 },
  southafricawest: { lat: -34.0, lng: 18.5 },
  israelcentral: { lat: 32.1, lng: 34.8 },
  qatarcentral: { lat: 25.3, lng: 51.5 },
};

const GCP_REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "us-central1": { lat: 41.3, lng: -95.9 }, // Iowa
  "us-east1": { lat: 33.2, lng: -80.0 }, // South Carolina
  "us-east4": { lat: 39.0, lng: -77.5 }, // Northern Virginia
  "us-east5": { lat: 39.96, lng: -82.99 }, // Columbus
  "us-south1": { lat: 32.8, lng: -96.8 }, // Dallas
  "us-west1": { lat: 45.6, lng: -122.8 }, // Oregon
  "us-west2": { lat: 34.1, lng: -118.2 }, // Los Angeles
  "us-west3": { lat: 40.8, lng: -111.9 }, // Salt Lake City
  "us-west4": { lat: 36.2, lng: -115.1 }, // Las Vegas
  "northamerica-northeast1": { lat: 45.5, lng: -73.6 }, // Montreal
  "northamerica-northeast2": { lat: 43.7, lng: -79.4 }, // Toronto
  "southamerica-east1": { lat: -23.5, lng: -46.6 }, // São Paulo
  "southamerica-west1": { lat: -33.4, lng: -70.6 }, // Santiago
  "europe-north1": { lat: 60.6, lng: 27.0 }, // Finland
  "europe-west1": { lat: 50.4, lng: 3.8 }, // Belgium
  "europe-west2": { lat: 51.5, lng: -0.1 }, // London
  "europe-west3": { lat: 50.1, lng: 8.7 }, // Frankfurt
  "europe-west4": { lat: 53.4, lng: 6.8 }, // Netherlands
  "europe-west6": { lat: 47.4, lng: 8.5 }, // Zurich
  "europe-west8": { lat: 45.5, lng: 9.2 }, // Milan
  "europe-west9": { lat: 48.9, lng: 2.3 }, // Paris
  "europe-west10": { lat: 52.5, lng: 13.4 }, // Berlin
  "europe-west12": { lat: 45.0, lng: 7.7 }, // Turin
  "europe-central2": { lat: 52.2, lng: 21.0 }, // Warsaw
  "europe-southwest1": { lat: 40.4, lng: -3.7 }, // Madrid
  "asia-east1": { lat: 24.0, lng: 121.0 }, // Taiwan
  "asia-east2": { lat: 22.3, lng: 114.2 }, // Hong Kong
  "asia-northeast1": { lat: 35.7, lng: 139.7 }, // Tokyo
  "asia-northeast2": { lat: 34.7, lng: 135.5 }, // Osaka
  "asia-northeast3": { lat: 37.6, lng: 127.0 }, // Seoul
  "asia-south1": { lat: 19.1, lng: 72.9 }, // Mumbai
  "asia-south2": { lat: 28.6, lng: 77.2 }, // Delhi
  "asia-southeast1": { lat: 1.4, lng: 103.8 }, // Singapore
  "asia-southeast2": { lat: -6.2, lng: 106.8 }, // Jakarta
  "australia-southeast1": { lat: -33.9, lng: 151.2 }, // Sydney
  "australia-southeast2": { lat: -37.8, lng: 145.0 }, // Melbourne
  "me-central1": { lat: 25.3, lng: 51.5 }, // Doha
  "me-central2": { lat: 24.5, lng: 54.4 }, // Dammam
  "me-west1": { lat: 32.1, lng: 34.8 }, // Tel Aviv
  "africa-south1": { lat: -26.2, lng: 28.0 }, // Johannesburg
  // Add global as default fallback for any unrecognized GCP region
  global: { lat: 37.4, lng: -122.1 }, // Mountain View, CA (Google HQ)
};

// Kubernetes can run anywhere, using global fallback for any region
const KUBERNETES_COORDINATES: Record<string, { lat: number; lng: number }> = {
  global: { lat: 37.7, lng: -122.4 }, // Global fallback
};

// M365 regions (Microsoft datacenter locations)
const M365_COORDINATES: Record<string, { lat: number; lng: number }> = {
  global: { lat: 47.6, lng: -122.3 }, // Global fallback
};

// GitHub regions
const GITHUB_COORDINATES: Record<string, { lat: number; lng: number }> = {
  global: { lat: 37.8, lng: -122.4 }, // Global fallback
};

// IAC has no regions - it's code scanning
const IAC_COORDINATES: Record<string, { lat: number; lng: number }> = {
  global: { lat: 40.7, lng: -74.0 }, // Global fallback
};

// Oracle Cloud Infrastructure regions
const ORACLECLOUD_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Americas
  "us-phoenix-1": { lat: 33.4, lng: -112.1 },
  "us-ashburn-1": { lat: 39.0, lng: -77.5 },
  "us-sanjose-1": { lat: 37.3, lng: -121.9 },
  "ca-toronto-1": { lat: 43.7, lng: -79.4 },
  "ca-montreal-1": { lat: 45.5, lng: -73.6 },
  "sa-saopaulo-1": { lat: -23.5, lng: -46.6 },
  "sa-santiago-1": { lat: -33.4, lng: -70.6 },
  // Europe
  "uk-london-1": { lat: 51.5, lng: -0.1 },
  "eu-frankfurt-1": { lat: 50.1, lng: 8.7 },
  "eu-zurich-1": { lat: 47.4, lng: 8.5 },
  "eu-amsterdam-1": { lat: 52.4, lng: 4.9 },
  "eu-paris-1": { lat: 48.9, lng: 2.3 },
  "eu-marseille-1": { lat: 43.3, lng: 5.4 },
  "eu-stockholm-1": { lat: 59.3, lng: 18.1 },
  "eu-milan-1": { lat: 45.5, lng: 9.2 },
  // Middle East & Africa
  "me-jeddah-1": { lat: 21.5, lng: 39.2 },
  "me-dubai-1": { lat: 25.3, lng: 55.3 },
  "il-jerusalem-1": { lat: 31.8, lng: 35.2 },
  "af-johannesburg-1": { lat: -26.2, lng: 28.0 },
  // Asia Pacific
  "ap-mumbai-1": { lat: 19.1, lng: 72.9 },
  "ap-tokyo-1": { lat: 35.7, lng: 139.7 },
  "ap-osaka-1": { lat: 34.7, lng: 135.5 },
  "ap-seoul-1": { lat: 37.6, lng: 127.0 },
  "ap-sydney-1": { lat: -33.9, lng: 151.2 },
  "ap-melbourne-1": { lat: -37.8, lng: 145.0 },
  "ap-singapore-1": { lat: 1.3, lng: 103.8 },
  "ap-hyderabad-1": { lat: 17.4, lng: 78.5 },
  "ap-chuncheon-1": { lat: 37.9, lng: 127.7 },
  global: { lat: 37.5, lng: -122.3 }, // Global fallback
};

// MongoDB Atlas runs on AWS/Azure/GCP infrastructure
// Using global fallback since it inherits regions from underlying cloud provider
const MONGODBATLAS_COORDINATES: Record<string, { lat: number; lng: number }> = {
  global: { lat: 40.8, lng: -74.0 }, // Global fallback
};

const PROVIDER_COORDINATES: Record<
  string,
  Record<string, { lat: number; lng: number }>
> = {
  aws: AWS_REGION_COORDINATES,
  azure: AZURE_REGION_COORDINATES,
  gcp: GCP_REGION_COORDINATES,
  google: GCP_REGION_COORDINATES, // Alias for gcp
  "google-cloud": GCP_REGION_COORDINATES, // Alternative naming
  kubernetes: KUBERNETES_COORDINATES,
  m365: M365_COORDINATES,
  github: GITHUB_COORDINATES,
  iac: IAC_COORDINATES,
  oraclecloud: ORACLECLOUD_COORDINATES,
  mongodbatlas: MONGODBATLAS_COORDINATES,
};

// Returns [lng, lat] format for D3/GeoJSON compatibility
function getRegionCoordinates(
  providerType: string,
  region: string,
): [number, number] | null {
  const provider = providerType.toLowerCase();
  const providerCoords = PROVIDER_COORDINATES[provider];

  if (!providerCoords) return null;

  // Try to find specific region coordinates
  let coords = providerCoords[region.toLowerCase()];

  // For providers without traditional regions, fallback to "global"
  if (!coords && providerCoords["global"]) {
    coords = providerCoords["global"];
  }

  return coords ? [coords.lng, coords.lat] : null;
}

function getRiskLevel(failRate: number): "low-high" | "high" | "critical" {
  if (failRate >= 0.5) return "critical";
  if (failRate >= 0.25) return "high";
  return "low-high";
}

// CSS variables are used for Recharts inline styles, not className
function buildSeverityData(fail: number, pass: number) {
  const total = fail + pass;
  const pct = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  return [
    {
      name: "Fail",
      value: fail,
      percentage: pct(fail),
      color: "var(--color-bg-fail)",
    },
    {
      name: "Pass",
      value: pass,
      percentage: pct(pass),
      color: "var(--color-bg-pass)",
    },
  ];
}

// Formats "europe-west10" → "Europe West 10"
function formatRegionCode(region: string): string {
  return region
    .split(/[-_]/)
    .map((part) => {
      const match = part.match(/^([a-zA-Z]+)(\d+)$/);
      if (match) {
        const [, text, number] = match;
        return `${text.charAt(0).toUpperCase()}${text.slice(1).toLowerCase()} ${number}`;
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

function formatRegionName(providerType: string, region: string): string {
  return `${getProviderDisplayName(providerType)} - ${formatRegionCode(region)}`;
}

/**
 * Adapts regions overview API response to threat map format.
 */
export function adaptRegionsOverviewToThreatMap(
  regionsResponse: RegionsOverviewResponse | undefined,
): ThreatMapData {
  if (!regionsResponse?.data || regionsResponse.data.length === 0) {
    return {
      locations: [],
      regions: [],
    };
  }

  const locations: ThreatMapLocation[] = [];
  const regionSet = new Set<string>();

  for (const regionData of regionsResponse.data) {
    const { id, attributes } = regionData;
    const coordinates = getRegionCoordinates(
      attributes.provider_type,
      attributes.region,
    );

    if (!coordinates) continue;

    // Add the actual region code to the set
    regionSet.add(attributes.region);

    const failRate =
      attributes.total > 0 ? attributes.fail / attributes.total : 0;

    locations.push({
      id,
      name: formatRegionName(attributes.provider_type, attributes.region),
      region: attributes.region, // Use actual region code for filtering
      regionCode: attributes.region,
      providerType: attributes.provider_type,
      coordinates,
      totalFindings: attributes.total,
      failFindings: attributes.fail,
      riskLevel: getRiskLevel(failRate),
      severityData: buildSeverityData(attributes.fail, attributes.pass),
    });
  }

  return {
    locations,
    regions: Array.from(regionSet).sort(),
  };
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/regions/types/index.ts

```typescript
export * from "./regions.types";
```

--------------------------------------------------------------------------------

---[FILE: regions.types.ts]---
Location: prowler-master/ui/actions/overview/regions/types/regions.types.ts

```typescript
// Regions Overview Types
// Corresponds to the /overviews/regions endpoint

interface OverviewResponseMeta {
  version: string;
}

export interface RegionOverviewAttributes {
  provider_type: string;
  region: string;
  total: number;
  fail: number;
  muted: number;
  pass: number;
}

export interface RegionOverview {
  type: "regions-overview";
  id: string;
  attributes: RegionOverviewAttributes;
}

export interface RegionsOverviewResponse {
  data: RegionOverview[];
  meta: OverviewResponseMeta;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/risk-plot/index.ts

```typescript
// Risk Plot Actions
export * from "./risk-plot";
export * from "./risk-plot.adapter";
export * from "./types/risk-plot.types";
```

--------------------------------------------------------------------------------

---[FILE: risk-plot.adapter.ts]---
Location: prowler-master/ui/actions/overview/risk-plot/risk-plot.adapter.ts

```typescript
import { getProviderDisplayName } from "@/types/providers";

import type {
  ProviderRiskData,
  RiskPlotDataResponse,
  RiskPlotPoint,
} from "./types/risk-plot.types";

/**
 * Calculates percentage with proper rounding.
 */
function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Adapts raw provider risk data to the format expected by RiskPlotClient.
 *
 * @param providersRiskData - Array of risk data per provider from API
 * @returns Formatted data for the Risk Plot scatter chart
 */
export function adaptToRiskPlotData(
  providersRiskData: ProviderRiskData[],
): RiskPlotDataResponse {
  const points: RiskPlotPoint[] = [];
  const providersWithoutData: RiskPlotDataResponse["providersWithoutData"] = [];

  for (const providerData of providersRiskData) {
    // Skip providers without ThreatScore data (no completed scans)
    if (providerData.overallScore === null) {
      providersWithoutData.push({
        id: providerData.providerId,
        name: providerData.providerName,
        type: providerData.providerType,
      });
      continue;
    }

    // Convert provider type to display name (aws -> AWS, gcp -> Google, etc.)
    const providerDisplayName = getProviderDisplayName(
      providerData.providerType,
    );

    // Build severity data for the horizontal bar chart with percentages
    let severityData;
    let totalFailedFindings = 0;

    if (providerData.severity) {
      const { critical, high, medium, low, informational } =
        providerData.severity;
      totalFailedFindings = critical + high + medium + low + informational;

      severityData = [
        {
          name: "Critical",
          value: critical,
          percentage: calculatePercentage(critical, totalFailedFindings),
        },
        {
          name: "High",
          value: high,
          percentage: calculatePercentage(high, totalFailedFindings),
        },
        {
          name: "Medium",
          value: medium,
          percentage: calculatePercentage(medium, totalFailedFindings),
        },
        {
          name: "Low",
          value: low,
          percentage: calculatePercentage(low, totalFailedFindings),
        },
        {
          name: "Info",
          value: informational,
          percentage: calculatePercentage(informational, totalFailedFindings),
        },
      ];
    }

    points.push({
      x: providerData.overallScore ?? 0,
      y: totalFailedFindings,
      provider: providerDisplayName,
      name: providerData.providerName,
      providerId: providerData.providerId,
      severityData,
    });
  }

  return { points, providersWithoutData };
}
```

--------------------------------------------------------------------------------

---[FILE: risk-plot.ts]---
Location: prowler-master/ui/actions/overview/risk-plot/risk-plot.ts

```typescript
"use server";

import { getFindingsBySeverity } from "@/actions/overview/findings";
import { getThreatScore } from "@/actions/overview/threat-score";
import { ProviderProps } from "@/types/providers";

import { ProviderRiskData } from "./types/risk-plot.types";

/**
 * Fetches risk data for a single provider.
 * Combines ThreatScore and Severity data in parallel.
 */
export async function getProviderRiskData(
  provider: ProviderProps,
): Promise<ProviderRiskData> {
  const providerId = provider.id;
  const providerType = provider.attributes.provider;
  const providerName = provider.attributes.alias || provider.attributes.uid;

  // Fetch ThreatScore and Severity in parallel
  const [threatScoreResponse, severityResponse] = await Promise.all([
    getThreatScore({
      filters: {
        provider_id: providerId,
        include: "provider",
      },
    }),
    getFindingsBySeverity({
      filters: {
        "filter[provider_id]": providerId,
        "filter[status]": "FAIL",
      },
    }),
  ]);

  // Extract ThreatScore data
  // When filtering by single provider, API returns array with one item (not aggregated)
  const threatScoreData = threatScoreResponse?.data?.[0]?.attributes;
  const overallScore = threatScoreData?.overall_score
    ? parseFloat(threatScoreData.overall_score)
    : null;
  const failedFindings = threatScoreData?.failed_findings ?? 0;

  // Extract Severity data
  const severityData = severityResponse?.data?.attributes ?? null;

  return {
    providerId,
    providerType,
    providerName,
    overallScore,
    failedFindings,
    severity: severityData,
  };
}

/**
 * Fetches risk data for multiple providers in parallel.
 * Used by the Risk Plot SSR component.
 */
export async function getProvidersRiskData(
  providers: ProviderProps[],
): Promise<ProviderRiskData[]> {
  const riskDataPromises = providers.map((provider) =>
    getProviderRiskData(provider),
  );

  return Promise.all(riskDataPromises);
}
```

--------------------------------------------------------------------------------

---[FILE: risk-plot.types.ts]---
Location: prowler-master/ui/actions/overview/risk-plot/types/risk-plot.types.ts

```typescript
// Risk Plot Types
// Data structures for the Risk Plot scatter chart

import type { BarDataPoint } from "@/components/graphs/types";

/**
 * Represents a single point in the Risk Plot scatter chart.
 * Each point represents a provider/account with its risk metrics.
 */
export interface RiskPlotPoint {
  /** ThreatScore (0-100 scale, higher = better) */
  x: number;
  /** Total failed findings count */
  y: number;
  /** Provider type display name (AWS, Azure, Google, etc.) */
  provider: string;
  /** Provider alias or UID (account identifier) */
  name: string;
  /** Provider ID for filtering/navigation */
  providerId: string;
  /** Severity breakdown for the horizontal bar chart */
  severityData?: BarDataPoint[];
}

/**
 * Raw data from the API combined for a single provider.
 * Used internally before transformation to RiskPlotPoint.
 */
export interface ProviderRiskData {
  providerId: string;
  providerType: string;
  providerName: string;
  /** ThreatScore overall_score (0-100 scale) */
  overallScore: number | null;
  /** Failed findings from ThreatScore snapshot */
  failedFindings: number;
  /** Severity breakdown */
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  } | null;
}

/**
 * Response structure for risk plot data fetching.
 */
export interface RiskPlotDataResponse {
  points: RiskPlotPoint[];
  /** Providers that have no data or no completed scans */
  providersWithoutData: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/risk-radar/index.ts

```typescript
export * from "./risk-radar";
export * from "./risk-radar.adapter";
export * from "./types";
```

--------------------------------------------------------------------------------

---[FILE: risk-radar.adapter.ts]---
Location: prowler-master/ui/actions/overview/risk-radar/risk-radar.adapter.ts

```typescript
import type { RadarDataPoint } from "@/components/graphs/types";
import { getCategoryLabel } from "@/lib/categories";

import { CategoryOverview, CategoryOverviewResponse } from "./types";

/**
 * Calculates the percentage of new failed findings relative to total failed findings.
 */
function calculateChangePercentage(
  newFailedFindings: number,
  failedFindings: number,
): number {
  if (failedFindings === 0) return 0;
  return Math.round((newFailedFindings / failedFindings) * 100);
}

/**
 * Maps a single category overview item to a RadarDataPoint.
 */
function mapCategoryToRadarPoint(item: CategoryOverview): RadarDataPoint {
  const { id, attributes } = item;
  const { failed_findings, new_failed_findings, severity } = attributes;

  return {
    category: getCategoryLabel(id),
    categoryId: id,
    value: failed_findings,
    change: calculateChangePercentage(new_failed_findings, failed_findings),
    severityData: [
      { name: "Critical", value: severity.critical },
      { name: "High", value: severity.high },
      { name: "Medium", value: severity.medium },
      { name: "Low", value: severity.low },
      { name: "Info", value: severity.informational },
    ],
  };
}

/**
 * Adapts the category overview API response to RadarDataPoint[] format.
 * Filters out categories with no failed findings.
 *
 * @param response - The category overview API response
 * @returns An array of RadarDataPoint objects for the radar chart
 */
export function adaptCategoryOverviewToRadarData(
  response: CategoryOverviewResponse | undefined,
): RadarDataPoint[] {
  if (!response?.data || response.data.length === 0) {
    return [];
  }

  // Map all categories to radar points, filtering out those with no failed findings
  return response.data
    .filter((item) => item.attributes.failed_findings > 0)
    .map(mapCategoryToRadarPoint)
    .sort((a, b) => b.value - a.value); // Sort by failed findings descending
}
```

--------------------------------------------------------------------------------

---[FILE: risk-radar.ts]---
Location: prowler-master/ui/actions/overview/risk-radar/risk-radar.ts

```typescript
"use server";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

import { CategoryOverviewResponse } from "./types";

export const getCategoryOverview = async ({
  filters = {},
}: {
  filters?: Record<string, string | string[] | undefined>;
} = {}): Promise<CategoryOverviewResponse | undefined> => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/overviews/categories`);

  // Handle multiple filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "filter[search]" && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching category overview:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/risk-radar/types/index.ts

```typescript
export * from "./risk-radar.types";
```

--------------------------------------------------------------------------------

---[FILE: risk-radar.types.ts]---
Location: prowler-master/ui/actions/overview/risk-radar/types/risk-radar.types.ts

```typescript
// Category Overview Types
// Corresponds to the /overviews/categories endpoint

interface OverviewResponseMeta {
  version: string;
}

export interface CategorySeverity {
  informational: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface CategoryOverviewAttributes {
  total_findings: number;
  failed_findings: number;
  new_failed_findings: number;
  severity: CategorySeverity;
}

export interface CategoryOverview {
  type: "category-overviews";
  id: string;
  attributes: CategoryOverviewAttributes;
}

export interface CategoryOverviewResponse {
  data: CategoryOverview[];
  meta: OverviewResponseMeta;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/services/index.ts

```typescript
export * from "./services";
export * from "./types";
```

--------------------------------------------------------------------------------

---[FILE: services.ts]---
Location: prowler-master/ui/actions/overview/services/services.ts

```typescript
"use server";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

import { ServicesOverviewResponse } from "./types";

export const getServicesOverview = async ({
  filters = {},
}: {
  filters?: Record<string, string | string[] | undefined>;
} = {}): Promise<ServicesOverviewResponse | undefined> => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/overviews/services`);

  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "filter[search]" && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching services overview:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/services/types/index.ts

```typescript
export * from "./services.types";
```

--------------------------------------------------------------------------------

---[FILE: services.types.ts]---
Location: prowler-master/ui/actions/overview/services/types/services.types.ts

```typescript
// Services Overview Types
// Corresponds to the /overviews/services endpoint

interface OverviewResponseMeta {
  version: string;
}

export interface ServiceOverviewAttributes {
  total: number;
  fail: number;
  muted: number;
  pass: number;
}

export interface ServiceOverview {
  type: "services-overview";
  id: string;
  attributes: ServiceOverviewAttributes;
}

export interface ServicesOverviewResponse {
  data: ServiceOverview[];
  meta: OverviewResponseMeta;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/severity-trends/index.ts

```typescript
export * from "./severity-trends";
export * from "./severity-trends.adapter";
export * from "./types";
```

--------------------------------------------------------------------------------

---[FILE: severity-trends.adapter.ts]---
Location: prowler-master/ui/actions/overview/severity-trends/severity-trends.adapter.ts

```typescript
import { LineDataPoint } from "@/components/graphs/types";

import {
  AdaptedSeverityTrendsResponse,
  FindingsSeverityOverTimeResponse,
} from "./types";

export type { AdaptedSeverityTrendsResponse, FindingsSeverityOverTimeResponse };

/**
 * Adapts the API findings severity over time response to the format expected by LineChart.
 * Transforms API response with nested attributes into flat LineDataPoint objects.
 *
 * @param response - The raw API response from /overviews/findings_severity/timeseries
 * @returns Adapted response with LineDataPoint array ready for the chart
 */
export function adaptSeverityTrendsResponse(
  response: FindingsSeverityOverTimeResponse,
): AdaptedSeverityTrendsResponse {
  const adaptedData: LineDataPoint[] = response.data.map(
    ({
      id,
      attributes: {
        informational,
        low,
        medium,
        high,
        critical,
        muted,
        scan_ids,
      },
    }) => ({
      date: id,
      informational,
      low,
      medium,
      high,
      critical,
      muted,
      scan_ids,
    }),
  );

  return {
    data: adaptedData,
    meta: response.meta,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: severity-trends.ts]---
Location: prowler-master/ui/actions/overview/severity-trends/severity-trends.ts

```typescript
"use server";

import {
  getDateFromForTimeRange,
  type TimeRange,
} from "@/app/(prowler)/_overview/severity-over-time/_constants/time-range.constants";
import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

import { adaptSeverityTrendsResponse } from "./severity-trends.adapter";
import {
  AdaptedSeverityTrendsResponse,
  FindingsSeverityOverTimeResponse,
} from "./types";

export type SeverityTrendsResult =
  | { status: "success"; data: AdaptedSeverityTrendsResponse }
  | { status: "empty" }
  | { status: "error" };

const getFindingsSeverityTrends = async ({
  filters = {},
}: {
  filters?: Record<string, string | string[] | undefined>;
} = {}): Promise<SeverityTrendsResult> => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/overviews/findings_severity/timeseries`);

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    const apiResponse: FindingsSeverityOverTimeResponse | undefined =
      await handleApiResponse(response);

    if (!apiResponse?.data || !Array.isArray(apiResponse.data)) {
      return { status: "empty" };
    }

    if (apiResponse.data.length === 0) {
      return { status: "empty" };
    }

    return {
      status: "success",
      data: adaptSeverityTrendsResponse(apiResponse),
    };
  } catch (error) {
    console.error("Error fetching findings severity trends:", error);
    return { status: "error" };
  }
};

export const getSeverityTrendsByTimeRange = async ({
  timeRange,
  filters = {},
}: {
  timeRange: TimeRange;
  filters?: Record<string, string | string[] | undefined>;
}): Promise<SeverityTrendsResult> => {
  const dateFilters = {
    ...filters,
    "filter[date_from]": getDateFromForTimeRange(timeRange),
  };

  return getFindingsSeverityTrends({ filters: dateFilters });
};

export { getFindingsSeverityTrends };
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/severity-trends/types/index.ts

```typescript
export * from "./severity-trends.types";
```

--------------------------------------------------------------------------------

---[FILE: severity-trends.types.ts]---
Location: prowler-master/ui/actions/overview/severity-trends/types/severity-trends.types.ts

```typescript
import { LineDataPoint } from "@/components/graphs/types";

// API Response Types (what comes from the backend)
export interface FindingsSeverityOverTimeAttributes {
  critical: number;
  high: number;
  medium: number;
  low: number;
  informational: number;
  muted: number;
  scan_ids: string[];
}

export interface FindingsSeverityOverTimeItem {
  type: "findings-severity-over-time";
  id: string;
  attributes: FindingsSeverityOverTimeAttributes;
}

export interface FindingsSeverityOverTimeMeta {
  version: string;
}

export interface FindingsSeverityOverTimeResponse {
  data: FindingsSeverityOverTimeItem[];
  meta: FindingsSeverityOverTimeMeta;
}

// Adapted Types (what the UI components expect)
export interface AdaptedSeverityTrendsResponse {
  data: LineDataPoint[];
  meta: FindingsSeverityOverTimeMeta;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/threat-score/index.ts

```typescript
export * from "./threat-score";
export * from "./types";
```

--------------------------------------------------------------------------------

---[FILE: threat-score.ts]---
Location: prowler-master/ui/actions/overview/threat-score/threat-score.ts

```typescript
"use server";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

export const getThreatScore = async ({
  filters = {},
}: {
  filters?: Record<string, string | string[] | undefined>;
} = {}) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/overviews/threatscore`);

  // Handle multiple filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "filter[search]") {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching threat score:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/threat-score/types/index.ts

```typescript
export * from "./threat-score.types";
```

--------------------------------------------------------------------------------

---[FILE: threat-score.types.ts]---
Location: prowler-master/ui/actions/overview/threat-score/types/threat-score.types.ts

```typescript
// ThreatScore Snapshot Types
// Corresponds to the ThreatScoreSnapshot model from the API

export interface CriticalRequirement {
  requirement_id: string;
  risk_level: number;
  weight: number;
  title: string;
}

export type SectionScores = Record<string, number>;

export interface ThreatScoreSnapshotAttributes {
  id: string;
  inserted_at: string;
  scan: string | null;
  provider: string | null;
  compliance_id: string;
  overall_score: string;
  score_delta: string | null;
  section_scores: SectionScores;
  critical_requirements: CriticalRequirement[];
  total_requirements: number;
  passed_requirements: number;
  failed_requirements: number;
  manual_requirements: number;
  total_findings: number;
  passed_findings: number;
  failed_findings: number;
}

export interface ThreatScoreSnapshot {
  id: string;
  type: "threatscore-snapshots";
  attributes: ThreatScoreSnapshotAttributes;
}

export interface ThreatScoreResponse {
  data: ThreatScoreSnapshot[];
}

// Filters for ThreatScore endpoint
export interface ThreatScoreFilters {
  snapshot_id?: string;
  provider_id?: string;
  provider_id__in?: string;
  provider_type?: string;
  provider_type__in?: string;
  scan_id?: string;
  scan_id__in?: string;
  compliance_id?: string;
  compliance_id__in?: string;
  inserted_at?: string;
  inserted_at__gte?: string;
  inserted_at__lte?: string;
  overall_score__gte?: string;
  overall_score__lte?: string;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/processors/index.ts

```typescript
export * from "./processors";
```

--------------------------------------------------------------------------------

````

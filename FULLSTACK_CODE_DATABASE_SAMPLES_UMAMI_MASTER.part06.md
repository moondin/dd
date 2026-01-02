---
source_txt: fullstack_samples/umami-master
converted_utc: 2025-12-18T10:37:23Z
part: 6
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES umami-master

## Extracted Reusable Patterns (Non-verbatim) (Part 6 of 6)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - umami-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/umami-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: lang.ts]---
Location: umami-master/src/lib/lang.ts
Signals: N/A
Excerpt (<=80 chars):  export const languages = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDateLocale
- getTextDirection
- languages
```

--------------------------------------------------------------------------------

---[FILE: params.ts]---
Location: umami-master/src/lib/params.ts
Signals: N/A
Excerpt (<=80 chars):  export function parseFilterValue(param: any) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseFilterValue
- isEqualsOperator
- isSearchOperator
- filtersObjectToArray
- filtersArrayToObject
```

--------------------------------------------------------------------------------

---[FILE: password.ts]---
Location: umami-master/src/lib/password.ts
Signals: N/A
Excerpt (<=80 chars):  export function hashPassword(password: string, rounds = SALT_ROUNDS) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hashPassword
- checkPassword
```

--------------------------------------------------------------------------------

---[FILE: prisma.ts]---
Location: umami-master/src/lib/prisma.ts
Signals: Prisma
Excerpt (<=80 chars):  export function getTimestampSQL(field: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTimestampSQL
```

--------------------------------------------------------------------------------

---[FILE: react.ts]---
Location: umami-master/src/lib/react.ts
Signals: React
Excerpt (<=80 chars):  export function getFragmentChildren(children: ReactNode) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getFragmentChildren
- isValidChild
- mapChildren
- cloneChildren
- renderChildren
- countChildren
```

--------------------------------------------------------------------------------

---[FILE: request.ts]---
Location: umami-master/src/lib/request.ts
Signals: Zod
Excerpt (<=80 chars):  export function getRequestDateRange(query: Record<string, string>) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRequestDateRange
- getRequestFilters
```

--------------------------------------------------------------------------------

---[FILE: response.ts]---
Location: umami-master/src/lib/response.ts
Signals: N/A
Excerpt (<=80 chars): export function ok() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ok
- json
- badRequest
- unauthorized
- forbidden
- notFound
- serverError
```

--------------------------------------------------------------------------------

---[FILE: schema.ts]---
Location: umami-master/src/lib/schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const timezoneParam = z

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timezoneParam
- unitParam
- dateRangeParams
- filterParams
- searchParams
- pagingParams
- sortingParams
- userRoleParam
- teamRoleParam
- anyObjectParam
- urlOrPathParam
- fieldsParam
- reportTypeParam
- goalReportSchema
- funnelReportSchema
- journeyReportSchema
- retentionReportSchema
- utmReportSchema
```

--------------------------------------------------------------------------------

---[FILE: storage.ts]---
Location: umami-master/src/lib/storage.ts
Signals: N/A
Excerpt (<=80 chars): export function setItem(key: string, data: any, session?: boolean) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setItem
- getItem
- removeItem
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: umami-master/src/lib/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type ObjectValues<T> = T[keyof T];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ObjectValues
- ReactQueryOptions
- TimeUnit
- Role
- DynamicDataType
- Operator
- Auth
- Filter
- DateRange
- DynamicData
- QueryOptions
- QueryFilters
- DateParams
- FilterParams
- SortParams
- PageParams
- SegmentParams
- PageResult
```

--------------------------------------------------------------------------------

---[FILE: url.ts]---
Location: umami-master/src/lib/url.ts
Signals: N/A
Excerpt (<=80 chars): export function getQueryString(params: object = {}): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getQueryString
- buildPath
- safeDecodeURI
- safeDecodeURIComponent
- isValidUrl
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: umami-master/src/lib/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function hook(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hook
- sleep
- shuffleArray
- chunkArray
- ensureArray
```

--------------------------------------------------------------------------------

---[FILE: user.ts]---
Location: umami-master/src/queries/prisma/user.ts
Signals: N/A
Excerpt (<=80 chars):  export interface GetUserOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetUserOptions
```

--------------------------------------------------------------------------------

---[FILE: getChannelExpandedMetrics.ts]---
Location: umami-master/src/queries/sql/getChannelExpandedMetrics.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ChannelExpandedMetricsParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChannelExpandedMetricsParameters
- ChannelExpandedMetricsData
```

--------------------------------------------------------------------------------

---[FILE: getWebsiteStats.ts]---
Location: umami-master/src/queries/sql/getWebsiteStats.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WebsiteStatsData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteStatsData
```

--------------------------------------------------------------------------------

---[FILE: getEventDataEvents.ts]---
Location: umami-master/src/queries/sql/events/getEventDataEvents.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WebsiteEventData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteEventData
```

--------------------------------------------------------------------------------

---[FILE: getEventDataUsage.ts]---
Location: umami-master/src/queries/sql/events/getEventDataUsage.ts
Signals: N/A
Excerpt (<=80 chars):  export function getEventDataUsage(...args: [websiteIds: string[], filters: Q...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getEventDataUsage
```

--------------------------------------------------------------------------------

---[FILE: getEventExpandedMetrics.ts]---
Location: umami-master/src/queries/sql/events/getEventExpandedMetrics.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EventExpandedMetricParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventExpandedMetricParameters
- EventExpandedMetricData
```

--------------------------------------------------------------------------------

---[FILE: getEventMetrics.ts]---
Location: umami-master/src/queries/sql/events/getEventMetrics.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EventMetricParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventMetricParameters
- EventMetricData
```

--------------------------------------------------------------------------------

---[FILE: getEventUsage.ts]---
Location: umami-master/src/queries/sql/events/getEventUsage.ts
Signals: N/A
Excerpt (<=80 chars):  export function getEventUsage(...args: [websiteIds: string[], filters: Query...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getEventUsage
```

--------------------------------------------------------------------------------

---[FILE: getWebsiteEvents.ts]---
Location: umami-master/src/queries/sql/events/getWebsiteEvents.ts
Signals: N/A
Excerpt (<=80 chars):  export function getWebsiteEvents(...args: [websiteId: string, filters: Query...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getWebsiteEvents
```

--------------------------------------------------------------------------------

---[FILE: saveEvent.ts]---
Location: umami-master/src/queries/sql/events/saveEvent.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SaveEventArgs {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SaveEventArgs
```

--------------------------------------------------------------------------------

---[FILE: saveEventData.ts]---
Location: umami-master/src/queries/sql/events/saveEventData.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SaveEventDataArgs {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SaveEventDataArgs
```

--------------------------------------------------------------------------------

---[FILE: saveRevenue.ts]---
Location: umami-master/src/queries/sql/events/saveRevenue.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SaveRevenueArgs {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SaveRevenueArgs
```

--------------------------------------------------------------------------------

---[FILE: getPageviewExpandedMetrics.ts]---
Location: umami-master/src/queries/sql/pageviews/getPageviewExpandedMetrics.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PageviewExpandedMetricsParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toClickHouseGroupedReferrer
- toPostgresGroupedReferrer
- PageviewExpandedMetricsParameters
- PageviewExpandedMetricsData
```

--------------------------------------------------------------------------------

---[FILE: getPageviewMetrics.ts]---
Location: umami-master/src/queries/sql/pageviews/getPageviewMetrics.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PageviewMetricsParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageviewMetricsParameters
- PageviewMetricsData
```

--------------------------------------------------------------------------------

---[FILE: getAttribution.ts]---
Location: umami-master/src/queries/sql/reports/getAttribution.ts
Signals: N/A
Excerpt (<=80 chars):  export interface AttributionParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AttributionParameters
- AttributionResult
```

--------------------------------------------------------------------------------

---[FILE: getBreakdown.ts]---
Location: umami-master/src/queries/sql/reports/getBreakdown.ts
Signals: N/A
Excerpt (<=80 chars):  export interface BreakdownParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BreakdownParameters
- BreakdownData
```

--------------------------------------------------------------------------------

---[FILE: getFunnel.ts]---
Location: umami-master/src/queries/sql/reports/getFunnel.ts
Signals: N/A
Excerpt (<=80 chars):  export interface FunnelParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FunnelParameters
- FunnelResult
```

--------------------------------------------------------------------------------

---[FILE: getGoal.ts]---
Location: umami-master/src/queries/sql/reports/getGoal.ts
Signals: N/A
Excerpt (<=80 chars):  export interface GoalParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoalParameters
```

--------------------------------------------------------------------------------

---[FILE: getJourney.ts]---
Location: umami-master/src/queries/sql/reports/getJourney.ts
Signals: N/A
Excerpt (<=80 chars):  export interface JourneyParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JourneyParameters
- JourneyResult
```

--------------------------------------------------------------------------------

---[FILE: getRetention.ts]---
Location: umami-master/src/queries/sql/reports/getRetention.ts
Signals: N/A
Excerpt (<=80 chars):  export interface RetentionParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RetentionParameters
- RetentionResult
```

--------------------------------------------------------------------------------

---[FILE: getRevenue.ts]---
Location: umami-master/src/queries/sql/reports/getRevenue.ts
Signals: N/A
Excerpt (<=80 chars):  export interface RevenuParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RevenuParameters
- RevenueResult
```

--------------------------------------------------------------------------------

---[FILE: getUTM.ts]---
Location: umami-master/src/queries/sql/reports/getUTM.ts
Signals: N/A
Excerpt (<=80 chars):  export interface UTMParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UTMParameters
```

--------------------------------------------------------------------------------

---[FILE: getSessionExpandedMetrics.ts]---
Location: umami-master/src/queries/sql/sessions/getSessionExpandedMetrics.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SessionExpandedMetricsParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionExpandedMetricsParameters
- SessionExpandedMetricsData
```

--------------------------------------------------------------------------------

---[FILE: getSessionMetrics.ts]---
Location: umami-master/src/queries/sql/sessions/getSessionMetrics.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SessionMetricsParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SessionMetricsParameters
```

--------------------------------------------------------------------------------

---[FILE: getWebsiteSessionStats.ts]---
Location: umami-master/src/queries/sql/sessions/getWebsiteSessionStats.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WebsiteSessionStatsData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebsiteSessionStatsData
```

--------------------------------------------------------------------------------

---[FILE: saveSessionData.ts]---
Location: umami-master/src/queries/sql/sessions/saveSessionData.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SaveSessionDataArgs {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SaveSessionDataArgs
```

--------------------------------------------------------------------------------

---[FILE: app.ts]---
Location: umami-master/src/store/app.ts
Signals: N/A
Excerpt (<=80 chars):  export function setTimezone(timezone: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setTimezone
- setLocale
- setShareToken
- setUser
- setConfig
- setDateRangeValue
- useApp
```

--------------------------------------------------------------------------------

---[FILE: cache.ts]---
Location: umami-master/src/store/cache.ts
Signals: N/A
Excerpt (<=80 chars):  export function setValue(key: string, value: any) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setValue
- useCache
```

--------------------------------------------------------------------------------

---[FILE: dashboard.ts]---
Location: umami-master/src/store/dashboard.ts
Signals: N/A
Excerpt (<=80 chars):  export const initialState = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- saveDashboard
- initialState
- useDashboard
```

--------------------------------------------------------------------------------

---[FILE: version.ts]---
Location: umami-master/src/store/version.ts
Signals: N/A
Excerpt (<=80 chars):  export const useVersion = store;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useVersion
```

--------------------------------------------------------------------------------

---[FILE: websites.ts]---
Location: umami-master/src/store/websites.ts
Signals: N/A
Excerpt (<=80 chars):  export function setWebsiteDateRange(websiteId: string, dateRange: DateRange) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setWebsiteDateRange
- setWebsiteDateCompare
- useWebsites
```

--------------------------------------------------------------------------------

---[FILE: index.d.ts]---
Location: umami-master/src/tracker/index.d.ts
Signals: N/A
Excerpt (<=80 chars): export type TrackedProperties = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TrackedProperties
- WithRequired
- EventProperties
- PageViewProperties
- CustomEventFunction
- UmamiTracker
- EventData
- Window
```

--------------------------------------------------------------------------------

````

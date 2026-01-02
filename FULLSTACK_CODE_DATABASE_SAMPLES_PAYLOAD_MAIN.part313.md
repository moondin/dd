---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 313
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 313 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: clientKeys.ts]---
Location: payload-main/packages/translations/src/clientKeys.ts

```typescript
import type { DefaultTranslationKeys } from './types.js'

function createClientTranslationKeys<T extends DefaultTranslationKeys[]>(keys: T) {
  return keys
}

export const clientTranslationKeys = createClientTranslationKeys([
  'authentication:account',
  'authentication:accountOfCurrentUser',
  'authentication:accountVerified',
  'authentication:alreadyActivated',
  'authentication:alreadyLoggedIn',
  'authentication:apiKey',
  'authentication:authenticated',
  'authentication:backToLogin',
  'authentication:beginCreateFirstUser',
  'authentication:changePassword',
  'authentication:checkYourEmailForPasswordReset',
  'authentication:confirmGeneration',
  'authentication:confirmPassword',
  'authentication:createFirstUser',
  'authentication:emailNotValid',
  'authentication:usernameNotValid',
  'authentication:emailOrUsername',
  'authentication:emailSent',
  'authentication:emailVerified',
  'authentication:enableAPIKey',
  'authentication:failedToUnlock',
  'authentication:forceUnlock',
  'authentication:forgotPassword',
  'authentication:forgotPasswordEmailInstructions',
  'authentication:forgotPasswordUsernameInstructions',
  'authentication:forgotPasswordQuestion',
  'authentication:generate',
  'authentication:generateNewAPIKey',
  'authentication:generatingNewAPIKeyWillInvalidate',
  'authentication:logBackIn',
  'authentication:loggedOutInactivity',
  'authentication:loggedOutSuccessfully',
  'authentication:loggingOut',
  'authentication:login',
  'authentication:logOut',
  'authentication:loggedIn',
  'authentication:loggedInChangePassword',
  'authentication:logout',
  'authentication:logoutUser',
  'authentication:logoutSuccessful',
  'authentication:newAPIKeyGenerated',
  'authentication:newPassword',
  'authentication:passed',
  'authentication:passwordResetSuccessfully',
  'authentication:resetPassword',
  'authentication:stayLoggedIn',
  'authentication:successfullyRegisteredFirstUser',
  'authentication:successfullyUnlocked',
  'authentication:username',
  'authentication:unableToVerify',
  'authentication:tokenRefreshSuccessful',
  'authentication:verified',
  'authentication:verifiedSuccessfully',
  'authentication:verify',
  'authentication:verifyUser',
  'authentication:youAreInactive',

  'error:autosaving',
  'error:correctInvalidFields',
  'error:deletingTitle',
  'error:documentNotFound',
  'error:emailOrPasswordIncorrect',
  'error:usernameOrPasswordIncorrect',
  'error:loadingDocument',
  'error:insufficientClipboardPermissions',
  'error:invalidClipboardData',
  'error:invalidRequestArgs',
  'error:invalidFileType',
  'error:logoutFailed',
  'error:noMatchedField',
  'error:notAllowedToAccessPage',
  'error:previewing',
  'error:unableToCopy',
  'error:unableToDeleteCount',
  'error:unableToReindexCollection',
  'error:unableToUpdateCount',
  'error:unauthorized',
  'error:unauthorizedAdmin',
  'error:unknown',
  'error:unspecific',
  'error:unverifiedEmail',
  'error:userEmailAlreadyRegistered',
  'error:usernameAlreadyRegistered',
  'error:tokenNotProvided',
  'error:unPublishingDocument',
  'error:problemUploadingFile',
  'error:restoringTitle',

  'fields:addLabel',
  'fields:addLink',
  'fields:addNew',
  'fields:addNewLabel',
  'fields:addRelationship',
  'fields:addUpload',
  'fields:block',
  'fields:blocks',
  'fields:blockType',
  'fields:chooseBetweenCustomTextOrDocument',
  'fields:customURL',
  'fields:chooseDocumentToLink',
  'fields:openInNewTab',
  'fields:enterURL',
  'fields:internalLink',
  'fields:chooseFromExisting',
  'fields:linkType',
  'fields:textToDisplay',
  'fields:searchForLanguage',
  'fields:collapseAll',
  'fields:editLink',
  'fields:editRelationship',
  'fields:itemsAndMore',
  'fields:labelRelationship',
  'fields:latitude',
  'fields:linkedTo',
  'fields:longitude',
  'fields:passwordsDoNotMatch',
  'fields:removeRelationship',
  'fields:removeUpload',
  'fields:saveChanges',
  'fields:searchForBlock',
  'fields:selectFieldsToEdit',
  'fields:showAll',
  'fields:swapRelationship',
  'fields:swapUpload',
  'fields:toggleBlock',
  'fields:uploadNewLabel',

  'folder:byFolder',
  'folder:browseByFolder',
  'folder:deleteFolder',
  'folder:folders',
  'folder:folderTypeDescription',
  'folder:folderName',
  'folder:itemsMovedToFolder',
  'folder:itemsMovedToRoot',
  'folder:itemHasBeenMoved',
  'folder:itemHasBeenMovedToRoot',
  'folder:moveFolder',
  'folder:movingFromFolder',
  'folder:moveItemsToFolderConfirmation',
  'folder:moveItemsToRootConfirmation',
  'folder:moveItemToFolderConfirmation',
  'folder:moveItemToRootConfirmation',
  'folder:noFolder',
  'folder:newFolder',
  'folder:renameFolder',
  'folder:searchByNameInFolder',
  'folder:selectFolderForItem',

  'general:all',
  'general:aboutToDeleteCount',
  'general:aboutToDelete',
  'general:aboutToPermanentlyDelete',
  'general:aboutToPermanentlyDeleteTrash',
  'general:aboutToRestore',
  'general:aboutToRestoreAsDraft',
  'general:aboutToRestoreAsDraftCount',
  'general:aboutToRestoreCount',
  'general:aboutToTrash',
  'general:aboutToTrashCount',
  'general:addBelow',
  'general:addFilter',
  'general:adminTheme',
  'general:allCollections',
  'general:and',
  'general:anotherUser',
  'general:anotherUserTakenOver',
  'general:applyChanges',
  'general:ascending',
  'general:automatic',
  'general:backToDashboard',
  'general:cancel',
  'general:changesNotSaved',
  'general:close',
  'general:collapse',
  'general:collections',
  'general:confirmMove',
  'general:yes',
  'general:no',
  'general:columns',
  'general:columnToSort',
  'general:confirm',
  'general:confirmCopy',
  'general:confirmDeletion',
  'general:confirmDuplication',
  'general:confirmReindex',
  'general:confirmReindexAll',
  'general:confirmReindexDescription',
  'general:confirmReindexDescriptionAll',
  'general:confirmRestoration',
  'general:copied',
  'general:clear',
  'general:clearAll',
  'general:copy',
  'general:copyField',
  'general:copyRow',
  'general:copyWarning',
  'general:copying',
  'general:create',
  'general:created',
  'general:createdAt',
  'general:createNew',
  'general:createNewLabel',
  'general:creating',
  'general:creatingNewLabel',
  'general:currentlyEditing',
  'general:custom',
  'general:dark',
  'general:dashboard',
  'general:delete',
  'general:deleted',
  'general:deletedAt',
  'general:deletePermanently',
  'general:deleteLabel',
  'general:deletedSuccessfully',
  'general:deletedCountSuccessfully',
  'general:deleting',
  'general:descending',
  'general:depth',
  'general:deselectAllRows',
  'general:document',
  'general:documentIsTrashed',
  'general:documentLocked',
  'general:documents',
  'general:duplicate',
  'general:duplicateWithoutSaving',
  'general:edit',
  'general:editAll',
  'general:editing',
  'general:editingLabel',
  'general:editingTakenOver',
  'general:editLabel',
  'general:editedSince',
  'general:email',
  'general:emailAddress',
  'general:emptyTrash',
  'general:emptyTrashLabel',
  'general:enterAValue',
  'general:error',
  'general:errors',
  'general:fallbackToDefaultLocale',
  'general:false',
  'general:filters',
  'general:filterWhere',
  'general:globals',
  'general:goBack',
  'general:groupByLabel',
  'general:isEditing',
  'general:item',
  'general:items',
  'general:language',
  'general:lastModified',
  'general:leaveAnyway',
  'general:leaveWithoutSaving',
  'general:light',
  'general:livePreview',
  'general:lock',
  'general:exitLivePreview',
  'general:loading',
  'general:locale',
  'general:locales',
  'general:menu',
  'general:moreOptions',
  'general:move',
  'general:moveConfirm',
  'general:moveCount',
  'general:moveDown',
  'general:moveUp',
  'general:moving',
  'general:movingCount',
  'general:name',
  'general:next',
  'general:newLabel',
  'general:noDateSelected',
  'general:noFiltersSet',
  'general:noLabel',
  'general:none',
  'general:noOptions',
  'general:noResults',
  'general:notFound',
  'general:nothingFound',
  'general:noTrashResults',
  'general:noUpcomingEventsScheduled',
  'general:noValue',
  'general:of',
  'general:open',
  'general:only',
  'general:or',
  'general:order',
  'general:overwriteExistingData',
  'general:pageNotFound',
  'general:password',
  'general:pasteField',
  'general:pasteRow',
  'general:payloadSettings',
  'general:permanentlyDelete',
  'general:permanentlyDeletedCountSuccessfully',
  'general:perPage',
  'general:previous',
  'general:reindex',
  'general:reindexingAll',
  'general:remove',
  'general:rename',
  'general:reset',
  'general:resetPreferences',
  'general:resetPreferencesDescription',
  'general:resettingPreferences',
  'general:restore',
  'general:restoreAsPublished',
  'general:restoredCountSuccessfully',
  'general:restoring',
  'general:row',
  'general:rows',
  'general:save',
  'general:schedulePublishFor',
  'general:saving',
  'general:searchBy',
  'general:select',
  'general:selectAll',
  'general:selectAllRows',
  'general:selectedCount',
  'general:selectLabel',
  'general:selectValue',
  'general:showAllLabel',
  'general:sorryNotFound',
  'general:sort',
  'general:sortByLabelDirection',
  'general:stayOnThisPage',
  'general:submissionSuccessful',
  'general:submit',
  'general:submitting',
  'general:success',
  'general:successfullyCreated',
  'general:successfullyDuplicated',
  'general:successfullyReindexed',
  'general:takeOver',
  'general:thisLanguage',
  'general:time',
  'general:timezone',
  'general:titleDeleted',
  'general:titleTrashed',
  'general:titleRestored',
  'general:trash',
  'general:trashedCountSuccessfully',
  'general:import',
  'general:export',
  'general:allLocales',
  'general:true',
  'general:upcomingEvents',
  'general:users',
  'general:user',
  'general:username',
  'general:unauthorized',
  'general:unlock',
  'general:unsavedChanges',
  'general:unsavedChangesDuplicate',
  'general:untitled',
  'general:updatedAt',
  'general:updatedLabelSuccessfully',
  'general:updatedCountSuccessfully',
  'general:updateForEveryone',
  'general:updatedSuccessfully',
  'general:updating',
  'general:value',
  'general:viewing',
  'general:viewReadOnly',
  'general:uploading',
  'general:uploadingBulk',
  'general:welcome',

  'localization:localeToPublish',
  'localization:copyToLocale',
  'localization:copyFromTo',
  'localization:selectedLocales',
  'localization:selectLocaleToCopy',
  'localization:selectLocaleToDuplicate',
  'localization:cannotCopySameLocale',
  'localization:copyFrom',
  'localization:copyTo',

  'operators:equals',
  'operators:exists',
  'operators:isNotIn',
  'operators:isIn',
  'operators:contains',
  'operators:isLike',
  'operators:isNotLike',
  'operators:isNotEqualTo',
  'operators:near',
  'operators:isGreaterThan',
  'operators:isLessThan',
  'operators:isGreaterThanOrEqualTo',
  'operators:isLessThanOrEqualTo',
  'operators:within',
  'operators:intersects',

  'upload:addFile',
  'upload:addFiles',
  'upload:bulkUpload',
  'upload:crop',
  'upload:cropToolDescription',
  'upload:dragAndDrop',
  'upload:editImage',
  'upload:fileToUpload',
  'upload:filesToUpload',
  'upload:focalPoint',
  'upload:focalPointDescription',
  'upload:height',
  'upload:pasteURL',
  'upload:previewSizes',
  'upload:selectCollectionToBrowse',
  'upload:selectFile',
  'upload:setCropArea',
  'upload:setFocalPoint',
  'upload:sizesFor',
  'upload:sizes',
  'upload:width',
  'upload:fileName',
  'upload:fileSize',
  'upload:noFile',
  'upload:download',

  'validation:emailAddress',
  'validation:enterNumber',
  'validation:fieldHasNo',
  'validation:greaterThanMax',
  'validation:invalidInput',
  'validation:invalidSelection',
  'validation:invalidSelections',
  'validation:latitudeOutOfBounds',
  'validation:lessThanMin',
  'validation:limitReached',
  'validation:longitudeOutOfBounds',
  'validation:invalidBlock',
  'validation:invalidBlocks',
  'validation:longerThanMin',
  'validation:notValidDate',
  'validation:required',
  'validation:requiresAtLeast',
  'validation:requiresNoMoreThan',
  'validation:requiresTwoNumbers',
  'validation:shorterThanMax',
  'validation:trueOrFalse',
  'validation:timezoneRequired',
  'validation:username',
  'validation:validUploadID',

  'version:aboutToPublishSelection',
  'version:aboutToRestore',
  'version:aboutToRestoreGlobal',
  'version:aboutToRevertToPublished',
  'version:aboutToUnpublish',
  'version:aboutToUnpublishSelection',
  'version:autosave',
  'version:autosavedSuccessfully',
  'version:autosavedVersion',
  'version:versionAgo',
  'version:moreVersions',
  'version:changed',
  'version:changedFieldsCount',
  'version:confirmRevertToSaved',
  'version:compareVersions',
  'version:comparingAgainst',
  'version:currentlyViewing',
  'version:confirmPublish',
  'version:confirmUnpublish',
  'version:confirmVersionRestoration',
  'version:currentDraft',
  'version:currentPublishedVersion',
  'version:currentlyPublished',
  'version:draft',
  'version:draftHasPublishedVersion',
  'version:draftSavedSuccessfully',
  'version:lastSavedAgo',
  'version:modifiedOnly',
  'version:noFurtherVersionsFound',
  'version:noLabelGroup',
  'version:noRowsFound',
  'version:noRowsSelected',
  'version:preview',
  'version:previouslyDraft',
  'version:previouslyPublished',
  'version:previousVersion',
  'version:problemRestoringVersion',
  'version:publish',
  'version:publishAllLocales',
  'version:publishChanges',
  'version:published',
  'version:publishIn',
  'version:publishing',
  'version:restoreAsDraft',
  'version:restoredSuccessfully',
  'version:restoreThisVersion',
  'version:restoring',
  'version:reverting',
  'version:revertToPublished',
  'version:saveDraft',
  'version:scheduledSuccessfully',
  'version:schedulePublish',
  'version:selectLocales',
  'version:selectVersionToCompare',
  'version:showLocales',
  'version:specificVersion',
  'version:status',
  'version:type',
  'version:unpublish',
  'version:unpublishing',
  'version:versionID',
  'version:version',
  'version:versions',
  'version:viewingVersion',
  'version:viewingVersionGlobal',
  'version:viewingVersions',
  'version:viewingVersionsGlobal',
])
```

--------------------------------------------------------------------------------

---[FILE: importDateFNSLocale.ts]---
Location: payload-main/packages/translations/src/importDateFNSLocale.ts

```typescript
import type { Locale } from 'date-fns'

export const importDateFNSLocale = async (locale: string): Promise<Locale> => {
  let result

  switch (locale) {
    case 'ar':
      result = (await import('date-fns/locale/ar')).ar

      break
    case 'az':
      result = (await import('date-fns/locale/az')).az

      break
    case 'bg':
      result = (await import('date-fns/locale/bg')).bg

      break
    case 'bn-BD':
      result = (await import('date-fns/locale/bn')).bn

      break
    case 'bn-IN':
      result = (await import('date-fns/locale/bn')).bn

      break
    case 'ca':
      result = (await import('date-fns/locale/ca')).ca

      break
    case 'cs':
      result = (await import('date-fns/locale/cs')).cs

      break
    case 'da':
      result = (await import('date-fns/locale/da')).da

      break
    case 'de':
      result = (await import('date-fns/locale/de')).de

      break
    case 'en-US':
      result = (await import('date-fns/locale/en-US')).enUS

      break
    case 'es':
      result = (await import('date-fns/locale/es')).es

      break
    case 'et':
      result = (await import('date-fns/locale/et')).et

      break
    case 'fa-IR':
      result = (await import('date-fns/locale/fa-IR')).faIR

      break
    case 'fr':
      result = (await import('date-fns/locale/fr')).fr

      break
    case 'he':
      result = (await import('date-fns/locale/he')).he

      break
    case 'hr':
      result = (await import('date-fns/locale/hr')).hr

      break
    case 'hu':
      result = (await import('date-fns/locale/hu')).hu

      break
    case 'id':
      result = (await import('date-fns/locale/id')).id

      break

    case 'is':
      result = (await import('date-fns/locale/is')).is

      break

    case 'it':
      result = (await import('date-fns/locale/it')).it

      break
    case 'ja':
      result = (await import('date-fns/locale/ja')).ja

      break
    case 'ko':
      result = (await import('date-fns/locale/ko')).ko

      break
    case 'lt':
      result = (await import('date-fns/locale/lt')).lt

      break
    case 'lv':
      result = (await import('date-fns/locale/lv')).lv

      break

    case 'nb':
      result = (await import('date-fns/locale/nb')).nb

      break
    case 'nl':
      result = (await import('date-fns/locale/nl')).nl

      break
    case 'pl':
      result = (await import('date-fns/locale/pl')).pl

      break
    case 'pt':
      result = (await import('date-fns/locale/pt')).pt

      break
    case 'ro':
      result = (await import('date-fns/locale/ro')).ro

      break
    case 'rs':
      result = (await import('date-fns/locale/sr')).sr

      break
    case 'rs-Latin':
      result = (await import('date-fns/locale/sr-Latn')).srLatn

      break
    case 'ru':
      result = (await import('date-fns/locale/ru')).ru

      break
    case 'sk':
      result = (await import('date-fns/locale/sk')).sk

      break
    case 'sl-SI':
      result = (await import('date-fns/locale/sl')).sl

      break
    case 'sv':
      result = (await import('date-fns/locale/sv')).sv

      break
    case 'ta':
      result = (await import('date-fns/locale/ta')).ta

      break
    case 'th':
      result = (await import('date-fns/locale/th')).th

      break
    case 'tr':
      result = (await import('date-fns/locale/tr')).tr

      break
    case 'uk':
      result = (await import('date-fns/locale/uk')).uk

      break
    case 'vi':
      result = (await import('date-fns/locale/vi')).vi

      break
    case 'zh-CN':
      result = (await import('date-fns/locale/zh-CN')).zhCN

      break
    case 'zh-TW':
      result = (await import('date-fns/locale/zh-TW')).zhTW

      break
  }

  // @ts-expect-error - I'm not sure if this is still necessary.
  if (result?.default) {
    // @ts-expect-error - I'm not sure if this is still necessary.
    return result.default
  }

  return result as Locale
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/translations/src/types.ts

```typescript
import type { Locale } from 'date-fns'

import type { clientTranslationKeys } from './clientKeys.js'
import type { enTranslations } from './languages/en.js'
import type { acceptedLanguages } from './utilities/languages.js'

type DateFNSKeys =
  | 'ar'
  | 'az'
  | 'bg'
  | 'bn-BD'
  | 'bn-IN'
  | 'ca'
  | 'cs'
  | 'da'
  | 'de'
  | 'en-US'
  | 'es'
  | 'et'
  | 'fa-IR'
  | 'fr'
  | 'he'
  | 'hr'
  | 'hu'
  | 'hy-AM'
  | 'id'
  | 'is'
  | 'it'
  | 'ja'
  | 'ko'
  | 'lt'
  | 'lv'
  | 'nb'
  | 'nl'
  | 'pl'
  | 'pt'
  | 'ro'
  | 'rs'
  | 'rs-Latin'
  | 'ru'
  | 'sk'
  | 'sl-SI'
  | 'sv'
  | 'ta'
  | 'th'
  | 'tr'
  | 'uk'
  | 'vi'
  | 'zh-CN'
  | 'zh-TW'

export type Language<TDefaultTranslations = DefaultTranslationsObject> = {
  dateFNSKey: DateFNSKeys
  translations: TDefaultTranslations
}

export type GenericTranslationsObject = {
  [key: string]: GenericTranslationsObject | string
}

export type GenericLanguages = {
  [key in AcceptedLanguages]?: GenericTranslationsObject
}

export type AcceptedLanguages = (typeof acceptedLanguages)[number]

export type SupportedLanguages<TDefaultTranslations = DefaultTranslationsObject> = {
  [key in AcceptedLanguages]?: Language<TDefaultTranslations>
}

/**
 * Type utilities for converting between translation objects ( e.g. general: { createNew: 'Create New' } )  and translations keys ( e.g. general:createNew )
 */

export type NestedKeysUnSanitized<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object
          ? `${K}:${NestedKeysUnSanitized<T[K]>}` | null
          : `${K}`
        : never
    }[keyof T]
  : ''

// Utility type to strip specific suffixes
export type StripCountVariants<TKey> = TKey extends
  | `${infer Base}_many`
  | `${infer Base}_one`
  | `${infer Base}_other`
  ? Base
  : TKey

export type NestedKeysStripped<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object
          ? `${K}:${NestedKeysStripped<T[K]>}`
          : `${StripCountVariants<K>}`
        : never
    }[keyof T]
  : ''

export type ReconstructObjectFromTranslationKeys<
  TPath extends string,
  TValue = string,
> = TPath extends `${infer First}:${infer Rest}`
  ? { [K in First]: ReconstructObjectFromTranslationKeys<Rest, TValue> }
  : { [K in TPath]: TValue }

/**
 * Default nested translations object
 */
export type DefaultTranslationsObject = typeof enTranslations

/**
 * All translation keys unSanitized. E.g. 'general:aboutToDeleteCount_many'
 */
export type DefaultTranslationKeysUnSanitized = NestedKeysUnSanitized<DefaultTranslationsObject>

/**
 * All translation keys sanitized. E.g. 'general:aboutToDeleteCount'
 */
export type DefaultTranslationKeys = NestedKeysStripped<DefaultTranslationsObject>

export type ClientTranslationKeys<TExtraProps = (typeof clientTranslationKeys)[number]> =
  TExtraProps

// Use GenericTranslationsObject instead of reconstructing the object from the client keys. This is because reconstructing the object is
// A) Expensive on performance.
// B) Not important to be typed specifically for the client translations. We really only care about the client translation keys to be typed.
// C) Inaccurate. Client keys which previously had _many, _one or other suffixes have been removed and cannot be reconstructed
export type ClientTranslationsObject = GenericTranslationsObject //ReconstructObjectFromTranslationKeys<ClientTranslationKeys>

export type TFunction<TTranslationKeys = DefaultTranslationKeys> = (
  key: TTranslationKeys,
  options?: Record<string, any>,
) => string

export type I18n<
  TTranslations = DefaultTranslationsObject,
  TTranslationKeys = DefaultTranslationKeys,
> = {
  dateFNS: Locale
  /** Corresponding dateFNS key */
  dateFNSKey: DateFNSKeys
  /** The fallback language */
  fallbackLanguage: string
  /** The language of the request */
  language: string
  /** Translate function */
  t: TFunction<TTranslationKeys>
  translations: Language<TTranslations>['translations']
}

export type I18nOptions<TTranslations = DefaultTranslationsObject> = {
  fallbackLanguage?: AcceptedLanguages
  supportedLanguages?: SupportedLanguages
  translations?: Partial<{
    [key in AcceptedLanguages]?: Language<TTranslations>['translations']
  }>
}

export type InitTFunction<
  TTranslations = DefaultTranslationsObject,
  TTranslationKeys = DefaultTranslationKeys,
> = (args: {
  config: I18nOptions<TTranslations>
  language?: string
  translations: Language<TTranslations>['translations']
}) => {
  t: TFunction<TTranslationKeys>
  translations: Language<TTranslations>['translations']
}

export type InitI18n =
  | ((args: { config: I18nOptions; context: 'api'; language: AcceptedLanguages }) => Promise<I18n>)
  | ((args: {
      config: I18nOptions<ClientTranslationsObject>
      context: 'client'
      language: AcceptedLanguages
    }) => Promise<I18n<ClientTranslationsObject, ClientTranslationKeys>>)

export type LanguagePreference = {
  language: AcceptedLanguages
  quality?: number
}

export type I18nClient<TAdditionalTranslations = {}, TAdditionalKeys extends string = never> = I18n<
  TAdditionalTranslations extends object
    ? ClientTranslationsObject & TAdditionalTranslations
    : ClientTranslationsObject,
  [TAdditionalKeys] extends [never]
    ? ClientTranslationKeys
    : ClientTranslationKeys | TAdditionalKeys
>
export type I18nServer<TAdditionalTranslations = {}, TAdditionalKeys extends string = never> = I18n<
  TAdditionalTranslations extends object
    ? DefaultTranslationsObject & TAdditionalTranslations
    : DefaultTranslationsObject,
  [TAdditionalKeys] extends [never]
    ? DefaultTranslationKeys
    : DefaultTranslationKeys | TAdditionalKeys
>
```

--------------------------------------------------------------------------------

---[FILE: all.ts]---
Location: payload-main/packages/translations/src/exports/all.ts

```typescript
import type { SupportedLanguages } from '../types.js'

import { ar } from '../languages/ar.js'
import { az } from '../languages/az.js'
import { bg } from '../languages/bg.js'
import { bnBd } from '../languages/bnBd.js'
import { bnIn } from '../languages/bnIn.js'
import { ca } from '../languages/ca.js'
import { cs } from '../languages/cs.js'
import { da } from '../languages/da.js'
import { de } from '../languages/de.js'
import { en } from '../languages/en.js'
import { es } from '../languages/es.js'
import { et } from '../languages/et.js'
import { fa } from '../languages/fa.js'
import { fr } from '../languages/fr.js'
import { he } from '../languages/he.js'
import { hr } from '../languages/hr.js'
import { hu } from '../languages/hu.js'
import { hy } from '../languages/hy.js'
import { id } from '../languages/id.js'
import { is } from '../languages/is.js'
import { it } from '../languages/it.js'
import { ja } from '../languages/ja.js'
import { ko } from '../languages/ko.js'
import { lt } from '../languages/lt.js'
import { lv } from '../languages/lv.js'
import { my } from '../languages/my.js'
import { nb } from '../languages/nb.js'
import { nl } from '../languages/nl.js'
import { pl } from '../languages/pl.js'
import { pt } from '../languages/pt.js'
import { ro } from '../languages/ro.js'
import { rs } from '../languages/rs.js'
import { rsLatin } from '../languages/rsLatin.js'
import { ru } from '../languages/ru.js'
import { sk } from '../languages/sk.js'
import { sl } from '../languages/sl.js'
import { sv } from '../languages/sv.js'
import { ta } from '../languages/ta.js'
import { th } from '../languages/th.js'
import { tr } from '../languages/tr.js'
import { uk } from '../languages/uk.js'
import { vi } from '../languages/vi.js'
import { zh } from '../languages/zh.js'
import { zhTw } from '../languages/zhTw.js'

export const translations = {
  ar,
  az,
  bg,
  'bn-BD': bnBd,
  'bn-IN': bnIn,
  ca,
  cs,
  da,
  de,
  en,
  es,
  et,
  fa,
  fr,
  he,
  hr,
  hu,
  hy,

  id,
  is,
  it,
  ja,
  ko,
  lt,
  lv,
  my,
  nb,
  nl,
  pl,
  pt,
  ro,
  rs,
  'rs-latin': rsLatin,
  ru,
  sk,
  sl,
  sv,
  ta,
  th,
  tr,
  uk,
  vi,
  zh,
  'zh-TW': zhTw,
} as SupportedLanguages
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/translations/src/exports/index.ts

```typescript
export { importDateFNSLocale } from '../importDateFNSLocale.js'
export type * from '../types.js'
export { getTranslation } from '../utilities/getTranslation.js'
export { initI18n, t } from '../utilities/init.js'
export { acceptedLanguages, extractHeaderLanguage, rtlLanguages } from '../utilities/languages.js'
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/translations/src/exports/utilities.ts

```typescript
export { deepMergeSimple } from '../utilities/deepMergeSimple.js'
```

--------------------------------------------------------------------------------

````

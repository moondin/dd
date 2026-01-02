---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 2
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 2 of 37)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - ToolJet-develop
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ToolJet-develop
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: restAPIHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/restAPIHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: rethinkDbHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/rethinkDbHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: s3HappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/s3HappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: smtpHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/smtpHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: snowflakeHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/snowflakeHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: sqlServerHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/sqlServerHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: twilioHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/twilioHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: typeSenseHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/typeSenseHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: version.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/platform/ceTestcases/apps/version.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { commonSelectors, commonWidgetSelector } from "Selectors/common";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: dataSourcePermissions.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/platform/ceTestcases/dataSources/dataSourcePermissions.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workspaceConstants.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/platform/ceTestcases/workspace/workspaceConstants.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { commonSelectors, commonWidgetSelector } from "Selectors/common";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: permissions.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/platform/commonTestcases/workspace/groups/permissions.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { groupsSelector } from "Selectors/manageGroups";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: multiEnv.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/platform/eeTestcases/multi-env/multiEnv.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: api.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/api.js
Signals: N/A
Excerpt (<=80 chars): export const apiRequest = (method, url, body = {}, headers = {}) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- apiRequest
- createUser
- getUser
- getAllUsers
- updateUser
- updateUserRole
- replaceUserWorkspace
- replaceUserWorkspacesRelations
- getAllWorkspaces
- importApp
- exportApp
- allAppsDetails
- createGroup
- validateUserInGroup
```

--------------------------------------------------------------------------------

---[FILE: apps.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/apps.js
Signals: N/A
Excerpt (<=80 chars):  export const verifySlugValidations = (inputSelector) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifySlugValidations
- verifySuccessfulSlugUpdate
- verifyURLs
- setUpSlug
- setupAppWithSlug
- verifyRestrictedAccess
- onboardUserFromAppLink
- resolveHost
```

--------------------------------------------------------------------------------

---[FILE: basicComponents.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/basicComponents.js
Signals: TypeORM
Excerpt (<=80 chars):  export const verifyComponent = (widgetName) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyComponent
- verifyComponentinrightpannel
- deleteComponentAndVerify
- verifyComponentWithOutLabel
```

--------------------------------------------------------------------------------

---[FILE: button.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/button.js
Signals: N/A
Excerpt (<=80 chars):  export const verifyControlComponentAction = (widgetName, value) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyControlComponentAction
- addBasicData
- verifyBasicData
```

--------------------------------------------------------------------------------

---[FILE: common.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/common.js
Signals: N/A
Excerpt (<=80 chars):  export const navigateToProfile = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- navigateToProfile
- logout
- navigateToManageUsers
- navigateToManageGroups
- navigateToWorkspaceVariable
- navigateToManageSSO
- randomDateOrTime
- createFolder
- deleteFolder
- deleteDownloadsFolder
- navigateToAppEditor
- viewAppCardOptions
- viewFolderCardOptions
- verifyModal
- verifyConfirmationModal
- closeModal
- cancelModal
- navigateToAuditLogsPage
```

--------------------------------------------------------------------------------

---[FILE: commonWidget.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/commonWidget.js
Signals: N/A
Excerpt (<=80 chars):  export const openAccordion = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- openAccordion
- verifyAndModifyParameter
- openEditorSidebar
- verifyAndModifyToggleFx
- addDefaultEventHandler
- addAndVerifyTooltip
- editAndVerifyWidgetName
- verifyComponentValueFromInspector
- verifyMultipleComponentValuesFromInspector
- selectColourFromColourPicker
- fillBoxShadowParams
- verifyBoxShadowCss
- verifyComponentFromInspector
- verifyAndModifyStylePickerFx
- verifyWidgetColorCss
- verifyLoaderColor
- verifyLayout
- verifyPropertiesGeneralAccordion
```

--------------------------------------------------------------------------------

---[FILE: dashboard.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/dashboard.js
Signals: N/A
Excerpt (<=80 chars):  export const modifyAndVerifyAppCardIcon = (appName) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modifyAndVerifyAppCardIcon
- verifyAppDelete
```

--------------------------------------------------------------------------------

---[FILE: database.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/database.js
Signals: N/A
Excerpt (<=80 chars):  export const verifyAllElementsOfPage = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyAllElementsOfPage
- navigateToTable
- createTableAndVerifyToastMessage
- selectTableOperationOption
- editTableNameAndVerifyToastMessage
- deleteTableAndVerifyToastMessage
- addNewColumnAndVerify
- createNewColumnAndVerify
- addNewRowAndVerify
- verifyAllElementsOfAddTableSection
- filterOperation
- sortOperation
- deleteCondition
- deleteRowAndVerify
- verifyRowData
- editRowAndVerify
- editRowWithInvalidData
- exportTableAndVerify
```

--------------------------------------------------------------------------------

---[FILE: dataSource.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/dataSource.js
Signals: TypeORM
Excerpt (<=80 chars):  export const verifyCouldnotConnectWithAlert = (dangerText) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyCouldnotConnectWithAlert
- resizeQueryPanel
- query
- verifypreview
- addInput
- deleteDatasource
- deleteAppandDatasourceAfterExecution
- closeDSModal
- addQueryN
- addQuery
- addDsAndAddQuery
- addQueryAndOpenEditor
- verifyValueOnInspector
- selectDatasource
- createDataQuery
- createRestAPIQuery
```

--------------------------------------------------------------------------------

---[FILE: datePickerWidget.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/datePickerWidget.js
Signals: N/A
Excerpt (<=80 chars):  export const selectAndVerifyDate = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- selectAndVerifyDate
- verifyDate
- selectAndVerifyTime
```

--------------------------------------------------------------------------------

---[FILE: dropdown.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/dropdown.js
Signals: N/A
Excerpt (<=80 chars): export const selectFromDropDown = (dropdownName, option, index = 3) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- selectFromDropDown
- clearSelection
- verifySelectedOptionOnDropdown
- verifyOptionOnSidePanel
- deleteOption
- addNewOption
- updateOptionLabelAndValue
- verifyOptionOnDropdown
- verifyOptionMenuElements
```

--------------------------------------------------------------------------------

---[FILE: events.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/events.js
Signals: N/A
Excerpt (<=80 chars): export const selectEvent = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- selectEvent
- selectCSA
- addSupportCSAData
- selectSupportCSAData
- changeEventType
- addMultiEventsWithAlert
```

--------------------------------------------------------------------------------

---[FILE: exportImport.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/exportImport.js
Signals: N/A
Excerpt (<=80 chars):  export const verifyElementsOfExportModal = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyElementsOfExportModal
- createNewVersion
- clickOnExportButtonAndVerify
- exportAllVersionsAndVerify
- importAndVerifyApp
```

--------------------------------------------------------------------------------

---[FILE: inspector.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/inspector.js
Signals: N/A
Excerpt (<=80 chars):  export const openAndVerifyNode = (nodeName, nodes, verificationFunction) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- openAndVerifyNode
- verifyNodes
- openNode
- openStateFromComponent
- verifyNodeData
- deleteComponentFromInspector
```

--------------------------------------------------------------------------------

---[FILE: listviewWidget.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/listviewWidget.js
Signals: N/A
Excerpt (<=80 chars):  export const deleteInnerWidget = (widgetName, innerWidgetName) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- deleteInnerWidget
- dropWidgetToListview
- verifyMultipleComponentValuesFromInspector
- addDataToListViewInputs
- verifyValuesOnList
- verifyExposedValueByToast
- textArrayOfLength
```

--------------------------------------------------------------------------------

---[FILE: manageGroups.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/manageGroups.js
Signals: N/A
Excerpt (<=80 chars):  export const manageGroupsElements = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- manageGroupsElements
- permissionModal
- addAppToGroup
- createGroupAddAppAndUserToGroup
- OpenGroupCardOption
- duplicateMultipleGroups
- verifyGroupCardOptions
- groupPermission
- duplicateGroup
- updateRoleUI
- updateRole
- createGroupsAndAddUserInGroup
- addUserInGroup
- inviteUserBasedOnRole
- verifyBasicPermissions
- setupWorkspaceAndInviteUser
- verifySettingsAccess
- verifyUserPrivileges
```

--------------------------------------------------------------------------------

---[FILE: manageSSO.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/manageSSO.js
Signals: N/A
Excerpt (<=80 chars):  export const generalSettings = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generalSettings
- googleSSOPageElements
- gitSSOPageElements
- visitWorkspaceLoginPage
- workspaceLoginPageElements
- signInPageElements
- enableSignUp
- disableSignUp
- invitePageElements
- dbConnection
- setSSOStatus
- defaultSSO
- setSignupStatus
- deleteOrganisationSSO
- resetDomain
- enableInstanceSignup
```

--------------------------------------------------------------------------------

---[FILE: manageUsers.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/manageUsers.js
Signals: N/A
Excerpt (<=80 chars):  export const manageUsersElements = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- manageUsersElements
- inviteUserToWorkspace
- confirmInviteElements
- userStatus
- bulkUserUpload
- copyInvitationLink
- fillUserInviteForm
- selectUserGroup
- inviteUserWithUserGroups
- fetchAndVisitInviteLink
- inviteUserWithUserRole
```

--------------------------------------------------------------------------------

---[FILE: modal.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/modal.js
Signals: N/A
Excerpt (<=80 chars):  export const launchModal = (componentName) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- launchModal
- launchButton
- verifySize
- closeModal
- addAndVerifyColor
- typeOnFx
```

--------------------------------------------------------------------------------

---[FILE: mongoDB.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/mongoDB.js
Signals: N/A
Excerpt (<=80 chars):  export const connectMongo = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- connectMongo
- openMongoQueryEditor
- selectQueryType
```

--------------------------------------------------------------------------------

---[FILE: multipage.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/multipage.js
Signals: N/A
Excerpt (<=80 chars):  export const searchPage = (pageName) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- searchPage
- clearSearch
- modifyPageHandle
- detetePage
- hideOrUnhidePage
- setHomePage
- addNewPage
- addEventHandler
- hideOrUnhidePageMenu
- disableOrEnablePage
```

--------------------------------------------------------------------------------

---[FILE: multiselectWidget.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/multiselectWidget.js
Signals: N/A
Excerpt (<=80 chars):  export const verifyMultiselectOptions = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyMultiselectOptions
- verifyMultiselectStatus
- selectFromMultiSelect
- verifyMultiselectHeader
```

--------------------------------------------------------------------------------

---[FILE: onboarding.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/onboarding.js
Signals: N/A
Excerpt (<=80 chars):  export const verifyConfirmEmailPage = (email) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyConfirmEmailPage
- verifyOnboardingQuestions
- verifyInvalidInvitationLink
- userSignUp
- inviteUser
- addNewUser
- roleBasedOnboarding
- visitWorkspaceInvitation
- SignUpPageElements
- signUpLink
- bannerElementsVerification
- enableInstanceSignUp
- onboardingStepOne
- onboardingStepTwo
- onboardingStepThree
```

--------------------------------------------------------------------------------

---[FILE: postgreSql.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/postgreSql.js
Signals: TypeORM
Excerpt (<=80 chars):  export const addQuery = (queryName, query, dbName) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addQuery
- addQueryOnGui
- selectAndAddDataSource
- fillConnectionForm
- fillDataSourceTextField
- openQueryEditor
- selectQueryMode
- addGuiQuery
- addEventHandlerToRunQuery
- addWidgetsToAddUser
- addListviewToVerifyData
```

--------------------------------------------------------------------------------

---[FILE: profile.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/profile.js
Signals: N/A
Excerpt (<=80 chars):  export const profilePageElements = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- profilePageElements
```

--------------------------------------------------------------------------------

---[FILE: queries.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/queries.js
Signals: N/A
Excerpt (<=80 chars):  export const selectQueryFromLandingPage = (dbName, label) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- selectQueryFromLandingPage
- deleteQuery
- query
- changeQueryToggles
- renameQueryFromEditor
- addInputOnQueryField
- waitForQueryAction
- chainQuery
- addSuccessNotification
```

--------------------------------------------------------------------------------

---[FILE: restAPI.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/restAPI.js
Signals: TypeORM
Excerpt (<=80 chars): export const createAndRunRestAPIQuery = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createAndRunRestAPIQuery
```

--------------------------------------------------------------------------------

---[FILE: selfHostSignUp.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/selfHostSignUp.js
Signals: N/A
Excerpt (<=80 chars):  export const selfHostCommonElements = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- selfHostCommonElements
- commonElementsWorkspaceSetup
- verifyandModifyUserRole
- verifyandModifySizeOftheCompany
```

--------------------------------------------------------------------------------

---[FILE: table.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/table.js
Signals: N/A
Excerpt (<=80 chars):  export const searchOnTable = (value = "") => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- searchOnTable
- verifyTableElements
- selectDropdownOption
- verifyAndEnterColumnOptionInput
- addAndOpenColumnOption
- deleteAndVerifyColumn
- verifyInvalidFeedback
- addInputOnTable
- verifySingleValueOnTable
- verifyAndModifyToggleFx
- selectFromSidebarDropdown
- dataPdfAssertionHelper
- dataCsvAssertionHelper
- addFilter
- addNewRow
```

--------------------------------------------------------------------------------

---[FILE: version.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/version.js
Signals: N/A
Excerpt (<=80 chars):  export const navigateToCreateNewVersionModal = (value) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- navigateToCreateNewVersionModal
- navigateToEditVersionModal
- verifyElementsOfCreateNewVersionModal
- editVersionAndVerify
- deleteVersionAndVerify
- verifyDuplicateVersion
- releasedVersionAndVerify
- verifyVersionAfterPreview
- switchVersionAndVerify
```

--------------------------------------------------------------------------------

---[FILE: workspaceConstants.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/workspaceConstants.js
Signals: TypeORM
Excerpt (<=80 chars): export const contantsNameValidation = (selector, value, errorSelector, error)...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- contantsNameValidation
- addNewconstants
- deleteConstant
- existingNameValidation
- addConstantFormUI
- switchToConstantTab
- verifyConstantValueVisibility
- manageWorkspaceConstant
```

--------------------------------------------------------------------------------

---[FILE: codehinter.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/editor/codehinter.js
Signals: N/A
Excerpt (<=80 chars):  export const addAndVerifyOnSingleLine = (data, property = '', componentName ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addAndVerifyOnSingleLine
```

--------------------------------------------------------------------------------

---[FILE: inputFieldUtils.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/editor/inputFieldUtils.js
Signals: N/A
Excerpt (<=80 chars):  export const addValidations = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addValidations
- addAndVerifyAdditionalActions
- addAllInputFieldColors
- verifyInputFieldColors
- verifyLabelStyleElements
- verifyAlignment
- verifyCustomWidthOfLabel
- addCustomWidthOfLabel
```

--------------------------------------------------------------------------------

---[FILE: passwordNumberInput.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/editor/passwordNumberInput.js
Signals: N/A
Excerpt (<=80 chars):  export const verifyControlComponentAction = (widgetName, value) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyControlComponentAction
- randomString
- verifyCSA
- addCSA
```

--------------------------------------------------------------------------------

---[FILE: text.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/editor/text.js
Signals: N/A
Excerpt (<=80 chars): export const verifyBasicStyles = (data) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyBasicStyles
```

--------------------------------------------------------------------------------

---[FILE: textInput.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/editor/textInput.js
Signals: N/A
Excerpt (<=80 chars):  export const verifyControlComponentAction = (widgetName, value) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyControlComponentAction
- randomString
- verifyCSA
- addCSA
```

--------------------------------------------------------------------------------

---[FILE: eeCommon.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/platform/eeCommon.js
Signals: TypeORM
Excerpt (<=80 chars):  export const oidcSSOPageElements = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- oidcSSOPageElements
- resetDsPermissions
- deleteAssignedDatasources
- userSignUp
- allowPersonalWorkspace
- addNewUserEE
- inviteUser
- defaultWorkspace
- trunOffAllowPersonalWorkspace
- verifySSOSignUpPageElements
- VerifyWorkspaceInvitePageElements
- WorkspaceInvitationLink
- enableDefaultSSO
- disableSSO
- AddDataSourceToGroup
- enableToggle
- disableToggle
- verifyPromoteModalUI
```

--------------------------------------------------------------------------------

---[FILE: multiEnv.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/platform/multiEnv.js
Signals: N/A
Excerpt (<=80 chars):  export const promoteApp = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- promoteApp
- releaseApp
- launchApp
- appPromote
- createNewVersion
- selectVersion
- selectEnv
```

--------------------------------------------------------------------------------

---[FILE: queryEditor.js]---
Location: ToolJet-develop/cypress-tests/cypress/support/utils/queryPanel/queryEditor.js
Signals: TypeORM
Excerpt (<=80 chars): export const verifyElemtsNoGds = (option) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyElemtsNoGds
- verifyElemtsWithGds
```

--------------------------------------------------------------------------------

---[FILE: homePageData.js]---
Location: ToolJet-develop/docs/docs/homePageData.js
Signals: N/A
Excerpt (<=80 chars):  export const featureCards = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- featureCards
- setupCards
- deployOptions
- dataCards
- organizationCards
- releaseCards
- resourceCards
- textLabels
- sectionCards
```

--------------------------------------------------------------------------------

---[FILE: HomepageFeatures.js]---
Location: ToolJet-develop/docs/src/components/HomepageFeatures.js
Signals: React, TypeORM
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DocsCard.jsx]---
Location: ToolJet-develop/docs/src/components/DocsCard/DocsCard.jsx
Signals: React
Excerpt (<=80 chars):  export const DocsCard = ({ label, imgSrc, link, height = 40, width = 40, tit...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DocsCard
```

--------------------------------------------------------------------------------

---[FILE: DocsCardList.jsx]---
Location: ToolJet-develop/docs/src/components/DocsCard/DocsCardList.jsx
Signals: React
Excerpt (<=80 chars):  export const DocsCardList = ({ list }) => { 

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DocsCardList
```

--------------------------------------------------------------------------------

---[FILE: Admonition.js]---
Location: ToolJet-develop/docs/src/theme/Admonition.js
Signals: React
Excerpt (<=80 chars): import React from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Root.js]---
Location: ToolJet-develop/docs/src/theme/Root.js
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from "react";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/docs/src/theme/Footer/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/docs/src/theme/Footer/Copyright/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/docs/src/theme/Footer/Layout/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/docs/src/theme/Footer/LinkItem/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/docs/src/theme/Footer/Links/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/docs/src/theme/Footer/Links/MultiColumn/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/docs/src/theme/Footer/Links/Simple/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/docs/src/theme/Footer/Logo/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: homePageData.js]---
Location: ToolJet-develop/docs/versioned_docs/version-2.50.0-LTS/homePageData.js
Signals: N/A
Excerpt (<=80 chars):  export const featureCards = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- featureCards
- setupCards
- deployOptions
- dataCards
- organizationCards
- releaseCards
- resourceCards
- textLabels
- sectionCards
```

--------------------------------------------------------------------------------

---[FILE: homePageData.js]---
Location: ToolJet-develop/docs/versioned_docs/version-3.0.0-LTS/homePageData.js
Signals: N/A
Excerpt (<=80 chars):  export const featureCards = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- featureCards
- setupCards
- deployOptions
- dataCards
- organizationCards
- releaseCards
- resourceCards
- textLabels
- sectionCards
```

--------------------------------------------------------------------------------

---[FILE: homePageData.js]---
Location: ToolJet-develop/docs/versioned_docs/version-3.16.0-LTS/homePageData.js
Signals: N/A
Excerpt (<=80 chars):  export const featureCards = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- featureCards
- setupCards
- deployOptions
- dataCards
- organizationCards
- releaseCards
- resourceCards
- textLabels
- sectionCards
```

--------------------------------------------------------------------------------

---[FILE: homePageData.js]---
Location: ToolJet-develop/docs/versioned_docs/version-3.5.0-LTS/homePageData.js
Signals: N/A
Excerpt (<=80 chars):  export const featureCards = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- featureCards
- setupCards
- deployOptions
- dataCards
- organizationCards
- releaseCards
- resourceCards
- textLabels
- sectionCards
```

--------------------------------------------------------------------------------

---[FILE: decorators.jsx]---
Location: ToolJet-develop/frontend/.storybook/decorators.jsx
Signals: React
Excerpt (<=80 chars):  export function withColorScheme(story, context) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- withColorScheme
```

--------------------------------------------------------------------------------

---[FILE: boundedbox.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/boundedbox.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: button.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/button.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: buttongroup.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/buttongroup.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: calendar.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/calendar.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: chart.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/chart.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: chat.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/chat.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: checkbox.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/checkbox.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: circularprogressbar.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/circularprogressbar.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: codeeditor.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/codeeditor.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: colorpicker.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/colorpicker.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: container.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/container.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: customcomponent.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/customcomponent.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: datepicker.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/datepicker.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: datepickerv2.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/datepickerv2.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: daterangepicker.jsx]---
Location: ToolJet-develop/frontend/assets/images/icons/widgets/daterangepicker.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````

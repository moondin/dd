---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 1
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 1 of 37)

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

---[FILE: info.ts]---
Location: ToolJet-develop/cli/src/commands/info.ts
Signals: N/A
Excerpt (<=80 chars):  export class InfoCommand extends Command {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InfoCommand
```

--------------------------------------------------------------------------------

---[FILE: apiCommands.js]---
Location: ToolJet-develop/cypress-tests/cypress/commands/apiCommands.js
Signals: TypeORM
Excerpt (<=80 chars): const envVar = Cypress.env("environment");

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: awss3.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/awss3.js
Signals: N/A
Excerpt (<=80 chars): export const s3Selector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- s3Selector
```

--------------------------------------------------------------------------------

---[FILE: common.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/common.js
Signals: N/A
Excerpt (<=80 chars): export const cyParamName = (paramName = "") => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cyParamName
- commonSelectors
- commonWidgetSelector
```

--------------------------------------------------------------------------------

---[FILE: dashboard.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/dashboard.js
Signals: N/A
Excerpt (<=80 chars):  export const dashboardSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dashboardSelector
```

--------------------------------------------------------------------------------

---[FILE: database.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/database.js
Signals: N/A
Excerpt (<=80 chars):  export const databaseSelectors = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- databaseSelectors
- createNewColumnSelectors
- createNewRowSelectors
- filterSelectors
- sortSelectors
- editRowSelectors
- bulkUploadDataSelectors
```

--------------------------------------------------------------------------------

---[FILE: dataSource.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/dataSource.js
Signals: TypeORM
Excerpt (<=80 chars):  export const dataSourceSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dataSourceSelector
```

--------------------------------------------------------------------------------

---[FILE: datePicker.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/datePicker.js
Signals: N/A
Excerpt (<=80 chars): export const datePickerSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- datePickerSelector
```

--------------------------------------------------------------------------------

---[FILE: eeCommon.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/eeCommon.js
Signals: TypeORM
Excerpt (<=80 chars):  export const commonEeSelectors = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- commonEeSelectors
- ssoEeSelector
- eeGroupsSelector
- instanceSettingsSelector
- multiEnvSelector
- whiteLabellingSelectors
- gitSyncSelector
- workspaceSelector
```

--------------------------------------------------------------------------------

---[FILE: exportImport.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/exportImport.js
Signals: N/A
Excerpt (<=80 chars):  export const appVersionSelectors = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- appVersionSelectors
- exportAppModalSelectors
- importSelectors
```

--------------------------------------------------------------------------------

---[FILE: manageGroups.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/manageGroups.js
Signals: N/A
Excerpt (<=80 chars): export const cyParamName = (paramName = "") => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cyParamName
- groupsSelector
```

--------------------------------------------------------------------------------

---[FILE: manageSSO.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/manageSSO.js
Signals: N/A
Excerpt (<=80 chars): export const ssoSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ssoSelector
```

--------------------------------------------------------------------------------

---[FILE: manageUsers.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/manageUsers.js
Signals: N/A
Excerpt (<=80 chars):  export const usersSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usersSelector
```

--------------------------------------------------------------------------------

---[FILE: multipage.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/multipage.js
Signals: N/A
Excerpt (<=80 chars): export const multipageSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- multipageSelector
```

--------------------------------------------------------------------------------

---[FILE: multiselect.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/multiselect.js
Signals: N/A
Excerpt (<=80 chars):  export const multiselectSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- multiselectSelector
```

--------------------------------------------------------------------------------

---[FILE: onboarding.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/onboarding.js
Signals: N/A
Excerpt (<=80 chars): export const cyParamName = (paramName = "") => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cyParamName
- onboardingSelectors
```

--------------------------------------------------------------------------------

---[FILE: Plugins.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/Plugins.js
Signals: N/A
Excerpt (<=80 chars): export const pluginSelectors = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pluginSelectors
- baserowSelectors
- appWriteSelectors
- twilioSelectors
- minioSelectors
- harperDbSelectors
- awsTextractSelectors
- graphQLSelectors
```

--------------------------------------------------------------------------------

---[FILE: postgreSql.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/postgreSql.js
Signals: TypeORM
Excerpt (<=80 chars): export const postgreSqlSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- postgreSqlSelector
- airTableSelector
```

--------------------------------------------------------------------------------

---[FILE: profile.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/profile.js
Signals: N/A
Excerpt (<=80 chars): export const profileSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- profileSelector
```

--------------------------------------------------------------------------------

---[FILE: restAPI.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/restAPI.js
Signals: N/A
Excerpt (<=80 chars): export const cyParamName = (paramName = "") => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cyParamName
- restAPISelector
```

--------------------------------------------------------------------------------

---[FILE: table.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/table.js
Signals: N/A
Excerpt (<=80 chars): export const tableSelector = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tableSelector
```

--------------------------------------------------------------------------------

---[FILE: version.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/version.js
Signals: N/A
Excerpt (<=80 chars): export const editVersionSelectors = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- editVersionSelectors
- confirmVersionModalSelectors
```

--------------------------------------------------------------------------------

---[FILE: workspaceConstants.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/workspaceConstants.js
Signals: N/A
Excerpt (<=80 chars):  export const workspaceConstantsSelectors = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- workspaceConstantsSelectors
```

--------------------------------------------------------------------------------

---[FILE: workspaceVariable.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/selectors/workspaceVariable.js
Signals: N/A
Excerpt (<=80 chars): export const cyParamName = (paramName = "") => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cyParamName
- workspaceVarSelectors
```

--------------------------------------------------------------------------------

---[FILE: airTable.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/airTable.js
Signals: N/A
Excerpt (<=80 chars): export const airtableText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- airtableText
```

--------------------------------------------------------------------------------

---[FILE: amazonAthena.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/amazonAthena.js
Signals: N/A
Excerpt (<=80 chars): export const amazonAthenaText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- amazonAthenaText
```

--------------------------------------------------------------------------------

---[FILE: amazonSes.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/amazonSes.js
Signals: N/A
Excerpt (<=80 chars): export const amazonSesText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- amazonSesText
```

--------------------------------------------------------------------------------

---[FILE: appwrite.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/appwrite.js
Signals: N/A
Excerpt (<=80 chars): export const appwriteText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- appwriteText
```

--------------------------------------------------------------------------------

---[FILE: awsLambda.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/awsLambda.js
Signals: N/A
Excerpt (<=80 chars): export const awsLambdaText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- awsLambdaText
```

--------------------------------------------------------------------------------

---[FILE: awss3.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/awss3.js
Signals: N/A
Excerpt (<=80 chars): export const s3Text = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- s3Text
```

--------------------------------------------------------------------------------

---[FILE: awsTextract.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/awsTextract.js
Signals: N/A
Excerpt (<=80 chars): export const awsTextractText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- awsTextractText
```

--------------------------------------------------------------------------------

---[FILE: azureBlobStorage.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/azureBlobStorage.js
Signals: N/A
Excerpt (<=80 chars): export const azureBlobStorageText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- azureBlobStorageText
```

--------------------------------------------------------------------------------

---[FILE: baseRow.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/baseRow.js
Signals: N/A
Excerpt (<=80 chars): export const baseRowText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- baseRowText
```

--------------------------------------------------------------------------------

---[FILE: bigquery.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/bigquery.js
Signals: N/A
Excerpt (<=80 chars): export const bigqueryText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bigqueryText
```

--------------------------------------------------------------------------------

---[FILE: button.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/button.js
Signals: N/A
Excerpt (<=80 chars): export const buttonText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buttonText
```

--------------------------------------------------------------------------------

---[FILE: common.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/common.js
Signals: TypeORM
Excerpt (<=80 chars): export const codeMirrorInputLabel = (content) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- codeMirrorInputLabel
- path
- commonText
- commonWidgetText
- createBackspaceText
- widgetValue
- customValidation
```

--------------------------------------------------------------------------------

---[FILE: dashboard.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/dashboard.js
Signals: N/A
Excerpt (<=80 chars): export const dashboardText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dashboardText
```

--------------------------------------------------------------------------------

---[FILE: database.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/database.js
Signals: N/A
Excerpt (<=80 chars): export const databaseText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- databaseText
- createNewColumnText
- createNewRowText
- filterText
- sortText
- editRowText
- bulkUploadDataText
```

--------------------------------------------------------------------------------

---[FILE: dataSource.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/dataSource.js
Signals: N/A
Excerpt (<=80 chars): export const dataSourceText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dataSourceText
```

--------------------------------------------------------------------------------

---[FILE: datePicker.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/datePicker.js
Signals: N/A
Excerpt (<=80 chars): export const datePickerText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- datePickerText
```

--------------------------------------------------------------------------------

---[FILE: dynamodb.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/dynamodb.js
Signals: N/A
Excerpt (<=80 chars): export const dynamoDbText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dynamoDbText
```

--------------------------------------------------------------------------------

---[FILE: eeCommon.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/eeCommon.js
Signals: TypeORM
Excerpt (<=80 chars): export const commonEeText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- commonEeText
- ssoEeText
- eeGroupsText
- instanceSettingsText
```

--------------------------------------------------------------------------------

---[FILE: elasticsearch.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/elasticsearch.js
Signals: N/A
Excerpt (<=80 chars): export const elasticsearchText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- elasticsearchText
```

--------------------------------------------------------------------------------

---[FILE: exportImport.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/exportImport.js
Signals: N/A
Excerpt (<=80 chars): export const appVersionText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- appVersionText
- exportAppModalText
- importText
```

--------------------------------------------------------------------------------

---[FILE: firestore.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/firestore.js
Signals: N/A
Excerpt (<=80 chars): export const firestoreText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- firestoreText
```

--------------------------------------------------------------------------------

---[FILE: graphQL.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/graphQL.js
Signals: N/A
Excerpt (<=80 chars): export const GraphQLText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GraphQLText
```

--------------------------------------------------------------------------------

---[FILE: harperDb.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/harperDb.js
Signals: N/A
Excerpt (<=80 chars): export const harperDbText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- harperDbText
```

--------------------------------------------------------------------------------

---[FILE: listview.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/listview.js
Signals: N/A
Excerpt (<=80 chars): export const listviewText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- listviewText
```

--------------------------------------------------------------------------------

---[FILE: manageGroups.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/manageGroups.js
Signals: N/A
Excerpt (<=80 chars): export const groupsText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- groupsText
```

--------------------------------------------------------------------------------

---[FILE: manageSSO.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/manageSSO.js
Signals: N/A
Excerpt (<=80 chars): export const ssoText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ssoText
```

--------------------------------------------------------------------------------

---[FILE: manageUsers.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/manageUsers.js
Signals: N/A
Excerpt (<=80 chars): export const usersText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usersText
```

--------------------------------------------------------------------------------

---[FILE: minio.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/minio.js
Signals: N/A
Excerpt (<=80 chars): export const minioText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- minioText
```

--------------------------------------------------------------------------------

---[FILE: mongoDb.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/mongoDb.js
Signals: N/A
Excerpt (<=80 chars): export const mongoDbText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mongoDbText
```

--------------------------------------------------------------------------------

---[FILE: multipage.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/multipage.js
Signals: N/A
Excerpt (<=80 chars): export const multipageText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- multipageText
```

--------------------------------------------------------------------------------

---[FILE: multiselect.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/multiselect.js
Signals: N/A
Excerpt (<=80 chars): export const multiselectText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- multiselectText
```

--------------------------------------------------------------------------------

---[FILE: mysql.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/mysql.js
Signals: N/A
Excerpt (<=80 chars): export const mySqlText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mySqlText
```

--------------------------------------------------------------------------------

---[FILE: numberInput.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/numberInput.js
Signals: N/A
Excerpt (<=80 chars): export const numberInputText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- numberInputText
```

--------------------------------------------------------------------------------

---[FILE: onboarding.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/onboarding.js
Signals: N/A
Excerpt (<=80 chars): export const onboardingText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- onboardingText
```

--------------------------------------------------------------------------------

---[FILE: passwordInput.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/passwordInput.js
Signals: N/A
Excerpt (<=80 chars): export const passwordInputText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- passwordInputText
```

--------------------------------------------------------------------------------

---[FILE: postgreSql.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/postgreSql.js
Signals: N/A
Excerpt (<=80 chars): export const postgreSqlText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- postgreSqlText
```

--------------------------------------------------------------------------------

---[FILE: profile.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/profile.js
Signals: N/A
Excerpt (<=80 chars): export const profileText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- profileText
```

--------------------------------------------------------------------------------

---[FILE: redis.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/redis.js
Signals: N/A
Excerpt (<=80 chars): export const redisText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- redisText
```

--------------------------------------------------------------------------------

---[FILE: restAPI.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/restAPI.js
Signals: N/A
Excerpt (<=80 chars): export const restAPIText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- restAPIText
```

--------------------------------------------------------------------------------

---[FILE: table.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/table.js
Signals: N/A
Excerpt (<=80 chars): export const tableText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tableText
```

--------------------------------------------------------------------------------

---[FILE: textInput.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/textInput.js
Signals: N/A
Excerpt (<=80 chars): export const textInputText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- textInputText
```

--------------------------------------------------------------------------------

---[FILE: twilio.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/twilio.js
Signals: N/A
Excerpt (<=80 chars): export const twilioText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- twilioText
```

--------------------------------------------------------------------------------

---[FILE: version.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/version.js
Signals: N/A
Excerpt (<=80 chars):  export const editVersionText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- editVersionText
- deleteVersionText
- onlydeleteVersionText
- releasedVersionText
```

--------------------------------------------------------------------------------

---[FILE: workspaceConstants.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/workspaceConstants.js
Signals: N/A
Excerpt (<=80 chars): export const workspaceConstantsText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- workspaceConstantsText
```

--------------------------------------------------------------------------------

---[FILE: workspacevarText.js]---
Location: ToolJet-develop/cypress-tests/cypress/constants/texts/workspacevarText.js
Signals: N/A
Excerpt (<=80 chars): export const workspaceVarText = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- workspaceVarText
```

--------------------------------------------------------------------------------

---[FILE: buttonHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/appbuilder/commonTestcases/components/buttonHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { commonSelectors, commonWidgetSelector } from "Selectors/common";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: componentsBasicHappypath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/appbuilder/commonTestcases/components/componentsBasicHappypath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { commonWidgetSelector, commonSelectors } from "Selectors/common";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: tableRegression.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/appbuilder/commonTestcases/components/tableRegression.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: globalActions.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/appbuilder/commonTestcases/newSuits/componentsBasics/globalActions.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: chainingOfQueries.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/appbuilder/commonTestcases/newSuits/queries/chainingOfQueries.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: runjsHappyPath.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/appbuilder/commonTestcases/newSuits/queries/runjsHappyPath.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: runpyHappyPath.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/appbuilder/commonTestcases/newSuits/queries/runpyHappyPath.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: addAllPluginsToApp.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/addAllPluginsToApp.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: airTableHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/airTableHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: amazonAthenaHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/amazonAthenaHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: amazonsesHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/amazonsesHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: appWriteHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/appWriteHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: awsLambdaHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/awsLambdaHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: awsTextractHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/awsTextractHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: azureBlobStorageHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/azureBlobStorageHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: baseRowHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/baseRowHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: bigqueryHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/bigqueryHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: clickHouseHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/clickHouseHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: cosmosDbHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/cosmosDbHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: couchDbHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/couchDbHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: dynamoDbHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/dynamoDbHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: elasticsearchHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/elasticsearchHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: fireStoreHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/fireStoreHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graphQLHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/graphQLHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: harperDbHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/harperDbHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: influxDbHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/influxDbHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mariaDbHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/mariaDbHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { postgreSqlSelector } from "Selectors/postgreSql";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: minioHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/minioHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mongoDbHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/mongoDbHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mysqlHappyPath.cy.skip.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/mysqlHappyPath.cy.skip.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: postgresHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/postgresHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: redisHappyPath.cy.js]---
Location: ToolJet-develop/cypress-tests/cypress/e2e/happyPath/marketplace/commonTestcases/data-source/redisHappyPath.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import { fake } from "Fixtures/fake";

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 71
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 71 of 933)

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

---[FILE: google_drive.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/google_drive.mdx

```text
---
title: Google Drive
description: Create, upload, and list files
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_drive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Drive](https://drive.google.com) is Google's cloud storage and file synchronization service that allows users to store files, synchronize files across devices, and share files with others. As a core component of Google's productivity ecosystem, Google Drive offers robust storage, organization, and collaboration capabilities.

Learn how to integrate the Google Drive tool in Sim to effortlessly pull information from your Drive through your workflows. This tutorial walks you through connecting Google Drive, setting up data retrieval, and using stored documents and files to enhance automation. Perfect for syncing important data with your agents in real-time.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cRoRr4b-EAs"
  title="Use the Google Drive tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

With Google Drive, you can:

- **Store files in the cloud**: Upload and access your files from anywhere with internet access
- **Organize content**: Create folders, use color coding, and implement naming conventions
- **Share and collaborate**: Control access permissions and work simultaneously on files
- **Search efficiently**: Find files quickly with Google's powerful search technology
- **Access across devices**: Use Google Drive on desktop, mobile, and web platforms
- **Integrate with other services**: Connect with Google Docs, Sheets, Slides, and third-party applications

In Sim, the Google Drive integration enables your agents to interact directly with your cloud storage programmatically. This allows for powerful automation scenarios such as file management, content organization, and document workflows. Your agents can upload new files to specific folders, download existing files to process their contents, and list folder contents to navigate your storage structure. This integration bridges the gap between your AI workflows and your document management system, enabling seamless file operations without manual intervention. By connecting Sim with Google Drive, you can automate file-based workflows, manage documents intelligently, and incorporate cloud storage operations into your agent's capabilities.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Google Drive into the workflow. Can create, upload, and list files.



## Tools

### `google_drive_upload`

Upload a file to Google Drive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | Yes | The name of the file to upload |
| `file` | file | No | Binary file to upload \(UserFile object\) |
| `content` | string | No | Text content to upload \(use this OR file, not both\) |
| `mimeType` | string | No | The MIME type of the file to upload \(auto-detected from file if not provided\) |
| `folderSelector` | string | No | Select the folder to upload the file to |
| `folderId` | string | No | The ID of the folder to upload the file to \(internal use\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `file` | json | Uploaded file metadata including ID, name, and links |

### `google_drive_create_folder`

Create a new folder in Google Drive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | Yes | Name of the folder to create |
| `folderSelector` | string | No | Select the parent folder to create the folder in |
| `folderId` | string | No | ID of the parent folder \(internal use\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `file` | json | Created folder metadata including ID, name, and parent information |

### `google_drive_download`

Download a file from Google Drive (exports Google Workspace files automatically)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Yes | The ID of the file to download |
| `mimeType` | string | No | The MIME type to export Google Workspace files to \(optional\) |
| `fileName` | string | No | Optional filename override |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `file` | file | Downloaded file stored in execution files |

### `google_drive_list`

List files and folders in Google Drive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | No | Select the folder to list files from |
| `folderId` | string | No | The ID of the folder to list files from \(internal use\) |
| `query` | string | No | Search term to filter files by name \(e.g. "budget" finds files with "budget" in the name\). Do NOT use Google Drive query syntax here - just provide a plain search term. |
| `pageSize` | number | No | The maximum number of files to return \(default: 100\) |
| `pageToken` | string | No | The page token to use for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `files` | json | Array of file metadata objects from the specified folder |



## Notes

- Category: `tools`
- Type: `google_drive`
```

--------------------------------------------------------------------------------

---[FILE: google_forms.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/google_forms.mdx

```text
---
title: Google Forms
description: Read responses from a Google Form
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_forms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Forms](https://forms.google.com) is Google's online survey and form tool that allows users to create forms, collect responses, and analyze results. As part of Google's productivity suite, Google Forms makes it easy to gather information, feedback, and data from users.

Learn how to integrate the Google Forms tool in Sim to automatically read and process form responses in your workflows. This tutorial walks you through connecting Google Forms, retrieving responses, and using collected data to power automation. Perfect for syncing survey results, registrations, or feedback with your agents in real-time.

With Google Forms, you can:

- **Create surveys and forms**: Design custom forms for feedback, registration, quizzes, and more
- **Collect responses automatically**: Gather data from users in real-time
- **Analyze results**: View responses in Google Forms or export to Google Sheets for further analysis
- **Collaborate easily**: Share forms and work with others to build and review questions
- **Integrate with other Google services**: Connect with Google Sheets, Drive, and more

In Sim, the Google Forms integration enables your agents to programmatically access form responses. This allows for powerful automation scenarios such as processing survey data, triggering workflows based on new submissions, and syncing form results with other tools. Your agents can fetch all responses for a form, retrieve a specific response, and use the data to drive intelligent automation. By connecting Sim with Google Forms, you can automate data collection, streamline feedback processing, and incorporate form responses into your agent's capabilities.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Google Forms into your workflow. Provide a Form ID to list responses, or specify a Response ID to fetch a single response. Requires OAuth.



## Tools

### `google_forms_get_responses`

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | json | Response or list of responses |



## Notes

- Category: `tools`
- Type: `google_forms`
```

--------------------------------------------------------------------------------

---[FILE: google_groups.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/google_groups.mdx

```text
---
title: Google Groups
description: Manage Google Workspace Groups and their members
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_groups"
  color="#E8F0FE"
/>

## Usage Instructions

Connect to Google Workspace to create, update, and manage groups and their members using the Admin SDK Directory API.



## Tools

### `google_groups_list_groups`

List all groups in a Google Workspace domain

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `customer` | string | No | Customer ID or "my_customer" for the authenticated user\'s domain |
| `domain` | string | No | Domain name to filter groups by |
| `maxResults` | number | No | Maximum number of results to return \(1-200\) |
| `pageToken` | string | No | Token for pagination |
| `query` | string | No | Search query to filter groups \(e.g., "email:admin*"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `groups` | json | Array of group objects |
| `nextPageToken` | string | Token for fetching next page of results |

### `google_groups_get_group`

Get details of a specific Google Group by email or group ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Yes | Group email address or unique group ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `group` | json | Group object |

### `google_groups_create_group`

Create a new Google Group in the domain

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Email address for the new group \(e.g., team@yourdomain.com\) |
| `name` | string | Yes | Display name for the group |
| `description` | string | No | Description of the group |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `group` | json | Created group object |

### `google_groups_update_group`

Update an existing Google Group

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Yes | Group email address or unique group ID |
| `name` | string | No | New display name for the group |
| `description` | string | No | New description for the group |
| `email` | string | No | New email address for the group |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `group` | json | Updated group object |

### `google_groups_delete_group`

Delete a Google Group

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Yes | Group email address or unique group ID to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success message |

### `google_groups_list_members`

List all members of a Google Group

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Yes | Group email address or unique group ID |
| `maxResults` | number | No | Maximum number of results to return \(1-200\) |
| `pageToken` | string | No | Token for pagination |
| `roles` | string | No | Filter by roles \(comma-separated: OWNER, MANAGER, MEMBER\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `members` | json | Array of member objects |
| `nextPageToken` | string | Token for fetching next page of results |

### `google_groups_get_member`

Get details of a specific member in a Google Group

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Yes | Group email address or unique group ID |
| `memberKey` | string | Yes | Member email address or unique member ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `member` | json | Member object |

### `google_groups_add_member`

Add a new member to a Google Group

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Yes | Group email address or unique group ID |
| `email` | string | Yes | Email address of the member to add |
| `role` | string | No | Role for the member \(MEMBER, MANAGER, or OWNER\). Defaults to MEMBER. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `member` | json | Added member object |

### `google_groups_remove_member`

Remove a member from a Google Group

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Yes | Group email address or unique group ID |
| `memberKey` | string | Yes | Email address or unique ID of the member to remove |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success message |

### `google_groups_update_member`

Update a member

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Yes | Group email address or unique group ID |
| `memberKey` | string | Yes | Member email address or unique member ID |
| `role` | string | Yes | New role for the member \(MEMBER, MANAGER, or OWNER\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `member` | json | Updated member object |

### `google_groups_has_member`

Check if a user is a member of a Google Group

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | Yes | Group email address or unique group ID |
| `memberKey` | string | Yes | Member email address or unique member ID to check |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `isMember` | boolean | Whether the user is a member of the group |



## Notes

- Category: `tools`
- Type: `google_groups`
```

--------------------------------------------------------------------------------

---[FILE: google_search.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/google_search.mdx

```text
---
title: Google Search
description: Search the web
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_search"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Search](https://www.google.com) is the world's most widely used search engine, providing access to billions of web pages and information sources. Google Search uses sophisticated algorithms to deliver relevant search results based on user queries, making it an essential tool for finding information on the internet.

Learn how to integrate the Google Search tool in Sim to effortlessly fetch real-time search results through your workflows. This tutorial walks you through connecting Google Search, configuring search queries, and using live data to enhance automation. Perfect for powering your agents with up-to-date information and smarter decision-making.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/1B7hV9b5UMQ"
  title="Use the Google Search tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

With Google Search, you can:

- **Find relevant information**: Access billions of web pages with Google's powerful search algorithms
- **Get specific results**: Use search operators to refine and target your queries
- **Discover diverse content**: Find text, images, videos, news, and other content types
- **Access knowledge graphs**: Get structured information about people, places, and things
- **Utilize search features**: Take advantage of specialized search tools like calculators, unit converters, and more

In Sim, the Google Search integration enables your agents to search the web programmatically and incorporate search results into their workflows. This allows for powerful automation scenarios such as research, fact-checking, data gathering, and information synthesis. Your agents can formulate search queries, retrieve relevant results, and extract information from those results to make decisions or generate insights. This integration bridges the gap between your AI workflows and the vast information available on the web, enabling your agents to access up-to-date information from across the internet. By connecting Sim with Google Search, you can create agents that stay informed with the latest information, verify facts, conduct research, and provide users with relevant web content - all without leaving your workflow.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Google Search into the workflow. Can search the web.



## Tools

### `google_search`

Search the web with the Custom Search API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | The search query to execute |
| `searchEngineId` | string | Yes | Custom Search Engine ID |
| `num` | string | No | Number of results to return \(default: 10, max: 10\) |
| `apiKey` | string | Yes | Google API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `items` | array | Array of search results from Google |



## Notes

- Category: `tools`
- Type: `google_search`
```

--------------------------------------------------------------------------------

---[FILE: google_sheets.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/google_sheets.mdx

```text
---
title: Google Sheets
description: Read, write, and update data
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_sheets"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Sheets](https://sheets.google.com) is a powerful cloud-based spreadsheet application that allows users to create, edit, and collaborate on spreadsheets in real-time. As part of Google's productivity suite, Google Sheets offers a versatile platform for data organization, analysis, and visualization with robust formatting, formula, and sharing capabilities.

Learn how to integrate the Google Sheets "Read" tool in Sim to effortlessly fetch data from your spreadsheets to integrate into your workflows. This tutorial walks you through connecting Google Sheets, setting up data reads, and using that information to automate processes in real-time. Perfect for syncing live data with your agents.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/xxP7MZRuq_0"
  title="Use the Google Sheets Read tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Discover how to use the Google Sheets "Write" tool in Sim to automatically send data from your workflows to your Google Sheets. This tutorial covers setting up the integration, configuring write operations, and updating your sheets seamlessly as workflows execute. Perfect for maintaining real-time records without manual input.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cO86qTj7qeY"
  title="Use the Google Sheets Write tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Explore how to leverage the Google Sheets "Update" tool in Sim to modify existing entries in your spreadsheets based on workflow execution. This tutorial demonstrates setting up the update logic, mapping data fields, and synchronizing changes instantly. Perfect for keeping your data current and consistent.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/95by2fL9yn4"
  title="Use the Google Sheets Update tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Learn how to use the Google Sheets "Append" tool in Sim to effortlessly add new rows of data to your spreadsheets during workflow execution. This tutorial walks you through setting up the integration, configuring append actions, and ensuring smooth data growth. Perfect for expanding records without manual effort!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/8DgNvLBCsAo"
  title="Use the Google Sheets Append tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

With Google Sheets, you can:

- **Create and edit spreadsheets**: Develop data-driven documents with comprehensive formatting and calculation options
- **Collaborate in real-time**: Work simultaneously with multiple users on the same spreadsheet
- **Analyze data**: Use formulas, functions, and pivot tables to process and understand your data
- **Visualize information**: Create charts, graphs, and conditional formatting to represent data visually
- **Access anywhere**: Use Google Sheets across devices with automatic cloud synchronization
- **Work offline**: Continue working without internet connection with changes syncing when back online
- **Integrate with other services**: Connect with Google Drive, Forms, and third-party applications

In Sim, the Google Sheets integration enables your agents to interact directly with spreadsheet data programmatically. This allows for powerful automation scenarios such as data extraction, analysis, reporting, and management. Your agents can read existing spreadsheets to extract information, write to spreadsheets to update data, and create new spreadsheets from scratch. This integration bridges the gap between your AI workflows and data management, enabling seamless interaction with structured data. By connecting Sim with Google Sheets, you can automate data workflows, generate reports, extract insights from data, and maintain up-to-date information - all through your intelligent agents. The integration supports various data formats and range specifications, making it flexible enough to handle diverse data management needs while maintaining the collaborative and accessible nature of Google Sheets.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Google Sheets into the workflow. Can read, write, append, and update data.



## Tools

### `google_sheets_read`

Read data from a Google Sheets spreadsheet

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet \(found in the URL: docs.google.com/spreadsheets/d/\{SPREADSHEET_ID\}/edit\). |
| `range` | string | No | The A1 notation range to read \(e.g. "Sheet1!A1:D10", "A1:B5"\). Defaults to first sheet A1:Z1000 if not specified. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | json | Sheet data including range and cell values |
| `metadata` | json | Spreadsheet metadata including ID and URL |

### `google_sheets_write`

Write data to a Google Sheets spreadsheet

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet |
| `range` | string | No | The A1 notation range to write to \(e.g. "Sheet1!A1:D10", "A1:B5"\) |
| `values` | array | Yes | The data to write as a 2D array \(e.g. \[\["Name", "Age"\], \["Alice", 30\], \["Bob", 25\]\]\) or array of objects. |
| `valueInputOption` | string | No | The format of the data to write |
| `includeValuesInResponse` | boolean | No | Whether to include the written values in the response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `updatedRange` | string | Range of cells that were updated |
| `updatedRows` | number | Number of rows updated |
| `updatedColumns` | number | Number of columns updated |
| `updatedCells` | number | Number of cells updated |
| `metadata` | json | Spreadsheet metadata including ID and URL |

### `google_sheets_update`

Update data in a Google Sheets spreadsheet

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to update |
| `range` | string | No | The A1 notation range to update \(e.g. "Sheet1!A1:D10", "A1:B5"\) |
| `values` | array | Yes | The data to update as a 2D array \(e.g. \[\["Name", "Age"\], \["Alice", 30\]\]\) or array of objects. |
| `valueInputOption` | string | No | The format of the data to update |
| `includeValuesInResponse` | boolean | No | Whether to include the updated values in the response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `updatedRange` | string | Range of cells that were updated |
| `updatedRows` | number | Number of rows updated |
| `updatedColumns` | number | Number of columns updated |
| `updatedCells` | number | Number of cells updated |
| `metadata` | json | Spreadsheet metadata including ID and URL |

### `google_sheets_append`

Append data to the end of a Google Sheets spreadsheet

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to append to |
| `range` | string | No | The A1 notation range to append after \(e.g. "Sheet1", "Sheet1!A:D"\) |
| `values` | array | Yes | The data to append as a 2D array \(e.g. \[\["Alice", 30\], \["Bob", 25\]\]\) or array of objects. |
| `valueInputOption` | string | No | The format of the data to append |
| `insertDataOption` | string | No | How to insert the data \(OVERWRITE or INSERT_ROWS\) |
| `includeValuesInResponse` | boolean | No | Whether to include the appended values in the response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tableRange` | string | Range of the table where data was appended |
| `updatedRange` | string | Range of cells that were updated |
| `updatedRows` | number | Number of rows updated |
| `updatedColumns` | number | Number of columns updated |
| `updatedCells` | number | Number of cells updated |
| `metadata` | json | Spreadsheet metadata including ID and URL |



## Notes

- Category: `tools`
- Type: `google_sheets`
```

--------------------------------------------------------------------------------

---[FILE: google_slides.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/google_slides.mdx

```text
---
title: Google Slides
description: Read, write, and create presentations
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_slides"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Slides](https://slides.google.com) is a dynamic cloud-based presentation application that allows users to create, edit, collaborate on, and present slideshows in real-time. As part of Google's productivity suite, Google Slides offers a flexible platform for designing engaging presentations, collaborating with others, and sharing content seamlessly through the cloud.

Learn how to integrate the Google Slides tools in Sim to effortlessly manage presentations as part of your automated workflows. With Sim, you can read, write, create, and update Google Slides presentations directly through your agents and automated processes, making it easy to deliver up-to-date information, generate custom reports, or produce branded decks programmatically.

With Google Slides, you can:

- **Create and edit presentations**: Design visually appealing slides with themes, layouts, and multimedia content
- **Collaborate in real-time**: Work simultaneously with teammates, comment, assign tasks, and receive live feedback on presentations
- **Present anywhere**: Display presentations online or offline, share links, or publish to the web
- **Add images and rich content**: Insert images, graphics, charts, and videos to make your presentations engaging
- **Integrate with other services**: Connect seamlessly with Google Drive, Docs, Sheets, and other third-party tools
- **Access from any device**: Use Google Slides on desktops, laptops, tablets, and mobile devices for maximum flexibility

In Sim, the Google Slides integration enables your agents to interact directly with presentation files programmatically. Automate tasks like reading slide content, inserting new slides or images, replacing text throughout a deck, generating new presentations, and retrieving slide thumbnails. This empowers you to scale content creation, keep presentations up-to-date, and embed them into automated document workflows. By connecting Sim with Google Slides, you facilitate AI-driven presentation management—making it easy to generate, update, or extract information from presentations without manual effort.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Google Slides into the workflow. Can read, write, create presentations, replace text, add slides, add images, and get thumbnails.



## Tools

### `google_slides_read`

Read content from a Google Slides presentation

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Yes | The ID of the presentation to read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `slides` | json | Array of slides with their content |
| `metadata` | json | Presentation metadata including ID, title, and URL |

### `google_slides_write`

Write or update content in a Google Slides presentation

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Yes | The ID of the presentation to write to |
| `content` | string | Yes | The content to write to the slide |
| `slideIndex` | number | No | The index of the slide to write to \(defaults to first slide\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | Indicates if presentation content was updated successfully |
| `metadata` | json | Updated presentation metadata including ID, title, and URL |

### `google_slides_create`

Create a new Google Slides presentation

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Yes | The title of the presentation to create |
| `content` | string | No | The content to add to the first slide |
| `folderSelector` | string | No | Select the folder to create the presentation in |
| `folderId` | string | No | The ID of the folder to create the presentation in \(internal use\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | json | Created presentation metadata including ID, title, and URL |

### `google_slides_replace_all_text`

Find and replace all occurrences of text throughout a Google Slides presentation

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Yes | The ID of the presentation |
| `findText` | string | Yes | The text to find \(e.g., \{\{placeholder\}\}\) |
| `replaceText` | string | Yes | The text to replace with |
| `matchCase` | boolean | No | Whether the search should be case-sensitive \(default: true\) |
| `pageObjectIds` | string | No | Comma-separated list of slide object IDs to limit replacements to specific slides \(leave empty for all slides\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `occurrencesChanged` | number | Number of text occurrences that were replaced |
| `metadata` | json | Operation metadata including presentation ID and URL |

### `google_slides_add_slide`

Add a new slide to a Google Slides presentation with a specified layout

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Yes | The ID of the presentation |
| `layout` | string | No | The predefined layout for the slide \(BLANK, TITLE, TITLE_AND_BODY, TITLE_ONLY, SECTION_HEADER, etc.\). Defaults to BLANK. |
| `insertionIndex` | number | No | The optional zero-based index indicating where to insert the slide. If not specified, the slide is added at the end. |
| `placeholderIdMappings` | string | No | JSON array of placeholder mappings to assign custom object IDs to placeholders. Format: \[\{"layoutPlaceholder":\{"type":"TITLE"\},"objectId":"custom_title_id"\}\] |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `slideId` | string | The object ID of the newly created slide |
| `metadata` | json | Operation metadata including presentation ID, layout, and URL |

### `google_slides_add_image`

Insert an image into a specific slide in a Google Slides presentation

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Yes | The ID of the presentation |
| `pageObjectId` | string | Yes | The object ID of the slide/page to add the image to |
| `imageUrl` | string | Yes | The publicly accessible URL of the image \(must be PNG, JPEG, or GIF, max 50MB\) |
| `width` | number | No | Width of the image in points \(default: 300\) |
| `height` | number | No | Height of the image in points \(default: 200\) |
| `positionX` | number | No | X position from the left edge in points \(default: 100\) |
| `positionY` | number | No | Y position from the top edge in points \(default: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `imageId` | string | The object ID of the newly created image |
| `metadata` | json | Operation metadata including presentation ID and image URL |

### `google_slides_get_thumbnail`

Generate a thumbnail image of a specific slide in a Google Slides presentation

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | Yes | The ID of the presentation |
| `pageObjectId` | string | Yes | The object ID of the slide/page to get a thumbnail for |
| `thumbnailSize` | string | No | The size of the thumbnail: SMALL \(200px\), MEDIUM \(800px\), or LARGE \(1600px\). Defaults to MEDIUM. |
| `mimeType` | string | No | The MIME type of the thumbnail image: PNG or GIF. Defaults to PNG. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contentUrl` | string | URL to the thumbnail image \(valid for 30 minutes\) |
| `width` | number | Width of the thumbnail in pixels |
| `height` | number | Height of the thumbnail in pixels |
| `metadata` | json | Operation metadata including presentation ID and page object ID |



## Notes

- Category: `tools`
- Type: `google_slides`
```

--------------------------------------------------------------------------------

---[FILE: google_vault.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/google_vault.mdx

```text
---
title: Google Vault
description: Search, export, and manage holds/exports for Vault matters
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_vault"
  color="#E8F0FE"
/>

## Usage Instructions

Connect Google Vault to create exports, list exports, and manage holds within matters.



## Tools

### `google_vault_create_matters_export`

Create an export in a matter

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Yes | No description |
| `exportName` | string | Yes | No description |
| `corpus` | string | Yes | Data corpus to export \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | string | No | Comma-separated list of user emails to scope export |
| `orgUnitId` | string | No | Organization unit ID to scope export \(alternative to emails\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `export` | json | Created export object |

### `google_vault_list_matters_export`

List exports for a matter

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Yes | No description |
| `pageSize` | number | No | No description |
| `pageToken` | string | No | No description |
| `exportId` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `exports` | json | Array of export objects |
| `export` | json | Single export object \(when exportId is provided\) |
| `nextPageToken` | string | Token for fetching next page of results |

### `google_vault_download_export_file`

Download a single file from a Google Vault export (GCS object)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Yes | No description |
| `bucketName` | string | Yes | No description |
| `objectName` | string | Yes | No description |
| `fileName` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `file` | file | Downloaded Vault export file stored in execution files |

### `google_vault_create_matters_holds`

Create a hold in a matter

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Yes | No description |
| `holdName` | string | Yes | No description |
| `corpus` | string | Yes | Data corpus to hold \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | string | No | Comma-separated list of user emails to put on hold |
| `orgUnitId` | string | No | Organization unit ID to put on hold \(alternative to accounts\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `hold` | json | Created hold object |

### `google_vault_list_matters_holds`

List holds for a matter

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | Yes | No description |
| `pageSize` | number | No | No description |
| `pageToken` | string | No | No description |
| `holdId` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `holds` | json | Array of hold objects |
| `hold` | json | Single hold object \(when holdId is provided\) |
| `nextPageToken` | string | Token for fetching next page of results |

### `google_vault_create_matters`

Create a new matter in Google Vault

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `name` | string | Yes | No description |
| `description` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `matter` | json | Created matter object |

### `google_vault_list_matters`

List matters, or get a specific matter if matterId is provided

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | No | No description |
| `pageToken` | string | No | No description |
| `matterId` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `matters` | json | Array of matter objects |
| `matter` | json | Single matter object \(when matterId is provided\) |
| `nextPageToken` | string | Token for fetching next page of results |



## Notes

- Category: `tools`
- Type: `google_vault`
```

--------------------------------------------------------------------------------

````

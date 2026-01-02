---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 88
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 88 of 933)

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

---[FILE: sftp.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/sftp.mdx

```text
---
title: SFTP
description: Transfer files via SFTP (SSH File Transfer Protocol)
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sftp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SFTP (SSH File Transfer Protocol)](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol) is a secure network protocol that enables you to upload, download, and manage files on remote servers. SFTP operates over SSH, making it ideal for automated, encrypted file transfers and remote file management within modern workflows. 

With SFTP tools integrated into Sim, you can easily automate the movement of files between your AI agents and external systems or servers. This empowers your agents to manage critical data exchanges, backups, document generation, and remote system orchestration—all with robust security.

**Key functionality available via SFTP tools:**

- **Upload Files:** Seamlessly transfer files of any type from your workflow to a remote server, with support for both password and SSH private key authentication.
- **Download Files:** Retrieve files from remote SFTP servers directly for processing, archiving, or further automation.
- **List & Manage Files:** Enumerate directories, delete or create files and folders, and manage file system permissions remotely.
- **Flexible Authentication:** Connect using either traditional passwords or SSH keys, with support for passphrases and permissions control.
- **Large File Support:** Programmatically manage large file uploads and downloads, with built-in size limits for safety.

By integrating SFTP into Sim, you can automate secure file operations as part of any workflow, whether it’s data collection, reporting, remote system maintenance, or dynamic content exchange between platforms.

The sections below describe the key SFTP tools available:

- **sftp_upload:** Upload one or more files to a remote server.
- **sftp_download:** Download files from a remote server to your workflow.
- **sftp_list:** List directory contents on a remote SFTP server.
- **sftp_delete:** Delete files or directories from a remote server.
- **sftp_create:** Create new files on a remote SFTP server.
- **sftp_mkdir:** Create new directories remotely.

See the tool documentation below for detailed input and output parameters for each operation.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Upload, download, list, and manage files on remote servers via SFTP. Supports both password and private key authentication for secure file transfers.



## Tools

### `sftp_upload`

Upload files to a remote SFTP server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SFTP server hostname or IP address |
| `port` | number | Yes | SFTP server port \(default: 22\) |
| `username` | string | Yes | SFTP username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `remotePath` | string | Yes | Destination directory on the remote server |
| `files` | file[] | No | Files to upload |
| `fileContent` | string | No | Direct file content to upload \(for text files\) |
| `fileName` | string | No | File name when using direct content |
| `overwrite` | boolean | No | Whether to overwrite existing files \(default: true\) |
| `permissions` | string | No | File permissions \(e.g., 0644\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the upload was successful |
| `uploadedFiles` | json | Array of uploaded file details \(name, remotePath, size\) |
| `message` | string | Operation status message |

### `sftp_download`

Download a file from a remote SFTP server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SFTP server hostname or IP address |
| `port` | number | Yes | SFTP server port \(default: 22\) |
| `username` | string | Yes | SFTP username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `remotePath` | string | Yes | Path to the file on the remote server |
| `encoding` | string | No | Output encoding: utf-8 for text, base64 for binary \(default: utf-8\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the download was successful |
| `fileName` | string | Name of the downloaded file |
| `content` | string | File content \(text or base64 encoded\) |
| `size` | number | File size in bytes |
| `encoding` | string | Content encoding \(utf-8 or base64\) |
| `message` | string | Operation status message |

### `sftp_list`

List files and directories on a remote SFTP server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SFTP server hostname or IP address |
| `port` | number | Yes | SFTP server port \(default: 22\) |
| `username` | string | Yes | SFTP username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `remotePath` | string | Yes | Directory path on the remote server |
| `detailed` | boolean | No | Include detailed file information \(size, permissions, modified date\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the operation was successful |
| `path` | string | Directory path that was listed |
| `entries` | json | Array of directory entries with name, type, size, permissions, modifiedAt |
| `count` | number | Number of entries in the directory |
| `message` | string | Operation status message |

### `sftp_delete`

Delete a file or directory on a remote SFTP server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SFTP server hostname or IP address |
| `port` | number | Yes | SFTP server port \(default: 22\) |
| `username` | string | Yes | SFTP username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `remotePath` | string | Yes | Path to the file or directory to delete |
| `recursive` | boolean | No | Delete directories recursively |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the deletion was successful |
| `deletedPath` | string | Path that was deleted |
| `message` | string | Operation status message |

### `sftp_mkdir`

Create a directory on a remote SFTP server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SFTP server hostname or IP address |
| `port` | number | Yes | SFTP server port \(default: 22\) |
| `username` | string | Yes | SFTP username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `remotePath` | string | Yes | Path for the new directory |
| `recursive` | boolean | No | Create parent directories if they do not exist |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the directory was created successfully |
| `createdPath` | string | Path of the created directory |
| `message` | string | Operation status message |



## Notes

- Category: `tools`
- Type: `sftp`
```

--------------------------------------------------------------------------------

---[FILE: sharepoint.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/sharepoint.mdx

```text
---
title: Sharepoint
description: Work with pages and lists
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sharepoint"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration) is a collaborative platform from Microsoft that enables users to build and manage internal websites, share documents, and organize team resources. It provides a powerful, flexible solution for creating digital workspaces and streamlining content management across organizations.

With SharePoint, you can:

- **Create team and communication sites**: Set up pages and portals to support collaboration, announcements, and content distribution
- **Organize and share content**: Store documents, manage files, and enable version control with secure sharing capabilities
- **Customize pages**: Add text parts to tailor each site to your team's needs
- **Improve discoverability**: Use metadata, search, and navigation tools to help users quickly find what they need
- **Collaborate securely**: Control access with robust permission settings and Microsoft 365 integration

In Sim, the SharePoint integration empowers your agents to create and access SharePoint sites and pages as part of their workflows. This enables automated document management, knowledge sharing, and workspace creation without manual effort. Agents can generate new project pages, upload or retrieve files, and organize resources dynamically, based on workflow inputs. By connecting Sim with SharePoint, you bring structured collaboration and content management into your automation flows — giving your agents the ability to coordinate team activities, surface key information, and maintain a single source of truth across your organization.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate SharePoint into the workflow. Read/create pages, list sites, and work with lists (read, create, update items). Requires OAuth.



## Tools

### `sharepoint_create_page`

Create a new page in a SharePoint site

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | No | The ID of the SharePoint site \(internal use\) |
| `siteSelector` | string | No | Select the SharePoint site |
| `pageName` | string | Yes | The name of the page to create |
| `pageTitle` | string | No | The title of the page \(defaults to page name if not provided\) |
| `pageContent` | string | No | The content of the page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `page` | object | Created SharePoint page information |

### `sharepoint_read_page`

Read a specific page from a SharePoint site

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | No | Select the SharePoint site |
| `siteId` | string | No | The ID of the SharePoint site \(internal use\) |
| `pageId` | string | No | The ID of the page to read |
| `pageName` | string | No | The name of the page to read \(alternative to pageId\) |
| `maxPages` | number | No | Maximum number of pages to return when listing all pages \(default: 10, max: 50\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `page` | object | Information about the SharePoint page |

### `sharepoint_list_sites`

List details of all SharePoint sites

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | No | Select the SharePoint site |
| `groupId` | string | No | The group ID for accessing a group team site |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `site` | object | Information about the current SharePoint site |

### `sharepoint_create_list`

Create a new list in a SharePoint site

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | No | The ID of the SharePoint site \(internal use\) |
| `siteSelector` | string | No | Select the SharePoint site |
| `listDisplayName` | string | Yes | Display name of the list to create |
| `listDescription` | string | No | Description of the list |
| `listTemplate` | string | No | List template name \(e.g., 'genericList'\) |
| `pageContent` | string | No | Optional JSON of columns. Either a top-level array of column definitions or an object with \{ columns: \[...\] \}. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `list` | object | Created SharePoint list information |

### `sharepoint_get_list`

Get metadata (and optionally columns/items) for a SharePoint list

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | No | Select the SharePoint site |
| `siteId` | string | No | The ID of the SharePoint site \(internal use\) |
| `listId` | string | No | The ID of the list to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `list` | object | Information about the SharePoint list |

### `sharepoint_update_list`

Update the properties (fields) on a SharePoint list item

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | No | Select the SharePoint site |
| `siteId` | string | No | The ID of the SharePoint site \(internal use\) |
| `listId` | string | No | The ID of the list containing the item |
| `itemId` | string | Yes | The ID of the list item to update |
| `listItemFields` | object | Yes | Field values to update on the list item |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `item` | object | Updated SharePoint list item |

### `sharepoint_add_list_items`

Add a new item to a SharePoint list

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | No | Select the SharePoint site |
| `siteId` | string | No | The ID of the SharePoint site \(internal use\) |
| `listId` | string | Yes | The ID of the list to add the item to |
| `listItemFields` | object | Yes | Field values for the new list item |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `item` | object | Created SharePoint list item |

### `sharepoint_upload_file`

Upload files to a SharePoint document library

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | No | The ID of the SharePoint site |
| `driveId` | string | No | The ID of the document library \(drive\). If not provided, uses default drive. |
| `folderPath` | string | No | Optional folder path within the document library \(e.g., /Documents/Subfolder\) |
| `fileName` | string | No | Optional: override the uploaded file name |
| `files` | file[] | No | Files to upload to SharePoint |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `uploadedFiles` | array | Array of uploaded file objects |



## Notes

- Category: `tools`
- Type: `sharepoint`
```

--------------------------------------------------------------------------------

---[FILE: shopify.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/shopify.mdx

```text
---
title: Shopify
description: Manage products, orders, customers, and inventory in your Shopify store
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="shopify"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Shopify](https://www.shopify.com/) is a leading e-commerce platform designed to help merchants build, run, and grow their online stores. Shopify makes it easy to manage every aspect of your store, from products and inventory to orders and customers.

With Shopify in Sim, your agents can:

- **Create and manage products**: Add new products, update product details, and remove products from your store.
- **List and retrieve orders**: Get information about customer orders, including filtering and order management.
- **Manage customers**: Access and update customer details, or add new customers to your store.
- **Adjust inventory levels**: Programmatically change product stock levels to keep your inventory accurate.

Use Sim's Shopify integration to automate common store management workflows—such as syncing inventory, fulfilling orders, or managing listings—directly from your automations. Empower your agents to access, update, and organize all your store data using simple, programmatic tools.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Shopify into your workflow. Manage products, orders, customers, and inventory. Create, read, update, and delete products. List and manage orders. Handle customer data and adjust inventory levels.



## Tools

### `shopify_create_product`

Create a new product in your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `title` | string | Yes | Product title |
| `descriptionHtml` | string | No | Product description \(HTML\) |
| `vendor` | string | No | Product vendor/brand |
| `productType` | string | No | Product type/category |
| `tags` | array | No | Product tags |
| `status` | string | No | Product status \(ACTIVE, DRAFT, ARCHIVED\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `product` | object | The created product |

### `shopify_get_product`

Get a single product by ID from your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `productId` | string | Yes | Product ID \(gid://shopify/Product/123456789\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `product` | object | The product details |

### `shopify_list_products`

List products from your Shopify store with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `first` | number | No | Number of products to return \(default: 50, max: 250\) |
| `query` | string | No | Search query to filter products \(e.g., "title:shirt" or "vendor:Nike" or "status:active"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `products` | array | List of products |
| `pageInfo` | object | Pagination information |

### `shopify_update_product`

Update an existing product in your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `productId` | string | Yes | Product ID to update \(gid://shopify/Product/123456789\) |
| `title` | string | No | New product title |
| `descriptionHtml` | string | No | New product description \(HTML\) |
| `vendor` | string | No | New product vendor/brand |
| `productType` | string | No | New product type/category |
| `tags` | array | No | New product tags |
| `status` | string | No | New product status \(ACTIVE, DRAFT, ARCHIVED\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `product` | object | The updated product |

### `shopify_delete_product`

Delete a product from your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `productId` | string | Yes | Product ID to delete \(gid://shopify/Product/123456789\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deletedId` | string | The ID of the deleted product |

### `shopify_get_order`

Get a single order by ID from your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `orderId` | string | Yes | Order ID \(gid://shopify/Order/123456789\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `order` | object | The order details |

### `shopify_list_orders`

List orders from your Shopify store with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `first` | number | No | Number of orders to return \(default: 50, max: 250\) |
| `status` | string | No | Filter by order status \(open, closed, cancelled, any\) |
| `query` | string | No | Search query to filter orders \(e.g., "financial_status:paid" or "fulfillment_status:unfulfilled" or "email:customer@example.com"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `orders` | array | List of orders |
| `pageInfo` | object | Pagination information |

### `shopify_update_order`

Update an existing order in your Shopify store (note, tags, email)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `orderId` | string | Yes | Order ID to update \(gid://shopify/Order/123456789\) |
| `note` | string | No | New order note |
| `tags` | array | No | New order tags |
| `email` | string | No | New customer email for the order |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `order` | object | The updated order |

### `shopify_cancel_order`

Cancel an order in your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `orderId` | string | Yes | Order ID to cancel \(gid://shopify/Order/123456789\) |
| `reason` | string | Yes | Cancellation reason \(CUSTOMER, DECLINED, FRAUD, INVENTORY, STAFF, OTHER\) |
| `notifyCustomer` | boolean | No | Whether to notify the customer about the cancellation |
| `refund` | boolean | No | Whether to refund the order |
| `restock` | boolean | No | Whether to restock the inventory |
| `staffNote` | string | No | A note about the cancellation for staff reference |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `order` | object | The cancellation result |

### `shopify_create_customer`

Create a new customer in your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `email` | string | No | Customer email address |
| `firstName` | string | No | Customer first name |
| `lastName` | string | No | Customer last name |
| `phone` | string | No | Customer phone number |
| `note` | string | No | Note about the customer |
| `tags` | array | No | Customer tags |
| `addresses` | array | No | Customer addresses |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `customer` | object | The created customer |

### `shopify_get_customer`

Get a single customer by ID from your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `customerId` | string | Yes | Customer ID \(gid://shopify/Customer/123456789\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `customer` | object | The customer details |

### `shopify_list_customers`

List customers from your Shopify store with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `first` | number | No | Number of customers to return \(default: 50, max: 250\) |
| `query` | string | No | Search query to filter customers \(e.g., "first_name:John" or "last_name:Smith" or "email:*@gmail.com" or "tag:vip"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `customers` | array | List of customers |
| `pageInfo` | object | Pagination information |

### `shopify_update_customer`

Update an existing customer in your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `customerId` | string | Yes | Customer ID to update \(gid://shopify/Customer/123456789\) |
| `email` | string | No | New customer email address |
| `firstName` | string | No | New customer first name |
| `lastName` | string | No | New customer last name |
| `phone` | string | No | New customer phone number |
| `note` | string | No | New note about the customer |
| `tags` | array | No | New customer tags |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `customer` | object | The updated customer |

### `shopify_delete_customer`

Delete a customer from your Shopify store

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `customerId` | string | Yes | Customer ID to delete \(gid://shopify/Customer/123456789\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deletedId` | string | The ID of the deleted customer |

### `shopify_list_inventory_items`

List inventory items from your Shopify store. Use this to find inventory item IDs by SKU.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `first` | number | No | Number of inventory items to return \(default: 50, max: 250\) |
| `query` | string | No | Search query to filter inventory items \(e.g., "sku:ABC123"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `inventoryItems` | array | List of inventory items with their IDs, SKUs, and stock levels |
| `pageInfo` | object | Pagination information |

### `shopify_get_inventory_level`

Get inventory level for a product variant at a specific location

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `inventoryItemId` | string | Yes | Inventory item ID \(gid://shopify/InventoryItem/123456789\) |
| `locationId` | string | No | Location ID to filter by \(optional\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | The inventory level details |

### `shopify_adjust_inventory`

Adjust inventory quantity for a product variant at a specific location

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `inventoryItemId` | string | Yes | Inventory item ID \(gid://shopify/InventoryItem/123456789\) |
| `locationId` | string | Yes | Location ID \(gid://shopify/Location/123456789\) |
| `delta` | number | Yes | Amount to adjust \(positive to increase, negative to decrease\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | The inventory adjustment result |

### `shopify_list_locations`

List inventory locations from your Shopify store. Use this to find location IDs needed for inventory operations.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `first` | number | No | Number of locations to return \(default: 50, max: 250\) |
| `includeInactive` | boolean | No | Whether to include deactivated locations \(default: false\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `locations` | array | List of locations with their IDs, names, and addresses |
| `pageInfo` | object | Pagination information |

### `shopify_create_fulfillment`

Create a fulfillment to mark order items as shipped. Requires a fulfillment order ID (get this from the order details).

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `fulfillmentOrderId` | string | Yes | The fulfillment order ID \(e.g., gid://shopify/FulfillmentOrder/123456789\) |
| `trackingNumber` | string | No | Tracking number for the shipment |
| `trackingCompany` | string | No | Shipping carrier name \(e.g., UPS, FedEx, USPS, DHL\) |
| `trackingUrl` | string | No | URL to track the shipment |
| `notifyCustomer` | boolean | No | Whether to send a shipping confirmation email to the customer \(default: true\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `fulfillment` | object | The created fulfillment with tracking info and fulfilled items |

### `shopify_list_collections`

List product collections from your Shopify store. Filter by title, type (custom/smart), or handle.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `first` | number | No | Number of collections to return \(default: 50, max: 250\) |
| `query` | string | No | Search query to filter collections \(e.g., "title:Summer" or "collection_type:smart"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `collections` | array | List of collections with their IDs, titles, and product counts |
| `pageInfo` | object | Pagination information |

### `shopify_get_collection`

Get a specific collection by ID, including its products. Use this to retrieve products within a collection.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Yes | Your Shopify store domain \(e.g., mystore.myshopify.com\) |
| `collectionId` | string | Yes | The collection ID \(e.g., gid://shopify/Collection/123456789\) |
| `productsFirst` | number | No | Number of products to return from this collection \(default: 50, max: 250\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `collection` | object | The collection details including its products |



## Notes

- Category: `tools`
- Type: `shopify`
```

--------------------------------------------------------------------------------

````

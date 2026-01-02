---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 483
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 483 of 933)

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

---[FILE: sendgrid.ts]---
Location: sim-main/apps/sim/blocks/blocks/sendgrid.ts

```typescript
import { SendgridIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { SendMailResult } from '@/tools/sendgrid/types'

export const SendGridBlock: BlockConfig<SendMailResult> = {
  type: 'sendgrid',
  name: 'SendGrid',
  description: 'Send emails and manage contacts, lists, and templates with SendGrid',
  longDescription:
    'Integrate SendGrid into your workflow. Send transactional emails, manage marketing contacts and lists, and work with email templates. Supports dynamic templates, attachments, and comprehensive contact management.',
  docsLink: 'https://docs.sim.ai/tools/sendgrid',
  category: 'tools',
  bgColor: '#1A82E2',
  icon: SendgridIcon,

  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        // Mail Operations
        { label: 'Send Mail', id: 'send_mail' },
        // Contact Operations
        { label: 'Add Contact', id: 'add_contact' },
        { label: 'Get Contact', id: 'get_contact' },
        { label: 'Search Contacts', id: 'search_contacts' },
        { label: 'Delete Contacts', id: 'delete_contacts' },
        // List Operations
        { label: 'Create List', id: 'create_list' },
        { label: 'Get List', id: 'get_list' },
        { label: 'List All Lists', id: 'list_all_lists' },
        { label: 'Delete List', id: 'delete_list' },
        { label: 'Add Contacts to List', id: 'add_contacts_to_list' },
        { label: 'Remove Contacts from List', id: 'remove_contacts_from_list' },
        // Template Operations
        { label: 'Create Template', id: 'create_template' },
        { label: 'Get Template', id: 'get_template' },
        { label: 'List Templates', id: 'list_templates' },
        { label: 'Delete Template', id: 'delete_template' },
        { label: 'Create Template Version', id: 'create_template_version' },
      ],
      value: () => 'send_mail',
    },
    {
      id: 'apiKey',
      title: 'SendGrid API Key',
      type: 'short-input',
      password: true,
      placeholder: 'Enter your SendGrid API key',
      required: true,
    },
    // Send Mail fields
    {
      id: 'from',
      title: 'From Email',
      type: 'short-input',
      placeholder: 'sender@yourdomain.com',
      condition: { field: 'operation', value: 'send_mail' },
      required: true,
    },
    {
      id: 'fromName',
      title: 'From Name',
      type: 'short-input',
      placeholder: 'Sender Name',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'to',
      title: 'To Email',
      type: 'short-input',
      placeholder: 'recipient@example.com',
      condition: { field: 'operation', value: 'send_mail' },
      required: true,
    },
    {
      id: 'toName',
      title: 'To Name',
      type: 'short-input',
      placeholder: 'Recipient Name',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'mailSubject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Email subject (required unless using template)',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'content',
      title: 'Content',
      type: 'long-input',
      placeholder: 'Email body content (required unless using template)',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'contentType',
      title: 'Content Type',
      type: 'dropdown',
      options: [
        { label: 'Plain Text', id: 'text/plain' },
        { label: 'HTML', id: 'text/html' },
      ],
      value: () => 'text/plain',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'cc',
      title: 'CC',
      type: 'short-input',
      placeholder: 'cc@example.com',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'bcc',
      title: 'BCC',
      type: 'short-input',
      placeholder: 'bcc@example.com',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'replyTo',
      title: 'Reply To',
      type: 'short-input',
      placeholder: 'replyto@example.com',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'replyToName',
      title: 'Reply To Name',
      type: 'short-input',
      placeholder: 'Reply To Name',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'mailTemplateId',
      title: 'Template ID',
      type: 'short-input',
      placeholder: 'SendGrid template ID',
      condition: { field: 'operation', value: 'send_mail' },
    },
    {
      id: 'dynamicTemplateData',
      title: 'Dynamic Template Data',
      type: 'code',
      placeholder: '{"name": "John", "order_id": "12345"}',
      condition: { field: 'operation', value: 'send_mail' },
    },
    // File upload (basic mode)
    {
      id: 'attachmentFiles',
      title: 'Attachments',
      type: 'file-upload',
      canonicalParamId: 'attachments',
      placeholder: 'Upload files to attach',
      condition: { field: 'operation', value: 'send_mail' },
      mode: 'basic',
      multiple: true,
      required: false,
    },
    // Variable reference (advanced mode)
    {
      id: 'attachments',
      title: 'Attachments',
      type: 'short-input',
      canonicalParamId: 'attachments',
      placeholder: 'Reference files from previous blocks',
      condition: { field: 'operation', value: 'send_mail' },
      mode: 'advanced',
      required: false,
    },
    // Contact fields
    {
      id: 'email',
      title: 'Email',
      type: 'short-input',
      placeholder: 'contact@example.com',
      condition: { field: 'operation', value: ['add_contact'] },
      required: true,
    },
    {
      id: 'firstName',
      title: 'First Name',
      type: 'short-input',
      placeholder: 'John',
      condition: { field: 'operation', value: ['add_contact'] },
    },
    {
      id: 'lastName',
      title: 'Last Name',
      type: 'short-input',
      placeholder: 'Doe',
      condition: { field: 'operation', value: ['add_contact'] },
    },
    {
      id: 'customFields',
      title: 'Custom Fields',
      type: 'code',
      placeholder: '{"custom_field_1": "value1"}',
      condition: { field: 'operation', value: ['add_contact'] },
    },
    {
      id: 'contactListIds',
      title: 'List IDs',
      type: 'short-input',
      placeholder: 'Comma-separated list IDs',
      condition: { field: 'operation', value: ['add_contact'] },
    },
    {
      id: 'contactId',
      title: 'Contact ID',
      type: 'short-input',
      placeholder: 'Contact ID',
      condition: { field: 'operation', value: ['get_contact'] },
      required: true,
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: "email LIKE '%example.com%'",
      condition: { field: 'operation', value: ['search_contacts'] },
      required: true,
    },
    {
      id: 'contactIds',
      title: 'Contact IDs',
      type: 'short-input',
      placeholder: 'Comma-separated contact IDs',
      condition: {
        field: 'operation',
        value: ['delete_contacts', 'remove_contacts_from_list'],
      },
      required: true,
    },
    {
      id: 'contacts',
      title: 'Contacts (JSON Array)',
      type: 'code',
      placeholder: '[{"email": "user@example.com", "first_name": "John"}]',
      condition: { field: 'operation', value: 'add_contacts_to_list' },
      required: true,
    },
    // List fields
    {
      id: 'listName',
      title: 'List Name',
      type: 'short-input',
      placeholder: 'List name',
      condition: { field: 'operation', value: ['create_list'] },
      required: true,
    },
    {
      id: 'listId',
      title: 'List ID',
      type: 'short-input',
      placeholder: 'List ID',
      condition: {
        field: 'operation',
        value: ['get_list', 'delete_list', 'add_contacts_to_list', 'remove_contacts_from_list'],
      },
      required: true,
    },
    {
      id: 'listPageSize',
      title: 'Page Size',
      type: 'short-input',
      placeholder: '100',
      condition: { field: 'operation', value: 'list_all_lists' },
    },
    // Template fields
    {
      id: 'templateName',
      title: 'Template Name',
      type: 'short-input',
      placeholder: 'Template name',
      condition: { field: 'operation', value: ['create_template'] },
      required: true,
    },
    {
      id: 'templateId',
      title: 'Template ID',
      type: 'short-input',
      placeholder: 'Template ID',
      condition: {
        field: 'operation',
        value: ['get_template', 'delete_template', 'create_template_version'],
      },
      required: true,
    },
    {
      id: 'generation',
      title: 'Template Generation',
      type: 'dropdown',
      options: [
        { label: 'Dynamic', id: 'dynamic' },
        { label: 'Legacy', id: 'legacy' },
      ],
      value: () => 'dynamic',
      condition: { field: 'operation', value: 'create_template' },
    },
    {
      id: 'templateGenerations',
      title: 'Filter by Generation',
      type: 'short-input',
      placeholder: 'legacy, dynamic, or both',
      condition: { field: 'operation', value: 'list_templates' },
    },
    {
      id: 'templatePageSize',
      title: 'Page Size',
      type: 'short-input',
      placeholder: '20',
      condition: { field: 'operation', value: 'list_templates' },
    },
    {
      id: 'versionName',
      title: 'Version Name',
      type: 'short-input',
      placeholder: 'Version name',
      condition: { field: 'operation', value: 'create_template_version' },
      required: true,
    },
    {
      id: 'templateSubject',
      title: 'Template Subject',
      type: 'short-input',
      placeholder: 'Email subject',
      condition: { field: 'operation', value: 'create_template_version' },
      required: true,
    },
    {
      id: 'htmlContent',
      title: 'HTML Content',
      type: 'code',
      placeholder: '<html><body>{{name}}</body></html>',
      condition: { field: 'operation', value: 'create_template_version' },
    },
    {
      id: 'plainContent',
      title: 'Plain Text Content',
      type: 'long-input',
      placeholder: 'Plain text content',
      condition: { field: 'operation', value: 'create_template_version' },
    },
    {
      id: 'active',
      title: 'Active',
      type: 'dropdown',
      options: [
        { label: 'Yes', id: 'true' },
        { label: 'No', id: 'false' },
      ],
      value: () => 'true',
      condition: { field: 'operation', value: 'create_template_version' },
    },
  ],

  tools: {
    access: [
      'sendgrid_send_mail',
      'sendgrid_add_contact',
      'sendgrid_get_contact',
      'sendgrid_search_contacts',
      'sendgrid_delete_contacts',
      'sendgrid_create_list',
      'sendgrid_get_list',
      'sendgrid_list_all_lists',
      'sendgrid_delete_list',
      'sendgrid_add_contacts_to_list',
      'sendgrid_remove_contacts_from_list',
      'sendgrid_create_template',
      'sendgrid_get_template',
      'sendgrid_list_templates',
      'sendgrid_delete_template',
      'sendgrid_create_template_version',
    ],
    config: {
      tool: (params) => `sendgrid_${params.operation}`,
      params: (params) => {
        const {
          operation,
          mailSubject,
          mailTemplateId,
          listName,
          templateName,
          versionName,
          templateSubject,
          contactListIds,
          templateGenerations,
          listPageSize,
          templatePageSize,
          ...rest
        } = params

        // Map renamed fields back to tool parameter names
        return {
          ...rest,
          ...(mailSubject && { subject: mailSubject }),
          ...(mailTemplateId && { templateId: mailTemplateId }),
          ...(listName && { name: listName }),
          ...(templateName && { name: templateName }),
          ...(versionName && { name: versionName }),
          ...(templateSubject && { subject: templateSubject }),
          ...(contactListIds && { listIds: contactListIds }),
          ...(templateGenerations && { generations: templateGenerations }),
          ...(listPageSize && { pageSize: listPageSize }),
          ...(templatePageSize && { pageSize: templatePageSize }),
        }
      },
    },
  },

  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'SendGrid API key' },
    // Mail inputs
    from: { type: 'string', description: 'Sender email address' },
    fromName: { type: 'string', description: 'Sender name' },
    to: { type: 'string', description: 'Recipient email address' },
    toName: { type: 'string', description: 'Recipient name' },
    mailSubject: { type: 'string', description: 'Email subject' },
    content: { type: 'string', description: 'Email content' },
    contentType: { type: 'string', description: 'Content type' },
    cc: { type: 'string', description: 'CC email address' },
    bcc: { type: 'string', description: 'BCC email address' },
    replyTo: { type: 'string', description: 'Reply-to email address' },
    replyToName: { type: 'string', description: 'Reply-to name' },
    mailTemplateId: { type: 'string', description: 'Template ID for sending mail' },
    dynamicTemplateData: { type: 'json', description: 'Dynamic template data' },
    attachmentFiles: { type: 'json', description: 'Files to attach (UI upload)' },
    attachments: { type: 'array', description: 'Files to attach (UserFile array)' },
    // Contact inputs
    email: { type: 'string', description: 'Contact email' },
    firstName: { type: 'string', description: 'Contact first name' },
    lastName: { type: 'string', description: 'Contact last name' },
    customFields: { type: 'json', description: 'Custom fields' },
    contactId: { type: 'string', description: 'Contact ID' },
    contactIds: { type: 'string', description: 'Comma-separated contact IDs' },
    contacts: { type: 'json', description: 'Array of contact objects' },
    query: { type: 'string', description: 'Search query' },
    contactListIds: { type: 'string', description: 'Comma-separated list IDs for contact' },
    // List inputs
    listName: { type: 'string', description: 'List name' },
    listId: { type: 'string', description: 'List ID' },
    listPageSize: { type: 'number', description: 'Page size for listing lists' },
    // Template inputs
    templateName: { type: 'string', description: 'Template name' },
    templateId: { type: 'string', description: 'Template ID' },
    generation: { type: 'string', description: 'Template generation' },
    templateGenerations: { type: 'string', description: 'Filter templates by generation' },
    templatePageSize: { type: 'number', description: 'Page size for listing templates' },
    versionName: { type: 'string', description: 'Template version name' },
    templateSubject: { type: 'string', description: 'Template subject' },
    htmlContent: { type: 'string', description: 'HTML content' },
    plainContent: { type: 'string', description: 'Plain text content' },
    active: { type: 'boolean', description: 'Whether template version is active' },
  },

  outputs: {
    // Common
    success: { type: 'boolean', description: 'Operation success status' },
    message: { type: 'string', description: 'Status or success message' },
    // Send mail outputs
    messageId: { type: 'string', description: 'Email message ID (send_mail)' },
    to: { type: 'string', description: 'Recipient email address (send_mail)' },
    subject: { type: 'string', description: 'Email subject (send_mail, create_template_version)' },
    // Contact outputs
    id: { type: 'string', description: 'Resource ID' },
    jobId: { type: 'string', description: 'Job ID for async operations' },
    email: { type: 'string', description: 'Contact email address' },
    firstName: { type: 'string', description: 'Contact first name' },
    lastName: { type: 'string', description: 'Contact last name' },
    createdAt: { type: 'string', description: 'Creation timestamp' },
    updatedAt: { type: 'string', description: 'Last update timestamp' },
    listIds: { type: 'json', description: 'Array of list IDs the contact belongs to' },
    customFields: { type: 'json', description: 'Custom field values' },
    contacts: { type: 'json', description: 'Array of contacts' },
    contactCount: { type: 'number', description: 'Number of contacts' },
    // List outputs
    lists: { type: 'json', description: 'Array of lists' },
    name: { type: 'string', description: 'Resource name' },
    // Template outputs
    templates: { type: 'json', description: 'Array of templates' },
    generation: { type: 'string', description: 'Template generation' },
    versions: { type: 'json', description: 'Array of template versions' },
    // Template version outputs
    templateId: { type: 'string', description: 'Template ID' },
    active: { type: 'boolean', description: 'Whether template version is active' },
    htmlContent: { type: 'string', description: 'HTML content' },
    plainContent: { type: 'string', description: 'Plain text content' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: sentry.ts]---
Location: sim-main/apps/sim/blocks/blocks/sentry.ts

```typescript
import { SentryIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { SentryResponse } from '@/tools/sentry/types'

export const SentryBlock: BlockConfig<SentryResponse> = {
  type: 'sentry',
  name: 'Sentry',
  description: 'Manage Sentry issues, projects, events, and releases',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Sentry into the workflow. Monitor issues, manage projects, track events, and coordinate releases across your applications.',
  docsLink: 'https://docs.sim.ai/tools/sentry',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: SentryIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'List Issues', id: 'sentry_issues_list' },
        { label: 'Get Issue', id: 'sentry_issues_get' },
        { label: 'Update Issue', id: 'sentry_issues_update' },
        { label: 'List Projects', id: 'sentry_projects_list' },
        { label: 'Get Project', id: 'sentry_projects_get' },
        { label: 'Create Project', id: 'sentry_projects_create' },
        { label: 'Update Project', id: 'sentry_projects_update' },
        { label: 'List Events', id: 'sentry_events_list' },
        { label: 'Get Event', id: 'sentry_events_get' },
        { label: 'List Releases', id: 'sentry_releases_list' },
        { label: 'Create Release', id: 'sentry_releases_create' },
        { label: 'Create Deploy', id: 'sentry_releases_deploy' },
      ],
      value: () => 'sentry_issues_list',
    },

    // =====================================================================
    // LIST ISSUES
    // =====================================================================
    {
      id: 'projectSlug',
      title: 'Project Slug',
      type: 'short-input',
      placeholder: 'Filter by project (optional)',
      condition: { field: 'operation', value: 'sentry_issues_list' },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'e.g., is:unresolved, level:error',
      condition: { field: 'operation', value: 'sentry_issues_list' },
    },
    {
      id: 'statsPeriod',
      title: 'Stats Period',
      type: 'short-input',
      placeholder: '24h, 7d, 30d',
      condition: { field: 'operation', value: 'sentry_issues_list' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '25',
      condition: { field: 'operation', value: 'sentry_issues_list' },
    },
    {
      id: 'status',
      title: 'Status',
      type: 'dropdown',
      options: [
        { label: 'All', id: '' },
        { label: 'Unresolved', id: 'unresolved' },
        { label: 'Resolved', id: 'resolved' },
        { label: 'Ignored', id: 'ignored' },
        { label: 'Muted', id: 'muted' },
      ],
      value: () => '',
      condition: { field: 'operation', value: 'sentry_issues_list' },
    },
    {
      id: 'sort',
      title: 'Sort By',
      type: 'dropdown',
      options: [
        { label: 'Date', id: 'date' },
        { label: 'New', id: 'new' },
        { label: 'Frequency', id: 'freq' },
        { label: 'Priority', id: 'priority' },
        { label: 'User Count', id: 'user' },
      ],
      value: () => 'date',
      condition: { field: 'operation', value: 'sentry_issues_list' },
    },

    // =====================================================================
    // GET ISSUE
    // =====================================================================
    {
      id: 'issueId',
      title: 'Issue ID',
      type: 'short-input',
      placeholder: 'Enter issue ID',
      condition: { field: 'operation', value: 'sentry_issues_get' },
      required: true,
    },

    // =====================================================================
    // UPDATE ISSUE
    // =====================================================================
    {
      id: 'issueId',
      title: 'Issue ID',
      type: 'short-input',
      placeholder: 'Enter issue ID',
      condition: { field: 'operation', value: 'sentry_issues_update' },
      required: true,
    },
    {
      id: 'status',
      title: 'New Status',
      type: 'dropdown',
      options: [
        { label: 'No Change', id: '' },
        { label: 'Resolved', id: 'resolved' },
        { label: 'Unresolved', id: 'unresolved' },
        { label: 'Ignored', id: 'ignored' },
        { label: 'Resolved in Next Release', id: 'resolvedInNextRelease' },
      ],
      value: () => '',
      condition: { field: 'operation', value: 'sentry_issues_update' },
    },
    {
      id: 'assignedTo',
      title: 'Assign To',
      type: 'short-input',
      placeholder: 'User ID or email (empty to unassign)',
      condition: { field: 'operation', value: 'sentry_issues_update' },
    },
    {
      id: 'isBookmarked',
      title: 'Bookmark Issue',
      type: 'switch',
      condition: { field: 'operation', value: 'sentry_issues_update' },
    },
    {
      id: 'isSubscribed',
      title: 'Subscribe to Updates',
      type: 'switch',
      condition: { field: 'operation', value: 'sentry_issues_update' },
    },

    // =====================================================================
    // LIST PROJECTS
    // =====================================================================
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '25',
      condition: { field: 'operation', value: 'sentry_projects_list' },
    },

    // =====================================================================
    // GET PROJECT
    // =====================================================================
    {
      id: 'projectSlug',
      title: 'Project ID or Slug',
      type: 'short-input',
      placeholder: 'Enter project ID or slug',
      condition: { field: 'operation', value: 'sentry_projects_get' },
      required: true,
    },

    // =====================================================================
    // CREATE PROJECT
    // =====================================================================
    {
      id: 'name',
      title: 'Project Name',
      type: 'short-input',
      placeholder: 'Enter project name',
      condition: { field: 'operation', value: 'sentry_projects_create' },
      required: true,
    },
    {
      id: 'teamSlug',
      title: 'Team Slug',
      type: 'short-input',
      placeholder: 'Team that will own the project',
      condition: { field: 'operation', value: 'sentry_projects_create' },
      required: true,
    },
    {
      id: 'slug',
      title: 'Project Slug',
      type: 'short-input',
      placeholder: 'Auto-generated if not provided',
      condition: { field: 'operation', value: 'sentry_projects_create' },
    },
    {
      id: 'platform',
      title: 'Platform',
      type: 'short-input',
      placeholder: 'javascript, python, node, etc.',
      condition: { field: 'operation', value: 'sentry_projects_create' },
    },
    {
      id: 'defaultRules',
      title: 'Create Default Alert Rules',
      type: 'switch',
      condition: { field: 'operation', value: 'sentry_projects_create' },
    },

    // =====================================================================
    // UPDATE PROJECT
    // =====================================================================
    {
      id: 'projectSlug',
      title: 'Project Slug',
      type: 'short-input',
      placeholder: 'Enter project slug',
      condition: { field: 'operation', value: 'sentry_projects_update' },
      required: true,
    },
    {
      id: 'name',
      title: 'New Name',
      type: 'short-input',
      placeholder: 'Leave empty to keep current name',
      condition: { field: 'operation', value: 'sentry_projects_update' },
    },
    {
      id: 'slug',
      title: 'New Slug',
      type: 'short-input',
      placeholder: 'Leave empty to keep current slug',
      condition: { field: 'operation', value: 'sentry_projects_update' },
    },
    {
      id: 'platform',
      title: 'Platform',
      type: 'short-input',
      placeholder: 'Leave empty to keep current platform',
      condition: { field: 'operation', value: 'sentry_projects_update' },
    },
    {
      id: 'isBookmarked',
      title: 'Bookmark Project',
      type: 'switch',
      condition: { field: 'operation', value: 'sentry_projects_update' },
    },

    // =====================================================================
    // LIST EVENTS
    // =====================================================================
    {
      id: 'projectSlug',
      title: 'Project Slug',
      type: 'short-input',
      placeholder: 'Enter project slug',
      condition: { field: 'operation', value: 'sentry_events_list' },
      required: true,
    },
    {
      id: 'issueId',
      title: 'Issue ID',
      type: 'short-input',
      placeholder: 'Filter by specific issue (optional)',
      condition: { field: 'operation', value: 'sentry_events_list' },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'e.g., user.email:*@example.com',
      condition: { field: 'operation', value: 'sentry_events_list' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '50',
      condition: { field: 'operation', value: 'sentry_events_list' },
    },
    {
      id: 'statsPeriod',
      title: 'Stats Period',
      type: 'short-input',
      placeholder: '24h, 7d, 30d, 90d',
      condition: { field: 'operation', value: 'sentry_events_list' },
    },

    // =====================================================================
    // GET EVENT
    // =====================================================================
    {
      id: 'projectSlug',
      title: 'Project Slug',
      type: 'short-input',
      placeholder: 'Enter project slug',
      condition: { field: 'operation', value: 'sentry_events_get' },
      required: true,
    },
    {
      id: 'eventId',
      title: 'Event ID',
      type: 'short-input',
      placeholder: 'Enter event ID',
      condition: { field: 'operation', value: 'sentry_events_get' },
      required: true,
    },

    // =====================================================================
    // LIST RELEASES
    // =====================================================================
    {
      id: 'projectSlug',
      title: 'Project Slug',
      type: 'short-input',
      placeholder: 'Filter by project (optional)',
      condition: { field: 'operation', value: 'sentry_releases_list' },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Search for specific release versions',
      condition: { field: 'operation', value: 'sentry_releases_list' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '25',
      condition: { field: 'operation', value: 'sentry_releases_list' },
    },

    // =====================================================================
    // CREATE RELEASE
    // =====================================================================
    {
      id: 'version',
      title: 'Version',
      type: 'short-input',
      placeholder: 'e.g., 2.0.0 or my-app@1.0.0',
      condition: { field: 'operation', value: 'sentry_releases_create' },
      required: true,
    },
    {
      id: 'projects',
      title: 'Projects',
      type: 'long-input',
      placeholder: 'Comma-separated project slugs',
      condition: { field: 'operation', value: 'sentry_releases_create' },
      required: true,
    },
    {
      id: 'ref',
      title: 'Git Reference',
      type: 'short-input',
      placeholder: 'Commit SHA, tag, or branch',
      condition: { field: 'operation', value: 'sentry_releases_create' },
    },
    {
      id: 'url',
      title: 'Release URL',
      type: 'long-input',
      placeholder: 'URL to release page (e.g., GitHub release)',
      condition: { field: 'operation', value: 'sentry_releases_create' },
    },
    {
      id: 'dateReleased',
      title: 'Release Date',
      type: 'short-input',
      placeholder: 'ISO 8601 timestamp (defaults to now)',
      condition: { field: 'operation', value: 'sentry_releases_create' },
    },
    {
      id: 'commits',
      title: 'Commits (JSON)',
      type: 'long-input',
      placeholder: '[{"id":"abc123","message":"Fix bug"}]',
      condition: { field: 'operation', value: 'sentry_releases_create' },
    },

    // =====================================================================
    // CREATE DEPLOY
    // =====================================================================
    {
      id: 'version',
      title: 'Version',
      type: 'short-input',
      placeholder: 'Release version to deploy',
      condition: { field: 'operation', value: 'sentry_releases_deploy' },
      required: true,
    },
    {
      id: 'environment',
      title: 'Environment',
      type: 'short-input',
      placeholder: 'production, staging, etc.',
      condition: { field: 'operation', value: 'sentry_releases_deploy' },
      required: true,
    },
    {
      id: 'name',
      title: 'Deploy Name',
      type: 'short-input',
      placeholder: 'Optional deploy name',
      condition: { field: 'operation', value: 'sentry_releases_deploy' },
    },
    {
      id: 'url',
      title: 'Deploy URL',
      type: 'long-input',
      placeholder: 'URL to CI/CD pipeline or deploy',
      condition: { field: 'operation', value: 'sentry_releases_deploy' },
    },
    {
      id: 'dateStarted',
      title: 'Start Time',
      type: 'short-input',
      placeholder: 'ISO 8601 timestamp (defaults to now)',
      condition: { field: 'operation', value: 'sentry_releases_deploy' },
    },
    {
      id: 'dateFinished',
      title: 'Finish Time',
      type: 'short-input',
      placeholder: 'ISO 8601 timestamp',
      condition: { field: 'operation', value: 'sentry_releases_deploy' },
    },

    // =====================================================================
    // COMMON PARAMETERS
    // =====================================================================
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Sentry API token',
      password: true,
      required: true,
    },
    {
      id: 'organizationSlug',
      title: 'Organization Slug',
      type: 'short-input',
      placeholder: 'Your Sentry organization slug',
      required: true,
    },
  ],
  tools: {
    access: [
      'sentry_issues_list',
      'sentry_issues_get',
      'sentry_issues_update',
      'sentry_projects_list',
      'sentry_projects_get',
      'sentry_projects_create',
      'sentry_projects_update',
      'sentry_events_list',
      'sentry_events_get',
      'sentry_releases_list',
      'sentry_releases_create',
      'sentry_releases_deploy',
    ],
    config: {
      tool: (params) => {
        // Convert numeric fields
        if (params.limit) {
          params.limit = Number(params.limit)
        }

        // Return the appropriate tool based on operation
        switch (params.operation) {
          case 'sentry_issues_list':
            return 'sentry_issues_list'
          case 'sentry_issues_get':
            return 'sentry_issues_get'
          case 'sentry_issues_update':
            return 'sentry_issues_update'
          case 'sentry_projects_list':
            return 'sentry_projects_list'
          case 'sentry_projects_get':
            return 'sentry_projects_get'
          case 'sentry_projects_create':
            return 'sentry_projects_create'
          case 'sentry_projects_update':
            return 'sentry_projects_update'
          case 'sentry_events_list':
            return 'sentry_events_list'
          case 'sentry_events_get':
            return 'sentry_events_get'
          case 'sentry_releases_list':
            return 'sentry_releases_list'
          case 'sentry_releases_create':
            return 'sentry_releases_create'
          case 'sentry_releases_deploy':
            return 'sentry_releases_deploy'
          default:
            return 'sentry_issues_list'
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Sentry API authentication token' },
    organizationSlug: { type: 'string', description: 'Organization slug' },
    // Issue fields
    issueId: { type: 'string', description: 'Issue ID' },
    assignedTo: { type: 'string', description: 'User to assign issue to' },
    isBookmarked: { type: 'boolean', description: 'Bookmark state' },
    isSubscribed: { type: 'boolean', description: 'Subscription state' },
    // Project fields
    projectSlug: { type: 'string', description: 'Project slug' },
    name: { type: 'string', description: 'Project or deploy name' },
    teamSlug: { type: 'string', description: 'Team slug' },
    slug: { type: 'string', description: 'Project slug for creation/update' },
    platform: { type: 'string', description: 'Platform/language' },
    defaultRules: { type: 'boolean', description: 'Create default alert rules' },
    // Event fields
    eventId: { type: 'string', description: 'Event ID' },
    // Release fields
    version: { type: 'string', description: 'Release version' },
    projects: { type: 'string', description: 'Comma-separated project slugs' },
    ref: { type: 'string', description: 'Git reference' },
    url: { type: 'string', description: 'URL' },
    dateReleased: { type: 'string', description: 'Release date' },
    commits: { type: 'string', description: 'Commits JSON' },
    environment: { type: 'string', description: 'Environment name' },
    dateStarted: { type: 'string', description: 'Deploy start time' },
    dateFinished: { type: 'string', description: 'Deploy finish time' },
    // Common fields
    query: { type: 'string', description: 'Search query' },
    limit: { type: 'number', description: 'Result limit' },
    status: { type: 'string', description: 'Status filter' },
    sort: { type: 'string', description: 'Sort order' },
    statsPeriod: { type: 'string', description: 'Statistics time period' },
  },
  outputs: {
    // Issue outputs
    issues: { type: 'json', description: 'List of issues' },
    issue: { type: 'json', description: 'Single issue details' },
    // Project outputs
    projects: { type: 'json', description: 'List of projects' },
    project: { type: 'json', description: 'Single project details' },
    // Event outputs
    events: { type: 'json', description: 'List of events' },
    event: { type: 'json', description: 'Single event details' },
    // Release outputs
    releases: { type: 'json', description: 'List of releases' },
    release: { type: 'json', description: 'Single release details' },
    deploy: { type: 'json', description: 'Deploy details' },
    // Pagination
    nextCursor: { type: 'string', description: 'Pagination cursor' },
    hasMore: { type: 'boolean', description: 'More results available' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: serper.ts]---
Location: sim-main/apps/sim/blocks/blocks/serper.ts

```typescript
import { SerperIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { SearchResponse } from '@/tools/serper/types'

export const SerperBlock: BlockConfig<SearchResponse> = {
  type: 'serper',
  name: 'Serper',
  description: 'Search the web using Serper',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate Serper into the workflow. Can search the web.',
  docsLink: 'https://docs.sim.ai/tools/serper',
  category: 'tools',
  bgColor: '#2B3543',
  icon: SerperIcon,
  subBlocks: [
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Enter your search query...',
      required: true,
    },
    {
      id: 'type',
      title: 'Search Type',
      type: 'dropdown',
      options: [
        { label: 'search', id: 'search' },
        { label: 'news', id: 'news' },
        { label: 'places', id: 'places' },
        { label: 'images', id: 'images' },
      ],
      value: () => 'search',
    },
    {
      id: 'num',
      title: 'Number of Results',
      type: 'dropdown',
      options: [
        { label: '10', id: '10' },
        { label: '20', id: '20' },
        { label: '30', id: '30' },
        { label: '40', id: '40' },
        { label: '50', id: '50' },
        { label: '100', id: '100' },
      ],
    },
    {
      id: 'gl',
      title: 'Country',
      type: 'dropdown',
      options: [
        { label: 'US', id: 'US' },
        { label: 'GB', id: 'GB' },
        { label: 'CA', id: 'CA' },
        { label: 'AU', id: 'AU' },
        { label: 'DE', id: 'DE' },
        { label: 'FR', id: 'FR' },
      ],
    },
    {
      id: 'hl',
      title: 'Language',
      type: 'dropdown',
      options: [
        { label: 'en', id: 'en' },
        { label: 'es', id: 'es' },
        { label: 'fr', id: 'fr' },
        { label: 'de', id: 'de' },
        { label: 'it', id: 'it' },
      ],
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Serper API key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: ['serper_search'],
  },
  inputs: {
    query: { type: 'string', description: 'Search query terms' },
    apiKey: { type: 'string', description: 'Serper API key' },
    num: { type: 'number', description: 'Number of results' },
    gl: { type: 'string', description: 'Country code' },
    hl: { type: 'string', description: 'Language code' },
    type: { type: 'string', description: 'Search type' },
  },
  outputs: {
    searchResults: { type: 'json', description: 'Search results data' },
  },
}
```

--------------------------------------------------------------------------------

````

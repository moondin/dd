---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 488
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 488 of 933)

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

---[FILE: sqs.ts]---
Location: sim-main/apps/sim/blocks/blocks/sqs.ts

```typescript
import { SQSIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { SqsResponse } from '@/tools/sqs/types'

export const SQSBlock: BlockConfig<SqsResponse> = {
  type: 'sqs',
  name: 'Amazon SQS',
  description: 'Connect to Amazon SQS',
  longDescription: 'Integrate Amazon SQS into the workflow. Can send messages to SQS queues.',
  docsLink: 'https://docs.sim.ai/tools/sqs',
  category: 'tools',
  bgColor: 'linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)',
  icon: SQSIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [{ label: 'Send Message', id: 'send' }],
      value: () => 'send',
    },
    {
      id: 'region',
      title: 'AWS Region',
      type: 'short-input',
      placeholder: 'us-east-1',
      required: true,
    },
    {
      id: 'accessKeyId',
      title: 'AWS Access Key ID',
      type: 'short-input',
      placeholder: 'AKIA...',
      password: true,
      required: true,
    },
    {
      id: 'secretAccessKey',
      title: 'AWS Secret Access Key',
      type: 'short-input',
      placeholder: 'Your secret access key',
      password: true,
      required: true,
    },
    {
      id: 'queueUrl',
      title: 'Queue URL',
      type: 'short-input',
      placeholder: 'https://sqs.us-east-1.amazonaws.com/123456789012/my-queue',
      required: true,
    },
    // Data field for send message operation
    {
      id: 'messageGroupId',
      title: 'Message Group ID (optional)',
      type: 'short-input',
      placeholder: '5FAB0F0B-30C6-4427-9407-5634F4A3984A',
      condition: { field: 'operation', value: 'send' },
      required: false,
    },
    {
      id: 'messageDeduplicationId',
      title: 'Message Deduplication ID (optional)',
      type: 'short-input',
      placeholder: '5FAB0F0B-30C6-4427-9407-5634F4A3984A',
      condition: { field: 'operation', value: 'send' },
      required: false,
    },
    {
      id: 'data',
      title: 'Data (JSON)',
      type: 'code',
      placeholder: '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "active": true\n}',
      condition: { field: 'operation', value: 'send' },
      required: true,
    },
  ],
  tools: {
    access: ['sqs_send'],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'send':
            return 'sqs_send'
          default:
            throw new Error(`Invalid SQS operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { operation, data, messageGroupId, messageDeduplicationId, ...rest } = params

        // Parse JSON fields
        const parseJson = (value: unknown, fieldName: string) => {
          if (!value) return undefined
          if (typeof value === 'object') return value
          if (typeof value === 'string' && value.trim()) {
            try {
              return JSON.parse(value)
            } catch (parseError) {
              const errorMsg =
                parseError instanceof Error ? parseError.message : 'Unknown JSON error'
              throw new Error(`Invalid JSON in ${fieldName}: ${errorMsg}`)
            }
          }
          return undefined
        }

        const parsedData = parseJson(data, 'data')

        // Build connection config
        const connectionConfig = {
          region: rest.region,
          accessKeyId: rest.accessKeyId,
          secretAccessKey: rest.secretAccessKey,
        }

        // Build params object
        const result: Record<string, unknown> = { ...connectionConfig }

        if (rest.queueUrl) result.queueUrl = rest.queueUrl
        if (messageGroupId) result.messageGroupId = messageGroupId
        if (messageDeduplicationId) result.messageDeduplicationId = messageDeduplicationId
        if (parsedData !== undefined) result.data = parsedData

        return result
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'SQS operation to perform' },
    region: { type: 'string', description: 'AWS region' },
    accessKeyId: { type: 'string', description: 'AWS access key ID' },
    secretAccessKey: { type: 'string', description: 'AWS secret access key' },
    queueUrl: { type: 'string', description: 'SQS queue URL' },
    messageGroupId: {
      type: 'string',
      description: 'Message group ID (optional)',
    },
    messageDeduplicationId: {
      type: 'string',
      description: 'Message deduplication ID (optional)',
    },
    data: { type: 'json', description: 'Data for send message operation' },
  },
  outputs: {
    message: {
      type: 'string',
      description: 'Success or error message describing the operation outcome',
    },
    id: {
      type: 'string',
      description: 'Message ID',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ssh.ts]---
Location: sim-main/apps/sim/blocks/blocks/ssh.ts

```typescript
import { SshIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { SSHResponse } from '@/tools/ssh/types'

export const SSHBlock: BlockConfig<SSHResponse> = {
  type: 'ssh',
  name: 'SSH',
  description: 'Connect to remote servers via SSH',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Execute commands, transfer files, and manage remote servers via SSH. Supports password and private key authentication for secure server access.',
  docsLink: 'https://docs.sim.ai/tools/ssh',
  category: 'tools',
  bgColor: '#000000',
  icon: SshIcon,
  subBlocks: [
    // Operation selector
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Execute Command', id: 'ssh_execute_command' },
        { label: 'Execute Script', id: 'ssh_execute_script' },
        { label: 'Check Command Exists', id: 'ssh_check_command_exists' },
        { label: 'Upload File', id: 'ssh_upload_file' },
        { label: 'Download File', id: 'ssh_download_file' },
        { label: 'List Directory', id: 'ssh_list_directory' },
        { label: 'Check File/Directory Exists', id: 'ssh_check_file_exists' },
        { label: 'Create Directory', id: 'ssh_create_directory' },
        { label: 'Delete File/Directory', id: 'ssh_delete_file' },
        { label: 'Move/Rename', id: 'ssh_move_rename' },
        { label: 'Get System Info', id: 'ssh_get_system_info' },
        { label: 'Read File Content', id: 'ssh_read_file_content' },
        { label: 'Write File Content', id: 'ssh_write_file_content' },
      ],
      value: () => 'ssh_execute_command',
    },

    // Connection parameters
    {
      id: 'host',
      title: 'Host',
      type: 'short-input',
      placeholder: 'example.com or 192.168.1.100',
      required: true,
    },
    {
      id: 'port',
      title: 'Port',
      type: 'short-input',
      placeholder: '22',
      value: () => '22',
    },
    {
      id: 'username',
      title: 'Username',
      type: 'short-input',
      placeholder: 'ubuntu, root, or deploy',
      required: true,
    },

    // Authentication method selector
    {
      id: 'authMethod',
      title: 'Authentication Method',
      type: 'dropdown',
      options: [
        { label: 'Password', id: 'password' },
        { label: 'Private Key', id: 'privateKey' },
      ],
      value: () => 'password',
    },

    // Password authentication
    {
      id: 'password',
      title: 'Password',
      type: 'short-input',
      password: true,
      placeholder: 'Your SSH password',
      condition: { field: 'authMethod', value: 'password' },
    },

    // Private key authentication
    {
      id: 'privateKey',
      title: 'Private Key',
      type: 'code',
      placeholder: '-----BEGIN OPENSSH PRIVATE KEY-----\n...',
      condition: { field: 'authMethod', value: 'privateKey' },
    },
    {
      id: 'passphrase',
      title: 'Passphrase',
      type: 'short-input',
      password: true,
      placeholder: 'Passphrase for encrypted key (optional)',
      condition: { field: 'authMethod', value: 'privateKey' },
    },

    // EXECUTE COMMAND
    {
      id: 'command',
      title: 'Command',
      type: 'code',
      placeholder: 'ls -la /var/www',
      required: true,
      condition: { field: 'operation', value: 'ssh_execute_command' },
    },
    {
      id: 'workingDirectory',
      title: 'Working Directory',
      type: 'short-input',
      placeholder: '/var/www/html (optional)',
      condition: { field: 'operation', value: 'ssh_execute_command' },
    },

    // EXECUTE SCRIPT
    {
      id: 'script',
      title: 'Script Content',
      type: 'code',
      placeholder: '#!/bin/bash\necho "Hello World"',
      required: true,
      condition: { field: 'operation', value: 'ssh_execute_script' },
    },
    {
      id: 'interpreter',
      title: 'Interpreter',
      type: 'short-input',
      placeholder: '/bin/bash',
      condition: { field: 'operation', value: 'ssh_execute_script' },
    },
    {
      id: 'scriptWorkingDirectory',
      title: 'Working Directory',
      type: 'short-input',
      placeholder: '/var/www/html (optional)',
      condition: { field: 'operation', value: 'ssh_execute_script' },
    },

    // CHECK COMMAND EXISTS
    {
      id: 'commandName',
      title: 'Command Name',
      type: 'short-input',
      placeholder: 'docker, git, python3',
      required: true,
      condition: { field: 'operation', value: 'ssh_check_command_exists' },
    },

    // UPLOAD FILE
    {
      id: 'fileContent',
      title: 'File Content',
      type: 'code',
      placeholder: 'Content to upload...',
      required: true,
      condition: { field: 'operation', value: 'ssh_upload_file' },
    },
    {
      id: 'fileName',
      title: 'File Name',
      type: 'short-input',
      placeholder: 'config.json',
      required: true,
      condition: { field: 'operation', value: 'ssh_upload_file' },
    },
    {
      id: 'remotePath',
      title: 'Remote Path',
      type: 'short-input',
      placeholder: '/var/www/html/config.json',
      required: true,
      condition: { field: 'operation', value: 'ssh_upload_file' },
    },
    {
      id: 'permissions',
      title: 'Permissions',
      type: 'short-input',
      placeholder: '0644',
      condition: { field: 'operation', value: 'ssh_upload_file' },
    },

    // DOWNLOAD FILE
    {
      id: 'downloadRemotePath',
      title: 'Remote File Path',
      type: 'short-input',
      placeholder: '/var/log/app.log',
      required: true,
      condition: { field: 'operation', value: 'ssh_download_file' },
    },

    // LIST DIRECTORY
    {
      id: 'listPath',
      title: 'Directory Path',
      type: 'short-input',
      placeholder: '/var/www',
      required: true,
      condition: { field: 'operation', value: 'ssh_list_directory' },
    },
    {
      id: 'detailed',
      title: 'Show Details',
      type: 'switch',
      condition: { field: 'operation', value: 'ssh_list_directory' },
    },

    // CHECK FILE EXISTS
    {
      id: 'checkPath',
      title: 'Path to Check',
      type: 'short-input',
      placeholder: '/etc/nginx/nginx.conf',
      required: true,
      condition: { field: 'operation', value: 'ssh_check_file_exists' },
    },
    {
      id: 'checkType',
      title: 'Expected Type',
      type: 'dropdown',
      options: [
        { label: 'Any', id: 'any' },
        { label: 'File', id: 'file' },
        { label: 'Directory', id: 'directory' },
      ],
      value: () => 'any',
      condition: { field: 'operation', value: 'ssh_check_file_exists' },
    },

    // CREATE DIRECTORY
    {
      id: 'createPath',
      title: 'Directory Path',
      type: 'short-input',
      placeholder: '/var/www/new-site',
      required: true,
      condition: { field: 'operation', value: 'ssh_create_directory' },
    },
    {
      id: 'recursive',
      title: 'Create Parent Directories',
      type: 'switch',
      defaultValue: true,
      condition: { field: 'operation', value: 'ssh_create_directory' },
    },

    // DELETE FILE
    {
      id: 'deletePath',
      title: 'Path to Delete',
      type: 'short-input',
      placeholder: '/tmp/old-file.txt',
      required: true,
      condition: { field: 'operation', value: 'ssh_delete_file' },
    },
    {
      id: 'deleteRecursive',
      title: 'Recursive Delete',
      type: 'switch',
      condition: { field: 'operation', value: 'ssh_delete_file' },
    },
    {
      id: 'force',
      title: 'Force Delete',
      type: 'switch',
      condition: { field: 'operation', value: 'ssh_delete_file' },
    },

    // MOVE/RENAME
    {
      id: 'sourcePath',
      title: 'Source Path',
      type: 'short-input',
      placeholder: '/var/www/old-name',
      required: true,
      condition: { field: 'operation', value: 'ssh_move_rename' },
    },
    {
      id: 'destinationPath',
      title: 'Destination Path',
      type: 'short-input',
      placeholder: '/var/www/new-name',
      required: true,
      condition: { field: 'operation', value: 'ssh_move_rename' },
    },
    {
      id: 'overwrite',
      title: 'Overwrite if Exists',
      type: 'switch',
      condition: { field: 'operation', value: 'ssh_move_rename' },
    },

    // READ FILE CONTENT
    {
      id: 'readPath',
      title: 'File Path',
      type: 'short-input',
      placeholder: '/var/log/app.log',
      required: true,
      condition: { field: 'operation', value: 'ssh_read_file_content' },
    },
    {
      id: 'encoding',
      title: 'Encoding',
      type: 'short-input',
      placeholder: 'utf-8',
      condition: { field: 'operation', value: 'ssh_read_file_content' },
    },
    {
      id: 'maxSize',
      title: 'Max Size (MB)',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'ssh_read_file_content' },
    },

    // WRITE FILE CONTENT
    {
      id: 'writePath',
      title: 'File Path',
      type: 'short-input',
      placeholder: '/etc/config.json',
      required: true,
      condition: { field: 'operation', value: 'ssh_write_file_content' },
    },
    {
      id: 'content',
      title: 'File Content',
      type: 'code',
      placeholder: 'Content to write...',
      required: true,
      condition: { field: 'operation', value: 'ssh_write_file_content' },
    },
    {
      id: 'writeMode',
      title: 'Write Mode',
      type: 'dropdown',
      options: [
        { label: 'Overwrite', id: 'overwrite' },
        { label: 'Append', id: 'append' },
        { label: 'Create (fail if exists)', id: 'create' },
      ],
      value: () => 'overwrite',
      condition: { field: 'operation', value: 'ssh_write_file_content' },
    },
    {
      id: 'writePermissions',
      title: 'Permissions',
      type: 'short-input',
      placeholder: '0644',
      condition: { field: 'operation', value: 'ssh_write_file_content' },
    },
  ],
  tools: {
    access: [
      'ssh_execute_command',
      'ssh_execute_script',
      'ssh_check_command_exists',
      'ssh_upload_file',
      'ssh_download_file',
      'ssh_list_directory',
      'ssh_check_file_exists',
      'ssh_create_directory',
      'ssh_delete_file',
      'ssh_move_rename',
      'ssh_get_system_info',
      'ssh_read_file_content',
      'ssh_write_file_content',
    ],
    config: {
      tool: (params) => {
        return params.operation || 'ssh_execute_command'
      },
      params: (params) => {
        // Build connection config
        const connectionConfig: Record<string, unknown> = {
          host: params.host,
          port:
            typeof params.port === 'string' ? Number.parseInt(params.port, 10) : params.port || 22,
          username: params.username,
        }

        // Add authentication based on method
        if (params.authMethod === 'privateKey') {
          connectionConfig.privateKey = params.privateKey
          if (params.passphrase) {
            connectionConfig.passphrase = params.passphrase
          }
        } else {
          connectionConfig.password = params.password
        }

        // Build operation-specific parameters based on the selected operation
        const operation = params.operation || 'ssh_execute_command'

        switch (operation) {
          case 'ssh_execute_command':
            return {
              ...connectionConfig,
              command: params.command,
              workingDirectory: params.workingDirectory,
            }
          case 'ssh_execute_script':
            return {
              ...connectionConfig,
              script: params.script,
              interpreter: params.interpreter || '/bin/bash',
              workingDirectory: params.scriptWorkingDirectory,
            }
          case 'ssh_check_command_exists':
            return {
              ...connectionConfig,
              commandName: params.commandName,
            }
          case 'ssh_upload_file':
            return {
              ...connectionConfig,
              fileContent: params.fileContent,
              fileName: params.fileName,
              remotePath: params.remotePath,
              permissions: params.permissions,
            }
          case 'ssh_download_file':
            return {
              ...connectionConfig,
              remotePath: params.downloadRemotePath,
            }
          case 'ssh_list_directory':
            return {
              ...connectionConfig,
              path: params.listPath,
              detailed: params.detailed,
            }
          case 'ssh_check_file_exists':
            return {
              ...connectionConfig,
              path: params.checkPath,
              type: params.checkType || 'any',
            }
          case 'ssh_create_directory':
            return {
              ...connectionConfig,
              path: params.createPath,
              recursive: params.recursive !== false,
            }
          case 'ssh_delete_file':
            return {
              ...connectionConfig,
              path: params.deletePath,
              recursive: params.deleteRecursive,
              force: params.force,
            }
          case 'ssh_move_rename':
            return {
              ...connectionConfig,
              sourcePath: params.sourcePath,
              destinationPath: params.destinationPath,
              overwrite: params.overwrite,
            }
          case 'ssh_get_system_info':
            return connectionConfig
          case 'ssh_read_file_content':
            return {
              ...connectionConfig,
              path: params.readPath,
              encoding: params.encoding || 'utf-8',
              maxSize: params.maxSize ? Number.parseInt(params.maxSize, 10) : 10,
            }
          case 'ssh_write_file_content':
            return {
              ...connectionConfig,
              path: params.writePath,
              content: params.content,
              mode: params.writeMode || 'overwrite',
              permissions: params.writePermissions,
            }
          default:
            return connectionConfig
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'SSH operation to perform' },
    host: { type: 'string', description: 'SSH server hostname' },
    port: { type: 'number', description: 'SSH server port' },
    username: { type: 'string', description: 'SSH username' },
    authMethod: { type: 'string', description: 'Authentication method' },
    password: { type: 'string', description: 'Password for authentication' },
    privateKey: { type: 'string', description: 'Private key for authentication' },
    passphrase: { type: 'string', description: 'Passphrase for encrypted key' },
    command: { type: 'string', description: 'Command to execute' },
    script: { type: 'string', description: 'Script content to execute' },
    commandName: { type: 'string', description: 'Command name to check' },
    fileContent: { type: 'string', description: 'File content to upload' },
    fileName: { type: 'string', description: 'Name of the file' },
    remotePath: { type: 'string', description: 'Remote file/directory path' },
    content: { type: 'string', description: 'File content' },
  },
  outputs: {
    stdout: { type: 'string', description: 'Command standard output' },
    stderr: { type: 'string', description: 'Command standard error' },
    exitCode: { type: 'number', description: 'Command exit code' },
    success: { type: 'boolean', description: 'Operation success status' },
    fileContent: { type: 'string', description: 'Downloaded/read file content' },
    entries: { type: 'json', description: 'Directory entries' },
    exists: { type: 'boolean', description: 'File/directory existence' },
    content: { type: 'string', description: 'File content' },
    hostname: { type: 'string', description: 'Server hostname' },
    os: { type: 'string', description: 'Operating system' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: stagehand.ts]---
Location: sim-main/apps/sim/blocks/blocks/stagehand.ts

```typescript
import { StagehandIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { ToolResponse } from '@/tools/types'

export interface StagehandExtractResponse extends ToolResponse {
  output: {
    data: Record<string, any>
  }
}

export interface StagehandAgentResponse extends ToolResponse {
  output: {
    agentResult: {
      success: boolean
      completed: boolean
      message: string
      actions?: Array<{
        type: string
        description: string
        result?: string
      }>
    }
    structuredOutput?: Record<string, any>
  }
}

export type StagehandResponse = StagehandExtractResponse | StagehandAgentResponse

export const StagehandBlock: BlockConfig<StagehandResponse> = {
  type: 'stagehand',
  name: 'Stagehand',
  description: 'Web automation and data extraction',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Stagehand into the workflow. Can extract structured data from webpages or run an autonomous agent to perform tasks.',
  docsLink: 'https://docs.sim.ai/tools/stagehand',
  category: 'tools',
  bgColor: '#FFC83C',
  icon: StagehandIcon,
  subBlocks: [
    // Operation selection
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Extract Data', id: 'extract' },
        { label: 'Run Agent', id: 'agent' },
      ],
      value: () => 'extract',
    },
    // Provider selection
    {
      id: 'provider',
      title: 'AI Provider',
      type: 'dropdown',
      options: [
        { label: 'OpenAI', id: 'openai' },
        { label: 'Anthropic', id: 'anthropic' },
      ],
      value: () => 'openai',
    },
    // Extract operation fields
    {
      id: 'url',
      title: 'URL',
      type: 'short-input',
      placeholder: 'Enter the URL of the website to extract data from',
      condition: { field: 'operation', value: 'extract' },
      required: true,
    },
    {
      id: 'instruction',
      title: 'Instructions',
      type: 'long-input',
      placeholder: 'Enter detailed instructions for what data to extract from the page...',
      condition: { field: 'operation', value: 'extract' },
      required: true,
    },
    {
      id: 'schema',
      title: 'Schema',
      type: 'code',
      placeholder: 'Enter JSON Schema...',
      language: 'json',
      condition: { field: 'operation', value: 'extract' },
      required: true,
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert programmer specializing in creating JSON schemas for web scraping and data extraction.
Generate ONLY the JSON schema based on the user's request.
The output MUST be a single, valid JSON object, starting with { and ending with }.
The JSON object MUST have the following top-level properties: 'name' (string), 'description' (string), 'strict' (boolean, usually true), and 'schema' (object).
The 'schema' object must define the structure and MUST contain 'type': 'object', 'properties': {...}, 'additionalProperties': false, and 'required': [...].
Inside 'properties', use standard JSON Schema properties (type, description, enum, items for arrays, etc.).

Current schema: {context}

Do not include any explanations, markdown formatting, or other text outside the JSON object.

Valid Schema Examples:

Example 1 (Product Extraction):
{
    "name": "product_info",
    "description": "Extracts product information from an e-commerce page",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "The product name"
            },
            "price": {
                "type": "string",
                "description": "The product price"
            },
            "description": {
                "type": "string",
                "description": "The product description"
            }
        },
        "additionalProperties": false,
        "required": ["name", "price"]
    }
}

Example 2 (Article Extraction):
{
    "name": "article_content",
    "description": "Extracts article content from a news or blog page",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "The article headline"
            },
            "author": {
                "type": "string",
                "description": "The article author"
            },
            "publishDate": {
                "type": "string",
                "description": "The publication date"
            },
            "content": {
                "type": "string",
                "description": "The main article text"
            }
        },
        "additionalProperties": false,
        "required": ["title", "content"]
    }
}

Example 3 (List Extraction):
{
    "name": "search_results",
    "description": "Extracts search results or list items from a page",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "description": "List of extracted items",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Item title"
                        },
                        "url": {
                            "type": "string",
                            "description": "Item URL"
                        },
                        "snippet": {
                            "type": "string",
                            "description": "Brief description or snippet"
                        }
                    },
                    "additionalProperties": false,
                    "required": ["title"]
                }
            }
        },
        "additionalProperties": false,
        "required": ["items"]
    }
}
`,
        placeholder: 'Describe what data you want to extract from the webpage...',
        generationType: 'json-schema',
      },
    },
    // Agent operation fields
    {
      id: 'startUrl',
      title: 'Starting URL',
      type: 'short-input',
      placeholder: 'Enter the starting URL for the agent',
      condition: { field: 'operation', value: 'agent' },
      required: true,
    },
    {
      id: 'task',
      title: 'Task',
      type: 'long-input',
      placeholder:
        'Enter the task or goal for the agent to achieve. Reference variables using %key% syntax.',
      condition: { field: 'operation', value: 'agent' },
      required: true,
    },
    {
      id: 'variables',
      title: 'Variables',
      type: 'table',
      columns: ['Key', 'Value'],
      condition: { field: 'operation', value: 'agent' },
    },
    {
      id: 'outputSchema',
      title: 'Output Schema',
      type: 'code',
      placeholder: 'Enter JSON Schema...',
      language: 'json',
      condition: { field: 'operation', value: 'agent' },
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert programmer specializing in creating JSON schemas for web automation agents.
Generate ONLY the JSON schema based on the user's request.
The output MUST be a single, valid JSON object, starting with { and ending with }.
The JSON object MUST have the following top-level properties: 'name' (string), 'description' (string), 'strict' (boolean, usually true), and 'schema' (object).
The 'schema' object must define the structure and MUST contain 'type': 'object', 'properties': {...}, 'additionalProperties': false, and 'required': [...].
Inside 'properties', use standard JSON Schema properties (type, description, enum, items for arrays, etc.).

Current schema: {context}

Do not include any explanations, markdown formatting, or other text outside the JSON object.

Valid Schema Examples:

Example 1 (Login Result):
{
    "name": "login_result",
    "description": "Result of a login task performed by the agent",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "success": {
                "type": "boolean",
                "description": "Whether the login was successful"
            },
            "username": {
                "type": "string",
                "description": "The username that was logged in"
            },
            "dashboardUrl": {
                "type": "string",
                "description": "The URL of the dashboard after login"
            }
        },
        "additionalProperties": false,
        "required": ["success"]
    }
}

Example 2 (Form Submission):
{
    "name": "form_submission_result",
    "description": "Result of submitting a form",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "submitted": {
                "type": "boolean",
                "description": "Whether the form was submitted"
            },
            "confirmationNumber": {
                "type": "string",
                "description": "Confirmation or reference number if provided"
            },
            "errorMessage": {
                "type": "string",
                "description": "Error message if submission failed"
            }
        },
        "additionalProperties": false,
        "required": ["submitted"]
    }
}

Example 3 (Data Collection):
{
    "name": "collected_data",
    "description": "Data collected by the agent from multiple pages",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "description": "List of collected items",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "Item name"
                        },
                        "value": {
                            "type": "string",
                            "description": "Item value or content"
                        },
                        "sourceUrl": {
                            "type": "string",
                            "description": "URL where the item was found"
                        }
                    },
                    "additionalProperties": false,
                    "required": ["name"]
                }
            },
            "totalCount": {
                "type": "number",
                "description": "Total number of items collected"
            }
        },
        "additionalProperties": false,
        "required": ["items"]
    }
}
`,
        placeholder: 'Describe what output format you expect from the agent task...',
        generationType: 'json-schema',
      },
    },
    // Shared API key field
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your API key for the selected provider',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: ['stagehand_extract', 'stagehand_agent'],
    config: {
      tool: (params) => {
        return params.operation === 'agent' ? 'stagehand_agent' : 'stagehand_extract'
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation: extract or agent' },
    provider: { type: 'string', description: 'AI provider: openai or anthropic' },
    apiKey: { type: 'string', description: 'API key for the selected provider' },
    // Extract inputs
    url: { type: 'string', description: 'Website URL to extract (extract operation)' },
    instruction: { type: 'string', description: 'Extraction instructions (extract operation)' },
    schema: { type: 'json', description: 'JSON schema definition (extract operation)' },
    // Agent inputs
    startUrl: { type: 'string', description: 'Starting URL for agent (agent operation)' },
    task: { type: 'string', description: 'Task description (agent operation)' },
    variables: { type: 'json', description: 'Task variables (agent operation)' },
    outputSchema: { type: 'json', description: 'Output schema (agent operation)' },
  },
  outputs: {
    // Extract outputs
    data: { type: 'json', description: 'Extracted data (extract operation)' },
    // Agent outputs
    agentResult: { type: 'json', description: 'Agent execution result (agent operation)' },
    structuredOutput: { type: 'json', description: 'Structured output data (agent operation)' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: starter.ts]---
Location: sim-main/apps/sim/blocks/blocks/starter.ts

```typescript
import { StartIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'

export const StarterBlock: BlockConfig = {
  type: 'starter',
  name: 'Starter',
  description: 'Start workflow',
  longDescription: 'Initiate your workflow manually with optional structured input.',
  category: 'blocks',
  bgColor: '#2FB3FF',
  icon: StartIcon,
  hideFromToolbar: true,
  subBlocks: [
    // Main trigger selector
    {
      id: 'startWorkflow',
      title: 'Start Workflow',
      type: 'dropdown',
      options: [
        { label: 'Run manually', id: 'manual' },
        { label: 'Chat', id: 'chat' },
      ],
      value: () => 'manual',
    },
    // Structured Input format - visible if manual run is selected (advanced mode)
    {
      id: 'inputFormat',
      title: 'Input Format',
      type: 'input-format',
      description:
        'Name and Type define your input schema. Value is used only for manual test runs.',
      mode: 'advanced',
      condition: { field: 'startWorkflow', value: 'manual' },
    },
  ],
  tools: {
    access: [],
  },
  inputs: {
    input: { type: 'json', description: 'Workflow input data' },
  },
  outputs: {}, // No outputs - starter blocks initiate workflow execution
}
```

--------------------------------------------------------------------------------

---[FILE: start_trigger.ts]---
Location: sim-main/apps/sim/blocks/blocks/start_trigger.ts

```typescript
import { StartIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'

export const StartTriggerBlock: BlockConfig = {
  type: 'start_trigger',
  triggerAllowed: true,
  name: 'Start',
  description: 'Unified workflow entry point for chat, manual and API runs',
  longDescription:
    'Collect structured inputs and power manual runs, API executions, and deployed chat experiences from a single start block.',
  bestPractices: `
  - The Start block always exposes "input", "conversationId", and "files" fields for chat compatibility.
  - Add custom input format fields to collect additional structured data.
  - Test manual runs by pre-filling default values inside the input format fields.
  `,
  category: 'triggers',
  bgColor: '#34B5FF',
  icon: StartIcon,
  hideFromToolbar: false,
  subBlocks: [
    {
      id: 'inputFormat',
      title: 'Inputs',
      type: 'input-format',
      description: 'Add custom fields beyond the built-in input, conversationId, and files fields.',
    },
  ],
  tools: {
    access: [],
  },
  inputs: {},
  outputs: {},
  triggers: {
    enabled: true,
    available: ['chat', 'manual', 'api'],
  },
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 760
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 760 of 933)

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

---[FILE: check_command_exists.ts]---
Location: sim-main/apps/sim/tools/ssh/check_command_exists.ts

```typescript
import type { SSHCheckCommandExistsParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const checkCommandExistsTool: ToolConfig<SSHCheckCommandExistsParams, SSHResponse> = {
  id: 'ssh_check_command_exists',
  name: 'SSH Check Command Exists',
  description: 'Check if a command/program exists on the remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    commandName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Command name to check (e.g., docker, git, python3)',
    },
  },

  request: {
    url: '/api/tools/ssh/check-command-exists',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      commandName: params.commandName,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH check command exists failed')
    }

    return {
      success: true,
      output: {
        commandExists: data.exists ?? false,
        commandPath: data.path,
        version: data.version,
        message: data.message,
      },
    }
  },

  outputs: {
    commandExists: { type: 'boolean', description: 'Whether the command exists' },
    commandPath: { type: 'string', description: 'Full path to the command (if found)' },
    version: { type: 'string', description: 'Command version output (if applicable)' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: check_file_exists.ts]---
Location: sim-main/apps/sim/tools/ssh/check_file_exists.ts

```typescript
import type { SSHCheckFileExistsParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const checkFileExistsTool: ToolConfig<SSHCheckFileExistsParams, SSHResponse> = {
  id: 'ssh_check_file_exists',
  name: 'SSH Check File Exists',
  description: 'Check if a file or directory exists on the remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Remote file or directory path to check',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Expected type: file, directory, or any (default: any)',
    },
  },

  request: {
    url: '/api/tools/ssh/check-file-exists',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      path: params.path,
      type: params.type || 'any',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH check file exists failed')
    }

    return {
      success: true,
      output: {
        exists: data.exists ?? false,
        type: data.type || 'not_found',
        size: data.size,
        permissions: data.permissions,
        modified: data.modified,
        message: data.message,
      },
    }
  },

  outputs: {
    exists: { type: 'boolean', description: 'Whether the path exists' },
    type: { type: 'string', description: 'Type of path (file, directory, symlink, not_found)' },
    size: { type: 'number', description: 'File size if it is a file' },
    permissions: { type: 'string', description: 'File permissions (e.g., 0755)' },
    modified: { type: 'string', description: 'Last modified timestamp' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_directory.ts]---
Location: sim-main/apps/sim/tools/ssh/create_directory.ts

```typescript
import type { SSHCreateDirectoryParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const createDirectoryTool: ToolConfig<SSHCreateDirectoryParams, SSHResponse> = {
  id: 'ssh_create_directory',
  name: 'SSH Create Directory',
  description: 'Create a directory on the remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Directory path to create',
    },
    recursive: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Create parent directories if they do not exist (default: true)',
    },
    permissions: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Directory permissions (default: 0755)',
    },
  },

  request: {
    url: '/api/tools/ssh/create-directory',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      path: params.path,
      recursive: params.recursive !== false,
      permissions: params.permissions || '0755',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH create directory failed')
    }

    return {
      success: true,
      output: {
        created: data.created ?? true,
        remotePath: data.path,
        alreadyExists: data.alreadyExists ?? false,
        message: data.message,
      },
    }
  },

  outputs: {
    created: { type: 'boolean', description: 'Whether the directory was created successfully' },
    remotePath: { type: 'string', description: 'Created directory path' },
    alreadyExists: { type: 'boolean', description: 'Whether the directory already existed' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_file.ts]---
Location: sim-main/apps/sim/tools/ssh/delete_file.ts

```typescript
import type { SSHDeleteFileParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const deleteFileTool: ToolConfig<SSHDeleteFileParams, SSHResponse> = {
  id: 'ssh_delete_file',
  name: 'SSH Delete File',
  description: 'Delete a file or directory from the remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Path to delete',
    },
    recursive: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Recursively delete directories (default: false)',
    },
    force: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Force deletion without confirmation (default: false)',
    },
  },

  request: {
    url: '/api/tools/ssh/delete-file',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      path: params.path,
      recursive: params.recursive === true,
      force: params.force === true,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH delete file failed')
    }

    return {
      success: true,
      output: {
        deleted: data.deleted ?? true,
        remotePath: data.path,
        message: data.message,
      },
    }
  },

  outputs: {
    deleted: { type: 'boolean', description: 'Whether the path was deleted successfully' },
    remotePath: { type: 'string', description: 'Deleted path' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: download_file.ts]---
Location: sim-main/apps/sim/tools/ssh/download_file.ts

```typescript
import type { SSHDownloadFileParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const downloadFileTool: ToolConfig<SSHDownloadFileParams, SSHResponse> = {
  id: 'ssh_download_file',
  name: 'SSH Download File',
  description: 'Download a file from a remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    remotePath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Path of the file on the remote server',
    },
  },

  request: {
    url: '/api/tools/ssh/download-file',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      remotePath: params.remotePath,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH file download failed')
    }

    return {
      success: true,
      output: {
        downloaded: true,
        fileContent: data.content,
        fileName: data.fileName,
        remotePath: data.remotePath,
        size: data.size,
        message: data.message,
      },
    }
  },

  outputs: {
    downloaded: { type: 'boolean', description: 'Whether the file was downloaded successfully' },
    fileContent: { type: 'string', description: 'File content (base64 encoded for binary files)' },
    fileName: { type: 'string', description: 'Name of the downloaded file' },
    remotePath: { type: 'string', description: 'Source path on the remote server' },
    size: { type: 'number', description: 'File size in bytes' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: execute_command.ts]---
Location: sim-main/apps/sim/tools/ssh/execute_command.ts

```typescript
import type { SSHExecuteCommandParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const executeCommandTool: ToolConfig<SSHExecuteCommandParams, SSHResponse> = {
  id: 'ssh_execute_command',
  name: 'SSH Execute Command',
  description: 'Execute a shell command on a remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    command: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Shell command to execute on the remote server',
    },
    workingDirectory: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Working directory for command execution',
    },
  },

  request: {
    url: '/api/tools/ssh/execute-command',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      command: params.command,
      workingDirectory: params.workingDirectory,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH command execution failed')
    }

    return {
      success: true,
      output: {
        stdout: data.stdout || '',
        stderr: data.stderr || '',
        exitCode: data.exitCode ?? 0,
        success: data.exitCode === 0,
        message: data.message,
      },
    }
  },

  outputs: {
    stdout: { type: 'string', description: 'Standard output from command' },
    stderr: { type: 'string', description: 'Standard error output' },
    exitCode: { type: 'number', description: 'Command exit code' },
    success: { type: 'boolean', description: 'Whether command succeeded (exit code 0)' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: execute_script.ts]---
Location: sim-main/apps/sim/tools/ssh/execute_script.ts

```typescript
import type { SSHExecuteScriptParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const executeScriptTool: ToolConfig<SSHExecuteScriptParams, SSHResponse> = {
  id: 'ssh_execute_script',
  name: 'SSH Execute Script',
  description: 'Upload and execute a multi-line script on a remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    script: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Script content to execute (bash, python, etc.)',
    },
    interpreter: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Script interpreter (default: /bin/bash)',
    },
    workingDirectory: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Working directory for script execution',
    },
  },

  request: {
    url: '/api/tools/ssh/execute-script',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      script: params.script,
      interpreter: params.interpreter || '/bin/bash',
      workingDirectory: params.workingDirectory,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH script execution failed')
    }

    return {
      success: true,
      output: {
        stdout: data.stdout || '',
        stderr: data.stderr || '',
        exitCode: data.exitCode ?? 0,
        success: data.exitCode === 0,
        scriptPath: data.scriptPath,
        message: data.message,
      },
    }
  },

  outputs: {
    stdout: { type: 'string', description: 'Standard output from script' },
    stderr: { type: 'string', description: 'Standard error output' },
    exitCode: { type: 'number', description: 'Script exit code' },
    success: { type: 'boolean', description: 'Whether script succeeded (exit code 0)' },
    scriptPath: { type: 'string', description: 'Temporary path where script was uploaded' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_system_info.ts]---
Location: sim-main/apps/sim/tools/ssh/get_system_info.ts

```typescript
import type { SSHGetSystemInfoParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const getSystemInfoTool: ToolConfig<SSHGetSystemInfoParams, SSHResponse> = {
  id: 'ssh_get_system_info',
  name: 'SSH Get System Info',
  description: 'Retrieve system information from the remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
  },

  request: {
    url: '/api/tools/ssh/get-system-info',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH get system info failed')
    }

    return {
      success: true,
      output: {
        hostname: data.hostname,
        os: data.os,
        architecture: data.architecture,
        uptime: data.uptime,
        memory: data.memory,
        diskSpace: data.diskSpace,
        message: data.message,
      },
    }
  },

  outputs: {
    hostname: { type: 'string', description: 'Server hostname' },
    os: { type: 'string', description: 'Operating system (e.g., Linux, Darwin)' },
    architecture: { type: 'string', description: 'CPU architecture (e.g., x64, arm64)' },
    uptime: { type: 'number', description: 'System uptime in seconds' },
    memory: {
      type: 'json',
      description: 'Memory information (total, free, used)',
    },
    diskSpace: {
      type: 'json',
      description: 'Disk space information (total, free, used)',
    },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/ssh/index.ts

```typescript
import { checkCommandExistsTool } from './check_command_exists'
import { checkFileExistsTool } from './check_file_exists'
import { createDirectoryTool } from './create_directory'
import { deleteFileTool } from './delete_file'
import { downloadFileTool } from './download_file'
import { executeCommandTool } from './execute_command'
import { executeScriptTool } from './execute_script'
import { getSystemInfoTool } from './get_system_info'
import { listDirectoryTool } from './list_directory'
import { moveRenameTool } from './move_rename'
import { readFileContentTool } from './read_file_content'
import { uploadFileTool } from './upload_file'
import { writeFileContentTool } from './write_file_content'

export const sshCheckCommandExistsTool = checkCommandExistsTool
export const sshCheckFileExistsTool = checkFileExistsTool
export const sshCreateDirectoryTool = createDirectoryTool
export const sshDeleteFileTool = deleteFileTool
export const sshDownloadFileTool = downloadFileTool
export const sshExecuteCommandTool = executeCommandTool
export const sshExecuteScriptTool = executeScriptTool
export const sshGetSystemInfoTool = getSystemInfoTool
export const sshListDirectoryTool = listDirectoryTool
export const sshMoveRenameTool = moveRenameTool
export const sshReadFileContentTool = readFileContentTool
export const sshUploadFileTool = uploadFileTool
export const sshWriteFileContentTool = writeFileContentTool
```

--------------------------------------------------------------------------------

---[FILE: list_directory.ts]---
Location: sim-main/apps/sim/tools/ssh/list_directory.ts

```typescript
import type { SSHListDirectoryParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const listDirectoryTool: ToolConfig<SSHListDirectoryParams, SSHResponse> = {
  id: 'ssh_list_directory',
  name: 'SSH List Directory',
  description: 'List files and directories in a remote directory',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Remote directory path to list',
    },
    detailed: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include file details (size, permissions, modified date)',
    },
    recursive: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'List subdirectories recursively (default: false)',
    },
  },

  request: {
    url: '/api/tools/ssh/list-directory',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      path: params.path,
      detailed: params.detailed !== false,
      recursive: params.recursive === true,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH list directory failed')
    }

    return {
      success: true,
      output: {
        entries: data.entries || [],
        totalFiles: data.totalFiles || 0,
        totalDirectories: data.totalDirectories || 0,
        message: data.message,
      },
    }
  },

  outputs: {
    entries: {
      type: 'array',
      description: 'Array of file and directory entries',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'File or directory name' },
          type: { type: 'string', description: 'Entry type (file, directory, symlink)' },
          size: { type: 'number', description: 'File size in bytes' },
          permissions: { type: 'string', description: 'File permissions' },
          modified: { type: 'string', description: 'Last modified timestamp' },
        },
      },
    },
    totalFiles: { type: 'number', description: 'Total number of files' },
    totalDirectories: { type: 'number', description: 'Total number of directories' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: move_rename.ts]---
Location: sim-main/apps/sim/tools/ssh/move_rename.ts

```typescript
import type { SSHMoveRenameParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const moveRenameTool: ToolConfig<SSHMoveRenameParams, SSHResponse> = {
  id: 'ssh_move_rename',
  name: 'SSH Move/Rename',
  description: 'Move or rename a file or directory on the remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    sourcePath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Current path of the file or directory',
    },
    destinationPath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'New path for the file or directory',
    },
    overwrite: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Overwrite destination if it exists (default: false)',
    },
  },

  request: {
    url: '/api/tools/ssh/move-rename',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      sourcePath: params.sourcePath,
      destinationPath: params.destinationPath,
      overwrite: params.overwrite === true,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH move/rename failed')
    }

    return {
      success: true,
      output: {
        moved: data.success ?? true,
        sourcePath: data.sourcePath,
        destinationPath: data.destinationPath,
        message: data.message,
      },
    }
  },

  outputs: {
    moved: { type: 'boolean', description: 'Whether the operation was successful' },
    sourcePath: { type: 'string', description: 'Original path' },
    destinationPath: { type: 'string', description: 'New path' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read_file_content.ts]---
Location: sim-main/apps/sim/tools/ssh/read_file_content.ts

```typescript
import type { SSHReadFileContentParams, SSHResponse } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const readFileContentTool: ToolConfig<SSHReadFileContentParams, SSHResponse> = {
  id: 'ssh_read_file_content',
  name: 'SSH Read File Content',
  description: 'Read the contents of a remote file',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Remote file path to read',
    },
    encoding: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'File encoding (default: utf-8)',
    },
    maxSize: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum file size to read in MB (default: 10)',
    },
  },

  request: {
    url: '/api/tools/ssh/read-file-content',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      path: params.path,
      encoding: params.encoding || 'utf-8',
      maxSize: params.maxSize || 10,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH read file content failed')
    }

    return {
      success: true,
      output: {
        content: data.content,
        size: data.size,
        lines: data.lines,
        remotePath: data.path,
        message: data.message,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'File content as string' },
    size: { type: 'number', description: 'File size in bytes' },
    lines: { type: 'number', description: 'Number of lines in file' },
    remotePath: { type: 'string', description: 'Remote file path' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

````

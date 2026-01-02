---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 91
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 91 of 933)

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

---[FILE: sqs.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/sqs.mdx

```text
---
title: Amazon SQS
description: Connect to Amazon SQS
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sqs"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications. SQS eliminates the complexity and overhead associated with managing and operating message-oriented middleware, and empowers developers to focus on differentiating work.

With Amazon SQS, you can:

- **Send messages**: Publish messages to queues for asynchronous processing
- **Decouple applications**: Enable loose coupling between components of your system
- **Scale workloads**: Handle variable workloads without provisioning infrastructure
- **Ensure reliability**: Built-in redundancy and high availability
- **Support FIFO queues**: Maintain strict message ordering and exactly-once processing

In Sim, the SQS integration enables your agents to send messages to Amazon SQS queues securely and programmatically. Supported operations include:

- **Send Message**: Send messages to SQS queues with optional message group ID and deduplication ID for FIFO queues

This integration allows your agents to automate message sending workflows without manual intervention. By connecting Sim with Amazon SQS, you can build agents that publish messages to queues within your workflows—all without handling queue infrastructure or connections.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Amazon SQS into the workflow. Can send messages to SQS queues.



## Tools

### `sqs_send`

Send a message to an Amazon SQS queue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `queueUrl` | string | Yes | Queue URL |
| `data` | object | Yes | Message body to send |
| `messageGroupId` | string | No | Message group ID \(optional\) |
| `messageDeduplicationId` | string | No | Message deduplication ID \(optional\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `id` | string | Message ID |



## Notes

- Category: `tools`
- Type: `sqs`
```

--------------------------------------------------------------------------------

---[FILE: ssh.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/ssh.mdx

```text
---
title: SSH
description: Connect to remote servers via SSH
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ssh"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[SSH (Secure Shell)](https://en.wikipedia.org/wiki/Secure_Shell) is a widely-used protocol for securely connecting to remote servers, allowing you to execute commands, transfer files, and manage systems over encrypted channels.

With SSH support in Sim, your agents can:

- **Execute remote commands**: Run shell commands on any SSH-accessible server
- **Upload and run scripts**: Easily transfer and execute multi-line scripts for advanced automation
- **Transfer files securely**: Upload and download files as part of your workflows (coming soon or via command)
- **Automate server management**: Perform updates, maintenance, monitoring, deployments, and configuration tasks programmatically
- **Use flexible authentication**: Connect with password or private key authentication, including support for encrypted keys

The following Sim SSH tools enable your agents to interact with servers as part of larger automations:

- `ssh_execute_command`: Run any single shell command remotely and capture output, status, and errors.
- `ssh_execute_script`: Upload and execute a full multi-line script on the remote system.
- (Additional tools coming soon, such as file transfer.)

By integrating SSH into your agent workflows, you can automate secure access, remote operations, and server orchestration—streamlining DevOps, IT automation, and custom remote management, all from within Sim.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Execute commands, transfer files, and manage remote servers via SSH. Supports password and private key authentication for secure server access.



## Tools

### `ssh_execute_command`

Execute a shell command on a remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `command` | string | Yes | Shell command to execute on the remote server |
| `workingDirectory` | string | No | Working directory for command execution |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `stdout` | string | Standard output from command |
| `stderr` | string | Standard error output |
| `exitCode` | number | Command exit code |
| `success` | boolean | Whether command succeeded \(exit code 0\) |
| `message` | string | Operation status message |

### `ssh_execute_script`

Upload and execute a multi-line script on a remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `script` | string | Yes | Script content to execute \(bash, python, etc.\) |
| `interpreter` | string | No | Script interpreter \(default: /bin/bash\) |
| `workingDirectory` | string | No | Working directory for script execution |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `stdout` | string | Standard output from script |
| `stderr` | string | Standard error output |
| `exitCode` | number | Script exit code |
| `success` | boolean | Whether script succeeded \(exit code 0\) |
| `scriptPath` | string | Temporary path where script was uploaded |
| `message` | string | Operation status message |

### `ssh_check_command_exists`

Check if a command/program exists on the remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `commandName` | string | Yes | Command name to check \(e.g., docker, git, python3\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `commandExists` | boolean | Whether the command exists |
| `commandPath` | string | Full path to the command \(if found\) |
| `version` | string | Command version output \(if applicable\) |
| `message` | string | Operation status message |

### `ssh_upload_file`

Upload a file to a remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `fileContent` | string | Yes | File content to upload \(base64 encoded for binary files\) |
| `fileName` | string | Yes | Name of the file being uploaded |
| `remotePath` | string | Yes | Destination path on the remote server |
| `permissions` | string | No | File permissions \(e.g., 0644\) |
| `overwrite` | boolean | No | Whether to overwrite existing files \(default: true\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `uploaded` | boolean | Whether the file was uploaded successfully |
| `remotePath` | string | Final path on the remote server |
| `size` | number | File size in bytes |
| `message` | string | Operation status message |

### `ssh_download_file`

Download a file from a remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `remotePath` | string | Yes | Path of the file on the remote server |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `downloaded` | boolean | Whether the file was downloaded successfully |
| `fileContent` | string | File content \(base64 encoded for binary files\) |
| `fileName` | string | Name of the downloaded file |
| `remotePath` | string | Source path on the remote server |
| `size` | number | File size in bytes |
| `message` | string | Operation status message |

### `ssh_list_directory`

List files and directories in a remote directory

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `path` | string | Yes | Remote directory path to list |
| `detailed` | boolean | No | Include file details \(size, permissions, modified date\) |
| `recursive` | boolean | No | List subdirectories recursively \(default: false\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `entries` | array | Array of file and directory entries |

### `ssh_check_file_exists`

Check if a file or directory exists on the remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `path` | string | Yes | Remote file or directory path to check |
| `type` | string | No | Expected type: file, directory, or any \(default: any\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `exists` | boolean | Whether the path exists |
| `type` | string | Type of path \(file, directory, symlink, not_found\) |
| `size` | number | File size if it is a file |
| `permissions` | string | File permissions \(e.g., 0755\) |
| `modified` | string | Last modified timestamp |
| `message` | string | Operation status message |

### `ssh_create_directory`

Create a directory on the remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `path` | string | Yes | Directory path to create |
| `recursive` | boolean | No | Create parent directories if they do not exist \(default: true\) |
| `permissions` | string | No | Directory permissions \(default: 0755\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `created` | boolean | Whether the directory was created successfully |
| `remotePath` | string | Created directory path |
| `alreadyExists` | boolean | Whether the directory already existed |
| `message` | string | Operation status message |

### `ssh_delete_file`

Delete a file or directory from the remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `path` | string | Yes | Path to delete |
| `recursive` | boolean | No | Recursively delete directories \(default: false\) |
| `force` | boolean | No | Force deletion without confirmation \(default: false\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Whether the path was deleted successfully |
| `remotePath` | string | Deleted path |
| `message` | string | Operation status message |

### `ssh_move_rename`

Move or rename a file or directory on the remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `sourcePath` | string | Yes | Current path of the file or directory |
| `destinationPath` | string | Yes | New path for the file or directory |
| `overwrite` | boolean | No | Overwrite destination if it exists \(default: false\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `moved` | boolean | Whether the operation was successful |
| `sourcePath` | string | Original path |
| `destinationPath` | string | New path |
| `message` | string | Operation status message |

### `ssh_get_system_info`

Retrieve system information from the remote SSH server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `hostname` | string | Server hostname |
| `os` | string | Operating system \(e.g., Linux, Darwin\) |
| `architecture` | string | CPU architecture \(e.g., x64, arm64\) |
| `uptime` | number | System uptime in seconds |
| `memory` | json | Memory information \(total, free, used\) |
| `diskSpace` | json | Disk space information \(total, free, used\) |
| `message` | string | Operation status message |

### `ssh_read_file_content`

Read the contents of a remote file

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `path` | string | Yes | Remote file path to read |
| `encoding` | string | No | File encoding \(default: utf-8\) |
| `maxSize` | number | No | Maximum file size to read in MB \(default: 10\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | File content as string |
| `size` | number | File size in bytes |
| `lines` | number | Number of lines in file |
| `remotePath` | string | Remote file path |
| `message` | string | Operation status message |

### `ssh_write_file_content`

Write or append content to a remote file

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | SSH server hostname or IP address |
| `port` | number | Yes | SSH server port \(default: 22\) |
| `username` | string | Yes | SSH username |
| `password` | string | No | Password for authentication \(if not using private key\) |
| `privateKey` | string | No | Private key for authentication \(OpenSSH format\) |
| `passphrase` | string | No | Passphrase for encrypted private key |
| `path` | string | Yes | Remote file path to write to |
| `content` | string | Yes | Content to write to the file |
| `mode` | string | No | Write mode: overwrite, append, or create \(default: overwrite\) |
| `permissions` | string | No | File permissions \(e.g., 0644\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `written` | boolean | Whether the file was written successfully |
| `remotePath` | string | File path |
| `size` | number | Final file size in bytes |
| `message` | string | Operation status message |



## Notes

- Category: `tools`
- Type: `ssh`
```

--------------------------------------------------------------------------------

---[FILE: stagehand.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/stagehand.mdx

```text
---
title: Stagehand
description: Web automation and data extraction
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stagehand"
  color="#FFC83C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Stagehand](https://stagehand.com) is a tool that enables both extraction of structured data from webpages and autonomous web automation using Browserbase and modern LLMs (OpenAI or Anthropic).

Stagehand offers two main capabilities in Sim:

- **stagehand_extract**: Extract structured data from a single webpage. You specify what you want (a schema), and the AI retrieves and parses the data in that shape from the page. This is best for extracting lists, fields, or objects when you know exactly what information you need and where to get it.

- **stagehand_agent**: Run an autonomous web agent capable of completing multi-step tasks, interacting with elements, navigating between pages, and returning structured results. This is much more flexible: the agent can do things like log in, search, fill forms, gather data from multiple places, and output a final result according to a requested schema.

**Key Differences:**

- *stagehand_extract* is a rapid “extract this data from this page” operation. It works best for direct, one-step extraction tasks.
- *stagehand_agent* performs complex, multi-step autonomous tasks on the web — such as navigation, searching, or even transactions — and can dynamically extract data according to your instructions and an optional schema.

In practice, use **stagehand_extract** when you know what you want and where, and use **stagehand_agent** when you need a bot to think through and execute interactive workflows.

By integrating Stagehand, Sim agents can automate data gathering, analysis, and workflow execution on the web: updating databases, organizing information, and generating custom reports—seamlessly and autonomously.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Stagehand into the workflow. Can extract structured data from webpages or run an autonomous agent to perform tasks.



## Tools

### `stagehand_extract`

Extract structured data from a webpage using Stagehand

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | URL of the webpage to extract data from |
| `instruction` | string | Yes | Instructions for extraction |
| `provider` | string | No | AI provider to use: openai or anthropic |
| `apiKey` | string | Yes | API key for the selected provider |
| `schema` | json | Yes | JSON schema defining the structure of the data to extract |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | object | Extracted structured data matching the provided schema |

### `stagehand_agent`

Run an autonomous web agent to complete tasks and extract structured data

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `startUrl` | string | Yes | URL of the webpage to start the agent on |
| `task` | string | Yes | The task to complete or goal to achieve on the website |
| `variables` | json | No | Optional variables to substitute in the task \(format: \{key: value\}\). Reference in task using %key% |
| `format` | string | No | No description |
| `provider` | string | No | AI provider to use: openai or anthropic |
| `apiKey` | string | Yes | API key for the selected provider |
| `outputSchema` | json | No | Optional JSON schema defining the structure of data the agent should return |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `agentResult` | object | Result from the Stagehand agent execution |



## Notes

- Category: `tools`
- Type: `stagehand`
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:37Z
part: 926
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 926 of 933)

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

---[FILE: register-sso-provider.ts]---
Location: sim-main/packages/db/scripts/register-sso-provider.ts

```typescript
#!/usr/bin/env bun

/**
 * Direct Database SSO Registration Script (Better Auth Best Practice)
 *
 * This script bypasses the authentication requirement by directly inserting
 * SSO provider records into the database, following the exact same logic
 * as Better Auth's registerSSOProvider endpoint.
 *
 * Usage: bun run packages/db/register-sso-provider.ts
 *
 * Required Environment Variables:
 *   SSO_ENABLED=true
 *   SSO_PROVIDER_TYPE=oidc|saml
 *   SSO_PROVIDER_ID=your-provider-id
 *   SSO_ISSUER=https://your-idp-url
 *   SSO_DOMAIN=your-email-domain.com
 *   SSO_USER_EMAIL=admin@yourdomain.com (must be existing user)
 *
 * OIDC Providers:
 *   SSO_OIDC_CLIENT_ID=your_client_id
 *   SSO_OIDC_CLIENT_SECRET=your_client_secret
 *   SSO_OIDC_SCOPES=openid,profile,email (optional)
 *
 * SAML Providers:
 *   SSO_SAML_ENTRY_POINT=https://your-idp/sso
 *   SSO_SAML_CERT=your-certificate-pem-string
 *   SSO_SAML_CALLBACK_URL=https://yourdomain.com/api/auth/sso/saml2/callback/provider-id
 *   SSO_SAML_SP_METADATA=<custom-sp-metadata-xml> (optional, auto-generated if not provided)
 *   SSO_SAML_IDP_METADATA=<idp-metadata-xml> (optional)
 *   SSO_SAML_AUDIENCE=https://yourdomain.com (optional, defaults to SSO_ISSUER)
 *   SSO_SAML_WANT_ASSERTIONS_SIGNED=true (optional, defaults to false)
 */

import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { v4 as uuidv4 } from 'uuid'
import { ssoProvider, user } from '../schema'

// Self-contained SSO types (matching Better Auth's structure)
interface SSOMapping {
  id: string
  email: string
  name: string
  image?: string
}

interface OIDCConfig {
  clientId: string
  clientSecret: string
  scopes?: string[]
  pkce?: boolean
  authorizationEndpoint?: string
  tokenEndpoint?: string
  userInfoEndpoint?: string
  jwksEndpoint?: string
  discoveryEndpoint?: string
  tokenEndpointAuthentication?: 'client_secret_post' | 'client_secret_basic'
}

interface SAMLConfig {
  issuer?: string
  entryPoint: string
  cert: string
  callbackUrl?: string
  audience?: string
  wantAssertionsSigned?: boolean
  signatureAlgorithm?: string
  digestAlgorithm?: string
  identifierFormat?: string
  idpMetadata?: {
    metadata?: string
    entityID?: string
    cert?: string
    privateKey?: string
    privateKeyPass?: string
    isAssertionEncrypted?: boolean
    encPrivateKey?: string
    encPrivateKeyPass?: string
    singleSignOnService?: Array<{
      Binding: string
      Location: string
    }>
  }
  spMetadata?: {
    metadata?: string
    entityID?: string
    binding?: string
    privateKey?: string
    privateKeyPass?: string
    isAssertionEncrypted?: boolean
    encPrivateKey?: string
    encPrivateKeyPass?: string
  }
  privateKey?: string
  decryptionPvk?: string
  additionalParams?: Record<string, unknown>
}

interface SSOProviderConfig {
  providerId: string
  issuer: string
  domain: string
  providerType: 'oidc' | 'saml'
  mapping?: SSOMapping
  oidcConfig?: OIDCConfig
  samlConfig?: SAMLConfig
}

// Simple console logger (no dependencies)
const logger = {
  info: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString()
    console.log(
      `[${timestamp}] [INFO] [RegisterSSODB] ${message}`,
      meta ? JSON.stringify(meta, null, 2) : ''
    )
  },
  error: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString()
    console.error(
      `[${timestamp}] [ERROR] [RegisterSSODB] ${message}`,
      meta ? JSON.stringify(meta, null, 2) : ''
    )
  },
  warn: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString()
    console.warn(
      `[${timestamp}] [WARN] [RegisterSSODB] ${message}`,
      meta ? JSON.stringify(meta, null, 2) : ''
    )
  },
}

// Get database URL from environment
const CONNECTION_STRING = process.env.POSTGRES_URL ?? process.env.DATABASE_URL
if (!CONNECTION_STRING) {
  console.error('❌ POSTGRES_URL or DATABASE_URL environment variable is required')
  process.exit(1)
}

// Initialize database connection (following migration script pattern)
const postgresClient = postgres(CONNECTION_STRING, {
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 30,
  max: 10,
  onnotice: () => {},
})
const db = drizzle(postgresClient)

interface SSOProviderData {
  id: string
  issuer: string
  domain: string
  oidcConfig?: string
  samlConfig?: string
  userId: string
  providerId: string
  organizationId?: string
}

// Self-contained configuration builder (no external dependencies)
function buildSSOConfigFromEnv(): SSOProviderConfig | null {
  const enabled = process.env.SSO_ENABLED === 'true'
  if (!enabled) return null

  const providerId = process.env.SSO_PROVIDER_ID
  const issuer = process.env.SSO_ISSUER
  const domain = process.env.SSO_DOMAIN
  const providerType = process.env.SSO_PROVIDER_TYPE as 'oidc' | 'saml'

  if (!providerId || !issuer || !domain || !providerType) {
    return null
  }

  const config: SSOProviderConfig = {
    providerId,
    issuer,
    domain,
    providerType,
  }

  // Build field mapping
  config.mapping = {
    id:
      process.env.SSO_MAPPING_ID ||
      (providerType === 'oidc'
        ? 'sub'
        : 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'),
    email:
      process.env.SSO_MAPPING_EMAIL ||
      (providerType === 'oidc'
        ? 'email'
        : 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'),
    name:
      process.env.SSO_MAPPING_NAME ||
      (providerType === 'oidc'
        ? 'name'
        : 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'),
    image: process.env.SSO_MAPPING_IMAGE || (providerType === 'oidc' ? 'picture' : undefined),
  }

  // Build provider-specific configuration
  if (providerType === 'oidc') {
    const clientId = process.env.SSO_OIDC_CLIENT_ID
    const clientSecret = process.env.SSO_OIDC_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return null
    }

    config.oidcConfig = {
      clientId,
      clientSecret,
      scopes: process.env.SSO_OIDC_SCOPES?.split(',').map((s) => s.trim()) || [
        'openid',
        'profile',
        'email',
      ],
      pkce: process.env.SSO_OIDC_PKCE !== 'false',
      authorizationEndpoint: process.env.SSO_OIDC_AUTHORIZATION_ENDPOINT,
      tokenEndpoint: process.env.SSO_OIDC_TOKEN_ENDPOINT,
      userInfoEndpoint: process.env.SSO_OIDC_USERINFO_ENDPOINT,
      jwksEndpoint: process.env.SSO_OIDC_JWKS_ENDPOINT,
      discoveryEndpoint:
        process.env.SSO_OIDC_DISCOVERY_ENDPOINT || `${issuer}/.well-known/openid-configuration`,
    }
  } else if (providerType === 'saml') {
    const entryPoint = process.env.SSO_SAML_ENTRY_POINT
    const cert = process.env.SSO_SAML_CERT

    if (!entryPoint || !cert) {
      return null
    }

    const callbackUrl = process.env.SSO_SAML_CALLBACK_URL || `${issuer}/callback`

    // Use custom metadata if provided, otherwise generate default
    let spMetadata = process.env.SSO_SAML_SP_METADATA
    if (!spMetadata) {
      spMetadata = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${issuer}">
  <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${callbackUrl}" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`
    }

    config.samlConfig = {
      issuer,
      entryPoint,
      cert,
      callbackUrl,
      audience: process.env.SSO_SAML_AUDIENCE || issuer,
      wantAssertionsSigned: process.env.SSO_SAML_WANT_ASSERTIONS_SIGNED === 'true',
      signatureAlgorithm: process.env.SSO_SAML_SIGNATURE_ALGORITHM,
      digestAlgorithm: process.env.SSO_SAML_DIGEST_ALGORITHM,
      identifierFormat: process.env.SSO_SAML_IDENTIFIER_FORMAT,
      spMetadata: {
        metadata: spMetadata,
        entityID: issuer,
      },
    }
    // Optionally include IDP metadata if provided
    const idpMetadata = process.env.SSO_SAML_IDP_METADATA
    if (idpMetadata) {
      config.samlConfig.idpMetadata = {
        metadata: idpMetadata,
      }
    }
  }

  return config
}

// Self-contained example environment variables function
function getExampleEnvVars(
  providerType: 'oidc' | 'saml',
  provider?: string
): Record<string, string> {
  const baseVars = {
    SSO_ENABLED: 'true',
    SSO_PROVIDER_TYPE: providerType,
    SSO_PROVIDER_ID: provider || (providerType === 'oidc' ? 'okta' : 'adfs'),
    SSO_DOMAIN: 'yourcompany.com',
    SSO_USER_EMAIL: 'admin@yourcompany.com',
  }

  if (providerType === 'oidc') {
    const examples: Record<string, Record<string, string>> = {
      okta: {
        ...baseVars,
        SSO_PROVIDER_ID: 'okta',
        SSO_ISSUER: 'https://dev-123456.okta.com/oauth2/default',
        SSO_OIDC_CLIENT_ID: '0oavhncxymgOpe06E697',
        SSO_OIDC_CLIENT_SECRET: 'your-client-secret',
        SSO_OIDC_SCOPES: 'openid,profile,email',
      },
      'azure-ad': {
        ...baseVars,
        SSO_PROVIDER_ID: 'azure-ad',
        SSO_ISSUER: 'https://login.microsoftonline.com/{tenant-id}/v2.0',
        SSO_OIDC_CLIENT_ID: 'your-application-id',
        SSO_OIDC_CLIENT_SECRET: 'your-client-secret',
        SSO_MAPPING_ID: 'oid',
      },
      generic: {
        ...baseVars,
        SSO_PROVIDER_ID: 'custom-oidc',
        SSO_ISSUER: 'https://idp.example.com',
        SSO_OIDC_CLIENT_ID: 'your-client-id',
        SSO_OIDC_CLIENT_SECRET: 'your-client-secret',
        SSO_OIDC_AUTHORIZATION_ENDPOINT: 'https://idp.example.com/auth',
        SSO_OIDC_TOKEN_ENDPOINT: 'https://idp.example.com/token',
        SSO_OIDC_USERINFO_ENDPOINT: 'https://idp.example.com/userinfo',
      },
    }
    return examples[provider || 'okta'] || examples.generic
  }

  return {
    ...baseVars,
    SSO_PROVIDER_ID: 'adfs',
    SSO_ISSUER: 'https://adfs.company.com',
    SSO_SAML_ENTRY_POINT: 'https://adfs.company.com/adfs/ls/',
    SSO_SAML_CERT:
      '-----BEGIN CERTIFICATE-----\nMIIDBjCCAe4CAQAwDQYJKoZIhvcNAQEFBQAwEjEQMA4GA1UEAwwHYWRmcy...\n-----END CERTIFICATE-----',
    SSO_SAML_AUDIENCE: 'https://yourapp.com',
    SSO_SAML_WANT_ASSERTIONS_SIGNED: 'true',
    SSO_MAPPING_ID: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
    SSO_MAPPING_EMAIL: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    SSO_MAPPING_NAME: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  }
}

async function getAdminUser(): Promise<{ id: string; email: string } | null> {
  const adminEmail = process.env.SSO_USER_EMAIL
  if (!adminEmail) {
    logger.error('SSO_USER_EMAIL is required to identify the admin user')
    return null
  }

  try {
    const users = await db.select().from(user).where(eq(user.email, adminEmail))
    if (users.length === 0) {
      logger.error(`No user found with email: ${adminEmail}`)
      logger.error('Please ensure this user exists in your database first')
      return null
    }
    return { id: users[0].id, email: users[0].email }
  } catch (error) {
    logger.error('Failed to query user:', error)
    return null
  }
}

async function registerSSOProvider(): Promise<boolean> {
  try {
    // Build configuration from environment variables
    const ssoConfig = buildSSOConfigFromEnv()

    if (!ssoConfig) {
      logger.error('❌ No valid SSO configuration found in environment variables')
      logger.error('')
      logger.error('📝 Required environment variables:')
      logger.error('For OIDC providers (like Okta, Azure AD):')
      const oidcExample = getExampleEnvVars('oidc', 'okta')
      for (const [key, value] of Object.entries(oidcExample)) {
        logger.error(`  ${key}=${value}`)
      }
      logger.error('  SSO_USER_EMAIL=admin@yourdomain.com')
      logger.error('')
      logger.error('For SAML providers (like ADFS):')
      const samlExample = getExampleEnvVars('saml')
      for (const [key, value] of Object.entries(samlExample)) {
        logger.error(`  ${key}=${value}`)
      }
      logger.error('  SSO_USER_EMAIL=admin@yourdomain.com')
      return false
    }

    // Get admin user
    const adminUser = await getAdminUser()
    if (!adminUser) {
      return false
    }

    logger.info('Registering SSO provider directly in database...', {
      providerId: ssoConfig.providerId,
      providerType: ssoConfig.providerType,
      domain: ssoConfig.domain,
      adminUser: adminUser.email,
    })

    // Validate issuer URL (same as Better Auth does)
    try {
      new URL(ssoConfig.issuer)
    } catch {
      logger.error('Invalid issuer. Must be a valid URL:', ssoConfig.issuer)
      return false
    }

    // Check if provider already exists
    const existingProviders = await db
      .select()
      .from(ssoProvider)
      .where(eq(ssoProvider.providerId, ssoConfig.providerId))

    if (existingProviders.length > 0) {
      logger.warn(`SSO provider with ID '${ssoConfig.providerId}' already exists`)
      logger.info('Updating existing provider...')
    }

    // Build provider data (following Better Auth's exact structure)
    const providerData: SSOProviderData = {
      id: uuidv4(), // Generate unique ID
      issuer: ssoConfig.issuer,
      domain: ssoConfig.domain,
      userId: adminUser.id,
      providerId: ssoConfig.providerId,
      organizationId: process.env.SSO_ORGANIZATION_ID || undefined,
    }

    // Build OIDC config (same as Better Auth endpoint)
    if (ssoConfig.providerType === 'oidc' && ssoConfig.oidcConfig) {
      const oidcConfig = {
        issuer: ssoConfig.issuer,
        clientId: ssoConfig.oidcConfig.clientId,
        clientSecret: ssoConfig.oidcConfig.clientSecret,
        authorizationEndpoint: ssoConfig.oidcConfig.authorizationEndpoint,
        tokenEndpoint: ssoConfig.oidcConfig.tokenEndpoint,
        tokenEndpointAuthentication: ssoConfig.oidcConfig.tokenEndpointAuthentication,
        jwksEndpoint: ssoConfig.oidcConfig.jwksEndpoint,
        pkce: ssoConfig.oidcConfig.pkce,
        discoveryEndpoint:
          ssoConfig.oidcConfig.discoveryEndpoint ||
          `${ssoConfig.issuer}/.well-known/openid-configuration`,
        mapping: ssoConfig.mapping,
        scopes: ssoConfig.oidcConfig.scopes,
        userInfoEndpoint: ssoConfig.oidcConfig.userInfoEndpoint,
        overrideUserInfo: false,
      }
      providerData.oidcConfig = JSON.stringify(oidcConfig)
    }

    // Build SAML config (same as Better Auth endpoint)
    if (ssoConfig.providerType === 'saml' && ssoConfig.samlConfig) {
      const samlConfig = {
        issuer: ssoConfig.issuer,
        entryPoint: ssoConfig.samlConfig.entryPoint,
        cert: ssoConfig.samlConfig.cert,
        callbackUrl: ssoConfig.samlConfig.callbackUrl,
        audience: ssoConfig.samlConfig.audience,
        idpMetadata: ssoConfig.samlConfig.idpMetadata,
        spMetadata: ssoConfig.samlConfig.spMetadata,
        wantAssertionsSigned: ssoConfig.samlConfig.wantAssertionsSigned,
        signatureAlgorithm: ssoConfig.samlConfig.signatureAlgorithm,
        digestAlgorithm: ssoConfig.samlConfig.digestAlgorithm,
        identifierFormat: ssoConfig.samlConfig.identifierFormat,
        privateKey: ssoConfig.samlConfig.privateKey,
        decryptionPvk: ssoConfig.samlConfig.decryptionPvk,
        additionalParams: ssoConfig.samlConfig.additionalParams,
        mapping: ssoConfig.mapping,
      }
      providerData.samlConfig = JSON.stringify(samlConfig)
    }

    // Insert or update the SSO provider record
    if (existingProviders.length > 0) {
      await db
        .update(ssoProvider)
        .set({
          issuer: providerData.issuer,
          domain: providerData.domain,
          oidcConfig: providerData.oidcConfig,
          samlConfig: providerData.samlConfig,
          userId: providerData.userId,
          organizationId: providerData.organizationId,
        })
        .where(eq(ssoProvider.providerId, ssoConfig.providerId))
    } else {
      await db.insert(ssoProvider).values(providerData)
    }

    logger.info('✅ SSO provider registered successfully in database!', {
      providerId: ssoConfig.providerId,
      providerType: ssoConfig.providerType,
      domain: ssoConfig.domain,
      id: providerData.id,
    })

    logger.info('🔗 Users can now sign in using SSO')

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || 'https://your-domain.com'
    const callbackUrl = `${baseUrl}/api/auth/sso/callback/${ssoConfig.providerId}`
    logger.info(`📋 Callback URL (configure this in your identity provider): ${callbackUrl}`)

    return true
  } catch (error) {
    logger.error('❌ Failed to register SSO provider:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: typeof error,
      errorDetails: JSON.stringify(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return false
  } finally {
    try {
      await postgresClient.end({ timeout: 5 })
    } catch {}
  }
}

async function main() {
  console.log('🔐 Direct Database SSO Registration Script (Better Auth Best Practice)')
  console.log('====================================================================')
  console.log('This script directly inserts SSO provider records into the database.')
  console.log("It follows Better Auth's exact registerSSOProvider logic.\n")

  // Register the SSO provider using direct database access
  const success = await registerSSOProvider()

  if (success) {
    console.log('🎉 SSO setup completed successfully!')
    console.log()
    console.log('Next steps:')
    console.log('1. Configure the callback URL in your identity provider')
    console.log('2. Restart your application if needed')
    console.log('3. Users can now sign in with SSO!')
    process.exit(0)
  } else {
    console.log('💥 SSO setup failed. Check the logs above for details.')
    process.exit(1)
  }
}

// Handle script execution
main().catch((error) => {
  logger.error('Script execution failed:', { error })
  process.exit(1)
})
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: sim-main/packages/python-sdk/.gitignore

```text
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
pip-wheel-metadata/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# PyInstaller
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/

# Virtual environments
.venv
env/
venv/
ENV/
env.bak/
venv.bak/
test_env/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Jupyter Notebook
.ipynb_checkpoints

# pyenv
.python-version

# Environments
.env
.env.local

# mypy
.mypy_cache/
.dmypy.json
dmypy.json
```

--------------------------------------------------------------------------------

---[FILE: pyproject.toml]---
Location: sim-main/packages/python-sdk/pyproject.toml

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "simstudio-sdk"
version = "0.1.1"
authors = [
    {name = "Sim", email = "support@sim.ai"},
]
description = "Sim SDK - Execute workflows programmatically"
readme = "README.md"
license = {text = "Apache-2.0"}
requires-python = ">=3.8"
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: Apache Software License",
    "Operating System :: OS Independent",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Topic :: Software Development :: Libraries :: Python Modules",
    "Topic :: Internet :: WWW/HTTP :: HTTP Servers",
    "Topic :: Scientific/Engineering :: Artificial Intelligence",
]
keywords = ["simstudio", "ai", "workflow", "sdk", "api", "automation"]
dependencies = [
    "requests>=2.25.0",
    "typing-extensions>=4.0.0; python_version<'3.10'",
]

[project.optional-dependencies]
dev = [
    "pytest>=6.0.0",
    "pytest-asyncio>=0.18.0",
    "black>=22.0.0",
    "flake8>=4.0.0",
    "mypy>=0.910",
    "isort>=5.0.0",
    "types-requests>=2.25.0",
]

[project.urls]
Homepage = "https://sim.ai"
Documentation = "https://docs.sim.ai"
Repository = "https://github.com/simstudioai/sim"
"Bug Reports" = "https://github.com/simstudioai/sim/issues"

[tool.setuptools.packages.find]
where = ["."]
include = ["simstudio*"]

[tool.black]
line-length = 100
target-version = ['py38', 'py39', 'py310', 'py311', 'py312']

[tool.isort]
profile = "black"
line_length = 100

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
disallow_untyped_decorators = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_ignores = true
warn_no_return = true
warn_unreachable = true
strict_equality = true

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: sim-main/packages/python-sdk/README.md

```text
# Sim Python SDK

The official Python SDK for [Sim](https://sim.ai), allowing you to execute workflows programmatically from your Python applications.

## Installation

```bash
pip install simstudio-sdk
```

## Quick Start

```python
import os
from simstudio import SimStudioClient

# Initialize the client
client = SimStudioClient(
    api_key=os.getenv("SIM_API_KEY", "your-api-key-here"),
    base_url="https://sim.ai"  # optional, defaults to https://sim.ai
)

# Execute a workflow
try:
    result = client.execute_workflow("workflow-id")
    print("Workflow executed successfully:", result)
except Exception as error:
    print("Workflow execution failed:", error)
```

## API Reference

### SimStudioClient

#### Constructor

```python
SimStudioClient(api_key: str, base_url: str = "https://sim.ai")
```

- `api_key` (str): Your Sim API key
- `base_url` (str, optional): Base URL for the Sim API (defaults to `https://sim.ai`)

#### Methods

##### execute_workflow(workflow_id, input_data=None, timeout=30.0)

Execute a workflow with optional input data.

```python
result = client.execute_workflow(
    "workflow-id",
    input_data={"message": "Hello, world!"},
    timeout=30.0  # 30 seconds
)
```

**Parameters:**
- `workflow_id` (str): The ID of the workflow to execute
- `input_data` (dict, optional): Input data to pass to the workflow. File objects are automatically converted to base64.
- `timeout` (float): Timeout in seconds (default: 30.0)

**Returns:** `WorkflowExecutionResult`

##### get_workflow_status(workflow_id)

Get the status of a workflow (deployment status, etc.).

```python
status = client.get_workflow_status("workflow-id")
print("Is deployed:", status.is_deployed)
```

**Parameters:**
- `workflow_id` (str): The ID of the workflow

**Returns:** `WorkflowStatus`

##### validate_workflow(workflow_id)

Validate that a workflow is ready for execution.

```python
is_ready = client.validate_workflow("workflow-id")
if is_ready:
    # Workflow is deployed and ready
    pass
```

**Parameters:**
- `workflow_id` (str): The ID of the workflow

**Returns:** `bool`

##### execute_workflow_sync(workflow_id, input_data=None, timeout=30.0)

Execute a workflow and poll for completion (useful for long-running workflows).

```python
result = client.execute_workflow_sync(
    "workflow-id",
    input_data={"data": "some input"},
    timeout=60.0
)
```

**Parameters:**
- `workflow_id` (str): The ID of the workflow to execute
- `input_data` (dict, optional): Input data to pass to the workflow
- `timeout` (float): Timeout for the initial request in seconds

**Returns:** `WorkflowExecutionResult`

##### set_api_key(api_key)

Update the API key.

```python
client.set_api_key("new-api-key")
```

##### set_base_url(base_url)

Update the base URL.

```python
client.set_base_url("https://my-custom-domain.com")
```

##### close()

Close the underlying HTTP session.

```python
client.close()
```

## Data Classes

### WorkflowExecutionResult

```python
@dataclass
class WorkflowExecutionResult:
    success: bool
    output: Optional[Any] = None
    error: Optional[str] = None
    logs: Optional[list] = None
    metadata: Optional[Dict[str, Any]] = None
    trace_spans: Optional[list] = None
    total_duration: Optional[float] = None
```

### WorkflowStatus

```python
@dataclass
class WorkflowStatus:
    is_deployed: bool
    deployed_at: Optional[str] = None
    needs_redeployment: bool = False
```

### SimStudioError

```python
class SimStudioError(Exception):
    def __init__(self, message: str, code: Optional[str] = None, status: Optional[int] = None):
        super().__init__(message)
        self.code = code
        self.status = status
```

## Examples

### Basic Workflow Execution

```python
import os
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def run_workflow():
    try:
        # Check if workflow is ready
        is_ready = client.validate_workflow("my-workflow-id")
        if not is_ready:
            raise Exception("Workflow is not deployed or ready")

        # Execute the workflow
        result = client.execute_workflow(
            "my-workflow-id",
            input_data={
                "message": "Process this data",
                "user_id": "12345"
            }
        )

        if result.success:
            print("Output:", result.output)
            print("Duration:", result.metadata.get("duration") if result.metadata else None)
        else:
            print("Workflow failed:", result.error)
            
    except Exception as error:
        print("Error:", error)

run_workflow()
```

### Error Handling

```python
from simstudio import SimStudioClient, SimStudioError
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_with_error_handling():
    try:
        result = client.execute_workflow("workflow-id")
        return result
    except SimStudioError as error:
        if error.code == "UNAUTHORIZED":
            print("Invalid API key")
        elif error.code == "TIMEOUT":
            print("Workflow execution timed out")
        elif error.code == "USAGE_LIMIT_EXCEEDED":
            print("Usage limit exceeded")
        elif error.code == "INVALID_JSON":
            print("Invalid JSON in request body")
        else:
            print(f"Workflow error: {error}")
        raise
    except Exception as error:
        print(f"Unexpected error: {error}")
        raise
```

### Context Manager Usage

```python
from simstudio import SimStudioClient
import os

# Using context manager to automatically close the session
with SimStudioClient(api_key=os.getenv("SIM_API_KEY")) as client:
    result = client.execute_workflow("workflow-id")
    print("Result:", result)
# Session is automatically closed here
```

### Environment Configuration

```python
import os
from simstudio import SimStudioClient

# Using environment variables
client = SimStudioClient(
    api_key=os.getenv("SIM_API_KEY"),
    base_url=os.getenv("SIM_BASE_URL", "https://sim.ai")
)
```

### File Upload

File objects are automatically detected and converted to base64 format. Include them in your input under the field name matching your workflow's API trigger input format:

The SDK converts file objects to this format:
```python
{
  'type': 'file',
  'data': 'data:mime/type;base64,base64data',
  'name': 'filename',
  'mime': 'mime/type'
}
```

Alternatively, you can manually provide files using the URL format:
```python
{
  'type': 'url',
  'data': 'https://example.com/file.pdf',
  'name': 'file.pdf',
  'mime': 'application/pdf'
}
```

```python
from simstudio import SimStudioClient
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

# Upload a single file - include it under the field name from your API trigger
with open('document.pdf', 'rb') as f:
    result = client.execute_workflow(
        'workflow-id',
        input_data={
            'documents': [f],  # Must match your workflow's "files" field name
            'instructions': 'Analyze this document'
        }
    )

# Upload multiple files
with open('doc1.pdf', 'rb') as f1, open('doc2.pdf', 'rb') as f2:
    result = client.execute_workflow(
        'workflow-id',
        input_data={
            'attachments': [f1, f2],  # Must match your workflow's "files" field name
            'query': 'Compare these documents'
        }
    )
```

### Batch Workflow Execution

```python
from simstudio import SimStudioClient
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_workflows_batch(workflow_data_pairs):
    """Execute multiple workflows with different input data."""
    results = []

    for workflow_id, input_data in workflow_data_pairs:
        try:
            # Validate workflow before execution
            if not client.validate_workflow(workflow_id):
                print(f"Skipping {workflow_id}: not deployed")
                continue

            result = client.execute_workflow(workflow_id, input_data)
            results.append({
                "workflow_id": workflow_id,
                "success": result.success,
                "output": result.output,
                "error": result.error
            })

        except Exception as error:
            results.append({
                "workflow_id": workflow_id,
                "success": False,
                "error": str(error)
            })

    return results

# Example usage
workflows = [
    ("workflow-1", {"type": "analysis", "data": "sample1"}),
    ("workflow-2", {"type": "processing", "data": "sample2"}),
]

results = execute_workflows_batch(workflows)
for result in results:
    print(f"Workflow {result['workflow_id']}: {'Success' if result['success'] else 'Failed'}")
```

## Getting Your API Key

1. Log in to your [Sim](https://sim.ai) account
2. Navigate to your workflow
3. Click on "Deploy" to deploy your workflow
4. Select or create an API key during the deployment process
5. Copy the API key to use in your application

## Development

### Running Tests

To run the tests locally:

1. Clone the repository and navigate to the Python SDK directory:
   ```bash
   cd packages/python-sdk
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the package in development mode with test dependencies:
   ```bash
   pip install -e ".[dev]"
   ```

4. Run the tests:
   ```bash
   pytest tests/ -v
   ```

### Code Quality

Run code quality checks:

```bash
# Code formatting
black simstudio/

# Linting
flake8 simstudio/ --max-line-length=100

# Type checking
mypy simstudio/

# Import sorting
isort simstudio/
```

## Requirements

- Python 3.8+
- requests >= 2.25.0

## License

Apache-2.0
```

--------------------------------------------------------------------------------

---[FILE: setup.py]---
Location: sim-main/packages/python-sdk/setup.py

```python
from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="simstudio-sdk",
    version="0.1.1",
    author="Sim",
    author_email="support@sim.ai",
    description="Sim SDK - Execute workflows programmatically",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/simstudioai/sim",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.25.0",
        "typing-extensions>=4.0.0; python_version<'3.10'",
    ],
    extras_require={
        "dev": [
            "pytest>=6.0.0",
            "pytest-asyncio>=0.18.0",
            "black>=22.0.0",
            "flake8>=4.0.0",
            "mypy>=0.910",
        ],
        "test": [
            "pytest>=6.0.0",
        ],
    },
    keywords=["simstudio", "ai", "workflow", "sdk", "api", "automation"],
    project_urls={
        "Bug Reports": "https://github.com/simstudioai/sim/issues",
        "Source": "https://github.com/simstudioai/sim",
        "Documentation": "https://docs.sim.ai",
    },
)
```

--------------------------------------------------------------------------------

````

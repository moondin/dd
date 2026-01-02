---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 832
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 832 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: aws-role-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/aws/credentials-type/aws-role-credentials-form.tsx
Signals: React

```typescript
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { useEffect, useState } from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";

import { CredentialsRoleHelper } from "@/components/providers/workflow";
import { CustomInput } from "@/components/ui/custom";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";
import { AWSCredentialsRole } from "@/types";
import { IntegrationType } from "@/types/integrations";

export const AWSRoleCredentialsForm = ({
  control,
  setValue,
  externalId,
  templateLinks,
  type = "providers",
  integrationType,
}: {
  control: Control<AWSCredentialsRole>;
  setValue: UseFormSetValue<AWSCredentialsRole>;
  externalId: string;
  templateLinks: {
    cloudformation: string;
    cloudformationQuickLink: string;
    terraform: string;
  };
  type?: "providers" | "integrations";
  integrationType?: IntegrationType;
}) => {
  const isCloudEnv = process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true";
  const defaultCredentialsType = isCloudEnv
    ? "aws-sdk-default"
    : "access-secret-key";

  const credentialsType = useWatch({
    control,
    name: ProviderCredentialFields.CREDENTIALS_TYPE,
    defaultValue: defaultCredentialsType,
  });

  const [showOptionalRole, setShowOptionalRole] = useState(false);

  const showRoleSection =
    type === "providers" ||
    (isCloudEnv && credentialsType === "aws-sdk-default") ||
    showOptionalRole;

  // Track role section visibility and ensure external_id is set
  useEffect(() => {
    // Set show_role_section for validation
    setValue("show_role_section" as any, showRoleSection);

    // When role section is shown, ensure external_id is set
    // This handles both initial mount and when the section becomes visible
    if (showRoleSection && externalId) {
      setValue(ProviderCredentialFields.EXTERNAL_ID, externalId, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [showRoleSection, setValue, externalId]);

  return (
    <>
      <div className="flex flex-col">
        {type === "providers" && (
          <div className="text-md text-default-foreground leading-9 font-bold">
            Connect assuming IAM Role
          </div>
        )}
      </div>

      <span className="text-default-500 text-xs font-bold">
        Specify which AWS credentials to use
      </span>

      <Select
        name={ProviderCredentialFields.CREDENTIALS_TYPE}
        label="Authentication Method"
        placeholder="Select credentials type"
        selectedKeys={[credentialsType || defaultCredentialsType]}
        className="mb-4"
        variant="bordered"
        onSelectionChange={(keys) =>
          setValue(
            ProviderCredentialFields.CREDENTIALS_TYPE,
            Array.from(keys)[0] as "aws-sdk-default" | "access-secret-key",
          )
        }
      >
        <SelectItem
          key="aws-sdk-default"
          textValue={
            isCloudEnv
              ? "Prowler Cloud will assume your IAM role"
              : "AWS SDK Default"
          }
        >
          <div className="flex w-full items-center justify-between">
            <span>
              {isCloudEnv
                ? "Prowler Cloud will assume your IAM role"
                : "AWS SDK Default"}
            </span>
            {isCloudEnv && (
              <Chip size="sm" variant="flat" color="success" className="ml-2">
                Recommended
              </Chip>
            )}
          </div>
        </SelectItem>
        <SelectItem key="access-secret-key" textValue="Access & Secret Key">
          <div className="flex w-full items-center justify-between">
            <span>Access & Secret Key</span>
          </div>
        </SelectItem>
      </Select>

      {credentialsType === "access-secret-key" && (
        <>
          <CustomInput
            control={control}
            name={ProviderCredentialFields.AWS_ACCESS_KEY_ID}
            type="password"
            label="AWS Access Key ID"
            labelPlacement="inside"
            placeholder="Enter the AWS Access Key ID"
            variant="bordered"
            isRequired
          />
          <CustomInput
            control={control}
            name={ProviderCredentialFields.AWS_SECRET_ACCESS_KEY}
            type="password"
            label="AWS Secret Access Key"
            labelPlacement="inside"
            placeholder="Enter the AWS Secret Access Key"
            variant="bordered"
            isRequired
          />
          <CustomInput
            control={control}
            name={ProviderCredentialFields.AWS_SESSION_TOKEN}
            type="password"
            label="AWS Session Token (optional)"
            labelPlacement="inside"
            placeholder="Enter the AWS Session Token"
            variant="bordered"
            isRequired={false}
          />
        </>
      )}
      <Divider className="" />

      {type === "providers" ? (
        <span className="text-default-500 text-xs font-bold">Assume Role</span>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-default-500 text-xs font-bold">
            {isCloudEnv && credentialsType === "aws-sdk-default"
              ? "Adding a role is required"
              : "Optionally add a role"}
          </span>
          <Switch
            size="sm"
            isSelected={showRoleSection}
            onValueChange={setShowOptionalRole}
            isDisabled={isCloudEnv && credentialsType === "aws-sdk-default"}
          />
        </div>
      )}

      {showRoleSection && (
        <>
          <CredentialsRoleHelper
            externalId={externalId}
            templateLinks={templateLinks}
            integrationType={integrationType}
          />

          <Divider />

          <CustomInput
            control={control}
            name={ProviderCredentialFields.ROLE_ARN}
            type="text"
            label="Role ARN"
            labelPlacement="inside"
            placeholder="Enter the Role ARN"
            variant="bordered"
            isRequired={showRoleSection}
          />
          <CustomInput
            control={control}
            name={ProviderCredentialFields.EXTERNAL_ID}
            type="text"
            label="External ID"
            labelPlacement="inside"
            placeholder={externalId}
            variant="bordered"
            defaultValue={externalId}
            isDisabled
            isRequired
          />

          <span className="text-default-500 text-xs">Optional fields</span>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <CustomInput
              control={control}
              name={ProviderCredentialFields.ROLE_SESSION_NAME}
              type="text"
              label="Role session name"
              labelPlacement="inside"
              placeholder="Enter the role session name"
              variant="bordered"
              isRequired={false}
            />
            <CustomInput
              control={control}
              name={ProviderCredentialFields.SESSION_DURATION}
              type="number"
              label="Session duration (seconds)"
              labelPlacement="inside"
              placeholder="Enter the session duration (default: 3600 seconds)"
              variant="bordered"
              isRequired={false}
            />
          </div>
        </>
      )}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: aws-static-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/aws/credentials-type/aws-static-credentials-form.tsx

```typescript
import { Control } from "react-hook-form";

import { CustomInput } from "@/components/ui/custom";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";
import { AWSCredentials } from "@/types";

export const AWSStaticCredentialsForm = ({
  control,
}: {
  control: Control<AWSCredentials>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via Credentials
        </div>
        <div className="text-default-500 text-sm">
          Please provide the information for your AWS credentials.
        </div>
      </div>
      <CustomInput
        control={control}
        name={ProviderCredentialFields.AWS_ACCESS_KEY_ID}
        type="password"
        label="AWS Access Key ID"
        labelPlacement="inside"
        placeholder="Enter the AWS Access Key ID"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name={ProviderCredentialFields.AWS_SECRET_ACCESS_KEY}
        type="password"
        label="AWS Secret Access Key"
        labelPlacement="inside"
        placeholder="Enter the AWS Secret Access Key"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name={ProviderCredentialFields.AWS_SESSION_TOKEN}
        type="password"
        label="AWS Session Token"
        labelPlacement="inside"
        placeholder="Enter the AWS Session Token"
        variant="bordered"
        isRequired={false}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/aws/credentials-type/index.ts

```typescript
export * from "./aws-role-credentials-form";
export * from "./aws-static-credentials-form";
```

--------------------------------------------------------------------------------

---[FILE: add-via-service-account-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/gcp/add-via-service-account-form.tsx

```typescript
"use client";

import { addCredentialsProvider } from "@/actions/providers/providers";
import { ProviderType } from "@/types";

import { BaseCredentialsForm } from "../../base-credentials-form";

export const AddViaServiceAccountForm = ({
  searchParams,
  providerUid,
}: {
  searchParams: { type: ProviderType; id: string };
  providerUid?: string;
}) => {
  const providerType = searchParams.type;
  const providerId = searchParams.id;

  const handleAddCredentials = async (formData: FormData) => {
    return await addCredentialsProvider(formData);
  };

  const successNavigationUrl = `/providers/test-connection?type=${providerType}&id=${providerId}`;

  return (
    <BaseCredentialsForm
      providerType={providerType}
      providerId={providerId}
      providerUid={providerUid}
      onSubmit={handleAddCredentials}
      successNavigationUrl={successNavigationUrl}
      submitButtonText="Next"
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/gcp/index.ts

```typescript
export * from "./add-via-service-account-form";
export * from "./radio-group-gcp-via-credentials-type-form";
export * from "./select-via-gcp";
```

--------------------------------------------------------------------------------

---[FILE: radio-group-gcp-via-credentials-type-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/gcp/radio-group-gcp-via-credentials-type-form.tsx
Signals: React

```typescript
"use client";

import { RadioGroup } from "@heroui/radio";
import React from "react";
import { Control, Controller } from "react-hook-form";

import { CustomRadio } from "@/components/ui/custom";
import { FormMessage } from "@/components/ui/form";

type RadioGroupAWSViaCredentialsFormProps = {
  control: Control<any>;
  isInvalid: boolean;
  errorMessage?: string;
  onChange?: (value: string) => void;
};

export const RadioGroupGCPViaCredentialsTypeForm = ({
  control,
  isInvalid,
  errorMessage,
  onChange,
}: RadioGroupAWSViaCredentialsFormProps) => {
  return (
    <Controller
      name="gcpCredentialsType"
      control={control}
      render={({ field }) => (
        <>
          <RadioGroup
            className="flex flex-wrap"
            isInvalid={isInvalid}
            {...field}
            value={field.value || ""}
            onValueChange={(value) => {
              field.onChange(value);
              if (onChange) {
                onChange(value);
              }
            }}
          >
            <div className="flex flex-col gap-4">
              <span className="text-default-500 text-sm">
                Using Service Account
              </span>
              <CustomRadio
                description="Connect using Service Account"
                value="service-account"
              >
                <div className="flex items-center">
                  <span className="ml-2">Connect via Service Account Key</span>
                </div>
              </CustomRadio>
              <span className="text-default-500 text-sm">
                Using Application Default Credentials
              </span>
              <CustomRadio
                description="Connect via Credentials"
                value="credentials"
              >
                <div className="flex items-center">
                  <span className="ml-2">
                    Connect via Application Default Credentials
                  </span>
                </div>
              </CustomRadio>
            </div>
          </RadioGroup>
          {errorMessage && (
            <FormMessage className="text-text-error">
              {errorMessage}
            </FormMessage>
          )}
        </>
      )}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: select-via-gcp.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/gcp/select-via-gcp.tsx
Signals: Next.js

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { RadioGroupGCPViaCredentialsTypeForm } from "./radio-group-gcp-via-credentials-type-form";

interface SelectViaGCPProps {
  initialVia?: string;
}

export const SelectViaGCP = ({ initialVia }: SelectViaGCPProps) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      gcpCredentialsType: initialVia || "",
    },
  });

  const handleSelectionChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("via", value);
    router.push(url.toString());
  };

  return (
    <Form {...form}>
      <RadioGroupGCPViaCredentialsTypeForm
        control={form.control}
        isInvalid={!!form.formState.errors.gcpCredentialsType}
        errorMessage={form.formState.errors.gcpCredentialsType?.message}
        onChange={handleSelectionChange}
      />
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: gcp-default-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/gcp/credentials-type/gcp-default-credentials-form.tsx

```typescript
import { Control } from "react-hook-form";

import { CustomInput } from "@/components/ui/custom";
import { GCPDefaultCredentials } from "@/types";

export const GCPDefaultCredentialsForm = ({
  control,
}: {
  control: Control<GCPDefaultCredentials>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via Credentials
        </div>
        <div className="text-default-500 text-sm">
          Please provide the information for your GCP credentials.
        </div>
      </div>
      <CustomInput
        control={control}
        name="client_id"
        type="text"
        label="Client ID"
        labelPlacement="inside"
        placeholder="Enter the Client ID"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name="client_secret"
        type="password"
        label="Client Secret"
        labelPlacement="inside"
        placeholder="Enter the Client Secret"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name="refresh_token"
        type="password"
        label="Refresh Token"
        labelPlacement="inside"
        placeholder="Enter the Refresh Token"
        variant="bordered"
        isRequired
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: gcp-service-account-key-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/gcp/credentials-type/gcp-service-account-key-form.tsx

```typescript
import { Control } from "react-hook-form";

import { CustomTextarea } from "@/components/ui/custom";
import { GCPServiceAccountKey } from "@/types";

export const GCPServiceAccountKeyForm = ({
  control,
}: {
  control: Control<GCPServiceAccountKey>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via Service Account Key
        </div>
        <div className="text-default-500 text-sm">
          Please provide the service account key for your GCP credentials.
        </div>
      </div>
      <CustomTextarea
        control={control}
        name="service_account_key"
        label="Service Account Key"
        labelPlacement="inside"
        placeholder="Paste your Service Account Key JSON content here"
        variant="bordered"
        minRows={10}
        isRequired
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/gcp/credentials-type/index.ts

```typescript
export * from "./gcp-default-credentials-form";
export * from "./gcp-service-account-key-form";
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/github/index.ts

```typescript
export * from "./credentials-type";
export * from "./radio-group-github-via-credentials-type-form";
export * from "./select-via-github";
```

--------------------------------------------------------------------------------

---[FILE: radio-group-github-via-credentials-type-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/github/radio-group-github-via-credentials-type-form.tsx
Signals: React

```typescript
"use client";

import { RadioGroup } from "@heroui/radio";
import React from "react";
import { Control, Controller } from "react-hook-form";

import { CustomRadio } from "@/components/ui/custom";
import { FormMessage } from "@/components/ui/form";

type RadioGroupGitHubViaCredentialsFormProps = {
  control: Control<any>;
  isInvalid: boolean;
  errorMessage?: string;
  onChange?: (value: string) => void;
};

export const RadioGroupGitHubViaCredentialsTypeForm = ({
  control,
  isInvalid,
  errorMessage,
  onChange,
}: RadioGroupGitHubViaCredentialsFormProps) => {
  return (
    <Controller
      name="githubCredentialsType"
      control={control}
      render={({ field }) => (
        <>
          <RadioGroup
            className="flex flex-wrap"
            isInvalid={isInvalid}
            {...field}
            value={field.value || ""}
            onValueChange={(value) => {
              field.onChange(value);
              if (onChange) {
                onChange(value);
              }
            }}
          >
            <div className="flex flex-col gap-4">
              <span className="text-default-500 text-sm">
                Personal Access Token
              </span>
              <CustomRadio
                description="Use a personal access token for authentication"
                value="personal_access_token"
              >
                <div className="flex items-center">
                  <span className="ml-2">Personal Access Token</span>
                </div>
              </CustomRadio>

              <span className="text-default-500 text-sm">OAuth App</span>
              <CustomRadio
                description="Use OAuth App token for authentication"
                value="oauth_app"
              >
                <div className="flex items-center">
                  <span className="ml-2">OAuth App Token</span>
                </div>
              </CustomRadio>

              <span className="text-default-500 text-sm">GitHub App</span>
              <CustomRadio
                description="Use GitHub App ID and private key for authentication"
                value="github_app"
              >
                <div className="flex items-center">
                  <span className="ml-2">GitHub App</span>
                </div>
              </CustomRadio>
            </div>
          </RadioGroup>
          {errorMessage && (
            <FormMessage className="text-text-error">
              {errorMessage}
            </FormMessage>
          )}
        </>
      )}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: select-via-github.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/github/select-via-github.tsx
Signals: Next.js

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { RadioGroupGitHubViaCredentialsTypeForm } from "./radio-group-github-via-credentials-type-form";

interface SelectViaGitHubProps {
  initialVia?: string;
}

export const SelectViaGitHub = ({ initialVia }: SelectViaGitHubProps) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      githubCredentialsType: initialVia || "",
    },
  });

  const handleSelectionChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("via", value);
    router.push(url.toString());
  };

  return (
    <Form {...form}>
      <RadioGroupGitHubViaCredentialsTypeForm
        control={form.control}
        isInvalid={!!form.formState.errors.githubCredentialsType}
        errorMessage={form.formState.errors.githubCredentialsType?.message}
        onChange={handleSelectionChange}
      />
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: github-app-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/github/credentials-type/github-app-form.tsx

```typescript
"use client";

import { Control } from "react-hook-form";

import { CustomInput, CustomTextarea } from "@/components/ui/custom";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";

export const GitHubAppForm = ({ control }: { control: Control<any> }) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via GitHub App
        </div>
        <div className="text-default-500 text-sm">
          Please provide your GitHub App ID and private key.
        </div>
      </div>
      <CustomInput
        control={control}
        name={ProviderCredentialFields.GITHUB_APP_ID}
        type="text"
        label="GitHub App ID"
        labelPlacement="inside"
        placeholder="Enter your GitHub App ID"
        variant="bordered"
        isRequired
      />
      <CustomTextarea
        control={control}
        name={ProviderCredentialFields.GITHUB_APP_KEY}
        label="GitHub App Private Key"
        labelPlacement="inside"
        placeholder="Paste your GitHub App private key here"
        variant="bordered"
        isRequired
        minRows={4}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: github-oauth-app-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/github/credentials-type/github-oauth-app-form.tsx

```typescript
"use client";

import { Control } from "react-hook-form";

import { CustomInput } from "@/components/ui/custom";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";

export const GitHubOAuthAppForm = ({ control }: { control: Control<any> }) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via OAuth App
        </div>
        <div className="text-default-500 text-sm">
          Please provide your GitHub OAuth App token.
        </div>
      </div>
      <CustomInput
        control={control}
        name={ProviderCredentialFields.OAUTH_APP_TOKEN}
        type="password"
        label="OAuth App Token"
        labelPlacement="inside"
        placeholder="Enter your GitHub OAuth App token"
        variant="bordered"
        isRequired
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: github-personal-access-token-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/github/credentials-type/github-personal-access-token-form.tsx

```typescript
"use client";

import { Control } from "react-hook-form";

import { CustomInput } from "@/components/ui/custom";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";

export const GitHubPersonalAccessTokenForm = ({
  control,
}: {
  control: Control<any>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via Personal Access Token
        </div>
        <div className="text-default-500 text-sm">
          Please provide your GitHub personal access token.
        </div>
      </div>
      <CustomInput
        control={control}
        name={ProviderCredentialFields.PERSONAL_ACCESS_TOKEN}
        type="password"
        label="Personal Access Token"
        labelPlacement="inside"
        placeholder="Enter your GitHub personal access token"
        variant="bordered"
        isRequired
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/github/credentials-type/index.ts

```typescript
export * from "./github-app-form";
export * from "./github-oauth-app-form";
export * from "./github-personal-access-token-form";
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/m365/index.ts

```typescript
export {
  M365CertificateCredentialsForm,
  M365ClientSecretCredentialsForm,
} from "./credentials-type";
export { SelectViaM365 } from "./select-via-m365";
```

--------------------------------------------------------------------------------

---[FILE: radio-group-m365-via-credentials-type-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/m365/radio-group-m365-via-credentials-type-form.tsx
Signals: React

```typescript
"use client";

import { RadioGroup } from "@heroui/radio";
import React from "react";
import { Control, Controller } from "react-hook-form";

import { CustomRadio } from "@/components/ui/custom";
import { FormMessage } from "@/components/ui/form";

type RadioGroupM365ViaCredentialsFormProps = {
  control: Control<any>;
  isInvalid: boolean;
  errorMessage?: string;
  onChange?: (value: string) => void;
};

export const RadioGroupM365ViaCredentialsTypeForm = ({
  control,
  isInvalid,
  errorMessage,
  onChange,
}: RadioGroupM365ViaCredentialsFormProps) => {
  return (
    <Controller
      name="m365CredentialsType"
      control={control}
      render={({ field }) => (
        <>
          <RadioGroup
            className="flex flex-wrap"
            isInvalid={isInvalid}
            {...field}
            value={field.value || ""}
            onValueChange={(value) => {
              field.onChange(value);
              if (onChange) {
                onChange(value);
              }
            }}
          >
            <div className="flex flex-col gap-4">
              <span className="text-default-500 text-sm">
                Select Authentication Method
              </span>
              <CustomRadio
                description="Connect using Application Client Secret"
                value="app_client_secret"
              >
                <div className="flex items-center">
                  <span className="ml-2">App Client Secret Credentials</span>
                </div>
              </CustomRadio>
              <CustomRadio
                description="Connect using Application Certificate"
                value="app_certificate"
              >
                <div className="flex items-center">
                  <span className="ml-2">App Certificate Credentials</span>
                </div>
              </CustomRadio>
            </div>
          </RadioGroup>
          {errorMessage && (
            <FormMessage className="text-text-error">
              {errorMessage}
            </FormMessage>
          )}
        </>
      )}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: select-via-m365.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/m365/select-via-m365.tsx
Signals: Next.js

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { RadioGroupM365ViaCredentialsTypeForm } from "./radio-group-m365-via-credentials-type-form";

interface SelectViaM365Props {
  initialVia?: string;
}

export const SelectViaM365 = ({ initialVia }: SelectViaM365Props) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      m365CredentialsType: initialVia || "",
    },
  });

  const handleSelectionChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("via", value);
    router.push(url.toString());
  };

  return (
    <Form {...form}>
      <RadioGroupM365ViaCredentialsTypeForm
        control={form.control}
        isInvalid={!!form.formState.errors.m365CredentialsType}
        errorMessage={form.formState.errors.m365CredentialsType?.message}
        onChange={handleSelectionChange}
      />
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/m365/credentials-type/index.ts

```typescript
export { M365CertificateCredentialsForm } from "./m365-certificate-credentials-form";
export { M365ClientSecretCredentialsForm } from "./m365-client-secret-credentials-form";
```

--------------------------------------------------------------------------------

---[FILE: m365-certificate-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/m365/credentials-type/m365-certificate-credentials-form.tsx

```typescript
"use client";

import { Control } from "react-hook-form";

import { CustomInput, CustomTextarea } from "@/components/ui/custom";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { M365CertificateCredentials } from "@/types";

export const M365CertificateCredentialsForm = ({
  control,
}: {
  control: Control<M365CertificateCredentials>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          App Certificate Credentials
        </div>
        <div className="text-default-500 text-sm">
          Please provide your Microsoft 365 application credentials with
          certificate authentication.
        </div>
      </div>
      <CustomInput
        control={control}
        name="tenant_id"
        type="text"
        label="Tenant ID"
        labelPlacement="inside"
        placeholder="Enter the Tenant ID"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name="client_id"
        type="text"
        label="Client ID"
        labelPlacement="inside"
        placeholder="Enter the Client ID"
        variant="bordered"
        isRequired
      />
      <CustomTextarea
        control={control}
        name="certificate_content"
        label="Certificate Content"
        labelPlacement="inside"
        placeholder="Enter the base64 encoded certificate content"
        variant="bordered"
        isRequired
        minRows={4}
      />
      <p className="text-default-500 text-sm">
        The certificate content must be base64 encoded from an unsigned
        certificate. For detailed instructions on how to generate and encode
        your certificate, please refer to the{" "}
        <CustomLink
          href="https://docs.prowler.com/user-guide/providers/microsoft365/authentication#generate-the-certificate"
          size="sm"
        >
          certificate generation guide
        </CustomLink>
        .
      </p>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: m365-client-secret-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/m365/credentials-type/m365-client-secret-credentials-form.tsx

```typescript
"use client";

import { Control } from "react-hook-form";

import { CustomInput } from "@/components/ui/custom";
import { M365ClientSecretCredentials } from "@/types";

export const M365ClientSecretCredentialsForm = ({
  control,
}: {
  control: Control<M365ClientSecretCredentials>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          App Client Secret Credentials
        </div>
        <div className="text-default-500 text-sm">
          Please provide your Microsoft 365 application credentials.
        </div>
      </div>
      <CustomInput
        control={control}
        name="tenant_id"
        type="text"
        label="Tenant ID"
        labelPlacement="inside"
        placeholder="Enter the Tenant ID"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name="client_id"
        type="text"
        label="Client ID"
        labelPlacement="inside"
        placeholder="Enter the Client ID"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name="client_secret"
        type="password"
        label="Client Secret"
        labelPlacement="inside"
        placeholder="Enter the Client Secret"
        variant="bordered"
        isRequired
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: azure-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/via-credentials/azure-credentials-form.tsx

```typescript
import { Control } from "react-hook-form";

import { CustomInput } from "@/components/ui/custom";
import { AzureCredentials } from "@/types";

export const AzureCredentialsForm = ({
  control,
}: {
  control: Control<AzureCredentials>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via Credentials
        </div>
        <div className="text-default-500 text-sm">
          Please provide the information for your Azure credentials.
        </div>
      </div>
      <CustomInput
        control={control}
        name="client_id"
        type="text"
        label="Client ID"
        labelPlacement="inside"
        placeholder="Enter the Client ID"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name="client_secret"
        type="password"
        label="Client Secret"
        labelPlacement="inside"
        placeholder="Enter the Client Secret"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name="tenant_id"
        type="text"
        label="Tenant ID"
        labelPlacement="inside"
        placeholder="Enter the Tenant ID"
        variant="bordered"
        isRequired
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: github-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/via-credentials/github-credentials-form.tsx

```typescript
"use client";

import { Control } from "react-hook-form";

import {
  GitHubAppForm,
  GitHubOAuthAppForm,
  GitHubPersonalAccessTokenForm,
} from "../select-credentials-type/github";

interface GitHubCredentialsFormProps {
  control: Control<any>;
  credentialsType?: string;
}

export const GitHubCredentialsForm = ({
  control,
  credentialsType,
}: GitHubCredentialsFormProps) => {
  switch (credentialsType) {
    case "personal_access_token":
      return <GitHubPersonalAccessTokenForm control={control} />;
    case "oauth_app":
      return <GitHubOAuthAppForm control={control} />;
    case "github_app":
      return <GitHubAppForm control={control} />;
    default:
      return null;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: iac-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/via-credentials/iac-credentials-form.tsx

```typescript
import { Control } from "react-hook-form";

import { CustomInput } from "@/components/ui/custom";
import { IacCredentials } from "@/types";

export const IacCredentialsForm = ({
  control,
}: {
  control: Control<IacCredentials>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via Repository
        </div>
        <div className="text-default-500 text-sm">
          Provide an access token if the repository is private (optional).
        </div>
      </div>
      <CustomInput
        control={control}
        name="access_token"
        label="Access Token (Optional)"
        labelPlacement="inside"
        placeholder="Token for private repositories (optional)"
        variant="bordered"
        type="password"
        isRequired={false}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/via-credentials/index.ts

```typescript
export * from "./azure-credentials-form";
export * from "./github-credentials-form";
export * from "./iac-credentials-form";
export * from "./k8s-credentials-form";
export * from "./mongodbatlas-credentials-form";
```

--------------------------------------------------------------------------------

````

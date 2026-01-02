---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 819
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 819 of 867)

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

---[FILE: index.ts]---
Location: prowler-master/ui/components/integrations/index.ts

```typescript
export * from "../providers/enhanced-provider-selector";
export * from "./api-key/api-key-link-card";
export * from "./jira/jira-integration-card";
export * from "./jira/jira-integration-form";
export * from "./jira/jira-integrations-manager";
export * from "./s3/s3-integration-card";
export * from "./s3/s3-integration-form";
export * from "./s3/s3-integrations-manager";
export * from "./saml/saml-config-form";
export * from "./saml/saml-integration-card";
export * from "./security-hub/security-hub-integration-card";
export * from "./security-hub/security-hub-integration-form";
export * from "./security-hub/security-hub-integrations-manager";
export * from "./shared";
export * from "./sso/sso-link-card";
```

--------------------------------------------------------------------------------

---[FILE: api-key-link-card.tsx]---
Location: prowler-master/ui/components/integrations/api-key/api-key-link-card.tsx

```typescript
"use client";

import { KeyRoundIcon } from "lucide-react";

import { LinkCard } from "../shared/link-card";

export const ApiKeyLinkCard = () => {
  return (
    <LinkCard
      icon={KeyRoundIcon}
      title="API Keys"
      description="Manage API keys for programmatic access."
      learnMoreUrl="https://docs.prowler.com/user-guide/tutorials/prowler-app-api-keys"
      learnMoreAriaLabel="Learn more about API Keys"
      bodyText="API Key management is available in your User Profile. Create and manage API keys to authenticate with the Prowler API for automation and integrations."
      linkHref="/profile"
      linkText="Go to Profile"
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: jira-integration-card.tsx]---
Location: prowler-master/ui/components/integrations/jira/jira-integration-card.tsx
Signals: Next.js

```typescript
"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import { JiraIcon } from "@/components/icons/services/IconServices";
import { Button } from "@/components/shadcn";
import { CustomLink } from "@/components/ui/custom/custom-link";

import { Card, CardContent, CardHeader } from "../../shadcn";

export const JiraIntegrationCard = () => {
  return (
    <Card variant="base" padding="lg">
      <CardHeader>
        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <JiraIcon size={40} />
            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Jira
              </h4>
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <p className="text-xs text-nowrap text-gray-500 dark:text-gray-300">
                  Create and manage security issues in Jira.
                </p>
                <CustomLink
                  href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-jira-integration/"
                  aria-label="Learn more about Jira integration"
                  size="xs"
                >
                  Learn more
                </CustomLink>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button asChild size="sm">
              <Link href="/integrations/jira">
                <SettingsIcon size={14} />
                Manage
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Configure and manage your Jira integrations to automatically create
          issues for security findings in your Jira projects.
        </p>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: jira-integration-form.tsx]---
Location: prowler-master/ui/components/integrations/jira/jira-integration-form.tsx
Signals: Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createIntegration, updateIntegration } from "@/actions/integrations";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { Form } from "@/components/ui/form";
import { FormButtons } from "@/components/ui/form/form-buttons";
import {
  type CreateValues,
  editJiraIntegrationFormSchema,
  type FormValues,
  IntegrationProps,
  type JiraCredentialsPayload,
  jiraIntegrationFormSchema,
} from "@/types/integrations";

interface JiraIntegrationFormProps {
  integration?: IntegrationProps | null;
  onSuccess: (integrationId?: string, shouldTestConnection?: boolean) => void;
  onCancel: () => void;
}

export const JiraIntegrationForm = ({
  integration,
  onSuccess,
  onCancel,
}: JiraIntegrationFormProps) => {
  const { toast } = useToast();
  const isEditing = !!integration;
  const isCreating = !isEditing;

  const form = useForm<FormValues>({
    resolver: zodResolver(
      isCreating ? jiraIntegrationFormSchema : editJiraIntegrationFormSchema,
    ),
    defaultValues: {
      integration_type: "jira" as const,
      domain: integration?.attributes.configuration.domain || "",
      enabled: integration?.attributes.enabled ?? true,
      user_mail: "",
      api_token: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const normalizeDomain = (raw: string): string => {
    let v = (raw || "").trim().toLowerCase();
    // strip protocol
    v = v.replace(/^https?:\/\//, "");
    // take hostname (drop path/query)
    v = v.split("/")[0];
    // if full host provided, strip Atlassian suffix to keep site name only
    if (v.endsWith(".atlassian.net")) {
      v = v.replace(/\.atlassian\.net$/, "");
    }
    return v;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      // Add integration type
      formData.append("integration_type", "jira");

      // Prepare credentials object
      const credentials: JiraCredentialsPayload = {};

      // For editing, only add fields that have values
      if (isEditing) {
        // Only add domain if it's provided (for updates, domain might not be editable)
        if (data.domain) credentials.domain = normalizeDomain(data.domain);
        if (data.user_mail) credentials.user_mail = data.user_mail;
        if (data.api_token) credentials.api_token = data.api_token;
      } else {
        // For creation, all credential fields are required
        const createData = data as CreateValues;
        credentials.domain = normalizeDomain(createData.domain);
        credentials.user_mail = createData.user_mail;
        credentials.api_token = createData.api_token;
      }

      // Add credentials as JSON
      if (Object.keys(credentials).length > 0) {
        formData.append("credentials", JSON.stringify(credentials));
      }

      // For creation, we need to provide configuration and providers
      if (isCreating) {
        formData.append("configuration", JSON.stringify({}));
        formData.append("providers", JSON.stringify([]));
        // enabled exists only in create schema
        formData.append(
          "enabled",
          JSON.stringify((data as CreateValues).enabled),
        );
      }

      type IntegrationResult =
        | { success: string; integrationId?: string }
        | { error: string };
      let result: IntegrationResult;
      if (isEditing) {
        result = await updateIntegration(integration.id, formData);
      } else {
        result = await createIntegration(formData);
      }

      if (result && "success" in result && result.success) {
        toast({
          title: "Success!",
          description: `Jira integration ${isEditing ? "updated" : "created"} successfully.`,
        });

        // Always test connection when creating or updating
        const shouldTestConnection = true;
        const integrationId =
          "integrationId" in result ? result.integrationId : integration?.id;

        onSuccess(integrationId, shouldTestConnection);
      } else if (result && "error" in result) {
        toast({
          variant: "destructive",
          title: "Operation Failed",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} Jira integration. Please try again.`,
      });
    }
  };

  const renderForm = () => {
    return (
      <>
        {isCreating && (
          <CustomInput
            control={form.control}
            name="domain"
            type="text"
            label="Jira Domain"
            labelPlacement="inside"
            placeholder="your-domain.atlassian.net"
            isRequired
            isDisabled={isLoading}
          />
        )}

        {isEditing && integration?.attributes.configuration.domain && (
          <CustomInput
            control={form.control}
            name="domain"
            type="text"
            label="Jira Domain"
            labelPlacement="inside"
            placeholder="your-domain.atlassian.net"
            isDisabled={isLoading}
          />
        )}

        <CustomInput
          control={form.control}
          name="user_mail"
          type="email"
          label="User Email"
          labelPlacement="inside"
          placeholder="user@example.com"
          isRequired
          isDisabled={isLoading}
        />

        <CustomInput
          control={form.control}
          name="api_token"
          type="password"
          label="API Token"
          labelPlacement="inside"
          placeholder="Enter your Jira API token"
          isRequired
          isDisabled={isLoading}
        />

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            To generate an API token with scopes, visit your{" "}
            <a
              href="https://id.atlassian.com/manage-profile/security/api-tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              Atlassian account settings
            </a>
            .
          </p>
        </div>
      </>
    );
  };

  const getButtonLabel = () => {
    if (isEditing) {
      return "Update Credentials";
    }
    return "Create Integration";
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <p className="text-default-500 flex items-center gap-2 text-sm">
              Need help configuring your Jira integration?
            </p>
            <CustomLink
              href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-jira-integration/"
              target="_blank"
              size="sm"
            >
              Read the docs
            </CustomLink>
          </div>
          {renderForm()}
        </div>
        <FormButtons
          setIsOpen={() => {}}
          onCancel={onCancel}
          submitText={getButtonLabel()}
          cancelText="Cancel"
          loadingText="Processing..."
          isDisabled={isLoading}
        />
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: jira-integrations-manager.tsx]---
Location: prowler-master/ui/components/integrations/jira/jira-integrations-manager.tsx
Signals: React

```typescript
"use client";

import { format } from "date-fns";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import {
  deleteIntegration,
  testIntegrationConnection,
  updateIntegration,
} from "@/actions/integrations";
import { JiraIcon } from "@/components/icons/services/IconServices";
import {
  IntegrationActionButtons,
  IntegrationCardHeader,
  IntegrationSkeleton,
} from "@/components/integrations/shared";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomAlertModal } from "@/components/ui/custom";
import { DataTablePagination } from "@/components/ui/table/data-table-pagination";
import { triggerTestConnectionWithDelay } from "@/lib/integrations/test-connection-helper";
import { MetaDataProps } from "@/types";
import { IntegrationProps } from "@/types/integrations";

import { Card, CardContent, CardHeader } from "../../shadcn";
import { JiraIntegrationForm } from "./jira-integration-form";

interface JiraIntegrationsManagerProps {
  integrations: IntegrationProps[];
  metadata?: MetaDataProps;
}

export const JiraIntegrationsManager = ({
  integrations,
  metadata,
}: JiraIntegrationsManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] =
    useState<IntegrationProps | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [integrationToDelete, setIntegrationToDelete] =
    useState<IntegrationProps | null>(null);
  const { toast } = useToast();

  const handleAddIntegration = () => {
    setEditingIntegration(null);
    setIsModalOpen(true);
  };

  const handleEditCredentials = (integration: IntegrationProps) => {
    setEditingIntegration(integration);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (integration: IntegrationProps) => {
    setIntegrationToDelete(integration);
    setIsDeleteOpen(true);
  };

  const handleDeleteIntegration = async (id: string) => {
    setIsDeleting(id);
    try {
      const result = await deleteIntegration(id, "jira");

      if (result.success) {
        toast({
          title: "Success!",
          description: "Jira integration deleted successfully.",
        });
      } else if (result.error) {
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete Jira integration. Please try again.",
      });
    } finally {
      setIsDeleting(null);
      setIsDeleteOpen(false);
      setIntegrationToDelete(null);
    }
  };

  const handleTestConnection = async (id: string) => {
    setIsTesting(id);
    try {
      const result = await testIntegrationConnection(id);

      if (result.success) {
        toast({
          title: "Connection test successful!",
          description:
            result.message || "Connection test completed successfully.",
        });
      } else if (result.error) {
        toast({
          variant: "destructive",
          title: "Connection test failed",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to test connection. Please try again.",
      });
    } finally {
      setIsTesting(null);
    }
  };

  const handleToggleEnabled = async (integration: IntegrationProps) => {
    try {
      const newEnabledState = !integration.attributes.enabled;
      const formData = new FormData();
      formData.append(
        "integration_type",
        integration.attributes.integration_type,
      );
      formData.append("enabled", JSON.stringify(newEnabledState));

      const result = await updateIntegration(integration.id, formData);

      if (result && "success" in result) {
        toast({
          title: "Success!",
          description: `Integration ${newEnabledState ? "enabled" : "disabled"} successfully.`,
        });

        // If enabling, trigger test connection automatically
        if (newEnabledState) {
          setIsTesting(integration.id);

          triggerTestConnectionWithDelay(
            integration.id,
            true,
            "jira",
            toast,
            500,
            () => {
              setIsTesting(null);
            },
          );
        }
      } else if (result && "error" in result) {
        toast({
          variant: "destructive",
          title: "Toggle Failed",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle integration. Please try again.",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingIntegration(null);
  };

  const handleFormSuccess = async (
    integrationId?: string,
    shouldTestConnection?: boolean,
  ) => {
    // Close the modal immediately
    setIsModalOpen(false);
    setEditingIntegration(null);
    setIsOperationLoading(true);

    // Set testing state for server-triggered test connections
    if (integrationId && shouldTestConnection) {
      setIsTesting(integrationId);
    }

    // Trigger test connection if needed
    triggerTestConnectionWithDelay(
      integrationId,
      shouldTestConnection,
      "jira",
      toast,
      200,
      () => {
        // Clear testing state when server-triggered test completes
        setIsTesting(null);
      },
    );

    // Reset loading state after a short delay to show the skeleton briefly
    setTimeout(() => {
      setIsOperationLoading(false);
    }, 1500);
  };

  return (
    <>
      <CustomAlertModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Jira Integration"
        description="This action cannot be undone. This will permanently delete your Jira integration."
      >
        <div className="flex w-full justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => {
              setIsDeleteOpen(false);
              setIntegrationToDelete(null);
            }}
            disabled={isDeleting !== null}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="lg"
            disabled={isDeleting !== null}
            onClick={() =>
              integrationToDelete &&
              handleDeleteIntegration(integrationToDelete.id)
            }
          >
            {!isDeleting && <Trash2Icon size={24} />}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CustomAlertModal>

      <CustomAlertModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={
          editingIntegration
            ? "Update Jira Credentials"
            : "Add Jira Integration"
        }
      >
        <JiraIntegrationForm
          integration={editingIntegration}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </CustomAlertModal>

      <div className="flex flex-col gap-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Configured Jira Integrations
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {integrations.length === 0
                ? "Not configured yet"
                : `${integrations.length} integration${integrations.length !== 1 ? "s" : ""} configured`}
            </p>
          </div>
          <Button onClick={handleAddIntegration}>
            <PlusIcon size={16} />
            Add Integration
          </Button>
        </div>

        {/* Integrations List */}
        {isOperationLoading ? (
          <IntegrationSkeleton
            variant="manager"
            count={integrations.length || 1}
            icon={<JiraIcon size={32} />}
            title="Jira"
            subtitle="Create and manage security issues in Jira."
          />
        ) : integrations.length > 0 ? (
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} variant="base">
                <CardHeader>
                  <IntegrationCardHeader
                    icon={<JiraIcon size={32} />}
                    title={`${integration.attributes.configuration.domain}`}
                    connectionStatus={{
                      connected: integration.attributes.connected,
                    }}
                  />
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      {integration.attributes.connection_last_checked_at && (
                        <p>
                          <span className="font-medium">Last checked:</span>{" "}
                          {format(
                            new Date(
                              integration.attributes.connection_last_checked_at,
                            ),
                            "yyyy/MM/dd",
                          )}
                        </p>
                      )}
                    </div>
                    <IntegrationActionButtons
                      integration={integration}
                      onTestConnection={handleTestConnection}
                      onEditCredentials={handleEditCredentials}
                      onToggleEnabled={handleToggleEnabled}
                      onDelete={handleOpenDeleteModal}
                      isTesting={isTesting === integration.id}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {metadata && integrations.length > 0 && (
          <div className="mt-6">
            <DataTablePagination metadata={metadata} />
          </div>
        )}
      </div>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: s3-integration-card.tsx]---
Location: prowler-master/ui/components/integrations/s3/s3-integration-card.tsx
Signals: Next.js

```typescript
"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import { AmazonS3Icon } from "@/components/icons/services/IconServices";
import { Button } from "@/components/shadcn";
import { CustomLink } from "@/components/ui/custom/custom-link";

import { Card, CardContent, CardHeader } from "../../shadcn";

export const S3IntegrationCard = () => {
  return (
    <Card variant="base" padding="lg">
      <CardHeader>
        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AmazonS3Icon size={40} />
            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Amazon S3
              </h4>
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <p className="text-xs text-nowrap text-gray-500 dark:text-gray-300">
                  Export security findings to Amazon S3 buckets.
                </p>
                <CustomLink
                  href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-s3-integration/"
                  aria-label="Learn more about S3 integration"
                  size="xs"
                >
                  Learn more
                </CustomLink>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button asChild size="sm">
              <Link href="/integrations/amazon-s3">
                <SettingsIcon size={14} />
                Manage
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Configure and manage your Amazon S3 integrations to automatically
          export security findings to your S3 buckets.
        </p>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: s3-integration-form.tsx]---
Location: prowler-master/ui/components/integrations/s3/s3-integration-form.tsx
Signals: React, Zod

```typescript
"use client";

import { Divider } from "@heroui/divider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Control, useForm } from "react-hook-form";

import { createIntegration, updateIntegration } from "@/actions/integrations";
import { EnhancedProviderSelector } from "@/components/providers/enhanced-provider-selector";
import { AWSRoleCredentialsForm } from "@/components/providers/workflow/forms/select-credentials-type/aws/credentials-type/aws-role-credentials-form";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { Form } from "@/components/ui/form";
import { FormButtons } from "@/components/ui/form/form-buttons";
import { getAWSCredentialsTemplateLinks } from "@/lib";
import { AWSCredentialsRole } from "@/types";
import {
  editS3IntegrationFormSchema,
  IntegrationProps,
  s3IntegrationFormSchema,
} from "@/types/integrations";
import { ProviderProps } from "@/types/providers";

interface S3IntegrationFormProps {
  integration?: IntegrationProps | null;
  providers: ProviderProps[];
  onSuccess: (integrationId?: string, shouldTestConnection?: boolean) => void;
  onCancel: () => void;
  editMode?: "configuration" | "credentials" | null; // null means creating new
}

export const S3IntegrationForm = ({
  integration,
  providers,
  onSuccess,
  onCancel,
  editMode = null,
}: S3IntegrationFormProps) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(
    editMode === "credentials" ? 1 : 0,
  );
  const isEditing = !!integration;
  const isCreating = !isEditing;
  const isEditingConfig = editMode === "configuration";
  const isEditingCredentials = editMode === "credentials";

  const defaultCredentialsType =
    process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true"
      ? "aws-sdk-default"
      : "access-secret-key";

  const form = useForm({
    resolver: zodResolver(
      // For credentials editing, use creation schema (all fields required)
      // For config editing, use edit schema (partial updates allowed)
      // For creation, use creation schema
      isEditingCredentials || isCreating
        ? s3IntegrationFormSchema
        : editS3IntegrationFormSchema,
    ),
    defaultValues: {
      integration_type: "amazon_s3" as const,
      bucket_name: integration?.attributes.configuration.bucket_name || "",
      output_directory:
        integration?.attributes.configuration.output_directory || "output",
      providers:
        integration?.relationships?.providers?.data?.map((p) => p.id) || [],
      enabled: integration?.attributes.enabled ?? true,
      credentials_type: defaultCredentialsType,
      aws_access_key_id: "",
      aws_secret_access_key: "",
      aws_session_token: "",
      role_arn: "",
      // External ID always defaults to tenantId, even when editing credentials
      external_id: session?.tenantId || "",
      role_session_name: "",
      session_duration: "",
      show_role_section: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    // If we're in single-step edit mode, don't advance
    if (isEditingConfig || isEditingCredentials) {
      return;
    }

    // Validate current step fields for creation flow
    const stepFields =
      currentStep === 0
        ? (["bucket_name", "output_directory", "providers"] as const)
        : // Step 1: No required fields since role_arn and external_id are optional
          [];

    const isValid = stepFields.length === 0 || (await form.trigger(stepFields));

    if (isValid) {
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  // Helper function to build credentials object
  const buildCredentials = (values: any) => {
    const credentials: any = {};

    // Don't include credentials_type in the API payload - it's a UI-only field
    // The backend determines credential type based on which fields are present

    // Only include role-related fields if role_arn is provided
    if (values.role_arn && values.role_arn.trim() !== "") {
      credentials.role_arn = values.role_arn;
      credentials.external_id = values.external_id;

      // Optional role fields
      if (values.role_session_name)
        credentials.role_session_name = values.role_session_name;
      if (values.session_duration)
        credentials.session_duration =
          parseInt(values.session_duration, 10) || 3600;
    }

    // Add static credentials if using access-secret-key type
    if (values.credentials_type === "access-secret-key") {
      credentials.aws_access_key_id = values.aws_access_key_id;
      credentials.aws_secret_access_key = values.aws_secret_access_key;
      if (values.aws_session_token)
        credentials.aws_session_token = values.aws_session_token;
    }

    return credentials;
  };

  const buildConfiguration = (values: any, isPartial = false) => {
    const configuration: any = {};

    // For creation mode, include all fields
    if (!isPartial) {
      configuration.bucket_name = values.bucket_name;
      configuration.output_directory = values.output_directory || "output";
    } else {
      // For edit mode, bucket_name and output_directory are treated as a pair
      const originalBucketName =
        integration?.attributes.configuration.bucket_name || "";
      const originalOutputDirectory =
        integration?.attributes.configuration.output_directory || "";

      const bucketNameChanged = values.bucket_name !== originalBucketName;
      const outputDirectoryChanged =
        values.output_directory !== originalOutputDirectory;

      // If either field changed, send both (as a pair)
      if (bucketNameChanged || outputDirectoryChanged) {
        configuration.bucket_name = values.bucket_name;
        configuration.output_directory = values.output_directory || "output";
      }
    }

    return configuration;
  };

  // Helper function to build FormData based on edit mode
  const buildFormData = (values: any) => {
    const formData = new FormData();
    formData.append("integration_type", values.integration_type);

    if (isEditingConfig) {
      const configuration = buildConfiguration(values, true);
      if (Object.keys(configuration).length > 0) {
        formData.append("configuration", JSON.stringify(configuration));
      }
      // Always send providers array, even if empty, to update relationships
      formData.append("providers", JSON.stringify(values.providers || []));
    } else if (isEditingCredentials) {
      const credentials = buildCredentials(values);
      formData.append("credentials", JSON.stringify(credentials));
    } else {
      // Creation mode - send everything
      const configuration = buildConfiguration(values);
      const credentials = buildCredentials(values);

      formData.append("configuration", JSON.stringify(configuration));
      formData.append("credentials", JSON.stringify(credentials));
      formData.append("providers", JSON.stringify(values.providers));
      formData.append("enabled", JSON.stringify(values.enabled ?? true));
    }

    return formData;
  };

  const onSubmit = async (values: any) => {
    const formData = buildFormData(values);

    try {
      let result;
      let shouldTestConnection = false;

      if (isEditing && integration) {
        result = await updateIntegration(integration.id, formData);
        // Test connection if we're editing credentials or configuration (S3 needs both)
        shouldTestConnection = isEditingCredentials || isEditingConfig;
      } else {
        result = await createIntegration(formData);
        // Always test connection for new integrations
        shouldTestConnection = true;
      }

      if ("success" in result) {
        toast({
          title: "Success!",
          description: `S3 integration ${isEditing ? "updated" : "created"} successfully.`,
        });

        // Pass the integration ID and whether to test connection to the success callback
        onSuccess(result.integrationId, shouldTestConnection);
      } else if ("error" in result) {
        const errorMessage = result.error;

        toast({
          variant: "destructive",
          title: "S3 Integration Error",
          description: errorMessage,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      toast({
        variant: "destructive",
        title: "Connection Error",
        description: `${errorMessage}. Please check your network connection and try again.`,
      });
    }
  };

  const renderStepContent = () => {
    // If editing credentials, show only credentials form
    if (isEditingCredentials || currentStep === 1) {
      const bucketName = form.getValues("bucket_name") || "";
      const externalId =
        form.getValues("external_id") || session?.tenantId || "";
      const templateLinks = getAWSCredentialsTemplateLinks(
        externalId,
        bucketName,
        "amazon_s3",
      );

      return (
        <AWSRoleCredentialsForm
          control={form.control as unknown as Control<AWSCredentialsRole>}
          setValue={form.setValue as any}
          externalId={externalId}
          templateLinks={templateLinks}
          type="integrations"
          integrationType="amazon_s3"
        />
      );
    }

    // Show configuration step (step 0 or editing configuration)
    if (isEditingConfig || currentStep === 0) {
      return (
        <>
          {/* Provider Selection */}
          <div className="flex flex-col gap-4">
            <EnhancedProviderSelector
              control={form.control}
              name="providers"
              providers={providers}
              label="Cloud Providers"
              placeholder="Select providers to integrate with"
              selectionMode="multiple"
              enableSearch={true}
            />
          </div>

          <Divider />

          {/* S3 Configuration */}
          <div className="flex flex-col gap-4">
            <CustomInput
              control={form.control}
              name="bucket_name"
              type="text"
              label="Bucket name"
              labelPlacement="inside"
              placeholder="my-security-findings-bucket"
              variant="bordered"
              isRequired
            />

            <CustomInput
              control={form.control}
              name="output_directory"
              type="text"
              label="Output directory"
              labelPlacement="inside"
              placeholder="output"
              variant="bordered"
              isRequired
            />
          </div>
        </>
      );
    }

    return null;
  };

  const renderStepButtons = () => {
    // Single edit mode (configuration or credentials)
    if (isEditingConfig || isEditingCredentials) {
      const updateText = isEditingConfig
        ? "Update Configuration"
        : "Update Credentials";
      const loadingText = isEditingConfig
        ? "Updating Configuration..."
        : "Updating Credentials...";

      return (
        <FormButtons
          setIsOpen={() => {}}
          onCancel={onCancel}
          submitText={updateText}
          cancelText="Cancel"
          loadingText={loadingText}
          isDisabled={isLoading}
        />
      );
    }

    // Creation flow - step 0
    if (currentStep === 0) {
      return (
        <FormButtons
          setIsOpen={() => {}}
          onCancel={onCancel}
          submitText="Next"
          cancelText="Cancel"
          loadingText="Processing..."
          isDisabled={isLoading}
          rightIcon={<ArrowRightIcon size={24} />}
        />
      );
    }

    // Creation flow - step 1 (final step)
    return (
      <FormButtons
        setIsOpen={() => {}}
        onCancel={handleBack}
        submitText="Create Integration"
        cancelText="Back"
        loadingText="Creating..."
        leftIcon={<ArrowLeftIcon size={24} />}
        isDisabled={isLoading}
      />
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={
          // For edit modes, always submit
          isEditingConfig || isEditingCredentials
            ? form.handleSubmit(onSubmit)
            : // For creation flow, handle step logic
              currentStep === 0
              ? handleNext
              : form.handleSubmit(onSubmit)
        }
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <p className="text-default-500 flex items-center gap-2 text-sm">
              Need help configuring your Amazon S3 integration?
            </p>
            <CustomLink
              href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-s3-integration/"
              target="_blank"
              size="sm"
            >
              Read the docs
            </CustomLink>
          </div>
          {renderStepContent()}
        </div>
        {renderStepButtons()}
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

````

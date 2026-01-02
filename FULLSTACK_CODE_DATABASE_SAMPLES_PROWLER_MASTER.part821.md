---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 821
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 821 of 867)

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

---[FILE: security-hub-integration-form.tsx]---
Location: prowler-master/ui/components/integrations/security-hub/security-hub-integration-form.tsx
Signals: React, Zod

```typescript
"use client";

import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { Radio, RadioGroup } from "@heroui/radio";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Control, useForm } from "react-hook-form";

import { createIntegration, updateIntegration } from "@/actions/integrations";
import { EnhancedProviderSelector } from "@/components/providers/enhanced-provider-selector";
import { AWSRoleCredentialsForm } from "@/components/providers/workflow/forms/select-credentials-type/aws/credentials-type/aws-role-credentials-form";
import { useToast } from "@/components/ui";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { FormButtons } from "@/components/ui/form/form-buttons";
import { getAWSCredentialsTemplateLinks } from "@/lib";
import { AWSCredentialsRole } from "@/types";
import {
  editSecurityHubIntegrationFormSchema,
  IntegrationProps,
  securityHubIntegrationFormSchema,
} from "@/types/integrations";
import { ProviderProps } from "@/types/providers";

interface SecurityHubIntegrationFormProps {
  integration?: IntegrationProps | null;
  providers: ProviderProps[];
  existingIntegrations?: IntegrationProps[];
  onSuccess: (integrationId?: string, shouldTestConnection?: boolean) => void;
  onCancel: () => void;
  editMode?: "configuration" | "credentials" | null;
}

export const SecurityHubIntegrationForm = ({
  integration,
  providers,
  existingIntegrations = [],
  onSuccess,
  onCancel,
  editMode = null,
}: SecurityHubIntegrationFormProps) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(
    editMode === "credentials" ? 1 : 0,
  );
  const isEditing = !!integration;
  const isCreating = !isEditing;
  const isEditingConfig = editMode === "configuration";
  const isEditingCredentials = editMode === "credentials";

  const disabledProviderIds = useMemo(() => {
    // When editing, no providers should be disabled since we're not changing it
    if (isEditing) {
      return [];
    }

    // When creating, disable providers that are already used by other Security Hub integrations
    const usedProviderIds: string[] = [];
    existingIntegrations.forEach((existingIntegration) => {
      const providerRelationships =
        existingIntegration.relationships?.providers?.data;
      if (providerRelationships && providerRelationships.length > 0) {
        usedProviderIds.push(providerRelationships[0].id);
      }
    });

    return usedProviderIds;
  }, [isEditing, existingIntegrations]);

  const form = useForm({
    resolver: zodResolver(
      isEditingCredentials || isCreating
        ? securityHubIntegrationFormSchema
        : editSecurityHubIntegrationFormSchema,
    ),
    defaultValues: {
      integration_type: "aws_security_hub" as const,
      provider_id: integration?.relationships?.providers?.data?.[0]?.id || "",
      send_only_fails:
        (integration?.attributes.configuration.send_only_fails as
          | boolean
          | undefined) ?? true,
      archive_previous_findings:
        (integration?.attributes.configuration.archive_previous_findings as
          | boolean
          | undefined) ?? false,
      use_custom_credentials: false,
      enabled: integration?.attributes.enabled ?? true,
      credentials_type: "access-secret-key" as const,
      aws_access_key_id: "",
      aws_secret_access_key: "",
      aws_session_token: "",
      role_arn: "",
      external_id: session?.tenantId || "",
      role_session_name: "",
      session_duration: "",
      show_role_section: false,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const useCustomCredentials = form.watch("use_custom_credentials");
  const providerIdValue = form.watch("provider_id");
  const hasErrors = !!form.formState.errors.provider_id || !providerIdValue;

  useEffect(() => {
    if (!useCustomCredentials && isCreating) {
      setCurrentStep(0);
    }
  }, [useCustomCredentials, isCreating]);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditingConfig || isEditingCredentials) {
      return;
    }

    const stepFields = currentStep === 0 ? (["provider_id"] as const) : [];
    const isValid = stepFields.length === 0 || (await form.trigger(stepFields));

    if (isValid) {
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const buildCredentials = (values: any) => {
    const credentials: any = {};

    if (values.role_arn && values.role_arn.trim() !== "") {
      credentials.role_arn = values.role_arn;
      credentials.external_id = values.external_id;

      if (values.role_session_name)
        credentials.role_session_name = values.role_session_name;
      if (values.session_duration)
        credentials.session_duration =
          parseInt(values.session_duration, 10) || 3600;
    }

    if (values.credentials_type === "access-secret-key") {
      credentials.aws_access_key_id = values.aws_access_key_id;
      credentials.aws_secret_access_key = values.aws_secret_access_key;
      if (values.aws_session_token)
        credentials.aws_session_token = values.aws_session_token;
    }

    return credentials;
  };

  const buildConfiguration = (values: any) => {
    const configuration: any = {};

    configuration.send_only_fails = values.send_only_fails ?? true;
    configuration.archive_previous_findings =
      values.archive_previous_findings ?? false;

    return configuration;
  };

  const buildFormData = (values: any) => {
    const formData = new FormData();
    formData.append("integration_type", values.integration_type);

    if (isEditingConfig) {
      const configuration = buildConfiguration(values);
      if (Object.keys(configuration).length > 0) {
        formData.append("configuration", JSON.stringify(configuration));
      }
    } else if (isEditingCredentials) {
      // When editing credentials, check if using custom credentials
      if (!values.use_custom_credentials) {
        // Use provider credentials - send empty object
        formData.append("credentials", JSON.stringify({}));
      } else {
        // Use custom credentials
        const credentials = buildCredentials(values);
        formData.append("credentials", JSON.stringify(credentials));
      }
    } else {
      const configuration = buildConfiguration(values);
      formData.append("configuration", JSON.stringify(configuration));

      if (values.use_custom_credentials) {
        const credentials = buildCredentials(values);
        formData.append("credentials", JSON.stringify(credentials));
      } else {
        formData.append("credentials", JSON.stringify({}));
      }

      formData.append("enabled", JSON.stringify(values.enabled ?? true));

      // Send provider_id as an array for consistency with the action
      formData.append("providers", JSON.stringify([values.provider_id]));
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
        // Test connection ONLY if we're editing credentials (Security Hub doesn't need test for config changes)
        shouldTestConnection = isEditingCredentials;
      } else {
        result = await createIntegration(formData);
        // Always test connection for new integrations
        shouldTestConnection = true;
      }

      if ("success" in result) {
        toast({
          title: "Success!",
          description: `Security Hub integration ${isEditing ? "updated" : "created"} successfully.`,
        });

        // Pass the integration ID and whether to test connection to the success callback
        onSuccess(result.integrationId, shouldTestConnection);
      } else if ("error" in result) {
        const errorMessage = result.error;

        toast({
          variant: "destructive",
          title: "Security Hub Integration Error",
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
    if (isEditingCredentials) {
      // When editing credentials, show the credential type selector first
      return (
        <div className="flex flex-col gap-4">
          <RadioGroup
            size="sm"
            aria-label="Credential type"
            value={useCustomCredentials ? "custom" : "provider"}
            onValueChange={(value) => {
              form.setValue("use_custom_credentials", value === "custom", {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          >
            <Radio value="provider">
              <span className="text-sm">Use provider credentials</span>
            </Radio>
            <Radio value="custom">
              <span className="text-sm">Use custom credentials</span>
            </Radio>
          </RadioGroup>

          {useCustomCredentials && (
            <>
              <Divider />
              <AWSRoleCredentialsForm
                control={form.control as unknown as Control<AWSCredentialsRole>}
                setValue={form.setValue as any}
                externalId={
                  form.getValues("external_id") || session?.tenantId || ""
                }
                templateLinks={getAWSCredentialsTemplateLinks(
                  form.getValues("external_id") || session?.tenantId || "",
                  undefined,
                  "aws_security_hub",
                )}
                type="integrations"
                integrationType="aws_security_hub"
              />
            </>
          )}
        </div>
      );
    }

    if (currentStep === 1 && useCustomCredentials) {
      const externalId =
        form.getValues("external_id") || session?.tenantId || "";
      const templateLinks = getAWSCredentialsTemplateLinks(
        externalId,
        undefined,
        "aws_security_hub",
      );

      return (
        <AWSRoleCredentialsForm
          control={form.control as unknown as Control<AWSCredentialsRole>}
          setValue={form.setValue as any}
          externalId={externalId}
          templateLinks={templateLinks}
          type="integrations"
          integrationType="aws_security_hub"
        />
      );
    }

    if (isEditingConfig || currentStep === 0) {
      return (
        <>
          {!isEditingConfig && (
            <>
              <div className="flex flex-col gap-4">
                <EnhancedProviderSelector
                  control={form.control}
                  name="provider_id"
                  providers={providers}
                  label="AWS Provider"
                  placeholder="Search and select an AWS provider"
                  isInvalid={!!form.formState.errors.provider_id}
                  selectionMode="single"
                  providerType="aws"
                  enableSearch={true}
                  disabledProviderIds={disabledProviderIds}
                />
              </div>
              <Divider />
            </>
          )}

          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="send_only_fails"
              render={({ field }) => (
                <FormControl>
                  <Checkbox
                    isSelected={Boolean(field.value)}
                    onValueChange={field.onChange}
                    size="sm"
                    color="default"
                  >
                    <span className="text-sm">
                      Send only findings with status FAIL
                    </span>
                  </Checkbox>
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="archive_previous_findings"
              render={({ field }) => (
                <FormControl>
                  <Checkbox
                    isSelected={Boolean(field.value)}
                    onValueChange={field.onChange}
                    size="sm"
                    color="default"
                  >
                    <span className="text-sm">Archive previous findings</span>
                  </Checkbox>
                </FormControl>
              )}
            />

            {isCreating && (
              <FormField
                control={form.control}
                name="use_custom_credentials"
                render={({ field }) => (
                  <FormControl>
                    <Checkbox
                      isSelected={field.value}
                      onValueChange={field.onChange}
                      size="sm"
                      color="default"
                    >
                      <span className="text-sm">
                        Use custom credentials (By default, AWS account ones
                        will be used)
                      </span>
                    </Checkbox>
                  </FormControl>
                )}
              />
            )}
          </div>
        </>
      );
    }

    return null;
  };

  const renderStepButtons = () => {
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

    if (currentStep === 0 && !useCustomCredentials) {
      return (
        <FormButtons
          setIsOpen={() => {}}
          onCancel={onCancel}
          submitText="Create Integration"
          cancelText="Cancel"
          loadingText="Creating..."
          isDisabled={isLoading || hasErrors}
        />
      );
    }

    if (currentStep === 0 && useCustomCredentials) {
      return (
        <FormButtons
          setIsOpen={() => {}}
          onCancel={onCancel}
          submitText="Next"
          cancelText="Cancel"
          loadingText="Processing..."
          isDisabled={isLoading || hasErrors}
          rightIcon={<ArrowRightIcon size={24} />}
        />
      );
    }

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
          isEditingConfig ||
          isEditingCredentials ||
          (currentStep === 0 && !useCustomCredentials)
            ? form.handleSubmit(onSubmit)
            : currentStep === 0
              ? handleNext
              : form.handleSubmit(onSubmit)
        }
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <p className="text-default-500 flex items-center gap-2 text-sm">
              Need help configuring your AWS Security Hub integration?
            </p>
            <CustomLink
              href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-security-hub-integration/"
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

---[FILE: security-hub-integrations-manager.tsx]---
Location: prowler-master/ui/components/integrations/security-hub/security-hub-integrations-manager.tsx
Signals: React

```typescript
"use client";

import { Chip } from "@heroui/chip";
import { format } from "date-fns";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import {
  deleteIntegration,
  testIntegrationConnection,
  updateIntegration,
} from "@/actions/integrations";
import { AWSSecurityHubIcon } from "@/components/icons/services/IconServices";
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
import { ProviderProps } from "@/types/providers";

import { Card, CardContent, CardHeader } from "../../shadcn";
import { SecurityHubIntegrationForm } from "./security-hub-integration-form";

interface SecurityHubIntegrationsManagerProps {
  integrations: IntegrationProps[];
  providers: ProviderProps[];
  metadata?: MetaDataProps;
}

export const SecurityHubIntegrationsManager = ({
  integrations,
  providers,
  metadata,
}: SecurityHubIntegrationsManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] =
    useState<IntegrationProps | null>(null);
  const [editMode, setEditMode] = useState<
    "configuration" | "credentials" | null
  >(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [integrationToDelete, setIntegrationToDelete] =
    useState<IntegrationProps | null>(null);
  const { toast } = useToast();

  const handleAddIntegration = () => {
    setEditingIntegration(null);
    setEditMode(null);
    setIsModalOpen(true);
  };

  const handleEditConfiguration = (integration: IntegrationProps) => {
    setEditingIntegration(integration);
    setEditMode("configuration");
    setIsModalOpen(true);
  };

  const handleEditCredentials = (integration: IntegrationProps) => {
    setEditingIntegration(integration);
    setEditMode("credentials");
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (integration: IntegrationProps) => {
    setIntegrationToDelete(integration);
    setIsDeleteOpen(true);
  };

  const handleDeleteIntegration = async (id: string) => {
    setIsDeleting(id);
    try {
      const result = await deleteIntegration(id, "aws_security_hub");

      if (result.success) {
        toast({
          title: "Success!",
          description: "Security Hub integration deleted successfully.",
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
        description:
          "Failed to delete Security Hub integration. Please try again.",
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
            "security_hub",
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
    setEditMode(null);
  };

  const handleFormSuccess = async (
    integrationId?: string,
    shouldTestConnection?: boolean,
  ) => {
    // Close the modal immediately
    setIsModalOpen(false);
    setEditingIntegration(null);
    setEditMode(null);
    setIsOperationLoading(true);

    // Set testing state for server-triggered test connections
    if (integrationId && shouldTestConnection) {
      setIsTesting(integrationId);
    }

    // Trigger test connection if needed
    triggerTestConnectionWithDelay(
      integrationId,
      shouldTestConnection,
      "security_hub",
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

  const getProviderDetails = (integration: IntegrationProps) => {
    const providerRelationships = integration.relationships?.providers?.data;

    if (!providerRelationships || providerRelationships.length === 0) {
      return { displayName: "Unknown Account", accountId: null };
    }

    // Security Hub should only have one provider
    const providerId = providerRelationships[0].id;
    const provider = providers.find((p) => p.id === providerId);

    if (!provider) {
      return { displayName: "Unknown Account", accountId: null };
    }

    return {
      displayName: provider.attributes.alias || provider.attributes.uid,
      accountId: provider.attributes.uid,
      alias: provider.attributes.alias,
    };
  };

  const getEnabledRegions = (integration: IntegrationProps) => {
    const regions = integration.attributes.configuration.regions;
    if (!regions || typeof regions !== "object") return [];

    return Object.entries(regions)
      .filter(([_, enabled]) => enabled === true)
      .map(([region]) => region)
      .sort();
  };

  return (
    <>
      <CustomAlertModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Security Hub Integration"
        description="This action cannot be undone. This will permanently delete your Security Hub integration."
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
          editMode === "configuration"
            ? "Edit Configuration"
            : editMode === "credentials"
              ? "Edit Credentials"
              : editingIntegration
                ? "Edit Security Hub Integration"
                : "Add Security Hub Integration"
        }
      >
        <SecurityHubIntegrationForm
          integration={editingIntegration}
          providers={providers}
          existingIntegrations={integrations}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
          editMode={editMode}
        />
      </CustomAlertModal>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Configured Security Hub Integrations
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

        {isOperationLoading ? (
          <IntegrationSkeleton
            variant="manager"
            count={integrations.length || 1}
            icon={<AWSSecurityHubIcon size={32} />}
            title="AWS Security Hub"
            subtitle="Send security findings to AWS Security Hub."
          />
        ) : integrations.length > 0 ? (
          <div className="grid gap-4">
            {integrations.map((integration) => {
              const enabledRegions = getEnabledRegions(integration);
              const providerDetails = getProviderDetails(integration);

              return (
                <Card key={integration.id} variant="base">
                  <CardHeader>
                    <IntegrationCardHeader
                      icon={<AWSSecurityHubIcon size={32} />}
                      title={providerDetails.displayName}
                      subtitle={
                        providerDetails.accountId && providerDetails.alias
                          ? `Account ID: ${providerDetails.accountId}`
                          : "AWS Security Hub Integration"
                      }
                      chips={[
                        {
                          label: integration.attributes.configuration
                            .send_only_fails
                            ? "Failed Only"
                            : "All Findings",
                        },
                        {
                          label: integration.attributes.configuration
                            .archive_previous_findings
                            ? "Archive Previous"
                            : "Keep Previous",
                        },
                      ]}
                      connectionStatus={{
                        connected: integration.attributes.connected,
                      }}
                    />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col gap-3">
                      {enabledRegions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {enabledRegions.map((region) => (
                            <Chip
                              key={region}
                              size="sm"
                              variant="flat"
                              className="bg-bg-neutral-secondary"
                            >
                              {region}
                            </Chip>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                          {integration.attributes.updated_at && (
                            <p>
                              <span className="font-medium">Last updated:</span>{" "}
                              {format(
                                new Date(integration.attributes.updated_at),
                                "yyyy/MM/dd",
                              )}
                            </p>
                          )}
                        </div>
                        <IntegrationActionButtons
                          integration={integration}
                          onTestConnection={handleTestConnection}
                          onEditConfiguration={handleEditConfiguration}
                          onEditCredentials={handleEditCredentials}
                          onToggleEnabled={handleToggleEnabled}
                          onDelete={handleOpenDeleteModal}
                          isTesting={isTesting === integration.id}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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

---[FILE: index.ts]---
Location: prowler-master/ui/components/integrations/shared/index.ts

```typescript
export { IntegrationActionButtons } from "./integration-action-buttons";
export { IntegrationCardHeader } from "./integration-card-header";
export { IntegrationSkeleton } from "./integration-skeleton";
export { LinkCard } from "./link-card";
```

--------------------------------------------------------------------------------

---[FILE: integration-action-buttons.tsx]---
Location: prowler-master/ui/components/integrations/shared/integration-action-buttons.tsx

```typescript
"use client";

import {
  LockIcon,
  Power,
  SettingsIcon,
  TestTube,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/shadcn";
import { IntegrationProps } from "@/types/integrations";

interface IntegrationActionButtonsProps {
  integration: IntegrationProps;
  onTestConnection: (id: string) => void;
  onEditConfiguration?: (integration: IntegrationProps) => void;
  onEditCredentials: (integration: IntegrationProps) => void;
  onToggleEnabled: (integration: IntegrationProps) => void;
  onDelete: (integration: IntegrationProps) => void;
  isTesting?: boolean;
  showCredentialsButton?: boolean;
}

export const IntegrationActionButtons = ({
  integration,
  onTestConnection,
  onEditConfiguration,
  onEditCredentials,
  onToggleEnabled,
  onDelete,
  isTesting = false,
  showCredentialsButton = true,
}: IntegrationActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onTestConnection(integration.id)}
        disabled={!integration.attributes.enabled || isTesting}
        className="w-full sm:w-auto"
      >
        <TestTube size={14} />
        {isTesting ? "Testing..." : "Test"}
      </Button>
      {onEditConfiguration && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEditConfiguration(integration)}
          className="w-full sm:w-auto"
        >
          <SettingsIcon size={14} />
          Config
        </Button>
      )}
      {showCredentialsButton && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEditCredentials(integration)}
          className="w-full sm:w-auto"
        >
          <LockIcon size={14} />
          Credentials
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onToggleEnabled(integration)}
        disabled={isTesting}
        className="w-full sm:w-auto"
      >
        <Power size={14} />
        {integration.attributes.enabled ? "Disable" : "Enable"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDelete(integration)}
        className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
      >
        <Trash2Icon size={14} />
        Delete
      </Button>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: integration-card-header.tsx]---
Location: prowler-master/ui/components/integrations/shared/integration-card-header.tsx
Signals: React

```typescript
"use client";

import { Chip } from "@heroui/chip";
import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";

interface IntegrationCardHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  chips?: Array<{
    label: string;
    color?:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger";
    variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow";
  }>;
  connectionStatus?: {
    connected: boolean;
    label?: string;
  };
  navigationUrl?: string;
}

export const IntegrationCardHeader = ({
  icon,
  title,
  subtitle,
  chips = [],
  connectionStatus,
  navigationUrl,
}: IntegrationCardHeaderProps) => {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-md font-semibold">{title}</h4>
            {navigationUrl && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white"
                href={navigationUrl}
                aria-label="open bucket in new tab"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {(chips.length > 0 || connectionStatus) && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip, index) => (
            <Chip
              key={index}
              size="sm"
              variant={chip.variant || "flat"}
              color={chip.color || "default"}
              className="text-xs"
            >
              {chip.label}
            </Chip>
          ))}
          {connectionStatus && (
            <Chip
              size="sm"
              color={connectionStatus.connected ? "success" : "danger"}
              variant="flat"
            >
              {connectionStatus.label ||
                (connectionStatus.connected ? "Connected" : "Disconnected")}
            </Chip>
          )}
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

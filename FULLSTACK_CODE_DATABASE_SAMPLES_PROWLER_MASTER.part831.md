---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 831
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 831 of 867)

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

---[FILE: add-via-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/add-via-credentials-form.tsx

```typescript
"use client";

import { addCredentialsProvider } from "@/actions/providers/providers";
import { ProviderType } from "@/types";

import { BaseCredentialsForm } from "./base-credentials-form";

export const AddViaCredentialsForm = ({
  searchParams,
  providerUid,
}: {
  searchParams: { type: string; id: string };
  providerUid?: string;
}) => {
  const providerType = searchParams.type as ProviderType;
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

---[FILE: add-via-role-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/add-via-role-form.tsx

```typescript
"use client";

import { addCredentialsProvider } from "@/actions/providers/providers";
import { ProviderType } from "@/types";

import { BaseCredentialsForm } from "./base-credentials-form";

export const AddViaRoleForm = ({
  searchParams,
  providerUid,
}: {
  searchParams: { type: string; id: string };
  providerUid?: string;
}) => {
  const providerType = searchParams.type as ProviderType;
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

---[FILE: base-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/base-credentials-form.tsx

```typescript
"use client";

import { Divider } from "@heroui/divider";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";
import { Control } from "react-hook-form";

import { Button } from "@/components/shadcn";
import { Form } from "@/components/ui/form";
import { useCredentialsForm } from "@/hooks/use-credentials-form";
import { getAWSCredentialsTemplateLinks } from "@/lib";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";
import { requiresBackButton } from "@/lib/provider-helpers";
import {
  AWSCredentials,
  AWSCredentialsRole,
  AzureCredentials,
  GCPDefaultCredentials,
  GCPServiceAccountKey,
  IacCredentials,
  KubernetesCredentials,
  M365CertificateCredentials,
  M365ClientSecretCredentials,
  MongoDBAtlasCredentials,
  OCICredentials,
  ProviderType,
} from "@/types";

import { ProviderTitleDocs } from "../provider-title-docs";
import { AWSStaticCredentialsForm } from "./select-credentials-type/aws/credentials-type";
import { AWSRoleCredentialsForm } from "./select-credentials-type/aws/credentials-type/aws-role-credentials-form";
import { GCPDefaultCredentialsForm } from "./select-credentials-type/gcp/credentials-type";
import { GCPServiceAccountKeyForm } from "./select-credentials-type/gcp/credentials-type/gcp-service-account-key-form";
import {
  M365CertificateCredentialsForm,
  M365ClientSecretCredentialsForm,
} from "./select-credentials-type/m365";
import { AzureCredentialsForm } from "./via-credentials/azure-credentials-form";
import { GitHubCredentialsForm } from "./via-credentials/github-credentials-form";
import { IacCredentialsForm } from "./via-credentials/iac-credentials-form";
import { KubernetesCredentialsForm } from "./via-credentials/k8s-credentials-form";
import { MongoDBAtlasCredentialsForm } from "./via-credentials/mongodbatlas-credentials-form";
import { OracleCloudCredentialsForm } from "./via-credentials/oraclecloud-credentials-form";

type BaseCredentialsFormProps = {
  providerType: ProviderType;
  providerId: string;
  providerUid?: string;
  onSubmit: (formData: FormData) => Promise<any>;
  successNavigationUrl: string;
  submitButtonText?: string;
  showBackButton?: boolean;
};

export const BaseCredentialsForm = ({
  providerType,
  providerId,
  providerUid,
  onSubmit,
  successNavigationUrl,
  submitButtonText = "Next",
  showBackButton = true,
}: BaseCredentialsFormProps) => {
  const {
    form,
    isLoading,
    handleSubmit,
    handleBackStep,
    searchParamsObj,
    externalId,
  } = useCredentialsForm({
    providerType,
    providerId,
    providerUid,
    onSubmit,
    successNavigationUrl,
  });

  const templateLinks = getAWSCredentialsTemplateLinks(externalId);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <input
          type="hidden"
          name={ProviderCredentialFields.PROVIDER_ID}
          value={providerId}
        />
        <input
          type="hidden"
          name={ProviderCredentialFields.PROVIDER_TYPE}
          value={providerType}
        />
        {providerUid && (
          <input
            type="hidden"
            name={ProviderCredentialFields.PROVIDER_UID}
            value={providerUid}
          />
        )}

        <ProviderTitleDocs providerType={providerType} />

        <Divider />

        {providerType === "aws" && searchParamsObj.get("via") === "role" && (
          <AWSRoleCredentialsForm
            control={form.control as unknown as Control<AWSCredentialsRole>}
            setValue={form.setValue as any}
            externalId={externalId}
            templateLinks={templateLinks}
          />
        )}
        {providerType === "aws" && searchParamsObj.get("via") !== "role" && (
          <AWSStaticCredentialsForm
            control={form.control as unknown as Control<AWSCredentials>}
          />
        )}
        {providerType === "azure" && (
          <AzureCredentialsForm
            control={form.control as unknown as Control<AzureCredentials>}
          />
        )}
        {providerType === "m365" &&
          searchParamsObj.get("via") === "app_client_secret" && (
            <M365ClientSecretCredentialsForm
              control={
                form.control as unknown as Control<M365ClientSecretCredentials>
              }
            />
          )}
        {providerType === "m365" &&
          searchParamsObj.get("via") === "app_certificate" && (
            <M365CertificateCredentialsForm
              control={
                form.control as unknown as Control<M365CertificateCredentials>
              }
            />
          )}
        {providerType === "gcp" &&
          searchParamsObj.get("via") === "service-account" && (
            <GCPServiceAccountKeyForm
              control={form.control as unknown as Control<GCPServiceAccountKey>}
            />
          )}
        {providerType === "gcp" &&
          searchParamsObj.get("via") !== "service-account" && (
            <GCPDefaultCredentialsForm
              control={
                form.control as unknown as Control<GCPDefaultCredentials>
              }
            />
          )}
        {providerType === "kubernetes" && (
          <KubernetesCredentialsForm
            control={form.control as unknown as Control<KubernetesCredentials>}
          />
        )}
        {providerType === "github" && (
          <GitHubCredentialsForm
            control={form.control}
            credentialsType={searchParamsObj.get("via") || undefined}
          />
        )}
        {providerType === "iac" && (
          <IacCredentialsForm
            control={form.control as unknown as Control<IacCredentials>}
          />
        )}
        {providerType === "oraclecloud" && (
          <OracleCloudCredentialsForm
            control={form.control as unknown as Control<OCICredentials>}
          />
        )}
        {providerType === "mongodbatlas" && (
          <MongoDBAtlasCredentialsForm
            control={
              form.control as unknown as Control<MongoDBAtlasCredentials>
            }
          />
        )}

        <div className="flex w-full justify-end gap-4">
          {showBackButton && requiresBackButton(searchParamsObj.get("via")) && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleBackStep}
              disabled={isLoading}
            >
              {!isLoading && <ChevronLeftIcon size={24} />}
              Back
            </Button>
          )}
          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ChevronRightIcon size={24} />
            )}
            {isLoading ? "Loading" : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: connect-account-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/connect-account-form.tsx
Signals: React, Next.js, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { addProvider } from "@/actions/providers/providers";
import { ProviderTitleDocs } from "@/components/providers/workflow/provider-title-docs";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { Form } from "@/components/ui/form";
import { addProviderFormSchema, ApiError, ProviderType } from "@/types";

import { RadioGroupProvider } from "../../radio-group-provider";

export type FormValues = z.infer<typeof addProviderFormSchema>;

// Helper function for labels and placeholders
const getProviderFieldDetails = (providerType?: ProviderType) => {
  switch (providerType) {
    case "aws":
      return {
        label: "Account ID",
        placeholder: "e.g. 123456789012",
      };
    case "gcp":
      return {
        label: "Project ID",
        placeholder: "e.g. my-gcp-project",
      };
    case "azure":
      return {
        label: "Subscription ID",
        placeholder: "e.g. fc94207a-d396-4a14-a7fd-12ab34cd56ef",
      };
    case "kubernetes":
      return {
        label: "Kubernetes Context",
        placeholder: "e.g. my-cluster-context",
      };
    case "m365":
      return {
        label: "Domain ID",
        placeholder: "e.g. your-domain.onmicrosoft.com",
      };
    case "github":
      return {
        label: "Username",
        placeholder: "e.g. your-github-username",
      };
    case "iac":
      return {
        label: "Repository URL",
        placeholder: "e.g. https://github.com/user/repo",
      };
    case "oraclecloud":
      return {
        label: "Tenancy OCID",
        placeholder: "e.g. ocid1.tenancy.oc1..aaaaaaa...",
      };
    case "mongodbatlas":
      return {
        label: "Organization ID",
        placeholder: "e.g. 5f43a8c4e1234567890abcde",
      };
    default:
      return {
        label: "Provider UID",
        placeholder: "Enter the provider UID",
      };
  }
};

export const ConnectAccountForm = () => {
  const { toast } = useToast();
  const [prevStep, setPrevStep] = useState(1);
  const router = useRouter();

  const formSchema = addProviderFormSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providerType: undefined,
      providerUid: "",
      providerAlias: "",
    },
  });

  const providerType = form.watch("providerType");
  const providerFieldDetails = getProviderFieldDetails(providerType);

  const isLoading = form.formState.isSubmitting;

  const onSubmitClient = async (values: FormValues) => {
    const formValues = { ...values };

    const formData = new FormData();
    Object.entries(formValues).forEach(
      ([key, value]) => value !== undefined && formData.append(key, value),
    );

    try {
      const data = await addProvider(formData);

      if (data?.errors && data.errors.length > 0) {
        // Handle server-side validation errors
        data.errors.forEach((error: ApiError) => {
          const errorMessage = error.detail;
          const pointer = error.source?.pointer;

          switch (pointer) {
            case "/data/attributes/provider":
              form.setError("providerType", {
                type: "server",
                message: errorMessage,
              });
              break;
            case "/data/attributes/uid":
            case "/data/attributes/__all__":
              form.setError("providerUid", {
                type: "server",
                message: errorMessage,
              });
              break;
            case "/data/attributes/alias":
              form.setError("providerAlias", {
                type: "server",
                message: errorMessage,
              });
              break;
            default:
              toast({
                variant: "destructive",
                title: "Oops! Something went wrong",
                description: errorMessage,
              });
          }
        });
        return;
      } else {
        // Go to the next step after successful submission
        const {
          id,
          attributes: { provider: providerType },
        } = data.data;

        router.push(`/providers/add-credentials?type=${providerType}&id=${id}`);
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Error during submission:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleBackStep = () => {
    setPrevStep((prev) => prev - 1);
    //Deselect the providerType if the user is going back to the first step
    if (prevStep === 2) {
      form.setValue("providerType", undefined as unknown as ProviderType);
    }
    // Reset the providerUid and providerAlias fields when going back
    form.setValue("providerUid", "");
    form.setValue("providerAlias", "");
  };

  useEffect(() => {
    if (providerType) {
      setPrevStep(2);
    }
  }, [providerType]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitClient)}
        className="flex flex-col gap-4"
      >
        {/* Step 1: Provider selection */}
        {prevStep === 1 && (
          <RadioGroupProvider
            control={form.control}
            isInvalid={!!form.formState.errors.providerType}
            errorMessage={form.formState.errors.providerType?.message}
          />
        )}
        {/* Step 2: UID, alias, and credentials (if AWS) */}
        {prevStep === 2 && (
          <>
            <ProviderTitleDocs providerType={providerType} />
            <CustomInput
              control={form.control}
              name="providerUid"
              type="text"
              label={providerFieldDetails.label}
              labelPlacement="inside"
              placeholder={providerFieldDetails.placeholder}
              variant="bordered"
              isRequired
            />
            <CustomInput
              control={form.control}
              name="providerAlias"
              type="text"
              label="Provider alias (optional)"
              labelPlacement="inside"
              placeholder="Enter the provider alias"
              variant="bordered"
              isRequired={false}
            />
          </>
        )}
        {/* Navigation buttons */}
        <div className="flex w-full justify-end gap-4">
          {/* Show "Back" button only in Step 2 */}
          {prevStep === 2 && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleBackStep}
              disabled={isLoading}
            >
              {!isLoading && <ChevronLeftIcon size={24} />}
              Back
            </Button>
          )}
          {/* Show "Next" button in Step 2 */}
          {prevStep === 2 && (
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ChevronRightIcon size={24} />
              )}
              {isLoading ? "Loading" : "Next"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/index.ts

```typescript
export * from "./add-via-credentials-form";
export * from "./add-via-role-form";
export * from "./connect-account-form";
export * from "./test-connection-form";
export * from "./update-via-credentials-form";
export * from "./update-via-role-form";
```

--------------------------------------------------------------------------------

---[FILE: test-connection-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/test-connection-form.tsx
Signals: React, Next.js, Zod

```typescript
"use client";

import { Checkbox } from "@heroui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  checkConnectionProvider,
  deleteCredentials,
} from "@/actions/providers";
import { scanOnDemand, scheduleDaily } from "@/actions/scans";
import { getTask } from "@/actions/task/tasks";
import { CheckIcon, RocketIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { Form } from "@/components/ui/form";
import { checkTaskStatus } from "@/lib/helper";
import { ProviderType } from "@/types";
import { ApiError, testConnectionFormSchema } from "@/types";

import { ProviderInfo } from "../..";

type FormValues = z.input<typeof testConnectionFormSchema>;

export const TestConnectionForm = ({
  searchParams,
  providerData,
}: {
  searchParams: { type: string; id: string; updated: string };
  providerData: {
    data: {
      id: string;
      type: string;
      attributes: {
        uid: string;
        connection: {
          connected: boolean | null;
          last_checked_at: string | null;
        };
        provider: ProviderType;
        alias: string;
        scanner_args: Record<string, unknown>;
      };
      relationships: {
        secret: {
          data: {
            type: string;
            id: string;
          } | null;
        };
      };
    };
  };
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const providerType = searchParams.type;
  const providerId = searchParams.id;

  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    error: string | null;
  } | null>(null);
  const [isResettingCredentials, setIsResettingCredentials] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const formSchema = testConnectionFormSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providerId,
      runOnce: false,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const isUpdated = searchParams?.updated === "true";

  const onSubmitClient = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("providerId", values.providerId);

    const data = await checkConnectionProvider(formData);

    if (data?.errors && data.errors.length > 0) {
      data.errors.forEach((error: ApiError) => {
        const errorMessage = error.detail;

        switch (errorMessage) {
          case "Not found.":
            setApiErrorMessage(errorMessage);
            break;
          default:
            toast({
              variant: "destructive",
              title: `Error ${error.status}`,
              description: errorMessage,
            });
        }
      });
    } else {
      const taskId = data.data.id;
      setApiErrorMessage(null);

      // Use the helper function to check the task status
      const taskResult = await checkTaskStatus(taskId);

      if (taskResult.completed) {
        const task = await getTask(taskId);
        const { connected, error } = task.data.attributes.result;

        setConnectionStatus({
          connected,
          error: connected ? null : error || "Unknown error",
        });

        if (connected && isUpdated) return router.push("/providers");

        if (connected && !isUpdated) {
          try {
            // Check if the runOnce checkbox is checked
            const runOnce = form.watch("runOnce");

            let data;

            if (runOnce) {
              data = await scanOnDemand(formData);
            } else {
              data = await scheduleDaily(formData);
            }

            if (data.error) {
              setApiErrorMessage(data.error);
              form.setError("providerId", {
                type: "server",
                message: data.error,
              });
            } else {
              setIsRedirecting(true);
              router.push("/scans");
            }
          } catch (error) {
            form.setError("providerId", {
              type: "server",
              message: "An unexpected error occurred. Please try again.",
            });
          }
        } else {
          setConnectionStatus({
            connected: false,
            error: error || "Connection failed, please review credentials.",
          });
        }
      } else {
        setConnectionStatus({
          connected: false,
          error: taskResult.error || "Unknown error",
        });
      }
    }
  };

  const onResetCredentials = async () => {
    setIsResettingCredentials(true);

    // Check if provider the provider has no credentials
    const providerSecretId =
      providerData?.data?.relationships?.secret?.data?.id;
    const hasNoCredentials = !providerSecretId;

    if (hasNoCredentials) {
      // If no credentials, redirect to add credentials page
      router.push(
        `/providers/add-credentials?type=${providerType}&id=${providerId}`,
      );
      return;
    }

    // If provider has credentials, delete them first
    try {
      await deleteCredentials(providerSecretId);
      // After successful deletion, redirect to add credentials page
      router.push(
        `/providers/add-credentials?type=${providerType}&id=${providerId}`,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete credentials:", error);
    } finally {
      setIsResettingCredentials(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="relative">
          <div className="bg-primary/20 h-24 w-24 animate-pulse rounded-full" />
          <div className="border-primary absolute inset-0 h-24 w-24 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
        <div className="text-center">
          <p className="text-primary text-xl font-medium">
            Scan initiated successfully
          </p>
          <p className="text-small mt-2 font-bold text-gray-500">
            Redirecting to scans job details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitClient)}
        className="flex flex-col gap-4"
      >
        <div className="text-left">
          <div className="mb-2 text-xl font-medium">
            {!isUpdated
              ? "Check connection and launch scan"
              : "Check connection"}
          </div>
          <p className="text-small text-default-500 py-2">
            {!isUpdated
              ? "After a successful connection, a scan will automatically run every 24 hours. To run a single scan instead, select the checkbox below."
              : "A successful connection will redirect you to the providers page."}
          </p>
        </div>

        {apiErrorMessage && (
          <div className="text-text-error-primary mt-4 rounded-md p-3">
            <p>{`Provider ID ${apiErrorMessage?.toLowerCase()}. Please check and try again.`}</p>
          </div>
        )}

        {connectionStatus && !connectionStatus.connected && (
          <>
            <div className="border-border-error flex items-start gap-4 rounded-lg border p-4">
              <div className="flex shrink-0 items-center">
                <Icon
                  icon="heroicons:exclamation-circle"
                  className="text-text-error-primary h-5 w-5"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-small text-text-error-primary break-words">
                  {connectionStatus.error || "Unknown error"}
                </p>
              </div>
            </div>
            <p className="text-small text-text-error-primary">
              It seems there was an issue with your credentials. Please review
              your credentials and try again.
            </p>
          </>
        )}

        <ProviderInfo
          connected={providerData.data.attributes.connection.connected}
          provider={providerData.data.attributes.provider}
          providerAlias={providerData.data.attributes.alias}
          providerUID={providerData.data.attributes.uid}
        />

        {!isUpdated && !connectionStatus?.error && (
          <Checkbox
            {...form.register("runOnce")}
            isSelected={!!form.watch("runOnce")}
            classNames={{
              label: "text-small",
              wrapper: "checkbox-update",
            }}
            color="default"
          >
            Run a single scan (no recurring schedule).
          </Checkbox>
        )}

        {isUpdated && !connectionStatus?.error && (
          <p className="text-small text-default-500 py-2">
            Check the new credentials and test the connection.
          </p>
        )}

        <input type="hidden" name="providerId" value={providerId} />

        <div className="flex w-full justify-end sm:gap-6">
          {apiErrorMessage ? (
            <CustomLink
              href="/providers"
              target="_self"
              className="mr-3 flex w-fit items-center justify-center gap-2 rounded-lg border border-solid border-gray-200 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Icon
                icon="icon-park-outline:close-small"
                className="h-5 w-5 text-gray-600 dark:text-gray-400"
              />
              <span>Back to providers</span>
            </CustomLink>
          ) : connectionStatus?.error ? (
            <Button
              onClick={isUpdated ? () => router.back() : onResetCredentials}
              type="button"
              variant="secondary"
              size="lg"
              disabled={isResettingCredentials}
            >
              {isResettingCredentials ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckIcon size={24} />
              )}
              {isResettingCredentials
                ? "Loading"
                : isUpdated
                  ? "Update credentials"
                  : "Reset credentials"}
            </Button>
          ) : (
            <Button
              type={
                isUpdated && connectionStatus?.connected ? "button" : "submit"
              }
              variant="default"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                !isUpdated && <RocketIcon size={24} />
              )}
              {isLoading
                ? "Loading"
                : isUpdated
                  ? "Check connection"
                  : "Launch scan"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: update-via-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/update-via-credentials-form.tsx

```typescript
"use client";

import { updateCredentialsProvider } from "@/actions/providers/providers";
import { ProviderType } from "@/types";

import { BaseCredentialsForm } from "./base-credentials-form";

export const UpdateViaCredentialsForm = ({
  searchParams,
}: {
  searchParams: { type: string; id: string; secretId?: string };
}) => {
  const providerType = searchParams.type as ProviderType;
  const providerId = searchParams.id;
  const providerSecretId = searchParams.secretId || "";

  const handleUpdateCredentials = async (formData: FormData) => {
    return await updateCredentialsProvider(providerSecretId, formData);
  };

  const successNavigationUrl = `/providers/test-connection?type=${providerType}&id=${providerId}&updated=true`;

  return (
    <BaseCredentialsForm
      providerType={providerType}
      providerId={providerId}
      onSubmit={handleUpdateCredentials}
      successNavigationUrl={successNavigationUrl}
      submitButtonText="Next"
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: update-via-role-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/update-via-role-form.tsx

```typescript
"use client";

import { updateCredentialsProvider } from "@/actions/providers/providers";
import { ProviderType } from "@/types";

import { BaseCredentialsForm } from "./base-credentials-form";

export const UpdateViaRoleForm = ({
  searchParams,
}: {
  searchParams: { type: string; id: string; secretId?: string };
}) => {
  const providerType = searchParams.type as ProviderType;
  const providerId = searchParams.id;
  const providerSecretId = searchParams.secretId || "";

  const handleUpdateCredentials = async (formData: FormData) => {
    return await updateCredentialsProvider(providerSecretId, formData);
  };

  const successNavigationUrl = `/providers/test-connection?type=${providerType}&id=${providerId}&updated=true`;

  return (
    <BaseCredentialsForm
      providerType={providerType}
      providerId={providerId}
      onSubmit={handleUpdateCredentials}
      successNavigationUrl={successNavigationUrl}
      submitButtonText="Next"
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: update-via-service-account-key-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/update-via-service-account-key-form.tsx

```typescript
"use client";

import { updateCredentialsProvider } from "@/actions/providers/providers";
import { ProviderType } from "@/types";

import { BaseCredentialsForm } from "./base-credentials-form";

export const UpdateViaServiceAccountForm = ({
  searchParams,
}: {
  searchParams: { type: string; id: string; secretId?: string };
}) => {
  const providerType = searchParams.type as ProviderType;
  const providerId = searchParams.id;
  const providerSecretId = searchParams.secretId || "";

  const handleUpdateCredentials = async (formData: FormData) => {
    return await updateCredentialsProvider(providerSecretId, formData);
  };

  const successNavigationUrl = `/providers/test-connection?type=${providerType}&id=${providerId}&updated=true`;

  return (
    <BaseCredentialsForm
      providerType={providerType}
      providerId={providerId}
      onSubmit={handleUpdateCredentials}
      successNavigationUrl={successNavigationUrl}
      submitButtonText="Next"
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/aws/index.ts

```typescript
export * from "./radio-group-aws-via-credentials-type-form";
export * from "./select-via-aws";
```

--------------------------------------------------------------------------------

---[FILE: radio-group-aws-via-credentials-type-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/aws/radio-group-aws-via-credentials-type-form.tsx
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

export const RadioGroupAWSViaCredentialsTypeForm = ({
  control,
  isInvalid,
  errorMessage,
  onChange,
}: RadioGroupAWSViaCredentialsFormProps) => {
  return (
    <Controller
      name="awsCredentialsType"
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
              <span className="text-default-500 text-sm">Using IAM Role</span>
              <CustomRadio description="Connect assuming IAM Role" value="role">
                <div className="flex items-center">
                  <span className="ml-2">Connect assuming IAM Role</span>
                </div>
              </CustomRadio>
              <span className="text-default-500 text-sm">
                Using Credentials
              </span>
              <CustomRadio
                description="Connect via Credentials"
                value="credentials"
              >
                <div className="flex items-center">
                  <span className="ml-2">Connect via Credentials</span>
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

---[FILE: select-via-aws.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/select-credentials-type/aws/select-via-aws.tsx
Signals: Next.js

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { RadioGroupAWSViaCredentialsTypeForm } from "./radio-group-aws-via-credentials-type-form";

interface SelectViaAWSProps {
  initialVia?: string;
}

export const SelectViaAWS = ({ initialVia }: SelectViaAWSProps) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      awsCredentialsType: initialVia || "",
    },
  });

  const handleSelectionChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("via", value);
    router.push(url.toString());
  };

  return (
    <Form {...form}>
      <RadioGroupAWSViaCredentialsTypeForm
        control={form.control}
        isInvalid={!!form.formState.errors.awsCredentialsType}
        errorMessage={form.formState.errors.awsCredentialsType?.message}
        onChange={handleSelectionChange}
      />
    </Form>
  );
};
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 820
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 820 of 867)

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

---[FILE: s3-integrations-manager.tsx]---
Location: prowler-master/ui/components/integrations/s3/s3-integrations-manager.tsx
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
import { AmazonS3Icon } from "@/components/icons/services/IconServices";
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
import { S3IntegrationForm } from "./s3-integration-form";

interface S3IntegrationsManagerProps {
  integrations: IntegrationProps[];
  providers: ProviderProps[];
  metadata?: MetaDataProps;
}

export const S3IntegrationsManager = ({
  integrations,
  providers,
  metadata,
}: S3IntegrationsManagerProps) => {
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
    setEditMode(null); // Creation mode
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
      const result = await deleteIntegration(id, "amazon_s3");

      if (result.success) {
        toast({
          title: "Success!",
          description: "S3 integration deleted successfully.",
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
        description: "Failed to delete S3 integration. Please try again.",
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
      "s3",
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
        title="Delete S3 Integration"
        description="This action cannot be undone. This will permanently delete your S3 integration."
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
                ? "Edit S3 Integration"
                : "Add S3 Integration"
        }
      >
        <S3IntegrationForm
          integration={editingIntegration}
          providers={providers}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
          editMode={editMode}
        />
      </CustomAlertModal>

      <div className="flex flex-col gap-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Configured S3 Integrations
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
            icon={<AmazonS3Icon size={32} />}
            title="Amazon S3"
            subtitle="Export security findings to Amazon S3 buckets."
          />
        ) : integrations.length > 0 ? (
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} variant="base">
                <CardHeader>
                  <IntegrationCardHeader
                    icon={<AmazonS3Icon size={32} />}
                    title={
                      integration.attributes.configuration.bucket_name ||
                      "Unknown Bucket"
                    }
                    subtitle={`Output directory: ${
                      integration.attributes.configuration.output_directory ||
                      integration.attributes.configuration.path ||
                      "/"
                    }`}
                    connectionStatus={{
                      connected: integration.attributes.connected,
                    }}
                    navigationUrl={`https://console.aws.amazon.com/s3/buckets/${integration.attributes.configuration.bucket_name}`}
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
                      onEditConfiguration={handleEditConfiguration}
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

---[FILE: saml-config-form.tsx]---
Location: prowler-master/ui/components/integrations/saml/saml-config-form.tsx
Signals: React, Zod

```typescript
"use client";

import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { z } from "zod";

import { createSamlConfig, updateSamlConfig } from "@/actions/integrations";
import { AddIcon } from "@/components/icons";
import { Button, Card, CardContent, CardHeader } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomServerInput } from "@/components/ui/custom";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { SnippetChip } from "@/components/ui/entities";
import { FormButtons } from "@/components/ui/form";
import { apiBaseUrl } from "@/lib";

const validateXMLContent = (
  xmlContent: string,
): { isValid: boolean; error?: string } => {
  try {
    // Basic checks
    if (!xmlContent || !xmlContent.trim()) {
      return {
        isValid: false,
        error: "XML content is empty.",
      };
    }

    const trimmedContent = xmlContent.trim();

    // Check if it starts and ends with XML tags
    if (!trimmedContent.startsWith("<") || !trimmedContent.endsWith(">")) {
      return {
        isValid: false,
        error: "Content does not appear to be valid XML format.",
      };
    }

    // Use DOMParser to validate XML structure
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    // Check for parser errors
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      const errorText = parserError.textContent || "Unknown XML parsing error";
      return {
        isValid: false,
        error: `XML parsing error: ${errorText.substring(0, 100)}...`,
      };
    }

    // Check if the document has a root element
    if (!xmlDoc.documentElement) {
      return {
        isValid: false,
        error: "XML does not have a valid root element.",
      };
    }

    // Optional: Check for basic SAML metadata structure
    const rootElement = xmlDoc.documentElement;
    const rootTagName = rootElement.tagName.toLowerCase();

    // Check if it looks like SAML metadata (common root elements)
    const samlRootElements = [
      "entitydescriptor",
      "entitiesDescriptor",
      "metadata",
      "md:entitydescriptor",
      "md:entitiesdescriptor",
    ];

    const isSamlMetadata = samlRootElements.some((element) =>
      rootTagName.includes(element.toLowerCase()),
    );

    if (!isSamlMetadata) {
      // Check for common SAML namespace attributes
      const xmlString = xmlContent.toLowerCase();
      const hasSamlNamespace =
        xmlString.includes("saml") ||
        xmlString.includes("urn:oasis:names:tc:saml") ||
        xmlString.includes("metadata");

      if (!hasSamlNamespace) {
        return {
          isValid: false,
          error:
            "The XML file does not appear to be SAML metadata. Please ensure you're uploading the correct SAML metadata file from your Identity Provider.",
        };
      }
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to validate XML content.",
    };
  }
};

export const SamlConfigForm = ({
  setIsOpen,
  samlConfig,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  samlConfig?: any;
}) => {
  const [state, formAction, isPending] = useActionState(
    samlConfig?.id ? updateSamlConfig : createSamlConfig,
    null,
  );
  const [emailDomain, setEmailDomain] = useState(
    samlConfig?.attributes?.email_domain || "",
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [clientErrors, setClientErrors] = useState<{
    email_domain?: string | null;
    metadata_xml?: string | null;
  }>({});
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  // Client-side validation function
  const validateFields = (email: string, hasFile: boolean) => {
    // Validar cada campo por separado para poder limpiarlos individualmente
    const emailValidation = z
      .string()
      .trim()
      .min(1, { message: "Email domain is required" })
      .safeParse(email);
    const metadataValidation = z
      .string()
      .trim()
      .min(1, { message: "Metadata XML is required" })
      .safeParse(hasFile ? "dummy_xml_content" : "");

    const newErrors = {
      email_domain: emailValidation.success
        ? null
        : emailValidation.error.issues[0]?.message,
      metadata_xml: metadataValidation.success
        ? null
        : metadataValidation.error.issues[0]?.message,
    };

    setClientErrors(newErrors);
  };

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Configuration saved successfully",
        description: state.success,
      });
      setIsOpen(false);
    } else if (state?.errors?.general) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: state.errors.general,
      });
    }
  }, [state, toast, setIsOpen]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setUploadedFile(null);
      validateFields(emailDomain, false);
      return;
    }

    // Check file extension
    const isXmlFile =
      file.name.toLowerCase().endsWith(".xml") ||
      file.type === "text/xml" ||
      file.type === "application/xml";

    if (!isXmlFile) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a valid XML file (.xml extension).",
      });
      // Clear the file input
      event.target.value = "";
      setUploadedFile(null);
      validateFields(emailDomain, false);

      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      // Comprehensive XML validation
      const xmlValidationResult = validateXMLContent(content);
      if (!xmlValidationResult.isValid) {
        toast({
          variant: "destructive",
          title: "Invalid XML content",
          description: xmlValidationResult.error,
        });
        // Clear the file input
        event.target.value = "";
        setUploadedFile(null);
        validateFields(emailDomain, false);
        return;
      }

      // Set the XML content in a hidden input
      const xmlInput = document.getElementById(
        "metadata_xml",
      ) as HTMLInputElement;
      if (xmlInput) {
        xmlInput.value = content;
      }

      setUploadedFile(file);
      validateFields(emailDomain, true);

      toast({
        title: "File uploaded successfully",
        description: "XML metadata file has been loaded.",
      });
    };

    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "File read error",
        description: "Failed to read the selected file.",
      });
      // Clear the file input
      event.target.value = "";
      setUploadedFile(null);
      validateFields(emailDomain, false);
    };

    reader.readAsText(file);
  };

  const acsUrl = emailDomain
    ? `${apiBaseUrl}/accounts/saml/${emailDomain}/acs/`
    : `${apiBaseUrl}/accounts/saml/your-domain.com/acs/`;

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <div className="py-1 text-xs">
        Need help configuring SAML SSO?{" "}
        <CustomLink
          href={
            "https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-sso/"
          }
        >
          Read the docs
        </CustomLink>
      </div>
      <input type="hidden" name="id" value={samlConfig?.id || ""} />
      <CustomServerInput
        name="email_domain"
        label="Email Domain"
        placeholder="Enter your email domain (e.g., company.com)"
        labelPlacement="outside"
        variant="bordered"
        isRequired={true}
        isInvalid={
          !!(clientErrors.email_domain === null
            ? undefined
            : clientErrors.email_domain || state?.errors?.email_domain)
        }
        errorMessage={
          clientErrors.email_domain === null
            ? undefined
            : clientErrors.email_domain || state?.errors?.email_domain
        }
        value={emailDomain}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          setEmailDomain(newValue);
        }}
      />

      <Card variant="inner">
        <CardHeader className="mb-2">
          Identity Provider Configuration
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                ACS URL:
              </span>
              <SnippetChip
                value={acsUrl}
                ariaLabel="Copy ACS URL to clipboard"
                className="h-10 w-full"
              />
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Audience:
              </span>
              <SnippetChip
                value="urn:prowler.com:sp"
                ariaLabel="Copy Audience to clipboard"
                className="h-10 w-full"
              />
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name ID Format:
              </span>
              <span className="w-full text-sm text-gray-600 dark:text-gray-400">
                urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
              </span>
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Supported Assertion Attributes:
              </span>
              <ul className="ml-4 flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• firstName</li>
                <li>• lastName</li>
                <li>• userType</li>
                <li>• organization</li>
              </ul>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <strong>Note:</strong> The userType attribute will be used to
                assign the user&apos;s role. If the role does not exist, one
                will be created with minimal permissions. You can assign
                permissions to roles on the{" "}
                <CustomLink href="/roles" target="_self">
                  <span>Roles</span>
                </CustomLink>{" "}
                page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col items-start gap-2">
        <span className="text-xs text-gray-700 dark:text-gray-300">
          Metadata XML File <span className="text-red-500">*</span>
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => {
            const fileInput = document.getElementById(
              "metadata_xml_file",
            ) as HTMLInputElement;
            if (fileInput) {
              fileInput.click();
            }
          }}
          className={`justify-start gap-2 ${
            (
              clientErrors.metadata_xml === null
                ? undefined
                : clientErrors.metadata_xml || state?.errors?.metadata_xml
            )
              ? "border-red-500"
              : uploadedFile
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : ""
          }`}
        >
          <AddIcon size={20} />
          <span className="text-sm">
            {uploadedFile ? (
              <span className="flex items-center gap-2">
                <span className="max-w-36 truncate">{uploadedFile.name}</span>
              </span>
            ) : (
              "Choose File"
            )}
          </span>
        </Button>

        <input
          type="file"
          id="metadata_xml_file"
          name="metadata_xml_file"
          accept=".xml,application/xml,text/xml"
          className="hidden"
          disabled={isPending}
          onChange={handleFileUpload}
        />
        <input type="hidden" id="metadata_xml" name="metadata_xml" />
        <p className="text-xs text-gray-500">
          Upload your Identity Provider&apos;s SAML metadata XML file
        </p>
        <span className="text-xs text-red-500">
          {(() => {
            const finalError =
              clientErrors.metadata_xml === null
                ? undefined
                : clientErrors.metadata_xml || state?.errors?.metadata_xml;
            return finalError;
          })()}
        </span>
      </div>
      <FormButtons
        setIsOpen={setIsOpen}
        submitText={samlConfig?.id ? "Update" : "Save"}
      />
    </form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: saml-integration-card.tsx]---
Location: prowler-master/ui/components/integrations/saml/saml-integration-card.tsx
Signals: React

```typescript
"use client";

import { CheckIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { deleteSamlConfig } from "@/actions/integrations";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomAlertModal } from "@/components/ui/custom";
import { CustomLink } from "@/components/ui/custom/custom-link";

import { Card, CardContent, CardHeader } from "../../shadcn";
import { SamlConfigForm } from "./saml-config-form";

export const SamlIntegrationCard = ({ samlConfig }: { samlConfig?: any }) => {
  const [isSamlModalOpen, setIsSamlModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const id = samlConfig?.id;

  const handleRemoveSaml = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const result = await deleteSamlConfig(id);

      if (result.success) {
        toast({
          title: "SAML configuration removed",
          description: result.success,
        });
      } else if (result.errors?.general) {
        toast({
          variant: "destructive",
          title: "Error removing SAML configuration",
          description: result.errors.general,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove SAML configuration. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <CustomAlertModal
        isOpen={isSamlModalOpen}
        onOpenChange={setIsSamlModalOpen}
        title="Configure SAML SSO"
      >
        <SamlConfigForm
          setIsOpen={setIsSamlModalOpen}
          samlConfig={samlConfig}
        />
      </CustomAlertModal>

      <Card variant="base" padding="lg">
        <CardHeader>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold">SAML SSO Integration</h4>
              {id && <CheckIcon className="text-button-primary" size={20} />}
            </div>
            <p className="text-xs text-gray-500">
              {id ? (
                "SAML Single Sign-On is enabled for this organization"
              ) : (
                <>
                  Configure SAML Single Sign-On for secure authentication.{" "}
                  <CustomLink href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-sso">
                    Read the docs
                  </CustomLink>
                </>
              )}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Status: </span>
              <span className={id ? "text-button-primary" : "text-gray-500"}>
                {id ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setIsSamlModalOpen(true)}>
                {id ? "Update" : "Enable"}
              </Button>
              {id && (
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleRemoveSaml}
                >
                  {!isDeleting && <Trash2Icon size={16} />}
                  {isDeleting ? "Removing..." : "Remove"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: security-hub-integration-card.tsx]---
Location: prowler-master/ui/components/integrations/security-hub/security-hub-integration-card.tsx
Signals: Next.js

```typescript
"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import { AWSSecurityHubIcon } from "@/components/icons/services/IconServices";
import { Button } from "@/components/shadcn";
import { CustomLink } from "@/components/ui/custom/custom-link";

import { Card, CardContent, CardHeader } from "../../shadcn";

export const SecurityHubIntegrationCard = () => {
  return (
    <Card variant="base" padding="lg">
      <CardHeader>
        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AWSSecurityHubIcon size={40} />
            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                AWS Security Hub
              </h4>
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <p className="text-xs text-nowrap text-gray-500 dark:text-gray-300">
                  Send security findings to AWS Security Hub.
                </p>
                <CustomLink
                  href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-security-hub-integration/"
                  aria-label="Learn more about Security Hub integration"
                  size="xs"
                >
                  Learn more
                </CustomLink>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button asChild size="sm">
              <Link href="/integrations/aws-security-hub">
                <SettingsIcon size={14} />
                Manage
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Configure and manage your AWS Security Hub integrations to
          automatically send security findings for centralized monitoring.
        </p>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

````

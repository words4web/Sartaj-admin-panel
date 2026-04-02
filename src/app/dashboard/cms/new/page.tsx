"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import CmsForm from "../_components/CmsForm";
import { useCreateCms } from "@/services/cms/cms.hooks";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

export default function NewCmsPage() {
  const router = useRouter();
  const createMutation = useCreateCms();

  const handleCreate = async (values: any) => {
    try {
      await createMutation?.mutateAsync?.(values, {
        onSuccess: () => router?.push?.(ROUTES?.CMS?.LIST),
      });
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Add New Page"
        description="Create a new dynamic HTML content page"
        showBack={true}
        backRoute={ROUTES?.CMS?.LIST}
      />

      <Card className="p-6">
        <CmsForm
          initialValues={{ title: "", slug: "", content: "" }}
          onSubmit={handleCreate}
          isSubmitting={createMutation?.isPending}
        />
      </Card>
    </div>
  );
}

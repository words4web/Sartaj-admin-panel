"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import CmsForm from "../_components/CmsForm";
import { useCreateCms } from "@/services/cms/cms.hooks";
import { ROUTES } from "@/constants/routes";
import DashboardNotFound from "../../not-found";

export default function NewCmsPage() {
  const createMutation = useCreateCms();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Add New Page"
        description="Create a new dynamic HTML content page"
        showBack={true}
        backRoute={ROUTES.CMS.LIST}
      />

      <Card className="p-6">
        <DashboardNotFound />
        {/* <CmsForm
          initialValues={{ title: "", slug: "", content: "" }}
          onSubmit={handleCreate}
          isSubmitting={createMutation.isPending}
        /> */}
      </Card>
    </div>
  );
}

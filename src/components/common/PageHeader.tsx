"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  backRoute?: string;
  actions?: React.ReactNode;
  editRoute?: string;
  onEdit?: () => void;
  addRoute?: string;
  onAdd?: () => void;
  onDelete?: () => void;
  addLabel?: string;
  showBack?: boolean;
  onBackClick?: () => void;
}

export function PageHeader({
  title,
  description,
  backRoute,
  actions,
  editRoute,
  onEdit,
  addRoute,
  onAdd,
  onDelete,
  addLabel = "Add",
  showBack = true,
  onBackClick,
}: PageHeaderProps) {
  const router = useRouter();

  useEffect(() => {
    if (title) {
      document.title = `${title} | Sartaj Admin`;
    }
  }, [title]);

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backRoute) {
      router.push(backRoute);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-4">
      {showBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
      )}

      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>

      {actions && <div>{actions}</div>}

      <div className="flex items-center gap-2">
        {onDelete && (
          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={onDelete}>
            <Trash2 size={16} />
            Delete
          </Button>
        )}

        {(editRoute || onEdit) && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => (editRoute ? router.push(editRoute) : onEdit?.())}>
            <Pencil size={16} />
            Edit
          </Button>
        )}

        {(addRoute || onAdd) && (
          <Button
            className="flex items-center gap-2"
            onClick={() => (addRoute ? router.push(addRoute) : onAdd?.())}>
            <Plus size={16} />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

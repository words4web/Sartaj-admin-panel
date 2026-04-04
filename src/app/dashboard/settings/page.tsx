"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { authService } from "@/services/auth/auth.service";

export default function SettingsPage() {
  const { user, logout, getProfile, isLoading, error } = useAuthStore();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } finally {
      logout();
      router.push(ROUTES.LOGIN);
    }
  };

  if (isLoading && !user) {
    return <CommonLoader message="Fetching your profile..." />;
  }

  if (error) {
    return (
      <CommonError
        message={error}
        onRetry={() => getProfile()}
        fullScreen={false}
      />
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      {/* Profile Details (structured info) */}
      <Card className="p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Account Details
        </h2>

        <div className="space-y-4">
          <InfoRow icon={User} label="Full Name" value={user?.name} />
          <InfoRow icon={Mail} label="Email Address" value={user?.email} />
          <InfoRow icon={Shield} label="Role" value={user?.role} />
        </div>
      </Card>

      <Card className="p-6 border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Session</h2>
            <p className="text-sm text-gray-500 mt-1">
              You can log out from your current session anytime.
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={() => setIsLogoutModalOpen(true)}
            disabled={isLoggingOut}
            className="w-full md:w-32 gap-2">
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </Card>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        open={isLogoutModalOpen}
        title="Confirm Logout"
        description="Are you sure you want to log out? You will need to sign in again to access your account."
        confirmLabel="Logout"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        destructive
      />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
      <div className="flex items-center gap-4">
        {/* Icon container */}
        <div className="p-2 rounded-lg bg-white border border-gray-200">
          <Icon className="w-4 h-4 text-primary" />
        </div>

        {/* Text */}
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm font-medium text-gray-900">{value || "-"}</p>
        </div>
      </div>
    </div>
  );
}

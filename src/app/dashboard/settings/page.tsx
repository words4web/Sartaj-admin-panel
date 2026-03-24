"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function SettingsPage() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handlePasswordChange = () => {
    toast.info("Will be added soon");
  };

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Security Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">
                Change your password regularly
              </p>
            </div>
            <Button variant="outline" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      <Button
        variant="destructive"
        onClick={handleLogout}
        className="cursor-pointer text-lg p-6">
        Logout
      </Button>
    </div>
  );
}

import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login - Sartaj Foods Admin",
  description: "Admin login for Sartaj Foods management panel",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-2">
            <Image
              src="/sartaj_logo.png"
              alt="Sartaj Foods"
              width={164}
              height={70}
              priority
              className="rounded-lg object-contain"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sartaj Foods
            </h1>
            <p className="text-gray-600">Admin Management Panel</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home, SearchX } from "lucide-react";
import { ROUTES } from "@/constants/routes";

/**
 * Dashboard-specific 404 page.
 * This ensures that when a user hits a non-existent dashboard route,
 * the Sidebar and Header remain visible, providing a better user experience.
 */
export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-blue-50/50 p-8 rounded-full mb-6 border border-blue-100/50">
        <SearchX className="h-16 w-16 text-blue-600/30" />
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
        Resource Not Found
      </h1>
      <p className="text-gray-600 max-w-md mx-auto mb-10 leading-relaxed text-lg">
        The feature or data you're looking for doesn't exist within the admin
        dashboard. It might have been moved or you might not have permission to
        view it.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          size="lg"
          className="px-8 border-gray-200 hover:bg-gray-50 transition-colors hover:text-black cursor-pointer"
          onClick={() => window.history.back()}>
          <MoveLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button
          asChild
          size="lg"
          className="px-8 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95">
          <Link href={ROUTES.DASHBOARD}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard Home
          </Link>
        </Button>
      </div>

      <div className="mt-20 opacity-0 animate-in fade-in duration-1000 delay-500">
        <p className="text-sm font-medium text-gray-400">
          Technical Error Code: 404_DASHBOARD_MISSING
        </p>
      </div>
    </div>
  );
}

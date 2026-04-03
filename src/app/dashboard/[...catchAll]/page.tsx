import { notFound } from "next/navigation";

/**
 * Catch-all route for the dashboard.
 * Any URL under /dashboard/* that doesn't match a defined route
 * will hit this page and trigger the dashboard-specific not-found UI,
 * preserving the Sidebar and Header.
 */
export default function CatchAllPage() {
  notFound();
}

"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

/**
 * We only show the main header on the home (dashboard) route.
 * Other pages (e.g. /tasks, /stats) use DashboardLayout which has its own Header with a different title.
 */
export default function HeaderWrapper() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return <Header title="AI Productivity Dashboard" subtitle="Organize your day. Fuel your motivation. Catch the news" />;
}
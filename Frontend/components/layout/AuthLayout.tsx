"use client";

import { useAuth } from "@/context/AuthContext";
import LoginPage from "@/components/LoginPage";

/**
 * Wraps the app: if not logged in we show only the login page.
 * If logged in we show the normal layout (sidebar, header, and the current page).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { TasksProvider } from "@/context/TasksContext";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import AuthLayout from "@/components/layout/AuthLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "YasAI-Productivity-Dashboard",
    template: "%s | AI Productivity Dashboard",
  },
  description: "Modern productivity dashboard with AI task suggestions, weather, news, and analytics.",
  openGraph: {
    title: "AI Productivity Dashboard",
    description: "Modern productivity dashboard with AI task suggestions, weather, news, and analytics.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=document.documentElement;var m=window.matchMedia('(prefers-color-scheme:dark)');if(t==='dark'||(t!='light'&&m.matches)){d.classList.add('dark');d.setAttribute('data-theme','dark');}else{d.classList.add('light');d.setAttribute('data-theme','light');}})();`,
          }}
        />
      </head>
      <body style={{
          background: `
            radial-gradient(circle at 20% 20%, #c7d2fe 0%, transparent 40%),
            radial-gradient(circle at 80% 30%, #e9d5ff 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, #ddd6fe 0%, transparent 40%),
            #f8fafc
          `,
          minHeight: "100vh"
        }} className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-w-0 theme-transition`}>
        <ThemeProvider>
          <SidebarProvider>
            <TasksProvider>
              <AuthProvider>
                <AuthLayout>
                  <div className="theme-transition flex min-h-screen min-h-[100dvh] w-full min-w-0 dark:bg-slate-950">
                    <Sidebar />
                    <main className="min-w-0 flex-1 lg:ml-64">
                      <HeaderWrapper />
                      {children}
                    </main>
                  </div>
                </AuthLayout>
              </AuthProvider>
            </TasksProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

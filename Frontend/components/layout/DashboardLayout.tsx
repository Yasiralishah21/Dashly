import Header from "./Header";

/** Wraps a page with the header and padding. Used by /tasks, /tasks/[id], and /stats. */
interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <div className="p-4 sm:p-6">{children}</div>
    </>
  );
}

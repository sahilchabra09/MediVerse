"use client";
import { SidebarDash } from "@/components/sidebar-dash";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      <SidebarDash currentPath={pathname} />
      <main className="flex-1 p-4 h-[100vh] overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;

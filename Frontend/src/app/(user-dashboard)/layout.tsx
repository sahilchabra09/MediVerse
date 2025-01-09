"use client";
import { Protect } from "@clerk/nextjs";
import { SidebarDash } from "@/components/sidebar-dash";
import { usePathname } from "next/navigation";

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <Protect roles={["member"]} redirectTo="/unauthorized">
      <div className="flex h-screen">
        <SidebarDash currentPath={pathname} />
        <main className="flex-1 p-4 h-[100vh] overflow-y-auto">{children}</main>
      </div>
    </Protect>
  );
};

export default UserDashboardLayout;

"use client";
import { useUser } from "@clerk/nextjs";
import { SidebarDash } from "@/components/sidebar-dash";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
      return;
    }
    
    if (isLoaded && user) {
      const userRole = user.unsafeMetadata.role;
      if (userRole === 'DOCTOR' && !pathname.includes('/doc-dashboard')) {
        router.push('/doc-dashboard');
      } else if (userRole === 'PATIENT' && !pathname.includes('/user-dashboard')) {
        router.push('/user-dashboard');
      }
    }
  }, [isLoaded, user, router, pathname]);

  if (!isLoaded || !user) {
    return <div>
      <LoadingScreen/>
    </div>;
  }

  return (
    <div className="flex h-screen">
      <SidebarDash currentPath={pathname} />
      <main className="flex-1 p-4 h-[100vh] overflow-y-auto">{children}</main>
    </div>
  );
};

export default UserDashboardLayout;

"use client";
import { useUser } from "@clerk/nextjs";
import { SidebarDash } from "@/components/sidebar-dash";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
    
    if (isLoaded && user && !user.unsafeMetadata.role) {
      router.push('/onboarding');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <SidebarDash currentPath={pathname} />
      <main className="flex-1 p-4 h-[100vh] overflow-y-auto">{children}</main>
    </div>
  );
};

export default UserDashboardLayout;

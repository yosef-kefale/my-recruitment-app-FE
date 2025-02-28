"use client";

import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import Breadcrumb from "../components/ui/breadcrumb";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Get current route
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status only on the client side
    const token = typeof window !== "undefined" && localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Redirect if not logged in and trying to access a protected route
    if (!token && pathname !== "/login" && pathname !== "/" && pathname !== '/signup') {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body>
        {isLoggedIn && pathname !== "/" && pathname !== "/signup" ? (
          <SidebarProvider>
            <AppSidebar />
            <main className="p-4 w-full">
              <SidebarTrigger/>
              {/* <Breadcrumb /> */}
              {children}
              <Toaster />
            </main>
          </SidebarProvider>
        ) : (
          <main>{children}</main> // Show login page without sidebar
        )}
      </body>
    </html>
  );
}

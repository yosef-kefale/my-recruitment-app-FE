"use client";

import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar/navBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Check login status only on the client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role"); // Assuming role is stored in localStorage

      setIsLoggedIn(!!token);
      setRole(userRole);

      // Redirect if not logged in and trying to access a protected route
      if (!token && pathname !== "/login" && pathname !== "/" && pathname !== "/signup" && pathname !== "/signup-employer") {
        router.push("/login");
      }
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body>
        {isLoggedIn ? (
          role === "employer" ? ( // Employer layout with sidebar
            <SidebarProvider>
              <AppSidebar />
              <main className="p-4 w-full">
                <SidebarTrigger />
                {children}
                <Toaster />
              </main>
            </SidebarProvider>
          ) : role === "employee" ? ( // Employee layout with navbar
            <div>
              <Navbar />
              <main className="mt-12 py-6 w-full">{children}</main>
              <Toaster />
            </div>
          ) : (
            <main>{children}</main>
          )
        ) : (
          <main>{children}</main> // Show login/signup page without sidebar or navbar
        )}
        <Toaster />
      </body>
    </html>
  );
}

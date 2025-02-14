"use client";

import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Get current route
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status only on client side
    const token = typeof window !== "undefined" && localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (!token && pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body>
        {isLoggedIn ? (
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
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

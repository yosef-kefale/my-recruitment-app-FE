"use client";

import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  Settings,
  Users,
  MessageSquare,
  Brain,
  BarChart,
  PlusCircle,
  Building,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Link from "next/link";
import React from "react";

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenus?: Array<{
    title: string;
    url: string;
  }>;
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Job Postings",
    icon: Inbox,
    submenus: [
      { title: "View All", url: "/jobs/view-all" },
      { title: "Create New Job", url: "/jobs/create" },
    ],
  },
  {
    title: "Candidate Management",
    icon: Users,
    submenus: [
      { title: "All Candidates", url: "/candidates/all" },
      { title: "AI-Matched Candidates", url: "/candidates/ai-matches" },
      { title: "Shortlisted", url: "/candidates/shortlisted" },
    ],
  },
  {
    title: "AI Screening",
    icon: Brain,
    submenus: [
      { title: "Screening Questions", url: "/screening/questions" },
      { title: "AI Evaluation", url: "/screening/ai-evaluation" },
      { title: "Bulk Evaluation", url: "/screening/bulk-evaluation" },
    ],
  },
  {
    title: "Interview Management",
    icon: Calendar,
    submenus: [
      { title: "Schedule Interviews", url: "/interviews/schedule" },
      { title: "AI Interview Assistant", url: "/interviews/ai-assistant" },
      { title: "Feedback", url: "/interviews/feedback" },
    ],
  },
  {
    title: "Analytics & Insights",
    icon: BarChart,
    submenus: [
      { title: "Hiring Analytics", url: "/analytics/hiring" },
      { title: "AI Insights", url: "/analytics/ai-insights" },
      { title: "Diversity Metrics", url: "/analytics/diversity" },
    ],
  },
  {
    title: "Communication",
    icon: MessageSquare,
    submenus: [
      { title: "Candidate Messaging", url: "/messaging/candidates" },
      { title: "AI Email Assistant", url: "/messaging/ai-assistant" },
      { title: "Notifications", url: "/messaging/notifications" },
    ],
  },
  {
    title: "Company Profile",
    icon: Building,
    submenus: [
      { title: "Company Information", url: "/company/profile" },
      { title: "Branding", url: "/company/branding" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    submenus: [
      { title: "Account Settings", url: "/settings/account" },
      { title: "AI Preferences", url: "/settings/ai-preferences" },
      { title: "Billing/Subscription", url: "/settings/billing" },
    ],
  },
];

const companies = [
  { id: "company1", name: "Company 1", logo: "/company-logo.png" },
  { id: "company2", name: "Company 2", logo: "/company-logo.png" },
  { id: "company3", name: "Company 3", logo: "/company-logo.png" },
  { id: "company4", name: "Company 4", logo: "/company-logo.png" },
  { id: "company5", name: "Company 5", logo: "/company-logo.png" },
];

export function AppSidebar() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const pathname = usePathname();
  const { setOpen, state } = useSidebar();

  const [selectedCompany, setSelectedCompany] = useState(companies[0].id);

  // Reset open menus when sidebar is collapsed
  useEffect(() => {
    if (state === "collapsed") {
      setOpenMenus({});
    }
  }, [state]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleMenuClick = (item: MenuItem) => {
    // If sidebar is collapsed, expand it
    setOpen(true);
    
    // If item has submenus, toggle them
    if (item.submenus) {
      toggleMenu(item.title);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleSelectChange = (value: string) => {
    if (value === "create-new") {
      console.log("Trigger company creation modal");
      return;
    }
    setSelectedCompany(value);
  };

  const isActiveMenu = (url: string | undefined) => {
    if (!url) return false;
    return pathname.startsWith(url);
  };

  const isActiveSubmenu = (url: string) => {
    if (!url) return false;
    return pathname === url;
  };

  return (
    <Sidebar className="h-screen flex flex-col bg-gray-900 text-white w-64" collapsible="icon">
      <SidebarContent className="flex-1 overflow-y-auto">
        {/* Company Section with Collapse Button */}
        <div className="flex items-center justify-between p-4 group-data-[collapsible=icon]:hidden">
          <div className="text-sky-800 w-full">
            <Select onValueChange={handleSelectChange} value={selectedCompany}>
              <SelectTrigger className="w-[180px] h-[50px] flex items-center">
                {selectedCompany !== "create-new" ? (
                  <>
                    <SelectValue placeholder="Select a company" />
                  </>
                ) : (
                  <SelectValue placeholder="Select a company" />
                )}
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Companies</SelectLabel>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={8}
                          height={8}
                          className="w-10 h-10 rounded-full"
                        />
                        {company.name}
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem
                    value="create-new"
                    className="text-blue-500 font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <PlusCircle size={18} /> Create New Company
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => setOpen(state === "collapsed")}
            className="p-2 hover:bg-gray-800 rounded-md transition-colors ml-2"
            title={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                state === "collapsed" ? "rotate-90" : "-rotate-90"
              }`}
            />
          </button>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarMenu className="group-data-[collapsible=icon]:mt-20">
            {menuItems.map((item) => (
              <div key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`flex items-center px-4 py-5 text-sky-800 transition-all w-full ${
                      !item.submenus && isActiveMenu(item.url) ? "bg-sky-50 text-sky-700" : ""
                    }`}
                    onClick={() => handleMenuClick(item)}
                  >
                    {item.submenus ? (
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 mr-3" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            openMenus[item.title] ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    ) : (
                      <Link href={item.url || '#'} className="flex items-center w-full">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Submenus */}
                {item.submenus && openMenus[item.title] && (
                  <div className="ml-6">
                    {item.submenus.map((sub) => (
                      <SidebarMenuItem key={sub.title}>
                        <SidebarMenuButton
                          asChild
                          className={`px-6 py-2 text-cyan-700 transition-all w-full ${
                            isActiveSubmenu(sub.url) ? "bg-sky-600 text-white" : ""
                          }`}
                        >
                          <Link href={sub.url}>{sub.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile & Logout (Fixed at Bottom) */}
      <div className="mt-auto p-4 border-t flex items-center bg-white w-full group-data-[collapsible=icon]:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3 w-full cursor-pointer">
            <Image
              src="/profile.avif"
              alt="GitHub Avatar"
              width={60}
              height={60}
            />

            <div className="flex flex-col">
              <span className="font-medium text-sm">Profile</span>
              <span className="text-xs text-gray-500">m@example.com</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 shadow-lg rounded-lg bg-white border border-gray-200"
          >
            <DropdownMenuLabel className="px-4 py-2 font-semibold text-gray-700">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-all">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-all">
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-all">
              Team
            </DropdownMenuItem>
            <DropdownMenuItem className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-all">
              Subscription
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition-all"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
}

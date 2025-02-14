"use client";

import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  LayoutDashboard,
  Search,
  Settings,
  Users,
  FileText,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Image from 'next/image';


const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Job Postings",
    icon: Inbox,
    submenus: [
      { title: "View All", url: "/jobs/all" },
      { title: "Post New Job", url: "/jobs/new" },
      { title: "Analytics", url: "/jobs/analytics" },
    ],
  },
  {
    title: "Candidate Management",
    icon: Users,
    submenus: [
      { title: "View All Candidates", url: "/candidates/all" },
      { title: "Shortlisted Candidates", url: "/candidates/shortlisted" },
      { title: "Candidate Profiles", url: "/candidates/profiles" },
    ],
  },
  {
    title: "Interview & Scheduling",
    icon: Calendar,
    submenus: [
      { title: "Schedule Interviews", url: "/interviews/schedule" },
      { title: "Interview Feedback", url: "/interviews/feedback" },
    ],
  },
  {
    title: "Assessments",
    icon: FileText,
    submenus: [
      { title: "Create Assessment", url: "/assessments/create" },
      { title: "View Results", url: "/assessments/results" },
    ],
  },
  {
    title: "Reports & Analytics",
    icon: Search,
    submenus: [
      { title: "Hiring Analytics", url: "/reports/hiring" },
      { title: "Diversity & Inclusion", url: "/reports/diversity" },
    ],
  },
  {
    title: "Messaging",
    icon: MessageSquare,
    submenus: [
      { title: "Candidate Messaging", url: "/messaging/candidates" },
      { title: "Interview Invitations", url: "/messaging/interviews" },
      { title: "Notifications", url: "/messaging/notifications" },
    ],
  },
  {
    title: "Team Management",
    icon: Briefcase,
    submenus: [
      { title: "Assign Roles", url: "/team/roles" },
      { title: "Shared Reviews", url: "/team/reviews" },
    ],
  },
  {
    title: "Employer Branding",
    icon: Home,
    submenus: [
      { title: "Company Profile", url: "/branding/profile" },
      { title: "Media & Testimonials", url: "/branding/media" },
    ],
  },
  {
    title: "Job Board Integration",
    icon: Home,
    submenus: [
      { title: "Manage External Job Posts", url: "/integration/jobs" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    submenus: [
      { title: "Account Settings", url: "/settings/account" },
      { title: "Notification Preferences", url: "/settings/notifications" },
      { title: "Billing/Subscription", url: "/settings/billing" },
    ],
  },
];

export function AppSidebar() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Sidebar className="h-screen flex flex-col bg-gray-900 text-white w-64">
      <SidebarContent className="flex-1 overflow-y-auto">
        {/* Company Section */}
        <div className="flex items-center p-4 border-b border-gray-700">
          <div className="bg-white text-black rounded-full p-2">
            <LayoutDashboard size={24} />
          </div>
          <div className="flex flex-col ml-3">
            <span className="font-medium">Acme Inc</span>
            <span className="text-sm text-gray-400">Enterprise</span>
          </div>
          <ChevronDown className="ml-auto cursor-pointer" />
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 px-4 py-2">
            Application
          </SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <div key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="flex items-center px-4 py-5 text-sky-800 hover:bg-sky-100 transition-all w-full"
                    onClick={() => item.submenus && toggleMenu(item.title)}
                  >
                    {item.submenus ? (
                      <div className="flex justify-between items-center w-full ">
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
                      <a href={item.url} className="flex items-center w-full">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.title}</span>
                      </a>
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
                          className="px-6 py-2 text-cyan-900 hover:text-white hover:bg-gray-800 transition-all w-full"
                        >
                          <a href={sub.url}>{sub.title}</a>
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
        {/* User Profile Section (Fixed to Bottom) */}
        <div className="mt-auto p-4 border-t flex items-center bg-white w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-3 w-full cursor-pointer">
              <Image
                src="https://github.com/shadcn.png"
                alt="User"
                className="w-10 h-10 rounded-full"
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

"use client";

import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  FileText,
  MessageSquare,
  Briefcase,
  PlusCircle,
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
      { title: "View All", url: "/jobs/view-all" },
      { title: "Post New Job", url: "/jobs/create" },
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

  const [selectedCompany, setSelectedCompany] = useState(companies[0].id); // Default to first company

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleSelectChange = (value: string) => {
    if (value === "create-new") {
      console.log("Trigger company creation modal");
      return;
    }
    setSelectedCompany(value);
  };

  return (
    <Sidebar className="h-screen flex flex-col bg-gray-900 text-white w-64">
      <SidebarContent className="flex-1 overflow-y-auto">
        {/* Company Section */}
        <div className="text-sky-800 w-full p-4">
          <Select onValueChange={handleSelectChange} value={selectedCompany}>
            <SelectTrigger className="w-[220px] h-[50px] flex items-center">
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
                      <Link href={item.url} className="flex items-center w-full">
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
                          className="px-6 py-2 text-cyan-900 hover:text-white hover:bg-gray-800 transition-all w-full"
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
      <div className="mt-auto p-4 border-t flex items-center bg-white w-full">
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

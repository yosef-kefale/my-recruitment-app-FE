"use client";

import {
  Calendar,
  ChevronDown,
  Home,
  LayoutDashboard,
  Settings,
  Users,
  Briefcase,
  BarChart2,
  MessageSquare,
  FileText,
  UserCheck,
  ClipboardList,
  Globe,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  {
    title: "Job Postings",
    icon: Briefcase,
    submenus: [
      { title: "View All", url: "/job-postings/view-all" },
      { title: "Post New Job", url: "/job-postings/new" },
      { title: "Analytics", url: "/job-postings/analytics" },
    ],
  },
  {
    title: "Candidate Management",
    icon: Users,
    submenus: [
      { title: "View All Candidates", url: "/candidates/view-all" },
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
    icon: ClipboardList,
    submenus: [
      { title: "Create Assessment", url: "/assessments/create" },
      { title: "View Results", url: "/assessments/results" },
    ],
  },
  {
    title: "Reports & Analytics",
    icon: BarChart2,
    submenus: [
      { title: "Hiring Analytics", url: "/reports/hiring-analytics" },
      { title: "Diversity & Inclusion", url: "/reports/diversity" },
    ],
  },
  {
    title: "Messaging",
    icon: MessageSquare,
    submenus: [
      { title: "Candidate Messaging", url: "/messaging/candidates" },
      { title: "Interview Invitations", url: "/messaging/invitations" },
      { title: "Notifications", url: "/messaging/notifications" },
    ],
  },
  {
    title: "Team Management",
    icon: UserCheck,
    submenus: [
      { title: "Assign Roles", url: "/team/assign-roles" },
      { title: "Shared Reviews", url: "/team/reviews" },
    ],
  },
  {
    title: "Employer Branding",
    icon: Globe,
    submenus: [
      { title: "Company Profile", url: "/branding/profile" },
      { title: "Media & Testimonials", url: "/branding/media" },
    ],
  },
  {
    title: "Job Board Integration",
    url: "/job-board", 
    icon: FileText,
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
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center p-4 space-x-3 border-b">
          <div className="bg-black text-white rounded-full p-2">
            <LayoutDashboard size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Acme Inc</span>
            <span className="text-sm text-gray-500">Enterprise</span>
          </div>
          <ChevronDown className="ml-auto cursor-pointer" />
        </div>

        {menuItems.map((menu) => (
          <SidebarGroup key={menu.title}>
            <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.submenus ? (
                  menu.submenus.map((sub) => (
                    <SidebarMenuItem key={sub.title}>
                      <SidebarMenuButton asChild>
                        <a href={sub.url}>{sub.title}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href={menu.url}>
                        <menu.icon />
                        <span>{menu.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <div className="mt-auto p-4 border-t flex items-center bg-white w-full">
          <button
            onClick={handleLogout}
            className="text-red-500 hover:bg-red-50 rounded-md px-4 py-2 transition-all"
          >
            Logout
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
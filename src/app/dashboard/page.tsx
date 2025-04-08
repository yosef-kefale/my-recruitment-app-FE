"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { cn } from "../../lib/utils";
import React from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, XAxis, Bar, BarChart, PieChart, Pie, Cell } from "recharts";
import { CalendarIcon, Download, Briefcase, Users, Calendar as CalendarIcon2, CheckCircle } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const chartData = [
  { month: "Jan", jobPostings: 120, applications: 30 },
  { month: "Feb", jobPostings: 95, applications: 45 },
  { month: "Mar", jobPostings: 140, applications: 12 },
  { month: "Apr", jobPostings: 110, applications: 30 },
  { month: "May", jobPostings: 160, applications: 4 },
  { month: "Jun", jobPostings: 130, applications: 9 },
  { month: "Jul", jobPostings: 100, applications: 4 },
  { month: "Aug", jobPostings: 125, applications: 100 },
  { month: "Sep", jobPostings: 145, applications: 32 },
  { month: "Oct", jobPostings: 105, applications: 11 },
  { month: "Nov", jobPostings: 115, applications: 22 },
  { month: "Dec", jobPostings: 135, applications: 33 },
];

const applicationStatusData = [
  { name: 'Pending', value: 45 },
  { name: 'Reviewed', value: 30 },
  { name: 'Shortlisted', value: 15 },
  { name: 'Rejected', value: 8 },
  { name: 'Hired', value: 2 },
];

const chartConfig = {
  jobPostings: {
    label: "Job Postings",
    color: "#4F46E5",
  },
  applications: {
    label: "Applications",
    color: "#10B981",
  },
  interviews: {
    label: "Interviews",
    color: "#F59E0B",
  },
  pending: {
    label: "Pending",
    color: "#0088FE",
  },
  reviewed: {
    label: "Reviewed",
    color: "#00C49F",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "#FFBB28",
  },
  rejected: {
    label: "Rejected",
    color: "#FF8042",
  },
  hired: {
    label: "Hired",
    color: "#8884D8",
  },
} satisfies ChartConfig;

const statsData = [
  {
    title: "Total Job Postings",
    value: "1,234",
    change: "+15%",
    trend: "up",
    icon: Briefcase,
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    title: "New Applications",
    value: "3,450",
    change: "+25%",
    trend: "up",
    icon: Users,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Interviews Scheduled",
    value: "456",
    change: "+10%",
    trend: "up",
    icon: CalendarIcon2,
    gradient: "from-amber-500 to-amber-600",
  },
  {
    title: "Hires This Month",
    value: "87",
    change: "+5%",
    trend: "up",
    icon: CheckCircle,
    gradient: "from-purple-500 to-purple-600",
  },
];

export default function Dashboard() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  return (
    <div className="w-full p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recruitment Dashboard</h2>
          <p className="text-muted-foreground mt-1">Monitor your recruitment metrics and manage applications</p>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="default">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <p className={cn(
                    "text-xs mt-1",
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  )}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  `bg-gradient-to-br ${stat.gradient}`
                )}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Recruitment Overview</h3>
                <p className="text-sm text-muted-foreground">Monthly job postings and applications</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Monthly</Button>
                <Button variant="outline" size="sm">Weekly</Button>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[340px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="jobPostings" fill="var(--color-jobPostings)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="applications" fill="var(--color-applications)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Application Status</h3>
                <p className="text-sm text-muted-foreground">Distribution of applications by status</p>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[340px] w-full">
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

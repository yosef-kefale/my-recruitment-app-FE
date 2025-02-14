"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Download } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//} from "@radix-ui/react-popover";
// import { cn } from "../../lib/utils";
import React from "react";
// import { DateRange } from "react-day-picker";
// import { addDays, format } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts";

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

const recentApplications = [
  {
    name: "Emma Johnson",
    email: "emma.johnson@email.com",
    position: "Software Engineer",
  },
  {
    name: "Liam Smith",
    email: "liam.smith@email.com",
    position: "Product Manager",
  },
  {
    name: "Sophia Williams",
    email: "sophia.williams@email.com",
    position: "UI/UX Designer",
  },
  {
    name: "Noah Brown",
    email: "noah.brown@email.com",
    position: "Data Analyst",
  },
  {
    name: "Ava Martinez",
    email: "ava.martinez@email.com",
    position: "Marketing Specialist",
  },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function Dashboard() {
//   const [date, setDate] = React.useState<DateRange | undefined>({
//     from: new Date(2022, 0, 20),
//     to: addDays(new Date(2022, 0, 20), 20),
//   });

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recruitment Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
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
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-white shadow-md rounded-md border pr-2"
              align="start"
            >
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(range) => setDate(range)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover> */}
          <Button>
            <Download className="h-5 w-5 mr-2" /> Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Job Postings</p>
            <h3 className="text-2xl font-bold">1,234</h3>
            <p className="text-xs text-green-500">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">New Applications</p>
            <h3 className="text-2xl font-bold">+3,450</h3>
            <p className="text-xs text-green-500">+25% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Interviews Scheduled</p>
            <h3 className="text-2xl font-bold">+456</h3>
            <p className="text-xs text-green-500">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Hires This Month</p>
            <h3 className="text-2xl font-bold">+87</h3>
            <p className="text-xs text-green-500">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
      <Card>
  <CardContent className="p-4">
    <h3 className="text-lg font-semibold">Job Posting Overview</h3>
    <ChartContainer config={chartConfig} className="h-[340px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="jobPostings" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="applications" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Recent Applications</h3>
            <p className="text-sm text-gray-500">
              You received 345 new applications this month.
            </p>
            <ul className="mt-4 space-y-4">
              {recentApplications.map((applicant, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{applicant.name}</p>
                    <p className="text-xs text-gray-500">{applicant.email}</p>
                  </div>
                  <p className="text-sm font-bold">{applicant.position}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

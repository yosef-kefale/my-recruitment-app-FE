import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const applications = [
  {
    company: "HYS Enterprise",
    recruiter: "Olga",
    role: "Intern Front-end (Angular) Developer",
    status: "Shared Contacts",
    time: "3mo",
  },
  {
    company: "EUROCOM Group",
    recruiter: "Yuliia",
    role: "Mid-Level React Native Developer",
    status: "Shared Contacts",
    time: "3mo",
  },
  {
    company: "Thinksoft",
    recruiter: "Ольга",
    role: "Frontend Developer",
    status: "Not a Fit",
    time: "3mo",
  },
  {
    company: "RepMove",
    recruiter: "Vitaliy",
    role: "Senior Full Stack Developer - Cross Platform Mobile App Developer",
    status: "Declined: Mismatched Skills",
    time: "4mo",
  },
  {
    company: "Unravel",
    recruiter: "Vladimir",
    role: "Sr. Angular Developer",
    status: "Shared Contacts",
    time: "4mo",
  },
];

export default function Applications() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <Tabs defaultValue="inbox">
        <TabsList className="flex space-x-4 border-b mb-4">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="waiting">Waiting for an answer</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>
        
        <Input placeholder="Search..." className="mb-4" />

        <TabsContent value="inbox">
          <div className="space-y-4">
            {applications.map((app, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{app.company} • {app.recruiter}</h3>
                    <p className="text-sm text-gray-500">{app.role}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{app.status}</Badge>
                    <p className="text-sm text-gray-400">{app.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unread">
          <div className="space-y-4">
            {applications.map((app, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{app.company} • {app.recruiter}</h3>
                    <p className="text-sm text-gray-500">{app.role}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{app.status}</Badge>
                    <p className="text-sm text-gray-400">{app.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="waiting">
          <div className="space-y-4">
            {applications.map((app, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{app.company} • {app.recruiter}</h3>
                    <p className="text-sm text-gray-500">{app.role}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{app.status}</Badge>
                    <p className="text-sm text-gray-400">{app.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archive">
          <div className="space-y-4">
            {applications.map((app, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{app.company} • {app.recruiter}</h3>
                    <p className="text-sm text-gray-500">{app.role}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{app.status}</Badge>
                    <p className="text-sm text-gray-400">{app.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Application } from "../../../models/application";
import { ScreeningQuestion } from "../../../models/screeningQuestion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, AlertCircle, Filter, Users, CheckSquare, Square, GraduationCap, Briefcase, DollarSign, Code, Heart, Building, Clock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { INDUSTRIES, ApplicationStatusEnums } from "@/lib/enums";

interface BulkEvaluationProps {
  applications: Application[];
  screeningQuestions: ScreeningQuestion[];
  onUpdateApplicationStatus: (applicationId: string, newStatus: string) => void;
  onBack: () => void;
}

const BulkEvaluation = ({ 
  applications, 
  screeningQuestions,
  onUpdateApplicationStatus,
  onBack
}: BulkEvaluationProps) => {
  const { toast } = useToast();
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreRange, setScoreRange] = useState<number[]>([0, 10]);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [educationFilter, setEducationFilter] = useState<string>("all");
  const [salaryRange, setSalaryRange] = useState<number[]>([0, 200000]);
  const [technicalSkillFilter, setTechnicalSkillFilter] = useState<string>("all");
  const [softSkillFilter, setSoftSkillFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [yearOfExperienceRange, setYearOfExperienceRange] = useState<number[]>([0, 20]);
  
  // State for selected applications
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  
  // State for bulk action
  const [bulkAction, setBulkAction] = useState<string>("shortlisted");
  
  // Get unique locations from applications (mock data for now)
  const locations = ["New York", "San Francisco", "London", "Remote", "Other"];
  
  // Get unique experience levels (mock data for now)
  const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Expert"];
  
  // Get education levels
  const educationLevels = ["Diploma", "Bachelor", "Master", "PhD"];
  
  // Get technical skills (mock data for now)
  const technicalSkills = ["JavaScript", "Python", "Java", "React", "Node.js", "SQL", "AWS", "Docker", "Kubernetes", "Machine Learning"];
  
  // Get soft skills (mock data for now)
  const softSkills = ["Communication", "Leadership", "Problem Solving", "Teamwork", "Time Management", "Adaptability", "Creativity", "Critical Thinking"];
  
  // Filter applications based on criteria
  const filteredApplications = applications.filter(app => {
    // Filter by status
    if (statusFilter !== "all" && app.status !== statusFilter) {
      return false;
    }
    
    // Filter by screening score
    const score = app.screeningScore || 0;
    if (score < scoreRange[0] || score > scoreRange[1]) {
      return false;
    }
    
    // Filter by location (mock data - would come from user profile in real app)
    if (locationFilter !== "all") {
      // In a real app, this would check the user's location from their profile
      // For now, we'll use a random location for demonstration
      const userLocation = locations[Math.floor(Math.random() * locations.length)];
      if (userLocation !== locationFilter) {
        return false;
      }
    }
    
    // Filter by gender (mock data - would come from user profile in real app)
    if (genderFilter !== "all") {
      // In a real app, this would check the user's gender from their profile
      // For now, we'll use a random gender for demonstration
      const userGender = Math.random() > 0.5 ? "male" : "female";
      if (userGender !== genderFilter) {
        return false;
      }
    }
    
    // Filter by experience level (mock data - would come from user profile in real app)
    if (experienceFilter !== "all") {
      // In a real app, this would check the user's experience level from their profile
      // For now, we'll use a random experience level for demonstration
      const userExperience = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
      if (userExperience !== experienceFilter) {
        return false;
      }
    }
    
    // Filter by education level (mock data - would come from user profile in real app)
    if (educationFilter !== "all") {
      // In a real app, this would check the user's education level from their profile
      // For now, we'll use a random education level for demonstration
      const userEducation = educationLevels[Math.floor(Math.random() * educationLevels.length)];
      if (userEducation !== educationFilter) {
        return false;
      }
    }
    
    // Filter by salary expectations (mock data - would come from user profile in real app)
    // In a real app, this would check the user's salary expectations from their profile
    // For now, we'll use a random salary for demonstration
    const userSalary = Math.floor(Math.random() * 150000) + 30000; // Random salary between 30k and 180k
    if (userSalary < salaryRange[0] || userSalary > salaryRange[1]) {
      return false;
    }
    
    // Filter by technical skills (mock data - would come from user profile in real app)
    if (technicalSkillFilter !== "all") {
      // In a real app, this would check the user's technical skills from their profile
      // For now, we'll use a random skill for demonstration
      const userSkills = technicalSkills.slice(0, Math.floor(Math.random() * 5) + 1); // Random number of skills
      if (!userSkills.includes(technicalSkillFilter)) {
        return false;
      }
    }
    
    // Filter by soft skills (mock data - would come from user profile in real app)
    if (softSkillFilter !== "all") {
      // In a real app, this would check the user's soft skills from their profile
      // For now, we'll use a random skill for demonstration
      const userSoftSkills = softSkills.slice(0, Math.floor(Math.random() * 5) + 1); // Random number of skills
      if (!userSoftSkills.includes(softSkillFilter)) {
        return false;
      }
    }
    
    // Filter by industry (mock data - would come from user profile in real app)
    if (industryFilter !== "all") {
      // In a real app, this would check the user's industry from their profile
      // For now, we'll use a random industry for demonstration
      const userIndustries = INDUSTRIES.slice(0, Math.floor(Math.random() * 3) + 1); // Random number of industries
      if (!userIndustries.includes(industryFilter)) {
        return false;
      }
    }
    
    // Filter by years of experience (mock data - would come from user profile in real app)
    // In a real app, this would check the user's years of experience from their profile
    // For now, we'll use a random number for demonstration
    const userYearsOfExperience = Math.floor(Math.random() * 15) + 1; // Random years between 1 and 15
    if (userYearsOfExperience < yearOfExperienceRange[0] || userYearsOfExperience > yearOfExperienceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedApplications(filteredApplications.map(app => app.id || ""));
    } else {
      setSelectedApplications([]);
    }
  };
  
  // Handle individual application selection
  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, applicationId]);
    } else {
      setSelectedApplications(selectedApplications.filter(id => id !== applicationId));
    }
  };
  
  // Apply bulk action to selected applications
  const handleBulkAction = () => {
    if (selectedApplications.length === 0) {
      toast({
        title: "No applications selected",
        description: "Please select at least one application to apply the action.",
        variant: "destructive",
      });
      return;
    }
    
    // Apply the action to all selected applications
    selectedApplications.forEach(applicationId => {
      onUpdateApplicationStatus(applicationId, bulkAction);
    });
    
    // Show success toast
    toast({
      title: "Bulk action applied",
      description: `Updated ${selectedApplications.length} application(s) to ${bulkAction} status.`,
    });
    
    // Clear selection
    setSelectedApplications([]);
    setSelectAll(false);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case ApplicationStatusEnums.PENDING: return 'bg-yellow-500';
      case ApplicationStatusEnums.SELECTED: return 'bg-green-500';
      case ApplicationStatusEnums.REJECTED: return 'bg-red-500';
      case ApplicationStatusEnums.HIRED: return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case ApplicationStatusEnums.PENDING: return <AlertCircle className="h-4 w-4 mr-1" />;
      case ApplicationStatusEnums.SELECTED: return <CheckCircle className="h-4 w-4 mr-1" />;
      case ApplicationStatusEnums.REJECTED: return <XCircle className="h-4 w-4 mr-1" />;
      case ApplicationStatusEnums.HIRED: return <CheckCircle className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl text-blue-800">Bulk Evaluation</CardTitle>
            <CardDescription>Evaluate multiple applications at once based on criteria</CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Regular View
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-blue-600" />
            Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value={ApplicationStatusEnums.PENDING}>Pending</SelectItem>
                  <SelectItem value={ApplicationStatusEnums.SELECTED}>Selected</SelectItem>
                  <SelectItem value={ApplicationStatusEnums.REJECTED}>Rejected</SelectItem>
                  <SelectItem value={ApplicationStatusEnums.HIRED}>Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Screening Score Range</label>
              <div className="pt-2">
                <Slider
                  value={scoreRange}
                  onValueChange={(value) => setScoreRange(value)}
                  min={0}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{scoreRange[0]}</span>
                  <span className="text-xs text-gray-500">{scoreRange[1]}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {experienceLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <Select value={educationFilter} onValueChange={setEducationFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {educationLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Expectations ($)</label>
              <div className="pt-2">
                <Slider
                  value={salaryRange}
                  onValueChange={(value) => setSalaryRange(value)}
                  min={0}
                  max={200000}
                  step={1000}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">${salaryRange[0].toLocaleString()}</span>
                  <span className="text-xs text-gray-500">${salaryRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technical Skills</label>
              <Select value={technicalSkillFilter} onValueChange={setTechnicalSkillFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by technical skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {technicalSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soft Skills</label>
              <Select value={softSkillFilter} onValueChange={setSoftSkillFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by soft skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {softSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {INDUSTRIES.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <div className="pt-2">
                <Slider
                  value={yearOfExperienceRange}
                  onValueChange={(value) => setYearOfExperienceRange(value)}
                  min={0}
                  max={20}
                  step={1}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{yearOfExperienceRange[0]} years</span>
                  <span className="text-xs text-gray-500">{yearOfExperienceRange[1]} years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bulk Action */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Bulk Action
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ApplicationStatusEnums.SELECTED}>Select</SelectItem>
                  <SelectItem value={ApplicationStatusEnums.REJECTED}>Reject</SelectItem>
                  <SelectItem value={ApplicationStatusEnums.HIRED}>Hire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleBulkAction}
              disabled={selectedApplications.length === 0}
            >
              Apply to {selectedApplications.length} Selected
            </Button>
          </div>
        </div>
        
        {/* Applications Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Application ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Screening Score</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Applied Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No applications match your filter criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((application) => {
                  // Mock data for demonstration
                  const userLocation = locations[Math.floor(Math.random() * locations.length)];
                  const userExperience = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
                  const userEducation = educationLevels[Math.floor(Math.random() * educationLevels.length)];
                  
                  return (
                    <TableRow key={application.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedApplications.includes(application.id || "")}
                          onCheckedChange={(checked) => 
                            handleSelectApplication(application.id || "", checked as boolean)
                          }
                          aria-label={`Select application ${application.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {application.id?.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(application.status)} text-white flex items-center`}>
                          {getStatusIcon(application.status)}
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {application.screeningScore ? (
                          <span className="font-medium">{application.screeningScore}/10</span>
                        ) : (
                          <span className="text-gray-400">Not scored</span>
                        )}
                      </TableCell>
                      <TableCell>{userLocation}</TableCell>
                      <TableCell>{userExperience}</TableCell>
                      <TableCell>{userEducation}</TableCell>
                      <TableCell>
                        {application.applicationInformation?.appliedAt 
                          ? new Date(application.applicationInformation.appliedAt).toLocaleDateString()
                          : "Not available"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkEvaluation; 
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Wand2, Save, ArrowLeft, Plus, X, Loader2, Copy, Edit, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function CreateJob() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [selectedSuggestedSkills, setSelectedSuggestedSkills] = useState<string[]>([]);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // New state for requirements and responsibilities AI generation
  const [showRequirementsDialog, setShowRequirementsDialog] = useState(false);
  const [suggestedRequirements, setSuggestedRequirements] = useState<string[]>([]);
  const [selectedSuggestedRequirements, setSelectedSuggestedRequirements] = useState<string[]>([]);
  const [isSuggestingRequirements, setIsSuggestingRequirements] = useState(false);
  
  const [showResponsibilitiesDialog, setShowResponsibilitiesDialog] = useState(false);
  const [suggestedResponsibilities, setSuggestedResponsibilities] = useState<string[]>([]);
  const [selectedSuggestedResponsibilities, setSelectedSuggestedResponsibilities] = useState<string[]>([]);
  const [isSuggestingResponsibilities, setIsSuggestingResponsibilities] = useState(false);

  // Basic job information
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [industry, setIndustry] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" });
  const [deadline, setDeadline] = useState("");
  const [requirementId, setRequirementId] = useState("");
  const [skill, setSkill] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResponsibility, setNewResponsibility] = useState("");
  const [status, setStatus] = useState("active");
  const [gender, setGender] = useState("");
  const [minimumGPA, setMinimumGPA] = useState("");
  const [companyLogo, setCompanyLogo] = useState({
    filename: "",
    path: "",
    originalname: "",
    mimetype: "",
    size: 0,
    bucketName: ""
  });
  const [applicationURL, setApplicationURL] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [howToApply, setHowToApply] = useState("");
  const [jobPostRequirement, setJobPostRequirement] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [positions, setPositions] = useState(1);

  useEffect(() => {
    // Check for AI-generated description
    const aiGeneratedDescription = localStorage.getItem("aiGeneratedDescription");
    if (aiGeneratedDescription) {
      setDescription(aiGeneratedDescription);
      // Clear the stored description after using it
      localStorage.removeItem("aiGeneratedDescription");
      console.log("AI description loaded:", aiGeneratedDescription);
    }

    // Check for stored form data
    const storedFormData = localStorage.getItem("jobFormData");
    if (storedFormData) {
      const formData = JSON.parse(storedFormData);
      if (formData.shouldRestore) {
        // Restore the form data
        if (formData.title) setTitle(formData.title);
        if (formData.position) setPosition(formData.position);
        if (formData.industry) setIndustry(formData.industry);
        if (formData.type) setType(formData.type);
        if (formData.employmentType) setEmploymentType(formData.employmentType);
        if (formData.experienceLevel) setExperienceLevel(formData.experienceLevel);
        
        // Clear the stored form data after using it
        localStorage.removeItem("jobFormData");
        console.log("Form data restored:", formData);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Prepare the job data according to the API requirements
    const jobData = {
      title,
      description,
      position,
      industry,
      type,
      city,
      location,
      employmentType,
      salaryRange: {
        min: salaryRange.min ? Number(salaryRange.min) : undefined,
        max: salaryRange.max ? Number(salaryRange.max) : undefined
      },
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      requirementId,
      skill,
      benefits,
      responsibilities,
      gender,
      minimumGPA: minimumGPA ? Number(minimumGPA) : undefined,
      companyLogo,
      applicationURL,
      experienceLevel,
      fieldOfStudy,
      educationLevel,
      howToApply,
      jobPostRequirement,
      positions: Number(positions)
    };
    
    // Log the data being sent
    console.log("Submitting job data:", jobData);
    
    // Simulate API call to create job
    setTimeout(() => {
      setIsLoading(false);
      
      console.log("Job Created");
      
      // Redirect to job listings
      router.push("/jobs/view-all");
    }, 1500);
  };

  const handleSuggestSkills = async () => {
    // Check if required fields are filled
    if (!title || !position || !industry || !employmentType || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (title, position, industry, employment type, and experience level) before generating skills.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSuggestingSkills(true);
    
    // Simulate API call to get suggested skills
    setTimeout(() => {
      const suggested = generateSuggestedSkills();
      setSuggestedSkills(suggested);
      setSelectedSuggestedSkills([]);
      setShowSkillDialog(true);
      setIsSuggestingSkills(false);
    }, 1000);
  };
  
  // New function to handle requirements suggestions
  const handleSuggestRequirements = async () => {
    // Check if required fields are filled
    if (!title || !position || !industry || !employmentType || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (title, position, industry, employment type, and experience level) before generating requirements.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSuggestingRequirements(true);
    
    // Simulate API call to get suggested requirements
    setTimeout(() => {
      const suggested = generateSuggestedRequirements();
      setSuggestedRequirements(suggested);
      setSelectedSuggestedRequirements([]);
      setShowRequirementsDialog(true);
      setIsSuggestingRequirements(false);
    }, 1000);
  };
  
  // New function to handle responsibilities suggestions
  const handleSuggestResponsibilities = async () => {
    // Check if required fields are filled
    if (!title || !position || !industry || !employmentType || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (title, position, industry, employment type, and experience level) before generating responsibilities.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSuggestingResponsibilities(true);
    
    // Simulate API call to get suggested responsibilities
    setTimeout(() => {
      const suggested = generateSuggestedResponsibilities();
      setSuggestedResponsibilities(suggested);
      setSelectedSuggestedResponsibilities([]);
      setShowResponsibilitiesDialog(true);
      setIsSuggestingResponsibilities(false);
    }, 1000);
  };

  const handleAddSelectedSkills = () => {
    setSkill([...skill, ...selectedSuggestedSkills]);
    setShowSkillDialog(false);
  };
  
  // New function to add selected requirements
  const handleAddSelectedRequirements = () => {
    setJobPostRequirement([...jobPostRequirement, ...selectedSuggestedRequirements]);
    setShowRequirementsDialog(false);
  };
  
  // New function to add selected responsibilities
  const handleAddSelectedResponsibilities = () => {
    setResponsibilities([...responsibilities, ...selectedSuggestedResponsibilities]);
    setShowResponsibilitiesDialog(false);
  };

  const generateSuggestedSkills = () => {
    // This is a mock implementation. In a real app, this would call an AI service
    const skillMap = {
      "InformationTechnology": {
        "Entry-Level": ["JavaScript", "HTML", "CSS", "Git", "Basic SQL", "Problem Solving"],
        "Mid-Level": ["React", "Node.js", "TypeScript", "REST APIs", "Database Design", "System Architecture"],
        "Senior": ["Cloud Architecture", "Microservices", "DevOps", "Security", "Team Leadership", "System Design"]
      },
      "Finance": {
        "Entry-Level": ["Excel", "Financial Analysis", "Accounting Basics", "Data Entry", "Communication"],
        "Mid-Level": ["Financial Modeling", "Risk Management", "Investment Analysis", "Regulatory Compliance"],
        "Senior": ["Portfolio Management", "Strategic Planning", "Team Leadership", "Risk Assessment"]
      },
      // Add more industries and levels as needed
    };

    const industrySkills = skillMap[industry as keyof typeof skillMap] || {};
    const levelSkills = industrySkills[experienceLevel as keyof typeof industrySkills] || [];
    
    // Add some common skills based on position
    const positionSkills = title.toLowerCase().includes("manager") 
      ? ["Leadership", "Team Management", "Strategic Planning"]
      : title.toLowerCase().includes("developer") 
        ? ["Programming", "Software Development", "Code Review"]
        : [];

    return [...new Set([...levelSkills, ...positionSkills])];
  };
  
  // New function to generate suggested requirements
  const generateSuggestedRequirements = () => {
    // This is a mock implementation. In a real app, this would call an AI service
    const requirementsMap = {
      "InformationTechnology": {
        "Entry-Level": [
          "Bachelor's degree in Computer Science or related field",
          "Basic understanding of software development principles",
          "Strong problem-solving skills",
          "Good communication abilities",
          "Ability to work in a team environment"
        ],
        "Mid-Level": [
          "Bachelor's degree in Computer Science or related field",
          "3-5 years of experience in software development",
          "Proficiency in multiple programming languages",
          "Experience with modern development frameworks",
          "Strong analytical and problem-solving skills"
        ],
        "Senior": [
          "Bachelor's or Master's degree in Computer Science or related field",
          "5+ years of experience in software development",
          "Expertise in system design and architecture",
          "Experience leading development teams",
          "Strong project management skills"
        ]
      },
      "Finance": {
        "Entry-Level": [
          "Bachelor's degree in Finance, Accounting, or related field",
          "Basic understanding of financial principles",
          "Proficiency in Microsoft Excel",
          "Strong attention to detail",
          "Good communication skills"
        ],
        "Mid-Level": [
          "Bachelor's degree in Finance, Accounting, or related field",
          "3-5 years of experience in financial analysis",
          "CFA or similar certification preferred",
          "Experience with financial modeling",
          "Strong analytical skills"
        ],
        "Senior": [
          "Bachelor's or Master's degree in Finance, Accounting, or related field",
          "5+ years of experience in financial analysis",
          "CFA or similar certification preferred",
          "Experience with portfolio management",
          "Strong leadership and communication skills"
        ]
      }
    };

    const industryRequirements = requirementsMap[industry as keyof typeof requirementsMap] || {};
    const levelRequirements = industryRequirements[experienceLevel as keyof typeof industryRequirements] || [];
    
    // Add some common requirements based on position
    const positionRequirements = title.toLowerCase().includes("manager") 
      ? ["Experience leading teams", "Strong leadership skills", "Project management experience"]
      : title.toLowerCase().includes("developer") 
        ? ["Experience with version control systems", "Knowledge of agile methodologies", "Experience with code review processes"]
        : [];

    return [...new Set([...levelRequirements, ...positionRequirements])];
  };
  
  // New function to generate suggested responsibilities
  const generateSuggestedResponsibilities = () => {
    // This is a mock implementation. In a real app, this would call an AI service
    const responsibilitiesMap = {
      "InformationTechnology": {
        "Entry-Level": [
          "Develop and maintain web applications using React and Node.js",
          "Write clean, maintainable, and well-documented code",
          "Collaborate with team members to solve technical challenges",
          "Participate in code reviews and provide constructive feedback",
          "Learn and adapt to new technologies and frameworks"
        ],
        "Mid-Level": [
          "Design and implement scalable software solutions",
          "Mentor junior developers and provide technical guidance",
          "Collaborate with cross-functional teams to deliver high-quality products",
          "Optimize application performance and troubleshoot issues",
          "Contribute to architectural decisions and technical strategy"
        ],
        "Senior": [
          "Lead the design and implementation of complex software systems",
          "Mentor and guide development teams on best practices",
          "Drive technical decisions and architectural improvements",
          "Collaborate with stakeholders to define technical requirements",
          "Evaluate and introduce new technologies to improve development efficiency"
        ]
      },
      "Finance": {
        "Entry-Level": [
          "Prepare financial reports and analyze financial data",
          "Assist with budgeting and forecasting processes",
          "Reconcile accounts and prepare journal entries",
          "Support financial analysis and reporting activities",
          "Learn and apply financial modeling techniques"
        ],
        "Mid-Level": [
          "Develop and maintain financial models for business planning",
          "Analyze financial data and provide insights to management",
          "Assist with strategic planning and investment decisions",
          "Prepare and present financial reports to stakeholders",
          "Mentor junior analysts and provide guidance on financial analysis"
        ],
        "Senior": [
          "Lead financial planning and analysis activities",
          "Develop and implement financial strategies to support business goals",
          "Provide strategic financial guidance to senior management",
          "Manage and mentor a team of financial analysts",
          "Oversee the preparation of financial reports and presentations"
        ]
      }
    };

    const industryResponsibilities = responsibilitiesMap[industry as keyof typeof responsibilitiesMap] || {};
    const levelResponsibilities = industryResponsibilities[experienceLevel as keyof typeof industryResponsibilities] || [];
    
    // Add some common responsibilities based on position
    const positionResponsibilities = title.toLowerCase().includes("manager") 
      ? ["Lead and mentor a team of professionals", "Develop and implement team strategies", "Manage project timelines and resources"]
      : title.toLowerCase().includes("developer") 
        ? ["Write and maintain code for production applications", "Collaborate with designers to implement user interfaces", "Debug and fix issues in existing code"]
        : [];

    return [...new Set([...levelResponsibilities, ...positionResponsibilities])];
  };

  const handleUseAI = () => {
    // Check if required fields are filled
    if (!title || !position || !industry || !employmentType || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (title, position, industry, employment type, and experience level) before generating a description.",
        variant: "destructive",
      });
      return;
    }
    
    // Show the AI dialog and start generating
    setShowAIDialog(true);
    setIsGeneratingDescription(true);
    setEditedDescription("");
    setAiGeneratedDescription("");
    setIsEditing(false);
    setCopied(false);
    
    // Simulate AI generation (in a real app, this would call an API)
    setTimeout(() => {
      const generatedDescription = generateJobDescription();
      setAiGeneratedDescription(generatedDescription);
      setEditedDescription(generatedDescription);
      setIsGeneratingDescription(false);
    }, 2000);
  };
  
  const generateJobDescription = () => {
    // This is a mock implementation. In a real app, this would call an AI service
    return `We are seeking a ${experienceLevel} ${position} to join our ${industry} team. The ideal candidate will be responsible for developing and maintaining high-quality software solutions, collaborating with cross-functional teams, and contributing to all phases of the development lifecycle.

Key Responsibilities:
• Design, develop, and maintain software applications
• Collaborate with product managers, designers, and other engineers
• Write clean, maintainable, and efficient code
• Participate in code reviews and provide constructive feedback
• Troubleshoot, debug, and upgrade existing systems
• Stay up-to-date with emerging technologies and industry trends

Required Skills:
• Strong proficiency in programming languages relevant to the position
• Experience with modern development frameworks and tools
• Excellent problem-solving and analytical skills
• Strong communication and teamwork abilities
• Attention to detail and a commitment to quality

Education and Experience:
• ${experienceLevel === "Entry-Level" ? "Bachelor's degree in Computer Science or related field" : 
    experienceLevel === "Mid-Level" ? "Bachelor's degree with 3+ years of experience" : 
    "Bachelor's degree with 5+ years of experience"}
• Experience in ${industry} industry is a plus

We offer a competitive salary, comprehensive benefits package, and opportunities for professional growth and development. If you are passionate about technology and looking for a challenging and rewarding career, we encourage you to apply.`;
  };
  
  const handleCopyDescription = () => {
    navigator.clipboard.writeText(editedDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleEditDescription = () => {
    setIsEditing(true);
  };
  
  const handleApplyDescription = () => {
    setDescription(editedDescription);
    setShowAIDialog(false);
    toast({
      title: "Success",
      description: "Description applied successfully!",
    });
  };
  
  const handleSaveEdit = () => {
    setAiGeneratedDescription(editedDescription);
    setIsEditing(false);
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkill([...skill, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkill(skill.filter((_, i) => i !== index));
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setResponsibilities([...responsibilities, newResponsibility.trim()]);
      setNewResponsibility("");
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setJobPostRequirement([...jobPostRequirement, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setJobPostRequirement(jobPostRequirement.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Create New Job Posting</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to create a new job posting.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Job Information</CardTitle>
            <CardDescription>
              Provide the basic information about the job.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                    <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                    <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                    <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                    <SelectItem value="HR Manager">HR Manager</SelectItem>
                    <SelectItem value="Financial Analyst">Financial Analyst</SelectItem>
                    <SelectItem value="Content Writer">Content Writer</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                    <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                    <SelectItem value="Research Analyst">Research Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="InformationTechnology">Information Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger id="employmentType">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level *</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger id="experienceLevel">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-Level">Entry-Level</SelectItem>
                    <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Addis Ababa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Bole Road, Addis Ababa, Ethiopia"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Salary Range (Min)</Label>
                <Input
                  id="salaryMin"
                  value={salaryRange.min}
                  onChange={(e) => setSalaryRange({ ...salaryRange, min: e.target.value })}
                  placeholder="e.g., 50000"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Salary Range (Max)</Label>
                <Input
                  id="salaryMax"
                  value={salaryRange.max}
                  onChange={(e) => setSalaryRange({ ...salaryRange, max: e.target.value })}
                  placeholder="e.g., 100000"
                  type="number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="positions">Number of Positions</Label>
                <Input
                  id="positions"
                  type="number"
                  min="1"
                  value={positions}
                  onChange={(e) => setPositions(Number(e.target.value))}
                  placeholder="e.g., 1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="onHold">On Hold</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumGPA">Minimum GPA</Label>
                <Input
                  id="minimumGPA"
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={minimumGPA}
                  onChange={(e) => setMinimumGPA(e.target.value)}
                  placeholder="e.g., 3.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="educationLevel">Education Level</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger id="educationLevel">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Associate">Associate</SelectItem>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationURL">Application URL</Label>
              <Input
                id="applicationURL"
                value={applicationURL}
                onChange={(e) => setApplicationURL(e.target.value)}
                placeholder="e.g., https://example.com/apply"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="howToApply">How to Apply</Label>
              <Textarea
                id="howToApply"
                value={howToApply}
                onChange={(e) => setHowToApply(e.target.value)}
                placeholder="Provide clear instructions on how candidates should apply. For example: 'To apply for this position, please submit your resume and a cover letter explaining why you are a good fit for this role. Applications should be sent to careers@company.com with the subject line 'Application for [Position Name]'. All applications will be reviewed within 5 business days.'"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requirementId">Requirement ID</Label>
                <Input
                  id="requirementId"
                  value={requirementId}
                  onChange={(e) => setRequirementId(e.target.value)}
                  placeholder="Enter requirement ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <Input
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCompanyLogo({
                        filename: file.name,
                        path: URL.createObjectURL(file),
                        originalname: file.name,
                        mimetype: file.type,
                        size: file.size,
                        bucketName: "company-logos"
                      });
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input
                id="fieldOfStudy"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g., Computer Science, Business Administration"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Provide a detailed description of the job, responsibilities, and requirements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <div className="flex gap-2">
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a detailed job description that includes the role overview, key responsibilities, and what makes this position unique. For example: 'We are seeking a passionate Software Engineer to join our growing team. You will be responsible for developing high-quality software solutions, collaborating with cross-functional teams, and contributing to all phases of the development lifecycle. The ideal candidate will have strong problem-solving skills and a desire to work in a fast-paced environment.'"
                  className="min-h-[200px]"
                  required
                />
                <Button 
                  type="button" 
                  onClick={handleUseAI} 
                  variant="outline"
                  className="flex items-center gap-2 h-auto py-2"
                >
                  <Wand2 className="h-4 w-4" />
                  Generate with AI
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill">Skills *</Label>
              <div className="flex gap-2">
                <Input
                  id="skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newSkill.trim()) {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="e.g., JavaScript, Project Management, Communication"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddSkill}
                  className="whitespace-nowrap"
                >
                  <Plus className="mr-2 h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSuggestSkills}
                  className="whitespace-nowrap"
                >
                  {isSuggestingSkills ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suggesting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Suggest with AI
                    </>
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skill.map((s, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities *</Label>
              <div className="flex gap-2">
                <Input
                  id="responsibilities"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newResponsibility.trim()) {
                      e.preventDefault();
                      handleAddResponsibility();
                    }
                  }}
                  placeholder="e.g., Develop and maintain web applications using React and Node.js"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddResponsibility}
                  className="whitespace-nowrap"
                >
                  <Plus className="mr-2 h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSuggestResponsibilities}
                  className="whitespace-nowrap"
                >
                  {isSuggestingResponsibilities ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suggesting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Suggest with AI
                    </>
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {responsibilities.map((r, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                    {r}
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(index)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobPostRequirement">Requirements *</Label>
              <div className="flex gap-2">
                <Input
                  id="jobPostRequirement"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newRequirement.trim()) {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                  placeholder="e.g., Bachelor's degree in Computer Science or related field"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddRequirement}
                  className="whitespace-nowrap"
                >
                  <Plus className="mr-2 h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSuggestRequirements}
                  className="whitespace-nowrap"
                >
                  {isSuggestingRequirements ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suggesting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Suggest with AI
                    </>
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {jobPostRequirement.map((r, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                    {r}
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Benefits</Label>
              <div className="space-y-2 mb-2">
                {benefits.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="flex-1">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="e.g., Health insurance, 401(k) matching, flexible work hours"
                />
                <Button type="button" onClick={handleAddBenefit} variant="outline">
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/jobs/view-all")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Job Posting
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Skills Suggestion Dialog */}
      <Dialog open={showSkillDialog} onOpenChange={setShowSkillDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suggested Skills</DialogTitle>
            <DialogDescription>
              Based on the job details you&apos;ve provided, here are some suggested skills. Select the ones you&apos;d like to add to your job posting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSuggestedSkills(suggestedSkills)}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSuggestedSkills([])}
              >
                Deselect All
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {suggestedSkills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`skill-${index}`}
                    checked={selectedSuggestedSkills.includes(skill)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSuggestedSkills([...selectedSuggestedSkills, skill]);
                      } else {
                        setSelectedSuggestedSkills(selectedSuggestedSkills.filter(s => s !== skill));
                      }
                    }}
                  />
                  <label htmlFor={`skill-${index}`} className="text-sm">
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSkillDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSelectedSkills}>
              Add Selected Skills
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Requirements Suggestion Dialog */}
      <Dialog open={showRequirementsDialog} onOpenChange={setShowRequirementsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suggested Requirements</DialogTitle>
            <DialogDescription>
              Based on the job details you&apos;ve provided, here are some suggested requirements. Select the ones you&apos;d like to add to your job posting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSuggestedRequirements(suggestedRequirements)}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSuggestedRequirements([])}
              >
                Deselect All
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {suggestedRequirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`requirement-${index}`}
                    checked={selectedSuggestedRequirements.includes(requirement)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSuggestedRequirements([...selectedSuggestedRequirements, requirement]);
                      } else {
                        setSelectedSuggestedRequirements(selectedSuggestedRequirements.filter(r => r !== requirement));
                      }
                    }}
                  />
                  <label htmlFor={`requirement-${index}`} className="text-sm">
                    {requirement}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequirementsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSelectedRequirements}>
              Add Selected Requirements
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Responsibilities Suggestion Dialog */}
      <Dialog open={showResponsibilitiesDialog} onOpenChange={setShowResponsibilitiesDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suggested Responsibilities</DialogTitle>
            <DialogDescription>
              Based on the job details you&apos;ve provided, here are some suggested responsibilities. Select the ones you&apos;d like to add to your job posting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSuggestedResponsibilities(suggestedResponsibilities)}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSuggestedResponsibilities([])}
              >
                Deselect All
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {suggestedResponsibilities.map((responsibility, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`responsibility-${index}`}
                    checked={selectedSuggestedResponsibilities.includes(responsibility)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSuggestedResponsibilities([...selectedSuggestedResponsibilities, responsibility]);
                      } else {
                        setSelectedSuggestedResponsibilities(selectedSuggestedResponsibilities.filter(r => r !== responsibility));
                      }
                    }}
                  />
                  <label htmlFor={`responsibility-${index}`} className="text-sm">
                    {responsibility}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResponsibilitiesDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSelectedResponsibilities}>
              Add Selected Responsibilities
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Description Generator Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-900">AI-Generated Job Description</DialogTitle>
            <DialogDescription className="text-gray-600">
              Based on the job details you&apos;ve provided, here is a suggested description. You can edit it, copy it, or apply it directly to your form.
            </DialogDescription>
          </DialogHeader>
          
          {isGeneratingDescription ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-gray-600 font-medium">Generating your job description...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="min-h-[400px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSaveEdit} variant="outline" className="bg-white">
                        Save Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg min-h-[400px] whitespace-pre-line text-gray-700 leading-relaxed">
                    {aiGeneratedDescription}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopyDescription} 
                    variant="outline"
                    className="flex items-center gap-2 bg-white hover:bg-gray-50"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleEditDescription} 
                    variant="outline"
                    className="flex items-center gap-2 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <Button 
                  onClick={handleApplyDescription} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Apply to Form
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>

      <Toaster />
    </div>
  );
}
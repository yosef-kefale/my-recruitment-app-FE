"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Stepper, Step } from "@/components/ui/stepper";
import RichTextEditor, { RichTextEditorHandle } from "@/components/RichTextEditor";
import { API_URL } from "@/lib/api";
import { 
  JobIndustryEnums, 
  WorkTypeEnums, 
  EmploymentTypeEnums, 
  JobPostingStatusEnums, 
  PaymentTypeEnums 
} from "@/types/job";
import { generateJobDescription } from '@/lib/ai-service';

interface SalaryRange {
  minimum?: number;
  maximum?: number;
  currency?: string;
}

interface FileDto {
  id?: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
}

export interface JobPostingModel {
  id?: string;
  title: string;
  description: string;
  position: string;
  industry: JobIndustryEnums;
  type: WorkTypeEnums;
  city: string;
  location: string;
  employmentType: EmploymentTypeEnums;
  salaryRange: SalaryRange;
  organizationId: string;
  deadline: Date;
  requirementId: string;
  skill: string[];
  benefits: string[];
  responsibilities: string[];
  status: JobPostingStatusEnums;
  gender: string;
  minimumGPA: number;
  companyName: string;
  companyLogo: FileDto;
  postedDate: Date;
  applicationURL: string;
  experienceLevel: string;
  fieldOfStudy: string;
  educationLevel: string;
  howToApply: string;
  onHoldDate: Date | null;
  jobPostRequirement: string[];
  positionNumbers: number;
  paymentType: PaymentTypeEnums;
}

type QuestionType = "text" | "multiple-choice" | "yes-no" | "boolean" | "essay";

interface ScreeningQuestion {
  jobPostId: string;
  question: string;
  type: string;
  options: string[];
  isKnockout: boolean;
  weight: number;
  booleanAnswer?: boolean;
  selectedOptions?: string[];
  essayAnswer?: string;
  score?: number;
}

function CreateJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editJobId = searchParams.get('editJob');
  const { toast } = useToast();
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
  const [additionalContext, setAdditionalContext] = useState("");
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  
  // New state for requirements and responsibilities AI generation
  const [showRequirementsDialog, setShowRequirementsDialog] = useState(false);
  const [suggestedRequirements, setSuggestedRequirements] = useState<string[]>([]);
  const [selectedSuggestedRequirements, setSelectedSuggestedRequirements] = useState<string[]>([]);
  const [isSuggestingRequirements, setIsSuggestingRequirements] = useState(false);
  
  const [showResponsibilitiesDialog, setShowResponsibilitiesDialog] = useState(false);
  const [suggestedResponsibilities, setSuggestedResponsibilities] = useState<string[]>([]);
  const [selectedSuggestedResponsibilities, setSelectedSuggestedResponsibilities] = useState<string[]>([]);
  const [isSuggestingResponsibilities, setIsSuggestingResponsibilities] = useState(false);

  // Add new state for AI-generated questions
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<ScreeningQuestion[]>([]);
  const [selectedSuggestedQuestions, setSelectedSuggestedQuestions] = useState<ScreeningQuestion[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

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
  const [skill, setSkill] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResponsibility, setNewResponsibility] = useState("");
  const [status, setStatus] = useState("draft");
  const [gender, setGender] = useState("");
  const [minimumGPA, setMinimumGPA] = useState("");
  const [applicationURL, setApplicationURL] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [howToApply, setHowToApply] = useState("");
  const [jobPostRequirement, setJobPostRequirement] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [positions, setPositions] = useState(1);

  // Add new state variables for missing fields
  const [organizationId, setOrganizationId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState<FileDto>({
    fileName: "",
    filePath: "",
    fileType: "",
    fileSize: 0
  });
  const [postedDate] = useState(new Date()); // Remove setter since it's auto-set
  const [onHoldDate, setOnHoldDate] = useState<Date | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentTypeEnums>(PaymentTypeEnums.Salary);

  // Add state for form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize organization data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const org = localStorage.getItem("organization");
      if (org) {
        const orgData = JSON.parse(org);
        setOrganizationId(orgData.id || "");
        setCompanyName(orgData.name || "");
        if (orgData.logo) {
          setCompanyLogo(orgData.logo);
        }
      }
    }
  }, []);

  // Add function to populate sample data
  const populateSampleData = () => {
    setTitle("Senior Software Engineer");
    setPosition("Software Engineer");
    setIndustry("InformationTechnology");
    setType("Remote");
    setCity("Addis Ababa");
    setLocation("Bole Road, Addis Ababa, Ethiopia");
    setEmploymentType("Full-Time");
    setSalaryRange({ min: "50000", max: "100000" });
    setDeadline("2024-12-31");
    setSkill(["JavaScript", "React", "Node.js", "TypeScript", "AWS"]);
    setBenefits([
      "Health Insurance",
      "401(k) Matching",
      "Flexible Work Hours",
      "Remote Work Options",
      "Professional Development"
    ]);
    setResponsibilities([
      "Develop and maintain web applications using React and Node.js",
      "Write clean, maintainable, and well-documented code",
      "Collaborate with team members to solve technical challenges",
      "Participate in code reviews and provide constructive feedback",
      "Learn and adapt to new technologies and frameworks"
    ]);
    setStatus("draft");
    setGender("Male");
    setMinimumGPA("3.0");
    setApplicationURL("https://example.com/apply");
    setExperienceLevel("Senior");
    setFieldOfStudy("Computer Science");
    setEducationLevel("Bachelor");
    setHowToApply("To apply for this position, please submit your resume and a cover letter explaining why you are a good fit for this role. Applications should be sent to careers@company.com with the subject line 'Application for Senior Software Engineer'. All applications will be reviewed within 5 business days.");
    setJobPostRequirement([
      "Bachelor's degree in Computer Science or related field",
      "5+ years of experience in software development",
      "Strong proficiency in JavaScript, React, and Node.js",
      "Experience with cloud platforms (AWS, Azure, or GCP)",
      "Excellent problem-solving and communication skills"
    ]);
    setPositions(2);
    setDescription(`We are seeking a Senior Software Engineer to join our dynamic team. The ideal candidate will be responsible for developing and maintaining high-quality software solutions, collaborating with cross-functional teams, and contributing to all phases of the development lifecycle.

Key Responsibilities:
• Design, develop, and maintain software applications
• Collaborate with product managers, designers, and other engineers
• Write clean, maintainable, and efficient code
• Participate in code reviews and provide constructive feedback
• Troubleshoot, debug, and upgrade existing systems
• Stay up-to-date with emerging technologies and industry trends

Required Skills:
• Strong proficiency in JavaScript, React, and Node.js
• Experience with cloud platforms (AWS, Azure, or GCP)
• Excellent problem-solving and analytical skills
• Strong communication and teamwork abilities
• Attention to detail and a commitment to quality

Education and Experience:
• Bachelor's degree in Computer Science or related field
• 5+ years of experience in software development
• Experience in Information Technology industry is a plus

We offer a competitive salary, comprehensive benefits package, and opportunities for professional growth and development. If you are passionate about technology and looking for a challenging and rewarding career, we encourage you to apply.`);
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const descriptionEditorRef = useRef<RichTextEditorHandle>(null);

  // Define steps for the stepper
  const steps: Step[] = [
    { 
      title: "Basic Information", 
      description: "Job details and requirements" 
    },
    { 
      title: "Job Description", 
      description: "Detailed job description and responsibilities" 
    },
    { 
      title: "Screening Questions", 
      description: "Add screening questions for applicants" 
    }
  ];

  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState<Omit<ScreeningQuestion, 'jobPostId'>>({
    question: "",
    type: "text",
    options: [],
    isKnockout: false,
    weight: 1,
    booleanAnswer: false,
    selectedOptions: [],
    essayAnswer: "",
    score: 0
  });

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Fetch job data if editing
  useEffect(() => {
    const fetchJobData = async () => {
      if (editJobId) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${API_URL}/jobs/${editJobId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch job data');
          }
          
          const jobData = await response.json();
          
          // Update form fields with job data
          setTitle(jobData.title || '');
          setPosition(jobData.position || '');
          setIndustry(jobData.industry || '');
          setType(jobData.type || '');
          setCity(jobData.city || '');
          setLocation(jobData.location || '');
          setEmploymentType(jobData.employmentType || '');
          setSalaryRange(jobData.salaryRange || { minimum: '', maximum: '' });
          setDeadline(jobData.deadline || '');
          setSkill(jobData.skill || []);
          setBenefits(jobData.benefits || []);
          setResponsibilities(jobData.responsibilities || []);
          setStatus(jobData.status || 'draft');
          setGender(jobData.gender || '');
          setMinimumGPA(jobData.minimumGPA || '');
          setApplicationURL(jobData.applicationURL || '');
          setExperienceLevel(jobData.experienceLevel || '');
          setFieldOfStudy(jobData.fieldOfStudy || '');
          setEducationLevel(jobData.educationLevel || '');
          setHowToApply(jobData.howToApply || '');
          setJobPostRequirement(jobData.jobPostRequirement || []);
          setPositions(jobData.positions || '');
          setDescription(jobData.description || '');
          
          // Fetch screening questions
          const questionsResponse = await fetch(
            `${API_URL}/pre-screening-questions?q=w=jobPostId:=:${editJobId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (questionsResponse.ok) {
            const questionsData = await questionsResponse.json();
            setScreeningQuestions(questionsData.items || []);
          }
        } catch (error) {
          console.error('Error fetching job data:', error);
          toast({
            title: "Error",
            description: "Failed to fetch job data. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    
    fetchJobData();
  }, [editJobId, toast]);

  // Function to validate the current step
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      // Validate basic information
      if (!title) newErrors.title = "Job title is required";
      if (!position) newErrors.position = "Position is required";
      if (!industry) newErrors.industry = "Industry is required";
      if (!employmentType) newErrors.employmentType = "Employment type is required";
      if (!experienceLevel) newErrors.experienceLevel = "Experience level is required";
    } else if (currentStep === 1) {
      // Validate job description
      if (!description) newErrors.description = "Description is required";
      if (skill.length === 0) newErrors.skill = "At least one skill is required";
      if (responsibilities.length === 0) newErrors.responsibilities = "At least one responsibility is required";
      if (jobPostRequirement.length === 0) newErrors.jobPostRequirement = "At least one requirement is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle step navigation
  const handleStepClick = (step: number) => {
    // Only allow going back to previous steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Function to handle next step
  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to handle job creation
  const handleCreateJob = async () => {
    // Validate the current step
    if (!validateCurrentStep()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const descriptionContent = descriptionEditorRef.current?.getContent() || description;

      const jobData: JobPostingModel = {
        title,
        description: descriptionContent,
        position,
        industry: industry as JobIndustryEnums,
        type: type as WorkTypeEnums,
        city,
        location,
        employmentType: employmentType as EmploymentTypeEnums,
        salaryRange: {},
        organizationId,
        deadline: new Date(deadline),
        requirementId: "default-requirement",
        skill,
        benefits,
        responsibilities,
        status: status as JobPostingStatusEnums,
        gender,
        minimumGPA: minimumGPA ? parseFloat(minimumGPA) : 0,
        companyName,
        companyLogo,
        postedDate,
        applicationURL,
        experienceLevel,
        fieldOfStudy,
        educationLevel,
        howToApply,
        onHoldDate,
        jobPostRequirement,
        positionNumbers: Number(positions) || 0,
        paymentType
      };

      const url = editJobId
        ? `${API_URL}/jobs/${editJobId}`
        : `${API_URL}/jobs/create-job-posting`;

      const method = editJobId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      const data = await response.json();

      // Handle screening questions one at a time
      if (screeningQuestions.length > 0) {
        for (const question of screeningQuestions) {
          try {
            const questionToCreate = {
              ...question,
              jobPostId: editJobId || data.id,
            };

            const questionResponse = await fetch(`${API_URL}/pre-screening-questions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(questionToCreate),
            });

            if (!questionResponse.ok) {
              throw new Error(`Failed to create question: ${question.question}`);
            }
          } catch (error) {
            console.error("Error creating question:", error);
            toast({
              title: "Error",
              description: `Failed to create question: ${question.question}. Please try again.`,
              variant: "destructive",
            });
          }
        }
      }

      toast({
        title: "Success",
        description: editJobId
          ? "Job updated successfully"
          : "Job created successfully",
      });

      router.push("/jobs/view-all");
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    
    // Show the AI dialog
    setShowAIDialog(true);
    setShowGenerateButton(true); // Show the generate button
    setEditedDescription("");
    setAiGeneratedDescription("");
    setIsEditing(false);
    setCopied(false);
    setAdditionalContext("");
  };

  const handleGenerateDescription = async () => {
    try {
      setIsGeneratingDescription(true);
      
      console.log('Generating description with context:', {
        title,
        position,
        industry,
        employmentType,
        experienceLevel,
        skill,
        jobPostRequirement,
        responsibilities,
        additionalContext
      });

      const generatedDescription = await generateJobDescription(
        title,
        position,
        industry,
        employmentType,
        experienceLevel,
        skill,
        jobPostRequirement,
        responsibilities,
        additionalContext || '' // Ensure it's not undefined
      );
      
      console.log('Generated description:', generatedDescription);
      
      setAiGeneratedDescription(generatedDescription);
      setEditedDescription(generatedDescription);
      setShowGenerateButton(false);
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: "Error",
        description: "Failed to generate job description. Please try again later.",
        variant: "destructive",
      });
      setShowGenerateButton(true);
    } finally {
      setIsGeneratingDescription(false);
    }
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

  const handleAddQuestion = () => {
    // Add the new question to the local array
    const questionToAdd: ScreeningQuestion = {
      ...newQuestion,
      jobPostId: "", // Will be set when job is created
    };
    
    setScreeningQuestions([...screeningQuestions, questionToAdd]);
    
    // Reset the form
    setNewQuestion({
      question: "",
      type: "text",
      options: [],
      isKnockout: false,
      weight: 1,
      booleanAnswer: false,
      selectedOptions: [],
      essayAnswer: "",
      score: 0
    });

    // Show success toast
    toast({
      title: "Question added",
      description: "Question will be saved when you create the job",
    });
  };

  const handleQuestionTypeChange = (value: QuestionType) => {
    setNewQuestion({...newQuestion, type: value});
  };

  // Add new function to generate questions
  const handleGenerateQuestions = async () => {
    // Check if required fields are filled
    if (!title || !position || !industry || !employmentType || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (title, position, industry, employment type, and experience level) before generating questions.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingQuestions(true);
    setShowQuestionsDialog(true);
    
    // Simulate API call to get suggested questions
    setTimeout(() => {
      const generatedQuestions = generateSampleQuestions();
      setSuggestedQuestions(generatedQuestions);
      setSelectedSuggestedQuestions([]);
      setIsGeneratingQuestions(false);
    }, 1500);
  };

  const generateSampleQuestions = () => {
    // This is a mock implementation. In a real app, this would call an AI service
    const baseQuestions: ScreeningQuestion[] = [
      {
        jobPostId: "",
        question: "What is your experience with the technologies mentioned in the job description?",
        type: "essay",
        options: [],
        isKnockout: false,
        weight: 3,
        score: 100,
        essayAnswer: ""
      },
      {
        jobPostId: "",
        question: "Describe a challenging project you worked on and how you handled it.",
        type: "essay",
        options: [],
        isKnockout: false,
        weight: 2,
        score: 100,
        essayAnswer: ""
      },
      {
        jobPostId: "",
        question: "Are you comfortable working in a team environment?",
        type: "yes-no",
        options: [],
        isKnockout: true,
        weight: 1,
        score: 100,
        booleanAnswer: true
      },
      {
        jobPostId: "",
        question: "What is your preferred development methodology?",
        type: "multiple-choice",
        options: ["Agile", "Waterfall", "Scrum", "Kanban"],
        selectedOptions: ["Agile", "Scrum"],
        isKnockout: false,
        weight: 2,
        score: 100
      },
      {
        jobPostId: "",
        question: "Do you have experience with version control systems?",
        type: "boolean",
        options: [],
        booleanAnswer: true,
        isKnockout: true,
        weight: 1,
        score: 100
      }
    ];

    // Add industry-specific questions
    if (industry === "InformationTechnology") {
      baseQuestions.push({
        jobPostId: "",
        question: "How do you stay updated with the latest technology trends?",
        type: "essay",
        options: [],
        isKnockout: false,
        weight: 2,
        score: 100,
        essayAnswer: ""
      });
    }

    // Add experience-level specific questions
    if (experienceLevel === "Senior") {
      baseQuestions.push({
        jobPostId: "",
        question: "Describe your experience in mentoring junior developers.",
        type: "essay",
        options: [],
        isKnockout: false,
        weight: 3,
        score: 100,
        essayAnswer: ""
      });
    }

    return baseQuestions;
  };

  const handleAddSelectedQuestions = () => {
    setScreeningQuestions([...screeningQuestions, ...selectedSuggestedQuestions]);
    setShowQuestionsDialog(false);
    toast({
      title: "Questions Added",
      description: `${selectedSuggestedQuestions.length} questions have been added to your screening questions.`,
    });
  };

  const handleEditQuestion = (question: ScreeningQuestion) => {
    setNewQuestion({
      question: question.question,
      type: question.type,
      options: question.options || [],
      isKnockout: question.isKnockout,
      weight: question.weight,
      booleanAnswer: question.booleanAnswer || false,
      selectedOptions: question.selectedOptions || [],
      essayAnswer: question.essayAnswer || "",
      score: question.score || 0
    });
    setEditingQuestionId(question.jobPostId);
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestionId) return;
    
    try {
      const token = localStorage.getItem("token");
      const questionToUpdate = {
        ...newQuestion,
        jobPostId: editingQuestionId
      };

      const response = await fetch(`${API_URL}/pre-screening-questions/${editingQuestionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(questionToUpdate),
      });

      if (!response.ok) {
        throw new Error("Failed to update question");
      }

      // Update the local state
      setScreeningQuestions(questions => 
        questions.map(q => q.jobPostId === editingQuestionId ? questionToUpdate : q)
      );
      
      // Reset form and editing state
      setNewQuestion({
        question: "",
        type: "text",
        options: [],
        isKnockout: false,
        weight: 1,
        booleanAnswer: false,
        selectedOptions: [],
        essayAnswer: "",
        score: 0
      });
      setEditingQuestionId(null);
      
      toast({
        title: "Question Updated",
        description: "The question has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description: "Failed to update question. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update the description field in the form
  const handleDescriptionChange = (content: string) => {
    setDescription(content);
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Create New Job Posting</h1>
          <p className="text-gray-600 text-sm">
            Fill in the details below to create a new job posting.
          </p>
        </div>
      </div>

      {/* Fixed Stepper with reduced padding */}
      <div className="sticky top-0 bg-white z-10 pb-1">
        <Stepper 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={handleStepClick}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
        />
      </div>

      {/* Scrollable Form Content with adjusted max height */}
      <div className="mt-2 max-h-[calc(100vh-180px)] overflow-y-auto pb-20">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === 0) {
            handleCreateJob();
          } else if (currentStep === 1) {
            if (validateCurrentStep()) {
              setCurrentStep(2);
            } else {
              toast({
                title: "Validation Error",
                description: "Please fix the errors before proceeding.",
                variant: "destructive",
              });
            }
          } else if (currentStep === 2) {
            handleCreateJob();
          }
        }}>
          {currentStep === 0 && (
            <Card className="mb-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Basic Job Information</CardTitle>
                    <CardDescription className="text-sm">
                      Provide the basic information about the job.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={populateSampleData}
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="h-4 w-4" />
                    Populate Sample Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      id="deadline"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={JobPostingStatusEnums.Active}>Active</SelectItem>
                        <SelectItem value={JobPostingStatusEnums.Inactive}>Inactive</SelectItem>
                        <SelectItem value={JobPostingStatusEnums.OnHold}>On Hold</SelectItem>
                        <SelectItem value={JobPostingStatusEnums.Closed}>Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentType">Payment Type</Label>
                    <Select value={paymentType} onValueChange={(value) => setPaymentType(value as PaymentTypeEnums)}>
                      <SelectTrigger id="paymentType">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PaymentTypeEnums.Salary}>Salary</SelectItem>
                        <SelectItem value={PaymentTypeEnums.Hourly}>Hourly</SelectItem>
                        <SelectItem value={PaymentTypeEnums.Commission}>Commission</SelectItem>
                        <SelectItem value={PaymentTypeEnums.Contract}>Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <div className="space-y-2">
                    <Label htmlFor="applicationURL">Application URL</Label>
                    <Input
                      id="applicationURL"
                      value={applicationURL}
                      onChange={(e) => setApplicationURL(e.target.value)}
                      placeholder="e.g., https://example.com/apply"
                    />
                  </div>
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
          )}

          {currentStep === 1 && (
            <Card className="mb-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Job Description</CardTitle>
                <CardDescription className="text-sm">
                  Provide a detailed description of the job, responsibilities, and requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <div className="flex gap-2">
                      <RichTextEditor
                        ref={descriptionEditorRef}
                        onChange={handleDescriptionChange}
                        initialValue={description}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleUseAI}
                        disabled={isGeneratingDescription}
                      >
                        {isGeneratingDescription ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                    )}
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
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="mb-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Screening Questions</CardTitle>
                <CardDescription className="text-sm">
                  Add screening questions for applicants.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Questions List - Left Side */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Added Questions</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateQuestions}
                        className="flex items-center gap-2"
                      >
                        <Wand2 className="h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                      {screeningQuestions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                          No screening questions added yet
                        </div>
                      ) : (
                        screeningQuestions.map((question, index) => (
                          <Card key={question.jobPostId} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">Question {index + 1}</h4>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleEditQuestion(question)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setScreeningQuestions(questions => 
                                        questions.filter((_, i) => i !== index)
                                      );
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{question.question}</p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{question.type}</Badge>
                                {question.isKnockout && (
                                  <Badge variant="destructive">Knockout</Badge>
                                )}
                                <Badge variant="outline">Weight: {question.weight}</Badge>
                                {question.score !== undefined && (
                                  <Badge variant="outline">Score: {question.score}</Badge>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add Question Form - Right Side */}
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg sticky top-4">
                    <h3 className="font-semibold text-lg">
                      {editingQuestionId ? "Edit Question" : "Add New Question"}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Question</Label>
                        <Textarea 
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                          placeholder="Enter your question"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <Select 
                          value={newQuestion.type}
                          onValueChange={handleQuestionTypeChange}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="yes-no">Yes/No</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="essay">Essay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {newQuestion.type === 'multiple-choice' && (
                        <div>
                          <Label className="text-sm font-medium">Options</Label>
                          <div className="space-y-2 mt-1">
                            {newQuestion.options?.map((option: string, index: number) => (
                              <div key={index} className="flex gap-2">
                                <Input 
                                  value={option}
                                  onChange={(e) => {
                                    const updatedOptions = [...(newQuestion.options || [])];
                                    updatedOptions[index] = e.target.value;
                                    setNewQuestion({...newQuestion, options: updatedOptions});
                                  }}
                                  placeholder={`Option ${index + 1}`}
                                />
                                <Button 
                                  type="button"
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const updatedOptions = newQuestion.options?.filter((_: string, i: number) => i !== index);
                                    setNewQuestion({...newQuestion, options: updatedOptions});
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button 
                              type="button"
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setNewQuestion({
                                  ...newQuestion, 
                                  options: [...(newQuestion.options || []), ""]
                                });
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {newQuestion.type === 'multiple-choice' && (
                        <div>
                          <Label className="text-sm font-medium">Correct Options</Label>
                          <div className="space-y-2 mt-1">
                            {newQuestion.options?.map((option: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`correct-${index}`}
                                  checked={newQuestion.selectedOptions?.includes(option)}
                                  onCheckedChange={(checked) => {
                                    const updatedSelectedOptions = checked 
                                      ? [...(newQuestion.selectedOptions || []), option]
                                      : (newQuestion.selectedOptions || []).filter(opt => opt !== option);
                                    setNewQuestion({...newQuestion, selectedOptions: updatedSelectedOptions});
                                  }}
                                />
                                <label htmlFor={`correct-${index}`} className="text-sm">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {newQuestion.type === 'essay' && (
                        <div>
                          <Label className="text-sm font-medium">Sample Answer</Label>
                          <Textarea 
                            value={newQuestion.essayAnswer}
                            onChange={(e) => setNewQuestion({...newQuestion, essayAnswer: e.target.value})}
                            placeholder="Enter a sample answer"
                            className="mt-1"
                          />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Weight</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            max="10"
                            value={newQuestion.weight}
                            onChange={(e) => setNewQuestion({...newQuestion, weight: parseInt(e.target.value)})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Score</Label>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={newQuestion.score}
                            onChange={(e) => setNewQuestion({...newQuestion, score: parseInt(e.target.value)})}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="knockout" 
                          checked={newQuestion.isKnockout}
                          onCheckedChange={(checked) => 
                            setNewQuestion({...newQuestion, isKnockout: checked as boolean})
                          }
                        />
                        <label htmlFor="knockout" className="text-sm font-medium">
                          Knockout Question (Reject if answered incorrectly)
                        </label>
                      </div>
                      
                      <Button 
                        type="button"
                        className="w-full"
                        onClick={editingQuestionId ? handleUpdateQuestion : handleAddQuestion}
                      >
                        {editingQuestionId ? (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update Question
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fixed Footer with improved visibility */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/jobs/view-all")}
                size="sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              {currentStep === 2 && (
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 shadow-md"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editJobId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editJobId ? 'Update Job' : 'Create Job'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

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
            <DialogTitle className="text-2xl font-bold text-blue-900">AI Job Description Generator</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter the job details below to generate a professional description. The AI will use this as the primary content and incorporate relevant information from the form.
            </DialogDescription>
          </DialogHeader>
          
          {showGenerateButton ? (
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="additionalContext" className="text-sm font-medium">
                    Job Details *
                  </Label>
                  <Textarea
                    id="additionalContext"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Enter the job details here. For example:
• Job title and position
• Key responsibilities and duties
• Required skills and qualifications
• Experience level and requirements
• Company culture and values
• Specific project details
• Team structure and collaboration
• Growth opportunities
• Benefits and perks

The more details you provide, the better the generated description will be."
                    className="min-h-[300px] resize-none"
                  />
                  <p className="text-sm text-gray-500">
                    This will be used as the primary content for generating the job description. The AI will incorporate relevant information from the form fields as supplementary details.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={handleGenerateDescription}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  disabled={isGeneratingDescription || !additionalContext.trim()}
                >
                  {isGeneratingDescription ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Description
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
              {isGeneratingDescription ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  <p className="text-gray-600 font-medium">Generating your job description...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Questions Generation Dialog */}
      <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-900">AI-Generated Screening Questions</DialogTitle>
            <DialogDescription className="text-gray-600">
              Based on the job details you&apos;ve provided, here are some suggested screening questions. Select the ones you&apos;d like to add to your job posting.
            </DialogDescription>
          </DialogHeader>
          
          {isGeneratingQuestions ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-gray-600 font-medium">Generating screening questions...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedSuggestedQuestions(suggestedQuestions)}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedSuggestedQuestions([])}
                >
                  Deselect All
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {suggestedQuestions.map((question, index) => (
                  <Card key={question.jobPostId} className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        id={`question-${index}`}
                        checked={selectedSuggestedQuestions.some(q => q.jobPostId === question.jobPostId)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSuggestedQuestions([...selectedSuggestedQuestions, question]);
                          } else {
                            setSelectedSuggestedQuestions(selectedSuggestedQuestions.filter(q => q.jobPostId !== question.jobPostId));
                          }
                        }}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setScreeningQuestions(questions => 
                                  questions.filter((_, i) => i !== index)
                                );
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{question.question}</p>
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Options:</p>
                            <div className="flex flex-wrap gap-2">
                              {question.options.map((option, optIndex) => (
                                <Badge 
                                  key={optIndex}
                                  variant={question.selectedOptions?.includes(option) ? "default" : "outline"}
                                >
                                  {option}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <DialogFooter className="pt-4 border-t">
                <Button variant="outline" onClick={() => setShowQuestionsDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSelectedQuestions}
                  disabled={selectedSuggestedQuestions.length === 0}
                >
                  Add Selected Questions ({selectedSuggestedQuestions.length})
                </Button>
              </DialogFooter>
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

export default function CreateJob() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-8 w-8 text-sky-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    }>
      <CreateJobContent />
    </Suspense>
  );
}
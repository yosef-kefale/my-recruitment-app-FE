"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { JobPosting } from "../../../models/jobPosting";
import { Application } from "../../../models/application";
import { ScreeningQuestion, JobStatistics } from "../../../models/screeningQuestion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from "axios";
import ApplicationDetail from "../components/ApplicationDetail";
import ApplicationsView from "../components/ApplicationsView";
import BulkEvaluation from "../components/BulkEvaluation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { 
  ClipboardList, 
  Users, 
  FileText, 
  BarChart2, 
  Settings, 
  CheckSquare 
} from "lucide-react";

const EmployerJobDetail = () => {
  const params = useParams();
  const id = params.id as string;
  
  const [mounted, setMounted] = useState(false);
  const [job, setJob] = useState<JobPosting | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestion[]>([]);
  const [statistics, setStatistics] = useState<JobStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [currentTab, setCurrentTab] = useState<"overview" | "applications" | "screening" | "statistics" | "settings" | "bulk-evaluation">("overview");
  type QuestionType = 'text' | 'multiple-choice' | 'yes-no' | 'boolean' | 'essay';

  const [newQuestion, setNewQuestion] = useState<Omit<ScreeningQuestion, 'id' | 'jobPostId' | 'createdAt' | 'updatedAt'>>({
    question: "",
    type: "text" as QuestionType,
    options: [""],
    isKnockout: false,
    weight: 1,
    booleanAnswer: false,
    selectedOptions: [],
    essayAnswer: "",
    score: 0
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    setMounted(true);
    if (id) {
      fetchJobDetails();
      fetchApplications();
      fetchScreeningQuestions();
    }
  }, [id]);
  
  useEffect(() => {
    if (applications.length > 0) {
      setSampleStatistics();
    }
  }, [applications]);
  
  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://196.188.249.24:3010/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://196.188.249.24:3010/api/applications?q=i=JobPost%26%26w=JobPostId:=:${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Applications response:", response.data);
      setApplications(response.data.items || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchScreeningQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching screening questions for job ID:", id);
      const response = await axios.get(
        `https://196.188.249.24:3010/api/pre-screening-questions?q=w=jobPostId:=:${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Screening questions response:", response.data);
      setScreeningQuestions(response.data.items || []);
    } catch (error) {
      console.error("Error fetching screening questions:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      toast({
        title: "Error",
        description: "Failed to fetch screening questions. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const setSampleStatistics = () => {
    // Sample data for statistics
    const sampleStats: JobStatistics = {
      totalApplications: applications.length,
      applicationsByStatus: {
        pending: applications.filter(app => app.status === 'pending').length,
        reviewed: applications.filter(app => app.status === 'reviewed').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        hired: applications.filter(app => app.status === 'hired').length,
      },
      applicationsByDay: [
        { date: "2023-05-01", count: 3 },
        { date: "2023-05-02", count: 5 },
        { date: "2023-05-03", count: 2 },
        { date: "2023-05-04", count: 7 },
        { date: "2023-05-05", count: 4 },
        { date: "2023-05-06", count: 6 },
        { date: "2023-05-07", count: 3 },
      ],
      topSkills: [
        { skill: "JavaScript", count: 28 },
        { skill: "React", count: 25 },
        { skill: "TypeScript", count: 20 },
        { skill: "Node.js", count: 18 },
        { skill: "CSS", count: 15 },
      ],
      averageScreeningScore: 7.5,
    };
    
    setStatistics(sampleStats);
  };
  
  const handleAddQuestion = async () => {
    try {
      const token = localStorage.getItem("token");
      const questionData = {
        ...newQuestion,
        jobPostId: id,
        options: newQuestion.options?.filter((opt: string) => opt.trim() !== "") || [],
      };
      
      console.log("Adding new screening question:", questionData);
      
      const response = await axios.post(
        "https://196.188.249.24:3010/api/pre-screening-questions",
        questionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Add question response:", response.data);

      // Show success toast
      toast({
        title: "Success",
        description: "Screening question added successfully",
      });

      // Refresh questions
      console.log("Refreshing screening questions after adding new question");
      fetchScreeningQuestions();
      
      // Reset form
      setNewQuestion({
        question: "",
        type: "text" as QuestionType,
        options: [""],
        isKnockout: false,
        weight: 1,
        booleanAnswer: false,
        selectedOptions: [],
        essayAnswer: "",
        score: 0
      });
    } catch (error) {
      console.error("Error adding screening question:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to add screening question. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://196.188.249.24:3010/api/applications/${applicationId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh applications
      fetchApplications();
      
      // If we're viewing the application detail, close it
      if (selectedApplication) {
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'reviewed': return 'bg-blue-500';
      case 'shortlisted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'hired': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const handleQuestionTypeChange = (value: QuestionType) => {
    setNewQuestion({...newQuestion, type: value});
  };
  
  const handleEditQuestion = (question: ScreeningQuestion) => {
    // Navigate to create job form with the question data
    window.location.href = `/jobs/create?editQuestion=${encodeURIComponent(JSON.stringify(question))}`;
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://196.188.249.24:3010/api/pre-screening-questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh questions
      fetchScreeningQuestions();
      
      toast({
        title: "Success",
        description: "Screening question deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting screening question:", error);
      toast({
        title: "Error",
        description: "Failed to delete screening question. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Don't render anything until after hydration
  if (!mounted) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading job details...</div>;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 p-8 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl font-bold text-blue-900 mb-3">{job?.title}</h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                {job?.employmentType || 'Full-time'}
              </Badge>
              {job?.location && (
                <Badge className="bg-gray-100 text-gray-800 border-gray-200 px-3 py-1">
                  {job?.location}
                </Badge>
              )}
              {job?.salaryRange && (
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  ${job.salaryRange.minimum} - ${job.salaryRange.maximum}
                </Badge>
              )}
            </div>
            <div className="mt-6 prose prose-blue max-w-none prose-headings:text-blue-800 prose-p:text-gray-700 prose-strong:text-blue-700 prose-li:text-gray-700 prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-4 prose-ol:pl-4 prose-li:my-1 prose-p:my-3 prose-headings:my-4 prose-hr:my-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline" dangerouslySetInnerHTML={{ __html: job?.description || "" }} />
          </div>
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-xl text-blue-800 mb-4">Quick Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Posted Date</p>
                <p className="font-medium text-gray-800">{job?.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Deadline</p>
                <p className="font-medium text-gray-800">{job?.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={`${getStatusColor(job?.status || "")} text-white font-medium mt-1`}>
                  {job?.status || 'Unknown'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Edit Job Posting</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="border-b border-gray-200 min-w-max">
          <nav className="-mb-px flex space-x-1">
            <button
              onClick={() => setCurrentTab("overview")}
              className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-colors ${
                currentTab === "overview"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ClipboardList size={16} />
              Overview
            </button>
            <button
              onClick={() => setCurrentTab("applications")}
              className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-colors ${
                currentTab === "applications"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users size={16} />
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setCurrentTab("screening")}
              className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-colors ${
                currentTab === "screening"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText size={16} />
              Screening Questions
            </button>
            <button
              onClick={() => setCurrentTab("statistics")}
              className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-colors ${
                currentTab === "statistics"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <BarChart2 size={16} />
              Statistics
            </button>
            <button
              onClick={() => setCurrentTab("bulk-evaluation")}
              className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-colors ${
                currentTab === "bulk-evaluation"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <CheckSquare size={16} />
              Bulk Evaluation
            </button>
            <button
              onClick={() => setCurrentTab("settings")}
              className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-colors ${
                currentTab === "settings"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings size={16} />
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {currentTab === "overview" && (
        <div className="space-y-6">
          {/* Job Overview Card */}
          <Card className="border-blue-100">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Job Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500">Experience Level</p>
                      <p className="font-medium text-gray-800">{job?.experienceLevel || 'Not specified'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium text-gray-800">{job?.industry || 'Not specified'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500">Remote Policy</p>
                      <p className="font-medium text-gray-800">{job?.remotePolicy || 'Not specified'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500">Application URL</p>
                      <a 
                        href={job?.applicationURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {job?.applicationURL || 'Not specified'}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-xl text-blue-800 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Applications</p>
                      <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Posted Date</p>
                      <p className="font-medium text-gray-800">{job?.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Application Deadline</p>
                      <p className="font-medium text-gray-800">{job?.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={`${getStatusColor(job?.status || "")} text-white font-medium mt-1`}>
                        {job?.status || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-xl text-blue-800 mb-3">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {job?.responsibilities?.map((responsibility, index) => (
                        <li key={index} className="text-gray-700">{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-xl text-blue-800 mb-3">Benefits</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {job?.benefits?.map((benefit, index) => (
                        <li key={index} className="text-gray-700">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-xl text-blue-800 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job?.skill?.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "applications" && (
        <ApplicationsView 
          applications={applications} 
          screeningQuestions={screeningQuestions}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
        />
      )}

      {currentTab === "screening" && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Screening Questions</CardTitle>
              <CardDescription>Manage screening questions for applicants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {screeningQuestions.length === 0 ? (
                  <p className="text-center py-8">No screening questions added yet</p>
                ) : (
                  screeningQuestions.map((question, index) => (
                    <Card key={question.id} className="p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="w-full md:w-4/5">
                          <h3 className="font-semibold">Question {index + 1}</h3>
                          <p className="mt-1">{question.question}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge>{question.type}</Badge>
                            {question.isKnockout && <Badge className="bg-red-100 text-red-800">Knockout</Badge>}
                            <Badge>Weight: {question.weight}</Badge>
                            {question.score !== undefined && <Badge>Score: {question.score}</Badge>}
                          </div>
                          {question.type === 'multiple-choice' && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Options:</p>
                              <ul className="list-disc list-inside">
                                {question.options?.map((option, i) => (
                                  <li key={i}>{option}</li>
                                ))}
                              </ul>
                              {question.selectedOptions && question.selectedOptions.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium">Correct Options:</p>
                                  <ul className="list-disc list-inside">
                                    {question.selectedOptions.map((option, i) => (
                                      <li key={i}>{option}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          {question.type === 'boolean' && question.booleanAnswer !== undefined && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Correct Answer:</p>
                              <p>{question.booleanAnswer ? 'Yes' : 'No'}</p>
                            </div>
                          )}
                          {question.type === 'essay' && question.essayAnswer && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Sample Answer:</p>
                              <p>{question.essayAnswer}</p>
                            </div>
                          )}
                        </div>
                        <div className="w-full md:w-1/5 flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "statistics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Total Applications</h3>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Applications by Status</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Pending', value: statistics?.applicationsByStatus.pending || 0 },
                            { name: 'Reviewed', value: statistics?.applicationsByStatus.reviewed || 0 },
                            { name: 'Shortlisted', value: statistics?.applicationsByStatus.shortlisted || 0 },
                            { name: 'Rejected', value: statistics?.applicationsByStatus.rejected || 0 },
                            { name: 'Hired', value: statistics?.applicationsByStatus.hired || 0 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Pending', value: statistics?.applicationsByStatus.pending || 0 },
                            { name: 'Reviewed', value: statistics?.applicationsByStatus.reviewed || 0 },
                            { name: 'Shortlisted', value: statistics?.applicationsByStatus.shortlisted || 0 },
                            { name: 'Rejected', value: statistics?.applicationsByStatus.rejected || 0 },
                            { name: 'Hired', value: statistics?.applicationsByStatus.hired || 0 },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Applications Over Time</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statistics?.applicationsByDay || []}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Applications" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Top Skills</h3>
                  <div className="space-y-2">
                    {statistics?.topSkills.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{skill.skill}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(skill.count / (statistics?.topSkills[0]?.count || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{skill.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Average Screening Score</h3>
                  <p className="text-3xl font-bold">{statistics?.averageScreeningScore?.toFixed(1) || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "settings" && (
        <Card>
          <CardHeader>
            <CardTitle>Job Settings</CardTitle>
            <CardDescription>Manage job posting settings and visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Job Status</h3>
                <Select defaultValue={job?.status || "active"}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Position</h3>
                <Input defaultValue={job?.position || ""} />
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Application Deadline</h3>
                <Input type="date" defaultValue={job?.deadline || ""} />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Feature this job on the homepage
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="notifications" defaultChecked />
                <label htmlFor="notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Receive email notifications for new applications
                </label>
              </div>
              
              <Button className="w-full">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === "bulk-evaluation" && (
        <BulkEvaluation 
          applications={applications} 
          screeningQuestions={screeningQuestions}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
        />
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetail
          application={selectedApplication}
          screeningQuestions={screeningQuestions}
          onStatusChange={handleUpdateApplicationStatus}
          onClose={() => setSelectedApplication(null)}
        />
      )}
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default EmployerJobDetail; 
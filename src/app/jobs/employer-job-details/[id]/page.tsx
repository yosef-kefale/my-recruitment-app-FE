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
  const [currentTab, setCurrentTab] = useState("overview");
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "text",
    options: [""],
    correctAnswer: "",
    required: false,
    weight: 1,
  });
  
  // Sample applications for testing
  const sampleApplications: Application[] = [
    {
      id: "app-001",
      jobPostId: id,
      userId: "user-001",
      coverLetter: "I am excited to apply for this position. With my 5 years of experience in software development, I believe I would be a great fit for your team. I have worked on similar projects in the past and am confident in my ability to contribute immediately.",
      status: "pending",
      applicationInformation: {
        appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        cv: "https://example.com/cv1.pdf",
        screeningAnswers: [
          { questionId: "q1", answer: "Yes, I have 5 years of experience with React." },
          { questionId: "q2", answer: "I prefer working in a team environment." }
        ]
      },
      evaluationNotes: "",
      screeningScore: 0,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: "app-002",
      jobPostId: id,
      userId: "user-002",
      coverLetter: "I am writing to express my interest in the position. I have been following your company for some time and am impressed by your innovative approach to technology. I believe my skills and experience align well with what you are looking for.",
      status: "reviewed",
      applicationInformation: {
        appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        cv: "https://example.com/cv2.pdf",
        screeningAnswers: [
          { questionId: "q1", answer: "Yes, I have 3 years of experience with React." },
          { questionId: "q2", answer: "I can work both independently and in a team." }
        ]
      },
      evaluationNotes: "Candidate has good technical skills but lacks some of the required experience.",
      screeningScore: 7,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: "app-003",
      jobPostId: id,
      userId: "user-003",
      coverLetter: "I am thrilled to apply for this opportunity. Your company's mission resonates with my personal values, and I believe my background in software development makes me an excellent candidate for this role.",
      status: "shortlisted",
      applicationInformation: {
        appliedAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
        cv: "https://example.com/cv3.pdf",
        screeningAnswers: [
          { questionId: "q1", answer: "Yes, I have 7 years of experience with React and other frontend frameworks." },
          { questionId: "q2", answer: "I thrive in collaborative team environments." }
        ]
      },
      evaluationNotes: "Strong candidate with excellent technical skills and communication abilities.",
      screeningScore: 9,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: "app-004",
      jobPostId: id,
      userId: "user-004",
      coverLetter: "I am writing to apply for the position. While I may not have all the required experience, I am a fast learner and am confident in my ability to quickly adapt to your team's needs.",
      status: "rejected",
      applicationInformation: {
        appliedAt: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
        cv: "https://example.com/cv4.pdf",
        screeningAnswers: [
          { questionId: "q1", answer: "I have 1 year of experience with React." },
          { questionId: "q2", answer: "I prefer working independently but can collaborate when needed." }
        ]
      },
      evaluationNotes: "Candidate lacks the required experience for this position.",
      screeningScore: 5,
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 8).toISOString()
    },
    {
      id: "app-005",
      jobPostId: id,
      userId: "user-005",
      coverLetter: "I am excited to apply for this position. With my extensive experience in software development and team leadership, I believe I would be an asset to your organization.",
      status: "hired",
      applicationInformation: {
        appliedAt: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 days ago
        cv: "https://example.com/cv5.pdf",
        screeningAnswers: [
          { questionId: "q1", answer: "Yes, I have 10 years of experience with React and other modern frameworks." },
          { questionId: "q2", answer: "I have led multiple teams and enjoy mentoring others." }
        ]
      },
      evaluationNotes: "Exceptional candidate with strong technical skills and leadership experience.",
      screeningScore: 10,
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 12).toISOString()
    }
  ];

  useEffect(() => {
    setMounted(true);
    if (id) {
      fetchJobDetails();
      fetchApplications();
      fetchScreeningQuestions();
      // Use sample statistics data instead of fetching
      setSampleStatistics();
    }
  }, [id]);
  
  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://196.188.249.24:3010/api/jobs/${id}`, {
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
      // For testing, use sample applications directly
      setApplications(sampleApplications);
      
      // Comment out the API call for now
      /*
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://196.188.249.24:3010/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setApplications(response.data);
      */
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications(sampleApplications);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchScreeningQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://196.188.249.24:3010/api/pre-screening-questions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScreeningQuestions(response.data);
    } catch (error) {
      console.error("Error fetching screening questions:", error);
    }
  };
  
  const setSampleStatistics = () => {
    // Sample data for statistics
    const sampleStats: JobStatistics = {
      totalApplications: 42,
      applicationsByStatus: {
        pending: 15,
        reviewed: 10,
        shortlisted: 8,
        rejected: 5,
        hired: 4,
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
        options: newQuestion.options.filter((opt: string) => opt.trim() !== ""),
      };

      await axios.post(
        "http://196.188.249.24:3010/api/screening-questions",
        questionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh questions
      fetchScreeningQuestions();
      
      // Reset form
      setNewQuestion({
        question: "",
        type: "text",
        options: [""],
        correctAnswer: "",
        required: false,
        weight: 1,
      });
    } catch (error) {
      console.error("Error adding screening question:", error);
    }
  };
  
  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://196.188.249.24:3010/api/applications/${applicationId}`,
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
  
  // Don't render anything until after hydration
  if (!mounted) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading job details...</div>;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100 shadow-sm">
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
            <div className="prose prose-blue max-w-none prose-headings:text-blue-800 prose-p:text-gray-700 prose-strong:text-blue-700" dangerouslySetInnerHTML={{ __html: job?.description || "" }} />
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
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setCurrentTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab("applications")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === "applications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setCurrentTab("screening")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === "screening"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Screening Questions
            </button>
            <button
              onClick={() => setCurrentTab("statistics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === "statistics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setCurrentTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {currentTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-xl text-blue-800 mb-3">Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {job?.responsibilities?.map((responsibility, index) => (
                      <li key={index} className="text-gray-700">{responsibility}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-xl text-blue-800 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job?.skill?.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-xl text-blue-800 mb-3">Benefits</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {job?.benefits?.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Experience Level</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
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
                            {question.required && <Badge>Required</Badge>}
                            <Badge>Weight: {question.weight}</Badge>
                          </div>
                          {question.type === 'multiple-choice' && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Options:</p>
                              <ul className="list-disc list-inside">
                                {question.options?.map((option, i) => (
                                  <li key={i}>{option}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {question.correctAnswer && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Correct Answer:</p>
                              <p>{question.correctAnswer}</p>
                            </div>
                          )}
                        </div>
                        <div className="w-full md:w-1/5 flex justify-end">
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Add New Question</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <Textarea 
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    placeholder="Enter your question"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Select 
                    value={newQuestion.type}
                    onValueChange={(value) => setNewQuestion({...newQuestion, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="yes-no">Yes/No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newQuestion.type === 'multiple-choice' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Options</label>
                    {newQuestion.options?.map((option, index) => (
                      <div key={index} className="flex gap-2 mb-2">
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
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const updatedOptions = newQuestion.options?.filter((_, i) => i !== index);
                            setNewQuestion({...newQuestion, options: updatedOptions});
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewQuestion({
                          ...newQuestion, 
                          options: [...(newQuestion.options || []), ""]
                        });
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Correct Answer</label>
                  <Input 
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                    placeholder="Enter correct answer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Weight</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={newQuestion.weight}
                    onChange={(e) => setNewQuestion({...newQuestion, weight: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="required" 
                    checked={newQuestion.required}
                    onCheckedChange={(checked) => 
                      setNewQuestion({...newQuestion, required: checked as boolean})
                    }
                  />
                  <label htmlFor="required" className="text-sm font-medium">
                    Required
                  </label>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleAddQuestion}
                >
                  Add Question
                </Button>
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
                  <p className="text-3xl font-bold">{statistics?.totalApplications || 0}</p>
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

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetail
          application={selectedApplication}
          screeningQuestions={screeningQuestions}
          onStatusChange={handleUpdateApplicationStatus}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

export default EmployerJobDetail; 
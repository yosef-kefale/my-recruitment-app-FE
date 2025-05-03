import { useState } from "react";
import { Application } from "../../../models/application";
import { ScreeningQuestion } from "../../../models/screeningQuestion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  Calendar, 
  FileText, 
  Download, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Star,
  MessageSquare,
  Save,
  Eye,
  ExternalLink
} from "lucide-react";

interface ApplicationDetailProps {
  application: Application;
  screeningQuestions: ScreeningQuestion[];
  onStatusChange: (applicationId: string, newStatus: string) => void;
  onClose: () => void;
}

const ApplicationDetail = ({
  application,
  screeningQuestions,
  onStatusChange,
  onClose,
}: ApplicationDetailProps) => {
  const [evaluationNotes, setEvaluationNotes] = useState(application.evaluationNotes || "");
  const [evaluationScore, setEvaluationScore] = useState(application.screeningScore || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 mr-1" />;
      case 'reviewed': return <Eye className="h-4 w-4 mr-1" />;
      case 'shortlisted': return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'rejected': return <XCircle className="h-4 w-4 mr-1" />;
      case 'hired': return <AlertCircle className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    // Simulate saving notes
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    // In a real app, you would update the application with the new notes and score
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl text-blue-800">Application Details</DialogTitle>
              <DialogDescription>
                Review and manage application #{application.id?.slice(0, 8)}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(application.status)} text-white flex items-center px-3 py-1`}>
                {getStatusIcon(application.status)}
                {application.status}
              </Badge>
              {application.screeningScore && application.screeningScore > 0 && (
                <Badge className="bg-green-500 text-white flex items-center px-3 py-1">
                  <Star className="h-4 w-4 mr-1" />
                  Score: {application.screeningScore}/10
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Application Info</TabsTrigger>
            <TabsTrigger value="screening">Screening</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-xl text-blue-800">Applicant Information</CardTitle>
                <CardDescription>Basic information about the applicant</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Applicant ID</p>
                      <p className="text-base">{application.userId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Applied On</p>
                      <p className="text-base">{new Date(application.applicationInformation.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">CV</p>
                      <div className="flex flex-col gap-2">
                        <a 
                          href={application.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View CV
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-xl text-blue-800">Cover Letter</CardTitle>
                <CardDescription>The applicant's cover letter</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="whitespace-pre-line">{application.coverLetter}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="screening" className="space-y-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-xl text-blue-800">Screening Questions</CardTitle>
                <CardDescription>Answers to pre-screening questions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {screeningQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No screening questions have been set for this job.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {screeningQuestions.map((question, index) => {
                      // Find the answer for this question
                      const answer = application.applicationInformation.screeningAnswers?.find(
                        (a) => a.questionId === question.id
                      );
                      
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-blue-800">{question.question}</h4>
                            <Badge className="bg-blue-100 text-blue-800">
                              Weight: {question.weight}
                            </Badge>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-gray-700">{answer?.answer || "No answer provided"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-xl text-blue-800">Screening Score</CardTitle>
                <CardDescription>Rate the applicant's screening answers</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Score: {evaluationScore}/10</span>
                    <span className="text-sm text-gray-500">Drag to adjust</span>
                  </div>
                  <Slider 
                    value={[evaluationScore]} 
                    onValueChange={(value) => setEvaluationScore(value[0])}
                    max={10}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveNotes} 
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSaving ? (
                        <>
                          <Save className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Score
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-xl text-blue-800">Evaluation Notes</CardTitle>
                <CardDescription>Add your evaluation notes for this application</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your evaluation notes here..."
                    value={evaluationNotes}
                    onChange={(e) => setEvaluationNotes(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveNotes} 
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSaving ? (
                        <>
                          <Save className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Notes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-xl text-blue-800">Update Status</CardTitle>
                <CardDescription>Change the application status</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Select 
                    value={application.status} 
                    onValueChange={(value) => onStatusChange(application.id || "", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetail; 
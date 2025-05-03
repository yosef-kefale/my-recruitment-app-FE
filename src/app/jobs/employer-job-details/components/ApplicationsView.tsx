import { useState } from "react";
import { Application } from "../../../models/application";
import { ScreeningQuestion } from "../../../models/screeningQuestion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ApplicationDetail from "./ApplicationDetail";
import { Eye, Download, FileText, Calendar, CheckCircle, XCircle, Clock, AlertCircle, ExternalLink, CheckSquare } from "lucide-react";

interface ApplicationsViewProps {
  applications: Application[];
  screeningQuestions: ScreeningQuestion[];
  onUpdateApplicationStatus: (applicationId: string, newStatus: string) => void;
  showBulkEvaluation: boolean;
  onToggleBulkEvaluation: () => void;
}

const ApplicationsView = ({ 
  applications, 
  screeningQuestions,
  onUpdateApplicationStatus,
  showBulkEvaluation,
  onToggleBulkEvaluation
}: ApplicationsViewProps) => {
  // Application filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Filter and sort applications
  const filteredApplications = Array.isArray(applications) 
    ? applications
        .filter(app => {
          // Filter by status
          if (statusFilter !== "all" && app.status !== statusFilter) {
            return false;
          }
          
          // Filter by search query
          if (searchQuery && !app.coverLetter.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          
          return true;
        })
        .sort((a, b) => {
          // Sort by date
          if (sortBy === "newest") {
            const dateA = a.applicationInformation?.appliedAt ? new Date(a.applicationInformation.appliedAt).getTime() : 0;
            const dateB = b.applicationInformation?.appliedAt ? new Date(b.applicationInformation.appliedAt).getTime() : 0;
            return dateB - dateA;
          } else if (sortBy === "oldest") {
            const dateA = a.applicationInformation?.appliedAt ? new Date(a.applicationInformation.appliedAt).getTime() : 0;
            const dateB = b.applicationInformation?.appliedAt ? new Date(b.applicationInformation.appliedAt).getTime() : 0;
            return dateA - dateB;
          } else if (sortBy === "score") {
            // Use optional chaining to handle potential undefined values
            return (b.screeningScore || 0) - (a.screeningScore || 0);
          }
          return 0;
        })
    : [];

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

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <Input 
              placeholder="Search in cover letters..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort applications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="score">Screening Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={onToggleBulkEvaluation}
              className="flex items-center justify-center gap-2"
              variant={showBulkEvaluation ? "outline" : "default"}
            >
              <CheckSquare size={16} />
              {showBulkEvaluation ? "Hide Bulk Evaluation" : "Show Bulk Evaluation"}
            </Button>
          </div>
        </div>
        
        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No applications found matching your criteria</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search query</p>
              </div>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                <div className="flex flex-col md:flex-row">
                  {/* Main Content */}
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-blue-800">Application #{application.id?.slice(0, 8)}</h3>
                        <Badge className={`${getStatusColor(application.status)} text-white flex items-center`}>
                          {getStatusIcon(application.status)}
                          {application.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {application.applicationInformation?.appliedAt 
                          ? new Date(application.applicationInformation.appliedAt).toLocaleDateString()
                          : 'No date available'}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="font-medium text-gray-700">Cover Letter:</p>
                      <p className="text-sm mt-1 line-clamp-2 text-gray-600">{application.coverLetter}</p>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a 
                        href={application.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View CV
                      </a>
                      {application.screeningScore && application.screeningScore > 0 && (
                        <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Screening Score: <span className="font-medium ml-1">{application.screeningScore}/10</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons - Now more prominent */}
                  <div className="bg-gray-50 p-4 md:p-6 flex flex-col gap-3 border-t md:border-t-0 md:border-l border-gray-200">
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                          window.open(application.resumeUrl, '_blank');
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View CV
                      </Button>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Update Status</label>
                      <Select 
                        value={application.status} 
                        onValueChange={(value) => onUpdateApplicationStatus(application.id || "", value)}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
      
      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetail
          application={selectedApplication}
          screeningQuestions={screeningQuestions}
          onStatusChange={onUpdateApplicationStatus}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </Card>
  );
};

export default ApplicationsView; 
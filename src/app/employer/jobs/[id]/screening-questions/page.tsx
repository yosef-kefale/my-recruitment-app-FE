"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, X, Save, Plus } from "lucide-react";
import { API_URL } from "@/lib/api";

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

export default function ScreeningQuestionsTab({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
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

  useEffect(() => {
    fetchQuestions();
  }, [jobId]);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/pre-screening-questions?jobPostId=${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      setQuestions(questions => 
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
        title: "Success",
        description: "Question updated successfully",
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

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/pre-screening-questions/${questionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      // Update the local state
      setQuestions(questions => questions.filter(q => q.jobPostId !== questionId));
      
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddQuestion = async () => {
    try {
      const token = localStorage.getItem("token");
      const questionToAdd = {
        ...newQuestion,
        jobPostId: jobId
      };

      const response = await fetch(`${API_URL}/pre-screening-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(questionToAdd),
      });

      if (!response.ok) {
        throw new Error("Failed to add question");
      }

      const newQuestionData = await response.json();
      setQuestions([...questions, newQuestionData]);
      
      // Reset form
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
      
      toast({
        title: "Success",
        description: "Question added successfully",
      });
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Questions List - Left Side */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Screening Questions</h3>
        <div className="space-y-3">
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No screening questions added yet
            </div>
          ) : (
            questions.map((question, index) => (
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
                        onClick={() => handleDeleteQuestion(question.jobPostId)}
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

      {/* Add/Edit Question Form - Right Side */}
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
              onValueChange={(value) => setNewQuestion({...newQuestion, type: value})}
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
  );
} 
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScreeningQuestion } from "@/app/models/screeningQuestion";
import { API_URL } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type QuestionType = "text" | "multiple-choice" | "yes-no" | "boolean" | "essay";

interface ScreeningQuestionsFormProps {
  jobId: string;
  questions: ScreeningQuestion[];
  onQuestionsChange: (questions: ScreeningQuestion[]) => void;
}

export function ScreeningQuestionsForm({
  jobId,
  questions,
  onQuestionsChange,
}: ScreeningQuestionsFormProps) {
  const { toast } = useToast();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Omit<ScreeningQuestion, 'jobPostId' | 'id'>>({
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

  const handleEditQuestion = (question: ScreeningQuestion) => {
    if (!question.id) return;
    
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
    setEditingQuestionId(question.id);
    // Scroll to the form section
    document.getElementById('question-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
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
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestionId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/pre-screening-questions/${editingQuestionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newQuestion,
          jobPostId: jobId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update question");
      }

      const updatedQuestion = await response.json();
      onQuestionsChange(questions.map(q => q.id === editingQuestionId ? updatedQuestion : q));
      
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

      onQuestionsChange(questions.filter(q => q.id !== questionId));
      setQuestionToDelete(null);
      
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Questions List - Left Side */}
      <div className="space-y-4">
        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No screening questions added yet
            </div>
          ) : (
            questions.map((question, index) => (
              <Card 
                key={question.id} 
                className={`p-4 hover:shadow-md transition-shadow ${
                  editingQuestionId === question.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => question.id && handleEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete the question
                              "{question.question}".
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setQuestionToDelete(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => question.id && handleDeleteQuestion(question.id)}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{question.question}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{question.type}</Badge>
                    {question.isKnockout && <Badge className="bg-red-100 text-red-800">Knockout</Badge>}
                    <Badge>Weight: {question.weight}</Badge>
                    {question.score !== undefined && <Badge>Score: {question.score}</Badge>}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Question Form - Right Side */}
      <div id="question-form" className="space-y-4 sticky top-4">
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
              onValueChange={(value) => setNewQuestion({...newQuestion, type: value as QuestionType})}
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

          {newQuestion.type === "multiple-choice" && (
            <div>
              <Label className="text-sm font-medium">Options (one per line)</Label>
              <Textarea 
                value={newQuestion.options?.join("\n") || ""}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  options: e.target.value.split("\n").filter(opt => opt.trim())
                })}
                placeholder="Enter options, one per line"
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

          <div className="flex gap-2">
            <Button
              onClick={handleUpdateQuestion}
              className="flex-1"
            >
              {editingQuestionId ? "Update Question" : "Add Question"}
            </Button>
            {editingQuestionId && (
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
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
import { Wand2, Plus, X, Edit, Save, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QuestionType = "text" | "multiple-choice" | "yes-no" | "boolean" | "essay";

interface ScreeningQuestion {
  id: string;
  jobPostId: string;
  question: string;
  type: QuestionType;
  options?: string[];
  isKnockout: boolean;
  weight: number;
  booleanAnswer?: boolean;
  selectedOptions?: string[];
  essayAnswer?: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

interface ScreeningQuestionsFormProps {
  screeningQuestions: ScreeningQuestion[];
  setScreeningQuestions: (questions: ScreeningQuestion[] | ((prev: ScreeningQuestion[]) => ScreeningQuestion[])) => void;
  newQuestion: Omit<ScreeningQuestion, 'id' | 'jobPostId' | 'createdAt' | 'updatedAt'>;
  setNewQuestion: (question: Omit<ScreeningQuestion, 'id' | 'jobPostId' | 'createdAt' | 'updatedAt'>) => void;
  editingQuestionId: string | null;
  setEditingQuestionId: (id: string | null) => void;
  isGeneratingQuestions: boolean;
  setIsGeneratingQuestions: (value: boolean) => void;
  handleGenerateQuestions: () => void;
  handleAddQuestion: () => void;
  handleUpdateQuestion: () => void;
  handleEditQuestion: (question: ScreeningQuestion) => void;
  handleQuestionTypeChange: (value: QuestionType) => void;
}

export default function ScreeningQuestionsForm({
  screeningQuestions,
  setScreeningQuestions,
  newQuestion,
  setNewQuestion,
  editingQuestionId,
  setEditingQuestionId,
  isGeneratingQuestions,
  setIsGeneratingQuestions,
  handleGenerateQuestions,
  handleAddQuestion,
  handleUpdateQuestion,
  handleEditQuestion,
  handleQuestionTypeChange,
}: ScreeningQuestionsFormProps) {
  return (
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
                  <Card key={question.id} className="p-4 hover:shadow-md transition-shadow">
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
            <h3 className="font-semibold text-lg">Add New Question</h3>
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
  );
} 
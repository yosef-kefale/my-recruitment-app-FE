import { useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Wand2, Plus, Loader2, X } from "lucide-react";
import RichTextEditor, { RichTextEditorHandle } from "@/components/RichTextEditor";

interface JobDescriptionFormProps {
  description: string;
  setDescription: (value: string) => void;
  skill: string[];
  setSkill: (value: string[]) => void;
  newSkill: string;
  setNewSkill: (value: string) => void;
  benefits: string[];
  setBenefits: (value: string[]) => void;
  newBenefit: string;
  setNewBenefit: (value: string) => void;
  responsibilities: string[];
  setResponsibilities: (value: string[]) => void;
  newResponsibility: string;
  setNewResponsibility: (value: string) => void;
  jobPostRequirement: string[];
  setJobPostRequirement: (value: string[]) => void;
  newRequirement: string;
  setNewRequirement: (value: string) => void;
  errors: Record<string, string>;
  isSuggestingSkills: boolean;
  setIsSuggestingSkills: (value: boolean) => void;
  isSuggestingRequirements: boolean;
  setIsSuggestingRequirements: (value: boolean) => void;
  isSuggestingResponsibilities: boolean;
  setIsSuggestingResponsibilities: (value: boolean) => void;
  isGeneratingDescription: boolean;
  setIsGeneratingDescription: (value: boolean) => void;
  handleUseAI: () => void;
  handleSuggestSkills: () => void;
  handleSuggestRequirements: () => void;
  handleSuggestResponsibilities: () => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (index: number) => void;
  handleAddBenefit: () => void;
  handleRemoveBenefit: (index: number) => void;
  handleAddResponsibility: () => void;
  handleRemoveResponsibility: (index: number) => void;
  handleAddRequirement: () => void;
  handleRemoveRequirement: (index: number) => void;
  handleDescriptionChange: (content: string) => void;
}

export default function JobDescriptionForm({
  description,
  setDescription,
  skill,
  setSkill,
  newSkill,
  setNewSkill,
  benefits,
  setBenefits,
  newBenefit,
  setNewBenefit,
  responsibilities,
  setResponsibilities,
  newResponsibility,
  setNewResponsibility,
  jobPostRequirement,
  setJobPostRequirement,
  newRequirement,
  setNewRequirement,
  errors,
  isSuggestingSkills,
  setIsSuggestingSkills,
  isSuggestingRequirements,
  setIsSuggestingRequirements,
  isSuggestingResponsibilities,
  setIsSuggestingResponsibilities,
  isGeneratingDescription,
  setIsGeneratingDescription,
  handleUseAI,
  handleSuggestSkills,
  handleSuggestRequirements,
  handleSuggestResponsibilities,
  handleAddSkill,
  handleRemoveSkill,
  handleAddBenefit,
  handleRemoveBenefit,
  handleAddResponsibility,
  handleRemoveResponsibility,
  handleAddRequirement,
  handleRemoveRequirement,
  handleDescriptionChange,
}: JobDescriptionFormProps) {
  const descriptionEditorRef = useRef<RichTextEditorHandle>(null);

  return (
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
  );
} 
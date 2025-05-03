import { useState, useEffect } from "react";
import { MapPin, X, Filter, DollarSign, Briefcase, Clock, Tag, GraduationCap, Building2, UserCog, ChevronDown, ChevronUp, Plus, Eraser } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Ethiopian cities enum
enum EthiopianCity {
  AddisAbaba = "Addis Ababa",
  DireDawa = "Dire Dawa",
  Adama = "Adama",
  Gondar = "Gondar",
  Mekelle = "Mekelle",
  Hawassa = "Hawassa",
  BahirDar = "Bahir Dar",
  Jimma = "Jimma",
  Dessie = "Dessie",
  Jijiga = "Jijiga",
  Shashamane = "Shashamane",
  Bishoftu = "Bishoftu",
  ArbaMinch = "Arba Minch",
  Hosaena = "Hosaena",
  Harar = "Harar",
  Dilla = "Dilla",
  Nekemte = "Nekemte",
  DebreBirhan = "Debre Birhan",
  Asella = "Asella",
  Remote = "Remote"
}

interface FilterValues {
  salary?: number;
  location?: string;
  availability?: {
    freelance?: boolean;
    fullTime?: boolean;
    readyWork?: boolean;
  };
  jobPreference?: string;
  specialties?: Array<{ name: string; checked: boolean }>;
  industry?: string;
  experienceLevel?: string;
  educationLevel?: string;
  employmentType?: string;
}

interface FilterSidebarProps {
  filterValues: FilterValues;
  onFilterChange: (values: FilterValues) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const FilterSidebar = ({ filterValues, onFilterChange, searchQuery, onSearchChange }: FilterSidebarProps) => {
  const [salary, setSalary] = useState(filterValues.salary || 0);
  const [location, setLocation] = useState(filterValues.location || "");
  const [availability, setAvailability] = useState(filterValues.availability || {
    freelance: false,
    fullTime: false,
    readyWork: false
  });
  const [jobPreference, setJobPreference] = useState(filterValues.jobPreference || "");
  const [specialties, setSpecialties] = useState(filterValues.specialties || []);
  const [industry, setIndustry] = useState(filterValues.industry || "");
  const [experienceLevel, setExperienceLevel] = useState(filterValues.experienceLevel || "");
  const [educationLevel, setEducationLevel] = useState(filterValues.educationLevel || "");
  const [employmentType, setEmploymentType] = useState(filterValues.employmentType || "");
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");

  // Update state when parent changes the filter values
  useEffect(() => {
    setSalary(filterValues.salary || 0);
    setLocation(filterValues.location || "");
    setAvailability(filterValues.availability || {
      freelance: false,
      fullTime: false,
      readyWork: false
    });
    setJobPreference(filterValues.jobPreference || "");
    setSpecialties(filterValues.specialties || []);
    setIndustry(filterValues.industry || "");
    setExperienceLevel(filterValues.experienceLevel || "");
    setEducationLevel(filterValues.educationLevel || "");
    setEmploymentType(filterValues.employmentType || "");
  }, [filterValues]);

  // Emit changes back to the parent component
  const handleSalaryChange = (value: number) => {
    setSalary(value);
    onFilterChange({ salary: value });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    onFilterChange({ location: value });
  };

  const handleAvailabilityChange = (field: keyof typeof availability) => {
    const updatedAvailability = {
      ...availability,
      [field]: !availability[field],
    };
    setAvailability(updatedAvailability);
    onFilterChange({ availability: updatedAvailability });
  };

  const handleIndustryChange = (value: string) => {
    setIndustry(value);
    onFilterChange({ industry: value });
  };

  const handleExperienceLevelChange = (value: string) => {
    setExperienceLevel(value);
    onFilterChange({ experienceLevel: value });
  };

  const handleEducationLevelChange = (value: string) => {
    setEducationLevel(value);
    onFilterChange({ educationLevel: value });
  };

  const handleEmploymentTypeChange = (value: string) => {
    setEmploymentType(value);
    onFilterChange({ employmentType: value });
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.some((spec: { name: string }) => spec.name === newSpecialty.trim())) {
      const updatedSpecialties = [
        ...specialties,
        { name: newSpecialty.trim(), checked: true }
      ];
      setSpecialties(updatedSpecialties);
      setNewSpecialty("");
      onFilterChange({ specialties: updatedSpecialties });
    }
  };

  const handleSpecialtyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSpecialty();
    }
  };

  const handleRemoveSpecialty = (name: string) => {
    const updatedSpecialties = specialties.filter((spec: { name: string }) => spec.name !== name);
    setSpecialties(updatedSpecialties);
    onFilterChange({ specialties: updatedSpecialties });
  };

  const resetFilters = () => {
    setSalary(0);
    setLocation("");
    setAvailability({
      freelance: false,
      fullTime: false,
      readyWork: false
    });
    setJobPreference("");
    setSpecialties([]);
    setIndustry("");
    setExperienceLevel("");
    setEducationLevel("");
    setEmploymentType("");
    setNewSpecialty("");
    setShowAdditionalFilters(false);
  };

  const toggleAdditionalFilters = () => {
    setShowAdditionalFilters(!showAdditionalFilters);
  };

  return (
    <div className="p-2 sm:p-6 bg-white rounded-lg h-full overflow-y-auto">

      <div className="space-y-3 sm:space-y-4">
        {/* Industry & Employment Type */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium text-gray-700">Industry</h4>
          </div>
          <Select value={industry} onValueChange={handleIndustryChange}>
            <SelectTrigger className="w-full">
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

        <Separator />

        {/* Location */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium text-gray-700">Location</h4>
          </div>
          <Select value={location} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(EthiopianCity).map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Experience & Education */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium text-gray-700">Experience Level</h4>
          </div>
          <Select value={experienceLevel} onValueChange={handleExperienceLevelChange}>
            <SelectTrigger className="w-full">
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

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium text-gray-700">Education Level</h4>
          </div>
          <Select value={educationLevel} onValueChange={handleEducationLevelChange}>
            <SelectTrigger className="w-full">
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

        <Separator />

        {/* Salary Slider */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium text-gray-700">Salary</h4>
          </div>
          <div className="px-1">
            <Slider
              value={[salary]}
              min={10}
              max={1000000}
              step={10}
              onValueChange={(value) => handleSalaryChange(value[0])}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>$10</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                ${salary}
              </Badge>
              <span>$1000000</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Filters Toggle */}
        <div className="space-y-2 sm:space-y-3">
          <button 
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-blue-600"
            onClick={toggleAdditionalFilters}
          >
            <span>Additional Filters</span>
            {showAdditionalFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showAdditionalFilters && (
            <div className="space-y-3 sm:space-y-4 pt-4">
              {/* Availability */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <h4 className="font-medium text-gray-700">Availability</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="freelance" 
                      checked={availability.freelance}
                      onCheckedChange={() => handleAvailabilityChange("freelance")}
                    />
                    <Label htmlFor="freelance" className="text-sm">Freelance / Contract</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fullTime" 
                      checked={availability.fullTime}
                      onCheckedChange={() => handleAvailabilityChange("fullTime")}
                    />
                    <Label htmlFor="fullTime" className="text-sm">Full Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="readyWork" 
                      checked={availability.readyWork}
                      onCheckedChange={() => handleAvailabilityChange("readyWork")}
                    />
                    <Label htmlFor="readyWork" className="text-sm">Ready to Work</Label>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <h4 className="font-medium text-gray-700">Specialties</h4>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={handleSpecialtyKeyDown}
                    placeholder="Add specialty (press Enter)"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline"
                    onClick={handleAddSpecialty}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialties.map((spec: { name: string; checked: boolean }) => (
                    <Badge
                      key={spec.name}
                      variant={spec.checked ? "default" : "outline"}
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {spec.name}
                      <button
                        onClick={() => handleRemoveSpecialty(spec.name)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FilterSidebar;

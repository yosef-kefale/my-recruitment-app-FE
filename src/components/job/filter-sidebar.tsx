import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const FilterSidebar = ({ filterValues, onFilterChange }) => {
  const [salary, setSalary] = useState(filterValues.salary);
  const [jobType, setJobType] = useState(filterValues.jobType);
  const [location, setLocation] = useState(filterValues.location);
  const [availability, setAvailability] = useState(filterValues.availability);
  const [jobPreference, setJobPreference] = useState(filterValues.jobPreference);
  const [specialties, setSpecialties] = useState(filterValues.specialties);

  // Update state when parent changes the filter values
  useEffect(() => {
    setSalary(filterValues.salary);
    setJobType(filterValues.jobType);
    setLocation(filterValues.location);
    setAvailability(filterValues.availability);
    setJobPreference(filterValues.jobPreference);
    setSpecialties(filterValues.specialties);
  }, [filterValues]);

  // Emit changes back to the parent component
  const handleSalaryChange = (value: number) => {
    setSalary(value);
    onFilterChange({ salary: value });
  };

  const handleJobTypeChange = (value: string) => {
    setJobType(value);
    onFilterChange({ jobType: value });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    onFilterChange({ location: value });
  };

  const handleAvailabilityChange = (field: string) => {
    const updatedAvailability = {
      ...availability,
      [field]: !availability[field],
    };
    setAvailability(updatedAvailability);
    onFilterChange({ availability: updatedAvailability });
  };

  const handleJobPreferenceChange = (value: string) => {
    setJobPreference(value);
    onFilterChange({ jobPreference: value });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSpecialtyChange = (name: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedSpecialties = specialties.map((spec: { name: any; checked: any; }) =>
      spec.name === name
        ? { ...spec, checked: !spec.checked }
        : spec
    );
    setSpecialties(updatedSpecialties);
    onFilterChange({ specialties: updatedSpecialties });
  };

  return (
    <div className="p-6 bg-white shadow-lg h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Filter</h3>
        <button
          className="text-sm text-blue-500"
          onClick={() => onFilterChange({})} // Reset all filters
        >
          Clear all ✕
        </button>
      </div>

      {/* Job Type */}
      <div className="mt-4">
        <label className="block font-semibold">Type</label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobType"
              className="form-radio text-blue-500"
              checked={jobType === "For me"}
              onChange={() => handleJobTypeChange("For me")}
            />
            <span>For me</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobType"
              className="form-radio text-blue-500"
              checked={jobType === "All"}
              onChange={() => handleJobTypeChange("All")}
            />
            <span>All</span>
          </label>
        </div>
      </div>

      {/* Location */}
      <div className="mt-4">
        <label className="block font-semibold">Location</label>
        <div className="flex items-center border p-2 mt-1 rounded-md shadow-sm">
          <MapPin className="text-gray-400 mr-2" size={16} />
          <select
            className="w-full bg-transparent outline-none"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
          >
            <option>New York</option>
            <option>San Francisco</option>
            <option>Los Angeles</option>
          </select>
        </div>
      </div>

      {/* Availability */}
      <div className="mt-4">
        <label className="block font-semibold">Availability</label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500"
              checked={availability.freelance}
              onChange={() => handleAvailabilityChange("freelance")}
            />
            <span>Freelance / Contract</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500"
              checked={availability.fullTime}
              onChange={() => handleAvailabilityChange("fullTime")}
            />
            <span>Full Time</span>
          </label>
        </div>
      </div>

      {/* Salary Slider */}
      <div className="mt-4">
        <label className="block font-semibold">Salary</label>
        <div className="mt-2">
          <input
            type="range"
            min="10"
            max="3500"
            value={salary}
            onChange={(e) => handleSalaryChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>$10</span>
            <span>${salary}</span>
            <span>$3500</span>
          </div>
        </div>
      </div>

      {/* Jobs You Might Like */}
      {/* <div className="mt-4">
        <label className="block font-semibold">Jobs You Might Like</label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobPreference"
              className="form-radio text-blue-500"
              checked={jobPreference === "Best Matches"}
              onChange={() => handleJobPreferenceChange("Best Matches")}
            />
            <span>Best Matches</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobPreference"
              className="form-radio text-blue-500"
              checked={jobPreference === "Most Recent"}
              onChange={() => handleJobPreferenceChange("Most Recent")}
            />
            <span>Most Recent</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobPreference"
              className="form-radio text-blue-500"
              checked={jobPreference === "Saved Jobs"}
              onChange={() => handleJobPreferenceChange("Saved Jobs")}
            />
            <span>Saved Jobs</span>
          </label>
        </div>
      </div> */}

      {/* Specialties */}
      <div className="mt-4">
        <label className="block font-semibold">Specialties</label>
        <div className="mt-2 space-y-2">
          {specialties.map((spec) => (
            <label key={spec.name} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500"
                  checked={spec.checked}
                  onChange={() => handleSpecialtyChange(spec.name)}
                />
                <span>{spec.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

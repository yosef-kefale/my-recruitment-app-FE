import { useState } from "react";
import { MapPin } from "lucide-react";


const FilterSidebar = () => {
  const [salary, setSalary] = useState(1500);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Filter</h3>
        <button className="text-sm text-blue-500">Clear all ✕</button>
      </div>

      {/* Location */}
      <div className="mt-4">
        <label className="block font-semibold">Type</label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobType"
              className="form-radio text-blue-500"
              checked
            />
            <span>For me</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobType"
              className="form-radio text-blue-500"
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
          <select className="w-full bg-transparent outline-none">
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
              checked
            />
            <span>Freelance / Contract</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500"
              checked
            />
            <span>Full Time</span>
          </label>
        </div>
      </div>

      {/* Jobs You Might Like */}
      <div className="mt-4">
        <label className="block font-semibold">Jobs You Might Like</label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobType"
              className="form-radio text-blue-500"
              checked
            />
            <span>Best Matches</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobType"
              className="form-radio text-blue-500"
            />
            <span>Most Recent</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="jobType"
              className="form-radio text-blue-500"
            />
            <span>Saved Jobs</span>
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
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>$10</span>
            <span>${salary}</span>
            <span>$3500</span>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="mt-4">
        <label className="block font-semibold">Availability</label>
        <div className="mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500"
              checked
            />
            <span>Ready Work</span>
          </label>
        </div>
      </div>

      {/* Specialties */}
      <div className="mt-4">
        <label className="block font-semibold">Specialties</label>
        <div className="mt-2 space-y-2">
          {[
            { name: "Graphic Designer", count: 42 },
            { name: "UI Designer", count: 24 },
            { name: "UX Designer", count: 22 },
            { name: "Web Design", count: 12 },
          ].map((spec) => (
            <label
              key={spec.name}
              className="flex justify-between items-center"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500"
                  checked
                />
                <span>{spec.name}</span>
              </div>
              <span className="text-gray-500">{spec.count}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

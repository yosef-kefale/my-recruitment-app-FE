import { useState } from "react";

interface JobCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  job: any;
}

const JobCard: React.FC<JobCardProps> = ({ job}) => {
  const [isActive, setIsActive] = useState(job.active);

  const toggleStatus = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <span className={`px-3 py-1 text-sm font-semibold rounded-lg ${isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Company & Location */}
      <p className="text-gray-500">{job.company} - {job.location}</p>
      
      {/* Salary */}
      <p className="text-gray-800 font-semibold mt-2">💰 ${job.salary.toLocaleString()}</p>

      {/* Job Description */}
      <p className="text-gray-600 mt-2">{job.description.slice(0, 100)}...</p>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-2">
        {job?.skills?.map((skill, index) => (
          <span key={index} className={`px-3 py-1 text-xs rounded-full ${skill.valid ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
            {skill.name} {skill.valid ? "✔" : "✖"}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-between items-center">
        {/* <button onClick={() => onViewApplicants(job.id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">View Applicants</button>
        <button onClick={() => onEdit(job.id)} className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600">Edit</button>
        <button onClick={() => onDelete(job.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700">Delete</button> */}

        {/* Toggle Switch */}
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only" checked={isActive} onChange={toggleStatus} />
          <div className="relative w-10 h-5 bg-gray-300 rounded-full shadow-inner">
            <div className={`absolute w-5 h-5 bg-white rounded-full shadow top-0 transition-transform ${isActive ? "translate-x-5 bg-green-500" : "translate-x-0 bg-red-500"}`}></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default JobCard;

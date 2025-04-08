import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { JobPosting } from "@/app/models/jobPosting";

interface JobDetailProps {
  job: JobPosting;
  onClose: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onClose }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 mt-20 h-[calc(100vh-5rem)] w-1/3 bg-white shadow-2xl border-l rounded-l-xl flex flex-col"
    >
      {/* Fixed Header: Job Title & Close Button */}
      <div className="p-6 border-b flex justify-between items-center bg-white z-10">
        <h2 className="text-2xl font-semibold text-sky-600">{job.title}</h2>
        <button
          onClick={onClose}
          className="text-xl text-gray-600 hover:text-red-500"
        >
          ✖
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Job Status */}
        <p
          className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
            job.status === "Open"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {job.status}
        </p>

        {/* Job Position & Location */}
        <p className="text-gray-600 mt-2">
          {job.position} • {job.workLocation}
        </p>

        {/* Salary & Employment Type */}
        <div className="flex justify-between items-center mt-4 bg-gray-100 p-3 rounded-lg">
          <div>
            <p className="text-lg font-bold text-gray-800">
              ${job.salary} / year
            </p>
            <span className="text-gray-500 text-sm">Salary</span>
          </div>
          <div>
            <p className="text-gray-800 font-medium">{job.employmentType}</p>
            <span className="text-gray-500 text-sm">Employment Type</span>
          </div>
        </div>

        {/* Job Description */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Job Description</h3>
          <p className="text-gray-700 mt-2">{job.description}</p>
        </div>

        {/* Skills Required */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Skills Required</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.skill.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all">
          Apply for this position
        </Button>
      </div>
    </motion.div>
  );
};

export default JobDetail;

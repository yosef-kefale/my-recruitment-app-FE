import JobPostingForm from "../../../components/job/job-posting-form";

export default function PostNewJob() {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Post a New Job</h2>
        <JobPostingForm />
      </div>
    );
  }
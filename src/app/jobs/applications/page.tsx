import React from "react";

const jobApplications = [
  {
    company: "HYS Enterprise",
    recruiter: "Olga",
    position: "Intern Front-end (Angular) Developer",
    status: "You shared your contacts with the employer.",
    time: "3mo",
  },
  {
    company: "EUROCOM Group",
    recruiter: "Yuliia",
    position: "Mid-Level React Native Developer",
    status: "You shared your contacts with the employer.",
    time: "3mo",
  },
  {
    company: "Thinksoft",
    recruiter: "Excellerent",
    position: "Frontend Developer",
    status: "The employer noted that you're not the right fit for the position at this time.",
    time: "3mo",
  },
  {
    company: "RepMove",
    recruiter: "Vitaliy",
    position: "Senior Full Stack Developer - Cross Platform Mobile App Developer",
    status: "The employer noted that you're not the right fit for the position at this time. Decline reason: mismatched skills.",
    time: "4mo",
  },
  {
    company: "Unravel",
    recruiter: "Vladimir",
    position: "Sr. Angular Developer",
    status: "You shared your contacts with the employer.",
    time: "4mo",
  },
];

const Applications = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "80%", margin: "auto" }}>
      <h2>Job Applications</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobApplications.map((job, index) => (
          <li
            key={index}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0",
            }}
          >
            <strong>{job.company} · {job.recruiter}</strong>
            <p>{job.position}</p>
            <p style={{ fontSize: "0.9em", color: "gray" }}>{job.status}</p>
            <p style={{ fontSize: "0.8em", color: "gray" }}>{job.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
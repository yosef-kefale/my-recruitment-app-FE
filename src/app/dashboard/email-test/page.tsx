'use client';
import React, { useState } from "react";

const templates = [
  { value: "verify-email", label: "Verify Email After Signup", subject: "Verify Your Email - TalentHub" },
  { value: "interview-scheduled", label: "Scheduled Interview Confirmation", subject: "Interview Scheduled - TalentHub" },
  { value: "shortlisted-candidate", label: "Shortlisted Candidate Confirmation", subject: "You Are Shortlisted - TalentHub" },
  { value: "rejected-candidate", label: "Rejected Candidate Confirmation", subject: "Application Update - TalentHub" },
  { value: "password-reset", label: "Password Reset", subject: "Password Reset Request - TalentHub" },
  { value: "generic-notification", label: "Generic Notification", subject: "Notification - TalentHub" },
];

async function fetchTemplateHtml(template: string) {
  // Dynamic import for SSR/Next.js compatibility
  const res = await fetch(`/api/email-templates/${template}`);
  if (!res.ok) throw new Error("Failed to load template");
  return await res.text();
}

export default function EmailTestPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].value);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState(templates[0].subject);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTemplate(value);
    const found = templates.find(t => t.value === value);
    setSubject(found?.subject || "");
  };

  const handleSend = async () => {
    setStatus("");
    setLoading(true);
    try {
      // Load HTML template
      const html = await fetchTemplateHtml(selectedTemplate);
      // Send email
      const res = await fetch("http://138.197.105.31:3010/api/email/send-grid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          subject,
          html,
        }),
      });
      if (!res.ok) throw new Error("Failed to send email");
      setStatus("Test email sent!");
    } catch (err: any) {
      setStatus("Error: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Send Test Email</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Template</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          {templates.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Subject</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Recipient Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          placeholder="user@example.com"
        />
      </div>
      <button
        className="bg-sky-600 text-white px-6 py-2 rounded font-medium hover:bg-sky-700 transition"
        onClick={handleSend}
        disabled={!recipient || loading}
      >
        {loading ? "Sending..." : "Send Test Email"}
      </button>
      {status && <div className="mt-4 text-green-600">{status}</div>}
    </div>
  );
} 
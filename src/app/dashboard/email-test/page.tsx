'use client';
import React, { useState } from "react";

const templates = [
  { 
    value: "verify-email", 
    label: "Verify Email After Signup", 
    subject: "Verify Your Email - TalentHub",
    variables: {
      verificationLink: "https://example.com/verify"
    }
  },
  { 
    value: "interview-scheduled", 
    label: "Scheduled Interview Confirmation", 
    subject: "Interview Scheduled - TalentHub",
    variables: {
      candidateName: "John Doe",
      interviewDate: "2024-03-20",
      interviewTime: "10:00 AM",
      interviewType: "Technical Interview",
      interviewerName: "Jane Smith"
    }
  },
  { 
    value: "shortlisted-candidate", 
    label: "Shortlisted Candidate Confirmation", 
    subject: "You Are Shortlisted - TalentHub",
    variables: {
      candidateName: "John Doe",
      positionName: "Senior Developer",
      companyName: "Tech Corp"
    }
  },
  { 
    value: "rejected-candidate", 
    label: "Rejected Candidate Confirmation", 
    subject: "Application Update - TalentHub",
    variables: {
      candidateName: "John Doe",
      positionName: "Senior Developer",
      companyName: "Tech Corp",
      baseUrl: "http://138.197.105.31:3000"
    }
  },
  { 
    value: "password-reset", 
    label: "Password Reset", 
    subject: "Password Reset Request - TalentHub",
    variables: {
      resetLink: "https://example.com/reset-password"
    }
  },
  { 
    value: "generic-notification", 
    label: "Generic Notification", 
    subject: "Notification - TalentHub",
    variables: {
      recipientName: "John Doe",
      notificationTitle: "Important Update",
      notificationContent: "This is a test notification.",
      actionButton: true,
      actionLink: "https://example.com",
      actionButtonText: "Click Here"
    }
  },
];

function replaceTemplateVariables(html: string, variables: Record<string, any>) {
  let result = html;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  // Remove any remaining template variables
  result = result.replace(/{{[^}]+}}/g, '');
  return result;
}

async function fetchTemplateHtml(template: string) {
  const res = await fetch(`/api/email-templates?template=${template}`);
  if (!res.ok) throw new Error("Failed to load template");
  return await res.text();
}

export default function EmailTestPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].value);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState(templates[0].subject);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [templateVariables, setTemplateVariables] = useState<Record<string, any>>(templates[0].variables);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTemplate(value);
    const found = templates.find(t => t.value === value);
    if (found) {
      setSubject(found.subject);
      setTemplateVariables(found.variables);
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSend = async () => {
    setStatus("");
    setLoading(true);
    try {
      // Load HTML template
      let html = await fetchTemplateHtml(selectedTemplate);
      // Replace template variables
      html = replaceTemplateVariables(html, templateVariables);
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
      <div className="mb-4">
        <label className="block mb-1 font-medium">Template Variables</label>
        <div className="space-y-2">
          {Object.entries(templateVariables).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm text-gray-600">{key}</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={value}
                onChange={e => handleVariableChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
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
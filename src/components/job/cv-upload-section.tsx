"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, X } from "lucide-react";

interface CVUploadSectionProps {
  existingCV?: string;
  onCVSelect: (file: File) => void;
  selectedCV: File | null;
}

export const CVUploadSection = ({
  existingCV,
  onCVSelect,
  selectedCV,
}: CVUploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
      onCVSelect(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
      onCVSelect(file);
    }
  };

  const handleRemoveCV = () => {
    onCVSelect(null as any);
  };

  return (
    <div className="space-y-4">
      {existingCV && !selectedCV && (
        <Card className="border-2 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Existing CV</p>
                  <p className="text-sm text-gray-500">Your profile CV</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => window.open(existingCV, "_blank")}
              >
                View CV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedCV ? (
        <Card className="border-2 border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{selectedCV.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedCV.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={handleRemoveCV}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="cv-upload"
          />
          <label
            htmlFor="cv-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-900">
              {existingCV
                ? "Upload a different CV for this job"
                : "Upload your CV"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, or DOCX (max. 5MB)
            </p>
          </label>
        </div>
      )}
    </div>
  );
}; 
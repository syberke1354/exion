"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, CircleCheck as CheckCircle, CircleAlert as AlertCircle, File, Image as ImageIcon } from "lucide-react";
import { uploadImage, type UploadProgress } from "@/lib/cloudinary-upload";

interface CloudinaryUploadProps {
  onUploadComplete: (results: { secure_url: string; url?: string }[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  className?: string;
  folder?: string;
  tags?: string[];
}

const CloudinaryUpload = ({
  onUploadComplete,
  onUploadError,
  multiple = false,
  maxFiles = 5,
  accept = "image/*",
  className = "",
  folder = "uploads",
  tags = [],
}: CloudinaryUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, UploadProgress>>({});
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!multiple && selectedFiles.length > 1) {
      setError("Only one file can be uploaded at a time");
      return;
    }

    if (selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFiles(selectedFiles);
    setError("");
    setSuccess(false);

    // Create previews for images
    const newPreviews: string[] = [];
    selectedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);
          if (newPreviews.length === selectedFiles.filter((f) => f.type.startsWith("image/")).length) {
            setPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    setUploadProgress({});

    try {
      const results: { secure_url: string; url?: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("folder", folder);
        
        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }
        
        const result = await response.json();
        results.push({ 
          secure_url: result.secure_url,
          url: result.url || result.secure_url 
        });
        
        // Update progress
        setUploadProgress((prev) => ({
          ...prev,
          [i]: { loaded: 100, total: 100, percentage: 100 }
        }));
      }

      setSuccess(true);
      onUploadComplete(results);

      // Reset form
      setTimeout(() => {
        setFiles([]);
        setPreviews([]);
        setUploadProgress({});
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      onUploadError?.(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);

    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getOverallProgress = () => {
    const progressValues = Object.values(uploadProgress);
    if (progressValues.length === 0) return 0;

    const totalProgress = progressValues.reduce((sum, progress) => sum + progress.percentage, 0);
    return Math.round(totalProgress / progressValues.length);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to browse</p>
        <p className="text-sm text-gray-500">{multiple ? "Select multiple files" : "Select a file"} to upload</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Button */}
      {files.length > 0 && (
        <Button onClick={handleUpload} disabled={uploading} className="w-full">
          {uploading ? "Uploading..." : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
        </Button>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">Upload completed successfully!</AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{getOverallProgress()}%</span>
          </div>
          <Progress value={getOverallProgress()} className="w-full" />
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                ) : (
                  <File className="h-5 w-5 text-gray-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {uploading && uploadProgress[index] !== undefined && (
                  <div className="w-24">
                    <Progress value={uploadProgress[index].percentage} className="h-2" />
                  </div>
                )}
                {!uploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { CloudinaryUpload };
export default CloudinaryUpload;

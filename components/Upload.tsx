import React, { useState } from "react";
import { Upload, File, Loader2, CheckCircle2 } from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";

export default function UploadBox() {
  const uploadDocument = useDocumentStore((s) => s.uploadDocument);
  
  // States for better UX
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    setFileName(file.name);
    setIsUploading(true);
    
    try {
      await uploadDocument(file);
      // Success logic yahan aayegi
    } catch (error) {
      console.error("Upload failed", error);
      alert("Kuch galat hua, phir se koshish karein.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          handleUpload(file);
        }}
        className={`
          relative group border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-white"}
          ${isUploading ? "pointer-events-none opacity-80" : "cursor-pointer"}
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileChange}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Icon Logic */}
          <div className="p-4 bg-gray-50 rounded-full group-hover:scale-110 transition-transform">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : fileName ? (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            ) : (
              <Upload className="w-8 h-8 text-gray-500" />
            )}
          </div>

          {/* Text Logic */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">
              {isUploading ? "Uploading..." : fileName ? "File Ready!" : "Click or drag file to upload"}
            </p>
            <p className="text-xs text-gray-500">
              {fileName ? fileName : "PDF, PNG, JPG (Max 5MB)"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar (Optional) */}
      {isUploading && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-blue-600 h-1.5 animate-progress-flow"></div>
        </div>
      )}
    </div>
  );
}
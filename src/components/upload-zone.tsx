"use client";

import { useRef, useState } from "react";

interface UploadZoneProps {
  icon: string;
  title: string;
  subtitle?: string;
  accept: string;
  onFileSelect: (file: File) => void;
  compact?: boolean;
}

export function UploadZone({
  icon,
  title,
  subtitle,
  accept,
  onFileSelect,
  compact = false,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mb-6 cursor-pointer rounded-lg border-2 border-dashed bg-card text-center transition-all ${
        isDragging
          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20"
          : "border-border hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
      } ${compact ? "py-5" : "py-10"}`}
    >
      <span className="mb-3 block text-4xl">{icon}</span>
      <div className="font-medium text-foreground">{title}</div>
      {subtitle && (
        <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

import { cn } from "@/lib/utils";

interface FileWithState {
  id: string;
  file?: File;
  url: string;
  uploading: boolean;
  progress: number;
  fileId?: string;
  isDeleting: boolean;
  error: boolean;
  isRemote: boolean;
}

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  label?: string;
  description?: string;
  className?: string;
}

export function Uploader({
  value = [],
  onChange,
  maxFiles = 5,
  label = "Images",
  description,
  className,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<FileWithState[]>([]);

  const lastFilesJson = useRef<string>("");

  useEffect(() => {
    const currentUrls = files
      .filter((f) => !f.uploading && !f.error && f.url)
      .map((f) => f.url);

    const currentUrlsJson = JSON.stringify(currentUrls);
    const valueJson = JSON.stringify(value);
    const filesJson = JSON.stringify(files);

    const isLocalChange =
      lastFilesJson.current !== "" && lastFilesJson.current !== filesJson;
    lastFilesJson.current = filesJson;

    if (isLocalChange) {
      if (currentUrlsJson !== valueJson) {
        onChange(currentUrls);
      }
    } else if (valueJson !== currentUrlsJson) {
      setFiles(
        value.map((url) => ({
          id: uuidv4(),
          url,
          uploading: false,
          progress: 100,
          isDeleting: false,
          error: false,
          isRemote: true,
        })),
      );
    }
  }, [value, files, onChange]);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload/auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const removeFile = async (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (!fileToRemove) return;

    if (!fileToRemove.isRemote && !fileToRemove.fileId) {
      const updatedFiles = files.filter((f) => f.id !== id);
      setFiles(updatedFiles);
      if (fileToRemove.url.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return;
    }

    if (fileToRemove.fileId) {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isDeleting: true } : f)),
      );

      try {
        const response = await fetch("/api/upload/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: fileToRemove.fileId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete");
        }

        const updatedFiles = files.filter((f) => f.id !== id);
        setFiles(updatedFiles);
        toast.success("Image removed");
      } catch (error) {
        toast.error("Failed to remove image from storage");
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, isDeleting: false } : f)),
        );
      }
    } else {
      const updatedFiles = files.filter((f) => f.id !== id);
      setFiles(updatedFiles);
    }
  };

  const uploadFile = async (id: string, file: File) => {
    try {
      const authParams = await authenticator();
      const { signature, expire, token, publicKey } = authParams;

      const uploadResponse = await upload({
        publicKey,
        signature,
        expire,
        token,
        file,
        fileName: file.name,
        onProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: percent } : f)),
          );
        },
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                progress: 100,
                uploading: false,
                url: uploadResponse.url || f.url,
                fileId: uploadResponse.fileId,
              }
            : f,
        ),
      );

      toast.success("Upload complete");
    } catch (error) {
      let message = "Upload failed";
      if (error instanceof ImageKitAbortError) message = "Upload aborted";
      else if (error instanceof ImageKitInvalidRequestError)
        message = "Invalid request";
      else if (error instanceof ImageKitUploadNetworkError)
        message = "Network error";
      else if (error instanceof ImageKitServerError) message = "Server error";

      toast.error(message);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, uploading: false, error: true } : f,
        ),
      );
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`Max ${maxFiles} images allowed`);
        return;
      }

      const newFiles: FileWithState[] = acceptedFiles.map((file) => ({
        id: uuidv4(),
        file,
        url: URL.createObjectURL(file),
        uploading: true,
        progress: 0,
        isDeleting: false,
        error: false,
        isRemote: false,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((f) => {
        if (f.file) uploadFile(f.id, f.file);
      });
    },
    [files, maxFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles,
    
  });

  return (
    <div className="block space-y-2">
      <label className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-[0.28em] text-black/55">
          {label}
        </span>
        {description ? (
          <span className="text-xs font-medium text-black/40">
            {description}
          </span>
        ) : null}
      </label>
      <div className={cn("space-y-4", className)}>
        <div
          {...getRootProps()}
          className={cn(
            "group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-black bg-white transition-all hover:bg-black/5",
            isDragActive && "border-solid bg-black/10",
            files.length >= maxFiles &&
              "cursor-not-allowed bg-gray-50 text-black/20 hover:bg-gray-50",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <Upload className="h-8 w-8 text-black/40 transition-transform group-hover:-translate-y-1 group-hover:text-black" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                {isDragActive ? "Drop to upload" : "Drag & Drop or Click"}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-black/40">
                Max {maxFiles} images • Up to 10MB each
              </p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative aspect-square border-2 border-black bg-white transition-all hover:bg-gray-50"
              >
                <img
                  src={file.url}
                  alt="Upload preview"
                  className="h-full w-full object-cover"
                />

                {file.uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 p-4 backdrop-blur-[2px]">
                    <Loader2 className="mb-2 h-5 w-5 animate-spin text-black" />
                    <div className="h-1 w-full max-w-[60px] overflow-hidden bg-black/10">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="mt-1 text-[8px] font-black text-black">
                      {file.progress}%
                    </span>
                  </div>
                )}

                {file.error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 text-center p-2">
                    <p className="text-[8px] font-black uppercase tracking-tighter text-red-700">
                      Upload Failed
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  disabled={file.isDeleting}
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center border border-black bg-white text-black transition-colors hover:bg-black hover:text-white"
                >
                  {file.isDeleting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

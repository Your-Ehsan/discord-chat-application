"use client";

import { UploadDropzone } from "@/lib/upload/uploadthing";
import "@uploadthing/react/styles.css";

type FileUploadProps = {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
};

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  return (
    <>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => onChange(res?.[0].fileUrl)}
        onUploadError={(err) => console.log(err)}
        onUploadProgress={(progress) => console.log(progress)}
      />
    </>
  );
};

export default FileUpload;

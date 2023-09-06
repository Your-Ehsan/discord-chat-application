"use client";

import { UploadDropzone } from "@/lib/upload/uploadthing";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { Button } from "./ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { FileIcon } from "lucide-react";

type FileUploadProps = {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
};

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <>
        <div className={"relative h-24 w-24"}>
          <Image
            src={value}
            alt={"uploaded Image"}
            className={"rounded-full"}
            sizes="(max-width: 768px) 150px, (max-width: 1200px) 200, 200px"
            fill
          />
          <Button
            title="Remove Image"
            onClick={() => onChange("")}
            className={
              "bg-rose-400 text-white p-1 rounded-full absolute top-0 right-0 shadow w-6 h-6"
            }
            type="button"
          >
            <Cross1Icon className={"h-4 w-4"} />
          </Button>
        </div>
      </>
    );
  }
  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
        <Button
            title="Remove Image"
            onClick={() => onChange("")}
            className={
              "bg-rose-400 text-white p-1 rounded-full absolute -top-2 -right-2 shadow w-6 h-6"
            }
            type="button"
          >
            <Cross1Icon className={"h-4 w-4"} />
          </Button>
        
      </div>
    );
  }
  return (
    <>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => onChange(res?.[0].url)}
        onUploadError={(err) => console.log(err)}
        onUploadProgress={(progress) => console.log(progress)}
      />
    </>
  );
};

export default FileUpload;

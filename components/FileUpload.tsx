"use client";

import { UploadDropzone } from "@/lib/upload/uploadthing";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { Button } from "./ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";

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

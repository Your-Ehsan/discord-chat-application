import "@/styles/globals.css";
import type { Metadata } from "next";
import { siteConfigs } from "@/constants/siteConfigs";

export const metadata: Metadata = {
  title: siteConfigs.title,
  description: siteConfigs.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex justify-center items-center">{children}</div>
  );
}

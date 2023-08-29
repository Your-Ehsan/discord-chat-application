import "@/styles/globals.css";
import type { Metadata } from "next";
import { font, siteConfigs } from "@/constants/siteConfigs";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute={"class"}
            defaultTheme={"system"}
            storageKey="discord-theme"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

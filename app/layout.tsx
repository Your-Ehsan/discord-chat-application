import "@/styles/globals.css";
import type { Metadata } from "next";
import { font, siteConfigs } from "@/constants/siteConfigs";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import ModalsProvider from "@/components/providers/ModalsProvider";
import SocketProvider from "@/components/providers/SocketProvider";
import QueryProvider from "@/components/providers/QueryProvider";

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
            <SocketProvider>
              <ModalsProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

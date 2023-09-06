import "@/styles/globals.css";
import type { Metadata } from "next";
import { siteConfigs } from "@/constants/siteConfigs";
import SidebarNavigation from "@/components/navigation/sidebar/SidebarNavigation";

export const metadata: Metadata = {
  title: siteConfigs.title,
  description: siteConfigs.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <SidebarNavigation />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </section>
  );
}

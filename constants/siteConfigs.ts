import { Open_Sans } from "next/font/google";

const siteConfigs = {
  title: "Discord Clone",
  description: "This is the discord clone",
  createdBy: "your-ehsan",
};

const font = Open_Sans({ subsets: ["latin", "cyrillic-ext"] });
export { siteConfigs, font };

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkillSpace | Work, Earn, Grow",
  description: "A simple platform for online tasks and freelance opportunities."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}

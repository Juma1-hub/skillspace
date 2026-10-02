import "./globals.css";
import { AppProvider } from "./providers";

export const metadata = {
  title: "SkillSpace — Work. Earn. Grow.",
  description: "A professional online task platform connecting clients with skilled work providers."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body><AppProvider>{children}</AppProvider></body></html>;
}

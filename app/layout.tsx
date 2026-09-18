import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title:"SkillSpace", description:"Connect with clients and earn from available online work." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
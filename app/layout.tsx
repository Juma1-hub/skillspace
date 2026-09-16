import './globals.css';
import Link from 'next/link';
export const metadata={title:'SkillSpace',description:'Connect with clients and earn from online tasks.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><header><Link href="/" className="logo">SKILL<span>SPACE</span></Link><nav><Link href="/tasks">Tasks</Link><Link href="/earnings">Earnings</Link><Link href="/profile">Profile</Link><Link href="/login" className="btn">Log In</Link></nav></header><main>{children}</main><footer>Need help? <Link href="/support">Support</Link></footer></body></html>}

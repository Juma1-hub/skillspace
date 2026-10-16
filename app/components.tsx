 "use client";
import link from "next/link"; import {useEffect,useState} from "react"; import {useApp} from "./providers";

export function Header(){
 const {user}=useApp(); const [open,setOpen]=useState(false);
 return <>
 <header className="topbar"><div className="topLeft"><button className="menuBtn" onClick={()=>setOpen(true)}>☰ Menu</button><Link className="brand" href="/dashboard">Skill<span>Space</span></Link></div><div className="welcome">Welcome back,<strong>{user?.name||"Worker"}</strong></div></header>
 {open&&<><div className="drawerBackdrop" onClick={()=>setOpen(false)}/><aside className="drawer"><div className="drawerHead"><Link className="brand" href="/dashboard" onClick={()=>setOpen(false)}>Skill<span>Space</span></Link><button className="close" onClick={()=>setOpen(false)}>✕</button></div><Wallet/><nav className="nav">
 <Nav href="/dashboard" text="Dashboard"/><Nav href="/profile" text="Profile"/><Nav href="/tasks" text="Tasks"/><Nav href="/tasks?category=Article%20Writing" text="Article Writing"/><Nav href="/tasks?category=Transcription" text="Transcription"/><Nav href="/tasks?category=Data%20Annotation" text="Data Annotation"/><Nav href="/transactions" text="Transactions"/><Nav href="/surveys" text="Surveys"/><Nav href="/earnings" text="Earnings"/><Nav href="/withdraw" text="Withdraw"/><Nav href="/settings" text="Settings"/><Nav href="/support" text="Support"/>{user?.role==="admin"&&<Nav href="/admin" text="Admin Area"/>}
 </nav><button className="secondary back" onClick={()=>setOpen(false)}>← Back</button></aside></>}
 </>
}
function Nav({href,text}:{href:string;text:string}){return <Link href={href}>{text}</Link>}
function Wallet(){const {balance}=useApp();return <div className="wallet"><small>Available balance</small><b>USD {balance.toFixed(2)}</b><span>KSh {(balance*130).toFixed(0)}</span></div>}
export function Guard({children}:{children:React.ReactNode}){const {user}=useApp();const [ready,setReady]=useState(false);useEffect(()=>setReady(true),[]);if(!ready)return <div className="content"><div className="card empty">Loading SkillSpace…</div></div>;if(!user)return <Redirect/>;return <>{children}</>}
function Redirect(){if(typeof window!=="undefined")window.location.replace("/login");return null}
export funtion page ({children}:{children:React.ReactNode}){return <div className="shell"><Header/><main className="content">{children}</main></div>}

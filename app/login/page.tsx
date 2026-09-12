  "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const categories = [
  { name:"Article Writing", icon:"✍️", description:"Write clear, useful articles and content for clients." },
  { name:"Research", icon:"🔎", description:"Find and organize useful information for online projects." },
  { name:"Data Entry", icon:"⌨️", description:"Accurately enter, organize and check information." },
  { name:"AI & Data", icon:"🤖", description:"Help with AI, data review and annotation tasks." },
  { name:"Design", icon:"🎨", description:"Complete simple creative and visual assignments." },
  { name:"Social Media", icon:"📱", description:"Support clients with social content and online tasks." },
  { name:"Transcription", icon:"🎧", description:"Turn audio and video into accurate written text." },
];

export default function Dashboard(){
 const router=useRouter(); const [menuOpen,setMenuOpen]=useState(false); const [loading,setLoading]=useState(true); const [loggedIn,setLoggedIn]=useState(false); const [name,setName]=useState("Worker"); const [email,setEmail]=useState(""); const [submitted,setSubmitted]=useState(0); const [balanceUsd,setBalanceUsd]=useState(0); const [balanceKsh,setBalanceKsh]=useState(0); const [accessUnlocked,setAccessUnlocked]=useState(false);
 const displayName=useMemo(()=>name||email.split("@")[0]||"Worker",[name,email]);
 async function load(){const {data}=await supabase.auth.getUser();const user=data.user;if(!user){router.replace("/login");return}setLoggedIn(true);setEmail(user.email||"");const meta=user.user_metadata||{};const metaName=meta.full_name||meta.name||[meta.first_name,meta.last_name].filter(Boolean).join(" ");if(metaName)setName(metaName);else{const p=await supabase.from("profiles").select("full_name").eq("id",user.id).maybeSingle();if(p.data?.full_name)setName(p.data.full_name)}const profile=await supabase.from("profiles").select("available_balance_usd, available_balance_ksh").eq("id",user.id).maybeSingle();if(profile.data){setBalanceUsd(Number(profile.data.available_balance_usd||0));setBalanceKsh(Number(profile.data.available_balance_ksh||0))}const sub=await supabase.from("task_submissions").select("id",{count:"exact",head:true}).eq("worker_id",user.id);setSubmitted(sub.count||0);const access=await supabase.from("profiles").select("access_unlocked").eq("id",user.id).maybeSingle();setAccessUnlocked(Boolean(access.data?.access_unlocked));setLoading(false)}
 useEffect(()=>{load();const t=setInterval(load,15000);return()=>clearInterval(t)},[]);
 async function logout(){await supabase.auth.signOut();router.replace("/login")}
 if(!loggedIn&&loading)return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#f6f9fe"}}>Loading SkillSpace…</div>;
 return <main className="dashboard">
   {menuOpen&&<div className="menu-overlay" onClick={()=>setMenuOpen(false)} />}
   <aside className={`sidebar ${menuOpen?"sidebar-open":""}`}><h2>SkillSpace</h2><Link onClick={()=>setMenuOpen(false)} className="menu-link" href="/">Dashboard</Link><Link onClick={()=>setMenuOpen(false)} className="menu-link" href="/tasks">Find Tasks</Link><Link onClick={()=>setMenuOpen(false)} className="menu-link" href="/earnings">Earnings</Link><Link onClick={()=>setMenuOpen(false)} className="menu-link" href="/wallet">Wallet</Link><Link onClick={()=>setMenuOpen(false)} className="menu-link" href="/support">Support</Link><Link onClick={()=>setMenuOpen(false)} className="menu-link" href="/profile">My Profile</Link><button onClick={logout} className="menu-link" style={{border:0,background:"transparent",width:"100%",textAlign:"left"}}>Log out</button></aside>
   <header className="topbar"><div className="top-left"><Link className="brand" href="/">SkillSpace</Link><button className="menu-button" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?"Close":"Menu"}</button></div><div style={{display:"flex",alignItems:"center",gap:10}}><span className="welcome">Welcome back, {displayName}</span><div className="avatar">{displayName.trim().charAt(0).toUpperCase()}</div></div></header>
   <section className="dashboard-main"><div className="hero-panel"><h1>Welcome to SkillSpace</h1><p>Find suitable online work, complete tasks and keep track of your progress from one simple dashboard.</p></div>
   <div className="stats"><div className="stat"><div className="stat-label">Available balance</div><div className="stat-value">USD {balanceUsd.toFixed(2)}</div><div style={{color:"#718096",fontSize:13}}>KSh {balanceKsh.toFixed(2)}</div></div><div className="stat"><div className="stat-label">Tasks completed</div><div className="stat-value">{submitted}</div></div><div className="stat"><div className="stat-label">Free tasks left</div><div className="stat-value">{Math.max(0,5-submitted)}</div></div><div className="stat"><div className="stat-label">Access status</div><div className="stat-value" style={{fontSize:20}}>{accessUnlocked?"Active":"Standard"}</div></div></div>
   <div className="categories"><h2>Task categories</h2><div className="category-grid">{categories.map(c=><div className="category" key={c.name}><div><div className="category-icon">{c.icon}</div><h3>{c.name}</h3><p>{c.description}</p></div><Link className="view" href={`/tasks?category=${encodeURIComponent(c.name)}`}>View</Link></div>)}</div></div>
   <div className="footer">SkillSpace · Work · Learn · Earn</div></section>
 </main>
}

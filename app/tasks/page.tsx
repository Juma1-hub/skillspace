"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import SupportContact from "../../components/SupportContact";

type Task={id:string;title:string;description:string;reward_usd:number;reward_ksh:number;category_id:string;category?:{name:string}};

export default function Tasks(){
  const [tasks,setTasks]=useState<Task[]>([]); const [category,setCategory]=useState("All"); const [categories,setCategories]=useState<string[]>(["All"]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  useEffect(()=>{(async()=>{
    const {data:cats,error:ce}=await supabase.from("categories").select("id,name").eq("is_active",true).order("name");
    if(ce){setError(ce.message);setLoading(false);return}
    setCategories(["All",...(cats||[]).map(c=>c.name)]);
    const {data,error:te}=await supabase.from("tasks").select("id,title,description,reward_usd,reward_ksh,category_id,category:categories(name)").eq("is_active",true).order("created_at");
    if(te) setError(te.message); else setTasks((data||[]) as unknown as Task[]); setLoading(false);
  })()},[]);
  const visible=category==="All"?tasks:tasks.filter(t=>t.category?.name===category);
  return <div className="shell"><aside className="sidebar"><div className="brand">Skill<span>Space</span></div><div className="nav-title">Workspace</div><nav className="nav"><Link href="/">🏠 <span>Dashboard</span></Link><Link className="active" href="/tasks">📋 <span>Find Tasks</span></Link><Link href="/earnings">💰 <span>Earnings</span></Link><Link href="/wallet">👛 <span>Wallet</span></Link><Link href="/support">💬 <span>Support</span></Link></nav><div className="sidebar-bottom"><SupportContact /></div></aside><main className="main"><header className="topbar"><div className="crumb">Find Tasks</div><div className="avatar">SS</div></header><div className="content"><section className="hero"><div><div className="eyebrow">Available work</div><h1>Find a task</h1><p>Choose a task that matches your skills and start earning.</p></div></section><div className="card" style={{marginBottom:16}}><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{categories.map(c=><button onClick={()=>setCategory(c)} className={c===category?"btn":"btn secondary"} key={c}>{c}</button>)}</div></div>
    {loading?<div className="card">Loading tasks…</div>:error?<div className="card"><b>Unable to load tasks</b><p style={{color:"#91a3bd",fontSize:12,marginTop:6}}>{error}</p></div>:<div className="task-list">{visible.map(t=><div className="task" key={t.id}><div className="task-main"><div className="task-icon">📋</div><div><h3>{t.title}</h3><p>{t.category?.name} · Beginner friendly</p></div></div><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{textAlign:"right"}}><div className="reward">USD {Number(t.reward_usd).toFixed(2)}</div><div style={{fontSize:11,color:"#91a3bd",marginTop:2}}>KSh {Number(t.reward_ksh).toLocaleString()}</div></div><Link className="btn" href={`/tasks/${t.id}`}>View</Link></div></div>)}</div>}
  </div></main></div>
}

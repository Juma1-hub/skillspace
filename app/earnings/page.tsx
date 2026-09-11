"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function money(value:number){ return value.toFixed(2).replace(/\.00$/,""); }

export default function Earnings(){
  const [loading,setLoading]=useState(true);
  const [totalUsd,setTotalUsd]=useState(0), [totalKsh,setTotalKsh]=useState(0);
  const [weekUsd,setWeekUsd]=useState(0), [weekKsh,setWeekKsh]=useState(0);
  const [approved,setApproved]=useState(0);
  const [pendingUsd,setPendingUsd]=useState(0), [pendingKsh,setPendingKsh]=useState(0);
  const [recent,setRecent]=useState<any[]>([]);
  const [error,setError]=useState("");

  useEffect(()=>{ load(); },[]);

  async function load(){
    setLoading(true); setError("");
    try{
      const {data:{user},error:userError}=await supabase.auth.getUser();
      if(userError) throw userError;
      if(!user) throw new Error("Please log in first.");

      const {data:tx,error:txError}=await supabase
        .from("wallet_transactions")
        .select("id,amount_usd,amount_ksh,type,created_at")
        .eq("worker_id",user.id)
        .eq("type","earning")
        .order("created_at",{ascending:false});
      if(txError) throw txError;
      const rows=tx||[];
      setTotalUsd(rows.reduce((a,r)=>a+Number(r.amount_usd||0),0));
      setTotalKsh(rows.reduce((a,r)=>a+Number(r.amount_ksh||0),0));
      const startOfWeek=new Date(); startOfWeek.setHours(0,0,0,0); startOfWeek.setDate(startOfWeek.getDate()-((startOfWeek.getDay()+6)%7));
      const week=rows.filter(r=>new Date(r.created_at)>=startOfWeek);
      setWeekUsd(week.reduce((a,r)=>a+Number(r.amount_usd||0),0));
      setWeekKsh(week.reduce((a,r)=>a+Number(r.amount_ksh||0),0));

      const {data:subs,error:subsError}=await supabase
        .from("task_submissions")
        .select("id,reward_usd,reward_ksh,created_at,status,task_id,tasks(title)")
        .eq("worker_id",user.id)
        .order("created_at",{ascending:false});
      if(subsError) throw subsError;
      const submissions=subs||[];
      setApproved(submissions.filter(r=>r.status==="approved").length);
      const pending=submissions.filter(r=>r.status==="pending");
      setPendingUsd(pending.reduce((a,r)=>a+Number(r.reward_usd||0),0));
      setPendingKsh(pending.reduce((a,r)=>a+Number(r.reward_ksh||0),0));
      setRecent(rows.slice(0,10));
    }catch(e){ setError(e instanceof Error?e.message:"Unable to load earnings."); }
    setLoading(false);
  }

  return <div className="shell"><aside className="sidebar"><div className="brand">Skill<span>Space</span></div><nav className="nav"><Link href="/">🏠 <span>Dashboard</span></Link><Link href="/tasks">📋 <span>Find Tasks</span></Link><Link className="active" href="/earnings">💰 <span>Earnings</span></Link><Link href="/wallet">👛 <span>Wallet</span></Link><Link href="/support">💬 <span>Support</span></Link></nav></aside><main className="main"><header className="topbar"><div className="crumb">Earnings</div><div className="avatar">SS</div></header><div className="content"><div className="hero"><div><div className="eyebrow">Your progress</div><h1>Earnings</h1><p>Track what you earn as you complete approved tasks.</p></div></div>{error&&<div className="notice" style={{marginBottom:16,color:"#ff8797"}}>{error}</div>}<div className="grid4"><div className="card"><div className="metric-label">Total earned</div><div className="metric">{loading?"…":`USD ${money(totalUsd)}`}</div><div style={{fontSize:13,color:"#91a3bd",marginTop:2}}>{loading?"":`KSh ${totalKsh.toLocaleString()}`}</div></div><div className="card"><div className="metric-label">This week</div><div className="metric">{loading?"…":`USD ${money(weekUsd)}`}</div><div style={{fontSize:13,color:"#91a3bd",marginTop:2}}>{loading?"":`KSh ${weekKsh.toLocaleString()}`}</div></div><div className="card"><div className="metric-label">Approved tasks</div><div className="metric">{loading?"…":approved}</div><div className="trend">Approved and credited</div></div><div className="card"><div className="metric-label">Pending</div><div className="metric">{loading?"…":`USD ${money(pendingUsd)}`}</div><div style={{fontSize:13,color:"#91a3bd",marginTop:2}}>{loading?"":`KSh ${pendingKsh.toLocaleString()}`}</div></div></div><div className="section card"><div className="section-head"><h2>Recent earnings</h2><span className="badge pending">{recent.length?`${recent.length} recent`:"No activity yet"}</span></div>{recent.length?<div className="task-list">{recent.map(r=><div className="task" key={r.id}><div><h3>Task earning</h3><p>{new Date(r.created_at).toLocaleString()}</p></div><strong>+USD {money(Number(r.amount_usd||0))}<br/><span style={{fontSize:12,color:"#91a3bd",fontWeight:500}}>KSh {Number(r.amount_ksh||0).toLocaleString()}</span></strong></div>)}</div>:<p style={{fontSize:12,color:"#91a3bd"}}>Your completed and approved task earnings will appear here.</p>}</div></div></main></div>
}

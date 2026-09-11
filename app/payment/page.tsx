"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PaymentPage(){
  const [unlocked,setUnlocked]=useState(false);
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser(); if(!user)return; const {data}=await supabase.from("profiles").select("access_unlocked").eq("id",user.id).single(); setUnlocked(Boolean(data?.access_unlocked));})();},[]);
  return <div className="shell"><aside className="sidebar"><div className="brand">Skill<span>Space</span></div><div className="nav-title">Workspace</div><nav className="nav"><Link href="/">🏠 <span>Dashboard</span></Link><Link className="active" href="/tasks">📋 <span>Find Tasks</span></Link><Link href="/earnings">💰 <span>Earnings</span></Link><Link href="/wallet">👛 <span>Wallet</span></Link><Link href="/support">💬 <span>Support</span></Link></nav></aside><main className="main"><header className="topbar"><div className="crumb">Unlock More Tasks</div><div className="avatar">SS</div></header><div className="content"><div className="card" style={{maxWidth:700}}><div className="eyebrow">More opportunities</div><h1 style={{fontSize:30,margin:"7px 0 8px"}}>Unlock more tasks</h1><p style={{color:"#91a3bd",fontSize:14,lineHeight:1.7}}>Your first 5 tasks are free. After that, a one-time platform access fee applies to continue accessing available work.</p><div style={{marginTop:20,fontSize:24,fontWeight:800}}>USD 2 <span style={{fontSize:14,color:"#91a3bd",fontWeight:500}}> / KSh 260</span></div>{unlocked ? <div style={{marginTop:18}}><div className="trend">Your access is active.</div><Link className="btn secondary" href="/tasks" style={{display:"inline-block",marginTop:14}}>Browse tasks</Link></div> : <div style={{marginTop:18}}><button className="btn" disabled style={{opacity:.65}}>Pay USD 2 / KSh 260</button><p style={{fontSize:12,color:"#91a3bd",marginTop:10}}>Payment processing will open here when the payment connection is enabled.</p></div>}<div style={{marginTop:18}}><Link href="/" style={{color:"#80aaff",fontSize:12}}>← Back to Dashboard</Link></div></div></div></main></div>;
}

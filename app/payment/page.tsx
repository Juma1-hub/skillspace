"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PaymentPage(){
  const [unlocked,setUnlocked]=useState(false);
  const [showMpesa,setShowMpesa]=useState(false);
  const [phone,setPhone]=useState("");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return;
    const {data}=await supabase.from("profiles").select("access_unlocked").eq("id",user.id).single();
    setUnlocked(Boolean(data?.access_unlocked));
  })();},[]);

  function openPayment(){
    setMessage("");
    setError("");
    setShowMpesa(true);
  }

  function continuePayment(){
    setMessage("");
    setError("");
    const normalized=phone.trim().replace(/\s+/g,"");
    if(!/^0?7\d{8}$/.test(normalized) && !/^2547\d{8}$/.test(normalized)){
      setError("Enter a valid Kenyan M-PESA number, for example 0712345678 or 254712345678.");
      return;
    }
    setMessage("M-PESA number saved. The secure IntaSend payment step will use this number.");
  }

  return <div className="shell"><aside className="sidebar"><div className="brand">Skill<span>Space</span></div><div className="nav-title">Workspace</div><nav className="nav"><Link href="/">🏠 <span>Dashboard</span></Link><Link className="active" href="/tasks">📋 <span>Find Tasks</span></Link><Link href="/earnings">💰 <span>Earnings</span></Link><Link href="/wallet">👛 <span>Wallet</span></Link><Link href="/support">💬 <span>Support</span></Link></nav></aside><main className="main"><header className="topbar"><div className="crumb">Unlock More Tasks</div><div className="avatar">SS</div></header><div className="content"><div className="card" style={{maxWidth:700}}><div className="eyebrow">More opportunities</div><h1 style={{fontSize:30,margin:"7px 0 8px"}}>Unlock more tasks</h1><p style={{color:"#91a3bd",fontSize:14,lineHeight:1.7}}>Your first 5 tasks are free. After that, a one-time platform access fee applies to continue accessing available work.</p><div style={{marginTop:20,fontSize:24,fontWeight:800}}>USD 2 <span style={{fontSize:14,color:"#91a3bd",fontWeight:500}}> / KSh 260</span></div>{unlocked ? <div style={{marginTop:18}}><div className="trend">Your access is active.</div><Link className="btn secondary" href="/tasks" style={{display:"inline-block",marginTop:14}}>Browse tasks</Link></div> : <div style={{marginTop:18}}>{!showMpesa ? <button className="btn" onClick={openPayment}>Pay USD 2 / KSh 260</button> : <div className="card" style={{background:"rgba(255,255,255,.02)",padding:18,marginTop:8}}><h2 style={{marginTop:0,fontSize:18}}>Pay with M-PESA</h2><p style={{fontSize:13,color:"#91a3bd",lineHeight:1.6}}>Enter the M-PESA number you want to use for the USD 2 / KSh 260 platform access fee.</p><div className="field" style={{marginTop:14}}><label>M-PESA phone number</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0712345678" inputMode="tel" autoComplete="tel" /></div>{error&&<div className="notice" style={{marginTop:12,color:"#ff8797"}}>{error}</div>}{message&&<div className="notice" style={{marginTop:12,color:"#62e39e"}}>{message}</div>}<div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}><button className="btn" onClick={continuePayment}>Continue with M-PESA</button><button className="btn secondary" onClick={()=>{setShowMpesa(false);setError("");setMessage("")}}>Back</button></div></div>}</div>}<div style={{marginTop:18}}><Link href="/" style={{color:"#80aaff",fontSize:12}}>← Back to Dashboard</Link></div></div></div></main></div>;
}

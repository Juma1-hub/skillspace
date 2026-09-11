"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Wallet(){
  const [balanceUsd,setBalanceUsd]=useState(0);
  const [balanceKsh,setBalanceKsh]=useState(0);
  const [minUsd,setMinUsd]=useState(100);
  const [minKsh,setMinKsh]=useState(13000);
  const [phone,setPhone]=useState("");
  const [amount,setAmount]=useState("");
  const [showForm,setShowForm]=useState(false);
  const [loading,setLoading]=useState(true);
  const [submitting,setSubmitting]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  useEffect(()=>{loadWallet();},[]);

  async function loadWallet(){
    setLoading(true);setError("");
    try{
      const {data:{user},error:userError}=await supabase.auth.getUser();
      if(userError) throw userError;
      if(!user) throw new Error("Please log in first.");
      const [{data:profile,error:profileError},{data:settings,error:settingsError}]=await Promise.all([
        supabase.from("profiles").select("available_balance_usd,available_balance_ksh,phone").eq("id",user.id).maybeSingle(),
        supabase.from("settings").select("minimum_withdrawal_usd,minimum_withdrawal_ksh").limit(1).maybeSingle()
      ]);
      if(profileError) throw profileError;
      if(settingsError) throw settingsError;
      setBalanceUsd(Number(profile?.available_balance_usd||0));
      setBalanceKsh(Number(profile?.available_balance_ksh||0));
      setPhone(profile?.phone||"");
      if(settings){setMinUsd(Number(settings.minimum_withdrawal_usd||100));setMinKsh(Number(settings.minimum_withdrawal_ksh||13000));}
    }catch(e){setError(e instanceof Error?e.message:"Unable to load your wallet.");}
    setLoading(false);
  }

  function openWithdrawal(){
    setMessage("");setError("");setAmount("");setShowForm(true);
  }

  async function requestWithdrawal(){
    setSubmitting(true);setMessage("");setError("");
    try{
      const {data:{user},error:userError}=await supabase.auth.getUser();
      if(userError) throw userError;
      if(!user) throw new Error("Please log in first.");
      const requested=Number(amount);
      if(!Number.isFinite(requested)||requested<=0) throw new Error("Enter a valid withdrawal amount.");
      if(requested<minUsd) throw new Error(`The minimum withdrawal is USD ${minUsd.toFixed(2)} / KSh ${minKsh.toLocaleString()}.`);
      if(requested>balanceUsd) throw new Error("Your available balance is not enough for this withdrawal.");
      if(!phone.trim()) throw new Error("Please add your M-PESA phone number in My Profile first.");

      const amountKsh=balanceUsd>0 ? Math.round((requested/balanceUsd)*balanceKsh) : 0;
      const {error:insertError}=await supabase.from("withdrawal_requests").insert({worker_id:user.id,amount_usd:requested,amount_ksh:amountKsh,method:"M-PESA",phone:phone.trim(),status:"pending"});
      if(insertError) throw insertError;
      setMessage("Withdrawal request submitted successfully.");
      setShowForm(false);
    }catch(e){setError(e instanceof Error?e.message:"Unable to submit withdrawal request.");}
    setSubmitting(false);
  }

  return <Page title="Wallet" eyebrow="Your money"><div className="grid4"><div className="card"><div className="metric-label">Current balance</div><div className="metric">USD {balanceUsd.toFixed(2).replace(/\.00$/,'')}</div><div style={{fontSize:13,color:"#91a3bd",marginTop:2}}>KSh {balanceKsh.toLocaleString()}</div></div><div className="card"><div className="metric-label">Minimum withdrawal</div><div className="metric">USD {minUsd.toFixed(2).replace(/\.00$/,'')}</div><div style={{fontSize:13,color:"#91a3bd",marginTop:2}}>KSh {minKsh.toLocaleString()}</div><div className="trend">Minimum withdrawal</div></div></div><div className="section card"><div className="section-head"><h2>Withdraw your earnings</h2></div><p style={{color:"#91a3bd",fontSize:13,lineHeight:1.6,marginBottom:18}}>Request a withdrawal when your available balance reaches the minimum withdrawal amount.</p>{error&&<div className="notice" style={{marginBottom:16,color:"#ff8797"}}>{error}</div>}{message&&<div className="notice" style={{marginBottom:16,color:"#62e39e"}}>{message}</div>}{!showForm?<button className="btn secondary" onClick={openWithdrawal}>Request withdrawal</button>:<div className="form-grid"><div className="field"><label>Amount (USD)</label><input type="number" min={minUsd} step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder={`Minimum ${minUsd}`}/></div><div className="field"><label>M-PESA phone</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XXXXXXXX"/></div><div className="field full" style={{display:"flex",gap:10,alignItems:"center"}}><button className="btn" onClick={requestWithdrawal} disabled={submitting}>{submitting?"Submitting…":"Submit withdrawal request"}</button><button className="btn secondary" onClick={()=>setShowForm(false)} disabled={submitting}>Cancel</button></div></div>}</div></Page>
}
function Page({title,eyebrow,children}:{title:string,eyebrow:string,children:React.ReactNode}){return <div className="shell"><aside className="sidebar"><div className="brand">Skill<span>Space</span></div><nav className="nav"><Link href="/">🏠 <span>Dashboard</span></Link><Link href="/tasks">📋 <span>Find Tasks</span></Link><Link href="/earnings">💰 <span>Earnings</span></Link><Link className="active" href="/wallet">👛 <span>Wallet</span></Link><Link href="/support">💬 <span>Support</span></Link></nav></aside><main className="main"><header className="topbar"><div className="crumb">{title}</div><div className="avatar">SS</div></header><div className="content"><div className="hero"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1></div></div>{children}</div></main></div>}

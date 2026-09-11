"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Profile(){
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [editing,setEditing]=useState(true);

  useEffect(()=>{ loadProfile(); },[]);

  async function loadProfile(){
    setLoading(true); setError("");
    try{
      const {data:{user},error:userError}=await supabase.auth.getUser();
      if(userError) throw userError;
      if(!user) throw new Error("Please log in first.");
      setEmail(user.email||"");
      const {data:profile,error:profileError}=await supabase.from("profiles").select("full_name,phone").eq("id",user.id).maybeSingle();
      if(profileError) throw profileError;
      const parts=(profile?.full_name||"").trim().split(/\s+/).filter(Boolean);
      setFirstName(parts[0]||"");
      setLastName(parts.slice(1).join(" "));
      setPhone(profile?.phone||"");
      setEditing(false);
    }catch(e){setError(e instanceof Error?e.message:"Unable to load your profile.");}
    setLoading(false);
  }

  async function saveProfile(){
    setSaving(true); setMessage(""); setError("");
    try{
      const {data:{user},error:userError}=await supabase.auth.getUser();
      if(userError) throw userError;
      if(!user) throw new Error("Please log in first.");
      const fullName=[firstName.trim(),lastName.trim()].filter(Boolean).join(" ");
      if(!firstName.trim()) throw new Error("Please enter your first name.");
      const {error:profileError}=await supabase.from("profiles").update({full_name:fullName,phone:phone.trim()}).eq("id",user.id);
      if(profileError) throw profileError;

      const currentEmail=(user.email||"").trim().toLowerCase();
      const newEmail=email.trim().toLowerCase();
      if(newEmail && newEmail!==currentEmail){
        const {error:emailError}=await supabase.auth.updateUser({email:newEmail});
        if(emailError) throw emailError;
      }
      setMessage("Profile saved successfully.");
      setEditing(false);
    }catch(e){setError(e instanceof Error?e.message:"Unable to save your profile.");}
    setSaving(false);
  }

  return <div className="shell"><aside className="sidebar"><div className="brand">Skill<span>Space</span></div><nav className="nav"><Link href="/">🏠 <span>Dashboard</span></Link><Link href="/tasks">📋 <span>Find Tasks</span></Link><Link href="/earnings">💰 <span>Earnings</span></Link><Link href="/wallet">👛 <span>Wallet</span></Link><Link href="/support">💬 <span>Support</span></Link></nav></aside><main className="main"><header className="topbar"><div className="crumb">My Profile</div><div className="avatar">SS</div></header><div className="content"><div className="card page-card"><div className="eyebrow">Account</div><h1 style={{fontSize:30,margin:"7px 0 18px"}}>My Profile</h1>{loading?<p style={{color:"#91a3bd"}}>Loading your profile…</p>:<>{!editing ? <><div className="notice" style={{marginBottom:16,color:"#62e39e"}}>{message || "Your profile details are saved."}</div><div className="form-grid"><div className="field"><label>First name</label><div className="input-like">{firstName || "Not set"}</div></div><div className="field"><label>Last name</label><div className="input-like">{lastName || "Not set"}</div></div><div className="field full"><label>Email</label><div className="input-like">{email || "Not set"}</div></div><div className="field full"><label>WhatsApp / phone</label><div className="input-like">{phone || "Not set"}</div></div></div><button className="btn secondary" style={{marginTop:18}} onClick={()=>setEditing(true)}>Edit profile</button></> : <><div className="form-grid"><div className="field"><label>First name</label><input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Your first name"/></div><div className="field"><label>Last name</label><input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Your last name"/></div><div className="field full"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address"/></div><div className="field full"><label>WhatsApp / phone</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Your WhatsApp / phone number"/></div></div>{error&&<div className="notice" style={{marginTop:16,color:"#ff8797"}}>{error}</div>}{message&&<div className="notice" style={{marginTop:16,color:"#62e39e"}}>{message}</div>}<button className="btn" style={{marginTop:18}} onClick={saveProfile} disabled={saving}>{saving?"Saving…":"Save profile"}</button></>}</>}</div></div></main></div>
}

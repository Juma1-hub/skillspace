"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{ if(data.user) router.replace("/"); });
  },[router]);

  async function submit(e:FormEvent){
    e.preventDefault(); setLoading(true); setMessage("");
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error) setMessage(error.message);
    else router.push("/");
    setLoading(false);
  }

  return <div className="content" style={{paddingTop:70}}><div className="card page-card">
    <div className="brand" style={{paddingLeft:0}}>Skill<span>Space</span></div>
    <div className="eyebrow">Welcome back</div><h1 style={{fontSize:30,margin:"8px 0 7px"}}>Log in</h1>
    <p style={{color:"#91a3bd",fontSize:13,marginBottom:20}}>Access your tasks, earnings and wallet.</p>
    <form onSubmit={submit}><div className="form-grid">
      <div className="field full"><label>Email</label><input required value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com"/></div>
      <div className="field full"><label>Password</label><input required value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••"/></div>
    </div>
    {message && <p style={{color:"#d96c6c",fontSize:12,marginTop:12}}>{message}</p>}
    <button className="btn" disabled={loading} style={{marginTop:18,width:"100%"}}>{loading?"Logging in…":"Log in"}</button></form>
    <p style={{fontSize:12,color:"#91a3bd",textAlign:"center",marginTop:15}}>New to SkillSpace? <Link href="/signup" style={{color:"#80aaff"}}>Create an account</Link></p>
  </div></div>
}

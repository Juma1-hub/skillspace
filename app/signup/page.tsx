"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Signup(){
  const router=useRouter();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState(""); const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false); const [message,setMessage]=useState("");
  async function submit(e:FormEvent){
    e.preventDefault(); setLoading(true); setMessage("");
    const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name,phone}}});
    if(error) setMessage(error.message);
    else if(data.session) router.push("/");
    else setMessage("Account created. Check your email if confirmation is required, then log in.");
    setLoading(false);
  }
  return <div className="content" style={{paddingTop:45}}><div className="card page-card">
    <div className="brand" style={{paddingLeft:0}}>Skill<span>Space</span></div><div className="eyebrow">Get started</div>
    <h1 style={{fontSize:30,margin:"8px 0 7px"}}>Create your account</h1><p style={{color:"#91a3bd",fontSize:13,marginBottom:20}}>Join SkillSpace and start earning.</p>
    <form onSubmit={submit}><div className="form-grid">
      <div className="field full"><label>Full Name</label><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/></div>
      <div className="field full"><label>Email</label><input required value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com"/></div>
      <div className="field full"><label>Phone Number</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07xxxxxxxx"/></div>
      <div className="field full"><label>Password</label><input required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="At least 6 characters"/></div>
    </div>
    {message && <p style={{color:"#91a3bd",fontSize:12,marginTop:12}}>{message}</p>}
    <button className="btn" disabled={loading} style={{marginTop:18,width:"100%"}}>{loading?"Creating account…":"Sign up"}</button></form>
    <p style={{fontSize:12,color:"#91a3bd",textAlign:"center",marginTop:15}}>Already have an account? <Link href="/login" style={{color:"#80aaff"}}>Log in</Link></p>
  </div></div>
}

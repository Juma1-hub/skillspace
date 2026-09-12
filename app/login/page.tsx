 "use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const router=useRouter();
 useEffect(()=>{supabase.auth.getUser().then(({data})=>{if(data.user) router.replace("/")})},[router]);
 async function submit(e:FormEvent){e.preventDefault();setError("");setLoading(true);const {error}=await supabase.auth.signInWithPassword({email,password});setLoading(false);if(error){setError(error.message);return}router.replace("/");}
 return <main className="auth-wrap"><div className="auth-card"><Link className="brand" href="/">SkillSpace</Link><h1>Welcome back</h1><p>Log in to access your SkillSpace dashboard and available work. SkillSpace connects clients with people who can provide online services and complete tasks.</p>{error&&<div className="error">{error}</div>}<form onSubmit={submit}><div className="field"><label>Email address</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div><div className="field"><label>Password</label><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div><button disabled={loading} className="btn btn-primary auth-submit">{loading?"Logging in…":"Log in"}</button></form><p style={{marginTop:20}}>Don't have an account? <Link className="small-link" href="/signup">Create one</Link></p><Link href="/" className="small-link">← Back to SkillSpace</Link></div></main>
}

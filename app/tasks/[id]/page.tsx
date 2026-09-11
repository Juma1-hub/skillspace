"use client";

import Link from "next/link";
import SupportContact from "../../../components/SupportContact";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Task = {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  reward_usd: number;
  reward_ksh: number;
  category?: { name: string } | null;
};

export default function TaskDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [submission, setSubmission] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [accessUnlocked, setAccessUnlocked] = useState(false);
  const [freeTasksUsed, setFreeTasksUsed] = useState(0);
  const [accessLoading, setAccessLoading] = useState(true);

  useEffect(() => {
    async function loadTask() {
      if (!params.id) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const [{ data: profile }, { count: submissionCount }] = await Promise.all([
        supabase.from("profiles").select("access_unlocked").eq("id", user.id).single(),
        supabase.from("task_submissions").select("id", { count: "exact", head: true }).eq("worker_id", user.id),
      ]);
      const unlocked = Boolean(profile?.access_unlocked);
      const freeUsed = Math.min(5, Number(submissionCount || 0));
      setAccessUnlocked(unlocked);
      setFreeTasksUsed(freeUsed);
      if (!unlocked && freeUsed >= 5) { setAccessLoading(false); setLoading(false); return; }
      const { data, error: taskError } = await supabase
        .from("tasks")
        .select("id,title,description,instructions,reward_usd,reward_ksh,category:categories(name)")
        .eq("id", params.id)
        .eq("is_active", true)
        .single();

      if (taskError) setError(taskError.message);
      else setTask(data as unknown as Task);
      setLoading(false);
      setAccessLoading(false);
    }
    loadTask();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!submission.trim()) {
      setError("Please enter your completed work before submitting.");
      return;
    }

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error: submitError } = await supabase.from("task_submissions").insert({
      task_id: task?.id,
      worker_id: user.id,
      submission_text: submission.trim(),
      status: "pending",
      reward_usd: task?.reward_usd,
      reward_ksh: task?.reward_ksh,
    });

    if (submitError) setError(submitError.message);
    else {
      setMessage("Your task has been submitted successfully. It will be approved automatically after 5 minutes.");
      setSubmission("");
    }
    setSubmitting(false);
  }

  if (!loading && !accessLoading && !accessUnlocked && freeTasksUsed >= 5) {
    return <div className="shell"><aside className="sidebar"><div className="brand">Skill<span>Space</span></div><div className="nav-title">Workspace</div><nav className="nav"><Link href="/">🏠 <span>Dashboard</span></Link><Link className="active" href="/tasks">📋 <span>Find Tasks</span></Link><Link href="/earnings">💰 <span>Earnings</span></Link><Link href="/wallet">👛 <span>Wallet</span></Link><Link href="/support">💬 <span>Support</span></Link></nav><div className="sidebar-bottom"><SupportContact /></div></aside><main className="main"><header className="topbar"><div className="crumb">Task Access</div><div className="avatar">SS</div></header><div className="content"><div className="card"><div className="eyebrow">Unlock more work</div><h1 style={{fontSize:30,margin:"7px 0 8px"}}>Your 5 free tasks are complete</h1><p style={{color:"#91a3bd",fontSize:14,lineHeight:1.7}}>Continue accessing available tasks by unlocking your account.</p><div style={{marginTop:20,fontSize:20,fontWeight:800}}>USD 2 <span style={{fontSize:14,color:"#91a3bd",fontWeight:500}}> / KSh 260</span></div><Link className="btn" href="/payment" style={{display:"inline-block",marginTop:18}}>Continue to payment</Link></div></div></main></div>;
  }

  if (loading) return <div className="shell"><main className="main"><div className="content"><div className="card">Loading task…</div></div></main></div>;

  if (error && !task) return <div className="shell"><main className="main"><div className="content"><div className="card"><b>Unable to load task</b><p style={{color:"#91a3bd",fontSize:12,marginTop:6}}>{error}</p><Link className="btn" href="/tasks" style={{display:"inline-block",marginTop:16}}>Back to Tasks</Link></div></div></main></div>;

  if (!task) return null;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Skill<span>Space</span></div>
        <div className="nav-title">Workspace</div>
        <nav className="nav">
          <Link href="/">🏠 <span>Dashboard</span></Link>
          <Link className="active" href="/tasks">📋 <span>Find Tasks</span></Link>
          <Link href="/earnings">💰 <span>Earnings</span></Link>
          <Link href="/wallet">👛 <span>Wallet</span></Link>
          <Link href="/support">💬 <span>Support</span></Link>
        </nav>
        <div className="sidebar-bottom"><SupportContact /></div>
      </aside>

      <main className="main">
        <header className="topbar"><div className="crumb">Task Details</div><div className="avatar">SS</div></header>
        <div className="content">
          <div className="page-card">
            <Link href="/tasks" style={{display:"inline-block",color:"#80aaff",fontSize:12,marginBottom:16}}>← Back to Tasks</Link>
            <section className="card">
              <div className="eyebrow">{task.category?.name || "Task"}</div>
              <h1 style={{fontSize:30,margin:"7px 0 8px"}}>{task.title}</h1>
              <p style={{color:"#91a3bd",fontSize:14,lineHeight:1.7}}>{task.description}</p>

              <div style={{display:"flex",gap:28,flexWrap:"wrap",margin:"22px 0",padding:"16px 0",borderTop:"1px solid #203653",borderBottom:"1px solid #203653"}}>
                <div><div className="metric-label">Reward</div><div className="reward" style={{fontSize:18,marginTop:5}}>USD {Number(task.reward_usd).toFixed(2)}</div></div>
                <div><div className="metric-label">Kenyan Shillings</div><div style={{fontWeight:900,fontSize:18,marginTop:5}}>KSh {Number(task.reward_ksh).toLocaleString()}</div></div>
              </div>

              <h2 style={{fontSize:17,marginBottom:8}}>Instructions</h2>
              <div className="notice" style={{whiteSpace:"pre-wrap"}}>{task.instructions || "Complete the task carefully and submit your finished work below."}</div>

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="submission">Your completed work</label>
                  <textarea id="submission" value={submission} onChange={e=>setSubmission(e.target.value)} placeholder="Enter your completed work or response here…" />
                </div>
                {error && <p style={{color:"#ff8797",fontSize:12,marginTop:10}}>{error}</p>}
                {message && <p style={{color:"#62e39e",fontSize:12,marginTop:10}}>{message}</p>}
                <button className="btn" type="submit" disabled={submitting} style={{marginTop:14,opacity:submitting?.65:1}}>{submitting ? "Submitting…" : "Submit Task"}</button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

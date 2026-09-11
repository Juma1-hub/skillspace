"use client";

import Link from "next/link";
import SupportContact from "../components/SupportContact";
import SupportEmail from "../components/SupportEmail";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const dashboardCategories = [
  ["📝", "Writing", "10 available tasks"],
  ["🔎", "Research", "10 available tasks"],
  ["📊", "Data Entry", "10 available tasks"],
  ["🤖", "AI & Data", "10 available tasks"],
  ["🎨", "Design", "10 available tasks"],
  ["📣", "Social Media", "10 available tasks"],
];

export default function Home() {
  const [submittedCount, setSubmittedCount] = useState(0);
  const [freeTasksUsed, setFreeTasksUsed] = useState(0);
  const [accessUnlocked, setAccessUnlocked] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [balanceUsd, setBalanceUsd] = useState(0);
  const [balanceKsh, setBalanceKsh] = useState(0);

  useEffect(() => {
    async function loadWorkerStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoadingStats(false);
        return;
      }

      const [{ count }, { data: profile }] = await Promise.all([
        supabase
          .from("task_submissions")
          .select("id", { count: "exact", head: true })
          .eq("worker_id", user.id),
        supabase
          .from("profiles")
          .select("access_unlocked, available_balance_usd, available_balance_ksh")
          .eq("id", user.id)
          .single(),
      ]);

      const submitted = Number(count || 0);
      setSubmittedCount(submitted);
      // The submission table is the source of truth. A stale profile value
      // must never make a brand-new worker appear to have used all 5 free tasks.
      setFreeTasksUsed(Math.min(5, submitted));
      setAccessUnlocked(Boolean(profile?.access_unlocked));
      setBalanceUsd(Number(profile?.available_balance_usd || 0));
      setBalanceKsh(Number(profile?.available_balance_ksh || 0));
      setLoadingStats(false);
    }
    loadWorkerStats();
  }, []);

  const freeTasksLeft = accessUnlocked ? 0 : Math.max(0, 5 - freeTasksUsed);

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">Skill<span>Space</span></div>
      <div className="nav-title">Workspace</div>
      <nav className="nav">
        <Link className="active" href="/">🏠 <span>Dashboard</span></Link>
        <Link href="/tasks">📋 <span>Find Tasks</span></Link>
        <Link href="/earnings">💰 <span>Earnings</span></Link>
        <Link href="/wallet">👛 <span>Wallet</span></Link>
        <Link href="/support">💬 <span>Support</span></Link>
      </nav>
      <div className="nav-title">Account</div>
      <nav className="nav">
        <Link href="/profile">👤 <span>My Profile</span></Link>
        <Link href="/login">🚪 <span>Log in</span></Link>
      </nav>
      <div className="sidebar-bottom"><SupportContact /></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Worker Dashboard</div><div className="user"><span style={{fontSize:12,color:"#91a3bd"}}>Welcome back</span><div className="avatar">SS</div></div></header>
      <div className="content">
        <section className="hero"><div><div className="eyebrow">Work · Learn · Earn</div><h1>Welcome to SkillSpace</h1><p>Complete simple tasks, build experience and earn from your skills.</p></div><Link className="btn" href="/tasks">Find a task →</Link></section>
        <div className="grid4">
          <div className="card"><div className="metric-label">Available balance</div><div className="metric">{loadingStats ? "…" : `USD ${balanceUsd.toFixed(2).replace(/\.00$/, "")}`}</div><div style={{fontSize:13,color:"#91a3bd",marginTop:2}}>{loadingStats ? "" : `KSh ${balanceKsh.toLocaleString()}`}</div><div className="trend">Ready to grow</div></div>
          <div className="card"><div className="metric-label">Tasks completed</div><div className="metric">{loadingStats ? "…" : submittedCount}</div><div className="trend">{submittedCount > 0 ? "Submitted for review" : "Start your first task"}</div></div>
          <div className="card"><div className="metric-label">Free tasks left</div><div className="metric">{loadingStats ? "…" : freeTasksLeft}</div><div className="trend">New worker benefit</div></div>
          <div className="card"><div className="metric-label">Access status</div><div className="metric">{accessUnlocked ? "Unlocked" : freeTasksLeft > 0 ? "Free" : "Payment required"}</div><div className="trend">{accessUnlocked ? "Full task access" : freeTasksLeft > 0 ? `${freeTasksLeft} free tasks available` : "USD 2 / KSh 260 to continue"}</div></div>
        </div>
        <div className="section two">
          <div className="card"><div className="section-head"><h2>Browse task categories</h2><Link href="/tasks">View all</Link></div><div className="task-list">{dashboardCategories.map((c,i)=><div className="task" key={i}><div className="task-main"><div className="task-icon">{c[0]}</div><div><h3>{c[1]}</h3><p>{c[2]} · Beginner friendly</p></div></div><Link className="btn" href={`/tasks?category=${encodeURIComponent(c[1])}`}>View</Link></div>)}</div></div>
          <div className="card"><div className="section-head"><h2>Your free tasks</h2></div><p style={{fontSize:12,color:"#91a3bd"}}>Complete 5 free tasks before the platform access fee applies.</p><div className="progress"><span style={{width:`${Math.min(100, (freeTasksUsed / 5) * 100)}%`}}/></div><div className="info-row"><span>Completed</span><strong>{freeTasksUsed} / 5</strong></div><div className="info-row"><span>After free tasks</span><strong>USD 2 / KSh 260</strong></div><div style={{marginTop:18}}>{freeTasksLeft > 0 || accessUnlocked ? <Link className="btn secondary" href="/tasks">Start earning</Link> : <Link className="btn" href="/payment">Unlock more tasks</Link>}</div></div>
        </div>
        <div className="section"><div className="section-head"><h2>Task categories</h2><Link href="/tasks">Browse all</Link></div><div className="cat-grid">
          {dashboardCategories.map((c,i)=><Link href={`/tasks?category=${encodeURIComponent(c[1])}`} className="card cat" key={i}><div className="emoji">{c[0]}</div><h3>{c[1]}</h3><p>Beginner-friendly opportunities to build skills and earn.</p><div className="count">{c[2]}</div></Link>)}
        </div></div>
        <div className="footer">© 2026 <b>SkillSpace</b> · Work · Learn · Earn · <SupportEmail /></div>
      </div>
    </main>
  </div>;
}

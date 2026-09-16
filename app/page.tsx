'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categories, starterTasks, FREE_TASKS, BATCH_SIZE, money as _money } from '../lib/data';
import { money } from './components/AppShell';

export default function Dashboard() {
  const [name, setName] = useState('Worker');
  const [balance, setBalance] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [unlocked, setUnlocked] = useState(FREE_TASKS);

  useEffect(() => {
    const sync = () => {
      setName(localStorage.getItem('ss_name') || 'Worker');
      setBalance(Number(localStorage.getItem('ss_balance') || '0'));
      setCompleted(Number(localStorage.getItem('ss_completed') || '0'));
      setUnlocked(Number(localStorage.getItem('ss_unlocked') || String(FREE_TASKS)));
    };
    sync();
    window.addEventListener('ss:update', sync);
    return () => window.removeEventListener('ss:update', sync);
  }, []);

  const remaining = Math.max(0, unlocked - completed);
  const nextAction = remaining === 0 ? '/subscribe' : '/tasks';

  return <div className="page">
    <section className="hero dashboard-hero">
      <div><div className="eyebrow">SKILLSPACE WORKER DASHBOARD</div><h1>Welcome back, {name}</h1><p>Find online work, complete tasks and track your earnings in one place.</p></div>
      <Link className="btn" href={nextAction}>{remaining === 0 ? 'UNLOCK NEXT 5' : 'BROWSE TASKS'}</Link>
    </section>

    <div className="grid stats-grid">
      <div className="stat"><span className="muted">Available balance</span><strong>{money(balance)}</strong></div>
      <div className="stat"><span className="muted">Tasks completed</span><strong>{completed}</strong></div>
      <div className="stat"><span className="muted">Tasks available to you</span><strong>{remaining}</strong></div>
    </div>

    <div className="section-head"><div><h2>Task categories</h2><p className="muted">{starterTasks.length} starter/test tasks are available — 10 in each category.</p></div><Link className="ghost" href="/tasks">View all tasks</Link></div>
    <div className="category-grid">
      {categories.map((category, i) => <Link className="category-card" href={`/tasks?category=${encodeURIComponent(category)}`} key={category}><span className="category-number">0{i + 1}</span><h3>{category}</h3><p>10 starter tasks</p><span className="more">VIEW TASKS →</span></Link>)}
    </div>

    <div className="grid quick-grid">
      <Link className="card action-card" href="/earnings"><h3>Earnings</h3><p className="muted">Track completed task rewards.</p><span className="more">OPEN →</span></Link>
      <Link className="card action-card" href="/withdraw"><h3>Withdraw</h3><p className="muted">Request a withdrawal from your balance.</p><span className="more">OPEN →</span></Link>
      <Link className="card action-card" href="/support"><h3>Need help?</h3><p className="muted">Contact SkillSpace support.</p><span className="more">GET SUPPORT →</span></Link>
    </div>

    {remaining === 0 && <div className="notice warning">You have completed your current batch of {BATCH_SIZE}. Pay the KSh 260 ($2 USD) access fee to unlock the next 5 tasks.</div>}
  </div>;
}

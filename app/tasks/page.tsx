'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categories, starterTasks, Task, FREE_TASKS, money as dataMoney } from '../../lib/data';
import { money } from '../components/AppShell';

export default function Tasks() {
  const [selected, setSelected] = useState('All');
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [completed, setCompleted] = useState(0);
  const [unlocked, setUnlocked] = useState(FREE_TASKS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelected(params.get('category') || 'All');
    const sync = () => {
      try { setTasks([...starterTasks, ...JSON.parse(localStorage.getItem('ss_tasks') || '[]')].filter((t: Task) => t.active !== false)); } catch { setTasks(starterTasks); }
      setCompleted(Number(localStorage.getItem('ss_completed') || '0'));
      setUnlocked(Number(localStorage.getItem('ss_unlocked') || String(FREE_TASKS)));
    };
    sync();
    window.addEventListener('ss:update', sync);
    return () => window.removeEventListener('ss:update', sync);
  }, []);

  const choose = (category: string) => {
    setSelected(category);
    const url = category === 'All' ? '/tasks' : `/tasks?category=${encodeURIComponent(category)}`;
    window.history.replaceState({}, '', url);
  };

  const shown = selected === 'All' ? tasks : tasks.filter(t => t.category === selected);
  const remaining = Math.max(0, unlocked - completed);

  return <div className="page">
    <div className="hero"><div className="eyebrow">TASK MARKETPLACE</div><h1>Available Tasks</h1><p>Choose a category, open a task, read the brief and submit your work.</p><div className="notice">Completed: <b>{completed}</b> · Current unlock: <b>{unlocked}</b> · Remaining: <b>{remaining}</b>{remaining === 0 && <Link href="/subscribe" className="btn small-btn">UNLOCK NEXT 5</Link>}</div></div>
    <div className="category-filter"><button type="button" className={selected === 'All' ? 'btn' : 'ghost'} onClick={() => choose('All')}>All</button>{categories.map(c => <button type="button" className={selected === c ? 'btn' : 'ghost'} onClick={() => choose(c)} key={c}>{c}</button>)}</div>
    <div className="grid task-grid">{shown.map(task => <div className="card task-card" key={task.id}><div className="between row"><span className="pill">{task.category}</span><span className="price">{money(task.reward)}</span></div><h3>{task.title}</h3><p className="muted">{task.description}</p><div className="task-actions"><span className="muted">Starter test</span><Link className="more" href={`/tasks/${task.id}`}>VIEW TASK</Link></div></div>)}</div>
  </div>;
}

'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { starterTasks, Task, FREE_TASKS } from '../../../lib/data';
import { money } from '../../components/AppShell';

export default function TaskDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const [task, setTask] = useState<Task | null>(null);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [already, setAlready] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let all = starterTasks;
    try { all = [...starterTasks, ...JSON.parse(localStorage.getItem('ss_tasks') || '[]')]; } catch {}
    setTask(all.find(item => item.id === id) || null);
    const completed = Number(localStorage.getItem('ss_completed') || '0');
    const unlocked = Number(localStorage.getItem('ss_unlocked') || String(FREE_TASKS));
    setLocked(completed >= unlocked);
    try { setAlready(JSON.parse(localStorage.getItem('ss_done_tasks') || '[]').includes(id)); } catch { setAlready(false); }
  }, [id]);

  if (!task) return <div className="page"><div className="empty card"><h2>Task not found</h2><Link className="btn" href="/tasks">BACK TO TASKS</Link></div></div>;

  const submit = () => {
    if (already) { setMessage('You have already submitted this task.'); return; }
    if (locked) { router.push('/subscribe'); return; }
    if (!answer.trim()) { setMessage('Please enter your completed work before submitting.'); return; }

    const completed = Number(localStorage.getItem('ss_completed') || '0') + 1;
    const balance = Number(localStorage.getItem('ss_balance') || '0') + task.reward;
    let done: string[] = [];
    try { done = JSON.parse(localStorage.getItem('ss_done_tasks') || '[]'); } catch {}
    done.push(id);
    localStorage.setItem('ss_completed', String(completed));
    localStorage.setItem('ss_balance', String(balance));
    localStorage.setItem('ss_done_tasks', JSON.stringify(done));
    let transactions: unknown[] = [];
    try { transactions = JSON.parse(localStorage.getItem('ss_transactions') || '[]'); } catch {}
    transactions.unshift({ id: Date.now(), type: 'Task reward', amount: task.reward, status: 'Completed', date: new Date().toLocaleString(), note: task.title });
    localStorage.setItem('ss_transactions', JSON.stringify(transactions));
    window.dispatchEvent(new Event('ss:update'));
    setMessage('Submitted successfully. Your reward has been added to earnings.');
    setAlready(true);
    setTimeout(() => router.push('/earnings'), 700);
  };

  return <div className="page">
    <div className="hero"><span className="pill">{task.category}</span><h1>{task.title}</h1><p>{task.description}</p><p className="price">Reward: {money(task.reward)}</p></div>
    <div className="form"><h2>Task Instructions</h2><p className="instructions">{task.instructions}</p>{locked && !already && <div className="notice warning">Your current batch is complete. Pay the KSh 260 ($2 USD) access fee to unlock the next 5 tasks.</div>}{already && <div className="notice success">This task has already been submitted.</div>}<h3>Your submission</h3><textarea rows={10} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Enter your completed work here..." disabled={already}/><div className="row"><button type="button" className="primary" onClick={submit}>{already ? 'ALREADY SUBMITTED' : locked ? 'UNLOCK NEXT 5' : 'SUBMIT TASK'}</button><Link className="ghost" href="/tasks">BACK TO TASKS</Link></div>{message && <div className="notice success">{message}</div>}</div>
  </div>;
}

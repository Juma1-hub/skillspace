'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MIN_WITHDRAWAL_USD, USD_TO_KES } from '../../lib/data';
import { money } from '../components/AppShell';
export default function Earnings() {
  const [balance,setBalance]=useState(0),[count,setCount]=useState(0);
  useEffect(()=>{const sync=()=>{setBalance(Number(localStorage.getItem('ss_balance')||'0'));setCount(Number(localStorage.getItem('ss_completed')||'0'));};sync();window.addEventListener('ss:update',sync);return()=>window.removeEventListener('ss:update',sync)},[]);
  return <div className="page"><div className="hero"><div className="eyebrow">YOUR MONEY</div><h1>Earnings</h1><p>Track rewards from completed tasks and move available funds toward withdrawal.</p></div><div className="grid"><div className="stat"><span className="muted">Available earnings</span><strong>{money(balance)}</strong></div><div className="stat"><span className="muted">Tasks completed</span><strong>{count}</strong></div><div className="stat"><span className="muted">Minimum withdrawal</span><strong>${MIN_WITHDRAWAL_USD.toFixed(2)} USD</strong><small className="muted"> · KSh {(MIN_WITHDRAWAL_USD*USD_TO_KES).toLocaleString()}</small></div></div><div className="card"><h2>What next?</h2><p className="muted">Keep completing tasks to build your balance. Withdrawal requests can be submitted from the Withdraw page.</p><Link className="btn" href="/withdraw">GO TO WITHDRAW</Link></div></div>;
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { defaultContact, USD_TO_KES } from '../../lib/data';

export function money(amount: number) {
  return `$${amount.toFixed(2)} USD · KSh ${(amount * USD_TO_KES).toLocaleString()}`;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState('Worker');
  const [contact, setContact] = useState(defaultContact);

  useEffect(() => {
    const sync = () => {
      setBalance(Number(localStorage.getItem('ss_balance') || '0'));
      setName(localStorage.getItem('ss_name') || 'Worker');
      try {
        setContact({ ...defaultContact, ...JSON.parse(localStorage.getItem('ss_contact') || '{}') });
      } catch {
        setContact(defaultContact);
      }
    };
    sync();
    window.addEventListener('ss:update', sync);
    return () => window.removeEventListener('ss:update', sync);
  }, []);

  const logout = () => {
    localStorage.removeItem('ss_logged');
    window.location.href = '/login';
  };

  const close = () => setOpen(false);

  return (
    <>
      <header className="topbar">
        <div className="top-actions">
          <button type="button" className="menu-btn" onClick={() => setOpen(true)}>☰ Menu</button>
          <Link href="/" className="logo">SKILL<span>SPACE</span></Link>
        </div>
        <div className="top-actions mobile-hide">
          <span className="muted">Welcome back, {name}</span>
          <Link className="ghost" href="/profile">Profile</Link>
        </div>
      </header>

      {open && (
        <>
          <button aria-label="Close menu" className="drawer-backdrop" onClick={close} />
          <aside className="drawer">
            <div className="drawer-head"><strong>SKILL<span>SPACE</span></strong><button type="button" className="ghost" onClick={close}>Close</button></div>
            <div className="balance"><small>Available balance</small><div className="balance-number">{money(balance)}</div></div>
            <nav className="navlist">
              <Link href="/" onClick={close}>Dashboard</Link>
              <Link href="/tasks" onClick={close}>Tasks</Link>
              {['Article Writing','Research','Data Entry','AI & Data','Design','Social Media'].map(category => (
                <Link key={category} href={`/tasks?category=${encodeURIComponent(category)}`} onClick={close}>{category}</Link>
              ))}
              <Link href="/earnings" onClick={close}>Earnings</Link>
              <Link href="/transactions" onClick={close}>Transactions</Link>
              <Link href="/withdraw" onClick={close}>Withdraw</Link>
              <Link href="/profile" onClick={close}>Profile</Link>
              <Link href="/settings" onClick={close}>Settings</Link>
              <Link href="/support" onClick={close}>Support</Link>
              <Link href="/admin" onClick={close}>Admin</Link>
              <button type="button" onClick={logout}>Log Out</button>
            </nav>
            <p className="muted menu-help">{contact.message}</p>
            <a className="muted" href={`mailto:${contact.email}`}>{contact.email}</a>
          </aside>
        </>
      )}
      <main>{children}</main>
      <footer className="footer">Need help? <Link href="/support">Support</Link> · <a href={`mailto:${contact.email}`}>{contact.email}</a> · <span>{contact.whatsapp}</span></footer>
    </>
  );
}

 ```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SupportContact from "../components/SupportContact";
import SupportEmail from "../components/SupportEmail";
import { supabase } from "../lib/supabase";

const categories = [
  ["📝", "Article Writing"],
  ["🔎", "Research"],
  ["📊", "Data Entry"],
  ["🤖", "AI & Data"],
  ["🎨", "Design"],
  ["📣", "Social Media"],
  ["🎙️", "Transcription"],
];

const menuItems = [
  ["🏠", "Dashboard", "/"],
  ["📋", "Tasks", "/tasks"],
  ["📝", "Article Writing", "/tasks?category=Article%20Writing"],
  ["🎙️", "Transcription", "/tasks?category=Transcription"],
  ["📊", "Data Annotation", "/tasks?category=Data%20Annotation"],
  ["🔎", "Research", "/tasks?category=Research"],
  ["📣", "Surveys", "/tasks?category=Surveys"],
  ["💰", "Earnings", "/earnings"],
  ["👛", "Wallet", "/wallet"],
  ["💳", "Transactions", "/transactions"],
  ["💸", "Withdraw", "/withdraw"],
  ["👤", "Profile", "/profile"],
  ["⚙️", "Settings", "/profile"],
  ["💬", "Support", "/support"],
];

export default function Home() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Worker");
  const [initials, setInitials] = useState("W");
  const [submittedCount, setSubmittedCount] = useState(0);
  const [freeTasksUsed, setFreeTasksUsed] = useState(0);
  const [accessUnlocked, setAccessUnlocked] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [balanceUsd, setBalanceUsd] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoadingStats(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const metadata = user.user_metadata || {};

      const name =
        metadata.full_name ||
        metadata.name ||
        [metadata.first_name, metadata.last_name].filter(Boolean).join(" ") ||
        user.email?.split("@")[0] ||
        "Worker";

      const nameParts = String(name)
         const nameParts = displayName.trim().split(/\s+/);
const userInitials =
  nameParts.length >= 2
    ? String(nameParts[0]?.[0] || "") +
      String(nameParts[nameParts.length - 1]?.[0] || "")
    : String(nameParts[0]?.[0] || "W");
      if (!mounted) return;

      setDisplayName(String(name));
      setInitials(userInitials.toUpperCase());

      const { count: submissionCount } = await supabase
        .from("task_submissions")
        .select("*", { count: "exact", head: true })
        .eq("worker_id", user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const { data: transactions } = await supabase
        .from("wallet_transactions")
        .select("amount, type")
        .eq("user_id", user.id);

      let calculatedBalance = 0;

      for (const transaction of transactions || []) {
        const amount = Number(transaction.amount || 0);
        const type = String(transaction.type || "").toLowerCase();

        if (
          type.includes("withdraw") ||
          type.includes("debit") ||
          type.includes("fee")
        ) {
          calculatedBalance -= amount;
        } else {
          calculatedBalance += amount;
        }
      }

      const profileBalance = Number(
        profile?.balance_usd ?? profile?.balance ?? NaN
      );

      if (Number.isFinite(profileBalance)) {
        calculatedBalance = profileBalance;
      }

      const used = Math.min(Number(submissionCount || 0), 5);

      if (mounted) {
        setSubmittedCount(Number(submissionCount || 0));
        setFreeTasksUsed(used);
        setBalanceUsd(Math.max(0, calculatedBalance));
        setAccessUnlocked(Boolean(profile?.access_unlocked));
        setLoadingStats(false);
      }
    };

    loadDashboard();

    const interval = window.setInterval(loadDashboard, 15000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [router]);

  const balanceKes = balanceUsd * 130;
  const freeTasksLeft = Math.max(0, 5 - freeTasksUsed);

  const closeMenu = () => setMenuOpen(false);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="shell">
      {/* Dark overlay behind the sliding menu */}
      {menuOpen && (
        <button
          className="menu-overlay"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      {/* Sliding menu */}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-head">
          <div className="sidebar-title">Menu</div>

          <button
            className="menu-close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            ×
          </button>
        </div>

        {/* Balance is now at the very top of the menu */}
        <div className="menu-balance-card">
          <span className="menu-balance-label">Available Balance</span>

          <strong className="menu-balance-usd">
            {loadingStats ? "Loading..." : `${balanceUsd.toFixed(2)} USD`}
          </strong>

          <span className="menu-balance-kes">
            {loadingStats
              ? "—"
              : `${balanceKes.toLocaleString()} KSh`}
          </span>
        </div>

        <nav className="menu-grid">
          {menuItems.map(([icon, name, href]) => (
            <Link
              key={`${name}-${href}`}
              href={href}
              className="menu-card"
              onClick={closeMenu}
            >
              <span className="menu-card-icon">{icon}</span>
              <span className="menu-card-name">{name}</span>
            </Link>
          ))}
        </nav>

        <button className="menu-logout" onClick={logout}>
          <span>🚪</span>
          <span>Log out</span>
        </button>
      </aside>

      <main className="main">
        {/* Header: Menu button comes BEFORE the logo */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰ Menu
            </button>

            <Link className="top-brand" href="/">
              Skill<span>Space</span>
            </Link>
          </div>

          <div className="user">
            <div className="welcome">
              Welcome, <strong>{displayName}</strong>
            </div>

            <div className="avatar">{initials}</div>
          </div>
        </header>

        <div className="content">
          {/* Welcome area */}
          <section className="hero">
            <div>
              <span className="eyebrow">SKILLSPACE</span>

              <h1>Find work. Build skills. Earn.</h1>

              <p>
                Choose tasks that match your skills and complete them at your
                own pace.
              </p>
            </div>

            <Link href="/tasks" className="primary-button">
              Find Tasks →
            </Link>
          </section>

          {/* Compact dashboard information */}
          <section className="quick-stats">
            <div className="compact-stat stat-one">
              <span>Tasks completed</span>
              <strong>{loadingStats ? "—" : submittedCount}</strong>
            </div>

            <div className="compact-stat stat-two">
              <span>Free tasks left</span>
              <strong>{loadingStats ? "—" : freeTasksLeft}</strong>
            </div>

            <div className="compact-stat stat-three">
              <span>Access</span>
              <strong>
                {loadingStats
                  ? "—"
                  : accessUnlocked
                    ? "Active"
                    : "Free"}
              </strong>
            </div>
          </section>

          {/* Categories */}
          <section className="section">
            <div className="section-head">
              <div>
                <h2>Explore tasks</h2>

                <p className="section-subtitle">
                  Find opportunities that match your skills.
                </p>
              </div>

              <Link href="/tasks" className="browse-link">
                View all →
              </Link>
            </div>

            <div className="cat-grid">
              {categories.map(([icon, name]) => (
                <Link
                  key={name}
                  href={`/tasks?category=${encodeURIComponent(name)}`}
                  className="card cat"
                >
                  <div className="emoji">{icon}</div>

                  <h3>{name}</h3>

                  <p>
                    Find available opportunities in this category.
                  </p>

                  <span className="category-view">
                    View tasks →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Clean horizontal help section */}
          <section className="help-section">
            <div className="help-text">
              <h2>Need Help?</h2>
              <p>Our support team is ready to help.</p>
            </div>

            <div className="help-actions">
              <div className="help-action">
                <span className="help-icon">✉</span>
                <SupportEmail />
              </div>

              <div className="help-action">
                <span className="help-icon">◉</span>
                <SupportContact />
              </div>
            </div>
          </section>

          <footer className="footer">
            <span>© SkillSpace</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
```

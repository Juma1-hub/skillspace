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

      const nameParts = String(name).trim().split(/\s+/).filter(Boolean);
      const userInitials =
        nameParts.length >= 2
          ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
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

  return (
    <div className="shell">
      {menuOpen && (
        <button
          className="menu-overlay"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-head">
          <Link href="/" className="brand" onClick={closeMenu}>
            Skill<span>Space</span>
          </Link>

          <button
            className="menu-close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            ×
          </button>
        </div>

        <nav className="nav">
          <Link href="/" className="nav-link active" onClick={closeMenu}>
            <span>🏠</span> Dashboard
          </Link>
          <Link href="/tasks" className="nav-link" onClick={closeMenu}>
            <span>📋</span> Find Tasks
          </Link>
          <Link href="/earnings" className="nav-link" onClick={closeMenu}>
            <span>💰</span> Earnings
          </Link>
          <Link href="/wallet" className="nav-link" onClick={closeMenu}>
            <span>👛</span> Wallet
          </Link>
          <Link href="/support" className="nav-link" onClick={closeMenu}>
            <span>💬</span> Support
          </Link>
          <Link href="/profile" className="nav-link" onClick={closeMenu}>
            <span>👤</span> My Profile
          </Link>
          <Link href="/profile" className="nav-link" onClick={closeMenu}>
            <span>⚙️</span> Settings
          </Link>
        </nav>

        <button
          className="nav-link logout-button"
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace("/login");
          }}
        >
          <span>🚪</span> Log out
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <Link className="top-brand" href="/">
              Skill<span>Space</span>
            </Link>

            <button
              className="menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              Menu
            </button>

            <div className="crumb">Worker Dashboard</div>
          </div>

          <div className="user">
            <div className="welcome">
              Welcome back, <strong>{displayName}</strong>
            </div>
            <div className="avatar">{initials}</div>
          </div>
        </header>

        <div className="content">
          <section className="hero">
            <div>
              <span className="eyebrow">SKILLSPACE WORKSPACE</span>
              <h1>Find work. Build skills. Earn.</h1>
              <p>
                Choose tasks that match your skills and complete them at your
                own pace.
              </p>
            </div>

            <Link href="/tasks" className="primary-button">
              Find a task →
            </Link>
          </section>

          <div className="grid4">
            <div className="card stat-card">
              <span className="stat-label">Available balance</span>
              <strong>
                {loadingStats ? "Loading..." : `${balanceUsd.toFixed(2)} USD`}
              </strong>
              <small>{balanceKes.toLocaleString()} KSh</small>
            </div>

            <div className="card stat-card">
              <span className="stat-label">Tasks completed</span>
              <strong>{loadingStats ? "—" : submittedCount}</strong>
              <small>Completed submissions</small>
            </div>

            <div className="card stat-card">
              <span className="stat-label">Free tasks left</span>
              <strong>{loadingStats ? "—" : freeTasksLeft}</strong>
              <small>Before platform access</small>
            </div>

            <div className="card stat-card">
              <span className="stat-label">Access status</span>
              <strong>{accessUnlocked ? "Active" : "Free access"}</strong>
              <small>{accessUnlocked ? "Keep working" : "Free tasks available"}</small>
            </div>
          </div>

          <section className="section">
            <div className="section-head">
              <div>
                <h2>Task categories</h2>
                <p className="section-subtitle">
                  Choose a category and find work that matches your skills.
                </p>
              </div>
              <Link href="/tasks">Browse all</Link>
            </div>

            <div className="cat-grid">
              {categories.map(([icon, name]) => (
                <Link
                  key={name}
                  href={`/tasks?category=${encodeURIComponent(name)}`}
                  className="card cat"
                  onClick={closeMenu}
                >
                  <div className="emoji">{icon}</div>
                  <h3>{name}</h3>
                  <p>
                    Beginner-friendly opportunities to build skills and earn.
                  </p>
                  <span className="category-view">View tasks →</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="footer">
            <span>
              Need help? <SupportContact /> · <SupportEmail />
            </span>
            <span>© SkillSpace</span>
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";

const tasks = [
  ["📝","Data Entry Basics","General","$0.92","KSh 120"],
  ["🔎","Web Research","Research","$1.38","KSh 180"],
  ["✍️","Short Article","Writing","$1.92","KSh 250"],
  ["📊","Spreadsheet Update","Data","$1.23","KSh 160"],
  ["🖼️","Image Tagging","AI & Data","$0.77","KSh 100"],
];

export default function Home() {
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
      <div className="sidebar-bottom"><div className="support"><b>Need help?</b><p>Our support team is ready to help.</p><a href="mailto:skillspace@gmail.com">✉ skillspace@gmail.com</a><a href="https://wa.me/254752372102">◉ WhatsApp 0752372102</a></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Worker Dashboard</div><div className="user"><span style={{fontSize:12,color:"#91a3bd"}}>Welcome back</span><div className="avatar">SS</div></div></header>
      <div className="content">
        <section className="hero"><div><div className="eyebrow">Work · Learn · Earn</div><h1>Welcome to SkillSpace</h1><p>Complete simple tasks, build experience and earn from your skills.</p></div><Link className="btn" href="/tasks">Find a task →</Link></section>
        <div className="grid4">
          <div className="card"><div className="metric-label">Available balance</div><div className="metric">KSh 0</div><div className="trend">Ready to grow</div></div>
          <div className="card"><div className="metric-label">Tasks completed</div><div className="metric">0</div><div className="trend">Start your first task</div></div>
          <div className="card"><div className="metric-label">Free tasks left</div><div className="metric">5</div><div className="trend">New worker benefit</div></div>
          <div className="card"><div className="metric-label">Access status</div><div className="metric">Free</div><div className="trend">5 free tasks available</div></div>
        </div>
        <div className="notice" style={{marginTop:0}}>Stage 1 demo exchange rate: <strong>1 USD = KSh 130</strong>. The admin will be able to edit the exchange rate in the Stage 2 backend.</div><div className="section two">
          <div className="card"><div className="section-head"><h2>Recommended tasks</h2><Link href="/tasks">View all</Link></div><div className="task-list">{tasks.map((t,i)=><div className="task" key={i}><div className="task-main"><div className="task-icon">{t[0]}</div><div><h3>{t[1]}</h3><p>{t[2]} · Beginner friendly</p></div></div><div style={{textAlign:"right"}}><div className="reward">{t[3]}</div><div style={{fontSize:11,color:"#91a3bd",marginTop:2}}>{t[4]}</div></div></div>)}</div></div>
          <div className="card"><div className="section-head"><h2>Your free tasks</h2></div><p style={{fontSize:12,color:"#91a3bd"}}>Complete 5 free tasks before the platform access fee applies.</p><div className="progress"><span style={{width:"0%"}}/></div><div className="info-row"><span>Completed</span><strong>0 / 5</strong></div><div className="info-row"><span>After free tasks</span><strong>$2 / KSh 260</strong></div><div style={{marginTop:18}}><Link className="btn secondary" href="/tasks">Start earning</Link></div></div>
        </div>
        <div className="section"><div className="section-head"><h2>Task categories</h2><Link href="/tasks">Browse all</Link></div><div className="cat-grid">
          {[["📝","Writing","10 testing tasks"],["🔎","Research","10 testing tasks"],["📊","Data Entry","10 testing tasks"],["🖼️","AI & Data","10 testing tasks"],["🎨","Design","10 testing tasks"],["📣","Social Media","10 testing tasks"]].map((c,i)=><Link href="/tasks" className="card cat" key={i}><div className="emoji">{c[0]}</div><h3>{c[1]}</h3><p>Beginner-friendly opportunities to build skills and earn.</p><div className="count">{c[2]}</div></Link>)}</div></div>
        <div className="footer">© 2026 <b>SkillSpace</b> · Work · Learn · Earn · <a href="mailto:skillspace@gmail.com">skillspace@gmail.com</a></div>
      </div>
    </main>
  </div>;
}

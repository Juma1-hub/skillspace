import Link from "next/link";

const jobs = [
  ["Article Writing","Create useful, well-structured articles and earn for completed work."],
  ["Transcription","Turn audio and video into accurate written transcripts."],
  ["Data Annotation","Help improve digital products by labeling and reviewing data."],
  ["Surveys","Share your opinions through short online surveys."]
];

export default function Home(){
  return <main>
    <nav className="nav"><div className="brand">Skill<span>Space</span></div>
      <div className="navlinks"><a href="#about">About</a><a href="#jobs">Jobs</a><a href="#support">Support</a><Link className="login" href="/login">Login</Link><Link className="primary small" href="/signup">Register</Link></div>
    </nav>

    <section className="hero">
      <div className="heroText">
        <p className="eyebrow">WORK • LEARN • EARN</p>
        <h1>Find online tasks.<br/><strong>Build your future.</strong></h1>
        <p className="lead">SkillSpace connects workers with online tasks that match their skills. Choose work, complete tasks, and track your earnings from one simple platform.</p>
        <div className="actions"><Link className="primary" href="/signup">Create an Account</Link><a className="outline" href="#jobs">Explore Jobs</a></div>
      </div>
      <div className="heroCard"><div className="cardTop">SkillSpace Dashboard</div><div className="balance"><small>Available Balance</small><b>$124.50</b><span>KSh 16,185</span></div><div className="miniRow"><div><b>24</b><small>Tasks completed</small></div><div><b>6</b><small>Categories</small></div></div></div>
    </section>

    <section className="features"><div><b>Reliable Payments</b><p>Clear task rewards and transparent earnings.</p></div><div><b>Quality Projects</b><p>Access a steady stream of online tasks.</p></div><div><b>Worker Support</b><p>Get help whenever you need it.</p></div><div><b>Simple Platform</b><p>Everything you need in one dashboard.</p></div></section>

    <section id="about" className="section"><p className="eyebrow">ABOUT SKILLSPACE</p><h2>A platform built around workers.</h2><p className="sectionText">SkillSpace is designed to make online work simple. Workers can discover tasks, complete assignments, submit their work, and keep track of their earnings without a complicated interface.</p></section>

    <section id="jobs" className="section jobs"><p className="eyebrow">AVAILABLE JOBS</p><h2>Choose work that fits you.</h2><div className="jobGrid">{jobs.map(([title,desc])=><article key={title}><div className="icon">✦</div><h3>{title}</h3><p>{desc}</p><Link href="/tasks">View Tasks →</Link></article>)}</div></section>

    <section className="cta"><h2>Ready to start earning?</h2><p>Create your SkillSpace account and explore available tasks.</p><Link className="primary" href="/signup">Join SkillSpace</Link></section>

    <footer id="support"><div className="brand">Skill<span>Space</span></div><p>Online tasks made simple.</p><div><a href="/support">Support</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></div><small>© 2026 SkillSpace. All rights reserved.</small></footer>
  </main>
}

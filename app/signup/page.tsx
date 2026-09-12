 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace("/");
      return;
    }

    setMessage("Account created. If email confirmation is enabled, check your email, then log in.");
    setLoading(false);
  }

  return (
    <div className="auth-layout">
      <div className="card auth-card">
        <section className="auth-info">
          <div className="brand">Skill<span>Space</span></div>
          <div className="eyebrow">Get started</div>
          <h2>Turn your skills into online opportunities.</h2>
          <p>SkillSpace is a platform connecting clients who need work done with work providers who can complete tasks online.</p>
          <div className="auth-points">
            <div className="auth-point">✓ Create your worker profile</div>
            <div className="auth-point">✓ Explore different task categories</div>
            <div className="auth-point">✓ Complete tasks and grow your earnings</div>
          </div>
        </section>

        <section className="auth-form">
          <div className="eyebrow">Create an account</div>
          <h1 style={{ fontSize: 30, margin: "8px 0 7px" }}>Join SkillSpace</h1>
          <p style={{ color: "#667892", fontSize: 13, marginBottom: 20 }}>
            Enter your details below to create your worker account.
          </p>

          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="field full">
                <label>Full Name</label>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="field full">
                <label>Email</label>
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
              </div>
              <div className="field full">
                <label>Phone Number</label>
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="07xxxxxxxx" />
              </div>
              <div className="field full">
                <label>Password</label>
                <input required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="At least 6 characters" />
              </div>
              <div className="field full">
                <label>Confirm Password</label>
                <input required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Enter your password again" />
              </div>
            </div>

            {error && <p style={{ color: "#c04b62", fontSize: 12, marginTop: 12 }}>{error}</p>}
            {message && <p style={{ color: "#526783", fontSize: 12, marginTop: 12 }}>{message}</p>}

            <button className="btn" disabled={loading} style={{ marginTop: 18, width: "100%" }}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p style={{ fontSize: 12, color: "#667892", textAlign: "center", marginTop: 15 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#1769ff", fontWeight: 700 }}>Log in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

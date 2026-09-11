"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AdminSettings() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Please log in first."); setLoading(false); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (profile?.role !== "admin") { setError("You do not have permission to open Admin Settings."); setLoading(false); return; }
      const { data, error: settingsError } = await supabase.from("settings").select("support_email,support_whatsapp").limit(1).maybeSingle();
      if (settingsError) setError(settingsError.message);
      else { setEmail(data?.support_email || "skillspace@gmail.com"); setWhatsapp(data?.support_whatsapp || "0752372102"); }
      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true); setMessage(""); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Your session has expired. Please log in again."); setSaving(false); return; }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "admin") { setError("You do not have permission to change settings."); setSaving(false); return; }
    const { data: existing } = await supabase.from("settings").select("id").limit(1).maybeSingle();
    const result = existing?.id
      ? await supabase.from("settings").update({ support_email: email.trim(), support_whatsapp: whatsapp.trim() }).eq("id", existing.id)
      : await supabase.from("settings").insert({ support_email: email.trim(), support_whatsapp: whatsapp.trim() });
    if (result.error) setError(result.error.message); else setMessage("Settings saved successfully. Worker contact details will update automatically.");
    setSaving(false);
  }

  if (loading) return <div className="content"><div className="card page-card">Loading admin settings…</div></div>;
  if (error && !email) return <div className="content"><div className="card page-card"><div className="badge red">Access denied</div><h1 style={{fontSize:28,margin:"10px 0"}}>Admin Settings</h1><p style={{color:"#91a3bd"}}>{error}</p><Link className="btn" style={{display:"inline-block",marginTop:18}} href="/">Back to SkillSpace</Link></div></div>;

  return <div className="shell"><aside className="sidebar"><div className="brand">Skill<span>Space</span></div><div className="nav-title">Administration</div><nav className="nav"><Link href="/">🏠 <span>Worker Site</span></Link><Link href="/admin/tasks">📋 <span>Tasks</span></Link><Link className="active" href="/admin/settings">⚙️ <span>Settings</span></Link></nav></aside><main className="main"><header className="topbar"><div className="crumb">Admin · Settings</div><div className="avatar">AD</div></header><div className="content"><div className="card page-card"><div className="eyebrow">Platform administration</div><h1 style={{fontSize:30,margin:"7px 0 8px"}}>Contact Settings</h1><p style={{color:"#91a3bd",fontSize:13,lineHeight:1.6,marginBottom:22}}>Control the support contact details shown to workers across SkillSpace.</p><div className="form-grid"><div className="field full"><label>Support email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="skillspace@gmail.com" /></div><div className="field full"><label>Support WhatsApp / phone</label><input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="0752372102" /></div></div>{message&&<div className="notice" style={{marginTop:16,color:"#62e39e"}}>{message}</div>}{error&&<div className="notice" style={{marginTop:16,color:"#ff8797"}}>{error}</div>}<button className="btn" style={{marginTop:18}} onClick={save} disabled={saving}>{saving?"Saving…":"Save Changes"}</button></div></div></main></div>;
}

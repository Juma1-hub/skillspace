"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function SupportContact({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("skillspace@gmail.com");
  const [whatsapp, setWhatsapp] = useState("0752372102");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("settings")
        .select("support_email,support_whatsapp")
        .limit(1)
        .maybeSingle();
      if (mounted && data) {
        if (data.support_email) setEmail(data.support_email);
        if (data.support_whatsapp) setWhatsapp(data.support_whatsapp);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const digits = whatsapp.replace(/\D/g, "");
  const waNumber = digits.startsWith("0") ? `254${digits.slice(1)}` : digits;

  if (compact) {
    return <>
      <a href={`mailto:${email}`}>✉ {email}</a>
      <a href={`https://wa.me/${waNumber}`}>◉ WhatsApp {whatsapp}</a>
    </>;
  }

  return <div className="support">
    <b>Need help?</b>
    <p>Our support team is ready to help.</p>
    <a href={`mailto:${email}`}>✉ {email}</a>
    <a href={`https://wa.me/${waNumber}`}>◉ WhatsApp {whatsapp}</a>
  </div>;
}

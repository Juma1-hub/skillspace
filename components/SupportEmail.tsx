"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function SupportEmail() {
  const [email, setEmail] = useState("skillspace@gmail.com");
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("settings").select("support_email").limit(1).maybeSingle();
      if (data?.support_email) setEmail(data.support_email);
    })();
  }, []);
  return <a href={`mailto:${email}`}>{email}</a>;
}

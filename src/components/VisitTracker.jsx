import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function VisitTracker() {
  const location = useLocation();
  const last = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (last.current === path) return;
    last.current = path;

    let cancelled = false;
    (async () => {
      if (!userRef.current) {
        try {
          userRef.current = await base44.auth.me();
        } catch {
          userRef.current = null;
        }
      }
      if (cancelled) return;
      const u = userRef.current;
      try {
        await base44.entities.Visit.create({
          page: path,
          visitor_name: u?.full_name || u?.email || "Guest",
          visitor_email: u?.email || "",
          user_agent: navigator.userAgent,
          referrer: document.referrer || "",
        });
      } catch {
        /* ignore */
      }
    })();

    return () => { cancelled = true; };
  }, [location]);

  return null;
}
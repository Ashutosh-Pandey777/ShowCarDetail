import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (password !== confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    try { const r = await base44.auth.register({ email, password }); base44.auth.setToken(r.access_token); window.location.href = safeReturnTo(); }
    catch (err) { setError(err.message || "Registration failed"); } finally { setLoading(false); }
  };
  return <AuthLayout icon={UserPlus} title="Create your account" subtitle="Sign up to get started" footer={<>
    Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
  </>}>
    {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><Input id="email" type="email" autoComplete="email" autoFocus placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="pl-10 h-12" required/></div></div>
      <div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><Input id="password" type="password" autoComplete="new-password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} className="pl-10 h-12" required/></div></div>
      <div className="space-y-2"><Label htmlFor="confirm">Confirm Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><Input id="confirm" type="password" autoComplete="new-password" placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="pl-10 h-12" required/></div></div>
      <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>{loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Creating...</> : "Create account"}</Button>
    </form>
  </AuthLayout>;
}

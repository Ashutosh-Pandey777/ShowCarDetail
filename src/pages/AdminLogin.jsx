import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.loginViaEmailPassword(email.trim(), password);
      const role = result?.user?.role?.toLowerCase();

      if (role !== "admin") {
        base44.auth.logout();
        setError(role ? `Access denied: this account role is "${role}", but "admin" is required.` : "Login response did not include the user's role. Please contact the administrator.");
        return;
      }

      setAuthenticatedUser(result.user);
      navigate("/admin", { replace: true });
    } catch (err) {
      const message = typeof err?.message === "string" && err.message.trim()
        ? err.message
        : "Login failed. The server did not provide an error message.";
      const status = err?.status ? ` (HTTP ${err.status})` : "";
      setError(`${message}${status}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={ShieldCheck}
      title="Admin Login"
      subtitle="Sign in with your administrator email and password"
      footer={<Link to="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline"><ArrowLeft className="h-4 w-4" /> Back to website</Link>}
    >
      {error && <div role="alert" aria-live="polite" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive break-words">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Admin email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="admin-email" type="email" autoComplete="username" autoFocus placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-10" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="admin-password" type="password" autoComplete="current-password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-10" required />
          </div>
        </div>
        <Button type="submit" className="h-12 w-full font-medium" disabled={loading || !email.trim() || !password}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : "Login to Admin Dashboard"}
        </Button>
      </form>
    </AuthLayout>
  );
}

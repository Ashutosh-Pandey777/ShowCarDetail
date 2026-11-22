import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.loginViaEmailPassword(email.trim(), password);
      if (result?.user?.role !== "admin") {
        base44.auth.logout();
        setError("This account does not have administrator access.");
        return;
      }
      navigate("/admin", { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err?.message || "Unable to sign in. Check your admin email and password.");
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
      <div className="mb-5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
        This login is only for ShowCarDetail administrators. Customer mobile OTP login remains separate.
      </div>
      {error && <div role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
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

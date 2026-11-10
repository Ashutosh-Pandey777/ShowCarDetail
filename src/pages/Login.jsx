import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("mobile");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo();

  const sendOtp = async (e) => {
    e.preventDefault(); setError(""); setNotice("");
    const number = mobile.replace(/\D/g, "").replace(/^91/, "");
    if (!/^[6-9]\d{9}$/.test(number)) { setError("Please enter a valid 10-digit Indian mobile number."); return; }
    setLoading(true);
    try {
      await base44.auth.sendOtp(number);
      setMobile(number); setStep("otp");
      setNotice("OTP sent to +91 " + number + ". Please check your messages.");
    } catch (err) { setError(err.message || "Unable to send OTP. Please try again."); }
    finally { setLoading(false); }
  };

  const verifyOtp = async (e) => {
    e.preventDefault(); setError(""); setNotice("");
    if (!/^\d{6}$/.test(otp)) { setError("Enter the 6-digit OTP."); return; }
    setLoading(true);
    try {
      const result = await base44.auth.verifyMobileOtp(mobile, otp);
      if (result?.access_token) base44.auth.setToken(result.access_token);
      window.location.href = result?.user?.role === "admin" ? "/admin" : returnTo;
    } catch (err) { setError(err.message || "Invalid or expired OTP. Please try again."); }
    finally { setLoading(false); }
  };

  const resendOtp = async () => {
    setError(""); setNotice(""); setLoading(true);
    try { await base44.auth.sendOtp(mobile); setNotice("A new OTP has been sent to +91 " + mobile + "."); setOtp(""); }
    catch (err) { setError(err.message || "Unable to resend OTP."); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout icon={LogIn} title="Login to ShowCarDetail" subtitle={step === "mobile" ? "Continue with your mobile number" : "Verify your mobile number"} footer={<>New to ShowCarDetail? <Link to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")} className="text-primary font-medium hover:underline">Create an account</Link></>}>
      {error && <div role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {notice && <div role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</div>}
      {step === "mobile" ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile number</Label>
            <div className="flex h-12 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
              <span className="border-r px-3 text-sm font-medium text-muted-foreground">+91</span>
              <Input id="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" autoFocus maxLength={10} placeholder="Enter 10-digit mobile number" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g, "").slice(0,10))} className="h-full border-0 shadow-none focus-visible:ring-0" required />
            </div>
            <p className="text-xs text-muted-foreground">We’ll send a one-time password to verify your number.</p>
          </div>
          <Button type="submit" className="h-12 w-full font-medium" disabled={loading || mobile.length !== 10}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Sending OTP...</> : "Send OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter 6-digit OTP</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
              <Input id="otp" type="text" inputMode="numeric" autoComplete="one-time-code" autoFocus maxLength={6} placeholder="••••••" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g, "").slice(0,6))} className="h-12 pl-10 text-center text-xl tracking-[0.5em]" required/>
            </div>
            <p className="text-xs text-muted-foreground">Sent to +91 {mobile}</p>
          </div>
          <Button type="submit" className="h-12 w-full font-medium" disabled={loading || otp.length !== 6}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Verifying...</> : "Verify OTP & Login"}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={()=>{setStep("mobile");setOtp("");setError("");setNotice("");}} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4"/>Change number</button>
            <button type="button" onClick={resendOtp} disabled={loading} className="font-medium text-primary hover:underline">Resend OTP</button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

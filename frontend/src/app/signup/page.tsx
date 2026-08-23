"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../services/auth.service";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) { toast.error("Please fill in all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    try {
      setLoading(true);
      const res = await signup(name, email, password);
      if (!res.success) { toast.error(res.message); return; }
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Account created! Welcome 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || "Signup failed";
      toast.error(message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>

      <div style={{ position: "absolute", top: "-100px", left: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14, 165, 233, 0.08), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-100px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167, 139, 250, 0.08), transparent 70%)", pointerEvents: "none" }} />

      <div className="animate-scaleIn" style={{ width: "440px", background: "rgba(30, 36, 56, 0.5)", border: "1.5px solid rgba(100, 116, 139, 0.2)", borderRadius: "24px", padding: "44px", backdropFilter: "blur(20px)", boxShadow: "0 16px 48px rgba(14, 165, 233, 0.1)", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div onClick={() => router.push("/")} style={{ cursor: "pointer", display: "inline-block" }}>
            <span className="gradient-text-animated" style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px" }}>OmniSchema</span>
          </div>
          <p style={{ color: "#94a3b8", marginTop: "8px", fontSize: "15px" }}>Create your free account</p>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "7px" }}>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "7px" }}>Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "7px" }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleSignup()} className="input-field" />
          <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "5px" }}>Minimum 6 characters</p>
        </div>

        <button onClick={handleSignup} disabled={loading} className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "15px", opacity: loading ? 0.75 : 1 }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Creating account...
            </span>
          ) : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: "22px", color: "#94a3b8", fontSize: "14px" }}>
          Already have an account?{" "}
          <span onClick={() => router.push("/login")} style={{ color: "#0ea5e9", cursor: "pointer", fontWeight: "600" }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = "#06b6d4"}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = "#0ea5e9"}>
            Sign in
          </span>
        </p>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          <span onClick={() => router.push("/")} style={{ color: "#64748b", cursor: "pointer", fontSize: "13px" }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = "#94a3b8"}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = "#64748b"}>
            Back to home
          </span>
        </p>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

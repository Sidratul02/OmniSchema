"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/auth.service";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    try {
      setLoading(true);
      const res = await login(email, password);
      if (!res.success) { toast.error(res.message); return; }
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch { toast.error("Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf6ee 0%, #fdeee0 50%, #fde8d8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>

      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, #fde8cc, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, #fdd8c0, transparent 70%)", pointerEvents: "none" }} />

      <div className="animate-scaleIn" style={{ width: "440px", background: "rgba(255,252,248,0.92)", border: "1.5px solid #e8dcc8", borderRadius: "24px", padding: "44px", backdropFilter: "blur(20px)", boxShadow: "0 16px 48px rgba(120,90,50,0.12)", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div onClick={() => router.push("/")} style={{ cursor: "pointer", display: "inline-block" }}>
            <span className="gradient-text-animated" style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px" }}>OmniSchema</span>
          </div>
          <p style={{ color: "#b09070", marginTop: "8px", fontSize: "15px" }}>Welcome back 👋</p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: "#7a5c38", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "7px" }}>Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label style={{ color: "#7a5c38", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "7px" }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="input-field" />
        </div>

        <button onClick={handleLogin} disabled={loading} className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "15px", opacity: loading ? 0.75 : 1 }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Signing in...
            </span>
          ) : "Sign In →"}
        </button>

        <p style={{ textAlign: "center", marginTop: "22px", color: "#b09070", fontSize: "14px" }}>
          Don't have an account?{" "}
          <span onClick={() => router.push("/signup")} style={{ color: "#c4782a", cursor: "pointer", fontWeight: "600" }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = "#d4884a"}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = "#c4782a"}>
            Sign up free
          </span>
        </p>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          <span onClick={() => router.push("/")} style={{ color: "#d9c9b0", cursor: "pointer", fontSize: "13px" }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = "#b09070"}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = "#d9c9b0"}>
            ← Back to home
          </span>
        </p>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

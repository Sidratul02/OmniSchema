"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const features = [
    { icon: "🎨", title: "Visual Canvas", desc: "Drag and drop tables, define fields, and draw relations on an interactive canvas.", bg: "#fff8ee" },
    { icon: "⚡", title: "Multi-Format Export", desc: "Generate SQL, Prisma, Drizzle, Sequelize, and TypeScript from one schema.", bg: "#fff3ee" },
    { icon: "🔗", title: "Smart Relations", desc: "Define one-to-many and many-to-many relations with animated visual connectors.", bg: "#eefaf8" },
    { icon: "🛡️", title: "Type Safety", desc: "Every field has a datatype. Export fully typed TypeScript interfaces instantly.", bg: "#fff8ee" },
    { icon: "💾", title: "Persistent Storage", desc: "Your schemas are saved to PostgreSQL — never lose your work again.", bg: "#fff3ee" },
    { icon: "🚀", title: "Instant Preview", desc: "See generated code update live as you build your schema in real time.", bg: "#eefaf8" }
  ];

  const formats = ["PostgreSQL", "MySQL", "SQLite", "Prisma", "Drizzle", "Sequelize", "Mongoose", "TypeScript"];

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6ee", color: "#3d2e1e", overflowX: "hidden" }}>

      {/* BG BLOBS */}
      <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, #fde8cc 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-100px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, #fde0d0 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* NAVBAR */}
      <nav className="glass animate-fadeInDown" style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 60px"
      }}>
        <span className="gradient-text-animated" style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>
          OmniSchema
        </span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => router.push("/login")} className="btn-secondary" style={{ padding: "9px 22px", fontSize: "14px" }}>
            Sign In
          </button>
          <button onClick={() => router.push("/signup")} className="btn-primary animate-pulse-soft" style={{ padding: "9px 22px", fontSize: "14px" }}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "100px 20px 70px", position: "relative", zIndex: 1 }}>

        <div className="animate-fadeIn" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 18px", marginBottom: "24px",
          background: "white", border: "1.5px solid #e8dcc8",
          borderRadius: "999px", fontSize: "13px", color: "#a07840",
          boxShadow: "0 2px 12px rgba(180,130,80,0.08)"
        }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#c4782a", display: "inline-block" }} />
          Visual Database Schema Builder — Now with PostgreSQL persistence
        </div>

        <h1 className="animate-fadeIn delay-1" style={{ fontSize: "68px", fontWeight: "900", lineHeight: 1.05, margin: "0 0 20px", letterSpacing: "-2.5px", color: "#2c1a0e" }}>
          Design Databases
          <br />
          <span className="gradient-text-animated">Visually.</span>
        </h1>

        <p className="animate-fadeIn delay-2" style={{ fontSize: "19px", color: "#8a6848", maxWidth: "560px", marginBottom: "40px", lineHeight: 1.75 }}>
          Build, visualize, and export database schemas for any stack — all from a beautiful drag-and-drop canvas.
        </p>

        <div className="animate-fadeIn delay-3" style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => router.push("/signup")} className="btn-primary" style={{ padding: "15px 36px", fontSize: "16px" }}>
            Start Building Free
          </button>
          <button onClick={() => router.push("/login")} className="btn-secondary" style={{ padding: "15px 36px", fontSize: "16px" }}>
            Sign In
          </button>
        </div>

        <div className="animate-fadeIn delay-4" style={{ display: "flex", gap: "48px", marginTop: "60px" }}>
          {[["8+", "Export Formats"], ["∞", "Tables & Relations"], ["100%", "Type Safe"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div className="gradient-text" style={{ fontSize: "30px", fontWeight: "800" }}>{num}</div>
              <div style={{ color: "#b09070", fontSize: "13px", marginTop: "4px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: "0 60px 80px", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ textAlign: "center", fontSize: "38px", fontWeight: "800", marginBottom: "10px", letterSpacing: "-1px", color: "#2c1a0e" }}>
          Everything you need
        </h2>
        <p style={{ textAlign: "center", color: "#b09070", marginBottom: "44px", fontSize: "16px" }}>
          A complete toolkit for database schema design and code generation
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
          {features.map((f, i) => (
            <div key={f.title} className={`card animate-fadeIn delay-${i + 1}`} style={{ padding: "28px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "16px" }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "#2c1a0e" }}>{f.title}</h3>
              <p style={{ color: "#b09070", fontSize: "14px", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FORMATS */}
      <div style={{ textAlign: "center", padding: "20px 60px 80px", position: "relative", zIndex: 1 }}>
        <p style={{ color: "#d9c9b0", marginBottom: "16px", fontSize: "11px", letterSpacing: "2.5px", fontWeight: "700" }}>SUPPORTED FORMATS</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          {formats.map((f) => (
            <span key={f} style={{ padding: "8px 20px", background: "white", border: "1.5px solid #e8dcc8", borderRadius: "999px", fontSize: "13px", color: "#8a6848", fontWeight: "500", transition: "all 0.2s ease", cursor: "default", boxShadow: "0 2px 8px rgba(120,90,50,0.06)" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "#c4a882"; (e.target as HTMLElement).style.background = "#fdf0e0"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "#e8dcc8"; (e.target as HTMLElement).style.background = "white"; }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        margin: "0 60px 100px", borderRadius: "24px",
        background: "linear-gradient(135deg, #fde8cc, #fdd8c0)",
        border: "1.5px solid #e8dcc8", padding: "60px",
        textAlign: "center", position: "relative", zIndex: 1,
        boxShadow: "0 8px 40px rgba(120,90,50,0.1)"
      }}>
        <h2 style={{ fontSize: "38px", fontWeight: "800", marginBottom: "14px", letterSpacing: "-1px", color: "#2c1a0e" }}>
          Ready to build your schema?
        </h2>
        <p style={{ color: "#8a6848", marginBottom: "32px", fontSize: "16px" }}>
          Join thousands of developers designing databases visually.
        </p>
        <button onClick={() => router.push("/signup")} className="btn-primary" style={{ padding: "15px 40px", fontSize: "16px" }}>
          Get Started for Free →
        </button>
      </div>

    </div>
  );
}

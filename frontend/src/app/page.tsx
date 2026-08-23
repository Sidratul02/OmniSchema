"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const features = [
    { icon: "🎨", title: "Visual Canvas", desc: "Drag and drop tables, define fields, and draw relations on a beautiful interactive canvas.", color: "rgba(14,165,233,0.15)" },
    { icon: "⚡", title: "Multi-Format Export", desc: "Generate SQL, Prisma, Drizzle, Sequelize, Mongoose and TypeScript from one single schema.", color: "rgba(167,139,250,0.15)" },
    { icon: "🔗", title: "Smart Relations", desc: "Define one-to-many and many-to-many relations with animated visual edge connectors.", color: "rgba(34,197,94,0.15)" },
    { icon: "🛡️", title: "Type Safety", desc: "Every field has a strict datatype. Export fully typed TypeScript interfaces instantly.", color: "rgba(251,191,36,0.15)" },
    { icon: "💾", title: "Persistent Storage", desc: "Your schemas are saved to PostgreSQL — always available, never lost.", color: "rgba(6,182,212,0.15)" },
    { icon: "✨", title: "AI Generation", desc: "Describe your app in plain English and let AI generate the full schema instantly.", color: "rgba(244,114,182,0.15)" },
  ];

  const formats = [
    { name: "PostgreSQL", color: "#60a5fa" },
    { name: "MySQL", color: "#34d399" },
    { name: "SQLite", color: "#a78bfa" },
    { name: "Prisma", color: "#f472b6" },
    { name: "Drizzle", color: "#fbbf24" },
    { name: "Sequelize", color: "#0ea5e9" },
    { name: "Mongoose", color: "#f87171" },
    { name: "TypeScript", color: "#818cf8" },
  ];

  const steps = [
    { num: "01", title: "Describe your schema", desc: "Type a prompt like 'Create an ecommerce database' or manually add tables and fields." },
    { num: "02", title: "Visualize instantly", desc: "Watch your schema appear as an interactive node graph with relations and field types." },
    { num: "03", title: "Export any format", desc: "Pick your target — PostgreSQL, Prisma, Drizzle, Mongoose — and copy the generated code." },
  ];

  const faqs = [
    { q: "Is OmniSchema free to use?", a: "Yes, completely free. Sign up and start building your schemas instantly." },
    { q: "What databases are supported?", a: "PostgreSQL, MySQL, SQLite, MongoDB (Mongoose), Prisma, Drizzle, Sequelize, and TypeScript interfaces." },
    { q: "Can AI generate my full schema?", a: "Yes! Just describe your app and the AI generates a complete schema with entities, fields, and relations." },
    { q: "Is my data stored securely?", a: "Your schemas are stored in a PostgreSQL database. We never share or sell your data." },
    { q: "Can I export the generated code?", a: "Yes, just click Copy Code and paste it directly into your project." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f1419", color: "#e2e8f0", overflowX: "hidden" }}>

      {/* BG BLOBS */}
      <div style={{ position: "fixed", top: "-200px", right: "-100px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-150px", left: "-200px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "800px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.03) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* NAVBAR */}
      <nav className="glass animate-fadeInDown" style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 60px" }}>
        <span className="gradient-text-animated" style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>OmniSchema</span>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {["Features", "How it Works", "Formats", "FAQ"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = "#e2e8f0"}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = "#94a3b8"}>
              {item}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => router.push("/login")} className="btn-secondary" style={{ padding: "10px 22px", fontSize: "14px", position: "relative", zIndex: 101 }}>Sign In</button>
          <button onClick={() => router.push("/signup")} className="btn-primary" style={{ padding: "10px 22px", fontSize: "14px", position: "relative", zIndex: 101 }}>Get Started →</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "110px 20px 80px", position: "relative", zIndex: 2 }}>
        <div className="animate-fadeIn" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 18px", marginBottom: "28px", background: "rgba(14,165,233,0.1)", border: "1.5px solid rgba(14,165,233,0.3)", borderRadius: "999px", fontSize: "13px", color: "#0ea5e9" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0ea5e9", display: "inline-block", animation: "pulse-subtle 2s infinite" }} />
          ✨ Now with AI-powered schema generation
        </div>

        <h1 className="animate-fadeIn delay-1" style={{ fontSize: "76px", fontWeight: "900", lineHeight: 1.0, margin: "0 0 24px", letterSpacing: "-3px", color: "#f1f5f9" }}>
          Design Databases
          <br />
          <span className="gradient-text-animated">Visually & Instantly.</span>
        </h1>

        <p className="animate-fadeIn delay-2" style={{ fontSize: "19px", color: "#94a3b8", maxWidth: "600px", marginBottom: "48px", lineHeight: 1.75 }}>
          The universal schema builder — visualize, design, and export database schemas for any stack from a single beautiful canvas.
        </p>

        <div className="animate-fadeIn delay-3" style={{ display: "flex", gap: "14px", marginBottom: "80px", position: "relative", zIndex: 10 }}>
          <button onClick={() => router.push("/signup")} className="btn-primary" style={{ padding: "16px 44px", fontSize: "16px", fontWeight: "700" }}>
            Start Building Free
          </button>
          <button onClick={() => router.push("/login")} className="btn-secondary" style={{ padding: "16px 44px", fontSize: "16px" }}>
            Sign In
          </button>
        </div>

        {/* STATS */}
        <div className="animate-fadeIn delay-4" style={{ display: "flex", gap: "64px" }}>
          {[["8+", "Export Formats"], ["∞", "Tables & Relations"], ["100%", "Type Safe"], ["AI", "Powered"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div className="gradient-text" style={{ fontSize: "30px", fontWeight: "900" }}>{num}</div>
              <div style={{ color: "#475569", fontSize: "12px", marginTop: "6px", fontWeight: "600", letterSpacing: "0.5px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CODE PREVIEW */}
      <div style={{ padding: "0 60px 100px", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ background: "#1a1f2e", border: "1.5px solid rgba(100,116,139,0.2)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
          <div style={{ padding: "12px 20px", background: "rgba(14,165,233,0.08)", borderBottom: "1px solid rgba(100,116,139,0.15)", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#fbbf24" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ marginLeft: "12px", color: "#475569", fontSize: "13px" }}>schema.sql — generated by OmniSchema</span>
          </div>
          <pre style={{ padding: "28px", margin: 0, fontSize: "13px", color: "#cbd5e1", lineHeight: 1.8, fontFamily: "JetBrains Mono, monospace", overflow: "auto" }}>
{`-- Generated by OmniSchema ✨
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending'
);

ALTER TABLE orders ADD COLUMN product_id UUID REFERENCES products(id);`}
          </pre>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ padding: "0 60px 100px", maxWidth: "1300px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <p style={{ color: "#0ea5e9", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", marginBottom: "12px" }}>FEATURES</p>
          <h2 style={{ fontSize: "44px", fontWeight: "900", letterSpacing: "-1.5px", color: "#f1f5f9", marginBottom: "12px" }}>Everything you need</h2>
          <p style={{ color: "#64748b", fontSize: "17px", maxWidth: "500px", margin: "0 auto" }}>A complete toolkit for database schema design and code generation</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {features.map((f, i) => (
            <div key={f.title} className="card" style={{ padding: "32px", animationDelay: `${0.1 * i}s` }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "18px" }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "10px", color: "#f1f5f9" }}>{f.title}</h3>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" style={{ padding: "0 60px 100px", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ color: "#a78bfa", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", marginBottom: "12px" }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: "44px", fontWeight: "900", letterSpacing: "-1.5px", color: "#f1f5f9", marginBottom: "12px" }}>Three steps to your schema</h2>
          <p style={{ color: "#64748b", fontSize: "17px" }}>From idea to production-ready code in minutes</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
          {steps.map((step, i) => (
            <div key={step.num} style={{ textAlign: "center", position: "relative" }}>
              {i < steps.length - 1 && (
                <div style={{ position: "absolute", top: "28px", left: "calc(50% + 60px)", width: "calc(100% - 20px)", height: "1px", background: "linear-gradient(to right, rgba(14,165,233,0.4), rgba(167,139,250,0.4))", zIndex: 0 }} />
              )}
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(167,139,250,0.2))", border: "1.5px solid rgba(14,165,233,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative", zIndex: 1 }}>
                <span className="gradient-text" style={{ fontSize: "16px", fontWeight: "800" }}>{step.num}</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9", marginBottom: "10px" }}>{step.title}</h3>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.8, maxWidth: "260px", margin: "0 auto" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI SECTION */}
      <div style={{ padding: "0 60px 100px", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(167,139,250,0.08))", border: "1.5px solid rgba(167,139,250,0.2)", borderRadius: "24px", padding: "60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <p style={{ color: "#a78bfa", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", marginBottom: "12px" }}>AI POWERED</p>
            <h2 style={{ fontSize: "38px", fontWeight: "900", letterSpacing: "-1px", color: "#f1f5f9", marginBottom: "18px", lineHeight: 1.1 }}>
              Generate schemas with a single prompt
            </h2>
            <p style={{ color: "#64748b", fontSize: "16px", lineHeight: 1.8, marginBottom: "28px" }}>
              Just describe your application and OmniSchema's AI will generate a complete database schema — entities, fields, datatypes, and relations — in seconds.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Supports GPT-3.5 and GPT-4", "Generates valid Universal Schema JSON", "Saves directly to your canvas", "Fully editable after generation"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#22c55e", fontSize: "11px" }}>✓</span>
                  </div>
                  <span style={{ color: "#94a3b8", fontSize: "14px" }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => router.push("/signup")} className="btn-primary" style={{ padding: "14px 32px", fontSize: "15px", marginTop: "32px", position: "relative", zIndex: 10 }}>
              Try AI Generation →
            </button>
          </div>
          <div style={{ background: "#1a1f2e", border: "1.5px solid rgba(100,116,139,0.2)", borderRadius: "14px", padding: "24px" }}>
            <div style={{ marginBottom: "14px", color: "#475569", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>AI PROMPT</div>
            <div style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px", color: "#e2e8f0", fontSize: "14px", lineHeight: 1.6 }}>
              "Create an ecommerce database with users, products, orders and reviews"
            </div>
            <div style={{ color: "#475569", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", marginBottom: "14px" }}>GENERATED SCHEMA</div>
            <pre style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: 1.7, fontFamily: "JetBrains Mono, monospace" }}>
{`{
  "entities": [
    { "id": "users", "name": "Users" },
    { "id": "products", "name": "Products" },
    { "id": "orders", "name": "Orders" },
    { "id": "reviews", "name": "Reviews" }
  ],
  "relations": [
    { "from": "users", "to": "orders",
      "type": "one-to-many" },
    { "from": "products", "to": "reviews",
      "type": "one-to-many" }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* FORMATS */}
      <div id="formats" style={{ textAlign: "center", padding: "0 60px 100px", position: "relative", zIndex: 1 }}>
        <p style={{ color: "#34d399", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", marginBottom: "12px" }}>SUPPORTED FORMATS</p>
        <h2 style={{ fontSize: "44px", fontWeight: "900", letterSpacing: "-1.5px", color: "#f1f5f9", marginBottom: "12px" }}>One schema. Every stack.</h2>
        <p style={{ color: "#64748b", fontSize: "17px", marginBottom: "48px" }}>Export to any database or ORM with a single click</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap", maxWidth: "700px", margin: "0 auto" }}>
          {formats.map((f) => (
            <div key={f.name} style={{ padding: "12px 24px", background: "rgba(30,36,56,0.5)", border: `1.5px solid ${f.color}30`, borderRadius: "12px", fontSize: "14px", color: f.color, fontWeight: "600", transition: "all 0.2s ease", cursor: "default", boxShadow: `0 4px 16px ${f.color}10` }}
              onMouseEnter={(e) => { (e.currentTarget.style.background = `${f.color}15`); (e.currentTarget.style.borderColor = `${f.color}60`); (e.currentTarget.style.transform = "translateY(-2px)"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.background = "rgba(30,36,56,0.5)"); (e.currentTarget.style.borderColor = `${f.color}30`); (e.currentTarget.style.transform = "translateY(0)"); }}>
              {f.name}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ padding: "0 60px 100px", maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <p style={{ color: "#f472b6", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", marginBottom: "12px" }}>FAQ</p>
          <h2 style={{ fontSize: "44px", fontWeight: "900", letterSpacing: "-1.5px", color: "#f1f5f9" }}>Frequently asked questions</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq) => (
            <div key={faq.q} className="card" style={{ padding: "24px 28px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9", marginBottom: "10px" }}>{faq.q}</h3>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin: "0 60px 120px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(167,139,250,0.1))", border: "1.5px solid rgba(14,165,233,0.2)", padding: "80px 60px", textAlign: "center", position: "relative", zIndex: 1, boxShadow: "0 8px 40px rgba(14,165,233,0.08)" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
        <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "16px", letterSpacing: "-1.5px", color: "#f1f5f9" }}>
          Start building today.
        </h2>
        <p style={{ color: "#64748b", marginBottom: "36px", fontSize: "17px", maxWidth: "480px", margin: "0 auto 36px", lineHeight: 1.7 }}>
          Free forever. No credit card required. Start designing your database schema in seconds.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", position: "relative", zIndex: 10 }}>
          <button onClick={() => router.push("/signup")} className="btn-primary" style={{ padding: "16px 44px", fontSize: "16px", fontWeight: "700" }}>
            Get Started for Free →
          </button>
          <button onClick={() => router.push("/login")} className="btn-secondary" style={{ padding: "16px 44px", fontSize: "16px" }}>
            Sign In
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(100,116,139,0.15)", padding: "40px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <span className="gradient-text-animated" style={{ fontSize: "18px", fontWeight: "800" }}>OmniSchema</span>
        <p style={{ color: "#334155", fontSize: "13px" }}>© 2025 OmniSchema. Built for developers.</p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Features", "How it Works", "FAQ"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} style={{ color: "#334155", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = "#94a3b8"}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = "#334155"}>
              {item}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}
